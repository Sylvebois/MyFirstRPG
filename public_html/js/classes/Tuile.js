/*
 * Basic Tile containing position on the canvas and the drawing functions
 */
class Tile {
    constructor(x, y) {
        // Tile position on the canvas
        this.posX = parseInt(x);
        this.posY = parseInt(y);

        // Default position of the image in the tileset
        this.imgX = 0;
        this.imgY = 0;
    };
    get pos(){
        return [this.posX,this.posY];
    };
    set pos(newCoord){
        this.posX = parseInt(newCoord[0]);
        this.posY = parseInt(newCoord[1]);
    };
    get imgPos(){
        return [this.imgX,this.imgY];
    };
    set imgPos(newCoord){
        this.imgX = parseInt(newCoord[0]);
        this.imgY = parseInt(newCoord[1]);
    };
    draw(context, image, inventory = false) {
        let size = (inventory)? 2*tileSizeOnScreen : tileSizeOnScreen;
        context.drawImage(image, this.imgX*TILESIZE, this.imgY*TILESIZE, TILESIZE, TILESIZE, this.posX*tileSizeOnScreen, this.posY*tileSizeOnScreen, size, size);
    }
};

/*
 * Define the ground or wall type
 */
class MapTile extends Tile {
    constructor(x, y, type = 'ground') {
        super(x, y);
        this.setType(type);
    };
    setType(type = 'ground') {
        this.groundType = type.toString();

        // Give the position on the tileset and if the tile is accessible
        switch(this.groundType) {
            case 'wall' :
                this.imgPos = [12,4];
                this.accessible = false;
                break;
            case 'ground' :
            default:
                this.imgPos = [1,9];
                this.accessible = true;
                break;
        }
    };
    get access() {
        return this.accessible;
    };
    set access(bool) {
        this.accessible = bool;
    };
    get typeSol() {
        return this.groundType;
    };
    set typeSol(type) {
        this.groundType = type;
    };
};

/*
 * Basic specs definition of a character / item
 */
class Base extends Tile {
    constructor(x = 0, y = 0, name = 'No Name', st = 1, dx = 1, iq = 1, ht = 1) {
        super(x,y);
        this.name = name;

        //Primaire
        this.st = st;
        this.dx = dx;
        this.iq = iq;
        this.ht = ht;

        //Secondaire
        this.atk = Math.floor(2*this.st + this.dx + this.iq/2);
        this.def = Math.floor(2*this.iq + this.dx + this.ht/2);
        this.esq = Math.floor(2*this.dx + this.iq + this.st/2);
        this.end = Math.floor(2*this.ht + this.st + this.dx/2);
    };
    modSpecs(type, value = 0) {
        switch(type) {
            case 'st':
                this.st = value;
                this.modSpecs('atk', Math.floor(2*this.st + this.dx + this.iq/2));
                this.modSpecs('esq', Math.floor(2*this.dx + this.iq + this.st/2));
                this.modSpecs('end', Math.floor(2*this.ht + this.st + this.dx/2));
                break;
            case 'dx':
                this.dx = value;
                this.modSpecs('atk', Math.floor(2*this.st + this.dx + this.iq/2));
                this.modSpecs('def', Math.floor(2*this.iq + this.dx + this.ht/2));
                this.modSpecs('esq', Math.floor(2*this.dx + this.iq + this.st/2));
                this.modSpecs('end', Math.floor(2*this.ht + this.st + this.dx/2));
                break;
            case 'iq':
                this.iq = value;
                this.modSpecs('atk', Math.floor(2*this.st + this.dx + this.iq/2));
                this.modSpecs('def', Math.floor(2*this.iq + this.dx + this.ht/2));
                this.modSpecs('esq', Math.floor(2*this.dx + this.iq + this.st/2));
                break;
            case 'ht':
                this.ht = value;
                this.modSpecs('def', Math.floor(2*this.iq + this.dx + this.ht/2));
                this.modSpecs('end', Math.floor(2*this.ht + this.st + this.dx/2));
                break;
            case 'atk':
                this.atk = value;
                break;
            case 'def':
                this.def = value;
                break;
            case 'esq':
                this.esq = value;
                break;
            case 'end':
                this.end = value;
                break;
        };
    };
    get nom() {
        return this.name;
    };
    set nom(name) {
        this.name = name;
    };
};

/*
 * Items definition
 */
class Item extends Base {
    constructor(x, y, name, st, dx, iq, ht, zone = 'MAING') {
        super(x, y, name, st, dx, iq, ht);
        this.slot = zone;
    };
};