// This file talks to the ExchangeRate-API free "open" endpoint
// (https://open.er-api.com). We picked this provider because it covers
// 160+ currencies (including NGN, Nigerian Naira), needs no signup or
// API key, and sends CORS headers, so the browser can call it directly.

const BASE_URL = 'https://open.er-api.com/v6'

// Gets the list of supported currency codes as an object shaped like
// { "USD": "USD", "NGN": "NGN", ... } so it's a drop-in match for how
// the dropdowns already expect data (code -> label). This API doesn't
// provide full currency names like Frankfurter did, so each code is
// used as its own label.
export async function getCurrencies() {
  try {
    const response = await fetch(`${BASE_URL}/latest/USD`)

    if (!response.ok) {
      throw new Error('Failed to fetch currency list')
    }

    const data = await response.json()
    const currencies = {}
    Object.keys(data.rates).forEach((code) => {
      currencies[code] = code
    })

    return currencies
  } catch (error) {
    console.error('getCurrencies() failed:', error.message)
    throw error
  }
}

// Converts `amount` from one currency to another using the live rate.
// Returns an object shaped like:
// { amount, base, date, rates: { [to]: convertedAmount } }
export async function convert(amount, from, to) {
  try {
    const response = await fetch(`${BASE_URL}/latest/${from}`)

    if (!response.ok) {
      throw new Error('Failed to fetch conversion rate')
    }

    const data = await response.json()
    const rate = data.rates[to]
    const date = new Date(data.time_last_update_utc).toISOString().slice(0, 10)

    return {
      amount,
      base: from,
      date,
      rates: { [to]: amount * rate },
    }
  } catch (error) {
    console.error('convert() failed:', error.message)
    throw error
  }
}
