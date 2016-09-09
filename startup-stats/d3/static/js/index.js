import {STARTUPS as startups} from './data.js';
import * as d3 from 'd3';

let indexToKey = [ '#', 'Name', 'Team', 'Idea', 'Market', 'Average' ];
let formatNumber = (num) => typeof num == 'number' ? num.toPrecision(3) : num;

let sort = 'Average';
let sorters = {
  'Average' : (a, b) => b.Average - a.Average,
  'Team'    : (a, b) => b.Team - a.Team,
  'Idea'    : (a, b) => b.Idea - a.Idea,
  'Market'  : (a, b) => b.Market - a.Market
}

let DATA;
reset();

let table = d3.select('body')
  .append('table');

let trh = table.append('thead').append('tr')

trh.selectAll('td').data(indexToKey)
  .enter()
  .append('td').text((d, i) => d)
  .exit();

let tbody = table.append('tbody');

let tr = tbody
  .selectAll('tr')
  .data(DATA)
  .enter()
  .append('tr')

indexToKey.forEach((_, c) => {
  let td = tr.append('td');
  let key = indexToKey[c];

  if (key == '#') {
    td.text((_, i) => i + 1)
    return;
  }

  if (key == 'Name') {
    td.text((d) => d[key])
    return;
  }

  let input = td.append('input')
    .property('type', 'number')
    .property('value', (d) => formatNumber(d[key]))
    .on('change', () => {
    });
})
tr.exit().remove();

render();

function render() {
  sortRender();
  tbody.selectAll('tr').sort(sorters[sort]).transition()
}

window.change = (idx, key) => {
  console.log(this, arguments);
};

function sortRender() {
  trh
    .selectAll('td')
    .attr('class', (d, i) => d === sort ? 'sort' : '')
    .on('click', (d, i) => {
      if (sorters[d]) {
        sort = d;
        render();
      }
    })
}

function reset() {
  DATA = Object.keys(startups).map((key) => {
    var obj  = startups[key];
    var data = {
      'Name'    : key, 
      'Team'    : obj[0],
      'Idea'    : obj[1],
      'Market'  : obj[2],
      'Average' : (obj[0] + obj[1] + obj[2]) / 3
    };

    return data;
  });
}
