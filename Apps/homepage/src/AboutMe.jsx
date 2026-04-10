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
    { icon: '⭐', title: 'Excellence', desc: 'I strive to always pursue the highest level of performance in every aspect of my role.' },
    { icon: '🔗', title: 'Relationships', desc: 'I try to nurture strong bonds and trust among family, friends and colleagues.' },
    { icon: '🧗', title: 'Challenges', desc: 'I take on situations or tasks that test my thoughts, abilities and resilience.' },
    { icon: '😊', title: 'Happiness', desc: 'I want to attain feelings of joy, contentment, satisfaction and fulfilment.' }
  ];

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', padding: '60px 20px', color: theme.textMain, fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* HERO SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          
          {/* PROFILE PICTURE */}
          <img 
            src="https://media.licdn.com/dms/image/v2/D4D03AQHDYvMk_ophcg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1715112481913?e=1777507200&v=beta&t=QFtvjHn0AXZ0xUiAEHqGl_z93oa-jrHc4MMwQlw_dMU" 
            alt="Peter" 
            style={{ 
              width: '140px', 
              height: '140px', 
              borderRadius: '50%', 
              objectFit: 'cover', 
              border: `3px solid ${theme.accent}`, 
              marginBottom: '25px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
            }} 
          />

          <h1 style={{ fontSize: '48px', margin: '0 0 15px 0' }}>Peter <span style={{ color: theme.accent }}>Smith</span></h1>
          <h2 style={{ fontSize: '24px', color: theme.textSub, margin: '0 0 20px 0', fontWeight: 'normal' }}>
            Solutions Architect Leader. Technologist. Team Builder.
          </h2>
          <p style={{ fontSize: '18px', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto', color: theme.textSub }}>
            Architecting modern cloud platforms is my background; empowering people is my true calling. With two decades in the software industry, my focus now is entirely on cultivating teams where technical brilliance meets genuine care and trust.
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

        {/* THE LEGO TIMELINE */}
        <div style={{ marginBottom: '80px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '28px', borderBottom: `2px solid ${theme.accent}`, paddingBottom: '10px', display: 'inline-block', marginBottom: '20px' }}>My Journey</h3>
          <p style={{ color: theme.textSub, marginBottom: '40px', fontSize: '16px' }}>From the family farm to leading modern data architecture.</p>
          
          <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'center' }}>
             <img 
               src="https://i.postimg.cc/fwTkZMj7/timeline.png" 
               alt="Peter's Life Timeline" 
               style={{ width: '100%', maxWidth: '900px', height: 'auto', borderRadius: '8px' }} 
             />
          </div>
        </div>

        {/* HIGHLIGHTS / PROOF (Expanded Career & Academia) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <h3 style={{ fontSize: '28px', borderBottom: `2px solid ${theme.accent}`, paddingBottom: '10px', display: 'inline-block', marginBottom: '10px' }}>Career Highlights</h3>

          {/* COMPANY GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            {/* 1. MongoDB */}
            <div style={{ backgroundColor: '#023430', border: `1px solid ${theme.accent}`, borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
              <img src="https://images.seeklogo.com/logo-png/44/2/mongodb-logo-png_seeklogo-444844.png" alt="MongoDB" style={{ height: '40px', marginBottom: '15px' }} />
              <h4 style={{ color: theme.accent, fontSize: '18px', margin: '0 0 10px 0' }}>MongoDB</h4>
              <p style={{ fontSize: '14px', margin: 0, color: '#e0e0e0' }}>EMEA SA of the Year 2023 & Excellence Club 2024. Led modernization for massive Enterprise accounts.</p>
            </div>

            {/* 2. Intercom */}
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
              <img src="https://icon-icons.com/download-file?file=https%3A%2F%2Fimages.icon-icons.com%2F2699%2FPNG%2F512%2Fintercom_logo_icon_169644.png&id=169644&pack_or_individual=pack" alt="Intercom" style={{ height: '36px', marginBottom: '19px', opacity: 0.6, filter: 'brightness(0) invert(1)' }} />
              <h4 style={{ color: '#fff', fontSize: '18px', margin: '0 0 10px 0' }}>Intercom</h4>
              <p style={{ color: theme.textSub, fontSize: '14px', margin: 0 }}>Founding Sales Engineer. Built the EMEA SE function, collateral, and technical processes from scratch.</p>
            </div>

            {/* 3. Synchronoss */}
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
              <img src="https://companieslogo.com/img/orig/SNCR-692b860e.png?t=1720244494" alt="Synchronoss" style={{ height: '36px', marginBottom: '19px', opacity: 0.6, filter: 'brightness(0) invert(1)' }} />
              <h4 style={{ color: '#fff', fontSize: '18px', margin: '0 0 10px 0' }}>Synchronoss</h4>
              <p style={{ color: theme.textSub, fontSize: '14px', margin: 0 }}>Senior Solutions Architect. Managed major cloud data migrations, RFP responses, and strategic account delivery.</p>
            </div>

            {/* 4. BlackBerry (RIM) */}
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
              <img src="https://companieslogo.com/img/orig/BB.D-fa11eaf9.png?t=1720244490" alt="BlackBerry" style={{ height: '36px', marginBottom: '19px', opacity: 0.6, filter: 'brightness(0) invert(1)' }} />
              <h4 style={{ color: '#fff', fontSize: '18px', margin: '0 0 10px 0' }}>BlackBerry (RIM)</h4>
              <p style={{ color: theme.textSub, fontSize: '14px', margin: 0 }}>Solutions Architect. Technical Account Management and Hadoop infrastructure architecture for major Operators.</p>
            </div>

            {/* 5. Newbay Software */}
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
              <img src="https://techcrunch.com/wp-content/uploads/2012/12/newbay.png" alt="Newbay Software" style={{ height: '40px', marginBottom: '15px', opacity: 0.6, filter: 'grayscale(100%) brightness(1.5)' }} />
              <h4 style={{ color: '#fff', fontSize: '18px', margin: '0 0 10px 0' }}>Newbay Software</h4>
              <p style={{ color: theme.textSub, fontSize: '14px', margin: 0 }}>Senior Systems Engineer. Responsible for the build-out, deployment, and site reliability of Cloud SaaS products.</p>
            </div>

            {/* 6. Irish Defence Forces */}
            <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Badge_of_the_Irish_Defence_Forces.svg/1280px-Badge_of_the_Irish_Defence_Forces.svg.png" alt="Irish Defence Forces" style={{ height: '44px', marginBottom: '11px', opacity: 0.6, filter: 'grayscale(100%)' }} />
              <h4 style={{ color: '#fff', fontSize: '18px', margin: '0 0 10px 0' }}>Irish Defence Forces</h4>
              <p style={{ color: theme.textSub, fontSize: '14px', margin: 0 }}>Army Civilian Comms Engineer. Provided technical communications and systems engineering support.</p>
            </div>
          </div>

          {/* ACADEMIA & EDUCATION (Full Width) */}
          <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '40px', marginTop: '20px' }}>
            <h4 style={{ color: '#fff', fontSize: '24px', margin: '0 0 30px 0', textAlign: 'center' }}>Academia</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
              
              {/* Masters */}
              <div style={{ borderLeft: `3px solid ${theme.accent}`, paddingLeft: '20px' }}>
                <h5 style={{ margin: '0 0 5px 0', fontSize: '18px', color: theme.accent }}>Master's Degree, Cloud Computing</h5>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>National College of Ireland (2014 – 2016)</p>
                <p style={{ margin: 0, fontSize: '14px', color: theme.textSub, lineHeight: '1.5' }}>
                  Grade: Honours. <br />
                  Final Dissertation: <i>"Pre-emptive Cloud Auto-scaling Influenced by Social Network Trends"</i> (Published in IEEE).
                </p>
              </div>

              {/* Bachelors */}
              <div style={{ borderLeft: `3px solid #555`, paddingLeft: '20px' }}>
                <h5 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#fff' }}>B.Sc. Computer Networking</h5>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>South East Technological University (2001 – 2007)</p>
                <p style={{ margin: 0, fontSize: '14px', color: theme.textSub, lineHeight: '1.5' }}>
                  Grade: Honours.  <br />
                  Advanced Networking, Linux Administration, C/Java, Telecommunications. <br />
                  Activities: College Football (Captain, Freshmen Year).
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AboutMe;