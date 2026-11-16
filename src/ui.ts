export interface AppElements {
  input: HTMLInputElement;
  status: HTMLParagraphElement;
  results: HTMLDivElement;
}

export function creatAppUI(): AppElements {
  const main = document.createElement('main');
  main.className = 'container';

  const header = document.createElement('h1');
  header.textContent = 'Country Search';

  const description = document.createElement('p');
  description.textContent = 'Search for countries by name.';

  const label = document.createElement('label');
  label.htmlFor = 'country-search';
  label.textContent = 'Country Name:';

  const input = document.createElement('input');
  input.id = 'country-search';
  input.type = 'search';
  input.placeholder = 'entry a country name';
  input.autocomplete = 'off';

  const status = document.createElement('p');
  status.className = 'status';
  status.setAttribute('aria-live', 'polite');

  const results = document.createElement('div');
  results.className = 'results';

  main.append(header, description, label, input, status, results);
  document.body.append(main);

  return {
    input,
    status,
    results,
  };
}
