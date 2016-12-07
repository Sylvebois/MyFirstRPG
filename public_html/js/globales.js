/* 
 * Contient toutes les variables globales
 */

//Taille des tuiles (sur les tilesets et à l'écran)
const TILESIZE = 32;
var percentOfScreen = 5/100;
var tileSizeOnScreen = 0;
var sizeOfCanvas = 0;

//Tilesets et images
var images = {
    init() {
        this.plume = new Image();
        this.pioche = new Image();
        this.main = new Image();
        this.ground = new Image();
        this.hero = new Image();
        this.items = new Image();
        this.monstres = new Image();
        this.inv = new Image(); 
        
        this.plume.src = 'img/plume.png';
        this.pioche.src = 'img/pioche.png';
        this.main.src = 'img/scroll.png';
        this.ground.src = 'img/tileset.png';
        this.hero.src = 'img/hero.png';
        this.items.src = 'img/items.png';
        this.monstres.src = 'img/monsters.png';
        this.inv.src = 'img/inv.png';
    },
    checkLoaded() {
        if( this.plume.complete && this.pioche.complete &&
            this.main.complete && this.ground.complete &&
            this.hero.complete && this.items.complete &&
            this.monstres.complete && this.inv.complete) {
            
            console.log('Chargement des images terminé !');
            return true;
        }
        else {
            console.log('Chargement des images incomplet');
            return false;
        }
    }
};
images.init();

//canvas
var can = {
    init() {
        this.map = document.getElementById('map');
        this.mapContext = this.map.getContext('2d');
        
        this.ui = document.getElementById('ui');
        this.uiContext = this.ui.getContext('2d');
    }
};
can.init();

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