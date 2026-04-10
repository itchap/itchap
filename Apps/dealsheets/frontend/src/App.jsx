import React, { useState } from 'react';

const API_URL = 'https://itchap.com/api/dealsheets';

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

    @media print {
      /* THE FIX: Allow height to expand and overflow so multiple pages can print */
      html, body, #root, .app-wrapper { 
        background-color: #ffffff !important; 
        color: #000000 !important; 
        height: auto !important; 
        overflow: visible !important; 
      }
      .no-print { display: none !important; }
      .print-area { width: 100% !important; max-width: 100% !important; display: block !important; }
      .sa-panel { background-color: transparent !important; border: none !important; padding: 0 !important; }
      .print-tab { display: block !important; margin-bottom: 40px !important; page-break-inside: avoid; }
      .sa-input { background-color: transparent !important; border: 1px solid #cccccc !important; color: #000000 !important; box-shadow: none !important; }
      h2, h3, label, p, strong, span, div { color: #000000 !important; }
      .print-header { margin-bottom: 30px !important; border-bottom: 2px solid #000 !important; padding-bottom: 10px !important; }
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

// HELPER: Renders Markdown asterisks (**) as actual bold text
const formatMarkdown = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#ffffff', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

export default function DealSheetsApp() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    appArchDescription: '',
    beforeScenario: '',
    negativeConsequences: '',
    afterScenario: '',
    positiveBusinessOutcomes: '',
    requiredCapabilities: '',
    successMetrics: '',
    healthInsights: '',
    meddpiccMetrics: '',
    meddpiccEconomicBuyer: '',
    meddpiccDecisionCriteria: '',
    meddpiccDecisionProcess: '',
    meddpiccPaperProcess: '',
    meddpiccIdentifiedPain: '',
    meddpiccChampion: '',
    meddpiccCompetition: ''
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

  const saveSession = async () => {
    const cleanId = deal.sessionId.trim().toUpperCase();
    setIsSaving(true);
    
    setDeal(prev => ({ ...prev, sessionId: cleanId }));

    try {
      const res = await fetch(`${API_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: cleanId, data: { ...deal, sessionId: cleanId } })
      });
      const resData = await res.json();
      
      if (res.ok) {
        setDeal(prev => ({ ...prev, ...resData.data })); 
        alert(`✅ Session ${cleanId} saved securely!`);
      } else {
        alert(`❌ Failed to save: ${resData.error}`);
      }
    } catch (err) {
      alert('❌ Error connecting to server.');
    }
    setIsSaving(false);
  };

  const loadSession = async () => {
    const searchId = deal.sessionId.trim();
    if (!searchId) return alert('Enter a Session ID to load.');
    
    setDeal(prev => ({ ...prev, sessionId: searchId.toUpperCase() }));

    try {
      const res = await fetch(`${API_URL}/${searchId}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setDeal(prev => ({ ...prev, ...data }));
        alert('✅ Session loaded successfully!');
      } else {
        alert(`❌ Session ID '${searchId}' not found.`);
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

  // UPDATED EXPORT PDF FUNCTION
  const exportPDF = () => {
    // 1. Save the original tab title
    const originalTitle = document.title;
    
    // 2. Build the filename-friendly string (e.g., acme-inc-ds-9997)
    const company = deal.accountName ? deal.accountName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'company';
    const id = deal.sessionId ? deal.sessionId.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'id';
    const fileName = `${company}-${id}`;
    
    // 3. Temporarily change the document title
    document.title = fileName;
    
    // 4. Trigger the print dialog (the browser will use our new title as the filename)
    window.print();
    
    // 5. Instantly change it back so the user doesn't notice
    document.title = originalTitle;
  };

  const tabs = ['overview', 'stakeholders', 'value', 'meddpicc'];
  const getTabLabel = (tab) => {
    if (tab === 'value') return 'Value Framework';
    if (tab === 'meddpicc') return 'MEDDPICC';
    return tab;
  };

  // DYNAMIC HEADER TITLE GENERATOR
  const getDynamicTitle = () => {
    if (deal.accountName || deal.useCase) {
      const account = deal.accountName || '';
      const useCase = deal.useCase ? `${deal.useCase} ` : '';
      return `${account} ${useCase}Deal Sheet`.trim();
    }
    return 'SA Deal Sheets';
  };

  return (
    <div className="app-wrapper" style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#011e2b', minHeight: '100vh', width: '100vw', margin: 0, boxSizing: 'border-box', overflowX: 'hidden', color: '#fff' }}>
      <GlobalReset />
      
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', fontSize: '13px', opacity: 0.8 }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s ease-in-out' }} onMouseOver={e => e.target.style.color = '#01ed64'} onMouseOut={e => e.target.style.color = '#fff'}>
          ← Home
        </a>
      </div>

      {/* DYNAMIC HEADER */}
      <h2 className="print-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '0 0 20px 0', textAlign: 'center' }}>
        🤝 {getDynamicTitle()} <span className="no-print" style={{ color: '#01ed64' }}>Framework</span>
      </h2>

      <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'flex-start', maxWidth: '1200px', margin: '0 auto' }} className="print-area">
        
        {/* LEFT COLUMN */}
        <div className="no-print" style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={panelStyle} className="sa-panel">
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

              <button onClick={saveSession} disabled={isSaving} style={{ width: '100%', padding: '10px', backgroundColor: '#00ed64', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: isSaving ? 'wait' : 'pointer' }}>
                {isSaving ? '⏳ Saving & Analyzing...' : '💾 Save Deal Sheet'}
              </button>
              
              <button onClick={exportPDF} style={{ width: '100%', padding: '10px', backgroundColor: '#023430', color: '#00ed64', border: '1px solid #00ed64', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>📄 Export to PDF</button>
              <button onClick={generatePOV} disabled={isGenerating} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: isGenerating ? '#777' : '#c471ed', border: `1px solid ${isGenerating ? '#777' : '#c471ed'}`, borderRadius: '4px', cursor: isGenerating ? 'wait' : 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                {isGenerating ? '🧠 Generating...' : '🧠 Generate AI POV'}
              </button>
            </div>
          </div>

          <div style={panelStyle} className="sa-panel">
            <h3 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>Deal Health</h3>
            <p style={{ fontSize: '13px', color: '#e0e0e0', marginTop: 0 }}>Stakeholders Mapped: <strong style={{color: '#00ed64'}}>{deal.stakeholders.length}</strong></p>
            <p style={{ fontSize: '13px', color: '#e0e0e0', marginBottom: '15px' }}>Value Framework: {deal.afterScenario ? <strong style={{color: '#00ed64'}}>Defined</strong> : <strong style={{color: '#ff4d4d'}}>Incomplete</strong>}</p>
            
            <div style={{ backgroundColor: 'rgba(0, 237, 100, 0.08)', borderLeft: '4px solid #00ed64', padding: '15px', borderRadius: '0 6px 6px 0', marginTop: '20px' }}>
              <strong style={{ fontSize: '12px', color: '#00ed64', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🤖 Force Management AI
              </strong>
              <div style={{ fontSize: '13.5px', color: '#f1f5f9', marginTop: '10px', lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {deal.healthInsights ? formatMarkdown(deal.healthInsights) : <span style={{ fontStyle: 'italic', opacity: 0.6 }}>Save deal to generate insights...</span>}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT MAIN AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                style={{ flex: 1, padding: '10px', backgroundColor: activeTab === tab ? '#00ed64' : '#023430', color: activeTab === tab ? '#000' : '#00ed64', border: activeTab === tab ? 'none' : '1px solid #00684a', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'capitalize' }}
              >
                {getTabLabel(tab)}
              </button>
            ))}
          </div>

          <div style={{...panelStyle, padding: '25px'}} className="sa-panel">
            
            {/* TAB 1: OVERVIEW */}
            <div className="print-tab" style={{ display: activeTab === 'overview' ? 'block' : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginBottom: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div><label style={labelStyle}>Account Name</label><input className="sa-input" name="accountName" value={deal.accountName} onChange={handleInputChange} placeholder="e.g. Acme Corp" /></div>
                  <div><label style={labelStyle}>ARR Amount ($)</label><input type="text" className="sa-input" name="arr" value={deal.arr} onChange={handleInputChange} placeholder="100000" /></div>
                  <div><label style={labelStyle}>Salesforce Opp</label><input className="sa-input" name="opportunityLink" value={deal.opportunityLink} onChange={handleInputChange} placeholder="https://mongodb.my.salesforce.com/..." /></div>
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
            </div>

            {/* TAB 2: STAKEHOLDERS */}
            <div className="print-tab" style={{ display: activeTab === 'stakeholders' ? 'block' : 'none' }}>
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
            </div>

            {/* TAB 3: VALUE FRAMEWORK */}
            <div className="print-tab" style={{ display: activeTab === 'value' ? 'block' : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <h3 style={{ color: '#00ed64', margin: '0 0 15px 0' }}>Value Framework</h3>
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

                <div>
                  <label style={labelStyle}>Success Metrics</label>
                  <textarea className="sa-input" style={{ minHeight: '80px', resize: 'vertical' }} name="successMetrics" value={deal.successMetrics} onChange={handleInputChange} placeholder="How will we measure that the requirements are met? (e.g. Latency < 10ms, TCO reduced by 30%)" />
                </div>
              </div>
            </div>

            {/* TAB 4: MEDDPICC */}
            <div className="print-tab" style={{ display: activeTab === 'meddpicc' ? 'block' : 'none' }}>
              <h3 style={{ color: '#00ed64', margin: '0 0 20px 0', borderBottom: '1px solid #555', paddingBottom: '10px' }}>MEDDPICC Qualification</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div><label style={labelStyle}>M - Metrics</label><textarea className="sa-input" style={{ minHeight: '90px', resize: 'vertical' }} name="meddpiccMetrics" value={deal.meddpiccMetrics} onChange={handleInputChange} placeholder="Quantifiable justification; economic impact..." /></div>
                <div><label style={labelStyle}>E - Economic Buyer</label><textarea className="sa-input" style={{ minHeight: '90px', resize: 'vertical' }} name="meddpiccEconomicBuyer" value={deal.meddpiccEconomicBuyer} onChange={handleInputChange} placeholder="Who can approve and move budget? Have we met them?..." /></div>
                <div><label style={labelStyle}>D - Decision Criteria</label><textarea className="sa-input" style={{ minHeight: '90px', resize: 'vertical' }} name="meddpiccDecisionCriteria" value={deal.meddpiccDecisionCriteria} onChange={handleInputChange} placeholder="What are the technical and business requirements?..." /></div>
                <div><label style={labelStyle}>D - Decision Process</label><textarea className="sa-input" style={{ minHeight: '90px', resize: 'vertical' }} name="meddpiccDecisionProcess" value={deal.meddpiccDecisionProcess} onChange={handleInputChange} placeholder="Who are the stakeholders, influencers, and approvers?..." /></div>
                <div><label style={labelStyle}>P - Paper Process</label><textarea className="sa-input" style={{ minHeight: '90px', resize: 'vertical' }} name="meddpiccPaperProcess" value={deal.meddpiccPaperProcess} onChange={handleInputChange} placeholder="What documentation is needed to book the order? Timelines?..." /></div>
                <div><label style={labelStyle}>I - Identified Pain</label><textarea className="sa-input" style={{ minHeight: '90px', resize: 'vertical' }} name="meddpiccIdentifiedPain" value={deal.meddpiccIdentifiedPain} onChange={handleInputChange} placeholder="What is driving the prospect to change? How acute is it?..." /></div>
                <div><label style={labelStyle}>C - Champion</label><textarea className="sa-input" style={{ minHeight: '90px', resize: 'vertical' }} name="meddpiccChampion" value={deal.meddpiccChampion} onChange={handleInputChange} placeholder="Who has power, influence, and something to gain?..." /></div>
                <div><label style={labelStyle}>C - Competition</label><textarea className="sa-input" style={{ minHeight: '90px', resize: 'vertical' }} name="meddpiccCompetition" value={deal.meddpiccCompetition} onChange={handleInputChange} placeholder="Who are you competing against? (Often 'business as usual')..." /></div>
              </div>
            </div>

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
             {/* THE FIX: Formatting the text and applying the new typography */}
             <div style={{ 
                whiteSpace: 'pre-wrap', 
                lineHeight: '1.7', 
                fontSize: '14.5px', 
                color: '#e2e8f0',
                marginBottom: '20px', 
                fontFamily: 'Inter, sans-serif' 
              }}>
                {formatMarkdown(aiPov)}
             </div>
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