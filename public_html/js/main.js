//Taille des tuiles (sur les tilesets et à l'écran)
const TILESIZE = 32;
const nbTilesPerLine = 20;
var tileSizeOnScreen = 0;

//Chargement des images
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

//Chargement de la zone d'info
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

//Chargement et gestion des canvas
var can = {
    init() {
        this.state = 'acc';
        this.uiFrom = '';
        
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
        let canvases = document.getElementsByTagName('canvas');
        let container = document.getElementById('container');
        let form = document.getElementById('createHero');
        
        container.setAttribute('style', `width: ${this.size}px; height: ${this.size}px;`);
        
        if(form.style.display !== 'none'){
            form.setAttribute('style', `font-size: ${(this.size < 700)? 20 : 30}px;`);
        }
    
        for (let valeur of canvases) {
            valeur.setAttribute('width',this.size);
            valeur.setAttribute('height',this.size);
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
    }
};
can.init();

function main() { 
    //Chargement du formulaire de création et des images
    let form = document.getElementById('createHero');
    let promisesImgList = images.imgList.map(images.loadImage);  
    
    //Vérification du chargement des images et des polices
    Promise.all(promisesImgList)
        .then(
            () => { 
                //IE et Edge ne supportent pas document.fonts
                return (document.fonts)? document.fonts.load('12px enchantedLandRegular'): new Promise.resolve(); 
            },
            () => { 
                console.log('Erreur lors du chargement des images'); 
            }
        )
        .then(
            () => {
                let view = new Game();
                let world = new Dungeon();
                let hero = new Hero();

                //Mise en place des canvas
                view.setBaseSizes();
                view.uiScreen();         
                view.showUi();

                //Ajuste la scène si l'écran change de taille
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
                        case 'inv':
                            view.uiInventaire(hero);
                            break;
                    }
                    
                    view.gameScreen(world.carte[world.lvl], nbTilesPerLine-1);
                };

                //Ajout des évenements sur les canvas
                can.ui.onclick = (e) => {
                    if(can.state === 'acc' || can.state === 'opt' || can.state === 'load') {
                        can.checkClickText(e)
                            .then(action => view.uiNextPage(action))
                            .catch(() => console.log('pas un clic utile'));
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
                                newDirection[1] = [hero.pos[0]-1, hero.pos[1]];
                                break;
                            case 38:
                                newDirection[0] = 'HAUT';
                                newDirection[1] = [hero.pos[0], hero.pos[1]-1];
                                break;
                            case 39:
                                newDirection[0] = 'DROITE';
                                newDirection[1] = [hero.pos[0]+1, hero.pos[1]];
                                break;
                            case 40:
                                newDirection[0] = 'BAS';
                                newDirection[1] = [hero.pos[0], hero.pos[1]+1];
                                break;
                            case 73: //I
                                can.state = 'inv';
                                view.hideGame();
                                view.uiInventaire(hero);
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
                                        world.carte[world.lvl][hero.pos[0]][hero.pos[1]].hero = 0;
                                        world.carte[world.lvl][newDirection[1][0]][newDirection[1][1]].hero = hero;

                                        hero.bouger(newDirection);

                                        world.cleanFog(hero.pos[0], hero.pos[1], hero.vision);
                                        world.checkItem(hero.pos[0], hero.pos[1]);
                                    }, 
                                    raison => {
                                        if(raison === 'fight') {
                                            console.log('BASTOOOOON !');
                                        }
                                    }
                                )
                                .then(
                                    () => view.gameScreen(world.carte[world.lvl], nbTilesPerLine-1)
                                );
                        }
                    }
                };

                //Ajout des événements sur le formulaire
                form.onchange = (e) => {
                    let inputs = form.getElementsByTagName('input');
                    let nbPoints = document.getElementById('nbPoints');
                    let points = 50;

                    for(let input of inputs) {
                        if(input.type === 'range') {
                            points -= parseInt(input.value);
                            document.getElementById(`show${input.id}`).innerHTML = input.value;
                        }
                    }

                    for(let input of inputs) {
                        if(input.type === 'range') {
                            let reste = points+parseInt(input.value);
                            let max = (reste <= 0)? 1 : reste;
                            document.getElementById(input.id).max = max;
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
                    
                    document.getElementById('nbPoints').innerHTML = 50;
                    
                    let inputs = form.getElementsByTagName('input');
                    for(let input of inputs) {
                        if(input.type === 'range') {
                            input.value = 1;
                            document.getElementById(input.id).max = 47;
                            document.getElementById(`show${input.id}`).innerHTML = '';
                        }
                        else {
                           input.value = ''; 
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
                        
                        for(let input of inputs) {
                            if(input.type === 'range') {
                                hero.modSpecs(input.id.toLowerCase(), parseInt(input.value));
                            }
                            else {
                               hero.modSpecs(input.id, input.value);
                            }
                        }
                        world.start(hero);
                        form.style.display = 'none';
                        view.uiNextPage();
                        view.gameScreen(world.carte[world.lvl], world.nbTilesPerLine-1);
                        info.addText('Bienvenue dans ce petit RPG !');
                        info.addText('Utilisez les flèches pour vous déplacer, "O" pour les options et "I" pour l\'inventaire');
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