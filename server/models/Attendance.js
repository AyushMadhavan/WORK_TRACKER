const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkInTime: {
        type: Date
    },
    checkOutTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'leave'],
        default: 'present'
    }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
