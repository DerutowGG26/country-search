export interface AppElements {
  input: HTMLInputElement;
  status: HTMLParagraphElement;
  results: HTMLDivElement;
  retryButton: HTMLButtonElement;
  details: HTMLDivElement;
}

export function createAppUI(): AppElements {
  const main = document.createElement('main');
  main.className = 'container';

  const heading = document.createElement('h1');
  heading.textContent = 'Country Search';

  const description = document.createElement('p');
  description.textContent = 'Search for countries by name.';

  const label = document.createElement('label');
  label.htmlFor = 'country-search';
  label.textContent = 'Country name';

  const input = document.createElement('input');
  input.id = 'country-search';
  input.type = 'search';
  input.placeholder = 'Enter a country name...';
  input.autocomplete = 'off';

  const status = document.createElement('p');
  status.className = 'status';
  status.setAttribute('aria-live', 'polite');

  const retryButton = document.createElement('button');
  retryButton.textContent = 'Try again';
  retryButton.hidden = true;

  const results = document.createElement('div');
  results.className = 'results';

  const details = document.createElement('div');
  details.className = 'details';
  details.hidden = true;

  main.append(heading, description, label, input, status, retryButton, results, details);
  document.body.append(main);

  return {
    input,
    status,
    results,
    retryButton,
    details,
  };
}
