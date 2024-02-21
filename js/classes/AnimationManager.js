export default class AnimationManager {
    constructor(state, drawer, tileSize) {
        this.state = state;
        this.drawer = drawer;
        this.tileSizeOnScreen = tileSize;
        this.isRunning = false;
        this.startTime = null;
        this.duration = {gameover: 3000}
        this.maxTxtSize = 0;
    }
    gameover(timestamp){
        if (!this.startTime) { this.startTime = timestamp }

        const elapsed = timestamp - this.startTime;
        const progress = elapsed / this.duration.gameover;

        //black screen
        this.drawer.ctx.save();
        this.drawer.ctx.fillStyle = "black";
        this.drawer.ctx.globalAlpha = progress;
        this.drawer.ctx.fillRect(0, 0, this.drawer.canvas.width, this.drawer.canvas.height);
        this.drawer.ctx.restore();

        //text
        this.drawer.ctx.save();

        const currTxtSize = progress * 100;

        this.drawer.ctx.fillStyle = "white";
        this.drawer.ctx.font = `${currTxtSize}vw Sans serif`;
        this.drawer.ctx.textAlign = "center";
        this.drawer.ctx.textBaseline = "middle";

        const txtWidth = this.drawer.ctx.measureText("GAME OVER").width;

        if (txtWidth > this.drawer.canvas.width) {
            this.drawer.ctx.font = `${this.maxTxtSize}vw Sans serif`;
        }
        else {
            this.maxTxtSize = currTxtSize;
        }

        this.drawer.ctx.fillText("GAME OVER", this.drawer.canvas.width / 2, this.drawer.canvas.height / 2, this.drawer.canvas.width);
        this.drawer.ctx.restore();

        if (elapsed > this.duration.gameover) {
            this.isRunning = false;
           // this.playedDialogs = [];
            this.state.clear();
            //document.getElementById('menu').style.display = 'block';
            //document.getElementById(state.currScene).style.display = 'block';
            //this.gameInterface.style.visibility = 'hidden';
        }
        else {
            requestAnimationFrame(this.gameover.bind(this));
        }
    }
}

