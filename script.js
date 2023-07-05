const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const cardContainer = document.getElementById('card-container');
let manaSymbols = {};
let lastRequestTime = 0;

// Autocomplete variables
let autocompleteList = [];
let currentFocus;

// Event listeners
searchButton.addEventListener('click', searchCard);
searchInput.addEventListener('input', handleAutocomplete);
document.addEventListener('click', clearAutocomplete);

fetch('https://api.scryfall.com/symbology')
.then(response => response.json())
.then(data => {
  manaSymbols = data.symbols;
})
.catch(error => {
  console.error('Error fetching mana symbols:', error);
});

function searchCard() {
  const cardName = searchInput.value;
  if (cardName) {
    const currentTime = Date.now();
    if (currentTime - lastRequestTime >= 100) { 
      fetchCard(cardName);
      lastRequestTime = currentTime;
    } else {
      console.log('Too many requests. Please wait before searching again.');
    }
  }
}

function handleAutocomplete() {
  const cardName = searchInput.value;
  if (cardName) {
    fetchAutocomplete(cardName);
  } else {
    clearAutocomplete();
  }
}

function fetchAutocomplete(query) {
  const apiUrl = `https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`;
  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    autocompleteList = data.data || [];
    showAutocomplete();
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function showAutocomplete() {
  clearAutocomplete();
  const autocompleteDropdown = document.createElement('div');
  autocompleteDropdown.setAttribute('class', 'autocomplete-items');
  searchInput.parentNode.appendChild(autocompleteDropdown);
  
  autocompleteList.forEach((item, index) => {
    const autocompleteOption = document.createElement('div');
    autocompleteOption.innerHTML = `<strong>${item}</strong>`;
    autocompleteOption.addEventListener('click', () => {
      searchInput.value = item;
      searchCard();
    });
    autocompleteDropdown.appendChild(autocompleteOption);
  });
}

function clearAutocomplete() {
  const autocompleteDropdown = document.querySelector('.autocomplete-items');
  if (autocompleteDropdown) {
    autocompleteDropdown.parentNode.removeChild(autocompleteDropdown);
  }
}

document.addEventListener('keydown', function(e) {
  const autocompleteDropdown = document.querySelector('.autocomplete-items');
  if (autocompleteDropdown) {
    const autocompleteOptions = autocompleteDropdown.getElementsByTagName('div');
    if (e.keyCode === 40) {
      // Arrow down key
      currentFocus++;
      addActive(autocompleteOptions);
    } else if (e.keyCode === 38) {
      // Arrow up key
      currentFocus--;
      addActive(autocompleteOptions);
    } else if (e.keyCode === 13) {
      // Enter key
      e.preventDefault();
      if (currentFocus > -1) {
        if (autocompleteOptions) {
          autocompleteOptions[currentFocus].click();
        }
      }
    }
  }
});

function addActive(autocompleteOptions) {
  if (!autocompleteOptions) {
    return false;
  }
  removeActive(autocompleteOptions);
  if (currentFocus >= autocompleteOptions.length) {
    currentFocus = 0;
  }
  if (currentFocus < 0) {
    currentFocus = autocompleteOptions.length - 1;
  }
  autocompleteOptions[currentFocus].classList.add('autocomplete-active');
}

function removeActive(autocompleteOptions) {
  for (let i = 0; i < autocompleteOptions.length; i++) {
    autocompleteOptions[i].classList.remove('autocomplete-active');
  }
}

function fetchCard(cardName) {
  const apiUrl = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`;
  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const cardElement = createCardElement(data);
    cardContainer.insertBefore(cardElement, cardContainer.firstChild);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function createCardElement(cardData) {
  const cardElement = document.createElement('div');
  cardElement.className = 'card';
  cardElement.innerHTML = `
  <img src="${cardData.image_uris.art_crop}" alt="${cardData.name}">
  <div class="card-details">
  <h3 class="card-name">${cardData.name}</h3>
  </div>
  <button class="resolve-card-button" onclick="this.parentNode.remove()">
  <span class="material-symbols-rounded">check_circle</span>
  </button>
  `;
  
  return cardElement;
}

function emptyCardContainer() {
  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.firstChild);
  }
}

var el = document.getElementById('card-container');
var sortable = new Sortable(el, {
  animation: 150,
  ghostClass: 'ghost-class',
  delay: 50, 
  delayOnTouchOnly: true
});