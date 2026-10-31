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
      var right = A.mixed(q, r, d), o = R.mc(right, [A.mixed(q, r, 10) === right ? A.mixed(q + 1, 0, d) : A.mixed(q, r, 10), d - r === r ? A.mixed(q + 1, r, d) : A.mixed(q, d - r, d), A.mixed(r, q, d) === right ? A.mixed(q + 1, r, d) : A.mixed(r, q, d)]);
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

  /* ---------- one idea at a time ---------- */
  var K = A.kit;
  function T(name, lv) { return function () { return gen[name](lv); }; }
  var OPS = [['1', '&times; 10'], ['2', '&times; 100'], ['3', '&times; 1000']];

  var LESSONS = [
    { id: 'facts', title: 'Facts with arrays', sub: 'Equal rows, broken into facts you know.', concepts: [
      { id: 'arrays', title: 'Arrays: equal rows', exp: ['B2.2'], skill: 'md4-facts',
        body: '<p>An <b>array</b> is objects in equal rows. 4 rows of 6 is <span class="math">4 &times; 6 = 24</span>. Turn it on its side: 6 rows of 4 is still 24.</p>',
        watch: K.watch([
          ['4 rows of 6.', array(4, 6), 1600],
          ['Count by 6s: 6, 12, 18, <b>24</b>. So 4 &times; 6 = 24.', array(4, 6, undefined, '4 rows of 6 is 24'), 2000],
          ['Turn it: 6 rows of 4. Still <b>24</b>. 6 &times; 4 = 4 &times; 6.', array(6, 4), 2200]
        ]),
        try: K.lab({ controls: [
          { id: 'r', label: 'Rows', min: 1, max: 10, value: 4 }, { id: 'c', label: 'In each row', min: 1, max: 10, value: 6 }],
          render: function (s) { return { fig: array(s.r, s.c), out: '<p class="big math">' + s.r + ' &times; ' + s.c + ' = ' + s.r * s.c + '</p>' }; },
          tasks: [
            { do: 'Make <b>24</b> with an array that is not 4 rows of 6.', goal: function (s) { return s.r * s.c === 24 && s.r !== 4; }, yes: function (s) { return s.r + ' rows of ' + s.c + ' is also 24.'; } },
            { do: 'Make an array with <b>7 rows</b> that has <b>56</b> dots.', goal: function (s) { return s.r === 7 && s.c === 8; }, yes: '7 &times; 8 = 56.' },
            { do: 'Find a <b>square</b> array with 49 dots.', goal: function (s) { return s.r === 7 && s.c === 7; }, yes: '7 &times; 7 = 49. Same rows and columns.' }
          ] }),
        key: '<p><b>Rows &times; number in each row = total.</b> The order does not change the product.</p>',
        check: [T('facts', 1), T('facts', 1)] },

      { id: 'break-apart', title: 'Break a fact apart', exp: ['B2.2'], skill: 'md4-facts', hard: true,
        body: '<p>For a fact you do not know yet, <b>break the array</b> into two facts you do know. Then add.</p>',
        watch: K.watch([
          ['7 &times; 8. Hard to count.', array(7, 8), 1600],
          ['Break the 7 rows into 5 and 2.', array(7, 8, 5), 1800],
          ['5 &times; 8 = 40 and 2 &times; 8 = 16.', array(7, 8, 5, '5 rows of 8 is 40, 2 rows of 8 is 16'), 2000],
          ['40 + 16 = <b>56</b>. So 7 &times; 8 = 56.', array(7, 8, 5, '7 times 8 is 56'), 2000]
        ]),
        try: K.lab({ controls: [
          { id: 'r', label: 'Rows', min: 2, max: 10, value: 7 }, { id: 'c', label: 'In each row', min: 1, max: 10, value: 8 }, { id: 'k', label: 'Break after row', min: 1, max: 9, value: 5 }],
          render: function (s) {
            var k = Math.min(s.k, s.r - 1);
            return { fig: array(s.r, s.c, k), out: '<p class="math"><b style="color:var(--strand)">' + k + ' &times; ' + s.c + ' = ' + k * s.c + '</b> and ' + (s.r - k) + ' &times; ' + s.c + ' = ' + (s.r - k) * s.c + '</p><p class="big math">' + k * s.c + ' + ' + (s.r - k) * s.c + ' = ' + s.r * s.c + '</p>' };
          },
          tasks: [
            { do: 'Show <b>6 &times; 9</b> broken into <b>5 &times; 9</b> and <b>1 &times; 9</b>.', goal: function (s) { return s.r === 6 && s.c === 9 && Math.min(s.k, 5) === 5; }, yes: '45 + 9 = 54.' },
            { do: 'Show <b>8 &times; 7</b> broken into two equal halves.', goal: function (s) { return s.r === 8 && s.c === 7 && s.k === 4; }, yes: '4 &times; 7 = 28, twice: 28 + 28 = 56.' }
          ] }),
        ways: [
          { label: 'Double a fact', html: '<p>6 &times; 7 is double 3 &times; 7. 3 &times; 7 = 21, and 21 + 21 = <b>42</b>.</p><div class="fig">' + array(6, 7, 3) + '</div>' },
          { label: 'Start from 10', html: '<p>9 &times; 6 is one row less than 10 &times; 6. 10 &times; 6 = 60, then take away one 6: 60 &minus; 6 = <b>54</b>.</p>' },
          { label: 'Use the 5s', html: '<p>Fives are easy: count by 5s. 7 &times; 6 = 5 &times; 6 + 2 &times; 6 = 30 + 12 = <b>42</b>.</p>' }
        ],
        key: '<p><b>Break the rows into two facts you know, then add.</b></p>',
        mistake: '<p>Breaking the rows but then multiplying by the wrong number, or forgetting to add the two parts. Have your child point to each part of the array and say its fact.</p>',
        check: [T('facts', 2), T('facts', 2)] },

      { id: 'family', title: 'Fact families', exp: ['B2.2'], skill: 'md4-facts',
        body: '<p>One array gives <b>four facts</b>: two multiplications and two divisions. Division undoes multiplication.</p>',
        watch: K.watch([
          ['7 rows of 8 is 56: 7 &times; 8 = 56.', array(7, 8) + '<p class="math big">7 &times; 8 = 56</p>', 1800],
          ['8 &times; 7 = 56 too.', array(7, 8) + '<p class="math big">7 &times; 8 = 56<br>8 &times; 7 = 56</p>', 1600],
          ['56 shared into 7 rows: 8 in each. 56 &divide; 7 = 8.', array(7, 8) + '<p class="math big">7 &times; 8 = 56<br>8 &times; 7 = 56<br>56 &divide; 7 = 8</p>', 1800],
          ['And 56 &divide; 8 = 7.', array(7, 8) + '<p class="math big">7 &times; 8 = 56<br>8 &times; 7 = 56<br>56 &divide; 7 = 8<br>56 &divide; 8 = 7</p>', 2000]
        ]),
        key: '<p>To divide, <b>think of the multiplication fact</b>. 56 &divide; 8: 8 &times; what = 56?</p>',
        check: [T('facts', 3), T('facts', 3)] }
    ] },

    { id: 'tens', title: 'Times 10, 100 and 1000', sub: 'Digits move; zeros fill the gaps.', concepts: [
      { id: 'times10', title: 'Multiply by 10, 100, 1000', exp: ['B2.3'], skill: 'md4-tens',
        body: '<p>Times 10 makes every digit worth 10 times as much, so each digit moves <b>one place left</b>. Times 100: two places. Times 1000: three places.</p>',
        watch: K.watch([
          ['46 &times; 10: each digit moves 1 place left. A 0 fills the ones.', shift(46, 1, 'x'), 2200],
          ['46 &times; 100: 2 places left.', shift(46, 2, 'x'), 2000],
          ['46 &times; 1000: 3 places left. <b>46 000</b>.', shift(46, 3, 'x'), 2200]
        ]),
        try: K.lab({ controls: [
          { id: 'n', label: 'Number', type: 'number', min: 1, max: 99, value: 46 }, { id: 'k', label: 'Operation', type: 'select', options: OPS }],
          render: function (s) { var k = +s.k; s.res = s.n * Math.pow(10, k); return { fig: shift(s.n, k, 'x'), out: '<p class="big math">' + s.n + ' &times; ' + A.fmt(Math.pow(10, k)) + ' = ' + A.fmt(s.res) + '</p>' }; },
          tasks: [
            { do: 'Make <b>3700</b>.', goal: function (s) { return s.res === 3700; }, yes: '37 &times; 100 = 3700.' },
            { do: 'Make <b>8000</b> using <b>&times; 100</b>.', goal: function (s) { return s.res === 8000 && s.k === '2'; }, yes: '80 &times; 100 = 8000. Also 8 &times; 1000.' }
          ] }),
        key: '<p>Times 10, 100, 1000: <b>each digit moves 1, 2 or 3 places left</b>. Zeros fill the empty places.</p>',
        check: [T('tens', 1), T('tens', 2)] },

      { id: 'divide10', title: 'Divide by 10', exp: ['B2.3'], skill: 'md4-tens',
        body: '<p>Dividing by 10 does the opposite: each digit moves <b>one place right</b>. The 0 in the ones place drops off.</p>',
        watch: K.watch([
          ['460 &divide; 10.', shift(460, 0, 'x').replace(/each digit moves 0 places? left/, ''), 1400],
          ['Each digit moves 1 place right. 460 &divide; 10 = <b>46</b>.', shift(460, 1, 'd'), 2200]
        ]),
        try: K.lab({ controls: [{ id: 'n', label: 'Number', min: 10, max: 990, step: 10, value: 460 }],
          render: function (s) { return { fig: shift(s.n, 1, 'd'), out: '<p class="big math">' + s.n + ' &divide; 10 = ' + s.n / 10 + '</p>' }; },
          tasks: [{ do: 'Find the number that gives <b>64</b> when you divide by 10.', goal: function (s) { return s.n === 640; }, yes: '640 &divide; 10 = 64.' }] }),
        key: '<p>Divide by 10: <b>each digit moves 1 place right</b>.</p>',
        mistake: '<p>"Just add a zero" also for dividing (460 &divide; 10 = 4600). Ask: "Should the answer be bigger or smaller?"</p>',
        check: [T('tens', 3), T('tens', 3)] }
    ] },

    { id: 'multiplying', title: 'Multiplying bigger numbers', sub: 'Break, multiply, add.', concepts: [
      { id: 'two-digit', title: 'Break it into tens and ones', exp: ['B2.5'], skill: 'md4-mult', hard: true,
        body: '<p>To multiply 34 &times; 6, <b>break</b> 34 into 30 + 4. <b>Multiply</b> each part by 6. <b>Add</b> the parts.</p>',
        watch: K.watch([
          ['34 &times; 6. Break 34 into 30 and 4.', areaModel(34, 6, true), 2000],
          ['30 &times; 6 = 180 and 4 &times; 6 = 24.', areaModel(34, 6), 2200],
          ['Add the parts: 180 + 24 = <b>204</b>.', areaModel(34, 6) + '<p class="math big">180 + 24 = 204</p>', 2200]
        ]),
        ways: [
          { label: 'Repeated groups', html: '<p>34 &times; 6 is six groups of 34. Six 30s are 180. Six 4s are 24. Together: <b>204</b>.</p>' },
          { label: 'With money', html: '<p>6 friends each pay $34. Each pays three $10 bills and four loonies. Bills: 18 &times; $10 = $180. Loonies: 24 &times; $1 = $24. Total: <b>$204</b>.</p>' }
        ],
        key: '<p><b>Break. Multiply each part. Add.</b></p>',
        mistake: '<p>Multiplying only the ones (34 &times; 6 = 3 tens and 24 = 54), or 3 &times; 6 instead of 30 &times; 6. Point to the 3 and ask: "What is this 3 really worth?"</p>',
        check: [T('mult', 1), T('mult', 2)] },

      { id: 'three-digit', title: 'Three-digit numbers', exp: ['B2.5'], skill: 'md4-mult',
        body: '<p>The same three steps work for bigger numbers: 246 = 200 + 40 + 6.</p>',
        watch: K.watch([
          ['246 &times; 3. Break 246 into 200, 40 and 6.', areaModel(246, 3, true), 2000],
          ['Multiply each part: 600, 120, 18.', areaModel(246, 3), 2200],
          ['600 + 120 + 18 = <b>738</b>.', areaModel(246, 3) + '<p class="math big">600 + 120 + 18 = 738</p>', 2200]
        ]),
        try: K.lab({ controls: [
          { id: 'a', label: 'Number (10 to 999)', type: 'number', min: 10, max: 999, value: 128 }, { id: 'b', label: 'Times', min: 1, max: 9, value: 4 }],
          render: function (s) { var pa = parts(s.a); s.p = s.a * s.b; return { fig: areaModel(s.a, s.b), out: '<p class="math">' + pa.map(function (p) { return A.fmt(p * s.b); }).join(' + ') + ' = <b class="big">' + A.fmt(s.p) + '</b></p>' }; },
          tasks: [
            { do: 'Show <b>246 &times; 3</b>.', goal: function (s) { return s.a === 246 && s.b === 3; }, yes: '738.' },
            { do: 'Find a product between <b>1000 and 1100</b>.', goal: function (s) { return s.p >= 1000 && s.p <= 1100; }, yes: function (s) { return s.a + ' &times; ' + s.b + ' = ' + A.fmt(s.p) + '.'; } }
          ] }),
        key: '<p><b>Break. Multiply each part. Add.</b> Every part gets multiplied.</p>',
        check: [T('mult', 3), T('mult', 3)] }
    ] },

    { id: 'dividing', title: 'Dividing and leftovers', sub: 'Share equally; decide what leftovers mean.', concepts: [
      { id: 'share', title: 'Share into equal groups', exp: ['B2.6'], skill: 'md4-div',
        body: '<p>Dividing means sharing into equal groups. What cannot be shared is the <b>remainder</b>. 14 &divide; 4 = 3 R2.</p>',
        watch: K.watch([
          ['14 counters, 4 plates. Deal one to each plate.', share(4, 4), 1300],
          ['Deal again.', share(8, 4), 1100],
          ['And again.', share(12, 4), 1100],
          ['2 are left. Not enough for every plate. 14 &divide; 4 = <b>3 R2</b>.', share(14, 4), 2400]
        ]),
        try: K.lab({ controls: [{ id: 'n', label: 'Counters', min: 1, max: 60, value: 14 }, { id: 'd', label: 'Groups', min: 1, max: 10, value: 4 }],
          render: function (s) { var q = Math.floor(s.n / s.d), r = s.n % s.d; return { fig: share(s.n, s.d), out: '<p class="big math">' + s.n + ' &divide; ' + s.d + ' = ' + q + (r ? ' R' + r : '') + '</p><p class="t2">Check: ' + s.d + ' &times; ' + q + (r ? ' + ' + r : '') + ' = ' + s.n + '</p>' }; },
          tasks: [
            { do: 'Share <b>20</b> counters into <b>6</b> groups.', goal: function (s) { return s.n === 20 && s.d === 6; }, yes: '3 each, 2 left over: 20 &divide; 6 = 3 R2.' },
            { do: 'Find more than 30 counters that share into <b>4</b> groups with <b>none</b> left over.', goal: function (s) { return s.d === 4 && s.n > 30 && s.n % 4 === 0; }, yes: function (s) { return s.n + ' &divide; 4 = ' + s.n / 4 + ', no remainder.'; } }
          ] }),
        key: '<p><b>Groups &times; number in each + remainder = start number.</b></p>',
        check: [T('div', 1), T('div', 1)] },

      { id: 'bigger', title: 'Divide bigger numbers', exp: ['B2.6'], skill: 'md4-div', hard: true,
        body: '<p>For 87 &divide; 3, use a fact with <b>tens</b> first: 3 &times; 20 = 60. Then divide what is left.</p>',
        watch: K.watch([
          ['87 &divide; 3. Think: 3 &times; what is close to 87? 3 &times; 20 = 60.', areaModel(20, 3), 2200],
          ['87 &minus; 60 = 27 left. 3 &times; 9 = 27.', areaModel(29, 3), 2200],
          ['20 + 9 = <b>29</b>. So 87 &divide; 3 = 29.', areaModel(29, 3) + '<p class="math big">87 &divide; 3 = 29</p>', 2200]
        ]),
        ways: [
          { label: 'Share the blocks', html: '<p>87 is 8 tens and 7 ones. Share 8 tens among 3: each gets 2 tens, and 2 tens are left. Break them into 20 ones: now 27 ones. Each gets 9. Each has 2 tens and 9 ones: <b>29</b>.</p>' },
          { label: 'Check by multiplying', html: '<p>Guess, then check. Is it 30? 3 &times; 30 = 90, too big by 3. So take one away: 29. 3 &times; 29 = <b>87</b>.</p>' }
        ],
        key: '<p><b>Use a tens fact first, then divide what is left.</b> Add the two answers.</p>',
        mistake: '<p>Dividing each digit on its own (87 &divide; 3 as 8 &divide; 3 and 7 &divide; 3) and losing the leftovers. Ask: "What happens to the tens that do not share evenly?"</p>',
        check: [T('div', 2), T('div', 3)] },

      { id: 'leftovers', title: 'What do the leftovers mean?', exp: ['B2.6'], skill: 'md4-rem', hard: true,
        body: '<p>The story decides what to do with a remainder. <b>Round up</b> when everyone needs a spot. <b>Drop it</b> when only full groups count. <b>Share it</b> when it can be cut.</p>',
        watch: K.watch([
          ['26 students, 4 per van. 26 &divide; 4 = 6 R2.', share(26, 4), 2000],
          ['The 2 extra students still need a ride: <b>7 vans</b>.', share(26, 4) + '<p class="big">Round up: 7 vans</p>', 2200],
          ['26 eggs in boxes of 4? Only <b>6</b> boxes are full.', share(26, 4) + '<p class="big">Full boxes only: 6</p>', 2200],
          ['26 pizzas among 4? Cut the 2 extra: each gets <b>6 ' + fr(2, 4) + '</b>.', share(26, 4) + '<p class="big">Share it: 6 ' + fr(2, 4) + '</p>', 2400]
        ]),
        ways: [
          { label: 'Ask a question', html: '<p>After dividing, ask: <b>"Can the leftovers be left out, do they need their own group, or can they be cut?"</b></p><div class="tbl"><table><thead><tr><th>Story</th><th>Leftovers</th></tr></thead><tbody><tr><td>Vans, tables, boxes needed</td><td>Round up</td></tr><tr><td>Full boxes, full teams</td><td>Drop them</td></tr><tr><td>Pizza, bread, money</td><td>Cut and share</td></tr></tbody></table></div>' }
        ],
        key: '<p><b>The story decides:</b> round up, drop the remainder, or share it.</p>',
        mistake: '<p>Writing "6 R2 vans". A remainder is not an answer to a real question. Ask: "Where do the 2 extra students sit?"</p>',
        check: [T('rem', 1), T('rem', 3)] }
    ] },

    { id: 'rates', title: 'Rates', sub: 'The same amount for each one.', concepts: [
      { id: 'rate', title: 'The same amount each time', exp: ['B2.8'], skill: 'md4-rate',
        body: '<p>A <b>rate</b> says how much for each one: 6 juice boxes in each pack. Multiply to find the amount for any number of packs.</p>',
        watch: K.watch([1, 2, 3, 4].map(function (n) { return [n === 4 ? '4 packs: 4 &times; 6 = <b>24</b> juice boxes.' : n + ' pack' + (n > 1 ? 's' : '') + ': ' + 6 * n + ' juice boxes.', rateLine(6, n, 'packs', 'juice boxes'), n === 4 ? 2200 : 1300]; })),
        try: K.lab({ controls: [{ id: 'p', label: 'Amount for 1', min: 1, max: 12, value: 6 }, { id: 'n', label: 'How many', min: 1, max: 10, value: 4 }],
          render: function (s) { return { fig: rateLine(s.p, s.n, 'weeks', 'dollars'), out: '<p class="big math">' + s.n + ' &times; $' + s.p + ' = $' + s.p * s.n + '</p>' }; },
          tasks: [
            { do: 'Sam saves <b>$5 each week</b>. Show how much after <b>7 weeks</b>.', goal: function (s) { return s.p === 5 && s.n === 7; }, yes: '7 &times; $5 = $35.' },
            { do: 'At $5 a week, how many weeks to save <b>$45</b>? Show it.', goal: function (s) { return s.p === 5 && s.n === 9; }, yes: '9 weeks. 45 &divide; 5 = 9.' }
          ] }),
        key: '<p>Know the amount for 1? <b>Multiply</b> to find more. Know the total? <b>Divide</b>.</p>',
        check: [T('rate', 1), T('rate', 2)] },

      { id: 'how-many', title: 'How many to reach a total?', exp: ['B2.8'], skill: 'md4-rate',
        body: '<p>If you know the total and the amount for each one, <b>divide</b> (or count by the rate) to find how many.</p>',
        watch: K.watch([
          ['A cyclist rides 8 km each hour. How many hours to ride 40 km?', rateLine(8, 5, 'hours', 'kilometres', true).replace('>?<', '>40<'), 2200],
          ['Count by 8s: 8, 16, 24, 32, 40. That is <b>5 hours</b>. 40 &divide; 8 = 5.', rateLine(8, 5, 'hours', 'kilometres'), 2400]
        ]),
        key: '<p>Total &divide; amount for each = <b>how many</b>.</p>',
        mistake: '<p>Multiplying when the total is already known (8 &times; 40). Ask: "Do we know the total, or the amount for one?"</p>',
        check: [T('rate', 3), T('rate', 3)] }
    ] }
  ];

  A.register('multiply-divide', {
    lessons: LESSONS,
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

  /* ---------- More ways to ask (question shapes; see docs/QUESTIONS.md) ----------
     q.meta holds the facts that tests/verify/grade4.js uses to work each answer out again. */
  var why = K.why, nm = A.Q && A.Q.name;
  var SHAPES = {
    'md4-facts': [
      [1, 'tap', function (lv) {
        var a = lv === 1 ? R.int(2, 5) : R.int(3, 7), b = R.int(a + 1, 9), set = R.shuffle([[a, b], [a, b - 1], [a + 1, b]]);
        return { q: 'Which array shows <b>' + a + ' &times; ' + b + '</b>? It has ' + a + ' rows of ' + b + '. Tap it.', type: 'tap', tiles: set.map(function (s) { return array(s[0], s[1], undefined, s[0] + ' rows of ' + s[1] + ' dots'); }),
          answer: set.map(String).indexOf(String([a, b])), answerText: 'the array with ' + a + ' rows of ' + b,
          hint: 'Count the rows first. Then count the dots in one row.', steps: ['You need ' + a + ' rows.', 'Each row needs ' + b + ' dots.'],
          explain: a + ' rows of ' + b + ' make ' + a * b + ' dots: ' + a + ' &times; ' + b + ' = ' + a * b + '.', meta: { k: 'md4-facts-tap', a: a, b: b, set: set } };
      }],
      [1, 'match', function (lv) {
        var pairs = [], seen = {};
        while (pairs.length < 3) { var a = lv === 1 ? R.pick([2, 3, 4, 5, 10]) : R.int(3, 9), b = R.int(2, 10), p = a * b; if (seen[p]) continue; seen[p] = 1; pairs.push([a + ' &times; ' + b, String(p)]); }
        return { q: 'Match each fact to its product.', type: 'match', pairs: pairs, hint: 'Use a fact you know, then add or take away one group.',
          steps: ['A product is the answer to a multiplication.'], explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'md4-facts-match', pairs: pairs } };
      }],
      [2, 'mistake', function () {
        var a = R.int(6, 9), b = R.int(6, 9), who = nm(), truth = !R.int(0, 2), said = truth ? a * b : a * b + R.pick([-a, a, -b, b]);
        var right = a + ' &times; ' + b + ' = ' + a * b + '. Check: ' + '5 &times; ' + b + ' = ' + 5 * b + ', and ' + (a - 5) + ' more group' + (a - 5 === 1 ? '' : 's') + ' of ' + b + ' make ' + a * b + '.';
        return { q: who + ' says <span class="math">' + a + ' &times; ' + b + ' = ' + said + '</span>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['The product of two one-digit numbers is always less than 50.', 'You add the two numbers to multiply.', 'Turning the fact around changes the answer.']),
          hint: 'Break it apart: 5 groups and ' + (a - 5) + ' more.', steps: [right], explain: right, meta: { k: 'md4-facts-tf', a: a, b: b, said: said } };
      }],
      [2, 'fill', function () {
        var a = R.int(3, 9), b = R.int(3, 9), p = a * b;
        return { q: 'Fill in the fact family.', type: 'fill', fill: '<span class="math">' + a + ' &times; ' + b + ' = [[]]</span><br><span class="math">[[]] &divide; ' + a + ' = ' + b + '</span><br><span class="math">' + p + ' &divide; ' + b + ' = [[]]</span>', answers: [p, p, a],
          fig: array(a, b), hint: 'Multiplication and division use the same three numbers.', steps: [a + ' &times; ' + b + ' = ' + p + '.', 'So ' + p + ' &divide; ' + a + ' = ' + b + ' and ' + p + ' &divide; ' + b + ' = ' + a + '.'],
          explain: 'The fact family uses ' + a + ', ' + b + ' and ' + p + '.', meta: { k: 'md4-facts-fill', a: a, b: b } };
      }]
    ],
    'md4-tens': [
      [1, 'fill', function () {
        var m = R.int(2, 9) * (R.int(0, 2) ? 1 : 11);
        return { q: 'Fill in the pattern.', type: 'fill', fill: '<span class="math">' + m + ' &times; 10 = [[]]</span><br><span class="math">' + m + ' &times; 100 = [[]]</span><br><span class="math">' + m + ' &times; 1000 = [[]]</span>', answers: [m * 10, m * 100, m * 1000],
          fig: shift(m, 1, 'x'), hint: 'Each time, the digits move one more place to the left.', steps: ['&times; 10: one place left. &times; 100: two places. &times; 1000: three places.'],
          explain: m + ' &times; 10 = ' + A.fmt(m * 10) + ', ' + m + ' &times; 100 = ' + A.fmt(m * 100) + ', ' + m + ' &times; 1000 = ' + A.fmt(m * 1000) + '.', meta: { k: 'md4-tens-fill', m: m } };
      }],
      [1, 'mistake', function () {
        var m = R.int(12, 99), k = R.int(1, 3), f = Math.pow(10, k), who = nm(), truth = !R.int(0, 2), said = truth ? m * f : R.int(0, 1) ? m * f * 10 : m * f / 10;
        if (said > 99999) said = m * f / 10;
        var right = 'Times ' + A.fmt(f) + ' moves each digit ' + k + ' place' + (k > 1 ? 's' : '') + ' left: ' + m + ' &times; ' + A.fmt(f) + ' = ' + A.fmt(m * f) + '.';
        return { q: who + ' says <span class="math">' + m + ' &times; ' + A.fmt(f) + ' = ' + A.fmt(said) + '</span>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Times ' + A.fmt(f) + ' adds ' + A.fmt(f) + ' to the number.', 'You always add three zeros.', 'The digits move to the right.']),
          hint: 'How many zeros does ' + A.fmt(f) + ' have?', steps: [right], explain: right, meta: { k: 'md4-tens-tf', m: m, f: f, said: said } };
      }],
      [2, 'match', function () {
        var m = R.int(3, 9) * 10 + R.int(1, 9), pairs = [[m + ' &times; 10', A.fmt(m * 10)], [m + ' &times; 100', A.fmt(m * 100)], [m + ' &times; 1000', A.fmt(m * 1000)]];
        return { q: 'Match each product to its answer.', type: 'match', pairs: pairs, hint: 'Count the zeros in 10, 100 and 1000.', steps: ['Times 10 adds one 0 at the end, times 100 adds two, times 1000 adds three.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'md4-tens-match', pairs: pairs } };
      }],
      [3, 'story', function () {
        var c = R.pick([['crayons', 'A box holds', 100], ['sheets of paper', 'A pack has', 100], ['beads', 'A jar holds', 1000], ['loonies', 'A roll has', 10]]), n = R.int(2, 9) * (c[2] === 10 ? 11 : 1);
        return { q: c[1] + ' ' + A.fmt(c[2]) + ' ' + c[0] + '. How many ' + c[0] + ' are in <b>' + n + '</b>?', type: 'num', answer: n * c[2],
          hint: 'Multiply ' + n + ' by ' + A.fmt(c[2]) + '.', steps: [n + ' &times; ' + A.fmt(c[2]) + ' = ' + A.fmt(n * c[2]) + '.'],
          explain: n + ' groups of ' + A.fmt(c[2]) + ' make ' + A.fmt(n * c[2]) + ' ' + c[0] + '.', meta: { k: 'md4-tens-story', n: n, f: c[2] } };
      }]
    ],
    'md4-mult': [
      [1, 'fill', function (lv) {
        var a = lv === 1 ? R.int(12, 49) : R.int(23, 99), b = lv === 1 ? R.int(2, 5) : R.int(3, 9);
        if (a % 10 === 0) a++;
        var t = a - a % 10, o = a % 10;
        return { q: 'Use the area model. Fill in the parts, then the total.', type: 'fill', fill: '<span class="math">' + a + ' &times; ' + b + ' = [[]] + [[]] = [[]]</span>', answers: [t * b, o * b, a * b],
          fig: areaModel(a, b, true), hint: 'Break ' + a + ' into ' + t + ' + ' + o + '. Multiply each part by ' + b + '.', steps: [t + ' &times; ' + b + ' = ' + t * b + '.', o + ' &times; ' + b + ' = ' + o * b + '.', t * b + ' + ' + o * b + ' = ' + a * b + '.'],
          explain: a + ' &times; ' + b + ' = ' + a * b + '.', meta: { k: 'md4-mult-fill', a: a, b: b } };
      }],
      [1, 'story', function (lv) {
        var c = R.pick([['boxes', 'pencils', 'A school orders', 'Each box has'], ['buses', 'students', 'A trip uses', 'Each bus carries'], ['rows', 'chairs', 'The gym has', 'Each row has']]);
        var n = lv === 1 ? R.int(2, 5) : R.int(3, 9), per = lv === 1 ? R.int(12, 30) : R.int(24, 99);
        return { q: c[2] + ' <b>' + n + '</b> ' + c[0] + '. ' + c[3] + ' <b>' + per + '</b> ' + c[1] + '. How many ' + c[1] + ' in all?', type: 'num', answer: n * per,
          hint: 'Equal groups: multiply ' + n + ' &times; ' + per + '.', steps: ['Break ' + per + ' into ' + parts(per).join(' + ') + '.', parts(per).map(function (p) { return n + ' &times; ' + p + ' = ' + n * p; }).join('. ') + '.', 'Add: ' + n * per + '.'],
          explain: n + ' &times; ' + per + ' = ' + n * per + ' ' + c[1] + '.', meta: { k: 'md4-mult-story' } };
      }],
      [2, 'mistake', function () {
        var a = R.int(23, 99), b = R.int(3, 9), who = nm(), t = a - a % 10, o = a % 10;
        if (!o) { a++; o = 1; }
        var truth = !R.int(0, 2), said = truth ? a * b : t * b + o;
        var right = truth ? 'Both parts were multiplied: ' + t + ' &times; ' + b + ' + ' + o + ' &times; ' + b + ' = ' + a * b + '.' : 'The ones were not multiplied. ' + t + ' &times; ' + b + ' + ' + o + ' &times; ' + b + ' = ' + a * b + '.';
        return { q: who + ' says <span class="math">' + a + ' &times; ' + b + ' = ' + said + '</span>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Only the tens need to be multiplied.', 'Multiply the digits and add them.', 'The answer is always ' + a + ' + ' + b + '.']),
          hint: 'Break ' + a + ' into tens and ones. Multiply each part.', steps: [right], explain: right, meta: { k: 'md4-mult-tf', a: a, b: b, said: said } };
      }]
    ],
    'md4-div': [
      [1, 'fill', function (lv) {
        var d = lv === 1 ? R.int(2, 5) : R.int(3, 9), q = lv === 1 ? R.int(3, 9) : R.int(11, 30), r = R.int(1, d - 1), n = d * q + r;
        return { q: 'Divide. Fill in how many in each group and how many are left over.', type: 'fill', fill: '<span class="math">' + n + ' &divide; ' + d + ' = [[]] R [[]]</span>', answers: [q, r],
          fig: lv === 1 ? share(n, d) : '', hint: 'Find the biggest fact of ' + d + ' that is not more than ' + n + '.', steps: [d + ' &times; ' + q + ' = ' + d * q + '.', n + ' &minus; ' + d * q + ' = ' + r + ' left over.'],
          explain: n + ' &divide; ' + d + ' = ' + q + ' R' + r + '.', meta: { k: 'md4-div-fill', n: n, d: d } };
      }],
      [1, 'story', function (lv) {
        var who = nm(), d = lv === 1 ? R.int(2, 5) : R.int(3, 8), q = lv === 1 ? R.int(3, 9) : R.int(11, 25), r = R.int(0, d - 1), n = d * q + r;
        return { q: who + ' shares <b>' + n + '</b> hockey cards equally among <b>' + d + '</b> friends. How many cards does each friend get?' + (r ? ' <span class="t2">(Some are left over.)</span>' : ''), type: 'num', answer: q,
          hint: 'Divide ' + n + ' by ' + d + '.', steps: [d + ' &times; ' + q + ' = ' + d * q + '.', r ? r + ' cards are left over.' : 'Nothing is left over.'],
          explain: 'Each friend gets ' + q + ' cards.', meta: { k: 'md4-div-story' } };
      }],
      [2, 'mistake', function () {
        var d = R.int(3, 7), q = R.int(11, 25), r = R.int(0, d - 3), n = d * q + r, who = nm(), truth = !R.int(0, 2), sq = truth ? q : q - 1, sr = truth ? r : r + d;
        var right = truth ? d + ' &times; ' + q + ' + ' + r + ' = ' + n + ', and ' + r + ' is less than ' + d + '.' : 'The leftover, ' + sr + ', is ' + d + ' or more, so one more fits in each group. ' + n + ' &divide; ' + d + ' = ' + q + ' R' + r + '.';
        return { q: who + ' says <span class="math">' + n + ' &divide; ' + d + ' = ' + sq + ' R' + sr + '</span>. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Any leftover is fine as long as the total is right.', 'A remainder must be bigger than the divisor.', 'Division never has leftovers.']),
          hint: 'The leftover must be less than ' + d + '.', steps: [right], explain: right, meta: { k: 'md4-div-tf', n: n, d: d, sq: sq, sr: sr } };
      }]
    ],
    'md4-rem': [
      [1, 'which', function () {
        var d = R.pick([3, 4, 5, 6, 8]), q = R.int(2, 6), r = R.int(1, d - 1), n = d * q + r, kind = R.pick(['up', 'drop', 'share']);
        var t = kind === 'up' ? n + ' campers go canoeing. Each canoe holds ' + d + '. How many canoes do they need?' : kind === 'drop' ? n + ' muffins go in boxes of ' + d + '. How many boxes can be filled?' : n + ' pizzas are shared by ' + d + ' teams. How much pizza does each team get?';
        var ways = ['Round up: the leftovers need one more', 'Drop the leftovers: only full ones count', 'Cut the leftovers into equal parts'], pick = { up: 0, drop: 1, share: 2 }[kind];
        var ans = kind === 'up' ? q + 1 + ' canoes' : kind === 'drop' ? q + ' boxes' : A.mixed(q, r, d) + ' pizzas';
        return { q: t + ' <b>What do you do with the leftovers?</b> <span class="t2">(' + n + ' &divide; ' + d + ' = ' + q + ' R' + r + ')</span>', type: 'mc', options: ways, answer: pick,
          hint: 'Think about the real thing. Can people be left behind? Can a box be half full? Can a pizza be cut?', steps: [ways[pick] + '.', 'The answer is ' + ans + '.'],
          explain: ways[pick] + '. The answer is ' + ans + '.', meta: { k: 'md4-rem-which', kind: kind } };
      }],
      [1, 'mistake', function () {
        var d = R.pick([4, 5, 6, 8]), q = R.int(3, 8), r = R.int(1, d - 1), n = d * q + r, who = nm(), truth = !R.int(0, 1), said = truth ? q + 1 : q;
        var right = q + ' vans carry ' + d * q + ' students. The other ' + r + ' still need a ride, so ' + (q + 1) + ' vans are needed.';
        return { q: n + ' students go on a trip. Each van holds ' + d + '. ' + who + ' says <b>' + said + '</b> vans are enough. True or false: ' + who + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Leftover students can stay at school.', 'You always drop the remainder.', 'Each van can hold one extra student.']),
          hint: n + ' &divide; ' + d + ' = ' + q + ' R' + r + '. Who rides with the leftover students?', steps: [right], explain: right, meta: { k: 'md4-rem-tf', n: n, d: d, said: said } };
      }],
      [2, 'fill', function () {
        var d = R.pick([3, 4, 5, 6]), q = R.int(3, 9), r = R.int(1, d - 1), n = d * q + r;
        return { q: n + ' tennis balls go in cans of ' + d + '. Every ball must go in a can. Fill in the blanks.', type: 'fill', fill: '<span class="math">' + n + ' &divide; ' + d + ' = [[]] R [[]]</span><br>Cans needed: [[]]', answers: [q, r, q + 1],
          hint: 'The leftover balls need a can too.', steps: [n + ' &divide; ' + d + ' = ' + q + ' R' + r + '.', 'The ' + r + ' extra ball' + (r > 1 ? 's need' : ' needs') + ' one more can: ' + (q + 1) + '.'],
          explain: q + 1 + ' cans are needed.', meta: { k: 'md4-rem-fill', n: n, d: d } };
      }]
    ],
    'md4-rate': [
      [1, 'line', function (lv) {
        var per = R.int(2, lv === 1 ? 5 : 9), n = R.int(2, 9);
        return { q: 'A snail crawls <b>' + per + ' cm</b> each minute. Place where it is after <b>' + n + ' minutes</b>.', type: 'line', min: 0, max: per * 10, tick: per, every: per * 5, snap: per, answer: per * n, tol: 0,
          hint: 'Each jump is ' + per + ' cm. Make ' + n + ' jumps.', steps: [n + ' &times; ' + per + ' = ' + per * n + ' cm.'],
          explain: 'After ' + n + ' minutes the snail has gone ' + per * n + ' cm.', meta: { k: 'md4-rate-line', per: per, n: n } };
      }],
      [1, 'which', function () {
        var per = R.int(3, 9), n = R.int(3, 9), mult = !R.int(0, 1), who = nm();
        var t = mult ? who + ' earns $' + per + ' each week for chores. How much after ' + n + ' weeks?' : who + ' earns $' + per + ' each week. How many weeks to earn $' + per * n + '?';
        var opts = ['Multiply', 'Divide'];
        return { q: t + ' <b>Which way?</b> Pick the operation.', type: 'mc', options: opts, answer: mult ? 0 : 1,
          hint: 'Do you know the number of weeks, or the total?', steps: [mult ? 'You know the weeks. Multiply: ' + n + ' &times; ' + per + ' = ' + n * per + '.' : 'You know the total. Divide: ' + per * n + ' &divide; ' + per + ' = ' + n + '.'],
          explain: mult ? 'Multiply: $' + n * per + '.' : 'Divide: ' + n + ' weeks.', meta: { k: 'md4-rate-which', mult: mult } };
      }],
      [2, 'fill', function () {
        var per = R.int(3, 9), c = R.pick([['packs', 'juice boxes'], ['hours', 'km'], ['bags', 'apples']]);
        return { q: 'Each ' + c[0].replace(/s$/, '') + ' has <b>' + per + '</b> ' + c[1] + '. Fill in the rate table.', type: 'fill',
          fill: '<div class="tbl"><table><tr><th>' + c[0] + '</th><td>1</td><td>2</td><td>4</td><td>7</td></tr><tr><th>' + c[1] + '</th><td>' + per + '</td><td>[[]]</td><td>[[]]</td><td>[[]]</td></tr></table></div>', answers: [2 * per, 4 * per, 7 * per],
          hint: 'Multiply the top number by ' + per + '.', steps: ['2 &times; ' + per + ' = ' + 2 * per + '.', '4 &times; ' + per + ' = ' + 4 * per + '. 7 &times; ' + per + ' = ' + 7 * per + '.'],
          explain: 'The rate is ' + per + ' ' + c[1] + ' per ' + c[0].replace(/s$/, '') + '.', meta: { k: 'md4-rate-fill', per: per } };
      }]
    ]
  };
  Atlas.Q.shapes('multiply-divide', SHAPES);
})();
