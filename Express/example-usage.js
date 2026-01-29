/**
 * EXAMPLE: How to use the Database Tunnel Server from your React frontend
 * 
 * Server runs on: http://localhost:8888
 * This file demonstrates common database operations through the Express API
 */

const API_BASE_URL = 'http://localhost:8888';

// ==================== UTILITY FUNCTIONS ====================

/**
 * Generic function to execute queries
 * @param {string} endpoint - '/api/query' or '/api/query-safe'
 * @param {object} payload - Query payload
 * @returns {Promise<object>} Response data
 */
async function executeQuery(endpoint, payload) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error [${data.requestId}]:`, data.error);
      throw new Error(data.message || 'API request failed');
    }

    if (!data.success) {
      console.error(`Query Error [${data.requestId}]:`, data.error);
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}

/**
 * Check if server is running
 */
async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✓ Server is healthy');
      return true;
    } else {
      console.error('✗ Server is unhealthy:', data.error);
      return false;
    }
  } catch (error) {
    console.error('✗ Cannot connect to server:', error.message);
    return false;
  }
}

// ==================== SELECT QUERIES ====================

/**
 * Get all users from the database
 */
async function getAllUsers() {
  return executeQuery('/api/query', {
    query: 'SELECT * FROM users'
  });
}

/**
 * Get a specific user by ID (safe version)
 * @param {number} userId 
 */
async function getUserById(userId) {
  return executeQuery('/api/query-safe', {
    query: 'SELECT * FROM users WHERE id = ?',
    params: [userId]
  });
}

/**
 * Search users by name (safe version prevents SQL injection)
 * @param {string} searchTerm 
 */
async function searchUsersByName(searchTerm) {
  return executeQuery('/api/query-safe', {
    query: 'SELECT * FROM users WHERE name LIKE ?',
    params: [`%${searchTerm}%`]
  });
}

/**
 * Get users with pagination
 * @param {number} page - Page number (starting from 1)
 * @param {number} limit - Items per page
 */
async function getUsersWithPagination(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  return executeQuery('/api/query', {
    query: `SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`
  });
}

// ==================== INSERT QUERIES ====================

/**
 * Create a new user (safe version)
 * @param {string} name 
 * @param {string} email 
 * @param {string} phone 
 */
async function createUser(name, email, phone) {
  return executeQuery('/api/query-safe', {
    query: 'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)',
    params: [name, email, phone]
  });
}

/**
 * Insert multiple users at once
 * @param {array} users - Array of user objects [{name, email, phone}, ...]
 */
async function createMultipleUsers(users) {
  // Option 1: Multiple individual inserts (slower but safer)
  const results = [];
  for (const user of users) {
    const result = await createUser(user.name, user.email, user.phone);
    results.push(result);
  }
  return results;

  // Option 2: Single batch insert (faster but requires proper formatting)
  // return executeQuery('/api/query', {
  //   query: `INSERT INTO users (name, email, phone) VALUES 
  //           ('${users[0].name}', '${users[0].email}', '${users[0].phone}'),
  //           ('${users[1].name}', '${users[1].email}', '${users[1].phone}')`
  // });
}

// ==================== UPDATE QUERIES ====================

/**
 * Update user information (safe version)
 * @param {number} userId 
 * @param {string} name 
 * @param {string} email 
 */
async function updateUser(userId, name, email) {
  return executeQuery('/api/query-safe', {
    query: 'UPDATE users SET name = ?, email = ? WHERE id = ?',
    params: [name, email, userId]
  });
}

/**
 * Update user status (safe version)
 * @param {number} userId 
 * @param {string} status 
 */
async function updateUserStatus(userId, status) {
  return executeQuery('/api/query-safe', {
    query: 'UPDATE users SET status = ? WHERE id = ?',
    params: [status, userId]
  });
}

// ==================== DELETE QUERIES ====================

/**
 * Delete a user (safe version)
 * @param {number} userId 
 */
async function deleteUser(userId) {
  return executeQuery('/api/query-safe', {
    query: 'DELETE FROM users WHERE id = ?',
    params: [userId]
  });
}

/**
 * Delete multiple users (safe version)
 * @param {array} userIds - Array of user IDs to delete
 */
async function deleteMultipleUsers(userIds) {
  const placeholders = userIds.map(() => '?').join(',');
  return executeQuery('/api/query-safe', {
    query: `DELETE FROM users WHERE id IN (${placeholders})`,
    params: userIds
  });
}

// ==================== AGGREGATE QUERIES ====================

/**
 * Get total user count
 */
async function getUserCount() {
  const result = await executeQuery('/api/query', {
    query: 'SELECT COUNT(*) as total FROM users'
  });
  return result.data[0].total;
}

/**
 * Get user statistics
 */
async function getUserStatistics() {
  return executeQuery('/api/query', {
    query: `SELECT 
      COUNT(*) as total_users,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
      COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_users,
      MAX(created_at) as latest_user_created
    FROM users`
  });
}

// ==================== COMPLEX QUERIES ====================

/**
 * Get users with their order count
 */
async function getUsersWithOrderCount() {
  return executeQuery('/api/query', {
    query: `SELECT 
      u.id,
      u.name,
      u.email,
      COUNT(o.id) as order_count
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id
    ORDER BY order_count DESC`
  });
}

/**
 * Get top 5 customers by total spending
 */
async function getTopCustomers() {
  return executeQuery('/api/query', {
    query: `SELECT 
      u.id,
      u.name,
      COUNT(o.id) as total_orders,
      SUM(o.amount) as total_spent
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id
    ORDER BY total_spent DESC
    LIMIT 5`
  });
}

// ==================== ERROR HANDLING EXAMPLE ====================

/**
 * Example of proper error handling in React component
 */
async function exampleWithErrorHandling() {
  try {
    // First check if server is healthy
    const isHealthy = await checkServerHealth();
    if (!isHealthy) {
      console.error('Server is not available');
      return null;
    }

    // Then execute your query
    const result = await getAllUsers();
    
    if (result.success && result.data.length > 0) {
      console.log(`Fetched ${result.data.length} users`);
      console.log('Data:', result.data);
      return result.data;
    } else if (result.success && result.data.length === 0) {
      console.log('No users found');
      return [];
    }

  } catch (error) {
    // Handle different types of errors
    if (error.message.includes('Cannot connect')) {
      console.error('Cannot connect to server. Is it running on port 3001?');
    } else if (error.message.includes('Syntax')) {
      console.error('SQL syntax error. Check your query.');
    } else if (error.message.includes('Table')) {
      console.error('Table not found. Check your schema.');
    } else {
      console.error('Unknown error:', error.message);
    }
    return null;
  }
}

// ==================== USAGE IN REACT COMPONENT ====================

/*
Example React Hook for fetching users:

import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await getAllUsers();
        if (result.success) {
          setUsers(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name} ({user.email})</div>
      ))}
    </div>
  );
}

export default UserList;
*/

// ==================== EXPORT FUNCTIONS ====================

// Export all functions for use in your React app
export {
  checkServerHealth,
  getAllUsers,
  getUserById,
  searchUsersByName,
  getUsersWithPagination,
  createUser,
  createMultipleUsers,
  updateUser,
  updateUserStatus,
  deleteUser,
  deleteMultipleUsers,
  getUserCount,
  getUserStatistics,
  getUsersWithOrderCount,
  getTopCustomers,
  exampleWithErrorHandling,
};
