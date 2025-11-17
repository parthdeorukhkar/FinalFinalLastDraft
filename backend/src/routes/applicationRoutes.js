const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

// Placeholder routes for applications
router.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Applications endpoint - Coming soon' });
});

module.exports = router;
