const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = new mongoose.Schema({
    name:     { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    grade:    { type: String, default: null }, // e.g. "3", "7", "11"
    gradeGroup: { type: String, default: null }, // "elementary" | "middle" | "high"
    leaderboard: {
        totalKnown:    { type: Number, default: 0 },
        totalSeen:     { type: Number, default: 0 },
        totalTimeSec:  { type: Number, default: 0 }, // cumulative seconds across sessions
        sessions:      { type: Number, default: 0 },
        bestAccuracy:  { type: Number, default: 0 }, // best single-session %
        bestSpeedSec:  { type: Number, default: null }, // best avg seconds-per-card
    }
});

userSchema.pre('save', async function() {
    if (this.isModified('password')) {
        this.password = await argon2.hash(this.password);
    }
});

module.exports = mongoose.model('User', userSchema);