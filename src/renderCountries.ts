import type { Country } from './mapCountryResponse.js';

export function renderCountries(
  container: HTMLDivElement,
  countries: Country[],
  onSelect: (country: Country) => void,
): void {
  container.replaceChildren();

  countries.forEach((country) => {
    const card = document.createElement('article');
    card.className = 'country-card';

    const flag = document.createElement('span');
    flag.className = 'country-flag';
    flag.textContent = country.flag || '🏳️';

    const name = document.createElement('h2');
    name.textContent = country.name;

    const capital = document.createElement('p');
    capital.textContent = `Capital: ${country.capital}`;

    const region = document.createElement('p');
    region.textContent = `Region: ${country.region}`;

    const population = document.createElement('p');
    population.textContent = `Population: ${country.population.toLocaleString()}`;

    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'View details';
    detailsButton.addEventListener('click', () => {
      onSelect(country);
    });

    card.append(flag, name, capital, region, population, detailsButton);
    container.append(card);
  });
}
