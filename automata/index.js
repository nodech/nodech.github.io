var CELL_TYPES = [
  {
    name  : 'BLACK',
    color : '#000',
    eats  : [],
    prob  : []
  }, {
    name  : 'RED',
    color : '#f00',
    eats  : ['GREEN', 'BLACK'],
    prob  : [0.5, 0.8]
  }, {
    name  : 'GREEN',
    color : '#0f0',
    eats  : ['BLUE', 'BLACK'],
    prob  : [0.5, 0.8]
  }, {
    name  : 'BLUE',
    color : '#00f',
    eats  : ['YELLOW', 'BLACK'],
    prob  : [0.6, 0.7]
  }, {
    name  : 'YELLOW',
    color : '#ff0',
    eats  : ['RED', 'BLACK'],
    prob  : [0.6, 0.5]
  }
];

/**
 * Cells Class
 */
function Cells(width, height) {
  this.width  = width;
  this.height = height;
  this.data   = [];
}

Cells.prototype.initEmptyData = function () {
  var self = this;

  this.iterate(function (x, y, idx) {
    self.data[idx] = self.random(CELL_TYPES.length);
  });
};

Cells.prototype.eat = function () {
  var newData = new Array(this.data.length),
    self = this;

  this.iterate(function (x, y, idx) {
    var top    = self.coordToIdx(x, y - 1),
        bottom = self.coordToIdx(x, y + 1),
        left   = self.coordToIdx(x - 1, y),
        right  = self.coordToIdx(x + 1, y);

    newData[idx] = self.eatRules(idx, [top, bottom, left, right]);
  });

  this.data = newData;
};

Cells.prototype.eatRules = function (current, eaters) {
  var self = this;

  current = this.data[current];
  eaters = eaters.filter(function (eater) {
    if (eater === null) {
      return false;
    }
    return true;
  })
  .map(function (eater) {
    return self.data[eater];
  })
  .filter(function (eater) {
    if (CELL_TYPES[eater].eats.indexOf(CELL_TYPES[current].name) > -1) {
      return true;
    }

    return false;
  });

  if (eaters.length === 0) {
    return current;
  }

  var eater = eaters[this.random(eaters.length)],
    eaterCell   = CELL_TYPES[eater],
    currentCell = CELL_TYPES[current];

  if (Math.random() <= eaterCell.prob[eaterCell.eats.indexOf(currentCell.name)]) {
    return eater;
  }

  return current;
};

Cells.prototype.random = function (length) {
  return Math.floor(Math.random() * length);
};

Cells.prototype.iterate = function (cb) {
  var lastIdx = 0, response;

  y: for (var y = 0; y < this.height; y++) {
    x: for (var x = 0; x < this.width; x++) {
      lastIdx = this.coordToIdx(x, y);
      response = cb(x, y, lastIdx);

      if (response === 'break') {
        break y;
      }

      if (response === 'break x') {
        break x;
      }

      response = null;
    }
  }
};

Cells.prototype.coordToIdx = function (x, y) {
  if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
    return null;
  }

  return y * this.height + x;
};

Cells.prototype.IdxToCoord = function (idx) {
  if (idx >= this.data.length || idx < 0) {
    return null;
  }

  var x = idx % this.width;
  return [x, Math.floor(idx / x)];
};

/* ALL LOGIC GOES BELOW */
var canvas = document.createElement('canvas'),
  ctx = canvas.getContext('2d'),
  WIDTH = 200,
  HEIGHT = 200,
  requestAnimationFrame = window.requestAnimationFrame;

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
