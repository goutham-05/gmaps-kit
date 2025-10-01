import { act, renderTestHook } from '../../test-utils/render-hook';
import { usePlaces } from '../usePlaces';
import type { UsePlacesOptions } from '../usePlaces';
import { PlacesClient, PlacesApiError } from '@gmaps-kit/core';

describe('usePlaces', () => {
  const fetchMock = jest.fn();

  const baseOptions: UsePlacesOptions = {
    apiKey: 'test-key',
    fetchImpl: fetchMock,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({ status: 'OK', candidates: [] }),
    });
  });

  it('runs findPlaceFromText and updates state', async () => {
    const { result, unmount } = renderTestHook(
      (options: UsePlacesOptions) => usePlaces(options),
      baseOptions
    );

    await act(async () => {
      await result.current.findPlaceFromText({
        input: 'coffee',
        inputType: 'textquery',
      });
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.lastOperation).toBe('findPlaceFromText');

    unmount();
  });

  it('surfaces PlacesApiError responses', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({
        status: 'REQUEST_DENIED',
        error_message: 'Invalid key',
      }),
    });

    const { result, unmount } = renderTestHook(
      (options: UsePlacesOptions) => usePlaces(options),
      baseOptions
    );

    let thrown: unknown;
    await act(async () => {
      try {
        await result.current.textSearch({ query: 'pizza' });
      } catch (error) {
        thrown = error;
      }
    });

    expect(thrown).toBeInstanceOf(PlacesApiError);
    expect(result.current.error).toBeInstanceOf(PlacesApiError);
    expect(result.current.lastOperation).toBe('textSearch');

    unmount();
  });

  it('handles next page helpers without waiting for delay', async () => {
    const delaySpy = jest
      .spyOn(PlacesClient.prototype as any, 'delay')
      .mockImplementation(() => Promise.resolve());

    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => ({
        status: 'OK',
        results: [],
        next_page_token: undefined,
      }),
    });

    const { result, unmount } = renderTestHook(
      (options: UsePlacesOptions) => usePlaces(options),
      {
        ...baseOptions,
        apiKey: 'paging-key',
      }
    );

    await act(async () => {
      await result.current.textSearchNextPage('token', 0);
    });

    expect(fetchMock).toHaveBeenCalled();
    expect(result.current.lastOperation).toBe('textSearchNextPage');

    delaySpy.mockRestore();
    unmount();
  });
});
