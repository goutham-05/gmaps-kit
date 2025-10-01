# React Package Documentation

The `@gmaps-kit/react` package provides React hooks and components for Google Maps integration.

## 📦 Installation

```bash
npm install @gmaps-kit/react
```

## 🚀 Quick Start

```tsx
import React from 'react';
import { useGoogleMaps, useMap, useMarkers } from '@gmaps-kit/react';

const MyMap: React.FC = () => {
  const { isLoaded } = useGoogleMaps({
    apiKey: 'YOUR_API_KEY',
    libraries: ['places'],
  });

  const { map, mapRef } = useMap({
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 12,
  });

  const { markers, addMarker } = useMarkers(map);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="h-96 w-full">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
};
```

## 🎣 Hooks Reference

### Core Hooks

#### `useGoogleMaps(options)`

Loads Google Maps and provides loading state.

```tsx
const { isLoaded, loadError } = useGoogleMaps({
  apiKey: 'YOUR_API_KEY',
  libraries: ['places', 'geometry'],
  language: 'en',
  region: 'US',
});
```

#### `useMap(options)`

Creates and manages a Google Map instance.

```tsx
const { map, mapRef, isMapReady } = useMap({
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 12,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
});
```

#### `useMarkers(map)`

Manages markers on the map.

```tsx
const { markers, addMarker, removeMarker, updateMarkerPosition, clearMarkers } =
  useMarkers(map);

// Add a marker
addMarker({
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
  draggable: true,
});
```

### Geocoding Hooks

#### `useGeocoding(map)`

Provides geocoding functionality using the JavaScript SDK.

```tsx
const { geocode, reverseGeocode, isGeocoding } = useGeocoding(map);

// Forward geocoding
const results = await geocode('1600 Amphitheatre Parkway, Mountain View, CA');

// Reverse geocoding
const address = await reverseGeocode({ lat: 37.422, lng: -122.084 });
```

#### `useGeocodingService()`

React hook for the Geocoding REST API client.

```tsx
const { geocode, reverseGeocode, isLoading, error } = useGeocodingService({
  apiKey: 'YOUR_API_KEY',
});

// Server-side geocoding
const results = await geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA',
});
```

### Places Hooks

#### `usePlaces()`

React hook for the Places REST API client.

```tsx
const {
  textSearch,
  nearbySearch,
  placeDetails,
  autocomplete,
  isLoading,
  error,
} = usePlaces({
  apiKey: 'YOUR_API_KEY',
});

// Text search
const results = await textSearch({
  query: 'coffee in Seattle',
  type: 'cafe',
});

// Place details
const details = await placeDetails({
  placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  fields: ['name', 'formatted_address', 'geometry'],
});
```

### Street View Hooks

#### `useStreetView()`

Manages Street View panoramas.

```tsx
const { panorama, panoramaRef, setPosition, setPov, setZoom } = useStreetView({
  position: { lat: 40.758, lng: -73.9855 },
  pov: { heading: 0, pitch: 0 },
  zoom: 1,
});

return (
  <div className="h-96 w-full">
    <div ref={panoramaRef} className="h-full w-full" />
  </div>
);
```

### Advanced Hooks

#### `useDirections()`

Provides directions functionality.

```tsx
const { directions, directionsService, directionsRenderer, calculateRoute } =
  useDirections(map);

// Calculate route
const route = await calculateRoute({
  origin: { lat: 40.7128, lng: -74.006 },
  destination: { lat: 40.758, lng: -73.9855 },
  travelMode: google.maps.TravelMode.DRIVING,
});
```

#### `useDistanceMatrix()`

Calculates distances and travel times.

```tsx
const { calculateDistanceMatrix } = useDistanceMatrix();

const results = await calculateDistanceMatrix({
  origins: [{ lat: 40.7128, lng: -74.006 }],
  destinations: [{ lat: 40.758, lng: -73.9855 }],
  travelMode: google.maps.TravelMode.DRIVING,
});
```

#### `useClustering()`

Manages marker clustering.

```tsx
const { clusterer, addMarkers, removeMarkers } = useClustering(map, {
  gridSize: 60,
  maxZoom: 15,
});

// Add markers to cluster
addMarkers(markers);
```

## 🧩 Components

### Map Component

```tsx
import { Map } from '@gmaps-kit/react';

<Map center={{ lat: 40.7128, lng: -74.006 }} zoom={12} className="h-96 w-full">
  {/* Map content */}
</Map>;
```

### Marker Component

```tsx
import { Marker } from '@gmaps-kit/react';

<Marker
  position={{ lat: 40.7128, lng: -74.006 }}
  title="New York City"
  draggable={true}
  onClick={() => console.log('Marker clicked')}
/>;
```

### InfoWindow Component

```tsx
import { InfoWindow } from '@gmaps-kit/react';

<InfoWindow
  position={{ lat: 40.7128, lng: -74.006 }}
  content="<h3>Hello World</h3>"
  visible={true}
/>;
```

## 🔧 Advanced Usage

### Custom Hook Composition

```tsx
const useMapWithMarkers = (center: google.maps.LatLngLiteral) => {
  const { isLoaded } = useGoogleMaps({ apiKey: 'YOUR_API_KEY' });
  const { map, mapRef } = useMap({ center, zoom: 12 });
  const { markers, addMarker, removeMarker } = useMarkers(map);

  return {
    isLoaded,
    map,
    mapRef,
    markers,
    addMarker,
    removeMarker,
  };
};
```

### Event Handling

```tsx
const { map } = useMap({ center: { lat: 40.7128, lng: -74.006 }, zoom: 12 });
const { addMarker } = useMarkers(map);

useEffect(() => {
  if (!map) return;

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      addMarker({
        position: event.latLng.toJSON(),
        title: 'Clicked Location',
      });
    }
  };

  const listener = map.addListener('click', handleMapClick);

  return () => {
    google.maps.event.removeListener(listener);
  };
}, [map, addMarker]);
```

### Performance Optimization

```tsx
// Memoize expensive operations
const memoizedMarkers = useMemo(
  () =>
    markers.map((marker) => ({
      ...marker,
      // Transform marker data
    })),
  [markers]
);

// Debounce search
const debouncedSearch = useCallback(
  debounce((query: string) => {
    searchPlaces(query);
  }, 300),
  [searchPlaces]
);
```

## 🎯 Best Practices

### 1. Load Google Maps Once

```tsx
// ✅ Good - Load once at app level
const App = () => {
  const { isLoaded } = useGoogleMaps({ apiKey: 'YOUR_API_KEY' });

  if (!isLoaded) return <div>Loading...</div>;

  return <MapComponent />;
};

// ❌ Bad - Loading in every component
const MapComponent = () => {
  const { isLoaded } = useGoogleMaps({ apiKey: 'YOUR_API_KEY' });
  // ...
};
```

### 2. Clean Up Event Listeners

```tsx
useEffect(() => {
  if (!map) return;

  const listener = map.addListener('click', handleClick);

  return () => {
    google.maps.event.removeListener(listener);
  };
}, [map]);
```

### 3. Use Proper Dependencies

```tsx
// ✅ Good - Include all dependencies
useEffect(() => {
  if (map && center) {
    map.setCenter(center);
  }
}, [map, center]);

// ❌ Bad - Missing dependencies
useEffect(() => {
  if (map) {
    map.setCenter(center); // center not in deps
  }
}, [map]);
```

## 📖 Examples

See the [Examples](../examples/README.md) section for complete working examples.

## 🚨 Important Notes

### REST API Hooks

- `useGeocodingService` and `usePlaces` are for server-side use
- Browser requests to Google's REST APIs are blocked by CORS
- Use these hooks in API routes or serverless functions
- For browser usage, use `useGeocoding` with the JavaScript SDK

### Performance Considerations

- Use `useMemo` and `useCallback` for expensive operations
- Implement proper cleanup for event listeners
- Consider using marker clustering for large datasets
- Use React.memo for components that don't need frequent updates
