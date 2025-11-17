const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },

  // Resume Information
  resumeUrl: {
    type: String,
    required: true
  },
  resumeText: {
    type: String // Extracted text from resume
  },

  // Parsed Resume Data (from AI service)
  skills: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    }
  }],
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String,
    startDate: Date,
    endDate: Date
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    graduationYear: Number,
    gpa: Number
  }],

  // AI Analysis
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  aiSummary: {
    type: String
  },
  strengths: [String],
  weaknesses: [String],
  recommendedRoles: [{
    role: String,
    matchPercentage: Number,
    description: String,
    matchedSkills: [String],
    reason: String
  }],

  // Application Status
  status: {
    type: String,
    enum: ['New', 'Screening', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Selected', 'Rejected', 'On Hold'],
    default: 'New'
  },

  // Job Reference
  appliedFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: false // Optional until job management is implemented
  },

  // Communication
  emails: [{
    type: {
      type: String,
      enum: ['Acknowledgment', 'Shortlist', 'Interview Invite', 'Rejection', 'Offer', 'Other']
    },
    subject: String,
    body: String,
    sentAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Interview Details
  interviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview'
  }],

  // Metadata
  source: {
    type: String,
    enum: ['Direct Upload', 'LinkedIn', 'Indeed', 'Referral', 'Other'],
    default: 'Direct Upload'
  },
  notes: String,

}, {
  timestamps: true
});

// Indexes for better query performance
candidateSchema.index({ email: 1 });
candidateSchema.index({ appliedFor: 1 });
candidateSchema.index({ status: 1 });
candidateSchema.index({ matchScore: -1 });

// Virtual for full name
candidateSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
candidateSchema.set('toJSON', { virtuals: true });
candidateSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Candidate', candidateSchema);
