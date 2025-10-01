import {
  GeocodingClient,
  GeocodingApiError,
  GeocodingLatLngLiteral,
} from '../geocoding-service';

describe('GeocodingClient', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ status: 'OK', results: [] }),
    });
  });

  it('builds geocode request with address parameters', async () => {
    const client = new GeocodingClient({ apiKey: 'key', fetchImpl: fetchMock });

    await client.geocode({
      address: '1600 Amphitheatre Pkwy, Mountain View, CA',
      components: { country: 'US', postal_code: '94043' },
      resultType: ['street_address', 'route'],
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url] = fetchMock.mock.calls[0];
    const parsed = new URL(url);
    expect(parsed.pathname.endsWith('/json')).toBe(true);
    expect(parsed.searchParams.get('address')).toContain('1600');
    expect(parsed.searchParams.get('components')).toBe(
      'country:US|postal_code:94043'
    );
    expect(parsed.searchParams.get('result_type')).toBe('street_address|route');
  });

  it('builds reverse geocode request with latlng', async () => {
    const client = new GeocodingClient({ apiKey: 'key', fetchImpl: fetchMock });
    const location: GeocodingLatLngLiteral = { lat: 37.422, lng: -122.084 };

    await client.reverseGeocode({
      latlng: location,
      language: 'en',
      resultType: ['street_address'],
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url] = fetchMock.mock.calls[0];
    const parsed = new URL(url);
    expect(parsed.searchParams.get('latlng')).toBe('37.422,-122.084');
    expect(parsed.searchParams.get('result_type')).toBe('street_address');
    expect(parsed.searchParams.get('language')).toBe('en');
  });

  it('retries on retryable API errors', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({
          status: 'OVER_QUERY_LIMIT',
          error_message: 'slow down',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ status: 'OK', results: [] }),
      });

    const delaySpy = jest
      .spyOn(GeocodingClient.prototype as any, 'delay')
      .mockImplementation(() => Promise.resolve());

    const client = new GeocodingClient({
      apiKey: 'key',
      fetchImpl: fetchMock,
      retryConfig: { retries: 1, delayMs: 10 },
    });

    await client.geocode({ address: 'test' });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    delaySpy.mockRestore();
  });

  it('throws when request lacks required parameters', async () => {
    const client = new GeocodingClient({ apiKey: 'key', fetchImpl: fetchMock });

    await expect(client.geocode({})).rejects.toThrow('requires at least one');
  });

  it('throws GeocodingApiError on API failure', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({
        status: 'REQUEST_DENIED',
        error_message: 'invalid key',
      }),
    });

    const client = new GeocodingClient({ apiKey: 'bad', fetchImpl: fetchMock });

    await expect(client.geocode({ address: 'test' })).rejects.toThrow(
      GeocodingApiError
    );
  });
});
