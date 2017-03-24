/* 
 * Interfaces du jeu
 */
class Game {
    constructor() { };
    setBasics() {
        can.setSize();
        tileSizeOnScreen = Math.floor(can.size*percentOfScreen);        
    }
    /*
     * Dessins pour les différents écrans d'interface
     */
    uiBasics() {
        can.uiContext.drawImage(images.scroll, 0, 0, can.ui.width, can.ui.height);
        
        can.uiFontStyle(80,'enchantedLandRegular');
        can.uiContext.fillText('MyFirstRPG - V2', can.ui.width/2, 120);       
    };
    uiMain(main = true) {
        let textes = (main)? ['Nouvelle partie', 'Charger partie'] : ['Sauvegarder partie', 'Charger partie', 'Abandonner partie'];
        let len = textes.length;
        let textSize = 40;
        
        this.uiBasics();
        
        can.uiFontStyle(textSize);
        
        for(let i = 0; i < len; i++) {
            //Donne la longueur du texte AVANT de l'écrire
            // can.uiContext.measureText(text).width
            
            can.uiContext.fillText(textes[i], can.ui.width/2, can.ui.height/2+2*(i-1)*textSize);  
        }   
    };
    uiNewGame() {
        this.uiBasics();    
    };
    uiLoadGame() {
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
        can.ui.style.display = "block";
        can.uiControl(true);
    };
    hideUi() {
        can.ui.style.display = "none";
        can.uiControl(false);
    };
    showGame() {
        can.map.style.display = "block";
        can.items.style.display = "block";
        can.perso.style.display = "block";
        window.addEventListener('keydown', can.gameManageKey, false);
    };
    hideGame() {
        can.map.style.display = "none";
        can.items.style.display = "none";
        can.perso.style.display = "none";
        window.removeEventListener('keydown', can.gameManageKey);
    };
}

