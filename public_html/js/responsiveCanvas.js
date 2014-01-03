canvas = document.getElementById('playZone');
ctx = canvas.getContext('2d');
previousSize = {width: canvas.width, height: canvas.height};
 
imageLoader = new function() {
   this.background = new Image();
 
   // http://lunar.lostgarden.com/uploaded_images/ExteriorTest-760306.jpg
   this.background.setAttribute('data-small', 'http://sklambert.com/php/phpThumb/phpThumb.php?src=test.png&w=240');
   this.background.setAttribute('data-medium', 'http://sklambert.com/php/phpThumb/phpThumb.php?src=test.png&w=336');
   this.background.setAttribute('data-large', 'http://sklambert.com/php/phpThumb/phpThumb.php?src=test.png&w=512');
 
   this.backgroundSprite.onload = function() {
     previousSize = {width: canvas.width, height: canvas.height};
     canvas.width = imageLoader.background.width;
     canvas.height = imageLoader.background.height;
     ctx.drawImage(imageLoader.background, 0, 0);
    };
};

function removeQuotes(string) {
   if (typeof string === 'string' || string instanceof String) {
      string = string.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g, '');
   }
   return string;
}
 
function getBreakpoint() {
   var style = null;
   if ( window.getComputedStyle && window.getComputedStyle(document.body, '::before') ) {
      style = window.getComputedStyle(document.body, '::before');
      style = style.content;
   }
   return JSON.parse( removeQuotes(style) );
}
 
function setSource() {
   label = getBreakpoint();
   for (i in imageLoader) {
      var source = imageLoader[i].getAttribute('data-' + label.current);
      if (source != imageLoader[i].src) {
         imageLoader[i].src = source;
      }
   }
}
 
document.addEventListener("DOMContentLoaded", setSource);
window.onresize = setSource;

var xRatio = canvas.width / previousSize.width;
var yRatio = canvas.width / previousSize.width;
 
obj.x *= xRatio;
obj.y *= yRatio;
ctx.drawImage(image, obj.x, obj.y);