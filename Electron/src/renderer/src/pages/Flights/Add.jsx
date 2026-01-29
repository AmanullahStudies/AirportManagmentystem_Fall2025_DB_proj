// src/renderer/pages/AddFlight.jsx
import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FaPlus,
  FaPlane,
  FaRoute,
  FaClock,
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaChevronDown
} from 'react-icons/fa'

import {
  addFlight,
  fetchRoutesForDropdown,
  fetchAircraftForDropdown
} from '@renderer/apis/FlightsApi'

import '@renderer/assets/CssAll/pages/Passengers.css'

/* ===============================
   DROPDOWN COMPONENT
   =============================== */
function Dropdown({ value, options, onChange, placeholder, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const selected = options.find((o) => o.value === value)

  // DEBUG
  console.log('🔽 DROPDOWN RENDER')
  console.log('value:', value)
  console.log('options:', options)

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger */}
      <div
        onClick={() => !disabled && setOpen((o) => !o)}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: '10px',
          border: '1px solid #555',
          background: '#111',
          color: selected ? '#fff' : '#aaa',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <FaChevronDown />
      </div>

      {/* Options */}
      {open && !disabled && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            width: '100%',
            background: '#ffffff',
            color: '#000000',
            borderRadius: '10px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
            zIndex: 999999,
            maxHeight: '240px',
            overflowY: 'auto'
          }}
        >
          {options.length === 0 && <div style={{ padding: '12px', color: '#666' }}>No options</div>}

          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                background: opt.value === value ? '#e5e7eb' : '#ffffff',
                color: '#000000',
                fontWeight: 500
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = opt.value === value ? '#e5e7eb' : '#ffffff')
              }
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

Dropdown.propTypes = {
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool
}

/* ===============================
   NORMALIZE DROPDOWN DATA (FIXED)
   =============================== */
const normalizeRoutes = (routes) =>
  (routes || []).map((r) => ({
    value: String(r.id),
    label: `${r.originCode} (${r.originCity}) → ${r.destinationCode} (${r.destinationCity})`
  }))

const normalizeAircraft = (aircraft) =>
  (aircraft || []).map((a) => ({
    value: String(a.id),
    label: `${a.registrationNumber} • ${a.modelName} • ${a.airlineName}`
  }))

/* ===============================
   ADD FLIGHT PAGE
   =============================== */
export default function AddFlight() {
  const [flightNumber, setFlightNumber] = useState('')
  const [routeId, setRouteId] = useState('')
  const [aircraftId, setAircraftId] = useState('')
  const [scheduledDeparture, setScheduledDeparture] = useState('')
  const [scheduledArrival, setScheduledArrival] = useState('')

  const [routes, setRoutes] = useState([])
  const [aircraft, setAircraft] = useState([])
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([fetchRoutesForDropdown(), fetchAircraftForDropdown()])
      .then(([r, a]) => {
        setRoutes(normalizeRoutes(r))
        setAircraft(normalizeAircraft(a))
        console.log('✅ Normalized Routes:', normalizeRoutes(r))
        console.log('✅ Normalized Aircraft:', normalizeAircraft(a))
      })
      .catch(() => toast.error('Failed to load dropdown data'))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!flightNumber || !routeId || !aircraftId) {
      toast.error('Fill required fields')
      return
    }

    try {
      setLoading(true)
      await addFlight(flightNumber, routeId, aircraftId, scheduledDeparture, scheduledArrival)
      toast.success('✈️ Flight scheduled')
      navigate('/flights/list')
    } catch {
      toast.error('Failed to schedule flight')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="passengers-add">
      <div className="add-header">
        <button className="back-btn" onClick={() => navigate('/flights')}>
          <FaArrowLeft /> Back
        </button>
        <h1 className="add-title">
          <FaPlus /> Schedule Flight
        </h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="passenger-form">
          <div className="form-group">
            <label className="form-label">
              <FaPlane /> Flight Number *
            </label>
            <input
              className="form-input"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
              placeholder="PK-101"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaRoute /> Route *
            </label>
            <Dropdown
              value={routeId}
              options={routes}
              onChange={setRouteId}
              placeholder="Select route"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaPlane /> Aircraft *
            </label>
            <Dropdown
              value={aircraftId}
              options={aircraft}
              onChange={setAircraftId}
              placeholder="Select aircraft"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaClock /> Departure
            </label>
            <input
              type="datetime-local"
              className="form-input"
              value={scheduledDeparture}
              onChange={(e) => setScheduledDeparture(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <FaClock /> Arrival
            </label>
            <input
              type="datetime-local"
              className="form-input"
              value={scheduledArrival}
              onChange={(e) => setScheduledArrival(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="form-btn form-btn-submit" disabled={loading}>
              <FaSave /> Schedule
            </button>
            <button
              type="button"
              className="form-btn form-btn-reset"
              onClick={() => window.location.reload()}
            >
              <FaTimes /> Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
