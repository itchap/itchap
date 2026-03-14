import React, { useState } from 'react';

const GlobalStyles = () => (
  <style>{`
    html, body {
      margin: 0; padding: 0;
      background-color: #011e2b;
      font-family: 'Inter', sans-serif;
      color: #fff;
      overflow: hidden;
    }
    .pyramid-tier {
      clip-path: polygon(var(--tw) 0%, calc(100% - var(--tw)) 0%, 100% 100%, 0% 100%);
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 4px;
      position: relative;
    }
    .pyramid-tier:hover {
      filter: brightness(1.2);
      transform: scale(1.02);
      z-index: 10;
    }
    .tier-top {
      clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
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

  const pyramidData = [
    {
      id: 3,
      title: "Inspirational Value",
      subtitle: "The Pinnacle: Vision & Partnership",
      detail: "This level transcends functionality and emotion to inspire customers. You become a true partner helping them envision a better future, guiding long-term success, and strategic collaboration.",
      taper: "0%", // Top tier is a triangle, not a trapezoid
      height: '140px',
      width: '200px',
      isTop: true
    },
    {
      id: 2,
      title: "Emotional Value",
      subtitle: "The Connection: Trust & Rapport",
      detail: "Moving up the pyramid, Emotional Value creates trust, satisfaction, and loyalty. It involves building rapport, storytelling through success stories, and a customer-centric approach that taps into desires and aspirations.",
      taper: "15%",
      height: '120px',
      width: '450px',
    },
    {
      id: 1,
      title: "Functional Value",
      subtitle: "The Foundation: Solving Core Problems",
      detail: "The base of the pyramid. It addresses the fundamental requirements. Demonstrating Functional Value means showcasing product knowledge, effective problem-solving, and clear communication on how you meet essential needs.",
      taper: "18%",
      height: '120px',
      width: '700px',
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '50px' }}>
      <GlobalStyles />
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>
          THE <span style={{ color: theme.accent }}>VALUE PYRAMID</span>
        </h1>
        <p style={{ color: '#888', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginTop: '10px' }}>
          Based on SalesByLobo Framework
        </p>
      </div>

      {/* THE PYRAMID CANVAS */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {pyramidData.map((tier) => (
          <div
            key={tier.id}
            onClick={() => setActiveTier(tier)}
            className={`pyramid-tier ${tier.isTop ? 'tier-top' : ''}`}
            style={{
              '--tw': tier.taper,
              width: tier.width,
              height: tier.height,
              backgroundColor: tier.id === 3 ? theme.accent : 'rgba(0, 237, 100, 0.1)',
              border: tier.id === 3 ? 'none' : `1px solid ${theme.accent}44`,
              color: tier.id === 3 ? '#000' : '#fff',
              boxShadow: tier.id === 3 ? `0 0 30px ${theme.accent}66` : 'none'
            }}
          >
            <div style={{ textAlign: 'center', padding: '0 20px' }}>
              <div style={{ fontWeight: '900', fontSize: tier.id === 3 ? '1.2rem' : '1.4rem', textTransform: 'uppercase' }}>{tier.title}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '5px', fontWeight: 'bold' }}>{tier.subtitle}</div>
            </div>
            
            {/* Glow effect inside trapezoid */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, transparent, ${theme.accent}11)`,
              pointerEvents: 'none'
            }} />
          </div>
        ))}
      </div>

      {/* LEGEND BOXES */}
      <div style={{ display: 'flex', gap: '40px', marginTop: '40px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#888', fontSize: '0.8rem' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: theme.accent }}></div> HIGH DIFFERENTIATION
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#888', fontSize: '0.8rem' }}>
            <div style={{ width: '12px', height: '12px', border: `1px solid ${theme.accent}` }}></div> COMMODITY ZONE
         </div>
      </div>

      {/* DETAIL OVERLAY */}
      {activeTier && (
        <div 
          onClick={() => setActiveTier(null)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(1, 30, 43, 0.9)',
            backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: theme.cardBg, border: `2px solid ${theme.accent}`,
              borderRadius: '24px', padding: '50px', maxWidth: '600px', textAlign: 'center',
              boxShadow: `0 0 50px ${theme.accent}33`
            }}
          >
            <h2 style={{ color: theme.accent, fontSize: '2.5rem', marginBottom: '10px' }}>{activeTier.title}</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#ddd' }}>{activeTier.detail}</p>
            <button 
              onClick={() => setActiveTier(null)}
              style={{
                marginTop: '30px', backgroundColor: theme.accent, color: '#000',
                border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              CLOSE DETAILS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;