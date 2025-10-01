import {
  createMap,
  getMapCenter,
  setMapCenter,
  getMapZoom,
  setMapZoom,
} from '../map';
import { MapOptions } from '../types';

// Mock Google Maps
const mockMap = {
  getCenter: jest.fn(),
  setCenter: jest.fn(),
  getZoom: jest.fn(),
  setZoom: jest.fn(),
  addListener: jest.fn(),
};

const mockGoogleMaps = {
  Map: jest.fn(() => mockMap),
  MapTypeId: {
    ROADMAP: 'roadmap',
  },
  LatLng: jest.fn(),
  LatLngBounds: jest.fn(),
};

// Mock the global window object
Object.defineProperty(window, 'google', {
  value: { maps: mockGoogleMaps },
  writable: true,
});

describe('Map Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMap', () => {
    it('should create a map with basic options', () => {
      const container = document.createElement('div');
      const options: MapOptions = {
        center: { lat: 40.7128, lng: -74.006 },
        zoom: 10,
      };

      const result = createMap(container, options);

      expect(mockGoogleMaps.Map).toHaveBeenCalledWith(container, {
        center: options.center,
        zoom: options.zoom,
        mapTypeId: 'roadmap',
        styles: undefined,
        disableDefaultUI: undefined,
        zoomControl: undefined,
        mapTypeControl: undefined,
        scaleControl: undefined,
        streetViewControl: undefined,
        rotateControl: undefined,
        fullscreenControl: undefined,
      });

      expect(result.map).toBe(mockMap);
      expect(result.markers).toEqual([]);
      expect(result.infoWindows).toEqual([]);
    });

    it('should create a map with all options', () => {
      const container = document.createElement('div');
      const options: MapOptions = {
        center: { lat: 40.7128, lng: -74.006 },
        zoom: 10,
        mapTypeId: mockGoogleMaps.MapTypeId.ROADMAP as any,
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: false,
      };

      createMap(container, options);

      expect(mockGoogleMaps.Map).toHaveBeenCalledWith(container, options);
    });

    it('should throw error if Google Maps is not loaded', () => {
      // @ts-ignore
      global.window = {};

      const container = document.createElement('div');
      const options: MapOptions = {
        center: { lat: 40.7128, lng: -74.006 },
        zoom: 10,
      };

      expect(() => createMap(container, options)).toThrow(
        'Google Maps API is not loaded'
      );
    });

    it('should throw error if container element is not found', () => {
      expect(() =>
        createMap('non-existent-id', {
          center: { lat: 40.7128, lng: -74.006 },
          zoom: 10,
        })
      ).toThrow('Map container element not found');
    });
  });

  describe('getMapCenter', () => {
    it('should return map center coordinates', () => {
      const mockCenter = { lat: () => 40.7128, lng: () => -74.006 };
      mockMap.getCenter.mockReturnValue(mockCenter);

      const result = getMapCenter(mockMap as any);

      expect(result).toEqual({ lat: 40.7128, lng: -74.006 });
    });

    it('should return default coordinates if center is null', () => {
      mockMap.getCenter.mockReturnValue(null);

      const result = getMapCenter(mockMap as any);

      expect(result).toEqual({ lat: 0, lng: 0 });
    });
  });

  describe('setMapCenter', () => {
    it('should set map center', () => {
      const center = { lat: 40.7128, lng: -74.006 };

      setMapCenter(mockMap as any, center);

      expect(mockMap.setCenter).toHaveBeenCalledWith(center);
    });
  });

  describe('getMapZoom', () => {
    it('should return map zoom level', () => {
      mockMap.getZoom.mockReturnValue(10);

      const result = getMapZoom(mockMap as any);

      expect(result).toBe(10);
    });

    it('should return 0 if zoom is null', () => {
      mockMap.getZoom.mockReturnValue(null);

      const result = getMapZoom(mockMap as any);

      expect(result).toBe(0);
    });
  });

  describe('setMapZoom', () => {
    it('should set map zoom level', () => {
      setMapZoom(mockMap as any, 15);

      expect(mockMap.setZoom).toHaveBeenCalledWith(15);
    });
  });
});
