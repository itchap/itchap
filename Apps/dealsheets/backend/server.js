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
    
    // Clean the ID going into the DB
    const cleanId = sessionId.trim().toUpperCase();
    data.sessionId = cleanId;

    if (data.arr !== undefined && data.arr !== null && data.arr.toString().trim() !== '') {
      const arrNumber = Number(data.arr);
      if (isNaN(arrNumber)) {
        return res.status(400).json({ error: 'ARR must be a clean number.' });
      }
      data.arr = arrNumber; 
    } else {
      data.arr = 0; 
    }

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // Upgraded to the requested gemini-2.5-flash model
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `
        You are a strict, elite Force Management sales methodology expert. Review this deal's 3 Whys and Value Framework.
        Provide exactly 2 concise, hard-hitting bullet points assessing the deal's maturity. Point out critical gaps (e.g., weak success metrics, missing compelling event, lack of business outcomes). Maximum 40 words total.
        
        Why Do Anything: ${data.whyDoAnything}
        Why Now: ${data.whyNow}
        Why Us: ${data.whyMongoDB}
        Before: ${data.beforeScenario}
        After: ${data.afterScenario}
        PBOs: ${data.positiveBusinessOutcomes}
        Metrics: ${data.successMetrics}
      `;
      const result = await model.generateContent(prompt);
      data.healthInsights = result.response.text().trim();
    } catch (aiError) {
      console.error("AI Insights Error:", aiError);
      data.healthInsights = "⚠️ AI temporarily unavailable to assess deal health.";
    }

    const result = await DealSheet.findOneAndUpdate(
      { sessionId: cleanId },
      { data, lastModified: Date.now() },
      { upsert: true, new: true } 
    );
    
    res.json({ success: true, msg: 'Deal Sheet saved successfully!', data: result.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOAD SESSION
app.get('/api/dealsheets/:sessionId', async (req, res) => {
  try {
    const searchId = req.params.sessionId.trim();
    const sheet = await DealSheet.findOne({ 
      sessionId: { $regex: new RegExp(`^${searchId}$`, 'i') } 
    });
    
    if (!sheet) return res.status(404).json({ msg: 'Session not found.' });
    res.json(sheet.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GENERATE EXECUTIVE POV
app.post('/api/dealsheets/generate-pov', async (req, res) => {
  try {
    const { deal } = req.body;
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Upgraded to the requested gemini-2.5-flash model
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
    res.json({ pov: result.response.text() });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: 'Failed to generate POV' });
  }
});

app.listen(PORT, () => console.log(`🚀 Deal Sheets API running on port ${PORT}`));