import React, { createContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'

// Create the context
const AppContext = createContext()

// Create the provider component
export const AppProvider = ({ children }) => {
  // Example: Virtual Date State
  const [virtualDate, setVirtualDate] = useState(null)

  // Fetch virtual date on component mount
  useEffect(() => {
    const fetchVirtualDate = async () => {
      try {
        const date = await window.api.getVirtualDate()
        setVirtualDate(date)
      } catch (error) {
        console.error('Error fetching virtual date:', error)
        toast.error('Failed to fetch virtual date')
      }
    }

    fetchVirtualDate()
  }, [])

  // Function to update the virtual date
  const updateVirtualDate = (newDate) => {
    setVirtualDate(newDate)
  }

  // Value to be provided to the context
  const value = {
    virtualDate,
    updateVirtualDate
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Export the context and provider
export default AppContext

// Add prop validation for AppProvider
AppProvider.propTypes = {
  children: PropTypes.node.isRequired // children must be a valid React node
}
