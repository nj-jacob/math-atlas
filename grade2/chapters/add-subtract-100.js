(function () {
  var A = Atlas, R = A.R, D = A.draw, M = '&minus;';
  /* hundred chart with a start cell, an end cell and the cells passed through */
  function chart(start, end, path) {
    var c = 46, s = '', on = {};
    (path || []).forEach(function (v) { on[v] = 1; });
    for (var v = 1; v <= 100; v++) {
      var i = v - 1, x = 2 + (i % 10) * c, y = 2 + Math.floor(i / 10) * c;
      var fill = v === start ? 'var(--hi)' : v === end ? 'var(--strand)' : on[v] ? 'color-mix(in srgb,var(--strand) 25%,var(--card))' : 'var(--card)';
      s += '<rect x="' + x + '" y="' + y + '" width="' + c + '" height="' + c + '" style="fill:' + fill + ';stroke:var(--line)" stroke-width="1.5"/>';
      s += '<text x="' + (x + c / 2) + '" y="' + (y + c / 2 + 7) + '" text-anchor="middle" font-size="19" font-weight="' + (v === start || v === end ? 800 : 400) + '"' + (v === end ? ' style="fill:#fff"' : '') + '>' + v + '</text>';
    }
    return A.svg(10 * c + 4, 10 * c + 4, s, 'Hundred chart. Start at ' + start + (end ? ', end at ' + end : '') + '.');
  }
  function tensOnesPath(a, t, o) {
    var p = [], v = a;
    for (var i = 0; i < t; i++) { v += 10; p.push(v); }
    for (var j = 0; j < o; j++) { v += 1; p.push(v); }
    return p;
  }
  /* open number line: start, then jumps (each {d, t}) forward or back */
  function openLine(start, jumps, label) {
    var vals = [start], v = start;
    jumps.forEach(function (j) { v += j; vals.push(v); });
    var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals), W = 540, x0 = 30, x1 = W - 30, y = 92, s = '';
    var X = function (q) { return x0 + (x1 - x0) * (q - lo) / Math.max(1, hi - lo); };
    s += '<defs><marker id="olm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" style="fill:var(--strand)"/></marker></defs>';
    s += '<line x1="12" y1="' + y + '" x2="' + (W - 12) + '" y2="' + y + '" style="stroke:var(--ink)" stroke-width="3" stroke-linecap="round"/>';
    vals.forEach(function (q, i) {
      var x = X(q);
      s += '<line x1="' + x + '" y1="' + (y - 9) + '" x2="' + x + '" y2="' + (y + 9) + '" style="stroke:var(--ink)" stroke-width="2.5"/>';
      s += '<text x="' + x + '" y="' + (y + 32) + '" text-anchor="middle" font-size="19" font-weight="' + (i === 0 || i === vals.length - 1 ? 800 : 400) + '">' + q + '</text>';
    });
    jumps.forEach(function (j, i) {
      var xa = X(vals[i]), xb = X(vals[i + 1]), mid = (xa + xb) / 2, h = Math.min(60, 18 + Math.abs(xb - xa) * 0.3);
      s += '<path d="M' + xa + ' ' + (y - 6) + ' Q' + mid + ' ' + (y - 6 - 2 * h) + ' ' + xb + ' ' + (y - 8) + '" fill="none" style="stroke:var(--strand)" stroke-width="3" marker-end="url(#olm)"/>';
      s += '<text x="' + mid + '" y="' + (y - 12 - h) + '" text-anchor="middle" font-size="18" font-weight="800" style="fill:var(--strand)">' + (j > 0 ? '+' + j : M + -j) + '</text>';
    });
    s += '<circle cx="' + X(start) + '" cy="' + y + '" r="7" style="fill:var(--hi);stroke:var(--ink)" stroke-width="2"/>';
    return A.svg(W, y + 42, s, label || 'Open number line from ' + start + ' to ' + v);
  }
  /* two numbers in base-ten blocks, side by side */
  function pair(a, b, sym) {
    return '<div class="vrow"><figure>' + D.num10(a, { u: 7 }) + '<figcaption>' + a + '</figcaption></figure><figure><span class="big">' + (sym || '+') + '</span></figure><figure>' + D.num10(b, { u: 7 }) + '<figcaption>' + b + '</figcaption></figure></div>';
  }
  function tens(n) { return Math.floor(n / 10); }
  function addSteps(a, b) {
    var t = tens(a) * 10 + tens(b) * 10, o = a % 10 + b % 10;
    return ['Add the tens: ' + tens(a) * 10 + ' + ' + tens(b) * 10 + ' = ' + t + '.', 'Add the ones: ' + a % 10 + ' + ' + b % 10 + ' = ' + o + '.', 'Put them together: ' + t + ' + ' + o + ' = ' + (a + b) + '.' + (o >= 10 ? ' The ' + o + ' ones made another ten.' : '')];
  }
  function subSteps(a, b) {
    return ['Start at ' + a + '. Jump back ' + tens(b) * 10 + ' (the tens): ' + (a - tens(b) * 10) + '.', 'Jump back ' + b % 10 + ' (the ones): ' + (a - b) + '.', 'So ' + a + ' ' + M + ' ' + b + ' = ' + (a - b) + '.<div class="fig">' + openLine(a, [-tens(b) * 10, -(b % 10)].filter(function (x) { return x; })) + '</div>'];
  }

  /* ---------- lessons: one idea at a time ---------- */
  var K = A.kit, CH = 'add-subtract-100';
  function T(k) { return K.T(CH, k); }
  function P(id, lv) { return K.P(CH, id, lv); }
  var LESSONS = [
    { id: 'tens', title: 'Tens on the hundred chart', sub: 'Down a row adds 10.', concepts: [
      { id: 'addtens', title: 'Adding tens', exp: ['B2.3'], skill: 'a2-tens',
        body: '<p>On a hundred chart, moving <b>down one row</b> adds 10. The ones digit stays the same. Only the tens change.</p>',
        watch: { tool: 'hundred', opts: {}, steps: [
          { say: 'Let\'s add 34 + 30. Find 34.', act: function (t) { return t.skip(10, 34, 34); }, ms: 900 },
          { say: 'Move down one row for each ten: 44, 54, 64.', act: function (t) { return t.skip(10, 44, 64, 650); } },
          { say: 'We land on 64. <b>34 + 30 = 64</b>. The 4 in the ones place did not change.', ms: 2200 }
        ] },
        example: { tool: 'hundred', opts: {}, steps: [
          { say: 'My turn. I will add 52 + 30. I find 52.', act: function (t) { return t.skip(10, 52, 52); }, ms: 1000 },
          { say: 'Each ten moves me down one row: 62, 72, 82.', act: function (t) { return t.skip(10, 62, 82, 650); } },
          { say: 'I land on 82. <b>52 + 30 = 82</b>. The ones digit, 2, did not change.', ms: 2200 }
        ] },
        try: { tool: 'hundred', opts: {}, tasks: [
          { do: 'Start at <b>23</b>. Tap 23, then tap each number you land on as you add 10 three times.', goal: function (s) { return [23, 33, 43, 53].every(function (n) { return s.lit.indexOf(n) >= 0; }); }, yes: '23 + 30 = 53. You moved down 3 rows.' },
          { do: 'Start at <b>58</b>. Add 20. Tap 58 and every number you land on.', goal: function (s) { return [58, 68, 78].every(function (n) { return s.lit.indexOf(n) >= 0; }); }, yes: '58 + 20 = 78.' }
        ] },
        key: '<p>Adding tens is like adding ones: 3 + 2 = 5, so <b>30 + 20 = 50</b>.</p>',
        check: [T('tens'), P('a2-tens', 1)] },
      { id: 'subtens', title: 'Taking away tens', exp: ['B2.3'], skill: 'a2-tens',
        body: '<p>Moving <b>up one row</b> takes away 10. 76 &minus; 30: go up 3 rows to <b>46</b>.</p>',
        watch: K.clip([
          ['Start at 76.', chart(76, 0, [])],
          ['Go up one row for each ten: 66, 56, 46.', chart(76, 46, [66, 56])],
          ['<b>76 &minus; 30 = 46</b>. The ones digit stays 6.', chart(76, 46, [66, 56]), 2200]
        ]),
        example: K.clip([
          ['My turn. I will find 93 &minus; 30. I start at 93.', chart(93, 0, [])],
          ['Each ten moves me up one row: 83, 73, 63.', chart(93, 63, [83, 73])],
          ['I land on 63. <b>93 &minus; 30 = 63</b>. The ones digit stays 3.', chart(93, 63, [83, 73]), 2200]
        ]),
        try: { tool: 'hundred', opts: {}, tasks: [
          { do: 'Show <b>85 &minus; 40</b>. Tap 85, then each number you land on going up.', goal: function (s) { return [85, 75, 65, 55, 45].every(function (n) { return s.lit.indexOf(n) >= 0; }); }, yes: '85 &minus; 40 = 45.' }
        ] },
        key: '<p>Down a row: + 10. Up a row: &minus; 10.</p>',
        check: [P('a2-tens', 2), P('a2-tens', 2)] }
    ] },
    { id: 'add2', title: 'Adding two-digit numbers', sub: 'Tens with tens, ones with ones.', concepts: [
      { id: 'tensones', title: 'Add the tens, then the ones', exp: ['B2.4'], skill: 'a2-add',
        body: '<p>To add <b>34 + 23</b>, add the tens: 30 + 20 = 50. Add the ones: 4 + 3 = 7. Together: <b>57</b>.</p>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'], t: 3, o: 4 }, steps: [
          { say: 'Here is 34: 3 tens and 4 ones.', ms: 1200 },
          { say: 'Add 23. First the 2 tens: 40, 50.', act: function (t) { return t.add('t', 2, 450); } },
          { say: 'Then the 3 ones: 55, 56, 57.', act: function (t) { return t.add('o', 3, 350); } },
          { say: '5 tens and 7 ones. <b>34 + 23 = 57</b>.', act: function (t) { return t.countAll(200); }, ms: 1600 }
        ] },
        example: { tool: 'base10', opts: { cols: ['t', 'o'], t: 2, o: 5 }, steps: [
          { say: 'My turn. I will add 25 + 43. Here is 25: 2 tens and 5 ones.', ms: 1400 },
          { say: 'First I add the 4 tens: 35, 45, 55, 65.', act: function (t) { return t.add('t', 4, 420); } },
          { say: 'Then I add the 3 ones: 66, 67, 68.', act: function (t) { return t.add('o', 3, 380); } },
          { say: '6 tens and 8 ones. <b>25 + 43 = 68</b>.', act: function (t) { return t.countAll(180); }, ms: 1600 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true, t: 4, o: 2 }, tasks: [
          { do: 'There is 42. Add <b>35</b>.', reset: false, goal: function (s) { return s.value === 77; }, yes: '42 + 35 = 77: 7 tens and 7 ones.' },
          { do: 'Start again with 42 and add <b>16</b>.', setup: function (t) { t.set(0, 4, 2); }, reset: false, goal: function (s) { return s.value === 58; }, yes: '42 + 16 = 58.' }
        ] },
        key: '<p>Tens with tens. Ones with ones.</p>',
        check: [P('a2-add', 1), P('a2-add', 1)] },
      { id: 'trade', title: 'Trade 10 ones for a ten', exp: ['B2.4'], skill: 'a2-add', hard: true,
        body: '<p>Sometimes the ones add up to 10 or more. Then we <b>trade</b> 10 ones for 1 ten. 36 + 27: tens make 50, ones make 13. 13 ones is 1 ten and 3 ones. The answer is <b>63</b>.</p>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'], t: 3, o: 6 }, steps: [
          { say: 'Here is 36.', ms: 1000 },
          { say: 'Add 27. First the 2 tens.', act: function (t) { return t.add('t', 2, 350); } },
          { say: 'Then the 7 ones.', act: function (t) { return t.add('o', 7, 250); } },
          { say: 'Now there are 13 ones. That is more than 9.', act: function (t) { return t.lightKind('o', 160); }, ms: 900 },
          { say: 'Trade 10 ones for 1 ten.', act: function (t) { t.clearLit(); return t.group('o'); } },
          { say: '6 tens and 3 ones. <b>36 + 27 = 63</b>.', ms: 2200 }
        ] },
        example: { tool: 'base10', opts: { cols: ['t', 'o'], t: 4, o: 7 }, steps: [
          { say: 'My turn. I will add 47 + 25. Here is 47.', ms: 1200 },
          { say: 'First I add the 2 tens: 57, 67.', act: function (t) { return t.add('t', 2, 380); } },
          { say: 'Then I add the 5 ones.', act: function (t) { return t.add('o', 5, 260); } },
          { say: 'Now there are 12 ones. That is more than 9, so I can make a ten.', act: function (t) { return t.lightKind('o', 150); }, ms: 1000 },
          { say: 'I trade 10 ones for 1 ten.', act: function (t) { t.clearLit(); return t.group('o'); } },
          { say: '7 tens and 2 ones. <b>47 + 25 = 72</b>.', ms: 2000 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true, t: 4, o: 8 }, tasks: [
          { do: 'There is 48. Add <b>35</b>, then group 10 ones into a ten.', reset: false, goal: function (s) { return s.value === 83 && s.o < 10; }, yes: '48 + 35 = 83: 8 tens and 3 ones.' },
          { do: 'Show <b>29 + 45</b>. Build 29, add 45, then trade.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 74 && s.o < 10; }, yes: '29 + 45 = 74.' }
        ] },
        ways: [
          { label: 'Open number line', html: '<p>Start at 36. Jump 20 to 56. Jump 4 to 60, then 3 to 63.</p>' + openLine(36, [20, 4, 3]) },
          { label: 'With numbers', html: '<p class="math">36 + 27</p><p class="math">30 + 20 = 50<br>6 + 7 = 13<br>50 + 13 = <b>63</b></p>' },
          { label: 'Make a ten', html: '<p>Take 4 from the 27 to make 36 into 40. Then 40 + 23 = <b>63</b>.</p>' }
        ],
        key: '<p>10 ones or more? <b>Trade 10 ones for 1 ten.</b></p>',
        mistake: '<p>Writing 513 for 36 + 27 by putting "5 tens" and "13 ones" side by side. Ask the child to show the 13 ones with blocks, then trade 10 of them for a ten.</p>',
        check: [T('add2'), P('a2-add', 2)] }
    ] },
    { id: 'mental', title: 'Mental math to 50', sub: 'Jump in your head.', concepts: [
      { id: 'jumps', title: 'Jump the tens, then the ones', exp: ['B2.3'], skill: 'a2-mental',
        body: '<p>Picture an <b>open number line</b>. Start at the bigger number. Jump the tens, then the ones.</p>',
        watch: { tool: 'numberline', opts: { min: 20, max: 50, every: 5, start: 20 }, steps: [
          { say: '18 + 25. Start at the bigger number, 25.', act: function (t) { return t.moveTo(25); }, ms: 900 },
          { say: 'Jump the ten: 35.', act: function (t) { return t.hop(35, '+10'); } },
          { say: 'Jump the 8 ones: 43.', act: function (t) { return t.hop(43, '+8'); } },
          { say: '<b>18 + 25 = 43</b>.', ms: 2000 }
        ] },
        example: { tool: 'numberline', opts: { min: 20, max: 50, every: 5, start: 20 }, steps: [
          { say: 'My turn. I will add 14 + 23. I start at the bigger number, 23.', act: function (t) { return t.moveTo(23); }, ms: 1100 },
          { say: '14 is 1 ten and 4 ones. First I jump the ten: 33.', act: function (t) { return t.hop(33, '+10'); } },
          { say: 'Then I jump the 4 ones: 37.', act: function (t) { return t.hop(37, '+4'); } },
          { say: '<b>14 + 23 = 37</b>.', ms: 1800 }
        ] },
        try: { tool: 'numberline', opts: { min: 20, max: 50, every: 5, start: 24, step: [10, 1] }, tasks: [
          { do: 'Show <b>24 + 13</b>. Use <b>Jumps of 10</b> once, then <b>Jumps of 1</b> three times.', goal: function (s) { return s.at === 37; }, yes: '24 + 10 = 34, then + 3 = 37.' }
        ] },
        key: '<p>Start big. Jump the tens. Then jump the ones.</p>',
        check: [T('mental'), P('a2-mental', 1)] },
      { id: 'estimate', title: 'Estimate first', exp: ['B2.3'], skill: 'a2-mental',
        body: '<p>An <b>estimate</b> is a close guess. Change each number to its closest ten, then add. 19 + 22 is about <b>20 + 20 = 40</b>.</p>',
        watch: K.clip([
          ['19 + 22. Where is 19? It is close to 20.', openLine(19, [1], 'From 19, 20 is only 1 away')],
          ['22 is close to 20 too.', openLine(20, [2], 'From 20, 22 is 2 more')],
          ['20 + 20 = 40. So 19 + 22 is <b>about 40</b>. The exact answer, 41, is close. It makes sense.', '<p class="math big">19 + 22 &asymp; 20 + 20 = 40</p>', 2400]
        ]),
        example: K.clip([
          ['My turn. I will estimate 29 + 18 first. 29 is close to 30.', openLine(29, [1], 'From 29, 30 is only 1 away')],
          ['18 is close to 20.', openLine(18, [2], 'From 18, 20 is 2 more')],
          ['30 + 20 = 50, so the answer is <b>about 50</b>. I add: 29 + 18 = 47. That is close to 50, so it makes sense.', '<p class="math big">29 + 18 &asymp; 30 + 20 = 50</p>', 2600]
        ]),
        key: '<p>Estimate to check: is my answer about the right size?</p>',
        mistake: '<p>Changing numbers to the closest ten and then reporting the estimate as the exact answer. Ask for both: "about how much?" and "exactly how much?"</p>',
        check: [T('est'), T('est')] },
      { id: 'order', title: 'Add in any order', exp: ['B2.1'], skill: 'a2-mental',
        body: '<p>You can add numbers in any order and group them in any way. Look for pairs that make 10. <b>7 + 8 + 3</b>: 7 + 3 = 10, then 10 + 8 = <b>18</b>.</p>',
        watch: K.clip([
          ['7 + 8 + 3. Look for a pair that makes 10.', '<p class="math big">7 + 8 + 3</p>'],
          ['7 and 3 make 10.', '<p class="math big"><b>7</b> + 8 + <b>3</b></p><p>7 + 3 = 10</p>'],
          ['Then 10 + 8 = <b>18</b>.', '<p class="math big">10 + 8 = 18</p>', 2000]
        ]),
        example: K.clip([
          ['My turn. I will add 6 + 9 + 4. I look for two numbers that make 10.', '<p class="math big">6 + 9 + 4</p>'],
          ['6 and 4 make 10. I add those first.', '<p class="math big"><b>6</b> + 9 + <b>4</b></p><p>6 + 4 = 10</p>'],
          ['Then 10 + 9 = <b>19</b>. I can add in any order. The total stays the same.', '<p class="math big">10 + 9 = 19</p>', 2200]
        ]),
        key: '<p>Find friendly pairs first. The total stays the same.</p>',
        check: [function () { var a = R.int(2, 8), b = 10 - a, c = R.int(3, 9); return { q: '<span class="math big">' + a + ' + ' + c + ' + ' + b + ' = ?</span>', type: 'num', answer: 20 - 10 + c, hint: 'Find two numbers that make 10.', steps: [a + ' + ' + b + ' = 10.', '10 + ' + c + ' = ' + (10 + c) + '.'], explain: a + ' + ' + b + ' = 10, and 10 + ' + c + ' = ' + (10 + c) + '.' }; },
          function () { var a = R.int(12, 25), b = R.int(11, 24), o = R.mc(b + ' + ' + a, [a + ' ' + M + ' ' + b, a + ' + ' + a, b + ' + ' + b]); return { q: 'Which has the same total as <span class="math">' + a + ' + ' + b + '</span>?', type: 'mc', options: o.options, answer: o.answer, hint: 'You can add in any order.', explain: a + ' + ' + b + ' = ' + b + ' + ' + a + ' = ' + (a + b) + '.' }; }] }
    ] },
    { id: 'sub', title: 'Subtracting to 100', sub: 'Jump back, or count up.', concepts: [
      { id: 'back', title: 'Jump back the tens, then the ones', exp: ['B2.4'], skill: 'a2-sub',
        body: '<p>To subtract, start at the whole and <b>jump back</b>: first the tens, then the ones.</p>',
        watch: { tool: 'numberline', opts: { min: 30, max: 60, every: 5, start: 52 }, steps: [
          { say: '52 &minus; 17. Start at 52.', ms: 1000 },
          { say: 'Jump back the ten: 42.', act: function (t) { return t.hop(42, '&minus;10'); } },
          { say: 'Jump back the 7 ones: 35.', act: function (t) { return t.hop(35, '&minus;7'); } },
          { say: '<b>52 &minus; 17 = 35</b>.', ms: 2000 }
        ] },
        example: { tool: 'numberline', opts: { min: 30, max: 70, every: 5, start: 64 }, steps: [
          { say: 'My turn. I will find 64 &minus; 25. I start at 64.', ms: 1100 },
          { say: '25 is 2 tens and 5 ones. I jump back the tens: 54, 44.', act: function (t) { return t.hop(54, '&minus;10').then(function () { return t.hop(44, '&minus;10'); }); } },
          { say: 'Then I jump back the 5 ones: 39.', act: function (t) { return t.hop(39, '&minus;5'); } },
          { say: '<b>64 &minus; 25 = 39</b>.', ms: 1800 }
        ] },
        try: { tool: 'numberline', opts: { min: 40, max: 80, every: 5, start: 73, step: [10, 1] }, tasks: [
          { do: 'Show <b>73 &minus; 28</b>. Use <b>Jump back</b> with jumps of 10 twice, then with jumps of 1 eight times.', goal: function (s) { return s.at === 45; }, yes: '73 &minus; 20 = 53, then &minus; 8 = 45.' }
        ] },
        key: '<p>Start at the whole. Jump back the tens, then the ones.</p>',
        mistake: '<p>For 52 &minus; 17, doing "7 &minus; 2 = 5" in the ones and getting 45. The ones cannot be turned around. Jump back 7 from 42 on a number line instead.</p>',
        check: [T('back'), P('a2-sub', 1)] },
      { id: 'countup', title: 'Count up when numbers are close', exp: ['B2.3', 'B2.4'], skill: 'a2-sub', hard: true,
        body: '<p>When the two numbers are close, <b>count up</b> from the smaller one. 61 &minus; 58: from 58 to 60 is 2, then 1 more to 61. The answer is <b>3</b>.</p>',
        watch: K.clip([
          ['61 &minus; 58. These numbers are close together.', openLine(58, [3], '58 and 61')],
          ['Count up from 58: 2 to get to 60.', openLine(58, [2])],
          ['Then 1 more to 61. 2 + 1 = <b>3</b>. So 61 &minus; 58 = 3.', openLine(58, [2, 1]), 2200]
        ]),
        ways: [
          { label: 'Think addition', html: '<p>61 &minus; 58 asks: 58 plus what makes 61? 58 + 3 = 61. The answer is <b>3</b>.</p>' },
          { label: 'Jump back is slow here', html: '<p>Jumping back 58 from 61 takes many jumps. Counting up takes only two hops. Pick the fast way.</p>' + openLine(61, [-50, -8]) }
        ],
        example: K.clip([
          ['My turn. I will find 72 &minus; 69. These numbers are close, so I count up.', openLine(69, [3], '69 and 72')],
          ['From 69, it is 1 to get to 70.', openLine(69, [1])],
          ['Then 2 more to 72. 1 + 2 = <b>3</b>. So 72 &minus; 69 = 3.', openLine(69, [1, 2]), 2200]
        ]),
        key: '<p>Close numbers: count up from the smaller one.</p>',
        check: [function () { var b = R.int(25, 85), d = R.int(2, 6), a = b + d; return { q: '<span class="math big">' + a + ' ' + M + ' ' + b + ' = ?</span>', type: 'num', answer: d, hint: 'Count up from ' + b + ' to ' + a + '.', steps: ['Start at ' + b + '.', 'Count up to ' + a + '.', 'That is ' + d + '.'], explain: b + ' + ' + d + ' = ' + a + ', so ' + a + ' ' + M + ' ' + b + ' = ' + d + '.' }; }, P('a2-sub', 2)] }
    ] },
    { id: 'story', title: 'Story problems', sub: 'Find the whole or a part.', concepts: [
      { id: 'story', title: 'Parts and wholes in stories', exp: ['B2.4'], skill: 'a2-story',
        body: '<p>Read the story and ask: do I know <b>both parts</b>, or the <b>whole and one part</b>? Draw a bar to see it.</p>',
        watch: K.clip([
          ['A class has 26 girls and 29 boys. How many children in all?', bar(26, 29, 'w')],
          ['Both parts are known, so add: 26 + 29 = <b>55</b>.', bar(26, 29)],
          ['A bus has 64 seats. 38 people sit down. How many seats are empty?', bar(38, 26, 'b')],
          ['The whole and one part are known, so subtract: 64 &minus; 38 = <b>26</b>.', bar(38, 26), 2200]
        ]),
        example: K.clip([
          ['My turn. A shelf has 35 big books and 18 small books. How many books in all?', bar(35, 18, 'w')],
          ['I know both parts. I want the whole, so I add: 35 + 18 = <b>53</b>.', bar(35, 18)],
          ['Next: a box holds 70 crayons. 45 are used. How many are left in the box?', bar(45, 25, 'b')],
          ['I know the whole and one part, so I subtract: 70 &minus; 45 = <b>25</b>.', bar(45, 25), 2200]
        ]),
        key: '<p>Both parts known: <b>add</b>. Whole and one part known: <b>subtract</b>.</p>',
        mistake: '<p>Picking the operation from one word ("more" means add). Ask: "Is the big number the whole or a part?" and draw the bar.</p>',
        check: [T('story'), P('a2-story', 2)] }
    ] }
  ];

  A.register('add-subtract-100', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Adding tens</h2>' +
'<p>On a hundred chart, moving <b>down one row</b> adds 10. Moving <b>right one square</b> adds 1.</p>' +
'<div class="eg"><b class="t">Watch me</b><p><span class="big">34 + 20</span> &nbsp; I start at 34 and move down 2 rows: 44, 54. So 34 + 20 = <b>54</b>. The ones digit stays 4. Only the tens change.</p>' +
'<div class="fig">' + chart(34, 54, [44]) + '</div></div>' +
'<div class="yt" data-yt="tens"></div>' +
'<div class="lab"><span class="lt">Try it: move on the hundred chart</span>' +
'<div class="ctrl"><label for="hs">Start at<input type="number" id="hs" min="1" max="99" value="23"></label><label for="ht">Add tens<select id="ht"><option>0</option><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option></select></label><label for="ho">Add ones<select id="ho"><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option selected>5</option><option>6</option><option>7</option><option>8</option><option>9</option></select></label></div>' +
'<div class="fig" id="hfig"></div><div class="out" id="hout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Adding tens is like adding ones, with tens: 3 + 2 = 5, so 30 + 20 = 50.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Adding two-digit numbers</h2>' +
'<p>Add the <b>tens</b>, then add the <b>ones</b>. If there are 10 or more ones, trade 10 ones for 1 ten.</p>' +
'<div class="eg"><b class="t">Watch me</b><p><span class="big">36 + 27</span> &nbsp; Tens: 30 + 20 = 50. Ones: 6 + 7 = 13. 13 ones is 1 ten and 3 ones. 50 + 13 = <b>63</b>.</p>' + pair(36, 27) +
'<div class="fig">' + D.base10(0, 6, 3, { u: 7, label: '6 tens and 3 ones after trading, which is 63' }) + '</div><p class="t2" style="text-align:center">After trading: 6 tens and 3 ones.</p></div>' +
'<div class="yt" data-yt="add2"></div>' +
'<div class="lab"><span class="lt">Try it: add with blocks</span>' +
'<div class="ctrl"><label for="aa">First number<input type="number" id="aa" min="0" max="99" value="48"></label><label for="ab">Second number<input type="number" id="ab" min="0" max="99" value="35"></label></div>' +
'<div id="afig"></div><div class="btnrow"><button type="button" class="btn" id="ago">Put them together</button><button type="button" class="btn alt" id="atr">Trade 10 ones for 1 ten</button></div><div class="fig" id="afig2"></div><div class="out" id="aout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Writing 513 for 36 + 27, by putting 5 tens and 13 ones side by side. 13 ones must be traded: it is 1 ten and 3 ones. The answer is 63.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Mental math to 50</h2>' +
'<p>You can add in your head with jumps on an <b>open number line</b>: jump the tens, then jump the ones.</p>' +
'<div class="eg"><b class="t">Watch me</b><p><span class="big">18 + 25</span> &nbsp; I start at 25, the bigger number. Jump 10 to 35. Then jump 8 to 43. So 18 + 25 = <b>43</b>.</p>' +
'<div class="fig">' + openLine(25, [10, 8]) + '</div></div>' +
'<div class="yt" data-yt="mental"></div>' +
'<p><b>Estimate</b> first to know about how big the answer should be. Use the closest ten for each number.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>Estimate 19 + 22. 19 is close to 20. 22 is close to 20. 20 + 20 = 40, so the answer is <b>about 40</b>. The exact answer is 41. That is close to 40, so it makes sense.</p></div>' +
'<div class="yt" data-yt="est"></div>' +
'<div class="key"><b class="t">Key idea</b><p>Adding numbers in a different order or in different groups gives the same total. 18 + 25 = 25 + 18. Pick the order that is easiest.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Subtracting to 100</h2>' +
'<p>To subtract, you can <b>jump back</b> on a number line: jump back the tens, then the ones.</p>' +
'<div class="eg"><b class="t">Watch me</b><p><span class="big">52 ' + M + ' 17</span> &nbsp; Start at 52. Jump back 10 to 42. Jump back 7 to 35. So 52 ' + M + ' 17 = <b>35</b>.</p>' +
'<div class="fig">' + openLine(52, [-10, -7]) + '</div></div>' +
'<div class="yt" data-yt="back"></div>' +
'<p>You can also <b>count up</b> from the smaller number. This works well when the numbers are close together.</p>' +
'<div class="eg"><b class="t">Watch me</b><p><span class="big">61 ' + M + ' 58</span> &nbsp; From 58, count up 2 to 60, then 1 more to 61. That is 3 in all. So 61 ' + M + ' 58 = <b>3</b>.</p>' +
'<div class="fig">' + openLine(58, [2, 1]) + '</div></div>' +
'<div class="lab"><span class="lt">Try it: jump back</span>' +
'<div class="ctrl"><label for="sa">Start at<input type="number" id="sa" min="0" max="100" value="73"></label><label for="sb">Take away<input type="number" id="sb" min="0" max="100" value="28"></label></div>' +
'<div class="fig" id="sfig"></div><div class="out" id="sout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>For 52 ' + M + ' 17, taking 2 ' + M + ' 7 as "7 ' + M + ' 2 = 5" and getting 45. You cannot turn it around. Jump back the 7 on a number line instead: 42, then back 7 is 35.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Story problems</h2>' +
'<p>Read the story and ask: do I know the whole, or the parts? Draw a bar to see it.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>A class has 26 girls and 29 boys. How many children in all? I know both <b>parts</b>, so I add: 26 + 29 = <b>55</b>.</p>' + bar(26, 29, 'w') + '</div>' +
'<div class="eg"><b class="t">Watch me</b><p>A bus has 64 seats. 38 people are sitting. How many seats are empty? I know the <b>whole</b> and one part, so I subtract: 64 ' + M + ' 38 = <b>26</b>.</p>' + bar(38, 26, 'b') + '</div>' +
'<div class="yt" data-yt="story"></div>' +
'<div class="key"><b class="t">Key idea</b><p>Know both parts? Add to find the whole. Know the whole and one part? Subtract to find the other part.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function h() {
        var s = Math.max(1, Math.min(99, parseInt($('#hs', root).value, 10) || 1)), t = +$('#ht', root).value, o = +$('#ho', root).value, e = s + 10 * t + o;
        if (e > 100) { $('#hfig', root).innerHTML = chart(s, 0, []); $('#hout', root).innerHTML = '<p>' + s + ' + ' + (10 * t + o) + ' is more than 100, so it goes off this chart. Try a smaller start.</p>'; return; }
        var p = tensOnesPath(s, t, o);
        $('#hfig', root).innerHTML = chart(s, e, p.slice(0, -1));
        $('#hout', root).innerHTML = '<p><span class="big">' + s + ' + ' + (10 * t + o) + ' = ' + e + '</span></p><p class="t2">' + (t ? 'Down ' + t + ' row' + (t > 1 ? 's' : '') + ' for ' + 10 * t + '. ' : '') + (o ? 'Right ' + o + ' square' + (o > 1 ? 's' : '') + ' for ' + o + '.' : '') + ' At the end of a row, keep going on the next row.</p>';
      }
      A.bind(root, ['hs', 'ht', 'ho'], h);
      var stage = 0;
      function ad() {
        var a = Math.max(0, Math.min(99, parseInt($('#aa', root).value, 10) || 0)), b = Math.max(0, Math.min(99, parseInt($('#ab', root).value, 10) || 0));
        var t = tens(a) + tens(b), o = a % 10 + b % 10;
        $('#afig', root).innerHTML = pair(a, b);
        $('#ago', root).disabled = stage > 0;
        $('#atr', root).disabled = !(stage === 1 && o >= 10);
        if (stage === 0) { $('#afig2', root).innerHTML = ''; $('#aout', root).innerHTML = ''; return; }
        var tt = stage === 2 ? t + 1 : t, oo = stage === 2 ? o - 10 : o;
        $('#afig2', root).innerHTML = D.base10(Math.floor(tt / 10), tt % 10, oo, { u: 7, label: tt + ' tens and ' + oo + ' ones' }).replace('<svg', '<svg');
        $('#aout', root).innerHTML = '<p>' + tt + ' tens and ' + oo + ' ones' + (stage === 1 && o >= 10 ? '. That is 10 or more ones, so trade 10 of them for a ten.' : '.') + '</p>' +
          (stage === 2 || o < 10 ? '<p><span class="big">' + a + ' + ' + b + ' = ' + (a + b) + '</span></p>' : '');
      }
      $('#ago', root).addEventListener('click', function () { stage = 1; ad(); });
      $('#atr', root).addEventListener('click', function () { stage = 2; ad(); });
      ['aa', 'ab'].forEach(function (k) { $('#' + k, root).addEventListener('input', function () { stage = 0; ad(); }); });
      ad();
      function sb() {
        var a = Math.max(0, Math.min(100, parseInt($('#sa', root).value, 10) || 0)), b = Math.max(0, Math.min(100, parseInt($('#sb', root).value, 10) || 0));
        if (b > a) { $('#sfig', root).innerHTML = ''; $('#sout', root).innerHTML = '<p>Take away a number that is not more than ' + a + '.</p>'; return; }
        var j = [-tens(b) * 10, -(b % 10)].filter(function (x) { return x; });
        $('#sfig', root).innerHTML = j.length ? openLine(a, j) : '';
        $('#sout', root).innerHTML = '<p><span class="big">' + a + ' ' + M + ' ' + b + ' = ' + (a - b) + '</span></p><p class="t2">Check by adding: ' + (a - b) + ' + ' + b + ' = ' + a + '.</p>';
      }
      A.bind(root, ['sa', 'sb'], sb);
    },

    turns: {
      tens: function () { var a = R.int(11, 59), t = R.int(1, 4) * 10; return { q: '<span class="math big">' + a + ' + ' + t + ' = ?</span>', type: 'num', answer: a + t, fig: chart(a, 0, []), hint: 'Find ' + a + ' on the chart. Move down one row for each ten.', explain: 'Down ' + t / 10 + ' row' + (t > 10 ? 's' : '') + ' from ' + a + ' is ' + (a + t) + '. The ones digit stays ' + a % 10 + '.' }; },
      add2: function () { var a = R.int(14, 48), b = R.int(15, 49 - (a % 10 > 5 ? 0 : 0)); if (a + b > 100) b = 100 - a - 3; return { q: '<span class="math big">' + a + ' + ' + b + ' = ?</span>', type: 'num', answer: a + b, fig: pair(a, b), hint: 'Add the tens first: ' + tens(a) * 10 + ' + ' + tens(b) * 10 + '. Then add the ones: ' + a % 10 + ' + ' + b % 10 + '.', explain: addSteps(a, b).join(' ') }; },
      mental: function () { var a = R.int(11, 19), b = R.int(21, 29); return { q: '<span class="math big">' + a + ' + ' + b + ' = ?</span> Start at ' + b + '.', type: 'num', answer: a + b, hint: 'From ' + b + ', jump 10 to ' + (b + 10) + '. Then jump ' + (a - 10) + ' more.', explain: b + ' + 10 = ' + (b + 10) + ', then + ' + (a - 10) + ' = ' + (a + b) + '.' }; },
      est: function () { var a = R.pick([19, 21, 29, 31, 18, 22]), b = R.pick([11, 19, 21, 9, 12]); var e = Math.round(a / 10) * 10 + Math.round(b / 10) * 10; var o = R.mc(String(e), [String(e + 20), String(e - 20 > 0 ? e - 20 : e + 30), String(a + b + 10)]); return { q: 'Estimate. <span class="math big">' + a + ' + ' + b + '</span> is about&hellip;', type: 'mc', options: o.options, answer: o.answer, hint: 'Change each number to its closest ten, then add the tens.', explain: a + ' is close to ' + Math.round(a / 10) * 10 + ' and ' + b + ' is close to ' + Math.round(b / 10) * 10 + '. About ' + e + '. (Exactly ' + (a + b) + '.)' }; },
      back: function () { var a = R.int(45, 95), b = R.int(12, 39); while (b % 10 === 0 || b > a) b = R.int(12, 39); return { q: '<span class="math big">' + a + ' ' + M + ' ' + b + ' = ?</span>', type: 'num', answer: a - b, hint: 'Jump back ' + tens(b) * 10 + ' from ' + a + '. Then jump back ' + b % 10 + ' more.', explain: a + ' ' + M + ' ' + tens(b) * 10 + ' = ' + (a - tens(b) * 10) + ', then ' + M + ' ' + b % 10 + ' = ' + (a - b) + '.' }; },
      story: function () {
        var k = R.int(0, 1), a = R.int(15, 45), b = R.int(12, 40);
        if (k) return { q: 'A shelf holds ' + (a + b) + ' books. ' + a + ' books are on it now. How many more books will fit?', type: 'num', answer: b, fig: bar(a, b, 'b'), hint: 'You know the whole (' + (a + b) + ') and one part (' + a + '). Subtract.', explain: (a + b) + ' ' + M + ' ' + a + ' = ' + b + '.' };
        return { q: 'Jo picked ' + a + ' apples. Tia picked ' + b + ' apples. How many apples in all?', type: 'num', answer: a + b, fig: bar(a, b, 'w'), hint: 'You know both parts. Add them.', explain: a + ' + ' + b + ' = ' + (a + b) + '.' };
      }
    },

    quiz: [
      { q: '<span class="math big">46 + 30 = ?</span>', type: 'num', answer: 76, hint: 'Add 3 tens. The ones digit stays 6.', explain: '4 tens + 3 tens = 7 tens. 46 + 30 = 76.' },
      { q: '<span class="math big">38 + 45 = ?</span>', type: 'num', answer: 83, fig: pair(38, 45), hint: 'Tens: 30 + 40. Ones: 8 + 5. Is that 10 or more ones?', explain: '30 + 40 = 70. 8 + 5 = 13. 70 + 13 = 83.' },
      { q: '<span class="math big">23 + 19 = ?</span>', type: 'num', answer: 42, fig: openLine(23, [10, 9]), hint: 'Start at 23. Jump 10, then jump 9.', explain: '23 + 10 = 33, then 33 + 9 = 42.' },
      { q: '<span class="math big">70 &minus; 26 = ?</span>', type: 'num', answer: 44, hint: 'Jump back 20 from 70. Then jump back 6.', explain: '70 &minus; 20 = 50. 50 &minus; 6 = 44.' },
      { q: 'Which is the best estimate for <span class="math">29 + 32</span>?', type: 'mc', options: ['about 40', 'about 50', 'about 60', 'about 70'], answer: 2, hint: 'Change 29 and 32 to their closest tens.', explain: '29 is close to 30 and 32 is close to 30. 30 + 30 = 60. (Exactly 61.)' },
      { q: 'A box has 50 crackers. Ravi eats 12. How many crackers are left?', type: 'num', answer: 38, fig: bar(12, 38, 'b'), hint: 'You know the whole (50) and one part (12). Subtract.', explain: '50 &minus; 10 = 40, then 40 &minus; 2 = 38.' },
      { q: 'Which number sentence matches? <i>Kim has 34 shells. She finds some more. Now she has 52.</i>', type: 'mc', options: ['34 + 52 = &#9633;', '34 + &#9633; = 52', '52 + &#9633; = 34', '&#9633; &minus; 34 = 52'], answer: 1, hint: 'She starts with 34, adds an unknown amount, and ends with 52.', explain: '34 plus the shells she found equals 52: 34 + &#9633; = 52. The box is 18.' }
    ],

    practice: [
      { id: 'a2-tens', name: 'Add and take away tens', code: 'B2.3', gen: function (lv) {
        var a = lv === 1 ? R.int(1, 5) * 10 : R.int(11, 59), t = R.int(1, 4) * 10, sub = lv === 3 && R.int(0, 1);
        if (sub) { a = R.int(45, 99); t = R.int(1, 4) * 10; return { q: '<span class="math big">' + a + ' ' + M + ' ' + t + ' = ?</span>', type: 'num', answer: a - t, fig: '', hint: 'Take away ' + t / 10 + ' tens. The ones digit stays ' + a % 10 + '.', steps: [a + ' has ' + tens(a) + ' tens.', tens(a) + ' tens ' + M + ' ' + t / 10 + ' tens = ' + (tens(a) - t / 10) + ' tens.', 'The ones stay ' + a % 10 + ': ' + (a - t) + '.'], explain: a + ' ' + M + ' ' + t + ' = ' + (a - t) + '.' }; }
        return { q: '<span class="math big">' + a + ' + ' + t + ' = ?</span>', type: 'num', answer: a + t, fig: lv === 1 ? D.base10(0, tens(a) + t / 10, 0, { u: 7, label: (tens(a) + t / 10) + ' ten rods' }) : lv === 2 ? chart(a, 0, []) : '', hint: 'Add the tens. The ones digit stays ' + a % 10 + '.', steps: [a + ' has ' + tens(a) + ' tens.', tens(a) + ' + ' + t / 10 + ' = ' + (tens(a) + t / 10) + ' tens.', 'The ones stay ' + a % 10 + ': ' + (a + t) + '.'], explain: a + ' + ' + t + ' = ' + (a + t) + '.' };
      } },
      { id: 'a2-add', name: 'Add two-digit numbers', code: 'B2.4', gen: function (lv) {
        var a, b;
        if (lv === 1) { a = R.int(1, 5) * 10 + R.int(1, 4); b = R.int(1, 4) * 10 + R.int(1, 5); }
        else { a = R.int(1, 6) * 10 + R.int(5, 9); b = R.int(1, 2) * 10 + R.int(10 - a % 10, 9); }
        if (lv === 3) return { q: 'What number goes in the box? <span class="math big">' + a + ' + &#9633; = ' + (a + b) + '</span>', type: 'num', answer: b, fig: bar(a, b, 'b'), hint: 'Count up from ' + a + ' to ' + (a + b) + ' with jumps: first to the next ten.', steps: ['From ' + a + ', jump ' + (10 - a % 10) + ' to ' + (a + 10 - a % 10) + '.', 'Then jump to ' + (a + b) + ': that is ' + (a + b - (a + 10 - a % 10)) + ' more.', 'Total jumps: ' + (10 - a % 10) + ' + ' + (a + b - (a + 10 - a % 10)) + ' = ' + b + '.'], explain: a + ' + ' + b + ' = ' + (a + b) + '.' };
        return { q: '<span class="math big">' + a + ' + ' + b + ' = ?</span>', type: 'num', answer: a + b, fig: pair(a, b), hint: 'Add the tens. Then add the ones. Trade if there are 10 or more ones.', steps: addSteps(a, b), explain: a + ' + ' + b + ' = ' + (a + b) + '.' };
      } },
      { id: 'a2-sub', name: 'Subtract to 100', code: 'B2.4', gen: function (lv) {
        var a, b;
        if (lv === 1) { a = R.int(3, 9) * 10 + R.int(5, 9); b = R.int(1, tens(a) - 1) * 10 + R.int(1, a % 10); }
        else if (lv === 2) { a = R.int(4, 9) * 10 + R.int(0, 4); b = R.int(1, 3) * 10 + R.int(a % 10 + 1, 9); }
        else { a = R.int(3, 10) * 10; b = R.int(11, a - 5); if (b % 10 === 0) b++; }
        return { q: '<span class="math big">' + a + ' ' + M + ' ' + b + ' = ?</span>', type: 'num', answer: a - b, fig: lv === 1 ? pair(a, b, M) : '', hint: 'Jump back ' + tens(b) * 10 + ', then jump back ' + b % 10 + '.', steps: subSteps(a, b), explain: a + ' ' + M + ' ' + b + ' = ' + (a - b) + '. Check: ' + (a - b) + ' + ' + b + ' = ' + a + '.' };
      } },
      { id: 'a2-mental', name: 'Mental math and estimating', code: 'B2.3', gen: function (lv) {
        if (lv === 3) {
          var x = R.int(11, 29), y = R.int(11, 24), e = Math.round(x / 10) * 10 + Math.round(y / 10) * 10;
          var o = R.mc(String(e), [String(e + 10), String(e - 10), String(e + 20)]);
          return { q: 'Estimate. <span class="math big">' + x + ' + ' + y + '</span> is about&hellip;', type: 'mc', options: o.options, answer: o.answer, hint: 'Change each number to its closest ten.', steps: [x + ' is closest to ' + Math.round(x / 10) * 10 + '.', y + ' is closest to ' + Math.round(y / 10) * 10 + '.', 'Add the tens: ' + e + '.'], explain: 'About ' + e + '. (Exactly ' + (x + y) + '.)' };
        }
        var a = R.int(lv === 1 ? 10 : 12, lv === 1 ? 30 : 29), b = lv === 1 ? R.pick([5, 8, 9, 10, 11]) : R.int(11, 19);
        if (a + b > 50) a = 50 - b;
        var big = Math.max(a, b), small = Math.min(a, b), j = [tens(small) * 10, small % 10].filter(function (q) { return q; });
        return { q: '<span class="math big">' + a + ' + ' + b + ' = ?</span>', type: 'num', answer: a + b, hint: 'Start at ' + big + '. Jump ' + (tens(small) ? 'the tens, then the ones' : small) + '.', steps: ['Start at the bigger number, ' + big + '.', 'Jump ' + j.join(', then jump ') + '.', 'You land on ' + (a + b) + '.<div class="fig">' + openLine(big, j) + '</div>'], explain: a + ' + ' + b + ' = ' + (a + b) + '.' };
      } },
      { id: 'a2-story', name: 'Story problems to 100', code: 'B2.4', gen: function (lv) {
        var a = R.int(12, 48), b = R.int(11, 45), w = a + b, kind = lv === 1 ? 0 : lv === 2 ? R.int(0, 1) : R.int(1, 2);
        var nm = R.pick(['Ava', 'Ben', 'Raj', 'Lin', 'Zoe', 'Tom']);
        if (kind === 0) return { q: nm + ' has ' + a + ' blue blocks and ' + b + ' yellow blocks. How many blocks in all?', type: 'num', answer: w, fig: bar(a, b, 'w'), hint: 'You know both parts. Add.', steps: ['Both parts are known: ' + a + ' and ' + b + '.'].concat(addSteps(a, b)), explain: a + ' + ' + b + ' = ' + w + '.' };
        if (kind === 1) return { q: 'There are ' + w + ' children at the park. ' + a + ' go home. How many are still at the park?', type: 'num', answer: b, fig: bar(a, b, 'b'), hint: 'You know the whole (' + w + ') and one part (' + a + '). Subtract.', steps: subSteps(w, a), explain: w + ' ' + M + ' ' + a + ' = ' + b + '.' };
        return { q: nm + ' has ' + w + ' stickers. Sam has ' + a + ' stickers. How many <b>more</b> stickers does ' + nm + ' have?', type: 'num', answer: b, fig: bar(a, b, 'b'), hint: '"How many more" means find the difference. Subtract ' + w + ' ' + M + ' ' + a + ', or count up from ' + a + '.', steps: subSteps(w, a), explain: w + ' ' + M + ' ' + a + ' = ' + b + '.' };
      } }
    ]
  });
  /* part-part-whole bar: hide 'w' or 'b' to put a ? there */
  function bar(a, b, hide) {
    var W = 460, u = (W - 8) / (a + b), s = '';
    s += D.rr(4, 4, W - 8, 42, 10, 'color-mix(in srgb,var(--strand) 18%,var(--card))', 'style="stroke:var(--ink)" stroke-width="2.5"');
    s += '<text x="' + W / 2 + '" y="33" text-anchor="middle" font-size="22" font-weight="800">' + (hide === 'w' ? '?' : a + b) + '</text>';
    s += D.rr(4, 54, a * u, 42, 10, 'var(--strand)', 'style="stroke:var(--ink)" stroke-width="2.5"') + D.rr(4 + a * u, 54, b * u, 42, 10, 'var(--hi)', 'style="stroke:var(--ink)" stroke-width="2.5"');
    s += '<text x="' + (4 + a * u / 2) + '" y="83" text-anchor="middle" font-size="22" font-weight="800" style="fill:#fff">' + a + '</text>';
    s += '<text x="' + (4 + a * u + b * u / 2) + '" y="83" text-anchor="middle" font-size="22" font-weight="800" style="fill:#2b2118">' + (hide === 'b' ? '?' : b) + '</text>';
    return '<div class="fig">' + A.svg(W, 100, s, 'Bar model. Whole ' + (hide === 'w' ? 'unknown' : a + b) + '. Parts ' + a + ' and ' + (hide === 'b' ? 'unknown' : b) + '.') + '</div>';
  }
  /* ---------- more ways to ask each practice skill (answer checks: tests/verify/grade2.js) ---------- */
  var why = K.why, who = K.who;
  function noTrade(lv) { var a = R.int(1, 5) * 10 + R.int(1, 4), b = R.int(1, 4) * 10 + R.int(1, 5); return lv === 1 ? [a, b] : [R.int(1, 6) * 10 + R.int(5, 9), 0]; }
  function addPair(lv) { var p = noTrade(lv); if (lv > 1) p[1] = R.int(1, 2) * 10 + R.int(10 - p[0] % 10, 9); return p; }
  Atlas.Q.shapes(CH, {
    'a2-tens': [
      [1, 'fill', function (lv) {
        var a = lv === 1 ? R.int(1, 5) * 10 : R.int(11, 59);
        return { q: 'Add ten each time. Fill in the blanks.', type: 'fill', fill: '<span class="math">' + a + ', [[]], [[]], [[]]</span>', answers: [a + 10, a + 20, a + 30],
          hint: 'Adding 10 makes the tens digit go up by 1. The ones digit stays the same.', steps: [a + ' + 10 = ' + (a + 10) + '.'],
          explain: a + ', ' + (a + 10) + ', ' + (a + 20) + ', ' + (a + 30) + '.', meta: { k: 'a2-tens-fill', a: a } };
      }],
      [1, 'build', function (lv) {
        var a = lv === 1 ? R.int(1, 5) * 10 + R.int(0, 5) : R.int(11, 59), t = R.int(1, 4) * 10;
        return { q: 'Show <span class="math">' + a + ' + ' + t + '</span> with base-ten blocks. Then press Check.', type: 'build', tool: 'base10', answer: a + t,
          hint: 'Start with ' + a + '. Then add ' + t / 10 + ' more rods.', steps: [a + ' is ' + tens(a) + ' rods and ' + a % 10 + ' cubes.', 'Add ' + t / 10 + ' rods: ' + (tens(a) + t / 10) + ' rods and ' + a % 10 + ' cubes.'],
          explain: a + ' + ' + t + ' = ' + (a + t) + '.', meta: { k: 'a2-tens-build', a: a, t: t } };
      }],
      [2, 'mistake', function (lv) {
        var a = R.int(21, 59), t = R.int(2, 4) * 10, name = who(), truth = !R.int(0, 2), said = truth ? a + t : a + t / 10;
        var right = 'Adding ' + t + ' adds ' + t / 10 + ' tens. ' + a + ' + ' + t + ' = ' + (a + t) + '. The ones digit stays ' + a % 10 + '.';
        return { q: name + ' says <span class="math big">' + a + ' + ' + t + ' = ' + said + '</span>. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Adding ' + t + ' adds ' + t / 10 + ' ones.', 'Adding tens changes the ones digit.', 'Add 1 to both digits.']),
          hint: 'How many tens is ' + t + '?', steps: [right], explain: right, meta: { k: 'a2-tens-tf', a: a, t: t, said: said } };
      }]
    ],
    'a2-add': [
      [1, 'build', function (lv) {
        var p = addPair(lv);
        return { q: 'Show <span class="math">' + p[0] + ' + ' + p[1] + '</span> with base-ten blocks. Then press Check.', type: 'build', tool: 'base10', answer: p[0] + p[1],
          hint: 'Put the rods together, then the cubes. Ten cubes make one rod.', steps: addSteps(p[0], p[1]),
          explain: p[0] + ' + ' + p[1] + ' = ' + (p[0] + p[1]) + '.', meta: { k: 'a2-add-build', a: p[0], b: p[1] } };
      }],
      [1, 'fill', function (lv) {
        var p = addPair(lv), a = p[0], b = p[1];
        return { q: 'Add tens, then ones. Fill in the blanks for <span class="math">' + a + ' + ' + b + '</span>.', type: 'fill', fill: 'Tens: ' + tens(a) * 10 + ' + ' + tens(b) * 10 + ' = [[]]<br>Ones: ' + a % 10 + ' + ' + b % 10 + ' = [[]]<br>Total: [[]]', answers: [(tens(a) + tens(b)) * 10, a % 10 + b % 10, a + b],
          hint: 'Add the tens first. Then add the ones. Then put them together.', steps: addSteps(a, b),
          explain: a + ' + ' + b + ' = ' + (a + b) + '.', meta: { k: 'a2-add-fill', a: a, b: b } };
      }],
      [2, 'mistake', function (lv) {
        var a = R.int(1, 5) * 10 + R.int(5, 9), b = R.int(1, 3) * 10 + R.int(10 - a % 10, 9), name = who(), truth = !R.int(0, 2);
        var said = truth ? a + b : (tens(a) + tens(b)) * 10 + (a + b) % 10;
        var right = (a % 10) + ' + ' + (b % 10) + ' = ' + (a % 10 + b % 10) + ' ones. Trade 10 ones for 1 ten. ' + a + ' + ' + b + ' = ' + (a + b) + '.';
        return { q: name + ' says <span class="math big">' + a + ' + ' + b + ' = ' + said + '</span>. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Only write the ones digit. The extra ten does not count.', 'Add the tens and forget the ones.', 'Always subtract the smaller digit.']),
          hint: 'Add the ones first. Are there 10 or more?', steps: [right], explain: right, meta: { k: 'a2-add-tf', a: a, b: b, said: said } };
      }]
    ],
    'a2-sub': [
      [1, 'line', function (lv) {
        var a = R.int(4, 9) * 10 + R.int(0, 9), b = lv === 1 ? R.int(1, 3) * 10 : R.int(11, 29);
        return { q: 'Start at <b>' + a + '</b>. Jump back <b>' + b + '</b>. Where do you land?', type: 'line', min: 0, max: 100, tick: 5, every: 10, snap: 1, answer: a - b, hideValue: true,
          hint: 'Jump back ' + tens(b) * 10 + (b % 10 ? ', then ' + b % 10 + ' more' : '') + '.', steps: subSteps(a, b),
          explain: a + ' ' + M + ' ' + b + ' = ' + (a - b) + '.', meta: { k: 'a2-sub-line', a: a, b: b } };
      }],
      [1, 'match', function (lv) {
        var p = [], seen = {};
        while (p.length < 3) {
          var a = R.int(3, 9) * 10 + R.int(5, 9), b = R.int(1, tens(a) - 1) * 10 + (lv === 1 ? R.int(1, a % 10) : R.int(1, 9));
          if (seen[a - b]) continue; seen[a - b] = 1; p.push([a + ' ' + M + ' ' + b, String(a - b)]);
        }
        return { q: 'Match each subtraction to its answer.', type: 'match', pairs: p,
          hint: 'Take away the tens first, then the ones.', steps: ['Do one card at a time.'],
          explain: p.map(function (x) { return x[0] + ' = ' + x[1]; }).join('. ') + '.', meta: { k: 'a2-sub-match', pairs: p } };
      }],
      [2, 'mistake', function (lv) {
        var a = R.int(4, 9) * 10 + R.int(1, 4), b = R.int(1, 3) * 10 + R.int(a % 10 + 1, 9), name = who(), truth = !R.int(0, 2);
        var said = truth ? a - b : (tens(a) - tens(b)) * 10 + (b % 10 - a % 10);
        var right = 'You cannot take ' + b % 10 + ' ones from ' + a % 10 + ' ones, so trade a ten. ' + a + ' ' + M + ' ' + b + ' = ' + (a - b) + '.';
        return { q: name + ' says <span class="math big">' + a + ' ' + M + ' ' + b + ' = ' + said + '</span>. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Take the smaller ones digit from the bigger one.', 'Subtract the tens and keep the ones the same.', 'Count up and add 10.']),
          hint: 'Look at the ones. Is ' + a % 10 + ' enough to take away ' + b % 10 + '?', steps: [right], explain: right, meta: { k: 'a2-sub-tf', a: a, b: b, said: said } };
      }]
    ],
    'a2-mental': [
      [1, 'nearten', function (lv) {
        var n = R.int(11, 89); if (n % 10 === 5 || n % 10 === 0) n += 2;
        var lo = tens(n) * 10, hi = lo + 10;
        return { q: 'Which ten is <b>' + n + '</b> closest to?', type: 'mc', options: [String(lo), String(hi)], answer: n % 10 < 5 ? 0 : 1, fig: D.hops({ min: lo, max: hi, tick: 1, every: 5, id: 'nt', hops: [], marks: [{ v: n, col: 'var(--hi)' }] }),
          hint: n + ' is between ' + lo + ' and ' + hi + '. Which is fewer steps away?', steps: [n + ' is ' + (n - lo) + ' from ' + lo + ' and ' + (hi - n) + ' from ' + hi + '.'],
          explain: n + ' is closest to ' + (n % 10 < 5 ? lo : hi) + '.', meta: { k: 'a2-near10', n: n } };
      }],
      [1, 'match', function (lv) {
        var p = [], seen = {};
        while (p.length < 3) { var n = R.int(11, 89); if (n % 10 === 5 || n % 10 === 0) continue; var r = Math.round(n / 10) * 10; if (seen[r]) continue; seen[r] = 1; p.push([String(n), String(r)]); }
        return { q: 'Match each number to its closest ten.', type: 'match', pairs: p,
          hint: 'Look at the ones digit. 1 to 4: go down. 6 to 9: go up.', steps: ['Do one number at a time.'],
          explain: p.map(function (x) { return x[0] + ' is closest to ' + x[1]; }).join('. ') + '.', meta: { k: 'a2-near-match', pairs: p } };
      }],
      [2, 'pick', function (lv) {
        var target = R.pick([40, 50, 60]), opts = [], seen = {}, hits = 0;
        while (opts.length < 5) {
          var x = R.int(11, 39), y = R.int(11, 39); if (x % 10 === 5 || y % 10 === 5) continue;
          var on = Math.round(x / 10) * 10 + Math.round(y / 10) * 10 === target, s2 = x + ' + ' + y;
          if (seen[s2] || (on ? hits >= 2 : opts.length - hits >= 3)) continue;
          seen[s2] = 1; opts.push(s2); if (on) hits++;
        }
        opts = R.shuffle(opts);
        var ans = opts.map(function (t, j) { var p = t.split(' + ').map(Number); return Math.round(p[0] / 10) * 10 + Math.round(p[1] / 10) * 10 === target ? j : -1; }).filter(function (j) { return j >= 0; });
        return { q: 'Estimate. Pick every sum that is <b>about ' + target + '</b>.', type: 'pick', options: opts, answer: ans,
          hint: 'Change each number to its closest ten. Then add the tens.', steps: ['For example, 23 + 28 is about 20 + 30 = 50.'],
          explain: ans.map(function (j) { return opts[j]; }).join(', ') + ' ' + (ans.length > 1 ? 'are' : 'is') + ' about ' + target + '.', meta: { k: 'a2-est-pick', opts: opts, target: target } };
      }],
      [2, 'mistake', function (lv) {
        var a = R.int(21, 79), b = R.pick([9, 19]), name = who(), truth = !R.int(0, 2), said = truth ? a + b : a + b + 2;
        var right = 'Add ' + (b + 1) + ', then take away 1: ' + a + ' + ' + (b + 1) + ' = ' + (a + b + 1) + ', and ' + (a + b + 1) + ' ' + M + ' 1 = ' + (a + b) + '.';
        return { q: name + ' adds ' + b + ' by adding ' + (b + 1) + ' and then fixing it. ' + name + ' says <span class="math big">' + a + ' + ' + b + ' = ' + said + '</span>. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['Add ' + (b + 1) + ', then add 1 more.', 'Adding ' + b + ' is the same as adding ' + (b + 1) + '.', 'Take away 1 from ' + a + ' first, then add ' + (b + 1) + ' and 1.']),
          hint: b + ' is 1 less than ' + (b + 1) + '.', steps: [right], explain: right, meta: { k: 'a2-mental-tf', a: a, b: b, said: said } };
      }]
    ],
    'a2-story': [
      [1, 'which', function (lv) {
        var name = who(), a = R.int(12, 48), b = R.int(11, 45), w = a + b, kind = R.pick(['join', 'take', 'compare']), q;
        if (kind === 'join') q = name + ' read ' + a + ' pages on Monday and ' + b + ' pages on Tuesday. How many pages in all?';
        else if (kind === 'take') q = 'A bus has ' + w + ' people. ' + a + ' get off at the stop. How many are still on the bus?';
        else q = name + ' scored ' + w + ' points. A friend scored ' + a + '. How many more points did ' + name + ' score?';
        return { q: q + ' <b>Which way solves it?</b>', type: 'mc', options: ['Add', 'Subtract'], answer: kind === 'join' ? 0 : 1,
          hint: kind === 'join' ? 'Are two parts going together?' : kind === 'take' ? 'Are some leaving?' : 'Are you finding the difference?',
          steps: [kind === 'join' ? 'Two parts go together: add.' : kind === 'take' ? 'Some leave: subtract.' : '"How many more" finds the difference: subtract.'],
          explain: kind === 'join' ? a + ' + ' + b + ' = ' + w + '.' : w + ' ' + M + ' ' + a + ' = ' + b + '.', meta: { k: 'a2-which', kind: kind } };
      }],
      [1, 'build', function (lv) {
        var name = who(), p = addPair(lv);
        return { q: name + ' has <b>' + p[0] + '</b> beads and buys <b>' + p[1] + '</b> more. Show how many beads ' + name + ' has now. Then press Check.', type: 'build', tool: 'base10', answer: p[0] + p[1],
          hint: 'Add the two numbers. Use rods for tens and cubes for ones.', steps: addSteps(p[0], p[1]),
          explain: p[0] + ' + ' + p[1] + ' = ' + (p[0] + p[1]) + ' beads.', meta: { k: 'a2-story-build', a: p[0], b: p[1] } };
      }],
      [2, 'mistake', function (lv) {
        var name = who(), a = R.int(12, 39), b = R.int(11, 39), w = a + b, truth = !R.int(0, 2), sum = truth ? w + ' ' + M + ' ' + a : w + ' + ' + a, said = truth ? b : w + a;
        var right = 'Children went home, so there are fewer. Subtract: ' + w + ' ' + M + ' ' + a + ' = ' + b + '.';
        return { q: 'There are ' + w + ' children at the park. ' + a + ' go home. ' + name + ' wrote <span class="math big">' + sum + ' = ' + said + '</span>. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['"Go home" means add.', 'Add any two numbers in a story.', 'Subtract the smaller number from 100.']),
          hint: 'At the end, are there more children or fewer?', steps: [right], explain: right, meta: { k: 'a2-story-tf', w: w, a: a, said: said } };
      }]
    ]
  });
})();
