const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(protect);

// GET all candidates
router.get('/', candidateController.getAllCandidates);

// GET candidate by ID
router.get('/:id', candidateController.getCandidateById);

// POST create candidate with resume upload
router.post('/',
  upload.single('resume'),
  candidateController.createCandidate
);

// PUT update candidate
router.put('/:id', candidateController.updateCandidate);

// DELETE candidate
router.delete('/:id',
  authorize('admin'),
  candidateController.deleteCandidate
);

// POST analyze candidate resume (call Python AI service)
router.post('/:id/analyze', candidateController.analyzeCandidate);

// PUT update candidate status
router.put('/:id/status', candidateController.updateCandidateStatus);

// GET candidates by job
router.get('/job/:jobId', candidateController.getCandidatesByJob);

module.exports = router;
