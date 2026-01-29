// src/pages/Passengers/index.jsx
import { useEffect, useState } from 'react'
import { fetchPassengers } from '@renderer/apis/PassengersApi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FaUserPlus,
  FaList,
  FaChartBar,
  FaTicketAlt,
  FaUsers,
  FaCalendarDay,
  FaPlane,
  FaClock,
  FaArrowRight,
  FaPassport
} from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function PassengersDashboard() {
  const [passengers, setPassengers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPassengers = async () => {
      try {
        setLoading(true)
        const data = await fetchPassengers()
        setPassengers(data || [])
        setError(null)
      } catch (err) {
        setError('Failed to load passenger data')
        toast.error('Failed to load passengers')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadPassengers()
  }, [])

  const totalPassengers = passengers.length
  const newToday = passengers.filter((p) => {
    const today = new Date().toISOString().slice(0, 10)
    return p.createdAt?.slice(0, 10) === today
  }).length

  const recentPassengers = passengers.slice(0, 5)

  return (
    <div className="passengers-dashboard">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaUsers className="hero-badge-icon" />
            <span>Passenger Management</span>
          </div>
          <h1 className="hero-title">✈️ Passenger Control Center</h1>
          <p className="hero-subtitle">
            Complete passenger oversight at your fingertips. Register, manage, book, and analyze
            passenger data in real-time.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/passengers/add" className="hero-btn hero-btn-primary">
            <FaUserPlus />
            <span>Add Passenger</span>
          </Link>
          <Link to="/passengers/list" className="hero-btn hero-btn-secondary">
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
              <FaUsers className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Passengers</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  totalPassengers.toLocaleString()
                )}
              </p>
              <span className="stat-change">↑ All time</span>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper">
              <FaCalendarDay className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">New Today</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  newToday
                )}
              </p>
              <span className="stat-change">↑ Last 24h</span>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon-wrapper">
              <FaPlane className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Active Bookings</h3>
              <p className="stat-value">
                <span className="stat-placeholder">Coming Soon</span>
              </p>
              <span className="stat-change">↑ In development</span>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper">
              <FaTicketAlt className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Pending Tickets</h3>
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
          <Link to="/passengers/list" className="quick-card">
            <div className="quick-card-icon">
              <FaList />
            </div>
            <div className="quick-card-content">
              <h4>Passenger List</h4>
              <p>View and manage all passengers in the database.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/passengers/add" className="quick-card">
            <div className="quick-card-icon quick-card-icon-primary">
              <FaUserPlus />
            </div>
            <div className="quick-card-content">
              <h4>Add Passenger</h4>
              <p>Register new passengers quickly and efficiently.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/bookings/create" className="quick-card">
            <div className="quick-card-icon quick-card-icon-success">
              <FaPlane />
            </div>
            <div className="quick-card-content">
              <h4>Create Booking</h4>
              <p>Book flights for passengers directly from here.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/reports/passenger-summary" className="quick-card">
            <div className="quick-card-icon quick-card-icon-info">
              <FaChartBar />
            </div>
            <div className="quick-card-content">
              <h4>Reports</h4>
              <p>Passenger and booking reports at a glance.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Passengers */}
      <div className="recent-section">
        <div className="recent-header">
          <h2 className="section-title">
            <FaPassport className="section-icon" />
            Recent Passengers
          </h2>
          <Link to="/passengers/list" className="view-all-link">
            View All <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="recent-loading">
            <div className="loading-spinner"></div>
            <p>Loading recent passengers...</p>
          </div>
        ) : error ? (
          <div className="recent-error">
            <p>Unable to load recent passengers</p>
          </div>
        ) : recentPassengers.length === 0 ? (
          <div className="recent-empty">
            <FaUsers className="empty-icon" />
            <p>No passengers yet</p>
            <Link to="/passengers/add" className="empty-action-btn">
              <FaUserPlus /> Add Your First Passenger
            </Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentPassengers.map((passenger) => (
              <div key={passenger.id} className="recent-passenger-card">
                <div className="passenger-avatar">
                  {passenger.firstName?.charAt(0) || 'P'}
                  {passenger.lastName?.charAt(0) || 'X'}
                </div>
                <div className="passenger-info">
                  <h4 className="passenger-name">
                    {passenger.firstName} {passenger.lastName}
                  </h4>
                  <p className="passenger-passport">
                    <FaPassport className="passport-icon" />
                    {passenger.passport || 'N/A'}
                  </p>
                </div>
                <div className="passenger-id">
                  <span>ID: {passenger.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
