import { useMap, useMapEvent } from 'react-leaflet';
import { useEffect } from 'react';

interface MapCenterMarkerProps {
    position: [number, number];
}

export default function MapCenterMarker({ position }: MapCenterMarkerProps) {
    const map = useMap();

    // Center the map on the marker when the component mounts
    useEffect(() => {
        map.setView(position, map.getZoom());
    }, [map, position]);

    // Listen for zoom events and recenter the map
    useMapEvent('zoomend', () => {
        map.setView(position, map.getZoom(), {
            animate: true
        });
    });

    return null;
}
