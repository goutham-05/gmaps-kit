# Getting Started with GMaps Kit

This guide will help you get up and running with `@gmaps-kit/core` and `@gmaps-kit/react` packages.

## 📋 Prerequisites

- Node.js 16+
- A Google Maps API key
- Basic knowledge of JavaScript/TypeScript

## 🔑 Getting a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional)
   - Geocoding API (optional)
4. Create credentials (API Key)
5. Restrict the API key for security

## 📦 Installation

### Core Package

```bash
npm install @gmaps-kit/core
```

### React Package

```bash
npm install @gmaps-kit/react
```

### Both Packages

```bash
npm install @gmaps-kit/core @gmaps-kit/react
```

## 🚀 Quick Start Examples

### Core Package - Basic Map

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

### React Package - Interactive Map

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

  const { markers, addMarker, removeMarker } = useMarkers(map);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      addMarker({
        position: event.latLng.toJSON(),
        title: 'New Marker',
      });
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="h-96 w-full">
      <div ref={mapRef} className="h-full w-full" />
      {map && (
        <button
          onClick={() => map.addListener('click', handleMapClick)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Enable Click to Add Markers
        </button>
      )}
    </div>
  );
};
```

## 🎯 Next Steps

- [Core Package Documentation](./core/README.md) - Framework-agnostic utilities
- [React Package Documentation](./react/README.md) - React hooks and components
- [API Reference](./api-reference.md) - Complete API documentation
- [Examples](./examples/README.md) - Real-world usage examples

## 🆘 Troubleshooting

### Common Issues

**"Google Maps not loading"**

- Check your API key is valid
- Ensure the required APIs are enabled
- Verify billing is set up in Google Cloud Console

**"CORS errors with REST APIs"**

- REST APIs (Places, Geocoding) require server-side implementation
- Use the demo app's proxy configuration as a reference
- Consider using Next.js API routes or serverless functions

**"TypeScript errors"**

- Ensure you have the latest version of the packages
- Check that your TypeScript configuration includes the packages

### Getting Help

- Check the [API Reference](./api-reference.md) for detailed documentation
- Look at the [Examples](./examples/README.md) for common patterns
- Open an issue on GitHub for bugs or feature requests
