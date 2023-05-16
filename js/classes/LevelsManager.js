
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
        this.mid = [Math.floor((this.startX + this.endX) / 2), Math.floor((this.startY + this.endY) / 2)];
    }

    intersects(room) {
        return (this.startX <= room.endX && this.endX >= room.startX &&
            this.startY <= room.endY && this.endY >= room.startY) ? true : false;
    }
}

export class DungeonManager {
    constructor(mapSize) {
        this.mapSize = mapSize;
        this.lvlMaps = [];
        this.nbWall = 0;
        this.currLvl = 0;
        this.hero = { x: 0, y: 0, vision: 2 };
    }

    random(min = 0, max = 1, int = true) {
        return (int) ? Math.floor(Math.random() * (max - min + 1)) + min : Math.random() * (max - min) + min;
    }

    generateFirstLvl() {
        const middle = {
            x: Math.floor((this.mapSize[0] - 1) / 2),
            y: Math.floor((this.mapSize[1] - 1) / 2)
        };

        this.generateBasicMap(true);

        this.lvlMaps[this.currLvl][middle.x][0].type = 'ground';
        this.nbWall--;

        for (let i = 1; i < this.mapSize[0] - 1; i++) {
            for (let j = 1; j < this.mapSize[1] - 1; j++) {
                this.lvlMaps[this.currLvl][i][j].type = 'ground';
                this.nbWall--;
            }
        }

        this.hero.x = middle.x;
        this.hero.y = 1;

        this.lvlMaps[this.currLvl][middle.x][middle.y].content.artefact = 'stairDown';
        this.lvlMaps[this.currLvl][this.hero.x][this.hero.y].content.hero = true;

        this.cleanFog(this.hero.x, this.hero.y, this.hero.vision);

        return { lvlMap: this.lvlMaps[this.currLvl], heroX: this.hero.x, heroY: this.hero.y };
    }

    generateLvl() {

    }

    generateBasicMap(withFog = true) {
        let fog = withFog ? 2 : 0;

        this.nbWall = this.mapSize[0] * this.mapSize[1];
        this.lvlMaps[this.currLvl] = [];

        for (let i = 0; i < this.mapSize[0]; i++) {
            this.lvlMaps[this.currLvl][i] = [];

            for (let j = 0; j < this.mapSize[1]; j++) {
                this.lvlMaps[this.currLvl][i][j] = new Tile(i, j, 'wall', fog);
            }
        }
    }

    cleanFog(x, y, visibility) {
        for (let nbEtage = visibility; nbEtage >= 0; nbEtage--) {
            let cmp = 0;

            for (let i = x - nbEtage; i <= x + nbEtage; i++) {
                let y1 = y - cmp;
                let y2 = y + cmp;

                (i < x) ? cmp++ : cmp--;

                if (i >= 0 && i < this.mapSize[0] && y1 >= 0 && y1 < this.mapSize[1]) {
                    this.lvlMaps[this.currLvl][i][y1].fogLvl = 0;
                }
                if (i >= 0 && i < this.mapSize[0] && y2 >= 0 && y2 < this.mapSize[1]) {
                    this.lvlMaps[this.currLvl][i][y2].fogLvl = 0;
                }
            }
        }

        let cmp = 0;
        for (let i = x - visibility - 1; i <= x + visibility + 1; i++) {
            let y1 = y - cmp;
            let y2 = y + cmp;

            (i < x) ? cmp++ : cmp--;

            if (i >= 0 && i < this.mapSize[0] && y1 >= 0 && y1 < this.mapSize[1]) {
                this.lvlMaps[this.currLvl][i][y1].fogLvl = 1;
            }

            if (i >= 0 && i < this.mapSize[0] && y2 >= 0 && y2 < this.mapSize[1]) {
                this.lvlMaps[this.currLvl][i][y2].fogLvl = 1;
            }
        }
    }

    checkAccess(x, y) {
        if (x >= 0 && x < this.mapSize[0] && y >= 0 && y < this.mapSize[1]) {
            const cell = this.lvlMaps[this.currLvl][x][y]
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

    updatePos(lvl, x, y) {
        this.lvlMaps[lvl][this.hero.x][this.hero.y].content.hero = false;
        this.lvlMaps[lvl][x][y].content.hero = true;
        this.hero.x = x;
        this.hero.y = y;
        this.cleanFog(this.hero.x, this.hero.y, this.hero.vision);
    }
}