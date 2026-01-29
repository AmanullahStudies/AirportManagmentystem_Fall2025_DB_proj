import { useState, useRef, useContext, createContext } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../assets/CssAll/Componets/Navbar/Navbar.module.css'

// Global dropdown context to manage state across all dropdowns
const DropdownContext = createContext()

export function DropdownProvider({ children }) {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [closingDropdown, setClosingDropdown] = useState(null)
  const closeTimerRef = useRef(null)

  return (
    <DropdownContext.Provider value={{ activeDropdown, setActiveDropdown, closingDropdown, setClosingDropdown, closeTimerRef }}>
      {children}
    </DropdownContext.Provider>
  )
}

export default function NavDropDowns({ title, optionsObj }) {
  const [isOpen, setIsOpen] = useState(false)
  const context = useContext(DropdownContext)
  const timeoutRef = useRef(null)

  // Fallback if context not provided
  const { activeDropdown, setActiveDropdown, closingDropdown, setClosingDropdown, closeTimerRef } = context || {
    activeDropdown: null,
    setActiveDropdown: () => {},
    closingDropdown: null,
    setClosingDropdown: () => {},
    closeTimerRef: { current: null }
  }

  const handleMouseEnter = () => {
    // Cancel any pending close
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    
    setIsOpen(true)
    if (setActiveDropdown) setActiveDropdown(title)
    if (setClosingDropdown) setClosingDropdown(null)
  }

  const handleMouseLeave = () => {
    // Don't close immediately - wait 2 seconds
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      if (setActiveDropdown) setActiveDropdown(null)
    }, 2000)
  }

  const handleClick = (e) => {
    e.preventDefault()
    // Click immediately closes other dropdowns
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setIsOpen(true)
    if (setActiveDropdown) setActiveDropdown(title)
  }

  return (
    <div 
      className={styles.dropdown} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <button className={styles.dropdownBtn} onClick={handleClick}>
        {title}
      </button>
      {isOpen && (
        <div className={styles.dropdownContent}>
          {optionsObj?.map((option, index) => (
            <Link key={index} to={option.link} className={styles.dropdownLink}>
              {option.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
