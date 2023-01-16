
class Tile {
    constructor(x, y, type = 'wall', fogLvl = 2) {
        this.posX = parseInt(x);
        this.posY = parseInt(y);
        this.type = type;
        this.fogLvl = fogLvl;
        this.content = { hero: false, monster: false, artefact: false };
    }
}

export class DungeonManager {
    constructor(mapSize) {
        this.mapSize = mapSize;
        this.lvlMaps = [];
        this.nbWall = 0;
        this.currLvl = 0;
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

        this.lvlMaps[this.currLvl][middle.x][middle.y].content.artefact = 'stairDown';
        this.lvlMaps[this.currLvl][middle.x][1].content.hero = true;

        this.cleanFog(middle.x, 1, 2);
        return { lvlMap: this.lvlMaps[this.currLvl], heroX: middle.x, heroY: 1 };
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
        if(x >= 0 && x < this.mapSize[0] && y >= 0 && y < this.mapSize[1]) {
            if (this.lvlMaps[this.currLvl][x][y].type === 'wall') {
                return 'wall';
            }
            else if (this.lvlMaps[this.currLvl][x][y].content.monster === true) {
                return 'monster';
            }
            else {
                return 'move';
            }
        }
    };
}