import { createCountrySearch } from './createCountrySearch.js';
import { createAppUI } from './ui.js';
import { renderCountries } from './renderCountries.js';
import { renderCountryDetails } from './renderCountryDetails.js';

const elements = createAppUI();

const countrySearch = createCountrySearch({
  onResults: (countries) => {
    elements.results.hidden = false;
    elements.details.hidden = true;

    renderCountries(elements.results, countries, (country) => {
      elements.results.hidden = true;
      elements.details.hidden = false;

      renderCountryDetails(elements.details, country, () => {
        elements.details.hidden = true;
        elements.results.hidden = false;
      });
    });

    if (!elements.input.value.trim()) {
      elements.status.textContent = '';
      return;
    }

    elements.status.textContent = countries.length === 0 ? 'No countries found.' : '';

    elements.retryButton.hidden = true;
  },

  onError: (error) => {
    elements.status.textContent = error.message;
    elements.retryButton.hidden = false;
  },

  onLoading: (loading) => {
    if (loading) {
      elements.status.textContent = 'Loading...';
      elements.retryButton.hidden = true;
    }
  },
});

elements.input.addEventListener('input', () => {
  elements.retryButton.hidden = true;
  countrySearch.search(elements.input.value);
});

elements.retryButton.addEventListener('click', () => {
  countrySearch.search(elements.input.value);
});
