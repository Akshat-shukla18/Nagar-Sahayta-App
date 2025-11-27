const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users/:userId - Fetch user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PUT /api/users/:userId - Update or create user profile
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { gender, address, profilePicUrl, phoneNumber } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { gender, address, profilePicUrl, phoneNumber },
      { new: true, upsert: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

module.exports = router;
