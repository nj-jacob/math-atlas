(function () {
  var A = Atlas, R = A.R, F = A.fmt;
  var SQ = '<sup>2</sup>', RT = '&radic;';
  function r1(x) { return Math.round(x * 10) / 10; }
  function r2(x) { return Math.round(x * 100) / 100; }

  /* an n by n square of unit tiles, with its sides and area labelled */
  function square(n, maxN) {
    maxN = maxN || 15;
    var u = Math.min(22, 250 / Math.max(n, 1)), side = n * u, x0 = 56, y0 = 40, s = '';
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++)
      s += '<rect x="' + (x0 + j * u) + '" y="' + (y0 + i * u) + '" width="' + u + '" height="' + u + '" style="fill:color-mix(in srgb,var(--strand) ' + ((i + j) % 2 ? 22 : 30) + '%,var(--card));stroke:var(--card)" stroke-width="' + (u > 8 ? 1.2 : 0.6) + '"/>';
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + side + '" height="' + side + '" fill="none" style="stroke:var(--strand)" stroke-width="2.5"/>';
    s += '<text x="' + (x0 + side / 2) + '" y="' + (y0 - 12) + '" text-anchor="middle" font-size="19" class="tb">' + n + '</text>';
    s += '<text x="' + (x0 - 12) + '" y="' + (y0 + side / 2 + 6) + '" text-anchor="end" font-size="19" class="tb">' + n + '</text>';
    var tx = x0 + side + 24;
    s += '<text x="' + tx + '" y="' + (y0 + side / 2 - 10) + '" font-size="18">area</text><text x="' + tx + '" y="' + (y0 + side / 2 + 18) + '" font-size="24" class="serif" font-weight="600">' + n * n + '</text>';
    var W = Math.max(330, tx + 70);
    return A.svg(W, y0 + side + 14, s, 'A square ' + n + ' tiles wide and ' + n + ' tiles tall. It has ' + n * n + ' tiles, so ' + n + ' squared is ' + n * n + ' and the square root of ' + n * n + ' is ' + n + '.');
  }
  /* where a square root sits between two whole numbers: squares above, roots below */
  function rootLine(n) {
    var a = Math.floor(Math.sqrt(n)), b = a + 1;
    if (a * a === n) b = a + 1;
    var x0 = 84, x1 = 372, s = '', t = (Math.sqrt(n) - a), lin = (n - a * a) / (b * b - a * a);
    function X(f) { return x0 + (x1 - x0) * f; }
    s += '<text x="4" y="59" font-size="15" class="t2">squares</text>';
    s += '<line x1="' + x0 + '" y1="54" x2="' + x1 + '" y2="54" style="stroke:var(--ink2)" stroke-width="2"/>';
    s += '<text x="' + X(0) + '" y="78" text-anchor="middle" font-size="18" class="tb">' + a * a + '</text><text x="' + X(1) + '" y="78" text-anchor="middle" font-size="18" class="tb">' + b * b + '</text>';
    s += '<circle cx="' + X(lin) + '" cy="54" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.5"/><text x="' + X(lin) + '" y="36" text-anchor="middle" font-size="18" class="tb">' + n + '</text>';
    s += '<line x1="' + X(lin) + '" y1="62" x2="' + X(t) + '" y2="128" style="stroke:var(--accent)" stroke-width="1.6" stroke-dasharray="5 4"/>';
    s += '<text x="4" y="141" font-size="15" class="t2">roots</text>';
    s += '<line x1="' + x0 + '" y1="136" x2="' + x1 + '" y2="136" style="stroke:var(--ink)" stroke-width="2.5"/>';
    for (var k = 0; k <= 10; k++) s += '<line x1="' + X(k / 10) + '" y1="' + (k % 5 ? 131 : 127) + '" x2="' + X(k / 10) + '" y2="' + (k % 5 ? 141 : 145) + '" style="stroke:var(--ink)" stroke-width="1.5"/>';
    s += '<text x="' + X(0) + '" y="166" text-anchor="middle" font-size="18" class="tb">' + a + '</text><text x="' + X(1) + '" y="166" text-anchor="middle" font-size="18" class="tb">' + b + '</text><text x="' + X(0.5) + '" y="166" text-anchor="middle" font-size="15" class="t2">' + (a + 0.5) + '</text>';
    s += '<circle cx="' + X(t) + '" cy="136" r="7" style="fill:var(--accent)"/><text x="' + Math.min(340, Math.max(100, X(t))) + '" y="118" text-anchor="middle" font-size="17" class="tb" style="fill:var(--accent)">&#8730;' + n + '</text>';
    return A.svg(400, 176, s, n + ' is between the square numbers ' + a * a + ' and ' + b * b + ', so the square root of ' + n + ' is between ' + a + ' and ' + b + '. It is about ' + r1(Math.sqrt(n)) + '.');
  }
  /* the real number system as nested boxes; hl names the box to highlight */
  var SETS = [
    { k: 'real', t: 'Real numbers' }, { k: 'rat', t: 'Rational' }, { k: 'int', t: 'Integers' }, { k: 'whole', t: 'Whole' }, { k: 'nat', t: 'Natural' }, { k: 'irr', t: 'Irrational' }
  ];
  function nested(hl, label) {
    var s = '', box = function (k, x, y, w, h, t, ex) {
      var on = hl === k;
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="fill:' + (on ? 'color-mix(in srgb,var(--hi) 45%,var(--card))' : 'color-mix(in srgb,var(--strand) 7%,transparent)') + ';stroke:' + (on ? 'var(--ink)' : 'var(--strand)') + '" stroke-width="' + (on ? 3 : 1.5) + '"/>' +
        '<text x="' + (x + 10) + '" y="' + (y + 22) + '" font-size="17" class="tb">' + t + '</text>' + (ex ? '<text x="' + (x + 10) + '" y="' + (y + 42) + '" font-size="15" class="t2">' + ex + '</text>' : '');
    };
    s += box('real', 2, 2, 396, 304, 'Real numbers', '');
    s += box('rat', 14, 34, 252, 262, 'Rational', '&#8722;0.5, &#8532;, 0.333&#8230;');
    s += box('int', 26, 86, 228, 198, 'Integers', '&#8722;3, &#8722;1');
    s += box('whole', 38, 138, 204, 134, 'Whole numbers', '0');
    s += box('nat', 50, 190, 180, 70, 'Natural', '1, 2, 3, &#8230;');
    s += box('irr', 276, 34, 110, 262, 'Irrational', '');
    s += '<text x="331" y="100" text-anchor="middle" font-size="17">&#8730;2</text><text x="331" y="140" text-anchor="middle" font-size="17">&#960;</text><text x="331" y="180" text-anchor="middle" font-size="17">&#8730;10</text><text x="331" y="220" text-anchor="middle" font-size="15" class="t2">never ends,</text><text x="331" y="240" text-anchor="middle" font-size="15" class="t2">never repeats</text>';
    return A.svg(400, 308, s, label || 'The real numbers. Inside them are the rational numbers, which contain the integers, which contain the whole numbers, which contain the natural numbers. Beside the rational numbers are the irrational numbers such as root 2 and pi.');
  }
  /* a unit square with its diagonal, root 2 */
  function diagonal() {
    var s = '<rect x="40" y="20" width="130" height="130" style="fill:color-mix(in srgb,var(--strand) 12%,var(--card));stroke:var(--strand)" stroke-width="2"/>' +
      '<line x1="40" y1="150" x2="170" y2="20" style="stroke:var(--accent)" stroke-width="3"/>' +
      '<text x="105" y="172" text-anchor="middle" font-size="18" class="tb">1</text><text x="26" y="92" text-anchor="middle" font-size="18" class="tb">1</text>' +
      '<text x="122" y="80" font-size="19" class="tb" style="fill:var(--accent)">&#8730;2</text>' +
      '<text x="200" y="60" font-size="17">&#8730;2 = 1.414 213 56&#8230;</text><text x="200" y="88" font-size="16" class="t2">The digits never stop</text><text x="200" y="110" font-size="16" class="t2">and never repeat.</text>';
    return A.svg(400, 182, s, 'A square with sides of 1. Its diagonal is the square root of 2, about 1.414. The digits never end and never repeat.');
  }
  /* number line from lo to hi with labelled points [{v, t}] */
  function realLine(lo, hi, pts) {
    var x0 = 22, x1 = 378, s = '';
    function X(v) { return x0 + (x1 - x0) * (v - lo) / (hi - lo); }
    s += '<line x1="' + x0 + '" y1="80" x2="' + x1 + '" y2="80" style="stroke:var(--ink)" stroke-width="2"/>';
    for (var k = Math.ceil(lo); k <= hi; k++) s += '<line x1="' + X(k) + '" y1="72" x2="' + X(k) + '" y2="88" style="stroke:var(--ink)" stroke-width="2"/><text x="' + X(k) + '" y="110" text-anchor="middle" font-size="17">' + A.neg(k).replace('&minus;', '−') + '</text>';
    pts.slice().sort(function (a, b) { return a.v - b.v; }).forEach(function (p, i) {
      var x = X(p.v), y = i % 2 ? 50 : 24;
      s += '<line x1="' + x + '" y1="' + (y + 6) + '" x2="' + x + '" y2="76" style="stroke:var(--accent)" stroke-width="1.5"/><circle cx="' + x + '" cy="80" r="5.5" style="fill:var(--accent)"/>' +
        '<text x="' + Math.max(24, Math.min(376, x)) + '" y="' + y + '" text-anchor="middle" font-size="17" class="tb">' + p.t + '</text>';
    });
    return A.svg(400, 120, s, 'Number line with ' + pts.map(function (p) { return p.say || p.t; }).join(', ') + ' marked in order.');
  }

  var facts = '<div class="facts">';
  for (var i = 1; i <= 15; i++) facts += '<div><b>' + i + SQ + ' = ' + i * i + '</b><small>' + RT + i * i + ' = ' + i + '</small></div>';
  facts += '<div><b>20' + SQ + ' = 400</b><small>' + RT + '400 = 20</small></div></div>';

  var SORT = [
    { t: '7', k: 'nat', w: '7 is a counting number, so it is natural. It is also whole, an integer, rational and real.' },
    { t: '0', k: 'whole', w: '0 is a whole number but not a counting (natural) number. It is also an integer and rational.' },
    { t: '&minus;3', k: 'int', w: '&minus;3 is an integer. It is not whole, because whole numbers are not negative.' },
    { t: '2/5', k: 'rat', w: '2/5 is a fraction of two integers, so it is rational. It is 0.4, a decimal that ends.' },
    { t: '0.333&hellip;', k: 'rat', w: '0.333&hellip; repeats forever, and it equals 1/3. Repeating decimals are rational.' },
    { t: '&radic;49', k: 'nat', w: '&radic;49 = 7, so it is a natural number. Always work out a root first.' },
    { t: '&radic;2', k: 'irr', w: '&radic;2 = 1.414 21&hellip; never ends and never repeats. It is irrational.' },
    { t: '&pi;', k: 'irr', w: '&pi; = 3.141 59&hellip; never ends and never repeats. It is irrational.' },
    { t: '&minus;1.5', k: 'rat', w: '&minus;1.5 = &minus;3/2, a fraction of two integers. It is rational but not an integer.' }
  ];

  var html =
'<section class="sec"><h2><span class="n">1</span>Square numbers</h2>' +
'<p>To <b>square</b> a number, multiply it by itself. We write 6' + SQ + ' and say "6 squared". The picture shows why: 6' + SQ + ' is the area of a square with sides of 6.</p>' +
'<div class="fig">' + square(6) + '</div>' +
'<div class="lab"><span class="lt">Try it: build a square</span>' +
'<div class="ctrl"><label for="sqn">Side length: <output id="sqo"></output><input type="range" id="sqn" min="1" max="15" value="7"></label></div>' +
'<div class="fig" id="sqfig"></div><div class="out" id="sqout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Work out 12' + SQ + '.</p><ol><li>Squaring means the number times itself: 12 &times; 12.</li><li>12 &times; 12 = 144.</li><li>So 12' + SQ + ' = 144. A square with sides of 12 has an area of 144.</li></ol></div>' +
A.yt({ q: 'Work out 13' + SQ + '.', a: 169, back: 'Go back to step 1: squaring means 13 &times; 13, not 13 &times; 2.', ok: '13 &times; 13 = 169.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>6' + SQ + ' is <b>not</b> 6 &times; 2 = 12. It is 6 &times; 6 = 36. The small 2 means "use 6 as a factor twice".</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Square roots</h2>' +
'<p>A <b>square root</b> goes backwards. If you know the area of a square, the square root is its side length. The symbol is ' + RT + '.</p>' +
'<p class="math" style="font-size:1.2rem;text-align:center">' + RT + '81 = 9 &nbsp;because&nbsp; 9' + SQ + ' = 81</p>' +
'<p>Learn these by heart. You will use them all year.</p>' + facts +
'<div class="eg"><b class="t">Worked example</b><p>A square garden has an area of 64 m' + SQ + '. How long is each side?</p><ol><li>The side is the square root of the area: ' + RT + '64.</li><li>Which number times itself is 64? 8 &times; 8 = 64.</li><li>Each side is 8 m.</li></ol></div>' +
A.yt({ q: 'What is ' + RT + '196?', a: 14, back: 'Look at the table above. Find 196 and read which number was squared to make it.', ok: '14 &times; 14 = 196, so ' + RT + '196 = 14.' }) +
'<div class="key"><b class="t">Key idea</b><p>Squaring and square roots undo each other. You can check any square root by squaring your answer. ' + RT + '0.25 = 0.5 because 0.5 &times; 0.5 = 0.25.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Estimating square roots</h2>' +
'<p>Most numbers are not perfect squares. To estimate a square root, find the two perfect squares on either side.</p>' +
'<div class="fig">' + rootLine(50) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Estimate ' + RT + '50 to one decimal place.</p><ol><li>Find the perfect squares on each side: 49 &lt; 50 &lt; 64.</li><li>So ' + RT + '50 is between ' + RT + '49 = 7 and ' + RT + '64 = 8.</li><li>50 is very close to 49, so ' + RT + '50 is just above 7. Try 7.1.</li><li>Check: 7.1 &times; 7.1 = 50.41. That is close, so ' + RT + '50 &asymp; 7.1.</li></ol></div>' +
'<div class="lab"><span class="lt">Try it: squeeze a root</span>' +
'<div class="ctrl"><label for="rtn">Number: <output id="rto"></output><input type="range" id="rtn" min="2" max="400" value="30"></label></div>' +
'<div class="fig" id="rtfig"></div><div class="out" id="rtout"></div></div>' +
A.yt({ q: RT + '30 is between which two whole numbers?', opts: ['5 and 6', '4 and 5', '6 and 7', '15 and 16'], a: 0, back: 'Go back to step 1: find the perfect squares on each side of 30. Which squares are just below and just above it?', ok: '25 &lt; 30 &lt; 36, so ' + RT + '30 is between 5 and 6. It is about 5.5.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>' + RT + '30 is not 15. Halving is not the same as taking a square root. Check: 15 &times; 15 = 225, far more than 30.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Rational and irrational numbers</h2>' +
'<p>A <b>rational number</b> can be written as a fraction of two integers, like 3/4 or &minus;5/1. As a decimal, it either ends (0.75) or repeats (0.333&hellip;).</p>' +
'<p>An <b>irrational number</b> cannot be written as a fraction. Its decimal goes on forever with no repeating pattern. Square roots of numbers that are not perfect squares are irrational.</p>' +
'<div class="fig">' + diagonal() + '</div>' +
'<p>Together, rational and irrational numbers make the <b>real numbers</b>.</p>' +
'<div class="lab"><span class="lt">Try it: where does it belong?</span><p style="margin-top:0">Pick a number. The smallest box it fits in lights up.</p>' +
'<div class="btnrow" id="rsbtn">' + SORT.map(function (x, i) { return '<button type="button" class="btn alt" data-i="' + i + '" aria-pressed="false">' + x.t + '</button>'; }).join('') + '</div>' +
'<div class="fig" id="rsfig"></div><div class="out" id="rsout" aria-live="polite"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>&pi; is not 3.14 or 22/7. Those are rational numbers <b>close to</b> &pi;. And 0.333&hellip; is rational, even though it goes on forever, because it repeats.</p></div>' +
A.yt({ q: 'Which number is irrational?', opts: [RT + '49', '0.25', RT + '10', '&minus;4'], a: 2, back: 'Work out any square roots first. Then ask: does the decimal end or repeat? If not, it is irrational.', ok: '10 is not a perfect square, so ' + RT + '10 = 3.162 27&hellip; never ends or repeats. ' + RT + '49 = 7 is rational.' }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Comparing and ordering real numbers</h2>' +
'<p>To compare a mix of fractions, decimals and roots, change them all to decimals with the same number of places. Then place them on a number line.</p>' +
'<div class="fig">' + realLine(3, 3.3, [{ v: 3.1, t: '3.1' }, { v: Math.PI, t: '&#960;', say: 'pi' }, { v: Math.sqrt(10), t: '&#8730;10', say: 'root 10' }, { v: 19 / 6, t: '19/6' }]) + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Order from least to greatest: ' + RT + '10, 3.1, &pi;, 19/6.</p><ol><li>Change each to a decimal: ' + RT + '10 &asymp; 3.162, 3.1 = 3.100, &pi; &asymp; 3.142, 19/6 &asymp; 3.167.</li><li>Compare digit by digit: 3.100 &lt; 3.142 &lt; 3.162 &lt; 3.167.</li><li>Order: 3.1, &pi;, ' + RT + '10, 19/6.</li></ol></div>' +
A.yt({ q: 'Which is greater?', opts: [RT + '20', '4.5'], a: 1, back: 'Change ' + RT + '20 to a decimal first: it is between 4 and 5, because 16 &lt; 20 &lt; 25. Then square 4.5 to compare.', ok: '4.5' + SQ + ' = 20.25, which is more than 20. So 4.5 &gt; ' + RT + '20 &asymp; 4.47.' }) +
'<div class="key"><b class="t">Key idea</b><p>You can compare a root and a decimal by squaring both. If a&sup2; &gt; b&sup2; (and both are positive), then a &gt; b.</p></div>' +
'</section>';

  var NS = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 65, 66, 67, 68, 69, 70, 72, 75, 78, 80, 82, 85, 88, 90, 95, 98, 99];
  var practice = [
    { id: 'rr-square', name: 'Square a number', code: 'B2.2', gen: function (lv) {
      var n, shown, ans, fig = '';
      if (lv === 1) { n = R.int(2, 12); ans = n * n; shown = String(n); fig = square(n); }
      else if (lv === 2) { n = R.int(13, 20); ans = n * n; shown = String(n); }
      else {
        var t = R.int(0, 2);
        if (t === 0) { n = R.int(2, 9); ans = Math.round(n * n) / 100; shown = '0.' + n; }
        else if (t === 1) { n = R.int(2, 9); ans = n * n * 100; shown = String(n * 10); }
        else { var a = R.int(1, 4), b = R.int(a + 1, 9); while (A.gcd(a, b) > 1) b++; ans = a * a / (b * b); shown = '(' + a + '/' + b + ')';
          return { q: 'Work out <span class="math">' + shown + SQ + '</span>. Type a fraction like 4/9.', type: 'num', answer: ans, show: a * a + '/' + b * b,
            hint: 'Square the top and square the bottom.', steps: ['Squaring a fraction: (' + a + '/' + b + ') &times; (' + a + '/' + b + ').', 'Top: ' + a + ' &times; ' + a + ' = ' + a * a + '. Bottom: ' + b + ' &times; ' + b + ' = ' + b * b + '.', 'The answer is ' + a * a + '/' + b * b + '.'], explain: '(' + a + '/' + b + ')' + SQ + ' = ' + a * a + '/' + b * b + '.' };
        }
      }
      var sh = A.fmt(String(ans));
      return { q: 'Work out <span class="math">' + shown + SQ + '</span>.', type: 'num', answer: ans, show: sh, fig: fig,
        hint: 'Squaring means ' + shown + ' &times; ' + shown + ', not ' + shown + ' &times; 2.',
        steps: [shown + SQ + ' means ' + shown + ' &times; ' + shown + '.', shown.indexOf('.') >= 0 ? n + ' &times; ' + n + ' = ' + n * n + '. Each 0.' + n + ' has one decimal place, so the answer has two.' : shown.length > 2 && shown.slice(-1) === '0' ? n + ' &times; ' + n + ' = ' + n * n + ', then add the two zeros from the two tens.' : 'Multiply: ' + shown + ' &times; ' + shown + ' = ' + sh + '.', shown + SQ + ' = ' + sh + '.'],
        explain: shown + ' &times; ' + shown + ' = ' + sh + '.' };
    } },
    { id: 'rr-root', name: 'Square roots', code: 'B2.2', gen: function (lv) {
      var n = lv === 1 ? R.int(1, 12) : R.int(11, 20);
      if (lv === 3) {
        var t = R.int(0, 1);
        if (t === 0) { var d = R.int(2, 9); return { q: 'What is <span class="math">' + RT + '0.' + ('0' + d * d).slice(-2) + '</span>?', type: 'num', answer: d / 10, show: '0.' + d,
          hint: 'Which decimal times itself makes 0.' + ('0' + d * d).slice(-2) + '? Think of ' + RT + d * d + ' first.', steps: [RT + d * d + ' = ' + d + '.', '0.' + d + ' &times; 0.' + d + ' = 0.' + ('0' + d * d).slice(-2) + ' (two decimal places).', 'So ' + RT + '0.' + ('0' + d * d).slice(-2) + ' = 0.' + d + '.'], explain: '0.' + d + SQ + ' = 0.' + ('0' + d * d).slice(-2) + '.' }; }
        var a = R.int(1, 8), b = R.int(a + 1, 12); while (A.gcd(a, b) > 1) b++;
        return { q: 'What is <span class="math">' + RT + '(' + a * a + '/' + b * b + ')</span>? Type a fraction.', type: 'num', answer: a / b, show: a + '/' + b,
          hint: 'Take the square root of the top and of the bottom.', steps: [RT + a * a + ' = ' + a + '.', RT + b * b + ' = ' + b + '.', 'So the root is ' + a + '/' + b + '. Check: (' + a + '/' + b + ')' + SQ + ' = ' + a * a + '/' + b * b + '.'], explain: RT + '(' + a * a + '/' + b * b + ') = ' + a + '/' + b + '.' };
      }
      var ctx = lv === 2 && R.int(0, 1);
      return { q: ctx ? 'A square room has an area of ' + n * n + ' m' + SQ + '. How long is each wall?' : 'What is <span class="math">' + RT + n * n + '</span>?', type: 'num', answer: n, unit: ctx ? 'm' : '', fig: lv === 1 ? square(n).replace(/<text[^>]*>\d+<\/text>(?=<text[^>]*>\d+<\/text><text[^>]*>area)/, '') : '',
        hint: 'Which whole number times itself makes ' + n * n + '?', steps: ['You need a number that, times itself, makes ' + n * n + '.', n + ' &times; ' + n + ' = ' + n * n + '.', 'So ' + RT + n * n + ' = ' + n + '.'], explain: n + SQ + ' = ' + n * n + ', so ' + RT + n * n + ' = ' + n + '.' };
    } },
    { id: 'rr-estimate', name: 'Estimate a square root', code: 'B1.3', gen: function (lv) {
      var n = lv === 1 ? R.pick(NS.filter(function (x) { return x < 100; })) : R.int(2, 399);
      while (Math.sqrt(n) % 1 === 0) n++;
      var a = Math.floor(Math.sqrt(n)), v = Math.sqrt(n);
      var stepsBase = ['Perfect squares on each side: ' + a * a + ' &lt; ' + n + ' &lt; ' + (a + 1) * (a + 1) + '.', 'So ' + RT + n + ' is between ' + a + ' and ' + (a + 1) + '.'];
      if (lv === 1) {
        var o = R.mc(a + ' and ' + (a + 1), [(a - 1) + ' and ' + a, (a + 1) + ' and ' + (a + 2), Math.floor(n / 2) + ' and ' + (Math.floor(n / 2) + 1)].filter(function (x) { return x.indexOf('0 and') !== 0; }));
        return { q: '<span class="math">' + RT + n + '</span> is between which two whole numbers?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Find the perfect squares just below and just above ' + n + '.', steps: stepsBase.concat(['It is about ' + r1(v) + '.']), fig: rootLine(n), explain: a * a + ' &lt; ' + n + ' &lt; ' + (a + 1) * (a + 1) + ', so ' + RT + n + ' is between ' + a + ' and ' + (a + 1) + '.' };
      }
      if (lv === 2) {
        var right = r1(v), cand = [right - 0.3, right + 0.3, right - 0.6, right + 0.6].map(function (x) { return r1(x); }).filter(function (x) { return x > 0; });
        var o2 = R.mc(right.toFixed(1), cand.map(function (x) { return x.toFixed(1); }));
        return { q: 'Which is the best estimate of <span class="math">' + RT + n + '</span>?', type: 'mc', options: o2.options, answer: o2.answer,
          hint: 'Find the perfect squares on each side, then decide if ' + n + ' is nearer the lower one or the upper one.',
          steps: stepsBase.concat([n + ' is ' + (n - a * a) + ' above ' + a * a + ' and ' + ((a + 1) * (a + 1) - n) + ' below ' + (a + 1) * (a + 1) + '.', 'Check: ' + right.toFixed(1) + SQ + ' = ' + r2(right * right) + ', which is closest to ' + n + '.']), explain: RT + n + ' &asymp; ' + v.toFixed(3) + ', so ' + right.toFixed(1) + ' is the best estimate.' };
      }
      return { q: 'A square tile has an area of ' + n + ' cm' + SQ + '. Estimate its side length to one decimal place.', type: 'num', answer: r1(v), tol: 0.1001, unit: 'cm', show: r1(v).toFixed(1) + ' cm',
        hint: 'The side is ' + RT + n + '. Find the perfect squares on each side first. Answers within 0.1 count.', steps: stepsBase.concat(['Try a decimal and square it to check, for example ' + r1(v).toFixed(1) + SQ + ' = ' + r2(r1(v) * r1(v)) + '.', 'The side is about ' + r1(v).toFixed(1) + ' cm.']), explain: RT + n + ' = ' + v.toFixed(3) + '&hellip;, about ' + r1(v).toFixed(1) + ' cm.' };
    } },
    { id: 'rr-classify', name: 'Rational or irrational', code: 'B1.2', gen: function (lv) {
      var items;
      if (lv === 1) items = [['3/4', 1, 'It is a fraction of two integers.'], ['&radic;2', 0, '2 is not a perfect square, so &radic;2 never ends or repeats.'], ['&pi;', 0, '&pi; never ends and never repeats.'], ['0.5', 1, '0.5 = 1/2, a decimal that ends.'], ['&minus;8', 1, '&minus;8 = &minus;8/1.'], ['&radic;3', 0, '3 is not a perfect square.'], ['12', 1, '12 = 12/1.']];
      else if (lv === 2) items = [['&radic;64', 1, '&radic;64 = 8.'], ['&radic;15', 0, '15 is not a perfect square.'], ['&radic;121', 1, '&radic;121 = 11.'], ['&radic;50', 0, '50 is not a perfect square.'], ['0.666&hellip;', 1, 'It repeats, and equals 2/3.'], ['&radic;0.36', 1, '&radic;0.36 = 0.6.'], ['&radic;8', 0, '8 is not a perfect square.'], ['2.75', 1, '2.75 = 11/4.']];
      else items = [['1.010 010 001&hellip; (one more 0 each time)', 0, 'The pattern grows, so no block of digits repeats.'], ['0.121 212&hellip;', 1, 'The block 12 repeats, so it is 12/99 = 4/33.'], ['&radic;(9/16)', 1, '&radic;(9/16) = 3/4.'], ['22/7', 1, '22/7 is a fraction. It is close to &pi;, but it is not &pi;.'], ['&radic;40', 0, '40 is not a perfect square.'], ['&pi; &divide; 2', 0, 'Half of an irrational number is still irrational.'], ['&minus;&radic;25', 1, '&minus;&radic;25 = &minus;5.']];
      var it = R.pick(items), right = it[1] ? 'Rational' : 'Irrational';
      return { q: 'Is <span class="math">' + it[0] + '</span> rational or irrational?', type: 'mc', options: ['Rational', 'Irrational'], answer: it[1] ? 0 : 1,
        hint: 'If there is a root, work it out first. Then ask: can it be written as a fraction, or does the decimal end or repeat?',
        steps: ['Simplify first if you can.', 'Rational: a fraction of integers, or a decimal that ends or repeats. Irrational: never ends, never repeats.', it[2] + ' So it is ' + right.toLowerCase() + '.'], explain: it[2] + ' It is ' + right.toLowerCase() + '.' };
    } },
    { id: 'rr-order', name: 'Compare and order', code: 'B1.2', gen: function (lv) {
      var base = R.int(2, 8), pool = [];
      var sq = base * base + R.int(1, 2 * base);
      pool.push({ t: RT + sq, v: Math.sqrt(sq) });
      pool.push({ t: String(r1(Math.sqrt(sq) + R.pick([-0.2, -0.1, 0.1, 0.2, 0.3]))), v: 0 }); pool[1].v = +pool[1].t;
      var d = R.pick([3, 4, 5, 6, 8]), nn = Math.round(Math.sqrt(sq) * d) + R.pick([-1, 1]); pool.push({ t: nn + '/' + d, v: nn / d });
      if (base === 3) pool.push({ t: '&pi;', v: Math.PI });
      else pool.push({ t: base + '.5', v: base + 0.5 });
      pool = pool.filter(function (p, i) { return pool.findIndex(function (q) { return Math.abs(q.v - p.v) < 1e-9; }) === i; });
      if (lv < 3) {
        var two = R.shuffle(pool).slice(0, 2), ask = R.pick(['greater', 'less']), gi = two[0].v > two[1].v ? 0 : 1, ans = ask === 'greater' ? gi : 1 - gi;
        return { q: 'Which is <b>' + ask + '</b>?', type: 'mc', options: two.map(function (p) { return p.t; }), answer: ans,
          hint: 'Change both to decimals with three places, then compare.', steps: ['As decimals: ' + two.map(function (p) { return p.t + ' &asymp; ' + p.v.toFixed(3); }).join(' and ') + '.', 'Compare place by place.', two[ans].t + ' is ' + ask + '.'],
          fig: lv === 1 ? realLine(Math.floor(Math.min(two[0].v, two[1].v)), Math.floor(Math.min(two[0].v, two[1].v)) + 1 + (Math.max(two[0].v, two[1].v) >= Math.floor(Math.min(two[0].v, two[1].v)) + 1 ? 1 : 0), two.map(function (p) { return { v: p.v, t: p.t }; })) : '',
          explain: two.map(function (p) { return p.t + ' &asymp; ' + p.v.toFixed(3); }).join(', ') + '. So ' + two[ans].t + ' is ' + ask + '.' };
      }
      var srt = pool.slice().sort(function (a, b) { return a.v - b.v; }), right = srt.map(function (p) { return p.t; }).join(', ');
      var o = R.mc(right, [srt.slice().reverse().map(function (p) { return p.t; }).join(', '), R.shuffle(srt).map(function (p) { return p.t; }).join(', '), R.shuffle(srt).map(function (p) { return p.t; }).join(', ')]);
      return { q: 'Order from <b>least to greatest</b>: ' + R.shuffle(pool).map(function (p) { return p.t; }).join('; '), type: 'mc', options: o.options, answer: o.answer,
        hint: 'Write every number as a decimal with three places first.', steps: ['As decimals: ' + srt.map(function (p) { return p.t + ' &asymp; ' + p.v.toFixed(3); }).join(', ') + '.', 'Order: ' + right + '.'], explain: 'In order: ' + srt.map(function (p) { return p.v.toFixed(3); }).join(' &lt; ') + '.' };
    } }
  ];

  var quiz = [
    { q: 'What is 15' + SQ + '?', type: 'num', answer: 225, hint: '15' + SQ + ' means 15 &times; 15.', explain: '15 &times; 15 = 225.' },
    { q: 'A square poster has an area of 144 cm' + SQ + '. How long is each side?', type: 'num', answer: 12, unit: 'cm', hint: 'The side is the square root of the area.', explain: RT + '144 = 12, because 12 &times; 12 = 144.' },
    { q: RT + '75 is between which two whole numbers?', type: 'mc', options: ['8 and 9', '7 and 8', '37 and 38', '9 and 10'], answer: 0, hint: 'Find the perfect squares just below and just above 75.', explain: '64 &lt; 75 &lt; 81, so ' + RT + '75 is between 8 and 9 (about 8.66).' },
    { q: 'Which is the best estimate of ' + RT + '40?', type: 'mc', options: ['6.3', '6.8', '7.3', '20'], answer: 0, hint: '36 &lt; 40 &lt; 49. Is 40 nearer 36 or 49?', explain: RT + '40 &asymp; 6.32. Check: 6.3' + SQ + ' = 39.69.' },
    { q: 'Which number is irrational?', type: 'mc', options: ['&radic;36', '&minus;2.5', '&radic;7', '1/3'], answer: 2, hint: 'Simplify the roots first. Which one does not come out to a fraction or a decimal that ends or repeats?', explain: '7 is not a perfect square, so &radic;7 = 2.645 75&hellip; never ends or repeats. &radic;36 = 6.' },
    { q: 'What is ' + RT + '0.49?', type: 'num', answer: 0.7, hint: 'Which decimal times itself is 0.49? Think of ' + RT + '49.', explain: '0.7 &times; 0.7 = 0.49, so ' + RT + '0.49 = 0.7.' },
    { q: 'Which list is in order from least to greatest?', type: 'mc', options: ['&radic;5, 2.3, 7/3, &pi;', '2.3, &radic;5, 7/3, &pi;', '&radic;5, 7/3, 2.3, &pi;', '&pi;, 7/3, 2.3, &radic;5'], answer: 0, hint: 'Change each to a decimal: &radic;5, 7/3 and &pi; all need working out.', explain: '&radic;5 &asymp; 2.236, 2.3 = 2.300, 7/3 &asymp; 2.333, &pi; &asymp; 3.142.' }
  ];

  A.register('roots-real', {
    html: html, practice: practice, quiz: quiz,
    init: function (root) {
      var $ = function (s) { return A.$(s, root); };
      A.bind(root, ['sqn'], function () {
        var n = +$('#sqn').value;
        $('#sqo').textContent = n; $('#sqfig').innerHTML = square(n);
        $('#sqout').innerHTML = '<span class="big">' + n + '<sup>2</sup> = ' + n + ' &times; ' + n + ' = ' + n * n + '</span><br>So &radic;' + n * n + ' = ' + n + '. The side of a square with area ' + n * n + ' is ' + n + '.';
      });
      A.bind(root, ['rtn'], function () {
        var n = +$('#rtn').value, a = Math.floor(Math.sqrt(n)), v = Math.sqrt(n), est = r1(v);
        $('#rto').textContent = n;
        if (a * a === n) {
          $('#rtfig').innerHTML = square(a);
          $('#rtout').innerHTML = '<span class="big">&radic;' + n + ' = ' + a + '</span><br>' + n + ' is a perfect square, so its root is a whole number.';
          return;
        }
        $('#rtfig').innerHTML = rootLine(n);
        $('#rtout').innerHTML = '<span class="big">&radic;' + n + ' &asymp; ' + est.toFixed(1) + '</span><br>' + a * a + ' &lt; ' + n + ' &lt; ' + (a + 1) * (a + 1) + ', so the root is between ' + a + ' and ' + (a + 1) + '.<br>Check: ' + est.toFixed(1) + ' &times; ' + est.toFixed(1) + ' = ' + r2(est * est) + '. A calculator gives ' + v.toFixed(4) + '&hellip;';
      });
      var cur = -1;
      function show() {
        A.$$('#rsbtn .btn', root).forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-i') === cur)); });
        $('#rsfig').innerHTML = nested(cur < 0 ? '' : SORT[cur].k, cur < 0 ? null : 'The real number system with the ' + SETS.filter(function (x) { return x.k === SORT[cur].k; })[0].t + ' box highlighted.');
        $('#rsout').innerHTML = cur < 0 ? 'Pick a number above.' : '<b>' + SORT[cur].t + '</b>: ' + SORT[cur].w;
      }
      A.$$('#rsbtn .btn', root).forEach(function (b) { b.addEventListener('click', function () { cur = +b.getAttribute('data-i'); show(); }); });
      show();
    }
  });
})();
