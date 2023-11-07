export class DrawManager {
  camera = { x: 0, y: 0 };

  static drawLvl(canvas, tileSizeOnScreen, state, heroDirection = 'heroGoLeft') {
    const img = state.assets.images['newTileset'];
    const gameData = state.game;
    const lvlDim = { w: gameData.levels[0].length, h: gameData.levels[0][0].length };
    const mid = { w: canvas.can.width / 2, h: canvas.can.height / 2 };

    const mapSizeAbs = {
      w: lvlDim.w * tileSizeOnScreen,
      h: lvlDim.h * tileSizeOnScreen
    };

    const heroAbs = {
      x: gameData.player.x * tileSizeOnScreen,
      y: gameData.player.y * tileSizeOnScreen
    };

    const distToBorder = { x: mapSizeAbs.w - heroAbs.x, y: mapSizeAbs.h - heroAbs.y };

    this.camera = {
      x: (heroAbs.x < mid.w) ? 0 : (distToBorder.x <= mid.w) ? -1 * (mapSizeAbs.w - canvas.can.width) : mid.w - heroAbs.x,
      y: (heroAbs.y < mid.h) ? 0 : (distToBorder.y <= mid.h) ? -1 * (mapSizeAbs.h - canvas.can.height) : mid.h - heroAbs.y
    }

    gameData.levels[gameData.currLvl].forEach((x, idx) => x.forEach((tile, idy) => {
      const commonData = [
        img.data.tileSize,
        img.data.tileSize,
        tileSizeOnScreen * idx + this.camera.x,
        tileSizeOnScreen * idy + this.camera.y,
        tileSizeOnScreen,
        tileSizeOnScreen
      ];

      canvas.context.drawImage(
        img,
        img.data[tile.type].x * img.data.tileSize,
        img.data[tile.type].y * img.data.tileSize,
        ...commonData
      );

      if (tile.content.artefact) {
        canvas.context.drawImage(
          img,
          img.data[tile.content.artefact.name].x * img.data.tileSize,
          img.data[tile.content.artefact.name].y * img.data.tileSize,
          ...commonData
        );
      }

      if (tile.content.monster) {
        canvas.context.drawImage(
          img,
          img.data[tile.content.monster.name].x * img.data.tileSize,
          img.data[tile.content.monster.name].y * img.data.tileSize,
          ...commonData
        );
      }

      if (tile.content.hero) {
        canvas.context.drawImage(
          img,
          img.data[heroDirection].x * img.data.tileSize,
          img.data[heroDirection].y * img.data.tileSize,
          ...commonData
        );
      }

      if (tile.fogLvl > 0) {
        canvas.context.fillStyle = tile.fogLvl === 2 ? 'black' : 'rgba(0,0,0,0.5)';
        canvas.context.fillRect(
          tileSizeOnScreen * idx + this.camera.x,
          tileSizeOnScreen * idy + this.camera.y,
          tileSizeOnScreen,
          tileSizeOnScreen
        )
      }
    }))
  }

  static drawFight(canvas, tileSizeOnScreen, state, anim, heroDirection, scratch, text, monsterOrHero) {
    const img = state.assets.images['newTileset'];
    const gameData = state.game;

    gameData.levels[gameData.currLvl].forEach((x, idx) => x.forEach((tile, idy) => {
      const commonData = [
        img.data.tileSize,
        img.data.tileSize,
        tileSizeOnScreen * idx + this.camera.x,
        tileSizeOnScreen * idy + this.camera.y,
        tileSizeOnScreen,
        tileSizeOnScreen
      ];

      canvas.context.drawImage(
        img,
        img.data[tile.type].x * img.data.tileSize,
        img.data[tile.type].y * img.data.tileSize,
        ...commonData
      );

      if (tile.content.artefact) {
        canvas.context.drawImage(
          img,
          img.data[tile.content.artefact.name].x * img.data.tileSize,
          img.data[tile.content.artefact.name].y * img.data.tileSize,
          ...commonData
        );
      }

      if (tile.content.monster) {
        if (monsterOrHero !== 'monster' || idx !== anim.x || idy !== anim.y) {
          canvas.context.drawImage(
            img,
            img.data[tile.content.monster.name].x * img.data.tileSize,
            img.data[tile.content.monster.name].y * img.data.tileSize,
            ...commonData
          );
        }
      }

      if (tile.content.hero && monsterOrHero === 'monster') {
        canvas.context.drawImage(
          img,
          img.data[heroDirection].x * img.data.tileSize,
          img.data[heroDirection].y * img.data.tileSize,
          ...commonData
        );
      }

      if (tile.fogLvl > 0) {
        canvas.context.fillStyle = tile.fogLvl === 2 ? 'black' : 'rgba(0,0,0,0.5)';
        canvas.context.fillRect(
          tileSizeOnScreen * idx + this.camera.x,
          tileSizeOnScreen * idy + this.camera.y,
          tileSizeOnScreen,
          tileSizeOnScreen
        )
      }
    }))

    canvas.context.drawImage(
      img,
      img.data[anim.name].x * img.data.tileSize,
      img.data[anim.name].y * img.data.tileSize,
      img.data.tileSize,
      img.data.tileSize,
      anim.current.x + this.camera.x,
      anim.current.y + this.camera.y,
      tileSizeOnScreen,
      tileSizeOnScreen
    );

    if (scratch.opacity > 0) {
      const start = {
        x: 5 + scratch.x + this.camera.x,
        y: 5 + scratch.y + this.camera.y
      }
      const p1 = {
        x: start.x + tileSizeOnScreen / 30,
        y: start.y + tileSizeOnScreen / 3
      }
      const p2 = {
        x: start.x + tileSizeOnScreen / 3,
        y: start.y + tileSizeOnScreen / 30
      }
      const end = {
        x: start.x + tileSizeOnScreen - 5,
        y: start.y + tileSizeOnScreen - 5
      }
      canvas.context.fillStyle = `rgba(255,0,0,${scratch.opacity})`
      canvas.context.beginPath()
      canvas.context.moveTo(start.x, start.y)
      canvas.context.bezierCurveTo(p1.x, p1.y, end.x, end.y, end.x, end.y)
      canvas.context.moveTo(start.x, start.y)
      canvas.context.bezierCurveTo(p2.x, p2.y, end.x, end.y, end.x, end.y)
      canvas.context.fill()
    }

    if (text.opacity > 0) {
      canvas.context.font = "2vw serif";
      canvas.context.fillStyle = `rgba(255,0,0,${text.opacity})`
      canvas.context.fillText(
        text.text,
        text.x + this.camera.x,
        text.y + this.camera.y,
      )
    }
  }

  static drawInventory(canvas, tileSizeOnScreen, state) {
    const img = state.assets.images['newTileset'];
    const hero = state.game.player;
    const lvlDim = { w: state.game.levels[0].length, h: state.game.levels[0][0].length };
    const slotSize = Math.floor(Math.min(canvas.can.width / 12, canvas.can.height / 5));
    const centering = {
      h: canvas.can.width / 2 - (hero.inventory.length / 2 * slotSize),
      v: canvas.can.height / 2 - (Object.entries(hero.body).length / 2 * slotSize)
    }
    canvas.context.clearRect(0, 0, canvas.can.width, canvas.can.height);

    //Draw background
    for (let i = 0; i < lvlDim.w; i++) {
      for (let j = 0; j < lvlDim.h; j++) {
        canvas.context.drawImage(
          img,
          img.data['wall'].x * img.data.tileSize,
          img.data['wall'].y * img.data.tileSize,
          img.data.tileSize,
          img.data.tileSize,
          tileSizeOnScreen * i,
          tileSizeOnScreen * j,
          tileSizeOnScreen,
          tileSizeOnScreen
        );
      }
    }

    //Draw equipment slots
    canvas.context.fillStyle = '#65AED8';

    let cmp = 0;
    const marginBottomLeft = Math.floor((canvas.can.height - (4 * slotSize)) / 4);
    const marginBottomRight = Math.floor((canvas.can.height - (5 * slotSize)) / 5);

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

      canvas.context.strokeRect(...commonData);
      canvas.context.fillRect(...commonData);

      if (hero.body[prop]) {
        canvas.context.drawImage(
          img,
          img.data[hero.body[prop]].x * img.data.tileSize,
          img.data[hero.body[prop]].y * img.data.tileSize,
          ...commonData,
        );
      }
      cmp++;
    }

    //Draw inventory slots
    canvas.context.fillStyle = '#E09A23';

    hero.inventory.forEach((slot, index) => {
      const commonData = [
        centering.h + index * slotSize,
        canvas.can.height - 1 - slotSize,
        slotSize,
        slotSize
      ]

      canvas.context.strokeRect(...commonData);
      canvas.context.fillRect(...commonData);

      if (slot) {
        canvas.context.drawImage(
          img,
          img.data[slot.name].x * img.data.tileSize,
          img.data[slot.name].y * img.data.tileSize,
          ...commonData
        )
      }
    })


    //Draw details
    canvas.context.drawImage(
      state.assets.images['invThrow'],
      centering.h + hero.inventory.length * slotSize,
      canvas.can.height - 1 - slotSize,
      slotSize,
      slotSize
    );

    canvas.context.drawImage(
      state.assets.images['invBody'],
      canvas.can.width / 2 - 1.5 * slotSize,
      0,
      3 * slotSize,
      canvas.can.height - slotSize
    );
  }
}