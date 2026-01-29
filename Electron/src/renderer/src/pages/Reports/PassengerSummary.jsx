// src/pages/Reports/PassengerSummary.jsx
import { useEffect, useState } from 'react'
import { fetchPassengerStats, fetchTopRoutes } from '@renderer/apis/ReportsApi'
import { toast } from 'react-toastify'
import { FaUsers, FaPlane, FaTicketAlt, FaRoute } from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function PassengerSummary() {
  const [stats, setStats] = useState({})
  const [topRoutes, setTopRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [passengerStats, routes] = await Promise.all([
          fetchPassengerStats(),
          fetchTopRoutes(10)
        ])
        setStats(
          Array.isArray(passengerStats) && passengerStats.length > 0 ? passengerStats[0] : {}
        )
        setTopRoutes(Array.isArray(routes) ? routes : [])
      } catch (error) {
        toast.error('Failed to load passenger summary')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="passengers-dashboard">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaUsers className="hero-badge-icon" />
            <span>Passenger Summary</span>
          </div>
          <h1 className="hero-title">👥 Passenger Statistics</h1>
          <p className="hero-subtitle">Comprehensive passenger analytics and travel patterns.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-container">
        <h2 className="section-title">
          <FaUsers className="section-icon" />
          Overall Statistics
        </h2>
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon-wrapper">
              <FaUsers className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Passengers</h3>
              <p className="stat-value">
                {loading ? 'Loading...' : (stats.totalPassengers || 0).toLocaleString()}
              </p>
              <span className="stat-change">↑ All time</span>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper">
              <FaTicketAlt className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">With Tickets</h3>
              <p className="stat-value">
                {loading ? 'Loading...' : (stats.totalTickets || 0).toLocaleString()}
              </p>
              <span className="stat-change">↑ Active</span>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon-wrapper">
              <FaPlane className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Unique Flights</h3>
              <p className="stat-value">
                {loading ? 'Loading...' : (stats.uniqueFlights || 0).toLocaleString()}
              </p>
              <span className="stat-change">↑ Traveled</span>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper">
              <FaTicketAlt className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Bookings</h3>
              <p className="stat-value">
                {loading ? 'Loading...' : (stats.totalBookings || 0).toLocaleString()}
              </p>
              <span className="stat-change">↑ Created</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Routes */}
      <div className="recent-section">
        <h2 className="section-title">
          <FaRoute className="section-icon" />
          Top Routes by Passenger Count
        </h2>
        <div className="recent-list">
          {loading ? (
            <div className="recent-loading">
              <div className="loading-spinner"></div>
              <p>Loading top routes...</p>
            </div>
          ) : topRoutes.length === 0 ? (
            <div className="recent-empty">
              <p>No route data available</p>
            </div>
          ) : (
            topRoutes.map((route, idx) => (
              <div key={idx} className="recent-passenger-card">
                <div className="passenger-avatar">{route.originCode?.substring(0, 1) || 'R'}</div>
                <div className="passenger-info">
                  <h4 className="passenger-name">
                    {route.originCity} → {route.destinationCity}
                  </h4>
                  <p className="passenger-passport">
                    <FaRoute className="passport-icon" />
                    {route.originCode} to {route.destinationCode} • {route.passengerCount}{' '}
                    passengers
                  </p>
                </div>
                <div className="passenger-id">
                  <span>{route.flightCount} flights</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
