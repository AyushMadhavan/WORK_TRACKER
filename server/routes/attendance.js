const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};

// Check-in
router.post('/checkin', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already checked in
        const existingAttendance = await Attendance.findOne({
            user: userId,
            date: today
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        const attendance = new Attendance({
            user: userId,
            date: today,
            checkInTime: new Date(),
            status: 'present'
        });

        await attendance.save();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Check-out
router.post('/checkout', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            user: userId,
            date: today
        });

        if (!attendance) {
            return res.status(400).json({ message: 'No attendance record found for today' });
        }

        if (attendance.checkOutTime) {
            return res.status(400).json({ message: 'Already checked out' });
        }

        attendance.checkOutTime = new Date();
        await attendance.save();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get Status
router.get('/status', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await Attendance.findOne({
            user: userId,
            date: today
        });

        res.json(attendance || { status: 'absent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
