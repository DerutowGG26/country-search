import { describe, it, expect } from 'vitest';
import { mapCountryResponse } from '../src/mapCountryResponse.ts';

describe('mapCountryResponse', () => {
  it('should map country data correctly', () => {
    const raw = {
      name: 'Spain',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      area: 505990,
      flag: '🇪🇸',
      borders: ['AND', 'FRA', 'GIB', 'PRT'],
      languages: [{ name: 'Spanish' }],
      currencies: [{ code: 'EUR', name: 'Euro', symbol: '€' }],
    };

    expect(mapCountryResponse(raw)).toEqual({
      name: 'Spain',
      capital: 'Madrid',
      region: 'Europe',
      population: 47351567,
      area: 505990,
      flag: '🇪🇸',
      borders: ['AND', 'FRA', 'GIB', 'PRT'],
      languages: ['Spanish'],
      currencies: ['Euro (€)'],
    });
  });

  it('should handle missing optional fields', () => {
    const raw = {
      name: 'Iceland',
      flag: '🇮🇸',
    };

    expect(mapCountryResponse(raw)).toEqual({
      name: 'Iceland',
      capital: 'Unknown',
      region: 'Unknown',
      population: 0,
      area: 0,
      flag: '🇮🇸',
      borders: [],
      languages: [],
      currencies: [],
    });
  });

  it('should handle multiple languages and currencies', () => {
    const raw = {
      name: 'Switzerland',
      languages: [{ name: 'German' }, { name: 'French' }, { name: 'Italian' }],
      currencies: [{ code: 'CHF', name: 'Swiss franc', symbol: 'CHF' }],
    };

    expect(mapCountryResponse(raw)).toMatchObject({
      name: 'Switzerland',
      languages: ['German', 'French', 'Italian'],
      currencies: ['Swiss franc (CHF)'],
    });
  });

  it('should return empty arrays when collections are missing', () => {
    const raw = {
      name: 'Japan',
      capital: 'Tokyo',
    };

    const result = mapCountryResponse(raw);

    expect(result.languages).toEqual([]);
    expect(result.currencies).toEqual([]);
    expect(result.borders).toEqual([]);
  });
});
