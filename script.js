"use strict";

// ======================================================
// SELECT ELEMENTS
// ======================================================

const totalCards = document.getElementById("totalCards");

const cardForm = document.getElementById("cardForm");

const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const searchInput = document.getElementById("searchInput");

const clearSearchBtn = document.getElementById("clearSearchBtn");

const cardsGrid = document.getElementById("cardsGrid");

// ======================================================
// CARD STATE
// ======================================================

let cards = [];

// ======================================================
// STORAGE SYSTEM
// ======================================================

function saveCards() {
  localStorage.setItem("memoryCards", JSON.stringify(cards));
}

function loadCards() {
  const storedCards = localStorage.getItem("memoryCards");

  if (storedCards) {
    cards = JSON.parse(storedCards);
  }
}

// ======================================================
// CARD ACTIONS
// ======================================================

function addCard() {
  const card = {
    id: Date.now(),
    question: questionInput.value.trim(),
    answer: answerInput.value.trim(),
  };

  cards.push(card);

  saveCards();
  renderCards();
  renderStats();

  cardForm.reset();
}

function deleteCard(id) {
  cards = cards.filter((card) => {
    return card.id !== id;
  });

  saveCards();
  renderCards();
  renderStats();
}

// ======================================================
// FILTERING SYSTEM
// ======================================================

function getFilteredCards() {
  let filteredCards = [...cards];

  const searchValue = searchInput.value.toLowerCase().trim();

  if (searchValue !== "") {
    filteredCards = filteredCards.filter((card) => {
      return (
        card.question.toLowerCase().includes(searchValue) ||
        card.answer.toLowerCase().includes(searchValue)
      );
    });
  }

  return filteredCards;
}

// ======================================================
// UI RENDERING
// ======================================================

function renderCards() {
  cardsGrid.innerHTML = "";

  const filteredCards = getFilteredCards();

  if (filteredCards.length === 0) {
    cardsGrid.innerHTML = `
    <div class="empty-deck">
        <h3>No cards found</h3>
        <p>Create your first memory card or try another search.</p>
      </div>
    `;
    return;
  }

  filteredCards.forEach((card) => {
    cardsGrid.innerHTML += `
    
     <article class="memory-card">
        <button class="delete-card" data-id="${card.id}">
          ×
        </button>

         <div class="card-inner">
          <div class="card-front">
            <span class="card-label">Question</span>

            <p class="card-text">
              ${card.question}
            </p>

            <span class="card-hint">Click to reveal answer</span>
          </div>

          <div class="card-back">
            <span class="card-label">Answer</span>

            <p class="card-text">
              ${card.answer}
            </p>

            <span class="card-hint">Click to flip back</span>
          </div>
        </div>
      </article>
    `;
  });
}

function renderStats() {
  totalCards.textContent = cards.length;
}

// ======================================================
// FORM HANDLING
// ======================================================

cardForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (questionInput.value.trim() === "" || answerInput.value.trim() === "") {
    return;
  }

  addCard();
});

// ======================================================
// EVENT LISTENERS
// ======================================================

searchInput.addEventListener("input", renderCards);

clearSearchBtn.addEventListener("click", () => {
  searchInput.value = "";
  renderCards();
});

cardsGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-card")) {
    const id = Number(e.target.dataset.id);

    deleteCard(id);
    return;
  }

  const card = e.target.closest(".memory-card");

  if (!card) return;

  card.classList.toggle("flipped");
});

// ======================================================
// INITIAL LOAD
// ======================================================

loadCards();
renderCards();
renderStats();
