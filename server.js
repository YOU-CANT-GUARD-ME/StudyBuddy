require('dotenv').config();

console.log("KEY LOADED:", !!process.env.GEMINI_API_KEY);
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("MongoDB connection error:", err));

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const statsRoutes = require('./routes/stats');
const LeaderboardRoutes = require('./routes/leaderboard');

app.use('/api', authRoutes);
app.use('/api', chatRoutes);
app.use('/api', statsRoutes);
app.use('/api', LeaderboardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});