// src/routes/permitRoute.js
const express = require('express');
const router = express.Router();
const {
  createPermit,
  getAllPermits,
  getPermitByPermitNumber,
  updatePermitByPermitNumber,
  deletePermitByPermitNumber
} = require('../controllers/permitController');

// Route to create a new permit (POST)
router.post('/permits', createPermit);

// Route to get all permits (GET)
router.get('/permits', getAllPermits);

// Route to get a permit by permitNumber (GET)
router.get('/permits/:permitNumber', getPermitByPermitNumber);

// Route to update a permit by permitNumber (PUT)
router.put('/permits/:permitNumber', updatePermitByPermitNumber);

// Route to delete a permit by permitNumber (DELETE)
router.delete('/permits/:permitNumber', deletePermitByPermitNumber);

module.exports = router;
