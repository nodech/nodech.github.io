'use strict';

const fs = require('fs');
const rawTreeStats = fs.readFileSync('stats.pc2', { encoding: 'ascii' });
const rawCompactStats = fs.readFileSync('compacted.info', { encoding: 'ascii' });

const treeInterval = 36;

const treeMap = new Map();
const compactedMap = new Map();

let maxTree = 0;
let maxCompacted = 0;

rawTreeStats.split('\n')
  .filter(l => l.trim().length !== 0)
  .forEach((line) => {
    const [hash, sheight, size, ms] = line.split(' ');
    const height = Number(sheight);

    if (maxTree < height)
      maxTree = height;

    treeMap.set(height, {
      size: Number(size),
      time: Number(ms)
    });
  });

rawCompactStats.split('\n')
  .filter(l => l.trim().length != 0)
  .map((line) => {
    const [sheight, hash, size, ms] = line.split(' ');
    const height = Number(sheight);

    if (maxCompacted < height)
      maxCompacted = height;

    compactedMap.set(height, {
      size: Number(size),
      time: Number(ms)
    });
  });

const maxHeightInfo = Math.max(maxTree, maxCompacted);
const data = [];
let lastTree, lastComp;
for (let i = 2341; i < maxHeightInfo; i++) {

  // console.log('Getting: ', i, treeMap.size, compactedMap.size, i % 36);
  let tree = treeMap.get(i);
  let comp = compactedMap.get(i);

  if (!tree) {
    console.log('Missing info at', i);
    tree = lastTree;
  }

  if (!comp) {
    if (i % treeInterval === 1)
      console.log('Missing compacted tree height: ', i);

    comp = lastComp;
  }

  lastTree = tree;
  lastComp = comp;

  const info = {
    height: i,
    compactedSize: comp.size,
    compactionTime: comp.time,
    growthSize: tree.size * 1000,
    processingTime: tree.time
  };

  data.push(info);
}

fs.writeFileSync('tree-data.json', JSON.stringify({data}, null, 2));
