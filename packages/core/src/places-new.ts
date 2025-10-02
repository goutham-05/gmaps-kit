/**
 * Typescript definitions and client for the Google Places API (New).
 * Reference: https://developers.google.com/maps/documentation/places/web-service
 */

const DEFAULT_BASE_URL = 'https://places.googleapis.com/v1/places';

export type PlacesNewApiStatus =
  | 'OK'
  | 'INVALID_ARGUMENT'
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'UNAUTHENTICATED'
  | 'QUOTA_EXCEEDED'
  | 'INTERNAL_ERROR';

export interface PlacesNewLatLngLiteral {
  latitude: number;
  longitude: number;
}

export interface PlacesNewLocation {
  latitude: number;
  longitude: number;
}

export interface PlacesNewCircle {
  center: PlacesNewLocation;
  radius: number;
}

export interface PlacesNewLocationRestriction {
  circle: PlacesNewCircle;
}

export interface PlacesNewTextSearchRequest {
  textQuery: string;
  locationRestriction?: PlacesNewLocationRestriction;
  languageCode?: string;
  regionCode?: string;
  maxResultCount?: number;
  minRating?: number;
  priceLevels?: (
    | 'PRICE_LEVEL_FREE'
    | 'PRICE_LEVEL_INEXPENSIVE'
    | 'PRICE_LEVEL_MODERATE'
    | 'PRICE_LEVEL_EXPENSIVE'
    | 'PRICE_LEVEL_VERY_EXPENSIVE'
  )[];
  strictTypeFiltering?: boolean;
  includedTypes?: string[];
  excludedTypes?: string[];
}

export interface PlacesNewNearbySearchRequest {
  includedTypes: string[];
  excludedTypes?: string[];
  languageCode?: string;
  regionCode?: string;
  maxResultCount?: number;
  locationRestriction: PlacesNewLocationRestriction;
  minRating?: number;
  priceLevels?: (
    | 'PRICE_LEVEL_FREE'
    | 'PRICE_LEVEL_INEXPENSIVE'
    | 'PRICE_LEVEL_MODERATE'
    | 'PRICE_LEVEL_EXPENSIVE'
    | 'PRICE_LEVEL_VERY_EXPENSIVE'
  )[];
  strictTypeFiltering?: boolean;
}

export interface PlacesNewPlaceDetailsRequest {
  placeId: string;
  languageCode?: string;
  regionCode?: string;
  fieldMask?: string;
}

export interface PlacesNewAutocompleteRequest {
  input: string;
  locationBias?: PlacesNewLocationRestriction;
  locationRestriction?: PlacesNewLocationRestriction;
  languageCode?: string;
  regionCode?: string;
  includedPrimaryTypes?: string[];
  includedRegionCodes?: string[];
  excludedRegionCodes?: string[];
  sessionToken?: string;
}

export interface PlacesNewPhotoRequest {
  name: string;
  maxWidthPx?: number;
  maxHeightPx?: number;
  skipHttpRedirect?: boolean;
}

export interface PlacesNewPlace {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  formattedAddress: string;
  location: PlacesNewLocation;
  rating?: number;
  userRatingCount?: number;
  priceLevel?:
    | 'PRICE_LEVEL_FREE'
    | 'PRICE_LEVEL_INEXPENSIVE'
    | 'PRICE_LEVEL_MODERATE'
    | 'PRICE_LEVEL_EXPENSIVE'
    | 'PRICE_LEVEL_VERY_EXPENSIVE';
  types?: string[];
  photos?: PlacesNewPhoto[];
  reviews?: PlacesNewReview[];
  websiteUri?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  businessStatus?: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY';
  utcOffsetMinutes?: number;
  regularOpeningHours?: PlacesNewOpeningHours;
  currentOpeningHours?: PlacesNewOpeningHours;
  editorialSummary?: {
    text: string;
    languageCode: string;
  };
}

export interface PlacesNewPhoto {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: PlacesNewAuthorAttribution[];
}

export interface PlacesNewAuthorAttribution {
  displayName: string;
  uri: string;
  photoUri: string;
}

export interface PlacesNewReview {
  name: string;
  relativePublishTimeDescription: string;
  rating: number;
  text: {
    text: string;
    languageCode: string;
  };
  originalText: {
    text: string;
    languageCode: string;
  };
  authorAttribution: {
    displayName: string;
    uri: string;
    photoUri: string;
  };
  publishTime: string;
}

export interface PlacesNewOpeningHours {
  openNow: boolean;
  periods: PlacesNewOpeningHoursPeriod[];
  weekdayDescriptions: string[];
}

export interface PlacesNewOpeningHoursPeriod {
  open: {
    day: number;
    hour: number;
    minute: number;
  };
  close?: {
    day: number;
    hour: number;
    minute: number;
  };
}

export interface PlacesNewTextSearchResponse {
  places: PlacesNewPlace[];
}

export interface PlacesNewNearbySearchResponse {
  places: PlacesNewPlace[];
}

export interface PlacesNewPlaceDetailsResponse {
  place: PlacesNewPlace;
}

export interface PlacesNewAutocompleteResponse {
  suggestions: PlacesNewSuggestion[];
}

export interface PlacesNewSuggestion {
  placePrediction?: PlacesNewPlacePrediction;
  queryPrediction?: PlacesNewQueryPrediction;
}

export interface PlacesNewPlacePrediction {
  place: string;
  placeId: string;
  text: {
    text: string;
    languageCode: string;
  };
  structuredFormat: {
    mainText: {
      text: string;
      languageCode: string;
    };
    secondaryText: {
      text: string;
      languageCode: string;
    };
  };
  types: string[];
}

export interface PlacesNewQueryPrediction {
  text: {
    text: string;
    languageCode: string;
  };
  structuredFormat: {
    mainText: {
      text: string;
      languageCode: string;
    };
    secondaryText: {
      text: string;
      languageCode: string;
    };
  };
}

export interface PlacesNewPhotoResponse {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions: PlacesNewAuthorAttribution[];
}

export interface PlacesNewClientOptions {
  apiKey: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  languageCode?: string;
  regionCode?: string;
  requestInit?: RequestInit;
  timeoutMs?: number;
  retryConfig?: PlacesNewRetryConfig;
}

export interface PlacesNewRetryConfig {
  retries: number;
  delayMs: number;
  backoffFactor: number;
  retryStatuses: PlacesNewRetryStatus[];
}

export type PlacesNewRetryStatus =
  | 'UNAUTHENTICATED'
  | 'QUOTA_EXCEEDED'
  | 'INTERNAL_ERROR';

export class PlacesNewApiError extends Error {
  constructor(
    public status: PlacesNewApiStatus,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PlacesNewApiError';
  }
}

export class PlacesNewClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly defaultLanguageCode?: string;
  private readonly defaultRegionCode?: string;
  private readonly defaultRequestInit?: RequestInit;
  private readonly timeoutMs?: number;
  private readonly retryConfig: Required<PlacesNewRetryConfig>;

  constructor(options: PlacesNewClientOptions) {
    const fetchCandidate =
      options.fetchImpl ?? (globalThis.fetch as typeof fetch | undefined);

    if (!fetchCandidate) {
      throw new Error(
        'Fetch API is not available in the current environment. Provide a fetchImpl in PlacesNewClientOptions.'
      );
    }

    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.fetchImpl = fetchCandidate.bind(globalThis);
    this.defaultLanguageCode = options.languageCode;
    this.defaultRegionCode = options.regionCode;
    this.defaultRequestInit = options.requestInit;
    this.timeoutMs = options.timeoutMs;

    const retryStatuses: PlacesNewRetryStatus[] = options.retryConfig
      ?.retryStatuses ?? [
      'UNAUTHENTICATED',
      'QUOTA_EXCEEDED',
      'INTERNAL_ERROR',
    ];
    this.retryConfig = {
      retries: options.retryConfig?.retries ?? 0,
      delayMs: options.retryConfig?.delayMs ?? 1000,
      backoffFactor: options.retryConfig?.backoffFactor ?? 2,
      retryStatuses,
    };
  }

  async textSearch(
    request: PlacesNewTextSearchRequest
  ): Promise<PlacesNewTextSearchResponse> {
    return this.post<PlacesNewTextSearchResponse>(
      ':searchText',
      request as unknown as Record<string, unknown>
    );
  }

  async nearbySearch(
    request: PlacesNewNearbySearchRequest
  ): Promise<PlacesNewNearbySearchResponse> {
    return this.post<PlacesNewNearbySearchResponse>(
      ':searchNearby',
      request as unknown as Record<string, unknown>
    );
  }

  async placeDetails(
    request: PlacesNewPlaceDetailsRequest
  ): Promise<PlacesNewPlaceDetailsResponse> {
    const { placeId, ...params } = request;
    return this.get<PlacesNewPlaceDetailsResponse>(`/${placeId}`, params);
  }

  async autocomplete(
    request: PlacesNewAutocompleteRequest
  ): Promise<PlacesNewAutocompleteResponse> {
    return this.post<PlacesNewAutocompleteResponse>(
      ':autocomplete',
      request as unknown as Record<string, unknown>
    );
  }

  async getPhoto(
    request: PlacesNewPhotoRequest
  ): Promise<PlacesNewPhotoResponse> {
    const { name, ...params } = request;
    return this.get<PlacesNewPhotoResponse>(`/${name}/media`, params);
  }

  buildPhotoUrl(
    photoName: string,
    options: { maxWidthPx?: number; maxHeightPx?: number } = {}
  ): string {
    const url = new URL(`${this.baseUrl}/${photoName}/media`);
    url.searchParams.set('key', this.apiKey);

    if (options.maxWidthPx) {
      url.searchParams.set('maxWidthPx', options.maxWidthPx.toString());
    }
    if (options.maxHeightPx) {
      url.searchParams.set('maxHeightPx', options.maxHeightPx.toString());
    }

    return url.toString();
  }

  private async get<T>(
    endpoint: string,
    params: Record<string, unknown> = {}
  ): Promise<T> {
    const { retries, delayMs, backoffFactor, retryStatuses } = this.retryConfig;
    let attempt = 0;
    let delayDuration = delayMs;

    while (attempt <= retries) {
      const url = new URL(`${this.baseUrl}${endpoint}`);

      // Add query parameters
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.set(key, String(value));
        }
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
        headers: {
          'X-Goog-Api-Key': this.apiKey,
          'Content-Type': 'application/json',
          ...(this.defaultRequestInit?.headers ?? {}),
        },
      };

      try {
        const response = await this.fetchImpl(url.toString(), requestInit);

        if (!response.ok) {
          throw new Error(
            `Places API (New) network error: ${response.status} ${response.statusText}`
          );
        }

        const payload = (await response.json()) as T;
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

    throw new Error('PlacesNewClient retry attempts exhausted.');
  }

  private async post<T>(
    endpoint: string,
    body: Record<string, unknown>
  ): Promise<T> {
    const { retries, delayMs, backoffFactor, retryStatuses } = this.retryConfig;
    let attempt = 0;
    let delayDuration = delayMs;

    while (attempt <= retries) {
      const url = new URL(`${this.baseUrl}${endpoint}`);

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
        method: 'POST',
        signal: controller?.signal,
        headers: {
          'X-Goog-Api-Key': this.apiKey,
          'Content-Type': 'application/json',
          'X-Goog-FieldMask':
            'places.displayName,places.id,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.types,places.photos,places.businessStatus,places.websiteUri,places.nationalPhoneNumber',
          ...(this.defaultRequestInit?.headers ?? {}),
        },
        body: JSON.stringify(body),
      };

      try {
        const response = await this.fetchImpl(url.toString(), requestInit);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new PlacesNewApiError(
            errorData.error?.status || 'INTERNAL_ERROR',
            errorData.error?.message ||
              `HTTP ${response.status}: ${response.statusText}`,
            errorData
          );
        }

        const payload = (await response.json()) as T;
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

    throw new Error('PlacesNewClient retry attempts exhausted.');
  }

  private shouldRetryError(error: unknown): boolean {
    if (error instanceof PlacesNewApiError) {
      return this.retryConfig.retryStatuses.includes(
        error.status as PlacesNewRetryStatus
      );
    }
    return true; // Retry network errors
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
