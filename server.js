require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'https://maazmehar9850-boop.github.io',
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use('/api/contact', contactRoutes);

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
