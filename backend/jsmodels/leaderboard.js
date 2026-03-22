const mongoose = require('mongoose');
const LeaderboardSchema = new mongoose.Schema({
  username: { type: String, required: true },
  highscore_total: { type: Number, default: 0 },
  highscore_conversation: { type: Number, default: 0 },
  highscore_holdlongest: { type: Number, default: 0 },
  highscore_usethisword: { type: Number, default: 0 },
  highscore_dontusethisword: { type: Number, default: 0 },
  rank_totalhighscore: { type: Number, default: 0 },
  rank_conversation: { type: Number, default: 0 },
  rank_holdlongest: { type: Number, default: 0 },
  rank_usethisword: { type: Number, default: 0 },
  rank_dontusethisword: { type: Number, default: 0 },
  Location: { type: String, default: '' }
});
module.exports = mongoose.model('Leaderboard', LeaderboardSchema);