const express = require('express');
const router = express.Router();
const { authenticateAdmin, authenticateToken } = require('../middleware/auth.middleware');
const { 
  addTrain, 
  getTrains,
  updateSeats,
  getAvailability 
} = require('../controllers/train.controller');

router.post('/', authenticateAdmin, addTrain);
router.get('/', authenticateToken, getTrains);
router.put('/:trainId/seats', authenticateAdmin, updateSeats);
router.get('/availability', authenticateToken, getAvailability);

module.exports = router;