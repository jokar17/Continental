// menuRender.js - Adattato alla tua struttura dati esistente

const container = document.querySelector("#menu-render");

// Funzione per creare le icone degli allergeni
function createAllergenIcons(allergeni) {
  if (!allergeni || allergeni.length === 0) return "";

  return allergeni
    .map((allergene) => {
      const allergenInfo = allergeniDisponibili.find((a) => a.id === allergene);
      if (allergenInfo) {
        return `<span class="allergen-icon" title="${allergenInfo.nome}">${allergenInfo.icona}</span>`;
      }
      return "";
    })
    .join("");
}

// Funzione per determinare se un piatto è vegetariano (logica basata sugli allergeni)
function isVegetarian(piatto) {
  const nonVegetarianAllergens = ["pesce", "crostacei", "molluschi"];
  const nonVegetarianKeywords = [
    "pesce",
    "pollo",
    "tacchino",
    "carne",
    "gamberi",
  ];

  // Controlla allergeni
  const hasAnimalProducts = piatto.allergeni.some((allergene) =>
    nonVegetarianAllergens.includes(allergene)
  );

  // Controlla nome e descrizione
  const nameAndDesc = (piatto.nome + " " + piatto.descrizione).toLowerCase();
  const hasAnimalKeywords = nonVegetarianKeywords.some((keyword) =>
    nameAndDesc.includes(keyword)
  );

  return !hasAnimalProducts && !hasAnimalKeywords;
}

// Funzione per determinare se un piatto è piccante (basato su parole chiave)
function isSpicy(piatto) {
  const spicyKeywords = ["piccante", "spezie", "speziato", "marinato", "yassa"];
  const nameAndDesc = (piatto.nome + " " + piatto.descrizione).toLowerCase();

  return spicyKeywords.some((keyword) => nameAndDesc.includes(keyword));
}

// Funzione migliorata per renderizzare una categoria
function renderMenuCategory(categoria) {
  const piatti = getDishesByCategory(categoria);

  if (!piatti || piatti.length === 0) {
    return '<p class="no-dishes">Nessun piatto disponibile in questa categoria</p>';
  }

  const piattiHTML = piatti.map((piatto, index) => {
    // Icone per caratteristiche speciali
    const vegetarianIcon = isVegetarian(piatto)
      ? '<span class="diet-icon vegetarian" title="Vegetariano">🌱</span>'
      : "";
    const spicyIcon = isSpicy(piatto)
      ? '<span class="diet-icon spicy" title="Speziato">🌶️</span>'
      : "";
    const vipIcon = piatto.isVip
      ? '<span class="diet-icon vip" title="Piatto VIP">👑</span>'
      : "";

    // Icone allergeni
    const allergenIcons = createAllergenIcons(piatto.allergeni);

    return `
      <article class="piatti-card" 
               data-category="${categoria}" 
               data-id="${piatto.id}"
               data-vegetarian="${isVegetarian(piatto)}"
               data-spicy="${isSpicy(piatto)}"
               data-allergens="${piatto.allergeni.join(",")}"
               role="listitem">
        <img 
          class="piatti-card-img" 
          src="${piatto.foto || "./img/placeholder-dish.jpg"}" 
          alt="${piatto.nome} - ${piatto.descrizione}"
          loading="lazy"
          onerror="this.src='./img/food-pic.jpg'; this.alt='Immagine non disponibile';"
        />
        <div class="card-description">
          <div class="card-header">
            <h4 class="card-title">${piatto.nome}</h4>
            <div class="diet-icons">
              ${vegetarianIcon}
              ${spicyIcon}
              ${vipIcon}
            </div>
          </div>
          <p class="card-text">${piatto.descrizione}</p>
          
          ${
            allergenIcons
              ? `
            <div class="allergens-section">
              <span class="allergens-label">Allergeni:</span>
              <div class="allergen-icons">
                ${allergenIcons}
              </div>
            </div>
          `
              : ""
          }
          
          <div class="card-footer">
            <span class="price">${formatPrice(piatto.prezzo)}</span>
            <span class="category-badge">${getCategoryDisplayName(
              categoria
            )}</span>
          </div>
        </div>
      </article>
    `;
  });

  return piattiHTML.join("");
}

// Funzione per ottenere il nome visualizzato della categoria
function getCategoryDisplayName(categoryKey) {
  const categoryMap = {
    antipasti: "Antipasti",
    primi_piatti: "Primi",
    zuppe: "Zuppe",
    secondi_piatti: "Secondi",
    specialita: "Specialità",
  };
  return categoryMap[categoryKey] || categoryKey;
}

// Funzione migliorata per renderizzare le sezioni del menu
function renderMenuSection(filteredCategories = null) {
  // Pulisci il container
  container.innerHTML = "";

  const categorie = [
    { key: "antipasti", title: "Antipasti" },
    { key: "zuppe", title: "Zuppe" },
    { key: "primi_piatti", title: "Primi Piatti" },
    { key: "secondi_piatti", title: "Secondi Piatti" },
    { key: "specialita", title: "Specialità" },
  ];

  // Filtra le categorie se specificato
  const categorieDaRenderizzare = filteredCategories
    ? categorie.filter((cat) => filteredCategories.includes(cat.key))
    : categorie;

  if (categorieDaRenderizzare.length === 0) {
    container.innerHTML = `
      <div class="menu-empty">
        <h3>Nessuna categoria trovata</h3>
        <p>Modifica i filtri per vedere i piatti disponibili.</p>
      </div>
    `;
    return;
  }

  let totalDishes = 0;

  categorieDaRenderizzare.forEach((categoria, sectionIndex) => {
    const categoryHTML = renderMenuCategory(categoria.key);
    const dishCount = getDishesByCategory(categoria.key)?.length || 0;
    totalDishes += dishCount;

    // Solo renderizza la sezione se ha piatti
    if (dishCount > 0) {
      const sectionHTML = `
        <section class="menu-section" data-category="${categoria.key}">
          <div class="menu-title-container">
            <h3 class="menu-title">${categoria.title}</h3>
            <span class="dishes-count">${dishCount} piatt${
        dishCount === 1 ? "o" : "i"
      }</span>
          </div>
          <div class="piatti-grid" role="list" aria-label="Piatti ${
            categoria.title
          }">
            ${categoryHTML}
          </div>
        </section>
      `;
      container.insertAdjacentHTML("beforeend", sectionHTML);
    }
  });

  // Aggiorna il contatore totale se esiste
  updateTotalCounter(totalDishes);

  // Aggiungi animazioni scaglionate
  addStaggeredAnimations();

  // Inizializza lazy loading per le nuove immagini
  initializeLazyLoading();
}

// Funzione per aggiornare il contatore totale
function updateTotalCounter(count) {
  const counter = document.getElementById("results-count");
  if (counter) {
    counter.textContent = count;
  }
}

// Funzione per le animazioni di entrata
function addStaggeredAnimations() {
  const sections = document.querySelectorAll(".menu-section");

  sections.forEach((section, sectionIndex) => {
    const cards = section.querySelectorAll(".piatti-card");

    cards.forEach((card, cardIndex) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";

      const delay = sectionIndex * 200 + cardIndex * 100;

      setTimeout(() => {
        card.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, delay);
    });
  });
}

// Funzione per il lazy loading
function initializeLazyLoading() {
  const images = document.querySelectorAll('.piatti-card-img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add("fade-in");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// Funzione per filtrare il menu esistente per ricerca
function filterMenuBySearch(searchTerm) {
  if (!searchTerm.trim()) {
    // Mostra tutte le sezioni e card
    document.querySelectorAll(".menu-section").forEach((section) => {
      section.style.display = "block";
    });
    document.querySelectorAll(".piatti-card").forEach((card) => {
      card.style.display = "flex";
    });
    updateCounters();
    return;
  }

  const term = searchTerm.toLowerCase();
  let totalVisible = 0;

  document.querySelectorAll(".menu-section").forEach((section) => {
    const cards = section.querySelectorAll(".piatti-card");
    let visibleInSection = 0;

    cards.forEach((card) => {
      const title =
        card.querySelector(".card-title")?.textContent.toLowerCase() || "";
      const description =
        card.querySelector(".card-text")?.textContent.toLowerCase() || "";
      const category = card.dataset.category?.toLowerCase() || "";

      const isVisible =
        title.includes(term) ||
        description.includes(term) ||
        category.includes(term);

      card.style.display = isVisible ? "flex" : "none";
      if (isVisible) {
        visibleInSection++;
        totalVisible++;
      }
    });

    // Nascondi la sezione se non ha piatti visibili
    section.style.display = visibleInSection > 0 ? "block" : "none";

    // Aggiorna il contatore della sezione
    const sectionCounter = section.querySelector(".dishes-count");
    if (sectionCounter) {
      sectionCounter.textContent = `${visibleInSection} piatt${
        visibleInSection === 1 ? "o" : "i"
      }`;
    }
  });

  updateTotalCounter(totalVisible);
}

// Funzione per filtrare per categoria specifica
function filterMenuByCategory(selectedCategory) {
  if (selectedCategory === "all") {
    renderMenuSection(); // Ricarica tutto
    return;
  }

  renderMenuSection([selectedCategory]);
}

// Funzione per filtrare per tipo di dieta
function filterMenuByDiet(vegetarian = false, spicy = false) {
  let totalVisible = 0;

  document.querySelectorAll(".menu-section").forEach((section) => {
    const cards = section.querySelectorAll(".piatti-card");
    let visibleInSection = 0;

    cards.forEach((card) => {
      let shouldShow = true;

      if (vegetarian) {
        const isCardVegetarian = card.dataset.vegetarian === "true";
        if (!isCardVegetarian) shouldShow = false;
      }

      if (spicy && shouldShow) {
        const isCardSpicy = card.dataset.spicy === "true";
        if (!isCardSpicy) shouldShow = false;
      }

      card.style.display = shouldShow ? "flex" : "none";
      if (shouldShow) {
        visibleInSection++;
        totalVisible++;
      }
    });

    // Nascondi sezione se vuota
    section.style.display = visibleInSection > 0 ? "block" : "none";

    // Aggiorna contatore sezione
    const sectionCounter = section.querySelector(".dishes-count");
    if (sectionCounter) {
      sectionCounter.textContent = `${visibleInSection} piatt${
        visibleInSection === 1 ? "o" : "i"
      }`;
    }
  });

  updateTotalCounter(totalVisible);
}

// Funzione per filtrare per allergeni
function filterMenuByAllergens(allergeniDaEvitare = []) {
  if (!allergeniDaEvitare.length) {
    // Mostra tutto se non ci sono allergeni da evitare
    document.querySelectorAll(".piatti-card").forEach((card) => {
      card.style.display = "flex";
    });
    updateCounters();
    return;
  }

  let totalVisible = 0;

  document.querySelectorAll(".menu-section").forEach((section) => {
    const cards = section.querySelectorAll(".piatti-card");
    let visibleInSection = 0;

    cards.forEach((card) => {
      const cardAllergens = card.dataset.allergens
        ? card.dataset.allergens.split(",")
        : [];
      const hasProblematicAllergens = cardAllergens.some((allergene) =>
        allergeniDaEvitare.includes(allergene)
      );

      const shouldShow = !hasProblematicAllergens;
      card.style.display = shouldShow ? "flex" : "none";

      if (shouldShow) {
        visibleInSection++;
        totalVisible++;
      }
    });

    section.style.display = visibleInSection > 0 ? "block" : "none";

    const sectionCounter = section.querySelector(".dishes-count");
    if (sectionCounter) {
      sectionCounter.textContent = `${visibleInSection} piatt${
        visibleInSection === 1 ? "o" : "i"
      }`;
    }
  });

  updateTotalCounter(totalVisible);
}

// Funzione helper per aggiornare tutti i contatori
function updateCounters() {
  let totalVisible = 0;

  document.querySelectorAll(".menu-section").forEach((section) => {
    const visibleCards = section.querySelectorAll(
      '.piatti-card:not([style*="none"])'
    ).length;
    totalVisible += visibleCards;

    const sectionCounter = section.querySelector(".dishes-count");
    if (sectionCounter) {
      sectionCounter.textContent = `${visibleCards} piatt${
        visibleCards === 1 ? "o" : "i"
      }`;
    }
  });

  updateTotalCounter(totalVisible);
}

// Funzione per resettare tutti i filtri
function resetAllFilters() {
  renderMenuSection();
}

// Renderizza il menu iniziale
renderMenuSection();

// Esporta le funzioni per uso esterno
window.menuRenderer = {
  renderMenuSection,
  filterMenuBySearch,
  filterMenuByCategory,
  filterMenuByDiet,
  filterMenuByAllergens,
  resetAllFilters,
  updateCounters,
};
