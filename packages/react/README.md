# @gmaps-kit/react

React components and hooks for Google Maps with gmaps-kit.

## Installation

```bash
npm install @gmaps-kit/react @gmaps-kit/core
```

## Quick Start

```tsx
import React from 'react';
import { Map, Marker, useGoogleMaps, useMap } from '@gmaps-kit/react';

function MyMap() {
  const { isLoaded, load } = useGoogleMaps({
    apiKey: 'YOUR_API_KEY',
    libraries: ['places', 'geometry'],
  });

  const { mapInstance } = useMap('map-container', {
    center: { lat: 40.7128, lng: -74.006 },
    zoom: 10,
  });

  React.useEffect(() => {
    if (!isLoaded) {
      load();
    }
  }, [isLoaded, load]);

  return (
    <div>
      <Map
        id="map-container"
        center={{ lat: 40.7128, lng: -74.006 }}
        zoom={10}
        style={{ height: '400px', width: '100%' }}
      >
        <Marker
          mapInstance={mapInstance}
          position={{ lat: 40.7128, lng: -74.006 }}
          title="New York City"
          onClick={() => console.log('Marker clicked!')}
        />
      </Map>
    </div>
  );
}
```

## Hooks

### useGoogleMaps

Load and manage Google Maps API.

```tsx
const { isLoaded, isLoading, error, load } = useGoogleMaps({
  apiKey: 'YOUR_API_KEY',
  libraries: ['places', 'geometry'],
  onLoad: () => console.log('Maps loaded!'),
  onError: (error) => console.error('Maps failed to load:', error),
});
```

### useMap

Create and manage map instances.

```tsx
const {
  mapInstance,
  isReady,
  center,
  zoom,
  setCenter,
  setZoom,
  panTo,
  fitToMarkers,
} = useMap('map-container', {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 10,
  onMapReady: (map) => console.log('Map ready!'),
});
```

### useMarkers

Manage markers on the map.

```tsx
const { markers, addMarker, removeMarker, updateMarker, clearAllMarkers } =
  useMarkers(mapInstance);

// Add a marker
const marker = addMarker({
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
  draggable: true,
  onClick: () => console.log('Marker clicked!'),
});
```

### useGeocoding

Geocode addresses and reverse geocode coordinates.

```tsx
const { isLoading, error, geocode, reverseGeocode, geocodeFirst } =
  useGeocoding();

// Geocode an address
const results = await geocode('New York, NY');

// Reverse geocode coordinates
const address = await reverseGeocodeFirst({ lat: 40.7128, lng: -74.006 });
```

## Components

### Map

The main map component.

```tsx
<Map
  id="my-map"
  center={{ lat: 40.7128, lng: -74.006 }}
  zoom={10}
  mapTypeId={google.maps.MapTypeId.ROADMAP}
  style={{ height: '400px', width: '100%' }}
  className="my-map-class"
>
  {/* Child components */}
</Map>
```

### Marker

Add markers to the map.

```tsx
<Marker
  mapInstance={mapInstance}
  position={{ lat: 40.7128, lng: -74.006 }}
  title="New York City"
  label="NYC"
  draggable={true}
  onClick={() => console.log('Marker clicked!')}
  onDrag={() => console.log('Marker dragged!')}
  onDragEnd={() => console.log('Marker drag ended!')}
/>
```

### InfoWindow

Display info windows on the map.

```tsx
<InfoWindow
  mapInstance={mapInstance}
  marker={marker}
  content="<h3>Hello World!</h3>"
  isOpen={true}
  onClose={() => console.log('InfoWindow closed')}
/>
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions for all hooks and components.

## License

MIT
