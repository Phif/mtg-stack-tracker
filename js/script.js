import CardSearch from './CardSearch.js';
import sortable from './Sortable.js';

const cardSearch = new CardSearch();

// let resolveAllButton = document.getElementById('resolve-stack-button');
// resolveAllButton.onclick = () => {
//     if (window.confirm("Resolve all cards in the stack?")) {
//         let cardContainer = document.getElementById('card-container');
//         let cards = cardContainer.querySelectorAll('.card');
//         for (let i = 0; i < cards.length; i++) {
//             cards[i].querySelector('.resolve-card-button').click();

//         }
//     }
// }

let emptyStackButton = document.getElementById('empty-stack-button');
emptyStackButton.onclick = () => {
    if (window.confirm("Remove all cards from the stack?")) {
        let cardContainer = document.getElementById('card-container');
        while (cardContainer.firstChild) {
            cardContainer.removeChild(cardContainer.firstChild);
        }
    }
}
