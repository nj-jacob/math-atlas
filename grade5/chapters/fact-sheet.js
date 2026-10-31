(function () {
  var A = Atlas, F = A.fig || {};
  function th(fig, name, def) { return '<figure>' + fig + '<figcaption><b>' + name + '</b><br>' + def + '</figcaption></figure>'; }
  /* ten disks of one place make one disk of the next place */
  function tenMakes(p) {
    var s = '', r = 13;
    for (var i = 0; i < 10; i++) s += A.draw.disk(18 + (i % 5) * 30, 18 + Math.floor(i / 5) * 30, r, p);
    s += '<text x="178" y="42" text-anchor="middle" font-size="26" font-weight="800">=</text>' + A.draw.disk(232, 32, 26, p + 1);
    return A.svg(266, 64, s, 'Ten ' + A.PLACES[p] + ' make one ' + A.PLACE1[p + 1]);
  }
  var PV = [['Hundred thousands', '100 000', 'c5t'], ['Ten thousands', '10 000', 'c4t'], ['Thousands', '1000', 'c3t'], ['Hundreds', '100', 'c2t'], ['Tens', '10', 'c1t'], ['Ones', '1', 'c0t'], ['Tenths', '0.1', 'cm1t'], ['Hundredths', '0.01', 'cm2t']];
  A.register('fact-sheet', {
    html:
'<section class="sec"><h2><span class="n">1</span>Place value</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Place</th><th>Value</th></tr></thead><tbody>' +
PV.map(function (r) { return '<tr><td class="l"><b class="' + r[2] + '">' + r[0] + '</b></td><td><b class="' + r[2] + '">' + r[1] + '</b></td></tr>'; }).join('') + '</tbody></table></div>' +
'<div class="pies">' + tenMakes(0) + tenMakes(1) + '</div>' +
'<p>Each place is worth 10 times the place to its right. &times; 0.1 is the same as &divide; 10. &times; 0.01 is the same as &divide; 100.</p>' +
'</section>' +
'<section class="sec"><h2><span class="n">2</span>Fractions, decimals and percents</h2>' +
'<div class="tbl"><table><thead><tr><th>Fraction</th><th>Decimal</th><th>Percent</th></tr></thead><tbody>' +
'<tr><td>1/2</td><td>0.5</td><td>50%</td></tr><tr><td>1/4</td><td>0.25</td><td>25%</td></tr><tr><td>3/4</td><td>0.75</td><td>75%</td></tr>' +
'<tr><td>1/5</td><td>0.2</td><td>20%</td></tr><tr><td>2/5</td><td>0.4</td><td>40%</td></tr><tr><td>3/5</td><td>0.6</td><td>60%</td></tr><tr><td>4/5</td><td>0.8</td><td>80%</td></tr>' +
'<tr><td>1/10</td><td>0.1</td><td>10%</td></tr><tr><td>1/20</td><td>0.05</td><td>5%</td></tr><tr><td>1/100</td><td>0.01</td><td>1%</td></tr></tbody></table></div>' +
'<div class="fig">' + A.draw.fbars([{ n: 1, d: 2, label: '1/2' }, { n: 1, d: 4, label: '1/4' }, { n: 3, d: 4, label: '3/4' }, { n: 1, d: 5, label: '1/5' }, { n: 1, d: 10, label: '1/10' }], { w: 400, lw: 60, label: 'Bars for 1/2, 1/4, 3/4, 1/5 and 1/10 of the same whole' }) + '</div>' +
'<p>Equivalent fractions: multiply or divide the top and bottom by the same number. Like fractions: add or subtract the tops, keep the bottom. 3 &divide; 1/4 = 12.</p>' +
'</section>' +
'<section class="sec"><h2><span class="n">3</span>Formulas and rules</h2>' +
(F.rect ? '<div class="pies">' + th(F.rect(4, 3, 24), 'Rectangle', 'P = 2 &times; (l + w)<br>A = b &times; h') + th(F.shape('para', 6, 4), 'Parallelogram', 'A = b &times; h') + th(F.shape('tri', 6, 4), 'Triangle', 'A = b &times; h &divide; 2') + th(F.angTri(50, 60, 70), 'Angles of a triangle', '50 + 60 + 70 = 180') + '</div>' : '') +
'<div class="tbl"><table><thead><tr><th class="l">What</th><th class="l">Rule</th></tr></thead><tbody>' +
'<tr><td class="l">Perimeter of a rectangle</td><td class="l">P = 2 &times; (length + width)</td></tr>' +
'<tr><td class="l">Area of a rectangle</td><td class="l">A = base &times; height</td></tr>' +
'<tr><td class="l">Area of a parallelogram</td><td class="l">A = base &times; height</td></tr>' +
'<tr><td class="l">Area of a triangle</td><td class="l">A = base &times; height &divide; 2</td></tr>' +
'<tr><td class="l">Angles in a triangle</td><td class="l">add up to 180&deg;</td></tr>' +
'<tr><td class="l">Mean</td><td class="l">sum of the data &divide; number of data</td></tr>' +
'<tr><td class="l">Median</td><td class="l">middle value when the data is in order</td></tr>' +
'<tr><td class="l">Probability</td><td class="l">ways the event can happen &divide; all equally likely outcomes</td></tr>' +
'<tr><td class="l">Relative frequency</td><td class="l">frequency &divide; total</td></tr>' +
'<tr><td class="l">Unit rate</td><td class="l">price &divide; amount</td></tr>' +
'<tr><td class="l">Ontario HST</td><td class="l">13% of the price (5% federal + 8% provincial)</td></tr>' +
'<tr><td class="l">Check a division</td><td class="l">divisor &times; quotient + remainder = total</td></tr></tbody></table></div>' +
'</section>' +
'<section class="sec"><h2><span class="n">4</span>Units</h2>' +
'<div class="tbl"><table><tbody>' +
'<tr><td class="l">10 mm = 1 cm</td><td class="l">100 cm = 1 m</td><td class="l">1000 m = 1 km</td></tr>' +
'<tr><td class="l">1000 g = 1 kg</td><td class="l">1000 mL = 1 L</td><td class="l">1000 mm = 1 m</td></tr></tbody></table></div>' +
(F.stair ? '<div class="fig">' + F.stair('length') + '</div><div class="pies">' + F.stair('mass') + F.stair('capacity') + '</div>' : '') +
'<p>Larger unit to smaller unit: multiply. Each step down the stairs, multiply by the number on the arrow.</p>' +
'</section>' +
'<section class="sec"><h2><span class="n">5</span>Shapes, angles and grids</h2>' +
(F.angleBench ? '<p><b>Angles</b></p>' + F.angleBench() : '') + (F.triGallery ? F.triGallery() : '') + (F.moves ? '<p><b>Moves on a grid</b></p>' + F.moves() : '') +
'<p>Coordinates (x, y): across first, then up. Congruent shapes have the same size and shape.</p>' +
'</section>'
  });
})();
