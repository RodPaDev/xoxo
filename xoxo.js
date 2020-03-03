const canvas = document.getElementById("xoxo-canvas");
const width = 400;
const height = 400;

const Player1 = []
const Player2 = []


canvas.width = width;
canvas.height = height;

console.dir(canvas);

const ctx = canvas.getContext("2d");

(function drawGrid(
  context,
  columns,
  lineOffest = 50,
  lineWidth = 15,
  lineCap = "square"
) {
  const columnWidth = Math.floor(width / columns);
  const columnHeight = Math.floor(height / columns);

  context.lineWidth = lineWidth;
  context.lineCap = lineCap;

  for (let i = columnWidth; i < width - columnWidth; i += columnWidth) {
    context.beginPath();
    context.moveTo(i, lineOffest);
    context.lineTo(i, width - lineOffest);
    context.stroke();
  }

  for (let j = columnHeight; j < height - columnHeight; j += columnHeight) {
    context.beginPath();
    context.moveTo(lineOffest, j);
    context.lineTo(height - lineOffest, j);
    context.stroke();
  }
  console.log(context);
  context.save();
})(ctx, 3, 25, 10, "round");

function regionMappers(columns = 3) {
  let arr = [];
  const columnSize = Math.floor(width / columns);
  let x = columnSize;
  let y = columnSize;

  for (let i = 0; i < columns ** 2; i++) {
    arr.push([x, y]);
    x += columnSize;
    if (i % columns == columns - 1) {
      x = columnSize;
      y += columnSize;
    }
  }
  return arr;
}

function drawSymbol(context, region, isShapeO = false) {
  const half = (width / 3) / 2
  const x = region[0] - half
  const y = region[1] - half

  if (isShapeO) {
    context.beginPath();
    context.arc(x, y, 20, 0, 2 * Math.PI)
    context.stroke();
    return
  }
  context.beginPath();
  context.moveTo(x - 20, y - 20);
  context.lineTo(x + 20, y + 20);

  context.moveTo(x + 20, y - 20);
  context.lineTo(x - 20, y + 20);
  context.stroke();

}

function clickFunc(event) {
  const regions = regionMappers();
  x = event.layerX;
  y = event.layerY;
  const vector = [x, y];
  console.log("x:", x, "\ny:", y);

  for (region of regions) {
    if (x <= region[0] && y <= region[1]) {
      console.log(
        `x: ${x}, y: ${y}\nIs within range of x: ${region[0]}, y: ${region[1]}`
      );
      // we return the first time it return true
      drawSymbol(ctx, region)
      Player1.push(region)
      console.log(Player1)
      return
    }
  }
}

canvas.addEventListener("click", clickFunc, false);

function collect_plays() {
  plays = Player1;
  const cache = {}
  axis

  if(axis === 0){
    for(vector of plays){
      
    }
  }

}

/*
  [133, 133] [266, 133] [399, 133]

  [133, 266] [266, 266] [399, 266]

  [133, 399] [266, 399] [399, 399]
*/
