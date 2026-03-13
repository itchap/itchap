import React, { useState } from 'react';

function App() {
  const [activeNode, setActiveNode] = useState(null);

  const theme = {
    bg: '#011e2b',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    border: '#333',
    accent: '#00ed64',
    textMain: '#fff',
    textSub: '#bbb',
    arrowColor: '#2563eb'
  };

  const cycleData = [
    { id: 1, title: 'Learn', top: '10%', left: '50%', desc: 'Consume knowledge and skills from various sources.', deep: 'Master the foundation through diverse media. Take meticulous notes to build your "second brain."', action: 'Build your foundational knowledge base.' },
    { id: 2, title: 'Test', top: '50%', left: '85%', desc: 'Experiment, get feedback, tweak and retest.', deep: 'Theory meets reality. Build POCs, run mock calls, and embrace the feedback loop.', action: 'Apply theory to real-world scenarios.' },
    { id: 3, title: 'Reflect', top: '90%', left: '50%', desc: 'Assess what worked, what didn\'t, and WHY.', deep: 'Deep mastery happens here. Analyze the mechanics behind every win and loss.', action: 'Understand the underlying mechanics.' },
    { id: 4, title: 'Teach', top: '50%', left: '15%', desc: 'Reinforce understanding by teaching others.', deep: 'Structuring knowledge for others solidifies your own expertise and builds authority.', action: 'Build your profile as a Thought Leader.' }
  ];

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', paddingBottom: '40px', color: theme.textMain, fontFamily: 'sans-serif' }}>
      
      {/* SUBTLE NAVIGATION BAR (Matching Trust App) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', fontSize: '13px', opacity: 0.8 }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = theme.accent} onMouseOut={e => e.target.style.color = '#fff'}>
          ← Home
        </a>
        <span style={{ color: theme.textSub }}>SA Excellence Series</span>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* HEADER SECTION (Matching Trust App) */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>🧠 Cycle of <span style={{ color: theme.accent }}>Learning</span></h1>
          <p style={{ color: theme.textSub, marginBottom: '20px' }}>The blueprint for transforming from a practitioner into a Thought Leader.</p>
        </div>

        {/* MAIN CANVAS BOX (Replacing the 3-column grid with a centered hero) */}
        <div style={{ 
          backgroundColor: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: '12px', 
          height: '70vh', 
          position: 'relative', 
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          
          {/* THE CIRCLE LAYER */}
          <div style={{ position: 'relative', width: 'min(90%, 600px)', height: 'min(90%, 600px)' }}>
            
            {/* SVG ARROW */}
            <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)', pointerEvents: 'none' }}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={theme.arrowColor} />
                </marker>
              </defs>
              <path
                d="M 50, 10 A 40, 40 0 1, 1 49.9, 10"
                fill="none"
                stroke={theme.arrowColor}
                strokeWidth="2"
                strokeDasharray="4 2"
                markerEnd="url(#arrowhead)"
                opacity="0.6"
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
                  width: '200px',
                  backgroundColor: '#021620',
                  border: `1px solid ${theme.border}`,
                  borderTop: `4px solid ${theme.accent}`,
                  borderRadius: '8px',
                  padding: '15px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  zIndex: 10,
                  transition: 'all 0.3s'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = theme.accent;
                  e.currentTarget.style.boxShadow = `0 0 15px ${theme.accent}33`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = theme.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{ margin: '0 0 8px 0', color: theme.accent, fontSize: '16px' }}>{node.title}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: theme.textSub, lineHeight: '1.4' }}>{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INSIGHTS MODAL (Matching Trust App AI Modal Style) */}
      {activeNode && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: theme.bg, border: `2px solid ${theme.accent}`, padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '100%', color: '#e0e0e0', boxShadow: '0 10px 30px rgba(0, 237, 100, 0.2)' }}>
             <h3 style={{ color: theme.accent, marginTop: 0, borderBottom: `1px solid ${theme.border}`, paddingBottom: '10px' }}>
               Stage {activeNode.id}: {activeNode.title}
             </h3>
             <div style={{ margin: '20px 0', lineHeight: '1.6', fontSize: '16px' }}>
               {activeNode.deep}
             </div>
             <div style={{ backgroundColor: 'rgba(0, 237, 100, 0.05)', padding: '15px', borderRadius: '4px', borderLeft: `4px solid ${theme.accent}`, marginBottom: '20px' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: theme.accent }}>Objective:</p>
                <p style={{ margin: 0, fontSize: '14px' }}>{activeNode.action}</p>
             </div>
             <button onClick={() => setActiveNode(null)} style={{ width: '100%', padding: '10px', backgroundColor: theme.accent, color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
               Close Stage
             </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;