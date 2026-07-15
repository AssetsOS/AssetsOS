// ===============================
// AssetsOS JavaScript
// ===============================

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

// Fade-in animation on scroll
const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

},{
    threshold:0.2
});

document.querySelectorAll(".card, .industry, .timeline-card, .dashboard")
.forEach(el=>{

    el.classList.add("fade-up");

    observer.observe(el);

});

// Reserve Form
const reserveForm=document.getElementById("reserveForm");

if(reserveForm){

reserveForm.addEventListener("submit",function(e){

e.preventDefault();

alert("🎉 Thank you! Your reservation request has been received. AssetsOS will contact you soon.");

reserveForm.reset();

});

}

// Login Button
const login=document.querySelector(".login-btn");

if(login){

login.addEventListener("click",()=>{

alert("Login Portal Coming Soon");

});

}

// Reserve Button
const reserve=document.querySelector(".primary-btn");

if(reserve){

reserve.addEventListener("click",()=>{

document.querySelector("#reserve").scrollIntoView({

behavior:"smooth"

});

});

}
