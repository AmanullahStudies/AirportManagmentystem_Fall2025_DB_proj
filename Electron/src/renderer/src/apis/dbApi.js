// Configuration for Express server
const SERVER_URL = 'http://localhost:8888'

// Execute query with parameters (RECOMMENDED - prevents SQL injection)
export const queryDB = async (sql, params = null) => {
  try {
    const endpoint = params ? '/api/query-safe' : '/api/query'
    const body = params 
      ? { query: sql, params }
      : { query: sql }

    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || data.error || 'Query failed')
    }

    return data
  } catch (error) {
    console.error('Database query error:', error)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

// Check database connection status
export const checkDBStatus = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/health`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Health check error:', error)
    return {
      success: false,
      connected: false,
      error: 'Cannot connect to database server'
    }
  }
}

// Helper function for SELECT queries
export const selectQuery = async (sql, params = null) => {
  const result = await queryDB(sql, params)
  return result.success ? result.data : []
}

// Helper function for INSERT/UPDATE/DELETE queries
export const mutationQuery = async (sql, params = null) => {
  const result = await queryDB(sql, params)
  return result.success ? result.rowCount : 0
}
