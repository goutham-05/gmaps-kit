import React from 'react';
import { SectionCard } from '../SectionCard';
import { CodeSnippet } from '../CodeSnippet';

export const ExamplesSection: React.FC = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Examples</h2>
      <p className="text-lg text-gray-600">
        Real-world examples and use cases for the GMaps Kit packages.
      </p>
    </div>

    <div className="grid gap-6">
      <SectionCard
        title="Basic Map with Markers"
        description="Simple map with click-to-add markers"
      >
        <CodeSnippet
          code={`import React from 'react';
import { useGoogleMaps, useMap, useMarkers } from '@gmaps-kit/react';

const BasicMap = () => {
  const { isLoaded } = useGoogleMaps({ apiKey: 'YOUR_API_KEY' });
  const { map, mapRef } = useMap({
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 12,
  });
  const { addMarker } = useMarkers(map);

  const handleMapClick = (event) => {
    if (event.latLng) {
      addMarker({
        position: event.latLng.toJSON(),
        title: 'Clicked Location',
      });
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="h-96 w-full">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
};`}
        />
      </SectionCard>

      <SectionCard
        title="Places Search"
        description="Search for places and display results"
      >
        <CodeSnippet
          code={`import React, { useState } from 'react';
import { usePlaces } from '@gmaps-kit/react';

const PlacesSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const { textSearch, isLoading } = usePlaces({
    apiKey: 'YOUR_API_KEY',
  });

  const handleSearch = async () => {
    const response = await textSearch({
      query,
      type: 'restaurant',
    });
    setResults(response.results);
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for restaurants..."
        className="border p-2 rounded"
      />
      <button 
        onClick={handleSearch} 
        disabled={isLoading}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      
      <div className="mt-4">
        {results.map((place) => (
          <div key={place.place_id} className="border p-2 mb-2">
            <h3>{place.name}</h3>
            <p>{place.formatted_address}</p>
            <p>Rating: {place.rating}/5</p>
          </div>
        ))}
      </div>
    </div>
  );
};`}
        />
      </SectionCard>

      <SectionCard
        title="Directions with Route Display"
        description="Calculate and display driving directions"
      >
        <CodeSnippet
          code={`import React, { useState } from 'react';
import { useGoogleMaps, useMap, useDirections } from '@gmaps-kit/react';

const DirectionsMap = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  
  const { isLoaded } = useGoogleMaps({ apiKey: 'YOUR_API_KEY' });
  const { map, mapRef } = useMap({
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 10,
  });
  
  const { calculateRoute, directionsRenderer } = useDirections(map);

  const handleGetDirections = async () => {
    const route = await calculateRoute({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    
    if (directionsRenderer) {
      directionsRenderer.setDirections(route);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-4">
        <input
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Origin"
          className="border p-2 rounded mr-2"
        />
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination"
          className="border p-2 rounded mr-2"
        />
        <button 
          onClick={handleGetDirections}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Get Directions
        </button>
      </div>
      
      <div ref={mapRef} className="h-96 w-full" />
    </div>
  );
};`}
        />
      </SectionCard>
    </div>
  </div>
);
