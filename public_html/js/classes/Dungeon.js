/* 
 * Classe gérant les données des niveaux
 */
class Dungeon {
    constructor(){
        this.nbTilesPerLine = 20;
        this.carte = [];
        this.nbWall = 0;
        this.lvl = 0;
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
    };
    start(hero) {
        let mid = Math.floor(this.nbTilesPerLine/2)-1;
        
        this.generateMapBasics(true);
        
        //Changements spécifiques au niveau de départ
        this.carte[this.lvl][mid][0].sol.setType('ground');
        
        this.carte[this.lvl][mid][mid].item = new Item(mid, mid, 'StairDown', 0, 0, 0, 0, '');
        this.carte[this.lvl][mid][mid].item.imgPos = [3,1];
        
        hero.pos = [mid,1];
        hero.imgPos = hero.direction.BAS; 
        this.carte[this.lvl][mid][1].hero = hero;
        
        this.carte[this.lvl][mid][2].item = new Item(mid, 2, 'test');
        
        this.cleanFog(hero.pos[0], hero.pos[1], hero.vision);
    };
    generateMapBasics(withFog = true) {
        let fog = (withFog)? 2 : 0;
        this.nbWall = 0;
        this.carte[this.lvl] = [];
        
        for(let i = 0 ; i < this.nbTilesPerLine; i++) {
            this.carte[this.lvl][i] = [];
            
            for(let j = 0; j < this.nbTilesPerLine; j++) {
                let type = 'ground';
                
                if(i === 0 || i === this.nbTilesPerLine-1 || j === 0 || j === this.nbTilesPerLine-1) {
                    type = 'wall';    
                    this.nbWall++;
                }
                
                this.carte[this.lvl][i][j] = {
                    'sol': new MapTile(i, j, type),
                    'fog': fog,
                    'item': false,
                    'monstre': false,
                    'hero': false
                };
            }
        } 
    };
    generateStuff(type = 'item') {
        let count = 0;
        let nbMax = Math.floor((Math.pow(this.nbTilesPerLine,2) - this.nbWall)/4);
        let nb = Math.floor(Math.random() * nbMax + 1);  
        
        while (count < nb) {
            let x = Math.floor(Math.random() * this.nbTilesPerLine);
            let y = Math.floor(Math.random() * this.nbTilesPerLine);
            
            if(this.carte[this.lvl][x][y].sol.access && !this.carte[this.lvl][x][y].item && !this.carte[this.lvl][x][y].hero) {
                if(type === 'item') {
                   this.carte[this.lvl][x][y].item = new Item(x,y); 
                }
                else {
                    this.carte[this.lvl][x][y].monstre = new Monstre(x,y);
                    this.carte[this.lvl][x][y].sol.access = false;
                }
                count++;
            }
        }
    };
    cleanFog(x, y, visibility) {                
        for(let nbEtage = visibility; nbEtage >= 0; nbEtage--) {
            let cmp = 0;
            
            for(let i = x-nbEtage; i <= x+nbEtage; i++) {
                let y1 = y-cmp;
                let y2 = y+cmp;

                (i < x) ? cmp++ : cmp--;
            
                if(i >= 0 && i < nbTilesPerLine && y1 >= 0 && y1 < nbTilesPerLine) {
                    this.carte[this.lvl][i][y1].fog = 0;
                }
                if(i >= 0 && i < nbTilesPerLine && y2 >= 0 && y2 < nbTilesPerLine) {
                    this.carte[this.lvl][i][y2].fog = 0;
                }
            }
        } 
        
        let cmp = 0;
        for(let i = x-visibility-1; i <= x+visibility+1; i++){		
            let y1 = y - cmp;
            let y2 = y + cmp;
        
            (i < x) ? cmp++ : cmp--;
        
            if(i >= 0 && i < nbTilesPerLine && y1 >= 0 && y1 < nbTilesPerLine) {
                this.carte[this.lvl][i][y1].fog = 1;
            }

            if(i >= 0 && i < nbTilesPerLine && y2 >= 0 && y2 < nbTilesPerLine) {
                this.carte[this.lvl][i][y2].fog = 1;
            }        
        }
    };
    checkAccess(x,y) {
        return new Promise((resolve, reject) => {
            if(this.carte[this.lvl][x][y].sol.access) {
                resolve();
            }
            else if(this.carte[this.lvl][x][y].sol.typeSol === 'wall') {
                reject('wall');
            }
            else {
                reject('fight');
            }
        });
    };
    checkItem(x,y) {
        if(this.carte[this.lvl][x][y].item){
            if(this.carte[this.lvl][x][y].item.nom === 'StairDown') {
                this.lvl += (confirm('On descend ?'))? 1 : 0;
                this.goToLvl();
            }
            else if(this.carte[this.lvl][x][y].item.nom === 'StairUp') {
                this.lvl -= (confirm('On monte ?'))? 1 : 0;
                this.goToLvl();
            }
            else {
                this.carte[this.lvl][x][y].hero.rangerObjet(this.carte[this.lvl][x][y].item)
                    .then((itemName) => {
                        info.addText('Vous prenez ' + itemName, 'green');
                        this.carte[this.lvl][x][y].item = 0;
                    })
                    .catch(() => {
                        info.addText('Inventaire plein !', 'red');
                    });
            }
        }
    };
    goToLvl() {
        if(!this.carte[this.lvl]) {
            this.generateMapBasics(false);
        }
    }
}