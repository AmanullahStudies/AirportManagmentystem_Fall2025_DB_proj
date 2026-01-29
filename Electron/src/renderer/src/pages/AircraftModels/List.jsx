// src/pages/AircraftModels/List.jsx
import { useEffect, useState } from 'react'
import {
  fetchAircraftModels,
  deleteAircraftModel,
  updateAircraftModel
} from '@renderer/apis/AircraftModelsApi'
import { toast } from 'react-toastify'
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaBuilding,
  FaUsers,
  FaSort,
  FaPlus
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function AircraftModelsList() {
  const [models, setModels] = useState([])
  const [filteredModels, setFilteredModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    manufacturerName: '',
    modelName: '',
    seatCapacity: ''
  })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await fetchAircraftModels()
      setModels(data || [])
      setFilteredModels(data || [])
    } catch (error) {
      toast.error('Failed to load aircraft models')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = models.filter(
      (m) =>
        m.manufacturerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id?.toString().includes(searchTerm)
    )

    // Apply sorting
    if (sortBy === 'newest') {
      filtered = filtered.sort((a, b) => b.id - a.id)
    } else if (sortBy === 'oldest') {
      filtered = filtered.sort((a, b) => a.id - b.id)
    } else if (sortBy === 'capacity') {
      filtered = filtered.sort((a, b) => (b.seatCapacity || 0) - (a.seatCapacity || 0))
    }

    setFilteredModels(filtered)
  }, [searchTerm, models, sortBy])

  const handleEdit = (model) => {
    setEditingId(model.id)
    setEditForm({
      manufacturerName: model.manufacturerName,
      modelName: model.modelName,
      seatCapacity: model.seatCapacity
    })
  }

  const handleSaveEdit = async (id) => {
    if (!editForm.manufacturerName || !editForm.modelName || !editForm.seatCapacity) {
      toast.error('All fields are required')
      return
    }

    if (editForm.seatCapacity <= 0) {
      toast.error('Seat capacity must be greater than 0')
      return
    }

    try {
      await updateAircraftModel(
        id,
        editForm.manufacturerName,
        editForm.modelName,
        editForm.seatCapacity
      )
      toast.success('Aircraft model updated successfully')
      setEditingId(null)
      loadData()
    } catch (error) {
      toast.error('Failed to update aircraft model')
      console.error(error)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ manufacturerName: '', modelName: '', seatCapacity: '' })
  }

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      try {
        await deleteAircraftModel(id)
        toast.success('Aircraft model deleted successfully')
        setDeleteConfirm(null)
        loadData()
      } catch (error) {
        toast.error('Failed to delete aircraft model')
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
            <FaBuilding className="title-icon" />
            Aircraft Models Directory
          </h1>
          <p className="list-subtitle">
            Manage and view all aircraft models. Search, edit, or delete records.
          </p>
        </div>
        <div className="list-stats">
          <div className="list-stat-item">
            <span className="list-stat-label">Total</span>
            <span className="list-stat-value">{models.length}</span>
          </div>
          <div className="list-stat-divider"></div>
          <div className="list-stat-item">
            <span className="list-stat-label">Showing</span>
            <span className="list-stat-value">{filteredModels.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="list-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by manufacturer or model name..."
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
            <option value="capacity">Capacity (High-Low)</option>
          </select>
        </div>
        <Link to="/aircraft-models/add" className="add-passenger-btn">
          <FaPlus />
          <span>Add New</span>
        </Link>
      </div>

      {/* Cards Grid Section */}
      {loading ? (
        <div className="list-loading">
          <div className="loading-spinner-large"></div>
          <p>Loading aircraft models...</p>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="list-empty">
          <FaBuilding className="empty-icon-large" />
          <h3>No aircraft models found</h3>
          <p>
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Start by adding your first aircraft model'}
          </p>
          {!searchTerm && (
            <Link to="/aircraft-models/add" className="empty-action-btn">
              <FaPlus /> Add Your First Model
            </Link>
          )}
        </div>
      ) : (
        <div className="passengers-grid">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className={`passenger-card ${editingId === model.id ? 'card-editing' : ''}`}
            >
              {editingId === model.id ? (
                // Edit Mode
                <div className="card-edit-mode">
                  <div className="edit-header">
                    <div className="passenger-avatar-large">AM</div>
                    <span className="edit-badge">Editing</span>
                  </div>

                  <div className="edit-fields">
                    <div className="edit-field">
                      <label>Manufacturer Name</label>
                      <input
                        type="text"
                        value={editForm.manufacturerName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, manufacturerName: e.target.value })
                        }
                        className="edit-input-field"
                        placeholder="e.g., Boeing"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Model Name</label>
                      <input
                        type="text"
                        value={editForm.modelName}
                        onChange={(e) => setEditForm({ ...editForm, modelName: e.target.value })}
                        className="edit-input-field"
                        placeholder="e.g., 737-800"
                      />
                    </div>
                    <div className="edit-field">
                      <label>Seat Capacity</label>
                      <input
                        type="number"
                        value={editForm.seatCapacity}
                        onChange={(e) => setEditForm({ ...editForm, seatCapacity: e.target.value })}
                        className="edit-input-field"
                        placeholder="e.g., 189"
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button
                      className="card-btn card-btn-save"
                      onClick={() => handleSaveEdit(model.id)}
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
                      {model.manufacturerName?.substring(0, 2) || 'AM'}
                    </div>
                    <div className="card-id">ID: {model.id}</div>
                  </div>

                  <div className="card-body">
                    <h3 className="passenger-full-name">{model.manufacturerName}</h3>
                    <div className="passport-info">
                      <FaBuilding className="passport-icon-card" />
                      <span className="passport-number">Model: {model.modelName}</span>
                    </div>
                    <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                      <FaUsers className="passport-icon-card" />
                      <span className="passport-number">Capacity: {model.seatCapacity} Seats</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button className="card-btn card-btn-edit" onClick={() => handleEdit(model)}>
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      className={`card-btn card-btn-delete ${deleteConfirm === model.id ? 'confirm-state' : ''}`}
                      onClick={() => handleDelete(model.id)}
                    >
                      <FaTrash />
                      <span>{deleteConfirm === model.id ? 'Confirm?' : 'Delete'}</span>
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
