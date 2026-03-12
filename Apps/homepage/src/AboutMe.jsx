import React from 'react';

function AboutMe() {
  const theme = {
    bg: '#011e2b',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    border: '#333',
    accent: '#00ed64',
    textMain: '#fff',
    textSub: '#bbb',
  };

  const coreValues = [
    { icon: '🤝', title: 'Service', desc: 'I place huge importance on serving and caring for others with quality and value.' },
    { icon: '⭐', title: 'Excellence', desc: 'I strive to always pursue the highest level of performance in every aspect of the role.' },
    { icon: '🔗', title: 'Relationships', desc: 'I try to nurture strong bonds and trust among family, friends and colleagues.' },
    { icon: '🧗', title: 'Challenges', desc: 'I take on situations or tasks that test my thoughts, abilities and resilience.' },
    { icon: '😊', title: 'Happiness', desc: 'I want to attain feelings of contentment, satisfaction and fulfilment.' }
  ];

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', padding: '60px 20px', color: theme.textMain, fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* HERO SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 15px 0' }}>Peter <span style={{ color: theme.accent }}>Smith</span></h1>
          <h2 style={{ fontSize: '24px', color: theme.textSub, margin: '0 0 20px 0', fontWeight: 'normal' }}>
            Solutions Architect Leader. Technologist. Team Builder.
          </h2>
          <p style={{ fontSize: '18px', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto', color: theme.textSub }}>
            I don't just architect multi-petabyte cloud solutions; I build the teams that deliver them. 
            With 20 years in the IT trenches, I am obsessed with creating cultures of radical candor, 
            trust, and technical brilliance.
          </p>
        </div>

        {/* MISSION STATEMENT */}
        <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '40px', marginBottom: '60px', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative Leaf Accent */}
          <div style={{ position: 'absolute', top: '-20px', left: '-20px', fontSize: '120px', opacity: 0.1 }}>🍃</div>
          
          <h3 style={{ color: theme.accent, fontSize: '28px', marginTop: 0, position: 'relative', zIndex: 1 }}>My Mission</h3>
          <p style={{ fontSize: '22px', lineHeight: '1.5', fontWeight: 'bold', position: 'relative', zIndex: 1 }}>
            "To nurture elite Solutions Architects who love and own what they do and who people love to work with and buy from."
          </p>
          <p style={{ fontSize: '16px', color: theme.textSub, lineHeight: '1.6', position: 'relative', zIndex: 1 }}>
            Cultivating a team culture with principles grounded in genuine care, trust, and collaboration 
            with technical brilliance, remarkable soft skills, and sales excellence.
          </p>
        </div>

        {/* CORE VALUES GRID */}
        <h3 style={{ fontSize: '28px', borderBottom: `2px solid ${theme.accent}`, paddingBottom: '10px', display: 'inline-block', marginBottom: '30px' }}>Core Values</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '80px' }}>
          {coreValues.map((val, idx) => (
            <div key={idx} style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '32px', marginBottom: '15px', backgroundColor: 'rgba(0, 237, 100, 0.1)', padding: '10px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {val.icon}
              </div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '20px', color: theme.accent }}>{val.title}</h4>
              <p style={{ margin: 0, fontSize: '14px', color: theme.textSub, lineHeight: '1.5' }}>{val.desc}</p>
            </div>
          ))}
        </div>

        {/* THE LEGO TIMELINE (Image Placeholder) */}
        <div style={{ marginBottom: '80px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '28px', marginBottom: '20px' }}>My Journey</h3>
          <p style={{ color: theme.textSub, marginBottom: '40px' }}>From the family farm to leading modern data architecture.</p>
          
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', overflowX: 'auto' }}>
             {/* REPLACE THIS DIV WITH YOUR ACTUAL IMAGE TAG: <img src="/timeline.png" alt="Life Timeline" style={{width: '100%', height: 'auto'}} /> */}
             <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', border: '2px dashed #ccc', borderRadius: '8px' }}>
                [ Insert Graphic: Your LEGO Life Timeline Image Here ]
             </div>
          </div>
        </div>

        {/* HIGHLIGHTS / PROOF (Instead of a resume list) */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', backgroundColor: '#023430', border: `1px solid ${theme.accent}`, borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
            <h4 style={{ color: theme.accent, fontSize: '18px', margin: '0 0 10px 0' }}>MongoDB</h4>
            <p style={{ fontSize: '14px', margin: 0 }}>SA of the Year (EMEA HT) & Excellence Club. Led modernization for massive Enterprise accounts.</p>
          </div>
          <div style={{ flex: '1 1 300px', backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
            <h4 style={{ color: '#fff', fontSize: '18px', margin: '0 0 10px 0' }}>Intercom</h4>
            <p style={{ color: theme.textSub, fontSize: '14px', margin: 0 }}>Founding Sales Engineer. Built the EMEA SE function, collateral, and technical processes from scratch.</p>
          </div>
          <div style={{ flex: '1 1 300px', backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
            <h4 style={{ color: '#fff', fontSize: '18px', margin: '0 0 10px 0' }}>Academia</h4>
            <p style={{ color: theme.textSub, fontSize: '14px', margin: 0 }}>Master of Science (Cloud Computing) with Honours. Thesis on preemptive auto-scaling published in IEEE.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AboutMe;