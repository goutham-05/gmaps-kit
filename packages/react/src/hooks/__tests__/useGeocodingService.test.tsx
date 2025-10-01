import { act, renderTestHook } from '../../test-utils/render-hook';
import { useGeocodingService } from '../useGeocodingService';
import type { UseGeocodingServiceOptions } from '../useGeocodingService';
import { GeocodingApiError } from '@gmaps-kit/core';

describe('useGeocodingService', () => {
  const fetchMock = jest.fn();

  const baseOptions: UseGeocodingServiceOptions = {
    apiKey: 'test',
    fetchImpl: fetchMock,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ status: 'OK', results: [] }),
    });
  });

  it('performs forward geocoding requests', async () => {
    const { result, unmount } = renderTestHook(
      (options: UseGeocodingServiceOptions) => useGeocodingService(options),
      baseOptions
    );

    await act(async () => {
      await result.current.geocode({ address: '1600 Amphitheatre Parkway' });
    });

    expect(fetchMock).toHaveBeenCalled();
    expect(result.current.lastOperation).toBe('geocode');
    expect(result.current.error).toBeNull();

    unmount();
  });

  it('propagates GeocodingApiError on failure', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({
        status: 'REQUEST_DENIED',
        error_message: 'bad key',
      }),
    });

    const { result, unmount } = renderTestHook(
      (options: UseGeocodingServiceOptions) => useGeocodingService(options),
      {
        ...baseOptions,
        apiKey: 'bad',
      }
    );

    let thrown: unknown;
    await act(async () => {
      try {
        await result.current.geocode({ address: 'Anywhere' });
      } catch (error) {
        thrown = error;
      }
    });

    expect(thrown).toBeInstanceOf(GeocodingApiError);
    expect(result.current.error).toBeInstanceOf(GeocodingApiError);
    expect(result.current.lastOperation).toBe('geocode');

    unmount();
  });
});
