const express = require('express');
const router = express.Router();
const Chat = require('../modals/chat');
const jwt = require('jsonwebtoken');

// ── Auth middleware ─────────────────────────────────────
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not logged in' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: decoded.userId };
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const subjectSystemPrompts = {
    general: "You are StudyBuddy, a friendly AI tutor. Explain concepts clearly.",
    math: "You are a patient math tutor. Show all working step by step.",
    science: "You are a science tutor. Use real-world analogies and explain mechanisms clearly.",
    history: "You are a history tutor. Provide context, explain causes and effects, and highlight key figures.",
    english: "You are an English and literature tutor. Help with essay writing, grammar, and analysis.",
    coding: "You are a coding tutor. Explain programming concepts clearly, use simple code examples, and show working code."
};

router.post('/chat', authMiddleware, async (req, res) => {
    try {
        const { message, subject, history = [], sessionId } = req.body; // ← receive history from frontend

        const systemPrompt = subjectSystemPrompts[subject] || subjectSystemPrompts.general;

        // Build messages array with full history + new message
        const messages = [
            ...history,                              // previous exchanges
            { role: 'user', content: message }      // current message
        ];

        // Switch to /api/chat which supports conversation history
        const response = await fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3",
                system: systemPrompt,
                messages: messages,
                stream: false
            })
        });

        const data = await response.json();
        const aiReply = data.message.content; // ← different field from /api/generate

        const newChat = new Chat({
            userId: req.user._id,
            sessionId: sessionId,  // ← save it
            message: message,
            reply: aiReply,
            subject: subject
        });
        await newChat.save();

        res.json({ reply: aiReply });

    } catch (err) {
        console.error("Chat Error:", err);
        res.status(500).json({ error: "Local AI error" });
    }
});

module.exports = router;