import React, { useState } from 'react';

function App() {
  const [sessionId, setSessionId] = useState('');
  const [credibility, setCredibility] = useState(5);
  const [reliability, setReliability] = useState(5);
  const [intimacy, setIntimacy] = useState(5);
  const [selfOrientation, setSelfOrientation] = useState(5);
  const [interactionName, setInteractionName] = useState('');
  const [runningAverage, setRunningAverage] = useState(null);

  const theme = {
    bg: '#011e2b',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    border: '#333',
    accent: '#00ed64',
    textMain: '#fff',
    textSub: '#bbb',
    danger: '#ff4d4d',
    buttonHover: '#00c753'
  };

  // The Trust Equation: T = (C + R + I) / S
  const trustScore = ((credibility + reliability + intimacy) / selfOrientation).toFixed(1);

  // Placeholder Functions for Backend Wiring
  const handleSaveForLater = () => alert("Backend Wiring Needed: Will generate and return a MongoDB Session ID.");
  const handleResume = () => alert(`Backend Wiring Needed: Will fetch data for Session ${sessionId}`);
  const handleResetSession = () => { setSessionId(''); setInteractionName(''); setCredibility(5); setReliability(5); setIntimacy(5); setSelfOrientation(5); };
  const handleSaveAssessment = () => alert(`Backend Wiring Needed: Will save '${interactionName}' as a new document linked to Session ${sessionId}`);
  const handleUpdateAverage = () => alert("Backend Wiring Needed: Will calculate and return the average of all assessments in this session.");
  const handleResetAverage = () => { setRunningAverage(null); alert("Backend Wiring Needed: Will clear history for this session."); };
  const handleGetAIAnalysis = () => alert("Backend Wiring Needed: Will send current scores to Gemini AI for a Trust Analysis.");

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', paddingBottom: '40px', color: theme.textMain, fontFamily: 'sans-serif' }}>
      
      {/* SUBTLE NAVIGATION BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', fontSize: '13px', opacity: 0.8 }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = theme.accent} onMouseOut={e => e.target.style.color = '#fff'}>
          ← Home
        </a>
        <a href="https://github.com/itchap/itchap/tree/main/Apps/trust-rater" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = theme.accent} onMouseOut={e => e.target.style.color = '#fff'}>
          View Source on GitHub ↗
        </a>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* HEADER & EQUATION */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>🤝 SA <span style={{ color: theme.accent }}>Trust Rater</span></h1>
          <p style={{ color: theme.textSub, marginBottom: '20px' }}>Evaluate your customer interactions and AE partnerships.</p>
          
          {/* VISUAL TRUST EQUATION */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '15px', backgroundColor: theme.cardBg, padding: '15px 30px', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Trust = </span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontWeight: 'bold', fontSize: '18px' }}>
              <div style={{ paddingBottom: '5px' }}>Credibility + Reliability + Intimacy</div>
              <div style={{ borderTop: `2px solid ${theme.accent}`, width: '100%' }}></div>
              <div style={{ paddingTop: '5px' }}>Self-Orientation</div>
            </div>
          </div>
        </div>

        {/* 3-COLUMN LAYOUT */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(400px, 2fr) minmax(300px, 1fr)', gap: '20px' }}>
          
          {/* LEFT COLUMN: SESSION & AVERAGE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Session Controls</h3>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input type="text" placeholder="Enter Session ID..." value={sessionId} onChange={(e) => setSessionId(e.target.value)} style={{ flexGrow: 1, padding: '8px', borderRadius: '4px', border: 'none', backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' }} />
                <button onClick={handleResume} style={{ padding: '8px 12px', backgroundColor: '#023430', color: theme.accent, border: `1px solid ${theme.accent}`, borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Resume</button>
              </div>
              <button onClick={handleSaveForLater} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: theme.accent, border: `1px solid ${theme.accent}`, borderRadius: '4px', cursor: 'pointer', marginBottom: '10px' }}>Save for Later (Get ID)</button>
              <button onClick={handleResetSession} style={{ width: '100%', padding: '10px', backgroundColor: theme.danger, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reset Session</button>
            </div>

            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
              <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Running Average</h3>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: theme.accent, marginBottom: '15px' }}>
                {runningAverage ? runningAverage : '--'}
              </div>
              <button onClick={handleUpdateAverage} style={{ width: '100%', padding: '10px', backgroundColor: theme.accent, color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>Update Running Average</button>
              <button onClick={handleResetAverage} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: theme.textSub, border: `1px solid ${theme.textSub}`, borderRadius: '4px', cursor: 'pointer' }}>Reset Average</button>
            </div>
          </div>

          {/* MIDDLE COLUMN: THE INPUTS */}
          <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '30px' }}>
            <input 
              type="text" 
              placeholder="Interaction Name (e.g., Acme Corp Discovery)" 
              value={interactionName}
              onChange={(e) => setInteractionName(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '30px', borderRadius: '4px', border: `1px solid ${theme.border}`, backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff', boxSizing: 'border-box', fontSize: '16px' }}
            />

            <Slider label="Credibility (C)" subtext="You really know the subject matter" value={credibility} setValue={setCredibility} theme={theme} />
            <Slider label="Reliability (R)" subtext="You always deliver and do what you say" value={reliability} setValue={setReliability} theme={theme} />
            <Slider label="Intimacy (I)" subtext="You built rapport and made them feel safe" value={intimacy} setValue={setIntimacy} theme={theme} />
            
            <hr style={{ borderColor: theme.border, margin: '30px 0' }} />
            
            <Slider label="Self-Orientation (S)" subtext="You focused on your views and needs" value={selfOrientation} setValue={setSelfOrientation} theme={theme} reverseColor />
          </div>

          {/* RIGHT COLUMN: SCORE & AI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '30px 20px', textAlign: 'center' }}>
              <h2 style={{ margin: '0 0 10px 0', color: theme.textSub }}>Current Score</h2>
              <div style={{ fontSize: '84px', fontWeight: 'bold', color: selfOrientation > 7 ? theme.danger : theme.accent, lineHeight: '1' }}>
                {trustScore}
              </div>
              <p style={{ color: theme.textSub, fontSize: '14px', marginTop: '15px' }}>
                Max Score: 30.0 | Min Score: 0.3
              </p>
            </div>

            <button onClick={handleSaveAssessment} style={{ width: '100%', padding: '15px', backgroundColor: theme.accent, color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
              Save Assessment
            </button>
            
            <button onClick={handleGetAIAnalysis} style={{ width: '100%', padding: '15px', backgroundColor: '#023430', color: theme.accent, border: `1px solid ${theme.accent}`, borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span>🧠</span> Get AI Trust Analysis
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
    <div style={{ marginBottom: '25px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <strong style={{ fontSize: '18px' }}>{label}</strong>
        <span style={{ fontWeight: 'bold', fontSize: '18px', color: reverseColor && value > 6 ? theme.danger : theme.accent }}>{value}/10</span>
      </div>
      <div style={{ fontSize: '14px', color: theme.textSub, marginBottom: '12px' }}>{subtext}</div>
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