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
tilesetImage.onload = placeItem(posHero, ground);

function Artefact(abs, ord) {
    var type = ['Zéro', 'Boomerang', 'Arc', 'Pistolet', 'Fléau', 'Epée', 'Livre', 'Lance', 'A', 'B'];
    
    //Position de l'item
    this.x = abs;
    this.y = ord;
    
    //Caractéristiques de l'item
    this.att = rand(-5,5,1);
    this.def = rand(-5,5,1);
    this.hp = rand(-5,5,1);
    this.mp = rand(-5,5,1);
    
    //Création du nom en fonction des caractéristiques
    this.quelType = rand(0,9,1);    
    this.name = type[this.quelType];
    
    var nbPlus5 = 0;
    var nbMoins5 = 0;

    (this.att === 5) ? nbPlus5++ : '';
    (this.def === 5) ? nbPlus5++ : '';
    (this.hp === 5) ? nbPlus5++ : '';
    (this.mp === 5) ? nbPlus5++ : '';

    (this.att === -5) ? nbMoins5++ : '';
    (this.def === -5) ? nbMoins5++ : '';
    (this.hp === -5) ? nbMoins5++ : '';
    (this.mp === -5) ? nbMoins5++ : '';

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
function placeItem(avoid, tabFree) {
    var cmp = 0;
    var nbItems = 0;
    var coord = [0,0];
    
    for(var i = tabFree.length-1; i >= 0; i--) {
        for(var j = tabFree[i].length-1; j >= 0; j--) {
            (tabFree[i][j] === 199) ? cmp++ : '';       //compte le nombre de cases disponible
        }
    }
    
    nbItems = rand(cmp/14, cmp/7, 1);                    //nombre d'items à générer
    
    for(var k = nbItems; k >= 0 ; k--) {    
        do {
            coord = placeIt();
        }while(coord === avoid[0] && coord[1] === avoid[1] || item[coord[1]][coord[0]]); //Ne place pas d'item sous la position de départ du héros ou s'il y a déjà un objet
        
        var tmp = new Artefact(coord[0], coord[1]);
        alert(tmp.name+'\n'+tmp.x+' '+tmp.y);
        item[coord[1]][coord[0]] = tmp;
    
        drawItem(coord, tmp);
    }
}

function drawItem(coord, art) { 
    var tileRow = (art.quelType / itemsNumTiles) | 0;  //Bitewise OR operation = Math.floor en plus rapide
    var tileCol = (art.quelType % itemsNumTiles) | 0;  //Permet de localiser le tile sur notre image par ex. on veut la 10 --> math.floor(10/16) = 0 et math.floor(10%16) = 10
    icxt.drawImage(itemsImage, (tileCol*TILESIZE), (tileRow*TILESIZE), TILESIZE, TILESIZE, (coord[0]*TILESIZE), (coord[1]*TILESIZE), TILESIZE, TILESIZE);
}

//Evènement quand le héros arrive sur la case
function getItem(coord) {
    var tmp = item[coord[1]][coord[0]];
    if(tmp) {
        if(confirm('Vous avez trouvé un(e) ' +  tmp.name + '!\nLe prendre ?')) {
            icxt.clearRect(coord[0]*TILESIZE, coord[1]*TILESIZE, TILESIZE, TILESIZE);
            item[coord[1]][coord[0]] = 0;
        }
    }
}