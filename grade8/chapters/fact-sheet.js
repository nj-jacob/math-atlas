(function () {
  var A = Atlas, D = '&deg;', SQ = '<sup>2</sup>';
  function row(cells) { return '<tr>' + cells.map(function (c, i) { return '<td' + (i ? '' : ' class="l"') + '>' + c + '</td>'; }).join('') + '</tr>'; }
  var squares = [];
  for (var i = 1; i <= 15; i++) squares.push(i);
  A.register('fact-sheet', {
    html:
'<section class="sec"><h2><span class="n">1</span>Squares and square roots</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">n</th>' + squares.slice(0, 8).map(function (n) { return '<th>' + n + '</th>'; }).join('') + '</tr></thead><tbody>' +
'<tr><td class="l">n' + SQ + '</td>' + squares.slice(0, 8).map(function (n) { return '<td>' + n * n + '</td>'; }).join('') + '</tr></tbody></table></div>' +
'<div class="tbl"><table><thead><tr><th class="l">n</th>' + squares.slice(8).map(function (n) { return '<th>' + n + '</th>'; }).join('') + '</tr></thead><tbody>' +
'<tr><td class="l">n' + SQ + '</td>' + squares.slice(8).map(function (n) { return '<td>' + n * n + '</td>'; }).join('') + '</tr></tbody></table></div>' +
'<p>&radic;n undoes squaring: &radic;144 = 12. If n is not a perfect square, &radic;n is irrational: it lies between two whole numbers (&radic;50 is between 7 and 8).</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Powers of ten and scientific notation</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Power</th><th>Value</th><th class="l">Prefix</th></tr></thead><tbody>' +
row(['10<sup>9</sup>', '1 000 000 000', 'giga (G)']) + row(['10<sup>6</sup>', '1 000 000', 'mega (M)']) + row(['10<sup>3</sup>', '1000', 'kilo (k)']) + row(['10<sup>0</sup>', '1', '']) +
row(['10<sup>&minus;2</sup>', '0.01', 'centi (c)']) + row(['10<sup>&minus;3</sup>', '0.001', 'milli (m)']) + row(['10<sup>&minus;6</sup>', '0.000 001', 'micro (&micro;)']) + row(['10<sup>&minus;9</sup>', '0.000 000 001', 'nano (n)']) +
'</tbody></table></div>' +
'<p><b>Scientific notation:</b> a &times; 10<sup>n</sup>, where 1 &le; a &lt; 10. 4 500 000 = 4.5 &times; 10<sup>6</sup>. 0.00072 = 7.2 &times; 10<sup>&minus;4</sup>.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Integers and fractions</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Signs</th><th>&times; or &divide;</th></tr></thead><tbody>' +
row(['+ and +', '+']) + row(['&minus; and &minus;', '+']) + row(['+ and &minus;', '&minus;']) + '</tbody></table></div>' +
'<p>Subtracting is adding the opposite: 3 &minus; (&minus;5) = 3 + 5 = 8.</p>' +
'<ul class="steplist"><li><b>Add or subtract fractions:</b> use a common denominator.</li><li><b>Multiply:</b> top &times; top, bottom &times; bottom.</li><li><b>Divide:</b> multiply by the reciprocal (flip the second fraction).</li></ul>' +
'<p><b>Order of operations:</b> brackets, exponents, &times; and &divide; left to right, + and &minus; left to right.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Percents, ratios and rates</h2>' +
'<ul class="steplist"><li>Percent of a number: 15% of 80 = 0.15 &times; 80 = 12.</li><li>Percent change = change &divide; original &times; 100.</li><li>Ontario HST: total = price &times; 1.13.</li><li>Proportion: a : b = c : d, so multiply both parts by the same number.</li><li>Unit rate: divide to get the amount for 1 (per km, per L, per item).</li></ul>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Algebra and data</h2>' +
'<ul class="steplist"><li>Linear pattern: term = (constant difference) &times; n + start value.</li><li>Solve: do the same thing to both sides until the variable is alone.</li><li>Inequality: multiplying or dividing by a negative flips the sign.</li><li>Mean = total &divide; count. Median = middle value. Mode = most often. Range = largest &minus; smallest.</li><li>Probability = favourable outcomes &divide; all outcomes. Independent events: multiply.</li></ul>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Geometry and measurement</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Fact</th><th class="l">Rule</th></tr></thead><tbody>' +
row(['Straight line', '180' + D]) + row(['Around a point', '360' + D]) + row(['Triangle', '180' + D]) + row(['Polygon with n sides', '(n &minus; 2) &times; 180' + D]) +
row(['Parallel lines', 'corresponding and alternate equal; co-interior add to 180' + D]) + '</tbody></table></div>' +
'<div class="tbl"><table><thead><tr><th class="l">Find</th><th class="l">Formula</th></tr></thead><tbody>' +
row(['Pythagoras', 'a' + SQ + ' + b' + SQ + ' = c' + SQ + ' (c is the hypotenuse)']) + row(['Circumference', 'C = &pi;d = 2&pi;r']) + row(['Circle area', 'A = &pi;r' + SQ]) +
row(['Triangle area', 'bh &divide; 2']) + row(['Prism or cylinder volume', 'base area &times; height']) + row(['Cylinder surface area', '2&pi;r' + SQ + ' + 2&pi;rh']) + '</tbody></table></div>' +
'<p>1 cm' + '<sup>3</sup> = 1 mL. 1000 cm<sup>3</sup> = 1 L. Scale factor k: lengths &times; k, areas &times; k' + SQ + '.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">7</span>Money</h2>' +
'<ul class="steplist"><li>Foreign to CAD: multiply by the rate. CAD to foreign: divide.</li><li>Simple interest: I = Prt. Compound: A = P(1 + r)<sup>t</sup>.</li><li>Rule of 72: money doubles in about 72 &divide; rate years.</li><li>Compare contracts and cards by the <b>total</b> cost over the whole term.</li></ul>' +
'</section>'
  });
})();
