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
    .pyramid-canvas {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 10px;
      width: 100vw;
    }
    .pyramid-tier {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      text-align: center;
      margin-bottom: 6px; 
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      clip-path: polygon(var(--taper) 0%, calc(100% - var(--taper)) 0%, 100% 100%, 0% 100%);
    }
    .tier-label {
      font-weight: 800; 
      font-size: 1.45rem; 
      text-transform: uppercase; 
      padding: 0 50px;
      line-height: 1.1;
      letter-spacing: -0.5px;
    }
    .tier-sub {
      font-size: 0.95rem; 
      opacity: 0.85; 
      margin-top: 10px;
      font-weight: 500;
      max-width: 80%;
    }
    .tier-base {
      background-color: rgba(0, 237, 100, 0.05);
      border: 1px solid rgba(0, 237, 100, 0.2);
    }
    .tier-base:hover {
      background-color: rgba(0, 237, 100, 0.15);
      transform: scale(1.015);
      z-index: 10;
    }
    .tier-top {
      clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
      background-color: #00ed64;
      color: #000;
    }
    .tier-top:hover {
      transform: translateY(-8px) scale(1.03);
    }
    .gauge-container {
      position: absolute; 
      right: 12%; 
      display: flex; 
      flex-direction: column; 
      justify-content: space-around;
      border-left: 2px dashed rgba(255,255,255,0.15); 
      padding-left: 20px; 
      text-transform: uppercase; 
      font-size: 0.85rem; 
      color: #777;
      letter-spacing: 1.5px;
    }
  `}</style>
);

const App = () => {
  const [activeTier, setActiveTier] = useState(null);

  const pyramidData = [
    {
      id: 5,
      title: "Company Mission",
      subtitle: "The Ultimate 'Why'",
      detail: "Define the high-level, aspirational reason the company exists.",
      examples: ["To be the premier provider of sustainable mobility...", "Innovate to lead the industry in ESG standards"],
      width: '420px', height: '220px', taper: '0%', isTop: true
    },
    {
      id: 4,
      title: "Corporate Objectives",
      subtitle: "Focus Shared by the leadership team and organisation",
      detail: "Quantifiable goals set by the board (e.g., ESG, ROCE).",
      examples: ["Advance Sustainable Materials: 40% renewable by 2030", "Sustainability: Cut CO2 emissions by 47.2% by 2030"],
      width: '680px', height: '130px', taper: '20%'
    },
    {
      id: 3,
      title: "Business Strategies",
      subtitle: "Strategic actionable priorities to achieve defined objectives",
      detail: "How the company will deliver on its overarching objectives.",
      examples: ["Focus on premium and speciality tires", "Diversification: 30% non-tire sales"],
      width: '940px', height: '130px', taper: '14%'
    },
    {
      id: 2,
      title: "Technology Initiatives",
      subtitle: "Projects to implement the strategies",
      detail: "Actual technology projects funded to enable the business strategies.",
      examples: ["Cloud Migration of Core Payments & Wallets", "Data Layer Consolidation & Governance Upgrade"],
      width: '1200px', height: '130px', taper: '11%'
    },
    {
      id: 1,
      title: "Critical Challenges",
      subtitle: "Obstacles and issues to achieving strategy and required capabilities",
      detail: "Where Business and Technical worlds collide. Define the blockers.",
      examples: ["Legacy Infrastructure & Fragmented Cloud Adoption", "Architectural Fragmentation hindering horizontal scale"],
      width: '1460px', height: '130px', taper: '9%'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <GlobalStyles />
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '3.2rem', fontWeight: '950', margin: 0 }}>
          THE <span style={{ color: '#00ed64' }}>VALUE PYRAMID</span>
        </h1>
        <p style={{ color: '#888', fontSize: '1.2rem', marginTop: '8px' }}>Taking a Business View...</p>
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
            <div className="tier-label" style={{ marginTop: tier.isTop ? '60px' : '0' }}>{tier.title}</div>
            <div className="tier-sub">{tier.subtitle}</div>
          </div>
        ))}
        
        <div className="gauge-container" style={{ top: '25%', height: '40%' }}>
          <div style={{ fontWeight: '800' }}>Business<br/>Credibility</div>
        </div>
        
        <div className="gauge-container" style={{ bottom: '10%', height: '35%' }}>
          <div style={{ fontWeight: '800' }}>Technical<br/>Credibility</div>
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
              backgroundColor: '#021a25', border: `1px solid #00ed64`,
              borderRadius: '24px', padding: '60px', maxWidth: '900px', width: '90%'
            }}
          >
            <h2 style={{ fontSize: '2.8rem', color: '#00ed64', marginBottom: '10px' }}>{activeTier.title}</h2>
            <p style={{ fontSize: '1.3rem', color: '#eee', marginBottom: '40px' }}>{activeTier.detail}</p>
            <div style={{ padding: '30px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
              <h5 style={{ margin: '0 0 15px 0', color: '#00ed64', textTransform: 'uppercase' }}>Discovery Examples:</h5>
              <ul style={{ color: '#ccc', fontSize: '1.15rem', lineHeight: '1.8' }}>
                {activeTier.examples.map(ex => <li key={ex}>{ex}</li>)}
              </ul>
            </div>
            <button 
              onClick={() => setActiveTier(null)}
              style={{ marginTop: '40px', backgroundColor: '#00ed64', color: '#000', border: 'none', padding: '16px 40px', borderRadius: '10px', fontWeight: '900', cursor: 'pointer' }}
            >
              BACK TO PYRAMID
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;