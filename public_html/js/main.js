$(document).ready(function(){
    //ajuste la scène si l'écran change de taille
    window.addEventListener('resize', function() {
        setCanvasSize();
        
        if(mapTab.length > 0){
            $('#ui').hide();
            drawWholeMap();
        }
        else {
            accueil();
        }
    });
    
    setCanvasSize();
    loading(tileSizeOnScreen*2, tileSizeOnScreen*2, tileSizeOnScreen, tileSizeOnScreen, 0, true);
});

/*
 * Détermine la largeur et hauteur du canvas en fonction de la taille de l'écran
 */
function setCanvasSize() {
    var canvasSize = Math.min(window.innerWidth, window.innerHeight);
    
    $('canvas').prop({ width: canvasSize, height: canvasSize });
    
    tileSizeOnScreen = Math.floor(canvasSize*percentOfScreen);
    sizeOfCanvas = canvasSize;
}

/*
 * @function accueil
 * Ecran d'accueil du jeu
 * @returns {undefined}
 */
function accueil() {
    uiContext.drawImage(mainImg, 0, 0, mainImg.width, mainImg.height, 0, 0, sizeOfCanvas, sizeOfCanvas);

    if(!$._data($('#ui').get(0),'events')) { //Vérifie qu'il n'y a pas déjà un event associé --> à améliorer !!!
        $('#ui').one('click', function(e){
            $('#ui').hide(1000); 
            startGame();
        });  
    }
}

/*
 * @function startGame
 * Génère la carte et place tous les éléments dans le tableau
 * @returns {undefined}
 */
function startGame() {
    for(var i = 0; i < (sizeOfCanvas/tileSizeOnScreen)-1; i++) {
        var testPerso = new Perso(i,0);
        mapTab.push([]);
        
        for(var j = 0; j < (sizeOfCanvas/tileSizeOnScreen)-1; j++) {
            var test = new MapTile(i, j);
            
            mapTab[i].push({
                'sol': test,
                'fog': 0,
                'item': 0,
                'monstre': testPerso,
                'hero': 0,
            });
        }
    }
    drawWholeMap();
    game();
}

/*
 * @function drawWholeMap
 * Dessine la carte et ses éléments (sol, murs, items, monstres, héros ...) dans le canvas
 * @returns {undefined}
 */
function drawWholeMap() {
    for(var i in mapTab) {
        for(var j in mapTab[i]) {
            mapTab[i][j].sol.draw(mapContext, groundImg);
            
            (mapTab[i][j].item !== 0)? mapTab[i][j].item.draw(mapContext, itemsImg) : null;
            (mapTab[i][j].monstre !== 0)? mapTab[i][j].monstre.draw(mapContext, monstersImg) : null;
            (mapTab[i][j].hero !== 0)? mapTab[i][j].hero.draw(mapContext, herosImg) : null;
           
            //mapTab[i][j].fog;
        }
    }
}

function game() {
    if(!$._data($(window).get(0),'events')) { //Vérifie qu'il n'y a pas déjà un event associé --> à améliorer !!!
        $(window).keydown(function(e){
            console.log(e.which);
            switch(e.which){
                case 73:
                    alert('Fenêtre d\'inventaire');
                    uiContext.drawImage(mainImg, 0, 0, mainImg.width, mainImg.height, 0, 0, sizeOfCanvas, sizeOfCanvas);
                    $('#ui').show(1000);
                    break;
                case 79:
                    alert('Fenêtre d\'options');
                    uiContext.drawImage(mainImg, 0, 0, mainImg.width, mainImg.height, 0, 0, sizeOfCanvas, sizeOfCanvas);
                    $('#ui').show(1000);
                    break;
                case 37:
                    alert('A gauche');
                    break;
                case 38:
                    alert('En haut');
                    break;
                case 39:
                    alert('A droite');
                    break;
                case 40:
                    alert('En bas');
                    break;
                case 27:
                    $('#ui').hide(1000, function(){
                        uiContext.clearRect(0, 0, sizeOfCanvas, sizeOfCanvas);    
                    });
                    break;
                default:
                    break;
            }
            //move(0,0);
        });   
    }
}

/*
 * @function loading
 * Animation pour le chargement et affichage du nom du "studio"
 * @param {int} x - position en abscisse de l'image
 * @param {int} y - position en ordonnée de l'image
 * @param {int} width - largeur de l'image
 * @param {int} height - hauteur de l'image
 * @param {int} degrees - nombre de degré pour la rotation
 * @param {bool} direction - sens de déplacement
 */
function loading(x, y, width, height, degrees, direction) {
    var finisedToLoad = checkLoaded();
    
    uiContext.clearRect(0, 0, sizeOfCanvas, sizeOfCanvas);

    if(!finisedToLoad[0]) {
        drawRotatedRect(x, y, width, height, degrees, 'red', true);
        drawRotatedRect(x, y, width, height, degrees, 'blue', false);
        
        uiContext.font = tileSizeOnScreen+'px enchanted_landregular';
        uiContext.fillStyle = 'black';
        uiContext.textAlign = 'center';
        uiContext.fillText('Loading ' + finisedToLoad[1] + '...', sizeOfCanvas/2, sizeOfCanvas/2);

        degrees++;

        if(x > sizeOfCanvas-width && direction === true) {
            x--;
            direction = false;
        }
        else if (x < width && direction === false) {
            x++;
            direction = true;
        }
        else {
            x = (direction)? x + 1 :x - 1;
        }

        var loopTimer = setTimeout('loading(' + x + ',' + y + ',' + width + ',' + height + ',' + degrees + ',' + direction + ')',1000/60);
    }
    else {
        //lightTransition(1);
        
        uiContext.clearRect(0, 0, sizeOfCanvas, sizeOfCanvas);

        uiContext.drawImage(pioche, (sizeOfCanvas-3*width)/2, y*2, width*3, height*3);
        uiContext.drawImage(plume, (sizeOfCanvas-3*width)/2-10, y*2, width*3, height*3);

        uiContext.font = 2*tileSizeOnScreen + 'px enchanted_landregular';
        uiContext.fillStyle = 'black';
        uiContext.textAlign = 'center';
        uiContext.fillText('Feather and Pick Studio', sizeOfCanvas/2, sizeOfCanvas/2);

        $('#ui').one('click', function(e){
            accueil();
        });
    }
}

/*
 * @function drawRotatedRect
 * Affichage et rotation des rectangles / images
 * @param {int} x - position en abscisse de l'image
 * @param {int} y - position en ordonnée de l'image
 * @param {int} width - largeur de l'image
 * @param {int} height - hauteur de l'image
 * @param {int} degrees - nombre de degré pour la rotation
 * @param {string} color - couleur du rectangle
 * @param {bool} first - détermine le sens de rotation et point départ
 */
function drawRotatedRect(x, y, width, height, degrees, color, first) {
    uiContext.save();

    uiContext.beginPath();
    
    // move the rotation point to the center of the rect and rotate
    // then draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    //       so the rect needs to be offset accordingly when drawn
    if(first) {
        uiContext.translate(x + width / 2, y + height / 2);
        uiContext.rotate(degrees * Math.PI / 180);
        uiContext.drawImage(pioche, -width / 2, -height / 2, width, height);
    }
    else {
        uiContext.translate(sizeOfCanvas - x - width / 2, y + height / 2);
        uiContext.rotate(degrees * Math.PI / 180);
        uiContext.drawImage(plume, -width / 2, -height / 2, width, height);
    }

    uiContext.fillStyle = color;
    uiContext.fill();

    uiContext.restore();
}

/*
 * @function lightTransition
 * Animation / transition entre le chargement et la page du studio
 */
function lightTransition(r) {
    var grd=uiContext.createRadialGradient(sizeOfCanvas/2, sizeOfCanvas/2, r/3, sizeOfCanvas/2, sizeOfCanvas/2, r);
    grd.addColorStop(0, "rgba(255, 255, 255, 0.5)");
    grd.addColorStop(1, "rgba(255, 255, 255, 0)");
    
    uiContext.fillStyle = grd;
    
    uiContext.beginPath();
    uiContext.arc(sizeOfCanvas/2, sizeOfCanvas/2, r, 0, 2 * Math.PI);
    uiContext.fill();
    
    if(r < sizeOfCanvas/2) {
        r++;
        var loop = setTimeout('lightTransition(' + r + ')', 0.5);
    }
    else {
        uiContext.clearRect(0, 0, sizeOfCanvas, sizeOfCanvas);
        return 0;
    }
}

/*
 * @function checkLoaded
 * Vérifie que les images et les polices sont chargées
 */
function checkLoaded() {
    if(!plume.complete || !pioche.complete || !mainImg.complete || !groundImg.complete || 
        !herosImg.complete || !itemsImg.complete || !monstersImg.complete || !invImg.complete) {
        
        return [false, 'images'];
    }
    else if(!document.fonts.check(tileSizeOnScreen+'px enchanted_landregular')){
        return [false, 'fonts'];
    }
    else {
        return [true,''];
    }
}

//Test de déplacement et de rafraichissement du canvas
function move(x, y) {
    if(y > mapTab[0].length-2) {
        y = 0;
        x++;
    }
    if(x > mapTab.length-1) {
        return 0;
    }
    
    var start = document.getElementById('map');
    var startContext = start.getContext('2d');
    
    var tmp = mapTab[x][y].monstre;
    tmp.setPos(x,y+1);

    mapTab[x][y].monstre = 0;
    mapTab[x][y].sol.draw(startContext, groundImg);

    mapTab[x][y+1].monstre = tmp;
    mapTab[x][y+1].monstre.draw(startContext, monstersImg);
    
    y++;
 
    //var loopTimer = setTimeout('move('+x+','+y+')',90);
}