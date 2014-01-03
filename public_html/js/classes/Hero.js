var DIRECTION = {
	'BAS'    : 5,
	'GAUCHE' : 3,
	'DROITE' : 0,
	'HAUT'   : 2
};

function Hero(url, x, y) {
    //Définition de la feuille de personnage
    this.userName = 'Default';
    this.classPerso = 'Custom';
    this.level = 1;
    this.att = 0;
    this.def = 0;
    this.hp = 0;
    this.mp = 0;
    
    //Chargement et configuration des sprites
    this.image = new Image();
    this.image.refPerso = this;  
    this.image.onload = function() {
        if(!this.complete) {
            throw 'Erreur de chargement du sprite ' + url;
        }
    };
    this.image.src = 'images/' + url;
    
    this.numTiles = 3;          // Nombre de tuiles sur une ligne de notre image
    this.tileWidth = 32;
    this.tileHeight = 32;
    
    //Emplacement du personnage
    this.x = x;
    this.y = y;
}

Hero.prototype.drawHero = function (context, direction) {
    var tileRow = (direction / this.numTiles) | 0;  //Bitewise OR operation = Math.floor en plus rapide
    var tileCol = (direction % this.numTiles) | 0;  // Permet de localiser la tuile sur notre image par ex. on veut la n°10 --> math.floor(10/16) = 0 et math.floor(10%16) = 10
    context.drawImage(
            this.image,
            (tileCol*this.tileWidth), (tileRow*this.tileHeight), this.tileWidth, this.tileHeight,
            (this.x*this.tileWidth), (this.y*this.tileHeight), this.tileWidth, this.tileHeight
    );
};