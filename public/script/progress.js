// ── Score chart (Fallback Data) ─────────────────────────
const datasets = {
    '7d': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        scores: [72, 68, 75, 80, 77, 85, 82],
        accuracy: [65, 70, 72, 78, 74, 83, 80]
    },
    '30d': {
        labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
        scores: [65, 72, 78, 82],
        accuracy: [60, 68, 74, 80]
    },
    'all': {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        scores: [50, 58, 62, 68, 72, 78, 82],
        accuracy: [45, 54, 60, 65, 70, 75, 80]
    }
};

let chart;
let cachedActivity = null; // ← stores real API data for the 7d chart

// ── Chart Building Logic ────────────────────────────────
function buildChart(period, apiData = null) {
    let chartData;

    // 1. Determine which data to use: DB vs. Hardcoded
    if (apiData && apiData.length > 0) {
        chartData = {
            labels: apiData.map(item => item.date),
            scores: apiData.map(item => item.score),
            accuracy: apiData.map(item => item.accuracy)
        };
    } else {
        chartData = datasets[period];
    }

    // 2. Render Chart
    const ctx = document.getElementById('scoreChart').getContext('2d');
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: 'Score',
                    data: chartData.scores,
                    borderColor: '#85955F',
                    backgroundColor: 'rgba(133,149,95,0.08)',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#85955F',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Accuracy',
                    data: chartData.accuracy,
                    borderColor: '#c8d89a',
                    backgroundColor: 'rgba(200,216,154,0.05)',
                    borderWidth: 2,
                    pointBackgroundColor: '#c8d89a',
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: true,
                    tension: 0.4,
                    borderDash: [5, 3]
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#2d3a1a',
                    titleColor: '#d4e098',
                    bodyColor: '#a8bc74',
                    borderColor: 'rgba(168,188,116,0.2)',
                    borderWidth: 1,
                    padding: 10,
                    callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` }
                }
            },
            scales: {
                y: { min: 30, max: 100, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#b8b4a8', font: { family: 'DM Mono', size: 11 }, callback: v => v + '%' }, border: { display: false } },
                x: { grid: { display: false }, ticks: { color: '#b8b4a8', font: { family: 'DM Sans', size: 12 } }, border: { display: false } }
            }
        }
    });
}

// ── Period tab switching ────────────────────────────────
function setPeriod(btn, period) {
    document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active-tab'));
    btn.classList.add('active-tab');
    // Use cached API data for 7d, fallback to hardcoded for 30d and all
    buildChart(period, period === '7d' ? cachedActivity : null);
}

// ── Animated counters ───────────────────────────────────
function animateCounters() {
    document.querySelectorAll('.snap-num[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target);
        const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
        let current = 0;
        const step = Math.ceil(target / 40);
        const interval = setInterval(() => {
            current = Math.min(current + step, target);
            el.innerHTML = current + suffix;
            if (current >= target) clearInterval(interval);
        }, 30);
    });
}

// ── UI Interactions ─────────────────────────────────────
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.side-nav-item');
    let current = '';
    sections.forEach(s => { if (window.scrollY + 120 >= s.offsetTop) current = s.id; });
    navItems.forEach(item => {
        item.classList.remove('active-nav-item');
        if (item.getAttribute('href') === '#' + current) item.classList.add('active-nav-item');
    });
}

document.querySelectorAll('.side-nav-item').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

document.querySelector('.main-content')?.addEventListener('scroll', updateActiveNav);

// ── Auth & Modals ──────────────────────────────────────
const login = document.querySelector('.loginmodal');
const signup = document.querySelector('.signupmodal');

function updateUI() {
    const name = localStorage.getItem('userName');
    const navB = document.getElementById('navB');
    if (name) {
        navB.innerHTML = `<li style="color:white;font-family:'DM Sans',sans-serif;">Hi, ${name}</li><li id="logoutBtn" style="cursor:pointer;color:#eee;font-weight:bold;width:100px;height:100%;display:flex;justify-content:center;align-items:center;font-family:'DM Sans',sans-serif;">Logout</li>`;
        document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); window.location.reload(); };
    } else {
        navB.innerHTML = `<li class="openlogin" style="color:#eee;font-weight:bold;width:100px;height:100%;display:flex;justify-content:center;align-items:center;cursor:pointer;font-family:'DM Sans',sans-serif;">SignIn</li><li class="openSignup" style="color:#eee;font-weight:bold;width:100px;height:100%;display:flex;justify-content:center;align-items:center;cursor:pointer;font-family:'DM Sans',sans-serif;">SignUp</li>`;
        document.querySelector('.openlogin').onclick = () => { login.classList.toggle('active'); signup.classList.remove('active'); };
        document.querySelector('.openSignup').onclick = () => { signup.classList.toggle('active'); login.classList.remove('active'); };
    }
}

document.getElementById('signupForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const name = document.getElementById('signupName').value;
    const password = document.getElementById('signupPassword').value;
    const res = await fetch('/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, name, password }) });
    const data = await res.json();
    if (res.ok) { alert('Account created'); signup.classList.remove('active'); }
    else alert(data.error);
});

document.getElementById('loginForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const data = await res.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);
        alert(`Welcome, ${data.name}`);
        login.classList.remove('active');
        updateUI();
    } else alert(data.error);
});

// ── Init Dashboard Hydration ────────────────────────────
window.onload = async () => {
    updateUI();

    try {
        const res = await fetch('/api/dashboard-data', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await res.json();

        // 1. Snapshots
        document.getElementById('stat-syllabus').dataset.target = data.snapshots.syllabus;
        document.getElementById('stat-streak').dataset.target = data.snapshots.streak;
        document.getElementById('stat-studyTime').dataset.target = data.snapshots.studyTime;
        document.getElementById('stat-accuracy').dataset.target = data.snapshots.accuracy;

        // 2. Subjects
        const subjectsContainer = document.querySelector('.subjects-grid');
        subjectsContainer.innerHTML = data.subjects.map(subj => `
            <div class="subject-card">
                <div class="subj-card-top">
                    <div class="subj-card-name">${subj.name}</div>
                    <div class="subj-card-pct">${subj.pct}%</div>
                </div>
                <div class="subj-progress-track">
                    <div class="subj-progress-fill" style="width:${subj.pct}%; background:${subj.color};"></div>
                </div>
            </div>
        `).join('');

        // 3. AI Insights
        const insights = generateInsights(data.snapshots, data.subjects);
        document.querySelector('.insights-list').innerHTML = insights.map((tip, i) => {
            const types = ['insight-win', 'insight-nudge', 'insight-action', 'insight-win'];
            const icons = ['fa-trophy', 'fa-lightbulb', 'fa-triangle-exclamation', 'fa-chart-line'];
            const titles = ['Great progress!', 'Something to note', 'Watch out', 'Keep it up'];
            const type = types[i % types.length];
            return `
                <div class="insight-card ${type}">
                    <div class="insight-icon"><i class="fa-solid ${icons[i % icons.length]}"></i></div>
                    <div class="insight-body">
                        <div class="insight-title">${titles[i % titles.length]}</div>
                        <div class="insight-text">${tip}</div>
                    </div>
                </div>
            `;
        }).join('');

        // 4. Weak Areas
        const weakSubjects = [...data.subjects].sort((a, b) => a.pct - b.pct).slice(0, 3);
        document.querySelector('.weak-list').innerHTML = weakSubjects.map((s, i) => `
            <div class="weak-row">
                <div class="weak-rank">0${i + 1}</div>
                <div class="weak-info">
                    <div class="weak-name">${s.name}</div>
                    <div class="weak-meta">${s.pct}% of sessions</div>
                </div>
                <div class="weak-bar-wrap">
                    <div class="weak-bar" style="width:${s.pct}%; background:${s.pct < 40 ? '#c44a2a' : '#c47a2a'};"></div>
                </div>
                <div class="weak-score ${s.pct < 40 ? 'score-bad' : 'score-warn'}">${s.pct}%</div>
            </div>
        `).join('');

        // 5. Goals
        document.querySelector('.goals-col').innerHTML = `
            <h3 class="col-title">Current Goals</h3>
            ${buildGoals(data.snapshots)}
        `;

        // 6. Badges
        document.querySelector('.badges-grid').innerHTML = buildBadges(data.snapshots);

        // 7. Chart & Counters — cache activity data first
        cachedActivity = data.recentActivity;
        buildChart('7d', cachedActivity);
        animateCounters();

    } catch (err) {
        console.error("Dashboard failed to load:", err);
        buildChart('7d');
        animateCounters();
    }
};

// ── Helper: Generate insight messages from real data ────
function generateInsights(snapshots, subjects) {
    const tips = [];
    if (snapshots.streak >= 3)
        tips.push(`🔥 You're on a <strong>${snapshots.streak}-day streak</strong> — great consistency!`);
    else
        tips.push(`Try to study every day to build your streak. You're currently at <strong>${snapshots.streak} days</strong>.`);

    if (snapshots.accuracy >= 75)
        tips.push(`Your accuracy is strong at <strong>${snapshots.accuracy}%</strong>. Keep challenging yourself with harder topics.`);
    else
        tips.push(`Your accuracy is <strong>${snapshots.accuracy}%</strong>. Consider reviewing topics where you're making mistakes.`);

    if (subjects.length > 0) {
        const top = subjects[0];
        tips.push(`You've focused most on <strong>${top.name}</strong> (${top.pct}% of your sessions).`);
    }

    if (snapshots.syllabus < 50)
        tips.push(`You've completed <strong>${snapshots.syllabus}%</strong> of your syllabus. Try to study more consistently to catch up.`);
    else
        tips.push(`You're <strong>${snapshots.syllabus}%</strong> through your syllabus — you're more than halfway there!`);

    return tips;
}

// ── Helper: Build goal progress bars ───────────────────
function buildGoals(snapshots) {
    const goals = [
        { label: 'Complete syllabus', icon: 'fa-book', current: snapshots.syllabus, target: 100 },
        { label: '7-day study streak', icon: 'fa-fire', current: Math.min(snapshots.streak, 7), target: 7 },
        { label: 'Reach 80% accuracy', icon: 'fa-star', current: snapshots.accuracy, target: 80 }
    ];
    return goals.map(g => {
        const pct = Math.min(100, Math.round((g.current / g.target) * 100));
        const done = pct >= 100;
        return `
            <div class="goal-item">
                <div class="goal-top">
                    <div class="goal-name">
                        <i class="fa-solid ${g.icon}"></i>
                        ${g.label}
                    </div>
                    ${done
                        ? `<div class="goal-status done-status"><i class="fa-solid fa-check"></i> Done</div>`
                        : `<div class="goal-status">${g.current} / ${g.target}</div>`
                    }
                </div>
                <div class="goal-track">
                    <div class="goal-fill" style="width:${pct}%;"></div>
                </div>
                <div class="goal-detail">${pct}% complete</div>
            </div>
        `;
    }).join('');
}

// ── Helper: Build achievement badges ───────────────────
function buildBadges(snapshots) {
    const badges = [
        { icon: 'fa-fire', label: 'On Fire', earned: snapshots.streak >= 3 },
        { icon: 'fa-star', label: 'Accurate', earned: snapshots.accuracy >= 75 },
        { icon: 'fa-book-open', label: 'Halfway', earned: snapshots.syllabus >= 50 },
        { icon: 'fa-clock', label: 'Dedicated', earned: snapshots.studyTime >= 5 }
    ];
    return badges.map(b => `
        <div class="badge-item ${b.earned ? 'earned' : 'locked'}">
            <div class="badge-icon"><i class="fa-solid ${b.icon}"></i></div>
            <div class="badge-name">${b.label}</div>
        </div>
    `).join('');
}