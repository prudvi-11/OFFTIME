// server.js

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config(); // load .env

const { initDb } = require('./database'); // your DB init function

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // For development
    methods: ['GET', 'POST'],
  },
});

// Map of user_id to socket.id to send targeted notifications
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (userId) => {
    const uid = Number(userId);
    userSockets.set(uid, socket.id);
    console.log(`[SOCKET] User ${uid} registered`);
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Pass IO instance to request to use in routes
app.use((req, res, next) => {
  req.io = io;
  req.userSockets = userSockets;
  next();
});

// Initialize Database safely
try {
  if (process.env.DATABASE_URL) {
    console.log('✅ DATABASE_URL loaded:', process.env.DATABASE_URL);
    initDb();
    console.log('Database initialized successfully ✅');
  } else {
    console.log(
      '⚠️ DATABASE_URL not found. Database will not initialize.'
    );
  }
} catch (err) {
  console.error('❌ Database initialization failed:', err);
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leave', require('./routes/leave'));
app.use('/api/notifications', require('./routes/notifications'));

// Start server safely
const PORT = process.env.PORT || 5000;

// Optional: check if port is in use
const serverStart = () => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

serverStart();

// Handle unhandled promise rejections / uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});