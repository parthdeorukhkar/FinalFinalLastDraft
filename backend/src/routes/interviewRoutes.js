const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', interviewController.getAllInterviews);
router.get('/:id', interviewController.getInterviewById);
router.post('/', interviewController.scheduleInterview);
router.put('/:id', interviewController.updateInterview);
router.delete('/:id', interviewController.cancelInterview);
router.post('/:id/feedback', interviewController.addFeedback);

module.exports = router;
