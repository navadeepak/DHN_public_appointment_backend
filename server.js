import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import routes from "./src/routers/routes.js";
import session from 'express-session';
import authRoutes from './src/routers/auth.js';

dotenv.config();

const app = express();

// Fixed CORS: Allow frontend origin + credentials for session cookies
const allowedOrigins = [
  "https://dentalhealthnet.com",
  "https://dhnappointment.dentalhealthnet.com",
  "https://admin.dentalhealthnet.com",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session config (unchanged, but log for debug)
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // dev http
    httpOnly: true,
    maxAge: 30 * 60 * 1000 // 30 min
  }
}));

// Log session (unchanged)
app.use((req, res, next) => {
  console.log('--- Request ---');
  console.log('Method:', req.method, 'Path:', req.path);
  console.log('Session ID:', req.sessionID);
  console.log('Temp User in session:', !!req.session.tempUser);
  next();
});

// DB & Routes (unchanged)
connectDB();
app.use('/', routes);
app.use('/auth', authRoutes);

// Error & 404 (unchanged)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});