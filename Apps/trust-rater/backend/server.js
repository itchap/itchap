const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB (Trust Rater)'))
  .catch(err => console.error(err));

const trustDb = mongoose.connection.useDb('trustrater');

// ==========================================
// SCHEMAS
// ==========================================
const trustScoreSchema = new mongoose.Schema({
  sessionId: String,
  interactionName: String,
  c: Number,
  r: Number,
  i: Number,
  s: Number,
  score: Number,
  createdAt: { type: Date, default: Date.now }
});
const TrustScore = trustDb.model('TrustScore', trustScoreSchema, 'trustscores');

const runningAverageSchema = new mongoose.Schema({
  sessionId: String,
  averageScore: Number,
  updatedAt: { type: Date, default: Date.now }
});
const RunningAverage = trustDb.model('RunningAverage', runningAverageSchema, 'runningaverages');

// ==========================================
// API ROUTES
// ==========================================

// Get Session Data (Fetches top 5 recent history + current running average)
app.get('/api/trust/session/:id', async (req, res) => {
  try {
    const history = await TrustScore.find({ sessionId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(5);
    
    const averageDoc = await RunningAverage.findOne({ sessionId: req.params.id });
    
    res.json({ history, runningAverage: averageDoc ? averageDoc.averageScore : null });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch session data" });
  }
});

// Save or Update Assessment
app.post('/api/trust/save', async (req, res) => {
  const { id, sessionId, interactionName, c, r, i, s, score } = req.body;
  try {
    if (id) {
      await TrustScore.findByIdAndUpdate(id, { interactionName, c, r, i, s, score });
      res.json({ success: true, message: "Assessment updated" });
    } else {
      const newScore = new TrustScore({ sessionId, interactionName, c, r, i, s, score });
      await newScore.save();
      res.json({ success: true, message: "Assessment saved", newId: newScore._id });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to save assessment" });
  }
});

// Update Running Average
app.post('/api/trust/average', async (req, res) => {
  const { sessionId } = req.body;
  try {
    const scores = await TrustScore.find({ sessionId });
    if (scores.length === 0) return res.json({ averageScore: null });

    const total = scores.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = (total / scores.length).toFixed(1);

    await RunningAverage.findOneAndUpdate(
      { sessionId },
      { sessionId, averageScore, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    res.json({ averageScore });
  } catch (error) {
    res.status(500).json({ error: "Failed to update average" });
  }
});

// Gemini AI Trust Analysis
app.post('/api/trust/analyze', async (req, res) => {
  const { c, r, i, s, score } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an elite Pre-Sales / Solutions Architecture leadership coach. I am a Solutions Architect. Analyze my recent customer interaction based on the Trust Equation (Trust = (Credibility + Reliability + Intimacy) / Self-Orientation).
    
    My self-assessed scores are:
    - Credibility: ${c}/10
    - Reliability: ${r}/10
    - Intimacy: ${i}/10
    - Self-Orientation: ${s}/10
    - Total Trust Score: ${score}

    Provide a punchy, 3-sentence analysis of my performance, followed by 1 highly actionable piece of advice to improve my specific weak point. Be radically candid.`;

    const result = await model.generateContent(prompt);
    res.json({ analysis: result.response.text() });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate AI analysis" });
  }
});

app.listen(PORT, () => {
  console.log(`Trust Rater Backend running on port ${PORT}`);
});