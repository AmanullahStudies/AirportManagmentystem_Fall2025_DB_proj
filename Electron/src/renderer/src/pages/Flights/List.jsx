// src/pages/Flights/List.jsx
import { useEffect, useState } from 'react'
import {
  fetchFlights,
  deleteFlight,
  updateFlight,
  fetchRoutesForDropdown,
  fetchAircraftForDropdown
} from '@renderer/apis/FlightsApi'
import { toast } from 'react-toastify'
import { FaSearch, FaEdit, FaTrash, FaSave, FaTimes, FaPlane, FaSort, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function FlightsList() {
  const [flights, setFlights] = useState([])
  const [filteredFlights, setFilteredFlights] = useState([])
  const [routes, setRoutes] = useState([])
  const [aircraft, setAircraft] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    flightNumber: '',
    routeId: '',
    aircraftId: '',
    scheduledDeparture: '',
    scheduledArrival: '',
    status: 'SCHEDULED'
  })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  const loadData = async () => {
    try {
      setLoading(true)
      const [flightsData, routesData, aircraftData] = await Promise.all([
        fetchFlights(),
        fetchRoutesForDropdown(),
        fetchAircraftForDropdown()
      ])
      setFlights(flightsData || [])
      setFilteredFlights(flightsData || [])
      setRoutes(routesData || [])
      setAircraft(aircraftData || [])
    } catch (error) {
      toast.error('Failed to load flights')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = flights.filter(
      (f) =>
        f.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.originCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.destinationCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.originCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.destinationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.id?.toString().includes(searchTerm)
    )

    if (sortBy === 'newest') {
      filtered = filtered.sort((a, b) => b.id - a.id)
    } else if (sortBy === 'oldest') {
      filtered = filtered.sort((a, b) => a.id - b.id)
    } else if (sortBy === 'status') {
      filtered = filtered.sort((a, b) => a.status.localeCompare(b.status))
    }

    setFilteredFlights(filtered)
  }, [searchTerm, flights, sortBy])

  const handleEdit = (flight) => {
    setEditingId(flight.id)
    setEditForm({
      flightNumber: flight.flightNumber,
      routeId: flight.routeId,
      aircraftId: flight.aircraftId,
      scheduledDeparture: flight.scheduledDeparture?.slice(0, 16) || '',
      scheduledArrival: flight.scheduledArrival?.slice(0, 16) || '',
      status: flight.status
    })
  }

  const handleSaveEdit = async (id) => {
    if (
      !editForm.flightNumber ||
      !editForm.routeId ||
      !editForm.aircraftId ||
      !editForm.scheduledDeparture ||
      !editForm.scheduledArrival
    ) {
      toast.error('All fields are required')
      return
    }

    if (new Date(editForm.scheduledArrival) <= new Date(editForm.scheduledDeparture)) {
      toast.error('Arrival time must be after departure time')
      return
    }

    try {
      await updateFlight(
        id,
        editForm.flightNumber,
        editForm.routeId,
        editForm.aircraftId,
        editForm.scheduledDeparture,
        editForm.scheduledArrival,
        editForm.status
      )
      toast.success('Flight updated successfully')
      setEditingId(null)
      loadData()
    } catch (error) {
      toast.error('Failed to update flight')
      console.error(error)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({
      flightNumber: '',
      routeId: '',
      aircraftId: '',
      scheduledDeparture: '',
      scheduledArrival: '',
      status: 'SCHEDULED'
    })
  }

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      try {
        await deleteFlight(id)
        toast.success('Flight deleted successfully')
        setDeleteConfirm(null)
        loadData()
      } catch (error) {
        toast.error('Failed to delete flight')
        console.error(error)
      }
    } else {
      setDeleteConfirm(id)
      toast.warning('Click delete again to confirm')
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'color: #3b82f6'
      case 'COMPLETED':
        return 'color: #10b981'
      case 'DELAYED':
        return 'color: #f59e0b'
      case 'CANCELLED':
        return 'color: #ff6b00'
      default:
        return ''
    }
  }

  return (
    <div className="passengers-list">
      {/* Header Section */}
      <div className="list-header">
        <div className="list-header-content">
          <h1 className="list-title">
            <FaPlane className="title-icon" />
            Flights Directory
          </h1>
          <p className="list-subtitle">
            Manage and view all scheduled flights. Search, edit, or delete records.
          </p>
        </div>
        <div className="list-stats">
          <div className="list-stat-item">
            <span className="list-stat-label">Total</span>
            <span className="list-stat-value">{flights.length}</span>
          </div>
          <div className="list-stat-divider"></div>
          <div className="list-stat-item">
            <span className="list-stat-label">Showing</span>
            <span className="list-stat-value">{filteredFlights.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="list-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by flight number, city, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>
              <FaTimes />
            </button>
          )}
        </div>
        <div className="sort-box">
          <FaSort className="sort-icon" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="status">By Status</option>
          </select>
        </div>
        <Link to="/flights/add" className="add-passenger-btn">
          <FaPlus />
          <span>Add New</span>
        </Link>
      </div>

      {/* Cards Grid Section */}
      {loading ? (
        <div className="list-loading">
          <div className="loading-spinner-large"></div>
          <p>Loading flights...</p>
        </div>
      ) : filteredFlights.length === 0 ? (
        <div className="list-empty">
          <FaPlane className="empty-icon-large" />
          <h3>No flights found</h3>
          <p>
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Start by scheduling your first flight'}
          </p>
          {!searchTerm && (
            <Link to="/flights/add" className="empty-action-btn">
              <FaPlus /> Schedule Your First Flight
            </Link>
          )}
        </div>
      ) : (
        <div className="passengers-grid">
          {filteredFlights.map((flight) => (
            <div
              key={flight.id}
              className={`passenger-card ${editingId === flight.id ? 'card-editing' : ''}`}
            >
              {editingId === flight.id ? (
                // Edit Mode
                <div className="card-edit-mode">
                  <div className="edit-header">
                    <div className="passenger-avatar-large">FL</div>
                    <span className="edit-badge">Editing</span>
                  </div>

                  <div className="edit-fields">
                    <div className="edit-field">
                      <label>Flight Number</label>
                      <input
                        type="text"
                        value={editForm.flightNumber}
                        onChange={(e) => setEditForm({ ...editForm, flightNumber: e.target.value })}
                        className="edit-input-field"
                        placeholder="e.g., PK-101"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Route</label>
                      <select
                        value={editForm.routeId}
                        onChange={(e) => setEditForm({ ...editForm, routeId: e.target.value })}
                        className="edit-input-field"
                      >
                        <option value="">Select route</option>
                        {routes.map((route) => (
                          <option key={route.id} value={route.id}>
                            {route.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="edit-field">
                      <label>Aircraft</label>
                      <select
                        value={editForm.aircraftId}
                        onChange={(e) => setEditForm({ ...editForm, aircraftId: e.target.value })}
                        className="edit-input-field"
                      >
                        <option value="">Select aircraft</option>
                        {aircraft.map((ac) => (
                          <option key={ac.id} value={ac.id}>
                            {ac.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="edit-field">
                      <label>Departure</label>
                      <input
                        type="datetime-local"
                        value={editForm.scheduledDeparture}
                        onChange={(e) =>
                          setEditForm({ ...editForm, scheduledDeparture: e.target.value })
                        }
                        className="edit-input-field"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Arrival</label>
                      <input
                        type="datetime-local"
                        value={editForm.scheduledArrival}
                        onChange={(e) =>
                          setEditForm({ ...editForm, scheduledArrival: e.target.value })
                        }
                        className="edit-input-field"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="edit-input-field"
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="DELAYED">Delayed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button
                      className="card-btn card-btn-save"
                      onClick={() => handleSaveEdit(flight.id)}
                    >
                      <FaSave />
                      <span>Save Changes</span>
                    </button>
                    <button className="card-btn card-btn-cancel" onClick={handleCancelEdit}>
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="card-header">
                    <div className="passenger-avatar-large">
                      {flight.flightNumber?.substring(0, 2) || 'FL'}
                    </div>
                    <div className="card-id">ID: {flight.id}</div>
                  </div>

                  <div className="card-body">
                    <h3 className="passenger-full-name">
                      {flight.originCity} → {flight.destinationCity}
                    </h3>
                    <div className="passport-info">
                      <FaPlane className="passport-icon-card" />
                      <span className="passport-number" style={{ fontFamily: 'Arial' }}>
                        {flight.flightNumber}
                      </span>
                    </div>
                    <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {flight.originCode} → {flight.destinationCode}
                      </span>
                    </div>
                    <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {flight.airlineName} • {flight.modelName}
                      </span>
                    </div>
                    <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          ...{ getStatusColor: getStatusColor(flight.status) }
                        }}
                      >
                        Status:{' '}
                        <strong
                          style={
                            getStatusColor(flight.status)
                              ? { style: getStatusColor(flight.status) }
                              : {}
                          }
                        >
                          {flight.status}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button className="card-btn card-btn-edit" onClick={() => handleEdit(flight)}>
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      className={`card-btn card-btn-delete ${deleteConfirm === flight.id ? 'confirm-state' : ''}`}
                      onClick={() => handleDelete(flight.id)}
                    >
                      <FaTrash />
                      <span>{deleteConfirm === flight.id ? 'Confirm?' : 'Delete'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
