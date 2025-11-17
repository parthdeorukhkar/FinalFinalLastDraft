const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'],
    default: 'Full-time'
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  responsibilities: [String],
  requirements: [String],

  // Requirements for AI matching
  requiredSkills: [{
    name: String,
    importance: {
      type: String,
      enum: ['Required', 'Preferred', 'Nice to have'],
      default: 'Required'
    }
  }],
  requiredExperience: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number
    }
  },
  requiredEducation: {
    type: String,
    enum: ['High School', 'Associate', 'Bachelor', 'Master', 'PhD', 'Any']
  },

  // Compensation
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },

  // Job Status
  status: {
    type: String,
    enum: ['Draft', 'Open', 'Closed', 'On Hold'],
    default: 'Open'
  },
  openings: {
    type: Number,
    default: 1
  },

  // Posting Info
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  closingDate: {
    type: Date
  },

  // Candidates
  totalApplications: {
    type: Number,
    default: 0
  },
  shortlistedCandidates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  }],

}, {
  timestamps: true
});

// Indexes
jobSchema.index({ status: 1 });
jobSchema.index({ postedDate: -1 });
jobSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
