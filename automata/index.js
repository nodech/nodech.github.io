var canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d'),
  WIDTH = 200,
  HEIGHT = 200,
  requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame,
  cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame,
  cells = new Cells(WIDTH, HEIGHT),
  stats = new Stats();

canvas.setAttribute('width', WIDTH);
canvas.setAttribute('height', HEIGHT);

//Setup Stats
stats.setMode(0); // 0: fps, 1: ms
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild(canvas);
document.body.appendChild(stats.domElement);

var cells = new Cells(WIDTH, HEIGHT);
cells.initEmptyData();

cells.iterate(function (x, y, idx) {
  ctx.fillStyle = CELL_TYPES[cells.data[idx]].color;
  ctx.fillRect(x, y, 1, 1);
});

function eatDraw() {
  stats.begin();
  cells.eat();
  cells.iterate(function (x, y, idx) {
    ctx.fillStyle = CELL_TYPES[cells.data[idx]].color;
    ctx.fillRect(x, y, 1, 1);
  });

  stats.end();
  requestAnimationFrame(eatDraw);
}

requestAnimationFrame(eatDraw);
