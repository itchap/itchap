import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

// --- THEME CONFIG ---
const theme = {
  bg: '#011e2b',
  cardBg: 'rgba(255, 255, 255, 0.05)',
  border: '#333',
  accent: '#02ec64', // Your neon green
  textMain: '#fff',
  textSub: '#bbb'
};

const GlobalStyle = () => (
  <style>{`
    html, body { margin: 0; padding: 0; background-color: ${theme.bg}; color: ${theme.textMain}; font-family: 'Inter', system-ui, sans-serif; }
    a { color: ${theme.accent}; text-decoration: none; transition: 0.2s; }
    a:hover { opacity: 0.8; }
    .markdown-body h1, .markdown-body h2, .markdown-body h3 { color: ${theme.accent}; margin-top: 1.5em; }
    .markdown-body p { line-height: 1.8; color: ${theme.textSub}; font-size: 1.1rem; }
    .markdown-body code { background: #000; padding: 2px 6px; border-radius: 4px; color: #ff4d4d; }
    .markdown-body pre { background: #000; padding: 20px; border-radius: 8px; overflow-x: auto; border: 1px solid ${theme.border}; margin: 20px 0; }
    .markdown-body pre code { color: #fff; background: none; padding: 0; }
    input, textarea { width: 100%; background: #000; border: 1px solid ${theme.border}; color: #fff; padding: 12px; border-radius: 6px; box-sizing: border-box; font-size: 1rem; }
    input:focus, textarea:focus { border-color: ${theme.accent}; outline: none; }
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

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: theme.accent }}>Initializing Intel Feed...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px' }}>
      <header style={{ marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3.5rem', margin: 0 }}>ITChap <span style={{ color: theme.accent }}>Blog</span></h1>
        <p style={{ color: theme.textSub, fontSize: '1.2rem' }}>Field notes from the intersection of code and strategy.</p>
      </header>

      <div style={{ display: 'grid', gap: '25px' }}>
        {posts.map(post => (
          <Link to={`/post/${post.slug}`} key={post._id}>
            <div style={{ padding: '30px', backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: '15px' }}
                 onMouseOver={e => e.currentTarget.style.borderColor = theme.accent}
                 onMouseOut={e => e.currentTarget.style.borderColor = theme.border}>
              <h2 style={{ margin: '0 0 10px 0', color: theme.textMain }}>{post.title}</h2>
              <p style={{ color: theme.textSub, margin: '0 0 20px 0' }}>{post.excerpt}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '12px', color: theme.accent, border: `1px solid ${theme.accent}`, padding: '4px 10px', borderRadius: '20px' }}>{tag}</span>
                ))}
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

  if (!post) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Decrypting...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
      <Link to="/" style={{ color: theme.textSub }}>← Back to feed</Link>
      <h1 style={{ fontSize: '3rem', marginTop: '30px', marginBottom: '10px' }}>{post.title}</h1>
      <div style={{ color: theme.textSub, marginBottom: '40px', borderBottom: `1px solid ${theme.border}`, paddingBottom: '20px' }}>
        {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <div className="markdown-body">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
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