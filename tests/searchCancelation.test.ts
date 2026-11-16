import { describe, it, expect, vi, afterEach } from 'vitest';
import { searchCountries } from '../src/searchCountries.ts';

describe('searchCountries cancellation', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should pass the AbortSignal to fetch', async () => {
    const controller = new AbortController();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      }),
    );

    await searchCountries('Germany', controller.signal);

    expect(fetch).toHaveBeenCalledWith('https://countries.dev/name/Germany', {
      signal: controller.signal,
    });
  });

  it('should reject with AbortError when request is cancelled', async () => {
    const controller = new AbortController();

    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string | URL | Request, options?: RequestInit) =>
          new Promise((_, reject) => {
            options?.signal?.addEventListener('abort', () => {
              reject(new DOMException('Request aborted', 'AbortError'));
            });
          }),
      ),
    );

    const request = searchCountries('Germany', controller.signal);

    controller.abort();

    await expect(request).rejects.toMatchObject({
      name: 'AbortError',
    });
  });
});
