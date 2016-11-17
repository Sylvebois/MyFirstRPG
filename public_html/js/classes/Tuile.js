/* 
 * Tuile de base contenant la position sur le canvas et les fonctions de dessin
 */
class Tuiles {
    constructor(x, y) {
        // Par défaut, on peut se déplacer sur la case (pas de monstre, de mur, ...)
        this._accessible = true;
        
        // Position de la tuile sur le canvas
        this._posX = parseInt(x);
        this._posY = parseInt(y);     
    };
    getPos() {
        return [this._posX, this._posX];    
    };
    setPos(x,y) {
        this._posX = parseInt(x);
        this._posY = parseInt(y);
    };
    setAccess(access) {
        this._accessible = access;    
    };
    getAccess() {
        return this._accessible;
    };
    draw(canvas, image, imgX, imgY) {
        canvas.drawImage(image, imgX*TILESIZE, imgY*TILESIZE, TILESIZE, TILESIZE, this._posX*tileSizeOnScreen, this._posY*tileSizeOnScreen, tileSizeOnScreen, tileSizeOnScreen);    
    }
};

/* 
 * Définition du type de sol ou de mur
 * Hérite de Tuile
 */
class MapTile extends Tuiles {
    constructor(x, y) {
        super(x, y); 
        this._groundType = 'ground'; 
        
        // Position par défaut de l'image sur le tileset
        this._imgX = 1;
        this._imgY = 9;
    };
    getImgPos() {
        return [this._imgX, this._imgY];
    };
    setType(type = 'ground') {
        this._groundType = type.toString();

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
    }
};