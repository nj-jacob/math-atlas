(function () {
  var A = Atlas, R = A.R, fr = A.fr;
  function parts(n) {
    var s = String(n), out = [];
    for (var i = 0; i < s.length; i++) { var v = +s.charAt(i) * Math.pow(10, s.length - 1 - i); if (v) out.push(v); }
    return out;
  }
  /* dot array: r rows of c dots, with an optional split after row k (break-apart strategy) */
  function array(r, c, k, label) {
    var g = Math.min(34, 380 / Math.max(c, 1), 300 / Math.max(r, 1)), rad = g * 0.36, x0 = 60, y0 = 34, s = '';
    for (var i = 0; i < r; i++) for (var j = 0; j < c; j++) {
      var top = k === undefined || i < k;
      s += '<circle cx="' + (x0 + j * g + g / 2) + '" cy="' + (y0 + i * g + g / 2 + (k !== undefined && i >= k ? 12 : 0)) + '" r="' + rad + '" style="fill:' + (top ? 'var(--strand)' : 'var(--btn)') + ';stroke:var(--ink)" stroke-width="1.2"/>';
    }
    s += '<text x="' + (x0 + c * g / 2) + '" y="22" text-anchor="middle" font-size="18" class="tb">' + c + ' in each row</text>';
    if (k === undefined) s += '<text x="' + (x0 - 10) + '" y="' + (y0 + r * g / 2 + 6) + '" text-anchor="end" font-size="18" class="tb">' + r + '</text>';
    else {
      s += '<text x="' + (x0 - 10) + '" y="' + (y0 + k * g / 2 + 6) + '" text-anchor="end" font-size="18" class="tb" style="fill:var(--strand)">' + k + '</text>' +
        '<text x="' + (x0 - 10) + '" y="' + (y0 + k * g + 12 + (r - k) * g / 2 + 6) + '" text-anchor="end" font-size="18" class="tb">' + (r - k) + '</text>' +
        '<line x1="' + (x0 - 4) + '" y1="' + (y0 + k * g + 6) + '" x2="' + (x0 + c * g + 4) + '" y2="' + (y0 + k * g + 6) + '" style="stroke:var(--ink2)" stroke-width="2" stroke-dasharray="6 4"/>';
    }
    return A.svg(Math.ceil(x0 + c * g + 16), Math.ceil(y0 + r * g + (k !== undefined ? 16 : 6)), s, label || r + ' rows of ' + c);
  }
  /* area model for a (up to 999) times b (1 digit): one rectangle per place of a, sized by value */
  function areaModel(a, b, hideProducts) {
    var pa = parts(a), W = 520, minW = 90, raw = pa.map(function (p) { return (W - 70) * p / a; }), extra = 0;
    raw.forEach(function (w) { if (w < minW) extra += minW - w; });
    var big = raw.filter(function (w) { return w >= minW; }).reduce(function (s, w) { return s + w; }, 0) || 1;
    var ws = raw.map(function (w) { return w < minW ? minW : w - extra * w / big; }), H = 40 + 12 * b, s = '', x = 50;
    pa.forEach(function (p, i) {
      var pl = String(p).length - 1;
      s += '<text x="' + (x + ws[i] / 2) + '" y="22" text-anchor="middle" font-size="19" class="tb" style="fill:var(--p' + pl + ')">' + p + '</text>' +
        '<rect x="' + x + '" y="32" width="' + ws[i] + '" height="' + H + '" style="fill:color-mix(in srgb,var(--p' + pl + ') 22%,var(--card));stroke:var(--ink)" stroke-width="2"/>' +
        (hideProducts ? '<text x="' + (x + ws[i] / 2) + '" y="' + (32 + H / 2 + 7) + '" text-anchor="middle" font-size="20" class="tb">?</text>' :
          '<text x="' + (x + ws[i] / 2) + '" y="' + (32 + H / 2 + 7) + '" text-anchor="middle" font-size="20" class="tb">' + A.fmt(p * b) + '</text>');
      x += ws[i];
    });
    s += '<text x="40" y="' + (32 + H / 2 + 7) + '" text-anchor="end" font-size="20" class="tb">' + b + '</text>';
    return A.svg(W + 10, 32 + H + 8, s, 'Area model for ' + a + ' times ' + b + (hideProducts ? '' : ': ' + pa.map(function (p) { return p + ' times ' + b + ' is ' + p * b; }).join(', ')));
  }
  /* sharing n counters among d plates, with leftovers */
  function share(n, d, label) {
    var q = Math.floor(n / d), r = n % d, cols = Math.min(d, 5), rowsP = Math.ceil(d / cols), pw = 100, ph = Math.max(70, 26 + Math.ceil(q / 4) * 18 + 12), s = '';
    for (var i = 0; i < d; i++) {
      var px = 10 + (i % cols) * (pw + 8), py = 8 + Math.floor(i / cols) * (ph + 10);
      s += '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + ph + '" rx="16" style="fill:color-mix(in srgb,var(--strand) 10%,var(--card));stroke:var(--strand)" stroke-width="2"/>';
      for (var k = 0; k < q; k++) s += '<circle cx="' + (px + 20 + (k % 4) * 20) + '" cy="' + (py + 20 + Math.floor(k / 4) * 18) + '" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="1.2"/>';
      s += '<text x="' + (px + pw / 2) + '" y="' + (py + ph - 8) + '" text-anchor="middle" font-size="16" class="tb">' + q + '</text>';
    }
    var yL = 8 + rowsP * (ph + 10) + 6;
    if (r) {
      s += '<text x="10" y="' + (yL + 18) + '" font-size="17" class="tb" style="fill:var(--bad)">left over:</text>';
      for (var j = 0; j < r; j++) s += '<circle cx="' + (112 + j * 20) + '" cy="' + (yL + 12) + '" r="7" style="fill:var(--btn);stroke:var(--ink)" stroke-width="1.2"/>';
    }
    return A.svg(10 + cols * (pw + 8), yL + (r ? 30 : 0), s, label || n + ' shared among ' + d + ': ' + q + ' each' + (r ? ', ' + r + ' left over' : ''));
  }
  /* place value shift: n moves k places left (times) or right (divide) */
  function shift(n, k, dir) {
    var res = dir === 'x' ? n * Math.pow(10, k) : n / Math.pow(10, k), cw = 64, L = 6, s = '', x0 = 20;
    var heads = ['hund. th.', 'ten th.', 'thous.', 'hund.', 'tens', 'ones'];
    for (var i = 0; i < L; i++) {
      var p = L - 1 - i;
      s += '<rect x="' + (x0 + i * cw) + '" y="2" width="' + (cw - 4) + '" height="26" rx="6" style="fill:var(--p' + Math.min(p, 5) + ')"/><text x="' + (x0 + i * cw + (cw - 4) / 2) + '" y="20" text-anchor="middle" font-size="13" font-weight="700" style="fill:' + (p ? '#fff' : '#2a211b') + '">' + heads[i] + '</text>';
    }
    function rowDigits(v, y, col) {
      var str = String(v), h = '';
      for (var j = 0; j < str.length; j++) { var p = str.length - 1 - j; h += '<text x="' + (x0 + (L - 1 - p) * cw + (cw - 4) / 2) + '" y="' + y + '" text-anchor="middle" font-size="32" font-weight="700" style="font-family:var(--display)' + (col ? ';fill:' + col : '') + '">' + str.charAt(j) + '</text>'; }
      return h;
    }
    s += rowDigits(n, 66) + rowDigits(res, 150, 'var(--accent)');
    s += '<defs><marker id="mdsh" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--ink2)"/></marker></defs>';
    var mid = x0 + L * cw / 2;
    s += '<line x1="' + (mid + (dir === 'x' ? 40 : -40)) + '" y1="94" x2="' + (mid + (dir === 'x' ? 40 - 60 * Math.min(k, 3) : -40 + 60 * k)) + '" y2="94" style="stroke:var(--ink2)" stroke-width="3" marker-end="url(#mdsh)"/>' +
      '<text x="' + mid + '" y="120" text-anchor="middle" font-size="16" class="t2">' + (dir === 'x' ? 'each digit moves ' + k + ' place' + (k > 1 ? 's' : '') + ' left' : 'each digit moves 1 place right') + '</text>';
    return A.svg(x0 + L * cw + 10, 162, s, n + (dir === 'x' ? ' times ' + Math.pow(10, k) : ' divided by 10') + ' is ' + A.fmt(res));
  }
  /* double number line for a rate: "per" items for each 1 unit */
  function rateLine(per, n, unitA, unitB, hide) {
    var W = 540, x0 = 30, x1 = 520, s = '';
    s += '<line x1="' + x0 + '" y1="40" x2="' + x1 + '" y2="40" style="stroke:var(--ink)" stroke-width="2.5"/><line x1="' + x0 + '" y1="100" x2="' + x1 + '" y2="100" style="stroke:var(--ink)" stroke-width="2.5"/>';
    s += '<text x="' + x0 + '" y="20" font-size="16" class="t2">' + unitA + '</text><text x="' + x0 + '" y="134" font-size="16" class="t2">' + unitB + '</text>';
    for (var i = 0; i <= n; i++) {
      var x = x0 + (x1 - x0 - 20) * i / n + 10, last = i === n;
      s += '<line x1="' + x + '" y1="32" x2="' + x + '" y2="48" style="stroke:var(--ink)" stroke-width="2"/><line x1="' + x + '" y1="92" x2="' + x + '" y2="108" style="stroke:var(--ink)" stroke-width="2"/>' +
        '<text x="' + x + '" y="70" text-anchor="middle" font-size="18" class="tb" style="fill:var(--strand)">' + i + '</text>' +
        '<text x="' + x + '" y="' + (i % 2 ? 128 : 84) + '" text-anchor="middle" font-size="18" class="tb"' + (last && hide ? ' style="fill:var(--bad)"' : '') + '>' + (last && hide ? '?' : A.fmt(per * i)) + '</text>';
    }
    return A.svg(W, 140, s, 'Double number line: ' + per + ' ' + unitB + ' for each ' + unitA.replace(/s$/, ''));
  }

  var gen = {
    facts: function (lv) {
      var a = lv === 1 ? R.pick([2, 3, 4, 5, 10]) : R.int(3, 9), b = lv === 1 ? R.int(1, 10) : R.int(4, 9);
      if (lv === 3 && R.int(0, 1)) {
        var p = a * b;
        return { q: 'Divide: <span class="math">' + p + ' &divide; ' + a + '</span>', type: 'num', answer: b,
          hint: 'Think of the multiplication fact: ' + a + ' &times; what = ' + p + '?', steps: ['Division undoes multiplication.', 'Find the fact: ' + a + ' &times; ' + b + ' = ' + p + '.', 'So ' + p + ' &divide; ' + a + ' = ' + b + '.'],
          explain: a + ' &times; ' + b + ' = ' + p + ', so ' + p + ' &divide; ' + a + ' = ' + b + '.' };
      }
      var known = a > 5 ? 5 : 2, rest = a - known;
      return { q: 'Multiply: <span class="math">' + a + ' &times; ' + b + '</span>', type: 'num', answer: a * b,
        fig: lv === 1 ? array(a, b) : '', hint: a > 5 ? 'Break it apart: ' + known + ' &times; ' + b + ' and ' + rest + ' &times; ' + b + '. Add them.' : 'Count by ' + b + 's, ' + a + ' times. Or turn it around: ' + b + ' &times; ' + a + '.',
        steps: a > 2 ? ['Break ' + a + ' into ' + known + ' and ' + rest + '.<div class="fig">' + array(a, b, known) + '</div>', known + ' &times; ' + b + ' = ' + known * b + ' and ' + rest + ' &times; ' + b + ' = ' + rest * b + '.', known * b + ' + ' + rest * b + ' = ' + a * b + '.'] : ['Double ' + b + ': ' + b + ' + ' + b + ' = ' + a * b + '.'],
        explain: a + ' &times; ' + b + ' = ' + a * b + '.' };
    },
    tens: function (lv) {
      if (lv === 3 && R.int(0, 1)) {
        var n = R.int(2, 99) * 10;
        return { q: 'Divide: <span class="math">' + A.fmt(n) + ' &divide; 10</span>', type: 'num', answer: n / 10,
          hint: 'Dividing by 10 moves each digit one place to the right. The 0 in the ones place drops off.', steps: ['Each digit moves 1 place right.<div class="fig">' + shift(n, 1, 'd') + '</div>', A.fmt(n) + ' &divide; 10 = ' + n / 10 + '.'], explain: A.fmt(n) + ' &divide; 10 = ' + n / 10 + '.' };
      }
      var k = lv === 1 ? 1 : R.int(1, 3), m = lv === 1 ? R.int(2, 99) : lv === 2 ? R.int(2, 9) * (k === 3 ? 1 : R.pick([1, 10])) : R.int(11, 99);
      if (m * Math.pow(10, k) > 99999) k = 2;
      var f = Math.pow(10, k), ans = m * f;
      return { q: 'Multiply: <span class="math">' + m + ' &times; ' + A.fmt(f) + '</span>', type: 'num', answer: ans,
        fig: lv === 1 ? shift(m, k, 'x') : '', hint: 'Times ' + f + ' moves each digit ' + k + ' place' + (k > 1 ? 's' : '') + ' left. Zeros fill the empty places.',
        steps: ['Times ' + A.fmt(f) + ' moves each digit ' + k + ' place' + (k > 1 ? 's' : '') + ' to the left.<div class="fig">' + shift(m, k, 'x') + '</div>', 'Fill the empty places with zeros: ' + A.fmt(ans) + '.'], explain: m + ' &times; ' + A.fmt(f) + ' = ' + A.fmt(ans) + '.' };
    },
    mult: function (lv) {
      var a = lv === 1 ? R.int(12, 49) : lv === 2 ? R.int(23, 99) : R.int(102, 999), b = lv === 1 ? R.int(2, 5) : R.int(3, 9);
      var pa = parts(a);
      return { q: 'Multiply: <span class="math">' + a + ' &times; ' + b + '</span>', type: 'num', answer: a * b,
        fig: lv < 3 ? areaModel(a, b, true) : '', hint: 'Break ' + a + ' into ' + pa.join(' + ') + '. Multiply each part by ' + b + ', then add.',
        steps: ['Break ' + a + ' into place value parts: ' + pa.join(' + ') + '.', pa.map(function (p) { return p + ' &times; ' + b + ' = ' + A.fmt(p * b); }).join('. ') + '.<div class="fig">' + areaModel(a, b) + '</div>', 'Add the parts: ' + pa.map(function (p) { return A.fmt(p * b); }).join(' + ') + ' = ' + A.fmt(a * b) + '.'],
        explain: a + ' &times; ' + b + ' = ' + A.fmt(a * b) + '.' };
    },
    div: function (lv) {
      var d = lv === 1 ? R.int(2, 5) : R.int(3, 9), q = lv === 1 ? R.int(3, 9) : lv === 2 ? R.int(11, 30) : R.int(21, 99), r = lv === 1 ? R.int(0, d - 1) : R.int(1, d - 1), n = d * q + r;
      if (lv === 3 && n > 999) { q = Math.floor(990 / d); n = d * q + r; }
      var steps = lv === 1 ? ['Share ' + n + ' into ' + d + ' equal groups.<div class="fig">' + share(n, d) + '</div>', 'Each group gets ' + q + '.' + (r ? ' ' + r + ' are left over.' : '')] :
        ['Use a fact you know: ' + d + ' &times; ' + (Math.floor(q / 10) * 10) + ' = ' + d * Math.floor(q / 10) * 10 + '.', 'What is left: ' + n + ' &minus; ' + d * Math.floor(q / 10) * 10 + ' = ' + (n - d * Math.floor(q / 10) * 10) + '. ' + (n - d * Math.floor(q / 10) * 10) + ' &divide; ' + d + ' = ' + (q % 10) + (r ? ' with ' + r + ' left over' : '') + '.', 'Add the groups: ' + Math.floor(q / 10) * 10 + ' + ' + (q % 10) + ' = ' + q + '.'];
      return { q: 'Divide: <span class="math">' + n + ' &divide; ' + d + '</span>. How many in each group? ' + (r ? '<span class="t2">(There will be some left over.)</span>' : ''), type: 'num', answer: q,
        fig: lv === 1 ? share(n, d, n + ' counters to share among ' + d + ' plates').replace(/<circle[^>]*\/>/g, '').replace(/<text[^>]*>\d+<\/text>/g, '').replace(/left over:/, '') : '',
        hint: 'How many groups of ' + d + ' fit in ' + n + '? Use a multiplication fact.', steps: steps,
        explain: n + ' &divide; ' + d + ' = ' + q + (r ? ' R' + r + '. Check: ' + d + ' &times; ' + q + ' + ' + r + ' = ' + n + '.' : '. Check: ' + d + ' &times; ' + q + ' = ' + n + '.') };
    },
    rem: function (lv) {
      var d = R.pick([2, 3, 4, 5, 6, 8, 10]), q = R.int(1, 6), r = R.int(1, d - 1), n = d * q + r;
      var things = R.pick([['pizzas', 'friends'], ['loaves of banana bread', 'families'], ['sheets of paper', 'students']]);
      if (lv === 3) {
        var ctx = R.pick([
          { t: n + ' students go on a trip. Each van holds ' + d + '. How many vans are needed?', a: q + 1, e: q + ' vans hold ' + d * q + '. The ' + r + ' left over still need a van, so round <b>up</b> to ' + (q + 1) + '.' },
          { t: n + ' eggs are packed in boxes of ' + d + '. How many boxes can be filled?', a: q, e: 'Only full boxes count. ' + q + ' boxes are full, and ' + r + ' eggs are left over.' }
        ]);
        return { q: ctx.t, type: 'num', answer: ctx.a, hint: 'Divide first: ' + n + ' &divide; ' + d + ' = ' + q + ' R' + r + '. Then think: what does the leftover mean here?',
          steps: [n + ' &divide; ' + d + ' = ' + q + ' R' + r + '.', ctx.e], explain: ctx.e };
      }
      var right = A.mixed(q, r, d), o = R.mc(right, [A.mixed(q, r, 10) === right ? A.mixed(q + 1, 0, d) : A.mixed(q, r, 10), A.mixed(q, d - r === r ? r + 1 : d - r, d), A.mixed(r, q, d) === right ? A.mixed(q + 1, r, d) : A.mixed(r, q, d)]);
      return { q: n + ' ' + things[0] + ' are shared equally among ' + d + ' ' + things[1] + '. The leftovers are cut into equal pieces too. How much does each get?', type: 'mc', options: o.options, answer: o.answer,
        fig: lv === 1 ? share(n, d) : '', hint: 'Divide: each gets ' + q + ' whole, and ' + r + ' are left. Those ' + r + ' are shared among ' + d + ', so each gets ' + r + ' of ' + d + ' equal parts.',
        steps: [n + ' &divide; ' + d + ' = ' + q + ' R' + r + '.', 'The ' + r + ' left over are cut and shared among ' + d + '. Each gets ' + fr(r, d) + ' more.', 'Each gets ' + right + '.'],
        explain: 'Each gets ' + q + ' whole and ' + fr(r, d) + ', which is ' + right + '.' };
    },
    rate: function (lv) {
      var per = R.int(2, 9), n = lv === 1 ? R.int(3, 5) : R.int(4, 9);
      var ctx = R.pick([['packs', 'juice boxes', 'There are ' + per + ' juice boxes in each pack.'], ['hours', 'kilometres', 'A cyclist rides ' + per + ' km each hour.'], ['weeks', 'dollars', 'Sam saves $' + per + ' each week.']]);
      if (lv === 3) {
        var tot = per * n;
        return { q: ctx[2] + ' How many ' + ctx[0] + ' to get ' + tot + ' ' + ctx[1] + '?', type: 'num', answer: n,
          hint: 'Count by ' + per + 's until you reach ' + tot + '. Or divide: ' + tot + ' &divide; ' + per + '.', steps: ['Each ' + ctx[0].replace(/s$/, '') + ' gives ' + per + '.', tot + ' &divide; ' + per + ' = ' + n + '.<div class="fig">' + rateLine(per, n, ctx[0], ctx[1]) + '</div>'], explain: n + ' ' + ctx[0] + ' give ' + tot + ' ' + ctx[1] + '.' };
      }
      return { q: ctx[2] + ' How many ' + ctx[1] + ' in ' + n + ' ' + ctx[0] + '?', type: 'num', answer: per * n,
        fig: lv === 1 ? rateLine(per, n, ctx[0], ctx[1], true) : '', hint: 'Each ' + ctx[0].replace(/s$/, '') + ' adds ' + per + '. Multiply ' + n + ' &times; ' + per + '.',
        steps: ['The rate is ' + per + ' ' + ctx[1] + ' for each 1.', n + ' &times; ' + per + ' = ' + per * n + '.'], explain: n + ' &times; ' + per + ' = ' + per * n + ' ' + ctx[1] + '.' };
    }
  };

  A.register('multiply-divide', {
    html:
'<section class="sec"><h2><span class="n">1</span>Multiplication facts with arrays</h2>' +
'<p>An <b>array</b> is objects in equal rows. 4 rows of 6 is <span class="math">4 &times; 6 = 24</span>. Turn the array on its side and it is 6 rows of 4: still 24. The order of the numbers does not change the product.</p>' +
'<p>For a fact you do not know yet, <b>break it apart</b> into facts you know. 7 &times; 8 is 5 &times; 8 and 2 &times; 8: 40 + 16 = 56.</p>' +
'<div class="lab"><span class="lt">Try it: build and break an array</span>' +
'<div class="ctrl"><label for="mdr">Rows: <output id="mdro"></output><input type="range" id="mdr" min="1" max="10" value="7"></label><label for="mdc">In each row: <output id="mdco"></output><input type="range" id="mdc" min="1" max="10" value="8"></label><label for="mdk">Break after row: <output id="mdko"></output><input type="range" id="mdk" min="0" max="10" value="5"></label></div>' +
'<div class="fig" id="mdfig"></div><div class="out" id="mdout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Every multiplication fact gives a division fact. 7 &times; 8 = 56, so 56 &divide; 8 = 7 and 56 &divide; 7 = 8. These four facts are a <b>fact family</b>.</p></div>' +
'<div class="tbl"><table><thead><tr><th>&times;</th>' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (r) { return '<tr><th>' + r + '</th>' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (c) { return '<td' + (r === c ? ' style="background:color-mix(in srgb,var(--hi) 30%,var(--card))"' : '') + '>' + r * c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' +
'<p class="t2">The shaded squares are the doubles: 1 &times; 1, 2 &times; 2, and so on. The table is the same on both sides of them, because 3 &times; 7 = 7 &times; 3.</p>' +
A.yt({ gen: function () { return gen.facts(2); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Times 10, 100 and 1000</h2>' +
'<p>Multiplying by 10 makes every digit worth 10 times as much, so each digit moves <b>one place left</b>. A 0 fills the ones place. Times 100 moves digits two places. Times 1000 moves them three places.</p>' +
'<div class="lab"><span class="lt">Try it: watch the digits move</span>' +
'<div class="ctrl"><label for="mdsn">Number<input type="number" id="mdsn" min="1" max="99" value="46"></label><label for="mdsk">Operation<select id="mdsk"><option value="x1">&times; 10</option><option value="x2" selected>&times; 100</option><option value="x3">&times; 1000</option><option value="d1">&divide; 10</option></select></label></div>' +
'<div class="fig" id="mdsfig"></div><div class="out" id="mdsout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Saying "just add a zero" for dividing. Dividing by 10 moves digits one place <b>right</b>: 460 &divide; 10 = 46. A 0 in the ones place drops off.</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A box holds 100 pencils. How many pencils are in 37 boxes? 37 &times; 100: move each digit two places left. <b>3700 pencils</b>.</p></div>' +
A.yt({ gen: function () { return gen.tens(2); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Multiplying bigger numbers</h2>' +
'<p>To multiply a two- or three-digit number by a one-digit number, use the same three steps every time:</p>' +
'<ol><li><b>Break</b> the big number into place value parts: 246 = 200 + 40 + 6.</li><li><b>Multiply</b> each part.</li><li><b>Add</b> the parts.</li></ol>' +
'<div class="lab"><span class="lt">Try it: area model</span>' +
'<div class="ctrl"><label for="mda">Number (10 to 999)<input type="number" id="mda" min="10" max="999" value="246"></label><label for="mdb">Times (1 to 9): <output id="mdbo"></output><input type="range" id="mdb" min="1" max="9" value="3"></label></div>' +
'<div class="fig" id="mdafig"></div><div class="out" id="mdaout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A school orders 4 boxes of 128 markers. 128 &times; 4 = 100 &times; 4 + 20 &times; 4 + 8 &times; 4 = 400 + 80 + 32 = <b>512 markers</b>.</p><div class="fig">' + areaModel(128, 4) + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Multiplying only the ones. In 128 &times; 4, every part gets multiplied: the 100, the 20 and the 8.</p></div>' +
A.yt({ gen: function () { return gen.mult(2); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Dividing and leftovers</h2>' +
'<p>Dividing means sharing into equal groups. Sometimes things do not share evenly. What is left is called the <b>remainder</b>. 14 &divide; 4 = 3 R2 means 3 in each group, and 2 left over.</p>' +
'<div class="lab"><span class="lt">Try it: share counters</span>' +
'<div class="ctrl"><label for="mdn">Counters: <output id="mdno"></output><input type="range" id="mdn" min="1" max="60" value="14"></label><label for="mdd">Groups: <output id="mddo"></output><input type="range" id="mdd" min="1" max="10" value="4"></label></div>' +
'<div class="fig" id="mddfig"></div><div class="out" id="mddout"></div></div>' +
'<p>If the leftovers can be cut, like pizzas or loaves, share them too. 14 pizzas among 4 people: each gets 3 whole pizzas and ' + fr(2, 4) + ' of a pizza, which is <b>3 ' + fr(2, 4) + '</b>.</p>' +
'<p>For bigger numbers, use a fact with tens first. 87 &divide; 3: 3 &times; 20 = 60, and 27 is left. 3 &times; 9 = 27. So 87 &divide; 3 = 20 + 9 = <b>29</b>.</p>' +
'<div class="key"><b class="t">Key idea</b><p>Check a division with multiplication: groups &times; number in each group + remainder = the start number. 4 &times; 3 + 2 = 14.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Ignoring the story. 26 students, 4 per van: 26 &divide; 4 = 6 R2. You need <b>7</b> vans, because the 2 extra students still need a ride.</p></div>' +
A.yt({ gen: function () { return gen.div(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Rates: the same amount each time</h2>' +
'<p>A <b>rate</b> says how much for each one: 6 juice boxes in each pack, 8 km each hour, $5 each week. If you know the amount for 1, multiply to find the amount for any number.</p>' +
'<div class="lab"><span class="lt">Try it: double number line</span>' +
'<div class="ctrl"><label for="mdpr">Amount for 1: <output id="mdpro"></output><input type="range" id="mdpr" min="1" max="12" value="6"></label><label for="mdpn">How many: <output id="mdpno"></output><input type="range" id="mdpn" min="1" max="10" value="4"></label></div>' +
'<div class="fig" id="mdpfig"></div><div class="out" id="mdpout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Sam saves $5 each week. After 7 weeks: 7 &times; 5 = <b>$35</b>. To save $50: 50 &divide; 5 = <b>10 weeks</b>.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Some problems need two steps. Solve one step at a time, and say what each answer means. 3 packs of 6 juice boxes, and 5 are drunk: 3 &times; 6 = 18, then 18 &minus; 5 = 13 left.</p></div>' +
A.yt({ gen: function () { return gen.rate(1); } }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function iv(id) { return parseInt($('#' + id, root).value, 10) || 0; }
      function ar() {
        var r = iv('mdr'), c = iv('mdc'), k = Math.min(iv('mdk'), r);
        $('#mdro', root).textContent = r; $('#mdco', root).textContent = c; $('#mdko', root).textContent = k;
        var split = k > 0 && k < r;
        $('#mdfig', root).innerHTML = array(r, c, split ? k : undefined);
        $('#mdout', root).innerHTML = '<p><span class="big">' + r + ' &times; ' + c + ' = ' + r * c + '</span></p>' +
          (split ? '<p><b style="color:var(--strand)">' + k + ' &times; ' + c + ' = ' + k * c + '</b> and <b>' + (r - k) + ' &times; ' + c + ' = ' + (r - k) * c + '</b>. Together: ' + k * c + ' + ' + (r - k) * c + ' = ' + r * c + '.</p>' : '<p class="t2">Move "Break after row" to split the array into two facts.</p>') +
          '<p>Fact family: ' + r + ' &times; ' + c + ' = ' + r * c + ', ' + c + ' &times; ' + r + ' = ' + r * c + ', ' + r * c + ' &divide; ' + c + ' = ' + r + ', ' + r * c + ' &divide; ' + r + ' = ' + c + '.</p>';
      }
      A.bind(root, ['mdr', 'mdc', 'mdk'], ar);
      function sh() {
        var n = Math.max(1, Math.min(99, iv('mdsn'))), op = $('#mdsk', root).value, k = +op.charAt(1);
        if (op.charAt(0) === 'd' && n % 10) {
          $('#mdsfig', root).innerHTML = '';
          $('#mdsout', root).innerHTML = '<p>Pick a number that ends in 0 to divide by 10 in Grade 4, like 40 or 70.</p>';
          return;
        }
        $('#mdsfig', root).innerHTML = shift(n, k, op.charAt(0));
        var res = op.charAt(0) === 'x' ? n * Math.pow(10, k) : n / 10;
        $('#mdsout', root).innerHTML = '<p><span class="big">' + n + ' ' + (op.charAt(0) === 'x' ? '&times; ' + A.fmt(Math.pow(10, k)) : '&divide; 10') + ' = ' + A.fmt(res) + '</span></p>';
      }
      A.bind(root, ['mdsn', 'mdsk'], sh);
      function am() {
        var a = Math.max(10, Math.min(999, iv('mda'))), b = iv('mdb'), pa = parts(a);
        $('#mdbo', root).textContent = b;
        $('#mdafig', root).innerHTML = areaModel(a, b);
        $('#mdaout', root).innerHTML = '<p><b>Break:</b> ' + a + ' = ' + pa.join(' + ') + '</p><p><b>Multiply:</b> ' + pa.map(function (p) { return p + ' &times; ' + b + ' = ' + A.fmt(p * b); }).join(', ') + '</p><p><b>Add:</b> ' + pa.map(function (p) { return A.fmt(p * b); }).join(' + ') + ' = <span class="big">' + A.fmt(a * b) + '</span></p>';
      }
      A.bind(root, ['mda', 'mdb'], am);
      function dv() {
        var n = iv('mdn'), d = iv('mdd'), q = Math.floor(n / d), r = n % d;
        $('#mdno', root).textContent = n; $('#mddo', root).textContent = d;
        $('#mddfig', root).innerHTML = share(n, d);
        $('#mddout', root).innerHTML = '<p><span class="big">' + n + ' &divide; ' + d + ' = ' + q + (r ? ' R' + r : '') + '</span></p><p>' + d + ' groups of ' + q + (r ? ', with ' + r + ' left over' : '') + '. Check: ' + d + ' &times; ' + q + (r ? ' + ' + r : '') + ' = ' + n + '.</p>' +
          (r ? '<p>If the leftovers can be cut and shared, each group gets ' + A.mixed(q, r, d) + '.</p>' : '<p>No remainder: ' + n + ' shares evenly.</p>');
      }
      A.bind(root, ['mdn', 'mdd'], dv);
      function rt() {
        var per = iv('mdpr'), n = iv('mdpn');
        $('#mdpro', root).textContent = per; $('#mdpno', root).textContent = n;
        $('#mdpfig', root).innerHTML = rateLine(per, n, 'packs', 'juice boxes');
        $('#mdpout', root).innerHTML = '<p>' + per + ' juice boxes in each pack. ' + n + ' pack' + (n > 1 ? 's' : '') + ': <span class="big">' + n + ' &times; ' + per + ' = ' + n * per + '</span></p>';
      }
      A.bind(root, ['mdpr', 'mdpn'], rt);
    },

    quiz: [
      { q: 'Multiply: <span class="math">7 &times; 8</span>', type: 'num', answer: 56, hint: 'Break it apart: 5 &times; 8 and 2 &times; 8.', explain: '40 + 16 = 56.' },
      { q: 'Which is <span class="math">63 &divide; 9</span>?', type: 'mc', options: ['6', '7', '8', '9'], answer: 1, hint: 'Think: 9 &times; what = 63?', explain: '9 &times; 7 = 63, so 63 &divide; 9 = 7.' },
      { q: 'Multiply: <span class="math">45 &times; 100</span>', type: 'num', answer: 4500, hint: 'Times 100 moves each digit two places left.', explain: '45 &times; 100 = 4500.' },
      { q: 'Multiply: <span class="math">236 &times; 4</span>', type: 'num', answer: 944, fig: areaModel(236, 4, true), hint: 'Break 236 into 200 + 30 + 6. Multiply each part by 4.', explain: '800 + 120 + 24 = 944.' },
      { q: '<span class="math">29 &divide; 4</span> is 7 with how many left over?', type: 'num', answer: 1, fig: share(29, 4), hint: '4 &times; 7 = 28. How far is 28 from 29?', explain: '4 &times; 7 = 28, and 29 &minus; 28 = 1. So 29 &divide; 4 = 7 R1.' },
      { q: '13 pizzas are shared equally among 4 friends. How much pizza does each get?', type: 'mc', options: [A.mixed(3, 1, 4), A.mixed(3, 1, 3), A.mixed(4, 1, 4), '3 R4'], answer: 0, hint: '13 &divide; 4 = 3 R1. The 1 leftover pizza is cut into 4 pieces.', explain: 'Each gets 3 whole pizzas and ' + fr(1, 4) + ' more: 3 ' + fr(1, 4) + '.' },
      { q: 'A cyclist rides 8 km each hour. How far in 6 hours?', type: 'num', answer: 48, unit: 'km', fig: rateLine(8, 6, 'hours', 'kilometres', true), hint: 'Each hour adds 8 km. Multiply 6 &times; 8.', explain: '6 &times; 8 = 48 km.' }
    ],

    practice: [
      { id: 'md4-facts', name: 'Facts to 10 &times; 10', code: 'B2.2', gen: gen.facts },
      { id: 'md4-tens', name: 'Times 10, 100, 1000', code: 'B2.3', gen: gen.tens },
      { id: 'md4-mult', name: 'Multiply by one digit', code: 'B2.5', gen: gen.mult },
      { id: 'md4-div', name: 'Divide with remainders', code: 'B2.6', gen: gen.div },
      { id: 'md4-rem', name: 'What to do with leftovers', code: 'B2.6', gen: gen.rem },
      { id: 'md4-rate', name: 'Rates', code: 'B2.8', gen: gen.rate }
    ]
  });
})();
