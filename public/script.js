const cardForm = document.querySelector('#cardForm');
const questionInput = document.querySelector('#question');
const answerInput = document.querySelector('#answer');
const categoryInput = document.querySelector('#category');
const formMessage = document.querySelector('#formMessage');
const cardsList = document.querySelector('#cardsList');
const cardCount = document.querySelector('#cardCount');
const categoryFilter = document.querySelector('#categoryFilter');
const studyQuestion = document.querySelector('#studyQuestion');
const studyAnswer = document.querySelector('#studyAnswer');
const showAnswerButton = document.querySelector('#showAnswerButton');
const nextCardButton = document.querySelector('#nextCardButton');

let cards = [];
let currentStudyIndex = 0;

async function loadCards() {
  try {
    const response = await fetch('/api/cards');

    if (!response.ok) {
      throw new Error('Karten konnten nicht geladen werden.');
    }

    cards = await response.json();
    renderCategoryFilter();
    renderCards();
    renderStudyCard();
  } catch (error) {
    formMessage.textContent = 'Backend nicht erreichbar. Bitte die App mit npm start starten und http://localhost:3100 oeffnen.';
    cards = [];
    renderCategoryFilter();
    renderCards();
    renderStudyCard();
  }
}

function getVisibleCards() {
  if (categoryFilter.value === 'all') {
    return cards;
  }

  return cards.filter((card) => card.category === categoryFilter.value);
}

function renderCategoryFilter() {
  const selectedValue = categoryFilter.value;
  const categories = [...new Set(cards.map((card) => card.category))].sort();

  categoryFilter.innerHTML = '<option value="all">Alle Kategorien</option>';

  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });

  if (categories.includes(selectedValue)) {
    categoryFilter.value = selectedValue;
  }
}

function renderCards() {
  const visibleCards = getVisibleCards();
  cardCount.textContent = cards.length;
  cardsList.innerHTML = '';

  if (visibleCards.length === 0) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'Keine Lernkarten gefunden.';
    cardsList.append(emptyState);
    return;
  }

  visibleCards.forEach((card) => {
    const cardElement = document.createElement('article');
    cardElement.className = 'card-item';

    const header = document.createElement('div');
    header.className = 'card-item-header';

    const title = document.createElement('strong');
    title.textContent = card.question;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Loeschen';
    deleteButton.addEventListener('click', () => deleteCard(card.id));

    const category = document.createElement('span');
    category.className = 'category';
    category.textContent = card.category;

    const answer = document.createElement('p');
    answer.textContent = card.answer;

    header.append(title, deleteButton);
    cardElement.append(header, category, answer);
    cardsList.append(cardElement);
  });
}

function renderStudyCard() {
  const visibleCards = getVisibleCards();
  studyAnswer.classList.add('hidden');
  showAnswerButton.disabled = visibleCards.length === 0;
  nextCardButton.disabled = visibleCards.length === 0;

  if (visibleCards.length === 0) {
    studyQuestion.textContent = 'Keine Lernkarte vorhanden';
    studyAnswer.textContent = '';
    showAnswerButton.textContent = 'Antwort anzeigen';
    return;
  }

  if (currentStudyIndex >= visibleCards.length) {
    currentStudyIndex = 0;
  }

  const currentCard = visibleCards[currentStudyIndex];
  studyQuestion.textContent = currentCard.question;
  studyAnswer.textContent = currentCard.answer;
  showAnswerButton.textContent = 'Antwort anzeigen';
}

async function createCard(event) {
  event.preventDefault();

  const newCard = {
    question: questionInput.value,
    answer: answerInput.value,
    category: categoryInput.value
  };

  try {
    const response = await fetch('/api/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCard)
    });

    if (!response.ok) {
      const error = await response.json();
      formMessage.textContent = error.message;
      return;
    }

    cardForm.reset();
    formMessage.textContent = 'Lernkarte wurde gespeichert.';
    await loadCards();
  } catch (error) {
    formMessage.textContent = 'Speichern nicht moeglich. Bitte pruefen, ob der Server laeuft und die Seite ueber http://localhost:3100 geoeffnet ist.';
  }
}

async function deleteCard(id) {
  try {
    const response = await fetch(`/api/cards/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      formMessage.textContent = 'Lernkarte wurde geloescht.';
      await loadCards();
    }
  } catch (error) {
    formMessage.textContent = 'Loeschen nicht moeglich. Bitte pruefen, ob der Server laeuft.';
  }
}

showAnswerButton.addEventListener('click', () => {
  studyAnswer.classList.toggle('hidden');
  showAnswerButton.textContent = studyAnswer.classList.contains('hidden')
    ? 'Antwort anzeigen'
    : 'Antwort ausblenden';
});

nextCardButton.addEventListener('click', () => {
  const visibleCards = getVisibleCards();
  currentStudyIndex = (currentStudyIndex + 1) % visibleCards.length;
  renderStudyCard();
});

categoryFilter.addEventListener('change', () => {
  currentStudyIndex = 0;
  renderCards();
  renderStudyCard();
});

cardForm.addEventListener('submit', createCard);

loadCards();
