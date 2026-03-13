import React, { useState } from 'react';

function App() {
  const [activeNode, setActiveNode] = useState(null);

  const theme = {
    bg: '#011e2b',
    cardBg: 'rgba(255, 255, 255, 0.03)',
    border: '#333',
    accent: '#01ed64', 
    textMain: '#ffffff', // Explicit high-contrast white
    textSub: '#bbb',
    headerFont: "'Inter', sans-serif"
  };

  const cycleData = [
    { id: 1, title: 'Learn', top: '10%', left: '50%', desc: 'Consume knowledge and skills from various sources.', deep: 'Master the foundation through diverse media. Take meticulous notes to build your "second brain."', action: 'Build your foundational knowledge base.' },
    { id: 2, title: 'Test', top: '50%', left: '90%', desc: 'Experiment, get feedback, tweak and retest.', deep: 'Theory meets reality. Build POCs, run mock calls, and embrace the feedback loop.', action: 'Apply theory to real-world scenarios.' },
    { id: 3, title: 'Reflect', top: '90%', left: '50%', desc: 'Assess what worked, what didn\'t, and WHY.', deep: 'Deep mastery happens here. Analyze the mechanics behind every win and loss.', action: 'Understand the underlying mechanics.' },
    { id: 4, title: 'Teach', top: '50%', left: '10%', desc: 'Reinforce understanding by teaching others.', deep: 'Structuring knowledge for others solidifies your own expertise and builds authority.', action: 'Build your profile as a Thought Leader.' }
  ];

  return (
    <div style={{ 
      backgroundColor: theme.bg, 
      minHeight: '100vh', 
      width: '100vw', 
      color: theme.textMain, 
      fontFamily: theme.headerFont,
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      border: 'none',      // Explicitly killing the white border line
      outline: 'none'
    }}>
      
      {/* GLOBAL RESET TO KILL THE WHITE LINE AND GAPS */}
      <style>{`
        * { box-sizing: border-box; }
        body, html { 
          margin: 0; 
          padding: 0; 
          background-color: #011e2b; 
          overflow-x: hidden; 
          border: none !important; 
        }
        @keyframes modalPop { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* NAV BAR - ALIGNED TO THE MAX WIDTH CONTAINER */}
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', padding: '25px 40px', fontSize: '13px', opacity: 0.6 }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>← Home</a>
        <span style={{ letterSpacing: '1.5px', fontWeight: '600' }}>SA EXCELLENCE SERIES</span>
      </div>

      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER - TEXT COLOR FIXED TO WHITE */}
        <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '60px' }}>
          <h1 style={{ margin: '0 0 20px 0', fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1.5px', color: '#fff' }}>
            <span style={{ verticalAlign: 'middle' }}>🧠</span> <span style={{ color: '#fff' }}>Cycle of</span> <span style={{ color: theme.accent }}>Learning</span>
          </h1>
          <p style={{ color: theme.textSub, fontSize: '1.2rem', fontWeight: '400', maxWidth: '700px', margin: '0 auto', opacity: 0.8, lineHeight: '1.6' }}>
            The blueprint for transforming from a practitioner into a Thought Leader.
          </p>
        </div>

        {/* MAIN CANVAS - CENTERED & POLISHED */}
        <div style={{ 
          backgroundColor: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: '24px', 
          flex: 1,
          minHeight: '650px',
          marginBottom: '60px',
          position: 'relative', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.6)'
        }}>
          
          <div style={{ position: 'relative', width: 'min(90%, 750px)', height: 'min(90%, 750px)' }}>
            
            {/* THICKER, BRANDED CIRCULAR ARROW (#01ed64) */}
            <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={theme.accent} />
                </marker>
              </defs>
              <path
                d="M 50, 10 A 40, 40 0 1, 1 49.9, 10"
                fill="none"
                stroke={theme.accent}
                strokeWidth="2" 
                strokeDasharray="4 3"
                markerEnd="url(#arrowhead)"
                opacity="0.3"
              />
            </svg>

            {/* INTERACTIVE NODES */}
            {cycleData.map((node) => (
              <div
                key={node.id}
                onClick={() => setActiveNode(node)}
                style={{
                  position: 'absolute',
                  top: node.top,
                  left: node.left,
                  transform: 'translate(-50%, -50%)',
                  width: '240px',
                  backgroundColor: '#021a25',
                  border: `1px solid ${theme.border}`,
                  borderTop: `4px solid ${theme.accent}`,
                  borderRadius: '12px',
                  padding: '28px 24px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  zIndex: 10,
                  transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.5)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.transform = 'translate(-50%, -55%)';
                  e.currentTarget.style.boxShadow = `0 25px 50px ${theme.accent}15`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.transform = 'translate(-50%, -50%)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.5)';
                }}
              >
                <h3 style={{ margin: '0 0 12px 0', color: theme.accent, fontSize: '1.3rem', fontWeight: '700' }}>{node.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: theme.textSub, lineHeight: '1.6', opacity: 0.9 }}>{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER NAV - MIRRORING TRUST APP */}
      <div style={{ textAlign: 'center', padding: '20px', opacity: 0.5, fontSize: '12px' }}>
         <a href="https://itchap.com" style={{ color: '#fff', textDecoration: 'none' }}>← Back to itchap.com</a>
      </div>

      {/* MODAL - POLISHED AI STYLE */}
      {activeNode && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(1, 30, 43, 0.96)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ 
            backgroundColor: theme.bg, 
            border: `2px solid ${theme.accent}`, 
            padding: '50px 40px', 
            borderRadius: '20px', 
            maxWidth: '650px', 
            width: '100%', 
            animation: 'modalPop 0.3s ease-out',
            boxShadow: `0 0 80px ${theme.accent}15`
          }}>
             <h3 style={{ color: theme.accent, marginTop: 0, fontSize: '2.5rem', borderBottom: `1px solid ${theme.border}`, paddingBottom: '20px', letterSpacing: '-1px' }}>
               {activeNode.title}
             </h3>
             <p style={{ margin: '35px 0', lineHeight: '1.8', fontSize: '1.2rem', color: '#f0f0f0' }}>
               {activeNode.deep}
             </p>
             <div style={{ backgroundColor: 'rgba(1, 237, 100, 0.05)', padding: '25px', borderRadius: '12px', borderLeft: `6px solid ${theme.accent}`, marginBottom: '35px' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: '900', color: theme.accent, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Actionable Goal</p>
                <p style={{ margin: 0, fontSize: '17px', lineHeight: '1.6' }}>{activeNode.action}</p>
             </div>
             <button onClick={() => setActiveNode(null)} style={{ width: '100%', padding: '18px', backgroundColor: theme.accent, color: '#000', fontWeight: '800', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '18px', transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform = 'scale(1.02)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>
               Got it, next stage →
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;1