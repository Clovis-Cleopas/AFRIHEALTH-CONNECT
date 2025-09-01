CREATE DATABASE afrihealth_db;
USE afrihealth_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- In real app, hash this!
  location VARCHAR(255),
  is_premium TINYINT DEFAULT 0  -- 0 free, 1 premium for monetization
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  doctor_name VARCHAR(255),
  date DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);