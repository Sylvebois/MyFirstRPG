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
    this.name = 'Mon Héros';
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
    
    //Emplacement d'équipement
    this.equip = {
        'TETE'  : 0,
        'COU'   : 0,
        'TORSE' : 0,
        'JAMBES': 0,
        'PIEDS' : 0,
        'MAING' : 0,
        'MAIND' : 0,
    }
    
    //Caractéristiques avec les équipements
    this.endSt = this.st;
    this.endDx = this.dx;
    this.endIq = this.iq;
    this.endHt = this.ht;
    
    this.calcStat = function(place, equipped) {
        if(equipped) {
            this.endSt += this.equip[place].st;
            this.endDx += this.equip[place].dx;
            this.endIq += this.equip[place].iq;
            this.endHt += this.equip[place].ht;    
        }
        else {
            this.endSt -= this.equip[place].st;
            this.endDx -= this.equip[place].dx;
            this.endIq -= this.equip[place].iq;
            this.endHt -= this.equip[place].ht;     
        }
    };
}

addEvent(window, 'keydown', function(e) {    
    jcxt.clearRect(0, 0, jCanvas.width, jCanvas.height);
    
    //Gestion des déplacements du hero (mouvements, brouillard, rencontres ...)
    switch(e.keyCode) {
        case 13:            //Enter key
            if(!createForm.className) {
                submitHero();
            }
            drawIt(jcxt, heroesImage, hero, hero.direction['BAS'], heroesNumTiles);
            break;
        case 37:            //left
            if(hero.x > 0 && ground[hero.y][hero.x-1] !== 130 && enemies[hero.y][hero.x-1] === 0 && uCanvas.className === 'hidden' && createForm.className === 'hidden') {
                hero.x -= 1;
            }
            else if(hero.x > 0 && enemies[hero.y][hero.x-1] !== 0 && uCanvas.className === 'hidden' && createForm.className === 'hidden') {
                fight(hero.x-1, hero.y, hero);
            }
            drawIt(jcxt, heroesImage, hero, hero.direction['GAUCHE'], heroesNumTiles);
            delFog(hero.x, hero.y, hero.vis);
            getItem(hero);
            break;
        case 38:            //up
            if(hero.y > 0 && ground[hero.y-1][hero.x] !== 130 && enemies[hero.y-1][hero.x] === 0 && uCanvas.className === 'hidden' && createForm.className === 'hidden') {
                hero.y -= 1;
            }
            else if(hero.y > 0 && enemies[hero.y-1][hero.x] !== 0 && uCanvas.className === 'hidden' && createForm.className === 'hidden') {
                fight(hero.x, hero.y-1, hero);
            }
            drawIt(jcxt, heroesImage, hero, hero.direction['HAUT'], heroesNumTiles);
            delFog(hero.x, hero.y, hero.vis);
            getItem(hero);
            break;
        case 39:            //right
            if(hero.x < COLTILECOUNT-1 && ground[hero.y][hero.x+1] !== 130 && enemies[hero.y][hero.x+1] === 0 && uCanvas.className === 'hidden' && createForm.className === 'hidden') {
                hero.x += 1;
            }
            else if(hero.x < COLTILECOUNT-1 && enemies[hero.y][hero.x+1] !== 0 && uCanvas.className === 'hidden' && createForm.className === 'hidden') {
                fight(hero.x+1, hero.y, hero);
            }
            drawIt(jcxt, heroesImage, hero, hero.direction['DROITE'], heroesNumTiles);
            delFog(hero.x, hero.y, hero.vis);
            getItem(hero);
            break;
        case 40:            //down
            if(hero.y < ROWTILECOUNT-1 && ground[hero.y+1][hero.x] !== 130 && enemies[hero.y+1][hero.x] === 0 && uCanvas.className === 'hidden' && createForm.className === 'hidden') {
                hero.y += 1;
            }
            else if(hero.y < ROWTILECOUNT-1 && enemies[hero.y+1][hero.x] !== 0 && uCanvas.className === 'hidden' && createForm.className === 'hidden') {
                fight(hero.x, hero.y+1, hero);
            }
            drawIt(jcxt, heroesImage, hero, hero.direction['BAS'], heroesNumTiles);
            delFog(hero.x, hero.y, hero.vis);
            getItem(hero);
            break;
        case 73:            //Inventory
            if(uCanvas.className === 'hidden' && createForm.className === 'hidden') {
                showInv(hero, itemsImage, itemsNumTiles);
                equipIt (hero, itemsImage, itemsNumTiles);
            }
            else {
                hideInv();
            }
            drawIt(jcxt, heroesImage, hero, hero.direction['BAS'], heroesNumTiles);
            break;
        default:
            drawIt(jcxt, heroesImage, hero, hero.direction['BAS'], heroesNumTiles);
            break;     
    }
});
