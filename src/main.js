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
  var molfile;
  
  var renderer = require('./renderer')();
  var events = require('./events')();
  
  function _main(el) {
    if (molfile === undefined) {
      console.error('No Mol file provided.');
    }
    
    var parsed_mol = require('./parser')(molfile);
    var atoms = parsed_mol[0],
      bonds = parsed_mol[1];
    
    el.call(
      renderer.atoms(atoms).bonds(bonds)
    );                  // Render molecule.
        
    
    el.call(
      events.atoms(atoms).bonds(bonds)
    );
  }
  // Input File
  _main.molfile = function (_) {
    if (!arguments.length) {
      return molfile;
    }
    molfile = _;
    
    return _main;
  };
  
  /******** Rendering config ************/
  _main.implicitH = functor(renderer.implicitH);
  _main.noSymbols = functor(renderer.noSymbols);  
  _main.organic = functor(renderer.organic);
  /**************************************/
  
  /******** User interaction ************/
  _main.highlightAtomsEnable = functor(events.highlightAtomsEnable);
  _main.highlightBondsEnable = functor(events.highlightBondsEnable);
  _main.highlightEnable = functor(events.highlightEnable);
  _main.selectEnable = functor(events.selectEnable);
  /**************************************/
  
  /******** State control ***************/
  _main.hightlightAtom = events.hightlightAtom;
  _main.hightlightBond = events.hightlightBond;
  _main.selectAtom = events.selectAtom;
  _main.selectBond = events.selectBond;
  _main.getSelectedAtoms = events.getSelectedAtoms;
  _main.getHighlightedAtoms = events.getHighlightedAtoms;
  _main.getSelectedBonds = events.getSelectedBonds;
  /**************************************/
  
  /******** SVG attributes **************/  
  _main.width = functor(renderer.width);
  _main.height = functor(renderer.height);
  
  
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
