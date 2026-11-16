# Country Search — Design Document

## 1. Project Overview

Country Search is a web application that allows users to search for countries by name using the Countries API.

The application displays country information, including:

- Name
- Flag
- Capital
- Region
- Population
- Area
- Border countries
- Languages
- Currencies

The application is built with TypeScript and uses the Fetch API for HTTP requests.

## 2. Project Architecture

The project separates responsibilities into independent modules:

| File                      | Responsibility                                      |
| ------------------------- | --------------------------------------------------- |
| `main.ts`                 | Application entry point and UI coordination         |
| `ui.ts`                   | Creates the main DOM elements                       |
| `debounce.ts`             | Implements the debounce utility                     |
| `searchCountries.ts`      | Handles API requests and HTTP errors                |
| `mapCountryResponse.ts`   | Transforms API responses into application data      |
| `createCountrySearch.ts`  | Controls searching, cancellation and request states |
| `renderCountries.ts`      | Renders country search results                      |
| `renderCountryDetails.ts` | Renders detailed country information                |
| `styles.css`              | Contains application styles                         |

Tests are located in the `tests` directory.

## 3. Debounce Implementation

The application uses a custom debounce function with a delay of 300 milliseconds.

Debouncing prevents unnecessary API requests while the user is typing.

When the input changes, the previous timer is cleared. A new request is scheduled only after the user stops typing for the specified delay.

This reduces the number of network requests and improves application performance.

## 4. Request Cancellation

The application uses `AbortController` to cancel outdated requests.

When the search input changes:

1. The current request is cancelled immediately.
2. The request identifier is incremented.
3. A new search is scheduled using debounce.
4. Only the latest valid request can update the results.

An additional request identifier check prevents outdated responses from updating the interface, even if an earlier request completes unexpectedly.

The application also uses `AbortSignal.timeout()` and `AbortSignal.any()` to combine user cancellation with a request timeout.

Different errors are handled separately:

- `AbortError` — ignored because the request was intentionally cancelled.
- `TimeoutError` — displayed as a timeout error.
- `HttpError` — represents an unsuccessful HTTP response.
- Network errors — displayed to the user.

## 5. Data Mapping

The `mapCountryResponse` function transforms raw API data into a consistent `Country` object.

It is a pure function:

- It does not modify the original response.
- It does not access the DOM.
- It does not perform network requests.
- It returns the same output for the same input.

This makes the function predictable and easy to test.

## 6. Algorithm Complexity

The main data mapping operations have linear time complexity.

For an array containing `n` countries, mapping the API response requires:

- Time complexity: O(n)
- Auxiliary space complexity: O(n)

Each country is processed once, and a new array of mapped country objects is created.

The debounce utility uses O(1) auxiliary space because it stores only one timer reference and the latest callback arguments.

## 7. Error Handling

The application handles several situations:

- Empty search input.
- No countries found.
- HTTP errors.
- Network failures.
- Request timeouts.
- Cancelled requests.

A retry button allows users to repeat a failed search without manually entering the query again.

## 8. Clean Code Principles

The project follows several Clean Code principles:

- **Single Responsibility Principle:** Each module has a clearly defined responsibility.
- **Separation of Concerns:** API logic, data mapping and DOM rendering are kept separate.
- **Meaningful Naming:** Functions and variables use descriptive names.
- **Small Functions:** Functions focus on specific tasks.
- **Type Safety:** TypeScript interfaces and types define application data.
- **Testability:** Core logic is separated from the DOM and external network dependencies.

## 9. Testing Strategy

The project uses Vitest for automated testing.

Tests cover:

- Debounce behavior.
- API requests and HTTP errors.
- Country response mapping.
- Request cancellation.
- Race conditions.
- Country card rendering.
- Country details rendering.

External API requests are mocked in tests to ensure that the test suite does not depend on network availability.

## 10. Technologies

- TypeScript
- JavaScript ES Modules
- HTML
- CSS
- Fetch API
- AbortController
- Vitest
- ESLint
- Prettier
- Husky
- lint-staged
