const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const User    = require('../modals/user');

/* ── tiny auth middleware ── */
function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'No token' });
    try {
        req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

/* ────────────────────────────────────────────
   POST /api/grade
   Body: { grade: "7" }            (grade number as string)
   Sets grade + gradeGroup on the user doc.
──────────────────────────────────────────── */
router.post('/grade', auth, async (req, res) => {
    try {
        const { grade } = req.body;
        const num = parseInt(grade, 10);
        if (!num || num < 1 || num > 12)
            return res.status(400).json({ error: 'Grade must be 1–12' });

        const gradeGroup =
            num <= 5  ? 'elementary' :
            num <= 8  ? 'middle'     : 'high';

        await User.findByIdAndUpdate(req.user.userId, { grade: String(num), gradeGroup });
        res.json({ grade: String(num), gradeGroup });
    } catch (err) {
        console.error('Grade error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

/* ────────────────────────────────────────────
   GET /api/grade
   Returns the current user's grade info.
──────────────────────────────────────────── */
router.get('/grade', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('grade gradeGroup');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ grade: user.grade, gradeGroup: user.gradeGroup });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

/* ────────────────────────────────────────────
   POST /api/leaderboard/submit
   Body: { known, seen, durationSec }
   Updates cumulative stats + best records.
──────────────────────────────────────────── */
router.post('/leaderboard/submit', auth, async (req, res) => {
    try {
        const { known = 0, seen = 0, durationSec = 0 } = req.body;
        if (seen === 0) return res.status(400).json({ error: 'No cards seen' });

        const accuracy   = Math.round((known / seen) * 100);
        const avgSpeed   = seen > 0 ? Math.round(durationSec / seen) : null; // sec per card

        const user = await User.findById(req.user.userId);
        const lb   = user.leaderboard;

        lb.totalKnown   += known;
        lb.totalSeen    += seen;
        lb.totalTimeSec += durationSec;
        lb.sessions     += 1;
        if (accuracy > lb.bestAccuracy) lb.bestAccuracy = accuracy;
        if (avgSpeed !== null && (lb.bestSpeedSec === null || avgSpeed < lb.bestSpeedSec))
            lb.bestSpeedSec = avgSpeed;

        user.markModified('leaderboard');
        await user.save();
        res.json({ message: 'Stats saved', accuracy, avgSpeed });
    } catch (err) {
        console.error('Leaderboard submit error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

/* ────────────────────────────────────────────
   GET /api/leaderboard
   Returns top 10 by a composite score.
   Score = (totalKnown / totalSeen * 100) * 0.6
           + (1 / bestSpeedSec * 1000)    * 0.4
   (higher accuracy + faster = better)
──────────────────────────────────────────── */
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find(
            { 'leaderboard.totalSeen': { $gt: 0 } },
            { name: 1, username: 1, leaderboard: 1 }
        ).lean();

        const ranked = users.map(u => {
            const lb       = u.leaderboard;
            const accuracy = lb.totalSeen > 0
                ? Math.round((lb.totalKnown / lb.totalSeen) * 100) : 0;
            const speedScore = lb.bestSpeedSec && lb.bestSpeedSec > 0
                ? Math.round(1000 / lb.bestSpeedSec) : 0;
            const composite = Math.round(accuracy * 0.6 + speedScore * 0.4);

            return {
                name:         u.name,
                username:     u.username,
                accuracy,
                bestSpeed:    lb.bestSpeedSec,   // avg sec per card (lower = better)
                totalKnown:   lb.totalKnown,
                sessions:     lb.sessions,
                bestAccuracy: lb.bestAccuracy,
                composite,
            };
        }).sort((a, b) => b.composite - a.composite).slice(0, 10);

        res.json(ranked);
    } catch (err) {
        console.error('Leaderboard fetch error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;