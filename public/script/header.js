const login = $(".loginmodal");
const signup = $(".signupmodal");


function setupModalListeners() {
    const loginbtn = $(".openlogin");
    const signupbtn = $(".openSignup");
    const signupbtn2 = $$(".openSignup2");

    if (loginbtn) {
        loginbtn.onclick = () => {
            login.classList.toggle("active");
            signup.classList.remove("active");
        };
    }

    if (signupbtn) {
        signupbtn.onclick = () => {
            signup.classList.toggle("active");
            login.classList.remove("active");
        }
    }

    signupbtn2.forEach(btn => {
        btn.onclick = () => {
            signup.classList.add("active");
            login.classList.remove("active");
        };
    });
}

function updateUI() {
    const name = localStorage.getItem('userName');
    const navB = $(".nav-b");

    if (name) {
        navB.innerHTML = `
            <li style="color: white;">Hi, ${name}</li>
            <li class="logout-btn" style="cursor: pointer;">Logout</li>
        `;

        $(".logout-btn").onclick = () => {
            localStorage.clear();
            window.location.reload();
        };
    } else {
        navB.innerHTML = `
            <li class="openlogin">SignIn</li>
            <li class="openSignup">SignUp</li>
        `;
        setupModalListeners();
    }
}

$("#signupForm").addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = $("#signupUsername").value;
    const name = $("#signupName").value;
    const password = $("#signupPassword").value;

    const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, password })
    });

    const data = await res.json();
    if (res.ok) {
        alert("Account created");
        signup.classList.remove("active");
    } else {
        alert(data.error);
    }
});

$("#loginForm").addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = $("#loginUsername").value;
    const password = $("#loginPassword").value;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if(data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);

        alert(`Welcome, ${data.name}`);
        login.classList.remove("active");
        updateUI();
    } else {
        alert(data.error);
    }
});



window.onload = updateUI;