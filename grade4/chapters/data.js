(function () {
  var A = Atlas, R = A.R;
  var C1 = 'var(--strand)', C2 = 'var(--btn)';
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }
  function sorted(a) { return a.slice().sort(function (x, y) { return x - y; }); }
  function median(a) { var s = sorted(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
  function modes(a) {
    var c = {}, best = 0, out = [];
    a.forEach(function (x) { c[x] = (c[x] || 0) + 1; best = Math.max(best, c[x]); });
    if (best < 2) return [];
    Object.keys(c).forEach(function (k) { if (c[k] === best) out.push(+k); });
    return out.sort(function (x, y) { return x - y; });
  }
  /* stem-and-leaf plot as an html table; hl lists values to highlight */
  function stemLeaf(data, hl) {
    var s = sorted(data), stems = {}, lo = Math.floor(s[0] / 10), hi = Math.floor(s[s.length - 1] / 10), h = '<div class="tbl"><table class="sl"><thead><tr><th>Stem (tens)</th><th class="l">Leaf (ones)</th></tr></thead><tbody>';
    s.forEach(function (x) { var k = Math.floor(x / 10); (stems[k] = stems[k] || []).push(x % 10); });
    for (var k = lo; k <= hi; k++) {
      h += '<tr><td class="tb">' + k + '</td><td class="l">' + (stems[k] || []).map(function (l) {
        var v = k * 10 + l;
        return '<span class="leaf' + (hl && hl.indexOf(v) >= 0 ? ' on' : '') + '">' + l + '</span>';
      }).join('') + '</td></tr>';
    }
    return h + '</tbody></table></div><p class="t2" style="font-size:.9rem;margin:.2em 0">Key: 3 | 5 means 35</p>';
  }
  /* double bar graph: cats, two series, names */
  function dbar(cats, a, b, na, nb, title) {
    var mx = Math.max.apply(null, a.concat(b)), top = Math.max(5, Math.ceil(mx / 5) * 5), step = top <= 10 ? 1 : top <= 20 ? 2 : 5, W = 540, H = 200, x0 = 50, gw = (W - x0 - 10) / cats.length, bw = Math.min(40, gw / 2 - 8), s = '';
    s += '<text x="' + (W / 2) + '" y="18" text-anchor="middle" font-size="18" class="tb">' + title + '</text>';
    for (var v = 0; v <= top; v += step) {
      var y = 40 + H - v / top * H;
      s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (W - 10) + '" y2="' + y + '" style="stroke:var(--line)"/><text x="' + (x0 - 6) + '" y="' + (y + 5) + '" text-anchor="end" font-size="16" class="t2">' + v + '</text>';
    }
    cats.forEach(function (c, i) {
      var gx = x0 + i * gw + gw / 2;
      [[a[i], C1, -1], [b[i], C2, 1]].forEach(function (p) {
        var h = p[0] / top * H, x = p[2] < 0 ? gx - bw - 2 : gx + 2;
        s += '<rect x="' + x + '" y="' + (40 + H - h) + '" width="' + bw + '" height="' + h + '" style="fill:' + p[1] + ';stroke:var(--ink)" stroke-width="1.5"/>';
      });
      s += '<text x="' + gx + '" y="' + (40 + H + 22) + '" text-anchor="middle" font-size="16">' + c + '</text>';
    });
    s += '<line x1="' + x0 + '" y1="' + (40 + H) + '" x2="' + (W - 10) + '" y2="' + (40 + H) + '" style="stroke:var(--ink)" stroke-width="2"/>';
    s += '<rect x="' + (x0 + 10) + '" y="' + (40 + H + 36) + '" width="16" height="16" style="fill:' + C1 + '"/><text x="' + (x0 + 32) + '" y="' + (40 + H + 50) + '" font-size="16">' + na + '</text>' +
      '<rect x="' + (x0 + 200) + '" y="' + (40 + H + 36) + '" width="16" height="16" style="fill:' + C2 + '"/><text x="' + (x0 + 222) + '" y="' + (40 + H + 50) + '" font-size="16">' + nb + '</text>';
    return A.svg(W, 40 + H + 60, s, title + '. ' + cats.map(function (c, i) { return c + ': ' + na + ' ' + a[i] + ', ' + nb + ' ' + b[i]; }).join('; '));
  }
  /* towers of cubes with a dashed line at the mean */
  function towers(data, showMean) {
    var mx = Math.max.apply(null, data.concat([1])), u = Math.min(22, 200 / mx), bw = Math.min(46, 460 / data.length - 8), W = 40 + data.length * (bw + 8), H = mx * u + 40, s = '', m = sum(data) / data.length;
    data.forEach(function (v, i) {
      var x = 30 + i * (bw + 8);
      for (var k = 0; k < v; k++) s += '<rect x="' + x + '" y="' + (H - 26 - (k + 1) * u) + '" width="' + bw + '" height="' + (u - 1) + '" rx="2" style="fill:' + (showMean && k >= m ? C2 : C1) + ';stroke:var(--ink)" stroke-width="1"/>';
      s += '<text x="' + (x + bw / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="17" class="tb">' + v + '</text>';
    });
    if (showMean) s += '<line x1="20" y1="' + (H - 26 - m * u) + '" x2="' + (W - 4) + '" y2="' + (H - 26 - m * u) + '" style="stroke:var(--ink)" stroke-width="2.5" stroke-dasharray="7 5"/><text x="22" y="' + (H - 32 - m * u) + '" font-size="16" class="tb">mean ' + A.clean(m) + '</text>';
    return A.svg(W, H, s, 'Towers of cubes: ' + data.join(', ') + (showMean ? '. The mean is ' + A.clean(m) + '.' : ''));
  }
  /* probability line with an arrow at value p (0..1) */
  function probLine(p, label) {
    var x0 = 30, x1 = 530, s = '';
    s += '<defs><linearGradient id="dapg" x1="0" x2="1"><stop offset="0" style="stop-color:color-mix(in srgb,var(--strand) 8%,var(--card))"/><stop offset="1" style="stop-color:color-mix(in srgb,var(--strand) 55%,var(--card))"/></linearGradient></defs>';
    s += '<rect x="' + x0 + '" y="40" width="' + (x1 - x0) + '" height="22" rx="11" style="fill:url(#dapg);stroke:var(--ink)" stroke-width="1.5"/>';
    [[0, 'impossible'], [0.25, 'unlikely'], [0.5, 'equally likely'], [0.75, 'likely'], [1, 'certain']].forEach(function (k, i) {
      var x = x0 + (x1 - x0) * k[0];
      s += '<line x1="' + x + '" y1="34" x2="' + x + '" y2="68" style="stroke:var(--ink)" stroke-width="2"/><text x="' + Math.min(Math.max(x, 50), 510) + '" y="' + (i % 2 ? 108 : 88) + '" text-anchor="middle" font-size="16">' + k[1] + '</text>';
    });
    if (p !== undefined && p !== null) {
      var px = x0 + (x1 - x0) * p;
      s += '<polygon points="' + px + ',36 ' + (px - 10) + ',14 ' + (px + 10) + ',14" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    }
    return A.svg(560, 116, s, label || 'Probability line from impossible to certain');
  }
  /* spinner with n sections, k of them red (the rest blue) */
  function spinner(k, n, ang) {
    var cx = 90, cy = 90, r = 80, s = '';
    for (var i = 0; i < n; i++) {
      var a0 = -Math.PI / 2 + 2 * Math.PI * i / n, a1 = -Math.PI / 2 + 2 * Math.PI * (i + 1) / n;
      if (n === 1) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" style="fill:' + (k ? C2 : C1) + ';stroke:var(--ink)" stroke-width="2"/>';
      else s += '<path d="M' + cx + ' ' + cy + ' L' + (cx + r * Math.cos(a0)).toFixed(1) + ' ' + (cy + r * Math.sin(a0)).toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(a1)).toFixed(1) + ' ' + (cy + r * Math.sin(a1)).toFixed(1) + ' Z" style="fill:' + (i < k ? C2 : C1) + ';stroke:var(--ink)" stroke-width="2"/>';
    }
    ang = ang === undefined ? 30 : ang;
    s += '<g transform="rotate(' + ang + ' ' + cx + ' ' + cy + ')"><polygon points="' + cx + ',' + (cy - 64) + ' ' + (cx - 7) + ',' + cy + ' ' + (cx + 7) + ',' + cy + '" style="fill:var(--ink)"/></g><circle cx="' + cx + '" cy="' + cy + '" r="7" style="fill:var(--card);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(180, 180, s, 'Spinner with ' + n + ' equal sections: ' + k + ' orange and ' + (n - k) + ' green');
  }
  function word(k, n) { return k === 0 ? 'impossible' : k === n ? 'certain' : 2 * k === n ? 'equally likely' : 2 * k < n ? 'unlikely' : 'likely'; }
  /* a data set with a whole-number mean */
  function wholeMeanSet(n, lo, hi) {
    var d;
    do { d = []; for (var i = 0; i < n; i++) d.push(R.int(lo, hi)); } while (sum(d) % n);
    return d;
  }

  var gen = {
    kind: function (lv) {
      var qual = ['What is your favourite season?', 'What colour is your backpack?', 'Which sport do you play?', 'What kind of pet do you have?', 'Which fruit do you like best?'];
      var quan = ['How many siblings do you have?', 'How tall are you, in centimetres?', 'How many minutes do you read each day?', 'How many pets do you have?', 'What is your shoe size?'];
      if (lv === 3) {
        var o3 = R.mc('A stem-and-leaf plot', ['A pictograph of favourite colours', 'A Venn diagram', 'A bar graph of pet types']);
        return { q: 'A class measured how many seconds each student could balance on one foot: 23, 35, 41, 38, 27, 45, 31. Which display shows every value and keeps them in order?', type: 'mc', options: o3.options, answer: o3.answer,
          hint: 'The data are two-digit numbers. Which display splits numbers into tens and ones?', steps: ['The data are numbers (quantitative), with tens and ones.', 'A stem-and-leaf plot keeps every value and puts them in order.'], explain: 'A stem-and-leaf plot shows every value, sorted by tens.' };
      }
      var isQual = R.int(0, 1) === 1, q = isQual ? R.pick(qual) : R.pick(quan);
      var o = R.mc(isQual ? 'Qualitative: words or categories' : 'Quantitative: numbers', [isQual ? 'Quantitative: numbers' : 'Qualitative: words or categories']);
      return { q: 'A survey asks: <b>"' + q + '"</b> What kind of data will it collect?', type: 'mc', options: o.options, answer: o.answer,
        hint: 'Will the answers be numbers you can count or measure, or words?', steps: ['Think of a typical answer.', isQual ? 'The answer is a word, like a name or colour.' : 'The answer is a number.', isQual ? 'Words and categories are qualitative data.' : 'Counts and measures are quantitative data.'], explain: isQual ? 'The answers are words, so the data are qualitative.' : 'The answers are numbers, so the data are quantitative.' };
    },
    stem: function (lv) {
      var n = lv === 1 ? 7 : 9, d = [];
      for (var i = 0; i < n; i++) d.push(R.int(lv === 1 ? 10 : 20, lv === 1 ? 39 : 59));
      var s = sorted(d), ask = lv === 1 ? R.pick(['least', 'greatest', 'count']) : lv === 2 ? R.pick(['range', 'between']) : 'median';
      var a, q, steps, stem = Math.floor(s[Math.floor(n / 2)] / 10);
      if (ask === 'least') { a = s[0]; q = 'What is the <b>least</b> value?'; steps = ['The least value is in the top row, first leaf.', 'Stem ' + Math.floor(a / 10) + ', leaf ' + a % 10 + ': ' + a + '.']; }
      else if (ask === 'greatest') { a = s[n - 1]; q = 'What is the <b>greatest</b> value?'; steps = ['The greatest value is in the bottom row, last leaf.', 'Stem ' + Math.floor(a / 10) + ', leaf ' + a % 10 + ': ' + a + '.']; }
      else if (ask === 'count') { a = s.filter(function (x) { return Math.floor(x / 10) === stem; }).length; q = 'How many values are in the ' + stem + '0s?'; steps = ['Find the row with stem ' + stem + '.', 'Count its leaves: ' + a + '.']; }
      else if (ask === 'range') { a = s[n - 1] - s[0]; q = 'What is the <b>range</b> (greatest minus least)?'; steps = ['Least: ' + s[0] + '. Greatest: ' + s[n - 1] + '.', s[n - 1] + ' &minus; ' + s[0] + ' = ' + a + '.']; }
      else if (ask === 'between') { var lo2 = stem * 10; a = s.filter(function (x) { return x >= lo2 && x < lo2 + 10; }).length; q = 'How many values are from ' + lo2 + ' to ' + (lo2 + 9) + '?'; steps = ['Those are the leaves in the row with stem ' + stem + '.', 'Count them: ' + a + '.']; }
      else { a = median(d); q = 'What is the <b>median</b> (middle value)?'; steps = ['The leaves are already in order. There are ' + n + ' values.', 'The middle one is the ' + ((n + 1) / 2) + 'th value.', 'Count to it: ' + a + '.' + stemLeaf(d, [a])]; }
      return { q: 'Use the stem-and-leaf plot. ' + q, type: 'num', answer: a, fig: stemLeaf(d), hint: 'Each row is a tens digit (stem). Each leaf is a ones digit. Stem 3, leaf 5 means 35.', steps: steps, explain: 'The answer is ' + a + '.' };
    },
    graph: function (lv) {
      var cats = R.pick([['Spring', 'Summer', 'Fall', 'Winter'], ['Soccer', 'Hockey', 'Swim', 'Dance'], ['Apple', 'Banana', 'Grape', 'Pear']]);
      var a = cats.map(function () { return R.int(1, 10); }), b = cats.map(function () { return R.int(1, 10); });
      var i = R.int(0, 3), fig = dbar(cats, a, b, 'Grade 4', 'Grade 5', 'Favourites in two classes');
      if (lv === 1) return { q: 'How many Grade 5 students chose <b>' + cats[i] + '</b>?', type: 'num', answer: b[i], fig: fig, hint: 'Find the orange bar above ' + cats[i] + '. Read across to the scale.', steps: ['Grade 5 bars are orange.', 'The orange ' + cats[i] + ' bar reaches ' + b[i] + '.'], explain: b[i] + ' Grade 5 students chose ' + cats[i] + '.' };
      if (lv === 2) {
        while (a[i] === b[i]) b[i] = R.int(1, 10);
        fig = dbar(cats, a, b, 'Grade 4', 'Grade 5', 'Favourites in two classes');
        return { q: 'For <b>' + cats[i] + '</b>, how many more students chose it in one class than the other?', type: 'num', answer: Math.abs(a[i] - b[i]), fig: fig, hint: 'Read both bars for ' + cats[i] + ', then subtract.', steps: ['Grade 4: ' + a[i] + '. Grade 5: ' + b[i] + '.', Math.max(a[i], b[i]) + ' &minus; ' + Math.min(a[i], b[i]) + ' = ' + Math.abs(a[i] - b[i]) + '.'], explain: 'The difference is ' + Math.abs(a[i] - b[i]) + '.' };
      }
      var tot = sum(a.concat(b)), ci = 0, best = 0;
      cats.forEach(function (c, k) { if (a[k] + b[k] > best) { best = a[k] + b[k]; ci = k; } });
      var tie = cats.filter(function (c, k) { return a[k] + b[k] === best; }).length > 1;
      if (tie) { a[ci]++; best++; fig = dbar(cats, a, b, 'Grade 4', 'Grade 5', 'Favourites in two classes'); }
      var o = R.mc(cats[ci], cats.filter(function (c) { return c !== cats[ci]; }));
      return { q: 'Both classes are planning one shared event. Which choice is the most popular when you add both classes?', type: 'mc', options: o.options, answer: o.answer, fig: fig,
        hint: 'Add the two bars for each choice.', steps: [cats.map(function (c, k) { return c + ': ' + a[k] + ' + ' + b[k] + ' = ' + (a[k] + b[k]); }).join('. ') + '.', 'The biggest total is ' + cats[ci] + ' with ' + best + '.'], explain: cats[ci] + ' has the biggest total, ' + best + '.' };
    },
    mmm: function (lv) {
      var n = lv === 1 ? 5 : R.pick([5, 6, 7]), d = lv === 3 ? wholeMeanSet(n, 2, 12) : wholeMeanSet(n, 1, 9);
      var which = lv === 1 ? R.pick(['mode', 'median']) : lv === 2 ? R.pick(['median', 'mean']) : 'mean';
      if (which === 'mode') { var mo = modes(d); while (mo.length !== 1) { d = wholeMeanSet(n, 1, 9); mo = modes(d); } }
      if (which === 'median' && n % 2 === 0) { d.push(R.int(1, 9)); n++; }
      var s = sorted(d), ans, steps;
      if (which === 'mode') { ans = modes(d)[0]; steps = ['Sort: ' + s.join(', ') + '.', 'The value that appears most often is ' + ans + '.']; }
      else if (which === 'median') { ans = median(d); steps = ['Sort: ' + s.join(', ') + '.', 'There are ' + n + ' values. The middle one is number ' + ((n + 1) / 2) + ': ' + ans + '.']; }
      else { ans = sum(d) / n; steps = ['Add them all: ' + d.join(' + ') + ' = ' + sum(d) + '.', 'Divide by how many there are: ' + sum(d) + ' &divide; ' + n + ' = ' + ans + '.<div class="fig">' + towers(d, true) + '</div>', 'The mean is ' + ans + '. If the towers were levelled out, each would be ' + ans + ' tall.']; }
      var ctx = 'Goals scored in ' + n + ' games: ' + d.join(', ') + '.';
      return { q: ctx + ' What is the <b>' + which + '</b>?', type: 'num', answer: ans, fig: lv === 1 ? towers(d) : '',
        hint: which === 'mode' ? 'The mode is the value that appears most often.' : which === 'median' ? 'Put the values in order. The median is the middle one.' : 'Add all the values, then divide by how many values there are.', steps: steps, explain: 'The ' + which + ' is ' + ans + '.' };
    },
    prob: function (lv) {
      var n = R.pick([4, 6, 8]), k = R.int(0, n);
      if (lv === 3) {
        var a = R.int(1, n - 1), b;
        do { b = R.int(1, n - 1); } while (b === a);
        var o3 = R.mc(a > b ? 'Spinner A' : 'Spinner B', [a > b ? 'Spinner B' : 'Spinner A', 'They are equally likely']);
        return { q: 'You win if you land on orange. Which spinner gives you a better chance?', type: 'mc', options: o3.options, answer: o3.answer,
          fig: '<div class="vrow"><figure><figcaption>Spinner A</figcaption>' + spinner(a, n, 200) + '</figure><figure><figcaption>Spinner B</figcaption>' + spinner(b, n, 200) + '</figure></div>',
          hint: 'Both spinners have ' + n + ' equal sections. Count the orange sections on each.', steps: ['Spinner A has ' + a + ' orange of ' + n + '. Spinner B has ' + b + ' orange of ' + n + '.', 'More orange sections means a better chance.'], explain: (a > b ? 'Spinner A' : 'Spinner B') + ' has more orange sections.' };
      }
      var w = word(k, n), o = R.mc(w, ['impossible', 'unlikely', 'equally likely', 'likely', 'certain'].filter(function (x) { return x !== w; }).sort(function () { return Math.random() - 0.5; }).slice(0, 3));
      return { q: 'The spinner has ' + n + ' equal sections. How likely is it to land on <b>orange</b>?', type: 'mc', options: o.options, answer: o.answer, fig: spinner(k, n, 200),
        hint: 'Count the orange sections. Compare with half of ' + n + ', which is ' + n / 2 + '.', steps: ['Orange sections: ' + k + ' out of ' + n + '.', k === 0 ? 'No orange at all: impossible.' : k === n ? 'All orange: certain.' : k * 2 === n ? 'Exactly half: equally likely.' : k * 2 < n ? 'Less than half: unlikely.' : 'More than half: likely.', '<div class="fig">' + probLine(k / n) + '</div>'], explain: k + ' of ' + n + ' sections are orange, so it is ' + w + '.' };
    },
    pop: function (lv) {
      var items = [
        { q: 'A Grade 1 class and a Grade 8 class each measure their heights. Will the two classes probably have the same median height?', a: 'No, the Grade 8 median will probably be greater', w: ['Yes, they will be the same', 'No, the Grade 1 median will probably be greater'], e: 'Older students are usually taller, so the Grade 8 median is likely greater.' },
        { q: 'Two Grade 4 classes in the same school count the letters in their first names. Will the means be about the same?', a: 'Probably close, but maybe not exactly the same', w: ['They must be exactly the same', 'One will be about double the other'], e: 'The groups are similar, so the means are likely close, but real data vary.' },
        { q: 'A town counts how many hours of daylight it has each day in June and in December. Will the mode be the same for both months?', a: 'No, June days are longer in Canada', w: ['Yes, every month is the same', 'No, December days are longer in Canada'], e: 'In Canada, June has much more daylight than December.' }
      ], it = R.pick(items), o = R.mc(it.a, it.w);
      if (lv >= 2) {
        var d = wholeMeanSet(5, 2, 9), add = R.int(10, 20), d2 = d.concat([add]);
        var o2 = R.mc('The mean goes up', ['The mean goes down', 'The mean stays the same']);
        return { q: 'The data are ' + d.join(', ') + '. A new value, ' + add + ', is added. What happens to the mean?', type: 'mc', options: o2.options, answer: o2.answer, fig: towers(d, true),
          hint: 'Is the new value bigger or smaller than the mean, ' + sum(d) / 5 + '?', steps: ['The mean now is ' + sum(d) / 5 + '.', add + ' is bigger than the mean, so it pulls the mean up.', 'New mean: ' + sum(d2) + ' &divide; 6 = ' + A.clean(Math.round(sum(d2) / 6 * 10) / 10) + '.'], explain: 'A value bigger than the mean makes the mean go up.' };
      }
      return { q: it.q, type: 'mc', options: o.options, answer: o.answer, hint: 'Think about how the two groups are different.', steps: [it.e], explain: it.e };
    }
  };

  /* ---------- one idea at a time ---------- */
  var K = A.kit;
  function T(name, lv) { return function () { return gen[name](lv); }; }
  var SURVEY = [['Favourite season?', 0], ['How many siblings?', 1], ['Colour of your backpack?', 0], ['Minutes read each day?', 1], ['Height in centimetres?', 1], ['Favourite sport?', 0]];
  function surveyFig(st) {
    var s = '';
    SURVEY.forEach(function (q, i) {
      var y = 4 + i * 50, on = st.lit[i];
      s += '<g data-k="' + i + '"><rect x="4" y="' + y + '" width="400" height="42" rx="12" style="fill:' + (on ? 'color-mix(in srgb,var(--strand) 30%,var(--card))' : 'var(--card)') + ';stroke:' + (on ? 'var(--strand)' : 'var(--line)') + '" stroke-width="2.5"/><text x="20" y="' + (y + 28) + '" font-size="19"' + (on ? ' class="tb"' : '') + '>' + q[0] + '</text></g>';
    });
    return A.svg(408, SURVEY.length * 50, s, 'Six survey questions. Tap the ones whose answers are numbers.');
  }
  var CATS = ['Soccer', 'Hockey', 'Swim', 'Dance'], G4 = [6, 4, 8, 3];

  var LESSONS = [
    { id: 'collect', title: 'Data and displays', sub: 'Kinds of data, and a plot that keeps every value.', concepts: [
      { id: 'kinds', title: 'Words or numbers?', exp: ['D1.1'], skill: 'da4-kind',
        body: '<p><b>Qualitative</b> data are words or categories: favourite colour. <b>Quantitative</b> data are numbers you count or measure: how many pets.</p>',
        watch: K.watch([
          ['"What is your favourite season?" Answers like <i>summer</i>: words. <b>Qualitative</b>.', '<p class="big">"Summer", "Winter", "Fall"</p>', 2200],
          ['"How many siblings do you have?" Answers like <i>2</i>: numbers. <b>Quantitative</b>.', '<p class="big">0, 2, 1, 3</p>', 2200]
        ]),
        try: K.tap({ render: surveyFig, label: function (st) { return '<p>' + st.order.length + ' chosen</p>'; },
          tasks: [{ do: 'Tap every question whose answers are <b>numbers</b>.', goal: function (st) { return SURVEY.every(function (q, i) { return !!st.lit[i] === !!q[1]; }); }, yes: 'Siblings, minutes and height are counts or measures: quantitative.' }] }),
        key: '<p>Words or categories: <b>qualitative</b>. Counts or measures: <b>quantitative</b>.</p>',
        check: [T('kind', 1), T('kind', 2)] },

      { id: 'stem-leaf', title: 'Stem-and-leaf plots', exp: ['D1.2', 'D1.6'], skill: 'da4-stem', hard: true,
        body: '<p>A <b>stem-and-leaf plot</b> splits each number: the tens are the <b>stem</b>, the ones are the <b>leaf</b>. Every value is kept, in order.</p>',
        watch: K.watch([
          ['Seconds balancing on one foot: 23, 35, 41, 38, 27.', '<p class="math big">23, 35, 41, 38, 27</p>', 1800],
          ['23: stem 2, leaf 3. 27: stem 2, leaf 7.', stemLeaf([23, 27]), 1800],
          ['35 and 38 go on stem 3.', stemLeaf([23, 27, 35, 38]), 1800],
          ['41 goes on stem 4. Least: 23. Greatest: 41.', stemLeaf([23, 27, 35, 38, 41], [23, 41]), 2400]
        ]),
        ways: [
          { label: 'Like a bar graph on its side', html: '<p>Turn your head: each row of leaves is a bar. The longest row shows where most of the values are.</p>' + stemLeaf([12, 15, 21, 23, 24, 27, 29, 33, 36]) },
          { label: 'Read it back', html: '<p>Put each stem in front of each of its leaves. Stem 2 with leaves 1, 3, 4 is <b>21, 23, 24</b>.</p>' }
        ],
        key: '<p><b>Stem = tens, leaf = ones.</b> Leaves go in order.</p>',
        mistake: '<p>Reading only the leaves (a leaf 5 on stem 3 read as 5, not 35), or forgetting rows with no leaves. Have your child read a value back aloud.</p>',
        check: [T('stem', 1), T('stem', 2), T('stem', 3)] }
    ] },

    { id: 'graphs', title: 'Double bar graphs', sub: 'Compare two groups side by side.', concepts: [
      { id: 'double-bar', title: 'Two groups, one graph', exp: ['D1.3', 'D1.6'], skill: 'da4-graph',
        body: '<p>A <b>double bar graph</b> puts two groups side by side. The <b>legend</b> tells which colour is which group.</p>',
        watch: K.watch([
          ['Grade 4 favourite sports.', dbar(CATS, G4, [0, 0, 0, 0], 'Grade 4', 'Grade 5', 'Favourite sports'), 1800],
          ['Add Grade 5 beside them. Now compare: Grade 4 likes Swim more; Grade 5 likes Hockey more.', dbar(CATS, G4, [5, 9, 6, 4], 'Grade 4', 'Grade 5', 'Favourite sports'), 2600]
        ]),
        try: K.lab({ controls: CATS.map(function (c, i) { return { id: 'b' + i, label: 'Grade 5: ' + c, min: 0, max: 10, value: [5, 2, 6, 1][i] }; }),
          render: function (s) { s.b = [s.b0, s.b1, s.b2, s.b3]; return { fig: dbar(CATS, G4, s.b, 'Grade 4', 'Grade 5', 'Favourite sports'), out: '' }; },
          tasks: [
            { do: 'Make Grade 5 choose Dance exactly <b>3 more</b> than Grade 4.', goal: function (s) { return s.b[3] === G4[3] + 3; }, yes: 'Grade 4: 3. Grade 5: 6.' },
            { do: 'Make <b>Hockey</b> the most popular when you add both classes.', goal: function (s) { var t = s.b.map(function (v, i) { return v + G4[i]; }); return t[1] > t[0] && t[1] > t[2] && t[1] > t[3]; }, yes: 'Hockey has the biggest total.' }
          ] }),
        key: '<p>Check the <b>legend</b>, then read each bar across to the scale.</p>',
        check: [T('graph', 1), T('graph', 2), T('graph', 3)] }
    ] },

    { id: 'average', title: 'Mean, median and mode', sub: 'Three ways to describe a typical value.', concepts: [
      { id: 'median-mode', title: 'Median and mode', exp: ['D1.5'], skill: 'da4-mmm',
        body: '<p>The <b>median</b> is the middle value when the data are in order. The <b>mode</b> is the value that appears most often.</p>',
        watch: K.watch([
          ['Goals in 5 games: 3, 7, 2, 3, 5.', towers([3, 7, 2, 3, 5]), 1600],
          ['Put them in order: 2, 3, 3, 5, 7.', towers([2, 3, 3, 5, 7]), 1800],
          ['The middle one is <b>3</b>: the median. 3 also appears most often: the mode is <b>3</b>.', towers([2, 3, 3, 5, 7]) + '<p class="math big">2, 3, <b>3</b>, 5, 7</p>', 2400]
        ]),
        try: K.lab({ controls: [0, 1, 2, 3, 4].map(function (i) { return { id: 'v' + i, label: 'Game ' + (i + 1), min: 1, max: 9, value: [3, 7, 2, 3, 5][i] }; }),
          render: function (s) { var d = [s.v0, s.v1, s.v2, s.v3, s.v4], mo = modes(d); s.med = median(d); s.mo = mo; return { fig: towers(d), out: '<p class="math">In order: ' + sorted(d).join(', ') + '</p><p>Median: <b>' + s.med + '</b>. Mode: <b>' + (mo.length ? mo.join(' and ') : 'none') + '</b></p>' }; },
          tasks: [
            { do: 'Make the <b>median 6</b>.', goal: function (s) { return s.med === 6; }, yes: '6 is in the middle when sorted.' },
            { do: 'Make the <b>mode 8</b>, the only mode.', goal: function (s) { return s.mo.length === 1 && s.mo[0] === 8; }, yes: '8 appears most often.' }
          ] }),
        key: '<p><b>Median: middle in order. Mode: most often.</b></p>',
        mistake: '<p>Finding the middle without sorting first. Ask: "Are they in order yet?"</p>',
        check: [T('mmm', 1), T('mmm', 1)] },

      { id: 'mean', title: 'The mean: level it out', exp: ['D1.5'], skill: 'da4-mmm', hard: true,
        body: '<p>The <b>mean</b> is what each value would be if you shared everything out equally. Add all the values, then divide by how many there are.</p>',
        watch: K.watch([
          ['Towers of 2, 6, 4, 8, 5.', towers([2, 6, 4, 8, 5]), 1600],
          ['Total: 25 cubes. 5 towers.', towers([2, 6, 4, 8, 5], true), 2000],
          ['Share them out: every tower is <b>5</b>. 25 &divide; 5 = 5: the mean.', towers([5, 5, 5, 5, 5]), 2400]
        ]),
        try: K.lab({ controls: [0, 1, 2, 3, 4].map(function (i) { return { id: 'v' + i, label: 'Tower ' + (i + 1), min: 1, max: 9, value: [2, 6, 4, 8, 5][i] }; }),
          render: function (s) { var d = [s.v0, s.v1, s.v2, s.v3, s.v4]; s.d = d; s.sum = sum(d); return { fig: towers(d, true), out: '<p class="math">' + d.join(' + ') + ' = ' + s.sum + '. ' + s.sum + ' &divide; 5 = <b>' + A.clean(Math.round(s.sum / 5 * 10) / 10) + '</b></p>' }; },
          tasks: [
            { do: 'Make the mean exactly <b>6</b>.', goal: function (s) { return s.sum === 30; }, yes: 'Total 30, shared by 5 = 6.' },
            { do: 'Make the mean <b>4</b> with <b>no</b> tower of 4.', goal: function (s) { return s.sum === 20 && s.d.indexOf(4) < 0; }, yes: 'The mean does not have to be one of the values.' }
          ] }),
        ways: [
          { label: 'Move cubes', html: '<p>Take cubes from tall towers and give them to short ones until all are the same. That height is the mean. 2, 6, 4, 8, 5: move 3 from the 8 to the 2, 1 from the 6 to the 4. All 5.</p>' },
          { label: 'Fair share', html: '<p>Five friends have $2, $6, $4, $8 and $5. Put it all in one pile: $25. Share it fairly: $5 each. That is the mean.</p>' }
        ],
        key: '<p><b>Mean = total &divide; how many.</b></p>',
        mistake: '<p>Dividing by the wrong number (by the biggest value, or forgetting to divide). Ask: "How many towers are sharing?"</p>',
        check: [T('mmm', 2), T('mmm', 3)] }
    ] },

    { id: 'chance', title: 'Chance and predictions', sub: 'How likely, and what to expect.', concepts: [
      { id: 'likely', title: 'How likely is it?', exp: ['D2.1'], skill: 'da4-prob',
        body: '<p>Chance goes from <b>impossible</b> to <b>certain</b>. On a spinner with equal sections, more orange sections means orange is more likely.</p>',
        watch: K.watch([0, 1, 4, 6, 8].map(function (k) { return ['Orange: ' + k + ' of 8 sections. <b>' + word(k, 8) + '</b>.', '<div style="display:flex;justify-content:center">' + spinner(k, 8, 200) + '</div>' + probLine(k / 8), 1700]; })),
        try: K.lab({ controls: [
          { id: 'n', label: 'Sections', type: 'select', options: [['4', '4'], ['6', '6'], ['8', '8']] },
          { id: 'k', label: 'Orange', min: 0, max: 8, value: 0 },
          { id: 'spin', label: 'Spin 20 times', type: 'action', act: function (s) { var n = +s.n, k = Math.min(s.k, n), c = 0; for (var i = 0; i < 20; i++) if (Math.random() * n < k) c++; s.res = c; s.ang = Math.floor(Math.random() * 360); } }],
          init: function (s) { s.res = null; s.ang = 200; s.key = ''; },
          render: function (s) { var n = +s.n, k = Math.min(s.k, n), key = n + ',' + k; if (key !== s.key) { s.res = null; s.key = key; } s.w = word(k, n); return { fig: '<div style="display:flex;justify-content:center">' + spinner(k, n, s.ang) + '</div>' + probLine(k / n), out: '<p>Orange is <b>' + s.w + '</b>.' + (s.res !== null ? ' In 20 spins: orange <b>' + s.res + '</b> times.' : '') + '</p>' }; },
          tasks: [
            { do: 'Make orange <b>unlikely</b> but not impossible.', goal: function (s) { return s.w === 'unlikely'; }, yes: 'Fewer than half the sections.' },
            { do: 'Make orange <b>equally likely</b>, then spin 20 times.', goal: function (s) { return s.w === 'equally likely' && s.res !== null; }, yes: function (s) { return 'Orange came up ' + s.res + ' times: close to 10, but chance rarely gives exactly half.'; } }
          ] }),
        key: '<p>Compare the orange sections with <b>half</b>: fewer is unlikely, more is likely.</p>',
        check: [T('prob', 1), T('prob', 2), T('prob', 3)] },

      { id: 'groups', title: 'Predict and compare groups', exp: ['D2.2'], skill: 'da4-pop',
        body: '<p>Use what you know about two groups to <b>predict</b> how their data compare. A very big new value <b>pulls the mean up</b>.</p>',
        watch: K.watch([
          ['Mean of 4, 6, 5, 3, 7 is 5.', towers([4, 6, 5, 3, 7], true), 1800],
          ['Add a 17. The total jumps to 42; 6 values share it. Mean 7.', towers([4, 6, 5, 3, 7, 17], true), 2400]
        ]),
        key: '<p>A value <b>above</b> the mean pulls it up; <b>below</b> pulls it down.</p>',
        mistake: '<p>Expecting two different groups (Grade 1 and Grade 8 heights) to give the same results. Ask: "What do you know about these groups?"</p>',
        check: [T('pop', 1), T('pop', 2)] }
    ] }
  ];

  A.register('data', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Two kinds of data</h2>' +
'<p><b>Data</b> are facts we collect to answer a question. There are two kinds:</p>' +
'<div class="row2"><div class="key" style="margin:0"><b class="t">Qualitative</b><p>Answers are <b>words or categories</b>. "What is your favourite season?" Answers: fall, summer ...</p></div>' +
'<div class="key" style="margin:0"><b class="t">Quantitative</b><p>Answers are <b>numbers</b> you count or measure. "How many books did you read?" Answers: 3, 7 ...</p></div></div>' +
'<p>We organize data in a <b>frequency table</b>. A tally keeps count, and the frequency is the total.</p>' +
'<div class="tbl"><table><thead><tr><th class="l">Favourite season</th><th class="l">Tally</th><th>Frequency</th></tr></thead><tbody>' +
[['Spring', 4], ['Summer', 9], ['Fall', 6], ['Winter', 3]].map(function (r) { var t = '', k = r[1]; while (k >= 5) { t += '<s>||||</s> '; k -= 5; } while (k-- > 0) t += '|'; return '<tr><td class="l">' + r[0] + '</td><td class="l" style="letter-spacing:2px;font-weight:700">' + t + '</td><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
'<p>Data can come from you (a <b>primary</b> source, like your own survey) or from someone else (a <b>secondary</b> source, like a website or a book).</p>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking any answer with a number is quantitative. "What is your favourite number?" gives numbers, but they are names of choices, not amounts. It is really a category question.</p></div>' +
A.yt({ gen: function () { return gen.kind(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Stem-and-leaf plots</h2>' +
'<p>A <b>stem-and-leaf plot</b> sorts numbers by their tens. The <b>stem</b> is the tens digit. Each <b>leaf</b> is a ones digit. It shows every value, in order.</p>' +
'<div class="lab"><span class="lt">Try it: make a stem-and-leaf plot</span>' +
'<div class="ctrl"><label for="dsl" style="flex:1 1 100%">Type numbers from 10 to 99, with commas<input type="text" id="dsl" style="width:100%" value="23, 35, 41, 38, 27, 45, 31, 35, 19"></label></div>' +
'<div id="dslout"></div><div class="out" id="dslsum"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Seconds students balanced on one foot: 23, 35, 41, 38, 27. Stem 2: leaves 3, 7. Stem 3: leaves 5, 8. Stem 4: leaf 1. Read "3 | 8" as 38.</p></div>' +
A.yt({ gen: function () { return gen.stem(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Double bar graphs and choosing a graph</h2>' +
'<p>A <b>double bar graph</b> (a kind of multiple-bar graph) compares two groups side by side. A <b>legend</b> tells which colour is which group. Every graph needs a title, labels and a scale.</p>' +
'<div class="lab"><span class="lt">Try it: build a double bar graph</span>' +
'<div class="ctrl">' + ['Spring', 'Summer', 'Fall', 'Winter'].map(function (c, i) { return '<label for="dg' + i + '">' + c + '<span class="t2" style="font-weight:400">Gr 4 / Gr 5</span><span style="display:flex;gap:4px"><input type="number" id="dg' + i + 'a" min="0" max="20" value="' + [4, 9, 6, 3][i] + '" style="width:4.2em" aria-label="' + c + ' Grade 4"><input type="number" id="dg' + i + 'b" min="0" max="20" value="' + [5, 7, 4, 6][i] + '" style="width:4.2em" aria-label="' + c + ' Grade 5"></span></label>'; }).join('') + '</div>' +
'<div class="fig" id="dgfig"></div><div class="out" id="dgout"></div></div>' +
'<div class="tbl"><table><thead><tr><th class="l">Display</th><th class="l">Best for</th></tr></thead><tbody>' +
'<tr><td class="l">Bar graph</td><td class="l">Comparing categories in one group</td></tr><tr><td class="l">Double bar graph</td><td class="l">Comparing the same categories in two groups</td></tr>' +
'<tr><td class="l">Stem-and-leaf plot</td><td class="l">Showing every number in a set, in order</td></tr><tr><td class="l">Infographic</td><td class="l">Telling a story about data with graphs, numbers, pictures and a few words</td></tr></tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p>An <b>infographic</b> is a poster about one data set. It uses a title, one or two graphs, the most important numbers, and short sentences. Try making one on paper about a class survey.</p></div>' +
A.yt({ gen: function () { return gen.graph(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Mean, median and mode</h2>' +
'<p>Three numbers describe the "middle" of a data set:</p>' +
'<ul><li><b>Mean</b>: add all the values, then divide by how many there are. It is what each value would be if they were all <b>levelled out</b>.</li><li><b>Median</b>: put the values in order. It is the <b>middle</b> one.</li><li><b>Mode</b>: the value that appears <b>most often</b>. A set can have no mode, or more than one.</li></ul>' +
'<div class="lab"><span class="lt">Try it: level the towers</span>' +
'<div class="ctrl"><label for="dmm" style="flex:1 1 100%">Data (whole numbers from 0 to 12, with commas)<input type="text" id="dmm" style="width:100%" value="3, 7, 4, 7, 9"></label></div>' +
'<div class="btnrow"><button type="button" class="btn alt" id="dmmlev" aria-pressed="false">Show the mean line</button></div>' +
'<div class="fig" id="dmmfig"></div><div class="out" id="dmmout"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>Goals in 5 games: 3, 7, 4, 7, 9. In order: 3, 4, 7, 7, 9. <b>Median</b> = 7 (the middle). <b>Mode</b> = 7 (it appears twice). <b>Mean</b> = (3 + 7 + 4 + 7 + 9) &divide; 5 = 30 &divide; 5 = 6.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Finding the median without sorting. In 3, 7, 4, 7, 9 the middle value as written is 4, but the median is 7. Always put the values in order first.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Different groups can give different results. A Grade 1 class and a Grade 8 class will not have the same median height. Before collecting data, predict, then check.</p></div>' +
A.yt({ gen: function () { return gen.mmm(1); } }) +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Probability</h2>' +
'<p><b>Probability</b> is how likely something is to happen. We place events on a <b>probability line</b>, from impossible to certain.</p>' +
'<div class="fig">' + probLine(null) + '</div>' +
'<div class="lab"><span class="lt">Try it: spin the spinner</span>' +
'<div class="ctrl"><label for="dpn">Sections<select id="dpn"><option>4</option><option>6</option><option selected>8</option></select></label><label for="dpk">Orange sections: <output id="dpko"></output><input type="range" id="dpk" min="0" max="8" value="3"></label></div>' +
'<div class="row2"><div class="fig" id="dpspin"></div><div class="out" id="dpword"></div></div><div class="fig" id="dpline"></div>' +
'<div class="btnrow"><button type="button" class="btn" id="dpgo">Spin 20 times</button><button type="button" class="btn alt" id="dpclr">Clear</button></div><div class="out" id="dpres" aria-live="polite"></div></div>' +
'<div class="eg"><b class="t">Worked example</b><p>A spinner has 8 equal sections and 3 are orange. 3 is less than half of 8, so landing on orange is <b>unlikely</b>. Over many spins, expect orange about 3 times out of every 8.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking "unlikely" means "will not happen". Unlikely events still happen sometimes. Spin 20 times and you will probably see some orange.</p></div>' +
A.yt({ gen: function () { return gen.prob(1); } }) +
'</section>',

    init: function (root) {
      var $ = A.$;
      function nums(id, lo, hi) { return ($('#' + id, root).value.match(/\d+/g) || []).map(Number).filter(function (x) { return x >= lo && x <= hi; }).slice(0, 30); }
      function sl() {
        var d = nums('dsl', 10, 99);
        if (!d.length) { $('#dslout', root).innerHTML = ''; $('#dslsum', root).innerHTML = '<p>Type some two-digit numbers.</p>'; return; }
        var med = median(d);
        $('#dslout', root).innerHTML = stemLeaf(d);
        $('#dslsum', root).innerHTML = '<p>' + d.length + ' values. Least: <b>' + sorted(d)[0] + '</b>. Greatest: <b>' + sorted(d)[d.length - 1] + '</b>. Range: ' + (sorted(d)[d.length - 1] - sorted(d)[0]) + '. Median: <b>' + A.clean(med) + '</b>.</p>';
      }
      A.bind(root, ['dsl'], sl);
      function dg() {
        var a = [], b = [];
        for (var i = 0; i < 4; i++) { a.push(Math.max(0, Math.min(20, parseInt($('#dg' + i + 'a', root).value, 10) || 0))); b.push(Math.max(0, Math.min(20, parseInt($('#dg' + i + 'b', root).value, 10) || 0))); }
        var cats = ['Spring', 'Summer', 'Fall', 'Winter'];
        $('#dgfig', root).innerHTML = dbar(cats, a, b, 'Grade 4', 'Grade 5', 'Favourite season');
        var big = 0, bi = 0; cats.forEach(function (c, k) { if (Math.abs(a[k] - b[k]) > big) { big = Math.abs(a[k] - b[k]); bi = k; } });
        $('#dgout', root).innerHTML = '<p>Grade 4 total: ' + sum(a) + '. Grade 5 total: ' + sum(b) + '.</p><p>' + (big ? 'The biggest difference between the classes is for <b>' + cats[bi] + '</b>: ' + big + '.' : 'The classes match in every category.') + '</p>';
      }
      A.bind(root, ['dg0a', 'dg0b', 'dg1a', 'dg1b', 'dg2a', 'dg2b', 'dg3a', 'dg3b'], dg);
      var lev = false;
      function mm() {
        var d = nums('dmm', 0, 12).slice(0, 12);
        if (!d.length) { $('#dmmfig', root).innerHTML = ''; $('#dmmout', root).innerHTML = '<p>Type some whole numbers from 0 to 12.</p>'; return; }
        var mo = modes(d), mean = sum(d) / d.length;
        $('#dmmfig', root).innerHTML = towers(d, lev);
        $('#dmmout', root).innerHTML = '<p>In order: ' + sorted(d).join(', ') + '</p>' +
          '<p><b>Mean</b> = ' + sum(d) + ' &divide; ' + d.length + ' = ' + (mean === Math.round(mean) ? mean : 'about ' + A.clean(Math.round(mean * 10) / 10)) + '. <b>Median</b> = ' + A.clean(median(d)) + (d.length % 2 ? '' : ' (halfway between the two middle values)') + '. <b>Mode</b> = ' + (mo.length ? mo.join(' and ') : 'none, no value repeats') + '.</p>';
        $('#dmmlev', root).setAttribute('aria-pressed', String(lev));
        $('#dmmlev', root).textContent = lev ? 'Hide the mean line' : 'Show the mean line';
      }
      $('#dmmlev', root).addEventListener('click', function () { lev = !lev; mm(); });
      A.bind(root, ['dmm'], mm);
      var tally = { o: 0, p: 0 };
      function sp(ang) {
        var n = +$('#dpn', root).value, r = $('#dpk', root);
        r.max = n; if (+r.value > n) r.value = n;
        var k = +r.value;
        $('#dpko', root).textContent = k;
        $('#dpspin', root).innerHTML = spinner(k, n, ang);
        $('#dpword', root).innerHTML = '<p>Orange: ' + k + ' of ' + n + ' sections.</p><p>Landing on orange is <span class="big">' + word(k, n) + '</span>.</p>';
        $('#dpline', root).innerHTML = probLine(k / n, 'Probability line with the arrow at ' + word(k, n));
      }
      function res() {
        var t = tally.o + tally.p;
        $('#dpres', root).innerHTML = t ? '<p>Results after ' + t + ' spins: <b>orange ' + tally.o + '</b>, green ' + tally.p + '.</p><div class="bar-h" style="max-width:420px"><i style="width:' + (tally.o / t * 100) + '%;background:var(--btn)"></i><i style="width:' + (tally.p / t * 100) + '%;background:var(--strand)"></i></div><p class="t2">The spinner predicts about ' + Math.round(+$('#dpk', root).value / +$('#dpn', root).value * t) + ' orange. Real results are usually close, not exact.</p>' : '';
      }
      $('#dpgo', root).addEventListener('click', function () {
        var n = +$('#dpn', root).value, k = +$('#dpk', root).value, last = 0;
        for (var i = 0; i < 20; i++) { var sec = Math.floor(Math.random() * n); if (sec < k) tally.o++; else tally.p++; last = sec; }
        sp((last + 0.5) * 360 / n);
        res();
      });
      $('#dpclr', root).addEventListener('click', function () { tally = { o: 0, p: 0 }; res(); });
      A.bind(root, ['dpn', 'dpk'], function () { tally = { o: 0, p: 0 }; sp(); res(); });
    },

    quiz: [
      { q: 'A survey asks "How many minutes did you read last night?" What kind of data is this?', type: 'mc', options: ['Quantitative', 'Qualitative'], answer: 0, hint: 'Are the answers numbers or words?', explain: 'The answers are numbers of minutes, so the data are quantitative.' },
      { q: 'Use the plot. How many values are greater than 40?', type: 'num', answer: 3, fig: stemLeaf([23, 35, 41, 38, 27, 45, 31, 47]), hint: 'Look at the row with stem 4.', explain: '41, 45 and 47 are greater than 40.' },
      { q: 'How many more Grade 5 students than Grade 4 students chose Winter?', type: 'num', answer: 3, fig: dbar(['Spring', 'Summer', 'Fall', 'Winter'], [4, 9, 6, 3], [5, 7, 4, 6], 'Grade 4', 'Grade 5', 'Favourite season'), hint: 'Read both Winter bars, then subtract.', explain: 'Grade 5: 6, Grade 4: 3. 6 &minus; 3 = 3.' },
      { q: 'Find the <b>median</b>: 8, 2, 5, 9, 4', type: 'num', answer: 5, hint: 'Put them in order first.', explain: 'In order: 2, 4, 5, 8, 9. The middle value is 5.' },
      { q: 'Find the <b>mean</b>: 6, 2, 7, 5', type: 'num', answer: 5, fig: towers([6, 2, 7, 5]), hint: 'Add them, then divide by 4.', explain: '6 + 2 + 7 + 5 = 20, and 20 &divide; 4 = 5.' },
      { q: 'A spinner has 6 equal sections. 3 are orange. How likely is orange?', type: 'mc', options: ['impossible', 'unlikely', 'equally likely', 'certain'], answer: 2, fig: spinner(3, 6, 200), hint: 'Is 3 more than, less than, or exactly half of 6?', explain: '3 of 6 is exactly half, so it is equally likely.' },
      { q: 'Which display is best for comparing favourite sports in a Grade 4 class and a Grade 6 class?', type: 'mc', options: ['A double bar graph', 'A stem-and-leaf plot', 'A single number'], answer: 0, hint: 'You are comparing the same categories in two groups.', explain: 'A double bar graph puts the two groups side by side for each sport.' }
    ],

    practice: [
      { id: 'da4-kind', name: 'Kinds of data and displays', code: 'D1.1, D1.3', gen: gen.kind },
      { id: 'da4-stem', name: 'Stem-and-leaf plots', code: 'D1.2, D1.6', gen: gen.stem },
      { id: 'da4-graph', name: 'Double bar graphs', code: 'D1.3, D1.6', gen: gen.graph },
      { id: 'da4-mmm', name: 'Mean, median and mode', code: 'D1.5', gen: gen.mmm },
      { id: 'da4-prob', name: 'Probability', code: 'D2.1', gen: gen.prob },
      { id: 'da4-pop', name: 'Predict and compare groups', code: 'D2.2', gen: gen.pop }
    ]
  });

  /* ---------- More ways to ask (question shapes; see docs/QUESTIONS.md) ----------
     q.meta holds the facts that tests/verify/grade4.js uses to work each answer out again. */
  var why = K.why, who = A.Q && A.Q.name;
  var small = K.small;
  var QUAL = ['Which season do you like best?', 'What colour is your backpack?', 'Which sport do you play?', 'What kind of pet do you have?', 'Which fruit do you like best?'];
  var QUAN = ['How many siblings do you have?', 'How tall are you, in centimetres?', 'How many minutes do you read each day?', 'How many pets do you have?', 'How long is your walk to school, in minutes?'];
  var DISPLAYS = [['Favourite colours of 25 students', 'Bar graph'], ['Heights of 20 students, in centimetres', 'Stem-and-leaf plot'], ['Favourite sports in two classes, side by side', 'Double bar graph']];
  function distinctData(n, lo, hi) { var d = []; while (d.length < n) { var v = R.int(lo, hi); if (d.indexOf(v) < 0) d.push(v); } return d; }
  var SHAPES = {
    'da4-kind': [
      [1, 'pick', function () {
        var qn = R.shuffle(QUAN).slice(0, R.int(1, 3)), ql = R.shuffle(QUAL).slice(0, 5 - qn.length), opts = R.shuffle(qn.concat(ql));
        var ans = opts.map(function (o, j) { return qn.indexOf(o) >= 0 ? j : -1; }).filter(function (j) { return j >= 0; });
        return { q: 'Pick every survey question that collects <b>quantitative</b> data (numbers).', type: 'pick', options: opts, answer: ans,
          hint: 'Imagine an answer to each one. Is it a number or a word?', steps: ['Quantitative answers are numbers you count or measure.', 'Qualitative answers are words, like a colour or a sport.'],
          explain: 'These collect numbers: ' + ans.map(function (j) { return opts[j]; }).join(' '), meta: { k: 'da4-kind-pick' } };
      }],
      [1, 'match', function () {
        var pairs = DISPLAYS.map(function (d) { return d.slice(); });
        return { q: 'Match each set of data to the best display.', type: 'match', pairs: pairs, hint: 'Two groups side by side need two bars for each category. Many two-digit numbers fit a stem-and-leaf plot.',
          steps: ['Categories: bar graph. Two groups: double bar graph. Lots of numbers: stem-and-leaf plot.'], explain: pairs.map(function (p) { return p[0] + ': ' + p[1]; }).join('. ') + '.', meta: { k: 'da4-kind-match', pairs: pairs } };
      }],
      [2, 'mistake', function () {
        var isQuan = !R.int(0, 1), qq = R.pick(isQuan ? QUAN : QUAL), p = who(), saysQual = !R.int(0, 1), truth = saysQual !== isQuan;
        var right = 'A typical answer is ' + (isQuan ? 'a number, so the data are quantitative.' : 'a word, so the data are qualitative.');
        return { q: p + ' says the question <b>"' + qq + '"</b> collects <b>' + (saysQual ? 'qualitative' : 'quantitative') + '</b> data. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Every survey collects numbers, because you count the answers.', 'Questions about people are always qualitative.', 'Long questions collect quantitative data.']),
          hint: 'Think of an answer. Is it a number or a word?', steps: [right], explain: right, meta: { k: 'da4-kind-tf', says: saysQual ? 'qual' : 'quan' } };
      }]
    ],
    'da4-stem': [
      [1, 'fill', function (lv) {
        var d = []; for (var i = 0; i < 7; i++) d.push(R.int(lv === 1 ? 10 : 20, lv === 1 ? 39 : 59));
        var s = sorted(d);
        return { q: 'Use the stem-and-leaf plot. Fill in the least and greatest values.', type: 'fill', fill: 'Least: [[]] &nbsp; Greatest: [[]]', answers: [s[0], s[6]], fig: stemLeaf(d),
          hint: 'The least is the first leaf in the top row. The greatest is the last leaf in the bottom row.', steps: ['Top row, first leaf: ' + s[0] + '.', 'Bottom row, last leaf: ' + s[6] + '.'],
          explain: 'Least ' + s[0] + ', greatest ' + s[6] + '.', meta: { k: 'da4-stem-fill', d: d } };
      }],
      [1, 'line', function (lv) {
        var d = []; for (var i = 0; i < 7; i++) d.push(R.int(lv === 1 ? 10 : 20, lv === 1 ? 39 : 59));
        var lo = Math.floor(sorted(d)[0] / 10) * 10, m = median(d);
        return { q: 'Find the <b>median</b> (middle value) in the plot. Place it on the line.', type: 'line', min: lo, max: lo + 40, tick: 1, every: 10, snap: 1, answer: m, tol: 0, fig: stemLeaf(d),
          hint: 'The leaves are already in order. Count to the 4th of the 7 values.', steps: ['There are 7 values. The middle one is the 4th.', 'The 4th value is ' + m + '.'],
          explain: 'The median is ' + m + '.', meta: { k: 'da4-stem-line', d: d } };
      }],
      [2, 'mistake', function () {
        var st = R.int(2, 5), lf = R.int(1, 9), p = who(), truth = !R.int(0, 2), said = truth ? st * 10 + lf : lf * 10 + st;
        if (said === st * 10 + lf && !truth) said += 1;
        var right = 'The stem is the tens digit and the leaf is the ones digit, so stem ' + st + ', leaf ' + lf + ' is ' + (st * 10 + lf) + '.';
        return { q: p + ' says stem <b>' + st + '</b> with leaf <b>' + lf + '</b> stands for <b>' + said + '</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['The leaf is the tens digit.', 'You add the stem and the leaf.', 'The stem is the ones digit.']),
          hint: 'Stem means tens. Leaf means ones.', steps: [right], explain: right, meta: { k: 'da4-stem-tf', st: st, lf: lf, said: said } };
      }]
    ],
    'da4-graph': [
      [1, 'fill', function () {
        var cats = R.pick([['Spring', 'Summer', 'Fall', 'Winter'], ['Soccer', 'Hockey', 'Swim', 'Dance']]), a = cats.map(function () { return R.int(1, 10); }), b = cats.map(function () { return R.int(1, 10); }), i = R.int(0, 3);
        return { q: 'Read both bars for <b>' + cats[i] + '</b>.', type: 'fill', fill: 'Grade 4: [[]] &nbsp; Grade 5: [[]]', answers: [a[i], b[i]], fig: dbar(cats, a, b, 'Grade 4', 'Grade 5', 'Favourites in two classes'),
          hint: 'The key shows which colour is each class. Read across from the top of each bar.', steps: ['Grade 4 chose ' + cats[i] + ' ' + a[i] + ' times. Grade 5: ' + b[i] + '.'],
          explain: 'Grade 4: ' + a[i] + '. Grade 5: ' + b[i] + '.', meta: { k: 'da4-graph-fill', a: a, b: b, i: i } };
      }],
      [1, 'mistake', function () {
        var cats = ['Apple', 'Banana', 'Grape', 'Pear'], a = cats.map(function () { return R.int(1, 10); }), b = cats.map(function () { return R.int(1, 10); }), i = R.int(0, 3), p = who();
        while (a[i] === b[i]) b[i] = R.int(1, 10);
        var truth = a[i] > b[i], right = 'For ' + cats[i] + ', Grade 4 has ' + a[i] + ' and Grade 5 has ' + b[i] + '.';
        return { q: p + ' says more Grade 4 students than Grade 5 students chose <b>' + cats[i] + '</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: dbar(cats, a, b, 'Grade 4', 'Grade 5', 'Favourite fruit in two classes'),
          why: why(right, ['The bar on the left is always bigger.', 'Both classes always choose the same.', 'You compare the bars for a different fruit.']),
          hint: 'Find the two bars above ' + cats[i] + '.', steps: [right], explain: right, meta: { k: 'da4-graph-tf', a: a, b: b, i: i } };
      }],
      [2, 'order', function () {
        var cats = ['Soccer', 'Hockey', 'Swim', 'Dance'], a = R.shuffle([2, 4, 6, 8, 9, 3, 7].slice(0, 4)), b = cats.map(function () { return R.int(1, 10); });
        var ord = cats.map(function (c, k) { return [c, a[k]]; }).sort(function (x, y) { return y[1] - x[1]; });
        return { q: 'Put the sports in order from <b>most</b> to <b>least</b> popular in <b>Grade 4</b>.', type: 'order', items: ord.map(function (x) { return x[0]; }), first: 'most', last: 'least',
          fig: dbar(cats, a, b, 'Grade 4', 'Grade 5', 'Favourite sports in two classes'), hint: 'Look only at the Grade 4 bars.', steps: ['Grade 4: ' + ord.map(function (x) { return x[0] + ' ' + x[1]; }).join(', ') + '.'],
          explain: 'Most to least: ' + ord.map(function (x) { return x[0]; }).join(', ') + '.', meta: { k: 'da4-graph-order', a: a, cats: cats } };
      }]
    ],
    'da4-mmm': [
      [1, 'line', function () {
        var d = []; for (var i = 0; i < 5; i++) d.push(R.int(1, 12));
        return { q: 'Goals scored in 5 games: ' + d.join(', ') + '. Find the <b>median</b>. Place it on the line.', type: 'line', min: 0, max: 12, tick: 1, every: 2, snap: 1, answer: median(d), tol: 0, fig: towers(d),
          hint: 'Put the values in order first. The median is the middle one.', steps: ['In order: ' + sorted(d).join(', ') + '.', 'The middle (3rd) value is ' + median(d) + '.'],
          explain: 'The median is ' + median(d) + '.', meta: { k: 'da4-mmm-line', d: d } };
      }],
      [1, 'match', function () {
        var d, mo, md, rg;
        do { d = []; for (var i = 0; i < 5; i++) d.push(R.int(1, 12)); mo = modes(d); md = median(d); rg = sorted(d)[4] - sorted(d)[0]; } while (mo.length !== 1 || mo[0] === md || md === rg || mo[0] === rg);
        var pairs = [['Mode', String(mo[0])], ['Median', String(md)], ['Range', String(rg)]];
        return { q: 'Data: ' + d.join(', ') + '. Match each word to its value.', type: 'match', pairs: pairs, hint: 'Mode: most often. Median: middle when sorted. Range: greatest minus least.',
          steps: ['In order: ' + sorted(d).join(', ') + '.'], explain: 'Mode ' + mo[0] + ', median ' + md + ', range ' + rg + '.', meta: { k: 'da4-mmm-match', d: d } };
      }],
      [2, 'mistake', function () {
        var d, mid;
        do { d = R.shuffle(distinctData(5, 1, 15)); mid = d[2]; } while (mid === median(d));
        var p = who(), truth = !R.int(0, 2), said = truth ? median(d) : mid;
        var right = 'Sort first: ' + sorted(d).join(', ') + '. The middle value is ' + median(d) + '.';
        return { q: 'Data: ' + d.join(', ') + '. ' + p + ' says the median is <b>' + said + '</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['The median is the middle number in the list as it is written.', 'The median is the biggest value.', 'The median is the one that appears most.']),
          hint: 'Did ' + p + ' sort the values first?', steps: [right], explain: right, meta: { k: 'da4-mmm-tf', d: d, said: said } };
      }]
    ],
    'da4-prob': [
      [1, 'order', function () {
        var n = R.pick([6, 8]), ks = R.shuffle([0, 1, 2, 3, 4, 5, 6].filter(function (x) { return x <= n; })).slice(0, 3).sort(function (a, b) { return a - b; });
        return { q: 'Put the spinners in order from <b>least likely</b> to <b>most likely</b> to land on orange.', type: 'order', items: ks.map(function (k, i) { return small(spinner(k, n, 40 + i * 50), 110); }), first: 'least likely', last: 'most likely',
          hint: 'Count the orange sections on each spinner.', steps: ['Orange sections: ' + ks.join(', ') + ' out of ' + n + '.'],
          explain: 'More orange sections means more likely.', meta: { k: 'da4-prob-order', ks: ks, n: n } };
      }],
      [1, 'match', function () {
        var n = 4, ks = R.shuffle([0, 1, 2, 3, 4]).slice(0, 3);
        var pairs = ks.map(function (k) { return [small(spinner(k, n, 30), 100), word(k, n)]; });
        return { q: 'Match each spinner to how likely it is to land on orange.', type: 'match', pairs: pairs, hint: 'Count the orange sections out of 4. Half would be 2.',
          steps: ['0 orange: impossible. All orange: certain. Half: equally likely. Less than half: unlikely. More than half: likely.'], explain: ks.map(function (k) { return k + ' of 4 orange: ' + word(k, n); }).join('. ') + '.', meta: { k: 'da4-prob-match', ks: ks, n: n } };
      }],
      [2, 'mistake', function () {
        var n = R.pick([4, 6, 8]), k = R.int(1, n - 1), p = who(), w = word(k, n), truth = !R.int(0, 1), said = truth ? w : (w === 'likely' ? 'unlikely' : 'likely');
        var right = k + ' of ' + n + ' sections are orange, so landing on orange is ' + w + '.';
        return { q: p + ' says landing on orange is <b>' + said + '</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: spinner(k, n, 200),
          why: why(right, ['Any colour you can see is likely.', 'Spinners are always equally likely.', 'Orange is unlikely because it is a bright colour.']),
          hint: 'Compare the orange sections with half of ' + n + '.', steps: [right], explain: right, meta: { k: 'da4-prob-tf', k2: k, n: n, said: said } };
      }]
    ],
    'da4-pop': [
      [1, 'mistake', function () {
        var d = wholeMeanSet(5, 4, 9), mean = sum(d) / 5, add = R.pick([R.int(0, 2), R.int(12, 20)]), p = who(), up = add > mean, saysUp = !R.int(0, 1), truth = saysUp === up;
        var right = 'The mean is ' + mean + '. The new value, ' + add + ', is ' + (up ? 'more' : 'less') + ' than the mean, so it pulls the mean ' + (up ? 'up' : 'down') + '.';
        return { q: 'Data: ' + d.join(', ') + '. The value ' + add + ' is added. ' + p + ' says the mean will go <b>' + (saysUp ? 'up' : 'down') + '</b>. True or false: ' + p + ' is right.', type: 'tf', answer: truth, fig: towers(d, true),
          why: why(right, ['Adding a value always makes the mean go up.', 'Adding a value never changes the mean.', 'The mean only depends on the first value.']),
          hint: 'Is ' + add + ' bigger or smaller than the mean, ' + mean + '?', steps: [right], explain: right, meta: { k: 'da4-pop-tf', d: d, add: add, saysUp: saysUp } };
      }],
      [1, 'pick', function () {
        var d = wholeMeanSet(5, 3, 9), mean = sum(d) / 5, opts = R.shuffle([mean - 3, mean - 1, mean + 1, mean + 4, mean + 6].filter(function (v) { return v >= 0; }));
        var ans = opts.map(function (v, j) { return v > mean ? j : -1; }).filter(function (j) { return j >= 0; });
        return { q: 'Data: ' + d.join(', ') + '. The mean is ' + mean + '. Pick every new value that would make the mean go <b>up</b>.', type: 'pick', options: opts.map(String), answer: ans,
          hint: 'A value bigger than the mean pulls it up.', steps: ['Pick the values greater than ' + mean + '.'], explain: 'Values greater than ' + mean + ' raise the mean.', meta: { k: 'da4-pop-pick', d: d } };
      }],
      [2, 'fill', function () {
        var d, add;
        do { d = wholeMeanSet(4, 2, 9); add = R.int(1, 15); } while ((sum(d) + add) % 5 || add === sum(d) / 4);
        return { q: 'Data: ' + d.join(', ') + '. Then the value <b>' + add + '</b> is added. Fill in the means.', type: 'fill', fill: 'Mean before: [[]] &nbsp; Mean after: [[]]', answers: [sum(d) / 4, (sum(d) + add) / 5],
          hint: 'Mean = total &divide; how many values.', steps: ['Before: ' + sum(d) + ' &divide; 4 = ' + sum(d) / 4 + '.', 'After: ' + (sum(d) + add) + ' &divide; 5 = ' + (sum(d) + add) / 5 + '.'],
          explain: 'The mean goes from ' + sum(d) / 4 + ' to ' + (sum(d) + add) / 5 + '.', meta: { k: 'da4-pop-fill', d: d, add: add } };
      }]
    ]
  };
  Atlas.Q.shapes('data', SHAPES);
})();
