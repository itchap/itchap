import React, { useState } from 'react';

const GlobalStyles = () => (
  <style>{`
    html, body {
      margin: 0; padding: 0;
      background-color: #011e2b;
      font-family: 'Inter', sans-serif;
      color: #fff;
      overflow-x: hidden;
    }
    /* Removes any accidental vertical lines from parent containers */
    #root, .app-container {
      border: none !important;
      outline: none !important;
    }
    .pyramid-canvas {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
      width: 100vw; /* Ensure it takes full width to remove side lines */
    }
    .pyramid-tier {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      text-align: center;
      margin-bottom: 4px; 
      transition: all 0.3s ease;
      clip-path: polygon(var(--taper) 0%, calc(100% - var(--taper)) 0%, 100% 100%, 0% 100%);
    }
    .tier-label {
      font-weight: 800; 
      font-size: 1.3rem; /* Increased font size */
      text-transform: uppercase; 
      padding: 0 40px;
      line-height: 1.2;
    }
    .tier-sub {
      font-size: 0.85rem; 
      opacity: 0.8; 
      margin-top: 8px;
      font-style: italic;
    }

    .tier-base {
      background-color: rgba(0, 237, 100, 0.04);
      border: 1px solid rgba(0, 237, 100, 0.2);
      color: #fff;
    }
    .tier-base:hover {
      background-color: rgba(0, 237, 100, 0.12);
      transform: scale(1.02);
      z-index: 10;
    }

    .tier-top {
      clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
      background-color: #00ed64;
      color: #000;
    }
    .tier-top:hover {
      transform: translateY(-5px) scale(1.02);
    }

    .gauge-container {
      position: absolute; 
      right: 10%; /* Adjusted for larger scale */
      display: flex; 
      flex-direction: column; 
      justify-content: space-around;
      border-left: 2px dashed rgba(255,255,255,0.2); 
      padding-left: 20px; 
      text-transform: uppercase; 
      font-size: 0.9rem; 
      color: #666;
      letter-spacing: 1px;
    }
  `}</style>
);

const App = () => {
  const [activeTier, setActiveTier] = useState(null);

  const theme = {
    bg: '#011e2b',
    accent: '#00ed64',
    cardBg: '#021a25',
  };

  // Expanded dimensions to handle the text better
  const pyramidData = [
    {
      id: 6,
      title: "Company Mission",
      subtitle: "The Ultimate 'Why'",
      detail: "Define the high-level, aspirational reason the company exists.",
      examples: ["To be the premier provider of...", "Innovate for a sustainable future"],
      width: '280px', height: '140px', taper: '0%', isTop: true
    },
    {
      id: 5,
      title: "Corporate Objectives & Industry Drivers",
      subtitle: "Focus Shared by the Leadership team and organization",
      detail: "Quantifiable goals set by the board (e.g., ESG, ROCE).",
      examples: ["Cut CO₂ by 47% by 2030", "Achieve 12.5% ROCE by 2027"],
      width: '500px', height: '110px', taper: '22%'
    },
    {
      id: 4,
      title: "Business Strategy",
      subtitle: "Actionable context to achieve defined objectives",
      detail: "How the company will deliver on objectives.",
      examples: ["Focus on premium and speciality tires", "Diversification: 30% non-tire sales"],
      width: '720px', height: '110px', taper: '15.5%'
    },
    {
      id: 3,
      title: "Technology Initiatives",
      subtitle: "Projects to implement the strategies",
      detail: "Actual technology projects funded to enable the business strategies.",
      examples: ["Cloud Migration of Core Payments", "Data Layer Consolidation"],
      width: '940px', height: '110px', taper: '12%'
    },
    {
      id: 2,
      title: "Critical Capabilities and Challenges",
      subtitle: "Obstacles/issues to achieving Strategy and Required Capabilities",
      detail: "Where Business and Technical worlds collide. Define the blockers.",
      examples: ["Legacy Infrastructure inhibiting scale", "Architectural Fragmentation"],
      width: '1160px', height: '110px', taper: '9.5%'
    },
    {
      id: 1,
      title: "Your Company's Solutions",
      subtitle: "Mapped to critical capabilities designed to resolve issues",
      detail: "SAs must PROVE their product resolves the critical challenges.",
      examples: ["Atlas Global Clusters", "Automated Scalability"],
      width: '1380px', height: '110px', taper: '8%'
    }
  ];

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
      <GlobalStyles />
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>
          THE <span style={{ color: theme.accent }}>VALUE PYRAMID</span>
        </h1>
        <p style={{ color: '#888', fontSize: '1.1rem', marginTop: '10px', fontWeight: '500' }}>Taking a Business View...</p>
      </div>

      <div className="pyramid-canvas">
        {pyramidData.map((tier) => (
          <div
            key={tier.id}
            onClick={() => setActiveTier(tier)}
            className={`pyramid-tier ${tier.isTop ? 'tier-top' : 'tier-base'}`}
            style={{
              '--taper': tier.taper,
              width: tier.width,
              height: tier.height,
            }}
          >
            <div className="tier-label" style={{ marginTop: tier.isTop ? '30px' : '0' }}>{tier.title}</div>
            <div className="tier-sub">{tier.subtitle}</div>
          </div>
        ))}
        
        <div className="gauge-container" style={{ top: '28%', height: '35%' }}>
          <div style={{ fontWeight: 'bold' }}>Business<br/>Credibility</div>
        </div>
        
        <div className="gauge-container" style={{ bottom: '15%', height: '30%' }}>
          <div style={{ fontWeight: 'bold' }}>Technical<br/>Credibility</div>
        </div>
      </div>

      {activeTier && (
        <div 
          onClick={() => setActiveTier(null)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(1, 30, 43, 0.98)',
            backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: theme.cardBg, border: `1px solid ${theme.accent}`,
              borderRadius: '20px', padding: '60px', maxWidth: '850px', width: '90%'
            }}
          >
            <h2 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: theme.accent }}>{activeTier.title}</h2>
            <p style={{ fontSize: '1.2rem', color: '#eee', marginBottom: '30px', lineHeight: '1.6' }}>{activeTier.detail}</p>
            <div style={{ textAlign: 'left', padding: '25px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
              <h5 style={{ margin: '0 0 15px 0', color: theme.accent, textTransform: 'uppercase' }}>Strategic Examples:</h5>
              <ul style={{ color: '#ccc', fontSize: '1.1rem', lineHeight: '1.8' }}>
                {activeTier.examples.map(ex => <li key={ex}>{ex}</li>)}
              </ul>
            </div>
            <button 
              onClick={() => setActiveTier(null)}
              style={{ marginTop: '40px', backgroundColor: theme.accent, color: '#000', border: 'none', padding: '15px 40px', borderRadius: '8px', fontWeight: '900', cursor: 'pointer' }}
            >
              RETURN TO STRATEGY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;