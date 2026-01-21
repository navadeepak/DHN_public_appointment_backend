import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load .env and log vars (for debug)
dotenv.config();
console.log('Loaded EMAIL_USER:', process.env.EMAIL_USER ? 'Yes' : 'No (missing)');
console.log('Loaded EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'Missing');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('Fix: Add EMAIL_USER and EMAIL_PASS to .env in backend root');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'navadeepakaswin007@gmail.com',  // Your test email
  subject: 'Test OTP from Nodemailer',
  text: 'Test code: 999999\nThis is a test email to verify SMTP setup.'
}, (error, info) => {
  if (error) {
    console.error('Test Error:', error.message);
  } else {
    console.log('Test Success:', info.response);
  }
});