# GMaps Kit Demo App

This demo app showcases the `@gmaps-kit/core` and `@gmaps-kit/react` packages with real Google Maps functionality.

## Setup

### 1. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The demo will be available at `http://localhost:3001`

## Features

### Core Package Demo

- Map creation and manipulation
- Marker management
- InfoWindow functionality
- Street View integration
- Web service clients (Geocoding, Places)

### React Package Demo

- React hooks for Google Maps
- Real-time state management
- Interactive examples
- Copy-paste ready code

## API Proxy

The demo uses a Vite proxy to handle Google's REST APIs (Places and Geocoding) server-side, avoiding CORS issues. The proxy:

- Forwards requests to Google's APIs
- Injects your API key securely
- Handles CORS headers
- Works with both Places and Geocoding APIs

## Troubleshooting

### "Failed to fetch" Errors

These are expected when calling Google's REST APIs directly from the browser due to CORS restrictions. The demo uses a proxy to handle this.

### API Key Issues

- Ensure your API key is valid
- Check that the required APIs are enabled
- Verify billing is set up in Google Cloud Console

### Environment Variables

Make sure your `.env` file is in the `demo-app` directory and contains your actual API key.
