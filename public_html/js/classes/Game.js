/* 
 * Interfaces et écrans du jeu
 */
class Game {
    constructor() { };
    setBaseSizes() {
        can.setSize();
        info.setPos();
        tileSizeOnScreen = Math.floor(can.size/nbTilesPerLine);        
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
        let fontSize = (can.size < 700)? 40 : 80;

        can.uiContext.drawImage(images.scroll, 0, 0, can.ui.width, can.ui.height);
        
        this.uiFontStyle(fontSize,'enchantedLandRegular');
        can.uiContext.fillText('MyFirstRPG - V2', can.ui.width/2, can.ui.height*15/100);       
    };
    uiDrawText(textes, nbTextes, fontSize) {
        this.uiFontStyle(fontSize);
        
        for(let i = 0; i < nbTextes; i++) {
            let posX = Math.floor(can.ui.width/2 - can.uiContext.measureText(textes[i]).width/2);
            let posY = Math.floor(can.ui.height*45/100+2*(i-1)*fontSize-fontSize);
            
            can.textPos[i] = {
                name: (can.state === 'load')? textes[i] : textes[i].substr(0, textes[i].length-7),
                x: posX, 
                y: posY, 
                w: can.uiContext.measureText(textes[i]).width, 
                h: fontSize
            };

            can.uiContext.fillText(textes[i], can.ui.width/2, can.ui.height*45/100+2*(i-1)*fontSize); 
        }
    };
    uiScreen() {
        let fontSize = (can.size < 700)? 20 : 40;
        
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
        
        can.uiContext.clearRect(0, 0, can.size, can.size);
        
        this.uiBasics();
        this.uiDrawText(textes, textes.length, fontSize);
    };
    uiNewGame() {
        this.uiBasics();
                
        let startForm = document.getElementsByTagName('form')[0];
        startForm.style.display = 'block';
    };
    uiInventaire(hero) {  
        can.uiContext.clearRect(0, 0, can.size, can.size);
        
        //Dessin du background
        for(let i = 0; i < nbTilesPerLine; i++) {
            for(let j = 0; j < nbTilesPerLine; j++) {
                can.uiContext.drawImage(images.tileset, 12*TILESIZE, 4*TILESIZE, TILESIZE, TILESIZE, i*tileSizeOnScreen, j*tileSizeOnScreen, tileSizeOnScreen, tileSizeOnScreen);
            }
        }
        
        //Dessin des slots d'équipement
        can.uiContext.fillStyle = '#65AED8';
        for(let i = hero.bodySlot.length-1; i >= 0; i--) {
            let x = (i%2 === 0)? 15 : 3;
            let y = Math.floor(1.5 * i) + 1;
            
            can.uiContext.strokeRect(x * tileSizeOnScreen, y * tileSizeOnScreen, 2*tileSizeOnScreen, 2*tileSizeOnScreen);
            can.uiContext.fillRect(x * tileSizeOnScreen, y * tileSizeOnScreen, 2*tileSizeOnScreen, 2*tileSizeOnScreen);  
            
            if(hero.bodySlot[i]) {
                hero.bodySlot[i].draw(can.uiContext, images.items, true);
            }
        }
        
        //Dessin des slots d'inventaire
        can.uiContext.fillStyle = '#E09A23';
        for(let i = hero.inventaire.length-1; i >= 0; i--) {
            let x = (i < 7)? 2 * i + 3 : 2 * (i-7) + 3;
            let y = (i < 7)? 14 : 16;
            
            can.uiContext.strokeRect(x * tileSizeOnScreen, y * tileSizeOnScreen, 2*tileSizeOnScreen, 2*tileSizeOnScreen);
            can.uiContext.fillRect(x * tileSizeOnScreen, y * tileSizeOnScreen, 2*tileSizeOnScreen, 2*tileSizeOnScreen);

            if(hero.inventaire[i]) {
                hero.inventaire[i].draw(can.uiContext, images.items, true);
            }
        }
        
        //Dessins de détails
        can.uiContext.drawImage(images.invThrow, 15*tileSizeOnScreen, 17*tileSizeOnScreen, 2*tileSizeOnScreen, 2*tileSizeOnScreen);
        can.uiContext.drawImage(images.invBody, 6*tileSizeOnScreen, tileSizeOnScreen, 7*tileSizeOnScreen, 13*tileSizeOnScreen);
    };
    gameScreen(carte, length) {
        can.itemsContext.clearRect(0,0,can.size, can.size);
        can.persoContext.clearRect(0,0,can.size, can.size);
        
        for(let y = length; y >= 0; y--) {
            for(let x = length; x >= 0; x--) {                
                if(carte[x][y].fog === 0) {
                    carte[x][y].sol.draw(can.mapContext, images.tileset);
                    (carte[x][y].item)? carte[x][y].item.draw(can.itemsContext, images.items) : null;
                    (carte[x][y].monstre)? carte[x][y].monstre.draw(can.persoContext, images.monsters) : null;
                    (carte[x][y].hero)? carte[x][y].hero.draw(can.persoContext, images.hero) : null;
                }
                else if(carte[x][y].fog === 1) {
                    carte[x][y].sol.draw(can.mapContext, images.tileset);
                    (carte[x][y].item)? carte[x][y].item.draw(can.itemsContext, images.items) : null;
                    can.persoContext.fillStyle = 'rgba(0,0,0,0.5)';
                    can.persoContext.fillRect(x*tileSizeOnScreen, y*tileSizeOnScreen, tileSizeOnScreen, tileSizeOnScreen);
                }
                else {
                    can.persoContext.fillStyle = 'rgba(0,0,0,1)';
                    can.persoContext.fillRect(x*tileSizeOnScreen, y*tileSizeOnScreen, tileSizeOnScreen, tileSizeOnScreen);    
                }

            }
        }
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

