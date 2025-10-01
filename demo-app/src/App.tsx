import React, { useState } from 'react';
import {
  // Script loader
  loadGoogleMaps,
  isGoogleMapsLoaded,
  waitForGoogleMaps,
  // Map utilities
  createMap,
  getMapCenter,
  setMapCenter,
  getMapZoom,
  setMapZoom,
  fitMapToMarkers,
  panTo,
  // Marker utilities
  addMarker,
  removeMarker,
  updateMarkerPosition,
  updateMarkerIcon,
  createInfoWindow,
  openInfoWindow,
  closeInfoWindow,
  addMarkerWithInfoWindow,
  clearMarkers,
  clearInfoWindows,
  getMarkerPosition,
  setMarkerVisibility,
  setMarkerDraggable,
  addMarkerClickListener,
  addMarkerDragListener,
  addMarkerDragEndListener,
  // Autocomplete utilities
  createAutocomplete,
  bindAutocompleteToMap,
  getSelectedPlace,
  addPlaceChangedListener,
  setAutocompleteBounds,
  setAutocompleteComponentRestrictions,
  setAutocompleteTypes,
  getAutocompleteBounds,
  getAutocompleteComponentRestrictions,
  getAutocompleteTypes,
  clearAutocomplete,
  focusAutocomplete,
  createSearchBox,
  addPlacesChangedListener,
  // Geocoding utilities
  geocode,
  reverseGeocode,
  geocodeAsync,
  reverseGeocodeAsync,
  geocodeWithComponents,
  geocodeWithBounds,
  geocodeWithRegion,
  geocodeFirst,
  reverseGeocodeFirst,
  // Directions utilities
  getDirections,
  getDirectionsAsync,
  renderDirections,
  clearDirections,
  getDistanceMatrix,
  getDistanceMatrixAsync,
  createDirectionsService,
  createDirectionsRenderer,
  createDistanceMatrixService,
  getTotalDistance,
  getTotalDuration,
  getDirectionsBounds,
  fitMapToRoute,
} from '@gmaps-kit/core';

function App() {
  const [apiKey, setApiKey] = useState('YOUR_API_KEY');
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindows, setInfoWindows] = useState<any[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<string>('');
  const [status, setStatus] = useState(
    'Enter your Google Maps API key to get started'
  );
  const [activeDemo, setActiveDemo] = useState('');

  // User input fields for dynamic examples
  const [userAddress, setUserAddress] = useState('Times Square, New York');
  const [userCoordinates, setUserCoordinates] = useState('40.7580, -73.9855');
  const [originAddress, setOriginAddress] = useState('New York, NY');
  const [destinationAddress, setDestinationAddress] =
    useState('Los Angeles, CA');
  const [searchPlace, setSearchPlace] = useState('restaurant');
  const [markerTitle, setMarkerTitle] = useState('My Custom Marker');
  const [infoWindowContent, setInfoWindowContent] = useState(
    'Hello from gmaps-kit!'
  );
  const [autocompleteInput, setAutocompleteInput] = useState('');
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(0);

  const handleLoadMaps = async () => {
    if (!apiKey || apiKey === 'YOUR_API_KEY') {
      setStatus('⚠️ Please enter a valid Google Maps API key');
      return;
    }

    try {
      setStatus('Loading Google Maps API...');
      await loadGoogleMaps({ apiKey, libraries: ['places', 'geometry'] });

      setStatus('✅ Google Maps API loaded!');
      setIsLoaded(true);

      const map = createMap('map-container', {
        center: { lat: 40.7128, lng: -74.006 },
        zoom: 10,
      });

      setMapInstance(map);
      setStatus('✅ Map created! Ready to explore gmaps-kit/core features');
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  };

  const demoFunctions = [
    {
      category: '📦 Script Loader',
      functions: [
        {
          name: 'isGoogleMapsLoaded',
          description: 'Check if Google Maps API is loaded',
          action: () => {
            const loaded = isGoogleMapsLoaded();
            setStatus(`📦 Google Maps loaded: ${loaded ? '✅ Yes' : '❌ No'}`);
          },
        },
        {
          name: 'waitForGoogleMaps',
          description: 'Wait for Google Maps to load',
          action: async () => {
            try {
              setStatus('⏳ Waiting for Google Maps...');
              await waitForGoogleMaps();
              setStatus('✅ Google Maps is ready!');
            } catch (error) {
              setStatus(`❌ Error: ${error.message}`);
            }
          },
        },
      ],
    },
    {
      category: '🗺️ Map Controls',
      functions: [
        {
          name: 'getMapCenter',
          description: 'Get current map center',
          action: () => {
            if (!mapInstance) return;
            const center = getMapCenter(mapInstance.map);
            setStatus(
              `📍 Map center: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`
            );
          },
        },
        {
          name: 'setMapCenter',
          description: 'Set map center to user coordinates',
          action: () => {
            if (!mapInstance) return;
            const [lat, lng] = userCoordinates.split(',').map(Number);
            setMapCenter(mapInstance.map, { lat, lng });
            setStatus(`🎯 Map centered on ${userCoordinates}`);
          },
        },
        {
          name: 'getMapZoom',
          description: 'Get current zoom level',
          action: () => {
            if (!mapInstance) return;
            const zoom = getMapZoom(mapInstance.map);
            setStatus(`🔍 Current zoom: ${zoom}`);
          },
        },
        {
          name: 'setMapZoom',
          description: 'Set zoom to 15',
          action: () => {
            if (!mapInstance) return;
            setMapZoom(mapInstance.map, 15);
            setStatus('🔍 Zoom set to 15');
          },
        },
        {
          name: 'panTo',
          description: 'Pan to user coordinates',
          action: () => {
            if (!mapInstance) return;
            const [lat, lng] = userCoordinates.split(',').map(Number);
            panTo(mapInstance.map, { lat, lng }, 14);
            setStatus(`🌳 Panned to ${userCoordinates}`);
          },
        },
        {
          name: 'fitMapToMarkers',
          description: 'Fit map to show all markers',
          action: () => {
            if (!mapInstance) return;
            fitMapToMarkers(mapInstance.map, markers);
            setStatus('📐 Map fitted to show all markers');
          },
        },
      ],
    },
    {
      category: '📍 Markers & InfoWindows',
      functions: [
        {
          name: 'addMarker',
          description: 'Add marker with custom title',
          action: async () => {
            if (!mapInstance) return;
            const center = getMapCenter(mapInstance.map);
            const marker = addMarker(mapInstance.map, {
              position: center,
              title: markerTitle,
              label: `${markers.length + 1}`,
            });
            setMarkers([...markers, marker]);
            setStatus(`📍 Added marker: ${markerTitle}`);
          },
        },
        {
          name: 'removeMarker',
          description: 'Remove selected marker',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers to remove');
              return;
            }
            const markerToRemove = markers[selectedMarkerIndex] || markers[0];
            removeMarker(markerToRemove);
            setMarkers(markers.filter((m) => m !== markerToRemove));
            setStatus(`🗑️ Removed marker ${selectedMarkerIndex + 1}`);
          },
        },
        {
          name: 'updateMarkerPosition',
          description: 'Update marker position',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers to update');
              return;
            }
            const [lat, lng] = userCoordinates.split(',').map(Number);
            const marker = markers[selectedMarkerIndex] || markers[0];
            updateMarkerPosition(marker, { lat, lng });
            setStatus(`📍 Updated marker position to ${userCoordinates}`);
          },
        },
        {
          name: 'updateMarkerIcon',
          description: 'Update marker icon',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers to update');
              return;
            }
            const marker = markers[selectedMarkerIndex] || markers[0];
            updateMarkerIcon(marker, {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(32, 32),
            });
            setStatus('🎨 Updated marker icon');
          },
        },
        {
          name: 'createInfoWindow',
          description: 'Create InfoWindow with custom content',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ Add a marker first');
              return;
            }
            const infoWindow = createInfoWindow({
              content: `<h3>${infoWindowContent}</h3><p>Created with gmaps-kit/core</p>`,
            });
            openInfoWindow(infoWindow, markers[0], mapInstance.map);
            setInfoWindows([...infoWindows, infoWindow]);
            setStatus('💬 InfoWindow created and opened');
          },
        },
        {
          name: 'openInfoWindow',
          description: 'Open InfoWindow on marker',
          action: () => {
            if (
              !mapInstance ||
              markers.length === 0 ||
              infoWindows.length === 0
            ) {
              setStatus('⚠️ Add markers and InfoWindows first');
              return;
            }
            const marker = markers[selectedMarkerIndex] || markers[0];
            const infoWindow = infoWindows[0];
            openInfoWindow(infoWindow, marker, mapInstance.map);
            setStatus('💬 InfoWindow opened');
          },
        },
        {
          name: 'closeInfoWindow',
          description: 'Close InfoWindow',
          action: () => {
            if (!mapInstance || infoWindows.length === 0) {
              setStatus('⚠️ No InfoWindows to close');
              return;
            }
            const infoWindow = infoWindows[0];
            closeInfoWindow(infoWindow);
            setStatus('💬 InfoWindow closed');
          },
        },
        {
          name: 'addMarkerWithInfoWindow',
          description: 'Add marker with InfoWindow',
          action: () => {
            if (!mapInstance) return;
            const center = getMapCenter(mapInstance.map);
            const result = addMarkerWithInfoWindow(
              mapInstance.map,
              {
                position: center,
                title: markerTitle,
              },
              {
                content: infoWindowContent,
              }
            );
            setMarkers([...markers, result.marker]);
            setInfoWindows([...infoWindows, result.infoWindow]);
            setStatus('📍 Added marker with InfoWindow');
          },
        },
        {
          name: 'getMarkerPosition',
          description: 'Get marker position',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers available');
              return;
            }
            const marker = markers[selectedMarkerIndex] || markers[0];
            const position = getMarkerPosition(marker);
            if (position) {
              setStatus(
                `📍 Marker position: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
              );
            } else {
              setStatus('❌ Could not get marker position');
            }
          },
        },
        {
          name: 'setMarkerVisibility',
          description: 'Toggle marker visibility',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers available');
              return;
            }
            const marker = markers[selectedMarkerIndex] || markers[0];
            const isVisible = marker.getVisible();
            setMarkerVisibility(marker, !isVisible);
            setStatus(
              `👁️ Marker visibility: ${!isVisible ? 'Shown' : 'Hidden'}`
            );
          },
        },
        {
          name: 'setMarkerDraggable',
          description: 'Toggle marker draggable',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers available');
              return;
            }
            const marker = markers[selectedMarkerIndex] || markers[0];
            const isDraggable = marker.getDraggable();
            setMarkerDraggable(marker, !isDraggable);
            setStatus(
              `🖱️ Marker draggable: ${!isDraggable ? 'Enabled' : 'Disabled'}`
            );
          },
        },
        {
          name: 'addMarkerClickListener',
          description: 'Add click listener to marker',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers available');
              return;
            }
            const marker = markers[selectedMarkerIndex] || markers[0];
            addMarkerClickListener(marker, () => {
              setStatus('🖱️ Marker clicked!');
            });
            setStatus('🖱️ Click listener added to marker');
          },
        },
        {
          name: 'clearMarkers',
          description: 'Clear all markers',
          action: () => {
            if (!mapInstance) return;
            clearMarkers(mapInstance);
            setMarkers([]);
            setStatus('🧹 All markers cleared');
          },
        },
        {
          name: 'clearInfoWindows',
          description: 'Clear all InfoWindows',
          action: () => {
            if (!mapInstance) return;
            clearInfoWindows(mapInstance);
            setInfoWindows([]);
            setStatus('🧹 All InfoWindows cleared');
          },
        },
      ],
    },
    {
      category: '🌍 Geocoding',
      functions: [
        {
          name: 'geocodeAsync',
          description: 'Geocode user address',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus(`🔍 Geocoding: ${userAddress}...`);
              const results = await geocodeAsync(userAddress);
              const result = results[0];

              const marker = addMarker(mapInstance.map, {
                position: result.location,
                title: result.address,
              });
              setMarkers([...markers, marker]);

              setMapCenter(mapInstance.map, result.location);
              setMapZoom(mapInstance.map, 16);

              setStatus(`✅ Found: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Geocoding failed: ${error.message}`);
            }
          },
        },
        {
          name: 'reverseGeocodeAsync',
          description: 'Reverse geocode current center',
          action: async () => {
            if (!mapInstance) return;
            try {
              const center = getMapCenter(mapInstance.map);
              setStatus('🔍 Reverse geocoding current location...');
              const results = await reverseGeocodeAsync(center);
              const result = results[0];
              setStatus(`✅ Current location: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Reverse geocoding failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeFirst',
          description: 'Get first geocode result',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus(`🔍 Getting first result for: ${userAddress}...`);
              const result = await geocodeFirst(userAddress);
              setStatus(`✅ First result: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Geocoding failed: ${error.message}`);
            }
          },
        },
        {
          name: 'reverseGeocodeFirst',
          description: 'Get first reverse geocode result',
          action: async () => {
            if (!mapInstance) return;
            try {
              const center = getMapCenter(mapInstance.map);
              setStatus('🔍 Getting first reverse geocode result...');
              const result = await reverseGeocodeFirst(center);
              setStatus(`✅ First result: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Reverse geocoding failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeWithComponents',
          description: 'Geocode with country restriction',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus(`🔍 Geocoding with country restriction...`);
              const results = await geocodeWithComponents(
                userAddress,
                {
                  country: 'US',
                },
                () => {}
              );
              const result = results[0];
              setStatus(`✅ Found in US: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Geocoding failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeWithBounds',
          description: 'Geocode within bounds',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus(`🔍 Geocoding within bounds...`);
              const bounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(40.7, -74.1),
                new google.maps.LatLng(40.8, -73.9)
              );
              const results = await geocodeWithBounds(
                userAddress,
                bounds,
                () => {}
              );
              const result = results[0];
              setStatus(`✅ Found in bounds: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Geocoding failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeWithRegion',
          description: 'Geocode with region bias',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus(`🔍 Geocoding with region bias...`);
              const results = await geocodeWithRegion(
                userAddress,
                'US',
                () => {}
              );
              const result = results[0];
              setStatus(`✅ Found with region bias: ${result.address}`);
            } catch (error) {
              setStatus(`❌ Geocoding failed: ${error.message}`);
            }
          },
        },
      ],
    },
    {
      category: '🛣️ Directions & Routes',
      functions: [
        {
          name: 'getDirectionsAsync',
          description: 'Get directions between addresses',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus(
                `🛣️ Getting directions from ${originAddress} to ${destinationAddress}...`
              );
              const directions = await getDirectionsAsync({
                origin: originAddress,
                destination: destinationAddress,
                travelMode: google.maps.TravelMode.DRIVING,
              });

              const renderer = new google.maps.DirectionsRenderer();
              renderer.setMap(mapInstance.map);
              renderer.setDirections(directions);

              const distance = getTotalDistance(directions);
              const duration = getTotalDuration(directions);

              setStatus(
                `✅ Route: ${(distance / 1000).toFixed(0)}km, ${(duration / 3600).toFixed(1)}h`
              );
            } catch (error) {
              setStatus(`❌ Directions failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getDistanceMatrixAsync',
          description: 'Calculate distances between points',
          action: async () => {
            if (!mapInstance) return;
            try {
              setStatus('📏 Calculating distance matrix...');
              const results = await getDistanceMatrixAsync({
                origins: [originAddress],
                destinations: [destinationAddress, 'Chicago, IL', 'Miami, FL'],
                travelMode: google.maps.TravelMode.DRIVING,
              });

              let message = '📏 Distances: ';
              results.forEach((result, index) => {
                const destinations = [destinationAddress, 'Chicago', 'Miami'];
                message += `${destinations[index]}: ${result.distance.text} `;
              });

              setStatus(message);
            } catch (error) {
              setStatus(`❌ Distance matrix failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getTotalDistance',
          description: 'Get total distance of route',
          action: async () => {
            if (!mapInstance) return;
            try {
              const directions = await getDirectionsAsync({
                origin: originAddress,
                destination: destinationAddress,
                travelMode: google.maps.TravelMode.DRIVING,
              });
              const distance = getTotalDistance(directions);
              setStatus(
                `📏 Total distance: ${(distance / 1000).toFixed(1)} km`
              );
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getTotalDuration',
          description: 'Get total duration of route',
          action: async () => {
            if (!mapInstance) return;
            try {
              const directions = await getDirectionsAsync({
                origin: originAddress,
                destination: destinationAddress,
                travelMode: google.maps.TravelMode.DRIVING,
              });
              const duration = getTotalDuration(directions);
              setStatus(
                `⏱️ Total duration: ${(duration / 3600).toFixed(1)} hours`
              );
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'fitMapToRoute',
          description: 'Fit map to show route',
          action: async () => {
            if (!mapInstance) return;
            try {
              const directions = await getDirectionsAsync({
                origin: originAddress,
                destination: destinationAddress,
                travelMode: google.maps.TravelMode.DRIVING,
              });
              fitMapToRoute(mapInstance.map, directions);
              setStatus('📐 Map fitted to route');
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'clearDirections',
          description: 'Clear directions from map',
          action: () => {
            if (!mapInstance) return;
            try {
              const directionsRenderer = new google.maps.DirectionsRenderer();
              directionsRenderer.setMap(mapInstance.map);
              clearDirections(directionsRenderer);
              setStatus('🧹 Directions cleared from map');
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'createDirectionsService',
          description: 'Create directions service',
          action: () => {
            if (!mapInstance) return;
            const service = createDirectionsService(mapInstance);
            setStatus('🚗 Directions service created');
          },
        },
        {
          name: 'createDirectionsRenderer',
          description: 'Create directions renderer',
          action: () => {
            if (!mapInstance) return;
            const renderer = createDirectionsRenderer(mapInstance);
            renderer.setMap(mapInstance.map);
            setStatus('🎨 Directions renderer created and attached');
          },
        },
        {
          name: 'createDistanceMatrixService',
          description: 'Create distance matrix service',
          action: () => {
            if (!mapInstance) return;
            const service = createDistanceMatrixService(mapInstance);
            setStatus('📏 Distance matrix service created');
          },
        },
      ],
    },
    {
      category: '🔍 Places & Autocomplete',
      functions: [
        {
          name: 'createAutocomplete',
          description: 'Create autocomplete input',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }

            const autocomplete = createAutocomplete({
              input,
              types: ['establishment'],
            });

            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();
              if (place.geometry) {
                const marker = addMarker(mapInstance.map, {
                  position: {
                    lat: place.geometry.location!.lat(),
                    lng: place.geometry.location!.lng(),
                  },
                  title: place.name || 'Selected Place',
                });
                setMarkers([...markers, marker]);
                setMapCenter(mapInstance.map, {
                  lat: place.geometry.location!.lat(),
                  lng: place.geometry.location!.lng(),
                });
                setStatus(`✅ Selected: ${place.name || 'Place'}`);
              }
            });

            setStatus('🔍 Autocomplete created! Try typing a place name');
          },
        },
        {
          name: 'getSelectedPlace',
          description: 'Get selected place from autocomplete',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const place = getSelectedPlace(autocomplete);
            setStatus(`📍 Selected place: ${place?.name || 'None'}`);
          },
        },
        {
          name: 'setAutocompleteTypes',
          description: 'Set autocomplete types',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            setAutocompleteTypes(autocomplete, ['restaurant', 'lodging']);
            setStatus('🍽️ Autocomplete types set to restaurants and hotels');
          },
        },
        {
          name: 'getAutocompleteTypes',
          description: 'Get autocomplete types',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const types = getAutocompleteTypes(autocomplete);
            setStatus(`📋 Autocomplete types: ${types.join(', ')}`);
          },
        },
        {
          name: 'setAutocompleteBounds',
          description: 'Set autocomplete bounds',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const bounds = new google.maps.LatLngBounds(
              new google.maps.LatLng(40.7, -74.1),
              new google.maps.LatLng(40.8, -73.9)
            );
            setAutocompleteBounds(autocomplete, bounds);
            setStatus('📐 Autocomplete bounds set to NYC area');
          },
        },
        {
          name: 'getAutocompleteBounds',
          description: 'Get autocomplete bounds',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const bounds = getAutocompleteBounds(autocomplete);
            setStatus(`📐 Autocomplete bounds: ${bounds ? 'Set' : 'Not set'}`);
          },
        },
        {
          name: 'setAutocompleteComponentRestrictions',
          description: 'Set autocomplete country restrictions',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            setAutocompleteComponentRestrictions(autocomplete, {
              country: 'us',
            });
            setStatus('🇺🇸 Autocomplete restricted to US');
          },
        },
        {
          name: 'getAutocompleteComponentRestrictions',
          description: 'Get autocomplete restrictions',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const restrictions =
              getAutocompleteComponentRestrictions(autocomplete);
            setStatus(
              `📋 Restrictions: ${restrictions ? JSON.stringify(restrictions) : 'None'}`
            );
          },
        },
        {
          name: 'clearAutocomplete',
          description: 'Clear autocomplete input',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            clearAutocomplete(autocomplete);
            setStatus('🧹 Autocomplete cleared');
          },
        },
        {
          name: 'focusAutocomplete',
          description: 'Focus autocomplete input',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            focusAutocomplete(autocomplete);
            setStatus('🎯 Autocomplete focused');
          },
        },
        {
          name: 'addPlaceChangedListener',
          description: 'Add place changed listener to autocomplete',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            addPlaceChangedListener(autocomplete, (place) => {
              if (place.geometry) {
                setStatus(`📍 Place selected: ${place.name || 'Unknown'}`);
                // Add marker at selected place
                const marker = addMarker(mapInstance.map, {
                  position: {
                    lat: place.geometry.location!.lat(),
                    lng: place.geometry.location!.lng(),
                  },
                  title: place.name || 'Selected Place',
                });
                setMarkers([...markers, marker]);
              }
            });
            setStatus('👂 Place changed listener added to autocomplete');
          },
        },
        {
          name: 'createSearchBox',
          description: 'Create search box',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'search-box-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Search box input not found');
              return;
            }
            const searchBox = createSearchBox(input, mapInstance.map);
            bindAutocompleteToMap(mapInstance, { input: input });
            setStatus('🔍 Search box created and bound to map');
          },
        },
        {
          name: 'addPlacesChangedListener',
          description: 'Add places changed listener',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'search-box-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Search box input not found');
              return;
            }
            const searchBox = createSearchBox(input, mapInstance.map);
            addPlacesChangedListener(searchBox, (places) => {
              setStatus(`🔍 Places changed: ${places.length} places found`);
            });
            setStatus('👂 Places changed listener added');
          },
        },
        {
          name: 'setAutocompleteBounds',
          description: 'Set autocomplete bounds',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const bounds = mapInstance.map.getBounds();
            setAutocompleteBounds(autocomplete, bounds);
            setStatus('🗺️ Autocomplete bounds set to map bounds');
          },
        },
        {
          name: 'setAutocompleteComponentRestrictions',
          description: 'Set component restrictions',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            setAutocompleteComponentRestrictions(autocomplete, {
              country: 'us',
            });
            setStatus('🇺🇸 Component restrictions set to US only');
          },
        },
        {
          name: 'setAutocompleteTypes',
          description: 'Set autocomplete types',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            setAutocompleteTypes(autocomplete, ['establishment']);
            setStatus('🏢 Autocomplete types set to establishments');
          },
        },
        {
          name: 'getAutocompleteBounds',
          description: 'Get autocomplete bounds',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const bounds = getAutocompleteBounds(autocomplete);
            setStatus(`📐 Autocomplete bounds: ${bounds ? 'Set' : 'Not set'}`);
          },
        },
        {
          name: 'getAutocompleteComponentRestrictions',
          description: 'Get component restrictions',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const restrictions =
              getAutocompleteComponentRestrictions(autocomplete);
            setStatus(
              `🌍 Component restrictions: ${restrictions ? 'Set' : 'None'}`
            );
          },
        },
        {
          name: 'getAutocompleteTypes',
          description: 'Get autocomplete types',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            const types = getAutocompleteTypes(autocomplete);
            setStatus(`🏷️ Autocomplete types: ${types.join(', ') || 'None'}`);
          },
        },
        {
          name: 'clearAutocomplete',
          description: 'Clear autocomplete',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            clearAutocomplete(autocomplete);
            setStatus('🧹 Autocomplete cleared');
          },
        },
        {
          name: 'focusAutocomplete',
          description: 'Focus autocomplete input',
          action: () => {
            if (!mapInstance) return;
            const input = document.getElementById(
              'autocomplete-input'
            ) as HTMLInputElement;
            if (!input) {
              setStatus('⚠️ Autocomplete input not found');
              return;
            }
            const autocomplete = createAutocomplete({ input });
            focusAutocomplete(autocomplete);
            setStatus('🎯 Autocomplete focused');
          },
        },
      ],
    },
    {
      category: '🌍 Advanced Geocoding',
      functions: [
        {
          name: 'geocodeWithComponents',
          description: 'Geocode with component filtering',
          action: async () => {
            try {
              await geocodeWithComponents(
                userAddress,
                {
                  country: 'US',
                  administrativeArea: 'NY',
                },
                () => {}
              );
              setStatus(`🌍 Geocoded with components successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeWithBounds',
          description: 'Geocode within bounds',
          action: async () => {
            try {
              const bounds = new google.maps.LatLngBounds(
                { lat: 40.7, lng: -74.1 },
                { lat: 40.8, lng: -73.9 }
              );
              await geocodeWithBounds(userAddress, bounds, () => {});
              setStatus(`🗺️ Geocoded within bounds successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeWithRegion',
          description: 'Geocode with region bias',
          action: async () => {
            try {
              await geocodeWithRegion(userAddress, 'US', () => {});
              setStatus(`🇺🇸 Geocoded with region bias successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocodeFirst',
          description: 'Get first geocoding result',
          action: async () => {
            try {
              const result = await geocodeFirst(userAddress);
              if (result) {
                setStatus(`📍 First result: ${result.address}`);
              } else {
                setStatus('❌ No results found');
              }
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'reverseGeocodeFirst',
          description: 'Get first reverse geocoding result',
          action: async () => {
            try {
              const [lat, lng] = userCoordinates.split(',').map(Number);
              const result = await reverseGeocodeFirst({ lat, lng });
              if (result) {
                setStatus(`📍 Reverse geocoded: ${result.address}`);
              } else {
                setStatus('❌ No results found');
              }
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'geocode',
          description: 'Geocode address (sync)',
          action: () => {
            try {
              geocode(userAddress, () => {});
              setStatus(`🌍 Geocoded (sync) successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'reverseGeocode',
          description: 'Reverse geocode coordinates (sync)',
          action: () => {
            try {
              const [lat, lng] = userCoordinates.split(',').map(Number);
              reverseGeocode({ lat, lng }, () => {});
              setStatus(`📍 Reverse geocoded (sync) successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getDirections',
          description: 'Get directions (sync)',
          action: () => {
            try {
              getDirections(
                {
                  origin: originAddress,
                  destination: destinationAddress,
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                () => {}
              );
              setStatus(`🚗 Directions (sync) successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'renderDirections',
          description: 'Render directions on map',
          action: async () => {
            if (!mapInstance) return;
            try {
              const directions = await getDirectionsAsync({
                origin: originAddress,
                destination: destinationAddress,
                travelMode: google.maps.TravelMode.DRIVING,
              });
              const directionsRenderer = new google.maps.DirectionsRenderer();
              directionsRenderer.setMap(mapInstance.map);
              renderDirections(mapInstance.map, directions);
              setStatus('🎨 Directions rendered on map');
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getDistanceMatrix',
          description: 'Get distance matrix (sync)',
          action: () => {
            try {
              getDistanceMatrix(
                {
                  origins: [originAddress],
                  destinations: [destinationAddress],
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                () => {}
              );
              setStatus(`📏 Distance matrix (sync) successfully`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'getDistanceMatrixAsync',
          description: 'Get distance matrix (async)',
          action: async () => {
            try {
              const matrix = await getDistanceMatrixAsync({
                origins: [originAddress],
                destinations: [destinationAddress],
                travelMode: google.maps.TravelMode.DRIVING,
              });
              setStatus(`📏 Distance matrix (async): ${matrix.length} results`);
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
        {
          name: 'addMarkerClickListener',
          description: 'Add marker click listener',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers available');
              return;
            }
            const marker = markers[0];
            addMarkerClickListener(marker, () => {
              setStatus('👆 Marker clicked!');
            });
            setStatus('👂 Marker click listener added');
          },
        },
        {
          name: 'addMarkerDragListener',
          description: 'Add marker drag listener',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers available');
              return;
            }
            const marker = markers[0];
            addMarkerDragListener(marker, () => {
              setStatus('🖱️ Marker being dragged!');
            });
            setStatus('👂 Marker drag listener added');
          },
        },
        {
          name: 'addMarkerDragEndListener',
          description: 'Add marker drag end listener',
          action: () => {
            if (!mapInstance || markers.length === 0) {
              setStatus('⚠️ No markers available');
              return;
            }
            const marker = markers[0];
            addMarkerDragEndListener(marker, () => {
              setStatus('🏁 Marker drag ended!');
            });
            setStatus('👂 Marker drag end listener added');
          },
        },
        {
          name: 'getDirectionsBounds',
          description: 'Get directions route bounds',
          action: async () => {
            try {
              const directions = await getDirectionsAsync({
                origin: originAddress,
                destination: destinationAddress,
                travelMode: google.maps.TravelMode.DRIVING,
              });
              const bounds = getDirectionsBounds(directions);
              if (bounds) {
                setStatus(
                  `📐 Directions bounds: ${bounds.getNorthEast().lat()}, ${bounds.getNorthEast().lng()}`
                );
              } else {
                setStatus('❌ No bounds available');
              }
            } catch (error) {
              setStatus(`❌ Failed: ${error.message}`);
            }
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-green-500 text-white py-8 px-6 shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            🗺️ gmaps-kit/core Demo
          </h1>
          <p className="text-xl opacity-90">
            Complete showcase of all 50+ functions
          </p>
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
              disabled={!apiKey || apiKey === 'YOUR_API_KEY' || isLoaded}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isLoaded
                  ? 'bg-green-500 text-white cursor-default'
                  : 'google-button-primary'
              }`}
            >
              {isLoaded ? '✅ Maps Loaded' : 'Load Google Maps'}
            </button>
          </div>

          {/* Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="text-blue-700 font-semibold mb-2">📊 Status</h4>
            <p className="text-sm text-gray-600 mb-2">{status}</p>
            {selectedFunction && (
              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                🎯 Running: {selectedFunction}
              </div>
            )}
          </div>

          {/* Demo Functions */}
          {isLoaded && (
            <div>
              <h3 className="text-gray-700 font-semibold mb-4">
                🧪 Try gmaps-kit Functions
              </h3>

              {demoFunctions.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-4">
                  <h4 className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-2 bg-gray-100 px-2 py-1 rounded">
                    {category.category}
                  </h4>

                  {category.functions.map((func, funcIndex) => (
                    <button
                      key={funcIndex}
                      onClick={() => {
                        setSelectedFunction(func.name);
                        func.action();
                      }}
                      className={`w-full p-2 mb-1 text-left transition-all duration-200 rounded-md text-xs cursor-pointer ${
                        selectedFunction === func.name
                          ? 'bg-blue-100 border-blue-300 border text-blue-800'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:shadow-sm'
                      }`}
                    >
                      <div className="font-medium">{func.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        {func.description}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Map Container */}
          <div className="google-card">
            <div
              id="map-container"
              className="h-96 w-full bg-gray-100 flex items-center justify-center text-gray-500 rounded-lg"
            >
              {!isLoaded ? (
                <div className="text-center">
                  <div className="text-5xl mb-3">🗺️</div>
                  <div>Enter your API key and click "Load Google Maps"</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-5xl mb-3">✅</div>
                  <div>Map loaded! Try the functions in the sidebar</div>
                </div>
              )}
            </div>
          </div>

          {/* User Input Fields */}
          {isLoaded && (
            <div className="mt-6 google-card">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                🎛️ User Input Fields
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address to Geocode:
                  </label>
                  <input
                    type="text"
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    placeholder="Enter address"
                    className="google-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coordinates (lat, lng):
                  </label>
                  <input
                    type="text"
                    value={userCoordinates}
                    onChange={(e) => setUserCoordinates(e.target.value)}
                    placeholder="40.7580, -73.9855"
                    className="google-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origin Address:
                  </label>
                  <input
                    type="text"
                    value={originAddress}
                    onChange={(e) => setOriginAddress(e.target.value)}
                    placeholder="New York, NY"
                    className="google-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination Address:
                  </label>
                  <input
                    type="text"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    placeholder="Los Angeles, CA"
                    className="google-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marker Title:
                  </label>
                  <input
                    type="text"
                    value={markerTitle}
                    onChange={(e) => setMarkerTitle(e.target.value)}
                    placeholder="My Custom Marker"
                    className="google-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    InfoWindow Content:
                  </label>
                  <input
                    type="text"
                    value={infoWindowContent}
                    onChange={(e) => setInfoWindowContent(e.target.value)}
                    placeholder="Hello from gmaps-kit!"
                    className="google-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Marker Index:
                  </label>
                  <input
                    type="number"
                    value={selectedMarkerIndex}
                    onChange={(e) =>
                      setSelectedMarkerIndex(Number(e.target.value))
                    }
                    min="0"
                    max={markers.length - 1}
                    className="google-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Place Type:
                  </label>
                  <input
                    type="text"
                    value={searchPlace}
                    onChange={(e) => setSearchPlace(e.target.value)}
                    placeholder="restaurant"
                    className="google-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Autocomplete Input */}
          {isLoaded && (
            <div className="mt-6 google-card">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">
                🔍 Places Autocomplete
              </h4>
              <input
                id="autocomplete-input"
                type="text"
                placeholder="Search for places (restaurants, hotels, etc.)"
                className="google-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      // Create autocomplete and trigger search
                      const autocomplete = createAutocomplete({ input });
                      const place = autocomplete.getPlace();
                      if (place && place.geometry) {
                        const marker = addMarker(mapInstance.map, {
                          position: {
                            lat: place.geometry.location!.lat(),
                            lng: place.geometry.location!.lng(),
                          },
                          title: place.name || 'Searched Place',
                        });
                        setMarkers([...markers, marker]);
                        setMapCenter(mapInstance.map, {
                          lat: place.geometry.location!.lat(),
                          lng: place.geometry.location!.lng(),
                        });
                        setStatus(
                          `✅ Added: ${place.name || 'Searched Place'}`
                        );
                      }
                    }
                  }
                }}
              />
              <p className="text-sm text-gray-500 mt-3">
                Type a place name and press Enter to add it to the map
              </p>
            </div>
          )}

          {/* Search Box Input */}
          {isLoaded && (
            <div className="mt-6 google-card">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">
                🔍 Search Box
              </h4>
              <input
                id="search-box-input"
                type="text"
                placeholder="Search for places on the map"
                className="google-input"
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      try {
                        setStatus(`🔍 Searching for: ${input.value}...`);

                        // Use geocoding to find the place
                        const results = await geocodeAsync(input.value);
                        if (results.length > 0) {
                          const result = results[0];

                          // Add marker at the found location
                          const marker = addMarker(mapInstance.map, {
                            position: result.location,
                            title: result.address,
                          });
                          setMarkers([...markers, marker]);

                          // Center map on the result
                          setMapCenter(mapInstance.map, result.location);
                          setMapZoom(mapInstance.map, 15);

                          setStatus(`✅ Found and added: ${result.address}`);
                        } else {
                          setStatus(`❌ No results found for: ${input.value}`);
                        }
                      } catch (error) {
                        setStatus(`❌ Search failed: ${error.message}`);
                      }
                    }
                  }
                }}
              />
              <p className="text-sm text-gray-500 mt-3">
                Type an address and press Enter to search and add to map
              </p>
            </div>
          )}

          {/* Code Examples */}
          {isLoaded && (
            <div className="mt-6 google-card">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                💻 Code Examples
              </h4>

              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-auto">
                <div className="text-gray-500 mb-2">
                  // Import all gmaps-kit/core functions
                </div>
                <div className="text-pink-600">import {`{`}</div>
                <div className="ml-5 text-blue-600">
                  loadGoogleMaps, createMap, addMarker,
                  <br />
                  geocodeAsync, getDirectionsAsync,
                  <br />
                  createAutocomplete, getMapCenter,
                  <br />
                  setMapCenter, clearMarkers,
                  <br />
                  getTotalDistance, fitMapToRoute
                </div>
                <div className="text-pink-600">
                  {`}`} from '@gmaps-kit/core';
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
