(function () {
  var A = Atlas, R = A.R, N = A.neg;
  function P(n) { return n < 0 ? '(' + N(n) + ')' : String(n); }

  /* counters: positives are filled circles marked +, negatives are hollow red marked −.
     pairs: how many zero pairs to cross out. */
  function counters(pos, neg, pairs, label) {
    var r = 15, gap = 36, perRow = 9, s = '', y0 = 22, rows = 0;
    function one(x, y, sign, crossed) {
      var h = sign > 0
        ? '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:var(--hi);stroke:#7a5a00" stroke-width="1.5"/><text x="' + x + '" y="' + (y + 7) + '" text-anchor="middle" font-size="22" font-weight="700" style="fill:#3a2a00">+</text>'
        : '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:color-mix(in srgb,var(--bad) 18%,var(--card));stroke:var(--bad)" stroke-width="2"/><text x="' + x + '" y="' + (y + 7) + '" text-anchor="middle" font-size="22" font-weight="700" style="fill:var(--bad)">&#8722;</text>';
      if (crossed) h += '<line x1="' + (x - r) + '" y1="' + (y - r) + '" x2="' + (x + r) + '" y2="' + (y + r) + '" style="stroke:var(--ink2)" stroke-width="2"/>';
      return h;
    }
    pairs = pairs || 0;
    /* paired counters stacked top (+) and bottom (−) */
    var i, x;
    for (i = 0; i < pairs; i++) {
      x = 22 + (i % perRow) * gap; var y = y0 + Math.floor(i / perRow) * 84;
      s += one(x, y, 1, true) + one(x, y + 36, -1, true);
      s += '<rect x="' + (x - r - 3) + '" y="' + (y - r - 3) + '" width="' + (2 * r + 6) + '" height="' + (36 + 2 * r + 6) + '" rx="10" fill="none" style="stroke:var(--ink2)" stroke-dasharray="3 3"/>';
    }
    var used = pairs ? Math.ceil(pairs / perRow) * 84 : 0, left = [];
    for (i = 0; i < pos - pairs; i++) left.push(1);
    for (i = 0; i < neg - pairs; i++) left.push(-1);
    left.forEach(function (sg, k) { s += one(22 + (k % perRow) * gap, y0 + used + Math.floor(k / perRow) * gap, sg, false); });
    rows = used + (left.length ? Math.ceil(left.length / perRow) * gap : 0);
    var H = Math.max(rows + 8, 44);
    return A.svg(Math.max(120, 22 + Math.min(perRow, Math.max(pairs, left.length, 1)) * gap), H, s, label || pos + ' positive and ' + neg + ' negative counters');
  }
  /* number line from lo to hi with a jump from a by b */
  function jump(a, b, lo, hi, label) {
    lo = lo === undefined ? Math.min(-10, a, a + b) : lo; hi = hi === undefined ? Math.max(10, a, a + b) : hi;
    var x0 = 16, x1 = 384, s = '', n = hi - lo;
    function X(v) { return x0 + (x1 - x0) * (v - lo) / n; }
    s += '<defs><marker id="ija" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>';
    s += '<line x1="' + x0 + '" y1="80" x2="' + x1 + '" y2="80" style="stroke:var(--ink)" stroke-width="2"/>';
    var step = n > 24 ? 5 : n > 12 ? 2 : 1;
    for (var k = lo; k <= hi; k++) {
      s += '<line x1="' + X(k) + '" y1="' + (k === 0 ? 70 : 75) + '" x2="' + X(k) + '" y2="' + (k === 0 ? 90 : 85) + '" style="stroke:var(--ink)" stroke-width="' + (k === 0 ? 2.5 : 1.3) + '"/>';
      if (k % step === 0) s += '<text x="' + X(k) + '" y="110" text-anchor="middle" font-size="16"' + (k === 0 ? ' class="tb"' : '') + '>' + (k < 0 ? '−' + -k : k) + '</text>';
    }
    if (b !== 0) {
      var xa = X(a), xb = X(a + b), top = 80 - Math.min(52, 16 + Math.abs(xb - xa) * 0.3);
      s += '<path d="M' + xa + ' 74 Q' + ((xa + xb) / 2) + ' ' + top + ' ' + xb + ' 74" fill="none" style="stroke:var(--accent)" stroke-width="2.5" marker-end="url(#ija)"/>';
      s += '<text x="' + Math.max(30, Math.min(370, (xa + xb) / 2)) + '" y="' + (top + 10) + '" text-anchor="middle" font-size="17" class="tb" style="fill:var(--accent)">' + (b > 0 ? '+' : '−') + Math.abs(b) + '</text>';
    }
    s += '<circle cx="' + X(a) + '" cy="80" r="6" style="fill:var(--ink)"/><circle cx="' + X(a + b) + '" cy="80" r="7" style="fill:var(--accent)"/>';
    return A.svg(400, 118, s, label || 'Start at ' + a + ' and move ' + Math.abs(b) + (b > 0 ? ' right' : ' left') + ' to land on ' + (a + b) + '.');
  }
  /* thermometer showing a temperature in °C */
  function thermo(t, t2) {
    var s = '', lo = -20, hi = 20, top = 16, bot = 216;
    function Y(v) { return bot - (bot - top) * (v - lo) / (hi - lo); }
    s += '<rect x="44" y="' + (top - 6) + '" width="22" height="' + (bot - top + 12) + '" rx="11" style="fill:var(--card);stroke:var(--ink2)" stroke-width="2"/>';
    s += '<rect x="49" y="' + Y(t) + '" width="12" height="' + (bot - Y(t) + 4) + '" style="fill:var(--bad)"/><circle cx="55" cy="' + (bot + 16) + '" r="16" style="fill:var(--bad);stroke:var(--ink2)" stroke-width="2"/>';
    for (var v = lo; v <= hi; v += 5) s += '<line x1="66" y1="' + Y(v) + '" x2="' + (v % 10 ? 74 : 80) + '" y2="' + Y(v) + '" style="stroke:var(--ink)" stroke-width="1.5"/>' + (v % 10 === 0 ? '<text x="86" y="' + (Y(v) + 6) + '" font-size="17"' + (v === 0 ? ' class="tb"' : '') + '>' + (v < 0 ? '−' + -v : v) + '&#176;</text>' : '');
    s += '<text x="132" y="' + (Y(t) + 6) + '" font-size="18" class="tb" style="fill:var(--bad)">&#8592; ' + (t < 0 ? '−' + -t : t) + '&#176;C now</text>';
    if (t2 !== undefined) s += '<text x="132" y="' + (Y(t2) + 6) + '" font-size="18" class="tb">&#8592; ' + t2 + '&#176;C at noon</text><line x1="128" y1="' + (Y(t) - 4) + '" x2="128" y2="' + (Y(t2) + 4) + '" style="stroke:var(--accent)" stroke-width="3"/><text x="140" y="' + ((Y(t) + Y(t2)) / 2 + 6) + '" font-size="17" class="tb" style="fill:var(--accent)">rise of ' + (t2 - t) + '&#176;</text>';
    return A.svg(320, 250, s, 'A thermometer showing ' + t + ' degrees Celsius' + (t2 !== undefined ? ' rising to ' + t2 + ' degrees at noon, a rise of ' + (t2 - t) + ' degrees.' : '.'));
  }
  /* pattern: a × b for b from 3 down to -3, shown as a table and as dots on a line */
  function pattern(a) {
    var s = '', rows = [3, 2, 1, 0, -1, -2, -3], x0 = 180, x1 = 390, lo = -15, hi = 15;
    function X(v) { return x0 + (x1 - x0) * (v - lo) / (hi - lo); }
    s += '<line x1="' + X(0) + '" y1="4" x2="' + X(0) + '" y2="' + (rows.length * 32 + 4) + '" style="stroke:var(--ink2)" stroke-dasharray="4 3"/>';
    rows.forEach(function (b, i) {
      var y = 24 + i * 32, p = a * b, col = p > 0 ? 'var(--strand)' : p < 0 ? 'var(--bad)' : 'var(--ink2)';
      s += '<text x="8" y="' + y + '" font-size="18">' + P(a).replace('&minus;', '−') + ' &#215; ' + P(b).replace('&minus;', '−') + '</text><text x="118" y="' + y + '" font-size="18" class="tb" style="fill:' + col + '">= ' + (p < 0 ? '−' + -p : p) + '</text>';
      s += '<line x1="' + X(0) + '" y1="' + (y - 6) + '" x2="' + X(p) + '" y2="' + (y - 6) + '" style="stroke:' + col + '" stroke-width="10" stroke-linecap="round" opacity=".85"/>';
    });
    s += '<text x="' + X(-12) + '" y="' + (rows.length * 32 + 22) + '" text-anchor="middle" font-size="15" class="t2">negative</text><text x="' + X(12) + '" y="' + (rows.length * 32 + 22) + '" text-anchor="middle" font-size="15" class="t2">positive</text>';
    return A.svg(400, rows.length * 32 + 30, s, 'The products of ' + a + ' times 3, 2, 1, 0, negative 1, negative 2 and negative 3 are ' + rows.map(function (b) { return a * b; }).join(', ') + '. Each step down changes the product by ' + Math.abs(a) + '.');
  }
  function signGrid() {
    var s = '', c = [['+', '+', '+'], ['+', '−', '−'], ['−', '+', '−'], ['−', '−', '+']];
    s += '<text x="200" y="24" text-anchor="middle" font-size="17" class="t2">first number &#215; or &#247; second number</text>';
    c.forEach(function (r, i) {
      var x = 10 + (i % 2) * 194, y = 40 + Math.floor(i / 2) * 76, pos = r[2] === '+';
      s += '<rect x="' + x + '" y="' + y + '" width="186" height="66" rx="4" style="fill:color-mix(in srgb,' + (pos ? 'var(--strand)' : 'var(--bad)') + ' 12%,var(--card));stroke:' + (pos ? 'var(--strand)' : 'var(--bad)') + '" stroke-width="1.5"/>' +
        '<text x="' + (x + 93) + '" y="' + (y + 30) + '" text-anchor="middle" font-size="20" class="tb">(' + r[0] + ') and (' + r[1] + ')</text>' +
        '<text x="' + (x + 93) + '" y="' + (y + 56) + '" text-anchor="middle" font-size="18">gives ' + (pos ? 'positive' : 'negative') + '</text>';
    });
    return A.svg(400, 196, s, 'Sign rules for multiplying and dividing. Positive and positive gives positive. Positive and negative gives negative. Negative and positive gives negative. Negative and negative gives positive.');
  }
  function addModel(a, b) {
    var pos = Math.max(a, 0) + Math.max(b, 0), neg = Math.max(-a, 0) + Math.max(-b, 0), pairs = Math.min(pos, neg);
    return counters(pos, neg, pairs, P(a) + ' plus ' + P(b) + '. ' + pairs + ' zero pairs cancel. ' + (pos - pairs ? (pos - pairs) + ' positive' : neg - pairs ? (neg - pairs) + ' negative' : 'Nothing') + ' counters are left, so the sum is ' + (a + b) + '.');
  }

  var html =
'<section class="sec"><h2><span class="n">1</span>Integers and zero pairs</h2>' +
'<p><b>Integers</b> are the whole numbers and their opposites: &hellip;, &minus;3, &minus;2, &minus;1, 0, 1, 2, 3, &hellip;. In Canada we meet them every winter.</p>' +
'<div class="fig">' + thermo(-8, 5) + '</div>' +
'<p>We can show integers with counters. A yellow <b>+</b> counter is +1. A red <b>&minus;</b> counter is &minus;1. One of each makes a <b>zero pair</b>, because +1 + (&minus;1) = 0.</p>' +
'<div class="fig">' + counters(5, 2, 2, 'Five positive and two negative counters. Two zero pairs are crossed out. Three positive counters are left, so the counters show positive 3.') + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>What number do 5 positive and 2 negative counters show?</p><ol><li>Match each negative with a positive to make zero pairs: 2 pairs.</li><li>Cross out the zero pairs. They are worth 0.</li><li>3 positive counters are left. The counters show +3.</li></ol></div>' +
A.yt({ q: 'What number do 3 positive and 7 negative counters show?', a: -4, back: 'Go back to step 1: make as many zero pairs as you can, then count what is left. Is it positive or negative?', ok: '3 zero pairs cancel. 4 negative counters are left, so it is &minus;4.' }) +
'<div class="key"><b class="t">Key idea</b><p>Adding a zero pair never changes a number. That one fact explains every rule in this chapter.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Adding integers</h2>' +
'<p>On a number line, adding a positive moves you <b>right</b>. Adding a negative moves you <b>left</b>.</p>' +
'<div class="fig">' + jump(-7, 4, -10, 5) + '</div>' +
'<div class="tbl"><table><thead><tr><th class="l">If the signs are&hellip;</th><th class="l">then</th><th class="l">Example</th></tr></thead><tbody>' +
'<tr><td class="l">the same</td><td class="l">add the sizes, keep the sign</td><td class="l math">(&minus;6) + (&minus;5) = &minus;11</td></tr>' +
'<tr><td class="l">different</td><td class="l">subtract the sizes, take the sign of the bigger size</td><td class="l math">(&minus;7) + 4 = &minus;3</td></tr></tbody></table></div>' +
'<div class="lab"><span class="lt">Try it: counters and number line</span>' +
'<div class="ctrl"><label for="iaa">First: <output id="iaao"></output><input type="range" id="iaa" min="-9" max="9" value="-7"></label>' +
'<label for="iop">Operation<select id="iop"><option value="+">add +</option><option value="-">subtract &minus;</option></select></label>' +
'<label for="iab">Second: <output id="iabo"></output><input type="range" id="iab" min="-9" max="9" value="4"></label></div>' +
'<div class="fig" id="iafig"></div><div class="fig" id="ialine"></div><div class="out" id="iaout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Work out (&minus;7) + 4.</p><ol><li>The signs are different, so subtract the sizes: 7 &minus; 4 = 3.</li><li>The bigger size is 7, and it is negative, so the answer is negative.</li><li>(&minus;7) + 4 = &minus;3. On the line: start at &minus;7 and move 4 right.</li></ol></div>' +
A.yt({ q: 'Work out (&minus;6) + (&minus;5).', a: -11, back: 'Look at the table: the signs are the same, so add the sizes and keep the sign.', ok: 'Both are negative: 6 + 5 = 11, so the sum is &minus;11.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>(&minus;7) + 4 is not &minus;11. Adding a positive moves you right, toward zero, so the answer must be bigger than &minus;7.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Subtracting integers</h2>' +
'<p>To subtract an integer, <b>add its opposite</b>. Change the subtraction to addition and flip the sign of the second number.</p>' +
'<p style="font-size:1.15rem;text-align:center;max-width:none"><span class="math">3 &minus; (&minus;5) = 3 + 5 = 8</span><br><span class="math">&minus;2 &minus; 6 = &minus;2 + (&minus;6) = &minus;8</span></p>' +
'<div class="fig">' + jump(3, 5, -4, 10, 'Three minus negative five is the same as three plus five. Start at 3 and move 5 right to land on 8.') + '</div>' +
'<p>Why it works: to take away &minus;5 from 3, you need five &minus; counters to remove. Add five zero pairs (that does not change 3), then take the five &minus; counters away. Five + counters are left behind, so the answer goes up by 5.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>At 7 a.m. it was &minus;8&deg;C. At noon it was 5&deg;C. How much did it warm up?</p><ol><li>Change = later &minus; earlier = 5 &minus; (&minus;8).</li><li>Add the opposite: 5 + 8.</li><li>It warmed up by 13&deg;C. The thermometer above shows the same rise.</li></ol></div>' +
A.yt({ q: 'Work out &minus;2 &minus; 6.', a: -8, back: 'Change it to adding the opposite: &minus;2 + (&minus;6). Then use the addition rule for the same signs.', ok: '&minus;2 &minus; 6 = &minus;2 + (&minus;6) = &minus;8.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>Only flip the <b>second</b> number. In &minus;4 &minus; (&minus;9), the first number stays &minus;4: &minus;4 + 9 = 5.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Multiplying integers</h2>' +
'<p>3 &times; (&minus;4) means three groups of &minus;4: (&minus;4) + (&minus;4) + (&minus;4) = &minus;12. Follow the pattern below to see what a negative times a negative must be.</p>' +
'<div class="lab"><span class="lt">Try it: follow the pattern</span>' +
'<div class="ctrl"><label for="imp">First number: <output id="impo"></output><input type="range" id="imp" min="-5" max="5" value="-4"></label></div>' +
'<div class="fig" id="impfig"></div><div class="out" id="impout"></div></div>' +
'<div class="fig">' + signGrid() + '</div>' +
'<div class="eg"><b class="t">Worked example</b><p>Work out (&minus;4) &times; (&minus;6).</p><ol><li>Multiply the sizes: 4 &times; 6 = 24.</li><li>Count the negative signs: two. Same signs give a positive.</li><li>(&minus;4) &times; (&minus;6) = 24.</li></ol></div>' +
A.yt({ q: 'Work out (&minus;7) &times; 3.', a: -21, back: 'Go back to step 2: multiply the sizes, then count the negative signs. One negative sign gives a negative answer.', ok: '7 &times; 3 = 21, and the signs are different, so the answer is &minus;21.' }) +
'<div class="key"><b class="t">Key idea</b><p>Count the negative signs when you multiply several integers. An even number of them gives a positive answer. An odd number gives a negative.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Dividing integers and putting it together</h2>' +
'<p>Division follows the same sign rules, because division undoes multiplication. Since (&minus;6) &times; 8 = &minus;48, we know &minus;48 &divide; 8 = &minus;6 and &minus;48 &divide; (&minus;6) = 8.</p>' +
'<div class="eg"><b class="t">Worked example</b><p>The low temperatures for three days were &minus;3&deg;C, 5&deg;C and &minus;8&deg;C. What was the mean low?</p><ol><li>Add them: (&minus;3) + 5 + (&minus;8) = &minus;6.</li><li>Divide by the number of days: &minus;6 &divide; 3.</li><li>Different signs give a negative: the mean low was &minus;2&deg;C.</li></ol></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Work out &minus;2 &times; (3 &minus; 8).</p><ol><li>Brackets first: 3 &minus; 8 = &minus;5.</li><li>Then multiply: &minus;2 &times; (&minus;5).</li><li>Same signs give a positive: the answer is 10.</li></ol></div>' +
A.yt({ q: 'Work out (&minus;45) &divide; (&minus;9).', a: 5, back: 'Divide the sizes, then use the sign rules: two negative signs give a positive.', ok: '45 &divide; 9 = 5. Same signs, so the answer is positive: 5.' }) +
'<div class="mistake"><b class="t">Common mistake</b><p>&minus;3<sup>2</sup> and (&minus;3)<sup>2</sup> are different. (&minus;3)<sup>2</sup> = (&minus;3) &times; (&minus;3) = 9. But &minus;3<sup>2</sup> means &minus;(3 &times; 3) = &minus;9.</p></div>' +
'</section>';

  function nz(a, b) { var v = R.int(a, b); return v === 0 ? b : v; }
  function sizes(lv) { return lv === 1 ? 9 : lv === 2 ? 20 : 60; }
  var practice = [
    { id: 'int-add', name: 'Add integers', code: 'B2.4', gen: function (lv) {
      var m = sizes(lv), a = nz(-m, m), b = nz(-m, m);
      if (lv === 1 && a > 0 && b > 0) a = -a;
      var s = a + b, same = (a > 0) === (b > 0);
      return { q: 'Work out <span class="math">' + P(a) + ' + ' + P(b) + '</span>.', type: 'num', answer: s, show: N(s),
        fig: lv === 1 ? addModel(a, b) : lv === 2 ? jump(a, b) : '',
        hint: same ? 'The signs are the same: add the sizes and keep the sign.' : 'The signs are different: subtract the sizes and take the sign of the bigger size.',
        steps: [same ? 'Same signs.' : 'Different signs.', same ? 'Add the sizes: ' + Math.abs(a) + ' + ' + Math.abs(b) + ' = ' + Math.abs(s) + '.' : 'Subtract the sizes: ' + Math.max(Math.abs(a), Math.abs(b)) + ' &minus; ' + Math.min(Math.abs(a), Math.abs(b)) + ' = ' + Math.abs(s) + '.', 'Sign: ' + (s === 0 ? 'the answer is 0.' : (s > 0 ? 'positive' : 'negative') + ', so the answer is ' + N(s) + '.')],
        explain: P(a) + ' + ' + P(b) + ' = ' + N(s) + '.' };
    } },
    { id: 'int-sub', name: 'Subtract integers', code: 'B2.4', gen: function (lv) {
      var m = sizes(lv), a = nz(-m, m), b = nz(-m, m);
      if (lv === 1 && b > 0) b = -b;
      var d = a - b;
      if (lv === 3 && R.int(0, 1)) {
        var t1 = R.int(-25, 0), t2 = R.int(1, 15);
        return { q: 'In Iqaluit the temperature was ' + N(t1) + '&deg;C in the morning and ' + N(t2 - 20) + '&deg;C in the afternoon. What was the change? (Use a negative for a drop.)', type: 'num', answer: t2 - 20 - t1, show: N(t2 - 20 - t1), unit: '&deg;C',
          hint: 'Change = afternoon &minus; morning. Then add the opposite.', steps: ['Change = ' + P(t2 - 20) + ' &minus; ' + P(t1) + '.', 'Add the opposite: ' + P(t2 - 20) + ' + ' + P(-t1) + '.', 'The change is ' + N(t2 - 20 - t1) + '&deg;C.'], explain: P(t2 - 20) + ' &minus; ' + P(t1) + ' = ' + N(t2 - 20 - t1) + '.' };
      }
      return { q: 'Work out <span class="math">' + N(a) + ' &minus; ' + P(b) + '</span>.', type: 'num', answer: d, show: N(d), fig: lv === 1 ? jump(a, -b) : '',
        hint: 'Add the opposite: ' + N(a) + ' + ' + P(-b) + '. Only the second number flips.',
        steps: ['Keep the first number, change &minus; to +, flip the second: ' + N(a) + ' + ' + P(-b) + '.', 'Now add: ' + ((a > 0) === (-b > 0) ? 'same signs, add the sizes.' : 'different signs, subtract the sizes.'), 'The answer is ' + N(d) + '.'],
        explain: N(a) + ' &minus; ' + P(b) + ' = ' + N(a) + ' + ' + P(-b) + ' = ' + N(d) + '.' };
    } },
    { id: 'int-mul', name: 'Multiply integers', code: 'B2.7', gen: function (lv) {
      var a = nz(-12, 12), b = nz(-12, 12);
      if (lv === 1) { a = nz(-9, 9); b = nz(-9, 9); if (a > 0 && b > 0) b = -b; }
      if (lv === 3) {
        var c = R.pick([-1, -2, -3, 2, 3]), x = nz(-6, 6), y = nz(-6, 6), p = x * y * c, negs = [x, y, c].filter(function (v) { return v < 0; }).length;
        return { q: 'Work out <span class="math">' + P(x) + ' &times; ' + P(y) + ' &times; ' + P(c) + '</span>.', type: 'num', answer: p, show: N(p),
          hint: 'Multiply the sizes. Then count the negative signs: even gives positive, odd gives negative.', steps: ['Sizes: ' + Math.abs(x) + ' &times; ' + Math.abs(y) + ' &times; ' + Math.abs(c) + ' = ' + Math.abs(p) + '.', 'There ' + (negs === 1 ? 'is 1 negative sign' : 'are ' + negs + ' negative signs') + '. That is ' + (negs % 2 ? 'odd' : 'even') + '.', 'So the answer is ' + N(p) + '.'], explain: 'The product is ' + N(p) + '.' };
      }
      var pr = a * b;
      return { q: 'Work out <span class="math">' + P(a) + ' &times; ' + P(b) + '</span>.', type: 'num', answer: pr, show: N(pr), fig: lv === 1 ? signGrid() : '',
        hint: 'Multiply the sizes, then use the sign rules: same signs give positive, different signs give negative.',
        steps: ['Sizes: ' + Math.abs(a) + ' &times; ' + Math.abs(b) + ' = ' + Math.abs(pr) + '.', (a > 0) === (b > 0) ? 'The signs are the same, so the answer is positive.' : 'The signs are different, so the answer is negative.', P(a) + ' &times; ' + P(b) + ' = ' + N(pr) + '.'], explain: P(a) + ' &times; ' + P(b) + ' = ' + N(pr) + '.' };
    } },
    { id: 'int-div', name: 'Divide integers', code: 'B2.7', gen: function (lv) {
      var q = nz(-12, 12), d = nz(-12, 12);
      if (lv === 1) { q = nz(-9, 9); d = nz(2, 9) * R.pick([1, -1]); }
      if (lv === 3) d = nz(-15, 15) * (Math.abs(d) === 1 ? 2 : 1);
      var n = q * d;
      if (Math.abs(d) === 1) { d = d * 3; n = q * d; }
      return { q: 'Work out <span class="math">' + P(n) + ' &divide; ' + P(d) + '</span>.', type: 'num', answer: q, show: N(q),
        hint: 'Divide the sizes, then use the same sign rules as multiplication.',
        steps: ['Sizes: ' + Math.abs(n) + ' &divide; ' + Math.abs(d) + ' = ' + Math.abs(q) + '.', (n > 0) === (d > 0) ? 'Same signs: positive.' : 'Different signs: negative.', 'Check by multiplying: ' + P(q) + ' &times; ' + P(d) + ' = ' + N(n) + '.'], explain: P(n) + ' &divide; ' + P(d) + ' = ' + N(q) + '.' };
    } },
    { id: 'int-mixed', name: 'Several steps', code: 'B2.1', gen: function (lv) {
      var a = nz(-9, 9), b = nz(-9, 9), c = nz(-9, 9), v, q, steps;
      var t = lv === 1 ? 0 : lv === 2 ? R.int(0, 2) : R.int(1, 4);
      if (t === 0) { v = a + b * c; q = N(a) + ' + ' + P(b) + ' &times; ' + P(c); steps = ['Multiply first: ' + P(b) + ' &times; ' + P(c) + ' = ' + N(b * c) + '.', 'Then add: ' + N(a) + ' + ' + P(b * c) + '.', 'The answer is ' + N(v) + '.']; }
      else if (t === 1) { v = a * (b - c); q = P(a) + ' &times; (' + N(b) + ' &minus; ' + P(c) + ')'; steps = ['Brackets first: ' + N(b) + ' &minus; ' + P(c) + ' = ' + N(b - c) + '.', 'Then multiply: ' + P(a) + ' &times; ' + P(b - c) + '.', 'The answer is ' + N(v) + '.']; }
      else if (t === 2) { var k = nz(2, 5) * R.pick([1, -1]); v = (a * k + b * k) / k; var s = a * k + b * k; if (s === 0) { s = k * 3; v = 3; a = 3; b = 0; } q = '(' + N(a * k) + ' + ' + P(b * k) + ') &divide; ' + P(k); steps = ['Brackets first: ' + N(a * k) + ' + ' + P(b * k) + ' = ' + N(s) + '.', 'Then divide: ' + P(s) + ' &divide; ' + P(k) + '.', 'The answer is ' + N(s / k) + '.']; v = s / k; }
      else if (t === 3) { v = -(a * a) + b; q = '&minus;' + Math.abs(a) + '<sup>2</sup> + ' + P(b); a = Math.abs(a); v = -(a * a) + b; steps = ['&minus;' + a + '<sup>2</sup> means &minus;(' + a + ' &times; ' + a + ') = ' + N(-a * a) + '.', 'Then add ' + P(b) + '.', 'The answer is ' + N(v) + '.']; }
      else { v = (a - b) * (c - a); q = '(' + N(a) + ' &minus; ' + P(b) + ') &times; (' + N(c) + ' &minus; ' + P(a) + ')'; steps = ['First bracket: ' + N(a) + ' &minus; ' + P(b) + ' = ' + N(a - b) + '.', 'Second bracket: ' + N(c) + ' &minus; ' + P(a) + ' = ' + N(c - a) + '.', 'Multiply: ' + P(a - b) + ' &times; ' + P(c - a) + ' = ' + N(v) + '.']; }
      return { q: 'Work out <span class="math">' + q + '</span>.', type: 'num', answer: v, show: N(v),
        hint: 'Use the order of operations: brackets, then exponents, then &times; and &divide;, then + and &minus;.', steps: steps, explain: 'The answer is ' + N(v) + '.' };
    } }
  ];

  var quiz = [
    { q: 'Work out (&minus;9) + 14.', type: 'num', answer: 5, hint: 'Different signs: subtract the sizes and take the sign of the bigger size.', explain: '14 &minus; 9 = 5, and 14 is positive, so the sum is 5.' },
    { q: 'Work out &minus;3 &minus; 8.', type: 'num', answer: -11, hint: 'Add the opposite: &minus;3 + (&minus;8).', explain: '&minus;3 + (&minus;8) = &minus;11.' },
    { q: 'Work out 6 &minus; (&minus;10).', type: 'num', answer: 16, hint: 'Subtracting a negative is the same as adding a positive.', explain: '6 &minus; (&minus;10) = 6 + 10 = 16.' },
    { q: 'At the top of a ski hill it is &minus;14&deg;C. At the bottom it is &minus;5&deg;C. How many degrees warmer is the bottom?', type: 'num', answer: 9, unit: '&deg;C', hint: 'Warmer by = bottom &minus; top = &minus;5 &minus; (&minus;14).', explain: '&minus;5 &minus; (&minus;14) = &minus;5 + 14 = 9&deg;C warmer.' },
    { q: 'Work out (&minus;8) &times; (&minus;7).', type: 'num', answer: 56, hint: 'Two negative signs: the answer is positive.', explain: '8 &times; 7 = 56, and the signs are the same, so the answer is 56.' },
    { q: 'Work out 72 &divide; (&minus;9).', type: 'num', answer: -8, hint: 'Different signs give a negative answer.', explain: '72 &divide; 9 = 8, and the signs are different, so the answer is &minus;8.' },
    { q: 'Work out &minus;4 + 3 &times; (&minus;5).', type: 'mc', options: ['&minus;19', '5', '&minus;11', '19'], answer: 0, hint: 'Multiply before you add.', explain: '3 &times; (&minus;5) = &minus;15, then &minus;4 + (&minus;15) = &minus;19. Adding first would wrongly give (&minus;1) &times; (&minus;5) = 5.' }
  ];

  A.register('integers', {
    fx: { P: P, counters: counters, jump: jump, thermo: thermo, pattern: pattern, signGrid: signGrid, addModel: addModel, nz: nz, sizes: sizes },
    html: html, practice: practice, quiz: quiz,
    init: function (root) {
      var $ = function (s) { return A.$(s, root); };
      A.bind(root, ['iaa', 'iab', 'iop'], function () {
        var a = +$('#iaa').value, b = +$('#iab').value, sub = $('#iop').value === '-', bb = sub ? -b : b, r = a + bb;
        $('#iaao').textContent = a < 0 ? '−' + -a : a; $('#iabo').textContent = b < 0 ? '−' + -b : b;
        $('#iafig').innerHTML = addModel(a, bb);
        $('#ialine').innerHTML = jump(a, bb, -18, 18);
        $('#iaout').innerHTML = '<span class="big">' + N(a) + (sub ? ' &minus; ' : ' + ') + P(b) + ' = ' + N(r) + '</span><br>' +
          (sub ? 'Subtracting ' + P(b) + ' is the same as adding ' + P(-b) + '. ' : '') +
          (bb === 0 ? 'Adding 0 changes nothing.' : 'Start at ' + N(a) + ' and move ' + Math.abs(bb) + ' to the ' + (bb > 0 ? 'right' : 'left') + '.') +
          (Math.min(Math.max(a, 0) + Math.max(bb, 0), Math.max(-a, 0) + Math.max(-bb, 0)) ? ' The crossed-out counters are zero pairs.' : '');
      });
      A.bind(root, ['imp'], function () {
        var a = +$('#imp').value;
        $('#impo').textContent = a < 0 ? '−' + -a : a;
        $('#impfig').innerHTML = pattern(a);
        $('#impout').innerHTML = a === 0 ? 'Zero times anything is 0.' : 'Each row down, the second number drops by 1, so the product ' + (a > 0 ? 'drops' : 'goes up') + ' by ' + Math.abs(a) + '. ' +
          (a < 0 ? 'Keep going past 0 and the products become <b>positive</b>: a negative times a negative is positive.' : 'Past 0 the products become negative: a positive times a negative is negative.');
      });
    }
  });

  /* ---------- question shapes (more ways to ask each skill; checks in tests/verify/grade8.js) ---------- */
  var K = window.K8;
  function line20(q, ans, meta, extra) {
    var o = { q: q, type: 'line', min: -20, max: 20, tick: 1, every: 5, snap: 1, answer: ans, meta: meta };
    Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; });
    return o;
  }
  function exprs(n, f, m) { var out = [], seen = {}; while (out.length < n) { var a = nz(-m, m), b = nz(-m, m), k = a + ',' + b; if (!seen[k]) { seen[k] = 1; out.push([a, b, f(a, b)]); } } return out; }
  function distinctVals(list) { var s = {}; return list.every(function (x) { if (s[x[2]]) return false; s[x[2]] = 1; return true; }); }
  var SHAPES = {
    'int-add': [
      [1, 'line', function (lv) {
        var a = nz(-9, 9), b = nz(-9, 9), s = a + b;
        return line20('Start at <b>' + N(a) + '</b>. Add <b>' + P(b) + '</b>. Place the answer on the line.', s, { k: 'ia-line', a: a, b: b },
          { hint: 'Adding ' + (b > 0 ? 'a positive moves right.' : 'a negative moves left.'), steps: ['Start at ' + N(a) + '.', 'Move ' + Math.abs(b) + ' to the ' + (b > 0 ? 'right' : 'left') + '.', 'You land on ' + N(s) + '.'], explain: P(a) + ' + ' + P(b) + ' = ' + N(s) + '.' });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), t = R.int(-15, 5), c = nz(-12, 12), s = t + c;
        return { q: 'In Thunder Bay it was <b>' + N(t) + '&deg;C</b> at 6 a.m. ' + who + ' saw it ' + (c > 0 ? 'rise' : 'fall') + ' by <b>' + Math.abs(c) + ' degrees</b>. What is the temperature now?', type: 'num', answer: s, show: N(s), unit: '&deg;C',
          hint: (c > 0 ? 'A rise adds a positive.' : 'A fall adds a negative.'), steps: ['Write it as an addition: ' + P(t) + ' + ' + P(c) + '.', 'The answer is ' + N(s) + '&deg;C.'], explain: P(t) + ' + ' + P(c) + ' = ' + N(s) + '&deg;C.', meta: { k: 'ia-story', t: t, c: c } };
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), a = nz(-12, 12), b = nz(-12, 12);
        if ((a > 0) === (b > 0)) a = -a;
        var s = a + b, truth = R.int(0, 1), said = s;
        if (!truth) said = R.pick([-s, (a > 0 ? 1 : -1) * (Math.abs(a) + Math.abs(b))]);
        if (said === s) truth = 1;
        return K.tf({ q: who + ' says <span class="math">' + P(a) + ' + ' + P(b) + ' = ' + N(said) + '</span>. True or false?', truth: truth,
          right: truth ? 'Different signs: subtract the sizes and take the sign of the bigger size, so the sum is ' + N(s) + '.' : 'The sum is ' + N(s) + ': with different signs, subtract the sizes and take the sign of the bigger size.',
          wrong: ['With any signs, add the sizes.', 'The answer always takes the sign of the first number.'],
          hint: 'The signs are different. Which size is bigger?', meta: { k: 'ia-tf', a: a, b: b, said: said } });
      }],
      [2, 'match', function (lv) {
        var m = lv === 2 ? 15 : 30, list;
        do { list = exprs(3, function (a, b) { return a + b; }, m); } while (!distinctVals(list));
        return { q: 'Match each sum to its answer.', type: 'match', pairs: list.map(function (x) { return [P(x[0]) + ' + ' + P(x[1]), N(x[2])]; }),
          hint: 'Same signs: add the sizes. Different signs: subtract them.', steps: ['Work out each sum on its own, then match.'], explain: list.map(function (x) { return P(x[0]) + ' + ' + P(x[1]) + ' = ' + N(x[2]); }).join('. ') + '.', meta: { k: 'ia-match' } };
      }]
    ],
    'int-sub': [
      [1, 'line', function (lv) {
        var a = nz(-9, 9), b = nz(-9, 9), d = a - b;
        return line20('Work out <span class="math">' + N(a) + ' &minus; ' + P(b) + '</span>. Place the answer on the line.', d, { k: 'is-line', a: a, b: b },
          { hint: 'Add the opposite: ' + N(a) + ' + ' + P(-b) + '.', steps: ['Change it to ' + N(a) + ' + ' + P(-b) + '.', 'Start at ' + N(a) + ' and move ' + Math.abs(b) + ' to the ' + (-b > 0 ? 'right' : 'left') + '.', 'You land on ' + N(d) + '.'], explain: N(a) + ' &minus; ' + P(b) + ' = ' + N(d) + '.' });
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), a = nz(-12, 12), b = -R.int(2, 12), d = a - b, truth = R.int(0, 1), said = truth ? d : a + b;
        return K.tf({ q: who + ' says <span class="math">' + N(a) + ' &minus; ' + P(b) + ' = ' + N(said) + '</span>. True or false?', truth: truth,
          right: truth ? 'Subtracting ' + P(b) + ' is the same as adding ' + Math.abs(b) + ', so the answer is ' + N(d) + '.' : 'Subtracting a negative means adding its opposite: ' + N(a) + ' + ' + Math.abs(b) + ' = ' + N(d) + '.',
          wrong: ['Subtracting always makes a number smaller.', 'Just drop the brackets and subtract the sizes.'],
          hint: 'What is the opposite of ' + P(b) + '?', meta: { k: 'is-tf', a: a, b: b, said: said } });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), hi = R.int(-6, 8), lo = hi - R.int(4, 20);
        return { q: 'On a winter day in Whitehorse, ' + who + ' wrote down a high of <b>' + N(hi) + '&deg;C</b> and a low of <b>' + N(lo) + '&deg;C</b>. How many degrees warmer was the high?', type: 'num', answer: hi - lo, unit: '&deg;C',
          hint: 'Warmer by = high &minus; low.', steps: ['Work out ' + P(hi) + ' &minus; ' + P(lo) + '.', 'Add the opposite: ' + P(hi) + ' + ' + P(-lo) + ' = ' + (hi - lo) + '.'], explain: 'The high was ' + (hi - lo) + ' degrees warmer.', meta: { k: 'is-story', hi: hi, lo: lo } };
      }],
      [2, 'fill', function (lv) {
        var m = sizes(lv), a = nz(-m, m), b = nz(-m, m);
        return { q: 'Rewrite the subtraction as an addition. Then finish it.', type: 'fill', fill: '<span class="math">' + N(a) + ' &minus; ' + P(b) + ' = ' + N(a) + ' + ( [[]] ) = [[]]</span>', answers: [-b, a - b],
          hint: 'Keep the first number, change &minus; to +, and flip the sign of the second number.', steps: ['The opposite of ' + P(b) + ' is ' + N(-b) + '.', N(a) + ' + ' + P(-b) + ' = ' + N(a - b) + '.'], explain: N(a) + ' &minus; ' + P(b) + ' = ' + N(a) + ' + ' + P(-b) + ' = ' + N(a - b) + '.', meta: { k: 'is-fill', a: a, b: b } };
      }]
    ],
    'int-mul': [
      [1, 'pick', function (lv) {
        return K.until(function () {
          var list = exprs(5, function (a, b) { return a * b; }, 9);
          return K.pickAll({ q: 'Pick every product that is <b>negative</b>.', opts: list.map(function (x) { return [P(x[0]) + ' &times; ' + P(x[1]), x[2] < 0]; }),
            hint: 'Different signs give a negative product.', steps: ['Look only at the signs.', 'One negative sign: negative. Two: positive.'], explain: 'A product is negative when exactly one of the two numbers is negative.', meta: { k: 'im-pick' } });
        });
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), a = -R.int(2, 9), b = nz(-9, 9), p = a * b, truth = R.int(0, 1), said = truth ? p : -p;
        return K.tf({ q: who + ' says <span class="math">' + P(a) + ' &times; ' + P(b) + ' = ' + N(said) + '</span>. True or false?', truth: truth,
          right: (b < 0 ? 'Two negative signs give a positive' : 'A negative times a positive is negative') + ', so the product is ' + N(p) + '.',
          wrong: ['The answer takes the sign of the bigger number.', 'Multiplying always gives a positive answer.'],
          hint: 'Count the negative signs.', meta: { k: 'im-tf', a: a, b: b, said: said } });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), r = R.int(2, 9), t = R.int(2, 9), p = -r * t;
        return { q: who + ' is scuba diving in Georgian Bay. ' + who + ' goes down <b>' + r + ' m</b> each minute for <b>' + t + ' minutes</b>. What is the change in depth? (Use a negative for down.)', type: 'num', answer: p, show: N(p), unit: 'm',
          hint: 'Going down ' + r + ' m is a change of &minus;' + r + '. Do that ' + t + ' times.', steps: ['Change = (&minus;' + r + ') &times; ' + t + '.', 'Different signs: negative. The change is ' + N(p) + ' m.'], explain: '(&minus;' + r + ') &times; ' + t + ' = ' + N(p) + ' m.', meta: { k: 'im-story', r: -r, t: t } };
      }],
      [2, 'match', function (lv) {
        var list;
        do { list = exprs(3, function (a, b) { return a * b; }, 12); } while (!distinctVals(list));
        return { q: 'Match each product to its answer.', type: 'match', pairs: list.map(function (x) { return [P(x[0]) + ' &times; ' + P(x[1]), N(x[2])]; }),
          hint: 'Multiply the sizes, then use the sign rules.', steps: ['Same signs: positive. Different signs: negative.'], explain: list.map(function (x) { return P(x[0]) + ' &times; ' + P(x[1]) + ' = ' + N(x[2]); }).join('. ') + '.', meta: { k: 'im-match' } };
      }]
    ],
    'int-div': [
      [1, 'mistake', function (lv) {
        var who = K.name(), q = nz(-9, 9), d = R.int(2, 9) * R.pick([1, -1]), n = q * d, truth = R.int(0, 1), said = truth ? q : -q;
        return K.tf({ q: who + ' says <span class="math">' + P(n) + ' &divide; ' + P(d) + ' = ' + N(said) + '</span>. True or false?', truth: truth,
          right: ((n > 0) === (d > 0) ? 'Same signs give a positive' : 'Different signs give a negative') + ', so the answer is ' + N(q) + '.',
          wrong: ['Division answers are always negative.', 'The answer takes the sign of the second number.'],
          hint: 'Check by multiplying: answer &times; ' + P(d) + ' should give ' + N(n) + '.', meta: { k: 'id-tf', n: n, d: d, said: said } });
      }],
      [1, 'story', function (lv) {
        var who = K.name(), h = R.int(2, 6), per = R.int(1, 5), tot = -per * h;
        return { q: 'Overnight in Sudbury the temperature fell <b>' + Math.abs(tot) + ' degrees</b> in <b>' + h + ' hours</b>. ' + who + ' says it fell by the same amount each hour. What was the change each hour?', type: 'num', answer: -per, show: N(-per), unit: '&deg;C',
          hint: 'The total change is ' + N(tot) + '. Share it over ' + h + ' hours.', steps: ['Change each hour = ' + P(tot) + ' &divide; ' + h + '.', 'Different signs: negative. The answer is ' + N(-per) + '&deg;C.'], explain: P(tot) + ' &divide; ' + h + ' = ' + N(-per) + '&deg;C each hour.', meta: { k: 'id-story', tot: tot, h: h } };
      }],
      [1, 'fill', function (lv) {
        var q = nz(-9, 9), d = R.int(2, 9) * R.pick([1, -1]), n = q * d;
        return { q: 'Use the multiplication to finish the division.', type: 'fill', fill: '<span class="math">' + P(q) + ' &times; ' + P(d) + ' = ' + N(n) + '</span>, so <span class="math">' + P(n) + ' &divide; ' + P(d) + ' = [[]]</span>', answers: [q],
          hint: 'Division undoes multiplication.', steps: ['If ' + P(q) + ' &times; ' + P(d) + ' = ' + N(n) + ', then ' + P(n) + ' &divide; ' + P(d) + ' gives back ' + N(q) + '.'], explain: P(n) + ' &divide; ' + P(d) + ' = ' + N(q) + '.', meta: { k: 'id-fill', n: n, d: d } };
      }],
      [2, 'pick', function (lv) {
        return K.until(function () {
          var v = nz(-9, 9), opts = [];
          for (var i = 0; i < 5; i++) { var d = R.int(2, 9) * R.pick([1, -1]), q = R.int(0, 2) ? v : -v; opts.push([P(q * d) + ' &divide; ' + P(d), q === v]); }
          var seen = {}; if (!opts.every(function (o) { if (seen[o[0]]) return false; seen[o[0]] = 1; return true; })) return null;
          return K.pickAll({ q: 'Pick every division that equals <b>' + N(v) + '</b>.', opts: opts, hint: 'Work out each one: divide the sizes, then use the sign rules.', steps: ['Same signs: positive. Different signs: negative.'], explain: 'The right ones all come out to ' + N(v) + '.', meta: { k: 'id-pick', v: v } });
        });
      }]
    ],
    'int-mixed': [
      [1, 'which', function (lv) {
        var a = nz(-9, 9), b = nz(-9, 9), c = nz(-9, 9);
        return K.pick1({ q: 'In <span class="math">' + N(a) + ' + ' + P(b) + ' &times; ' + P(c) + '</span>, what do you do first?', right: 'Multiply ' + P(b) + ' &times; ' + P(c), wrong: ['Add ' + N(a) + ' + ' + P(b), 'Work left to right'],
          hint: 'Multiplication comes before addition.', steps: ['Order of operations: brackets, exponents, &times; and &divide;, then + and &minus;.'], explain: 'Multiply first: ' + P(b) + ' &times; ' + P(c) + ' = ' + N(b * c) + '. Then add ' + N(a) + ' to get ' + N(a + b * c) + '.', meta: { k: 'ix-first' } });
      }],
      [1, 'way', function (lv) {
        var who = K.name(), s = R.pick(['fall', 'share', 'repeat']), a, b, right, wrong, q;
        if (s === 'fall') { a = R.int(-12, 2); b = R.int(3, 12); q = 'It is ' + N(a) + '&deg;C. The temperature falls ' + b + ' degrees.'; right = P(a) + ' &minus; ' + b; wrong = [P(a) + ' &times; ' + b, b + ' &minus; ' + P(a), P(a) + ' &divide; ' + b]; }
        else if (s === 'share') { b = R.int(2, 6); a = -b * R.int(2, 9); q = who + '\'s team lost ' + Math.abs(a) + ' points over ' + b + ' games, the same each game. The change per game is wanted.'; right = P(a) + ' &divide; ' + b; wrong = [P(a) + ' &times; ' + b, P(a) + ' &minus; ' + b, b + ' &divide; ' + P(a)]; }
        else { a = -R.int(2, 9); b = R.int(3, 8); q = who + ' spends $' + Math.abs(a) + ' on lunch each day for ' + b + ' days. The change in savings is wanted.'; right = P(a) + ' &times; ' + b; wrong = [P(a) + ' + ' + b, P(a) + ' &divide; ' + b, P(a) + ' &minus; ' + b]; }
        return K.pick1({ q: q + ' Which way works it out?', right: right, wrong: wrong, hint: 'Think about what is happening: a change once, a share, or the same change many times?',
          steps: ['Falls once: subtract. Shared equally: divide. The same change many times: multiply.'], explain: 'Use ' + right + '.', meta: { k: 'ix-way', s: s, a: a, b: b } });
      }],
      [1, 'mistake', function (lv) {
        var who = K.name(), a = nz(-9, 9), b = nz(-6, 6), c = nz(-6, 6), v = a + b * c, wrongV = (a + b) * c;
        if (v === wrongV) c = c + (c > 0 ? 1 : -1), v = a + b * c, wrongV = (a + b) * c;
        var truth = R.int(0, 1), said = truth ? v : wrongV, ex = N(a) + ' + ' + P(b) + ' &times; ' + P(c);
        return K.tf({ q: who + ' says <span class="math">' + ex + ' = ' + N(said) + '</span>. True or false?', truth: truth,
          right: 'Multiply first: ' + P(b) + ' &times; ' + P(c) + ' = ' + N(b * c) + ', then add ' + N(a) + '. The answer is ' + N(v) + '.',
          wrong: ['Work from left to right, so add first.', 'Multiply all three numbers together.'], hint: 'What comes first: + or &times;?', meta: { k: 'ix-tf', ex: ex, said: said } });
      }],
      [2, 'order', function (lv) {
        return K.until(function () {
          var list = [], seen = {};
          for (var i = 0; i < 4; i++) {
            var a = nz(-9, 9), b = nz(-6, 6), c = nz(-6, 6), t = R.int(0, 1), ex = t ? N(a) + ' + ' + P(b) + ' &times; ' + P(c) : P(a) + ' &times; (' + N(b) + ' &minus; ' + P(c) + ')', v = t ? a + b * c : a * (b - c);
            if (seen[v]) return null; seen[v] = 1; list.push([ex, v]);
          }
          list.sort(function (x, y) { return x[1] - y[1]; });
          return { q: 'Put these in order of their value, least to greatest.', type: 'order', items: list.map(function (x) { return x[0]; }), first: 'least', last: 'greatest',
            hint: 'Work out each one with the order of operations first.', steps: list.map(function (x) { return x[0] + ' = ' + N(x[1]); }), explain: 'In order: ' + list.map(function (x) { return N(x[1]); }).join(', ') + '.', meta: { k: 'ix-order' } };
        });
      }]
    ]
  };
  Atlas.Q.shapes('integers', SHAPES);
})();
