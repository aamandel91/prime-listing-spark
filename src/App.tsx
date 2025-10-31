import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import CityTemplate from "./pages/CityTemplate";
import Counties from "./pages/Counties";
import SEOSettings from "./pages/admin/SEOSettings";
import Cities from "./pages/Cities";
import FeaturedCities from "./pages/admin/FeaturedCities";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdvancedSearch from "./pages/AdvancedSearch";
import Auth from "./pages/Auth";
import BlogMigration from "./pages/admin/BlogMigration";
import CityContentGenerator from "./pages/admin/CityContentGenerator";
import CompetitorAnalysis from "./pages/admin/CompetitorAnalysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/advanced-search" element={<AdvancedSearch />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/blog-migration" element={<BlogMigration />} />
            <Route path="/admin/city-content" element={<CityContentGenerator />} />
            <Route path="/admin/competitor-analysis" element={<CompetitorAnalysis />} />
            <Route path="/admin/seo-settings" element={<SEOSettings />} />
            <Route path="/cities" element={<Cities />} />
          <Route path="/cities/:citySlug" element={<CityTemplate />} />
          <Route path="/counties" element={<Counties />} />
          <Route path="/counties/:countySlug" element={<CityTemplate />} />
            <Route path="/admin/featured-cities" element={<FeaturedCities />} />
            <Route path="/:citySlug/:filter" element={<CityTemplate />} />
            <Route path="/:citySlug" element={<CityTemplate />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
