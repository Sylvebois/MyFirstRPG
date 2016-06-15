/* 
 * Classe définissant les caractéristiques de base d'un personnage (monstre ou héros)
 * Hérite de Tuile
 */

function Perso(x, y) {
    Tuile.call(this, x, y);
    
    this._name = '';
    this._st = 0;
    this._dx = 0;
    this._iq = 0;
    this._ht = 0;
    this._level = 1;
}

Perso.prototype = Object.create(Tuile.prototype);

