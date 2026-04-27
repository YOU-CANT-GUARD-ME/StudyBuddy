// ── State ──────────────────────────────────────────────
let conversationHistory = [];
let currentSubject = 'general';
let currentSessionId = generateSessionId();  // ← new

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

const subjectLabels = { general:'General Tutor', math:'Math Tutor', science:'Science Tutor', history:'History Tutor', english:'English Tutor', coding:'Coding Tutor' };
const subjectSystemPrompts = {
    general: "You are StudyBuddy, a friendly and encouraging AI tutor for students. Explain concepts clearly, use examples, and break down complex ideas step by step. Keep responses concise but thorough. Format nicely with bullet points or numbered steps when helpful.",
    math:    "You are StudyBuddy, a patient math tutor. Show all working step by step. Use clear notation, explain the 'why' behind each step, and offer practice questions when appropriate.",
    science: "You are StudyBuddy, a science tutor covering biology, chemistry, and physics. Use real-world analogies, explain mechanisms clearly, and relate concepts to everyday life.",
    history: "You are StudyBuddy, a history tutor. Provide context, explain causes and effects, highlight key figures and dates, and help students see the bigger picture.",
    english: "You are StudyBuddy, an English and literature tutor. Help with essay writing, grammar, analysis of texts, and vocabulary. Give constructive, specific feedback.",
    coding:  "You are StudyBuddy, a coding tutor. Explain programming concepts clearly, use simple code examples, highlight common mistakes, and always show working code snippets."
};

// ── Subject switching ───────────────────────────────────
function setSubject(subj) {
    currentSubject = subj;
    document.getElementById('chatLabel').textContent = subjectLabels[subj] || 'Tutor';
    document.querySelectorAll('.subj-tile').forEach(t => t.classList.remove('active-subj'));
    document.querySelectorAll('.subj-tile').forEach(t => {
        const label = t.querySelector('span:last-child').textContent.toLowerCase();
        if (label === subj || (subj === 'general' && label === 'general')) t.classList.add('active-subj');
    });
    clearChat(false);
    loadSubjectHistory(subj);
}

// ── Load history for current subject ───────────────────
async function loadSubjectHistory(subject) {
    const token = localStorage.getItem('token');
    const historyList = document.getElementById('historyList');
    
    if (!historyList) return;  // ← element doesn't exist, bail out
    
    if (!token) {
        historyList.innerHTML = '<div class="history-empty">Sign in to see history</div>';
        return;  // ← stop here, don't make the API call
    }

    try {
        const res = await fetch(`/api/history?subject=${subject}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) {
            historyList.innerHTML = '<div class="history-empty">Sign in to see history</div>';
            return;
        }
        
        const data = await res.json();

        if (!data.sessions || data.sessions.length === 0) {
            historyList.innerHTML = '<div class="history-empty">No history for this subject</div>';
            return;
        }

        historyList.innerHTML = data.sessions.map(session => `
            <div class="history-item" onclick="loadSession('${session._id}')">
                <i class="fa-regular fa-message history-item-icon"></i>
                <span class="history-item-text">${session.firstMessage}</span>
            </div>
        `).join('');

    } catch (err) {
        console.error('Failed to load subject history:', err);
    }
}

// ── Load a session by sessionId ─────────────────────────
async function loadSession(sessionId) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/history?sessionId=${sessionId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        const box = document.getElementById('chatMessages');
        const welcome = document.getElementById('welcomeScreen');
        if (welcome) welcome.remove();
        box.innerHTML = '';
        conversationHistory = [];
        currentSessionId = sessionId;  // ← continue this session

        data.history.forEach(c => {
            appendMessage('user', c.message);
            appendMessage('bot', c.reply);
            conversationHistory.push({ role: 'user', content: c.message });
            conversationHistory.push({ role: 'assistant', content: c.reply });
        });

    } catch (err) {
        console.error('Failed to load session:', err);
    }
}

// ── Auto-grow textarea ──────────────────────────────────
const textarea = document.getElementById('chatInput');
textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 140) + 'px';
});
textarea.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

// ── Clear chat ──────────────────────────────────────────
function clearChat(showWelcome = true) {
    conversationHistory = [];
    currentSessionId = generateSessionId();  // ← new session
    const box = document.getElementById('chatMessages');
    box.innerHTML = '';
    if (showWelcome) {
        box.innerHTML = `
        <div class="welcome-screen" id="welcomeScreen">
            <div class="welcome-heading">
                <span class="welcome-hi">Hello!</span>
                <span class="welcome-tagline">What are we studying today?</span>
            </div>
            <div class="welcome-chips">
                <div class="welcome-chip" onclick="sendSuggestion('Explain Newton\\'s laws of motion')">Newton's laws of motion</div>
                <div class="welcome-chip" onclick="sendSuggestion('How do I solve quadratic equations?')">Quadratic equations</div>
                <div class="welcome-chip" onclick="sendSuggestion('What caused World War 1?')">Causes of WW1</div>
                <div class="welcome-chip" onclick="sendSuggestion('Explain photosynthesis step by step')">Photosynthesis</div>
                <div class="welcome-chip" onclick="sendSuggestion('How do I write a strong essay introduction?')">Essay introductions</div>
                <div class="welcome-chip" onclick="sendSuggestion('What is a for loop in Python?')">For loops in Python</div>
            </div>
        </div>`;
    }
}

// ── Append a message bubble ─────────────────────────────
function appendMessage(role, text) {
    const welcome = document.getElementById('welcomeScreen');
    if (welcome) welcome.remove();

    const box = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = role === 'bot' ? 'SB' : 'Me';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = formatText(text);

    div.appendChild(avatar);
    div.appendChild(bubble);
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return bubble;
}

// ── Format markdown-lite ────────────────────────────────
function formatText(text) {
    return text
        .replace(/```([\s\S]*?)```/g, '<pre style="background:#f0ede4;padding:14px;border-radius:10px;font-size:13px;overflow-x:auto;font-family:\'DM Mono\',monospace;margin:10px 0;white-space:pre-wrap;border:1px solid #e0ddd4;"><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^### (.+)$/gm, '<h4 style="font-size:14px;font-weight:500;margin:10px 0 4px;font-family:\'Instrument Serif\',serif;">$1</h4>')
        .replace(/^## (.+)$/gm, '<h3 style="font-size:16px;font-weight:500;margin:10px 0 4px;font-family:\'Instrument Serif\',serif;">$1</h3>')
        .replace(/^# (.+)$/gm, '<h2 style="font-size:18px;font-weight:500;margin:10px 0 4px;font-family:\'Instrument Serif\',serif;">$1</h2>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        .replace(/^[•\-\*] (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, m => `<ul style="padding-left:18px;margin:6px 0;">${m}</ul>`)
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^(.+)$/, '<p>$1</p>');
}

// ── Typing indicator ────────────────────────────────────
function showTyping() {
    const box = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.id = 'typingMsg';
    div.innerHTML = `<div class="msg-avatar">SB</div><div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}
function hideTyping() {
    const t = document.getElementById('typingMsg');
    if (t) t.remove();
}

// ── Send suggestion ─────────────────────────────────────
function sendSuggestion(text) {
    document.getElementById('chatInput').value = text;
    sendMessage();
}

// ── Send message ────────────────────────────────────────
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    input.style.height = 'auto';
    document.getElementById('sendBtn').disabled = true;

    appendMessage('user', text);
    showTyping();

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ 
                message: text, 
                subject: currentSubject,
                history: conversationHistory,
                sessionId: currentSessionId  // ← send sessionId
            })
        });

        const data = await response.json();
        hideTyping();

        if (data.reply) {
            appendMessage('bot', data.reply);
            conversationHistory.push({ role: 'user', content: text });
            conversationHistory.push({ role: 'assistant', content: data.reply });
            loadSubjectHistory(currentSubject);  // ← refresh sidebar after each message
        } else {
            throw new Error(data.error || 'Invalid response');
        }
    } catch (err) {
        hideTyping();
        appendMessage('bot', 'Oops — I had trouble connecting to the server. Make sure your backend is running!');
        console.error('Frontend Error:', err);
    }

    document.getElementById('sendBtn').disabled = false;
    document.getElementById('chatInput').focus();
}

// ── Nav / modal logic ───────────────────────────────────
const login = document.querySelector(".loginmodal");
const signup = document.querySelector(".signupmodal");

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

document.getElementById('signupForm').addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const name = document.getElementById('signupName').value;
    const password = document.getElementById('signupPassword').value;
    const res = await fetch('/api/signup', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, name, password}) });
    const data = await res.json();
    if (res.ok) { alert('Account created'); signup.classList.remove('active'); }
    else alert(data.error);
});

document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const res = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, password}) });
    const data = await res.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);
        alert(`Welcome, ${data.name}`);
        login.classList.remove('active');
        updateUI();
    } else alert(data.error);
});

// ── Init ────────────────────────────────────────────────
window.onload = async () => {
    updateUI();
    const token = localStorage.getItem('token');
    if (!token) return;
    loadSubjectHistory(currentSubject);
};