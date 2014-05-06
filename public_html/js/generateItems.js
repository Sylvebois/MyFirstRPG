/*
 * Placement aléatoire des items
 */

function Artefact(abs, ord) {
    var type = ['Zéro', 'Boomerang', 'Arc', 'Pistolet', 'Fléau', 'Epée', 'Livre', 'Lance', 'Descendre', 'Monter'];
    var primCar = ['de force', 'de dextérité', 'd\'intelligence', 'de santé'];
    var qualite = ['inutile', 'pourri', 'cassé', 'abîmé', '', 'de qualité', 'légendaire', 'épique', 'mythique'];
    
    //Position de l'item
    this.x = abs;
    this.y = ord;
    
    //Position pour l'inventaire
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    
    //Création du nom et des caractéristiques
    this.quelType = rand(0,7,1);  
    this.quelSpec = rand(0,3,1);
    this.quelQual = rand(0,8,1);
    this.name = type[this.quelType] + ' ' + primCar[this.quelSpec] + ' ' + qualite[this.quelQual];
    
    switch(this.quelQual) {
        case 0:                         //inutile --> 4 stats à -5
            this.st = -5;
            this.dx = -5;
            this.iq = -5;
            this.ht = -5;
            break;
        case 1:                         //pourri --> 3 stats à -5
            switch(this.quelSpec) {
                case 0:                     //force
                    this.st = rand(0,5,1);
                    this.dx = -5;
                    this.iq = -5;
                    this.ht = -5;
                    break;
                case 1:                     //dextérité
                    this.st = -5;
                    this.dx = rand(0,5,1);
                    this.iq = -5;
                    this.ht = -5;
                    break;
                case 2:                     //intelligence
                    this.st = -5;
                    this.dx = -5;
                    this.iq = rand(0,5,1);
                    this.ht = -5;
                    break;
                case 3:                     //santé
                    this.st = -5;
                    this.dx = -5;
                    this.iq = -5;
                    this.ht = rand(0,5,1);
                    break;
            }
            break;
        case 2:                         //cassé --> 2 stats à -5
            switch(this.quelSpec) {
                case 0:                     //force
                    this.st = rand(0,5,1);
                    this.dx = -5;
                    this.iq = -5;
                    this.ht = rand(-4,4,1);
                    break;
                case 1:                     //dextérité
                    this.st = rand(-4,4,1);
                    this.dx = rand(0,5,1);
                    this.iq = -5;
                    this.ht = -5;
                    break;
                case 2:                     //intelligence
                    this.st = -5;
                    this.dx = rand(0,5,1);
                    this.iq = rand(-4,4,1);
                    this.ht = -5;
                    break;
                case 3:                     //santé
                    this.st = -5;
                    this.dx = rand(-4,4,1);
                    this.iq = -5;
                    this.ht = rand(0,5,1);
                    break;
            }
            break;
        case 3:                         //abîmé --> 1 stat à -5
            switch(this.quelSpec) {
                case 0:                     //force
                    this.st = rand(0,5,1);
                    this.dx = rand(-4,4,1);
                    this.iq = -5;
                    this.ht = rand(-4,4,1);
                    break;
                case 1:                     //dextérité
                    this.st = rand(-4,4,1);
                    this.dx = rand(0,5,1);
                    this.iq = rand(-4,4,1);
                    this.ht = -5;
                    break;
                case 2:                     //intelligence
                    this.st = -5;
                    this.dx = rand(-4,4,1);
                    this.iq = rand(0,5,1);
                    this.ht = rand(-4,4,1);
                    break;
                case 3:                     //santé
                    this.st = rand(-4,4,1);
                    this.dx = -5;
                    this.iq = rand(-4,4,1);
                    this.ht = rand(0,5,1);
                    break;
            }
            break;
        case 4:                         //neutre --> tout aléatoire
            this.st = rand(-4,4,1);
            this.dx = rand(-4,4,1);
            this.iq = rand(-4,4,1);
            this.ht = rand(-4,4,1);
            break;
        case 5:                         //de qualité --> 1 stat à +5
            switch(this.quelSpec) {
                case 0:                     //force
                    this.st = 5;
                    this.dx = rand(-4,4,1);
                    this.iq = rand(-4,4,1);
                    this.ht = rand(-4,4,1);
                    break;
                case 1:                     //dextérité
                    this.st = rand(-4,4,1);
                    this.dx = 5;
                    this.iq = rand(-4,4,1);
                    this.ht = rand(-4,4,1);
                    break;
                case 2:                     //intelligence
                    this.st = rand(-4,4,1);
                    this.dx = rand(-4,4,1);
                    this.iq = 5;
                    this.ht = rand(-4,4,1);
                    break;
                case 3:                     //santé
                    this.st = rand(-4,4,1);
                    this.dx = rand(-4,4,1);
                    this.iq = rand(-4,4,1);
                    this.ht = 5;
                    break;
            }
            break;
        case 6:                         //légendaire --> 2 stats à +5
            switch(this.quelSpec) {
                case 0:                     //force
                    this.st = 5;
                    this.dx = rand(-4,4,1);
                    this.iq = rand(-4,4,1);
                    this.ht = 5;
                    break;
                case 1:                     //dextérité
                    this.st = 5;
                    this.dx = 5;
                    this.iq = rand(-4,4,1);
                    this.ht = rand(-4,4,1);
                    break;
                case 2:                     //intelligence
                    this.st = rand(-4,4,1);
                    this.dx = 5;
                    this.iq = 5;
                    this.ht = rand(-4,4,1);
                    break;
                case 3:                     //santé
                    this.st = rand(-4,4,1);
                    this.dx = 5;
                    this.iq = rand(-4,4,1);
                    this.ht = 5;
                    break;
            }
            break;
        case 7:                         //épique --> 3 stats à +5
            switch(this.quelSpec) {
                case 0:                     //force
                    this.st = 5;
                    this.dx = 5;
                    this.iq = rand(-4,4,1);
                    this.ht = 5;
                    break;
                case 1:                     //dextérité
                    this.st = 5;
                    this.dx = 5;
                    this.iq = 5;
                    this.ht = rand(-4,4,1);
                    break;
                case 2:                     //intelligence
                    this.st = rand(-4,4,1);
                    this.dx = 5;
                    this.iq = 5;
                    this.ht = 5;
                    break;
                case 3:                     //santé
                    this.st = 5;
                    this.dx = rand(-4,4,1);
                    this.iq = 5;
                    this.ht = 5;
                    break;
            }
            break;
        case 8:                         //mythique --> 4 stas à +5
            this.st = 5;
            this.dx = 5;
            this.iq = 5;
            this.ht = 5;
            break;    
    }
    
    //Emplacement pour l'équipement
    if(this.quelType <= 0) {
        this.equip = 'MAING';
    }
    else if(this.quelType > 0 && this.quelType <= 7) {
        this.equip = 'MAIND';
    }
    
    this.prepareCookie = function() {
        var cookieString = '';
        var value = [this.quelType, this.quelSpec, this.quelQual, this.st, this.dx, this.iq, this.ht, this.x, this.y, this.startX, this.startY, this.endX, this.endY];
        
        for(var i = 0; i < value.length; i++){
            cookieString += (i === 0)? '' : ' -- ';
            cookieString += value[i].toString();   
        }
        
        return cookieString;
    };
    
    this.restore = function(cookie) {
        var itemTab = cookie.split(' -- ');
        
        this.quelType = parseInt(itemTab[0]);
        this.quelSpec = parseInt(itemTab[1]);
        this.quelQual = parseInt(itemTab[2]);
        this.st = parseInt(itemTab[3]);
        this.dx = parseInt(itemTab[4]);
        this.iq = parseInt(itemTab[5]);
        this.ht = parseInt(itemTab[6]);
        this.x = parseInt(itemTab[7]);
        this.y = parseInt(itemTab[8]);
        this.startX = parseInt(itemTab[9]);
        this.startY = parseInt(itemTab[10]);
        this.endX = parseInt(itemTab[11]);
        this.endY = parseInt(itemTab[12]);
        
        this.name = type[this.quelType] + ' ' + primCar[this.quelSpec] + ' ' + qualite[this.quelQual];
    };   
}

//Place un certain nombre d'items en fonction de la taille du donjon et de la position de départ du héros
function placeItem(xHero, yHero, tabFree, difficulty, level) {
    var coord = [0,0];
    var nbItems = nbToGenerate(tabFree, difficulty);
        
    //Place l'escalier vers le haut (sous le héros) et vers le bas
    if(level > 1) {
        var stairUp = new Artefact(xHero, yHero);
        stairUp.st = 0;
        stairUp.dx = 0;
        stairUp.iq = 0;
        stairUp.ht = 0;
        stairUp.quelType = 9;
        item[yHero][xHero] = stairUp;

        drawIt(icxt, itemsImage, stairUp, stairUp.quelType, itemsNumTiles);   
    }
    
    do {
        coord = placeIt();
    }while((coord[0] === xHero && coord[1] === yHero) || (item[coord[1]][coord[0]]));   //Ne place pas stairDown sous la position de départ du héros ou s'il y a déjà un objet
    
    var stairDown = new Artefact(coord[0], coord[1]);
    stairDown.st = 0;
    stairDown.dx = 0;
    stairDown.iq = 0;
    stairDown.ht = 0;
    stairDown.quelType = 8;
    item[coord[1]][coord[0]] = stairDown;
    drawIt(icxt, itemsImage, stairDown, stairDown.quelType, itemsNumTiles);
    
    for(var k = nbItems; k >= 0 ; k--) {    
        do {
            coord = placeIt();
        }while((coord[0] === xHero && coord[1] === yHero) || (item[coord[1]][coord[0]])); //Ne place pas d'item sous la position de départ du héros ou s'il y a déjà un objet
        
        var tmp = new Artefact(coord[0], coord[1]);
        item[coord[1]][coord[0]] = tmp;
    
        drawIt(icxt, itemsImage, tmp, tmp.quelType, itemsNumTiles);
    }
}

//Evènement quand le héros arrive sur la case
function getItem(joueur, level) {
    var tmp = item[joueur.y][joueur.x];
    var texte = 'Vous avez trouvé un(e) ' +  tmp.name + '!\n' +
                'Force : ' + tmp.st + '\n' +
                'Dextérité : ' + tmp.dx + '\n' +
                'Intelligence : ' + tmp.iq + '\n' +
                'Santé : ' + tmp.ht + '\n\n' +
                'Le prendre ?';
        
    if(tmp && tmp.quelType !== 8 && tmp.quelType !== 9) {
        if(confirm(texte)) {
            if(takeIt(tmp, joueur)){
                icxt.clearRect(joueur.x*TILESIZE, joueur.y*TILESIZE, TILESIZE, TILESIZE);
                item[joueur.y][joueur.x] = 0;      
            }
            else {
                alert('Vous n\'avez plus de place pour prendre cet objet ...');
            }
        }
    }
    else if(tmp.quelType === 8) {
        if(confirm('Voulez-vous descendre au niveau suivant ?')) {
            cleanIt(tCanvas, tcxt, 'ground');
            cleanIt(iCanvas, icxt, 'item');
            cleanIt(eCanvas, ecxt, 'enemies');
            cleanIt(jCanvas, jcxt);
            cleanIt(fCanvas, fcxt, 'fog');
            cleanIt(uCanvas, ucxt);
            
            level++;
            
            launch(joueur,level);
        }
    }
    else if(tmp.quelType === 9 && createForm.className === 'hidden') {
        if(confirm('Voulez-vous monter au niveau précédent ?')) {
            cleanIt(tCanvas, tcxt, 'ground');
            cleanIt(iCanvas, icxt, 'item');
            cleanIt(eCanvas, ecxt, 'enemies');
            cleanIt(jCanvas, jcxt);
            cleanIt(fCanvas, fcxt, 'fog');
            cleanIt(uCanvas, ucxt);
            
            level--;
            
            load(joueur,level);
        }
    }
}

//Vérifie s'il y a encore de la place pour prendre l'Artefact
function takeIt(item, joueur){
     var taken = false;

     for(var i = 0; i < joueur.inv.length; i++) {
         if(!joueur.inv[i]) {
             joueur.inv[i] = item;
             taken = true;
             break;
         }
     }
     return taken;
 }