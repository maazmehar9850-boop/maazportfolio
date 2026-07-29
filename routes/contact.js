const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmailConfigured() {
  const pass = (process.env.EMAIL_PASS || '').replace(/\s/g, '');
  return pass && pass !== 'your_gmail_app_password';
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

router.post('/', async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim();
    const subject = (req.body.subject || '').trim();
    const message = (req.body.message || '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        error: 'Please enter a valid email address (example: name@gmail.com).',
      });
    }

    if (!isEmailConfigured()) {
      return res.status(500).json({
        error: 'Email is not configured on the server. Add EMAIL_PASS in .env and restart npm start.',
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s/g, ''),
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: subject || `New message from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
          <h2>New Portfolio Contact</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject || 'Portfolio Contact')}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        </div>
      `,
    });

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact error:', err.message);

    if (err.message && err.message.includes('Invalid login')) {
      return res.status(500).json({
        error: 'Gmail login failed. Check EMAIL_PASS in .env (use Gmail App Password).',
      });
    }

    res.status(500).json({
      error: 'Could not send email right now. Please try again later.',
    });
  }
});

module.exports = router;
