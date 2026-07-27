# Maaz Mehar Portfolio

Full-stack portfolio with glassmorphism UI, admin uploads (projects & certificates), MongoDB storage, and Nodemailer contact form.

## Setup

1. **Install MongoDB** and make sure it is running locally.

2. **Install dependencies**

```bash
npm install
```

3. **Configure `.env`** (already created with your MongoDB URL)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maazportfolio
JWT_SECRET=change_this
ADMIN_USERNAME=maazmehar9850@gmail.com
ADMIN_PASSWORD=your_admin_password
EMAIL_USER=maazmehar9850@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=maazmehar9850@gmail.com
```

### Gmail App Password (required for contact form)

1. Enable 2-Step Verification on your Google account  
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)  
3. Create an app password for "Mail"  
4. Paste it into `EMAIL_PASS` in `.env` (not your normal Gmail password)

4. **Start the server**

```bash
npm start
```

- Portfolio: http://localhost:5000  
- Admin panel: http://localhost:5000/admin  

Admin login is set in `.env` (`ADMIN_USERNAME` / `ADMIN_PASSWORD`).

## Admin features

- Upload project images, titles, descriptions, tech tags, live/GitHub links  
- Upload certificate images with issuer & year  
- Delete projects or certificates  
- Content appears live on the public portfolio  

## Optional profile images

Place these files in the `uploads` folder if you have them:

- `uploads/profile.jpg` — hero image  
- `uploads/about.jpg` — about section image  

## Scripts

- `npm start` — run server  
- `npm run dev` — run with auto-restart (`node --watch`)
