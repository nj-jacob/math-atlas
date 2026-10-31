(function () {
  var A = Atlas, fr = A.fr;
  A.register('fact-sheet', {
    html:
'<section class="sec"><h2><span class="n">1</span>Numbers</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Place</th><th>Value</th><th class="l">Place</th><th>Value</th></tr></thead><tbody>' +
'<tr><td class="l">Millions</td><td>1 000 000</td><td class="l">Ones</td><td>1</td></tr>' +
'<tr><td class="l">Hundred thousands</td><td>100 000</td><td class="l">Tenths</td><td>0.1</td></tr>' +
'<tr><td class="l">Ten thousands</td><td>10 000</td><td class="l">Hundredths</td><td>0.01</td></tr>' +
'<tr><td class="l">Thousands</td><td>1000</td><td class="l">Thousandths</td><td>0.001</td></tr></tbody></table></div>' +
'<p>Each place is worth 10 times the place to its right. Numbers with 5 or more digits get a space every 3 digits: 250 000, but 4500.</p>' +
'<p><b>Integers</b>: &minus;3 is less than &minus;1 (further left on the number line). Opposites like 4 and &minus;4 are the same distance from 0.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Divisible by</th><th class="l">if&hellip;</th></tr></thead><tbody>' +
'<tr><td class="l">2</td><td class="l">the last digit is even</td></tr><tr><td class="l">3</td><td class="l">the sum of the digits is divisible by 3</td></tr>' +
'<tr><td class="l">4</td><td class="l">the last two digits make a number divisible by 4</td></tr><tr><td class="l">5</td><td class="l">the last digit is 0 or 5</td></tr>' +
'<tr><td class="l">6</td><td class="l">it is divisible by 2 and by 3</td></tr><tr><td class="l">8</td><td class="l">the last three digits make a number divisible by 8</td></tr>' +
'<tr><td class="l">9</td><td class="l">the sum of the digits is divisible by 9</td></tr><tr><td class="l">10</td><td class="l">the last digit is 0</td></tr></tbody></table></div>' +
'<p><b>Prime</b>: exactly 2 factors (2, 3, 5, 7, 11, 13, 17, 19, 23, 29&hellip;). <b>Composite</b>: more than 2 factors. 1 is neither.</p>' +
'</section>' +
'<section class="sec"><h2><span class="n">2</span>Fractions, decimals, percents, ratios</h2>' +
'<div class="tbl"><table><thead><tr><th>Fraction</th><th>Decimal</th><th>Percent</th><th>Fraction</th><th>Decimal</th><th>Percent</th></tr></thead><tbody>' +
'<tr><td>' + fr(1, 2) + '</td><td>0.5</td><td>50%</td><td>' + fr(1, 5) + '</td><td>0.2</td><td>20%</td></tr>' +
'<tr><td>' + fr(1, 4) + '</td><td>0.25</td><td>25%</td><td>' + fr(1, 8) + '</td><td>0.125</td><td>12.5%</td></tr>' +
'<tr><td>' + fr(3, 4) + '</td><td>0.75</td><td>75%</td><td>' + fr(1, 10) + '</td><td>0.1</td><td>10%</td></tr>' +
'<tr><td>' + fr(1, 3) + '</td><td>0.<span class="rep">3</span></td><td>about 33%</td><td>' + fr(1, 100) + '</td><td>0.01</td><td>1%</td></tr></tbody></table></div>' +
'<div class="tbl"><table><tbody>' +
'<tr><th class="l">Add or subtract fractions</th><td class="l">make a common denominator first: ' + fr(1, 2) + ' + ' + fr(1, 3) + ' = ' + fr(3, 6) + ' + ' + fr(2, 6) + ' = ' + fr(5, 6) + '</td></tr>' +
'<tr><th class="l">Whole &times; fraction</th><td class="l">3 &times; ' + fr(2, 5) + ' = ' + fr(6, 5) + ' = 1' + fr(1, 5) + '</td></tr>' +
'<tr><th class="l">Whole &divide; fraction</th><td class="l">how many fit? 3 &divide; ' + fr(1, 4) + ' = 12</td></tr>' +
'<tr><th class="l">Ratio</th><td class="l">compares amounts: 2:3 is the same as 4:6 and 10:15</td></tr>' +
'<tr><th class="l">Unit rate</th><td class="l">the amount for 1: $6 for 4 kg is $1.50 per kg</td></tr>' +
'<tr><th class="l">Percent of a number</th><td class="l">10% = &divide; 10, 1% = &divide; 100, 50% = half, 25% = quarter</td></tr></tbody></table></div>' +
'</section>' +
'<section class="sec"><h2><span class="n">3</span>Decimals and algebra</h2>' +
'<div class="tbl"><table><tbody>' +
'<tr><th class="l">Estimate first</th><td class="l">round, then calculate; check the answer is close</td></tr>' +
'<tr><th class="l">&times; 10, 100, 1000</th><td class="l">digits move 1, 2, 3 places to the left</td></tr>' +
'<tr><th class="l">&divide; 0.1, 0.01</th><td class="l">the same as &times; 10, &times; 100</td></tr>' +
'<tr><th class="l">Order of operations</th><td class="l">brackets, then &times; and &divide; left to right, then + and &minus; left to right</td></tr>' +
'<tr><th class="l">Linear pattern rule</th><td class="l">term = (growth each step) &times; n + (first term &minus; growth). 5, 8, 11term = (amount it grows by) &times; n + (start adjustment), e.g. 3n + 2hellip; is 3n + 2</td></tr>' +
'<tr><th class="l">Solve an equation</th><td class="l">do the same to both sides to keep the balance: 3x + 4 = 19, so 3x = 15, x = 5</td></tr>' +
'<tr><th class="l">Inequality</th><td class="l">x &lt; 5 means every number less than 5; x &ge; 5 includes 5</td></tr></tbody></table></div>' +
'</section>' +
'<section class="sec"><h2><span class="n">4</span>Data and probability</h2>' +
'<div class="tbl"><table><tbody>' +
'<tr><th class="l">Mean</th><td class="l">add the values, divide by how many</td></tr>' +
'<tr><th class="l">Median</th><td class="l">middle value in order (average of the two middles if even)</td></tr>' +
'<tr><th class="l">Mode</th><td class="l">the value that appears most often</td></tr>' +
'<tr><th class="l">Range</th><td class="l">greatest &minus; least</td></tr>' +
'<tr><th class="l">Discrete or continuous</th><td class="l">counted, or measured</td></tr>' +
'<tr><th class="l">Histogram</th><td class="l">bars touch; each interval includes its start, not its end</td></tr>' +
'<tr><th class="l">Probability</th><td class="l">favourable outcomes &divide; all equally likely outcomes; from 0 (impossible) to 1 (certain)</td></tr>' +
'<tr><th class="l">Two events</th><td class="l">list or grid every pair: a coin and a die give 2 &times; 6 = 12 outcomes</td></tr></tbody></table></div>' +
'</section>' +
'<section class="sec"><h2><span class="n">5</span>Shapes, grids and measurement</h2>' +
'<div class="tbl"><table><tbody>' +
'<tr><th class="l">Rectangle / parallelogram</th><td class="l">A = base &times; height</td></tr>' +
'<tr><th class="l">Triangle</th><td class="l">A = base &times; height &divide; 2</td></tr>' +
'<tr><th class="l">Trapezoid</th><td class="l">A = (top + bottom) &times; height &divide; 2</td></tr>' +
'<tr><th class="l">Rhombus or kite</th><td class="l">A = diagonal &times; diagonal &divide; 2</td></tr>' +
'<tr><th class="l">Surface area</th><td class="l">add the areas of all faces in the net</td></tr>' +
'<tr><th class="l">Units</th><td class="l">10 mm = 1 cm, 100 cm = 1 m, 1000 m = 1 km, 1000 g = 1 kg, 1000 mL = 1 L, 1 m² = 10 000 cm²</td></tr>' +
'<tr><th class="l">Angles</th><td class="l">complementary add to 90&deg;; supplementary add to 180&deg;; opposite angles are equal; a triangle adds to 180&deg;; a quadrilateral adds to 360&deg;; clockwise + counterclockwise = 360&deg;</td></tr>' +
'<tr><th class="l">Cartesian plane</th><td class="l">(x, y): across first, then up or down. Quadrants I to IV go counterclockwise from top right</td></tr>' +
'<tr><th class="l">Moves</th><td class="l">reflect in x-axis (x, &minus;y); in y-axis (&minus;x, y); rotate 180&deg; (&minus;x, &minus;y); 90&deg; clockwise (y, &minus;x)</td></tr></tbody></table></div>' +
'</section>' +
'<section class="sec"><h2><span class="n">6</span>Money</h2>' +
'<div class="tbl"><table><tbody>' +
'<tr><th class="l">Debit or credit</th><td class="l">debit uses your money; credit is borrowed and may charge interest</td></tr>' +
'<tr><th class="l">Weeks to a goal</th><td class="l">(goal &minus; saved) &divide; amount per week, rounded up</td></tr>' +
'<tr><th class="l">Simple interest</th><td class="l">amount &times; rate &times; years. Loan total = amount + interest</td></tr>' +
'<tr><th class="l">Ontario HST</th><td class="l">13% of the price</td></tr>' +
'<tr><th class="l">Share resources</th><td class="l">trade (swap), lend (owner, gets it back), borrow (user, gives it back), donate (give, nothing back)</td></tr></tbody></table></div>' +
'</section>'
  });
})();
