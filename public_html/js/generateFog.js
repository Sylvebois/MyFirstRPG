/*
 * Brouillard se decouvrant en fonction du champ de vision du hero
 */

//On commence par tout mettre en noir
fcxt.fillRect(0, 0, fCanvas.width, fCanvas.height);

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
        
delFog(hero.x, hero.y, hero.vis);

//On supprime en fonction de l'emplacement et du champ de vision
function delFog(xHero, yHero, champ) {            
    //Les cases decouvertes
    for(var tmp = champ; tmp >= 0; tmp --) {
        var cmpClear = 0;
        
        for(var x = xHero-tmp; x <= xHero+tmp; x++){		
            var y1 = yHero-cmpClear;
            var y2 = yHero+cmpClear;

            (x < xHero) ? cmpClear++ : cmpClear--;
            if(x >=0 && y1 >= 0 && y1 < ROWTILECOUNT){
                fog[y1][x] = 2;
                fcxt.clearRect(x*TILESIZE, y1*TILESIZE, TILESIZE, TILESIZE);
            }
            if(x >=0 && y2 >= 0 && y2 < ROWTILECOUNT){
                fog[y2][x] = 2;
                fcxt.clearRect(x*TILESIZE, y2*TILESIZE, TILESIZE, TILESIZE); 
            }          
        }
    }
    
    //Les cases semi-transparentes
    var cmpSemi = 0;
    
    fcxt.fillStyle = 'rgba(0, 0, 0, 0.5)';
    
    for(var x = xHero-champ-1; x <= xHero+champ+1; x++){		
        var y1 = yHero-cmpSemi;
        var y2 = yHero+cmpSemi;
        
        (x < xHero) ? cmpSemi++ : cmpSemi--;
        
        if(x >=0 && y1 >= 0 && y1 < ROWTILECOUNT) {
            fog[y1][x] = 1;
            fcxt.clearRect(x*TILESIZE, y1*TILESIZE, TILESIZE, TILESIZE);
            fcxt.fillRect(x*TILESIZE, y1*TILESIZE, TILESIZE, TILESIZE);
        }
        
        if(x >=0 && y2 >= 0 && y2 < ROWTILECOUNT) {
            fog[y2][x] = 1;
            fcxt.clearRect(x*TILESIZE, y2*TILESIZE, TILESIZE, TILESIZE);
            fcxt.fillRect(x*TILESIZE, y2*TILESIZE, TILESIZE, TILESIZE);
        }        
    }
}
