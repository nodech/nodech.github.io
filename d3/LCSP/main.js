//d3.json('./data.json', function (data) {
//  data.arrayOne.max = data.arrayTwo.max = 100;
//  data.arrayOne.min = data.arrayTwo.min = 1;

//  new LCSP(data.arrayOne, '#container');
//  new LCSP(data.arrayTwo, '#container');
//});

window.onload = function () {
  data = {};
  data.arrayOne = [
    51, 15, 15, 81, 25, 14, 12, 21, 61, 39, 19, 29, 68, 77, 21, 75, 30, 36, 6, 19, 59, 31, 61, 39, 51, 35, 91, 90, 48, 99
  ];

  data.arrayTwo = [
    59, 35, 1, 53, 14, 15, 64, 51, 53, 36 , 6, 19, 59, 91, 75, 81, 21, 43, 30, 59, 35
  ];

  data.arrayOne.max = data.arrayTwo.max = 100;
  data.arrayOne.min = data.arrayTwo.min = 1;

  new LCSP(data.arrayOne, '#container');
  new LCSP(data.arrayTwo, '#container');
};

function LCSP(data, container) {
  this.data      = data;
  this.container = d3.select(container).append('svg');
  this.width     = 1440;
  this.height    = 220;

  this.container
    .attr('class', 'axis')
    .attr('width', this.width)
    .attr('height', this.height);

  if (!this.container[0][0]) {
    throw new Error('Container was not found');
  }

  this.visualizer = new barVisualisation(this.container, {});
  this.visualizer.draw(this.data);
}

function barVisualisation (container, options) {
  this.container = container;
  this.width     = container.attr('width');
  this.height    = container.attr('height');

  var defaultOptions = {
    width  : 10,
    height : this.height,
    duration: 750,
    margin : {
      left   : 30,
      top    : 20,
      bottom : 20
    },
    barMargin : {
      left : 1
    }
  };

  if (!options || typeof options !== 'object') options = {};

  this.options   = extend(defaultOptions, options);
}

barVisualisation.prototype.draw = function (data) {
  var height = this.options.height - this.options.margin.top - this.options.margin.bottom;

  console.log(height);
  this.y = d3.scale.linear().range([0, height]).domain([100, 0]);

  this.axisY = d3.svg.axis()
    .scale(this.y)
    .orient('left')
    .tickFormat(d3.format('d'));

  this.container.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + this.options.margin.left + ', ' + this.options.margin.top + ')')
    .call(this.axisY)
    .selectAll('text')
      .style('font-size', '10px');

  var self = this;
  var bars = this.container
    .append('g')
    .attr('class', 'bars')
    .attr('transform', 'translate(' + self.options.margin.left + ', ' + self.options.margin.top + ')');

  var barEnter = bars.selectAll('g.bar').data(data).enter().append('g').attr('class', 'bar');

  var barHeight = function (d) {
    return d / data.max * (self.height - self.options.margin.top - self.options.margin.bottom);
  };

  barEnter
    .append('rect')
    .attr('width', self.options.width)
    .attr('height', 1)
    .attr('x', function (d, index) {
      return 2 + index * (self.options.width + self.options.barMargin.left);
    })
    .attr('y', function (d) {
      return self.options.height - barHeight(d) - self.options.margin.top - self.options.margin.bottom;
    })
    .transition()
    .duration(self.options.duration)
    .attr('height', barHeight);

  barEnter
    .append('text')
    .style('font-size', '11px')
    .attr('x', function (d, index) {
      return index * (self.options.width + self.options.barMargin.left);
    })
    .attr('y', +self.options.height - self.options.margin.top - self.options.margin.bottom)
    .attr('transform', function (d) {
      var textElem = d3.select(this);
      return 'rotate(-45 ' + textElem.attr('x') + ' ' + textElem.attr('y') + ')';
    })
    .attr('dy', '10px')
    .attr('dx', '-8px')
    .text(function (d) {
      return d;
    });
};


function extend(base, data) {
  for (var key in data) {
    base[key] = data[key];
  }

  return base;
}
