import React, { useState, useEffect } from 'react'
import {
  FaTimes,
  FaArrowLeft,
  FaChevronRight,
  FaCog,
  FaUser,
  FaHome,
  FaPlane,
  FaUsers,
  FaTicketAlt,
  FaBuilding,
  FaDoor,
  FaChartBar
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import styles from '../../assets/CssAll/Componets/Navbar/SideBar.module.css'

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 750)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Edge detection area - increased width */}
      {!isOpen && <div className={styles.edgeTrigger} onMouseEnter={() => setIsOpen(true)} />}

      {/* Sidebar with enhanced design */}
      <div className={`${styles.sidebar} ${isOpen ? styles.active : ''}`}>
        {/* Close button top with styling */}
        <button className={styles.closeBtnTop} onClick={() => setIsOpen(false)}>
          <FaTimes />
        </button>

        {/* Main content area */}
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Navigation</h2>
            <div className={styles.separator}></div>
          </div>

          <ul className={styles.mainMenu}>
            <li className={styles.menuItem}>
              <FaHome className={styles.menuIcon} />
              <Link to="/">Dashboard</Link>
            </li>
            <li className={styles.menuItem}>
              <FaPlane className={styles.menuIcon} />
              <Link to="/flights">Flights</Link>
            </li>
            <li className={styles.menuItem}>
              <FaUsers className={styles.menuIcon} />
              <Link to="/passengers">Passengers</Link>
            </li>
            <li className={styles.menuItem}>
              <FaTicketAlt className={styles.menuIcon} />
              <Link to="/bookings">Bookings</Link>
            </li>
            <li className={styles.menuItem}>
              <FaBuilding className={styles.menuIcon} />
              <Link to="/airlines">Airlines</Link>
            </li>
            <li className={styles.menuItem}>
              <FaDoor className={styles.menuIcon} />
              <Link to="/gates">Gates</Link>
            </li>
            <li className={styles.menuItem}>
              <FaChartBar className={styles.menuIcon} />
              <Link to="/reports">Reports</Link>
            </li>
          </ul>

          {/* Additional options row */}
          <div className={styles.quickActions}>
            <button className={styles.quickActionBtn}>
              <FaCog />
            </button>
            <button className={styles.quickActionBtn}>
              <FaUser />
            </button>
          </div>
        </div>

        {/* Enhanced close button bottom */}
        <button className={styles.closeBtnBottom} onClick={() => setIsOpen(false)}>
          <FaArrowLeft />
          <span>Collapse Menu</span>
        </button>
      </div>

      {/* Animated toggle button */}
      <button
        className={`${styles.toggleButton} ${isOpen ? styles.hidden : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <FaChevronRight className={styles.toggleIcon} />
      </button>
    </>
  )
}

export default SideBar
