/**
 * Initializes the viewport and appends it to the element identified
 * by the given identifier. The linear d3 x- and y-scales are set 
 * to translate from the viewport coordinates to the mol coordinates.
 * 
 * @param {object[]} atoms An array of atom objects
 * @param {string} id An element identifier
 * @returns {object} the initialized SVG element
 */
module.exports = function () {
  var atoms, x, y, graph_el, no_margins;
  var w = 500, h = 500;
  
  function graph(el) {
    // x minimum and maximum
    var xExtrema = d3.extent(atoms, function (atom) {
        return atom.x;
    });
    // y minimum and maximum
    var yExtrema = d3.extent(atoms, function (atom) { 
        return atom.y;
    });

    // dimensions of molecule graph
    var m = no_margins ? [0,0,0,0] : [20, 20, 20, 20];   // margins
    var wp = w - m[1] - m[3];   // width
    var hp = h - m[0] - m[2];   // height

    // maintain aspect ratio: divide/multiply height/width by the ratio (r)
    var r = (xExtrema[1] - xExtrema[0]) / (yExtrema[1] - yExtrema[0]);
    if (r > 1) {
        hp /= r;
    } else {
        wp *= r;
    }

    // X scale will fit all values within pixels 0-w
    x = d3.scale.linear().domain([xExtrema[0], xExtrema[1]]).range([0, wp]);
    // Y scale will fit all values within pixels h-0
    y = d3.scale.linear().domain([yExtrema[0], yExtrema[1]]).range([hp, 0]);

    // add an SVG element with the desired dimensions
    // and margin and center the drawing area
    graph_el = el.append('svg:svg')
        .attr('width', wp + m[1] + m[3])
        .attr('height', hp + m[0] + m[2])
        .append('svg:g')
        .attr('transform', 'translate(' + m[3] + ',' + m[0] + ')');

    return graph_el;
  }
  
  graph.atoms = function (_) {
    if (!arguments.length) {
      return atoms;
    }
    atoms = _;
    
    return graph;
  };
  graph.width = function (_) {
    if (!arguments.length) {
      return w;
    }
    w = _;
    
    return graph;
  };
  graph.height = function (_) {
    if (!arguments.length) {
      return h;
    }
    h = _;
    
    return graph;
  };
  graph.noMargins = function (_) {
    no_margins = _;
    
    return graph;
  };
  graph.x = function () {
    return x;
  };
  graph.y = function () {
    return y;
  };
  graph.el = function () {
    return graph_el;
  };
  return graph;
};