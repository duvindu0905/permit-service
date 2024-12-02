// src/controllers/permitController.js
const axios = require('axios');
const Permit = require('../models/permitModel');

// Create a new permit
const createPermit = async (req, res) => {
  const {
    permitId,
    permitNumber,
    expiryAt,
    vehicleNumber,
    routeNumber,  // Use routeNumber instead of routeName
    busOwner,
    busType,
    numberCapacity,
    pricePerSeat,
    music,
    ac
  } = req.body;

  if (!routeNumber) {
    return res.status(400).json({ message: 'Route number is required' });
  }

  try {
    // Select the correct route service URL based on the environment
    const routeServiceUrl = process.env.NODE_ENV === 'production' ? process.env.ROUTE_SERVICE_URL_PRODUCTION : process.env.ROUTE_SERVICE_URL_LOCAL;

    // Fetch route data from route-service using routeNumber
    const routeResponse = await axios.get(`${routeServiceUrl}/${routeNumber}`);

    if (routeResponse.status === 200) {
      const routeData = routeResponse.data;  // Assuming the response contains full route info, including routeName

      const newPermit = new Permit({
        permitId,
        permitNumber,
        expiryAt,
        vehicleNumber,
        routeNumber,  // Store routeNumber
        routeName: routeData.routeName,  // Route name fetched from route-service
        busOwner,
        busType,
        numberCapacity,
        pricePerSeat,
        music,
        ac,
      });

      await newPermit.save();
      res.status(201).json({ message: 'Permit created successfully', permit: newPermit });
    } else {
      res.status(400).json({ message: 'Route not found' });
    }
  } catch (error) {
    console.error('Error fetching route data:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all permits
const getAllPermits = async (req, res) => {
  try {
    const permits = await Permit.find().select('-_id -__v');;
    res.status(200).json(permits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createPermit, getAllPermits };
