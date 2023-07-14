import CardElementIcon from './CardElementIcon.js';

export default function initBaseIcons() {
    const toggleButton = document.getElementById('base-icons-toggle');
    const baseIconsContainer = document.getElementById('base-icons-container');
    
    toggleButton.addEventListener('click', function() {
        if (baseIconsContainer.style.display === 'none') {
            baseIconsContainer.style.display = 'flex';
            toggleButton.textContent = 'Hide icons';
        } else {
            baseIconsContainer.style.display = 'none';
            toggleButton.textContent = 'Show icons';
        }
    });
    
    let baseIcons = [
        "brightness_5",
        "water_drop",
        "skull",
        "local_fire_department",
        "park",
        "thunderstorm",
        "bolt",
        "ac_unit",
        "air",
        "ecg_heart",
        "swords",
        "shield",
        "visibility",
        "rotate_right",
        "rotate_left",
        "cookie",
        "genetics",
        "playing_cards",
        "landscape",
        "spa"
    ]
    
    for (let i = 0; i < baseIcons.length; i++) {
        let baseIconButton = document.createElement('button');
        baseIconButton.className = 'base-icon-button';
        baseIconsContainer.appendChild(baseIconButton);
        
        let baseIcon = document.createElement('span');
        baseIcon.className = 'material-symbols-rounded';
        baseIcon.innerHTML = baseIcons[i];
        baseIconButton.appendChild(baseIcon);
        baseIconButton.onclick = () => {
            let card = new CardElementIcon(baseIcons[i]);
            card.create();
        }
    }
}
