// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import { renderCountries } from '../src/renderCountries.js';
import type { Country } from '../src/mapCountryResponse.js';

const mockCountry: Country = {
  name: 'Germany',
  capital: 'Berlin',
  region: 'Europe',
  population: 83200000,
  area: 357022,
  flag: '🇩🇪',
  borders: ['Austria', 'Belgium', 'Poland'],
  languages: ['German'],
  currencies: ['Euro (€)'],
};

describe('renderCountries', () => {
  it('should display country information', () => {
    const container = document.createElement('div');

    renderCountries(container, [mockCountry], vi.fn());

    expect(container.textContent).toContain('Germany');
    expect(container.textContent).toContain('Berlin');
    expect(container.textContent).toContain('Europe');
    expect(container.textContent).toContain('83,200,000');
  });

  it('should call onSelect when View details is clicked', () => {
    const container = document.createElement('div');
    const onSelect = vi.fn();

    renderCountries(container, [mockCountry], onSelect);

    const button = container.querySelector('button');

    expect(button).not.toBeNull();
    expect(button?.textContent).toBe('View details');

    button?.click();

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(mockCountry);
  });

  it('should clear previous cards before rendering', () => {
    const container = document.createElement('div');
    container.textContent = 'Previous content';

    renderCountries(container, [mockCountry], vi.fn());

    expect(container.textContent).not.toContain('Previous content');
    expect(container.textContent).toContain('Germany');
  });

  it('should render an empty container when there are no countries', () => {
    const container = document.createElement('div');

    renderCountries(container, [mockCountry], vi.fn());
    renderCountries(container, [], vi.fn());

    expect(container.children).toHaveLength(0);
  });
});
