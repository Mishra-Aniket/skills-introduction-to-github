const express = require('express');
const router = express.Router();
const {
  createCenter,
  getAllCenters,
  getCenter,
  updateCenter,
  deleteCenter
} = require('../controllers/centerController');
const { auth, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllCenters);
router.get('/:centerId', getCenter);

// Admin only routes
router.post('/', auth, isAdmin, createCenter);
router.patch('/:centerId', auth, isAdmin, updateCenter);
router.delete('/:centerId', auth, isAdmin, deleteCenter);

module.exports = router;
