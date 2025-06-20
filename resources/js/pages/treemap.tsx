import { useState } from 'react';
import MapPicker from '@/components/map-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Tree } from '@/types';
import { Head } from '@inertiajs/react';

interface TreemapProps {
    trees: Tree[];
}

export default function Treemap({ trees }: TreemapProps) {
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
                        </div>

                        {location && (
                            <div className="mt-4 flex-shrink-0 rounded-md border bg-muted p-4">
                                <h3 className="mb-2 font-medium">Selected Location:</h3>
                                <p>Latitude: {location.lat.toFixed(6)}</p>
                                <p>Longitude: {location.lng.toFixed(6)}</p>
                                {location.accuracy !== null && <p>Accuracy: {location.accuracy.toFixed(2)} meters</p>}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
