const router = require('express').Router();
const Leaderboard = require('../jsmodels/leaderboard');

router.post('/', async (req, res) => {
  const newBoard = new Leaderboard(req.body);
  await newBoard.save();
  res.json(newBoard);
});