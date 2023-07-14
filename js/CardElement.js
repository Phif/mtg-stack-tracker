export default class CardElement {
    constructor(cardData) {
        this.cardData = cardData;
        this.cardElement = document.createElement('div');
        this.cardElement.className = 'card';
        this.cardName = cardData.name;
        this.cardArtCropped = cardData.image_uris.art_crop;
        this.cardArtFull = cardData.image_uris.png;
        this.cardContainer = document.getElementById('card-container');
    }
    
    create() {
        this.cardElement.innerHTML = `
        <img class="card-art" src="${this.cardArtCropped}" alt="${this.cardName}">
        <div class="card-details">
        <h3 class="card-name">${this.cardName}</h3>
        </div>
        <div class="card-button-container">
        <button class="duplicate-card-button"><span class="material-symbols-rounded">library_add</span></button>
        <button class="resolve-card-button"><span class="material-symbols-rounded">done</span></button>
        </div>
        `;
        
        this.show(this.cardElement);
        
        this.cardElement.querySelector('.duplicate-card-button').onclick = () => {
            this.duplicate();
        }
        this.cardElement.querySelector('.resolve-card-button').onclick = () => {
            this.resolve();
        }
        this.cardElement.querySelector('.card-art').onclick = () => {
            this.displayFullCard();
        }
        
        return this.cardElement;
    }
    
    displayFullCard() {
        let modal = document.createElement('div');
        modal.className = 'full-card-modal';
        let img = document.createElement('img');
        img.className = 'full-card-image';
        document.body.appendChild(modal);
        let rulings = [];
        img.onload = () => {
            modal.appendChild(img);
            fetch(this.cardData.rulings_uri)
            .then(response => response.json())
            .then(data => {
                rulings = data;
                console.log(rulings)
                if (rulings.data.length > 0) {
                    const rulingsContainer = document.createElement('div');
                    rulingsContainer.className = 'rulings-container';
                    modal.appendChild(rulingsContainer);
                    for (let i = 0; i < rulings.data.length; i++) {
                        const ruling = document.createElement('span');
                        ruling.className = 'rulings';
                        ruling.innerHTML = `<em>${rulings.data[i].published_at}</em> :<br>
                        ${rulings.data[i].comment}`;
                        rulingsContainer.appendChild(ruling);
                    }
                }
                
            })
            .catch(error => {
                console.error('Error:', error);
            });
            
            
        }
        img.src = this.cardArtFull;
        
        modal.onmousedown = (event) => {
            if (event.target === event.currentTarget) {
                modal.remove();
            }
        };
    }
    
    resolve() {
        this.hide(this.cardElement)
    }
    
    duplicate() {
        let duplicate = new CardElement(this.cardData);
        duplicate.create();
    }

    async getCardRulings(cardName) {
        try {
            const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`);
            const cardData = await response.json();
            
            if (cardData.object === 'card' && cardData.rulings_uri) {
                const rulingsResponse = await fetch(cardData.rulings_uri);
                const rulingsData = await rulingsResponse.json();
                
                if (rulingsData.data.length > 0) {
                    return rulingsData.data.map((ruling) => ruling.comment);
                } else {
                    return 'No rulings found for this card.';
                }
            } else {
                return 'Card not found.';
            }
        } catch (error) {
            console.error('Error retrieving card rulings:', error.message);
        }
    }
    
    show(element, duration = 300) {
        element.style.opacity = 0;
        element.style.transform = 'translateY(-100%)';
        element.style.transition = `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`;
        this.cardContainer.prepend(this.cardElement);
        setTimeout(() => {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0)';
        }, 100);
    }
    
    hide(element, duration = 300) {
        element.style.opacity = 1;
        element.style.transform = 'translateY(0)';
        element.style.transition = `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.style.opacity = 0;
            // element.style.transform = 'translateY(-100%)';
        }, 10);
        setTimeout(() => {
            element.remove();
        }, duration);
    }
}