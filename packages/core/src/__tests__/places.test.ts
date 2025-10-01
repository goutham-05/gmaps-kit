import {
  PlacesClient,
  PlacesApiError,
  createPlacesSessionToken,
} from '../places';

describe('PlacesClient', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'OK', candidates: [] }),
      status: 200,
      statusText: 'OK',
    });
  });

  it('constructs a valid findPlaceFromText request', async () => {
    const client = new PlacesClient({ apiKey: 'test', fetchImpl: mockFetch, channel: 'docs' });

    await client.findPlaceFromText({
      input: 'coffee',
      inputType: 'textquery',
      fields: ['place_id', 'name'],
      sessionToken: 'token',
      locationBias: { type: 'circle', radiusMeters: 2000, lat: 37.422, lng: -122.084 },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [requestUrl] = mockFetch.mock.calls[0];
    const url = new URL(requestUrl);

    expect(url.pathname.endsWith('/findplacefromtext/json')).toBe(true);
    expect(url.searchParams.get('key')).toBe('test');
    expect(url.searchParams.get('channel')).toBe('docs');
    expect(url.searchParams.get('input')).toBe('coffee');
    expect(url.searchParams.get('inputtype')).toBe('textquery');
    expect(url.searchParams.get('fields')).toBe('place_id,name');
    expect(url.searchParams.get('sessiontoken')).toBe('token');
    expect(url.searchParams.get('locationbias')).toBe('circle:2000@37.422,-122.084');
  });

  it('throws PlacesApiError on non-success status', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'REQUEST_DENIED',
        error_message: 'Invalid key',
      }),
      status: 200,
      statusText: 'OK',
    });

    const client = new PlacesClient({ apiKey: 'bad', fetchImpl: mockFetch });

    await expect(
      client.textSearch({ query: 'pizza' })
    ).rejects.toThrowError(PlacesApiError);
  });

  it('retries on configured retry statuses', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 'OVER_QUERY_LIMIT',
          error_message: 'slow down',
        }),
        status: 200,
        statusText: 'OK',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 'OK', results: [] }),
        status: 200,
        statusText: 'OK',
      });

    const delaySpy = jest
      .spyOn(PlacesClient.prototype as any, 'delay')
      .mockImplementation(() => Promise.resolve());

    const client = new PlacesClient({
      apiKey: 'retry',
      fetchImpl: mockFetch,
      retryConfig: { retries: 1, delayMs: 10 },
    });

    await client.textSearch({ query: 'museum' });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    delaySpy.mockRestore();
  });

  it('fetches next page results with optional delay override', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'OK', results: [] }),
      status: 200,
      statusText: 'OK',
    });

    const delaySpy = jest
      .spyOn(PlacesClient.prototype as any, 'delay')
      .mockImplementation(() => Promise.resolve());

    const client = new PlacesClient({ apiKey: 'test', fetchImpl: mockFetch });
    await client.textSearchNextPage('token', 0);

    const [requestUrl] = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
    const url = new URL(requestUrl);
    expect(url.searchParams.get('pagetoken')).toBe('token');

    delaySpy.mockRestore();
  });

  it('raises validation error for invalid nearby search configuration', async () => {
    const client = new PlacesClient({ apiKey: 'test', fetchImpl: mockFetch });

    await expect(
      client.nearbySearch({
        location: { lat: 10, lng: 20 },
        rankby: 'distance',
      } as any)
    ).rejects.toThrow('keyword, name, or type');
  });

  it('includes locationbias params for autocomplete', async () => {
    const client = new PlacesClient({ apiKey: 'test', fetchImpl: mockFetch });

    await client.autocomplete({
      input: 'coffee',
      locationBias: { type: 'point', lat: 37.422, lng: -122.084 },
      offset: 3,
    });

    const lastCall = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
    const [requestUrl] = lastCall;
    const url = new URL(requestUrl);
    expect(url.searchParams.get('locationbias')).toBe('point:37.422,-122.084');
    expect(url.searchParams.get('offset')).toBe('3');
  });

  it('derives photo URLs', () => {
    const client = new PlacesClient({ apiKey: 'key', fetchImpl: mockFetch });
    const url = client.buildPhotoUrl('reference', {
      maxWidth: 400,
      signature: 'sig',
    });
    expect(url).toContain('photoreference=reference');
    expect(url).toContain('maxwidth=400');
    expect(url).toContain('key=key');
    expect(url).toContain('signature=sig');
  });

  it('generates session tokens when crypto API is unavailable', () => {
    const originalCryptoDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      'crypto'
    );

    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: undefined,
    });

    const token = createPlacesSessionToken();
    expect(token).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );

    if (originalCryptoDescriptor) {
      Object.defineProperty(globalThis, 'crypto', originalCryptoDescriptor);
    } else {
      delete (globalThis as any).crypto;
    }
  });
});
