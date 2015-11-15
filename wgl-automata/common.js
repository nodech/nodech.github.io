'use strict';
//common functions to define

//canvas setup
window.WIDTH = 150;
window.HEIGHT = 150;
window.canvas = document.createElement('canvas');

window.canvas.setAttribute('width', WIDTH);
window.canvas.setAttribute('height', HEIGHT);

document.getElementById('container').appendChild(window.canvas);



//Setup Stats
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);

//status of cells
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

//go to full size
function full() {
  elem = window.canvas;

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
