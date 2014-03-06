/*
 * La plupart des valeurs sont exprimées sur base de la taille des tuiles et pas en px
 */

var TILESIZE = 32;            //Dimensions d'une tuile
var ROWTILECOUNT = 20;        // Nombre de tuiles qu'on met sur la hauteur
var COLTILECOUNT = 32;        // Nombre de tuiles qu'on met sur la largeur

var tCanvas = document.getElementById('terrain');
var iCanvas = document.getElementById('artefact');
var eCanvas = document.getElementById('enemies');
var jCanvas = document.getElementById('joueur');
var fCanvas = document.getElementById('fog');

var tcxt = tCanvas.getContext('2d');
var icxt = iCanvas.getContext('2d');
var ecxt = eCanvas.getContext('2d');
var jcxt = jCanvas.getContext('2d');
var fcxt = fCanvas.getContext('2d');

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