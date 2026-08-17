import { CURRENCY_NAMES } from '../data/currencyNames'

// A currency code's first two letters are usually its country's ISO code
// (e.g. "US" in "USD"), which flagcdn.com's image URLs are built from.
// EUR is the one common exception - it needs the "eu" flag, not a single
// country.
const COUNTRY_CODE_OVERRIDES = {
  EUR: 'eu',
}

// ISO 4217 reserves currency codes starting with "X" for ones not tied to
// a single country - precious metals, IMF Special Drawing Rights, shared
// regional currencies like XAF/XOF, etc. None of those have a real flag,
// so we deliberately skip generating one rather than show something wrong.
function hasNoCountryFlag(code) {
  return code.startsWith('X')
}

// Returns the lowercase 2-letter country code flagcdn.com expects for a
// currency code, or null when there isn't one that makes sense.
export function getCountryCode(code) {
  if (COUNTRY_CODE_OVERRIDES[code]) {
    return COUNTRY_CODE_OVERRIDES[code]
  }
  if (hasNoCountryFlag(code) || code.length < 2) {
    return null
  }
  return code.slice(0, 2).toLowerCase()
}

// Returns a small flag image URL for a currency code, or null if there
// isn't a sensible one (see getCountryCode above).
export function getFlagUrl(code) {
  const countryCode = getCountryCode(code)
  return countryCode ? `https://flagcdn.com/24x18/${countryCode}.png` : null
}

// The text part of a currency's label, e.g. "USD — US Dollar", or just
// the code if we don't have a name for it.
export function getCurrencyText(code) {
  const name = CURRENCY_NAMES[code]
  return name ? `${code} — ${name}` : code
}
