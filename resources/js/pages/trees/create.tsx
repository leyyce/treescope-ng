import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import type { BreadcrumbItem, TreeSpecies, TreeCondition } from '@/types';

interface TreeLocationConfidence {
  id: string;
  name: string;
  description: string;
}

interface AddTreeProps {
  treeSpecies: TreeSpecies[];
  treeConditions: TreeCondition[];
  treeLocationConfidences: TreeLocationConfidence[];
}

export default function AddTree({ treeSpecies, treeConditions, treeLocationConfidences }: AddTreeProps) {
  const [address, setAddress] = useState<string>('');
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false);

  const { data, setData, post, processing, errors } = useForm({
    tree_species_id: '',
    tree_condition_id: '',
    tree_location_confidence_id: '',
    location: '',
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Tree Map',
      href: '/tree-map',
    },
    {
      title: 'Add Tree',
      href: '/trees/create',
    },
  ];

  // Get coordinates from URL query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');

    if (lat && lng) {
      // Create GeoJSON point
      const geoJsonPoint = {
        type: 'Point',
        coordinates: [parseFloat(lat), parseFloat(lng)],
      };

      setData('location', JSON.stringify(geoJsonPoint));

      // Reverse geocode the coordinates
      void reverseGeocode(parseFloat(lat), parseFloat(lng));
    }
  }, [setData]);

  // Reverse geocode coordinates to an address
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        signal: AbortSignal.timeout(5000),
      });
      const data = await response.json();

      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/trees');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Tree" />
      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Add a New Tree</CardTitle>
            <CardDescription>
              Fill in the details to add a new tree to the map.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Location Information</h3>
                <div className="rounded-md border p-4 bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    {isLoadingAddress ? (
                      <div className="text-sm text-muted-foreground">Loading address...</div>
                    ) : (
                      <div className="text-sm font-medium">{address}</div>
                    )}
                  </div>

                  {data.location && (
                    <div className="text-sm text-muted-foreground">
                      Coordinates: {JSON.parse(data.location).coordinates[1].toFixed(6)}, {JSON.parse(data.location).coordinates[0].toFixed(6)}
                    </div>
                  )}
                </div>
                {errors.location && <div className="text-sm text-destructive">{errors.location}</div>}
              </div>

              {/* Tree Species */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="tree_species_id">Tree Species</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select the species of the tree you are adding.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={data.tree_species_id}
                  onValueChange={(value) => setData('tree_species_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tree species" />
                  </SelectTrigger>
                  <SelectContent>
                    {treeSpecies.map((species) => (
                      <SelectItem key={species.id} value={species.id}>
                        {species.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tree_species_id && <div className="text-sm text-destructive">{errors.tree_species_id}</div>}
              </div>

              {/* Tree Condition */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="tree_condition_id">Tree Condition</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select the condition of the tree you are adding.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={data.tree_condition_id}
                  onValueChange={(value) => setData('tree_condition_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tree condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {treeConditions.map((condition) => (
                      <TooltipProvider key={condition.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value={condition.id}>
                              {condition.name}
                            </SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{condition.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tree_condition_id && <div className="text-sm text-destructive">{errors.tree_condition_id}</div>}
              </div>

              {/* Location Confidence */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="tree_location_confidence_id">Location Confidence</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select how confident you are about the location of the tree.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={data.tree_location_confidence_id}
                  onValueChange={(value) => setData('tree_location_confidence_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location confidence" />
                  </SelectTrigger>
                  <SelectContent>
                    {treeLocationConfidences.map((confidence) => (
                      <TooltipProvider key={confidence.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem value={confidence.id}>
                              {confidence.name}
                            </SelectItem>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{confidence.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tree_location_confidence_id && <div className="text-sm text-destructive">{errors.tree_location_confidence_id}</div>}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Tree'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
