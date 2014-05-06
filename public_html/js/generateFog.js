/*
 * Brouillard se decouvrant en fonction du champ de vision du hero
 */

function delFog(xHero, yHero, champ) {
    var x = 0;
    var y1 = 0;
    var y2 = 0;
    
    //Les cases decouvertes
    for(var tmp = champ; tmp >= 0; tmp --) {
        var cmpClear = 0;
        
        for(x = xHero-tmp; x <= xHero+tmp; x++){		
            y1 = yHero-cmpClear;
            y2 = yHero+cmpClear;

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
    
    for(x = xHero-champ-1; x <= xHero+champ+1; x++){		
        y1 = yHero-cmpSemi;
        y2 = yHero+cmpSemi;
        
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
    
    fcxt.fillStyle = 'rgba(0, 0, 0, 1)';
}
