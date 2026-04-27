const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();
const Chat = require('../modals/chat');

router.get('/stats', async (req, res) => {
    try {
        // Aggregation: Group chats by date (YYYY-MM-DD)
        const stats = await Chat.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    totalMessages: { $sum: 1 } // Counting chats as a "score"
                }
            },
            { $sort: { "_id": 1 } }, // Sort chronologically
            { $limit: 7 }, // Get the last 7 days
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    // Simple formula: Score = count * 10 (capping at 100)
                    score: { $min: [100, { $multiply: ["$totalMessages", 10] }] },
                    // Accuracy is just a slight variation of the score for visualization
                    accuracy: { $min: [95, { $multiply: ["$totalMessages", 8] }] }
                }
            }
        ]);

        res.json({ recentActivity: stats });
    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

router.get('/dashboard-data', async (req, res) => {
    // 1. Verify token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not logged in' });

    let userId;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = new mongoose.Types.ObjectId(decoded.userId); // ← matches how you signed it
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }

    try {
        // 2. Recent Activity
        const recentActivity = await Chat.aggregate([
            { $match: { userId } },
            { $sort: { createdAt: -1 } },
            { $limit: 50 },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalMessages: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } },
            { $limit: 7 },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    score: { $min: [100, { $multiply: ["$totalMessages", 5] }] },
                    accuracy: { $min: [95, { $multiply: ["$totalMessages", 4] }] }
                }
            }
        ]);

        // 3. Unique study days
        const studyTimeDays = await Chat.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                }
            },
            { $count: "uniqueDays" }
        ]);
        const uniqueDays = studyTimeDays[0]?.uniqueDays || 0;

        // 4. Streak
        const allDays = await Chat.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
                }
            },
            { $sort: { "_id": -1 } }
        ]);

        let streak = 0;
        const today = new Date();
        for (let i = 0; i < allDays.length; i++) {
            const expected = new Date(today);
            expected.setDate(today.getDate() - i);
            const expectedStr = expected.toISOString().split('T')[0];
            if (allDays[i]._id === expectedStr) streak++;
            else break;
        }

        // 5. Snapshots
        const syllabusCompleted = Math.min(100, Math.round((uniqueDays / 30) * 100));
        const avgAccuracy = recentActivity.length
            ? Math.round(recentActivity.reduce((sum, d) => sum + d.accuracy, 0) / recentActivity.length)
            : 0;

        // 6. Subjects
        const subjectAgg = await Chat.aggregate([
            { $match: { userId, subject: { $exists: true, $ne: null } } },
            { $group: { _id: "$subject", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const subjectColors = ['#85955F', '#c8d89a', '#a8bc74', '#6b7c47', '#d4e098'];
        const totalSubjectMsgs = subjectAgg.reduce((s, x) => s + x.count, 0) || 1;
        const subjects = subjectAgg.length > 0
            ? subjectAgg.map((s, i) => ({
                name: s._id,
                pct: Math.round((s.count / totalSubjectMsgs) * 100),
                color: subjectColors[i % subjectColors.length]
            }))
            : [{ name: 'General Study', pct: 100, color: '#85955F' }];

        res.json({
            snapshots: {
                syllabus: syllabusCompleted,
                streak,
                studyTime: Math.round(uniqueDays * 0.5),
                accuracy: avgAccuracy
            },
            recentActivity,
            subjects
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
});

router.get('/history', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not logged in' });

    let userId;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = new mongoose.Types.ObjectId(decoded.userId);
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }

    try {
        const { subject, sessionId } = req.query;

        // If sessionId provided, return just that session's messages
        if (sessionId) {
            const history = await Chat.find({ userId, sessionId })
                .sort({ createdAt: 1 })
                .select('message reply subject createdAt');
            return res.json({ history });
        }

        // Otherwise return a list of sessions for the sidebar
        const filter = { userId };
        if (subject) filter.subject = subject;

        const sessions = await Chat.aggregate([
            { $match: filter },
            { $sort: { createdAt: 1 } },
            {
                $group: {
                    _id: "$sessionId",
                    firstMessage: { $first: "$message" },  // use as session title
                    subject: { $first: "$subject" },
                    createdAt: { $first: "$createdAt" }
                }
            },
            { $sort: { createdAt: -1 } },  // newest first
            { $limit: 20 }
        ]);

        res.json({ sessions });
    } catch (err) {
        console.error("History Error:", err);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});
module.exports = router;