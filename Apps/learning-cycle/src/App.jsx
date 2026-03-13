import React, { useState } from 'react';

const App = () => {
  const [activeNode, setActiveNode] = useState(null);

  const theme = {
    bg: '#011e2b',
    darker: '#021620',
    accent: '#00ed64',
    textMain: '#fff',
    textSub: '#bbb',
    arrowColor: '#2563eb'
  };

  const cycleData = [
    { id: 1, title: 'Learn', gridPos: '1 / 2', desc: 'Consume knowledge and skills from various sources.', deep: 'Master the foundation through diverse media. Take meticulous notes to build your "second brain."', action: 'Build your foundational knowledge base.' },
    { id: 2, title: 'Test', gridPos: '2 / 3', desc: 'Experiment, get feedback, tweak and retest.', deep: 'Theory meets reality. Build POCs, run mock calls, and embrace the feedback loop.', action: 'Apply theory to real-world scenarios.' },
    { id: 3, title: 'Reflect', gridPos: '3 / 2', desc: 'Assess what worked, what didn\'t, and WHY.', deep: 'Deep mastery happens here. Analyze the mechanics behind every win and loss.', action: 'Understand the underlying mechanics.' },
    { id: 4, title: 'Teach', gridPos: '2 / 1', desc: 'Reinforce understanding by teaching others.', deep: 'Structuring knowledge for others solidifies your own expertise and builds authority.', action: 'Build your profile as a Thought Leader.' }
  ];

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.textMain, minHeight: '100vh', width: '100vw', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 0, padding: 0 }}>
      
      <header style={{ textAlign: 'center', marginTop: '40px', zIndex: 10 }}>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>The Cycle of <span style={{ color: theme.accent }}>Learning</span></h1>
        <p style={{ color: theme.textSub }}>Interactive blueprint for SA Excellence.</p>
      </header>

      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '300px 300px 300px', gridTemplateRows: '200px 200px 200px', gap: '20px', marginTop: '40px', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* CENTER SVG CIRCLE */}
        <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', pointerEvents: 'none' }}>
          <circle cx="250" cy="250" r="220" fill="none" stroke={theme.arrowColor} strokeWidth="2" strokeDasharray="10 5" opacity="0.4" />
          <path d="M 250,30 A 220,220 0 0,1 470,250" fill="none" stroke={theme.arrowColor} strokeWidth="4" strokeLinecap="round" />
          <polygon points="470,250 460,240 480,240" fill={theme.arrowColor} transform="rotate(90, 470, 250)" />
        </svg>

        {cycleData.map((node) => (
          <div
            key={node.id}
            onClick={() => setActiveNode(node)}
            style={{
              gridArea: node.gridPos,
              backgroundColor: theme.darker,
              border: `1px solid #333`,
              borderTop: `4px solid ${theme.accent}`,
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              zIndex: 5,
              transition: 'transform 0.2s',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h3 style={{ color: theme.accent, margin: '0 0 10px 0' }}>{node.title}</h3>
            <p style={{ fontSize: '14px', color: theme.textSub, margin: 0 }}>{node.desc}</p>
          </div>
        ))}
      </div>

      {activeNode && (
        <div onClick={() => setActiveNode(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(1,30,43,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: theme.darker, border: `2px solid ${theme.accent}`, borderRadius: '12px', padding: '40px', maxWidth: '600px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', color: theme.accent }}>{activeNode.title}</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>{activeNode.deep}</p>
            <p style={{ color: theme.accent, fontWeight: 'bold', marginTop: '20px' }}>{activeNode.action}</p>
            <button onClick={() => setActiveNode(null)} style={{ marginTop: '30px', background: 'none', border: `1px solid ${theme.accent}`, color: theme.accent, padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}

      <footer style={{ marginTop: 'auto', padding: '40px' }}>
        <a href="/" style={{ color: theme.accent, textDecoration: 'none', fontWeight: 'bold' }}>← Back to itchap.com</a>
      </footer>
    </div>
  );
};

export default App;