'use strict';

var ctx = window.canvas.getContext('2d');
var cells = new Cells(WIDTH, HEIGHT);
var CELLS_COUNT = {};
var request;


function initCellCounts() {
  for (var i = 0; i < CELL_TYPES.length; i++) {
    CELLS_COUNT[CELL_TYPES[i].name] = 0;
  }
};
initCellCounts();

var cells = new Cells(WIDTH, HEIGHT);
cells.initEmptyData();

cells.iterate(function (x, y, idx) {
  ctx.fillStyle = CELL_TYPES[cells.data[idx]].color;
  ctx.fillRect(x, y, 1, 1);
});

function draw() {
  cells.iterate(function (x, y, idx) {
    var CELL = CELL_TYPES[cells.data[idx]];

    CELLS_COUNT[CELL.name]++;
    ctx.fillStyle = CELL.color;
    ctx.fillRect(x, y, 1, 1);
  });
  statusUpdate();
  initCellCounts();
}

function eat() {
  cells.eat();
  draw();
}

function eatDraw() {
  stats.begin();
  eat();
  stats.end();
  request = requestAnimFrame(eatDraw);
}

function pause() {
  cancelAnimationFrame(request);
  request = null;
}

function start() {
  if (!request) {
    request = requestAnimFrame(eatDraw);
  }
}

function nextFrame() {
  if (request === null) {
    eat();
  }
}

