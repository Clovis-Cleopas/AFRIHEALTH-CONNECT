const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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

app.post('/ai-tip', async (req, res) => {
  const { symptoms } = req.body;
  console.log('Received /ai-tip request:', req.body);
  if (!symptoms) {
    return res.status(400).send({ message: 'Symptoms are required' });
  }
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Provide basic, non-medical health advice for these symptoms in rural Africa: ${symptoms}. Focus on SDG3, suggest home remedies, and advise when to see a doctor. Keep it simple, culturally sensitive, and under 100 words.`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text) {
      return res.status(500).send({ message: 'No response from AI model' });
    }
    res.send({ tip: text });
  } catch (err) {
    console.error('AI error:', err);
    res.status(500).send({ message: 'Error generating AI tip', error: err.message });
  }
});

app.post('/register', (req, res) => {
  console.log('Received /register request:', req.body);
  const { name, email, password, location } = req.body;
  const sql = 'INSERT INTO users (name, email, password, location) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, password, location], (err, result) => {
    if (err) {
      console.error('Registration error:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).send({ message: 'Email already registered' });
      }
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
  console.log('Received /book request:', req.body);
  if (!user_id || !date) {
    return res.status(400).send({ message: 'Missing required fields: user_id and date are required' });
  }
  const sql = 'INSERT INTO bookings (user_id, doctor_name, date) VALUES (?, ?, ?)';
  db.query(sql, [user_id, doctor_name, date], (err, result) => {
    if (err) {
      console.error('Booking error:', err);
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).send({ message: 'Invalid user_id: User does not exist' });
      }
      return res.status(500).send({ message: 'Error creating booking', error: err.message });
    }
    console.log('Booking created:', result.insertId);
    res.send({ message: 'Booking created successfully', booking_id: result.insertId });
  });
});

app.post('/upgrade', (req, res) => {
  const { user_id } = req.body;
  console.log('Received /upgrade request:', req.body);
  if (!user_id) {
    return res.status(400).send({ message: 'Missing user_id' });
  }
  const sql = 'UPDATE users SET is_premium = 1 WHERE id = ?';
  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error('Upgrade error:', err);
      return res.status(500).send({ message: 'Error upgrading to premium', error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    console.log('User upgraded to premium:', user_id);
    res.send({ message: 'Premium upgrade successful' });
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));