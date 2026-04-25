'use strict';

var canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d'),
  WIDTH = 150,
  HEIGHT = 150,
  requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame,
  cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame,
  cells = new Cells(WIDTH, HEIGHT),
  stats = new Stats(),
  request,
  status = document.getElementById('status'),
  CELLS_COUNT = {};

canvas.setAttribute('width', WIDTH);
canvas.setAttribute('height', HEIGHT);

window.canvas = canvas;
window.cells  = cells;
window.WIDTH  = WIDTH;
window.HEIGHT = HEIGHT;

//Setup Stats
stats.setMode(0); // 0: fps, 1: ms
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);

document.getElementById('container').appendChild(canvas);

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
  request = requestAnimationFrame(eatDraw);
}

function pause() {
  cancelAnimationFrame(request);
  request = null;
}

function start() {
  if (!request) {
    request = requestAnimationFrame(eatDraw);
  }
}

function nextFrame() {
  if (request === null) {
    eat();
  }
}

function full() {
  elem = canvas;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }
}

var logStatus = document.getElementById('status');
function statusUpdate() {
  var text = '';

  for (var i = 0, type = null; i < CELL_TYPES.length; i++) {
    type = CELL_TYPES[i];
    text += '<span style="color: ' + type.color +'">'
         + type.name + '</span> - ' + (CELLS_COUNT[type.name] / cells.data.length * 100).toString().substr(0, 5)
         + '%, ';
  }

  logStatus.innerHTML = text;
}
