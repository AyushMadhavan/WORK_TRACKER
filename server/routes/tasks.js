const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

// Middleware (reuse or import)
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

// Get Tasks for User
router.get('/', auth, async (req, res) => {
    try {
        // If admin, maybe return all tasks? Or just tasks assigned to them?
        // For now, let's keep it simple: tasks assigned to the user.
        // But Admin needs to see all tasks or tasks they created?
        // Let's allow admin to see all tasks if they want, or just stick to assigned.
        // Requirement: "Admin dashboard to assign tasks".

        // If admin, return all tasks (or maybe filter by query param later)
        // For now, if admin, return ALL tasks so they can sanction them.
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task.find();
        } else {
            tasks = await Task.find({ assignedTo: req.user.id });
        }
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create Task (Admin only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { title, description, assignedTo } = req.body;
        const newTask = new Task({
            title,
            description,
            assignedTo,
            status: 'pending'
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update Task (Status/Time/Sanction)
router.put('/:id', auth, async (req, res) => {
    try {
        const { status, timeLog, adminStatus } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check permissions
        if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (status) {
            task.status = status;
            // If employee moves task back to in-progress or pending from completed, reset admin sanction
            if (status !== 'completed') {
                task.adminStatus = 'pending';
                task.sanctionedAt = undefined;
            }
        }

        if (timeLog) {
            task.timeLogs.push(timeLog);
        }

        // Admin Sanctioning
        if (adminStatus && req.user.role === 'admin') {
            task.adminStatus = adminStatus;
            if (adminStatus === 'approved') {
                task.sanctionedAt = new Date();
            }
        }

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
