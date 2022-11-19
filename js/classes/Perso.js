/*
 * Define a character (monster or Hero)
 */
class Perso extends Base {
    constructor(x, y, name, st, dx, iq, ht, level = 1) {
        super(x, y, name, st, dx, iq, ht);

        this.level = level;

        this.hpLeft = this.end;

        this.body = {
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
            this.modSpecs('st', this.st + this.body[zone].st);
            this.modSpecs('dx', this.dx + this.body[zone].dx);
            this.modSpecs('iq', this.iq + this.body[zone].iq);
            this.modSpecs('ht', this.ht + this.body[zone].ht);
        }
        else {
            this.modSpecs('st', this.st - this.body[zone].st);
            this.modSpecs('dx', this.dx - this.body[zone].dx);
            this.modSpecs('iq', this.iq - this.body[zone].iq);
            this.modSpecs('ht', this.ht - this.body[zone].ht);
        }
    };
    attaque(cible) {
        let dmg = (this.atk - cible.def < 0)? 0 : this.atk - cible.def;
        cible.end = (cible.end - dmg < 0)? 0 : cible.end - dmg;

        if(typeof(cible.vision) === 'undefined'){
            info.addText('Vous attaquez ' + cible.name + ' ... BASTOOOOON !!!', 'red');
            info.addText('Vous infligez ' + dmg + 'dégats');
            (cible.end === 0)? info.addText(cible.name + ' s\'effondre sous vos coups') : null;
        }
        else {
            info.addText(this.name + ' vous attaque ... ATTENTION !', 'red');
            info.addText('Vous prenez ' + dmg + 'dégats');
            (cible.end === 0)? info.addText('Vous tombez sous les coups de l\'ennemi ... GAME OVER !', 'red') : null;
        }
    };
    equiperObjet() {

    };
    jeterObjet() {

    };
};

/*
 * Define the Hero
 */
class Hero extends Perso {
    constructor(x, y, name, st, dx, iq, ht, level) {
        super(x, y, name, st, dx, iq, ht, level);

        this.vision = 2;
        this.inventaire = [0,0,0,0,0,0,0,0,0,0];
        this.bodySlot = [0,0,0,0,0,0,0];

        //Different image depending on the direction
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
 * Define a monster
 */
class Monstre extends Perso {
    constructor(x, y, name, st, dx, iq, ht, level, attitude = 'neutre') {
        super(x, y, name, st, dx, iq, ht, level);
        this.attitude = attitude;
        this.image = 0;
    };
    compareEquipement() {

    };
};