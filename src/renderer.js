module.exports = function () {
  var atoms, bonds;
  var x, y, filtered_atoms = [], organic, implicit_h;
  
  var graph = require('./graph')();
  var draw_atom = require('./atom')();
  var draw_bond = require('./bond')();
  
  function _main(el) {
    /****** SVG container ******/
    el.call(graph.atoms(atoms));                  // layout SVG
    
    x = graph.x();
    y = graph.y();
    
    /****** Bonds ******/
    draw_bond = draw_bond.atoms(atoms)
      .x(x).y(y);
    
    var bondL = [];
    bonds.filter(function (b) {
      return filtered_atoms.indexOf( atoms[b.a1].symbol ) < 0 &&
        filtered_atoms.indexOf( atoms[b.a2].symbol ) < 0;
    }).forEach(function (b) {
      graph.el()    
        .call(draw_bond.bond(b));
      
      bondL.push(draw_bond.bondLength());
    });
    var avgBondL = average(bondL);
    if (!draw_bond.noSymbols()){avgBondL *= 0.8;}
    
    
    /******** Atoms ********/
    draw_atom = draw_atom.bondLength(avgBondL)
      .x(x).y(y);
    
    atoms.filter(function (a) {
      return filtered_atoms.indexOf(a.symbol) < 0;
    })
    .forEach(function (a) {
      graph.el()
        .call(
          draw_atom.atom(a)
            .hidden(organic && a.symbol === 'C')
        );
    });
    
    return graph.el();
  }
  
  _main.atoms = function (_) {
    if (!arguments.length) {
      return atoms;
    }
    atoms = _;
    return _main;
  };
  _main.bonds = function (_) {
    if (!arguments.length) {
      return bonds;
    }
    bonds = _;
    
    return _main;
  };
  
  /******** Rendering config ************/
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
  /**************************************/
  
  /******** SVG attributes **************/  
  _main.width = functor(graph.width);
  _main.height = functor(graph.height);
  /**************************************/
  function functor(f){
    return function () {
      if (!arguments.length) {
        return f();
      }
      f.apply(this, arguments);
      return _main;
    };
  }
  
  return _main;
};

var average = function(arr){
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
};
