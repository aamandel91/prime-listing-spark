import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Map as MapIcon } from 'lucide-react';
import { GoogleMap, DrawingManager, Polygon, useJsApiLoader } from '@react-google-maps/api';

interface SearchCriteriaEditorProps {
  pageId: string;
  onSave?: () => void;
}

interface SearchCriteria {
  id?: string;
  name: string;
  city?: string;
  state?: string;
  county?: string;
  zip?: string;
  neighborhood?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  polygon?: any;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  min_bedrooms?: number;
  bathrooms?: number;
  min_bathrooms?: number;
  property_type?: string[];
  property_class?: string;
  status?: string;
  min_sqft?: number;
  max_sqft?: number;
  min_lot_size_sqft?: number;
  max_lot_size_sqft?: number;
  min_acres?: number;
  max_acres?: number;
  min_garage_spaces?: number;
  min_parking_spaces?: number;
  pool?: boolean;
  waterfront?: boolean;
  min_year_built?: number;
  max_year_built?: number;
  sort_by?: string;
  office_id?: string;
  agent_id?: string;
}

const libraries: ("drawing" | "places")[] = ["drawing", "places"];

const propertyTypes = [
  'Single Family',
  'Condominium',
  'Townhouse',
  'Multi-Family',
  'Land',
  'Commercial',
  'Mobile Home',
  'Cooperative'
];

const propertyClasses = [
  'Residential',
  'ResidentialLease',
  'Commercial',
  'CommercialLease',
  'Land',
  'MultiFamily'
];

const statusOptions = [
  { value: 'A', label: 'Active' },
  { value: 'P', label: 'Pending' },
  { value: 'S', label: 'Sold' },
  { value: 'Closed', label: 'Closed' },
  { value: 'Expired', label: 'Expired' },
  { value: 'Withdrawn', label: 'Withdrawn' },
];

export function SearchCriteriaEditor({ pageId, onSave }: SearchCriteriaEditorProps) {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    name: 'Search Criteria',
    status: 'A'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [polygonPaths, setPolygonPaths] = useState<google.maps.LatLngLiteral[]>([]);
  const [mapCenter, setMapCenter] = useState({ lat: 26.1224, lng: -80.1373 }); // Florida default
  const { toast } = useToast();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  useEffect(() => {
    fetchCriteria();
  }, [pageId]);

  const fetchCriteria = async () => {
    try {
      const { data, error } = await supabase
        .from('page_search_criteria')
        .select('*')
        .eq('page_id', pageId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setCriteria(data);
        
        // Load polygon if exists
        if (data.polygon && typeof data.polygon === 'object' && 'coordinates' in data.polygon) {
          const polygonData = data.polygon as { coordinates: number[][][] };
          const coords = polygonData.coordinates[0].map((coord: number[]) => ({
            lat: coord[1],
            lng: coord[0]
          }));
          setPolygonPaths(coords);
          
          // Center map on polygon
          if (coords.length > 0) {
            const avgLat = coords.reduce((sum: number, c: any) => sum + c.lat, 0) / coords.length;
            const avgLng = coords.reduce((sum: number, c: any) => sum + c.lng, 0) / coords.length;
            setMapCenter({ lat: avgLat, lng: avgLng });
          }
        } else if (data.latitude && data.longitude) {
          setMapCenter({ lat: data.latitude, lng: data.longitude });
        }
      }
    } catch (error) {
      console.error('Error fetching criteria:', error);
      toast({
        title: 'Error',
        description: 'Failed to load search criteria',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Convert polygon paths to GeoJSON format
      let polygonGeoJSON = null;
      if (polygonPaths.length > 0) {
        polygonGeoJSON = {
          type: 'Polygon',
          coordinates: [
            polygonPaths.map(p => [p.lng, p.lat]).concat([[polygonPaths[0].lng, polygonPaths[0].lat]])
          ]
        };
      }

      const payload = {
        ...criteria,
        page_id: pageId,
        polygon: polygonGeoJSON,
        updated_at: new Date().toISOString()
      };

      if (criteria.id) {
        const { error } = await supabase
          .from('page_search_criteria')
          .update(payload)
          .eq('id', criteria.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('page_search_criteria')
          .insert(payload);

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Search criteria saved successfully'
      });

      if (onSave) onSave();
      fetchCriteria();
    } catch (error: any) {
      console.error('Error saving criteria:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save search criteria',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const onPolygonComplete = useCallback((polygon: google.maps.Polygon) => {
    const path = polygon.getPath();
    const coordinates: google.maps.LatLngLiteral[] = [];
    
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coordinates.push({ lat: point.lat(), lng: point.lng() });
    }
    
    setPolygonPaths(coordinates);
    polygon.setMap(null);
  }, []);

  const clearPolygon = () => {
    setPolygonPaths([]);
    setCriteria(prev => ({ ...prev, polygon: null }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Search Criteria</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Criteria
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="location" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="price">Price & Size</TabsTrigger>
          <TabsTrigger value="property">Property</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="map">Map Search</TabsTrigger>
        </TabsList>

        {/* Location Tab */}
        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Filters</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Criteria Name</Label>
                <Input
                  id="name"
                  value={criteria.name}
                  onChange={(e) => setCriteria(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={criteria.city || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={criteria.state || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, state: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="county">County</Label>
                <Input
                  id="county"
                  value={criteria.county || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, county: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={criteria.zip || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, zip: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="neighborhood">Neighborhood</Label>
                <Input
                  id="neighborhood"
                  value={criteria.neighborhood || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, neighborhood: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={criteria.area || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, area: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Price & Size Tab */}
        <TabsContent value="price" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Range</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_price">Min Price</Label>
                <Input
                  id="min_price"
                  type="number"
                  value={criteria.min_price || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, min_price: parseFloat(e.target.value) || undefined }))}
                />
              </div>
              <div>
                <Label htmlFor="max_price">Max Price</Label>
                <Input
                  id="max_price"
                  type="number"
                  value={criteria.max_price || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, max_price: parseFloat(e.target.value) || undefined }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Square Footage</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_sqft">Min Sqft</Label>
                <Input
                  id="min_sqft"
                  type="number"
                  value={criteria.min_sqft || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, min_sqft: parseFloat(e.target.value) || undefined }))}
                />
              </div>
              <div>
                <Label htmlFor="max_sqft">Max Sqft</Label>
                <Input
                  id="max_sqft"
                  type="number"
                  value={criteria.max_sqft || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, max_sqft: parseFloat(e.target.value) || undefined }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lot Size</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_acres">Min Acres</Label>
                <Input
                  id="min_acres"
                  type="number"
                  step="0.01"
                  value={criteria.min_acres || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, min_acres: parseFloat(e.target.value) || undefined }))}
                />
              </div>
              <div>
                <Label htmlFor="max_acres">Max Acres</Label>
                <Input
                  id="max_acres"
                  type="number"
                  step="0.01"
                  value={criteria.max_acres || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, max_acres: parseFloat(e.target.value) || undefined }))}
                />
              </div>
              <div>
                <Label htmlFor="min_lot_size_sqft">Min Lot Sqft</Label>
                <Input
                  id="min_lot_size_sqft"
                  type="number"
                  value={criteria.min_lot_size_sqft || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, min_lot_size_sqft: parseFloat(e.target.value) || undefined }))}
                />
              </div>
              <div>
                <Label htmlFor="max_lot_size_sqft">Max Lot Sqft</Label>
                <Input
                  id="max_lot_size_sqft"
                  type="number"
                  value={criteria.max_lot_size_sqft || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, max_lot_size_sqft: parseFloat(e.target.value) || undefined }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Year Built</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_year_built">Min Year</Label>
                <Input
                  id="min_year_built"
                  type="number"
                  value={criteria.min_year_built || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, min_year_built: parseInt(e.target.value) || undefined }))}
                />
              </div>
              <div>
                <Label htmlFor="max_year_built">Max Year</Label>
                <Input
                  id="max_year_built"
                  type="number"
                  value={criteria.max_year_built || ''}
                  onChange={(e) => setCriteria(prev => ({ ...prev, max_year_built: parseInt(e.target.value) || undefined }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Property Tab */}
        <TabsContent value="property" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Characteristics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Exact Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={criteria.bedrooms || ''}
                    onChange={(e) => setCriteria(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || undefined }))}
                  />
                </div>
                <div>
                  <Label htmlFor="min_bedrooms">Min Bedrooms</Label>
                  <Input
                    id="min_bedrooms"
                    type="number"
                    value={criteria.min_bedrooms || ''}
                    onChange={(e) => setCriteria(prev => ({ ...prev, min_bedrooms: parseInt(e.target.value) || undefined }))}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Exact Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    value={criteria.bathrooms || ''}
                    onChange={(e) => setCriteria(prev => ({ ...prev, bathrooms: parseFloat(e.target.value) || undefined }))}
                  />
                </div>
                <div>
                  <Label htmlFor="min_bathrooms">Min Bathrooms</Label>
                  <Input
                    id="min_bathrooms"
                    type="number"
                    step="0.5"
                    value={criteria.min_bathrooms || ''}
                    onChange={(e) => setCriteria(prev => ({ ...prev, min_bathrooms: parseFloat(e.target.value) || undefined }))}
                  />
                </div>
              </div>

              <div>
                <Label>Property Types (select multiple)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {propertyTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={criteria.property_type?.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCriteria(prev => ({
                              ...prev,
                              property_type: [...(prev.property_type || []), type]
                            }));
                          } else {
                            setCriteria(prev => ({
                              ...prev,
                              property_type: (prev.property_type || []).filter(t => t !== type)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={`type-${type}`} className="text-sm">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="property_class">Property Class</Label>
                <Select
                  value={criteria.property_class}
                  onValueChange={(value) => setCriteria(prev => ({ ...prev, property_class: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class..." />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyClasses.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={criteria.status}
                  onValueChange={(value) => setCriteria(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort_by">Sort By</Label>
                <Select
                  value={criteria.sort_by}
                  onValueChange={(value) => setCriteria(prev => ({ ...prev, sort_by: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Newest First</SelectItem>
                    <SelectItem value="-date">Oldest First</SelectItem>
                    <SelectItem value="price">Price Low to High</SelectItem>
                    <SelectItem value="-price">Price High to Low</SelectItem>
                    <SelectItem value="sqft">Size Small to Large</SelectItem>
                    <SelectItem value="-sqft">Size Large to Small</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_garage_spaces">Min Garage Spaces</Label>
                  <Input
                    id="min_garage_spaces"
                    type="number"
                    value={criteria.min_garage_spaces || ''}
                    onChange={(e) => setCriteria(prev => ({ ...prev, min_garage_spaces: parseInt(e.target.value) || undefined }))}
                  />
                </div>
                <div>
                  <Label htmlFor="min_parking_spaces">Min Parking Spaces</Label>
                  <Input
                    id="min_parking_spaces"
                    type="number"
                    value={criteria.min_parking_spaces || ''}
                    onChange={(e) => setCriteria(prev => ({ ...prev, min_parking_spaces: parseInt(e.target.value) || undefined }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pool"
                    checked={criteria.pool || false}
                    onCheckedChange={(checked) => setCriteria(prev => ({ ...prev, pool: checked as boolean }))}
                  />
                  <label htmlFor="pool" className="text-sm font-medium">
                    Has Pool
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="waterfront"
                    checked={criteria.waterfront || false}
                    onCheckedChange={(checked) => setCriteria(prev => ({ ...prev, waterfront: checked as boolean }))}
                  />
                  <label htmlFor="waterfront" className="text-sm font-medium">
                    Waterfront Property
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="office_id">Office ID (MLS)</Label>
                  <Input
                    id="office_id"
                    value={criteria.office_id || ''}
                    onChange={(e) => setCriteria(prev => ({ ...prev, office_id: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="agent_id">Agent ID (MLS)</Label>
                  <Input
                    id="agent_id"
                    value={criteria.agent_id || ''}
                    onChange={(e) => setCriteria(prev => ({ ...prev, agent_id: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Map Search Tab */}
        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="w-5 h-5" />
                Geographic Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoaded ? (
                <>
                  <div className="space-y-2">
                    <Label>Draw a Polygon on the Map</Label>
                    <p className="text-sm text-muted-foreground">
                      Use the polygon tool to define the exact search area. Draw by clicking points on the map.
                    </p>
                    {polygonPaths.length > 0 && (
                      <Button variant="outline" size="sm" onClick={clearPolygon}>
                        Clear Polygon
                      </Button>
                    )}
                  </div>

                  <div className="h-[500px] w-full rounded-lg overflow-hidden border">
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={mapCenter}
                      zoom={10}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: true,
                      }}
                    >
                      {polygonPaths.length === 0 && (
                        <DrawingManager
                          onPolygonComplete={onPolygonComplete}
                          options={{
                            drawingControl: true,
                            drawingControlOptions: {
                              position: google.maps.ControlPosition.TOP_CENTER,
                              drawingModes: [google.maps.drawing.OverlayType.POLYGON],
                            },
                            polygonOptions: {
                              fillColor: '#2196F3',
                              fillOpacity: 0.3,
                              strokeWeight: 2,
                              strokeColor: '#2196F3',
                              editable: true,
                            },
                          }}
                        />
                      )}

                      {polygonPaths.length > 0 && (
                        <Polygon
                          paths={polygonPaths}
                          options={{
                            fillColor: '#2196F3',
                            fillOpacity: 0.3,
                            strokeWeight: 2,
                            strokeColor: '#2196F3',
                          }}
                        />
                      )}
                    </GoogleMap>
                  </div>

                  <div className="border-t pt-4 space-y-4">
                    <Label>Or Use Radius Search</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="0.000001"
                          value={criteria.latitude || ''}
                          onChange={(e) => setCriteria(prev => ({ ...prev, latitude: parseFloat(e.target.value) || undefined }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="0.000001"
                          value={criteria.longitude || ''}
                          onChange={(e) => setCriteria(prev => ({ ...prev, longitude: parseFloat(e.target.value) || undefined }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="radius">Radius (miles)</Label>
                        <Input
                          id="radius"
                          type="number"
                          value={criteria.radius || ''}
                          onChange={(e) => setCriteria(prev => ({ ...prev, radius: parseFloat(e.target.value) || undefined }))}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Loading map...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}