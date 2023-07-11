export default class CardElement {
    constructor(cardData) {
        this.cardData = cardData;
        this.cardElement = document.createElement('div');
        this.cardElement.className = 'card';
        this.cardName = cardData.name
        this.cardArt = cardData.image_uris.art_crop
        this.uuid = this.uuidv4();
    }
    
    create() {
        this.cardElement.dataset.uuid = this.uuid;
        this.cardElement.innerHTML = `
        <img src="${this.cardArt}" alt="${this.cardName}">
        <div class="card-details">
        <h3 class="card-name">${this.cardName}</h3>
        </div>
        <div class="card-button-container">
        <button class="duplicate-card-button" onclick="this.duplicate()"><span class="material-symbols-rounded">content_copy</span></button>
        <button class="resolve-card-button" onclick="this.resolve()"><span class="material-symbols-rounded">check_circle</span></button>
        </div>
        `;
        document.getElementById('card-container').prepend(this.cardElement);

        this.cardElement.querySelector('.duplicate-card-button').onclick = () => {
            this.duplicate();
        }
        this.cardElement.querySelector('.resolve-card-button').onclick = () => {
            this.resolve();
        }

        return this.cardElement;
    }
    
    resolve() {
        this.cardElement.remove();
    }
    
    duplicate() {
        let duplicate = new CardElement(this.cardData);
        duplicate.create();
    }
    
    uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
        
        console.log(uuidv4());
    }
}