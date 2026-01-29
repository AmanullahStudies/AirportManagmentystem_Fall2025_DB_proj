// src/pages/Passengers/List.jsx
import { useEffect, useState } from 'react'
import { fetchPassengers, deletePassenger, updatePassenger } from '@renderer/apis/PassengersApi'
import { toast } from 'react-toastify'
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaUserCircle,
  FaPassport,
  FaSort,
  FaPlus
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function PassengerList() {
  const [passengers, setPassengers] = useState([])
  const [filteredPassengers, setFilteredPassengers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', passport: '' })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await fetchPassengers()
      setPassengers(data || [])
      setFilteredPassengers(data || [])
    } catch (error) {
      toast.error('Failed to load passengers')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = passengers.filter(
      (p) =>
        p.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.passport?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id?.toString().includes(searchTerm)
    )

    // Apply sorting
    if (sortBy === 'newest') {
      filtered = filtered.sort((a, b) => b.id - a.id)
    } else if (sortBy === 'oldest') {
      filtered = filtered.sort((a, b) => a.id - b.id)
    } else if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''))
    }

    setFilteredPassengers(filtered)
  }, [searchTerm, passengers, sortBy])

  const handleEdit = (passenger) => {
    setEditingId(passenger.id)
    setEditForm({
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      passport: passenger.passport
    })
  }

  const handleSaveEdit = async (id) => {
    if (!editForm.firstName.trim() || !editForm.lastName.trim() || !editForm.passport.trim()) {
      toast.error('All fields are required')
      return
    }

    try {
      await updatePassenger(id, editForm.firstName, editForm.lastName, editForm.passport)
      toast.success('Passenger updated successfully')
      setEditingId(null)
      loadData()
    } catch (error) {
      toast.error('Failed to update passenger')
      console.error(error)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ firstName: '', lastName: '', passport: '' })
  }

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      try {
        await deletePassenger(id)
        toast.success('Passenger deleted successfully')
        setDeleteConfirm(null)
        loadData()
      } catch (error) {
        toast.error('Failed to delete passenger')
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
            <FaUserCircle className="title-icon" />
            Passenger Directory
          </h1>
          <p className="list-subtitle">
            Manage and view all registered passengers. Search, edit, or delete records.
          </p>
        </div>
        <div className="list-stats">
          <div className="list-stat-item">
            <span className="list-stat-label">Total</span>
            <span className="list-stat-value">{passengers.length}</span>
          </div>
          <div className="list-stat-divider"></div>
          <div className="list-stat-item">
            <span className="list-stat-label">Showing</span>
            <span className="list-stat-value">{filteredPassengers.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="list-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, passport, or ID..."
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
        <Link to="/passengers/add" className="add-passenger-btn">
          <FaPlus />
          <span>Add New</span>
        </Link>
      </div>

      {/* Cards Grid Section */}
      {loading ? (
        <div className="list-loading">
          <div className="loading-spinner-large"></div>
          <p>Loading passengers...</p>
        </div>
      ) : filteredPassengers.length === 0 ? (
        <div className="list-empty">
          <FaUserCircle className="empty-icon-large" />
          <h3>No passengers found</h3>
          <p>
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Start by adding your first passenger'}
          </p>
          {!searchTerm && (
            <Link to="/passengers/add" className="empty-action-btn">
              <FaPlus /> Add Your First Passenger
            </Link>
          )}
        </div>
      ) : (
        <div className="passengers-grid">
          {filteredPassengers.map((passenger) => (
            <div
              key={passenger.id}
              className={`passenger-card ${editingId === passenger.id ? 'card-editing' : ''}`}
            >
              {editingId === passenger.id ? (
                // Edit Mode
                <div className="card-edit-mode">
                  <div className="edit-header">
                    <div className="passenger-avatar-large">
                      {editForm.firstName?.charAt(0) || 'P'}
                      {editForm.lastName?.charAt(0) || 'X'}
                    </div>
                    <span className="edit-badge">Editing</span>
                  </div>

                  <div className="edit-fields">
                    <div className="edit-field">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        className="edit-input-field"
                        placeholder="First name"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        className="edit-input-field"
                        placeholder="Last name"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Passport Number</label>
                      <input
                        type="text"
                        value={editForm.passport}
                        onChange={(e) =>
                          setEditForm({ ...editForm, passport: e.target.value.toUpperCase() })
                        }
                        className="edit-input-field"
                        placeholder="Passport"
                      />
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button
                      className="card-btn card-btn-save"
                      onClick={() => handleSaveEdit(passenger.id)}
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
                      {passenger.firstName?.charAt(0) || 'P'}
                      {passenger.lastName?.charAt(0) || 'X'}
                    </div>
                    <div className="card-id">ID: {passenger.id}</div>
                  </div>

                  <div className="card-body">
                    <h3 className="passenger-full-name">
                      {passenger.firstName} {passenger.lastName}
                    </h3>
                    <div className="passport-info">
                      <FaPassport className="passport-icon-card" />
                      <span className="passport-number">{passenger.passport}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button
                      className="card-btn card-btn-edit"
                      onClick={() => handleEdit(passenger)}
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      className={`card-btn card-btn-delete ${deleteConfirm === passenger.id ? 'confirm-state' : ''}`}
                      onClick={() => handleDelete(passenger.id)}
                    >
                      <FaTrash />
                      <span>{deleteConfirm === passenger.id ? 'Confirm?' : 'Delete'}</span>
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
