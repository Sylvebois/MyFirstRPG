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
    
    this.createCookie = function() {
        var cookieString = 'heroStat = ';
        var value = [this.name, this.level, this.st, this.dx, this.iq, this.ht, this.x, this.y, this.vis];
        
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
        var cmp = 0;
        
        this.name = heroStat[0];
        this.level = parseInt(heroStat[1]);
        this.st = parseInt(heroStat[2]);
        this.dx = parseInt(heroStat[3]);
        this.iq = parseInt(heroStat[4]);
        this.ht = parseInt(heroStat[5]);
        this.x = parseInt(heroStat[6]);
        this.y = parseInt(heroStat[7]);
        this.vis = parseInt(heroStat[8]);
        
        for(var i in this.equip) {
            partOfString = getPartOfString(heroEquip[cmp], i+':');
            if(partOfString && partOfString !== '0') {
                this.equip[i] = new Artefact(0, 0);
                this.equip[i].restore(partOfString);      
            }
            cmp++;
        }
    };
}

//Gestion des déplacements et des fenêtres d'info concernant le héros
function controlKeys(e, hero, level){
    if(uCanvas.className === 'inventaire') {
        if(e.keyCode === 73 || e.keyCode === 27) {
            cleanIt(uCanvas, ucxt);   
        }
    }
    else if(uCanvas.className === 'options') {
        if(e.keyCode === 79 || e.keyCode === 27) {
            cleanIt(uCanvas, ucxt);   
        }
    }
    else {
        jcxt.clearRect(0, 0, jCanvas.width, jCanvas.height);

        switch(e.keyCode) {
           case 37:            //left
               if(hero.x > 0 && ground[hero.y][hero.x-1] !== 130 && enemies[hero.y][hero.x-1] === 0) {
                   hero.x -= 1;
               }
               else if(hero.x > 0 && enemies[hero.y][hero.x-1] !== 0) {
                   fight(hero.x-1, hero.y, hero);
               }
               drawIt(jcxt, heroesImage, hero, hero.direction.GAUCHE, heroesNumTiles);
               delFog(hero.x, hero.y, hero.vis);
               getItem(hero, level);
               break;
           case 38:            //up
               if(hero.y > 0 && ground[hero.y-1][hero.x] !== 130 && enemies[hero.y-1][hero.x] === 0) {
                   hero.y -= 1;
               }
               else if(hero.y > 0 && enemies[hero.y-1][hero.x] !== 0) {
                   fight(hero.x, hero.y-1, hero);
               }
               drawIt(jcxt, heroesImage, hero, hero.direction.HAUT, heroesNumTiles);
               delFog(hero.x, hero.y, hero.vis);
               getItem(hero, level);
               break;
           case 39:            //right
               if(hero.x < COLTILECOUNT-1 && ground[hero.y][hero.x+1] !== 130 && enemies[hero.y][hero.x+1] === 0) {
                   hero.x += 1;
               }
               else if(hero.x < COLTILECOUNT-1 && enemies[hero.y][hero.x+1] !== 0) {
                   fight(hero.x+1, hero.y, hero);
               }
               drawIt(jcxt, heroesImage, hero, hero.direction.DROITE, heroesNumTiles);
               delFog(hero.x, hero.y, hero.vis);
               getItem(hero, level);
               break;
           case 40:            //down
                if(hero.y < ROWTILECOUNT-1 && ground[hero.y+1][hero.x] !== 130 && enemies[hero.y+1][hero.x] === 0) {
                    hero.y += 1;
                }
                else if(hero.y < ROWTILECOUNT-1 && enemies[hero.y+1][hero.x] !== 0) {
                    fight(hero.x, hero.y+1, hero);
                }
                drawIt(jcxt, heroesImage, hero, hero.direction.BAS, heroesNumTiles);
                delFog(hero.x, hero.y, hero.vis);
                getItem(hero, level);
                break;
            case 73:            //inventory
                showInv(hero, itemsImage, itemsNumTiles);
                equipIt(hero, itemsImage, itemsNumTiles);
                drawIt(jcxt, heroesImage, hero, hero.direction.BAS, heroesNumTiles);
                break;
            default:
                drawIt(jcxt, heroesImage, hero, hero.direction.BAS, heroesNumTiles);
                break;     
       }   
    }
}