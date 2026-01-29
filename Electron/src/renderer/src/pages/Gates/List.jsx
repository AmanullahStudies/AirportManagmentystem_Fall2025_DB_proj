// src/pages/Gates/List.jsx
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { FaSearch, FaDoorOpen, FaSort, FaTimes } from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/Passengers.css'

export default function GatesList() {
  const [gates, setGates] = useState([])
  const [filteredGates, setFilteredGates] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('gate')

  useEffect(() => {
    // Load gates - this is a placeholder that loads from localStorage or API
    const loadGates = async () => {
      try {
        setLoading(true)
        // Mock data for gates - replace with actual API call
        const mockGates = [
          { id: 1, gateNumber: 'A1', terminal: 'A', status: 'AVAILABLE', airportCode: 'ISB' },
          { id: 2, gateNumber: 'A2', terminal: 'A', status: 'OCCUPIED', airportCode: 'ISB' },
          { id: 3, gateNumber: 'B1', terminal: 'B', status: 'AVAILABLE', airportCode: 'ISB' },
          { id: 4, gateNumber: 'B2', terminal: 'B', status: 'MAINTENANCE', airportCode: 'ISB' },
          { id: 5, gateNumber: 'C1', terminal: 'C', status: 'AVAILABLE', airportCode: 'KHI' }
        ]
        setGates(mockGates)
        setFilteredGates(mockGates)
      } catch (error) {
        toast.error('Failed to load gates')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadGates()
  }, [])

  useEffect(() => {
    let filtered = gates.filter(
      (g) =>
        g.gateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.terminal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.id?.toString().includes(searchTerm)
    )

    if (sortBy === 'gate') {
      filtered = filtered.sort((a, b) => a.gateNumber.localeCompare(b.gateNumber))
    } else if (sortBy === 'status') {
      filtered = filtered.sort((a, b) => a.status.localeCompare(b.status))
    } else if (sortBy === 'terminal') {
      filtered = filtered.sort((a, b) => a.terminal.localeCompare(b.terminal))
    }

    setFilteredGates(filtered)
  }, [searchTerm, gates, sortBy])

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'color: #10b981'
      case 'OCCUPIED':
        return 'color: #3b82f6'
      case 'MAINTENANCE':
        return 'color: #f59e0b'
      default:
        return ''
    }
  }

  return (
    <div className="passengers-list">
      {/* Header Section */}
      <div className="list-header">
        <div className="list-header-content">
          <h1 className="list-title">
            <FaDoorOpen className="title-icon" />
            Gates Directory
          </h1>
          <p className="list-subtitle">View airport gates and their current status.</p>
        </div>
        <div className="list-stats">
          <div className="list-stat-item">
            <span className="list-stat-label">Total</span>
            <span className="list-stat-value">{gates.length}</span>
          </div>
          <div className="list-stat-divider"></div>
          <div className="list-stat-item">
            <span className="list-stat-label">Showing</span>
            <span className="list-stat-value">{filteredGates.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="list-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by gate number, terminal, or status..."
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
            <option value="gate">By Gate Number</option>
            <option value="terminal">By Terminal</option>
            <option value="status">By Status</option>
          </select>
        </div>
      </div>

      {/* Cards Grid Section */}
      {loading ? (
        <div className="list-loading">
          <div className="loading-spinner-large"></div>
          <p>Loading gates...</p>
        </div>
      ) : filteredGates.length === 0 ? (
        <div className="list-empty">
          <FaDoorOpen className="empty-icon-large" />
          <h3>No gates found</h3>
          <p>{searchTerm ? 'Try adjusting your search terms' : 'No gates available'}</p>
        </div>
      ) : (
        <div className="passengers-grid">
          {filteredGates.map((gate) => (
            <div key={gate.id} className="passenger-card">
              <div className="card-header">
                <div className="passenger-avatar-large">{gate.gateNumber}</div>
                <div className="card-id">ID: {gate.id}</div>
              </div>

              <div className="card-body">
                <h3 className="passenger-full-name">Gate {gate.gateNumber}</h3>
                <div className="passport-info">
                  <FaDoorOpen className="passport-icon-card" />
                  <span className="passport-number">Terminal {gate.terminal}</span>
                </div>
                <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Airport: {gate.airportCode}
                  </span>
                </div>
                <div className="passport-info" style={{ marginTop: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      ...{ getStatusColor: getStatusColor(gate.status) }
                    }}
                  >
                    Status:{' '}
                    <strong
                      style={
                        getStatusColor(gate.status) ? { style: getStatusColor(gate.status) } : {}
                      }
                    >
                      {gate.status}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
