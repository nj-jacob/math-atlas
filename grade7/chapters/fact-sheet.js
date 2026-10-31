(function () {
  var A = Atlas, fr = A.fr;
  function rows(list) { return list.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (i === 0 || r.length === 2 ? ' class="l"' : '') + '>' + c + '</td>'; }).join('') + '</tr>'; }).join(''); }
  function tbl(head, list) { return '<div class="tbl"><table><thead><tr>' + head.map(function (h, i) { return '<th' + (i === 0 || head.length === 2 ? ' class="l"' : '') + '>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows(list) + '</tbody></table></div>'; }
  var sq = [];
  for (var i = 1; i <= 15; i++) sq.push('<div><b>' + i + '<sup>2</sup> = ' + i * i + '</b><small>&radic;' + i * i + ' = ' + i + '</small></div>');
  A.register('fact-sheet', {
    html:
'<section class="sec"><h2><span class="n">1</span>Powers and place value</h2>' +
tbl(['Power of ten', 'Standard form', 'Name'], [['10<sup>9</sup>', '1 000 000 000', 'one billion'], ['10<sup>6</sup>', '1 000 000', 'one million'], ['10<sup>3</sup>', '1000', 'one thousand'], ['10<sup>2</sup>', '100', 'one hundred'], ['10<sup>1</sup>', '10', 'ten'], ['10<sup>0</sup>', '1', 'one']]) +
'<p>A power is a short way to write repeated multiplication: 2<sup>5</sup> = 2 &times; 2 &times; 2 &times; 2 &times; 2 = 32. The base is 2 and the exponent is 5. Expanded form with powers: 4072 = 4 &times; 10<sup>3</sup> + 7 &times; 10<sup>1</sup> + 2 &times; 10<sup>0</sup>.</p>' +
'<p><b>Perfect squares</b></p><div class="facts">' + sq.join('') + '</div>' +
'<p><b>GCF</b>: the greatest factor two numbers share. <b>LCM</b>: the least multiple two numbers share. A <b>prime</b> number has exactly two factors, 1 and itself.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Fractions, decimals and percents</h2>' +
tbl(['Fraction', 'Decimal', 'Percent'], [[fr(1, 2), '0.5', '50%'], [fr(1, 3), '0.333...', 'about 33.3%'], [fr(2, 3), '0.666...', 'about 66.7%'], [fr(1, 4), '0.25', '25%'], [fr(3, 4), '0.75', '75%'], [fr(1, 5), '0.2', '20%'], [fr(1, 8), '0.125', '12.5%'], [fr(1, 10), '0.1', '10%'], [fr(1, 20), '0.05', '5%'], [fr(1, 100), '0.01', '1%']]) +
tbl(['To do this', 'Do this'], [['Add or subtract fractions', 'Use a common denominator, then add or subtract the numerators'], ['Simplify a fraction', 'Divide the top and bottom by their GCF'], ['Fraction to decimal', 'Divide the numerator by the denominator'], ['Decimal to percent', 'Multiply by 100'], ['Percent of a number', '25% of 80 = 0.25 &times; 80 = 20']]) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Operations</h2>' +
'<p><b>Order of operations (BEDMAS)</b>: <b>B</b>rackets, <b>E</b>xponents, <b>D</b>ivision and <b>M</b>ultiplication from left to right, <b>A</b>ddition and <b>S</b>ubtraction from left to right.</p>' +
tbl(['Integers', 'Rule', 'Example'], [['Add, same signs', 'Add the sizes, keep the sign', '&minus;4 + (&minus;3) = &minus;7'], ['Add, different signs', 'Subtract the sizes, keep the sign of the bigger size', '&minus;6 + 4 = &minus;2'], ['Subtract', 'Add the opposite', '3 &minus; (&minus;5) = 3 + 5 = 8']]) +
tbl(['Multiply or divide by', 'Decimal point moves'], [['&times; 10, 100, 1000', '1, 2, 3 places right'], ['&divide; 10, 100, 1000', '1, 2, 3 places left'], ['&times; 0.1 is the same as', '&divide; 10']]) +
'<p>Dividing by a fraction: 3 &divide; ' + fr(1, 4) + ' = 12, because there are 12 quarters in 3. A <b>ratio</b> compares parts: 2 : 3. A <b>rate</b> compares different units: 60 km/h. <b>Unit rate</b> = amount &divide; number of units.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Algebra</h2>' +
tbl(['Idea', 'Example'], [['Variable', 'A letter that stands for a number: n'], ['Like terms', '3x and 5x can be added: 8x. 3x and 5 cannot.'], ['Evaluate', 'If n = 4, then 3n + 2 = 3 &times; 4 + 2 = 14'], ['Solve an equation', 'Do the same to both sides: 2x + 3 = 11, 2x = 8, x = 4'], ['Inequality', 'x &lt; 5: every number less than 5. Open dot on the number line'], ['Linear pattern', 'Term = (change) &times; n + (start &minus; change)']]) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Data and probability</h2>' +
tbl(['Measure', 'How to find it'], [['Mean', 'Add all the data, divide by how many'], ['Median', 'The middle value when in order (mean of the two middle values if even)'], ['Mode', 'The value that appears most often'], ['Range', 'Greatest &minus; least'], ['Circle graph angle', 'percent &times; 360&deg;'], ['Probability', 'favourable outcomes &divide; all equally likely outcomes'], ['Independent events', 'P(A and B) = P(A) &times; P(B)'], ['Dependent events', 'The first result changes the chances of the second (no replacing)']]) +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Shapes, circles and volume</h2>' +
tbl(['What', 'Formula'], [['Diameter', 'd = 2 &times; r'], ['Circumference', 'C = &pi; &times; d, with &pi; &asymp; 3.14'], ['Area of a circle', 'A = &pi; &times; r &times; r'], ['Volume of a prism or cylinder', 'V = area of base &times; height'], ['Surface area of a cylinder', '2 circles + rectangle = 2&pi;r<sup>2</sup> + 2&pi;rh'], ['Area of a triangle', 'A = base &times; height &divide; 2'], ['Area of a parallelogram', 'A = base &times; height']]) +
tbl(['Units', 'Equal to'], [['1 m', '100 cm = 1000 mm'], ['1 km', '1000 m'], ['1 cm<sup>3</sup>', '1 mL'], ['1000 cm<sup>3</sup>', '1 L'], ['1 m<sup>3</sup>', '1 000 000 cm<sup>3</sup> = 1000 L']]) +
tbl(['Transformation', 'What it does'], [['Translation', 'Slide: (x, y) moves right/left and up/down'], ['Reflection', 'Flip over a line'], ['Rotation', 'Turn about a point: 90&deg;, 180&deg; or 270&deg;'], ['Dilation', 'Enlarge or shrink by a scale factor. Shape stays the same']]) +
'</section>' +

'<section class="sec"><h2><span class="n">7</span>Money</h2>' +
tbl(['What', 'Rule'], [['Other money to Canadian', 'Multiply by the exchange rate'], ['Canadian to other money', 'Divide by the exchange rate'], ['Weeks to a goal', 'Money still needed &divide; savings per week, rounded up'], ['Simple interest', 'I = P &times; r &times; t'], ['Best account', 'Most interest after fees'], ['Best loan', 'Least interest plus fees'], ['Ontario HST', '13% of the price']]) +
'</section>'
  });
})();
