import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

export default function MapResizer() {
    const map = useMap();

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            map.invalidateSize();
        }

        // Create ResizeObserver instance
        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });

        // Get the map container element
        const mapContainer = map.getContainer();

        // Observe the container
        resizeObserver.observe(mapContainer);

        // Clean up
        return () => {
            resizeObserver.disconnect();
        };
    }, [map]);

    return null;
}
