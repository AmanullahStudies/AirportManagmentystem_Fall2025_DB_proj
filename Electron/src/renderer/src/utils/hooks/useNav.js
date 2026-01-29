// hooks/useNavbar.js
import { useContext, useEffect } from 'react'
import { NavbarContext } from '../contexts/NavContext'

export const useNavbar = (show = true) => {
  const { setShowNav } = useContext(NavbarContext)

  useEffect(() => {
    setShowNav(show)
    return () => setShowNav(true) // Reset on unmount
  }, [show, setShowNav])
}
