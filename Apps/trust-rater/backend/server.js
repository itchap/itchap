const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001; // <-- NEW PORT!

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Connect to MongoDB (Specifically the trustrater DB)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB (Trust Rater)'))
  .catch(err => console.error(err));

const trustDb = mongoose.connection.useDb('trustrater');

// ... (Paste all your TrustScore and RunningAverage Schemas here) ...
// ... (Paste all your /api/trust routes here) ...

app.listen(PORT, () => {
  console.log(`Trust Rater Backend running on port ${PORT}`);
});