const express = require('express');
const fs = require('fs');
const path = require('path');
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, issuer, year } = req.body;
    if (!title || !req.file) {
      return res.status(400).json({ error: 'Title and image are required' });
    }

    const certificate = await Certificate.create({
      title,
      issuer: issuer || '',
      year: year || '',
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });

    if (certificate.image) {
      const filePath = path.join(__dirname, '..', certificate.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ message: 'Certificate deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
