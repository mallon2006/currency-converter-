import { useEffect, useRef, useState } from 'react'
import CurrencyFlag from './CurrencyFlag'
import { getCurrencyText } from '../utils/currencyDisplay'

// Shown pinned at the top of the list (above a divider) before the full
// alphabetical list, so the most commonly-converted currencies are one
// click away.
const POPULAR_CODES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'NGN']

// A custom currency dropdown - not a native <select>. Native
// <select><option> elements can only show plain text (browsers, Windows
// especially, strip out any HTML placed inside an <option>), so to show
// a flag image next to each currency this builds a dropdown by hand: a
// button that toggles a searchable list of options.
function CurrencySelect({ id, label, value, onChange, currencies }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef(null)
  const searchInputRef = useRef(null)

  // Close the dropdown on an outside click or the Escape key.
  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Focus the search box whenever the dropdown opens, and clear
  // whatever was searched last time whenever it closes.
  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus()
    } else {
      setSearchQuery('')
    }
  }, [isOpen])

  function handleSelect(code) {
    onChange(code)
    setIsOpen(false)
  }

  function renderOption(code) {
    return (
      <li
        key={code}
        role="option"
        aria-selected={code === value}
        className={code === value ? 'dropdown-option selected' : 'dropdown-option'}
        onClick={() => handleSelect(code)}
      >
        <CurrencyFlag code={code} />
        <span>{getCurrencyText(code)}</span>
      </li>
    )
  }

  const allCodes = Object.keys(currencies)
  const query = searchQuery.trim().toLowerCase()
  const isSearching = query.length > 0

  const labelId = `${id}-label`

  return (
    <div className="currency-select" ref={containerRef}>
      <span id={labelId} className="currency-select-label">
        {label}
      </span>

      <button
        type="button"
        id={id}
        className="dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${labelId} ${id}`}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="dropdown-trigger-content">
          <CurrencyFlag code={value} />
          <span>{getCurrencyText(value)}</span>
        </span>
        <span className="dropdown-chevron" aria-hidden="true">
          &#9662;
        </span>
      </button>

      {isOpen && (
        <div className="dropdown-panel">
          <input
            ref={searchInputRef}
            type="text"
            className="dropdown-search"
            placeholder="Search currency..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label={`Search ${label.toLowerCase()} currencies`}
          />

          <ul className="dropdown-list" role="listbox" aria-labelledby={labelId}>
            {isSearching ? (
              (() => {
                const results = allCodes.filter((code) =>
                  getCurrencyText(code).toLowerCase().includes(query),
                )
                return results.length > 0 ? (
                  results.map(renderOption)
                ) : (
                  <li className="dropdown-empty" role="presentation">
                    No currencies found
                  </li>
                )
              })()
            ) : (
              <>
                <li className="dropdown-group-label" role="presentation">
                  Popular
                </li>
                {POPULAR_CODES.filter((code) => allCodes.includes(code)).map(renderOption)}

                <li className="dropdown-group-label" role="presentation">
                  All currencies
                </li>
                {allCodes.filter((code) => !POPULAR_CODES.includes(code)).map(renderOption)}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CurrencySelect
