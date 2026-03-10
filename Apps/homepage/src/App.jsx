import React from 'react';

function App() {
  const theme = {
    bg: '#011e2b',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    border: '#333',
    accent: '#00ed64',
    textMain: '#fff',
    textSub: '#bbb'
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.textMain, minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0, boxSizing: 'border-box' }}>
      
      {/* NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: `1px solid ${theme.border}`, backgroundColor: 'rgba(1, 30, 43, 0.9)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.accent, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://code.visualstudio.com/assets/home/extension-mongodb.png" alt="Logo" style={{ height: '28px' }} />
          itchap
        </div>
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          <a href="#about" style={{ color: theme.textMain, textDecoration: 'none', cursor: 'pointer' }}>About</a>
          <a href="#apps" style={{ color: theme.textMain, textDecoration: 'none', cursor: 'pointer' }}>Apps</a>
          <a href="#blog" style={{ color: theme.textSub, textDecoration: 'none', cursor: 'not-allowed' }}>Blog (Soon)</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header style={{ padding: '100px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>Building Tools for <span style={{ color: theme.accent }}>Modern Solutions Architects</span></h1>
        <p style={{ fontSize: '18px', color: theme.textSub, lineHeight: '1.6', marginBottom: '40px' }}>
          Hi, I'm itchap. I specialize in the MERN stack, database architecture, and building tools that make technical sales and engineering teams more productive.
        </p>
        <a href="#apps" style={{ padding: '12px 24px', backgroundColor: theme.accent, color: '#000', textDecoration: 'none', fontWeight: 'bold', borderRadius: '4px', fontSize: '16px' }}>
          View My Apps
        </a>
      </header>

      {/* APPS PORTFOLIO SECTION */}
      <section id="apps" style={{ padding: '60px 20px', backgroundColor: '#021620' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '30px', borderBottom: `2px solid ${theme.accent}`, display: 'inline-block', paddingBottom: '10px' }}>My Applications</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            
            {/* SKILLS MATRIX CARD */}
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginTop: 0, color: theme.accent, fontSize: '20px' }}>SA Skill / Passion Matrix</h3>
              <p style={{ color: theme.textSub, fontSize: '14px', lineHeight: '1.5', flexGrow: 1 }}>
                A drag-and-drop quadrant matrix designed to help Solutions Architects map their skills, identify burnout risks, and find their zone of genius. Features PDF export and AI career analysis.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <span style={{ fontSize: '11px', backgroundColor: '#023430', color: theme.accent, padding: '4px 8px', borderRadius: '4px', border: '1px solid #00684a' }}>React</span>
                <span style={{ fontSize: '11px', backgroundColor: '#023430', color: theme.accent, padding: '4px 8px', borderRadius: '4px', border: '1px solid #00684a' }}>Node.js</span>
                <span style={{ fontSize: '11px', backgroundColor: '#023430', color: theme.accent, padding: '4px 8px', borderRadius: '4px', border: '1px solid #00684a' }}>MongoDB</span>
              </div>
              <a href="/app/skills/" style={{ display: 'block', textAlign: 'center', marginTop: '20px', padding: '10px', backgroundColor: 'transparent', color: theme.textMain, border: `1px solid ${theme.accent}`, borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', transition: 'all 0.3s' }}>
                Launch App &rarr;
              </a>
            </div>

            {/* PLACEHOLDER CARD FOR FUTURE APP */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: `1px dashed ${theme.border}`, borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
              <span style={{ fontSize: '32px', marginBottom: '10px' }}>🚀</span>
              <h3 style={{ margin: 0, color: theme.textSub }}>More coming soon...</h3>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '40px 20px', color: theme.textSub, fontSize: '12px', borderTop: `1px solid ${theme.border}` }}>
        &copy; {new Date().getFullYear()} itchap. Built with MongoDB, Express, React, and Node.js.
      </footer>
    </div>
  );
}

export default App;