// src/pages/Tickets/index.jsx
import { useEffect, useState } from 'react'
import { fetchTickets } from '@renderer/apis/TicketsApi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FaTicketAlt,
  FaList,
  FaChartBar,
  FaPlus,
  FaDollarSign,
  FaArrowRight,
  FaCalendarAlt
} from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function TicketsDashboard() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true)
        const data = await fetchTickets()
        setTickets(data || [])
        setError(null)
      } catch (err) {
        setError('Failed to load ticket data')
        toast.error('Failed to load tickets')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadTickets()
  }, [])

  const totalTickets = tickets.length
  const recentTickets = tickets.slice(0, 5)

  const totalRevenue = tickets.reduce(
    (sum, ticket) => sum + (parseFloat(ticket.ticketPrice) || 0),
    0
  )
  const activeTickets = tickets.filter((t) => t.flightStatus === 'SCHEDULED').length
  const avgTicketPrice = totalTickets > 0 ? (totalRevenue / totalTickets).toFixed(2) : 0

  return (
    <div className="passengers-dashboard">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaTicketAlt className="hero-badge-icon" />
            <span>Tickets Management</span>
          </div>
          <h1 className="hero-title">🎫 Tickets Control Center</h1>
          <p className="hero-subtitle">
            Complete ticket oversight at your fingertips. Manage and track all issued tickets and
            passenger information.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/tickets/list" className="hero-btn hero-btn-primary">
            <FaList />
            <span>View Tickets</span>
          </Link>
          <Link to="/bookings/create" className="hero-btn hero-btn-secondary">
            <FaPlus />
            <span>Create Booking</span>
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
              <span className="stat-change">↑ All time</span>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper">
              <FaCalendarAlt className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Active Flights</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  activeTickets
                )}
              </p>
              <span className="stat-change">↑ Upcoming</span>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon-wrapper">
              <FaDollarSign className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Revenue</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  `PKR ${totalRevenue.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`
                )}
              </p>
              <span className="stat-change">↑ Combined</span>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper">
              <FaDollarSign className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Avg Price</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  `PKR ${parseFloat(avgTicketPrice).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`
                )}
              </p>
              <span className="stat-change">↑ Per ticket</span>
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
          <Link to="/tickets/list" className="quick-card">
            <div className="quick-card-icon">
              <FaList />
            </div>
            <div className="quick-card-content">
              <h4>Tickets List</h4>
              <p>View and manage all tickets.</p>
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
              <p>Create new bookings with tickets.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/bookings/list" className="quick-card">
            <div className="quick-card-icon quick-card-icon-success">
              <FaList />
            </div>
            <div className="quick-card-content">
              <h4>View Bookings</h4>
              <p>Manage all bookings.</p>
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
              <h4>View Passengers</h4>
              <p>Manage passenger data.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="recent-section">
        <div className="recent-header">
          <h2 className="section-title">
            <FaTicketAlt className="section-icon" />
            Recent Tickets
          </h2>
          <Link to="/tickets/List" className="view-all-link">
            View All <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="recent-loading">
            <div className="loading-spinner"></div>
            <p>Loading recent tickets...</p>
          </div>
        ) : error ? (
          <div className="recent-error">
            <p>Unable to load recent tickets</p>
          </div>
        ) : recentTickets.length === 0 ? (
          <div className="recent-empty">
            <FaTicketAlt className="empty-icon" />
            <p>No tickets yet</p>
            <Link to="/bookings/create" className="empty-action-btn">
              <FaPlus /> Create Your First Booking
            </Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="recent-passenger-card">
                <div className="passenger-avatar">
                  {ticket.passengerName?.substring(0, 2) || 'TK'}
                </div>
                <div className="passenger-info">
                  <h4 className="passenger-name">{ticket.passengerName}</h4>
                  <p className="passenger-passport">
                    <FaTicketAlt className="passport-icon" />
                    {ticket.flightNumber} • {ticket.seatNumber}
                  </p>
                </div>
                <div className="passenger-id">
                  <span style={{ fontSize: '0.75rem' }}>
                    PKR {parseFloat(ticket.ticketPrice).toLocaleString()}
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
