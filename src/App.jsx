import { useEffect, useState } from 'react'
import { getCurrencies, convert } from './api/exchangeRates'
import ConverterForm from './components/ConverterForm'
import ResultDisplay from './components/ResultDisplay'
import './App.css'

// Checks the amount typed by the user. Returns an error message string
// if it's invalid, or null if it's fine to convert.
function validateAmount(value) {
  if (value.trim() === '') {
    return 'Please enter an amount.'
  }
  if (Number.isNaN(Number(value))) {
    return 'Please enter a valid number.'
  }
  if (Number(value) <= 0) {
    return 'Amount must be greater than zero.'
  }
  return null
}

function App() {
  const [currencies, setCurrencies] = useState({})
  const [amount, setAmount] = useState('100')
  const [amountError, setAmountError] = useState(null)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [converting, setConverting] = useState(false)
  const [convertError, setConvertError] = useState(null)
  // Bumped on every successful conversion so ResultDisplay remounts and
  // its entrance animation replays each time, not just the first time.
  const [resultKey, setResultKey] = useState(0)

  // Load the list of supported currencies once, when the app first mounts.
  useEffect(() => {
    getCurrencies()
      .then((data) => setCurrencies(data))
      .catch(() => setError('Could not load the currency list. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  // Clears the validation message as soon as the user edits the amount,
  // so they're not stuck looking at a stale error while retyping.
  function handleAmountChange(value) {
    setAmount(value)
    if (amountError) {
      setAmountError(null)
    }
  }

  // Validates the amount, then fetches the live rate and stores the
  // result to display. From and To are allowed to be the same currency -
  // the API simply returns a 1:1 rate, so the result equals the input.
  async function handleConvert() {
    const validationMessage = validateAmount(amount)
    if (validationMessage) {
      setAmountError(validationMessage)
      return
    }

    setConverting(true)
    setConvertError(null)
    try {
      const data = await convert(Number(amount), fromCurrency, toCurrency)
      setResult(data)
      setResultKey((key) => key + 1)
    } catch {
      // convert() already logs the details to the console.
      setConvertError('Could not get the exchange rate. Please check your connection and try again.')
    } finally {
      setConverting(false)
    }
  }

  // Flips the From and To currencies.
  function handleSwap() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <div className="app-container">
      <div className="card">
        <h1>Currency Converter</h1>

        {loading && <p>Loading currencies...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            <ConverterForm
              currencies={currencies}
              amount={amount}
              onAmountChange={handleAmountChange}
              amountError={amountError}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              onFromChange={setFromCurrency}
              onToChange={setToCurrency}
              onSwap={handleSwap}
              onConvert={handleConvert}
              converting={converting}
            />
            {convertError && <p className="error">{convertError}</p>}
            <ResultDisplay key={resultKey} result={result} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
