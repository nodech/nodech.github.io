var DATA_SOURCES = [ 'generator', 'json' ];
var DATA_SOURCE = null;

var DATA = [];
var GENERATOR = null;

var MIN = 0;
var MAX = 100;

var WIDTH = 500;
var HEIGHT = 500;
var BACKGROUND_COLOR = '#fff';

var DRAW_METHODS = {
  'moreblack' : MoreBlack,
  'diffcolors' : DifferentColors,
};

var GENERATORS = {
  'javascript' : function (min, max) {
    return Math.floor(Math.random() * Math.abs(max - min)) + min;
  }
};

var SOURCES = {
  'json' : function () {
    var data = [];
    try {
      var tmp = JSON.parse(gid('data').value);
      for (var i = 0; i < tmp.length; i++) {
        if (typeof tmp[i] != "number") continue;
        if (tmp[i] >= MAX || tmp[i] < MIN) continue;

        data.push(tmp[i]);
      }
    } catch(e) {
      alert('Couldn\'t parse JSON', e);
    }

    return {
      data  : data,
      count : data.length
    }
  },
  'generator' : function () {
    var generator = gid('generator-method').value;

    if (!generator || !GENERATORS[generator]) {
      alert('Couldn\'t find correct generator');
      return;
    }

    var count = parseInt(gid('generator-numbers').value, 10);

    if (isNaN(count)) {
      alert('count is not a number');
      return;
    }

    if (count < 0) {
      alert('Number count can\'t be negative');
      return;
    }

    let data = [];

    for (var i = 0; i < count; i++) {
      data.push(GENERATORS[generator](MIN, MAX))
    }

    return {
      data  : data,
      count : count
    }
  }
};

//RUN
//choose data
DATA_SOURCES.map(function (id, i, arr) {
  var getButton = function (id) { return gid('choose-' + id); };
  var getSource = function (id) { return select('.' + id);   };
  var hideBoth  = function () {
    arr.map(function (id) {
      getButton(id).setAttribute('class', '');
      getSource(id).style.display = 'none';
    })
  };

  document.getElementById('choose-' + id).onclick = function (el) {
    hideBoth();
    this.setAttribute('class', 'active');
    getSource(id).style.display = 'block';
    DATA_SOURCE = id;
  }
})


gid('rand-update').onclick = function () {
  var max = parseInt(gid('rand-max').value, 10);
  var min = parseInt(gid('rand-min').value, 10);

  
  if (isNaN(max) || isNaN(min)) {
    alert('Number wasn\'t correct');
    return;
  }

  MIN = min;
  MAX = max;
  UpdateRandoms();
};

gid('generator-update').onclick = gid('data-update').onclick = UpdateRandoms;

//Main Validator and executioner
function UpdateRandoms() {
  if (isNaN(MAX) || isNaN(MIN)) {
    alert('Couldn\'t find min/max');
    return;
  }

  if (MIN >= MAX) {
    alert('MIN and MAX should be different, MAX should be greater');
    return;
  }

  if (!DATA_SOURCE || !SOURCES[DATA_SOURCE]) {
    alert('Couldn\'t find data source');
    return;
  }

  var data = SOURCES[DATA_SOURCE]();

  if (!data) {
    alert('Sorry, couldn\'t get data');
    return;
  }

  var draw = DRAW_METHODS[gid('draw').value];

  if (!draw) {
    DRAW_METHODS['moreblack'](data);
    return
  }

  draw(data);
}


//DRAW MECHANISMS
function MoreBlack(data) {
  var rndMap = Array(MAX-MIN);

  updateCanvasSize(MAX-MIN);

  var min = MAX;
  var max = MIN;

  for (var i = 0; i < data.count; i++) {
    var n = data.data[i];
    var old = rndMap[n - MIN] || 0;

    rndMap[n - MIN] = old + 1;
    max = Math.max(old + 1, max);
    min = Math.min(old + 1, min);
  }

  min = min -1;

  var ctx = getCtx()
  var norm   = 1 / (max - min);
  var size   = csize(rndMap.length);

  var scaleX = WIDTH / size;
  var scaleY = HEIGHT / size;

  ctx.scale(scaleX, scaleY);

  gid('canvas-size').innerHTML = 'canvas: ' + WIDTH + 'x' + HEIGHT + ', '
    + 'scale: ' + scaleX + 'x' + scaleY + ', '
    + 'size: ' + size + 'x' + size + ', '
    + 'max number range:' + (WIDTH * HEIGHT);

  for (var i = 0; i < rndMap.length; i++) {
    var n = rndMap[i];

    if (!n || isNaN(n)) continue;

    var alpha = (n - min) * norm;
    var coords = numberToPixel(i, rndMap.length);

    ctx.fillStyle = 'rgba(0, 0, 0, ' + alpha + ')'
    ctx.fillRect(coords.x, coords.y, 1, 1);
  }
}

function DifferentColors(DATA) {
  data = DATA.data;

  updateCanvasSize(data.length);
  var colors = Math.pow(2, 24);
  var each = colors / (MAX - MIN);
  var ctx  = getCtx();
  var size = csize(data.length);

  var scaleX = WIDTH / size;
  var scaleY = HEIGHT / size;

  ctx.scale(scaleX, scaleY);

  gid('canvas-size').innerHTML = 'canvas: ' + WIDTH + 'x' + HEIGHT + ', '
    + 'scale: ' + scaleX + 'x' + scaleY + ', '
    + 'size: ' + size + 'x' + size
    + 'max numbers: ' + (WIDTH * HEIGHT);

  for (var i = 0; i < data.length; i++) {
    var n = data[i];
    var col = Math.round((n - MIN) * each);
    var coords = numberToPixel(i, data.length);

    ctx.fillStyle = base10ToHexColor(col);
    ctx.fillRect(coords.x, coords.y, 1, 1);
  }
}

//helpers
function updateCanvasSize(count) {
  var canvas = select('canvas');
  var ctx = canvas.getContext('2d');
  var size = csize(count);

  canvas.setAttribute('width', 500);
  canvas.setAttribute('height', 500);

  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, size, size + 1);
}

function numberToPixel(number, count) {
  var size = csize(count);
  var y    = Math.floor(number / size);
  var x    = number - (size * y);

  return { x : x, y : y };
}

function getCtx() {
  return select('canvas').getContext('2d');
}

function csize(count) {
  return Math.ceil(Math.sqrt(count))
}

function gid(id) {
  return document.getElementById(id);
}

function select(selector) {
  return document.querySelector(selector);
}

function toArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
}

function base10ToHexColor(num) {
  var str = num.toString(16);

  return '#' + '0'.repeat(6 - str.length) + str;
}
