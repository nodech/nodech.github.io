var gui = new dat.GUI();

CELL_TYPES.forEach(function (CELL_TYPE) {
  var folder = gui.addFolder(CELL_TYPE.name),
    cellEats = {};

  folder.addColor(CELL_TYPE, 'color');

  CELL_TYPE.eats.forEach(function (cell, i) {
    var name = cell + ' EAT %',
      ctrl;

    cellEats[name] = CELL_TYPE.prob[i] * 100;

    var ctrl = folder.add(cellEats, name).min(0).max(100);

    ctrl.onChange(function (value) {
      CELL_TYPE.prob[i] = value / 100;
    });
  });
});
