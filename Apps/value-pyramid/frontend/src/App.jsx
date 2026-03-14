import React, { useState } from 'react';

// GLOBAL RESET - Kills the phantom white lines and adds the bounce animation
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
      50% { transform: translate(-50%, -8px); }
    }
  `}</style>
);

function App() {
  const [activeNode, setActiveNode] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);

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
        theory: "The Mission is the ultimate 'Why' behind a company's existence—the aspirational north star driving their market strategy. For SAs, this represents the highest level of executive context.",
        action: "Elevate your engagement from a technical evaluation to a strategic partnership. You must draw a direct line from your platform's capabilities to this core mission. Solutions that only solve IT problems get commoditized; solutions that enable the company's ultimate mission secure executive sponsorship.",
        outcome: "Mapping Example: If the mission is 'To be the premier provider of sustainable mobility,' your outcome is showing how modernizing their infrastructure enables real-time analytics that directly reduce their carbon footprint."
      }
    },
    {
      id: 4,
      title: "Corporate Objectives",
      subtitle: "Focus shared by the leadership team and organisation",
      flex: 1.2,
      textWidth: '380px', 
      guidance: {
        theory: "These are the high-level, quantifiable goals set by the board and shareholders (e.g., revenue growth, margin expansion, ESG metrics). This is exactly what the C-suite is actively measured against and compensated for.",
        action: "Review their annual reports, 10-K filings, or recent earnings calls to identify their top 2-3 metrics. To capture executive attention, you must anchor your technical ROI directly to moving the needle on these specific KPIs.",
        outcome: "Mapping Example: If the objective is to 'Cut operational costs by 15% by 2026,' your outcome is showing how consolidating fragmented legacy systems onto your platform permanently eliminates crippling maintenance and licensing overhead."
      }
    },
    {
      id: 3,
      title: "Business Strategies",
      subtitle: "Strategic actionable priorities to achieve defined objectives",
      flex: 1.2,
      textWidth: '520px', 
      guidance: {
        theory: "This defines HOW the organization plans to execute and deliver on its corporate objectives. Business strategies dictate exactly where budget, headcount, and resources are allocated across the enterprise.",
        action: "Map your technical capabilities directly to these strategic pillars. To secure funding and bypass IT budget constraints, you must prove that your solution is the most efficient vehicle to execute their chosen strategy.",
        outcome: "Mapping Example: If the strategy is 'Revenue Diversification through digital subscriptions,' demonstrate how your platform accelerates time-to-market for new digital products, transforming IT from a cost center into a revenue driver."
      }
    },
    {
      id: 2,
      title: "Technology Initiatives",
      subtitle: "Projects to implement the strategies",
      flex: 1.2,
      textWidth: '680px', 
      guidance: {
        theory: "These are the active, funded technology projects (e.g., Cloud Migration, GenAI Adoption, Core Modernization) designed to enable the business strategy. This is the SA's primary operating theater.",
        action: "Resist the urge to just pitch technical features. Instead, position your platform as the ultimate de-risker and accelerator for these specific funded initiatives. Prove how you ensure the project is delivered on time and at scale.",
        outcome: "Mapping Example: If the initiative is 'Cloud-Native Modernization,' validate how your distributed architecture natively supports their microservices transition, dramatically reducing the friction and risk of their cloud journey."
      }
    },
    {
      id: 1,
      title: "Critical Challenges",
      subtitle: "Obstacles and issues to achieving strategy and required capabilities",
      flex: 1.2,
      textWidth: '820px', 
      guidance: {
        theory: "This is the foundation of your deal. These are the specific technical and operational bottlenecks currently preventing the customer from executing their technology initiatives—and therefore threatening the business strategy.",
        action: "Conduct deep, empathetic discovery to uncover the root cause of these limitations. Your job is to quantify the pain: translating technical debt, scale limits, or operational silos into unacceptable business risk.",
        outcome: "Mapping Example: If the challenge is 'Architectural fragmentation preventing horizontal scale,' prove how your unified platform eliminates these silos, resolving the bottleneck and instantly unblocking their strategic growth."
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

      {/* SUBTLE NAVIGATION BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', fontSize: '13px', opacity: 0.8 }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = theme.accent} onMouseOut={e => e.target.style.color = '#fff'}>
          ← Home
        </a>
        <a href="https://github.com/itchap/itchap/tree/main/Apps/value-pyramid/frontend" target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = theme.accent} onMouseOut={e => e.target.style.color = '#fff'}>
          View Source on GitHub ↗
        </a>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
      
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '20px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: '800' }}>
            💎 The <span style={{ color: theme.accent }}>Value Pyramid</span>
          </h1>
          <p style={{ color: theme.textSub, fontSize: '1.1rem' }}>
            Taking a Business View to elevate technical credibility. This framework helps SAs position their technical solutions<br/>with executive stakeholders in a way that directly supports the business's strategic objectives.
          </p>
        </div>

        {/* MAIN CARD CONTAINER */}
        <div style={{ 
          backgroundColor: theme.cardBg, 
          border: `1px solid ${theme.border}`, 
          borderRadius: '32px', 
          width: '100%',
          maxWidth: '1400px', 
          minHeight: '700px', 
          position: 'relative', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.6)',
          marginBottom: '20px',
          padding: '40px 0'
        }}>
          
          {/* THE PYRAMID WRAPPER */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', height: '680px' }}>
            
            {/* BOUNCING POINTER */}
            {!hasInteracted && (
              <div style={{
                position: 'absolute',
                top: '-45px',
                left: '50%',
                animation: 'bounceTooltip 1.5s infinite ease-in-out',
                backgroundColor: theme.accent,
                color: '#000',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '900',
                whiteSpace: 'nowrap',
                boxShadow: `0 4px 15px rgba(2, 236, 100, 0.4)`,
                zIndex: 50,
                cursor: 'default',
                pointerEvents: 'none'
              }}>
                👋 Start here: Click a tier to explore!
                
                {/* The little down arrow */}
                <div style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `6px solid ${theme.accent}`
                }}></div>
              </div>
            )}

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
                  onClick={() => {
                    setActiveNode(tier);
                    setHasInteracted(true);
                  }}
                  style={{
                    flex: tier.flex,
                    width: '100%',
                    backgroundColor: tier.isTop ? theme.accent : 'rgba(2, 236, 100, 0.05)',
                    color: tier.isTop ? '#011e2c' : '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: tier.isTop ? 'flex-end' : 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    paddingBottom: tier.isTop ? '25px' : '0'
                  }}
                  onMouseOver={e => {
                    if(!tier.isTop) {
                      e.currentTarget.style.backgroundColor = 'rgba(2, 236, 100, 0.15)';
                      e.currentTarget.style.filter = `drop-shadow(0 0 15px rgba(2, 236, 100, 0.5))`;
                    }
                  }}
                  onMouseOut={e => {
                    if(!tier.isTop) {
                      e.currentTarget.style.backgroundColor = 'rgba(2, 236, 100, 0.05)';
                      e.currentTarget.style.filter = 'none';
                    }
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

      {/* MODAL UI WITH FADED BACKGROUND FIX */}
      {activeNode && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(1, 30, 43, 0.65)', /* Changed from 0.98 to 0.65 so background shows through */
          backdropFilter: 'blur(15px)', 
          zIndex: 100, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
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