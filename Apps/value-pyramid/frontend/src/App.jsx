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
    accent: '#02ec64', // Signature green
    textMain: '#fff',
    textSub: '#bbb'
  };

  // DATA SOURCE
  const pyramidData = [
    {
      id: 5,
      title: "The Mission",
      subtitle: "The Ultimate 'Why'",
      flex: 2.2, 
      isTop: true,
      textWidth: '220px', 
      guidance: {
        theory: "The Mission defines the high-level, aspirational reason the company exists. It is the north star for the entire organization.",
        action: "As an SA, you must map your overarching technical vision to support this mission. If your solution doesn't ultimately serve the mission, it is expendable.",
        outcome: "Examples: 'To be the premier provider of sustainable mobility...' or 'Innovate to lead the industry in ESG standards.'"
      }
    },
    {
      id: 4,
      title: "Corporate Objectives",
      subtitle: "Focus Shared by the leadership team and organisation",
      flex: 1.2,
      textWidth: '380px', 
      guidance: {
        theory: "These are the quantifiable goals set by the board (e.g., ESG metrics, ROCE). This is what the C-suite is measured against and compensated for.",
        action: "Identify the top 2-3 company-wide metrics from their annual report. Frame your project's technical ROI entirely around moving these specific numbers.",
        outcome: "Examples: 'Advance Sustainable Materials: 40% renewable by 2030' or 'Cut CO2 emissions by 47.2% by 2030.'"
      }
    },
    {
      id: 3,
      title: "Business Strategies",
      subtitle: "Strategic actionable priorities to achieve defined objectives",
      flex: 1.2,
      textWidth: '520px', 
      guidance: {
        theory: "This defines HOW the company will deliver on its overarching objectives. It dictates where budgets are allocated across business units.",
        action: "Map the specific business units you are selling to directly into these strategic pillars to ensure your deal has executive sponsorship.",
        outcome: "Examples: 'Focus on premium and speciality tires' or 'Revenue Diversification: 30% non-tire sales.'"
      }
    },
    {
      id: 2,
      title: "Technology Initiatives",
      subtitle: "Projects to implement the strategies",
      flex: 1.2,
      textWidth: '680px', 
      guidance: {
        theory: "These are the actual, funded technology projects designed to enable the business strategies. This is typically where IT and Engineering live.",
        action: "Position your solution as the primary accelerator for these specific funded initiatives. Do not pitch features; pitch initiative acceleration.",
        outcome: "Examples: 'Cloud Migration of Core Payments & Wallets' or 'Data Layer Consolidation & Governance Upgrade.'"
      }
    },
    {
      id: 1,
      title: "Critical Challenges",
      subtitle: "Obstacles and issues to achieving strategy and required capabilities",
      flex: 1.2,
      textWidth: '820px', 
      guidance: {
        theory: "This is where the Business and Technical worlds collide. These are the specific blockers preventing progress on the funded initiatives.",
        action: "Perform deep discovery to uncover the technical limitations and immediately tie them to the business impact of a failed strategy.",
        outcome: "Examples: 'Legacy Infrastructure & Fragmented Cloud Adoption' or 'Architectural Fragmentation hindering horizontal scale.'"
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
      paddingBottom: '20px', 
      color: theme.textMain, 
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <GlobalReset />

      {/* NAV BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', fontSize: '12px', opacity: 0.7 }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none' }}>← Home</a>
        <a href="https://github.com/itchap/itchap/tree/main/Apps/value-pyramid/frontend" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>View Source on GitHub ↗</a>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '60px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: '800' }}>
            💎 The <span style={{ color: theme.accent }}>Value Pyramid</span>
          </h1>
          <p style={{ color: theme.textSub, fontSize: '1.1rem' }}>
            Taking a Business View to elevate technical credibility. This framework helps SAs position their technical solutions<br/>with executive stakeholders in a way that directly supports the business's strategic objectives.
          </p>
        </div>


        {/* MAIN CARD CONTAINER (Increased height to allow for a taller pyramid) */}
        <div style={{ 
          backgroundColor: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: '32px', 
          width: '100%',
          maxWidth: '1400px', 
          minHeight: '750px', // INCREASED height for breathing room
          position: 'relative', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.6)',
          marginBottom: '20px',
          padding: '40px 0'
        }}>
          
          {/* THE PYRAMID WRAPPER (Taller, maintaining base width) */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', height: '680px' /* INCREASED from 520px */ }}>
            
            {/* THE PERFECT TRIANGLE CLIP-PATH */}
            <div style={{
              width: '100%',
              height: '100%',
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px', 
              backgroundColor: 'transparent'
            }}>
              {pyramidData.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setActiveNode(tier)}
                  style={{
                    flex: tier.flex,
                    width: '100%',
                    backgroundColor: tier.isTop ? theme.accent : 'rgba(2, 236, 100, 0.05)',
                    color: tier.isTop ? '#000' : '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: tier.isTop ? 'flex-end' : 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    paddingBottom: tier.isTop ? '25px' : '0' // Slightly more padding since it's taller
                  }}
                  onMouseOver={e => {
                    if(!tier.isTop) e.currentTarget.style.backgroundColor = 'rgba(2, 236, 100, 0.15)';
                  }}
                  onMouseOut={e => {
                    if(!tier.isTop) e.currentTarget.style.backgroundColor = 'rgba(2, 236, 100, 0.05)';
                  }}
                >
                  <div style={{ maxWidth: tier.textWidth, textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {tier.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.85, fontWeight: '500' }}>
                      {tier.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* GREEN SIDE BRACKET: BUSINESS CREDIBILITY */}
            <div style={{ 
              position: 'absolute', right: '-120px', top: '0', height: '64.5%', width: '15px', 
              borderLeft: `2px dashed ${theme.accent}`, borderTop: `2px dashed ${theme.accent}`, borderBottom: `2px dashed ${theme.accent}`, 
              display: 'flex', alignItems: 'center' 
            }}>
              <span style={{ color: theme.accent, fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1px', position: 'absolute', left: '25px', width: '120px' }}>
                BUSINESS<br/>CREDIBILITY
              </span>
            </div>
            
            {/* GREEN SIDE BRACKET: TECHNICAL CREDIBILITY */}
            <div style={{ 
              position: 'absolute', right: '-120px', bottom: '0', height: '34.5%', width: '15px', 
              borderLeft: `2px dashed ${theme.accent}`, borderTop: `2px dashed ${theme.accent}`, borderBottom: `2px dashed ${theme.accent}`, 
              display: 'flex', alignItems: 'center' 
            }}>
              <span style={{ color: theme.accent, fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1px', position: 'absolute', left: '25px', width: '120px' }}>
                TECHNICAL<br/>CREDIBILITY
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* MODAL UI */}
      {activeNode && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(1, 30, 43, 0.98)', backdropFilter: 'blur(15px)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ 
            backgroundColor: '#021a25', 
            border: `2px solid ${theme.accent}`, 
            padding: '40px', 
            borderRadius: '24px', 
            maxWidth: '750px', 
            width: '90%', 
            boxShadow: `0 0 100px rgba(2, 236, 100, 0.12)` 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ color: theme.accent, margin: 0, fontSize: '2.5rem', fontWeight: '900', textTransform: 'uppercase' }}>{activeNode.title}</h3>
                <span style={{ color: theme.accent, opacity: 0.5, fontWeight: 'bold' }}>TIER 0{activeNode.id}</span>
            </div>

            <div style={{ display: 'grid', gap: '25px', textAlign: 'left' }}>
                <div>
                  <h4 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>The Concept</h4>
                  <p style={{ color: theme.textSub, margin: 0, lineHeight: '1.6' }}>{activeNode.guidance.theory}</p>
                </div>
                
                <div>
                  <h4 style={{ color: theme.accent, margin: '0 0 8px 0', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Strategic Alignment</h4>
                  <p style={{ color: '#fff', margin: 0, lineHeight: '1.6' }}>{activeNode.guidance.action}</p>
                </div>

                <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', borderLeft: `4px solid ${theme.accent}` }}>
                  <h4 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Discovery Examples</h4>
                  <p style={{ color: theme.accent, margin: 0, fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.6' }}>{activeNode.guidance.outcome}</p>
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
                letterSpacing: '1px',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              Return to Pyramid
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;