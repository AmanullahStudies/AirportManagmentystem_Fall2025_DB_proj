// src/pages/Home.jsx
import { Link } from 'react-router-dom'
import {
  FaPlane,
  FaUsers,
  FaTicketAlt,
  FaBuilding,
  FaDoorOpen,
  FaChartLine,
  FaRoute,
  FaPlaneArrival,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaDatabase,
  FaCode
} from 'react-icons/fa'
import '@renderer/assets/CssAll/pages/h.css'

export default function Home() {
  const features = [
    {
      icon: <FaPlane />,
      title: 'Flight Management',
      description: 'Schedule, track, and manage flight operations with real-time updates.',
      link: '/flights',
      color: 'blue'
    },
    {
      icon: <FaUsers />,
      title: 'Passenger Records',
      description: 'Maintain comprehensive passenger information and travel history.',
      link: '/passengers',
      color: 'green'
    },
    {
      icon: <FaTicketAlt />,
      title: 'Booking System',
      description: 'Handle reservations, ticket management, and seat assignments.',
      link: '/bookings',
      color: 'orange'
    },
    {
      icon: <FaBuilding />,
      title: 'Airlines & Aircraft',
      description: 'Manage airline partnerships and aircraft fleet information.',
      link: '/airlines',
      color: 'purple'
    },
    {
      icon: <FaPlaneArrival />,
      title: 'Airports & Routes',
      description: 'Configure airports and establish flight routes worldwide.',
      link: '/airports',
      color: 'cyan'
    },
    {
      icon: <FaChartLine />,
      title: 'Reports & Analytics',
      description: 'Generate insights with comprehensive reporting tools.',
      link: '/reports',
      color: 'pink'
    }
  ]

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-badge">
          <FaDatabase className="hero-badge-icon" />
          <span>Database Systems Lab Project</span>
        </div>
        <h1 className="hero-title">
          <span className="title-icon">✈️</span>
          Airport Management System
        </h1>
        <p className="hero-subtitle">
          A comprehensive database-driven solution for managing airport operations, flight
          schedules, passenger records, and airline coordination.
        </p>
      </div>

      {/* Project Info Card */}
      <div className="project-info-card">
        <div className="info-header">
          <FaUserGraduate className="info-icon" />
          <h2>Project Information</h2>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Course</span>
            <span className="info-value">Database Systems Lab</span>
          </div>
          <div className="info-item">
            <span className="info-label">Session</span>
            <span className="info-value">Spring 2025</span>
          </div>
          <div className="info-item">
            <span className="info-label">Semester</span>
            <span className="info-value">Fall 2025</span>
          </div>
          <div className="info-item">
            <span className="info-label">Section</span>
            <span className="info-value">Cyber Security - A</span>
          </div>
        </div>

        <div className="team-section">
          <h3 className="team-title">
            <FaUsers className="team-icon" />
            Team Members
          </h3>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">A</div>
              <div className="member-info">
                <p className="member-name">Amanullah</p>
                <p className="member-roll">2025(S)-CYS-6</p>
              </div>
            </div>
            <div className="team-member">
              <div className="member-avatar">F</div>
              <div className="member-info">
                <p className="member-name">Fahad</p>
                <p className="member-roll">2025(S)-CYS-8</p>
              </div>
            </div>
          </div>
        </div>

        <div className="supervisors-section">
          <h3 className="supervisors-title">
            <FaChalkboardTeacher className="supervisors-icon" />
            Submitted To
          </h3>
          <div className="supervisors-grid">
            <div className="supervisor-tag">Ma&apos;am Sahar</div>
            <div className="supervisor-tag">Ma&apos;am Maheen</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="features-section">
        <h2 className="section-title">
          <FaCode className="section-icon" />
          System Features
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link} className={`feature-card feature-${feature.color}`}>
              <div className="feature-icon-wrapper">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="tech-stack-section">
        <h2 className="section-title">
          <FaDatabase className="section-icon" />
          Technology Stack & Architecture
        </h2>
        <div className="tech-grid">
          <div className="tech-item">
            <div className="tech-icon">🖥️</div>
            <h4>Electron.js + React</h4>
            <p>Desktop app built with Electron, React, and Vite for fast development</p>
          </div>
          <div className="tech-item">
            <div className="tech-icon">🔌</div>
            <h4>Express.js Server</h4>
            <p>REST API middleware connecting frontend to database</p>
          </div>
          <div className="tech-item">
            <div className="tech-icon">🗄️</div>
            <h4>MySQL / MariaDB</h4>
            <p>Relational database on Linux Mint with constraints and validation</p>
          </div>
          <div className="tech-item">
            <div className="tech-icon">⚡</div>
            <h4>Error Handling</h4>
            <p>Multi-layer validation: DB constraints, Express API, and Electron frontend</p>
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="architecture-section">
        <h2 className="section-title">
          <FaCode className="section-icon" />
          System Architecture
        </h2>
        <div className="architecture-flow">
          <div className="arch-box arch-frontend">
            <div className="arch-icon">🖥️</div>
            <h4>Electron Frontend</h4>
            <p>React + Vite + React Router</p>
            <span className="arch-tech">User Interface Layer</span>
          </div>

          <div className="arch-arrow">→</div>

          <div className="arch-box arch-backend">
            <div className="arch-icon">🔌</div>
            <h4>Express.js API</h4>
            <p>REST endpoints + validation</p>
            <span className="arch-tech">Application Layer</span>
          </div>

          <div className="arch-arrow">→</div>

          <div className="arch-box arch-database">
            <div className="arch-icon">🗄️</div>
            <h4>MySQL / MariaDB</h4>
            <p>Tables, constraints, triggers</p>
            <span className="arch-tech">Data Layer</span>
          </div>
        </div>

        <div className="architecture-notes">
          <div className="arch-note">
            <div className="note-icon">✓</div>
            <p>
              <strong>Frontend Validation:</strong> Real-time input checks and user feedback
            </p>
          </div>
          <div className="arch-note">
            <div className="note-icon">✓</div>
            <p>
              <strong>API Validation:</strong> Express.js validates and sanitizes all requests
            </p>
          </div>
          <div className="arch-note">
            <div className="note-icon">✓</div>
            <p>
              <strong>Database Constraints:</strong> CHECK constraints, foreign keys, and triggers
              ensure data integrity
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="home-footer">
        <p>Built with ❤️ for Database Systems Lab • Spring 2025</p>
      </div>
    </div>
  )
}
