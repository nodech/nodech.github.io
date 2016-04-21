//HEX to RGB
function hexToRGB(hex) {
  var valid = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
  var match = hex.match(valid);

  if (!match) {
    return null;
  }

  var nhex = normalizeHex(match[1]).toUpperCase();
  var rgb = {};

  rgb.r = color16to10(nhex.substr(0, 2));
  rgb.g = color16to10(nhex.substr(2, 2));
  rgb.b = color16to10(nhex.substr(4, 2));

  return rgb;
}

function normalizeHex(hex) {
  var len = hex.length;

  if (len == 6) return hex;

  return hex.split('').map(function (c) {
    return c + c;
  }).join('');
}

function color16to10(value) {
  var first  = digit16to10(value[0]);
  var second = digit16to10(value[1]);

  return first * 16 + second;
}

function digit16to10(digit) {
  var code = digit.toUpperCase().charCodeAt(0)

  if (code < 65) return code - 48;

  return code - 55;
}

//Main calculations
function calculateInfo(colorA, colorB, steps) {
  var color = {};

  color.min   = colorA;
  color.max   = colorB;
  color.diff  = colorB - colorA;
  color.norm  = normalizeNumber(colorA, colorB);
  color.stepX = color.diff / steps;
  color.steps = steps;

  return color;
}

function linearGradientEq(colorA, colorB, steps, fn) {
  colorA = hexToRGB(colorA);
  colorB = hexToRGB(colorB);
  steps  = steps || 0;
  steps  = steps < 0 ? 0 : steps;
  //steps++;

  var r = calculateInfo(colorA.r, colorB.r, steps);
  var g = calculateInfo(colorA.g, colorB.g, steps);
  var b = calculateInfo(colorA.b, colorB.b, steps);

  var colors = [colorA];

  for (var i = 1; i < steps; i++) {
    var x = Math.round(colorA.r + fn(r, i))
    colors.push({
      r : Math.round(colorA.r + fn(r, i)),
      g : Math.round(colorA.g + fn(g, i)),
      b : Math.round(colorA.b + fn(b, i))
    });
  }

  colors.push(colorB);

  return colors;
}

function normalizeNumber(min, max) {
  var diff = max - min;

  if (diff == 0) return 0;

  return 1 / (max - min);
}

function denormalizeNumber(number, diff) {
  return number * diff;
}

//equations

//y = x
function linearEquation(color, step) {
  var toCol = color.stepX * step;
  var calc = color.norm * toCol;

  return denormalizeNumber(calc, color.diff);
}

function quadraticEquation(color, step) {
  var toCol = color.stepX * step;
  var calc = Math.sqrt(color.norm * 2 * toCol)

  return denormalizeNumber(calc, color.diff);
}

