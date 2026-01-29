# API Documentation

This document explains how to communicate with the Express database server from your React frontend.

## How It Works

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│  React Browser  │         │  Express Server  │         │  MariaDB     │
│  (Frontend)     │◄───────►│  (Port 8888)     │◄───────►│  (Database)  │
└─────────────────┘         └──────────────────┘         └──────────────┘
   1. Send JSON               2. Receive JSON            3. Execute
      Query Request              Response               Query
```

## Server URL

```
http://localhost:8888
```

---

## API Endpoints

### 1. Health Check
**Check if server is running**

```
GET http://localhost:8888/health
```

**Response (200 - Success):**
```json
{
  "success": true,
  "message": "Server and database connection are healthy",
  "timestamp": "2026-01-27T10:30:45.123Z"
}
```

**Response (503 - Error):**
```json
{
  "success": false,
  "error": "Database connection unhealthy",
  "message": "Cannot connect to database server",
  "timestamp": "2026-01-27T10:30:45.123Z"
}
```

---

### 2. Execute Direct Query
**Send SQL query directly to the database**

```
POST http://localhost:8888/api/query
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "SELECT * FROM sample_test"
}
```

**Response (200 - Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "test_name": "Database Connection Test",
      "created_at": "2026-01-26T22:34:34.000Z"
    },
    {
      "id": 2,
      "test_name": "AirportSys Database",
      "created_at": "2026-01-26T22:34:34.000Z"
    }
  ],
  "message": "Query executed successfully",
  "rowCount": 2,
  "requestId": 1674808245123,
  "timestamp": "2026-01-27T10:30:45.123Z"
}
```

**Response (400 - Error: Bad Query):**
```json
{
  "success": false,
  "error": "SQL Syntax Error",
  "message": "The SQL query contains syntax errors",
  "details": "You have an error in your SQL syntax...",
  "requestId": 1674808245123,
  "timestamp": "2026-01-27T10:30:45.123Z"
}
```

---

### 3. Execute Parameterized Query (RECOMMENDED)
**Send SQL query with parameters (safer for user input)**

```
POST http://localhost:8888/api/query-safe
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "SELECT * FROM sample_test WHERE id = ?",
  "params": [1]
}
```

**Response (200 - Success):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "test_name": "Database Connection Test",
      "created_at": "2026-01-26T22:34:34.000Z"
    }
  ],
  "message": "Query executed successfully",
  "rowCount": 1,
  "requestId": 1674808245456,
  "timestamp": "2026-01-27T10:30:45.456Z"
}
```

---

## Query Examples

### SELECT - Get all data
```javascript
const response = await fetch('http://localhost:8888/api/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'SELECT * FROM sample_test LIMIT 10'
  })
});
const data = await response.json();
console.log(data.data);  // Array of rows
```

### SELECT - Get specific data with filter
```javascript
const response = await fetch('http://localhost:8888/api/query-safe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'SELECT * FROM sample_test WHERE id = ?',
    params: [1]
  })
});
const data = await response.json();
console.log(data.data[0]);  // Single row
```

### INSERT - Add new data
```javascript
const response = await fetch('http://localhost:8888/api/query-safe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'INSERT INTO sample_test (test_name) VALUES (?)',
    params: ['My Test Entry']
  })
});
const data = await response.json();
console.log(data.rowCount);  // Number of rows affected
```

### UPDATE - Modify existing data
```javascript
const response = await fetch('http://localhost:8888/api/query-safe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'UPDATE sample_test SET test_name = ? WHERE id = ?',
    params: ['Updated Name', 1]
  })
});
const data = await response.json();
console.log(data.rowCount);  // Rows updated
```

### DELETE - Remove data
```javascript
const response = await fetch('http://localhost:8888/api/query-safe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'DELETE FROM sample_test WHERE id = ?',
    params: [1]
  })
});
const data = await response.json();
console.log(data.rowCount);  // Rows deleted
```

---

## Response Format

Every API response is **JSON** with this structure:

```json
{
  "success": true/false,
  "data": [...],              // Array of rows (only if SELECT)
  "rowCount": 5,              // Number of rows affected/returned
  "message": "...",           // Human readable message
  "error": "...",             // Error type (if failed)
  "details": "...",           // Error details (if failed)
  "requestId": 1234567890,    // Unique ID for tracking
  "timestamp": "2026-01-27..." // When request was processed
}
```

### Success Response
```json
{
  "success": true,
  "data": [{...}, {...}],
  "rowCount": 2,
  "message": "Query executed successfully",
  "requestId": 1674808245123,
  "timestamp": "2026-01-27T10:30:45.123Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "SQL Syntax Error",
  "message": "The SQL query contains syntax errors",
  "details": "You have an error in your SQL syntax...",
  "requestId": 1674808245123,
  "timestamp": "2026-01-27T10:30:45.123Z"
}
```

---

## Using in React

### Simple Function to Query Server

```javascript
async function queryServer(sqlQuery, params = null) {
  try {
    const endpoint = params ? '/api/query-safe' : '/api/query';
    const body = params 
      ? { query: sqlQuery, params }
      : { query: sqlQuery };

    const response = await fetch(`http://localhost:8888${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!data.success) {
      console.error(`Error [${data.requestId}]:`, data.error);
      throw new Error(data.message);
    }

    return data.data;  // Return the rows
  } catch (error) {
    console.error('Query failed:', error.message);
    throw error;
  }
}
```

### Using the Function

```javascript
// Get all data
const rows = await queryServer('SELECT * FROM sample_test');
console.log(rows);

// Get specific data
const row = await queryServer('SELECT * FROM sample_test WHERE id = ?', [1]);
console.log(row[0]);

// Insert data
await queryServer('INSERT INTO sample_test (test_name) VALUES (?)', ['New Entry']);

// Update data
await queryServer('UPDATE sample_test SET test_name = ? WHERE id = ?', ['Updated', 1]);

// Delete data
await queryServer('DELETE FROM sample_test WHERE id = ?', [1]);
```

---

## React Component Example

```javascript
import { useState, useEffect } from 'react';

function DataViewer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // Check if server is healthy
        const healthRes = await fetch('http://localhost:8888/health');
        const healthData = await healthRes.json();
        
        if (!healthData.success) {
          throw new Error('Server is not responding');
        }

        // Query the database
        const queryRes = await fetch('http://localhost:8888/api/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: 'SELECT * FROM sample_test LIMIT 20'
          })
        });

        const queryData = await queryRes.json();

        if (!queryData.success) {
          throw new Error(queryData.error);
        }

        setData(queryData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Database Records</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.test_name}</td>
              <td>{new Date(row.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataViewer;
```

---

## Error Codes

| HTTP Status | Error | Meaning |
|-------------|-------|---------|
| 200 | None | Query successful |
| 400 | Bad Request | Invalid query format or SQL syntax error |
| 401 | Authentication Failed | Database credentials wrong |
| 404 | Not Found | Table or database doesn't exist |
| 503 | Service Unavailable | Cannot connect to database server |
| 500 | Internal Server Error | Unexpected server error |

---

## What You Send vs What You Get

### You Send (Request)
```javascript
{
  query: "SELECT * FROM users WHERE age > ? AND city = ?",
  params: [18, "New York"]
}
```

### Server Processes
- Validates the query
- Connects to MariaDB database
- Executes: `SELECT * FROM users WHERE age > 18 AND city = "New York"`
- Gets the results from database

### You Get Back (Response)
```javascript
{
  success: true,
  data: [
    { id: 1, name: "John", age: 25, city: "New York" },
    { id: 2, name: "Jane", age: 30, city: "New York" }
  ],
  rowCount: 2,
  message: "Query executed successfully",
  requestId: 1674808245,
  timestamp: "2026-01-27T10:30:45.123Z"
}
```

---

## Summary

| Aspect | Details |
|--------|---------|
| **Server URL** | `http://localhost:8888` |
| **Health Check** | `GET /health` |
| **Query Endpoint** | `POST /api/query` - direct SQL |
| **Safe Query** | `POST /api/query-safe` - with parameters |
| **Request Format** | JSON: `{ query: "...", params: [...] }` |
| **Response Format** | JSON: `{ success, data, rowCount, error, ... }` |
| **Response Type** | Always JSON |
| **Row Data** | Array of objects (from `response.data`) |
| **Use From** | Browser (React, Vue, etc.) via fetch() |
| **CORS** | Enabled for localhost |

---

## Quick Checklist

- ✅ Server running on port 8888
- ✅ Database connected (test on startup)
- ✅ Use `/api/query-safe` with parameters for user input
- ✅ Always check `response.success` before using data
- ✅ Handle errors with `response.error`
- ✅ Use `requestId` for debugging
- ✅ Response is always JSON
- ✅ `response.data` contains the database rows
