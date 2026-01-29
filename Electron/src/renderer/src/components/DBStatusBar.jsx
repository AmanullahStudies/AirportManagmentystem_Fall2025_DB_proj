import { useState, useEffect } from 'react'
import { checkDBStatus } from '../apis/dbApi'
import '../assets/CssAll/Components/dbStatusBar.css'

export default function DBStatusBar() {
  const [status, setStatus] = useState('checking')
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await checkDBStatus()
        if (result && result.success) {
          setStatus('connected')
          setError(null)
        } else {
          setStatus('disconnected')
          setError(result?.error || 'Connection failed')
        }
      } catch (err) {
        setStatus('disconnected')
        setError(err.message || 'Connection error')
      }
    }

    // Check immediately
    checkStatus()
    
    // Check every 5 seconds
    const interval = setInterval(checkStatus, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`db-status-bar db-status-${status}`}>
      <span className="status-indicator"></span>
      {status === 'connected' && <span>✓ Database: Connected</span>}
      {status === 'disconnected' && <span>✗ Database: Disconnected</span>}
      {status === 'checking' && <span>⟳ Database: Checking...</span>}
    </div>
  )
}
