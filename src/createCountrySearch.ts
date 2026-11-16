import { debounce } from './debounce.js';
import { mapCountryResponse, type Country } from './mapCountryResponse.js';
import { searchCountries } from './searchCountries.js';

interface CountrySearchOptions {
  onResults: (countries: Country[]) => void;
  onError: (error: Error) => void;
  onLoading: (loading: boolean) => void;
  debounceDelay?: number;
  timeoutMs?: number;
}

interface CountrySearch {
  search: (query: string) => void;
  cancel: () => void;
}

export function createCountrySearch({
  onResults,
  onError,
  onLoading,
  debounceDelay = 300,
  timeoutMs = 10000,
}: CountrySearchOptions): CountrySearch {
  let controller: AbortController | null = null;
  let requestId = 0;

  const runSearch = debounce(async (query: string, currentRequestId: number) => {
    if (currentRequestId !== requestId) {
      return;
    }

    const currentController = new AbortController();
    controller = currentController;

    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    const combinedSignal = AbortSignal.any([currentController.signal, timeoutSignal]);

    onLoading(true);

    try {
      const rawCountries = await searchCountries(query, combinedSignal);

      if (currentRequestId !== requestId) {
        return;
      }

      const countries = rawCountries.map(mapCountryResponse);

      onResults(countries);
    } catch (error) {
      if (currentRequestId !== requestId) {
        return;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      if (error instanceof Error && error.name === 'TimeoutError') {
        onError(new Error('The request timed out. Please try again.'));
        return;
      }

      onError(error instanceof Error ? error : new Error('Something went wrong.'));
    } finally {
      if (currentRequestId === requestId) {
        controller = null;
        onLoading(false);
      }
    }
  }, debounceDelay);

  function search(query: string): void {
    requestId += 1;

    if (controller) {
      controller.abort();
      controller = null;
    }

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      onResults([]);
      onLoading(false);
      return;
    }

    runSearch(normalizedQuery, requestId);
  }

  function cancel(): void {
    requestId += 1;

    if (controller) {
      controller.abort();
      controller = null;
    }

    onLoading(false);
  }

  return {
    search,
    cancel,
  };
}
