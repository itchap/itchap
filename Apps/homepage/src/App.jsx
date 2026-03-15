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
        
        {/* GLOBAL STICKY NAVBAR */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', borderBottom: `1px solid ${theme.border}`, backgroundColor: 'rgba(1, 30, 43, 0.9)', position: 'sticky', top: 0, zIndex: 100 }}>
          
          {/* LOGO */}
          <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: theme.accent, display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img 
              src="https://i.postimg.cc/hvPBkY0C/ninja.png" 
              alt="itchap" 
              style={{ height: '40px', width: '40px', borderRadius: '50%', objectFit: 'cover', border: `0px solid ${theme.accent}` }} 
            />
            itchap
          </Link>

          {/* RIGHT ALIGNED MENU */}
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: 'bold' }}>
            
            <Link 
              to="/about" 
              style={{ color: theme.textMain, textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s ease-in-out' }}
              onMouseOver={e => e.target.style.color = theme.accent} 
              onMouseOut={e => e.target.style.color = theme.textMain}
            >
              About
            </Link>
            
            <a 
              href="/#apps" 
              style={{ color: theme.textMain, textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s ease-in-out' }}
              onMouseOver={e => e.target.style.color = theme.accent} 
              onMouseOut={e => e.target.style.color = theme.textMain}
            >
              Apps
            </a>
            
            <a 
              href="/blog" 
              style={{ color: theme.textMain, textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s ease-in-out' }}
              onMouseOver={e => e.target.style.color = theme.accent} 
              onMouseOut={e => e.target.style.color = theme.textMain}
            >
              Blog
            </a>
            
          </div>
        </nav>

        {/* THE ROUTER */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutMe />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;