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
        
        item[coord[1]][coord[0]] = 1;
    
        drawItem(coord);
    }
}

function drawItem(coord) { 
    var tileRow = (rand(0,1,1) / itemsNumTiles) | 0;  //Bitewise OR operation = Math.floor en plus rapide
    var tileCol = (rand(0,itemsNumTiles,1) % itemsNumTiles) | 0;  //Permet de localiser le tile sur notre image par ex. on veut la 10 --> math.floor(10/16) = 0 et math.floor(10%16) = 10
    icxt.drawImage(itemsImage, (tileCol*TILESIZE), (tileRow*TILESIZE), TILESIZE, TILESIZE, (coord[0]*TILESIZE), (coord[1]*TILESIZE), TILESIZE, TILESIZE);
}

function getItem(coord) {
    if(item[coord[1]][coord[0]] === 1) {
        if(confirm('Vous avez trouvé un objet !\nLe prendre ?')) {
            icxt.clearRect(coord[0]*TILESIZE, coord[1]*TILESIZE, TILESIZE, TILESIZE);
            item[coord[1]][coord[0]] = 0;
        }
    }
}