const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // e.g., "my-first-post" for SEO friendly URLs
  excerpt: { type: String, required: true },
  content: { type: String, required: true }, // We will store Markdown here later
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);