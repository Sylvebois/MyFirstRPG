/* 
 * Une serie de fonctions utilisables dans differents fichiers (non spécifique au heros, au sol, aux monstres ...)
 */

//Récupere les infos de dimensions pour localiser la souris et les items
function getDim() {
    var wrapper = document.getElementsByClassName('wrapper')[0];
    var container = document.getElementsByClassName('container')[0];
    var canvasContainer = document.getElementsByClassName('canvas-container')[0];
    
    var coefWidth = (canvasContainer.offsetWidth > 0)? 1024/canvasContainer.offsetWidth : 1;
    var coefHeight = (canvasContainer.offsetHeight > 0)? 645/canvasContainer.offsetHeight : 1;
    
    var totalOffsetX = canvasContainer.offsetLeft + container.offsetLeft + wrapper.offsetLeft;
    var totalOffsetY = canvasContainer.offsetTop + container.offsetTop + wrapper.offsetTop;
    
    var result = [coefWidth, coefHeight, totalOffsetX, totalOffsetY];
    
    return result;
}

//Assure une comptabilité avec IE pour la gestion des evenements
function addEvent(element, event, func) {
    if (element.attachEvent) {
        element.attachEvent('on' + event, func);
    } else {
        element.addEventListener(event, func, true);
    }
}

function removeEvent(element, event, func) {
    if (element.detachEvent) {
        element.detachEvent('on' + event, func);
    } else {
        element.removeEventListener(event, func, true);
    }
}

//Genere un nombre aleatoire entre min-max et precise si ça doit etre un entier
function rand(min, max, integer) {
   if (!integer) {
       return Math.random() * (max - min) + min;
   } else {
       return Math.floor(Math.random() * (max - min + 1) + min);
   }
}

//Calcul et renvoi le nombre de monstres et d'items à placer en fonction de la difficulté du niveau et du nombre de cases utilisables
function nbToGenerate(tabFree, difficulty) {
    var hard = 1;
    var cmp = 0; 
    
    switch(difficulty) {
        case 'easy' :
            hard = 1.5;
            break;
        case 'normal' :
            hard = 1;
            break;
        case 'hard' :
            hard = 0.5;
            break;
        case 'extreme' :
            hard = 0;
            break;
    }
    
    for(var i = tabFree.length-1; i >= 0; i--) {
        for(var j = tabFree[i].length-1; j >= 0; j--) {
            (tabFree[i][j] === 199) ? cmp++ : '';       //compte le nombre de cases disponibles
        }
    }
    
    return Math.ceil(rand(cmp/14, cmp/7, 1)*hard);
}

//place le heros, les ennemis et les items en fonction de la map
function placeIt() {
    var start = [0,0];
    
    do {
        start[0] = rand(0, COLTILECOUNT-1, 1);
        start[1] = rand(0, ROWTILECOUNT-1, 1);   
    } 
    while(ground[start[1]][start[0]] === 130);
    
    return start;
}

//Dessine les objets
function drawIt(cxt, img, obj, numImg, numTiles) {
    var tileRow = (numImg / numTiles) | 0;  //Bitewise OR operation = Math.floor en plus rapide
    var tileCol = (numImg % numTiles) | 0;  //Permet de localiser le tile sur notre image par ex. on veut la 10 --> math.floor(10/16) = 0 et math.floor(10%16) = 10
    cxt.drawImage(img, (tileCol*TILESIZE), (tileRow*TILESIZE), TILESIZE, TILESIZE, (obj.x*TILESIZE), (obj.y*TILESIZE), TILESIZE, TILESIZE);    
}

//Efface et masque un canvas et le tableau associe
function cleanIt(canvas, context, tabToClean) {
    var i = 0;
    var j = 0;

    canvas.className = '';
    canvas.className = 'hidden'; 
    context.clearRect(0, 0, TILESIZE*COLTILECOUNT, TILESIZE*ROWTILECOUNT);
    
    switch(tabToClean) {
        case 'ground':
            for(i = ground.length-1; i >= 0; i--){
                for(j = ground[i].length-1; j >= 0; j--){
                    ground[i][j] = 130;
                }
            }
            break;
        case 'item':
            for(i = item.length-1; i >= 0; i--){
                for(j = item[i].length-1; j >= 0; j--){
                    item[i][j] = 0;
                }
            }
            break;
        case 'enemies':
            for(i = enemies.length-1; i >= 0; i--){
                for(j = enemies[i].length-1; j >= 0; j--){
                    enemies[i][j] = 0;
                }
            }
            break;
        case 'fog':
            for(i = fog.length-1; i >= 0; i--){
                for(j = fog[i].length-1; j >= 0; j--){
                    fog[i][j] = 0;
                }
            }
            break;
        default:
            break;        
    }
}

//Donne le niveau de difficulté (génération de monstres et d'items) de l'étage
function setDifficulty() {
    var difficulty = ['easy', 'normal', 'hard', 'extreme'];
    var lvlDiff = rand(0,3,1);

    lvlDiff = (lvlDiff === 3)? rand(0,3,1) : lvlDiff;   //Fait un deuxième tour pour diminuer les chances d'un lvl extrême
    
    return difficulty[lvlDiff];
}

//Demarre le jeu : positionne et dessine les differents composants
function launch(hero, level) {
    tCanvas.className = '';
    iCanvas.className = '';
    eCanvas.className = '';
    jCanvas.className = '';
    fCanvas.className = '';
    
    var difficulty = setDifficulty();
    
    //1. Le sol
    placeRoom();
    drawDungeon();   
    
    //2. Le heros
    var posHero = placeIt();
    hero.x = posHero[0];
    hero.y = posHero[1];
    drawIt(jcxt, heroesImage, hero, hero.direction.BAS, heroesNumTiles);
    
    //3. Le brouillard
    //On met tout en noir puis on supprime ce qu'il faut ...
    fcxt.fillRect(0, 0, fCanvas.width, fCanvas.height);
    delFog(hero.x, hero.y, hero.vis);
    //4. Les items
    placeItem(hero.x, hero.y, ground, difficulty, level);
    
    //5. Les ennemis
    placeMonster(hero.x, hero.y, item, ground, difficulty);

    if(!controlKeysAdded) {
        addEvent(window, 'keydown', function(e){
            controlKeys(e, hero, level);
            controlKeysAdded = true;
        });
    }
}