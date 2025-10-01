# Migration Guide

This guide helps you migrate from other Google Maps libraries to `@gmaps-kit/core` and `@gmaps-kit/react`.

## 🔄 From @googlemaps/js-api-loader

### Before (js-api-loader)

```typescript
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: 'YOUR_API_KEY',
  version: 'weekly',
  libraries: ['places'],
});

const { Map } = await loader.importLibrary('maps');
const map = new Map(document.getElementById('map'), {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 12,
});
```

### After (gmaps-kit)

```typescript
import { loadGoogleMaps, createMap } from '@gmaps-kit/core';

await loadGoogleMaps({
  apiKey: 'YOUR_API_KEY',
  libraries: ['places'],
});

const mapInstance = createMap('map', {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 12,
});
```

## 🔄 From react-google-maps-api

### Before (react-google-maps-api)

```tsx
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const MyMap = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_API_KEY',
    libraries: ['places'],
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px' }}
      center={{ lat: 40.7128, lng: -74.006 }}
      zoom={12}
    >
      <Marker position={{ lat: 40.7128, lng: -74.006 }} />
    </GoogleMap>
  );
};
```

### After (gmaps-kit)

```tsx
import { useGoogleMaps, useMap, useMarkers } from '@gmaps-kit/react';

const MyMap = () => {
  const { isLoaded } = useGoogleMaps({
    apiKey: 'YOUR_API_KEY',
    libraries: ['places'],
  });

  const { map, mapRef } = useMap({
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 12,
  });

  const { addMarker } = useMarkers(map);

  useEffect(() => {
    if (map) {
      addMarker({
        position: { lat: 40.7128, lng: -74.006 },
        title: 'New York City',
      });
    }
  }, [map, addMarker]);

  if (!isLoaded) return <div>Loading...</div>;

  return <div ref={mapRef} className="h-96 w-full" />;
};
```

## 🔄 From @googlemaps/marker

### Before (@googlemaps/marker)

```typescript
import { AdvancedMarkerElement } from '@googlemaps/marker';

const marker = new AdvancedMarkerElement({
  map,
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
});
```

### After (gmaps-kit)

```typescript
import { addMarker } from '@gmaps-kit/core';

const marker = addMarker(map, {
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
});
```

## 🔄 From Custom Google Maps Implementation

### Before (Custom Implementation)

```typescript
// Manual Google Maps setup
const map = new google.maps.Map(document.getElementById('map'), {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 12,
});

const marker = new google.maps.Marker({
  position: { lat: 40.7128, lng: -74.006 },
  map: map,
  title: 'New York City',
});

const infoWindow = new google.maps.InfoWindow({
  content: '<h3>Hello World</h3>',
});

marker.addListener('click', () => {
  infoWindow.open(map, marker);
});
```

### After (gmaps-kit)

```typescript
import {
  createMap,
  addMarker,
  createInfoWindow,
  openInfoWindow,
} from '@gmaps-kit/core';

const mapInstance = createMap('map', {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 12,
});

const marker = addMarker(mapInstance.map, {
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
});

const infoWindow = createInfoWindow({
  content: '<h3>Hello World</h3>',
});

marker.addListener('click', () => {
  openInfoWindow(infoWindow, mapInstance.map, marker);
});
```

## 🔄 From Server-Side Google Maps APIs

### Before (Manual REST API calls)

```typescript
// Manual fetch calls to Google APIs
const response = await fetch(
  `https://maps.googleapis.com/maps/api/place/textsearch/json?query=coffee&key=${apiKey}`
);
const data = await response.json();
```

### After (gmaps-kit)

```typescript
import { PlacesClient } from '@gmaps-kit/core';

const places = new PlacesClient({ apiKey: 'YOUR_API_KEY' });
const response = await places.textSearch({
  query: 'coffee',
  type: 'cafe',
});
```

## 🎯 Key Benefits of Migration

### 1. **Type Safety**

- Full TypeScript support with IntelliSense
- Compile-time error checking
- Better developer experience

### 2. **Simplified API**

- Fewer lines of code
- Consistent patterns across all functions
- Better error handling

### 3. **React Integration**

- Specialized hooks for React applications
- Automatic state management
- Performance optimizations

### 4. **Server-Side Support**

- REST API clients for server-side usage
- Retry logic and error handling
- Type-safe API responses

### 5. **Better Testing**

- Comprehensive test coverage
- Mock utilities for testing
- Better debugging support

## 📋 Migration Checklist

### Core Package Migration

- [ ] Replace manual Google Maps initialization with `loadGoogleMaps`
- [ ] Replace manual map creation with `createMap`
- [ ] Replace manual marker creation with `addMarker`
- [ ] Replace manual InfoWindow creation with `createInfoWindow`
- [ ] Update event handling to use provided utilities

### React Package Migration

- [ ] Replace manual Google Maps loading with `useGoogleMaps`
- [ ] Replace manual map management with `useMap`
- [ ] Replace manual marker management with `useMarkers`
- [ ] Add proper cleanup for event listeners
- [ ] Update component lifecycle management

### Server-Side Migration

- [ ] Replace manual fetch calls with REST API clients
- [ ] Update error handling to use provided error types
- [ ] Add retry logic for failed requests
- [ ] Update response handling to use typed responses

## 🚨 Common Migration Issues

### 1. **Event Listener Cleanup**

```typescript
// ❌ Before - Manual cleanup
useEffect(() => {
  const listener = map.addListener('click', handleClick);
  return () => {
    google.maps.event.removeListener(listener);
  };
}, [map]);

// ✅ After - Automatic cleanup with gmaps-kit
const { map } = useMap({ center, zoom });
// Event handling is managed automatically
```

### 2. **State Management**

```typescript
// ❌ Before - Manual state management
const [markers, setMarkers] = useState([]);
const [map, setMap] = useState(null);

// ✅ After - Automatic state management
const { markers, addMarker } = useMarkers(map);
```

### 3. **Error Handling**

```typescript
// ❌ Before - Manual error handling
try {
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error('API Error');
  const data = await response.json();
} catch (error) {
  console.error(error);
}

// ✅ After - Built-in error handling
const { textSearch, error } = usePlaces({ apiKey });
// Error handling is built-in
```

## 🆘 Need Help?

- Check the [API Reference](./api-reference.md) for detailed documentation
- Look at the [Examples](./examples/README.md) for migration patterns
- Open an issue on GitHub for specific migration questions
