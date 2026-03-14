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
      margin-top: 50px;
    }
    .pyramid-tier {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      text-align: center;
      margin-bottom: 2px; /* Small gap between layers */
      transition: transform 0.3s ease, filter 0.3s ease, background-color 0.3s ease;
      /* Dynamic Clip Path: width starts at var(--w) at top and extends withvar(--taper) */
      clip-path: polygon(var(--taper) 0%, calc(100% - var(--taper)) 0%, 100% 100%, 0% 100%);
    }
    .tier-label {
      font-weight: 800; font-size: 1.1rem; text-transform: uppercase; padding: 0 20px;
    }
    .tier-sub {
      font-size: 0.7rem; opacity: 0.8; margin-top: 5px;
    }

    /* Standard Tier (Translucent base with glowing border) */
    .tier-base {
      background-color: rgba(0, 237, 100, 0.04);
      border-left: 1px solid rgba(0, 237, 100, 0.3);
      border-right: 1px solid rgba(0, 237, 100, 0.3);
      border-bottom: 1px solid rgba(0, 237, 100, 0.3);
      color: #fff;
    }
    .tier-base:hover {
      background-color: rgba(0, 237, 100, 0.1);
      filter: drop-shadow(0 0 10px rgba(0, 237, 100, 0.3));
    }

    /* Top Tier (Pulsing Solid Green) */
    .tier-top {
      clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
      background-color: #00ed64;
      color: #000;
      box-shadow: 0 0 30px rgba(0, 237, 100, 0.5);
    }
    .tier-top:hover {
      transform: translateY(-5px);
      box-shadow: 0 0 50px rgba(0, 237, 100, 0.8);
    }

    /* Side Gauges (Mapped from reference image) */
    .gauge-container {
      position: absolute; right: -120px; display: flex; flex-direction: column; justify-content: space-around;
      border-left: 2px dashed #444; padding-left: 15px; text-transform: uppercase; font-size: 0.8rem; color: #888;
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

  // Content mapped EXACTLY from previous image but geometry updated for triangle
  const pyramidData = [
    {
      id: 6,
      title: "Company Mission",
      subtitle: "The Ultimate 'Why'",
      detail: "Define the high-level, aspirational reason the company exists. SAs must tie their project directly to enabling this long-term vision.",
      examples: ["To be the premier provider of...", "Innovate for a sustainable future"],
      width: '180px', height: '100px', taper: '0%', isTop: true
    },
    {
      id: 5,
      title: "Corporate Objectives & Industry Drivers",
      subtitle: "Focus Shared by the Leadership",
      detail: "Quantifiable goals set by the board (e.g., ESG, ROCE). This is what leadership is measured against. Your project must help them 'check these boxes'.",
      examples: ["Cut CO₂ by 47% by 2030", "Achieve 12.5% ROCE by 2027"],
      width: '320px', height: '80px', taper: '21.8%'
    },
    {
      id: 4,
      title: "Business Strategy",
      subtitle: "Actionable Context to Achieve Objectives",
      detail: "The 'How'. How the company will deliver on objectives. (e.g., diversifying revenue, focus on premium markets).",
      examples: ["Focus on premium and speciality tires", "Diversification: 30% non-tire sales"],
      width: '460px', height: '80px', taper: '15.2%'
    },
    {
      id: 3,
      title: "Technology Initiatives",
      label: "Technology",
      subtitle: "Projects to Implement the Strategies",
      detail: "Where we live. The actual technology projects (Cloud Migration, Consolidation, App Dev) funded to enable the business strategies.",
      examples: ["Cloud Migration of Core Payments", "Data Layer Consolidation & Governance"],
      width: '600px', height: '80px', taper: '11.6%'
    },
    {
      id: 2,
      title: "Critical Capabilities and Challenges",
      subtitle: "Obstacles to Achieving the Strategy",
      detail: "Where Business and Technical worlds collide. Define the blockers preventing progress on initiatives.",
      examples: ["Legacy Infrastructure inhibiting scale", "Architectural Fragmentation & Complexity"],
      width: '740px', height: '80px', taper: '9.4%'
    },
    {
      id: 1,
      title: "Your Company's Solutions",
      subtitle: "Mapping Capabilities to Resolve Issues",
      detail: "The foundation. SAs must PROVE their product resolves the critical challenges, which unblocks the technological initiatives.",
      examples: ["Atlas Global Clusters", "Automated Scalability & Operational Efficiency"],
      width: '880px', height: '80px', taper: '7.9%'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '100px' }}>
      <GlobalStyles />
      
      {/* Header (Inspired by previous image) */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>
          THE <span style={{ color: theme.accent }}>VALUE PYRAMID</span>
        </h1>
        <p style={{ color: '#bbb', fontSize: '1rem' }}>Taking a Business View...</p>
      </div>

      {/* THE PYRAMID CANVAS (Triangle Geometry) */}
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
            <div className="tier-label">{tier.title}</div>
            <div className="tier-sub">{tier.subtitle}</div>
          </div>
        ))}
        
        {/* SIDE GAUGE 1: BUSINESS CREDIBILITY */}
        <div className="gauge-container" style={{ top: '25%', height: '40%' }}>
          <div>Business<br/>Credibility</div>
        </div>
        
        {/* SIDE GAUGE 2: TECHNICAL CREDIBILITY */}
        <div className="gauge-container" style={{ bottom: '20%', height: '30%' }}>
          <div>Technical<br/>Credibility</div>
        </div>
      </div>

      {/* DETAIL OVERLAY */}
      {activeTier && (
        <div 
          onClick={() => setActiveTier(null)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(1, 30, 43, 0.95)',
            backdropFilter: 'blur(15px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: theme.cardBg, border: `2px solid ${theme.accent}`,
              borderRadius: '24px', padding: '60px', maxWidth: '800px', width: '100%', position: 'relative'
            }}
          >
            <h2 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#fff' }}>{activeTier.title}</h2>
            <h4 style={{ color: theme.accent, marginBottom: '30px' }}>{activeTier.subtitle}</h4>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#eee', marginBottom: '30px' }}>{activeTier.detail}</p>

            <div style={{ textAlign: 'left', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: `1px solid ${theme.cardBg}33` }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#888' }}>KEY EXAMPLES:</h5>
              <ul style={{ color: '#ccc', fontSize: '1rem', lineHeight: '1.8' }}>
                {activeTier.examples.map(ex => <li key={ex}>{ex}</li>)}
              </ul>
            </div>

            <button 
              onClick={() => setActiveTier(null)}
              style={{ position: 'absolute', top: '20px', right: '40px', backgroundColor: theme.accent, color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;