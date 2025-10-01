import { useState, useCallback } from 'react';
import {
  createAutocomplete,
  createSearchBox,
  getSelectedPlace,
  addPlaceChangedListener,
  addPlacesChangedListener,
  setAutocompleteTypes,
  setAutocompleteBounds,
  setAutocompleteComponentRestrictions,
  clearAutocomplete,
  focusAutocomplete,
} from '@gmaps-kit/core';

export interface PlaceResult {
  placeId?: string;
  name?: string;
  address?: string;
  location?: google.maps.LatLngLiteral;
  rating?: number;
  priceLevel?: number;
  types?: string[];
  photos?: google.maps.places.PlacePhoto[];
  reviews?: google.maps.places.PlaceReview[];
}

export interface UsePlacesOptions {
  input: HTMLInputElement;
  types?: string[];
  bounds?: google.maps.LatLngBounds;
  componentRestrictions?: google.maps.GeocoderComponentRestrictions;
  onPlaceChanged?: (place: google.maps.places.PlaceResult) => void;
  onPlacesChanged?: (places: google.maps.places.PlaceResult[]) => void;
}

export interface UsePlacesReturn {
  isLoading: boolean;
  error: Error | null;
  autocomplete: google.maps.places.Autocomplete | null;
  searchBox: google.maps.places.SearchBox | null;
  selectedPlace: google.maps.places.PlaceResult | null;
  places: google.maps.places.PlaceResult[];
  createAutocompleteInstance: (
    options: UsePlacesOptions
  ) => google.maps.places.Autocomplete;
  createSearchBoxInstance: (
    input: HTMLInputElement,
    map: google.maps.Map
  ) => google.maps.places.SearchBox;
  getSelectedPlaceFromAutocomplete: (
    autocomplete: google.maps.places.Autocomplete
  ) => google.maps.places.PlaceResult | null;
  setAutocompleteTypes: (
    autocomplete: google.maps.places.Autocomplete,
    types: string[]
  ) => void;
  setAutocompleteBounds: (
    autocomplete: google.maps.places.Autocomplete,
    bounds: google.maps.LatLngBounds
  ) => void;
  setAutocompleteComponentRestrictions: (
    autocomplete: google.maps.places.Autocomplete,
    restrictions: google.maps.GeocoderComponentRestrictions
  ) => void;
  clearAutocompleteInput: (
    autocomplete: google.maps.places.Autocomplete
  ) => void;
  focusAutocompleteInput: (
    autocomplete: google.maps.places.Autocomplete
  ) => void;
  addPlaceChangedListenerToAutocomplete: (
    autocomplete: google.maps.places.Autocomplete,
    callback: (place: google.maps.places.PlaceResult) => void
  ) => void;
  addPlacesChangedListenerToSearchBox: (
    searchBox: google.maps.places.SearchBox,
    callback: (places: google.maps.places.PlaceResult[]) => void
  ) => void;
}

export function usePlaces(): UsePlacesReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);

  const handleAsyncOperation = useCallback(
    async <T>(operation: () => T): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = operation();
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Places operation failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const createAutocompleteInstance = useCallback(
    (options: UsePlacesOptions): google.maps.places.Autocomplete => {
      return handleAsyncOperation(() => {
        const autocompleteInstance = createAutocomplete({
          input: options.input,
          types: options.types,
          bounds: options.bounds,
          componentRestrictions: options.componentRestrictions,
        });

        if (options.onPlaceChanged) {
          addPlaceChangedListener(autocompleteInstance, (place) => {
            setSelectedPlace(place);
            options.onPlaceChanged?.(place);
          });
        }

        setAutocomplete(autocompleteInstance);
        return autocompleteInstance;
      });
    },
    [handleAsyncOperation]
  );

  const createSearchBoxInstance = useCallback(
    (
      input: HTMLInputElement,
      map: google.maps.Map
    ): google.maps.places.SearchBox => {
      return handleAsyncOperation(() => {
        const searchBoxInstance = createSearchBox(input, map);
        setSearchBox(searchBoxInstance);
        return searchBoxInstance;
      });
    },
    [handleAsyncOperation]
  );

  const getSelectedPlaceFromAutocomplete = useCallback(
    (
      autocompleteInstance: google.maps.places.Autocomplete
    ): google.maps.places.PlaceResult | null => {
      return handleAsyncOperation(() => {
        const place = getSelectedPlace(autocompleteInstance);
        setSelectedPlace(place);
        return place;
      });
    },
    [handleAsyncOperation]
  );

  const setAutocompleteTypesToInstance = useCallback(
    (
      autocompleteInstance: google.maps.places.Autocomplete,
      types: string[]
    ) => {
      handleAsyncOperation(() => {
        setAutocompleteTypes(autocompleteInstance, types);
      });
    },
    [handleAsyncOperation]
  );

  const setAutocompleteBoundsToInstance = useCallback(
    (
      autocompleteInstance: google.maps.places.Autocomplete,
      bounds: google.maps.LatLngBounds
    ) => {
      handleAsyncOperation(() => {
        setAutocompleteBounds(autocompleteInstance, bounds);
      });
    },
    [handleAsyncOperation]
  );

  const setAutocompleteComponentRestrictionsToInstance = useCallback(
    (
      autocompleteInstance: google.maps.places.Autocomplete,
      restrictions: google.maps.GeocoderComponentRestrictions
    ) => {
      handleAsyncOperation(() => {
        setAutocompleteComponentRestrictions(
          autocompleteInstance,
          restrictions
        );
      });
    },
    [handleAsyncOperation]
  );

  const clearAutocompleteInput = useCallback(
    (autocompleteInstance: google.maps.places.Autocomplete) => {
      handleAsyncOperation(() => {
        clearAutocomplete(autocompleteInstance);
      });
    },
    [handleAsyncOperation]
  );

  const focusAutocompleteInput = useCallback(
    (autocompleteInstance: google.maps.places.Autocomplete) => {
      handleAsyncOperation(() => {
        focusAutocomplete(autocompleteInstance);
      });
    },
    [handleAsyncOperation]
  );

  const addPlaceChangedListenerToAutocomplete = useCallback(
    (
      autocompleteInstance: google.maps.places.Autocomplete,
      callback: (place: google.maps.places.PlaceResult) => void
    ) => {
      handleAsyncOperation(() => {
        addPlaceChangedListener(autocompleteInstance, (place) => {
          setSelectedPlace(place);
          callback(place);
        });
      });
    },
    [handleAsyncOperation]
  );

  const addPlacesChangedListenerToSearchBox = useCallback(
    (
      searchBoxInstance: google.maps.places.SearchBox,
      callback: (places: google.maps.places.PlaceResult[]) => void
    ) => {
      handleAsyncOperation(() => {
        addPlacesChangedListener(searchBoxInstance, (places) => {
          setPlaces(places);
          callback(places);
        });
      });
    },
    [handleAsyncOperation]
  );

  return {
    isLoading,
    error,
    autocomplete,
    searchBox,
    selectedPlace,
    places,
    createAutocompleteInstance,
    createSearchBoxInstance,
    getSelectedPlaceFromAutocomplete,
    setAutocompleteTypes: setAutocompleteTypesToInstance,
    setAutocompleteBounds: setAutocompleteBoundsToInstance,
    setAutocompleteComponentRestrictions:
      setAutocompleteComponentRestrictionsToInstance,
    clearAutocompleteInput,
    focusAutocompleteInput,
    addPlaceChangedListenerToAutocomplete,
    addPlacesChangedListenerToSearchBox,
  };
}
