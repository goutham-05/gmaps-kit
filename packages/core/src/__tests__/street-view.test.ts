import {
  createStreetViewPanorama,
  setStreetViewPosition,
  getStreetViewPosition,
  setStreetViewPov,
  getStreetViewPov,
  setStreetViewVisibility,
  isStreetViewVisible,
} from '../street-view';

const mockPanorama = {
  addListener: jest.fn(),
  setPosition: jest.fn(),
  getPosition: jest.fn(),
  setPov: jest.fn(),
  getPov: jest.fn(() => ({ heading: 0, pitch: 0 })),
  setVisible: jest.fn(),
  getVisible: jest.fn(() => true),
};

const mockStreetView = {
  StreetViewPanorama: jest.fn(() => mockPanorama),
};

beforeAll(() => {
  Object.defineProperty(window, 'google', {
    value: { maps: { StreetViewPanorama: mockStreetView.StreetViewPanorama } },
    writable: true,
    configurable: true,
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Street View utilities', () => {
  it('creates a panorama with options and handlers', () => {
    const container = document.createElement('div');

    const handlers = {
      onPovChanged: jest.fn(),
      onPositionChanged: jest.fn(),
      onVisibilityChanged: jest.fn(),
    };

    const panoramaInstance = createStreetViewPanorama(
      container,
      {
        position: { lat: 1, lng: 2 },
        pov: { heading: 90, pitch: 10 },
        zoom: 1,
        visible: true,
      },
      handlers
    );

    expect(mockStreetView.StreetViewPanorama).toHaveBeenCalledWith(container, {
      position: { lat: 1, lng: 2 },
      pov: { heading: 90, pitch: 10 },
      zoom: 1,
      visible: true,
    });
    expect(panoramaInstance.panorama).toBe(mockPanorama);
    expect(mockPanorama.addListener).toHaveBeenCalledTimes(3);
  });

  it('sets and gets panorama position', () => {
    const container = document.createElement('div');
    const { panorama } = createStreetViewPanorama(container);

    setStreetViewPosition(panorama, { lat: 5, lng: 6 });
    expect(mockPanorama.setPosition).toHaveBeenCalledWith({ lat: 5, lng: 6 });

    mockPanorama.getPosition.mockReturnValue({ lat: () => 5, lng: () => 6 });
    const position = getStreetViewPosition(panorama);
    expect(position).toEqual({ lat: 5, lng: 6 });
  });

  it('handles POV and visibility helpers', () => {
    const container = document.createElement('div');
    const { panorama } = createStreetViewPanorama(container);

    setStreetViewPov(panorama, { heading: 180, pitch: -10 });
    expect(mockPanorama.setPov).toHaveBeenCalledWith({
      heading: 180,
      pitch: -10,
    });

    getStreetViewPov(panorama);
    expect(mockPanorama.getPov).toHaveBeenCalled();

    setStreetViewVisibility(panorama, false);
    expect(mockPanorama.setVisible).toHaveBeenCalledWith(false);

    mockPanorama.getVisible.mockReturnValue(false);
    expect(isStreetViewVisible(panorama)).toBe(false);
  });
});
