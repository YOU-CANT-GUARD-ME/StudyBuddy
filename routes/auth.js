const express = require('express');
const router = express.Router();
const User = require('../modals/user');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    try {
        const { name, username, password } = req.body;

        const user = new User({ name, username, password });
        await user.save();

        res.status(201).json({ message: "Account created" });
    } catch(err) {
        res.status(400).json({ error: "Username is already taken" });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username.toLowerCase() });

    if (user && await argon2.verify(user.password, password)) {
        const token = jwt.sign(
            { userId: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token, name: user.name });
    } else {
        res.status(401).json({ error: "username or password is incorrect" });
    }
});

module.exports = router;