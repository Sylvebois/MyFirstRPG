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
      
        this.vision = 2;
        this.inventaire = [0,0,0,0,0,0,0,0,0,0];
        this.bodySlot = [0,0,0,0,0,0,0];

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
            let index = this.inventaire.indexOf(0);
            
            if(item && index >= 0) {
                let x = (index < 7)? 2 * index + 3 : 2 * (index-7) + 3;
                let y = (index < 7)? 14 : 16;

                this.inventaire[index] = item;
                this.inventaire[index].pos = [x,y];
                resolve(item.nom);
            }
            else {
                reject();
            }
        });    
    };
    bouger(goTo) {
        this.pos = [goTo[1][0], goTo[1][1]]; 
        this.imgPos = this.direction[goTo[0]];
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