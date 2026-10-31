(function () {
  var A = Atlas, R = A.R, G = A.gcd;
  function lcm(a, b) { return a / G(a, b) * b; }
  function simp(n, d) { var g = G(n, d) || 1; return [n / g, d / g]; }
  /* stacked fraction html, simplified; mixed: show as a mixed number */
  function FR(n, d, mixed) {
    var s = simp(n, d); n = s[0]; d = s[1];
    if (d === 1) return String(n);
    if (mixed && Math.abs(n) > d) { var w = Math.trunc(n / d), r = Math.abs(n % d); return w + ' ' + A.fr(r, d); }
    return A.fr(n, d);
  }
  /* plain text answer: "11/12" or "1 3/4" */
  function TXT(n, d) {
    var s = simp(n, d); n = s[0]; d = s[1];
    if (d === 1) return String(n);
    if (n > d) return Math.floor(n / d) + ' ' + (n % d) + '/' + d;
    return n + '/' + d;
  }
  function raw(n, d) { return A.fr(n, d); }
  var C1 = 'var(--strand)', C2 = 'var(--accent)';

  /* a bar of length (in wholes) total, cut into pieces of 1/d, with the first n shaded */
  function bar(x, y, w, n, d, col, wholes, label) {
    wholes = wholes || 1;
    var s = '', pieces = d * wholes, pw = w / pieces;
    for (var i = 0; i < pieces; i++) s += '<rect x="' + (x + i * pw) + '" y="' + y + '" width="' + pw + '" height="30" style="fill:' + (i < n ? 'color-mix(in srgb,' + col + ' 70%,var(--card))' : 'var(--card)') + ';stroke:var(--ink2)" stroke-width="1"/>';
    for (var k = 0; k <= wholes; k++) s += '<line x1="' + (x + k * w / wholes) + '" y1="' + (y - 4) + '" x2="' + (x + k * w / wholes) + '" y2="' + (y + 34) + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    if (label) s += '<text x="' + (x - 10) + '" y="' + (y + 21) + '" text-anchor="end" font-size="18" class="tb">' + label + '</text>';
    return s;
  }
  /* a/b + or - c/d with bars recut to the common denominator */
  function addPic(a, b, c, d, sub) {
    var L = lcm(b, d), x = 92, w = 290, s = '', ra = a * L / b, rc = c * L / d, res = sub ? ra - rc : ra + rc;
    var wh = Math.max(1, Math.ceil(Math.max(ra, rc, res) / L));
    s += bar(x, 10, w, a, b, C1, 1, a + '/' + b).replace(/(<rect[^>]*)/g, '$1');
    s += bar(x, 52, w, c, d, C2, 1, c + '/' + d);
    s += '<text x="200" y="112" text-anchor="middle" font-size="16" class="t2">cut both into ' + L + 'ths</text>';
    s += bar(x, 124, w, ra, L, C1, 1, ra + '/' + L);
    s += bar(x, 166, w, rc, L, C2, 1, rc + '/' + L);
    var y = 222, rs = '', pw = w / L;
    if (!sub) {
      var tot = ra + rc, W2 = Math.ceil(tot / L) || 1, pw2 = w / (L * W2);
      for (var i = 0; i < L * W2; i++) rs += '<rect x="' + (x + i * pw2) + '" y="' + y + '" width="' + pw2 + '" height="30" style="fill:' + (i < ra ? 'color-mix(in srgb,' + C1 + ' 70%,var(--card))' : i < tot ? 'color-mix(in srgb,' + C2 + ' 70%,var(--card))' : 'var(--card)') + ';stroke:var(--ink2)" stroke-width="1"/>';
      for (var k = 0; k <= W2; k++) rs += '<line x1="' + (x + k * w / W2) + '" y1="' + (y - 4) + '" x2="' + (x + k * w / W2) + '" y2="' + (y + 34) + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    } else {
      for (var j = 0; j < L; j++) rs += '<rect x="' + (x + j * pw) + '" y="' + y + '" width="' + pw + '" height="30" style="fill:' + (j < res ? 'color-mix(in srgb,' + C1 + ' 70%,var(--card))' : j < ra ? 'var(--card)' : 'var(--card)') + ';stroke:var(--ink2)" stroke-width="1"/>' + (j >= res && j < ra ? '<line x1="' + (x + j * pw + 3) + '" y1="' + (y + 27) + '" x2="' + (x + (j + 1) * pw - 3) + '" y2="' + (y + 3) + '" style="stroke:' + C2 + '" stroke-width="2.5"/>' : '');
      rs += '<line x1="' + x + '" y1="' + (y - 4) + '" x2="' + x + '" y2="' + (y + 34) + '" style="stroke:var(--ink)" stroke-width="2.5"/><line x1="' + (x + w) + '" y1="' + (y - 4) + '" x2="' + (x + w) + '" y2="' + (y + 34) + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
    }
    s += rs + '<text x="' + (x - 10) + '" y="' + (y + 21) + '" text-anchor="end" font-size="18" class="tb">' + (sub ? '&#8722;' : '+') + ' =</text>';
    s += '<text x="' + (x + w / 2) + '" y="' + (y + 56) + '" text-anchor="middle" font-size="18" class="tb">' + res + '/' + L + (G(res, L) > 1 && res ? ' = ' + TXT(res, L) : res > L ? ' = ' + TXT(res, L) : '') + '</text>';
    return A.svg(400, y + 64, s, a + '/' + b + (sub ? ' minus ' : ' plus ') + c + '/' + d + '. Cut both into ' + L + 'ths: ' + ra + '/' + L + (sub ? ' minus ' : ' plus ') + rc + '/' + L + ' equals ' + res + '/' + L + '.');
  }
  /* area model for a/b × c/d */
  function areaPic(a, b, c, d) {
    var S = 220, x0 = 60, y0 = 36, s = '', cw = S / b, rh = S / d;
    for (var i = 0; i < b; i++) for (var j = 0; j < d; j++) {
      var inA = i < a, inC = j < c;
      s += '<rect x="' + (x0 + i * cw) + '" y="' + (y0 + j * rh) + '" width="' + cw + '" height="' + rh + '" style="fill:' + (inA && inC ? 'color-mix(in srgb,var(--strand) 75%,var(--accent))' : inA ? 'color-mix(in srgb,' + C1 + ' 25%,var(--card))' : inC ? 'color-mix(in srgb,' + C2 + ' 22%,var(--card))' : 'var(--card)') + ';stroke:var(--ink2)" stroke-width="1"/>';
    }
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + S + '" height="' + S + '" fill="none" style="stroke:var(--ink)" stroke-width="2.5"/>';
    s += '<line x1="' + x0 + '" y1="' + (y0 - 10) + '" x2="' + (x0 + a * cw) + '" y2="' + (y0 - 10) + '" style="stroke:' + C1 + '" stroke-width="5"/><text x="' + (x0 + a * cw / 2) + '" y="' + (y0 - 18) + '" text-anchor="middle" font-size="18" class="tb" style="fill:' + C1 + '">' + a + '/' + b + '</text>';
    s += '<line x1="' + (x0 - 10) + '" y1="' + y0 + '" x2="' + (x0 - 10) + '" y2="' + (y0 + c * rh) + '" style="stroke:' + C2 + '" stroke-width="5"/><text x="' + (x0 - 16) + '" y="' + (y0 + c * rh / 2 + 6) + '" text-anchor="end" font-size="18" class="tb" style="fill:' + C2 + '">' + c + '/' + d + '</text>';
    var tx = x0 + S + 16;
    s += '<text x="' + tx + '" y="' + (y0 + 40) + '" font-size="17">overlap:</text><text x="' + tx + '" y="' + (y0 + 66) + '" font-size="20" class="tb">' + a * c + ' of ' + b * d + '</text><text x="' + tx + '" y="' + (y0 + 92) + '" font-size="17">= ' + TXT(a * c, b * d) + '</text>';
    return A.svg(400, y0 + S + 8, s, 'Area model for ' + a + '/' + b + ' times ' + c + '/' + d + '. The square is cut into ' + b + ' columns and ' + d + ' rows. ' + a + ' columns and ' + c + ' rows overlap in ' + a * c + ' of the ' + b * d + ' small rectangles, so the product is ' + a * c + '/' + b * d + '.');
  }
  /* how many c/d fit in a/b: a bar of a/b with c/d chunks marked */
  function divPic(a, b, c, d) {
    var L = lcm(b, d), A1 = a * L / b, C = c * L / d, wh = Math.max(1, Math.ceil(Math.max(A1, C) / L)), x = 16, w = 368, s = '', pw = w / (L * wh);
    for (var i = 0; i < L * wh; i++) s += '<rect x="' + (x + i * pw) + '" y="30" width="' + pw + '" height="34" style="fill:' + (i < A1 ? 'color-mix(in srgb,' + C1 + ' 30%,var(--card))' : 'var(--card)') + ';stroke:var(--line)" stroke-width="1"/>';
    for (var k = 0; k <= wh; k++) s += '<line x1="' + (x + k * w / wh) + '" y1="24" x2="' + (x + k * w / wh) + '" y2="70" style="stroke:var(--ink)" stroke-width="2.5"/><text x="' + (x + k * w / wh) + '" y="18" text-anchor="middle" font-size="16">' + k + '</text>';
    var full = Math.floor(A1 / C), rem = A1 - full * C, j;
    for (j = 0; j < full; j++) s += '<rect x="' + (x + j * C * pw + 2) + '" y="76" width="' + (C * pw - 4) + '" height="26" rx="4" style="fill:color-mix(in srgb,' + C2 + ' 65%,var(--card));stroke:' + C2 + '"/>' + (C * pw > 22 ? '<text x="' + (x + (j + 0.5) * C * pw) + '" y="95" text-anchor="middle" font-size="16" class="tb">' + (j + 1) + '</text>' : '');
    if (rem > 0) s += '<rect x="' + (x + full * C * pw + 2) + '" y="76" width="' + (rem * pw - 4) + '" height="26" rx="4" style="fill:none;stroke:' + C2 + '" stroke-dasharray="4 3" stroke-width="2"/>';
    s += '<text x="200" y="130" text-anchor="middle" font-size="17">' + a + '/' + b + ' &#247; ' + c + '/' + d + ' = ' + (rem ? full + ' whole' + (full === 1 ? '' : 's') + ' and ' + rem + '/' + C + ' of another = ' + TXT(A1, C) : full) + '</text>';
    return A.svg(400, 140, s, 'A bar showing ' + a + '/' + b + '. Pieces of size ' + c + '/' + d + ' fit into it ' + TXT(A1, C) + ' times.');
  }

  var html =
'<section class="sec"><h2><span class="n">1</span>Adding and subtracting fractions</h2>' +
'<p>You can only add or subtract pieces of the <b>same size</b>. So first cut both fractions into a common denominator. The lowest common multiple of the denominators works best.</p>' +
'<div class="fig">' + addPic(2, 3, 1, 4) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Work out ' + raw(2, 3) + ' + ' + raw(1, 4) + '.</p><ol><li>Find a common denominator: multiples of 3 and 4 meet at 12.</li><li>Rename: ' + raw(2, 3) + ' = ' + raw(8, 12) + ' and ' + raw(1, 4) + ' = ' + raw(3, 12) + '.</li><li>Add the tops, keep the bottom: ' + raw(8, 12) + ' + ' + raw(3, 12) + ' = ' + raw(11, 12) + '.</li></ol></div>' +
A.yt({ q: 'Work out ' + raw(3, 4) + ' &minus; ' + raw(1, 6) + '. Type a fraction like 5/8.', a: 7 / 12, show: '7/12', back: 'Go back to step 1: find a common denominator for 4 and 6. Then rename both fractions before you subtract.', ok: raw(3, 4) + ' = ' + raw(9, 12) + ' and ' + raw(1, 6) + ' = ' + raw(2, 12) + '. 9 &minus; 2 = 7, so the answer is ' + raw(7, 12) + '.' }) +
'<div class="lab"><span class="lt">Try it: same-size pieces</span>' +
'<div class="ctrl"><label for="fan">Top 1<input type="number" id="fan" min="1" max="12" value="2"></label><label for="fad">Bottom 1<input type="number" id="fad" min="2" max="12" value="3"></label>' +
'<label for="fop">Operation<select id="fop"><option value="+">+</option><option value="-">&minus;</option></select></label>' +
'<label for="fcn">Top 2<input type="number" id="fcn" min="1" max="12" value="1"></label><label for="fcd">Bottom 2<input type="number" id="fcd" min="2" max="12" value="4"></label></div>' +
'<div class="fig" id="fafig"></div><div class="out" id="faout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>' + raw(1, 2) + ' + ' + raw(1, 3) + ' is not ' + raw(2, 5) + '. Never add the bottoms. Halves and thirds are different sizes. ' + raw(3, 6) + ' + ' + raw(2, 6) + ' = ' + raw(5, 6) + '.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Mixed numbers</h2>' +
'<p>A <b>mixed number</b> like 2' + raw(1, 3) + ' has a whole part and a fraction part. Add or subtract the wholes and the fractions separately, then tidy up.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>Work out 2' + raw(1, 3) + ' + 1' + raw(3, 4) + '.</p><ol><li>Add the wholes: 2 + 1 = 3.</li><li>Add the fractions: ' + raw(4, 12) + ' + ' + raw(9, 12) + ' = ' + raw(13, 12) + '.</li><li>' + raw(13, 12) + ' is more than 1 whole: ' + raw(13, 12) + ' = 1' + raw(1, 12) + '.</li><li>Total: 3 + 1' + raw(1, 12) + ' = 4' + raw(1, 12) + '.</li></ol></div>' +
'<div class="eg"><b class="t">Worked example: regrouping</b><p>Work out 4' + raw(1, 5) + ' &minus; 1' + raw(3, 5) + '.</p><ol><li>You cannot take ' + raw(3, 5) + ' from ' + raw(1, 5) + '. Trade 1 whole for ' + raw(5, 5) + '.</li><li>4' + raw(1, 5) + ' = 3' + raw(6, 5) + '.</li><li>3' + raw(6, 5) + ' &minus; 1' + raw(3, 5) + ' = 2' + raw(3, 5) + '.</li></ol></div>' +
A.yt({ q: 'Work out 3' + raw(1, 4) + ' &minus; 1' + raw(1, 2) + '. Type a mixed number like 2 1/3.', a: 1.75, show: '1 3/4', back: 'Rename ' + raw(1, 2) + ' as ' + raw(2, 4) + '. Then, as in the regrouping example, trade 1 whole for ' + raw(4, 4) + ' because ' + raw(1, 4) + ' is less than ' + raw(2, 4) + '.', ok: '3' + raw(1, 4) + ' = 2' + raw(5, 4) + '. 2' + raw(5, 4) + ' &minus; 1' + raw(2, 4) + ' = 1' + raw(3, 4) + '.' }) +
'<div class="key"><b class="t">Key idea</b><p>Another way: change both to improper fractions first. 3' + raw(1, 4) + ' = ' + raw(13, 4) + ' and 1' + raw(1, 2) + ' = ' + raw(6, 4) + '. Then ' + raw(13, 4) + ' &minus; ' + raw(6, 4) + ' = ' + raw(7, 4) + ' = 1' + raw(3, 4) + '.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Multiplying fractions</h2>' +
'<p>' + raw(2, 3) + ' &times; ' + raw(3, 4) + ' means "' + raw(2, 3) + ' <b>of</b> ' + raw(3, 4) + '". In the area model, one fraction cuts the square into columns and the other into rows. The overlap is the answer.</p>' +
'<div class="fig">' + areaPic(2, 3, 3, 4) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Work out ' + raw(2, 3) + ' &times; ' + raw(3, 4) + '.</p><ol><li>Multiply the tops: 2 &times; 3 = 6.</li><li>Multiply the bottoms: 3 &times; 4 = 12.</li><li>' + raw(6, 12) + ' simplifies to ' + raw(1, 2) + '. In the picture, 6 of the 12 small rectangles overlap.</li></ol></div>' +
'<div class="lab"><span class="lt">Try it: area model</span>' +
'<div class="ctrl"><label for="man">Columns shaded: <output id="mano"></output><input type="range" id="man" min="1" max="10" value="2"></label><label for="mad">Columns: <output id="mado"></output><input type="range" id="mad" min="1" max="10" value="3"></label></div>' +
'<div class="ctrl"><label for="mcn">Rows shaded: <output id="mcno"></output><input type="range" id="mcn" min="1" max="10" value="3"></label><label for="mcd">Rows: <output id="mcdo"></output><input type="range" id="mcd" min="1" max="10" value="4"></label></div>' +
'<div class="fig" id="mafig"></div><div class="out" id="maout"></div></div>' +
'<p>For whole numbers and mixed numbers, change them to fractions first: 5 = ' + raw(5, 1) + ' and 1' + raw(1, 2) + ' = ' + raw(3, 2) + '.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>Work out 1' + raw(1, 2) + ' &times; 2' + raw(2, 3) + '.</p><ol><li>Change to improper fractions: ' + raw(3, 2) + ' &times; ' + raw(8, 3) + '.</li><li>Multiply: ' + raw(24, 6) + '.</li><li>Simplify: ' + raw(24, 6) + ' = 4.</li></ol></div>' +
A.yt({ q: 'Work out ' + raw(3, 5) + ' &times; ' + raw(2, 3) + '.', a: 0.4, show: '2/5', back: 'Go back to steps 1 and 2: multiply the tops together and the bottoms together. Then simplify.', ok: '3 &times; 2 = 6 and 5 &times; 3 = 15. ' + raw(6, 15) + ' = ' + raw(2, 5) + '.' }) +
'<div class="key"><b class="t">Key idea</b><p>Multiplying by a fraction less than 1 makes a number <b>smaller</b>. ' + raw(3, 4) + ' of 20 is 15, less than 20.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Dividing fractions</h2>' +
'<p>' + raw(3, 4) + ' &divide; ' + raw(1, 8) + ' asks: <b>how many ' + raw(1, 8) + 's fit into ' + raw(3, 4) + '</b>?</p>' +
'<div class="fig">' + divPic(3, 4, 1, 8) + '</div>' +
'<p>Two ways to calculate:</p>' +
'<ul class="steplist"><li><b>Common denominator.</b> Rename both with the same bottom, then divide the tops: ' + raw(6, 8) + ' &divide; ' + raw(1, 8) + ' = 6 &divide; 1 = 6.</li><li><b>Multiply by the reciprocal.</b> Flip the second fraction and multiply: ' + raw(3, 4) + ' &times; ' + raw(8, 1) + ' = ' + raw(24, 4) + ' = 6.</li></ul>' +
'<div class="eg"><b class="t">Worked example</b><p>Work out ' + raw(2, 3) + ' &divide; ' + raw(3, 4) + '.</p><ol><li>Keep the first fraction: ' + raw(2, 3) + '.</li><li>Change &divide; to &times; and flip the second: ' + raw(4, 3) + '.</li><li>' + raw(2, 3) + ' &times; ' + raw(4, 3) + ' = ' + raw(8, 9) + '. That makes sense: ' + raw(3, 4) + ' fits into ' + raw(2, 3) + ' a bit less than once.</li></ol></div>' +
'<div class="lab"><span class="lt">Try it: how many fit?</span>' +
'<div class="ctrl"><label for="dan">Top<input type="number" id="dan" min="1" max="12" value="3"></label><label for="dad">Bottom<input type="number" id="dad" min="2" max="12" value="2"></label>' +
'<span class="unit" style="align-self:center">&divide;</span><label for="dcn">Top<input type="number" id="dcn" min="1" max="12" value="3"></label><label for="dcd">Bottom<input type="number" id="dcd" min="2" max="12" value="4"></label></div>' +
'<div class="fig" id="dafig"></div><div class="out" id="daout"></div></div>' +
A.yt({ q: 'Work out 2 &divide; ' + raw(1, 3) + '.', a: 6, back: 'Ask: how many thirds fit into 2 wholes? Each whole holds 3 thirds. Or flip ' + raw(1, 3) + ' and multiply.', ok: 'Each whole has 3 thirds, so 2 wholes have 6. 2 &times; ' + raw(3, 1) + ' = 6.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>Flip only the <b>second</b> fraction, the one you divide by. ' + raw(2, 3) + ' &divide; ' + raw(3, 4) + ' is not ' + raw(3, 2) + ' &times; ' + raw(3, 4) + '.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Choosing the operation</h2>' +
'<p>In a word problem, decide what is happening before you calculate.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">The story says&hellip;</th><th>Operation</th></tr></thead><tbody>' +
'<tr><td class="l">put together, in total, how much more</td><td>+ or &minus;</td></tr><tr><td class="l">a fraction <b>of</b> something, several groups of a fraction</td><td>&times;</td></tr>' +
'<tr><td class="l">how many pieces of this size fit, share equally</td><td>&divide;</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A ribbon is 4' + raw(1, 2) + ' m long. How many ' + raw(3, 4) + ' m pieces can you cut?</p><ol><li>"How many pieces fit" means divide: 4' + raw(1, 2) + ' &divide; ' + raw(3, 4) + '.</li><li>Improper fractions: ' + raw(9, 2) + ' &divide; ' + raw(3, 4) + ' = ' + raw(9, 2) + ' &times; ' + raw(4, 3) + ' = ' + raw(36, 6) + '.</li><li>' + raw(36, 6) + ' = 6 pieces.</li></ol></div>' +
A.yt({ q: 'A recipe uses ' + raw(2, 3) + ' cup of flour for one batch. You make 2' + raw(1, 2) + ' batches. Which calculation gives the flour you need?', opts: [raw(2, 3) + ' &times; 2' + raw(1, 2), '2' + raw(1, 2) + ' &divide; ' + raw(2, 3), raw(2, 3) + ' + 2' + raw(1, 2), '2' + raw(1, 2) + ' &minus; ' + raw(2, 3)], a: 0, back: 'Look at the table: you have 2' + raw(1, 2) + ' groups of ' + raw(2, 3) + ' cup. Which row is that?', ok: 'Groups of a fraction means multiply: ' + raw(2, 3) + ' &times; ' + raw(5, 2) + ' = ' + raw(10, 6) + ' = 1' + raw(2, 3) + ' cups.' }) +
'<div class="key"><b class="t">Key idea</b><p>Estimate first. 2' + raw(1, 2) + ' batches of about ' + raw(2, 3) + ' cup should be between 1 and 2 cups. If your answer is far from that, check the operation.</p></div>' +
'</section>';

  /* ---- practice ---- */
  var DEN = [2, 3, 4, 5, 6, 8, 10, 12];
  function pf(lv) { var d = R.pick(lv === 1 ? [2, 3, 4, 5, 6, 8] : DEN), n = R.int(1, d - 1); return [n, d]; }
  function ansQ(n, d) { var s = simp(n, d); return { answer: s[0] / s[1], show: TXT(n, d) }; }
  var practice = [
    { id: 'fr-add', name: 'Add fractions', code: 'B2.5', gen: function (lv) {
      var p = pf(lv), q = pf(lv);
      if (lv === 1) q[1] = R.pick([p[1], p[1] * 2 <= 12 ? p[1] * 2 : p[1]]);
      if (lv === 1) q[0] = R.int(1, q[1] - 1);
      var L = lcm(p[1], q[1]), n = p[0] * L / p[1] + q[0] * L / q[1], w1 = 0, w2 = 0;
      if (lv === 3) { w1 = R.int(1, 4); w2 = R.int(1, 3); n += (w1 + w2) * L; }
      var a = ansQ(n, L), t1 = (w1 ? w1 + ' ' : '') + raw(p[0], p[1]), t2 = (w2 ? w2 + ' ' : '') + raw(q[0], q[1]);
      return { q: 'Work out <span class="math">' + t1 + ' + ' + t2 + '</span>. ' + (lv === 3 ? 'Type a mixed number like 3 1/4.' : 'Type a fraction like 5/6.'), type: 'num', answer: a.answer, show: a.show,
        fig: lv === 1 ? addPic(p[0], p[1], q[0], q[1]) : '',
        hint: 'Find a common denominator for ' + p[1] + ' and ' + q[1] + ' first. Do not add the bottoms.',
        steps: ['Common denominator: ' + L + '.', 'Rename: ' + raw(p[0], p[1]) + ' = ' + raw(p[0] * L / p[1], L) + ' and ' + raw(q[0], q[1]) + ' = ' + raw(q[0] * L / q[1], L) + '.' + (lv === 3 ? ' Wholes: ' + w1 + ' + ' + w2 + ' = ' + (w1 + w2) + '.' : ''),
          'Add the tops: ' + (p[0] * L / p[1] + q[0] * L / q[1]) + '/' + L + (lv === 3 ? ', plus the wholes.' : '.') + ' Simplify: ' + a.show + '.'],
        explain: 'The sum is ' + a.show + '.' };
    } },
    { id: 'fr-sub', name: 'Subtract fractions', code: 'B2.5', gen: function (lv) {
      var p = pf(lv), q = pf(lv), L = lcm(p[1], q[1]), x = p[0] * L / p[1], y = q[0] * L / q[1];
      if (x === y) { p = [1, 2]; q = [1, 3]; L = 6; x = 3; y = 2; }
      if (x < y) { var t = p; p = q; q = t; t = x; x = y; y = t; }
      var w1 = 0, w2 = 0;
      if (lv === 3) { w2 = R.int(1, 3); w1 = w2 + R.int(1, 3); if (R.int(0, 1)) { t = p; p = q; q = t; t = x; x = y; y = t; } }
      var n = (w1 * L + x) - (w2 * L + y), a = ansQ(n, L);
      var regroup = lv === 3 && x < y;
      return { q: 'Work out <span class="math">' + (w1 ? w1 + ' ' : '') + raw(p[0], p[1]) + ' &minus; ' + (w2 ? w2 + ' ' : '') + raw(q[0], q[1]) + '</span>.' + (lv === 3 ? ' Type a mixed number or fraction.' : ''), type: 'num', answer: a.answer, show: a.show,
        fig: lv === 1 ? addPic(p[0], p[1], q[0], q[1], true) : '',
        hint: regroup ? 'After renaming, the first fraction part is smaller. Trade 1 whole for ' + raw(L, L) + '.' : 'Rename both fractions with the same denominator, then subtract the tops.',
        steps: ['Common denominator: ' + L + '. ' + raw(p[0], p[1]) + ' = ' + raw(x, L) + ', ' + raw(q[0], q[1]) + ' = ' + raw(y, L) + '.', regroup ? 'Regroup: ' + w1 + ' ' + raw(x, L) + ' = ' + (w1 - 1) + ' ' + raw(x + L, L) + '.' : (w1 ? 'Subtract the wholes: ' + w1 + ' &minus; ' + w2 + ' = ' + (w1 - w2) + '.' : 'Subtract the tops: ' + x + ' &minus; ' + y + ' = ' + (x - y) + '.'), 'The answer is ' + a.show + '.'],
        explain: 'The difference is ' + a.show + '.' };
    } },
    { id: 'fr-mul', name: 'Multiply fractions', code: 'B2.6', gen: function (lv) {
      var p = pf(lv), q = pf(lv), n, d, t1, t2, st1;
      if (lv === 1) { n = p[0] * q[0]; d = p[1] * q[1]; t1 = raw(p[0], p[1]); t2 = raw(q[0], q[1]); st1 = 'Multiply the tops: ' + p[0] + ' &times; ' + q[0] + ' = ' + n + '. Multiply the bottoms: ' + p[1] + ' &times; ' + q[1] + ' = ' + d + '.'; }
      else if (lv === 2) { var w = R.int(2, 9); n = w * q[0]; d = q[1]; t1 = String(w); t2 = raw(q[0], q[1]); st1 = 'Write ' + w + ' as ' + raw(w, 1) + '. Multiply: ' + raw(w * q[0], q[1]) + '.'; }
      else { var a1 = R.int(1, 3), a2 = R.int(1, 2); n = (a1 * p[1] + p[0]) * (a2 * q[1] + q[0]); d = p[1] * q[1]; t1 = a1 + ' ' + raw(p[0], p[1]); t2 = a2 + ' ' + raw(q[0], q[1]); st1 = 'Change to improper fractions: ' + raw(a1 * p[1] + p[0], p[1]) + ' &times; ' + raw(a2 * q[1] + q[0], q[1]) + ' = ' + raw(n, d) + '.'; }
      var a = ansQ(n, d);
      return { q: 'Work out <span class="math">' + t1 + ' &times; ' + t2 + '</span>.' + (lv > 1 ? ' Type a fraction or mixed number.' : ''), type: 'num', answer: a.answer, show: a.show,
        fig: lv === 1 && p[1] <= 8 && q[1] <= 8 ? areaPic(p[0], p[1], q[0], q[1]) : '',
        hint: lv === 3 ? 'Change both mixed numbers to improper fractions first.' : 'Multiply top by top and bottom by bottom. No common denominator needed.',
        steps: [st1, 'Simplify: ' + raw(n, d) + ' = ' + a.show + '.', 'Check with an estimate: does the size make sense?'], explain: t1 + ' &times; ' + t2 + ' = ' + a.show + '.' };
    } },
    { id: 'fr-div', name: 'Divide fractions', code: 'B2.6', gen: function (lv) {
      var p = pf(lv), q = pf(lv), n, d, t1, t2, st;
      if (lv === 1) { var w = R.int(1, 5); q = [1, R.pick([2, 3, 4, 5, 6, 8])]; n = w * q[1]; d = 1; t1 = String(w); t2 = raw(1, q[1]);
        st = ['How many ' + raw(1, q[1]) + 's fit in 1 whole? ' + q[1] + '.', 'In ' + w + ' wholes: ' + w + ' &times; ' + q[1] + ' = ' + n + '.', 'So ' + w + ' &divide; ' + raw(1, q[1]) + ' = ' + n + '.'];
        return { q: 'Work out <span class="math">' + t1 + ' &divide; ' + t2 + '</span>.', type: 'num', answer: n, show: String(n), fig: divPic(w, 1, 1, q[1]), hint: 'How many ' + raw(1, q[1]) + 's fit into one whole? Then into ' + w + '?', steps: st, explain: w + ' &divide; ' + raw(1, q[1]) + ' = ' + n + '.' };
      }
      if (lv === 2) { n = p[0] * q[1]; d = p[1] * q[0]; t1 = raw(p[0], p[1]); t2 = raw(q[0], q[1]); st = ['Keep ' + t1 + ', change &divide; to &times;, flip ' + t2 + ' to ' + raw(q[1], q[0]) + '.', 'Multiply: ' + raw(n, d) + '.']; }
      else if (R.int(0, 1)) { var wn = R.int(2, 9); n = p[0]; d = p[1] * wn; t1 = raw(p[0], p[1]); t2 = String(wn); st = ['Dividing by ' + wn + ' is multiplying by ' + raw(1, wn) + '.', raw(p[0], p[1]) + ' &times; ' + raw(1, wn) + ' = ' + raw(n, d) + '.']; }
      else { var a1 = R.int(1, 4); n = (a1 * p[1] + p[0]) * q[1]; d = p[1] * q[0]; t1 = a1 + ' ' + raw(p[0], p[1]); t2 = raw(q[0], q[1]); st = ['Change ' + t1 + ' to ' + raw(a1 * p[1] + p[0], p[1]) + '.', 'Flip ' + t2 + ' and multiply: ' + raw(a1 * p[1] + p[0], p[1]) + ' &times; ' + raw(q[1], q[0]) + ' = ' + raw(n, d) + '.']; }
      var a = ansQ(n, d);
      return { q: 'Work out <span class="math">' + t1 + ' &divide; ' + t2 + '</span>. Type a fraction, mixed number or whole number.', type: 'num', answer: a.answer, show: a.show,
        hint: 'Flip the second number (the one you divide by) and multiply.', steps: st.concat(['Simplify: ' + a.show + '.']), explain: t1 + ' &divide; ' + t2 + ' = ' + a.show + '.' };
    } },
    { id: 'fr-word', name: 'Fraction word problems', code: 'B2.6', gen: function (lv) {
      var k = R.int(0, lv === 1 ? 1 : 3), n, d, q, st, h;
      if (k === 0) { var c = R.pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4]]), b = R.int(2, 6); n = c[0] * b; d = c[1];
        q = 'A recipe uses ' + raw(c[0], c[1]) + ' cup of milk per batch. How much milk do ' + b + ' batches need? (cups)'; h = 'Several groups of a fraction: multiply.'; st = [b + ' groups of ' + raw(c[0], c[1]) + ': ' + b + ' &times; ' + raw(c[0], c[1]) + '.', '= ' + raw(n, d) + '.']; }
      else if (k === 1) { var L = R.pick([2, 3, 4, 5, 6]), pc = R.pick([[1, 2], [1, 4], [1, 3], [3, 4]]); n = L * pc[1]; d = pc[0]; if (n % d) { pc = [1, 2]; n = L * 2; d = 1; }
        q = 'A board is ' + L + ' m long. How many pieces ' + raw(pc[0], pc[1]) + ' m long can be cut from it?'; h = 'How many pieces of this size fit: divide.'; st = [L + ' &divide; ' + raw(pc[0], pc[1]) + ' = ' + L + ' &times; ' + raw(pc[1], pc[0]) + '.', '= ' + raw(L * pc[1], pc[0]) + '.']; }
      else if (k === 2) { var t = R.pick([[3, 4], [2, 3], [5, 6]]), s = R.pick([[1, 3], [1, 4], [1, 6]]); n = t[0] * s[1] - s[0] * t[1]; d = t[1] * s[1]; if (n <= 0) { t = [3, 4]; s = [1, 3]; n = 5; d = 12; }
        q = 'Mara has ' + raw(t[0], t[1]) + ' of a pizza. She eats ' + raw(s[0], s[1]) + ' of a whole pizza. How much of a pizza is left?'; h = 'Taking away: subtract. Use a common denominator.'; st = [raw(t[0], t[1]) + ' &minus; ' + raw(s[0], s[1]) + '.', 'Common denominator ' + d + ': ' + raw(t[0] * s[1], d) + ' &minus; ' + raw(s[0] * t[1], d) + ' = ' + raw(n, d) + '.']; }
      else { var tot = R.pick([[3, 4], [2, 3], [4, 5]]), fr = R.pick([[1, 2], [1, 3], [2, 3]]); n = tot[0] * fr[0]; d = tot[1] * fr[1];
        q = 'A field is ' + raw(tot[0], tot[1]) + ' km' + '<sup>2</sup>. Corn covers ' + raw(fr[0], fr[1]) + ' of the field. What area is corn? (km<sup>2</sup>)'; h = 'A fraction OF an amount: multiply.'; st = [raw(fr[0], fr[1]) + ' of ' + raw(tot[0], tot[1]) + ' = ' + raw(fr[0], fr[1]) + ' &times; ' + raw(tot[0], tot[1]) + '.', '= ' + raw(n, d) + '.']; }
      var a = ansQ(n, d);
      return { q: q + ' Type a fraction, mixed number or whole number.', type: 'num', answer: a.answer, show: a.show, hint: h + ' Then simplify.', steps: st.concat(['Simplify: ' + a.show + '.']), explain: 'The answer is ' + a.show + '.' };
    } }
  ];

  var quiz = [
    { q: 'Work out ' + raw(1, 2) + ' + ' + raw(2, 5) + '.', type: 'mc', options: ['9/10', '3/7', '3/10', '1 1/10'], answer: 0, hint: 'Use 10 as the common denominator.', explain: raw(5, 10) + ' + ' + raw(4, 10) + ' = ' + raw(9, 10) + '. Adding tops and bottoms gives 3/7, which is wrong.' },
    { q: 'Work out 5' + raw(1, 6) + ' &minus; 2' + raw(2, 3) + '. Type a mixed number.', type: 'num', answer: 2.5, show: '2 1/2', hint: 'Rename ' + raw(2, 3) + ' as ' + raw(4, 6) + '. Then regroup, because ' + raw(1, 6) + ' is less than ' + raw(4, 6) + '.', explain: '5' + raw(1, 6) + ' = 4' + raw(7, 6) + '. 4' + raw(7, 6) + ' &minus; 2' + raw(4, 6) + ' = 2' + raw(3, 6) + ' = 2' + raw(1, 2) + '.' },
    { q: 'Work out ' + raw(3, 8) + ' &times; ' + raw(4, 9) + '.', type: 'num', answer: 1 / 6, show: '1/6', hint: 'Multiply tops and bottoms, then simplify.', explain: raw(12, 72) + ' = ' + raw(1, 6) + '.' },
    { q: 'Work out 2' + raw(1, 4) + ' &times; 4.', type: 'num', answer: 9, hint: 'Change 2' + raw(1, 4) + ' to ' + raw(9, 4) + ' first, or do 2 &times; 4 and ' + raw(1, 4) + ' &times; 4 separately.', explain: raw(9, 4) + ' &times; 4 = ' + raw(36, 4) + ' = 9.' },
    { q: 'Work out ' + raw(5, 6) + ' &divide; ' + raw(1, 3) + '. Type a fraction or mixed number.', type: 'num', answer: 2.5, show: '2 1/2', hint: 'Flip ' + raw(1, 3) + ' and multiply.', explain: raw(5, 6) + ' &times; ' + raw(3, 1) + ' = ' + raw(15, 6) + ' = 2' + raw(1, 2) + '.' },
    { q: 'Work out ' + raw(3, 4) + ' &divide; 6.', type: 'num', answer: 0.125, show: '1/8', hint: 'Dividing by 6 is the same as multiplying by ' + raw(1, 6) + '.', explain: raw(3, 4) + ' &times; ' + raw(1, 6) + ' = ' + raw(3, 24) + ' = ' + raw(1, 8) + '.' },
    { q: 'A jug holds 3' + raw(3, 4) + ' L of juice. Each glass holds ' + raw(1, 4) + ' L. How many glasses can be filled?', type: 'num', answer: 15, hint: 'How many quarters fit in 3' + raw(3, 4) + '? Divide.', explain: '3' + raw(3, 4) + ' = ' + raw(15, 4) + '. ' + raw(15, 4) + ' &divide; ' + raw(1, 4) + ' = 15 glasses.' }
  ];

  A.register('fractions', {
    html: html, practice: practice, quiz: quiz,
    init: function (root) {
      var $ = function (s) { return A.$(s, root); };
      function iv(id, lo, hi) { var v = Math.round(+$('#' + id).value); return isNaN(v) ? null : Math.max(lo, Math.min(hi, v)); }
      A.bind(root, ['fan', 'fad', 'fcn', 'fcd', 'fop'], function () {
        var a = iv('fan', 1, 12), b = iv('fad', 2, 12), c = iv('fcn', 1, 12), d = iv('fcd', 2, 12), sub = $('#fop').value === '-';
        if (a === null || b === null || c === null || d === null) return;
        if (a >= b || c >= d) { $('#fafig').innerHTML = ''; $('#faout').innerHTML = 'Keep each top smaller than its bottom (a proper fraction), like 2/3.'; return; }
        var L = lcm(b, d), x = a * L / b, y = c * L / d, r = sub ? x - y : x + y;
        if (r < 0) { $('#fafig').innerHTML = ''; $('#faout').innerHTML = raw(a, b) + ' is smaller than ' + raw(c, d) + ', so the answer would be negative. Swap them to see a picture.'; return; }
        $('#fafig').innerHTML = addPic(a, b, c, d, sub);
        $('#faout').innerHTML = '<span class="big">' + raw(a, b) + (sub ? ' &minus; ' : ' + ') + raw(c, d) + ' = ' + raw(x, L) + (sub ? ' &minus; ' : ' + ') + raw(y, L) + ' = ' + raw(r, L) + (r === 0 ? '' : (G(r, L) > 1 || r > L) ? ' = ' + FR(r, L, true) : '') + '</span><br>Common denominator: ' + L + '.';
      });
      A.bind(root, ['man', 'mad', 'mcn', 'mcd'], function () {
        var a = +$('#man').value, b = +$('#mad').value, c = +$('#mcn').value, d = +$('#mcd').value;
        if (a > b) { a = b; $('#man').value = a; } if (c > d) { c = d; $('#mcn').value = c; }
        $('#mano').textContent = a; $('#mado').textContent = b; $('#mcno').textContent = c; $('#mcdo').textContent = d;
        $('#mafig').innerHTML = areaPic(a, b, c, d);
        $('#maout').innerHTML = '<span class="big">' + raw(a, b) + ' &times; ' + raw(c, d) + ' = ' + raw(a * c, b * d) + (G(a * c, b * d) > 1 ? ' = ' + FR(a * c, b * d) : '') + '</span><br>' + a + ' &times; ' + c + ' = ' + a * c + ' overlap pieces, out of ' + b + ' &times; ' + d + ' = ' + b * d + '.';
      });
      A.bind(root, ['dan', 'dad', 'dcn', 'dcd'], function () {
        var a = iv('dan', 1, 12), b = iv('dad', 2, 12), c = iv('dcn', 1, 12), d = iv('dcd', 2, 12);
        if (a === null || b === null || c === null || d === null) return;
        var L = lcm(b, d), A1 = a * L / b, C = c * L / d, wh = Math.ceil(Math.max(A1, C) / L);
        if (a / b > 3 || L * wh > 72) { $('#dafig').innerHTML = ''; $('#daout').innerHTML = '<span class="big">' + raw(a, b) + ' &divide; ' + raw(c, d) + ' = ' + FR(a * d, b * c, true) + '</span><br>Too many pieces to draw. Try a first fraction of 3 or less with smaller bottoms.'; return; }
        $('#dafig').innerHTML = divPic(a, b, c, d);
        $('#daout').innerHTML = '<span class="big">' + raw(a, b) + ' &divide; ' + raw(c, d) + ' = ' + raw(a, b) + ' &times; ' + raw(d, c) + ' = ' + FR(a * d, b * c, true) + '</span><br>' + raw(c, d) + ' fits into ' + raw(a, b) + ' ' + TXT(a * d, b * c) + ' time' + (a * d === b * c ? '' : 's') + '.';
      });
    }
  });
})();
