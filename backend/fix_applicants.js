const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Job = require('./src/models/Job');
  const Candidate = require('./src/models/Candidate');

  const candidates = await Candidate.find({ appliedFor: { $ne: null } }).populate('appliedFor');

  for (const c of candidates) {
    if (c.appliedFor && c.appliedFor.postedBy && !c.createdBy) {
      c.createdBy = c.appliedFor.postedBy;
      await c.save();
      console.log('Updated:', c.firstName, c.lastName, '- createdBy set to:', c.appliedFor.postedBy);
    }
  }

  console.log('Done!');
  mongoose.disconnect();
});
