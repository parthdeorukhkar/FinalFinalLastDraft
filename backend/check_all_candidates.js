const mongoose = require('mongoose');
const Candidate = require('./src/models/Candidate');

mongoose.connect('mongodb://localhost:27017/hr-automation').then(async () => {
  const candidates = await Candidate.find().sort({updatedAt: -1}).limit(3);

  console.log(`Found ${candidates.length} candidates\n`);

  for (const c of candidates) {
    console.log('='.repeat(80));
    console.log('Name:', c.firstName, c.lastName);
    console.log('Email:', c.email);
    console.log('Resume Path:', c.resumeUrl);
    console.log('Match Score:', c.matchScore);
    console.log('\nExperience:', JSON.stringify(c.experience, null, 2));
    console.log('\nEducation:', JSON.stringify(c.education, null, 2));
    console.log('\nSkills (first 5):', JSON.stringify(c.skills.slice(0, 5), null, 2));
    if (c.recommendedRoles && c.recommendedRoles.length > 0) {
      console.log('\nRecommended Roles:', JSON.stringify(c.recommendedRoles.slice(0, 2), null, 2));
    }
    console.log('\n');
  }

  process.exit(0);
});
