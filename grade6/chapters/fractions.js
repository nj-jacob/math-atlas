(function () {
  var A = Atlas, R = A.R, gcd = A.gcd;
  function lcm(a, b) { return a / gcd(a, b) * b; }
  /* a fraction n/d in simplest form, as a mixed number when it is more than 1 */
  function F(n, d, keep) {
    if (!keep) { var g = gcd(n, d) || 1; n /= g; d /= g; }
    if (n === 0) return '0';
    if (d === 1) return String(n);
    if (n > d && !keep) return Math.floor(n / d) + (n % d ? ' ' + A.fr(n % d, d) : '');
    return A.fr(n, d);
  }
  function plain(n, d) { var g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : n > d ? Math.floor(n / d) + ' ' + (n % d) + '/' + d : n + '/' + d; }
  /* multiple choice with fractions: drop any wrong choice equal in value to the right one */
  function mcF(r, wrong) {
    var seen = {}, list = [];
    seen[r[0] / r[1]] = 1;
    wrong.forEach(function (w) { if (w[1] > 0 && w[0] >= 0 && !seen[w[0] / w[1]]) { seen[w[0] / w[1]] = 1; list.push(F(w[0], w[1])); } });
    return R.mc(F(r[0], r[1]), list.slice(0, 3));
  }
  var COLS = ['color-mix(in srgb,var(--strand) 78%,var(--card))', 'color-mix(in srgb,var(--hi) 85%,var(--card))', 'color-mix(in srgb,var(--bad) 55%,var(--card))'];
  /* bars: rows [{d, parts:[[count, colourIndex]], label}] each a whole of width W cut into d pieces. Extra wholes wrap to the right. */
  function bars(rows, W, label) {
    W = W || 420;
    var s = '', y = 4, lw = 74, maxW = lw + W + 8;
    rows.forEach(function (r) {
      var total = 0; r.parts.forEach(function (p) { total += p[0]; });
      var wholes = Math.max(1, Math.ceil(total / r.d)), bw = wholes > 1 ? (W - 10 * (wholes - 1)) / wholes : W, cw = bw / r.d, k = 0;
      if (r.label) s += '<text x="' + (lw - 8) + '" y="' + (y + 25) + '" text-anchor="end" font-size="18" class="tb">' + r.label + '</text>';
      var fills = [];
      r.parts.forEach(function (p) { for (var i = 0; i < p[0]; i++) fills.push(p[1]); });
      for (var w = 0; w < wholes; w++) for (var i = 0; i < r.d; i++, k++) {
        var x = lw + w * (bw + 10) + i * cw;
        s += '<rect x="' + x.toFixed(1) + '" y="' + y + '" width="' + cw.toFixed(1) + '" height="36" style="fill:' + (k < fills.length ? (r.cross && k >= fills.length - r.cross ? 'var(--card)' : COLS[fills[k]]) : 'var(--card)') + ';stroke:var(--ink)" stroke-width="' + (r.d > 24 ? 1 : 1.8) + '"/>';
        if (r.cross && k >= fills.length - r.cross && k < fills.length) s += '<path d="M' + (x + 4) + ' ' + (y + 4) + 'l' + (cw - 8) + ' 28M' + (x + cw - 4) + ' ' + (y + 4) + 'l' + (8 - cw) + ' 28" style="stroke:var(--bad)" stroke-width="2.5"/>';
      }
      y += 48;
    });
    return A.svg(maxW, y - 6, s, label || 'Fraction bars');
  }
  /* number line from 0 to max wholes, cut into pieces of size 1/d, with jumps of size a/d */
  function jumps(w, a, d, label) {
    var W = 540, x0 = 20, x1 = 520, n = w * d, s = '', full = Math.floor(n / a), left = n - full * a;
    function X(t) { return x0 + (x1 - x0) * t / n; }
    s += '<line x1="' + x0 + '" y1="80" x2="' + x1 + '" y2="80" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var i = 0; i <= n; i++) s += '<line x1="' + X(i) + '" y1="' + (i % d ? 74 : 68) + '" x2="' + X(i) + '" y2="' + (i % d ? 86 : 92) + '" style="stroke:var(--ink)" stroke-width="' + (i % d ? 1.2 : 2.5) + '"/>' + (i % d ? '' : '<text x="' + X(i) + '" y="114" text-anchor="middle" font-size="20" class="tb">' + i / d + '</text>');
    for (var j = 0; j < full; j++) {
      var xa = X(j * a), xb = X((j + 1) * a);
      s += '<path d="M' + xa + ' 76 Q' + ((xa + xb) / 2) + ' ' + (76 - Math.min(60, (xb - xa) * 0.8 + 12)) + ' ' + xb + ' 76" fill="none" style="stroke:var(--strand)" stroke-width="2.5"/>';
      if (xb - xa > 18) s += '<text x="' + ((xa + xb) / 2) + '" y="' + (76 - Math.min(60, (xb - xa) * 0.8 + 12) / 2 - 6) + '" text-anchor="middle" font-size="17" class="tb" style="fill:var(--strand)">' + (j + 1) + '</text>';
    }
    if (left) { var xl = X(full * a), xr = X(n); s += '<path d="M' + xl + ' 76 Q' + ((xl + xr) / 2) + ' ' + (60) + ' ' + xr + ' 76" fill="none" style="stroke:var(--bad)" stroke-width="2.5" stroke-dasharray="5 4"/>'; }
    return A.svg(W, 122, s, label || 'Jumps of ' + a + '/' + d + ' from 0 to ' + w);
  }
  /* an array of dots split into d equal groups, n groups circled: n/d of total */
  function ofArr(n, d, total) {
    var per = total / d, s = '', u = 26, cols = Math.min(per, 6), rows = Math.ceil(per / cols), gw = cols * u + 14, W = d * (gw + 8);
    for (var g = 0; g < d; g++) {
      var gx = g * (gw + 8) + 4;
      s += '<rect x="' + gx + '" y="4" width="' + gw + '" height="' + (rows * u + 12) + '" rx="8" style="fill:' + (g < n ? 'color-mix(in srgb,var(--strand) 14%,var(--card))' : 'var(--card)') + ';stroke:' + (g < n ? 'var(--strand)' : 'var(--line)') + '" stroke-width="' + (g < n ? 3 : 1.5) + '"/>';
      for (var i = 0; i < per; i++) s += '<circle cx="' + (gx + 7 + u / 2 + (i % cols) * u) + '" cy="' + (10 + u / 2 + Math.floor(i / cols) * u) + '" r="9" style="fill:' + (g < n ? 'var(--strand)' : 'var(--ink2)') + '"/>';
    }
    return A.svg(W, rows * u + 20, s, total + ' dots in ' + d + ' equal groups, ' + n + ' groups circled');
  }

  A.register('fractions', {
    html:
'<section class="sec"><h2><span class="n">1</span>Same size pieces first</h2>' +
'<p>You can only add or compare pieces that are the <b>same size</b>. To make ' + A.fr(1, 2) + ' and ' + A.fr(1, 3) + ' the same size, cut both into sixths: ' + A.fr(1, 2) + ' = ' + A.fr(3, 6) + ' and ' + A.fr(1, 3) + ' = ' + A.fr(2, 6) + '.</p>' +
'<div class="fig">' + bars([{ d: 2, parts: [[1, 0]], label: '1/2' }, { d: 6, parts: [[3, 0]], label: '3/6' }, { d: 3, parts: [[1, 1]], label: '1/3' }, { d: 6, parts: [[2, 1]], label: '2/6' }], 420, 'One half is the same as three sixths. One third is the same as two sixths.') + '</div>' +
'<p>The new bottom number is a <b>common denominator</b>. The easiest one to use is the <b>least common multiple</b> of the two bottoms: the smallest number both divide into.</p>' +
'<div class="key"><b class="t">Key idea</b><p>To make an equivalent fraction, multiply the top and the bottom by the <b>same</b> number. The pieces get smaller, but you get more of them, so the amount stays the same.</p></div>' +
'<div class="lab"><span class="lt">Try it: cut into the same size</span>' +
'<div class="ctrl"><label for="eqa">First<select id="eqa"></select></label><label for="eqb">Second<select id="eqb"></select></label></div>' +
'<div class="fig" id="eqfig"></div><div class="out" id="eqout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Which is greater, ' + A.fr(3, 4) + ' or ' + A.fr(5, 6) + '? Multiples of 4: 4, 8, <b>12</b>. Multiples of 6: 6, <b>12</b>. Use twelfths: ' + A.fr(3, 4) + ' = ' + A.fr(9, 12) + ' and ' + A.fr(5, 6) + ' = ' + A.fr(10, 12) + '. So ' + A.fr(5, 6) + ' is greater.</p></div>' +
A.yt({ q: 'Complete: ' + A.fr(2, 5) + ' = ' + A.fr('?', 15), type: 'num', answer: 6,
  hint: 'Say the rule: whatever you multiply the bottom by, multiply the top by the same. 5 &times; 3 = 15.', explain: '5 &times; 3 = 15, so 2 &times; 3 = 6. ' + A.fr(2, 5) + ' = ' + A.fr(6, 15) + '.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Adding fractions with different denominators</h2>' +
'<p>Three steps, every time:</p><ol><li>Find a common denominator.</li><li>Change each fraction to an equivalent fraction with that denominator.</li><li>Add the tops. Keep the bottom. Simplify if you can.</li></ol>' +
'<div class="eg"><b class="t">Worked example</b><p>' + A.fr(1, 4) + ' + ' + A.fr(2, 3) + '. Common denominator: 12. ' + A.fr(1, 4) + ' = ' + A.fr(3, 12) + ' and ' + A.fr(2, 3) + ' = ' + A.fr(8, 12) + '. So ' + A.fr(3, 12) + ' + ' + A.fr(8, 12) + ' = <b>' + A.fr(11, 12) + '</b>.</p>' +
'<div class="fig">' + bars([{ d: 4, parts: [[1, 0]], label: '1/4' }, { d: 3, parts: [[2, 1]], label: '2/3' }, { d: 12, parts: [[3, 0], [8, 1]], label: '11/12' }], 420, 'One quarter plus two thirds. In twelfths, 3 plus 8 is 11 twelfths.') + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Adding the bottoms. ' + A.fr(1, 2) + ' + ' + A.fr(1, 3) + ' is <b>not</b> ' + A.fr(2, 5) + ': that is less than ' + A.fr(1, 2) + ' on its own! The bottom only names the size of the pieces. The answer is ' + A.fr(5, 6) + '.</p></div>' +
'<div class="lab"><span class="lt">Try it: add or subtract with bars</span>' +
'<div class="ctrl"><label for="asa">First<select id="asa"></select></label><label for="aso">Operation<select id="aso"><option value="1">+ add</option><option value="-1">&minus; subtract</option></select></label><label for="asb">Second<select id="asb"></select></label></div>' +
'<div class="fig" id="asfig"></div><div class="out" id="asout"></div></div>' +
A.yt({ q: A.fr(1, 2) + ' + ' + A.fr(3, 8) + ' = ?', type: 'mc', options: [A.fr(4, 10), A.fr(7, 8), A.fr(4, 8), A.fr(5, 8)], answer: 1,
  hint: 'Say the steps: common denominator first. Eighths work. ' + A.fr(1, 2) + ' = ' + A.fr(4, 8) + '.', explain: A.fr(4, 8) + ' + ' + A.fr(3, 8) + ' = ' + A.fr(7, 8) + '.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Subtracting fractions</h2>' +
'<p>Subtracting uses the same three steps. Make the pieces the same size, then take away.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>' + A.fr(5, 6) + ' &minus; ' + A.fr(1, 4) + '. Common denominator: 12. ' + A.fr(10, 12) + ' &minus; ' + A.fr(3, 12) + ' = <b>' + A.fr(7, 12) + '</b>. The crossed-out pieces are the ones taken away.</p>' +
'<div class="fig">' + bars([{ d: 12, parts: [[10, 0]], cross: 3, label: '10/12' }], 420, 'Ten twelfths with three crossed out, leaving seven twelfths') + '</div></div>' +
'<p>With mixed numbers, you can change them to improper fractions first. 2' + A.fr(1, 3) + ' = ' + A.fr(7, 3) + ', because 2 wholes are 6 thirds, plus 1 more third.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>2' + A.fr(1, 3) + ' &minus; ' + A.fr(1, 2) + ' = ' + A.fr(7, 3) + ' &minus; ' + A.fr(1, 2) + ' = ' + A.fr(14, 6) + ' &minus; ' + A.fr(3, 6) + ' = ' + A.fr(11, 6) + ' = <b>1' + A.fr(5, 6) + '</b>.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Check if your answer makes sense. ' + A.fr(5, 6) + ' &minus; ' + A.fr(1, 4) + ' must be less than ' + A.fr(5, 6) + ' and more than ' + A.fr(1, 2) + '. ' + A.fr(7, 12) + ' fits.</p></div>' +
A.yt({ q: A.fr(3, 4) + ' &minus; ' + A.fr(1, 3) + ' = ?', type: 'mc', options: [A.fr(2, 1), A.fr(5, 12), A.fr(2, 12), A.fr(1, 12)], answer: 1,
  hint: 'Say the steps: twelfths. ' + A.fr(3, 4) + ' = ' + A.fr(9, 12) + ' and ' + A.fr(1, 3) + ' = ' + A.fr(4, 12) + '.', explain: A.fr(9, 12) + ' &minus; ' + A.fr(4, 12) + ' = ' + A.fr(5, 12) + '.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Multiplying a whole number by a fraction</h2>' +
'<p>3 &times; ' + A.fr(2, 5) + ' means 3 groups of ' + A.fr(2, 5) + '. That is ' + A.fr(2, 5) + ' + ' + A.fr(2, 5) + ' + ' + A.fr(2, 5) + ' = ' + A.fr(6, 5) + ' = 1' + A.fr(1, 5) + '.</p>' +
'<div class="fig">' + bars([{ d: 5, parts: [[2, 0], [2, 1], [2, 2]], label: '3 &times; 2/5' }], 420, 'Three groups of two fifths in three colours fill one whole and one fifth more') + '</div>' +
'<p>The word <b>of</b> also means multiply: ' + A.fr(2, 3) + ' of 12 = ' + A.fr(2, 3) + ' &times; 12. Split 12 into 3 equal groups, then take 2 of them.</p>' +
'<div class="fig">' + ofArr(2, 3, 12) + '</div>' +
'<div class="key"><b class="t">Key idea</b><p>Whole number &times; fraction: multiply the whole number by the top, keep the bottom. 3 &times; ' + A.fr(2, 5) + ' = ' + A.fr('3 &times; 2', 5) + ' = ' + A.fr(6, 5) + '. Then simplify.</p></div>' +
'<div class="lab"><span class="lt">Try it: groups of a fraction</span>' +
'<div class="ctrl"><label for="mwn">Whole number<input type="number" id="mwn" min="1" max="12" value="4"></label><label for="mwf">Fraction<select id="mwf"></select></label></div>' +
'<div class="fig" id="mwfig"></div><div class="out" id="mwout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Multiplying the bottom too. 4 &times; ' + A.fr(1, 3) + ' is ' + A.fr(4, 3) + ', not ' + A.fr(4, 12) + '. You have 4 pieces, and each piece is still a third.</p></div>' +
A.yt({ q: 'What is ' + A.fr(3, 4) + ' of 20?', type: 'num', answer: 15,
  hint: 'Say the steps: split 20 into 4 equal groups, then take 3 groups.', explain: '20 &divide; 4 = 5 in each group. 3 groups: 3 &times; 5 = 15.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Dividing a whole number by a fraction</h2>' +
'<p>3 &divide; ' + A.fr(1, 4) + ' asks: <b>how many quarters fit in 3?</b> Each whole holds 4 quarters, so 3 wholes hold 12. The answer is bigger than 3, because the pieces are small.</p>' +
'<div class="fig">' + jumps(3, 1, 4, 'Number line from 0 to 3 with 12 jumps of one quarter') + '</div>' +
'<p>For a fraction like ' + A.fr(2, 3) + ', count jumps of 2 thirds. 2 &divide; ' + A.fr(2, 3) + ': there are 6 thirds in 2, and 6 &divide; 2 = 3 jumps.</p>' +
'<div class="lab"><span class="lt">Try it: how many fit?</span>' +
'<div class="ctrl"><label for="dvw">Whole number<input type="number" id="dvw" min="1" max="6" value="2"></label><label for="dvf">Divide by<select id="dvf"></select></label></div>' +
'<div class="fig" id="dvfig"></div><div class="out" id="dvout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Whole &divide; fraction: change the whole into pieces of that size, then count how many groups fit. 2 &divide; ' + A.fr(2, 5) + ': 2 = ' + A.fr(10, 5) + ', and 10 fifths make 5 groups of 2 fifths.</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A ribbon is 3 m long. How many ' + A.fr(3, 4) + ' m pieces can you cut? 3 m = ' + A.fr(12, 4) + ' m. 12 quarters &divide; 3 quarters = <b>4 pieces</b>.</p></div>' +
A.yt({ q: '4 &divide; ' + A.fr(1, 3) + ' = ?', type: 'num', answer: 12,
  hint: 'Say the question: how many thirds fit in 4? Each whole has 3 thirds.', explain: '4 wholes &times; 3 thirds each = 12 thirds. So 4 &divide; ' + A.fr(1, 3) + ' = 12.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      var LIST = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 6], [5, 6], [1, 8], [3, 8], [5, 8], [7, 10], [5, 12]];
      function fill(sel, def) { sel.innerHTML = LIST.map(function (f, i) { return '<option value="' + i + '"' + (i === def ? ' selected' : '') + '>' + f[0] + '/' + f[1] + '</option>'; }).join(''); }
      fill($('#eqa', root), 4); fill($('#eqb', root), 9);
      fill($('#asa', root), 2); fill($('#asb', root), 3);
      function eq() {
        var a = LIST[+$('#eqa', root).value], b = LIST[+$('#eqb', root).value], L = lcm(a[1], b[1]), na = a[0] * L / a[1], nb = b[0] * L / b[1];
        $('#eqfig', root).innerHTML = bars([{ d: a[1], parts: [[a[0], 0]], label: a[0] + '/' + a[1] }, { d: L, parts: [[na, 0]], label: na + '/' + L }, { d: b[1], parts: [[b[0], 1]], label: b[0] + '/' + b[1] }, { d: L, parts: [[nb, 1]], label: nb + '/' + L }], 420);
        var sym = na > nb ? '&gt;' : na < nb ? '&lt;' : '=';
        $('#eqout', root).innerHTML = '<p>Least common multiple of ' + a[1] + ' and ' + b[1] + ': <b>' + L + '</b>.</p><p>' + A.fr(a[0], a[1]) + ' = ' + A.fr(na, L) + ' (&times; ' + L / a[1] + ') and ' + A.fr(b[0], b[1]) + ' = ' + A.fr(nb, L) + ' (&times; ' + L / b[1] + ')</p><p><span class="big">' + A.fr(a[0], a[1]) + ' ' + sym + ' ' + A.fr(b[0], b[1]) + '</span></p>';
      }
      A.bind(root, ['eqa', 'eqb'], eq);
      function as() {
        var a = LIST[+$('#asa', root).value], b = LIST[+$('#asb', root).value], op = +$('#aso', root).value, L = lcm(a[1], b[1]), na = a[0] * L / a[1], nb = b[0] * L / b[1], r = na + op * nb, h;
        if (op > 0) h = bars([{ d: a[1], parts: [[a[0], 0]], label: a[0] + '/' + a[1] }, { d: b[1], parts: [[b[0], 1]], label: b[0] + '/' + b[1] }, { d: L, parts: [[na, 0], [nb, 1]], label: 'total' }], 420);
        else if (r >= 0) h = bars([{ d: a[1], parts: [[a[0], 0]], label: a[0] + '/' + a[1] }, { d: b[1], parts: [[b[0], 1]], label: b[0] + '/' + b[1] }, { d: L, parts: [[na, 0]], cross: nb, label: 'left' }], 420);
        else h = '';
        $('#asfig', root).innerHTML = h;
        $('#asout', root).innerHTML = r < 0 ? '<p>' + A.fr(a[0], a[1]) + ' is smaller than ' + A.fr(b[0], b[1]) + ', so you cannot take it away here. Swap them.</p>' :
          '<p>Common denominator: <b>' + L + '</b>.</p><p><span class="big">' + A.fr(na, L) + ' ' + (op > 0 ? '+' : '&minus;') + ' ' + A.fr(nb, L) + ' = ' + A.fr(r, L) + (gcd(r, L) > 1 || r > L ? ' = ' + F(r, L) : '') + '</span></p>' + (gcd(r, L) > 1 && r ? '<p class="t2">Simplified by dividing top and bottom by ' + gcd(r, L) + '.</p>' : '');
      }
      A.bind(root, ['asa', 'asb', 'aso'], as);
      var MF = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [5, 6], [3, 8]];
      $('#mwf', root).innerHTML = MF.map(function (f, i) { return '<option value="' + i + '"' + (i === 2 ? ' selected' : '') + '>' + f[0] + '/' + f[1] + '</option>'; }).join('');
      function mw() {
        var n = Math.max(1, Math.min(12, parseInt($('#mwn', root).value, 10) || 1)), f = MF[+$('#mwf', root).value], parts = [];
        for (var i = 0; i < n; i++) parts.push([f[0], i % 3]);
        $('#mwfig', root).innerHTML = bars([{ d: f[1], parts: parts, label: n + ' &times; ' + f[0] + '/' + f[1] }], 440, n + ' groups of ' + f[0] + '/' + f[1]);
        $('#mwout', root).innerHTML = '<p><span class="big">' + n + ' &times; ' + A.fr(f[0], f[1]) + ' = ' + A.fr(n * f[0], f[1]) + (gcd(n * f[0], f[1]) > 1 || n * f[0] >= f[1] ? ' = ' + F(n * f[0], f[1]) : '') + '</span></p><p>' + n + ' groups, each with ' + f[0] + ' piece' + (f[0] > 1 ? 's' : '') + ' of size ' + A.fr(1, f[1]) + ': ' + n * f[0] + ' pieces in all. The colours show each group.</p>' +
          (f[1] <= 6 && (n * f[1]) <= 36 ? '<p>Also: ' + A.fr(f[0], f[1]) + ' of ' + n * f[1] + ' = ' + n * f[0] + ' (split ' + n * f[1] + ' into ' + f[1] + ' groups, take ' + f[0] + ').</p>' : '');
      }
      A.bind(root, ['mwn', 'mwf'], mw);
      var DF = [[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [3, 4], [2, 5], [3, 5]];
      $('#dvf', root).innerHTML = DF.map(function (f, i) { return '<option value="' + i + '"' + (i === 4 ? ' selected' : '') + '>' + f[0] + '/' + f[1] + '</option>'; }).join('');
      function dv() {
        var w = Math.max(1, Math.min(6, parseInt($('#dvw', root).value, 10) || 1)), f = DF[+$('#dvf', root).value], pieces = w * f[1], full = Math.floor(pieces / f[0]), left = pieces % f[0];
        $('#dvfig', root).innerHTML = jumps(w, f[0], f[1]);
        $('#dvout', root).innerHTML = '<p><span class="big">' + w + ' &divide; ' + A.fr(f[0], f[1]) + ' = ' + F(pieces, f[0]) + '</span></p><p>' + w + ' = ' + A.fr(pieces, f[1]) + '. Jumps of ' + f[0] + ' piece' + (f[0] > 1 ? 's' : '') + ': ' + full + ' full jump' + (full === 1 ? '' : 's') +
          (left ? ', and ' + left + ' piece' + (left > 1 ? 's' : '') + ' left over, which is ' + A.fr(left, f[0]) + ' of a jump (dashed).' : '.') + '</p>';
      }
      A.bind(root, ['dvw', 'dvf'], dv);
    },

    quiz: [
      { q: 'Which fraction is equal to ' + A.fr(3, 4) + '?', type: 'mc', options: [A.fr(6, 12), A.fr(9, 12), A.fr(4, 5), A.fr(6, 7)], answer: 1,
        hint: 'Multiply the top and bottom by the same number.', explain: '3 &times; 3 = 9 and 4 &times; 3 = 12, so ' + A.fr(3, 4) + ' = ' + A.fr(9, 12) + '.' },
      { q: A.fr(2, 3) + ' + ' + A.fr(1, 6) + ' = ?', type: 'mc', options: [A.fr(3, 9), A.fr(5, 6), A.fr(3, 6), A.fr(1, 2)], answer: 1, fig: bars([{ d: 3, parts: [[2, 0]], label: '2/3' }, { d: 6, parts: [[1, 1]], label: '1/6' }], 420),
        hint: 'Change ' + A.fr(2, 3) + ' to sixths first.', explain: A.fr(2, 3) + ' = ' + A.fr(4, 6) + '. ' + A.fr(4, 6) + ' + ' + A.fr(1, 6) + ' = ' + A.fr(5, 6) + '.' },
      { q: A.fr(7, 8) + ' &minus; ' + A.fr(1, 2) + ' = ?', type: 'mc', options: [A.fr(6, 6), A.fr(3, 8), A.fr(6, 8), A.fr(1, 4)], answer: 1,
        hint: A.fr(1, 2) + ' is how many eighths?', explain: A.fr(1, 2) + ' = ' + A.fr(4, 8) + '. ' + A.fr(7, 8) + ' &minus; ' + A.fr(4, 8) + ' = ' + A.fr(3, 8) + '.' },
      { q: 'Maya ran ' + A.fr(3, 4) + ' km in the morning and ' + A.fr(2, 3) + ' km after school. How far did she run in all?', type: 'mc', options: ['1 ' + A.fr(5, 12), A.fr(5, 7), '1 ' + A.fr(1, 12), A.fr(17, 24)], answer: 0,
        hint: 'Use twelfths: ' + A.fr(3, 4) + ' = ' + A.fr(9, 12) + ' and ' + A.fr(2, 3) + ' = ' + A.fr(8, 12) + '.', explain: A.fr(9, 12) + ' + ' + A.fr(8, 12) + ' = ' + A.fr(17, 12) + ' = 1' + A.fr(5, 12) + ' km.' },
      { q: '5 &times; ' + A.fr(2, 3) + ' = ?', type: 'mc', options: [A.fr(10, 15), '3 ' + A.fr(1, 3), A.fr(7, 3), '1 ' + A.fr(2, 3)], answer: 1, fig: bars([{ d: 3, parts: [[2, 0], [2, 1], [2, 2], [2, 0], [2, 1]] }], 440),
        hint: 'Multiply the whole number by the top. Keep the bottom.', explain: '5 &times; 2 = 10, so ' + A.fr(10, 3) + ' = 3' + A.fr(1, 3) + '.' },
      { q: 'What is ' + A.fr(2, 5) + ' of 30?', type: 'num', answer: 12, fig: ofArr(2, 5, 30),
        hint: 'Split 30 into 5 equal groups. How many in 2 groups?', explain: '30 &divide; 5 = 6. Two groups: 2 &times; 6 = 12.' },
      { q: 'How many ' + A.fr(3, 4) + ' cup scoops are in 6 cups of flour? (6 &divide; ' + A.fr(3, 4) + ')', type: 'num', answer: 8, fig: jumps(6, 3, 4),
        hint: '6 cups is how many quarter cups? Then group them in threes.', explain: '6 cups = 24 quarter cups. 24 &divide; 3 = 8 scoops.' }
    ],

    practice: [
      { id: 'fr-equiv', name: 'Equivalent fractions', code: 'B1.3', gen: function (lv) {
        var base = R.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [5, 6], [3, 8], [4, 7]]), m = R.int(2, lv === 1 ? 4 : 9);
        if (lv < 3) {
          var askTop = lv === 1 || R.int(0, 1);
          return { q: 'Complete: ' + A.fr(base[0], base[1]) + ' = ' + (askTop ? A.fr('?', base[1] * m) : A.fr(base[0] * m, '?')), type: 'num', answer: askTop ? base[0] * m : base[1] * m, v: { a: base, m: m, top: askTop },
            fig: lv === 1 ? bars([{ d: base[1], parts: [[base[0], 0]] }, { d: base[1] * m, parts: [[base[0] * m, 0]] }], 400) : '',
            hint: askTop ? 'What do you multiply ' + base[1] + ' by to get ' + base[1] * m + '? Do the same to the top.' : 'What do you multiply ' + base[0] + ' by to get ' + base[0] * m + '? Do the same to the bottom.',
            steps: [(askTop ? base[1] + ' &times; ' + m + ' = ' + base[1] * m : base[0] + ' &times; ' + m + ' = ' + base[0] * m) + '.', 'Multiply the other number by ' + m + ' too.', 'So ' + A.fr(base[0], base[1]) + ' = ' + A.fr(base[0] * m, base[1] * m) + '.'],
            explain: A.fr(base[0], base[1]) + ' = ' + A.fr(base[0] * m, base[1] * m) + ' (top and bottom &times; ' + m + ').' };
        }
        var a = R.pick([[2, 3], [3, 4], [5, 6], [3, 5], [4, 5], [5, 8], [7, 10], [2, 7]]), b = R.pick([[3, 4], [4, 5], [5, 6], [7, 9], [5, 7], [7, 8], [2, 3], [3, 10]]);
        while (a[0] * b[1] === b[0] * a[1]) b = R.pick([[3, 4], [4, 5], [7, 9], [5, 7], [7, 8]]);
        var L = lcm(a[1], b[1]), na = a[0] * L / a[1], nb = b[0] * L / b[1], big = na > nb ? a : b;
        var o = R.mc(A.fr(big[0], big[1]), [A.fr(big === a ? b[0] : a[0], big === a ? b[1] : a[1]), 'They are equal']);
        return { q: 'Which is greater: ' + A.fr(a[0], a[1]) + ' or ' + A.fr(b[0], b[1]) + '?', type: 'mc', options: o.options, answer: o.answer, v: { a: a, b: b },
          hint: 'Use a common denominator of ' + L + '.', steps: ['A common denominator is ' + L + '.', A.fr(a[0], a[1]) + ' = ' + A.fr(na, L) + ' and ' + A.fr(b[0], b[1]) + ' = ' + A.fr(nb, L) + '.<div class="fig">' + bars([{ d: L, parts: [[na, 0]] }, { d: L, parts: [[nb, 1]] }], 400) + '</div>', 'Compare the tops: ' + Math.max(na, nb) + ' is more, so ' + A.fr(big[0], big[1]) + ' is greater.'],
          explain: A.fr(na, L) + ' and ' + A.fr(nb, L) + ': ' + A.fr(big[0], big[1]) + ' is greater.' };
      } },
      { id: 'fr-add', name: 'Add fractions', code: 'B2.5', gen: function (lv) {
        var a, b;
        if (lv === 1) { var d = R.pick([3, 4, 5]), k = R.pick([2, 3]); a = [R.int(1, d - 1), d]; b = [R.int(1, d * k - 1), d * k]; }
        else if (lv === 2) { a = R.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]]); b = R.pick([[1, 3], [1, 4], [1, 5], [2, 5], [1, 6], [3, 10]]); if (a[1] === b[1]) b = [1, 7]; }
        else { a = R.pick([[3, 4], [5, 6], [2, 3], [4, 5], [7, 8], [5, 12]]); b = R.pick([[2, 3], [3, 4], [5, 8], [3, 10], [1, 6], [4, 9]]); if (a[1] === b[1]) b = [1, 5]; }
        var L = lcm(a[1], b[1]), na = a[0] * L / a[1], nb = b[0] * L / b[1], r = [na + nb, L];
        var o = mcF(r, [[a[0] + b[0], a[1] + b[1]], [a[0] + b[0], L], [na + nb, L * 2], [na + nb + 1, L], [Math.max(1, na + nb - 1), L]]);
        return { q: A.fr(a[0], a[1]) + ' + ' + A.fr(b[0], b[1]) + ' = ?', type: 'mc', options: o.options, answer: o.answer, v: { a: a, b: b, op: 1 },
          fig: lv < 3 ? bars([{ d: a[1], parts: [[a[0], 0]] }, { d: b[1], parts: [[b[0], 1]] }], 400) : '',
          hint: 'Find a common denominator first. Do not add the bottoms.',
          steps: ['A common denominator is ' + L + '.', A.fr(a[0], a[1]) + ' = ' + A.fr(na, L) + ' and ' + A.fr(b[0], b[1]) + ' = ' + A.fr(nb, L) + '.', 'Add the tops: ' + na + ' + ' + nb + ' = ' + (na + nb) + '. ' + A.fr(na + nb, L) + (gcd(na + nb, L) > 1 || na + nb > L ? ' = ' + F(na + nb, L) : '') + '.<div class="fig">' + bars([{ d: L, parts: [[na, 0], [nb, 1]] }], 400) + '</div>'],
          explain: A.fr(na, L) + ' + ' + A.fr(nb, L) + ' = ' + A.fr(na + nb, L) + (gcd(na + nb, L) > 1 || na + nb > L ? ' = ' + F(na + nb, L) : '') + '.' };
      } },
      { id: 'fr-sub', name: 'Subtract fractions', code: 'B2.5', gen: function (lv) {
        var a, b, L, na, nb, tries = 0;
        do {
          if (lv === 1) { var d = R.pick([3, 4, 5]), k = R.pick([2, 3]); a = [R.int(1, d - 1), d]; b = [R.int(1, d * k - 1), d * k]; }
          else if (lv === 2) { a = R.pick([[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [7, 8]]); b = R.pick([[1, 3], [1, 4], [1, 5], [1, 6], [2, 5], [3, 10]]); }
          else { var w = R.int(1, 3); a = [w * 6 + R.pick([1, 5]), 6]; a = R.pick([[w * 4 + 1, 4], [w * 3 + 1, 3], [w * 6 + 1, 6], [w * 5 + 2, 5]]); b = R.pick([[1, 2], [3, 4], [2, 3], [5, 6]]); }
          L = lcm(a[1], b[1]); na = a[0] * L / a[1]; nb = b[0] * L / b[1]; tries++;
        } while ((na <= nb || a[1] === b[1]) && tries < 50);
        if (na <= nb) { a = [3, 4]; b = [1, 3]; L = 12; na = 9; nb = 4; }
        var r = [na - nb, L], aTxt = a[0] > a[1] ? F(a[0], a[1]) : A.fr(a[0], a[1]);
        var o = mcF(r, [[Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]) || 1], [na + nb, L], [na - nb + 1, L], [Math.max(1, na - nb - 1), L], [Math.abs(a[0] - b[0]) || 1, L]]);
        return { q: aTxt + ' &minus; ' + A.fr(b[0], b[1]) + ' = ?', type: 'mc', options: o.options, answer: o.answer, v: { a: a, b: b, op: -1 },
          fig: lv === 1 ? bars([{ d: L, parts: [[na, 0]], cross: nb }], 400) : '',
          hint: lv === 3 ? 'Change the mixed number to an improper fraction, then find a common denominator.' : 'Make the pieces the same size first: use ' + L + 'ths.',
          steps: [(lv === 3 ? aTxt + ' = ' + A.fr(a[0], a[1]) + '. ' : '') + 'A common denominator is ' + L + '.', A.fr(a[0], a[1]) + ' = ' + A.fr(na, L) + ' and ' + A.fr(b[0], b[1]) + ' = ' + A.fr(nb, L) + '.', 'Subtract the tops: ' + na + ' &minus; ' + nb + ' = ' + (na - nb) + '. The answer is ' + F(na - nb, L) + '.'],
          explain: A.fr(na, L) + ' &minus; ' + A.fr(nb, L) + ' = ' + A.fr(na - nb, L) + (gcd(na - nb, L) > 1 || na - nb > L ? ' = ' + F(na - nb, L) : '') + '.' };
      } },
      { id: 'fr-mult', name: 'Whole number times a fraction', code: 'B2.9', gen: function (lv) {
        if (lv === 2) {
          var d = R.pick([2, 3, 4, 5, 6, 8, 10]), n = R.int(1, d - 1); while (gcd(n, d) > 1) n = R.int(1, d - 1);
          var tot = d * R.int(2, d <= 5 ? 6 : 4), ctx = R.pick(['students in a class walk to school', 'of the pages are pictures', 'of the marbles are blue', 'of the songs are Canadian']);
          return { q: 'What is ' + A.fr(n, d) + ' of ' + tot + '?', type: 'num', answer: n * tot / d, fig: tot <= 40 ? ofArr(n, d, tot) : '', v: { n: n, d: d, w: tot },
            hint: 'Split ' + tot + ' into ' + d + ' equal groups. Then take ' + n + ' of them.',
            steps: [tot + ' &divide; ' + d + ' = ' + tot / d + ' in each group.', 'Take ' + n + ' group' + (n > 1 ? 's' : '') + ': ' + n + ' &times; ' + tot / d + '.', 'The answer is ' + n * tot / d + '.'],
            explain: A.fr(n, d) + ' of ' + tot + ' = ' + n + ' &times; ' + tot / d + ' = ' + n * tot / d + '.' };
        }
        var f = R.pick(lv === 1 ? [[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [2, 5]] : [[3, 5], [5, 6], [3, 8], [5, 8], [7, 10], [4, 9], [2, 7]]), w = R.int(2, lv === 1 ? 5 : 9), r = [w * f[0], f[1]];
        var o = mcF(r, [[w * f[0], w * f[1]], [w + f[0], f[1]], [f[0], w * f[1]], [w * f[0] + f[1], f[1]], [w * f[0] - 1, f[1]]]);
        var parts = []; for (var i = 0; i < w; i++) parts.push([f[0], i % 3]);
        return { q: w + ' &times; ' + A.fr(f[0], f[1]) + ' = ?', type: 'mc', options: o.options, answer: o.answer, v: { w: w, f: f },
          fig: lv === 1 ? bars([{ d: f[1], parts: parts }], 440) : '',
          hint: 'Multiply the whole number by the top. The bottom stays ' + f[1] + '.',
          steps: [w + ' groups of ' + A.fr(f[0], f[1]) + '.', w + ' &times; ' + f[0] + ' = ' + w * f[0] + ', so it is ' + A.fr(w * f[0], f[1]) + '.', 'Simplify: ' + F(w * f[0], f[1]) + '.'],
          explain: w + ' &times; ' + A.fr(f[0], f[1]) + ' = ' + A.fr(w * f[0], f[1]) + (gcd(w * f[0], f[1]) > 1 || w * f[0] > f[1] ? ' = ' + F(w * f[0], f[1]) : '') + '.' };
      } },
      { id: 'fr-div', name: 'Whole number divided by a fraction', code: 'B2.10', gen: function (lv) {
        var f = lv === 1 ? [1, R.pick([2, 3, 4, 5, 6, 8])] : lv === 2 ? R.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5]]) : R.pick([[2, 3], [3, 4], [2, 5], [3, 8], [5, 6]]);
        var w = R.int(lv === 1 ? 2 : 1, lv === 1 ? 6 : 6);
        if (lv === 2) while ((w * f[1]) % f[0]) w++;
        var pieces = w * f[1], r = [pieces, f[0]];
        var ctx = lv === 3 ? R.pick(['A rope is ' + w + ' m long. How many pieces ' + f[0] + '/' + f[1] + ' m long can you cut? Count part of a piece too.', 'You have ' + w + ' L of juice. How many ' + f[0] + '/' + f[1] + ' L glasses can you fill? Count part of a glass too.']) : '';
        var q = ctx ? ctx.replace(f[0] + '/' + f[1], A.fr(f[0], f[1])) + ' <span class="math">(' + w + ' &divide; ' + A.fr(f[0], f[1]) + ')</span>' : w + ' &divide; ' + A.fr(f[0], f[1]) + ' = ?';
        var steps = ['Change ' + w + ' into ' + f[1] + 'ths: ' + w + ' = ' + A.fr(pieces, f[1]) + '.', 'Count groups of ' + f[0] + ': ' + pieces + ' &divide; ' + f[0] + ' = ' + F(pieces, f[0]) + '.<div class="fig">' + jumps(w, f[0], f[1]) + '</div>', 'So ' + w + ' &divide; ' + A.fr(f[0], f[1]) + ' = ' + F(pieces, f[0]) + '.'];
        if (pieces % f[0] === 0) return { q: q, type: 'num', answer: pieces / f[0], fig: lv < 3 ? jumps(w, f[0], f[1]) : '', v: { w: w, f: f },
          hint: 'How many ' + f[1] + 'ths are in ' + w + '? Then count groups of ' + f[0] + '.', steps: steps, explain: w + ' = ' + A.fr(pieces, f[1]) + ', and ' + pieces + ' &divide; ' + f[0] + ' = ' + pieces / f[0] + '.' };
        var o = mcF(r, [[w * f[0], f[1]], [Math.floor(pieces / f[0]), 1], [pieces + 1, f[0]], [w, f[0] * f[1]], [pieces, f[0] + 1]]);
        return { q: q, type: 'mc', options: o.options, answer: o.answer, fig: jumps(w, f[0], f[1]), v: { w: w, f: f },
          hint: 'Count the full jumps, then the leftover part of a jump.', steps: steps, explain: w + ' = ' + A.fr(pieces, f[1]) + '. ' + pieces + ' &divide; ' + f[0] + ' = ' + F(pieces, f[0]) + '.' };
      } }
    ]
  });
})();
