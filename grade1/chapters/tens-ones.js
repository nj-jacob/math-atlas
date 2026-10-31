(function () {
  var A = Atlas, R = A.R, W = A.word;
  function tn(n) { return Math.floor(n / 10); }
  function on(n) { return n % 10; }
  function pl(k, w) { return k + ' ' + w + (k === 1 ? '' : 's'); }
  /* the number with a green tens digit and a yellow ones digit */
  function dig(n) {
    return n >= 10 ? '<span class="dg"><b class="dt">' + tn(n) + '</b><b class="do">' + on(n) + '</b></span>' : '<span class="dg"><b class="do">' + n + '</b></span>';
  }
  function blocks(n, label) { return A.draw.tens(tn(n), on(n), { label: label || n + ': ' + pl(tn(n), 'ten') + ' and ' + pl(on(n), 'one') }); }
  /* two numbers side by side as blocks, for comparing */
  function pair(a, b) {
    return '<div class="vrow"><figure>' + blocks(a) + '<figcaption>' + a + '</figcaption></figure><figure>' + blocks(b) + '<figcaption>' + b + '</figcaption></figure></div>';
  }
  /* a part-part-whole mat drawn with counters */
  function mat(whole, a) {
    var b = whole - a;
    return '<div class="ppw"><div class="w"><span>Whole</span><b>' + whole + '</b></div><div class="p"><span>Part</span><b>' + a + '</b></div><div class="p y"><span>Part</span><b>' + b + '</b></div></div>' +
      '<div class="fig">' + A.draw.frames(a, { b: b, c: 20, label: whole + ' counters: ' + a + ' red and ' + b + ' yellow' }) + '</div>';
  }

  function qRead(lv) {
    var t, o;
    if (lv === 1) { t = R.int(0, 1); o = R.int(t ? 0 : 1, 9); }
    else if (lv === 2) { t = R.int(2, 4); o = R.int(0, 9); }
    else { t = R.int(1, 3); o = R.int(10, 15); }
    var n = t * 10 + o, fig = A.draw.tens(t, o, { label: pl(t, 'ten rod') + ' and ' + pl(o, 'small cube') });
    if (lv === 3) return { q: 'What number do these blocks show? Look out: there are more than 9 small cubes.', type: 'num', answer: n, fig: fig,
      hint: '10 small cubes make 1 more ten. Trade them first.',
      steps: ['Count the rods: ' + pl(t, 'ten') + '.', 'There are ' + o + ' small cubes. 10 of them make 1 more ten, with ' + (o - 10) + ' left.', 'So it is ' + (t + 1) + ' tens and ' + (o - 10) + ' ones: ' + n + '.'],
      explain: pl(t, 'ten') + ' and ' + o + ' ones is the same as ' + (t + 1) + ' tens and ' + (o - 10) + ' ones: ' + n + '.' };
    return { q: 'What number do these blocks show?', type: 'num', answer: n, fig: fig,
      hint: 'Each tall rod is 10. Count the rods by 10s, then count on the small cubes.',
      steps: ['Count the rods by 10s: ' + (t ? Array.apply(null, Array(t)).map(function (_, i) { return (i + 1) * 10; }).join(', ') : 'there are none') + '.', 'Count on the small cubes: ' + o + ' more.', 'That is ' + pl(t, 'ten') + ' and ' + pl(o, 'one') + ': ' + n + '.'],
      explain: pl(t, 'ten') + ' and ' + pl(o, 'one') + ' make ' + n + '.' };
  }
  function qParts(lv) {
    var n = lv === 1 ? R.int(11, 19) : R.int(21, 49), askT = R.int(0, 1);
    if (n % 10 === 0) n++;
    if (lv === 3) {
      var t = R.int(1, 4), o = R.int(1, 9), m = t * 10 + o, w = R.mc(m, [o * 10 + t, t + o, t * 10, m + 10 <= 50 ? m + 10 : m - 10].filter(function (v) { return v !== m; }));
      return { q: 'Which number has <b>' + pl(t, 'ten') + ' and ' + pl(o, 'one') + '</b>?', type: 'mc', options: w.options, answer: w.answer,
        hint: 'Write the tens digit first, then the ones digit.', steps: ['The tens digit is ' + t + '.', 'The ones digit is ' + o + '.', 'Put them together: ' + m + '.'], explain: pl(t, 'ten') + ' and ' + pl(o, 'one') + ' is ' + m + '.' };
    }
    var ans = askT ? tn(n) : on(n);
    return { q: 'How many <b>' + (askT ? 'tens' : 'ones') + '</b> are in ' + dig(n) + '?', type: 'num', answer: ans, fig: blocks(n),
      hint: askT ? 'Count the tall rods. The first digit tells the tens.' : 'Count the small cubes. The last digit tells the ones.',
      steps: ['In ' + n + ', the first digit is ' + tn(n) + '. That is the tens.', 'The last digit is ' + on(n) + '. That is the ones.', n + ' has ' + pl(tn(n), 'ten') + ' and ' + pl(on(n), 'one') + '. So the answer is ' + ans + '.'],
      explain: n + ' is ' + pl(tn(n), 'ten') + ' and ' + pl(on(n), 'one') + '.' };
  }
  function qSplit(lv) {
    var whole, a;
    if (lv === 1) { whole = R.int(5, 10); a = R.int(1, whole - 1); }
    else if (lv === 2) { whole = R.int(11, 20); a = R.pick([10, R.int(1, whole - 1)]); }
    else { whole = R.int(21, 49); a = R.pick([tn(whole) * 10, 10, on(whole) || 5]); if (a >= whole) a = 10; }
    var b = whole - a;
    return { q: '<span class="math">' + whole + ' = ' + a + ' + <b class="blank">?</b></span> What is the missing part?', type: 'num', answer: b,
      fig: whole <= 20 ? A.draw.frames(a, { ghost: whole, c: 22, label: whole + ' boxes: ' + a + ' counters and ' + b + ' empty' }) : blocks(whole),
      hint: whole <= 20 ? 'The whole is ' + whole + '. Count the empty rings: they are the missing part.' : 'Split ' + whole + ' into tens and ones. Take away the ' + a + ' you already have.',
      steps: whole <= 20 ? ['The whole is ' + whole + '. One part is ' + a + '.', 'Count on from ' + a + ' up to ' + whole + '.', 'You counted on ' + b + '. The missing part is ' + b + '.']
        : [whole + ' is ' + pl(tn(whole), 'ten') + ' and ' + pl(on(whole), 'one') + '.', 'Take away the ' + a + ' you know.', 'What is left is ' + b + '. So ' + whole + ' = ' + a + ' + ' + b + '.'],
      explain: a + ' and ' + b + ' make ' + whole + '.' };
  }
  function qTen(lv) {
    var n = lv === 1 ? R.int(1, 4) * 10 : R.int(11, 40), more = R.int(0, 1);
    if (!more && n < 11) more = 1;
    if (more && n > 40) more = 0;
    var ans = more ? n + 10 : n - 10;
    if (lv === 3) {
      var k = R.int(2, 3), m = R.int(1, 9) + (more ? R.int(0, 1) * 10 : 30);
      var ans2 = more ? m + 10 * k : m - 10 * k;
      if (ans2 < 1 || ans2 > 50) { m = 3 + R.int(0, 6); more = 1; ans2 = m + 10 * k; }
      return { q: 'What is <b>' + k + ' tens ' + (more ? 'more' : 'less') + '</b> than ' + m + '?', type: 'num', answer: ans2,
        hint: 'Each ten ' + (more ? 'more' : 'less') + ' moves one row ' + (more ? 'down' : 'up') + ' on the chart. Only the tens digit changes.',
        steps: ['Find ' + m + ' on the chart.', 'Move ' + k + ' rows ' + (more ? 'down' : 'up') + ': ' + Array.apply(null, Array(k)).map(function (_, i) { return more ? m + 10 * (i + 1) : m - 10 * (i + 1); }).join(', ') + '.', 'You land on ' + ans2 + '.'],
        explain: k + ' tens ' + (more ? 'more' : 'less') + ' than ' + m + ' is ' + ans2 + '. The ones digit stays ' + on(m) + '.' };
    }
    var c = {}; c[n] = 'c';
    return { q: 'What is <b>ten ' + (more ? 'more' : 'less') + '</b> than ' + n + '?', type: 'num', answer: ans, fig: A.chart({ cls: c, hide: [ans] }),
      hint: 'On the chart, ten ' + (more ? 'more is one row down' : 'less is one row up') + '. The ones digit stays the same.',
      steps: ['Find ' + n + ' on the chart. It is yellow.', 'Move one row ' + (more ? 'down' : 'up') + '.', 'You land on ' + ans + '. The tens digit changed by 1. The ones digit stayed ' + on(n) + '.'],
      explain: 'Ten ' + (more ? 'more' : 'less') + ' than ' + n + ' is ' + ans + '.' };
  }
  function qCompare(lv) {
    var a, b;
    if (lv === 1) { a = R.int(2, 20); do { b = R.int(2, 20); } while (b === a); }
    else if (lv === 2) { a = R.int(10, 49); do { b = R.int(10, 49); } while (tn(b) === tn(a)); }
    else {
      if (R.int(0, 1)) { var x = R.int(1, 4), y; do { y = R.int(1, 9); } while (y === x); a = x * 10 + y; b = y * 10 + x; if (b > 50) { b = a - R.int(1, 3); } }
      else { a = R.int(2, 4) * 10 + R.int(0, 9); do { b = tn(a) * 10 + R.int(0, 9); } while (b === a); }
    }
    var askMore = R.int(0, 1), ans = askMore ? Math.max(a, b) : Math.min(a, b);
    var o = { options: [String(a), String(b)], answer: [a, b].indexOf(ans) };
    var same = tn(a) === tn(b);
    return { q: 'Which number is <b>' + (askMore ? 'greater' : 'less') + '</b>?', type: 'mc', options: o.options, answer: o.answer, fig: lv < 3 ? pair(a, b) : '', chk: { a: a, b: b, more: askMore },
      hint: same ? 'The tens are the same. Compare the ones.' : 'Compare the tens first. More tens means a greater number.',
      steps: ['Look at the tens: ' + a + ' has ' + pl(tn(a), 'ten') + ', ' + b + ' has ' + pl(tn(b), 'ten') + '.', same ? 'The tens are the same, so look at the ones: ' + on(a) + ' and ' + on(b) + '.' : 'The tens are different, so the one with more tens is greater.', ans + ' is ' + (askMore ? 'greater' : 'less') + '.'],
      explain: Math.max(a, b) + ' is greater than ' + Math.min(a, b) + '. So ' + ans + ' is ' + (askMore ? 'greater' : 'less') + '.' };
  }
  function qOrder(lv) {
    var hi = lv === 1 ? 20 : 50, nums = [];
    while (nums.length < 3) { var v = lv === 3 ? (nums.length ? tn(nums[0]) * 10 + R.int(0, 9) : R.int(1, 4) * 10 + R.int(0, 9)) : R.int(lv === 1 ? 1 : 10, hi); if (v >= 1 && v <= 50 && nums.every(function (x) { return Math.abs(x - v) >= (lv === 1 ? 2 : lv === 2 ? 4 : 1); })) nums.push(v); }
    var sorted = nums.slice().sort(function (a, b) { return a - b; });
    if (lv === 1) {
      var big = R.int(0, 1), ans = big ? sorted[2] : sorted[0];
      var o = R.mc(ans, nums.filter(function (x) { return x !== ans; }));
      return { q: 'Which number is the <b>' + (big ? 'greatest' : 'least') + '</b>?', type: 'mc', options: o.options, answer: o.answer, fig: A.draw.nl(0, 20, { ring: nums }), chk: { nums: nums, big: big },
        hint: 'On the number line, ' + (big ? 'greater numbers are further right.' : 'smaller numbers are further left.'),
        steps: ['Find each number on the number line.', (big ? 'The one furthest right is the greatest.' : 'The one furthest left is the least.'), 'It is ' + ans + '.'], explain: 'In order: ' + sorted.join(', ') + '. The ' + (big ? 'greatest' : 'least') + ' is ' + ans + '.' };
    }
    var right = sorted.join(', '), wrongs = [[sorted[2], sorted[1], sorted[0]], [sorted[1], sorted[0], sorted[2]], [sorted[0], sorted[2], sorted[1]], nums].map(function (x) { return x.join(', '); }).filter(function (x) { return x !== right; });
    var o2 = R.mc(right, wrongs);
    return { q: 'Which list goes from <b>least to greatest</b>?', type: 'mc', options: o2.options, answer: o2.answer, wide: true, chk: { nums: nums },
      fig: lv === 2 ? A.draw.nl(0, 50, { ring: nums }) : '',
      hint: 'Find the least number first. ' + (lv === 3 ? 'The tens are the same, so compare the ones.' : 'Compare the tens.'),
      steps: ['The least is ' + sorted[0] + '.', 'Next is ' + sorted[1] + '.', 'The greatest is ' + sorted[2] + '. Least to greatest: ' + right + '.'], explain: 'Least to greatest: ' + right + '.' };
  }

  var CH = 'tens-ones';
  /* ---------- lessons: one idea per screen (assets/lesson.js) ---------- */
  var K = window.G1;
  function P(id, lv) { return function () { var s = A.chapters[CH].practice.filter(function (x) { return x.id === id; })[0]; return s.gen(typeof lv === 'function' ? lv() : lv); }; }
  function mc(q, right, wrong, extra) { var o = R.mc(right, wrong); return Object.assign({ q: q, type: 'mc', options: o.options, answer: o.answer }, extra || {}); }
  function blocksCard(n) { return blocks(n) + '<span class="big">' + n + '</span>'; }

  var LESSONS = [
    { id: 'tens', title: 'Tens and ones', sub: 'Group 10 ones to make a ten.', concepts: [
      { id: 'make-ten', title: 'Ten ones make one ten', exp: ['B1.2'], skill: 't-read',
        body: '<p>Counting one by one takes a long time. When we have <b>10 ones</b>, we snap them together to make <b>1 ten</b>.</p>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'] }, steps: [
          { say: 'Here are some one cubes. Each cube is worth 1.', act: function (t) { return t.add('o', 8, 160); }, ms: 500 },
          { say: 'Five more: 9, 10, 11, 12, 13.', act: function (t) { return t.add('o', 5, 380); }, ms: 500 },
          { say: 'Ten of the cubes slide together to make <b>1 ten</b>.', act: function (t) { return t.group('o'); }, ms: 800 },
          { say: '1 ten and 3 ones. That is <b>13</b>.', act: function (t) { return t.countAll(380); }, ms: 1800 }
        ] },
        example: { tool: 'base10', opts: { cols: ['t', 'o'] }, steps: [
          { say: 'My turn. I count some one cubes: 1, 2, 3 ... all the way to 10.', act: function (t) { return t.add('o', 10, 200); }, ms: 800 },
          { say: 'I have 10 ones. I snap them together to make <b>1 ten</b>.', act: function (t) { return t.group('o'); }, ms: 1000 },
          { say: 'I put 1 more cube next to it.', act: function (t) { return t.add('o', 1); }, ms: 900 },
          { say: '1 ten and 1 one. That is <b>11</b>. 10 ones = 1 ten.', ms: 1800 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true }, tasks: [
          { do: 'Tap <b>+ 1</b> until there are 10 ones. Then press <b>Group 10 ones</b>.', goal: function (s) { return s.t >= 1; }, yes: 'Yes. 10 ones became 1 ten.' },
          { do: 'Now make <b>1 ten and 6 ones</b>.', reset: false, goal: function (s) { return s.t === 1 && s.o === 6; }, yes: '1 ten and 6 ones make 16.' }
        ] },
        key: '<p><b>10 ones = 1 ten.</b> A rod is 10 cubes stuck together.</p>',
        check: [function () { return mc('How many ones make <b>1 ten</b>?', '10', ['1', '5', '100'], { fig: A.draw.tens(1, 0), hint: 'Count the small squares on the rod.', explain: 'A ten rod is 10 ones stuck together.' }); }, P('t-read', 1)] },
      { id: 'count-tens', title: 'Count the tens, then the ones', exp: ['B1.2'], skill: 't-read',
        body: '<p>To count blocks, start with the <b>tens</b>: 10, 20, 30. Then keep going with the <b>ones</b>: 31, 32.</p>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'], t: 3, o: 4 }, steps: [
          { say: 'How many? Start with the tens.', ms: 1000 },
          { say: 'Count by tens: 10, 20, 30.', act: function (t) { return t.lightKind('t', 650); }, ms: 300 },
          { say: 'Count on the ones: 31, 32, 33, 34.', act: function (t) { return t.lightKind('o', 550); }, ms: 400 },
          { say: '3 tens and 4 ones make <b>34</b>.', ms: 1800 }
        ] },
        example: { tool: 'base10', opts: { cols: ['t', 'o'], t: 2, o: 7 }, steps: [
          { say: 'My turn. How many? I start with the tens.', ms: 1100 },
          { say: 'I count the rods by tens: 10, 20.', act: function (t) { return t.lightKind('t', 650); }, ms: 400 },
          { say: 'I count on the ones: 21, 22, 23, 24, 25, 26, 27.', act: function (t) { return t.lightKind('o', 450); }, ms: 400 },
          { say: '2 tens and 7 ones make <b>27</b>. I counted the tens first, then the ones.', ms: 1800 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true, t: 2, o: 5 }, tasks: [
          { do: '<b>Tap each block</b> to count it. Start with the tens.', reset: false, goal: function (s) { return s.allLit; }, yes: 'You counted them all: 25.' },
          { do: 'Make <b>42</b> with the blocks.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 42 && s.o < 10; }, yes: '4 tens and 2 ones make 42.' }
        ] },
        mistake: '<p>Counting a ten rod as 1. A rod is worth <b>10</b>, so count rods by tens first.</p>',
        key: '<p>Count the <b>tens</b> first, then count on the <b>ones</b>.</p>',
        check: [P('t-read', 1), P('t-read', 2)] },
      { id: 'digits', title: 'What each digit means', exp: ['B1.2'], skill: 't-parts',
        body: '<p>In ' + dig(34) + ', the <b class="dt">3</b> means <b>3 tens</b>. The <b class="do">4</b> means <b>4 ones</b>. The place of a digit tells what it is worth.</p>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'] }, steps: [
          { say: 'Build 34. The 3 is in the tens place: 3 tens.', act: function (t) { return t.add('t', 3, 420); }, ms: 600 },
          { say: 'The 4 is in the ones place: 4 ones.', act: function (t) { return t.add('o', 4, 320); }, ms: 600 },
          { say: 'The 3 is worth 30. The 4 is worth 4. 30 and 4 make <b>34</b>.', act: function (t) { return t.lightKind('t', 300); }, ms: 1800 }
        ] },
        example: { tool: 'base10', opts: { cols: ['t', 'o'] }, steps: [
          { say: 'My turn. I will build 43.', ms: 1000 },
          { say: 'The first digit is 4. It is in the tens place, so I take <b>4 tens</b>.', act: function (t) { return t.add('t', 4, 380); }, ms: 700 },
          { say: 'The last digit is 3. It is in the ones place, so I take <b>3 ones</b>.', act: function (t) { return t.add('o', 3, 320); }, ms: 700 },
          { say: 'The 4 is worth 40. The 3 is worth 3. 40 and 3 make <b>43</b>.', act: function (t) { return t.lightKind('t', 300); }, ms: 1800 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true }, tasks: [
          { do: 'Build the number with <b>2 tens</b> and <b>9 ones</b>.', goal: function (s) { return s.t === 2 && s.o === 9; }, yes: '2 tens and 9 ones is 29.' },
          { do: 'Build <b>50</b>. How many ones does it have?', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 50 && s.o === 0; }, yes: '5 tens and 0 ones. The 0 says there are no ones.' }
        ] },
        key: '<p>The <b>first digit</b> tells the tens. The <b>last digit</b> tells the ones.</p>',
        check: [P('t-parts', 1), P('t-parts', 2)] }
    ] },

    { id: 'ten-more', title: 'Ten more, ten less', sub: 'Only the tens change.', concepts: [
      { id: 'more', title: 'Ten more', exp: ['B1.2'], skill: 't-ten',
        body: '<p>To find <b>ten more</b>, add one ten. The ones stay the same. Ten more than 18 is <b>28</b>.</p>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'], t: 1, o: 8 }, steps: [
          { say: 'Here is 18: 1 ten and 8 ones.', ms: 1400 },
          { say: 'Add one more ten.', act: function (t) { return t.add('t', 1); }, ms: 800 },
          { say: 'Now 2 tens and 8 ones: <b>28</b>. The ones did not change.', ms: 1800 }
        ] },
        example: { tool: 'base10', opts: { cols: ['t', 'o'], t: 3, o: 5 }, steps: [
          { say: 'My turn. What is ten more than 35?', ms: 1200 },
          { say: 'I see 3 tens and 5 ones. To find ten more, I add one ten.', act: function (t) { return t.add('t', 1); }, ms: 1000 },
          { say: 'Now there are 4 tens and 5 ones: <b>45</b>.', ms: 1300 },
          { say: 'The ones stayed 5. Ten more than 35 is 45.', ms: 1700 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true, t: 2, o: 3 }, tasks: [
          { do: 'This is 23. Show <b>ten more</b>.', reset: false, goal: function (s) { return s.value === 33 && s.o === 3; }, yes: 'Ten more than 23 is 33.' },
          { do: 'Show <b>ten more</b> again.', reset: false, goal: function (s) { return s.value === 43 && s.o === 3; }, yes: 'Ten more than 33 is 43. Only the tens digit changed.' }
        ] },
        ways: [{ label: 'On the chart', html: '<p>On the number chart, the number <b>under</b> a number is ten more.</p>', tool: 'hundred', opts: { to: 50, lit: [4, 14, 24, 34, 44] } }],
        key: '<p>Ten more: <b>add a ten</b>. The ones stay the same.</p>',
        check: [P('t-ten', 1), P('t-ten', 1)] },
      { id: 'less', title: 'Ten less', exp: ['B1.2'], skill: 't-ten',
        body: '<p>To find <b>ten less</b>, take away one ten. Ten less than 36 is <b>26</b>.</p>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'], t: 3, o: 6 }, steps: [
          { say: 'Here is 36: 3 tens and 6 ones.', ms: 1400 },
          { say: 'Take away one ten.', act: function (t) { return t.remove('t', 1); }, ms: 800 },
          { say: 'Now 2 tens and 6 ones: <b>26</b>.', ms: 1800 }
        ] },
        example: { tool: 'base10', opts: { cols: ['t', 'o'], t: 4, o: 2 }, steps: [
          { say: 'My turn. What is ten less than 42?', ms: 1200 },
          { say: 'I see 4 tens and 2 ones. To find ten less, I take away one ten.', act: function (t) { return t.remove('t', 1); }, ms: 1000 },
          { say: 'Now there are 3 tens and 2 ones: <b>32</b>.', ms: 1300 },
          { say: 'The ones stayed 2. Ten less than 42 is 32.', ms: 1700 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true, t: 4, o: 7 }, tasks: [
          { do: 'This is 47. Show <b>ten less</b>.', reset: false, goal: function (s) { return s.value === 37 && s.o === 7; }, yes: 'Ten less than 47 is 37.' },
          { do: 'Keep taking away tens until only the ones are left.', reset: false, goal: function (s) { return s.value === 7; }, yes: '47, 37, 27, 17, 7. The ones stayed 7 all the way.' }
        ] },
        mistake: '<p>Taking away 1 instead of 10 (ten less than 36 written as 35). Ask: "Did the ones change? Ten less only changes the tens."</p>',
        key: '<p>Ten less: <b>take away a ten</b>. The ones stay the same.</p>',
        check: [P('t-ten', 2), P('t-ten', 2)] }
    ] },

    { id: 'apart', title: 'Break numbers apart', sub: 'Parts make a whole.', concepts: [
      { id: 'parts', title: 'Two parts make a whole', exp: ['B1.2'], skill: 't-split',
        body: '<p>A number can be split into two <b>parts</b>. Put the parts together and you get the <b>whole</b>.</p>' + mat(7, 4),
        watch: { tool: 'counters', opts: { n: 9, arrange: 'row' }, steps: [
          { say: 'Here are 9 counters. That is the whole.', ms: 1400 },
          { say: 'Split them into two parts, red and yellow.', act: function (t) { return t.arrange('pairs'); }, ms: 900 },
          { say: 'Many ways work: 4 and 5, 6 and 3, 8 and 1. The whole is still 9.', act: function (t) { return t.arrange('row'); }, ms: 2000 }
        ] },
        example: { tool: 'g1stage', steps: [
          { say: 'My turn. Here are 6 counters. 6 is the whole.', act: function (t) { return t.show(A.draw.frames(6, { c: 30, label: '6 red counters' })); }, ms: 1300 },
          { say: 'I split them into two parts: 2 red and 4 yellow.', act: function (t) { return t.show(mat(6, 2)); }, ms: 1500 },
          { say: 'I can split them another way: 5 red and 1 yellow.', act: function (t) { return t.show(mat(6, 5)); }, ms: 1500 },
          { say: '2 and 4 make 6. 5 and 1 make 6. The two <b>parts</b> together make the <b>whole</b>.', ms: 1900 }
        ] },
        try: { tool: 'tenframe', opts: { two: true }, tasks: [
          { do: 'Make <b>8</b> with two colours: some red, some yellow. Tap a box once for red, twice for yellow.', goal: function (s) { return s.n === 8 && s.a > 0 && s.b > 0; }, yes: function (s) { return s.a + ' and ' + s.b + ' make 8.'; } },
          { do: 'Make <b>8</b> a different way.', setup: function () {}, goal: function (s) { return s.n === 8 && s.a > 0 && s.b > 0; }, yes: function (s) { return s.a + ' and ' + s.b + ' also make 8.'; } }
        ] },
        key: '<p>The two <b>parts</b> together make the <b>whole</b>.</p>',
        check: [P('t-split', 1), P('t-split', 1)] },
      { id: 'missing', title: 'Find the missing part', exp: ['B1.2'], skill: 't-split',
        body: '<p>If you know the whole and one part, you can find the other part. 10 is 6 and <b>4</b>.</p>',
        watch: { tool: 'tenframe', opts: { n: 6 }, steps: [
          { say: 'The whole is 10. One part is 6.', ms: 1400 },
          { say: 'Fill the empty boxes to find the other part: 7, 8, 9, 10.', act: function (t) { return t.fill(10, 500); }, ms: 600 },
          { say: 'We added <b>4</b>. So 10 is 6 and 4.', ms: 1800 }
        ] },
        example: { tool: 'tenframe', opts: { n: 2 }, steps: [
          { say: 'My turn. The whole is 10. One part is 2. What is the other part?', ms: 1500 },
          { say: 'I fill the empty boxes and count them: 1, 2, 3, 4, 5, 6, 7, 8.', act: function (t) { return t.fill(10, 380); }, ms: 700 },
          { say: 'I filled <b>8</b> boxes. So the other part is 8.', ms: 1300 },
          { say: '10 take away 2 leaves 8. I check: 2 and 8 make 10.', ms: 1800 }
        ] },
        try: { tool: 'tenframe', opts: { n: 3 }, tasks: [
          { do: 'The whole is 10. One part is 3. Fill boxes to find the other part.', reset: false, goal: function (s) { return s.full; }, yes: '3 and 7 make 10. The missing part is 7.' }
        ] },
        key: '<p>Whole take away one part leaves the <b>other part</b>.</p>',
        check: [P('t-split', 2), P('t-split', 2)] },
      { id: 'trade', title: 'Trade a ten for ones', exp: ['B1.2'], skill: 't-parts', hard: true,
        body: '<p>We can break a ten into 10 ones. The number does not change. 25 is 2 tens and 5 ones. It is also <b>1 ten and 15 ones</b>.</p>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'], t: 2, o: 5 }, steps: [
          { say: 'This is 25: 2 tens and 5 ones.', ms: 1400 },
          { say: 'Break one ten into 10 ones.', act: function (t) { return t.split('t'); }, ms: 900 },
          { say: 'Now 1 ten and 15 ones. Count them: still <b>25</b>.', act: function (t) { return t.countAll(200); }, ms: 1800 }
        ] },
        example: { tool: 'base10', opts: { cols: ['t', 'o'], t: 4, o: 1 }, steps: [
          { say: 'My turn. This is 41: 4 tens and 1 one.', ms: 1400 },
          { say: 'I break one ten into 10 ones.', act: function (t) { return t.split('t'); }, ms: 1000 },
          { say: 'Now there are 3 tens and 11 ones. I count them all to check.', act: function (t) { return t.countAll(160); }, ms: 900 },
          { say: 'Still <b>41</b>. Trading a ten for 10 ones does not change the number.', ms: 1900 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true, t: 3, o: 2 }, tasks: [
          { do: 'Show <b>32</b> with <b>more than 9 ones</b>. Use Break a ten.', reset: false, goal: function (s) { return s.value === 32 && s.o > 9; }, yes: function (s) { return s.t + ' ten and ' + s.o + ' ones is still 32.'; } },
          { do: 'Now group 10 ones back into a ten.', reset: false, goal: function (s) { return s.value === 32 && s.o === 2; }, yes: '3 tens and 2 ones. Still 32.' }
        ] },
        ways: [
          { label: 'With ten frames', html: '<p>25 is 2 full ten frames and 5 more. Empty one frame onto the table: now it is 1 full frame and 15 loose counters. Nothing was added or taken away, so it is still 25.</p><div class="fig">' + A.draw.frames(25, { c: 18 }) + '</div>' },
          { label: 'With numbers', html: '<p class="math">20 + 5 = 25</p><p class="math">10 + 15 = 25</p><p>Both ways make 25.</p>' }
        ],
        mistake: '<p>Writing 2 tens and 14 ones as "214". Trade 10 of the ones for a ten: 3 tens and 4 ones is 34.</p>',
        key: '<p>Trading a ten for 10 ones <b>does not change</b> the number.</p>',
        check: [function () { var t = R.int(1, 3), o = R.int(11, 16); return { q: 'What number is <b>' + t + ' ten' + (t > 1 ? 's' : '') + ' and ' + o + ' ones</b>?', type: 'num', answer: t * 10 + o, fig: A.draw.tens(t, o), hint: 'Group 10 of the ones into a ten first.', explain: t + ' tens and ' + o + ' ones is ' + (t * 10 + o) + '.', steps: ['10 of the ' + o + ' ones make 1 more ten.', 'That is ' + (t + 1) + ' tens and ' + (o - 10) + ' ones.', 'The number is ' + (t * 10 + o) + '.'] }; }, P('t-parts', 2)] }
    ] },

    { id: 'compare', title: 'Which is greater?', sub: 'Look at the tens first.', concepts: [
      { id: 'tens-first', title: 'Compare the tens first', exp: ['B1.3'], skill: 't-compare',
        body: '<p>To compare two numbers, look at the <b>tens first</b>. More tens means a greater number.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'Which is greater, 31 or 28?', act: function (t) { return t.show(pair(31, 28)); }, ms: 1600 },
          { say: '31 has <b>3 tens</b>. 28 has <b>2 tens</b>.', act: function (t) { return t.glow('figure:first-child svg'); }, ms: 1600 },
          { say: '3 tens is more than 2 tens. So <b>31 is greater</b>. The ones do not matter here.', ms: 2200 }
        ] },
        example: { tool: 'g1stage', steps: [
          { say: 'My turn. Which is greater, 19 or 32?', act: function (t) { return t.show(pair(19, 32)); }, ms: 1500 },
          { say: 'I look at the tens first. 19 has <b>1 ten</b>. 32 has <b>3 tens</b>.', act: function (t) { return t.glow('figure svg', 600); }, ms: 1600 },
          { say: '3 tens is more than 1 ten. So <b>32 is greater</b>.', ms: 1500 },
          { say: 'More tens means greater. I do not need the ones.', ms: 1700 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: [{ id: 'a', html: blocksCard(24) }, { id: 'b', html: blocksCard(41) }] }, tasks: [
          { do: 'Tap the <b>greater</b> number.', goal: function (s) { return s.picked[0] === 'b'; }, yes: '41 has 4 tens. 24 has 2 tens. 41 is greater.' }
        ] },
        key: '<p>More <b>tens</b> means <b>greater</b>.</p>',
        check: [P('t-compare', 1), P('t-compare', 1)] },
      { id: 'same-tens', title: 'Same tens? Compare the ones', exp: ['B1.3'], skill: 't-compare',
        body: '<p>If the tens are the same, look at the <b>ones</b>. 45 and 42 both have 4 tens. 5 ones is more than 2 ones, so <b>45 is greater</b>.</p>',
        watch: { tool: 'g1stage', steps: [
          { say: 'Which is greater, 45 or 42?', act: function (t) { return t.show(pair(45, 42)); }, ms: 1600 },
          { say: 'Both have 4 tens. The same.', ms: 1400 },
          { say: 'Ones: 5 and 2. 5 is more, so <b>45 is greater</b>.', ms: 2000 }
        ] },
        example: { tool: 'g1stage', steps: [
          { say: 'My turn. Which is greater, 26 or 29?', act: function (t) { return t.show(pair(26, 29)); }, ms: 1500 },
          { say: 'I look at the tens first. Both have 2 tens. That is the same.', ms: 1500 },
          { say: 'So I look at the ones: 6 and 9. 9 is more.', ms: 1500 },
          { say: '<b>29 is greater</b>. Same tens? The one with more ones is greater.', ms: 1800 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: [{ id: 'a', html: blocksCard(37) }, { id: 'b', html: blocksCard(33) }] }, tasks: [
          { do: 'Tap the <b>greater</b> number.', goal: function (s) { return s.picked[0] === 'a'; }, yes: 'Both have 3 tens. 7 ones is more than 3 ones, so 37 is greater.' }
        ] },
        key: '<p>Same tens? The one with more <b>ones</b> is greater.</p>',
        check: [P('t-compare', 2), P('t-compare', 2)] },
      { id: 'swap', title: '14 is not 41', exp: ['B1.3'], skill: 't-compare', hard: true,
        body: '<p>14 and 41 use the same digits, but they are very different. 41 has <b>4 tens</b>. 14 has only <b>1 ten</b>.</p>' + pair(14, 41),
        watch: { tool: 'base10', opts: { cols: ['t', 'o'] }, steps: [
          { say: '14 is 1 ten and 4 ones.', act: function (t) { return t.set(0, 1, 4); }, ms: 1600 },
          { say: '41 is 4 tens and 1 one.', act: function (t) { return t.set(0, 4, 1); }, ms: 1600 },
          { say: '41 has many more blocks. <b>41 is greater</b>.', act: function (t) { return t.countAll(150); }, ms: 1800 }
        ] },
        example: { tool: 'base10', opts: { cols: ['t', 'o'] }, steps: [
          { say: 'My turn. 25 and 52 use the same digits. Which is greater?', ms: 1500 },
          { say: 'I build 25: the first digit says 2 tens, then 5 ones.', act: function (t) { return t.set(0, 2, 5); }, ms: 1500 },
          { say: 'I build 52: the first digit says 5 tens, then 2 ones.', act: function (t) { return t.set(0, 5, 2); }, ms: 1500 },
          { say: '5 tens is more than 2 tens. <b>52 is greater</b>. The first digit counts tens, so it matters most.', ms: 2000 }
        ] },
        try: { tool: 'g1pick', opts: { multi: false, items: [{ id: 'a', html: '<span class="big">23</span>' }, { id: 'b', html: '<span class="big">32</span>' }] }, tasks: [
          { do: 'Tap the number that has <b>3 tens</b>.', goal: function (s) { return s.picked[0] === 'b'; }, yes: '32 has 3 tens and 2 ones. 23 has only 2 tens.' }
        ] },
        ways: [
          { label: 'On the number line', html: '<div class="fig">' + A.draw.nl(0, 50, { ring: [14, 41] }) + '</div><p>41 is much further to the right, so it is greater.</p>' },
          { label: 'Count the tens', html: '<p>Say the first digit as tens. 14: "one ten". 41: "four tens". Four tens is more.</p>' }
        ],
        mistake: '<p>Thinking 14 and 41 are about the same because the digits match. Build both with blocks side by side.</p>',
        key: '<p>The <b>first digit</b> counts tens. It matters most.</p>',
        check: [function () { var a = R.int(1, 4), b = R.int(a + 1, 5), x = a * 10 + b, y = b * 10 + a; return mc('Which is <b>greater</b>?', String(y), [String(x)], { fig: pair(x, y), hint: 'Look at the tens first.', explain: y + ' has ' + b + ' tens. ' + x + ' has ' + a + '. ' + y + ' is greater.' }); }, P('t-compare', 3)] }
    ] },

    { id: 'order', title: 'Put numbers in order', sub: 'Least to greatest.', concepts: [
      { id: 'line', title: 'Order on a number line', exp: ['B1.3'], skill: 't-order',
        body: '<p>On a number line, numbers get <b>greater</b> to the right. Reading left to right puts them in order from <b>least</b> to <b>greatest</b>.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 50, tick: 1, every: 10, start: 0 }, steps: [
          { say: 'Where are 35, 12 and 27?', ms: 1200 },
          { say: '12 is near the start.', act: function (t) { return t.mark(12, '12'); }, ms: 800 },
          { say: '27 is in the middle.', act: function (t) { return t.mark(27, '27'); }, ms: 800 },
          { say: '35 is further right.', act: function (t) { return t.mark(35, '35'); }, ms: 800 },
          { say: 'Left to right: <b>12, 27, 35</b>. Least to greatest.', ms: 1800 }
        ] },
        example: { tool: 'numberline', opts: { min: 0, max: 50, tick: 1, every: 10, start: 0 }, steps: [
          { say: 'My turn. I will put 44, 8 and 21 in order.', ms: 1300 },
          { say: 'I find 8. It is near the start, on the left.', act: function (t) { return t.mark(8, '8'); }, ms: 900 },
          { say: 'I find 21. It is a little past 20.', act: function (t) { return t.mark(21, '21'); }, ms: 900 },
          { say: 'I find 44. It is far to the right, near 50.', act: function (t) { return t.mark(44, '44'); }, ms: 900 },
          { say: 'I read left to right: <b>8, 21, 44</b>. 8 is the least. 44 is the greatest.', ms: 1900 }
        ] },
        try: { tool: 'numberline', opts: { min: 0, max: 50, tick: 1, every: 10, start: 25 }, tasks: [
          { do: 'Move the dot to the <b>least</b> of 18, 9 and 31.', goal: function (s) { return s.at === 9; }, yes: '9 is furthest left, so it is the least.' },
          { do: 'Now move it to the <b>greatest</b> of 18, 9 and 31.', reset: false, goal: function (s) { return s.at === 31; }, yes: '31 is furthest right, so it is the greatest.' }
        ] },
        key: '<p><b>Least</b> is the smallest. <b>Greatest</b> is the biggest.</p>',
        check: [P('t-order', 1), P('t-order', 1)] },
      { id: 'three', title: 'Order three numbers', exp: ['B1.3'], skill: 't-order',
        body: '<p>Find the <b>least</b> first. Then the next. The greatest goes last.</p>',
        watch: { tool: 'g1pick', opts: { items: [{ id: '42', html: blocksCard(42) }, { id: '15', html: blocksCard(15) }, { id: '28', html: blocksCard(28) }] }, steps: [
          { say: 'Put 42, 15 and 28 in order, least to greatest.', ms: 1400 },
          { say: 'The fewest tens: 15. It goes first.', act: function (t) { return t.pick('15'); }, ms: 900 },
          { say: 'Next, 28.', act: function (t) { return t.pick('28'); }, ms: 900 },
          { say: 'The most tens: 42. Least to greatest: <b>15, 28, 42</b>.', act: function (t) { return t.pick('42'); }, ms: 1800 }
        ] },
        example: { tool: 'g1pick', opts: { items: [{ id: '30', html: blocksCard(30) }, { id: '13', html: blocksCard(13) }, { id: '26', html: blocksCard(26) }] }, steps: [
          { say: 'My turn. I will put 30, 13 and 26 in order, least to greatest.', ms: 1500 },
          { say: 'I find the least first. 13 has the fewest tens: just 1. It goes first.', act: function (t) { return t.pick('13'); }, ms: 1100 },
          { say: 'Next: 26 has 2 tens.', act: function (t) { return t.pick('26'); }, ms: 1000 },
          { say: '30 has the most tens, so it goes last. <b>13, 26, 30</b>. Least first, greatest last.', act: function (t) { return t.pick('30'); }, ms: 1900 }
        ] },
        try: { tool: 'g1pick', opts: { items: [{ id: '33', html: '<span class="big">33</span>' }, { id: '19', html: '<span class="big">19</span>' }, { id: '40', html: '<span class="big">40</span>' }, { id: '7', html: '<span class="big">7</span>' }], readout: function (s) { return s.n ? '<p>Your order: <b>' + s.picked.join(', ') + '</b></p>' : '<p class="t2">Tap from least to greatest.</p>'; } }, tasks: [
          { do: 'Tap the numbers in order from <b>least to greatest</b>. Tap a number again to undo it.', goal: function (s) { return s.picked.join(',') === '7,19,33,40'; }, yes: '7, 19, 33, 40. Least to greatest.' }
        ] },
        key: '<p>Least first, greatest last.</p>',
        check: [P('t-order', 2), P('t-order', 3)] }
    ] }
  ];

  A.register('tens-ones', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Tens and ones</h2>' +
'<p>When we have 10 ones, we can put them together to make <b>1 ten</b>. A tall rod is 1 ten. A small cube is 1 one.</p>' +
'<div class="vrow"><figure>' + A.draw.tens(0, 10, { label: '10 small cubes' }) + '<figcaption>10 ones</figcaption></figure><figure style="align-self:center;font-size:2rem;font-weight:700" aria-hidden="true">=</figure><figure>' + A.draw.tens(1, 0) + '<figcaption>1 ten</figcaption></figure></div>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + blocks(27) + '</div><p>I see 2 rods. That is <b>2 tens</b>: 10, 20. I see 7 cubes. That is <b>7 ones</b>: 21, 22, 23, 24, 25, 26, 27. The number is ' + dig(27) + '.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>There are 13 small cubes. Can we make a ten?</p><div class="fig">' + A.draw.tens(0, 13, { label: '13 small cubes' }) + '</div><ol>' +
'<li>Count out 10 cubes and snap them together. Now we have 1 ten.</li><li>3 cubes are left over. That is 3 ones.</li><li>1 ten and 3 ones is ' + dig(13) + '.<div class="fig">' + blocks(13) + '</div></li></ol></div>' +
'<div class="key"><b class="t">Key idea</b><p>In ' + dig(34) + ', the <b class="dt">3</b> means 3 tens. The <b class="do">4</b> means 4 ones.</p></div>' +
'<div class="lab"><span class="lt">Try it: build a number</span>' + A.stepHtml('to1', 'Number', 34) +
'<div class="fig" id="tofig"></div><div class="out" id="toout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Ten more, ten less</h2>' +
'<p>On the number chart, going <b>down</b> one row is <b>ten more</b>. Going <b>up</b> one row is <b>ten less</b>.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + A.chart({ cls: { 4: 'b', 14: 'b', 24: 'c', 34: 'b', 44: 'b' }, label: 'Number chart with 4, 14, 24, 34, 44 marked in one column' }) + '</div><p>Ten more than 24 is 34. Ten less than 24 is 14. Only the tens digit changes. The ones digit stays 4.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>What is ten more than 18?</p><ol><li>18 is 1 ten and 8 ones.</li><li>Add one more ten: 2 tens and 8 ones.</li><li>That is <b>28</b>.</li></ol></div>' +
'<div class="lab"><span class="lt">Try it: jump by ten</span>' + A.stepHtml('tm1', 'Start number', 17) +
'<div class="btnrow"><button type="button" class="btn alt" id="tmup">Ten less</button><button type="button" class="btn alt" id="tmdn">Ten more</button></div>' +
'<div class="fig" id="tmfig"></div><div class="out" id="tmout" aria-live="polite"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Break numbers apart</h2>' +
'<p>A number can be split into two <b>parts</b>. The parts together make the <b>whole</b>. There are many ways to do it.</p>' +
'<div class="eg"><b class="t">Watch me</b>' + mat(9, 4) + '<p>9 is 4 and 5. It is also 6 and 3, or 8 and 1. Each way, the whole is still 9.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>25 is 2 tens and 5 ones. Let\'s split it.</p><ol><li>Take the tens apart from the ones: 20 and 5.</li><li>Or keep 1 ten and 15 ones: 10 and 15.</li><li>Both ways make 25: <span class="math">20 + 5 = 25</span> and <span class="math">10 + 15 = 25</span>.</li></ol></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>2 tens and 14 ones is not "214". Trade 10 of the ones for a ten: 3 tens and 4 ones. That is 34.</p></div>' +
'<div class="lab"><span class="lt">Try it: split a number</span>' + A.stepHtml('sp1', 'Whole', 10) + A.stepHtml('sp2', 'Red part', 3) +
'<div id="spfig"></div><div class="out" id="spout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Which is greater?</h2>' +
'<p>To compare two numbers, look at the <b>tens first</b>. More tens means a greater number. If the tens are the same, compare the ones.</p>' +
'<div class="eg"><b class="t">Watch me</b>' + pair(31, 28) + '<p>31 has 3 tens. 28 has 2 tens. 3 tens is more, so <b>31 is greater than 28</b>. It does not matter that 8 ones is more than 1 one.</p></div>' +
'<div class="wm"><b class="t">Do it with me</b><p>Which is greater, 45 or 42?</p><ol><li>Tens: 45 has 4 tens. 42 has 4 tens. The same.</li><li>Ones: 5 ones and 2 ones. 5 is more.</li><li>So <b>45 is greater than 42</b>.</li></ol></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>14 and 41 use the same digits, but they are not the same. 41 has 4 tens. 14 has only 1 ten. 41 is greater.</p></div>' +
'<div class="lab"><span class="lt">Try it: compare</span><div class="row2">' + A.stepHtml('cp1', 'First number', 23) + A.stepHtml('cp2', 'Second number', 32) + '</div>' +
'<div id="cpfig"></div><div class="out" id="cpout"></div></div>' +
'<div class="yt"></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Putting numbers in order</h2>' +
'<p>On a number line, numbers get <b>greater</b> as you go right. Putting numbers in order from <b>least to greatest</b> is like reading them from left to right.</p>' +
'<div class="eg"><b class="t">Watch me</b><div class="fig">' + A.draw.nl(0, 50, { ring: [12, 35, 27] }) + '</div><p>12 is furthest left, then 27, then 35. Least to greatest: <b>12, 27, 35</b>.</p></div>' +
'<div class="lab"><span class="lt">Try it: put them in order</span><div class="btnrow"><button type="button" class="btn" id="ordn">New numbers</button></div>' +
'<div class="fig" id="ordfig"></div><div class="out" id="ordout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>Least means the smallest. Greatest means the biggest.</p></div>' +
'<div class="yt"></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      A.stepper(root, 'to1', 0, 50, function (n) {
        $('#tofig', root).innerHTML = blocks(n);
        $('#toout', root).innerHTML = '<span class="big">' + dig(n) + '</span> = ' + pl(tn(n), 'ten') + ' and ' + pl(on(n), 'one') + '. We say "' + W(n) + '".';
      });
      var cur = 17;
      var tm = A.stepper(root, 'tm1', 1, 50, function (n) { cur = n; drawTm(''); });
      function drawTm(msg) {
        var c = {}; c[cur] = 'c';
        $('#tmfig', root).innerHTML = A.chart({ cls: c, label: 'Number chart with ' + cur + ' marked' });
        $('#tmout', root).innerHTML = msg || 'You are on <b>' + cur + '</b>: ' + pl(tn(cur), 'ten') + ' and ' + pl(on(cur), 'one') + '.';
        $('#tmup', root).disabled = cur - 10 < 1; $('#tmdn', root).disabled = cur + 10 > 50;
      }
      $('#tmup', root).addEventListener('click', function () { var f = cur; tm.set(cur - 10); drawTm('Ten less than ' + f + ' is <b>' + cur + '</b>. One row up.'); });
      $('#tmdn', root).addEventListener('click', function () { var f = cur; tm.set(cur + 10); drawTm('Ten more than ' + f + ' is <b>' + cur + '</b>. One row down.'); });
      var whole = 10, part = 3, s2;
      function drawSp() {
        part = Math.min(part, whole);
        $('#spfig', root).innerHTML = mat(whole, part);
        $('#spout', root).innerHTML = '<span class="math big">' + part + ' + ' + (whole - part) + ' = ' + whole + '</span>';
      }
      A.stepper(root, 'sp1', 2, 20, function (n) { whole = n; if (s2 && s2.get() > n) s2.set(n); drawSp(); });
      s2 = A.stepper(root, 'sp2', 0, 20, function (n) { if (n > whole) { s2.set(whole); return; } part = n; drawSp(); });
      var a = 23, b = 32;
      function drawCp() {
        $('#cpfig', root).innerHTML = pair(a, b);
        var why = tn(a) !== tn(b) ? 'Compare the tens: ' + tn(a) + ' tens and ' + tn(b) + ' tens.' : a === b ? '' : 'The tens are the same, so compare the ones: ' + on(a) + ' and ' + on(b) + '.';
        $('#cpout', root).innerHTML = (a === b ? '<b>' + a + ' and ' + b + ' are equal.</b> Same tens, same ones.' : '<b>' + a + ' is ' + (a > b ? 'greater' : 'less') + ' than ' + b + '.</b> ') + why;
      }
      A.stepper(root, 'cp1', 0, 50, function (n) { a = n; drawCp(); });
      A.stepper(root, 'cp2', 0, 50, function (n) { b = n; drawCp(); });
      function newOrd() {
        var nums = [];
        while (nums.length < 3) { var v = R.int(1, 50); if (nums.every(function (x) { return Math.abs(x - v) >= 4; })) nums.push(v); }
        var s = nums.slice().sort(function (x, y) { return x - y; });
        $('#ordfig', root).innerHTML = A.draw.nl(0, 50, { ring: nums });
        $('#ordout', root).innerHTML = 'The numbers: <b>' + nums.join(', ') + '</b>. <button type="button" class="btn alt" id="ords">Show the order</button>';
        $('#ords', root).addEventListener('click', function () { $('#ordout', root).innerHTML = 'The numbers: ' + nums.join(', ') + '.<br>Least to greatest: <span class="big">' + s.join(', ') + '</span>'; });
      }
      $('#ordn', root).addEventListener('click', newOrd);
      newOrd();
    },

    checks: [
      [function () { return qRead(1); }, function () { return qRead(2); }, function () { return qParts(1); }],
      [function () { return qTen(1); }, function () { return qTen(2); }, function () { return qTen(2); }],
      [function () { return qSplit(1); }, function () { return qSplit(2); }, function () { return qSplit(2); }],
      [function () { return qCompare(1); }, function () { return qCompare(2); }, function () { return qCompare(3); }],
      [function () { return qOrder(1); }, function () { return qOrder(2); }, function () { return qOrder(2); }]
    ],

    quiz: [
      { q: 'What number do these blocks show?', type: 'num', answer: 36, fig: blocks(36),
        hint: 'Count the rods by 10s, then count on the cubes.', explain: '3 tens and 6 ones: 36.' },
      { q: 'How many <b>tens</b> are in 47?', type: 'num', answer: 4,
        hint: 'The first digit tells the tens.', explain: '47 is 4 tens and 7 ones.' },
      { q: 'What is ten more than 25?', type: 'num', answer: 35,
        hint: 'Add one ten. The ones digit stays 5.', explain: '2 tens and 5 ones, plus 1 ten, is 3 tens and 5 ones: 35.' },
      { q: '<span class="math">16 = 10 + <b class="blank">?</b></span>', type: 'num', answer: 6,
        hint: '16 is 1 ten and some ones. How many ones?', explain: '16 is 10 and 6.' },
      { q: 'Which number is greater?', type: 'mc', options: ['29', '31'], answer: 1, fig: pair(29, 31),
        hint: 'Compare the tens first.', explain: '31 has 3 tens. 29 has only 2 tens. 31 is greater.' },
      { q: 'Which number has 2 tens and 14 ones?', type: 'mc', options: ['214', '34', '24', '16'], answer: 1,
        hint: 'Trade 10 of the ones for 1 more ten.', explain: '14 ones is 1 ten and 4 ones. So 2 tens and 14 ones is 3 tens and 4 ones: 34.' },
      { q: 'Which list goes from <b>least to greatest</b>?', type: 'mc', options: ['41, 14, 40', '14, 40, 41', '14, 41, 40', '40, 41, 14'], answer: 1, wide: true,
        hint: 'Find the number with the fewest tens first.', explain: '14 has 1 ten. 40 and 41 have 4 tens, and 40 has fewer ones. So: 14, 40, 41.' }
    ],

    practice: [
      { id: 't-read', name: 'Read tens and ones', code: 'B1.2', gen: qRead },
      { id: 't-parts', name: 'How many tens, how many ones', code: 'B1.2', gen: qParts },
      { id: 't-ten', name: 'Ten more, ten less', code: 'B1.2', gen: qTen },
      { id: 't-split', name: 'Missing part', code: 'B1.2', gen: qSplit },
      { id: 't-compare', name: 'Greater or less', code: 'B1.3', gen: qCompare },
      { id: 't-order', name: 'Put in order', code: 'B1.3', gen: qOrder }
    ]
  });

  /* ---------- More ways to ask (question shapes, see docs/QUESTIONS.md) ---------- */
  var G = window.G1, nm = A.Q ? A.Q.name : function () { return 'Ava'; };
  function numIn(lv) { return lv === 1 ? R.int(11, 19) : R.int(21, 49); }
  function tenOnes(n) { return pl(tn(n), 'ten') + ' and ' + pl(on(n), 'one'); }
  function three(lv, gap) {
    var v = [];
    while (v.length < 3) { var x = lv === 1 ? R.int(1, 20) : R.int(10, 50); if (v.every(function (y) { return Math.abs(y - x) >= (gap || 1); })) v.push(x); }
    return v;
  }
  var SHAPES = {
    't-read': [
      [1, 'build', function (lv) {
        var n = numIn(lv);
        return { q: 'Show <b>' + n + '</b> with base-ten blocks. Then press Check.', type: 'build', tool: 'base10', opts: { cols: ['t', 'o'] }, answer: n,
          hint: 'A rod is 10. A small cube is 1. ' + n + ' needs ' + pl(tn(n), 'rod') + '.', steps: [n + ' is ' + tenOnes(n) + '.', 'Add ' + pl(tn(n), 'rod') + ' and ' + pl(on(n), 'small cube') + '.'],
          explain: tenOnes(n) + ' make ' + n + '.', meta: { k: 'g1-read-build' } };
      }],
      [1, 'tap', function (lv) {
        var n = numIn(lv), alt = [on(n) * 10 + tn(n), n + 1, n - 1, n + 10, n - 10].filter(function (v) { return v !== n && v > 0 && v <= 50 && on(v) <= 9; }), set = R.shuffle([n].concat(alt.slice(0, 2)));
        return { q: 'Tap the blocks that show <b>' + n + '</b>.', type: 'tap', tiles: set.map(function (v) { return blocks(v); }), answer: set.indexOf(n), answerText: 'the blocks with ' + tenOnes(n),
          hint: 'Count the rods by 10s, then count on the small cubes.', steps: [n + ' is ' + tenOnes(n) + '.', 'Look for ' + pl(tn(n), 'rod') + ' and ' + pl(on(n), 'small cube') + '.'],
          explain: tenOnes(n) + ' make ' + n + '.', meta: { k: 'g1-read-tap' } };
      }],
      [1, 'match', function (lv) {
        var v = three(lv, 2);
        return { q: 'Match the blocks to their numbers.', type: 'match', pairs: v.map(function (x) { return [blocks(x), String(x)]; }),
          hint: 'Count the rods by 10s, then count on the small cubes.', steps: ['A rod is 10. A small cube is 1.'],
          explain: v.map(function (x) { return x + ' is ' + tenOnes(x); }).join('. ') + '.', meta: { k: 'g1-read-match' } };
      }],
      [2, 'mistake', function (lv) {
        var n; do { n = R.int(12, 49); } while (on(n) === 0 || on(n) === tn(n));
        var who = nm(), truth = !R.int(0, 2), said = truth ? n : on(n) * 10 + tn(n);
        var right = 'There ' + (tn(n) === 1 ? 'is 1 rod' : 'are ' + tn(n) + ' rods') + ' and ' + pl(on(n), 'small cube') + ', so the blocks show ' + n + '.';
        return G.tf(who + ' says these blocks show <b>' + said + '</b>. True or false: ' + who + ' is right.', truth, right,
          ['Count the small cubes first, then the rods.', 'Every block is worth 1.', 'Rods are worth 1 and cubes are worth 10.'], { k: 'g1-read-tf', said: said },
          { fig: blocks(n), hint: 'Count the rods by 10s first.' });
      }]
    ],
    't-parts': [
      [1, 'fill', function (lv) {
        var n = numIn(lv);
        return { q: 'Fill in the blanks.', type: 'fill', fill: '<span class="math">' + n + '</span> = [[]] tens and [[]] ones', answers: [tn(n), on(n)], fig: lv === 1 ? blocks(n) : '',
          hint: 'The first digit is the tens. The last digit is the ones.', steps: [n + ' is ' + tenOnes(n) + '.'],
          explain: n + ' = ' + tenOnes(n) + '.', meta: { k: 'g1-parts-fill' } };
      }],
      [1, 'build', function (lv) {
        var t = lv === 1 ? 1 : R.int(2, 4), o = R.int(1, 9);
        return { q: 'Build <b>' + pl(t, 'ten') + ' and ' + pl(o, 'one') + '</b>. Then press Check.', type: 'build', tool: 'base10', opts: { cols: ['t', 'o'] }, answer: t * 10 + o,
          hint: 'A ten is a rod. A one is a small cube.', steps: ['Add ' + pl(t, 'rod') + '.', 'Add ' + pl(o, 'small cube') + '.'],
          explain: pl(t, 'ten') + ' and ' + pl(o, 'one') + ' make ' + (t * 10 + o) + '.', meta: { k: 'g1-parts-build' } };
      }],
      [2, 'match', function (lv) {
        var v = three(lv, 1).map(function (x) { return x < 10 ? x + 10 : x; });
        if (new Set(v).size < 3) v = [14, 27, 41];
        return { q: 'Match each one to its number.', type: 'match', pairs: v.map(function (x) { return [tenOnes(x), String(x)]; }),
          hint: 'The tens give the first digit. The ones give the last digit.', steps: ['3 tens and 4 ones is 34.'],
          explain: v.map(function (x) { return tenOnes(x) + ' is ' + x; }).join('. ') + '.', meta: { k: 'g1-parts-match' } };
      }]
    ],
    't-ten': [
      [1, 'line', function (lv) {
        var n = lv === 1 ? R.int(1, 4) * 10 : R.int(11, 40), more = n <= 10 ? 1 : n > 40 ? 0 : R.int(0, 1), ans = more ? n + 10 : n - 10;
        return { q: 'Put the marker on <b>ten ' + (more ? 'more' : 'less') + '</b> than ' + n + '.', type: 'line', min: 0, max: 50, tick: 1, every: 10, snap: 1, answer: ans,
          hint: 'Ten ' + (more ? 'more' : 'less') + ' is one big jump ' + (more ? 'right' : 'left') + '.', steps: ['Start at ' + n + '.', 'Jump 10 ' + (more ? 'right' : 'left') + ': ' + ans + '.'],
          explain: 'Ten ' + (more ? 'more' : 'less') + ' than ' + n + ' is ' + ans + '.', meta: { k: 'g1-ten-line' } };
      }],
      [1, 'fill', function (lv) {
        var n = lv === 1 ? R.int(1, 3) * 10 + (R.int(0, 1) ? 0 : R.int(1, 9)) : R.int(11, 39);
        if (n < 11) n += 10;
        return { q: 'Fill in ten less and ten more.', type: 'fill', fill: '<span class="math">[[]] &larr; <b>' + n + '</b> &rarr; [[]]</span>', answers: [n - 10, n + 10],
          hint: 'Take away one ten. Then add one ten. The ones digit stays the same.', steps: ['Ten less than ' + n + ' is ' + (n - 10) + '.', 'Ten more than ' + n + ' is ' + (n + 10) + '.'],
          explain: (n - 10) + ', ' + n + ', ' + (n + 10) + '. The ones digit stays ' + on(n) + '.', meta: { k: 'g1-ten-fill' } };
      }],
      [2, 'story', function (lv) {
        var who = nm(), c = R.pick(['stickers', 'cards', 'beads']), n = R.int(11, 39), more = R.int(0, 1);
        var q = more ? who + ' has ' + n + ' ' + c + '. ' + who + ' gets a pack of 10 more. How many ' + c + ' now?' : who + ' has ' + n + ' ' + c + '. ' + who + ' gives a pack of 10 to a friend. How many ' + c + ' are left?';
        return { q: q, type: 'num', answer: more ? n + 10 : n - 10, hint: 'A pack of 10 is one ten.', steps: [(more ? 'Ten more' : 'Ten less') + ' than ' + n + '.', 'The ones digit stays ' + on(n) + '.'],
          explain: (more ? 'Ten more' : 'Ten less') + ' than ' + n + ' is ' + (more ? n + 10 : n - 10) + '.', meta: { k: 'g1-ten-story', more: more } };
      }]
    ],
    't-split': [
      [1, 'match', function (lv) {
        var whole = lv === 1 ? 10 : lv === 2 ? R.int(11, 20) : R.int(21, 30), as = [];
        while (as.length < 3) { var a = R.int(1, whole - 1); if (as.indexOf(a) < 0) as.push(a); }
        return { q: 'Each one makes <b>' + whole + '</b>. Match it to its missing part.', type: 'match', pairs: as.map(function (a) { return [a + ' + ?', String(whole - a)]; }),
          hint: 'Count on from the first number to ' + whole + '.', steps: ['For ' + as[0] + ' + ?, count on from ' + as[0] + ' to ' + whole + ': ' + (whole - as[0]) + '.'],
          explain: as.map(function (a) { return a + ' + ' + (whole - a) + ' = ' + whole; }).join('. ') + '.', meta: { k: 'g1-split-match', whole: whole } };
      }],
      [1, 'story', function (lv) {
        var who = nm(), c = R.pick([['apples', 'red', 'green'], ['socks', 'blue', 'white'], ['crayons', 'long', 'short'], ['boots', 'black', 'red']]);
        var whole = lv === 1 ? R.int(5, 10) : lv === 2 ? R.int(11, 20) : R.int(21, 40), a = lv === 3 ? R.int(1, 3) * 10 : R.int(1, whole - 1);
        if (a >= whole) a = 10;
        return { q: who + ' has ' + whole + ' ' + c[0] + '. ' + a + ' are ' + c[1] + '. The rest are ' + c[2] + '. How many are ' + c[2] + '?', type: 'num', answer: whole - a,
          hint: 'The whole is ' + whole + '. One part is ' + a + '. Find the other part.', steps: ['Start at ' + a + ' and count on to ' + whole + '.', 'That is ' + (whole - a) + '.'],
          explain: a + ' and ' + (whole - a) + ' make ' + whole + '.', meta: { k: 'g1-split-story' } };
      }],
      [2, 'pick', function (lv) {
        var whole = lv === 2 ? 10 : R.int(12, 20), opts = [], good = 0;
        while (opts.length < 5) {
          var a = R.int(1, whole - 1), ok = good < 3 && R.int(0, 1), b = ok ? whole - a : whole - a + R.pick([1, -1, 2]), t = a + ' + ' + b;
          if (b < 1 || opts.indexOf(t) >= 0 || (!ok && opts.length - good >= 3)) continue;
          opts.push(t); if (ok) good++;
        }
        if (!good) opts[0] = '5 + ' + (whole - 5);
        var ans = []; opts.forEach(function (t, j) { var p = t.split(' + '); if (+p[0] + +p[1] === whole) ans.push(j); });
        return { q: 'Pick every pair that makes <b>' + whole + '</b>.', type: 'pick', options: opts, answer: ans,
          hint: 'Add each pair. Does it make ' + whole + '?', steps: ['Count on from the first number in each pair.'],
          explain: ans.map(function (j) { return opts[j]; }).join(', ') + ' make ' + whole + '.', meta: { k: 'g1-split-pick', opts: opts } };
      }]
    ],
    't-compare': [
      [1, 'tap', function (lv) {
        var a = numIn(lv), b; do { b = numIn(lv); } while (b === a);
        var more = R.int(0, 1), ans = more ? Math.max(a, b) : Math.min(a, b), set = R.shuffle([a, b]);
        return { q: 'Tap the blocks that show the <b>' + (more ? 'greater' : 'lesser') + '</b> number.', type: 'tap', tiles: set.map(function (v) { return blocks(v); }), answer: set.indexOf(ans), answerText: 'the blocks for ' + ans,
          hint: 'Compare the rods first. More rods means a greater number.', steps: ['Count the rods in each picture.', tn(a) === tn(b) ? 'The rods are the same, so compare the small cubes.' : 'The one with more rods is greater.'],
          explain: Math.max(a, b) + ' is greater than ' + Math.min(a, b) + '.', meta: { k: 'g1-cmp-tap', more: more } };
      }],
      [1, 'mistake', function (lv) {
        var a, b; do { a = numIn(lv); b = numIn(lv); } while (a === b || (lv > 1 && tn(a) === tn(b)));
        var who = nm(), big = Math.max(a, b), small = Math.min(a, b), truth = !R.int(0, 2), x = truth ? big : small, y = truth ? small : big;
        var right = big + ' is greater than ' + small + (tn(a) !== tn(b) ? ', because it has more tens.' : ', because it has more ones.');
        return G.tf(who + ' says <b>' + x + '</b> is greater than <b>' + y + '</b>. True or false: ' + who + ' is right.', truth, right,
          ['The number with the bigger ones digit is always greater.', 'Numbers that start with 1 are always least.', 'They are the same size.'], { k: 'g1-cmp-tf', x: x, y: y },
          { fig: pair(x, y), hint: 'Compare the tens first.' });
      }],
      [2, 'pick', function (lv) {
        var x = R.int(15, 35), more = R.int(0, 1), opts = [], good = 0;
        while (opts.length < 5) {
          var v = R.int(Math.max(1, x - 15), Math.min(50, x + 15)), fits = more ? v > x : v < x;
          if (v === x || opts.indexOf(v) >= 0 || (fits && good >= 3) || (!fits && opts.length - good >= 3)) continue;
          opts.push(v); if (fits) good++;
        }
        var ans = []; opts.forEach(function (v, j) { if (more ? v > x : v < x) ans.push(j); });
        return { q: 'Pick every number <b>' + (more ? 'greater' : 'less') + '</b> than ' + x + '.', type: 'pick', options: opts.map(String), answer: ans,
          hint: 'Compare the tens first. If the tens are the same, compare the ones.', steps: ['Look at each number. Is it ' + (more ? 'greater' : 'less') + ' than ' + x + '?'],
          explain: ans.map(function (j) { return opts[j]; }).join(', ') + ' ' + (ans.length === 1 ? 'is ' : 'are ') + (more ? 'greater' : 'less') + ' than ' + x + '.', meta: { k: 'g1-cmp-pick', x: x, more: more, opts: opts } };
      }]
    ],
    't-order': [
      [1, 'order', function (lv) {
        var v = three(lv, 2), sorted = v.slice().sort(function (a, b) { return a - b; });
        if (lv > 1) { v.push(sorted[1] + 1 <= 50 && v.indexOf(sorted[1] + 1) < 0 ? sorted[1] + 1 : sorted[0] + 1); sorted = v.slice().sort(function (a, b) { return a - b; }); }
        return { q: 'Put the numbers in order from <b>least to greatest</b>.', type: 'order', items: sorted.map(String), first: 'least', last: 'greatest',
          hint: 'Find the number with the fewest tens first.', steps: ['Compare the tens. Then compare the ones.'],
          explain: sorted.join(', ') + '.', meta: { k: 'g1-order-up' } };
      }],
      [1, 'story', function (lv) {
        var names = A.Q ? A.Q.two() : ['Ava', 'Kai'], third = nm(); while (names.indexOf(third) >= 0) third = nm();
        names.push(third);
        var v = three(lv, 2), most = R.int(0, 1), c = R.pick(['apples', 'pine cones', 'shells', 'leaves']);
        var ans = v.indexOf(most ? Math.max.apply(null, v) : Math.min.apply(null, v)), o = R.mc(names[ans], names.filter(function (x, i) { return i !== ans; }));
        return { q: names.map(function (x, i) { return x + ' picked ' + v[i] + ' ' + c; }).join('. ') + '. Who picked the <b>' + (most ? 'most' : 'fewest') + '</b>?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Find the ' + (most ? 'greatest' : 'least') + ' number.', steps: ['Compare ' + v.join(', ') + '.', 'The ' + (most ? 'greatest' : 'least') + ' is ' + v[ans] + '.'],
          explain: names[ans] + ' picked ' + v[ans] + ', the ' + (most ? 'most' : 'fewest') + '.', meta: { k: 'g1-order-story', most: most, v: v, names: names } };
      }],
      [2, 'mistake', function (lv) {
        var t = R.int(1, 4), o; do { o = R.int(1, 9); } while (o === t || o * 10 + t > 50);
        var v = [t * 10 + o, o * 10 + t, o * 10], sorted = v.slice().sort(function (a, b) { return a - b; }), who = nm(), truth = !R.int(0, 2);
        var shown = truth ? sorted : [sorted[0], sorted[2], sorted[1]];
        if (!truth && shown.join() === sorted.join()) shown = [sorted[1], sorted[0], sorted[2]];
        var right = 'From least to greatest is ' + sorted.join(', ') + '. Compare the tens first, then the ones.';
        return G.tf(who + ' put these in order from least to greatest: <span class="math">' + shown.join(', ') + '</span>. True or false: ' + who + ' is right.', truth, right,
          ['Order the numbers by their ones digits.', 'Numbers that look alike are equal.', 'The first number is always the greatest.'], { k: 'g1-order-tf', shown: shown },
          { hint: 'Compare the tens first.' });
      }]
    ]
  };
  Atlas.Q.shapes(CH, SHAPES);
})();
