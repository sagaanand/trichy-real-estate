const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,

  type: {
    type: String,
    enum: ['house', 'apartment', 'land', 'commercial', 'plot'],
    required: true
  },

  price: { type: Number, required: true },
  area: { type: Number, required: true },

  address: { type: String, required: true },
  city: { type: String, required: true },
  areaName: { type: String, required: true },
  pincode: { type: String, required: true },

  location: {
    lat: Number,
    lng: Number
  },

  images: [String],
  videos: [String],
  documents: [String],

  views: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', ListingSchema);
