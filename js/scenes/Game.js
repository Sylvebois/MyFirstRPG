import { DungeonManager } from '../classes/LevelsManager.js';
import { inGameTxt } from '../text.js';

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
        this.camera = { x: 0, y: 0 }
        this.initEventListeners(state);
    }

    initEventListeners(state) {
        this.dialogBox.addEventListener('click', e => this.dialogBox.style.display = 'none');

        const buttons = this.hud.getElementsByTagName('button');
        buttons[0].addEventListener('click', e => this.goToMenu(state));
        buttons[1].addEventListener('click', e => this.goToInventory(state));

        this.canvases.get('background').can.addEventListener('click', e => {
            if (state.currScene === 'gameInterface') {
                //pathFinding
                //<TO DO> Should update fog after each move and update the path if necessary
                //<TO DO> Should unify the move when clicking and when pressing a key
                let currMap = state.game.levels[state.game.currLvl];
                let hero = state.game.player;
                let dest = {
                    x: Math.floor(e.layerX / this.tileSizeOnScreen - this.camera.x / this.tileSizeOnScreen),
                    y: Math.floor(e.layerY / this.tileSizeOnScreen - this.camera.y / this.tileSizeOnScreen)
                };
                const path = this.dungeon.findPath(currMap, { x: hero.x, y: hero.y }, dest);

                if (path.length) { this.moveSequence(state, hero, path); }
            }
            else if (state.currScene === 'inventory') {
                //dragndrop?
            }
        });

        window.addEventListener('resize', e => {
            this.setCanvasSize();
            if (state.game.levels.length === 0) { this.generateLvl(state.game) }
            this.drawLvl(state.game);
        });

        window.addEventListener('keydown', e => {
            if (state.currScene === 'gameInterface') {
                let hero = state.game.player;
                let currMap = state.game.levels[state.game.currLvl];
                let newPos = { x: hero.x, y: hero.y, direction: 'heroGoLeft' };
                let result = null;

                if (e.key === 'ArrowUp') {
                    newPos.y = hero.y - 1;
                    newPos.direction = 'heroGoUp';
                    result = this.dungeon.checkAccess(currMap, newPos.x, newPos.y);
                }
                else if (e.key === 'ArrowDown') {
                    newPos.y = hero.y + 1;
                    newPos.direction = 'heroGoDown';
                    result = this.dungeon.checkAccess(currMap, newPos.x, newPos.y);
                }
                else if (e.key === 'ArrowLeft') {
                    newPos.x = hero.x - 1;
                    newPos.direction = 'heroGoLeft';
                    result = this.dungeon.checkAccess(currMap, newPos.x, newPos.y);
                }
                else if (e.key === 'ArrowRight') {
                    newPos.x = hero.x + 1;
                    newPos.direction = 'heroGoRight';
                    result = this.dungeon.checkAccess(currMap, newPos.x, newPos.y);
                }
                else if (e.key === 'o' || e.key === 'O') { this.goToMenu(state); }
                else if (e.key === 'i' || e.key === 'I') { this.goToInventory(state); }

                if (result && result.isAccessible) {
                    state.updatePos(newPos.x, newPos.y);
                    this.dungeon.cleanFog(currMap, hero);
                    this.drawLvl(state.game, newPos.direction);

                    if (result.event) {
                        if (result.event === 'stairDown' &&
                            window.confirm(inGameTxt.goDown[state.options.language])
                        ) {
                            state.game.currLvl++;

                            if (!state.game.levels[state.game.currLvl]) {
                                this.generateLvl(state.game);
                            }

                            this.drawLvl(state.game, newPos.direction);
                        }
                        else if (result.event === 'stairUp' &&
                            window.confirm(inGameTxt.goUp[state.options.language])
                        ) {
                            state.game.currLvl--;
                            this.drawLvl(state.game, newPos.direction);
                        }
                        else if (!result.event.startsWith('stair') &&
                            window.confirm(`${inGameTxt.take[state.options.language]} ${result.event}`)
                        ) {

                        }
                    }
                }
                else if (result && result.event === 'monster') {

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
            lvl = this.dungeon.generateFirstLvl(gameData.player);
        }
        else {
            lvl = this.dungeon.generateRandomLvl(gameData.player);
        }

        gameData.levels.push(lvl);
    }

    drawLvl(gameData, heroDirection = 'heroGoLeft') {
        const back = this.canvases.get('background');
        const img = this.images['newTileset'];
        const mid = { w: back.can.width / 2, h: back.can.height / 2 };
        const mapSizeAbs = { w: this.mapSize[0] * this.tileSizeOnScreen, h: this.mapSize[1] * this.tileSizeOnScreen };
        const heroAbs = { x: gameData.player.x * this.tileSizeOnScreen, y: gameData.player.y * this.tileSizeOnScreen };
        const distToBorder = { x: mapSizeAbs.w - heroAbs.x, y: mapSizeAbs.h - heroAbs.y };
        this.camera = {
            x: (heroAbs.x < mid.w) ? 0 : (distToBorder.x <= mid.w) ? -1 * (mapSizeAbs.w - back.can.width) : mid.w - heroAbs.x,
            y: (heroAbs.y < mid.h) ? 0 : (distToBorder.y <= mid.h) ? -1 * (mapSizeAbs.h - back.can.height) : mid.h - heroAbs.y
        }

        gameData.levels[gameData.currLvl].forEach((x, idx) => x.forEach((tile, idy) => {
            const commonData = [
                img.data.tileSize,
                img.data.tileSize,
                this.tileSizeOnScreen * idx + this.camera.x,
                this.tileSizeOnScreen * idy + this.camera.y,
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
                    img.data[heroDirection].x * img.data.tileSize,
                    img.data[heroDirection].y * img.data.tileSize,
                    ...commonData
                );
            }

            if (tile.fogLvl > 0) {
                back.context.fillStyle = tile.fogLvl === 2 ? 'black' : 'rgba(0,0,0,0.5)';
                back.context.fillRect(
                    this.tileSizeOnScreen * idx + this.camera.x,
                    this.tileSizeOnScreen * idy + this.camera.y,
                    this.tileSizeOnScreen,
                    this.tileSizeOnScreen
                )
            }
        }))
    }

    moveSequence(state, hero, path) {
        let cmp = 0;
        let interval = setInterval(() => {
            state.updatePos(path[cmp].x, path[cmp].y);
            this.dungeon.cleanFog(state.game.levels[state.game.currLvl], hero);
            this.drawLvl(state.game, 'heroGoLeft');

            cmp++;

            if (cmp === path.length) { clearInterval(interval); }
        }, 100)
    }
}