# 🗺️ gmaps-kit/core Demo App

A comprehensive React application showcasing all 50+ functions of the `@gmaps-kit/core` package.

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Get a Google Maps API key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API
     - Geocoding API
     - Directions API
     - Distance Matrix API
   - Create credentials (API Key)
   - Restrict the key to your domain for security

3. **Start the demo:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Go to `http://localhost:3001`
   - Enter your API key
   - Click "Load Google Maps"
   - Explore all the functions!

## 🎯 What You'll See

### **Interactive Demo Features:**

- **🗺️ Map Controls** - Zoom, pan, center controls
- **📍 Markers & InfoWindows** - Add/remove markers, create popups
- **🌍 Geocoding** - Convert addresses to coordinates
- **🛣️ Directions & Routes** - Get driving directions, calculate distances
- **🔍 Places & Autocomplete** - Search for places, businesses, etc.

### **Live Code Examples:**

- Real-time function execution
- Status updates for each operation
- Visual feedback on the map
- Copy-paste ready code snippets

## 🧪 Testing All Functions

The demo app includes buttons to test:

### **Map Controls (7 functions):**

- `getMapCenter()` - Get current center
- `setMapCenter()` - Set new center
- `getMapZoom()` - Get zoom level
- `setMapZoom()` - Set zoom level
- `panTo()` - Smooth pan to location
- `fitMapToMarkers()` - Fit map to show all markers
- `fitMapToRoute()` - Fit map to show route

### **Markers & InfoWindows (15 functions):**

- `addMarker()` - Add markers to map
- `removeMarker()` - Remove specific marker
- `createInfoWindow()` - Create popup windows
- `openInfoWindow()` - Show popup on marker
- `closeInfoWindow()` - Hide popup
- `clearMarkers()` - Remove all markers
- `clearInfoWindows()` - Remove all popups
- And more marker utilities...

### **Geocoding (9 functions):**

- `geocodeAsync()` - Address to coordinates
- `reverseGeocodeAsync()` - Coordinates to address
- `geocodeFirst()` - Get first result
- `reverseGeocodeFirst()` - Get first reverse result
- `geocodeWithComponents()` - Geocode with restrictions
- `geocodeWithBounds()` - Geocode within bounds
- `geocodeWithRegion()` - Geocode with region bias

### **Directions & Routes (14 functions):**

- `getDirectionsAsync()` - Get driving directions
- `getDistanceMatrixAsync()` - Calculate distances
- `renderDirections()` - Show route on map
- `clearDirections()` - Remove route
- `getTotalDistance()` - Get route distance
- `getTotalDuration()` - Get route duration
- `createDirectionsService()` - Create service
- `createDirectionsRenderer()` - Create renderer
- And more direction utilities...

### **Places & Autocomplete (15 functions):**

- `createAutocomplete()` - Create search input
- `bindAutocompleteToMap()` - Bind to map
- `getSelectedPlace()` - Get selected place
- `addPlaceChangedListener()` - Listen for changes
- `setAutocompleteBounds()` - Set search bounds
- `setAutocompleteTypes()` - Filter by type
- `createSearchBox()` - Create search box
- And more autocomplete utilities...

## 💻 Code Examples

The demo shows real usage patterns:

```typescript
// Load Google Maps
await loadGoogleMaps({
  apiKey: 'YOUR_API_KEY',
  libraries: ['places', 'geometry'],
});

// Create map
const map = createMap('map-container', {
  center: { lat: 40.7128, lng: -74.006 },
  zoom: 10,
});

// Add marker
const marker = addMarker(map, {
  position: { lat: 40.7128, lng: -74.006 },
  title: 'New York City',
});

// Geocode address
const results = await geocodeAsync('Times Square, New York');
const location = results[0].location;

// Get directions
const directions = await getDirectionsAsync({
  origin: 'New York, NY',
  destination: 'Los Angeles, CA',
  travelMode: 'DRIVING',
});
```

## 🎨 Features

- **Interactive UI** - Click buttons to test functions
- **Real-time feedback** - See results immediately
- **Status updates** - Know what's happening
- **Code examples** - Copy-paste ready snippets
- **Error handling** - Graceful failure management
- **Responsive design** - Works on all devices

## 🔧 Development

This demo app uses:

- **React 18** - Modern React with hooks
- **TypeScript** - Full type safety
- **Vite** - Fast development server
- **@gmaps-kit/core** - Our core package

## 📚 Learn More

- **Documentation:** [README.md](../README.md)
- **Core Package:** [packages/core](../packages/core)
- **GitHub:** [gmaps-kit](https://github.com/your-username/gmaps-kit)

## 🚀 Next Steps

After exploring the demo:

1. **Install the package** in your project
2. **Copy code examples** from the demo
3. **Build your own maps** with gmaps-kit
4. **Share your creations** with the community!

---

**Happy mapping! 🗺️✨**
