import React, { useState } from 'react';

const API_URL = 'https://itchap.com/api/dealsheets';

// EXACT GLOBAL RESET FROM SKILLS APP
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

// Reusable Panel Style based on Skills App
const panelStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #333'
};

// Reusable Input Style based on Skills App
const inputStyle = {
  width: '100%',
  padding: '8px',
  boxSizing: 'border-box',
  backgroundColor: '#fff',
  color: '#000',
  border: '1px solid #555',
  borderRadius: '4px',
  fontSize: '12px'
};

// Reusable Label Style
const labelStyle = {
  display: 'block',
  fontSize: '12px',
  marginBottom: '5px',
  color: '#00ed64',
  fontWeight: 'bold'
};

export default function DealSheetsApp() {
  const [activeTab, setActiveTab] = useState('overview');
  
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
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#011e2b', minHeight: '100vh', width: '100vw', margin: 0, boxSizing: 'border-box', overflowX: 'hidden', color: '#fff' }}>
      <GlobalReset />
      
      {/* SUBTLE NAVIGATION BAR (From Skills App) */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '10px 20px', 
        fontSize: '13px',
        opacity: 0.8
      }}>
        <a 
          href="/" 
          style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s ease-in-out' }} 
          onMouseOver={e => e.target.style.color = '#01ed64'} 
          onMouseOut={e => e.target.style.color = '#fff'}
        >
          ← Home
        </a>
      </div>

      {/* HEADER (From Skills App) */}
      <h2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '0 0 20px 0' }}>
        🤝 SA <span style={{ color: '#01ed64' }}>Deal Sheets</span> Framework
      </h2>

      {/* MAIN LAYOUT CONTAINER */}
      <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'flex-start', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* LEFT COLUMN (250px width just like Skills App) */}
        <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={panelStyle}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>Session Controls</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', gap: '5px' }}>
                <input type="text" value={deal.sessionId} readOnly style={{ ...inputStyle, flex: 1, backgroundColor: '#011e2b', color: '#00ed64', border: '1px solid #00ed64', fontWeight: 'bold', textAlign: 'center' }} />
                <button style={{ padding: '8px', backgroundColor: '#00684a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Load</button>
              </div>

              <button style={{ width: '100%', padding: '10px', backgroundColor: '#00ed64', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                💾 Save Deal Sheet
              </button>
              
              <button style={{ width: '100%', padding: '10px', backgroundColor: '#023430', color: '#00ed64', border: '1px solid #00ed64', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                📄 Export to PDF
              </button>

              <button style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#c471ed', border: '1px solid #c471ed', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                🧠 Generate AI POV
              </button>
            </div>
          </div>

          <div style={panelStyle}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>Deal Health</h3>
            <p style={{ fontSize: '13px', color: '#e0e0e0', marginTop: 0 }}>Stakeholders Mapped: <strong style={{color: '#00ed64'}}>{deal.stakeholders.length}</strong></p>
            <p style={{ fontSize: '13px', color: '#e0e0e0', marginBottom: 0 }}>Value Framework: {deal.afterScenario ? <strong style={{color: '#00ed64'}}>Defined</strong> : <strong style={{color: '#ff4d4d'}}>Incomplete</strong>}</p>
          </div>
        </div>

        {/* RIGHT MAIN AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* TAB NAVIGATION (Styled like the category buttons in Skills app) */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {['overview', 'stakeholders', 'value'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                style={{ 
                  flex: 1, 
                  padding: '10px', 
                  backgroundColor: activeTab === tab ? '#00ed64' : '#023430', 
                  color: activeTab === tab ? '#000' : '#00ed64', 
                  border: activeTab === tab ? 'none' : '1px solid #00684a', 
                  borderRadius: '4px', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}
              >
                {tab.replace('value', 'Value Framework')}
              </button>
            ))}
          </div>

          <div style={{ ...panelStyle, padding: '25px' }}>
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div><label style={labelStyle}>Account Name</label><input style={inputStyle} name="accountName" value={deal.accountName} onChange={handleInputChange} placeholder="e.g. Acme Corp" /></div>
                  <div><label style={labelStyle}>ARR Amount</label><input style={inputStyle} name="arr" value={deal.arr} onChange={handleInputChange} placeholder="$" /></div>
                  <div><label style={labelStyle}>Industry</label><input style={inputStyle} name="industry" value={deal.industry} onChange={handleInputChange} placeholder="e.g. FinTech" /></div>
                  <div>
                    <label style={labelStyle}>Sales Motion</label>
                    <select style={{...inputStyle, height: '33px'}} name="salesMotion" value={deal.salesMotion} onChange={handleInputChange}>
                      <option value="Launch">Launch</option>
                      <option value="Migrate">Migrate</option>
                      <option value="Select">Select</option>
                      <option value="Replace">Replace</option>
                    </select>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed #555', paddingTop: '20px' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#00ed64' }}>The "Why"</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div><label style={labelStyle}>Why Do Anything?</label><textarea style={{...inputStyle, minHeight: '80px', resize: 'vertical'}} name="whyDoAnything" value={deal.whyDoAnything} onChange={handleInputChange} placeholder="What's the customer's business justification?" /></div>
                    <div><label style={labelStyle}>Why Now?</label><textarea style={{...inputStyle, minHeight: '80px', resize: 'vertical'}} name="whyNow" value={deal.whyNow} onChange={handleInputChange} placeholder="What's the compelling event?" /></div>
                    <div><label style={labelStyle}>Why Us?</label><textarea style={{...inputStyle, minHeight: '80px', resize: 'vertical'}} name="whyMongoDB" value={deal.whyMongoDB} onChange={handleInputChange} placeholder="Why are we the right solution?" /></div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STAKEHOLDERS */}
            {activeTab === 'stakeholders' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>
                  <h3 style={{ color: '#00ed64', margin: 0 }}>Key Customer Stakeholders</h3>
                  <button onClick={addStakeholder} style={{ padding: '8px 12px', backgroundColor: '#00ed64', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add Stakeholder</button>
                </div>
                
                {deal.stakeholders.length === 0 ? (
                  <p style={{ color: '#bbb', fontSize: '13px', fontStyle: 'italic' }}>No stakeholders mapped yet. Identify your Champions and Economic Buyers.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {deal.stakeholders.map(s => (
                      <div key={s.id} style={{ display: 'flex', gap: '10px', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '8px', border: '1px solid #444', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1.5 }}><label style={labelStyle}>Name</label><input style={inputStyle} value={s.name} onChange={(e) => updateStakeholder(s.id, 'name', e.target.value)} /></div>
                        <div style={{ flex: 1.5 }}><label style={labelStyle}>Role</label><input style={inputStyle} value={s.role} onChange={(e) => updateStakeholder(s.id, 'role', e.target.value)} /></div>
                        <div style={{ flex: 1 }}>
                          <label style={labelStyle}>Influence</label>
                          <select style={{...inputStyle, height: '33px'}} value={s.influence} onChange={(e) => updateStakeholder(s.id, 'influence', e.target.value)}>
                            <option value="5">5 - Veto</option>
                            <option value="4">4 - Recommender</option>
                            <option value="3">3 - Evaluator</option>
                            <option value="2">2 - Implementer</option>
                            <option value="1">1 - Minimal</option>
                          </select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={labelStyle}>Support</label>
                          <select style={{...inputStyle, height: '33px'}} value={s.support} onChange={(e) => updateStakeholder(s.id, 'support', e.target.value)}>
                            <option value="++">++ Strong</option>
                            <option value="+">+ Supporter</option>
                            <option value="?">? Neutral</option>
                            <option value="-">- Adversary</option>
                          </select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={labelStyle}>Threat</label>
                          <select style={{...inputStyle, height: '33px'}} value={s.threat} onChange={(e) => updateStakeholder(s.id, 'threat', e.target.value)}>
                            <option value="Not Threatened">Safe</option>
                            <option value="Threatened">Threatened</option>
                          </select>
                        </div>
                        <button onClick={() => removeStakeholder(s.id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '0 5px 8px 5px', fontSize: '18px', fontWeight: 'bold' }} title="Remove">&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: VALUE FRAMEWORK */}
            {activeTab === 'value' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  {/* Left Column: Current State */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ color: '#fff', borderBottom: '1px solid #555', paddingBottom: '10px', margin: 0 }}>Current State</h3>
                    <div><label style={labelStyle}>Before Scenario</label><textarea style={{...inputStyle, minHeight: '120px'}} name="beforeScenario" value={deal.beforeScenario} onChange={handleInputChange} placeholder="Current state and associated pain..." /></div>
                    <div><label style={labelStyle}>Negative Consequences</label><textarea style={{...inputStyle, minHeight: '120px'}} name="negativeConsequences" value={deal.negativeConsequences} onChange={handleInputChange} placeholder="Impact on Revenue, Cost, Risk, CSAT..." /></div>
                  </div>

                  {/* Right Column: Future State */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ color: '#fff', borderBottom: '1px solid #555', paddingBottom: '10px', margin: 0 }}>Future State</h3>
                    <div><label style={labelStyle}>After Scenario</label><textarea style={{...inputStyle, minHeight: '120px'}} name="afterScenario" value={deal.afterScenario} onChange={handleInputChange} placeholder="Ideal state with all pain points resolved..." /></div>
                    <div><label style={labelStyle}>Positive Business Outcomes</label><textarea style={{...inputStyle, minHeight: '120px'}} name="positiveBusinessOutcomes" value={deal.positiveBusinessOutcomes} onChange={handleInputChange} placeholder="Value achieved..." /></div>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed #555', paddingTop: '20px' }}>
                  <label style={labelStyle}>Required Capabilities</label>
                  <textarea style={{...inputStyle, minHeight: '80px'}} name="requiredCapabilities" value={deal.requiredCapabilities} onChange={handleInputChange} placeholder="Key solution capabilities required to achieve the PBOs..." />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}