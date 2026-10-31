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

  A.register('tens-ones', {
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
})();
