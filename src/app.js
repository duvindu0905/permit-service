const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');  // MongoDB connection
const permitRoutes = require('./routes/permitRoute');  // Routes for permit-service
const swaggerDocument = require('../swagger/swagger.json');  // Swagger documentation

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());  // To parse JSON request bodies

// Connect to MongoDB
connectDB();

// Base route for health check
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Permit Service API!' });
});

// Serve Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use permit routes
app.use('/permit-service', permitRoutes);

// Fallback route for undefined paths
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log the error for debugging purposes
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
