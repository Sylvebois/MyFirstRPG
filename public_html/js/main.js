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
        
        this.map = document.getElementById('map');
        this.mapContext = this.map.getContext('2d');
        
        this.items = document.getElementById('items');
        this.itemsContext = this.items.getContext('2d');
        
        this.perso = document.getElementById('perso');
        this.persoContext = this.perso.getContext('2d');
        
        this.ui = document.getElementById('ui');
        this.uiContext = this.ui.getContext('2d');
        
        this.setSize();
    },
    setSize() {
        this.size = Math.min(window.innerWidth, window.innerHeight);
        let canvases = document.getElementsByTagName('canvas');
    
        for (let valeur of canvases) {
            valeur.setAttribute("width",this.size);
            valeur.setAttribute("height",this.size);
        }
    },
    uiFontStyle(fontSize = 40, font = 'Arial', fontColor = 'black', align = 'center') {
        this.uiContext.fillStyle = fontColor;
        this.uiContext.textAlign = align;  
        this.uiContext.font = fontSize + 'px ' + font;
    },
    uiControl(activate = false) {
        if(this.state === 'acc') {
            if(activate) {
                this.ui.addEventListener('click', this.uiAccManageMouse);
                console.log('Ajout des events pour l\'accueil');
            }
            else {
                this.ui.removeEventListener('click', this.uiAccManageMouse);
                console.log('Suppresion des events pour l\'accueil');
            }    
        }
        else if(this.state === 'opt') {
            if(activate) {
                window.addEventListener('keydown', this.uiOptManageKey, false);
                this.ui.addEventListener('click', this.uiOptManageMouse);
                console.log('Ajout des events pour options');
            }
            else {
                window.removeEventListener('keydown', this.uiOptManageKey);
                this.ui.removeEventListener('click', this.uiOptManageMouse);
                console.log('Suppresion des events pour options');
            }
        }
        else if(mode === 'inv') {
            if(activate) {
                window.addEventListener('keydown', this.uiInvManageKey, false);
                this.ui.addEventListener('mousedown', this.uiInvManageMouse);
                console.log('Ajout des events pour inventaire');
            }
            else {
                window.removeEventListener('keydown', this.uiInvManageKey);
                this.ui.removeEventListener('mousedown', this.uiInvManageMouse);
                console.log('Suppression des events pour inventaire');
            }
            
        }
    },
    uiAccManageMouse(e) {
        console.log('clic');       
    },
    uiOptManageKey(e) {
        //let touche = e.keyCode || e.which;
        if(e.which === 79 || e.which === 27) {
            can.hideUi('opt');
            can.showGame();
        } 
    },
    uiOptManageMouse(e) {
        console.log('clic');
    },
    uiInvManageKey(e) {
        if(e.which === 73 || e.which === 27) {
            can.hideUi('inv');
            can.showGame();
        }       
    },
    uiInvManageMouse(e) {
        console.log('mousedown');
    },
    gameManageKey(e) {
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
                can.hideGame();
                can.showUi('inv');
                break;
            case 79:
                console.log("Touche O");
                can.hideGame();
                can.showUi('opt');
                break;
        }
        
    },
    drawLevel(map = null) {
        if (map) {                       
            for(let i = 0 ; i < map.length; i++) {
                for (let j = 0; j < map[i].length; j++)
                {
                    map[i][j].sol.draw(this.mapContext, images.tileset);     
                }
            }
        }
        else {
            console.log('Pas de map fournie ...');
        }
    },
    refreshLevel(map = null) {
        
    }
};
can.init();

//Le contenu de la carte
/*
    map[y][x] = {
        'sol': 0;
        'fog': 0;
        'item': 0;
        'monstre': 0;
        'hero': 0;
    }
*/
var mapTab = [];
for(let i = 0 ; i < 10; i++) {
    mapTab[i] = [];
    for(let j = 0; j < 10; j++) {
        mapTab[i][j] = {
            'sol': new MapTile(i, j),
            'fog': 0,
            'item': false,
            'monstre': false,
            'hero': false
        };
    }
}

function main() { 
    //Vérification du chargement des images et des polices
    let promisesImgList = images.imgList.map(images.loadImage);
    let promisesFonts = document.fonts.ready;

    Promise.all([promisesImgList, promisesFonts])
        .then(() => {
            var view = new Game();
    
            //Mise en place des canvas
            view.setBasics();
            view.uiMain(false);         
            view.showUi();

            //ajuste la scène si l'écran change de taille
            window.addEventListener('resize', function() { 
                view.setBasics();
                
                switch(can.state) {
                    case 'acc':
                        view.uiMain(true);
                        break;
                    case 'opt':
                        view.uiMain(false);
                        break;
                    case 'inv':
                        view.uiInventaire();
                        break;
                    default:
                        view.gameScreen();
                        break;
                }
            });
        })
        .catch(() => {
            console.log('Erreur lors du chargement des images ou des polices');
        });
}