# Core Package Documentation

The `@gmaps-kit/core` package provides framework-agnostic utilities for working with Google Maps JavaScript API.

## 📦 Installation

```bash
npm install @gmaps-kit/core
```

## 🚀 Quick Start

```typescript
import { loadGoogleMaps, createMap, addMarker } from '@gmaps-kit/core';

// Load Google Maps
await loadGoogleMaps({
  apiKey: 'YOUR_API_KEY',
  libraries: ['places', 'geometry'],
});

// Create a map
const mapInstance = createMap('map-container', {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 12,
});

// Add a marker
addMarker(mapInstance.map, {
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
});
```

## 📚 API Reference

### Script Loading

#### `loadGoogleMaps(options)`

Loads the Google Maps JavaScript API.

```typescript
interface LoadGoogleMapsOptions {
  apiKey: string;
  libraries?: string[];
  language?: string;
  region?: string;
  version?: string;
}

const result = await loadGoogleMaps({
  apiKey: 'YOUR_API_KEY',
  libraries: ['places', 'geometry'],
  language: 'en',
  region: 'US',
});
```

#### `isGoogleMapsLoaded()`

Checks if Google Maps is already loaded.

```typescript
const isLoaded = isGoogleMapsLoaded();
```

#### `waitForGoogleMaps()`

Waits for Google Maps to be available.

```typescript
await waitForGoogleMaps();
```

### Map Management

#### `createMap(container, options)`

Creates a new Google Map instance.

```typescript
interface MapOptions {
  center: { lat: number; lng: number };
  zoom: number;
  mapTypeId?: google.maps.MapTypeId;
  styles?: google.maps.MapTypeStyle[];
  // ... other Google Maps options
}

const mapInstance = createMap('map-container', {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 12,
});
```

#### `getMapCenter(map)`

Gets the current center of the map.

```typescript
const center = getMapCenter(map);
// Returns: { lat: number; lng: number }
```

#### `setMapCenter(map, center)`

Sets the center of the map.

```typescript
setMapCenter(map, { lat: 40.758, lng: -73.9855 });
```

#### `getMapZoom(map)` / `setMapZoom(map, zoom)`

Gets or sets the zoom level of the map.

```typescript
const zoom = getMapZoom(map);
setMapZoom(map, 15);
```

### Marker Management

#### `addMarker(map, options)`

Adds a marker to the map.

```typescript
interface MarkerOptions {
  position: { lat: number; lng: number };
  title?: string;
  draggable?: boolean;
  icon?: string | google.maps.Icon | google.maps.Symbol;
}

const marker = addMarker(map, {
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
  draggable: true,
});
```

#### `removeMarker(marker)`

Removes a marker from the map.

```typescript
removeMarker(marker);
```

#### `updateMarkerPosition(marker, position)`

Updates the position of a marker.

```typescript
updateMarkerPosition(marker, { lat: 40.758, lng: -73.9855 });
```

### InfoWindow Management

#### `createInfoWindow(options)`

Creates an InfoWindow.

```typescript
const infoWindow = createInfoWindow({
  content: '<h3>Hello World</h3>',
  position: { lat: 40.7128, lng: -74.006 },
});
```

#### `openInfoWindow(infoWindow, map, marker?)`

Opens an InfoWindow.

```typescript
openInfoWindow(infoWindow, map, marker);
```

#### `closeInfoWindow(infoWindow)`

Closes an InfoWindow.

```typescript
closeInfoWindow(infoWindow);
```

### Street View

#### `createStreetViewPanorama(container, options)`

Creates a Street View panorama.

```typescript
const streetView = createStreetViewPanorama('street-view-container', {
  position: { lat: 40.758, lng: -73.9855 },
  pov: { heading: 0, pitch: 0 },
  zoom: 1,
});
```

#### `setStreetViewPov(panorama, pov)`

Sets the point of view of a Street View panorama.

```typescript
setStreetViewPov(panorama, { heading: 120, pitch: -10 });
```

### REST API Clients

#### PlacesClient

Server-side client for Google Places API.

```typescript
import { PlacesClient } from '@gmaps-kit/core';

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
```

#### GeocodingClient

Server-side client for Google Geocoding API.

```typescript
import { GeocodingClient } from '@gmaps-kit/core';

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
```

## 🔧 Advanced Usage

### Custom Map Styles

```typescript
const mapInstance = createMap('map-container', {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 12,
  styles: [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#e9e9e9' }, { lightness: 17 }],
    },
  ],
});
```

### Event Handling

```typescript
// Add click listener
map.addListener('click', (event: google.maps.MapMouseEvent) => {
  if (event.latLng) {
    addMarker(map, {
      position: event.latLng.toJSON(),
      title: 'Clicked Location',
    });
  }
});
```

### Batch Operations

```typescript
// Add multiple markers
const positions = [
  { lat: 40.7128, lng: -74.006 },
  { lat: 40.758, lng: -73.9855 },
  { lat: 40.6892, lng: -74.0445 },
];

positions.forEach((position, index) => {
  addMarker(map, {
    position,
    title: `Marker ${index + 1}`,
  });
});
```

## 🚨 Important Notes

### REST API Usage

- REST API clients (PlacesClient, GeocodingClient) are designed for server-side use
- Browser requests to Google's REST APIs are blocked by CORS
- Use these clients in Node.js, serverless functions, or API routes
- For browser usage, use the JavaScript SDK with the provided utilities

### Performance Considerations

- Load only the libraries you need
- Use marker clustering for large datasets
- Implement proper cleanup for event listeners
- Consider using Web Workers for heavy computations

## 📖 Examples

See the [Examples](../examples/README.md) section for complete working examples.
