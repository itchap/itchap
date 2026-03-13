import React, { useState } from 'react';

function App() {
  const [activeNode, setActiveNode] = useState(null);

  const theme = {
    bg: '#011e2b',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    border: '#333',
    accent: '#01ed64', // Updated to requested brand color
    textMain: '#fff',
    textSub: '#bbb',
    arrowColor: '#01ed64' 
  };

  const cycleData = [
    { id: 1, title: 'Learn', top: '12%', left: '50%', desc: 'Consume knowledge and skills from various sources.', deep: 'Master the foundation through diverse media. Take meticulous notes to build your "second brain."', action: 'Build your foundational knowledge base.' },
    { id: 2, title: 'Test', top: '50%', left: '88%', desc: 'Experiment, get feedback, tweak and retest.', deep: 'Theory meets reality. Build POCs, run mock calls, and embrace the feedback loop.', action: 'Apply theory to real-world scenarios.' },
    { id: 3, title: 'Reflect', top: '88%', left: '50%', desc: 'Assess what worked, what didn\'t, and WHY.', deep: 'Deep mastery happens here. Analyze the mechanics behind every win and loss.', action: 'Understand the underlying mechanics.' },
    { id: 4, title: 'Teach', top: '50%', left: '12%', desc: 'Reinforce understanding by teaching others.', deep: 'Structuring knowledge for others solidifies your own expertise and builds authority.', action: 'Build your profile as a Thought Leader.' }
  ];

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', width: '100%', color: theme.textMain, fontFamily: 'Inter, sans-serif' }}>
      
      {/* GLOBAL OVERRIDE FOR FULL SCREEN BACKGROUND */}
      <style>{`
        body, html { margin: 0; padding: 0; background-color: ${theme.bg}; width: 100%; height: 100%; overflow-x: hidden; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* TOP NAV (Matching Trust App) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', fontSize: '13px', opacity: 0.7 }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>← Home</a>
        <span style={{ color: theme.textSub, letterSpacing: '1px' }}>SA EXCELLENCE SERIES</span>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
        
        {/* HEADER - Increased spacing and adjusted font sizes */}
        <div style={{ textAlign: 'center', marginTop: '60px', marginBottom: '80px' }}>
          <h1 style={{ margin: '0 0 20px 0', fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1px' }}>
            <span style={{ verticalAlign: 'middle' }}>🧠</span> Cycle of <span style={{ color: theme.accent }}>Learning</span>
          </h1>
          <p style={{ color: theme.textSub, fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            The blueprint for transforming from a practitioner into a Thought Leader.
          </p>
        </div>

        {/* MAIN CANVAS */}
        <div style={{ 
          backgroundColor: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: '24px', 
          height: '75vh', 
          minHeight: '600px',
          position: 'relative', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}>
          
          <div style={{ position: 'relative', width: 'min(90%, 700px)', height: 'min(90%, 700px)' }}>
            
            {/* CLEANER CIRCULAR ARROW - No overlap, uses #01ed64 */}
            <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M 0 0 L 6 3 L 0 6 z" fill={theme.accent} />
                </marker>
              </defs>
              <path
                d="M 50, 15 A 35, 35 0 1, 1 49.9, 15"
                fill="none"
                stroke={theme.accent}
                strokeWidth="0.8"
                strokeDasharray="2 1.5"
                markerEnd="url(#arrowhead)"
                opacity="0.5"
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
                  width: '220px',
                  backgroundColor: '#021620',
                  border: `1px solid ${theme.border}`,
                  borderTop: `4px solid ${theme.accent}`,
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  zIndex: 10,
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.transform = 'translate(-50%, -55%) scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 15px 30px ${theme.accent}22`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', color: theme.accent, fontSize: '18px', fontWeight: '700' }}>{node.title}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: theme.textSub, lineHeight: '1.5' }}>{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL (Matching Trust App AI Style) */}
      {activeNode && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(1, 30, 43, 0.9)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ 
            backgroundColor: theme.bg, 
            border: `2px solid ${theme.accent}`, 
            padding: '40px', 
            borderRadius: '16px', 
            maxWidth: '650px', 
            width: '100%', 
            animation: 'fadeIn 0.3s ease-out',
            boxShadow: `0 0 50px ${theme.accent}11`
          }}>
             <h3 style={{ color: theme.accent, marginTop: 0, fontSize: '2rem', borderBottom: `1px solid ${theme.border}`, paddingBottom: '15px' }}>
               {activeNode.title} Deep Dive
             </h3>
             <p style={{ margin: '25px 0', lineHeight: '1.8', fontSize: '1.1rem', color: '#e0e0e0' }}>
               {activeNode.deep}
             </p>
             <div style={{ backgroundColor: 'rgba(1, 237, 100, 0.08)', padding: '20px', borderRadius: '8px', borderLeft: `5px solid ${theme.accent}`, marginBottom: '30px' }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: theme.accent, textTransform: 'uppercase', fontSize: '12px' }}>Actionable Goal:</p>
                <p style={{ margin: 0, fontSize: '15px' }}>{activeNode.action}</p>
             </div>
             <button onClick={() => setActiveNode(null)} style={{ width: '100%', padding: '14px', backgroundColor: theme.accent, color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', transition: 'opacity 0.2s' }} onMouseOver={e => e.target.style.opacity = '0.9'} onMouseOut={e => e.target.style.opacity = '1'}>
               Got it, next stage →
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;