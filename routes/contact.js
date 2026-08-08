const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

function isEmailConfigured() {
  const pass = (process.env.EMAIL_PASS || '').replace(/\s/g, '');
  return pass && pass !== 'your_gmail_app_password';
}

router.post('/', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim();
    const subject = String(req.body.subject || '').trim();
    const message = String(req.body.message || '').trim();

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    if (!isEmailConfigured()) {
      return res.status(500).json({
        error: 'Email not configured. Add Gmail App Password to EMAIL_PASS in .env file.',
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: (process.env.EMAIL_PASS || '').replace(/\s/g, ''),
      },
    });

    const recipient = process.env.EMAIL_TO || 'maazmehar9850@gmail.com';

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: recipient,
      replyTo: email,
      subject: subject || `New message from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
          <h2>New Portfolio Contact</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'Portfolio Contact'}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${message}</p>
        </div>
      `,
    });

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact error:', err.message);
    res.status(500).json({
      error: 'Could not send email. Check EMAIL_PASS in .env (Gmail App Password).',
    });
  }
});

module.exports = router;
