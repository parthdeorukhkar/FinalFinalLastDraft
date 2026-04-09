const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.post('/', authorize('admin'), jobController.createJob);
router.put('/:id', authorize('admin'), jobController.updateJob);
router.delete('/:id', authorize('admin'), jobController.deleteJob);

module.exports = router;
