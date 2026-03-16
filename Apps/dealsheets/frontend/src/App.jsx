import React, { useState } from 'react';

// --- THEME CONFIG ---
const theme = {
  bg: '#011e2b',
  cardBg: '#011620', // Slightly darker for contrast
  border: '#333',
  accent: '#00ed64', 
  textMain: '#fff',
  textSub: '#bbb',
  inputBg: '#01121a',
  danger: '#ff4d4d'
};

const GlobalStyle = () => (
  <style>{`
    html, body, #root { 
      margin: 0; padding: 0; background-color: ${theme.bg}; color: ${theme.textMain}; 
      font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased;
      width: 100%; min-height: 100vh;
    }
    input, textarea, select { 
      width: 100%; background: ${theme.inputBg}; border: 1px solid ${theme.border}; 
      color: ${theme.textMain}; padding: 12px; border-radius: 6px; box-sizing: border-box; 
      font-size: 0.95rem; font-family: 'Inter', sans-serif; transition: all 0.2s ease;
    }
    input:focus, textarea:focus, select:focus { border-color: ${theme.accent}; outline: none; box-shadow: 0 0 0 2px rgba(0, 237, 100, 0.1); }
    textarea { resize: vertical; min-height: 100px; }
    label { display: block; margin-bottom: 6px; color: ${theme.textSub}; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .btn { background: ${theme.cardBg}; color: ${theme.textMain}; border: 1px solid ${theme.border}; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.2s; }
    .btn:hover { border-color: ${theme.accent}; color: ${theme.accent}; }
    .btn-primary { background: ${theme.accent}; color: #000; border: none; }
    .btn-primary:hover { background: #00c753; color: #000; }
    
    .tab { background: transparent; color: ${theme.textSub}; border: none; border-bottom: 2px solid transparent; padding: 10px 20px; cursor: pointer; font-weight: bold; font-size: 1rem; transition: all 0.2s; }
    .tab.active { color: ${theme.accent}; border-bottom-color: ${theme.accent}; }
    .tab:hover:not(.active) { color: ${theme.textMain}; }
  `}</style>
);

export default function DealSheetsApp() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // App State mapping to the PDF Framework
  const [deal, setDeal] = useState({
    sessionId: `DS-${Math.floor(Math.random() * 10000)}`,
    accountName: '',
    opportunityLink: '',
    industry: '',
    useCase: '',
    arr: '',
    salesMotion: 'Launch',
    whyDoAnything: '',
    whyNow: '',
    whyMongoDB: '',
    stakeholders: [],
    beforeScenario: '',
    negativeConsequences: '',
    afterScenario: '',
    positiveBusinessOutcomes: '',
    requiredCapabilities: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeal(prev => ({ ...prev, [name]: value }));
  };

  const addStakeholder = () => {
    setDeal(prev => ({
      ...prev,
      stakeholders: [...prev.stakeholders, { id: Date.now(), name: '', role: '', influence: '3', support: '+', threat: 'Not Threatened' }]
    }));
  };

  const updateStakeholder = (id, field, value) => {
    setDeal(prev => ({
      ...prev,
      stakeholders: prev.stakeholders.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const removeStakeholder = (id) => {
    setDeal(prev => ({ ...prev, stakeholders: prev.stakeholders.filter(s => s.id !== id) }));
  };

  return (
    <>
      <GlobalStyle />
      
      {/* HEADER */}
      <nav style={{ padding: '15px 40px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(1,30,43,0.95)' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.accent, display: 'flex', alignItems: 'center', gap: '12px' }}>
          🤝 SA Deal Sheets
        </div>
        <a href="/" style={{ color: theme.textSub, textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>← Return to Hub</a>
      </nav>

      {/* MAIN LAYOUT */}
      <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
        
        {/* LEFT SIDEBAR: Session Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
            <h3 style={{ margin: '0 0 20px 0', color: theme.textMain }}>Session Controls</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input type="text" value={deal.sessionId} readOnly style={{ background: theme.bg, color: theme.accent, fontWeight: 'bold' }} />
              <button className="btn">Load</button>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginBottom: '10px' }}>💾 Save Deal Sheet</button>
            <button className="btn" style={{ width: '100%', marginBottom: '10px' }}>📄 Export to PDF</button>
            <button className="btn" style={{ width: '100%', borderColor: '#c471ed', color: '#c471ed' }}>🧠 Generate AI POV</button>
          </div>

          <div style={{ background: theme.cardBg, padding: '24px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
            <h3 style={{ margin: '0 0 15px 0', color: theme.textMain }}>Deal Health</h3>
            <p style={{ color: theme.textSub, fontSize: '0.9rem', marginBottom: '10px' }}>Stakeholders Mapped: <strong style={{color: theme.textMain}}>{deal.stakeholders.length}</strong></p>
            <p style={{ color: theme.textSub, fontSize: '0.9rem' }}>Value Framework: {deal.afterScenario ? <strong style={{color: theme.accent}}>Defined</strong> : <strong style={{color: theme.danger}}>Incomplete</strong>}</p>
          </div>
        </div>

        {/* RIGHT MAIN AREA */}
        <div style={{ background: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
          
          {/* TABS */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${theme.border}`, background: 'rgba(0,0,0,0.2)' }}>
            <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Deal Overview</button>
            <button className={`tab ${activeTab === 'stakeholders' ? 'active' : ''}`} onClick={() => setActiveTab('stakeholders')}>Stakeholders</button>
            <button className={`tab ${activeTab === 'value' ? 'active' : ''}`} onClick={() => setActiveTab('value')}>Value Framework</button>
          </div>

          <div style={{ padding: '30px' }}>
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <h2 style={{ color: theme.accent, margin: '0 0 10px 0' }}>Deal Information</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div><label>Account Name</label><input name="accountName" value={deal.accountName} onChange={handleInputChange} placeholder="e.g. Acme Corp" /></div>
                  <div><label>ARR Amount</label><input name="arr" value={deal.arr} onChange={handleInputChange} placeholder="$" /></div>
                  <div><label>Industry</label><input name="industry" value={deal.industry} onChange={handleInputChange} placeholder="e.g. FinTech" /></div>
                  <div>
                    <label>Sales Motion</label>
                    <select name="salesMotion" value={deal.salesMotion} onChange={handleInputChange}>
                      <option value="Launch">Launch</option>
                      <option value="Migrate">Migrate</option>
                      <option value="Select">Select</option>
                      <option value="Replace">Replace</option>
                    </select>
                  </div>
                </div>

                <hr style={{ border: `1px solid ${theme.border}`, margin: '10px 0' }} />
                <h2 style={{ color: theme.accent, margin: '0 0 10px 0' }}>The "Why"</h2>
                
                <div><label>Why Do Anything?</label><textarea name="whyDoAnything" value={deal.whyDoAnything} onChange={handleInputChange} placeholder="What's the customer's business justification?" /></div>
                <div><label>Why Now?</label><textarea name="whyNow" value={deal.whyNow} onChange={handleInputChange} placeholder="What's the compelling event?" /></div>
                <div><label>Why Us?</label><textarea name="whyMongoDB" value={deal.whyMongoDB} onChange={handleInputChange} placeholder="Why are we the right solution?" /></div>
              </div>
            )}

            {/* TAB 2: STAKEHOLDERS */}
            {activeTab === 'stakeholders' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ color: theme.accent, margin: 0 }}>Key Customer Stakeholders</h2>
                  <button className="btn btn-primary" onClick={addStakeholder}>+ Add Stakeholder</button>
                </div>
                
                {deal.stakeholders.length === 0 ? (
                  <p style={{ color: theme.textSub, fontStyle: 'italic' }}>No stakeholders mapped yet. Identify your Champions and Economic Buyers.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {deal.stakeholders.map(s => (
                      <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr auto', gap: '15px', background: theme.bg, padding: '15px', borderRadius: '8px', border: `1px solid ${theme.border}`, alignItems: 'end' }}>
                        <div><label>Name</label><input value={s.name} onChange={(e) => updateStakeholder(s.id, 'name', e.target.value)} /></div>
                        <div><label>Role</label><input value={s.role} onChange={(e) => updateStakeholder(s.id, 'role', e.target.value)} /></div>
                        <div>
                          <label>Influence (1-5)</label>
                          <select value={s.influence} onChange={(e) => updateStakeholder(s.id, 'influence', e.target.value)}>
                            <option value="5">5 - Final Veto</option>
                            <option value="4">4 - Recommender</option>
                            <option value="3">3 - Evaluator</option>
                            <option value="2">2 - Implementer</option>
                            <option value="1">1 - Minimal</option>
                          </select>
                        </div>
                        <div>
                          <label>Support</label>
                          <select value={s.support} onChange={(e) => updateStakeholder(s.id, 'support', e.target.value)}>
                            <option value="++">++ Strong</option>
                            <option value="+">+ Supporter</option>
                            <option value="?">? Neutral</option>
                            <option value="-">- Adversary</option>
                          </select>
                        </div>
                        <div>
                          <label>Threat</label>
                          <select value={s.threat} onChange={(e) => updateStakeholder(s.id, 'threat', e.target.value)}>
                            <option value="Not Threatened">Not Threatened</option>
                            <option value="Threatened">Threatened</option>
                          </select>
                        </div>
                        <button onClick={() => removeStakeholder(s.id)} style={{ background: 'transparent', color: theme.danger, border: 'none', cursor: 'pointer', fontSize: '1.2rem', paddingBottom: '10px' }}>✖</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: VALUE FRAMEWORK */}
            {activeTab === 'value' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <h2 style={{ color: theme.accent, margin: '0 0 10px 0' }}>Value Card</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  {/* Left Column: Current State */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ color: theme.textMain, borderBottom: `1px solid ${theme.border}`, paddingBottom: '10px', margin: 0 }}>Current State</h3>
                    <div><label>Before Scenario</label><textarea name="beforeScenario" value={deal.beforeScenario} onChange={handleInputChange} placeholder="Current state and associated pain (Tech, People, Process)..." /></div>
                    <div><label>Negative Consequences</label><textarea name="negativeConsequences" value={deal.negativeConsequences} onChange={handleInputChange} placeholder="Impact on Revenue, Cost, Risk, CSAT..." /></div>
                  </div>

                  {/* Right Column: Future State */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ color: theme.textMain, borderBottom: `1px solid ${theme.border}`, paddingBottom: '10px', margin: 0 }}>Future State</h3>
                    <div><label>After Scenario</label><textarea name="afterScenario" value={deal.afterScenario} onChange={handleInputChange} placeholder="Ideal state with all pain points resolved..." /></div>
                    <div><label>Positive Business Outcomes</label><textarea name="positiveBusinessOutcomes" value={deal.positiveBusinessOutcomes} onChange={handleInputChange} placeholder="Value (Revenue, Cost, Risk, CSAT) achieved..." /></div>
                  </div>
                </div>

                <hr style={{ border: `1px solid ${theme.border}`, margin: '10px 0' }} />
                
                <div><label>Required Capabilities</label><textarea name="requiredCapabilities" value={deal.requiredCapabilities} onChange={handleInputChange} placeholder="Key solution capabilities required to achieve the PBOs..." style={{ minHeight: '80px' }} /></div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}