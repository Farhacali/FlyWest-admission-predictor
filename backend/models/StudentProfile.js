const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  gre: { type: Number, required: true },
  toefl: { type: Number, required: true },
  cgpa: { type: Number, required: true },
  work_exp: { type: Number, required: true },
  country: { type: String, required: true },
  course: { type: String, required: true },
  chance_of_admit: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
