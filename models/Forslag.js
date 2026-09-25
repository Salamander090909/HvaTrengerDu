const mongoose = require('mongoose');

const forslagSchema = new mongoose.Schema({
  tekst: { type: String, required: true },
  dato: { type: Date, default: Date.now },
  bruker: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  kommentarer: [
    {
      tekst: String,
      dato: {type: Date, default: Date.now}
    }
  ],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  numberLikes: {type: Number, default: 0}
});


module.exports = mongoose.model('Forslag', forslagSchema);