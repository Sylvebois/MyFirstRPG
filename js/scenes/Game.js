import { DungeonManager } from '../classes/LevelsManager.js';

export default class Game {
    constructor(state) {
        this.tileSizeOnScreen = 64;
        this.mapSize = [30, 20];
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
            if(state.game.levels.length === 0) { this.generateLvl(state.game) }
            this.drawLvl(state.game.levels[state.game.currLvl]);
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
                    state.updatePos(newPos.x, newPos.y);
                    this.dungeon.updatePos(state.game.currLvl, newPos.x, newPos.y);
                    this.drawLvl(state.game.levels[state.game.currLvl]);

                    if (state.game.levels[state.game.currLvl][newPos.x][newPos.y].content.artefact === 'stairDown') {

                    }
                }
                else if (result === 'monster') {

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
        const width = Math.min(this.gameZone.offsetWidth, this.tileSizeOnScreen * this.mapSize[0]);
        const height = Math.min(this.gameZone.offsetHeight, this.tileSizeOnScreen * this.mapSize[1]);
        const margin = (this.gameZone.offsetWidth - width) / 2;

        let result = new Map();
        let tags = document.getElementsByTagName('canvas');

        for (let elem of tags) {
            elem.setAttribute('width', width);
            elem.setAttribute('height', height);
            elem.setAttribute('style', `margin-left: ${margin}px`);
            result.set(elem.id, { can: elem, context: elem.getContext('2d') })
        }

        return result;
    }

    setCanvasSize() {
        const width = Math.min(this.gameZone.offsetWidth, this.tileSizeOnScreen * this.mapSize[0]);
        const height = Math.min(this.gameZone.offsetHeight, this.tileSizeOnScreen * this.mapSize[1]);
        const margin = (this.gameZone.offsetWidth - width) / 2;

        this.canvases.forEach(elem => {
            elem.can.setAttribute('width', width);
            elem.can.setAttribute('height', height);
            elem.can.setAttribute('style', `margin-left: ${margin}px`);
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
        const mid = { w: back.can.width / 2, h: back.can.height / 2 };
        const mapSizeAbs = { w: this.mapSize[0] * this.tileSizeOnScreen, h: this.mapSize[1] * this.tileSizeOnScreen };
        const heroAbs = { x: this.dungeon.hero.x * this.tileSizeOnScreen, y: this.dungeon.hero.y * this.tileSizeOnScreen };
        const distToBorder = { x: mapSizeAbs.w - heroAbs.x, y: mapSizeAbs.h - heroAbs.y };
        const cam = {
            x: (heroAbs.x < mid.w) ? 0 : (distToBorder.x <= mid.w) ? -1 * (mapSizeAbs.w - back.can.width) : mid.w - heroAbs.x,
            y: (heroAbs.y < mid.h) ? 0 : (distToBorder.y <= mid.h) ? -1 * (mapSizeAbs.h - back.can.height) : mid.h - heroAbs.y
        }

        lvl.forEach((x, idx) => x.forEach((tile, idy) => {
            const commonData = [
                img.data.tileSize,
                img.data.tileSize,
                this.tileSizeOnScreen * idx + cam.x,
                this.tileSizeOnScreen * idy + cam.y,
                this.tileSizeOnScreen,
                this.tileSizeOnScreen
            ];

            back.context.drawImage(
                img,
                img.data[tile.type].x * img.data.tileSize,
                img.data[tile.type].y * img.data.tileSize,
                ...commonData
            );

            if (tile.content.artefact) {
                back.context.drawImage(
                    img,
                    img.data[tile.content.artefact].x * img.data.tileSize,
                    img.data[tile.content.artefact].y * img.data.tileSize,
                    ...commonData
                );
            }

            if (tile.content.hero) {
                back.context.drawImage(
                    img,
                    img.data['heroGoLeft'].x * img.data.tileSize,
                    img.data['heroGoLeft'].y * img.data.tileSize,
                    ...commonData
                );
            }

            if(tile.fogLvl > 0) {
                back.context.fillStyle = tile.fogLvl === 2 ? 'black' : 'rgba(0,0,0,0.5)';
                back.context.fillRect(
                    this.tileSizeOnScreen * idx + cam.x,
                    this.tileSizeOnScreen * idy + cam.y,
                    this.tileSizeOnScreen,
                    this.tileSizeOnScreen
                )
            }
        }))
    }
}