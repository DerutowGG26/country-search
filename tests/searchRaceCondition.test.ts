import { afterEach, describe, expect, it, vi } from 'vitest';
import { createCountrySearch } from '../src/createCountrySearch.ts';

describe('createCountrySearch race condition', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should cancel the previous request immediately when a new search starts', async () => {
    vi.useFakeTimers();

    const signals: AbortSignal[] = [];

    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string | URL | Request, options?: RequestInit) => {
        const signal = options?.signal;

        if (!signal) {
          throw new Error('AbortSignal is missing');
        }

        signals.push(signal);

        return new Promise((_, reject) => {
          signal.addEventListener('abort', () => {
            reject(new DOMException('Request aborted', 'AbortError'));
          });
        });
      }),
    );

    const search = createCountrySearch({
      onResults: vi.fn(),
      onError: vi.fn(),
      onLoading: vi.fn(),
      debounceDelay: 300,
    });

    search.search('Ger');

    await vi.advanceTimersByTimeAsync(300);

    expect(signals).toHaveLength(1);
    expect(signals[0]?.aborted).toBe(false);

    search.search('Germany');

    expect(signals[0]?.aborted).toBe(true);

    search.cancel();
  });
});
