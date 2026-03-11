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
  isActive: { type: Boolean, default: true }, // <-- NEW: Soft delete flag
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

// Get Session Data (Fetches top 5 recent history, regardless of active status)
app.get('/api/trust/session/:id', async (req, res) => {
  try {
    // We removed 'isActive: true' here so your history list NEVER disappears!
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
  
  // 1. Start the Transaction Session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let newOrUpdatedId = id;
    
    // 2. Save or Update the TrustScore
    if (id) {
      await TrustScore.findByIdAndUpdate(id, { interactionName, c, r, i, s, score }, { session });
    } else {
      const newScore = new TrustScore({ sessionId, interactionName, c, r, i, s, score });
      await newScore.save({ session });
      newOrUpdatedId = newScore._id;
    }

    // 3. Recalculate the Average (Only using ACTIVE scores)
    const activeScores = await TrustScore.find({ sessionId, isActive: true }).session(session);
    let averageScore = null;
    if (activeScores.length > 0) {
      const total = activeScores.reduce((acc, curr) => acc + curr.score, 0);
      averageScore = (total / activeScores.length).toFixed(1);
    }

    // 4. Update the RunningAverage Collection
    await RunningAverage.findOneAndUpdate(
      { sessionId },
      { sessionId, averageScore, updatedAt: Date.now() },
      { upsert: true, returnDocument: 'after', session } // <-- Fixed warning here!
    );

    // 5. Commit the Transaction (Locks it in!)
    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, newId: newOrUpdatedId, averageScore });
  } catch (error) {
    // If ANYTHING fails, abort everything so the DB stays clean
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction Error:", error);
    res.status(500).json({ error: "Transaction failed to save assessment" });
  }
});

// Soft-Reset the Average (Keep the data, wipe the slate)
app.post('/api/trust/reset-average', async (req, res) => {
  const { sessionId } = req.body;
  try {
    // Soft Delete: Hide them from the math, but keep them in the DB
    await TrustScore.updateMany({ sessionId }, { isActive: false });
    
    // Clear the visual running average
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are an elite Pre-Sales / Solutions Architecture leadership coach. I am a Solutions Architect. Analyze my recent customer interaction based on the Trust Equation (Trust = (Credibility + Reliability + Intimacy) / Self-Orientation).
    
    My self-assessed scores are:
    - Credibility: ${c}/10
    - Reliability: ${r}/10
    - Intimacy: ${i}/10
    - Self-Orientation: ${s}/10
    - Total Trust Score: ${score}

    Provide a punchy, 3-paragraph analysis of my performance, followed by 1 highly actionable piece of advice to improve my specific weak point. Be radically candid.`;

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