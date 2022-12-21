export default class Game {
    constructor(state) {
        this.tilesize = 32;
        this.gameInterface = document.getElementById('gameInterface');
        this.hud = document.getElementById('hud');
        this.gameZone = document.getElementById('gameZone');
        this.dialogBox = document.getElementById('dialog');
        this.dialogBox.addEventListener('click', e => this.dialogBox.style.display = 'none');
        this.dialogBox.style.display = 'none';

        this.canvases = this.initCanvases();
        this.images = this.initImages();
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

    initImages() {
        let result = new Map();
        let img = document.querySelectorAll('#assets img');
        for (let elem of img) { result.set(elem.id, elem) }
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
}