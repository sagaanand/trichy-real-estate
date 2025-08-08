const express = require('express');
const jwt = require('jsonwebtoken');

const Listing = require('../models/listing');
const Inquiry = require('../models/inquiry');
const User = require('../models/user');

const router = express.Router();

// Admin auth middleware
const adminAuth = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token) return res.status(401).json({ msg: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ msg: 'Admin access only' });

    req.user = decoded;
    next();
  } catch {
    return res.status(400).json({ msg: 'Invalid token' });
  }
};

// GET: All inquiries
router.get('/inquiries', adminAuth, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().populate('listingId buyerId');
    res.json(inquiries);
  } catch {
    res.status(500).json({ msg: 'Failed to load inquiries' });
  }
});

// GET: All listings (any status)
router.get('/listings', adminAuth, async (req, res) => {
  try {
    const listings = await Listing.find().populate('createdBy');
    res.json(listings);
  } catch {
    res.status(500).json({ msg: 'Failed to load listings' });
  }
});

// PUT: Approve/reject listing
router.put('/listings/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const listing = await Listing.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ msg: `Listing ${status}`, listing });
  } catch {
    res.status(500).json({ msg: 'Failed to update listing status' });
  }
});

// DELETE: Any listing
router.delete('/listings/:id', adminAuth, async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Listing deleted' });
  } catch {
    res.status(500).json({ msg: 'Failed to delete listing' });
  }
});

// GET: All users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch {
    res.status(500).json({ msg: 'Failed to load users' });
  }
});

// PUT: Suspend user
router.put('/users/:id/suspend', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isSuspended: true }, { new: true });
    res.json({ msg: 'User suspended', user });
  } catch {
    res.status(500).json({ msg: 'Failed to suspend user' });
  }
});

module.exports = router;
