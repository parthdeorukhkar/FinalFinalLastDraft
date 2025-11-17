const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Analytics routes - Coming in Sprint 4' });
});

module.exports = router;
