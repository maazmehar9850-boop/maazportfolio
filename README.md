# Maaz Mehar — Portfolio

A modern, responsive developer portfolio built with a glassmorphism UI. The site showcases skills, projects, services, and includes a contact form powered by a lightweight Node.js backend.

## Features

- **Glassmorphism design** — transparent cards, gradient glows, and smooth animations
- **Fully responsive** — optimized for mobile, tablet, and desktop
- **Interactive sections** — hero typing effect, scroll animations, and mobile navigation
- **Contact form** — sends messages to your inbox via Nodemailer (Gmail)
- **Single-page layout** — fast, clean, and easy to maintain

## Tech Stack

| Layer      | Technologies                          |
| ---------- | ------------------------------------- |
| Frontend   | HTML5, Tailwind CSS, JavaScript       |
| Animations | AOS, Typed.js, Font Awesome           |
| Backend    | Node.js, Express                      |
| Email      | Nodemailer (Gmail SMTP)               |

## Project Structure

```
maazportfolio/
├── index.html          # Main portfolio page
├── profile.jpg         # Hero section photo
├── about.jpg           # About section photo
├── server.js           # Express server
├── routes/
│   └── contact.js      # Contact form API
├── package.json
├── .env.example        # Environment variable template
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A Gmail account with **2-Step Verification** enabled
- A Gmail **App Password** for sending emails

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/maazmehar9850-boop/maazportfolio.git
   cd maazportfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your environment file:

   ```bash
   cp .env.example .env
   ```

4. Open `.env` and fill in your own values (never commit this file):

   | Variable     | Description                              |
   | ------------ | ---------------------------------------- |
   | `PORT`       | Server port (default: `5000`)            |
   | `EMAIL_USER` | Your Gmail address                       |
   | `EMAIL_PASS` | Gmail App Password (16 characters)       |
   | `EMAIL_TO`   | Recipient email for contact form messages |

### Gmail App Password

1. Enable **2-Step Verification** on your Google account.
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords).
3. Generate a password for **Mail**.
4. Paste the 16-character password into `EMAIL_PASS` in your `.env` file.

> **Important:** Use a Gmail App Password, not your regular Gmail password.

## Usage

Start the development server:

```bash
npm start
```

Open your browser and visit:

```
http://localhost:5000
```

> **Note:** The contact form requires the server to be running. Opening `index.html` directly in the browser will not send emails.

## Security

- **Never commit** `.env` or any file containing passwords, API keys, or secrets.
- `.env` is listed in `.gitignore` and should stay local only.
- Use `.env.example` as a template with placeholder values for sharing setup instructions.
- Rotate your Gmail App Password if it is ever exposed.

## License

This project is for personal portfolio use.

## Author

**Maaz Mehar** — Web Developer & MERN Stack Developer
