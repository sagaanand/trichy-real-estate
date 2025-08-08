const express = require('express');
const Inquiry = require('../models/inquiry');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify user
const auth = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token) return res.status(401).json({ msg: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(400).json({ msg: 'Invalid token' });
  }
};

// POST: Send inquiry
router.post('/', auth, async (req, res) => {
  try {
    const { listingId, message, contactInfo } = req.body;

    const inquiry = new Inquiry({
      listingId,
      buyerId: req.user.id,
      message,
      contactInfo
    });

    await inquiry.save();
    res.status(201).json({ msg: 'Inquiry sent', inquiry });
  } catch (err) {
    res.status(500).json({ msg: 'Error sending inquiry', err });
  }
});

module.exports = router;
