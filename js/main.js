import { buttons as buttonsText, forms as formsText, titles as titlesText } from './text.js';
import Loader from './scenes/Loader.js';
import Menu from './scenes/Menu.js';
import Game from './scenes/Game.js';

//Tiles size (on the tileset and on screen)
const TILESIZE = 32;
const nbTilesPerLine = 20;
var tileSizeOnScreen = 0;

let state = {
    currScene: 'loading',
    assets: { images: [], musics: [], sounds: [] },
    options: {
        language: 'fr',
        music: false,
        sound: false,
    },
    game: {
        levels: [],
        player: { name: '', st: 0, dx: 0, iq: 0, hp: 0, level: 0 }
    }
}

const updateText = newLang => {
    let allTitles = document.querySelectorAll('h2');
    allTitles.forEach(t => t.innerText = titlesText[t.className][newLang]);

    let allButtons = document.querySelectorAll('button');
    allButtons.forEach(b => b.innerText = buttonsText[b.className][newLang]);

    let allLabels = document.querySelectorAll('label');
    allLabels.forEach(l => l.innerText = formsText[l.htmlFor][newLang]);

    let optionSpans = document.querySelectorAll('#optionsForm span');
    optionSpans.forEach(s => s.innerText = formsText[s.className][newLang]);
}

window.onresize = e => console.log('resize');

window.onload = async (e) => {
    updateText(state.options.language);

    let loader = new Loader(state);
    let promisesImgList = loader.loadImg(state.assets.images);

    Promise.all(promisesImgList)
    .then(() => {
        let menu = new Menu(state);
        let game = new Game(state);

        loader.hideSpinner();
        loader.showButton();
        console.log(state)
    })
    .catch(error => console.log(error));
}

/*
//Loads Images
var images = {
    imgList: ['plume.png', 'pioche.png', 'scroll.png', 'tileset.png', 'hero.png', 'items.png', 'monsters.png', 'invBody.png', 'invThrow.png'],
    loadImage(name) {
        return new Promise( (resolve, reject) => {
            let paramName = name.split('.')[0];
            let url = 'img/' + name;

            images[paramName] = new Image();
            images[paramName].onload = () => resolve(console.log('ok - ' + name));
            images[paramName].onerror = () => reject(console.log('fail - ' + name));
            images[paramName].src = url;
        });
    }
};

//Loads Info zone
var info = {
    div : document.getElementById('info'),
    setPos() {
        if(window.innerWidth > window.innerHeight) {
            this.div.setAttribute('style', `width: ${window.innerWidth-can.items.width}px; height: ${window.innerHeight}px; top: 0; left: ${can.items.width}px`);
        }
        else {
            this.div.setAttribute('style', `width: ${window.innerWidth}px; height: ${window.innerHeight-can.items.height}px;`);
        }
    },
    addText(textToAdd, color = 'white') {
        let node = document.createElement('p');
        node.setAttribute('style', `color: ${color};`);
        let text = document.createTextNode(textToAdd);
        node.appendChild(text);
        this.div.appendChild(node);
    },
    removeText() {
        this.div.removeChild(this.div.childNodes[0]);
    }
};

//Loads and manage canvases
var can = {
    init() {
        this.state = 'acc';
        this.uiFrom = '';

        this.ratio = 1;

        this.map = document.getElementById('map');
        this.mapContext = this.map.getContext('2d');

        this.items = document.getElementById('items');
        this.itemsContext = this.items.getContext('2d');

        this.perso = document.getElementById('perso');
        this.persoContext = this.perso.getContext('2d');

        this.hud = document.getElementById('hud');
        this.hudContext = this.perso.getContext('2d');

        this.ui = document.getElementById('ui');
        this.uiContext = this.ui.getContext('2d');

        this.textPos = [null,null,null,null];

        this.setSize();
    },
    setSize() {
        this.size = Math.min(window.innerWidth, window.innerHeight);
        this.ratio = this.size/720; //720 = taille par défaut du canvas

        let canvases = document.getElementsByTagName('canvas');
        let container = document.getElementById('container');
        let form = document.getElementById('createHero');

        container.setAttribute('style', `width: ${this.size}px; height: ${this.size}px;`);

        if(form.style.display !== 'none'){
            form.setAttribute('style', `font-size: ${Math.floor(30*this.ratio)}px;`);
        }
        else {
            form.setAttribute('style', `font-size: ${Math.floor(30*this.ratio)}px; display: none;`);
        }

        for (let i = 0; i < canvases.length; i++) {
            canvases[i].setAttribute('width',this.size);
            canvases[i].setAttribute('height',this.size);
        }
    },
    checkClickText(e) {
        return new Promise((resolve, reject) => {
            let len = 0;

            switch(can.state) {
                case 'acc':
                    len = 2;
                    break;
                case 'opt':
                    len = 3;
                    break;
                case 'load':
                    len = 4;
                    break;
                default:
                    break;
            }

            for(let i = 0; i < len ; i++) {
                if( e.clientX >= can.textPos[i].x && e.clientX <= can.textPos[i].x + can.textPos[i].w &&
                    e.clientY >= can.textPos[i].y && e.clientY <= can.textPos[i].y + can.textPos[i].h) {
                        resolve(can.textPos[i].name);
                }
            }
            reject();
        });
    },
    checkClickTriangle(p, a, b, c) {
        let vect0 = [c[0]-a[0], c[1]-a[1]];
        let vect1 = [b[0]-a[0], b[1]-a[1]];
        let vect2 = [p[0]-a[0], p[1]-a[1]];

        let dot00 = (vect0[0]*vect0[0]) + (vect0[1]*vect0[1]);
        let dot01 = (vect0[0]*vect1[0]) + (vect0[1]*vect1[1]);
        let dot02 = (vect0[0]*vect2[0]) + (vect0[1]*vect2[1]);
        let dot11 = (vect1[0]*vect1[0]) + (vect1[1]*vect1[1]);
        let dot12 = (vect1[0]*vect2[0]) + (vect1[1]*vect2[1]);

        let invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

        let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return ((u >= 0) && (v >= 0) && (u + v < 1));
    }
};
can.init();

function main() {
    //Loads Hero's creation form and images
    let form = document.getElementById('createHero');
    let promisesImgList = images.imgList.map(images.loadImage);

    //Checks that all images and Fonts are loaded
    Promise.all(promisesImgList)
        .then(
            () => {
                //IE et Edge doesn't support document.fonts
                return (document.fonts)? document.fonts.load('12px enchantedLandRegular'): Promise.resolve();
            },
            () => {
                console.log('Erreur lors du chargement des images');
            }
        )
        .then(
            () => {
                let view = new Game();
                let world = new Dungeon();

                //Setting up canvases
                view.setBaseSizes();
                view.uiScreen();
                view.showUi();

                //Modify canvas size if screen size change
                window.onresize = () => {
                    view.setBaseSizes();

                    switch(can.state) {
                        case 'acc':
                        case 'opt':
                        case 'load':
                            view.uiScreen();
                            break;
                        case 'new':
                            view.uiNewGame();
                            break;
                        case 'story':
                            view.uiStory('intro');
                            break;
                        case 'inv':
                            view.uiInventaire(world.hero);
                            break;
                    }

                    view.gameScreen(world.carte[world.lvl], nbTilesPerLine-1);
                };

                //Add events on canvases
                can.hud.onclick = (e) => {
                    if(can.state === 'jeu') {
                        let newDirection = ['', 0];
                        let clickPos = [e.x,e.y];
                        let center = [can.size/2,can.size/2]
                        let triangleUp = [[0,0], [can.size,0]];
                        let triangleDown = [[0, can.size], [can.size, can.size]];
                        let triangleLeft = [[0,0], [0, can.size]];
                        let triangleRight = [[can.size,0], [can.size, can.size]];

                        if(can.checkClickTriangle(clickPos, triangleUp[0], triangleUp[1], center)) {
                            newDirection[0] = 'HAUT';
                            newDirection[1] = [world.hero.pos[0], world.hero.pos[1]-1];
                        }
                        else if(can.checkClickTriangle(clickPos, triangleDown[0], triangleDown[1], center)) {
                            newDirection[0] = 'BAS';
                            newDirection[1] = [world.hero.pos[0], world.hero.pos[1]+1];
                        }
                        else if(can.checkClickTriangle(clickPos, triangleLeft[0], triangleLeft[1], center)) {
                            newDirection[0] = 'GAUCHE';
                            newDirection[1] = [world.hero.pos[0]-1, world.hero.pos[1]];
                        }
                        else if(can.checkClickTriangle(clickPos, triangleRight[0], triangleRight[1], center)) {
                            newDirection[0] = 'DROITE';
                            newDirection[1] = [world.hero.pos[0]+1, world.hero.pos[1]];
                        }

                        if(newDirection[1] !== 0) {
                            world.checkAccess(newDirection[1][0], newDirection[1][1])
                                .then(
                                    () => {
                                        world.carte[world.lvl][world.hero.pos[0]][world.hero.pos[1]].hero = false;
                                        world.carte[world.lvl][newDirection[1][0]][newDirection[1][1]].hero = world.hero;

                                        world.hero.bouger(newDirection);

                                        world.checkItem(world.hero.pos[0], world.hero.pos[1]);
                                        world.cleanFog(world.hero.pos[0], world.hero.pos[1], world.hero.vision);
                                    },
                                    raison => {
                                        if(raison === 'fight') {
                                            world.hero.attaque(world.carte[world.lvl][newDirection[1][0]][newDirection[1][1]].monstre);
                                            world.carte[world.lvl][newDirection[1][0]][newDirection[1][1]].monstre.attaque(world.hero);
                                        }
                                    }
                                )
                                .then(
                                    () => view.gameScreen(world.carte[world.lvl], nbTilesPerLine-1)
                                );
                        }
                    }
                }
                can.ui.onclick = (e) => {
                    if(can.state === 'acc' || can.state === 'opt' || can.state === 'load') {
                        can.checkClickText(e)
                            .then(action => view.uiNextPage(action))
                            .catch(() => console.log('pas un clic utile'));
                    }
                    else if(can.state === 'story') {
                        view.uiNextPage();
                        view.gameScreen(world.carte[world.lvl], world.nbTilesPerLine-1);

                        info.addText('Bienvenue dans ce petit RPG !');
                        info.addText('Utilisez les flèches pour vous déplacer, "O" pour les options et "I" pour l\'inventaire');
                    }
                };
                can.ui.onmousemove = (e) => {
                    if(can.state === 'inv'){

                    };
                };
                can.ui.onmousedown = (e) => {
                    if(can.state === 'inv'){

                    };
                };
                window.onkeydown = (e) => {
                    if( (can.state === 'opt' && (e.which === 79 || e.which === 27)) ||
                        (can.state === 'inv' && (e.which === 73 || e.which === 27))) {
                        can.state = 'jeu';
                        view.hideUi();
                        view.showGame();
                    }
                    else if (can.state === 'jeu') {
                        let newDirection = ['', 0];

                        switch(e.which) {
                            case 37:
                                newDirection[0] = 'GAUCHE';
                                newDirection[1] = [world.hero.pos[0]-1, world.hero.pos[1]];
                                break;
                            case 38:
                                newDirection[0] = 'HAUT';
                                newDirection[1] = [world.hero.pos[0], world.hero.pos[1]-1];
                                break;
                            case 39:
                                newDirection[0] = 'DROITE';
                                newDirection[1] = [world.hero.pos[0]+1, world.hero.pos[1]];
                                break;
                            case 40:
                                newDirection[0] = 'BAS';
                                newDirection[1] = [world.hero.pos[0], world.hero.pos[1]+1];
                                break;
                            case 73: //I
                                can.state = 'inv';
                                view.hideGame();
                                view.uiInventaire(world.hero);
                                view.showUi();
                                break;
                            case 79: //O
                                can.state = 'opt';
                                view.hideGame();
                                view.uiScreen();
                                view.showUi();
                                break;
                        }

                        if(newDirection[1] !== 0) {
                            world.checkAccess(newDirection[1][0], newDirection[1][1])
                                .then(
                                    () => {
                                        world.carte[world.lvl][world.hero.pos[0]][world.hero.pos[1]].hero = false;
                                        world.carte[world.lvl][newDirection[1][0]][newDirection[1][1]].hero = world.hero;

                                        world.hero.bouger(newDirection);

                                        world.checkItem(world.hero.pos[0], world.hero.pos[1]);
                                        world.cleanFog(world.hero.pos[0], world.hero.pos[1], world.hero.vision);
                                    },
                                    raison => {
                                        if(raison === 'fight') {
                                            world.hero.attaque(world.carte[world.lvl][newDirection[1][0]][newDirection[1][1]].monstre);
                                            world.carte[world.lvl][newDirection[1][0]][newDirection[1][1]].monstre.attaque(world.hero);
                                        }
                                    }
                                )
                                .then(
                                    () => view.gameScreen(world.carte[world.lvl], nbTilesPerLine-1)
                                );
                        }
                    }
                };

                //Add events on form
                form.onchange = (e) => {
                    let inputs = form.getElementsByTagName('input');
                    let nbPoints = document.getElementById('nbPoints');
                    let points = 25;

                    for(let i = 0; i < inputs.length; i++) {
                        if(inputs[i].type === 'range') {
                            points -= parseInt(inputs[i].value);
                            document.getElementById(`show${inputs[i].id}`).innerHTML = inputs[i].value;
                        }
                    }

                    for(let i = 0; i < inputs.length; i++) {
                        if(inputs[i].type === 'range') {
                            let reste = points+parseInt(inputs[i].value);
                            let max = (reste <= 0)? 1 : reste;
                            document.getElementById(inputs[i].id).max = max;
                        }
                    }

                    document.getElementById('nbPoints').innerHTML = points;

                    if(points >= 0) {
                       nbPoints.style = 'color: #00ee00';
                    }
                    else {
                       nbPoints.style = 'color: #ff0000';
                    }
                };
                form.getElementsByTagName('button')[0].onclick = (e) => {
                    e.preventDefault();

                    document.getElementById('nbPoints').innerHTML = 25;

                    let inputs = form.getElementsByTagName('input');
                    for(let i = 0; i < inputs.length; i++) {
                        if(inputs[i].type === 'range') {
                            inputs[i].value = 1;
                            inputs[i].max = 22;
                            document.getElementById(`show${inputs[i].id}`).innerHTML = '1';
                        }
                        else {
                           inputs[i].value = '';
                        }
                    }

                    form.style.display = 'none';
                    view.uiNextPage('Abandonner');
                };
                form.getElementsByTagName('button')[1].onclick = (e) => {
                    e.preventDefault();

                    let nbPointsLeft = document.getElementById('nbPoints').firstChild.nodeValue;

                    if(nbPointsLeft === '0' && form.getElementsByTagName('nom').value !== '') {
                        let inputs = form.getElementsByTagName('input');

                        for(let i = 0; i < inputs.length; i++) {
                            if(inputs[i].type === 'range') {
                                world.hero.modSpecs(inputs[i].id.toLowerCase(), parseInt(inputs[i].value));
                                inputs[i].value = 1;
                                inputs[i].max = 22;
                                document.getElementById(`show${inputs[i].id}`).innerHTML = '1';
                            }
                            else {
                               world.hero.nom = inputs[i].value;
                               inputs[i].value = '';
                            }
                        }
                        world.hero.hpLeft = world.hero.end;
                        world.start();
                        form.style.display = 'none';
                        view.uiNextPage('Story');
                    }
                    else {
                        alert('Fiche incomplète');
                    }
                };
            },
            () => {
                console.log('Erreur lors du chargement des polices');
            }
        );
}
*/