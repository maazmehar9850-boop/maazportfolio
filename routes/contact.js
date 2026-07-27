const express = require('express');
const nodemailer = require('nodemailer');
const Message = require('../models/Message');

const router = express.Router();

function isEmailConfigured() {
  const pass = process.env.EMAIL_PASS || '';
  return (
    pass &&
    pass !== 'your_gmail_app_password' &&
    !pass.includes('your_gmail')
  );
}

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    await Message.create({
      name,
      email,
      subject: subject || 'Portfolio Contact',
      message,
    });

    if (!isEmailConfigured()) {
      console.warn(
        'Contact saved to MongoDB, but EMAIL_PASS is not set. Add a Gmail App Password in .env to send email.'
      );
      return res.json({
        message:
          'Message saved. Email is not configured yet — add a Gmail App Password to EMAIL_PASS in .env.',
        emailSent: false,
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
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'Portfolio Contact'}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${message}</p>
        </div>
      `,
    });

    res.json({ message: 'Message sent successfully', emailSent: true });
  } catch (err) {
    console.error('Contact error:', err.message);

    if (err.message && err.message.includes('Invalid login')) {
      return res.status(500).json({
        error:
          'Gmail login failed. EMAIL_PASS must be a 16-character Gmail App Password (not your normal Gmail or admin password).',
      });
    }

    res.status(500).json({
      error: 'Could not process your message. Please try again later.',
    });
  }
});

module.exports = router;
