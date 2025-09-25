// Menu Continental Bar Ristorante - Cucina Africana
const menuData = {
  antipasti: [
    {
      id: 1,
      foto: "../img/food-pic.jpg",
      nome: "Panini",
      prezzo: 5.0,
      descrizione: "Panini tradizionali",
      allergeni: ["glutine"],
      categoria: "antipasti",
    },
    {
      id: 2,
      foto: "../img/food-pic.jpg",
      nome: "Insalata",
      prezzo: 10.0,
      descrizione: "Insalata fresca mista",
      allergeni: [],
      categoria: "antipasti",
    },
  ],

  zuppe: [
    {
      id: 3,
      foto: "../img/food-pic.jpg",
      nome: "Zuppa di Pesce",
      prezzo: 15.0,
      descrizione: "Zuppa tradizionale di pesce",
      allergeni: ["pesce"],
      categoria: "zuppe",
    },
    {
      id: 4,
      foto: "../img/food-pic.jpg",
      nome: "Zuppa di Lumache",
      prezzo: 20.0,
      descrizione: "Zuppa di lumache con riso attieké",
      allergeni: ["molluschi"],
      categoria: "zuppe",
    },
    {
      id: 5,
      foto: "../img/food-pic.jpg",
      nome: "Zuppa del Pescatore",
      prezzo: 20.0,
      descrizione: "Zuppa del pescatore con gamberi",
      allergeni: ["pesce", "crostacei"],
      categoria: "zuppe",
    },
    {
      id: 6,
      foto: "../img/food-pic.jpg",
      nome: "Zuppa Olio di Palma",
      prezzo: 20.0,
      descrizione: "Pasta di banana con zuppa all'olio di palma",
      allergeni: [],
      categoria: "zuppe",
    },
  ],

  primi_piatti: [
    {
      id: 7,
      foto: "../img/food-pic.jpg",
      nome: "Garba",
      prezzo: 15.0,
      descrizione: "Tonno e semola di manioca",
      allergeni: ["pesce"],
      categoria: "primi_piatti",
    },
    {
      id: 8,
      foto: "../img/food-pic.jpg",
      nome: "Attiéké Pesce Fritto",
      prezzo: 15.0,
      descrizione: "Semola di manioca con pesce fritto",
      allergeni: ["pesce"],
      categoria: "primi_piatti",
    },
    {
      id: 9,
      foto: "../img/food-pic.jpg",
      nome: "Tchep",
      prezzo: 15.0,
      descrizione: "Riso, verdura, pesce, pollo",
      allergeni: ["pesce"],
      categoria: "primi_piatti",
    },
    {
      id: 10,
      foto: "../img/food-pic.jpg",
      nome: "Yassa Pollo",
      prezzo: 20.0,
      descrizione: "Pollo marinato con cipolla e limone su riso",
      allergeni: [],
      categoria: "primi_piatti",
    },
    {
      id: 11,
      foto: "../img/food-pic.jpg",
      nome: "Yam e Pollo",
      prezzo: 20.0,
      descrizione: "Igname bollito con pollo",
      allergeni: [],
      categoria: "primi_piatti",
    },
    {
      id: 12,
      foto: "../img/food-pic.jpg",
      nome: "Placali",
      prezzo: 20.0,
      descrizione: "Pasta di manioca con zuppa",
      allergeni: [],
      categoria: "primi_piatti",
    },
  ],

  secondi_piatti: [
    {
      id: 13,
      foto: "../img/food-pic.jpg",
      nome: "Alloco Pesce Fritto",
      prezzo: 20.0,
      descrizione: "Platano fritto con pesce",
      allergeni: ["pesce"],
      categoria: "secondi_piatti",
    },
    {
      id: 14,
      foto: "../img/food-pic.jpg",
      nome: "Alloco Pollo Fritto",
      prezzo: 20.0,
      descrizione: "Platano fritto con pollo",
      allergeni: [],
      categoria: "secondi_piatti",
    },
    {
      id: 15,
      foto: "../img/food-pic.jpg",
      nome: "Kedjenou di Pollo",
      prezzo: 20.0,
      descrizione: "Pollo tradizionale in terracotta",
      allergeni: [],
      categoria: "secondi_piatti",
    },
    {
      id: 16,
      foto: "../img/food-pic.jpg",
      nome: "Pollo/Pesce alla Griglia",
      prezzo: 25.0,
      descrizione: "Pollo o pesce braisé alla griglia",
      allergeni: ["pesce"],
      categoria: "secondi_piatti",
    },
    {
      id: 17,
      foto: "../img/food-pic.jpg",
      nome: "Pollo/Pesce e Patate Fritte",
      prezzo: 15.0,
      descrizione: "Pollo o pesce con patate fritte",
      allergeni: ["pesce"],
      categoria: "secondi_piatti",
    },
    {
      id: 18,
      foto: "../img/food-pic.jpg",
      nome: "Tacchino Fritto",
      prezzo: 15.0,
      descrizione: "Tacchino fritto tradizionale",
      allergeni: [],
      categoria: "secondi_piatti",
    },
  ],

  specialita: [
    {
      id: 19,
      foto: "../img/food-pic.jpg",
      nome: "Piatto VIP",
      prezzo: 50.0,
      descrizione: "Pesce, Pollo, Patate fritte, Attiéké",
      allergeni: ["pesce"],
      categoria: "specialita",
      isVip: true,
    },
  ],
};

// Funzione per ottenere tutti i piatti in un array singolo
const getAllDishes = () => {
  return Object.values(menuData).flat();
};

// Funzione per filtrare per categoria
const getDishesByCategory = (categoria) => {
  return getAllDishes().filter((dish) => dish.categoria === categoria);
};

// Funzione per cercare piatti per allergeni
const getDishesWithoutAllergens = (allergeniDaEvitare) => {
  return getAllDishes().filter(
    (dish) =>
      !dish.allergeni.some((allergene) =>
        allergeniDaEvitare.includes(allergene)
      )
  );
};

// Funzione per formattare il prezzo
const formatPrice = (prezzo) => {
  return `€ ${prezzo.toFixed(2)}`;
};

// Lista degli allergeni disponibili nel menu
const allergeniDisponibili = [
  { id: "glutine", nome: "Glutine", icona: "🌾" },
  { id: "pesce", nome: "Pesce", icona: "🐟" },
  { id: "crostacei", nome: "Crostacei", icona: "🦐" },
  { id: "molluschi", nome: "Molluschi", icona: "🐌" },
  { id: "uova", nome: "Uova", icona: "🥚" },
  { id: "latte", nome: "Latte", icona: "🥛" },
  { id: "arachidi", nome: "Arachidi", icona: "🥜" },
  { id: "soia", nome: "Soia", icona: "🫘" },
];

// Esempio di utilizzo:
console.log("Menu completo:", getAllDishes());
console.log("Solo primi piatti:", getDishesByCategory("primi_piatti"));
console.log("Piatti senza pesce:", getDishesWithoutAllergens(["pesce"]));

// Export per utilizzo in altri file
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    menuData,
    getAllDishes,
    getDishesByCategory,
    getDishesWithoutAllergens,
    formatPrice,
    allergeniDisponibili,
  };
}
