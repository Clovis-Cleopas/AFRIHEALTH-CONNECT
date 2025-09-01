const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('MySQL Connected');
});

app.post('/register', (req, res) => {
  console.log('Received /register request:', req.body);
  const { name, email, password, location } = req.body;
  const sql = 'INSERT INTO users (name, email, password, location) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, password, location], (err, result) => {
    if (err) {
      console.error('Registration error:', err);
      return res.status(500).send({ message: 'Error registering user', error: err.message });
    }
    console.log('User registered:', email);
    res.send({ message: 'User registered successfully' });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).send({ message: 'Error logging in' });
    }
    if (results.length > 0) {
      res.send(results[0]);
    } else {
      res.status(401).send({ message: 'Invalid email or password' });
    }
  });
});

app.post('/book', (req, res) => {
  const { user_id, doctor_name, date } = req.body;
  const sql = 'INSERT INTO bookings (user_id, doctor_name, date) VALUES (?, ?, ?)';
  db.query(sql, [user_id, doctor_name, date], (err, result) => {
    if (err) {
      console.error('Booking error:', err);
      return res.status(500).send({ message: 'Error creating booking' });
    }
    res.send({ message: 'Booking created successfully', booking_id: result.insertId });
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));