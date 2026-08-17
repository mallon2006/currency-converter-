import { getFlagUrl } from '../utils/currencyDisplay'

// A small flag image for a currency code. Renders nothing if the
// currency has no sensible country flag (e.g. XAF, XOF - see
// getFlagUrl), or if the image fails to load for any other reason, so a
// broken-image icon never shows up in place of it.
function CurrencyFlag({ code }) {
  const url = getFlagUrl(code)

  if (!url) {
    return null
  }

  return (
    <img
      src={url}
      alt=""
      width={24}
      height={18}
      className="currency-flag"
      onError={(event) => {
        event.target.style.display = 'none'
      }}
    />
  )
}

export default CurrencyFlag
