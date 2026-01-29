console.log('main.jsx loaded FIRST LINE')

import './assets/CssAll/Mainz/main.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

console.log('All imports loaded in main.jsx')

// Function to intercept link clicks and handle internal/external links
const interceptLinks = () => {
  document.addEventListener('click', (event) => {
    const target = event.target

    // Check if the clicked element is a link
    if (target.tagName === 'A') {
      const href = target.getAttribute('href')
      const targetAttr = target.getAttribute('target')

      // Handle internal links (starting with /)
      if (href && href.startsWith('/')) {
        event.preventDefault()
        if (targetAttr === '_blank') {
          window.api.openNewWindow(href)
        } else {
          window.location.hash = href
        }
      }
      // Handle external links
      else if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        event.preventDefault()
        if (targetAttr === '_blank') {
          window.api.openNewWindow(href)
        } else {
          window.api.shell.openExternal(href)
        }
      }
    }
  })
}

// Initialize the app
const initializeApp = () => {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <App />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </React.StrictMode>
  )
}

// Call the link interceptor after the app is rendered
interceptLinks()

// Initialize the app
initializeApp()
