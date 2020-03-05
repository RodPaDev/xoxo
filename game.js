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
    this.winner = null;
  }

  msg() {
    if(this.rounds >= 9){
      this.msgElm.textContent = `XOXO it's a bloody draw`
      return;
    }
    if (this.winner !== null){
      this.msgElm.textContent = `XOXO ${this.currentPlayer.name} won the game`
      return;
    }
    this.msgElm.textContent = `${this.currentPlayer === this.P1 ? this.P2.name : this.P1.name}'s turn`
  }

  sum(arr) {
    return arr.reduce((a,b) => a + b, 0)
  }

  checkWin(){
    const x_axis_plays = this.currentPlayer.plays.x_axis
    const y_axis_plays = this.currentPlayer.plays.y_axis

    for(let axis_attribute in x_axis_plays){
      if(this.sum(x_axis_plays[axis_attribute]) >= 798){
        this.winner = this.currentPlayer;
        return;
      }
    }

    for(let axis_attribute in y_axis_plays){
      if(this.sum(y_axis_plays[axis_attribute]) >= 798){
        this.winner = this.currentPlayer;
        return;
      }
    }
    
  }

  play(event) {
    let x = event.layerX;
    let y = event.layerY;
    for(let region of this.regions){
      if( x <= region[0] && y <= region[1]) {
        if(this.playedRegions.includes(region)){
          return
        }
        
        this.playedRegions.push(region)
        this.rounds++
        this.currentPlayer.plays.collectAxisValues(region)
        this.currentPlayer.drawSymbol(region)
        console.log(this.currentPlayer.name, this.currentPlayer.plays)
        this.checkWin()
        this.msg()
        this.currentPlayer = this.currentPlayer === this.P1 ? this.P2 : this.P1
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
    this.plays = new Plays()
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
  constructor() {
    this.x_axis = {};
    this.y_axis = {};
  }
  
  collectAxisValues(vector) {
    if(this.x_axis.hasOwnProperty(vector[0])){
      this.x_axis[vector[0]].push(vector[1])
    }else{
      this.x_axis[vector[0]] = [];
      this.x_axis[vector[0]].push(vector[1])
    }

    if(this.y_axis.hasOwnProperty(vector[1]))
      this.y_axis[vector[1]].push(vector[0])
    else{
      this.y_axis[vector[1]] = [];
      this.y_axis[vector[1]].push(vector[0])
    }
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
