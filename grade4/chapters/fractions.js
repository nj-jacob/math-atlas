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

  A.register('fractions', {
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
})();
