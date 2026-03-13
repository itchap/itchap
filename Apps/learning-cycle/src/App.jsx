import React, { useState } from 'react';

const App = () => {
  const [activeNode, setActiveNode] = useState(null);

  const theme = {
    bg: '#011e2b',
    darker: '#021620',
    cardBg: 'rgba(255, 255, 255, 0.03)',
    border: '#333',
    accent: '#00ed64',
    textMain: '#fff',
    textSub: '#bbb',
    arrowColor: '#2563eb' 
  };

  const cycleData = [
    { id: 1, title: 'Learn', pos: { top: '10%', left: '50%' }, desc: 'Consume knowledge and skills from various sources.', deep: 'Master the foundation through diverse media. Take meticulous notes to build your "second brain."', action: 'Build your foundational knowledge base.' },
    { id: 2, title: 'Test', pos: { top: '50%', left: '85%' }, desc: 'Experiment, get feedback, tweak and retest.', deep: 'Theory meets reality. Build POCs, run mock calls, and embrace the feedback loop.', action: 'Apply theory to real-world scenarios.' },
    { id: 3, title: 'Reflect', pos: { top: '90%', left: '50%' }, desc: 'Assess what worked, what didn\'t, and WHY.', deep: 'Deep mastery happens here. Analyze the mechanics behind every win and loss.', action: 'Understand the underlying mechanics.' },
    { id: 4, title: 'Teach', pos: { top: '50%', left: '15%' }, desc: 'Reinforce understanding by teaching others.', deep: 'Structuring knowledge for others solidifies your own expertise and builds authority.', action: 'Build your profile as a Thought Leader.' }
  ];

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.textMain, minHeight: '100vh', width: '100vw', fontFamily: 'Inter, sans-serif', margin: 0, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. HEADER - Centered and Clean */}
      <header style={{ textAlign: 'center', padding: '40px 20px', zIndex: 5 }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 10px 0' }}>
          The Cycle of <span style={{ color: theme.accent }}>Learning</span>
        </h1>
        <p style={{ color: theme.textSub, fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
          The blueprint for transforming from a practitioner into a Thought Leader. Click a stage to explore.
        </p>
      </header>

      {/* 2. THE MAIN CANVAS */}
      <main style={{ flexGrow: 1, position: 'relative', width: '100%', height: '100%' }}>
        
        {/* SVG LAYER - Using a large viewbox for precision */}
        <svg viewBox="0 0 1000 1000" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vh', height: '80vh', pointerEvents: 'none' }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={theme.arrowColor} />
            </marker>
          </defs>
          <path
            d="M 500, 150 A 350, 350 0 1, 1 499, 150"
            fill="none"
            stroke={theme.arrowColor}
            strokeWidth="8"
            strokeLinecap="round"
            markerEnd="url(#arrowhead)"
            style={{ opacity: 0.6 }}
          />
        </svg>

        {/* NODES LAYER */}
        {cycleData.map((node) => (
          <div
            key={node.id}
            onClick={() => setActiveNode(node)}
            style={{
              position: 'absolute',
              top: node.pos.top,
              left: node.pos.left,
              transform: 'translate(-50%, -50%)',
              width: '280px',
              backgroundColor: theme.darker,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 10,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              textAlign: 'center'
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = theme.accent;
              e.currentTarget.style.transform = 'translate(-50%, -55%) scale(1.05)';
              e.currentTarget.style.boxShadow = `0 0 20px ${theme.accent}33`;
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
            }}
          >
            <div style={{ color: theme.accent, fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Stage 0{node.id}</div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', color: '#fff' }}>{node.title}</h3>
            <p style={{ margin: 0, fontSize: '14px', color: theme.textSub, lineHeight: '1.5' }}>{node.desc}</p>
          </div>
        ))}
      </main>

      {/* 3. EXPLOSION MODAL */}
      {activeNode && (
        <div 
          onClick={() => setActiveNode(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(1, 30, 43, 0.9)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div 
            onClick={e => e.stopPropagation()}
            style={{ backgroundColor: theme.darker, border: `2px solid ${theme.accent}`, borderRadius: '16px', padding: '60px', maxWidth: '700px', width: '90%', textAlign: 'center', animation: 'modalIn 0.4s ease-out' }}>
            <h2 style={{ fontSize: '3rem', color: theme.accent, marginBottom: '20px' }}>{activeNode.title}</h2>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#fff', marginBottom: '40px' }}>{activeNode.deep}</p>
            <div style={{ backgroundColor: 'rgba(0, 237, 100, 0.1)', padding: '20px', borderRadius: '8px', borderLeft: `4px solid ${theme.accent}` }}>
              <p style={{ margin: 0, color: theme.accent, fontWeight: '600' }}>{activeNode.action}</p>
            </div>
            <button onClick={() => setActiveNode(null)} style={{ marginTop: '40px', background: 'none', border: `1px solid ${theme.accent}`, color: theme.accent, padding: '12px 30px', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}>Close Insight</button>
          </div>
        </div>
      )}

      {/* 4. FOOTER NAV */}
      <footer style={{ padding: '30px', textAlign: 'center', zIndex: 5 }}>
        <a href="/" style={{ color: theme.accent, textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
          ← Back to Homepage
        </a>
      </footer>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;