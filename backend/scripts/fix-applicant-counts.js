// Script to fix applicant counts for all jobs
// This recalculates totalApplications based on actual candidate count

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Job = require('../src/models/Job');
const Candidate = require('../src/models/Candidate');

const fixApplicantCounts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hr-automation', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Get all jobs
    const jobs = await Job.find({});
    console.log(`\n📊 Found ${jobs.length} jobs to process\n`);

    let totalFixed = 0;
    let totalUnchanged = 0;

    for (const job of jobs) {
      // Count actual candidates for this job
      const actualCount = await Candidate.countDocuments({ appliedFor: job._id });
      const currentCount = job.totalApplications || 0;

      if (actualCount !== currentCount) {
        // Update the job with correct count
        job.totalApplications = actualCount;
        await job.save();

        console.log(`✅ Fixed: "${job.title}"`);
        console.log(`   Old count: ${currentCount} → New count: ${actualCount}`);
        totalFixed++;
      } else {
        console.log(`✓ OK: "${job.title}" (${actualCount} applicants)`);
        totalUnchanged++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📈 Summary:');
    console.log(`   Jobs fixed: ${totalFixed}`);
    console.log(`   Jobs unchanged: ${totalUnchanged}`);
    console.log(`   Total jobs: ${jobs.length}`);
    console.log('='.repeat(60) + '\n');

    console.log('✅ All done! Applicant counts have been corrected.');

    // Disconnect
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the script
fixApplicantCounts();
