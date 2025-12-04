// -------------------------------
// MOBILE MENU TOGGLE
// -------------------------------
const menuBtn = document.getElementById("menu-btn");
const navbar = document.querySelector(".navbar ul");

menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("show-menu");
    menuBtn.classList.toggle("open");
});

// Close menu when clicking a link (mobile)
document.querySelectorAll(".navbar ul li a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("show-menu");
        menuBtn.classList.remove("open");
    });
});


// -------------------------------
// SIGN-IN MODAL POPUP
// -------------------------------
const signinBtn = document.getElementById("signinBtn");
const signinModal = document.getElementById("signinModal");
const closeBtn = document.getElementById("closeBtn");

// Open modal
signinBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signinModal.classList.add("active");
});

// Close modal
closeBtn.addEventListener("click", () => {
    signinModal.classList.remove("active");
});

// Close modal by clicking outside the form
window.addEventListener("click", (e) => {
    if (e.target === signinModal) {
        signinModal.classList.remove("active");
    }
});


// -------------------------------
// SCROLL ANIMATION USING INTERSECTION OBSERVER
// -------------------------------
const scrollElements = document.querySelectorAll(
    ".blog-post, .destination-card, .footer-section, .welcome-section, .services h2"
);

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

scrollElements.forEach(el => observer.observe(el));


// -------------------------------
// BUTTON HOVER EFFECT (SUBTLE PULSE)
// -------------------------------
document.querySelectorAll(".read-btn, .search-btn, .signin-submit").forEach(btn => {
    btn.addEventListener("mouseover", () => {
        btn.style.transform = "scale(1.05)";
    });
    btn.addEventListener("mouseout", () => {
        btn.style.transform = "scale(1)";
    });
});


// -------------------------------
// SMOOTH PAGE SCROLLING
// -------------------------------
window.scrollTo({
    top: 0,
    behavior: "smooth"
});