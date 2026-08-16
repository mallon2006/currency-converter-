# Currency Converter

A single-page currency converter built with React and Vite. Enter an amount,
pick a "From" and "To" currency, and get a live converted result.

## Running it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Project structure

```
src/
  App.jsx                  - holds all state, orchestrates the app
  App.css                  - all styling
  components/
    CurrencySelect.jsx     - a labelled currency dropdown, reused for From/To
    ConverterForm.jsx      - amount input + dropdowns + swap + convert button
    ResultDisplay.jsx      - shows the converted amount, rate, and date
  api/
    exchangeRates.js       - all network calls live here (getCurrencies, convert)
```

## Data source

Rates and the currency list come from [ExchangeRate-API's free "open"
endpoint](https://www.exchangerate-api.com/docs/free) (`open.er-api.com`).
No signup or API key is needed, and it sends CORS headers so the browser can
call it directly. It covers 160+ currencies (including NGN), and rates
refresh roughly once every 24 hours.

(An earlier version of this project used the Frankfurter API, which is
ECB-based and only covers ~30 currencies - not enough once NGN support was
needed, so it was replaced.)
