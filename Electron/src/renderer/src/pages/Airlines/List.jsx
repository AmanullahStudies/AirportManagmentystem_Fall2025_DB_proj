// src/pages/Airlines/List.jsx
import { useEffect, useState } from 'react'
import { fetchAirlines, deleteAirline, updateAirline } from '@renderer/apis/AirlinesApi'
import { toast } from 'react-toastify'
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaPlane,
  FaGlobe,
  FaSort,
  FaPlus
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function AirlinesList() {
  const [airlines, setAirlines] = useState([])
  const [filteredAirlines, setFilteredAirlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', code: '', country: '' })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await fetchAirlines()
      setAirlines(data || [])
      setFilteredAirlines(data || [])
    } catch (error) {
      toast.error('Failed to load airlines')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = airlines.filter(
      (a) =>
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    }

    setFilteredAirlines(filtered)
  }, [searchTerm, airlines, sortBy])

  const handleEdit = (airline) => {
    setEditingId(airline.id)
    setEditForm({
      name: airline.name,
      code: airline.code,
      country: airline.country
    })
  }

  const handleSaveEdit = async (id) => {
    if (!editForm.name.trim() || !editForm.code.trim() || !editForm.country.trim()) {
      toast.error('All fields are required')
      return
    }

    try {
      await updateAirline(id, editForm.name, editForm.code, editForm.country)
      toast.success('Airline updated successfully')
      setEditingId(null)
      loadData()
    } catch (error) {
      toast.error('Failed to update airline')
      console.error(error)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ name: '', code: '', country: '' })
  }

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      try {
        await deleteAirline(id)
        toast.success('Airline deleted successfully')
        setDeleteConfirm(null)
        loadData()
      } catch (error) {
        toast.error('Failed to delete airline')
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
            <FaPlane className="title-icon" />
            Airlines Directory
          </h1>
          <p className="list-subtitle">
            Manage and view all registered airlines. Search, edit, or delete records.
          </p>
        </div>
        <div className="list-stats">
          <div className="list-stat-item">
            <span className="list-stat-label">Total</span>
            <span className="list-stat-value">{airlines.length}</span>
          </div>
          <div className="list-stat-divider"></div>
          <div className="list-stat-item">
            <span className="list-stat-label">Showing</span>
            <span className="list-stat-value">{filteredAirlines.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="list-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, code, country, or ID..."
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
          </select>
        </div>
        <Link to="/airlines/add" className="add-passenger-btn">
          <FaPlus />
          <span>Add New</span>
        </Link>
      </div>

      {/* Cards Grid Section */}
      {loading ? (
        <div className="list-loading">
          <div className="loading-spinner-large"></div>
          <p>Loading airlines...</p>
        </div>
      ) : filteredAirlines.length === 0 ? (
        <div className="list-empty">
          <FaPlane className="empty-icon-large" />
          <h3>No airlines found</h3>
          <p>
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first airline'}
          </p>
          {!searchTerm && (
            <Link to="/airlines/add" className="empty-action-btn">
              <FaPlus /> Add Your First Airline
            </Link>
          )}
        </div>
      ) : (
        <div className="passengers-grid">
          {filteredAirlines.map((airline) => (
            <div
              key={airline.id}
              className={`passenger-card ${editingId === airline.id ? 'card-editing' : ''}`}
            >
              {editingId === airline.id ? (
                // Edit Mode
                <div className="card-edit-mode">
                  <div className="edit-header">
                    <div className="passenger-avatar-large">
                      {editForm.code?.substring(0, 2) || 'AL'}
                    </div>
                    <span className="edit-badge">Editing</span>
                  </div>

                  <div className="edit-fields">
                    <div className="edit-field">
                      <label>Airline Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="edit-input-field"
                        placeholder="Airline name"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Airline Code</label>
                      <input
                        type="text"
                        value={editForm.code}
                        onChange={(e) =>
                          setEditForm({ ...editForm, code: e.target.value.toUpperCase() })
                        }
                        className="edit-input-field"
                        placeholder="e.g., AA, BA, PK"
                        maxLength={3}
                      />
                    </div>
                    <div className="edit-field">
                      <label>Country</label>
                      <input
                        type="text"
                        value={editForm.country}
                        onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                        className="edit-input-field"
                        placeholder="Country"
                      />
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button
                      className="card-btn card-btn-save"
                      onClick={() => handleSaveEdit(airline.id)}
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
                      {airline.code?.substring(0, 2) || 'AL'}
                    </div>
                    <div className="card-id">ID: {airline.id}</div>
                  </div>

                  <div className="card-body">
                    <h3 className="passenger-full-name">{airline.name}</h3>
                    <div className="passport-info">
                      <FaPlane className="passport-icon-card" />
                      <span className="passport-number">{airline.code}</span>
                    </div>
                    <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                      <FaGlobe className="passport-icon-card" />
                      <span className="passport-number">{airline.country}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button className="card-btn card-btn-edit" onClick={() => handleEdit(airline)}>
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      className={`card-btn card-btn-delete ${deleteConfirm === airline.id ? 'confirm-state' : ''}`}
                      onClick={() => handleDelete(airline.id)}
                    >
                      <FaTrash />
                      <span>{deleteConfirm === airline.id ? 'Confirm?' : 'Delete'}</span>
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
