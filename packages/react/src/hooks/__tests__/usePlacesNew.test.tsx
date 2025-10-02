import { renderHook, waitFor } from '@testing-library/react';
import { usePlacesNew } from '../usePlacesNew';

describe('usePlacesNew', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ places: [] }),
      status: 200,
      statusText: 'OK',
    });
  });

  it('constructs a valid textSearch request', async () => {
    const { result } = renderHook(() =>
      usePlacesNew({
        apiKey: 'test',
        fetchImpl: mockFetch,
      })
    );

    await result.current.textSearch({
      textQuery: 'coffee shops',
      locationRestriction: {
        circle: {
          center: { latitude: 37.7749, longitude: -122.4194 },
          radius: 1500,
        },
      },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [requestUrl, requestInit] = mockFetch.mock.calls[0];

    expect(requestUrl).toContain('places.googleapis.com/v1/places:searchText');
    expect(requestInit.method).toBe('POST');
    expect(requestInit.headers['X-Goog-Api-Key']).toBe('test');
    expect(requestInit.headers['Content-Type']).toBe('application/json');
  });

  it('constructs a valid nearbySearch request', async () => {
    const { result } = renderHook(() =>
      usePlacesNew({
        apiKey: 'test',
        fetchImpl: mockFetch,
      })
    );

    await result.current.nearbySearch({
      includedTypes: ['restaurant'],
      locationRestriction: {
        circle: {
          center: { latitude: 37.7749, longitude: -122.4194 },
          radius: 1500,
        },
      },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [requestUrl, requestInit] = mockFetch.mock.calls[0];

    expect(requestUrl).toContain(
      'places.googleapis.com/v1/places:searchNearby'
    );
    expect(requestInit.method).toBe('POST');
  });

  it('constructs a valid placeDetails request', async () => {
    const { result } = renderHook(() =>
      usePlacesNew({
        apiKey: 'test',
        fetchImpl: mockFetch,
      })
    );

    await result.current.placeDetails({
      placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [requestUrl, requestInit] = mockFetch.mock.calls[0];

    expect(requestUrl).toContain(
      'places.googleapis.com/v1/places/ChIJN1t_tDeuEmsRUsoyG83frY4'
    );
    expect(requestInit.method).toBe('GET');
  });

  it('constructs a valid autocomplete request', async () => {
    const { result } = renderHook(() =>
      usePlacesNew({
        apiKey: 'test',
        fetchImpl: mockFetch,
      })
    );

    await result.current.autocomplete({
      input: 'coffee',
      locationBias: {
        circle: {
          center: { latitude: 37.7749, longitude: -122.4194 },
          radius: 1500,
        },
      },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [requestUrl, requestInit] = mockFetch.mock.calls[0];

    expect(requestUrl).toContain(
      'places.googleapis.com/v1/places:autocomplete'
    );
    expect(requestInit.method).toBe('POST');
  });

  it('handles loading state correctly', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockFetch.mockReturnValue(promise);

    const { result } = renderHook(() =>
      usePlacesNew({
        apiKey: 'test',
        fetchImpl: mockFetch,
      })
    );

    expect(result.current.isLoading).toBe(false);

    const searchPromise = result.current.textSearch({
      textQuery: 'coffee',
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    resolvePromise!({
      ok: true,
      json: async () => ({ places: [] }),
    });

    await searchPromise;

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('handles errors correctly', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() =>
      usePlacesNew({
        apiKey: 'test',
        fetchImpl: mockFetch,
      })
    );

    await expect(
      result.current.textSearch({
        textQuery: 'coffee',
      })
    ).rejects.toThrow('Network error');

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
  });

  it('builds photo URL correctly', () => {
    const { result } = renderHook(() =>
      usePlacesNew({
        apiKey: 'test',
      })
    );

    const photoUrl = result.current.buildPhotoUrl('photos/123', {
      maxWidthPx: 400,
      maxHeightPx: 300,
    });

    expect(photoUrl).toContain(
      'places.googleapis.com/v1/places/photos/123/media'
    );
    expect(photoUrl).toContain('key=test');
    expect(photoUrl).toContain('maxWidthPx=400');
    expect(photoUrl).toContain('maxHeightPx=300');
  });
});
