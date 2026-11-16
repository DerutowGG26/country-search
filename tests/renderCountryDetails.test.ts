// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import { renderCountryDetails } from '../src/renderCountryDetails.js';
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

describe('renderCountryDetails', () => {
  it('should display country information', () => {
    const container = document.createElement('div');

    renderCountryDetails(container, mockCountry, vi.fn());

    expect(container.textContent).toContain('Germany');
    expect(container.textContent).toContain('Berlin');
    expect(container.textContent).toContain('Europe');
    expect(container.textContent).toContain('83,200,000');
    expect(container.textContent).toContain('357,022 km²');
    expect(container.textContent).toContain('Austria, Belgium, Poland');
    expect(container.textContent).toContain('German');
    expect(container.textContent).toContain('Euro (€)');
  });

  it('should call onBack when the back button is clicked', () => {
    const container = document.createElement('div');
    const onBack = vi.fn();

    renderCountryDetails(container, mockCountry, onBack);

    const backButton = container.querySelector('button');

    expect(backButton).not.toBeNull();

    backButton?.click();

    expect(onBack).toHaveBeenCalledOnce();
  });

  it('should clear previous content before rendering', () => {
    const container = document.createElement('div');
    container.textContent = 'Previous content';

    renderCountryDetails(container, mockCountry, vi.fn());

    expect(container.textContent).not.toContain('Previous content');
    expect(container.textContent).toContain('Germany');
  });
});
