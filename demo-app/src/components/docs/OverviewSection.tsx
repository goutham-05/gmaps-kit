import React from 'react';
import { SectionCard } from '../SectionCard';
import { CodeSnippet } from '../CodeSnippet';

export const OverviewSection: React.FC = () => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        GMaps Kit Documentation
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Comprehensive documentation, examples, and API reference for the GMaps
        Kit packages.
      </p>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <SectionCard
        title="Core Package"
        description="Framework-agnostic utilities for Google Maps"
      >
        <CodeSnippet
          title="Installation & Basic Usage"
          code={`npm install @gmaps-kit/core

import { loadGoogleMaps, createMap, addMarker } from '@gmaps-kit/core';

await loadGoogleMaps({ apiKey: 'YOUR_API_KEY' });

const mapInstance = createMap('map-container', {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 12,
});

addMarker(mapInstance.map, {
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
});`}
        />
      </SectionCard>

      <SectionCard
        title="React Package"
        description="React hooks and components for Google Maps"
      >
        <CodeSnippet
          title="React Hook Usage"
          code={`npm install @gmaps-kit/react

import { useGoogleMaps, useMap, useMarkers } from '@gmaps-kit/react';

const MyMap = () => {
  const { isLoaded } = useGoogleMaps({ apiKey: 'YOUR_API_KEY' });
  const { map, mapRef } = useMap({ 
    center: { lat: 40.7128, lng: -74.006 }, 
    zoom: 12 
  });
  const { addMarker } = useMarkers(map);

  if (!isLoaded) return <div>Loading...</div>;

  return <div ref={mapRef} className="h-96 w-full" />;
};`}
        />
      </SectionCard>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">
        📚 What's Included
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h4 className="font-medium text-blue-900">Core Package</h4>
          <ul className="text-sm text-blue-800 mt-1">
            <li>• Map creation and manipulation</li>
            <li>• Marker and InfoWindow management</li>
            <li>• Street View integration</li>
            <li>• REST API clients</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-blue-900">React Package</h4>
          <ul className="text-sm text-blue-800 mt-1">
            <li>• 19 specialized hooks</li>
            <li>• React components</li>
            <li>• State management</li>
            <li>• Event handling</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-blue-900">Features</h4>
          <ul className="text-sm text-blue-800 mt-1">
            <li>• TypeScript support</li>
            <li>• Performance optimized</li>
            <li>• Server-side APIs</li>
            <li>• Comprehensive testing</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);
