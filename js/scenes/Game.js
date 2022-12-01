export default class Game {
    constructor(state) {
        this.tilesize = 32;
        this.canvases = this.initCanvases();
        this.images = this.initImages();
    }

    initCanvases() {
        let result = new Map();
        let tags = document.getElementsByTagName('canvas');
        for (let elem of tags) { result.set(elem.id, { can: elem, context: elem.getContext('2d') }) }
        return result;
    }

    initImages() {
        let result = new Map();
        let img = document.querySelectorAll('#assets img');
        for (let elem of img) { result.set(elem.id, elem) }
        return result;
    }
}