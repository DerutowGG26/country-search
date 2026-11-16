import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchCountries } from '../src/searchCountries.ts';

function createResponse(status: number, data: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

describe('searchCountries', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should fetch countries and return the response data', async () => {
    const countries = [{ name: 'Spain' }];

    fetchMock.mockResolvedValue(createResponse(200, countries));

    const controller = new AbortController();

    const result = await searchCountries('spain', controller.signal);

    expect(result).toEqual(countries);
    expect(fetchMock).toHaveBeenCalledWith('https://countries.dev/name/spain', {
      signal: controller.signal,
    });
  });

  it('should encode the search query in the URL', async () => {
    fetchMock.mockResolvedValue(createResponse(200, []));

    const controller = new AbortController();

    await searchCountries('south korea', controller.signal);

    expect(fetchMock).toHaveBeenCalledWith('https://countries.dev/name/south%20korea', {
      signal: controller.signal,
    });
  });

  it('should return an empty array when response status is 404', async () => {
    fetchMock.mockResolvedValue(createResponse(404, null));

    const controller = new AbortController();

    const result = await searchCountries('unknown', controller.signal);

    expect(result).toEqual([]);
  });

  it.each([400, 500, 503])('should throw HttpError when response status is %i', async (status) => {
    fetchMock.mockResolvedValue(createResponse(status, null));

    const controller = new AbortController();

    await expect(searchCountries('spain', controller.signal)).rejects.toMatchObject({
      name: 'HttpError',
      status,
    });
  });

  it('should propagate network errors', async () => {
    const networkError = new TypeError('Failed to fetch');

    fetchMock.mockRejectedValue(networkError);

    const controller = new AbortController();

    await expect(searchCountries('spain', controller.signal)).rejects.toBe(networkError);
  });
});
