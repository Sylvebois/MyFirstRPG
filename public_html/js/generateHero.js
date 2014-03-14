/*
 * Gestion du Héros (fiche de perso, mouvement et événements
 */

var posHero = placeIt();
var hero = new Hero(posHero[0], posHero[1]);

var heroesNumTiles = 3;     // Nombre de tuiles sur une ligne de notre image
var heroesImage = new Image();
heroesImage.src = 'images/hero.png';
heroesImage.onload = drawHero(hero.x, hero.y, hero.direction['BAS']);

function Hero(x, y) {
    this.direction = {
	'BAS'    : 5,
	'GAUCHE' : 3,
	'DROITE' : 0,
	'HAUT'   : 2
    };
    
    //Définition de la feuille de personnage
    this.name = 'Default';
    this.classPerso = 'Custom';
    this.level = 1;
    this.st = 15;
    this.dx = 15;
    this.iq = 10;
    this.ht = 10;
    
    //Emplacement du personnage
    this.x = x;
    this.y = y;
    
    //Champ de vision
    this.vis = 2;
}

window.addEventListener('keydown', function(e) {    
    jcxt.clearRect(0, 0, jCanvas.width, jCanvas.height);
    
    //Gestion des déplacements du hero (mouvements, brouillard, rencontres ...)
    switch(e.keyCode) {
        case 37:            //left
            if(hero.x > 0 && ground[hero.y][hero.x-1] !== 130 && enemies[hero.y][hero.x-1] === 0) {
                hero.x -= 1;
            }
            else if(hero.x > 0 && enemies[hero.y][hero.x-1] !== 0) {
                fight(hero.x-1, hero.y, hero);
            }
            drawHero(hero.x, hero.y, hero.direction['GAUCHE']);
            delFog(hero.x, hero.y, hero.vis);
            getItem(hero.x, hero.y);
            break;
        case 38:            //up
            if(hero.y > 0 && ground[hero.y-1][hero.x] !== 130 && enemies[hero.y-1][hero.x] === 0) {
                hero.y -= 1;
            }
            else if(hero.y > 0 && enemies[hero.y-1][hero.x] !== 0) {
                fight(hero.x, hero.y-1, hero);
            }
            drawHero(hero.x, hero.y, hero.direction['HAUT']);
            delFog(hero.x, hero.y, hero.vis);
            getItem(hero.x, hero.y);
            break;
        case 39:            //right
            if(hero.x < COLTILECOUNT-1 && ground[hero.y][hero.x+1] !== 130 && enemies[hero.y][hero.x+1] === 0) {
                hero.x += 1;
            }
            else if(hero.x < COLTILECOUNT-1 && enemies[hero.y][hero.x+1] !== 0) {
                fight(hero.x+1, hero.y, hero);
            }
            drawHero(hero.x, hero.y, hero.direction['DROITE']);
            delFog(hero.x, hero.y, hero.vis);
            getItem(hero.x, hero.y);
            break;
        case 40:            //down
            if(hero.y < ROWTILECOUNT-1 && ground[hero.y+1][hero.x] !== 130 && enemies[hero.y+1][hero.x] === 0) {
                hero.y += 1;
            }
            else if(hero.y < ROWTILECOUNT-1 && enemies[hero.y+1][hero.x] !== 0) {
                fight(hero.x, hero.y+1, hero);
            }
            drawHero(hero.x, hero.y, hero.direction['BAS']);
            delFog(hero.x, hero.y, hero.vis);
            getItem(hero.x, hero.y);
            break;
        default:
            drawHero(hero.x, hero.y, hero.direction['BAS']);
            break;
            
    }
});

function drawHero(x, y, imgHero) {
    var tileRow = (imgHero / heroesNumTiles) | 0;  //Bitewise OR operation = Math.floor en plus rapide
    var tileCol = (imgHero % heroesNumTiles) | 0;  //Permet de localiser le tile sur notre image par ex. on veut la 10 --> math.floor(10/16) = 0 et math.floor(10%16) = 10
    jcxt.drawImage(heroesImage, (tileCol*TILESIZE), (tileRow*TILESIZE), TILESIZE, TILESIZE, (x*TILESIZE), (y*TILESIZE), TILESIZE, TILESIZE);
}
