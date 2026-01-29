// src/pages/Flights/index.jsx
import { useEffect, useState } from 'react'
import { fetchFlights } from '@renderer/apis/FlightsApi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FaPlane,
  FaList,
  FaChartBar,
  FaClock,
  FaPlus,
  FaAirbnb,
  FaArrowRight,
  FaCalendarAlt
} from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function FlightsDashboard() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadFlights = async () => {
      try {
        setLoading(true)
        const data = await fetchFlights()
        setFlights(data || [])
        setError(null)
      } catch (err) {
        setError('Failed to load flight data')
        toast.error('Failed to load flights')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadFlights()
  }, [])

  const totalFlights = flights.length
  const recentFlights = flights.slice(0, 5)

  // Count flights by status
  const scheduledCount = flights.filter((f) => f.flightStatus === 'SCHEDULED').length
  const delayedCount = flights.filter((f) => f.flightStatus === 'DELAYED').length
  const completedCount = flights.filter((f) => f.flightStatus === 'COMPLETED').length

  return (
    <div className="passengers-dashboard">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaPlane className="hero-badge-icon" />
            <span>Flights Management</span>
          </div>
          <h1 className="hero-title">✈️ Flights Control Center</h1>
          <p className="hero-subtitle">
            Complete flight oversight at your fingertips. Schedule, manage, and track flights across
            your network.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/flights/add" className="hero-btn hero-btn-primary">
            <FaPlus />
            <span>Schedule Flight</span>
          </Link>
          <Link to="/flights/list" className="hero-btn hero-btn-secondary">
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
              <h3 className="stat-label">Total Flights</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  totalFlights.toLocaleString()
                )}
              </p>
              <span className="stat-change">↑ All time</span>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper">
              <FaCalendarAlt className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Scheduled</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  scheduledCount
                )}
              </p>
              <span className="stat-change">↑ Upcoming</span>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon-wrapper">
              <FaClock className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Delayed</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  delayedCount
                )}
              </p>
              <span className="stat-change">↑ Current</span>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper">
              <FaAirbnb className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Completed</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  completedCount
                )}
              </p>
              <span className="stat-change">↑ Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="quick-links-container">
        <h2 className="section-title">
          <FaPlane className="section-icon" />
          Quick Actions
        </h2>
        <div className="quick-links">
          <Link to="/flights/list" className="quick-card">
            <div className="quick-card-icon">
              <FaList />
            </div>
            <div className="quick-card-content">
              <h4>Flights List</h4>
              <p>View and manage all flights in the system.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/flights/add" className="quick-card">
            <div className="quick-card-icon quick-card-icon-primary">
              <FaPlus />
            </div>
            <div className="quick-card-content">
              <h4>Schedule Flight</h4>
              <p>Create new flight schedules quickly.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/routes/list" className="quick-card">
            <div className="quick-card-icon quick-card-icon-success">
              <FaArrowRight />
            </div>
            <div className="quick-card-content">
              <h4>Manage Routes</h4>
              <p>View routes for flight scheduling.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/aircraft/list" className="quick-card">
            <div className="quick-card-icon quick-card-icon-info">
              <FaPlane />
            </div>
            <div className="quick-card-content">
              <h4>Aircraft Fleet</h4>
              <p>Manage aircraft assignments.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Flights */}
      <div className="recent-section">
        <div className="recent-header">
          <h2 className="section-title">
            <FaPlane className="section-icon" />
            Recent Flights
          </h2>
          <Link to="/flights/list" className="view-all-link">
            View All <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="recent-loading">
            <div className="loading-spinner"></div>
            <p>Loading recent flights...</p>
          </div>
        ) : error ? (
          <div className="recent-error">
            <p>Unable to load recent flights</p>
          </div>
        ) : recentFlights.length === 0 ? (
          <div className="recent-empty">
            <FaPlane className="empty-icon" />
            <p>No flights yet</p>
            <Link to="/flights/add" className="empty-action-btn">
              <FaPlus /> Schedule Your First Flight
            </Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentFlights.map((flight) => (
              <div key={flight.id} className="recent-passenger-card">
                <div className="passenger-avatar">
                  {flight.flightNumber?.substring(0, 2) || 'FL'}
                </div>
                <div className="passenger-info">
                  <h4 className="passenger-name">
                    {flight.flightNumber} - {flight.originCity} → {flight.destinationCity}
                  </h4>
                  <p className="passenger-passport">
                    <FaPlane className="passport-icon" />
                    {flight.originCode} to {flight.destinationCode} • {flight.aircraftRegistration}
                  </p>
                </div>
                <div className="passenger-id">
                  <span
                    style={{
                      fontSize: '0.7rem',
                      backgroundColor:
                        flight.flightStatus === 'SCHEDULED'
                          ? '#10b981'
                          : flight.flightStatus === 'DELAYED'
                            ? '#fbbf24'
                            : '#3b82f6',
                      color: 'white',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '50px'
                    }}
                  >
                    {flight.flightStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
