const mongoose = require('mongoose');

const forslagSchema = new mongoose.Schema({
  tekst: { type: String, required: true },
  dato: { type: Date, default: Date.now },
  bruker: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Forslag', forslagSchema);