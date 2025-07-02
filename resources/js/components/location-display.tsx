import { useEffect, useState } from 'react';
import { Icon } from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapPin } from 'lucide-react';
import MapResizer from '@/components/map-resizer';
import MapCenterMarker from '@/components/map-center-marker';

// Define the props interface for the component
interface LocationDisplayProps {
    lat: number;
    lng: number;
    className?: string;
    customMarkerIcon?: Icon;
}

// Default marker icon
const defaultMarkerIcon = new Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export default function LocationDisplay({ lat, lng, className = '', customMarkerIcon }: LocationDisplayProps) {
    const [address, setAddress] = useState<string>('');
    const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(true);

    // Use the provided marker icon or the default one
    const markerIcon = customMarkerIcon || defaultMarkerIcon;

    // Reverse geocode coordinates to an address when component mounts
    useEffect(() => {
        const reverseGeocode = async () => {
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

        void reverseGeocode();
    }, [lat, lng]);

    return (
        <div className={`flex h-full flex-col ${className}`}>
            {/* Map container */}
            <div className="min-h-[200px] w-full flex-1 rounded-md border">
                <MapContainer
                    center={[lat, lng]}
                    zoom={16}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                    dragging={false}
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
                >
                    {/* ESRI World Imagery Tile Layer */}
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution="Tiles &copy; <a href='https://www.esri.com/'>Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                        maxZoom={20}
                    />

                    {/* OpenStreetMap overlay for streets only */}
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
                        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
                        maxZoom={20}
                    />

                    {/* Marker for the location */}
                    <Marker position={[lat, lng]} icon={markerIcon} />

                    <MapResizer />
                    <MapCenterMarker position={[lat, lng]} />
                </MapContainer>
            </div>

            {/* Display the address and coordinates */}
            <div className="mt-2 space-y-1">
                <div className="flex items-start">
                    <MapPin className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-700">Address:</span>
                        {isLoadingAddress ? (
                            <span className="text-sm text-muted-foreground">Loading address...</span>
                        ) : (
                            <span className="text-sm text-gray-600">{address}</span>
                        )}
                    </div>
                </div>
                <div className="flex items-start">
                    <MapPin className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-700">Coordinates:</span>
                        <span className="text-sm text-gray-600">{lat.toFixed(6)}, {lng.toFixed(6)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
