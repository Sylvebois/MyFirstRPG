function Map(url) {
    //Chargement et configuration du tileset    
    this.image = new Image();
    this.image.refTileSet = this;  
    this.image.onload = function() {
        if(!this.complete) {
            throw 'Erreur de chargement du tileset ' + url;
        }
    };
    this.image.src = 'images/' + url;
    
    this.numTiles = 16;       // Nombre de tuiles sur une ligne de notre image
    this.tileWidth = 32;
    this.tileHeight = 32;
}