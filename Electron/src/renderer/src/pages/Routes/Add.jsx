// src/pages/Routes/Add.jsx
import { useState, useEffect } from 'react'
import { addRoute, fetchAirportsForDropdown } from '@renderer/apis/RoutesApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FaPlus,
  FaRoute,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaRoad,
  FaArrowLeft,
  FaSave,
  FaTimes
} from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function AddRoute() {
  const [originAirportId, setOriginAirportId] = useState('')
  const [destinationAirportId, setDestinationAirportId] = useState('')
  const [distance, setDistance] = useState('')
  const [airports, setAirports] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingAirports, setLoadingAirports] = useState(true)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const loadAirports = async () => {
      try {
        setLoadingAirports(true)
        const data = await fetchAirportsForDropdown()
        setAirports(data || [])
      } catch (error) {
        toast.error('Failed to load airports')
        console.error(error)
      } finally {
        setLoadingAirports(false)
      }
    }
    loadAirports()
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!originAirportId) {
      newErrors.origin = 'Origin airport is required'
      toast.error('Please select an origin airport')
    }

    if (!destinationAirportId) {
      newErrors.destination = 'Destination airport is required'
      toast.error('Please select a destination airport')
    }

    if (originAirportId && destinationAirportId && originAirportId === destinationAirportId) {
      newErrors.destination = 'Origin and destination must be different'
      toast.error('Origin and destination airports must be different')
    }

    if (!distance || distance <= 0) {
      newErrors.distance = 'Distance must be greater than 0'
      toast.error('Please enter a valid distance')
    }

    if (distance && distance > 20000) {
      newErrors.distance = 'Distance seems too large (max: 20,000 km)'
      toast.error('Distance cannot exceed 20,000 km')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDistanceChange = (e) => {
    const value = e.target.value

    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return
    }

    if (value && parseInt(value) > 20000) {
      toast.warning('Distance cannot exceed 20,000 km')
      setDistance('20000')
      return
    }

    setDistance(value)

    if (errors.distance && value > 0) {
      setErrors({ ...errors, distance: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      await addRoute(originAirportId, destinationAirportId, parseInt(distance))
      toast.success('🗺️ Route added successfully!')
      setTimeout(() => {
        navigate('/routes/list')
      }, 500)
    } catch (error) {
      console.error('Add route error:', error)
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        toast.error('This route already exists in the system')
      } else {
        toast.error('Failed to add route. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (originAirportId || destinationAirportId || distance) {
      setOriginAirportId('')
      setDestinationAirportId('')
      setDistance('')
      setErrors({})
      toast.info('Form has been reset')
    } else {
      toast.info('Form is already empty')
    }
  }

  // Get selected airport details for preview
  const originAirport = airports.find((a) => a.id.toString() === originAirportId)
  const destinationAirport = airports.find((a) => a.id.toString() === destinationAirportId)

  return (
    <div className="passengers-add">
      {/* Header */}
      <div className="add-header">
        <button className="back-btn" onClick={() => navigate('/routes')}>
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </button>
        <div className="add-header-content">
          <h1 className="add-title">
            <FaPlus className="title-icon" />
            Add New Route
          </h1>
          <p className="add-subtitle">
            Fill in the route details below to connect two airports in the system.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <div className="form-card-header">
          <h2>Route Information</h2>
          <p>All fields marked with * are required</p>
        </div>

        <form onSubmit={handleSubmit} className="passenger-form">
          {/* Origin Airport Field */}
          <div className="form-group">
            <label htmlFor="origin" className="form-label">
              <FaPlaneDeparture className="label-icon" />
              Origin Airport *
            </label>
            {loadingAirports ? (
              <div
                className="form-input"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
                <span>Loading airports...</span>
              </div>
            ) : (
              <select
                id="origin"
                value={originAirportId}
                onChange={(e) => {
                  setOriginAirportId(e.target.value)
                  if (errors.origin) setErrors({ ...errors, origin: '' })
                }}
                className={`form-input ${errors.origin ? 'input-error' : ''}`}
                disabled={loading}
              >
                <option value="">Select origin airport</option>
                {airports.map((airport) => (
                  <option key={airport.id} value={airport.id}>
                    {airport.code} - {airport.name} ({airport.city})
                  </option>
                ))}
              </select>
            )}
            {errors.origin && <span className="error-message">{errors.origin}</span>}
            <span className="input-hint">Select the starting point of the route</span>
          </div>

          {/* Destination Airport Field */}
          <div className="form-group">
            <label htmlFor="destination" className="form-label">
              <FaPlaneArrival className="label-icon" />
              Destination Airport *
            </label>
            {loadingAirports ? (
              <div
                className="form-input"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
                <span>Loading airports...</span>
              </div>
            ) : (
              <select
                id="destination"
                value={destinationAirportId}
                onChange={(e) => {
                  setDestinationAirportId(e.target.value)
                  if (errors.destination) setErrors({ ...errors, destination: '' })
                }}
                className={`form-input ${errors.destination ? 'input-error' : ''}`}
                disabled={loading}
              >
                <option value="">Select destination airport</option>
                {airports.map((airport) => (
                  <option key={airport.id} value={airport.id}>
                    {airport.code} - {airport.name} ({airport.city})
                  </option>
                ))}
              </select>
            )}
            {errors.destination && <span className="error-message">{errors.destination}</span>}
            <span className="input-hint">
              Select the ending point of the route (must be different from origin)
            </span>
          </div>

          {/* Distance Field */}
          <div className="form-group">
            <label htmlFor="distance" className="form-label">
              <FaRoad className="label-icon" />
              Distance (km) *
            </label>
            <input
              id="distance"
              type="number"
              value={distance}
              onChange={handleDistanceChange}
              className={`form-input ${errors.distance ? 'input-error' : ''}`}
              placeholder="Enter distance in kilometers (e.g., 1200)"
              disabled={loading}
              min="1"
              max="20000"
            />
            {errors.distance && <span className="error-message">{errors.distance}</span>}
            <span className="input-hint">Enter the distance between airports (1-20,000 km)</span>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="form-btn form-btn-submit"
              disabled={loading || loadingAirports}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Adding Route...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Add Route</span>
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
        {(originAirport || destinationAirport || distance) && (
          <div className="preview-card">
            <h3>Preview</h3>
            <div className="preview-content">
              <div className="preview-avatar">{originAirport?.code?.substring(0, 2) || 'RT'}</div>
              <div className="preview-details">
                <p className="preview-name">
                  {originAirport?.city || 'Origin'} → {destinationAirport?.city || 'Destination'}
                </p>
                <p className="preview-passport">
                  <FaRoute className="preview-icon" />
                  {originAirport?.code || 'XXX'} to {destinationAirport?.code || 'XXX'} •{' '}
                  {distance || '0'} km
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
