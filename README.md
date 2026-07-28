# Maaz Mehar Portfolio

Single-page portfolio with **HTML**, **Tailwind CSS**, and **JavaScript**. Contact form sends email via Nodemailer.

## Setup

```bash
npm install
```

Create `.env` (see `.env.example`):

```
EMAIL_USER=maazmehar9850@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=maazmehar9850@gmail.com
```

## Run

```bash
npm start
```

Open http://localhost:5000

**Note:** Contact form needs the server running (`npm start`). Opening `index.html` directly will not send emails.
