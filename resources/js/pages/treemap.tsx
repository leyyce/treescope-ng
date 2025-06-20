import { useState } from 'react';
import MapPicker from '@/components/map-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Treemap() {
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
                <Card className="flex flex-col flex-1 w-full overflow-hidden">
                    <CardHeader className="flex-shrink-0">
                        <CardTitle>Location Picker</CardTitle>
                        <CardDescription>
                            Select a location on the map or search for an address
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col overflow-hidden p-6">
                        <div className="flex-1 flex flex-col space-y-2 min-h-0">
                            <Label htmlFor="location" className="flex-shrink-0">Location</Label>
                            <MapPicker
                                value={location}
                                onChange={handleLocationChange}
                                className="mt-1 flex-1 min-h-0"
                            />
                        </div>

                        {location && (
                            <div className="flex-shrink-0 p-4 border rounded-md bg-muted mt-4">
                                <h3 className="font-medium mb-2">Selected Location:</h3>
                                <p>Latitude: {location.lat.toFixed(6)}</p>
                                <p>Longitude: {location.lng.toFixed(6)}</p>
                                {location.accuracy !== null && (
                                    <p>Accuracy: {location.accuracy.toFixed(2)} meters</p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
