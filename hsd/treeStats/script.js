'use strict';

const size = document.getElementById('size');
const range = document.getElementById('range');
const redraw = document.getElementById('redraw');

const statNames = [
  'height', 'processingTime', 'growthSize', 'compactedSize', 'compactionTime'
];
const elements = {};
for (const id of statNames) {
  elements[id] = document.getElementById(id);
}

let json = null;

redraw.onclick = () => {
  if (json)
    drawGraph();
};

(async () => {
  const res = await fetch('./tree-data.json');

  if (!res.ok)
    throw new Error('Response not ok.');

  json = await res.json();

  drawGraph();
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

function drawGraph() {
  document.getElementById('viz').innerHTML = '';

  const [wcfg, hcfg] = parsePair(size.value, 'x', 'Wrong WIDTHxHEIGHT');
  const [from, to] = parsePair(range.value, '-', 'Wrong FROM-TO');

  if (from > to || from < 0 || to < 0)
    throw new Error('Wrong FROM-TO');

  let {stats, data} = json;
  data = data.filter(d => d.height >= from && d.height <= to);


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
  const heightX = d3.scaleLinear()
    .domain([stats.height.min, stats.height.max])
    .range([ 0, width ])

  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(heightX));

  // Left Y Axes - DISK SPACE
  const diskSizeLY = d3.scaleLinear()
    .domain([stats.growthSize.min, stats.growthSize.max])
    .range([ height, 0 ]);

  svg.append('g')
    .call(d3.axisLeft(diskSizeLY).tickFormat(formatSize));

  // RIGHT Y Axes - TIME TAKEN
  const processTimeRY = d3.scaleLinear()
    .domain([stats.processingTime.min, stats.compactionTime.max])
    .range([ height, 0 ]);

  svg.append('g')
    .attr('transform', `translate(${width}, 0)`)
    .call(d3.axisRight(processTimeRY).tickFormat(formatTime))

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#e87b06')
    .attr('stroke-width', 0.5)
    .attr('d', d3.line()
      .x(d => heightX(d.height))
      .y(d => processTimeRY(d.compactionTime))
    )

  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#e80a06')
    .attr('stroke-width', 0.5)
    .attr('d', d3.line()
      .x(d => heightX(d.height))
      .y(d => processTimeRY(d.processingTime))
    )

  // Add SIZE LINE
  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#063be8')
    .attr('stroke-width', 1.0)
    .attr('d', d3.line()
      .x(d => heightX(d.height))
      .y(d => diskSizeLY(d.growthSize))
    )

  // Add Compacted Size Line
  svg
    .append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#24b719')
    .attr('stroke-width', 1.0)
    .attr('d', d3.line()
      .x(d => heightX(d.height))
      .y(d => diskSizeLY(d.compactedSize))
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

  function mousemove() {
    // recover coordinate we need
    const x0 = heightX.invert(d3.mouse(this)[0]);
    const i = bisect(data, x0, 1);
    const cur = data[i];

    focus
      .attr('x1', heightX(cur.height))
      .attr('y1', 0)
      .attr('x2', heightX(cur.height))
      .attr('y2', height);

    elements['height'].innerHTML = cur.height;
    elements['processingTime'].innerHTML = formatTime(cur.processingTime);
    elements['growthSize'].innerHTML = formatSize(cur.growthSize);
    elements['compactedSize'].innerHTML = formatSize(cur.compactedSize);
    elements['compactionTime'].innerHTML = formatTime(cur.compactionTime);
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
  if (ms >= 1e3) {
    const seconds = ms / 1e3;

    if (seconds > 60)
      return (seconds / 60).toFixed(3) + ' min';

    return (ms / 1e3).toFixed(3) + ' sec';
  }

  return ms.toFixed(2) + ' ms';
}
