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
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const stakeholdersList = data.stakeholders && data.stakeholders.length > 0 
        ? data.stakeholders.map(s => `${s.name} (${s.role}) [Influence: ${s.influence}, Support: ${s.support}]`).join(' | ')
        : 'No stakeholders mapped yet.';

      const prompt = `
        You are a strict, elite Force Management and MEDDPICC sales methodology expert. Review this deal's complete profile.
        Provide exactly 2 concise, hard-hitting bullet points assessing the deal's maturity. Point out critical gaps. Maximum 50 words total.
        
        Account & Context: ${data.accountName || 'Unknown'} | Industry: ${data.industry || 'Unknown'} | Motion: ${data.salesMotion || 'Unknown'} | ARR: $${data.arr}
        App/Arch Context: ${data.appArchDescription || 'None'}
        
        The 3 Whys:
        - Why Do Anything: ${data.whyDoAnything || 'Blank'}
        - Why Now: ${data.whyNow || 'Blank'}
        - Why Us: ${data.whyMongoDB || 'Blank'}
        
        Stakeholders:
        ${stakeholdersList}
        
        Value Framework:
        - Before Scenario: ${data.beforeScenario || 'Blank'}
        - Negative Consequences: ${data.negativeConsequences || 'Blank'}
        - After Scenario: ${data.afterScenario || 'Blank'}
        - Positive Business Outcomes: ${data.positiveBusinessOutcomes || 'Blank'}
        - Required Capabilities: ${data.requiredCapabilities || 'Blank'}
        - Success Metrics: ${data.successMetrics || 'Blank'}

        MEDDPICC Framework:
        - M (Metrics): ${data.meddpiccMetrics || 'Blank'}
        - E (Economic Buyer): ${data.meddpiccEconomicBuyer || 'Blank'}
        - D (Decision Criteria): ${data.meddpiccDecisionCriteria || 'Blank'}
        - D (Decision Process): ${data.meddpiccDecisionProcess || 'Blank'}
        - P (Paper Process): ${data.meddpiccPaperProcess || 'Blank'}
        - I (Identified Pain): ${data.meddpiccIdentifiedPain || 'Blank'}
        - C (Champion): ${data.meddpiccChampion || 'Blank'}
        - C (Competition): ${data.meddpiccCompetition || 'Blank'}
      `;
      
      const result = await model.generateContent(prompt);
      data.healthInsights = result.response.text().trim();
    } catch (aiError) {
      console.error("AI Insights Error:", aiError);
      data.healthInsights = `⚠️ Google API Error: ${aiError.message || 'Service Unavailable'}. Check rate limits.`;
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an elite enterprise Solutions Architect. Based on the following Deal Sheet and MEDDPICC data, generate a compelling, executive-level Point of View (POV) narrative (3-4 paragraphs) to present to the customer. 
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
      
      MEDDPICC Elements to highlight if applicable:
      Metrics: ${deal.meddpiccMetrics || 'N/A'}
      Identified Pain: ${deal.meddpiccIdentifiedPain || 'N/A'}
      Competition to beat: ${deal.meddpiccCompetition || 'N/A'}
    `;

    const result = await model.generateContent(prompt);
    res.json({ pov: result.response.text() });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: error.message || 'Failed to generate POV' });
  }
});

app.listen(PORT, () => console.log(`🚀 Deal Sheets API running on port ${PORT}`));