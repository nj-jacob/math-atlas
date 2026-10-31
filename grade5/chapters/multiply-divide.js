(function () {
  var A = Atlas, R = A.R;
  function parts(n) {
    var s = String(n), out = [];
    for (var i = 0; i < s.length; i++) {
      var v = parseInt(s.charAt(i), 10) * Math.pow(10, s.length - 1 - i);
      if (v) out.push(v);
    }
    return out;
  }
  /* area model drawing for a (up to 99) times b (up to 99) */
  function areaModel(a, b, rowCols) {
    var pa = parts(a), pb = parts(b);
    var cw = pa.map(function (p) { return 70 + 220 * p / a; }), rh = pb.map(function (p) { return 40 + 90 * p / b; });
    var W = cw.reduce(function (x, y) { return x + y; }, 0), H = rh.reduce(function (x, y) { return x + y; }, 0), s = '', x = 50, y;
    pa.forEach(function (p, c) { s += '<text x="' + (x + cw[c] / 2) + '" y="22" text-anchor="middle" class="tb">' + p + '</text>'; x += cw[c]; });
    y = 32;
    pb.forEach(function (q, r) {
      s += '<text x="42" y="' + (y + rh[r] / 2 + 5) + '" text-anchor="end" class="tb">' + q + '</text>';
      x = 50;
      pa.forEach(function (p, c) {
        s += '<rect x="' + x + '" y="' + y + '" width="' + cw[c] + '" height="' + rh[r] + '" style="fill:color-mix(in srgb,' + (rowCols ? rowCols[r] : 'var(--strand)') + ' ' + (rowCols ? 30 + 12 * (c % 2) : 14 + 10 * ((r + c) % 2)) + '%,var(--card));stroke:var(--ink)" stroke-width="2"/>' +
          '<text x="' + (x + cw[c] / 2) + '" y="' + (y + rh[r] / 2 + 6) + '" text-anchor="middle" class="tb" font-size="18">' + A.fmt(p * q) + '</text>';
        x += cw[c];
      });
      y += rh[r];
    });
    return A.svg(Math.ceil(W + 60), Math.ceil(H + 42), s, 'Area model for ' + a + ' times ' + b);
  }
  /* split a division into friendly chunks of the divisor: 100s, 10s, then 1s */
  function chunks(n, d) {
    var out = [], rem = n;
    [100, 10, 1].forEach(function (p) {
      var c = Math.floor(rem / (d * p));
      if (c > 0) { out.push({ q: c * p, v: c * p * d }); rem -= c * p * d; }
    });
    return { list: out, r: rem };
  }
  /* r rows of c dots; columns from split on are yellow, with a dashed line between */
  function arr(r, c, split, label) {
    var sz = 18, s = '';
    for (var i = 0; i < r; i++) for (var j = 0; j < c; j++) s += '<circle cx="' + (12 + j * sz) + '" cy="' + (12 + i * sz) + '" r="7" style="fill:' + (split && j >= split ? 'var(--hi)' : 'var(--strand)') + ';stroke:var(--ink)" stroke-width="1"/>';
    if (split) s += '<line x1="' + (12 + (split - 0.5) * sz) + '" y1="0" x2="' + (12 + (split - 0.5) * sz) + '" y2="' + (r * sz + 6) + '" style="stroke:var(--ink)" stroke-width="2" stroke-dasharray="5 4"/>';
    return A.svg(c * sz + 8, r * sz + 8, s, label || r + ' rows of ' + c + (split ? ', split into ' + split + ' and ' + (c - split) + ' columns' : ''));
  }
  /* q full groups of d, then the r left over: as an extra group to fill (up), left out (down) or shared (share) */
  function packs(q, r, d, kind, noun) {
    var bw = 38, bh = 30, gap = 8, s = '', x = 4, perRow = 12, y = 4;
    for (var i = 0; i < q; i++) {
      var cx = 4 + (i % perRow) * (bw + gap), cy = y + Math.floor(i / perRow) * (bh + 22);
      s += '<rect x="' + cx + '" y="' + cy + '" width="' + bw + '" height="' + bh + '" rx="5" style="fill:var(--strand);stroke:var(--ink)" stroke-width="1.5"/><text x="' + (cx + bw / 2) + '" y="' + (cy + 20) + '" text-anchor="middle" font-size="16" font-weight="700" style="fill:#fff">' + d + '</text>';
    }
    var k = q, ex = 4 + (k % perRow) * (bw + gap), ey = y + Math.floor(k / perRow) * (bh + 22), H = ey + bh + 26;
    if (kind === 'up') {
      s += '<rect x="' + ex + '" y="' + ey + '" width="' + bw + '" height="' + bh + '" rx="5" style="fill:var(--card);stroke:var(--accent)" stroke-width="2.5"/><rect x="' + (ex + 2) + '" y="' + (ey + 2) + '" width="' + ((bw - 4) * r / d).toFixed(1) + '" height="' + (bh - 4) + '" rx="3" style="fill:var(--hi)"/><text x="' + (ex + bw / 2) + '" y="' + (ey + 20) + '" text-anchor="middle" font-size="13" font-weight="700">' + r + '</text>' +
        '<text x="' + Math.min(ex, 470) + '" y="' + (ey + bh + 16) + '" font-size="13" style="fill:var(--accent)" font-weight="700">one more ' + (noun || 'group') + '</text>';
    } else if (kind === 'down') {
      for (var j = 0; j < r; j++) s += '<circle cx="' + (ex + 6 + (j % 6) * 10) + '" cy="' + (ey + 8 + Math.floor(j / 6) * 10) + '" r="4" style="fill:var(--line);stroke:var(--ink2)" stroke-width="1"/>';
      s += '<text x="' + Math.min(ex, 470) + '" y="' + (ey + bh + 16) + '" font-size="13" class="t2" font-weight="700">' + r + ' left over</text>';
    } else {
      s += '<rect x="' + ex + '" y="' + ey + '" width="' + bw + '" height="' + bh + '" rx="5" style="fill:color-mix(in srgb,var(--hi) 60%,var(--card));stroke:var(--ink)" stroke-width="1.5" stroke-dasharray="4 3"/><text x="' + (ex + bw / 2) + '" y="' + (ey + 20) + '" text-anchor="middle" font-size="13" font-weight="700">' + r + '</text>' +
        '<text x="' + Math.min(ex, 470) + '" y="' + (ey + bh + 16) + '" font-size="13" font-weight="700">shared out</text>';
    }
    var W = 4 + Math.min(Math.max(q + 1, 1), perRow) * (bw + gap) + 60;
    return A.svg(Math.max(W, 200), H, s, q + ' full groups of ' + d + ' and ' + r + ' left over');
  }
  function divModel(n, d) {
    var ch = chunks(n, d), tot = ch.list.reduce(function (x, c) { return x + c.q; }, 0), s = '', x = 60, W = 400;
    ch.list.forEach(function (c, i) {
      var w = Math.max(70, W * c.q / Math.max(tot, 1));
      s += '<rect x="' + x + '" y="34" width="' + w + '" height="70" style="fill:color-mix(in srgb,var(--strand) ' + (16 + 12 * (i % 2)) + '%,var(--card));stroke:var(--ink)" stroke-width="2"/>' +
        '<text x="' + (x + w / 2) + '" y="24" text-anchor="middle" class="tb">' + c.q + '</text>' +
        '<text x="' + (x + w / 2) + '" y="75" text-anchor="middle" class="tb" font-size="17">' + A.fmt(c.v) + '</text>';
      x += w;
    });
    s += '<text x="50" y="75" text-anchor="end" class="tb">' + d + '</text>';
    if (ch.r) s += '<text x="' + (x + 10) + '" y="75" class="tb" style="fill:var(--bad)">R ' + ch.r + '</text>';
    return A.svg(Math.ceil(x + (ch.r ? 70 : 20)), 112, s, 'Area model for ' + n + ' divided by ' + d);
  }

  A.register('multiply-divide', {
    html:
'<section class="sec"><h2><span class="n">1</span>Facts and strategies</h2>' +
'<p>Knowing the facts up to 12 &times; 12 makes every other question faster. Every multiplication fact also gives you two division facts.</p>' +
'<div class="lab"><span class="lt">Try it: fact finder</span>' +
'<div class="ctrl"><label for="fa">First factor: <output id="fao"></output><input type="range" id="fa" min="0" max="12" value="7"></label>' +
'<label for="fb">Second factor: <output id="fbo"></output><input type="range" id="fb" min="0" max="12" value="8"></label></div>' +
'<div class="fig" id="ffig"></div><div class="out" id="fout"></div></div>' +
'<p><b>Break apart.</b> 7 rows of 8 is the same as two blocks of 7 rows of 4: 28 + 28 = 56.</p><div class="fig">' + arr(7, 8, 4) + '</div>' +
'<ul>' +
'<li><b>Friendly tens:</b> 9 &times; 6 = 10 &times; 6 &minus; 6 = 54.</li>' +
'<li><b>Double and halve:</b> 15 &times; 12 = 30 &times; 6 = 180.</li></ul>' +
'<div class="eg"><p><b>Example.</b> 12 &times; 7: break 12 into 10 + 2. 10 &times; 7 = 70 and 2 &times; 7 = 14, so 12 &times; 7 = <b>84</b>. Related facts: 84 &divide; 7 = 12 and 84 &divide; 12 = 7.</p><div class="fig">' + arr(7, 12, 10, '7 rows of 12, split into 7 rows of 10 (70) and 7 rows of 2 (14)') + '</div><p class="t2">Blue: 7 &times; 10 = 70. Yellow: 7 &times; 2 = 14.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Any number times 0 is 0. Any number times 1 stays the same.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>The area model</h2>' +
'<p>Split each number by place value: 23 is 20 + 3, and 14 is 10 + 4. Each small rectangle is a <b>partial product</b>. Add them all to get the answer.</p>' +
'<div class="lab"><span class="lt">Try it: area model</span>' +
'<div class="ctrl"><label for="ma">Multiply (10 to 99)<input type="number" id="ma" min="1" max="99" value="23"></label>' +
'<label for="mb">by (10 to 99)<input type="number" id="mb" min="1" max="99" value="14"></label></div>' +
'<div class="fig" id="mfig"></div><div class="out" id="mout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Estimate first. 23 &times; 14 is about 20 &times; 15 = 300, so an answer of 322 makes sense and 3220 does not.</p></div>' +
'<div class="eg"><p><b>Example.</b> 36 &times; 25: 30 &times; 20 = 600, 6 &times; 20 = 120, 30 &times; 5 = 150, 6 &times; 5 = 30. 600 + 120 + 150 + 30 = <b>900</b>.</p><div class="fig">' + areaModel(36, 25) + '</div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>From the area model to the algorithm</h2>' +
'<p>The standard algorithm does the same multiplying, written in a shorter way. Each line matches part of the area model.</p>' +
'<div class="row2"><div class="eg"><p><b>Area model</b></p><div class="fig">' + areaModel(23, 14, ['var(--strand)', 'var(--pm1)']) + '</div></div>' +
'<div class="eg"><p><b>Algorithm</b></p><span class="mono">    23\n  &times; 14\n  ────\n<b class="cm1t">    92   (23 &times; 4)</b>\n<b style="color:var(--strand)">   230   (23 &times; 10)</b>\n  ────\n   322</span></div></div>' +
'<p>The <b class="cm1t">92</b> is the orange row of the area model (80 + 12). The <b style="color:var(--strand)">230</b> is the blue row (200 + 30).</p>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Forgetting the zero in the second line. You are multiplying by 1 <b>ten</b>, so the line is 230, not 23.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Dividing by a two-digit number</h2>' +
'<p>Division asks "how many groups of this size fit?" Use an area model in reverse. The divisor is the height. Take out big friendly chunks, like 10 groups or 20 groups, until you cannot take any more.</p>' +
'<div class="lab"><span class="lt">Try it: divide in chunks</span>' +
'<div class="ctrl"><label for="dv">Total (100 to 999)<input type="number" id="dv" min="100" max="999" value="372"></label>' +
'<label for="ds">Divide by (10 to 99)<input type="number" id="ds" min="10" max="99" value="12"></label></div>' +
'<div class="fig" id="dfig"></div><div class="out" id="dout"></div></div>' +
'<div class="eg"><p><b>372 &divide; 12</b>: 12 &times; 30 = 360. 372 &minus; 360 = 12. 12 &times; 1 = 12. So 30 + 1 = <b>31</b>.</p><div class="fig">' + divModel(372, 12) + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Stopping with a remainder that is too big. If you divide by 12 and have 15 left, one more group of 12 still fits.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>What to do with the remainder</h2>' +
'<p>The same division can need different answers. Read the question.</p>' +
'<p>All three questions below use the same math: <span class="math">250 &divide; 24 = 10 R 10</span>.</p>' +
'<div class="rcase"><p><b>250 students, 24 per bus. How many buses?</b></p><div class="fig">' + packs(10, 10, 24, 'up', 'bus') + '</div><p>Answer: <b>11</b>. Round up, because the last 10 students still need a ride.</p></div>' +
'<div class="rcase"><p><b>250 stickers, 24 per sheet. How many full sheets?</b></p><div class="fig">' + packs(10, 10, 24, 'down') + '</div><p>Answer: <b>10</b>. Drop the remainder, because a sheet needs 24.</p></div>' +
'<div class="rcase"><p><b>250 cm of string cut into 24 equal pieces. How long is each?</b></p><div class="fig">' + packs(10, 10, 24, 'share') + '</div><p>Answer: <b>10&nbsp;10/24 cm</b>. Share the remainder as a fraction.</p></div>' +
'<div class="eg"><p><b>Example.</b> 100 juice boxes are packed 12 to a case. 100 &divide; 12 = 8 R 4. The store can fill <b>8</b> cases, with 4 boxes left over.</p><div class="fig">' + packs(8, 4, 12, 'down') + '</div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Ask what the leftovers need: their own group (round up), nothing (drop them), or to be shared (a fraction).</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Properties and checking</h2>' +
'<ul><li><b>Order does not matter</b> when you multiply: 4 &times; 25 = 25 &times; 4.</li>' +
'<li><b>Grouping does not matter</b> when you multiply: (4 &times; 25) &times; 7 = 4 &times; (25 &times; 7). Pick the friendly pair first.</li>' +
'<li><b>Breaking apart works</b>: 6 &times; 47 = 6 &times; 40 + 6 &times; 7.<div class="fig">' + areaModel(47, 6) + '</div></li>' +
'<li><b>Division undoes multiplication</b>, so use one to check the other.</li></ul>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Not checking a division. Always check: (divisor &times; quotient) + remainder must equal the total. For 250 &divide; 24: 24 &times; 10 + 10 = 250.</p></div>' +
'<div class="eg"><p><b>Example.</b> 4 &times; 37 &times; 25: group the friendly pair first. 4 &times; 25 = 100, then 100 &times; 37 = <b>3700</b>.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function fact() {
        var a = +$('#fa', root).value, b = +$('#fb', root).value, s = '', sz = 19;
        $('#fao', root).textContent = a; $('#fbo', root).textContent = b;
        for (var r = 0; r <= 12; r++) for (var c = 0; c <= 12; c++) {
          var x = 24 + c * sz, y = 24 + r * sz, inA = r < a && c < b;
          s += '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" style="fill:' + (inA ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--line)" stroke-width="1"/>';
        }
        for (var i = 1; i <= 12; i++) {
          s += '<text x="' + (24 + (i - 0.5) * sz) + '" y="18" text-anchor="middle" font-size="10" class="t2">' + i + '</text><text x="18" y="' + (24 + (i - 0.5) * sz + 4) + '" text-anchor="end" font-size="10" class="t2">' + i + '</text>';
        }
        $('#ffig', root).innerHTML = A.svg(24 + 13 * sz + 4, 24 + 13 * sz + 4, s, a + ' rows of ' + b + ' squares');
        var p = a * b;
        $('#fout', root).innerHTML = '<p><span class="big">' + a + ' &times; ' + b + ' = ' + p + '</span></p><p>' + a + ' rows of ' + b + ' squares. ' +
          (a && b ? 'Related facts: ' + b + ' &times; ' + a + ' = ' + p + ', ' + p + ' &divide; ' + a + ' = ' + b + ', ' + p + ' &divide; ' + b + ' = ' + a + '.' : 'Any number times 0 is 0.') + '</p>';
      }
      A.bind(root, ['fa', 'fb'], fact);

      function mul() {
        var a = Math.max(1, Math.min(99, parseInt($('#ma', root).value, 10) || 1));
        var b = Math.max(1, Math.min(99, parseInt($('#mb', root).value, 10) || 1));
        $('#mfig', root).innerHTML = areaModel(a, b) + '<p class="t2" style="font-size:.85rem;text-align:center;margin:0">Not drawn to scale.</p>';
        var all = [];
        parts(b).forEach(function (q) { parts(a).forEach(function (p) { all.push(p * q); }); });
        $('#mout', root).innerHTML = '<p class="math">' + all.map(A.fmt).join(' + ') + '</p><p><span class="big">' + a + ' &times; ' + b + ' = ' + A.fmt(a * b) + '</span></p>';
      }
      A.bind(root, ['ma', 'mb'], mul);

      function div() {
        var n = Math.max(100, Math.min(999, parseInt($('#dv', root).value, 10) || 100));
        var d = Math.max(10, Math.min(99, parseInt($('#ds', root).value, 10) || 10));
        var q = Math.floor(n / d), r = n % d, ch = chunks(n, d);
        $('#dfig', root).innerHTML = divModel(n, d);
        var left = n, steps = ch.list.map(function (c) { var t = '<p class="math">' + d + ' &times; ' + c.q + ' = ' + c.v + ' &nbsp; ' + left + ' &minus; ' + c.v + ' = ' + (left - c.v) + '</p>'; left -= c.v; return t; }).join('');
        $('#dout', root).innerHTML = steps + '<p><span class="big">' + n + ' &divide; ' + d + ' = ' + q + (r ? ' R ' + r : '') + '</span></p>' +
          '<p>Add the chunks: ' + ch.list.map(function (c) { return c.q; }).join(' + ') + ' = ' + q + '. Check: ' + d + ' &times; ' + q + ' + ' + r + ' = ' + (d * q + r) + '.</p>';
      }
      A.bind(root, ['dv', 'ds'], div);
    },

    quiz: [
      { q: '<span class="math">8 &times; 12</span> = ?', type: 'num', answer: 96, fig: arr(8, 12, 10), hint: '8 &times; 10 = 80. Add 8 &times; 2.', explain: '80 + 16 = 96.' },
      { q: '<span class="math">23 &times; 14</span> = ?', type: 'num', answer: 322, hint: '23 &times; 10 = 230. What is 23 &times; 4?', explain: '230 + 92 = 322.' },
      { q: 'An area model of 15 &times; 12 has partial products 100, 50, 20 and 10. What is 15 &times; 12?', type: 'num', answer: 180, fig: areaModel(15, 12), hint: 'Add all four partial products.', explain: '100 + 50 + 20 + 10 = 180.' },
      { q: '<span class="math">372 &divide; 12</span> = ?', type: 'num', answer: 31, hint: 'Start with 12 &times; 30 = 360.', explain: '360 + 12 = 372, so 30 + 1 = 31.' },
      { q: '<span class="math">250 &divide; 24</span> = ?', type: 'mc', options: ['10 R 10', '10 R 1', '11 R 2', '9 R 34'], answer: 0, hint: '24 &times; 10 = 240.', explain: '250 &minus; 240 = 10, so 10 R 10.' },
      { q: '250 students are going on a trip. Each bus holds 24 students. How many buses are needed?', type: 'num', answer: 11, unit: 'buses', hint: 'What happens to the students left over?', explain: '250 &divide; 24 = 10 R 10. Ten buses leave 10 students behind, so 11 buses.' },
      { q: 'Which is the same as <span class="math">6 &times; 47</span>?', type: 'mc', options: ['6 &times; 40 + 6 &times; 7', '6 &times; 40 + 7', '6 + 40 &times; 7', '60 &times; 47'], answer: 0, hint: 'Break 47 into 40 + 7. Both parts get multiplied by 6.', explain: '6 &times; 47 = 6 &times; 40 + 6 &times; 7 = 240 + 42 = 282.' }
    ],

    quick: ['md-facts', 'md-mult', 'md-mult', 'md-div', 'md-rem', 'md-props'],

    practice: [
      { id: 'md-facts', name: 'Facts to 12 &times; 12', code: 'B2.2', gen: function (lv) {
        var a = R.int(2, lv === 1 ? 9 : 12), b = R.int(lv === 1 ? 2 : 6, lv === 1 ? 9 : 12), p = a * b;
        if (lv < 3) return { q: '<span class="math">' + a + ' &times; ' + b + '</span> = ?', type: 'num', answer: p,
          fig: arr(a, b, b > 5 ? 5 : 0),
          hint: b > 10 ? 'Break it apart: ' + a + ' &times; 10 + ' + a + ' &times; ' + (b - 10) + '.' : 'Use a fact you know nearby, like ' + a + ' &times; ' + (b - 1) + ' or ' + a + ' &times; 10.',
          steps: b > 5 ? ['Break ' + b + ' into 5 + ' + (b - 5) + '.', a + ' &times; 5 = ' + a * 5 + ' and ' + a + ' &times; ' + (b - 5) + ' = ' + a * (b - 5) + '.', 'Add: ' + a * 5 + ' + ' + a * (b - 5) + ' = ' + p + '.'] :
            ['Skip count by ' + a + ', ' + b + ' times.', (function () { var l = []; for (var i = 1; i <= b; i++) l.push(a * i); return l.join(', '); })() + '.', 'The last number is ' + p + '.'],
          explain: a + ' &times; ' + b + ' = ' + p + '.' };
        return { q: '<span class="math">' + p + ' &divide; ' + a + '</span> = ?', type: 'num', answer: b, hint: 'Think: ' + a + ' times what is ' + p + '?',
          steps: ['Division undoes multiplication.', 'Ask: ' + a + ' &times; ? = ' + p + '.', a + ' &times; ' + b + ' = ' + p + ', so the answer is ' + b + '. ' + p + ' dots make ' + a + ' rows of ' + b + ':<div class="fig">' + arr(a, b) + '</div>'], explain: p + ' &divide; ' + a + ' = ' + b + ' because ' + a + ' &times; ' + b + ' = ' + p + '.' };
      } },
      { id: 'md-mult', name: 'Multiply two-digit numbers', code: 'B2.6', gen: function (lv) {
        var a = R.int(12, 49), b = lv === 1 ? R.int(3, 9) : R.int(11, lv === 2 ? 29 : 49);
        if (lv === 1) { var pa = parts(a); return { q: '<span class="math">' + a + ' &times; ' + b + '</span> = ?', type: 'num', answer: a * b, fig: areaModel(a, b),
          hint: 'Use the area model: ' + pa.join(' + ') + ', each times ' + b + '.',
          steps: [pa.map(function (p) { return p + ' &times; ' + b + ' = ' + p * b; }).join('. ') + '.', 'Add the partial products.', pa.map(function (p) { return p * b; }).join(' + ') + ' = ' + a * b + '.'], explain: a + ' &times; ' + b + ' = ' + a * b + '.' }; }
        var pp = [];
        parts(b).forEach(function (q) { parts(a).forEach(function (p) { pp.push(p * q); }); });
        var ctx = lv === 3 ? 'A theatre has ' + a + ' rows with ' + b + ' seats in each row. How many seats are there?' : '<span class="math">' + a + ' &times; ' + b + '</span> = ?';
        return { q: ctx, type: 'num', answer: a * b, unit: lv === 3 ? 'seats' : '', fig: lv === 2 ? areaModel(a, b) : '',
          hint: 'Split both numbers into tens and ones. Multiply each pair, then add.',
          steps: ['Estimate: about ' + Math.round(a / 10) * 10 + ' &times; ' + Math.round(b / 10) * 10 + ' = ' + Math.round(a / 10) * 10 * Math.round(b / 10) * 10 + '.', 'Partial products: ' + pp.map(A.fmt).join(', ') + '.' + (lv === 3 ? '<div class="fig">' + areaModel(a, b) + '</div>' : ''), 'Add them: ' + A.fmt(a * b) + '.'],
          explain: a + ' &times; ' + b + ' = ' + A.fmt(a * b) + '.' };
      } },
      { id: 'md-div', name: 'Divide by a two-digit number', code: 'B2.7', gen: function (lv) {
        var d = R.int(11, lv === 1 ? 15 : 25), q = lv === 1 ? R.int(2, 9) * 10 : R.int(11, Math.floor(999 / d)), r = lv === 3 ? R.int(1, d - 1) : 0, n = d * q + r;
        if (n > 999) { q = Math.floor((999 - r) / d); n = d * q + r; }
        if (n < 100) { q = Math.ceil((100 - r) / d); n = d * q + r; }
        var ch = chunks(n, d), left = n, st = ch.list.map(function (c) { var t = d + ' &times; ' + c.q + ' = ' + c.v + ', leaving ' + (left - c.v) + '.'; left -= c.v; return t; });
        if (lv === 3) {
          var o = R.mc(q + ' R ' + r, [(q + 1) + ' R ' + r, q + ' R ' + (r + d < 999 ? Math.max(0, r - 1) : r + 1), (q - 1) + ' R ' + (r + d)]);
          return { q: '<span class="math">' + n + ' &divide; ' + d + '</span> = ?', type: 'mc', options: o.options, answer: o.answer, fig: divModel(n, d),
            hint: 'Take out chunks of ' + d + '. The remainder must be less than ' + d + '.',
            steps: st.concat(['Quotient: ' + ch.list.map(function (c) { return c.q; }).join(' + ') + ' = ' + q + '. Remainder: ' + r + '.']), explain: d + ' &times; ' + q + ' + ' + r + ' = ' + n + ', so ' + q + ' R ' + r + '.' };
        }
        return { q: '<span class="math">' + n + ' &divide; ' + d + '</span> = ?', type: 'num', answer: q, fig: lv === 1 ? divModel(n, d) : '',
          hint: 'Start with ' + d + ' &times; 10 = ' + d * 10 + '. How many tens of ' + d + ' fit?',
          steps: st.concat(['Add the chunks: ' + q + '.' + (lv === 2 ? '<div class="fig">' + divModel(n, d) + '</div>' : '')]), explain: n + ' &divide; ' + d + ' = ' + q + ' because ' + d + ' &times; ' + q + ' = ' + n + '.' };
      } },
      { id: 'md-rem', name: 'Make sense of remainders', code: 'B2.7', gen: function (lv) {
        var d = R.int(lv === 1 ? 4 : 12, lv === 1 ? 9 : 30), q = R.int(lv === 1 ? 5 : 8, lv === 1 ? 12 : 30), r = R.int(1, d - 1), n = d * q + r;
        var kind = lv === 1 ? 'up' : R.pick(['up', 'down']);
        var ctx = kind === 'up' ? R.pick([['students', 'van holds', 'vans'], ['books', 'box holds', 'boxes'], ['players', 'team has', 'teams']]) : R.pick([['eggs', 'carton holds', 'full cartons'], ['muffins', 'tray holds', 'full trays'], ['cards', 'pack has', 'full packs']]);
        var ans = kind === 'up' ? q + 1 : q;
        var text = kind === 'up' ? 'There are ' + n + ' ' + ctx[0] + '. Each ' + ctx[1] + ' ' + d + '. How many ' + ctx[2] + ' are needed so everyone fits?' :
          'There are ' + n + ' ' + ctx[0] + '. Each ' + ctx[1] + ' ' + d + '. How many ' + ctx[2] + ' can be made?';
        if (ctx[0] === 'players') text = 'There are ' + n + ' players. Each team has ' + d + ' players. How many teams are needed if every player must be on a team, even a small one?';
        return { q: text, type: 'num', answer: ans, hint: 'Find ' + n + ' &divide; ' + d + '. Then ask: what happens to the leftovers?',
          steps: [n + ' &divide; ' + d + ' = ' + q + ' R ' + r + '.', (kind === 'up' ? 'The ' + r + ' left over still need a place, so add one more.' : 'The ' + r + ' left over are not enough to fill another one, so drop them.') + (q <= 30 ? '<div class="fig">' + packs(q, r, d, kind) + '</div>' : ''), 'Answer: ' + ans + '.'],
          explain: n + ' &divide; ' + d + ' = ' + q + ' R ' + r + '. ' + (kind === 'up' ? 'Round up to ' + ans + '.' : 'Only ' + ans + ' can be full.') };
      } },
      { id: 'md-props', name: 'Properties and checking', code: 'B2.1', gen: function (lv) {
        var a = R.int(3, 9), b = R.int(2, 9) * 10 + R.int(1, 9), t = Math.floor(b / 10) * 10, o2 = b % 10;
        if (lv === 1) {
          var o = R.mc(b + ' &times; ' + a, [a + ' + ' + b, a + ' &times; ' + (b + 1), b + ' &divide; ' + a]);
          return { q: 'Which has the same answer as <span class="math">' + a + ' &times; ' + b + '</span>?', type: 'mc', options: o.options, answer: o.answer, hint: 'Order does not change a product.',
            steps: ['When you multiply, you can switch the order.', a + ' &times; ' + b + ' = ' + b + ' &times; ' + a + '.', 'Both equal ' + a * b + '.'], explain: a + ' &times; ' + b + ' = ' + b + ' &times; ' + a + ' = ' + a * b + '.' };
        }
        if (lv === 2) {
          var o3 = R.mc(a + ' &times; ' + t + ' + ' + a + ' &times; ' + o2, [a + ' &times; ' + t + ' + ' + o2, a + ' + ' + t + ' &times; ' + o2, (a * 10) + ' &times; ' + b]);
          return { q: 'Which is the same as <span class="math">' + a + ' &times; ' + b + '</span>?', type: 'mc', options: o3.options, answer: o3.answer, hint: 'Break ' + b + ' into ' + t + ' + ' + o2 + '. Both parts are multiplied by ' + a + '.',
            steps: [b + ' = ' + t + ' + ' + o2 + '.', a + ' &times; ' + b + ' = ' + a + ' &times; ' + t + ' + ' + a + ' &times; ' + o2 + '.<div class="fig">' + areaModel(b, a) + '</div>', '= ' + a * t + ' + ' + a * o2 + ' = ' + a * b + '.'], explain: a + ' &times; ' + t + ' + ' + a + ' &times; ' + o2 + ' = ' + a * b + '.' };
        }
        var d = R.int(12, 25), q = R.int(11, 40), r = R.int(1, d - 1), n = d * q + r;
        var o4 = R.mc(d + ' &times; ' + q + ' + ' + r, [d + ' &times; ' + r + ' + ' + q, q + ' + ' + d + ' + ' + r, d + ' &times; ' + q + ' &minus; ' + r]);
        return { q: 'Sam says <span class="math">' + n + ' &divide; ' + d + ' = ' + q + ' R ' + r + '</span>. Which calculation checks this?', type: 'mc', options: o4.options, answer: o4.answer,
          hint: 'Groups times group size, plus what is left over.', steps: ['Multiply the divisor by the quotient: ' + d + ' &times; ' + q + ' = ' + d * q + '.', 'Add the remainder: ' + d * q + ' + ' + r + ' = ' + n + '.', 'It matches the total, so Sam is right.'],
          explain: d + ' &times; ' + q + ' + ' + r + ' = ' + n + '.' };
      } }
    ]
  });
})();
