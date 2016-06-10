/* 
 * Affiche et permet de gérer les ecrans d'options et d'inventaire du héros
 */

//Affiche l'inventaire
function showInv(joueur, imgItems, numItems){
    var cmp = 0;
    var xCoteGauche = (TILESIZE*COLTILECOUNT)/4;
    var tileRow = 0;
    var tileCol = 0;
    
    uCanvas.className = '';
    uCanvas.className = 'inventaire';

    ucxt.drawImage(invImage, 0, 0, invImage.width, invImage.height, xCoteGauche, TILESIZE, (TILESIZE*COLTILECOUNT)/2, (TILESIZE*ROWTILECOUNT)-(2*TILESIZE));
    
    //Dessine les slots de l'inventaire
    for(var j = 4*TILESIZE; j < (TILESIZE*ROWTILECOUNT)/2; j += 2*TILESIZE) {
        for(var i = TILESIZE; i < (TILESIZE*COLTILECOUNT)/2 - TILESIZE; i += 2*TILESIZE) {
            if(cmp >= 10) {
                break;   
            }
            else{              
                ucxt.strokeRect(xCoteGauche + i, (TILESIZE*ROWTILECOUNT)/2 + j, 2*TILESIZE, 2*TILESIZE);
                
                if(joueur.inv[cmp]){
                    tileRow = (joueur.inv[cmp].quelType / numItems) | 0;
                    tileCol = (joueur.inv[cmp].quelType % numItems) | 0;
                    ucxt.drawImage(imgItems, (tileCol*TILESIZE), (tileRow*TILESIZE), TILESIZE, TILESIZE, xCoteGauche + i, (TILESIZE*ROWTILECOUNT)/2 + j, 2*TILESIZE, 2*TILESIZE);                    
                    
                    joueur.inv[cmp].startX = xCoteGauche + i;
                    joueur.inv[cmp].startY = (TILESIZE*ROWTILECOUNT)/2 + j;
                    joueur.inv[cmp].endX = xCoteGauche + i + 2*TILESIZE;
                    joueur.inv[cmp].endY = (TILESIZE*ROWTILECOUNT)/2 + j + 2*TILESIZE;                    
                }
                
                cmp ++;
            }
        }    
    }
    
    //Dessine le slot pour lacher un item
    ucxt.strokeRect(21*TILESIZE, 16*TILESIZE, 2*TILESIZE, 2*TILESIZE);
    
    //Dessine les armes dans les slots d'équipement
    for(var valeur in joueur.equip) {
        if(joueur.equip[valeur]) {
            tileRow = (joueur.equip[valeur].quelType / numItems) | 0;
            tileCol = (joueur.equip[valeur].quelType % numItems) | 0;
            ucxt.drawImage(imgItems, (tileCol*TILESIZE), (tileRow*TILESIZE), TILESIZE, TILESIZE, joueur.equip[valeur].startX , joueur.equip[valeur].startY, 2*TILESIZE, 2*TILESIZE);                      
        }
    }
}

//Gestion du drag'n'drop pour équiper les items
function manageInv (joueur, imgItems, numItems) {    
    var storage = {
        'artefact' : 0,
        'origin' : '',
        'dragging' : false    
    };
    
    addEvent(uCanvas, 'mousedown', function(e) {
        var dim = getDim();
        var posX = (e.clientX - dim[2]) * dim[0];
        var posY = (e.clientY - dim[3]) * dim[1]; 
        
        //Si on clique dans la zone correspondant à un slot de l'inventaire et qu'il y a un objet 
        for (var i = 0 ; i < joueur.inv.length ; i++) {
            if(!storage.dragging && joueur.inv[i]){
                if(posX > joueur.inv[i].startX && posX < joueur.inv[i].endX && posY > joueur.inv[i].startY && posY < joueur.inv[i].endY) {
                    storage.dragging = true;
                    storage.origin = 'inv';
                    storage.artefact = joueur.inv[i];
                    joueur.inv[i] = 0;
                }
            }
        }
        
        //Si on clique dans la zone correspondant à un slot d'équipement et qu'il y a un objet 
        for (var valeur in joueur.equip) {
            if(!storage.dragging && joueur.equip[valeur]){
                if(posX > joueur.equip[valeur].startX && posX < joueur.equip[valeur].endX && posY > joueur.equip[valeur].startY && posY < joueur.equip[valeur].endY) {
                    storage.dragging = true;
                    storage.origin = valeur;
                    storage.artefact = joueur.equip[valeur];
                    joueur.calcStat(valeur, false);
                    joueur.equip[valeur] = 0;
                }
            }
        }
    });

    addEvent(uCanvas, 'mouseup', function(e) {
        var dim = getDim();
        var posX = (e.clientX - dim[2]) * dim[0];
        var posY = (e.clientY - dim[3]) * dim[1]; 
        
        var wrongPlace = true;
        
        var dropZone = {
            'sx' : 21*TILESIZE,
            'ex' : 23*TILESIZE,
            'sy' : 16*TILESIZE,
            'ey' : 18*TILESIZE
        };
        
        var zoneInv = {
            'sx1' : (TILESIZE*COLTILECOUNT)/4 + TILESIZE,
            'ex1' : 3*(TILESIZE*COLTILECOUNT)/4 - TILESIZE,
            'sy1' : (TILESIZE*ROWTILECOUNT)/2 + 4*TILESIZE,
            'ey1' : (TILESIZE*ROWTILECOUNT)/2 + 6*TILESIZE,
            'sx2' : (TILESIZE*COLTILECOUNT)/4 + TILESIZE,
            'ex2' : (TILESIZE*COLTILECOUNT)/2 + TILESIZE,
            'sy2' : (TILESIZE*ROWTILECOUNT)/2 + 6*TILESIZE,
            'ey2' : (TILESIZE*ROWTILECOUNT)/2 + 8*TILESIZE
        };
        
        var zonesEquip = {
            'COUSX' : (TILESIZE*COLTILECOUNT)/4 + TILESIZE,
            'COUSY' : 2*TILESIZE,
            'COUEX' : (TILESIZE*COLTILECOUNT)/4 + 3*TILESIZE,
            'COUEY' : 4*TILESIZE,
            'MAINDSX' : (TILESIZE*COLTILECOUNT)/4 + TILESIZE,
            'MAINDSY' : 6*TILESIZE,
            'MAINDEX' : (TILESIZE*COLTILECOUNT)/4 + 3*TILESIZE,
            'MAINDEY' : 8*TILESIZE,
            'JAMBESSX' : (TILESIZE*COLTILECOUNT)/4 + TILESIZE,
            'JAMBESSY' : 10*TILESIZE,
            'JAMBESEX' : (TILESIZE*COLTILECOUNT)/4 + 3*TILESIZE,
            'JAMBESEY' : 12*TILESIZE,  
            'TETESX' : (TILESIZE*COLTILECOUNT)/2 + 5*TILESIZE,
            'TETESY' : 2*TILESIZE,
            'TETEEX' : (TILESIZE*COLTILECOUNT)/2 + 5*TILESIZE + 2*TILESIZE,
            'TETEEY' : 4*TILESIZE,
            'TORSESX' : (TILESIZE*COLTILECOUNT)/2 + 5*TILESIZE,
            'TORSESY' : 5*TILESIZE,
            'TORSEEX' : (TILESIZE*COLTILECOUNT)/2 + 5*TILESIZE + 2*TILESIZE,
            'TORSEEY' : 7*TILESIZE,
            'MAINGSX' : (TILESIZE*COLTILECOUNT)/2 + 5*TILESIZE,
            'MAINGSY' : 8*TILESIZE,
            'MAINGEX' : (TILESIZE*COLTILECOUNT)/2 + 5*TILESIZE + 2*TILESIZE,
            'MAINGEY' : 10*TILESIZE,
            'PIEDSSX' : (TILESIZE*COLTILECOUNT)/2 + 5*TILESIZE,
            'PIEDSSY' : 11*TILESIZE,
            'PIEDSEX' : (TILESIZE*COLTILECOUNT)/2 + 5*TILESIZE + 2*TILESIZE,
            'PIEDSEY' : 13*TILESIZE
        };
        
        if(storage.dragging) {            
            //Si on lache l'objet dans une zone d'inventaire
            if( posX > zoneInv.sx1 && posX < zoneInv.ex1 && posY > zoneInv.sy1 && posY < zoneInv.ey1 ||
                posX > zoneInv.sx2 && posX < zoneInv.ex2 && posY > zoneInv.sy2 && posY < zoneInv.ey2) {
            
                if(!takeIt(storage.artefact, joueur)) {
                    alert('Plus de place dans l\'inventaire, action annulée');
                    joueur.equip[storage.origin] = storage.artefact;
                }
                                
                wrongPlace = false;
            }  
            
            //Si on veut sortir l'objet de son inventaire
            else if(posX > dropZone.sx && posX < dropZone.ex && posY > dropZone.sy && posY < dropZone.ey) {
                if(!dropIt(joueur, storage)) {
                    alert('Il n\'y a plus de place autour de vous pour déposer cet objet');
                }
                else {
                    wrongPlace = false;
                }
            }
            
            //Si on lache l'objet dans un slot d'équipement
            for(var valeur in joueur.equip) {
                if(posX > zonesEquip[valeur + 'SX'] && posX < zonesEquip[valeur + 'EX'] && posY > zonesEquip[valeur + 'SY'] && posY < zonesEquip[valeur + 'EY']){  
                    if(!joueur.equip[valeur]) {
                        if(joueur.endHt + storage.artefact.ht > 0) {
                            joueur.equip[valeur] = storage.artefact;
                            joueur.equip[valeur].startX = zonesEquip[valeur + 'SX'];
                            joueur.equip[valeur].endX = zonesEquip[valeur + 'EX'];
                            joueur.equip[valeur].startY = zonesEquip[valeur + 'SY'];
                            joueur.equip[valeur].endY = zonesEquip[valeur + 'EY'];
                            joueur.calcStat(valeur, true);
                        }
                        else {
                            alert('Cela ne semble pas être une bonne idée ...');
                            takeIt(storage.artefact, joueur);
                        }
                    }
                    else {
                        alert('Emplacement déjà occupé, action annulée');
                        
                        if(storage.origin === 'inv') {
                            takeIt(storage.artefact, joueur);
                        }
                        else {
                            joueur.equip[storage.origin] = storage.artefact;
                            joueur.calcStat(storage.origin, true);
                        }
                    }
                    
                    wrongPlace = false;
                }
            }
            
            //Si on lache l'objet n'importe où ailleurs
            if(wrongPlace) {
                if(storage.origin === 'inv') {
                    takeIt(storage.artefact, joueur);
                }
                else {
                    joueur.equip[storage.origin] = storage.artefact;
                    joueur.calcStat(storage.origin, true);
                }
            }

            storage = {};
            storage.artefact = 0;
            storage.dragging = false;
        }
        
        ucxt.clearRect(0, 0, TILESIZE*COLTILECOUNT, TILESIZE*ROWTILECOUNT);
        showInv(joueur, imgItems, numItems);
    });

    addEvent(document, 'mousemove', function(e) {
        var dim = getDim();
        var posX = (e.clientX - dim[2]) * dim[0];
        var posY = (e.clientY - dim[3]) * dim[1]; 
            
        if (storage.dragging) {
            var tileRow = (storage.artefact.quelType / numItems) | 0;
            var tileCol = (storage.artefact.quelType % numItems) | 0;
            
            ucxt.clearRect(0, 0, TILESIZE*COLTILECOUNT, TILESIZE*ROWTILECOUNT);
            showInv(joueur, imgItems, numItems);
            ucxt.drawImage(imgItems, tileCol*TILESIZE, tileRow*TILESIZE, TILESIZE, TILESIZE, posX, posY, TILESIZE, TILESIZE);
        }
    });
}

// Transfert des objets de l'inventaire vers la map
function dropIt(joueur, storage) {
    var dropped = false;
    
    if(!item[joueur.y][joueur.x]) { 
        item[joueur.y][joueur.x] = storage.artefact; 
        item[joueur.y][joueur.x].x = joueur.x;
        item[joueur.y][joueur.x].y = joueur.y;
        
        drawIt(icxt, itemsImage, item[joueur.y][joueur.x], item[joueur.y][joueur.x].quelType, itemsNumTiles);
        
        dropped = true;
    }
    else {
        for(var i = joueur.x+1; i <= joueur.x-1; i--) {
            for(var j = joueur.y+1; j <= joueur.y-1; j--) {
                if(!item[j][i]){
                    item[j][i] = storage.artefact;
                    item[j][i].x = i;
                    item[j][i].y = j;
                    
                    drawIt(icxt, itemsImage, item[j][i], item[j][i].quelType, itemsNumTiles);

                    dropped = true;
                    break;
                }
            }
        }      
    }

    return dropped;
}

//Affiche les options
function showOpt(level, hero) {
    uCanvas.className = '';
    uCanvas.className = 'options';
    
    ucxt.drawImage(formImage,0,0);
    
    ucxt.font = (2*TILESIZE) + 'px Verdana';
    ucxt.fillText('MyFirstRpg !', (COLTILECOUNT*TILESIZE)/2 - 5*TILESIZE, 5*TILESIZE, 10*TILESIZE);
    ucxt.fillRect((COLTILECOUNT*TILESIZE)/2 - 5*TILESIZE, 5*TILESIZE + 10 , 10*TILESIZE, 5);

    ucxt.font = TILESIZE + 'px Verdana';
    ucxt.fillText('Abandonner partie', (COLTILECOUNT*TILESIZE)/2 - 3*TILESIZE, (ROWTILECOUNT*TILESIZE)/2 - 2*TILESIZE, 6*TILESIZE);
    ucxt.fillText('Sauvegarder partie', (COLTILECOUNT*TILESIZE)/2 - 3*TILESIZE, (ROWTILECOUNT*TILESIZE)/2, 6*TILESIZE);
    ucxt.fillText('Charger partie', (COLTILECOUNT*TILESIZE)/2 - 3*TILESIZE, (ROWTILECOUNT*TILESIZE)/2 + 2*TILESIZE, 6*TILESIZE);
    
    var optScreen = {
        handleEvent: function(e) {
            var dim = getDim();
            var posX = (e.clientX - dim[2]) * dim[0];
            var posY = (e.clientY - dim[3]) * dim[1]; 

            if( posX >= (COLTILECOUNT*TILESIZE)/2 - 3*TILESIZE && posX <= (COLTILECOUNT*TILESIZE)/2 + 3*TILESIZE &&
                posY >= (ROWTILECOUNT*TILESIZE)/2 - 3*TILESIZE && posY <= (ROWTILECOUNT*TILESIZE)/2 - 2*TILESIZE) {

                if(confirm('Voulez-vous revenir à l\'écran d\'accueil ?\n(les données non sauvegardées seront perdues)')){
                    cleanIt(tCanvas, tcxt, 'ground');
                    cleanIt(iCanvas, icxt, 'item');
                    cleanIt(eCanvas, ecxt, 'enemies');
                    cleanIt(jCanvas, jcxt);
                    cleanIt(fCanvas, fcxt, 'fog');
                    cleanIt(uCanvas, ucxt);

                    removeEvent(uCanvas, 'click', this);
                    removeEvent(window, 'keydown', controlKeys);
                    init();   
                }
            }
            else if(posX >= (COLTILECOUNT*TILESIZE)/2 - 3*TILESIZE && posX <= (COLTILECOUNT*TILESIZE)/2 + 3*TILESIZE &&
                    posY >= (ROWTILECOUNT*TILESIZE)/2 - TILESIZE && posY <= (ROWTILECOUNT*TILESIZE)/2) {

                save(level, hero);
                alert('Sauvegarde effectuée');
                
                cleanIt(uCanvas, ucxt);
                removeEvent(uCanvas, 'click', this);
            }
            else if(posX >= (COLTILECOUNT*TILESIZE)/2 - 3*TILESIZE && posX <= (COLTILECOUNT*TILESIZE)/2 + 3*TILESIZE &&
                    posY >= (ROWTILECOUNT*TILESIZE)/2 + TILESIZE && posY <= (ROWTILECOUNT*TILESIZE)/2 + 2*TILESIZE) {

                removeEvent(uCanvas, 'click', this);
                removeEvent(window, 'keydown', controlKeys);
                loadPage(level, hero);
            }
        }
    };
    
    addEvent(uCanvas, 'click', optScreen);
}