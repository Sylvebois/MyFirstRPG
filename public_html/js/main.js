//Taille des tuiles (sur les tilesets et à l'écran)
const TILESIZE = 32;
const percentOfScreen = 5/100;
var tileSizeOnScreen = 0;

//Chargement des images
var images = {
    imgList: ['plume.png', 'pioche.png', 'scroll.png', 'tileset.png', 'hero.png', 'items.png', 'monsters.png', 'inv.png'],
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
    //Chargement duformulaire de création
    let form = document.getElementById('createHero');
            
    //Vérification du chargement des images et des polices
    let promisesImgList = images.imgList.map(images.loadImage);
    let promisesFonts = document.fonts.ready;

    Promise.all([promisesImgList, promisesFonts])
        .then(() => {
            let view = new Game();
    
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
                        view.uiInventaire();
                        break;
                    default:
                        view.gameScreen();
                        break;
                }
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
                //let touche = e.keyCode || e.which;
                if( (can.state === 'opt' && (e.which === 79 || e.which === 27)) ||
                    (can.state === 'inv' && (e.which === 73 || e.which === 27))) {
                    can.state = 'jeu';
                    view.hideUi();
                    view.showGame();
                }
                else if (can.state === 'jeu') {
                    switch(e.which) {
                        case 37:
                            console.log("Touche left");
                            break;
                        case 38:
                            console.log("Touche up");
                            break;
                        case 39:
                            console.log("Touche right");
                            break;
                        case 40:
                            console.log("Touche down");
                            break;
                        case 73:
                            console.log("Touche I");
                            can.state = 'inv';
                            view.hideGame();
                            view.uiInventaire();
                            view.showUi();
                            break;
                        case 79:
                            console.log("Touche O");
                            can.state = 'opt';
                            view.hideGame();
                            view.uiScreen();
                            view.showUi();
                            break;
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
                
                form.style.display = 'none';    
                view.uiNextPage('Abandonner');
            };
            form.getElementsByTagName('button')[1].onclick = (e) => {
                e.preventDefault();
                
                let nbPointsLeft = document.getElementById('nbPoints').firstChild.nodeValue;
                
                if(nbPointsLeft === '0' && form.getElementsByTagName('nom').value !== '') {
                    form.style.display = 'none';    
                    view.uiNextPage();
                }
                else {
                    alert('Fiche incomplète');
                }
            };
        })
        .catch(() => {
            console.log('Erreur lors du chargement des images ou des polices');
        });
}