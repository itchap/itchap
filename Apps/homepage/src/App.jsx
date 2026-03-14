import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import AboutMe from './AboutMe';

function App() {
  const theme = {
    bg: '#011e2b',
    border: '#333',
    accent: '#00ed64',
    textMain: '#fff',
    textSub: '#bbb'
  };

  return (
    <Router>
      <div style={{ backgroundColor: theme.bg, minHeight: '100vh', color: theme.textMain, fontFamily: 'sans-serif' }}>
        
        {/* GLOBAL STICKY NAVBAR (Your original sleek design) */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', borderBottom: `1px solid ${theme.border}`, backgroundColor: 'rgba(1, 30, 43, 0.9)', position: 'sticky', top: 0, zIndex: 100 }}>
          
          {/* LOGO (Clickable to go back Home) */}
          <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: theme.accent, display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img 
              src="https://i.postimg.cc/hvPBkY0C/ninja.png" 
              alt="itchap" 
              style={{ height: '40px', width: '40px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${theme.accent}` }} 
            />
            itchap
          </Link>

          {/* RIGHT ALIGNED MENU */}
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: 'bold' }}>
            {/* React Router Link for the About Page */}
            <Link to="/about" style={{ color: theme.textMain, textDecoration: 'none', cursor: 'pointer' }}>About</Link>
            
            {/* Standard Anchor Links for the Homepage sections */}
            <a href="/#apps" style={{ color: theme.textMain, textDecoration: 'none', cursor: 'pointer' }}>Apps</a>
            <a href="#blog" style={{ color: theme.textSub, textDecoration: 'none', cursor: 'not-allowed' }}>Blog (Soon)</a>
          </div>
        </nav>

        {/* THE ROUTER (Swaps pages in and out instantly below the navbar) */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutMe />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;