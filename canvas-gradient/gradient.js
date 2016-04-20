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

// gradient
function gradientPoints(colorA, colorB, steps) {
  colorA = hexToRGB(colorA);
  colorB = hexToRGB(colorB);
  steps  = steps || 0;
  steps  = steps < 0 ? 0 : steps;

  steps++;

  var colors = [ colorA ];
  var step = {
    r : (colorA.r - colorB.r) / steps,
    g : (colorA.g - colorB.g) / steps,
    b : (colorA.b - colorB.b) / steps
  };

  for (var i = 1, prev; i < steps; i++) {
    prev = colors[i - 1];

    colors.push({
      r : prev.r - step.r,
      g : prev.g - step.g,
      b : prev.b - step.b
    });
  }

  colors.push(colorB);

  return colors;
}
