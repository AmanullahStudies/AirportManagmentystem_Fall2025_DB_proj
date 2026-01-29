// src/pages/Bookings/Create.jsx - SIMPLIFIED: No seat selection required
import { useState, useEffect } from 'react'
import {
  fetchFlightsForDropdown,
  fetchPassengersForDropdown,
  generateBookingRef,
  addBooking,
  addTicket
} from '@renderer/apis/BookingsApi'
import { selectQuery } from '@renderer/apis/dbApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FaPlus,
  FaTicketAlt,
  FaPlane,
  FaUser,
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaDollarSign
} from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function CreateBooking() {
  const [flightId, setFlightId] = useState('')
  const [selectedPassengers, setSelectedPassengers] = useState({}) // passengerId -> passenger object
  const [ticketPrices, setTicketPrices] = useState({}) // passengerId -> price

  const [flights, setFlights] = useState([])
  const [passengers, setPassengers] = useState([])

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  // Load flights and passengers on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true)
        const [flightsData, passengersData] = await Promise.all([
          fetchFlightsForDropdown(),
          fetchPassengersForDropdown()
        ])
        setFlights(flightsData || [])
        setPassengers(passengersData || [])
      } catch (error) {
        toast.error('Failed to load data')
        console.error(error)
      } finally {
        setLoadingData(false)
      }
    }
    loadData()
  }, [])

  const validateForm = () => {
    const newErrors = {}
    const passengerIds = Object.keys(selectedPassengers)

    if (!flightId) {
      newErrors.flight = 'Flight is required'
      toast.error('Please select a flight')
    }

    if (passengerIds.length === 0) {
      newErrors.passengers = 'At least one passenger is required'
      toast.error('Please select at least one passenger')
    }

    // Check if all passengers have prices
    passengerIds.forEach((passengerId) => {
      const price = ticketPrices[passengerId]
      if (!price || price <= 0) {
        newErrors.prices = `Valid price required for all passengers`
        toast.error(`Please enter valid ticket prices for all passengers`)
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePassengerToggle = (passengerData) => {
    const passengerId = parseInt(passengerData.id) // Convert to number!
    const newSelected = { ...selectedPassengers }

    if (newSelected[passengerId]) {
      // Deselect passenger
      delete newSelected[passengerId]

      // Remove their price
      const newPrices = { ...ticketPrices }
      delete newPrices[passengerId]
      setTicketPrices(newPrices)
    } else {
      // Select passenger - store with integer ID
      newSelected[passengerId] = {
        ...passengerData,
        id: passengerId // Ensure ID is integer
      }
    }

    setSelectedPassengers(newSelected)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      console.error('❌ Form validation failed')
      return
    }

    try {
      setLoading(true)
      console.log('🚀 Starting booking creation...')

      // Generate booking reference
      console.log('📝 Generating booking reference...')
      const bookingRef = await generateBookingRef()
      console.log('✅ Generated booking ref:', bookingRef)

      // Create booking
      console.log('💾 Creating booking in database...')
      const bookingResult = await addBooking(bookingRef)
      console.log('📦 Booking result:', bookingResult)

      // Try different ways to get booking ID
      const bookingId = bookingResult?.insertId || bookingResult?.id || bookingResult
      console.log('🔑 Extracted booking ID:', bookingId, 'Type:', typeof bookingId)

      if (!bookingId || bookingId === 0) {
        console.error('❌ Failed to get booking ID from result:', bookingResult)
        throw new Error('Failed to get booking ID from database')
      }

      // Create tickets for each passenger (NO SEAT - passes NULL)
      const passengerIds = Object.keys(selectedPassengers)
      console.log(`🎫 Creating ${passengerIds.length} tickets...`)

      for (let i = 0; i < passengerIds.length; i++) {
        const passengerId = parseInt(passengerIds[i]) // Convert to integer!
        const passenger = selectedPassengers[passengerId]
        const price = parseFloat(ticketPrices[passengerId]) // Convert to number!

        console.log(`  [${i + 1}/${passengerIds.length}] Creating ticket for:`, {
          bookingId,
          passengerId, // Now a number
          passengerName: passenger.name,
          flightId: parseInt(flightId), // Convert to integer!
          seatId: null,
          price
        })

        try {
          const ticketResult = await addTicket(
            parseInt(bookingId), // Convert to integer!
            passengerId, // Already converted above
            parseInt(flightId), // Convert to integer!
            null, // SeatID = NULL (no seat assignment)
            price // Already converted above
          )
          console.log(`  ✅ Ticket created:`, ticketResult)
        } catch (ticketError) {
          console.error(`  ❌ Failed to create ticket for ${passenger.name}:`, ticketError)
          throw ticketError
        }
      }

      console.log('✅ All tickets created successfully!')

      // DEBUG: Check if tickets were actually saved
      console.log('🔍 DEBUG: Checking if tickets exist in database...')
      try {
        const debugSql = `SELECT * FROM Tickets WHERE BookingID = ?`
        const debugTickets = await selectQuery(debugSql, [bookingId])
        console.log('📊 Tickets in database for booking', bookingId, ':', debugTickets)
      } catch (debugError) {
        console.error('❌ Debug query failed:', debugError)
      }

      toast.success(`✅ Booking created! ${passengerIds.length} ticket(s) issued.`)

      setTimeout(() => {
        console.log('🔄 Navigating to bookings list...')
        navigate('/bookings/list')
      }, 800)
    } catch (error) {
      console.error('❌ CREATE BOOKING ERROR:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      toast.error(`Failed to create booking: ${error.message}`)
    } finally {
      setLoading(false)
      console.log('🏁 Booking creation process finished')
    }
  }

  const handleReset = () => {
    if (flightId || Object.keys(selectedPassengers).length > 0) {
      setFlightId('')
      setSelectedPassengers({})
      setTicketPrices({})
      setErrors({})
      toast.info('Form has been reset')
    } else {
      toast.info('Form is already empty')
    }
  }

  const selectedPassengerIds = Object.keys(selectedPassengers)
  const totalCost = Object.values(ticketPrices).reduce(
    (sum, price) => sum + (parseFloat(price) || 0),
    0
  )

  return (
    <div className="passengers-add">
      {/* Header */}
      <div className="add-header">
        <button className="back-btn" onClick={() => navigate('/bookings')}>
          <FaArrowLeft />
          <span>Back to Dashboard</span>
        </button>
        <div className="add-header-content">
          <h1 className="add-title">
            <FaPlus className="title-icon" />
            Create New Booking
          </h1>
          <p className="add-subtitle">
            Select a flight, passengers, and set ticket prices to create a booking.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <div className="form-card-header">
          <h2>Booking Information</h2>
          <p>All fields marked with * are required</p>
        </div>

        <form onSubmit={handleSubmit} className="passenger-form">
          {/* Flight Selection */}
          <div className="form-group">
            <label htmlFor="flight" className="form-label">
              <FaPlane className="label-icon" />
              Select Flight *
            </label>
            {loadingData ? (
              <div
                className="form-input"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
                <span>Loading flights...</span>
              </div>
            ) : (
              <select
                id="flight"
                value={flightId}
                onChange={(e) => {
                  setFlightId(e.target.value)
                  if (errors.flight) setErrors({ ...errors, flight: '' })
                }}
                className={`form-input ${errors.flight ? 'input-error' : ''}`}
                disabled={loading}
              >
                <option value="">Select a flight</option>
                {flights.map((flight) => (
                  <option key={flight.id} value={flight.id}>
                    {flight.label}
                  </option>
                ))}
              </select>
            )}
            {errors.flight && <span className="error-message">{errors.flight}</span>}
            <span className="input-hint">Choose the flight for this booking</span>
          </div>

          {/* Passengers Selection */}
          {flightId && (
            <div className="form-group">
              <label className="form-label">
                <FaUser className="label-icon" />
                Select Passengers *
              </label>
              <div
                style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-tertiary)'
                }}
              >
                {passengers.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                    No passengers available.{' '}
                    <Link to="/passengers/add" style={{ color: 'var(--accent-green)' }}>
                      Add passengers first
                    </Link>
                  </p>
                ) : (
                  passengers.map((passenger) => (
                    <label
                      key={passenger.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        backgroundColor: selectedPassengers[passenger.id]
                          ? 'rgba(70, 182, 76, 0.1)'
                          : 'transparent',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!selectedPassengers[passenger.id]}
                        onChange={() => handlePassengerToggle(passenger)}
                        disabled={loading}
                        style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                      />
                      <span style={{ color: 'var(--text-primary)', flex: 1 }}>
                        {passenger.name}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {passenger.passportNumber}
                      </span>
                    </label>
                  ))
                )}
              </div>
              {errors.passengers && <span className="error-message">{errors.passengers}</span>}
            </div>
          )}

          {/* Ticket Prices */}
          {selectedPassengerIds.length > 0 && (
            <div className="form-group">
              <label className="form-label">
                <FaDollarSign className="label-icon" />
                Set Ticket Prices *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedPassengerIds.map((passengerId) => {
                  const passenger = selectedPassengers[passengerId]

                  return (
                    <div
                      key={passengerId}
                      style={{
                        padding: '1.25rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            margin: '0 0 0.25rem 0',
                            color: 'var(--text-primary)',
                            fontSize: '1rem'
                          }}
                        >
                          {passenger?.name}
                        </h4>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {passenger?.passportNumber}
                        </div>
                      </div>
                      <div style={{ minWidth: '200px' }}>
                        <input
                          type="number"
                          value={ticketPrices[passengerId] || ''}
                          onChange={(e) => {
                            setTicketPrices({ ...ticketPrices, [passengerId]: e.target.value })
                            if (errors.prices) setErrors({ ...errors, prices: '' })
                          }}
                          className="form-input"
                          placeholder="Enter price (PKR)"
                          disabled={loading}
                          min="1"
                          step="0.01"
                          style={{ margin: 0 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              {errors.prices && <span className="error-message">{errors.prices}</span>}
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="form-btn form-btn-submit"
              disabled={loading || loadingData}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Creating Booking...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Create Booking</span>
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

        {/* Summary Card */}
        {selectedPassengerIds.length > 0 && (
          <div className="preview-card">
            <h3>Booking Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--text-secondary)'
                }}
              >
                <span>Passengers:</span>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {selectedPassengerIds.length}
                </strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'var(--text-secondary)'
                }}
              >
                <span>Total Cost:</span>
                <strong style={{ color: 'var(--accent-green)', fontSize: '1.25rem' }}>
                  PKR {totalCost.toLocaleString('en-PK', { maximumFractionDigits: 0 })}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
