const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection (Update with your actual connection string if using Atlas, or localhost)
mongoose.connect('mongodb://127.0.0.1:27017/itchap_blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Blog MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

const Post = require('./models/Post');

// --- ROUTES ---

// 1. Get all published posts (for the blog feed)
app.get('/api/blog/posts', async (req, res) => {
  try {
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get a single post by slug (for the article page)
app.get('/api/blog/posts/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Create a new post (Admin only - we'll secure this later)
app.post('/api/blog/posts', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Blog API running on port ${PORT}`));