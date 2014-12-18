var canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d'),
  WIDTH = 200,
  HEIGHT = 200,
  requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
  cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;

canvas.setAttribute('width', WIDTH);
canvas.setAttribute('height', HEIGHT);

document.body.appendChild(canvas);

var cells = new Cells(WIDTH, HEIGHT);
cells.initEmptyData();

cells.iterate(function (x, y, idx) {
  ctx.fillStyle = CELL_TYPES[cells.data[idx]].color;
  ctx.fillRect(x, y, 1, 1);
});

function eatDraw() {
  cells.eat();
  cells.iterate(function (x, y, idx) {
    ctx.fillStyle = CELL_TYPES[cells.data[idx]].color;
    ctx.fillRect(x, y, 1, 1);
  });

  requestAnimationFrame(eatDraw);
}

requestAnimationFrame(eatDraw);
