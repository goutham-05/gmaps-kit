# Examples

This section contains real-world examples demonstrating how to use `@gmaps-kit/core` and `@gmaps-kit/react` packages.

## 📚 Example Categories

- [Basic Map](./basic-map.md) - Simple map with markers
- [Interactive Map](./interactive-map.md) - Click to add markers
- [Places Search](./places-search.md) - Search and display places
- [Directions](./directions.md) - Route planning and navigation
- [Street View](./street-view.md) - Immersive panoramas
- [Clustering](./clustering.md) - Marker clustering for performance
- [Custom Styling](./custom-styling.md) - Custom map styles
- [Server-Side APIs](./server-side-apis.md) - REST API usage

## 🚀 Quick Examples

### Basic Map with Markers

```tsx
import React from 'react';
import { useGoogleMaps, useMap, useMarkers } from '@gmaps-kit/react';

const BasicMap: React.FC = () => {
  const { isLoaded } = useGoogleMaps({
    apiKey: 'YOUR_API_KEY',
    libraries: ['places'],
  });

  const { map, mapRef } = useMap({
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 12,
  });

  const { markers, addMarker } = useMarkers(map);

  const handleAddMarker = () => {
    addMarker({
      position: { lat: 40.7128, lng: -74.006 },
      title: 'New York City',
    });
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="h-96 w-full">
      <div ref={mapRef} className="h-full w-full" />
      <button
        onClick={handleAddMarker}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Marker
      </button>
    </div>
  );
};
```

### Places Search

```tsx
import React, { useState } from 'react';
import { usePlaces } from '@gmaps-kit/react';

const PlacesSearch: React.FC = () => {
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
};
```

### Directions with Route Display

```tsx
import React, { useState } from 'react';
import { useGoogleMaps, useMap, useDirections } from '@gmaps-kit/react';

const DirectionsMap: React.FC = () => {
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
};
```

## 🎯 Advanced Examples

### Marker Clustering

```tsx
import React, { useEffect, useState } from 'react';
import {
  useGoogleMaps,
  useMap,
  useMarkers,
  useClustering,
} from '@gmaps-kit/react';

const ClusteredMap: React.FC = () => {
  const [markers, setMarkers] = useState([]);

  const { isLoaded } = useGoogleMaps({ apiKey: 'YOUR_API_KEY' });
  const { map, mapRef } = useMap({
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 10,
  });

  const { addMarker } = useMarkers(map);
  const { clusterer } = useClustering(map, {
    gridSize: 60,
    maxZoom: 15,
  });

  useEffect(() => {
    // Generate random markers
    const randomMarkers = Array.from({ length: 100 }, (_, i) => ({
      position: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.006 + (Math.random() - 0.5) * 0.1,
      },
      title: `Marker ${i + 1}`,
    }));

    setMarkers(randomMarkers);
  }, []);

  useEffect(() => {
    if (clusterer && markers.length > 0) {
      clusterer.addMarkers(markers);
    }
  }, [clusterer, markers]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="h-96 w-full">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
};
```

### Custom Map Styling

```tsx
import React from 'react';
import { useGoogleMaps, useMap } from '@gmaps-kit/react';

const StyledMap: React.FC = () => {
  const { isLoaded } = useGoogleMaps({ apiKey: 'YOUR_API_KEY' });

  const customStyles = [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#e9e9e9' }, { lightness: 17 }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }, { lightness: 20 }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [{ color: '#ffffff' }, { lightness: 17 }],
    },
  ];

  const { map, mapRef } = useMap({
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 12,
    styles: customStyles,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="h-96 w-full">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
};
```

## 🔧 Server-Side Examples

### Next.js API Route

```typescript
// pages/api/places.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PlacesClient } from '@gmaps-kit/core';

const places = new PlacesClient({
  apiKey: process.env.GOOGLE_MAPS_API_KEY!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, type } = req.query;

  try {
    const response = await places.textSearch({
      query: query as string,
      type: type as string,
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search places' });
  }
}
```

### Express.js Route

```typescript
import express from 'express';
import { PlacesClient, GeocodingClient } from '@gmaps-kit/core';

const app = express();
const places = new PlacesClient({ apiKey: process.env.GOOGLE_MAPS_API_KEY! });
const geocoding = new GeocodingClient({
  apiKey: process.env.GOOGLE_MAPS_API_KEY!,
});

app.get('/api/places/search', async (req, res) => {
  try {
    const { query, type } = req.query;
    const response = await places.textSearch({
      query: query as string,
      type: type as string,
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

app.get('/api/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    const response = await geocoding.geocode({
      address: address as string,
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Geocoding failed' });
  }
});
```

## 📖 More Examples

- [Basic Map](./basic-map.md) - Complete basic map implementation
- [Interactive Map](./interactive-map.md) - Click handlers and user interaction
- [Places Search](./places-search.md) - Places API integration
- [Directions](./directions.md) - Route planning and display
- [Street View](./street-view.md) - Street View panorama integration
- [Clustering](./clustering.md) - Marker clustering implementation
- [Custom Styling](./custom-styling.md) - Custom map styles and themes
- [Server-Side APIs](./server-side-apis.md) - REST API usage patterns

## 🎯 Getting Started

1. Choose an example that matches your use case
2. Copy the code and adapt it to your needs
3. Install the required packages
4. Add your Google Maps API key
5. Customize the styling and functionality

## 🆘 Need Help?

- Check the [API Reference](../api-reference.md) for detailed documentation
- Look at the [React Package Documentation](../react/README.md) for hook details
- See the [Core Package Documentation](../core/README.md) for utility functions
