const burger = document.querySelector("#menuBurger");
const links = document.querySelector("#menuLinks");
const navbar = document.querySelector(".nav-container"); // ⭐ aggiungi riferimento navbar

// ⭐ Funzionalità menu esistente
burger.addEventListener("click", (e) => {
  links.classList.toggle("visible");
  document.body.classList.toggle("no-scroll");
  burger.classList.toggle("menu-open");
});

// ⭐ NUOVO: Funzionalità hide/show navbar
let lastScrollTop = 0;
let scrollTimer = null;

function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Se siamo in cima, mostra sempre la navbar
  if (scrollTop <= 10) {
    navbar.classList.remove("hidden");
    lastScrollTop = scrollTop;
    return;
  }

  // se vuoi implementare effette navbar trasparente sopra hero section
  /*if (scrollTop > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }*/

  // Se il menu mobile è aperto, non nascondere la navbar
  if (links.classList.contains("visible")) {
    lastScrollTop = scrollTop;
    return;
  }

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scroll down - nascondi
    navbar.classList.add("hidden");
  } else if (scrollTop < lastScrollTop) {
    // Scroll up - mostra
    navbar.classList.remove("hidden");
  }

  lastScrollTop = scrollTop;
}

// Event listener per lo scroll
window.addEventListener("scroll", function () {
  if (scrollTimer) {
    clearTimeout(scrollTimer);
  }
  scrollTimer = setTimeout(handleScroll, 10);
});
