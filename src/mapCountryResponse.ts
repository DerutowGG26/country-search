export interface Country {
  name: string;
  capital: string;
  region: string;
  population: number;
  area: number;
  flag: string;
  borders: string[];
  languages: string[];
  currencies: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getString(value: unknown): string {
  return typeof value === 'string' && value.length > 0 ? value : 'Unknown';
}

function getNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function getNamedItems(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.name !== 'string') {
      return [];
    }

    return [item.name];
  });
}

function getCurrencies(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.name !== 'string') {
      return [];
    }

    const symbol =
      typeof item.symbol === 'string' && item.symbol.length > 0
        ? item.symbol
        : typeof item.code === 'string'
          ? item.code
          : '';

    return [symbol ? `${item.name} (${symbol})` : item.name];
  });
}

export function mapCountryResponse(raw: unknown): Country {
  const data = isRecord(raw) ? raw : {};

  return {
    name: getString(data.name),
    capital: getString(data.capital),
    region: getString(data.region),
    population: getNumber(data.population),
    area: getNumber(data.area),
    flag: typeof data.flag === 'string' ? data.flag : '',
    borders: getStringArray(data.borders),
    languages: getNamedItems(data.languages),
    currencies: getCurrencies(data.currencies),
  };
}
