// src/components/Navbar/Nav.jsx
import { React, useContext } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../assets/CssAll/Componets/Navbar/Navbar.module.css'
import NavDropDowns, { DropdownProvider } from './NavDropDowns'
import { FaSearch, FaCog } from 'react-icons/fa'
import electronLogo from '../../assets/Pics/icon.png'
import { NavbarContext } from '../../utils/contexts/NavContext'

function Nav() {
  const { showNav } = useContext(NavbarContext)
  if (!showNav) return null

  // Grouped dropdowns - updated with all modules including index/dashboard pages
  const flightsOptions = [
    { title: 'Flights Dashboard', link: '/flights' },
    { title: 'Add Flight', link: '/flights/add' },
    { title: 'View Flights', link: '/flights/list' },
    { title: '-Routes Dashboard', link: '/routes' },
    { title: 'Add Route', link: '/routes/add' },
    { title: 'View Routes', link: '/routes/list' },
    { title: 'Flight Schedule', link: '/flightSchedule' }
  ]

  const clientsOptions = [
    { title: 'Passengers Dashboard', link: '/passengers' },
    { title: 'Add Passenger', link: '/passengers/add' },
    { title: 'View Passengers', link: '/passengers/list' },
    { title: '-Bookings Dashboard', link: '/bookings' },
    { title: 'Create Booking', link: '/bookings/create' },
    { title: 'View Bookings', link: '/bookings/list' },
    { title: '-Tickets Dashboard', link: '/tickets' },
    { title: 'View Tickets', link: '/tickets/list' }
  ]

  const airlinesAircraftOptions = [
    { title: 'Airlines Dashboard', link: '/airlines' },
    { title: 'Add Airline', link: '/airlines/add' },
    { title: 'View Airlines', link: '/airlines/list' },
    { title: '-Aircraft Dashboard', link: '/aircraft' },
    { title: 'Add Aircraft', link: '/aircraft/add' },
    { title: 'View Aircraft', link: '/aircraft/list' },
    { title: '-Aircraft Models Dashboard', link: '/aircraftModels' },
    { title: 'Add Aircraft Model', link: '/aircraftModels/add' },
    { title: 'View Aircraft Models', link: '/aircraftModels/list' }
  ]

  const airportsOptions = [
    { title: 'Airport Dashboard', link: '/airports' },
    { title: 'Add Airport', link: '/airports/add' },
    { title: 'View Airports', link: '/airports/list' }
  ]

  const reportsOptions = [
    { title: 'Daily Report', link: '/reports/daily' },
    { title: 'Passenger Summary', link: '/reports/passengerSummary' },
    { title: 'Revenue Report', link: '/reports/revenue' }
  ]

  const gatesOptions = [{ title: 'View Gates', link: '/gates/list' }]

  return (
    <DropdownProvider>
      <div className={styles.navContainer}>
        <nav className={styles.navbar}>
          {/* Left Section - Logo */}
          <div className={styles.leftSection}>
            <div className={styles.logo}>
              <img alt="logo" className={styles.logoImage} src={electronLogo} />
            </div>
          </div>

          {/* Middle Section - Nav Links */}
          <div className={styles.middleSection}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link to="/" className={styles.navLink}>
                  Home
                </Link>
              </li>
              <li className={styles.navItem}>
                <NavDropDowns title="Flights" optionsObj={flightsOptions} />
              </li>
              <li className={styles.navItem}>
                <NavDropDowns title="Clients" optionsObj={clientsOptions} />
              </li>
              <li className={styles.navItem}>
                <NavDropDowns title="Airlines & Aircraft" optionsObj={airlinesAircraftOptions} />
              </li>
              <li className={styles.navItem}>
                <NavDropDowns title="Airports" optionsObj={airportsOptions} />
              </li>
              <li className={styles.navItem}>
                <NavDropDowns title="Reports" optionsObj={reportsOptions} />
              </li>
              <li className={styles.navItem}>
                <NavDropDowns title="Gates" optionsObj={gatesOptions} />
              </li>
              <li className={styles.navItem}>
                <Link to="/testing" className={styles.navLink} style={{ color: '#ff6b00' }}>
                  Testing
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Section - Search and Settings */}
          <div className={styles.rightSection}>
            <div className={styles.searchBar}>
              <input type="text" placeholder="Search..." className={styles.searchInput} />
              <FaSearch className={styles.searchIcon} />
            </div>
            <div className={styles.settingsIcon}>
              <Link to="/Settings/Theme">
                <FaCog className={styles.icon} />
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </DropdownProvider>
  )
}

export default Nav
