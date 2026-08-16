// A labelled dropdown of currency codes. Used twice in ConverterForm -
// once for "From" and once for "To" - so the currency list logic only
// has to be written once.
function CurrencySelect({ id, label, value, onChange, currencies }) {
  return (
    <div className="currency-select">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {Object.entries(currencies).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default CurrencySelect
