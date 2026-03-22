const Leaderboard = require('../jsmodels/leaderboard');

// Add score entry
exports.addEntry = async (req, res) => {
  try {
    const entry = new Leaderboard(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Could not add leaderboard entry', details: err.message });
  }
};

// Get top leaderboard entries
exports.getTop = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const top = await Leaderboard.find({/* optionally exclude guests */})
      .sort({ highscore_total: -1 })
      .limit(limit);
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard', details: err.message });
  }
};

// Optional update entry
exports.updateEntry = async (req, res) => {
  try {
    const updated = await Leaderboard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update', details: err.message });
  }
};