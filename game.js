class GameCanvas extends Game {
  constructor(width, height, canvas) {
    this.width = width;
    this.height = height;
    this.canvas = canvas;

    canvas.width = this.width;
    canvas.height = this.height;

    this.context = this.canvas.getContext("2d");
  }
}

class Grid extends GameCanvas {
  constructor(columns, width, context) {
    super(width, context);
    this.columns = columns;
    this.columnSize = Math.floor(width / columns);
    this.regions = [];
  }

  drawGrid(lineOffest = 50, lineWidth = 15, lineCap = "round") {
    const size = this.width - this.columnSize;
    this.context.lineWidth = lineWidth;
    this.context.lineCap = lineCap;

    for (let i = this.columnSize; i < size; i += this.columnSize) {
      this.context.beginPath();
      this.context.moveTo(i, lineOffest);
      this.context.lineTo(i, this.width - lineOffest);
      this.context.stroke();
    }

    for (let j = this.columnSize; j < size; j += this.columnSize) {
      this.context.beginPath();
      this.context.moveTo(lineOffest, j);
      this.context.lineTo(this.height - lineOffest, j);
      this.context.stroke();
    }
    this.context.save();
    return;
  }

  regionMappers() {
    let x = this.columnSize;
    let y = this.columnSize;

    for (let i = 0; i < this.columns ** 2; i++) {
      this.regions.push([x, y]);
      x += this.columnSize;
      if (i % this.columns == this.columns - 1) {
        x = this.columnSize;
        y += this.columnSize;
      }
    }
    return;
  }
}
class Player extends GameCanvas {
  constructor(name, symbol, isPlayerCPU = false, context, columnSize, regions) {
    super(context, columnSize, regions);
    this.name = name;
    this.symbol = symbol;
    this.isPlayerCPU = isPlayerCPU;
    this.plays = [];
    this.currentRegion = [];
  }

  drawSymbol() {
    const halfColumn = this.columnSize / 2;
    const x = this.currentRegion[0] - halfColumn;
    const y = this.currentRegion[0] - halfColumn;

    if (this.symbol.toLowerCase() === "o") {
      this.context.beginPath();
      this.context.arc(x, z, 20, 0, 2 * Math.PI);
      this.context.stroke();
      return;
    }
    this.context.beginPath()
    this.context.moveTo(x - 20, y - 20);
    this.context.lineTo(x + 20, y + 20);

    this.context.moveTo(x + 20, y - 20);
    this.context.lineTo(x - 20, y + 20);
    this.context.stroke();
  }
}

class Plays {
  constructor(x_axis, y_axis) {
    this.x_axis = x_axis;
    this.y_axis = y_axis;
    this.plays_count = 0;
  }
  // this could be replaced by incrementing the count each time it is played and changing it perhaps on the game level
  count_plays() {
    for (key in this.x_axis) {
      this.plays_count += key.length;
    }
    for (key in this.y_axis) {
      this.plays_count += key.length;
    }
    return;
  }
}

class Game {
  constructor(P1, P2) {
    this.P1 = P1;
    this.P2 = P2;
    this.currentPlayer = null; //this will be set to either P1 or P2
  }
}
