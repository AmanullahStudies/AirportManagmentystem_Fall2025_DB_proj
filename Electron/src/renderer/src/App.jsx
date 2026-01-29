import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import routes from './utils/routesConfig'
import Nav from './components/Navbar/Nav'
import DBStatusBar from './components/DBStatusBar'
import Home from './pages/Home'
import { NavbarProvider } from './utils/contexts/NavContext'
import { AppProvider } from './utils/contexts/AppContext'

console.log('App.jsx loaded, routes:', routes.length)

function AppLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh' }}>
      {/* Navbar - fixed height */}
      <Nav />

      {/* Main Content Area - takes remaining space */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px', paddingBottom: '50px' }}>
        {/* Tailwind wrapper */}
        <div className="tailwind-pages">
          <Routes>
            <Route path="/" element={<Home />} />
            {routes.map((route, index) =>
              route ? <Route key={index} path={route.path} element={<route.component />} /> : null
            )}
          </Routes>
        </div>
      </div>

      {/* Status Bar - fixed height at bottom */}
      <DBStatusBar />
    </div>
  )
}


function App() {
  console.log('App component rendering')
  return (
    <AppProvider>
      <NavbarProvider>
        <Router>
          <AppLayout />
        </Router>
      </NavbarProvider>
    </AppProvider>
  )
}

export default App
