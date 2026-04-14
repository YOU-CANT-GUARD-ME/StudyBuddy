const login = $(".loginmodal");
const signup = $(".signupmodal");
const loginbtn = $(".openlogin");
const signupbtn = $(".openSignup");

loginbtn.onclick = () => {
    login.classList.toggle("active");
    signup.classList.remove("active");
}

signupbtn.onclick = () => {
    signup.classList.toggle("active");
    login.classList.remove("active");
}