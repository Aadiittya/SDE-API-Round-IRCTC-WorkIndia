const db = require('../config/database');

const addTrain = async (req, res) => {
  try {
    const { name, source, destination, totalSeats } = req.body;
    
    await db.query(
      'INSERT INTO trains (name, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)',
      [name, source, destination, totalSeats, totalSeats]
    );
    
    res.status(201).json({ message: 'Train added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding train' });
  }
};

const getTrains = async (req, res) => {
  try {
    const [trains] = await db.query('SELECT * FROM trains');
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trains' });
  }
};

const updateSeats = async (req, res) => {
  try {
    const { trainId } = req.params;
    const { totalSeats } = req.body;
    
    await db.query(
      'UPDATE trains SET total_seats = ?, available_seats = ? WHERE id = ?',
      [totalSeats, totalSeats, trainId]
    );
    
    res.json({ message: 'Seats updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating seats' });
  }
};

const getAvailability = async (req, res) => {
  try {
    const { source, destination } = req.query;
    
    const [trains] = await db.query(
      'SELECT * FROM trains WHERE source = ? AND destination = ? AND available_seats > 0',
      [source, destination]
    );
    
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching availability' });
  }
};

module.exports = { addTrain, getTrains, updateSeats, getAvailability };