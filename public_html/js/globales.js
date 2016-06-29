/* 
 * Contient toutes les variables globales
 */

//Taille des tuiles (sur les tilesets et à l'écran
var TILESIZE = 32;
var percentOfScreen = 5/100;
var tileSizeOnScreen = 0;
var sizeOfCanvas = 0;

//Tilesets et images
var plume = new Image();
var pioche = new Image();
var mainImg = new Image();
var groundImg = new Image();
var herosImg = new Image();
var itemsImg = new Image();
var monstersImg = new Image();
var invImg = new Image();

plume.src = 'img/plume.png';
pioche.src = 'img/pioche.png';
mainImg.src = 'img/scroll.png';
groundImg.src = 'img/tileset.png';
herosImg.src = 'img/hero.png';
itemsImg.src = 'img/items.png';
monstersImg.src = 'img/monsters.png';
invImg.src = 'img/inv.png';

//canvas
var canvasMap = document.getElementById('map');
var mapContext = canvasMap.getContext('2d');

var canvasUi = document.getElementById('ui');
var uiContext = canvasUi.getContext('2d');

//Le contenu de la carte
/*
    map[y][x] = {
        'sol': 0;
        'fog': 0;
        'item': 0;
        'monstre': 0;
        'hero': 0;
    }
*/
var mapTab = [];