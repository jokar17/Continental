// menuControls.js - Sistema di controlli adattato ai tuoi dati reali

class ContinentalMenuController {
  constructor() {
    this.currentFilters = {
      category: "all",
      search: "",
      vegetarian: false,
      spicy: false,
      allergens: [], // Nuovo: allergeni da evitare
      vipOnly: false, // Nuovo: solo piatti VIP
    };

    this.debounceTimer = null;
    this.init();
  }

  init() {
    // Aspetta che il tuo menu sia renderizzato
    setTimeout(() => {
      this.createControlsUI();
      this.setupEventListeners();
      this.updateCounter();
    }, 200);
  }

  // Crea l'interfaccia dei controlli adattata ai tuoi dati
  createControlsUI() {
    const menuContainer = document.querySelector("#menu-render");
    if (!menuContainer) return;

    // Genera le opzioni degli allergeni dai tuoi dati
    const allergenOptions = allergeniDisponibili
      .map(
        (allergene) => `
      <div class="allergen-filter-item">
        <label class="filter-checkbox">
          <input type="checkbox" class="allergen-checkbox" data-allergen="${allergene.id}" />
          <span class="checkmark">${allergene.icona}</span>
          Evita ${allergene.nome}
        </label>
      </div>
    `
      )
      .join("");

    const controlsHTML = `
      <section class="menu-controls">
        <div class="menu-controls-container">
          
          <!-- Hero della ricerca -->
          <div class="search-hero">
            <h2>🍽️ Trova il tuo piatto perfetto</h2>
            <div class="search-input-wrapper">
              <input 
                type="search" 
                id="menu-search"
                class="search-input"
                placeholder="Cerca Yassa, Attiéké, Zuppa..."
                aria-label="Cerca nel menu"
              />
              <button class="search-button" type="button" aria-label="Avvia ricerca">
                🔍
              </button>
              <button class="search-clear" type="button" aria-label="Cancella ricerca" style="display: none;">
                ✕
              </button>
            </div>
          </div>

          <!-- Filtri rapidi -->
          <div class="quick-filters">
            <button class="quick-filter-btn" data-filter="vegetarian">
              🌱 Solo Vegetariani
            </button>
            <button class="quick-filter-btn" data-filter="spicy">
              🌶️ Piatti Speziati
            </button>
            <button class="quick-filter-btn vip-filter" data-filter="vip">
              👑 Piatti VIP
            </button>
            <button class="quick-filter-btn reset-filter" data-filter="reset">
              🔄 Mostra Tutto
            </button>
          </div>

          <!-- Filtri per categoria -->
          <nav class="category-filters" aria-label="Filtra per categoria">
            <button class="filter-btn active" data-category="all">
              🍽️ Tutti i piatti
            </button>
            <button class="filter-btn" data-category="antipasti">
              🥗 Antipasti
            </button>
            <button class="filter-btn" data-category="zuppe">
              🍲 Zuppe
            </button>
            <button class="filter-btn" data-category="primi_piatti">
              🍚 Primi Piatti
            </button>
            <button class="filter-btn" data-category="secondi_piatti">
              🍖 Secondi Piatti
            </button>
            <button class="filter-btn" data-category="specialita">
              ⭐ Specialità
            </button>
          </nav>

          <!-- Sezione allergeni -->
          <div class="allergen-section">
            <h4 class="filter-section-title">⚠️ Hai allergie o intolleranze?</h4>
            <p class="filter-description">Seleziona gli allergeni da evitare per vedere solo i piatti adatti a te</p>
            <div class="allergen-filters">
              ${allergenOptions}
            </div>
          </div>

          <!-- Contatore risultati con dettagli -->
          <div class="results-summary">
            <div class="results-counter">
              Mostrando <span id="results-count">0</span> piatti
            </div>
            <div class="active-filters" id="active-filters"></div>
          </div>
        </div>
      </section>
    `;

    // Inserisce i controlli prima del menu
    menuContainer.insertAdjacentHTML("beforebegin", controlsHTML);
  }

  setupEventListeners() {
    // Ricerca con debouncing
    const searchInput = document.getElementById("menu-search");
    if (searchInput) {
      searchInput.addEventListener("input", this.handleSearch.bind(this));

      // Bottone clear
      const clearBtn = document.querySelector(".search-clear");
      if (clearBtn) {
        clearBtn.addEventListener("click", this.clearSearch.bind(this));
      }
    }

    // Filtri rapidi
    const quickFilterBtns = document.querySelectorAll(".quick-filter-btn");
    quickFilterBtns.forEach((btn) => {
      btn.addEventListener("click", this.handleQuickFilter.bind(this));
    });

    // Filtri per categoria
    const categoryButtons = document.querySelectorAll(".filter-btn");
    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", this.handleCategoryFilter.bind(this));
    });

    // Filtri allergeni
    const allergenCheckboxes = document.querySelectorAll(".allergen-checkbox");
    allergenCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", this.handleAllergenFilter.bind(this));
    });

    // Navigazione da tastiera
    this.setupKeyboardNavigation();
  }

  handleSearch(event) {
    const searchTerm = event.target.value.trim();
    this.currentFilters.search = searchTerm;

    // Mostra/nascondi bottone clear
    const clearBtn = document.querySelector(".search-clear");
    if (clearBtn) {
      clearBtn.style.display = searchTerm ? "block" : "none";
    }

    // Debounce per performance
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.applyFilters();
    }, 150);
  }

  clearSearch() {
    const searchInput = document.getElementById("menu-search");
    if (searchInput) {
      searchInput.value = "";
      this.currentFilters.search = "";
    }

    const clearBtn = document.querySelector(".search-clear");
    if (clearBtn) {
      clearBtn.style.display = "none";
    }

    this.applyFilters();
  }

  handleQuickFilter(event) {
    const filterType = event.target.dataset.filter;
    const btn = event.target;

    switch (filterType) {
      case "vegetarian":
        this.currentFilters.vegetarian = !this.currentFilters.vegetarian;
        btn.classList.toggle("active", this.currentFilters.vegetarian);
        break;
      case "spicy":
        this.currentFilters.spicy = !this.currentFilters.spicy;
        btn.classList.toggle("active", this.currentFilters.spicy);
        break;
      case "vip":
        this.currentFilters.vipOnly = !this.currentFilters.vipOnly;
        btn.classList.toggle("active", this.currentFilters.vipOnly);
        break;
      case "reset":
        this.resetAllFilters();
        return;
    }

    this.applyFilters();
  }

  handleCategoryFilter(event) {
    const category = event.target.dataset.category;
    this.currentFilters.category = category;

    // Aggiorna stato UI
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    event.target.classList.add("active");

    this.applyFilters();
  }

  handleAllergenFilter() {
    // Raccoglie tutti gli allergeni selezionati
    const checkedAllergens = Array.from(
      document.querySelectorAll(".allergen-checkbox:checked")
    ).map((checkbox) => checkbox.dataset.allergen);

    this.currentFilters.allergens = checkedAllergens;
    this.applyFilters();
  }

  applyFilters() {
    // Se tutti i filtri sono resettati, ricarica il menu completo
    if (this.isAllFiltersReset()) {
      if (window.menuRenderer) {
        window.menuRenderer.resetAllFilters();
      }
      this.updateActiveFiltersDisplay();
      return;
    }

    // Applica filtri in sequenza
    this.applySequentialFilters();
    this.updateActiveFiltersDisplay();
  }

  isAllFiltersReset() {
    return (
      this.currentFilters.category === "all" &&
      !this.currentFilters.search &&
      !this.currentFilters.vegetarian &&
      !this.currentFilters.spicy &&
      !this.currentFilters.vipOnly &&
      this.currentFilters.allergens.length === 0
    );
  }

  applySequentialFilters() {
    // Prima applica il filtro categoria se necessario
    if (this.currentFilters.category !== "all") {
      if (window.menuRenderer) {
        window.menuRenderer.filterMenuByCategory(this.currentFilters.category);
      }
    } else {
      // Assicurati che tutte le categorie siano visibili
      if (window.menuRenderer) {
        window.menuRenderer.renderMenuSection();
      }
    }

    // Poi applica altri filtri sui risultati visibili
    this.applyAdvancedFilters();
  }

  applyAdvancedFilters() {
    let totalVisible = 0;

    document.querySelectorAll(".menu-section").forEach((section) => {
      const cards = section.querySelectorAll(".piatti-card");
      let visibleInSection = 0;

      cards.forEach((card) => {
        let shouldShow = true;

        // Filtro ricerca
        if (this.currentFilters.search && shouldShow) {
          const searchTerm = this.currentFilters.search.toLowerCase();
          const title =
            card.querySelector(".card-title")?.textContent.toLowerCase() || "";
          const description =
            card.querySelector(".card-text")?.textContent.toLowerCase() || "";

          shouldShow =
            title.includes(searchTerm) || description.includes(searchTerm);
        }

        // Filtro vegetariano
        if (this.currentFilters.vegetarian && shouldShow) {
          shouldShow = card.dataset.vegetarian === "true";
        }

        // Filtro piccante
        if (this.currentFilters.spicy && shouldShow) {
          shouldShow = card.dataset.spicy === "true";
        }

        // Filtro VIP
        if (this.currentFilters.vipOnly && shouldShow) {
          shouldShow = card.querySelector(".diet-icon.vip") !== null;
        }

        // Filtro allergeni
        if (this.currentFilters.allergens.length > 0 && shouldShow) {
          const cardAllergens = card.dataset.allergens
            ? card.dataset.allergens.split(",")
            : [];
          shouldShow = !cardAllergens.some((allergene) =>
            this.currentFilters.allergens.includes(allergene)
          );
        }

        card.style.display = shouldShow ? "flex" : "none";
        if (shouldShow) {
          visibleInSection++;
          totalVisible++;
        }
      });

      // Gestisci visibilità sezione
      section.style.display = visibleInSection > 0 ? "block" : "none";

      // Aggiorna contatore sezione
      const sectionCounter = section.querySelector(".dishes-count");
      if (sectionCounter) {
        sectionCounter.textContent = `${visibleInSection} piatt${
          visibleInSection === 1 ? "o" : "i"
        }`;
      }
    });

    // Aggiorna contatore totale
    const counter = document.getElementById("results-count");
    if (counter) {
      counter.textContent = totalVisible;
    }

    this.announceResults(totalVisible);
  }

  updateActiveFiltersDisplay() {
    const activeFiltersContainer = document.getElementById("active-filters");
    if (!activeFiltersContainer) return;

    const activeFilters = [];

    if (this.currentFilters.search) {
      activeFilters.push(`🔍 "${this.currentFilters.search}"`);
    }

    if (this.currentFilters.category !== "all") {
      const categoryName =
        document.querySelector(
          `[data-category="${this.currentFilters.category}"]`
        )?.textContent || this.currentFilters.category;
      activeFilters.push(`📂 ${categoryName}`);
    }

    if (this.currentFilters.vegetarian) {
      activeFilters.push("🌱 Vegetariani");
    }

    if (this.currentFilters.spicy) {
      activeFilters.push("🌶️ Speziati");
    }

    if (this.currentFilters.vipOnly) {
      activeFilters.push("👑 VIP");
    }

    if (this.currentFilters.allergens.length > 0) {
      const allergenNames = this.currentFilters.allergens
        .map((id) => {
          const allergen = allergeniDisponibili.find((a) => a.id === id);
          return allergen ? `${allergen.icona} ${allergen.nome}` : id;
        })
        .join(", ");
      activeFilters.push(`⚠️ Evita: ${allergenNames}`);
    }

    if (activeFilters.length > 0) {
      activeFiltersContainer.innerHTML = `
        <div class="active-filters-list">
          <span class="filters-label">Filtri attivi:</span>
          ${activeFilters
            .map((filter) => `<span class="active-filter-tag">${filter}</span>`)
            .join("")}
          <button class="clear-filters-btn" onclick="window.continentalMenuController?.resetAllFilters()">
            ✕ Cancella tutti
          </button>
        </div>
      `;
      activeFiltersContainer.style.display = "block";
    } else {
      activeFiltersContainer.style.display = "none";
    }
  }

  announceResults(count) {
    let liveRegion = document.getElementById("menu-live-region");
    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.id = "menu-live-region";
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.style.cssText =
        "position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;";
      document.body.appendChild(liveRegion);
    }

    let message = `${count} piatti trovati`;
    if (this.currentFilters.search) {
      message += ` per la ricerca "${this.currentFilters.search}"`;
    }

    liveRegion.textContent = message;
  }

  setupKeyboardNavigation() {
    // Navigazione con frecce nei filtri
    const filterBtns = document.querySelectorAll(
      ".filter-btn, .quick-filter-btn"
    );
    filterBtns.forEach((btn, index) => {
      btn.addEventListener("keydown", (e) => {
        let nextIndex;

        switch (e.key) {
          case "ArrowRight":
            e.preventDefault();
            nextIndex = (index + 1) % filterBtns.length;
            filterBtns[nextIndex].focus();
            break;
          case "ArrowLeft":
            e.preventDefault();
            nextIndex = (index - 1 + filterBtns.length) % filterBtns.length;
            filterBtns[nextIndex].focus();
            break;
        }
      });
    });

    // Escape per cancellare ricerca
    const searchInput = document.getElementById("menu-search");
    if (searchInput) {
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          this.clearSearch();
          searchInput.blur();
        }
      });
    }
  }

  // Metodi pubblici
  resetAllFilters() {
    // Reset stato
    this.currentFilters = {
      category: "all",
      search: "",
      vegetarian: false,
      spicy: false,
      allergens: [],
      vipOnly: false,
    };

    // Reset UI
    const searchInput = document.getElementById("menu-search");
    if (searchInput) searchInput.value = "";

    const clearBtn = document.querySelector(".search-clear");
    if (clearBtn) clearBtn.style.display = "none";

    // Reset quick filters
    document.querySelectorAll(".quick-filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Reset category filters
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    const allBtn = document.querySelector('.filter-btn[data-category="all"]');
    if (allBtn) allBtn.classList.add("active");

    // Reset allergen filters
    document.querySelectorAll(".allergen-checkbox").forEach((checkbox) => {
      checkbox.checked = false;
    });

    this.applyFilters();
  }

  // Metodo per filtri esterni
  filterByCategory(category) {
    this.currentFilters.category = category;

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    const targetBtn = document.querySelector(`[data-category="${category}"]`);
    if (targetBtn) {
      targetBtn.classList.add("active");
    }

    this.applyFilters();
  }
}

// Inizializza quando il DOM è pronto
document.addEventListener("DOMContentLoaded", () => {
  window.continentalMenuController = new ContinentalMenuController();
});
