/* 
 * Tuile de base contenant la position sur le canvas et les fonctions de dessin
 */
class Tuile {
    constructor(x, y) {        
        // Position de la tuile sur le canvas
        this._posX = parseInt(x);
        this._posY = parseInt(y); 
        
        // Position par défaut de l'image sur le tileset
        this._imgX = 0;
        this._imgY = 0;
    };
    get pos(){
        return [this._posX,this._posY];
    };
    set pos(newCoord){
        this._posX = parseInt(newCoord[0]);
        this._posY = parseInt(newCoord[1]); 
    };
    get imgPos(){
        return [this._imgX,this._imgY];
    };
    set imgPos(newCoord){
        this._imgX = parseInt(newCoord[0]);
        this._imgY = parseInt(newCoord[1]); 
    };
    draw(context, image) {
        context.drawImage(image, this._imgX*TILESIZE, this._imgY*TILESIZE, TILESIZE, TILESIZE, this._posX*tileSizeOnScreen, this._posY*tileSizeOnScreen, tileSizeOnScreen, tileSizeOnScreen);    
    }
};

/* 
 * Définition du type de sol ou de mur
 * Hérite de Tuile
 */
class MapTile extends Tuile {
    constructor(x, y, type = 'ground') {
        super(x, y); 
        this.setType(type);
    };
    setType(type = 'ground') {
        this._groundType = type.toString();
        
        // Donne la position sur l'image et si on peut se déplacer sur la tuile
        switch(this._groundType) {
            case 'wall' :
                this.imgPos = [12,4];
                this._accessible = false;
                break;
            case 'ground' :
            default:
                this.imgPos = [1,9];
                this._accessible = true;
                break;
        }
    };
};

/* 
 * Classe définissant les caractéristiques de base d'un objet / personnage 
 * Hérite de Tuile
 */
class Base extends Tuile {
    constructor(x = 0, y = 0, name = 'No Name', st = 15, dx = 15, iq = 10, ht = 10) {
        super(x,y);
        this._name = name;
        this._st = st;
        this._dx = dx;
        this._iq = iq;
        this._ht = ht;
    };
    modSpecs(type, value = 0) {
        switch(type) {
            case 'name':
                this._name = value;
                break;
            case 'st':
                this._st = value;
                break;
            case 'dx':
                this._dx = value;
                break;
            case 'iq':
                this._iq = value;
                break;
            case 'ht':
                this._ht = value;
                break;
        };
    };
};

/* 
 * Classe définissant un objet 
 * Hérite de Base
 */
class Item extends Base {
    constructor(x, y, name, st, dx, iq, ht, zone = 'MAING') {
        super(x, y, name, st, dx, iq, ht);
        this._emplacement = zone;
    };
};