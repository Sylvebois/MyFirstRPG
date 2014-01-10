var hero = [0, 1, 2, 3, 4, 5];
var heroVis = 2;                 //Champs de vision du hero
var posHero = startingPoint();

var heroesNumTiles = 3;     // Nombre de tile sur une ligne de notre image
var heroesImage = new Image();
heroesImage.src = 'images/hero.png';
heroesImage.onload = drawHero(posHero, hero[5]);


window.addEventListener('keydown', function(e) {    
    jcxt.clearRect(0, 0, jCanvas.width, jCanvas.height);
    
    //Gestion des mouvements du hero
    switch(e.keyCode) {
        case 37:            //left
            if(posHero[0] > 0 && ground[posHero[1]][posHero[0]-1] !== 130) {
                posHero[0] -= 1;
            }
            drawHero(posHero, hero[3]);
            delFog(posHero, heroVis);
            break;
        case 38:            //up
            if(posHero[1] > 0 && ground[posHero[1]-1][posHero[0]] !== 130) {
                posHero[1] -= 1;
            }
            drawHero(posHero, hero[2]);
            delFog(posHero, heroVis);
            break;
        case 39:            //right
            if(posHero[0] < COLTILECOUNT-1 && ground[posHero[1]][posHero[0]+1] !== 130) {
                posHero[0] += 1;
            }
            drawHero(posHero, hero[0]);
            delFog(posHero, heroVis);
            break;
        case 40:            //down
            if(posHero[1] < ROWTILECOUNT-1 && ground[posHero[1]+1][posHero[0]] !== 130) {
                posHero[1] += 1;
            }
            drawHero(posHero, hero[5]);
            delFog(posHero, heroVis);
            break;
        default:
            drawHero(posHero, hero[5]);
            break;
            
    }
});

//place le hero en fonction de la map
function startingPoint() {
    var start = [0,0];
    
    do {
        start[0] = rand(0, COLTILECOUNT-1, 1);
        start[1] = rand(0, ROWTILECOUNT-1, 1);   
    } 
    while(ground[start[1]][start[0]] === 130);
    
    return start;
}

function drawHero(posHero, imgHero) {
    var tileRow = (imgHero / heroesNumTiles) | 0;  //Bitewise OR operation = Math.floor en plus rapide
    var tileCol = (imgHero % heroesNumTiles) | 0;  //Permet de localiser le tile sur notre image par ex. on veut la 10 --> math.floor(10/16) = 0 et math.floor(10%16) = 10
    jcxt.drawImage(heroesImage, (tileCol*TILESIZE), (tileRow*TILESIZE), TILESIZE, TILESIZE, (posHero[0]*TILESIZE), (posHero[1]*TILESIZE), TILESIZE, TILESIZE);
}
