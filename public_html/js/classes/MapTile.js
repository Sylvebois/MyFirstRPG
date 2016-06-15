/* 
 * Définition du type de sol ou de mur
 * Hérite de Tuile
 */
function MapTile(x, y) {
    Tuile.call(this, x, y);
    
    this._groundType = 'ground';
    
    // Position par défaut de l'image sur le tileset
    this._imgX = 1;
    this._imgY = 9;

}

MapTile.prototype = Object.create(Tuile.prototype);

MapTile.prototype.getImgPos = function() {
    return [this._imgX, this._imgY];
};

MapTile.prototype.setType = function(type) {
    if(typeof(type) !=='undefined') {
        this._groundType = type.toString();
    }
    
    switch(this._groundType) {
        case 'wall' :
            this._imgX = 12;
            this._imgY = 4;
            this.setAccess(false);
            break;
        case 'ground' :
        default:
            this._imgX = 1;
            this._imgY = 9;
            this.setAccess(true);
            break;
    }
};

MapTile.prototype.draw = function(canvas, image) {
    Tuile.prototype.draw.call(this,canvas, image, this._imgX, this._imgY);
}
