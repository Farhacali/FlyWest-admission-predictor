import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import UniversityExplorer from './components/UniversityExplorer';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 className="text-gradient" style={{ margin: 0, fontWeight: 700 }}>FlyWest Admissions</h2>
          </Link>
          <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 50 }}>
            <Link to="/universities" className="btn btn-secondary" style={{ border: 'none', boxShadow: 'none' }}>Explore Universities</Link>
            <Link to="/predict" className="btn btn-secondary">Get Started</Link>
            <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/predict" element={<ProfileForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/universities" element={<UniversityExplorer />} />
        </Routes>

        <footer style={{ marginTop: '5rem', textAlign: 'center', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
          <p>&copy; {new Date().getFullYear()} FlyWest Education Counselors. All rights reserved.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Empowering students to achieve their global study dreams.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
