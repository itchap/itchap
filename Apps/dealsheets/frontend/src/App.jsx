import React, { useState } from 'react';

const API_URL = 'https://itchap.com/api/dealsheets';

// GLOBAL RESET & UNIFIED CSS
const GlobalReset = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #011e2b !important;
      width: 100% !important;
      height: 100% !important;
      overflow-x: hidden !important;
      font-family: 'Inter', sans-serif !important;
    }
    
    #root {
      width: 100%;
      height: 100%;
    }

    /* UNIFIED PALE WHITE FORM FIELDS */
    .sa-input {
      width: 100%;
      padding: 10px 12px;
      box-sizing: border-box;
      background-color: #f9fbfb !important; 
      color: #000000 !important; 
      border: 1px solid #2a3f47 !important;
      border-radius: 6px;
      font-size: 13px;
      font-family: 'Inter', sans-serif;
      transition: all 0.2s ease;
      outline: none;
    }

    .sa-input:focus {
      background-color: #ffffff !important;
      border-color: #00ed64 !important;
      box-shadow: 0 0 0 3px rgba(0, 237, 100, 0.3) !important;
    }

    .sa-input::placeholder {
      color: #7c9096 !important; 
    }

    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #00684a;
      border-radius: 4px;
    }

    /* CLEAN PDF PRINT STYLING */
    @media print {
      body { background-color: #ffffff !important; color: #000000 !important; }
      .no-print { display: none !important; }
      .print-area { width: 100% !important; max-width: 100% !important; }
      .sa-input { 
        background-color: transparent !important; 
        border: 1px solid #ccc !important; 
        color: #000 !important; 
      }
      h2, h3, label { color: #000 !important; }
    }
  `}</style>
);

const panelStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  padding: '15px',
  borderRadius: '8px',
  border: '1px solid #333'
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  marginBottom: '6px',
  color: '#88a3ae', 
  fontWeight: '600',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' 
};

export default function DealSheetsApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPov, setAiPov] = useState(null);
  
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
    appArchDescription: '',     // NEW: App/Arch Description
    beforeScenario: '',
    negativeConsequences: '',
    afterScenario: '',
    positiveBusinessOutcomes: '',
    requiredCapabilities: '',
    successMetrics: ''          // NEW: Success Metrics
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

  // --- API INTEGRATION FUNCTIONS ---
  const saveSession = async () => {
    try {
      const res = await fetch(`${API_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: deal.sessionId, data: deal })
      });
      const resData = await res.json();
      if (res.ok) alert(`✅ Session ${deal.sessionId} saved securely!`);
      else alert(`❌ Failed to save: ${resData.error}`);
    } catch (err) {
      alert('❌ Error connecting to server.');
    }
  };

  const loadSession = async () => {
    if (!deal.sessionId) return alert('Enter a Session ID to load.');
    try {
      const res = await fetch(`${API_URL}/${deal.sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setDeal(data);
        alert('✅ Session loaded successfully!');
      } else {
        alert('❌ Session ID not found.');
      }
    } catch (err) {
      alert('❌ Error connecting to server.');
    }
  };

  const generatePOV = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_URL}/generate-pov`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deal })
      });
      const data = await res.json();
      if (data.pov) setAiPov(data.pov);
      else alert('Failed to generate POV.');
    } catch (err) {
      alert('❌ Error connecting to AI service.');
    }
    setIsGenerating(false);
  };

  const exportPDF = () => {
    window.print(); 
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#011e2b', minHeight: '100vh', width: '100vw', margin: 0, boxSizing: 'border-box', overflowX: 'hidden', color: '#fff' }}>
      <GlobalReset />
      
      {/* NAVIGATION BAR */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', fontSize: '13px', opacity: 0.8 }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s ease-in-out' }} onMouseOver={e => e.target.style.color = '#01ed64'} onMouseOut={e => e.target.style.color = '#fff'}>
          ← Home
        </a>
      </div>

      {/* HEADER */}
      <h2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '0 0 20px 0' }}>
        🤝 SA <span style={{ color: '#01ed64' }}>Deal Sheets</span> Framework
      </h2>

      {/* MAIN LAYOUT CONTAINER */}
      <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'flex-start', maxWidth: '1200px', margin: '0 auto' }} className="print-area">
        
        {/* LEFT COLUMN */}
        <div className="no-print" style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={panelStyle}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>Session Controls</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', gap: '5px' }}>
                <input 
                  type="text" 
                  name="sessionId"
                  className="sa-input" 
                  value={deal.sessionId} 
                  onChange={handleInputChange} 
                  style={{ textAlign: 'center', fontWeight: 'bold' }} 
                  placeholder="DS-XXXX"
                />
                <button onClick={loadSession} style={{ padding: '8px', backgroundColor: '#00684a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Load</button>
              </div>

              <button onClick={saveSession} style={{ width: '100%', padding: '10px', backgroundColor: '#00ed64', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>💾 Save Deal Sheet</button>
              <button onClick={exportPDF} style={{ width: '100%', padding: '10px', backgroundColor: '#023430', color: '#00ed64', border: '1px solid #00ed64', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>📄 Export to PDF</button>
              <button onClick={generatePOV} disabled={isGenerating} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: isGenerating ? '#777' : '#c471ed', border: `1px solid ${isGenerating ? '#777' : '#c471ed'}`, borderRadius: '4px', cursor: isGenerating ? 'wait' : 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                {isGenerating ? '🧠 Generating...' : '🧠 Generate AI POV'}
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
          
          {/* TAB NAVIGATION */}
          <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
            {['overview', 'stakeholders', 'value'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                style={{ flex: 1, padding: '10px', backgroundColor: activeTab === tab ? '#00ed64' : '#023430', color: activeTab === tab ? '#000' : '#00ed64', border: activeTab === tab ? 'none' : '1px solid #00684a', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'capitalize' }}
              >
                {tab.replace('value', 'Value Framework')}
              </button>
            ))}
          </div>

          <div style={{ ...panelStyle, padding: '25px' }}>
            
            {/* TAB 1: OVERVIEW */}
            {(activeTab === 'overview' || window.matchMedia('print').matches) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div><label style={labelStyle}>Account Name</label><input className="sa-input" name="accountName" value={deal.accountName} onChange={handleInputChange} placeholder="e.g. Acme Corp" /></div>
                  <div><label style={labelStyle}>ARR Amount ($)</label><input type="number" className="sa-input" name="arr" value={deal.arr} onChange={handleInputChange} placeholder="100000" /></div>
                  <div><label style={labelStyle}>Salesforce Link</label><input className="sa-input" name="opportunityLink" value={deal.opportunityLink} onChange={handleInputChange} placeholder="https://mongodb.my.salesforce.com/..." /></div>
                  <div><label style={labelStyle}>Industry</label><input className="sa-input" name="industry" value={deal.industry} onChange={handleInputChange} placeholder="e.g. FinTech" /></div>
                  <div><label style={labelStyle}>Workload / Use Case</label><input className="sa-input" name="useCase" value={deal.useCase} onChange={handleInputChange} placeholder="e.g. Single View, Legacy Mod" /></div>
                  <div>
                    <label style={labelStyle}>Sales Motion</label>
                    <select className="sa-input" style={{ cursor: 'pointer', height: '39px', padding: '0 12px' }} name="salesMotion" value={deal.salesMotion} onChange={handleInputChange}>
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
                    <div><label style={labelStyle}>Why Do Anything?</label><textarea className="sa-input" style={{ minHeight: '80px', resize: 'vertical' }} name="whyDoAnything" value={deal.whyDoAnything} onChange={handleInputChange} placeholder="What's the customer's business justification?" /></div>
                    <div><label style={labelStyle}>Why Now?</label><textarea className="sa-input" style={{ minHeight: '80px', resize: 'vertical' }} name="whyNow" value={deal.whyNow} onChange={handleInputChange} placeholder="What's the compelling event?" /></div>
                    <div><label style={labelStyle}>Why Us?</label><textarea className="sa-input" style={{ minHeight: '80px', resize: 'vertical' }} name="whyMongoDB" value={deal.whyMongoDB} onChange={handleInputChange} placeholder="Why are we the right solution?" /></div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STAKEHOLDERS */}
            {(activeTab === 'stakeholders' || window.matchMedia('print').matches) && (
              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>
                  <h3 style={{ color: '#00ed64', margin: 0 }}>Key Customer Stakeholders</h3>
                  <button className="no-print" onClick={addStakeholder} style={{ padding: '8px 12px', backgroundColor: '#00ed64', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add Stakeholder</button>
                </div>
                
                {deal.stakeholders.length === 0 ? (
                  <p style={{ color: '#bbb', fontSize: '13px', fontStyle: 'italic' }}>No stakeholders mapped yet. Identify your Champions and Economic Buyers.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {deal.stakeholders.map(s => (
                      <div key={s.id} style={{ display: 'flex', gap: '10px', backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '8px', border: '1px solid #444', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1.5 }}><label style={labelStyle}>Name</label><input className="sa-input" value={s.name} onChange={(e) => updateStakeholder(s.id, 'name', e.target.value)} /></div>
                        <div style={{ flex: 1.5 }}><label style={labelStyle}>Role</label><input className="sa-input" value={s.role} onChange={(e) => updateStakeholder(s.id, 'role', e.target.value)} /></div>
                        <div style={{ flex: 1 }}>
                          <label style={labelStyle}>Influence</label>
                          <select className="sa-input" style={{ cursor: 'pointer', height: '39px', padding: '0 12px' }} value={s.influence} onChange={(e) => updateStakeholder(s.id, 'influence', e.target.value)}>
                            <option value="5">5 - Veto</option>
                            <option value="4">4 - Recommender</option>
                            <option value="3">3 - Evaluator</option>
                            <option value="2">2 - Implementer</option>
                            <option value="1">1 - Minimal</option>
                          </select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={labelStyle}>Support</label>
                          <select className="sa-input" style={{ cursor: 'pointer', height: '39px', padding: '0 12px' }} value={s.support} onChange={(e) => updateStakeholder(s.id, 'support', e.target.value)}>
                            <option value="++">++ Strong</option>
                            <option value="+">+ Supporter</option>
                            <option value="?">? Neutral</option>
                            <option value="-">- Adversary</option>
                          </select>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={labelStyle}>Threat</label>
                          <select className="sa-input" style={{ cursor: 'pointer', height: '39px', padding: '0 12px' }} value={s.threat} onChange={(e) => updateStakeholder(s.id, 'threat', e.target.value)}>
                            <option value="Not Threatened">Safe</option>
                            <option value="Threatened">Threatened</option>
                          </select>
                        </div>
                        <button className="no-print" onClick={() => removeStakeholder(s.id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '0 5px 8px 5px', fontSize: '18px', fontWeight: 'bold' }} title="Remove">&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: VALUE FRAMEWORK */}
            {(activeTab === 'value' || window.matchMedia('print').matches) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                
                {/* NEW: App / Arch Description */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={labelStyle}>App / Architecture Description</label>
                  <textarea className="sa-input" style={{ minHeight: '80px', resize: 'vertical' }} name="appArchDescription" value={deal.appArchDescription} onChange={handleInputChange} placeholder="Describe the application, architecture, and current tech stack..." />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ color: '#fff', borderBottom: '1px solid #555', paddingBottom: '10px', margin: 0 }}>Current State</h3>
                    <div><label style={labelStyle}>Before Scenario</label><textarea className="sa-input" style={{ minHeight: '120px', resize: 'vertical' }} name="beforeScenario" value={deal.beforeScenario} onChange={handleInputChange} placeholder="Current state and associated pain..." /></div>
                    <div><label style={labelStyle}>Negative Consequences</label><textarea className="sa-input" style={{ minHeight: '120px', resize: 'vertical' }} name="negativeConsequences" value={deal.negativeConsequences} onChange={handleInputChange} placeholder="Impact on Revenue, Cost, Risk, CSAT..." /></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ color: '#fff', borderBottom: '1px solid #555', paddingBottom: '10px', margin: 0 }}>Future State</h3>
                    <div><label style={labelStyle}>After Scenario</label><textarea className="sa-input" style={{ minHeight: '120px', resize: 'vertical' }} name="afterScenario" value={deal.afterScenario} onChange={handleInputChange} placeholder="Ideal state with all pain points resolved..." /></div>
                    <div><label style={labelStyle}>Positive Business Outcomes</label><textarea className="sa-input" style={{ minHeight: '120px', resize: 'vertical' }} name="positiveBusinessOutcomes" value={deal.positiveBusinessOutcomes} onChange={handleInputChange} placeholder="Value achieved..." /></div>
                  </div>
                </div>

                <div style={{ borderTop: '1px dashed #555', paddingTop: '20px' }}>
                  <label style={labelStyle}>Required Capabilities</label>
                  <textarea className="sa-input" style={{ minHeight: '80px', resize: 'vertical' }} name="requiredCapabilities" value={deal.requiredCapabilities} onChange={handleInputChange} placeholder="Key solution capabilities required to achieve the PBOs..." />
                </div>

                {/* NEW: Success Metrics */}
                <div>
                  <label style={labelStyle}>Success Metrics</label>
                  <textarea className="sa-input" style={{ minHeight: '80px', resize: 'vertical' }} name="successMetrics" value={deal.successMetrics} onChange={handleInputChange} placeholder="How will we measure that the requirements are met? (e.g. Latency < 10ms, TCO reduced by 30%)" />
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* AI POV MODAL */}
      {aiPov && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#011e2b', border: '2px solid #c471ed', padding: '30px', borderRadius: '8px', maxWidth: '700px', width: '100%', maxHeight: '80vh', overflowY: 'auto', color: '#e0e0e0', boxShadow: '0 10px 30px rgba(196, 113, 237, 0.2)' }}>
             <h3 style={{ color: '#c471ed', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
               🧠 Generated Point of View (POV)
             </h3>
             <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px', marginBottom: '20px', fontFamily: 'Inter, sans-serif' }}>{aiPov}</div>
             <div style={{ display: 'flex', gap: '10px' }}>
               <button onClick={() => { navigator.clipboard.writeText(aiPov); alert('Copied to clipboard!'); }} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', color: '#c471ed', border: '1px solid #c471ed', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Copy to Clipboard</button>
               <button onClick={() => setAiPov(null)} style={{ flex: 1, padding: '10px', backgroundColor: '#c471ed', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}