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
        let fontSize = Math.floor(60*can.ratio);

        can.uiContext.drawImage(images.scroll, 0, 0, can.ui.width, can.ui.height);
        
        this.uiFontStyle(fontSize,'enchantedLandRegular');
        can.uiContext.fillText('Scroll of Stupidity', can.ui.width/2, can.ui.height*15/100);       
    };
    uiDrawText(textes, fontSize) {
        this.uiFontStyle(fontSize);
        
        textes.map((text, index) => {
            let posX = Math.floor(can.ui.width/2 - can.uiContext.measureText(text).width/2);
            let posY = Math.floor(can.ui.height*45/100+2*(index-1)*fontSize-fontSize);
            
            can.textPos[index] = {
                name: (can.state === 'load')? text : text.substr(0, text.length-7),
                x: posX, 
                y: posY, 
                w: can.uiContext.measureText(text).width, 
                h: fontSize
            };
            
            can.uiContext.fillText(text, can.ui.width/2, can.ui.height*45/100+2*(index-1)*fontSize, can.size); 
        });
    };
    uiScreen() {
        let fontSize = Math.floor(30*can.ratio);
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
        this.uiDrawText(textes, fontSize);
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
    uiStory(part) {
        let fontSize = Math.floor(20*can.ratio);
        
        let textes = story[`${part}`].split('\n');
        let finalText = [];

        textes.map(elem => {
            let textWidth = Math.ceil(can.uiContext.measureText(elem).width);
            let maxChar = Math.floor(elem.length * can.size / textWidth);
            let nbCut = Math.ceil(textWidth / can.size);

            if(nbCut > 1){
                let startIndex = 0;
                let endIndex = maxChar;
           
                for(let j = 0; j < nbCut; j++) {
                    while(elem[endIndex] && elem[endIndex-1] !== ' ') {
                        endIndex++;
                    }
                    
                    let end = (j+1 === nbCut)? elem.length : endIndex;                
                    finalText.push(elem.slice(startIndex, end)); 
                    
                    startIndex = endIndex;
                    endIndex += maxChar;
                }
            }
            else {
                finalText.push(elem);
            }    
        });
        
        can.uiContext.clearRect(0, 0, can.size, can.size);
        
        this.uiBasics();
        this.uiFontStyle(fontSize, 'Arial', 'black', 'left');
        
        finalText.map((elem, index) => {            
            can.uiContext.fillText(elem, can.size*15/100, can.size*25/100+(index-1)*fontSize, can.size); 
        });
        
    };
    gameScreen(carte, length) {
        can.itemsContext.clearRect(0,0,can.size, can.size);
        can.persoContext.clearRect(0,0,can.size, can.size);
        
        let hp = [];
        
        for(let y = length; y >= 0; y--) {
            for(let x = length; x >= 0; x--) {                
                if(carte[x][y].fog === 0) {
                    carte[x][y].sol.draw(can.mapContext, images.tileset);
                    (carte[x][y].item)? carte[x][y].item.draw(can.itemsContext, images.items) : null;
                    (carte[x][y].monstre)? carte[x][y].monstre.draw(can.persoContext, images.monsters) : null;
                    
                    if(carte[x][y].hero){
                        carte[x][y].hero.draw(can.persoContext, images.hero);
                        hp = [carte[x][y].hero.hpLeft, carte[x][y].hero.end];
                    }
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
        
        this.gameHud(hp[0], hp[1]);
    };
    gameHud(hpLeft, baseHp){
        let text = hpLeft + '/' + baseHp;
        
        can.hudContext.fillStyle = 'white';
        can.hudContext.textAlign = 'left';  
        can.hudContext.font = tileSizeOnScreen + 'px Arial';
        
        can.hudContext.fillText(text, 0, tileSizeOnScreen-2);
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
            case 'Story':
                can.state = 'story';
                this.uiStory('intro');
                break;
            default: 
                can.state = 'jeu';
                this.hideUi();
                this.showGame();
                break;
        }
    }
}

