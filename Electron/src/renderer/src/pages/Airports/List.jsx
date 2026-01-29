// src/pages/Airports/List.jsx
import { useEffect, useState } from 'react'
import { fetchAirports, deleteAirport, updateAirport } from '@renderer/apis/AirportsApi'
import { toast } from 'react-toastify'
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaPlaneArrival,
  FaCity,
  FaGlobe,
  FaSort,
  FaPlus
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function AirportsList() {
  const [airports, setAirports] = useState([])
  const [filteredAirports, setFilteredAirports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', code: '', city: '', country: '' })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await fetchAirports()
      setAirports(data || [])
      setFilteredAirports(data || [])
    } catch (error) {
      toast.error('Failed to load airports')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = airports.filter(
      (a) =>
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id?.toString().includes(searchTerm)
    )

    // Apply sorting
    if (sortBy === 'newest') {
      filtered = filtered.sort((a, b) => b.id - a.id)
    } else if (sortBy === 'oldest') {
      filtered = filtered.sort((a, b) => a.id - b.id)
    } else if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else if (sortBy === 'city') {
      filtered = filtered.sort((a, b) => (a.city || '').localeCompare(b.city || ''))
    }

    setFilteredAirports(filtered)
  }, [searchTerm, airports, sortBy])

  const handleEdit = (airport) => {
    setEditingId(airport.id)
    setEditForm({
      name: airport.name,
      code: airport.code,
      city: airport.city,
      country: airport.country
    })
  }

  const handleSaveEdit = async (id) => {
    if (
      !editForm.name.trim() ||
      !editForm.code.trim() ||
      !editForm.city.trim() ||
      !editForm.country.trim()
    ) {
      toast.error('All fields are required')
      return
    }

    try {
      await updateAirport(id, editForm.name, editForm.code, editForm.city, editForm.country)
      toast.success('Airport updated successfully')
      setEditingId(null)
      loadData()
    } catch (error) {
      toast.error('Failed to update airport')
      console.error(error)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', code: '', city: '', country: '' })
  }

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      try {
        await deleteAirport(id)
        toast.success('Airport deleted successfully')
        setDeleteConfirm(null)
        loadData()
      } catch (error) {
        toast.error('Failed to delete airport')
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
            <FaPlaneArrival className="title-icon" />
            Airports Directory
          </h1>
          <p className="list-subtitle">
            Manage and view all registered airports. Search, edit, or delete records.
          </p>
        </div>
        <div className="list-stats">
          <div className="list-stat-item">
            <span className="list-stat-label">Total</span>
            <span className="list-stat-value">{airports.length}</span>
          </div>
          <div className="list-stat-divider"></div>
          <div className="list-stat-item">
            <span className="list-stat-label">Showing</span>
            <span className="list-stat-value">{filteredAirports.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="list-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, code, city, country, or ID..."
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
            <option value="name">Name (A-Z)</option>
            <option value="city">City (A-Z)</option>
          </select>
        </div>
        <Link to="/airports/add" className="add-passenger-btn">
          <FaPlus />
          <span>Add New</span>
        </Link>
      </div>

      {/* Cards Grid Section */}
      {loading ? (
        <div className="list-loading">
          <div className="loading-spinner-large"></div>
          <p>Loading airports...</p>
        </div>
      ) : filteredAirports.length === 0 ? (
        <div className="list-empty">
          <FaPlaneArrival className="empty-icon-large" />
          <h3>No airports found</h3>
          <p>
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first airport'}
          </p>
          {!searchTerm && (
            <Link to="/airports/add" className="empty-action-btn">
              <FaPlus /> Add Your First Airport
            </Link>
          )}
        </div>
      ) : (
        <div className="passengers-grid">
          {filteredAirports.map((airport) => (
            <div
              key={airport.id}
              className={`passenger-card ${editingId === airport.id ? 'card-editing' : ''}`}
            >
              {editingId === airport.id ? (
                // Edit Mode
                <div className="card-edit-mode">
                  <div className="edit-header">
                    <div className="passenger-avatar-large">
                      {editForm.code?.substring(0, 2) || 'AP'}
                    </div>
                    <span className="edit-badge">Editing</span>
                  </div>

                  <div className="edit-fields">
                    <div className="edit-field">
                      <label>Airport Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="edit-input-field"
                        placeholder="Airport name"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Airport Code</label>
                      <input
                        type="text"
                        value={editForm.code}
                        onChange={(e) =>
                          setEditForm({ ...editForm, code: e.target.value.toUpperCase() })
                        }
                        className="edit-input-field"
                        placeholder="e.g., LHE, JFK, DXB"
                        maxLength={10}
                      />
                    </div>
                    <div className="edit-field">
                      <label>City</label>
                      <input
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="edit-input-field"
                        placeholder="City name"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Country</label>
                      <input
                        type="text"
                        value={editForm.country}
                        onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                        className="edit-input-field"
                        placeholder="Country name"
                      />
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button
                      className="card-btn card-btn-save"
                      onClick={() => handleSaveEdit(airport.id)}
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
                      {airport.code?.substring(0, 2) || 'AP'}
                    </div>
                    <div className="card-id">ID: {airport.id}</div>
                  </div>

                  <div className="card-body">
                    <h3 className="passenger-full-name">{airport.name}</h3>
                    <div className="passport-info">
                      <FaPlaneArrival className="passport-icon-card" />
                      <span className="passport-number">{airport.code}</span>
                    </div>
                    <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                      <FaCity className="passport-icon-card" />
                      <span className="passport-number">{airport.city}</span>
                    </div>
                    <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                      <FaGlobe className="passport-icon-card" />
                      <span className="passport-number">{airport.country}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button className="card-btn card-btn-edit" onClick={() => handleEdit(airport)}>
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      className={`card-btn card-btn-delete ${deleteConfirm === airport.id ? 'confirm-state' : ''}`}
                      onClick={() => handleDelete(airport.id)}
                    >
                      <FaTrash />
                      <span>{deleteConfirm === airport.id ? 'Confirm?' : 'Delete'}</span>
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
