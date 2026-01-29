// useAppContext.js
import { useContext } from 'react'
import AppContext from '../contexts/AppContext' // Import the context

// Create a custom hook to use the context
const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }

  return context
}

export default useAppContext
