import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

// --- THEME CONFIG ---
const theme = {
  bg: '#011e2b',
  cardBg: 'rgba(255, 255, 255, 0.05)',
  border: '#333',
  accent: '#00ed64', 
  textMain: '#fff',
  textSub: '#bbb',
  textRead: '#e2e8f0', 
  inputBg: '#01121a'
};

const GlobalStyle = () => (
  <style>{`
    html, body, #root { 
      margin: 0; 
      padding: 0; 
      background-color: ${theme.bg}; 
      color: ${theme.textMain}; 
      font-family: 'Inter', system-ui, sans-serif; 
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: left !important;
      width: 100%;
      min-height: 100vh;
    }
    
    a { color: ${theme.accent}; text-decoration: none; transition: opacity 0.2s; }
    
    /* Input Styling */
    input, textarea { 
      width: 100%; 
      background: ${theme.inputBg}; 
      border: 1px solid ${theme.border}; 
      color: ${theme.textMain}; 
      padding: 16px; 
      border-radius: 8px; 
      box-sizing: border-box; 
      font-size: 1rem;
      font-family: 'Inter', sans-serif;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    input:focus, textarea:focus { 
      border-color: ${theme.accent}; 
      outline: none; 
      box-shadow: 0 0 0 2px rgba(0, 237, 100, 0.2);
    }
    textarea { resize: vertical; }

    /* --- OPTIMIZED READING STYLES --- */
    .markdown-body {
      font-size: 1.125rem; 
      line-height: 1.75;
      color: ${theme.textRead};
    }
    
    .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 { 
      color: ${theme.textMain}; 
      font-weight: 700; 
      line-height: 1.3;
      letter-spacing: -0.02em;
    }
    
    .markdown-body h2 { 
      font-size: 1.8rem; 
      margin-top: 2em; 
      margin-bottom: 0.8em; 
      border-bottom: 1px solid rgba(255,255,255,0.1); 
      padding-bottom: 0.4em; 
    }
    
    .markdown-body h3 {
      font-size: 1.4rem;
      margin-top: 1.8em;
      margin-bottom: 0.6em;
    }
    
    .markdown-body p, .markdown-body ul, .markdown-body ol { 
      margin-bottom: 1.6em; 
      color: ${theme.textRead}; 
    }
    
    .markdown-body li { margin-bottom: 0.5em; }
    
    /* Elegant inline links */
    .markdown-body a {
      color: ${theme.accent};
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 4px;
    }
    .markdown-body a:hover { opacity: 0.8; }
    
    .markdown-body code { 
      background: rgba(0,0,0,0.5); 
      padding: 0.2em 0.4em; 
      border-radius: 4px; 
      color: ${theme.accent}; 
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; 
      font-size: 0.9em; 
    }
    
    .markdown-body pre { 
      background: rgba(0,0,0,0.6); 
      padding: 24px; 
      border-radius: 12px; 
      overflow-x: auto; 
      border: 1px solid ${theme.border}; 
      margin: 2em 0; 
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .markdown-body pre code { 
      color: #e2e8f0; 
      background: none; 
      padding: 0; 
      font-size: 0.9em;
      line-height: 1.6;
    }
    
    .markdown-body blockquote { 
      border-left: 4px solid ${theme.accent}; 
      margin: 2em 0; 
      padding: 16px 24px; 
      background: rgba(0, 237, 100, 0.03); 
      border-radius: 0 12px 12px 0; 
      color: ${theme.textRead}; 
      font-style: italic; 
    }
    
    .markdown-body img { 
      max-width: 100%; 
      border-radius: 12px; 
      border: 1px solid ${theme.border}; 
      margin: 2em 0;
    }
  `}</style>
);

// --- COMPONENTS ---

// 1. THE FEED
const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog/posts')
      .then(res => res.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: theme.accent, fontSize: '1.2rem', fontWeight: 'bold' }}>Loading articles...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
      <header style={{ marginBottom: '60px', borderBottom: `2px solid ${theme.border}`, paddingBottom: '30px' }}>
        <h1 style={{ fontSize: '3.5rem', margin: '0 0 10px 0', letterSpacing: '-1px' }}>SA Stories<span style={{ color: theme.accent }}> from the Field</span></h1>
        <p style={{ color: theme.textSub, fontSize: '1.2rem', margin: 0, fontWeight: 400 }}>Solution Architect field notes on solution architecture, technical sales, and leadership.</p>
      </header>

      <div style={{ display: 'grid', gap: '40px' }}>
        {posts.map(post => (
          <Link to={`/post/${post.slug}`} key={post._id} style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{ 
              padding: '30px', 
              backgroundColor: theme.cardBg, 
              border: `1px solid ${theme.border}`, 
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = theme.accent;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 15px 0', color: theme.textMain, lineHeight: 1.3 }}>{post.title}</h2>
              <p style={{ color: theme.textSub, fontSize: '1.1rem', margin: '0 0 25px 0', lineHeight: 1.6 }}>{post.excerpt}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '0.8rem', color: theme.accent, border: `1px solid rgba(0, 237, 100, 0.3)`, background: 'rgba(0, 237, 100, 0.05)', padding: '4px 12px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: '0.9rem', color: '#555', fontWeight: 'bold' }}>Read Article →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// 2. THE ARTICLE VIEW (Constrained to 680px for reading)
const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/api/blog/posts/${slug}`)
      .then(res => res.json())
      .then(data => setPost(data));
  }, [slug]);

  if (!post) return <div style={{ textAlign: 'center', marginTop: '100px', color: theme.textSub }}>Loading article...</div>;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 20px' }}>
      
      {/* UPDATED: Green Hover on "Back to Articles" */}
      <Link 
        to="/" 
        style={{ 
          color: theme.textSub, 
          display: 'inline-block', 
          marginBottom: '40px', 
          fontWeight: 'bold', 
          fontSize: '0.9rem', 
          letterSpacing: '1px', 
          textTransform: 'uppercase',
          textDecoration: 'none',
          transition: 'color 0.2s ease-in-out'
        }}
        onMouseOver={e => e.target.style.color = theme.accent} 
        onMouseOut={e => e.target.style.color = theme.textSub}
      >
        ← Back to Articles
      </Link>
      
      <article>
        <header style={{ marginBottom: '50px' }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 20px 0', lineHeight: 1.15, letterSpacing: '-1px' }}>{post.title}</h1>
          <div style={{ color: theme.textSub, fontSize: '0.95rem', display: 'flex', gap: '15px', alignItems: 'center', fontWeight: 500 }}>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span style={{ color: theme.border }}>|</span>
            <span style={{ color: theme.accent }}>ITChap</span>
          </div>
        </header>
        
        <div className="markdown-body">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

// 3. THE SECURE ADMIN DASHBOARD
const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem('itchap_blog_token'));
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', tags: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  // --- LOGIN HANDLER ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/blog/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      
      if (res.ok && data.auth) {
        setToken(data.token);
        localStorage.setItem('itchap_blog_token', data.token);
      } else {
        setLoginError('Access Denied. Invalid credentials.');
      }
    } catch (err) {
      setLoginError('Server error.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('itchap_blog_token');
  };

  // --- PUBLISH HANDLER ---
  const publish = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/blog/posts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Send the secure token!
      },
      body: JSON.stringify({ ...form, tags: form.tags.split(',').map(t => t.trim()), published: true })
    });
    
    if (res.ok) {
      setMsg('✅ Article Published Successfully');
      setTimeout(() => navigate('/'), 1500);
    } else {
      setMsg('❌ Transmission Failed. Token may be expired.');
    }
  };

  // IF NOT LOGGED IN: SHOW LOGIN FORM
  if (!token) {
    return (
      <div style={{ maxWidth: '400px', width: '100%', margin: '100px auto', padding: '0 20px', boxSizing: 'border-box' }}>
        <div style={{ background: theme.cardBg, padding: '40px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
          <h2 style={{ color: theme.accent, marginTop: 0, marginBottom: '30px', textAlign: 'center' }}>Admin Access</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="text" placeholder="Username" value={credentials.username} onChange={e => setCredentials({...credentials, username: e.target.value})} required />
            <input type="password" placeholder="Password" value={credentials.password} onChange={e => setCredentials({...credentials, password: e.target.value})} required />
            <button type="submit" style={{ background: theme.accent, color: '#000', padding: '15px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Authenticate</button>
          </form>
          {loginError && <p style={{ color: '#ff4d4d', textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>{loginError}</p>}
        </div>
      </div>
    );
  }

  // IF LOGGED IN: SHOW PUBLISHING DASHBOARD
  return (
    <div style={{ maxWidth: '1000px', width: '100%', margin: '60px auto', padding: '0 20px', boxSizing: 'border-box' }}>
      <div style={{ background: theme.cardBg, padding: '50px', borderRadius: '16px', border: `1px solid ${theme.border}`, textAlign: 'left' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.border}`, paddingBottom: '15px', marginBottom: '30px' }}>
          <h2 style={{ color: theme.accent, margin: 0, fontSize: '2rem' }}>Publish New Article</h2>
          <button onClick={handleLogout} style={{ background: 'transparent', color: theme.textSub, border: `1px solid ${theme.border}`, padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
        </div>
        
        <form onSubmit={publish} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Article Title</label>
            <input placeholder="e.g. The Value Pyramid" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>URL Slug</label>
            <input placeholder="e.g. value-pyramid" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required style={{ fontFamily: 'monospace' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Summary (Excerpt)</label>
            <textarea placeholder="A short summary for the feed..." value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} required style={{ minHeight: '100px' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Content (Markdown format)</label>
            <textarea placeholder="Write your post here..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} required style={{ minHeight: '500px', fontFamily: 'monospace', lineHeight: 1.6 }} />
          </div>
          
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Tags</label>
            <input placeholder="e.g. Strategy, Leadership, Discovery" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
          </div>
          
          <button type="submit" style={{ background: theme.accent, color: '#000', padding: '18px', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px', transition: 'background 0.2s' }}
            onMouseOver={e => e.target.style.background = '#00c753'}
            onMouseOut={e => e.target.style.background = theme.accent}
          >
            Publish to Blog
          </button>
        </form>
        {msg && <p style={{ color: theme.accent, textAlign: 'center', marginTop: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>{msg}</p>}
      </div>
    </div>
  );
};

  return (
    <div style={{ maxWidth: '1000px', width: '100%', margin: '60px auto', padding: '0 20px', boxSizing: 'border-box' }}>
      <div style={{ background: theme.cardBg, padding: '50px', borderRadius: '16px', border: `1px solid ${theme.border}`, textAlign: 'left' }}>
        <h2 style={{ color: theme.accent, marginTop: 0, marginBottom: '30px', fontSize: '2rem', borderBottom: `1px solid ${theme.border}`, paddingBottom: '15px' }}>Publish New Article</h2>
        
        <form onSubmit={publish} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Article Title</label>
            <input placeholder="e.g. The Value Pyramid" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>URL Slug</label>
            <input placeholder="e.g. value-pyramid" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required style={{ fontFamily: 'monospace' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Summary (Excerpt)</label>
            <textarea placeholder="A short summary for the feed..." value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} required style={{ minHeight: '100px' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Content (Markdown format)</label>
            <textarea placeholder="Write your post here..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} required style={{ minHeight: '500px', fontFamily: 'monospace', lineHeight: 1.6 }} />
          </div>
          
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Tags</label>
            <input placeholder="e.g. Strategy, Leadership, Discovery" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
          </div>
          
          <button type="submit" style={{ background: theme.accent, color: '#000', padding: '18px', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px', transition: 'background 0.2s' }}
            onMouseOver={e => e.target.style.background = '#00c753'}
            onMouseOut={e => e.target.style.background = theme.accent}
          >
            Publish to Blog
          </button>
        </form>
        {msg && <p style={{ color: theme.accent, textAlign: 'center', marginTop: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>{msg}</p>}
      </div>
    </div>
  );
};

// --- APP CORE ---
function App() {
  return (
    <Router basename="/blog">
      <GlobalStyle />
      <nav style={{ padding: '15px 40px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(1,30,43,0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        
        {/* LOGO */}
        <a href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.accent, display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src="https://i.postimg.cc/hvPBkY0C/ninja.png" style={{ height: '35px', borderRadius: '50%' }} alt="logo" />
          itchap
        </a>

        {/* UPDATED: RIGHT ALIGNED MENU */}
        <div style={{ display: 'flex', gap: '25px', alignItems: 'center', fontSize: '14px', fontWeight: 'bold' }}>
          <a 
            href="/" 
            style={{ color: theme.textMain, textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s ease-in-out' }}
            onMouseOver={e => e.target.style.color = theme.accent} 
            onMouseOut={e => e.target.style.color = theme.textMain}
          >
            Home
          </a>
          
          <Link 
            to="/" 
            style={{ color: theme.textMain, textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s ease-in-out' }}
            onMouseOver={e => e.target.style.color = theme.accent} 
            onMouseOut={e => e.target.style.color = theme.textMain}
          >
            Blog
          </Link>

          <Link 
            to="/admin" 
            style={{ color: theme.textMain, textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s ease-in-out' }}
            onMouseOver={e => e.target.style.color = theme.accent} 
            onMouseOut={e => e.target.style.color = theme.textMain}
          >
            Admin
          </Link>
        </div>

      </nav>

      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/post/:slug" element={<BlogPost />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;