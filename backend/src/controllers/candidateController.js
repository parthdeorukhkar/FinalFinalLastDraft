const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const axios = require('axios');

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private
exports.getAllCandidates = async (req, res, next) => {
  try {
    const { status, job, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (job) query.appliedFor = job;

    // Count total documents
    const total = await Candidate.countDocuments(query);

    // Execute query with pagination
    const candidates = await Candidate.find(query)
      .populate('appliedFor', 'title department')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: candidates.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: {
        candidates
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate by ID
// @route   GET /api/candidates/:id
// @access  Private
exports.getCandidateById = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate('appliedFor')
      .populate('interviews');

    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        candidate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new candidate with resume upload
// @route   POST /api/candidates
// @access  Private
exports.createCandidate = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, appliedFor, source } = req.body;

    // Check if resume file was uploaded
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload a resume (PDF or DOCX)'
      });
    }

    // Check if job exists (only if appliedFor is provided)
    let job = null;
    if (appliedFor) {
      job = await Job.findById(appliedFor);
      if (!job) {
        return res.status(404).json({
          status: 'error',
          message: 'Job not found'
        });
      }
    }

    // Create candidate with resume path
    const candidateData = {
      firstName,
      lastName,
      email,
      phone,
      source: source || 'Direct Upload',
      resumeUrl: req.file.path
    };

    // Only add appliedFor if provided
    if (appliedFor) {
      candidateData.appliedFor = appliedFor;
    }

    const candidate = await Candidate.create(candidateData);

    // Update job application count (only if job selected)
    if (job) {
      job.totalApplications += 1;
      await job.save();
    }

    // Send to Python AI service for parsing (async - don't wait)
    parseResumeAsync(candidate._id, req.file.path);

    res.status(201).json({
      status: 'success',
      message: 'Candidate created successfully. Resume is being analyzed.',
      data: {
        candidate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Private
exports.updateCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        candidate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private (Admin, HR Manager only)
exports.deleteCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found'
      });
    }

    // Decrement job's totalApplications count if candidate was assigned to a job
    if (candidate.appliedFor) {
      await Job.findByIdAndUpdate(
        candidate.appliedFor,
        { $inc: { totalApplications: -1 } }
      );
    }

    // Delete the candidate
    await Candidate.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze candidate resume using AI
// @route   POST /api/candidates/:id/analyze
// @access  Private
exports.analyzeCandidate = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('appliedFor');

    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found'
      });
    }

    // Call Python AI service
    const aiServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
    const path = require('path');

    // Convert to absolute path
    const absolutePath = path.resolve(candidate.resumeUrl);

    const response = await axios.post(`${aiServiceUrl}/match-candidate`, {
      candidateId: candidate._id.toString(),
      resumePath: absolutePath,
      jobRequirements: {
        skills: candidate.appliedFor.requiredSkills,
        experience: candidate.appliedFor.requiredExperience,
        education: candidate.appliedFor.requiredEducation
      }
    });

    // Update candidate with AI analysis
    candidate.matchScore = response.data.matchScore;
    candidate.aiSummary = response.data.summary;
    candidate.strengths = response.data.strengths;
    candidate.weaknesses = response.data.weaknesses;
    candidate.recommendedRoles = response.data.recommendedRoles || [];

    await candidate.save();

    res.status(200).json({
      status: 'success',
      message: 'Candidate analyzed successfully',
      data: {
        candidate
      }
    });
  } catch (error) {
    console.error('AI Service Error:', error.message);
    next(error);
  }
};

// @desc    Update candidate status
// @route   PUT /api/candidates/:id/status
// @access  Private
exports.updateCandidateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return res.status(404).json({
        status: 'error',
        message: 'Candidate not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        candidate
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidates by job
// @route   GET /api/candidates/job/:jobId
// @access  Private
exports.getCandidatesByJob = async (req, res, next) => {
  try {
    const candidates = await Candidate.find({ appliedFor: req.params.jobId })
      .sort({ matchScore: -1 });

    res.status(200).json({
      status: 'success',
      results: candidates.length,
      data: {
        candidates
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to parse resume asynchronously
async function parseResumeAsync(candidateId, resumePath) {
  try {
    const aiServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
    const path = require('path');

    // Convert to absolute path
    const absolutePath = path.resolve(resumePath);

    const response = await axios.post(`${aiServiceUrl}/parse-resume`, {
      candidateId: candidateId.toString(),
      resumePath: absolutePath
    });

    // Update candidate with parsed data
    await Candidate.findByIdAndUpdate(candidateId, {
      resumeText: response.data.text,
      skills: response.data.skills,
      experience: response.data.experience,
      education: response.data.education
    });

    console.log(`✅ Resume parsed for candidate: ${candidateId}`);
  } catch (error) {
    console.error(`❌ Error parsing resume for candidate ${candidateId}:`, error.message);
  }
}
