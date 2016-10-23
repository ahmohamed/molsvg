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