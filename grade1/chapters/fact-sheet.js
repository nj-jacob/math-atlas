(function () {
  var A = Atlas;
  var W = A.word, nums = [];
  for (var i = 1; i <= 20; i++) nums.push('<tr><td>' + i + '</td><td class="l">' + W(i) + '</td></tr>');
  var tens = [10, 20, 30, 40, 50].map(function (n) { return '<tr><td>' + n + '</td><td class="l">' + W(n) + '</td></tr>'; }).join('');
  function frame(n) { return A.draw.frames(n, { c: 16 }); }
  var pairs = [1, 2, 3, 4, 5].map(function (a) { return '<figure>' + A.draw.frames(a, { b: 10 - a, c: 13 }) + '<figcaption>' + a + ' + ' + (10 - a) + ' = 10</figcaption></figure>'; }).join('');
  A.register('fact-sheet', {
    html:
'<section class="sec"><h2>Numbers to 50</h2>' + A.chart({ cls: { 10: 'b', 20: 'b', 30: 'b', 40: 'b', 50: 'b' } }) +
'<div class="row2"><div class="tbl"><table><thead><tr><th>Number</th><th class="l">Word</th></tr></thead><tbody>' + nums.slice(0, 10).join('') + '</tbody></table></div>' +
'<div class="tbl"><table><thead><tr><th>Number</th><th class="l">Word</th></tr></thead><tbody>' + nums.slice(10).join('') + tens + '</tbody></table></div></div>' +
'<p>Skip count by 2s: 2, 4, 6, 8, 10, 12... &nbsp; by 5s: 5, 10, 15, 20, 25... &nbsp; by 10s: 10, 20, 30, 40, 50.</p>' +
'<p>' + A.draw.tens(3, 4, { u: 9 }) + ' &nbsp; 34 is 3 tens and 4 ones. Ten more than 34 is 44. Ten less is 24.</p></section>' +

'<section class="sec"><h2>Adding and subtracting</h2>' +
'<div class="vrow"><figure>' + frame(5) + '<figcaption>a full row is 5</figcaption></figure><figure>' + frame(10) + '<figcaption>a full frame is 10</figcaption></figure></div>' +
'<p><b>Pairs that make 10:</b></p><div class="vrow">' + pairs + '</div>' +
'<p><b>Doubles:</b> 1 + 1 = 2, 2 + 2 = 4, 3 + 3 = 6, 4 + 4 = 8, 5 + 5 = 10.</p>' +
'<p><b>Turn-arounds:</b> 2 + 5 = 5 + 2. &nbsp; <b>Plus zero:</b> 6 + 0 = 6.</p>' +
'<p><b>A fact family:</b> 3 + 5 = 8, 5 + 3 = 8, 8 &minus; 3 = 5, 8 &minus; 5 = 3.</p>' +
'<p><b>Make a ten:</b> 8 + 5 = 8 + 2 + 3 = 10 + 3 = 13.</p>' +
'<p><b>The = sign</b> means "is the same as": 4 + 3 = 5 + 2.</p></section>' +

'<section class="sec"><h2>Sharing</h2>' +
'<p><b>One half:</b> 1 of 2 equal parts. <b>One fourth:</b> 1 of 4 equal parts. One half is the same as two fourths. More sharers make smaller pieces.</p></section>' +

'<section class="sec"><h2>Shapes and position</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Flat shape</th><th>Sides</th><th>Corners</th></tr></thead><tbody>' +
'<tr><td class="l">circle</td><td>0</td><td>0</td></tr><tr><td class="l">triangle</td><td>3</td><td>3</td></tr><tr><td class="l">square</td><td>4</td><td>4</td></tr><tr><td class="l">rectangle</td><td>4</td><td>4</td></tr><tr><td class="l">hexagon</td><td>6</td><td>6</td></tr></tbody></table></div>' +
'<p><b>Solids:</b> cube (a die), sphere (a ball), cylinder (a can), cone (an ice cream cone), rectangular prism (a box), pyramid (the top of a tower).</p>' +
'<p><b>Position words:</b> above, below, beside, between, in front of, behind, left, right.</p></section>' +

'<section class="sec"><h2>Measuring and the calendar</h2>' +
'<p><b>Length:</b> how long. <b>Area:</b> how much it covers. <b>Mass:</b> how heavy. <b>Capacity:</b> how much it holds. Line up the ends to compare length.</p>' +
'<p><b>Days:</b> Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.</p>' +
'<p><b>Months:</b> January, February, March, April, May, June, July, August, September, October, November, December.</p>' +
'<p><b>Seasons:</b> winter, spring, summer, fall.</p></section>' +

'<section class="sec"><h2>Data and chance</h2>' +
'<p>A tally bundle is 5. A pictograph needs a title, labels and a source. <b>Certain:</b> will happen. <b>Possible:</b> might happen. <b>Impossible:</b> cannot happen.</p></section>' +

'<section class="sec"><h2>Canadian money</h2>' +
'<div class="tbl"><table><thead><tr><th class="l">Money</th><th>Value</th></tr></thead><tbody>' +
'<tr><td class="l">nickel</td><td>5¢</td></tr><tr><td class="l">dime</td><td>10¢</td></tr><tr><td class="l">quarter</td><td>25¢</td></tr><tr><td class="l">50-cent coin</td><td>50¢</td></tr><tr><td class="l">loonie</td><td>$1</td></tr><tr><td class="l">toonie</td><td>$2</td></tr>' +
'<tr><td class="l">$5 bill (blue)</td><td>$5</td></tr><tr><td class="l">$10 bill (purple)</td><td>$10</td></tr><tr><td class="l">$20 bill (green)</td><td>$20</td></tr><tr><td class="l">$50 bill (red)</td><td>$50</td></tr></tbody></table></div>' +
'<p>A bigger coin is not always worth more: a dime is smaller than a nickel but worth more.</p></section>'
  });
})();
