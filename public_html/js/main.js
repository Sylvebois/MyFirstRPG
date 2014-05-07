/*
 * On trouve ici toutes les variables globales et les fonctions de départ
 * La plupart des valeurs sont exprimées sur base de la taille des tuiles et pas en px
 */

var TILESIZE = 32;            //Dimensions d'une tuile
var ROWTILECOUNT = 20;        // Nombre de tuiles qu'on met sur la hauteur
var COLTILECOUNT = 32;        // Nombre de tuiles qu'on met sur la largeur

//Récupère les canvas et leur contexte
var tCanvas = document.getElementById('terrain');
var iCanvas = document.getElementById('artefact');
var eCanvas = document.getElementById('enemies');
var jCanvas = document.getElementById('joueur');
var fCanvas = document.getElementById('fog');
var uCanvas = document.getElementById('ui');

var tcxt = tCanvas.getContext('2d');
var icxt = iCanvas.getContext('2d');
var ecxt = eCanvas.getContext('2d');
var jcxt = jCanvas.getContext('2d');
var fcxt = fCanvas.getContext('2d');
var ucxt = uCanvas.getContext('2d');

//Définition des différentes images
var heroesImage = new Image();
var itemsImage = new Image();
var monstersImage = new Image();
var groundImage = new Image();
var invImage = new Image();
var formImage = new Image();

heroesImage.src = 'images/hero.png';
itemsImage.src = 'images/items.png';
monstersImage.src = 'images/monsters.png';
groundImage.src = 'images/tileset.png';
invImage.src = 'images/inv.png';
formImage.src = 'images/scroll.png';

// Nombre de tuiles sur une ligne de notre image
var heroesNumTiles = 3;
var itemsNumTiles = 5;
var monstersNumTiles = 3;
var groundNumTiles = 16; 

//On cree un tableau vide pour les items
var item = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]; 

//Idem pour les ennemis
var enemies = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

//On rempli le sol avec des tuiles par defaut
var ground = [
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130],
    [130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130]
];

//On cree un tableau pour s'y retrouver 0=noir, 1=semi-transparent, 2=decouvert
var fog = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

function init() {   
    uCanvas.className = '';
    
    if(formImage.complete){ //Permet de s'assurer que l'image est bien chargée ?
        //Ecran d'accueil : background
        ucxt.drawImage(formImage,0,0);
        
        //Ecran d'accueil : textes
        ucxt.font = (2*TILESIZE) + 'px Verdana';
        ucxt.fillText('MyFirstRpg !', (COLTILECOUNT*TILESIZE)/2 - 5*TILESIZE, 5*TILESIZE, 10*TILESIZE);
        ucxt.fillRect((COLTILECOUNT*TILESIZE)/2 - 5*TILESIZE, 5*TILESIZE + 10 , 10*TILESIZE, 5);

        ucxt.font = TILESIZE + 'px Verdana';
        ucxt.fillText('Nouvelle partie', (COLTILECOUNT*TILESIZE)/2 - 3*TILESIZE, (ROWTILECOUNT*TILESIZE)/2 - TILESIZE, 6*TILESIZE);
        ucxt.fillText('Charger partie', (COLTILECOUNT*TILESIZE)/2 - 3*TILESIZE, (ROWTILECOUNT*TILESIZE)/2 + TILESIZE, 6*TILESIZE);
    }
    else {
        formImage.onload = function() { 
            //Ecran d'accueil : background
            ucxt.drawImage(formImage,0,0);
            
            //Ecran d'accueil : textes
            ucxt.font = (2*TILESIZE) + 'px Verdana';
            ucxt.fillText('MyFirstRpg !', (COLTILECOUNT*TILESIZE)/2 - 5*TILESIZE, 5*TILESIZE, 10*TILESIZE);
            ucxt.fillRect((COLTILECOUNT*TILESIZE)/2 - 5*TILESIZE, 5*TILESIZE + 10 , 10*TILESIZE, 5);

            ucxt.font = TILESIZE + 'px Verdana';
            ucxt.fillText('Nouvelle partie', (COLTILECOUNT*TILESIZE)/2 - 3*TILESIZE, (ROWTILECOUNT*TILESIZE)/2 - TILESIZE, 6*TILESIZE);
            ucxt.fillText('Charger partie', (COLTILECOUNT*TILESIZE)/2 - 3*TILESIZE, (ROWTILECOUNT*TILESIZE)/2 + TILESIZE, 6*TILESIZE);     
        };
    }
    

  
    var homeScreen = {
        handleEvent: function(e){
            var dim = getDim();
            var posX = (e.clientX - dim[2]) * dim[0];
            var posY = (e.clientY - dim[3]) * dim[1]; 

            if( posX >= (COLTILECOUNT*TILESIZE)/2 - 3*TILESIZE && posX <= (COLTILECOUNT*TILESIZE)/2 + 3*TILESIZE &&
                posY >= (ROWTILECOUNT*TILESIZE)/2 - 2*TILESIZE && posY <= (ROWTILECOUNT*TILESIZE)/2 - TILESIZE) {

                ucxt.clearRect(0, 0, COLTILECOUNT*TILESIZE, ROWTILECOUNT*TILESIZE);
                removeEvent(uCanvas, 'click', this);
                start();
            }
            else if(posX >= (COLTILECOUNT*TILESIZE)/2 - 3*TILESIZE && posX <= (COLTILECOUNT*TILESIZE)/2 + 3*TILESIZE &&
                    posY >= (ROWTILECOUNT*TILESIZE)/2 && posY <= (ROWTILECOUNT*TILESIZE)/2 + TILESIZE) {

                ucxt.clearRect(0, 0, COLTILECOUNT*TILESIZE, ROWTILECOUNT*TILESIZE);
                removeEvent(uCanvas, 'click', this);
                load();
            }    
        }
    };
    
    addEvent(uCanvas, 'click', homeScreen);
}

//Demarre une nouvelle partie
function start() {
    var validation = document.getElementById('submitHero');
    var createForm = document.getElementById('createHero');

    var hero = new Hero(0,0);       
    var level = 1;
    
    var validateForm = {
        handleEvent: function(e){
            var nom = document.getElementById('nom').value;
            var st = document.getElementById('force').value;
            var dx = document.getElementById('dexterite').value;
            var iq = document.getElementById('intellect').value;
            var ht = document.getElementById('sante').value;
            var total = 50-st-dx-iq-ht;

            if(!nom) {
                alert('Vous devez donner un nom à votre héros');
            }
            else if(total > 0) {
                alert('Vous avez encore des points à distribuer !');
            }
            else if (total < 0 || isNaN(total)) {
                alert('Il y a un petit problème :\n- Trop de points distribués\n- Vous avez entré autre chose que des chiffres\n- ?!?');
            }
            else {
                hero.name = nom;
                hero.st = st;
                hero.dx = dx;
                hero.iq = iq;
                hero.ht = ht;

                createForm.className = 'hidden';
                cleanIt(uCanvas, ucxt);
                removeEvent(validation, 'click', this);

                launch(hero, level);
            }    
        }
    };
    
    //affiche le formulaire
    ucxt.drawImage(formImage,0,0);
    createForm.className = '';
    
    //Valide les donnees du formulaire -> creation du heros
    addEvent(validation, 'click', validateForm);
}

//Charge une ancienne partie
function load() {
    
}

//Affiche la valeur à côté des sliders sur le formulaire de création du personnage
function showSpecsOnForm() {
    var st = document.getElementById('force');
    var dx = document.getElementById('dexterite');
    var iq = document.getElementById('intellect');
    var ht = document.getElementById('sante');
    var nbPoints = document.getElementById('nbPoints');
    
    var points = 50-st.value-dx.value-iq.value-ht.value;
    
    document.getElementById('showSt').innerHTML = ' ' + st.value;
    document.getElementById('showDx').innerHTML = ' ' + dx.value;
    document.getElementById('showIq').innerHTML = ' ' + iq.value;
    document.getElementById('showHt').innerHTML = ' ' + ht.value;
    document.getElementById('nbPoints').innerHTML = ' ' + points;
    
    st.max = ((50-dx.value-iq.value-ht.value) <= 0)? 1 : (50-dx.value-iq.value-ht.value);
    dx.max = ((50-st.value-iq.value-ht.value) <= 0)? 1 : (50-st.value-iq.value-ht.value);
    iq.max = ((50-dx.value-st.value-ht.value) <= 0)? 1 : (50-dx.value-st.value-ht.value);
    ht.max = ((50-dx.value-iq.value-st.value) <= 0)? 1 : (50-dx.value-iq.value-st.value);
    
    if(points > 0) {
        nbPoints.className = 'green';
    }
    else if (points < 0 || isNaN(points)) {
        nbPoints.className = 'red';
    }
    else {
        nbPoints.className = '';
    }
}



init();
