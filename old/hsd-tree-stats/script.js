'use strict';

class GraphParams {
  constructor() {
    this._graphSize = [1060, 500];
    this._range = [0, 120589];
    this.height = true;
    this.processingTime = true;
    this.growthSize = true;
    this.deltaGrowthSize = true;
    this.compactedSize = true;
    this.deltaCompactedSize = true;
    this.compactionTime = true;
  }

  get graphSize() {
    return this._graphSize[0] + 'x' + this._graphSize[1];
  }

  set graphSize(value) {
    try {
      this._graphSize = parsePair(value, 'x', 'Wrong WIDTHxHEIGHT');
    } catch (e) {
      alert(e.message);
    }
  }

  get range() {
    return this._range[0] + '-' + this._range[1];
  }


  set range(value) {
    try {
      this._range = parsePair(value, '-', 'Wrong FROM-TO');
    } catch (e) {
      alert(e.message);
    }
  }

  get graphSizePair() {
    return this._graphSize;
  }

  get rangePair() {
    return this._range;
  }

  createUSP() {
    const usp = new URLSearchParams();

    const setUSP = (name) => {
      if (!this[name])
        usp.set(name, 0)
    };

    usp.set('graphSize', this.graphSize);
    usp.set('range', this.range);

    setUSP('processingTime');
    setUSP('growthSize');
    setUSP('deltaGrowthSize');
    setUSP('compactedSize');
    setUSP('deltaCompactedSize');
    setUSP('compactionTime');

    return usp;
  }

  checkHash() {
    if (!window.location.hash)
      return;

    const usp = new URLSearchParams(window.location.hash.substr(1));
    const setLocal = (name) => {
      if (usp.get(name) != null)
        this[name] = usp.get(name);
    };

    const setLocalBool = (name) => {
      if (usp.get(name) != null)
        this[name] = usp.get(name) === '0' ? false : true;
    };

    setLocal('graphSize');
    setLocal('range');

    setLocalBool('processingTime');
    setLocalBool('growthSize');
    setLocalBool('deltaGrowthSize');
    setLocalBool('compactedSize');
    setLocalBool('deltaCompactedSize');
    setLocalBool('compactionTime');
  }

  updateHash() {
    window.location.hash = this.createUSP().toString();
  }

  update() {
    this.updateHash();
    drawGraph();
  }
}

function setupControls() {
  const statNames = [
    'height', 'processingTime', 'growthSize', 'deltaGrowthSize', 'compactedSize', 'deltaCompactedSize', 'compactionTime'
  ];
  const togglers = {};

  const size = document.getElementById('size');
  const range = document.getElementById('range');
  const redraw = document.getElementById('redraw');

  const updateElements = () => {
    size.value = graphParams.graphSize;
    range.value = graphParams.range;

    for (const id of statNames) {
      togglers[id].checked = graphParams[id];
    }
  };

  for (const id of statNames) {
    elements[id] = document.getElementById(id);
    togglers[id] = document.getElementById(id + 'Toggle');
  }

  updateElements();

  for (const id of statNames) {
    togglers[id].onchange = (e) => {
      graphParams[id] = e.target.checked;
      graphParams.updateHash();
      drawGraph();
    };
  }

  redraw.onclick = () => {
    graphParams.graphSize = size.value;
    graphParams.range = range.value;
    graphParams.update();
  };

  window.onhashchange = () => {
    graphParams.checkHash();
    updateElements();
    drawGraph();
  };
}

let json = null;
const graphParams = new GraphParams();
graphParams.checkHash();
const elements = {};

setupControls();

(async () => {
  const res = await fetch('./tree-data.json');

  if (!res.ok)
    throw new Error('Response not ok.');

  json = await res.json();

  drawGraph();
})().catch((e) => {
  console.error(e);
});

function drawGraph() {
  if (!json)
    return;

  document.getElementById('viz').innerHTML = '';

  const [wcfg, hcfg] = graphParams.graphSizePair;
  const [from, to] = graphParams.rangePair;

  let {data} = json;
  data = data.filter(d => d.height >= from && d.height <= to);

  // calculate deltas
  data = data.map((d, i, arr) => {
    d.deltaGrowthSize = 0;
    d.deltaCompactedSize = 0;

    if (i === 0)
      return d;

    d.deltaGrowthSize = d.growthSize - arr[i - 1].growthSize;
    d.deltaCompactedSize = d.compactedSize - arr[i - 1].compactedSize;
    return d;
  });

  const stats = {
    height: getStats(data, 'height'),
    compactedSize: getStats(data, 'compactedSize'),
    compactionTime: getStats(data, 'compactionTime'),
    growthSize: getStats(data, 'growthSize'),
    processingTime: getStats(data, 'processingTime'),
    deltaGrowthSize: getStats(data, 'deltaGrowthSize'),
    deltaCompactedSize: getStats(data, 'deltaCompactedSize')
  };

  // set the dimensions and margins of the graph
  const margin = {top: 10, right: 100, bottom: 30, left: 100};
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

  let minSize = Number.POSITIVE_INFINITY, maxSize = 0;

  if (graphParams.growthSize) {
    minSize = Math.min(minSize, stats.growthSize.min);
    maxSize = Math.max(maxSize, stats.growthSize.max);
  }

  if (graphParams.compactedSize) {
    minSize = Math.min(minSize, stats.compactedSize.min);
    maxSize = Math.max(maxSize, stats.compactedSize.max);
  }

  if (graphParams.deltaGrowthSize) {
    minSize = Math.min(minSize, stats.deltaGrowthSize.min);
    maxSize = Math.max(maxSize, stats.deltaGrowthSize.max);
  }

  if (graphParams.deltaCompactedSize) {
    minSize = Math.min(minSize, stats.deltaCompactedSize.min);
    maxSize = Math.max(maxSize, stats.deltaCompactedSize.max);
  }

  // Left Y Axes - DISK SPACE
  const diskSizeLY = d3.scaleLinear()
    .domain([minSize, maxSize])
    .range([ height, 0 ]);

  svg.append('g')
    .call(d3.axisLeft(diskSizeLY).tickFormat(formatSize));


  let minTime = Number.POSITIVE_INFINITY, maxTime = 0;

  if (graphParams.processingTime) {
    minTime = Math.min(minTime, stats.processingTime.min);
    maxTime = Math.max(maxTime, stats.processingTime.max);
  }

  if (graphParams.compactionTime) {
    minTime = Math.min(minTime, stats.compactionTime.min);
    maxTime = Math.max(maxTime, stats.compactionTime.max);
  }
  // RIGHT Y Axes - TIME TAKEN
  const processTimeRY = d3.scaleLinear()
    .domain([minTime, maxTime])
    .range([height, 0]);

  svg.append('g')
    .attr('transform', `translate(${width}, 0)`)
    .call(d3.axisRight(processTimeRY).tickFormat(formatTime))

  // Now draw other stuff...

  if (graphParams.compactionTime) {
    // Draw Compaction time
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
  }

  if (graphParams.processingTime) {
    // Draw processing time
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
  }

  if (graphParams.growthSize) {
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
  }

  if (graphParams.deltaGrowthSize) {
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#993be8')
      .attr('stroke-width', 1.0)
      .attr('d', d3.line()
        .x(d => heightX(d.height))
        .y(d => diskSizeLY(d.deltaGrowthSize))
      )
  }

  if (graphParams.compactedSize) {
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
  }

  if (graphParams.deltaCompactedSize) {
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#99b719')
      .attr('stroke-width', 1.0)
      .attr('d', d3.line()
        .x(d => heightX(d.height))
        .y(d => diskSizeLY(d.deltaCompactedSize))
      )
  }

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
    elements['deltaGrowthSize'].innerHTML = formatSize(cur.deltaGrowthSize);
    elements['deltaCompactedSize'].innerHTML = formatSize(cur.deltaCompactedSize);
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
      return (seconds / 60).toFixed(2) + ' min';

    return (ms / 1e3).toFixed(2) + ' sec';
  }

  return ms.toFixed(2) + ' ms';
}

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

function getStats(list, prop) {
  const sorted = list.slice().sort((a, b) => {
    return a[prop] - b[prop]
  });

  return {
    min: sorted[0][prop],
    med: sorted[sorted.length / 2 | 0][prop],
    max: sorted[sorted.length - 1][prop]
  };
}


