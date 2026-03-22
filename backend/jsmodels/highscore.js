const mongoose = require('mongoose');
const HighscoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  highscore_total: { type: Number, default: 0 },
  highscore_conversation: { type: Number, default: 0 },
  highscore_holdlongest: { type: Number, default: 0 },
  highscore_usethisword: { type: Number, default: 0 },
  highscore_dontusethisword: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Highscore', HighscoreSchema);