# API Reference

Complete API documentation for `@gmaps-kit/core` and `@gmaps-kit/react` packages.

## 📦 Core Package

### Script Loading

#### `loadGoogleMaps(options: LoadGoogleMapsOptions): Promise<LoadGoogleMapsResult>`

Loads the Google Maps JavaScript API.

**Parameters:**

- `options.apiKey` (string): Your Google Maps API key
- `options.libraries` (string[]): Optional array of library names
- `options.language` (string): Optional language code (e.g., 'en', 'es')
- `options.region` (string): Optional region code (e.g., 'US', 'GB')
- `options.version` (string): Optional API version

**Returns:**

```typescript
interface LoadGoogleMapsResult {
  isLoaded: boolean;
  loadError?: Error;
}
```

**Example:**

```typescript
const result = await loadGoogleMaps({
  apiKey: 'YOUR_API_KEY',
  libraries: ['places', 'geometry'],
  language: 'en',
  region: 'US',
});
```

#### `isGoogleMapsLoaded(): boolean`

Checks if Google Maps is already loaded.

**Returns:** `boolean` - True if Google Maps is loaded

#### `waitForGoogleMaps(): Promise<void>`

Waits for Google Maps to be available.

**Returns:** `Promise<void>`

### Map Management

#### `createMap(container: string | HTMLElement, options: MapOptions): MapInstance`

Creates a new Google Map instance.

**Parameters:**

- `container`: DOM element ID or HTMLElement
- `options`: Map configuration options

**Returns:**

```typescript
interface MapInstance {
  map: google.maps.Map;
  container: HTMLElement;
}
```

**Example:**

```typescript
const mapInstance = createMap('map-container', {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 12,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
});
```

#### `getMapCenter(map: google.maps.Map): google.maps.LatLngLiteral`

Gets the current center of the map.

**Parameters:**

- `map`: Google Maps instance

**Returns:** `{ lat: number; lng: number }`

#### `setMapCenter(map: google.maps.Map, center: google.maps.LatLngLiteral): void`

Sets the center of the map.

**Parameters:**

- `map`: Google Maps instance
- `center`: New center coordinates

#### `getMapZoom(map: google.maps.Map): number`

Gets the current zoom level.

**Parameters:**

- `map`: Google Maps instance

**Returns:** `number` - Current zoom level

#### `setMapZoom(map: google.maps.Map, zoom: number): void`

Sets the zoom level.

**Parameters:**

- `map`: Google Maps instance
- `zoom`: New zoom level

### Marker Management

#### `addMarker(map: google.maps.Map, options: MarkerOptions): google.maps.Marker`

Adds a marker to the map.

**Parameters:**

- `map`: Google Maps instance
- `options`: Marker configuration

**Returns:** `google.maps.Marker` - Created marker instance

**Example:**

```typescript
const marker = addMarker(map, {
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
  draggable: true,
  icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
});
```

#### `removeMarker(marker: google.maps.Marker): void`

Removes a marker from the map.

**Parameters:**

- `marker`: Marker instance to remove

#### `updateMarkerPosition(marker: google.maps.Marker, position: google.maps.LatLngLiteral): void`

Updates the position of a marker.

**Parameters:**

- `marker`: Marker instance
- `position`: New position coordinates

### InfoWindow Management

#### `createInfoWindow(options: InfoWindowOptions): google.maps.InfoWindow`

Creates an InfoWindow.

**Parameters:**

- `options`: InfoWindow configuration

**Returns:** `google.maps.InfoWindow` - Created InfoWindow instance

**Example:**

```typescript
const infoWindow = createInfoWindow({
  content: '<h3>Hello World</h3>',
  position: { lat: 40.7128, lng: -74.006 },
});
```

#### `openInfoWindow(infoWindow: google.maps.InfoWindow, map: google.maps.Map, marker?: google.maps.Marker): void`

Opens an InfoWindow.

**Parameters:**

- `infoWindow`: InfoWindow instance
- `map`: Google Maps instance
- `marker`: Optional marker to attach to

#### `closeInfoWindow(infoWindow: google.maps.InfoWindow): void`

Closes an InfoWindow.

**Parameters:**

- `infoWindow`: InfoWindow instance to close

### Street View

#### `createStreetViewPanorama(container: string | HTMLElement, options: StreetViewOptions): StreetViewInstance`

Creates a Street View panorama.

**Parameters:**

- `container`: DOM element ID or HTMLElement
- `options`: Street View configuration

**Returns:**

```typescript
interface StreetViewInstance {
  panorama: google.maps.StreetViewPanorama;
  container: HTMLElement;
}
```

**Example:**

```typescript
const streetView = createStreetViewPanorama('street-view-container', {
  position: { lat: 40.758, lng: -73.9855 },
  pov: { heading: 0, pitch: 0 },
  zoom: 1,
});
```

#### `setStreetViewPov(panorama: google.maps.StreetViewPanorama, pov: google.maps.StreetViewPov): void`

Sets the point of view of a Street View panorama.

**Parameters:**

- `panorama`: Street View panorama instance
- `pov`: Point of view configuration

### REST API Clients

#### `PlacesClient`

Server-side client for Google Places API.

**Constructor:**

```typescript
new PlacesClient(options: PlacesClientOptions)
```

**Options:**

```typescript
interface PlacesClientOptions {
  apiKey: string;
  baseUrl?: string;
  language?: string;
  region?: string;
  channel?: string;
  timeoutMs?: number;
  retryConfig?: RetryConfig;
  requestInit?: RequestInit;
  fetchImpl?: typeof fetch;
}
```

**Methods:**

- `textSearch(request: TextSearchRequest): Promise<TextSearchResponse>`
- `nearbySearch(request: NearbySearchRequest): Promise<NearbySearchResponse>`
- `placeDetails(request: PlaceDetailsRequest): Promise<PlaceDetailsResponse>`
- `autocomplete(request: AutocompleteRequest): Promise<AutocompleteResponse>`

**Example:**

```typescript
const places = new PlacesClient({
  apiKey: process.env.GOOGLE_MAPS_API_KEY!,
  retryConfig: { retries: 2, delayMs: 500 },
});

const response = await places.textSearch({
  query: 'coffee in Seattle',
  type: 'cafe',
});
```

#### `GeocodingClient`

Server-side client for Google Geocoding API.

**Constructor:**

```typescript
new GeocodingClient(options: GeocodingClientOptions)
```

**Options:**

```typescript
interface GeocodingClientOptions {
  apiKey: string;
  baseUrl?: string;
  language?: string;
  region?: string;
  channel?: string;
  timeoutMs?: number;
  retryConfig?: RetryConfig;
  requestInit?: RequestInit;
  fetchImpl?: typeof fetch;
}
```

**Methods:**

- `geocode(request: GeocodeRequest): Promise<GeocodeResponse>`
- `reverseGeocode(request: ReverseGeocodeRequest): Promise<GeocodeResponse>`

**Example:**

```typescript
const geocoding = new GeocodingClient({
  apiKey: process.env.GOOGLE_MAPS_API_KEY!,
});

const result = await geocoding.geocode({
  address: '221B Baker Street, London',
});
```

## ⚛️ React Package

### Hooks

#### `useGoogleMaps(options: LoadGoogleMapsOptions)`

Loads Google Maps and provides loading state.

**Parameters:**

- `options`: Same as `loadGoogleMaps` options

**Returns:**

```typescript
interface UseGoogleMapsResult {
  isLoaded: boolean;
  loadError?: Error;
}
```

**Example:**

```tsx
const { isLoaded, loadError } = useGoogleMaps({
  apiKey: 'YOUR_API_KEY',
  libraries: ['places'],
});
```

#### `useMap(options: MapOptions)`

Creates and manages a Google Map instance.

**Parameters:**

- `options`: Map configuration options

**Returns:**

```typescript
interface UseMapResult {
  map: google.maps.Map | null;
  mapRef: RefObject<HTMLDivElement>;
  isMapReady: boolean;
}
```

**Example:**

```tsx
const { map, mapRef, isMapReady } = useMap({
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 12,
});
```

#### `useMarkers(map: google.maps.Map | null)`

Manages markers on the map.

**Parameters:**

- `map`: Google Maps instance

**Returns:**

```typescript
interface UseMarkersResult {
  markers: google.maps.Marker[];
  addMarker: (options: MarkerOptions) => google.maps.Marker;
  removeMarker: (marker: google.maps.Marker) => void;
  updateMarkerPosition: (
    marker: google.maps.Marker,
    position: google.maps.LatLngLiteral
  ) => void;
  clearMarkers: () => void;
}
```

**Example:**

```tsx
const { markers, addMarker, removeMarker } = useMarkers(map);

const handleAddMarker = () => {
  addMarker({
    position: { lat: 40.7128, lng: -74.006 },
    title: 'New Marker',
  });
};
```

#### `useGeocoding(map: google.maps.Map | null)`

Provides geocoding functionality using the JavaScript SDK.

**Parameters:**

- `map`: Google Maps instance

**Returns:**

```typescript
interface UseGeocodingResult {
  geocode: (request: GeocoderRequest) => Promise<GeocoderResult[]>;
  reverseGeocode: (request: GeocoderRequest) => Promise<GeocoderResult[]>;
  isGeocoding: boolean;
}
```

**Example:**

```tsx
const { geocode, reverseGeocode, isGeocoding } = useGeocoding(map);

const handleGeocode = async () => {
  const results = await geocode({
    address: '1600 Amphitheatre Parkway, Mountain View, CA',
  });
  console.log(results);
};
```

#### `useGeocodingService(options: GeocodingServiceOptions)`

React hook for the Geocoding REST API client.

**Parameters:**

- `options`: Geocoding service configuration

**Returns:**

```typescript
interface UseGeocodingServiceResult {
  geocode: (request: GeocodeRequest) => Promise<GeocodeResponse>;
  reverseGeocode: (request: ReverseGeocodeRequest) => Promise<GeocodeResponse>;
  isLoading: boolean;
  error: Error | null;
}
```

**Example:**

```tsx
const { geocode, reverseGeocode, isLoading, error } = useGeocodingService({
  apiKey: 'YOUR_API_KEY',
});

const handleGeocode = async () => {
  const result = await geocode({
    address: '1600 Amphitheatre Parkway, Mountain View, CA',
  });
  console.log(result);
};
```

#### `usePlaces(options: PlacesServiceOptions)`

React hook for the Places REST API client.

**Parameters:**

- `options`: Places service configuration

**Returns:**

```typescript
interface UsePlacesResult {
  textSearch: (request: TextSearchRequest) => Promise<TextSearchResponse>;
  nearbySearch: (request: NearbySearchRequest) => Promise<NearbySearchResponse>;
  placeDetails: (request: PlaceDetailsRequest) => Promise<PlaceDetailsResponse>;
  autocomplete: (request: AutocompleteRequest) => Promise<AutocompleteResponse>;
  isLoading: boolean;
  error: Error | null;
}
```

**Example:**

```tsx
const { textSearch, nearbySearch, isLoading, error } = usePlaces({
  apiKey: 'YOUR_API_KEY',
});

const handleSearch = async () => {
  const results = await textSearch({
    query: 'coffee in Seattle',
    type: 'cafe',
  });
  console.log(results);
};
```

#### `useStreetView(options: StreetViewOptions)`

Manages Street View panoramas.

**Parameters:**

- `options`: Street View configuration

**Returns:**

```typescript
interface UseStreetViewResult {
  panorama: google.maps.StreetViewPanorama | null;
  panoramaRef: RefObject<HTMLDivElement>;
  setPosition: (position: google.maps.LatLngLiteral) => void;
  setPov: (pov: google.maps.StreetViewPov) => void;
  setZoom: (zoom: number) => void;
}
```

**Example:**

```tsx
const { panorama, panoramaRef, setPosition, setPov } = useStreetView({
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

### Components

#### `Map`

React component for Google Maps.

**Props:**

```typescript
interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  mapTypeId?: google.maps.MapTypeId;
  styles?: google.maps.MapTypeStyle[];
  className?: string;
  children?: React.ReactNode;
}
```

**Example:**

```tsx
<Map center={{ lat: 40.7128, lng: -74.006 }} zoom={12} className="h-96 w-full">
  <Marker position={{ lat: 40.7128, lng: -74.006 }} title="NYC" />
</Map>
```

#### `Marker`

React component for map markers.

**Props:**

```typescript
interface MarkerProps {
  position: google.maps.LatLngLiteral;
  title?: string;
  draggable?: boolean;
  icon?: string | google.maps.Icon | google.maps.Symbol;
  onClick?: (event: google.maps.MapMouseEvent) => void;
  onDragEnd?: (event: google.maps.MapMouseEvent) => void;
}
```

**Example:**

```tsx
<Marker
  position={{ lat: 40.7128, lng: -74.006 }}
  title="New York City"
  draggable={true}
  onClick={(event) => console.log('Marker clicked', event)}
/>
```

#### `InfoWindow`

React component for info windows.

**Props:**

```typescript
interface InfoWindowProps {
  position: google.maps.LatLngLiteral;
  content: string | HTMLElement;
  visible?: boolean;
  onClose?: () => void;
}
```

**Example:**

```tsx
<InfoWindow
  position={{ lat: 40.7128, lng: -74.006 }}
  content="<h3>Hello World</h3>"
  visible={true}
  onClose={() => console.log('InfoWindow closed')}
/>
```

## 🔧 Types

### Common Types

```typescript
interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface RetryConfig {
  retries: number;
  delayMs: number;
  backoffFactor: number;
  retryStatuses: number[];
}

interface LoadGoogleMapsOptions {
  apiKey: string;
  libraries?: string[];
  language?: string;
  region?: string;
  version?: string;
}

interface MapOptions {
  center: LatLngLiteral;
  zoom: number;
  mapTypeId?: google.maps.MapTypeId;
  styles?: google.maps.MapTypeStyle[];
  // ... other Google Maps options
}

interface MarkerOptions {
  position: LatLngLiteral;
  title?: string;
  draggable?: boolean;
  icon?: string | google.maps.Icon | google.maps.Symbol;
}

interface InfoWindowOptions {
  content: string | HTMLElement;
  position?: LatLngLiteral;
}

interface StreetViewOptions {
  position: LatLngLiteral;
  pov?: google.maps.StreetViewPov;
  zoom?: number;
}
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
- Use React.memo for components that don't need frequent updates
