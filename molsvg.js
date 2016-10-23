(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.molsvg = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * Atom properties containing the CPK color values.
 */
var atomColor = {
    H: '#000000',
    He: '#FFC0CB',
    Li: '#B22222',
    B: '#00FF00',
    C: '#000000',
    N: '#8F8FFF',
    O: '#F00000',
    F: '#DAA520',
    Na: '#0000FF',
    Mg: '#228B22',
    Al: '#808090',
    Si: '#DAA520',
    P: '#FFA500',
    S: '#FFC832',
    Cl: '#00FF00',
    Ca: '#808090',
    Ti: '#808090',
    Cr: '#808090',
    Mn: '#808090',
    Fe: '#FFA500',
    Ni: '#A52A2A',
    Cu: '#A52A2A',
    Zn: '#A52A2A',
    Br: '#A52A2A',
    Ag: '#808090',
    I: '#A020F0',
    Ba: '#FFA500',
    Au: '#DAA520'
};

module.exports = function () {
  var atom, g_el, no_symbols, hidden, atomCol, avgL, x, y;

  function _render(el) {
    atomCol = d3.rgb(atomColor[atom.symbol[0]]);
    var g = el.append('svg:g')
      .attr("class", "atom atom-" + atom.symbol)
      .attr('transform', 'translate(' + 
        x(atom.x) + ',' + y(atom.y) + ')');
    
    if (no_symbols) {
      no_symbol_circle(g);
    }else{
      symbol_ellipse(g);
      if(!hidden){
        symbol_text(g);
      }
      
    }
  

    if (atom.charge !== 0) {
        var c = atom.charge;
        if (c < 0) {
            c = (c === -1) ? '-' : (c + '-');
        } else {
            c = (c === +1) ? '+' : (c + '+');
        }
        g.append('text')
            .attr('dx', +1 * Math.ceil(avgL / 3))
            .attr('dy', -1 * Math.ceil(avgL / 4.5))
            .attr('text-anchor', 'left')
            .attr('font-family', 'sans-serif')
            // hack: magic number for scaling (half of symbol size)
            .attr('fill', atomCol)
            .attr('font-size', Math.ceil(avgL / 3)) 
            .text(c);
    }

    if (atom.mass !== 0) {
        g.append('text')
            .attr('dx', -2 * Math.ceil(avgL / 3))
            .attr('dy', -1 * Math.ceil(avgL / 4.5))
            .attr('text-anchor', 'left')
            .attr('font-family', 'sans-serif')
            // hack: magic number for scaling (half of symbol size)
            .attr('font-size', Math.ceil(avgL / 3)) 
            .attr('fill', atomCol)
            .text(atom.mass);
    }
    
    return g;
  }
  
  _render.atom = function (_) {
    if (!arguments.length) {
      return atom;
    }
    atom = _;
    
    return _render;
  };
  _render.bondLength = function (_) {
    if (!arguments.length) {
      return avgL;
    }
    avgL = _;
    
    return _render;
  };
  _render.noSymbols = function (_) {
    if (!arguments.length) {
      return no_symbols;
    }
    no_symbols = _;
    
    return _render;
  };
  _render.hidden = function (_) {
    if (!arguments.length) {
      return show_placeholder;
    }
    show_placeholder = _;
    
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
  
  return _render;
  
  // Draw a circle instead of an element symbol.
  // g: parent element
  // avgL: average bond length. Used to determine the size of the circle
  function no_symbol_circle(g) {
    // hack: magic number for scaling
    var r = Math.ceil(avgL / 6);
    var circle = g.append('svg:circle')
      .attr('r', r)
      .attr('x', -r / 2)
      .attr('y', -r / 2)
      .attr('fill', atomCol)
      .attr('opacity', '1');
  
    return circle;  
  }

  // draw a circle underneath the text
  // used when atom symbols are shown.
  // g: parent element
  // avgL: average bond length. Used to determine the size of the circle
  function symbol_ellipse(g) {
    var r = Math.ceil(avgL / 3);
    var ellipse = g.append('svg:ellipse')
      // hack: magic number for scaling
      .attr('rx', r * atom.symbol.length)
      .attr('ry', r)
      .attr('fill', 'white')
      .attr('opacity', '1');
  
    return ellipse;  
  }

  // draw the text string
  function symbol_text(g) {
    var text = g.append('text')
      // hack: magic number for scaling
      .attr('dy', Math.ceil(avgL / 4.5))
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      // hack: magic number for scaling
      .attr('font-size', Math.ceil(avgL / 1.5))
      .attr('fill', atomCol)
      .text(atom.symbol);
  
    return text;
  }

};
},{}],2:[function(require,module,exports){
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
  var bond, atoms, g_el, _length, no_symbols, x, y;

  function _render(graph) {
    var a1 = atoms[bond.a1],
        a2 = atoms[bond.a2];

    // apply backing by calculating the unit vector and
    // subsequent scaling: shortens the drawn bond
    // don't shorten bonds if no symbols are drawn.
    var shorten = no_symbols ? 0.0 : 0.2; 
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
  }
  
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
    xyData = [
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
    console.log("hash", x1, x2, y1, y2, l);
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
    console.log("hashxy", xyData.map(function(e){return e[0];}));
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


},{}],3:[function(require,module,exports){
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
  var w = 200, h = 200;
  
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
},{}],4:[function(require,module,exports){
/**
 * SVG molecule renderer for MDL Molfiles. The header block and 
 * connection table are loosely parsed according to Elsevier MDL's V2000
 * format.
 * 
 * The molecule title is taken from the header block.
 * 
 * The two dimensional coordinates, symbol, charge, and mass difference
 * information is extracted from the atom block. 
 * 
 * Connectivity and stereo information is extracted from the bond block.
 * Single, double, and triple bonds as well as symbols for wedge, hash,
 * and wiggly bonds are supported.
 * 
 * The renderer uses the CPK coloring convention.
 * The origianl code was part of SpeckTackle library. For convenience,
 * and improvement, it is redistributed as a separate library.
 *
 * original_author Stephan Beisken <beisken@ebi.ac.uk>
 * modified and improved by Ahmed Mohamed <mohamed@kuicr.kyoto-u.ac.jp>
*/
module.exports = function () {
  var molfile, x, y, filtered_atoms = [], organic, implicit_h;
  
  var graph = require('./graph')();
  var draw_atom = require('./atom')();
  var draw_bond = require('./bond')();
  
  function _main(el) {
    if (molfile === undefined) {
      console.error('No Mol file provided.');
    }
    //el = this;
    
    parsed_mol = require('./parser')(molfile);
    var atoms = parsed_mol[0],
      bonds = parsed_mol[1];
    
    //bonds = filter_bonds(bonds, atoms);
    el.call(graph.atoms(atoms));                  // layout SVG
    
    
    x = graph.x();
    y = graph.y();
    
    //drawBonds(atoms, bonds, graph.el());
    draw_bond = draw_bond.atoms(atoms)
      .x(x).y(y);
    
    console.log("implicit", implicit_h);
    bonds.filter(function (b) {
      return filtered_atoms.indexOf( atoms[b.a1].symbol ) < 0 &&
        filtered_atoms.indexOf( atoms[b.a2].symbol ) < 0;
    }).forEach(function (b) {
      graph.el()    
        .call(draw_bond.bond(b));
    });
    
    if (organic){
      filtered_atoms.push('C');
    }
    
    draw_atom = draw_atom.bondLength(21)
      .x(x).y(y);
    
    atoms.filter(function (a) {
      return filtered_atoms.indexOf(a.symbol) < 0;
    })
    .forEach(function (a) {
      graph.el()    
        .call(draw_atom.atom(a));
    });
    console.log("rendered");
  }
  
  _main.molfile = function (_) {
    if (!arguments.length) {
      return molfile;
    }
    molfile = _;
    
    return _main;
  };

  _main.implicitH = function (_) {
    if (!arguments.length) {
      return implicit_h;
    }
    if (_) {
      filtered_atoms.push('H');
    }else{
      filtered_atoms = filtered_atoms.filter(function(a){return a !== 'H';});
    }
    
    implicit_h = _;
    
    return _main;
  };
  _main.noSymbols = function (_) {
    if (!arguments.length) {
      return draw_atom.noSymbols();
    }
    draw_atom = draw_atom.noSymbols(_);
    draw_bond = draw_bond.noSymbols(_);
    
    return _main;
  };  
  _main.organic = function (_) {
    if (!arguments.length) {
      return organic;
    }
    if (_){
      draw_atom = draw_atom.noSymbols(_);
      draw_bond = draw_bond.noSymbols(_);
      _main.implicitH(_);
    }
    organic = _;
    
    return _main;
  };
  _main.width = graph.width;
  _main.height = graph.height;
  
  return _main;
  
  function bond_filter(b) {
    return filtered_atoms.indexOf(b.a1.symbol) < 0 &&
      filtered_atoms.indexOf(b.a2.symbol) < 0;
  }
};
},{"./atom":1,"./bond":2,"./graph":3,"./parser":5}],5:[function(require,module,exports){
/**
 * Parses the atom block line by line.
 *
 * @param {string[]} lines A molfile line array
 * @param {number} nAtoms The total number of atoms
 * @returns {object[]} associative array of atom objects
 */
var atomBlock = function (lines, nAtoms) {
    var atoms = [];
    var offset = 4; // the first three lines belong to the header block
    for (var i = offset; i < nAtoms + offset; i++) {
        var atom = lines[i].match(/-*\d+\.\d+|\w+/g);
        atoms.push({
            x: parseFloat(atom[0]),
            y: parseFloat(atom[1]),
            symbol: atom[3],
            mass: 0,    // deprecated
            charge: 0   // deprecated
        });
    }
    return atoms;
};

/**
 * Parses the bond block line by line.
 * 
 * @param {string[]} lines A molfile line array
 * @param {number} nAtoms The total number of atoms
 * @param {number} nBonds The total number of bonds
 * @returns {object[]} associative array of bond objects
 */
var bondBlock = function (lines, nAtoms, nBonds) {
    var bonds = [];
    var offset = 4; // the first three lines belong to the header block
    for (var j = nAtoms + offset; j < nAtoms + nBonds + offset; j++) {
        var bond = lines[j].match(/\d+/g);
        bonds.push({
            // adjust to '0', atom counter starts at '1'
            a1: parseInt(bond[0]) - 1,  
            a2: parseInt(bond[1]) - 1,
            // values 1, 2, 3
            order: parseInt(bond[2]),
            // values 0 (plain),1 (wedge),4 (wiggly),6 (hash)                
            stereo: parseInt(bond[3])
        });
    }
    return bonds;
};

/**
 * Parses the properties block line by line.
 * 
 * @param {string[]} lines A molfile line array
 * @param {object[]} atoms An array of atom objects
 * @param {number} nAtomsBonds The total number of atoms and bonds
 */
var propsBlock = function (lines, atoms, nAtomsBonds) {
    var offset = 4; // the first three lines belong to the header block
    var k, l, m, props;
    for (k = nAtomsBonds + offset; k < lines.length; k++) {
        if (lines[k].indexOf('M  ISO') !== -1) {
            props = lines[k].match(/-*\d+/g);
            for (l = 0, m = 1; l < props[0]; l++, m += 2) {
                atoms[props[m] - 1].mass = parseInt(props[m + 1], 10);
            }
        } else if (lines[k].indexOf('M  CHG') !== -1) {
            props = lines[k].match(/-*\d+/g);
            for (l = 0, m = 1; l < props[0]; l++, m += 2) {
                atoms[props[m] - 1].charge = parseInt(props[m + 1], 10);
            }
        }
    }
};

/**
 * Parses the molfile, extracting the molecule title from the 
 * header block, two dimensional coordinates, symbol, charge, 
 * and mass difference information extracted from the atom block,
 * connectivity and stereo information from the bond block.
 *
 * @param {string} molfile A URL to the MDL molfile (REST web service)
 * @param {string} id An element identifier
 */
module.exports = function (molfile) {
    var lines = molfile.split(/\r\n|\n/),
      // title = lines[1],
      counter = lines[3].match(/\d+/g),
      nAtoms = parseFloat(counter[0]),
      nBonds = parseFloat(counter[1]);

    var atoms = atomBlock(lines, nAtoms),           // get all atoms
      bonds = bondBlock(lines, nAtoms, nBonds);   // get all bonds
    
    propsBlock(lines, atoms, nAtoms + nBonds);      // get properties
    
    
    return [atoms, bonds];
};

},{}]},{},[4])(4)
});