
class Tile {
    constructor(x, y, type = 'wall', fogLvl = 2) {
        this.posX = parseInt(x);
        this.posY = parseInt(y);
        this.type = type;
        this.fogLvl = fogLvl;
        this.content = { hero: false, monster: false, artefact: false };
    }
}

class Room {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.startX = x;
        this.startY = y;
        this.endX = x + width;
        this.endY = y + height;
        this.w = width;
        this.h = height;
        this.mid = {
            x: Math.floor((this.startX + this.endX) / 2),
            y: Math.floor((this.startY + this.endY) / 2)
        };
    }

    intersects(room) {
        return (
            this.startX <= room.endX && this.endX >= room.startX &&
            this.startY <= room.endY && this.endY >= room.startY
        ) ? true : false;
    }
}

export class DungeonManager {
    constructor(mapSize) {
        this.mapSize = mapSize;
        this.nbWall = 0;
    }

    random(min = 0, max = 1, int = true) {
        return (int) ?
            Math.floor(Math.random() * (max - min + 1)) + min :
            Math.random() * (max - min) + min;
    }

    generateFirstLvl(hero) {
        const middle = {
            x: Math.floor((this.mapSize[0] - 1) / 2),
            y: Math.floor((this.mapSize[1] - 1) / 2)
        };

        hero.x = middle.x;
        hero.y = 1;

        let currMap = this.generateBasicMap(true);

        currMap[middle.x][0].type = 'ground';
        this.nbWall--;

        for (let i = 1; i < this.mapSize[0] - 1; i++) {
            for (let j = 1; j < this.mapSize[1] - 1; j++) {
                currMap[i][j].type = 'ground';
                this.nbWall--;
            }
        }

        currMap[middle.x][middle.y].content.artefact = 'stairDown';
        currMap[hero.x][hero.y].content.hero = true;

        this.cleanFog(currMap, hero);

        return currMap;
    }

    generateRandomLvl(hero) {
        let currMap = this.generateBasicMap(true);

        //Step 1 : generate rooms and corridors
        const roomSize = { min: 2, max: 5 };
        const nbRoom = this.random(2, Math.floor(this.mapSize[0] - 1 / roomSize.max));

        const rooms = [new Room(hero.x, hero.y, 1, 1)];
console.log(rooms)
        for (let i = 0; i <= nbRoom; i++) {
            const w = this.random(roomSize.min, roomSize.max);
            const h = this.random(roomSize.min, roomSize.max);
            const x = this.random(1, this.mapSize[0] - w - 2);
            const y = this.random(1, this.mapSize[1] - h - 2);
            const newRoom = new Room(x, y, w, h);

            let overlappingRooms = false;

            for (let existingRoom of rooms) {
                overlappingRooms = newRoom.intersects(existingRoom);
                if (overlappingRooms) { break }
            }

            if (!overlappingRooms) {
                this.createRoom(currMap, newRoom.startX, newRoom.startY, newRoom.endX, newRoom.endY);
                this.createCorridor(currMap, rooms[rooms.length - 1].mid, newRoom.mid);
                rooms.push(newRoom);
            }
        }

        //Step 2 : generate stair up and down
        let index = this.random(1, rooms.length - 1);
        let stairX = this.random(rooms[index].x1, rooms[index].x2);
        let stairY = this.random(rooms[index].y1, rooms[index].y2);

        currMap[stairX][stairY].content.artefact = 'stairDown';
        currMap[stairX][stairY].type = 'ground';

        currMap[hero.x][hero.y].content.artefact = 'stairUp';
        currMap[hero.x][hero.y].type = 'ground';
        currMap[hero.x][hero.y].content.hero = true;

        this.cleanFog(currMap, hero);

        //Step 3 : generate items and monsters
        //this.countFloorTiles();
        //this.generateStuff('item');
        //this.generateStuff('monstre');
        return currMap;
    }

    createRoom(currMap, x1 = 0, y1 = 0, x2 = 0, y2 = 0) {
        console.log(`Room: ${x1} ${y1} ${x2} ${y2}`)
        for (let i = x1; i <= x2; i++) {
            for (let j = y1; j <= y2; j++) {
                currMap[i][j].type = 'ground';
            }
        }
    }

    createCorridor(currMap, centerPrev, centerNew) {
        if (this.random(0, 1)) {
            console.log('random 1')
            let midPoint = { x: centerPrev.x, y: centerNew.y };
            this.vMove(currMap, midPoint, centerPrev);
            this.hMove(currMap, midPoint, centerNew);
        }
        else {
            console.log('random 0')
            let midPoint = { x: centerNew.x, y: centerPrev.y };
            this.vMove(currMap, midPoint, centerNew);
            this.hMove(currMap, midPoint, centerPrev);
        }
    }

    vMove(currMap, aCoord, bCoord) {
        let i = (aCoord.y <= bCoord.y) ? aCoord.y : bCoord.y;
        const j = (aCoord.y <= bCoord.y) ? bCoord.y : aCoord.y;
        console.log(`vMove i:${i} j:${j}`, aCoord, bCoord)
        for (i; i < j; i++) {
            currMap[aCoord.x][i].type = 'ground';
        }
    }

    hMove(currMap, aCoord, bCoord) {
        let i = (aCoord.x <= bCoord.x) ? aCoord.x : bCoord.x;
        const j = (aCoord.x <= bCoord.x) ? bCoord.x : aCoord.x;
        console.log(`hMove i:${i} j:${j}`, aCoord, bCoord)
        for (i; i < j; i++) {
            currMap[i][aCoord.y].type = 'ground';
        }
    }

    generateBasicMap(withFog = true) {
        let fog = withFog ? 2 : 0;
        let currMap = [];
        this.nbWall = this.mapSize[0] * this.mapSize[1];

        for (let i = 0; i < this.mapSize[0]; i++) {
            currMap[i] = [];

            for (let j = 0; j < this.mapSize[1]; j++) {
                currMap[i][j] = new Tile(i, j, 'wall', fog);
            }
        }
        return currMap;
    }

    cleanFog(currMap, { x, y, vision }) {
        for (let nbEtage = vision; nbEtage >= 0; nbEtage--) {
            let cmp = 0;

            for (let i = x - nbEtage; i <= x + nbEtage; i++) {
                let y1 = y - cmp;
                let y2 = y + cmp;

                (i < x) ? cmp++ : cmp--;

                if (i >= 0 && i < this.mapSize[0] && y1 >= 0 && y1 < this.mapSize[1]) {
                    currMap[i][y1].fogLvl = 0;
                }
                if (i >= 0 && i < this.mapSize[0] && y2 >= 0 && y2 < this.mapSize[1]) {
                    currMap[i][y2].fogLvl = 0;
                }
            }
        }

        let cmp = 0;
        for (let i = x - vision - 1; i <= x + vision + 1; i++) {
            let y1 = y - cmp;
            let y2 = y + cmp;

            (i < x) ? cmp++ : cmp--;

            if (i >= 0 && i < this.mapSize[0] && y1 >= 0 && y1 < this.mapSize[1]) {
                currMap[i][y1].fogLvl = 1;
            }

            if (i >= 0 && i < this.mapSize[0] && y2 >= 0 && y2 < this.mapSize[1]) {
                currMap[i][y2].fogLvl = 1;
            }
        }
    }

    checkAccess(currMap, x, y) {
        if (x >= 0 && x < this.mapSize[0] && y >= 0 && y < this.mapSize[1]) {
            const cell = currMap[x][y]
            if (cell.type === 'wall') {
                return { isAccessible: false, event: 'wall' };
            }
            else if (cell.content.monster) {
                return { isAccessible: false, event: 'monster' };
            }
            else {
                return { isAccessible: true, event: cell.content.artefact };
            }
        }
    }

    checkArtefact(x, y) {

    }
}