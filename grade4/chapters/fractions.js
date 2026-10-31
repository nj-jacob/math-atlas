(function () {
  var A = Atlas, R = A.R, fr = A.fr;
  var DEN = [2, 3, 4, 5, 6, 8, 10];
  var NAME = { 1: ['whole', 'wholes'], 2: ['half', 'halves'], 3: ['third', 'thirds'], 4: ['fourth', 'fourths'], 5: ['fifth', 'fifths'], 6: ['sixth', 'sixths'], 8: ['eighth', 'eighths'], 10: ['tenth', 'tenths'] };
  function nm(n, d) { return n + ' ' + NAME[d][n === 1 ? 0 : 1]; }
  /* a circle cut into d equal slices with the first n shaded; returns svg inner at (cx, cy) */
  function pieAt(cx, cy, r, n, d, col) {
    var s = '';
    if (d === 1) return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:' + (n ? col || 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/>';
    for (var i = 0; i < d; i++) {
      var a0 = -Math.PI / 2 + 2 * Math.PI * i / d, a1 = -Math.PI / 2 + 2 * Math.PI * (i + 1) / d;
      s += '<path d="M' + cx + ' ' + cy + ' L' + (cx + r * Math.cos(a0)).toFixed(1) + ' ' + (cy + r * Math.sin(a0)).toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(a1)).toFixed(1) + ' ' + (cy + r * Math.sin(a1)).toFixed(1) + ' Z" style="fill:' + (i < n ? col || 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/>';
    }
    return s;
  }
  function pie(n, d, label) { return A.svg(120, 120, pieAt(60, 60, 54, n, d), label || nm(n, d) + ' shaded'); }
  /* a bar cut into d parts with n shaded, inner svg */
  function barAt(x, y, w, h, n, d, col) {
    var s = '', cw = w / d;
    for (var i = 0; i < d; i++) s += '<rect x="' + (x + i * cw).toFixed(1) + '" y="' + y + '" width="' + cw.toFixed(1) + '" height="' + h + '" style="fill:' + (i < n ? col || 'var(--strand)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/>';
    return s;
  }
  function bar(n, d, w, label) { w = w || 400; return A.svg(w + 4, 48, barAt(2, 2, w, 44, n, d), label || nm(n, d) + ' of a bar shaded'); }
  /* a non-example: a shape cut into unequal parts */
  function unequal() {
    var s = '<rect x="2" y="2" width="300" height="56" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/>';
    [40, 150, 210].forEach(function (x) { s += '<line x1="' + x + '" y1="2" x2="' + x + '" y2="58" style="stroke:var(--ink)" stroke-width="2"/>'; });
    s += '<rect x="2" y="2" width="38" height="56" style="fill:var(--bad);opacity:.5"/>';
    return A.svg(304, 62, s, 'A bar cut into 4 parts that are not equal. The shaded part is not one fourth.');
  }
  /* fair share: n wholes shared among k people; each whole cut into k pieces, person 1's pieces shaded */
  var PCOL = ['var(--strand)', 'var(--btn)', 'var(--accent)', 'var(--hi)', 'var(--sc)', 'var(--sd)', 'var(--se)', 'var(--sf)', 'var(--p4)', 'var(--p1)'];
  function fairShare(n, k, onlyFirst) {
    var w = Math.min(130, 520 / n - 10), s = '';
    for (var j = 0; j < n; j++) {
      var x = 4 + j * (w + 10), cw = w / k;
      for (var i = 0; i < k; i++) s += '<rect x="' + (x + i * cw).toFixed(1) + '" y="4" width="' + cw.toFixed(1) + '" height="60" style="fill:' + (onlyFirst ? (i === 0 ? 'var(--strand)' : 'var(--card)') : 'color-mix(in srgb,' + PCOL[i] + ' 70%,var(--card))') + ';stroke:var(--ink)" stroke-width="1.8"/>';
      s += '<text x="' + (x + w / 2) + '" y="88" text-anchor="middle" font-size="16" class="t2">whole ' + (j + 1) + '</text>';
    }
    return A.svg(4 + n * (w + 10), 96, s, n + ' wholes shared among ' + k + '. Each person gets 1 piece from each whole: ' + n + ' over ' + k + '.');
  }
  /* number line from 0 to max, counting by 1/d, with the first c counts marked */
  function countLine(d, max, c, showMixed, hideLast) {
    var W = 560, x0 = 24, x1 = 536, n = max * d, s = '', step = (x1 - x0) / n;
    s += '<line x1="' + x0 + '" y1="70" x2="' + x1 + '" y2="70" style="stroke:var(--ink)" stroke-width="3"/>';
    s += '<defs><marker id="frcl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--strand)"/></marker></defs>';
    for (var i = 0; i <= n; i++) {
      var x = x0 + i * step, whole = i % d === 0;
      s += '<line x1="' + x + '" y1="' + (whole ? 56 : 62) + '" x2="' + x + '" y2="' + (whole ? 84 : 78) + '" style="stroke:var(--ink)" stroke-width="' + (whole ? 3 : 1.5) + '"/>';
      if (whole) s += '<text x="' + x + '" y="108" text-anchor="middle" font-size="20" class="tb">' + i / d + '</text>';
    }
    for (var k = 1; k <= c; k++) {
      var xa = x0 + (k - 1) * step, xb = x0 + k * step;
      s += '<path d="M' + xa + ' 64 Q' + ((xa + xb) / 2) + ' ' + (64 - Math.max(16, step * 0.7)) + ' ' + xb + ' 64" fill="none" style="stroke:var(--strand)" stroke-width="2.5" marker-end="url(#frcl)"/>';
    }
    if (c > 0) {
      var xc = x0 + c * step;
      s += '<circle cx="' + xc + '" cy="70" r="8" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
      if (!hideLast) s += '<text x="' + Math.min(Math.max(xc, 40), 520) + '" y="24" text-anchor="middle" font-size="19" class="tb">' + c + '/' + d + (showMixed && c >= d && c % d ? ' = ' + Math.floor(c / d) + ' ' + (c % d) + '/' + d : c % d === 0 ? ' = ' + c / d : '') + '</text>';
    }
    return A.svg(W, 116, s, 'Number line from 0 to ' + max + ' counting by ' + NAME[d][1] + (c ? ', ' + c + ' counts' : ''));
  }
  function fstr(n, d) { return fr(n, d); }

  var gen = {
    name: function (lv) {
      var d = lv === 1 ? R.pick([2, 3, 4, 5]) : R.pick(DEN), n = R.int(1, d - 1), usePie = R.int(0, 1) === 1;
      var fig = usePie ? pie(n, d) : bar(n, d, 360);
      if (lv === 3) {
        var o3 = R.mc(fstr(d - n, d), [fstr(n, d), fstr(d - n, n), fstr(d, d - n)]);
        return { q: 'What fraction of the shape is <b>not</b> shaded?', type: 'mc', options: o3.options, answer: o3.answer, fig: fig,
          hint: 'Count all the equal parts for the denominator. Count the white parts for the numerator.',
          steps: ['There are ' + d + ' equal parts, so the denominator is ' + d + '.', n + ' parts are shaded, so ' + (d - n) + ' are not.', 'The fraction not shaded is ' + fstr(d - n, d) + '.'], explain: fstr(d - n, d) + ' is not shaded.' };
      }
      var o = R.mc(fstr(n, d), [fstr(d - n, d), fstr(n, d - n), fstr(d, n)]);
      return { q: 'What fraction of the shape is shaded?', type: 'mc', options: o.options, answer: o.answer, fig: fig,
        hint: 'The bottom number counts all the equal parts. The top number counts the shaded parts.',
        steps: ['Count all the equal parts: ' + d + '. That is the denominator.', 'Count the shaded parts: ' + n + '. That is the numerator.', 'The fraction is ' + fstr(n, d) + ', which is ' + nm(n, d) + '.'], explain: nm(n, d) + ' are shaded: ' + fstr(n, d) + '.' };
    },
    meaning: function (lv) {
      var d = R.pick(DEN), n = R.int(1, d - 1);
      if (lv === 1) {
        var o = R.mc(String(d), [String(n), String(d - n), String(n + d)]);
        return { q: 'A pan of lasagna is cut into equal pieces. You eat ' + fstr(n, d) + ' of it. How many equal pieces is the whole pan cut into?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'The denominator, the bottom number, tells how many equal parts make the whole.', steps: ['The denominator is the bottom number: ' + d + '.', 'It tells how many equal parts the whole is cut into: ' + d + '.'], explain: 'The denominator ' + d + ' means ' + d + ' equal pieces.' };
      }
      if (lv === 2) {
        var o2 = R.mc('Yes', ['No']), isEq = R.int(0, 1) === 1;
        o2 = R.mc(isEq ? 'Yes, the parts are equal' : 'No, the parts are not equal', [isEq ? 'No, the parts are not equal' : 'Yes, the parts are equal']);
        return { q: 'Kai says the shaded part is ' + fstr(1, 4) + ' of the bar. Is Kai right?', type: 'mc', options: o2.options, answer: o2.answer, fig: isEq ? bar(1, 4, 300) : unequal(),
          hint: 'Fourths must be 4 <b>equal</b> parts. Are the parts the same size?', steps: ['Count the parts: there are 4.', isEq ? 'The parts are all the same size.' : 'The parts are different sizes.', isEq ? 'So the shaded part is ' + fstr(1, 4) + '.' : 'Parts that are not equal are not fourths.'], explain: isEq ? 'The 4 parts are equal, so one of them is ' + fstr(1, 4) + '.' : 'Fourths need 4 equal parts. These parts are not equal.' };
      }
      var whole = R.pick([[8, 'markers'], [10, 'stickers'], [6, 'eggs'], [4, 'apples']]), k = R.int(1, whole[0] - 1);
      return { q: 'A set has ' + whole[0] + ' ' + whole[1] + '. ' + k + (k === 1 ? ' of them is' : ' of them are') + ' red. What fraction of the set is red? Type the <b>numerator</b>.', type: 'num', answer: k,
        hint: 'The numerator counts the parts you are talking about: the red ones.', steps: ['The whole set has ' + whole[0] + ', so the denominator is ' + whole[0] + '.', 'The red ones are ' + k + ', so the numerator is ' + k + '.', 'The fraction is ' + fstr(k, whole[0]) + '.'], explain: 'The fraction is ' + fstr(k, whole[0]) + '. The numerator is ' + k + '.' };
    },
    share: function (lv) {
      var k = R.pick(lv === 1 ? [2, 3, 4] : [3, 4, 5, 6, 8, 10]), n = R.int(1, Math.min(lv === 3 ? 9 : 4, k - 1 > 0 ? (lv === 3 ? 9 : k - 1) : 1));
      if (lv < 3 && n >= k) n = k - 1;
      var things = R.pick(['sandwiches', 'pizzas', 'granola bars', 'pancakes']), ans = n >= k ? A.mixed(Math.floor(n / k), n % k, k) : fstr(n, k);
      if (n % k === 0) ans = String(n / k);
      var o = R.mc(ans, [fstr(k, n), fstr(1, k), fstr(n, k + 1), fstr(1, n)].filter(function (x) { return x !== ans; }));
      return { q: (n === 1 ? '1 ' + { sandwiches: 'sandwich', pizzas: 'pizza', 'granola bars': 'granola bar', pancakes: 'pancake' }[things] + ' is' : n + ' ' + things + ' are') + ' shared equally among ' + k + ' friends. How much does each friend get?', type: 'mc', options: o.options, answer: o.answer,
        fig: lv === 1 ? fairShare(n, k) : '', hint: 'Cut each of the ' + things + ' into ' + k + ' equal pieces. Each friend gets 1 piece from each one.',
        steps: ['Cut each of the ' + n + ' ' + things + ' into ' + k + ' pieces. Each piece is ' + fstr(1, k) + '.', 'Each friend gets 1 piece from each, so ' + n + ' pieces of ' + fstr(1, k) + '.<div class="fig">' + fairShare(n, k) + '</div>', 'Each friend gets ' + ans + '.'],
        explain: n + ' shared among ' + k + ' is ' + ans + ' each.' };
    },
    compare: function (lv) {
      var a, b, c, d;
      if (lv === 1) { a = 1; c = 1; b = R.pick(DEN); do { d = R.pick(DEN); } while (d === b); }
      else if (lv === 2) { b = d = R.pick([4, 5, 6, 8, 10]); a = R.int(1, b - 1); do { c = R.int(1, b - 1); } while (c === a); }
      else { a = c = R.int(2, 4); b = R.pick(DEN.filter(function (x) { return x > a; })); do { d = R.pick(DEN.filter(function (x) { return x > a; })); } while (d === b); }
      var v1 = a / b, v2 = c / d, big = v1 > v2 ? fstr(a, b) : fstr(c, d);
      var o = R.mc(big, [v1 > v2 ? fstr(c, d) : fstr(a, b), 'They are equal']);
      var why = lv === 2 ? 'Same denominator, so the pieces are the same size. More pieces is more.' : 'Same numerator. The fraction with fewer equal parts has bigger pieces.';
      var fig = A.svg(404, 108, barAt(2, 2, 400, 44, a, b) + barAt(2, 60, 400, 44, c, d, 'var(--btn)'), fstr(a, b) + ' and ' + fstr(c, d) + ' as bars of the same length');
      var story = lv === 1 ? 'One pizza is shared by ' + b + ' friends. Another pizza, the same size, is shared by ' + d + ' friends. Which share is bigger? ' : '';
      return { q: story + 'Which is greater: ' + fstr(a, b) + ' or ' + fstr(c, d) + '?', type: 'mc', options: o.options, answer: o.answer,
        fig: lv < 3 ? fig : '', hint: lv === 1 ? 'More people sharing means each piece is smaller.' : why,
        steps: [lv === 2 ? 'The denominators are the same: ' + b + '. The pieces are the same size.' : 'The numerators are the same. Compare the size of the pieces.', lv === 2 ? 'Compare the numerators: ' + a + ' and ' + c + '.' : 'Fewer parts means bigger parts: ' + fstr(1, Math.min(b, d)) + ' is bigger than ' + fstr(1, Math.max(b, d)) + '.', big + ' is greater.<div class="fig">' + fig + '</div>'],
        explain: big + ' is greater. ' + why };
    },
    count: function (lv) {
      var d = R.pick(lv === 1 ? [2, 4] : DEN), c = lv === 1 ? R.int(2, d * 2) : R.int(d + 1, d * 3);
      if (d === 10 && c > 25) c = R.int(11, 25);
      var max = Math.ceil((c + 1) / d);
      if (lv === 3) {
        var w = Math.floor(c / d), r = c % d, ans = r ? A.mixed(w, r, d) : String(w);
        var o = R.mc(ans, [A.mixed(w + 1, r || 1, d), A.mixed(w, (r + 1) % d || 1, d), fstr(c, d * 2)].filter(function (x) { return x !== ans; }));
        return { q: 'Count by ' + NAME[d][1] + ' from 0. Where do you land after ' + c + ' counts? Write it as a whole number or mixed number.', type: 'mc', options: o.options, answer: o.answer,
          hint: d + ' ' + NAME[d][1] + ' make 1 whole. How many wholes are in ' + c + ' ' + NAME[d][1] + '?', steps: ['Every ' + d + ' counts is 1 whole.', c + ' = ' + (w * d) + ' + ' + r + ', which is ' + w + ' whole' + (w === 1 ? '' : 's') + (r ? ' and ' + nm(r, d) : '') + '.<div class="fig">' + countLine(d, Math.max(max, 1), c, true) + '</div>', 'You land on ' + ans + '.'], explain: c + '/' + d + ' = ' + ans + '.' };
      }
      return { q: 'Count by ' + NAME[d][1] + '. The yellow dot is after ' + c + ' jumps. How many ' + NAME[d][1] + ' is that? Type the numerator.', type: 'num', answer: c,
        fig: countLine(d, Math.max(max, 1), c, false, true), hint: 'Each little jump is ' + fstr(1, d) + '. Count the jumps.',
        steps: ['Each jump is ' + fstr(1, d) + '.', 'There are ' + c + ' jumps, so the dot is at ' + c + '/' + d + '.'], explain: 'The dot is at ' + c + '/' + d + (c % d === 0 ? ', which is ' + c / d + ' whole.' : '.') };
    },
    unit: function (lv) {
      var d = R.pick(DEN), n = R.int(2, d - 1);
      if (lv === 1) {
        var sum = []; for (var i = 0; i < n; i++) sum.push(fstr(1, d));
        var o = R.mc(fstr(n, d), [fstr(n, n * d), fstr(1, d), fstr(n, d + n)]);
        return { q: 'Add: ' + sum.join(' + '), type: 'mc', options: o.options, answer: o.answer, fig: bar(n, d, 360),
          hint: 'Count the pieces. They are all ' + NAME[d][1] + ', so the denominator stays ' + d + '.', steps: ['There are ' + n + ' pieces of ' + fstr(1, d) + '.', 'The piece size does not change, so the denominator stays ' + d + '.', 'The sum is ' + fstr(n, d) + '.'], explain: n + ' pieces of ' + fstr(1, d) + ' is ' + fstr(n, d) + '.' };
      }
      if (lv === 2) {
        var o2 = R.mc(n + ' &times; ' + fstr(1, d), [d + ' &times; ' + fstr(1, n), n + ' &times; ' + fstr(n, d), '1 &times; ' + fstr(n, n)]);
        return { q: 'Which multiplication matches ' + fstr(n, d) + '?', type: 'mc', options: o2.options, answer: o2.answer, fig: bar(n, d, 360),
          hint: fstr(n, d) + ' is ' + n + ' pieces, and each piece is ' + fstr(1, d) + '.', steps: [fstr(n, d) + ' is ' + n + ' copies of ' + fstr(1, d) + '.', 'Adding the same thing ' + n + ' times is multiplying by ' + n + '.', fstr(n, d) + ' = ' + n + ' &times; ' + fstr(1, d) + '.'], explain: n + ' &times; ' + fstr(1, d) + ' = ' + fstr(n, d) + '.' };
      }
      var k = R.int(d + 1, 2 * d), w = Math.floor(k / d), r = k % d, ans = r ? A.mixed(w, r, d) : String(w);
      var o3 = R.mc(ans, [fstr(k, k * d), A.mixed(w, r + 1 < d ? r + 1 : 1, d), fstr(1, k)].filter(function (x) { return x !== ans; }));
      return { q: 'A recipe uses ' + fstr(1, d) + ' cup of oats for each muffin. How many cups for ' + k + ' muffins?', type: 'mc', options: o3.options, answer: o3.answer,
        hint: k + ' &times; ' + fstr(1, d) + ' = ' + k + '/' + d + '. Then see how many wholes that makes.', steps: [k + ' &times; ' + fstr(1, d) + ' = ' + k + '/' + d + '.', d + '/' + d + ' is 1 whole. ' + k + '/' + d + ' is ' + w + ' whole' + (w === 1 ? '' : 's') + (r ? ' and ' + nm(r, d) : '') + '.', 'The recipe needs ' + ans + ' cups.'], explain: k + ' &times; ' + fstr(1, d) + ' = ' + ans + ' cups.' };
    }
  };

  /* ---------- one idea at a time ---------- */
  var K = A.kit;
  function T(name, lv) { return function () { return gen[name](lv); }; }
  var DENS = DEN.map(function (d) { return [String(d), NAME[d][1]]; });
  /* k copies of 1/d, shaded across as many wholes as needed, two wholes to a row */
  function unitFig(k, d) {
    var nb = Math.max(1, Math.ceil(k / d)), w = 250, s = '';
    for (var b = 0; b < nb; b++) s += barAt(2 + (b % 2) * (w + 16), 2 + Math.floor(b / 2) * 56, w, 44, Math.min(d, k - b * d), d);
    return A.svg(2 * w + 20, Math.ceil(nb / 2) * 56, s, k + ' copies of one ' + NAME[d][0] + ' shaded');
  }
  function mixedOf(c, d) { return c % d === 0 ? String(c / d) : c > d ? A.mixed(Math.floor(c / d), c % d, d) : fr(c, d); }
  /* a set of 8 markers; data-k parts can be tapped */
  function setFig(st) {
    var s = '';
    for (var i = 0; i < 8; i++) {
      var x = 20 + i * 62, on = st.lit[i];
      s += '<g data-k="' + i + '"><rect x="' + x + '" y="20" width="40" height="120" rx="8" style="fill:' + (on ? 'var(--bad)' : 'var(--card)') + ';stroke:var(--ink)" stroke-width="2"/><rect x="' + (x + 8) + '" y="4" width="24" height="20" rx="4" style="fill:var(--ink2)"/></g>';
    }
    return A.svg(520, 150, s, '8 markers, ' + Object.keys(st.lit).length + ' red');
  }

  var LESSONS = [
    { id: 'parts', title: 'What a fraction means', sub: 'Equal parts of a whole or a set.', concepts: [
      { id: 'equal-parts', title: 'Equal parts', exp: ['B1.4'], skill: 'fr4-mean',
        body: '<p>A fraction names part of a whole. The whole must be cut into <b>equal</b> parts.</p>',
        watch: { tool: 'fractions', opts: { choices: [] }, steps: [
          { say: 'Here is one whole.', act: function (t) { return t.wait(600); }, ms: 1200 },
          { say: 'Cut it into 4 <b>equal</b> parts: fourths.', act: function (t) { return t.split(4); } },
          { say: 'Shade 1 part: <b>one fourth</b>.', act: function (t) { return t.shade(1); } },
          { say: 'Shade 3 parts: <b>three fourths</b>.', act: function (t) { return t.split(4).then(function () { return t.shade(3); }); }, ms: 1800 }
        ] },
        try: { tool: 'fractions', opts: { choices: [2, 3, 4, 5, 6, 8, 10] }, tasks: [
          { do: 'Show <b>three fifths</b>.', goal: function (s) { return s[0].d === 5 && s[0].n === 3; }, yes: '3 of 5 equal parts.' },
          { do: 'Show <b>one whole</b> using eighths.', goal: function (s) { return s[0].d === 8 && s[0].n === 8; }, yes: '8 eighths make 1 whole.' }
        ] },
        key: '<p>Fractions need <b>equal parts</b>.</p>',
        mistake: '<p>Calling any piece a "fourth" even when the 4 parts are different sizes. Ask: "Are all the parts the same size?"</p>',
        check: [T('meaning', 2), T('name', 1)] },

      { id: 'num-den', title: 'Numerator and denominator', exp: ['B1.4'], skill: 'fr4-name',
        body: '<p>The <b>denominator</b> (bottom) says how many equal parts make the whole. The <b>numerator</b> (top) counts the parts we are talking about.</p>',
        watch: K.watch([
          ['A pizza cut into 8 equal slices. The denominator is <b>8</b>.', pie(0, 8), 1800],
          ['5 slices are eaten. The numerator is <b>5</b>.', pie(5, 8), 1800],
          ['<b>5/8</b> of the pizza is eaten: five eighths.', '<div style="display:flex;gap:18px;align-items:center;justify-content:center">' + pie(5, 8) + '<span class="big">' + fr(5, 8) + '</span></div>', 2000]
        ]),
        try: K.lab({ controls: [{ id: 'd', label: 'Equal parts', type: 'select', options: DENS }, { id: 'n', label: 'Shaded parts', min: 0, max: 10, value: 1 }],
          render: function (s) { var d = +s.d, n = Math.min(s.n, d); s.f = n + '/' + d; return { fig: '<div style="display:flex;gap:18px;align-items:center;justify-content:center;flex-wrap:wrap">' + pie(n, d) + bar(n, d, 260) + '</div>', out: '<p><span class="big">' + fr(n, d) + '</span> ' + nm(n, d) + (s.n > d ? ' <span class="t2">(only ' + d + ' parts to shade)</span>' : '') + '</p>' }; },
          tasks: [
            { do: 'Show <b>' + fr(3, 8) + '</b>.', goal: function (s) { return s.f === '3/8'; }, yes: 'Three eighths.' },
            { do: 'Show a fraction where the numerator and denominator are the <b>same</b>.', goal: function (s) { return +s.n === +s.d; }, yes: 'All the parts are shaded: that is 1 whole.' }
          ] }),
        key: '<p><b>Bottom: how many equal parts in the whole. Top: how many we count.</b></p>',
        check: [T('name', 1), T('meaning', 1)] },

      { id: 'sets', title: 'A fraction of a set', exp: ['B1.4'], skill: 'fr4-mean',
        body: '<p>The whole can be a <b>set</b> of things. In a set of 8 markers, each marker is <b>1/8</b> of the set.</p>',
        watch: K.watch([
          ['A set of 8 markers. Each one is 1/8 of the set.', setFig({ lit: {} }), 1800],
          ['3 markers are red: <b>3/8</b> of the set.', setFig({ lit: { 0: 1, 1: 1, 2: 1 } }), 2000]
        ]),
        try: K.tap({ render: setFig, label: function (st) { var n = st.order.length; return '<p><span class="big">' + fr(n, 8) + '</span> of the set is red</p>'; },
          tasks: [
            { do: 'Tap markers to make <b>' + fr(5, 8) + '</b> of the set red.', goal: function (st) { return st.order.length === 5; }, yes: '5 of the 8 markers.' },
            { do: 'Now make <b>half</b> the set red.', goal: function (st) { return st.order.length === 4; }, yes: '4 of 8 is half: ' + fr(4, 8) + '.' }
          ] }),
        key: '<p>In a set, <b>the denominator is how many things are in the whole set</b>.</p>',
        check: [T('meaning', 3), T('name', 3)] }
    ] },

    { id: 'sharing', title: 'Fair shares', sub: 'Share wholes equally.', concepts: [
      { id: 'share', title: 'Share wholes equally', exp: ['B1.5'], skill: 'fr4-share', hard: true,
        body: '<p>To share 3 pizzas among 4 friends, cut <b>each</b> pizza into 4 equal pieces. Each friend gets 1 piece from each pizza.</p>',
        watch: K.watch([
          ['3 pizzas, 4 friends.', fairShare(3, 1), 1600],
          ['Cut each pizza into 4 pieces. Each colour is one friend.', fairShare(3, 4), 2000],
          ['One friend gets 1 piece from each pizza: 3 pieces of 1/4. That is <b>' + fr(3, 4) + '</b>.', fairShare(3, 4, true), 2400]
        ]),
        try: K.lab({ controls: [{ id: 'n', label: 'Wholes', min: 1, max: 6, value: 2 }, { id: 'k', label: 'People', type: 'select', options: DEN.map(function (d) { return [String(d), String(d)]; }) }],
          render: function (s) { var k = +s.k; return { fig: fairShare(s.n, k), out: '<p>Each person gets ' + s.n + ' piece' + (s.n > 1 ? 's' : '') + ' of ' + fr(1, k) + ': <span class="big">' + mixedOf(s.n, k) + '</span></p>' }; },
          tasks: [
            { do: 'Share <b>2</b> granola bars among <b>5</b> friends.', goal: function (s) { return s.n === 2 && s.k === '5'; }, yes: 'Each gets ' + fr(2, 5) + '.' },
            { do: 'Find a share where each person gets <b>' + fr(3, 4) + '</b>.', goal: function (s) { return s.n === 3 && s.k === '4'; }, yes: '3 wholes among 4 people.' },
            { do: 'Find a share where each person gets <b>more than 1</b> whole.', goal: function (s) { return s.n > +s.k; }, yes: function (s) { return s.n + ' among ' + s.k + ' is ' + mixedOf(s.n, +s.k) + ' each.'; } }
          ] }),
        ways: [
          { label: 'Wholes on top', html: '<p>Share <b>3</b> wholes among <b>4</b> people: each gets <b>' + fr(3, 4) + '</b>. The number of wholes goes on top. The number of people goes on the bottom.</p>' },
          { label: 'One at a time', html: '<p>Share one pizza at a time. Pizza 1: each gets ' + fr(1, 4) + '. Pizza 2: another ' + fr(1, 4) + '. Pizza 3: another ' + fr(1, 4) + '. Each has 3 fourths.</p><div class="fig">' + fairShare(3, 4, true) + '</div>' }
        ],
        key: '<p><b>n wholes shared among k people: each gets n/k.</b></p>',
        mistake: '<p>Flipping the fraction (4/3 instead of 3/4), or answering 1/4 because each piece is a fourth. Ask: "How many pieces does each person end up with?"</p>',
        check: [T('share', 1), T('share', 2)] },

      { id: 'big-share', title: 'Shares bigger than one', exp: ['B1.5'], skill: 'fr4-share',
        body: '<p>When there are more wholes than people, each person gets <b>more than 1 whole</b>. 5 sandwiches among 4: each gets 1 whole and 1/4.</p>',
        watch: K.watch([
          ['5 sandwiches among 4 friends. Each gets 1 whole sandwich.', fairShare(5, 1), 1800],
          ['Cut the last one into 4. Each friend also gets 1/4.', fairShare(5, 4, true), 2000],
          ['Each gets 5/4 = <b>' + A.mixed(1, 1, 4) + '</b>.', fairShare(5, 4, true) + '<p class="big">' + fr(5, 4) + ' = ' + A.mixed(1, 1, 4) + '</p>', 2200]
        ]),
        key: '<p>5 among 4 is <b>5/4</b>, which is <b>1 and 1/4</b>.</p>',
        check: [T('share', 3), T('share', 3)] }
    ] },

    { id: 'comparing', title: 'Comparing fractions', sub: 'Same-size pieces, or the same number of pieces.', concepts: [
      { id: 'same-den', title: 'Same denominator', exp: ['B1.5'], skill: 'fr4-compare',
        body: '<p>When the denominators are the same, the pieces are the <b>same size</b>. More pieces is more.</p>',
        watch: { tool: 'fractions', opts: { wall: [8, 8] }, steps: [
          { say: 'Two strips, both cut into eighths.', act: function (t) { return t.wait(500); }, ms: 1200 },
          { say: 'Shade 3/8.', act: function (t) { return t.shade(3, 0); } },
          { say: 'Shade 5/8. Same-size pieces, more of them: <b>5/8 &gt; 3/8</b>.', act: function (t) { return t.shade(5, 1); }, ms: 2000 }
        ] },
        try: { tool: 'fractions', opts: { wall: [6, 6] }, tasks: [
          { do: 'Shade <b>' + fr(4, 6) + '</b> on top and <b>' + fr(2, 6) + '</b> below.', goal: function (s) { return s[0].n === 4 && s[1].n === 2; }, yes: fr(4, 6) + ' &gt; ' + fr(2, 6) + '.' }
        ] },
        key: '<p>Same denominator: <b>compare the numerators</b>.</p>',
        check: [T('compare', 2), T('compare', 2)] },

      { id: 'same-num', title: 'Same numerator', exp: ['B1.5'], skill: 'fr4-compare', hard: true,
        body: '<p>When the numerators are the same, look at the size of the pieces. <b>More parts in the whole means smaller parts.</b></p>',
        watch: { tool: 'fractions', opts: { wall: [2, 3, 4, 6, 8] }, steps: [
          { say: 'One half.', act: function (t) { return t.shade(1, 0); } },
          { say: 'One third: smaller.', act: function (t) { return t.shade(1, 1); } },
          { say: 'One fourth: smaller again.', act: function (t) { return t.shade(1, 2); } },
          { say: 'One sixth. One eighth. <b>The bigger the denominator, the smaller the piece.</b>', act: function (t) { return t.shade(1, 3).then(function () { return t.shade(1, 4); }); }, ms: 2200 }
        ] },
        try: { tool: 'fractions', opts: { wall: [3, 5] }, tasks: [
          { do: 'Shade <b>' + fr(2, 3) + '</b> on top and <b>' + fr(2, 5) + '</b> below. Which is more?', goal: function (s) { return s[0].n === 2 && s[1].n === 2; }, yes: 'Thirds are bigger than fifths, so ' + fr(2, 3) + ' &gt; ' + fr(2, 5) + '.' }
        ] },
        ways: [
          { label: 'Sharing a pizza', html: '<p>A pizza shared by 3 friends, or the same pizza shared by 8 friends? With 8 friends, everyone gets a <b>smaller</b> slice. So ' + fr(1, 3) + ' &gt; ' + fr(1, 8) + '.</p><div style="display:flex;gap:18px;justify-content:center">' + pie(1, 3) + pie(1, 8) + '</div>' },
          { label: 'Same strip length', html: '<div class="fig">' + A.svg(404, 108, barAt(2, 2, 400, 44, 2, 3) + barAt(2, 60, 400, 44, 2, 5, 'var(--btn)'), fr(2, 3) + ' and ' + fr(2, 5)) + '</div><p>Both are 2 pieces. The thirds are longer pieces.</p>' }
        ],
        key: '<p>Same numerator: <b>the smaller denominator is the bigger fraction</b>.</p>',
        mistake: '<p>Thinking 1/8 is bigger than 1/3 "because 8 is bigger than 3". Ask: "Would you rather share a pizza with 2 friends or 7 friends?"</p>',
        check: [T('compare', 1), T('compare', 3)] }
    ] },

    { id: 'counting', title: 'Counting by fractions', sub: 'Jump along a number line.', concepts: [
      { id: 'count-by', title: 'Count by fourths', exp: ['B1.6'], skill: 'fr4-count',
        body: '<p>Counting by fourths: each jump is <b>1/4</b>. Four jumps make 1 whole.</p>',
        watch: K.watch([1, 2, 3, 4, 5, 6].map(function (c) { return [c === 4 ? '4/4 = <b>1 whole</b>.' : c + '/4', countLine(4, 2, c), c === 4 ? 1800 : 900]; })),
        try: K.lab({ controls: [
          { id: 'd', label: 'Count by', type: 'select', options: [['2', 'halves'], ['3', 'thirds'], ['4', 'fourths'], ['5', 'fifths'], ['6', 'sixths'], ['8', 'eighths']] },
          { id: 'up', label: '+ 1 jump', type: 'action', act: function (s) { s.c++; }, can: function (s) { return s.c < 3 * s.d; } },
          { id: 'down', label: '&minus; 1 jump', type: 'action', act: function (s) { s.c--; }, can: function (s) { return s.c > 0; } },
          { id: 'zero', label: 'Back to 0', type: 'action', act: function (s) { s.c = 0; }, can: function (s) { return s.c > 0; } }],
          init: function (s) { s.c = 0; s.dk = ''; },
          render: function (s) { if (s.dk !== s.d) { s.c = 0; s.dk = s.d; } var d = +s.d; return { fig: countLine(d, 3, s.c, true), out: '<p class="big">' + (s.c ? s.c + '/' + d + (s.c >= d ? ' = ' + mixedOf(s.c, d) : '') : '0') + '</p>' }; },
          tasks: [
            { do: 'Count by fourths to <b>' + A.mixed(1, 2, 4) + '</b>.', setup: function (api) { api.set('d', '4'); }, goal: function (s) { return s.d === '4' && s.c === 6; }, yes: '6 fourths = 1 and 2/4.' },
            { do: 'Count by thirds to <b>2</b>.', setup: function (api) { api.set('d', '3'); }, goal: function (s) { return s.d === '3' && s.c === 6; }, yes: '6 thirds = 2 wholes.' }
          ] }),
        key: '<p><b>d jumps of 1/d make 1 whole.</b></p>',
        check: [T('count', 1), T('count', 2)] },

      { id: 'mixed', title: 'Past one whole', exp: ['B1.6'], skill: 'fr4-count', hard: true,
        body: '<p>Past 1, we can write wholes and parts together: 7/4 is <b>1 and 3/4</b>, a <b>mixed number</b>.</p>',
        watch: K.watch([
          ['Count 7 fourths.', countLine(4, 2, 7, false), 1600],
          ['The first 4 make 1 whole. 3 more fourths.', countLine(4, 2, 7, true), 2000],
          ['7/4 = <b>' + A.mixed(1, 3, 4) + '</b>.', unitFig(7, 4) + '<p class="big">' + fr(7, 4) + ' = ' + A.mixed(1, 3, 4) + '</p>', 2200]
        ]),
        ways: [
          { label: 'Make wholes first', html: '<p>Take out groups of 4 fourths. Each group is 1 whole. 11/4: two groups (8/4 = 2), 3 left: <b>' + A.mixed(2, 3, 4) + '</b>.</p><div class="fig">' + unitFig(11, 4) + '</div>' },
          { label: 'Like money', html: '<p>4 quarters make $1. 7 quarters are $1 and 3 quarters: $1.75. That is 1 and 3/4 dollars.</p>' }
        ],
        key: '<p><b>Group the parts into wholes. What is left is the fraction part.</b></p>',
        mistake: '<p>Reading 1 3/4 as "13 fourths", or counting the tick marks instead of the jumps. Point at each jump while counting.</p>',
        check: [T('count', 3), T('count', 3)] }
    ] },

    { id: 'units', title: 'Groups of unit fractions', sub: 'n copies of 1/d.', concepts: [
      { id: 'add-units', title: 'Copies of one piece', exp: ['B2.7'], skill: 'fr4-unit',
        body: '<p>A <b>unit fraction</b> has 1 on top: 1/5. Three copies of 1/5 is <b>3 &times; 1/5 = 3/5</b>.</p>',
        watch: { tool: 'fractions', opts: { parts: 5, choices: [] }, steps: [
          { say: 'One fifth.', act: function (t) { return t.shade(1); } },
          { say: '1/5 + 1/5 = 2/5.', act: function (t) { return t.split(5).then(function () { return t.shade(2); }); } },
          { say: '1/5 + 1/5 + 1/5 = <b>3 &times; 1/5 = 3/5</b>. The piece size stays fifths.', act: function (t) { return t.split(5).then(function () { return t.shade(3); }); }, ms: 2200 }
        ] },
        try: K.lab({ controls: [{ id: 'k', label: 'Copies', min: 1, max: 24, value: 3 }, { id: 'd', label: 'Of', type: 'select', options: DEN.map(function (d) { return [String(d), '1/' + d]; }) }],
          render: function (s) { var d = +s.d; return { fig: unitFig(s.k, d), out: '<p class="big math">' + s.k + ' &times; ' + fr(1, d) + ' = ' + fr(s.k, d) + (s.k >= d ? ' = ' + mixedOf(s.k, d) : '') + '</p>' }; },
          tasks: [
            { do: 'Make <b>4 &times; ' + fr(1, 6) + '</b>.', goal: function (s) { return s.k === 4 && s.d === '6'; }, yes: fr(4, 6) + '.' },
            { do: 'Make exactly <b>2 wholes</b> with eighths.', goal: function (s) { return s.k === 16 && s.d === '8'; }, yes: '16 &times; ' + fr(1, 8) + ' = 2.' }
          ] }),
        key: '<p><b>n &times; 1/d = n/d.</b> The denominator stays the same.</p>',
        check: [T('unit', 1), T('unit', 2)] },

      { id: 'recipe', title: 'More than a whole', exp: ['B2.7'], skill: 'fr4-unit', hard: true,
        body: '<p>A muffin needs 1/4 cup of oats. 7 muffins need <b>7 &times; 1/4 = 7/4</b> cups, which is 1 and 3/4 cups.</p>',
        watch: K.watch([
          ['Each muffin: 1/4 cup.', unitFig(1, 4), 1400],
          ['4 muffins: 4/4 = 1 cup.', unitFig(4, 4), 1600],
          ['7 muffins: 7/4 = <b>' + A.mixed(1, 3, 4) + ' cups</b>.', unitFig(7, 4), 2200]
        ]),
        ways: [
          { label: 'Count by fourths', html: '<div class="fig">' + countLine(4, 2, 7, true) + '</div><p>7 jumps of 1/4 land on ' + A.mixed(1, 3, 4) + '.</p>' },
          { label: 'Make full cups', html: '<p>Every 4 muffins use a full cup. 7 muffins = 4 muffins (1 cup) + 3 muffins (3/4 cup).</p>' }
        ],
        key: '<p>Multiply to get <b>n/d</b>, then <b>make wholes</b>.</p>',
        mistake: '<p>Multiplying the denominator too (7 &times; 1/4 = 7/28). Ask: "Did the size of the piece change?"</p>',
        check: [T('unit', 3), T('unit', 3)] }
    ] }
  ];

  A.register('fractions', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Numerator and denominator</h2>' +
'<p>A fraction names part of a whole. The whole must be cut into <b>equal</b> parts.</p>' +
'<ul><li>The <b>denominator</b> (bottom number) says how many equal parts make the whole.</li><li>The <b>numerator</b> (top number) says how many of those parts we are talking about.</li></ul>' +
'<div class="lab"><span class="lt">Try it: build a fraction</span>' +
'<div class="ctrl"><label for="frd">Equal parts (denominator)<select id="frd">' + DEN.map(function (d) { return '<option' + (d === 5 ? ' selected' : '') + '>' + d + '</option>'; }).join('') + '</select></label><label for="frn">Shaded parts (numerator): <output id="frno"></output><input type="range" id="frn" min="0" max="5" value="3"></label></div>' +
'<div class="vrow" id="frfig"></div><div class="out" id="frout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Same whole, more parts, smaller parts. A tenth is much smaller than a half.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Counting parts that are not equal. This bar has 4 parts, but they are not the same size, so the shaded part is <b>not</b> ' + fr(1, 4) + '.</p><div class="fig">' + unequal() + '</div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A pan of brownies is cut into 8 equal pieces, and 3 are eaten. 3 out of 8 equal pieces is ' + fr(3, 8) + '. The pieces left are ' + fr(5, 8) + '.</p><div class="fig">' + bar(3, 8, 400) + '</div></div>' +
A.yt({ gen: function () { return gen.name(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Fair shares</h2>' +
'<p>When things are shared equally, each share can be a fraction. Cut each whole into as many pieces as there are people. Each person gets <b>one piece from every whole</b>.</p>' +
'<div class="lab"><span class="lt">Try it: share some wholes</span>' +
'<div class="ctrl"><label for="fsn">Wholes to share: <output id="fsno"></output><input type="range" id="fsn" min="1" max="6" value="3"></label><label for="fsk">People<select id="fsk">' + DEN.map(function (d) { return '<option' + (d === 4 ? ' selected' : '') + '>' + d + '</option>'; }).join('') + '</select></label></div>' +
'<div class="fig" id="fsfig"></div><div class="out" id="fsout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>3 sandwiches shared among 4 friends. Cut each sandwich into 4 pieces. Each friend takes 1 piece from each sandwich: 3 pieces of ' + fr(1, 4) + ', which is <b>' + fr(3, 4) + '</b> of a sandwich.</p><div class="fig">' + fairShare(3, 4, true) + '</div></div>' +
A.yt({ gen: function () { return gen.share(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Comparing fractions</h2>' +
'<p>Compare fractions of the <b>same size whole</b>. Two cases are easy to see:</p>' +
'<ul><li><b>Same denominator:</b> the pieces are the same size, so more pieces is more. ' + fr(3, 8) + ' &lt; ' + fr(5, 8) + '.</li><li><b>Same numerator:</b> fewer parts in the whole means bigger pieces. ' + fr(2, 3) + ' &gt; ' + fr(2, 5) + '.</li></ul>' +
'<div class="lab"><span class="lt">Try it: compare two fractions</span>' +
'<div class="ctrl"><label for="fca">First: numerator<input type="number" id="fca" min="0" max="10" value="1"></label><label for="fcb">denominator<select id="fcb">' + DEN.map(function (d) { return '<option' + (d === 3 ? ' selected' : '') + '>' + d + '</option>'; }).join('') + '</select></label>' +
'<label for="fcc">Second: numerator<input type="number" id="fcc" min="0" max="10" value="1"></label><label for="fcd">denominator<select id="fcd">' + DEN.map(function (d) { return '<option' + (d === 5 ? ' selected' : '') + '>' + d + '</option>'; }).join('') + '</select></label></div>' +
'<div class="fig" id="fcfig"></div><div class="out" id="fcout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>One pizza is shared by 3 friends. Another pizza, the same size, is shared by 5 friends. Who gets more? ' + fr(1, 3) + ' &gt; ' + fr(1, 5) + ', so the friends in the group of 3 get bigger slices.</p><div class="vrow"><figure><figcaption>shared by 3</figcaption>' + pie(1, 3) + '</figure><figure><figcaption>shared by 5</figcaption>' + A.svg(120, 120, pieAt(60, 60, 54, 1, 5, 'var(--btn)'), 'one fifth shaded') + '</figure></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking a bigger denominator means a bigger fraction. ' + fr(1, 10) + ' is <b>smaller</b> than ' + fr(1, 2) + ', because the whole is cut into more pieces.</p></div>' +
A.yt({ gen: function () { return gen.compare(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Counting by fractions</h2>' +
'<p>You can count by any fraction: ' + fr(1, 4) + ', ' + fr(2, 4) + ', ' + fr(3, 4) + ', ' + fr(4, 4) + ', ' + fr(5, 4) + ' ... When the numerator equals the denominator, you have <b>1 whole</b>. Then keep counting: ' + fr(5, 4) + ' is 1 whole and ' + fr(1, 4) + ', written <b>1 ' + fr(1, 4) + '</b>. This is a <b>mixed number</b>.</p>' +
'<div class="lab"><span class="lt">Try it: count along the line</span>' +
'<div class="ctrl"><label for="fld">Count by<select id="fld">' + DEN.map(function (d) { return '<option value="' + d + '"' + (d === 4 ? ' selected' : '') + '>' + NAME[d][1] + '</option>'; }).join('') + '</select></label></div>' +
'<div class="btnrow"><button type="button" class="btn" id="flup">Count one more</button><button type="button" class="btn alt" id="fldown">Count back one</button><button type="button" class="btn alt" id="flzero">Back to 0</button></div>' +
'<div class="fig" id="flfig"></div><div class="out" id="flout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>' + fr(2, 2) + ', ' + fr(3, 3) + ', ' + fr(4, 4) + ' and ' + fr(10, 10) + ' all equal 1 whole. ' + fr(8, 4) + ' equals 2 wholes.</p></div>' +
A.yt({ gen: function () { return gen.count(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Groups of unit fractions</h2>' +
'<p>A <b>unit fraction</b> has 1 on top, like ' + fr(1, 5) + '. Adding the same unit fraction again and again is like multiplying:</p>' +
'<p class="math" style="font-size:1.15rem">' + fr(1, 5) + ' + ' + fr(1, 5) + ' + ' + fr(1, 5) + ' = 3 &times; ' + fr(1, 5) + ' = ' + fr(3, 5) + '</p>' +
'<div class="lab"><span class="lt">Try it: copies of a unit fraction</span>' +
'<div class="ctrl"><label for="fuk">How many copies: <output id="fuko"></output><input type="range" id="fuk" min="1" max="20" value="3"></label><label for="fud">Unit fraction<select id="fud">' + DEN.map(function (d) { return '<option value="' + d + '"' + (d === 5 ? ' selected' : '') + '>1/' + d + '</option>'; }).join('') + '</select></label></div>' +
'<div class="fig" id="fufig"></div><div class="out" id="fuout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Each muffin needs ' + fr(1, 4) + ' cup of oats. For 6 muffins: 6 &times; ' + fr(1, 4) + ' = ' + fr(6, 4) + '. ' + fr(4, 4) + ' is 1 cup, and ' + fr(2, 4) + ' more. So <b>1 ' + fr(2, 4) + ' cups</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Adding the denominators. ' + fr(1, 5) + ' + ' + fr(1, 5) + ' is <b>not</b> ' + fr(2, 10) + '. The pieces are still fifths, so it is ' + fr(2, 5) + '.</p></div>' +
A.yt({ gen: function () { return gen.unit(2); } }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function bf() {
        var d = +$('#frd', root).value, r = $('#frn', root);
        r.max = d; if (+r.value > d) r.value = d;
        var n = +r.value;
        $('#frno', root).textContent = n;
        $('#frfig', root).innerHTML = '<figure><figcaption>circle</figcaption>' + pie(n, d) + '</figure><figure><figcaption>bar</figcaption>' + bar(n, d, 300) + '</figure>';
        $('#frout', root).innerHTML = '<p><span class="big">' + fr(n, d) + '</span> &nbsp;' + nm(n, d) + '</p><p>The whole is cut into <b>' + d + '</b> equal parts (denominator). <b>' + n + '</b> ' + (n === 1 ? 'is' : 'are') + ' shaded (numerator).' + (n === d ? ' All the parts are shaded, so this is 1 whole.' : n === 0 ? ' Nothing is shaded, so this is 0.' : ' ' + fr(d - n, d) + ' is not shaded.') + '</p>';
      }
      A.bind(root, ['frd', 'frn'], bf);
      function fs() {
        var n = +$('#fsn', root).value, k = +$('#fsk', root).value;
        $('#fsno', root).textContent = n;
        $('#fsfig', root).innerHTML = fairShare(n, k);
        var each = n % k === 0 ? String(n / k) : n > k ? fr(n, k) + ' = ' + A.mixed(Math.floor(n / k), n % k, k) : fr(n, k);
        $('#fsout', root).innerHTML = '<p>Each whole is cut into ' + k + ' pieces of ' + fr(1, k) + '. Each colour is one person.</p><p>Each person gets ' + n + ' piece' + (n > 1 ? 's' : '') + ': <span class="big">' + each + '</span></p>';
      }
      A.bind(root, ['fsn', 'fsk'], fs);
      function fc() {
        var b = +$('#fcb', root).value, d = +$('#fcd', root).value;
        var a = Math.max(0, Math.min(b, parseInt($('#fca', root).value, 10) || 0)), c = Math.max(0, Math.min(d, parseInt($('#fcc', root).value, 10) || 0));
        $('#fcfig', root).innerHTML = A.svg(404, 108, barAt(2, 2, 400, 44, a, b) + barAt(2, 60, 400, 44, c, d, 'var(--btn)'), 'Two bars of the same length showing ' + a + '/' + b + ' and ' + c + '/' + d);
        var v1 = a / b, v2 = c / d, sym = Math.abs(v1 - v2) < 1e-9 ? '=' : v1 > v2 ? '&gt;' : '&lt;';
        var why = b === d ? 'Same denominator: the pieces are the same size, so compare the numerators.' : a === c && a > 0 ? 'Same numerator: fewer parts means bigger pieces.' : 'Look at the bars: the longer shaded part is greater.';
        $('#fcout', root).innerHTML = '<p><span class="big">' + fr(a, b) + ' ' + sym + ' ' + fr(c, d) + '</span></p><p>' + why + '</p>' +
          ((parseInt($('#fca', root).value, 10) || 0) > b || (parseInt($('#fcc', root).value, 10) || 0) > d ? '<p class="t2">In this tool the numerator is at most the denominator.</p>' : '');
      }
      A.bind(root, ['fca', 'fcb', 'fcc', 'fcd'], fc);
      var cnt = 5;
      function fl() {
        var d = +$('#fld', root).value, max = d >= 8 ? 2 : 3;
        cnt = Math.max(0, Math.min(cnt, max * d));
        $('#flfig', root).innerHTML = countLine(d, max, cnt, true);
        var w = Math.floor(cnt / d), r = cnt % d, list = [];
        for (var i = 1; i <= cnt; i++) list.push(i + '/' + d);
        $('#flout', root).innerHTML = '<p>Counted: ' + (list.length ? list.join(', ') : '0') + '</p><p><span class="big">' + (cnt ? fr(cnt, d) : '0') + '</span>' + (cnt >= d ? ' = ' + (r ? A.mixed(w, r, d) : w + ' whole' + (w > 1 ? 's' : '')) : '') + '</p>';
        $('#flup', root).disabled = cnt >= max * d; $('#fldown', root).disabled = cnt <= 0;
      }
      $('#flup', root).addEventListener('click', function () { cnt++; fl(); });
      $('#fldown', root).addEventListener('click', function () { cnt--; fl(); });
      $('#flzero', root).addEventListener('click', function () { cnt = 0; fl(); });
      A.bind(root, ['fld'], fl);
      function fu() {
        var k = +$('#fuk', root).value, d = +$('#fud', root).value, wholes = Math.max(1, Math.ceil(k / d)), w = Math.min(130, 520 / wholes - 10), s = '';
        $('#fuko', root).textContent = k;
        for (var j = 0; j < wholes; j++) s += barAt(4 + j * (w + 10), 4, w, 44, Math.max(0, Math.min(d, k - j * d)), d);
        $('#fufig', root).innerHTML = A.svg(4 + wholes * (w + 10), 52, s, k + ' copies of 1/' + d);
        var sum = [];
        for (var i = 0; i < Math.min(k, 6); i++) sum.push(fr(1, d));
        var wh = Math.floor(k / d), r = k % d;
        $('#fuout', root).innerHTML = '<p class="math" style="white-space:normal">' + sum.join(' + ') + (k > 6 ? ' + ...' : '') + '</p><p><span class="big">' + k + ' &times; ' + fr(1, d) + ' = ' + fr(k, d) + '</span>' + (k >= d ? ' = ' + (r ? A.mixed(wh, r, d) : String(wh)) : '') + '</p>';
      }
      A.bind(root, ['fuk', 'fud'], fu);
    },

    quiz: [
      { q: 'What fraction of the circle is shaded?', type: 'mc', fig: pie(5, 8), options: [fr(3, 8), fr(8, 5), fr(5, 8), fr(5, 3)], answer: 2, hint: 'Count all the equal parts first. That is the denominator.', explain: '5 of 8 equal parts are shaded: ' + fr(5, 8) + '.' },
      { q: 'In ' + fr(3, 10) + ', what does the 10 tell you?', type: 'mc', options: ['10 parts are shaded', 'The whole has 10 equal parts', 'There are 10 wholes', 'Each part is 10 big'], answer: 1, hint: 'The denominator is the bottom number.', explain: 'The denominator tells how many equal parts make the whole.' },
      { q: '2 granola bars are shared equally among 5 friends. How much does each friend get?', type: 'mc', options: [fr(5, 2), fr(1, 5), fr(2, 10), fr(2, 5)], answer: 3, fig: fairShare(2, 5, true), hint: 'Cut each bar into 5 pieces. Each friend gets 1 piece from each bar.', explain: 'Each friend gets 2 pieces of ' + fr(1, 5) + ': ' + fr(2, 5) + '.' },
      { q: 'Which is greater?', type: 'mc', options: [fr(1, 6), fr(1, 3), 'They are equal'], answer: 1, hint: 'Same numerator. Which whole is cut into fewer, bigger pieces?', explain: 'Thirds are bigger than sixths, so ' + fr(1, 3) + ' &gt; ' + fr(1, 6) + '.' },
      { q: 'Which list is in order from least to greatest?', type: 'mc', options: [fr(7, 8) + ', ' + fr(5, 8) + ', ' + fr(2, 8), fr(2, 8) + ', ' + fr(5, 8) + ', ' + fr(7, 8), fr(5, 8) + ', ' + fr(2, 8) + ', ' + fr(7, 8)], answer: 1, hint: 'Same denominator. Compare the numerators.', explain: '2 &lt; 5 &lt; 7, so ' + fr(2, 8) + ' &lt; ' + fr(5, 8) + ' &lt; ' + fr(7, 8) + '.' },
      { q: 'Count by thirds: ' + fr(1, 3) + ', ' + fr(2, 3) + ', 1, 1 ' + fr(1, 3) + ', ... What comes next?', type: 'mc', options: ['2', '1 ' + fr(1, 4), '1 ' + fr(2, 3), fr(4, 3)], answer: 2, hint: 'Add one more third to 1 ' + fr(1, 3) + '.', explain: '1 ' + fr(1, 3) + ' + ' + fr(1, 3) + ' = 1 ' + fr(2, 3) + '.' },
      { q: 'Which is equal to ' + fr(1, 6) + ' + ' + fr(1, 6) + ' + ' + fr(1, 6) + ' + ' + fr(1, 6) + '?', type: 'mc', options: ['4 &times; ' + fr(1, 6), fr(4, 24), '6 &times; ' + fr(1, 4), fr(1, 24)], answer: 0, hint: 'How many copies of ' + fr(1, 6) + ' are there?', explain: '4 copies of ' + fr(1, 6) + ' is 4 &times; ' + fr(1, 6) + ' = ' + fr(4, 6) + '.' }
    ],

    practice: [
      { id: 'fr4-name', name: 'Name the fraction', code: 'B1.4', gen: gen.name },
      { id: 'fr4-mean', name: 'Numerator and denominator', code: 'B1.4', gen: gen.meaning },
      { id: 'fr4-share', name: 'Fair shares', code: 'B1.5', gen: gen.share },
      { id: 'fr4-compare', name: 'Compare fractions', code: 'B1.5', gen: gen.compare },
      { id: 'fr4-count', name: 'Count by fractions', code: 'B1.6', gen: gen.count },
      { id: 'fr4-unit', name: 'Groups of unit fractions', code: 'B2.7', gen: gen.unit }
    ]
  });

  /* ---------- More ways to ask (question shapes; see docs/QUESTIONS.md) ----------
     q.meta holds the facts that tests/verify/grade4.js uses to work each answer out again. */
  var why = K.why, who = A.Q && A.Q.name;
  function lineLabel(d) { return function (v) { var k = Math.round(v * d); return k % d === 0 ? String(k / d) : k + '/' + d; }; }
  function asMixed(c, d) { return c % d === 0 ? String(c / d) : c > d ? A.mixed(Math.floor(c / d), c % d, d) : fr(c, d); }
  var SHAPES = {
    'fr4-name': [
      [1, 'tap', function (lv) {
        var d = lv === 1 ? R.pick([3, 4, 5, 6]) : R.pick([5, 6, 8, 10]), n = R.int(1, Math.min(d - 2, 4)), other = R.pick(DEN.filter(function (x) { return x !== d && x > n; }));
        var set = R.shuffle([[n, d], d - n === n ? [n + 1, d] : [d - n, d], [n, other]]);
        return { q: 'Tap the picture that shows ' + fr(n, d) + ' shaded.', type: 'tap', tiles: set.map(function (s) { return bar(s[0], s[1], 240); }), answer: set.map(String).indexOf(String([n, d])), answerText: 'the bar with ' + nm(n, d) + ' shaded',
          hint: 'Count all the equal parts first. You need ' + d + '. Then count the shaded parts.', steps: ['The denominator, ' + d + ', is the number of equal parts.', 'The numerator, ' + n + ', is the number shaded.'],
          explain: fr(n, d) + ' means ' + n + ' of ' + d + ' equal parts are shaded.', meta: { k: 'fr4-name-tap', set: set, n: n, d: d } };
      }],
      [1, 'match', function (lv) {
        var pairs = [], seen = {};
        while (pairs.length < 3) { var d = lv === 1 ? R.pick([2, 3, 4, 5]) : R.pick(DEN), n = R.int(1, d - 1); if (seen[n / d]) continue; seen[n / d] = 1; pairs.push([bar(n, d, 200), fr(n, d)]); }
        return { q: 'Match each bar to the fraction that is shaded.', type: 'match', pairs: pairs, hint: 'Count all the parts for the bottom number, and the shaded parts for the top number.',
          steps: ['Bottom number: all the equal parts. Top number: the shaded parts.'], explain: 'Each bar shows its numerator shaded out of its denominator.', meta: { k: 'fr4-name-match', pairs: pairs } };
      }],
      [2, 'mistake', function () {
        var d = R.pick([4, 5, 6, 8, 10]), n = R.int(1, d - 1), p = who(), truth = !R.int(0, 2), sn = truth ? n : d - n, sd = d;
        if (!truth && sn === n) { sn = n; sd = d - n; }
        var right = n + ' of the ' + d + ' equal parts are shaded, so ' + fr(n, d) + ' is shaded.';
        return { q: p + ' says ' + fr(sn, sd) + ' of the bar is shaded. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: bar(n, d, 360),
          why: why(right, ['You count the white parts for the numerator.', 'The denominator is the number of white parts.', 'Only the bigger number matters.']),
          hint: 'Count the shaded parts. Count all the parts.', steps: [right], explain: right, meta: { k: 'fr4-name-tf', n: n, d: d, sn: sn, sd: sd } };
      }]
    ],
    'fr4-mean': [
      [1, 'tap', function () {
        var d = R.pick(DEN), n = R.int(1, d - 1), askDen = !R.int(0, 1), set = R.shuffle([n, d]);
        return { q: 'Look at ' + fr(n, d) + '. Tap the number that tells ' + (askDen ? 'how many equal parts make the <b>whole</b>' : 'how many parts we are <b>counting</b>') + '.', type: 'tap', tiles: set.map(function (v) { return '<span class="math">' + v + '</span>'; }),
          answer: set.indexOf(askDen ? d : n), answerText: askDen ? 'the denominator, ' + d : 'the numerator, ' + n,
          hint: 'The bottom number is the denominator. The top number is the numerator.', steps: [askDen ? 'The denominator, ' + d + ', is the number of equal parts in the whole.' : 'The numerator, ' + n + ', is the number of parts we count.'],
          explain: 'In ' + fr(n, d) + ', ' + n + ' is the numerator and ' + d + ' is the denominator.', meta: { k: 'fr4-mean-tap', n: n, d: d, askDen: askDen } };
      }],
      [1, 'fill', function () {
        var c = R.pick([['pizza', 'slices', 'eats'], ['chocolate bar', 'pieces', 'shares'], ['garden', 'beds', 'plants']]), d = R.pick([4, 5, 6, 8, 10]), n = R.int(1, d - 1), p = who();
        return { q: 'A ' + c[0] + ' is cut into <b>' + d + '</b> equal ' + c[1] + '. ' + p + ' ' + c[2] + ' <b>' + n + '</b> of them. Fill in the fraction.', type: 'fill', fill: 'Numerator: [[]] &nbsp; Denominator: [[]]', answers: [n, d],
          fig: bar(n, d, 300), hint: 'The denominator is all the equal parts. The numerator is the parts we talk about.', steps: ['All the parts: ' + d + '. The parts used: ' + n + '.'],
          explain: 'The fraction is ' + fr(n, d) + '.', meta: { k: 'fr4-mean-fill' } };
      }],
      [2, 'mistake', function () {
        var d = R.pick([5, 6, 8, 10]), n = R.int(1, d - 1), p = who(), truth = !R.int(0, 1), said = truth ? d : n;
        var right = 'The denominator is the bottom number, ' + d + '. It tells how many equal parts make the whole.';
        return { q: p + ' says the denominator of ' + fr(n, d) + ' is <b>' + said + '</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['The denominator is the top number.', 'The denominator is always the smaller number.', 'The denominator counts the shaded parts.']),
          hint: 'Which number is on the bottom?', steps: [right], explain: right, meta: { k: 'fr4-mean-tf', n: n, d: d, said: said } };
      }]
    ],
    'fr4-share': [
      [1, 'fill', function (lv) {
        var k = R.pick(lv === 1 ? [2, 3, 4] : [3, 4, 5, 6, 8]), n = R.int(1, k - 1), c = R.pick(['granola bars', 'pancakes', 'bannock loaves', 'pizzas']);
        return { q: '<b>' + n + '</b> ' + c + ' are shared equally among <b>' + k + '</b> friends. Fill in the share for each friend.', type: 'fill', fill: 'Each friend gets [[]] / ' + k + ' of a whole.', answers: [n],
          fig: fairShare(n, k), hint: 'Cut each whole into ' + k + ' pieces. Each friend gets one piece from each whole.', steps: ['Each friend gets 1 piece from each of the ' + n + ' wholes.', 'That is ' + n + ' pieces of ' + fr(1, k) + ', or ' + fr(n, k) + '.'],
          explain: 'Each friend gets ' + fr(n, k) + '.', meta: { k: 'fr4-share-fill' } };
      }],
      [1, 'mistake', function () {
        var k = R.pick([3, 4, 5, 6]), n = R.int(1, k - 1), p = who(), truth = !R.int(0, 1), sn = truth ? n : k, sd = truth ? k : n;
        var right = n + ' wholes shared by ' + k + ' gives each one ' + n + ' pieces of ' + fr(1, k) + ': ' + fr(n, k) + '.';
        return { q: n + ' pizza' + (n > 1 ? 's are' : ' is') + ' shared equally by ' + k + ' friends. ' + p + ' says each friend gets ' + fr(sn, sd) + '. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['The number of friends goes on top.', 'Each friend gets a whole pizza.', 'The more friends there are, the bigger each share.']),
          hint: 'Each friend gets less than one whole pizza. Is ' + fr(sn, sd) + ' less than 1?', steps: [right], explain: right, meta: { k: 'fr4-share-tf', n: n, people: k, sn: sn, sd: sd } };
      }],
      [2, 'match', function () {
        var pairs = [], seen = {};
        while (pairs.length < 3) { var k = R.pick([2, 3, 4, 5, 6, 8]), n = R.int(1, k - 1); if (seen[n / k]) continue; seen[n / k] = 1; pairs.push([n + ' sandwich' + (n > 1 ? 'es' : '') + ' for ' + k + ' people', fr(n, k)]); }
        return { q: 'Match each sharing to the amount each person gets.', type: 'match', pairs: pairs, hint: 'Wholes on top, people on the bottom.',
          steps: ['n wholes shared by k people gives each person n/k.'], explain: 'Each person gets wholes &divide; people.', meta: { k: 'fr4-share-match', pairs: pairs } };
      }]
    ],
    'fr4-compare': [
      [1, 'order', function (lv) {
        var ds = R.shuffle(DEN).slice(0, 3), n = lv === 3 ? R.int(2, 3) : 1;
        ds = ds.filter(function (d) { return d > n; });
        while (ds.length < 3) { var x = R.pick(DEN); if (x > n && ds.indexOf(x) < 0) ds.push(x); }
        ds.sort(function (a, b) { return b - a; });
        return { q: 'Put these in order from <b>least to greatest</b>.', type: 'order', items: ds.map(function (d) { return fr(n, d); }), first: 'least', last: 'greatest',
          hint: 'The top numbers are the same. More parts in the whole means smaller parts.', steps: ['The fraction with the biggest denominator has the smallest pieces.', 'Order: ' + ds.map(function (d) { return n + '/' + d; }).join(', ') + '.'],
          explain: 'Least to greatest: ' + ds.map(function (d) { return n + '/' + d; }).join(', ') + '.', meta: { k: 'fr4-cmp-order' } };
      }],
      [1, 'line', function (lv) {
        var d = lv === 1 ? R.pick([2, 3, 4]) : R.pick([4, 5, 6, 8, 10]), n = R.int(1, d - 1);
        return { q: 'Place ' + fr(n, d) + ' on the number line.', type: 'line', min: 0, max: 1, tick: 1 / d, every: 1, snap: 1 / d, answer: n / d, tol: 0.01, label: lineLabel(d),
          hint: 'The line from 0 to 1 is cut into ' + d + ' equal parts. Count ' + n + ' of them.', steps: ['Each small step is ' + fr(1, d) + '.', 'Count ' + n + ' steps from 0.'],
          explain: fr(n, d) + ' is ' + n + ' steps of ' + fr(1, d) + ' from 0.', meta: { k: 'fr4-cmp-line', n: n, d: d } };
      }],
      [2, 'pick', function () {
        var d = R.pick([4, 6, 8, 10]), opts = [], half = d / 2;
        var ns = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (x) { return x < d && x !== half; })).slice(0, 4);
        if (!ns.some(function (x) { return x > half; })) ns[0] = d - 1;
        if (!ns.some(function (x) { return x < half; })) ns[1] = 1;
        ns = ns.filter(function (x, i) { return ns.indexOf(x) === i; });
        ns.forEach(function (x) { opts.push(fr(x, d)); });
        var ans = ns.map(function (x, j) { return x > half ? j : -1; }).filter(function (j) { return j >= 0; });
        return { q: 'Pick every fraction that is <b>greater than ' + fr(1, 2) + '</b>.', type: 'pick', options: opts, answer: ans,
          hint: fr(1, 2) + ' is the same as ' + fr(half, d) + '.', steps: [fr(1, 2) + ' = ' + fr(half, d) + '. Pick the ones with a numerator bigger than ' + half + '.'],
          explain: 'Greater than ' + fr(1, 2) + ': ' + ans.map(function (j) { return ns[j] + '/' + d; }).join(', ') + '.', meta: { k: 'fr4-cmp-pick', d: d, ns: ns } };
      }],
      [2, 'mistake', function () {
        var a = R.pick([2, 3, 4, 5]), b = R.pick([6, 8, 10]), p = who(), truth = !R.int(0, 2);
        var claim = truth ? [a, b] : [b, a];
        var right = 'The whole is cut into fewer parts for ' + fr(1, a) + ', so its parts are bigger. ' + fr(1, a) + ' &gt; ' + fr(1, b) + '.';
        return { q: p + ' says ' + fr(1, claim[0]) + ' is greater than ' + fr(1, claim[1]) + (truth ? '.' : ' because ' + claim[0] + ' is bigger than ' + claim[1] + '.') + ' True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['A bigger denominator always means a bigger fraction.', 'All unit fractions are the same size.', 'You compare the numerators, and they are both 1.']),
          hint: 'Picture one pizza cut into ' + a + ' and one cut into ' + b + '. Which slice is bigger?', steps: [right], explain: right, meta: { k: 'fr4-cmp-tf', big: claim[0], small: claim[1] } };
      }]
    ],
    'fr4-count': [
      [1, 'line', function (lv) {
        var d = lv === 1 ? R.pick([2, 4]) : R.pick([3, 4, 5, 6]), c = R.int(d + 1, d * 2 - 1), max = 2;
        return { q: 'Count by ' + NAME[d][1] + '. Place <b>' + c + '/' + d + '</b> on the number line.', type: 'line', min: 0, max: max, tick: 1 / d, every: 1, snap: 1 / d, answer: c / d, tol: 0.01, label: lineLabel(d),
          hint: 'Each small step is ' + fr(1, d) + '. ' + d + ' steps make 1 whole.', steps: [d + '/' + d + ' = 1.', c + '/' + d + ' is ' + (c - d) + ' more step' + (c - d > 1 ? 's' : '') + ' past 1.'],
          explain: c + '/' + d + ' = ' + Math.floor(c / d) + ' ' + (c % d) + '/' + d + '.', meta: { k: 'fr4-count-line', c: c, d: d } };
      }],
      [1, 'fill', function (lv) {
        var d = lv === 1 ? R.pick([2, 3, 4]) : R.pick([3, 4, 5, 6, 8]), s = R.int(1, d);
        return { q: 'Count by ' + NAME[d][1] + '. Fill in the missing numerators.', type: 'fill', fill: [s, '[[]]', s + 2, '[[]]', s + 4].map(function (x) { return typeof x === 'number' ? x + '/' + d : x + ' / ' + d; }).join(', &nbsp;'), answers: [s + 1, s + 3],
          hint: 'Each count adds ' + fr(1, d) + '. The denominator stays ' + d + '.', steps: ['The numerators go up by 1: ' + s + ', ' + (s + 1) + ', ' + (s + 2) + ', ' + (s + 3) + ', ' + (s + 4) + '.'],
          explain: 'Counting by ' + NAME[d][1] + ' adds 1 to the numerator each time.', meta: { k: 'fr4-count-fill', d: d } };
      }],
      [2, 'order', function () {
        var d = R.pick([2, 3, 4, 5]), cs = [];
        while (cs.length < 4) { var c = R.int(1, d * 3); if (cs.indexOf(c) < 0) cs.push(c); }
        cs.sort(function (a, b) { return a - b; });
        return { q: 'Put these in order from <b>least to greatest</b>.', type: 'order', items: cs.map(function (c) { return asMixed(c, d); }), first: 'least', last: 'greatest',
          hint: 'Change them all to ' + NAME[d][1] + ' first. ' + d + ' ' + NAME[d][1] + ' make 1 whole.', steps: ['In ' + NAME[d][1] + ': ' + cs.map(function (c) { return c + '/' + d; }).join(', ') + '.'],
          explain: 'In order: ' + cs.map(function (c) { return c + '/' + d; }).join(', ') + '.', meta: { k: 'fr4-count-order', d: d } };
      }]
    ],
    'fr4-unit': [
      [1, 'fill', function () {
        var d = R.pick(DEN), n = R.int(2, Math.min(d - 1, 6)), sum = [];
        for (var i = 0; i < n; i++) sum.push(fr(1, d));
        return { q: 'Add the unit fractions.', type: 'fill', fill: sum.join(' + ') + ' = [[]] / ' + d, answers: [n], fig: bar(n, d, 360),
          hint: 'Count the pieces. They are all ' + NAME[d][1] + '.', steps: ['There are ' + n + ' pieces of ' + fr(1, d) + '.', 'So the sum is ' + fr(n, d) + '.'],
          explain: n + ' &times; ' + fr(1, d) + ' = ' + fr(n, d) + '.', meta: { k: 'fr4-unit-fill', d: d } };
      }],
      [1, 'match', function () {
        var d = R.pick([5, 6, 8, 10]), ns = R.shuffle([2, 3, 4]), pairs = ns.map(function (n) { return [n + ' &times; ' + fr(1, d), fr(n, d)]; });
        return { q: 'Match each multiplication to its fraction.', type: 'match', pairs: pairs, hint: 'n copies of ' + fr(1, d) + ' make n ' + NAME[d][1] + '.',
          steps: ['The number of copies becomes the numerator. The denominator stays ' + d + '.'], explain: pairs.map(function (p) { return H(p[0]) + ' = ' + H(p[1]); }).join('. ') + '.', meta: { k: 'fr4-unit-match', pairs: pairs } };
      }],
      [2, 'story', function () {
        var d = R.pick([2, 3, 4]), n = R.int(2, 9), p = who();
        return { q: p + ' uses ' + fr(1, d) + ' cup of flour for each pancake. ' + p + ' uses <b>' + asMixed(n, d) + '</b> cups in all. How many pancakes is that?', type: 'num', answer: n,
          hint: 'How many ' + NAME[d][1] + ' are in ' + H(asMixed(n, d)) + '?', steps: ['Each pancake uses 1 ' + NAME[d][0] + '.', H(asMixed(n, d)) + ' = ' + n + '/' + d + ', so ' + n + ' pancakes.'],
          explain: n + ' &times; ' + fr(1, d) + ' = ' + n + '/' + d + '. That is ' + n + ' pancakes.', meta: { k: 'fr4-unit-story', n: n, d: d } };
      }]
    ]
  };
  /* fraction html as plain text, e.g. "2 3/4", for steps and explanations */
  function H(html) { return String(html).replace(/<span class="fr"[^>]*><sup>(\d+)<\/sup><sub>(\d+)<\/sub><\/span>/g, '$1/$2'); }
  K.shapes('fractions', SHAPES);
})();
