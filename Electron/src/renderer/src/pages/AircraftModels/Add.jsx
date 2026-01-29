// src/pages/AircraftModels/Add.jsx
import { useState } from 'react'
import { addAircraftModel } from '@renderer/apis/AircraftModelsApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaPlus, FaBuilding, FaUsers, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function AddAircraftModel() {
  const [manufacturerName, setManufacturerName] = useState('')
  const [modelName, setModelName] = useState('')
  const [seatCapacity, setSeatCapacity] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}

    if (!manufacturerName || manufacturerName.trim() === '') {
      newErrors.manufacturer = 'Manufacturer name is required'
      toast.error('Please enter a manufacturer name')
    }

    if (!modelName || modelName.trim() === '') {
      newErrors.model = 'Model name is required'
      toast.error('Please enter a model name')
    }

    if (!seatCapacity || seatCapacity <= 0) {
      newErrors.capacity = 'Seat capacity must be greater than 0'
      toast.error('Please enter a valid seat capacity')
    }

    if (seatCapacity && seatCapacity > 1000) {
      newErrors.capacity = 'Seat capacity seems too large (max: 1,000)'
      toast.error('Seat capacity cannot exceed 1,000')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCapacityChange = (e) => {
    const value = e.target.value

    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return
    }

    if (value && parseInt(value) > 1000) {
      toast.warning('Seat capacity cannot exceed 1,000')
      setSeatCapacity('1000')
      return
    }

    setSeatCapacity(value)

    if (errors.capacity && value > 0) {
      setErrors({ ...errors, capacity: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      await addAircraftModel(manufacturerName, modelName, parseInt(seatCapacity))
      toast.success('🏭 Aircraft model added successfully!')
      setTimeout(() => {
        navigate('/aircraft-models/list')
      }, 500)
    } catch (error) {
      console.error('Add model error:', error)
      if (error.message.includes('duplicate')) {
        toast.error('This aircraft model already exists')
      } else {
        toast.error('Failed to add aircraft model. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (manufacturerName || modelName || seatCapacity) {
      setManufacturerName('')
      setModelName('')
      setSeatCapacity('')
      setErrors({})
      toast.info('Form has been reset')
    } else {
      toast.info('Form is already empty')
    }
  }

  return (
    <div className="passengers-add">
      {/* Header */}
      <div className="add-header">
        <button className="back-btn" onClick={() => navigate('/AircraftModels/list')}>
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </button>
        <div className="add-header-content">
          <h1 className="add-title">
            <FaPlus className="title-icon" />
            Add Aircraft Model
          </h1>
          <p className="add-subtitle">
            Fill in the aircraft model details below to add it to your catalog.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <div className="form-card-header">
          <h2>Aircraft Model Information</h2>
          <p>All fields marked with * are required</p>
        </div>

        <form onSubmit={handleSubmit} className="passenger-form">
          {/* Manufacturer Field */}
          <div className="form-group">
            <label htmlFor="manufacturer" className="form-label">
              <FaBuilding className="label-icon" />
              Manufacturer Name *
            </label>
            <input
              id="manufacturer"
              type="text"
              value={manufacturerName}
              onChange={(e) => {
                setManufacturerName(e.target.value)
                if (errors.manufacturer) setErrors({ ...errors, manufacturer: '' })
              }}
              className={`form-input ${errors.manufacturer ? 'input-error' : ''}`}
              placeholder="e.g., Boeing, Airbus, Bombardier"
              disabled={loading}
            />
            {errors.manufacturer && <span className="error-message">{errors.manufacturer}</span>}
            <span className="input-hint">Enter the aircraft manufacturer name</span>
          </div>

          {/* Model Name Field */}
          <div className="form-group">
            <label htmlFor="model" className="form-label">
              <FaBuilding className="label-icon" />
              Model Name *
            </label>
            <input
              id="model"
              type="text"
              value={modelName}
              onChange={(e) => {
                setModelName(e.target.value)
                if (errors.model) setErrors({ ...errors, model: '' })
              }}
              className={`form-input ${errors.model ? 'input-error' : ''}`}
              placeholder="e.g., 737-800, A380, CRJ-900"
              disabled={loading}
            />
            {errors.model && <span className="error-message">{errors.model}</span>}
            <span className="input-hint">Enter the specific model designation</span>
          </div>

          {/* Seat Capacity Field */}
          <div className="form-group">
            <label htmlFor="capacity" className="form-label">
              <FaUsers className="label-icon" />
              Seat Capacity *
            </label>
            <input
              id="capacity"
              type="number"
              value={seatCapacity}
              onChange={handleCapacityChange}
              className={`form-input ${errors.capacity ? 'input-error' : ''}`}
              placeholder="e.g., 189"
              disabled={loading}
              min="1"
              max="1000"
            />
            {errors.capacity && <span className="error-message">{errors.capacity}</span>}
            <span className="input-hint">Enter total seat capacity (1-1,000)</span>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="form-btn form-btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Adding Model...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Add Model</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="form-btn form-btn-reset"
              onClick={handleReset}
              disabled={loading}
            >
              <FaTimes />
              <span>Reset Form</span>
            </button>
          </div>
        </form>

        {/* Preview Card */}
        {(manufacturerName || modelName || seatCapacity) && (
          <div className="preview-card">
            <h3>Preview</h3>
            <div className="preview-content">
              <div className="preview-avatar">{manufacturerName?.substring(0, 2) || 'AM'}</div>
              <div className="preview-details">
                <p className="preview-name">
                  {manufacturerName || 'Manufacturer'} {modelName || 'Model'}
                </p>
                <p className="preview-passport">
                  <FaUsers className="preview-icon" />
                  {seatCapacity || '0'} seats total capacity
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
