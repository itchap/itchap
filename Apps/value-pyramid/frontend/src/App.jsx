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
    .tier-label {
      position: absolute; left: -20px; top: 50%;
      transform: translateY(-50%) translateX(-100%);
      font-size: 0.9rem; text-transform: uppercase;
      font-weight: 800; letter-spacing: 1.5px;
      color: #888;
    }
  `}</style>
);

const App = () => {
  const [activeTier, setActiveTier] = useState(null);

  const theme = {
    bg: '#011e2b',
    accent: '#00ed64',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    border: '#333'
  };

  // Content mapped EXACTLY from image_1.png structure
  const pyramidData = [
    {
      id: 6,
      title: "Company Mission",
      label: "Mission",
      subtitle: "The Ultimate 'Why'",
      detail: "Define the high-level, aspirational reason the company exists. SAs must tie their project directly to enabling this long-term vision.",
      examples: ["To be the premier provider of...", "Innovate for a sustainable future"],
      width: '15%', height: '80px', taper: '15px'
    },
    {
      id: 5,
      title: "Corporate Objectives & Industry Drivers",
      label: "Objectives",
      subtitle: "Focus Shared by the Leadership",
      detail: "Quantifiable goals set by the board (e.g., ESG, ROCE). This is what leadership is measured against. Your project must help them 'check these boxes'.",
      examples: ["Cut CO₂ by 47% by 2030", "Achieve 12% ROCE"],
      width: '30%', height: '90px', taper: '20px'
    },
    {
      id: 4,
      title: "Business Strategy",
      label: "Strategy",
      subtitle: "Actionable Context to Achieve Objectives",
      detail: "The 'How'. How the company will deliver on objectives. (e.g., diversifying revenue, focus on premium markets).",
      examples: ["Focus on Premium Tyres", "Diversify: 30% Non-Tyre Revenue"],
      width: '45%', height: '100px', taper: '25px'
    },
    {
      id: 3,
      title: "Technology Initiatives",
      label: "Technology",
      subtitle: "Projects to Implement the Strategies",
      detail: "Where we live. The actual technology projects (Cloud Migration, Consolidation, App Dev) funded to enable the business strategies.",
      examples: ["Cloud Migration of Payments", "Consolidate fragmented datastores"],
      width: '60%', height: '110px', taper: '30px'
    },
    {
      id: 2,
      title: "Critical Capabilities and Challenges",
      label: "Challenges",
      subtitle: "Obstacles to Achieving the Strategy",
      detail: "Where Business and Technical worlds collide. Define the blockers preventing progress on initiatives. This is the PAIN.",
      examples: ["Legacy Infrastructure inhibiting scale", "Operational Overhead/Complexity"],
      width: '75%', height: '120px', taper: '35px'
    },
    {
      id: 1,
      title: "Your Company's Solutions",
      label: "Solutions",
      subtitle: "Mapping Capabilities to Resolve Issues",
      detail: "The foundation. SAs must PROVE their product resolves the critical challenges, which unblocks the technological initiatives, which enables the strategy, and ultimately fulfills the mission.",
      examples: ["Atlas as-a-Service, not IaaS", "Global, Multi-Region Clusters"],
      width: '90%', height: '130px', taper: '0px'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <GlobalStyles />
      
      {/* HEADER (Optional title/logo section from top right of image_1.png) */}
      <div style={{ textAlign: 'center', marginBottom: '60px', width: '100%', maxWidth: '1000px', display: 'flex', justifyContent: 'center' }}>
        <div>
          <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', fontWeight: '800' }}>
            The <span style={{ color: theme.accent }}>Executive</span> Value Pyramid
          </h1>
          <p style={{ color: '#bbb', fontSize: '1.1rem' }}>Click a tier to structure the deep business value.</p>
        </div>
      </div>

      {/* PYRAMID CANVAS */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        {pyramidData.map((tier) => (
          <div
            key={tier.id}
            onClick={() => setActiveTier(tier)}
            style={{
              width: tier.width,
              height: tier.height,
              clipPath: `polygon(${tier.taper} 0%, calc(100% - ${tier.taper}) 0%, 100% 100%, 0% 100%)`,
              backgroundColor: tier.id === 6 ? theme.accent : 'rgba(255,255,255,0.03)',
              border: `1px solid ${tier.id === 6 ? theme.accent : theme.border}`,
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              cursor: 'pointer', transition: 'all 0.4s ease', position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)', color: tier.id === 6 ? '#000' : '#fff',
              zIndex: 1,
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 0 40px ${theme.accent}33`;
              e.currentTarget.style.borderColor = theme.accent;
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
              if(tier.id !== 6) e.currentTarget.style.borderColor = theme.border;
            }}
          >
            {/* The side-aligned label seen in image_1.png */}
            <div className="tier-label" style={{ color: tier.id === 6 ? theme.accent : '#888' }}>
              {tier.label}
            </div>

            <span style={{ fontWeight: '800', fontSize: '1.1rem', textAlign: 'center', padding: '0 10px' }}>
              {tier.title}
            </div>
            <span style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '5px' }}>
              {tier.subtitle}
            </div>
          </div>
        ))}
        
        {/* CREDIBILITY INDICATORS (Mapping from image_1.png) */}
        <div style={{ position: 'absolute', right: '-100px', top: '15%', height: '50%', width: '100px', borderLeft: '2px dashed #444', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '15px', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <div>Business<br/>Credibility</div>
        </div>
        <div style={{ position: 'absolute', right: '-100px', bottom: '15%', height: '40%', width: '100px', borderLeft: '2px dashed #444', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '15px', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <div>Technical<br/>Credibility</div>
        </div>
      </div>

      {/* EXPLODED DETAIL MODAL */}
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
              backgroundColor: '#021a25', border: `2px solid ${theme.accent}`, borderRadius: '32px',
              padding: '60px', maxWidth: '800px', width: '100%', boxShadow: `0 0 100px ${theme.accent}22`,
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', top: '20px', left: '40px', color: theme.accent, textTransform: 'uppercase', fontWeight: '900', letterSpacing: '2px', fontSize: '0.9rem' }}>
              {activeTier.label} TIER
            </div>

            <h2 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#fff' }}>
              {activeTier.title}
            </h2>
            <h4 style={{ fontSize: '1rem', color: theme.accent, marginBottom: '30px', fontWeight: 'bold' }}>
              ({activeTier.subtitle})
            </h4>
            
            <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#eee', marginBottom: '40px', paddingLeft: '20px', borderLeft: `2px solid ${theme.accent}33` }}>
              {activeTier.detail}
            </p>

            <div style={{ marginTop: '30px', textAlign: 'left', padding: '30px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
              <h5 style={{ margin: '0 0 15px 0', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>Examples:</h5>
              <ul style={{ color: '#ccc', fontSize: '1.1rem', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                {activeTier.examples.map(ex => <li key={ex}>{ex}</li>)}
              </ul>
            </div>

            <button 
              onClick={() => setActiveTier(null)}
              style={{ position: 'absolute', top: '20px', right: '40px', backgroundColor: 'transparent', color: theme.accent, border: `1px solid ${theme.accent}`, padding: '10px 20px', borderRadius: '8px', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer', textTransform: 'uppercase' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;