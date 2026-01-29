// src/pages/Passengers/Add.jsx
import { useState } from 'react'
import { addPassenger } from '@renderer/apis/PassengersApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUserPlus, FaUser, FaPassport, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function AddPassenger() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [passport, setPassport] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  // Validation helpers
  const validateName = (name, fieldName) => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      return `${fieldName} is required`
    }

    if (trimmedName.length < 2) {
      return `${fieldName} must be at least 2 characters`
    }

    if (trimmedName.length > 50) {
      return `${fieldName} must not exceed 50 characters`
    }

    // Only allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/
    if (!nameRegex.test(trimmedName)) {
      return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
    }

    // Check for consecutive spaces or special characters
    if (/\s{2,}/.test(trimmedName) || /[-']{2,}/.test(trimmedName)) {
      return `${fieldName} cannot have consecutive spaces or special characters`
    }

    return null
  }

  const validatePassport = (passportNum) => {
    const trimmedPassport = passportNum.trim()

    if (!trimmedPassport) {
      return 'Passport number is required'
    }

    if (trimmedPassport.length < 6) {
      return 'Passport number must be at least 6 characters'
    }

    if (trimmedPassport.length > 15) {
      return 'Passport number must not exceed 15 characters'
    }

    // Passport should be alphanumeric (letters and numbers only)
    const passportRegex = /^[A-Z0-9]+$/
    if (!passportRegex.test(trimmedPassport)) {
      return 'Passport number can only contain uppercase letters and numbers'
    }

    // Most passports start with a letter
    if (!/^[A-Z]/.test(trimmedPassport)) {
      return 'Passport number should start with a letter'
    }

    return null
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate first name
    const firstNameError = validateName(firstName, 'First name')
    if (firstNameError) {
      newErrors.firstName = firstNameError
    }

    // Validate last name
    const lastNameError = validateName(lastName, 'Last name')
    if (lastNameError) {
      newErrors.lastName = lastNameError
    }

    // Validate passport
    const passportError = validatePassport(passport)
    if (passportError) {
      newErrors.passport = passportError
    }

    setErrors(newErrors)

    // Show toast for each error
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => {
        toast.error(error)
      })
    }

    return Object.keys(newErrors).length === 0
  }

  // Real-time input handlers with validation
  const handleFirstNameChange = (e) => {
    let value = e.target.value

    // Block numbers and special characters (except space, hyphen, apostrophe)
    value = value.replace(/[^a-zA-Z\s\-']/g, '')

    // Prevent consecutive spaces
    value = value.replace(/\s{2,}/g, ' ')

    // Prevent consecutive special characters
    value = value.replace(/[-']{2,}/g, (match) => match[0])

    // Limit length
    if (value.length > 50) {
      toast.warning('First name cannot exceed 50 characters')
      value = value.substring(0, 50)
    }

    setFirstName(value)

    // Clear error when user starts typing correctly
    if (errors.firstName && value.trim().length >= 2) {
      setErrors({ ...errors, firstName: '' })
    }
  }

  const handleLastNameChange = (e) => {
    let value = e.target.value

    // Block numbers and special characters (except space, hyphen, apostrophe)
    value = value.replace(/[^a-zA-Z\s\-']/g, '')

    // Prevent consecutive spaces
    value = value.replace(/\s{2,}/g, ' ')

    // Prevent consecutive special characters
    value = value.replace(/[-']{2,}/g, (match) => match[0])

    // Limit length
    if (value.length > 50) {
      toast.warning('Last name cannot exceed 50 characters')
      value = value.substring(0, 50)
    }

    setLastName(value)

    // Clear error when user starts typing correctly
    if (errors.lastName && value.trim().length >= 2) {
      setErrors({ ...errors, lastName: '' })
    }
  }

  const handlePassportChange = (e) => {
    let value = e.target.value.toUpperCase()

    // Only allow alphanumeric characters
    value = value.replace(/[^A-Z0-9]/g, '')

    // Limit length
    if (value.length > 15) {
      toast.warning('Passport number cannot exceed 15 characters')
      value = value.substring(0, 15)
    }

    // Warn if doesn't start with letter (after first character is entered)
    if (value.length > 0 && !/^[A-Z]/.test(value)) {
      if (!errors.passport || !errors.passport.includes('should start with a letter')) {
        toast.warning('Passport numbers typically start with a letter')
      }
    }

    setPassport(value)

    // Clear error when user starts typing correctly
    if (errors.passport && value.length >= 6) {
      setErrors({ ...errors, passport: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix all errors before submitting')
      return
    }

    // Final sanitization before sending to DB
    const sanitizedFirstName = firstName.trim()
    const sanitizedLastName = lastName.trim()
    const sanitizedPassport = passport.trim()

    // Double-check one more time
    if (!sanitizedFirstName || !sanitizedLastName || !sanitizedPassport) {
      toast.error('All fields must be filled')
      return
    }

    try {
      setLoading(true)
      await addPassenger(sanitizedFirstName, sanitizedLastName, sanitizedPassport)
      toast.success('✈️ Passenger added successfully!')
      setTimeout(() => {
        navigate('/passengers/list')
      }, 500)
    } catch (error) {
      console.error('Add passenger error:', error)
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        toast.error('This passenger already exists in the system')
      } else {
        toast.error('Failed to add passenger. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    if (firstName || lastName || passport) {
      setFirstName('')
      setLastName('')
      setPassport('')
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
        <button className="back-btn" onClick={() => navigate('/passengers')}>
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </button>
        <div className="add-header-content">
          <h1 className="add-title">
            <FaUserPlus className="title-icon" />
            Add New Passenger
          </h1>
          <p className="add-subtitle">
            Fill in the passenger details below to register a new passenger in the system.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <div className="form-card-header">
          <h2>Passenger Information</h2>
          <p>All fields marked with * are required</p>
        </div>

        <form onSubmit={handleSubmit} className="passenger-form">
          {/* First Name Field */}
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              <FaUser className="label-icon" />
              First Name *
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={handleFirstNameChange}
              className={`form-input ${errors.firstName ? 'input-error' : ''}`}
              placeholder="Enter first name (letters only)"
              disabled={loading}
              autoComplete="given-name"
              maxLength={50}
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            <span className="input-hint">
              Only letters, spaces, hyphens, and apostrophes allowed (2-50 characters)
            </span>
          </div>

          {/* Last Name Field */}
          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              <FaUser className="label-icon" />
              Last Name *
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={handleLastNameChange}
              className={`form-input ${errors.lastName ? 'input-error' : ''}`}
              placeholder="Enter last name (letters only)"
              disabled={loading}
              autoComplete="family-name"
              maxLength={50}
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            <span className="input-hint">
              Only letters, spaces, hyphens, and apostrophes allowed (2-50 characters)
            </span>
          </div>

          {/* Passport Field */}
          <div className="form-group">
            <label htmlFor="passport" className="form-label">
              <FaPassport className="label-icon" />
              Passport Number *
            </label>
            <input
              id="passport"
              type="text"
              value={passport}
              onChange={handlePassportChange}
              className={`form-input ${errors.passport ? 'input-error' : ''}`}
              placeholder="Enter passport number (e.g., A12345678)"
              disabled={loading}
              autoComplete="off"
              maxLength={15}
            />
            {errors.passport && <span className="error-message">{errors.passport}</span>}
            <span className="input-hint">
              Uppercase letters and numbers only (6-15 characters). Should start with a letter.
            </span>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="form-btn form-btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Adding Passenger...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Add Passenger</span>
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
        {(firstName || lastName || passport) && (
          <div className="preview-card">
            <h3>Preview</h3>
            <div className="preview-content">
              <div className="preview-avatar">
                {firstName?.charAt(0) || 'P'}
                {lastName?.charAt(0) || 'X'}
              </div>
              <div className="preview-details">
                <p className="preview-name">
                  {firstName || 'First'} {lastName || 'Last'}
                </p>
                <p className="preview-passport">
                  <FaPassport className="preview-icon" />
                  {passport || 'XXXXXXXXX'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
