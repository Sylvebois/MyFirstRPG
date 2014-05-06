
function Room(x, y, width, height) {
    //coordonnees de depart et d'arrivee de la piece
    this.x1 = x;       
    this.y1 = y;
    this.x2 = x + width;
    this.y2 = y + height;
    
    //largeur et hauteur de la piece
    this.w = width;        
    this.h = height; 
    
    //milieu de la piece
    this.mid = [Math.floor((this.x1 + this.x2)/2), Math.floor((this.y1 + this.y2)/2)];
    
    //Verifie si des pieces se chevauchent
    this.intersects = function(room) {
        if(Room.x1 <= room.x2 && Room.x2 >= room.x1 && Room.y1 <= room.y2 && room.y2 >= room.y1) {
            return true;
        } else {
            return false;
        }
     };
}
 
function placeRoom() {
    var rooms = [];        //Tableau pour stocker les pieces
    var newCenter = [];    //Variable pour tester le centre des pieces
    var minRoomSize = 2;
    var maxRoomSize = 5;
    var nbRoom = rand(2,6,1);      //Nombre aléatoire de pieces par niveau
     
    //creer x pieces de taille aleatoire
    for(var i = 0; i <= nbRoom; i++) {
        var w = rand(minRoomSize, maxRoomSize, 1);
        var h = rand(minRoomSize, maxRoomSize, 1);
        var x = rand(0, COLTILECOUNT-w-1, 1);
        var y = rand(0, ROWTILECOUNT-h-1, 1);
        
        var newRoom = new Room(x, y, w, h);
        
        //Test si deux pieces s'entrecoupe
        var failed = false;
        for (var otherRoom in rooms) {
            failed = newRoom.intersects(otherRoom);
            if(failed) {
                break;
            }
        }
        if (!failed) {
            createRoom(newRoom.x1, newRoom.x2, newRoom.y1, newRoom.y2);
            newCenter = newRoom.mid;
            
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
    var i = 0;
    
    //Commence aleatoirement par la verticale ou l'horizontale
    if(rand(0,1,1)) {
        midPoint = [newCoord[0], oldCoord[1]];
        
        //Deplacement horizontal puis vertical
        hMove(oldCoord, newCoord);
        vMove(midPoint, newCoord);
    } 
    else {
        midPoint = [oldCoord[0], newCoord[1]];
        
        //Deplacement vertical puis horizontal
        vMove(oldCoord, newCoord);
        hMove(midPoint, newCoord);
    }
}

function vMove(aCoord, bCoord) {
    var i = 0;
    
    if(aCoord[1] <= bCoord[1]) {
        for(i = aCoord[1]; i <= bCoord[1]; i++) {
            ground[i][aCoord[0]] = 199;
        }   
    } 
    else {
        for(i = aCoord[1]; i >= bCoord[1]; i--) {
            ground[i][aCoord[0]] = 199;
        }         
    }    
}

function hMove(aCoord, bCoord) {
    var i = 0;
    
    if(aCoord[0] <= bCoord[0]) {
        for(i = aCoord[0]; i <= bCoord[0]; i++) {
            ground[aCoord[1]][i] = 199;
        }   
    } 
    else {
        for(i = aCoord[0]; i >= bCoord[0]; i--) {
            ground[aCoord[1]][i] = 199;
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
           var tileRow = (tile / groundNumTiles) | 0;  //Bitewise OR operation = Math.floor en plus rapide
           var tileCol = (tile % groundNumTiles) | 0;  //Permet de localiser le tile sur notre image par ex. on veut la 10 --> math.floor(10/16) = 0 et math.floor(10%16) = 10
           
           tcxt.drawImage(groundImage, (tileCol*TILESIZE), (tileRow*TILESIZE), TILESIZE, TILESIZE, (c*TILESIZE), (r*TILESIZE), TILESIZE, TILESIZE);
        }
    }
}
