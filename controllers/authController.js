const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Register new user
exports.register = async (req, res) => {
  console.log('Received register request:', req.body); // Log incoming request
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      console.log('Missing fields:', { name, email, password });
      return res.status(400).json({ message: 'All fields are required' });
    }
    let user = await User.findOne({ email });
    if (user) {
      console.log('Email already in use:', email);
      return res.status(409).json({ message: 'Email already in use' });
    }
    user = new User({ name, email, password });
    console.log('Saving user:', { name, email });
    await user.save();
    const token = generateToken(user);
    console.log('Generated token for user:', user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Register error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err); // Add detailed logging
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
