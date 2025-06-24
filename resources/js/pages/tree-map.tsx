import { useState } from 'react';
import MapPicker from '@/components/map-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Tree } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TreemapProps {
    trees: Tree[];
}

export default function TreeMap({ trees }: TreemapProps) {
    const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number | null } | undefined>(undefined);

    const handleLocationChange = (newLocation: { lat: number; lng: number; accuracy: number | null }) => {
        setLocation(newLocation);
        console.log('Location selected:', newLocation);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tree Map',
            href: '/tree-map',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tree Map" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="flex w-full flex-1 flex-col overflow-hidden">
                    <CardHeader className="flex-shrink-0">
                        <CardTitle>Tree Map</CardTitle>
                        <CardDescription>View all trees on the map. Click on a marker to see tree details. You can also select a location or search for an address.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col overflow-hidden p-6">
                        <div className="flex min-h-0 flex-1 flex-col space-y-2">
                            <Label htmlFor="location" className="flex-shrink-0">
                                Location
                            </Label>
                            <MapPicker
                                value={location}
                                onChange={handleLocationChange}
                                trees={trees}
                                className="mt-1 min-h-0 flex-1"
                            />
                            <div className="mt-4 flex justify-end">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div>
                                                {location ? (
                                                    <Button asChild>
                                                        <Link href={route('trees.create', { lat: location.lat, lng: location.lng })}>
                                                            Create a Tree
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        disabled
                                                        className="opacity-50 cursor-not-allowed"
                                                    >
                                                        Create a Tree
                                                    </Button>
                                                )}
                                            </div>
                                        </TooltipTrigger>
                                        {!location && (
                                            <TooltipContent>
                                                <p>Please select a location on the map first</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
