require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // NEW

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Blog MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const Post = require('./models/Post');

// --- SECURITY MIDDLEWARE ---
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ msg: 'No token provided.' });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: 'Failed to authenticate token.' });
    next();
  });
};

// --- ROUTES ---

// LOGIN ROUTE
app.post('/api/blog/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ id: username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ auth: true, token });
  } else {
    res.status(401).json({ auth: false, msg: 'Invalid credentials' });
  }
});

// GET ALL POSTS (Public)
app.get('/api/blog/posts', async (req, res) => {
  try {
    const posts = await Post.find({ published: true }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE POST (Public)
app.get('/api/blog/posts/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE POST (Protected by verifyToken)
app.post('/api/blog/posts', verifyToken, async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE POST (Protected by verifyToken)
app.put('/api/blog/posts/:id', verifyToken, async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Returns the updated document
    );
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Blog API running on port ${PORT}`));