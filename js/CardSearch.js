import CardElement from "./CardElement.js";

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
            this.fetchCard(cardName);
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
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.lastRequestTime;
        if (elapsedTime >= 100) {
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
            
            this.lastRequestTime = currentTime;
        } else {
            console.log('API request rate limit exceeded. Wait for some time before making another request.');
        }
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
            const cardElement = new CardElement(data);
            cardElement.create();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}