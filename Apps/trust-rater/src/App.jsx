import React, { useState } from 'react';

function App() {
  const [credibility, setCredibility] = useState(5);
  const [reliability, setReliability] = useState(5);
  const [intimacy, setIntimacy] = useState(5);
  const [selfOrientation, setSelfOrientation] = useState(5);
  const [interactionName, setInteractionName] = useState('');

  const theme = {
    bg: '#011e2b',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    border: '#333',
    accent: '#00ed64',
    textMain: '#fff',
    textSub: '#bbb',
    danger: '#ff4d4d'
  };

  // The Trust Equation: T = (C + R + I) / S
  const trustScore = ((credibility + reliability + intimacy) / selfOrientation).toFixed(1);

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* SUBTLE NAVIGATION BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', fontSize: '13px', opacity: 0.8 }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = theme.accent} onMouseOut={e => e.target.style.color = '#fff'}>
          ← Home
        </a>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>
          🤝 SA <span style={{ color: theme.accent }}>Trust Rater</span>
        </h1>
        <p style={{ textAlign: 'center', color: theme.textSub, marginBottom: '40px' }}>
          Based on Charles Green's <i>The Trusted Advisor</i>. Use this to evaluate your customer interactions or AE partnerships.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* LEFT COLUMN: THE INPUTS */}
          <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '20px' }}>
            <input 
              type="text" 
              placeholder="Interaction (e.g., Acme Corp Discovery)" 
              value={interactionName}
              onChange={(e) => setInteractionName(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '25px', borderRadius: '4px', border: 'none', backgroundColor: 'rgba(0,0,0,0.2)', color: '#fff', boxSizing: 'border-box' }}
            />

            <Slider label="Credibility (C)" subtext="They know their stuff." value={credibility} setValue={setCredibility} theme={theme} />
            <Slider label="Reliability (R)" subtext="They always deliver." value={reliability} setValue={setReliability} theme={theme} />
            <Slider label="Intimacy (I)" subtext="I feel safe with them." value={intimacy} setValue={setIntimacy} theme={theme} />
            
            <hr style={{ borderColor: theme.border, margin: '20px 0' }} />
            
            <Slider label="Self-Orientation (S)" subtext="Are they focused on my interests or theirs?" value={selfOrientation} setValue={setSelfOrientation} theme={theme} reverseColor />
          </div>

          {/* RIGHT COLUMN: THE SCORE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '40px 20px', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 style={{ margin: '0 0 10px 0', color: theme.textSub }}>Trust Score</h2>
              <div style={{ fontSize: '72px', fontWeight: 'bold', color: selfOrientation > 7 ? theme.danger : theme.accent, lineHeight: '1' }}>
                {trustScore}
              </div>
              <p style={{ color: theme.textSub, fontSize: '14px', marginTop: '15px' }}>
                Max Score: 30.0 | Min Score: 0.3
              </p>
              
              <div style={{ marginTop: '30px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '14px', textAlign: 'left', color: theme.textSub }}>
                <strong style={{ color: '#fff' }}>The Golden Rule:</strong> 
                <br/>High Credibility, Reliability, and Intimacy build trust. But a high Self-Orientation (focusing on your quota instead of their problem) divides and destroys it instantly.
              </div>
            </div>

            <button style={{ width: '100%', padding: '15px', backgroundColor: theme.accent, color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              Save Assessment (Coming Soon)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Reusable Slider Component
function Slider({ label, subtext, value, setValue, theme, reverseColor }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <strong style={{ color: theme.textMain }}>{label}</strong>
        <span style={{ fontWeight: 'bold', color: reverseColor && value > 6 ? theme.danger : theme.accent }}>{value}/10</span>
      </div>
      <div style={{ fontSize: '12px', color: theme.textSub, marginBottom: '10px' }}>{subtext}</div>
      <input 
        type="range" 
        min="1" 
        max="10" 
        value={value} 
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ width: '100%', cursor: 'pointer' }}
      />
    </div>
  );
}

export default App;