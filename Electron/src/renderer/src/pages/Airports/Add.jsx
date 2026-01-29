// src/pages/Airports/Add.jsx
import { useState } from 'react'
import { addAirport } from '@renderer/apis/AirportsApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FaPlus,
  FaPlaneArrival,
  FaCity,
  FaGlobe,
  FaArrowLeft,
  FaSave,
  FaTimes
} from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function AddAirport() {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  // Validation helpers
  const validateName = (airportName) => {
    const trimmedName = airportName.trim()

    if (!trimmedName) {
      return 'Airport name is required'
    }

    if (trimmedName.length < 3) {
      return 'Airport name must be at least 3 characters'
    }

    if (trimmedName.length > 100) {
      return 'Airport name must not exceed 100 characters'
    }

    // Allow letters, numbers, spaces, hyphens, apostrophes, parentheses, and periods
    const nameRegex = /^[a-zA-Z0-9\s\-'.()]+$/
    if (!nameRegex.test(trimmedName)) {
      return 'Airport name can only contain letters, numbers, spaces, and common punctuation'
    }

    return null
  }

  const validateCode = (airportCode) => {
    const trimmedCode = airportCode.trim()

    if (!trimmedCode) {
      return 'Airport code is required'
    }

    if (trimmedCode.length < 3) {
      return 'Airport code must be at least 3 characters'
    }

    if (trimmedCode.length > 10) {
      return 'Airport code must not exceed 10 characters'
    }

    // Airport codes are typically 3-4 uppercase letters (IATA/ICAO)
    const codeRegex = /^[A-Z0-9]+$/
    if (!codeRegex.test(trimmedCode)) {
      return 'Airport code can only contain uppercase letters and numbers'
    }

    return null
  }

  const validateCity = (cityName) => {
    const trimmedCity = cityName.trim()

    if (!trimmedCity) {
      return 'City name is required'
    }

    if (trimmedCity.length < 2) {
      return 'City name must be at least 2 characters'
    }

    if (trimmedCity.length > 100) {
      return 'City name must not exceed 100 characters'
    }

    // Allow letters, spaces, hyphens, and apostrophes
    const cityRegex = /^[a-zA-Z\s\-']+$/
    if (!cityRegex.test(trimmedCity)) {
      return 'City name can only contain letters, spaces, hyphens, and apostrophes'
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

    if (trimmedCountry.length > 100) {
      return 'Country name must not exceed 100 characters'
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

    const cityError = validateCity(city)
    if (cityError) newErrors.city = cityError

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
    value = value.replace(/[^a-zA-Z0-9\s\-'.()]/g, '')

    // Prevent consecutive spaces
    value = value.replace(/\s{2,}/g, ' ')

    if (value.length > 100) {
      toast.warning('Airport name cannot exceed 100 characters')
      value = value.substring(0, 100)
    }

    setName(value)

    if (errors.name && value.trim().length >= 3) {
      setErrors({ ...errors, name: '' })
    }
  }

  const handleCodeChange = (e) => {
    let value = e.target.value.toUpperCase()

    // Only allow alphanumeric
    value = value.replace(/[^A-Z0-9]/g, '')

    if (value.length > 10) {
      toast.warning('Airport code cannot exceed 10 characters')
      value = value.substring(0, 10)
    }

    setCode(value)

    if (errors.code && value.length >= 3) {
      setErrors({ ...errors, code: '' })
    }
  }

  const handleCityChange = (e) => {
    let value = e.target.value

    // Block numbers and special characters (except space, hyphen, apostrophe)
    value = value.replace(/[^a-zA-Z\s\-']/g, '')

    // Prevent consecutive spaces
    value = value.replace(/\s{2,}/g, ' ')

    if (value.length > 100) {
      toast.warning('City name cannot exceed 100 characters')
      value = value.substring(0, 100)
    }

    setCity(value)

    if (errors.city && value.trim().length >= 2) {
      setErrors({ ...errors, city: '' })
    }
  }

  const handleCountryChange = (e) => {
    let value = e.target.value

    // Block numbers and special characters (except space, hyphen, apostrophe)
    value = value.replace(/[^a-zA-Z\s\-']/g, '')

    // Prevent consecutive spaces
    value = value.replace(/\s{2,}/g, ' ')

    if (value.length > 100) {
      toast.warning('Country name cannot exceed 100 characters')
      value = value.substring(0, 100)
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
    const sanitizedCity = city.trim()
    const sanitizedCountry = country.trim()

    if (!sanitizedName || !sanitizedCode || !sanitizedCity || !sanitizedCountry) {
      toast.error('All fields must be filled')
      return
    }

    try {
      setLoading(true)
      await addAirport(sanitizedName, sanitizedCode, sanitizedCity, sanitizedCountry)
      toast.success('🛬 Airport added successfully!')
      setTimeout(() => {
        navigate('/airports/list')
      }, 500)
    } catch (error) {
      console.error('Add airport error:', error)
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        toast.error('This airport code already exists in the system')
      } else {
        toast.error('Failed to add airport. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (name || code || city || country) {
      setName('')
      setCode('')
      setCity('')
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
        <button className="back-btn" onClick={() => navigate('/airports')}>
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </button>
        <div className="add-header-content">
          <h1 className="add-title">
            <FaPlus className="title-icon" />
            Add New Airport
          </h1>
          <p className="add-subtitle">
            Fill in the airport details below to register a new airport in the system.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <div className="form-card-header">
          <h2>Airport Information</h2>
          <p>All fields marked with * are required</p>
        </div>

        <form onSubmit={handleSubmit} className="passenger-form">
          {/* Airport Name Field */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <FaPlaneArrival className="label-icon" />
              Airport Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="Enter airport name (e.g., Allama Iqbal International Airport)"
              disabled={loading}
              autoComplete="off"
              maxLength={100}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
            <span className="input-hint">
              Letters, numbers, spaces, and common punctuation allowed (3-100 characters)
            </span>
          </div>

          {/* Airport Code Field */}
          <div className="form-group">
            <label htmlFor="code" className="form-label">
              <FaPlaneArrival className="label-icon" />
              Airport Code *
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              className={`form-input ${errors.code ? 'input-error' : ''}`}
              placeholder="Enter airport code (e.g., LHE, JFK, DXB)"
              disabled={loading}
              autoComplete="off"
              maxLength={10}
            />
            {errors.code && <span className="error-message">{errors.code}</span>}
            <span className="input-hint">
              3-10 uppercase letters/numbers (IATA: 3 chars like LHE, ICAO: 4 chars like OPLA)
            </span>
          </div>

          {/* City Field */}
          <div className="form-group">
            <label htmlFor="city" className="form-label">
              <FaCity className="label-icon" />
              City Name *
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={handleCityChange}
              className={`form-input ${errors.city ? 'input-error' : ''}`}
              placeholder="Enter city name (e.g., Lahore, New York, Dubai)"
              disabled={loading}
              autoComplete="address-level2"
              maxLength={100}
            />
            {errors.city && <span className="error-message">{errors.city}</span>}
            <span className="input-hint">
              Only letters, spaces, hyphens, and apostrophes allowed (2-100 characters)
            </span>
          </div>

          {/* Country Field */}
          <div className="form-group">
            <label htmlFor="country" className="form-label">
              <FaGlobe className="label-icon" />
              Country Name *
            </label>
            <input
              id="country"
              type="text"
              value={country}
              onChange={handleCountryChange}
              className={`form-input ${errors.country ? 'input-error' : ''}`}
              placeholder="Enter country name (e.g., Pakistan, United States, UAE)"
              disabled={loading}
              autoComplete="country-name"
              maxLength={100}
            />
            {errors.country && <span className="error-message">{errors.country}</span>}
            <span className="input-hint">
              Only letters, spaces, hyphens, and apostrophes allowed (2-100 characters)
            </span>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="form-btn form-btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Adding Airport...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Add Airport</span>
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
        {(name || code || city || country) && (
          <div className="preview-card">
            <h3>Preview</h3>
            <div className="preview-content">
              <div className="preview-avatar">{code?.substring(0, 2) || 'AP'}</div>
              <div className="preview-details">
                <p className="preview-name">{name || 'Airport Name'}</p>
                <p className="preview-passport">
                  <FaPlaneArrival className="preview-icon" />
                  {code || 'XXX'} • {city || 'City'}, {country || 'Country'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
