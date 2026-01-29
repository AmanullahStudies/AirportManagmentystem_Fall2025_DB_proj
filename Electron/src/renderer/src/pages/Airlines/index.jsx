// src/pages/Airlines/index.jsx
import { useEffect, useState } from 'react'
import { fetchAirlines } from '@renderer/apis/AirlinesApi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaPlane, FaList, FaChartBar, FaGlobe, FaPlus, FaClock, FaArrowRight } from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function AirlinesDashboard() {
  const [airlines, setAirlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadAirlines = async () => {
      try {
        setLoading(true)
        const data = await fetchAirlines()
        setAirlines(data || [])
        setError(null)
      } catch (err) {
        setError('Failed to load airline data')
        toast.error('Failed to load airlines')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadAirlines()
  }, [])

  const totalAirlines = airlines.length
  const recentAirlines = airlines.slice(0, 5)

  // Count unique countries
  const uniqueCountries = new Set(airlines.map((a) => a.country)).size

  // Count active airlines
  const activeAirlines = airlines.filter((a) => a.status === 'ACTIVE').length

  return (
    <div className="passengers-dashboard">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaPlane className="hero-badge-icon" />
            <span>Airlines Management</span>
          </div>
          <h1 className="hero-title">✈️ Airlines Control Center</h1>
          <p className="hero-subtitle">
            Complete airline oversight at your fingertips. Register, manage, and analyze airline
            data in real-time.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/airlines/add" className="hero-btn hero-btn-primary">
            <FaPlus />
            <span>Add Airline</span>
          </Link>
          <Link to="/airlines/list" className="hero-btn hero-btn-secondary">
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
              <FaPlane className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Airlines</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  totalAirlines.toLocaleString()
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
              <FaClock className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Active Airlines</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  activeAirlines
                )}
              </p>
              <span className="stat-change">↑ Currently operating</span>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper">
              <FaPlane className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Active Fleets</h3>
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
          <FaClock className="section-icon" />
          Quick Actions
        </h2>
        <div className="quick-links">
          <Link to="/airlines/list" className="quick-card">
            <div className="quick-card-icon">
              <FaList />
            </div>
            <div className="quick-card-content">
              <h4>Airlines List</h4>
              <p>View and manage all airlines in the database.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/airlines/add" className="quick-card">
            <div className="quick-card-icon quick-card-icon-primary">
              <FaPlus />
            </div>
            <div className="quick-card-content">
              <h4>Add Airline</h4>
              <p>Register new airlines quickly and efficiently.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/flights/add" className="quick-card">
            <div className="quick-card-icon quick-card-icon-success">
              <FaPlane />
            </div>
            <div className="quick-card-content">
              <h4>Manage Flights</h4>
              <p>Add or update flight schedules for airlines.</p>
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
              <p>Airline performance and statistics reports.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Airlines */}
      <div className="recent-section">
        <div className="recent-header">
          <h2 className="section-title">
            <FaPlane className="section-icon" />
            Recent Airlines
          </h2>
          <Link to="/airlines/list" className="view-all-link">
            View All <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="recent-loading">
            <div className="loading-spinner"></div>
            <p>Loading recent airlines...</p>
          </div>
        ) : error ? (
          <div className="recent-error">
            <p>Unable to load recent airlines</p>
          </div>
        ) : recentAirlines.length === 0 ? (
          <div className="recent-empty">
            <FaPlane className="empty-icon" />
            <p>No airlines yet</p>
            <Link to="/airlines/add" className="empty-action-btn">
              <FaPlus /> Add Your First Airline
            </Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentAirlines.map((airline) => (
              <div key={airline.id} className="recent-passenger-card">
                <div className="passenger-avatar">{airline.code?.substring(0, 2) || 'AL'}</div>
                <div className="passenger-info">
                  <h4 className="passenger-name">{airline.name}</h4>
                  <p className="passenger-passport">
                    <FaGlobe className="passport-icon" />
                    {airline.code} • {airline.country}
                  </p>
                </div>
                <div className="passenger-id">
                  <span>ID: {airline.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
