import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

// --- THEME CONFIG ---
const theme = {
  bg: '#011e2b',
  cardBg: '#022a3b', // Slightly lighter than BG for depth
  border: '#0a3d56',
  accent: '#02ec64', 
  textMain: '#f0f4f8',
  textSub: '#94a3b8',
  headerSize: 'clamp(2rem, 5vw, 3.5rem)'
};

const GlobalStyle = () => (
  <style>{`
    html, body { 
      margin: 0; 
      padding: 0; 
      background-color: ${theme.bg}; 
      color: ${theme.textMain}; 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    
    /* Layout Containers */
    .container {
      max-width: 850px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    /* Typography & Markdown */
    .markdown-body h1 { font-size: 2.5rem; margin-bottom: 0.5em; }
    .markdown-body h2 { font-size: 1.8rem; color: ${theme.accent}; border-bottom: 1px solid ${theme.border}; padding-bottom: 0.3em; }
    .markdown-body p { line-height: 1.8; color: ${theme.textSub}; font-size: 1.15rem; margin-bottom: 1.5em; }
    
    /* Code Blocks */
    .markdown-body pre { 
      background: #000c14; 
      padding: 24px; 
      border-radius: 12px; 
      border: 1px solid ${theme.border};
      box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
    }

    /* Admin Form Refinement */
    .admin-card {
      background: ${theme.cardBg};
      border: 1px solid ${theme.border};
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    }
    
    .form-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 8px; color: ${theme.accent}; font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
  `}</style>
);

// --- COMPONENTS ---

// 1. REFINED FEED
const BlogList = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch('/api/blog/posts').then(res => res.json()).then(setPosts);
  }, []);

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{ fontSize: theme.headerSize, fontWeight: 800, letterSpacing: '-2px', marginBottom: '10px' }}>
          ITChap<span style={{ color: theme.accent }}>.blog</span>
        </h1>
        <p style={{ color: theme.textSub, fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          High-level strategy and technical deep-dives for the executive engineer.
        </p>
      </header>

      <div style={{ display: 'grid', gap: '30px' }}>
        {posts.map(post => (
          <Link to={`/post/${post.slug}`} key={post._id} style={{ display: 'block' }}>
            <div style={{ 
              padding: '40px', 
              backgroundColor: theme.cardBg, 
              border: `1px solid ${theme.border}`, 
              borderRadius: '24px',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = theme.accent;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = theme.border;
            }}>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 12px 0', color: '#fff' }}>{post.title}</h2>
              <p style={{ color: theme.textSub, fontSize: '1.1rem', margin: '0 0 25px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {post.excerpt}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{ background: 'rgba(2, 236, 100, 0.1)', color: theme.accent, padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// 2. REFINED ARTICLE
const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/api/blog/posts/${slug}`).then(res => res.json()).then(setPost);
  }, [slug]);

  if (!post) return <div className="container" style={{ textAlign: 'center' }}>Loading transmission...</div>;

  return (
    <div className="container" style={{ maxWidth: '750px' }}>
      <Link to="/" style={{ color: theme.accent, fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        ← Return to Terminal
      </Link>
      <article style={{ marginTop: '40px' }}>
        <h1 style={{ fontSize: '3.2rem', lineHeight: 1.1, marginBottom: '20px' }}>{post.title}</h1>
        <div style={{ color: theme.textSub, marginBottom: '50px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: theme.border }}></span>
          <span>By ITChap</span>
        </div>
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
    <div style={{ maxWidth: '800px', margin: '60px auto', padding: '40px', background: theme.cardBg, borderRadius: '15px', border: `1px solid ${theme.border}` }}>
      <h2 style={{ color: theme.accent, marginTop: 0 }}>New Transmission</h2>
      <form onSubmit={publish} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <input placeholder="Slug (url-friendly-link)" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} required />
        <textarea placeholder="Excerpt (Short summary)" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} required />
        <textarea placeholder="Content (Markdown)" style={{ minHeight: '300px' }} value={form.content} onChange={e => setForm({...form, content: e.target.value})} required />
        <input placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
        <button type="submit" style={{ background: theme.accent, color: '#000', padding: '15px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Publish to itchap.com</button>
      </form>
      {msg && <p style={{ color: theme.accent, textAlign: 'center' }}>{msg}</p>}
    </div>
  );
};

// --- APP CORE ---
function App() {
  return (
    <Router basename="/blog">
      <GlobalStyle />
      <nav style={{ padding: '20px 40px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(1,30,43,0.8)', position: 'sticky', top: 0 }}>
        <a href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.accent, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="https://i.postimg.cc/hvPBkY0C/ninja.png" style={{ height: '35px', borderRadius: '50%' }} alt="logo" />
          itchap
        </a>
        <Link to="/admin" style={{ fontSize: '0.8rem', color: theme.textSub }}>Terminal Access</Link>
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