/**
 * Calculates the Euclidean distance between two points.
 * 
 * @param {number} x1 A x value of first point
 * @param {number} y1 A y value of first point
 * @param {number} x2 A x value of second point
 * @param {number} y2 A y value of second point
 * @returns {number} the Euclidean distance
 */
var distance = function (x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};

module.exports = function () {
  var bond, atoms, _length, no_symbols, x, y;

  function _render(graph) {
    var a1 = atoms[bond.a1],
        a2 = atoms[bond.a2];

    // apply backing by calculating the unit vector and
    // subsequent scaling: shortens the drawn bond
    // don't shorten bonds if no symbols are drawn.
    var shorten = no_symbols ? 0.0 : 0.0; 
    var dox = a2.x - a1.x,
        doy = a2.y - a1.y,
        l = Math.sqrt(dox * dox + doy * doy),
        dx = (dox / l) * shorten,
        dy = (doy / l) * shorten;

    // get adjusted x and y coordinates
    var x1 = a1.x + dx,
        y1 = a1.y + dy,
        x2 = a2.x - dx,
        y2 = a2.y - dy;

    // update average bond length for font scaling
    _length = distance(x(x1), y(y1), x(x2), y(y2));

    if (bond.order === 1) { // single bond
      if (bond.stereo === 1) { // single wedge bond
        draw_single_wedge(graph, x1, x2, y1, y2, l);
      } else if (bond.stereo === 6) { // single hash bond
        draw_single_hash(graph, x1, x2, y1, y2, l);
      } else if (bond.stereo === 4) { // single wiggly bond
        draw_single_wiggly(graph, x1, x2, y1, y2, l);
      } else { // single plain bond
        draw_single_plain(graph, x1, x2, y1, y2, l);
      }
    } else if (bond.order === 2) { // double bond
      draw_double(graph, x1, x2, y1, y2, l);
    } else if (bond.order === 3) { // triple bond
      draw_triple(graph, x1, x2, y1, y2, l);
    }
    draw_highligh_rect(graph, x1, x2, y1, y2, _length);
  }
  
  _render.bondLength = function () {
    return _length;
  };  
  _render.bond = function (_) {
    if (!arguments.length) {
      return bond;
    }
    bond = _;
    
    return _render;
  };
  _render.atoms = function (_) {
    if (!arguments.length) {
      return atoms;
    }
    atoms = _;
    
    return _render;
  };
  _render.noSymbols = function (_) {
    if (!arguments.length) {
      return no_symbols;
    }
    no_symbols = _;
    
    return _render;
  };
  _render.x = function (_) {
    if (!arguments.length) {
      return x;
    }
    x = _;
    
    return _render;
  };
  _render.y = function (_) {
    if (!arguments.length) {
      return y;
    }
    y = _;
    
    return _render;
  };

  
  function draw_plain(graph, xyData) {
    graph.append('svg:path')
      .attr('d', plainBond(xyData))
      .attr('stroke-width', '1')
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('stroke', 'black');
  }
  function draw_single_plain(graph, x1, x2, y1, y2) {
    var xyData = [
      [x1, y1],
      [x2, y2]
    ];
    draw_plain(graph, xyData);
  }
  function draw_single_wedge(graph, x1, x2, y1, y2) {
    var off, // offset factor for stereo bonds
        xOff, // total offset in x
        yOff, // total offset in y
        xyData = []; // two dimensional data array
    
    var length = distance(x1, y1, x2, y2);
    off = 0.1;
    xOff = off * (y2 - y1) / length;
    yOff = off * (x1 - x2) / length;
    xyData = [
      [x1, y1],
      [x2 + xOff, y2 + yOff],
      [x2 - xOff, y2 - yOff]
    ];
    graph.append('svg:path')
      .style('fill', 'black')
      .style('stroke-width', 1)
      .attr('d', wedgeBond(xyData));
  }
  function draw_single_hash(graph, x1, x2, y1, y2, l){
    console.log('hash', x1, x2, y1, y2, l);
    var off, // offset factor for stereo bonds
        xOff, // total offset in x
        yOff, // total offset in y
        xyData = []; // two dimensional data array
    
    off = 0.15;
    xOff = off * (y2 - y1) / l;
    yOff = off * (x1 - x2) / l;
    var dxx1 = x2 + xOff - x1,
        dyy1 = y2 + yOff - y1,
        dxx2 = x2 - xOff - x1,
        dyy2 = y2 - yOff - y1;
    for (var j = 0.05; j <= 1; j += 0.15) {
      xyData.push(
        [x1 + dxx1 * j, y1 + dyy1 * j], [x1 + dxx2 * j, y1 + dyy2 * j]
      );
    }
    console.log('hashxy', xyData.map(function(e){return e[0];}));
    graph.append('svg:path')
      .style('fill', 'none')
      .style('stroke-width', 1)
      .attr('d', hashBond(xyData))
      .attr('stroke', 'black');
  }
  function draw_single_wiggly(graph, x1, x2, y1, y2, l){
    var off, // offset factor for stereo bonds
        xOff, // total offset in x
        yOff, // total offset in y
        xyData = []; // two dimensional data array
    
    off = 0.2;
    xOff = off * (y2 - y1) / l;
    yOff = off * (x1 - x2) / l;
    var dxx1 = x2 + xOff - x1,
        dyy1 = y2 + yOff - y1,
        dxx2 = x2 - xOff - x1,
        dyy2 = y2 - yOff - y1;
    for (var j = 0.05; j <= 1; j += 0.1) {
      if (xyData.length % 2 === 0) {
        xyData.push(
          [x1 + dxx1 * j, y1 + dyy1 * j]
        );
      } else {
        xyData.push(
          [x1 + dxx2 * j, y1 + dyy2 * j]
        );
      }
    }

    graph.append('svg:path')
      .attr('d', wigglyBond(xyData))
      .attr('fill', 'none')
      .style('stroke-width', 1)
      .attr('stroke', 'black');
  }
  function draw_double(graph, x1, x2, y1, y2, l){
    var off, // offset factor for stereo bonds
        xOff, // total offset in x
        yOff, // total offset in y
        xyData = []; // two dimensional data array
    
    off = 0.1;
    xOff = off * (y2 - y1) / l;
    yOff = off * (x1 - x2) / l;
    xyData = [
      [x1 + xOff, y1 + yOff],
      [x2 + xOff, y2 + yOff],
      [x1 - xOff, y1 - yOff],
      [x2 - xOff, y2 - yOff]
    ];
    draw_plain(graph, xyData);
  }
  function draw_triple(graph, x1, x2, y1, y2, l){
    var off, // offset factor for stereo bonds
        xOff, // total offset in x
        yOff, // total offset in y
        xyData = []; // two dimensional data array    
    
    off = 0.15;
    xOff = off * (y2 - y1) / l;
    yOff = off * (x1 - x2) / l;
    xyData = [
      [x1, y1],
      [x2, y2],
      [x1 + xOff, y1 + yOff],
      [x2 + xOff, y2 + yOff],
      [x1 - xOff, y1 - yOff],
      [x2 - xOff, y2 - yOff]
    ];
    draw_plain(graph, xyData);
  }
  function draw_highligh_rect(graph, x1, x2, y1, y2, l) {
    x1 = x(x1);
    x2 = x(x2);
    y1 = y(y1);
    y2 = y(y2);
    
    graph.insert('line')
      .datum(bond)
      .attr('class', 'highlight-bond')
      .attr('x1', x1)
      .attr('y1', y1)
      .attr('x2', x2)
      .attr('y2', y2)
      //.style('stroke', '#a8d1ff')
    .style('stroke-width', Math.max(l/3, 10) + 'px');
      //.style('stroke-opacity', '0.0')
      //.attr('stroke-linecap', 'round')
      //.attr('stroke-linejoin', 'round');
z  }
  /**
   * d3 line function using the SVG path mini language to draw a plain bond.
   */
  var plainBond = d3.svg.line()
    .interpolate(function (points) {
      var path = points[0][0] + ',' + points[0][1];
      for (var i = 1; i < points.length; i++) {
        if (i % 2 === 0) {
          path += 'M' + points[i][0] + ',' + points[i][1];
        } else {
          path += 'L' + points[i][0] + ',' + points[i][1];
        }
      }
      return path;
    })
    .x(function (d) {
      return x(d[0]);
    })
    .y(function (d) {
      return y(d[1]);
    });

  /**
   * d3 line function using the SVG path mini language to draw a wedge bond.
   */
  var wedgeBond = d3.svg.line()
    .x(function (d) {
      return x(d[0]);
    })
    .y(function (d) {
      return y(d[1]);
    });

  /**
   * d3 line function using the SVG path mini language to draw a hash bond.
   */
  var hashBond = d3.svg.line()
    .interpolate(function (points) {
      var path = points[0][0] + ',' + points[0][1];
      for (var i = 1; i < points.length; i++) {
        if (i % 2 === 0) {
          path += 'M' + points[i][0] + ',' + points[i][1];
        } else {
          path += 'L' + points[i][0] + ',' + points[i][1];
        }
      }
      return path;
    })
    .x(function (d) {
      return x(d[0]);
    })
    .y(function (d) {
      return y(d[1]);
    });

  /**
   * d3 line function using the SVG path mini language to draw a wiggly bond.
   */
  var wigglyBond = d3.svg.line()
    .interpolate('cardinal')
    .x(function (d) {
      return x(d[0]);
    })
    .y(function (d) {
      return y(d[1]);
    });
  return _render;
};

