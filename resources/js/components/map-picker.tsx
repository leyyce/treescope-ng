import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon, LatLng, Map as LeafletMap } from 'leaflet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Locate, MapPin } from 'lucide-react';

// Make sure to add these to your CSS or import them in your main layout
// import 'leaflet/dist/leaflet.css';

// Define the props interface for the component
interface MapPickerProps {
  value?: { lat: number; lng: number };
  onChange?: (location: { lat: number; lng: number; accuracy: number | null }) => void;
  className?: string;
}

// Custom marker icon to replace the default one
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map events
function MapEvents({ onLocationSelect }: { onLocationSelect: (latlng: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

export default function MapPicker({ value, onChange, className = '' }: MapPickerProps) {
  // Default location (can be customized)
  const defaultLocation = { lat: 50.554233, lng: 9.677045 };

  // State for the selected location and accuracy
  const [location, setLocation] = useState<{ lat: number; lng: number }>(value || defaultLocation);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // State for the address input
  const [address, setAddress] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // State for loading indicators
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // State for keyboard navigation
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);

  // Debounce timer reference
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reference to the map instance
  const mapRef = useRef<LeafletMap | null>(null);

  // Reference to the search input
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reference to the suggestions container
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Initialize the component with the default location and address
  useEffect(() => {
    // Initialize with the provided value or default location
    const initialLocation = value || defaultLocation;
    setLocation(initialLocation);

    // Get the address for the initial location
    reverseGeocode(initialLocation.lat, initialLocation.lng);

    // Update the parent component with the initial location
    onChange?.({ ...initialLocation, accuracy: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    // Close suggestions on Escape
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      return;
    }

    // Handle arrow down to navigate to the next suggestion
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
      return;
    }

    // Handle arrow up to navigate to the previous suggestion
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev =>
        prev > 0 ? prev - 1 : prev
      );
      return;
    }

    // Handle Enter key to select the currently selected suggestion or the first one if none selected
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      const indexToSelect = selectedSuggestionIndex >= 0 ? selectedSuggestionIndex : 0;
      handleSuggestionSelect(suggestions[indexToSelect]);
      return;
    }
  };

  // Update the location when the value prop changes
  useEffect(() => {
    if (value) {
      setLocation(value);
      reverseGeocode(value.lat, value.lng);
    }
  }, [value]);

  // Handle location selection from the map
  const handleLocationSelect = useCallback((latlng: LatLng) => {
    const newLocation = { lat: latlng.lat, lng: latlng.lng };
    setLocation(newLocation);
    setAccuracy(null); // Reset accuracy when manually selecting location
    reverseGeocode(latlng.lat, latlng.lng);
    onChange?.({ ...newLocation, accuracy: null });
  }, [onChange]);

  // Geocode an address to coordinates
  const geocodeAddress = async () => {
    if (!address.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLocation = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setLocation(newLocation);
        setAccuracy(null); // Reset accuracy when searching for an address
        onChange?.({ ...newLocation, accuracy: null });

        // Center the map on the new location
        mapRef.current?.setView([newLocation.lat, newLocation.lng], 17);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Reverse geocode coordinates to an address
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();

      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  // Get the user's current location
  const getCurrentLocation = async () => {
    setIsLocating(true);

    if (navigator.geolocation) {
      // Add timeout option (10 seconds)
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy: positionAccuracy } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setLocation(newLocation);
          setAccuracy(positionAccuracy);

          try {
            // Perform reverse geocoding and wait for it to complete
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();

            if (data && data.display_name) {
              setAddress(data.display_name);
            } else {
              setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            }
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }

          onChange?.({ ...newLocation, accuracy: positionAccuracy });

          // Center the map on the user's location
          mapRef.current?.setView([latitude, longitude], 17);
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting current location:', error);
          setIsLocating(false);
        },
        options
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsLocating(false);
    }
  };

  // Fetch address suggestions as the user types
  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      return;
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();

      if (data && data.length > 0) {
        setSuggestions(data);
        setShowSuggestions(true);
        setSelectedSuggestionIndex(-1); // Reset selection when suggestions change
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Handle address input change with debounce
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set a new timer to fetch suggestions after 300ms
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: { display_name: string; lat: string; lon: string }) => {
    setAddress(suggestion.display_name);
    const newLocation = { lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) };
    setLocation(newLocation);
    setAccuracy(null);
    onChange?.({ ...newLocation, accuracy: null });

    // Center the map on the new location
    mapRef.current?.setView([newLocation.lat, newLocation.lng], 17);

    // Hide suggestions and reset selection
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    geocodeAddress();
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search for an address"
            value={address}
            onChange={handleAddressChange}
            onKeyDown={handleKeyDown}
            className="pr-10"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-[9999] mt-1 w-full rounded-md border border-gray-200 bg-popover shadow-lg"
            >
              <ul className="max-h-60 overflow-auto py-1 text-base">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={`relative cursor-pointer select-none py-2 px-3 hover:bg-accent hover:text-accent-foreground flex items-center ${
                      index === selectedSuggestionIndex ? 'bg-accent text-accent-foreground' : ''
                    }`}
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm truncate">{suggestion.display_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button type="submit" disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
        <Button type="button" variant="outline" onClick={getCurrentLocation} disabled={isLocating}>
          <Locate className="h-4 w-4 mr-2" />
          {isLocating ? 'Locating...' : 'My Location'}
        </Button>
      </form>

      {/* Map container */}
      <div className="h-[400px] w-full rounded-md border">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          {/* ESRI World Imagery Tile Layer */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            maxZoom={20}
          />

          {/* OpenStreetMap overlay for streets only */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
            maxZoom={20}
          />

          {/* Marker for the selected location */}
          <Marker position={[location.lat, location.lng]} icon={customIcon} />

          {/* Component to handle map events */}
          <MapEvents onLocationSelect={handleLocationSelect} />
        </MapContainer>
      </div>

      {/* Display the current coordinates and accuracy if available */}
      <div className="text-sm text-muted-foreground">
        <div>Selected coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</div>
        {accuracy !== null && (
          <div>Accuracy: {accuracy.toFixed(2)} meters</div>
        )}
      </div>
    </div>
  );
}
