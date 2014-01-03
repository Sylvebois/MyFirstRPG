//on rempli le sol avec des tile par défaut
var ground = [
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130]
];

placeRoom();

var imageNumTiles = 16;       // Nombre de tile sur une ligne de notre image
var tilesetImage = new Image();
tilesetImage.src = 'images/tileset.png';
tilesetImage.onload = drawDungeon();


function Room(x, y, width, height) {
    //coordonnées de départ et d'arrivée de la pièce
    this.x1 = x;       
    this.y1 = y;
    this.x2 = x + width;
    this.y2 = y + height;
    
    //largeur et hauteur de la pièce
    this.w = width;        
    this.h = height; 
    
    //milieu de la pièce
    this.mid = [Math.floor((this.x1 + this.x2)/2), Math.floor((this.y1 + this.y2)/2)];
    
    //Vérifie si des pièces se chevauchent
    this.intersects = function(room) {
        if(Room.x1 <= room.x2 && Room.x2 >= room.x1 && Room.y1 <= room.y2 && room.y2 >= room.y1) {
            return true;
        } else {
            return false;
        }
     };
}
 
function placeRoom() {
    var rooms = new Array();        //Tableau pour stocker les pièces
    var newCenter = new Array();    //Variable pour tester le centre des pièces
    var minRoomSize = 2;
    var maxRoomSize = 5;
    var nbRoom = rand(2,6,1);      //Nombre alÃ©atoire de pièces par niveau
     
    //créer x pièces de taille aléatoire
    for(var i = 0; i <= nbRoom; i++) {
        var w = rand(minRoomSize, maxRoomSize, 1);
        var h = rand(minRoomSize, maxRoomSize, 1);
        var x = rand(0, COLTILECOUNT-w-1, 1);
        var y = rand(0, ROWTILECOUNT-h-1, 1);
        
        var newRoom = new Room(x, y, w, h);
        
        //Test si deux piéces s'entrecoupe
        var failed = false;
        for (otherRoom in rooms) {
            failed = newRoom.intersects(otherRoom);
            if(failed) {
                break;
            }
        }
        if (!failed) {
            createRoom(newRoom.x1, newRoom.x2, newRoom.y1, newRoom.y2);
            var newCenter = newRoom.mid;
            
            if(rooms.length !== 0) {
                var prevCenter = rooms[rooms.length-1].mid;
                createCorridor(prevCenter, newCenter);
            }
            
            rooms.push(newRoom);
        }
    }
}

function createCorridor(oldCoord, newCoord) {
    var midPoint = [];
    
    //Commence aléatoirement par la verticale ou l'horizontale
    if(rand(0,1,1)) {
        midPoint = [newCoord[0], oldCoord[1]];
        
        //Etape 1 : déplacement horizontal
        if(oldCoord[0] <= newCoord[0]) {
            for(var i = oldCoord[0]; i <= newCoord[0]; i++) {
                ground[oldCoord[1]][i] = 199;
            }   
        } else {
            for(var i = oldCoord[0]; i >= newCoord[0]; i--) {
                ground[oldCoord[1]][i] = 199;
            }        
        }
        
        //Etape 2 : déplacement vertical
        if(midPoint[1] <= newCoord[1]) {
            for(var i = midPoint[1]; i <= newCoord[1]; i++) {
                ground[i][midPoint[0]] = 199;
            }   
        } else {
            for(var i = midPoint[1]; i >= newCoord[1]; i--) {
                ground[i][midPoint[0]] = 199;
            }         
        }
    } else {
        midPoint = [oldCoord[0], newCoord[1]];
        
        //Etape 1 : déplacement vertical
        if(oldCoord[1] <= newCoord[1]) {
            for(var i = oldCoord[1]; i <= newCoord[1]; i++) {
                ground[i][oldCoord[0]] = 199;
            }   
        } else {
            for(var i = oldCoord[1]; i >= newCoord[1]; i--) {
                ground[i][oldCoord[0]] = 199;
            }         
        }
        //Etape 2 : déplacement horizontal
        if(midPoint[0] <= newCoord[0]) {
            for(var i = midPoint[0]; i <= newCoord[0]; i++) {
                ground[midPoint[1]][i] = 199;
            }   
        } else {
            for(var i = midPoint[0]; i >= newCoord[0]; i--) {
                ground[midPoint[1]][i] = 199;
            }        
        }
    }
}
function createRoom(x1, x2, y1, y2) {
    for(var i = x1; i <= x2; i++) {
        for(var j = y1; j <= y2; j++) { 
            ground[j][i] = 199;
        }
    }
}

function drawDungeon() {
    for (var r = 0; r < ROWTILECOUNT; r++) {         //Sur chaque ligne
        for (var c = 0; c < COLTILECOUNT; c++) {      //on passe sur chaque colonne

           var tile = ground[ r ][ c ];
           var tileRow = (tile / imageNumTiles) | 0;  //Bitewise OR operation = Math.floor en plus rapide
           var tileCol = (tile % imageNumTiles) | 0;  //Permet de localiser le tile sur notre image par ex. on veut la n°10 --> math.floor(10/16) = 0 et math.floor(10%16) = 10
           tcxt.drawImage(tilesetImage, (tileCol*TILESIZE), (tileRow*TILESIZE), TILESIZE, TILESIZE, (c*TILESIZE), (r*TILESIZE), TILESIZE, TILESIZE);
/*
           tile = layer1[ r ][ c ];
           tileRow = (tile / imageNumTiles) | 0;  //Bitewise OR operation = Math.floor en plus rapide
           tileCol = (tile % imageNumTiles) | 0;  // Permet de localiser le tile sur notre image par ex. on veut la nÂ°10 --> math.floor(10/16) = 0 et math.floor(10%16) = 10
           tcxt.drawImage(tilesetImage, (tileCol*TILESIZE), (tileRow*TILESIZE), TILESIZE, TILESIZE, (c*TILESIZE), (r*TILESIZE), TILESIZE, TILESIZE);
*/
        }
    }
}
