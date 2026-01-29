// src/pages/Reports/Daily.jsx
import { useEffect, useState } from 'react'
import { fetchDailyReport, fetchFlightStats } from '@renderer/apis/ReportsApi'
import { toast } from 'react-toastify'
import {
  FaCalendarAlt,
  FaPlane,
  FaTicketAlt,
  FaDollarSign,
  FaUsers,
  FaCheckCircle
} from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function DailyReport() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [dailyData, setDailyData] = useState([])
  const [flightStats, setFlightStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [daily, stats] = await Promise.all([
          fetchDailyReport(selectedDate),
          fetchFlightStats()
        ])
        setDailyData(Array.isArray(daily) ? daily : [])
        setFlightStats(Array.isArray(stats) ? stats : [])
      } catch (error) {
        toast.error('Failed to load daily report')
        console.error(error)
        setDailyData([])
        setFlightStats([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [selectedDate])

  const summary = dailyData.length > 0 ? dailyData[0] : {}

  return (
    <div className="passengers-dashboard">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaCalendarAlt className="hero-badge-icon" />
            <span>Daily Report</span>
          </div>
          <h1 className="hero-title">📅 Daily Report</h1>
          <p className="hero-subtitle">
            View daily flight, booking, and revenue statistics for your airport.
          </p>
        </div>
        <div className="hero-actions">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '0.875rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-container">
        <h2 className="section-title">
          <FaCalendarAlt className="section-icon" />
          {selectedDate} Statistics
        </h2>
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon-wrapper">
              <FaPlane className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Flights</h3>
              <p className="stat-value">{loading ? 'Loading...' : summary.totalFlights || 0}</p>
              <span className="stat-change">↑ Today</span>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper">
              <FaCheckCircle className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Bookings</h3>
              <p className="stat-value">{loading ? 'Loading...' : summary.totalBookings || 0}</p>
              <span className="stat-change">↑ Today</span>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon-wrapper">
              <FaTicketAlt className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Tickets</h3>
              <p className="stat-value">{loading ? 'Loading...' : summary.totalTickets || 0}</p>
              <span className="stat-change">↑ Today</span>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper">
              <FaDollarSign className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Revenue</h3>
              <p className="stat-value">
                {loading
                  ? 'Loading...'
                  : `PKR ${(summary.totalRevenue || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`}
              </p>
              <span className="stat-change">↑ Today</span>
            </div>
          </div>

          <div className="stat-card stat-primary">
            <div className="stat-icon-wrapper">
              <FaUsers className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Passengers</h3>
              <p className="stat-value">{loading ? 'Loading...' : summary.totalPassengers || 0}</p>
              <span className="stat-change">↑ Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Status Breakdown */}
      <div className="recent-section">
        <h2 className="section-title">
          <FaPlane className="section-icon" />
          Flight Status Breakdown
        </h2>
        <div className="recent-list">
          {loading ? (
            <div className="recent-loading">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          ) : flightStats.length === 0 ? (
            <div className="recent-empty">
              <p>No flight data available</p>
            </div>
          ) : (
            flightStats.map((stat, idx) => (
              <div key={idx} className="recent-passenger-card">
                <div className="passenger-avatar">{stat.status?.substring(0, 2) || 'FL'}</div>
                <div className="passenger-info">
                  <h4 className="passenger-name">{stat.status}</h4>
                  <p className="passenger-passport">
                    <FaPlane className="passport-icon" />
                    {stat.flightCount} Flights • {stat.ticketCount} Tickets
                  </p>
                </div>
                <div className="passenger-id">
                  <span>
                    PKR{' '}
                    {(stat.totalRevenue || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
