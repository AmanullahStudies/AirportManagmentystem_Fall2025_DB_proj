// src/pages/AircraftModels/index.jsx - FIXED: Fetch seats from AircraftModels table correctly
import { useEffect, useState } from 'react'
import { fetchAircraftModels } from '@renderer/apis/AircraftModelsApi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaCogs, FaList, FaChartBar, FaPlus, FaArrowRight, FaChair } from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function AircraftModelsDashboard() {
  const [models, setModels] = useState([])
  const [seatsData, setSeatsData] = useState({}) // Store seats count by model
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch aircraft models
        const modelsData = await fetchAircraftModels()
        console.log('Models fetched:', modelsData)

        if (Array.isArray(modelsData) && modelsData.length > 0) {
          setModels(modelsData)

          // For each model, store the seat capacity from the fetched data
          // The API returns seatCapacity (mapped from TotalSeatCapacity column in AircraftModels table)
          const seatsByModel = {}
          modelsData.forEach((model) => {
            // Each model has seatCapacity - this is the seat count per aircraft of this model
            seatsByModel[model.id] = {
              seatCapacity: model.seatCapacity || 0
            }
          })
          setSeatsData(seatsByModel)
        } else {
          setModels([])
          setSeatsData({})
        }
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load aircraft models')
        setModels([])
        setSeatsData({})
        toast.error('Failed to load aircraft models')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate statistics
  const totalModels = models.length
  const recentModels = models.slice(0, 5)

  // Total seats = sum of all seat capacities
  const totalSeats = models.reduce((sum, model) => sum + (model.seatCapacity || 0), 0)

  // Avg seats = total seats / number of models
  const avgSeats = totalModels > 0 ? Math.round(totalSeats / totalModels) : 0

  // Max seats = highest capacity among models
  const maxSeats = models.length > 0 ? Math.max(...models.map((m) => m.seatCapacity || 0)) : 0

  return (
    <div className="passengers-dashboard">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaCogs className="hero-badge-icon" />
            <span>Aircraft Models Management</span>
          </div>
          <h1 className="hero-title">⚙️ Aircraft Models Control Center</h1>
          <p className="hero-subtitle">
            Complete aircraft model oversight at your fingertips. Register, manage, and analyze
            aircraft models with seat capacities.
          </p>
        </div>
        <div className="hero-actions">
          <Link to="/aircraftModels/add" className="hero-btn hero-btn-primary">
            <FaPlus />
            <span>Add Model</span>
          </Link>
          <Link to="/aircraftModels/list" className="hero-btn hero-btn-secondary">
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
              <FaCogs className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Models</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  totalModels.toLocaleString()
                )}
              </p>
              <span className="stat-change">↑ All time</span>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper">
              <FaChair className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Seats</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  totalSeats.toLocaleString()
                )}
              </p>
              <span className="stat-change">↑ Combined capacity</span>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon-wrapper">
              <FaChair className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Avg Seats</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  avgSeats.toLocaleString()
                )}
              </p>
              <span className="stat-change">↑ Per model</span>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper">
              <FaChair className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Max Seats</h3>
              <p className="stat-value">
                {loading ? (
                  <span className="stat-loading">Loading...</span>
                ) : error ? (
                  <span className="stat-error">--</span>
                ) : (
                  maxSeats.toLocaleString()
                )}
              </p>
              <span className="stat-change">↑ Largest model</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="quick-links-container">
        <h2 className="section-title">
          <FaCogs className="section-icon" />
          Quick Actions
        </h2>
        <div className="quick-links">
          <Link to="/aircraftModels/list" className="quick-card">
            <div className="quick-card-icon">
              <FaList />
            </div>
            <div className="quick-card-content">
              <h4>Models List</h4>
              <p>View and manage all aircraft models.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/aircraftModels/add" className="quick-card">
            <div className="quick-card-icon quick-card-icon-primary">
              <FaPlus />
            </div>
            <div className="quick-card-content">
              <h4>Add Model</h4>
              <p>Register new aircraft models quickly.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/aircraft/list" className="quick-card">
            <div className="quick-card-icon quick-card-icon-success">
              <FaList />
            </div>
            <div className="quick-card-content">
              <h4>View Aircraft</h4>
              <p>Manage aircraft using these models.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>

          <Link to="/airlines/list" className="quick-card">
            <div className="quick-card-icon quick-card-icon-info">
              <FaList />
            </div>
            <div className="quick-card-content">
              <h4>View Airlines</h4>
              <p>Manage airlines with aircraft.</p>
            </div>
            <div className="quick-card-arrow">
              <FaArrowRight />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Models */}
      <div className="recent-section">
        <div className="recent-header">
          <h2 className="section-title">
            <FaCogs className="section-icon" />
            Recent Models
          </h2>
          <Link to="/aircraftModels/list" className="view-all-link">
            View All <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="recent-loading">
            <div className="loading-spinner"></div>
            <p>Loading recent models...</p>
          </div>
        ) : error ? (
          <div className="recent-error">
            <p>Unable to load recent models</p>
          </div>
        ) : recentModels.length === 0 ? (
          <div className="recent-empty">
            <FaCogs className="empty-icon" />
            <p>No aircraft models yet</p>
            <Link to="/aircraftModels/add" className="empty-action-btn">
              <FaPlus /> Add Your First Model
            </Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentModels.map((model) => (
              <div key={model.id} className="recent-passenger-card">
                <div className="passenger-avatar">
                  {model.manufacturerName?.substring(0, 2) || 'AM'}
                </div>
                <div className="passenger-info">
                  <h4 className="passenger-name">{model.modelName}</h4>
                  <p className="passenger-passport">
                    <FaCogs className="passport-icon" />
                    {model.manufacturerName} • {model.seatCapacity} seats
                  </p>
                </div>
                <div className="passenger-id">
                  <span>ID: {model.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
