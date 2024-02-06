import { DungeonManager } from '../classes/LevelsManager.js';
//import { DrawManager } from '../classes/DrawManager.js';
import { inGameTxt, dialogs } from '../text.js';

export default class Game {
    constructor(state, drawer, tileSize) {
        this.drawer = drawer;
        this.tileSizeOnScreen = tileSize;
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

        this.animationRunning = false;
        this.dialogBoxOpen = false;
        this.playedDialogs = [];
    }

    initEventListeners(state) {
        this.dialogBox.addEventListener('click', e => {
            this.dialogBoxOpen = false;
            this.dialogBox.style.display = 'none';
            this.canvases.get('background').can.focus();
        });

        const buttons = this.hud.getElementsByTagName('button');
        buttons[0].addEventListener('click', e => this.goToMenu(state));
        buttons[1].addEventListener('click', e => this.goToInventory(state));

        this.canvases.get('background').can.addEventListener('click', e => {
            if (this.animationRunning || this.dialogBoxOpen) { return }

            if (state.currScene === 'gameInterface') {
                let currMap = state.game.levels[state.game.currLvl];
                let hero = state.game.player;
                let dest = {
                    x: Math.floor(e.layerX / this.tileSizeOnScreen - this.drawer.camera.x / this.tileSizeOnScreen),
                    y: Math.floor(e.layerY / this.tileSizeOnScreen - this.drawer.camera.y / this.tileSizeOnScreen)
                };
                const path = this.dungeon.findPath(currMap, { x: hero.x, y: hero.y }, dest);

                if (path.length > 1) {
                    let cmp = 0;
                    let interval = setInterval(() => {
                        if (path[cmp].y === hero.y - 1) {
                            this.moveActionSequence(state, 'ArrowUp');
                        }
                        else if (path[cmp].y === hero.y + 1) {
                            this.moveActionSequence(state, 'ArrowDown');
                        }
                        else if (path[cmp].x === hero.x - 1) {
                            this.moveActionSequence(state, 'ArrowLeft');
                        }
                        else if (path[cmp].x === hero.x + 1) {
                            this.moveActionSequence(state, 'ArrowRight');
                        }
                        cmp++;

                        if (cmp === path.length) { clearInterval(interval); }
                    }, 100)
                }
            }
            else if (state.currScene === 'inventory') {
                //dragndrop?
            }
        });

        window.addEventListener('resize', e => {
            this.setCanvasSize();
            if (state.game.levels.length === 0) {
                this.generateLvl(state.game)
            }
            this.drawer.drawLvl();
        });

        window.addEventListener('keydown', e => {
            if (this.animationRunning) {
                return
            }
            else if (this.dialogBox.style.display === 'block') {
                const exitKeys = ['Enter', ' ', 'Escape'];

                if (exitKeys.includes(e.key)) {
                    this.dialogBox.style.display = 'none';
                    this.canvases.get('background').can.focus();
                }
            }
            else if (state.currScene === 'gameInterface') {
                const moveKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
                const menuKeys = ['o', 'O', 'Escape'];
                const invKeys = ['i', 'I'];

                if (moveKeys.includes(e.key)) {
                    this.moveActionSequence(state, e.key)
                }
                else if (menuKeys.includes(e.key)) {
                    this.goToMenu(state);
                }
                else if (invKeys.includes(e.key)) {
                    this.goToInventory(state);
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
        this.drawer.drawInventory();
    }

    goToGame(state) {
        state.gameIsRunning = true;
        state.currScene = 'gameInterface';
        this.gameInterface.style.visibility = 'visible';
        this.drawer.drawLvl();
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
        else if (gameData.currLvl === 4) {
            lvl = this.dungeon.generateMidLvl(gameData.player);
        }
        else if (gameData.currLvl === 9) {
            lvl = this.dungeon.generateLastLvl(gameData.player);
        }
        else {
            lvl = this.dungeon.generateRandomLvl(gameData.player);
        }

        gameData.levels.push(lvl);
    }

    dialogSequence(gameData, currLanguage, number = 0) {
        let dialogName = '';

        if (gameData.currLvl === 0) {
            dialogName += 'firstLvl';
        }
        else if (gameData.currLvl === 4) {
            dialogName += 'midLvl';
        }
        else if (gameData.currLvl === 9) {
            dialogName += 'lastLvl';
        }
        else {
            return;
        }

        dialogName += (gameData.firstRun === true) ? 'FirstRun' : 'LastRun';
        dialogName += number

        if (!this.playedDialogs.includes(dialogName)) {
            this.dialogBoxOpen = true;
            this.dialogBox.style.display = 'block';
            this.dialogBox.innerText = dialogs[dialogName][currLanguage];

            this.playedDialogs.push(dialogName);
        }
    }

    moveActionSequence(state, direction) {
        let hero = state.game.player;
        let currMap = state.game.levels[state.game.currLvl];
        let newPos = { x: hero.x, y: hero.y, direction };

        switch (direction) {
            case 'ArrowUp':
                newPos.y = hero.y - 1;
                newPos.direction = 'heroGoLeft';
                break;
            case 'ArrowDown':
                newPos.y = hero.y + 1;
                newPos.direction = 'heroGoLeft';
                break;
            case 'ArrowLeft':
                newPos.x = hero.x - 1;
                newPos.direction = 'heroGoLeft';
                break;
            case 'ArrowRight':
                newPos.x = hero.x + 1;
                newPos.direction = 'heroGoRight';
                break;
        }

        const result = this.dungeon.checkAccess(currMap, newPos.x, newPos.y);

        if (result && result.isAccessible) {
            state.updatePos(newPos.x, newPos.y);
            this.dungeon.cleanFog(state.game.levels[state.game.currLvl], hero);
            this.drawer.drawLvl(newPos.direction);

            if (state.game.currLvl === 0 && currMap[this.mapSize[0] / 2][4].fogLvl < 2) {
                this.dialogSequence(state.game, state.options.language, 1);
            }

            if (result.event) {
                if (result.event === 'stairDown' && window.confirm(inGameTxt.goDown[state.options.language])) {
                    state.game.currLvl++;

                    if (!state.game.levels[state.game.currLvl]) {
                        this.generateLvl(state.game);
                        this.dialogSequence(state.game, state.options.language);
                    }

                    const stairPos = state.game.levels[state.game.currLvl]
                        .flatMap(line => line.filter(cell => cell.content.artefact.name === 'stairUp'))[0];

                    hero.x = stairPos.posX;
                    hero.y = stairPos.posY;

                    this.drawer.drawLvl(newPos.direction);
                }
                else if (result.event === 'stairUp' && window.confirm(inGameTxt.goUp[state.options.language])) {
                    state.game.currLvl--;

                    const stairPos = state.game.levels[state.game.currLvl]
                        .flatMap(line => line.filter(cell => cell.content.artefact.name === 'stairDown'))[0];

                    hero.x = stairPos.posX;
                    hero.y = stairPos.posY;

                    this.drawer.drawLvl(newPos.direction);
                }
                else if (!result.event.startsWith('stair') && window.confirm(`${inGameTxt.take[state.options.language]} ${result.event}`)) {
                    if (result.event === 'heart') {
                        if (hero.hpLeft < hero.end) {
                            hero.hpLeft++;
                            currMap[newPos.x][newPos.y].content.artefact = false;
                        }
                        this.drawer.drawLvl(newPos.direction);
                    }
                    else if (hero.inventory.filter(slot => slot === null).length === 0) {
                        window.alert(inGameTxt.noMoreRoom[state.options.language]);
                    }
                    else {
                        const emptySlot = hero.inventory.indexOf(null);
                        hero.inventory[emptySlot] = currMap[newPos.x][newPos.y].content.artefact;
                        currMap[newPos.x][newPos.y].content.artefact = false;

                        this.drawer.drawLvl(newPos.direction);
                    }
                }
            }
        }
        else if (result && result.event === 'monster') {
            this.fightActionSequence(state, newPos)
        }
    }

    fightActionSequence(state, fightZone) {
        this.animationRunning = true
        /*
            Animation :
            - A sound is played
            - Hero move to monster and go back
            - Scratch fade in and out
            - Damage text fade in and out
        */
        const hero = state.game.player
        const monster = state.game.levels[state.game.currLvl][fightZone.x][fightZone.y].content.monster
        const damages = this.fightResult(hero, monster)

        const tileSize = this.tileSizeOnScreen
        console.log(damages, monster, hero)
        let heroAnim = {
            name: fightZone.direction,
            start: {
                x: state.game.player.x * tileSize,
                y: state.game.player.y * tileSize
            },
            end: {
                x: fightZone.x * tileSize,
                y: fightZone.y * tileSize
            },
            current: {
                x: state.game.player.x * tileSize,
                y: state.game.player.y * tileSize
            },
            distance: {
                x: (fightZone.x - state.game.player.x) * tileSize,
                y: (fightZone.y - state.game.player.y) * tileSize
            },
            oneWayDuration: 250
        }

        let monsterAnim = {
            name: monster.name,
            x: fightZone.x,
            y: fightZone.y,
            start: heroAnim.end,
            end: heroAnim.start,
            current: {
                x: fightZone.x * tileSize,
                y: fightZone.y * tileSize
            },
            distance: {
                x: (state.game.player.x - fightZone.x) * tileSize,
                y: (state.game.player.y - fightZone.y) * tileSize
            },
            oneWayDuration: 250
        }

        let scratchAnim = {
            duration: 50,
            x: heroAnim.end.x,
            y: heroAnim.end.y,
            opacity: 0
        }

        let textAnim = {
            duration: 50,
            opacity: 0,
            x: heroAnim.end.x,
            y: heroAnim.end.y + tileSize / 5,
            text: damages.dmgToMonster === 0 ? 'miss' : damages.dmgToMonster
        }

        let heroAttackStartTime, monsterAttackStartTime, dieStartTime, gameoverStartTime

        const heroAttack = (timestamp) => {
            if (!heroAttackStartTime) { heroAttackStartTime = timestamp }

            const elapsed = timestamp - heroAttackStartTime

            if (elapsed > 2 * heroAnim.oneWayDuration + 100) {
                this.animationRunning = false

                if (monster.hpLeft - damages.dmgToMonster > 0) {
                    this.animationRunning = true

                    scratchAnim.opacity = 0
                    scratchAnim.x = monsterAnim.end.x
                    scratchAnim.y = monsterAnim.end.y

                    textAnim.opacity = 0
                    textAnim.x = monsterAnim.end.x
                    textAnim.y = monsterAnim.end.y + tileSize / 5
                    textAnim.text = damages.dmgToHero === 0 ? 'miss' : damages.dmgToHero

                    requestAnimationFrame(monsterAttack)
                }
                else {
                    damagesValidation()
                }
                return
            }

            // Sound
            if (elapsed <= 200) {
                state.assets.sounds.swing.play()
            }

            // Hero
            if (elapsed <= heroAnim.oneWayDuration) {
                const progress = elapsed / heroAnim.oneWayDuration
                heroAnim.current.x = heroAnim.start.x + heroAnim.distance.x * progress
                heroAnim.current.y = heroAnim.start.y + heroAnim.distance.y * progress
            }
            else if (elapsed > heroAnim.oneWayDuration && elapsed <= 2 * heroAnim.oneWayDuration) {
                const progress = elapsed / heroAnim.oneWayDuration
                heroAnim.current.x = heroAnim.end.x - heroAnim.distance.x / 2 * progress
                heroAnim.current.y = heroAnim.end.y - heroAnim.distance.y / 2 * progress
            }

            // Scratch
            if (elapsed >= heroAnim.oneWayDuration - scratchAnim.duration &&
                elapsed <= heroAnim.oneWayDuration) {
                scratchAnim.opacity = elapsed / heroAnim.oneWayDuration
            }
            else if (elapsed > heroAnim.oneWayDuration &&
                elapsed <= 2 * heroAnim.oneWayDuration - scratchAnim.duration) {
                scratchAnim.opacity = heroAnim.oneWayDuration / elapsed
            }
            else {
                scratchAnim.opacity = 0
            }

            // Text
            if (elapsed >= heroAnim.oneWayDuration - textAnim.duration &&
                elapsed <= heroAnim.oneWayDuration) {
                const progress = elapsed / heroAnim.oneWayDuration
                textAnim.opacity = progress
                textAnim.y = heroAnim.end.y - (tileSize * progress) / 2
            }
            else if (elapsed > heroAnim.oneWayDuration &&
                elapsed <= 2 * heroAnim.oneWayDuration) {
                textAnim.opacity = heroAnim.oneWayDuration / elapsed
            }
            else {
                textAnim.opacity = 0
            }

            this.drawer.drawFight(
                heroAnim,
                fightZone.direction,
                scratchAnim,
                textAnim,
                'hero'
            )

            requestAnimationFrame(heroAttack)
        }

        const monsterAttack = (timestamp) => {
            if (!monsterAttackStartTime) { monsterAttackStartTime = timestamp }

            const elapsed = timestamp - monsterAttackStartTime

            if (elapsed > 2 * monsterAnim.oneWayDuration + 100) {
                this.animationRunning = false
                damagesValidation()
                return
            }

            // Sound
            if (elapsed <= 500) {
                state.assets.sounds.ogre.play()
            }

            // Monster
            if (elapsed <= monsterAnim.oneWayDuration) {
                const progress = elapsed / monsterAnim.oneWayDuration
                monsterAnim.current.x = monsterAnim.start.x + monsterAnim.distance.x * progress
                monsterAnim.current.y = monsterAnim.start.y + monsterAnim.distance.y * progress
            }
            else if (elapsed > monsterAnim.oneWayDuration && elapsed <= 2 * monsterAnim.oneWayDuration) {
                const progress = elapsed / monsterAnim.oneWayDuration
                monsterAnim.current.x = monsterAnim.end.x - monsterAnim.distance.x / 2 * progress
                monsterAnim.current.y = monsterAnim.end.y - monsterAnim.distance.y / 2 * progress
            }

            // Scratch
            if (elapsed >= monsterAnim.oneWayDuration - scratchAnim.duration &&
                elapsed <= monsterAnim.oneWayDuration) {
                scratchAnim.opacity = elapsed / monsterAnim.oneWayDuration
            }
            else if (elapsed > monsterAnim.oneWayDuration &&
                elapsed <= 2 * monsterAnim.oneWayDuration - scratchAnim.duration) {
                scratchAnim.opacity = monsterAnim.oneWayDuration / elapsed
            }
            else {
                scratchAnim.opacity = 0
            }

            // Text
            if (elapsed >= monsterAnim.oneWayDuration - textAnim.duration &&
                elapsed <= monsterAnim.oneWayDuration) {
                const progress = elapsed / monsterAnim.oneWayDuration
                textAnim.opacity = progress
                textAnim.y = monsterAnim.end.y - (tileSize * progress) / 2
            }
            else if (elapsed > monsterAnim.oneWayDuration &&
                elapsed <= 2 * monsterAnim.oneWayDuration) {
                textAnim.opacity = monsterAnim.oneWayDuration / elapsed
            }
            else {
                textAnim.opacity = 0
            }

            this.drawer.drawFight(
                monsterAnim,
                fightZone.direction,
                scratchAnim,
                textAnim,
                'monster'
            )

            requestAnimationFrame(monsterAttack)
        }

        const dying = (timestamp) => {
            if (!dieStartTime) { dieStartTime = timestamp }

            const elapsed = timestamp - dieStartTime

            if (elapsed > 1000) {
                this.animationRunning = false
                return
            }

            const progress = elapsed / 1000
            requestAnimationFrame(dying)
        }

        let maxTxtSize = 0;
        const gameover = (timestamp) => {
            if (!gameoverStartTime) { gameoverStartTime = timestamp }

            const elapsed = timestamp - gameoverStartTime;

            //black screen
            this.drawer.ctx.save();
            this.drawer.ctx.fillStyle = "black";
            this.drawer.ctx.globalAlpha = elapsed / gameoverStartTime;
            this.drawer.ctx.fillRect(0, 0, this.drawer.canvas.width, this.drawer.canvas.height);
            this.drawer.ctx.restore();

            //text
            this.drawer.ctx.save();
            const currTxtSize = elapsed / gameoverStartTime * 100;

            this.drawer.ctx.fillStyle = "white";
            this.drawer.ctx.font = `${elapsed / gameoverStartTime * 100}vw Sans serif`;
            this.drawer.ctx.textAlign = "center";
            this.drawer.ctx.textBaseline = "middle";

            const txtWidth = this.drawer.ctx.measureText("GAME OVER").width;

            if (txtWidth > this.drawer.canvas.width) {
                this.drawer.ctx.font = `${maxTxtSize}vw Sans serif`;
            }
            else {
                maxTxtSize = currTxtSize;
            }

            this.drawer.ctx.fillText("GAME OVER", this.drawer.canvas.width / 2, this.drawer.canvas.height / 2, this.drawer.canvas.width);
            this.drawer.ctx.restore();

            if (elapsed > 5000) {
                this.animationRunning = false;
                state.clear();
                document.getElementById('menu').style.display = 'block';
                document.getElementById(state.currScene).style.display = 'block';
                this.gameInterface.style.visibility = 'hidden';
            }
            else {
                requestAnimationFrame(gameover);
            }
        }

        requestAnimationFrame(heroAttack)

        const damagesValidation = () => {
            monster.hpLeft -= damages.dmgToMonster

            if (monster.hpLeft > 0) {
                hero.hpLeft -= damages.dmgToHero

                if (hero.hpLeft > 0) {
                    this.updateHud(hero.hpLeft, hero.end)
                }
                else {
                    this.animationRunning = true
                    this.updateHud(0,hero.end)
                    requestAnimationFrame(gameover)
                }
            }
            else {
                // this.animationRunning = true
                // requestAnimationFrame(dying)
                state.game.levels[state.game.currLvl][fightZone.x][fightZone.y].content.monster = false
                this.drawer.drawLvl(fightZone.direction);

                if (state.game.currLvl === 0) {
                    this.dialogSequence(state.game, state.options.language);
                }
            }
        }
    }

    updateHud(hpLeft, hpTot) {
        this.hud.getElementsByClassName('health')[0].textContent = `${hpLeft}/${hpTot}`
    }

    fightResult(hero, monster) {
        let dmgToMonster = (hero.atk - monster.def < 0) ? 0 : hero.atk - monster.def
        let dmgToHero = (monster.atk - hero.atk < 0) ? 0 : monster.atk - hero.def
        return { dmgToHero, dmgToMonster }
    }
}