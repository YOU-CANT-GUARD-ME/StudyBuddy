// ── State ──────────────────────────────────────────────
let conversationHistory = [];
let currentSubject = 'general';
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
    document.querySelectorAll('.tutor-pill').forEach(p => p.classList.remove('active-pill'));
    document.querySelectorAll('.tutor-pill').forEach(p => { if (p.textContent.toLowerCase() === subj || (subj === 'general' && p.textContent === 'General')) p.classList.add('active-pill'); });
    clearChat(false);
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
    const box = document.getElementById('chatMessages');
    box.innerHTML = '';
    if (showWelcome) {
        box.innerHTML = `
        <div class="welcome-screen" id="welcomeScreen">
            <div class="big-icon"><i class="fa-solid fa-graduation-cap"></i></div>
            <h2>Hi, I'm your Study Buddy!</h2>
            <p>Ask me anything — I'll explain it clearly, quiz you, summarise your notes, or build you a study plan.</p>
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
        .replace(/```([\s\S]*?)```/g, '<pre style="background:#1e2a0a;color:#d4f088;padding:12px;border-radius:8px;font-size:13px;overflow-x:auto;font-family:monospace;margin:8px 0;white-space:pre-wrap;"><code>$1</code></pre>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^### (.+)$/gm, '<h4 style="font-size:14px;font-weight:bold;margin:10px 0 4px;">$1</h4>')
        .replace(/^## (.+)$/gm, '<h3 style="font-size:15px;font-weight:bold;margin:10px 0 4px;">$1</h3>')
        .replace(/^# (.+)$/gm, '<h2 style="font-size:16px;font-weight:bold;margin:10px 0 4px;">$1</h2>')
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
    conversationHistory.push({ role: 'user', content: text });

    showTyping();

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                system: subjectSystemPrompts[currentSubject],
                messages: conversationHistory
            })
        });

        const data = await response.json();
        hideTyping();

        const reply = data.content?.map(b => b.text || '').join('') || 'Sorry, I had trouble responding. Please try again.';
        conversationHistory.push({ role: 'assistant', content: reply });
        appendMessage('bot', reply);
    } catch (err) {
        hideTyping();
        appendMessage('bot', 'Oops — something went wrong connecting to the tutor. Please check your connection and try again.');
        console.error(err);
    }

    document.getElementById('sendBtn').disabled = false;
    document.getElementById('chatInput').focus();
}

// ── Nav / modal logic (mirrors header.js) ───────────────
const login = document.querySelector(".loginmodal");
const signup = document.querySelector(".signupmodal");

function updateUI() {
    const name = localStorage.getItem('userName');
    const navB = document.getElementById('navB');
    if (name) {
        navB.innerHTML = `<li style="color:white;">Hi, ${name}</li><li id="logoutBtn" style="cursor:pointer;color:#eee;font-weight:bold;width:100px;height:100%;display:flex;justify-content:center;align-items:center;">Logout</li>`;
        document.getElementById('logoutBtn').onclick = () => { localStorage.clear(); window.location.reload(); };
    } else {
        navB.innerHTML = `<li class="openlogin" style="color:#eee;font-weight:bold;width:100px;height:100%;display:flex;justify-content:center;align-items:center;cursor:pointer;">SignIn</li><li class="openSignup" style="color:#eee;font-weight:bold;width:100px;height:100%;display:flex;justify-content:center;align-items:center;cursor:pointer;">SignUp</li>`;
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

window.onload = updateUI;