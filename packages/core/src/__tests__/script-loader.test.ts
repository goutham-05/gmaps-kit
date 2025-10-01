import { loadGoogleMaps, isGoogleMapsLoaded, waitForGoogleMaps } from '../script-loader';

// Mock the global window object
const mockWindow = {
  google: {
    maps: {
      Map: jest.fn(),
      Marker: jest.fn(),
      InfoWindow: jest.fn(),
    },
  },
};

describe('Script Loader', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock document methods
    Object.defineProperty(document, 'createElement', {
      value: jest.fn(() => ({
        addEventListener: jest.fn(),
        setAttribute: jest.fn(),
      })),
    });
    
    Object.defineProperty(document, 'querySelector', {
      value: jest.fn(() => null),
    });
    
    Object.defineProperty(document, 'head', {
      value: {
        appendChild: jest.fn(),
      },
    });
  });

  describe('isGoogleMapsLoaded', () => {
    it('should return false when Google Maps is not loaded', () => {
      // @ts-ignore
      global.window = {};
      expect(isGoogleMapsLoaded()).toBe(false);
    });

    it('should return true when Google Maps is loaded', () => {
      // @ts-ignore
      global.window = mockWindow;
      expect(isGoogleMapsLoaded()).toBe(true);
    });
  });

  describe('loadGoogleMaps', () => {
    it('should resolve immediately if Google Maps is already loaded', async () => {
      // @ts-ignore
      global.window = mockWindow;
      
      const result = await loadGoogleMaps({ apiKey: 'test-key' });
      expect(result).toBeUndefined();
    });

    it('should create and append script element when Google Maps is not loaded', async () => {
      // @ts-ignore
      global.window = {};
      
      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.head, 'appendChild');
      
      // Mock the script element
      const mockScript = {
        addEventListener: jest.fn(),
        setAttribute: jest.fn(),
      };
      createElementSpy.mockReturnValue(mockScript as any);
      
      // Start loading but don't wait for completion
      const loadPromise = loadGoogleMaps({ apiKey: 'test-key' });
      
      // Simulate script load
      setTimeout(() => {
        // @ts-ignore
        global.window = mockWindow;
        mockScript.addEventListener.mock.calls[0][1](); // Call load event
      }, 100);
      
      await loadPromise;
      
      expect(createElementSpy).toHaveBeenCalledWith('script');
      expect(appendChildSpy).toHaveBeenCalledWith(mockScript);
    });
  });

  describe('waitForGoogleMaps', () => {
    it('should resolve immediately if Google Maps is already loaded', async () => {
      // @ts-ignore
      global.window = mockWindow;
      
      const result = await waitForGoogleMaps();
      expect(result).toBeUndefined();
    });

    it('should timeout if Google Maps is not loaded within timeout period', async () => {
      // @ts-ignore
      global.window = {};
      
      await expect(waitForGoogleMaps(100)).rejects.toThrow('Timeout waiting for Google Maps to load');
    });
  });
});
