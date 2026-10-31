(function () {
  var A = Atlas, R = A.R;
  var M = '&minus;';
  var PEOPLE = ['Mia', 'Leo', 'Ava', 'Noah', 'Zoe', 'Sam', 'Priya', 'Omar', 'Lily', 'Ben', 'Aiyana', 'Mei', 'Jack', 'Sofia'];
  function seq(a, n, step) { var o = []; for (var i = 0; i < n; i++) o.push(a + i * (step || 1)); return o; }
  function eqn(s) { return '<span class="math">' + s + '</span>'; }
  function tn(n) { return Math.floor(n / 10); }

  /* two ten frames: a red, then b yellow, with the first frame filled first (make a ten) */
  function makeTen(a, b) { return A.draw.frames(a, { b: b, c: 24, r: 2, min: 20 }); }
  /* number line jumps: first by tens, then by ones */
  function jumps(start, add, back) {
    var t = tn(add), o = add % 10, h = [], x = start, d = back ? -1 : 1;
    for (var i = 0; i < t; i++) { h.push([x, x + 10 * d, (back ? '−' : '+') + '10']); x += 10 * d; }
    for (var j = 0; j < o; j++) { h.push([x, x + d]); x += d; }
    var lo = Math.max(0, Math.min(start, x) - 2), hi = Math.min(50, Math.max(start, x) + 2);
    if (hi - lo < 10) { hi = Math.min(50, lo + 10); lo = Math.max(0, hi - 10); }
    return A.draw.nl(lo, hi, { mark: start, hops: h, lab: hi - lo > 12 ? 5 : 1, label: 'Number line: start at ' + start + ', jump ' + (back ? 'back ' : '') + add + ' to ' + x });
  }
  /* a balance: left and right pans with counters; tilts toward the heavier side */
  function balance(l, r, ltext, rtext) {
    var tilt = l === r ? 0 : l > r ? -8 : 8, s = '', cx = 220, cy = 60;
    s += '<path d="M' + (cx - 30) + ' 196H' + (cx + 30) + 'L' + cx + ' 62Z" style="fill:var(--line);stroke:var(--ink)" stroke-width="2" stroke-linejoin="round"/>';
    s += '<g transform="rotate(' + tilt + ' ' + cx + ' ' + cy + ')"><line x1="' + (cx - 160) + '" y1="' + cy + '" x2="' + (cx + 160) + '" y2="' + cy + '" style="stroke:var(--ink)" stroke-width="5" stroke-linecap="round"/></g>';
    var rad = tilt * Math.PI / 180;
    [[-1, l, ltext], [1, r, rtext]].forEach(function (side) {
      var px = cx + side[0] * 150 * Math.cos(rad), py = cy + side[0] * 150 * Math.sin(rad);
      s += '<line x1="' + px + '" y1="' + py + '" x2="' + px + '" y2="' + (py + 40) + '" style="stroke:var(--ink2)" stroke-width="2"/>';
      s += '<path d="M' + (px - 62) + ' ' + (py + 40) + 'H' + (px + 62) + 'Q' + px + ' ' + (py + 80) + ' ' + (px - 62) + ' ' + (py + 40) + 'Z" style="fill:color-mix(in srgb,var(--strand) 14%,var(--card));stroke:var(--ink)" stroke-width="2"/>';
      for (var i = 0; i < Math.min(side[1], 20); i++) s += A.draw.counter(px - 50 + (i % 10) * 11, py + 34 - Math.floor(i / 10) * 11, 5, 0);
      s += '<text x="' + px + '" y="' + (py + 108) + '" text-anchor="middle" font-size="22" class="tb">' + side[2] + '</text>';
    });
    return A.svg(440, 215, s, 'A balance. Left side ' + ltext + ', right side ' + rtext + '. ' + (l === r ? 'It is level: the sides are equal.' : 'It tips down on the ' + (l > r ? 'left' : 'right') + ' side, which is more.'));
  }

  function q20(lv) {
    var a, b, sub = lv === 3 && R.int(0, 1);
    if (lv === 1) { a = 9; b = R.int(2, 9); }
    else { a = R.int(6, 9); b = R.int(11 - a, 9); }
    if (R.int(0, 1) && !sub) { var t = a; a = b; b = t; }
    var c = a + b, big = Math.max(a, b), small = Math.min(a, b), need = 10 - big;
    if (sub) {
      return { q: 'What is ' + eqn(c + ' ' + M + ' ' + small) + '?', type: 'num', answer: big,
        hint: 'Take away to get to 10 first, then take away the rest.',
        steps: ['Split ' + small + ' into ' + (c - 10) + ' and ' + (small - (c - 10)) + '.', c + ' ' + M + ' ' + (c - 10) + ' = 10.', '10 ' + M + ' ' + (small - (c - 10)) + ' = ' + big + '. So ' + c + ' ' + M + ' ' + small + ' = ' + big + '.'],
        explain: c + ' ' + M + ' ' + small + ' = ' + big + '. Check: ' + big + ' + ' + small + ' = ' + c + '.' };
    }
    return { q: 'What is ' + eqn(a + ' + ' + b) + '?', type: 'num', answer: c, fig: lv < 3 ? makeTen(big, small) : '',
      hint: 'Make a ten. ' + big + ' needs ' + need + ' more to make 10.',
      steps: [big + ' needs ' + need + ' to make 10. Take ' + need + ' from the ' + small + '.', 'That leaves ' + (small - need) + '.', '10 + ' + (small - need) + ' = ' + c + '.'],
      explain: a + ' + ' + b + ' = ' + c + '. ' + big + ' + ' + need + ' makes 10, and ' + (small - need) + ' more is ' + c + '.' };
  }
  function qTens(lv) {
    var a, b, add = R.int(0, 1), ans;
    if (lv === 1) { a = R.int(1, 4) * 10; b = R.int(1, 5 - a / 10) * 10; if (!add) { a = R.int(2, 5) * 10; b = R.int(1, a / 10 - 1) * 10; } }
    else if (lv === 2) { a = R.int(1, 3) * 10 + R.int(1, 9); b = 10 * R.int(1, Math.min(2, tn(50 - a))); if (!add) { a = R.int(2, 4) * 10 + R.int(1, 9); b = 10 * R.int(1, tn(a) - 1); } }
    else { a = R.int(1, 2) * 10 + R.int(1, 5); b = R.int(1, 2) * 10; if (!add) { a = R.int(3, 4) * 10 + R.int(1, 9); b = R.int(1, 2) * 10; } }
    ans = add ? a + b : a - b;
    var k = b / 10;
    return { q: 'What is ' + eqn(a + ' ' + (add ? '+' : M) + ' ' + b) + '?', type: 'num', answer: ans,
      fig: lv < 3 ? A.draw.tens(tn(a), a % 10) : '',
      hint: 'Jump by tens: ' + (add ? 'add' : 'take away') + ' ' + k + ' ten' + (k > 1 ? 's' : '') + '. The ones stay the same.',
      steps: [a + ' is ' + tn(a) + ' tens and ' + a % 10 + ' ones. ' + b + ' is ' + k + ' ten' + (k > 1 ? 's' : '') + '.', (add ? 'Count on' : 'Count back') + ' by 10s from ' + a + ': ' + seq(a + (add ? 10 : -10), k, add ? 10 : -10).join(', ') + '.<div class="fig">' + jumps(a, b, !add) + '</div>', a + ' ' + (add ? '+' : M) + ' ' + b + ' = ' + ans + '.'],
      explain: a + ' ' + (add ? '+' : M) + ' ' + b + ' = ' + ans + '. Only the tens changed.' };
  }
  function qTwo(lv) {
    var a, b, add = lv === 1 ? 1 : lv === 2 ? 0 : R.int(0, 1), ans;
    if (lv < 3) {
      if (add) { a = R.int(1, 4) * 10 + R.int(0, 6); b = R.int(1, 9 - a % 10); }
      else { a = R.int(1, 4) * 10 + R.int(3, 9); b = R.int(1, a % 10); }
    } else if (add) { a = R.int(1, 3) * 10 + R.int(5, 9); b = R.int(10 - a % 10, 9); }
    else { a = R.int(2, 4) * 10 + R.int(1, 4); b = R.int(a % 10 + 1, 9); }
    ans = add ? a + b : a - b;
    var cross = tn(ans) !== tn(a), ten = add ? (tn(a) + 1) * 10 : tn(a) * 10;
    return { q: 'What is ' + eqn(a + ' ' + (add ? '+' : M) + ' ' + b) + '?', type: 'num', answer: ans,
      fig: lv < 3 ? A.draw.tens(tn(a), a % 10) : '',
      hint: cross ? (add ? 'Jump to the next ten first: ' + a + ' + ' + (ten - a) + ' = ' + ten + '. Then add the rest.' : 'Jump back to the ten first: ' + a + ' ' + M + ' ' + (a - ten) + ' = ' + ten + '. Then take away the rest.') : (add ? 'Add the ones: ' + a % 10 + ' + ' + b + '. The tens stay the same.' : 'Take away from the ones: ' + a % 10 + ' ' + M + ' ' + b + '. The tens stay the same.'),
      steps: cross ? [(add ? 'Jump to the next ten: ' + a + ' + ' + (ten - a) + ' = ' + ten + '.' : 'Jump back to the ten: ' + a + ' ' + M + ' ' + (a - ten) + ' = ' + ten + '.'), 'You still have ' + (add ? b - (ten - a) : b - (a - ten)) + ' to ' + (add ? 'add' : 'take away') + '.', ten + ' ' + (add ? '+' : M) + ' ' + (add ? b - (ten - a) : b - (a - ten)) + ' = ' + ans + '.<div class="fig">' + jumps(a, b, !add) + '</div>']
        : [a + ' is ' + tn(a) + ' tens and ' + a % 10 + ' ones.', (add ? a % 10 + ' + ' + b + ' = ' + (a % 10 + b) : a % 10 + ' ' + M + ' ' + b + ' = ' + (a % 10 - b)) + ' ones.', 'The tens stay ' + tn(a) + '. So the answer is ' + ans + '.'],
      explain: a + ' ' + (add ? '+' : M) + ' ' + b + ' = ' + ans + '.' };
  }
  function qStory(lv) {
    var who = R.pick(PEOPLE), other = R.pick(PEOPLE.filter(function (p) { return p !== who; })), type = lv === 1 ? R.pick(['join', 'take']) : lv === 2 ? R.pick(['join', 'take', 'whole']) : R.pick(['compare', 'start', 'whole']);
    var a, b;
    if (type === 'join') { a = R.int(10, 30); b = R.int(2, 9); if (lv === 1) b = R.int(1, 9 - a % 10 || 1); return story(who + ' has ' + a + ' stickers. ' + who + ' gets ' + b + ' more. How many stickers does ' + who + ' have now?', a + b, a + ' + ' + b, 'Getting more means adding.'); }
    if (type === 'take') { a = R.int(15, 40); b = R.int(2, 9); if (lv === 1) b = R.int(1, Math.max(1, a % 10)); return story('There are ' + a + ' crackers in a box. ' + who + ' eats ' + b + '. How many crackers are left?', a - b, a + ' ' + M + ' ' + b, 'Some are eaten, so we take away.'); }
    if (type === 'whole') { a = R.int(10, 25); b = R.int(10, 20); return story('A class has ' + a + ' girls and ' + b + ' boys. How many children are in the class?', a + b, a + ' + ' + b, 'Two parts make the whole, so we add.'); }
    if (type === 'compare') { a = R.int(12, 30); b = a + R.int(2, 12); return story(who + ' has ' + a + ' marbles. ' + other + ' has ' + b + ' marbles. How many <b>more</b> marbles does ' + other + ' have?', b - a, b + ' ' + M + ' ' + a, '"How many more" means find the difference. Count up from ' + a + ' to ' + b + ', or subtract.'); }
    a = R.int(10, 30); b = R.int(3, 15);
    return story(who + ' had some books. ' + who + ' got ' + b + ' more. Now ' + who + ' has ' + (a + b) + '. How many books did ' + who + ' have at the start?', a, (a + b) + ' ' + M + ' ' + b, 'You know the total and one part. Take the part away from the total.');
  }
  function story(text, ans, expr, why) {
    return { q: text, type: 'num', answer: ans, hint: why,
      steps: ['Read it again. Picture what happens.', why + ' Write it: ' + eqn(expr + ' = <b class="blank">?</b>') + '.', 'Solve it: ' + eqn(expr + ' = ' + ans) + '. Check that the answer makes sense.'],
      explain: eqn(expr + ' = ' + ans) + '.' };
  }
  function qEqual(lv) {
    var a, b, c, d;
    if (lv === 1) {
      a = R.int(1, 9); b = R.int(1, 10 - a); var right = R.int(0, 1), shown = right ? a + b : a + b + R.pick([-1, 1]);
      if (shown < 0) shown = a + b + 1;
      return { q: 'Is this true? ' + eqn(a + ' + ' + b + ' = ' + shown), type: 'mc', options: ['True', 'False'], answer: right ? 0 : 1,
        hint: 'Work out ' + a + ' + ' + b + '. Is it the same as ' + shown + '?', steps: [a + ' + ' + b + ' = ' + (a + b) + '.', 'Compare ' + (a + b) + ' with ' + shown + '.', (a + b) === shown ? 'They are the same, so it is true.' : 'They are not the same, so it is false.'],
        explain: a + ' + ' + b + ' is ' + (a + b) + ', so the sentence is ' + (right ? 'true' : 'false') + '.' };
    }
    if (lv === 2) {
      var tot = R.int(5, 12); a = R.int(1, tot - 1); b = tot - a; do { c = R.int(1, tot - 1); } while (c === a || c === b); d = tot - c;
      var same = R.int(0, 1); if (!same) d = d + R.pick([-1, 1]) || d + 1;
      return { q: 'Is this true? ' + eqn(a + ' + ' + b + ' = ' + c + ' + ' + d), type: 'mc', options: ['True', 'False'], answer: (a + b === c + d) ? 0 : 1,
        fig: balance(a + b, c + d, a + ' + ' + b, c + ' + ' + d),
        hint: 'Work out each side. The = sign means both sides are the same.', steps: ['Left side: ' + a + ' + ' + b + ' = ' + (a + b) + '.', 'Right side: ' + c + ' + ' + d + ' = ' + (c + d) + '.', (a + b === c + d) ? 'Both sides are ' + (a + b) + '. It is true.' : (a + b) + ' is not the same as ' + (c + d) + '. It is false.'],
        explain: a + ' + ' + b + ' = ' + (a + b) + ' and ' + c + ' + ' + d + ' = ' + (c + d) + '. ' + (a + b === c + d ? 'True.' : 'False.') };
    }
    var t2 = R.int(6, 15); a = R.int(1, Math.min(9, t2 - 1)); b = t2 - a; do { c = R.int(1, t2 - 1); } while (c === a); d = t2 - c;
    return { q: 'What number makes this true? ' + eqn(a + ' + ' + b + ' = ' + c + ' + <b class="blank">?</b>'), type: 'num', answer: d,
      fig: balance(t2, c, a + ' + ' + b, c + ' + ?'),
      hint: 'Find the left side first. Then make the right side the same.', steps: ['Left side: ' + a + ' + ' + b + ' = ' + t2 + '.', 'The right side must also be ' + t2 + '. It has ' + c + ' already.', c + ' + ' + d + ' = ' + t2 + '. The missing number is ' + d + '.'],
      explain: a + ' + ' + b + ' = ' + t2 + ' and ' + c + ' + ' + d + ' = ' + t2 + '. Both sides are equal.' };
  }

  var CH = 'add-sub-50';
  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = window.G1;
  function P(id, lv) { return function () { var s = A.chapters[CH].practice.filter(function (x) { return x.id === id; })[0]; return s.gen(typeof lv === 'function' ? lv() : lv); }; }
  function mc(q, right, wrong, extra) { var o = R.mc(right, wrong); return Object.assign({ q: q, type: 'mc', options: o.options, answer: o.answer }, extra || {}); }
  var LESSONS = [
    { id: 'make-ten', title: 'Make a ten to add', sub: 'Fill a ten frame first.', concepts: [
      { id: 'fill', title: 'Fill the ten first', exp: ['B2.3'], skill: 'b-20',
        body: '<p>To add 8 + 5, first <b>fill a ten</b>. 8 needs 2 more to make 10. Take 2 from the 5. That leaves 3. <b>10 + 3 = 13</b>.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: '8 + 5. Here are 8 red and 5 yellow.', act: function (t) { return t.show(A.draw.frames(8, { c: 26 }) + A.draw.frames(0, { b: 5, c: 26 })); }, ms: 1600 },
          { say: 'Move 2 yellow into the first frame. Now it is full: 10.', act: function (t) { return t.show(makeTen(8, 5)); }, ms: 1600 },
          { say: '3 yellow are left in the second frame. 10 + 3 = <b>13</b>.', act: function (t) { return t.show(makeTen(8, 5) + '<p class="big">' + eqn('8 + 5 = 10 + 3 = 13') + '</p>'); }, ms: 2000 }
        ] },
        try: { tool: 'tenframe', opts: { frames: 2, n: 9 }, tasks: [
          { do: 'Find ' + eqn('9 + 4') + '. Add 4 counters. Fill the first frame first.', reset: false, goal: function (s) { return s.n === 13; }, yes: '9 + 1 fills the ten. 3 more: 9 + 4 = 13.' }
        ] },
        ways: [
          { label: 'Split the small number', html: '<p class="math">8 + 5</p><p class="math">8 + 2 + 3</p><p class="math">10 + 3 = 13</p><p>Split 5 into 2 and 3. The 2 makes 10.</p>' },
          { label: 'Use a double', html: '<p>8 + 5 is close to 5 + 5 = 10. 8 is 3 more than 5, so the answer is 3 more than 10: <b>13</b>.</p>' }
        ],
        hard: true,
        key: '<p><b>Make a ten</b>, then add what is left.</p>',
        mistake: '<p>Losing track of how many were moved. Use real counters and two ten frames drawn on paper.</p>',
        check: [P('b-20', 1), P('b-20', 2)] },
      { id: 'back20', title: 'Subtract to 20', exp: ['B2.3'], skill: 'b-20',
        body: '<p>To find <b>14 &minus; 6</b>, take away 4 to get to 10, then 2 more: <b>8</b>.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 20, every: 5, start: 14 }, steps: [
          { say: '14 &minus; 6. Start at 14.', ms: 1300 },
          { say: 'Jump back 4 to get to 10.', act: function (t) { return t.hop(10, '−4'); }, ms: 900 },
          { say: 'Jump back 2 more: 8.', act: function (t) { return t.hop(8, '−2'); }, ms: 900 },
          { say: '14 &minus; 6 = <b>8</b>.', ms: 1800 }
        ] },
        try: { tool: 'numberline', opts: { min: 0, max: 20, every: 5, start: 15, step: 1 }, tasks: [
          { do: 'Find ' + eqn('15 &minus; 7') + '. Use Jump back 7 times.', goal: function (s) { return s.at === 8; }, yes: '15 &minus; 7 = 8.' }
        ] },
        key: '<p>Jump back <b>to 10</b> first, then the rest.</p>',
        check: [P('b-20', 2), P('b-20', 3)] }
    ] },

    { id: 'bigger', title: 'Adding bigger numbers', sub: 'Tens first, then ones.', concepts: [
      { id: 'tens', title: 'Add tens', exp: ['B2.4'], skill: 'b-tens',
        body: '<p>Adding a ten makes the tens digit go up by 1. 23 + 10 = <b>33</b>. 23 + 20 = <b>43</b>.</p>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'], t: 2, o: 3 }, steps: [
          { say: 'Start with 23.', ms: 1200 },
          { say: 'Add a ten: 33.', act: function (t) { return t.add('t', 1); }, ms: 900 },
          { say: 'Add another ten: 43.', act: function (t) { return t.add('t', 1); }, ms: 900 },
          { say: '23 + 20 = <b>43</b>. The ones stayed 3.', ms: 1800 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true, t: 1, o: 6 }, tasks: [
          { do: 'This is 16. Show ' + eqn('16 + 30') + '.', reset: false, goal: function (s) { return s.value === 46; }, yes: '16 + 30 = 46.' }
        ] },
        key: '<p>Add tens: only the <b>tens digit</b> changes.</p>',
        check: [P('b-tens', 1), P('b-tens', 2)] },
      { id: 'jump', title: 'Jump tens, then ones', exp: ['B2.4'], skill: 'b-two',
        body: '<p>For <b>23 + 14</b>, split 14 into 1 ten and 4 ones. Jump 10, then jump 4 ones.</p>',
        watch: { tool: 'numberline', opts: { min: 20, max: 40, every: 5, start: 23 }, steps: [
          { say: '23 + 14. Start at 23.', ms: 1200 },
          { say: 'Jump one ten: 33.', act: function (t) { return t.hop(33, '+10'); }, ms: 900 },
          { say: 'Jump 4 ones: 34, 35, 36, 37.', act: function (t) { return t.hop(34).then(function () { return t.hop(35); }).then(function () { return t.hop(36); }).then(function () { return t.hop(37); }); }, ms: 900 },
          { say: '23 + 14 = <b>37</b>.', ms: 1800 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true, t: 2, o: 1 }, tasks: [
          { do: 'This is 21. Add <b>15</b>: 1 ten and 5 ones.', reset: false, goal: function (s) { return s.value === 36 && s.o < 10; }, yes: '21 + 15 = 36.' }
        ] },
        ways: [{ label: 'With blocks', html: '<p>23 is 2 tens and 3 ones. 14 is 1 ten and 4 ones. Put the tens together: 3 tens. Put the ones together: 7 ones. That is 37.</p>', tool: 'base10', opts: { cols: ['t', 'o'], t: 3, o: 7 } }],
        key: '<p>Add the <b>tens</b>, then the <b>ones</b>.</p>',
        check: [P('b-two', 1), P('b-two', 2)] }
    ] },

    { id: 'sub-big', title: 'Subtracting bigger numbers', sub: 'Take away tens, then ones.', concepts: [
      { id: 'tens-away', title: 'Take away tens', exp: ['B2.4'], skill: 'b-tens',
        body: '<p>Taking away a ten makes the tens digit go down by 1. 45 &minus; 10 = <b>35</b>.</p>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'], t: 4, o: 5 }, steps: [
          { say: 'Start with 45.', ms: 1200 },
          { say: 'Take away a ten: 35.', act: function (t) { return t.remove('t', 1); }, ms: 900 },
          { say: 'Take away another ten: 25.', act: function (t) { return t.remove('t', 1); }, ms: 900 },
          { say: '45 &minus; 20 = <b>25</b>.', ms: 1800 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true, t: 4, o: 8 }, tasks: [
          { do: 'This is 48. Show ' + eqn('48 &minus; 30') + '.', reset: false, goal: function (s) { return s.value === 18; }, yes: '48 &minus; 30 = 18.' }
        ] },
        key: '<p>Take away tens: only the <b>tens digit</b> changes.</p>',
        check: [P('b-tens', 2), P('b-tens', 3)] },
      { id: 'back', title: 'Jump back tens, then ones', exp: ['B2.4'], skill: 'b-two',
        body: '<p>For <b>45 &minus; 12</b>, jump back 10 to 35. Then back 2: 34, 33.</p>',
        watch: { tool: 'numberline', opts: { min: 30, max: 50, every: 5, start: 45 }, steps: [
          { say: '45 &minus; 12. Start at 45.', ms: 1200 },
          { say: 'Jump back one ten: 35.', act: function (t) { return t.hop(35, '−10'); }, ms: 900 },
          { say: 'Jump back 2 ones: 34, 33.', act: function (t) { return t.hop(34).then(function () { return t.hop(33); }); }, ms: 900 },
          { say: '45 &minus; 12 = <b>33</b>.', ms: 1800 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true, t: 3, o: 9 }, tasks: [
          { do: 'This is 39. Take away <b>24</b>: 2 tens and 4 ones.', reset: false, goal: function (s) { return s.value === 15; }, yes: '39 &minus; 24 = 15.' }
        ] },
        mistake: '<p>Subtracting the smaller ones digit from the bigger one no matter which number it belongs to. Model with blocks: start with the first number only.</p>',
        key: '<p>Take away the <b>tens</b>, then the <b>ones</b>.</p>',
        check: [P('b-two', 2), P('b-two', 3)] }
    ] },

    { id: 'stories', title: 'Story problems', sub: 'Four steps for every story.', concepts: [
      { id: 'steps', title: 'Four steps', exp: ['B2.4'], skill: 'b-story',
        body: '<ol><li><b>Read</b> it. Read it twice.</li><li><b>Picture</b> it. Draw it or use objects.</li><li><b>Solve</b> it. Add or subtract?</li><li><b>Check</b> it. Does the answer make sense?</li></ol>',
        watch: { tool: 'g1stage', steps: [
          { say: '<b>Read:</b> Omar has 20 stickers. He gets 12 more. How many now?', act: function (t) { return t.show('<p class="big">20 stickers, then 12 more</p>'); }, ms: 2200 },
          { say: '<b>Picture:</b> 2 tens, then 1 ten and 2 ones more.', act: function (t) { return t.show(A.draw.tens(2, 0) + A.draw.tens(1, 2)); }, ms: 1800 },
          { say: '<b>Solve:</b> the group gets bigger, so add. 20 + 12 = 32.', act: function (t) { return t.show(A.draw.tens(3, 2) + '<p class="big">' + eqn('20 + 12 = 32') + '</p>'); }, ms: 1800 },
          { say: '<b>Check:</b> 32 is more than 20. That makes sense.', ms: 1800 }
        ] },
        key: '<p><b>Read, picture, solve, check.</b></p>',
        check: [P('b-story', 1), P('b-story', 2)] },
      { id: 'which', title: 'Add or subtract?', exp: ['B2.4'], skill: 'b-story', hard: true,
        body: '<p>Ask: does the group get <b>bigger</b> or <b>smaller</b>? Bigger means add. Smaller means subtract.</p>',
        try: { tool: 'g1pick', opts: { cols: 2, items: [
          { id: 'a', html: '<span>12 birds. 5 more land.</span>' }, { id: 's', html: '<span>30 cookies. 10 are eaten.</span>' },
          { id: 'a2', html: '<span>Leo has 21 cards. He gets 4.</span>' }, { id: 's2', html: '<span>15 balloons. 3 pop.</span>' }] }, tasks: [
          { do: 'Tap every story where you <b>subtract</b> (the group gets smaller).', goal: function (s) { return s.n === 2 && s.picked.indexOf('s') >= 0 && s.picked.indexOf('s2') >= 0; }, yes: 'Yes. Cookies are eaten and balloons pop. Those groups get smaller.' }
        ] },
        ways: [{ label: 'Act it out', html: '<p>Use real things. Put out the first number. Then do what the story says: add some or take some away. Count what you have.</p>' }],
        mistake: '<p>Picking the operation from one key word without understanding the story ("more" can appear in a take-away story). Have the child act it out.</p>',
        key: '<p>Bigger: <b>add</b>. Smaller: <b>subtract</b>.</p>',
        check: [P('b-story', 2), P('b-story', 3)] }
    ] },

    { id: 'equal', title: 'Is it equal?', sub: 'The = sign means "the same as".', concepts: [
      { id: 'same', title: '= means "the same as"', exp: ['C2.2'], skill: 'b-equal',
        body: '<p>The <b>=</b> sign means both sides are <b>the same amount</b>. 4 + 3 = 5 + 2, because both sides are 7.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'Put 4 + 3 on the left and 5 + 2 on the right.', act: function (t) { return t.show(balance(7, 7, '4 + 3', '5 + 2')); }, ms: 1800 },
          { say: 'Both sides are 7. The balance is level. <b>4 + 3 = 5 + 2</b>.', ms: 1800 },
          { say: 'Now 4 + 3 and 5 + 4. The right side is 9. It is heavier, so it is not equal.', act: function (t) { return t.show(balance(7, 9, '4 + 3', '5 + 4')); }, ms: 2200 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: [{ id: 'y', html: '<span class="big">6 + 2</span>' }, { id: 'n', html: '<span class="big">6 + 3</span>' }, { id: 'n2', html: '<span class="big">4 + 2</span>' }] }, tasks: [
          { do: 'Which one is <b>equal to 5 + 3</b>?', goal: function (s) { return s.picked[0] === 'y'; }, yes: '6 + 2 = 8 and 5 + 3 = 8. They are equal.' }
        ] },
        mistake: '<p>Reading = as "the answer comes next" (so 4 + 3 = 5 + 2 looks wrong). Say "is the same as" every time.</p>',
        key: '<p><b>=</b> means <b>"is the same as"</b>.</p>',
        check: [P('b-equal', 1), P('b-equal', 1)] },
      { id: 'balance', title: 'Make both sides equal', exp: ['C2.2', 'C2.3'], skill: 'b-equal', hard: true,
        body: '<p>' + eqn('3 + 5 = 4 + <b class="blank">?</b>') + ' The left side is 8. What makes the right side 8 too? 4 + <b>4</b>.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'Left: 3 + 5 = 8. Right: 4 and some more.', act: function (t) { return t.show(balance(8, 4, '3 + 5', '4 + ?')); }, ms: 1800 },
          { say: 'Add 4 to the right side.', act: function (t) { return t.show(balance(8, 8, '3 + 5', '4 + 4')); }, ms: 1600 },
          { say: 'Level. <b>3 + 5 = 4 + 4</b>.', ms: 1800 }
        ] },
        ways: [{ label: 'Count on', html: '<p>The left side is 8. Start at 4 and count on to 8: 5, 6, 7, 8. That is <b>4</b> more.</p>' }],
        key: '<p>Work out one side. Make the other side <b>the same</b>.</p>',
        check: [P('b-equal', 2), P('b-equal', 3)] }
    ] }
  ];

  A.register('add-sub-50', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Make a ten to add</h2>' +
'<p>To add numbers like ' + eqn('8 + 5') + ', first fill a ten. Ten and some more is easy to read.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + makeTen(8, 5) + '</div><p>8 needs 2 more to make 10. I take 2 from the 5. That leaves 3. ' + eqn('10 + 3 = 13') + '. So ' + eqn('8 + 5 = 13') + '.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>What is ' + eqn('9 + 6') + '?</p><ol><li>9 needs 1 more to make 10.</li><li>Take 1 from the 6. That leaves 5.</li><li>' + eqn('10 + 5 = 15') + '. So ' + eqn('9 + 6 = 15') + '.</li></ol></div>' +
'<div class="key"><b class="t">Key idea</b><p>Knowing the pairs that make 10 helps you add bigger numbers in your head.</p></div>' +
'<div class="lab"><span class="lt">Try it: make a ten</span><div class="row2">' + A.stepHtml('mk1', 'Red', 8) + A.stepHtml('mk2', 'Yellow', 5) + '</div>' +
'<div class="fig" id="mkfig"></div><div class="out" id="mkout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Adding bigger numbers</h2>' +
'<p>To add to a bigger number, jump by <b>tens</b> first, then by <b>ones</b>. Use a number line, blocks, or your head.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>' + eqn('23 + 14') + '. 14 is 1 ten and 4 ones. From 23, I jump 10 to 33. Then I jump 4 ones: 34, 35, 36, 37.</p><div class="fig">' + jumps(23, 14) + '</div><p>' + eqn('23 + 14 = 37') + '.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>What is ' + eqn('27 + 5') + '?</p><ol><li>27 needs 3 more to get to the next ten, 30.</li><li>5 is 3 and 2. ' + eqn('27 + 3 = 30') + '.</li><li>Then ' + eqn('30 + 2 = 32') + '. So ' + eqn('27 + 5 = 32') + '.</li></ol></div>' +
'<div class="lab"><span class="lt">Try it: jump on the number line</span><div class="row2">' + A.stepHtml('jp1', 'Start at', 23) + A.stepHtml('jp2', 'Add', 14) + '</div>' +
'<div class="fig" id="jpfig"></div><div class="out" id="jpout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Subtracting bigger numbers</h2>' +
'<p>To subtract, jump <b>back</b>. Take away tens first, then ones.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>' + eqn('45 &minus; 12') + '. I jump back 10 to 35. Then back 2: 34, 33.</p><div class="fig">' + jumps(45, 12, true) + '</div><p>' + eqn('45 &minus; 12 = 33') + '.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>What is ' + eqn('32 &minus; 5') + '?</p><ol><li>Jump back 2 to get to 30.</li><li>5 is 2 and 3. I still need to take away 3.</li><li>' + eqn('30 &minus; 3 = 27') + '. So ' + eqn('32 &minus; 5 = 27') + '.</li></ol></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>In ' + eqn('32 &minus; 5') + ', do not take 2 away from 5. You start with 32 and take away 5. The answer is less than 32: it is 27.</p></div>' +
'<div class="lab"><span class="lt">Try it: jump back</span><div class="row2">' + A.stepHtml('jb1', 'Start at', 45) + A.stepHtml('jb2', 'Take away', 12) + '</div>' +
'<div class="fig" id="jbfig"></div><div class="out" id="jbout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Story problems</h2>' +
'<p>Use the same 4 steps for every story problem.</p>' +
'<ol class="routine"><li><b>Read</b> it. Read it twice.</li><li><b>Picture</b> it. Draw it or use objects.</li><li><b>Write</b> the number sentence.</li><li><b>Solve and check.</b> Does the answer make sense?</li></ol>' +
'<div class="eg"><b class="t">Watch me</b><p>"Leo has 18 marbles. Mia has 25 marbles. How many more marbles does Mia have?"</p>' +
'<div class="fig">' + A.draw.nl(15, 30, { mark: 18, hops: [[18, 20, '+2'], [20, 25, '+5']], lab: 5 }) + '</div>' +
'<p>"How many more" means find the difference. I count up from 18 to 25: 2 to get to 20, then 5 more. That is 7. ' + eqn('25 &minus; 18 = 7') + '. Mia has 7 more.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>"In all" and "altogether" usually mean add. "Left" and "how many more" usually mean subtract. Always picture the story to be sure.</p></div>' +
'<div class="lab"><span class="lt">Try it: solve a story</span><div class="btnrow"><button type="button" class="btn" id="stn">New story</button></div>' +
'<div id="stq"></div><div class="btnrow"><button type="button" class="btn alt" id="sts">Show the next step</button></div><ol id="stl" class="wmsteps"></ol></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Is it equal?</h2>' +
'<p>The <b>=</b> sign means "<b>is the same as</b>". Both sides must have the same amount, like a balance that is level.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + balance(7, 7, '4 + 3', '5 + 2') + '</div><p>' + eqn('4 + 3') + ' is 7. ' + eqn('5 + 2') + ' is 7. Both sides are 7, so ' + eqn('4 + 3 = 5 + 2') + ' is <b>true</b>.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>The = sign does not mean "the answer comes next". In ' + eqn('6 + 2 = <b class="blank">?</b> + 5') + ', the answer is not 8. Both sides must be 8, so the missing number is 3.</p></div>' +
'<div class="lab"><span class="lt">Try it: balance it</span><div class="row2">' + A.stepHtml('bl1', 'Left: first number', 4) + A.stepHtml('bl2', 'Left: second number', 3) + A.stepHtml('bl3', 'Right: first number', 5) + A.stepHtml('bl4', 'Right: second number', 1) + '</div>' +
'<div class="fig" id="blfig"></div><div class="out" id="blout"></div></div>' +
'<div class="yt"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      var a = 8, b = 5;
      function mk() {
        var big = Math.max(a, b), small = Math.min(a, b), need = 10 - big, c = a + b;
        $('#mkfig', root).innerHTML = makeTen(a, b);
        $('#mkout', root).innerHTML = '<span class="big">' + a + ' + ' + b + ' = ' + c + '</span><br>' + (c < 10 ? 'Not enough to make a ten.' : c === 10 ? 'Exactly one ten.' : big + ' needs ' + need + ' to make 10. ' + small + ' is ' + need + ' and ' + (small - need) + '. So 10 + ' + (small - need) + ' = ' + c + '.');
      }
      A.stepper(root, 'mk1', 1, 9, function (n) { a = n; mk(); });
      A.stepper(root, 'mk2', 1, 9, function (n) { b = n; mk(); });
      var s = 23, d = 14, j1, j2;
      function jp() { $('#jpfig', root).innerHTML = jumps(s, d); $('#jpout', root).innerHTML = '<span class="big">' + s + ' + ' + d + ' = ' + (s + d) + '</span><br>' + (tn(d) ? 'Jump ' + tn(d) + ' ten' + (tn(d) > 1 ? 's' : '') + ', then ' : 'Jump ') + d % 10 + ' one' + (d % 10 === 1 ? '' : 's') + '.'; }
      j1 = A.stepper(root, 'jp1', 0, 49, function (n) { s = n; if (j2 && s + d > 50) { j2.set(50 - s); return; } jp(); });
      j2 = A.stepper(root, 'jp2', 1, 30, function (n) { if (s + n > 50) { j2.set(50 - s); return; } d = n; jp(); });
      var bs = 45, bd = 12, k1, k2;
      function jb() { $('#jbfig', root).innerHTML = jumps(bs, bd, true); $('#jbout', root).innerHTML = '<span class="big">' + bs + ' &minus; ' + bd + ' = ' + (bs - bd) + '</span><br>' + (tn(bd) ? 'Jump back ' + tn(bd) + ' ten' + (tn(bd) > 1 ? 's' : '') + ', then ' : 'Jump back ') + bd % 10 + ' one' + (bd % 10 === 1 ? '' : 's') + '.'; }
      k1 = A.stepper(root, 'jb1', 1, 50, function (n) { bs = n; if (k2 && bd > bs) { k2.set(bs); return; } jb(); });
      k2 = A.stepper(root, 'jb2', 1, 30, function (n) { if (n > bs) { k2.set(bs); return; } bd = n; jb(); });
      var cur, k = 0;
      function newStory() {
        cur = qStory(R.int(1, 3)); k = 0;
        $('#stq', root).innerHTML = '<p class="qtext">' + cur.q + '</p>';
        $('#stl', root).innerHTML = '';
        $('#sts', root).disabled = false;
        $('#sts', root).textContent = 'Show the first step';
      }
      $('#sts', root).addEventListener('click', function () {
        if (k < cur.steps.length) { $('#stl', root).innerHTML += '<li>' + cur.steps[k] + (k === cur.steps.length - 1 ? ' The answer is <b>' + cur.answer + '</b>.' : '') + '</li>'; k++; }
        $('#sts', root).textContent = 'Show the next step';
        if (k >= cur.steps.length) $('#sts', root).disabled = true;
      });
      $('#stn', root).addEventListener('click', newStory);
      newStory();
      var v = [4, 3, 5, 1];
      function bl() {
        var l = v[0] + v[1], r = v[2] + v[3];
        $('#blfig', root).innerHTML = balance(l, r, v[0] + ' + ' + v[1], v[2] + ' + ' + v[3]);
        $('#blout', root).innerHTML = 'Left is ' + l + '. Right is ' + r + '. ' + (l === r ? '<b>Equal.</b> ' + eqn(v[0] + ' + ' + v[1] + ' = ' + v[2] + ' + ' + v[3]) + ' is true.' : '<b>Not equal.</b> The ' + (l > r ? 'left' : 'right') + ' side is more by ' + Math.abs(l - r) + '.');
      }
      ['bl1', 'bl2', 'bl3', 'bl4'].forEach(function (id, i) { A.stepper(root, id, 0, 10, function (n) { v[i] = n; bl(); }); });
    },

    checks: [
      [function () { return q20(1); }, function () { return q20(2); }, function () { return q20(2); }],
      [function () { return qTens(1); }, function () { return qTwo(1); }, function () { return qTens(2); }],
      [function () { return qTwo(2); }, function () { return qTens(2); }, function () { return qTwo(2); }],
      [function () { return qStory(1); }, function () { return qStory(2); }, function () { return qStory(2); }],
      [function () { return qEqual(1); }, function () { return qEqual(2); }, function () { return qEqual(3); }]
    ],

    quiz: [
      { q: 'What is ' + eqn('7 + 6') + '?', type: 'num', answer: 13, fig: makeTen(7, 6),
        hint: '7 needs 3 to make 10. Take 3 from the 6.', explain: '7 + 3 = 10, and 3 more is 13.' },
      { q: 'What is ' + eqn('30 + 20') + '?', type: 'num', answer: 50,
        hint: '3 tens and 2 tens.', explain: '3 tens and 2 tens is 5 tens: 50.' },
      { q: 'What is ' + eqn('24 + 5') + '?', type: 'num', answer: 29,
        hint: 'Add the ones: 4 + 5. The tens stay the same.', explain: '4 + 5 = 9 ones, and 2 tens. 29.' },
      { q: 'What is ' + eqn('36 &minus; 10') + '?', type: 'num', answer: 26,
        hint: 'Take away one ten. The ones stay 6.', explain: '3 tens take away 1 ten is 2 tens. 26.' },
      { q: 'There are 21 children on a bus. 6 more get on. How many children are on the bus now?', type: 'num', answer: 27,
        hint: 'More get on, so add. Start at 21, count on 6.', explain: '21 + 6 = 27.' },
      { q: 'Is this true? ' + eqn('5 + 4 = 6 + 3'), type: 'mc', options: ['True', 'False'], answer: 0, fig: balance(9, 9, '5 + 4', '6 + 3'),
        hint: 'Work out each side.', explain: 'Both sides are 9, so it is true.' },
      { q: 'What number makes this true? ' + eqn('6 + 2 = <b class="blank">?</b> + 5'), type: 'num', answer: 3, fig: balance(8, 5, '6 + 2', '? + 5'),
        hint: 'The left side is 8. What goes with 5 to make 8?', explain: '6 + 2 = 8, and 3 + 5 = 8. The missing number is 3.' }
    ],

    practice: [
      { id: 'b-20', name: 'Add and subtract to 20', code: 'B2.3', gen: q20 },
      { id: 'b-tens', name: 'Jump by tens', code: 'B2.4', gen: qTens },
      { id: 'b-two', name: 'Bigger numbers', code: 'B2.4', gen: qTwo },
      { id: 'b-story', name: 'Story problems to 50', code: 'B2.4', gen: qStory },
      { id: 'b-equal', name: 'Is it equal?', code: 'C2.2, C2.3', gen: qEqual }
    ]
  });

  /* ---------- More ways to ask (question shapes, see docs/QUESTIONS.md) ---------- */
  var G = window.G1, nm = A.Q ? A.Q.name : function () { return R.pick(PEOPLE); };
  /* a + b that crosses ten, a the bigger (level 1 always starts at 9) */
  function cross(lv) { var a = lv === 1 ? 9 : R.int(6, 9), b = R.int(11 - a, 9); return [a, b]; }
  function twoDigit(lv, add) {
    var a, b;
    if (add) { a = R.int(1, 3) * 10 + R.int(0, 5); b = lv === 1 ? R.int(1, 9 - a % 10) : R.int(2, 9); }
    else { a = R.int(2, 4) * 10 + R.int(lv === 1 ? 5 : 1, 9); b = lv === 1 ? R.int(1, a % 10) : R.int(2, 9); }
    return [a, b];
  }
  function trueFalseSum(lv) {
    var tot = R.int(lv === 1 ? 4 : 6, lv === 1 ? 10 : 15), a = R.int(1, tot - 1), c; do { c = R.int(1, tot - 1); } while (c === a);
    var d = tot - c, ok = R.int(0, 1);
    if (!ok) d += R.pick([1, -1]) || 1;
    if (d < 1) d = tot - c + 1;
    return [a, tot - a, c, d];
  }
  var SHAPES = {
    'b-20': [
      [1, 'fill', function (lv) {
        var p = cross(lv), a = p[0], b = p[1], need = 10 - a, rest = b - need;
        return { q: 'Make a ten first. Fill in the blanks.', type: 'fill', fill: eqn(a + ' + ' + b + ' = ' + a + ' + ' + need + ' + [[]]') + '<br>' + eqn('= 10 + [[]] = [[]]'), answers: [rest, rest, a + b], fig: makeTen(a, b),
          hint: a + ' needs ' + need + ' to make 10. Split ' + b + ' into ' + need + ' and the rest.', steps: [b + ' is ' + need + ' and ' + rest + '.', a + ' + ' + need + ' = 10.', '10 + ' + rest + ' = ' + (a + b) + '.'],
          explain: a + ' + ' + b + ' = 10 + ' + rest + ' = ' + (a + b) + '.', meta: { k: 'g1-20-fill' } };
      }],
      [1, 'line', function (lv) {
        var p = cross(lv), a = p[0], b = p[1];
        return { q: 'Start at ' + a + '. Jump ' + b + ' more. Put the marker where you land.', type: 'line', min: 0, max: 20, tick: 1, every: 5, snap: 1, answer: a + b,
          hint: 'Jump to 10 first. Then jump the rest.', steps: [a + ' + ' + (10 - a) + ' = 10.', '10 + ' + (b - 10 + a) + ' = ' + (a + b) + '.'],
          explain: a + ' + ' + b + ' = ' + (a + b) + '.', meta: { k: 'g1-20-line' } };
      }],
      [1, 'tap', function (lv) {
        var p = cross(lv), a = p[0], b = p[1], set = R.shuffle([[a, b], [a, b - 1], [a - 1, b]]);
        return { q: 'Tap the ten frames that show ' + eqn(a + ' + ' + b) + '.', type: 'tap', tiles: set.map(function (x) { return A.draw.frames(x[0], { b: x[1], c: 14, r: 2, min: 20 }); }), answer: set.map(function (x) { return x.join(); }).indexOf(a + ',' + b), answerText: 'the frames with ' + a + ' red and ' + b + ' yellow',
          hint: 'Look for ' + a + ' red and ' + b + ' yellow.', steps: ['Count the red counters: you want ' + a + '.', 'Count the yellow counters: you want ' + b + '.'],
          explain: a + ' red and ' + b + ' yellow make ' + (a + b) + '.', meta: { k: 'g1-20-tap' } };
      }],
      [2, 'mistake', function (lv) {
        var p = cross(lv), a = p[0], b = p[1], who = nm(), truth = !R.int(0, 2), said = truth ? a + b : a + b - 1;
        var right = a + ' + ' + b + ' = ' + (a + b) + '. Make 10 first, then add the rest.';
        return G.tf(who + ' says ' + eqn(a + ' + ' + b + ' = ' + said) + '. True or false: ' + who + ' is right.', truth, right,
          ['Adding past 10 always gives 10.', 'Count the first number again when you count on.', 'The answer is the two digits side by side.'], { k: 'g1-20-tf' },
          { hint: 'Make a ten first.' });
      }]
    ],
    'b-tens': [
      [1, 'line', function (lv) {
        var back = R.int(0, 1), k = R.int(1, lv === 1 ? 2 : 3), a = lv === 1 ? (back ? R.int(k + 1, 5) * 10 : R.int(1, 5 - k) * 10) : (back ? R.int(k, 4) * 10 + R.int(1, 9) : R.int(1, 4 - k) * 10 + R.int(1, 9));
        var ans = back ? a - 10 * k : a + 10 * k;
        return { q: 'Start at ' + a + '. Jump ' + k + ' ten' + (k > 1 ? 's' : '') + ' ' + (back ? 'back' : 'forward') + '. Put the marker where you land.', type: 'line', min: 0, max: 50, tick: 1, every: 10, snap: 1, answer: ans,
          hint: 'Each jump is 10. The ones digit stays the same.', steps: ['Start at ' + a + '.', 'Jump ' + (back ? 'back' : 'forward') + ' by 10s: ' + seq(a + (back ? -10 : 10), k, back ? -10 : 10).join(', ') + '.'],
          explain: a + ' ' + (back ? M : '+') + ' ' + 10 * k + ' = ' + ans + '.', meta: { k: 'g1-tens-line' } };
      }],
      [1, 'build', function (lv) {
        var a = lv === 1 ? R.int(1, 3) * 10 : R.int(11, 29), b = 10 * R.int(1, lv === 1 ? 5 - a / 10 : Math.min(2, tn(50 - a)));
        return { q: 'Build the answer to ' + eqn(a + ' + ' + b) + ' with blocks. Then press Check.', type: 'build', tool: 'base10', opts: { cols: ['t', 'o'] }, answer: a + b,
          hint: 'Build ' + a + '. Then add ' + b / 10 + ' more rod' + (b > 10 ? 's' : '') + '.', steps: [a + ' is ' + tn(a) + ' rods and ' + a % 10 + ' cubes.', 'Add ' + b / 10 + ' rod' + (b > 10 ? 's' : '') + ': ' + (a + b) + '.'],
          explain: a + ' + ' + b + ' = ' + (a + b) + '.', meta: { k: 'g1-tens-build' } };
      }],
      [2, 'match', function (lv) {
        var used = [], pairs = [];
        while (pairs.length < 3) {
          var add = R.int(0, 1), a = R.int(11, 39), b = 10 * R.int(1, 2), ans = add ? a + b : a - b;
          if (ans < 1 || ans > 50 || used.indexOf(ans) >= 0) continue;
          used.push(ans); pairs.push([a + ' ' + (add ? '+' : M) + ' ' + b, String(ans)]);
        }
        return { q: 'Match each one to its answer.', type: 'match', pairs: pairs, hint: 'Adding or taking 10 changes only the tens digit.', steps: ['Count by 10s from the first number.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'g1-tens-match' } };
      }]
    ],
    'b-two': [
      [1, 'build', function (lv) {
        var p = twoDigit(lv, true), a = p[0], b = p[1];
        return { q: 'Build the answer to ' + eqn(a + ' + ' + b) + ' with blocks. Then press Check.', type: 'build', tool: 'base10', opts: { cols: ['t', 'o'] }, answer: a + b,
          hint: 'Build ' + a + ', then add ' + b + ' small cubes. Trade 10 cubes for a rod if you can.', steps: ['Build ' + a + '.', 'Add ' + b + ' cubes.'],
          explain: a + ' + ' + b + ' = ' + (a + b) + '.', meta: { k: 'g1-two-build' } };
      }],
      [1, 'match', function (lv) {
        var used = [], pairs = [];
        while (pairs.length < 3) {
          var add = lv === 1 ? 1 : R.int(0, 1), p = twoDigit(lv, add), ans = add ? p[0] + p[1] : p[0] - p[1];
          if (used.indexOf(ans) >= 0) continue;
          used.push(ans); pairs.push([p[0] + ' ' + (add ? '+' : M) + ' ' + p[1], String(ans)]);
        }
        return { q: 'Match each one to its answer.', type: 'match', pairs: pairs, hint: 'Add or take away the ones. The tens stay the same unless you pass a ten.', steps: ['Work out each one. Then find its answer.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'g1-tens-match' } };
      }],
      [2, 'mistake', function (lv) {
        var a = R.int(1, 4) * 10 + R.int(1, 4), b = R.int(2, 5), who = nm(), truth = !R.int(0, 2), said = truth ? a + b : a + 10 * b;
        var right = b + ' is ones, so add it to the ones: ' + a + ' + ' + b + ' = ' + (a + b) + '.';
        return G.tf(who + ' says ' + eqn(a + ' + ' + b + ' = ' + said) + '. True or false: ' + who + ' is right.', truth, right,
          ['Add the ' + b + ' to the tens.', 'Put the digits side by side.', 'Adding ones never changes a number.'], { k: 'g1-two-tf' },
          { hint: 'Is ' + b + ' tens or ones?' });
      }]
    ],
    'b-story': [
      [1, 'which way', function (lv) {
        var who = nm(), kind = R.int(0, lv === 1 ? 1 : 3), a, b, q, add;
        if (kind === 0) { a = R.int(10, 30); b = R.int(2, 9); q = who + ' has ' + a + ' stickers and gets ' + b + ' more. How many stickers now?'; add = 1; }
        else if (kind === 1) { a = R.int(15, 40); b = R.int(2, 9); q = 'There are ' + a + ' crackers. ' + who + ' eats ' + b + '. How many crackers are left?'; add = 0; }
        else if (kind === 2) { a = R.int(10, 25); b = R.int(10, 20); q = 'A class has ' + a + ' girls and ' + b + ' boys. How many children in all?'; add = 1; }
        else { a = R.int(12, 30); b = a + R.int(2, 12); q = who + ' has ' + a + ' marbles. A friend has ' + b + '. How many more marbles does the friend have?'; add = 0; }
        var o = R.mc(add ? 'Add' : 'Subtract', [add ? 'Subtract' : 'Add']);
        return { q: q + ' Do you add or subtract?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Putting together means add. Taking away or finding how many more means subtract.', steps: [add ? 'The parts go together, so add.' : 'You take away or compare, so subtract.'],
          explain: add ? 'Add: ' + a + ' + ' + b + ' = ' + (a + b) + '.' : 'Subtract: ' + Math.max(a, b) + ' ' + M + ' ' + Math.min(a, b) + ' = ' + Math.abs(b - a) + '.', meta: { k: 'g1-bstory-way' } };
      }],
      [1, 'fill', function (lv) {
        var who = nm(), add = R.int(0, 1), a = add ? R.int(10, 30) : R.int(15, 40), b = R.int(2, 9);
        if (lv === 1) b = add ? R.int(1, Math.max(1, 9 - a % 10)) : R.int(1, Math.max(1, a % 10));
        var q = add ? who + ' has ' + a + ' stickers. ' + who + ' gets ' + b + ' more.' : 'There are ' + a + ' crackers. ' + who + ' eats ' + b + '.';
        return { q: q + ' Write the number sentence.', type: 'fill', fill: eqn('[[]] ' + (add ? '+' : M) + ' [[]] = [[]]'), answers: [a, b, add ? a + b : a - b],
          hint: add ? 'Getting more means add.' : 'Eating some means take away.', steps: ['Start with ' + a + '.', (add ? 'Add ' : 'Take away ') + b + '.'],
          explain: a + ' ' + (add ? '+' : M) + ' ' + b + ' = ' + (add ? a + b : a - b) + '.', meta: { k: 'g1-bstory-fill' } };
      }],
      [2, 'mistake', function (lv) {
        var who = nm(), a = R.int(15, 40), b = R.int(2, 9), truth = !R.int(0, 2), said = truth ? a - b : a + b;
        var right = 'Eating takes some away: ' + a + ' ' + M + ' ' + b + ' = ' + (a - b) + '.';
        return G.tf('There were ' + a + ' crackers. ' + who + ' ate ' + b + '. ' + who + ' says <b>' + said + '</b> are left. True or false: ' + who + ' is right.', truth, right,
          ['Always add the numbers in a story.', 'The answer is the biggest number in the story.', 'Eating adds more crackers.'], { k: 'g1-bstory-tf' },
          { hint: '"Left" means take away.' });
      }]
    ],
    'b-equal': [
      [1, 'tap', function (lv) {
        var rows = [], good = 0;
        while (rows.length < 3) {
          var s = trueFalseSum(lv), ok = s[0] + s[1] === s[2] + s[3], t = eqn(s[0] + ' + ' + s[1] + ' = ' + s[2] + ' + ' + s[3]);
          if ((ok && good) || (!ok && rows.length - good >= 2) || rows.indexOf(t) >= 0) continue;
          rows.push(t); if (ok) good++;
        }
        rows = R.shuffle(rows);
        var ans = rows.map(function (t) { var v = t.replace(/<[^>]+>/g, '').match(/\d+/g).map(Number); return v[0] + v[1] === v[2] + v[3]; }).indexOf(true);
        return { q: 'Tap the one that is <b>true</b>. Both sides must be equal.', type: 'tap', tiles: rows, answer: ans, answerText: rows[ans],
          hint: 'Add each side. Are they the same?', steps: ['Work out the left side.', 'Work out the right side. True means they match.'],
          explain: 'Both sides of ' + rows[ans].replace(/<[^>]+>/g, '') + ' make the same total.', meta: { k: 'g1-eq-tap' } };
      }],
      [1, 'pick', function (lv) {
        var opts = [], good = 0;
        while (opts.length < 4) {
          var s = trueFalseSum(lv), ok = s[0] + s[1] === s[2] + s[3], t = s[0] + ' + ' + s[1] + ' = ' + s[2] + ' + ' + s[3];
          if (opts.indexOf(t) >= 0 || (ok && good >= 2) || (!ok && opts.length - good >= 2)) continue;
          opts.push(t); if (ok) good++;
        }
        var ans = []; opts.forEach(function (t, j) { var v = t.match(/\d+/g).map(Number); if (v[0] + v[1] === v[2] + v[3]) ans.push(j); });
        return { q: 'Pick every one that is <b>true</b>.', type: 'pick', options: opts, answer: ans,
          hint: 'Add each side. True means both sides make the same total.', steps: ['Work out both sides of each one.'],
          explain: ans.map(function (j) { return opts[j]; }).join(' and ') + (ans.length > 1 ? ' are' : ' is') + ' true.', meta: { k: 'g1-eq-pick' } };
      }],
      [2, 'match', function (lv) {
        var tots = R.shuffle([5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 3), pairs = tots.map(function (t) {
          var a = R.int(1, t - 1), c; do { c = R.int(1, t - 1); } while (c === a);
          return [a + ' + ' + (t - a), c + ' + ' + (t - c)];
        });
        return { q: 'Match the ones that are equal.', type: 'match', pairs: pairs, hint: 'Work out each one. Equal means the same total.', steps: ['Add each one. Then find its partner.'],
          explain: pairs.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'g1-eq-match' } };
      }],
      [2, 'mistake', function (lv) {
        var tot = R.int(6, 12), a = R.int(1, tot - 1), c; do { c = R.int(1, tot - 1); } while (c === a || c === tot - a);
        var who = nm(), truth = R.int(0, 1), d = tot - c + (truth ? 0 : 1);
        var right = a + ' + ' + (tot - a) + ' is ' + tot + ' and ' + c + ' + ' + d + ' is ' + (c + d) + (truth ? '. Both sides are equal, so it is true.' : '. The sides are not equal, so it is false.');
        return G.tf(who + ' says ' + eqn(a + ' + ' + (tot - a) + ' = ' + c + ' + ' + d) + ' is true. True or false: ' + who + ' is right.', !!truth, right,
          ['The numbers must be the same on both sides.', 'An equal sign means "the answer is next".', 'Bigger numbers on one side make it false.'], { k: 'g1-eq-tf' },
          { hint: 'Add each side.' });
      }]
    ]
  };
  G.shapes(CH, SHAPES);
})();
