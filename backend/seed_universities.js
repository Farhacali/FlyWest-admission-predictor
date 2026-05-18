const mongoose = require('mongoose');
const dotenv = require('dotenv');
const University = require('./models/University');
const seedData = require('./data/universities');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/admission_predictor';

async function seedUniversities() {
  await University.deleteMany({});
  await University.insertMany(seedData);
  return seedData.length;
}

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const count = await seedUniversities();
    console.log(`Successfully seeded ${count} universities!`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = { seedUniversities, seedData };
