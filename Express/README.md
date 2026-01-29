# Database Tunnel Server

A lightweight Express server that acts as a tunnel between your React frontend and local SQL/MariaDB server on port **8888** (avoiding 3000-range conflicts).

## Features

- ✓ Runs on port **8888** (not in 3000 range)
- ✓ Acts as API gateway for database queries
- ✓ Comprehensive error handling
- ✓ Connection pooling for better performance
- ✓ Auto-creates database if it doesn't exist
- ✓ Both parameterized and direct query endpoints
- ✓ Request logging with request IDs
- ✓ Health check endpoint
- ✓ CORS enabled for localhost

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL or MariaDB server running locally
- A database and user credentials

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_USER=amanullah
DB_PASSWORD=MKL<>
DB_NAME=AirportSys
DB_PORT=3306

# Server Configuration
SERVER_PORT=8888
NODE_ENV=development
```

**Note:** The database will be auto-created if it doesn't exist.

### 3. Start the Server

**Production:**
```bash
npm start
```

**Development (with auto-reload):**
```bash
npm run dev
```

The server will display:
```
============================================================
✓ Database Tunnel Server is running on port 8888
✓ Frontend can access: http://localhost:8888
✓ Health check: http://localhost:8888/health
✓ Database 'AirportSys' is ready
============================================================
```

## API Endpoints

### 1. Health Check
**Endpoint:** `GET /health`

**Description:** Verifies server and database connection status

**Response (Success):**
```json
{
  "success": true,
  "message": "Server and database connection are healthy",
  "timestamp": "2026-01-27T10:30:45.123Z"
}
```

**Response (Failure):**
```json
{
  "success": false,
  "error": "Database connection unhealthy",
  "message": "Error details here",
  "timestamp": "2026-01-27T10:30:45.123Z"
}
```

---

### 2. Execute Query (Direct)
**Endpoint:** `POST /api/query`

**Description:** Execute SQL queries directly (useful for SELECT, INSERT, UPDATE, DELETE)

**Request Body:**
```json
{
  "query": "SELECT * FROM users WHERE id = 1"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "John Doe", "email": "john@example.com" }
  ],
  "message": "Query executed successfully",
  "rowCount": 1,
  "requestId": 1674808245123,
  "timestamp": "2026-01-27T10:30:45.123Z"
}
```

**Response (Failure - Syntax Error):**
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

### 3. Execute Query (Parameterized/Safe)
**Endpoint:** `POST /api/query-safe`

**Description:** Execute SQL queries with parameters (recommended for user input)

**Request Body:**
```json
{
  "query": "SELECT * FROM users WHERE id = ? AND status = ?",
  "params": [1, "active"]
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "John Doe", "status": "active" }
  ],
  "message": "Query executed successfully",
  "rowCount": 1,
  "requestId": 1674808245456,
  "timestamp": "2026-01-27T10:30:45.456Z"
}
```

---

## Usage Examples

### React Frontend Example

```javascript
// Health check
async function checkServerHealth() {
  try {
    const response = await fetch('http://localhost:3001/health');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Server is down:', error);
  }
}

// Execute SELECT query
async function getUsers() {
  try {
    const response = await fetch('http://localhost:3001/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'SELECT id, name, email FROM users LIMIT 10'
      })
    });
    const data = await response.json();
    if (data.success) {
      console.log('Users:', data.data);
    } else {
      console.error('Query failed:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// Execute INSERT with parameters (recommended)
async function createUser(name, email) {
  try {
    const response = await fetch('http://localhost:3001/api/query-safe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'INSERT INTO users (name, email) VALUES (?, ?)',
        params: [name, email]
      })
    });
    const data = await response.json();
    if (data.success) {
      console.log('User created successfully');
    } else {
      console.error('Creation failed:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// Execute UPDATE with parameters
async function updateUser(userId, newName) {
  try {
    const response = await fetch('http://localhost:3001/api/query-safe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'UPDATE users SET name = ? WHERE id = ?',
        params: [newName, userId]
      })
    });
    const data = await response.json();
    console.log(`Rows affected: ${data.rowCount}`);
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// Execute DELETE with parameters
async function deleteUser(userId) {
  try {
    const response = await fetch('http://localhost:3001/api/query-safe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'DELETE FROM users WHERE id = ?',
        params: [userId]
      })
    });
    const data = await response.json();
    console.log(`Rows affected: ${data.rowCount}`);
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

---

## Error Handling

The server handles the following error scenarios:

| Error | Status Code | Description |
|-------|------------|-------------|
| Missing/Invalid Query | 400 | Query parameter is missing, not a string, empty, or too large |
| SQL Syntax Error | 400 | Invalid SQL syntax in the query |
| Invalid Column | 400 | Referenced column does not exist |
| Database Authentication Failed | 401 | DB_USER or DB_PASSWORD incorrect |
| Table Not Found | 404 | Referenced table does not exist |
| Database Not Found | 404 | DB_NAME does not exist |
| Database Connection Failed | 503 | Cannot connect to DB_HOST:DB_PORT |
| Database Host Not Found | 503 | DB_HOST cannot be resolved |
| Connection Lost | 503 | Connection lost during query execution |
| Query Timeout | 504 | Query took too long to execute |
| Result Set Too Large | 413 | Query returned too much data |
| Internal Server Error | 500 | Unexpected server error |

All error responses include:
- `requestId`: Unique identifier for tracking in logs
- `timestamp`: When the error occurred
- `details`: Additional information (in development mode)

---

## Logging

The server logs all activities with request IDs for easy debugging:

```
[1674808245123] Incoming query request
[1674808245123] Database connection established
[1674808245123] Executing query...
[1674808245123] Query executed successfully. Rows affected/returned: 5
[1674808245123] Database connection released
```

---

## Best Practices

### For Frontend Developers

1. **Always use `/api/query-safe` with parameters** when user input is involved
   ```javascript
   // Good - prevents SQL injection
   fetch('http://localhost:3001/api/query-safe', {
     body: JSON.stringify({
       query: 'SELECT * FROM users WHERE email = ?',
       params: [userEmail]
     })
   });

   // Avoid - SQL injection risk
   fetch('http://localhost:3001/api/query', {
     body: JSON.stringify({
       query: `SELECT * FROM users WHERE email = '${userEmail}'`
     })
   });
   ```

2. **Check response.success** before using data
   ```javascript
   const data = await response.json();
   if (!data.success) {
     console.error(`[${data.requestId}] Query failed:`, data.error);
     return;
   }
   ```

3. **Use LIMIT in SELECT queries** to avoid large result sets
   ```javascript
   { query: "SELECT * FROM users LIMIT 100" }
   ```

4. **Add proper error handling** in your React components
   ```javascript
   try {
     // API call
   } catch (error) {
     // Network error
   }
   ```

---

## Troubleshooting

### "Cannot connect to database server"
- Ensure MySQL/MariaDB is running
- Check DB_HOST and DB_PORT are correct
- Verify database user exists and has correct password

### "Database does not exist"
- Verify DB_NAME in .env matches your database name
- Create the database if it doesn't exist

### "Table does not exist"
- Verify table names in your queries match your schema
- Use backticks for table names: \`table_name\`

### "Authentication failed"
- Check DB_USER in .env
- Check DB_PASSWORD in .env
- Ensure user has access from localhost

### Server won't start
- Check all environment variables are set in .env
- Verify no other process is using port 3001
- Check Node.js version is v14 or higher

### Query results are empty
- Verify the table has data
- Check WHERE clauses are correct
- Try a simple SELECT without WHERE first

---

## Port Configuration

If port 3001 is already in use, change SERVER_PORT in .env:

```env
SERVER_PORT=3002  # or 3003, 4000, 5001, etc.
```

Then update your React frontend to use the new port:
```javascript
fetch(`http://localhost:${newPort}/api/query`, ...)
```

---

## Connection Pool Settings

The server uses a connection pool with these default settings:
- **Connection Limit**: 10 (can handle 10 simultaneous queries)
- **Max Queue**: Unlimited
- **Keep Alive**: Enabled

These are suitable for a development environment. Adjust in `server.js` if needed.

---

## Stopping the Server

Press `Ctrl+C` in the terminal. The server will:
1. Receive SIGINT signal
2. Close all database connections gracefully
3. Exit cleanly

---

## License

ISC

---

## Support

For issues or questions, check:
1. Your `.env` file for correct credentials
2. Server logs for request IDs
3. Database connection with a MySQL client
4. Firewall settings if on a network
