const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialize Environment Variables
dotenv.config();

const server = express();
const SERVER_PORT = process.env.PORT || 5000;

// -- Middleware Configuration --
server.use(cors());
server.use(express.json());

// -- Database Connection --
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};
connectDB();

// -- Route Definitions --
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

server.use('/api/auth', authRoutes);
server.use('/api/attendance', attendanceRoutes);
server.use('/api/tasks', taskRoutes);
server.use('/api/users', userRoutes);

// Root Endpoint
server.get('/', (req, res) => {
    res.send('Work Tracker API is running...');
});

// Start Server (if not in Vercel environment)
if (require.main === module) {
    server.listen(SERVER_PORT, () => {
        console.log(`Server is active on port ${SERVER_PORT}`);
    });
}

module.exports = server;
