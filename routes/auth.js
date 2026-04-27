const express = require('express');
const router = express.Router();
const User = require('../modals/user'); // Up one level, then into modals
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const API_BASE = "https://studybuddy-2na1.onrender.com";

// SIGNUP
router.post('/signup', async (req, res) => {
    console.log("Body received:", req.body); // Check if this is {}
    try {
        const { name, username, password } = req.body;
        
        if (!name || !username || !password) {
            console.log("Missing fields!");
            return res.status(400).json({ error: "All fields required" });
        }

        const existingUser = await User.findOne({ username: username.toLowerCase() });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const newUser = new User({ name, username, password });
        await newUser.save();
        res.status(201).json({ message: "User created" });
    } catch (err) {
        console.error("Signup Error:", err); // This shows the REAL error in your terminal
        res.status(500).json({ error: "Server error" });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username.toLowerCase() });

        if (user && await argon2.verify(user.password, password)) {
            const token = jwt.sign(
                { userId: user._id, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            res.json({ token, name: user.name });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Login Error:", err); // This shows the REAL error in your terminal
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;