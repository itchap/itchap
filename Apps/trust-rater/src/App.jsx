import React, { useState } from 'react';

function App() {
  const [sessionId, setSessionId] = useState('');
  const [credibility, setCredibility] = useState(5);
  const [reliability, setReliability] = useState(5);
  const [intimacy, setIntimacy] = useState(5);
  const [selfOrientation, setSelfOrientation] = useState(5);
  const [interactionName, setInteractionName] = useState('');
  const [runningAverage, setRunningAverage] = useState(null);
  const [currentAssessmentId, setCurrentAssessmentId] = useState(null);
  const [history, setHistory] = useState([]); // Empty array now, no mock data!
  const [showIdBox, setShowIdBox] = useState(false);

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

  const handleCopyId = () => {
    navigator.clipboard.writeText(sessionId);
    alert("Session ID copied to clipboard!");
  };

  // 1. Generate Session ID (With Warning & Auto-Reset)
  const handleSaveForLater = () => {
    // If they already have a Session ID, warn them first!
    if (sessionId) {
      const confirmReset = window.confirm(
        "You already have an active Session ID. Generating a new one will clear your current screen and start fresh. Are you sure?"
      );
      if (!confirmReset) return; // Stop if they click "Cancel"
    }

    // Generate the new ID
    const newId = `SA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Explicitly reset the entire UI to factory defaults
    setInteractionName(''); 
    setCredibility(5); 
    setReliability(5); 
    setIntimacy(5); 
    setSelfOrientation(5); 
    setCurrentAssessmentId(null); 
    setHistory([]); 
    setRunningAverage(null);

    // Set the new ID and smoothly open the UI box
    setSessionId(newId);
    setShowIdBox(true); 
  };

  // Reset the entire session (Clear everything)
  const handleResetSession = () => {
    const confirmClear = window.confirm("This will clear your current Session ID and all data on screen. Are you sure?");
    if (!confirmClear) return;
    
    setSessionId('');
    setInteractionName('');
    setCredibility(5);
    setReliability(5);
    setIntimacy(5);
    setSelfOrientation(5);
    setCurrentAssessmentId(null);
    setHistory([]);
    setRunningAverage(null);
  };

  // 2. Fetch History & Average
  const handleResume = async () => {
    if (!sessionId) return alert("Please enter a Session ID");
    try {
      const res = await fetch(`/api/trust/session/${sessionId}`);
      const data = await res.json();
      
      // Update history
      if (data.history) setHistory(data.history.slice(0, 5));
      
      // Update average (even if it is null/reset)
      setRunningAverage(data.runningAverage); 
    } catch (err) {
      alert("Error loading session data. Is the backend running?");
    }
  };

  // 3. Save Assessment (Now Auto-Updates Average!)
  const handleSaveAssessment = async () => {
    if (!sessionId || !interactionName) return alert("Session ID and Interaction Name are required!");
    try {
      const response = await fetch('/api/trust/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentAssessmentId,
          sessionId,
          interactionName,
          c: credibility,
          r: reliability,
          i: intimacy,
          s: selfOrientation,
          score: parseFloat(trustScore)
        })
      });
      const data = await response.json();
      
      if (data.success) {
        // Automatically update the UI with the new calculated average!
        setRunningAverage(data.averageScore);
        handleResume(); // Refreshes the recent list
        setInteractionName(''); 
        setCurrentAssessmentId(null);
      }
    } catch (err) {
      alert("Error saving assessment. ");
    }
  };

  // 4. Soft Reset Average
  const handleResetAverage = async () => {
    if (!sessionId) return alert("No active session to reset.");
    
    const confirmWipe = window.confirm(
      "Are you sure? This will reset your running average to zero, but keep your past assessments visible in your history pane."
    );
    if (!confirmWipe) return;

    try {
      await fetch('/api/trust/reset-average', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      
      // Force a fresh sync with the database immediately!
      await handleResume();
      
      // Clear the active form inputs
      setCurrentAssessmentId(null);
      setInteractionName('');
      
      alert("Average reset! Your past assessments are now archived from the math, but still visible.");
    } catch (err) {
      alert("Error resetting the average.");
    }
  };

  // 5. Gemini AI Trust Analysis
  const handleGetAIAnalysis = async () => {
    try {
      alert("Thinking... (Click OK and wait a few seconds)");
      const res = await fetch('/api/trust/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ c: credibility, r: reliability, i: intimacy, s: selfOrientation, score: trustScore })
      });
      const data = await res.json();
      alert(`🤖 AI Analysis:\n\n${data.analysis}`);
    } catch (err) {
      alert("Error generating AI analysis.");
    }
  };

  const loadAssessment = (item) => {
    setInteractionName(item.interactionName);
    setCredibility(item.c);
    setReliability(item.r);
    setIntimacy(item.i);
    setSelfOrientation(item.s);
    setCurrentAssessmentId(item._id);
  };

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
          
          {/* LEFT COLUMN: SESSION, AI, & HISTORY */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
           <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Session Controls</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* Top Row: Input & Resume */}
                <div style={{ display: 'flex', gap: '5px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter Session ID..." 
                    value={sessionId} 
                    onChange={(e) => setSessionId(e.target.value)} 
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: 'none', backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' }} 
                  />
                  <button onClick={handleResume} style={{ padding: '8px 12px', backgroundColor: '#023430', color: theme.accent, border: `1px solid ${theme.accent}`, borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Resume
                  </button>
                </div>

                {/* --- DYNAMIC TOGGLE BUTTON --- */}
                <button 
                  onClick={sessionId ? () => setShowIdBox(!showIdBox) : handleSaveForLater} 
                  style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: theme.accent, border: `1px solid ${theme.accent}`, borderRadius: '4px', cursor: 'pointer' }}
                >
                  {sessionId ? (showIdBox ? 'Hide Session ID' : 'Show Session ID') : 'Generate New ID'}
                </button>

                {/* --- DASHED COPY BOX --- */}
                {showIdBox && sessionId && (
                  <div style={{ padding: '10px', backgroundColor: 'rgba(0, 237, 100, 0.05)', border: `1px dashed ${theme.accent}`, borderRadius: '4px' }}>
                    <p style={{ fontSize: '12px', color: theme.accent, margin: '0 0 5px 0', fontWeight: 'bold' }}>Your Unique ID:</p>
                    <p style={{ fontSize: '11px', color: theme.textSub, margin: '0 0 10px 0', lineHeight: '1.4' }}>Save this somewhere safe to restore your board.</p>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <input 
                        type="text" 
                        readOnly 
                        value={sessionId} 
                        onClick={(e) => e.target.select()} 
                        style={{ flex: 1, padding: '6px', fontSize: '11px', borderRadius: '4px', border: 'none', backgroundColor: '#fff', color: '#000' }} 
                      />
                      <button onClick={handleCopyId} style={{ padding: '6px 10px', backgroundColor: theme.accent, color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                <button onClick={handleResetSession} style={{ width: '100%', padding: '10px', backgroundColor: theme.danger, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Reset Session
                </button>
              </div>
            </div>

            <button onClick={handleGetAIAnalysis} style={{ width: '100%', padding: '15px', backgroundColor: '#023430', color: theme.accent, border: `1px solid ${theme.accent}`, borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span>🧠</span> Get AI Trust Analysis
            </button>

            {/* History Pane */}
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px' }}>Recent Assessments</h3>
              
              {history.length === 0 ? (
                <div style={{ color: theme.textSub, fontSize: '13px', fontStyle: 'italic', textAlign: 'center' }}>No history for this session yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {history.map((item) => (
                    <div 
                      key={item._id} 
                      onClick={() => loadAssessment(item)}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '12px', 
                        backgroundColor: currentAssessmentId === item._id ? '#023430' : 'rgba(0,0,0,0.3)', 
                        borderRadius: '4px', 
                        cursor: 'pointer', 
                        border: currentAssessmentId === item._id ? `1px solid ${theme.accent}` : `1px solid transparent`,
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={e => { if(currentAssessmentId !== item._id) e.currentTarget.style.border = `1px solid ${theme.textSub}` }}
                      onMouseOut={e => { if(currentAssessmentId !== item._id) e.currentTarget.style.border = `1px solid transparent` }}
                    >
                      <span style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px', fontWeight: currentAssessmentId === item._id ? 'bold' : 'normal' }}>
                        {item.interactionName}
                      </span>
                      <span style={{ fontWeight: 'bold', fontSize: '14px', color: item.score < 5 ? theme.danger : theme.accent }}>
                        {item.score}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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

            <Slider label="Credibility (C)" subtext="You really know your subject matter and showcase it" value={credibility} setValue={setCredibility} theme={theme} />
            <Slider label="Reliability (R)" subtext="You always deliver with quality and do what you say you will do." value={reliability} setValue={setReliability} theme={theme} />
            <Slider label="Intimacy (I)" subtext="You build rapport, make people feel safe and nurture relationships" value={intimacy} setValue={setIntimacy} theme={theme} />
            
            <hr style={{ borderColor: theme.border, margin: '30px 0' }} />
            
            <Slider label="Self-Orientation (S)" subtext="You focus on your opinions, views, needs or outcomes" value={selfOrientation} setValue={setSelfOrientation} theme={theme} reverseColor />
          </div>

          {/* RIGHT COLUMN: SCORE & AVERAGE */}
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
              {currentAssessmentId ? 'Update Assessment' : 'Save Assessment'}
            </button>

            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
              <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Running Average</h3>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: theme.accent, marginBottom: '15px' }}>
                {runningAverage ? runningAverage : '--'}
              </div>
              <button onClick={handleResetAverage} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: theme.textSub, border: `1px solid ${theme.textSub}`, borderRadius: '4px', cursor: 'pointer' }}>Reset Average</button>
            </div>
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