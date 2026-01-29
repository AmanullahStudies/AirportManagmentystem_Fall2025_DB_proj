import { useState, useEffect } from 'react'

function Count() {
  const [count, setCount] = useState(0)

  // This function will be called when the button is clicked
  const handleIncreaseCount = () => {
    // Send a message to the main process to increase the count
    window.electron.ipcRenderer.send('increase-count')
  }

  // Listen for the updated count from the main process
  useEffect(() => {
    const handleCountUpdate = (event, newCount) => {
      setCount(newCount)
    }

    // Set up IPC listener for count updates
    window.electron.ipcRenderer.on('count-updated', handleCountUpdate)

    // Cleanup the listener on component unmount
    return () => {
      window.electron.ipcRenderer.removeListener('count-updated', handleCountUpdate)
    }
  }, [])

  return (
    <div className="actions">
      <h1 className="count">Count: {count}</h1>
      <button className="action" onClick={handleIncreaseCount}>
        Increase Count
      </button>
      <div>
        <h1>testing h1</h1>
        <h2>testing h2</h2>
        <h6>testing h6</h6>
        <p>testing p</p>
      </div>
    </div>
  )
}

export default Count
