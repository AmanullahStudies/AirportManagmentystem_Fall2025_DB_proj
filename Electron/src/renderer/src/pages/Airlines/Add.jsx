// src/pages/Airlines/Add.jsx
import { useState } from 'react'
import { addAirline } from '@renderer/apis/AirlinesApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaPlus, FaPlane, FaGlobe, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function AddAirline() {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  // Validation helpers
  const validateName = (airlineName) => {
    const trimmedName = airlineName.trim()

    if (!trimmedName) {
      return 'Airline name is required'
    }

    if (trimmedName.length < 2) {
      return 'Airline name must be at least 2 characters'
    }

    if (trimmedName.length > 100) {
      return 'Airline name must not exceed 100 characters'
    }

    // Allow letters, numbers, spaces, hyphens, apostrophes, ampersands, and periods
    const nameRegex = /^[a-zA-Z0-9\s\-'.&]+$/
    if (!nameRegex.test(trimmedName)) {
      return 'Airline name can only contain letters, numbers, spaces, hyphens, apostrophes, ampersands, and periods'
    }

    return null
  }

  const validateCode = (airlineCode) => {
    const trimmedCode = airlineCode.trim()

    if (!trimmedCode) {
      return 'Airline code is required'
    }

    if (trimmedCode.length < 2) {
      return 'Airline code must be at least 2 characters'
    }

    if (trimmedCode.length > 3) {
      return 'Airline code must not exceed 3 characters'
    }

    // Airline codes are typically 2-3 uppercase letters
    const codeRegex = /^[A-Z0-9]+$/
    if (!codeRegex.test(trimmedCode)) {
      return 'Airline code can only contain uppercase letters and numbers'
    }

    return null
  }

  const validateCountry = (countryName) => {
    const trimmedCountry = countryName.trim()

    if (!trimmedCountry) {
      return 'Country is required'
    }

    if (trimmedCountry.length < 2) {
      return 'Country name must be at least 2 characters'
    }

    if (trimmedCountry.length > 60) {
      return 'Country name must not exceed 60 characters'
    }

    // Allow letters, spaces, hyphens, and apostrophes
    const countryRegex = /^[a-zA-Z\s\-']+$/
    if (!countryRegex.test(trimmedCountry)) {
      return 'Country name can only contain letters, spaces, hyphens, and apostrophes'
    }

    return null
  }

  const validateForm = () => {
    const newErrors = {}

    const nameError = validateName(name)
    if (nameError) newErrors.name = nameError

    const codeError = validateCode(code)
    if (codeError) newErrors.code = codeError

    const countryError = validateCountry(country)
    if (countryError) newErrors.country = countryError

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => toast.error(error))
    }

    return Object.keys(newErrors).length === 0
  }

  // Real-time input handlers
  const handleNameChange = (e) => {
    let value = e.target.value

    // Block invalid characters
    value = value.replace(/[^a-zA-Z0-9\s\-'.&]/g, '')

    // Prevent consecutive spaces
    value = value.replace(/\s{2,}/g, ' ')

    if (value.length > 100) {
      toast.warning('Airline name cannot exceed 100 characters')
      value = value.substring(0, 100)
    }

    setName(value)

    if (errors.name && value.trim().length >= 2) {
      setErrors({ ...errors, name: '' })
    }
  }

  const handleCodeChange = (e) => {
    let value = e.target.value.toUpperCase()

    // Only allow alphanumeric
    value = value.replace(/[^A-Z0-9]/g, '')

    if (value.length > 3) {
      toast.warning('Airline code cannot exceed 3 characters')
      value = value.substring(0, 3)
    }

    setCode(value)

    if (errors.code && value.length >= 2) {
      setErrors({ ...errors, code: '' })
    }
  }

  const handleCountryChange = (e) => {
    let value = e.target.value

    // Block numbers and special characters (except space, hyphen, apostrophe)
    value = value.replace(/[^a-zA-Z\s\-']/g, '')

    // Prevent consecutive spaces
    value = value.replace(/\s{2,}/g, ' ')

    if (value.length > 60) {
      toast.warning('Country name cannot exceed 60 characters')
      value = value.substring(0, 60)
    }

    setCountry(value)

    if (errors.country && value.trim().length >= 2) {
      setErrors({ ...errors, country: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix all errors before submitting')
      return
    }

    const sanitizedName = name.trim()
    const sanitizedCode = code.trim()
    const sanitizedCountry = country.trim()

    if (!sanitizedName || !sanitizedCode || !sanitizedCountry) {
      toast.error('All fields must be filled')
      return
    }

    try {
      setLoading(true)
      await addAirline(sanitizedName, sanitizedCode, sanitizedCountry)
      toast.success('✈️ Airline added successfully!')
      setTimeout(() => {
        navigate('/airlines/list')
      }, 500)
    } catch (error) {
      console.error('Add airline error:', error)
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        toast.error('This airline already exists in the system')
      } else {
        toast.error('Failed to add airline. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (name || code || country) {
      setName('')
      setCode('')
      setCountry('')
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
        <button className="back-btn" onClick={() => navigate('/airlines')}>
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </button>
        <div className="add-header-content">
          <h1 className="add-title">
            <FaPlus className="title-icon" />
            Add New Airline
          </h1>
          <p className="add-subtitle">
            Fill in the airline details below to register a new airline in the system.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <div className="form-card-header">
          <h2>Airline Information</h2>
          <p>All fields marked with * are required</p>
        </div>

        <form onSubmit={handleSubmit} className="passenger-form">
          {/* Airline Name Field */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <FaPlane className="label-icon" />
              Airline Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="Enter airline name (e.g., Pakistan International Airlines)"
              disabled={loading}
              autoComplete="organization"
              maxLength={100}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
            <span className="input-hint">
              Letters, numbers, spaces, and common punctuation allowed (2-100 characters)
            </span>
          </div>

          {/* Airline Code Field */}
          <div className="form-group">
            <label htmlFor="code" className="form-label">
              <FaPlane className="label-icon" />
              Airline Code *
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              className={`form-input ${errors.code ? 'input-error' : ''}`}
              placeholder="Enter airline code (e.g., PK, AA, BA)"
              disabled={loading}
              autoComplete="off"
              maxLength={3}
            />
            {errors.code && <span className="error-message">{errors.code}</span>}
            <span className="input-hint">
              2-3 uppercase letters/numbers (e.g., AA for American Airlines, PK for PIA)
            </span>
          </div>

          {/* Country Field */}
          <div className="form-group">
            <label htmlFor="country" className="form-label">
              <FaGlobe className="label-icon" />
              Country *
            </label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={handleCountryChange}
              className={`form-input ${errors.country ? 'input-error' : ''}`}
              placeholder="Enter country name (e.g., Pakistan, United States)"
              disabled={loading}
              autoComplete="country-name"
              maxLength={60}
            />
            {errors.country && <span className="error-message">{errors.country}</span>}
            <span className="input-hint">
              Only letters, spaces, hyphens, and apostrophes allowed (2-60 characters)
            </span>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="form-btn form-btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Adding Airline...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Add Airline</span>
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
        {(name || code || country) && (
          <div className="preview-card">
            <h3>Preview</h3>
            <div className="preview-content">
              <div className="preview-avatar">{code?.substring(0, 2) || 'AL'}</div>
              <div className="preview-details">
                <p className="preview-name">{name || 'Airline Name'}</p>
                <p className="preview-passport">
                  <FaPlane className="preview-icon" />
                  {code || 'XX'} • {country || 'Country'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
