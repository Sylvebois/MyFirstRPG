/* 
 * Classe définissant les caractéristiques de base d'un personnage (monstre ou héros)
 * Hérite de Tuile
 */
class Perso extends Tuiles {
    constructor(x = 0, y = 0, name = '', st = 0, dx = 0, iq = 0, ht = 0, level = 1) {
        super(x,y);
        this._name = name;
        this._st = st;
        this._dx = dx;
        this._iq = iq;
        this._ht = ht;
        this._level = level;

        this._imgX = 0;
        this._imgY = 0;   
    };
    setImgPos(x = 0,y = 0) {
        this._imgX = x;
        this._imgY = y;       
    };
    modCharacter(type, value = 0) {
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
    }
};

/* 
 * Classe définissant un héro
 * Hérite de Perso
 */

class Hero extends Perso {
    constructor(x = 0, y = 0, name = '', st = 0, dx = 0, iq = 0, ht = 0, level = 1) {
        super(x, y, name, st, dx, iq, ht, level);
    }
};