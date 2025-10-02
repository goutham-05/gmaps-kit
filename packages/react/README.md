# @gmaps-kit/react

React components and hooks for Google Maps with gmaps-kit - useGeocoding, useDirections, usePlaces, useMarkers, useStreetView and more.

[![npm version](https://badge.fury.io/js/@gmaps-kit%2Freact.svg)](https://badge.fury.io/js/@gmaps-kit%2Freact)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Live Demo

**Try it out:** [https://demo-app-rouge-five.vercel.app/](https://demo-app-rouge-five.vercel.app/)

See all React components and hooks in action!

## Features

- ⚛️ **React Hooks** - Easy-to-use hooks for Google Maps functionality
- 🗺️ **Map Component** - Ready-to-use Map component
- 📍 **Geocoding Hooks** - Convert addresses to coordinates
- 🧭 **Directions Hooks** - Get and display directions
- 🏢 **Places Hooks** - Search and manage places
- 📌 **Marker Components** - Add markers with React components
- 🛣️ **Street View Hooks** - Integrate Street View
- 🔍 **Autocomplete Hooks** - Add place autocomplete
- 🎯 **TypeScript** - Full TypeScript support
- ⚡ **Lightweight** - Optimized bundle size (~13KB)
- 🔄 **React 16.8+** - Compatible with modern React

## Installation

```bash
npm install @gmaps-kit/react @gmaps-kit/core
```

## Quick Start

### 1. Setup Google Maps

```tsx
import { useGoogleMaps } from '@gmaps-kit/react';

function App() {
  const { isLoaded, load } = useGoogleMaps({
    apiKey: 'YOUR_API_KEY',
    libraries: ['places', 'geometry'],
  });

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return <YourMapComponent />;
}
```

### 2. Create a Map

```tsx
import { Map } from '@gmaps-kit/react';

function MyMap() {
  return (
    <Map
      id="my-map"
      center={{ lat: 40.7128, lng: -74.006 }}
      zoom={10}
      style={{ height: '400px', width: '100%' }}
    />
  );
}
```

### 3. Add Markers

```tsx
import { Map, Marker } from '@gmaps-kit/react';
import { useMap } from '@gmaps-kit/react';

function MapWithMarkers() {
  const { mapInstance } = useMap('my-map', {
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 10,
  });

  return (
    <Map id="my-map" center={{ lat: 40.7128, lng: -74.006 }} zoom={10}>
      <Marker
        mapInstance={mapInstance}
        position={{ lat: 40.7128, lng: -74.006 }}
        title="New York City"
      />
    </Map>
  );
}
```

## Hooks

### useGoogleMaps

Initialize Google Maps API:

```tsx
import { useGoogleMaps } from '@gmaps-kit/react';

function App() {
  const { isLoaded, isLoading, error, load } = useGoogleMaps({
    apiKey: 'YOUR_API_KEY',
    libraries: ['places'],
    onLoad: () => console.log('Maps loaded!'),
    onError: (error) => console.error('Maps error:', error),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!isLoaded) return <button onClick={load}>Load Maps</button>;

  return <YourMapComponent />;
}
```

### useGeocoding

Convert addresses to coordinates:

```tsx
import { useGeocoding } from '@gmaps-kit/react';

function GeocodingExample() {
  const { geocode, reverseGeocode, results, loading, error } = useGeocoding();

  const handleGeocode = () => {
    geocode('New York City');
  };

  const handleReverseGeocode = () => {
    reverseGeocode({ lat: 40.7128, lng: -74.006 });
  };

  return (
    <div>
      <button onClick={handleGeocode}>Geocode Address</button>
      <button onClick={handleReverseGeocode}>Reverse Geocode</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
    </div>
  );
}
```

### useDirections

Get and display directions:

```tsx
import { useDirections } from '@gmaps-kit/react';

function DirectionsExample() {
  const { getDirections, renderDirections, clearDirections, result, loading } =
    useDirections();

  const handleGetDirections = () => {
    getDirections({
      origin: 'New York, NY',
      destination: 'Boston, MA',
      travelMode: 'DRIVING',
    });
  };

  return (
    <div>
      <button onClick={handleGetDirections}>Get Directions</button>
      <button onClick={clearDirections}>Clear Directions</button>
      {loading && <p>Loading directions...</p>}
      {result && <p>Directions loaded!</p>}
    </div>
  );
}
```

### usePlaces (Legacy API)

Search and manage places with the legacy Places API:

```tsx
import { usePlaces } from '@gmaps-kit/react';

function PlacesExample() {
  const {
    textSearch,
    nearbySearch,
    placeDetails,
    autocomplete,
    results,
    loading,
  } = usePlaces();

  const handleSearch = () => {
    textSearch({
      query: 'restaurants in New York',
      location: { lat: 40.7128, lng: -74.006 },
      radius: 1000,
    });
  };

  return (
    <div>
      <button onClick={handleSearch}>Search Places</button>
      {loading && <p>Searching...</p>}
      {results && (
        <ul>
          {results.map((place, index) => (
            <li key={index}>{place.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### usePlacesNew (Enhanced Places API)

Search and manage places with the new Places API (New) - better CORS support, enhanced data, and modern features:

```tsx
import { usePlacesNew } from '@gmaps-kit/react';

function PlacesNewExample() {
  const {
    textSearch,
    nearbySearch,
    placeDetails,
    autocomplete,
    getPhoto,
    buildPhotoUrl,
    isLoading,
    error,
  } = usePlacesNew({
    apiKey: 'YOUR_API_KEY',
    // No baseUrl needed - direct API calls with better CORS support!
  });

  const handleTextSearch = async () => {
    try {
      const results = await textSearch({
        textQuery: 'restaurants in New York',
        locationBias: {
          circle: {
            center: { latitude: 40.7128, longitude: -74.006 },
            radius: 1000,
          },
        },
        maxResultCount: 10,
        minRating: 4.0,
      });
      console.log('Text search results:', results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleNearbySearch = async () => {
    try {
      const results = await nearbySearch({
        includedTypes: ['restaurant', 'cafe'],
        locationRestriction: {
          circle: {
            center: { latitude: 40.7128, longitude: -74.006 },
            radius: 1000,
          },
        },
        maxResultCount: 10,
        minRating: 4.0,
      });
      console.log('Nearby search results:', results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handlePlaceDetails = async () => {
    try {
      const details = await placeDetails({
        placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      });
      console.log('Place details:', details);
    } catch (error) {
      console.error('Details failed:', error);
    }
  };

  const handleAutocomplete = async () => {
    try {
      const results = await autocomplete({
        input: 'restaurants in',
        locationBias: {
          circle: {
            center: { latitude: 40.7128, longitude: -74.006 },
            radius: 1000,
          },
        },
      });
      console.log('Autocomplete results:', results);
    } catch (error) {
      console.error('Autocomplete failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleTextSearch}>Text Search</button>
      <button onClick={handleNearbySearch}>Nearby Search</button>
      <button onClick={handlePlaceDetails}>Get Place Details</button>
      <button onClick={handleAutocomplete}>Autocomplete</button>

      {isLoading && <p>Searching...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

### Key Advantages of Places API (New)

| Feature            | Legacy API        | New API (New)              |
| ------------------ | ----------------- | -------------------------- |
| **CORS Support**   | ❌ Requires proxy | ✅ Direct browser requests |
| **Request Format** | Query parameters  | JSON body                  |
| **Authentication** | API key in URL    | API key in header          |
| **Data Quality**   | Basic             | Enhanced with more fields  |
| **Error Handling** | Limited           | Comprehensive              |
| **Rate Limiting**  | Basic             | Advanced                   |

### useMarkers

Manage map markers:

```tsx
import { useMarkers } from '@gmaps-kit/react';

function MarkersExample({ mapInstance }) {
  const { addMarker, removeMarker, updateMarker, markers, clearMarkers } =
    useMarkers();

  const handleAddMarker = () => {
    addMarker({
      position: { lat: 40.7128, lng: -74.006 },
      title: 'New Marker',
    });
  };

  return (
    <div>
      <button onClick={handleAddMarker}>Add Marker</button>
      <button onClick={clearMarkers}>Clear All Markers</button>
      <p>Markers: {markers.length}</p>
    </div>
  );
}
```

### useStreetView

Integrate Street View:

```tsx
import { useStreetView } from '@gmaps-kit/react';

function StreetViewExample() {
  const { createPanorama, setPosition, setPov, setVisible, isVisible } =
    useStreetView();

  const handleShowStreetView = () => {
    createPanorama('street-view-container', {
      position: { lat: 40.7128, lng: -74.006 },
      pov: { heading: 0, pitch: 0 },
    });
    setVisible(true);
  };

  return (
    <div>
      <button onClick={handleShowStreetView}>Show Street View</button>
      <div id="street-view-container" style={{ height: '300px' }} />
    </div>
  );
}
```

## Components

### Map

Main map component:

```tsx
import { Map } from '@gmaps-kit/react';

<Map
  id="my-map"
  center={{ lat: 40.7128, lng: -74.006 }}
  zoom={10}
  style={{ height: '400px', width: '100%' }}
  className="my-map-class"
  onMapReady={(map) => console.log('Map ready!', map)}
>
  {/* Child components like markers */}
</Map>;
```

### Marker

Add markers to the map:

```tsx
import { Marker } from '@gmaps-kit/react';

<Marker
  mapInstance={mapInstance}
  position={{ lat: 40.7128, lng: -74.006 }}
  title="My Marker"
  draggable={true}
  onMarkerCreated={(marker) => console.log('Marker created', marker)}
/>;
```

### InfoWindow

Display info windows:

```tsx
import { InfoWindow } from '@gmaps-kit/react';

<InfoWindow
  mapInstance={mapInstance}
  position={{ lat: 40.7128, lng: -74.006 }}
  content="<h3>Hello World!</h3>"
  onClose={() => console.log('Info window closed')}
/>;
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type {
  UseGeocodingReturn,
  UseDirectionsReturn,
  MapProps,
  MarkerProps,
} from '@gmaps-kit/react';

const MyComponent: React.FC = () => {
  const geocoding: UseGeocodingReturn = useGeocoding();
  // TypeScript will provide full intellisense
};
```

## Complete Hooks Reference

### Core Hooks

#### useGoogleMaps

Load Google Maps SDK and manage loading state.

#### useMap

Create and manage Google Map instances.

#### useMarkers

Manage markers on the map.

#### useMapEvents

Handle map events (click, drag, etc.).

### Geocoding Hooks

#### useGeocoding

Client-side geocoding with JavaScript SDK.

#### useGeocodingService

Server-side geocoding with REST API.

### Places Hooks

#### usePlaces

Legacy Places API integration.

#### usePlacesNew

🚀 **New Places API (New)** with enhanced CORS support.

### Directions & Routing

#### useDirections

Calculate and display routes.

#### useBicycling

Bicycling layer and routing.

#### useTraffic

Traffic layer and data.

#### useTransit

Transit layer and routing.

### Advanced Features

#### useClustering

Marker clustering for performance.

#### useDistanceMatrix

Calculate distances and travel times.

#### useElevation

Elevation data and terrain.

#### useGeometry

Geometric calculations (distance, bearing, area).

#### useHeatmap

Heatmap visualization.

#### useInfoWindows

Manage multiple InfoWindows.

#### useMaxZoom

Maximum zoom level management.

#### useStreetView

Street View panorama management.

## Requirements

- React 16.8+ (hooks support)
- @gmaps-kit/core
- Google Maps API key

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT © [gmaps-kit](https://github.com/goutham-05/gmaps-kit)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](https://github.com/goutham-05/gmaps-kit/blob/main/CONTRIBUTING.md) for details.

## Support

- 📖 [Documentation](https://github.com/goutham-05/gmaps-kit)
- 🐛 [Report Issues](https://github.com/goutham-05/gmaps-kit/issues)
- 💬 [Discussions](https://github.com/goutham-05/gmaps-kit/discussions)
