// routes/userRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, collegeName } = req.body;

  if (!collegeName) {
    return res.status(400).json({ error: 'College name is required' });
  }
  try {
    const user = await User.create({ username, password, collegeName }); // pre-save hook will hash password
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'User already exists or other error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'User not found' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
  res.json({ token, username, collegeName: user.collegeName });
});
// Get all users (READ)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Update user (UPDATE)
router.put('/:id', async (req, res) => {
  const { username, collegeName } = req.body;
  
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { username, collegeName }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete user (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

export default router;
