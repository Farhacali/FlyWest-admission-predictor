const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const StudentProfile = require('./models/StudentProfile');
const University = require('./models/University');
const { seedUniversities } = require('./seed_universities');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5000';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/admission_predictor';

const corsOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean);

app.use(cors({
  origin: corsOrigins.length ? corsOrigins : true,
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'flywest-api' });
});

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const count = await University.countDocuments();
    if (count === 0) {
      const seeded = await seedUniversities();
      console.log(`Auto-seeded ${seeded} universities (run "npm run seed" to refresh)`);
    } else {
      console.log(`University database ready (${count} entries)`);
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/predict', async (req, res) => {
  try {
    const { gre, toefl, cgpa, work_exp, country, course } = req.body;

    // Validate inputs
    if (!gre || !toefl || !cgpa || !country || !course) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call ML Service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
      gre, toefl, cgpa, work_exp: work_exp || 0, country, course
    });

    const chance_of_admit = mlResponse.data.chance_of_admit;

    // Save profile to MongoDB
    const profile = new StudentProfile({
      gre, toefl, cgpa, work_exp: work_exp || 0, country, course, chance_of_admit
    });
    await profile.save();

    let recommendation = 'Aim higher to improve your chances — consider strengthening your GRE, TOEFL, or CGPA.';
    if (chance_of_admit > 0.8) {
      recommendation = 'Excellent profile! You have a high chance of admission to top-tier universities.';
    } else if (chance_of_admit > 0.6) {
      recommendation = 'Good profile. You have a solid chance at target and mid-tier universities.';
    } else if (chance_of_admit > 0.4) {
      recommendation = 'Competitive profile. Focus on safe and target universities that match your scores.';
    }

    const matchingUniversities = await University.find({
      country,
      programs: course
    }).sort({ globalRank: 1 });

    const recommended_universities = matchingUniversities
      .filter(u => chance_of_admit >= (u.minChance - 0.15))
      .slice(0, 8);

    res.json({
      success: true,
      chance_of_admit,
      recommendation,
      recommended_universities,
      profile_id: profile._id
    });

  } catch (error) {
    console.error('Prediction Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to process prediction request' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const history = await StudentProfile.find().sort({ createdAt: -1 }).limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.get('/api/universities', async (req, res) => {
  try {
    const { country, tier, search, maxTuition, program } = req.query;
    const query = {};

    if (country) query.country = country;
    if (tier) query.tier = tier;
    if (program) query.programs = program;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (maxTuition) query.tuitionFeeUSD = { $lte: Number(maxTuition) };

    const universities = await University.find(query).sort({ globalRank: 1 });
    res.json(universities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch universities' });
  }
});

app.delete('/api/history', async (req, res) => {
  try {
    await StudentProfile.deleteMany({});
    res.json({ success: true, message: 'History cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
