/*
 * Placement aléatoire des monstres
 *
 * Le monstre est généré aléatoirement. 
 * Son lvl sera fonction du niveau de difficulté du dongeon et du niveau du héros
 * En mourrant, il laissera tomber l'arme
 * 
 */


//On cree un tableau vide pour commencer
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

var monstersNumTiles = 3;     // Nombre de tuiles sur une ligne de notre image
var monstersImage = new Image();
monstersImage.src = 'images/monsters.png';
tilesetImage.onload = placeMonster(hero.x, hero.y, item, ground);

function Monster(x, y) {
    var type = ['Gobelin', 'Orc', 'Zombie', 'Squelette', 'Démon', 'Naga'];
    var charPoints = 50;
    
    //Emplacement du monstre
    this.x = x;
    this.y = y;
            
    //Création du nom en fonction du type de monstre et de son arme (ou pas)
    this.quelType = rand(0,5,1);    
    this.name = type[this.quelType] + ' désarmé';
    
    this.arme = 0;
    
    //Compare son arme actuelle avec celle au sol, choisit la plus puissante et modifie le nom du monstre
    this.compareArme = function(ArmeSol) {
        if(!Monster.arme) {
            var totActu = Monster.arme.st + Monster.arme.dx + Monster.arme.iq + Monster.arme.ht;
            var totSol = ArmeSol.st + ArmeSol.dx + ArmeSol.iq + ArmeSol.ht;
            
            Monster.arme = (totSol > totActu)? ArmeSol : Monster.arme;
        }
        else {
            Monster.arme = ArmeSol;
        }   
        Monster.name = type[Monster.quelType] + ' équipé d\'un(e) ' + Monster.arme.name;
    };
    
    //Caractéristiques ; l'ordre d'importance dépend du type de monstre
    switch(this.quelType) {
        case 0:
            this.dx = 20;
            charPoints -= this.dx;
            this.iq = rand(10,20,1);
            charPoints -= this.iq;
            this.ht = rand(1,charPoints-1,1);
            charPoints -= this.ht;
            this.st = charPoints;
            break;
        case 1:
            this.st = 20;
            charPoints -= this.st;
            this.ht = rand(10,20,1);
            charPoints -= this.ht;
            this.dx = rand(1,charPoints-1,1);
            charPoints -= this.dx;
            this.iq = charPoints;
            break;
        case 2:
            this.ht = 20;
            charPoints -= this.ht;
            this.st = rand(10,20,1);
            charPoints -= this.st;
            this.dx = rand(1,charPoints-1,1);
            charPoints -= this.dx;
            this.iq = charPoints;
            break;
        case 3:
            this.dx = 20;
            charPoints -= this.dx;
            this.st = rand(10,20,1);
            charPoints -= this.st;
            this.ht = rand(1,charPoints-1,1);
            charPoints -= this.ht;
            this.iq = charPoints;
            break;
        case 4:
            this.iq = 20;
            charPoints -= this.iq;
            this.st = rand(10,20,1);
            charPoints -= this.st;
            this.ht = rand(1,charPoints-1,1);
            charPoints -= this.ht;
            this.dx = charPoints;
            break;
        case 5:
            this.dx = 20;
            charPoints -= this.dx;
            this.ht = rand(10,20,1);
            charPoints -= this.ht;
            this.st = rand(1,charPoints-1,1);
            charPoints -= this.st;
            this.iq = charPoints;
            break;
        default:
                this.st = 10;
                this.dx = 10;
                this.iq = 10;
                this.ht = 10;
                break;

    }
}

//Place un certain nombre d'items en fonction de la taille du donjon et de la position de départ du héros
function placeMonster(x, y, avoidI, tabFree) {
    var cmp = 0;
    var nbMonsters = 0;
    var coord = [0,0];
    
    for(var i = tabFree.length-1; i >= 0; i--) {
        for(var j = tabFree[i].length-1; j >= 0; j--) {
            (tabFree[i][j] === 199) ? cmp++ : '';       //compte le nombre de cases disponible
        }
    }
    
    nbMonsters = rand(cmp/14, cmp/7, 1);                    //nombre de monstres à générer
    
    for(var k = nbMonsters; k >= 0 ; k--) {    
        do {
            coord = placeIt();
        }while(coord === x && coord[1] === y || avoidI[coord[1]][coord[0]] || enemies[coord[1]][coord[0]]); //Ne place pas de monstre sous la position de départ du héros ou s'il y a déjà un objet
        
        var tmp = new Monster(coord[0], coord[1]);
        enemies[coord[1]][coord[0]] = tmp;
    
        drawIt(ecxt, monstersImage, tmp, tmp.quelType, monstersNumTiles);
    }
}

function fight(x, y, joueur) {
    var cmp = 0;

    var tmp = enemies[y][x];
    var texteCombat = '';
    var texteIntro = 'Vous tombez nez à nez avec un(e) ' +  tmp.name + '!\n' +
                    'Force : ' + tmp.st + '\n' +
                    'Dextérité : ' + tmp.dx + '\n' +
                    'Intelligence : ' + tmp.iq + '\n' +
                    'Santé : ' + tmp.ht + '\n\n' +
                    'Le combat va commencer !';
    
    alert(texteIntro);
    
    while(joueur.ht > 0 || tmp.ht > 0) {
        var coup = rand(1,6,1);
        var parade = rand(1,6,1);
        
        //alternance attaque/défense entre joueur et ennemi
        var attaqueDe = (cmp%2 === 0)? joueur : tmp;
        var defenseDe = (cmp%2 === 0)? tmp : joueur;
   
        //En cas de coup critique
        var att = (coup === 6)? Math.floor(attaqueDe.st+attaqueDe.dx+attaqueDe.iq/3)+coup*2 : Math.floor(attaqueDe.st+attaqueDe.dx+attaqueDe.iq/3)+coup;
        var def = (parade === 6)? Math.floor(defenseDe.st+defenseDe.dx+defenseDe.iq/3)+parade*2 : Math.floor(defenseDe.st+defenseDe.dx+defenseDe.iq/3)+parade;
        
        texteCombat =   'Tour ' + (cmp+1) + ' :\n' +
                        '---------\n' +
                        attaqueDe.name + ' attaque l\'ennemi avec une puissance de ' + att + '\n' +
                        defenseDe.name + ' se défend avec ' + def + ' points\n\n';
        //Si dégâts
        if(att > def) {
            var result = Math.floor((att-def)/2);
            result = (result === 0)? 1 : result;
            defenseDe.ht -= result;
            texteCombat += defenseDe.name + ' perd ' + result + ' points de vie\n';
        }
        else {
            texteCombat += defenseDe.name + ' arrive à parer le coup de ' + attaqueDe.name + ' et ne perd aucun point de vie\n';
        }
        
        texteCombat += 'pv héros = '+joueur.ht+' - pv ennemi = '+tmp.ht;
        alert(texteCombat);
        cmp++;
        
        //En cas de mort de l'un des belligérants
        if(tmp.ht <= 0) {
            alert(tmp.name + ' s\'effondre après ce dernier assaut');
            ecxt.clearRect(x*TILESIZE, y*TILESIZE, TILESIZE, TILESIZE);
            enemies[y][x] = 0;
            break;
        }
        if(joueur.ht <= 0) {
            alert('Vous êtes gravement blessé et ne pouvez plus vous défendre ...\n' + tmp.name + ' n\'hésite pas à vous donner le coup de grâce !');
            if(confirm('GAME OVER !\nrecommencer ?')) {
                window.location.reload();
            }
            break;
        }
    }
}