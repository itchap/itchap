import React, { useState } from 'react';

// GLOBAL RESET - Kills the phantom white lines on the edges
const GlobalReset = () => (
  <style>{`
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #011e2b !important;
      width: 100% !important;
      height: 100% !important;
      overflow-x: hidden !important;
      border: none !important;
      outline: none !important;
    }
    #root {
      width: 100%;
      height: 100%;
      border: none !important;
    }
  `}</style>
);

function App() {
  const [activeNode, setActiveNode] = useState(null);

  const theme = {
    bg: '#011e2b',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    border: '#333',
    accent: '#00ed64',
    textMain: '#fff',
    textSub: '#bbb'
  };

  const cycleData = [
    { id: 1, title: 'Learn', top: '12%', left: '50%', desc: 'Consume knowledge and skills from various sources.', deep: 'Master the foundation through diverse media.', action: 'Build your foundational knowledge base.' },
    { id: 2, title: 'Test', top: '50%', left: '88%', desc: 'Experiment, get feedback, tweak and retest.', deep: 'Theory meets reality. Build POCs and run mock calls.', action: 'Apply theory to real-world scenarios.' },
    { id: 3, title: 'Reflect', top: '88%', left: '50%', desc: 'Assess what worked, what didn\'t, and WHY.', deep: 'Deep mastery happens here. Analyze the mechanics.', action: 'Understand the underlying mechanics.' },
    { id: 4, title: 'Teach', top: '50%', left: '12%', desc: 'Reinforce understanding by teaching others.', deep: 'Structuring knowledge solidifies your own expertise.', action: 'Build your profile as a Thought Leader.' }
  ];

  return (
    <div style={{ 
      backgroundColor: theme.bg, 
      minHeight: '100vh', 
      width: '100vw', 
      display: 'flex', 
      flexDirection: 'column',
      border: 'none',
      outline: 'none',
      paddingBottom: '40px', 
      color: theme.textMain, 
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <GlobalReset />

      {/* NAV BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', fontSize: '12px', opacity: 0.7 }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>← Home</a>
        <a href="https://github.com/itchap/itchap" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>View Source on GitHub ↗</a>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '60px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: '800' }}>
            📚 Cycle of <span style={{ color: theme.accent }}>Learning</span>
          </h1>
          <p style={{ color: theme.textSub, fontSize: '1.1rem' }}>
            The roadmap for transforming from a practitioner into a Thought Leader.
          </p>
        </div>

        {/* MAIN CONTAINER */}
        <div style={{ 
          backgroundColor: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: '32px', 
          width: '100%',
          maxWidth: '1200px',
          height: '65vh', 
          minHeight: '600px',
          position: 'relative', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.6)',
          marginBottom: '50px'
        }}>
          
          <div style={{ position: 'relative', width: 'min(95%, 750px)', height: 'min(95%, 750px)' }}>
            
            {/* BRANDED CIRCLE PATH */}
            <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <circle
                cx="50" cy="50" r="38"
                fill="none"
                stroke={theme.accent}
                strokeWidth="2.5" 
                strokeDasharray="5 4"
                opacity="1" /* Increased visibility to match latest style */
              />
            </svg>

            {/* NODES WITH DYNAMIC GLOW */}
            {cycleData.map((node) => (
              <div
                key={node.id}
                onClick={() => setActiveNode(node)}
                style={{
                  position: 'absolute',
                  top: node.top,
                  left: node.left,
                  transform: 'translate(-50%, -50%)',
                  width: '230px',
                  backgroundColor: '#021a25',
                  border: `1px solid ${theme.border}`,
                  borderTop: `4px solid ${theme.accent}`,
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  zIndex: 10,
                  transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)' // Default subtle shadow
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.transform = 'translate(-50%, -55%) scale(1.02)';
                  // GREEN NEON GLOW ADDED HERE
                  e.currentTarget.style.boxShadow = `0 20px 50px rgba(0, 237, 100, 0.2)`; 
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', color: theme.accent, fontSize: '1.3rem', fontWeight: '800' }}>{node.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: theme.textSub, lineHeight: '1.5' }}>{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {activeNode && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(1, 30, 43, 0.96)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: theme.bg, border: `2px solid ${theme.accent}`, padding: '40px', borderRadius: '20px', maxWidth: '600px', width: '90%', boxShadow: `0 0 80px rgba(0, 237, 100, 0.15)` }}>
             <h3 style={{ color: theme.accent, marginTop: 0, fontSize: '2.4rem' }}>{activeNode.title}</h3>
             <p style={{ margin: '25px 0', lineHeight: '1.8', fontSize: '1.15rem', color: '#eee' }}>{activeNode.deep}</p>
             <button onClick={() => setActiveNode(null)} style={{ width: '100%', padding: '16px', backgroundColor: theme.accent, color: '#000', fontWeight: '900', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '18px' }}>Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;