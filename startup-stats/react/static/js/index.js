import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {STARTUPS as startups} from './data';
import StartupList from './startup-list';

let log = console.log;

let DATA = Object.keys(startups).map((key) => {
  let obj  = startups[key];

  let data = {
    'Name'    : key, 
    'Team'    : obj[0],
    'Idea'    : obj[1],
    'Market'  : obj[2],
    'Average' : ((obj[0] + obj[1] + obj[2]) / 3),
  };

  return data;
});



ReactDOM.render(<StartupList data={DATA} />, document.getElementById('container'));
