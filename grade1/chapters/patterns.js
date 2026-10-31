(function () {
  var A = Atlas, R = A.R;
  var SH = {
    rc: { s: 'circle', c: '#e04b3a', n: 'red circle' }, bs: { s: 'square', c: '#2c68cf', n: 'blue square' }, yt: { s: 'triangle', c: '#f2bd24', n: 'yellow triangle' },
    gs: { s: 'star', c: '#2f9a4c', n: 'green star' }, pc: { s: 'circle', c: '#8441bd', n: 'purple circle' }, oh: { s: 'heart', c: '#ee7d24', n: 'orange heart' }
  };
  var KEYS = Object.keys(SH);
  function shape(k, x, y, z) {
    var d = SH[k], st = 'style="fill:' + d.c + '" stroke="rgba(0,0,0,.45)" stroke-width="2" stroke-linejoin="round"', r = z / 2;
    if (d.s === 'circle') return '<circle cx="' + x + '" cy="' + y + '" r="' + (r - 2) + '" ' + st + '/>';
    if (d.s === 'square') return '<rect x="' + (x - r + 3) + '" y="' + (y - r + 3) + '" width="' + (z - 6) + '" height="' + (z - 6) + '" rx="3" ' + st + '/>';
    if (d.s === 'triangle') return '<path d="M' + x + ' ' + (y - r + 2) + 'L' + (x + r - 1) + ' ' + (y + r - 4) + 'L' + (x - r + 1) + ' ' + (y + r - 4) + 'Z" ' + st + '/>';
    if (d.s === 'heart') return '<path d="M' + x + ' ' + (y + r - 3) + 'C' + (x - r * 1.4) + ' ' + y + ' ' + (x - r * .7) + ' ' + (y - r * 1.05) + ' ' + x + ' ' + (y - r * .35) + 'C' + (x + r * .7) + ' ' + (y - r * 1.05) + ' ' + (x + r * 1.4) + ' ' + y + ' ' + x + ' ' + (y + r - 3) + 'Z" ' + st + '/>';
    var p = []; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r - 1; p.push((x + rr * Math.cos(a)).toFixed(1) + ' ' + (y + rr * Math.sin(a)).toFixed(1)); }
    return '<path d="M' + p.join('L') + 'Z" ' + st + '/>';
  }
  /* a row of shapes. gap: index shown as a ? box. more: how many ? boxes at the end. */
  function row(seq, o) {
    o = o || {};
    var z = 40, g = 8, s = '', n = seq.length + (o.more || 0), per = Math.min(n, o.per || 10);
    for (var i = 0; i < n; i++) {
      var x = 4 + (i % per) * (z + g) + z / 2, y = 4 + Math.floor(i / per) * (z + g + 10) + z / 2;
      if (i >= seq.length || i === o.gap) s += '<rect x="' + (x - z / 2 + 1) + '" y="' + (y - z / 2 + 1) + '" width="' + (z - 2) + '" height="' + (z - 2) + '" rx="8" style="fill:none;stroke:var(--ink2)" stroke-width="2" stroke-dasharray="5 4"/><text x="' + x + '" y="' + (y + 8) + '" text-anchor="middle" font-size="24" class="tb">?</text>';
      else s += shape(seq[i], x, y, z);
      if (o.core && i % o.core === o.core - 1 && i < seq.length - 1 && (i + 1) % per) s += '<line x1="' + (x + z / 2 + g / 2) + '" y1="' + (y - z / 2) + '" x2="' + (x + z / 2 + g / 2) + '" y2="' + (y + z / 2) + '" style="stroke:var(--accent)" stroke-width="3"/>';
    }
    var label = o.label || 'Pattern: ' + seq.map(function (k, i) { return i === o.gap ? 'blank' : SH[k].n; }).join(', ') + (o.more ? ', then ' + (o.more > 1 ? o.more + ' blanks' : 'a blank') : '');
    return A.svg(per * (z + g) + 4, Math.ceil(n / per) * (z + g + 10) - 2, s, label);
  }
  function one(k) { return A.svg(48, 48, shape(k, 24, 24, 42), SH[k].n); }
  var CORES = { 1: ['AB'], 2: ['AAB', 'ABB', 'AB'], 3: ['ABC', 'AABB', 'ABBC', 'AAB'] };
  function makeCore(type) {
    var picks = R.shuffle(KEYS), map = { A: picks[0], B: picks[1], C: picks[2] };
    return type.split('').map(function (L) { return map[L]; });
  }
  function rep(core, n) { var out = []; for (var i = 0; i < n; i++) out.push(core[i % core.length]); return out; }
  function letters(core) {
    var seen = {}, next = 'A';
    return core.map(function (k) { if (!seen[k]) { seen[k] = next; next = String.fromCharCode(next.charCodeAt(0) + 1); } return seen[k]; }).join('');
  }

  function qNext(lv) {
    var type = R.pick(CORES[lv]), core = makeCore(type), len = core.length * (lv === 1 ? 3 : 2) + R.int(0, core.length - 1), seq = rep(core, len), ans = core[len % core.length];
    var others = KEYS.filter(function (k) { return k !== ans; }), wrong = core.filter(function (k, i) { return k !== ans && core.indexOf(k) === i; });
    if (!wrong.length) wrong = [R.pick(others)];
    var choices = R.shuffle([ans].concat(wrong.slice(0, 2), R.shuffle(others.filter(function (k) { return wrong.indexOf(k) < 0; })).slice(0, Math.max(0, 2 - wrong.length))));
    var o = { options: choices.map(one), answer: choices.indexOf(ans) };
    return { q: 'What comes next in the pattern?', type: 'mc', options: o.options, answer: o.answer, fig: row(seq, { more: 1 }), chk: { core: core, len: len },
      hint: 'Find the part that repeats. Say the pattern out loud: ' + letters(core).split('').join(', ') + '...',
      steps: ['The part that repeats is: ' + core.map(function (k) { return SH[k].n; }).join(', ') + '.<div class="fig">' + row(seq, { core: core.length }) + '</div>', 'The last shape is the ' + SH[seq[len - 1]].n + '. Find where it is in the repeating part.', 'Next comes the ' + SH[ans].n + '.'],
      explain: 'The pattern repeats ' + core.map(function (k) { return SH[k].n; }).join(', ') + '. Next is the ' + SH[ans].n + '.' };
  }
  function qMissing(lv) {
    var type = R.pick(CORES[lv]), core = makeCore(type), len = core.length * 3, seq = rep(core, len), gap = R.int(core.length, len - 2), ans = seq[gap];
    var choices = R.shuffle(core.filter(function (k, i) { return core.indexOf(k) === i; }).concat(R.shuffle(KEYS.filter(function (k) { return core.indexOf(k) < 0; })).slice(0, 1))).slice(0, 4);
    if (choices.indexOf(ans) < 0) choices[0] = ans;
    return { q: 'What is missing from the pattern?', type: 'mc', options: choices.map(one), answer: choices.indexOf(ans), fig: row(seq, { gap: gap }), chk: { seq: seq, gap: gap },
      hint: 'Look at the shapes just before and just after the gap. Then find the same spot in another repeat.',
      steps: ['Find the part that repeats: ' + core.map(function (k) { return SH[k].n; }).join(', ') + '.', 'The gap is right after the ' + SH[seq[gap - 1]].n + '.', 'In the pattern, that spot is the ' + SH[ans].n + '.'],
      explain: 'The missing shape is the ' + SH[ans].n + '.' };
  }
  function qCore(lv) {
    var type = R.pick(CORES[lv === 1 ? 2 : 3]), core = makeCore(type), seq = rep(core, core.length * 3);
    var right = letters(core), pool = ['AB', 'AAB', 'ABB', 'ABC', 'AABB', 'ABBC', 'ABAC'].filter(function (x) { return x !== right; });
    var fmt = function (L) { return rep(L.split(''), Math.max(6, L.length * 2)).join(' '); };
    var o = R.mc(fmt(right), R.shuffle(pool).slice(0, 2).map(fmt));
    if (lv === 1) return { q: 'How many shapes are in the part that <b>repeats</b>?', type: 'num', answer: core.length, fig: row(seq), chk: { core: core },
      hint: 'Start at the first shape. Where does the pattern start again?', steps: ['Start at the first shape: ' + SH[core[0]].n + '.', 'Look for where the same shapes start again.', 'The repeating part has ' + core.length + ' shapes.<div class="fig">' + row(seq, { core: core.length }) + '</div>'], explain: 'The part that repeats is ' + core.map(function (k) { return SH[k].n; }).join(', ') + ': ' + core.length + ' shapes.' };
    return { q: 'Which letters show the same pattern?', type: 'mc', options: o.options, answer: o.answer, wide: true, fig: row(seq), chk: { core: core },
      hint: 'Give the first shape the letter A. Give the next new shape B, and so on.', steps: ['The first shape, the ' + SH[core[0]].n + ', is A.', 'Each new shape gets the next letter.', 'The pattern is ' + right.split('').join(' ') + ', again and again.'], explain: 'The shapes follow ' + right + ', ' + right + ', ' + right + '.' };
  }
  function qNum(lv) {
    var by = lv === 1 ? R.pick([1, 10]) : lv === 2 ? R.pick([2, 5, 10]) : R.pick([2, 5, -1, -10, 3]);
    var start;
    if (by > 0) start = by === 1 ? R.int(1, 40) : by === 10 ? R.int(1, 10) : by === 3 ? R.int(1, 10) : by * R.int(0, 4) + (lv === 3 ? R.int(0, 1) : 0);
    else start = by === -1 ? R.int(10, 50) : R.int(40, 50);
    var seq = []; for (var i = 0; i < 5; i++) seq.push(start + i * by);
    var gap = lv === 1 ? 4 : R.int(1, 4), ans = seq[gap];
    var shown = seq.map(function (v, i) { return i === gap ? '<b class="blank">?</b>' : v; }).join(', ');
    var rule = by > 0 ? 'add ' + by : 'take away ' + (-by);
    return { q: 'What number is missing? <span class="math">' + shown + '</span>', type: 'num', answer: ans, chk: { seq: seq },
      hint: 'How much does it change each time? Look at two numbers next to each other.',
      steps: ['Look at two numbers next to each other: ' + (gap > 1 ? seq[0] + ' and ' + seq[1] : seq[2] + ' and ' + seq[3]) + '.', 'Each time, you ' + rule + '. That is the pattern rule.', (gap ? seq[gap - 1] + (by > 0 ? ' + ' + by : ' &minus; ' + (-by)) : seq[1] + ' going back') + ' = ' + ans + '.'],
      explain: 'The rule is "' + rule + '": ' + seq.join(', ') + '.' };
  }
  var CHANGE = [
    ['how tall you are as you grow up', 1], ['your age', 1], ['the weather outside', 1], ['how many leaves are on a maple tree in the fall', 1], ['how tall a sunflower is over the summer', 1],
    ['the time on a clock', 1], ['how much water is in a puddle on a sunny day', 1],
    ['the number of days in a week', 0], ['the number of wheels on a bicycle', 0], ['the number of fingers on one hand', 0], ['the number of months in a year', 0], ['the number of corners on a square', 0], ['the number of legs on a dog', 0]
  ];
  function qChange(lv) {
    var it = R.pick(CHANGE.filter(function (c) { return lv === 1 ? CHANGE.indexOf(c) % 2 === 0 : true; }));
    return { q: 'Does this <b>change</b> or <b>stay the same</b>? <br>' + it[0].charAt(0).toUpperCase() + it[0].slice(1) + '.', type: 'mc', options: ['It changes', 'It stays the same'], answer: it[1] ? 0 : 1, wide: true, chk: { it: it[0] },
      hint: 'Think about tomorrow, or next year. Will it be different?', steps: ['Think about ' + it[0] + ' today.', 'Now think about it later: tomorrow, or next year.', it[1] ? 'It can be different later, so it changes.' : 'It is always the same, so it stays the same.'],
      explain: it[0].charAt(0).toUpperCase() + it[0].slice(1) + (it[1] ? ' can change.' : ' always stays the same.') };
  }

  var demoCore = ['rc', 'bs'], demoCore2 = ['yt', 'yt', 'gs'];
  A.register('patterns', {
    html:
'<section class="sec"><h2><span class="n">1</span>What is a pattern?</h2>' +
'<p>A <b>repeating pattern</b> has a part that repeats again and again. We call it the <b>core</b>.</p>' +
'<div class="fig">' + row(rep(demoCore, 8), { core: 2, label: 'Red circle, blue square, repeated 4 times. A line marks each repeat.' }) + '</div>' +
'<p>Here the core is: red circle, blue square. It repeats 4 times.</p>' +
'<p>Patterns are all around us: the days of the week, stripes on a shirt, beads on a string, a song\'s chorus.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + row(rep(demoCore2, 9), { label: 'Yellow triangle, yellow triangle, green star, repeated 3 times' }) + '</div><p>I start at the first shape and look for where it starts again. Triangle, triangle, star... then triangle, triangle, star again. The core is <b>triangle, triangle, star</b>: 3 shapes.</p><div class="fig">' + row(rep(demoCore2, 9), { core: 3 }) + '</div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Find the core first. Then you can continue any pattern.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>What comes next?</h2>' +
'<p>To continue a pattern, say it out loud and keep going with the core.</p>' +
'<div class="wm"><b class="t">Do it with me</b><div class="fig">' + row(rep(['pc', 'oh', 'oh'], 7), { more: 1 }) + '</div><ol><li>Say it: circle, heart, heart, circle, heart, heart, circle...</li><li>The core is circle, heart, heart. We just said "circle".</li><li>Next comes a <b>heart</b>.</li></ol></div>' +
'<div class="lab"><span class="lt">Try it: build and continue a pattern</span>' +
'<div class="btnrow" role="group" aria-label="Pick a core"><button type="button" class="btn" data-core="AB">A B</button><button type="button" class="btn alt" data-core="AAB">A A B</button><button type="button" class="btn alt" data-core="ABB">A B B</button><button type="button" class="btn alt" data-core="ABC">A B C</button></div>' +
'<div class="btnrow"><button type="button" class="btn alt" id="ptnew">New shapes</button><button type="button" class="btn" id="ptadd">Add the next shape</button><button type="button" class="btn alt" id="ptclr">Start again</button></div>' +
'<div class="fig" id="ptfig"></div><div class="out" id="ptout" aria-live="polite"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Find what is missing</h2>' +
'<p>When part of a pattern is missing, look at the shapes before and after the gap.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + row(rep(['rc', 'bs', 'yt'], 9), { gap: 4 }) + '</div><p>The core is circle, square, triangle. The gap comes after a circle. After a circle comes a square. The missing shape is the <b>blue square</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Do not just copy the shape next to the gap. Check the whole core.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>The same pattern, many ways</h2>' +
'<p>A pattern can be made with shapes, letters, sounds or moves. These all show the same <b>A B B</b> pattern:</p>' +
'<div class="fig">' + row(rep(['gs', 'rc', 'rc'], 6)) + '</div>' +
'<div class="tbl"><table><tbody><tr><th class="l">Letters</th><td>A B B A B B</td></tr><tr><th class="l">Sounds</th><td>clap, stomp, stomp, clap, stomp, stomp</td></tr><tr><th class="l">Moves</th><td>jump, sit, sit, jump, sit, sit</td></tr><tr><th class="l">Numbers</th><td>1 2 2 1 2 2</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Watch me</b><p>To write a pattern in letters, the first thing is A. The next <b>new</b> thing is B. Star is A, circle is B, circle is B. So it is A B B.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>Two patterns are the same if they have the same core, even if they look different.</p></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Number patterns</h2>' +
'<p>Numbers can make patterns too. A number pattern has a <b>rule</b>, like "add 2" or "take away 1".</p>' +
'<div class="eg"><b class="t">Watch me</b><p>' + '<span class="math">5, 10, 15, 20, <b class="blank">?</b></span>' + '. 5 to 10 is 5 more. 10 to 15 is 5 more. The rule is <b>add 5</b>. Next is 25.</p></div>' +
'<div class="lab"><span class="lt">Try it: make a number pattern</span><div class="row2">' + A.stepHtml('np1', 'Start at', 2) + A.stepHtml('np2', 'Add each time', 2) + '</div>' +
'<div class="fig" id="npfig"></div><div class="out" id="npout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">6</span>Changes or stays the same</h2>' +
'<p>Some things <b>change</b>: how tall you are, the weather, your age. Some things <b>stay the same</b>: the number of days in a week is always 7.</p>' +
'<div class="vrow"><figure>' + A.svg(150, 120, '<rect x="20" y="96" width="110" height="6" style="fill:var(--ink2)"/>' + [30, 52, 74].map(function (h, i) { return '<rect x="' + (28 + i * 34) + '" y="' + (96 - h) + '" width="24" height="' + h + '" rx="4" style="fill:var(--sd)"/>'; }).join('') + '<text x="75" y="118" text-anchor="middle" font-size="16" class="t2">grows</text>', 'A plant getting taller over three weeks') + '<figcaption>A plant: changes</figcaption></figure>' +
'<figure>' + A.svg(150, 120, '<circle cx="45" cy="78" r="26" style="fill:none;stroke:var(--ink)" stroke-width="5"/><circle cx="110" cy="78" r="26" style="fill:none;stroke:var(--ink)" stroke-width="5"/><path d="M45 78L72 42H100L110 78M72 42L84 78H45" style="fill:none;stroke:var(--sb)" stroke-width="4" stroke-linejoin="round"/>', 'A bicycle with 2 wheels') + '<figcaption>Wheels on a bike: always 2</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><p>Does the number of months in a year change? Last year had 12 months. Next year will have 12 months. It <b>stays the same</b>.</p></div>' +
'<div class="yt"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$, type = 'AB', core = makeCore('AB'), len = 6;
      function draw(msg) {
        var seq = rep(core, len);
        $('#ptfig', root).innerHTML = row(seq, { core: core.length });
        $('#ptout', root).innerHTML = msg || 'Core: ' + core.map(function (k) { return SH[k].n; }).join(', ') + '. Press <b>Add the next shape</b>.';
        $('#ptadd', root).disabled = len >= 20;
      }
      A.$$('[data-core]', root).forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-core') === 'AB'));
        b.addEventListener('click', function () {
          type = b.getAttribute('data-core'); core = makeCore(type); len = type.length * 2;
          A.$$('[data-core]', root).forEach(function (x) { x.classList.toggle('alt', x !== b); x.setAttribute('aria-pressed', String(x === b)); });
          draw();
        });
      });
      $('#ptnew', root).addEventListener('click', function () { core = makeCore(type); draw(); });
      $('#ptadd', root).addEventListener('click', function () { var k = core[len % core.length]; len++; draw('Next is the <b>' + SH[k].n + '</b>. Position ' + len + '.'); });
      $('#ptclr', root).addEventListener('click', function () { len = type.length * 2; draw(); });
      draw();
      var st = 2, by = 2, s2;
      function np() {
        var seq = []; for (var v = st; v <= 50 && seq.length < 10; v += by) seq.push(v);
        var c = {}; seq.forEach(function (v) { c[v] = 'a'; });
        $('#npfig', root).innerHTML = A.chart({ cls: c, label: 'Number chart with the pattern marked' });
        $('#npout', root).innerHTML = 'Rule: start at ' + st + ', add ' + by + '.<br><b>' + seq.join(', ') + '</b>';
      }
      A.stepper(root, 'np1', 0, 20, function (v) { st = v; np(); });
      s2 = A.stepper(root, 'np2', 1, 10, function (v) { by = v; np(); });
    },

    checks: [
      [function () { return qCore(1); }, function () { return qNext(1); }, function () { return qCore(1); }],
      [function () { return qNext(1); }, function () { return qNext(2); }, function () { return qNext(2); }],
      [function () { return qMissing(1); }, function () { return qMissing(2); }, function () { return qMissing(2); }],
      [function () { return qCore(2); }, function () { return qCore(2); }, function () { return qCore(3); }],
      [function () { return qNum(1); }, function () { return qNum(2); }, function () { return qNum(2); }],
      [function () { return qChange(1); }, function () { return qChange(2); }, function () { return qChange(2); }]
    ],

    quiz: [
      { q: 'What comes next in the pattern?', type: 'mc', options: [one('rc'), one('bs'), one('yt')], answer: 1, fig: row(rep(['rc', 'bs'], 7), { more: 1 }),
        hint: 'Say it: circle, square, circle, square...', explain: 'The core is red circle, blue square. After a circle comes a square.' },
      { q: 'How many shapes are in the part that repeats?', type: 'num', answer: 3, fig: row(rep(['gs', 'gs', 'pc'], 9)),
        hint: 'Where does the pattern start again?', explain: 'Star, star, circle repeats. That is 3 shapes.' },
      { q: 'What is missing from the pattern?', type: 'mc', options: [one('yt'), one('oh'), one('rc')], answer: 0, fig: row(rep(['oh', 'yt', 'yt'], 9), { gap: 5 }),
        hint: 'The core is heart, triangle, triangle.', explain: 'After heart, triangle comes another triangle.' },
      { q: 'Which letters show the same pattern as clap, clap, stomp, clap, clap, stomp?', type: 'mc', options: ['A B A B A B', 'A A B A A B', 'A B B A B B'], answer: 1, wide: true,
        hint: 'Clap is A. Stomp is B.', explain: 'Clap, clap, stomp is A A B.' },
      { q: 'What number is missing? <span class="math">10, 20, 30, <b class="blank">?</b>, 50</span>', type: 'num', answer: 40,
        hint: 'What is the rule? 10 to 20 is...', explain: 'The rule is add 10: 10, 20, 30, 40, 50.' },
      { q: 'What number is missing? <span class="math">20, 19, <b class="blank">?</b>, 17, 16</span>', type: 'num', answer: 18,
        hint: 'The numbers are going down. By how much?', explain: 'The rule is take away 1: 20, 19, 18, 17, 16.' },
      { q: 'Does the number of days in a week change or stay the same?', type: 'mc', options: ['It changes', 'It stays the same'], answer: 1, wide: true,
        hint: 'How many days were in last week? How many will be in next week?', explain: 'Every week has 7 days, so it stays the same.' }
    ],

    practice: [
      { id: 'p-next', name: 'What comes next', code: 'C1.3', gen: qNext },
      { id: 'p-missing', name: 'What is missing', code: 'C1.3', gen: qMissing },
      { id: 'p-core', name: 'Find the core', code: 'C1.1, C1.2', gen: qCore },
      { id: 'p-num', name: 'Number patterns', code: 'C1.4', gen: qNum },
      { id: 'p-change', name: 'Changes or stays the same', code: 'C2.1', gen: qChange }
    ]
  });
})();
