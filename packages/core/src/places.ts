/**
 * Typescript definitions and client for the Google Places Web Service.
 * Reference: https://developers.google.com/maps/documentation/places/web-service
 */

const DEFAULT_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export type PlacesApiStatus =
  | 'OK'
  | 'ZERO_RESULTS'
  | 'INVALID_REQUEST'
  | 'OVER_QUERY_LIMIT'
  | 'REQUEST_DENIED'
  | 'NOT_FOUND'
  | 'UNKNOWN_ERROR';

export interface PlacesLatLngLiteral {
  lat: number;
  lng: number;
}

export interface PlacesViewport {
  northeast: PlacesLatLngLiteral;
  southwest: PlacesLatLngLiteral;
}

export interface PlacesGeometry {
  location: PlacesLatLngLiteral;
  viewport?: PlacesViewport;
}

export interface PlacesPhoto {
  height: number;
  width: number;
  html_attributions: string[];
  photo_reference: string;
}

export interface PlacesOpeningHoursPeriodPoint {
  day: number;
  time: string;
}

export interface PlacesOpeningHoursPeriod {
  open: PlacesOpeningHoursPeriodPoint;
  close?: PlacesOpeningHoursPeriodPoint;
}

export interface PlacesOpeningHours {
  open_now?: boolean;
  periods?: PlacesOpeningHoursPeriod[];
  weekday_text?: string[];
}

export interface PlacesPlusCode {
  compound_code?: string;
  global_code: string;
}

export interface PlacesReview {
  author_name?: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating?: number;
  relative_time_description?: string;
  text?: string;
  time?: number;
}

export interface PlacesPlace {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  geometry?: PlacesGeometry;
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  business_status?: string;
  opening_hours?: PlacesOpeningHours;
  photos?: PlacesPhoto[];
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  plus_code?: PlacesPlusCode;
  url?: string;
  website?: string;
  vicinity?: string;
  reference?: string;
  reviews?: PlacesReview[];
  adr_address?: string;
  utc_offset?: number;
  [key: string]: unknown;
}

export interface PlacesPredictionStructuredFormatting {
  main_text: string;
  main_text_matched_substrings?: Array<{ offset: number; length: number }>;
  secondary_text?: string;
}

export interface PlacesTerm {
  offset: number;
  value: string;
}

export interface PlacesMatchedSubstring {
  offset: number;
  length: number;
}

export interface PlacesPrediction {
  description: string;
  place_id: string;
  structured_formatting?: PlacesPredictionStructuredFormatting;
  types?: string[];
  terms?: PlacesTerm[];
  matched_substrings?: PlacesMatchedSubstring[];
  distance_meters?: number;
  secondary_text?: string;
  [key: string]: unknown;
}

export interface PlacesAutocompleteResponse {
  predictions: PlacesPrediction[];
  status: PlacesApiStatus;
  error_message?: string;
  info_messages?: string[];
}

export interface PlacesQueryAutocompleteResponse {
  predictions: PlacesPrediction[];
  status: PlacesApiStatus;
  error_message?: string;
  info_messages?: string[];
}

export interface PlacesFindPlaceResponse {
  candidates: PlacesPlace[];
  status: PlacesApiStatus;
  error_message?: string;
  info_messages?: string[];
}

export interface PlacesTextSearchResponse {
  results: PlacesPlace[];
  status: PlacesApiStatus;
  next_page_token?: string;
  error_message?: string;
  info_messages?: string[];
}

export interface PlacesNearbySearchResponse {
  results: PlacesPlace[];
  status: PlacesApiStatus;
  next_page_token?: string;
  error_message?: string;
  info_messages?: string[];
}

export interface PlacesDetailsResponse {
  result: PlacesPlace;
  status: PlacesApiStatus;
  html_attributions?: string[];
  error_message?: string;
  info_messages?: string[];
}

export interface PlacesPhotoOptions {
  maxWidth?: number;
  maxHeight?: number;
  signature?: string;
}

export type PlacesLocationBias =
  | { type: 'ipbias' }
  | { type: 'point'; lat: number; lng: number }
  | { type: 'circle'; lat: number; lng: number; radiusMeters: number }
  | {
      type: 'rectangle';
      southWest: PlacesLatLngLiteral;
      northEast: PlacesLatLngLiteral;
    };

export interface PlacesClientOptions {
  apiKey: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  language?: string;
  region?: string;
  requestInit?: RequestInit;
  channel?: string;
  timeoutMs?: number;
  retryConfig?: PlacesRetryConfig;
}

export interface PlacesFindPlaceRequest {
  input: string;
  inputType: 'textquery' | 'phonenumber';
  fields?: string[];
  language?: string;
  region?: string;
  sessionToken?: string;
  locationBias?: PlacesLocationBias;
}

export interface PlacesTextSearchRequest {
  query: string;
  location?: PlacesLatLngLiteral;
  radius?: number;
  language?: string;
  region?: string;
  minprice?: number;
  maxprice?: number;
  opennow?: boolean;
  type?: string;
  pagetoken?: string;
}

export interface PlacesNearbySearchRequest {
  location: PlacesLatLngLiteral;
  radius?: number;
  keyword?: string;
  language?: string;
  minprice?: number;
  maxprice?: number;
  name?: string;
  opennow?: boolean;
  rankby?: 'prominence' | 'distance';
  type?: string;
  pagetoken?: string;
}

export interface PlacesDetailsRequest {
  placeId: string;
  fields?: string[];
  language?: string;
  region?: string;
  sessionToken?: string;
  reviewsSort?: 'most_relevant' | 'newest';
  reviewsNoTranslations?: boolean;
}

export interface PlacesAutocompleteRequest {
  input: string;
  sessionToken?: string;
  language?: string;
  region?: string;
  components?: string[];
  origin?: PlacesLatLngLiteral;
  offset?: number;
  locationBias?: PlacesLocationBias;
  strictBounds?: boolean;
  types?: string[];
}

export interface PlacesQueryAutocompleteRequest {
  input: string;
  language?: string;
  offset?: number;
  locationBias?: PlacesLocationBias;
  sessionToken?: string;
}

export type PlacesRetryStatus =
  | 'UNKNOWN_ERROR'
  | 'OVER_QUERY_LIMIT'
  | 'INVALID_REQUEST';

export interface PlacesRetryConfig {
  retries?: number;
  delayMs?: number;
  backoffFactor?: number;
  retryStatuses?: PlacesRetryStatus[];
}

export class PlacesApiError extends Error {
  public readonly status: PlacesApiStatus;
  public readonly details?: unknown;

  constructor(status: PlacesApiStatus, message?: string, details?: unknown) {
    super(message || `Places API request failed with status ${status}`);
    this.name = 'PlacesApiError';
    this.status = status;
    this.details = details;
  }
}

type PlacesEndpoint =
  | 'findplacefromtext'
  | 'textsearch'
  | 'nearbysearch'
  | 'details'
  | 'autocomplete'
  | 'queryautocomplete';

const SUCCESS_STATUSES: PlacesApiStatus[] = ['OK', 'ZERO_RESULTS'];
const DEFAULT_NEXT_PAGE_DELAY_MS = 2000;

export class PlacesClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly defaultLanguage?: string;
  private readonly defaultRegion?: string;
  private readonly defaultRequestInit?: RequestInit;
  private readonly channel?: string;
  private readonly timeoutMs?: number;
  private readonly retryConfig: Required<PlacesRetryConfig>;

  constructor(options: PlacesClientOptions) {
    const fetchCandidate = options.fetchImpl ?? (globalThis.fetch as typeof fetch | undefined);

    if (!fetchCandidate) {
      throw new Error(
        'Fetch API is not available in the current environment. Provide a fetchImpl in PlacesClientOptions.'
      );
    }

    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.fetchImpl = fetchCandidate;
    this.defaultLanguage = options.language;
    this.defaultRegion = options.region;
    this.defaultRequestInit = options.requestInit;
    this.channel = options.channel;
    this.timeoutMs = options.timeoutMs;
    const retryStatuses: PlacesRetryStatus[] =
      options.retryConfig?.retryStatuses ?? ['UNKNOWN_ERROR', 'OVER_QUERY_LIMIT'];
    this.retryConfig = {
      retries: options.retryConfig?.retries ?? 0,
      delayMs: options.retryConfig?.delayMs ?? 1000,
      backoffFactor: options.retryConfig?.backoffFactor ?? 2,
      retryStatuses,
    };
  }

  async findPlaceFromText(
    request: PlacesFindPlaceRequest
  ): Promise<PlacesFindPlaceResponse> {
    const response = await this.get<PlacesFindPlaceResponse>('findplacefromtext', {
      input: request.input,
      inputtype: request.inputType,
      fields: this.serializeFields(request.fields),
      language: request.language ?? this.defaultLanguage,
      region: request.region ?? this.defaultRegion,
      sessiontoken: request.sessionToken,
      locationbias: this.serializeLocationBias(request.locationBias),
    });

    return response;
  }

  async textSearch(request: PlacesTextSearchRequest): Promise<PlacesTextSearchResponse> {
    const response = await this.get<PlacesTextSearchResponse>('textsearch', {
      query: request.query,
      location: this.serializeLatLng(request.location),
      radius: request.radius,
      language: request.language ?? this.defaultLanguage,
      region: request.region ?? this.defaultRegion,
      minprice: request.minprice,
      maxprice: request.maxprice,
      opennow: this.serializeBoolean(request.opennow),
      type: request.type,
      pagetoken: request.pagetoken,
    });

    return response;
  }

  async textSearchNextPage(pagetoken: string, delayMs: number = DEFAULT_NEXT_PAGE_DELAY_MS): Promise<PlacesTextSearchResponse> {
    await this.delay(delayMs);
    return this.get<PlacesTextSearchResponse>('textsearch', { pagetoken });
  }

  async nearbySearch(
    request: PlacesNearbySearchRequest
  ): Promise<PlacesNearbySearchResponse> {
    this.validateNearbySearchRequest(request);

    const response = await this.get<PlacesNearbySearchResponse>('nearbysearch', {
      location: this.serializeLatLng(request.location),
      radius: request.radius,
      keyword: request.keyword,
      language: request.language ?? this.defaultLanguage,
      minprice: request.minprice,
      maxprice: request.maxprice,
      name: request.name,
      opennow: this.serializeBoolean(request.opennow),
      rankby: request.rankby,
      type: request.type,
      pagetoken: request.pagetoken,
    });

    return response;
  }

  async nearbySearchNextPage(pagetoken: string, delayMs: number = DEFAULT_NEXT_PAGE_DELAY_MS): Promise<PlacesNearbySearchResponse> {
    await this.delay(delayMs);
    return this.get<PlacesNearbySearchResponse>('nearbysearch', { pagetoken });
  }

  private validateNearbySearchRequest(request: PlacesNearbySearchRequest): void {
    if (request.pagetoken) {
      return;
    }

    if (request.rankby === 'distance') {
      if (request.radius !== undefined) {
        throw new Error('Do not supply radius when rankby is set to "distance".');
      }
      if (!request.keyword && !request.name && !request.type) {
        throw new Error(
          'When rankby is "distance" you must provide at least one of keyword, name, or type.'
        );
      }
    } else if (request.radius === undefined) {
      throw new Error('radius is required when rankby is not "distance".');
    }
  }

  async placeDetails(request: PlacesDetailsRequest): Promise<PlacesDetailsResponse> {
    const response = await this.get<PlacesDetailsResponse>('details', {
      place_id: request.placeId,
      fields: this.serializeFields(request.fields),
      language: request.language ?? this.defaultLanguage,
      region: request.region ?? this.defaultRegion,
      sessiontoken: request.sessionToken,
      reviews_sort: request.reviewsSort,
      reviews_no_translations: this.serializeBoolean(request.reviewsNoTranslations),
    });

    return response;
  }

  async autocomplete(
    request: PlacesAutocompleteRequest
  ): Promise<PlacesAutocompleteResponse> {
    return this.get<PlacesAutocompleteResponse>('autocomplete', {
      input: request.input,
      sessiontoken: request.sessionToken,
      language: request.language ?? this.defaultLanguage,
      region: request.region ?? this.defaultRegion,
      components: this.serializeComponents(request.components),
      origin: this.serializeLatLng(request.origin),
      offset: request.offset,
      locationbias: this.serializeLocationBias(request.locationBias),
      strictbounds: this.serializeBoolean(request.strictBounds),
      types: request.types ? request.types.join('|') : undefined,
    });
  }

  async queryAutocomplete(
    request: PlacesQueryAutocompleteRequest
  ): Promise<PlacesQueryAutocompleteResponse> {
    return this.get<PlacesQueryAutocompleteResponse>('queryautocomplete', {
      input: request.input,
      language: request.language ?? this.defaultLanguage,
      offset: request.offset,
      locationbias: this.serializeLocationBias(request.locationBias),
      sessiontoken: request.sessionToken,
    });
  }

  /**
   * Computes a direct photo URL for the Places Photo service.
   */
  buildPhotoUrl(photoReference: string, options: PlacesPhotoOptions = {}): string {
    const url = new URL(`${this.baseUrl}/photo`);
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('photoreference', photoReference);

    if (options.maxWidth) {
      url.searchParams.set('maxwidth', options.maxWidth.toString());
    }

    if (options.maxHeight) {
      url.searchParams.set('maxheight', options.maxHeight.toString());
    }

    if (options.signature) {
      url.searchParams.set('signature', options.signature);
    }

    return url.toString();
  }

  private async get<T>(endpoint: PlacesEndpoint, params: Record<string, unknown>): Promise<T> {
    const { retries, delayMs, backoffFactor } = this.retryConfig;
    let attempt = 0;
    let delayDuration = delayMs;

    while (attempt <= retries) {
      const url = new URL(`${this.baseUrl}/${endpoint}/json`);
      url.searchParams.set('key', this.apiKey);
      if (this.channel) {
        url.searchParams.set('channel', this.channel);
      }

      Object.entries(params).forEach(([paramKey, paramValue]) => {
        if (paramValue === undefined || paramValue === null || paramValue === '') {
          return;
        }
        url.searchParams.set(paramKey, String(paramValue));
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
            `Places API network error: ${response.status} ${response.statusText}`
          );
        }

        const payload = (await response.json()) as {
          status: PlacesApiStatus;
          error_message?: string;
        } & T;

        if (!SUCCESS_STATUSES.includes(payload.status)) {
          const apiError = new PlacesApiError(
            payload.status,
            payload.error_message,
            payload
          );

          if (this.shouldRetryStatus(apiError.status) && attempt < retries) {
            await this.delay(delayDuration);
            attempt += 1;
            delayDuration *= backoffFactor;
            continue;
          }

          throw apiError;
        }

        return payload;
      } catch (error) {
        if (attempt < retries && this.shouldRetryError(error)) {
          await this.delay(delayDuration);
          attempt += 1;
          delayDuration *= backoffFactor;
          continue;
        }

        throw error;
      } finally {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
      }
    }

    throw new Error('Unexpected failure in PlacesClient request retries.');
  }

  private serializeFields(fields?: string[]): string | undefined {
    return fields && fields.length > 0 ? fields.join(',') : undefined;
  }

  private serializeComponents(components?: string[]): string | undefined {
    return components && components.length > 0 ? components.join('|') : undefined;
  }

  private serializeLatLng(location?: PlacesLatLngLiteral): string | undefined {
    if (!location) return undefined;
    return `${location.lat},${location.lng}`;
  }

  private serializeBoolean(value?: boolean): string | undefined {
    if (value === undefined) return undefined;
    return value ? 'true' : 'false';
  }

  private serializeLocationBias(locationBias?: PlacesLocationBias): string | undefined {
    if (!locationBias) return undefined;

    switch (locationBias.type) {
      case 'ipbias':
        return 'ipbias';
      case 'point':
        return `point:${locationBias.lat},${locationBias.lng}`;
      case 'circle':
        return `circle:${locationBias.radiusMeters}@${locationBias.lat},${locationBias.lng}`;
      case 'rectangle':
        return `rectangle:${locationBias.southWest.lat},${locationBias.southWest.lng}|${locationBias.northEast.lat},${locationBias.northEast.lng}`;
      default:
        return undefined;
    }
  }

  private shouldRetryStatus(status: PlacesApiStatus): boolean {
    return this.retryConfig.retryStatuses.includes(status as PlacesRetryStatus);
  }

  private shouldRetryError(error: unknown): boolean {
    if (error instanceof PlacesApiError) {
      return this.shouldRetryStatus(error.status);
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return true;
      }
      return true;
    }

    return false;
  }

  private delay(durationMs: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, durationMs);
    });
  }
}

/**
 * Utility for generating a session token suitable for Autocomplete flows.
 * Consumers are expected to persist the token for the duration of the user session.
 */
export function createPlacesSessionToken(): string {
  const cryptoApi = typeof globalThis !== 'undefined' ? (globalThis.crypto as Crypto | undefined) : undefined;
  if (cryptoApi && typeof cryptoApi.randomUUID === 'function') {
    return cryptoApi.randomUUID();
  }
  return generateFallbackUUID();
}

function generateFallbackUUID(): string {
  // Simple RFC4122 v4 compliant implementation for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = (Math.random() * 16) | 0;
    const value = character === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
