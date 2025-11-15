import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { ScrollToTop } from "./components/ScrollToTop";
import { useAgentSubdomain } from "./hooks/useAgentSubdomain";
import { AdminLayout } from "./components/admin/AdminLayout";
import Index from "./pages/Index";
import AgentDirectory from "./pages/AgentDirectory";
import Listings from "./pages/Listings";
import PropertyDetail from "./pages/PropertyDetail";
import CityTemplate from "./pages/CityTemplate";
import Counties from "./pages/Counties";
import SEOSettings from "./pages/admin/SEOSettings";
import GlobalSiteSettings from "./pages/admin/GlobalSiteSettings";
import SiteLayoutSettings from "./pages/admin/SiteLayoutSettings";
import Cities from "./pages/Cities";
import FeaturedCities from "./pages/admin/FeaturedCities";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdvancedSearch from "./pages/AdvancedSearch";
import Auth from "./pages/Auth";
import BlogMigration from "./pages/admin/BlogMigration";
import CityContentGenerator from "./pages/admin/CityContentGenerator";
import CompetitorAnalysis from "./pages/admin/CompetitorAnalysis";
import SidebarManagement from "./pages/admin/SidebarManagement";
import NavigationManagement from "./pages/admin/NavigationManagement";
import ContentStrategyGenerator from "./pages/admin/ContentStrategyGenerator";
import PropertyTypePages from "./pages/admin/PropertyTypePages";
import NeighborhoodPages from "./pages/admin/NeighborhoodPages";
import BlogContentGenerator from "./pages/admin/BlogContentGenerator";
import InternalLinkingManager from "./pages/admin/InternalLinkingManager";
import ListingEnhancements from "./pages/admin/ListingEnhancements";
import Analytics from "./pages/admin/Analytics";
import RoleManagement from "./pages/admin/RoleManagement";
import Leads from "./pages/admin/Leads";
import AgentManagement from "./pages/admin/AgentManagement";
import TestimonialsManagement from "./pages/admin/TestimonialsManagement";
import VideosManagement from "./pages/admin/VideosManagement";
import ContentPages from "./pages/admin/ContentPages";
import PropertyDetailLayout from "./pages/admin/PropertyDetailLayout";
import AgentDetail from "./pages/AgentDetail";
import Sell from "./pages/Sell";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Accessibility from "./pages/Accessibility";
import DmcaNotice from "./pages/DmcaNotice";
import CityPropertyType from "./pages/CityPropertyType";
import LocationImport from "./pages/admin/LocationImport";
import ListingDataExtractor from "./pages/admin/ListingDataExtractor";
import ZipCodePage from "./pages/ZipCodePage";
import NeighborhoodPage from "./pages/NeighborhoodPage";
import DynamicContentPage from "./pages/DynamicContentPage";
import BulkPageGenerator from "./pages/admin/BulkPageGenerator";
import { useTrackingCodes } from "./hooks/useTrackingCodes";
import { ComparisonBar } from "./components/properties/ComparisonBar";

import { useEffect } from "react";

const queryClient = new QueryClient();

// Component to load tracking codes
const TrackingCodesLoader = () => {
  useTrackingCodes();
  return null;
};

const RecoveryRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAgentSubdomain } = useAgentSubdomain();

  useEffect(() => {
    if (location.hash.includes('type=recovery') && location.pathname !== '/auth') {
      navigate('/auth' + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return (
    <>
      {isAgentSubdomain && (
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
      )}
      <ScrollToTop />
      <ComparisonBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/agents" element={<AgentDirectory />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/advanced-search" element={<AdvancedSearch />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/sell" element={<Sell />} />
        
        {/* Admin CMS Routes - All under AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="global-site-settings" element={<GlobalSiteSettings />} />
          <Route path="site-layout-settings" element={<SiteLayoutSettings />} />
          <Route path="seo-settings" element={<SEOSettings />} />
          <Route path="featured-cities" element={<FeaturedCities />} />
          <Route path="property-type-pages" element={<PropertyTypePages />} />
          <Route path="neighborhood-pages" element={<NeighborhoodPages />} />
          <Route path="blog-content-generator" element={<BlogContentGenerator />} />
          <Route path="internal-linking" element={<InternalLinkingManager />} />
          <Route path="content-pages" element={<ContentPages />} />
          <Route path="blog-migration" element={<BlogMigration />} />
          <Route path="testimonials" element={<TestimonialsManagement />} />
          <Route path="videos" element={<VideosManagement />} />
          <Route path="location-import" element={<LocationImport />} />
          <Route path="listing-data-extractor" element={<ListingDataExtractor />} />
          <Route path="listing-enhancements" element={<ListingEnhancements />} />
          <Route path="agents" element={<AgentManagement />} />
          <Route path="leads" element={<Leads />} />
          <Route path="role-management" element={<RoleManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="competitor-analysis" element={<CompetitorAnalysis />} />
          <Route path="content-strategy" element={<ContentStrategyGenerator />} />
          <Route path="city-content" element={<CityContentGenerator />} />
          <Route path="sidebar-management" element={<SidebarManagement />} />
          <Route path="navigation-management" element={<NavigationManagement />} />
          <Route path="property-detail-layout" element={<PropertyDetailLayout />} />
          <Route path="bulk-page-generator" element={<BulkPageGenerator />} />
        </Route>
        
        {/* Public Routes - More specific routes first */}
        <Route path="/agents/:agentId" element={<AgentDetail />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/cities/:citySlug/:propertyType" element={<CityPropertyType />} />
        <Route path="/cities/:citySlug" element={<CityTemplate />} />
        <Route path="/counties" element={<Counties />} />
        <Route path="/zip/:zipcode" element={<ZipCodePage />} />
        <Route path="/neighborhood/:slug" element={<NeighborhoodPage />} />
        <Route path="/counties/:countySlug" element={<CityTemplate />} />
        
        {/* Direct MLS number routing - primary format */}
        <Route path="/listing/:mlsNumber" element={<PropertyDetail />} />
        
        {/* Old property URL format - backward compatibility */}
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/property/:id/openhouse" element={<PropertyDetail />} />
        
        {/* City routes with filters */}
        <Route path="/:citySlug/:filter" element={<CityTemplate />} />
        <Route path="/:citySlug" element={<CityTemplate />} />
        
        {/* New SEO-friendly property URL format with /home/ prefix */}
        <Route path="/home/:propertySlug/" element={<PropertyDetail />} />
        <Route path="/home/:propertySlug" element={<PropertyDetail />} />
        <Route path="/home/:id/openhouse" element={<PropertyDetail />} />
        
        {/* Legal Pages */}
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/dmca-notice" element={<DmcaNotice />} />
        
        {/* Dynamic Content Pages - must come before city routes */}
        <Route path="/pages/:slug" element={<DynamicContentPage />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TrackingCodesLoader />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RecoveryRouter />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
