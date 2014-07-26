var margin = {top: 60, right: 20, bottom: 40, left: 20},
    width = 1000 - margin.right - margin.left,
    height = 1000 - margin.top - margin.bottom,
    rectW = 140, rectH = 40,
    rectHW = rectW / 2, rectHH = rectH / 2,
    arrowW = 20, arrowH = 20;

var i = 0,
    duration = 750,
    lastTransform = 0, transformFinal = 0,
    maxId = 0,
    root;

var tree = d3.layout.tree()
    .nodeSize([rectW + 40, rectH])
    .separation(function(a, b) { return 1; });

var diagonal = d3.svg.diagonal(),
    line     = d3.svg.line();

var body = d3.select('#body'),
    bodyDom = document.getElementById('body');

var svg = body.append('svg')
        .attr('width', width)
        .attr('height', height)
        .on('click', svgClick);

var treeG = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + margin.top + ')');

d3.json('./data.json', function(error, data) {
  root = data;
  root.x0 = 0;
  root.y0 = 0;

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  root.children.forEach(collapse);
  update(root);
});

var buttonBottom = addNode('bottom'),
  buttonTop = addNode('top'),
  buttonLeft = addNode('left'),
  buttonRight = addNode('right');

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 120; });

  // Update the nodes…
  var node = treeG.selectAll('g.node')
      .data(nodes, function(d) { return d.id; });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', function(d) { return 'translate(' + source.x0 + ',' + source.y0 + ')'; })

  nodeEnter.append('rect')
      .attr('width', rectW)
      .attr('height', rectH)
      .attr('x', function (d) { return -rectHW; })
      .attr('y', function (d) { return -rectHH; })
      .style('fill', function(d) { return d._children ? '#eee' : '#fff'; })
      .on('click', click)
      .style('stroke', '#ccc');

  nodeEnter.append('text')
      .attr('text-anchor', 'middle')
      .text(function(d) { return d.name; })
      .on('click', click)
      .style('fill-opacity', 1e-6);


  //ToolBox
  nodeEnter.append('rect')
    .attr('class', 'toolbox')
    .attr('width', rectW - 50)
    .attr('height', rectH)
    .attr('x', -rectHW + 25)
    .attr('y', -rectH - rectHH);

  nodeEnter.append('circle')
    .attr('cx', -20)
    .attr('cy', -rectH)
    .attr('r', 5);

  nodeEnter.append('circle')
    .attr('cx', 0)
    .attr('cy', -rectH)
    .attr('r', 5);

  nodeEnter.append('circle')
    .attr('cx', 20)
    .attr('cy', -rectH)
    .attr('r', 5);

  //Buttons
  //add right
  nodeEnter.append('rect')
    .attr('width', arrowW)
    .attr('height', arrowH)
    .attr('x', rectHW - arrowW / 2)
    .attr('y', (-rectHH + arrowH / 2))
    .attr('fill', '#000')
    .on('click', buttonRight);

  //add left
  nodeEnter.append('rect')
    .attr('width', arrowW)
    .attr('height', arrowH)
    .attr('x', -rectHW - arrowW / 2)
    .attr('y', (-rectHH + arrowH / 2))
    .attr('fill', '#000')
    .on('click', buttonLeft);

  //add bottom
  nodeEnter.append('rect')
    .attr('width', arrowW)
    .attr('height', arrowH)
    .attr('x', -arrowW / 2)
    .attr('y', arrowH / 2)
    .attr('fill', '#000')
    .on('click', buttonBottom);

  //add top
  nodeEnter.append('rect')
    .attr('width', arrowW)
    .attr('height', arrowH)
    .attr('x', -arrowW / 2)
    .attr('y', (-rectHH - arrowH / 2))
    .attr('fill', '#000')
    .on('click', buttonTop);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

  nodeUpdate.select('rect')
      .style('fill', function(d) { return d._children ? '#eee' : '#fff'; });

  nodeUpdate.select('text')
      .style('fill-opacity', 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr('transform', function(d) { return 'translate(' + source.x + ',' + source.y + ')'; })
      .remove();

  nodeExit.select('text')
      .style('fill-opacity', 1e-6);

  // LINKS !!!
  var link = treeG.selectAll('path.link')
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', function (d, i) {
        var o = { source : d.source, target : d.source };
        return elbow(o, i);
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr('d', elbow);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr('d', function (d, i) {
        var o = { source : source, target : source };
        return elbow(o, i);
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  function updateSVGSize(width, height) {
    svg.attr('width',  width + margin.left + margin.right)
       .attr('height', bottomEdge + margin.top + margin.bottom);
  }

  var leftEdge = 0, rightEdge = 0, bottomEdge = 0;
  nodeUpdate.tween('fullsize', function (d) {
    leftEdge   = d.x < leftEdge ? d.x : leftEdge;
    rightEdge  = d.x + rectW > rightEdge ? d.x + rectHW : rightEdge;
    bottomEdge = d.y > bottomEdge ? d.y : bottomEdge;

    width  = Math.abs(leftEdge) + rectHW + rightEdge,
    transformFinal = Math.abs(leftEdge) + rectHW;

    if (svg.attr('width') < width || svg.attr('height') < bottomEdge) {
      updateSVGSize(width, bottomEdge);
    }

    return function (t) {
      var transformDelta = transformFinal - lastTransform,
          currTransform = lastTransform + (transformDelta * t);

      lastTransform = currTransform;
      treeG.attr('transform', 'translate(' + (margin.left + currTransform) + ',' + margin.top + ')');
     }
  });

  nodeUpdate.each('end', function () {
    if (svg.attr('width') > width || svg.attr('height') > bottomEdge) {
      updateSVGSize(width, bottomEdge);
    }
  });
}

function addNode(side) {
  return function (d) {
    d3.event.stopPropagation();

    var tId = Math.floor(Math.random() * 100000),
        newNode = {
          id : tId,
          name : "Change this"
        };

    if (side === 'bottom') {
      var children = d.children || d._children;

      if (children) {
        children.push(newNode);
      } else {
        d.children = [ newNode ];
      }

      if (!d.children) click(d);
      update(root);
    } else if (side === 'right') {
      var insertIndex = d.parent.children.indexOf(d);

      d.parent.children.splice(insertIndex + 1, 0, newNode);

      update(root);
    } else if (side === 'left') {
      var insertIndex = d.parent.children.indexOf(d);

      d.parent.children.splice(insertIndex, 0, newNode);
      update(root);
    } else if (side === 'top') {
      var myIndex = d.parent.children.indexOf(d);

      d.parent.children[myIndex] = newNode;
      newNode.children = [ d ];

      update(root);
    }
  }
}

var clickedOnce = false, timer, inputDom = null;
function click(d) {
  if (d3.event.defaultPrevented) return;

  var argsArray = Array.prototype.slice.call(arguments);

  if (clickedOnce) {
    clearTimeout(timer);
    clickedOnce = false;

    doubleClickListener.apply(this, argsArray);
  } else {
    timer = setTimeout(function () {
      clickListener.apply(this, argsArray);
      clickedOnce = false;
    }, 200);

    clickedOnce = true;
  }
}

function doubleClickListener(d) {
  var bounds = this.getBoundingClientRect(),
      input  = document.createElement('input');

  input.style.cssText =
    'left: ' + bounds.left + 'px;' +
    'top: ' + bounds.top + 'px;' +
    'width: ' + bounds.width + 'px;' +
    'height: ' + bounds.height + 'px;';
  input.value = d.name;

  bodyDom.appendChild(input);
  inputDom = input;
  inputDom.save = function() {
    var id = d.id, name = this.value;

    d.name = this.value;
    update(root);
    d3.selectAll(".node text").each(function(d, i){
      if(d.id == id){
        d3.select(this).text(name);
      }
    });
  };

  d3.event.stopPropagation();
}

function clickListener(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

function svgClick() {
  if (inputDom) {
    bodyDom.removeChild(inputDom);

    inputDom.save();
    inputDom = null;
  }
}



function elbow(d, i) {
  return "M" + d.source.x + " " + d.source.y
       + "V" + (d.source.y + 40) + "H" + d.target.x
       + "V" + d.target.y;
}
