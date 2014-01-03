/*Création du formulaire de départ
var formulaire = document.createElement('form');
    formulaire.id = 'start_form';
var inputNom = document.createElement('input');
    inputNom.id = 'name_char';
    inputNom.name = inputNom.id;
    inputNom.type = 'text';
    inputNom.placeholder = 'Nom de votre personnage';
var label = document.createElement('label');
    label.setAttribute('for', inputNom.id);
    label.appendChild(document.createTextNode('Nom : '));
    
formulaire.appendChild(label);
formulaire.appendChild(inputNom);

document.body.insertBefore(formulaire, canvas);
*/


var personnage = new Hero();
var charpoints = 10;

personnage.userName = prompt('Le nom de votre personnage : ', personnage.userName);
alert('Bienvenue dans ce test rpg ' + personnage.userName + ' !');

personnage.classPerso = prompt('Choix de la classe de personnage : ');

switch (personnage.classPerso) {
    case 'Hitman':
        personnage.att = 5;
        personnage.def = 2;
        personnage.hp = 2;
        personnage.mp = 1;
    break;
    case 'Tank':
        personnage.att = 2;
        personnage.def = 5;
        personnage.hp = 2;
        personnage.mp = 1;
    break;
    case 'Mago':
        personnage.att = 1;
        personnage.def = 2;
        personnage.hp = 2;
        personnage.mp = 5;
    break;
    default:
        personnage.classPerso = 'Random';    
        personnage.att = rand(0, charpoints, 1);
        charpoints -= personnage.att;
        personnage.def = rand(0, charpoints, 1);
        charpoints -= personnage.def;
        personnage.hp = rand(0, charpoints, 1);
        charpoints -= personnage.hp;
        personnage.mp = charpoints;
}

alert(  'Voici votre fiche ' + personnage.userName + ' : ' + 
        '\n---   ---   ---   ---' + 
        '\nVous êtes un ' + personnage.classPerso + ' lvl ' + personnage.level + 
        '\nAttaque : ' + personnage.att +
        '\nDéfense : ' + personnage.def +
        '\n Vie : ' + personnage.hp + 
        '\n Magie : ' + personnage.mp
    );