/* 
 * Affiche et permet de gérer l'inventaire du héros
 */

var invImage = new Image();
invImage.src = 'images/inv.png';

function showInv(joueur, imgItems, numItems){
    var cmp = 0;
    var xCoteGauche = (TILESIZE*COLTILECOUNT)/4;
    
    uCanvas.className = '';

    ucxt.drawImage(invImage, 0, 0, invImage.width, invImage.height, xCoteGauche, TILESIZE, (TILESIZE*COLTILECOUNT)/2, (TILESIZE*ROWTILECOUNT)-(2*TILESIZE));
    
    //Dessine les armes dans les slots d'équipement
    for(valeur in joueur.equip) {
        if(joueur.equip[valeur]) {
            var tileRow = (joueur.equip[valeur].quelType / numItems) | 0;
            var tileCol = (joueur.equip[valeur].quelType % numItems) | 0;
            ucxt.drawImage(imgItems, (tileCol*TILESIZE), (tileRow*TILESIZE), TILESIZE, TILESIZE, joueur.equip[valeur].startX , joueur.equip[valeur].startY, 2*TILESIZE, 2*TILESIZE);                      
        }
    }
    
    //Dessine les slots de l'inventaire
    for(var j = 4*TILESIZE; j < (TILESIZE*ROWTILECOUNT)/2; j += 2*TILESIZE) {
        for(var i = TILESIZE; i < (TILESIZE*COLTILECOUNT)/2 - TILESIZE; i += 2*TILESIZE) {
            if(cmp >= 10) {
                break;   
            }
            else{              
                ucxt.strokeRect(xCoteGauche + i, (TILESIZE*ROWTILECOUNT)/2 + j, 2*TILESIZE, 2*TILESIZE);
                
                if(joueur.inv[cmp]){
                    var tileRow = (joueur.inv[cmp].quelType / numItems) | 0;
                    var tileCol = (joueur.inv[cmp].quelType % numItems) | 0;
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
}

function hideInv() {
    uCanvas.className = 'hidden'; 
    ucxt.clearRect(0, 0, TILESIZE*COLTILECOUNT, TILESIZE*ROWTILECOUNT);
}

//Gestion du drag'n'drop pour équiper les items
function equipIt (joueur, imgItems, numItems) {    
    var storage = {};
    storage.artefact = 0;
    storage.origin = '';
    storage.dragging = false;
    
    addEvent(uCanvas, 'mousedown', function(e) {
        var dim = getDim();
        var posX = (e.clientX - dim[2]) * dim[0];
        var posY = (e.clientY - dim[3]) * dim[1]; 
        
        document.getElementById('test').innerHTML = 'dim[0] = ' + dim[0] + ' - dim[1] = ' + dim[1] + ' - dim[2] = ' + dim[2] + ' - dim[3] = ' + dim[3];
        
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
        for (valeur in joueur.equip) {
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
        
        var vide = true;
        
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
            if( posX > zoneInv['sx1'] && posX < zoneInv['ex1'] && posY > zoneInv['sy1'] && posY < zoneInv['ey1'] ||
                posX > zoneInv['sx2'] && posX < zoneInv['ex2'] && posY > zoneInv['sy2'] && posY < zoneInv['ey2']) {
            
                if(!takeIt(storage.artefact, joueur)) {
                    alert('Plus de place dans l\'inventaire, action annulée');
                    joueur.equip[storage.origin] = storage.artefact;
                }
                                
                vide = false;
            }  
            
            //Si on lache l'objet dans un slot d'équipement
            for(valeur in joueur.equip) {
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
                    vide = false;
                }
            }
            
            //Si on lache l'objet n'importe où ailleurs
            if(vide) {
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

//Récupère les infos de dimensions pour la gestion de l'inventaire
function getDim() {
    var wrapper = document.getElementsByClassName('wrapper')[0];
    var container = document.getElementsByClassName('container')[0];
    var canvasContainer = document.getElementsByClassName('canvas-container')[0];
    
    var coefWidth = 1024/canvasContainer.offsetWidth;
    var coefHeight = 645/canvasContainer.offsetHeight;
    
    var totalOffsetX = canvasContainer.offsetLeft + container.offsetLeft + wrapper.offsetLeft;
    var totalOffsetY = canvasContainer.offsetTop + container.offsetTop + wrapper.offsetTop;
    
    var result = [coefWidth, coefHeight, totalOffsetX, totalOffsetY];
    
    return result;
}

