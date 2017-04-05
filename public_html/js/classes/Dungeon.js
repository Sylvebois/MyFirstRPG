/* 
 * Classe tournant autour de la génération des niveaux
 */
class Dungeon {
    constructor(){
        this.nbTilesPerLine = 20;
        this.carte = [];
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
    start() {
        let mid = Math.floor(this.nbTilesPerLine/2)-1;
        
        this.generateMapBasics();
        
        this.carte[this.lvl][mid][0].sol.setType('ground');
        this.carte[this.lvl][mid][mid].item = new Item(mid, mid, 'StairDown', 0, 0, 0, 0, '');
        this.carte[this.lvl][mid][mid].item.imgPos = [3,1];
    };
    generateMapBasics() {
        this.carte[this.lvl] = [];
        
        for(let i = 0 ; i < this.nbTilesPerLine; i++) {
            this.carte[this.lvl][i] = [];
            
            for(let j = 0; j < this.nbTilesPerLine; j++) {
                let type = 'ground';
                
                if(i === 0 || i === this.nbTilesPerLine-1 || j === 0 || j === this.nbTilesPerLine-1) {
                    type = 'wall';    
                }
                
                this.carte[this.lvl][i][j] = {
                    'sol': new MapTile(i, j, type),
                    'fog': 0,
                    'item': false,
                    'monstre': false,
                    'hero': false
                };
            }
        } 
    };
}

