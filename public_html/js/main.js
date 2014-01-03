/*
 * La plupart des valeurs sont exprimées sur base de la taille des tuiles et pas en px
 */

var TILESIZE = 32;            //Dimensions d'une tile
var ROWTILECOUNT = 20;        // Nombre de tile qu'on met sur la hauteur
var COLTILECOUNT = 32;        // Nombre de tile qu'on met sur la largeur

var tCanvas = document.getElementById('terrain');
var jCanvas = document.getElementById('joueur');
var fCanvas = document.getElementById('fog');

var tcxt = tCanvas.getContext('2d');
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