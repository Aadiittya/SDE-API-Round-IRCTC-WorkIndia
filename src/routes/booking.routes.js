const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { 
  bookSeat,
  getBookingDetails 
} = require('../controllers/booking.controller');

router.post('/', authenticateToken, bookSeat);
router.get('/:bookingId', authenticateToken, getBookingDetails);

module.exports = router;