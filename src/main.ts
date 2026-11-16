import { createCountrySearch } from './createCountrySearch.js';
import { createAppUI } from './ui.js';
import { renderCountries } from './renderCountries.js';

const elements = createAppUI();

const countrySearch = createCountrySearch({
  onResults: (countries) => {
    renderCountries(elements.results, countries);
  },

  onError: (error) => {
    elements.status.textContent = error.message;
  },

  onLoading: (loading) => {
    elements.status.textContent = loading ? 'Loading...' : '';
  },
});

elements.input.addEventListener('input', () => {
  countrySearch.search(elements.input.value);
});
