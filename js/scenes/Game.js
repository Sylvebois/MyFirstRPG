export default class Game {
    constructor(state) {
        this.tilesize = 32;
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

        window.addEventListener('resize', e => this.setCanvasSize());
        window.addEventListener('keydown', e => {
            if (state.currScene === 'gameInterface') {
                if (e.key === 'ArrowUp') {

                }
                else if (e.key === 'ArrowDown') {

                }
                else if (e.key === 'ArrowLeft') {

                }
                else if (e.key === 'ArrowRight') {

                }
                else if (e.key === 'o' || e.key === 'O') { this.goToMenu(state); }
                else if (e.key === 'i' || e.key === 'I') { this.goToInventory(state); }
            }
            else if(state.currScene === 'inventory') {
                if(e.key === 'Escape' || e.key === 'i' || e.key ==='I') { 
                    this.goToGame(state);
                }
            }
        });
    }

    initCanvases() {
        let result = new Map();
        let size = Math.min(this.gameZone.offsetWidth, this.gameZone.offsetHeight);
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
        let ratio = this.size / 720; //720 = default size of canvas
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
        state.currScene = 'gameInterface';
        this.gameInterface.style.visibility = 'visible';
    }

    goToMenu(state) {
        state.currScene = 'inGameMenu';
        document.getElementById('menu').style.display = 'block';
        document.getElementById(state.currScene).style.display = 'block';
        this.gameInterface.style.visibility = 'hidden';
    }
}