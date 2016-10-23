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