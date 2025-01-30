const db = require('../config/database');

const bookSeat = async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { trainId } = req.body;
    const userId = req.user.id;
    
    // Check seat availability with lock
    const [trains] = await connection.query(
      'SELECT * FROM trains WHERE id = ? AND available_seats > 0 FOR UPDATE',
      [trainId]
    );
    
    if (trains.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'No seats available' });
    }
    
    // Create booking
    const [booking] = await connection.query(
      'INSERT INTO bookings (user_id, train_id, booking_date) VALUES (?, ?, NOW())',
      [userId, trainId]
    );
    
    // Update available seats
    await connection.query(
      'UPDATE trains SET available_seats = available_seats - 1 WHERE id = ?',
      [trainId]
    );
    
    await connection.commit();
    
    res.status(201).json({
      message: 'Booking successful',
      bookingId: booking.insertId
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Error booking seat' });
  } finally {
    connection.release();
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;
    
    const [bookings] = await db.query(
      `SELECT b.*, t.name as train_name, t.source, t.destination 
       FROM bookings b 
       JOIN trains t ON b.train_id = t.id 
       WHERE b.id = ? AND b.user_id = ?`,
      [bookingId, userId]
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(bookings[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details' });
  }
};

module.exports = { bookSeat, getBookingDetails };