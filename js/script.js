import CardSearch from './CardSearch.js';
import CardElement from './CardElement.js';
import IconElement from './CardElementIcon.js';
import sortable from './Sortable.js';
import initBaseIcons from './initBaseIcons.js';

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

initBaseIcons();