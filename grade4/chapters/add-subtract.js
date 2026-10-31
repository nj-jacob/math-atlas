(function () {
  var A = Atlas, R = A.R;
  function dg(n, i) { return Math.floor(n / Math.pow(10, i)) % 10; }
  function len(n) { return String(n).length; }

  /* column addition, showing the first k columns (from the right) worked out, with carries */
  function addCols(a, b, k) {
    var L = Math.max(len(a), len(b), len(a + b)), cw = 46, W = 60 + L * cw + 20, x0 = W - 20, s = '', carry = 0, carries = [], res = [];
    for (var i = 0; i < L; i++) { var t = dg(a, i) + dg(b, i) + carry; res.push(t % 10); carry = Math.floor(t / 10); carries.push(carry); }
    if (k === undefined) k = L;
    function cx(i) { return x0 - cw * (i + 0.5); }
    for (var i2 = 0; i2 < L; i2++) {
      var p = Math.min(i2, 4);
      s += '<rect x="' + (cx(i2) - cw / 2 + 2) + '" y="40" width="' + (cw - 4) + '" height="134" rx="8" style="fill:color-mix(in srgb,var(--p' + p + ') ' + (i2 < k ? 16 : 7) + '%,var(--card))"/>';
      if (i2 < len(a)) s += '<text x="' + cx(i2) + '" y="80" text-anchor="middle" font-size="34" font-weight="700" style="font-family:var(--display)">' + dg(a, i2) + '</text>';
      if (i2 < len(b)) s += '<text x="' + cx(i2) + '" y="122" text-anchor="middle" font-size="34" font-weight="700" style="font-family:var(--display)">' + dg(b, i2) + '</text>';
      if (i2 < k && (i2 < L - 1 || res[i2] || L === 1 || i2 < len(a + b))) s += '<text x="' + cx(i2) + '" y="166" text-anchor="middle" font-size="34" font-weight="700" style="font-family:var(--display);fill:var(--accent)">' + res[i2] + '</text>';
      if (i2 < k && carries[i2] && i2 + 1 < L) s += '<text x="' + cx(i2 + 1) + '" y="30" text-anchor="middle" font-size="20" font-weight="700" style="fill:var(--bad)">1</text>';
      s += '<text x="' + cx(i2) + '" y="194" text-anchor="middle" font-size="15" class="t2">' + ['ones', 'tens', 'hund.', 'thous.', 'ten th.'][p] + '</text>';
    }
    s += '<text x="' + (x0 - L * cw - 14) + '" y="122" text-anchor="middle" font-size="34" font-weight="700">+</text>';
    s += '<line x1="' + (x0 - L * cw - 30) + '" y1="132" x2="' + x0 + '" y2="132" style="stroke:var(--ink)" stroke-width="3"/>';
    return A.svg(W, 202, s, A.fmt(a) + ' plus ' + A.fmt(b) + ' in columns' + (k >= L ? ', answer ' + A.fmt(a + b) : ''));
  }
  /* the steps of column addition, in words */
  function addSteps(a, b) {
    var L = len(a + b), carry = 0, out = [], nm = A.PLACES;
    for (var i = 0; i < Math.max(len(a), len(b)); i++) {
      var t = dg(a, i) + dg(b, i) + carry;
      out.push('Add the ' + nm[i] + ': ' + dg(a, i) + ' + ' + dg(b, i) + (carry ? ' + 1 (carried)' : '') + ' = ' + t + '. ' +
        (t >= 10 ? 'That is 10 or more, so write ' + (t % 10) + ' and carry 1 ' + A.PLACE1[i + 1] + '.' : 'Write ' + t + '.'));
      carry = t >= 10 ? 1 : 0;
    }
    if (carry) out.push('Write the last carried 1 in the ' + nm[Math.max(len(a), len(b))] + ' place.');
    out.push('The sum is ' + A.fmt(a + b) + '.');
    return out;
  }
  /* column subtraction with regrouping. Records each column's values as it is regrouped. */
  function subPlan(a, b) {
    var L = len(a), top = [], hist = [];
    for (var i = 0; i < L; i++) { top.push(dg(a, i)); hist.push([{ v: dg(a, i), at: -1 }]); }
    var trades = [];
    for (var c = 0; c < L; c++) {
      if (top[c] < dg(b, c)) {
        var j = c + 1;
        while (top[j] === 0) j++;
        top[j]--; hist[j].push({ v: top[j], at: c });
        for (var m = j - 1; m > c; m--) { top[m] = 9; hist[m].push({ v: 10, at: c }); hist[m].push({ v: 9, at: c }); }
        top[c] += 10; hist[c].push({ v: top[c], at: c });
        trades.push({ col: c, from: j });
      }
    }
    return { top: top, hist: hist, trades: trades, L: L };
  }
  function subCols(a, b, k) {
    var P = subPlan(a, b), L = P.L, cw = 50, W = 60 + L * cw + 20, x0 = W - 20, s = '', r = a - b;
    if (k === undefined) k = L;
    function cx(i) { return x0 - cw * (i + 0.5); }
    for (var i = 0; i < L; i++) {
      var p = Math.min(i, 4), vis = P.hist[i].filter(function (h) { return h.at < k; });
      s += '<rect x="' + (cx(i) - cw / 2 + 2) + '" y="40" width="' + (cw - 4) + '" height="134" rx="8" style="fill:color-mix(in srgb,var(--p' + p + ') ' + (i < k ? 16 : 7) + '%,var(--card))"/>';
      /* the original top digit, crossed out if it was regrouped; the newest value above it */
      s += '<text x="' + cx(i) + '" y="80" text-anchor="middle" font-size="34" font-weight="700" style="font-family:var(--display)' + (vis.length > 1 ? ';fill:var(--ink2)' : '') + '">' + dg(a, i) + '</text>';
      if (vis.length > 1) {
        s += '<line x1="' + (cx(i) - 13) + '" y1="76" x2="' + (cx(i) + 13) + '" y2="56" style="stroke:var(--bad)" stroke-width="3"/>';
        s += '<text x="' + cx(i) + '" y="32" text-anchor="middle" font-size="20" font-weight="700" style="fill:var(--bad)">' + vis[vis.length - 1].v + '</text>';
      }
      if (i < len(b)) s += '<text x="' + cx(i) + '" y="122" text-anchor="middle" font-size="34" font-weight="700" style="font-family:var(--display)">' + dg(b, i) + '</text>';
      if (i < k && (i < len(r) || (r === 0 && i === 0))) s += '<text x="' + cx(i) + '" y="166" text-anchor="middle" font-size="34" font-weight="700" style="font-family:var(--display);fill:var(--accent)">' + dg(r, i) + '</text>';
      s += '<text x="' + cx(i) + '" y="194" text-anchor="middle" font-size="15" class="t2">' + ['ones', 'tens', 'hund.', 'thous.', 'ten th.'][p] + '</text>';
    }
    s += '<text x="' + (x0 - L * cw - 14) + '" y="122" text-anchor="middle" font-size="34" font-weight="700">&minus;</text>';
    s += '<line x1="' + (x0 - L * cw - 30) + '" y1="132" x2="' + x0 + '" y2="132" style="stroke:var(--ink)" stroke-width="3"/>';
    return A.svg(W, 202, s, A.fmt(a) + ' minus ' + A.fmt(b) + ' in columns' + (k >= L ? ', answer ' + A.fmt(r) : ''));
  }
  function subSteps(a, b) {
    var P = subPlan(a, b), out = [], nm = A.PLACES, top = [];
    for (var i = 0; i < P.L; i++) top.push(dg(a, i));
    for (var c = 0; c < P.L; c++) {
      var t = P.trades.filter(function (x) { return x.col === c; })[0], before = top[c];
      if (t) {
        var msg = 'In the ' + nm[c] + ', ' + before + ' is less than ' + dg(b, c) + ', so regroup. ';
        if (t.from === c + 1) msg += 'Trade 1 ' + A.PLACE1[c + 1] + ' for 10 ' + nm[c] + '. Now there are ' + (before + 10) + ' ' + nm[c] + '.';
        else msg += 'The ' + nm[c + 1] + ' place has 0, so first trade 1 ' + A.PLACE1[t.from] + ' for 10 ' + nm[t.from - 1] + (t.from - 1 > c + 1 ? ', and keep trading down' : '') + '. Then trade 1 ' + A.PLACE1[c + 1] + ' for 10 ' + nm[c] + '. Now there are ' + (before + 10) + ' ' + nm[c] + '.';
        top[t.from]--; for (var m = t.from - 1; m > c; m--) top[m] = 9; top[c] += 10;
        out.push(msg + ' ' + top[c] + ' &minus; ' + dg(b, c) + ' = ' + (top[c] - dg(b, c)) + '.');
      } else if (c < len(b) || top[c] !== dg(a, c)) out.push('Subtract the ' + nm[c] + ': ' + top[c] + ' &minus; ' + dg(b, c) + ' = ' + (top[c] - dg(b, c)) + '.');
      else out.push('Bring down the ' + nm[c] + ': ' + top[c] + '.');
    }
    out.push('The difference is ' + A.fmt(a - b) + '. Check: ' + A.fmt(a - b) + ' + ' + A.fmt(b) + ' = ' + A.fmt(a) + '.');
    return out;
  }
  /* open number line with jumps: start, then a list of jumps, each {v, label} */
  function jumps(start, list, label, back) {
    var total = list.reduce(function (s, j) { return s + j; }, 0), W = 560, x0 = 30, x1 = 530, lo = back ? start - total : start, hi = back ? start : start + total;
    var span = hi - lo || 1, s = '', at = start, minW = 70;
    /* widths are proportional, but every jump gets at least minW pixels so its label fits */
    var raw = list.map(function (j) { return (x1 - x0) * j / span; }), extra = 0;
    raw.forEach(function (w) { if (w < minW) extra += minW - w; });
    var big = raw.filter(function (w) { return w >= minW; }).reduce(function (s, w) { return s + w; }, 0) || 1;
    var ws = raw.map(function (w) { return w < minW ? minW : w - extra * w / big; });
    s += '<line x1="' + x0 + '" y1="120" x2="' + x1 + '" y2="120" style="stroke:var(--ink)" stroke-width="3"/>';
    var x = back ? x1 : x0;
    s += '<line x1="' + x + '" y1="110" x2="' + x + '" y2="130" style="stroke:var(--ink)" stroke-width="2.5"/><text x="' + x + '" y="152" text-anchor="middle" font-size="18" class="tb">' + A.fmt(start) + '</text>';
    list.forEach(function (j, i) {
      var nx = back ? x - ws[i] : x + ws[i], mid = (x + nx) / 2, hgt = Math.min(70, 26 + ws[i] / 4);
      at = back ? at - j : at + j;
      s += '<path d="M' + x + ' 116 Q' + mid + ' ' + (116 - hgt * 1.4) + ' ' + nx + ' 116" fill="none" style="stroke:var(--strand)" stroke-width="3" marker-end="url(#asj)"/>' +
        '<text x="' + mid + '" y="' + (108 - hgt * 0.75) + '" text-anchor="middle" font-size="18" font-weight="700" style="fill:var(--strand)">' + (back ? '&minus;' : '+') + A.fmt(j) + '</text>' +
        '<line x1="' + nx + '" y1="110" x2="' + nx + '" y2="130" style="stroke:var(--ink)" stroke-width="2.5"/><text x="' + nx + '" y="' + (i % 2 ? 174 : 152) + '" text-anchor="middle" font-size="18" class="tb">' + A.fmt(at) + '</text>';
      x = nx;
    });
    s = '<defs><marker id="asj" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--strand)"/></marker></defs>' + s;
    return A.svg(W, 182, s, label);
  }
  /* bar model: whole on top, two parts below */
  function barModel(whole, p1, p2, l1, l2, unknown) {
    var W = 540, x0 = 10, w1 = Math.max(110, (W - 20) * p1 / whole), w2 = W - 20 - w1, s = '';
    s += '<rect x="' + x0 + '" y="8" width="' + (W - 20) + '" height="44" rx="8" style="fill:color-mix(in srgb,var(--strand) 18%,var(--card));stroke:var(--ink)" stroke-width="2"/>' +
      '<text x="' + (W / 2) + '" y="37" text-anchor="middle" font-size="23" font-weight="700">' + (unknown === 'w' ? '?' : A.fmt(whole)) + '</text>';
    s += '<rect x="' + x0 + '" y="60" width="' + w1 + '" height="44" rx="8" style="fill:color-mix(in srgb,var(--hi) 35%,var(--card));stroke:var(--ink)" stroke-width="2"/>' +
      '<text x="' + (x0 + w1 / 2) + '" y="89" text-anchor="middle" font-size="23" font-weight="700">' + (unknown === 'a' ? '?' : A.fmt(p1)) + '</text>' +
      '<rect x="' + (x0 + w1) + '" y="60" width="' + w2 + '" height="44" rx="8" style="fill:color-mix(in srgb,var(--accent) 22%,var(--card));stroke:var(--ink)" stroke-width="2"/>' +
      '<text x="' + (x0 + w1 + w2 / 2) + '" y="89" text-anchor="middle" font-size="23" font-weight="700">' + (unknown === 'b' ? '?' : A.fmt(p2)) + '</text>';
    s += '<text x="' + (x0 + w1 / 2) + '" y="128" text-anchor="middle" font-size="19" class="t2">' + l1 + '</text><text x="' + (x0 + w1 + w2 / 2) + '" y="128" text-anchor="middle" font-size="19" class="t2">' + l2 + '</text>';
    return A.svg(W, 134, s, 'Bar model: ' + l1 + ' and ' + l2 + ' make the whole');
  }
  /* a pair of numbers with regrouping in the ones and tens, sized for each level */
  function addPair(lv) {
    var a, b;
    do {
      if (lv === 1) { a = R.int(100, 899); b = R.int(100, 899); }
      else if (lv === 2) { a = R.int(1000, 5999); b = R.int(100, 3999); }
      else { a = R.int(1000, 6999); b = R.int(1000, 2999); }
    } while (a + b > 9999 || (dg(a, 0) + dg(b, 0) < 10 && dg(a, 1) + dg(b, 1) < 10));
    return [a, b];
  }
  function subPair(lv) {
    var a, b;
    do {
      if (lv === 1) { a = R.int(300, 999); b = R.int(100, a - 50); }
      else if (lv === 2) { a = R.int(2000, 9999); b = R.int(500, a - 200); }
      else { a = R.int(2, 9) * 1000 + R.pick([0, 0, R.int(1, 9) * 100]) + R.int(0, 9); b = R.int(1000, a - 100); }
    } while (b <= 0 || dg(a, 0) >= dg(b, 0));
    return [a, b];
  }
  var NAMES = ['Maya', 'Liam', 'Aanya', 'Noah', 'Zoe', 'Omar', 'Chloe', 'Ethan'];
  var gen = {
    add: function (lv) {
      var p = addPair(lv), a = p[0], b = p[1], s = a + b;
      return { q: 'Add: <span class="math">' + A.fmt(a) + ' + ' + A.fmt(b) + '</span>', type: 'num', answer: s,
        fig: lv === 1 ? addCols(a, b, 0) : '', hint: 'Line up the places. Start with the ones. If a column makes 10 or more, carry 1 to the next place.',
        steps: addSteps(a, b).concat(['<div class="fig">' + addCols(a, b) + '</div>']), explain: A.fmt(a) + ' + ' + A.fmt(b) + ' = ' + A.fmt(s) + '.' };
    },
    sub: function (lv) {
      var p = subPair(lv), a = p[0], b = p[1];
      return { q: 'Subtract: <span class="math">' + A.fmt(a) + ' &minus; ' + A.fmt(b) + '</span>', type: 'num', answer: a - b,
        fig: lv === 1 ? subCols(a, b, 0) : '', hint: 'Start with the ones. If the top digit is smaller, trade 1 from the next place to the left for 10.',
        steps: subSteps(a, b).concat(['<div class="fig">' + subCols(a, b) + '</div>']), explain: A.fmt(a) + ' &minus; ' + A.fmt(b) + ' = ' + A.fmt(a - b) + '. Check: ' + A.fmt(a - b) + ' + ' + A.fmt(b) + ' = ' + A.fmt(a) + '.' };
    },
    mental: function (lv) {
      if (lv === 1) {
        var a = R.int(2, 8) * 1000 + R.int(1, 9) * 100, b = R.int(1, 9) * 100;
        var op = R.pick(['+', '-']); if (op === '-' && b > a) op = '+';
        var ans = op === '+' ? a + b : a - b;
        return { q: 'Work it out in your head: <span class="math">' + A.fmt(a) + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + A.fmt(b) + '</span>', type: 'num', answer: ans,
          hint: 'Think in hundreds: ' + A.fmt(a) + ' is ' + a / 100 + ' hundreds.', steps: [A.fmt(a) + ' is ' + a / 100 + ' hundreds and ' + b + ' is ' + b / 100 + ' hundreds.', a / 100 + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + b / 100 + ' = ' + ans / 100 + ' hundreds.', ans / 100 + ' hundreds is ' + A.fmt(ans) + '.'],
          explain: 'Thinking in hundreds makes it a small fact: ' + A.fmt(ans) + '.' };
      }
      if (lv === 2) {
        var near = R.int(2, 8) * 1000, x = near - R.int(1, 3), y = R.int(1, 9) * 100 + R.int(11, 89);
        return { q: 'Use a friendly number: <span class="math">' + A.fmt(x) + ' + ' + A.fmt(y) + '</span>', type: 'num', answer: x + y,
          fig: jumps(x, [near - x, y - (near - x)], 'Number line from ' + x), hint: A.fmt(x) + ' is close to ' + A.fmt(near) + '. Move ' + (near - x) + ' from ' + y + ' to make ' + A.fmt(near) + '.',
          steps: ['Take ' + (near - x) + ' from ' + y + ' and give it to ' + A.fmt(x) + '. Now it is ' + A.fmt(near) + ' + ' + (y - (near - x)) + '.', A.fmt(near) + ' + ' + (y - (near - x)) + ' = ' + A.fmt(x + y) + '.'],
          explain: A.fmt(x) + ' + ' + y + ' = ' + A.fmt(near) + ' + ' + (y - (near - x)) + ' = ' + A.fmt(x + y) + '.' };
      }
      var big = R.int(3, 9) * 1000 + R.int(1, 4) * 100 + R.int(1, 9) * 10, small = Math.floor(big / 1000 - 1) * 1000 - R.int(1, 3) * 100 - R.int(2, 8) * 10;
      if (small < 500) small = 680;
      var up1 = Math.ceil(small / 1000) * 1000 - small, rest = big - Math.ceil(small / 1000) * 1000;
      return { q: 'Count up to find the difference: <span class="math">' + A.fmt(big) + ' &minus; ' + A.fmt(small) + '</span>', type: 'num', answer: big - small,
        fig: jumps(small, [up1, rest], 'Counting up from ' + small + ' to ' + big), hint: 'Jump from ' + A.fmt(small) + ' to the next thousand first. Then jump to ' + A.fmt(big) + '. Add the jumps.',
        steps: ['From ' + A.fmt(small) + ' to ' + A.fmt(small + up1) + ' is ' + up1 + '.', 'From ' + A.fmt(small + up1) + ' to ' + A.fmt(big) + ' is ' + A.fmt(rest) + '.', 'Add the jumps: ' + up1 + ' + ' + A.fmt(rest) + ' = ' + A.fmt(big - small) + '.'],
        explain: 'The difference is ' + A.fmt(big - small) + '.' };
    },
    estimate: function (lv) {
      var p = lv === 1 ? 100 : 1000, a = lv === 1 ? R.int(110, 890) : R.int(1100, 6900), b = lv === 1 ? R.int(110, 890) : R.int(1100, 2900);
      var op = R.pick(['+', '-']), ra = Math.round(a / p) * p, rb = Math.round(b / p) * p;
      if (op === '-' && a < b) { var t = a; a = b; b = t; t = ra; ra = rb; rb = t; }
      var est = op === '+' ? ra + rb : ra - rb, exact = op === '+' ? a + b : a - b;
      if (lv === 3) {
        var wrongAns = exact + (exact < 1500 ? 1 : R.pick([-1, 1])) * R.pick([1000, 900, 1100]);
        var ok = R.int(0, 1) === 1, shownAns = ok ? exact : wrongAns;
        var o = R.mc(ok ? 'Yes, it is close to the estimate' : 'No, it is too far from the estimate', [ok ? 'No, it is too far from the estimate' : 'Yes, it is close to the estimate']);
        return { q: 'Jo says <span class="math">' + A.fmt(a) + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + A.fmt(b) + ' = ' + A.fmt(shownAns) + '</span>. Use an estimate. Is that answer reasonable?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Round each number to the nearest thousand, then ' + (op === '+' ? 'add' : 'subtract') + '.', steps: ['Round: ' + A.fmt(a) + ' &rarr; ' + A.fmt(ra) + ' and ' + A.fmt(b) + ' &rarr; ' + A.fmt(rb) + '.', 'Estimate: ' + A.fmt(ra) + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + A.fmt(rb) + ' = ' + A.fmt(est) + '.', A.fmt(shownAns) + (ok ? ' is close to ' : ' is far from ') + A.fmt(est) + '.'],
          explain: 'The estimate is ' + A.fmt(est) + '. The exact answer is ' + A.fmt(exact) + '.' };
      }
      var o2 = R.mc(A.fmt(est), [A.fmt(est + p), A.fmt(est - p), A.fmt(op === '+' ? Math.floor(a / p) * p + Math.floor(b / p) * p : est + 2 * p)].filter(function (x) { return x !== A.fmt(est); }));
      return { q: 'Round each number to the nearest ' + (p === 100 ? 'hundred' : 'thousand') + ', then estimate: <span class="math">' + A.fmt(a) + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + A.fmt(b) + '</span>', type: 'mc', options: o2.options, answer: o2.answer,
        hint: 'Round each number first. Look at the digit to the right of the rounding place.', steps: [A.fmt(a) + ' rounds to ' + A.fmt(ra) + '.', A.fmt(b) + ' rounds to ' + A.fmt(rb) + '.', A.fmt(ra) + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + A.fmt(rb) + ' = ' + A.fmt(est) + '.'],
        explain: 'The estimate is ' + A.fmt(est) + '. The exact answer, ' + A.fmt(exact) + ', is close to it.' };
    },
    inverse: function (lv) {
      var a = R.int(1200, 8000), b = R.int(300, a - 300), c = a - b;
      if (lv === 1) {
        var o = R.mc(A.fmt(c) + ' + ' + A.fmt(b) + ' = ' + A.fmt(a), [A.fmt(a) + ' + ' + A.fmt(b) + ' = ' + A.fmt(a + b), A.fmt(c) + ' + ' + A.fmt(c) + ' = ' + A.fmt(2 * c), A.fmt(a) + ' + ' + A.fmt(c) + ' = ' + A.fmt(a + c)]);
        return { q: 'Which addition checks <span class="math">' + A.fmt(a) + ' &minus; ' + A.fmt(b) + ' = ' + A.fmt(c) + '</span>?', type: 'mc', options: o.options, answer: o.answer,
          fig: barModel(a, c, b, 'answer', 'took away'), hint: 'Answer + the number you took away should give back the start number.',
          steps: ['Subtraction undoes addition.', 'Add the answer and the number you took away: ' + A.fmt(c) + ' + ' + A.fmt(b) + '.', 'If you get ' + A.fmt(a) + ', the subtraction is right.'],
          explain: A.fmt(c) + ' + ' + A.fmt(b) + ' = ' + A.fmt(a) + ', so the subtraction checks out.' };
      }
      var miss = R.pick(['a', 'b']);
      if (lv === 2) {
        return { q: 'Find the missing number: <span class="math">' + (miss === 'a' ? '&#9633; + ' + A.fmt(b) : A.fmt(c) + ' + &#9633;') + ' = ' + A.fmt(a) + '</span>', type: 'num', answer: miss === 'a' ? c : b,
          fig: barModel(a, c, b, 'one part', 'other part', miss), hint: 'The whole is ' + A.fmt(a) + '. Subtract the part you know.',
          steps: ['The whole is ' + A.fmt(a) + '. One part is ' + A.fmt(miss === 'a' ? b : c) + '.', 'Missing part = ' + A.fmt(a) + ' &minus; ' + A.fmt(miss === 'a' ? b : c) + ' = ' + A.fmt(miss === 'a' ? c : b) + '.'],
          explain: 'The missing number is ' + A.fmt(miss === 'a' ? c : b) + '.' };
      }
      return { q: 'Find the missing number: <span class="math">' + A.fmt(a) + ' &minus; &#9633; = ' + A.fmt(c) + '</span>', type: 'num', answer: b,
        hint: 'Start with ' + A.fmt(a) + '. How much do you take away to land on ' + A.fmt(c) + '?', steps: ['The whole is ' + A.fmt(a) + ' and what is left is ' + A.fmt(c) + '.', 'The amount taken away is ' + A.fmt(a) + ' &minus; ' + A.fmt(c) + ' = ' + A.fmt(b) + '.'],
        explain: A.fmt(a) + ' &minus; ' + A.fmt(b) + ' = ' + A.fmt(c) + '.' };
    },
    words: function (lv) {
      var nm = R.pick(NAMES);
      if (lv === 1) {
        var x = R.int(1200, 4800), y = R.int(300, 2500);
        return { q: nm + '\'s school collected ' + A.fmt(x) + ' cans in the fall and ' + A.fmt(y) + ' cans in the spring. How many cans in all?', type: 'num', answer: x + y, unit: 'cans',
          fig: barModel(x + y, x, y, 'fall', 'spring', 'w'), hint: '"In all" means put the parts together. Add.', steps: ['The parts are ' + A.fmt(x) + ' and ' + A.fmt(y) + '. The whole is unknown.', A.fmt(x) + ' + ' + A.fmt(y) + ' = ' + A.fmt(x + y) + '.'], explain: A.fmt(x) + ' + ' + A.fmt(y) + ' = ' + A.fmt(x + y) + ' cans.' };
      }
      if (lv === 2) {
        var t = R.int(4000, 9000), u = R.int(1200, t - 900);
        return { q: 'A theatre has ' + A.fmt(t) + ' seats. ' + A.fmt(u) + ' seats are sold. How many seats are left?', type: 'num', answer: t - u, unit: 'seats',
          fig: barModel(t, u, t - u, 'sold', 'left', 'b'), hint: 'You know the whole and one part. Subtract to find the other part.', steps: ['Whole: ' + A.fmt(t) + '. Sold: ' + A.fmt(u) + '.', 'Left = ' + A.fmt(t) + ' &minus; ' + A.fmt(u) + ' = ' + A.fmt(t - u) + '.'], explain: A.fmt(t - u) + ' seats are left.' };
      }
      var s0 = R.int(3000, 6000), add = R.int(800, 2500), sp = R.int(1000, s0 - 500);
      return { q: 'A library had ' + A.fmt(s0) + ' books. It bought ' + A.fmt(add) + ' more, then gave away ' + A.fmt(sp) + '. How many books does it have now?', type: 'num', answer: s0 + add - sp, unit: 'books',
        hint: 'Two steps. First add the new books. Then subtract the books given away.', steps: ['Step 1: ' + A.fmt(s0) + ' + ' + A.fmt(add) + ' = ' + A.fmt(s0 + add) + '.', 'Step 2: ' + A.fmt(s0 + add) + ' &minus; ' + A.fmt(sp) + ' = ' + A.fmt(s0 + add - sp) + '.'],
        explain: 'The library has ' + A.fmt(s0 + add - sp) + ' books now.' };
    }
  };

  /* ---------- one idea at a time ---------- */
  var K = A.kit;
  function T(name, lv) { return function () { return gen[name](lv); }; }
  function carriesOf(a, b) { var c = 0, n = 0; for (var i = 0; i < 5; i++) { c = dg(a, i) + dg(b, i) + c >= 10 ? 1 : 0; n += c; } return n; }
  /* the jumps for counting up: to the next hundred, the next thousand, then on to the target */
  function hopList(f, t) {
    var L = [], c = f;
    [100, 1000].forEach(function (u) { var n = Math.ceil(c / u) * u; if (n > c && n <= t) { L.push(n - c); c = n; } });
    [1000, 100].forEach(function (u) { var n = Math.floor(t / u) * u; if (n > c) { L.push(n - c); c = n; } });
    if (t > c) L.push(t - c);
    return L;
  }
  /* estimate and exact answer on a short number line */
  function estFig(est, exact) {
    var lo = est - 1500, W = 540, x = function (v) { return 30 + (v - lo) / 3000 * 480; }, s = '';
    s += '<line x1="30" y1="70" x2="510" y2="70" style="stroke:var(--ink)" stroke-width="3"/>';
    for (var v = lo; v <= lo + 3000; v += 500) s += '<line x1="' + x(v) + '" y1="62" x2="' + x(v) + '" y2="78" style="stroke:var(--ink)" stroke-width="2"/><text x="' + x(v) + '" y="100" text-anchor="middle" font-size="16" class="t2">' + A.fmt(v) + '</text>';
    s += '<rect x="' + Math.min(x(est), x(exact)) + '" y="64" width="' + Math.abs(x(exact) - x(est)) + '" height="12" style="fill:color-mix(in srgb,var(--hi) 55%,transparent)"/>';
    s += '<circle cx="' + x(est) + '" cy="70" r="9" style="fill:var(--accent)"/><text x="' + x(est) + '" y="40" text-anchor="middle" font-size="17" font-weight="700" style="fill:var(--accent)">estimate ' + A.fmt(est) + '</text>';
    s += '<circle cx="' + x(exact) + '" cy="70" r="9" style="fill:var(--strand)"/><text x="' + x(exact) + '" y="' + (Math.abs(x(exact) - x(est)) < 150 ? 128 : 40) + '" text-anchor="middle" font-size="17" font-weight="700" style="fill:var(--strand)">exact ' + A.fmt(exact) + '</text>';
    return A.svg(W, 136, s, 'Estimate ' + A.fmt(est) + ' and exact answer ' + A.fmt(exact) + ' on a number line');
  }
  /* a column lab: type two numbers and reveal one column at a time */
  function colLab(sub, tasks) {
    return K.lab({ controls: [
      { id: 'a', label: sub ? 'Top number' : 'First number', type: 'number', min: 0, max: sub ? 10000 : 9999, value: sub ? 5032 : 3587 },
      { id: 'b', label: sub ? 'Take away' : 'Second number', type: 'number', min: 0, max: 9999, value: sub ? 1758 : 2646 },
      { id: 'nx', label: 'Show the next step', type: 'action', act: function (s) { s.k++; }, can: function (s) { return s.ok && s.k < s.cols; } },
      { id: 'again', label: 'Start again', type: 'action', act: function (s) { s.k = 0; }, can: function (s) { return s.k > 0; } }],
      init: function (s) { s.k = 0; s.key = ''; },
      render: function (s) {
        var key = s.a + ',' + s.b; if (key !== s.key) { s.k = 0; s.key = key; }
        s.ok = sub ? s.b <= s.a : s.a + s.b <= 10000;
        if (!s.ok) { s.cols = 0; return { fig: '', out: '<p>' + (sub ? 'Make the top number the bigger one.' : 'Pick numbers that add to 10 000 or less.') + '</p>' }; }
        s.cols = len(sub ? s.a : s.a + s.b); s.carries = carriesOf(s.a, s.b);
        var st = sub ? subSteps(s.a, s.b) : addSteps(s.a, s.b);
        return { fig: sub ? subCols(s.a, s.b, s.k) : addCols(s.a, s.b, s.k),
          out: s.k === 0 ? '<p>Press <b>Show the next step</b> to start with the ones.</p>' : '<ol>' + st.slice(0, s.k >= s.cols ? st.length : s.k).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>' };
      }, tasks: tasks });
  }
  function colFrames(a, b, sub) {
    var L = len(sub ? a : a + b), st = sub ? subSteps(a, b) : addSteps(a, b), f = [[(sub ? A.fmt(a) + ' &minus; ' : A.fmt(a) + ' + ') + A.fmt(b) + '. Line up the places. Start with the ones.', sub ? subCols(a, b, 0) : addCols(a, b, 0), 1800]];
    for (var k = 1; k <= L; k++) f.push([st[k - 1] || st[st.length - 1], sub ? subCols(a, b, k) : addCols(a, b, k), 2600]);
    f.push([st[st.length - 1], sub ? subCols(a, b) : addCols(a, b), 2200]);
    return f;
  }
  var STORIES = [
    { t: 'A school collected <b>2475</b> cans in the fall and <b>1386</b> in the spring. How many cans in all?', w: 3861, p1: 2475, p2: 1386, l1: 'fall', l2: 'spring', u: 'whole' },
    { t: 'A theatre has <b>6250</b> seats. <b>3875</b> are sold. How many seats are not sold?', w: 6250, p1: 3875, p2: 2375, l1: 'sold', l2: 'not sold', u: 'part' },
    { t: 'A trail is <b>4120 m</b> long. Priya has walked <b>2675 m</b>. How far does she have left?', w: 4120, p1: 2675, p2: 1445, l1: 'walked', l2: 'left', u: 'part' }
  ];

  var LESSONS = [
    { id: 'adding', title: 'Adding with regrouping', sub: 'Add the same places. Trade 10 for 1.', concepts: [
      { id: 'same-places', title: 'Add the same places', exp: ['B2.4'], skill: 'as-add',
        body: '<p>To add, put <b>ones with ones, tens with tens, hundreds with hundreds</b>. When a place gets 10 or more, trade 10 of them for 1 of the next place.</p>',
        watch: { tool: 'base10', opts: { h: 1, t: 5, o: 6 }, steps: [
          { say: '156 is on the mat. Let\'s add 267.', act: function (t) { return t.wait(400); }, ms: 1400 },
          { say: 'Add 2 hundreds.', act: function (t) { return t.add('h', 2); } },
          { say: 'Add 6 tens.', act: function (t) { return t.add('t', 6, 120); } },
          { say: 'Add 7 ones. Now there are <b>13 ones</b>.', act: function (t) { return t.add('o', 7, 120); } },
          { say: '10 ones make 1 ten. Now there are 12 tens.', act: function (t) { return t.group('o'); } },
          { say: '10 tens make 1 hundred. <b>156 + 267 = 423</b>.', act: function (t) { return t.group('t'); }, ms: 2000 }
        ] },
        try: { tool: 'base10', opts: { controls: true, h: 1, t: 5, o: 6 }, tasks: [
          { do: '156 is on the mat. <b>Add 248</b>, then group until every place has fewer than 10.', goal: function (s) { return s.value === 404 && s.o < 10 && s.t < 10; }, yes: '156 + 248 = 404. The tens traded away to leave 0 tens.' },
          { do: 'Now 375 is on the mat. <b>Add 125</b> and group.', setup: function (t) { t.set(3, 7, 5); }, goal: function (s) { return s.value === 500 && s.o < 10 && s.t < 10; }, yes: '375 + 125 = 500. Two trades in a row.' }
        ] },
        key: '<p>Add the same places. <b>10 of a place trade for 1 of the next place.</b></p>',
        check: [T('add', 1), T('add', 1)] },

      { id: 'carry', title: 'The column method', exp: ['B2.4'], skill: 'as-add', hard: true,
        body: '<p>The column method is a short way to write what the blocks do. Start with the <b>ones</b>. If a column makes 10 or more, write the ones digit and <b>carry 1</b> to the next column.</p>',
        watch: K.watch(colFrames(3587, 2646)),
        try: colLab(false, [
          { do: 'Step through <b>3587 + 2646</b> to the end.', setup: function (api) { api.set('a', 3587); api.set('b', 2646); }, goal: function (s) { return s.a === 3587 && s.b === 2646 && s.k >= s.cols; }, yes: '6233. Three columns made 10 or more, so three carries.' },
          { do: 'Type two numbers of your own that need <b>at least 2 carries</b>. Step to the end.', goal: function (s) { return s.ok && s.carries >= 2 && s.k >= s.cols && !(s.a === 3587 && s.b === 2646); }, yes: function (s) { return A.fmt(s.a) + ' + ' + A.fmt(s.b) + ' = ' + A.fmt(s.a + s.b) + '.'; } }
        ]),
        ways: [
          { label: 'Add the places first', html: '<p>Add each place on its own, then put the parts together.</p><p class="math">3587 + 2646<br>thousands: 3000 + 2000 = <b class="c3t">5000</b><br>hundreds: 500 + 600 = <b class="c2t">1100</b><br>tens: 80 + 40 = <b class="c1t">120</b><br>ones: 7 + 6 = <b class="c0t">13</b><br>5000 + 1100 + 120 + 13 = <b>6233</b></p>' },
          { label: 'With money', html: '<p>$587 + $646. Loonies: 7 + 6 = 13, so trade 10 loonies for a $10 bill and keep 3. Tens: 8 + 4 + 1 = 13 bills, so trade 10 for a $100 bill and keep 3. Hundreds: 5 + 6 + 1 = 12, so trade 10 for $1000 and keep 2.</p><p class="big">$1233</p>' },
          { label: 'Why carry 1?', html: '<p>A column can only hold one digit. 13 ones is really <b>1 ten and 3 ones</b>. The 3 stays; the 1 ten moves to the tens column. The small 1 on top is that ten.</p>' }
        ],
        key: '<p>Start with the ones. <b>10 or more? Write the ones digit and carry 1.</b></p>',
        mistake: '<p>Writing 13 in one column (an answer like 51 213), or forgetting to add the carried 1. Ask: "Does each column have only one digit? Did you add the small 1?"</p>',
        check: [T('add', 2), T('add', 3)] }
    ] },

    { id: 'subtracting', title: 'Subtracting with regrouping', sub: 'Trade from the left when the top digit is smaller.', concepts: [
      { id: 'trade', title: 'Break a block to take away', exp: ['B2.4'], skill: 'as-sub',
        body: '<p>Sometimes there are not enough ones to take away. <b>Break a ten into 10 ones.</b> The number stays the same, but now you can take away.</p>',
        watch: { tool: 'base10', opts: { h: 3, t: 4, o: 2 }, steps: [
          { say: '342. We will take away 128. Start with the ones: only 2 ones, but we need 8.', act: function (t) { return t.lightKind('o'); }, ms: 2200 },
          { say: 'Break 1 ten into 10 ones. Now there are <b>12 ones</b>. Still 342.', act: function (t) { t.clearLit(); return t.split('t'); } },
          { say: 'Take away 8 ones.', act: function (t) { return t.remove('o', 8); } },
          { say: 'Take away 2 tens.', act: function (t) { return t.remove('t', 2); } },
          { say: 'Take away 1 hundred. <b>342 &minus; 128 = 214</b>.', act: function (t) { return t.remove('h', 1); }, ms: 2000 }
        ] },
        try: { tool: 'base10', opts: { controls: true, h: 4, t: 3, o: 2 }, tasks: [
          { do: '432 is on the mat. <b>Take away 156.</b> Break blocks when you need to.', goal: function (s) { return s.value === 276; }, yes: '432 &minus; 156 = 276. You broke a ten and a hundred.' },
          { do: 'Now 500 is on the mat. <b>Take away 3.</b>', setup: function (t) { t.set(5, 0, 0); }, goal: function (s) { return s.value === 497; }, yes: '497. You broke a hundred into tens, then a ten into ones.' }
        ] },
        key: '<p>Not enough to take away? <b>Break 1 of the next place into 10.</b></p>',
        check: [T('sub', 1), T('sub', 1)] },

      { id: 'columns', title: 'Column subtraction', exp: ['B2.4'], skill: 'as-sub', hard: true,
        body: '<p>Start with the <b>ones</b>. If the top digit is smaller than the bottom digit, trade 1 from the place to the left for 10. Cross out and write the new digits.</p>',
        watch: K.watch(colFrames(6352, 2817, true)),
        try: colLab(true, [
          { do: 'Step through <b>5032 &minus; 1758</b> to the end.', setup: function (api) { api.set('a', 5032); api.set('b', 1758); }, goal: function (s) { return s.a === 5032 && s.b === 1758 && s.k >= s.cols; }, yes: '3274. Check: 3274 + 1758 = 5032.' },
          { do: 'Type your own subtraction where the <b>ones need a trade</b>. Step to the end.', goal: function (s) { return s.ok && dg(s.a, 0) < dg(s.b, 0) && s.k >= s.cols && !(s.a === 5032 && s.b === 1758); }, yes: function (s) { return A.fmt(s.a) + ' &minus; ' + A.fmt(s.b) + ' = ' + A.fmt(s.a - s.b) + '.'; } }
        ]),
        ways: [
          { label: 'Top minus bottom, always', html: '<p>Read each column from the <b>top</b> down. In 52 &minus; 18 the ones say "2 take away 8". You cannot, so trade a ten: 12 &minus; 8 = 4. Never flip it to 8 &minus; 2.</p><div class="fig">' + subCols(52, 18) + '</div>' },
          { label: 'Count up instead', html: '<p>Find the distance from 2817 up to 6352.</p><div class="fig">' + jumps(2817, hopList(2817, 6352), 'Counting up from 2817 to 6352') + '</div><p>83 + 100 + 3000 + 300 + 52 = <b>3535</b></p>' }
        ],
        key: '<p>Start with the ones. <b>Top digit smaller? Trade 1 from the left for 10.</b></p>',
        mistake: '<p>Taking the smaller digit from the bigger one in every column, so 52 &minus; 18 becomes 46. Ask: "Which number is on top in this column? Can you take the bottom one away from it?"</p>',
        check: [T('sub', 2), T('sub', 2)] },

      { id: 'zeros', title: 'Trading across zeros', exp: ['B2.4'], skill: 'as-sub', hard: true,
        body: '<p>When the next place is <b>0</b>, there is nothing to trade there yet. Go left until you find a digit, then trade down one place at a time.</p>',
        watch: K.watch(colFrames(5003, 1758, true)),
        try: colLab(true, [
          { do: 'Step through <b>6004 &minus; 2357</b>.', setup: function (api) { api.set('a', 6004); api.set('b', 2357); }, goal: function (s) { return s.a === 6004 && s.b === 2357 && s.k >= s.cols; }, yes: '3647. The two zeros each became 9.' },
          { do: 'Step through <b>7000 &minus; 3456</b>.', setup: function (api) { api.set('a', 7000); api.set('b', 3456); }, goal: function (s) { return s.a === 7000 && s.b === 3456 && s.k >= s.cols; }, yes: '3544. Check: 3544 + 3456 = 7000.' }
        ]),
        ways: [
          { label: 'Make it 4999', html: '<p>Take 4 away from <b>both</b> numbers. The difference does not change, and now no trades are needed.</p><p class="math">5003 &minus; 1758<br>= 4999 &minus; 1754<br>= <b>3245</b></p>' },
          { label: 'Count up', html: '<div class="fig">' + jumps(1758, hopList(1758, 5003), 'Counting up from 1758 to 5003') + '</div><p>42 + 200 + 3000 + 3 = <b>3245</b></p>' },
          { label: 'Think of 500 tens', html: '<p>5003 is <b>500 tens</b> and 3 ones. Trade 1 of those tens: 499 tens and 13 ones. That is why the zeros become 9 and 9.</p><div class="fig">' + subCols(5003, 1758) + '</div>' }
        ],
        key: '<p>Next place is 0? <b>Go left to the first digit and trade down one place at a time.</b> The zeros become 9s.</p>',
        mistake: '<p>Changing a zero into 10 and leaving it there, or forgetting to take 1 from the thousands. In 5003 &minus; 1758 the top should read 4, 9, 9, 13. Have your child say each trade out loud.</p>',
        check: [T('sub', 3), T('sub', 3)] }
    ] },

    { id: 'mental', title: 'Mental math', sub: 'Friendly numbers and counting up.', concepts: [
      { id: 'friendly', title: 'Make a friendly number', exp: ['B2.4'], skill: 'as-mental',
        body: '<p>A number like 2998 is close to <b>3000</b>. Move a little from the other number to make it friendly, then add.</p>',
        watch: K.watch([
          ['2998 + 467. 2998 is just 2 away from 3000.', jumps(2998, [2], '2998 to 3000'), 1800],
          ['Take 2 from 467 to make 3000. 465 is left.', jumps(2998, [2, 465], '2998, jump 2, then 465'), 2200],
          ['3000 + 465 = <b>3465</b>. So 2998 + 467 = 3465.', jumps(2998, [2, 465], '2998 plus 467 is 3465'), 2000]
        ]),
        try: K.lab({ controls: [
          { id: 'a', label: 'Start at', type: 'select', options: [['2997', '2997'], ['4995', '4995'], ['1998', '1998'], ['6996', '6996']] },
          { id: 'b', label: 'Add', min: 100, max: 900, value: 467 }],
          render: function (s) {
            var a = +s.a, near = Math.ceil(a / 1000) * 1000, g = near - a; s.sum = a + s.b;
            return { fig: jumps(a, [g, s.b - g], A.fmt(a) + ' plus ' + s.b), out: '<p class="math">' + A.fmt(a) + ' + ' + s.b + ' = ' + A.fmt(near) + ' + ' + (s.b - g) + ' = <b>' + A.fmt(s.sum) + '</b></p>' };
          },
          tasks: [
            { do: 'Start at 2997. Make the sum exactly <b>3500</b>.', setup: function (api) { api.set('a', '2997'); }, goal: function (s) { return s.a === '2997' && s.sum === 3500; }, yes: '2997 + 503: move 3 to make 3000, then 3000 + 500.' },
            { do: 'Start at 4995. Make the sum exactly <b>5400</b>.', setup: function (api) { api.set('a', '4995'); }, goal: function (s) { return s.a === '4995' && s.sum === 5400; }, yes: '4995 + 405 = 5000 + 400.' }
          ] }),
        key: '<p>Close to a thousand? <b>Move a little to make the thousand, then add the rest.</b></p>',
        check: [T('mental', 1), T('mental', 2)] },

      { id: 'count-up', title: 'Count up to subtract', exp: ['B2.4'], skill: 'as-mental', hard: true,
        body: '<p>The difference is the <b>distance</b> between two numbers. Start at the smaller number and jump up to friendly numbers. Add the jumps.</p>',
        watch: K.watch([
          ['4000 &minus; 2650. Start at 2650.', jumps(2650, [], 'Start at 2650'), 1500],
          ['Jump 50 to 2700... ', jumps(2650, [50], 'Jump 50'), 1600],
          ['... then 300 to 3000 ...', jumps(2650, [50, 300], 'Jump 300'), 1600],
          ['... then 1000 to 4000.', jumps(2650, [50, 300, 1000], 'Jump 1000'), 1600],
          ['Add the jumps: 50 + 300 + 1000 = <b>1350</b>.', jumps(2650, [50, 300, 1000], 'Jumps of 50, 300 and 1000 make 1350'), 2200]
        ]),
        try: K.lab({ controls: [
          { id: 'f', label: 'From', type: 'number', min: 0, max: 9999, value: 2650 },
          { id: 't', label: 'Up to', type: 'number', min: 0, max: 10000, value: 4000 }],
          render: function (s) {
            if (s.t <= s.f) return { fig: '', out: '<p>Make <b>Up to</b> bigger than <b>From</b>.</p>' };
            var L = hopList(s.f, s.t);
            return { fig: jumps(s.f, L, 'Counting up from ' + s.f + ' to ' + s.t), out: '<p class="math">' + L.map(A.fmt).join(' + ') + ' = <b>' + A.fmt(s.t - s.f) + '</b></p>' };
          },
          tasks: [
            { do: 'Count up from <b>1875</b> to <b>5000</b>.', goal: function (s) { return s.f === 1875 && s.t === 5000; }, yes: '25 + 100 + 3000 = 3125.' },
            { do: 'Find two numbers that are <b>exactly 1000 apart</b>, where neither is a whole thousand.', goal: function (s) { return s.t - s.f === 1000 && s.f % 1000 !== 0; }, yes: function (s) { return A.fmt(s.f) + ' and ' + A.fmt(s.t) + ': the jumps still add to 1000.'; } }
          ] }),
        ways: [
          { label: 'Like making change', html: '<p>A cashier counts up. Something costs $26.50 and you pay $40. "$26.50 ... $27 is 50¢, $30 is $3, $40 is $10." Change: <b>$13.50</b>. Counting up to subtract works the same way.</p>' },
          { label: 'Take away instead', html: '<p>4000 &minus; 2650 by taking away: 4000 &minus; 2000 = 2000, then 2000 &minus; 600 = 1400, then 1400 &minus; 50 = <b>1350</b>. Same answer, the other direction.</p>' }
        ],
        key: '<p>The difference is the distance. <b>Jump up to friendly numbers and add the jumps.</b></p>',
        mistake: '<p>Counting the number of jumps (3) instead of adding their sizes, or forgetting the small first jump. Point to each arch and say its size out loud.</p>',
        check: [T('mental', 3), T('mental', 3)] }
    ] },

    { id: 'checking', title: 'Estimate and check', sub: 'Know roughly what to expect, then prove it.', concepts: [
      { id: 'estimate', title: 'Estimate first', exp: ['B2.1'], skill: 'as-est',
        body: '<p>Round each number first, then add or subtract. The <b>estimate</b> tells you roughly what the answer should be.</p>',
        watch: K.watch([
          ['4682 + 1915. Round 4682 to the nearest thousand: 5000.', '<p class="math big">4682 &rarr; <b class="c3t">5000</b></p>', 1800],
          ['Round 1915: 2000.', '<p class="math big">4682 &rarr; <b class="c3t">5000</b><br>1915 &rarr; <b class="c3t">2000</b></p>', 1800],
          ['Estimate: 5000 + 2000 = 7000. The exact answer, 6597, is close.', estFig(7000, 6597), 2600]
        ]),
        try: K.lab({ controls: [
          { id: 'a', label: 'First number', min: 1000, max: 8999, value: 4682 },
          { id: 'b', label: 'Second number', min: 1000, max: 8999, value: 1915 }],
          render: function (s) {
            var ra = Math.round(s.a / 1000) * 1000, rb = Math.round(s.b / 1000) * 1000; s.est = ra + rb; s.ex = s.a + s.b;
            return { fig: estFig(s.est, s.ex), out: '<p class="math">' + A.fmt(ra) + ' + ' + A.fmt(rb) + ' = <b>' + A.fmt(s.est) + '</b> (exact: ' + A.fmt(s.ex) + ')</p>' };
          },
          tasks: [
            { do: 'Make the estimate exactly <b>9000</b>.', goal: function (s) { return s.est === 9000; }, yes: 'Yes. Both numbers rounded, then added.' },
            { do: 'Make the exact sum <b>more than 700 away</b> from the estimate.', goal: function (s) { return Math.abs(s.ex - s.est) > 700; }, yes: 'Both numbers rounded the same way, so the gaps added up. An estimate is only a guide.' }
          ] }),
        key: '<p><b>Round each number, then add or subtract.</b> The answer should land close to the estimate.</p>',
        mistake: '<p>Rounding only one of the numbers, or rounding the exact answer after working it out. The estimate comes first, before the exact work.</p>',
        check: [T('estimate', 1), T('estimate', 2)] },

      { id: 'inverse', title: 'Check by adding back', exp: ['B2.1'], skill: 'as-inv',
        body: '<p>Addition undoes subtraction. To check a subtraction, <b>add the answer and the number you took away</b>. You should get the start number.</p>',
        watch: K.watch([
          ['6250 &minus; 3875 = 2375?', barModel(6250, 3875, 2375, 'took away', 'answer', 'b'), 1800],
          ['Add back: 2375 + 3875.', barModel(6250, 3875, 2375, 'took away', 'answer', 'w'), 1800],
          ['2375 + 3875 = <b>6250</b>. That is the start number, so the answer is right.', barModel(6250, 3875, 2375, 'took away', 'answer'), 2200]
        ]),
        try: K.lab({ controls: [
          { id: 'p', label: 'Problem', type: 'select', options: [['6250-3875', '6250 &minus; 3875'], ['5004-2768', '5004 &minus; 2768'], ['8130-4592', '8130 &minus; 4592']] },
          { id: 'g', label: 'Your answer', type: 'number', min: 0, max: 9999, value: 3000 }],
          render: function (s) {
            var pr = s.p.split('-'), a = +pr[0], b = +pr[1], sum = s.g + b; s.a = a; s.b = b;
            var msg = sum === a ? '<b>That checks out.</b>' : sum > a ? 'That is ' + A.fmt(sum - a) + ' more than ' + A.fmt(a) + ', so your answer is <b>too big</b> by ' + A.fmt(sum - a) + '.' : 'That is ' + A.fmt(a - sum) + ' less than ' + A.fmt(a) + ', so your answer is <b>too small</b> by ' + A.fmt(a - sum) + '.';
            return { fig: barModel(a, b, a - b, 'took away', 'answer', 'b'), out: '<p class="math">Check: ' + A.fmt(s.g) + ' + ' + A.fmt(b) + ' = ' + A.fmt(sum) + '</p><p>' + msg + '</p>' };
          },
          tasks: [
            { do: 'Try answers for <b>6250 &minus; 3875</b>. Use the check to find the right one.', goal: function (s) { return s.a === 6250 && s.g === 2375; }, yes: '2375 + 3875 = 6250, so 2375 is right.' },
            { do: 'Now find <b>5004 &minus; 2768</b> the same way.', setup: function (api) { api.set('p', '5004-2768'); }, goal: function (s) { return s.a === 5004 && s.g === 2236; }, yes: '2236 + 2768 = 5004.' }
          ] }),
        key: '<p><b>Answer + amount taken away = start number.</b></p>',
        mistake: '<p>Checking by doing the same subtraction again. If the same slip happens twice, it looks right twice. Adding back is a different path, so it catches slips.</p>',
        check: [T('inverse', 1), T('inverse', 1)] },

      { id: 'missing', title: 'Find the missing number', exp: ['B2.1'], skill: 'as-inv',
        body: '<p>A bar model shows the <b>whole</b> and its <b>parts</b>. If a part is missing, take the part you know away from the whole.</p>',
        watch: K.watch([
          ['&#9633; + 2468 = 7000. The whole is 7000. One part is 2468.', barModel(7000, 4532, 2468, 'missing', 'known', 'a'), 2200],
          ['Missing part = whole &minus; known part: 7000 &minus; 2468.', barModel(7000, 4532, 2468, 'missing', 'known', 'a'), 2000],
          ['7000 &minus; 2468 = <b>4532</b>.', barModel(7000, 4532, 2468, 'missing', 'known'), 2000]
        ]),
        key: '<p>Missing a part? <b>Whole &minus; the part you know.</b> Missing the whole? <b>Add the parts.</b></p>',
        check: [T('inverse', 2), T('inverse', 3)] }
    ] },

    { id: 'problems', title: 'Solving problems', sub: 'Decide what is unknown, then add or subtract.', concepts: [
      { id: 'which', title: 'Add or subtract?', exp: ['B2.4'], skill: 'as-words', hard: true,
        body: '<p>Ask: <b>what is unknown, the whole or a part?</b> If the whole is unknown, add the parts. If a part is unknown, subtract.</p>',
        watch: K.watch([
          ['Cans: 2475 in the fall and 1386 in the spring. How many in all? The <b>whole</b> is unknown, so add.', barModel(3861, 2475, 1386, 'fall', 'spring', 'w'), 2600],
          ['Seats: 6250 seats, 3875 sold. How many not sold? A <b>part</b> is unknown, so subtract.', barModel(6250, 3875, 2375, 'sold', 'not sold', 'b'), 2600]
        ]),
        try: K.lab({ controls: [
          { id: 's', label: 'Story', type: 'select', options: [['0', 'Cans'], ['1', 'Theatre'], ['2', 'Trail']] },
          { id: 'u', label: 'What is unknown?', type: 'select', options: [['', 'Choose...'], ['whole', 'The whole'], ['part', 'A part']] }],
          render: function (s) {
            var t = STORIES[+s.s], ok = s.u === t.u;
            var fig = s.u ? barModel(t.w, t.p1, t.p2, t.l1, t.l2, s.u === 'whole' ? 'w' : 'b') : barModel(t.w, t.p1, t.p2, t.l1, t.l2, 'x').replace(/>[\d\s]+</g, '>?<');
            var out = '<p>' + t.t + '</p>' + (!s.u ? '' : ok ? '<p><b>Yes.</b> ' + (t.u === 'whole' ? 'Add the parts: ' + A.fmt(t.p1) + ' + ' + A.fmt(t.p2) + ' = ' + A.fmt(t.w) : 'Subtract: ' + A.fmt(t.w) + ' &minus; ' + A.fmt(t.p1) + ' = ' + A.fmt(t.p2)) + '.</p>' : '<p>Look again. Does the story already tell you the total?</p>');
            return { fig: fig, out: out };
          },
          tasks: [
            { do: 'Story: <b>Cans</b>. What is unknown?', setup: function (api) { api.set('s', '0'); api.set('u', ''); }, goal: function (s) { return s.s === '0' && s.u === 'whole'; }, yes: 'The total is unknown, so add.' },
            { do: 'Story: <b>Theatre</b>. What is unknown?', setup: function (api) { api.set('s', '1'); api.set('u', ''); }, goal: function (s) { return s.s === '1' && s.u === 'part'; }, yes: 'The total is given. A part is unknown, so subtract.' },
            { do: 'Story: <b>Trail</b>. What is unknown?', setup: function (api) { api.set('s', '2'); api.set('u', ''); }, goal: function (s) { return s.s === '2' && s.u === 'part'; }, yes: 'The whole trail is 4120 m. Subtract what she walked.' }
          ] }),
        ways: [
          { label: 'Act it out small', html: '<p>Swap in tiny numbers: "A theatre has 6 seats. 4 are sold. How many are not sold?" You would take away: 6 &minus; 4 = 2. So the big problem is a subtraction too.</p>' },
          { label: 'Draw the bar', html: '<p>Draw one long bar for the whole and split it into parts. Put a <b>?</b> where the unknown goes. A ? on top means add. A ? in a part means subtract.</p><div class="fig">' + barModel(4120, 2675, 1445, 'walked', 'left', 'b') + '</div>' }
        ],
        key: '<p>Whole unknown: <b>add</b>. Part unknown: <b>subtract</b>.</p>',
        mistake: '<p>Choosing the operation from a key word ("left" means subtract, "more" means add). Key words can mislead: "Sam had some cards, then got 30 more and now has 90" is a subtraction. Ask: "Which bar has the question mark?"</p>',
        check: [T('words', 1), T('words', 2)] },

      { id: 'two-step', title: 'Two-step problems', exp: ['B2.4'], skill: 'as-words',
        body: '<p>Some problems need <b>two steps</b>. Solve the first step, then use that answer in the second.</p>',
        watch: K.watch([
          ['A library had 5000 books. It bought 1250 more. Step 1: 5000 + 1250 = 6250.', barModel(6250, 5000, 1250, 'had', 'bought', 'w'), 2400],
          ['Then it gave away 1875. Step 2: 6250 &minus; 1875 = <b>4375</b>.', barModel(6250, 1875, 4375, 'gave away', 'now', 'b'), 2600]
        ]),
        key: '<p><b>Step 1, then use that answer in step 2.</b> Estimate to check the final answer.</p>',
        check: [T('words', 3), T('words', 3)] }
    ] }
  ];

  A.register('add-subtract', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Adding with blocks and disks</h2>' +
'<p>To add, put the same places together: ones with ones, tens with tens, and so on. When a place has <b>10 or more</b>, trade 10 of them for <b>1</b> of the next bigger place. This is called <b>regrouping</b>.</p>' +
'<div class="lab"><span class="lt">Try it: add with disks</span>' +
'<div class="ctrl"><label for="asa">First number<input type="number" id="asa" min="0" max="9999" value="2748"></label><label for="asb">Second number<input type="number" id="asb" min="0" max="9999" value="1365"></label></div>' +
'<div class="fig" id="asdisk"></div><div class="out" id="asdout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Ten of one place make one of the next place. 10 ones make 1 ten. 10 tens make 1 hundred. 10 hundreds make 1 thousand.</p></div>' +
'<div class="eg"><b class="t">Worked example</b><p>2748 + 1365. Ones: 8 + 5 = 13, so 1 ten and 3 ones. Tens: 4 + 6 + 1 = 11, so 1 hundred and 1 ten. Hundreds: 7 + 3 + 1 = 11, so 1 thousand and 1 hundred. Thousands: 2 + 1 + 1 = 4. The sum is <b>4113</b>.</p></div>' +
A.yt({ gen: function () { return gen.add(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>The column method for adding</h2>' +
'<p>The column method is a short way to write what the disks do. Use the same steps every time:</p>' +
'<ol><li>Line up the places, ones under ones.</li><li><b>Start with the ones.</b> Add the column.</li><li>If the column makes 10 or more, write the ones digit and <b>carry 1</b> to the next place.</li><li>Move left and repeat.</li></ol>' +
'<div class="lab"><span class="lt">Try it: step through a sum</span>' +
'<div class="ctrl"><label for="aca">First number<input type="number" id="aca" min="0" max="9999" value="3587"></label><label for="acb">Second number<input type="number" id="acb" min="0" max="9999" value="2646"></label></div>' +
'<div class="btnrow"><button type="button" class="btn" id="acnext">Show the next step</button><button type="button" class="btn alt" id="acall">Show all</button><button type="button" class="btn alt" id="acreset">Start again</button></div>' +
'<div class="fig" id="acfig"></div><div class="out" id="acout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Writing 13 in one column. Each column holds <b>one digit</b>. Write the 3 and carry the 1 ten.</p></div>' +
A.yt({ gen: function () { return gen.add(2); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Subtracting with regrouping</h2>' +
'<p>Subtracting uses the same places. <b>Start with the ones.</b> If the top digit is smaller than the bottom digit, trade 1 from the place to the left for 10. Then subtract.</p>' +
'<div class="lab"><span class="lt">Try it: step through a difference</span>' +
'<div class="ctrl"><label for="ssa">Top number<input type="number" id="ssa" min="0" max="10000" value="5032"></label><label for="ssb">Number to take away<input type="number" id="ssb" min="0" max="10000" value="1758"></label></div>' +
'<div class="btnrow"><button type="button" class="btn" id="ssnext">Show the next step</button><button type="button" class="btn alt" id="ssall">Show all</button><button type="button" class="btn alt" id="ssreset">Start again</button></div>' +
'<div class="fig" id="ssfig"></div><div class="out" id="ssout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>5032 &minus; 1758. Ones: 2 is less than 8. The tens place has 3, so trade 1 ten: now 12 ones. 12 &minus; 8 = 4. Tens: 2 is less than 5. The hundreds place has 0, so trade 1 thousand for 10 hundreds, then 1 hundred for 10 tens: 12 tens. 12 &minus; 5 = 7. Hundreds: 9 &minus; 7 = 2. Thousands: 4 &minus; 1 = 3. The answer is <b>3274</b>.</p><div class="fig">' + subCols(5032, 1758) + '</div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Taking the small digit from the big one, no matter which is on top. In 52 &minus; 18, the ones are 2 &minus; 8, not 8 &minus; 2. Always regroup when the top digit is smaller.</p></div>' +
A.yt({ gen: function () { return gen.sub(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Mental math with friendly numbers</h2>' +
'<p>Some sums are easier in your head. Two strategies help:</p>' +
'<ul><li><b>Make a friendly number.</b> 2998 + 467: move 2 from 467 to make 3000 + 465 = 3465.</li><li><b>Count up to subtract.</b> 4000 &minus; 2650: jump from 2650 up to 3000 (350), then to 4000 (1000). The difference is 1350.</li></ul>' +
'<div class="fig">' + jumps(2650, [350, 1000], 'Counting up from 2650 to 4000: jumps of 350 and 1000. The difference is 1350.') + '</div>' +
'<div class="lab"><span class="lt">Try it: count up on a number line</span>' +
'<div class="ctrl"><label for="mja">From<input type="number" id="mja" min="0" max="9999" value="2650"></label><label for="mjb">Up to<input type="number" id="mjb" min="0" max="10000" value="4000"></label></div>' +
'<div class="fig" id="mjfig"></div><div class="out" id="mjout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The difference between two numbers is the distance between them on a number line. You can find it by taking away, or by counting up.</p></div>' +
A.yt({ gen: function () { return gen.mental(2); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Estimate, solve and check</h2>' +
'<p>Good problem solvers use three steps every time:</p>' +
'<ol><li><b>Estimate.</b> Round the numbers to get a quick idea of the answer.</li><li><b>Solve.</b> Use the column method or a mental strategy.</li><li><b>Check.</b> Is the answer close to the estimate? For subtraction, add back: answer + number taken away = start number.</li></ol>' +
'<div class="eg"><b class="t">Worked example</b><p>A theatre has 6250 seats. 3875 are sold. How many are left? <b>Estimate:</b> 6000 &minus; 4000 = 2000. <b>Solve:</b> 6250 &minus; 3875 = 2375. <b>Check:</b> 2375 is close to 2000, and 2375 + 3875 = 6250.</p><div class="fig">' + barModel(6250, 3875, 2375, 'sold', 'left', 'b') + '</div></div>' +
'<p>A <b>bar model</b> shows the whole and its parts. If you know both parts, add. If you know the whole and one part, subtract.</p>' +
'<div class="lab"><span class="lt">Try it: estimate first</span>' +
'<div class="ctrl"><label for="esa">First number<input type="number" id="esa" min="0" max="9999" value="4682"></label><label for="esop">Operation<select id="esop"><option value="+">add</option><option value="-" selected>subtract</option></select></label><label for="esb">Second number<input type="number" id="esb" min="0" max="9999" value="1915"></label></div>' +
'<div class="out" id="esout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Skipping the check. If your answer to 6250 &minus; 3875 were 3625, the check shows it is wrong: 3625 + 3875 = 7500, not 6250.</p></div>' +
A.yt({ gen: function () { return gen.words(2); } }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function num(id, mx) { return Math.max(0, Math.min(mx, parseInt($('#' + id, root).value, 10) || 0)); }
      /* disks: each addend in rows, then the total with trades */
      function ad() {
        var a = num('asa', 9999), b = num('asb', 9999), s = '', narrow = $('#asdisk', root).clientWidth < 480, gap = narrow ? 23 : 26, r = 10, colW = narrow ? 100 : 128, top = 34;
        if (a + b > 10000) { $('#asdisk', root).innerHTML = ''; $('#asdout', root).innerHTML = '<p>Pick numbers that add to 10 000 or less.</p>'; return; }
        function row(n, y, lab) {
          var h = '<text x="4" y="' + (y + 6) + '" font-size="16" font-weight="700">' + lab + '</text>', maxR = 1;
          for (var p = 3; p >= 0; p--) {
            var d = dg(n, p), x0 = 90 + (3 - p) * colW;
            for (var i = 0; i < d; i++) h += A.draw.disk(x0 + (i % 4) * gap, y + Math.floor(i / 4) * gap, r, p);
            maxR = Math.max(maxR, Math.ceil(d / 4));
          }
          return { h: h, rows: maxR };
        }
        var y = top, head = '';
        for (var p = 3; p >= 0; p--) head += '<rect x="' + (84 + (3 - p) * colW) + '" y="2" width="' + (colW - 8) + '" height="24" rx="8" style="fill:var(--p' + p + ')"/><text x="' + (84 + (3 - p) * colW + (colW - 8) / 2) + '" y="20" text-anchor="middle" font-size="15" font-weight="700" style="fill:' + (p ? '#fff' : '#2a211b') + '">' + A.PLACES[p] + '</text>';
        var r1 = row(a, y + 12, A.fmt(a)); y += r1.rows * gap + 14;
        var r2 = row(b, y + 12, '+ ' + A.fmt(b)); y += r2.rows * gap + 14;
        s = head + r1.h + r2.h + '<line x1="4" y1="' + y + '" x2="' + (90 + 4 * colW) + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="2"/>';
        /* combined before trading */
        var c = [dg(a, 0) + dg(b, 0), dg(a, 1) + dg(b, 1), dg(a, 2) + dg(b, 2), dg(a, 3) + dg(b, 3)], y2 = y + 22, mr = 1;
        s += '<text x="4" y="' + (y2 + 6) + '" font-size="16" font-weight="700">together</text>';
        for (var q = 3; q >= 0; q--) {
          var x0 = 90 + (3 - q) * colW;
          for (var i = 0; i < c[q]; i++) s += A.draw.disk(x0 + (i % 4) * gap, y2 + Math.floor(i / 4) * gap, r, q);
          if (c[q] >= 10) s += '<rect x="' + (x0 - 14) + '" y="' + (y2 - 14) + '" width="' + (4 * gap + 2) + '" height="' + (2 * gap + 2) + '" rx="10" style="fill:none;stroke:var(--bad)" stroke-width="2.5" stroke-dasharray="5 4"/>';
          mr = Math.max(mr, Math.ceil(c[q] / 4));
        }
        var H = y2 + mr * gap + 6;
        $('#asdisk', root).innerHTML = A.svg(90 + 4 * colW, H, s, A.fmt(a) + ' plus ' + A.fmt(b) + ' shown with place value disks. Dashed boxes show groups of 10 to trade.');
        var t = [], carry = 0, msgs = [];
        for (var k = 0; k < 4; k++) {
          var tot = c[k] + carry;
          if (tot >= 10) msgs.push('<b class="c' + k + 't">' + tot + ' ' + A.PLACES[k] + '</b> &rarr; trade 10 for 1 ' + A.PLACE1[k + 1] + ', keep ' + (tot - 10));
          carry = tot >= 10 ? 1 : 0;
        }
        $('#asdout', root).innerHTML = (msgs.length ? '<p>' + msgs.join('<br>') + '</p>' : '<p>No place has 10 or more, so no trades are needed.</p>') + '<p><span class="big">' + A.fmt(a) + ' + ' + A.fmt(b) + ' = ' + A.fmt(a + b) + '</span></p>' +
          '<p class="t2" style="font-size:.9rem">The dashed boxes show 10 disks that become 1 disk of the next place.</p>';
      }
      A.bind(root, ['asa', 'asb'], ad);

      /* step-through column addition */
      var ak = 0;
      function ac() {
        var a = num('aca', 9999), b = num('acb', 9999);
        if (a + b > 10000) { $('#acfig', root).innerHTML = ''; $('#acout', root).innerHTML = '<p>Pick numbers that add to 10 000 or less.</p>'; return; }
        var cols = Math.max(len(a), len(b)), st = addSteps(a, b);
        ak = Math.min(ak, cols);
        $('#acfig', root).innerHTML = addCols(a, b, ak >= cols ? 9 : ak);
        $('#acout', root).innerHTML = ak === 0 ? '<p>Press <b>Show the next step</b> to start with the ones.</p>' : '<ol>' + st.slice(0, ak >= cols ? st.length : ak).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>';
        $('#acnext', root).disabled = ak >= cols;
      }
      $('#acnext', root).addEventListener('click', function () { ak++; ac(); });
      $('#acall', root).addEventListener('click', function () { ak = 9; ac(); });
      $('#acreset', root).addEventListener('click', function () { ak = 0; ac(); });
      A.bind(root, ['aca', 'acb'], function () { ak = 0; ac(); });

      /* step-through column subtraction */
      var sk = 0;
      function ss() {
        var a = num('ssa', 10000), b = num('ssb', 10000);
        if (b > a) { $('#ssfig', root).innerHTML = ''; $('#ssout', root).innerHTML = '<p>The number to take away must not be bigger than the top number.</p>'; $('#ssnext', root).disabled = true; return; }
        var cols = len(a), st = subSteps(a, b);
        sk = Math.min(sk, cols);
        $('#ssfig', root).innerHTML = subCols(a, b, sk >= cols ? 9 : sk);
        $('#ssout', root).innerHTML = sk === 0 ? '<p>Press <b>Show the next step</b> to start with the ones.</p>' : '<ol>' + st.slice(0, sk >= cols ? st.length : sk).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>';
        $('#ssnext', root).disabled = sk >= cols;
      }
      $('#ssnext', root).addEventListener('click', function () { sk++; ss(); });
      $('#ssall', root).addEventListener('click', function () { sk = 9; ss(); });
      $('#ssreset', root).addEventListener('click', function () { sk = 0; ss(); });
      A.bind(root, ['ssa', 'ssb'], function () { sk = 0; ss(); });

      /* counting up */
      function mj() {
        var a = num('mja', 9999), b = num('mjb', 10000);
        if (b <= a) { $('#mjfig', root).innerHTML = ''; $('#mjout', root).innerHTML = '<p>Make the second number bigger than the first.</p>'; return; }
        var list = [], at = a, labels = [];
        var h = Math.ceil(at / 100) * 100; if (h > at && h <= b) { list.push(h - at); at = h; }
        var th = Math.ceil(at / 1000) * 1000; if (th > at && th <= b) { list.push(th - at); at = th; }
        var big = Math.floor((b - at) / 1000) * 1000; if (big > 0) { list.push(big); at += big; }
        var hh = Math.floor((b - at) / 100) * 100; if (hh > 0) { list.push(hh); at += hh; }
        if (b > at) { list.push(b - at); at = b; }
        $('#mjfig', root).innerHTML = jumps(a, list, 'Counting up from ' + a + ' to ' + b);
        $('#mjout', root).innerHTML = '<p>Jumps: ' + list.map(A.fmt).join(' + ') + ' = <span class="big">' + A.fmt(b - a) + '</span></p><p>So ' + A.fmt(b) + ' &minus; ' + A.fmt(a) + ' = ' + A.fmt(b - a) + '.</p>';
      }
      A.bind(root, ['mja', 'mjb'], mj);

      function es() {
        var a = num('esa', 9999), b = num('esb', 9999), op = $('#esop', root).value;
        if (op === '-' && b > a) { $('#esout', root).innerHTML = '<p>For subtracting, make the first number the bigger one.</p>'; return; }
        var p = Math.max(a, b) >= 1000 ? 1000 : 100, ra = Math.round(a / p) * p, rb = Math.round(b / p) * p, est = op === '+' ? ra + rb : ra - rb, ex = op === '+' ? a + b : a - b;
        $('#esout', root).innerHTML = '<p><b>Estimate:</b> round to the nearest ' + (p === 1000 ? 'thousand' : 'hundred') + '. ' + A.fmt(ra) + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + A.fmt(rb) + ' = <b>' + A.fmt(est) + '</b></p>' +
          '<p><b>Exact:</b> ' + A.fmt(a) + ' ' + (op === '+' ? '+' : '&minus;') + ' ' + A.fmt(b) + ' = <span class="big">' + A.fmt(ex) + '</span></p>' +
          '<p><b>Check:</b> ' + (op === '-' ? A.fmt(ex) + ' + ' + A.fmt(b) + ' = ' + A.fmt(ex + b) + '. ' : A.fmt(ex) + ' &minus; ' + A.fmt(b) + ' = ' + A.fmt(ex - b) + '. ') + 'The exact answer is ' + A.fmt(Math.abs(ex - est)) + ' away from the estimate.</p>';
      }
      A.bind(root, ['esa', 'esb', 'esop'], es);
    },

    quiz: [
      { q: 'Add: <span class="math">3587 + 2646</span>', type: 'num', answer: 6233, hint: 'Start with the ones: 7 + 6 = 13. Write 3, carry 1.', explain: '3587 + 2646 = 6233. Every column needed a carry.' },
      { q: 'Subtract: <span class="math">7000 &minus; 2468</span>', type: 'num', answer: 4532, hint: 'There are zeros in the ones, tens and hundreds. Trade 1 thousand for 10 hundreds first, then keep trading down.', explain: '7000 &minus; 2468 = 4532. Check: 4532 + 2468 = 7000.' },
      { q: 'Which is the best estimate for <span class="math">4875 + 3120</span>?', type: 'mc', options: ['7000', '8000', '9000', '6000'], answer: 1, hint: 'Round each number to the nearest thousand first.', explain: '4875 &rarr; 5000 and 3120 &rarr; 3000. 5000 + 3000 = 8000.' },
      { q: 'Which addition checks <span class="math">6250 &minus; 3875 = 2375</span>?', type: 'mc', options: ['2375 + 3875 = 6250', '6250 + 3875 = 10 125', '2375 + 6250 = 8625', '3875 &minus; 2375 = 1500'], answer: 0, hint: 'Answer + the number taken away = the start number.', explain: '2375 + 3875 = 6250, so the subtraction is correct.' },
      { q: 'Find the missing number: <span class="math">&#9633; + 1450 = 5000</span>', type: 'num', answer: 3550, fig: barModel(5000, 3550, 1450, 'missing part', 'known part', 'a'), hint: 'The whole is 5000. Subtract the part you know.', explain: '5000 &minus; 1450 = 3550.' },
      { q: 'A school had 2840 books. It bought 615 more, then gave away 380. How many books does it have now?', type: 'num', answer: 3075, unit: 'books', hint: 'Two steps: add the new books, then subtract the ones given away.', explain: '2840 + 615 = 3455. 3455 &minus; 380 = 3075 books.' },
      { q: 'Use a friendly number: <span class="math">3997 + 1285</span>', type: 'num', answer: 5282, hint: 'Move 3 from 1285 to make 4000.', explain: '3997 + 1285 = 4000 + 1282 = 5282.' }
    ],

    practice: [
      { id: 'as-add', name: 'Add with regrouping', code: 'B2.4', gen: gen.add },
      { id: 'as-sub', name: 'Subtract with regrouping', code: 'B2.4', gen: gen.sub },
      { id: 'as-mental', name: 'Mental math strategies', code: 'B2.4', gen: gen.mental },
      { id: 'as-est', name: 'Estimate and judge answers', code: 'B2.1', gen: gen.estimate },
      { id: 'as-inv', name: 'Check and missing numbers', code: 'B2.1', gen: gen.inverse },
      { id: 'as-words', name: 'Word problems', code: 'B2.4', gen: gen.words }
    ]
  });
})();
