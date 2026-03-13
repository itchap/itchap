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

  // 1. UPDATED DATA SOURCE WITH STRUCTURED INSIGHTS
const cycleData = [
  { 
    id: 1, 
    title: 'Learn', 
    top: '12%', 
    left: '50%', 
    desc: 'Consume knowledge and skills from various sources.',
    guidance: {
      theory: "Everyone consumes information and learnings differently. Whether it's books, videos, blogs, podcasts or hands-on practical work, you should learn the content in a way that works best for you to gain the knowledge. ",
      action: "As you absorb the information, type or write notes, share your findings in realtime with people around you, or say it out loud to yourself as any of these methods will help you retain the information.",
      outcome: "At this point you should have a good understanding of the subject matter and be able to explain it to a non-technical stakeholder in under 2 minutes."
    }
  },
  { 
    id: 2, 
    title: 'Test', 
    top: '50%', 
    left: '88%', 
    desc: 'Experiment, get feedback, tweak and retest.',
    guidance: {
      theory: "Once you've learned the subject matter or skills, it's time to put your knowledege to the test. Testing is about putting the learning into practice, de-risking any assumptions and seeing how well you understood the topic or skill.",
      action: "Use what you've learned in a real scenario and see how well you can recall it and apply it. Detect any gaps in your knowledge and go back to the 'Learn' stage to fill those gaps. The idea is to test and restest until you can confidently apply the knowledge or skill.",
      outcome: "At this point you are really well informed on the skill or subject matter and can apply it in real life scenarios with confidence. You should be able to troubleshoot and solve problems related to the topic without needing to refer back to your notes or resources."
    }
  },
  { 
    id: 3, 
    title: 'Reflect', 
    top: '88%', 
    left: '50%', 
    desc: 'Assess what worked, what didn\'t, and more importantly WHY.',
    guidance: {
      theory: "Experience without reflection is just wasted time. Reflection converts data into wisdom. It allows you to identify patterns, understand your own thinking and decision-making processes, and make informed adjustments for future iterations.",
      action: "After every scenario where you use the knowledge or skill, ask yourself 'What worked and why did it work?' or 'What didn't work and why didn't it work?'. Document your reflections in a journal and review it on a regular basis to identify patterns and insights.",
      outcome: "At this point you have a deep understanding of the subject matter or skill, not just in theory but in practice. You can identify your own strengths and weaknesses, understand the nuances of the topic, and make informed decisions on how to apply it in different scenarios."
    }
  },
  { 
    id: 4, 
    title: 'Teach', 
    top: '50%', 
    left: '12%', 
    desc: 'Reinforce understanding by teaching others.',
    guidance: {
      theory: "Now you are ready to teach others and share your subject matter expertise. Teaching is the highest form of learning as it reinforces what you learned. It forces you to simplify and exposes your own hidden knowledge gaps.",
      action: "Whether you demo to a customer, present internally to colleagues or give a public talk, the more you can do this in an unscripted way the better as it will force you to really understand the topic and be able to field any questions that come your way.",
      outcome: "Number of 'Aha!' moments triggered in others or the ability to field unscripted Q&A with authority will the point you can consider yourself a thought leader on any given subject matter or skill set."
    }
  }
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
                cx="50" cy="50" r="40"
                fill="none"
                stroke={theme.accent}
                strokeWidth="1.5" 
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
      {/* NAV BAR // 2. UPDATED MODAL UI (Inside the activeNode && (...) block) */}
      {activeNode && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(1, 30, 43, 0.98)', backdropFilter: 'blur(15px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ 
            backgroundColor: '#021a25', 
            border: `2px solid ${theme.accent}`, 
            padding: '40px', 
            borderRadius: '24px', 
            maxWidth: '750px', 
            width: '90%', 
            boxShadow: `0 0 100px rgba(0, 237, 100, 0.12)` 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ color: theme.accent, margin: 0, fontSize: '2.5rem', fontWeight: '800' }}>{activeNode.title}</h3>
                <span style={{ color: theme.accent, opacity: 0.5, fontWeight: 'bold' }}>STAGE 0{activeNode.id}</span>
            </div>

            <div style={{ display: 'grid', gap: '25px', textAlign: 'left' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>The Theory</h4>
                  <p style={{ color: theme.textSub, margin: 0, lineHeight: '1.6' }}>{activeNode.guidance.theory}</p>
                </div>
                
                <div>
                  <h4 style={{ color: theme.accent, margin: '0 0 8px 0', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Action Items</h4>
                  <p style={{ color: '#fff', margin: 0, lineHeight: '1.6' }}>{activeNode.guidance.action}</p>
                </div>

                <div style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: `4px solid ${theme.accent}` }}>
                  <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: 'bold' }}>Stage Outcome</h4>
                  <p style={{ color: theme.accent, margin: 0, fontSize: '1rem', fontStyle: 'italic' }}>{activeNode.guidance.outcome}</p>
                </div>
            </div>

            <button 
              onClick={() => setActiveNode(null)} 
              style={{ 
                marginTop: '40px', 
                width: '100%', 
                padding: '18px', 
                backgroundColor: theme.accent, 
                color: '#000', 
                fontWeight: '900', 
                border: 'none', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                fontSize: '16px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Return to Cycle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;