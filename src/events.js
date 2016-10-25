module.exports = function () {
  var atoms, bonds;
  var _highlight_atoms = true, _highlight_bonds = true, _select;
  var rendered;
  var highligh_atom = function (atom_idx) {
    if (atom_idx.constructor !== Array){
      atom_idx = [atom_idx];
    }
    rendered.selectAll('.highlight-atom')
      .filter(function(d){ return atom_idx.indexOf(d.idx) > -1; })
      .classed('highlighted', true);
  };
  var highligh_bond = function (bond_idx) {
    if (bond_idx.constructor !== Array){
      bond_idx = [bond_idx];
    }
    rendered.selectAll('.highlight-bond')
      .filter(function(d){ return bond_idx.indexOf(d.idx) > -1; })
      .classed('highlighted', true);
  };
  var enable_atoms_highlight = function (graph_el, symbols, adjacent) {
    graph_el.selectAll('.highlight-atom').on('mouseenter', function () {
      if (symbols && symbols.constructor !== Array){
        symbols = [symbols];
      }
    
      var $this = d3.select(this);
      var a = $this.datum();
    
      // Check if the atom symbol matches.
      if ( symbols && symbols.indexOf(a.symbol) < 0){
        // Atom symbol does not match. Check adjacent atoms if allowed.
        if (adjacent) {
          var adjacent_atoms = get_adjacent_atoms(a, symbols);
          if (adjacent_atoms.length > 0){          
            d3.select(this).classed('highlighted', true);
            highligh_atom(adjacent_atoms);
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
      if ( b.order === 1 &&               // Stereo is only considered in single bonds.
        stereo && stereo.indexOf( stereo2str[b.stereo] ) < 0){
        return; 
      }
    
      d3.select(this).classed('highlighted', true);
    }).on('mouseleave', function () {
      d3.select(this).classed('highlighted', false);
    });
  };
  var enable_select = function (graph_el, multiple) {
    graph_el.selectAll('.highlight-bond').on('click', function () {
      var $this = d3.select(this);
      if (!$this.classed('highlighted')) {
        return;
      }
      if (!multiple) {
        graph_el.selectAll('.highlight-bond.selected:not(.highlighted)')
          .classed('selected', false);
      }
      
      $this.classed('selected', !$this.classed('selected') );
    });
  
    graph_el.selectAll('.highlight-atom').on('click', function () {
      if (!d3.select(this).classed('highlighted')) {
        return;
      }
      if (!multiple) {
        graph_el.selectAll('.highlight-atom.selected:not(.highlighted)')
          .classed('selected', false);
      }
      
      var $els = graph_el.selectAll('.highlight-atom.highlighted');
      
      if (_highlight_atoms.symbols) {
        $els = $els.filter(function(d){ return _highlight_atoms.symbols.indexOf(d.symbol) > -1;});
      }
      
      if ($els.size() > 0){
        $els.classed('selected', !$els.classed('selected') );
      } else {
        // If the clicked atom is highlighted.
        // This indicates that the atom is either a selectable atom (includes in highlight symbols)
        // or adjancent to selectable atoms. The first case is staightforward, and the clicked atom
        // will be selected. In the second case, the adjacent atoms (with the target symbols) are highlighted.
        // Therefore, will be retained in $els.filter().
        // If there are not any retained atoms, it means that the adjacent atoms are implicit (Hydrogens).
        // In this case, select the clicked atom instead. 
        var $this = d3.select(this);
        $this.classed('selected', !$this.classed('selected') );
      }
      
    });
  };
  var get_adjacent_atoms = function (a, symbols) {
    if (symbols && symbols.constructor !== Array){
      symbols = [symbols];
    }
    
    var adj = bonds.map(function (b) {
      if (b.a1 == a.idx){ return b.a2; }
      if (b.a2 == a.idx){ return b.a1; }
    }).filter(function(e){ return e !== undefined; });
    
    if (symbols) {
      adj = adj.filter(function (adj_a) {
        return symbols.indexOf( atoms[adj_a].symbol ) > -1;
      });
    }
    
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
      enable_select(el, _select.multiple);
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
  _events.selectEnable = function (enable, multiple) {
    if (!arguments.length) {
      return _select;
    }
    if (enable){
      _select = {multiple:multiple};
      if (rendered) {
        enable_select(rendered, multiple);
      }      
    }else {
      _select = enable; 
    }    
    return _events;
  };
  /**************************************/
  
  /******** State control ***************/
  _events.hightlightAtom = function(atom_idx){
    if (!rendered){ return; }
    highligh_atom(atom_idx);
  };
  _events.hightlightBond = function(bond_idx){
    if (!rendered){ return; }
    highligh_bond(bond_idx);
  };
  /**************************************/
  return _events;
};
