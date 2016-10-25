module.exports = function () {
  var atoms, bonds;
  var _highlight_atoms = true, _highlight_bonds = true, _select;
  var rendered;
  
  var enable_atoms_highlight = function (graph_el, symbols, adjacent) {
    graph_el.selectAll('.highlight-atom').on('mouseenter', function () {
      if (symbols && symbols.constructor !== Array){
        symbols = [symbols];
      }
    
      var $this = d3.select(this);
      var a = $this.datum();
    
      // Check if the bond order and stereo matches.
      if ( symbols && symbols.indexOf(a.symbol) < 0){
        if (adjacent) {
          var adjacent_atoms = get_adjacent_atoms(a).map(function (idx) {
            return atoms[idx];
          }).filter(function (adj_a) {
            return symbols.indexOf( adj_a.symbol) > -1;
          }).map(function(adj_a){return adj_a.idx;});
          
          if (adjacent_atoms.length > 0){
            var filtered = graph_el.selectAll('.highlight-atom')
              .filter(function(d){ return adjacent_atoms.indexOf(d.idx) > -1; })
              .classed('highlighted', true);
          }
        }
      
        return; 
      }
      d3.select(this).classed('highlighted', true);
    }).on('mouseleave', function () {
      graph_el.selectAll('.highlight-atom.highlighted').classed('highlighted', false);
    });
  };
  var enable_bonds_highlight = function (graph_el, order, stereo) {
    if (order && order.constructor !== Array){
      order = [order];
    }
    if (stereo && stereo.constructor !== Array){
      stereo = [stereo];
    }
    var stereo2str = ['plain', 'wedge', 'plain', 'plain', 'wiggly', 'plain', 'hash'];
  
    graph_el.selectAll('.highlight-bond').on('mouseenter', function () {
      var $this = d3.select(this);
      var b = $this.datum();
    
      // Check if the bond order and stereo matches.
      if ( order && order.indexOf(b.order) < 0){ return; }
      if ( stereo && stereo.indexOf( stereo2str[b.stereo] ) < 0){ return; }
    
      d3.select(this).classed('highlighted', true);
    }).on('mouseleave', function () {
      d3.select(this).classed('highlighted', false);
    });
  };
  var enable_select = function (graph_el) {
    graph_el.selectAll('.highlight-bond').on('click', function () {
      var $this = d3.select(this);
      $this.classed('selected', !$this.classed('selected') );
    });
  
    graph_el.selectAll('.highlight-atom').on('click', function () {
      var $this = d3.select(this);
      $this.classed('selected', !$this.classed('selected') );
    });
  };
  var get_adjacent_atoms = function (a) {
    var adj = bonds.map(function (b) {
      if (b.a1 == a.idx){ return b.a2; }
      if (b.a2 == a.idx){ return b.a1; }
    }).filter(function(e){ return e !== undefined; });
    
    return adj;
  };
  
  function _events(el) {
    if (_highlight_atoms) {
      enable_atoms_highlight(el, _highlight_atoms.symbols, _highlight_atoms.adjacent);
    }
    if (_highlight_bonds) {
      enable_bonds_highlight(el, _highlight_bonds.order, _highlight_bonds.stereo);
    }
    if (_select) {
      enable_select(el);
    }
    
    rendered = el;
    return el;
  }
  _events.atoms = function (_) {
    if (!arguments.length) {
      return atoms;
    }
    atoms = _;
    
    return _events;
  };
  _events.bonds = function (_) {
    if (!arguments.length) {
      return bonds;
    }
    bonds = _;
    
    return _events;
  };
  
  /******** User interaction ************/
  _events.highlightAtomsEnable = function (enable, symbols, adjacent) {
    if (!arguments.length) {
      return _highlight_atoms;
    }
    if (enable){ 
      _highlight_atoms = {symbols:symbols, adjacent:adjacent};
      
      if ( rendered ) { // molecule is rendered.
        enable_atoms_highlight(rendered, symbols, adjacent);
      }
    } else{
      _highlight_atoms = enable;
    }
    
    return _events;
  };
  _events.highlightBondsEnable = function (enable, order, stereo) {
    if (!arguments.length) {
      return _highlight_bonds;
    }
    if (enable){ 
      _highlight_bonds = {order:order, stereo:stereo};
      
      if ( rendered ) { // molecule is rendered.
        enable_bonds_highlight(rendered, order, stereo);
      }
    } else{ // enable == false;
      _highlight_bonds = enable;
    }
    
    return _events;
  };
  _events.highlightEnable = function (enable) {
    _events.highlightAtomsEnable(enable);
    _events.highlightBondsEnable(enable);
    return _events;
  };
  _events.selectEnable = function (enable) {
    if (!arguments.length) {
      return _select;
    }
    if (enable && rendered){
      enable_select(rendered);
    }
    _select = enable; 
    return _events;
  };
  /**************************************/
  return _events;
};
