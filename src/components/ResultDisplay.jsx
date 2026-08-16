// Formats a number with 2 decimal places and thousands separators,
// e.g. 91500.5 -> "91,500.50".
function formatNumber(value, decimals = 2) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

// Shows the outcome of the last conversion: the converted amount, the
// exchange rate used, and the date that rate is from. Renders nothing
// until a result exists (i.e. before the user has clicked "Convert").
//
// The currency codes are read from `result` itself (not from live
// fromCurrency/toCurrency state) so the display always matches what was
// actually converted - even if the user changes a dropdown afterwards
// without clicking "Convert" again.
function ResultDisplay({ result }) {
  if (!result) {
    return null
  }

  const toCurrency = Object.keys(result.rates)[0]
  const convertedAmount = result.rates[toCurrency]
  const rate = convertedAmount / result.amount

  return (
    <div className="result-display">
      <p className="result-amount">
        {formatNumber(result.amount)} {result.base} = {formatNumber(convertedAmount)} {toCurrency}
      </p>
      <p className="rate-info">
        1 {result.base} = {formatNumber(rate, 4)} {toCurrency} &middot; as of {result.date}
      </p>
    </div>
  )
}

export default ResultDisplay
