var gui = new dat.GUI();

CELL_TYPES.forEach(function (CELL_TYPE) {
  var folder = gui.addFolder(CELL_TYPE.name),
    cellEats = {};

  folder.addColor(CELL_TYPE, 'color');

  CELL_TYPE.eats.forEach(function (cell, i) {
    cellEats[cell] = CELL_TYPE.prob[i];

    var ctrl = folder.add(cellEats, cell).min(0).max(1);

    ctrl.onChange(function (value) {
      CELL_TYPE.prob[i] = value;
    });
  });
});
