import React, { useState } from 'react';

// STYLES - Forced Global Overrides
const GlobalStyles = () => (
  <style>{`
    * { box-sizing: border-box; }
    html, body { 
      margin: 0 !important; 
      padding: 0 !important; 
      background-color: #011e2b !important; 
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      border: none !important;
    }
    #root { height: 100%; width: 100%; }
  `}</style>
);

function App() {
  const [activeNode, setActiveNode] = useState(null);

  const theme = {
    bg: '#011e2b',
    cardBg: 'rgba(255, 255, 255, 0.03)',
    border: '#333',
    accent: '#01ed64', 
    textWhite: '#ffffff',
    textSub: '#bbb'
  };

  const cycleData = [
    { id: 1, title: 'Learn', top: '10%', left: '50%', desc: 'Consume knowledge and skills from various sources.', deep: 'Master the foundation through diverse media.', action: 'Build your foundational knowledge base.' },
    { id: 2, title: 'Test', top: '50%', left: '90%', desc: 'Experiment, get feedback, tweak and retest.', deep: 'Theory meets reality. Build POCs and run mock calls.', action: 'Apply theory to real-world scenarios.' },
    { id: 3, title: 'Reflect', top: '90%', left: '50%', desc: 'Assess what worked, what didn\'t, and WHY.', deep: 'Deep mastery happens here. Analyze the mechanics.', action: 'Understand the underlying mechanics.' },
    { id: 4, title: 'Teach', top: '50%', left: '10%', desc: 'Reinforce understanding by teaching others.', deep: 'Structuring knowledge solidifies your own expertise.', action: 'Build your profile as a Thought Leader.' }
  ];

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', width: '100%', color: theme.textWhite, fontFamily: 'Inter, sans-serif' }}>
      <GlobalStyles />
      
      {/* TOP NAV - MATCHING TRUST APP */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 40px', fontSize: '13px', opacity: 0.6 }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>← Home</a>
        <span style={{ letterSpacing: '1.5px', fontWeight: '600' }}>SA EXCELLENCE SERIES</span>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
        
        {/* HEADER - FIXED "CYCLE OF" COLOR & ALIGNMENT */}
        <div style={{ textAlign: 'center', marginTop: '60px', marginBottom: '80px' }}>
          <h1 style={{ margin: '0 0 24px 0', fontSize: '3.8rem', fontWeight: '800', letterSpacing: '-2px' }}>
            🧠 <span style={{ color: '#fff' }}>Cycle of</span> <span style={{ color: theme.accent }}>Learning</span>
          </h1>
          <p style={{ color: theme.textSub, fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
            The blueprint for transforming from a practitioner into a Thought Leader.
          </p>
        </div>

        {/* MAIN BOX */}
        <div style={{ 
          backgroundColor: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: '32px', 
          height: '70vh', 
          minHeight: '650px',
          position: 'relative', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 50px 100px -20px rgba(0,0,0,0.7)'
        }}>
          
          <div style={{ position: 'relative', width: 'min(90%, 800px)', height: 'min(90%, 800px)' }}>
            
            {/* WIDER CIRCULAR PATH (#01ed64) */}
            <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke={theme.accent}
                strokeWidth="3.5" /* MUCH WIDER */
                strokeDasharray="6 4"
                opacity="0.25"
              />
            </svg>

            {/* NODES */}
            {cycleData.map((node) => (
              <div
                key={node.id}
                onClick={() => setActiveNode(node)}
                style={{
                  position: 'absolute',
                  top: node.top,
                  left: node.left,
                  transform: 'translate(-50%, -50%)',
                  width: '250px',
                  backgroundColor: '#021a25',
                  border: `1px solid ${theme.border}`,
                  borderTop: `5px solid ${theme.accent}`,
                  borderRadius: '16px',
                  padding: '30px 20px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  zIndex: 10,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.transform = 'translate(-50%, -55%) scale(1.02)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', color: theme.accent, fontSize: '1.4rem', fontWeight: '800' }}>{node.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: theme.textSub, lineHeight: '1.5' }}>{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL - TRUST APP AI STYLE */}
      {activeNode && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(1, 30, 43, 0.97)', backdropFilter: 'blur(15px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: theme.bg, border: `2px solid ${theme.accent}`, padding: '50px', borderRadius: '24px', maxWidth: '600px', width: '90%', boxShadow: `0 0 100px ${theme.accent}15` }}>
             <h3 style={{ color: theme.accent, marginTop: 0, fontSize: '2.5rem', letterSpacing: '-1px' }}>{activeNode.title}</h3>
             <p style={{ margin: '30px 0', lineHeight: '1.8', fontSize: '1.2rem', color: '#eee' }}>{activeNode.deep}</p>
             <button onClick={() => setActiveNode(null)} style={{ width: '100%', padding: '18px', backgroundColor: theme.accent, color: '#000', fontWeight: '900', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '18px' }}>Close Deep Dive</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;