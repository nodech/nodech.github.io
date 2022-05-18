'use strict';

const size = document.getElementById('size');
const range = document.getElementById('range');
const redraw = document.getElementById('redraw');

let json = null;

redraw.onclick = () => {
  if (json)
    drawGraph(json);
};

(async () => {
  const res = await fetch('./tree-sync.json');

  if (!res.ok)
    throw new Error('Response not ok.');

  json = await res.json();

  drawGraph(json);
})().catch((e) => {
  console.error(e);
});

function parsePair(value, del, err) {
  const [w, h] = value.split(del);

  if (!w || !h)
    throw new Error(err);

  let width = parseInt(w);
  let height = parseInt(h);

  if (Number.isNaN(width) || Number.isNaN(height))
    throw new Error(err);

  return [width, height];
}

function drawGraph(info) {
  document.getElementById('viz').innerHTML = '';

  const [wcfg, hcfg] = parsePair(size.value, 'x', 'Wrong WIDTHxHEIGHT');
  const [from, to] = parsePair(range.value, '-', 'Wrong FROM-TO');

  if (from > to || from < 0 || to < 0)
    throw new Error('Wrong FROM-TO');

  let {data} = json;
  data = data.filter(d => d.height >= from && d.height <= to);

  const timeSorted = json.data.slice().sort((a, b) => a.ms > b.ms);
  const spaceSorted = json.data.slice().sort((a, b) => a.space > b.space);

  const stats = {
    height: {
      min: data[0].height,
      med: data[data.length / 2 | 0].height,
      max: data[data.length - 1].height
    },
    space: {
      min: spaceSorted[0].space,
      med: spaceSorted[spaceSorted.length / 2 | 0].space,
      max: spaceSorted[spaceSorted.length - 1].space
    },
    time: {
      min: timeSorted[0].ms,
      med: timeSorted[timeSorted.length / 2 | 0].ms,
      max: timeSorted[timeSorted.length - 1].ms
    }
  };

  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 60, bottom: 30, left: 60};
  const width = wcfg - margin.left - margin.right;
  const height = hcfg - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select('#viz')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')');

  // X axes we have height
  const x = d3.scaleLinear()
    .domain([stats.height.min, stats.height.max])
    .range([ 0, width ])

  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  // Left Y Axes - DISK SPACE
  const y = d3.scaleLinear()
    .domain([stats.space.min, stats.space.max])
    .range([ height, 0 ]);

  svg.append('g')
    .call(d3.axisLeft(y).tickFormat(formatSize));

  // RIGHT Y Axes - TIME TAKEN
  const y2 = d3.scaleLinear()
    .domain([stats.time.min, stats.time.max])
    .range([ height, 0 ]);

  svg.append('g')
    .attr('transform', `translate(${width}, 0)`)
    .attr('stroke', '#330000')
    .call(d3.axisRight(y2).tickFormat(formatTime))

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 0.5)
    .attr('d', d3.line()
      .x(d => x(d.height))
      .y(d => y2(d.ms))
    )

  // Add the line
  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5)
    .attr('d', d3.line()
      .x(d => x(d.height))
      .y(d => y(d.space))
    )

  // Create a rect on top of the svg area: this rectangle recovers mouse position
  svg
    .append('rect')
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .attr('width', width)
    .attr('height', height)
    .on('mousemove', mousemove);


  // This allows to find the closest X index of the mouse:
  const bisect = d3.bisector(d => d.height).left;

  // Create the circle that travels along the curve of chart
  var focus = svg
    .append('g')
    .append('line')
      .style('fill', 'none')
      .attr('stroke', 'black');

  // Create the text that travels along the curve of chart
  var focusText = svg
    .append('g')
    .append('text')
      .attr('text-anchor', 'left')
      .attr('alignment-baseline', 'middle')
      .attr('x', margin.left + 20)
      .attr('y', margin.top + 20);

  function mousemove() {
    // recover coordinate we need
    const x0 = x.invert(d3.mouse(this)[0]);
    const i = bisect(data, x0, 1);
    const cur = data[i];

    focus
      .attr('x1', x(cur.height))
      .attr('y1', 0)
      .attr('x2', x(cur.height))
      .attr('y2', height);

    focusText
      .html(
        `height: ${cur.height}, space: ${formatSize(cur.space)}, time: ${formatTime(cur.ms)}`
      );
  }
}

function formatSize(size) {
  if (size >= 1e9)
    return (size / 1e9).toFixed(2) + ' GB';

  if (size >= 1e6)
    return (size / 1e6).toFixed(2) + ' MB'

  if (size >= 1e3)
    return (size / 1e3).toFixed(2) + ' KB'

  return size + ' B';
}

function formatTime(ms) {
  if (ms >= 1e3)
    return (ms / 1e3).toFixed(3) + ' s';

  return ms.toFixed(2) + ' ms';
}
