import { useEffect, useState } from "react";
import { useParams, Navigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ModuleRenderer } from "@/components/cms/ModuleRenderer";
import { ContentPageModule } from "@/types/contentModules";
import { SidebarRenderer } from "@/components/sidebar/SidebarRenderer";
import { Loader2 } from "lucide-react";
import { BreadcrumbSEO } from "@/components/ui/breadcrumb-seo";
import { DynamicListingsSection } from "@/components/cms/DynamicListingsSection";
import EnhancedSearchBarV2 from "@/components/search/EnhancedSearchBarV2";

export default function DynamicContentPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPage = async () => {
      const { data, error } = await supabase
        .from("content_pages")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPage(data);
      }
      setLoading(false);
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return <Navigate to="/404" replace />;
  }

  const modules: ContentPageModule[] = page.modules || [];
  const hasApiFilters = page.api_filters && Object.keys(page.api_filters).length > 0;
  
  // Merge URL search params with page api_filters
  const mergedFilters = hasApiFilters ? {
    ...page.api_filters,
    ...(searchParams.get('minPrice') && { minPrice: Number(searchParams.get('minPrice')) }),
    ...(searchParams.get('maxPrice') && { maxPrice: Number(searchParams.get('maxPrice')) }),
    ...(searchParams.get('beds') && { minBedrooms: Number(searchParams.get('beds')) }),
    ...(searchParams.get('baths') && { minBathrooms: Number(searchParams.get('baths')) }),
    ...(searchParams.get('propertyType') && { propertyType: searchParams.get('propertyType')?.split(',') }),
    ...(searchParams.get('minSqft') && { minSqft: Number(searchParams.get('minSqft')) }),
    ...(searchParams.get('maxSqft') && { maxSqft: Number(searchParams.get('maxSqft')) }),
    ...(searchParams.get('minYearBuilt') && { minYearBuilt: Number(searchParams.get('minYearBuilt')) }),
    ...(searchParams.get('maxYearBuilt') && { maxYearBuilt: Number(searchParams.get('maxYearBuilt')) }),
    ...(searchParams.get('pool') && { pool: searchParams.get('pool') === 'true' }),
    ...(searchParams.get('waterfront') && { waterfront: searchParams.get('waterfront') === 'true' }),
  } : null;

  return (
    <>
      <Helmet>
        <title>{page.meta_title || page.title}</title>
        {page.meta_description && <meta name="description" content={page.meta_description} />}
        {page.meta_keywords && <meta name="keywords" content={page.meta_keywords} />}
        {page.robots_indexing && <meta name="robots" content={page.robots_indexing} />}
        {page.page_priority && (
          <meta property="page:priority" content={page.page_priority.toString()} />
        )}
        {page.default_image && <meta property="og:image" content={page.default_image} />}
      </Helmet>

      {!page.hide_header && <Navbar />}

      {!page.hide_breadcrumbs && (
        <div className="container mx-auto px-4 py-4">
          <BreadcrumbSEO items={[{ label: page.title, href: `/pages/${slug}` }]} />
        </div>
      )}

      <main className={page.full_width ? "w-full" : "container mx-auto px-4 py-8"}>
        <div className={page.display_sidebar ? "flex gap-8" : ""}>
          <div className="flex-1 space-y-12">
            {modules.map((module) => (
              <ModuleRenderer key={module.id} module={module} />
            ))}
            
            {hasApiFilters && (
              <>
                <div className="bg-card p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Refine Your Search</h3>
                  <EnhancedSearchBarV2 />
                </div>
                
                <DynamicListingsSection 
                  apiFilters={mergedFilters!}
                  title={`Properties in ${page.title}`}
                />
              </>
            )}
          </div>
          
          {page.display_sidebar && page.sidebar_config && (
            <SidebarRenderer 
              sections={page.sidebar_config as any} 
              context={{ city: page.title, state: 'FL' }}
            />
          )}
        </div>
      </main>

      {!page.hide_footer && <Footer />}
    </>
  );
}
