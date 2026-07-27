const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: 'admin', username }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    return res.json({ token, username });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

module.exports = router;
