const express = require('express');
const Listing = require('../models/listing');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify token and attach user
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

// POST: Create listing (seller only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'seller') return res.status(403).json({ msg: 'Only sellers can post listings' });

  try {
    const listing = new Listing({
      ...req.body,
      createdBy: req.user.id
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating listing', err });
  }
});

// GET: All approved listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(listings);
  } catch {
    res.status(500).json({ msg: 'Failed to load listings' });
  }
});

// GET: Single listing by ID + increment views
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing || listing.status !== 'approved') {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    listing.views += 1;
    await listing.save();

    res.json(listing);
  } catch {
    res.status(500).json({ msg: 'Listing not found' });
  }
});

// PUT: Favorite a listing
router.put('/favorite/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ msg: 'Listing not found' });

    listing.favorites += 1;
    await listing.save();

    res.json({ msg: 'Favorited', favorites: listing.favorites });
  } catch {
    res.status(500).json({ msg: 'Error favoriting listing' });
  }
});

module.exports = router;
