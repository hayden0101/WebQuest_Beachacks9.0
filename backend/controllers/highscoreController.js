const Highscore = require('../jsmodels/highscore');
const router = require('express').Router();

// Submit or update highscore for a user
exports.submitHighscore = async (req, res) => {
  try {
    const { userId } = req.body; // Assume userId from JWT or session
    let highscore = await Highscore.findOne({ userId });

    if (!highscore) {
      highscore = new Highscore({ userId, ...req.body });
    } else {
      // Update only if new scores are higher
      Object.keys(req.body).forEach(key => {
        if (key.startsWith('highscore_') && req.body[key] > highscore[key]) {
          highscore[key] = req.body[key];
        }
      });
      // Recalculate total if needed
      highscore.highscore_total = highscore.highscore_conversation + highscore.highscore_holdlongest + highscore.highscore_usethisword + highscore.highscore_dontusethisword;
    }

    await highscore.save();
    res.status(201).json(highscore);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit highscore', details: err.message });
  }
};

// Get highscore for a specific user
exports.getUserHighscore = async (req, res) => {
  try {
    const highscore = await Highscore.findOne({ userId: req.params.userId });
    if (!highscore) return res.status(404).json({ error: 'Highscore not found' });
    res.json(highscore);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch highscore', details: err.message });
  }
};

// Get top highscores for a category
exports.getTopHighscores = async (req, res) => {
  try {
    const category = req.query.category || 'highscore_total';
    const limit = parseInt(req.query.limit, 10) || 50;
    const top = await Highscore.find()
      .populate('userId', 'username') // Include username
      .sort({ [category]: -1 })
      .limit(limit);
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top highscores', details: err.message });
  }
};

module.exports = router;