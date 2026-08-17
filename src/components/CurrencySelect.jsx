import { useEffect, useRef, useState } from 'react'
import CurrencyFlag from './CurrencyFlag'
import { getCurrencyText } from '../utils/currencyDisplay'

// A custom currency dropdown - not a native <select>. Native
// <select><option> elements can only show plain text (browsers, Windows
// especially, strip out any HTML placed inside an <option>), so to show
// a flag image next to each currency this builds a dropdown by hand: a
// button that toggles a list of options.
function CurrencySelect({ id, label, value, onChange, currencies }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

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

  function handleSelect(code) {
    onChange(code)
    setIsOpen(false)
  }

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
        <ul className="dropdown-list" role="listbox" aria-labelledby={labelId}>
          {Object.keys(currencies).map((code) => (
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
          ))}
        </ul>
      )}
    </div>
  )
}

export default CurrencySelect
