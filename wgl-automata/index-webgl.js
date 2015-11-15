'use strict';

var error;
var request;

//canvas size
var WIDTH = 150;
var HEIGHT = 150;

//create canvas element
var canvas = document.createElement('canvas');
var gl = getWebGLContext(canvas);

//init cells
//TODO: move cell calculations to web worker
var cells = new Cells(WIDTH, HEIGHT);
var CELLS_COUNT = {};
cells.initEmptyData();

//stats
var status = document.getElementById('status');

if (!gl) {
  error = 'Your browser does not support WebGL!';
  alert(error);
  throw error;
}

//init canvas size
canvas.setAttribute('width', WIDTH);
canvas.setAttribute('height', HEIGHT);

//put some globals
window.canvas = canvas;
window.cells  = cells;
window.WIDTH  = WIDTH;
window.HEIGHT = HEIGHT;

//add canvas to container
document.getElementById('container').appendChild(canvas);

//init cells
function initCellCounts() {
  for (var i = 0; i < CELL_TYPES.length; i++) {
    CELLS_COUNT[CELL_TYPES[i].name] = 0;
  }
};

initCellCounts();

//Compile shaders and create Program
var program = createProgramFromSources(gl, [
  getSourceFromShaderFunction(vertexShader),
  getSourceFromShaderFunction(fragmentShader)
]);

gl.useProgram(program);

function vertexShader() {/*
  precision highp float;
  attribute vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0, 1);
  }
*/}

function fragmentShader() {/*
  precision highp float;

  void main() {
    gl_FragColor = vec4(0, 1, 0, 1);  // green
  }
*/}

function getSourceFromShaderFunction(source) {
  var src = source.toString().match(/[^\/]*\/\*([^]*)\*\/\}$/mi);

  return src[1];
}

//start 3d drawing
function draw() {
  console.log('trying to draw..');
  //cells.iterate(function (x, y, idx) {
  //  var CELL = CELL_TYPES[cells.data[idx]];

  //  CELLS_COUNT[CELL.name]++;
  //});
  //statusUpdate();
  //initCellCounts();
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
  console.log(request);
}

function start() {
  if (!request) {
    request = requestAnimFrame(eatDraw);
  }
}

function pause() {
  cancelAnimFrame(request);
  request = null;
}

function nextFrame() {
  if (request === null) {
    eat();
  }
}

