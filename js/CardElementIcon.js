export default class cardElementIcon {
    constructor(icon) {
        this.cardElement = document.createElement('div');
        this.cardElement.className = 'card';
        this.icon = icon;
        this.cardContainer = document.getElementById('card-container');
    }
    
    create() {
        this.cardElement.innerHTML = `
        <div class="card-icon material-symbols-rounded">${this.icon}</div>
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
        
        return this.cardElement;
    }
    
    resolve() {
        this.hide(this.cardElement)
    }
    
    duplicate() {
        let duplicate = new cardElementIcon(this.icon);
        duplicate.create();
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