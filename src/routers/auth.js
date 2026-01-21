// routes/auth.js (Updated with protected route example)
import express from 'express';
import { register, verifyOTP, login } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js'; // Import middleware

const authRouter = express.Router();

// POST /api/auth/register - Send OTP
authRouter.post('/register', register);

// POST /api/auth/verify-otp - Verify OTP and register
authRouter.post('/verify-otp', verifyOTP);

// POST /api/auth/login - Login
authRouter.post('/login', login);

// Example protected route (requires JWT)
authRouter.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Protected profile data', userId: req.user.userId });
});

export default authRouter;