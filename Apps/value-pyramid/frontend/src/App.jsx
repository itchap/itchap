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

  const pyramidData = [
    {
      id: 5,
      title: "Corporate Objectives",
      subtitle: "Industry Drivers & Leadership Vision",
      detail: "This is the 'Why' behind the budget. Focus on global trends like Digital Transformation, ESG, or Market Expansion. To win here, you must speak the language of the CEO.",
      width: '20%',
      color: '#00ed64'
    },
    {
      id: 4,
      title: "Business Strategy",
      subtitle: "Actionable Context & Objectives",
      detail: "How the company intends to win. Are they cutting costs or driving innovation? Your solution must be the vehicle that drives this specific strategy.",
      width: '35%',
      color: '#00d65a'
    },
    {
      id: 3,
      title: "Business Initiatives",
      subtitle: "Projects to Implement Strategy",
      detail: "The actual programs being funded. If your project isn't tied to an initiative, it's a 'nice-to-have' and will likely be cut.",
      width: '50%',
      color: '#00bd4f'
    },
    {
      id: 2,
      title: "Critical Capabilities",
      subtitle: "Obstacles & Technical Challenges",
      detail: "Where Business Credibility meets Technical Credibility. Define the specific capabilities they lack that prevent them from reaching their initiatives.",
      width: '65%',
      color: '#00a344'
    },
    {
      id: 1,
      title: "Your Solutions",
      subtitle: "Mapping to Capabilities & Resolving Issues",
      detail: "The foundation. Your product is not a set of features; it is the resolution to the obstacles identified above. This is where you prove it works.",
      width: '80%',
      color: '#008a3a'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <GlobalStyles />
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', fontWeight: '800' }}>
          Value <span style={{ color: theme.accent }}>Pyramid</span>
        </h1>
        <p style={{ color: '#bbb', fontSize: '1.1rem' }}>Click a tier to explode the business value detail.</p>
      </div>

      {/* PYRAMID CONTAINER */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '900px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '10px'
      }}>
        {pyramidData.map((tier) => (
          <div
            key={tier.id}
            onClick={() => setActiveTier(tier)}
            style={{
              width: tier.width,
              height: '80px',
              backgroundColor: tier.id === 5 ? theme.accent : 'rgba(255,255,255,0.03)',
              border: `1px solid ${tier.id === 5 ? theme.accent : theme.border}`,
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              color: tier.id === 5 ? '#000' : '#fff'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 0 40px ${theme.accent}33`;
              e.currentTarget.style.borderColor = theme.accent;
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
              if(tier.id !== 5) e.currentTarget.style.borderColor = theme.border;
            }}
          >
            <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{tier.title}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{tier.subtitle}</span>
          </div>
        ))}

        {/* INDICATORS (CREDIBILITY) */}
        <div style={{ 
          position: 'absolute', 
          right: '-120px', 
          top: '20%', 
          bottom: '20%', 
          width: '100px', 
          borderLeft: '2px dashed #444',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          paddingLeft: '15px',
          fontSize: '0.8rem',
          color: '#888',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          <div>Business Credibility</div>
          <div>Technical Credibility</div>
        </div>
      </div>

      {/* EXPLODED DETAIL VIEW (OVERLAY) */}
      {activeTier && (
        <div 
          onClick={() => setActiveTier(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(1, 30, 43, 0.95)',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#021a25',
              border: `2px solid ${theme.accent}`,
              borderRadius: '32px',
              padding: '60px 40px',
              maxWidth: '700px',
              width: '100%',
              textAlign: 'center',
              boxShadow: `0 0 100px ${theme.accent}22`,
              position: 'relative'
            }}
          >
            <div style={{ 
              position: 'absolute', 
              top: '-30px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              backgroundColor: theme.accent,
              color: '#000',
              padding: '10px 25px',
              borderRadius: '50px',
              fontWeight: '900',
              fontSize: '0.9rem'
            }}>
              TIER {activeTier.id}
            </div>

            <h2 style={{ fontSize: '3rem', margin: '0 0 15px 0', color: theme.accent }}>{activeTier.title}</h2>
            <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '30px', opacity: 0.8 }}>{activeTier.subtitle}</h4>
            
            <div style={{ 
              height: '2px', 
              width: '60px', 
              backgroundColor: theme.accent, 
              margin: '0 auto 30px auto',
              opacity: 0.5 
            }} />

            <p style={{ 
              fontSize: '1.25rem', 
              lineHeight: '1.8', 
              color: '#eee',
              marginBottom: '40px'
            }}>
              {activeTier.detail}
            </p>

            <button 
              onClick={() => setActiveTier(null)}
              style={{
                backgroundColor: theme.accent,
                color: '#000',
                border: 'none',
                padding: '18px 50px',
                borderRadius: '12px',
                fontWeight: '900',
                fontSize: '1rem',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              Back to Pyramid
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;