const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.post('/', authorize('Admin', 'HR Manager'), jobController.createJob);
router.put('/:id', authorize('Admin', 'HR Manager'), jobController.updateJob);
router.delete('/:id', authorize('Admin', 'HR Manager'), jobController.deleteJob);

module.exports = router;
