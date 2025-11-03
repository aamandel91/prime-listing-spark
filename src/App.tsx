import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
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
import PropertyTypePages from "./pages/admin/PropertyTypePages";
import ListingEnhancements from "./pages/admin/ListingEnhancements";
import Analytics from "./pages/admin/Analytics";
import RoleManagement from "./pages/admin/RoleManagement";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Leads from "./pages/admin/Leads";
import Sell from "./pages/Sell";
import NotFound from "./pages/NotFound";
import CityPropertyType from "./pages/CityPropertyType";
import LocationImport from "./pages/admin/LocationImport";
import ListingDataExtractor from "./pages/admin/ListingDataExtractor";
import ZipCodePage from "./pages/ZipCodePage";
import NeighborhoodPage from "./pages/NeighborhoodPage";

import { useEffect } from "react";

const queryClient = new QueryClient();

const RecoveryRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash.includes('type=recovery') && location.pathname !== '/auth') {
      navigate('/auth' + location.hash, { replace: true });
    }
  }, [location, navigate]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/agents" element={<AgentDirectory />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/advanced-search" element={<AdvancedSearch />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/sell" element={<Sell />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin/blog-migration" element={<ProtectedRoute requireRole="admin"><BlogMigration /></ProtectedRoute>} />
        <Route path="/admin/city-content" element={<ProtectedRoute requireRole="admin"><CityContentGenerator /></ProtectedRoute>} />
        <Route path="/admin/competitor-analysis" element={<ProtectedRoute requireRole="admin"><CompetitorAnalysis /></ProtectedRoute>} />
        <Route path="/admin/property-type-pages" element={<ProtectedRoute requireRole="admin"><PropertyTypePages /></ProtectedRoute>} />
        <Route path="/admin/listing-enhancements" element={<ProtectedRoute requireRole="admin"><ListingEnhancements /></ProtectedRoute>} />
        <Route path="/admin/leads" element={<ProtectedRoute requireRole="admin"><Leads /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute requireRole="admin"><Analytics /></ProtectedRoute>} />
        <Route path="/admin/roles" element={<ProtectedRoute requireRole="admin"><RoleManagement /></ProtectedRoute>} />
        <Route path="/admin/seo-settings" element={<ProtectedRoute requireRole="admin"><SEOSettings /></ProtectedRoute>} />
        <Route path="/admin/global-site-settings" element={<ProtectedRoute requireRole="admin"><GlobalSiteSettings /></ProtectedRoute>} />
        <Route path="/admin/site-layout-settings" element={<ProtectedRoute requireRole="admin"><SiteLayoutSettings /></ProtectedRoute>} />
        <Route path="/admin/featured-cities" element={<ProtectedRoute requireRole="admin"><FeaturedCities /></ProtectedRoute>} />
        <Route path="/admin/location-import" element={<ProtectedRoute requireRole="admin"><LocationImport /></ProtectedRoute>} />
        <Route path="/admin/listing-data-extractor" element={<ProtectedRoute requireRole="admin"><ListingDataExtractor /></ProtectedRoute>} />
        
        {/* Public Routes - More specific routes first */}
        <Route path="/cities" element={<Cities />} />
        <Route path="/cities/:citySlug/:propertyType" element={<CityPropertyType />} />
        <Route path="/cities/:citySlug" element={<CityTemplate />} />
        <Route path="/counties" element={<Counties />} />
        <Route path="/zip/:zipcode" element={<ZipCodePage />} />
        <Route path="/neighborhood/:slug" element={<NeighborhoodPage />} />
        <Route path="/counties/:countySlug" element={<CityTemplate />} />
        
        {/* Old property URL format */}
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/property/:id/openhouse" element={<PropertyDetail />} />
        
        {/* City routes with filters */}
        <Route path="/:citySlug/:filter" element={<CityTemplate />} />
        <Route path="/:citySlug" element={<CityTemplate />} />
        
        {/* New SEO-friendly property URL format - must come after city routes */}
        <Route path="/:propertySlug/" element={<PropertyDetail />} />
        
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
