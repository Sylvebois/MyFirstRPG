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
        
delFog(posHero, heroVis);

//On supprime en fonction de l'emplacement et du champ de vision
function delFog(coord, champ) {
    var cmpSemi = 0;
    var cmpClear = 0;
    
    //Les cases decouvertes
    for(var x = coord[0]-champ; x <= coord[0]+champ; x++){		
        var y1 = coord[1]-cmpClear;
        var y2 = coord[1]+cmpClear;
        
        (x < coord[0]) ? cmpClear++ : cmpClear--;
        if(x >=0 && y1 >= 0){
            fog[y1][x] = 2;
        }
        if(x >=0 && y2 >= 0){
            fog[y2][x] = 2;
        }
        
        fcxt.clearRect(x*TILESIZE, y1*TILESIZE, TILESIZE, TILESIZE);
        fcxt.clearRect(x*TILESIZE, y2*TILESIZE, TILESIZE, TILESIZE);        
    }
    for(var y = coord[1]-champ+1; y <= coord[1]+champ-1; y++) { 
        for(var x = coord[0]-champ+1; x <= coord[0]+champ-1; x++) {  
            fcxt.clearRect(x*TILESIZE, y*TILESIZE, TILESIZE, TILESIZE);
            if(x >= 0 && y >= 0) {
                fog[y][x] = 2;
            }
        }
    }
    
    //Les cases semi-transparentes
    fcxt.fillStyle = 'rgba(0, 0, 0, 0.5)';			
    for(var x = coord[0]-champ-1; x <= coord[0]+champ+1; x++){		
        var y1 = coord[1]-cmpSemi;
        var y2 = coord[1]+cmpSemi;
        
        (x < coord[0]) ? cmpSemi++ : cmpSemi--;
        
        if(x >=0 && y1 >= 0) {
            fog[y1][x] = 1;
            fcxt.clearRect(x*TILESIZE, y1*TILESIZE, TILESIZE, TILESIZE);
            fcxt.fillRect(x*TILESIZE, y1*TILESIZE, TILESIZE, TILESIZE);
        }
        
        if(x >=0 && y2 >= 0) {
            fog[y2][x] = 1;
            fcxt.clearRect(x*TILESIZE, y2*TILESIZE, TILESIZE, TILESIZE);
            fcxt.fillRect(x*TILESIZE, y2*TILESIZE, TILESIZE, TILESIZE);
        }        
    }
}
