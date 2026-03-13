import React from 'react';

function Home() {
  const theme = {
    bg: '#011e2b',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    border: '#333',
    accent: '#00ed64',
    textMain: '#fff',
    textSub: '#bbb'
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.textMain, minHeight: '100vh', width: '100%', fontFamily: 'sans-serif', margin: 0, padding: 0, boxSizing: 'border-box' }}>

      {/* HERO SECTION */}
      <header id="about" style={{ padding: '120px 20px', textAlign: 'center', maxWidth: '850px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 20px 0' }}>Raising the bar in<span style={{ color: theme.accent }}> SA Excellence</span></h1>
        <p style={{ fontSize: '18px', color: theme.textSub, lineHeight: '1.6', marginBottom: '40px' }}>
          Hey, I'm Peter 👋 a Solutions Architects Leader at MongoDB (Berlin). My day-to-day focus is on developing elite SA talent. I created this space to share the apps I build and resources I use to help other SAs and SA leaders excel in technical sales and drive better customer outcomes.
        </p>
        <a href="#apps" style={{ padding: '12px 24px', backgroundColor: theme.accent, color: '#000', textDecoration: 'none', fontWeight: 'bold', borderRadius: '4px', fontSize: '16px', transition: 'opacity 0.2s' }}>
          View My Apps
        </a>
      </header>

      {/* APPS PORTFOLIO SECTION */}
      <section id="apps" style={{ padding: '80px 20px', backgroundColor: '#021620' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '40px', borderBottom: `2px solid ${theme.accent}`, display: 'inline-block', paddingBottom: '10px' }}>My Applications</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* 1. SKILLS MATRIX CARD */}
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginTop: 0, color: theme.accent, fontSize: '22px' }}>SA Skill / Passion Matrix</h3>
              <p style={{ color: theme.textSub, fontSize: '15px', lineHeight: '1.6', flexGrow: 1 }}>
                A drag-and-drop quadrant matrix designed to help Solutions Architects map their skills, identify burnout risks, and find their zone of genius. Features PDF export and AI career analysis.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <span style={{ fontSize: '12px', backgroundColor: '#023430', color: theme.accent, padding: '4px 10px', borderRadius: '4px', border: '1px solid #00684a' }}>React</span>
                <span style={{ fontSize: '12px', backgroundColor: '#023430', color: theme.accent, padding: '4px 10px', borderRadius: '4px', border: '1px solid #00684a' }}>Node.js</span>
                <span style={{ fontSize: '12px', backgroundColor: '#023430', color: theme.accent, padding: '4px 10px', borderRadius: '4px', border: '1px solid #00684a' }}>MongoDB</span>
              </div>
              <a href="/app/skills/" style={{ display: 'block', textAlign: 'center', marginTop: '24px', padding: '12px', backgroundColor: 'transparent', color: theme.textMain, border: `1px solid ${theme.accent}`, borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.target.style.backgroundColor = theme.accent; e.target.style.color = '#000'; }} onMouseOut={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = theme.textMain; }}>
                Launch App &rarr;
              </a>
            </div>

            {/* 2. TRUST RATER CARD */}
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginTop: 0, color: theme.accent, fontSize: '22px' }}>SA Trust Rater</h3>
              <p style={{ color: theme.textSub, fontSize: '15px', lineHeight: '1.6', flexGrow: 1 }}>
                A sleek calculator based on Charles Green's <i>The Trusted Advisor</i>. Instantly evaluate your customer interactions, AE partnerships, and gut-check your credibility vs. self-orientation.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <span style={{ fontSize: '12px', backgroundColor: '#023430', color: theme.accent, padding: '4px 10px', borderRadius: '4px', border: '1px solid #00684a' }}>React</span>
                <span style={{ fontSize: '12px', backgroundColor: '#023430', color: theme.accent, padding: '4px 10px', borderRadius: '4px', border: '1px solid #00684a' }}>UI/UX</span>
                <span style={{ fontSize: '12px', backgroundColor: '#023430', color: theme.accent, padding: '4px 10px', borderRadius: '4px', border: '1px solid #00684a' }}>Sales Psych</span>
              </div>
              <a href="/app/trust/" style={{ display: 'block', textAlign: 'center', marginTop: '24px', padding: '12px', backgroundColor: 'transparent', color: theme.textMain, border: `1px solid ${theme.accent}`, borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.target.style.backgroundColor = theme.accent; e.target.style.color = '#000'; }} onMouseOut={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = theme.textMain; }}>
                Launch App &rarr;
              </a>
            </div>

            {/* 3. CYCLE OF LEARNING CARD */}
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ marginTop: 0, color: theme.accent, fontSize: '22px' }}>Cycle of Learning</h3>
              <p style={{ color: theme.textSub, fontSize: '15px', lineHeight: '1.6', flexGrow: 1 }}>
                An interactive blueprint guiding SAs from knowledge consumption to Thought Leadership. Explore the deep-dive mechanics of testing, reflecting, and teaching.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <span style={{ fontSize: '12px', backgroundColor: '#023430', color: theme.accent, padding: '4px 10px', borderRadius: '4px', border: '1px solid #00684a' }}>React</span>
                <span style={{ fontSize: '12px', backgroundColor: '#023430', color: theme.accent, padding: '4px 10px', borderRadius: '4px', border: '1px solid #00684a' }}>Enablement</span>
                <span style={{ fontSize: '12px', backgroundColor: '#023430', color: theme.accent, padding: '4px 10px', borderRadius: '4px', border: '1px solid #00684a' }}>Mentorship</span>
              </div>
              <a href="/app/learning/" style={{ display: 'block', textAlign: 'center', marginTop: '24px', padding: '12px', backgroundColor: 'transparent', color: theme.textMain, border: `1px solid ${theme.accent}`, borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.target.style.backgroundColor = theme.accent; e.target.style.color = '#000'; }} onMouseOut={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = theme.textMain; }}>
                Launch App &rarr;
              </a>
            </div>

            {/* 4. PLACEHOLDER CARD */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: `1px dashed ${theme.border}`, borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px' }}>
              <span style={{ fontSize: '36px', marginBottom: '15px' }}>🚀</span>
              <h3 style={{ margin: 0, color: theme.textSub }}>More coming soon...</h3>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: theme.bg, color: theme.textSub, fontSize: '13px', borderTop: `1px solid ${theme.border}` }}>
        
        {/* SOCIAL LINKS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '20px' }}>
          <a 
            href="https://www.linkedin.com/in/itchap/" 
            target="_blank" 
            rel="noreferrer" 
            style={{ color: theme.textMain, textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', transition: 'color 0.2s ease-in-out' }}
            onMouseOver={e => e.target.style.color = '#01ed64'} 
            onMouseOut={e => e.target.style.color = theme.textMain}
          >
            LinkedIn
          </a>
          <a 
            href="https://github.com/itchap" 
            target="_blank" 
            rel="noreferrer" 
            style={{ color: theme.textMain, textDecoration: 'none', fontSize: '15px', fontWeight: 'bold', transition: 'color 0.2s ease-in-out' }}
            onMouseOver={e => e.target.style.color = '#01ed64'} 
            onMouseOut={e => e.target.style.color = theme.textMain}
          >
            GitHub
          </a>
        </div>

        &copy; {new Date().getFullYear()} itchap. Built with MongoDB, Express, React, and Node.js.
      </footer>
    </div>
  );
}

export default Home;