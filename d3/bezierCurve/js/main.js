var bodyDom   = d3.select('body'),
    svgWidth  = 800,
    svgHeight = 800;

var svg = bodyDom.append('svg')
              .attr('width', svgWidth)
              .attr('height', svgHeight);

var Points = [
  { control1 : [ 262, 249 ], control2 : [ 262, 249 ], dest : [ 262, 249 ] },
  { control1 : [ 295, 126 ], control2 : [ 164, 177 ], dest : [ 104, 322 ] },
  { control1 : [ 62,  451 ], control2 : [ 224, 483 ], dest : [ 261, 330 ] }
];

var removePoints = {
  startX : 250,
  startY : 5,
  width  : 50,
  height : 25
};

var drag = d3.behavior.drag()
  .origin(function (d) {
    var circle = d3.select(this);

    return { x : circle.attr('cx'), y : circle.attr('cy'), data : d };
  })
  .on('dragstart', function (d) {
    var circle = d3.select(this),
        name   = circle.attr('name');

    if (name === 'dest') {
      removePoint.classed('hide', false);
    }
  })
  .on('drag', function (d) {
    var circle = d3.select(this),
      name = circle.attr('name'),
      i    = d.key;

    Points[i][name][0] = d3.event.x;
    Points[i][name][1] = d3.event.y;

    positionPoints();
  })
  .on('dragend', function (d) {
    var circle = d3.select(this),
        name   = circle.attr('name'), x, y;

    if (name === 'dest') {
      x = circle.attr('cx');
      y = circle.attr('cy');

      if (x > removePoints.startX && x < removePoints.startX + removePoints.width &&
          y > removePoints.startY && y < removePoints.startY + removePoints.height &&
          Points.length > 1)
      {
        Points.splice(Points.indexOf(d), 1);
        Points[0].control1 = Points[0].control2 = Points[0].dest;

        updatePoints();
        positionPoints();
      }
      removePoint.classed('hide', true);
    }
  });

//Starting point
Points[0].control1 = Points[0].control2 = Points[0].dest;

var GROUPS = [];
function updatePoints() {
  var initData = svg.selectAll('g.point')
        .data(Points, function (d) {
          d.key = Points.indexOf(d);
          return Points.indexOf(d);
        }),
  pointGroup = initData.enter()
        .append('g')
        .classed('point', true);

  initData.exit().remove('g');

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
      .attr('class', 'ctrlPoint')
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
        circles = group.selectAll('circle.ctrlPoint'),
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


var newPoint = svg.append('g')
  .classed('newPoint', true)
  .on('click', function () {
    var lastPoint = Points[Points.length - 1];

    Points.push({
      control1 : [ lastPoint.dest[0] + 40, lastPoint.dest[1] + 20 ],
      control2 : [ lastPoint.dest[0] + 20, lastPoint.dest[1] + 40 ],
      dest     : [ lastPoint.dest[0] + 40, lastPoint.dest[1] + 40 ]
    });

    updatePoints();
    positionPoints();
  });

newPoint.append('circle')
  .attr('cx', 20)
  .attr('cy', 20)
  .attr('r', 5);

newPoint.append('text')
  .attr('x', 30)
  .attr('y', 25)
  .text('New Point');


var hideControllers = svg.append('g')
  .classed('hidePoints', true)
  .on('click', function () {
    var ctrl = d3.select(this);

    hide = !this.hidden;

    if (hide) {
      ctrl.select('text').text('+ Show Controllers');
    } else {
      ctrl.select('text').text('- Hide Controllers');
    }

    svg.selectAll('g.point circle.ctrlPoint').classed('hide', hide);
    svg.selectAll('g.point line').classed('hide', hide);

    this.hidden = hide;
  })
  .append('text')
  .attr('x', 120)
  .attr('y', 25)
  .text('-Hide Controllers');

removePoint = svg.append('rect')
  .classed('removeSpace', true)
  .classed('hide', true)
  .attr('x', 250)
  .attr('y', 5)
  .attr('width', 50)
  .attr('height', 25);

function extend(base, data) {
  for (var key in data) {
    base[key] = data[key];
  }

  return base;
}
