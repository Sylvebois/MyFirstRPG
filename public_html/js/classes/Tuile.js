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

/*
 * @function Tuile.getPos
 * Renvoie les coordonées de la tuile sur le canvas
 * @returns {array}
 */
Tuile.prototype.getPos = function() {
    return [this._posX, this._posX];
};

/*
 * @function Tuile.setPos
 * Définit les coordonées de la tuile sur le canvas
 * @param {int} x abscisse
 * @param {int} y ordonnée
 * @returns {undefined}
 */
Tuile.prototype.setPos = function(x,y) {
    this._posX = x;
    this._posY = y;
};

/*
 * @function Tuile.setAccess
 * Modifie l'accessibilité de la tuile
 * @param {bool} access
 * @returns {undefined}
 */
Tuile.prototype.setAccess = function(access) {
    this._accessible = access;
};

/*
 * @function Tuile.getAccess
 * Renvoie si la tuile est accessible ou non
 * @returns {bool}
 */
Tuile.prototype.getAccess = function() {
   return this._accessible;
};

/*
 * @function Tuile.draw
 * Dessine l'image issue du tileset sur le canvas
 * @param {Object} canvas contexte du canvas dans lequel on va dessiner
 * @param {Object} image le tileset d'où on tire l'image
 * @param {int} imgX position en abscisse de l'image
 * @param {int} imgY position en ordonnée de l'image
 * @returns {undefined}
 */
Tuile.prototype.draw = function(canvas, image, imgX, imgY) {
    canvas.drawImage(image, imgX*TILESIZE, imgY*TILESIZE, TILESIZE, TILESIZE, this._posX*tileSizeOnScreen, this._posY*tileSizeOnScreen, tileSizeOnScreen, tileSizeOnScreen);    
};


