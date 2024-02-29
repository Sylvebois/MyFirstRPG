export default class AnimationManager {
    constructor(state, drawer, tileSize) {
        this.state = state;
        this.drawer = drawer;
        this.tileSizeOnScreen = tileSize;
        this.isRunning = false;
    }
    #random(min, max) {
        return Math.random() * (max - min) + min;
    }
    gameover() {
        const duration = 5000;
        let maxTxtSize = 0;
        let startTime = null;

        this.isRunning = true;

        const anim = timestamp => {
            if (!startTime) { startTime = timestamp }

            const elapsed = timestamp - startTime;
            const progress = elapsed / duration;

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
                this.drawer.ctx.font = `${maxTxtSize}vw Sans serif`;
            }
            else {
                maxTxtSize = currTxtSize;
            }

            this.drawer.ctx.fillText(
                "GAME OVER",
                this.drawer.canvas.width / 2,
                this.drawer.canvas.height / 2,
                this.drawer.canvas.width
            );
            this.drawer.ctx.restore();

            if (elapsed > duration) {
                this.isRunning = false;
                this.state.clear();
                document.getElementById('menu').style.display = 'block';
                document.getElementById(this.state.currScene).style.display = 'block';
                document.getElementById('gameInterface').style.visibility = 'hidden';
            }
            else {
                requestAnimationFrame(anim);
            }
        }
        requestAnimationFrame(anim);
    }

    dying() {
        const duration = 3000;
        const gravity = 0.5;
        const heroAbs = {
            x: this.state.game.player.x * this.tileSizeOnScreen + this.drawer.camera.x,
            y: this.state.game.player.y * this.tileSizeOnScreen + this.drawer.camera.y
        }
        const heartImgData = [
            this.state.assets.images['newTileset'],
            5 * this.tileSizeOnScreen,
            1 * this.tileSizeOnScreen,
            this.tileSizeOnScreen,
            this.tileSizeOnScreen,
        ];
        let hearts = new Array(10).fill(null).map(elem => {
            return {
                x: heroAbs.x + this.tileSizeOnScreen / 2,
                y: heroAbs.y + this.tileSizeOnScreen / 2,
                vx: this.#random(-1, 3),
                vy: this.#random(-10, 0),
                size: 10,
                imageData: heartImgData
            };
        }
        );
        let startTime = null;

        this.isRunning = true;

        const anim = (timestamp) => {
            if (!startTime) { startTime = timestamp; }

            const elapsed = timestamp - startTime;
            const heroAlpha = 1 - elapsed / duration;

            this.drawer.ctx.clearRect(0, 0, this.drawer.canvas.width, this.drawer.canvas.height);
            this.drawer.drawLvl('heroGoLeft', false);

            //Hero
            this.drawer.ctx.save();
            this.drawer.ctx.globalAlpha = heroAlpha;
            this.drawer.ctx.drawImage(
                this.state.assets.images['newTileset'],
                2 * this.tileSizeOnScreen,
                0 * this.tileSizeOnScreen,
                this.tileSizeOnScreen,
                this.tileSizeOnScreen,
                heroAbs.x,
                heroAbs.y,
                this.tileSizeOnScreen,
                this.tileSizeOnScreen
            );
            this.drawer.ctx.restore();

            //Hearts
            for (let heart of hearts) {
                this.drawer.ctx.drawImage(
                    ...heart.imageData,
                    heart.x - heart.size / 2,
                    heart.y - heart.size / 2,
                    heart.size,
                    heart.size
                );

                heart.vy += gravity;
                heart.x += heart.vx;
                heart.y += heart.vy;

                //If heart touch limits reset to initial position
                if (heart.x - heart.size > heroAbs.x + this.tileSizeOnScreen ||
                    heart.x + heart.size < heroAbs.x - this.tileSizeOnScreen ||
                    heart.y - heart.size > heroAbs.y + this.tileSizeOnScreen ||
                    heart.y + heart.size < heroAbs.y - this.tileSizeOnScreen) {
                    heart.x = heroAbs.x + this.tileSizeOnScreen / 2;
                    heart.y = heroAbs.y + this.tileSizeOnScreen / 2;
                    heart.vx = this.#random(-1, 3);
                    heart.vy = this.#random(-10, 0);
                }
            }

            if (elapsed >= duration) {
                this.drawer.ctx.clearRect(0, 0, this.drawer.canvas.width, this.drawer.canvas.height);
                this.drawer.drawLvl('heroGoLeft', false);
                this.gameover();
            }
            else {
                requestAnimationFrame(anim);
            }
        }
        requestAnimationFrame(anim);
    }
}

