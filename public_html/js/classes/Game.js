/* 
 * Interfaces du jeu
 */
class Game {
    constructor() { };
    setBaseSizes() {
        can.setSize();
        tileSizeOnScreen = Math.floor(can.size*percentOfScreen);        
    };
    /*
     * Dessine les différents écrans d'interface
     */
    uiFontStyle(fontSize = 40, font = 'Arial', fontColor = 'black', align = 'center') {
        can.uiContext.fillStyle = fontColor;
        can.uiContext.textAlign = align;  
        can.uiContext.font = fontSize + 'px ' + font;
    };
    uiBasics() {
        can.uiContext.drawImage(images.scroll, 0, 0, can.ui.width, can.ui.height);
        
        this.uiFontStyle(80,'enchantedLandRegular');
        can.uiContext.fillText('MyFirstRPG - V2', can.ui.width/2, 120);       
    };
    uiDrawText(textes, nbTextes, fontSize) {
        this.uiFontStyle(fontSize);
        
        for(let i = 0; i < nbTextes; i++) {
            let posX = Math.floor(can.ui.width/2 - can.uiContext.measureText(textes[i]).width/2);
            let posY = Math.floor(can.ui.height/2+2*(i-1)*fontSize-fontSize);
            
            can.textPos[i] = {
                name : (can.state === 'load')? textes[i] : textes[i].substr(0, textes[i].length-7),
                x : posX, 
                y : posY, 
                w : can.uiContext.measureText(textes[i]).width, 
                h : fontSize
            };

            can.uiContext.fillText(textes[i], can.ui.width/2, can.ui.height/2+2*(i-1)*fontSize); 
        }
    };
    uiScreen() {
        let textes = [];
        switch(can.state) {
            case 'acc':
                textes = ['Nouvelle partie', 'Charger partie'];
                break;
            case 'opt':
                textes = ['Sauvegarder partie', 'Charger partie', 'Abandonner partie'];
                break;
            case 'load':
                textes = ['Sauvegarde 1', 'Sauvegarde 2', 'Sauvegarde 3', 'Retour'];
                break;
            default:
                break;   
        }   

        this.uiBasics();
        this.uiDrawText(textes, textes.length, 40);
    };
    uiNewGame() {
        this.uiBasics();
    };
    uiInventaire() {
        
    };
    gameScreen() {
        
    };
    /*
     * Masque / Affiche l'interface ou le jeu
     */
    showUi() {
        can.ui.style.display = 'block';
    };
    hideUi() {
        can.ui.style.display = 'none';
    };
    showGame() {
        can.map.style.display = 'block';
        can.items.style.display = 'block';
        can.perso.style.display = 'block';
    };
    hideGame() {
        can.map.style.display = 'none';
        can.items.style.display = 'none';
        can.perso.style.display = 'none';
    };
    uiNextPage(goTo) {
        can.uiContext.clearRect(0,0, can.ui.width, can.ui.height);
        
        switch(goTo) {
            case 'Abandonner':
                can.state = 'acc';
                this.uiScreen();
                break;
            case 'opt':
                can.state = 'opt';
                this.uiScreen();
                break;
            case 'Nouvelle':
                can.state = 'new';
                this.uiNewGame();
                break;
            case 'Charger':
                can.uiFrom = can.state;
                can.state = 'load';
                this.uiScreen();
                break;
            case 'Retour':
                (can.uiFrom === 'opt')? this.uiNextPage('opt') : this.uiNextPage('Abandonner');
                this.uiScreen();
                break;
            default:
                can.state = 'jeu';
                this.hideUi();
                this.showGame();
                break;
        }
    }
}

