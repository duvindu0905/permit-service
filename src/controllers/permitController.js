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

  // Validate if permitId already exists
  try {
    const existingPermit = await Permit.findOne({ permitId });
    if (existingPermit) {
      return res.status(400).json({ message: `Permit with ID ${permitId} already exists` });
    }

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
    const permits = await Permit.find().select('-_id -__v');  // Exclude _id and __v
    res.status(200).json(permits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a permit by permitNumber
const getPermitByPermitNumber = async (req, res) => {
  const { permitNumber } = req.params;

  if (!permitNumber) {
    return res.status(400).json({ message: 'Permit number is required' });
  }

  try {
    const permit = await Permit.findOne({ permitNumber }).select('-_id -__v');  // Exclude _id and __v

    if (!permit) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    res.status(200).json(permit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a permit by permitNumber
const updatePermitByPermitNumber = async (req, res) => {
  const { permitNumber } = req.params;
  const { permitId, expiryAt, vehicleNumber, routeNumber, busOwner, busType, numberCapacity, pricePerSeat, music, ac } = req.body;

  if (!permitNumber) {
    return res.status(400).json({ message: 'Permit number is required' });
  }

  try {
    const permit = await Permit.findOne({ permitNumber });

    if (!permit) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    permit.permitId = permitId || permit.permitId;
    permit.expiryAt = expiryAt || permit.expiryAt;
    permit.vehicleNumber = vehicleNumber || permit.vehicleNumber;
    permit.routeNumber = routeNumber || permit.routeNumber;
    permit.busOwner = busOwner || permit.busOwner;
    permit.busType = busType || permit.busType;
    permit.numberCapacity = numberCapacity || permit.numberCapacity;
    permit.pricePerSeat = pricePerSeat || permit.pricePerSeat;
    permit.music = music || permit.music;
    permit.ac = ac || permit.ac;

    await permit.save();
    res.status(200).json({ message: 'Permit updated successfully', permit });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a permit by permitNumber
const deletePermitByPermitNumber = async (req, res) => {
  const { permitNumber } = req.params;

  if (!permitNumber) {
    return res.status(400).json({ message: 'Permit number is required' });
  }

  try {
    const permit = await Permit.findOneAndDelete({ permitNumber });

    if (!permit) {
      return res.status(404).json({ message: 'Permit not found' });
    }

    res.status(200).json({ message: 'Permit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createPermit, getAllPermits, getPermitByPermitNumber, updatePermitByPermitNumber, deletePermitByPermitNumber };
