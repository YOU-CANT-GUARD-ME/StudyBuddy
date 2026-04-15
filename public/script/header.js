const login = $(".loginmodal");
const signup = $(".signupmodal");
const loginbtn = $(".openlogin");
const signupbtn = $(".openSignup");
const signupbtn2 = $$(".openSignup2")

loginbtn.onclick = () => {
    login.classList.toggle("active");
    signup.classList.remove("active");
}

signupbtn.onclick = () => {
    signup.classList.toggle("active");
    login.classList.remove("active");
}

signupbtn2.forEach(btn => {
    btn.onclick = () => {
        signup.classList.add("active");
        login.classList.remove("active");
    }
})
