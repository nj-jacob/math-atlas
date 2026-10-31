(function () {
  var A = Atlas;
  /* 10 by 10 multiplication table; square numbers on the diagonal are marked */
  function times() {
    var h = '<div class="tbl"><table class="tt"><thead><tr><th>&times;</th>';
    for (var c = 1; c <= 10; c++) h += '<th>' + c + '</th>';
    h += '</tr></thead><tbody>';
    for (var r = 1; r <= 10; r++) {
      h += '<tr><th>' + r + '</th>';
      for (c = 1; c <= 10; c++) h += '<td' + (r === c ? ' class="sq"' : '') + '>' + r * c + '</td>';
      h += '</tr>';
    }
    return h + '</tbody></table></div>';
  }
  A.register('fact-sheet', {
    html:
'<section class="sec"><h2><span class="n">1</span>Place value</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Place</th><th>Value</th></tr></thead><tbody>' +
'<tr><td class="l">Ten thousands</td><td>10 000</td></tr><tr><td class="l">Thousands</td><td>1000</td></tr><tr><td class="l">Hundreds</td><td>100</td></tr><tr><td class="l">Tens</td><td>10</td></tr><tr><td class="l">Ones</td><td>1</td></tr><tr><td class="l">Tenths</td><td>0.1</td></tr></tbody></table></div>' +
'<p>Each place is worth 10 times the place to its right. Numbers with 5 or more digits get a space: 10 000.</p>' +
'<p><b>Rounding:</b> look at the digit just to the right of the place you are rounding to. 5 or more: round up. 4 or less: round down.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Multiplication facts</h2>' +
times() +
'<p>The shaded diagonal shows square numbers. Turn-around facts are equal: 6 &times; 7 = 7 &times; 6. Division undoes multiplication: 42 &divide; 6 = 7 because 6 &times; 7 = 42.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Fact strategy</th><th class="l">Example</th></tr></thead><tbody>' +
'<tr><td class="l">&times; 2: double</td><td class="l">2 &times; 8 = 8 + 8 = 16</td></tr>' +
'<tr><td class="l">&times; 4: double, then double again</td><td class="l">4 &times; 7: 14, then 28</td></tr>' +
'<tr><td class="l">&times; 5: half of &times; 10</td><td class="l">5 &times; 8 = half of 80 = 40</td></tr>' +
'<tr><td class="l">&times; 9: &times; 10, take away one group</td><td class="l">9 &times; 6 = 60 &minus; 6 = 54</td></tr>' +
'<tr><td class="l">Break apart</td><td class="l">7 &times; 8 = 7 &times; 5 + 7 &times; 3 = 35 + 21 = 56</td></tr>' +
'<tr><td class="l">&times; 10, &times; 100, &times; 1000</td><td class="l">each digit moves 1, 2 or 3 places left: 34 &times; 100 = 3400</td></tr></tbody></table></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Fractions and decimals</h2>' +
'<div class="tbl"><table><thead><tr><th>Fraction</th><th>Decimal</th><th class="l">In words</th></tr></thead><tbody>' +
'<tr><td>' + A.fr(1, 10) + '</td><td>0.1</td><td class="l">one tenth</td></tr>' +
'<tr><td>' + A.fr(3, 10) + '</td><td>0.3</td><td class="l">three tenths</td></tr>' +
'<tr><td>' + A.fr(5, 10) + ' = ' + A.fr(1, 2) + '</td><td>0.5</td><td class="l">five tenths, one half</td></tr>' +
'<tr><td>' + A.fr(10, 10) + '</td><td>1.0</td><td class="l">one whole</td></tr>' +
'<tr><td>' + A.mixed(2, 7, 10) + '</td><td>2.7</td><td class="l">two and seven tenths</td></tr></tbody></table></div>' +
'<p>The <b>bottom number</b> (denominator) tells how many equal parts make one whole. The <b>top number</b> (numerator) tells how many parts you have. With the same top number, a bigger bottom number means smaller parts: ' + A.fr(1, 8) + ' is less than ' + A.fr(1, 4) + '.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Measuring</h2>' +
'<div class="tbl"><table><tbody>' +
'<tr><td class="l">10 mm = 1 cm</td><td class="l">100 cm = 1 m</td><td class="l">1000 m = 1 km</td></tr>' +
'<tr><td class="l">1000 g = 1 kg</td><td class="l">1000 mL = 1 L</td><td class="l">1000 mm = 1 m</td></tr>' +
'<tr><td class="l">60 seconds = 1 minute</td><td class="l">60 minutes = 1 hour</td><td class="l">24 hours = 1 day</td></tr>' +
'<tr><td class="l">7 days = 1 week</td><td class="l">12 months = 1 year</td><td class="l">365 days = 1 year (366 in a leap year)</td></tr></tbody></table></div>' +
'<p><b>kilo</b> = 1000 of them. <b>centi</b> = one part of 100. <b>milli</b> = one part of 1000.</p>' +
'<p><b>Benchmarks:</b> paper clip about 1 g; dictionary about 1 kg; teaspoon about 5 mL; milk carton 1 L.</p>' +
'<p><b>Area of a rectangle = length &times; width</b>, in square units (cm&sup2;, m&sup2;). Missing side = area &divide; known side.</p>' +
'<p><b>Elapsed time:</b> jump to the next hour, then whole hours, then the minutes left. Add the jumps.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Shapes, angles and grids</h2>' +
'<div class="tbl"><table><tbody>' +
'<tr><td class="l"><b>Acute</b>: less than a right angle</td><td class="l"><b>Right</b>: a square corner, 90&deg;</td></tr>' +
'<tr><td class="l"><b>Obtuse</b>: between right and straight</td><td class="l"><b>Straight</b>: a straight line, 180&deg;</td></tr>' +
'<tr><td class="l"><b>Parallel</b>: same direction, never meet</td><td class="l"><b>Perpendicular</b>: meet at a right angle</td></tr>' +
'<tr><td class="l"><b>Translation</b>: slide</td><td class="l"><b>Reflection</b>: flip over a mirror line</td></tr></tbody></table></div>' +
'<p>A rectangle has 4 right angles, 2 pairs of parallel sides and 2 lines of symmetry. A square has 4.</p>' +
'<p>Coordinates (across, up): go across first, then up. (0, 0) is the origin.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Patterns, data and chance</h2>' +
'<div class="tbl"><table><tbody>' +
'<tr><td class="l"><b>Mode</b></td><td class="l">the value that appears most often</td></tr>' +
'<tr><td class="l"><b>Median</b></td><td class="l">the middle value when the data are in order</td></tr>' +
'<tr><td class="l"><b>Mean</b></td><td class="l">share the total equally: total &divide; how many</td></tr>' +
'<tr><td class="l"><b>Chance words</b></td><td class="l">impossible, unlikely, equally likely, likely, certain</td></tr>' +
'<tr><td class="l"><b>Pattern rule</b></td><td class="l">a start number and what to do each time: start at 4, add 3</td></tr>' +
'<tr><td class="l"><b>Equation</b></td><td class="l">both sides balance: 3 &times; n = 12, so n = 4</td></tr>' +
'<tr><td class="l"><b>Inequality</b></td><td class="l">&lt; means less than, &gt; means greater than</td></tr></tbody></table></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">7</span>Money</h2>' +
'<p>Bills: $5, $10, $20, $50, $100. Coins: loonie $1, toonie $2, quarter 25&cent;, dime 10&cent;, nickel 5&cent;.</p>' +
'<p><b>Change:</b> count up from the total to the money paid. <b>Saving:</b> weeks needed = goal &divide; amount each week; a remainder means one more week.</p>' +
'<p><b>Earn</b> (get money for work), <b>spend</b> (buy), <b>save</b> (keep for later), <b>invest</b> (use money so it can grow), <b>donate</b> (give to help).</p>' +
'</section>'
  });
})();
