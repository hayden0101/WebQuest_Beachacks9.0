const User = require('../jsmodels/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Sign up new user
exports.signup = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.username) {
      return res.status(400).json({ error: 'Missing required fields: email, password, username' });
    }

    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    
    const newUser = new User({
      ...req.body,
      password: hashedPassword
    });
    await newUser.save();
    
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

// Get user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch user', details: err.message });
  }
};