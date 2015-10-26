
var win = getWindowSize();
var symbols = generateSymbols('ა', 'ჰ');
var count = 400;
var bodyEl = document.body;


createRandomSpans(count);

window.onresize = function () {
  console.log(getWindowSize());
};

function getWindowSize() {
  return {
    w : window.innerWidth,
    h : window.innerHeight
  };
}

function createRandomSpans(count) {
  var elems = [];

  for (var i = 0; i < count; i++) {
    var randPos = Math.round(Math.random() * (win.w - 10));
    var randSym = Math.round(Math.random() * (symbols.length - 1));
    var span = document.createElement('span');

    span.innerHTML = symbols[randSym];

    span.style.left = randPos + 'px';
    span.style.transform = generateRandomRotates();
    span.style.animationDuration = random(1, 6, 1) + 's';

    bodyEl.appendChild(span);
  }
}

function generateRandomRotates() {
  var x ='rotateX(' + random(0, 360) + 'deg) ';
  var y ='rotateY(' + random(0, 360) + 'deg) ';
  var z ='rotateZ(' + random(0, 360) + 'deg) ';

  return x + y + z;
}

function generateSymbols(start, end) {
  var arr = [];

  start = start.charCodeAt(0);
  end = end.charCodeAt(0);

  for (var i = start; i <= end; i++) {
    var sym = String.fromCharCode(i);
    arr.push(sym);
  }

  return arr;
}

function random(x, y, unround) {
  var base = Math.random() * Math.abs(y-x);
  var res = unround ? base : Math.round(base);

  return res + x;
}
