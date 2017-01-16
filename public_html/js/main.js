//Taille des tuiles (sur les tilesets et à l'écran)
const TILESIZE = 32;
const percentOfScreen = 5/100;
var tileSizeOnScreen = 0;

//Tilesets et images
var images = {
    init() {
        this.plume = new Image();
        this.pioche = new Image();
        this.main = new Image();
        this.ground = new Image();
        this.heros = new Image();
        this.items = new Image();
        this.monstres = new Image();
        this.inv = new Image(); 
        
        this.plume.src = 'img/plume.png';
        this.pioche.src = 'img/pioche.png';
        this.main.src = 'img/scroll.png';
        this.ground.src = 'img/tileset.png';
        this.heros.src = 'img/hero.png';
        this.items.src = 'img/items.png';
        this.monstres.src = 'img/monsters.png';
        this.inv.src = 'img/inv.png';
    },
    checkLoaded() {
        for(let key in this) {
            if(this.hasOwnProperty(key) && typeof(this[key]) !== 'function') {
                if(this[key].complete){
                    console.log(key + ' chargé');
                    continue;
                }
                else {
                    console.log(key + ' en cours de chargement !');
                    return false;
                }
            }
        }
        
        return true;
    }
};
images.init();

//canvas
var can = {
    init() {
        this.map = document.getElementById('map');
        this.mapContext = this.map.getContext('2d');
        
        this.items = document.getElementById('items');
        this.itemsContext = this.items.getContext('2d');
        
        this.perso = document.getElementById('map');
        this.persopContext = this.perso.getContext('2d');
        
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
    showUi(mode = 'opt') {
        this.ui.style.display = "block";
        this.uiControl(mode, true);
    },
    hideUi(mode = 'opt') {
        this.ui.style.display = "none";
        this.uiControl(mode, false);
    },
    uiControl(mode = 'opt', activate = false) {
        if(mode === 'opt') {
            if(activate) {
                window.addEventListener('keypress', this.uiOptManageKey);
                this.ui.addEventListener('click', this.uiOptManageMouse);
                console.log('Ajout des events pour options');
            }
            else {
                window.removeEventListener('keypress', this.uiOptManageKey);
                this.ui.removeEventListener('click', this.uiOptManageMouse);
                console.log('Suppresion des events pour options');
            }
        }
        else if(mode === 'inv') {
            if(activate) {
                window.addEventListener('keypress', this.uiInvManageKey);
                this.ui.addEventListener('mousedown', this.uiInvManageMouse);
                console.log('Ajout des events pour inventaire');
            }
            else {
                window.removeEventListener('keypress', this.uiInvManageKey);
                this.ui.removeEventListener('mousedown', this.uiInvManageMouse);
                console.log('Suppression des events pour inventaire');
            }
            
        }
    },
    uiOptManageKey() {
        console.log('keypress Opt');        
    },
    uiOptManageMouse() {
        console.log('clic');
    },
    uiInvManageKey() {
        console.log('keypress Inv');        
    },
    uiInvManageMouse() {
        console.log('mousedown');
    },
    showGame() {
        
    },
    hideGame() {
        
    },
    gameManageKey() {
        
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

function main() { 
    var test = false;
    images.checkLoaded();
    
    //Mise en place des canvas
    can.setSize();
    tileSizeOnScreen = Math.floor(can.size*percentOfScreen);  
    can.uiContext.drawImage(images.main, 0, 0, can.ui.width, can.ui.height);
    
    //ajuste la scène si l'écran change de taille
    window.addEventListener('resize', function() { 
        can.setSize();
        tileSizeOnScreen = Math.floor(can.size*percentOfScreen);
        can.uiContext.drawImage(images.main, 0, 0, can.ui.width, can.ui.height);
    });
    
    window.addEventListener('click', function() {
        if(test) {
            console.log('clic');
            can.showUi();
            test = false;
        }
        else {
            console.log('clic');
            can.hideUi();
            test = true;
        }
    });
}

//
//function getImage(url){
//    return new Promise(function(resolve, reject){
//        var img = new Image()
//        img.onload = function(){
//            resolve(url)
//        }
//        img.onerror = function(){
//            reject(url)
//        }
//        img.src = url
//    })
//}
//
//getImage('doggy.jpg').then(function(successurl){
//    document.getElementById('doggyplayground').innerHTML = '<img src="' + successurl + '" />'
//}).catch(function(errorurl){
//    console.log('Error loading ' + errorurl)
//})
//
//getImage('dog1.png').then(function(url){
//    console.log(url + ' fetched!')
//    return getImage('dog2.png')
//})
//                    .then(function(url){
//    console.log(url + ' fetched!')
//})
//
//var doggies = ['dog1.png', 'dog2.png', 'dog3.png', 'dog4.png', 'dog5.png']
//var doggypromises = doggies.map(getImage) // call getImage on each array element and return array of promises
////Chargement des images
//Promise.all(imgLoad).then(function(urls){console.log('Tout est chargé !')})
//                          .catch(function(urls){console.log('Erreur de chargement ...')});
 