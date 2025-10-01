/**
 * Google Geocoding Web Service REST client implementation.
 * Reference: https://developers.google.com/maps/documentation/geocoding
 */

const DEFAULT_BASE_URL = '/api/geocoding';

export type GeocodingStatus =
  | 'OK'
  | 'ZERO_RESULTS'
  | 'OVER_QUERY_LIMIT'
  | 'REQUEST_DENIED'
  | 'INVALID_REQUEST'
  | 'UNKNOWN_ERROR';

export interface GeocodingLatLngLiteral {
  lat: number;
  lng: number;
}

export interface GeocodingBounds {
  northeast: GeocodingLatLngLiteral;
  southwest: GeocodingLatLngLiteral;
}

export interface GeocodingViewport {
  northeast: GeocodingLatLngLiteral;
  southwest: GeocodingLatLngLiteral;
}

export interface GeocodingAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GeocodingGeometry {
  location: GeocodingLatLngLiteral;
  location_type: string;
  viewport: GeocodingViewport;
  bounds?: GeocodingBounds;
}

export interface GeocodingPlusCode {
  compound_code?: string;
  global_code: string;
}

export interface GeocodingResult {
  formatted_address: string;
  place_id: string;
  types: string[];
  geometry: GeocodingGeometry;
  address_components: GeocodingAddressComponent[];
  partial_match?: boolean;
  plus_code?: GeocodingPlusCode;
}

export interface GeocodingResponse {
  status: GeocodingStatus;
  results: GeocodingResult[];
  error_message?: string;
}

export interface GeocodeRequest {
  address?: string;
  placeId?: string;
  latlng?: GeocodingLatLngLiteral;
  bounds?: GeocodingBounds;
  components?: Record<string, string>;
  region?: string;
  language?: string;
  resultType?: string[];
  locationType?: string[];
}

export interface ReverseGeocodeRequest {
  latlng: GeocodingLatLngLiteral;
  resultType?: string[];
  locationType?: string[];
  language?: string;
}

export type GeocodingRetryStatus =
  | 'UNKNOWN_ERROR'
  | 'OVER_QUERY_LIMIT'
  | 'INVALID_REQUEST';

export interface GeocodingRetryConfig {
  retries?: number;
  delayMs?: number;
  backoffFactor?: number;
  retryStatuses?: GeocodingRetryStatus[];
}

export interface GeocodingClientOptions {
  apiKey: string;
  fetchImpl?: typeof fetch;
  baseUrl?: string;
  language?: string;
  region?: string;
  channel?: string;
  timeoutMs?: number;
  requestInit?: RequestInit;
  retryConfig?: GeocodingRetryConfig;
}

export class GeocodingApiError extends Error {
  public readonly status: GeocodingStatus;
  public readonly details?: unknown;

  constructor(status: GeocodingStatus, message?: string, details?: unknown) {
    super(message || `Geocoding request failed with status ${status}`);
    this.name = 'GeocodingApiError';
    this.status = status;
    this.details = details;
  }
}

const SUCCESS_STATUSES: GeocodingStatus[] = ['OK', 'ZERO_RESULTS'];
const DEFAULT_RETRY_STATUSES: GeocodingRetryStatus[] = [
  'UNKNOWN_ERROR',
  'OVER_QUERY_LIMIT',
];
const DEFAULT_RETRY_DELAY_MS = 1000;
const DEFAULT_RETRY_FACTOR = 2;

export class GeocodingClient {
  private readonly apiKey: string;
  private readonly fetchImpl: typeof fetch;
  private readonly baseUrl: string;
  private readonly defaultLanguage?: string;
  private readonly defaultRegion?: string;
  private readonly channel?: string;
  private readonly timeoutMs?: number;
  private readonly defaultRequestInit?: RequestInit;
  private readonly retryConfig: Required<GeocodingRetryConfig>;

  constructor(options: GeocodingClientOptions) {
    const fetchCandidate =
      options.fetchImpl ?? (globalThis.fetch as typeof fetch | undefined);

    if (!fetchCandidate) {
      throw new Error(
        'Fetch API is not available in the current environment. Provide fetchImpl in GeocodingClientOptions.'
      );
    }

    this.apiKey = options.apiKey;
    // Bind the fetch function to prevent "Illegal invocation" errors
    this.fetchImpl = fetchCandidate.bind(globalThis);
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.defaultLanguage = options.language;
    this.defaultRegion = options.region;
    this.channel = options.channel;
    this.timeoutMs = options.timeoutMs;
    this.defaultRequestInit = options.requestInit;

    this.retryConfig = {
      retries: options.retryConfig?.retries ?? 0,
      delayMs: options.retryConfig?.delayMs ?? DEFAULT_RETRY_DELAY_MS,
      backoffFactor: options.retryConfig?.backoffFactor ?? DEFAULT_RETRY_FACTOR,
      retryStatuses:
        options.retryConfig?.retryStatuses ?? DEFAULT_RETRY_STATUSES,
    };
  }

  async geocode(request: GeocodeRequest): Promise<GeocodingResponse> {
    this.assertValidRequest(request);

    return this.get({
      address: request.address,
      place_id: request.placeId,
      latlng: this.serializeLatLng(request.latlng),
      bounds: this.serializeBounds(request.bounds),
      components: this.serializeComponents(request.components),
      region: request.region ?? this.defaultRegion,
      language: request.language ?? this.defaultLanguage,
      result_type: this.serializeArray(request.resultType),
      location_type: this.serializeArray(request.locationType),
    });
  }

  async reverseGeocode(
    request: ReverseGeocodeRequest
  ): Promise<GeocodingResponse> {
    return this.geocode({
      latlng: request.latlng,
      resultType: request.resultType,
      locationType: request.locationType,
      language: request.language,
    });
  }

  private assertValidRequest(request: GeocodeRequest): void {
    if (
      !request.address &&
      !request.placeId &&
      !request.latlng &&
      !request.components
    ) {
      throw new Error(
        'Geocode request requires at least one of address, placeId, latlng, or components.'
      );
    }
  }

  private async get(
    params: Record<string, unknown>
  ): Promise<GeocodingResponse> {
    const { retries, delayMs, backoffFactor, retryStatuses } = this.retryConfig;
    let attempt = 0;
    let currentDelay = delayMs;

    while (attempt <= retries) {
      // Handle test environment where window.location.origin might not be available
      const baseUrl = this.baseUrl.startsWith('http')
        ? this.baseUrl
        : `${typeof window !== 'undefined' && window.location ? window.location.origin : 'https://maps.googleapis.com'}${this.baseUrl}`;

      const url = new URL(`${baseUrl}/json`);
      url.searchParams.set('key', this.apiKey);
      if (this.channel) {
        url.searchParams.set('channel', this.channel);
      }

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          return;
        }
        url.searchParams.set(key, String(value));
      });

      const controller =
        typeof AbortController !== 'undefined' && this.timeoutMs
          ? new AbortController()
          : undefined;
      let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

      if (controller && this.timeoutMs) {
        timeoutHandle = setTimeout(() => controller.abort(), this.timeoutMs);
      }

      const requestInit: RequestInit = {
        ...(this.defaultRequestInit ?? {}),
        method: 'GET',
        signal: controller?.signal,
      };

      try {
        const response = await this.fetchImpl(url.toString(), requestInit);
        if (!response.ok) {
          throw new Error(
            `Geocoding network error: ${response.status} ${response.statusText}`
          );
        }

        const payload = (await response.json()) as GeocodingResponse;
        if (!SUCCESS_STATUSES.includes(payload.status)) {
          const apiError = new GeocodingApiError(
            payload.status,
            payload.error_message,
            payload
          );

          if (
            retryStatuses.includes(apiError.status as GeocodingRetryStatus) &&
            attempt < retries
          ) {
            await this.delay(currentDelay);
            attempt += 1;
            currentDelay *= backoffFactor;
            continue;
          }

          throw apiError;
        }

        return payload;
      } catch (error) {
        if (attempt < retries && this.shouldRetryError(error)) {
          await this.delay(currentDelay);
          attempt += 1;
          currentDelay *= backoffFactor;
          continue;
        }

        throw error;
      } finally {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
      }
    }

    throw new Error('GeocodingClient retry attempts exhausted.');
  }

  private serializeLatLng(latlng?: GeocodingLatLngLiteral): string | undefined {
    if (!latlng) return undefined;
    return `${latlng.lat},${latlng.lng}`;
  }

  private serializeBounds(bounds?: GeocodingBounds): string | undefined {
    if (!bounds) return undefined;
    return `${bounds.southwest.lat},${bounds.southwest.lng}|${bounds.northeast.lat},${bounds.northeast.lng}`;
  }

  private serializeComponents(
    components?: Record<string, string>
  ): string | undefined {
    if (!components) return undefined;
    return Object.entries(components)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
  }

  private serializeArray(values?: string[]): string | undefined {
    if (!values || values.length === 0) return undefined;
    return values.join('|');
  }

  private shouldRetryError(error: unknown): boolean {
    if (error instanceof GeocodingApiError) {
      return this.retryConfig.retryStatuses.includes(
        error.status as GeocodingRetryStatus
      );
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return true;
    }

    return error instanceof Error;
  }

  private delay(durationMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, durationMs));
  }
}
