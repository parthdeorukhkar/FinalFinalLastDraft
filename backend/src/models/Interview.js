const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },

  // Interview Details
  round: {
    type: Number,
    default: 1
  },
  type: {
    type: String,
    enum: ['Phone Screen', 'Video', 'In-person', 'Technical', 'HR', 'Final'],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },

  // Meeting Details
  meetingLink: {
    type: String
  },
  location: {
    type: String
  },
  googleEventId: {
    type: String // For Google Calendar integration
  },

  // Interviewers
  interviewers: [{
    name: String,
    email: String,
    role: String
  }],

  // Status
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled', 'No Show'],
    default: 'Scheduled'
  },

  // Feedback
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    technicalSkills: Number,
    communication: Number,
    cultureFit: Number,
    comments: String,
    recommendation: {
      type: String,
      enum: ['Strong Yes', 'Yes', 'Maybe', 'No', 'Strong No']
    }
  },

  // Notes
  notes: String,

}, {
  timestamps: true
});

// Indexes
interviewSchema.index({ candidate: 1 });
interviewSchema.index({ job: 1 });
interviewSchema.index({ scheduledDate: 1 });
interviewSchema.index({ status: 1 });

module.exports = mongoose.model('Interview', interviewSchema);
