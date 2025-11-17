const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/send', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Email routes - Coming in Sprint 3' });
});

module.exports = router;
