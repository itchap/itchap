import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// const API_URL = 'http://localhost:5001/api/skills';
const API_URL = '/api/skills';

// GLOBAL RESET
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
    @keyframes bounceTooltip {
      0%, 100% { transform: translate(-50%, 0); }
      50% { transform: translate(-50%, -6px); }
    }
  `}</style>
);

const SkillItem = ({ skill, handleStop }) => {
  const nodeRef = useRef(null);
  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: skill.x, y: skill.y }}
      onStop={(e, data) => handleStop(e, data, skill._id)}
    >
      <div ref={nodeRef} style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 10 }}>
        <div style={{
          transform: 'translate(-50%, -50%)', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold',
          backgroundColor: '#00ed64', color: 'black', borderRadius: '12px', cursor: 'grab', userSelect: 'none',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)', whiteSpace: 'nowrap'
        }}>
          {skill.name}
        </div>
      </div>
    </Draggable>
  );
};

function App() {
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  
  const [sessionId, setSessionId] = useState('');
  const [resumeIdInput, setResumeIdInput] = useState('');
  const [showSessionId, setShowSessionId] = useState(false); 
  
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [expandedCats, setExpandedCats] = useState({});
  const [hasExpandedCat, setHasExpandedCat] = useState(false); // Tracks if they've expanded a category
  
  // Custom PDF Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportParams, setExportParams] = useState({ name: '', categories: '' });

  const matrixRef = useRef(null); 

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const savedSessionId = localStorage.getItem('matrixSessionId');
        if (savedSessionId) {
          try {
            const res = await axios.get(`${API_URL}/session/${savedSessionId}`);
            setSessionId(res.data.sessionId);
            setSkills(res.data.skills);
            return; 
          } catch (e) {}
        }
        const res = await axios.post(`${API_URL}/init`);
        setSessionId(res.data.sessionId);
        setSkills(res.data.skills);
        localStorage.setItem('matrixSessionId', res.data.sessionId);
      } catch (error) { console.error("Failed to init session", error); }
    };
    initializeSession();
  }, []);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName || !sessionId) return;
    const formattedName = newSkillName.toLowerCase();
    try {
      const res = await axios.post(API_URL, { name: formattedName, sessionId, category: 'Custom' });
      setSkills([...skills, res.data]);
      setNewSkillName('');
      setExpandedCats(prev => ({ ...prev, Custom: true }));
      setHasExpandedCat(true); // Dismisses tooltip if they add a custom skill
    } catch (error) { console.error("Failed to add skill", error); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSkills(skills.filter(s => s._id !== id));
    } catch (error) { console.error("Failed to delete skill", error); }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const skillId = e.dataTransfer.getData("skillId");
    if (!skillId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;

    try {
      const res = await axios.put(`${API_URL}/${skillId}`, { x, y, status: 'plotted' });
      setSkills(skills.map(s => s._id === skillId ? res.data : s));
    } catch (error) { console.error("Error placing skill", error); }
  };

  const handleDragOver = (e) => e.preventDefault(); 

  const handleStop = async (e, data, id) => {
    if (Math.abs(data.x) > 385 || Math.abs(data.y) > 385) {
      try {
        const res = await axios.put(`${API_URL}/${id}`, { x: 0, y: 0, status: 'unplotted' });
        setSkills(skills.map(s => s._id === id ? res.data : s));
      } catch (err) {}
    } else {
      try {
        const res = await axios.put(`${API_URL}/${id}`, { x: data.x, y: data.y, status: 'plotted' });
        setSkills(skills.map(skill => skill._id === id ? res.data : skill));
      } catch (error) {}
    }
  };

  const handleResume = async () => {
    if (!resumeIdInput.trim()) return;
    try {
      const res = await axios.get(`${API_URL}/session/${resumeIdInput.trim()}`);
      setSessionId(res.data.sessionId);
      setSkills(res.data.skills);
      localStorage.setItem('matrixSessionId', res.data.sessionId);
      setResumeIdInput('');
      setShowSessionId(false);
      alert("Session restored successfully!");
    } catch (error) { alert("Session not found."); }
  };

  const handleReset = async () => {
    if(!window.confirm("WARNING: Are you sure you want to reset?")) return;
    try {
      const res = await axios.post(`${API_URL}/reset/${sessionId}`);
      setSkills(res.data.skills);
    } catch (error) {}
  };

  const executeExport = async () => {
    if (!matrixRef.current) return;

    let safeName = exportParams.name.trim().toLowerCase().replace(/\s+/g, '_');
    if (!safeName) safeName = "mongodb_sa"; 

    let safeCategories = exportParams.categories.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
    if (safeCategories.endsWith('_')) safeCategories = safeCategories.slice(0, -1);
    if (safeCategories.startsWith('_')) safeCategories = safeCategories.slice(1);

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const dateString = `${dd}${mm}${yyyy}`;

    const categoryString = safeCategories ? `_${safeCategories}` : "";
    const fileName = `${safeName}${categoryString}_${dateString}_skillsmatrix.pdf`;

    try {
      setShowExportModal(false); 
      
      const canvas = await html2canvas(matrixRef.current, { backgroundColor: '#011e2b', scale: 2 });
      const pdf = new jsPDF('l', 'mm', 'a4'); 
      const margin = 10;
      const imgHeight = pdf.internal.pageSize.getHeight() - (margin * 2); 
      const imgWidth = (canvas.width * imgHeight) / canvas.height;
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (pdf.internal.pageSize.getWidth() - imgWidth) / 2, margin, imgWidth, imgHeight);
      pdf.save(fileName);
      
      setExportParams({ name: '', categories: '' });
    } catch (error) { 
      console.error("Error generating PDF", error); 
    }
  };

  const handleAnalyze = async () => {
    const plotted = skills.filter(s => s.status === 'plotted');
    if (plotted.length === 0) return alert("Please plot some skills first!");
    setIsAnalyzing(true);
    try {
      const res = await axios.post(`${API_URL}/analyze`, { skills: plotted });
      setAnalysis(res.data.analysis);
    } catch (error) { alert("Failed to get analysis."); } 
    finally { setIsAnalyzing(false); }
  };

  const toggleCat = (cat) => {
    setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
    setHasExpandedCat(true); // Dismiss tooltip forever once they interact
  };

  const plottedSkills = skills.filter(s => s.status === 'plotted');
  const unplottedSkills = skills.filter(s => s.status !== 'plotted');
  
  const categorizedSkills = unplottedSkills.reduce((acc, skill) => {
    const cat = skill.category || 'Custom';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categoryOrder = ["PreSales", "Sales", "Database", "Architecture", "IT", "Development", "SoftSkills", "Custom"];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#011e2b', minHeight: '100vh', width: '100vw', margin: 0, boxSizing: 'border-box', overflowX: 'hidden', color: '#fff' }}>
      <GlobalReset />
      {/* SUBTLE NAVIGATION BAR */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '10px 20px', 
        fontSize: '13px',
        fontFamily: 'sans-serif',
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
        <a 
          href="https://github.com/itchap/itchap/tree/main/Apps/skill-passion" 
          target="_blank" 
          rel="noreferrer" 
          style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s ease-in-out' }} 
          onMouseOver={e => e.target.style.color = '#01ed64'} 
          onMouseOut={e => e.target.style.color = '#fff'}
        >
          View Source on GitHub ↗
        </a>
      </div>

      <h2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '0 0 20px 0' }}>
        🌱 Solution Architect <span style={{ color: '#01ed64' }}>Skill / Passion</span> Matrix
      </h2>
      
      <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'flex-start' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Skills/Tasks</h3>
            
            <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
              <input type="text" placeholder="Add custom skill..." value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} style={{ padding: '8px', width: '100%', boxSizing: 'border-box', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '4px' }} />
              <button type="submit" style={{ padding: '8px', cursor: 'pointer', backgroundColor: '#00ed64', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '4px' }}>Add Skill</button>
            </form>

            {/* RELATIVE WRAPPER FOR TOOLTIP (Placed outside the scroll container to prevent clipping) */}
            <div style={{ position: 'relative' }}>
              <p style={{ fontSize: '11px', color: '#bbb', marginBottom: '10px' }}>Drag tags into the matrix. Toss them out to return them.</p>
              
              {!hasExpandedCat && (
                <div style={{
                  position: 'absolute',
                  top: '20px', // Pushes it down so it hovers right over the first button
                  left: '50%',
                  transform: 'translateX(-50%)',
                  animation: 'bounceTooltip 1.5s infinite ease-in-out',
                  backgroundColor: '#00ed64',
                  color: '#000',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0,237,100,0.3)',
                  zIndex: 50,
                  pointerEvents: 'none' // Allows clicks to pass through to the button beneath it
                }}>
                  👋 Click a category to expand!
                  
                  {/* The little down arrow */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-5px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: `6px solid #00ed64`
                  }}></div>
                </div>
              )}
            </div>
            
            {/* THIS IS THE SCROLL CONTAINER THAT CLIPPED THE OLD TOOLTIP */}
            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
              {categoryOrder.map((cat) => {
                if (!categorizedSkills[cat] || categorizedSkills[cat].length === 0) return null;

                return (
                  <div key={cat} style={{ marginBottom: '8px' }}>
                    <button 
                      onClick={() => toggleCat(cat)} 
                      style={{ width: '100%', textAlign: 'left', padding: '8px', backgroundColor: '#023430', color: '#00ed64', border: '1px solid #00684a', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}
                    >
                      {cat} <span>{expandedCats[cat] ? '▼' : '▶'}</span>
                    </button>
                    
                    {expandedCats[cat] && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px 5px' }}>
                        {categorizedSkills[cat].map(skill => (
                          <div key={skill._id} draggable onDragStart={(e) => e.dataTransfer.setData("skillId", skill._id)} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#00ed64', color: 'black', borderRadius: '12px', padding: '4px 8px', fontSize: '12px', fontWeight: 'bold', cursor: 'grab', userSelect: 'none' }}>
                            <span style={{ marginRight: '8px' }}>{skill.name}</span>
                            <button onClick={() => handleDelete(skill._id)} style={{ background: 'transparent', border: 'none', color: '#011e2b', cursor: 'pointer', padding: '0', fontSize: '14px', fontWeight: 'bold' }} title="Delete Skill">&times;</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>Session Controls</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', gap: '5px' }}>
                <input type="text" placeholder="Enter Session ID..." value={resumeIdInput} onChange={(e) => setResumeIdInput(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '4px', border: 'none', fontSize: '12px' }} />
                <button onClick={handleResume} style={{ padding: '8px', backgroundColor: '#00684a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Resume</button>
              </div>

              <button onClick={() => setShowSessionId(!showSessionId)} style={{ width: '100%', padding: '10px', backgroundColor: '#023430', color: '#00ed64', border: '1px solid #00ed64', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                {showSessionId ? 'Hide Session ID' : 'Save for Later (Get ID)'}
              </button>

              {showSessionId && (
                <div style={{ padding: '10px', backgroundColor: '#011e2b', border: '1px dashed #00ed64', borderRadius: '4px' }}>
                  <p style={{ fontSize: '12px', color: '#00ed64', margin: '0 0 5px 0', fontWeight: 'bold' }}>Your Unique ID:</p>
                  <p style={{ fontSize: '11px', color: '#bbb', margin: '0 0 10px 0', lineHeight: '1.4' }}>Save this somewhere safe to restore your board.</p>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <input type="text" readOnly value={sessionId} onClick={(e) => e.target.select()} style={{ flex: 1, padding: '6px', fontSize: '11px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#fff', color: '#000' }} />
                    <button onClick={() => { navigator.clipboard.writeText(sessionId); alert('Copied!'); }} style={{ padding: '6px 10px', backgroundColor: '#00ed64', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Copy</button>
                  </div>
                </div>
              )}

              <button onClick={handleAnalyze} disabled={isAnalyzing} style={{ width: '100%', padding: '10px', backgroundColor: isAnalyzing ? '#555' : '#00684a', color: '#fff', fontWeight: 'bold', border: '1px solid #00ed64', borderRadius: '4px', cursor: isAnalyzing ? 'wait' : 'pointer' }}>
                {isAnalyzing ? '🧠 AI is thinking...' : '🧠 Get AI Career Analysis'}
              </button>
              
              <button onClick={() => setShowExportModal(true)} style={{ width: '100%', padding: '10px', backgroundColor: '#00ed64', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Export to PDF
              </button>
              
              <button onClick={handleReset} style={{ width: '100%', padding: '10px', backgroundColor: '#ff4d4d', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                Reset Session
              </button>
            </div>
          </div>
        </div>

        {/* MIDDLE: MATRIX */}
        <div ref={matrixRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', backgroundColor: '#011e2b' }}>
          <div style={{ fontWeight: 'bold', color: '#02ec64', marginBottom: '8px', fontSize: '16px' }}>High Passion</div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', color: '#02ec64', marginRight: '15px', whiteSpace: 'nowrap', fontSize: '16px' }}>Low Skill</div>
            <div onDragOver={handleDragOver} onDrop={handleDrop} style={{ position: 'relative', width: '770px', height: '770px', border: '2px solid #555' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '50%', backgroundColor: '#00684a' }} /> 
                <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '50%', backgroundColor: '#023430' }} /> 
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '50%', height: '50%', backgroundColor: '#f2c5ed' }} /> 
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '50%', height: '50%', backgroundColor: '#a6ffeb' }} /> 
              </div>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '2px dashed #777', zIndex: 1 }} />
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, borderLeft: '2px dashed #777', zIndex: 1 }} />
              
              {[...Array(11)].map((_, i) => (
                <div key={`x-${i}`} style={{ position: 'absolute', left: `${i * 10}%`, top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                  <div style={{ width: '2px', height: '10px', backgroundColor: '#555' }}></div>
                  <span style={{ fontSize: '12px', color: '#222', marginTop: '4px', backgroundColor: 'rgba(255, 255, 255, 0.85)', padding: '0 4px', borderRadius: '3px', fontWeight: 'bold' }}>{i}</span>
                </div>
              ))}
              {[...Array(11)].map((_, i) => {
                if (i === 5) return null; 
                return (
                  <div key={`y-${i}`} style={{ position: 'absolute', bottom: `${i * 10}%`, left: '50%', transform: 'translate(-50%, 50%)', display: 'flex', alignItems: 'center', zIndex: 2 }}>
                    <span style={{ fontSize: '12px', color: '#222', marginRight: '4px', backgroundColor: 'rgba(255, 255, 255, 0.85)', padding: '0 4px', borderRadius: '3px', fontWeight: 'bold' }}>{i}</span>
                    <div style={{ width: '10px', height: '2px', backgroundColor: '#555' }}></div>
                  </div>
                );
              })}
              {plottedSkills.map((skill) => (
                <SkillItem key={skill._id} skill={skill} handleStop={handleStop} />
              ))}
            </div>
            <div style={{ fontWeight: 'bold', color: '#02ec64', marginLeft: '15px', whiteSpace: 'nowrap', fontSize: '16px' }}>High Skill</div>
          </div>
          <div style={{ fontWeight: 'bold', color: '#02ec64', marginTop: '8px', fontSize: '16px' }}>Low Passion</div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>Quadrant Legend</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#023430', borderRadius: '4px', flexShrink: 0, marginTop: '3px', border: '1px solid #777' }}></div>
                <div style={{ fontSize: '13px', color: '#e0e0e0', lineHeight: '1.4' }}><strong style={{ display: 'block', color: '#fff', marginBottom: '2px' }}>Top Right:</strong>Things I'm great at and love doing</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#00684a', borderRadius: '4px', flexShrink: 0, marginTop: '3px', border: '1px solid #777' }}></div>
                <div style={{ fontSize: '13px', color: '#e0e0e0', lineHeight: '1.4' }}><strong style={{ display: 'block', color: '#fff', marginBottom: '2px' }}>Top Left:</strong>Things I'm not great at but love doing or would love to do</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#a6ffeb', borderRadius: '4px', flexShrink: 0, marginTop: '3px', border: '1px solid #777' }}></div>
                <div style={{ fontSize: '13px', color: '#e0e0e0', lineHeight: '1.4' }}><strong style={{ display: 'block', color: '#fff', marginBottom: '2px' }}>Bottom Right:</strong>Things I'm great at but I don't really like doing</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '16px', height: '16px', backgroundColor: '#f2c5ed', borderRadius: '4px', flexShrink: 0, marginTop: '3px', border: '1px solid #777' }}></div>
                <div style={{ fontSize: '13px', color: '#e0e0e0', lineHeight: '1.4' }}><strong style={{ display: 'block', color: '#fff', marginBottom: '2px' }}>Bottom Left:</strong>Things I'm not great and really don't enjoy doing</div>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>Why Use This?</h3>
            <p style={{ fontSize: '13px', color: '#e0e0e0', lineHeight: '1.5', marginTop: 0 }}>This framework helps you visualize your responsibilities and optimize your career trajectory in technical sales.</p>
            <ul style={{ fontSize: '13px', color: '#e0e0e0', paddingLeft: '20px', lineHeight: '1.5', marginBottom: 0 }}>
              <li style={{ marginBottom: '8px' }}><strong>Alignment:</strong> Maximize time spent in your "Zone of Genius" (Top-Right).</li>
              <li style={{ marginBottom: '8px' }}><strong>Growth:</strong> Discover new passions to develop (Top-Left).</li>
              <li style={{ marginBottom: '8px' }}><strong>Burnout:</strong> Identify tasks that drain your energy (Bottom-Right).</li>
              <li><strong>Delegate/Drop:</strong> Pinpoint tasks you should automate, delegate, or avoid entirely (Bottom-Left).</li>
            </ul>
          </div>
        </div>
      </div>

      {analysis && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#011e2b', border: '2px solid #00ed64', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto', color: '#e0e0e0', boxShadow: '0 10px 30px rgba(0, 237, 100, 0.2)' }}>
             <h3 style={{ color: '#00ed64', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <img src="https://www.rw-designer.com/icon-image/10455-256x256x32.png" alt="logo" style={{ height: '20px' }}/>
               SA Career Insights
             </h3>
             <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px', marginBottom: '20px' }}>{analysis}</div>
             <button onClick={() => setAnalysis(null)} style={{ width: '100%', padding: '10px', backgroundColor: '#00ed64', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close Insights</button>
          </div>
        </div>
      )}

      {/* Custom PDF Export Modal */}
      {showExportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#011e2b', border: '2px solid #00ed64', padding: '30px', borderRadius: '8px', maxWidth: '400px', width: '100%', color: '#e0e0e0', boxShadow: '0 10px 30px rgba(0, 237, 100, 0.2)' }}>
             <h3 style={{ color: '#00ed64', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>Export Matrix to PDF</h3>
             
             <div style={{ marginBottom: '15px' }}>
               <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#00ed64', fontWeight: 'bold' }}>Your Name:</label>
               <input 
                 type="text" 
                 placeholder="e.g., Peter Smith" 
                 value={exportParams.name} 
                 onChange={e => setExportParams({...exportParams, name: e.target.value})} 
                 style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#fff', color: '#000', boxSizing: 'border-box' }} 
               />
             </div>

             <div style={{ marginBottom: '25px' }}>
               <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px', color: '#00ed64', fontWeight: 'bold' }}>Categories Used (Optional):</label>
               <input 
                 type="text" 
                 placeholder="e.g., PreSales, Database" 
                 value={exportParams.categories} 
                 onChange={e => setExportParams({...exportParams, categories: e.target.value})} 
                 style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#fff', color: '#000', boxSizing: 'border-box' }} 
               />
             </div>
             
             <div style={{ display: 'flex', gap: '10px' }}>
               <button onClick={() => setShowExportModal(false)} style={{ flex: 1, padding: '10px', backgroundColor: 'transparent', color: '#fff', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
               <button onClick={executeExport} style={{ flex: 1, padding: '10px', backgroundColor: '#00ed64', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Download PDF</button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;