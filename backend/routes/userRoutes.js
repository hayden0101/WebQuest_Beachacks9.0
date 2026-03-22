const router = require('express').Router();
const User = require('../jsmodels/users');

router.post('/', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newScore);
});