(function () {
  var A = Atlas, R = A.R, W = A.word;
  var KINDS = ['apple', 'star', 'fish', 'flower', 'ball', 'leaf', 'car'];

  /* everyday pictures for "numbers all around us" */
  function bus(n) {
    return A.svg(120, 80, '<rect x="6" y="12" width="108" height="50" rx="10" style="fill:#f2bd24" stroke="rgba(0,0,0,.45)" stroke-width="2"/>' +
      '<rect x="14" y="20" width="20" height="16" rx="3" style="fill:#cfe6f7"/><rect x="40" y="20" width="20" height="16" rx="3" style="fill:#cfe6f7"/><rect x="66" y="20" width="20" height="16" rx="3" style="fill:#cfe6f7"/>' +
      '<rect x="90" y="18" width="18" height="18" rx="3" style="fill:#fff" stroke="#2a2633" stroke-width="1.5"/><text x="99" y="33" text-anchor="middle" font-size="16" font-weight="700" style="fill:#2a2633">' + n + '</text>' +
      '<circle cx="30" cy="64" r="9" style="fill:#2a2633"/><circle cx="92" cy="64" r="9" style="fill:#2a2633"/>', 'A school bus with the number ' + n + ' on it');
  }
  function shirt(n) {
    return A.svg(100, 90, '<path d="M30 8L12 18L2 38L18 44L22 36V86H78V36L82 44L98 38L88 18L70 8Q50 22 30 8Z" style="fill:#2c68cf" stroke="rgba(0,0,0,.45)" stroke-width="2" stroke-linejoin="round"/>' +
      '<text x="50" y="70" text-anchor="middle" font-size="32" font-weight="700" style="fill:#fff;font-family:var(--display)">' + n + '</text>', 'A hockey shirt with the number ' + n + ' on the back');
  }
  function cake(n) {
    var s = '<rect x="10" y="44" width="100" height="36" rx="6" style="fill:#e05aa0" stroke="rgba(0,0,0,.4)" stroke-width="2"/><rect x="10" y="44" width="100" height="10" rx="5" style="fill:#fff"/>';
    for (var i = 0; i < n; i++) {
      var x = 20 + i * (80 / Math.max(1, n - 1));
      s += '<rect x="' + (x - 3) + '" y="22" width="6" height="22" rx="2" style="fill:#2c68cf"/><path d="M' + x + ' 10Q' + (x + 5) + ' 17 ' + x + ' 21Q' + (x - 5) + ' 17 ' + x + ' 10Z" style="fill:#f2bd24"/>';
    }
    return A.svg(120, 84, s, 'A birthday cake with ' + n + ' candles');
  }
  function door(n) {
    return A.svg(100, 90, '<path d="M8 40L50 6L92 40Z" style="fill:#c9432a" stroke="rgba(0,0,0,.4)" stroke-width="2" stroke-linejoin="round"/><rect x="16" y="40" width="68" height="46" style="fill:#f4e3c7" stroke="rgba(0,0,0,.4)" stroke-width="2"/>' +
      '<rect x="40" y="56" width="20" height="30" style="fill:#7a4b2a"/><rect x="58" y="44" width="22" height="14" rx="2" style="fill:#fff" stroke="#2a2633" stroke-width="1.5"/><text x="69" y="56" text-anchor="middle" font-size="12" font-weight="700" style="fill:#2a2633">' + n + '</text>', 'A house with the number ' + n + ' beside the door');
  }

  /* objects in a line with small numbers under each, to show touch-and-count */
  function counted(kind, n, upto) {
    var sz = 34, gap = 8, per = 10, s = '';
    for (var i = 0; i < n; i++) {
      var x = 4 + (i % per) * (sz + gap) + (i % per >= 5 ? 10 : 0) + sz / 2, y = 4 + Math.floor(i / per) * (sz + 34) + sz / 2;
      s += A.icon(kind, x, y, sz);
      if (i < upto) s += '<text x="' + x + '" y="' + (y + sz / 2 + 22) + '" text-anchor="middle" font-size="19" class="tb" style="fill:' + (i === upto - 1 ? 'var(--accent)' : 'var(--ink)') + '">' + (i + 1) + '</text>';
    }
    var cols = Math.min(n, per);
    return A.svg(4 + cols * (sz + gap) + (cols > 5 ? 10 : 0), Math.ceil(n / per) * (sz + 34) + 6, s, A.nm(kind, n) + (upto ? ', counted 1 to ' + upto : ''));
  }

  /* pictures for skip counting: pairs of socks, hands, full ten frames */
  function groupsPic(by, groups) {
    if (by === 10) return A.draw.frames(groups * 10, { r: 2, c: 20, label: groups + ' full ten frames' });
    var kind = by === 2 ? 'sock' : 'hand', sz = 30, s = '', gw = by === 2 ? 2 * sz + 4 : sz + 10, per = by === 2 ? 5 : 6, x, y;
    for (var g = 0; g < groups; g++) {
      x = 6 + (g % per) * (gw + 12); y = 6 + Math.floor(g / per) * (sz + 34);
      s += '<rect x="' + (x - 3) + '" y="' + (y - 3) + '" width="' + (gw + 6) + '" height="' + (sz + 6) + '" rx="10" style="fill:none;stroke:var(--line)" stroke-width="2"/>';
      if (by === 2) s += A.icon('sock', x + sz / 2, y + sz / 2, sz) + A.icon('sock', x + sz * 1.5 + 4, y + sz / 2, sz);
      else s += A.icon('hand', x + gw / 2, y + sz / 2, sz);
      s += '<text x="' + (x + gw / 2) + '" y="' + (y + sz + 25) + '" text-anchor="middle" font-size="19" class="tb" style="fill:var(--accent)">' + (by * (g + 1)) + '</text>';
    }
    var cols = Math.min(groups, per);
    return A.svg(Math.max(60, 8 + cols * (gw + 12)), Math.ceil(groups / per) * (sz + 34) + 8, s, groups + (by === 2 ? ' pairs of socks' : ' hands') + ', counted by ' + by + 's to ' + by * groups);
  }

  function skipList(by, start, len) { var a = []; for (var i = 0; i < len; i++) a.push(start + by * i); return a; }

  /* ---------- practice question makers (also used in Your turn boxes) ---------- */
  function qCount(lv) {
    var kind = R.pick(KINDS), n = lv === 1 ? R.int(3, 10) : lv === 2 ? R.int(11, 20) : R.int(21, 40);
    var fig = lv === 3 ? A.draw.frames(n, { c: 22, label: n + ' counters in ten frames' }) : A.draw.row(kind, n, { per: 10, group: 5, s: 30 });
    var what = lv === 3 ? 'counters' : A.NAMES[kind][1];
    return { q: 'How many ' + what + ' are there?', type: 'num', answer: n, fig: fig,
      hint: lv === 3 ? 'Count the full ten frames by 10s first: 10, 20... then count on the extra ones.' : 'Touch each one once and say one number. The last number you say is how many.',
      steps: lv === 3 ? ['There ' + (Math.floor(n / 10) === 1 ? 'is 1 full frame' : 'are ' + Math.floor(n / 10) + ' full frames') + '. Count by 10s: ' + skipList(10, 10, Math.floor(n / 10)).join(', ') + '.', 'Now count on the ' + n % 10 + ' extra: ' + (n % 10 ? skipList(1, Math.floor(n / 10) * 10 + 1, n % 10).join(', ') : 'there are none') + '.', 'There are ' + n + ' counters.']
        : ['Start at the first one on the left. Say "1".', 'Move along the row. Say one number for each one. Count the first group of 5, then keep going.', 'The last number you say is ' + n + '. There are ' + n + '.'],
      explain: 'There are ' + n + '. The last number you say when you count tells how many.' };
  }
  function qFrame(lv) {
    var n = lv === 1 ? R.int(1, 10) : lv === 2 ? R.int(11, 20) : R.int(21, 50);
    var fig = A.draw.frames(n, { c: lv === 3 ? 20 : 26 }), tens = Math.floor(n / 10), ones = n % 10;
    var steps = n <= 10 ? (n > 5 ? ['The top row is full. That is 5.', 'Count on the bottom row: ' + skipList(1, 6, n - 5).join(', ') + '.', 'The frame shows ' + n + '.'] : n === 5 ? ['The top row is full.', 'The bottom row is empty.', 'A full row is 5. The frame shows 5.'] : ['The top row has ' + n + '.', 'There are ' + (10 - n) + ' empty boxes.', 'The frame shows ' + n + '.'])
      : ['Each full frame is 10. Count them by 10s: ' + skipList(10, 10, tens).join(', ') + '.', 'Count on the extra counters: ' + (ones ? skipList(1, tens * 10 + 1, ones).join(', ') : 'there are none') + '.', 'The frames show ' + n + '.'];
    var base = { fig: fig, hint: n <= 10 ? 'A full row is 5. Start at 5 and count on.' : 'A full frame is 10. Count the full frames first.', steps: steps, explain: 'The frames show ' + (tens ? tens + ' ten' + (tens > 1 ? 's' : '') + (ones ? ' and ' + ones + ' more' : '') : ones) + ': ' + n + '.' };
    if (lv === 3) return Object.assign({ q: 'What number do the ten frames show?', type: 'num', answer: n }, base);
    var o = R.mc(n, [n + 1, n - 1, n + 2, n - 2, n + 5, n - 5].filter(function (v) { return v >= 0 && v <= 50 && v !== n; }).sort(function () { return Math.random() - 0.5; }));
    return Object.assign({ q: 'What number does the ten frame show?', type: 'mc', options: o.options, answer: o.answer }, base);
  }
  function qWords(lv) {
    var n, wrong, q;
    if (lv === 1) {
      n = R.int(0, 10);
      wrong = [n + 1, n - 1, n + 2].filter(function (v) { return v >= 0 && v <= 12; }).map(W);
      var o = R.mc(W(n), wrong);
      return { q: 'Which word is the number <span class="big">' + n + '</span>?', type: 'mc', options: o.options, answer: o.answer, fig: A.draw.frames(n, { c: 22, min: 1 }),
        hint: 'Say the number out loud. Which word sounds the same?', steps: ['Look at the ten frame. Count the counters: ' + n + '.', 'Say the number out loud.', 'The word is "' + W(n) + '".'], explain: n + ' is "' + W(n) + '".' };
    }
    if (lv === 2) {
      n = R.int(13, 19);
      var t = n % 10;
      wrong = [t * 10, n + 1, n - 1].filter(function (v) { return v > 0 && v <= 50 && v !== n; });
      var o2 = R.mc(n, wrong);
      return { q: 'Which number is <b>' + W(n) + '</b>?', type: 'mc', options: o2.options, answer: o2.answer,
        hint: '"Teen" means ten and some more. ' + W(n) + ' is 10 and ' + t + '.',
        steps: ['Listen to the word: ' + W(n) + '. It ends in "teen".', '"Teen" numbers are 10 and some more. ' + W(n) + ' is 10 and ' + t + '.', '10 and ' + t + ' is written ' + n + '. A 1 for the ten, then a ' + t + '.'],
        explain: W(n) + ' is 10 and ' + t + ', so it is ' + n + '. Do not mix it up with ' + W(t * 10) + ', which is ' + t * 10 + '.' };
    }
    n = R.int(21, 50);
    var tn = Math.floor(n / 10), on = n % 10;
    wrong = [on ? on * 10 + tn : n + 1, tn * 10 + (on + 1) % 10, n + 10 <= 50 ? n + 10 : n - 10].filter(function (v) { return v > 0 && v <= 59 && v !== n; });
    var o3 = R.mc(n, wrong);
    return { q: 'Which number is <b>' + W(n) + '</b>?', type: 'mc', options: o3.options, answer: o3.answer,
      hint: 'The first part of the word tells the tens. ' + W(tn * 10) + ' is ' + tn * 10 + '.',
      steps: ['Split the word: "' + W(tn * 10) + '"' + (on ? ' and "' + W(on) + '"' : '') + '.', W(tn * 10) + ' is ' + tn + ' tens, so the first digit is ' + tn + '.', on ? W(on) + ' is the ones, so the last digit is ' + on + '. The number is ' + n + '.' : 'There are no extra ones, so the last digit is 0. The number is ' + n + '.'],
      explain: W(n) + ' is ' + n + '.' };
  }
  function qNext(lv) {
    if (lv === 1) {
      var n = R.int(1, 19), after = R.int(0, 1);
      var ans = after ? n + 1 : n - 1;
      if (ans < 1) { after = 1; ans = n + 1; }
      return { q: 'What number comes just <b>' + (after ? 'after' : 'before') + '</b> ' + n + '?', type: 'num', answer: ans, fig: A.draw.nl(Math.max(0, n - 5), Math.max(0, n - 5) + 10, { mark: n }),
        hint: after ? 'After means one more. Count on one from ' + n + '.' : 'Before means one less. Count back one from ' + n + '.',
        steps: ['Find ' + n + ' on the number line. It has the yellow dot.', after ? 'Step one jump to the right. That is one more.' : 'Step one jump to the left. That is one less.', 'You land on ' + ans + '.'], explain: ans + ' comes just ' + (after ? 'after' : 'before') + ' ' + n + '.' };
    }
    if (lv === 2) {
      var m = R.pick([R.int(20, 49), R.int(2, 4) * 10 - 1, R.int(2, 5) * 10]), af = R.int(0, 1);
      if (m === 50) af = 0;
      var a2 = af ? m + 1 : m - 1;
      return { q: 'What number comes just <b>' + (af ? 'after' : 'before') + '</b> ' + m + '?', type: 'num', answer: a2,
        fig: A.chart({ from: Math.min(31, Math.floor((Math.min(m, a2) - 1) / 10) * 10 + 1), to: Math.min(50, Math.min(31, Math.floor((Math.min(m, a2) - 1) / 10) * 10 + 1) + 19), cls: (function () { var c = {}; c[m] = 'c'; return c; })(), hide: [a2] }),
        hint: af ? 'One more than ' + m + '. On the chart, look one box to the right' + (m % 10 === 9 ? '. After a 9 comes the next ten.' : '.') : 'One less than ' + m + '. On the chart, look one box to the left' + (m % 10 === 0 ? ', at the end of the row above.' : '.'),
        steps: ['Find ' + m + ' on the chart. It is yellow.', af ? 'Move one box to the right' + (m % 10 === 0 ? ', which is the start of the next row' : '') + '.' : 'Move one box to the left' + (m % 10 === 1 ? ', which is the end of the row above' : '') + '.', 'The number there is ' + a2 + '.'], explain: a2 + ' comes just ' + (af ? 'after' : 'before') + ' ' + m + '.' };
    }
    var st = R.int(5, 40), k = R.int(2, 5), end = st + k;
    var hops = [];
    for (var i = 0; i < k; i++) hops.push([st + i, st + i + 1]);
    return { q: 'Start at <b>' + st + '</b>. Count on <b>' + k + '</b> more. Where do you land?', type: 'num', answer: end,
      fig: A.draw.nl(st - 2, st + 8, { mark: st }),
      hint: 'Say ' + st + ' in your head. Then count on ' + k + ', putting up one finger for each number.',
      steps: ['Start at ' + st + '. Do not count it again.', 'Count on ' + k + ': ' + skipList(1, st + 1, k).join(', ') + '.<div class="fig">' + A.draw.nl(st - 2, st + 8, { mark: st, hops: hops }) + '</div>', 'You land on ' + end + '.'],
      explain: 'Counting on ' + k + ' from ' + st + ' lands on ' + end + '.' };
  }
  function qSkip(lv) {
    var by = lv === 1 ? 10 : lv === 2 ? 5 : R.pick([2, 5, 10]);
    if (lv === 3 && by !== 2 && R.int(0, 1)) by = 2;
    var maxStart = Math.floor((50 - by * 3) / by), start = by * R.int(1, Math.max(1, Math.min(maxStart, by === 2 ? 20 : 6)));
    var seq = skipList(by, start, 4), ansI = lv === 3 ? R.int(1, 3) : 3, ans = seq[ansI];
    var shown = seq.map(function (v, i) { return i === ansI ? '<b class="blank">?</b>' : v; }).join(', ');
    if (lv < 3 && R.int(0, 2) === 0) {
      var g = by === 10 ? R.int(2, 4) : R.int(3, 7), tot = g * by;
      return { q: 'Count by ' + by + 's. How many ' + (by === 10 ? 'counters' : by === 2 ? 'socks' : 'fingers') + ' in all?', type: 'num', answer: tot, fig: groupsPic(by, g).replace(/<text[^>]*>\d+<\/text>/g, ''),
        hint: 'Each group has ' + by + '. Say ' + skipList(by, by, 2).join(', ') + '... one number for each group.',
        steps: ['Each group is ' + by + '.', 'Point to each group and count by ' + by + 's: ' + skipList(by, by, g).join(', ') + '.', 'There are ' + tot + ' in all.'],
        explain: g + ' groups of ' + by + ' make ' + tot + '. Counting by ' + by + 's: ' + skipList(by, by, g).join(', ') + '.' };
    }
    var hl = {}; seq.forEach(function (v, i) { if (i !== ansI) hl[v] = 'b'; });
    return { q: 'Count by ' + by + 's. What number is missing? <span class="math">' + shown + '</span>', type: 'num', answer: ans,
      hint: 'Each number is ' + by + ' more than the one before. Start at ' + seq[ansI - 1] + ' and count on ' + by + '.',
      steps: ['Look at the numbers you know: they go up by ' + by + ' each time.', 'The number before the gap is ' + seq[ansI - 1] + '.', seq[ansI - 1] + ' and ' + by + ' more is ' + ans + '.<div class="fig">' + A.chart({ cls: (function () { hl[ans] = 'a'; return hl; })() }) + '</div>'],
      explain: 'Counting by ' + by + 's: ' + seq.join(', ') + '. The missing number is ' + ans + '.' };
  }
  function qEst(lv) {
    var set = lv === 1 ? [5, 20, 50] : lv === 2 ? [10, 20, 30, 40] : [15, 20, 25, 30, 35, 40, 45];
    var c = R.pick(set.slice(lv === 1 ? 0 : 1, set.length - (lv === 3 ? 1 : 0))), n = Math.max(3, c + R.int(-2, 2));
    var others = set.filter(function (v) { return v !== c; });
    if (lv === 3) others = others.filter(function (v) { return Math.abs(v - c) <= 10; });
    var opts = R.shuffle(others).slice(0, 2).concat([c]).sort(function (a, b) { return a - b; });
    var labels = opts.map(function (v) { return 'about ' + v; });
    var o = { options: labels, answer: opts.indexOf(c) };
    var seed = R.int(1, 99999), kind = R.pick(['apple', 'star', 'flower', 'leaf']);
    return { q: 'Do not count every one. Which is the best <b>estimate</b>?', type: 'mc', options: o.options, answer: o.answer,
      fig: A.draw.scatter(n, seed, { kind: kind, w: 340, h: 200, r: n > 30 ? 9 : 11, label: 'A group of ' + A.NAMES[kind][1] + ' spread out' }), chk: { n: n, opts: opts },
      hint: 'Picture what 10 looks like. About how many groups of 10 could you make?',
      steps: ['Find a group of about 10 in the picture.', 'Guess how many groups like that would fit.', 'There are ' + n + ', so "about ' + c + '" is the closest estimate.'],
      explain: 'There are ' + n + '. "About ' + c + '" is closest. An estimate does not have to be exact. It just has to be close.' };
  }

  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = window.G1;
  function P(id, lv) { return function () { var s = A.chapters.counting.practice.filter(function (x) { return x.id === id; })[0]; return s.gen(typeof lv === 'function' ? lv() : lv); }; }
  function mc(q, right, wrong, extra) { var o = R.mc(right, wrong); return Object.assign({ q: q, type: 'mc', options: o.options, answer: o.answer }, extra || {}); }
  function chartCls(list, cls) { var c = {}; list.forEach(function (v) { c[v] = cls || 'a'; }); return c; }

  var LESSONS = [
    { id: 'how-many', title: 'Count how many', sub: 'Touch each one once. The last number tells how many.', concepts: [
      { id: 'touch', title: 'Touch and count', exp: ['B1.1'], skill: 'c-count',
        body: '<p>To count, touch each thing <b>one time</b> and say <b>one number</b>. Go in order, so you do not miss one or count one twice.</p>',
        watch: { mount: function (el) { return K.objects(el, { kind: 'apple', n: 7, tap: false }); }, steps: [
          { say: 'Here are some apples. How many are there?', ms: 1200 },
          { say: 'Touch each apple one time. Say one number for each: 1, 2, 3, 4, 5, 6, 7.', act: function (t) { return t.countAll(520); }, ms: 600 },
          { say: 'The last number we said is <b>7</b>. There are 7 apples.', ms: 1800 }
        ] },
        try: { tool: 'g1objects', opts: { kind: 'fish', n: 6 }, tasks: [
          { do: '<b>Tap each fish</b> to count it. Each one lights up and shows its number.', goal: function (s) { return s.allCounted; }, yes: function (s) { return 'Yes. You touched each fish once. There are ' + s.n + '.'; } }
        ] },
        key: '<p>Touch each one <b>once</b>. Say <b>one number</b> for each.</p>',
        mistake: '<p>Counting the same object twice, or skipping one, when objects are spread out. Ask the child to push each counted object to one side.</p>',
        check: [P('c-count', 1), P('c-count', 1)] },
      { id: 'last', title: 'The last number tells how many', exp: ['B1.1'], skill: 'c-count',
        body: '<p>When you finish counting, the <b>last number</b> you said tells how many there are. You do not need to count again.</p>',
        watch: { mount: function (el) { return K.objects(el, { kind: 'star', n: 9, tap: false }); }, steps: [
          { say: 'Count the stars.', act: function (t) { return t.countAll(420); }, ms: 500 },
          { say: 'The last number is 9. So there are <b>9</b> stars.', ms: 1400 },
          { say: 'Now mix them up. Are there still 9?', act: function (t) { return t.mix(true); }, ms: 900 },
          { say: 'Count again: still 9. Moving things does not change how many.', act: function (t) { return t.countAll(380); }, ms: 1600 }
        ] },
        try: { tool: 'g1objects', opts: { kind: 'ball', n: 8, controls: ['mix'], min: 1, max: 20 }, tasks: [
          { do: 'Tap each ball to count it.', goal: function (s) { return s.allCounted; }, yes: function (s) { return 'The last number is ' + s.n + '. There are ' + s.n + ' balls.'; } },
          { do: 'Press <b>Mix them up</b>, then count again. Is it the same number?', goal: function (s) { return s.mixed && s.allCounted; }, yes: 'Yes. Still the same. Moving the balls does not change how many.' },
          { do: 'Use <b>+ 1</b> to make <b>12</b> balls. Then count them.', reset: false, setup: function (t) { t.mix(false); }, goal: function (s) { return s.n === 12 && s.allCounted; }, yes: 'Yes. 12 balls.' }
        ] },
        ways: [
          { label: 'Line them up', html: '<p>Things in a line are easier to count. Count left to right, and the last number is how many.</p><div class="fig">' + counted('flower', 6, 6) + '</div>' },
          { label: 'Make groups of 5', html: '<p>Put 5 in a group. A full group is 5, then count on: 6, 7, 8.</p><div class="fig">' + A.draw.frames(8, { c: 26 }) + '</div>' }
        ],
        hard: true,
        key: '<p>The <b>last number</b> you say tells <b>how many</b>.</p>',
        mistake: '<p>After counting, the child counts again from 1 when asked "how many?". Ask: "What was the last number you said?"</p>',
        check: [P('c-count', 1), P('c-count', 2)] },
      { id: 'names', title: 'Numbers that are names', exp: ['B1.1'], skill: 'c-count',
        body: '<p>Most numbers tell <b>how many</b>. Some numbers are a <b>name</b>. Bus 5 does not have 5 of anything. The 5 tells you which bus it is.</p>',
        watch: { mount: function (el) { return K.stage(el); }, steps: [
          { say: 'This cake has 6 candles. The 6 tells <b>how many</b>.', act: function (t) { return t.show(cake(6)); }, ms: 1600 },
          { say: 'This is bus 5. The 5 is its <b>name</b>. There are not 5 buses.', act: function (t) { return t.show(bus(5)); }, ms: 1600 },
          { say: 'Number 23 on a hockey shirt is a <b>name</b> too.', act: function (t) { return t.show(shirt(23)); }, ms: 1600 },
          { say: 'House 14 is the <b>name</b> of a house on the street.', act: function (t) { return t.show(door(14)); }, ms: 1600 }
        ] },
        try: { tool: 'g1pick', opts: { cols: 2, items: [
          { id: 'cake', html: cake(4) + '<span>4 candles</span>' }, { id: 'bus', html: bus(12) + '<span>bus 12</span>' },
          { id: 'apples', html: A.draw.row('apple', 3, { s: 30 }) + '<span>3 apples</span>' }, { id: 'shirt', html: shirt(7) + '<span>shirt 7</span>' }] }, tasks: [
          { do: 'Tap the <b>two</b> pictures where the number tells <b>how many</b>.', goal: function (s) { return s.n === 2 && s.picked.indexOf('cake') >= 0 && s.picked.indexOf('apples') >= 0; }, yes: 'Yes. You can count 4 candles and 3 apples. Bus 12 and shirt 7 are names.' }
        ] },
        key: '<p>Ask: "Can I count it?" If yes, the number tells <b>how many</b>. If not, it is a <b>name</b>.</p>',
        check: [function () { var n = R.int(3, 9); return mc('Which one tells <b>how many</b>?', n + ' candles on a cake', ['Bus number ' + n, 'Jersey number ' + n], { wide: true, hint: 'Which one has things you could count?', explain: 'You can count ' + n + ' candles. The bus and jersey numbers are names.' }); }] }
    ] },

    { id: 'frames', title: 'Ten frames', sub: '5 in a row, 10 in a frame.', concepts: [
      { id: 'five', title: 'Five and some more', exp: ['B1.1'], skill: 'c-frames',
        body: '<p>A <b>ten frame</b> has 10 boxes in 2 rows of 5. We fill the top row first. A full row is <b>5</b>.</p>',
        watch: { tool: 'tenframe', opts: {}, steps: [
          { say: 'An empty ten frame. 2 rows, 5 boxes in each.', ms: 1200 },
          { say: 'Fill the top row: 1, 2, 3, 4, 5. A full row is <b>5</b>.', act: function (t) { return t.fill(5, 450); }, ms: 700 },
          { say: 'Put 3 more on the bottom row. Count on from 5: 6, 7, 8.', act: function (t) { return t.fill(8, 500); }, ms: 700 },
          { say: 'The frame shows <b>8</b>. That is 5 and 3 more.', ms: 1800 }
        ] },
        try: { tool: 'tenframe', opts: {}, tasks: [
          { do: 'Tap boxes to show <b>5</b>.', goal: function (s) { return s.n === 5; }, yes: 'Yes. A full row is 5.' },
          { do: 'Now show <b>7</b>. Start with a full row of 5.', reset: false, goal: function (s) { return s.n === 7; }, yes: '7 is 5 and 2 more.' },
          { do: 'Show <b>10</b>. The whole frame is full.', reset: false, goal: function (s) { return s.full; }, yes: 'A full frame is 10.' }
        ] },
        key: '<p>A full row is <b>5</b>. A full frame is <b>10</b>.</p>',
        check: [P('c-frames', 1), P('c-frames', 1)] },
      { id: 'empty', title: 'Count the empty boxes', exp: ['B1.1', 'B1.2'], skill: 'c-frames',
        body: '<p>The empty boxes help too. If 2 boxes are empty, the frame shows 2 less than 10. That is <b>8</b>.</p>',
        watch: { tool: 'tenframe', opts: { n: 9 }, steps: [
          { say: 'How many counters? Look at the empty boxes.', ms: 1400 },
          { say: 'Only 1 box is empty. 10 and 1 less is <b>9</b>.', ms: 1800 },
          { say: 'So 9 and 1 more make 10.', act: function (t) { return t.fill(10); }, ms: 1600 }
        ] },
        try: { tool: 'tenframe', opts: { n: 6 }, tasks: [
          { do: 'The frame shows 6. How many more make <b>10</b>? Fill the empty boxes to find out.', reset: false, goal: function (s) { return s.full; }, yes: 'You added 4. 6 and 4 make 10.' }
        ] },
        key: '<p>Empty boxes tell <b>how many more</b> make 10.</p>',
        check: [function () { var n = R.int(5, 9); return { q: 'How many <b>more</b> counters make 10?', type: 'num', answer: 10 - n, fig: A.draw.frames(n, { c: 26 }), hint: 'Count the empty boxes.', explain: n + ' and ' + (10 - n) + ' more make 10.' }; }, P('c-frames', 1)] },
      { id: 'teens', title: 'Ten and some more', exp: ['B1.1', 'B1.2'], skill: 'c-frames',
        body: '<p>When one frame is full, start a second frame. A full frame is <b>10</b>, so count on from 10: 11, 12, 13.</p>',
        watch: { tool: 'tenframe', opts: { frames: 2 }, steps: [
          { say: 'Fill the first frame: that is <b>10</b>.', act: function (t) { return t.fill(10, 200); }, ms: 600 },
          { say: 'Now 4 more in the second frame. Count on: 11, 12, 13, 14.', act: function (t) { return t.fill(14, 550); }, ms: 600 },
          { say: 'The frames show <b>14</b>: ten and 4 more. We say "fourteen".', ms: 1800 }
        ] },
        try: { tool: 'tenframe', opts: { frames: 2 }, tasks: [
          { do: 'Show <b>12</b> with the two frames.', goal: function (s) { return s.n === 12; }, yes: '12 is 10 and 2 more.' },
          { do: 'Show <b>17</b>.', reset: false, goal: function (s) { return s.n === 17; }, yes: '17 is 10 and 7 more.' },
          { do: 'Show <b>20</b>.', reset: false, goal: function (s) { return s.full; }, yes: 'Two full frames are 20.' }
        ] },
        key: '<p>A full frame is <b>10</b>. Count on from 10.</p>',
        check: [P('c-frames', 2), P('c-frames', 2)] },
      { id: 'teen-forty', title: 'Fourteen is not forty', exp: ['B1.1'], skill: 'c-words', hard: true,
        body: '<p><b>Fourteen</b> and <b>forty</b> sound alike. Fourteen is 14: <b>one ten</b> and 4 more. Forty is 40: <b>four tens</b>.</p>' +
          '<div class="vrow"><figure>' + A.draw.frames(14, { c: 14, r: 2 }) + '<figcaption>fourteen: 14</figcaption></figure><figure>' + A.draw.frames(40, { c: 14, r: 2 }) + '<figcaption>forty: 40</figcaption></figure></div>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'] }, steps: [
          { say: '<b>Fourteen</b>: 1 ten and 4 ones.', act: function (t) { return t.set(0, 1, 4); }, ms: 1600 },
          { say: 'Count it: 10, 11, 12, 13, 14.', act: function (t) { return t.countAll(420); }, ms: 900 },
          { say: '<b>Forty</b>: 4 tens and no ones.', act: function (t) { t.clearLit(); return t.set(0, 4, 0); }, ms: 1400 },
          { say: 'Count by tens: 10, 20, 30, 40. Forty is much more than fourteen.', act: function (t) { return t.countAll(500); }, ms: 1800 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true }, tasks: [
          { do: 'Build <b>fourteen</b>.', goal: function (s) { return s.value === 14 && s.o < 10; }, yes: 'Fourteen is 1 ten and 4 ones: 14.' },
          { do: 'Now build <b>forty</b>.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 40 && s.o === 0; }, yes: 'Forty is 4 tens: 40.' }
        ] },
        ways: [
          { label: 'Listen to the end', html: '<p>Words that end in <b>"teen"</b> are <b>10 and some more</b>: thirteen, fourteen, fifteen.</p><p>Words that end in <b>"ty"</b> are <b>tens</b>: twenty, thirty, forty, fifty.</p>' },
          { label: 'Look at the digits', html: '<p>In <span class="math big">14</span> the <b>1</b> comes first. That is 1 ten.</p><p>In <span class="math big">40</span> the <b>4</b> comes first. That is 4 tens.</p>' }
        ],
        key: '<p><b>"Teen"</b> means ten and some more. <b>"Ty"</b> means tens.</p>',
        mistake: '<p>Writing 41 or 40 for "fourteen" because the word starts with "four". Have the child build both numbers with blocks and compare.</p>',
        check: [P('c-words', 2), P('c-words', 2)] }
    ] },

    { id: 'to-50', title: 'Counting to 50', sub: 'One more, one less, and counting on.', concepts: [
      { id: 'more-less', title: 'One more, one less', exp: ['B1.1'], skill: 'c-next',
        body: '<p>On a number line, a jump to the <b>right</b> is one more. A jump to the <b>left</b> is one less.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 20, every: 5, start: 12 }, steps: [
          { say: 'The dot is on 12.', ms: 1200 },
          { say: 'Jump one to the right: <b>13</b>. One more than 12 is 13.', act: function (t) { return t.hop(13, '+1'); }, ms: 1200 },
          { say: 'Back to 12, and jump one to the left: <b>11</b>.', act: function (t) { t.clearHops(); return t.moveTo(12).then(function () { return t.hop(11, '−1'); }); }, ms: 1200 },
          { say: 'One less than 12 is 11.', ms: 1600 }
        ] },
        try: { tool: 'numberline', opts: { min: 0, max: 20, every: 5, start: 6, step: 1 }, tasks: [
          { do: 'Move the dot to <b>one more than 9</b>. Tap or drag along the line.', goal: function (s) { return s.at === 10; }, yes: 'One more than 9 is 10.' },
          { do: 'Move the dot to <b>one less than 15</b>.', reset: false, goal: function (s) { return s.at === 14; }, yes: 'One less than 15 is 14.' }
        ] },
        key: '<p><b>One more</b>: the next number. <b>One less</b>: the number before.</p>',
        check: [P('c-next', 1), P('c-next', 1)] },
      { id: 'new-ten', title: 'After 29 comes 30', exp: ['B1.1'], skill: 'c-next', hard: true,
        body: '<p>When the ones get to <b>9</b>, the next number starts a new ten: 28, 29, <b>30</b>. Each row of the chart ends with a ten.</p>',
        watch: { tool: 'hundred', opts: { to: 50 }, steps: [
          { say: 'Count along the chart: 21, 22, 23 ...', act: function (t) { return t.skip(1, 21, 29, 260); }, ms: 500 },
          { say: 'After 29 the row ends with <b>30</b>. Not "twenty-ten".', act: function (t) { return t.skip(1, 30, 30); }, ms: 1400 },
          { say: 'Then a new row starts: 31, 32, 33.', act: function (t) { return t.skip(1, 31, 33, 400); }, ms: 1600 }
        ] },
        try: { tool: 'hundred', opts: { to: 50 }, tasks: [
          { do: 'Tap the number that comes <b>after 39</b>.', goal: function (s) { return s.lit.indexOf(40) >= 0; }, yes: 'After 39 comes 40.' },
          { do: 'Tap the number that comes <b>before 21</b>.', goal: function (s) { return s.lit.indexOf(20) >= 0; }, yes: 'Before 21 comes 20.' }
        ] },
        ways: [
          { label: 'With blocks', html: '<p>29 is 2 tens and 9 ones. Add 1 more one: now there are 10 ones. They make a new ten. 3 tens is <b>30</b>.</p>', tool: 'base10', opts: { cols: ['t', 'o'], t: 2, o: 9, controls: true } },
          { label: 'Say the tens', html: '<p>Say the row-ends out loud: ten, twenty, thirty, forty, fifty. After every "nine" comes the next one of these.</p>' }
        ],
        key: '<p>After a <b>9</b> comes a new ten: 19, <b>20</b>. 39, <b>40</b>.</p>',
        mistake: '<p>Saying "twenty-ten" after 29, or jumping from 29 to 40. Count the row-ends together: 10, 20, 30, 40, 50.</p>',
        check: [P('c-next', 2), P('c-next', 2)] },
      { id: 'count-on', title: 'Count on from a number', exp: ['B1.5'], skill: 'c-next',
        body: '<p>You do not have to start at 1. Say the start number <b>in your head</b>, then count on.</p>',
        watch: { tool: 'numberline', opts: { min: 5, max: 20, every: 5, start: 8 }, steps: [
          { say: 'Start at 8. Say "eight" in your head.', ms: 1400 },
          { say: 'Count on 3: 9 ...', act: function (t) { return t.hop(9, '1'); }, ms: 400 },
          { say: 'Count on 3: 9, 10 ...', act: function (t) { return t.hop(10, '2'); }, ms: 400 },
          { say: 'Count on 3: 9, 10, 11.', act: function (t) { return t.hop(11, '3'); }, ms: 800 },
          { say: 'We land on <b>11</b>.', ms: 1600 }
        ] },
        try: { tool: 'numberline', opts: { min: 10, max: 30, every: 5, start: 14, step: 1 }, tasks: [
          { do: 'Start at 14. Use the jump button to count on <b>4</b>.', goal: function (s) { return s.at === 18 && s.hops >= 4; }, yes: '14 ... 15, 16, 17, 18. You land on 18.' }
        ] },
        key: '<p>Say the start number <b>in your head</b>. Count on from there.</p>',
        check: [P('c-next', 3), P('c-next', 3)] },
      { id: 'words', title: 'Number words to 50', exp: ['B1.1'], skill: 'c-words',
        body: '<p>Big number words have two parts. <b>Thirty-six</b> is "thirty" (3 tens) and "six" (6 ones): <b>36</b>.</p>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'] }, steps: [
          { say: '"Thirty" is 3 tens.', act: function (t) { return t.add('t', 3, 400); }, ms: 900 },
          { say: '"Six" is 6 ones.', act: function (t) { return t.add('o', 6, 260); }, ms: 900 },
          { say: 'Thirty-six: we write <b>36</b>. The tens digit comes first.', ms: 1800 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true }, tasks: [
          { do: 'Build <b>twenty-three</b>.', goal: function (s) { return s.value === 23 && s.o < 10; }, yes: 'Twenty-three is 23.' },
          { do: 'Build <b>forty-one</b>.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 41 && s.o < 10; }, yes: 'Forty-one is 41.' }
        ] },
        key: '<p>The first word tells the <b>tens</b>. The second word tells the <b>ones</b>.</p>',
        check: [P('c-words', 1), P('c-words', 3)] }
    ] },

    { id: 'skip', title: 'Skip counting', sub: 'Count by 10s, 5s and 2s.', concepts: [
      { id: 'tens', title: 'Count by 10s', exp: ['B1.5'], skill: 'c-skip',
        body: '<p>When things come in tens, count by 10s: <b>10, 20, 30, 40, 50</b>. It is much faster than counting by 1s.</p>',
        watch: { tool: 'counters', opts: { n: 30, arrange: 'tens' }, steps: [
          { say: 'Here are some counters in rows of 10.', ms: 1200 },
          { say: 'Count by 10s, one row at a time: 10, 20, 30.', act: function (t) { return t.countAll(80); }, ms: 900 },
          { say: 'There are <b>30</b> counters.', ms: 1600 }
        ] },
        try: { tool: 'hundred', opts: { to: 50 }, tasks: [
          { do: 'Count by 10s on the chart. Tap <b>10, 20, 30, 40, 50</b>.', goal: function (s) { return [10, 20, 30, 40, 50].every(function (v) { return s.lit.indexOf(v) >= 0; }); }, yes: 'They are all at the end of a row. Counting by 10s: 10, 20, 30, 40, 50.' }
        ] },
        key: '<p>By 10s: <b>10, 20, 30, 40, 50</b>.</p>',
        check: [P('c-skip', 1), P('c-skip', 1)] },
      { id: 'fives', title: 'Count by 5s', exp: ['B1.5'], skill: 'c-skip',
        body: '<p>A hand has 5 fingers. Count hands by 5s: <b>5, 10, 15, 20</b>.</p><div class="fig">' + groupsPic(5, 4) + '</div>',
        watch: { tool: 'hundred', opts: { to: 50 }, steps: [
          { say: 'Count by 5s on the chart.', act: function (t) { return t.skip(5, 5, 50, 520); }, ms: 600 },
          { say: 'Look: the numbers end in <b>5</b> or <b>0</b>, and make two straight columns.', ms: 2000 }
        ] },
        try: { tool: 'hundred', opts: { to: 50 }, tasks: [
          { do: 'Count by 5s. Tap <b>5, 10, 15, 20, 25, 30</b>.', goal: function (s) { return [5, 10, 15, 20, 25, 30].every(function (v) { return s.lit.indexOf(v) >= 0; }); }, yes: '5, 10, 15, 20, 25, 30. Every number ends in 5 or 0.' }
        ] },
        key: '<p>By 5s: <b>5, 10, 15, 20, 25</b>. The numbers end in 5 or 0.</p>',
        check: [P('c-skip', 2), P('c-skip', 2)] },
      { id: 'twos', title: 'Count by 2s', exp: ['B1.5'], skill: 'c-skip',
        body: '<p>Socks come in pairs. Count pairs by 2s: <b>2, 4, 6, 8, 10</b>.</p>',
        watch: { tool: 'counters', opts: { n: 10, arrange: 'pairs' }, steps: [
          { say: 'Here are counters in pairs.', ms: 1200 },
          { say: 'Count by 2s, one pair at a time: 2, 4, 6, 8, 10.', act: function (t) { return t.countAll(300); }, ms: 900 },
          { say: 'There are <b>10</b>. Same answer as counting by 1s, just faster.', ms: 1800 }
        ] },
        try: { tool: 'counters', opts: { n: 6, arrange: 'pairs', controls: ['pairs'], max: 20 }, tasks: [
          { do: 'Make <b>8</b> counters (4 pairs). Use + 1, then press Pair them up.', goal: function (s) { return s.n === 8 && s.mode === 'pairs'; }, yes: '4 pairs: 2, 4, 6, 8.' },
          { do: 'Make <b>12</b> counters in pairs.', reset: false, goal: function (s) { return s.n === 12 && s.mode === 'pairs'; }, yes: '6 pairs: 2, 4, 6, 8, 10, 12.' }
        ] },
        key: '<p>By 2s: <b>2, 4, 6, 8, 10</b>.</p>',
        mistake: '<p>Skip counting the words but pointing at single objects (2, 4, 6 for three socks). Point to a whole pair for each number.</p>',
        check: [P('c-skip', 3), P('c-skip', 3)] }
    ] },

    { id: 'estimate', title: 'Estimate', sub: 'A smart guess, then count to check.', concepts: [
      { id: 'group-ten', title: 'Picture a group of 10', exp: ['B1.4'], skill: 'c-est',
        body: '<p>An <b>estimate</b> is a smart guess about how many. Picture what <b>10</b> looks like. Then ask, "How many groups of 10 could I make?"</p>',
        watch: { tool: 'counters', opts: { n: 23, arrange: 'scatter', seed: 5 }, steps: [
          { say: 'About how many counters? Do not count them all.', ms: 1600 },
          { say: 'I picture a group of 10. I think about 2 groups fit. My estimate: <b>about 20</b>.', ms: 2200 },
          { say: 'Now check. Put them in rows of 10.', act: function (t) { return t.arrange('tens'); }, ms: 1000 },
          { say: '2 tens and 3 more: <b>23</b>. My estimate was close.', ms: 2000 }
        ] },
        try: { tool: 'counters', opts: { n: 34, arrange: 'scatter', seed: 9, controls: ['tens'] }, tasks: [
          { do: 'Make an estimate in your head. Then press <b>Group in tens</b> to check.', goal: function (s) { return s.mode === 'tens'; }, yes: '3 tens and 4 more: 34. Was your estimate close to 30?' }
        ] },
        key: '<p>An estimate does not have to be exact. A <b>close</b> estimate is a good estimate.</p>',
        check: [P('c-est', 1), P('c-est', 2)] },
      { id: 'check', title: 'Estimate, then count', exp: ['B1.4'], skill: 'c-est',
        body: '<p>First estimate. Then count to check. Each time you check, your next estimate gets better.</p>',
        watch: { mount: function (el) { return K.stage(el); }, steps: [
          { say: 'How many leaves? My estimate: about 20.', act: function (t) { return t.show(A.draw.scatter(22, 4242, { kind: 'leaf', w: 340, h: 180, label: '22 leaves spread out' })); }, ms: 2000 },
          { say: 'Count to check: put them in ten frames.', act: function (t) { return t.show(A.draw.frames(22, { c: 22, label: '22 leaves in ten frames' })); }, ms: 1400 },
          { say: '10, 20, then 21, 22. There are <b>22</b>. My estimate was close.', ms: 2000 }
        ] },
        try: { do: 'Move the slider to your estimate. Then press <b>Count to check</b>.', mount: function (el, done) {
          var n = R.int(12, 38), k = R.pick(['apple', 'flower', 'star']);
          el.innerHTML = '<div class="g1-frame">' + A.draw.scatter(n, R.int(1, 9999), { kind: k, w: 340, h: 200, r: n > 30 ? 9 : 11, label: 'A group of ' + A.NAMES[k][1] + ' to estimate' }) + '</div>' +
            '<div class="ctrl"><label>My estimate: <output>20</output><input type="range" min="0" max="50" step="5" value="20"></label></div><div class="btnrow"><button type="button" class="btn">Count to check</button></div><div class="mp-read" aria-live="polite"></div>';
          var rg = A.$('input', el), out = A.$('output', el);
          rg.addEventListener('input', function () { out.textContent = rg.value; });
          A.$('.btn', el).addEventListener('click', function () {
            var g = +rg.value, d = Math.abs(g - n);
            A.$('.g1-frame', el).innerHTML = A.draw.frames(n, { c: 20, label: n + ' ' + A.NAMES[k][1] + ' put in ten frames' });
            Manip.bump(A.$('.g1-frame', el), 'mp-fade');
            A.$('.mp-read', el).innerHTML = '<p>There are <span class="mp-num">' + n + '</span>. Your estimate was ' + g + (d <= 5 ? ': very close.' : d <= 10 ? ': fairly close.' : '. Next time, picture groups of 10.') + '</p>';
            done('Good. Checking makes your next estimate better.');
          });
        } },
        key: '<p><b>Estimate</b> first, then <b>count</b> to check.</p>',
        check: [P('c-est', 2), P('c-est', 3)] }
    ] }
  ];

  A.register('counting', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Numbers tell how many</h2>' +
'<p>We use numbers every day. Most of the time a number tells <b>how many</b>.</p>' +
'<div class="vrow"><figure>' + cake(6) + '<figcaption>6 candles: how many</figcaption></figure><figure>' + A.draw.row('apple', 3, { s: 34 }) + '<figcaption>3 apples: how many</figcaption></figure>' +
'<figure>' + bus(5) + '<figcaption>Bus 5: a name</figcaption></figure><figure>' + shirt(23) + '<figcaption>Number 23: a name</figcaption></figure></div>' +
'<p>Some numbers are a <b>name</b>. Bus 5 does not have 5 of anything. The number just tells you which bus it is.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>I count the apples. I touch each apple <b>once</b> and say one number.</p>' +
'<div class="fig">' + counted('apple', 7, 7) + '</div><p>The last number I say is <b>7</b>. So there are 7 apples.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>How many stars?</p><div class="fig">' + A.draw.row('star', 5, { s: 34 }) + '</div><ol>' +
'<li>Put your finger on the first star. Say "1".</li><li>Move to the next star. Say "2". Keep going: 3, 4, 5.</li><li>You said 5 last. There are <b>5 stars</b>.</li></ol></div>' +
'<div class="key"><b class="t">Key idea</b><p>Touch each thing once. The <b>last number</b> you say tells how many.</p></div>' +
'<div class="lab"><span class="lt">Try it: count with me</span>' + A.stepHtml('cn1', 'How many apples?', 4) +
'<div class="fig" id="cnfig"></div><div class="out" id="cnout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Ten frames</h2>' +
'<p>A <b>ten frame</b> has 10 boxes: 2 rows of 5. We fill the top row first.</p>' +
'<div class="vrow"><figure>' + A.draw.frames(5, { c: 26 }) + '<figcaption>A full row is 5</figcaption></figure><figure>' + A.draw.frames(10, { c: 26 }) + '<figcaption>A full frame is 10</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + A.draw.frames(8, { c: 30 }) + '</div><p>The top row is full. That is 5. There are 3 more on the bottom. I count on: 6, 7, 8. The frame shows <b>8</b>.</p><p>I can also see 2 empty boxes. 10 take away 2 is 8.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><div class="fig">' + A.draw.frames(14, { c: 26 }) + '</div><ol>' +
'<li>One frame is full. A full frame is <b>10</b>.</li><li>Count on the others: 11, 12, 13, 14.</li><li>The frames show <b>14</b>. We say "fourteen".</li></ol></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p><b>Fourteen</b> and <b>forty</b> sound alike. Fourteen is 14: one ten and 4 more. Forty is 40: four full tens.</p>' +
'<div class="vrow"><figure>' + A.draw.frames(14, { c: 14, r: 2 }) + '<figcaption>fourteen: 14</figcaption></figure><figure>' + A.draw.frames(40, { c: 14, r: 2 }) + '<figcaption>forty: 40</figcaption></figure></div></div>' +
'<div class="lab"><span class="lt">Try it: build a number</span>' + A.stepHtml('tf1', 'Counters', 8) +
'<div class="ctrl"><label for="tfr">Or slide (0 to 50)<input type="range" id="tfr" min="0" max="50" value="8"></label></div>' +
'<div class="fig" id="tffig"></div><div class="out" id="tfout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Counting to 50</h2>' +
'<p>The <b>number chart</b> shows the numbers in order. Each row ends with a ten: 10, 20, 30, 40, 50.</p>' +
'<div class="fig">' + A.chart({ cls: { 10: 'b', 20: 'b', 30: 'b', 40: 'b', 50: 'b' }, label: 'Number chart from 1 to 50. The last number in each row is 10, 20, 30, 40, 50.' }) + '</div>' +
'<p>Going <b>right</b> is one more. Going <b>left</b> is one less.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>I <b>count on</b> from 8. I say 8 in my head, then count 3 more: 9, 10, 11. I land on <b>11</b>.</p><div class="fig">' + A.draw.nl(5, 15, { mark: 8, hops: [[8, 9], [9, 10], [10, 11]] }) + '</div></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>What comes after 29?</p><ol><li>Find 29 on the chart. It is near the end of a row.</li><li>Go one more to the right. The row ends at 30.</li><li>After 29 comes <b>30</b>.</li></ol></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>After 29 comes 30, not "twenty-ten". When the ones get to 9, the next number starts a new ten.</p></div>' +
'<div class="lab"><span class="lt">Try it: one more, one less</span>' + A.stepHtml('ch1', 'Pick a number', 23) +
'<div class="fig" id="chfig"></div><div class="out" id="chout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Skip counting by 2s, 5s and 10s</h2>' +
'<p><b>Skip counting</b> is a fast way to count big groups. You say only some of the numbers.</p>' +
'<div class="vrow"><figure>' + groupsPic(2, 3) + '<figcaption>By 2s: 2, 4, 6</figcaption></figure><figure>' + groupsPic(5, 3) + '<figcaption>By 5s: 5, 10, 15</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><p>Each full ten frame is 10. I count by 10s: 10, 20, 30. That is <b>30</b> counters.</p><div class="fig">' + groupsPic(10, 3) + '</div></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>How many fingers on 4 hands?</p><div class="fig">' + groupsPic(5, 4).replace(/<text[^>]*>\d+<\/text>/g, '') + '</div><ol>' +
'<li>Each hand has 5 fingers. We count by 5s.</li><li>Point to each hand: 5, 10, 15, 20.</li><li>There are <b>20</b> fingers.</li></ol></div>' +
'<div class="key"><b class="t">Key idea</b><p>Skip counting gives the same answer as counting by 1s. It is just faster.</p></div>' +
'<div class="lab"><span class="lt">Try it: skip count on the chart</span>' +
'<div class="btnrow" role="group" aria-label="Count by"><button type="button" class="btn alt" data-by="2" aria-pressed="false">By 2s</button><button type="button" class="btn alt" data-by="5" aria-pressed="true">By 5s</button><button type="button" class="btn alt" data-by="10" aria-pressed="false">By 10s</button></div>' +
'<div class="btnrow"><button type="button" class="btn" id="skn">Next jump</button><button type="button" class="btn alt" id="skr">Start again</button></div>' +
'<div class="fig" id="skfig"></div><div class="out" id="skout" aria-live="polite"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Estimate, then count</h2>' +
'<p>An <b>estimate</b> is a smart guess about how many. You do not count every one.</p>' +
'<p>A good trick: picture a group of 10. Then think, "How many groups of 10 could I make?"</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + A.draw.scatter(22, 4242, { kind: 'leaf', w: 340, h: 180, label: '22 leaves spread out' }) + '</div><p>About 10 leaves fill the left half. The right half looks about the same. My estimate is <b>about 20</b>.</p><p>Now I count to check: there are 22. My estimate was close.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>An estimate does not have to be exact. A close estimate is a good estimate.</p></div>' +
'<div class="lab"><span class="lt">Try it: estimate, then check</span><p class="noread" style="margin-top:0">Look at the picture. Pick your estimate. Then press <b>Count to check</b>.</p>' +
'<div class="fig" id="esfig"></div>' +
'<div class="ctrl"><label for="esr">My estimate: <output id="eso">20</output><input type="range" id="esr" min="0" max="50" step="5" value="20"></label></div>' +
'<div class="btnrow"><button type="button" class="btn" id="esc">Count to check</button><button type="button" class="btn alt" id="esn">New picture</button></div>' +
'<div class="out" id="esout" aria-live="polite"></div></div>' +
'<div class="yt"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      /* 1: count with me */
      A.stepper(root, 'cn1', 1, 20, function (n) {
        $('#cnfig', root).innerHTML = counted('apple', n, n);
        $('#cnout', root).innerHTML = 'Touch and count: ' + (n <= 12 ? skipList(1, 1, n).join(', ') : '1, 2, 3 ... ' + n) + '. There are <span class="big">' + n + '</span> apples. We write <b>' + n + '</b> and say "' + W(n) + '".';
      });
      /* 2: ten frames */
      var tfr = $('#tfr', root);
      var tf = A.stepper(root, 'tf1', 0, 50, function (n) {
        tfr.value = n;
        var t = Math.floor(n / 10), o = n % 10;
        $('#tffig', root).innerHTML = A.draw.frames(n, { c: 24, min: 10 });
        $('#tfout', root).innerHTML = '<span class="big">' + n + '</span> &nbsp;"' + W(n) + '"<br>' +
          (n < 10 ? (n >= 5 ? 'A full row of 5 and ' + (n - 5) + ' more.' : n + ' in the top row.') + ' ' + (10 - n) + ' empty to make 10.'
            : t + ' full frame' + (t > 1 ? 's' : '') + ' (' + skipList(10, 10, t).join(', ') + ')' + (o ? ' and ' + o + ' more' : '') + '.');
      });
      tfr.addEventListener('input', function () { tf.set(+tfr.value); });
      /* 3: one more, one less */
      A.stepper(root, 'ch1', 1, 50, function (n) {
        var c = {}; c[n] = 'c'; if (n > 1) c[n - 1] = 'b'; if (n < 50) c[n + 1] = 'b';
        $('#chfig', root).innerHTML = A.chart({ cls: c, label: 'Number chart with ' + n + ' marked' });
        $('#chout', root).innerHTML = (n > 1 ? 'One less than ' + n + ' is <b>' + (n - 1) + '</b>. ' : '') + (n < 50 ? 'One more than ' + n + ' is <b>' + (n + 1) + '</b>.' : '50 is the last number on this chart.');
      });
      /* 4: skip counting */
      var by = 5, at = 0;
      function sk() {
        var c = {};
        for (var v = by; v <= at; v += by) c[v] = 'a';
        var seq = skipList(by, by, at / by);
        $('#skfig', root).innerHTML = A.chart({ cls: c, label: 'Number chart with counting by ' + by + 's marked up to ' + at });
        $('#skout', root).innerHTML = at ? 'Counting by ' + by + 's: <b>' + seq.join(', ') + '</b>' + (at + by > 50 ? '. That is as far as 50 goes.' : '') : 'Press <b>Next jump</b> to count by ' + by + 's.';
        $('#skn', root).disabled = at + by > 50;
      }
      A.$$('[data-by]', root).forEach(function (b) {
        b.addEventListener('click', function () {
          by = +b.getAttribute('data-by'); at = 0;
          A.$$('[data-by]', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); x.classList.toggle('alt', x !== b); });
          sk();
        });
      });
      A.$$('[data-by]', root).forEach(function (x) { x.classList.toggle('alt', x.getAttribute('data-by') !== '5'); });
      $('#skn', root).addEventListener('click', function () { if (at + by <= 50) { at += by; sk(); } });
      $('#skr', root).addEventListener('click', function () { at = 0; sk(); });
      sk();
      /* 5: estimate */
      var en = 0, es = 0, kind = 'flower', checked = false;
      function newPic() {
        en = R.int(8, 48); es = R.int(1, 99999); kind = R.pick(['apple', 'flower', 'star', 'leaf']); checked = false;
        $('#esfig', root).innerHTML = A.draw.scatter(en, es, { kind: kind, w: 340, h: 200, r: en > 30 ? 9 : 11, label: 'A group of ' + A.NAMES[kind][1] + ' to estimate' });
        $('#esout', root).innerHTML = '';
      }
      var esr = $('#esr', root);
      esr.addEventListener('input', function () { $('#eso', root).textContent = esr.value; });
      $('#esc', root).addEventListener('click', function () {
        var g = +esr.value, d = Math.abs(g - en);
        $('#esfig', root).innerHTML = A.draw.frames(en, { c: 20, label: en + ' ' + A.NAMES[kind][1] + ' put in ten frames' });
        $('#esout', root).innerHTML = 'Put in ten frames, there are <span class="big">' + en + '</span>. Count by 10s, then on: ' + (Math.floor(en / 10) ? skipList(10, 10, Math.floor(en / 10)).join(', ') : '') + (en % 10 ? (Math.floor(en / 10) ? ', then ' : '') + skipList(1, Math.floor(en / 10) * 10 + 1, en % 10).join(', ') : '') + '.<br>' +
          'Your estimate was ' + g + '. ' + (d === 0 ? 'Exactly right.' : 'That is ' + d + ' away. ' + (d <= 5 ? 'A close estimate.' : d <= 10 ? 'Fairly close. Try picturing groups of 10.' : 'Next time, picture a group of 10 and see how many groups fit.'));
      });
      $('#esn', root).addEventListener('click', newPic);
      newPic();
    },

    checks: [
      [function () { return qCount(1); }, function () { return qCount(1); }, {
        q: 'Which one tells <b>how many</b>?', type: 'mc', options: ['Bus number 7', '7 candles on a cake', 'Jersey number 7'], answer: 1, wide: true,
        hint: 'Which one has 7 things you could count?', explain: 'You can count 7 candles. The bus and the jersey use 7 as a name.' }],
      [function () { return qFrame(1); }, function () { return qFrame(1); }, function () { return qFrame(2); }],
      [function () { return qNext(1); }, function () { return qNext(2); }, function () { return qNext(3); }],
      [function () { return qSkip(1); }, function () { return qSkip(2); }, function () { return qSkip(2); }],
      [function () { return qEst(1); }, function () { return qEst(1); }, function () { return qEst(2); }]
    ],

    quiz: [
      { q: 'How many fish?', type: 'num', answer: 9, fig: A.draw.row('fish', 9, { per: 10, group: 5, s: 32 }),
        hint: 'Touch each fish once. Count the first 5, then keep going.', explain: 'There are 9 fish. 5 in the first group and 4 more.' },
      { q: 'What number do the ten frames show?', type: 'mc', options: ['16', '61', '6', '15'], answer: 0, fig: A.draw.frames(16, { c: 24 }),
        hint: 'A full frame is 10. Count on from 10.', explain: 'One full frame is 10, and 6 more: 11, 12, 13, 14, 15, 16. That is 16.' },
      { q: 'Which number is <b>forty-three</b>?', type: 'mc', options: ['34', '43', '403', '13'], answer: 1,
        hint: 'Forty is 4 tens. Then three more.', explain: 'Forty is 40, and three more is 43.' },
      { q: 'What number comes just after <b>39</b>?', type: 'num', answer: 40,
        hint: 'After a 9, the next number starts a new ten.', explain: 'After 39 comes 40.' },
      { q: 'Count by 5s. What number is missing? <span class="math">15, 20, <b class="blank">?</b>, 30</span>', type: 'num', answer: 25,
        hint: 'Each number is 5 more than the one before. What is 20 and 5 more?', explain: '15, 20, 25, 30. 20 and 5 more is 25.' },
      { q: 'Count the socks by 2s. How many socks in all?', type: 'num', answer: 12, fig: groupsPic(2, 6).replace(/<text[^>]*>\d+<\/text>/g, ''),
        hint: 'Each pair is 2. Say 2, 4, 6... one number for each pair.', explain: '6 pairs: 2, 4, 6, 8, 10, 12. There are 12 socks.' },
      { q: 'About how many stars? Do not count them all.', type: 'mc', options: ['about 5', 'about 30', 'about 100'], answer: 1, fig: A.draw.scatter(31, 2024, { kind: 'star', w: 340, h: 200, r: 9, label: 'A group of stars spread out' }),
        hint: 'Picture a group of 10 stars. About how many groups of 10 are there?', explain: 'There are 31 stars, so "about 30" is the best estimate.' }
    ],

    practice: [
      { id: 'c-count', name: 'Count the objects', code: 'B1.1', gen: qCount },
      { id: 'c-frames', name: 'Read ten frames', code: 'B1.1', gen: qFrame },
      { id: 'c-words', name: 'Number words', code: 'B1.1', gen: qWords },
      { id: 'c-next', name: 'Before, after, count on', code: 'B1.5', gen: qNext },
      { id: 'c-skip', name: 'Skip count by 2s, 5s, 10s', code: 'B1.5', gen: qSkip },
      { id: 'c-est', name: 'Estimate how many', code: 'B1.4', gen: qEst }
    ]
  });

  /* ---------- More ways to ask (question shapes, see docs/QUESTIONS.md) ---------- */
  var nm = A.Q ? A.Q.name : function () { return 'Ava'; };
  function countRange(lv) { return lv === 1 ? R.int(3, 10) : lv === 2 ? R.int(11, 20) : R.int(21, 30); }
  function rowPic(kind, n, s) { return A.draw.row(kind, n, { per: 10, group: 5, s: s || 26 }); }
  function framePic(n, c) { return A.draw.frames(n, { c: c || 18, r: 2, min: 1 }); }
  function heap(n, kind, w, h) { return A.draw.scatter(n, R.int(1, 99999), { kind: kind, w: w || 220, h: h || 150, r: n > 30 ? 7 : n > 12 ? 8 : 10 }); }
  var SHAPES = {
    'c-count': [
      [1, 'tap', function (lv) {
        var kind = R.pick(KINDS), n = countRange(lv), set = R.shuffle(G1.near(n, 3, 2, 40));
        return { q: 'Tap the picture with <b>' + n + '</b> ' + A.NAMES[kind][1] + '.', type: 'tap', tiles: set.map(function (v) { return A.draw.row(kind, v, { per: 5, s: 24 }); }), answer: set.indexOf(n), answerText: 'the picture with ' + A.nm(kind, n),
          hint: 'Count each picture. Touch each one once.', steps: ['Count the first picture. Say one number for each one.', 'Keep going until you find ' + n + '.'],
          explain: 'That picture has ' + A.nm(kind, n) + '.', meta: { k: 'g1-count-tap', n: n } };
      }],
      [1, 'mistake', function (lv) {
        var kind = R.pick(KINDS), n = countRange(lv), who = nm(), truth = !R.int(0, 2), said = truth ? n : n + R.pick([1, -1]);
        var right = 'There are ' + n + '. Touch each one once, and the last number you say is how many.';
        return G1.tf(who + ' counted the ' + A.NAMES[kind][1] + ' and said <b>' + said + '</b>. True or false: ' + who + ' is right.', truth, right,
          ['Counting fast is fine, even if you skip one.', 'You can count the first one twice.', 'Only the top row counts.'], { k: 'g1-count-tf', n: n, said: said },
          { fig: rowPic(kind, n), hint: 'Count them yourself. Touch each one once.' });
      }],
      [2, 'line', function (lv) {
        var kind = R.pick(KINDS), n = countRange(lv), hi = lv === 3 ? 30 : 20;
        return { q: 'Count the ' + A.NAMES[kind][1] + '. Put the marker on that number.', type: 'line', min: 0, max: hi, tick: 1, every: 5, snap: 1, answer: n, fig: rowPic(kind, n),
          hint: 'Count first. Then find that number on the line.', steps: ['There are ' + n + '.', 'Find ' + n + ' on the number line.'],
          explain: 'There are ' + n + ', so the marker goes on ' + n + '.', meta: { k: 'g1-count-line' } };
      }]
    ],
    'c-frames': [
      [1, 'tap', function (lv) {
        var n = countRange(lv) - (lv === 1 ? 2 : 0), set = R.shuffle(G1.near(n, 3, 1, 40));
        return { q: 'Tap the ten frame that shows <b>' + n + '</b>.', type: 'tap', tiles: set.map(function (v) { return framePic(v, 16); }), answer: set.indexOf(n), answerText: 'the frames with ' + n,
          hint: n > 10 ? 'A full frame is 10. Count on from 10.' : 'A full row is 5. Count on from 5.', steps: ['Look at each picture.', 'Find the one that shows ' + n + '.'],
          explain: 'That frame shows ' + n + '.', meta: { k: 'g1-frames-tap', n: n } };
      }],
      [1, 'match', function (lv) {
        var lo = lv === 1 ? 1 : lv === 2 ? 11 : 21, hi = lv === 1 ? 10 : lv === 2 ? 20 : 40, vals = [];
        while (vals.length < 3) { var v = R.int(lo, hi); if (vals.indexOf(v) < 0) vals.push(v); }
        return { q: 'Match each ten frame to its number.', type: 'match', pairs: vals.map(function (v) { return [framePic(v, 14), String(v)]; }),
          hint: 'Count the full rows or frames first.', steps: ['A full row is 5. A full frame is 10.'],
          explain: 'The frames show ' + vals.join(', ') + '.', meta: { k: 'g1-frames-match' } };
      }],
      [2, 'fill', function (lv) {
        var n = lv === 2 ? R.int(11, 19) : R.int(21, 49), t = Math.floor(n / 10), o = n % 10;
        return { q: 'Fill in the blanks.', type: 'fill', fig: framePic(n, 18), fill: '[[]] full frames and [[]] more make [[]].', answers: [t, o, n],
          hint: 'A full frame is 10. Count the full frames, then the extra counters.', steps: ['There ' + (t === 1 ? 'is 1 full frame' : 'are ' + t + ' full frames') + ' and ' + o + ' more.', t * 10 + ' and ' + o + ' make ' + n + '.'],
          explain: t + ' full frames and ' + o + ' more make ' + n + '.', meta: { k: 'g1-frames-fill' } };
      }]
    ],
    'c-words': [
      [1, 'match', function (lv) {
        var lo = lv === 1 ? 0 : lv === 2 ? 11 : 20, hi = lv === 1 ? 10 : lv === 2 ? 19 : 50, vals = [];
        while (vals.length < 3) { var v = R.int(lo, hi); if (vals.indexOf(v) < 0) vals.push(v); }
        return { q: 'Match each word to its number.', type: 'match', pairs: vals.map(function (v) { return [W(v), String(v)]; }),
          hint: 'Say each word out loud. Which number sounds the same?', steps: ['"Teen" means ten and some more. "Ty" means tens.'],
          explain: vals.map(function (v) { return W(v) + ' is ' + v; }).join('. ') + '.', meta: { k: 'g1-words-match' } };
      }],
      [1, 'tap', function (lv) {
        var n = lv === 1 ? R.int(1, 10) : R.int(11, 19), set = R.shuffle(G1.near(n, 3, 1, 20));
        return { q: 'Tap the ten frame that shows <b>' + W(n) + '</b>.', type: 'tap', tiles: set.map(function (v) { return framePic(v, 16); }), answer: set.indexOf(n), answerText: 'the frame with ' + n,
          hint: W(n) + ' is ' + n + '. Find the frame with ' + n + '.', steps: [W(n) + ' is the number ' + n + '.', 'Count the counters in each frame.'],
          explain: W(n) + ' is ' + n + '.', meta: { k: 'g1-words-tap' } };
      }],
      [2, 'mistake', function (lv) {
        var n = R.int(13, 19), t = n % 10, who = nm(), truth = !R.int(0, 2), said = truth ? n : t * 10;
        var right = W(n) + ' is 10 and ' + t + ', so it is written ' + n + '.';
        return G1.tf(who + ' wrote <b>' + W(n) + '</b> as <span class="math">' + said + '</span>. True or false: ' + who + ' is right.', truth, right,
          ['The word starts with "' + W(t) + '", so the ' + t + ' goes first.', '"Teen" numbers are all tens.', 'Number words never sound like their numbers.'], { k: 'g1-words-tf', w: W(n), said: said },
          { hint: '"Teen" means ten and some more.' });
      }]
    ],
    'c-next': [
      [1, 'line', function (lv) {
        var n = lv === 1 ? R.int(2, 18) : R.int(20, 48), after = R.int(0, 1), lo = Math.max(0, n - 5), ans = after ? n + 1 : n - 1;
        return { q: 'Put the marker on the number just <b>' + (after ? 'after' : 'before') + '</b> ' + n + '.', type: 'line', min: lo, max: lo + 10, tick: 1, every: lv === 1 ? 1 : 5, snap: 1, answer: ans,
          hint: after ? 'After means one more. One jump to the right.' : 'Before means one less. One jump to the left.', steps: ['Find ' + n + '.', 'Move one step ' + (after ? 'right' : 'left') + ': ' + ans + '.'],
          explain: ans + ' comes just ' + (after ? 'after' : 'before') + ' ' + n + '.', meta: { k: 'g1-next-line', n: n, after: after } };
      }],
      [1, 'fill', function (lv) {
        var n = lv === 1 ? R.int(2, 19) : R.int(20, 49);
        return { q: 'Fill in the numbers just before and just after.', type: 'fill', fill: '<span class="math">[[]], <b>' + n + '</b>, [[]]</span>', answers: [n - 1, n + 1],
          hint: 'Before is one less. After is one more.', steps: ['One less than ' + n + ' is ' + (n - 1) + '.', 'One more than ' + n + ' is ' + (n + 1) + '.'],
          explain: (n - 1) + ', ' + n + ', ' + (n + 1) + '.', meta: { k: 'g1-next-fill', n: n } };
      }],
      [2, 'story', function (lv) {
        var who = nm(), c = R.pick([['stickers', 'gets'], ['marbles', 'finds'], ['shells', 'picks up'], ['pine cones', 'finds']]), st = R.int(lv === 2 ? 8 : 20, lv === 2 ? 19 : 45), k = R.int(1, 3);
        return { q: who + ' has ' + st + ' ' + c[0] + '. ' + who + ' ' + c[1] + ' ' + k + ' more. Count on. How many now?', type: 'num', answer: st + k,
          hint: 'Start at ' + st + '. Count on ' + k + '.', steps: ['Say ' + st + ' in your head.', 'Count on ' + k + ': ' + skipList(1, st + 1, k).join(', ') + '.'],
          explain: st + ' and ' + k + ' more is ' + (st + k) + '.', meta: { k: 'g1-next-story', st: st, add: k } };
      }]
    ],
    'c-skip': [
      [1, 'order', function (lv) {
        var by = lv === 1 ? 10 : lv === 2 ? 5 : R.pick([2, 5, 10]), len = 4, start = by * R.int(1, Math.floor(50 / by) - len + 1);
        return { q: 'Count by <b>' + by + 's</b>. Put the cards in order.', type: 'order', items: skipList(by, start, len).map(String),
          hint: 'Start with the smallest. Each card is ' + by + ' more.', steps: ['Find the smallest number: ' + start + '.', 'Then add ' + by + ' each time.'],
          explain: 'Counting by ' + by + 's: ' + skipList(by, start, len).join(', ') + '.', meta: { k: 'g1-skip-order', by: by } };
      }],
      [1, 'fill', function (lv) {
        var by = lv === 1 ? 10 : lv === 2 ? 5 : 2, len = 5, start = by === 10 ? 10 : by * R.int(1, Math.floor(50 / by) - len + 1), s = skipList(by, start, len);
        return { q: 'Count by <b>' + by + 's</b>. Fill in the missing numbers.', type: 'fill', fill: '<span class="math">' + s[0] + ', ' + s[1] + ', [[]], ' + s[3] + ', [[]]</span>', answers: [s[2], s[4]],
          hint: 'Each number is ' + by + ' more than the one before.', steps: [s[1] + ' and ' + by + ' more is ' + s[2] + '.', s[3] + ' and ' + by + ' more is ' + s[4] + '.'],
          explain: s.join(', ') + '.', meta: { k: 'g1-skip-fill', by: by } };
      }],
      [2, 'pick', function (lv) {
        var by = lv === 2 ? R.pick([5, 10]) : R.pick([2, 5]), opts = [], right = 0;
        while (opts.length < 5) {
          var v = R.int(2, 50), fits = v % by === 0;
          if (opts.indexOf(v) >= 0 || (fits && right >= 3) || (!fits && opts.length - right >= 3)) continue;
          opts.push(v); if (fits) right++;
        }
        var ans = []; opts.forEach(function (v, j) { if (v % by === 0) ans.push(j); });
        return { q: 'Pick every number you say when you count by <b>' + by + 's</b>.', type: 'pick', options: opts.map(String), answer: ans,
          hint: 'Say the ' + by + 's: ' + skipList(by, by, 5).join(', ') + '...', steps: ['Count by ' + by + 's out loud.', 'Pick each number you say.'],
          explain: 'Counting by ' + by + 's, you say ' + ans.map(function (j) { return opts[j]; }).sort(function (a, b) { return a - b; }).join(', ') + '.', meta: { k: 'g1-skip-pick', by: by, opts: opts } };
      }]
    ],
    'c-est': [
      [1, 'tap', function (lv) {
        var marks = lv === 1 ? [5, 20, 50] : [10, 25, 40], target = R.pick(marks), kind = R.pick(['apple', 'star', 'flower', 'leaf']);
        var counts = marks.map(function (m) { return Math.max(3, m + R.int(-2, 2)); }), order = R.shuffle([0, 1, 2]);
        return { q: 'Do not count every one. Tap the picture with <b>about ' + target + '</b>.', type: 'tap', tiles: order.map(function (i) { return heap(counts[i], kind); }), answer: order.indexOf(marks.indexOf(target)), answerText: 'the picture with about ' + target,
          hint: 'Picture what 10 looks like. Which group looks closest to ' + target + '?', steps: ['Find the smallest group and the biggest group.', target + ' is ' + (target === marks[0] ? 'the smallest' : target === marks[2] ? 'the biggest' : 'in the middle') + '.'],
          explain: 'That picture has ' + counts[marks.indexOf(target)] + ', which is about ' + target + '.', meta: { k: 'g1-est-tap', target: target, marks: marks } };
      }],
      [1, 'match', function (lv) {
        var marks = lv === 1 ? [5, 20, 50] : [10, 25, 40], kind = R.pick(['apple', 'star', 'flower', 'leaf']);
        return { q: 'Do not count every one. Match each picture to the best estimate.', type: 'match', pairs: marks.map(function (m) { return [heap(Math.max(3, m + R.int(-2, 2)), kind, 200, 120), 'about ' + m]; }),
          hint: 'The smallest group goes with the smallest number.', steps: ['Find the smallest group and the biggest group first.'],
          explain: 'The smallest group is about ' + marks[0] + ' and the biggest is about ' + marks[2] + '.', meta: { k: 'g1-est-match', marks: marks } };
      }],
      [2, 'mistake', function (lv) {
        var marks = lv === 2 ? [5, 20, 50] : [10, 25, 40], c = R.pick(marks), n = Math.max(3, c + R.int(-2, 2)), who = nm(), truth = !R.int(0, 2);
        var said = truth ? c : R.pick(marks.filter(function (m) { return m !== c; })), kind = R.pick(['apple', 'star', 'flower', 'leaf']);
        var right = 'There are about ' + c + '. An estimate should be close to the real number.';
        return G1.tf(who + ' did not count every one and said "about <b>' + said + '</b>". Is that a good estimate?', truth, right,
          ['Any number is a good estimate.', 'An estimate must be exactly right.', 'Bigger guesses are always better.'], { k: 'g1-est-tf', said: said, marks: marks },
          { fig: heap(n, kind, 300, 180), hint: 'Picture a group of 10. About how many groups of 10 are there?' });
      }]
    ]
  };
  G1.shapes('counting', SHAPES);
})();
