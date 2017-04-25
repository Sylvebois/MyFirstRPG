/*
 * Classe définissant un personnage(monstre ou héros)
 * Hérite de Base
 */
class Perso extends Base {
    constructor(x, y, name, st, dx, iq, ht, level = 1) {
        super(x, y, name, st, dx, iq, ht);
        
        this._level = level;     
        this._finalSt = this._st;
        this._finalDx = this._dx;
        this._finalIq = this._iq;
        this._finalHt = this._ht;

        this._body = {
            'TETE'  : 0,
            'COU'   : 0,
            'TORSE' : 0,
            'JAMBES': 0,
            'PIEDS' : 0,
            'MAING' : 0,
            'MAIND' : 0
        };
    };
    calcStat(zone = 'MAING', equipe) {
        if(equipe === 'undefined') {
            return;
        }
        else if(equipe) {
            this._finalSt += this._body[zone].st;
            this._finalDx += this._body[zone].dx;
            this._finalIq += this._body[zone].iq;
            this._finalHt += this._body[zone].ht;        
        }
        else {
            this._finalSt -= this._body[zone].st;
            this._finalDx -= this._body[zone].dx;
            this._finalIq -= this._body[zone].iq;
            this._finalHt -= this._body[zone].ht;     
        }
    };
    attaque(cible) {
        
    };
    equiperObjet() {
        
    };
    jeterObjet() {
        
    };
};

/* 
 * Classe définissant un héro
 * Hérite de Perso
 */

class Hero extends Perso {
    constructor(x, y, name, st, dx, iq, ht, level) {
        super(x, y, name, st, dx, iq, ht, level);
      
        this._vision = 2;
        this._inventaire = [0,0,0,0,0,0,0,0,0,0];

        //Image à utiliser en fonction de la direction
        this.direction = {
            'DROITE' : [0,0],
            'DROITE_ANIM' : [1,0],
            'GAUCHE' : [0,1],
            'GAUCHE_ANIM' : [1,1],
            'HAUT'   : [2,0],
            'BAS'    : [2,1]
        };
    };
    rangerObjet(item = null) {
        return new Promise((resolve, reject) => {
            let index = this._inventaire.indexOf(0);
            
            if(item && index >= 0) {
                this._inventaire[index] = item;
                resolve(item.nom);
            }
            else {
                reject();
            }
        });    
    };
    bouger(goTo = 'BAS') {
        switch(goTo) {
            case 'GAUCHE':
               this.pos = [this.pos[0]-1, this.pos[1]]; 
               break;
            case 'HAUT':
               this.pos = [this.pos[0], this.pos[1]-1]; 
               break;
            case 'DROITE':
               this.pos = [this.pos[0]+1, this.pos[1]]; 
               break;
            case 'BAS':
            default:
               this.pos = [this.pos[0], this.pos[1]+1]; 
               break;
        }
        
        this.imgPos = this.direction[goTo];
    };
};

/* 
 * Classe définissant un monstre
 * Hérite de Perso
 */
class Monstre extends Perso {
    constructor(x, y, name, st, dx, iq, ht, level, attitude = 'neutre') {
        super(x, y, name, st, dx, iq, ht, level);
        this._attitude = attitude;
        this._image = 0;
    };
    compareEquipement() {
        
    };
};