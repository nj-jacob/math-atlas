(function () {
  var A = Atlas, R = A.R, fr = A.fr;
  var ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  /* values are kept as whole numbers of tenths (t) so there is no rounding noise: 23 means 2.3 */
  function ds(t) { return (t / 10).toFixed(1); }
  function words(t) {
    var w = Math.floor(t / 10), r = t % 10, tw = r === 1 ? 'one tenth' : ones[r] + ' tenths';
    if (!w) return r ? tw : 'zero';
    return ones[w] + (r ? ' and ' + tw : '');
  }
  /* wholes drawn as bars of 10 tenths, filled up to t tenths */
  function tenthBars(t, label, maxW) {
    var wholes = Math.max(1, Math.ceil(t / 10)), bw = Math.min(260, ((maxW || 540) - 10) / wholes - 10), s = '', cw = bw / 10;
    for (var j = 0; j < wholes; j++) {
      var x = 4 + j * (bw + 10);
      for (var i = 0; i < 10; i++) s += '<rect x="' + (x + i * cw).toFixed(1) + '" y="4" width="' + cw.toFixed(1) + '" height="46" style="fill:' + (j * 10 + i < t ? 'var(--p' + (j * 10 + i < Math.floor(t / 10) * 10 ? '0' : 'm1') + ')' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="1.5"/>';
      s += '<rect x="' + x + '" y="4" width="' + bw + '" height="46" style="fill:none;stroke:var(--ink)" stroke-width="3"/>';
      s += '<text x="' + (x + bw / 2) + '" y="74" text-anchor="middle" font-size="17" class="t2">' + (j * 10 + 10 <= t ? '1 whole' : (t - j * 10) + ' tenth' + (t - j * 10 === 1 ? '' : 's')) + '</text>';
    }
    return A.svg(Math.ceil(4 + wholes * (bw + 10)), 82, s, label || ds(t) + ' shown as ' + Math.floor(t / 10) + ' whole bars and ' + t % 10 + ' tenths');
  }
  /* ones . tenths place value chart */
  function chart(t, hl) {
    var w = Math.floor(t / 10), r = t % 10, ws = String(w);
    var h = '<div class="pv" style="max-width:' + (96 * (ws.length + 1) + 20) + 'px;margin:8px auto">';
    for (var i = 0; i < ws.length; i++) { var p = ws.length - 1 - i; h += '<div' + (hl === p ? ' class="on"' : '') + '><span class="h c' + p + '">' + ['Ones', 'Tens', 'Hundreds', 'Thousands'][p] + '</span><span class="d">' + ws.charAt(i) + '</span></div>'; }
    h += '<div class="dot">.</div><div' + (hl === -1 ? ' class="on"' : '') + '><span class="h cm1">Tenths</span><span class="d">' + r + '</span></div></div>';
    return h;
  }
  /* number line in tenths from a to b (in tenths), marks [{t, c, l}] */
  function line(a, b, marks, label, every) {
    var W = 560, x0 = 30, x1 = 530, n = b - a, s = '<line x1="' + x0 + '" y1="62" x2="' + x1 + '" y2="62" style="stroke:var(--ink)" stroke-width="3"/>';
    every = every || (n > 30 ? 5 : 1);
    for (var i = 0; i <= n; i++) {
      var v = a + i, x = x0 + (x1 - x0) * i / n, whole = v % 10 === 0;
      s += '<line x1="' + x + '" y1="' + (whole ? 48 : 55) + '" x2="' + x + '" y2="' + (whole ? 76 : 69) + '" style="stroke:var(--ink)" stroke-width="' + (whole ? 3 : 1.5) + '"/>';
      if (whole) s += '<text x="' + x + '" y="100" text-anchor="middle" font-size="20" class="tb">' + v / 10 + '</text>';
      else if (n <= 10 && i % every === 0) s += '<text x="' + x + '" y="98" text-anchor="middle" font-size="18" class="t2">' + ds(v) + '</text>';
    }
    (marks || []).forEach(function (m, k) {
      var x = x0 + (x1 - x0) * (m.t - a) / n;
      s += '<circle cx="' + x + '" cy="62" r="9" style="fill:' + (m.c || 'var(--hi)') + ';stroke:var(--ink)" stroke-width="2"/>' + (m.l ? '<text x="' + x + '" y="' + (k % 2 ? 22 : 34) + '" text-anchor="middle" font-size="18" class="tb">' + m.l + '</text>' : '');
    });
    return A.svg(W, 108, s, label || 'Number line from ' + ds(a) + ' to ' + ds(b));
  }
  /* rounding hill between two whole numbers, for a value in tenths */
  function hill(t, id) {
    var lo = Math.floor(t / 10) * 10, hi = lo + 10, f = (t - lo) / 10, up = t - lo >= 5, x = 40 + 480 * f, y = 100 - 150 * f * (1 - f), s = '';
    s += '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--accent)"/></marker></defs>';
    s += '<path d="M40 100 Q280 -50 520 100" fill="none" style="stroke:color-mix(in srgb,var(--strand) 30%,var(--line))" stroke-width="12" stroke-linecap="round"/>';
    s += '<line x1="40" y1="132" x2="520" y2="132" style="stroke:var(--ink)" stroke-width="3"/>';
    for (var i = 0; i <= 10; i++) { var tx = 40 + 48 * i; s += '<line x1="' + tx + '" y1="' + (i % 5 ? 126 : 122) + '" x2="' + tx + '" y2="' + (i % 5 ? 138 : 142) + '" style="stroke:var(--ink)" stroke-width="2"/>'; }
    [[40, ds(lo).replace('.0', '')], [280, ds(lo + 5)], [520, ds(hi).replace('.0', '')]].forEach(function (k) { s += '<text x="' + k[0] + '" y="166" text-anchor="middle" font-size="19" class="tb">' + k[1] + '</text>'; });
    if (t !== lo) s += '<path d="M' + x + ' ' + (y - 16) + ' Q' + ((x + (up ? 500 : 60)) / 2) + ' ' + (Math.min(y, 80) - 30) + ' ' + (up ? 500 : 60) + ' 86" fill="none" style="stroke:var(--accent)" stroke-width="2.5" stroke-dasharray="6 5" marker-end="url(#' + id + ')"/>';
    s += '<circle cx="' + (t === lo || !up ? 40 : 520) + '" cy="132" r="11" style="fill:none;stroke:var(--accent)" stroke-width="4"/>';
    s += '<circle cx="' + x + '" cy="' + (y - 9) + '" r="9" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/><text x="' + Math.min(Math.max(x, 60), 500) + '" y="' + (y - 26) + '" text-anchor="middle" font-size="19" class="tb">' + ds(t) + '</text>';
    return A.svg(560, 176, s, ds(t) + ' rounds to ' + (up ? hi : lo) / 10);
  }
  /* column layout with decimal points lined up */
  function cols(a, b, op, show) {
    var res = op === '+' ? a + b : a - b, L = Math.max(String(Math.floor(Math.max(a, b, res) / 10)).length, 1), cw = 44, W = 70 + (L + 2) * cw, s = '';
    function rowAt(t, y, col) {
      var w = String(Math.floor(t / 10)), h = '', xr = W - 20;
      h += '<text x="' + (xr - cw / 2) + '" y="' + y + '" text-anchor="middle" font-size="34" font-weight="700" style="font-family:var(--display)' + (col ? ';fill:' + col : '') + '">' + t % 10 + '</text>';
      h += '<text x="' + (xr - cw - 6) + '" y="' + y + '" text-anchor="middle" font-size="34" font-weight="700"' + (col ? ' style="fill:' + col + '"' : '') + '>.</text>';
      for (var i = 0; i < w.length; i++) h += '<text x="' + (xr - cw * 1.25 - 12 - (w.length - 1 - i) * cw - cw / 2 + 6) + '" y="' + y + '" text-anchor="middle" font-size="34" font-weight="700" style="font-family:var(--display)' + (col ? ';fill:' + col : '') + '">' + w.charAt(i) + '</text>';
      return h;
    }
    s += '<rect x="' + (W - 20 - cw) + '" y="8" width="' + (cw - 2) + '" height="140" rx="8" style="fill:color-mix(in srgb,var(--pm1) 20%,var(--card))"/>';
    s += '<text x="' + (W - 20 - cw / 2) + '" y="170" text-anchor="middle" font-size="15" class="t2">tenths</text>';
    s += rowAt(a, 46) + rowAt(b, 92) + '<text x="18" y="92" font-size="34" font-weight="700">' + (op === '+' ? '+' : '&minus;') + '</text>';
    s += '<line x1="10" y1="104" x2="' + (W - 14) + '" y2="104" style="stroke:var(--ink)" stroke-width="3"/>';
    if (show) s += rowAt(res, 142, 'var(--accent)');
    return A.svg(W, 178, s, ds(a) + (op === '+' ? ' plus ' : ' minus ') + ds(b) + ' with the decimal points lined up' + (show ? ', answer ' + ds(res) : ''));
  }
  function friendly(t) { return t % 10 === 0 ? String(t / 10) : ds(t); }

  var gen = {
    read: function (lv) {
      var t = lv === 1 ? R.int(1, 9) : lv === 2 ? R.int(11, 39) : R.int(10, 99);
      if (lv === 3) {
        var mode = R.int(0, 1);
        if (mode) {
          var o = R.mc(ds(t), [String(Math.floor(t / 10)) + '.' + String(t % 10 + 1 > 9 ? 0 : t % 10 + 1), String(t % 10) + '.' + Math.floor(t / 10), String(t)]);
          return { q: 'Which number is <b>' + words(t) + '</b>?', type: 'mc', options: o.options, answer: o.answer,
            hint: 'The whole number comes before the decimal point. The tenths come after it.', steps: ['"' + ones[Math.floor(t / 10)] + '" is the whole number part: ' + Math.floor(t / 10) + '.', '"' + words(t % 10) + '" goes in the tenths place: ' + t % 10 + '.', 'Together: ' + ds(t) + '.'], explain: words(t) + ' is ' + ds(t) + '.' };
        }
        return { q: 'Write as a decimal: ' + Math.floor(t / 10) + ' + ' + fr(t % 10, 10), type: 'num', answer: t / 10,
          hint: 'The whole number goes before the point. ' + fr(t % 10, 10) + ' is ' + t % 10 + ' tenths, which goes right after the point.', steps: ['Whole part: ' + Math.floor(t / 10) + '.', fr(t % 10, 10) + ' = ' + t % 10 + ' tenths.', 'The decimal is ' + ds(t) + '.' + chart(t)], explain: ds(t) + '.' };
      }
      return { q: 'Each bar is 1 whole cut into 10 tenths. What decimal is shaded?', type: 'num', answer: t / 10, fig: tenthBars(t),
        hint: 'Count the full bars for the whole number. Count the shaded tenths in the last bar.', steps: ['Full bars: ' + Math.floor(t / 10) + '. That goes before the decimal point.', 'Shaded tenths in the last bar: ' + t % 10 + '. That goes after the point.', 'The decimal is ' + ds(t) + '.'], explain: Math.floor(t / 10) + ' wholes and ' + t % 10 + ' tenths is ' + ds(t) + '.' };
    },
    frac: function (lv) {
      if (lv === 3) {
        var pairs = [[1, 2, 5], [1, 5, 2], [2, 5, 4], [3, 5, 6], [4, 5, 8]], p = R.pick(pairs);
        var o = R.mc('0.' + p[2], ['0.' + p[0], '0.' + p[1], p[0] + '.' + p[1]]);
        return { q: 'Which decimal is equal to ' + fr(p[0], p[1]) + '?', type: 'mc', options: o.options, answer: o.answer, fig: A.svg(404, 108, barsTwo(p[0], p[1], p[2]), fr(p[0], p[1]) + ' and ' + p[2] + ' tenths are the same length'),
          hint: 'Find an equal fraction with 10 parts. How many tenths fit in ' + fr(p[0], p[1]) + '?', steps: ['Each ' + fr(1, p[1]) + ' is the same as ' + 10 / p[1] + ' tenths.', fr(p[0], p[1]) + ' = ' + fr(p[2], 10) + '.', fr(p[2], 10) + ' = 0.' + p[2] + '.'], explain: fr(p[0], p[1]) + ' = ' + fr(p[2], 10) + ' = 0.' + p[2] + '.' };
      }
      var t = R.int(1, 9);
      if (lv === 2) {
        var o2 = R.mc(fr(t, 10), [fr(1, t), fr(t, 100), fr(10, t)].filter(function (x) { return x !== fr(t, 10); }));
        return { q: 'Which fraction is equal to <span class="math">0.' + t + '</span>?', type: 'mc', options: o2.options, answer: o2.answer, hint: 'The digit after the point counts tenths.', steps: ['0.' + t + ' is read "' + words(t) + '".', words(t) + ' is ' + fr(t, 10) + '.'], explain: '0.' + t + ' = ' + fr(t, 10) + '.' };
      }
      return { q: 'Write ' + fr(t, 10) + ' as a decimal.', type: 'num', answer: t / 10, fig: tenthBars(t, null, 300), hint: fr(t, 10) + ' is ' + words(t) + '. Tenths go just after the decimal point.', steps: [fr(t, 10) + ' means ' + words(t) + '.', 'There are no wholes, so write 0 before the point: 0.' + t + '.'], explain: fr(t, 10) + ' = 0.' + t + '.' };
    },
    compare: function (lv) {
      if (lv === 3) {
        var base = R.int(1, 4) * 10, nums = [];
        while (nums.length < 4) { var v = base + R.int(-9, 15); if (v > 0 && nums.indexOf(v) < 0) nums.push(v); }
        var sorted = nums.slice().sort(function (x, y) { return x - y; }), right = sorted.map(ds).join(', ');
        var o = R.mc(right, [sorted.slice().reverse().map(ds).join(', '), [sorted[1], sorted[0], sorted[2], sorted[3]].map(ds).join(', '), [sorted[0], sorted[2], sorted[1], sorted[3]].map(ds).join(', ')]);
        return { q: 'Which list is in order from <b>least to greatest</b>? <span class="t2">(' + R.shuffle(nums).map(ds).join(', ') + ')</span>', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Compare the whole number parts first. If they match, compare the tenths.', steps: ['Look at the ones digits first.', 'For the same ones digit, compare the tenths.<div class="fig">' + line(Math.floor(sorted[0] / 10) * 10, Math.ceil((sorted[3] + 1) / 10) * 10, sorted.map(function (x) { return { t: x }; })) + '</div>', 'Least to greatest: ' + right + '.'], explain: right + '.' };
      }
      var a = lv === 1 ? R.int(1, 9) : R.int(5, 45), b;
      do { b = lv === 1 ? R.int(1, 9) : (R.int(0, 1) ? a + R.pick([-1, 1]) * R.int(1, 9) : Math.floor(a / 10) * 10 + R.int(0, 9)); } while (b === a || b <= 0);
      var sym = a > b ? '&gt;' : '&lt;', o2 = R.mc(sym, ['&gt;', '&lt;', '=']), L = Math.floor(Math.min(a, b) / 10) * 10, H = Math.max(Math.ceil((Math.max(a, b) + 1) / 10) * 10, L + 10);
      return { q: 'Which symbol goes in the box? <span class="math">' + ds(a) + ' &#9633; ' + ds(b) + '</span>', type: 'mc', options: o2.options, answer: o2.answer,
        fig: lv === 1 ? line(0, 10, [{ t: a, l: ds(a) }, { t: b, l: ds(b), c: 'var(--strand)' }]) : '', hint: 'Start at the left: compare the ones, then the tenths. On a number line, greater is further right.',
        steps: ['Ones: ' + Math.floor(a / 10) + ' and ' + Math.floor(b / 10) + '. ' + (Math.floor(a / 10) === Math.floor(b / 10) ? 'Same, so compare the tenths: ' + a % 10 + ' and ' + b % 10 + '.' : 'Different, so that decides it.'), ds(a) + ' ' + sym + ' ' + ds(b) + '.<div class="fig">' + line(L, H, [{ t: a, l: ds(a) }, { t: b, l: ds(b), c: 'var(--strand)' }]) + '</div>'],
        explain: ds(a) + ' ' + sym + ' ' + ds(b) + '.' };
    },
    round: function (lv) {
      var t = lv === 1 ? R.int(1, 9) + R.int(1, 5) * 10 : R.int(10, 99);
      if (lv === 3 && R.int(0, 1)) t = R.int(1, 9) * 10 + 5;
      var ans = Math.floor(t / 10) + (t % 10 >= 5 ? 1 : 0), lo = Math.floor(t / 10);
      var ctx = lv === 3 ? R.pick(['A pumpkin has a mass of ' + ds(t) + ' kg. About how many kilograms is that, to the nearest whole kilogram?', 'A trail is ' + ds(t) + ' km long. Round it to the nearest kilometre.']) : 'Round <span class="math">' + ds(t) + '</span> to the nearest whole number.';
      return { q: ctx, type: 'num', answer: ans, fig: lv < 3 ? hill(t, 'derq') : '',
        hint: lv < 3 ? 'Is the yellow ball before the top of the hill or past it?' : 'Look at the tenths digit. 5 or more rounds up.', steps: ['The whole numbers on either side are ' + lo + ' and ' + (lo + 1) + '.', 'The tenths digit is ' + t % 10 + '. ' + (t % 10 >= 5 ? '5 or more, so round up to ' + (lo + 1) + '.' : 'Less than 5, so round down to ' + lo + '.') + (lv === 3 ? '<div class="fig">' + hill(t, 'ders') + '</div>' : '')],
        explain: ds(t) + ' rounds to ' + ans + '.' };
    },
    add: function (lv) {
      var a, b;
      if (lv === 1) { a = R.int(1, 8); b = R.int(1, 9 - a); }
      else if (lv === 2) { a = R.int(3, 9); b = R.int(10 - a, 9); }
      else { a = R.int(11, 59); b = R.int(11, 49); }
      return { q: 'Add: <span class="math">' + ds(a) + ' + ' + ds(b) + '</span>', type: 'num', answer: (a + b) / 10, fig: lv < 3 ? cols(a, b, '+', false) : '',
        hint: 'Think in tenths: ' + a + ' tenths + ' + b + ' tenths. Ten tenths make 1 whole.', steps: [ds(a) + ' is ' + a + ' tenths and ' + ds(b) + ' is ' + b + ' tenths.', a + ' + ' + b + ' = ' + (a + b) + ' tenths.', (a + b) + ' tenths = ' + ds(a + b) + '.<div class="fig">' + cols(a, b, '+', true) + '</div>'],
        explain: ds(a) + ' + ' + ds(b) + ' = ' + ds(a + b) + '.' };
    },
    sub: function (lv) {
      var a, b, ctx = '';
      if (lv === 1) { a = R.int(3, 9); b = R.int(1, a - 1); }
      else if (lv === 2) { a = R.int(11, 19); b = R.int(a - 9, 9); if (b <= 0) b = 2; }
      else { a = R.int(25, 80); b = R.int(11, a - 5); ctx = R.pick(['A jug holds ' + ds(a) + ' L of water. ' + ds(b) + ' L is poured out. How much is left?', 'Ava ran ' + ds(a) + ' km. Ben ran ' + ds(b) + ' km. How much farther did Ava run?']); }
      if (b >= a) b = a - 1;
      return { q: ctx || 'Subtract: <span class="math">' + ds(a) + ' &minus; ' + ds(b) + '</span>', type: 'num', answer: (a - b) / 10, unit: lv === 3 ? (ctx.indexOf(' L') > 0 ? 'L' : 'km') : '',
        fig: lv < 3 ? cols(a, b, '-', false) : '', hint: 'Think in tenths: ' + a + ' tenths &minus; ' + b + ' tenths. Line up the decimal points.',
        steps: [ds(a) + ' is ' + a + ' tenths and ' + ds(b) + ' is ' + b + ' tenths.', a + ' &minus; ' + b + ' = ' + (a - b) + ' tenths = ' + ds(a - b) + '.<div class="fig">' + cols(a, b, '-', true) + '</div>'],
        explain: ds(a) + ' &minus; ' + ds(b) + ' = ' + ds(a - b) + '.' };
    }
  };
  function barsTwo(n, d, t) {
    var s = '', cw = 400 / d, tw = 40;
    for (var i = 0; i < d; i++) s += '<rect x="' + (2 + i * cw) + '" y="2" width="' + cw + '" height="44" style="fill:' + (i < n ? 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/>';
    for (var j = 0; j < 10; j++) s += '<rect x="' + (2 + j * tw) + '" y="60" width="' + tw + '" height="44" style="fill:' + (j < t ? 'var(--pm1)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/>';
    return s;
  }

  /* ---------- one idea at a time ---------- */
  var K = A.kit;
  function T(name, lv) { return function () { return gen[name](lv); }; }
  var FRS = [[1, 2], [1, 5], [2, 5], [3, 5], [4, 5]];

  var LESSONS = [
    { id: 'tenths', title: 'Tenths', sub: 'One whole cut into 10 equal parts.', concepts: [
      { id: 'tenth', title: 'What a tenth is', exp: ['B1.7'], skill: 'de4-read',
        body: '<p>Cut one whole into <b>10 equal parts</b>. Each part is <b>one tenth</b>: ' + fr(1, 10) + ', written <b>0.1</b>.</p>',
        watch: K.watch([
          ['One whole, cut into 10 equal parts.', tenthBars(0), 1600],
          ['One part is one tenth: ' + fr(1, 10) + ' = <b>0.1</b>.', tenthBars(1), 1800],
          ['Three parts: three tenths = <b>0.3</b>.', tenthBars(3), 1800],
          ['Ten tenths make <b>1 whole</b>: 1.0.', tenthBars(10), 2000]
        ]),
        try: { tool: 'fractions', opts: { parts: 10, choices: [] }, tasks: [
          { do: 'Shade <b>0.7</b> of the strip.', goal: function (s) { return s[0].d === 10 && s[0].n === 7; }, yes: '7 tenths = 0.7.' },
          { do: 'Shade the whole strip. What decimal is it?', goal: function (s) { return s[0].n === 10; }, yes: '10 tenths = 1.0 = 1 whole.' }
        ] },
        key: '<p><b>10 tenths make 1 whole.</b> 0.1 is one tenth.</p>',
        check: [T('read', 1), T('frac', 1)] },

      { id: 'point', title: 'Wholes and tenths', exp: ['B1.7'], skill: 'de4-read',
        body: '<p>The <b>decimal point</b> separates the wholes from the tenths. 2.3 is 2 wholes and 3 tenths: "two and three tenths".</p>',
        watch: K.watch([
          ['2 wholes.', tenthBars(20) + chart(20), 1600],
          ['And 3 tenths. The tenths go <b>after the point</b>.', tenthBars(23) + chart(23, -1), 2000],
          ['<b>2.3</b>: two and three tenths.', tenthBars(23) + chart(23), 1800]
        ]),
        try: K.lab({ controls: [{ id: 'w', label: 'Wholes', min: 0, max: 5, value: 1 }, { id: 't', label: 'Tenths', min: 0, max: 9, value: 4 }],
          render: function (s) { s.v = s.w * 10 + s.t; return { fig: tenthBars(Math.max(s.v, 0)) + chart(s.v), out: '<p><span class="big">' + ds(s.v) + '</span> ' + words(s.v) + '</p>' }; },
          tasks: [
            { do: 'Show <b>2.3</b>.', goal: function (s) { return s.v === 23; }, yes: 'Two and three tenths.' },
            { do: 'Show <b>three and six tenths</b>.', goal: function (s) { return s.v === 36; }, yes: '3.6.' },
            { do: 'Show <b>4.0</b>.', goal: function (s) { return s.v === 40; }, yes: '4.0 is 4 wholes and no tenths: the same as 4.' }
          ] }),
        key: '<p><b>Wholes . tenths.</b> Read the point as "and".</p>',
        mistake: '<p>Reading 2.3 as "two point thirty" or thinking 2.3 means 23. Ask: "How many whole bars? How many tenths in the last bar?"</p>',
        check: [T('read', 2), T('read', 3)] },

      { id: 'fractions', title: 'Fractions as decimals', exp: ['B1.9'], skill: 'de4-frac', hard: true,
        body: '<p>Tenths are easy: ' + fr(7, 10) + ' = 0.7. Halves and fifths can be cut into tenths too: <b>' + fr(1, 2) + ' = ' + fr(5, 10) + ' = 0.5</b>.</p>',
        watch: K.watch([
          [fr(1, 2) + ' of a strip.', A.svg(404, 108, barsTwo(1, 2, 0), 'one half'), 1600],
          ['Below it, tenths. 5 tenths are just as long: ' + fr(1, 2) + ' = <b>0.5</b>.', A.svg(404, 108, barsTwo(1, 2, 5), 'one half equals 5 tenths'), 2200],
          [fr(1, 5) + ' is 2 tenths: <b>0.2</b>.', A.svg(404, 108, barsTwo(1, 5, 2), 'one fifth equals 2 tenths'), 2000],
          [fr(3, 5) + ' is 6 tenths: <b>0.6</b>.', A.svg(404, 108, barsTwo(3, 5, 6), 'three fifths equals 6 tenths'), 2000]
        ]),
        try: K.lab({ controls: [
          { id: 'f', label: 'Fraction', type: 'select', options: FRS.map(function (p, i) { return [String(i), p[0] + '/' + p[1]]; }) },
          { id: 't', label: 'Tenths', min: 0, max: 10, value: 0 }],
          render: function (s) { var p = FRS[+s.f], ok = s.t * p[1] === p[0] * 10; s.ok = ok; return { fig: A.svg(404, 108, barsTwo(p[0], p[1], s.t), p[0] + '/' + p[1] + ' above ' + s.t + ' tenths'), out: '<p class="big">' + fr(p[0], p[1]) + (ok ? ' = ' : ' &ne; ') + ds(s.t) + '</p>' }; },
          tasks: [
            { do: 'Make the tenths match <b>' + fr(1, 2) + '</b>.', setup: function (api) { api.set('f', '0'); }, goal: function (s) { return s.f === '0' && s.ok; }, yes: fr(1, 2) + ' = 0.5.' },
            { do: 'Make the tenths match <b>' + fr(2, 5) + '</b>.', setup: function (api) { api.set('f', '2'); }, goal: function (s) { return s.f === '2' && s.ok; }, yes: fr(2, 5) + ' = 0.4.' },
            { do: 'Make the tenths match <b>' + fr(4, 5) + '</b>.', setup: function (api) { api.set('f', '4'); }, goal: function (s) { return s.f === '4' && s.ok; }, yes: fr(4, 5) + ' = 0.8.' }
          ] }),
        ways: [
          { label: 'With money', html: '<p>Half a dollar is 50¢ = $0.50. A fifth of a dollar is 20¢ = $0.20. Tenths of a dollar are dimes.</p>' },
          { label: 'Each fifth is 2 tenths', html: '<p>A whole has 5 fifths or 10 tenths, so <b>1 fifth = 2 tenths</b>. 3 fifths = 6 tenths = 0.6.</p>' }
        ],
        key: '<p><b>Find how many tenths are the same length.</b> 1/2 = 0.5; 1/5 = 0.2.</p>',
        mistake: '<p>Writing ' + fr(1, 2) + ' as 1.2 or ' + fr(1, 5) + ' as 0.15 (using the digits of the fraction). Ask: "How many tenths fit in this piece?"</p>',
        check: [T('frac', 2), T('frac', 3)] }
    ] },

    { id: 'compare', title: 'Compare and round', sub: 'Use the number line.', concepts: [
      { id: 'compare', title: 'Compare decimals', exp: ['B1.7'], skill: 'de4-compare',
        body: '<p>Compare the <b>wholes</b> first. If they are the same, compare the <b>tenths</b>. On a number line, greater is further right.</p>',
        watch: K.watch([
          ['1.8 and 2.3. Compare the wholes: 1 and 2.', line(10, 30, [{ t: 18, l: '1.8' }]), 1800],
          ['2 wholes is more: <b>2.3 &gt; 1.8</b>, even though 8 tenths is more than 3 tenths.', line(10, 30, [{ t: 18, l: '1.8' }, { t: 23, l: '2.3', c: 'var(--strand)' }]), 2400],
          ['2.3 and 2.7: same wholes, so compare tenths. <b>2.7 &gt; 2.3</b>.', line(20, 30, [{ t: 23, l: '2.3' }, { t: 27, l: '2.7', c: 'var(--strand)' }]), 2200]
        ]),
        try: K.lab({ controls: [{ id: 'a', label: 'First', min: 0, max: 50, value: 18, fmt: ds }, { id: 'b', label: 'Second', min: 0, max: 50, value: 23, fmt: ds }],
          render: function (s) { var sym = s.a > s.b ? '&gt;' : s.a < s.b ? '&lt;' : '='; return { fig: line(0, 50, [{ t: s.a, l: ds(s.a) }, { t: s.b, l: ds(s.b), c: 'var(--strand)' }]), out: '<p class="big math">' + ds(s.a) + ' ' + sym + ' ' + ds(s.b) + '</p>' }; },
          tasks: [
            { do: 'Make the first number greater, with the <b>same whole number</b> in both.', goal: function (s) { return Math.floor(s.a / 10) === Math.floor(s.b / 10) && s.a > s.b; }, yes: 'Same wholes, so the tenths decide.' },
            { do: 'Make the first number greater even though it has <b>fewer tenths</b>.', goal: function (s) { return s.a > s.b && s.a % 10 < s.b % 10; }, yes: 'More wholes wins, whatever the tenths say.' }
          ] }),
        key: '<p><b>Wholes first, then tenths.</b></p>',
        mistake: '<p>Thinking 1.8 &gt; 2.3 because 8 is bigger than 3. Ask: "How many wholes does each have?"</p>',
        check: [T('compare', 1), T('compare', 2), T('compare', 3)] },

      { id: 'round', title: 'Round to a whole number', exp: ['B1.8'], skill: 'de4-round',
        body: '<p>Picture a hill between two whole numbers. Tenths of <b>5 or more</b> roll up. Less than 5 roll back down.</p>',
        watch: K.watch([
          ['3.2 is before the top. It rolls back to <b>3</b>.', hill(32, 'dew1'), 2000],
          ['3.7 is past the top. It rolls up to <b>4</b>.', hill(37, 'dew1'), 2000],
          ['3.5 is exactly at the top. It rounds <b>up</b> to 4.', hill(35, 'dew1'), 2200]
        ]),
        try: K.lab({ controls: [{ id: 't', label: 'Number', min: 10, max: 59, value: 32, fmt: ds }],
          render: function (s) { s.r = Math.floor(s.t / 10) + (s.t % 10 >= 5 ? 1 : 0); return { fig: hill(s.t, 'detry'), out: '<p class="big math">' + ds(s.t) + ' &asymp; ' + s.r + '</p>' }; },
          tasks: [
            { do: 'Find a number that rounds <b>up</b> to 4.', goal: function (s) { return s.r === 4 && s.t < 40; }, yes: function (s) { return ds(s.t) + ' rolls up to 4.'; } },
            { do: 'Find the number at the very <b>top</b> of the hill between 2 and 3.', goal: function (s) { return s.t === 25; }, yes: '2.5 rounds up to 3.' }
          ] }),
        key: '<p>Tenths digit <b>5 or more: round up.</b> Less than 5: round down.</p>',
        check: [T('round', 1), T('round', 3)] }
    ] },

    { id: 'add-sub', title: 'Add and subtract tenths', sub: 'Think in tenths; line up the points.', concepts: [
      { id: 'add', title: 'Add tenths', exp: ['B2.3', 'B2.4'], skill: 'de4-add',
        body: '<p>Think in tenths. 0.7 + 0.5 is 7 tenths + 5 tenths = 12 tenths. <b>10 tenths make 1 whole</b>, so 12 tenths = 1.2.</p>',
        watch: K.watch([
          ['0.7: 7 tenths.', tenthBars(7, null, 540), 1500],
          ['Add 0.5: 5 more tenths. 12 tenths in all.', tenthBars(12, null, 540), 2000],
          ['10 tenths fill a whole. <b>0.7 + 0.5 = 1.2</b>.', tenthBars(12, null, 540) + '<div class="fig">' + cols(7, 5, '+', true) + '</div>', 2400]
        ]),
        try: K.lab({ controls: [{ id: 'a', label: 'First', min: 0, max: 30, value: 7, fmt: ds }, { id: 'b', label: 'Second', min: 0, max: 30, value: 5, fmt: ds }],
          render: function (s) { s.s = s.a + s.b; return { fig: tenthBars(s.s, null, 540) + '<div class="fig">' + cols(s.a, s.b, '+', true) + '</div>', out: '<p class="big math">' + ds(s.a) + ' + ' + ds(s.b) + ' = ' + ds(s.s) + '</p>' }; },
          tasks: [
            { do: 'Show <b>1.6 + 2.7</b>.', goal: function (s) { return s.a === 16 && s.b === 27; }, yes: '16 + 27 = 43 tenths = 4.3.' },
            { do: 'Make a sum of exactly <b>2</b>, where neither number is a whole number.', goal: function (s) { return s.s === 20 && s.a % 10 && s.b % 10; }, yes: function (s) { return ds(s.a) + ' + ' + ds(s.b) + ': the tenths made a whole.'; } }
          ] }),
        key: '<p><b>Add the tenths. 10 tenths make 1 whole.</b> Line up the decimal points.</p>',
        mistake: '<p>Writing 0.7 + 0.5 = 0.12. Ask: "How many tenths is that? Is it more than a whole?"</p>',
        check: [T('add', 1), T('add', 2)] },

      { id: 'sub', title: 'Subtract tenths', exp: ['B2.3', 'B2.4'], skill: 'de4-sub', hard: true,
        body: '<p>Think in tenths again. 4.2 &minus; 1.7 is 42 tenths &minus; 17 tenths = <b>25 tenths = 2.5</b>.</p>',
        watch: K.watch([
          ['4.2 &minus; 1.7. Line up the points.', cols(42, 17, '-', false), 1800],
          ['In tenths: 42 &minus; 17 = 25.', cols(42, 17, '-', false) + '<p class="math big">42 &minus; 17 = 25 tenths</p>', 2000],
          ['25 tenths = <b>2.5</b>.', cols(42, 17, '-', true), 2000]
        ]),
        ways: [
          { label: 'Count up', html: '<p>From 1.7 up to 2 is 0.3. From 2 up to 4.2 is 2.2. 0.3 + 2.2 = <b>2.5</b>.</p><div class="fig">' + line(10, 50, [{ t: 17, l: '1.7' }, { t: 20 }, { t: 42, l: '4.2', c: 'var(--strand)' }]) + '</div>' },
          { label: 'With money', html: '<p>$4.20 &minus; $1.70. Take away $1: $3.20. Take away 70¢: $2.50.</p>' },
          { label: 'Trade a whole', html: '<p>2 tenths is not enough to take 7. Trade 1 whole for 10 tenths: 3 wholes and 12 tenths. 12 &minus; 7 = 5 tenths, 3 &minus; 1 = 2 wholes: <b>2.5</b>.</p>' }
        ],
        key: '<p><b>Line up the points and think in tenths.</b> Trade a whole for 10 tenths if you need to.</p>',
        mistake: '<p>Taking the smaller tenths digit from the bigger one (4.2 &minus; 1.7 = 3.5). Ask: "Can you take 7 tenths from 2 tenths?"</p>',
        check: [T('sub', 1), T('sub', 2), T('sub', 3)] }
    ] }
  ];

  A.register('decimals', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>What is a tenth?</h2>' +
'<p>Cut 1 whole into 10 equal parts. Each part is <b>one tenth</b>. We can write it as a fraction, ' + fr(1, 10) + ', or as a decimal, <b>0.1</b>.</p>' +
'<p>The <b>decimal point</b> separates the wholes from the parts. The first place after the point is the <b>tenths place</b>.</p>' +
'<div class="fig">' + tenthBars(23) + '</div>' +
'<div class="fig">' + chart(23) + '</div>' +
'<p style="text-align:center"><b>2.3</b> is read "two and three tenths". The word "and" stands for the decimal point.</p>' +
'<div class="lab"><span class="lt">Try it: build a decimal</span>' +
'<div class="ctrl"><label for="der">Slide: <output id="dero"></output><input type="range" id="der" min="0" max="50" value="14"></label></div>' +
'<div class="fig" id="defig"></div><div id="dechart"></div><div class="out" id="deout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Reading 0.3 as "three". The 3 is in the tenths place, so 0.3 is <b>three tenths</b>, much less than 1.</p></div>' +
A.yt({ gen: function () { return gen.read(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Tenths as fractions and decimals</h2>' +
'<p>Every number of tenths can be written two ways: ' + fr(7, 10) + ' = 0.7, and 1 ' + fr(4, 10) + ' = 1.4. Some fractions we know are equal to tenths too.</p>' +
'<div class="lab"><span class="lt">Try it: match a fraction to tenths</span>' +
'<div class="ctrl"><label for="dfp">Fraction<select id="dfp"><option value="1,2">1/2</option><option value="1,5">1/5</option><option value="2,5" selected>2/5</option><option value="3,5">3/5</option><option value="4,5">4/5</option><option value="2,2">2/2</option></select></label></div>' +
'<div class="fig" id="dffig"></div><div class="out" id="dfout"></div></div>' +
'<div class="tbl"><table><thead><tr><th>Fraction</th>' + [[1, 2], [1, 5], [2, 5], [3, 5], [4, 5]].map(function (p) { return '<td>' + fr(p[0], p[1]) + '</td>'; }).join('') + '</tr></thead><tbody>' +
'<tr><th>Tenths</th>' + [5, 2, 4, 6, 8].map(function (t) { return '<td>' + fr(t, 10) + '</td>'; }).join('') + '</tr><tr><th>Decimal</th>' + [5, 2, 4, 6, 8].map(function (t) { return '<td>0.' + t + '</td>'; }).join('') + '</tr></tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p>' + fr(1, 2) + ' = ' + fr(5, 10) + ' = 0.5. Half of a whole is 5 tenths.</p></div>' +
A.yt({ gen: function () { return gen.frac(2); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Comparing and ordering decimals</h2>' +
'<p>Use the same rule as for whole numbers. <b>Start at the left.</b> Compare the ones first. If they are the same, compare the tenths.</p>' +
'<div class="lab"><span class="lt">Try it: compare on a number line</span>' +
'<div class="ctrl"><label for="dca">First decimal (0 to 5)<input type="number" id="dca" min="0" max="5" step="0.1" value="2.1"></label><label for="dcb">Second decimal (0 to 5)<input type="number" id="dcb" min="0" max="5" step="0.1" value="1.9"></label></div>' +
'<div class="fig" id="dcfig"></div><div class="out" id="dcout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Which is greater, 2.1 or 1.9? Start at the left: 2 ones is more than 1 one. So <b>2.1 &gt; 1.9</b>, even though 1 tenth is less than 9 tenths.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Looking at the tenths first. In 2.1 and 1.9, the 9 is bigger than the 1, but the ones decide: 2.1 is greater.</p></div>' +
A.yt({ gen: function () { return gen.compare(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Rounding to the nearest whole</h2>' +
'<p>A decimal with tenths sits between two whole numbers. Look at the tenths digit. <b>5 or more, round up. Less than 5, round down.</b> It is the same hill as for whole numbers.</p>' +
'<div class="lab"><span class="lt">Try it: round a decimal</span>' +
'<div class="ctrl"><label for="drn">Slide: <output id="drno"></output><input type="range" id="drn" min="0" max="99" value="37"></label></div>' +
'<div class="fig" id="drfig"></div><div class="out" id="drout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A watermelon has a mass of 3.7 kg. The tenths digit is 7, which is 5 or more, so it is about <b>4 kg</b>.</p></div>' +
A.yt({ gen: function () { return gen.round(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Adding and subtracting tenths</h2>' +
'<p>Think in tenths. 0.6 + 0.7 is 6 tenths + 7 tenths = 13 tenths. Ten tenths make 1 whole, so 13 tenths is <b>1.3</b>.</p>' +
'<p>For the column method, <b>line up the decimal points</b>. Then add or subtract like whole numbers, and keep the point in the answer.</p>' +
'<div class="lab"><span class="lt">Try it: add or subtract tenths</span>' +
'<div class="ctrl"><label for="daa">First (0 to 9.9)<input type="number" id="daa" min="0" max="9.9" step="0.1" value="2.6"></label><label for="daop">Operation<select id="daop"><option value="+">add</option><option value="-">subtract</option></select></label><label for="dab">Second (0 to 9.9)<input type="number" id="dab" min="0" max="9.9" step="0.1" value="1.7"></label></div>' +
'<div class="fig" id="dafig"></div><div class="fig" id="dabars"></div><div class="out" id="daout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Lining up the last digits. 3 + 0.4 is not 0.7. Write 3 as 3.0, line up the points, and get <b>3.4</b>.</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A jug holds 2.5 L. You pour out 0.8 L. 25 tenths &minus; 8 tenths = 17 tenths. <b>1.7 L</b> is left. Check: 1.7 + 0.8 = 2.5.</p><div class="fig">' + cols(25, 8, '-', true) + '</div></div>' +
A.yt({ gen: function () { return gen.add(2); } }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function tv(id, mx) { var v = parseFloat($('#' + id, root).value); if (isNaN(v)) v = 0; return Math.max(0, Math.min(mx, Math.round(v * 10))); }
      function bd() {
        var t = +$('#der', root).value;
        $('#dero', root).textContent = ds(t);
        $('#defig', root).innerHTML = tenthBars(t);
        $('#dechart', root).innerHTML = chart(t);
        $('#deout', root).innerHTML = '<p><span class="big">' + ds(t) + '</span> &nbsp;' + words(t) + '</p><p>As a fraction: ' + (t >= 10 ? A.mixed(Math.floor(t / 10), t % 10, 10) || String(t / 10) : t ? fr(t, 10) : '0') + '. That is ' + t + ' tenths in all.</p>';
      }
      A.bind(root, ['der'], bd);
      function df() {
        var p = $('#dfp', root).value.split(',').map(Number), t = p[0] * 10 / p[1];
        $('#dffig', root).innerHTML = A.svg(404, 108, barsTwo(p[0], p[1], t), p[0] + '/' + p[1] + ' and ' + t + ' tenths are the same length');
        $('#dfout', root).innerHTML = '<p>Top: ' + fr(p[0], p[1]) + '. Bottom: ' + fr(t, 10) + '. The shaded parts are the same length.</p><p><span class="big">' + fr(p[0], p[1]) + ' = ' + fr(t, 10) + ' = ' + friendly(t) + '</span></p>';
      }
      A.bind(root, ['dfp'], df);
      function dc() {
        var a = tv('dca', 50), b = tv('dcb', 50);
        $('#dcfig', root).innerHTML = line(0, 50, [{ t: a, l: ds(a) }, { t: b, l: ds(b), c: 'var(--strand)' }], 'Number line from 0 to 5 with ' + ds(a) + ' and ' + ds(b));
        var sym = a > b ? '&gt;' : a < b ? '&lt;' : '=', sameOnes = Math.floor(a / 10) === Math.floor(b / 10);
        $('#dcout', root).innerHTML = '<p><span class="big">' + ds(a) + ' ' + sym + ' ' + ds(b) + '</span></p><p>' + (a === b ? 'They are the same number.' : sameOnes ? 'The ones are the same (' + Math.floor(a / 10) + '), so the tenths decide: ' + a % 10 + ' and ' + b % 10 + '.' : 'The ones are different (' + Math.floor(a / 10) + ' and ' + Math.floor(b / 10) + '), so they decide.') + ' The greater number is further right.</p>';
      }
      A.bind(root, ['dca', 'dcb'], dc);
      function dr() {
        var t = +$('#drn', root).value, lo = Math.floor(t / 10), ans = lo + (t % 10 >= 5 ? 1 : 0);
        $('#drno', root).textContent = ds(t);
        $('#drfig', root).innerHTML = hill(t, 'derw');
        $('#drout', root).innerHTML = '<p><span class="big">' + ds(t) + ' &#8776; ' + ans + '</span></p><p>' + (t % 10 === 0 ? ds(t) + ' is already a whole number.' : 'The tenths digit is ' + t % 10 + '. ' + (t % 10 >= 5 ? '5 or more, so round up.' : 'Less than 5, so round down.')) + '</p>';
      }
      A.bind(root, ['drn'], dr);
      function da() {
        var a = tv('daa', 99), b = tv('dab', 99), op = $('#daop', root).value;
        if (op === '-' && b > a) { $('#dafig', root).innerHTML = ''; $('#dabars', root).innerHTML = ''; $('#daout', root).innerHTML = '<p>For subtracting, make the first number the bigger one.</p>'; return; }
        var res = op === '+' ? a + b : a - b;
        $('#dafig', root).innerHTML = cols(a, b, op, true);
        $('#dabars', root).innerHTML = res <= 50 ? tenthBars(res, 'The answer, ' + ds(res) + ', as bars of tenths') : '';
        $('#daout', root).innerHTML = '<p>' + a + ' tenths ' + (op === '+' ? '+' : '&minus;') + ' ' + b + ' tenths = ' + res + ' tenths</p><p><span class="big">' + ds(a) + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + ds(b) + ' = ' + ds(res) + '</span></p>';
      }
      A.bind(root, ['daa', 'dab', 'daop'], da);
    },

    quiz: [
      { q: 'What decimal is shaded? Each bar is 1 whole.', type: 'num', answer: 1.6, fig: tenthBars(16), hint: 'Count full bars, then tenths in the last bar.', explain: '1 whole and 6 tenths: 1.6.' },
      { q: 'Which is equal to ' + fr(3, 5) + '?', type: 'mc', options: ['0.3', '0.35', '0.6', '3.5'], answer: 2, hint: 'Each fifth is 2 tenths.', explain: fr(3, 5) + ' = ' + fr(6, 10) + ' = 0.6.' },
      { q: 'Which is greater: <span class="math">3.2</span> or <span class="math">2.9</span>?', type: 'mc', options: ['3.2', '2.9', 'They are equal'], answer: 0, hint: 'Start at the left: compare the ones.', explain: '3 ones is more than 2 ones, so 3.2 &gt; 2.9.' },
      { q: 'Round <span class="math">6.5</span> to the nearest whole number.', type: 'num', answer: 7, fig: hill(65, 'deq4'), hint: 'Exactly halfway rounds up.', explain: 'The tenths digit is 5, so round up to 7.' },
      { q: 'Add: <span class="math">0.8 + 0.7</span>', type: 'num', answer: 1.5, hint: '8 tenths + 7 tenths = 15 tenths.', explain: '15 tenths = 1.5.' },
      { q: 'A bottle holds 2.4 L of juice. Mia pours out 0.9 L. How much is left?', type: 'num', answer: 1.5, unit: 'L', hint: '24 tenths &minus; 9 tenths.', explain: '24 &minus; 9 = 15 tenths = 1.5 L. Check: 1.5 + 0.9 = 2.4.' },
      { q: 'Which number is <b>four and two tenths</b>?', type: 'mc', options: ['42', '0.42', '2.4', '4.2'], answer: 3, hint: '"And" is the decimal point.', explain: 'Four ones, then 2 tenths after the point: 4.2.' }
    ],

    practice: [
      { id: 'de4-read', name: 'Read and write tenths', code: 'B1.7', gen: gen.read },
      { id: 'de4-frac', name: 'Fractions and decimals', code: 'B1.9', gen: gen.frac },
      { id: 'de4-compare', name: 'Compare and order', code: 'B1.7', gen: gen.compare },
      { id: 'de4-round', name: 'Round to a whole number', code: 'B1.8', gen: gen.round },
      { id: 'de4-add', name: 'Add tenths', code: 'B2.3, B2.4', gen: gen.add },
      { id: 'de4-sub', name: 'Subtract tenths', code: 'B2.3, B2.4', gen: gen.sub }
    ]
  });

  /* ---------- More ways to ask (question shapes; see docs/QUESTIONS.md) ----------
     Values are whole numbers of tenths (23 means 2.3). q.meta holds the facts that
     tests/verify/grade4.js uses to work each answer out again. */
  var why = K.why, who = A.Q && A.Q.name;
  function notWhole(lo, hi) { var t; do { t = R.int(lo, hi); } while (t % 10 === 0); return t; }
  function roundT(t) { return Math.floor(t / 10) + (t % 10 >= 5 ? 1 : 0); }
  var SHAPES = {
    'de4-read': [
      [1, 'line', function (lv) {
        var t = lv === 1 ? R.int(1, 9) : notWhole(11, 59), lo = Math.floor(t / 10);
        return { q: 'Place <b>' + ds(t) + '</b> on the number line.', type: 'line', min: lo, max: lo + 1, tick: 0.1, every: 0.5, snap: 0.1, answer: t / 10, tol: 0.01,
          hint: 'Each small step is one tenth. Count ' + t % 10 + ' steps from ' + lo + '.', steps: [ds(t) + ' is ' + lo + ' and ' + (t % 10) + ' tenths.', 'Start at ' + lo + ' and count ' + t % 10 + ' tenths.'],
          explain: ds(t) + ' is ' + t % 10 + ' tenths past ' + lo + '.', meta: { k: 'de4-read-line' } };
      }],
      [1, 'match', function (lv) {
        var pairs = [], seen = {};
        while (pairs.length < 3) { var t = lv === 1 ? R.int(1, 9) : notWhole(11, 59); if (seen[t]) continue; seen[t] = 1; pairs.push([words(t), ds(t)]); }
        return { q: 'Match each number in words to its decimal.', type: 'match', pairs: pairs, hint: 'The word "and" stands for the decimal point.',
          steps: ['The whole number comes before the point. The tenths come after it.'], explain: pairs.map(function (p) { return p[0] + ' is ' + p[1]; }).join('. ') + '.', meta: { k: 'de4-read-match', pairs: pairs } };
      }],
      [2, 'tap', function () {
        var t = notWhole(11, 199), s = ds(t), tenths = !R.int(0, 2), n = s.replace('.', '').length, key = tenths ? n - 1 : n - 2;
        return { q: 'Tap the digit in the <b>' + (tenths ? 'tenths' : 'ones') + '</b> place of ' + s + '.', type: 'tap', pic: K.digits(s), answer: String(key), answerText: 'the ' + s.replace('.', '').charAt(key),
          hint: 'The ones digit is just before the decimal point. The tenths digit is just after it.', steps: ['In ' + s + ', the ' + (tenths ? 'tenths digit is ' + s.charAt(s.length - 1) : 'ones digit is ' + s.charAt(s.length - 3)) + '.'],
          explain: 'The ' + (tenths ? 'tenths' : 'ones') + ' digit of ' + s + ' is ' + s.replace('.', '').charAt(key) + '.', meta: { k: 'de4-read-tap', s: s, tenths: tenths } };
      }]
    ],
    'de4-frac': [
      [1, 'match', function () {
        var ts = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), pairs = ts.map(function (t) { return [fr(t, 10), ds(t)]; });
        return { q: 'Match each fraction to its decimal.', type: 'match', pairs: pairs, hint: 'Tenths go just after the decimal point.',
          steps: ['The numerator of a tenths fraction is the digit after the point.'], explain: ts.map(function (t) { return t + '/10 = ' + ds(t); }).join('. ') + '.', meta: { k: 'de4-frac-match', ts: ts } };
      }],
      [1, 'fill', function () {
        var t = R.int(1, 9);
        return { q: 'Write the decimal as a fraction.', type: 'fill', fill: '<span class="math">' + ds(t) + '</span> = [[]] / 10', answers: [t], fig: tenthBars(t, null, 300),
          hint: 'The digit after the point counts tenths.', steps: [ds(t) + ' is ' + words(t) + '.'], explain: ds(t) + ' = ' + fr(t, 10) + '.', meta: { k: 'de4-frac-fill', t: t } };
      }],
      [2, 'mistake', function () {
        var t = R.int(2, 9), p = who(), truth = !R.int(0, 2), said = truth ? [t, 10] : [1, t];
        var right = 'The ' + t + ' after the point means ' + t + ' tenths, so ' + ds(t) + ' = ' + fr(t, 10) + '.';
        return { q: p + ' says <span class="math">' + ds(t) + '</span> = ' + fr(said[0], said[1]) + '. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['The digit after the point is the denominator.', 'Decimals and fractions can never be equal.', 'The point means "out of 100".']),
          hint: 'Read ' + ds(t) + ' out loud: "' + words(t) + '".', steps: [right], explain: right, meta: { k: 'de4-frac-tf', t: t, said: said } };
      }]
    ],
    'de4-compare': [
      [1, 'order', function (lv) {
        var ts = [];
        while (ts.length < 4) { var v = lv === 1 ? R.int(1, 9) : R.int(5, 45); if (ts.indexOf(v) < 0) ts.push(v); }
        ts.sort(function (a, b) { return a - b; });
        return { q: 'Put these decimals in order from <b>least to greatest</b>.', type: 'order', items: ts.map(ds), first: 'least', last: 'greatest',
          hint: 'Compare the ones first. Then compare the tenths.', steps: ['In order: ' + ts.map(ds).join(', ') + '.'], explain: 'Least to greatest: ' + ts.map(ds).join(', ') + '.', meta: { k: 'de4-cmp-order' } };
      }],
      [1, 'tap', function (lv) {
        var lo = lv === 1 ? 0 : R.int(1, 4), ts = [];
        while (ts.length < 3) { var v = lo * 10 + R.int(1, 9); if (ts.every(function (x) { return Math.abs(x - v) > 1; })) ts.push(v); }
        var keys = ['A', 'B', 'C'], want = R.int(0, 2);
        return { q: 'Which point shows <b>' + ds(ts[want]) + '</b>? Tap it.', type: 'tap', pic: K.tapLine(lo, lo + 1, 0.1, ts.map(function (t, i) { return { v: t / 10, key: keys[i], t: keys[i] }; })), answer: keys[want], answerText: 'point ' + keys[want],
          hint: 'Each small step is one tenth. Count from ' + lo + '.', steps: [ds(ts[want]) + ' is ' + ts[want] % 10 + ' tenths past ' + lo + '.'],
          explain: 'Point ' + keys[want] + ' is at ' + ds(ts[want]) + '.', meta: { k: 'de4-cmp-tap', ts: ts, want: ts[want] } };
      }],
      [2, 'mistake', function () {
        var w = R.int(1, 6), a = w * 10 + R.int(6, 9), b = (w + 1) * 10 + R.int(1, 4), p = who(), truth = !R.int(0, 2);
        var claim = truth ? [b, a] : [a, b];
        var right = 'Compare the ones first: ' + (w + 1) + ' is more than ' + w + ', so ' + ds(b) + ' &gt; ' + ds(a) + '.';
        return { q: p + ' says ' + ds(claim[0]) + ' is greater than ' + ds(claim[1]) + '. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Compare the tenths first, because they are on the right.', 'The number with the bigger last digit is greater.', 'Decimals with the same number of digits are equal.']),
          hint: 'Which has more wholes?', steps: [right], explain: right, meta: { k: 'de4-cmp-tf', big: claim[0], small: claim[1] } };
      }],
      [2, 'story', function () {
        var two = A.Q.two(), a = notWhole(11, 49), b;
        do { b = notWhole(11, 49); } while (b === a);
        var c = R.pick([['ran', 'km', 'farther'], ['picked', 'kg of apples', 'more'], ['poured', 'L of juice', 'more']]);
        return { q: two[0] + ' ' + c[0] + ' <b>' + ds(a) + '</b> ' + c[1] + '. ' + two[1] + ' ' + c[0] + ' <b>' + ds(b) + '</b> ' + c[1] + '. Who ' + c[0] + ' ' + c[2] + '?', type: 'mc', options: two, answer: a > b ? 0 : 1,
          hint: 'Compare the ones, then the tenths.', steps: [ds(Math.max(a, b)) + ' &gt; ' + ds(Math.min(a, b)) + '.'],
          explain: (a > b ? two[0] : two[1]) + ' ' + c[0] + ' ' + c[2] + '.', meta: { k: 'de4-cmp-story' } };
      }]
    ],
    'de4-round': [
      [1, 'line', function (lv) {
        var t = lv === 1 ? R.int(1, 5) * 10 + R.int(1, 9) : notWhole(10, 99), lo = Math.floor(t / 10);
        return { q: 'Round <b>' + ds(t) + '</b> to the nearest whole number. Place your answer on the line.', type: 'line', min: lo, max: lo + 1, tick: 0.1, every: 0.5, snap: 0.1, answer: roundT(t), tol: 0.01,
          fig: hill(t, 'derl'), hint: 'Is ' + ds(t) + ' before ' + lo + '.5 or at it or past it?', steps: [ds(t) + ' is between ' + lo + ' and ' + (lo + 1) + '.', 'The tenths digit is ' + t % 10 + '. ' + (t % 10 >= 5 ? '5 or more rounds up.' : 'Less than 5 rounds down.')],
          explain: ds(t) + ' rounds to ' + roundT(t) + '.', meta: { k: 'de4-round-line', t: t } };
      }],
      [1, 'mistake', function () {
        var t = notWhole(10, 99), p = who(), truth = !R.int(0, 1), r = roundT(t), said = truth ? r : (r === Math.floor(t / 10) ? r + 1 : r - 1);
        var right = 'The tenths digit is ' + t % 10 + ', so ' + ds(t) + ' rounds ' + (t % 10 >= 5 ? 'up' : 'down') + ' to ' + r + '.';
        return { q: p + ' says <b>' + ds(t) + '</b> rounded to the nearest whole number is <b>' + said + '</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['You always drop the tenths.', 'You always round up.', 'The ones digit decides how to round.']),
          hint: 'Look at the tenths digit.', steps: [right], explain: right, meta: { k: 'de4-round-tf', t: t, said: said } };
      }],
      [2, 'match', function () {
        var pairs = [], seen = {};
        while (pairs.length < 3) { var t = notWhole(10, 99), r = roundT(t); if (seen[r]) continue; seen[r] = 1; pairs.push([ds(t), String(r)]); }
        return { q: 'Match each decimal to the nearest whole number.', type: 'match', pairs: pairs, hint: 'Tenths digit 5 or more: round up.',
          steps: ['Round each one, then match.'], explain: pairs.map(function (p) { return p[0] + ' rounds to ' + p[1]; }).join('. ') + '.', meta: { k: 'de4-round-match', pairs: pairs } };
      }]
    ],
    'de4-add': [
      [1, 'fill', function (lv) {
        var a = lv === 1 ? R.int(1, 8) : R.int(3, 9), b = lv === 1 ? R.int(1, 9 - a) : R.int(10 - a, 9);
        return { q: 'Think in tenths. Fill in the blanks.', type: 'fill', fill: '<span class="math">' + ds(a) + ' + ' + ds(b) + '</span> is ' + a + ' tenths + ' + b + ' tenths = [[]] tenths = <span class="math">[[]]</span>', answers: [a + b, (a + b) / 10],
          fig: cols(a, b, '+', false), hint: 'Add the tenths. Ten tenths make 1 whole.', steps: [a + ' + ' + b + ' = ' + (a + b) + ' tenths.', (a + b) + ' tenths = ' + ds(a + b) + '.'],
          explain: ds(a) + ' + ' + ds(b) + ' = ' + ds(a + b) + '.', meta: { k: 'de4-add-fill', a: a, b: b } };
      }],
      [1, 'story', function (lv) {
        var p = who(), a = lv === 1 ? R.int(11, 30) : R.int(15, 59), b = lv === 1 ? R.int(11, 30) : R.int(15, 49), c = R.pick([['paddled', 'km', 'before lunch', 'after lunch'], ['biked', 'km', 'on Saturday', 'on Sunday'], ['collected', 'kg of cans', 'in March', 'in April']]);
        return { q: p + ' ' + c[0] + ' <b>' + ds(a) + '</b> ' + c[1] + ' ' + c[2] + ' and <b>' + ds(b) + '</b> ' + c[1] + ' ' + c[3] + '. How much is that in all?', type: 'num', answer: (a + b) / 10, unit: c[1].split(' ')[0],
          hint: 'Line up the decimal points and add.', steps: [a + ' tenths + ' + b + ' tenths = ' + (a + b) + ' tenths.', 'That is ' + ds(a + b) + '.'],
          explain: ds(a) + ' + ' + ds(b) + ' = ' + ds(a + b) + '.', meta: { k: 'de4-add-story' } };
      }],
      [2, 'mistake', function () {
        var a = R.int(3, 9), b = R.int(10 - a, 9), p = who(), truth = !R.int(0, 2), said = truth ? ds(a + b) : '0.' + (a + b);
        var right = a + ' tenths + ' + b + ' tenths = ' + (a + b) + ' tenths. Ten tenths make 1 whole, so the sum is ' + ds(a + b) + '.';
        return { q: p + ' says <span class="math">' + ds(a) + ' + ' + ds(b) + ' = ' + said + '</span>. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Just add the digits after the point and write them after the point.', 'Adding decimals always gives less than 1.', 'You add the points too.']),
          hint: 'Is the sum more or less than 1?', steps: [right], explain: right, meta: { k: 'de4-add-tf', a: a, b: b, said: said } };
      }]
    ],
    'de4-sub': [
      [1, 'line', function (lv) {
        var a = lv === 1 ? R.int(5, 9) : R.int(11, 19), b = lv === 1 ? R.int(1, a - 1) : R.int(a - 9, 9);
        if (b <= 0) b = 2;
        return { q: 'Start at <b>' + ds(a) + '</b>. Jump back <b>' + ds(b) + '</b>. Place where you land.', type: 'line', min: 0, max: 2, tick: 0.1, every: 0.5, snap: 0.1, answer: (a - b) / 10, tol: 0.01,
          hint: 'Each small step is one tenth. Jump back ' + b + ' steps.', steps: [a + ' tenths &minus; ' + b + ' tenths = ' + (a - b) + ' tenths = ' + ds(a - b) + '.'],
          explain: ds(a) + ' &minus; ' + ds(b) + ' = ' + ds(a - b) + '.', meta: { k: 'de4-sub-line', a: a, b: b } };
      }],
      [1, 'which', function () {
        var two = A.Q.two(), a = notWhole(25, 80), b = notWhole(11, a - 5), kind = R.pick(['left', 'diff', 'join']);
        var t = kind === 'left' ? 'A jug holds ' + ds(a) + ' L of juice. ' + two[0] + ' pours out ' + ds(b) + ' L. How much is left?' : kind === 'diff' ? two[0] + ' ran ' + ds(a) + ' km. ' + two[1] + ' ran ' + ds(b) + ' km. How much farther did ' + two[0] + ' run?' : two[0] + ' walked ' + ds(a) + ' km to the park and ' + ds(b) + ' km back. How far did ' + two[0] + ' walk in all?';
        var ans = kind === 'join' ? 0 : 1;
        return { q: t + ' <b>Which way?</b> Pick the operation.', type: 'mc', options: ['Add', 'Subtract'], answer: ans,
          hint: 'Are you putting amounts together, or finding what is left or the difference?', steps: [ans ? 'Subtract: ' + ds(a) + ' &minus; ' + ds(b) + ' = ' + ds(a - b) + '.' : 'Add: ' + ds(a) + ' + ' + ds(b) + ' = ' + ds(a + b) + '.'],
          explain: ans ? 'Subtract. The answer is ' + ds(a - b) + '.' : 'Add. The answer is ' + ds(a + b) + '.', meta: { k: 'de4-sub-which', kind: kind } };
      }],
      [2, 'fill', function () {
        var a = R.int(25, 80), b = R.int(11, a - 5);
        return { q: 'Subtract. Then check by adding.', type: 'fill', fill: '<span class="math">' + ds(a) + ' &minus; ' + ds(b) + ' = [[]]</span><br>Check: <span class="math">[[]] + ' + ds(b) + ' = ' + ds(a) + '</span>', answers: [(a - b) / 10, (a - b) / 10], tol: 0.001,
          hint: 'Line up the decimal points. Trade 1 whole for 10 tenths if you need to.', steps: [a + ' tenths &minus; ' + b + ' tenths = ' + (a - b) + ' tenths = ' + ds(a - b) + '.'],
          explain: ds(a) + ' &minus; ' + ds(b) + ' = ' + ds(a - b) + '.', meta: { k: 'de4-sub-fill', a: a, b: b } };
      }]
    ]
  };
  Atlas.Q.shapes('decimals', SHAPES);
})();
