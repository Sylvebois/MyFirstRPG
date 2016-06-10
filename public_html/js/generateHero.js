/*
 * Gestion du Héros (fiche de perso, mouvement et événements
 */

function Hero(x, y) {
    this.direction = {
	'BAS'    : 5,
	'GAUCHE' : 3,
	'DROITE' : 0,
	'HAUT'   : 2
    };
    
    //Définition de la feuille de personnage
    this.name = 'ERREUR';
    this.level = 1;
    this.st = 15;
    this.dx = 15;
    this.iq = 10;
    this.ht = 10;
    
    //Emplacement du personnage
    this.x = x;
    this.y = y;
    
    //Champ de vision
    this.vis = 2;
    
    //Inventaire = 10 places
    this.inv = [0,0,0,0,0,0,0,0,0,0];
    
    //Emplacement d'équipement
    this.equip = {
        'TETE'  : 0,
        'COU'   : 0,
        'TORSE' : 0,
        'JAMBES': 0,
        'PIEDS' : 0,
        'MAING' : 0,
        'MAIND' : 0
    };
    
    //Caractéristiques avec les équipements
    this.endSt = this.st;
    this.endDx = this.dx;
    this.endIq = this.iq;
    this.endHt = this.ht;
    
    this.calcStat = function(place, equipped) {
        if(equipped) {
            this.endSt += this.equip[place].st;
            this.endDx += this.equip[place].dx;
            this.endIq += this.equip[place].iq;
            this.endHt += this.equip[place].ht;    
        }
        else {
            this.endSt -= this.equip[place].st;
            this.endDx -= this.equip[place].dx;
            this.endIq -= this.equip[place].iq;
            this.endHt -= this.equip[place].ht;     
        }
    };
        
    this.createCookie = function(lvl) {
        var cookieString = this.name + '.heroStat.' + lvl + ' = ';
        var value = [this.level, this.st, this.dx, this.iq, this.ht, this.x, this.y, this.vis];
        
        for(var i = 0; i < value.length; i++){
            cookieString += (i === 0)? '' : ' -- ';
            cookieString += value[i].toString();    
        }
        
        cookieString += ' ** ';
        
        for(var j in this.equip) {
            cookieString += ' -- equip.' + j + ':';
            cookieString += (typeof(this.equip[j]) === 'object')? this.equip[j].prepareCookie() : '0';
        }

        cookieString += ' ** ';
        
        for(var k = 0; k < this.inv.length; k++) {
            cookieString += ' -- inv.' + k + ':';
            cookieString += (typeof(this.inv[k]) === 'object')? this.inv[k].prepareCookie() : '0';    
        }
               
        document.cookie = cookieString;
    };
    
    this.restore = function(cookie) {
        var heroTab = cookie.split(' ** ');
        var heroStat = heroTab[0].split(' -- ');
        var heroEquip = heroTab[1].split(' -- equip.');
        var heroInv = heroTab[2].split(' -- inv.');
        
        var partOfString = '';
        var cmp = 1;
        
        //Statistiques
        this.level = parseInt(heroStat[0]);
        this.st = parseInt(heroStat[1]);
        this.dx = parseInt(heroStat[2]);
        this.iq = parseInt(heroStat[3]);
        this.ht = parseInt(heroStat[4]);
        this.x = parseInt(heroStat[5]);
        this.y = parseInt(heroStat[6]);
        this.vis = parseInt(heroStat[7]);
 
        //Equipement
        for(var i in this.equip) {
            partOfString = getPartOfString(heroEquip[cmp], i+':');
            if(partOfString && partOfString !== '0' && partOfString !== '') {
                this.equip[i] = new Artefact(0, 0);
                this.equip[i].restore(partOfString);      
            }
            else {
                this.equip[i] = 0; 
            }
            cmp++;
        }
        
        //Inventaire
        for(var j = 0; j < this.inv.length; j++){
            partOfString = getPartOfString(heroInv[j+1], j+':');
            if(partOfString && partOfString !== '0') {
                this.inv[j] = new Artefact(0, 0);
                this.inv[j].restore(partOfString);      
            }
            else {
                this.inv[j] = 0; 
            }
        }
    };
}

//Gestion des déplacements et des fenêtres d'info concernant le héros
var controlKeys = {
    'hero' : '',
    'level' : 0,
    handleEvent: function(e){        
        if(uCanvas.className === 'inventaire') {
            if(e.keyCode === 73) {
                cleanIt(uCanvas, ucxt);   
            }
        }
        else if(uCanvas.className === 'options') {
            if(e.keyCode === 79 || e.keyCode === 27) {
                cleanIt(uCanvas, ucxt);
                removeEvent(uCanvas, 'click', optScreen);
            }
        }
        else {
            jcxt.clearRect(0, 0, jCanvas.width, jCanvas.height);

            switch(e.keyCode) {
               case 37:            //left
                   if(this.hero.x > 0 && ground[this.hero.y][this.hero.x-1] !== 130 && enemies[this.hero.y][this.hero.x-1] === 0) {
                       this.hero.x -= 1;
                   }
                   else if(this.hero.x > 0 && enemies[this.hero.y][this.hero.x-1] !== 0) {
                       fight(this.hero.x-1, this.hero.y, this.hero);
                   }
                   drawIt(jcxt, heroesImage, this.hero, this.hero.direction.GAUCHE, heroesNumTiles);
                   delFog(this.hero.x, this.hero.y, this.hero.vis);
                   getItem(this.hero, this.level);
                   break;
               case 38:            //up
                   if(this.hero.y > 0 && ground[this.hero.y-1][this.hero.x] !== 130 && enemies[this.hero.y-1][this.hero.x] === 0) {
                       this.hero.y -= 1;
                   }
                   else if(this.hero.y > 0 && enemies[this.hero.y-1][this.hero.x] !== 0) {
                       fight(this.hero.x, this.hero.y-1, this.hero);
                   }
                   drawIt(jcxt, heroesImage, this.hero, this.hero.direction.HAUT, heroesNumTiles);
                   delFog(this.hero.x, this.hero.y, this.hero.vis);
                   getItem(this.hero, this.level);
                   break;
               case 39:            //right
                   if(this.hero.x < COLTILECOUNT-1 && ground[this.hero.y][this.hero.x+1] !== 130 && enemies[this.hero.y][this.hero.x+1] === 0) {
                       this.hero.x += 1;
                   }
                   else if(this.hero.x < COLTILECOUNT-1 && enemies[this.hero.y][this.hero.x+1] !== 0) {
                       fight(this.hero.x+1, this.hero.y, this.hero);
                   }
                   drawIt(jcxt, heroesImage, this.hero, this.hero.direction.DROITE, heroesNumTiles);
                   delFog(this.hero.x, this.hero.y, this.hero.vis);
                   getItem(this.hero, this.level);
                   break;
               case 40:            //down
                    if(this.hero.y < ROWTILECOUNT-1 && ground[this.hero.y+1][this.hero.x] !== 130 && enemies[this.hero.y+1][this.hero.x] === 0) {
                        this.hero.y += 1;
                    }
                    else if(this.hero.y < ROWTILECOUNT-1 && enemies[this.hero.y+1][this.hero.x] !== 0) {
                        fight(this.hero.x, this.hero.y+1, this.hero);
                    }
                    drawIt(jcxt, heroesImage, this.hero, this.hero.direction.BAS, heroesNumTiles);
                    delFog(this.hero.x, this.hero.y, this.hero.vis);
                    getItem(this.hero, this.level);
                    break;
                case 73:            //inventory
                    showInv(this.hero, itemsImage, itemsNumTiles);
                    manageInv(this.hero, itemsImage, itemsNumTiles);
                    drawIt(jcxt, heroesImage, this.hero, this.hero.direction.BAS, heroesNumTiles);
                    break;
                case 27:
                case 79:            //options
                    showOpt(this.level, this.hero);
                    drawIt(jcxt, heroesImage, this.hero, this.hero.direction.BAS, heroesNumTiles);
                    break;
                default:
                    drawIt(jcxt, heroesImage, this.hero, this.hero.direction.BAS, heroesNumTiles);
                    break;     
           }   
        }
    }
};