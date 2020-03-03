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