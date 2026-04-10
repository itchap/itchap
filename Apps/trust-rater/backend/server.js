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
  sessionId: { type: String, required: true, index: true },
  interactionName: String,
  c: Number,
  r: Number,
  i: Number,
  s: Number,
  score: Number,
  isActive: { type: Boolean, default: true }, 
  createdAt: { type: Date, default: Date.now }
});
const TrustScore = trustDb.model('TrustScore', trustScoreSchema, 'trustscores');

const runningAverageSchema = new mongoose.Schema({
  sessionId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true   
  },
  averageScore: Number,
  updatedAt: { type: Date, default: Date.now }
});
const RunningAverage = trustDb.model('RunningAverage', runningAverageSchema, 'runningaverages');

// ==========================================
// API ROUTES
// ==========================================

// Get Session Data
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

// TRANSACTION: Save Assessment & Update Average Together
app.post('/api/trust/save', async (req, res) => {
  const { id, sessionId, interactionName, c, r, i, s, score } = req.body;
  
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let newOrUpdatedId = id;
    
    if (id) {
      await TrustScore.findByIdAndUpdate(id, { interactionName, c, r, i, s, score }, { session });
    } else {
      const newScore = new TrustScore({ sessionId, interactionName, c, r, i, s, score });
      await newScore.save({ session });
      newOrUpdatedId = newScore._id;
    }

    const activeScores = await TrustScore.find({ sessionId, isActive: true }).session(session);
    let averageScore = null;
    if (activeScores.length > 0) {
      const total = activeScores.reduce((acc, curr) => acc + curr.score, 0);
      averageScore = (total / activeScores.length).toFixed(1);
    }

    await RunningAverage.findOneAndUpdate(
      { sessionId },
      { sessionId, averageScore, updatedAt: Date.now() },
      { upsert: true, returnDocument: 'after', session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, newId: newOrUpdatedId, averageScore });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction Error:", error);
    res.status(500).json({ error: "Transaction failed to save assessment" });
  }
});

// Soft-Reset the Average
app.post('/api/trust/reset-average', async (req, res) => {
  const { sessionId } = req.body;
  try {
    await TrustScore.updateMany({ sessionId }, { isActive: false });
    await RunningAverage.findOneAndUpdate({ sessionId }, { averageScore: null });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset average" });
  }
});

// Gemini AI Trust Analysis
app.post('/api/trust/analyze', async (req, res) => {
  const { c, r, i, s, score } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    // UPGRADED PROMPT WITH INVERSE SCORING CONTEXT
    const prompt = `You are an elite Pre-Sales / Solutions Architecture leadership coach. I am a Solutions Architect. Analyze my recent customer interaction based on Charles Green's Trust Equation.
    
    Formula: Trust = (Credibility + Reliability + Intimacy) / Self-Orientation
    
    CRITICAL SCORING RULES:
    - Credibility, Reliability, and Intimacy are out of 10 (Higher is BETTER).
    - Self-Orientation is the denominator, out of 10. A LOW score (e.g., 1 or 2) is EXCELLENT because it means I am highly focused on the customer's needs. A HIGH score (e.g., 8 or 10) is TERRIBLE because it means I am selfish and focused on my own agenda.
    
    My self-assessed scores are:
    - Credibility: ${c}/10
    - Reliability: ${r}/10
    - Intimacy: ${i}/10
    - Self-Orientation: ${s}/10
    - Total Trust Score: ${score}

    Provide a punchy, 3-paragraph analysis of my performance, followed by 1 highly actionable piece of advice to improve my specific weak point. Be radically candid, and remember to praise a low Self-Orientation score.`;

    const result = await model.generateContent(prompt);
    res.json({ analysis: result.response.text() });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: `Google API Error: ${error.message || "Failed to generate AI analysis"}` });
  }
});

app.listen(PORT, () => {
  console.log(`Trust Rater Backend running on port ${PORT}`);
});