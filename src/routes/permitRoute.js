// src/routes/permitRoute.js
const express = require('express');
const { createPermit, getAllPermits } = require('../controllers/permitController');
const router = express.Router();

// Route to create a new permit
router.post('/', createPermit);

// Route to get all permits
router.get('/', getAllPermits);

module.exports = router;
