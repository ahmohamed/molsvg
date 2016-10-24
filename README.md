# molsvg: render MDL mol & sdf files as svg

molsvg is javascript library to draw chemical molecules from Mol and SDF files as SVG. molsvg uses D3 style for creating svg elements from data. User interactivity is enabled through highlight ir select event handling.

### Usage

You can use molsvg using the same signature as D3. [See it live](http://codepen.io/ahmohamed/pen/ozmomR)

```html
<div id="molecule">
</div>
```


```javascript
d3.text("https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/aspirin/sdf/", function (svg_mol) {
  d3.select('#normal div').call(
    molsvg()
      .molfile(svg_mol)
  );
});
```

That's it!!

###Options

### Events

### Limitations

 
### License
Licensed under the LGPL License.
