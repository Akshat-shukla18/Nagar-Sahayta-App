const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing, restrict in production
}));
app.use(express.json({ limit: '10mb' })); // Increase limit to handle large images
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB connection
const mongoURI = "mongodb+srv://ashukla20062006_db_user:Akshataman2000@reports.yjria5z.mongodb.net/?retryWrites=true&w=majority&appName=Reports";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true,
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

db.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

db.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

process.on('SIGINT', async () => {
  await db.close();
  console.log('Mongoose connection closed due to app termination');
  process.exit(0);
});

// Global error handling for uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Optionally exit process or attempt graceful shutdown
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally exit process or attempt graceful shutdown
});

// Routes
const reportRoutes = require('./routes/reports');
const userRoutes = require('./routes/users');
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Reports Backend API');
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
