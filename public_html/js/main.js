$(document).ready(function(){
    //ajuste la scène si l'écran change de taille
    window.addEventListener('resize', function() {
        setCanvasSize();
        (mapTab.length > 0)? drawWholeMap() : accueil();
    });
    
    setCanvasSize();
    accueil();
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
    UiContext.drawImage(mainImg, 0, 0, mainImg.width, mainImg.height, 0, 0, sizeOfCanvas, sizeOfCanvas);
    //move(0,0);
    
    $('#ui').click(function(e){
        $('#ui').hide(1000); 
        startGame();
    });
    
    
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
$(window).keydown(function(e){
        console.log(e.which);
        switch(e.which){
            case 73:
                alert('Fenêtre d\'inventaire');
                UiContext.drawImage(mainImg, 0, 0, mainImg.width, mainImg.height, 0, 0, sizeOfCanvas, sizeOfCanvas);
                $('#ui').show(1000);
                break;
            case 79:
                alert('Fenêtre d\'options');
                UiContext.drawImage(mainImg, 0, 0, mainImg.width, mainImg.height, 0, 0, sizeOfCanvas, sizeOfCanvas);
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
                    UiContext.clearRect(0, 0, sizeOfCanvas, sizeOfCanvas);    
                });
                break;
            default:
                break;
        }
        //move(0,0);
    });   
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