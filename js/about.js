
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    navbar.classList.add("nav-small");
  } else {
    navbar.classList.remove("nav-small");
  }
});


const faders = document.querySelectorAll("section, header, .team .person");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });

faders.forEach(fade => observer.observe(fade));


const logo = document.querySelector(".logo");
let floatPos = 0;
let direction = 1;

setInterval(() => {
  floatPos += direction;
  if (floatPos > 8 || floatPos < -8) direction *= -1;

  if (logo) {
    logo.style.transform = `translateY(${floatPos}px)`;
  }
}, 80);


const titleText = "Cheap Air Travellers";
const titleElement = document.querySelector("h1");
let index = 0;

function typeEffect() {
  if (index < titleText.length) {
    titleElement.textContent = titleText.slice(0, index + 1);
    index++;
    setTimeout(typeEffect, 80);
  }
}

if (titleElement) {
  titleElement.textContent = "";
  typeEffect();
}


document.querySelectorAll(".person").forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.classList.add("hover-glow");
  });
  card.addEventListener("mouseleave", () => {
    card.classList.remove("hover-glow");
  });
});
