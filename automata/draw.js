'use strict';

var drawCell = document.getElementById('draw_cell'),
    drawers = document.querySelectorAll('div.drawer'),
    drawGuide = document.createElement('div'),
    selected = false,
    canvasStyles = window.getComputedStyle(window.canvas),
    CSS_WIDTH = parseInt(canvasStyles.getPropertyValue('width')),
    CSS_HEIGHT = parseInt(canvasStyles.getPropertyValue('height')),
    container = document.getElementById('container');

drawGuide.setAttribute('class', 'guide');
container.insertBefore(drawGuide, window.canvas);
container.onmousemove = function (e) {
  if (selected === false) {
    return;
  }

  drawGuide.style.left = (e.clientX - (selected[0] / 2)) + 'px';
  drawGuide.style.top  = (e.clientY - (selected[1] / 2)) + 'px';
};

container.onclick = function (e) {
  if (selected === false) {
    return;
  }

  var x, y, startX, endX, startY, endY, halfX, halfY;

  halfX = selected[0] / 2;
  halfY = selected[1] / 2;

  x = e.clientX - container.offsetLeft;
  y = e.clientY - container.offsetTop;

  startX = x - halfX;
  startY = y - halfY;
  endX = x + halfX;
  endY = y + halfY;

  updateCells(startX, startY, endX, endY);
};

(function initDrawCell() {
  for (var i = 0; i < CELL_TYPES.length; i++) {
    var option = document.createElement('option');

    option.setAttribute('value', i);
    option.innerHTML = CELL_TYPES[i].name;
    drawCell.appendChild(option);
  }

  drawCell.disabled = '';

  drawCell.onchange = changeColor;
  changeColor();
}());

(function initDrawers() {
  for (var i = 0, drawer; i < drawers.length; i++) {
    drawer = drawers[i];

    drawer.onclick = function () {
      selected = [this.dataset.sizeX, this.dataset.sizeY];
      drawGuide.style.display = 'block';
      drawGuide.style.width = this.dataset.sizeX + 'px';
      drawGuide.style.height = this.dataset.sizeY + 'px';
      drawGuide.style.backgroundColor = CELL_TYPES[drawCell.value].color;
    };
  }
}());

function changeColor() {
  var color = CELL_TYPES[drawCell.value].color;

  for (var i = 0, drawer, color; i < drawers.length; i++) {
    drawer = drawers[i];
    drawer.style.backgroundColor = color;
  }
};

function disselect() {
  selected = false;
  drawGuide.style.display = 'none';
}

function updateCells(startX, startY, endX, endY) {
  startX = recalcX(startX);
  startY = recalcY(startY);
  endX = recalcX(endX);
  endY = recalcY(endY);

  startX = fixCoord(startX, WIDTH);
  startY = fixCoord(startY, HEIGHT);
  endX = fixCoord(endX, WIDTH);
  endY = fixCoord(endY, HEIGHT);

  for (var y = startY; y < endY; y++) {
    for (var x = startX; x < endX; x++) {
      window.cells.data[window.cells.coordToIdx(x, y)] = drawCell.value;
    }
  }
  draw();
}

function recalcX(coord) {
  return Math.round(coord / CSS_WIDTH * WIDTH);
}

function recalcY(coord) {
  return Math.round(coord / CSS_HEIGHT * HEIGHT);
}

function fixCoord(num, max) {
  return Math.min(Math.max(num, 0), max);
}

