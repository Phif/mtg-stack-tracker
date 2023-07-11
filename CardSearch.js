export default class CardSearch {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-button');
        this.cardContainer = document.getElementById('card-container');
        this.manaSymbols = {};
        this.lastRequestTime = 0;
        this.autocompleteList = [];
        this.currentFocus = null;
        
        this.searchButton.addEventListener('click', this.searchCard.bind(this));
        this.searchInput.addEventListener('input', this.handleAutocomplete.bind(this));
        document.addEventListener('click', this.clearAutocomplete.bind(this));
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        fetch('https://api.scryfall.com/symbology')
        .then(response => response.json())
        .then(data => {
            this.manaSymbols = data.symbols;
        })
        .catch(error => {
            console.error('Error fetching mana symbols:', error);
        });
    }
    
    searchCard() {
        const cardName = this.searchInput.value;
        if (cardName) {
            const currentTime = Date.now();
            if (currentTime - this.lastRequestTime >= 100) {
                this.fetchCard(cardName);
                this.lastRequestTime = currentTime;
            } else {
                console.log('Too many requests. Please wait before searching again.');
            }
        }
    }
    
    handleAutocomplete() {
        const cardName = this.searchInput.value;
        if (cardName) {
            this.fetchAutocomplete(cardName);
        } else {
            this.clearAutocomplete();
        }
    }
    
    fetchAutocomplete(query) {
        const apiUrl = `https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}`;
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            this.autocompleteList = data.data || [];
            this.showAutocomplete();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    showAutocomplete() {
        this.clearAutocomplete();
        const autocompleteDropdown = document.createElement('div');
        autocompleteDropdown.setAttribute('class', 'autocomplete-items');
        this.searchInput.parentNode.appendChild(autocompleteDropdown);
        
        this.autocompleteList.forEach((item, index) => {
            const autocompleteOption = document.createElement('div');
            autocompleteOption.innerHTML = `<strong>${item}</strong>`;
            autocompleteOption.addEventListener('click', () => {
                this.searchInput.value = item;
                this.searchCard();
            });
            autocompleteDropdown.appendChild(autocompleteOption);
        });
    }
    
    clearAutocomplete() {
        const autocompleteDropdown = document.querySelector('.autocomplete-items');
        if (autocompleteDropdown) {
            autocompleteDropdown.parentNode.removeChild(autocompleteDropdown);
        }
    }
    
    handleKeydown(e) {
        const autocompleteDropdown = document.querySelector('.autocomplete-items');
        if (autocompleteDropdown) {
            const autocompleteOptions = autocompleteDropdown.getElementsByTagName('div');
            if (e.code === 'ArrowDown') {
                // Arrow down key
                this.currentFocus++;
                this.addActive(autocompleteOptions);
            } else if (e.code === 'ArrowUp') {
                // Arrow up key
                this.currentFocus--;
                this.addActive(autocompleteOptions);
            } else if (e.code === 'Enter') {
                // Enter key
                e.preventDefault();
                if (this.currentFocus > -1) {
                    if (autocompleteOptions) {
                        autocompleteOptions[this.currentFocus].click();
                    }
                }
            }
        }
    }
    
    addActive(autocompleteOptions) {
        if (!autocompleteOptions) {
            return false;
        }
        this.removeActive(autocompleteOptions);
        if (this.currentFocus >= autocompleteOptions.length) {
            this.currentFocus = 0;
        }
        if (this.currentFocus < 0) {
            this.currentFocus = autocompleteOptions.length - 1;
        }
        autocompleteOptions[this.currentFocus].classList.add('autocomplete-active');
    }
    
    removeActive(autocompleteOptions) {
        for (let i = 0; i < autocompleteOptions.length; i++) {
            autocompleteOptions[i].classList.remove('autocomplete-active');
        }
    }
    
    fetchCard(cardName) {
        const apiUrl = `https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`;
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const cardElement = this.createCardElement(data);
            this.cardContainer.insertBefore(cardElement, this.cardContainer.firstChild);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    createCardElement(cardData) {
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
    
    emptyCardContainer() {
        while (this.cardContainer.firstChild) {
            this.cardContainer.removeChild(this.cardContainer.firstChild);
        }
    }
}
