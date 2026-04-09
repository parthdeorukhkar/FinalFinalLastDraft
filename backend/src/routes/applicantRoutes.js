const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const Interview = require('../models/Interview');
const User = require('../models/User');
const upload = require('../middleware/upload');
const axios = require('axios');
const path = require('path');

// @desc    Get all open jobs for applicants to browse
// @route   GET /api/applicant/jobs
// @access  Private (Applicant)
router.get('/jobs', protect, authorize('applicant'), async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'Open' })
      .select('title department location employmentType salaryRange description requirements requiredSkills experienceLevel')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: jobs.length,
      data: {
        jobs
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single job details
// @route   GET /api/applicant/jobs/:id
// @access  Private (Applicant)
router.get('/jobs/:id', protect, authorize('applicant'), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        job
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get applicant's own profile/applications
// @route   GET /api/applicant/profile
// @access  Private (Applicant)
router.get('/profile', protect, authorize('applicant'), async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('candidateProfile');

    if (!user.candidateProfile) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate profile not found'
      });
    }

    // Get the candidate with applied job details
    const candidate = await Candidate.findById(user.candidateProfile._id)
      .populate('appliedFor', 'title department location status');

    res.status(200).json({
      status: 'success',
      data: {
        candidate
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Apply to a job (upload resume)
// @route   POST /api/applicant/apply/:jobId
// @access  Private (Applicant)
router.post('/apply/:jobId', protect, authorize('applicant'), upload.single('resume'), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({
        status: 'error',
        message: 'This job is no longer accepting applications'
      });
    }

    // Get the applicant's candidate profile
    const user = await User.findById(req.user.id);
    const candidate = await Candidate.findById(user.candidateProfile);

    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate profile not found'
      });
    }

    // Check if already applied to this job
    if (candidate.appliedFor && candidate.appliedFor.toString() === req.params.jobId) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already applied to this job'
      });
    }

    // Update candidate with resume and job application
    candidate.appliedFor = job._id;
    candidate.status = 'Applied';
    // Set createdBy to the admin who posted the job so they can see this applicant
    candidate.createdBy = job.postedBy;

    if (req.file) {
      candidate.resumeUrl = req.file.path;
    }

    await candidate.save();

    // Increment job applications count
    await Job.findByIdAndUpdate(job._id, {
      $inc: { totalApplications: 1 }
    });

    res.status(200).json({
      status: 'success',
      message: 'Application submitted successfully',
      data: {
        candidate
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Upload/update resume
// @route   POST /api/applicant/upload-resume
// @access  Private (Applicant)
router.post('/upload-resume', protect, authorize('applicant'), upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload a resume file'
      });
    }

    const user = await User.findById(req.user.id);
    const candidate = await Candidate.findById(user.candidateProfile);

    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate profile not found'
      });
    }

    // Update resume URL
    candidate.resumeUrl = req.file.path;
    await candidate.save();

    // If AI service is available, parse the resume
    try {
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const resumePath = path.resolve(req.file.path);

      const parseResponse = await axios.post(`${aiServiceUrl}/parse-resume`, {
        resume_path: resumePath
      });

      if (parseResponse.data && parseResponse.data.parsed_data) {
        const parsedData = parseResponse.data.parsed_data;

        // Update candidate with parsed data
        if (parsedData.skills) candidate.skills = parsedData.skills;
        if (parsedData.experience) candidate.experience = parsedData.experience;
        if (parsedData.education) candidate.education = parsedData.education;
        if (parsedData.summary) candidate.summary = parsedData.summary;

        await candidate.save();
      }
    } catch (aiError) {
      console.log('AI parsing skipped:', aiError.message);
    }

    res.status(200).json({
      status: 'success',
      message: 'Resume uploaded successfully',
      data: {
        resumeUrl: candidate.resumeUrl
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get applicant's interviews
// @route   GET /api/applicant/interviews
// @access  Private (Applicant)
router.get('/interviews', protect, authorize('applicant'), async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const interviews = await Interview.find({ candidate: user.candidateProfile })
      .populate('job', 'title department')
      .sort({ scheduledDate: -1 });

    res.status(200).json({
      status: 'success',
      results: interviews.length,
      data: {
        interviews
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get application status
// @route   GET /api/applicant/status
// @access  Private (Applicant)
router.get('/status', protect, authorize('applicant'), async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const candidate = await Candidate.findById(user.candidateProfile)
      .populate('appliedFor', 'title department location status');

    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate profile not found'
      });
    }

    // Get upcoming interviews
    const upcomingInterviews = await Interview.find({
      candidate: user.candidateProfile,
      scheduledDate: { $gte: new Date() },
      status: 'Scheduled'
    })
      .populate('job', 'title')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      status: 'success',
      data: {
        status: candidate.status,
        appliedJob: candidate.appliedFor,
        matchScore: candidate.matchScore,
        hasResume: !!candidate.resumeUrl,
        upcomingInterviews
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
