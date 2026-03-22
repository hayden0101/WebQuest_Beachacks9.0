const router = require('express').Router();
const Highscore = require('../jsmodels/highscore');

router.post('/', async (req, res) => {
  const newScore = new Highscore(req.body);
  await newScore.save();
  res.json(newScore);
});