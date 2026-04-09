const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');

const migrateUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hr-automation');
    console.log('Connected to MongoDB');

    // Find all users without a role and set them as admin
    const result = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'admin' } }
    );

    console.log(`Updated ${result.modifiedCount} users to have role: admin`);

    // Also update users with null role
    const result2 = await User.updateMany(
      { role: null },
      { $set: { role: 'admin' } }
    );

    console.log(`Updated ${result2.modifiedCount} users with null role to: admin`);

    // List all users and their roles
    const users = await User.find({}).select('name email role');
    console.log('\nAll users:');
    users.forEach(user => {
      console.log(`  ${user.email} - Role: ${user.role}`);
    });

    await mongoose.disconnect();
    console.log('\nMigration complete!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateUsers();
