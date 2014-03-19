/*
 * Gestion du Héros (fiche de perso, mouvement et événements
 */

var posHero = placeIt();
var hero = new Hero(posHero[0], posHero[1]);

var heroesNumTiles = 3;     // Nombre de tuiles sur une ligne de notre image
var heroesImage = new Image();
heroesImage.src = 'images/hero.png';
heroesImage.onload = drawIt(jcxt, heroesImage, hero, hero.direction['BAS'], heroesNumTiles);

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
    
    //Inventaire = 10 places
    this.inv = [0,0,0,0,0,0,0,0,0,0];
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
            drawIt(jcxt, heroesImage, hero, hero.direction['GAUCHE'], heroesNumTiles);
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
            drawIt(jcxt, heroesImage, hero, hero.direction['HAUT'], heroesNumTiles);
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
            drawIt(jcxt, heroesImage, hero, hero.direction['DROITE'], heroesNumTiles);
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
            drawIt(jcxt, heroesImage, hero, hero.direction['BAS'], heroesNumTiles);
            delFog(hero.x, hero.y, hero.vis);
            getItem(hero.x, hero.y);
            break;
        default:
            drawIt(jcxt, heroesImage, hero, hero.direction['BAS'], heroesNumTiles);
            break;
            
    }
});
