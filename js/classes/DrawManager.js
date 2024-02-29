export default class DrawManager {
  constructor(state, canvas, tileSize) {
    this.tileSizeOnScreen = tileSize;
    this.state = state;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.camera = { x: 0, y: 0 };
  }

  drawLvl(heroDirection = 'heroGoLeft', drawHero = true) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const mid = { w: width / 2, h: height / 2 };

    const img = this.state.assets.images['newTileset'];
    const gameData = this.state.game;
    const lvlDim = { w: gameData.levels[0].length, h: gameData.levels[0][0].length };

    const mapSizeAbs = {
      w: lvlDim.w * this.tileSizeOnScreen,
      h: lvlDim.h * this.tileSizeOnScreen
    };

    const heroAbs = {
      x: gameData.player.x * this.tileSizeOnScreen,
      y: gameData.player.y * this.tileSizeOnScreen
    };

    const distToBorder = {
      x: mapSizeAbs.w - heroAbs.x,
      y: mapSizeAbs.h - heroAbs.y
    };

    this.camera = {
      x: (heroAbs.x < mid.w) ? 0 : (distToBorder.x <= mid.w) ? -1 * (mapSizeAbs.w - width) : mid.w - heroAbs.x,
      y: (heroAbs.y < mid.h) ? 0 : (distToBorder.y <= mid.h) ? -1 * (mapSizeAbs.h - height) : mid.h - heroAbs.y
    }

    this.#drawCurrentLevel(gameData.levels[gameData.currLvl], img, heroDirection, drawHero);
  }

  drawFight(anim, heroDirection, scratch, text, monsterOrHero) {
    const img = this.state.assets.images['newTileset'];
    const gameData = this.state.game;

    gameData.levels[gameData.currLvl].forEach((x, idx) => x.forEach((tile, idy) => {
      const commonData = [
        img.data.tileSize,
        img.data.tileSize,
        this.tileSizeOnScreen * idx + this.camera.x,
        this.tileSizeOnScreen * idy + this.camera.y,
        this.tileSizeOnScreen,
        this.tileSizeOnScreen
      ];

      this.ctx.drawImage(
        img,
        img.data[tile.type].x * img.data.tileSize,
        img.data[tile.type].y * img.data.tileSize,
        ...commonData
      );

      if (tile.content.artefact) {
        this.ctx.drawImage(
          img,
          img.data[tile.content.artefact.name].x * img.data.tileSize,
          img.data[tile.content.artefact.name].y * img.data.tileSize,
          ...commonData
        );
      }

      if (tile.content.monster) {
        if (monsterOrHero !== 'monster' || idx !== anim.x || idy !== anim.y) {
          this.ctx.drawImage(
            img,
            img.data[tile.content.monster.name].x * img.data.tileSize,
            img.data[tile.content.monster.name].y * img.data.tileSize,
            ...commonData
          );
        }
      }

      if (tile.content.hero && monsterOrHero === 'monster') {
        this.ctx.drawImage(
          img,
          img.data[heroDirection].x * img.data.tileSize,
          img.data[heroDirection].y * img.data.tileSize,
          ...commonData
        );
      }

      if (tile.fogLvl > 0) {
        this.ctx.fillStyle = tile.fogLvl === 2 ? 'black' : 'rgba(0,0,0,0.5)';
        this.ctx.fillRect(
          this.tileSizeOnScreen * idx + this.camera.x,
          this.tileSizeOnScreen * idy + this.camera.y,
          this.tileSizeOnScreen,
          this.tileSizeOnScreen
        );
      }
    }));

    this.ctx.drawImage(
      img,
      img.data[anim.name].x * img.data.tileSize,
      img.data[anim.name].y * img.data.tileSize,
      img.data.tileSize,
      img.data.tileSize,
      anim.current.x + this.camera.x,
      anim.current.y + this.camera.y,
      this.tileSizeOnScreen,
      this.tileSizeOnScreen
    );

    if (scratch.opacity > 0) {
      this.#drawScratch(scratch);
    }

    if (text.opacity > 0) {
      this.#drawFightText(text);
    }
  }

  drawInventory() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const images = this.state.assets.images;
    const hero = this.state.game.player;
    const lvlDim = { w: this.state.game.levels[0].length, h: this.state.game.levels[0][0].length };
    const slotSize = Math.floor(Math.min(width / 12, height / 5));
    const centering = {
      h: width / 2 - (hero.inventory.length / 2 * slotSize),
      v: height / 2 - (Object.entries(hero.body).length / 2 * slotSize)
    };

    this.ctx.clearRect(0, 0, width, height);
    this.#drawInventoryBackground(images['newTileset'], lvlDim, this.tileSizeOnScreen);
    this.#drawEquipmentSlots(images['newTileset'], height, slotSize, centering, hero);
    this.#drawInventorySlots(images['newTileset'], height, centering, slotSize, hero.inventory);
    this.#drawThrowButton(images['invThrow'], height, centering, slotSize, hero.inventory.length);
    this.#drawBody(images['invBody'], width, height, slotSize);
  }

  #drawInventoryBackground(img, lvlDim, tileSize) {
    for (let i = 0; i < lvlDim.w; i++) {
      for (let j = 0; j < lvlDim.h; j++) {
        this.ctx.drawImage(
          img,
          img.data['wall'].x * img.data.tileSize,
          img.data['wall'].y * img.data.tileSize,
          img.data.tileSize,
          img.data.tileSize,
          tileSize * i,
          tileSize * j,
          tileSize,
          tileSize
        );
      }
    }
  }

  #drawEquipmentSlots(img, canvasHeight, centering, slotSize, hero, fillColor = '#65AED8') {
    this.ctx.fillStyle = fillColor;

    let cmp = 0;
    const marginBottomLeft = Math.floor((canvasHeight - (4 * slotSize)) / 4);
    const marginBottomRight = Math.floor((canvasHeight - (5 * slotSize)) / 5);

    for (const prop in hero.body) {
      let x, y;

      if (cmp % 2 === 0) {
        x = centering.h + (hero.inventory.length - 1) * slotSize;
        y = (cmp / 2) * (marginBottomRight + slotSize);
      }
      else {
        x = centering.h;
        y = marginBottomLeft + Math.floor(cmp / 2) * (marginBottomLeft + slotSize);
      }

      const commonData = [x, y, slotSize, slotSize];

      this.ctx.strokeRect(...commonData);
      this.ctx.fillRect(...commonData);

      if (hero.body[prop]) {
        this.ctx.drawImage(
          img,
          img.data[hero.body[prop]].x * img.data.tileSize,
          img.data[hero.body[prop]].y * img.data.tileSize,
          ...commonData,
        );
      }
      cmp++;
    }
  }

  #drawInventorySlots(img, canvasHeight, centering, slotSize, inventory, fillColor = '#E09A23') {
    this.ctx.fillStyle = fillColor;

    inventory.forEach((slot, index) => {
      const commonData = [
        centering.h + index * slotSize,
        canvasHeight - 1 - slotSize,
        slotSize,
        slotSize
      ];

      this.ctx.strokeRect(...commonData);
      this.ctx.fillRect(...commonData);

      if (slot) {
        this.ctx.drawImage(
          img,
          img.data[slot.name].x * img.data.tileSize,
          img.data[slot.name].y * img.data.tileSize,
          ...commonData
        );
      }
    });
  }

  #drawThrowButton(img, canvasHeight, centering, slotSize, invLength) {
    this.ctx.drawImage(
      img,
      centering.h + invLength * slotSize,
      canvasHeight - 1 - slotSize,
      slotSize,
      slotSize
    );
  }

  #drawBody(img, canvasWidth, canvasHeight, slotSize) {
    this.ctx.drawImage(
      img,
      canvasWidth / 2 - 1.5 * slotSize,
      0,
      3 * slotSize,
      canvasHeight - slotSize
    );
  }

  #drawCurrentLevel(level, img, heroDirection, drawHero) {
    level.forEach((x, idx) => x.forEach((tile, idy) => {
      const commonData = [
        img.data.tileSize,
        img.data.tileSize,
        this.tileSizeOnScreen * idx + this.camera.x,
        this.tileSizeOnScreen * idy + this.camera.y,
        this.tileSizeOnScreen,
        this.tileSizeOnScreen
      ];

      this.ctx.drawImage(
        img,
        img.data[tile.type].x * img.data.tileSize,
        img.data[tile.type].y * img.data.tileSize,
        ...commonData
      );

      if (tile.content.artefact) {
        this.ctx.drawImage(
          img,
          img.data[tile.content.artefact.name].x * img.data.tileSize,
          img.data[tile.content.artefact.name].y * img.data.tileSize,
          ...commonData
        );
      }

      if (tile.content.monster) {
        this.ctx.drawImage(
          img,
          img.data[tile.content.monster.name].x * img.data.tileSize,
          img.data[tile.content.monster.name].y * img.data.tileSize,
          ...commonData
        );
      }

      if (tile.content.hero && drawHero) {
        this.ctx.drawImage(
          img,
          img.data[heroDirection].x * img.data.tileSize,
          img.data[heroDirection].y * img.data.tileSize,
          ...commonData
        );
      }

      if (tile.fogLvl > 0) {
        this.ctx.fillStyle = tile.fogLvl === 2 ? 'black' : 'rgba(0,0,0,0.5)';
        this.ctx.fillRect(
          this.tileSizeOnScreen * idx + this.camera.x,
          this.tileSizeOnScreen * idy + this.camera.y,
          this.tileSizeOnScreen,
          this.tileSizeOnScreen
        );
      }
    }))
  }

  #drawScratch(scratch) {
    const start = {
      x: 5 + scratch.x + this.camera.x,
      y: 5 + scratch.y + this.camera.y
    };

    const p1 = {
      x: start.x + this.tileSizeOnScreen / 30,
      y: start.y + this.tileSizeOnScreen / 3
    };

    const p2 = {
      x: start.x + this.tileSizeOnScreen / 3,
      y: start.y + this.tileSizeOnScreen / 30
    };

    const end = {
      x: start.x + this.tileSizeOnScreen - 5,
      y: start.y + this.tileSizeOnScreen - 5
    };

    this.ctx.fillStyle = `rgba(255,0,0,${scratch.opacity})`;

    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.bezierCurveTo(p1.x, p1.y, end.x, end.y, end.x, end.y);
    this.ctx.moveTo(start.x, start.y);
    this.ctx.bezierCurveTo(p2.x, p2.y, end.x, end.y, end.x, end.y);
    this.ctx.fill();
  }

  #drawFightText(text) {
    this.ctx.font = '2vw serif';
    this.ctx.fillStyle = `rgba(255,0,0,${text.opacity})`;
    this.ctx.fillText(
      text.text,
      text.x + this.camera.x,
      text.y + this.camera.y,
    );
  }
}