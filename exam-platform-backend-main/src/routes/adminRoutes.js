// routes/adminRoutes.js
import express from 'express';
import Admin from '../models/admin.js';

const router = express.Router();

// Admin Registration
router.post('/register', async (req, res) => {
  const { username, password, collegeName } = req.body;

  if (!username || !password || !collegeName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const admin = await Admin.create({ username, password, collegeName });
    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Admin already exists or invalid data' });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ message: 'Admin not found' });

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({
    message: 'Login successful',
    user: {
      id: admin._id,
      username: admin.username,
      collegeName: admin.collegeName,
    },
  });
});

export default router;
