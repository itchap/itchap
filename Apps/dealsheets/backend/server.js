require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Deal Sheets MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const DealSheet = require('./models/DealSheet');

// SAVE OR UPDATE SESSION
app.post('/api/dealsheets/save', async (req, res) => {
  try {
    let { sessionId, data } = req.body;
    
    // SERVER LOGIC: Enforce ARR as a Number
    if (data.arr !== undefined && data.arr !== '') {
      const arrNumber = Number(data.arr);
      if (isNaN(arrNumber)) {
        return res.status(400).json({ error: 'ARR must be a valid number.' });
      }
      data.arr = arrNumber; // Cast to number for MongoDB
    } else {
      data.arr = 0; // Default to 0 if left blank
    }

    const result = await DealSheet.findOneAndUpdate(
      { sessionId },
      { data, lastModified: Date.now() },
      { upsert: true, new: true } 
    );
    res.json({ success: true, msg: 'Deal Sheet saved successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOAD SESSION
app.get('/api/dealsheets/:sessionId', async (req, res) => {
  try {
    const sheet = await DealSheet.findOne({ sessionId: req.params.sessionId });
    if (!sheet) return res.status(404).json({ msg: 'Session not found.' });
    res.json(sheet.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GENERATE AI POV
app.post('/api/dealsheets/generate-pov', async (req, res) => {
  try {
    const { deal } = req.body;
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an elite enterprise Solutions Architect. Based on the following Deal Sheet data, generate a compelling, executive-level Point of View (POV) narrative (3-4 paragraphs) to present to the customer. 
      Focus heavily on their business pain, the compelling event ("Why Now"), and how our solution drives specific Positive Business Outcomes. Be professional, persuasive, and authoritative.

      Data:
      Account: ${deal.accountName || 'Unknown Customer'}
      Industry: ${deal.industry || 'General'}
      Sales Motion: ${deal.salesMotion || 'Launch'}
      Why Do Anything: ${deal.whyDoAnything || 'N/A'}
      Why Now: ${deal.whyNow || 'N/A'}
      Why Us: ${deal.whyMongoDB || 'N/A'}
      Before Scenario: ${deal.beforeScenario || 'N/A'}
      Negative Consequences: ${deal.negativeConsequences || 'N/A'}
      After Scenario: ${deal.afterScenario || 'N/A'}
      Positive Business Outcomes: ${deal.positiveBusinessOutcomes || 'N/A'}
      Required Capabilities: ${deal.requiredCapabilities || 'N/A'}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ pov: response.text() });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: 'Failed to generate POV' });
  }
});

app.listen(PORT, () => console.log(`🚀 Deal Sheets API running on port ${PORT}`));