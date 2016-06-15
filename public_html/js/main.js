$(function(){
    setCanvasSize();
   
    //ajuste la scène si l'écran change de taille
    window.addEventListener('resize', function() {
        setCanvasSize();
    });

    $('canvas').hide();
    $('#map').show();
    startGame();
});

/*
 * Détermine la largeur et hauteur du canvas en fonction de la taille de l'écran
 */
function setCanvasSize() {
    var canvasSize = Math.min(window.innerWidth, window.innerHeight);

    $('canvas').prop({ width: canvasSize, height: canvasSize });
    
    tileSizeOnScreen = Math.floor(canvasSize*5/100);
    sizeOfCanvas = canvasSize;
}

/*
 * Ecran d'accueil du jeu
 */
function startGame() {
    var start = document.getElementById('map');
    var startContext = start.getContext('2d');

//    var background = new Image();
//    background.src = 'img/scroll.png';
//    startContext.drawImage(background, 0, 0, background.width, background.height, 0, 0, sizeOfCanvas, sizeOfCanvas);
    
    groundImg.onload = function() {
        for(var i = 0; i < sizeOfCanvas/tileSizeOnScreen; i++) {
            for(var j = 0; j < sizeOfCanvas/tileSizeOnScreen; j++) {
                var test = new MapTile(i, j);
                test.setType();
                test.draw(startContext, groundImg);
            }
        }
    }
}