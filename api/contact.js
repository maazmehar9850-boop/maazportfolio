const nodemailer = require('nodemailer');

const allowedOrigins = new Set([
  'https://maazmehar9850-boop.github.io',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
]);

function isEmailConfigured() {
  const pass = (process.env.EMAIL_PASS || '').replace(/\s/g, '');
  return pass && pass !== 'your_gmail_app_password';
}

module.exports = async (req, res) => {
  const origin = req.headers.origin || '';
  if (allowedOrigins.has(origin) || origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
        error: 'Email is not configured on the server.',
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

    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact error:', err.message);
    return res.status(500).json({
      error: 'Could not send email right now. Please try again later.',
    });
  }
};
