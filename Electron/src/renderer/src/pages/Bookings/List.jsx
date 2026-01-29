// src/pages/Bookings/List.jsx - FIXED: Proper booking display
import { useEffect, useState } from 'react'
import { fetchBookings, deleteBooking, updateBooking } from '@renderer/apis/BookingsApi'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  FaSearch,
  FaSort,
  FaTimes,
  FaTicketAlt,
  FaBan,
  FaTrash,
  FaPlus,
  FaCheckCircle
} from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function BookingsList() {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await fetchBookings()
      console.log('Bookings loaded:', data)
      setBookings(data || [])
      setFilteredBookings(data || [])
    } catch (error) {
      toast.error('Failed to load bookings')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = bookings.filter(
      (b) =>
        b.bookingRef?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.passengerNames?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id?.toString().includes(searchTerm)
    )

    if (sortBy === 'newest') {
      filtered = filtered.sort((a, b) => b.id - a.id)
    } else if (sortBy === 'oldest') {
      filtered = filtered.sort((a, b) => a.id - b.id)
    } else if (sortBy === 'status') {
      filtered = filtered.sort((a, b) => (a.status || '').localeCompare(b.status || ''))
    }

    setFilteredBookings(filtered)
  }, [searchTerm, bookings, sortBy])

  const handleCancelBooking = async (id) => {
    try {
      await updateBooking(id, 'CANCELLED')
      toast.success('Booking cancelled successfully')
      loadData()
    } catch (error) {
      toast.error('Failed to cancel booking')
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      try {
        await deleteBooking(id)
        toast.success('Booking deleted successfully')
        setDeleteConfirm(null)
        loadData()
      } catch (error) {
        toast.error('Failed to delete booking. It may have associated tickets.')
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
            <FaTicketAlt className="title-icon" />
            Bookings Directory
          </h1>
          <p className="list-subtitle">
            View and manage all bookings. Each booking contains one or more tickets.
          </p>
        </div>
        <div className="list-stats">
          <div className="list-stat-item">
            <span className="list-stat-label">Total</span>
            <span className="list-stat-value">{bookings.length}</span>
          </div>
          <div className="list-stat-divider"></div>
          <div className="list-stat-item">
            <span className="list-stat-label">Showing</span>
            <span className="list-stat-value">{filteredBookings.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="list-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by booking reference, passenger name, or ID..."
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
            <option value="status">By Status</option>
          </select>
        </div>
        <Link to="/bookings/create" className="add-passenger-btn">
          <FaPlus />
          <span>Create Booking</span>
        </Link>
      </div>

      {/* Cards Grid Section */}
      {loading ? (
        <div className="list-loading">
          <div className="loading-spinner-large"></div>
          <p>Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="list-empty">
          <FaTicketAlt className="empty-icon-large" />
          <h3>No bookings found</h3>
          <p>
            {searchTerm ? 'Try adjusting your search terms' : 'Start by creating a new booking'}
          </p>
          <Link to="/bookings/create" className="empty-action-btn">
            <FaPlus /> Create First Booking
          </Link>
        </div>
      ) : (
        <div className="passengers-grid">
          {filteredBookings.map((booking) => {
            const isConfirmed = booking.status === 'CONFIRMED'
            const isCancelled = booking.status === 'CANCELLED'

            return (
              <div key={booking.id} className="passenger-card">
                <div className="card-header">
                  <div className="passenger-avatar-large">
                    {booking.bookingRef?.substring(2, 4) || 'BK'}
                  </div>
                  <div className="card-id">#{booking.id}</div>
                </div>

                <div className="card-body">
                  <h3 className="passenger-full-name">{booking.bookingRef}</h3>

                  <div className="passport-info">
                    <FaTicketAlt className="passport-icon-card" />
                    <span className="passport-number">
                      {booking.ticketCount || 0} Ticket{booking.ticketCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                    {isConfirmed && (
                      <FaCheckCircle style={{ color: '#46b64c', marginRight: '0.5rem' }} />
                    )}
                    {isCancelled && <FaBan style={{ color: '#ff6b00', marginRight: '0.5rem' }} />}
                    <span
                      style={{
                        color: isConfirmed ? '#46b64c' : isCancelled ? '#ff6b00' : '#fbbf24',
                        fontWeight: '600'
                      }}
                    >
                      {booking.status || 'PENDING'}
                    </span>
                  </div>

                  {booking.passengerNames && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.75rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          marginBottom: '0.25rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        Passengers
                      </div>
                      <div
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.4'
                        }}
                      >
                        {booking.passengerNames}
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Booked:{' '}
                    {new Date(booking.bookingDate).toLocaleDateString('en-PK', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                <div className="card-footer">
                  {isConfirmed && (
                    <button
                      className="card-btn"
                      style={{
                        background: '#ff6b00',
                        color: 'white'
                      }}
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      <FaBan />
                      <span>Cancel</span>
                    </button>
                  )}

                  {isCancelled && (
                    <button
                      className="card-btn"
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-muted)',
                        cursor: 'not-allowed'
                      }}
                      disabled
                    >
                      <FaBan />
                      <span>Cancelled</span>
                    </button>
                  )}

                  <button
                    className={`card-btn card-btn-delete ${deleteConfirm === booking.id ? 'confirm-state' : ''}`}
                    onClick={() => handleDelete(booking.id)}
                  >
                    <FaTrash />
                    <span>{deleteConfirm === booking.id ? 'Confirm?' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
