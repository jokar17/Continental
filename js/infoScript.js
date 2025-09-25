function toggleInfo(header) {
  const content = header.nextElementSibling;
  const toggle = header.querySelector(".info-toggle");

  // Chiudi tutti gli altri elementi
  document.querySelectorAll(".info-content").forEach((item) => {
    if (item !== content) {
      item.classList.remove("active");
      item.parentElement
        .querySelector(".info-toggle")
        .classList.remove("active");
    }
  });

  // Toggle l'elemento corrente
  content.classList.toggle("active");
  toggle.classList.toggle("active");
}
