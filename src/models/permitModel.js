// src/models/permitModel.js
const mongoose = require('mongoose');

const permitSchema = new mongoose.Schema({
  permitId: { type: Number, required: true },
  permitNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiryAt: { type: Date, required: true },
  vehicleNumber: { type: String, required: true },
  routeName: { type: String, required: true },
  busOwner: { type: String, required: true },
  busType: { type: String, required: true },
  numberCapacity: { type: Number, required: true },
  pricePerSeat: { type: Number, required: true },
  music: { type: Boolean, default: false },
  ac: { type: Boolean, default: false },
});

// Automatically remove _id and __v from response
permitSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Permit = mongoose.model('Permit', permitSchema);

module.exports = Permit;
