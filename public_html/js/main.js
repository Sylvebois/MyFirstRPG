/*
 * La plupart des valeurs sont exprimées sur base de la taille des tuiles et pas en px
 */

var TILESIZE = 32;            //Dimensions d'une tuile
var ROWTILECOUNT = 20;        // Nombre de tuiles qu'on met sur la hauteur
var COLTILECOUNT = 32;        // Nombre de tuiles qu'on met sur la largeur

var DIFFICULTY = setDifficulty();
alert('Ce niveau est ' + DIFFICULTY);

var tCanvas = document.getElementById('terrain');
var iCanvas = document.getElementById('artefact');
var eCanvas = document.getElementById('enemies');
var jCanvas = document.getElementById('joueur');
var fCanvas = document.getElementById('fog');
var uCanvas = document.getElementById('ui');

var tcxt = tCanvas.getContext('2d');
var icxt = iCanvas.getContext('2d');
var ecxt = eCanvas.getContext('2d');
var jcxt = jCanvas.getContext('2d');
var fcxt = fCanvas.getContext('2d');
var ucxt = uCanvas.getContext('2d');

//Assure une comptabilité avec IE pour la gestion des évènements
function addEvent(element, event, func) { // Compatibilité IE
        if (element.attachEvent) {
            element.attachEvent('on' + event, func);
        } else {
            element.addEventListener(event, func, true);
        }
    }
    
//Génère un nombre aléatoire entre min-max et précise si ça doit être un entier
function rand(min, max, integer) {
   if (!integer) {
       return Math.random() * (max - min) + min;
   } else {
       return Math.floor(Math.random() * (max - min + 1) + min);
   }
}

//place le heros, les ennemis et les items en fonction de la map
function placeIt() {
    var start = [0,0];
    
    do {
        start[0] = rand(0, COLTILECOUNT-1, 1);
        start[1] = rand(0, ROWTILECOUNT-1, 1);   
    } 
    while(ground[start[1]][start[0]] === 130);
    
    return start;
}

//Dessine les objets
function drawIt(cxt, img, obj, numImg, numTiles) {
    var tileRow = (numImg / numTiles) | 0;  //Bitewise OR operation = Math.floor en plus rapide
    var tileCol = (numImg % numTiles) | 0;  //Permet de localiser le tile sur notre image par ex. on veut la 10 --> math.floor(10/16) = 0 et math.floor(10%16) = 10
    cxt.drawImage(img, (tileCol*TILESIZE), (tileRow*TILESIZE), TILESIZE, TILESIZE, (obj.x*TILESIZE), (obj.y*TILESIZE), TILESIZE, TILESIZE);    
}

//Donne le niveau de difficulté (génération de monstres et d'items) d'étage
function setDifficulty() {
    var difficulty = ['easy', 'normal', 'hard', 'extreme'];
    var lvlDiff = rand(0,3,1);

    lvlDiff = (lvlDiff === 3)? rand(0,3,1) : lvlDiff;   //Fait un deuxième tour pour diminuer les chances d'un lvl extrême
    
    return difficulty[lvlDiff];
}