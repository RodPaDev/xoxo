"use strict";

class Game {
  constructor(P1, P2, regions, msgElm) {
    this.P1 = P1;
    this.P2 = P2;
    this.regions = regions;
    this.msgElm = msgElm;
    this.rounds = 0;
    this.currentPlayer = this.P1; //this will be set to either P1 or P2
    this.playedRegions = []
  }

  msg() {
    if(this.rounds >= 9){
      this.msgElm.textContent = `XOXO it's a bloody draw`
      return;
    }
    this.msgElm.textContent = `${this.currentPlayer.name}'s turn`
  
  }

  checkIfAlreadyPlayed(region){
    if(this.playedRegions.includes(region)){
      return
    }
  }

  play(event) {
    let x = event.layerX;
    let y = event.layerY;
    console.log("x:", x, "\ny:", y);
    
    for(let region of this.regions){
      if( x <= region[0] && y <= region[1]) {
        if(this.playedRegions.includes(region)){
          return
        }else{
          this.playedRegions.push(region)
        }

        this.rounds++
        // console.log(`x: ${x}, y: ${y}\nIs in x: ${region[0]}, y: ${region[1]}`);
        this.currentPlayer.drawSymbol(region)
        this.currentPlayer = this.currentPlayer === this.P1 ? this.P2 : this.P1
        this.msg()
        return;
      }
    }
  }

}

class GameCanvas {
  constructor(width, height, canvas) {
    this.width = width;
    this.height = height;
    this.canvas = canvas;

    canvas.width = width;
    canvas.height = height;

    this.context = this.canvas.getContext("2d");
  }
}

class Grid {
  constructor( width, context, columns) {
    this.width = width;
    this.context = context;
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
      this.context.lineTo(this.width - lineOffest, j);
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
class Player {
  constructor(name, symbol, isPlayerCPU = false, context, columnSize, regions) {
    this.context = context;
    this.columnSize = columnSize;
    this.regions = regions;
    this.name = name;
    this.symbol = symbol;
    this.isPlayerCPU = isPlayerCPU;
    this.plays = [];
    this.currentRegion = [];
  }

  drawSymbol(region) {
    this.currentRegion = region;
    const halfColumn = this.columnSize / 2;
    const x = this.currentRegion[0] - halfColumn;
    const y = this.currentRegion[1] - halfColumn;

    if (this.symbol.toLowerCase() === "o") {
      this.context.beginPath();
      this.context.arc(x, y, 20, 0, 2 * Math.PI);
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
const canvas = document.getElementById("xoxo-canvas");
const canvasInstance = new GameCanvas(400,400, canvas);
const gridInstance = new Grid(canvasInstance.width, canvasInstance.context, 3)
gridInstance.drawGrid(25)
gridInstance.regionMappers()
const player_1 = new Player("P1", "X", false, canvasInstance.context, gridInstance.columnSize, gridInstance.regions)
const player_2 = new Player("P2", "O", false, canvasInstance.context, gridInstance.columnSize, gridInstance.regions)

const msgElement = document.getElementById("msg")
const game = new Game(player_1, player_2, gridInstance.regions, msgElement)

canvas.addEventListener('click', event =>{
  game.play(event)
}, false)
