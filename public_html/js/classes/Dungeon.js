/* 
 * Classe gérant les données des niveaux
 */
class Room {
    constructor(x = 0, y = 0, width = 0, height = 0) {
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
    };
    intersects (room) {
        return (this.x1 <= room.x2 && this.x2 >= room.x1 && this.y1 <= room.y2 && this.y2 >= room.y1)? true : false;
    }
}  

class Dungeon {
    constructor(){
        this.nbTilesPerLine = 20;
        this.carte = [];
        this.nbWall = 0;
        this.lvl = 0;
    };
    start(hero) {
        let mid = Math.floor(this.nbTilesPerLine/2)-1;
        
        this.generateMapBasics(true);
        
        //Changements spécifiques au niveau de départ
        this.carte[this.lvl][mid][0].sol.setType('ground');
        this.nbWall--;
        
        for(let i = 1 ; i < this.nbTilesPerLine-1; i++) {
            for(let j = 1; j < this.nbTilesPerLine-1; j++) {   
                this.carte[this.lvl][i][j].sol.setType('ground');
                this.nbWall--;
            }
        }
        
        this.carte[this.lvl][mid][mid].item = new Item(mid, mid, 'StairDown', 0, 0, 0, 0, '');
        this.carte[this.lvl][mid][mid].item.imgPos = [3,1];
        
        hero.pos = [mid,1];
        hero.imgPos = hero.direction.BAS; 
        this.carte[this.lvl][mid][1].hero = hero;
        
        this.carte[this.lvl][mid][2].item = new Item(mid, 2, 'test');
        
        this.cleanFog(hero.pos[0], hero.pos[1], hero.vision);
    };
    generateMapBasics(withFog = true) {
        let fog = (withFog)? 2 : 0;
        
        this.nbWall = Math.pow(this.nbTilesPerLine,2);
        this.carte[this.lvl] = [];
        
        for(let i = 0 ; i < this.nbTilesPerLine; i++) {
            this.carte[this.lvl][i] = [];
            
            for(let j = 0; j < this.nbTilesPerLine; j++) {                
                this.carte[this.lvl][i][j] = {
                    'sol': new MapTile(i, j, 'wall'),
                    'fog': fog,
                    'item': false,
                    'monstre': false,
                    'hero': false
                };
            }
        } 
    };
    generateStuff(type = 'item') {
        let count = 0;
        let nbMax = Math.floor((Math.pow(this.nbTilesPerLine,2) - this.nbWall)/4);
        let nb = Math.floor(Math.random() * nbMax + 1);  
        
        while (count < nb) {
            let x = Math.floor(Math.random() * this.nbTilesPerLine);
            let y = Math.floor(Math.random() * this.nbTilesPerLine);
            
            if(this.carte[this.lvl][x][y].sol.access && !this.carte[this.lvl][x][y].item && !this.carte[this.lvl][x][y].hero) {
                if(type === 'item') {
                   this.carte[this.lvl][x][y].item = new Item(x,y); 
                }
                else {
                    this.carte[this.lvl][x][y].monstre = new Monstre(x,y);
                    this.carte[this.lvl][x][y].sol.access = false;
                }
                count++;
            }
        }
    };
    cleanFog(x, y, visibility) {                
        for(let nbEtage = visibility; nbEtage >= 0; nbEtage--) {
            let cmp = 0;
            
            for(let i = x-nbEtage; i <= x+nbEtage; i++) {
                let y1 = y-cmp;
                let y2 = y+cmp;

                (i < x) ? cmp++ : cmp--;
            
                if(i >= 0 && i < nbTilesPerLine && y1 >= 0 && y1 < nbTilesPerLine) {
                    this.carte[this.lvl][i][y1].fog = 0;
                }
                if(i >= 0 && i < nbTilesPerLine && y2 >= 0 && y2 < nbTilesPerLine) {
                    this.carte[this.lvl][i][y2].fog = 0;
                }
            }
        } 
        
        let cmp = 0;
        for(let i = x-visibility-1; i <= x+visibility+1; i++){		
            let y1 = y - cmp;
            let y2 = y + cmp;
        
            (i < x) ? cmp++ : cmp--;
        
            if(i >= 0 && i < nbTilesPerLine && y1 >= 0 && y1 < nbTilesPerLine) {
                this.carte[this.lvl][i][y1].fog = 1;
            }

            if(i >= 0 && i < nbTilesPerLine && y2 >= 0 && y2 < nbTilesPerLine) {
                this.carte[this.lvl][i][y2].fog = 1;
            }        
        }
    };
    checkAccess(x,y) {
        return new Promise((resolve, reject) => {
            if(this.carte[this.lvl][x][y].sol.access) {
                resolve();
            }
            else if(this.carte[this.lvl][x][y].sol.typeSol === 'wall') {
                reject('wall');
            }
            else {
                reject('fight');
            }
        });
    };
    checkItem(x,y) {
        if(this.carte[this.lvl][x][y].item){
            if(this.carte[this.lvl][x][y].item.nom === 'StairDown') {
                this.lvl += (confirm('On descend ?'))? 1 : 0;
                this.goToLvl();
            }
            else if(this.carte[this.lvl][x][y].item.nom === 'StairUp') {
                this.lvl -= (confirm('On monte ?'))? 1 : 0;
                this.goToLvl();
            }
            else {
                this.carte[this.lvl][x][y].hero.rangerObjet(this.carte[this.lvl][x][y].item)
                    .then((itemName) => {
                        info.addText('Vous prenez ' + itemName, 'green');
                        this.carte[this.lvl][x][y].item = 0;
                    })
                    .catch(() => {
                        info.addText('Inventaire plein !', 'red');
                    });
            }
        }
    };
    goToLvl() {
        if(!this.carte[this.lvl]) {
            this.generateMapBasics(true);
            this.generateLevel();
        }
    };
    random(min = 0, max = 1, int = true) {
        return (int)?  Math.floor(Math.random() * (max - min + 1)) + min : Math.random() * (max - min) + min;
    };
    generateLevel() {
        let rooms = [];
        let minRoomSize = 2;
        let maxRoomSize = 5;
        let nbRoom = this.random(2, Math.floor(this.nbTilesPerLine-1/maxRoomSize));
        
        for(let i = 0; i <= nbRoom; i++) {
            let w = this.random(minRoomSize, maxRoomSize);
            let h = this.random(minRoomSize, maxRoomSize);
            let x = this.random(1, this.carte[this.lvl].length-w-2);
            let y = this.random(1, this.carte[this.lvl].length-h-2);
            
            let newRoom = new Room(x, y, w, h);
            
            let overlappingRooms = false;
            
            for (let existingRoom of rooms) {
                overlappingRooms = newRoom.intersects(existingRoom);
                if(overlappingRooms){
                    break;
                }
            }
            
            if (!overlappingRooms) {
                this.createRoom(newRoom.x1, newRoom.y1, newRoom.x2, newRoom.y2);

                if(rooms.length !== 0) {
                    let prevCenter = rooms[rooms.length-1].mid;
                    this.createCorridor(prevCenter, newRoom.mid);
                }

                rooms.push(newRoom);
            }
        }
    };
    createRoom(x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
        for(let i = x1; i <= x2; i++) {
            for(let j = y1; j <= y2; j++) { 
                this.carte[this.lvl][i][j].sol.setType('ground');
            }
        }    
    };
    createCorridor(centerPrev, centerNew) {

        if(this.random(0,1)) {
            let midPoint = [centerPrev[0], centerNew[1]];
            
            this.vMove(midPoint, centerPrev);
            this.hMove(midPoint, centerNew);
        }
        else {
            let midPoint = [centerNew[0], centerPrev[1]];
            
            this.vMove(midPoint, centerNew);
            this.hMove(midPoint, centerPrev);     
        }
    };
    vMove(aCoord, bCoord) {
        let i = (aCoord[1] <= bCoord[1])? aCoord[1] : bCoord[1];
        let j = (aCoord[1] <= bCoord[1])? bCoord[1] : aCoord[1];

        for(i; i <= j; i++) {
            this.carte[this.lvl][aCoord[0]][i].sol.setType('ground');
        }    
    };
    hMove(aCoord, bCoord) {
        let i = (aCoord[0] <= bCoord[0])? aCoord[0] : bCoord[0];
        let j = (aCoord[0] <= bCoord[0])? bCoord[0] : aCoord[0];

        for(i; i <= j; i++) {
            this.carte[this.lvl][i][aCoord[1]].sol.setType('ground');
        }   
    }
}