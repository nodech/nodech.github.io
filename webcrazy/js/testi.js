
$(function () {
  var canvas = html2canvas();

  canvas.then(function (el) {
    drawOnTop(el);
  });
});

function drawOnTop(element) {
  var elem = $(element);
  elem.css({
    position : 'absolute',
    top : '0px',
    left : '0px',
    zIndex : '100'
  });

  $('body').append(elem);

  pixelAnimate(element);
}

function pixelAnimate(element) {
  var context = element.getContext('2d');

  context.fillStyle = 'rgb(0, 0, 0)';
  context.fillRect(0, 0, 100, 100);
}
