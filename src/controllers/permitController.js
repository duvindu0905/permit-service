// src/controllers/permitController.js
const axios = require('axios');
const Permit = require('../models/permitModel');

// Create a new permit
const createPermit = async (req, res) => {
  const { permitId, permitNumber, expiryAt, vehicleNumber, routeName, busOwner, busType, numberCapacity, pricePerSeat, music, ac } = req.body;

  try {
    // Fetch route data from route-service
    const routeResponse = await axios.get(`${process.env.ROUTE_SERVICE_URL}/route-service/${routeName}`);

    if (routeResponse.status === 200) {
      const newPermit = new Permit({
        permitId,
        permitNumber,
        expiryAt,
        vehicleNumber,
        routeName: routeResponse.data.routeName,  // Route name fetched from route-service
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all permits
const getAllPermits = async (req, res) => {
  try {
    const permits = await Permit.find();
    res.status(200).json(permits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createPermit, getAllPermits };
