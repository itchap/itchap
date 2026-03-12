import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import AboutMe from './AboutMe';

function App() {
  const theme = { bg: '#011e2b', textMain: '#fff', accent: '#00ed64' };

  return (
    <Router>
      <div style={{ backgroundColor: theme.bg, minHeight: '100vh', color: theme.textMain }}>
        
        {/* GLOBAL NAVIGATION BAR (Shows on all pages) */}
        <nav style={{ padding: '20px', display: 'flex', justifyContent: 'center', gap: '30px', borderBottom: '1px solid #333' }}>
          
          {/* Use React Router's <Link> instead of <a> tags! */}
          <Link to="/" style={{ color: theme.textMain, textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
            Home
          </Link>
          
          <Link to="/about" style={{ color: theme.textMain, textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
            About
          </Link>

          {/* Links to your other external apps can stay as normal <a> tags */}
          <a href="/trust-rater" style={{ color: theme.textMain, textDecoration: 'none', fontSize: '18px' }}>Trust Rater</a>
          <a href="/skills-matrix" style={{ color: theme.textMain, textDecoration: 'none', fontSize: '18px' }}>Skills Matrix</a>
        </nav>

        {/* THE ROUTER (Swaps pages in and out instantly) */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutMe />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;