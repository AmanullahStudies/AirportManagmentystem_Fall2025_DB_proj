// src/pages/Routes/List.jsx
import { useEffect, useState } from 'react'
import {
  fetchRoutes,
  deleteRoute,
  updateRoute,
  fetchAirportsForDropdown
} from '@renderer/apis/RoutesApi'
import { toast } from 'react-toastify'
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaRoute,
  FaPlaneArrival,
  FaPlaneDeparture,
  FaRoad,
  FaSort,
  FaPlus
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function RoutesList() {
  const [routes, setRoutes] = useState([])
  const [filteredRoutes, setFilteredRoutes] = useState([])
  const [airports, setAirports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    originAirportId: '',
    destinationAirportId: '',
    distance: ''
  })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  const loadData = async () => {
    try {
      setLoading(true)
      const [routesData, airportsData] = await Promise.all([
        fetchRoutes(),
        fetchAirportsForDropdown()
      ])
      setRoutes(routesData || [])
      setFilteredRoutes(routesData || [])
      setAirports(airportsData || [])
    } catch (error) {
      toast.error('Failed to load routes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = routes.filter(
      (r) =>
        r.originCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.destinationCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.originCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.destinationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id?.toString().includes(searchTerm)
    )

    // Apply sorting
    if (sortBy === 'newest') {
      filtered = filtered.sort((a, b) => b.id - a.id)
    } else if (sortBy === 'oldest') {
      filtered = filtered.sort((a, b) => a.id - b.id)
    } else if (sortBy === 'distance') {
      filtered = filtered.sort((a, b) => (b.distance || 0) - (a.distance || 0))
    }

    setFilteredRoutes(filtered)
  }, [searchTerm, routes, sortBy])

  const handleEdit = (route) => {
    setEditingId(route.id)
    setEditForm({
      originAirportId: route.originAirportId,
      destinationAirportId: route.destinationAirportId,
      distance: route.distance
    })
  }

  const handleSaveEdit = async (id) => {
    if (!editForm.originAirportId || !editForm.destinationAirportId || !editForm.distance) {
      toast.error('All fields are required')
      return
    }

    if (editForm.originAirportId === editForm.destinationAirportId) {
      toast.error('Origin and destination airports must be different')
      return
    }

    try {
      await updateRoute(
        id,
        editForm.originAirportId,
        editForm.destinationAirportId,
        editForm.distance
      )
      toast.success('Route updated successfully')
      setEditingId(null)
      loadData()
    } catch (error) {
      toast.error('Failed to update route')
      console.error(error)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ originAirportId: '', destinationAirportId: '', distance: '' })
  }

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      try {
        await deleteRoute(id)
        toast.success('Route deleted successfully')
        setDeleteConfirm(null)
        loadData()
      } catch (error) {
        toast.error('Failed to delete route')
        console.error(error)
      }
    } else {
      setDeleteConfirm(id)
      toast.warning('Click delete again to confirm')
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  return (
    <div className="passengers-list">
      {/* Header Section */}
      <div className="list-header">
        <div className="list-header-content">
          <h1 className="list-title">
            <FaRoute className="title-icon" />
            Routes Directory
          </h1>
          <p className="list-subtitle">
            Manage and view all registered routes. Search, edit, or delete records.
          </p>
        </div>
        <div className="list-stats">
          <div className="list-stat-item">
            <span className="list-stat-label">Total</span>
            <span className="list-stat-value">{routes.length}</span>
          </div>
          <div className="list-stat-divider"></div>
          <div className="list-stat-item">
            <span className="list-stat-label">Showing</span>
            <span className="list-stat-value">{filteredRoutes.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="list-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by city, airport code, or ID..."
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
            <option value="distance">Distance (High-Low)</option>
          </select>
        </div>
        <Link to="/routes/add" className="add-passenger-btn">
          <FaPlus />
          <span>Add New</span>
        </Link>
      </div>

      {/* Cards Grid Section */}
      {loading ? (
        <div className="list-loading">
          <div className="loading-spinner-large"></div>
          <p>Loading routes...</p>
        </div>
      ) : filteredRoutes.length === 0 ? (
        <div className="list-empty">
          <FaRoute className="empty-icon-large" />
          <h3>No routes found</h3>
          <p>
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first route'}
          </p>
          {!searchTerm && (
            <Link to="/routes/add" className="empty-action-btn">
              <FaPlus /> Add Your First Route
            </Link>
          )}
        </div>
      ) : (
        <div className="passengers-grid">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className={`passenger-card ${editingId === route.id ? 'card-editing' : ''}`}
            >
              {editingId === route.id ? (
                // Edit Mode
                <div className="card-edit-mode">
                  <div className="edit-header">
                    <div className="passenger-avatar-large">RT</div>
                    <span className="edit-badge">Editing</span>
                  </div>

                  <div className="edit-fields">
                    <div className="edit-field">
                      <label>Origin Airport</label>
                      <select
                        value={editForm.originAirportId}
                        onChange={(e) =>
                          setEditForm({ ...editForm, originAirportId: e.target.value })
                        }
                        className="edit-input-field"
                      >
                        <option value="">Select origin airport</option>
                        {airports.map((airport) => (
                          <option key={airport.id} value={airport.id}>
                            {airport.code} - {airport.name} ({airport.city})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="edit-field">
                      <label>Destination Airport</label>
                      <select
                        value={editForm.destinationAirportId}
                        onChange={(e) =>
                          setEditForm({ ...editForm, destinationAirportId: e.target.value })
                        }
                        className="edit-input-field"
                      >
                        <option value="">Select destination airport</option>
                        {airports.map((airport) => (
                          <option key={airport.id} value={airport.id}>
                            {airport.code} - {airport.name} ({airport.city})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="edit-field">
                      <label>Distance (km)</label>
                      <input
                        type="number"
                        value={editForm.distance}
                        onChange={(e) => setEditForm({ ...editForm, distance: e.target.value })}
                        className="edit-input-field"
                        placeholder="Distance in kilometers"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button
                      className="card-btn card-btn-save"
                      onClick={() => handleSaveEdit(route.id)}
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
                      {route.originCode?.substring(0, 2) || 'RT'}
                    </div>
                    <div className="card-id">ID: {route.id}</div>
                  </div>

                  <div className="card-body">
                    <h3 className="passenger-full-name">
                      {route.originCity} → {route.destinationCity}
                    </h3>
                    <div className="passport-info">
                      <FaPlaneDeparture className="passport-icon-card" />
                      <span className="passport-number">
                        {route.originCode} - {route.originName}
                      </span>
                    </div>
                    <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                      <FaPlaneArrival className="passport-icon-card" />
                      <span className="passport-number">
                        {route.destinationCode} - {route.destinationName}
                      </span>
                    </div>
                    <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                      <FaRoad className="passport-icon-card" />
                      <span className="passport-number">{route.distance} km</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button className="card-btn card-btn-edit" onClick={() => handleEdit(route)}>
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      className={`card-btn card-btn-delete ${deleteConfirm === route.id ? 'confirm-state' : ''}`}
                      onClick={() => handleDelete(route.id)}
                    >
                      <FaTrash />
                      <span>{deleteConfirm === route.id ? 'Confirm?' : 'Delete'}</span>
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
