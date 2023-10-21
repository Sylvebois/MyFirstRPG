export class DrawManager {
  camera = { x: 0, y: 0 };

  static drawLvl(canvas, tileSizeOnScreen, state, heroDirection = 'heroGoLeft') {
    const gameData = state.game;
    const lvlDim = { w: gameData.levels[0].length, h: gameData.levels[0][0].length };
    const img = state.assets.images['newTileset'];
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
    const gameData = state.game;
    const img = state.assets.images['newTileset'];

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
}