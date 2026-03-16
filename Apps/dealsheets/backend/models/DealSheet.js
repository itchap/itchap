const mongoose = require('mongoose');

const dealSheetSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  lastModified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DealSheet', dealSheetSchema);