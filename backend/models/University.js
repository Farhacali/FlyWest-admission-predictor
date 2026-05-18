const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  tier: { type: String, required: true }, // Reach, Target, Safe
  minChance: { type: Number, required: true },
  globalRank: { type: Number },
  acceptanceRate: { type: String },
  avgTuition: { type: String },
  tuitionFeeUSD: { type: Number },
  programs: [{ type: String }],
  applicationDeadline: { type: String },
  imageUrl: { type: String },
  logoUrl: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('University', universitySchema);
