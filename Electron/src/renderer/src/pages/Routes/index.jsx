// src/pages/Routes/index.jsx
import { useEffect, useState } from 'react'
import { fetchRoutes } from '@renderer/apis/RoutesApi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FaRoute,
  FaList,
  FaChartBar,
  FaMapMarkedAlt,
  FaPlus,
  FaRoad,
  FaArrowRight,
  FaExchangeAlt
} from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function RoutesDashboard() {
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true)
        const data = await fetchRoutes()
        setRoutes(data || [])
        setError(null)
      } catch (err) {
        setError('Failed to load route data')
        toast.error('Failed to load routes')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadRoutes()
  }, [])

  const totalRoutes = routes.length
  const recentRoutes = routes.slice(0, 5)

  // Calculate total distance
  const totalDistance = routes.reduce((sum, route) => sum + (route.distance || 0), 0)

  // Count unique origin airports
  const uniqueOrigins = new Set(routes.map((r) => r.originAirportId)).size

  // Calculate average distance
  const avgDistance = totalRoutes > 0 ? Math.round(totalDistance / totalRoutes) : 0

  return (
    <div className="passengers-dashboard">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaRoute className="hero-badge-icon" />
            <span>Routes Management</span>
          </div>
          <h1 className="hero-title">🗺️ Routes Control Center</h1>
          <p className="hero-subtitle">
            Complete route oversight at your fingertips. Register, manage, and analyze flight routes
            connecting airports worldwide.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/routes/add" className="hero-btn hero-btn-primary">
            <FaPlus />
            <span>Add Route</span>
          </Link>
          <Link to="/routes/list" className="hero-btn hero-btn-secondary">
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
              <FaRoute className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Routes</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  totalRoutes.toLocaleString()
                )}
              </p>
              <span className="stat-change">↑ All time</span>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper">
              <FaRoad className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Distance</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  `${totalDistance.toLocaleString()} km`
                )}
              </p>
              <span className="stat-change">↑ Combined</span>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon-wrapper">
              <FaMapMarkedAlt className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Origin Airports</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  uniqueOrigins
                )}
              </p>
              <span className="stat-change">↑ Connected</span>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper">
              <FaExchangeAlt className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Avg Distance</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  `${avgDistance.toLocaleString()} km`
                )}
              </p>
              <span className="stat-change">↑ Per route</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="quick-links-container">
        <h2 className="section-title">
          <FaRoute className="section-icon" />
          Quick Actions
        </h2>
        <div className="quick-links">
          <Link to="/routes/list" className="quick-card">
            <div className="quick-card-icon">
              <FaList />
            </div>
            <div className="quick-card-content">
              <h4>Routes List</h4>
              <p>View and manage all routes in the database.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/routes/add" className="quick-card">
            <div className="quick-card-icon quick-card-icon-primary">
              <FaPlus />
            </div>
            <div className="quick-card-content">
              <h4>Add Route</h4>
              <p>Register new routes between airports quickly.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/airports/list" className="quick-card">
            <div className="quick-card-icon quick-card-icon-success">
              <FaMapMarkedAlt />
            </div>
            <div className="quick-card-content">
              <h4>Manage Airports</h4>
              <p>View airports to connect with routes.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/flights/add" className="quick-card">
            <div className="quick-card-icon quick-card-icon-info">
              <FaChartBar />
            </div>
            <div className="quick-card-content">
              <h4>Add Flights</h4>
              <p>Create flights using existing routes.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Routes */}
      <div className="recent-section">
        <div className="recent-header">
          <h2 className="section-title">
            <FaRoute className="section-icon" />
            Recent Routes
          </h2>
          <Link to="/routes/list" className="view-all-link">
            View All <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="recent-loading">
            <div className="loading-spinner"></div>
            <p>Loading recent routes...</p>
          </div>
        ) : error ? (
          <div className="recent-error">
            <p>Unable to load recent routes</p>
          </div>
        ) : recentRoutes.length === 0 ? (
          <div className="recent-empty">
            <FaRoute className="empty-icon" />
            <p>No routes yet</p>
            <Link to="/routes/add" className="empty-action-btn">
              <FaPlus /> Add Your First Route
            </Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentRoutes.map((route) => (
              <div key={route.id} className="recent-passenger-card">
                <div className="passenger-avatar">{route.originCode?.substring(0, 2) || 'RT'}</div>
                <div className="passenger-info">
                  <h4 className="passenger-name">
                    {route.originCity} → {route.destinationCity}
                  </h4>
                  <p className="passenger-passport">
                    <FaExchangeAlt className="passport-icon" />
                    {route.originCode} to {route.destinationCode} • {route.distance} km
                  </p>
                </div>
                <div className="passenger-id">
                  <span>ID: {route.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
