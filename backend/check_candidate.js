const mongoose = require('mongoose');
const Candidate = require('./src/models/Candidate');

mongoose.connect('mongodb://localhost:27017/hr-automation').then(async () => {
  const candidates = await Candidate.find({ matchScore: { $gt: 0 } }).sort({updatedAt: -1}).limit(1);

  if (candidates.length > 0) {
    const c = candidates[0];
    console.log('Most recently analyzed candidate:');
    console.log('Name:', c.firstName, c.lastName);
    console.log('Resume Path:', c.resumeUrl);
    console.log('Match Score:', c.matchScore);
    console.log('\nExperience:', JSON.stringify(c.experience, null, 2));
    console.log('\nEducation:', JSON.stringify(c.education, null, 2));
    console.log('\nSkills (first 5):', JSON.stringify(c.skills.slice(0, 5), null, 2));
    console.log('\nRecommended Roles:', JSON.stringify(c.recommendedRoles, null, 2));
  } else {
    console.log('No analyzed candidates found');
  }

  process.exit(0);
});
