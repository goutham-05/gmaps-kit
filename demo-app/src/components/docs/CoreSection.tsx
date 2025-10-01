import React from 'react';
import { SectionCard } from '../SectionCard';
import { CodeSnippet } from '../CodeSnippet';

export const CoreSection: React.FC = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Package</h2>
      <p className="text-lg text-gray-600">
        Framework-agnostic utilities for Google Maps JavaScript API integration.
      </p>
    </div>

    <div className="grid gap-6">
      {/* Script Loading */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Script Loading
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="loadGoogleMaps"
            description="Load Google Maps JavaScript API"
          >
            <CodeSnippet
              code={`import { loadGoogleMaps } from '@gmaps-kit/core';

const result = await loadGoogleMaps({
  apiKey: 'YOUR_API_KEY',
  libraries: ['places', 'geometry'],
  language: 'en',
  region: 'US',
});

console.log('Google Maps loaded:', result.isLoaded);`}
            />
          </SectionCard>

          <SectionCard
            title="isGoogleMapsLoaded"
            description="Check if Google Maps is already loaded"
          >
            <CodeSnippet
              code={`import { isGoogleMapsLoaded } from '@gmaps-kit/core';

if (isGoogleMapsLoaded()) {
  console.log('Google Maps is ready!');
} else {
  console.log('Loading Google Maps...');
}`}
            />
          </SectionCard>

          <SectionCard
            title="waitForGoogleMaps"
            description="Wait for Google Maps to be available"
          >
            <CodeSnippet
              code={`import { waitForGoogleMaps } from '@gmaps-kit/core';

try {
  await waitForGoogleMaps();
  console.log('Google Maps is now available!');
} catch (error) {
  console.error('Failed to load Google Maps:', error);
}`}
            />
          </SectionCard>
        </div>
      </div>

      {/* Map Management */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Map Management
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="createMap"
            description="Create a new Google Map instance"
          >
            <CodeSnippet
              code={`import { createMap } from '@gmaps-kit/core';

const mapInstance = createMap('map-container', {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 12,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  styles: customMapStyles,
});

console.log('Map created:', mapInstance.map);`}
            />
          </SectionCard>

          <SectionCard
            title="Map Center & Zoom"
            description="Get and set map center and zoom"
          >
            <CodeSnippet
              code={`import { getMapCenter, setMapCenter, getMapZoom, setMapZoom } from '@gmaps-kit/core';

// Get current center
const center = getMapCenter(map);
console.log('Current center:', center);

// Set new center
setMapCenter(map, { lat: 40.758, lng: -73.9855 });

// Get current zoom
const zoom = getMapZoom(map);
console.log('Current zoom:', zoom);

// Set new zoom
setMapZoom(map, 15);`}
            />
          </SectionCard>

          <SectionCard
            title="Map Utilities"
            description="Additional map utilities"
          >
            <CodeSnippet
              code={`import { fitMapToMarkers, panTo } from '@gmaps-kit/core';

// Fit map to show all markers
fitMapToMarkers(map, markers);

// Pan to a specific location
panTo(map, { lat: 40.758, lng: -73.9855 });`}
            />
          </SectionCard>
        </div>
      </div>

      {/* Marker Management */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Marker Management
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="addMarker" description="Add markers to the map">
            <CodeSnippet
              code={`import { addMarker } from '@gmaps-kit/core';

const marker = addMarker(map, {
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
  draggable: true,
  icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
});

console.log('Marker added:', marker);`}
            />
          </SectionCard>

          <SectionCard
            title="Marker Operations"
            description="Manage marker properties"
          >
            <CodeSnippet
              code={`import { 
  removeMarker, 
  updateMarkerPosition, 
  getMarkerPosition,
  setMarkerDraggable 
} from '@gmaps-kit/core';

// Update marker position
updateMarkerPosition(marker, { lat: 40.758, lng: -73.9855 });

// Get marker position
const position = getMarkerPosition(marker);
console.log('Marker position:', position);

// Set marker draggable
setMarkerDraggable(marker, true);

// Remove marker
removeMarker(marker);`}
            />
          </SectionCard>

          <SectionCard
            title="Marker Events"
            description="Add event listeners to markers"
          >
            <CodeSnippet
              code={`import { 
  addMarkerClickListener, 
  addMarkerDragListener,
  addMarkerDragEndListener 
} from '@gmaps-kit/core';

// Click listener
addMarkerClickListener(marker, (event) => {
  console.log('Marker clicked:', event.latLng);
});

// Drag listener
addMarkerDragListener(marker, (event) => {
  console.log('Marker dragging:', event.latLng);
});

// Drag end listener
addMarkerDragEndListener(marker, (event) => {
  console.log('Marker drag ended:', event.latLng);
});`}
            />
          </SectionCard>

          <SectionCard
            title="Batch Operations"
            description="Manage multiple markers"
          >
            <CodeSnippet
              code={`import { clearMarkers } from '@gmaps-kit/core';

// Clear all markers
clearMarkers(markers);

// Add multiple markers
const positions = [
  { lat: 40.7128, lng: -74.006 },
  { lat: 40.758, lng: -73.9855 },
  { lat: 40.6892, lng: -74.0445 },
];

const markers = positions.map((position, index) => 
  addMarker(map, {
    position,
    title: \`Marker \${index + 1}\`,
  })
);`}
            />
          </SectionCard>
        </div>
      </div>

      {/* InfoWindow Management */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          InfoWindow Management
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="createInfoWindow"
            description="Create InfoWindows"
          >
            <CodeSnippet
              code={`import { createInfoWindow } from '@gmaps-kit/core';

const infoWindow = createInfoWindow({
  content: '<h3>Hello World</h3><p>This is an InfoWindow</p>',
  position: { lat: 40.7128, lng: -74.006 },
});

console.log('InfoWindow created:', infoWindow);`}
            />
          </SectionCard>

          <SectionCard
            title="InfoWindow Operations"
            description="Open, close, and manage InfoWindows"
          >
            <CodeSnippet
              code={`import { 
  openInfoWindow, 
  closeInfoWindow, 
  updateMarkerContent,
  addMarkerWithInfoWindow,
  clearInfoWindows
} from '@gmaps-kit/core';

// Open InfoWindow
openInfoWindow(infoWindow, map, marker);

// Close InfoWindow
closeInfoWindow(infoWindow);

// Update marker content
updateMarkerContent(marker, '<h3>Updated Content</h3>');

// Create marker with InfoWindow
const markerWithInfo = addMarkerWithInfoWindow(map, {
  position: { lat: 40.7128, lng: -74.006 },
  title: 'Marker with InfoWindow',
  content: '<h3>Marker Info</h3>',
});

// Clear all InfoWindows
clearInfoWindows(infoWindows);`}
            />
          </SectionCard>
        </div>
      </div>

      {/* Geocoding */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Geocoding</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="geocode"
            description="Convert address to coordinates"
          >
            <CodeSnippet
              code={`import { geocode, geocodeAsync } from '@gmaps-kit/core';

// Callback-based geocoding
geocode('1600 Amphitheatre Parkway, Mountain View, CA', (results, status) => {
  if (status === google.maps.GeocoderStatus.OK) {
    console.log('Geocoding results:', results);
  }
});

// Promise-based geocoding
const results = await geocodeAsync('1600 Amphitheatre Parkway, Mountain View, CA');
console.log('Geocoding results:', results);`}
            />
          </SectionCard>

          <SectionCard
            title="reverseGeocode"
            description="Convert coordinates to address"
          >
            <CodeSnippet
              code={`import { reverseGeocode, reverseGeocodeAsync } from '@gmaps-kit/core';

// Callback-based reverse geocoding
reverseGeocode({ lat: 37.422, lng: -122.084 }, (results, status) => {
  if (status === google.maps.GeocoderStatus.OK) {
    console.log('Reverse geocoding results:', results);
  }
});

// Promise-based reverse geocoding
const results = await reverseGeocodeAsync({ lat: 37.422, lng: -122.084 });
console.log('Reverse geocoding results:', results);`}
            />
          </SectionCard>

          <SectionCard
            title="Advanced Geocoding"
            description="Geocoding with bounds, components, and region"
          >
            <CodeSnippet
              code={`import { 
  geocodeWithBounds, 
  geocodeWithComponents, 
  geocodeWithRegion,
  geocodeFirst,
  reverseGeocodeFirst
} from '@gmaps-kit/core';

// Geocode with bounds
const results = await geocodeWithBounds('coffee', {
  north: 40.9,
  south: 40.7,
  east: -74.0,
  west: -74.2,
});

// Geocode with components
const results = await geocodeWithComponents('coffee', {
  country: 'US',
  administrativeArea: 'CA',
});

// Geocode with region
const results = await geocodeWithRegion('coffee', 'US');

// Get first result
const firstResult = await geocodeFirst('coffee');
const firstReverse = await reverseGeocodeFirst({ lat: 37.422, lng: -122.084 });`}
            />
          </SectionCard>
        </div>
      </div>

      {/* Directions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Directions & Distance Matrix
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="getDirections"
            description="Get directions between points"
          >
            <CodeSnippet
              code={`import { getDirections, getDirectionsAsync } from '@gmaps-kit/core';

// Callback-based directions
getDirections({
  origin: { lat: 40.7128, lng: -74.006 },
  destination: { lat: 40.758, lng: -73.9855 },
  travelMode: google.maps.TravelMode.DRIVING,
}, (result, status) => {
  if (status === google.maps.DirectionsStatus.OK) {
    console.log('Directions result:', result);
  }
});

// Promise-based directions
const result = await getDirectionsAsync({
  origin: { lat: 40.7128, lng: -74.006 },
  destination: { lat: 40.758, lng: -73.9855 },
  travelMode: google.maps.TravelMode.DRIVING,
});`}
            />
          </SectionCard>

          <SectionCard
            title="renderDirections"
            description="Render directions on map"
          >
            <CodeSnippet
              code={`import { renderDirections, clearDirections } from '@gmaps-kit/core';

// Render directions on map
const directionsRenderer = renderDirections(map, directionsResult);

// Clear directions
clearDirections(directionsRenderer);`}
            />
          </SectionCard>

          <SectionCard
            title="Distance Matrix"
            description="Calculate distances and travel times"
          >
            <CodeSnippet
              code={`import { getDistanceMatrix, getDistanceMatrixAsync } from '@gmaps-kit/core';

// Get distance matrix
const result = await getDistanceMatrixAsync({
  origins: [{ lat: 40.7128, lng: -74.006 }],
  destinations: [{ lat: 40.758, lng: -73.9855 }],
  travelMode: google.maps.TravelMode.DRIVING,
});

console.log('Distance matrix result:', result);`}
            />
          </SectionCard>

          <SectionCard
            title="Directions Utilities"
            description="Additional directions utilities"
          >
            <CodeSnippet
              code={`import { 
  getTotalDistance, 
  getTotalDuration, 
  getDirectionsBounds,
  fitMapToRoute 
} from '@gmaps-kit/core';

// Get total distance
const distance = getTotalDistance(directionsResult);
console.log('Total distance:', distance);

// Get total duration
const duration = getTotalDuration(directionsResult);
console.log('Total duration:', duration);

// Get bounds for route
const bounds = getDirectionsBounds(directionsResult);
console.log('Route bounds:', bounds);

// Fit map to route
fitMapToRoute(map, directionsResult);`}
            />
          </SectionCard>

          <SectionCard
            title="Service Creation"
            description="Create directions and distance matrix services"
          >
            <CodeSnippet
              code={`import { 
  createDirectionsService, 
  createDirectionsRenderer,
  createDistanceMatrixService 
} from '@gmaps-kit/core';

// Create services
const directionsService = createDirectionsService();
const directionsRenderer = createDirectionsRenderer();
const distanceMatrixService = createDistanceMatrixService();`}
            />
          </SectionCard>
        </div>
      </div>

      {/* Autocomplete */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Places Autocomplete
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="createAutocomplete"
            description="Create Places Autocomplete"
          >
            <CodeSnippet
              code={`import { createAutocomplete, bindAutocompleteToMap } from '@gmaps-kit/core';

// Create autocomplete
const autocomplete = createAutocomplete({
  input: inputElement,
  types: ['establishment'],
  componentRestrictions: { country: 'us' },
  fields: ['place_id', 'name', 'formatted_address', 'geometry'],
});

// Bind to map
const autocomplete = bindAutocompleteToMap(mapInstance, {
  input: inputElement,
  types: ['establishment'],
});`}
            />
          </SectionCard>

          <SectionCard
            title="Autocomplete Operations"
            description="Manage autocomplete functionality"
          >
            <CodeSnippet
              code={`import { 
  getSelectedPlace, 
  addPlaceChangedListener,
  setAutocompleteBounds,
  setAutocompleteTypes,
  getAutocompleteBounds,
  getAutocompleteTypes,
  clearAutocomplete,
  focusAutocomplete
} from '@gmaps-kit/core';

// Listen for place selection
addPlaceChangedListener(autocomplete, (place) => {
  console.log('Place selected:', place);
  const selectedPlace = getSelectedPlace(autocomplete);
  console.log('Selected place details:', selectedPlace);
});

// Set bounds
setAutocompleteBounds(autocomplete, {
  north: 40.9,
  south: 40.7,
  east: -74.0,
  west: -74.2,
});

// Set types
setAutocompleteTypes(autocomplete, ['restaurant', 'cafe']);

// Clear autocomplete
clearAutocomplete(autocomplete);

// Focus autocomplete
focusAutocomplete(autocomplete);`}
            />
          </SectionCard>

          <SectionCard
            title="SearchBox"
            description="Create search box for places"
          >
            <CodeSnippet
              code={`import { createSearchBox, addPlacesChangedListener } from '@gmaps-kit/core';

// Create search box
const searchBox = createSearchBox(inputElement);

// Listen for places changes
addPlacesChangedListener(searchBox, (places) => {
  console.log('Places found:', places);
});`}
            />
          </SectionCard>

          <SectionCard
            title="Autocomplete Configuration"
            description="Get and set autocomplete configuration"
          >
            <CodeSnippet
              code={`import { 
  getAutocompleteBounds,
  getAutocompleteTypes,
  getAutocompleteComponentRestrictions,
  setAutocompleteComponentRestrictions
} from '@gmaps-kit/core';

// Get current configuration
const bounds = getAutocompleteBounds(autocomplete);
const types = getAutocompleteTypes(autocomplete);
const restrictions = getAutocompleteComponentRestrictions(autocomplete);

// Set component restrictions
setAutocompleteComponentRestrictions(autocomplete, { country: 'us' });`}
            />
          </SectionCard>
        </div>
      </div>

      {/* Street View */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Street View
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="createStreetViewPanorama"
            description="Create Street View panoramas"
          >
            <CodeSnippet
              code={`import { createStreetViewPanorama } from '@gmaps-kit/core';

const streetView = createStreetViewPanorama('street-view-container', {
  position: { lat: 40.758, lng: -73.9855 },
  pov: { heading: 0, pitch: 0 },
  zoom: 1,
});

console.log('Street View created:', streetView.panorama);`}
            />
          </SectionCard>

          <SectionCard
            title="Street View Controls"
            description="Control Street View panorama"
          >
            <CodeSnippet
              code={`import { 
  setStreetViewPov, 
  getStreetViewPov,
  setStreetViewPosition,
  getStreetViewPosition,
  setStreetViewVisibility,
  isStreetViewVisible
} from '@gmaps-kit/core';

// Set point of view
setStreetViewPov(panorama, { heading: 120, pitch: -10 });

// Get point of view
const pov = getStreetViewPov(panorama);
console.log('Current POV:', pov);

// Set position
setStreetViewPosition(panorama, { lat: 40.758, lng: -73.9855 });

// Get position
const position = getStreetViewPosition(panorama);
console.log('Current position:', position);

// Set visibility
setStreetViewVisibility(panorama, true);

// Check visibility
const isVisible = isStreetViewVisible(panorama);
console.log('Street View visible:', isVisible);`}
            />
          </SectionCard>
        </div>
      </div>

      {/* REST API Clients */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          REST API Clients
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="PlacesClient"
            description="Server-side Places API client"
          >
            <CodeSnippet
              code={`import { PlacesClient, createPlacesSessionToken } from '@gmaps-kit/core';

const places = new PlacesClient({
  apiKey: process.env.GOOGLE_MAPS_API_KEY!,
  retryConfig: { retries: 2, delayMs: 500 },
});

// Text search
const response = await places.textSearch({
  query: 'coffee in Seattle',
  type: 'cafe',
});

// Place details
const details = await places.placeDetails({
  placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  fields: ['name', 'formatted_address', 'geometry'],
});

// Create session token
const sessionToken = createPlacesSessionToken();

console.log('Places found:', response.results.length);`}
            />
          </SectionCard>

          <SectionCard
            title="GeocodingClient"
            description="Server-side Geocoding API client"
          >
            <CodeSnippet
              code={`import { GeocodingClient } from '@gmaps-kit/core';

const geocoding = new GeocodingClient({
  apiKey: process.env.GOOGLE_MAPS_API_KEY!,
});

// Forward geocoding
const result = await geocoding.geocode({
  address: '221B Baker Street, London',
});

// Reverse geocoding
const reverse = await geocoding.reverseGeocode({
  latlng: { lat: 51.5034, lng: -0.1276 },
  resultType: ['street_address'],
});

console.log('Geocoding result:', result.results[0]);`}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  </div>
);
