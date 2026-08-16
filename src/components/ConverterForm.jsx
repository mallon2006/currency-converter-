import CurrencySelect from './CurrencySelect'

// The amount input, the "From"/"To" dropdowns (with a swap button between
// them), and the convert button.
function ConverterForm({
  currencies,
  amount,
  onAmountChange,
  amountError,
  fromCurrency,
  toCurrency,
  onFromChange,
  onToChange,
  onSwap,
  onConvert,
  converting,
}) {
  return (
    <div className="converter-form">
      <div className="amount-field">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
        />
        {amountError && <p className="field-error">{amountError}</p>}
      </div>

      <div className="currency-row">
        <CurrencySelect
          id="from-currency"
          label="From"
          value={fromCurrency}
          onChange={onFromChange}
          currencies={currencies}
        />

        <button
          type="button"
          className="swap-button"
          onClick={onSwap}
          aria-label="Swap From and To currencies"
        >
          &#8646;
        </button>

        <CurrencySelect
          id="to-currency"
          label="To"
          value={toCurrency}
          onChange={onToChange}
          currencies={currencies}
        />
      </div>

      <button type="button" className="convert-button" onClick={onConvert} disabled={converting}>
        {converting ? 'Converting...' : 'Convert'}
      </button>
    </div>
  )
}

export default ConverterForm
