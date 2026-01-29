// context/NavbarContext.js
import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const NavbarContext = createContext()

export const NavbarProvider = ({ children }) => {
  const [showNav, setShowNav] = useState(true)
  return <NavbarContext.Provider value={{ showNav, setShowNav }}>{children}</NavbarContext.Provider>
}

// Add prop validation
NavbarProvider.propTypes = {
  children: PropTypes.node.isRequired
}
