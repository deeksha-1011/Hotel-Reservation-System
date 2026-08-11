const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
require('dotenv').config();

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Verify environment variables
if (!process.env.DB_PASSWORD) {
  console.error('Error: DB_PASSWORD not found in environment variables');
  console.log('Please create a .env file with the following variables:');
  console.log('DB_HOST=localhost');
  console.log('DB_USER=root');
  console.log('DB_PASSWORD=your_mysql_password');
  console.log('DB_NAME=skystay_hotel');
  console.log('JWT_SECRET=your_jwt_secret');
  process.exit(1);
}

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD, // This must be set in .env
  database: process.env.DB_NAME || 'skystay_hotel'
};

// Create database connection
const db = mysql.createConnection(dbConfig);

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nAccess denied. Please check:');
      console.log('1. Your MySQL root password in .env file is correct');
      console.log('2. MySQL server is running');
      console.log('3. You can try connecting using: mysql -u root -p');
    } else if (err.code === 'ECONNREFUSED') {
      console.log('\nConnection refused. Please check:');
      console.log('1. MySQL server is running');
      console.log('2. MySQL is accepting connections on localhost:3306');
    }
    process.exit(1);
  }
  console.log('Connected to MySQL database');
  initializeDatabase();
});

// Initialize database tables
function initializeDatabase() {
  // Users table
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Rooms table
  db.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      room_number VARCHAR(10) NOT NULL UNIQUE,
      type VARCHAR(50) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      description TEXT,
      status ENUM('available', 'booked', 'maintenance') DEFAULT 'available'
    )
  `);

  // Bookings table
  db.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      room_id INT NOT NULL,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (room_id) REFERENCES rooms(id)
    )
  `);

  // Add sample rooms if none exist
  db.query('SELECT COUNT(*) as count FROM rooms', (err, results) => {
    if (err) {
      console.error('Error checking rooms:', err);
      return;
    }

    if (results[0].count === 0) {
      const sampleRooms = [
        ['101', 'Standard Room', 89.99, 'Comfortable room with essential amenities for a pleasant stay.', 'available'],
        ['102', 'Deluxe Room', 129.99, 'Spacious room with premium amenities and city view.', 'available'],
        ['103', 'Family Suite', 179.99, 'Perfect for families with separate living area and extra space.', 'available'],
        ['104', 'Standard Twin', 99.99, 'Two single beds with modern amenities.', 'available'],
        ['105', 'Executive Suite', 199.99, 'Luxury suite with separate work area and premium facilities.', 'available'],
        ['106', 'Economy Single', 69.99, 'Cozy room perfect for solo travelers.', 'available']
      ];

      db.query(
        'INSERT INTO rooms (room_number, type, price, description, status) VALUES ?',
        [sampleRooms],
        (err) => {
          if (err) {
            console.error('Error adding sample rooms:', err);
          } else {
            console.log('Sample rooms added successfully');
          }
        }
      );
    }
  });
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// API Endpoints

// Register user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Remove password hashing
    
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password], // Use plain text password
      (err, results) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: 'Error creating user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Server error' });
      if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

      const user = results[0];

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '24h' }
      );

      res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get available rooms
app.get('/api/rooms', (req, res) => {
  db.query('SELECT * FROM rooms', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching rooms' });
    res.json(results);
  });
});

// Get user's bookings
app.get('/api/bookings', authenticateToken, (req, res) => {
  console.log('Fetching bookings for user:', req.user.id);
  
  db.query(
    `SELECT 
      b.id,
      b.user_id,
      b.room_id,
      b.check_in,
      b.check_out,
      b.status,
      b.created_at,
      r.room_number,
      r.type,
      r.price,
      u.username,
      u.email
     FROM bookings b 
     JOIN rooms r ON b.room_id = r.id 
     JOIN users u ON b.user_id = u.id
     WHERE b.user_id = ?`,
    [req.user.id],
    (err, results) => {
      if (err) {
        console.error('Error fetching bookings:', err);
        return res.status(500).json({ error: 'Error fetching bookings' });
      }
      console.log('Found bookings:', results);
      res.json(results);
    }
  );
});

// Create a booking
app.post('/api/bookings', authenticateToken, (req, res) => {
  const { room_id, check_in, check_out } = req.body;
  
  db.query(
    'INSERT INTO bookings (user_id, room_id, check_in, check_out) VALUES (?, ?, ?, ?)',
    [req.user.id, room_id, check_in, check_out],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error creating booking' });
      
      // Remove the room status update to keep it always available
      // db.query('UPDATE rooms SET status = "booked" WHERE id = ?', [room_id]);
      
      res.status(201).json({ message: 'Booking created successfully' });
    }
  );
});

// Update booking status
app.put('/api/bookings/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!['confirmed', 'cancelled'].includes(status)) {
    console.log('Invalid status:', status);
    return res.status(400).json({ error: 'Invalid status' });
  }

  // First, get the booking to check if it exists and belongs to the user
  db.query(
    'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    (err, bookings) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Error fetching booking' });
      }
      if (bookings.length === 0) {
        console.log('Booking not found:', { id, userId: req.user.id });
        return res.status(404).json({ error: 'Booking not found' });
      }

      const booking = bookings[0];
      console.log('Found booking:', booking);
      
      // Update the booking status
      db.query(
        'UPDATE bookings SET status = ? WHERE id = ?',
        [status, id],
        (err, results) => {
          if (err) {
            console.error('Error updating status:', err);
            return res.status(500).json({ error: 'Error updating booking status' });
          }

          console.log('Updated booking status:', { id, status, results });

          // Remove room status update since we want rooms to stay available
          // if (status === 'cancelled') {
          //   db.query('UPDATE rooms SET status = "available" WHERE id = ?', [booking.room_id]);
          // }
          
          res.json({ message: 'Booking status updated successfully' });
        }
      );
    }
  );
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use. Please ensure no other service is running on port ${PORT} and try again.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
}); 