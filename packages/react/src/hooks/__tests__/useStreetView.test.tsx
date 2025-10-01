import { renderTestHook, act } from '../../test-utils/render-hook';
import { useStreetView } from '../useStreetView';

const mockPanorama = {
  setPosition: jest.fn(),
  getPosition: jest.fn(),
  setPov: jest.fn(),
  getPov: jest.fn(() => ({ heading: 90, pitch: 0 })),
  setVisible: jest.fn(),
  getVisible: jest.fn(() => true),
  addListener: jest.fn(),
};

beforeAll(() => {
  Object.defineProperty(window, 'google', {
    value: {
      maps: {
        StreetViewPanorama: jest.fn(() => mockPanorama),
      },
    },
    configurable: true,
    writable: true,
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useStreetView', () => {
  it('initializes panorama and exposes helpers', async () => {
    const container = document.createElement('div');
    container.id = 'street-view';
    document.body.appendChild(container);

    const { result, unmount } = renderTestHook((id: string) => useStreetView(id), 'street-view');

    await act(async () => {});

    expect(result.current.isReady).toBe(true);

    act(() => {
      result.current.setPosition({ lat: 1, lng: 2 });
      result.current.setPov({ heading: 180, pitch: 10 });
      result.current.setVisible(false);
    });

    expect(mockPanorama.setPosition).toHaveBeenCalledWith({ lat: 1, lng: 2 });
    expect(mockPanorama.setPov).toHaveBeenCalledWith({ heading: 180, pitch: 10 });
    expect(mockPanorama.setVisible).toHaveBeenCalledWith(false);

    unmount();
    document.body.removeChild(container);
  });
});
