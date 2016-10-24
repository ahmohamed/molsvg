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
        idx: i-offset,
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
        idx: j - (nAtoms+offset),
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
