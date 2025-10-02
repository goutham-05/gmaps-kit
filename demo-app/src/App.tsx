import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { PackageSelector, PackageType } from './components/PackageSelector';
import { ReactDemo } from './components/ReactDemo';
import { DocsSection } from './components/DocsSection';
import {
  // Script loader
  loadGoogleMaps,
  isGoogleMapsLoaded,
  waitForGoogleMaps,
  // Map utilities
  createMap,
  getMapCenter,
  setMapCenter,
  getMapZoom,
  setMapZoom,
  fitMapToMarkers,
  panTo,
  // Marker utilities
  addMarker,
  removeMarker,
  updateMarkerPosition,
  updateMarkerContent,
  createInfoWindow,
  openInfoWindow,
  closeInfoWindow,
  addMarkerWithInfoWindow,
  clearMarkers,
  clearInfoWindows,
  getMarkerPosition,
  setMarkerDraggable,
  addMarkerClickListener,
  addMarkerDragListener,
  addMarkerDragEndListener,
  // Autocomplete utilities
  createAutocomplete,
  bindAutocompleteToMap,
  getSelectedPlace,
  addPlaceChangedListener,
  setAutocompleteBounds,
  setAutocompleteComponentRestrictions,
  setAutocompleteTypes,
  getAutocompleteBounds,
  getAutocompleteComponentRestrictions,
  getAutocompleteTypes,
  clearAutocomplete,
  focusAutocomplete,
  createSearchBox,
  addPlacesChangedListener,
  // Geocoding utilities
  geocode,
  reverseGeocode,
  geocodeAsync,
  reverseGeocodeAsync,
  geocodeWithComponents,
  geocodeWithBounds,
  geocodeWithRegion,
  geocodeFirst,
  reverseGeocodeFirst,
  // Directions utilities
  getDirections,
  getDirectionsAsync,
  renderDirections,
  clearDirections,
  getDistanceMatrix,
  getDistanceMatrixAsync,
  createDirectionsService,
  createDirectionsRenderer,
  createDistanceMatrixService,
  getTotalDistance,
  getTotalDuration,
  getDirectionsBounds,
  fitMapToRoute,
  // NEW: Web Service Clients
  GeocodingClient,
  PlacesClient,
  // NEW: Street View utilities
  createStreetViewPanorama,
  setStreetViewPosition,
  getStreetViewPosition,
  setStreetViewPov,
  getStreetViewPov,
  setStreetViewVisibility,
  isStreetViewVisible,
} from '@gmaps-kit/core';

// Helper functions for function documentation
const getFunctionExample = (functionName: string): string => {
  const examples: { [key: string]: string } = {
    addMarker:
      'const marker = addMarker(map, { position: { lat: 40.7128, lng: -74.006 }, title: "New York" });',
    getMapCenter: 'const center = getMapCenter(map);',
    setMapCenter: 'setMapCenter(map, { lat: 40.7128, lng: -74.006 });',
    getMapZoom: 'const zoom = getMapZoom(map);',
    setMapZoom: 'setMapZoom(map, 15);',
    panTo: 'panTo(map, { lat: 40.7128, lng: -74.006 }, 14);',
    fitMapToMarkers: 'fitMapToMarkers(map, markers);',
    removeMarker: 'removeMarker(marker);',
    updateMarkerPosition:
      'updateMarkerPosition(marker, { lat: 40.7128, lng: -74.006 });',
    updateMarkerContent: 'updateMarkerContent(marker, newContent);',
    createInfoWindow:
      'const infoWindow = createInfoWindow({ content: "<h3>Hello</h3>" });',
    openInfoWindow: 'openInfoWindow(infoWindow, marker, map);',
    closeInfoWindow: 'closeInfoWindow(infoWindow);',
    addMarkerWithInfoWindow:
      'const result = addMarkerWithInfoWindow(map, markerOptions, infoWindowOptions);',
    getMarkerPosition: 'const position = getMarkerPosition(marker);',
    setMarkerDraggable: 'setMarkerDraggable(marker, true);',
    addMarkerClickListener:
      'addMarkerClickListener(marker, () => console.log("Clicked!"));',
    clearMarkers: 'clearMarkers(mapInstance);',
    clearInfoWindows: 'clearInfoWindows(mapInstance);',
    geocodeAsync: 'const results = await geocodeAsync("New York, NY");',
    reverseGeocodeAsync:
      'const results = await reverseGeocodeAsync({ lat: 40.7128, lng: -74.006 });',
    geocodeFirst: 'const result = await geocodeFirst("New York, NY");',
    reverseGeocodeFirst:
      'const result = await reverseGeocodeFirst({ lat: 40.7128, lng: -74.006 });',
    getDirectionsAsync:
      'const directions = await getDirectionsAsync({ origin: "NYC", destination: "LA" });',
    getDistanceMatrixAsync:
      'const matrix = await getDistanceMatrixAsync({ origins: ["NYC"], destinations: ["LA"] });',
    createAutocomplete:
      'const autocomplete = createAutocomplete({ input: inputElement });',
    getSelectedPlace: 'const place = getSelectedPlace(autocomplete);',
    setAutocompleteTypes:
      'setAutocompleteTypes(autocomplete, ["restaurant", "lodging"]);',
    getAutocompleteTypes: 'const types = getAutocompleteTypes(autocomplete);',
    setAutocompleteBounds: 'setAutocompleteBounds(autocomplete, bounds);',
    getAutocompleteBounds:
      'const bounds = getAutocompleteBounds(autocomplete);',
    setAutocompleteComponentRestrictions:
      'setAutocompleteComponentRestrictions(autocomplete, { country: "us" });',
    getAutocompleteComponentRestrictions:
      'const restrictions = getAutocompleteComponentRestrictions(autocomplete);',
    clearAutocomplete: 'clearAutocomplete(autocomplete);',
    focusAutocomplete: 'focusAutocomplete(autocomplete);',
    addPlaceChangedListener:
      'addPlaceChangedListener(autocomplete, (place) => console.log(place));',
    createSearchBox: 'const searchBox = createSearchBox(input, map);',
    addPlacesChangedListener:
      'addPlacesChangedListener(searchBox, (places) => console.log(places));',
    getTotalDistance: 'const distance = getTotalDistance(directions);',
    getTotalDuration: 'const duration = getTotalDuration(directions);',
    fitMapToRoute: 'fitMapToRoute(map, directions);',
    clearDirections: 'clearDirections(renderer);',
    createDirectionsService:
      'const service = createDirectionsService(mapInstance);',
    createDirectionsRenderer:
      'const renderer = createDirectionsRenderer(mapInstance);',
    createDistanceMatrixService:
      'const service = createDistanceMatrixService(mapInstance);',
    getDirectionsBounds: 'const bounds = getDirectionsBounds(directions);',
    addMarkerDragListener:
      'addMarkerDragListener(marker, () => console.log("Dragging"));',
    addMarkerDragEndListener:
      'addMarkerDragEndListener(marker, () => console.log("Drag ended"));',
    isGoogleMapsLoaded: 'const loaded = isGoogleMapsLoaded();',
    waitForGoogleMaps: 'await waitForGoogleMaps();',
    loadGoogleMaps:
      'await loadGoogleMaps({ apiKey: "your-key", libraries: ["places"] });',
    geocode: 'geocode("New York, NY", (results) => console.log(results));',
    reverseGeocode:
      'reverseGeocode({ lat: 40.7128, lng: -74.006 }, (results) => console.log(results));',
    getDirections:
      'getDirections({ origin: "NYC", destination: "LA" }, (result) => console.log(result));',
    getDistanceMatrix:
      'getDistanceMatrix({ origins: ["NYC"], destinations: ["LA"] }, (result) => console.log(result));',
    renderDirections: 'renderDirections(map, directions);',
    geocodeWithComponents:
      'await geocodeWithComponents("NYC", { country: "US" }, callback);',
    geocodeWithBounds: 'await geocodeWithBounds("NYC", bounds, callback);',
    geocodeWithRegion: 'await geocodeWithRegion("NYC", "US", callback);',
  };
  return examples[functionName] || '// Function usage example';
};

const getFunctionParameters = (functionName: string): string => {
  const parameters: { [key: string]: string } = {
    addMarker:
      '• map: Google Maps instance\n• options: { position: LatLngLiteral, title?: string, draggable?: boolean }',
    getMapCenter: '• map: Google Maps instance',
    setMapCenter: '• map: Google Maps instance\n• center: LatLngLiteral',
    getMapZoom: '• map: Google Maps instance',
    setMapZoom: '• map: Google Maps instance\n• zoom: number (1-20)',
    panTo:
      '• map: Google Maps instance\n• center: LatLngLiteral\n• zoom?: number',
    fitMapToMarkers: '• map: Google Maps instance\n• markers: Marker[]',
    removeMarker: '• marker: Marker instance',
    updateMarkerPosition:
      '• marker: Marker instance\n• position: LatLngLiteral',
    updateMarkerContent:
      '• marker: Marker instance\n• content: HTMLElement | string',
    createInfoWindow:
      '• options: { content: string | HTMLElement, position?: LatLngLiteral }',
    openInfoWindow:
      '• infoWindow: InfoWindow instance\n• marker: Marker instance\n• map: Google Maps instance',
    closeInfoWindow: '• infoWindow: InfoWindow instance',
    addMarkerWithInfoWindow:
      '• map: Google Maps instance\n• markerOptions: MarkerOptions\n• infoWindowOptions: InfoWindowOptions',
    getMarkerPosition: '• marker: Marker instance',
    setMarkerDraggable: '• marker: Marker instance\n• draggable: boolean',
    addMarkerClickListener: '• marker: Marker instance\n• callback: () => void',
    clearMarkers: '• mapInstance: MapInstance',
    clearInfoWindows: '• mapInstance: MapInstance',
    geocodeAsync: '• address: string',
    reverseGeocodeAsync: '• location: LatLngLiteral',
    geocodeFirst: '• address: string',
    reverseGeocodeFirst: '• location: LatLngLiteral',
    getDirectionsAsync: '• request: DirectionsRequest',
    getDistanceMatrixAsync: '• request: DistanceMatrixRequest',
    createAutocomplete:
      '• options: { input: HTMLInputElement, types?: string[], bounds?: LatLngBounds }',
    getSelectedPlace: '• autocomplete: Autocomplete instance',
    setAutocompleteTypes:
      '• autocomplete: Autocomplete instance\n• types: string[]',
    getAutocompleteTypes: '• autocomplete: Autocomplete instance',
    setAutocompleteBounds:
      '• autocomplete: Autocomplete instance\n• bounds: LatLngBounds',
    getAutocompleteBounds: '• autocomplete: Autocomplete instance',
    setAutocompleteComponentRestrictions:
      '• autocomplete: Autocomplete instance\n• restrictions: ComponentRestrictions',
    getAutocompleteComponentRestrictions:
      '• autocomplete: Autocomplete instance',
    clearAutocomplete: '• autocomplete: Autocomplete instance',
    focusAutocomplete: '• autocomplete: Autocomplete instance',
    addPlaceChangedListener:
      '• autocomplete: Autocomplete instance\n• callback: (place: Place) => void',
    createSearchBox: '• input: HTMLInputElement\n• map: Google Maps instance',
    addPlacesChangedListener:
      '• searchBox: SearchBox instance\n• callback: (places: Place[]) => void',
    getTotalDistance: '• directions: DirectionsResult',
    getTotalDuration: '• directions: DirectionsResult',
    fitMapToRoute:
      '• map: Google Maps instance\n• directions: DirectionsResult',
    clearDirections: '• renderer: DirectionsRenderer',
    createDirectionsService: '• mapInstance: MapInstance',
    createDirectionsRenderer: '• mapInstance: MapInstance',
    createDistanceMatrixService: '• mapInstance: MapInstance',
    getDirectionsBounds: '• directions: DirectionsResult',
    addMarkerDragListener: '• marker: Marker instance\n• callback: () => void',
    addMarkerDragEndListener:
      '• marker: Marker instance\n• callback: () => void',
    isGoogleMapsLoaded: 'No parameters',
    waitForGoogleMaps: 'No parameters',
    loadGoogleMaps: '• options: { apiKey: string, libraries?: string[] }',
    geocode:
      '• address: string\n• callback: (results: GeocoderResult[]) => void',
    reverseGeocode:
      '• location: LatLngLiteral\n• callback: (results: GeocoderResult[]) => void',
    getDirections:
      '• request: DirectionsRequest\n• callback: (result: DirectionsResult) => void',
    getDistanceMatrix:
      '• request: DistanceMatrixRequest\n• callback: (result: DistanceMatrixResponse) => void',
    renderDirections:
      '• map: Google Maps instance\n• directions: DirectionsResult',
    geocodeWithComponents:
      '• address: string\n• components: ComponentRestrictions\n• callback: (results: GeocoderResult[]) => void',
    geocodeWithBounds:
      '• address: string\n• bounds: LatLngBounds\n• callback: (results: GeocoderResult[]) => void',
    geocodeWithRegion:
      '• address: string\n• region: string\n• callback: (results: GeocoderResult[]) => void',
  };
  return parameters[functionName] || 'No parameters documented';
};

const getFunctionReturns = (functionName: string): string => {
  const returns: { [key: string]: string } = {
    addMarker: 'Marker instance',
    getMapCenter: 'LatLngLiteral object with lat and lng properties',
    setMapCenter: 'void',
    getMapZoom: 'number (zoom level)',
    setMapZoom: 'void',
    panTo: 'void',
    fitMapToMarkers: 'void',
    removeMarker: 'void',
    updateMarkerPosition: 'void',
    updateMarkerContent: 'void',
    createInfoWindow: 'InfoWindow instance',
    openInfoWindow: 'void',
    closeInfoWindow: 'void',
    addMarkerWithInfoWindow: '{ marker: Marker, infoWindow: InfoWindow }',
    getMarkerPosition: 'LatLngLiteral | null',
    setMarkerDraggable: 'void',
    addMarkerClickListener: 'void',
    clearMarkers: 'void',
    clearInfoWindows: 'void',
    geocodeAsync: 'Promise<GeocoderResult[]>',
    reverseGeocodeAsync: 'Promise<GeocoderResult[]>',
    geocodeFirst: 'Promise<GeocoderResult>',
    reverseGeocodeFirst: 'Promise<GeocoderResult>',
    getDirectionsAsync: 'Promise<DirectionsResult>',
    getDistanceMatrixAsync: 'Promise<DistanceMatrixElement[]>',
    createAutocomplete: 'Autocomplete instance',
    getSelectedPlace: 'Place | null',
    setAutocompleteTypes: 'void',
    getAutocompleteTypes: 'string[]',
    setAutocompleteBounds: 'void',
    getAutocompleteBounds: 'LatLngBounds | null',
    setAutocompleteComponentRestrictions: 'void',
    getAutocompleteComponentRestrictions: 'ComponentRestrictions | null',
    clearAutocomplete: 'void',
    focusAutocomplete: 'void',
    addPlaceChangedListener: 'void',
    createSearchBox: 'SearchBox instance',
    addPlacesChangedListener: 'void',
    getTotalDistance: 'number (in meters)',
    getTotalDuration: 'number (in seconds)',
    fitMapToRoute: 'void',
    clearDirections: 'void',
    createDirectionsService: 'DirectionsService instance',
    createDirectionsRenderer: 'DirectionsRenderer instance',
    createDistanceMatrixService: 'DistanceMatrixService instance',
    getDirectionsBounds: 'LatLngBounds | null',
    addMarkerDragListener: 'void',
    addMarkerDragEndListener: 'void',
    isGoogleMapsLoaded: 'boolean',
    waitForGoogleMaps: 'Promise<void>',
    loadGoogleMaps: 'Promise<void>',
    geocode: 'void (uses callback)',
    reverseGeocode: 'void (uses callback)',
    getDirections: 'void (uses callback)',
    getDistanceMatrix: 'void (uses callback)',
    renderDirections: 'void',
    geocodeWithComponents: 'Promise<GeocoderResult[]>',
    geocodeWithBounds: 'Promise<GeocoderResult[]>',
    geocodeWithRegion: 'Promise<GeocoderResult[]>',
  };
  return returns[functionName] || 'No return value documented';
};

const getFunctionTips = (functionName: string): string => {
  const tips: { [key: string]: string } = {
    addMarker:
      '• Use draggable: true to allow users to move markers\n• Set custom icons with the icon property\n• Add click listeners for interactive markers',
    getMapCenter:
      '• Returns the current center of the map view\n• Useful for getting user location after panning',
    setMapCenter:
      '• Smoothly animates to the new center\n• Combine with setMapZoom for precise positioning',
    getMapZoom:
      '• Zoom levels range from 1 (world view) to 20 (building level)\n• Higher numbers show more detail',
    setMapZoom:
      '• Use values between 1-20 for best results\n• Lower values show larger areas',
    panTo:
      '• Smoothly pans to the new location\n• Optionally sets zoom level during pan',
    fitMapToMarkers:
      '• Automatically adjusts zoom and center to show all markers\n• Great for displaying multiple locations',
    removeMarker:
      '• Removes marker from map and memory\n• Call setMap(null) to completely remove',
    updateMarkerPosition:
      '• Updates marker location without recreating\n• Useful for real-time position updates',
    updateMarkerContent:
      '• Can accept HTML strings or DOM elements\n• Use for custom marker appearances',
    createInfoWindow:
      '• Create reusable InfoWindow instances\n• Set content as HTML string or DOM element',
    openInfoWindow:
      '• Opens InfoWindow at marker location\n• Only one InfoWindow can be open at a time',
    closeInfoWindow:
      '• Closes the specified InfoWindow\n• Use to programmatically close windows',
    addMarkerWithInfoWindow:
      '• Convenience function for marker + InfoWindow\n• Returns both instances for further manipulation',
    getMarkerPosition:
      '• Returns current marker position\n• Useful for saving marker locations',
    setMarkerDraggable:
      '• Enable/disable marker dragging\n• Add drag listeners for real-time updates',
    addMarkerClickListener:
      '• Add click event handlers to markers\n• Use for interactive marker features',
    clearMarkers:
      '• Removes all markers from the map\n• Useful for resetting marker collections',
    clearInfoWindows:
      '• Closes and removes all InfoWindows\n• Clean up before adding new content',
    geocodeAsync:
      '• Convert addresses to coordinates\n• Returns array of possible matches\n• Use first result for best match',
    reverseGeocodeAsync:
      '• Convert coordinates to addresses\n• Returns human-readable location names\n• Useful for displaying current location',
    geocodeFirst:
      '• Gets the first (best) geocoding result\n• Convenience function for single results',
    reverseGeocodeFirst:
      '• Gets the first reverse geocoding result\n• Quick way to get address from coordinates',
    getDirectionsAsync:
      '• Get driving/walking/transit directions\n• Returns detailed route information\n• Use with DirectionsRenderer to display',
    getDistanceMatrixAsync:
      '• Calculate distances between multiple points\n• Useful for delivery optimization\n• Returns travel times and distances',
    createAutocomplete:
      '• Create address autocomplete inputs\n• Set types to filter results (restaurant, lodging, etc.)\n• Use bounds to limit search area',
    getSelectedPlace:
      '• Get the currently selected place\n• Returns null if no place selected\n• Use after place_changed event',
    setAutocompleteTypes:
      '• Filter autocomplete results by type\n• Common types: establishment, geocode, (regions)\n• Use array for multiple types',
    getAutocompleteTypes:
      '• Get current type restrictions\n• Returns array of active types\n• Useful for debugging',
    setAutocompleteBounds:
      '• Limit search to specific geographic area\n• Improves result relevance\n• Use map bounds for dynamic limits',
    getAutocompleteBounds:
      '• Get current geographic bounds\n• Returns null if no bounds set\n• Useful for debugging',
    setAutocompleteComponentRestrictions:
      '• Restrict results by country/region\n• Use country codes (us, ca, gb, etc.)\n• Improves result accuracy',
    getAutocompleteComponentRestrictions:
      '• Get current component restrictions\n• Returns null if no restrictions\n• Useful for debugging',
    clearAutocomplete:
      '• Clear autocomplete input and results\n• Reset to initial state\n• Useful for form resets',
    focusAutocomplete:
      '• Programmatically focus the input\n• Trigger autocomplete dropdown\n• Useful for mobile interactions',
    addPlaceChangedListener:
      '• Listen for place selection events\n• Use to handle user selections\n• Access place details in callback',
    createSearchBox:
      '• Create search box for places\n• Different from autocomplete\n• Use for broader place searches',
    addPlacesChangedListener:
      '• Listen for search box changes\n• Handle multiple place results\n• Use for search functionality',
    getTotalDistance:
      '• Calculate total route distance\n• Returns distance in meters\n• Convert to km: distance / 1000',
    getTotalDuration:
      '• Calculate total route duration\n• Returns time in seconds\n• Convert to hours: duration / 3600',
    fitMapToRoute:
      '• Automatically fit map to show entire route\n• Adjusts zoom and center\n• Great for displaying complete directions',
    clearDirections:
      '• Remove directions from map\n• Clean up route display\n• Use before showing new routes',
    createDirectionsService:
      '• Create service for getting directions\n• Required for directions functionality\n• Use with DirectionsRenderer',
    createDirectionsRenderer:
      '• Create renderer for displaying directions\n• Attach to map to show routes\n• Use with DirectionsService',
    createDistanceMatrixService:
      '• Create service for distance calculations\n• Required for distance matrix\n• Use for multiple point calculations',
    getDirectionsBounds:
      '• Get geographic bounds of route\n• Useful for fitting map to route\n• Returns LatLngBounds object',
    addMarkerDragListener:
      '• Listen for marker drag events\n• Use for real-time position updates\n• Combine with drag end listener',
    addMarkerDragEndListener:
      '• Listen for marker drag completion\n• Use to save final positions\n• Trigger after drag operations',
    isGoogleMapsLoaded:
      '• Check if Google Maps API is ready\n• Use before calling map functions\n• Returns boolean status',
    waitForGoogleMaps:
      '• Wait for Google Maps to load\n• Use in async functions\n• Throws error if loading fails',
    loadGoogleMaps:
      '• Load Google Maps API\n• Specify required libraries\n• Use before creating maps',
    geocode:
      '• Synchronous geocoding with callback\n• Use for simple geocoding needs\n• Callback receives results array',
    reverseGeocode:
      '• Synchronous reverse geocoding\n• Use for coordinate to address conversion\n• Callback receives results array',
    getDirections:
      '• Synchronous directions with callback\n• Use for simple routing needs\n• Callback receives directions result',
    getDistanceMatrix:
      '• Synchronous distance matrix\n• Use for simple distance calculations\n• Callback receives matrix result',
    renderDirections:
      '• Display directions on map\n• Use with DirectionsResult\n• Automatically shows route',
    geocodeWithComponents:
      '• Geocode with country/region restrictions\n• Improves result accuracy\n• Use for specific geographic areas',
    geocodeWithBounds:
      '• Geocode within specific bounds\n• Limits search to geographic area\n• Improves local result relevance',
    geocodeWithRegion:
      '• Geocode with region bias\n• Influences result ranking\n• Use for location-specific searches',
  };
  return tips[functionName] || 'No tips available for this function';
};

function App() {
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('core');
  const [apiKey, setApiKey] = useState(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindows, setInfoWindows] = useState<any[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<string>('');
  const [status, setStatus] = useState(
    'Enter your Google Maps API key to get started and explore all the features below'
  );
  const [activeDemo, setActiveDemo] = useState('');

  // User input fields for dynamic examples
  const [userAddress, setUserAddress] = useState('Times Square, New York');
  const [userCoordinates, setUserCoordinates] = useState('40.7580, -73.9855');
  const [originAddress, setOriginAddress] = useState('New York, NY');
  const [destinationAddress, setDestinationAddress] =
    useState('Los Angeles, CA');
  const [searchPlace, setSearchPlace] = useState('restaurant');
  const [markerTitle, setMarkerTitle] = useState('My Custom Marker');
  const [infoWindowContent, setInfoWindowContent] = useState(
    'Hello from gmaps-kit!'
  );
  const [autocompleteInput, setAutocompleteInput] = useState('');
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(0);

  // NEW: Web service clients state
  const [geocodingClient, setGeocodingClient] =
    useState<GeocodingClient | null>(null);
  const [placesClient, setPlacesClient] = useState<PlacesClient | null>(null);
  const [streetViewInstance, setStreetViewInstance] = useState<any>(null);

  const handleLoadMaps = async () => {
    if (!apiKey || apiKey === 'YOUR_API_KEY') {
      setStatus('⚠️ Please enter a valid Google Maps API key');
      return;
    }

    try {
      setStatus('Loading Google Maps API...');
      await loadGoogleMaps({
        apiKey,
        libraries: ['places', 'geometry', 'marker'],
      });

      setStatus('✅ Google Maps API loaded!');
      setIsLoaded(true);

      const map = createMap('map-container', {
        center: { lat: 40.7128, lng: -74.006 },
        zoom: 10,
        mapId: 'CORE_DEMO_MAP_ID',
      });

      setMapInstance(map);

      // Initialize web service clients
      const geocoding = new GeocodingClient({ apiKey });
      const places = new PlacesClient({ apiKey });
      setGeocodingClient(geocoding);
      setPlacesClient(places);

      setStatus('✅ Map created! Ready to explore gmaps-kit/core features');
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  const demoFunctions = [
    {
      category: '📦 Script Loader',
      functions: [
        {
          name: 'isGoogleMapsLoaded',
          description: 'Check if Google Maps API is loaded',
          action: () => {
            const loaded = isGoogleMapsLoaded();
            setStatus(`📦 Google Maps loaded: ${loaded ? '✅ Yes' : '❌ No'}`);
          },
        },
        {
          name: 'waitForGoogleMaps',
          description: 'Wait for Google Maps to load',
          action: async () => {
            try {
              setStatus('⏳ Waiting for Google Maps...');
              await waitForGoogleMaps();
              setStatus('✅ Google Maps is ready!');
            } catch (error) {
              setStatus(`❌ Error: ${error.message}`);
            }
          },
        },
      ],
    },
    {
      category: '🗺️ Map Controls',
      functions: [
        {
          name: 'getMapCenter',
          description: 'Get current map center',
          action: () => {
            if (!mapInstance) return;
            const center = getMapCenter(mapInstance.map);
            setStatus(
              `📍 Map center: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`
            );
          },
        },
        {
          name: 'setMapCenter',
          description: 'Set map center to user coordinates',
          action: () => {
            if (!mapInstance) return;
            const [lat, lng] = userCoordinates.split(',').map(Number);
            setMapCenter(mapInstance.map, { lat, lng });
            setStatus(`🎯 Map centered on ${userCoordinates}`);
          },
        },
        {
          name: 'getMapZoom',
          description: 'Get current zoom level',
          action: () => {
            if (!mapInstance) return;
            const zoom = getMapZoom(mapInstance.map);
            setStatus(`🔍 Current zoom: ${zoom}`);
          },
        },
        {
          name: 'setMapZoom',
          description: 'Set zoom to 15',
          action: () => {
            if (!mapInstance) return;
            setMapZoom(mapInstance.map, 15);
            setStatus('🔍 Zoom set to 15');
          },
        },
        {
          name: 'panTo',
          description: 'Pan to user coordinates',
          action: () => {
            if (!mapInstance) return;
            const [lat, lng] = userCoordinates.split(',').map(Number);
            panTo(mapInstance.map, { lat, lng }, 14);
            setStatus(`🌳 Panned to ${userCoordinates}`);
          },
        },
        {
          name: 'fitMapToMarkers',
          description: 'Fit map to show all markers',
          action: () => {
            if (!mapInstance) return;
            fitMapToMarkers(mapInstance.map, markers);
            setStatus('📐 Map fitted to show all markers');
          },
        },
      ],
    },
    {
      category: '📍 Markers & InfoWindows',
      functions: [
        {
          name: 'addMarker',
          description: 'Add marker with custom title',
          action: async () => {
            if (!mapInstance) return;
            const center = getMapCenter(mapInstance.map);
            const marker = addMarker(mapInstance.map, {
              position: center,
              title: markerTitle,
            });
            setMarkers([...markers, marker]);
            setStatus(`📍 Added marker: ${markerTitle}`);
          },
        },
        {
          name: 'removeMarker',
          description: 'Remove selected marker',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers to remove');
              return;
            }
            const markerToRemove = markers[selectedMarkerIndex] || markers[0];
            removeMarker(markerToRemove);
            setMarkers(markers.filter((m) => m !== markerToRemove));
            setStatus(`🗑️ Removed marker ${selectedMarkerIndex + 1}`);
          },
        },
        {
          name: 'updateMarkerPosition',
          description: 'Update marker position',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers to update');
              return;
            }
            const [lat, lng] = userCoordinates.split(',').map(Number);
            const marker = markers[selectedMarkerIndex] || markers[0];
            updateMarkerPosition(marker, { lat, lng });
            setStatus(`📍 Updated marker position to ${userCoordinates}`);
          },
        },
        {
          name: 'updateMarkerContent',
          description: 'Update marker icon',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers to update');
              return;
            }
            const marker = markers[selectedMarkerIndex] || markers[0];
            const content = document.createElement('div');
            content.innerHTML = '📍';
            content.style.fontSize = '24px';
            updateMarkerContent(marker, content);
            setStatus('🎨 Updated marker icon');
          },
        },
        {
          name: 'createInfoWindow',
          description: 'Create InfoWindow with custom content',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ Add a marker first');
              return;
            }
            const infoWindow = createInfoWindow({
              content: `<h3>${infoWindowContent}</h3><p>Created with gmaps-kit/core</p>`,
            });
            openInfoWindow(infoWindow, markers[0], mapInstance.map);
            setInfoWindows([...infoWindows, infoWindow]);
            setStatus('💬 InfoWindow created and opened');
          },
        },
        {
          name: 'openInfoWindow',
          description: 'Open InfoWindow on marker',
          action: () => {
            if (
              !mapInstance ||
              markers.length === 0 ||
              infoWindows.length === 0
            ) {
              setStatus('⚠️ Add markers and InfoWindows first');
              return;
            }
            const marker = markers[selectedMarkerIndex] || markers[0];
            const infoWindow = infoWindows[0];
            openInfoWindow(infoWindow, marker, mapInstance.map);
            setStatus('💬 InfoWindow opened');
          },
        },
        {
          name: 'closeInfoWindow',
          description: 'Close InfoWindow',
          action: () => {
            if (!mapInstance || infoWindows.length === 0) {
              setStatus('⚠️ No InfoWindows to close');
              return;
            }
            const infoWindow = infoWindows[0];
            closeInfoWindow(infoWindow);
            setStatus('💬 InfoWindow closed');
          },
        },
        {
          name: 'addMarkerWithInfoWindow',
          description: 'Add marker with InfoWindow',
          action: () => {
            if (!mapInstance) return;
            const center = getMapCenter(mapInstance.map);
            const result = addMarkerWithInfoWindow(
              mapInstance.map,
              {
                position: center,
                title: markerTitle,
              },
              {
                content: infoWindowContent,
              }
            );
            setMarkers([...markers, result.marker]);
            setInfoWindows([...infoWindows, result.infoWindow]);
            setStatus('📍 Added marker with InfoWindow');
          },
        },
        {
          name: 'getMarkerPosition',
          description: 'Get marker position',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers available');
              return;
            }
            const marker = markers[selectedMarkerIndex] || markers[0];
            const position = getMarkerPosition(marker);
            if (position) {
              setStatus(
                `📍 Marker position: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
              );
            } else {
              setStatus('❌ Could not get marker position');
            }
          },
        },
        {
          name: 'setMarkerDraggable',
          description: 'Toggle marker draggable',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers available');
              return;
            }
            const marker = markers[selectedMarkerIndex] || markers[0];
            const isDraggable = marker.getDraggable();
            setMarkerDraggable(marker, !isDraggable);
            setStatus(
              `🖱️ Marker draggable: ${!isDraggable ? 'Enabled' : 'Disabled'}`
            );
          },
        },
        {
          name: 'addMarkerClickListener',
          description: 'Add click listener to marker',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers available');
              return;
            }
            const marker = markers[selectedMarkerIndex] || markers[0];
            addMarkerClickListener(marker, () => {
              setStatus('🖱️ Marker clicked!');
            });
            setStatus('🖱️ Click listener added to marker');
          },
        },
        {
          name: 'clearMarkers',
          description: 'Clear all markers',
          action: () => {
            if (!mapInstance) return;
            clearMarkers(mapInstance);
            setMarkers([]);
            setStatus('🧹 All markers cleared');
          },
        },
        {
          name: 'clearInfoWindows',
          description: 'Clear all InfoWindows',
          action: () => {
            if (!mapInstance) return;
            clearInfoWindows(mapInstance);
            setInfoWindows([]);
            setStatus('🧹 All InfoWindows cleared');
          },
        },
      ],
    },
    {
      category: '🌍 Geocoding',
      functions: [
        {
          name: 'geocodeAsync',
          description: 'Geocode user address',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus(`🔍 Geocoding: ${userAddress}...`);
              const results = await geocodeAsync(userAddress);
              const result = results[0];

              const marker = addMarker(mapInstance.map, {
                position: result.location,
                title: result.address,
              });
              setMarkers([...markers, marker]);

              setMapCenter(mapInstance.map, result.location);
              setMapZoom(mapInstance.map, 16);

              setStatus(`✅ Found: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Geocoding failed: ${error.message}`);
            }
          },
        },
        {
          name: 'reverseGeocodeAsync',
          description: 'Reverse geocode current center',
          action: async () => {
            if (!mapInstance) return;
            try {
              const center = getMapCenter(mapInstance.map);
              setStatus('🔍 Reverse geocoding current location...');
              const results = await reverseGeocodeAsync(center);
              const result = results[0];
              setStatus(`✅ Current location: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Reverse geocoding failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeFirst',
          description: 'Get first geocode result',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus(`🔍 Getting first result for: ${userAddress}...`);
              const result = await geocodeFirst(userAddress);
              setStatus(`✅ First result: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Geocoding failed: ${error.message}`);
            }
          },
        },
        {
          name: 'reverseGeocodeFirst',
          description: 'Get first reverse geocode result',
          action: async () => {
            if (!mapInstance) return;
            try {
              const center = getMapCenter(mapInstance.map);
              setStatus('🔍 Getting first reverse geocode result...');
              const result = await reverseGeocodeFirst(center);
              setStatus(`✅ First result: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Reverse geocoding failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeWithComponents',
          description: 'Geocode with country restriction',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus(`🔍 Geocoding with country restriction...`);
              const results = await geocodeWithComponents(
                userAddress,
                {
                  country: 'US',
                },
                () => {}
              );
              const result = results[0];
              setStatus(`✅ Found in US: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Geocoding failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeWithBounds',
          description: 'Geocode within bounds',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus(`🔍 Geocoding within bounds...`);
              const bounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(40.7, -74.1),
                new google.maps.LatLng(40.8, -73.9)
              );
              const results = await geocodeWithBounds(
                userAddress,
                bounds,
                () => {}
              );
              const result = results[0];
              setStatus(`✅ Found in bounds: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Geocoding failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeWithRegion',
          description: 'Geocode with region bias',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus(`🔍 Geocoding with region bias...`);
              const results = await geocodeWithRegion(
                userAddress,
                'US',
                () => {}
              );
              const result = results[0];
              setStatus(`✅ Found with region bias: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Geocoding failed: ${error.message}`);
            }
          },
        },
      ],
    },
    {
      category: '🛣️ Directions & Routes',
      functions: [
        {
          name: 'getDirectionsAsync',
          description: 'Get directions between addresses',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus(
                `🛣️ Getting directions from ${originAddress} to ${destinationAddress}...`
              );
              const directions = await getDirectionsAsync({
                origin: originAddress,
                destination: destinationAddress,
                travelMode: google.maps.TravelMode.DRIVING,
              });

              const renderer = new google.maps.DirectionsRenderer();
              renderer.setMap(mapInstance.map);
              renderer.setDirections(directions);

              const distance = getTotalDistance(directions);
              const duration = getTotalDuration(directions);

              setStatus(
                `✅ Route: ${(distance / 1000).toFixed(0)}km, ${(duration / 3600).toFixed(1)}h`
              );
            } catch (error) {
              setStatus(`❌ Directions failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getDistanceMatrixAsync',
          description: 'Calculate distances between points',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus('📏 Calculating distance matrix...');
              const results = await getDistanceMatrixAsync({
                origins: [originAddress],
                destinations: [destinationAddress, 'Chicago, IL', 'Miami, FL'],
                travelMode: google.maps.TravelMode.DRIVING,
              });

              let message = '📏 Distances: ';
              results.forEach((result, index) => {
                const destinations = [destinationAddress, 'Chicago', 'Miami'];
                message += `${destinations[index]}: ${result.distance.text} `;
              });

              setStatus(message);
            } catch (error) {
              setStatus(`❌ Distance matrix failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getTotalDistance',
          description: 'Get total distance of route',
          action: async () => {
            if (!mapInstance) return;
            try {
              const directions = await getDirectionsAsync({
                origin: originAddress,
                destination: destinationAddress,
                travelMode: google.maps.TravelMode.DRIVING,
              });
              const distance = getTotalDistance(directions);
              setStatus(
                `📏 Total distance: ${(distance / 1000).toFixed(1)} km`
              );
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getTotalDuration',
          description: 'Get total duration of route',
          action: async () => {
            if (!mapInstance) return;
            try {
              const directions = await getDirectionsAsync({
                origin: originAddress,
                destination: destinationAddress,
                travelMode: google.maps.TravelMode.DRIVING,
              });
              const duration = getTotalDuration(directions);
              setStatus(
                `⏱️ Total duration: ${(duration / 3600).toFixed(1)} hours`
              );
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'fitMapToRoute',
          description: 'Fit map to show route',
          action: async () => {
            if (!mapInstance) return;
            try {
              const directions = await getDirectionsAsync({
                origin: originAddress,
                destination: destinationAddress,
                travelMode: google.maps.TravelMode.DRIVING,
              });
              fitMapToRoute(mapInstance.map, directions);
              setStatus('📐 Map fitted to route');
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'clearDirections',
          description: 'Clear directions from map',
          action: () => {
            if (!mapInstance) return;
            try {
              const directionsRenderer = new google.maps.DirectionsRenderer();
              directionsRenderer.setMap(mapInstance.map);
              clearDirections(directionsRenderer);
              setStatus('🧹 Directions cleared from map');
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'createDirectionsService',
          description: 'Create directions service',
          action: () => {
            if (!mapInstance) return;
            const service = createDirectionsService(mapInstance);
            setStatus('🚗 Directions service created');
          },
        },
        {
          name: 'createDirectionsRenderer',
          description: 'Create directions renderer',
          action: () => {
            if (!mapInstance) return;
            const renderer = createDirectionsRenderer(mapInstance);
            renderer.setMap(mapInstance.map);
            setStatus('🎨 Directions renderer created and attached');
          },
        },
        {
          name: 'createDistanceMatrixService',
          description: 'Create distance matrix service',
          action: () => {
            if (!mapInstance) return;
            const service = createDistanceMatrixService(mapInstance);
            setStatus('📏 Distance matrix service created');
          },
        },
      ],
    },
    {
      category: '🔍 Places & Autocomplete',
      functions: [
        {
          name: 'createAutocomplete',
          description: 'Create autocomplete input',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }

            const autocomplete = createAutocomplete({
              input,
              types: ['establishment'],
            });

            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();
              if (place.geometry) {
                const marker = addMarker(mapInstance.map, {
                  position: {
                    lat: place.geometry.location!.lat(),
                    lng: place.geometry.location!.lng(),
                  },
                  title: place.name || 'Selected Place',
                });
                setMarkers([...markers, marker]);
                setMapCenter(mapInstance.map, {
                  lat: place.geometry.location!.lat(),
                  lng: place.geometry.location!.lng(),
                });
                setStatus(`✅ Selected: ${place.name || 'Place'}`);
              }
            });

            setStatus('🔍 Autocomplete created! Try typing a place name');
          },
        },
        {
          name: 'getSelectedPlace',
          description: 'Get selected place from autocomplete',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const place = getSelectedPlace(autocomplete);
            setStatus(`📍 Selected place: ${place?.name || 'None'}`);
          },
        },
        {
          name: 'setAutocompleteTypes',
          description: 'Set autocomplete types',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            setAutocompleteTypes(autocomplete, ['restaurant', 'lodging']);
            setStatus('🍽️ Autocomplete types set to restaurants and hotels');
          },
        },
        {
          name: 'getAutocompleteTypes',
          description: 'Get autocomplete types',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const types = getAutocompleteTypes(autocomplete);
            setStatus(`📋 Autocomplete types: ${types.join(', ')}`);
          },
        },
        {
          name: 'setAutocompleteBounds',
          description: 'Set autocomplete bounds',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const bounds = new google.maps.LatLngBounds(
              new google.maps.LatLng(40.7, -74.1),
              new google.maps.LatLng(40.8, -73.9)
            );
            setAutocompleteBounds(autocomplete, bounds);
            setStatus('📐 Autocomplete bounds set to NYC area');
          },
        },
        {
          name: 'getAutocompleteBounds',
          description: 'Get autocomplete bounds',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const bounds = getAutocompleteBounds(autocomplete);
            setStatus(`📐 Autocomplete bounds: ${bounds ? 'Set' : 'Not set'}`);
          },
        },
        {
          name: 'setAutocompleteComponentRestrictions',
          description: 'Set autocomplete country restrictions',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            setAutocompleteComponentRestrictions(autocomplete, {
              country: 'us',
            });
            setStatus('🇺🇸 Autocomplete restricted to US');
          },
        },
        {
          name: 'getAutocompleteComponentRestrictions',
          description: 'Get autocomplete restrictions',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const restrictions =
              getAutocompleteComponentRestrictions(autocomplete);
            setStatus(
              `📋 Restrictions: ${restrictions ? JSON.stringify(restrictions) : 'None'}`
            );
          },
        },
        {
          name: 'clearAutocomplete',
          description: 'Clear autocomplete input',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            clearAutocomplete(autocomplete);
            setStatus('🧹 Autocomplete cleared');
          },
        },
        {
          name: 'focusAutocomplete',
          description: 'Focus autocomplete input',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            focusAutocomplete(autocomplete);
            setStatus('🎯 Autocomplete focused');
          },
        },
        {
          name: 'addPlaceChangedListener',
          description: 'Add place changed listener to autocomplete',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            addPlaceChangedListener(autocomplete, (place) => {
              if (place.geometry) {
                setStatus(`📍 Place selected: ${place.name || 'Unknown'}`);
                // Add marker at selected place
                const marker = addMarker(mapInstance.map, {
                  position: {
                    lat: place.geometry.location!.lat(),
                    lng: place.geometry.location!.lng(),
                  },
                  title: place.name || 'Selected Place',
                });
                setMarkers([...markers, marker]);
              }
            });
            setStatus('👂 Place changed listener added to autocomplete');
          },
        },
        {
          name: 'createSearchBox',
          description: 'Create search box',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'search-box-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Search box input not found');
              return;
            }
            const searchBox = createSearchBox(input, mapInstance.map);
            bindAutocompleteToMap(mapInstance, { input: input });
            setStatus('🔍 Search box created and bound to map');
          },
        },
        {
          name: 'addPlacesChangedListener',
          description: 'Add places changed listener',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'search-box-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Search box input not found');
              return;
            }
            const searchBox = createSearchBox(input, mapInstance.map);
            addPlacesChangedListener(searchBox, (places) => {
              setStatus(`🔍 Places changed: ${places.length} places found`);
            });
            setStatus('👂 Places changed listener added');
          },
        },
        {
          name: 'setAutocompleteBounds',
          description: 'Set autocomplete bounds',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const bounds = mapInstance.map.getBounds();
            setAutocompleteBounds(autocomplete, bounds);
            setStatus('🗺️ Autocomplete bounds set to map bounds');
          },
        },
        {
          name: 'setAutocompleteComponentRestrictions',
          description: 'Set component restrictions',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            setAutocompleteComponentRestrictions(autocomplete, {
              country: 'us',
            });
            setStatus('🇺🇸 Component restrictions set to US only');
          },
        },
        {
          name: 'setAutocompleteTypes',
          description: 'Set autocomplete types',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            setAutocompleteTypes(autocomplete, ['establishment']);
            setStatus('🏢 Autocomplete types set to establishments');
          },
        },
        {
          name: 'getAutocompleteBounds',
          description: 'Get autocomplete bounds',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const bounds = getAutocompleteBounds(autocomplete);
            setStatus(`📐 Autocomplete bounds: ${bounds ? 'Set' : 'Not set'}`);
          },
        },
        {
          name: 'getAutocompleteComponentRestrictions',
          description: 'Get component restrictions',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const restrictions =
              getAutocompleteComponentRestrictions(autocomplete);
            setStatus(
              `🌍 Component restrictions: ${restrictions ? 'Set' : 'None'}`
            );
          },
        },
        {
          name: 'getAutocompleteTypes',
          description: 'Get autocomplete types',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const types = getAutocompleteTypes(autocomplete);
            setStatus(`🏷️ Autocomplete types: ${types.join(', ') || 'None'}`);
          },
        },
        {
          name: 'clearAutocomplete',
          description: 'Clear autocomplete',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            clearAutocomplete(autocomplete);
            setStatus('🧹 Autocomplete cleared');
          },
        },
        {
          name: 'focusAutocomplete',
          description: 'Focus autocomplete input',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            focusAutocomplete(autocomplete);
            setStatus('🎯 Autocomplete focused');
          },
        },
      ],
    },
    {
      category: '🌍 Advanced Geocoding',
      functions: [
        {
          name: 'geocodeWithComponents',
          description: 'Geocode with component filtering',
          action: async () => {
            try {
              await geocodeWithComponents(
                userAddress,
                {
                  country: 'US',
                  administrativeArea: 'NY',
                },
                () => {}
              );
              setStatus(`🌍 Geocoded with components successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeWithBounds',
          description: 'Geocode within bounds',
          action: async () => {
            try {
              const bounds = new google.maps.LatLngBounds(
                { lat: 40.7, lng: -74.1 },
                { lat: 40.8, lng: -73.9 }
              );
              await geocodeWithBounds(userAddress, bounds, () => {});
              setStatus(`🗺️ Geocoded within bounds successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeWithRegion',
          description: 'Geocode with region bias',
          action: async () => {
            try {
              await geocodeWithRegion(userAddress, 'US', () => {});
              setStatus(`🇺🇸 Geocoded with region bias successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeFirst',
          description: 'Get first geocoding result',
          action: async () => {
            try {
              const result = await geocodeFirst(userAddress);
              if (result) {
                setStatus(`📍 First result: ${result.address}`);
              } else {
                setStatus('❌ No results found');
              }
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'reverseGeocodeFirst',
          description: 'Get first reverse geocoding result',
          action: async () => {
            try {
              const [lat, lng] = userCoordinates.split(',').map(Number);
              const result = await reverseGeocodeFirst({ lat, lng });
              if (result) {
                setStatus(`📍 Reverse geocoded: ${result.address}`);
              } else {
                setStatus('❌ No results found');
              }
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocode',
          description: 'Geocode address (sync)',
          action: () => {
            try {
              geocode(userAddress, () => {});
              setStatus(`🌍 Geocoded (sync) successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'reverseGeocode',
          description: 'Reverse geocode coordinates (sync)',
          action: () => {
            try {
              const [lat, lng] = userCoordinates.split(',').map(Number);
              reverseGeocode({ lat, lng }, () => {});
              setStatus(`📍 Reverse geocoded (sync) successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getDirections',
          description: 'Get directions (sync)',
          action: () => {
            try {
              getDirections(
                {
                  origin: originAddress,
                  destination: destinationAddress,
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                () => {}
              );
              setStatus(`🚗 Directions (sync) successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'renderDirections',
          description: 'Render directions on map',
          action: async () => {
            if (!mapInstance) return;
            try {
              const directions = await getDirectionsAsync({
                origin: originAddress,
                destination: destinationAddress,
                travelMode: google.maps.TravelMode.DRIVING,
              });
              const directionsRenderer = new google.maps.DirectionsRenderer();
              directionsRenderer.setMap(mapInstance.map);
              renderDirections(mapInstance.map, directions);
              setStatus('🎨 Directions rendered on map');
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getDistanceMatrix',
          description: 'Get distance matrix (sync)',
          action: () => {
            try {
              getDistanceMatrix(
                {
                  origins: [originAddress],
                  destinations: [destinationAddress],
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                () => {}
              );
              setStatus(`📏 Distance matrix (sync) successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getDistanceMatrixAsync',
          description: 'Get distance matrix (async)',
          action: async () => {
            try {
              const matrix = await getDistanceMatrixAsync({
                origins: [originAddress],
                destinations: [destinationAddress],
                travelMode: google.maps.TravelMode.DRIVING,
              });
              setStatus(`📏 Distance matrix (async): ${matrix.length} results`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'addMarkerClickListener',
          description: 'Add marker click listener',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers available');
              return;
            }
            const marker = markers[0];
            addMarkerClickListener(marker, () => {
              setStatus('👆 Marker clicked!');
            });
            setStatus('👂 Marker click listener added');
          },
        },
        {
          name: 'addMarkerDragListener',
          description: 'Add marker drag listener',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers available');
              return;
            }
            const marker = markers[0];
            addMarkerDragListener(marker, () => {
              setStatus('🖱️ Marker being dragged!');
            });
            setStatus('👂 Marker drag listener added');
          },
        },
        {
          name: 'addMarkerDragEndListener',
          description: 'Add marker drag end listener',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers available');
              return;
            }
            const marker = markers[0];
            addMarkerDragEndListener(marker, () => {
              setStatus('🏁 Marker drag ended!');
            });
            setStatus('👂 Marker drag end listener added');
          },
        },
        {
          name: 'getDirectionsBounds',
          description: 'Get directions route bounds',
          action: async () => {
            try {
              const directions = await getDirectionsAsync({
                origin: originAddress,
                destination: destinationAddress,
                travelMode: google.maps.TravelMode.DRIVING,
              });
              const bounds = getDirectionsBounds(directions);
              if (bounds) {
                setStatus(
                  `📐 Directions bounds: ${bounds.getNorthEast().lat()}, ${bounds.getNorthEast().lng()}`
                );
              } else {
                setStatus('❌ No bounds available');
              }
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
      ],
    },
    {
      category: '🗺️ Directions & Routes',
      functions: [
        {
          name: 'getDirectionsAsync',
          description: 'Get directions between two points',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus('🗺️ Getting directions from NYC to Boston...');
              const results = await getDirectionsAsync({
                origin: 'New York, NY',
                destination: 'Boston, MA',
                travelMode: google.maps.TravelMode.DRIVING,
              });
              setStatus(
                `🗺️ Directions found! Distance: ${getTotalDistance(results)} km, Duration: ${getTotalDuration(results)} min`
              );
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getTotalDistance',
          description: 'Calculate total distance of route',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus('📏 Calculating route distance...');
              const results = await getDirectionsAsync({
                origin: 'New York, NY',
                destination: 'Los Angeles, CA',
                travelMode: google.maps.TravelMode.DRIVING,
              });
              const distance = getTotalDistance(results);
              setStatus(`📏 Total distance: ${distance} km`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'fitMapToRoute',
          description: 'Fit map to show entire route',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus('🗺️ Fitting map to route...');
              const results = await getDirectionsAsync({
                origin: 'New York, NY',
                destination: 'Miami, FL',
                travelMode: google.maps.TravelMode.DRIVING,
              });
              fitMapToRoute(mapInstance.map, results);
              setStatus('🗺️ Map fitted to route bounds');
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
      ],
    },
    {
      category: '🏪 Places & Autocomplete',
      functions: [
        {
          name: 'createAutocomplete',
          description: 'Create address autocomplete',
          action: () => {
            if (!mapInstance) return;
            try {
              setStatus('🏪 Creating autocomplete input...');
              const input = document.createElement('input');
              input.type = 'text';
              input.placeholder = 'Search for a place...';
              input.style.cssText =
                'width: 100%; padding: 8px; margin: 4px 0; border: 1px solid #ccc; border-radius: 4px;';

              const autocomplete = createAutocomplete({
                input,
                types: ['establishment'],
                bounds: new google.maps.LatLngBounds(
                  new google.maps.LatLng(40.7, -74.1),
                  new google.maps.LatLng(40.8, -73.9)
                ),
              });

              addPlaceChangedListener(autocomplete, (place) => {
                if (place.geometry?.location) {
                  setStatus(`🏪 Place selected: ${place.name || 'Unknown'}`);
                }
              });

              setStatus(
                '🏪 Autocomplete created! Check the map area for the input field.'
              );
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'createSearchBox',
          description: 'Create places search box',
          action: () => {
            if (!mapInstance) return;
            try {
              setStatus('🔍 Creating search box...');
              const input = document.createElement('input');
              input.type = 'text';
              input.placeholder = 'Search for places...';
              input.style.cssText =
                'width: 100%; padding: 8px; margin: 4px 0; border: 1px solid #ccc; border-radius: 4px;';

              const searchBox = createSearchBox(input, mapInstance.map);

              addPlacesChangedListener(searchBox, (places) => {
                setStatus(`🔍 Found ${places.length} places`);
              });

              setStatus(
                '🔍 Search box created! Check the map area for the input field.'
              );
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
      ],
    },
    {
      category: '📏 Distance Matrix',
      functions: [
        {
          name: 'getDistanceMatrixAsync',
          description: 'Calculate distances between multiple points',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus('📏 Calculating distance matrix...');
              const results = await getDistanceMatrixAsync({
                origins: ['New York, NY', 'Boston, MA'],
                destinations: ['Chicago, IL', 'Miami, FL', 'Los Angeles, CA'],
                travelMode: google.maps.TravelMode.DRIVING,
              });

              let message = '📏 Distance Matrix Results:\n';
              const origins = ['NYC', 'Boston'];
              const destinations = ['Chicago', 'Miami', 'LA'];

              results.forEach((result) => {
                const origin = origins[result.originIndex];
                const destination = destinations[result.destinationIndex];
                message += `${origin} → ${destination}: ${result.distance.text}\n`;
              });

              setStatus(message);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
      ],
    },
    {
      category: '🌐 Geocoding Web Service',
      functions: [
        {
          name: 'geocodingClient.geocode',
          description: 'Geocode address using REST API',
          action: async () => {
            if (!geocodingClient) return;
            try {
              setStatus(`🔍 Geocoding via REST API: ${userAddress}...`);
              const response = await geocodingClient.geocode({
                address: userAddress,
                language: 'en',
                region: 'us',
              });

              if (response.results.length > 0) {
                const result = response.results[0];
                const marker = addMarker(mapInstance.map, {
                  position: {
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng,
                  },
                  title: result.formatted_address,
                });
                setMarkers([...markers, marker]);
                setStatus(`✅ REST Geocoding: ${result.formatted_address}`);
              } else {
                setStatus('❌ No results found via REST API');
              }
            } catch (error) {
              setStatus(`❌ REST Geocoding failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodingClient.reverseGeocode',
          description: 'Reverse geocode using REST API',
          action: async () => {
            if (!geocodingClient) return;
            try {
              const [lat, lng] = userCoordinates.split(',').map(Number);
              setStatus('🔍 Reverse geocoding via REST API...');
              const response = await geocodingClient.reverseGeocode({
                latlng: { lat, lng },
                language: 'en',
              });

              if (response.results.length > 0) {
                const result = response.results[0];
                setStatus(
                  `✅ REST Reverse Geocoding: ${result.formatted_address}`
                );
              } else {
                setStatus('❌ No results found via REST API');
              }
            } catch (error) {
              setStatus(`❌ REST Reverse Geocoding failed: ${error.message}`);
            }
          },
        },
      ],
    },
    {
      category: '🏪 Places Web Service',
      functions: [
        {
          name: 'placesClient.textSearch',
          description: 'Search places using REST API',
          action: async () => {
            if (!placesClient) return;
            try {
              setStatus(`🏪 Searching places via REST API: ${searchPlace}...`);
              const response = await placesClient.textSearch({
                query: `${searchPlace} in New York`,
                language: 'en',
                region: 'us',
              });

              if (response.results.length > 0) {
                const result = response.results[0];
                const marker = addMarker(mapInstance.map, {
                  position: {
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng,
                  },
                  title: result.name || 'Found Place',
                });
                setMarkers([...markers, marker]);
                setStatus(`✅ Found via REST API: ${result.name || 'Place'}`);
              } else {
                setStatus('❌ No places found via REST API');
              }
            } catch (error) {
              setStatus(`❌ Places REST API failed: ${error.message}`);
            }
          },
        },
        {
          name: 'placesClient.nearbySearch',
          description: 'Search nearby places using REST API',
          action: async () => {
            if (!placesClient) return;
            try {
              const center = getMapCenter(mapInstance.map);
              setStatus('🏪 Searching nearby places via REST API...');
              const response = await placesClient.nearbySearch({
                location: center,
                radius: 1000,
                type: 'restaurant',
                language: 'en',
              });

              if (response.results.length > 0) {
                const result = response.results[0];
                const marker = addMarker(mapInstance.map, {
                  position: {
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng,
                  },
                  title: result.name || 'Nearby Place',
                });
                setMarkers([...markers, marker]);
                setStatus(`✅ Found nearby: ${result.name || 'Place'}`);
              } else {
                setStatus('❌ No nearby places found via REST API');
              }
            } catch (error) {
              setStatus(`❌ Nearby search failed: ${error.message}`);
            }
          },
        },
        {
          name: 'placesClient.placeDetails',
          description: 'Get place details using REST API',
          action: async () => {
            if (!placesClient) return;
            try {
              setStatus('🏪 Getting place details via REST API...');
              // Use a well-known place ID for demo
              const response = await placesClient.placeDetails({
                placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4', // Times Square
                fields: ['name', 'formatted_address', 'rating', 'types'],
                language: 'en',
              });

              const place = response.result;
              setStatus(
                `✅ Place Details: ${place.name} - ${place.formatted_address} (Rating: ${place.rating || 'N/A'})`
              );
            } catch (error) {
              setStatus(`❌ Place details failed: ${error.message}`);
            }
          },
        },
      ],
    },
    {
      category: '🛣️ Street View',
      functions: [
        {
          name: 'createStreetViewPanorama',
          description: 'Create Street View panorama',
          action: () => {
            if (!mapInstance) return;
            try {
              setStatus('🛣️ Creating Street View panorama...');
              const streetView = createStreetViewPanorama(
                'street-view-container',
                {
                  position: { lat: 40.758, lng: -73.9855 }, // Times Square
                  pov: { heading: 0, pitch: 0 },
                  zoom: 1,
                }
              );
              setStreetViewInstance(streetView);
              setStatus('✅ Street View panorama created!');
            } catch (error) {
              setStatus(`❌ Street View creation failed: ${error.message}`);
            }
          },
        },
        {
          name: 'setStreetViewPosition',
          description: 'Update Street View position',
          action: () => {
            if (!streetViewInstance) {
              setStatus('⚠️ Create Street View first');
              return;
            }
            try {
              const [lat, lng] = userCoordinates.split(',').map(Number);
              setStreetViewPosition(streetViewInstance.panorama, { lat, lng });
              setStatus(
                `🛣️ Street View position updated to ${userCoordinates}`
              );
            } catch (error) {
              setStatus(
                `❌ Street View position update failed: ${error.message}`
              );
            }
          },
        },
        {
          name: 'setStreetViewPov',
          description: 'Update Street View point of view',
          action: () => {
            if (!streetViewInstance) {
              setStatus('⚠️ Create Street View first');
              return;
            }
            try {
              setStreetViewPov(streetViewInstance.panorama, {
                heading: 90,
                pitch: 10,
              });
              setStatus(
                '🛣️ Street View POV updated (heading: 90°, pitch: 10°)'
              );
            } catch (error) {
              setStatus(`❌ Street View POV update failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getStreetViewPosition',
          description: 'Get current Street View position',
          action: () => {
            if (!streetViewInstance) {
              setStatus('⚠️ Create Street View first');
              return;
            }
            try {
              const position = getStreetViewPosition(
                streetViewInstance.panorama
              );
              if (position) {
                setStatus(
                  `🛣️ Street View position: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
                );
              } else {
                setStatus('❌ Could not get Street View position');
              }
            } catch (error) {
              setStatus(
                `❌ Failed to get Street View position: ${error.message}`
              );
            }
          },
        },
        {
          name: 'getStreetViewPov',
          description: 'Get current Street View POV',
          action: () => {
            if (!streetViewInstance) {
              setStatus('⚠️ Create Street View first');
              return;
            }
            try {
              const pov = getStreetViewPov(streetViewInstance.panorama);
              setStatus(
                `🛣️ Street View POV: heading ${pov.heading}°, pitch ${pov.pitch}°`
              );
            } catch (error) {
              setStatus(`❌ Failed to get Street View POV: ${error.message}`);
            }
          },
        },
        {
          name: 'setStreetViewVisibility',
          description: 'Toggle Street View visibility',
          action: () => {
            if (!streetViewInstance) {
              setStatus('⚠️ Create Street View first');
              return;
            }
            try {
              const isVisible = isStreetViewVisible(
                streetViewInstance.panorama
              );
              setStreetViewVisibility(streetViewInstance.panorama, !isVisible);
              setStatus(
                `🛣️ Street View visibility: ${!isVisible ? 'Shown' : 'Hidden'}`
              );
            } catch (error) {
              setStatus(
                `❌ Street View visibility toggle failed: ${error.message}`
              );
            }
          },
        },
      ],
    },
  ];

  // If React package is selected, render the React demo with package selector
  if (selectedPackage === 'react') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Package Selector */}
        <PackageSelector
          selectedPackage={selectedPackage}
          onPackageChange={setSelectedPackage}
        />
        <ReactDemo />
      </div>
    );
  }

  // If Docs package is selected, render the documentation
  if (selectedPackage === 'docs') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Package Selector */}
        <PackageSelector
          selectedPackage={selectedPackage}
          onPackageChange={setSelectedPackage}
        />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <DocsSection />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Package Selector */}
      <PackageSelector
        selectedPackage={selectedPackage}
        onPackageChange={setSelectedPackage}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                @gmaps-kit/core
              </h1>
              <p className="text-sm text-gray-600">
                Framework-agnostic utilities for Google Maps
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto h-screen sticky top-0">
          {/* API Key Setup */}
          <div className="google-card mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              🔑 API Key
            </h3>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter Google Maps API key"
              className="google-input mb-4"
            />
            <button
              onClick={handleLoadMaps}
              disabled={!apiKey || apiKey === 'YOUR_API_KEY' || isLoaded}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isLoaded
                  ? 'bg-green-500 text-white cursor-default'
                  : 'google-button-primary'
              }`}
            >
              {isLoaded ? '✅ Maps Loaded' : 'Load Google Maps'}
            </button>
          </div>

          {/* Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="text-blue-700 font-semibold mb-2">📊 Status</h4>
            <p className="text-sm text-gray-600 mb-2">{status}</p>
            {selectedFunction && (
              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                🎯 Running: {selectedFunction}
              </div>
            )}
          </div>

          {/* Demo Functions */}
          <div className={`relative ${!isLoaded ? 'pointer-events-none' : ''}`}>
            {!isLoaded && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/30 z-10 rounded-lg"></div>
            )}
            <h3 className="text-gray-700 font-semibold mb-4">
              🧪 Try gmaps-kit Functions
              {!isLoaded && (
                <span className="text-xs text-red-500 ml-2">
                  (Enter API key to enable)
                </span>
              )}
            </h3>

            {demoFunctions.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-4">
                <h4 className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2 bg-gray-100 px-2 py-1 rounded">
                  {category.category}
                </h4>

                {category.functions.map((func, funcIndex) => (
                  <button
                    key={funcIndex}
                    onClick={() => {
                      if (!isLoaded) {
                        setStatus(
                          '⚠️ Please enter your Google Maps API key first'
                        );
                        return;
                      }
                      setSelectedFunction(func.name);
                      func.action();
                    }}
                    disabled={!isLoaded}
                    className={`w-full p-2 mb-1 text-left transition-all duration-200 rounded-md text-xs ${
                      !isLoaded
                        ? 'cursor-not-allowed bg-gray-50 border-2 border-dashed border-gray-300 text-gray-600'
                        : selectedFunction === func.name
                          ? 'bg-blue-100 border-blue-300 border text-blue-800 cursor-pointer'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:shadow-sm cursor-pointer'
                    }`}
                  >
                    <div className="font-medium">{func.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {func.description}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex gap-6">
            {/* Map and Controls */}
            <div className="flex-1">
              {/* Map Container */}
              <div className="google-card">
                <div
                  id="map-container"
                  className="h-96 w-full bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg"
                >
                  {!isLoaded ? (
                    <div className="text-center">
                      <div className="text-5xl mb-3">🗺️</div>
                      <div className="text-lg font-medium mb-2">
                        Welcome to gmaps-kit!
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        Enter your Google Maps API key above to start exploring
                      </div>
                      <div className="text-xs text-gray-500">
                        You can see all available features in the sidebar -
                        they'll be enabled once you provide an API key
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-5xl mb-3">✅</div>
                      <div>Map loaded! Try the functions in the sidebar</div>
                    </div>
                  )}
                </div>
              </div>

              {/* User Input Fields */}
              {isLoaded && (
                <div className="mt-6 google-card">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    🎛️ User Input Fields
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address to Geocode:
                      </label>
                      <input
                        type="text"
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                        placeholder="Enter address"
                        className="google-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coordinates (lat, lng):
                      </label>
                      <input
                        type="text"
                        value={userCoordinates}
                        onChange={(e) => setUserCoordinates(e.target.value)}
                        placeholder="40.7580, -73.9855"
                        className="google-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Origin Address:
                      </label>
                      <input
                        type="text"
                        value={originAddress}
                        onChange={(e) => setOriginAddress(e.target.value)}
                        placeholder="New York, NY"
                        className="google-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destination Address:
                      </label>
                      <input
                        type="text"
                        value={destinationAddress}
                        onChange={(e) => setDestinationAddress(e.target.value)}
                        placeholder="Los Angeles, CA"
                        className="google-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marker Title:
                      </label>
                      <input
                        type="text"
                        value={markerTitle}
                        onChange={(e) => setMarkerTitle(e.target.value)}
                        placeholder="My Custom Marker"
                        className="google-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        InfoWindow Content:
                      </label>
                      <input
                        type="text"
                        value={infoWindowContent}
                        onChange={(e) => setInfoWindowContent(e.target.value)}
                        placeholder="Hello from gmaps-kit!"
                        className="google-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selected Marker Index:
                      </label>
                      <input
                        type="number"
                        value={selectedMarkerIndex}
                        onChange={(e) =>
                          setSelectedMarkerIndex(Number(e.target.value))
                        }
                        min="0"
                        max={markers.length - 1}
                        className="google-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Place Type:
                      </label>
                      <input
                        type="text"
                        value={searchPlace}
                        onChange={(e) => setSearchPlace(e.target.value)}
                        placeholder="restaurant"
                        className="google-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Autocomplete Input */}
              {isLoaded && (
                <div className="mt-6 google-card">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    🔍 Places Autocomplete
                  </h4>
                  <input
                    id="autocomplete-input"
                    type="text"
                    placeholder="Search for places (restaurants, hotels, etc.)"
                    className="google-input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          // Create autocomplete and trigger search
                          const autocomplete = createAutocomplete({ input });
                          const place = autocomplete.getPlace();
                          if (place && place.geometry) {
                            const marker = addMarker(mapInstance.map, {
                              position: {
                                lat: place.geometry.location!.lat(),
                                lng: place.geometry.location!.lng(),
                              },
                              title: place.name || 'Searched Place',
                            });
                            setMarkers([...markers, marker]);
                            setMapCenter(mapInstance.map, {
                              lat: place.geometry.location!.lat(),
                              lng: place.geometry.location!.lng(),
                            });
                            setStatus(
                              `✅ Added: ${place.name || 'Searched Place'}`
                            );
                          }
                        }
                      }
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-3">
                    Type a place name and press Enter to add it to the map
                  </p>
                </div>
              )}

              {/* Search Box Input */}
              {isLoaded && (
                <div className="mt-6 google-card">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    🔍 Search Box
                  </h4>
                  <input
                    id="search-box-input"
                    type="text"
                    placeholder="Search for places on the map"
                    className="google-input"
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          try {
                            setStatus(`🔍 Searching for: ${input.value}...`);

                            // Use geocoding to find the place
                            const results = await geocodeAsync(input.value);
                            if (results.length > 0) {
                              const result = results[0];

                              // Add marker at the found location
                              const marker = addMarker(mapInstance.map, {
                                position: result.location,
                                title: result.address,
                              });
                              setMarkers([...markers, marker]);

                              // Center map on the result
                              setMapCenter(mapInstance.map, result.location);
                              setMapZoom(mapInstance.map, 15);

                              setStatus(
                                `✅ Found and added: ${result.address}`
                              );
                            } else {
                              setStatus(
                                `❌ No results found for: ${input.value}`
                              );
                            }
                          } catch (error) {
                            setStatus(`❌ Search failed: ${error.message}`);
                          }
                        }
                      }
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-3">
                    Type an address and press Enter to search and add to map
                  </p>
                </div>
              )}

              {/* Street View Container */}
              {isLoaded && (
                <div className="mt-6 google-card">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    🛣️ Street View
                  </h4>
                  <div
                    id="street-view-container"
                    className="h-64 w-full bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg"
                  >
                    {!streetViewInstance ? (
                      <div className="text-center">
                        <div className="text-4xl mb-2">🛣️</div>
                        <div className="text-sm">
                          Click "Create Street View panorama" in sidebar
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-2">✅</div>
                        <div className="text-sm">
                          Street View panorama active
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-3">
                    Street View panorama will appear here when created
                  </p>
                </div>
              )}

              {/* Code Examples */}
              {isLoaded && (
                <div className="mt-6 google-card">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    💻 Code Examples
                  </h4>

                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-auto">
                    <div className="text-gray-500 mb-2">
                      // Import all gmaps-kit/core functions
                    </div>
                    <div className="text-pink-600">import {`{`}</div>
                    <div className="ml-5 text-blue-600">
                      loadGoogleMaps, createMap, addMarker,
                      <br />
                      geocodeAsync, getDirectionsAsync,
                      <br />
                      createAutocomplete, getMapCenter,
                      <br />
                      setMapCenter, clearMarkers,
                      <br />
                      getTotalDistance, fitMapToRoute
                    </div>
                    <div className="text-pink-600">
                      {`}`} from '@gmaps-kit/core';
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Function Documentation Panel */}
            {selectedFunction && (
              <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto h-screen sticky top-0">
                <div className="google-card">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    📚 Function Documentation
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {selectedFunction}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {demoFunctions
                          .flatMap((cat) => cat.functions)
                          .find((func) => func.name === selectedFunction)
                          ?.description || 'No description available'}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">
                        💻 Usage Example
                      </h5>
                      <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                        <div className="text-gray-500 mb-2">
                          // Import the function
                        </div>
                        <div className="text-pink-600">
                          import {`{`} {selectedFunction} {`}`} from
                          '@gmaps-kit/core';
                        </div>
                        <div className="mt-3 text-gray-500">// Basic usage</div>
                        <div className="text-blue-600">
                          {getFunctionExample(selectedFunction)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">
                        📋 Parameters
                      </h5>
                      <div className="text-sm text-gray-600">
                        {getFunctionParameters(selectedFunction)}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">
                        🔄 Returns
                      </h5>
                      <div className="text-sm text-gray-600">
                        {getFunctionReturns(selectedFunction)}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">
                        💡 Tips
                      </h5>
                      <div className="text-sm text-gray-600">
                        {getFunctionTips(selectedFunction)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
