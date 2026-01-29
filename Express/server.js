require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// ==================== ENVIRONMENT VARIABLES VALIDATION ====================
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'SERVER_PORT'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(`ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

const DB_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
};

const SERVER_PORT = process.env.SERVER_PORT || 3001;

// ==================== MIDDLEWARE ====================
app.use(cors()); // Enable CORS for localhost frontend
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// ==================== REQUEST LOGGING MIDDLEWARE ====================
app.use((req, res, next) => {
  const origin = req.get('origin') || req.get('referer') || 'unknown';
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} | Origin: ${origin} | IP: ${clientIp}`);
  next();
});

// ==================== DATABASE CONNECTION POOL ====================
let pool = null;

async function initializePool() {
  try {
    // First, create a temporary connection to check/create database
    const tempConnection = await mysql.createConnection({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      port: DB_CONFIG.port,
    });

    // Check if database exists, create if not
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\``);
    console.log(`✓ Database '${DB_CONFIG.database}' is ready`);
    
    await tempConnection.end();

    // Now create the actual pool with the database selected
    pool = mysql.createPool(DB_CONFIG);
    console.log('✓ Database connection pool initialized successfully');
  } catch (error) {
    console.error('ERROR: Failed to initialize database connection pool:', error.message);
    process.exit(1);
  }
}

// ==================== ERROR HANDLING MIDDLEWARE ====================
app.use((err, req, res, next) => {
  console.error('Middleware Error:', err);
  
  return res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  });
});

// ==================== HEALTH CHECK ENDPOINT ====================
app.get('/health', async (req, res) => {
  try {
    if (!pool) {
      return res.status(503).json({
        success: false,
        error: 'Database pool not initialized',
      });
    }

    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    return res.status(200).json({
      success: true,
      message: 'Server and database connection are healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health Check Error:', error.message);
    return res.status(503).json({
      success: false,
      error: 'Database connection unhealthy',
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ==================== EXECUTE QUERY ENDPOINT ====================
app.post('/api/query', async (req, res) => {
  const { query } = req.body;
  const requestId = Date.now(); // For logging purposes

  console.log(`[${requestId}] Incoming query request`);

  // ---- INPUT VALIDATION ----
  if (!query) {
    console.warn(`[${requestId}] Invalid request: Missing 'query' parameter`);
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: "Missing required parameter: 'query'",
      requestId,
    });
  }

  if (typeof query !== 'string') {
    console.warn(`[${requestId}] Invalid request: Query must be a string`);
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Query must be a string',
      requestId,
    });
  }

  const trimmedQuery = query.trim();

  if (trimmedQuery.length === 0) {
    console.warn(`[${requestId}] Invalid request: Query cannot be empty`);
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Query cannot be empty',
      requestId,
    });
  }

  if (trimmedQuery.length > 100000) {
    console.warn(`[${requestId}] Invalid request: Query too large (${trimmedQuery.length} chars)`);
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Query exceeds maximum allowed length (100,000 characters)',
      requestId,
    });
  }

  let connection = null;

  try {
    // ---- DATABASE CONNECTION ----
    if (!pool) {
      console.error(`[${requestId}] ERROR: Database pool not initialized`);
      return res.status(503).json({
        success: false,
        error: 'Service Unavailable',
        message: 'Database connection pool not initialized',
        requestId,
      });
    }

    connection = await pool.getConnection();
    console.log(`[${requestId}] Database connection established`);

    // ---- QUERY EXECUTION ----
    console.log(`[${requestId}] Executing query...`);
    const [results] = await connection.query(trimmedQuery);

    console.log(`[${requestId}] Query executed successfully. Rows affected/returned: ${Array.isArray(results) ? results.length : 1}`);

    return res.status(200).json({
      success: true,
      data: results,
      message: 'Query executed successfully',
      rowCount: Array.isArray(results) ? results.length : (results.affectedRows || 0),
      requestId,
      timestamp: new Date().toISOString(),
    });

    // ---- SPECIFIC ERROR HANDLING ----
  } catch (error) {
    const errorCode = error.code || 'UNKNOWN_ERROR';
    const errorMessage = error.message || 'Unknown database error';

    console.error(`[${requestId}] Database Error (${errorCode}):`, errorMessage);

    // ---- ER_ACCESS_DENIED_ERROR ----
    if (errorCode === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`[${requestId}] Database authentication failed`);
      return res.status(401).json({
        success: false,
        error: 'Authentication Failed',
        message: 'Database authentication failed. Check DB_USER and DB_PASSWORD in .env',
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    // ---- ER_BAD_DB_ERROR ----
    if (errorCode === 'ER_BAD_DB_ERROR') {
      console.error(`[${requestId}] Database does not exist`);
      return res.status(404).json({
        success: false,
        error: 'Database Not Found',
        message: `Database '${process.env.DB_NAME}' does not exist`,
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    // ---- ER_SYNTAX_ERROR ----
    if (errorCode === 'ER_SYNTAX_ERROR' || errorCode === 'ER_PARSE_ERROR') {
      console.error(`[${requestId}] SQL Syntax Error`);
      return res.status(400).json({
        success: false,
        error: 'SQL Syntax Error',
        message: 'The SQL query contains syntax errors',
        details: errorMessage,
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    // ---- ER_NO_SUCH_TABLE ----
    if (errorCode === 'ER_NO_SUCH_TABLE') {
      console.error(`[${requestId}] Table does not exist`);
      return res.status(404).json({
        success: false,
        error: 'Table Not Found',
        message: 'One or more tables referenced in the query do not exist',
        details: errorMessage,
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    // ---- ER_BAD_FIELD_ERROR ----
    if (errorCode === 'ER_BAD_FIELD_ERROR') {
      console.error(`[${requestId}] Invalid column reference`);
      return res.status(400).json({
        success: false,
        error: 'Invalid Column',
        message: 'One or more columns referenced in the query do not exist',
        details: errorMessage,
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    // ---- ECONNREFUSED (Connection refused) ----
    if (error.code === 'ECONNREFUSED') {
      console.error(`[${requestId}] Database server is not accessible at ${process.env.DB_HOST}:${process.env.DB_PORT}`);
      return res.status(503).json({
        success: false,
        error: 'Database Connection Failed',
        message: `Cannot connect to database server at ${process.env.DB_HOST}:${process.env.DB_PORT}. Ensure the database server is running.`,
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    // ---- ENOTFOUND (Host not found) ----
    if (error.code === 'ENOTFOUND') {
      console.error(`[${requestId}] Database host not found`);
      return res.status(503).json({
        success: false,
        error: 'Database Host Not Found',
        message: `Cannot resolve database host: ${process.env.DB_HOST}`,
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    // ---- PROTOCOL_CONNECTION_LOST ----
    if (errorCode === 'PROTOCOL_CONNECTION_LOST') {
      console.error(`[${requestId}] Database connection lost during query execution`);
      return res.status(503).json({
        success: false,
        error: 'Connection Lost',
        message: 'Database connection was lost during query execution',
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    // ---- PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR ----
    if (errorCode === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
      console.error(`[${requestId}] Fatal database error, connection cannot be reused`);
      return res.status(503).json({
        success: false,
        error: 'Fatal Database Error',
        message: 'A fatal database error occurred. Please try again.',
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    // ---- PROTOCOL_TIMEOOUT ----
    if (errorCode === 'PROTOCOL_TIMEOUT') {
      console.error(`[${requestId}] Query execution timeout`);
      return res.status(504).json({
        success: false,
        error: 'Query Timeout',
        message: 'Query execution took too long and was terminated',
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    // ---- ER_TOO_BIG_SELECT ----
    if (errorCode === 'ER_TOO_BIG_SELECT') {
      console.error(`[${requestId}] Query result set too large`);
      return res.status(413).json({
        success: false,
        error: 'Result Set Too Large',
        message: 'The query result set is too large. Consider adding LIMIT clause.',
        requestId,
        timestamp: new Date().toISOString(),
      });
    }

    // ---- GENERIC FALLBACK ----
    console.error(`[${requestId}] Generic database error (${errorCode}):`, errorMessage);
    return res.status(500).json({
      success: false,
      error: 'Database Error',
      message: errorMessage,
      code: errorCode,
      requestId,
      timestamp: new Date().toISOString(),
    });

  } finally {
    // ---- CLEANUP ----
    if (connection) {
      try {
        connection.release();
        console.log(`[${requestId}] Database connection released`);
      } catch (releaseError) {
        console.error(`[${requestId}] Error releasing connection:`, releaseError.message);
      }
    }
  }
});

// ==================== EXECUTE QUERY WITH PARAMETERS ENDPOINT ====================
app.post('/api/query-safe', async (req, res) => {
  const { query, params } = req.body;
  const requestId = Date.now();

  console.log(`[${requestId}] Incoming parameterized query request`);

  // ---- INPUT VALIDATION ----
  if (!query) {
    console.warn(`[${requestId}] Invalid request: Missing 'query' parameter`);
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: "Missing required parameter: 'query'",
      requestId,
    });
  }

  if (!Array.isArray(params)) {
    console.warn(`[${requestId}] Invalid request: Params must be an array`);
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Parameters must be an array',
      requestId,
    });
  }

  const trimmedQuery = query.trim();

  if (trimmedQuery.length === 0) {
    console.warn(`[${requestId}] Invalid request: Query cannot be empty`);
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Query cannot be empty',
      requestId,
    });
  }

  let connection = null;

  try {
    if (!pool) {
      console.error(`[${requestId}] ERROR: Database pool not initialized`);
      return res.status(503).json({
        success: false,
        error: 'Service Unavailable',
        message: 'Database connection pool not initialized',
        requestId,
      });
    }

    connection = await pool.getConnection();
    console.log(`[${requestId}] Database connection established`);

    console.log(`[${requestId}] Executing parameterized query...`);
    const [results] = await connection.execute(trimmedQuery, params);

    console.log(`[${requestId}] Query executed successfully. Rows affected/returned: ${Array.isArray(results) ? results.length : 1}`);

    return res.status(200).json({
      success: true,
      data: results,
      message: 'Query executed successfully',
      rowCount: Array.isArray(results) ? results.length : (results.affectedRows || 0),
      requestId,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    const errorCode = error.code || 'UNKNOWN_ERROR';
    const errorMessage = error.message || 'Unknown database error';

    console.error(`[${requestId}] Database Error (${errorCode}):`, errorMessage);

    // Same error handling as /api/query
    if (errorCode === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(401).json({
        success: false,
        error: 'Authentication Failed',
        message: 'Database authentication failed',
        requestId,
      });
    }

    if (errorCode === 'ER_BAD_DB_ERROR') {
      return res.status(404).json({
        success: false,
        error: 'Database Not Found',
        message: `Database '${process.env.DB_NAME}' does not exist`,
        requestId,
      });
    }

    if (errorCode === 'ER_SYNTAX_ERROR' || errorCode === 'ER_PARSE_ERROR') {
      return res.status(400).json({
        success: false,
        error: 'SQL Syntax Error',
        message: 'The SQL query contains syntax errors',
        details: errorMessage,
        requestId,
      });
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'Database Connection Failed',
        message: `Cannot connect to database server at ${process.env.DB_HOST}:${process.env.DB_PORT}`,
        requestId,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Database Error',
      message: errorMessage,
      code: errorCode,
      requestId,
    });

  } finally {
    if (connection) {
      try {
        connection.release();
        console.log(`[${requestId}] Database connection released`);
      } catch (releaseError) {
        console.error(`[${requestId}] Error releasing connection:`, releaseError.message);
      }
    }
  }
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  console.warn(`404 Not Found: ${req.method} ${req.path}`);
  return res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.path} does not exist`,
    availableEndpoints: [
      'GET /health',
      'POST /api/query',
      'POST /api/query-safe',
    ],
  });
});

// ==================== SERVER STARTUP ====================
async function startServer() {
  try {
    await initializePool();

    // Test connection with sample query
    let connection = null;
    try {
      connection = await pool.getConnection();
      
      // First, create a sample table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS sample_test (
          id INT AUTO_INCREMENT PRIMARY KEY,
          test_name VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await connection.query(createTableQuery);
      
      // Insert sample data if table is empty
      const countQuery = 'SELECT COUNT(*) as cnt FROM sample_test';
      const [countResult] = await connection.query(countQuery);
      
      if (countResult[0].cnt === 0) {
        const insertQuery = `
          INSERT INTO sample_test (test_name) VALUES 
          ('Database Connection Test'),
          ('AirportSys Database'),
          ('MariaDB Server Active')
        `;
        await connection.query(insertQuery);
      }
      
      // Now query the data
      const testQuery = 'SELECT * FROM sample_test ORDER BY created_at DESC LIMIT 5';
      console.log(`\n${'='.repeat(70)}`);
      console.log(`🔍 TEST QUERY:`);
      console.log(`${testQuery}`);
      console.log(`${'='.repeat(70)}`);
      
      const [result] = await connection.query(testQuery);
      
      console.log(`\n✅ QUERY RESULT (${result.length} rows):`);
      console.table(result);
      console.log(`${'='.repeat(70)}\n`);
    } catch (testError) {
      console.error(`\n❌ TEST QUERY FAILED:`, testError.message);
      console.log(`${'='.repeat(70)}\n`);
    } finally {
      if (connection) {
        connection.release();
      }
    }

    app.listen(SERVER_PORT, () => {
      console.log(`${'='.repeat(70)}`);
      console.log(`✅ Database Tunnel Server is running on port ${SERVER_PORT}`);
      console.log(`📍 API endpoint: http://localhost:${SERVER_PORT}/api/query`);
      console.log(`🏥 Health check: http://localhost:${SERVER_PORT}/health`);
      console.log(`${'='.repeat(70)}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// ==================== GRACEFUL SHUTDOWN ====================
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  if (pool) {
    await pool.end();
    console.log('Database pool closed');
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  if (pool) {
    await pool.end();
    console.log('Database pool closed');
  }
  process.exit(0);
});

startServer();
