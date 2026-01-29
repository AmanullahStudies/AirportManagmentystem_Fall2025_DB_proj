// src/pages/Airports/index.jsx
import { useEffect, useState } from 'react'
import { fetchAirports } from '@renderer/apis/AirportsApi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FaPlaneArrival,
  FaList,
  FaChartBar,
  FaGlobe,
  FaPlus,
  FaCity,
  FaArrowRight,
  FaMapMarkerAlt
} from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function AirportsDashboard() {
  const [airports, setAirports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAirports = async () => {
      try {
        setLoading(true)
        const data = await fetchAirports()
        setAirports(data || [])
        setError(null)
      } catch (err) {
        setError('Failed to load airport data')
        toast.error('Failed to load airports')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadAirports()
  }, [])

  const totalAirports = airports.length
  const recentAirports = airports.slice(0, 5)

  // Count unique countries
  const uniqueCountries = new Set(airports.map((a) => a.country)).size

  // Count unique cities
  const uniqueCities = new Set(airports.map((a) => a.city)).size

  return (
    <div className="passengers-dashboard">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaPlaneArrival className="hero-badge-icon" />
            <span>Airport Management</span>
          </div>
          <h1 className="hero-title">🛬 Airport Control Center</h1>
          <p className="hero-subtitle">
            Complete airport oversight at your fingertips. Register, manage, and analyze airport
            data across the globe in real-time.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/airports/add" className="hero-btn hero-btn-primary">
            <FaPlus />
            <span>Add Airport</span>
          </Link>
          <Link to="/airports/list" className="hero-btn hero-btn-secondary">
            <FaList />
            <span>View All</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-container">
        <h2 className="section-title">
          <FaChartBar className="section-icon" />
          Statistics Overview
        </h2>
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon-wrapper">
              <FaPlaneArrival className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Airports</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  totalAirports.toLocaleString()
                )}
              </p>
              <span className="stat-change">↑ All time</span>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper">
              <FaGlobe className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Countries</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  uniqueCountries
                )}
              </p>
              <span className="stat-change">↑ Worldwide</span>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon-wrapper">
              <FaCity className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Cities</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  uniqueCities
                )}
              </p>
              <span className="stat-change">↑ Global coverage</span>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper">
              <FaMapMarkerAlt className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Active Routes</h3>
              <p className="stat-value">
                <span className="stat-placeholder">Coming Soon</span>
              </p>
              <span className="stat-change">↑ In development</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="quick-links-container">
        <h2 className="section-title">
          <FaPlaneArrival className="section-icon" />
          Quick Actions
        </h2>
        <div className="quick-links">
          <Link to="/airports/list" className="quick-card">
            <div className="quick-card-icon">
              <FaList />
            </div>
            <div className="quick-card-content">
              <h4>Airports List</h4>
              <p>View and manage all airports in the database.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/airports/add" className="quick-card">
            <div className="quick-card-icon quick-card-icon-primary">
              <FaPlus />
            </div>
            <div className="quick-card-content">
              <h4>Add Airport</h4>
              <p>Register new airports quickly and efficiently.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/routes/add" className="quick-card">
            <div className="quick-card-icon quick-card-icon-success">
              <FaMapMarkerAlt />
            </div>
            <div className="quick-card-content">
              <h4>Manage Routes</h4>
              <p>Add or update flight routes between airports.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/reports" className="quick-card">
            <div className="quick-card-icon quick-card-icon-info">
              <FaChartBar />
            </div>
            <div className="quick-card-content">
              <h4>Reports</h4>
              <p>Airport traffic and statistics reports.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Airports */}
      <div className="recent-section">
        <div className="recent-header">
          <h2 className="section-title">
            <FaPlaneArrival className="section-icon" />
            Recent Airports
          </h2>
          <Link to="/airports/list" className="view-all-link">
            View All <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="recent-loading">
            <div className="loading-spinner"></div>
            <p>Loading recent airports...</p>
          </div>
        ) : error ? (
          <div className="recent-error">
            <p>Unable to load recent airports</p>
          </div>
        ) : recentAirports.length === 0 ? (
          <div className="recent-empty">
            <FaPlaneArrival className="empty-icon" />
            <p>No airports yet</p>
            <Link to="/airports/add" className="empty-action-btn">
              <FaPlus /> Add Your First Airport
            </Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentAirports.map((airport) => (
              <div key={airport.id} className="recent-passenger-card">
                <div className="passenger-avatar">{airport.code?.substring(0, 2) || 'AP'}</div>
                <div className="passenger-info">
                  <h4 className="passenger-name">{airport.name}</h4>
                  <p className="passenger-passport">
                    <FaMapMarkerAlt className="passport-icon" />
                    {airport.code} • {airport.city}, {airport.country}
                  </p>
                </div>
                <div className="passenger-id">
                  <span>ID: {airport.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
