import { DungeonManager } from '../classes/LevelsManager.js';

export default class Game {
    constructor(state) {
        this.tilesize = 32;
        this.tileSizeOnScreen = 32;
        this.mapSize = [20, 20];
        this.dungeon = new DungeonManager(this.mapSize);

        this.gameInterface = document.getElementById('gameInterface');
        this.hud = document.getElementById('hud');
        this.gameZone = document.getElementById('gameZone');
        this.dialogBox = document.getElementById('dialog');
        this.dialogBox.style.display = 'none';

        this.canvases = this.initCanvases();
        this.images = state.assets.images;
        this.initEventListeners(state);
    }

    initEventListeners(state) {
        this.dialogBox.addEventListener('click', e => this.dialogBox.style.display = 'none');

        const buttons = this.hud.getElementsByTagName('button');
        buttons[0].addEventListener('click', e => this.goToMenu(state));
        buttons[1].addEventListener('click', e => this.goToInventory(state));

        window.addEventListener('resize', e => {
            this.setCanvasSize();
            this.drawLvl(state.game.levels[state.game.player.level]);
        });

        window.addEventListener('keydown', e => {
            if (state.currScene === 'gameInterface') {
                let hero = state.game.player;
                let newPos = { x: hero.x, y: hero.y };
                let result = null;

                if (e.key === 'ArrowUp') {
                    newPos.y = hero.y - 1;
                    result = this.dungeon.checkAccess(newPos.x, newPos.y);
                }
                else if (e.key === 'ArrowDown') {
                    newPos.y = hero.y + 1;
                    result = this.dungeon.checkAccess(newPos.x, newPos.y);
                }
                else if (e.key === 'ArrowLeft') {
                    newPos.x = hero.x - 1;
                    result = this.dungeon.checkAccess(newPos.x, newPos.y);
                }
                else if (e.key === 'ArrowRight') {
                    newPos.x = hero.x + 1;
                    result = this.dungeon.checkAccess(newPos.x, newPos.y);
                }
                else if (e.key === 'o' || e.key === 'O') { this.goToMenu(state); }
                else if (e.key === 'i' || e.key === 'I') { this.goToInventory(state); }

                if (result === 'move') {
                    state.update(newPos.x, newPos.y);
                    this.drawLvl(state.game.levels[hero.level]);

                    if(state.game.levels[hero.level][newPos.x][newPos.y].content.artefact === 'stairDown') {

                    }
                }
                else if(result === 'monster') {

                }
            }
            else if (state.currScene === 'inventory') {
                if (e.key === 'Escape' || e.key === 'i' || e.key === 'I') {
                    this.goToGame(state);
                }
            }
        });
    }

    initCanvases() {
        let result = new Map();
        let size = Math.min(this.gameZone.offsetWidth, this.gameZone.offsetHeight);
        this.tileSizeOnScreen = size / this.mapSize[0];
        let tags = document.getElementsByTagName('canvas');

        for (let elem of tags) {
            elem.setAttribute('width', size);
            elem.setAttribute('height', size);
            result.set(elem.id, { can: elem, context: elem.getContext('2d') })
        }

        return result;
    }

    setCanvasSize() {
        let size = Math.min(this.gameZone.offsetWidth, this.gameZone.offsetHeight);
        this.tileSizeOnScreen = size / this.mapSize[0];
        this.canvases.forEach(elem => {
            elem.can.setAttribute('width', size);
            elem.can.setAttribute('height', size);
        })
    }

    goToInventory(state) {
        state.currScene = 'inventory';
        this.gameInterface.style.visibility = 'hidden';
    }

    goToGame(state) {
        state.gameIsRunning = true;
        state.currScene = 'gameInterface';
        this.gameInterface.style.visibility = 'visible';
    }

    goToMenu(state) {
        state.currScene = 'inGameMenu';
        document.getElementById('menu').style.display = 'block';
        document.getElementById(state.currScene).style.display = 'block';
        this.gameInterface.style.visibility = 'hidden';
    }

    generateLvl(gameData) {
        let lvl = null;

        if (gameData.levels.length === 0) {
            lvl = this.dungeon.generateFirstLvl();
        }

        gameData.player.x = lvl.heroX;
        gameData.player.y = lvl.heroY;
        gameData.levels.push(lvl.lvlMap);
    }

    drawLvl(lvl) {
        const back = this.canvases.get('background');
        const img = this.images['newTileset'];

        lvl.forEach((x, idx) => x.forEach((tile, idy) => {
            const finalData = [
                img.data.tileSize,
                img.data.tileSize,
                this.tileSizeOnScreen * idx,
                this.tileSizeOnScreen * idy,
                this.tileSizeOnScreen,
                this.tileSizeOnScreen
            ]
            
            back.context.drawImage(
                img,
                img.data[tile.type].x * img.data.tileSize,
                img.data[tile.type].y * img.data.tileSize,
                ...finalData
            );

            if (tile.content.artefact) {
                back.context.drawImage(
                    img,
                    img.data[tile.content.artefact].x * img.data.tileSize,
                    img.data[tile.content.artefact].y * img.data.tileSize,
                    ...finalData
                );
            }

            if (tile.content.hero) {
                back.context.drawImage(
                    img,
                    img.data['heroGoLeft'].x * img.data.tileSize,
                    img.data['heroGoLeft'].y * img.data.tileSize,
                    ...finalData
                );
            }
        }))
    }
}