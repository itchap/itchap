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
  inputBg: '#01121a'
};

const GlobalStyle = () => (
  <style>{`
    html, body { 
      margin: 0; 
      padding: 0; 
      background-color: ${theme.bg}; 
      color: ${theme.textMain}; 
      font-family: 'Inter', system-ui, sans-serif; 
      -webkit-font-smoothing: antialiased;
    }
    
    a { color: ${theme.accent}; text-decoration: none; transition: opacity 0.2s; }
    a:hover { opacity: 0.8; }
    
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

    /* Markdown Styling */
    .markdown-body h1, .markdown-body h2, .markdown-body h3 { color: ${theme.textMain}; margin-top: 1.8em; margin-bottom: 0.5em; font-weight: 700; }
    .markdown-body h1 { font-size: 2.2rem; }
    .markdown-body h2 { font-size: 1.8rem; border-bottom: 1px solid ${theme.border}; padding-bottom: 0.3em; }
    .markdown-body p { line-height: 1.8; color: ${theme.textSub}; font-size: 1.1rem; margin-bottom: 1.5em; }
    .markdown-body ul, .markdown-body ol { color: ${theme.textSub}; line-height: 1.8; font-size: 1.1rem; margin-bottom: 1.5em; padding-left: 20px; }
    .markdown-body li { margin-bottom: 0.5em; }
    .markdown-body code { background: rgba(0,0,0,0.5); padding: 3px 6px; border-radius: 4px; color: ${theme.accent}; font-family: monospace; font-size: 0.9em; }
    .markdown-body pre { background: rgba(0,0,0,0.5); padding: 20px; border-radius: 8px; overflow-x: auto; border: 1px solid ${theme.border}; margin: 25px 0; }
    .markdown-body pre code { color: #fff; background: none; padding: 0; }
    .markdown-body blockquote { border-left: 4px solid ${theme.accent}; margin: 0 0 1.5em 0; padding: 10px 20px; background: rgba(0, 237, 100, 0.05); border-radius: 0 8px 8px 0; color: #fff; font-style: italic; }
    .markdown-body img { max-width: 100%; border-radius: 8px; border: 1px solid ${theme.border}; }
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

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: theme.accent, fontSize: '1.2rem', fontWeight: 'bold' }}>Scanning for Transmissions...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
      <header style={{ marginBottom: '60px', borderBottom: `2px solid ${theme.border}`, paddingBottom: '30px' }}>
        <h1 style={{ fontSize: '3.5rem', margin: '0 0 10px 0', letterSpacing: '-1px' }}>Field <span style={{ color: theme.accent }}>Notes</span></h1>
        <p style={{ color: theme.textSub, fontSize: '1.2rem', margin: 0, fontWeight: 400 }}>Insights and strategies from the command line.</p>
      </header>

      <div style={{ display: 'grid', gap: '40px' }}>
        {posts.map(post => (
          <Link to={`/post/${post.slug}`} key={post._id} style={{ display: 'block' }}>
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
                <span style={{ fontSize: '0.9rem', color: '#555', fontWeight: 'bold' }}>READ →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// 2. THE ARTICLE VIEW
const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/api/blog/posts/${slug}`)
      .then(res => res.json())
      .then(data => setPost(data));
  }, [slug]);

  if (!post) return <div style={{ textAlign: 'center', marginTop: '100px', color: theme.textSub }}>Decrypting file...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
      <Link to="/" style={{ color: theme.textSub, display: 'inline-block', marginBottom: '30px', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
        ← Return to Index
      </Link>
      
      <article>
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 15px 0', lineHeight: 1.2, letterSpacing: '-1px' }}>{post.title}</h1>
          <div style={{ color: theme.textSub, fontSize: '0.9rem', display: 'flex', gap: '15px', alignItems: 'center' }}>
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

// 3. THE ADMIN DASHBOARD
const Admin = () => {
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', tags: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const publish = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/blog/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, tags: form.tags.split(','), published: true })
    });
    if (res.ok) {
      setMsg('✅ Transmission Successful');
      setTimeout(() => navigate('/'), 1500);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px' }}>
      <div style={{ background: theme.cardBg, padding: '40px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
        <h2 style={{ color: theme.accent, marginTop: 0, marginBottom: '30px', fontSize: '2rem', borderBottom: `1px solid ${theme.border}`, paddingBottom: '15px' }}>Initialize Payload</h2>
        
        <form onSubmit={publish} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Title</label>
            <input placeholder="e.g. The Value Pyramid" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          </div>
          
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>URL Slug</label>
            <input placeholder="e.g. value-pyramid" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required style={{ fontFamily: 'monospace' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Excerpt</label>
            <textarea placeholder="A short summary for the feed..." value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} required style={{ minHeight: '100px' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Content (Markdown)</label>
            <textarea placeholder="Write your post here..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} required style={{ minHeight: '400px', fontFamily: 'monospace', lineHeight: 1.6 }} />
          </div>
          
          <div>
            <label style={{ display: 'block', color: theme.textSub, marginBottom: '8px', fontSize: '0.9rem', fontWeight: 'bold' }}>Tags</label>
            <input placeholder="e.g. Strategy, Leadership, Code" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
          </div>
          
          <button type="submit" style={{ background: theme.accent, color: '#000', padding: '18px', fontWeight: 'bold', fontSize: '1.1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px', transition: 'background 0.2s' }}
            onMouseOver={e => e.target.style.background = '#00c753'}
            onMouseOut={e => e.target.style.background = theme.accent}
          >
            Deploy to Live
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
        <a href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.accent, display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src="https://i.postimg.cc/hvPBkY0C/ninja.png" style={{ height: '35px', borderRadius: '50%' }} alt="logo" />
          itchap
        </a>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/admin" style={{ fontSize: '0.9rem', color: theme.textSub, fontWeight: 'bold' }}>Admin</Link>
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