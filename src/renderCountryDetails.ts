import type { Country } from './mapCountryResponse.js';

export function renderCountryDetails(
  container: HTMLDivElement,
  country: Country,
  onBack: () => void,
): void {
  container.replaceChildren();

  const backButton = document.createElement('button');
  backButton.textContent = 'Back to results';
  backButton.addEventListener('click', onBack);

  const heading = document.createElement('h2');
  heading.textContent = `${country.flag} ${country.name}`;

  const capital = document.createElement('p');
  capital.textContent = `Capital: ${country.capital}`;

  const region = document.createElement('p');
  region.textContent = `Region: ${country.region}`;

  const population = document.createElement('p');
  population.textContent = `Population: ${country.population.toLocaleString()}`;

  const area = document.createElement('p');
  area.textContent = `Area: ${country.area.toLocaleString()} km²`;

  const borders = document.createElement('p');
  borders.textContent = `Borders: ${country.borders.join(', ') || 'None'}`;

  const languages = document.createElement('p');
  languages.textContent = `Languages: ${country.languages.join(', ') || 'Unknown'}`;

  const currencies = document.createElement('p');
  currencies.textContent = `Currencies: ${country.currencies.join(', ') || 'Unknown'}`;

  container.append(
    backButton,
    heading,
    capital,
    region,
    population,
    area,
    borders,
    languages,
    currencies,
  );
}
