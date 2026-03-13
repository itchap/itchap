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
    hover: 'rgba(0, 237, 100, 0.1)'
  };

  const cycleData = [
    {
      id: 1,
      title: 'Learn',
      icon: '🧠',
      shortDesc: 'Consume knowledge and skills from various sources.',
      deepDive: "Find the medium that works best for your brain. Read books, dive into official documentation, watch technical videos, listen to podcasts, or get hands-on in a lab. Take meticulous notes. The goal here is raw intake and initial comprehension. You are laying the foundation.",
      action: "Identify your preferred learning style and immerse yourself."
    },
    {
      id: 2,
      title: 'Test',
      icon: '🧪',
      shortDesc: 'Test the learnings with experimentation, get feedback, tweak and retest.',
      deepDive: "Knowledge without execution is just trivia. Apply what you've learned in real-world or simulated scenarios. Observe the outcomes closely, solicit brutal feedback from peers or customers, make necessary adjustments, and test again. This is where theory meets reality.",
      action: "Build a POC, run a mock discovery call, or break a system on purpose."
    },
    {
      id: 3,
      title: 'Reflect',
      icon: '🔍',
      shortDesc: 'Assess what worked or didn\'t work and why.',
      deepDive: "This is the most critical and often skipped step. It's not enough to know WHAT happened; you must understand WHY. Why did the architecture scale perfectly? Why did the customer push back on that specific point? True mastery is born in the quiet reflection of your successes and failures.",
      action: "Do not move to the next stage until you understand the 'Why'."
    },
    {
      id: 4,
      title: 'Teach',
      icon: '📢',
      shortDesc: 'Reinforce your understanding by teaching others.',
      deepDive: "You are only ready for this stage after true reflection. The process of structuring your thoughts to educate others—whether through a blog, a lunch-and-learn, or a conference keynote—is the ultimate forcing function for mastery. Teaching is what transforms a skilled practitioner into a recognized Thought Leader.",
      action: "Share your findings. Elevate the rest of the team."
    }
  ];

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', color: theme.textMain, fontFamily: 'sans-serif', padding: '40px 20px' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 60px auto' }}>
        <h1 style={{ fontSize: '42px', margin: '0 0 15px 0' }}>The Cycle of <span style={{ color: theme.accent }}>Learning</span></h1>
        <p style={{ fontSize: '18px', color: theme.textSub, lineHeight: '1.6' }}>
          The blueprint for transforming from a practitioner into a Thought Leader. 
          Click on any stage of the cycle to explore the deep-dive guidance.
        </p>
      </div>

      {/* CYCLE GRID */}
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', position: 'relative' }}>
        {cycleData.map((node, index) => (
          <div 
            key={node.id}
            onClick={() => setActiveNode(node)}
            style={{
              backgroundColor: theme.cardBg,
              border: `1px solid ${theme.border}`,
              borderTop: `4px solid ${theme.accent}`,
              borderRadius: '8px',
              padding: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.backgroundColor = theme.hover;
              e.currentTarget.style.borderColor = theme.accent;
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.backgroundColor = theme.cardBg;
              e.currentTarget.style.borderColor = theme.border;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <div style={{ fontSize: '32px', backgroundColor: 'rgba(0, 237, 100, 0.1)', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                {node.icon}
              </div>
              <h2 style={{ margin: 0, fontSize: '24px', color: theme.accent }}>{index + 1}. {node.title}</h2>
            </div>
            <p style={{ margin: 0, fontSize: '15px', color: theme.textSub, lineHeight: '1.5' }}>
              {node.shortDesc}
            </p>
            <div style={{ marginTop: '20px', fontSize: '13px', fontWeight: 'bold', color: theme.accent, display: 'flex', alignItems: 'center', gap: '5px' }}>
              Click to expand &rarr;
            </div>
          </div>
        ))}
      </div>

      {/* EXPLODED MODAL OVERLAY */}
      {activeNode && (
        <div 
          onClick={() => setActiveNode(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(1, 30, 43, 0.9)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()} // Prevent clicking inside modal from closing it
            style={{
              backgroundColor: '#021620',
              border: `2px solid ${theme.accent}`,
              borderRadius: '12px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              position: 'relative',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveNode(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: theme.textSub, fontSize: '24px', cursor: 'pointer' }}
            >
              &times;
            </button>

            <div style={{ fontSize: '48px', marginBottom: '20px' }}>{activeNode.icon}</div>
            <h2 style={{ fontSize: '32px', margin: '0 0 10px 0', color: '#fff' }}>Stage {activeNode.id}: <span style={{ color: theme.accent }}>{activeNode.title}</span></h2>
            
            <p style={{ fontSize: '18px', color: theme.textSub, lineHeight: '1.6', marginBottom: '30px' }}>
              {activeNode.deepDive}
            </p>

            <div style={{ backgroundColor: 'rgba(0, 237, 100, 0.1)', borderLeft: `4px solid ${theme.accent}`, padding: '15px 20px', borderRadius: '0 8px 8px 0' }}>
              <strong style={{ color: theme.accent, display: 'block', marginBottom: '5px' }}>Objective:</strong>
              <span style={{ color: '#fff' }}>{activeNode.action}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;