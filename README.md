# gmaps-kit

An open-source toolkit around the Google Maps JavaScript SDK that simplifies usage for frontend teams by providing framework-agnostic utilities and optional framework-specific wrappers.

## 🚀 Features

- **Framework-agnostic core** - Plain TypeScript functions & utilities
- **Script loader** - Easy Google Maps SDK loading
- **Map initialization** - Simple map creation with typed options
- **Markers & InfoWindows** - Easy marker management
- **Places Autocomplete** - Places API integration
- **Geocoding** - Address ↔ coordinates conversion
- **Directions** - Route planning and navigation
- **Distance Matrix** - Calculate distances between multiple points
- **Event handling** - Map and marker event utilities

## 📦 Packages

- `@gmaps-kit/core` - Framework-agnostic core utilities
- `@gmaps-kit/react` - React wrapper (coming soon)
- `@gmaps-kit/vue` - Vue wrapper (coming soon)
- `@gmaps-kit/angular` - Angular wrapper (coming soon)

## 🛠️ Installation

```bash
npm install @gmaps-kit/core
```

## 🎯 Quick Start

### 1. Load Google Maps SDK

```typescript
import { loadGoogleMaps } from '@gmaps-kit/core';

// Load Google Maps with your API key
await loadGoogleMaps({
  apiKey: 'YOUR_API_KEY',
  libraries: ['places', 'geometry'],
});
```

### 2. Create a Map

```typescript
import { createMap } from '@gmaps-kit/core';

const mapInstance = createMap('map-container', {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 10,
});
```

### 3. Add Markers

```typescript
import { addMarker, createInfoWindow, openInfoWindow } from '@gmaps-kit/core';

// Add a marker
const marker = addMarker(mapInstance.map, {
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
});

// Create and open an InfoWindow
const infoWindow = createInfoWindow({
  content: '<h3>New York City</h3><p>The Big Apple!</p>',
});

openInfoWindow(infoWindow, marker, mapInstance.map);
```

### 4. Places Autocomplete

```typescript
import { bindAutocompleteToMap } from '@gmaps-kit/core';

const input = document.getElementById('search-input') as HTMLInputElement;

const autocomplete = bindAutocompleteToMap(mapInstance, {
  input,
  types: ['establishment'],
});
```

### 5. Geocoding

```typescript
import { geocodeAsync, reverseGeocodeAsync } from '@gmaps-kit/core';

// Address to coordinates
const results = await geocodeAsync(
  '1600 Amphitheatre Parkway, Mountain View, CA'
);
console.log(results[0].location); // { lat: 37.4220656, lng: -122.0840897 }

// Coordinates to address
const address = await reverseGeocodeAsync({
  lat: 37.4220656,
  lng: -122.0840897,
});
console.log(address[0].address); // "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA"
```

### 6. Directions

```typescript
import { getDirectionsAsync, renderDirections } from '@gmaps-kit/core';

// Get directions
const directions = await getDirectionsAsync({
  origin: 'New York, NY',
  destination: 'Los Angeles, CA',
  travelMode: 'DRIVING',
});

// Render on map
const directionsRenderer = renderDirections(mapInstance.map, directions);
```

## 📚 API Reference

### Script Loader

```typescript
// Load Google Maps SDK
await loadGoogleMaps({
  apiKey: string;
  libraries?: string[];
  language?: string;
  region?: string;
  version?: string;
  callback?: string;
});

// Check if Google Maps is loaded
const isLoaded = isGoogleMapsLoaded();

// Wait for Google Maps to load
await waitForGoogleMaps(timeout?: number);
```

### Map Utilities

```typescript
// Create a map
const mapInstance = createMap(container, options, eventHandlers?);

// Map controls
getMapCenter(map);
setMapCenter(map, center);
getMapZoom(map);
setMapZoom(map, zoom);
panTo(map, center, zoom?);
fitMapToMarkers(map, markers, padding?);
```

### Marker Utilities

```typescript
// Add marker
const marker = addMarker(map, {
  position: { lat: number, lng: number };
  title?: string;
  label?: string;
  icon?: string | Icon | Symbol;
  animation?: Animation;
  draggable?: boolean;
  clickable?: boolean;
  zIndex?: number;
});

// InfoWindow
const infoWindow = createInfoWindow({
  content: string;
  position?: LatLngLiteral;
  maxWidth?: number;
  pixelOffset?: Size;
  disableAutoPan?: boolean;
});

openInfoWindow(infoWindow, marker, map);
closeInfoWindow(infoWindow);
```

### Autocomplete

```typescript
// Create autocomplete
const autocomplete = createAutocomplete({
  input: HTMLInputElement;
  bounds?: LatLngBounds;
  componentRestrictions?: ComponentRestrictions;
  fields?: string[];
  strictBounds?: boolean;
  types?: string[];
});

// Bind to map
const autocomplete = bindAutocompleteToMap(mapInstance, options);
```

### Geocoding

```typescript
// Geocode address
const results = await geocodeAsync(address);
const firstResult = await geocodeFirst(address);

// Reverse geocode coordinates
const results = await reverseGeocodeAsync(location);
const firstResult = await reverseGeocodeFirst(location);
```

### Directions

```typescript
// Get directions
const directions = await getDirectionsAsync({
  origin: string | LatLngLiteral;
  destination: string | LatLngLiteral;
  travelMode?: TravelMode;
  waypoints?: DirectionsWaypoint[];
  optimizeWaypoints?: boolean;
  avoidHighways?: boolean;
  avoidTolls?: boolean;
});

// Render directions
const renderer = renderDirections(map, directions);
clearDirections(renderer);
```

## 🧪 Testing

```bash
npm test
```

## 🏗️ Development

```bash
# Install dependencies
npm install

# Build packages
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## 📞 Support

For questions and support, please open an issue on our GitHub repository.

---

**Note**: This project is currently in Phase 1 (Core Package). React, Vue, and Angular wrappers will be added in future phases.
