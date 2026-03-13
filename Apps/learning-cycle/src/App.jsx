import React, { useState } from 'react';

const App = () => {
  const [activeNode, setActiveNode] = useState(null);

  const theme = {
    bg: '#011e2b',
    darker: '#021620',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    border: '#333',
    accent: '#00ed64',
    textMain: '#fff',
    textSub: '#bbb',
    arrowColor: '#2563eb' // Matching the blue in your reference diagram
  };

  const cycleData = [
    {
      id: 1,
      title: 'Learn',
      pos: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' },
      shortDesc: 'Consume knowledge and skills from various sources.',
      deepDive: "Find the medium that works best for you: books, docs, videos, podcasts, or practical hands-on labs. Take meticulous notes to lay a strong foundation.",
      action: "Identify your preferred learning style and immerse yourself."
    },
    {
      id: 2,
      title: 'Test',
      pos: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' },
      shortDesc: 'Experiment, get feedback, tweak and retest.',
      deepDive: "Apply theory to reality. Build POCs, run mock calls, and solicit brutal feedback. Tweak your approach based on what breaks and test it again.",
      action: "Build a POC or run a simulation to see theory meet reality."
    },
    {
      id: 3,
      title: 'Reflect',
      pos: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' },
      shortDesc: 'Assess what worked, what didn\'t, and WHY.',
      deepDive: "True mastery is born here. Don't just look at results; understand the mechanics. Why did the customer push back? Why did the architecture scale?",
      action: "Understand the 'Why' before moving to the next stage."
    },
    {
      id: 4,
      title: 'Teach',
      pos: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' },
      shortDesc: 'Reinforce understanding by teaching others.',
      deepDive: "The process of preparing to teach forces you to structure your thoughts. Giving talks or writing docs is what makes you a Thought Leader.",
      action: "Share your findings via a blog, lunch-and-learn, or talk."
    }
  ];

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.textMain, minHeight: '100vh', width: '100vw', fontFamily: 'sans-serif', margin: 0, padding: 0, overflowX: 'hidden' }}>
      
      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', padding: '60px 20px 20px 20px' }}>
        <h1 style={{ fontSize: '42px', margin: '0 0 10px 0' }}>The Cycle of <span style={{ color: theme.accent }}>Learning</span></h1>
        <p style={{ color: theme.textSub, maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          An interactive blueprint for SA Excellence. Navigate the stages to understand what it takes to become a true Thought Leader.
        </p>
      </div>

      {/* CIRCULAR DIAGRAM AREA */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', position: 'relative' }}>
        
        <div style={{ position: 'relative', width: 'min(80vw, 600px)', height: 'min(80vw, 600px)' }}>
          
          {/* THE SVG CIRCLE ARROW */}
          <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <path
              d="M 50, 10 A 40, 40 0 1, 1 49.9, 10"
              fill="none"
              stroke={theme.arrowColor}
              strokeWidth="4"
              strokeLinecap="round"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={theme.arrowColor} />
              </marker>
            </defs>
          </svg>

          {/* THE QUADRANT CARDS */}
          {cycleData.map((node) => (
            <div
              key={node.id}
              onClick={() => setActiveNode(node)}
              style={{
                position: 'absolute',
                ...node.pos,
                width: '240px',
                backgroundColor: theme.darker,
                border: `1px solid ${theme.border}`,
                borderTop: `4px solid ${theme.accent}`,
                borderRadius: '8px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                zIndex: 10,
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = `${node.pos.transform} scale(1.05)`;
                e.currentTarget.style.borderColor = theme.accent;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = node.pos.transform;
                e.currentTarget.style.borderColor = theme.border;
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: theme.accent, fontSize: '18px' }}>{node.title}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: theme.textSub, lineHeight: '1.4' }}>
                {node.shortDesc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FULL SCREEN EXPLOSION MODAL */}
      {activeNode && (
        <div 
          onClick={() => setActiveNode(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(1, 30, 43, 0.95)',
            backdropFilter: 'blur(10px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, padding: '20px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: theme.darker,
              border: `2px solid ${theme.accent}`,
              borderRadius: '12px',
              padding: '60px',
              maxWidth: '800px',
              width: '100%',
              textAlign: 'center',
              boxShadow: `0 0 50px ${theme.accent}33`
            }}
          >
            <h2 style={{ fontSize: '48px', color: theme.accent, marginBottom: '20px' }}>{activeNode.title}</h2>
            <p style={{ fontSize: '20px', lineHeight: '1.8', color: theme.textMain, marginBottom: '40px' }}>
              {activeNode.deepDive}
            </p>
            <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '30px' }}>
              <p style={{ color: theme.accent, fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}>Pro-Tip / Objective</p>
              <p style={{ fontSize: '18px', color: theme.textSub }}>{activeNode.action}</p>
            </div>
            <button 
              onClick={() => setActiveNode(null)}
              style={{ marginTop: '40px', padding: '12px 30px', backgroundColor: 'transparent', color: theme.accent, border: `1px solid ${theme.accent}`, borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Close Insight
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '40px', color: theme.textSub, fontSize: '13px', borderTop: `1px solid ${theme.border}` }}>
        <a href="/" style={{ color: theme.accent, textDecoration: 'none', fontWeight: 'bold' }}>&larr; Back to itchap.com</a>
      </footer>
    </div>
  );
};

export default App;