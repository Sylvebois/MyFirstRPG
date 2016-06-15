/* 
 * Tuile de base contenant la position sur le canvas et les fonctions de dessin
 */

function Tuile(x, y) {
    // Par défaut, on peut se déplacer sur la case (pas de monstre, de mur, ...)
    this._accessible = true;
        
    // Position de la tuile sur le canvas
    if(typeof(x) !== 'undefined' && typeof(y) !== 'undefined') {
        this._posX = parseInt(x);
        this._posY = parseInt(y);    
    }
    else {
        this._posX = 0;
        this._posY = 0;  
        console.log('Erreur lors de l\'instanciation de l\'objet Tuile ! x : ' + x + ' - y : ' + y);
    }
}

Tuile.prototype.getPos = function() {
    return [this._posX, this._posX];
};

Tuile.prototype.setPos = function(x,y) {
    this._posX = x;
    this._posY = y;
};

Tuile.prototype.setAccess = function(access) {
    this._accessible = access;
};

Tuile.prototype.getAccess = function() {
   return this._accessible;
};

Tuile.prototype.draw = function(canvas, image, imgX, imgY) {
    canvas.drawImage(image, imgX*TILESIZE, imgY*TILESIZE, TILESIZE, TILESIZE, this._posX*tileSizeOnScreen, this._posY*tileSizeOnScreen, tileSizeOnScreen, tileSizeOnScreen);    
};


