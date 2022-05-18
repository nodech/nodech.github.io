'use strict';

const fs = require('fs');
const data = fs.readFileSync('stats', { encoding: 'ascii' });

const results = {
  data: []
};

results.data = data.split('\n')
  .filter(l => l.trim().length !== 0)
  .map((line) => {
    const [hash, height, space, ms] = line.split(' ');

    return {
      height: Number(height),
      space: Number(space),
      ms: Number(ms)
    };
  });

fs.writeFileSync('tree-sync.json', JSON.stringify(results, null, 2));
