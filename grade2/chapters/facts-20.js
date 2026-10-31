(function () {
  var A = Atlas, R = A.R, D = A.draw;
  var BLUE = 'var(--strand)', YEL = 'var(--hi)';
  /* two ten-frames side by side. cells: array of up to 20 colours (null = empty). crossed: indexes drawn with an X */
  function frames2(cells, label, crossed) {
    var c = 30, s = '';
    for (var f = 0; f < 2; f++) {
      var fx = 4 + f * (5 * c + 22);
      s += D.rr(fx, 4, 5 * c + 4, 2 * c + 4, 8, 'var(--card)', 'style="stroke:var(--ink)" stroke-width="2.5"');
      for (var i = 0; i < 10; i++) {
        var x = fx + 2 + (i % 5) * c, y = 6 + Math.floor(i / 5) * c, k = f * 10 + i;
        if (i % 5) s += '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + c) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
        if (cells[k]) {
          s += '<circle cx="' + (x + c / 2) + '" cy="' + (y + c / 2) + '" r="11" style="fill:' + cells[k] + '" stroke="rgba(0,0,0,.45)" stroke-width="1.2"/>';
          if (crossed && crossed.indexOf(k) >= 0) s += '<path d="M' + (x + 6) + ' ' + (y + 6) + 'L' + (x + c - 6) + ' ' + (y + c - 6) + 'M' + (x + c - 6) + ' ' + (y + 6) + 'L' + (x + 6) + ' ' + (y + c - 6) + '" style="stroke:var(--bad)" stroke-width="3.5" stroke-linecap="round"/>';
        }
      }
      s += '<line x1="' + fx + '" y1="' + (6 + c) + '" x2="' + (fx + 5 * c + 4) + '" y2="' + (6 + c) + '" style="stroke:var(--line)" stroke-width="1.5"/>';
    }
    return A.svg(2 * (5 * c + 22) - 14, 2 * c + 12, s, label);
  }
  /* a in the first frame (blue), b in the second (yellow) */
  function split(a, b) {
    var cells = [], i;
    for (i = 0; i < a; i++) cells[i] = BLUE;
    if (a + b <= 10 && a > 0) for (i = 0; i < b; i++) cells[a + i] = YEL;
    else for (i = 0; i < b; i++) cells[10 + i] = YEL;
    return frames2(cells, a + ' blue counters and ' + b + ' yellow counters. ' + a + ' + ' + b + ' = ' + (a + b));
  }
  /* make ten: the first frame is filled to 10, the rest go in the second frame */
  function made10(a, b) {
    var cells = [], i;
    for (i = 0; i < a + b; i++) cells[i] = i < a ? BLUE : YEL;
    return frames2(cells, 'The first frame is full: 10. ' + (a + b - 10) + ' more in the second frame. ' + a + ' + ' + b + ' = ' + (a + b));
  }
  /* take away: n counters, the last t crossed out */
  function takeAway(n, t) {
    var cells = [], cr = [];
    for (var i = 0; i < n; i++) { cells[i] = BLUE; if (i >= n - t) cr.push(i); }
    return frames2(cells, n + ' counters, ' + t + ' crossed out. ' + (n - t) + ' are left.', cr);
  }
  /* part-part-whole bar */
  function ppw(a, b, hide) {
    var W = 460, u = (W - 8) / Math.max(a + b, 1), s = '';
    var tot = hide === 'w' ? '?' : String(a + b), pa = hide === 'a' ? '?' : String(a), pb = hide === 'b' ? '?' : String(b);
    s += D.rr(4, 4, W - 8, 44, 10, 'color-mix(in srgb,var(--strand) 18%,var(--card))', 'style="stroke:var(--ink)" stroke-width="2.5"');
    s += '<text x="' + W / 2 + '" y="34" text-anchor="middle" font-size="22" font-weight="800">' + tot + '</text>';
    s += D.rr(4, 56, a * u, 44, 10, BLUE, 'style="stroke:var(--ink)" stroke-width="2.5"') + D.rr(4 + a * u, 56, b * u, 44, 10, YEL, 'style="stroke:var(--ink)" stroke-width="2.5"');
    s += '<text x="' + (4 + a * u / 2) + '" y="86" text-anchor="middle" font-size="22" font-weight="800" style="fill:#fff">' + pa + '</text>';
    s += '<text x="' + (4 + a * u + b * u / 2) + '" y="86" text-anchor="middle" font-size="22" font-weight="800" style="fill:#2b2118">' + pb + '</text>';
    return A.svg(W, 106, s, 'A bar model. The whole is ' + tot + '. The parts are ' + pa + ' and ' + pb + '.');
  }
  /* doubles: a mirrored row, n on each side */
  function dbl(n, extra) {
    var s = '', r = 11, g = 27, W = 2 * n * g + 60 + (extra ? g : 0);
    for (var i = 0; i < n; i++) {
      s += A.THING.dot(20 + i * g, 22, r, BLUE);
      s += A.THING.dot(20 + i * g, 56, r, BLUE);
    }
    if (extra) s += A.THING.dot(20 + n * g, 56, r, YEL);
    s += '<line x1="6" y1="39" x2="' + (20 + (n + (extra ? 1 : 0)) * g - 10) + '" y2="39" style="stroke:var(--line)" stroke-width="2" stroke-dasharray="5 4"/>';
    return A.svg(Math.max(80, (n + (extra ? 1 : 0)) * g + 14), 80, s, 'Two rows of ' + n + (extra ? ' and 1 more' : '') + '. ' + n + ' + ' + (n + (extra ? 1 : 0)) + ' = ' + (2 * n + (extra ? 1 : 0)));
  }
  var M = '&minus;';

  function addQ(lv) {
    var a, b;
    if (lv === 1) { a = R.int(1, 9); b = R.int(0, 10 - a); }
    else if (lv === 2) { a = R.int(4, 9); b = R.int(11 - a, 9); }
    else { a = R.int(3, 9); b = R.int(2, 9); }
    if (lv === 3) {
      var w = a + b;
      return { q: 'What number goes in the box? <span class="math big">' + a + ' + &#9633; = ' + w + '</span>', type: 'num', answer: b, fig: ppw(a, b, 'b'),
        hint: 'Start at ' + a + ' and count up to ' + w + '. How many did you count?', steps: ['The whole is ' + w + '. One part is ' + a + '.', 'Count on from ' + a + ': ' + (function () { var x = []; for (var i = a + 1; i <= w; i++) x.push(i); return x.join(', '); })() + '.', 'That is ' + b + ' more, so the box is ' + b + '.'],
        explain: a + ' + ' + b + ' = ' + w + '.' };
    }
    return { q: '<span class="math big">' + a + ' + ' + b + ' = ?</span>', type: 'num', answer: a + b, fig: split(a, b),
      hint: a + b > 10 ? 'Fill the first ten-frame to make 10. How many are left over?' : 'Start at the bigger number and count on.',
      steps: a + b > 10 ? [a + ' needs ' + (10 - a) + ' more to make 10.', 'Split ' + b + ' into ' + (10 - a) + ' and ' + (b - 10 + a) + '.', '10 + ' + (b - 10 + a) + ' = ' + (a + b) + '.' + '<div class="fig">' + made10(a, b) + '</div>']
        : ['Start at ' + Math.max(a, b) + '.', 'Count on ' + Math.min(a, b) + ' more.', 'You land on ' + (a + b) + '.'],
      explain: a + ' + ' + b + ' = ' + (a + b) + '.' };
  }
  function subQ(lv) {
    var w, t;
    if (lv === 1) { w = R.int(4, 10); t = R.int(1, w - 1); }
    else if (lv === 2) { w = R.int(11, 18); t = R.int(w - 9, 9); }
    else { w = R.int(11, 19); t = R.int(Math.max(2, w - 9), 9); }
    var think = 'Think addition: ' + t + ' + &#9633; = ' + w + '.';
    if (lv === 3) {
      var kid = R.pick(['Maya', 'Omar', 'Lee', 'Priya', 'Sam']), thing = R.pick(['stickers', 'crayons', 'marbles', 'cards']);
      return { q: kid + ' had ' + w + ' ' + thing + ' and gave away ' + t + '. How many ' + thing + ' are left?', type: 'num', answer: w - t, fig: ppw(t, w - t, 'b'),
        hint: think, steps: ['The whole is ' + w + '. The part given away is ' + t + '.', think, t + ' + ' + (w - t) + ' = ' + w + ', so ' + (w - t) + ' are left.'], explain: w + ' ' + M + ' ' + t + ' = ' + (w - t) + '.' };
    }
    return { q: '<span class="math big">' + w + ' ' + M + ' ' + t + ' = ?</span>', type: 'num', answer: w - t, fig: takeAway(w, t),
      hint: 'Count the counters that are not crossed out. Or ' + think.charAt(0).toLowerCase() + think.slice(1),
      steps: [think, 'Count up from ' + t + ' to ' + w + '.', 'That is ' + (w - t) + ', so ' + w + ' ' + M + ' ' + t + ' = ' + (w - t) + '.'], explain: w + ' ' + M + ' ' + t + ' = ' + (w - t) + ' because ' + t + ' + ' + (w - t) + ' = ' + w + '.' };
  }

  /* ---------- lessons: one idea at a time ---------- */
  var K = A.kit, CH = 'facts-20';
  function T(k) { return K.T(CH, k); }
  function P(id, lv) { return K.P(CH, id, lv); }
  function nlSvg(a, hops, max, marks) { return D.hops({ min: 0, max: max || 20, tick: 1, every: 2, hops: hops, marks: marks || [], id: 'fx' + a }); }
  var LESSONS = [
    { id: 'add', title: 'Adding facts', sub: 'Put parts together.', concepts: [
      { id: 'together', title: 'Adding puts parts together', exp: ['B2.2'], skill: 'f2-add',
        body: '<p>When we <b>add</b>, we put two parts together to find the <b>whole</b>. The + sign means "put together". The = sign means "is the same as".</p>',
        watch: K.clip([
          ['Here are 5 blue counters.', split(5, 0)],
          ['Put 3 yellow counters with them.', split(5, 3)],
          ['Count them all: 1, 2, 3, 4, 5, 6, 7, 8.', split(5, 3)],
          ['5 and 3 make 8. We write <b>5 + 3 = 8</b>.', '<p class="math big">5 + 3 = 8</p>' + split(5, 3), 2200]
        ]),
        try: { tool: 'tenframe', opts: { frames: 2, two: true }, tasks: [
          { do: 'Tap boxes to show <b>6 + 3</b>. Tap once for blue, twice for yellow. Make 6 blue and 3 yellow.', goal: function (s) { return s.a === 6 && s.b === 3; }, yes: '6 and 3 make 9. 6 + 3 = 9.' },
          { do: 'Now show <b>4 + 5</b>.', goal: function (s) { return s.a === 4 && s.b === 5; }, yes: '4 + 5 = 9. A different pair can make the same whole.' }
        ] },
        key: '<p><b>Part + part = whole.</b></p>',
        check: [P('f2-add', 1), P('f2-add', 1)] },
      { id: 'counton', title: 'Count on from the bigger number', exp: ['B2.2'], skill: 'f2-add',
        body: '<p>You do not have to count from 1. Start at the <b>bigger</b> number and <b>count on</b>.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 20, every: 2, start: 0 }, steps: [
          { say: 'Let\'s add 9 + 3. Start at the bigger number, 9.', act: function (t) { return t.moveTo(9); }, ms: 900 },
          { say: 'Count on 3: 10,', act: function (t) { return t.hop(10, '+1'); } },
          { say: '11,', act: function (t) { return t.hop(11, '+1'); } },
          { say: '12. We land on 12. So <b>9 + 3 = 12</b>.', act: function (t) { return t.hop(12, '+1'); }, ms: 2000 }
        ] },
        try: { tool: 'numberline', opts: { min: 0, max: 20, every: 2, start: 0, step: 1 }, tasks: [
          { do: 'Show <b>8 + 4</b>. Tap 8 on the line, then press <b>Jump +1</b> four times.', goal: function (s) { return s.at === 12 && s.hops >= 4; }, yes: 'You counted on 4 from 8 and landed on 12.' },
          { do: 'Show <b>2 + 9</b>. Start at the bigger number!', goal: function (s) { return s.at === 11 && s.hops === 2; }, yes: 'Start at 9 and count on 2: 10, 11. Only 2 jumps.' }
        ] },
        key: '<p>Start at the <b>bigger</b> number. Count on the smaller one.</p>',
        mistake: '<p>Counting the start number as the first jump ("9, 10, 11" for 9 + 3). The first number said after the start is the first jump: 10, 11, 12.</p>',
        check: [T('addon'), T('addon')] },
      { id: 'turnaround', title: 'Turn-around facts', exp: ['B2.1'], skill: 'f2-family',
        body: '<p>You can add in any order. <b>3 + 6</b> and <b>6 + 3</b> are both 9. They are called <b>turn-around facts</b>.</p>',
        watch: K.clip([
          ['3 blue and 6 yellow: 3 + 6.', split(3, 6)],
          ['Turn the picture around: 6 yellow and 3 blue.', frames2([YEL, YEL, YEL, YEL, YEL, YEL, BLUE, BLUE, BLUE], '6 yellow and 3 blue counters')],
          ['Same counters, same total. <b>3 + 6 = 6 + 3 = 9</b>.', '<p class="math big">3 + 6 = 6 + 3</p>', 2200]
        ]),
        try: { tool: 'tenframe', opts: { frames: 2, two: true }, tasks: [
          { do: 'Show <b>2 + 7</b>: 2 blue and 7 yellow.', goal: function (s) { return s.a === 2 && s.b === 7; }, yes: '2 + 7 = 9.' },
          { do: 'Now show the turn-around fact, <b>7 + 2</b>: 7 blue and 2 yellow.', goal: function (s) { return s.a === 7 && s.b === 2; }, yes: '7 + 2 = 9 too. Same parts, same whole.' }
        ] },
        key: '<p>Changing the order of the parts does not change the whole. Adding 0 does not change a number either: 8 + 0 = 8.</p>',
        check: [function () {
          var a = R.int(2, 9), b = R.int(2, 9); while (b === a) b = R.int(2, 9);
          var o = R.mc(b + ' + ' + a, [a + ' ' + M + ' ' + b, a + ' + ' + a, (a + b) + ' + ' + b]);
          return { q: 'Which is the same as <span class="math">' + a + ' + ' + b + '</span>?', type: 'mc', options: o.options, answer: o.answer, hint: 'You can add in any order.', explain: a + ' + ' + b + ' and ' + b + ' + ' + a + ' are both ' + (a + b) + '.' };
        }, function () {
          var a = R.int(3, 12);
          return { q: '<span class="math big">' + a + ' + 0 = ?</span>', type: 'num', answer: a, hint: 'Adding 0 means adding nothing.', explain: a + ' + 0 = ' + a + '. Adding 0 does not change the number.' };
        }] }
    ] },
    { id: 'ten', title: 'Make a ten', sub: 'Ten is a friendly number.', concepts: [
      { id: 'pairs10', title: 'Pairs that make 10', exp: ['B2.2'], skill: 'f2-make10',
        body: '<p>Some pairs of numbers make exactly <b>10</b>: 1 + 9, 2 + 8, 3 + 7, 4 + 6, 5 + 5. A ten-frame shows them: the filled boxes and the empty boxes make 10.</p>',
        watch: { tool: 'tenframe', opts: {}, steps: [
          { say: 'A ten-frame has 10 boxes.', ms: 900 },
          { say: 'Fill 7 boxes.', act: function (t) { return t.fill(7, 250); } },
          { say: 'How many are empty? 3. So <b>7 + 3 = 10</b>.', ms: 2200 }
        ] },
        try: { tool: 'tenframe', opts: { two: true }, tasks: [
          { do: 'Fill <b>6</b> boxes blue. Then fill the empty boxes yellow. How many yellow?', goal: function (s) { return s.a === 6 && s.b === 4; }, yes: '6 + 4 = 10.' },
          { do: 'Show another pair that makes 10.', goal: function (s) { return s.full && s.a > 0 && s.b > 0; }, yes: function (s) { return s.a + ' + ' + s.b + ' = 10.'; } }
        ] },
        key: '<p>Know your pairs that make 10. They help with every other fact.</p>',
        check: [T('need10'), T('need10')] },
      { id: 'bridge', title: 'Make a ten to add', exp: ['B2.2'], skill: 'f2-make10', hard: true,
        body: '<p>To add <b>9 + 5</b>, first make a ten. 9 needs 1 more to make 10. Take 1 from the 5. Now it is <b>10 + 4 = 14</b>, which is easy.</p>',
        watch: K.clip([
          ['9 blue and 5 yellow. That is 9 + 5.', split(9, 5)],
          ['Move 1 yellow up to fill the first frame. Now it has 10.', made10(9, 5)],
          ['10 and 4 more. <b>9 + 5 = 10 + 4 = 14</b>.', '<p class="math big">9 + 5 = 10 + 4 = 14</p>' + made10(9, 5), 2400]
        ]),
        try: { tool: 'tenframe', opts: { frames: 2 }, tasks: [
          { do: 'Show <b>8 + 5</b>. Fill the first frame (8 and 2 more), then put the rest in the second frame.', goal: function (s) { return s.n === 13; }, yes: '8 + 5 = 10 + 3 = 13.' },
          { do: 'Show <b>7 + 6</b> the same way.', goal: function (s) { return s.n === 13; }, yes: '7 needs 3 to make 10. 6 is 3 and 3. So 10 + 3 = 13.' }
        ] },
        ways: [
          { label: 'On a number line', html: '<p>Hop to 10 first, then hop the rest.</p>' + nlSvg(9, [{ a: 9, b: 10, t: '+1' }, { a: 10, b: 14, t: '+4' }], 16, [{ v: 14, t: '14' }]) + '<p>9 + 1 = 10. 10 + 4 = 14.</p>' },
          { label: 'With numbers', html: '<p class="math">8 + 6</p><p>8 needs <b>2</b>. Split 6 into <b>2</b> and <b>4</b>.</p><p class="math">8 + 2 = 10, &nbsp; 10 + 4 = 14</p>' },
          { label: 'Use a double', html: '<p>Some people use doubles instead: 7 + 6 is 6 + 6 + 1 = 13. Use the way that makes sense to you.</p>' }
        ],
        key: '<p>Fill a ten first, then add what is left.</p>',
        mistake: '<p>Forgetting to take the moved amount away from the second number (9 + 5 becomes 10 + 5). Ask: "You moved 1 counter. How many are left in the second frame?"</p>',
        check: [T('make10'), P('f2-make10', 2)] }
    ] },
    { id: 'doubles', title: 'Doubles', sub: 'Same and same.', concepts: [
      { id: 'dbl', title: 'Doubles', exp: ['B2.2'], skill: 'f2-doubles',
        body: '<p>A <b>double</b> adds a number to itself: 6 + 6. Two rows that match show a double.</p>' +
          '<div class="tbl"><table><tbody><tr>' + [1, 2, 3, 4, 5].map(function (n) { return '<td>' + n + ' + ' + n + ' = <b>' + 2 * n + '</b></td>'; }).join('') + '</tr><tr>' + [6, 7, 8, 9, 10].map(function (n) { return '<td>' + n + ' + ' + n + ' = <b>' + 2 * n + '</b></td>'; }).join('') + '</tr></tbody></table></div>',
        watch: K.clip([
          ['One row of 6.', dbl(6).replace(/<circle[^>]*cy="56"[^>]*\/>/g, '')],
          ['A matching row of 6.', dbl(6)],
          ['6 + 6 = <b>12</b>. A double always makes an even number.', dbl(6), 2000]
        ]),
        try: { tool: 'counters', opts: { n: 0, controls: ['pairs'], max: 20 }, tasks: [
          { do: 'Make <b>7 + 7</b>: add counters until there are 14, then press <b>Pair them up</b>.', goal: function (s) { return s.n === 14 && s.mode === 'pairs'; }, yes: '7 pairs. 7 + 7 = 14.' },
          { do: 'Make <b>9 + 9</b> and pair them up.', goal: function (s) { return s.n === 18 && s.mode === 'pairs'; }, yes: '9 + 9 = 18.' }
        ] },
        key: '<p>Learn the doubles by heart. They are some of the easiest facts to remember.</p>',
        check: [function () { var n = R.int(3, 10); return { q: '<span class="math big">' + n + ' + ' + n + ' = ?</span>', type: 'num', answer: 2 * n, fig: dbl(n), hint: 'This is a double. Count both rows, or count by ' + n + 's twice.', explain: n + ' + ' + n + ' = ' + 2 * n + '.' }; }, P('f2-doubles', 1)] },
      { id: 'near', title: 'Near doubles', exp: ['B2.2'], skill: 'f2-doubles', hard: true,
        body: '<p><b>7 + 8</b> is almost a double. Think <b>7 + 7 = 14</b>, then add 1 more: <b>15</b>.</p>',
        watch: K.clip([
          ['7 + 8. One row of 7 and one row of 8.', dbl(7, true)],
          ['Look: it is 7 + 7 with one extra counter.', dbl(7, true)],
          ['7 + 7 = 14, and 1 more is <b>15</b>.', '<p class="math big">7 + 8 = 7 + 7 + 1 = 15</p>', 2200]
        ]),
        ways: [
          { label: 'Double the smaller', html: '<p>6 + 7: double the smaller number, 6 + 6 = 12. Then 1 more: <b>13</b>.</p>' + dbl(6, true) },
          { label: 'Double the bigger', html: '<p>6 + 7: double the bigger number, 7 + 7 = 14. Then 1 less: <b>13</b>. Both ways give the same answer.</p>' },
          { label: 'Make a ten', html: '<p>6 + 7: 6 needs 4 to make 10. 7 is 4 and 3. 10 + 3 = <b>13</b>.</p>' }
        ],
        key: '<p>Near double: find the double, then add 1.</p>',
        mistake: '<p>Doubling the bigger number and then adding 1 (7 + 8 as 8 + 8 + 1 = 17). If you double the bigger number, take 1 away.</p>',
        check: [T('near'), T('near')] }
    ] },
    { id: 'sub', title: 'Subtracting facts', sub: 'Take away, and find the difference.', concepts: [
      { id: 'takeaway', title: 'Take away', exp: ['B2.2'], skill: 'f2-sub',
        body: '<p>When we <b>subtract</b>, we take a part away from the whole. The &minus; sign means "take away". What is left is the answer.</p>',
        watch: K.clip([
          ['There are 13 counters.', takeAway(13, 0)],
          ['Take away 5. Cross them out.', takeAway(13, 5)],
          ['8 are left. <b>13 &minus; 5 = 8</b>.', '<p class="math big">13 &minus; 5 = 8</p>' + takeAway(13, 5), 2200]
        ]),
        try: { tool: 'tenframe', opts: { frames: 2, n: 15 }, tasks: [
          { do: 'There are 15. Tap counters to take away <b>6</b>.', goal: function (s) { return s.n === 9; }, yes: '15 &minus; 6 = 9.' },
          { do: 'Now take away <b>4 more</b>. How many are left?', reset: false, goal: function (s) { return s.n === 5; }, yes: '9 &minus; 4 = 5.' }
        ] },
        key: '<p><b>Whole &minus; part = part.</b></p>',
        check: [T('take'), P('f2-sub', 1)] },
      { id: 'difference', title: 'How many more?', exp: ['B2.2'], skill: 'f2-sub',
        body: '<p>Subtracting also tells how many <b>more</b> one number is than another. This is the <b>difference</b>. Count up from the smaller number to the bigger one.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 20, every: 2, start: 0 }, steps: [
          { say: 'Ana has 14 stickers. Ben has 9. How many more does Ana have?', act: function (t) { t.mark(14, '14', true); return t.moveTo(9); }, ms: 1200 },
          { say: 'Start at 9. Hop to 10.', act: function (t) { return t.hop(10, '+1'); } },
          { say: 'Then hop to 14.', act: function (t) { return t.hop(14, '+4'); } },
          { say: '1 and 4 make 5. Ana has <b>5 more</b>. 14 &minus; 9 = 5.', ms: 2200 }
        ] },
        try: { tool: 'numberline', opts: { min: 0, max: 20, every: 2, start: 0, step: 1 }, tasks: [
          { do: 'How many more is 12 than 8? Tap <b>8</b>, then jump +1 until you reach 12.', goal: function (s) { return s.at === 12 && s.hops >= 4; }, yes: function (s) { return 'You made ' + s.hops + ' jumps. 12 is 4 more than 8.'; } }
        ] },
        key: '<p>"How many more" means find the <b>difference</b>: subtract, or count up.</p>',
        mistake: '<p>Adding the two numbers because the question says "more". "How many more" asks for the difference, so subtract.</p>',
        check: [function () { var a = R.int(11, 18), b = R.int(a - 9, a - 2); return { q: 'How many more is <b>' + a + '</b> than <b>' + b + '</b>?', type: 'num', answer: a - b, fig: nlSvg(a, [{ a: b, b: a, t: '?' }], 20, [{ v: b, t: String(b) }, { v: a, t: String(a) }]), hint: 'Count up from ' + b + ' to ' + a + '.', steps: ['Start at ' + b + '.', 'Count up to ' + a + '.', 'That is ' + (a - b) + '.'], explain: a + ' ' + M + ' ' + b + ' = ' + (a - b) + '.' }; }, P('f2-story', 2)] },
      { id: 'thinkadd', title: 'Think addition to subtract', exp: ['B2.1', 'B2.2'], skill: 'f2-sub', hard: true,
        body: '<p>Adding and subtracting undo each other. To find <b>13 &minus; 5</b>, ask: <b>5 plus what makes 13?</b> 5 + 8 = 13, so 13 &minus; 5 = 8.</p>',
        watch: K.clip([
          ['13 &minus; 5. The whole is 13. One part is 5.', ppw(5, 8, 'b')],
          ['Ask: 5 plus what makes 13? Count up: 6, 7, 8, 9, 10, 11, 12, 13. That is 8.', ppw(5, 8, 'b')],
          ['The missing part is 8. So <b>13 &minus; 5 = 8</b>.', ppw(5, 8), 2200]
        ]),
        ways: [
          { label: 'Bar model', html: '<p>The top bar is the whole. The bottom bars are the parts. Knowing two of them gives you the third.</p>' + ppw(6, 9, 'b') + '<p>6 + ? = 15. The missing part is 9.</p>' },
          { label: 'Use a fact you know', html: '<p>16 &minus; 8: you know the double 8 + 8 = 16. So 16 &minus; 8 = <b>8</b>.</p>' },
          { label: 'Back through 10', html: '<p>14 &minus; 6: take 4 to get to 10, then 2 more. 10 &minus; 2 = <b>8</b>.</p>' + nlSvg(14, [{ a: 14, b: 10, t: '&minus;4' }, { a: 10, b: 8, t: '&minus;2' }], 16, [{ v: 8, t: '8' }]) }
        ],
        key: '<p>To subtract, think of the addition fact.</p>',
        check: [P('f2-sub', 2), P('f2-sub', 2)] }
    ] },
    { id: 'family', title: 'Fact families and stories', sub: 'Three numbers, four facts.', concepts: [
      { id: 'family', title: 'Fact families', exp: ['B2.1'], skill: 'f2-family',
        body: '<p>The numbers <b>6, 8 and 14</b> make a fact family: two adding facts and two subtracting facts.</p><p class="math">6 + 8 = 14 &nbsp; 8 + 6 = 14<br>14 &minus; 6 = 8 &nbsp; 14 &minus; 8 = 6</p>',
        watch: K.clip([
          ['The whole is 14. The parts are 6 and 8.', ppw(6, 8)],
          ['Put the parts together: 6 + 8 = 14 and 8 + 6 = 14.', '<p class="math big">6 + 8 = 14<br>8 + 6 = 14</p>'],
          ['Take a part away from the whole: 14 &minus; 6 = 8 and 14 &minus; 8 = 6.', '<p class="math big">14 &minus; 6 = 8<br>14 &minus; 8 = 6</p>', 2200]
        ]),
        key: '<p>In a subtracting fact, the <b>whole comes first</b>.</p>',
        mistake: '<p>Writing a subtracting fact with a part first (8 &minus; 14). Point to the bar: you take a part away from the whole.</p>',
        check: [T('fam'), P('f2-family', 2)] },
      { id: 'story', title: 'Story problems', exp: ['B2.2'], skill: 'f2-story',
        body: '<p>In a story, ask: do I know <b>both parts</b> (add), or the <b>whole and one part</b> (subtract)? A bar model helps you see it.</p>',
        watch: K.clip([
          ['Mia has 8 red beads and 7 blue beads. How many in all?', ppw(8, 7, 'w')],
          ['Both parts are known, so add: 8 + 7 = 15.', ppw(8, 7)],
          ['Mia has 15 beads. She uses 6. How many are left? Now we know the whole and a part.', ppw(6, 9, 'b')],
          ['Subtract: 15 &minus; 6 = <b>9</b>.', ppw(6, 9), 2200]
        ]),
        key: '<p>Both parts known: add. Whole and one part known: subtract.</p>',
        check: [P('f2-story', 1), P('f2-story', 2)] }
    ] }
  ];

  A.register('facts-20', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Adding: count on</h2>' +
'<p>To add, put two groups together. Start at the <b>bigger</b> number and count on.</p>' +
'<div class="eg"><b class="t">Watch me</b><p><span class="big">7 + 3</span> &nbsp; I start at 7 and count on 3: 8, 9, 10. So 7 + 3 = <b>10</b>.</p><div class="fig">' + split(7, 3) + '</div>' +
'<div class="fig">' + D.hops({ min: 0, max: 12, tick: 1, every: 1, id: 'h73', hops: [{ a: 7, b: 8, t: '+1' }, { a: 8, b: 9, t: '+1' }, { a: 9, b: 10, t: '+1' }], marks: [{ v: 7, col: 'var(--hi)' }], label: 'Start at 7 and hop 3 times to 10' }) + '</div></div>' +
'<div class="yt" data-yt="addon"></div>' +
'<p><b>Turnaround facts:</b> you can add in any order. 3 + 7 is the same as 7 + 3. Adding <b>0</b> changes nothing: 9 + 0 = 9.</p>' +
'<div class="lab"><span class="lt">Try it: two groups</span>' +
'<div class="ctrl"><label for="fa">Blue: <output id="fao">6</output><input type="range" id="fa" min="0" max="10" value="6"></label><label for="fb">Yellow: <output id="fbo">3</output><input type="range" id="fb" min="0" max="10" value="3"></label></div>' +
'<div class="fig" id="ffig"></div><div class="out" id="fout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Start counting on from the bigger number. It is faster: for 2 + 9, start at 9 and count 10, 11.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Make a ten</h2>' +
'<p>A full ten-frame is <b>10</b>. When a sum is more than 10, fill the first frame, then see how many are left over.</p>' +
'<div class="eg"><b class="t">Watch me</b><p><span class="big">8 + 5</span> &nbsp; 8 needs <b>2</b> more to make 10. I split 5 into 2 and 3. 8 + 2 = 10. Then 10 + 3 = <b>13</b>.</p>' +
'<div class="vrow"><figure>' + split(8, 5) + '<figcaption>Before</figcaption></figure><figure>' + made10(8, 5) + '<figcaption>Move 2 to fill the ten</figcaption></figure></div></div>' +
'<div class="yt" data-yt="need10"></div>' +
'<div class="tbl"><table><thead><tr><th class="l">Number</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th></tr></thead><tbody><tr><td class="l"><b>Needs this many to make 10</b></td><td>9</td><td>8</td><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td></tr></tbody></table></div>' +
'<div class="lab"><span class="lt">Try it: make a ten</span>' +
'<div class="ctrl"><label for="ma">First number<select id="ma"><option>6</option><option>7</option><option selected>8</option><option>9</option></select></label><label for="mb">Second number<select id="mb"><option>2</option><option>3</option><option>4</option><option>5</option><option selected>6</option><option>7</option><option>8</option><option>9</option></select></label>' +
'<button type="button" class="btn" id="mgo">Fill the ten</button></div>' +
'<div class="fig" id="mfig"></div><div class="out" id="mout"></div></div>' +
'<div class="yt" data-yt="make10"></div>' +
'<div class="key"><b class="t">Key idea</b><p>Ten and some more is easy: 10 + 3 = 13, 10 + 7 = 17. Making a ten first turns a hard fact into an easy one.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Doubles and near doubles</h2>' +
'<p>A <b>double</b> adds a number to itself, like 6 + 6. Doubles are worth knowing by heart.</p>' +
'<div class="tbl"><table><tbody><tr><td>1 + 1 = 2</td><td>2 + 2 = 4</td><td>3 + 3 = 6</td><td>4 + 4 = 8</td><td>5 + 5 = 10</td></tr><tr><td>6 + 6 = 12</td><td>7 + 7 = 14</td><td>8 + 8 = 16</td><td>9 + 9 = 18</td><td>10 + 10 = 20</td></tr></tbody></table></div>' +
'<div class="yt" data-yt="dbl"></div>' +
'<p>A <b>near double</b> is one more than a double.</p>' +
'<div class="eg"><b class="t">Watch me</b><p><span class="big">6 + 7</span> &nbsp; I know 6 + 6 = 12. 7 is one more than 6, so 6 + 7 is one more than 12. 6 + 7 = <b>13</b>.</p><div class="fig">' + dbl(6, true) + '</div></div>' +
'<div class="yt" data-yt="near"></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Using a near double when the numbers are 2 apart. 6 + 8 is not a near double. Use 7 + 7 = 14, or make a ten: 8 + 2 + 4 = 14.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Subtracting</h2>' +
'<p>Subtracting can mean <b>taking away</b>. Start with all of them, take some away, and count what is left.</p>' +
'<div class="eg"><b class="t">Watch me</b><p><span class="big">12 ' + M + ' 4</span> &nbsp; I start with 12. I cross out 4. There are <b>8</b> left. So 12 ' + M + ' 4 = 8.</p><div class="fig">' + takeAway(12, 4) + '</div></div>' +
'<div class="yt" data-yt="take"></div>' +
'<p>Subtracting can also find the <b>difference</b>: how many more one group has than another.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>Ana has 9 apples. Ben has 6. Line them up. Ana has <b>3 more</b>. 9 ' + M + ' 6 = 3.</p><div class="fig">' + A.svg(300, 76, (function () { var s = ''; for (var i = 0; i < 9; i++) s += A.THING.apple(22 + i * 30, 22, 11); for (var j = 0; j < 6; j++) s += A.THING.apple(22 + j * 30, 58, 11, '#2f9e44'); s += '<rect x="186" y="6" width="94" height="32" rx="8" fill="none" style="stroke:var(--bad)" stroke-width="2.5" stroke-dasharray="5 4"/>'; return s; })(), 'Ana has 9 red apples. Ben has 6 green apples. Lined up, Ana has 3 extra.') + '</div></div>' +
'<div class="lab"><span class="lt">Try it: take away</span>' +
'<div class="ctrl"><label for="ta">Start with: <output id="tao">15</output><input type="range" id="ta" min="1" max="20" value="15"></label><label for="tb">Take away: <output id="tbo">7</output><input type="range" id="tb" min="0" max="20" value="7"></label></div>' +
'<div class="fig" id="tfig"></div><div class="out" id="tout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>To subtract, you can <b>think addition</b>. For 15 ' + M + ' 7, ask: 7 plus what makes 15? 7 + 8 = 15, so 15 ' + M + ' 7 = 8.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Fact families</h2>' +
'<p>Three numbers that go together make a <b>fact family</b>: two parts and a whole. Each family has two adding facts and two subtracting facts.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>The parts are 8 and 5. The whole is 13.</p><div class="fig">' + ppw(8, 5) + '</div>' +
'<p class="math">8 + 5 = 13 &nbsp;&nbsp; 5 + 8 = 13 &nbsp;&nbsp; 13 ' + M + ' 8 = 5 &nbsp;&nbsp; 13 ' + M + ' 5 = 8</p></div>' +
'<div class="yt" data-yt="fam"></div>' +
'<div class="lab"><span class="lt">Try it: build a fact family</span>' +
'<div class="ctrl"><label for="pa">Blue part<input type="number" id="pa" min="0" max="10" value="9"></label><label for="pb">Yellow part<input type="number" id="pb" min="0" max="10" value="7"></label></div>' +
'<div class="fig" id="pfig"></div><div class="out" id="pout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Adding and subtracting undo each other. If 9 + 7 = 16, then 16 ' + M + ' 7 = 9. Use the fact you know to find the one you do not.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Turning a subtraction around. 13 ' + M + ' 5 is not the same as 5 ' + M + ' 13. In subtracting, the whole always comes first.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      function f() {
        var a = +$('#fa', root).value, b = +$('#fb', root).value;
        $('#fao', root).textContent = a; $('#fbo', root).textContent = b;
        $('#ffig', root).innerHTML = split(a, b);
        $('#fout', root).innerHTML = '<p><span class="big">' + a + ' + ' + b + ' = ' + (a + b) + '</span> &nbsp; and the turnaround fact: <b>' + b + ' + ' + a + ' = ' + (a + b) + '</b>.</p><p class="t2">' +
          (a === 0 || b === 0 ? 'Adding 0 does not change the number.' : 'Start at ' + Math.max(a, b) + ' and count on ' + Math.min(a, b) + '.') + '</p>';
      }
      A.bind(root, ['fa', 'fb'], f);
      var filled = false;
      function m() {
        var a = +$('#ma', root).value, b = +$('#mb', root).value, need = 10 - a;
        if (b < need) { $('#mfig', root).innerHTML = split(a, b); $('#mout', root).innerHTML = '<p>' + a + ' + ' + b + ' = ' + (a + b) + '. That is not more than 10, so there is no ten to make. Pick a bigger second number.</p>'; $('#mgo', root).disabled = true; return; }
        $('#mgo', root).disabled = filled;
        $('#mfig', root).innerHTML = filled ? made10(a, b) : split(a, b);
        $('#mout', root).innerHTML = filled ? '<p>' + a + ' + <b>' + need + '</b> = 10. Then 10 + ' + (b - need) + ' = <span class="big">' + (a + b) + '</span></p><p class="t2">' + b + ' was split into ' + need + ' and ' + (b - need) + '.</p>'
          : '<p>' + a + ' needs <b>' + need + '</b> more to make 10. Press "Fill the ten".</p>';
      }
      $('#mgo', root).addEventListener('click', function () { filled = true; m(); });
      ['ma', 'mb'].forEach(function (k) { $('#' + k, root).addEventListener('change', function () { filled = false; m(); }); });
      m();
      function t() {
        var a = +$('#ta', root).value, bEl = $('#tb', root);
        bEl.max = a;
        var b = Math.min(+bEl.value, a);
        bEl.value = b;
        $('#tao', root).textContent = a; $('#tbo', root).textContent = b;
        $('#tfig', root).innerHTML = takeAway(a, b);
        $('#tout', root).innerHTML = '<p><span class="big">' + a + ' ' + M + ' ' + b + ' = ' + (a - b) + '</span></p><p class="t2">Check by adding: ' + b + ' + ' + (a - b) + ' = ' + a + '.</p>';
      }
      A.bind(root, ['ta', 'tb'], t);
      function p() {
        var a = Math.max(0, Math.min(10, parseInt($('#pa', root).value, 10) || 0)), b = Math.max(0, Math.min(10, parseInt($('#pb', root).value, 10) || 0)), w = a + b;
        $('#pfig', root).innerHTML = w ? ppw(a, b) : '';
        $('#pout', root).innerHTML = '<p class="math big" style="font-size:1.3rem">' + a + ' + ' + b + ' = ' + w + '<br>' + b + ' + ' + a + ' = ' + w + '<br>' + w + ' ' + M + ' ' + a + ' = ' + b + '<br>' + w + ' ' + M + ' ' + b + ' = ' + a + '</p>' +
          (a === b ? '<p class="t2">The two parts are the same, so the family only has two different facts.</p>' : '');
      }
      A.bind(root, ['pa', 'pb'], p);
    },

    turns: {
      addon: function () { var a = R.int(5, 9), b = R.int(1, 3); return { q: '<span class="math big">' + a + ' + ' + b + ' = ?</span> Start at ' + a + ' and count on.', type: 'num', answer: a + b, fig: split(a, b), hint: 'Say ' + a + ', then count on ' + b + ' more, one for each yellow counter.', explain: a + ', then ' + (function () { var x = []; for (var i = 1; i <= b; i++) x.push(a + i); return x.join(', '); })() + '. So ' + a + ' + ' + b + ' = ' + (a + b) + '.' }; },
      need10: function () { var a = R.int(1, 9); return { q: 'How many more does <span class="math big">' + a + '</span> need to make 10?', type: 'num', answer: 10 - a, fig: D.frames(a, { c: 30 }), hint: 'Count the empty squares in the ten-frame.', explain: a + ' + ' + (10 - a) + ' = 10.' }; },
      make10: function () { var a = R.int(7, 9), b = R.int(11 - a, 9); return { q: '<span class="math big">' + a + ' + ' + b + ' = ?</span> Make a ten first.', type: 'num', answer: a + b, fig: split(a, b), hint: a + ' needs ' + (10 - a) + ' more to make 10. Take ' + (10 - a) + ' from ' + b + '. What is left?', explain: a + ' + ' + (10 - a) + ' = 10, and 10 + ' + (b - 10 + a) + ' = ' + (a + b) + '.' }; },
      dbl: function () { var n = R.int(3, 9); return { q: '<span class="math big">' + n + ' + ' + n + ' = ?</span>', type: 'num', answer: 2 * n, fig: dbl(n), hint: 'This is a double. Look at the table of doubles above, or count both rows.', explain: n + ' + ' + n + ' = ' + 2 * n + '.' }; },
      near: function () { var n = R.int(4, 9); return { q: '<span class="math big">' + n + ' + ' + (n + 1) + ' = ?</span>', type: 'num', answer: 2 * n + 1, fig: dbl(n, true), hint: 'First find the double: ' + n + ' + ' + n + '. Then add 1 more.', explain: n + ' + ' + n + ' = ' + 2 * n + ', and one more is ' + (2 * n + 1) + '.' }; },
      take: function () { var w = R.int(11, 18), t = R.int(2, 8); return { q: '<span class="math big">' + w + ' ' + M + ' ' + t + ' = ?</span>', type: 'num', answer: w - t, fig: takeAway(w, t), hint: 'Count the counters with no X on them.', explain: w + ' take away ' + t + ' leaves ' + (w - t) + '.' }; },
      fam: function () {
        var a = R.int(5, 9), b = R.int(3, 9);
        while (b === a) b = R.int(3, 9);
        var w = a + b, o = R.mc(w + ' ' + M + ' ' + a + ' = ' + b, [a + ' ' + M + ' ' + b + ' = ' + w, w + ' + ' + a + ' = ' + b, b + ' ' + M + ' ' + a + ' = ' + w]);
        return { q: 'Which fact belongs to the family of <b>' + a + ', ' + b + ' and ' + w + '</b>?', type: 'mc', options: o.options, answer: o.answer, fig: ppw(a, b),
          hint: 'In a subtracting fact, the whole (' + w + ') comes first.', explain: w + ' ' + M + ' ' + a + ' = ' + b + '. Take a part from the whole, and the other part is left.' };
      }
    },

    quiz: [
      { q: '<span class="math big">9 + 4 = ?</span>', type: 'num', answer: 13, fig: split(9, 4), hint: '9 needs 1 more to make 10. Take 1 from the 4. What is left?', explain: '9 + 1 = 10, then 10 + 3 = 13.' },
      { q: '<span class="math big">7 + 7 = ?</span>', type: 'num', answer: 14, hint: 'This is a double. Count by 7s twice, or use 7 + 3 + 4.', explain: '7 + 7 = 14. It is a double.' },
      { q: 'Which is the same as <span class="math">5 + 8</span>?', type: 'mc', options: ['8 + 5', '8 &minus; 5', '5 &minus; 8', '5 + 5'], answer: 0, hint: 'You can add in any order.', explain: '5 + 8 and 8 + 5 are turnaround facts. Both are 13.' },
      { q: '<span class="math big">15 &minus; 6 = ?</span>', type: 'num', answer: 9, fig: takeAway(15, 6), hint: 'Think addition: 6 plus what makes 15?', explain: '6 + 9 = 15, so 15 &minus; 6 = 9.' },
      { q: 'What number goes in the box? <span class="math big">8 + &#9633; = 17</span>', type: 'num', answer: 9, fig: ppw(8, 9, 'b'), hint: 'Count up from 8 to 17. Or think: 17 &minus; 8.', explain: '8 + 9 = 17.' },
      { q: 'Kofi has 14 crayons. Ella has 9 crayons. How many <b>more</b> crayons does Kofi have?', type: 'num', answer: 5, hint: 'Find the difference: 14 &minus; 9. Think 9 plus what makes 14?', explain: '9 + 5 = 14, so Kofi has 5 more. 14 &minus; 9 = 5.' },
      { q: 'Which fact is <b>not</b> in the family of 6, 7 and 13?', type: 'mc', options: ['6 + 7 = 13', '13 &minus; 6 = 7', '7 &minus; 6 = 13', '13 &minus; 7 = 6'], answer: 2, hint: 'In a subtracting fact, the whole (13) comes first.', explain: '7 &minus; 6 is 1, not 13. The whole must come first: 13 &minus; 6 = 7.' }
    ],

    practice: [
      { id: 'f2-add', name: 'Adding facts', code: 'B2.2', gen: addQ },
      { id: 'f2-make10', name: 'Make a ten', code: 'B2.1', gen: function (lv) {
        if (lv === 1) { var a = R.int(1, 9); return { q: '<span class="math big">' + a + ' + &#9633; = 10</span>', type: 'num', answer: 10 - a, fig: D.frames(a, { c: 30 }), hint: 'Count the empty squares in the ten-frame.', steps: ['A full ten-frame holds 10.', a + ' squares are filled.', (10 - a) + (10 - a === 1 ? ' is' : ' are') + ' empty, so ' + a + ' + ' + (10 - a) + ' = 10.'], explain: a + ' + ' + (10 - a) + ' = 10.' }; }
        var x = R.int(6, 9), y = R.int(11 - x, 9), need = 10 - x;
        if (lv === 2) {
          var o = R.mc('10 + ' + (y - need), ['10 + ' + y, '10 + ' + need, '10 + ' + (y - need + 1)]);
          return { q: 'Make a ten. <span class="math big">' + x + ' + ' + y + '</span> is the same as&hellip;', type: 'mc', options: o.options, answer: o.answer, fig: split(x, y), hint: x + ' needs ' + need + ' to make 10. How many are left from ' + y + '?', steps: [x + ' + ' + need + ' = 10.', y + ' ' + M + ' ' + need + ' = ' + (y - need) + ' left over.', 'So ' + x + ' + ' + y + ' = 10 + ' + (y - need) + '.<div class="fig">' + made10(x, y) + '</div>'], explain: x + ' + ' + y + ' = 10 + ' + (y - need) + ' = ' + (x + y) + '.' };
        }
        return { q: '<span class="math big">' + y + ' + ' + x + ' = ?</span>', type: 'num', answer: x + y, hint: 'Start with the bigger number. Make it a ten, then add what is left.', steps: ['The bigger number is ' + Math.max(x, y) + '.', 'Make a ten with it, then add the rest.', x + ' + ' + y + ' = ' + (x + y) + '.<div class="fig">' + made10(Math.max(x, y), Math.min(x, y)) + '</div>'], explain: y + ' + ' + x + ' = ' + (x + y) + '.' };
      } },
      { id: 'f2-doubles', name: 'Doubles and near doubles', code: 'B2.2', gen: function (lv) {
        var n = R.int(lv === 1 ? 1 : 4, lv === 1 ? 6 : 10);
        if (lv === 1 || (lv === 3 && R.int(0, 2) === 0)) return { q: '<span class="math big">' + n + ' + ' + n + ' = ?</span>', type: 'num', answer: 2 * n, fig: lv === 1 ? dbl(n) : '', hint: 'This is a double. Count both rows.', steps: ['There are two rows of ' + n + '.', 'Count them all.', n + ' + ' + n + ' = ' + 2 * n + '.'], explain: n + ' + ' + n + ' = ' + 2 * n + '.' };
        n = Math.min(n, 9);
        var flip = R.int(0, 1), a = flip ? n + 1 : n, b = flip ? n : n + 1;
        return { q: '<span class="math big">' + a + ' + ' + b + ' = ?</span>', type: 'num', answer: 2 * n + 1, fig: lv === 2 ? dbl(n, true) : '', hint: 'Use the double you know: ' + n + ' + ' + n + '. Then add 1.', steps: ['The numbers are next to each other: ' + n + ' and ' + (n + 1) + '.', 'Double the smaller one: ' + n + ' + ' + n + ' = ' + 2 * n + '.', 'Add 1 more: ' + (2 * n + 1) + '.'], explain: a + ' + ' + b + ' = ' + (2 * n + 1) + '.' };
      } },
      { id: 'f2-sub', name: 'Subtracting facts', code: 'B2.2', gen: subQ },
      { id: 'f2-family', name: 'Fact families', code: 'B2.1', gen: function (lv) {
        var a = R.int(3, 9), b = R.int(2, 9);
        while (b === a) b = R.int(2, 9);
        var w = a + b;
        if (lv === 1) {
          return { q: 'The parts are ' + a + ' and ' + b + '. What is the whole?', type: 'num', answer: w, fig: ppw(a, b, 'w'), hint: 'Put the parts together: add them.', steps: ['The whole is both parts together.', a + ' + ' + b + ' = ' + w + '.'], explain: 'The whole is ' + w + '.' };
        }
        if (lv === 2) {
          return { q: 'Use the fact <b>' + a + ' + ' + b + ' = ' + w + '</b>. What is <span class="math big">' + w + ' ' + M + ' ' + b + '</span>?', type: 'num', answer: a, fig: ppw(a, b, 'a'), hint: 'Take one part away from the whole. The other part is left.', steps: [w + ' is the whole. ' + b + ' is one part.', 'The other part is ' + a + '.', 'So ' + w + ' ' + M + ' ' + b + ' = ' + a + '.'], explain: w + ' ' + M + ' ' + b + ' = ' + a + ', because ' + a + ' + ' + b + ' = ' + w + '.' };
        }
        var o = R.mc(w + ' ' + M + ' ' + b + ' = ' + a, [b + ' ' + M + ' ' + a + ' = ' + w, a + ' ' + M + ' ' + w + ' = ' + b, w + ' + ' + b + ' = ' + a]);
        return { q: 'Which fact is in the family of <b>' + a + ', ' + b + ' and ' + w + '</b>?', type: 'mc', options: o.options, answer: o.answer, hint: 'In a subtracting fact, the whole (' + w + ') comes first.', steps: ['The whole is ' + w + '. The parts are ' + a + ' and ' + b + '.', 'A subtracting fact starts with the whole and takes away a part.', w + ' ' + M + ' ' + b + ' = ' + a + ' is in the family.'], explain: w + ' ' + M + ' ' + b + ' = ' + a + '.' };
      } },
      { id: 'f2-story', name: 'Story problems', code: 'B2.2', gen: function (lv) {
        var kid = R.pick(['Maya', 'Omar', 'Lee', 'Priya', 'Sam', 'Noor', 'Jack']), a = R.int(5, 9), b = R.int(lv === 1 ? 1 : 4, 9), w = a + b, kind = lv === 1 ? 0 : R.int(0, lv === 2 ? 1 : 2);
        if (kind === 0) return { q: kid + ' has ' + a + ' red beads and ' + b + ' blue beads. How many beads in all?', type: 'num', answer: w, fig: ppw(a, b, 'w'), hint: '"In all" means put the groups together. Add.', steps: ['Both groups go together, so add.', a + ' + ' + b + ' = ' + w + '.'], explain: a + ' + ' + b + ' = ' + w + ' beads.' };
        if (kind === 1) return { q: 'There were ' + w + ' birds on a fence. ' + b + ' flew away. How many birds are still on the fence?', type: 'num', answer: a, fig: ppw(b, a, 'b'), hint: 'Some went away, so take away. Think: ' + b + ' plus what makes ' + w + '?', steps: ['Start with ' + w + '. Take away ' + b + '.', 'Think addition: ' + b + ' + ' + a + ' = ' + w + '.', 'So ' + a + ' birds are left.'], explain: w + ' ' + M + ' ' + b + ' = ' + a + '.' };
        return { q: kid + ' read ' + a + ' pages. ' + kid + ' wants to read ' + w + ' pages. How many more pages to go?', type: 'num', answer: b, fig: ppw(a, b, 'b'), hint: 'Count up from ' + a + ' to ' + w + '.', steps: ['The whole is ' + w + '. The part done is ' + a + '.', a + ' + &#9633; = ' + w + '.', 'Count up: the box is ' + b + '.'], explain: a + ' + ' + b + ' = ' + w + ', so ' + b + ' more pages.' };
      } }
    ]
  });
})();
