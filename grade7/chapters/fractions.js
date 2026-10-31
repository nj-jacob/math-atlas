(function () {
  var A = Atlas, R = A.R, fr = A.fr, frs = A.frs, gcd = A.gcd;
  function lcm(a, b) { return a / gcd(a, b) * b; }
  var COL = ['var(--sb)', 'var(--se)', 'var(--sd)', 'var(--sc)'];

  /* a bar d parts long with n shaded. Bars wider than one whole wrap into several wholes. */
  function bar(n, d, o) {
    o = o || {};
    var W = o.w || 420, col = o.col || 'var(--strand)', wholes = Math.max(1, Math.ceil(n / d)), bw = Math.min(W, (540 - 10 * (wholes - 1)) / wholes), cw = bw / d, s = '';
    for (var k = 0; k < wholes; k++) for (var i = 0; i < d; i++) {
      var idx = k * d + i, x = 2 + k * (bw + 10) + i * cw;
      s += '<rect x="' + x.toFixed(1) + '" y="2" width="' + cw.toFixed(1) + '" height="38" style="fill:' + (idx < n ? col : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
    }
    if (o.lab) s += '<text x="' + (wholes * (bw + 10)) + '" y="28" font-size="19" font-weight="700">' + o.lab + '</text>';
    return A.svg(Math.ceil(wholes * (bw + 10) + (o.lab ? 70 : 0)), 44, s, o.alt || n + ' of ' + d + ' equal parts shaded');
  }
  /* several fraction bars stacked to the same length, labelled on the left */
  function stack(list, alt) {
    var W = 400, s = '', y = 4;
    list.forEach(function (f, r) {
      var cw = W / f[1];
      s += '<text x="0" y="' + (y + 27) + '" font-size="19" font-weight="700">' + f[0] + '/' + f[1] + '</text>';
      for (var i = 0; i < f[1]; i++) s += '<rect x="' + (64 + i * cw).toFixed(1) + '" y="' + y + '" width="' + cw.toFixed(1) + '" height="36" style="fill:' + (i < f[0] ? (f[2] || COL[r % 4]) : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
      y += 46;
    });
    var end = list[0][0] / list[0][1];
    if (list.every(function (f) { return Math.abs(f[0] / f[1] - end) < 1e-9; }))
      s += '<line x1="' + (64 + W * end) + '" y1="0" x2="' + (64 + W * end) + '" y2="' + y + '" style="stroke:var(--se)" stroke-width="3" stroke-dasharray="6 4"/>';
    return A.svg(W + 70, y, s, alt || list.map(function (f) { return f[0] + '/' + f[1]; }).join(', '));
  }
  /* a number line from a to b with ticks every 1/d, labels as fractions, and marked points [{v, lab, col}] */
  function fline(a, b, d, marks, alt, every) {
    var W = 540, x0 = 26, x1 = W - 26, n = Math.round((b - a) * d), s = '', sc = function (v) { return x0 + (x1 - x0) * (v - a) / (b - a); };
    every = every || 1;
    s += '<line x1="' + x0 + '" y1="54" x2="' + x1 + '" y2="54" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i <= n; i++) {
      var v = a + i / d, x = sc(v), whole = Math.abs(v - Math.round(v)) < 1e-9;
      s += '<line x1="' + x + '" y1="' + (whole ? 42 : 46) + '" x2="' + x + '" y2="' + (whole ? 66 : 62) + '" style="stroke:var(--ink)" stroke-width="' + (whole ? 2.5 : 1.5) + '"/>';
      if (whole) s += '<text x="' + x + '" y="88" text-anchor="middle" font-size="19" font-weight="700">' + Math.round(v) + '</text>';
      else if (i % every === 0 && (x1 - x0) / n >= 36) s += '<text x="' + x + '" y="86" text-anchor="middle" font-size="17" class="t2">' + Math.round((v - Math.floor(v)) * d + Math.floor(v) * d) + '/' + d + '</text>';
    }
    var close = marks && marks.length > 1 && Math.abs(sc(marks[0].v) - sc(marks[1].v)) < 56;
    (marks || []).forEach(function (m, k) {
      var x = sc(m.v), lx = Math.min(Math.max(x, 30), W - 30);
      if (close) lx += (k ? 1 : -1) * 26 * (sc(marks[1].v) >= sc(marks[0].v) ? 1 : -1);
      s += '<circle cx="' + x + '" cy="54" r="8" style="fill:' + (m.col || 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/>';
      if (m.lab) s += '<text x="' + lx + '" y="28" text-anchor="middle" font-size="18" font-weight="700" style="fill:' + (m.col || 'var(--ink)') + '">' + m.lab + '</text>';
    });
    return A.svg(W, 96, s, alt || 'Number line from ' + a + ' to ' + b);
  }
  function simp(n, d) { var g = gcd(n, d); return [n / g, d / g]; }
  function plain(n, d) { return frs(n, d, true); }
  function txt(n, d) { return n + '/' + d; }

  /* addition picture: both fractions cut into the common denominator, then joined */
  function addPic(a, b, c, d, minus) {
    var L = lcm(b, d), A1 = a * L / b, C1 = c * L / d, res = minus ? A1 - C1 : A1 + C1;
    var rows = [[a, b, 'var(--sb)'], [A1, L, 'var(--sb)'], [c, d, 'var(--se)'], [C1, L, 'var(--se)']];
    var W = Math.max(1, Math.ceil(Math.max(a / b, c / d, res / L))) > 1 ? 240 : 360, s = '', y = 4;
    var labs = [a + '/' + b, '= ' + A1 + '/' + L, c + '/' + d, '= ' + C1 + '/' + L];
    rows.forEach(function (r, k) {
      var wholes = Math.max(1, Math.ceil(r[0] / r[1])), cw = W / r[1];
      s += '<text x="0" y="' + (y + 24) + '" font-size="18" font-weight="700">' + labs[k] + '</text>';
      for (var w = 0; w < wholes; w++) for (var i = 0; i < r[1]; i++) {
        var idx = w * r[1] + i;
        s += '<rect x="' + (80 + w * (W + 10) + i * cw).toFixed(1) + '" y="' + y + '" width="' + cw.toFixed(1) + '" height="32" style="fill:' + (idx < r[0] ? r[2] : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.2"' + (k % 2 === 0 ? ' opacity=".55"' : '') + '/>';
      }
      y += k % 2 ? 50 : 40;
    });
    var wh = Math.max(1, Math.ceil(res / L)), cw2 = W / L;
    s += '<text x="0" y="' + (y + 24) + '" font-size="18" font-weight="700">' + (minus ? 'Left' : 'Total') + '</text>';
    for (var w2 = 0; w2 < wh; w2++) for (var j = 0; j < L; j++) {
      var id2 = w2 * L + j, colr = minus ? 'var(--sb)' : (id2 < A1 ? 'var(--sb)' : 'var(--se)');
      s += '<rect x="' + (80 + w2 * (W + 10) + j * cw2).toFixed(1) + '" y="' + y + '" width="' + cw2.toFixed(1) + '" height="34" style="fill:' + (id2 < res ? colr : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.2"/>';
    }
    y += 40;
    var maxW = 80 + Math.max(Math.ceil(Math.max(a / b, c / d, res / L, 1)), 1) * (W + 10);
    return A.svg(Math.ceil(maxW), y, s, a + '/' + b + (minus ? ' minus ' : ' plus ') + c + '/' + d + '. Both are cut into ' + L + 'ths: ' + A1 + '/' + L + (minus ? ' minus ' : ' plus ') + C1 + '/' + L + ' = ' + res + '/' + L + '.');
  }
  /* zoom in on the gap between two fractions */
  function zoom(a, b, c, d) {
    var L = lcm(b, d), k = 1;
    while (Math.abs(c * L / d - a * L / b) * k < 2) k++;
    var D = L * k, lo = a * D / b, hi = c * D / d, s = '', W = 540;
    s += fline(0, 1, D > 24 ? 1 : D, [{ v: a / b, lab: a + '/' + b, col: 'var(--sb)' }, { v: c / d, lab: c + '/' + d, col: 'var(--se)' }], '', D > 24 ? 1 : 1).replace(/^<svg[^>]*>|<\/svg>$/g, '');
    var x0 = 26 + 488 * a / b, x1 = 26 + 488 * c / d;
    s += '<path d="M' + x0 + ' 62 L60 128 M' + x1 + ' 62 L' + (W - 60) + ' 128" style="stroke:var(--ink2)" stroke-dasharray="4 4" fill="none"/>';
    var n = hi - lo, sc = function (i) { return 60 + (W - 120) * i / n; }, inner = '';
    inner += '<line x1="60" y1="150" x2="' + (W - 60) + '" y2="150" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var i = 0; i <= n; i++) {
      var end = i === 0 || i === n;
      inner += '<line x1="' + sc(i) + '" y1="140" x2="' + sc(i) + '" y2="160" style="stroke:var(--ink)" stroke-width="2"/>';
      inner += '<text x="' + sc(i) + '" y="184" text-anchor="middle" font-size="17" font-weight="700" style="fill:' + (end ? (i ? 'var(--se)' : 'var(--sb)') : 'var(--se)') + '">' + (lo + i) + '/' + D + '</text>';
      if (!end) inner += '<circle cx="' + sc(i) + '" cy="150" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    }
    s += inner;
    return { svg: A.svg(W, 196, s, 'Zoom in between ' + a + '/' + b + ' and ' + c + '/' + d + '. Written as ' + lo + '/' + D + ' and ' + hi + '/' + D + ', the fractions in between are ' + Array.apply(null, Array(n - 1)).map(function (_, i) { return (lo + i + 1) + '/' + D; }).join(', ') + '.'), lo: lo, hi: hi, D: D };
  }

  A.register('fractions', {
    html:
'<section class="sec"><h2><span class="n">1</span>Equivalent fractions</h2>' +
'<p><b>Equivalent fractions</b> name the same amount. Cut every piece into the same number of smaller pieces, and the shaded amount does not change.</p>' +
'<div class="fig">' + stack([[2, 3], [4, 6], [8, 12]], '2/3, 4/6 and 8/12 shade the same length of bar') + '</div>' +
'<div class="key"><b class="t">Key idea</b><p>Multiply or divide the top <b>and</b> the bottom by the same number. ' + fr(2, 3) + ' = ' + fr('2 &times; 4', '3 &times; 4') + ' = ' + fr(8, 12) + '.</p></div>' +
'<div class="lab"><span class="lt">Try it: cut the pieces smaller</span>' +
'<div class="ctrl"><label for="eqn">Top (numerator): <output id="eqno"></output><input type="range" id="eqn" min="1" max="9" value="3"></label>' +
'<label for="eqd">Bottom (denominator): <output id="eqdo"></output><input type="range" id="eqd" min="2" max="10" value="4"></label>' +
'<label for="eqk">Cut each piece into: <output id="eqko"></output><input type="range" id="eqk" min="1" max="5" value="2"></label></div>' +
'<div class="fig" id="eqfig"></div><div class="out" id="eqout"></div></div>' +
A.yt({ q: 'Fill in the missing number: ' + fr(3, 5) + ' = ' + fr('?', 20), answer: 12, hint: '5 times what is 20? Do the same to the top.', explain: '5 &times; 4 = 20, so 3 &times; 4 = 12. ' + fr(3, 5) + ' = ' + fr(12, 20) + '.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Simplifying with the GCF</h2>' +
'<p>To <b>simplify</b> a fraction, divide the top and bottom by a common factor. Divide by the <b>GCF</b> and you reach <b>simplest form</b> in one step.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>Simplify ' + fr(18, 24) + '. The GCF of 18 and 24 is 6.</p><p class="math" style="font-size:1.2rem">' + fr(18, 24) + ' = ' + fr('18 &divide; 6', '24 &divide; 6') + ' = ' + fr(3, 4) + '</p>' +
'<div class="fig">' + stack([[18, 24], [3, 4]], '18/24 and 3/4 shade the same length') + '</div><p>Every 6 small pieces join into 1 big piece.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Do not divide only the top, or subtract. ' + fr(18, 24) + ' is not ' + fr(3, 24) + ' and not ' + fr(12, 18) + '. Whatever you do to the top, do the same to the bottom, and only multiply or divide.</p></div>' +
'<div class="lab"><span class="lt">Try it: simplify any fraction</span>' +
'<div class="ctrl"><label for="smn">Top<input type="number" id="smn" min="1" max="144" value="24"></label><label for="smd">Bottom<input type="number" id="smd" min="2" max="144" value="36"></label></div>' +
'<div class="out" id="smout"></div><div class="fig" id="smfig"></div></div>' +
A.yt({ q: 'Simplify ' + fr(20, 30) + '. Type it as a fraction, like 2/5.', answer: 2 / 3, show: '2/3', kb: 'text', accept: A.lowest(2, 3), hint: 'The GCF of 20 and 30 is 10.', explain: '20 &divide; 10 = 2 and 30 &divide; 10 = 3, so ' + fr(20, 30) + ' = ' + fr(2, 3) + '.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Comparing and ordering fractions</h2>' +
'<p>Fractions are easy to compare when they have the <b>same denominator</b>, because the pieces are the same size. Then the bigger top wins.</p>' +
'<div class="vs"><div><b class="t">Same bottom</b><p>' + fr(5, 8) + ' &gt; ' + fr(3, 8) + '</p><p>5 pieces beat 3 pieces of the same size.</p></div><div><b class="t">Same top</b><p>' + fr(3, 4) + ' &gt; ' + fr(3, 8) + '</p><p>Quarters are bigger pieces than eighths.</p></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Which is greater, ' + fr(2, 3) + ' or ' + fr(3, 5) + '? Rewrite both with the denominator 15 (the LCM of 3 and 5).</p>' +
'<p class="math">' + fr(2, 3) + ' = ' + fr(10, 15) + ' and ' + fr(3, 5) + ' = ' + fr(9, 15) + '. 10 &gt; 9, so ' + fr(2, 3) + ' is greater.</p>' +
'<div class="fig">' + stack([[10, 15, 'var(--sb)'], [9, 15, 'var(--se)']], '10/15 is longer than 9/15') + '</div></div>' +
'<div class="lab"><span class="lt">Try it: compare two fractions</span>' +
'<div class="ctrl"><label for="cpa">First: top<input type="number" id="cpa" min="0" max="20" value="5"></label><label for="cpb">bottom<input type="number" id="cpb" min="1" max="12" value="6"></label>' +
'<label for="cpc">Second: top<input type="number" id="cpc" min="0" max="20" value="7"></label><label for="cpd">bottom<input type="number" id="cpd" min="1" max="12" value="9"></label></div>' +
'<div class="fig" id="cpfig"></div><div class="out" id="cpout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Use <b>' + fr(1, 2) + '</b> as a quick check. ' + fr(3, 7) + ' is less than a half (3 is less than half of 7). ' + fr(5, 9) + ' is more than a half. So ' + fr(3, 7) + ' &lt; ' + fr(5, 9) + '.</p></div>' +
A.yt({ q: 'Which is greater?', type: 'mc', options: [fr(3, 4), fr(5, 8), 'They are equal'], answer: 0, hint: 'Write ' + fr(3, 4) + ' in eighths.', explain: fr(3, 4) + ' = ' + fr(6, 8) + ', and 6 eighths is more than 5 eighths.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Finding a number in between</h2>' +
'<p>Between any two different fractions there is always another fraction. To find one, give them a common denominator. If there is no gap, cut the pieces smaller.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>Find a fraction between ' + fr(1, 3) + ' and ' + fr(1, 2) + '. In sixths they are ' + fr(2, 6) + ' and ' + fr(3, 6) + ', which are next to each other. Cut smaller, into twelfths: ' + fr(4, 12) + ' and ' + fr(6, 12) + '. Now ' + fr(5, 12) + ' fits between.</p>' +
'<div class="fig">' + zoom(1, 3, 1, 2).svg + '</div></div>' +
'<p>Decimals work the same way. Between 0.3 and 0.4 are 0.31, 0.35, 0.39, and many more. Between 0.35 and 0.36 is 0.355.</p>' +
'<div class="lab"><span class="lt">Try it: zoom in on the gap</span>' +
'<div class="ctrl"><label for="zma">First fraction<select id="zma"><option value="1,4">1/4</option><option value="1,3" selected>1/3</option><option value="2,5">2/5</option><option value="1,2">1/2</option><option value="3,5">3/5</option></select></label>' +
'<label for="zmb">Second fraction<select id="zmb"><option value="1,2" selected>1/2</option><option value="3,5">3/5</option><option value="2,3">2/3</option><option value="3,4">3/4</option><option value="4,5">4/5</option></select></label></div>' +
'<div class="fig" id="zmfig"></div><div class="out" id="zmout"></div></div>' +
A.yt({ q: 'Which number is between 0.6 and 0.7?', type: 'mc', options: ['0.06', '0.65', '0.71', '0.7'], answer: 1, hint: 'Write both as hundredths: 0.60 and 0.70.', explain: '0.60 &lt; 0.65 &lt; 0.70.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Adding fractions</h2>' +
'<p>You can only add pieces of the <b>same size</b>. If the denominators are different, rewrite the fractions with a common denominator first. Then add the tops and keep the bottom.</p>' +
'<div class="eg"><b class="t">Worked example</b><p class="math">' + fr(1, 2) + ' + ' + fr(1, 3) + ' = ' + fr(3, 6) + ' + ' + fr(2, 6) + ' = ' + fr(5, 6) + '</p><div class="fig">' + addPic(1, 2, 1, 3) + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Do not add the bottoms. ' + fr(1, 2) + ' + ' + fr(1, 3) + ' is not ' + fr(2, 5) + '. That answer is smaller than ' + fr(1, 2) + ', which cannot be right.</p></div>' +
'<div class="lab"><span class="lt">Try it: add two fractions</span>' +
'<div class="ctrl"><label for="ada">Top<input type="number" id="ada" min="0" max="12" value="2"></label><label for="adb">Bottom<input type="number" id="adb" min="2" max="12" value="3"></label><span class="big2">+</span>' +
'<label for="adc">Top<input type="number" id="adc" min="0" max="12" value="3"></label><label for="add">Bottom<input type="number" id="add" min="2" max="12" value="4"></label></div>' +
'<div class="out" id="adout"></div><div class="fig" id="adfig"></div></div>' +
A.yt({ q: 'Add: ' + fr(2, 5) + ' + ' + fr(3, 10) + '. Type a fraction, like 1/2.', answer: 7 / 10, show: '7/10', kb: 'text', hint: 'Write ' + fr(2, 5) + ' in tenths first.', explain: fr(2, 5) + ' = ' + fr(4, 10) + '. ' + fr(4, 10) + ' + ' + fr(3, 10) + ' = ' + fr(7, 10) + '.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Subtracting fractions and mixed numbers</h2>' +
'<p>Subtracting works the same way: common denominator first, then subtract the tops. A <b>mixed number</b> like ' + A.mixed(2, 1, 4) + ' is a whole number and a fraction.</p>' +
'<div class="eg"><b class="t">Worked example</b><p class="math">' + fr(5, 6) + ' &minus; ' + fr(1, 4) + ' = ' + fr(10, 12) + ' &minus; ' + fr(3, 12) + ' = ' + fr(7, 12) + '</p><div class="fig">' + addPic(5, 6, 1, 4, true) + '</div></div>' +
'<div class="eg"><b class="t">Worked example: borrowing a whole</b><p>' + A.mixed(2, 1, 4) + ' &minus; ' + fr(3, 4) + '. You cannot take 3 quarters from 1 quarter, so break one whole into 4 quarters: ' + A.mixed(2, 1, 4) + ' = ' + A.mixed(1, 5, 4) + '.</p>' +
'<p class="math">' + A.mixed(1, 5, 4) + ' &minus; ' + fr(3, 4) + ' = ' + A.mixed(1, 2, 4) + ' = ' + A.mixed(1, 1, 2) + '</p><div class="fig">' + bar(9, 4, { lab: '= 9/4', alt: '2 and 1/4 is 9 quarters' }) + '</div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Check your answer by adding back. ' + A.mixed(1, 1, 2) + ' + ' + fr(3, 4) + ' = ' + A.mixed(1, 2, 4) + ' + ' + fr(3, 4) + ' = ' + A.mixed(1, 5, 4) + ' = ' + A.mixed(2, 1, 4) + '. It works.</p></div>' +
A.yt({ q: 'Subtract: ' + fr(7, 8) + ' &minus; ' + fr(1, 2) + '. Type a fraction.', answer: 3 / 8, show: '3/8', kb: 'text', hint: fr(1, 2) + ' is how many eighths?', explain: fr(1, 2) + ' = ' + fr(4, 8) + '. ' + fr(7, 8) + ' &minus; ' + fr(4, 8) + ' = ' + fr(3, 8) + '.' }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function num(id, lo, hi, def) { var v = parseInt($('#' + id, root).value, 10); if (isNaN(v)) v = def; return Math.max(lo, Math.min(hi, v)); }
      A.bind(root, ['eqn', 'eqd', 'eqk'], function () {
        var d = +$('#eqd', root).value, n = Math.min(+$('#eqn', root).value, d), k = +$('#eqk', root).value;
        $('#eqno', root).textContent = n; $('#eqdo', root).textContent = d; $('#eqko', root).textContent = k;
        $('#eqfig', root).innerHTML = stack([[n, d, 'var(--sb)'], [n * k, d * k, 'var(--se)']]);
        $('#eqout', root).innerHTML = '<p class="big2">' + fr(n, d) + ' = ' + fr(n + ' &times; ' + k, d + ' &times; ' + k) + ' = ' + fr(n * k, d * k) + '</p><p>Each piece was cut into ' + k + '. There are ' + k + ' times as many pieces, each ' + k + ' times smaller, so the amount is the same.</p>';
      });
      A.bind(root, ['smn', 'smd'], function () {
        var n = num('smn', 1, 144, 1), d = num('smd', 2, 144, 2), g = gcd(n, d);
        $('#smout', root).innerHTML = '<p>GCF of ' + n + ' and ' + d + ' is <b>' + g + '</b>.</p><p class="big2">' + fr(n, d) + ' = ' + fr(n + ' &divide; ' + g, d + ' &divide; ' + g) + ' = ' + fr(n / g, d / g) + '</p>' +
          (g === 1 ? '<p>The GCF is 1, so ' + n + '/' + d + ' is already in simplest form.</p>' : '') + (n > d ? '<p>As a mixed number: ' + frs(n, d) + '.</p>' : '');
        $('#smfig', root).innerHTML = d <= 48 && n <= 2 * d ? stack([[n, d, 'var(--sb)'], [n / g, d / g, 'var(--se)']]) : '<p class="t2">(Pictures are drawn for bottoms up to 48.)</p>';
      });
      A.bind(root, ['cpa', 'cpb', 'cpc', 'cpd'], function () {
        var a = num('cpa', 0, 20, 0), b = num('cpb', 1, 12, 1), c = num('cpc', 0, 20, 0), d = num('cpd', 1, 12, 1), L = lcm(b, d);
        var x = a * L / b, y = c * L / d, top = Math.max(1, Math.ceil(Math.max(a / b, c / d)));
        $('#cpfig', root).innerHTML = fline(0, top, L <= 24 / top ? L : 1, [{ v: a / b, lab: a + '/' + b, col: 'var(--sb)' }, { v: c / d, lab: c + '/' + d, col: 'var(--se)' }]);
        $('#cpout', root).innerHTML = '<p>Common denominator: ' + L + '. ' + fr(a, b) + ' = ' + fr(x, L) + ' and ' + fr(c, d) + ' = ' + fr(y, L) + '.</p><p class="big2">' + fr(a, b) + (x > y ? ' &gt; ' : x < y ? ' &lt; ' : ' = ') + fr(c, d) + '</p>' +
          (x === y ? '<p>They are equivalent.</p>' : '<p>The one further right on the line is greater.</p>');
      });
      A.bind(root, ['zma', 'zmb'], function () {
        var p = $('#zma', root).value.split(',').map(Number), q = $('#zmb', root).value.split(',').map(Number);
        if (p[0] / p[1] > q[0] / q[1]) { var t = p; p = q; q = t; }
        if (p[0] / p[1] === q[0] / q[1]) { $('#zmfig', root).innerHTML = ''; $('#zmout', root).innerHTML = '<p>Pick two different fractions.</p>'; return; }
        var z = zoom(p[0], p[1], q[0], q[1]);
        $('#zmfig', root).innerHTML = z.svg;
        var mids = []; for (var i = z.lo + 1; i < z.hi; i++) mids.push(frs(i, z.D));
        $('#zmout', root).innerHTML = '<p>In ' + z.D + 'ths: ' + fr(p[0], p[1]) + ' = ' + fr(z.lo, z.D) + ' and ' + fr(q[0], q[1]) + ' = ' + fr(z.hi, z.D) + '.</p><p>In between: ' + mids.join(', ') + '</p>';
      });
      A.bind(root, ['ada', 'adb', 'adc', 'add'], function () {
        var a = num('ada', 0, 12, 0), b = num('adb', 2, 12, 2), c = num('adc', 0, 12, 0), d = num('add', 2, 12, 2), L = lcm(b, d), s = a * L / b + c * L / d;
        $('#adout', root).innerHTML = '<p class="big2">' + fr(a, b) + ' + ' + fr(c, d) + ' = ' + fr(a * L / b, L) + ' + ' + fr(c * L / d, L) + ' = ' + fr(s, L) + (frs(s, L) !== fr(s, L) ? ' = ' + frs(s, L) : '') + '</p>';
        $('#adfig', root).innerHTML = L <= 60 && s / L <= 3 ? addPic(a, b, c, d) : '<p class="t2">(The picture is shown for answers up to 3.)</p>';
      });
    },

    quiz: [
      { q: 'Fill in the missing number: ' + fr(4, 7) + ' = ' + fr('?', 35), type: 'num', answer: 20, hint: '7 times what makes 35? Do the same to the top.', explain: '7 &times; 5 = 35, so 4 &times; 5 = 20.' },
      { q: 'Which fraction is ' + fr(24, 40) + ' in simplest form?', type: 'mc', options: [fr(12, 20), fr(6, 10), fr(3, 5), fr(4, 5)], answer: 2, hint: 'Find the GCF of 24 and 40.', explain: 'The GCF is 8. 24 &divide; 8 = 3 and 40 &divide; 8 = 5, so ' + fr(3, 5) + '. The other equal ones are not in simplest form.' },
      { q: 'Which list is in order from least to greatest?', type: 'mc', options: [fr(1, 2) + ', ' + fr(3, 8) + ', ' + fr(3, 4), fr(3, 8) + ', ' + fr(1, 2) + ', ' + fr(3, 4), fr(3, 4) + ', ' + fr(1, 2) + ', ' + fr(3, 8), fr(3, 8) + ', ' + fr(3, 4) + ', ' + fr(1, 2)], answer: 1, hint: 'Write all three in eighths.', explain: 'In eighths they are 4/8, 3/8 and 6/8. In order: 3/8, 4/8 (= 1/2), 6/8 (= 3/4).' },
      { q: 'Which fraction is between ' + fr(2, 5) + ' and ' + fr(1, 2) + '?', type: 'mc', options: [fr(3, 10), fr(9, 20), fr(11, 20), fr(3, 5)], answer: 1, hint: 'Write both in twentieths.', explain: fr(2, 5) + ' = ' + fr(8, 20) + ' and ' + fr(1, 2) + ' = ' + fr(10, 20) + '. ' + fr(9, 20) + ' is between them.' },
      { q: 'Add: ' + fr(1, 4) + ' + ' + fr(2, 3) + '. Type a fraction.', type: 'num', answer: 11 / 12, show: '11/12', kb: 'text', hint: 'The common denominator of 4 and 3 is 12.', explain: fr(3, 12) + ' + ' + fr(8, 12) + ' = ' + fr(11, 12) + '.' },
      { q: 'Subtract: ' + A.mixed(3, 1, 3) + ' &minus; ' + A.mixed(1, 2, 3) + '. Type a fraction or mixed number, like 1 1/2.', type: 'num', answer: 5 / 3, show: '1 2/3', kb: 'text', hint: 'Break one whole into thirds: ' + A.mixed(3, 1, 3) + ' = ' + A.mixed(2, 4, 3) + '.', explain: A.mixed(2, 4, 3) + ' &minus; ' + A.mixed(1, 2, 3) + ' = ' + A.mixed(1, 2, 3) + '.' },
      { q: 'Mia ran ' + fr(3, 4) + ' km on Monday and ' + fr(5, 6) + ' km on Tuesday. How far did she run in total? Type a fraction or mixed number.', type: 'num', answer: 19 / 12, show: '1 7/12 km', kb: 'text', hint: 'Use twelfths: ' + fr(3, 4) + ' = ' + fr(9, 12) + ' and ' + fr(5, 6) + ' = ' + fr(10, 12) + '.', explain: fr(9, 12) + ' + ' + fr(10, 12) + ' = ' + fr(19, 12) + ' = ' + A.mixed(1, 7, 12) + ' km.' }
    ],

    practice: [
      { id: 'fr-equiv', name: 'Equivalent fractions', code: 'B1.4', gen: function (lv) {
        var d = R.int(2, lv === 1 ? 6 : 12), n = R.int(1, d - 1), k = R.int(2, lv === 1 ? 4 : 9), top = R.int(0, 1);
        if (lv === 3) { var g = gcd(n, d); n /= g; d /= g; if (d === 1) { n = 1; d = 2; } }
        var bigN = n * k, bigD = d * k, ask = lv === 3 && R.int(0, 1) ? 'small' : 'big';
        if (ask === 'small') {
          return { q: 'Fill in the missing number: ' + fr(bigN, bigD) + ' = ' + (top ? fr('?', d) : fr(n, '?')), type: 'num', answer: top ? n : d,
            hint: 'What was ' + (top ? bigD : bigN) + ' divided by to get ' + (top ? d : n) + '? Divide the other number the same way.',
            steps: [(top ? bigD + ' &divide; ' + k + ' = ' + d : bigN + ' &divide; ' + k + ' = ' + n) + '.', 'Do the same to the other part: ' + (top ? bigN + ' &divide; ' + k + ' = ' + n : bigD + ' &divide; ' + k + ' = ' + d) + '.', 'So ' + fr(bigN, bigD) + ' = ' + fr(n, d) + '.'],
            explain: 'Both parts were divided by ' + k + '.' };
        }
        return { q: 'Fill in the missing number: ' + fr(n, d) + ' = ' + (top ? fr('?', bigD) : fr(bigN, '?')), type: 'num', answer: top ? bigN : bigD,
          fig: lv === 1 ? stack([[n, d, 'var(--sb)'], [bigN, bigD, 'var(--se)']]) : '',
          hint: 'What was ' + (top ? d : n) + ' multiplied by to get ' + (top ? bigD : bigN) + '? Do the same to the other part.',
          steps: [(top ? d + ' &times; ' + k + ' = ' + bigD : n + ' &times; ' + k + ' = ' + bigN) + '.', 'Do the same to the other part: ' + (top ? n + ' &times; ' + k + ' = ' + bigN : d + ' &times; ' + k + ' = ' + bigD) + '.', 'So ' + fr(n, d) + ' = ' + fr(bigN, bigD) + '.'],
          explain: 'Both parts were multiplied by ' + k + '.' };
      } },
      { id: 'fr-simplify', name: 'Simplify fractions', code: 'B1.4', gen: function (lv) {
        var d, n, k;
        do { d = R.int(2, lv === 1 ? 8 : 12); n = R.int(1, lv === 3 ? 2 * d : d - 1); } while (gcd(n, d) !== 1 || n === d);
        k = lv === 1 ? R.int(2, 5) : R.int(3, 12);
        var N = n * k, D = d * k, G = gcd(N, D);
        if (lv === 1) {
          var o = R.mc(fr(n, d), [fr(N / 2 === Math.floor(N / 2) && D % 2 === 0 && G > 2 ? N / 2 : n + 1, N / 2 === Math.floor(N / 2) && D % 2 === 0 && G > 2 ? D / 2 : d), fr(N - (k - 1), D), fr(n, d + 1), fr(d, n)]);
          return { q: 'Which is ' + fr(N, D) + ' in simplest form?', type: 'mc', options: o.options, answer: o.answer, fig: stack([[N, D, 'var(--sb)'], [n, d, 'var(--se)']]),
            hint: 'Find the biggest number that divides ' + N + ' and ' + D + '.',
            steps: ['The GCF of ' + N + ' and ' + D + ' is ' + G + '.', N + ' &divide; ' + G + ' = ' + n + ' and ' + D + ' &divide; ' + G + ' = ' + d + '.', 'Simplest form: ' + fr(n, d) + '.'], explain: fr(N, D) + ' = ' + fr(n, d) + '.' };
        }
        return { q: 'Simplify ' + fr(N, D) + (n > d ? '. Type a fraction like 7/4 or a mixed number like 1 3/4.' : '. Type it as a fraction, like 2/5.'), type: 'num', answer: n / d, show: n > d ? n + '/' + d + ' or ' + plain(n, d) : n + '/' + d, kb: 'text', accept: A.lowest(n, d),
          hint: 'Divide the top and bottom by the GCF of ' + N + ' and ' + D + '.',
          steps: ['Factors of ' + N + ' and ' + D + ' in common include ' + G + '. It is the greatest.', N + ' &divide; ' + G + ' = ' + n + ' and ' + D + ' &divide; ' + G + ' = ' + d + '.', 'Simplest form: ' + fr(n, d) + (n > d ? ' = ' + frs(n, d) : '') + '.'],
          explain: 'The GCF is ' + G + ', so ' + fr(N, D) + ' = ' + fr(n, d) + '.' };
      } },
      { id: 'fr-compare', name: 'Compare and order fractions', code: 'B1.3, B1.4', gen: function (lv) {
        function rnd() { var d = R.int(2, 12), n = R.int(1, lv === 3 ? 2 * d : d - 1); return [n, d]; }
        if (lv === 3) {
          var fs = [], vals = {};
          while (fs.length < 3) { var f = rnd(), v = f[0] / f[1]; if (!vals[v.toFixed(6)]) { vals[v.toFixed(6)] = 1; fs.push(f); } }
          var sorted = fs.slice().sort(function (a, b) { return a[0] / a[1] - b[0] / b[1]; });
          var show = function (l) { return l.map(function (f) { return fr(f[0], f[1]); }).join(', '); };
          var perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(function (p) { return show(p.map(function (i) { return sorted[i]; })); });
          var o = R.mc(perms[0], R.shuffle(perms.slice(1)));
          var L = sorted.reduce(function (a, f) { return lcm(a, f[1]); }, 1);
          return { q: 'Which list is in order from least to greatest?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'Write all three with the same denominator, ' + L + ', or compare each to 1/2 and 1.',
            steps: ['Common denominator: ' + L + '.', fs.map(function (f) { return fr(f[0], f[1]) + ' = ' + fr(f[0] * L / f[1], L); }).join(', ') + '.', 'Order the tops: ' + show(sorted) + '.'],
            explain: 'Least to greatest: ' + show(sorted) + '.' };
        }
        var a, b;
        do {
          var d0 = R.int(3, 12);
          if (lv === 1) {
            if (R.int(0, 1)) { a = [R.int(1, d0 - 1), d0]; b = [R.int(1, d0 - 1), d0]; }
            else { var n0 = R.int(1, 4); a = [n0, R.int(n0 + 1, 12)]; b = [n0, R.int(n0 + 1, 12)]; }
          } else { a = [R.int(1, d0 - 1), d0]; var d1 = R.int(2, 12); b = [R.int(1, d1 - 1), d1]; }
        } while (a[0] * b[1] === b[0] * a[1] || (lv === 2 && a[1] === b[1]));
        var L2 = lcm(a[1], b[1]), x = a[0] * L2 / a[1], y = b[0] * L2 / b[1], big = x > y ? a : b, sm = x > y ? b : a;
        var o2 = R.mc(fr(big[0], big[1]), [fr(sm[0], sm[1]), 'They are equal']);
        return { q: 'Which is greater?', type: 'mc', options: o2.options, answer: o2.answer,
          hint: a[1] === b[1] ? 'Same size pieces: compare the tops.' : a[0] === b[0] ? 'Same number of pieces: which pieces are bigger?' : 'Rewrite both with the denominator ' + L2 + '.',
          steps: [fr(a[0], a[1]) + ' = ' + fr(x, L2) + ' and ' + fr(b[0], b[1]) + ' = ' + fr(y, L2) + '.', 'Compare the tops: ' + Math.max(x, y) + ' &gt; ' + Math.min(x, y) + '.', fr(big[0], big[1]) + ' is greater.<div class="fig">' + fline(0, Math.max(1, Math.ceil(Math.max(x, y) / L2)), 1, [{ v: a[0] / a[1], lab: a[0] + '/' + a[1], col: 'var(--sb)' }, { v: b[0] / b[1], lab: b[0] + '/' + b[1], col: 'var(--se)' }]) + '</div>'],
          explain: fr(big[0], big[1]) + ' = ' + fr(Math.max(x, y), L2) + ' is more than ' + fr(sm[0], sm[1]) + ' = ' + fr(Math.min(x, y), L2) + '.' };
      } },
      { id: 'fr-between', name: 'A number in between', code: 'B1.5', gen: function (lv) {
        if (lv === 2 && R.int(0, 1)) {
          var t = R.int(1, 8), h = R.int(0, 9), lo = t / 10 + h / 100, hi = lo + 0.01;
          var mid = (lo * 1000 + R.int(1, 9)) / 1000, f = function (v) { return String(Math.round(v * 1000) / 1000); };
          var o0 = R.mc(f(mid), [f(lo - 0.01 + 0.001 * R.int(1, 9)), f(hi + 0.001 * R.int(1, 9)), f(lo / 10)]);
          return { q: 'Which decimal is between ' + f(lo) + ' and ' + f(hi) + '?', type: 'mc', options: o0.options, answer: o0.answer,
            hint: 'Write both with three decimal places: ' + lo.toFixed(3) + ' and ' + hi.toFixed(3) + '.',
            steps: ['Add a zero so both have thousandths: ' + lo.toFixed(3) + ' and ' + hi.toFixed(3) + '.', 'Any number from ' + (lo + 0.001).toFixed(3) + ' to ' + (hi - 0.001).toFixed(3) + ' fits.', f(mid) + ' is one of them.'],
            explain: lo.toFixed(3) + ' &lt; ' + mid.toFixed(3) + ' &lt; ' + hi.toFixed(3) + '.' };
        }
        if (lv === 1) {
          var dd = R.int(5, 12), a = R.int(1, dd - 3), c = a + R.int(2, 3), m = R.int(a + 1, c - 1);
          var o1 = R.mc(fr(m, dd), [fr(a - 1 > 0 ? a - 1 : c + 1, dd), fr(c + 1, dd), fr(m, dd + 3)].filter(function (x) { return x !== fr(m, dd); }));
          return { q: 'Which fraction is between ' + fr(a, dd) + ' and ' + fr(c, dd) + '?', type: 'mc', options: o1.options, answer: o1.answer,
            fig: fline(0, 1, dd, [{ v: a / dd, col: 'var(--sb)', lab: a + '/' + dd }, { v: c / dd, col: 'var(--se)', lab: c + '/' + dd }]),
            hint: 'The denominators are the same. Look for a top between ' + a + ' and ' + c + '.',
            steps: ['Same denominator, ' + dd + ', so compare the tops.', 'A top between ' + a + ' and ' + c + ' works, like ' + m + '.', 'Answer: ' + fr(m, dd) + '.'], explain: a + ' &lt; ' + m + ' &lt; ' + c + ', so ' + fr(m, dd) + ' is between.' };
        }
        var p, q;
        do { p = [R.int(1, 5), R.int(2, 8)]; q = [R.int(1, 7), R.int(2, 8)]; } while (p[0] >= p[1] || q[0] >= q[1] || p[0] / p[1] >= q[0] / q[1] || q[0] / q[1] - p[0] / p[1] > 0.3);
        var z = zoom(p[0], p[1], q[0], q[1]), pick = R.int(z.lo + 1, z.hi - 1), ans = frs(pick, z.D);
        var lov = p[0] / p[1], hiv = q[0] / q[1], wrong = [];
        [[z.lo - 1, z.D], [z.hi + 1, z.D], [p[0] + q[0], p[1] + q[1] + 3], [z.hi + 2, z.D], [p[0], q[1] + p[1]]].forEach(function (w) {
          var v = w[0] / w[1];
          if (w[0] > 0 && (v <= lov || v >= hiv) && wrong.indexOf(frs(w[0], w[1])) < 0 && frs(w[0], w[1]) !== ans) wrong.push(frs(w[0], w[1]));
        });
        var o3 = R.mc(ans, wrong);
        return { q: 'Which fraction is between ' + fr(p[0], p[1]) + ' and ' + fr(q[0], q[1]) + '?', type: 'mc', options: o3.options, answer: o3.answer,
          hint: 'Rewrite both with the denominator ' + z.D + '.',
          steps: ['Rewrite with the denominator ' + z.D + ': ' + fr(z.lo, z.D) + ' and ' + fr(z.hi, z.D) + '.', 'Any top from ' + (z.lo + 1) + ' to ' + (z.hi - 1) + ' fits.<div class="fig">' + z.svg + '</div>', ans + ' = ' + fr(pick, z.D) + ' is between them.'],
          explain: fr(z.lo, z.D) + ' &lt; ' + fr(pick, z.D) + ' &lt; ' + fr(z.hi, z.D) + '.' };
      } },
      { id: 'fr-add', name: 'Add fractions', code: 'B2.5', gen: function (lv) {
        var a, b, c, d, w1 = 0, w2 = 0;
        if (lv === 1) { b = R.int(3, 10); d = b * R.pick([1, 2]); if (d > 12) d = b; a = R.int(1, b - 1); c = R.int(1, d - 1); }
        else { do { b = R.int(2, 10); d = R.int(2, 10); } while (b === d || lcm(b, d) > 40); a = R.int(1, b - 1); c = R.int(1, d - 1); }
        if (lv === 3) { w1 = R.int(1, 3); w2 = R.int(1, 2); }
        var L = lcm(b, d), x = a * L / b, y = c * L / d, N = (w1 + w2) * L + x + y;
        var q = lv === 3 ? 'Add: ' + A.mixed(w1, a, b) + ' + ' + A.mixed(w2, c, d) + '. Type a mixed number like 3 1/4, or a fraction.' : 'Add: ' + fr(a, b) + ' + ' + fr(c, d) + '. Type a fraction or mixed number.';
        var steps = ['Common denominator: ' + L + '. ' + fr(a, b) + ' = ' + fr(x, L) + ' and ' + fr(c, d) + ' = ' + fr(y, L) + '.'];
        if (lv === 3) steps.push('Add the wholes: ' + w1 + ' + ' + w2 + ' = ' + (w1 + w2) + '. Add the fractions: ' + fr(x, L) + ' + ' + fr(y, L) + ' = ' + fr(x + y, L) + '.');
        else steps.push('Add the tops: ' + x + ' + ' + y + ' = ' + (x + y) + '. Keep the bottom: ' + fr(x + y, L) + '.');
        steps.push('Simplify: ' + frs(N, L) + '.');
        return { q: q, type: 'num', answer: N / L, show: plain(N, L), kb: 'text', tol: 1e-6, fig: lv === 1 ? addPic(a, b, c, d) : '',
          hint: b === d ? 'The pieces are the same size. Add the tops.' : 'Write both fractions with the denominator ' + L + ' first.', steps: steps,
          explain: 'The total is ' + frs(N, L) + '.' };
      } },
      { id: 'fr-sub', name: 'Subtract fractions', code: 'B2.5', gen: function (lv) {
        var a, b, c, d, w1 = 0, w2 = 0, L, x, y;
        do {
          if (lv === 1) { b = R.int(3, 10); d = b * R.pick([1, 2]); if (d > 12) d = b; } else { do { b = R.int(2, 10); d = R.int(2, 10); } while (b === d || lcm(b, d) > 40); }
          a = R.int(1, b - 1); c = R.int(1, d - 1); L = lcm(b, d); x = a * L / b; y = c * L / d;
          if (lv === 3) { w1 = R.int(2, 4); w2 = R.int(0, w1 - 1); }
        } while (lv < 3 ? x <= y : (w1 * L + x) <= (w2 * L + y) || x >= y);
        var N = (w1 - w2) * L + x - y;
        var q = lv === 3 ? 'Subtract: ' + A.mixed(w1, a, b) + ' &minus; ' + A.mixed(w2, c, d) + '. Type a mixed number or fraction.' : 'Subtract: ' + fr(a, b) + ' &minus; ' + fr(c, d) + '. Type a fraction.';
        var steps = ['Common denominator: ' + L + '. ' + fr(a, b) + ' = ' + fr(x, L) + ' and ' + fr(c, d) + ' = ' + fr(y, L) + '.'];
        if (lv === 3) steps.push(fr(x, L) + ' is less than ' + fr(y, L) + ', so borrow a whole: ' + A.mixed(w1, x, L) + ' = ' + A.mixed(w1 - 1, x + L, L) + '.', 'Subtract the wholes and the fractions: ' + (w1 - 1 - w2) + ' and ' + fr(x + L - y, L) + '.');
        else steps.push('Subtract the tops: ' + x + ' &minus; ' + y + ' = ' + (x - y) + '.');
        steps.push('Answer in simplest form: ' + frs(N, L) + '.');
        return { q: q, type: 'num', answer: N / L, show: plain(N, L), kb: 'text', tol: 1e-6, fig: lv === 1 ? addPic(a, b, c, d, true) : '',
          hint: lv === 3 ? 'The second fraction is bigger than the first. Borrow 1 whole as ' + L + '/' + L + '.' : 'Write both with the denominator ' + L + ', then subtract the tops.', steps: steps,
          explain: 'The answer is ' + frs(N, L) + '. Check: add it back to ' + (lv === 3 ? A.mixed(w2, c, d) : fr(c, d)) + '.' };
      } }
    ]
  });
})();
