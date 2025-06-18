import { useState } from 'react';
import MapPicker from '@/components/map-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function MapPickerExample() {
    const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number | null } | undefined>(undefined);

    const handleLocationChange = (newLocation: { lat: number; lng: number; accuracy: number | null }) => {
        setLocation(newLocation);
        console.log('Location selected:', newLocation);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Location Picker</CardTitle>
                <CardDescription>
                    Select a location on the map or search for an address
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <MapPicker
                        value={location}
                        onChange={handleLocationChange}
                        className="mt-1"
                    />
                </div>

                {location && (
                    <div className="p-4 border rounded-md bg-muted">
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
    );
}
