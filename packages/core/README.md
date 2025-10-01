# @gmaps-kit/core

Framework-agnostic core utilities for Google Maps JavaScript SDK - geocoding, directions, places, markers, street view, and more.

[![npm version](https://badge.fury.io/js/@gmaps-kit%2Fcore.svg)](https://badge.fury.io/js/@gmaps-kit%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🗺️ **Map Management** - Create and manage Google Maps instances
- 📍 **Geocoding** - Convert addresses to coordinates and vice versa
- 🧭 **Directions** - Get driving, walking, and transit directions
- 🏢 **Places** - Search and get details about places
- 📌 **Markers** - Add, remove, and manage map markers
- 🛣️ **Street View** - Integrate Street View panoramas
- 🔍 **Autocomplete** - Add place autocomplete functionality
- 📦 **Framework Agnostic** - Works with any JavaScript framework
- 🎯 **TypeScript** - Full TypeScript support with type definitions
- ⚡ **Lightweight** - Optimized bundle size (~21KB)

## Installation

```bash
npm install @gmaps-kit/core
```

## Quick Start

### 1. Load Google Maps API

```javascript
import { loadGoogleMaps } from '@gmaps-kit/core';

// Load Google Maps API
await loadGoogleMaps({
  apiKey: 'YOUR_API_KEY',
  libraries: ['places', 'geometry'],
});
```

### 2. Create a Map

```javascript
import { createMap } from '@gmaps-kit/core';

const mapInstance = createMap('map-container', {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 10,
});
```

### 3. Add Markers

```javascript
import { addMarker, createInfoWindow } from '@gmaps-kit/core';

// Add a marker
const marker = addMarker(mapInstance.map, {
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
});

// Create an info window
const infoWindow = createInfoWindow({
  content: '<h3>New York City</h3><p>The Big Apple!</p>',
});
```

## Core Features

### Geocoding

```javascript
import { geocode, reverseGeocode } from '@gmaps-kit/core';

// Convert address to coordinates
geocode('New York City', (results, status) => {
  if (status === 'OK') {
    console.log(results[0].geometry.location);
  }
});

// Convert coordinates to address
reverseGeocode({ lat: 40.7128, lng: -74.006 }, (results, status) => {
  if (status === 'OK') {
    console.log(results[0].formatted_address);
  }
});
```

### Directions

```javascript
import { getDirections, renderDirections } from '@gmaps-kit/core';

getDirections(
  {
    origin: 'New York, NY',
    destination: 'Boston, MA',
    travelMode: 'DRIVING',
  },
  (result, status) => {
    if (status === 'OK') {
      renderDirections(mapInstance.map, result);
    }
  }
);
```

### Places

```javascript
import { PlacesClient } from '@gmaps-kit/core';

const placesClient = new PlacesClient({
  apiKey: 'YOUR_API_KEY',
});

// Search for places
const results = await placesClient.textSearch({
  query: 'restaurants in New York',
  location: { lat: 40.7128, lng: -74.006 },
  radius: 1000,
});
```

### Autocomplete

```javascript
import { createAutocomplete, bindAutocompleteToMap } from '@gmaps-kit/core';

const autocomplete = createAutocomplete(
  document.getElementById('search-input'),
  {
    types: ['establishment'],
    componentRestrictions: { country: 'us' },
  }
);

bindAutocompleteToMap(autocomplete, mapInstance.map);
```

## API Reference

### Map Functions

- `createMap(container, options, eventHandlers?)` - Create a new map instance
- `getMapCenter(map)` - Get map center coordinates
- `setMapCenter(map, center)` - Set map center
- `getMapZoom(map)` - Get current zoom level
- `setMapZoom(map, zoom)` - Set zoom level
- `panTo(map, location)` - Pan to a location
- `fitMapToMarkers(map, markers)` - Fit map to show all markers

### Marker Functions

- `addMarker(map, options)` - Add a marker to the map
- `removeMarker(marker)` - Remove a marker
- `updateMarkerPosition(marker, position)` - Update marker position
- `updateMarkerContent(marker, content)` - Update marker content
- `setMarkerDraggable(marker, draggable)` - Set marker draggable state

### Geocoding Functions

- `geocode(address, callback)` - Geocode an address
- `reverseGeocode(location, callback)` - Reverse geocode coordinates
- `geocodeAsync(address)` - Async geocoding
- `reverseGeocodeAsync(location)` - Async reverse geocoding

### Directions Functions

- `getDirections(request, callback)` - Get directions
- `getDirectionsAsync(request)` - Async directions
- `renderDirections(map, result)` - Render directions on map
- `clearDirections(map)` - Clear directions from map

## TypeScript Support

This package includes full TypeScript definitions:

```typescript
import type {
  MapOptions,
  MarkerOptions,
  GeocodingResult,
} from '@gmaps-kit/core';

const mapOptions: MapOptions = {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 10,
};
```

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
