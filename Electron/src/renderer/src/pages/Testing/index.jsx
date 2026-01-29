import { useState, useEffect } from 'react'
import { selectQuery, mutationQuery } from '../../apis/dbApi'
import './testing.css'

export default function TestingGround() {
  const [testData, setTestData] = useState([])
  const [testName, setTestName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Fetch all test data
  const fetchData = async () => {
    setLoading(true)
    const sql = 'SELECT id, test_name, created_at FROM sample_test ORDER BY created_at DESC'
    const result = await selectQuery(sql)
    setTestData(result)
    setLoading(false)
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Add new test record
  const handleAdd = async () => {
    if (!testName.trim()) {
      setMessage('❌ Please enter a test name')
      return
    }

    setLoading(true)
    const sql = 'INSERT INTO sample_test (test_name) VALUES (?)'
    const result = await mutationQuery(sql, [testName])
    
    if (result > 0) {
      setMessage('✅ Record added successfully')
      setTestName('')
      await fetchData()
    } else {
      setMessage('❌ Failed to add record')
    }
    setLoading(false)
  }

  // Delete test record
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return

    setLoading(true)
    const sql = 'DELETE FROM sample_test WHERE id = ?'
    const result = await mutationQuery(sql, [id])
    
    if (result > 0) {
      setMessage('✅ Record deleted successfully')
      await fetchData()
    } else {
      setMessage('❌ Failed to delete record')
    }
    setLoading(false)
  }

  // Start editing
  const handleEditStart = (id, name) => {
    setEditingId(id)
    setEditingName(name)
  }

  // Save edited record
  const handleEditSave = async (id) => {
    if (!editingName.trim()) {
      setMessage('❌ Please enter a test name')
      return
    }

    setLoading(true)
    const sql = 'UPDATE sample_test SET test_name = ? WHERE id = ?'
    const result = await mutationQuery(sql, [editingName, id])
    
    if (result > 0) {
      setMessage('✅ Record updated successfully')
      setEditingId(null)
      setEditingName('')
      await fetchData()
    } else {
      setMessage('❌ Failed to update record')
    }
    setLoading(false)
  }

  // Cancel editing
  const handleEditCancel = () => {
    setEditingId(null)
    setEditingName('')
  }

  return (
    <div className="testing-ground">
      <h1>🧪 Database Testing Ground</h1>
      <p>Test CRUD operations on the <code>sample_test</code> table</p>

      {/* Message Display */}
      {message && (
        <div className="message-box">
          {message}
          <button onClick={() => setMessage('')}>✕</button>
        </div>
      )}

      {/* Add Form */}
      <div className="form-section">
        <h2>➕ Add New Test Record</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter test name..."
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} disabled={loading}>
            {loading ? 'Adding...' : 'Add Record'}
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-section">
        <h2>📊 All Test Records</h2>
        {loading && <p>Loading...</p>}
        {testData.length === 0 && !loading && <p>No records found. Add some test data!</p>}
        
        {testData.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Test Name</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testData.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>
                    {editingId === record.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="edit-input"
                      />
                    ) : (
                      record.test_name
                    )}
                  </td>
                  <td>{new Date(record.created_at).toLocaleString()}</td>
                  <td className="actions">
                    {editingId === record.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(record.id)}
                          className="btn-save"
                          disabled={loading}
                        >
                          ✓ Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="btn-cancel"
                          disabled={loading}
                        >
                          ✕ Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(record.id, record.test_name)}
                          className="btn-edit"
                        >
                          ✎ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="btn-delete"
                        >
                          🗑 Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Refresh Button */}
      <div className="refresh-section">
        <button onClick={fetchData} disabled={loading} className="btn-refresh">
          🔄 Refresh Data
        </button>
        <span>Total Records: {testData.length}</span>
      </div>
    </div>
  )
}
