/**
 * Cells Class
 */
function Cells(width, height) {
  this.width   = width;
  this.height  = height;
  this.buffer  = new ArrayBuffer(width * height);
  this._buffer = this.buffer.slice();
  this.data    = new Uint8Array(this.buffer);
  this._data   = new Uint8Array(this.buffer);
}

Cells.prototype.initEmptyData = function () {
  var self = this;

  this.iterate(function (x, y, idx) {
    self.data[idx] = self.random(CELL_TYPES.length);
  });
};

Cells.prototype.eat = function () {
  var self = this,
    tmp;

  this.iterate(function (x, y, idx) {
    var top    = self.coordToIdx(x, y - 1),
        bottom = self.coordToIdx(x, y + 1),
        left   = self.coordToIdx(x - 1, y),
        right  = self.coordToIdx(x + 1, y);

    self._data[idx] = self.eatRules(idx, [top, bottom, left, right]);
  });

  tmp = this.data;
  this.data = this._data;
  this._data = tmp;
};

Cells.prototype.eatRules = function (current, eaters) {
  var _eaters = [];
  current = this.data[current];

  for(var i = 0; i < eaters.length; i++) {
    var eater = eaters[i];

    if (eater === null) {
      continue;
    }

    eater = this.data[eater];

    if (CELL_TYPES[eater].eats.indexOf(CELL_TYPES[current].name) < 0) {
      continue;
    }
    _eaters.push(eater);
  }

  eaters = _eaters;

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

  return y * this.width + x;
};

Cells.prototype.IdxToCoord = function (idx) {
  if (idx >= this.data.length || idx < 0) {
    return null;
  }

  var x = idx % this.width;
  return [x, Math.floor(idx / x)];
};
