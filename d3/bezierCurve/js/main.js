var bodyDom   = d3.select('body'),
    svgWidth  = 800,
    svgHeight = 800;

var svg = bodyDom.append('svg')
              .attr('width', svgWidth)
              .attr('height', svgHeight);

var Points = [
  { control1 : [ 20, 20 ],   control2 : [ 20, 20 ], dest : [ 20, 20 ] },
  { control1 : [ 50, 50 ],   control2 : [ 80, 100 ], dest : [ 100, 100 ] },
  { control1 : [ 120, 130 ], control2 : [ 180, 240 ], dest : [ 300, 400 ] }
];


var drag = d3.behavior.drag()
  .origin(function (d) {
    var circle = d3.select(this);

    return { x : circle.attr('cx'), y : circle.attr('cy'), data : d };
  })
  .on('drag', function (d, i) {
    var circle = d3.select(this),
      name = circle.attr('name');

    Points[i][name][0] = d3.event.x;
    Points[i][name][1] = d3.event.y;

    positionPoints();
  });

//Starting point
Points[0].control1 = Points[0].control2 = Points[0].dest;

var GROUPS = [];
function updatePoints() {
  var pointGroup = svg.selectAll('g')
        .data(Points, function (d) {
          d.key = Points.indexOf(d);
          return Points.indexOf(d);
        })
        .enter()
        .append('g');

  pointGroup.append('line');
  pointGroup.append('line');
  pointGroup.append('path');
  controlStyles(pointGroup.append('circle'), 'control1');
  controlStyles(pointGroup.append('circle'), 'control2');
  controlStyles(pointGroup.append('circle'), 'dest', {
    fill : 'black'
  });

  GROUPS = svg.selectAll('g')[0].map(function (group) {
    return d3.select(group);
  });

  function controlStyles(ctrlPoint, pointName, styles) {
    var defaultStyles = {
      fill   : '#ccc',
      stroke : 'blue',
      strokeWidth : 1,
      radius : 5
    };

    styles = extend(defaultStyles, styles);

    ctrlPoint
      .attr('name', pointName)
      .attr('fill', styles.fill)
      .attr('stroke', styles.stroke)
      .attr('stroke-width', styles.strokeWidth)
      .attr('r', styles.radius)
      .call(drag);
    return ctrlPoint;
  }
}

function positionPoints() {
  var groups  = GROUPS;

  groups.forEach(function (group) {
    var line1   = group.select('line:nth-child(1)'),
        line2   = group.select('line:nth-child(2)')
        circles = group.selectAll('circle'),
        path    = group.select('path');

    line1
      .attr('x1', function (d) { return d.control1[0]; })
      .attr('y1', function (d) { return d.control1[1]; })
      .attr('x2', function (d) { return getPrevious('dest', d.key)[0]; })
      .attr('y2', function (d) { return getPrevious('dest', d.key)[1]; });

    line2
      .attr('x1', function (d) { return d.control2[0]; })
      .attr('y1', function (d) { return d.control2[1]; })
      .attr('x2', function (d) { return d.dest[0]; })
      .attr('y2', function (d) { return d.dest[1]; });

    circles.each(function (d) {
      var circle = d3.select(this),
          name   = circle.attr('name');

      circle.attr('cx', d[name][0]);
      circle.attr('cy', d[name][1]);
    });

    path.attr('d', function (d) {
      var prevDest = getPrevious('dest', d.key);
      var pathData =
        'M ' + prevDest[0] + ',' + prevDest[1] +
        'C ' + d.control1[0] + ',' + d.control1[1] + ' ' +
               d.control2[0] + ',' + d.control2[1] + ' ' +
               d.dest[0] + ',' + d.dest[1];
      return pathData;
    });

  });

  function getPrevious(what, i) {
    if (i === 0) i = 1;
    if (!what) return Points[i - 1];

    return Points[i - 1][what];
  }
}

updatePoints();
positionPoints();



function extend(base, data) {
  for (var key in data) {
    base[key] = data[key];
  }

  return base;
}
