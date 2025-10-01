import React from 'react';
import { SectionCard } from '../SectionCard';
import { CodeSnippet } from '../CodeSnippet';

export const HooksSection: React.FC = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">React Hooks</h2>
      <p className="text-lg text-gray-600">
        All 19 specialized hooks for Google Maps integration in React
        applications.
      </p>
    </div>

    <div className="grid gap-6">
      {/* Core Hooks */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Hooks</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="useGoogleMaps"
            description="Load Google Maps and manage loading state"
          >
            <CodeSnippet
              code={`const { isLoaded, loadError } = useGoogleMaps({
  apiKey: 'YOUR_API_KEY',
  libraries: ['places', 'geometry'],
});`}
            />
          </SectionCard>

          <SectionCard
            title="useMap"
            description="Create and manage Google Map instances"
          >
            <CodeSnippet
              code={`const { map, mapRef, isMapReady } = useMap({
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 12,
});`}
            />
          </SectionCard>

          <SectionCard
            title="useMarkers"
            description="Manage markers on the map"
          >
            <CodeSnippet
              code={`const { markers, addMarker, removeMarker } = useMarkers(map);

addMarker({
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
});`}
            />
          </SectionCard>

          <SectionCard
            title="useStreetView"
            description="Manage Street View panoramas"
          >
            <CodeSnippet
              code={`const { panorama, panoramaRef, setPosition } = useStreetView({
  position: { lat: 40.758, lng: -73.9855 },
  pov: { heading: 0, pitch: 0 },
});`}
            />
          </SectionCard>
        </div>
      </div>

      {/* Geocoding Hooks */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Geocoding Hooks
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="useGeocoding"
            description="Client-side geocoding with JavaScript SDK"
          >
            <CodeSnippet
              code={`const { geocode, reverseGeocode, isGeocoding } = useGeocoding(map);

const results = await geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA',
});`}
            />
          </SectionCard>

          <SectionCard
            title="useGeocodingService"
            description="Server-side geocoding with REST API"
          >
            <CodeSnippet
              code={`const { geocode, reverseGeocode, isLoading, error } = useGeocodingService({
  apiKey: 'YOUR_API_KEY',
});

const result = await geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA',
});`}
            />
          </SectionCard>
        </div>
      </div>

      {/* Places Hooks */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Places Hooks
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="usePlaces"
            description="Places API integration for search and details"
          >
            <CodeSnippet
              code={`const { textSearch, nearbySearch, placeDetails, isLoading } = usePlaces({
  apiKey: 'YOUR_API_KEY',
});

const results = await textSearch({
  query: 'coffee in Seattle',
  type: 'cafe',
});`}
            />
          </SectionCard>
        </div>
      </div>

      {/* Directions & Routing Hooks */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Directions & Routing
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="useDirections"
            description="Calculate and display routes"
          >
            <CodeSnippet
              code={`const { calculateRoute, directionsRenderer } = useDirections(map);

const route = await calculateRoute({
  origin: { lat: 40.7128, lng: -74.006 },
  destination: { lat: 40.758, lng: -73.9855 },
  travelMode: google.maps.TravelMode.DRIVING,
});`}
            />
          </SectionCard>

          <SectionCard
            title="useBicycling"
            description="Bicycling layer and routing"
          >
            <CodeSnippet
              code={`const { bicyclingLayer, setBicyclingLayer } = useBicycling(map);

setBicyclingLayer(true); // Show bicycling layer`}
            />
          </SectionCard>
        </div>
      </div>

      {/* Advanced Hooks */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Advanced Hooks
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="useClustering"
            description="Marker clustering for performance"
          >
            <CodeSnippet
              code={`const { clusterer, addMarkers, removeMarkers } = useClustering(map, {
  gridSize: 60,
  maxZoom: 15,
});

addMarkers(markers); // Add markers to cluster`}
            />
          </SectionCard>

          <SectionCard
            title="useDistanceMatrix"
            description="Calculate distances and travel times"
          >
            <CodeSnippet
              code={`const { calculateDistanceMatrix } = useDistanceMatrix();

const results = await calculateDistanceMatrix({
  origins: [{ lat: 40.7128, lng: -74.006 }],
  destinations: [{ lat: 40.758, lng: -73.9855 }],
  travelMode: google.maps.TravelMode.DRIVING,
});`}
            />
          </SectionCard>

          <SectionCard
            title="useElevation"
            description="Elevation data and terrain"
          >
            <CodeSnippet
              code={`const { getElevationForLocations, getElevationAlongPath } = useElevation();

const elevation = await getElevationForLocations([
  { lat: 40.7128, lng: -74.006 }
]);`}
            />
          </SectionCard>

          <SectionCard title="useGeometry" description="Geometric calculations">
            <CodeSnippet
              code={`const { computeDistanceBetween, computeArea, computeLength } = useGeometry();

const distance = computeDistanceBetween(
  { lat: 40.7128, lng: -74.006 },
  { lat: 40.758, lng: -73.9855 }
);`}
            />
          </SectionCard>

          <SectionCard title="useHeatmap" description="Heatmap visualization">
            <CodeSnippet
              code={`const { heatmapLayer, setHeatmapData } = useHeatmap(map, {
  radius: 20,
  opacity: 0.6,
});

setHeatmapData(heatmapData);`}
            />
          </SectionCard>

          <SectionCard
            title="useInfoWindows"
            description="Manage multiple InfoWindows"
          >
            <CodeSnippet
              code={`const { infoWindows, addInfoWindow, removeInfoWindow } = useInfoWindows(map);

addInfoWindow({
  position: { lat: 40.7128, lng: -74.006 },
  content: '<h3>Hello World</h3>',
});`}
            />
          </SectionCard>

          <SectionCard title="useMapEvents" description="Map event handling">
            <CodeSnippet
              code={`const { addEventListener, removeEventListener } = useMapEvents(map);

addEventListener('click', (event) => {
  console.log('Map clicked:', event.latLng);
});`}
            />
          </SectionCard>

          <SectionCard
            title="useMaxZoom"
            description="Maximum zoom level management"
          >
            <CodeSnippet
              code={`const { maxZoom, setMaxZoom } = useMaxZoom(map);

setMaxZoom(15); // Set maximum zoom level`}
            />
          </SectionCard>

          <SectionCard title="useTraffic" description="Traffic layer and data">
            <CodeSnippet
              code={`const { trafficLayer, setTrafficLayer } = useTraffic(map);

setTrafficLayer(true); // Show traffic layer`}
            />
          </SectionCard>

          <SectionCard
            title="useTransit"
            description="Transit layer and routing"
          >
            <CodeSnippet
              code={`const { transitLayer, setTransitLayer } = useTransit(map);

setTransitLayer(true); // Show transit layer`}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  </div>
);
