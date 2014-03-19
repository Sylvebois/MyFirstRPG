/*
 * Placement aléatoire des items
 */

//On cree un tableau vide pour commencer
var item = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]; 

var itemsNumTiles = 5;     // Nombre de tuiles sur une ligne de notre image
var itemsImage = new Image();
itemsImage.src = 'images/items.png';
tilesetImage.onload = placeItem(hero.x, hero.y, ground);

function Artefact(abs, ord) {
    var type = ['Zéro', 'Boomerang', 'Arc', 'Pistolet', 'Fléau', 'Epée', 'Livre', 'Lance', 'Descendre', 'Monter'];
    
    //Position de l'item
    this.x = abs;
    this.y = ord;
    
    //Caractéristiques de l'item
    this.st = rand(-5,5,1);
    this.dx = rand(-5,5,1);
    this.iq = rand(-5,5,1);
    this.ht = rand(-5,5,1);
    
    //Création du nom en fonction des caractéristiques
    this.quelType = rand(0,7,1);    
    this.name = type[this.quelType];
    
    var nbPlus5 = 0;
    var nbMoins5 = 0;

    (this.st === 5) ? nbPlus5++ : '';
    (this.dx === 5) ? nbPlus5++ : '';
    (this.iq === 5) ? nbPlus5++ : '';
    (this.ht === 5) ? nbPlus5++ : '';

    (this.st === -5) ? nbMoins5++ : '';
    (this.dx === -5) ? nbMoins5++ : '';
    (this.iq === -5) ? nbMoins5++ : '';
    (this.ht === -5) ? nbMoins5++ : '';

    switch(nbPlus5) {
        case 1:
            this.name = 'bon';
            if(this.quelType === 5 || this.quelType === 7) {
                this.name += 'ne ' + type[this.quelType];
            } else {
                this.name += ' ' + type[this.quelType];
            }
            break;
        case 2:
            this.name += ' épique';
            break;
        case 3:
            this.name += ' légendaire';
            break;
        case 4:
            this.name += ' mythique';
            break;
        default:
            break;
    }

    if(nbPlus5 === 0) {
        switch(nbMoins5) {
            case 1:
                this.name += ' abîmé';
                (this.quelType === 5 || this.quelType === 7) ? this.name+= 'e' :'';
                break;
            case 2:
                this.name += ' cassé';
                (this.quelType === 5 || this.quelType === 7) ? this.name+= 'e' :'';
                break;
            case 3:
                this.name += ' pourri';
                (this.quelType === 5 || this.quelType === 7) ? this.name+= 'e' :'';
                break;
            case 4:
                this.name += ' inutile';
                break;
            default:
                break;
        }
    }

}

//Place un certain nombre d'items en fonction de la taille du donjon et de la position de départ du héros
function placeItem(x, y, tabFree) {
    var cmp = 0;
    var nbItems = 0;
    var coord = [0,0];
    
    for(var i = tabFree.length-1; i >= 0; i--) {
        for(var j = tabFree[i].length-1; j >= 0; j--) {
            (tabFree[i][j] === 199) ? cmp++ : '';       //compte le nombre de cases disponible
        }
    }
    
    nbItems = rand(cmp/14, cmp/7, 1);                    //nombre d'items à générer
        
    //Place l'escalier vers le haut (sous le héros) et vers le bas
    var stairUp = new Artefact(x, y);
    stairUp.st = 0;
    stairUp.dx = 0;
    stairUp.iq = 0;
    stairUp.ht = 0;
    stairUp.quelType = 9;
    item[y][x] = stairUp;
    
    drawIt(icxt, itemsImage, stairUp, stairUp.quelType, itemsNumTiles);
    
    do {
        coord = placeIt();
    }while(coord[0] === x && coord[1] === y || item[coord[1]][coord[0]]);
    
    var stairDown = new Artefact(coord[0], coord[1]);
    stairDown.st = 0;
    stairDown.dx = 0;
    stairDown.iq = 0;
    stairDown.ht = 0;
    stairDown.quelType = 8;
    item[coord[1]][coord[0]] = stairDown;
    drawIt(icxt, itemsImage, stairDown, stairDown.quelType, itemsNumTiles);
    
    for(var k = nbItems; k >= 0 ; k--) {    
        do {
            coord = placeIt();
        }while(coord[0] === x && coord[1] === y || item[coord[1]][coord[0]]); //Ne place pas d'item sous la position de départ du héros ou s'il y a déjà un objet
        
        var tmp = new Artefact(coord[0], coord[1]);
        item[coord[1]][coord[0]] = tmp;
    
        drawIt(icxt, itemsImage, tmp, tmp.quelType, itemsNumTiles);;
    }
}

//Evènement quand le héros arrive sur la case
function getItem(x, y) {
    var tmp = item[y][x];
    var texte = 'Vous avez trouvé un(e) ' +  tmp.name + '!\n' +
                'Force : ' + tmp.st + '\n' +
                'Dextérité : ' + tmp.dx + '\n' +
                'Intelligence : ' + tmp.iq + '\n' +
                'Santé : ' + tmp.ht + '\n\n' +
                'Le prendre ?';
        
    if(tmp && tmp.quelType !== 8 && tmp.quelType !== 9) {
        if(confirm(texte)) {
            icxt.clearRect(x*TILESIZE, y*TILESIZE, TILESIZE, TILESIZE);
            item[y][x] = 0;
        }
    }
    else if(tmp.quelType === 8) {
        if(confirm('Voulez-vous descendre au niveau suivant ?')) {
            window.location.reload();
        }
    }
    else if(tmp.quelType === 9) {
        if(confirm('Voulez-vous monter au niveau précédent ?')) {
            window.location.reload();    
        }
    }
}