// ── Card data by grade group ─────────────────────────────────────────────
const cardsByGroup = {
    elementary: [
        { subject:'math',    q:'What is 7 × 8?',                                       a:'56',                              choices:['48','54','56','63'] },
        { subject:'math',    q:'What shape has 3 sides?',                               a:'Triangle',                        choices:['Square','Triangle','Circle','Rectangle'] },
        { subject:'math',    q:'What is half of 20?',                                   a:'10',                              choices:['5','8','10','12'] },
        { subject:'math',    q:'What is 100 − 37?',                                     a:'63',                              choices:['57','63','67','73'] },
        { subject:'math',    q:'How many sides does a hexagon have?',                   a:'6',                               choices:['4','5','6','8'] },
        { subject:'science', q:'What do plants need to make food?',                     a:'Sunlight, water, and CO₂',        choices:['Soil and rain','Sunlight, water, and CO₂','Oxygen and sugar','Wind and minerals'] },
        { subject:'science', q:'What is the largest planet in our solar system?',       a:'Jupiter',                         choices:['Saturn','Earth','Jupiter','Neptune'] },
        { subject:'science', q:'What state of matter is ice?',                          a:'Solid',                           choices:['Liquid','Gas','Solid','Plasma'] },
        { subject:'science', q:'How many legs does an insect have?',                    a:'6',                               choices:['4','6','8','10'] },
        { subject:'science', q:'What do you call animals that eat only plants?',        a:'Herbivores',                      choices:['Carnivores','Omnivores','Herbivores','Predators'] },
        { subject:'history', q:'Who was the first President of the United States?',     a:'George Washington',               choices:['Abraham Lincoln','George Washington','Thomas Jefferson','John Adams'] },
        { subject:'history', q:'What country is known as the Land of the Rising Sun?',  a:'Japan',                           choices:['China','Japan','Korea','Vietnam'] },
        { subject:'history', q:'What holiday celebrates American independence?',         a:'The 4th of July',                 choices:['Thanksgiving','Memorial Day','The 4th of July','Labor Day'] },
        { subject:'english', q:'What is a noun?',                                       a:'A person, place, or thing',       choices:['An action word','A describing word','A person, place, or thing','A connecting word'] },
        { subject:'english', q:'What punctuation ends a question?',                     a:'?',                               choices:['.','!','?',','] },
        { subject:'english', q:'Which word is a verb: run, red, happy, book?',          a:'Run',                             choices:['Red','Happy','Run','Book'] },
        { subject:'coding',  q:'What does a computer use to store information?',        a:'Memory / Storage',                choices:['A keyboard','Memory / Storage','A monitor','A mouse'] },
        { subject:'coding',  q:'What is a "bug" in coding?',                            a:'An error or mistake in the code', choices:['A type of computer','An error or mistake in the code','A small program','A fast computer'] },
    ],
    middle: [
        { subject:'math',    q:'What is the quadratic formula?',                        a:'x = (−b ± √(b²−4ac)) / 2a',      choices:['x = b/2a','x = (−b ± √(b²−4ac)) / 2a','x = a² + b²','x = (b ± 4ac) / a'] },
        { subject:'math',    q:'What is the Pythagorean theorem?',                      a:'a² + b² = c²',                   choices:['a + b = c','a² − b² = c²','a² + b² = c²','2a + 2b = c'] },
        { subject:'math',    q:'What is a prime number?',                               a:'A number with no divisors other than 1 and itself', choices:['A number divisible by 2','An even number','A number with no divisors other than 1 and itself','A number greater than 100'] },
        { subject:'math',    q:'What is the area of a circle?',                         a:'A = πr²',                        choices:['A = 2πr','A = πd','A = πr²','A = r²'] },
        { subject:'math',    q:'Solve: 3x + 5 = 20. What is x?',                       a:'x = 5',                           choices:['x = 3','x = 5','x = 7','x = 15'] },
        { subject:'science', q:"What is Newton's Second Law?",                          a:'F = ma',                          choices:['E = mc²','F = mv','F = ma','P = mv'] },
        { subject:'science', q:'What is photosynthesis?',                               a:'Converting sunlight + CO₂ + water → glucose + O₂', choices:['Breaking down food for energy','Converting sunlight + CO₂ + water → glucose + O₂','Absorbing minerals from soil','Releasing CO₂ at night'] },
        { subject:'science', q:"Mitosis vs meiosis — key difference?",                  a:'Mitosis → 2 identical cells; Meiosis → 4 unique haploid cells', choices:['Mitosis is in plants only','Mitosis → 2 identical cells; Meiosis → 4 unique haploid cells','Meiosis makes body cells','They are the same process'] },
        { subject:'science', q:"What causes Earth's seasons?",                          a:"Earth's 23.5° axial tilt",        choices:['Distance from the sun','Speed of Earth\'s orbit','Earth\'s 23.5° axial tilt','The moon\'s gravity'] },
        { subject:'history', q:'When did World War II end?',                            a:'1945',                            choices:['1939','1942','1945','1950'] },
        { subject:'history', q:'What was the Renaissance?',                             a:'A European cultural revival (~14th–17th c.) focused on art and humanism', choices:['A Greek military campaign','A European cultural revival (~14th–17th c.) focused on art and humanism','An industrial revolution in England','A religious reform movement'] },
        { subject:'history', q:'What caused World War I?',                              a:'Militarism, Alliances, Imperialism, Nationalism (MAIN) + assassination of Franz Ferdinand', choices:['The Great Depression','A nuclear arms race','Militarism, Alliances, Imperialism, Nationalism (MAIN) + assassination of Franz Ferdinand','A trade war between Britain and France'] },
        { subject:'english', q:'What is a metaphor?',                                   a:'A direct comparison without "like" or "as"', choices:['A comparison using "like" or "as"','An exaggeration for effect','A direct comparison without "like" or "as"','A word that imitates a sound'] },
        { subject:'english', q:'What is a thesis statement?',                           a:'A specific arguable sentence stating the main claim of an essay', choices:['The last sentence of an essay','A question posed in the intro','A specific arguable sentence stating the main claim of an essay','A summary of all body paragraphs'] },
        { subject:'coding',  q:'== vs === in JavaScript?',                              a:'== checks value with coercion; === checks value AND type strictly', choices:['They are identical','== is stricter than ===','== checks value with coercion; === checks value AND type strictly','=== is only for numbers'] },
        { subject:'coding',  q:'What does CSS stand for?',                              a:'Cascading Style Sheets',          choices:['Computer Style System','Creative Styling Script','Cascading Style Sheets','Colorful Screen Styling'] },
        { subject:'coding',  q:'let vs const in JavaScript?',                           a:'let is reassignable; const cannot be reassigned',  choices:['const is faster than let','let is block-scoped only in loops','let is reassignable; const cannot be reassigned','They are the same'] },
    ],
    high: [
        { subject:'math',    q:'What is the derivative of sin(x)?',                    a:'cos(x)',                          choices:['−cos(x)','tan(x)','cos(x)','sin(x)'] },
        { subject:'math',    q:'What does differentiation mean in calculus?',           a:"Finding the rate of change — f'(x) = nxⁿ⁻¹ for f(x) = xⁿ", choices:["Finding area under a curve","Finding the rate of change — f'(x) = nxⁿ⁻¹ for f(x) = xⁿ","Solving for x in an equation","Graphing a function"] },
        { subject:'math',    q:'What is Euler\'s formula?',                             a:'e^(iπ) + 1 = 0',                 choices:['e = mc²','F = ma','e^(iπ) + 1 = 0','a² + b² = c²'] },
        { subject:'math',    q:'What is the integral of 1/x?',                         a:'ln|x| + C',                       choices:['1/x² + C','e^x + C','ln|x| + C','x + C'] },
        { subject:'math',    q:'What is the limit definition of a derivative?',         a:'lim(h→0) [f(x+h) − f(x)] / h',  choices:['lim(x→0) f(x)/x','f(x+1) − f(x)','lim(h→0) [f(x+h) − f(x)] / h','f\'(x) = f(x) + h'] },
        { subject:'science', q:'What is the ideal gas law?',                            a:'PV = nRT',                       choices:['E = hf','F = ma','PV = nRT','ΔG = ΔH − TΔS'] },
        { subject:'science', q:'What is natural selection?',                            a:'Individuals with favorable traits survive and reproduce more, passing traits on', choices:['Random genetic mutations','Species adapting by choice','Individuals with favorable traits survive and reproduce more, passing traits on','The strongest organism always survives'] },
        { subject:'science', q:'What is the difference between DNA and RNA?',           a:'DNA is double-stranded, uses thymine; RNA is single-stranded, uses uracil', choices:['RNA is found in the nucleus; DNA is not','DNA is single-stranded; RNA is double-stranded','DNA is double-stranded, uses thymine; RNA is single-stranded, uses uracil','They are chemically identical'] },
        { subject:'science', q:'What is activation energy?',                            a:'The minimum energy needed to start a chemical reaction', choices:['Energy released by a reaction','The energy of the products','The minimum energy needed to start a chemical reaction','The heat generated during combustion'] },
        { subject:'history', q:'What was the Cold War?',                                a:'1947–1991 ideological standoff between the USA and USSR — arms race, proxy wars', choices:['A war fought in Arctic regions','A trade conflict between Europe and Asia','1947–1991 ideological standoff between the USA and USSR — arms race, proxy wars','A naval battle in the Pacific'] },
        { subject:'history', q:'What were the causes of the French Revolution?',        a:'Financial crisis, Enlightenment ideas, social inequality, weak monarchy', choices:['Napoleonic ambition','A foreign invasion of France','Financial crisis, Enlightenment ideas, social inequality, weak monarchy','Religious conflict between Catholics and Protestants'] },
        { subject:'history', q:'What was the Silk Road?',                               a:'Ancient trade routes connecting East Asia to the Mediterranean (~2nd BCE–15th CE)', choices:['A Roman road through Europe','Ancient trade routes connecting East Asia to the Mediterranean (~2nd BCE–15th CE)','A sea route discovered by Columbus','A Chinese wall built for defense'] },
        { subject:'english', q:'What is iambic pentameter?',                            a:"10 syllables per line in 5 unstressed/stressed pairs — used by Shakespeare", choices:["Rhyming couplets in 8 syllables","10 syllables per line in 5 unstressed/stressed pairs — used by Shakespeare","A 14-line poem about love","Free verse with no meter"] },
        { subject:'english', q:'What is a foil character?',                             a:'A character who contrasts with another to highlight their traits', choices:['The main antagonist','A narrator outside the story','A character who contrasts with another to highlight their traits','A comic relief character'] },
        { subject:'english', q:'What\'s the difference between "affect" and "effect"?', a:'"Affect" is usually a verb; "Effect" is usually a noun', choices:['"Effect" is a verb; "Affect" is a noun','They are interchangeable','"Affect" is usually a verb; "Effect" is usually a noun','"Affect" means to cause; "effect" means to feel'] },
        { subject:'coding',  q:'What is Big O notation?',                               a:'A measure of algorithm time/space complexity as input n grows', choices:['A grading system for code quality','How many lines of code a program has','A measure of algorithm time/space complexity as input n grows','The number of bugs in software'] },
        { subject:'coding',  q:'What is a REST API?',                                   a:'An API using HTTP methods (GET/POST/PUT/DELETE) on resource URLs, stateless', choices:['A database query language','A type of CSS framework','An API using HTTP methods (GET/POST/PUT/DELETE) on resource URLs, stateless','A real-time socket connection'] },
        { subject:'coding',  q:'What is recursion?',                                    a:'A function that calls itself, with a base case to stop', choices:['A loop that never ends','A function that calls itself, with a base case to stop','A method to sort arrays','A way to declare variables'] },
    ],
};

// All cards combined (for "not logged in" fallback)
const allCards = [...cardsByGroup.elementary, ...cardsByGroup.middle, ...cardsByGroup.high];

const subjectMeta = {
    all:     { label:'All Subjects',  icon:'fa-layer-group' },
    math:    { label:'Mathematics',   icon:'fa-square-root-variable' },
    science: { label:'Science',       icon:'fa-flask' },
    history: { label:'History',       icon:'fa-landmark' },
    english: { label:'English',       icon:'fa-book' },
    coding:  { label:'Coding',        icon:'fa-code' },
};

// ── State ────────────────────────────────────────────────────────────────
let deck = [], currentIndex = 0, knownCount = 0, skippedCount = 0;
let currentSubject = 'all', currentGradeGroup = null;
let sessionStart = null, cardStart = null;
let currentChoices = [], answered = false;

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getSourceCards(subject) {
    const pool = currentGradeGroup ? cardsByGroup[currentGradeGroup] : allCards;
    return subject === 'all' ? pool : pool.filter(c => c.subject === subject);
}

function loadDeck(subject) {
    deck = shuffle(getSourceCards(subject));
    currentIndex = 0; knownCount = 0; skippedCount = 0;
    sessionStart = Date.now();
    answered = false;
    document.getElementById('completeCard').classList.remove('show');
    document.getElementById('cardArena').style.display = 'flex';
    updateCard(); updateStats();
}

function updateCard() {
    if (currentIndex >= deck.length) { showComplete(); return; }
    const card = deck[currentIndex];
    const meta = subjectMeta[card.subject];
    answered = false;
    cardStart = Date.now();

    // Update tag
    document.getElementById('tagText').textContent = meta.label;
    document.querySelector('#cardTag i').className = `fa-solid ${meta.icon}`;

    // Update question
    document.getElementById('cardQuestion').textContent = card.q;

    // Build multiple choice
    currentChoices = shuffle(card.choices);
    renderChoices(currentChoices, card.a);

    // Progress
    const pct = (currentIndex / deck.length) * 100;
    document.getElementById('deckFill').style.width = pct + '%';
    document.getElementById('deckCount').textContent = `${currentIndex + 1} / ${deck.length}`;
    document.getElementById('side-seen').textContent = currentIndex;
}

function renderChoices(choices, correctAnswer) {
    const container = document.getElementById('choicesContainer');
    container.innerHTML = '';
    choices.forEach((choice, i) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.setAttribute('data-answer', choice);
        btn.innerHTML = `<span class="choice-letter">${['A','B','C','D'][i]}</span><span class="choice-text">${choice}</span>`;
        btn.onclick = () => selectChoice(btn, choice, correctAnswer);
        container.appendChild(btn);
    });
}

function selectChoice(btn, selected, correct) {
    if (answered) return;
    answered = true;
    const timeTaken = Math.round((Date.now() - cardStart) / 1000);
    const isCorrect = selected === correct;

    // Style all buttons
    document.querySelectorAll('.choice-btn').forEach(b => {
        const val = b.getAttribute('data-answer');
        if (val === correct) {
            b.classList.add('choice-correct');
        } else if (val === selected && !isCorrect) {
            b.classList.add('choice-wrong');
        }
        b.disabled = true;
    });

    // Show result banner
    const banner = document.getElementById('resultBanner');
    banner.className = 'result-banner ' + (isCorrect ? 'banner-correct' : 'banner-wrong');
    banner.innerHTML = isCorrect
        ? `<i class="fa-solid fa-circle-check"></i> Correct! <span class="banner-time">${timeTaken}s</span>`
        : `<i class="fa-solid fa-circle-xmark"></i> The answer was: <strong>${correct}</strong>`;
    banner.style.display = 'flex';

    // Show next button
    document.getElementById('nextBtn').style.display = 'flex';
    document.getElementById('nextBtn').setAttribute('data-knew', isCorrect ? 'true' : 'false');
}

function nextCard(knew) {
    if (knew) knownCount++; else skippedCount++;
    document.getElementById('resultBanner').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    currentIndex++;
    updateCard(); updateStats();
}

function updateStats() {
    const total = knownCount + skippedCount;
    const pct = total > 0 ? Math.round((knownCount / total) * 100) + '%' : '—';
    document.getElementById('stat-known').textContent   = knownCount;
    document.getElementById('stat-skipped').textContent = skippedCount;
    document.getElementById('stat-pct').textContent     = pct;
    document.getElementById('side-known').textContent   = knownCount;
    document.getElementById('side-pct').textContent     = pct;
}

async function showComplete() {
    document.getElementById('cardArena').style.display = 'none';
    const total    = knownCount + skippedCount;
    const pct      = total > 0 ? Math.round((knownCount / total) * 100) : 0;
    const duration = Math.round((Date.now() - sessionStart) / 1000);

    document.getElementById('c-known').textContent   = knownCount;
    document.getElementById('c-skipped').textContent = skippedCount;
    document.getElementById('c-pct').textContent     = pct + '%';
    document.getElementById('c-time').textContent    = formatTime(duration);
    document.getElementById('completeSub').textContent =
        `You went through all ${deck.length} cards in ${formatTime(duration)}. ${pct >= 70 ? 'Great job! 🎉' : 'Keep practising to improve!'}`;
    document.getElementById('completeCard').classList.add('show');

    // Submit to leaderboard if logged in
    const token = localStorage.getItem('token');
    if (token && total > 0) {
        try {
            await fetch('/api/leaderboard/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ known: knownCount, seen: total, durationSec: duration })
            });
            loadLeaderboard();
        } catch(e) { console.error('Leaderboard submit error', e); }
    }
}

function formatTime(sec) {
    if (sec < 60) return `${sec}s`;
    return `${Math.floor(sec/60)}m ${sec%60}s`;
}

function restartDeck() { loadDeck(currentSubject); }

function selectSubject(btn, subject) {
    currentSubject = subject;
    document.querySelectorAll('.side-nav-item').forEach(b => b.classList.remove('active-nav-item'));
    btn.classList.add('active-nav-item');
    document.querySelectorAll('.pill').forEach(p => p.classList.toggle('active-pill', p.dataset.subject === subject));
    loadDeck(subject);
}

function selectPill(pill, subject) {
    currentSubject = subject;
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active-pill'));
    pill.classList.add('active-pill');
    document.querySelectorAll('.side-nav-item').forEach(b => b.classList.toggle('active-nav-item', b.dataset.subject === subject));
    loadDeck(subject);
}

// ── Keyboard shortcuts ────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (answered) {
        if (e.code === 'Enter' || e.code === 'ArrowRight') {
            const knew = document.getElementById('nextBtn').getAttribute('data-knew') === 'true';
            nextCard(knew);
        }
        return;
    }
    // Press 1–4 to select choice
    const keyMap = { 'Digit1':'A','Digit2':'B','Digit3':'C','Digit4':'D' };
    if (keyMap[e.code]) {
        const idx = ['A','B','C','D'].indexOf(keyMap[e.code]);
        const btns = document.querySelectorAll('.choice-btn');
        if (btns[idx]) btns[idx].click();
    }
});

// ── Grade Picker ──────────────────────────────────────────────────────────
function showGradePicker() {
    document.getElementById('gradeModal').classList.add('active');
}

function hideGradePicker() {
    document.getElementById('gradeModal').classList.remove('active');
}

async function submitGrade(grade) {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
        const res  = await fetch('/api/grade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ grade })
        });
        const data = await res.json();
        if (res.ok) {
            currentGradeGroup = data.gradeGroup;
            localStorage.setItem('gradeGroup', data.gradeGroup);
            localStorage.setItem('grade', data.grade);
            hideGradePicker();
            loadDeck(currentSubject);
        }
    } catch(e) { console.error('Grade submit error', e); }
}

// ── Leaderboard ───────────────────────────────────────────────────────────
async function loadLeaderboard() {
    try {
        const res  = await fetch('/api/leaderboard');
        const data = await res.json();
        renderLeaderboard(data);
    } catch(e) { console.error('Leaderboard load error', e); }
}

function renderLeaderboard(entries) {
    const list = document.getElementById('lbList');
    const currentName = localStorage.getItem('userName');
    if (!entries || entries.length === 0) {
        list.innerHTML = '<div class="lb-empty">No scores yet. Be the first!</div>';
        return;
    }
    list.innerHTML = entries.map((e, i) => {
        const isMe   = e.name === currentName;
        const medal  = ['🥇','🥈','🥉'][i] || `#${i+1}`;
        const speed  = e.bestSpeed ? `${e.bestSpeed}s/card` : '—';
        return `
        <div class="lb-row ${isMe ? 'lb-me' : ''}">
            <span class="lb-rank">${medal}</span>
            <div class="lb-info">
                <span class="lb-name">${e.name}${isMe ? ' <span class="lb-you">you</span>' : ''}</span>
                <span class="lb-sub">${e.accuracy}% acc · ${speed} · ${e.totalKnown} known</span>
            </div>
            <span class="lb-score">${e.composite}</span>
        </div>`;
    }).join('');
}

// ── Auth (same pattern as original) ──────────────────────────────────────
const login  = document.querySelector('.loginmodal');
const signup = document.querySelector('.signupmodal');

function updateUI() {
    const name   = localStorage.getItem('userName');
    const token  = localStorage.getItem('token');
    const navB   = document.getElementById('navB');

    if (name && token) {
        navB.innerHTML = `
            <li style="color:white;font-family:'DM Sans',sans-serif;">Hi, ${name}</li>
            <li id="logoutBtn" style="cursor:pointer;color:#eee;font-weight:bold;width:100px;height:100%;display:flex;justify-content:center;align-items:center;font-family:'DM Sans',sans-serif;">Logout</li>`;
        document.getElementById('logoutBtn').onclick = () => {
            localStorage.clear();
            currentGradeGroup = null;
            window.location.reload();
        };

        // Load grade from server
        fetch('/api/grade', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(r => r.json())
            .then(d => {
                if (d.grade) {
                    currentGradeGroup = d.gradeGroup;
                    localStorage.setItem('gradeGroup', d.gradeGroup);
                    localStorage.setItem('grade', d.grade);
                    document.getElementById('gradeLabel').textContent = `Grade ${d.grade}`;
                    loadDeck(currentSubject);
                } else {
                    // First time — show grade picker
                    showGradePicker();
                }
            })
            .catch(() => loadDeck(currentSubject));
    } else {
        navB.innerHTML = `
            <li class="openlogin" style="color:#eee;font-weight:bold;width:100px;height:100%;display:flex;justify-content:center;align-items:center;cursor:pointer;font-family:'DM Sans',sans-serif;">SignIn</li>
            <li class="openSignup" style="color:#eee;font-weight:bold;width:100px;height:100%;display:flex;justify-content:center;align-items:center;cursor:pointer;font-family:'DM Sans',sans-serif;">SignUp</li>`;
        document.querySelector('.openlogin').onclick  = () => { login.classList.toggle('active'); signup.classList.remove('active'); };
        document.querySelector('.openSignup').onclick = () => { signup.classList.toggle('active'); login.classList.remove('active'); };
        loadDeck(currentSubject);
    }
}

document.getElementById('signupForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const res  = await fetch('/api/signup', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            username: document.getElementById('signupUsername').value,
            name:     document.getElementById('signupName').value,
            password: document.getElementById('signupPassword').value
        })
    });
    const data = await res.json();
    if (res.ok) {
        alert('Account created! Please sign in.');
        signup.classList.remove('active');
    } else alert(data.error);
});

document.getElementById('loginForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const res  = await fetch('/api/login', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            username: document.getElementById('loginUsername').value,
            password: document.getElementById('loginPassword').value
        })
    });
    const data = await res.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);
        alert(`Welcome, ${data.name}`);
        login.classList.remove('active');
        updateUI();
    } else alert(data.error);
});

// ── Init ──────────────────────────────────────────────────────────────────
window.onload = () => {
    updateUI();
    loadLeaderboard();
};