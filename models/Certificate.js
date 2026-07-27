const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, default: '' },
    year: { type: String, default: '' },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
