(function () {
  var A = Atlas, D = A.draw, CASH = A.CASH;
  function poly(n, cx, cy, r) {
    var p = [], rot = -Math.PI / 2 + (n % 2 ? 0 : Math.PI / n);
    for (var i = 0; i < n; i++) { var a = rot + 2 * Math.PI * i / n; p.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1)); }
    return '<polygon points="' + p.join(' ') + '" style="fill:color-mix(in srgb,var(--se) 30%,var(--card));stroke:var(--ink)" stroke-width="3" stroke-linejoin="round"/>';
  }
  var SHAPES = [[3, 'triangle'], [4, 'quadrilateral'], [5, 'pentagon'], [6, 'hexagon'], [8, 'octagon']];
  var NAME = { 2: 'halves', 3: 'thirds', 4: 'fourths', 6: 'sixths' };
  function cells(list) { return list.map(function (x) { return '<td>' + x + '</td>'; }).join(''); }

  A.register('fact-sheet', {
    html:
'<section class="sec"><h2><span class="n">1</span>Place value</h2>' +
'<div class="pvt"><div><span class="h c2">Hundreds</span><span class="d">1</span></div><div><span class="h c1">Tens</span><span class="d">2</span></div><div><span class="h c0">Ones</span><span class="d">5</span></div></div>' +
'<div class="fig">' + D.base10(1, 2, 5, { label: '1 hundred, 2 tens and 5 ones make 125' }) + '</div>' +
'<p><b>125</b> = 100 + 20 + 5 = one hundred twenty-five.</p>' +
'<p>10 ones = 1 ten. 10 tens = 1 hundred. Even numbers end in 0, 2, 4, 6 or 8. Odd numbers end in 1, 3, 5, 7 or 9.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Facts to know</h2>' +
'<div class="tbl"><table><thead><tr><th scope="row">Make 10</th>' + cells(['1 + 9', '2 + 8', '3 + 7', '4 + 6', '5 + 5']) + '</tr></thead></table></div>' +
'<div class="tbl"><table><thead><tr><th scope="col">Double</th><th scope="col">Sum</th><th scope="col">Double</th><th scope="col">Sum</th></tr></thead><tbody>' +
[1, 2, 3, 4, 5].map(function (n) { return '<tr><td>' + n + ' + ' + n + '</td><td><b>' + 2 * n + '</b></td><td>' + (n + 5) + ' + ' + (n + 5) + '</td><td><b>' + 2 * (n + 5) + '</b></td></tr>'; }).join('') + '</tbody></table></div>' +
'<p>A fact family: 8 + 5 = 13, 5 + 8 = 13, 13 &minus; 5 = 8, 13 &minus; 8 = 5. Adding and subtracting undo each other.</p>' +
'<p>The = sign means <b>both sides are the same amount</b>.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Fair shares</h2>' +
'<div class="vrow">' + [2, 3, 4, 6].map(function (d) { return '<figure>' + D.pie(1, d, 44, 'A circle in ' + d + ' equal parts, one shaded') + '<figcaption>' + d + ' equal parts: <b>' + NAME[d] + '</b></figcaption></figure>'; }).join('') + '</div>' +
'<p>More sharers means smaller shares. One third is the same amount as two sixths.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Shapes</h2>' +
'<div class="vrow">' + SHAPES.map(function (s) { return '<figure>' + A.svg(96, 96, poly(s[0], 48, 50, 40), 'A ' + s[1] + ' with ' + s[0] + ' sides') + '<figcaption><b>' + s[1] + '</b><br>' + s[0] + ' sides</figcaption></figure>'; }).join('') + '</div>' +
'<p>A <b>line of symmetry</b> folds a shape into two matching halves. <b>Congruent</b> shapes are the same size and the same shape.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Measuring and time</h2>' +
'<div class="tbl"><table><tbody>' +
'<tr><th scope="row">100 centimetres</th><td>1 metre</td></tr>' +
'<tr><th scope="row">about 1 cm</th><td>the width of your fingertip</td></tr>' +
'<tr><th scope="row">about 1 m</th><td>the width of a door</td></tr>' +
'<tr><th scope="row">60 seconds</th><td>1 minute</td></tr>' +
'<tr><th scope="row">60 minutes</th><td>1 hour</td></tr>' +
'</tbody></table></div>' +
'<p>Measure from <b>0</b> on the ruler. The short hand on a clock shows the hour.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Money</h2>' +
'<div class="vrow">' + [5, 10, 25, 100, 200].map(function (v) { return '<figure>' + D.wallet([v], { W: 60, scale: 1.4, label: 'a ' + CASH[v].n }) + '<figcaption><b>' + CASH[v].n + '</b><br>' + (v < 100 ? v + '¢' : v + '¢ = $' + v / 100) + '</figcaption></figure>'; }).join('') + '</div>' +
'<p>Bills: $5, $10, $20, $50, $100. Count money starting with the biggest coin or bill.</p>' +
'</section>' +

'<section class="sec"><h2><span class="n">7</span>Data and chance</h2>' +
'<p>The <b>mode</b> is the answer that shows up most often. A graph needs a title, labels and a source.</p>' +
'<p><b>Impossible</b>: cannot happen. <b>Possible</b>: might happen. <b>Certain</b>: will happen for sure.</p>' +
'</section>'
  });
})();
