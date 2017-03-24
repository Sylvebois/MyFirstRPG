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
    generate(mode = 'default') {
        for(let i = 0 ; i < nbTilesPerLine; i++) {
            this.carte[i] = [];
            for(let j = 0; j < nbTilesPerLine; j++) {
                this.carte[i][j] = {
                    'sol': new MapTile(i, j),
                    'fog': 0,
                    'item': false,
                    'monstre': false,
                    'hero': false
                };
            }
        }
    };
    addToMap(onMap) {
        
    }
}

