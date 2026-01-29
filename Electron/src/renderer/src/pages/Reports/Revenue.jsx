// src/pages/Reports/Revenue.jsx
import { useEffect, useState } from 'react'
import { fetchRevenueByAirline, fetchRevenueByFlight } from '@renderer/apis/ReportsApi'
import { toast } from 'react-toastify'
import { FaDollarSign, FaChartBar, FaPlane } from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function Revenue() {
  const [revenueByAirline, setRevenueByAirline] = useState([])
  const [revenueByFlight, setRevenueByFlight] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [airlineData, flightData] = await Promise.all([
          fetchRevenueByAirline(),
          fetchRevenueByFlight()
        ])
        setRevenueByAirline(Array.isArray(airlineData) ? airlineData : [])
        setRevenueByFlight(Array.isArray(flightData) ? flightData.slice(0, 10) : [])
      } catch (err) {
        toast.error('Failed to load revenue data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const totalRevenue = revenueByAirline.reduce((sum, a) => sum + (a.totalRevenue || 0), 0)
  const totalTickets = revenueByAirline.reduce((sum, a) => sum + (a.ticketCount || 0), 0)
  const avgPrice = totalTickets > 0 ? (totalRevenue / totalTickets).toFixed(2) : 0

  return (
    <div className="passengers-dashboard">
      {/* Hero */}
      <div className="dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <FaDollarSign className="hero-badge-icon" />
            <span>Revenue Report</span>
          </div>
          <h1 className="hero-title">💰 Revenue Analytics</h1>
          <p className="hero-subtitle">
            Comprehensive revenue analysis by airline, flight, and time period.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stats-container">
        <h2 className="section-title">
          <FaChartBar className="section-icon" /> Revenue Summary
        </h2>
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon-wrapper">
              <FaDollarSign className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Revenue</h3>
              <p className="stat-value">
                {loading
                  ? 'Loading...'
                  : `PKR ${Number(totalRevenue).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`}
              </p>
              <span className="stat-change">↑ All time</span>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon-wrapper">
              <FaChartBar className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Total Tickets</h3>
              <p className="stat-value">{loading ? 'Loading...' : totalTickets}</p>
              <span className="stat-change">↑ Sold</span>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon-wrapper">
              <FaDollarSign className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Average Price</h3>
              <p className="stat-value">{loading ? 'Loading...' : `PKR ${avgPrice}`}</p>
              <span className="stat-change">↑ Per ticket</span>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon-wrapper">
              <FaDollarSign className="stat-icon" />
            </div>
            <div className="stat-content">
              <h3 className="stat-label">Airlines</h3>
              <p className="stat-value">{loading ? 'Loading...' : revenueByAirline.length}</p>
              <span className="stat-change">↑ Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Airline */}
      <div className="recent-section">
        <h2 className="section-title">Revenue by Airline</h2>
        <div className="recent-list">
          {loading ? (
            <div className="recent-loading">
              <div className="loading-spinner"></div>
              <p>Loading revenue by airline...</p>
            </div>
          ) : revenueByAirline.length === 0 ? (
            <div className="recent-empty">
              <p>No airline revenue data</p>
            </div>
          ) : (
            revenueByAirline.map((airline) => (
              <div key={airline.id} className="recent-passenger-card">
                <div className="passenger-avatar">
                  {airline.airlineCode?.substring(0, 2) || 'AL'}
                </div>
                <div className="passenger-info">
                  <h4 className="passenger-name">{airline.airlineName}</h4>
                  <p className="passenger-passport">
                    PKR{' '}
                    {Number(airline.totalRevenue).toLocaleString('en-PK', {
                      maximumFractionDigits: 0
                    })}{' '}
                    • {airline.ticketCount ?? 0} tickets
                  </p>
                </div>
                <div className="passenger-id">
                  <span>Avg: PKR {Number(airline.averagePrice).toLocaleString('en-PK')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Revenue by Flight */}
      <div className="recent-section">
        <h2 className="section-title">Top Flights by Revenue</h2>
        <div className="recent-list">
          {loading ? (
            <div className="recent-loading">
              <div className="loading-spinner"></div>
              <p>Loading flight revenue...</p>
            </div>
          ) : revenueByFlight.length === 0 ? (
            <div className="recent-empty">
              <p>No flight revenue data</p>
            </div>
          ) : (
            revenueByFlight.map((flight) => (
              <div key={flight.id} className="recent-passenger-card">
                <div className="passenger-avatar">
                  {flight.FlightNumber?.substring(0, 2) || 'FL'}
                </div>
                <div className="passenger-info">
                  <h4 className="passenger-name">{flight.FlightNumber}</h4>
                  <p className="passenger-passport">
                    {flight.originCode} → {flight.destinationCode} • {flight.ticketCount ?? 0}{' '}
                    tickets
                  </p>
                </div>
                <div className="passenger-id">
                  <span>
                    PKR{' '}
                    {Number(flight.totalRevenue).toLocaleString('en-PK', {
                      maximumFractionDigits: 0
                    })}
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
