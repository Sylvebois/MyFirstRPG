/*
 * Classes managing the data of the levels
 */
class Room {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        //Starting and ending coordinates of the room
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y + height;

        //Width and height of the room
        this.w = width;
        this.h = height;

        //middle of the room
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

        this.hero = new Hero();
    };
    start() {
        let mid = Math.floor(this.nbTilesPerLine/2)-1;

        this.generateMapBasics(true);

        //Specific changes to starting level
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

        this.hero.pos = [mid,1];
        this.hero.imgPos = this.hero.direction.BAS;
        this.carte[this.lvl][mid][1].hero = this.hero;

        this.carte[this.lvl][mid][2].item = new Item(mid, 2, 'test');

        this.cleanFog(this.hero.pos[0], this.hero.pos[1], this.hero.vision);
    };
    midWay() {
        this.generateMapBasics(true);
        let mid = Math.floor(this.nbTilesPerLine/2);

        //Room creation
        for(let i = 1; i < this.nbTilesPerLine-1; i++) {
            for (let j = 1; j < 5; j++) {
                if((i > 0 && i < 5) || (i > this.nbTilesPerLine-6 && i < this.nbTilesPerLine-1)) {
                    this.carte[this.lvl][i][j].sol.setType('ground');
                    this.carte[this.lvl][i][this.nbTilesPerLine-j-1].sol.setType('ground');
                }
            }
        }
        for(let i = mid-3; i < mid+3; i++) {
            for(let j = mid-3; j < mid+3; j++) {
               this.carte[this.lvl][i][j].sol.setType('ground');
            }
        }

        //Adding corridors
        for(let i = 4; i < this.nbTilesPerLine-4; i++) {
            this.carte[this.lvl][i][2].sol.setType('ground');
            this.carte[this.lvl][i][this.nbTilesPerLine-3].sol.setType('ground');
        }
        for(let i = 4; i < this.nbTilesPerLine-4; i++) {
            this.carte[this.lvl][2][i].sol.setType('ground');
            this.carte[this.lvl][this.nbTilesPerLine-3][i].sol.setType('ground');
        }

        this.countFloorTiles();

        //Adding stairs
        this.carte[this.lvl][1][1].item = new Item(1, 1, 'StairUp', 0, 0, 0, 0, '');
        this.carte[this.lvl][1][1].item.imgPos = [4,1];

        this.carte[this.lvl][this.nbTilesPerLine-2][this.nbTilesPerLine-2].item = new Item(this.nbTilesPerLine-2, this.nbTilesPerLine-2, 'StairDown', 0, 0, 0, 0, '');
        this.carte[this.lvl][this.nbTilesPerLine-2][this.nbTilesPerLine-2].item.imgPos = [4,1];

        //Positionning Hero
        this.hero.pos = [1,1];
        this.carte[this.lvl][1][1].hero = this.hero;

        info.addText('Hum ... Ce niveau vous paraît étrange ...', 'yellow');
    };
    final(){
        let mid = Math.floor(this.nbTilesPerLine/2)-1;

        this.generateMapBasics(false);

        //Room creation
        for(let i = 1 ; i < this.nbTilesPerLine-1; i++) {
            for(let j = 1; j < this.nbTilesPerLine-1; j++) {
                if( (i < 4 || (i >= 6 && i < 14) || i >= 16) ||
                    (j < 4 || (j >= 6 && j < 9) || (j >= 11 && j < 14) || j >= 16)) {
                    this.carte[this.lvl][i][j].sol.setType('ground');
                }
            }
        }

        this.countFloorTiles();

        //Adding stair
        this.carte[this.lvl][mid][this.nbTilesPerLine-2].item = new Item(mid, this.nbTilesPerLine-2, 'StairUp', 0, 0, 0, 0, '');
        this.carte[this.lvl][mid][this.nbTilesPerLine-2].item.imgPos = [4,1];

        //Positionning Hero
        this.hero.pos = [mid, this.nbTilesPerLine-2];
        this.carte[this.lvl][mid][this.nbTilesPerLine-2].hero = this.hero;
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
        let nb = this.random(0, nbMax);

        while (count < nb) {
            let x = this.random(1, this.nbTilesPerLine-1);
            let y = this.random(1, this.nbTilesPerLine-1);

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
                this.hero.rangerObjet(this.carte[this.lvl][x][y].item)
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
        if(this.lvl === 4 && !this.carte[this.lvl]) {
            this.midWay();
        }
        else if(this.lvl === 4 && !this.carte[this.lvl]) {
            this.final();
        }
        else if(!this.carte[this.lvl]) {
            this.generateMapBasics(true);
            this.generateLevel(this.hero.pos);

            this.carte[this.lvl][this.hero.pos[0]][this.hero.pos[1]].hero = this.hero;
        }
        else {
            let x, y;

            for(let i = 0; i < this.nbTilesPerLine; i++) {
                x = i;
                y = this.carte[this.lvl][i].indexOf(this.carte[this.lvl][i].find(liste => liste.hero !== false));

                if(y > -1) {
                    break;
                }
            }
            this.hero.pos = [x,y];
        }
    };
    random(min = 0, max = 1, int = true) {
        return (int)?  Math.floor(Math.random() * (max - min + 1)) + min : Math.random() * (max - min) + min;
    };
    generateLevel(stairPos) {
        //Step 1 : generate rooms and corridors
        let rooms = [new Room(stairPos[0], stairPos[1], 1, 1)];
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

        //Step 2 : generate stair up and down
        this.carte[this.lvl][stairPos[0]][stairPos[1]].item = new Item(stairPos[0], stairPos[1], 'StairUp', 0, 0, 0, 0, '');
        this.carte[this.lvl][stairPos[0]][stairPos[1]].item.imgPos = [4,1];

        let index = this.random(1, rooms.length-1);
        let stairX = this.random(rooms[index].x1, rooms[index].x2);
        let stairY = this.random(rooms[index].y1, rooms[index].y2);

        this.carte[this.lvl][stairX][stairY].item = new Item(stairX, stairY, 'StairDown', 0, 0, 0, 0, '');
        this.carte[this.lvl][stairX][stairY].item.imgPos = [3,1];

        //Step 3 : generate items and monsters
        this.countFloorTiles();
        this.generateStuff('item');
        this.generateStuff('monstre');
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
    countFloorTiles() {
        let tmp = 0;

        for(let i = 0; i < this.nbTilesPerLine; i++) {
            for(let j = 0; j < this.nbTilesPerLine; j++) {
                tmp += (this.carte[this.lvl][i][j].sol.typeSol === 'ground')? 1 : 0;
            }
        }

        this.nbWall -= tmp;
    }
}