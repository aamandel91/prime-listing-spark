import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MapPin, Mail, Home, School, Building2 } from "lucide-react";
import CityPagesTab from "@/components/admin/bulk-generator/CityPagesTab";
import ZipCodePagesTab from "@/components/admin/bulk-generator/ZipCodePagesTab";
import NeighborhoodPagesTab from "@/components/admin/bulk-generator/NeighborhoodPagesTab";
import PropertySubtypePagesTab from "@/components/admin/bulk-generator/PropertySubtypePagesTab";
import SchoolDistrictPagesTab from "@/components/admin/bulk-generator/SchoolDistrictPagesTab";

export default function BulkPageGenerator() {
  const [activeTab, setActiveTab] = useState("cities");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bulk Page Generator</h1>
        <p className="text-muted-foreground mt-2">
          Create multiple pages at once for cities, ZIP codes, neighborhoods, property types, and school districts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Dynamic Pages
          </CardTitle>
          <CardDescription>
            Use AI to automatically generate SEO-optimized content for location-based and property type pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="cities" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Cities
              </TabsTrigger>
              <TabsTrigger value="zipcodes" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                ZIP Codes
              </TabsTrigger>
              <TabsTrigger value="neighborhoods" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Neighborhoods
              </TabsTrigger>
              <TabsTrigger value="property-types" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Property Types
              </TabsTrigger>
              <TabsTrigger value="school-districts" className="flex items-center gap-2">
                <School className="h-4 w-4" />
                School Districts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cities" className="mt-6">
              <CityPagesTab />
            </TabsContent>

            <TabsContent value="zipcodes" className="mt-6">
              <ZipCodePagesTab />
            </TabsContent>

            <TabsContent value="neighborhoods" className="mt-6">
              <NeighborhoodPagesTab />
            </TabsContent>

            <TabsContent value="property-types" className="mt-6">
              <PropertySubtypePagesTab />
            </TabsContent>

            <TabsContent value="school-districts" className="mt-6">
              <SchoolDistrictPagesTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
