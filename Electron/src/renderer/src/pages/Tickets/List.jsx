// src/pages/Tickets/List.jsx
import { useEffect, useState } from 'react'
import { fetchTickets, deleteTicket, updateTicket } from '@renderer/apis/TicketsApi'
import { toast } from 'react-toastify'
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaTicketAlt,
  FaSort,
  FaPlus,
  FaPlane
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function TicketsList() {
  const [tickets, setTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ ticketPrice: '' })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  const loadData = async () => {
    try {
      setLoading(true)
      const ticketsData = await fetchTickets()
      setTickets(ticketsData || [])
      setFilteredTickets(ticketsData || [])
    } catch (error) {
      toast.error('Failed to load tickets')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = tickets.filter(
      (t) =>
        t.passengerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.bookingRef?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.passportNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id?.toString().includes(searchTerm)
    )

    if (sortBy === 'newest') {
      filtered = filtered.sort((a, b) => b.id - a.id)
    } else if (sortBy === 'oldest') {
      filtered = filtered.sort((a, b) => a.id - b.id)
    } else if (sortBy === 'price') {
      filtered = filtered.sort((a, b) => (b.ticketPrice || 0) - (a.ticketPrice || 0))
    }

    setFilteredTickets(filtered)
  }, [searchTerm, tickets, sortBy])

  const handleEdit = (ticket) => {
    setEditingId(ticket.id)
    setEditForm({ ticketPrice: ticket.ticketPrice })
  }

  const handleSaveEdit = async (id) => {
    if (!editForm.ticketPrice || editForm.ticketPrice <= 0) {
      toast.error('Ticket price must be greater than 0')
      return
    }

    try {
      await updateTicket(id, editForm.ticketPrice)
      toast.success('Ticket updated successfully')
      setEditingId(null)
      loadData()
    } catch (error) {
      toast.error('Failed to update ticket')
      console.error(error)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ ticketPrice: '' })
  }

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      try {
        await deleteTicket(id)
        toast.success('Ticket deleted successfully')
        setDeleteConfirm(null)
        loadData()
      } catch (error) {
        toast.error('Failed to delete ticket')
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
            Tickets Directory
          </h1>
          <p className="list-subtitle">
            Manage and view all issued tickets. Search, edit, or delete records.
          </p>
        </div>
        <div className="list-stats">
          <div className="list-stat-item">
            <span className="list-stat-label">Total</span>
            <span className="list-stat-value">{tickets.length}</span>
          </div>
          <div className="list-stat-divider"></div>
          <div className="list-stat-item">
            <span className="list-stat-label">Showing</span>
            <span className="list-stat-value">{filteredTickets.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="list-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by passenger, flight, booking, or ID..."
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
            <option value="price">Price (High-Low)</option>
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
          <p>Loading tickets...</p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="list-empty">
          <FaTicketAlt className="empty-icon-large" />
          <h3>No tickets found</h3>
          <p>
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Start by creating your first booking'}
          </p>
          {!searchTerm && (
            <Link to="/bookings/create" className="empty-action-btn">
              <FaPlus /> Create Your First Booking
            </Link>
          )}
        </div>
      ) : (
        <div className="passengers-grid">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`passenger-card ${editingId === ticket.id ? 'card-editing' : ''}`}
            >
              {editingId === ticket.id ? (
                // Edit Mode
                <div className="card-edit-mode">
                  <div className="edit-header">
                    <div className="passenger-avatar-large">TK</div>
                    <span className="edit-badge">Editing</span>
                  </div>

                  <div className="edit-fields">
                    <div className="edit-field">
                      <label>Ticket Price (PKR)</label>
                      <input
                        type="number"
                        value={editForm.ticketPrice}
                        onChange={(e) => setEditForm({ ticketPrice: e.target.value })}
                        className="edit-input-field"
                        placeholder="Enter ticket price"
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button
                      className="card-btn card-btn-save"
                      onClick={() => handleSaveEdit(ticket.id)}
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
                      {ticket.passengerName?.substring(0, 2) || 'TK'}
                    </div>
                    <div className="card-id">ID: {ticket.id}</div>
                  </div>

                  <div className="card-body">
                    <h3 className="passenger-full-name">{ticket.passengerName}</h3>
                    <div className="passport-info">
                      <FaPlane className="passport-icon-card" />
                      <span className="passport-number">{ticket.flightNumber}</span>
                    </div>
                    <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                      <FaTicketAlt className="passport-icon-card" />
                      <span className="passport-number">Seat {ticket.seatNumber}</span>
                    </div>
                    <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {ticket.originCode} → {ticket.destinationCode} • PKR{' '}
                        {parseFloat(ticket.ticketPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button className="card-btn card-btn-edit" onClick={() => handleEdit(ticket)}>
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      className={`card-btn card-btn-delete ${deleteConfirm === ticket.id ? 'confirm-state' : ''}`}
                      onClick={() => handleDelete(ticket.id)}
                    >
                      <FaTrash />
                      <span>{deleteConfirm === ticket.id ? 'Confirm?' : 'Delete'}</span>
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
