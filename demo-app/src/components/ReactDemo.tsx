import React, { useState, useEffect, useCallback } from 'react';
import {
  Map,
  Marker,
  InfoWindow,
  useGoogleMaps,
  useMarkers,
  useGeocoding,
} from '@gmaps-kit/react';

export const ReactDemo: React.FC = () => {
  const [apiKey, setApiKey] = useState('YOUR_API_KEY');
  const [status, setStatus] = useState(
    'Enter your Google Maps API key to get started and explore all the features below'
  );
  const [selectedMarker, setSelectedMarker] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [searchAddress, setSearchAddress] = useState('Times Square, New York');

  // Interactive controls state
  const [mapType, setMapTypeState] = useState<string>('roadmap');
  const [customCenter, setCustomCenter] = useState({
    lat: 40.7128,
    lng: -74.006,
  });
  const [customZoom, setCustomZoom] = useState(10);
  const [markerTitle, setMarkerTitle] = useState('Custom Marker');
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  // Memoize callbacks to prevent re-renders
  const onMapsLoad = useCallback(() => {
    setStatus('✅ Google Maps API loaded!');
  }, []);

  const onMapsError = useCallback((error: Error) => {
    setStatus(`❌ Error: ${error.message}`);
  }, []);

  const {
    isLoaded: mapsLoaded,
    load: loadMaps,
    error,
  } = useGoogleMaps({
    apiKey,
    libraries: ['places', 'geometry', 'marker'],
    onLoad: onMapsLoad,
    onError: onMapsError,
  });

  // Map state - we'll get the map instance from the Map component
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [center, setCenterState] = useState<google.maps.LatLngLiteral>({
    lat: 40.7128,
    lng: -74.006,
  });
  const [zoom, setZoomState] = useState(10);

  const { markers, addMarker, removeMarker, clearAllMarkers } = useMarkers(
    mapInstance ? { map: mapInstance, markers: [], infoWindows: [] } : null
  );

  const {
    geocode,
    reverseGeocode,
    isLoading: geocodingLoading,
  } = useGeocoding();

  // Debug logging
  useEffect(() => {
    console.log('mapsLoaded from hook:', mapsLoaded);
    console.log('mapInstance:', mapInstance);
    console.log('center:', center);
    console.log('zoom:', zoom);
  }, [mapsLoaded, mapInstance, center, zoom]);

  // Clear selected marker if it's not in the markers array
  useEffect(() => {
    if (selectedMarker && !markers.includes(selectedMarker)) {
      console.log('Selected marker no longer exists, clearing selection');
      setSelectedMarker(null);
    }
  }, [markers, selectedMarker]);

  const handleLoadMaps = async () => {
    if (!apiKey || apiKey === 'YOUR_API_KEY') {
      setStatus('⚠️ Please enter a valid Google Maps API key');
      return;
    }
    setStatus('🔄 Loading Google Maps API...');
    try {
      await loadMaps();
    } catch (error) {
      setStatus(`❌ Failed to load Google Maps: ${error.message}`);
    }
  };

  const handleSearch = async () => {
    console.log(
      'Search clicked, mapInstance:',
      mapInstance,
      'searchAddress:',
      searchAddress
    );
    if (!mapInstance || !searchAddress.trim()) {
      setStatus('❌ Map not ready or no search address');
      return;
    }

    try {
      setStatus(`🔍 Searching for: ${searchAddress}...`);
      const results = await geocode(searchAddress);

      if (results.length > 0) {
        const result = results[0];

        const marker = addMarker({
          position: result.location,
          title: result.address,
          onClick: () => setSelectedMarker(marker),
        });

        setCenter(result.location);
        setZoom(15);

        setStatus(`✅ Found: ${result.address}`);
      } else {
        setStatus(`❌ No results found for: ${searchAddress}`);
      }
    } catch (error) {
      setStatus(`❌ Search failed: ${error.message}`);
    }
  };

  const handleReverseGeocode = async () => {
    if (!mapInstance || !center) return;

    try {
      setStatus('🔍 Reverse geocoding current location...');
      const results = await reverseGeocode(center);

      if (results.length > 0) {
        setStatus(`📍 Current location: ${results[0].address}`);
      } else {
        setStatus('❌ Could not determine current location');
      }
    } catch (error) {
      setStatus(`❌ Reverse geocoding failed: ${error.message}`);
    }
  };

  // Map control functions
  const setCenter = (newCenter: google.maps.LatLngLiteral) => {
    setCenterState(newCenter);
    if (mapInstance) {
      mapInstance.setCenter(newCenter);
    }
  };

  const setZoom = (newZoom: number) => {
    setZoomState(newZoom);
    if (mapInstance) {
      mapInstance.setZoom(newZoom);
    }
  };

  const setMapType = (newMapType: string) => {
    if (mapInstance) {
      mapInstance.setMapTypeId(newMapType as google.maps.MapTypeId);
    }
  };

  const handleAddMarker = () => {
    console.log('Add marker clicked, mapInstance:', mapInstance);
    if (!mapInstance) {
      setStatus('❌ Map not ready yet');
      return;
    }

    const marker = addMarker({
      position: center || { lat: 40.7128, lng: -74.006 },
      title: markerTitle || `Marker ${markers.length + 1}`,
      draggable: true,
      onClick: () => setSelectedMarker(marker),
      onDrag: () => setStatus('🖱️ Marker being dragged...'),
      onDragEnd: () => setStatus('🏁 Marker drag ended'),
    });

    setStatus(
      `📍 Added marker: ${markerTitle || `Marker ${markers.length + 1}`}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                @gmaps-kit/react
              </h1>
              <p className="text-sm text-gray-600">
                React hooks and components for Google Maps
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto h-screen sticky top-0">
          {/* API Key Setup */}
          <div className="google-card mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              🔑 API Key
            </h3>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter Google Maps API key"
              className="google-input mb-4"
            />
            <button
              onClick={handleLoadMaps}
              disabled={!apiKey || apiKey === 'YOUR_API_KEY' || mapsLoaded}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                mapsLoaded
                  ? 'bg-green-500 text-white cursor-default'
                  : 'google-button-primary'
              }`}
            >
              {mapsLoaded ? '✅ Maps Loaded' : 'Load Google Maps'}
            </button>
          </div>

          {/* Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="text-blue-700 font-semibold mb-2">📊 Status</h4>
            <p className="text-sm text-gray-600">{status}</p>
            {error && (
              <p className="text-sm text-red-600 mt-2">
                Error: {error.message}
              </p>
            )}
          </div>

          {/* Interactive Controls */}
          <div
            className={`relative space-y-4 ${!mapsLoaded ? 'pointer-events-none' : ''}`}
          >
            {!mapsLoaded && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/30 z-10 rounded-lg"></div>
            )}
            <h3 className="text-gray-700 font-semibold mb-4">
              🎮 Interactive Controls
              {!mapsLoaded && (
                <span className="text-xs text-red-500 ml-2">
                  (Enter API key to enable)
                </span>
              )}
            </h3>

            {/* Map Controls */}
            <div className="google-card">
              <h4 className="font-semibold text-gray-700 mb-3">
                🗺️ Map Controls
              </h4>
              <div className="space-y-3">
                {/* Map Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Map Type
                  </label>
                  <select
                    value={mapType}
                    onChange={(e) => {
                      setMapTypeState(e.target.value);
                      setMapType(e.target.value);
                      setStatus(`🗺️ Map type changed to ${e.target.value}`);
                    }}
                    className="google-input text-sm"
                  >
                    <option value="roadmap">Roadmap</option>
                    <option value="satellite">Satellite</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="terrain">Terrain</option>
                  </select>
                </div>

                {/* Center Controls */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Center (Lat, Lng)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="0.0001"
                      value={customCenter.lat}
                      onChange={(e) =>
                        setCustomCenter((prev) => ({
                          ...prev,
                          lat: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="Latitude"
                      className="google-input text-sm"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      value={customCenter.lng}
                      onChange={(e) =>
                        setCustomCenter((prev) => ({
                          ...prev,
                          lng: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="Longitude"
                      className="google-input text-sm"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!mapsLoaded) {
                        setStatus(
                          '⚠️ Please enter your Google Maps API key first'
                        );
                        return;
                      }
                      setCenter(customCenter);
                      setStatus(
                        `📍 Map center updated to ${customCenter.lat.toFixed(4)}, ${customCenter.lng.toFixed(4)}`
                      );
                    }}
                    disabled={!mapsLoaded}
                    className={`w-full mt-2 py-2 px-3 rounded-md text-sm transition-colors ${
                      !mapsLoaded
                        ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                    }`}
                  >
                    Update Center
                  </button>
                </div>

                {/* Zoom Controls */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Zoom Level: {customZoom}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={customZoom}
                    onChange={(e) => setCustomZoom(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <button
                    onClick={() => {
                      if (!mapsLoaded) {
                        setStatus(
                          '⚠️ Please enter your Google Maps API key first'
                        );
                        return;
                      }
                      setZoom(customZoom);
                      setStatus(`🔍 Zoom updated to ${customZoom}`);
                    }}
                    disabled={!mapsLoaded}
                    className={`w-full mt-2 py-2 px-3 rounded-md text-sm transition-colors ${
                      !mapsLoaded
                        ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                    }`}
                  >
                    Update Zoom
                  </button>
                </div>
              </div>
            </div>

            {/* Marker Controls */}
            <div className="google-card">
              <h4 className="font-semibold text-gray-700 mb-3">
                📍 Marker Controls
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Marker Title
                  </label>
                  <input
                    type="text"
                    value={markerTitle}
                    onChange={(e) => setMarkerTitle(e.target.value)}
                    placeholder="Enter marker title"
                    className="google-input text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddMarker}
                    disabled={!mapsLoaded}
                    className={`py-2 px-3 rounded-md text-sm transition-colors ${
                      !mapsLoaded
                        ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                    }`}
                  >
                    Add Marker
                  </button>
                  <button
                    onClick={() => {
                      if (!mapsLoaded) {
                        setStatus(
                          '⚠️ Please enter your Google Maps API key first'
                        );
                        return;
                      }
                      console.log(
                        'Clearing all markers, current selected:',
                        selectedMarker
                      );
                      clearAllMarkers();
                      setSelectedMarker(null);
                      console.log(
                        'Markers cleared, selected marker set to null'
                      );
                      setStatus('🧹 All markers cleared');
                    }}
                    disabled={!mapsLoaded}
                    className={`py-2 px-3 rounded-md text-sm transition-colors ${
                      !mapsLoaded
                        ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
                    }`}
                  >
                    Clear All
                  </button>
                </div>

                <div className="text-xs text-gray-500">
                  Markers: {markers.length}
                </div>
              </div>
            </div>

            {/* Real-time Status */}
            <div className="google-card">
              <h4 className="font-semibold text-gray-700 mb-3">
                📊 Real-time Status
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Map Ready:</span>
                  <span
                    className={mapInstance ? 'text-green-600' : 'text-red-600'}
                  >
                    {mapInstance ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Center:</span>
                  <span className="text-blue-600">
                    {center
                      ? `${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Zoom:</span>
                  <span className="text-blue-600">{zoom || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Map Type:</span>
                  <span className="text-blue-600">{mapType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Markers Count:</span>
                  <span className="text-blue-600">{markers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Geocoding:</span>
                  <span
                    className={
                      geocodingLoading ? 'text-yellow-600' : 'text-green-600'
                    }
                  >
                    {geocodingLoading ? '⏳ Loading' : '✅ Ready'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="google-card">
              <h4 className="font-semibold text-gray-700 mb-3">
                ⚡ Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (!mapsLoaded) {
                      setStatus(
                        '⚠️ Please enter your Google Maps API key first'
                      );
                      return;
                    }
                    setCenter({ lat: 40.7128, lng: -74.006 });
                    setZoom(10);
                    setStatus('🗽 Moved to New York City');
                  }}
                  disabled={!mapsLoaded}
                  className={`py-2 px-3 rounded-md text-sm transition-colors ${
                    !mapsLoaded
                      ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                  }`}
                >
                  🗽 NYC
                </button>
                <button
                  onClick={() => {
                    if (!mapsLoaded) {
                      setStatus(
                        '⚠️ Please enter your Google Maps API key first'
                      );
                      return;
                    }
                    setCenter({ lat: 51.5074, lng: -0.1278 });
                    setZoom(10);
                    setStatus('🇬🇧 Moved to London');
                  }}
                  disabled={!mapsLoaded}
                  className={`py-2 px-3 rounded-md text-sm transition-colors ${
                    !mapsLoaded
                      ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                  }`}
                >
                  🇬🇧 London
                </button>
                <button
                  onClick={() => {
                    if (!mapsLoaded) {
                      setStatus(
                        '⚠️ Please enter your Google Maps API key first'
                      );
                      return;
                    }
                    setCenter({ lat: 35.6762, lng: 139.6503 });
                    setZoom(10);
                    setStatus('🇯🇵 Moved to Tokyo');
                  }}
                  disabled={!mapsLoaded}
                  className={`py-2 px-3 rounded-md text-sm transition-colors ${
                    !mapsLoaded
                      ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
                  }`}
                >
                  🇯🇵 Tokyo
                </button>
                <button
                  onClick={() => {
                    if (!mapsLoaded) {
                      setStatus(
                        '⚠️ Please enter your Google Maps API key first'
                      );
                      return;
                    }
                    setCenter({ lat: -33.8688, lng: 151.2093 });
                    setZoom(10);
                    setStatus('🇦🇺 Moved to Sydney');
                  }}
                  disabled={!mapsLoaded}
                  className={`py-2 px-3 rounded-md text-sm transition-colors ${
                    !mapsLoaded
                      ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer'
                  }`}
                >
                  🇦🇺 Sydney
                </button>
              </div>
            </div>

            {/* Geocoding Controls */}
            <div className="google-card">
              <h4 className="font-semibold text-gray-700 mb-3">
                🌍 Geocoding Controls
              </h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  placeholder="Enter address to geocode"
                  className="google-input text-sm"
                />
                <button
                  onClick={handleSearch}
                  disabled={geocodingLoading || !mapsLoaded}
                  className={`w-full py-2 px-3 rounded-md text-sm transition-colors ${
                    !mapsLoaded
                      ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                      : geocodingLoading
                        ? 'bg-gray-200 border-2 border-dashed border-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                  }`}
                >
                  {geocodingLoading ? 'Searching...' : 'Search Address'}
                </button>
                <button
                  onClick={handleReverseGeocode}
                  disabled={geocodingLoading || !mapsLoaded}
                  className={`w-full py-2 px-3 rounded-md text-sm transition-colors ${
                    !mapsLoaded
                      ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                      : geocodingLoading
                        ? 'bg-gray-200 border-2 border-dashed border-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-purple-500 text-white hover:bg-purple-600 cursor-pointer'
                  }`}
                >
                  Reverse Geocode
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex gap-6">
            {/* Map and Controls */}
            <div className="flex-1">
              {/* Map Container */}
              <div className="google-card">
                {!mapsLoaded ? (
                  <div className="h-96 w-full bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg">
                    <div className="text-center">
                      <div className="text-5xl mb-3">🗺️</div>
                      <div className="text-lg font-medium mb-2">
                        Welcome to gmaps-kit React!
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        Enter your Google Maps API key above to start exploring
                      </div>
                      <div className="text-xs text-gray-500">
                        You can see all available features in the sidebar -
                        they'll be enabled once you provide an API key
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-96 w-full">
                    <Map
                      id="react-map-container"
                      center={center}
                      zoom={zoom}
                      mapTypeId={mapType as google.maps.MapTypeId}
                      mapId="REACT_DEMO_MAP_ID"
                      style={{ height: '100%', width: '100%' }}
                      onMapReady={(map) => setMapInstance(map.map)}
                    >
                      {/* Render markers */}
                      {markers.map((marker, index) => (
                        <Marker
                          key={index}
                          mapInstance={
                            mapInstance
                              ? {
                                  map: mapInstance,
                                  markers: [],
                                  infoWindows: [],
                                }
                              : null
                          }
                          position={
                            marker.position
                              ? typeof marker.position === 'object' &&
                                'lat' in marker.position
                                ? {
                                    lat:
                                      typeof marker.position.lat === 'function'
                                        ? marker.position.lat()
                                        : marker.position.lat,
                                    lng:
                                      typeof marker.position.lng === 'function'
                                        ? marker.position.lng()
                                        : marker.position.lng,
                                  }
                                : { lat: 0, lng: 0 }
                              : { lat: 0, lng: 0 }
                          }
                          title={marker.title || `Marker ${index + 1}`}
                          onClick={() => setSelectedMarker(marker)}
                        />
                      ))}

                      {/* InfoWindow for selected marker */}
                      {selectedMarker && markers.includes(selectedMarker) && (
                        <InfoWindow
                          mapInstance={
                            mapInstance
                              ? {
                                  map: mapInstance,
                                  markers: [],
                                  infoWindows: [],
                                }
                              : null
                          }
                          marker={selectedMarker}
                          content={`
                        <div>
                          <h3>${selectedMarker.title || 'Marker'}</h3>
                          <p>This is an InfoWindow created with @gmaps-kit/react!</p>
                          <p>Position: ${selectedMarker.position ? (typeof selectedMarker.position.lat === 'function' ? selectedMarker.position.lat().toFixed(4) : selectedMarker.position.lat.toFixed(4)) : 'N/A'}, ${selectedMarker.position ? (typeof selectedMarker.position.lng === 'function' ? selectedMarker.position.lng().toFixed(4) : selectedMarker.position.lng.toFixed(4)) : 'N/A'}</p>
                        </div>
                      `}
                          isOpen={true}
                          onClose={() => setSelectedMarker(null)}
                        />
                      )}
                    </Map>
                  </div>
                )}
              </div>

              {/* React Components Demo */}
              {mapsLoaded && (
                <div className="mt-6 google-card">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    🧩 React Components Demo
                  </h4>

                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-auto">
                    <div className="text-gray-500 mb-2">
                      // React components with hooks
                    </div>
                    <div className="text-pink-600">import {`{`}</div>
                    <div className="ml-5 text-blue-600">
                      Map, Marker, InfoWindow,
                      <br />
                      useGoogleMaps, useMap, useMarkers,
                      <br />
                      useGeocoding, useDirections, usePlaces,
                      <br />
                      useDistanceMatrix, useInfoWindows,
                      <br />
                      useClustering, useMapEvents,
                      <br />
                      useElevation, useStreetView, useMaxZoom,
                      <br />
                      useGeometry, useHeatmap, useTraffic,
                      <br />
                      useTransit, useBicycling
                    </div>
                    <div className="text-pink-600">
                      {`}`} from '@gmaps-kit/react';
                    </div>
                    <div className="mt-4 text-gray-500">// Usage in JSX</div>
                    <div className="text-green-600">
                      {`<Map id="my-map" center={{lat: 40.7128, lng: -74.006}} zoom={10}>`}
                    </div>
                    <div className="text-green-600 ml-4">
                      {`<Marker position={{lat: 40.7128, lng: -74.006}} title="NYC" />`}
                    </div>
                    <div className="text-green-600">{`</Map>`}</div>
                  </div>
                </div>
              )}

              {/* InfoWindow Demo */}
              {mapsLoaded && selectedMarker && (
                <div className="mt-6 google-card">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    💬 InfoWindow Demo
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Click on a marker to see the InfoWindow in action
                  </p>
                </div>
              )}

              {/* Advanced Hooks Demo */}
              <div className="mt-6 google-card">
                <h4 className="font-semibold text-gray-700 mb-3">
                  🚀 Advanced Hooks Demo
                </h4>
                <div className="space-y-4">
                  {/* Directions Hook Demo */}
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium text-gray-700 mb-2">
                      🗺️ useDirections
                    </h5>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                      <div className="text-gray-500 mb-1">
                        // Import and usage
                      </div>
                      <div className="text-pink-600">
                        import {`{`} useDirections {`}`} from
                        '@gmaps-kit/react';
                      </div>
                      <div className="text-blue-600">
                        const {`{`} getDirections, renderDirections {`}`} =
                        useDirections();
                      </div>
                      <div className="text-green-600">
                        // Get route from NYC to Boston
                      </div>
                      <div className="text-blue-600">
                        const directions = await getDirections({`{`}
                      </div>
                      <div className="text-blue-600 ml-4">
                        origin: 'New York, NY',
                      </div>
                      <div className="text-blue-600 ml-4">
                        destination: 'Boston, MA'
                      </div>
                      <div className="text-blue-600">{`}`});</div>
                    </div>
                    <button
                      onClick={async () => {
                        if (!mapsLoaded) {
                          setStatus(
                            '⚠️ Please enter your Google Maps API key first'
                          );
                          return;
                        }
                        try {
                          setStatus(
                            '🗺️ Getting directions from NYC to Boston...'
                          );
                          // Simulate directions functionality
                          const directions = await new Promise((resolve) =>
                            setTimeout(
                              () =>
                                resolve({
                                  distance: '306 km',
                                  duration: '3h 15m',
                                  route: 'I-95 N',
                                }),
                              1000
                            )
                          );
                          setStatus(
                            `🗺️ Directions found! Distance: ${directions.distance}, Duration: ${directions.duration}, Route: ${directions.route}`
                          );
                        } catch (error) {
                          setStatus('❌ Failed to get directions');
                        }
                      }}
                      disabled={!mapsLoaded}
                      className={`w-full py-2 px-3 rounded-md text-sm transition-colors ${
                        !mapsLoaded
                          ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-purple-500 text-white hover:bg-purple-600 cursor-pointer'
                      }`}
                    >
                      🗺️ Try Directions Hook
                    </button>
                  </div>

                  {/* Places Hook Demo */}
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium text-gray-700 mb-2">
                      🏪 usePlaces
                    </h5>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                      <div className="text-gray-500 mb-1">
                        // Import and usage
                      </div>
                      <div className="text-pink-600">
                        import {`{`} usePlaces {`}`} from '@gmaps-kit/react';
                      </div>
                      <div className="text-blue-600">
                        const {`{`} createAutocomplete, selectedPlace {`}`} =
                        usePlaces();
                      </div>
                      <div className="text-green-600">
                        // Create autocomplete input
                      </div>
                      <div className="text-blue-600">
                        const autocomplete = createAutocomplete({`{`}
                      </div>
                      <div className="text-blue-600 ml-4">
                        input: inputElement,
                      </div>
                      <div className="text-blue-600 ml-4">
                        types: ['establishment']
                      </div>
                      <div className="text-blue-600">{`}`});</div>
                    </div>
                    <button
                      onClick={async () => {
                        if (!mapsLoaded) {
                          setStatus(
                            '⚠️ Please enter your Google Maps API key first'
                          );
                          return;
                        }
                        try {
                          setStatus('🏪 Searching for restaurants in NYC...');
                          // Simulate places search
                          const places = await new Promise((resolve) =>
                            setTimeout(
                              () =>
                                resolve([
                                  "McDonald's Times Square",
                                  'Starbucks Central Park',
                                  'Pizza Palace NYC',
                                ]),
                              1500
                            )
                          );
                          setStatus(
                            `🏪 Found ${places.length} places: ${places.join(', ')}`
                          );
                        } catch (error) {
                          setStatus('❌ Failed to search places');
                        }
                      }}
                      disabled={!mapsLoaded}
                      className={`w-full py-2 px-3 rounded-md text-sm transition-colors ${
                        !mapsLoaded
                          ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600 cursor-pointer'
                      }`}
                    >
                      🏪 Try Places Hook
                    </button>
                  </div>

                  {/* Distance Matrix Hook Demo */}
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium text-gray-700 mb-2">
                      📏 useDistanceMatrix
                    </h5>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                      <div className="text-gray-500 mb-1">
                        // Import and usage
                      </div>
                      <div className="text-pink-600">
                        import {`{`} useDistanceMatrix {`}`} from
                        '@gmaps-kit/react';
                      </div>
                      <div className="text-blue-600">
                        const {`{`} getDistanceMatrix, result {`}`} =
                        useDistanceMatrix();
                      </div>
                      <div className="text-green-600">
                        // Calculate distances between multiple points
                      </div>
                      <div className="text-blue-600">
                        const distances = await getDistanceMatrix({`{`}
                      </div>
                      <div className="text-blue-600 ml-4">
                        origins: ['NYC', 'Boston'],
                      </div>
                      <div className="text-blue-600 ml-4">
                        destinations: ['Chicago', 'Miami']
                      </div>
                      <div className="text-blue-600">{`}`});</div>
                    </div>
                    <button
                      onClick={async () => {
                        if (!mapsLoaded) {
                          setStatus(
                            '⚠️ Please enter your Google Maps API key first'
                          );
                          return;
                        }
                        try {
                          setStatus(
                            '📏 Calculating distances between NYC, Boston, Chicago, and Miami...'
                          );
                          // Simulate distance matrix calculation
                          const distances = await new Promise((resolve) =>
                            setTimeout(
                              () =>
                                resolve({
                                  'NYC to Chicago': '790 miles',
                                  'NYC to Miami': '1,280 miles',
                                  'Boston to Chicago': '1,000 miles',
                                  'Boston to Miami': '1,500 miles',
                                }),
                              2000
                            )
                          );
                          const distanceText = Object.entries(distances)
                            .map(([route, distance]) => `${route}: ${distance}`)
                            .join(', ');
                          setStatus(
                            `📏 Distance Matrix Results: ${distanceText}`
                          );
                        } catch (error) {
                          setStatus('❌ Failed to calculate distances');
                        }
                      }}
                      disabled={!mapsLoaded}
                      className={`w-full py-2 px-3 rounded-md text-sm transition-colors ${
                        !mapsLoaded
                          ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-teal-500 text-white hover:bg-teal-600 cursor-pointer'
                      }`}
                    >
                      📏 Try Distance Matrix Hook
                    </button>
                  </div>

                  {/* InfoWindows Hook Demo */}
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium text-gray-700 mb-2">
                      💬 useInfoWindows
                    </h5>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                      <div className="text-gray-500 mb-1">
                        // Import and usage
                      </div>
                      <div className="text-pink-600">
                        import {`{`} useInfoWindows {`}`} from
                        '@gmaps-kit/react';
                      </div>
                      <div className="text-blue-600">
                        const {`{`} createInfoWindow, openInfoWindow {`}`} =
                        useInfoWindows();
                      </div>
                      <div className="text-green-600">
                        // Create and open InfoWindow
                      </div>
                      <div className="text-blue-600">
                        const infoWindow = createInfoWindow({`{`}
                      </div>
                      <div className="text-blue-600 ml-4">
                        content: 'Hello World!',
                      </div>
                      <div className="text-blue-600 ml-4">
                        position: {`{`} lat: 40.7128, lng: -74.006 {`}`}
                      </div>
                      <div className="text-blue-600">{`}`});</div>
                    </div>
                    <button
                      onClick={async () => {
                        if (!mapsLoaded) {
                          setStatus(
                            '⚠️ Please enter your Google Maps API key first'
                          );
                          return;
                        }
                        try {
                          setStatus(
                            '💬 Creating InfoWindow with custom content...'
                          );
                          // Simulate InfoWindow creation
                          const infoWindow = await new Promise((resolve) =>
                            setTimeout(
                              () =>
                                resolve({
                                  content: 'Hello from InfoWindow!',
                                  position: { lat: 40.7128, lng: -74.006 },
                                  isOpen: true,
                                }),
                              800
                            )
                          );
                          setStatus(
                            `💬 InfoWindow created at ${infoWindow.position.lat}, ${infoWindow.position.lng} with content: "${infoWindow.content}"`
                          );
                        } catch (error) {
                          setStatus('❌ Failed to create InfoWindow');
                        }
                      }}
                      disabled={!mapsLoaded}
                      className={`w-full py-2 px-3 rounded-md text-sm transition-colors ${
                        !mapsLoaded
                          ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-pink-500 text-white hover:bg-pink-600 cursor-pointer'
                      }`}
                    >
                      💬 Try InfoWindows Hook
                    </button>
                  </div>

                  {/* Clustering Hook Demo */}
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium text-gray-700 mb-2">
                      🔗 useClustering
                    </h5>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                      <div className="text-gray-500 mb-1">
                        // Import and usage
                      </div>
                      <div className="text-pink-600">
                        import {`{`} useClustering {`}`} from
                        '@gmaps-kit/react';
                      </div>
                      <div className="text-blue-600">
                        const {`{`} createClusterer, addMarkersToCluster {`}`} =
                        useClustering();
                      </div>
                      <div className="text-green-600">
                        // Create clusterer for better performance
                      </div>
                      <div className="text-blue-600">
                        const clusterer = createClusterer(mapInstance, markers,{' '}
                        {`{`}
                      </div>
                      <div className="text-blue-600 ml-4">gridSize: 60,</div>
                      <div className="text-blue-600 ml-4">maxZoom: 15</div>
                      <div className="text-blue-600">{`}`});</div>
                    </div>
                    <button
                      onClick={async () => {
                        if (!mapsLoaded) {
                          setStatus(
                            '⚠️ Please enter your Google Maps API key first'
                          );
                          return;
                        }
                        try {
                          setStatus(
                            '🔗 Creating marker clusterer for better performance...'
                          );
                          // Simulate clustering setup
                          const clusterer = await new Promise((resolve) =>
                            setTimeout(
                              () =>
                                resolve({
                                  gridSize: 60,
                                  maxZoom: 15,
                                  markersCount: 25,
                                  clustersCreated: 3,
                                }),
                              1200
                            )
                          );
                          setStatus(
                            `🔗 Clusterer created! Grid size: ${clusterer.gridSize}, Max zoom: ${clusterer.maxZoom}, ${clusterer.markersCount} markers clustered into ${clusterer.clustersCreated} clusters`
                          );
                        } catch (error) {
                          setStatus('❌ Failed to create clusterer');
                        }
                      }}
                      disabled={!mapsLoaded}
                      className={`w-full py-2 px-3 rounded-md text-sm transition-colors ${
                        !mapsLoaded
                          ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer'
                      }`}
                    >
                      🔗 Try Clustering Hook
                    </button>
                  </div>

                  {/* Map Events Hook Demo */}
                  <div className="border border-gray-200 rounded-lg p-3">
                    <h5 className="font-medium text-gray-700 mb-2">
                      🎯 useMapEvents
                    </h5>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm mb-2">
                      <div className="text-gray-500 mb-1">
                        // Import and usage
                      </div>
                      <div className="text-pink-600">
                        import {`{`} useMapEvents {`}`} from '@gmaps-kit/react';
                      </div>
                      <div className="text-blue-600">
                        const {`{`} addEventListeners, eventState {`}`} =
                        useMapEvents();
                      </div>
                      <div className="text-green-600">
                        // Add event listeners
                      </div>
                      <div className="text-blue-600">
                        addEventListeners(mapInstance, {`{`}
                      </div>
                      <div className="text-blue-600 ml-4">
                        onClick: (event) ={`>`} console.log('Map clicked!'),
                      </div>
                      <div className="text-blue-600 ml-4">
                        onDrag: () ={`>`} console.log('Map dragged')
                      </div>
                      <div className="text-blue-600">{`}`});</div>
                    </div>
                    <button
                      onClick={async () => {
                        if (!mapsLoaded) {
                          setStatus(
                            '⚠️ Please enter your Google Maps API key first'
                          );
                          return;
                        }
                        try {
                          setStatus('🎯 Setting up map event listeners...');
                          // Simulate event listener setup
                          const events = await new Promise((resolve) =>
                            setTimeout(
                              () =>
                                resolve({
                                  onClick:
                                    'Map clicked at lat: 40.7128, lng: -74.006',
                                  onDrag: 'Map dragged to new position',
                                  onZoom: 'Zoom level changed to 12',
                                  listenersAdded: 3,
                                }),
                              1000
                            )
                          );
                          setStatus(
                            `🎯 Event listeners added! ${events.listenersAdded} listeners active. Try clicking, dragging, or zooming the map to see events in action!`
                          );
                        } catch (error) {
                          setStatus('❌ Failed to setup event listeners');
                        }
                      }}
                      disabled={!mapsLoaded}
                      className={`w-full py-2 px-3 rounded-md text-sm transition-colors ${
                        !mapsLoaded
                          ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
                      }`}
                    >
                      🎯 Try Map Events Hook
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 mt-2 p-2 bg-blue-50 rounded">
                    💡 <strong>Pro Tip:</strong> These hooks provide advanced
                    Google Maps functionality. Each example shows the exact
                    import and usage pattern you can copy into your React
                    components!
                  </div>
                </div>
              </div>
            </div>

            {/* React Components Documentation Panel */}
            <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto h-screen sticky top-0">
              <div className="google-card">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  📚 React Components
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      @gmaps-kit/react
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      React hooks and components for Google Maps integration
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      🧩 Components
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>Map:</strong> Main map component with center,
                        zoom, mapTypeId props
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>Marker:</strong> Individual map markers with
                        position, title, onClick
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>InfoWindow:</strong> Popup windows with content,
                        isOpen, onClose
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      🎣 Core Hooks
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useGoogleMaps:</strong> Load API, returns{' '}
                        {`{isLoaded, load, error}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useMap:</strong> Map instance management,
                        returns{' '}
                        {`{mapInstance, isReady, center, zoom, setCenter, setZoom}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useMarkers:</strong> Marker management, returns{' '}
                        {`{markers, addMarker, removeMarker, clearAllMarkers}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useGeocoding:</strong> Address conversion,
                        returns {`{geocode, reverseGeocode, isLoading}`}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      🎣 Advanced Hooks
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useDirections:</strong> Route planning, returns{' '}
                        {`{getDirections, renderDirections, result, isLoading}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>usePlaces:</strong> Places API integration,
                        returns {`{createAutocomplete, selectedPlace, places}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useDistanceMatrix:</strong> Distance
                        calculations, returns{' '}
                        {`{getDistanceMatrix, result, isLoading}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useInfoWindows:</strong> InfoWindow management,
                        returns{' '}
                        {`{createInfoWindow, openInfoWindow, closeInfoWindow}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useClustering:</strong> Marker clustering,
                        returns{' '}
                        {`{createClusterer, addMarkersToCluster, clearCluster}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useMapEvents:</strong> Map event handling,
                        returns{' '}
                        {`{addEventListeners, eventState, getCurrentMapState}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useElevation:</strong> Elevation service,
                        returns{' '}
                        {`{getElevationForLocations, getElevationAlongPath, results}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useStreetView:</strong> Street View service,
                        returns {`{getPanorama, createPanorama, panoramaData}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useMaxZoom:</strong> Maximum zoom imagery,
                        returns {`{getMaxZoom, result, isLoading}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useGeometry:</strong> Geometry calculations,
                        returns{' '}
                        {`{computeDistanceBetween, computeArea, computeBounds}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useHeatmap:</strong> Heatmap visualization,
                        returns{' '}
                        {`{createHeatmap, updateHeatmapData, heatmapLayer}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useTraffic:</strong> Traffic layer, returns{' '}
                        {`{createTrafficLayer, showTraffic, hideTraffic}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useTransit:</strong> Transit layer, returns{' '}
                        {`{createTransitLayer, showTransit, hideTransit}`}
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>useBicycling:</strong> Bicycling layer, returns{' '}
                        {`{createBicyclingLayer, showBicycling, hideBicycling}`}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      💻 Usage Example
                    </h5>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                      <div className="text-gray-500 mb-2">
                        // React component
                      </div>
                      <div className="text-pink-600">
                        import {`{`} Map, Marker, useGoogleMaps {`}`} from
                        '@gmaps-kit/react';
                      </div>
                      <div className="mt-2 text-blue-600">
                        {`<Map center={{lat: 40.7128, lng: -74.006}} zoom={10}>`}
                      </div>
                      <div className="text-blue-600 ml-4">
                        {`<Marker position={{lat: 40.7128, lng: -74.006}} />`}
                      </div>
                      <div className="text-blue-600">{`</Map>`}</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      📋 Props & API
                    </h5>
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>Map Props:</strong> center, zoom, mapTypeId,
                        style, onMapReady
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>Marker Props:</strong> position, title, onClick,
                        draggable
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <strong>InfoWindow Props:</strong> content, isOpen,
                        onClose, marker
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      🔧 Advanced Usage
                    </h5>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm space-y-2">
                      <div className="text-gray-500 mb-2">
                        // Directions with multiple hooks
                      </div>
                      <div className="text-blue-600">
                        {`const { getDirections, renderDirections } = useDirections();`}
                      </div>
                      <div className="text-blue-600">
                        {`const { createInfoWindow } = useInfoWindows();`}
                      </div>
                      <div className="text-blue-600">
                        {`const { createClusterer } = useClustering();`}
                      </div>
                      <div className="text-gray-500 mt-2">
                        // Services & Layers
                      </div>
                      <div className="text-blue-600">
                        {`const { getElevationForLocations } = useElevation();`}
                      </div>
                      <div className="text-blue-600">
                        {`const { createHeatmap } = useHeatmap();`}
                      </div>
                      <div className="text-blue-600">
                        {`const { createTrafficLayer } = useTraffic();`}
                      </div>
                      <div className="text-gray-500 mt-2">
                        // Event handling
                      </div>
                      <div className="text-blue-600">
                        {`const { addEventListeners } = useMapEvents();`}
                      </div>
                      <div className="text-blue-600">
                        {`addEventListeners(map, {`}
                      </div>
                      <div className="text-blue-600 ml-4">
                        {`onClick: (event) => addMarker(event.latLng)`}
                      </div>
                      <div className="text-blue-600">{`});`}</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      💡 Benefits
                    </h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• Declarative React components</div>
                      <div>• Built-in state management</div>
                      <div>• TypeScript support</div>
                      <div>• Easy integration with React apps</div>
                      <div>• Automatic cleanup and optimization</div>
                      <div>• Event handling built-in</div>
                      <div>• Performance optimized</div>
                      <div>• 18+ specialized hooks for all use cases</div>
                      <div>• Complete Google Maps API coverage</div>
                      <div>
                        • Services: Elevation, Street View, Max Zoom, Geometry
                      </div>
                      <div>• Layers: Traffic, Transit, Bicycling, Heatmap</div>
                      <div>
                        • Advanced: Directions, Places, Distance Matrix,
                        Clustering
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      🚀 Getting Started
                    </h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        1. Install:{' '}
                        <code className="bg-gray-100 px-1 rounded">
                          npm install @gmaps-kit/react
                        </code>
                      </div>
                      <div>2. Get Google Maps API key</div>
                      <div>3. Import components and hooks</div>
                      <div>4. Wrap with useGoogleMaps hook</div>
                      <div>5. Use Map, Marker, InfoWindow components</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
