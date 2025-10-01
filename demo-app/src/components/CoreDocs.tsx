import React from 'react';
import { SectionCard } from './SectionCard';
import { CodeSnippet } from './CodeSnippet';

export const CoreDocs: React.FC = () => (
  <div className="space-y-6">
    <SectionCard
      title="Core Quick Start"
      description="Load the Google Maps script, create a map, and drop a marker using framework-agnostic utilities."
    >
      <CodeSnippet
        title="Load & Initialize"
        code={`import { loadGoogleMaps, createMap, addMarker } from '@gmaps-kit/core';

await loadGoogleMaps({
  apiKey: 'YOUR_API_KEY',
  libraries: ['places', 'geometry'],
});

const mapInstance = createMap('map-container', {
  center: { lat: 40.7128, lng: -74.0060 },
  zoom: 12,
});

addMarker(mapInstance.map, {
  position: { lat: 40.7128, lng: -74.0060 },
  title: 'Hello NYC',
});`}
      />
    </SectionCard>

    <SectionCard
      title="Street View Panorama"
      description="Embed immersive panoramas alongside your map using the Street View helpers."
    >
      <CodeSnippet
        code={`import {
  createStreetViewPanorama,
  setStreetViewPov,
} from '@gmaps-kit/core';

const streetView = createStreetViewPanorama('street-view', {
  position: { lat: 40.758, lng: -73.9855 },
  pov: { heading: 0, pitch: 0 },
});

setStreetViewPov(streetView.panorama, { heading: 120, pitch: -10 });`}
      />
    </SectionCard>

    <SectionCard
      title="Places & Geocoding Web Services"
      description="Strongly typed REST clients make it easy to call Places and Geocoding APIs from Node.js, serverless, or background jobs."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <CodeSnippet
          title="Places Text Search"
          code={`import { PlacesClient } from '@gmaps-kit/core';

const places = new PlacesClient({
  apiKey: process.env.GMAPS_KEY!,
  retryConfig: { retries: 2, delayMs: 500 },
});

const response = await places.textSearch({
  query: 'coffee in Seattle',
  type: 'cafe',
});

response.results.forEach((place) => {
  console.log(place.name, place.formatted_address);
});`}
        />
        <CodeSnippet
          title="Geocoding (Server)"
          code={`import { GeocodingClient } from '@gmaps-kit/core';

const geocoding = new GeocodingClient({ apiKey: process.env.GMAPS_KEY! });

const result = await geocoding.geocode({
  address: '221B Baker Street, London',
});

const reverse = await geocoding.reverseGeocode({
  latlng: { lat: 51.5034, lng: -0.1276 },
  resultType: ['street_address'],
});`}
        />
      </div>
      <p className="text-sm text-gray-500">
        Tip: REST endpoints block browser requests by default (CORS). Keep these clients in server or proxy environments.
      </p>
    </SectionCard>
  </div>
);
