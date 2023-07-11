import CardSearch from './CardSearch.js';
import sortable from './Sortable.js';

const cardSearch = new CardSearch();

let emptyStackButton = document.getElementById('empty-stack-button');
emptyStackButton.onclick = () => {
    if (window.confirm("Remove all cards from the stack?")) {
        let cardContainer = document.getElementById('card-container');
        while (cardContainer.firstChild) {
            cardContainer.removeChild(cardContainer.firstChild);
        }
    }
}