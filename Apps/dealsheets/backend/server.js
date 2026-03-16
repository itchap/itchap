require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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
    const { sessionId, data } = req.body;
    const result = await DealSheet.findOneAndUpdate(
      { sessionId },
      { data, lastModified: Date.now() },
      { upsert: true, new: true } // Creates it if it doesn't exist
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

app.listen(PORT, () => console.log(`🚀 Deal Sheets API running on port ${PORT}`));