// src/pages/Bookings/index.jsx
import { useEffect, useState } from 'react'
import { fetchBookings } from '@renderer/apis/BookingsApi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FaTicketAlt,
  FaList,
  FaChartBar,
  FaPlus,
  FaCheckCircle,
  FaArrowRight,
  FaBan,
  FaCalendarAlt
} from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true)
        const data = await fetchBookings()
        setBookings(data || [])
        setError(null)
      } catch (err) {
        setError('Failed to load booking data')
        toast.error('Failed to load bookings')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [])

  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED').length
  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED').length
  const totalTickets = bookings.reduce((sum, b) => sum + (b.ticketCount || 0), 0)
  const recentBookings = bookings.slice(0, 5)

  return (
    <div className="passengers-dashboard">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaTicketAlt className="hero-badge-icon" />
            <span>Bookings Management</span>
          </div>
          <h1 className="hero-title">🎫 Bookings Control Center</h1>
          <p className="hero-subtitle">
            Complete booking oversight at your fingertips. Create, manage, and track all flight
            bookings and tickets.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/bookings/create" className="hero-btn hero-btn-primary">
            <FaPlus />
            <span>Create Booking</span>
          </Link>
          <Link to="/bookings/list" className="hero-btn hero-btn-secondary">
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
              <FaTicketAlt className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Bookings</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  totalBookings.toLocaleString()
                )}
              </p>
              <span className="stat-change">↑ All time</span>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper">
              <FaCheckCircle className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Confirmed</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  confirmedBookings
                )}
              </p>
              <span className="stat-change">↑ Active bookings</span>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon-wrapper">
              <FaBan className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Cancelled</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  cancelledBookings
                )}
              </p>
              <span className="stat-change">↓ Inactive</span>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper">
              <FaCalendarAlt className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Tickets</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  totalTickets.toLocaleString()
                )}
              </p>
              <span className="stat-change">↑ Issued tickets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="quick-links-container">
        <h2 className="section-title">
          <FaTicketAlt className="section-icon" />
          Quick Actions
        </h2>
        <div className="quick-links">
          <Link to="/bookings/list" className="quick-card">
            <div className="quick-card-icon">
              <FaList />
            </div>
            <div className="quick-card-content">
              <h4>Bookings List</h4>
              <p>View and manage all bookings in the system.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/bookings/create" className="quick-card">
            <div className="quick-card-icon quick-card-icon-primary">
              <FaPlus />
            </div>
            <div className="quick-card-content">
              <h4>Create Booking</h4>
              <p>Register new bookings with automatic ticketing.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/tickets/list" className="quick-card">
            <div className="quick-card-icon quick-card-icon-success">
              <FaTicketAlt />
            </div>
            <div className="quick-card-content">
              <h4>View Tickets</h4>
              <p>See all individual tickets from bookings.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/passengers/list" className="quick-card">
            <div className="quick-card-icon quick-card-icon-info">
              <FaList />
            </div>
            <div className="quick-card-content">
              <h4>Passengers</h4>
              <p>Manage passenger information.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="recent-section">
        <div className="recent-header">
          <h2 className="section-title">
            <FaTicketAlt className="section-icon" />
            Recent Bookings
          </h2>
          <Link to="/bookings/list" className="view-all-link">
            View All <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="recent-loading">
            <div className="loading-spinner"></div>
            <p>Loading recent bookings...</p>
          </div>
        ) : error ? (
          <div className="recent-error">
            <p>Unable to load recent bookings</p>
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="recent-empty">
            <FaTicketAlt className="empty-icon" />
            <p>No bookings yet</p>
            <Link to="/bookings/create" className="empty-action-btn">
              <FaPlus /> Create Your First Booking
            </Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="recent-passenger-card">
                <div className="passenger-avatar">
                  {booking.bookingRef?.substring(2, 4) || 'BK'}
                </div>
                <div className="passenger-info">
                  <h4 className="passenger-name">{booking.bookingRef}</h4>
                  <p className="passenger-passport">
                    <FaTicketAlt className="passport-icon" />
                    {booking.ticketCount} ticket{booking.ticketCount !== 1 ? 's' : ''} •{' '}
                    {booking.status}
                  </p>
                </div>
                <div className="passenger-id">
                  <span>ID: {booking.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
