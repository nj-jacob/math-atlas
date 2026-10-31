(function () {
  var A = Atlas, R = A.R, D = A.draw;
  var ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function words(n) {
    if (n === 0) return 'zero';
    var s = '';
    if (n >= 100) { s = ones[Math.floor(n / 100)] + ' hundred'; n %= 100; if (n) s += ' '; }
    if (n >= 20) { s += tens[Math.floor(n / 10)]; if (n % 10) s += '-' + ones[n % 10]; }
    else if (n > 0) s += ones[n];
    return s;
  }
  A.words = words;
  function hto(n) { return [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10]; }
  function pl(k, one, many) { return k + ' ' + (k === 1 ? one : many); }
  function htoWords(n) { var d = hto(n); return pl(d[0], 'hundred', 'hundreds') + ', ' + pl(d[1], 'ten', 'tens') + ', ' + pl(d[2], 'one', 'ones'); }
  /* hundreds, tens, ones table with coloured headings */
  function table(n, hl) {
    var d = hto(n), names = ['Hundreds', 'Tens', 'Ones'], h = '<div class="pvt" role="img" aria-label="' + htoWords(n) + '">';
    for (var i = 0; i < 3; i++) h += '<div' + (i === hl ? ' class="on"' : '') + '><span class="h c' + (2 - i) + '">' + names[i] + '</span><span class="d c' + (2 - i) + 't">' + d[i] + '</span></div>';
    return h + '</div>';
  }
  function expanded(n) {
    var d = hto(n), parts = [];
    if (d[0]) parts.push('<b class="c2t">' + d[0] * 100 + '</b>');
    if (d[1]) parts.push('<b class="c1t">' + d[1] * 10 + '</b>');
    if (d[2]) parts.push('<b class="c0t">' + d[2] + '</b>');
    return parts.join(' + ') || '0';
  }
  /* 1 hundred = 10 tens = 100 ones */
  function same100() {
    var s = '', u = 8;
    s += D.base10(1, 0, 0, { u: u }).replace(/<svg[^>]*>|<\/svg>/g, '');
    var t = D.base10(0, 10, 0, { u: u }).replace(/<svg[^>]*>|<\/svg>/g, '');
    s += '<g transform="translate(118,0)">' + t + '</g>';
    var o = '';
    for (var i = 0; i < 100; i++) o += D.rr(340 + (i % 10) * 8.6, 4 + Math.floor(i / 10) * 8.6, 7, 7, 1.5, 'var(--p0)', 'stroke="rgba(0,0,0,.35)" stroke-width="1"');
    s += o;
    s += '<text x="44" y="112" text-anchor="middle" font-size="15" class="tb">1 hundred</text><text x="196" y="112" text-anchor="middle" font-size="15" class="tb">10 tens</text><text x="382" y="112" text-anchor="middle" font-size="15" class="tb">100 ones</text>';
    s += '<text x="98" y="52" text-anchor="middle" font-size="26" class="tb">=</text><text x="316" y="52" text-anchor="middle" font-size="26" class="tb">=</text>';
    return A.svg(440, 120, s, '1 hundred flat is the same as 10 ten rods, which is the same as 100 one cubes');
  }
  /* dots scattered on a grid, with a seed so a picture stays the same */
  function rng(seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }
  function scatter(n, seed, group) {
    var W = 520, H = 230, cols = 26, rows = 11, cw = W / cols, ch = H / rows, cells = [], rnd = rng(seed), s = '';
    for (var i = 0; i < cols * rows; i++) cells.push(i);
    for (var j = cells.length - 1; j > 0; j--) { var k = Math.floor(rnd() * (j + 1)), t = cells[j]; cells[j] = cells[k]; cells[k] = t; }
    var pick = cells.slice(0, n);
    if (group) pick.sort(function (a, b) { return (a % cols) - (b % cols) || a - b; });
    pick.forEach(function (c, i) {
      var x = (c % cols) * cw + cw / 2 + (rnd() - 0.5) * cw * 0.4, y = Math.floor(c / cols) * ch + ch / 2 + (rnd() - 0.5) * ch * 0.4;
      var g = Math.floor(i / 10), full = Math.floor(n / 10);
      var col = group ? (g < full ? (g % 2 ? 'var(--p1)' : 'var(--strand)') : 'var(--p0)') : 'var(--strand)';
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="6.5" style="fill:' + col + '" stroke="rgba(0,0,0,.4)" stroke-width="1"/>';
    });
    return A.svg(W, H, '<rect x="1" y="1" width="' + (W - 2) + '" height="' + (H - 2) + '" rx="14" style="fill:var(--card);stroke:var(--line)" stroke-width="2"/>' + s,
      group ? n + ' dots, coloured in groups of ten: ' + Math.floor(n / 10) + ' tens and ' + n % 10 + ' left over' : 'A picture of many dots');
  }
  /* the same number of dots lined up in rows of ten, with the running count at the end of each row */
  function rows10(n) {
    var r = 7, g = 19, s = '', per = n > 100 ? 2 : 1, blockW = 10 * g + 70;
    for (var i = 0; i < n; i++) {
      var row = Math.floor(i / 10), blk = Math.floor(row / 10), rr = row % 10, c = i % 10;
      var x = 14 + blk * blockW + c * g + (c >= 5 ? 6 : 0), y = 14 + rr * g;
      s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" style="fill:' + (row * 10 + 10 <= n ? (row % 2 ? 'var(--p1)' : 'var(--strand)') : 'var(--p0)') + '" stroke="rgba(0,0,0,.4)" stroke-width="1"/>';
      if (c === 9 || i === n - 1) s += '<text x="' + (x + 16) + '" y="' + (y + 6) + '" font-size="17" font-weight="700">' + (i + 1) + '</text>';
    }
    var rowsUsed = Math.min(10, Math.ceil(n / 10));
    return A.svg(per * blockW, rowsUsed * g + 12, s, n + ' dots in rows of ten: ' + Math.floor(n / 10) + ' full rows and ' + n % 10 + ' more');
  }
  /* pairs: items in two rows so partners line up */
  function pairs(n, kind) {
    var r = 12, gap = 32, s = '', cols = Math.ceil(n / 2);
    for (var i = 0; i < n; i++) {
      var c = Math.floor(i / 2), row = i % 2, x = 20 + c * gap, y = 20 + row * gap;
      s += A.THING[kind || 'cube'](x, y, r, row ? 'var(--p1)' : 'var(--strand)');
    }
    if (n % 2) s += '<circle cx="' + (20 + (cols - 1) * gap) + '" cy="' + (20 + gap) + '" r="' + (r + 2) + '" fill="none" style="stroke:var(--bad)" stroke-width="2.5" stroke-dasharray="4 3"/>';
    return A.svg(Math.max(60, cols * gap + 10), 2 * gap + 10, s, n + ' blocks in pairs. ' + (n % 2 ? 'One has no partner, so ' + n + ' is odd.' : 'Every block has a partner, so ' + n + ' is even.'));
  }

  function blocksQ(lv) {
    var h, t, o;
    if (lv === 1) { h = 0; t = R.int(1, 9); o = R.int(0, 9); }
    else if (lv === 2) { h = 1; t = R.int(0, 9); o = R.int(0, 9); if (R.int(0, 4) === 0) h = 2, t = 0, o = 0; }
    else { h = R.int(0, 1); t = R.int(2, 9); o = R.int(10, 15); }
    var n = h * 100 + t * 10 + o;
    var lab = (h ? pl(h, 'hundred flat', 'hundred flats') + ', ' : '') + pl(t, 'ten rod', 'ten rods') + ' and ' + pl(o, 'one cube', 'one cubes');
    return { q: 'What number do these blocks show?' + (lv === 3 ? ' Watch the ones.' : ''), type: 'num', answer: n, fig: D.base10(h, t, o, { label: lab }),
      hint: lv === 3 ? 'There are ' + o + ' ones. Ten ones make one more ten.' : 'Count by tens for the rods first: 10, 20, 30 and so on. Then count on the ones.',
      steps: [(h ? 'The flat is 100. ' : '') + 'Count the rods by tens: ' + (function () { var a = []; for (var i = 1; i <= t; i++) a.push(h * 100 + i * 10); return a.join(', '); })() + '.',
        'Count on the ' + o + ' ones' + (lv === 3 ? ' (that is 1 ten and ' + (o - 10) + ' more)' : '') + '.', 'The blocks show ' + n + '.'],
      explain: lab + ' make ' + n + '.' };
  }

  /* ---------- Lessons: one concept per screen ---------- */
  var M = window.Manip;
  function T(k) { return function () { return A.chapters['numbers-200'].turns[k](); }; }
  function P(id, lv) { return function () { var s = A.chapters['numbers-200'].practice.filter(function (x) { return x.id === id; })[0]; return s.gen(typeof lv === 'function' ? lv() : lv); }; }
  /* two tools side by side that act as one, for comparing */
  function pair(el, make) {
    el.innerHTML = '<div class="vrow ls-pair"><figure><figcaption class="pa"></figcaption><div></div></figure><figure><figcaption class="pb"></figcaption><div></div></figure></div>';
    var hosts = A.$$('.ls-pair>figure>div', el), a = make(hosts[0], 0), b = make(hosts[1], 1);
    var t = { root: el, a: a, b: b, cap: function (x, y) { A.$('.pa', el).textContent = x; A.$('.pb', el).textContent = y; },
      reset: function () { a.reset(); b.reset(); t.cap('', ''); } };
    Object.defineProperty(t, 'fast', { get: function () { return a.fast; }, set: function (v) { a.fast = b.fast = v; } });
    return t;
  }
  function wordsHtml(n) { return '"' + words(n) + '"'; }

  var LESSONS = [
    { id: 'tens', title: 'Tens and ones', sub: 'Group by ten to count faster.', concepts: [
      { id: 'ten', title: 'Ten ones make one ten', exp: ['B1.1'], skill: 'n2-blocks',
        body: '<p>Counting one by one takes a long time. When we have <b>10 ones</b>, we can put them together to make <b>1 ten</b>.</p>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'], words: words }, steps: [
          { say: 'Here are some one cubes. Each cube is worth 1.', act: function (t) { return t.add('o', 7, 140); } },
          { say: 'Three more: 8, 9, 10. Now there are 10 ones.', act: function (t) { return t.add('o', 3, 380); } },
          { say: 'Count them: 1, 2, 3, all the way to 10.', act: function (t) { return t.countAll(230); }, ms: 700 },
          { say: 'Ten ones slide together to make <b>1 ten</b>.', act: function (t) { return t.group('o'); } },
          { say: '1 ten is the same amount as 10 ones. It is just faster to count.', act: function (t) { return t.lightKind('t'); }, ms: 1600 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true, words: words }, tasks: [
          { do: 'Tap <b>+ 1</b> until you have 10 ones. Then press <b>Group 10 ones</b>.', goal: function (s) { return s.t >= 1; }, yes: 'Yes. 10 ones became 1 ten.' },
          { do: 'Now make <b>2 tens and 3 ones</b>. You can use + 10 or group ones.', goal: function (s) { return s.t === 2 && s.o === 3; }, yes: function (s) { return 'Yes. 2 tens and 3 ones make 23.'; } },
          { do: 'Press <b>Break a ten</b>. Watch 1 ten turn back into 10 ones.', setup: function (t) { t.set(0, 3, 0); }, reset: false, goal: function (s) { return s.last === 'split-t'; }, yes: 'Yes. A ten can always be broken into 10 ones.' }
        ] },
        key: '<p><b>10 ones = 1 ten.</b> A ten rod is 10 cubes stuck together.</p>',
        check: [function () {
          var o = R.mc('10', ['1', '5', '100']);
          return { q: 'How many ones make 1 ten?', type: 'mc', options: o.options, answer: o.answer, fig: D.base10(0, 1, 0, {}), hint: 'Count the small squares on the rod.', explain: 'A ten rod is 10 ones stuck together.' };
        }, function () {
          var t = R.int(2, 6);
          return { q: 'How many ones are in ' + t + ' tens?', type: 'num', answer: t * 10, fig: D.base10(0, t, 0, {}), hint: 'Each rod is 10. Count by tens: 10, 20, 30...', explain: t + ' tens are ' + t * 10 + ' ones.' };
        }] },

      { id: 'count', title: 'Count the tens, then the ones', exp: ['B1.1', 'B1.4'], skill: 'n2-blocks',
        body: '<p>To count blocks, start with the <b>tens</b>: 10, 20, 30. Then keep going with the <b>ones</b>: 31, 32, 33.</p>',
        watch: { tool: 'base10', opts: { cols: ['t', 'o'], t: 4, o: 3 }, steps: [
          { say: 'How many blocks? Start with the tens.', ms: 900 },
          { say: 'Count by tens: 10, 20, 30, 40.', act: function (t) { return t.lightKind('t', 650); } },
          { say: 'Then count on the ones: 41, 42, 43.', act: function (t) { return t.lightKind('o', 650); } },
          { say: '4 tens and 3 ones make <b>43</b>.', ms: 1800 }
        ] },
        try: { tool: 'base10', opts: { cols: ['t', 'o'], controls: true, t: 5, o: 6 }, tasks: [
          { do: '<b>Tap each block</b> to count it. Start with the tens. Each block lights up and shows the count.', reset: false, goal: function (s) { return s.allLit; }, yes: 'You counted them all: 56.' },
          { do: 'Make <b>68</b> with the blocks.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 68 && s.o < 10; }, yes: '6 tens and 8 ones make 68.' },
          { do: 'Make <b>90</b>. How many ones do you need?', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 90 && s.o === 0; }, yes: '9 tens and 0 ones make 90.' }
        ] },
        mistake: '<p>Counting a ten rod as 1. A rod is worth <b>10</b>, so count rods by tens.</p>',
        check: T('read') },

      { id: 'hundred', title: 'Ten tens make one hundred', exp: ['B1.1'], skill: 'n2-place',
        body: '<p>When we have <b>10 tens</b>, we can put them together to make <b>1 hundred</b>. A hundred flat is 10 rods side by side.</p><div class="fig">' + same100() + '</div>',
        watch: { tool: 'base10', opts: { t: 8, words: words }, steps: [
          { say: 'Here are 8 tens: 80.', act: function (t) { return t.countAll(260); }, ms: 600 },
          { say: 'Add 2 more tens: 90, 100. Now there are 10 tens.', act: function (t) { t.clearLit(); return t.add('t', 2, 450); } },
          { say: 'Count by tens to check: 10, 20, 30 ... 100.', act: function (t) { return t.countAll(220); }, ms: 500 },
          { say: 'Ten tens slide together to make <b>1 hundred</b>.', act: function (t) { return t.group('t'); } },
          { say: '1 hundred = 10 tens = 100 ones.', act: function (t) { return t.pulseCol('h'); }, ms: 1600 }
        ] },
        try: { tool: 'base10', opts: { controls: true, t: 7 }, tasks: [
          { do: 'Add tens until you have 10 tens. Then press <b>Group 10 tens</b>.', goal: function (s) { return s.h >= 1; }, yes: 'Yes. 10 tens became 1 hundred.' },
          { do: 'Break the hundred back into tens. How many tens do you get?', goal: function (s) { return s.last === 'split-h'; }, reset: false, yes: function (s) { return 'You get 10 tens. It is still 100.'; } }
        ] },
        key: '<p><b>1 hundred = 10 tens = 100 ones.</b></p>',
        check: [function () {
          var o = R.mc('10', ['100', '1', '20']);
          return { q: 'How many tens make 1 hundred?', type: 'mc', options: o.options, answer: o.answer, hint: 'A hundred flat is made of rods. Count the rods.', explain: '10 tens make 1 hundred.' };
        }, function () {
          var t = R.int(10, 19);
          return { q: t + ' tens is how much?', type: 'num', answer: t * 10, hint: '10 tens make 100. Then count on the other tens.', explain: '10 tens is 100, and ' + (t - 10) + ' more tens is ' + (t - 10) * 10 + '. So ' + t + ' tens is ' + t * 10 + '.', steps: ['10 tens = 100.', (t - 10) + ' tens = ' + (t - 10) * 10 + '.', '100 + ' + (t - 10) * 10 + ' = ' + t * 10 + '.'] };
        }] },

      { id: 'build', title: 'Build numbers to 200', exp: ['B1.1'], skill: 'n2-blocks',
        body: '<p>Every number to 200 can be built from <b>hundreds</b>, <b>tens</b> and <b>ones</b>. The place value chart shows how many of each.</p>',
        watch: { tool: 'base10', opts: { words: words }, steps: [
          { say: 'Let\'s build 147. First, 1 hundred.', act: function (t) { return t.add('h', 1); } },
          { say: 'Then 4 tens: 110, 120, 130, 140.', act: function (t) { return t.add('t', 4, 420); } },
          { say: 'Then 7 ones: 141 up to 147.', act: function (t) { return t.add('o', 7, 260); } },
          { say: 'Count it all to check.', act: function (t) { return t.countAll(260); } },
          { say: '1 hundred, 4 tens and 7 ones. We write <b>147</b> and say "one hundred forty-seven".', ms: 2000 }
        ] },
        try: { tool: 'base10', opts: { controls: true, words: words }, tasks: [
          { do: 'Build <b>125</b>.', goal: function (s) { return s.value === 125 && s.o < 10 && s.t < 10; }, yes: '1 hundred, 2 tens and 5 ones make 125.' },
          { do: 'Build <b>163</b>.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 163 && s.o < 10 && s.t < 10; }, yes: '1 hundred, 6 tens and 3 ones make 163.' },
          { do: 'Build <b>200</b> using the fewest blocks.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 200 && s.pieces === 2; }, yes: '2 hundreds make 200.' }
        ] },
        check: [function () { return blocksQ(2); }, P('n2-place', 2)] },

      { id: 'zero', title: 'Zero holds a place', exp: ['B1.1'], skill: 'n2-words', hard: true,
        body: '<p>Sometimes a place is empty. In <b>107</b> there are no tens. We still write a <b>0</b> in the tens place, so the 1 stays in the hundreds place.</p>' + table(107, 1),
        watch: { tool: 'base10', opts: { words: words }, steps: [
          { say: 'Let\'s build one hundred seven. First, 1 hundred.', act: function (t) { return t.add('h', 1); } },
          { say: 'How many tens? None. The tens column stays empty.', act: function (t) { return t.pulseCol('t'); } },
          { say: 'Then 7 ones.', act: function (t) { return t.add('o', 7, 220); } },
          { say: 'The chart shows 1 hundred, <b>0</b> tens, 7 ones. We write <b>107</b>, not 17 and not 1007.', ms: 2400 }
        ] },
        ways: [
          { label: 'With money', html: '<p>Use bills and coins like blocks: a $100 bill is a hundred, a $10 bill is a ten, a $1 coin (a loonie) is a one.</p>' +
            '<div class="vs ls-money"><div><p><b>$107</b></p><p>' + M.cashHtml(10000) + ' ' + '<span class="t2">no $10 bills</span> ' + [1, 2, 3, 4, 5, 6, 7].map(function () { return M.cashHtml(100); }).join('') + '</p></div>' +
            '<div><p><b>$17</b></p><p>' + M.cashHtml(1000) + ' ' + [1, 2, 3, 4, 5, 6, 7].map(function () { return M.cashHtml(100); }).join('') + '</p></div></div><p>$107 and $17 are very different amounts. The 0 in 107 tells us there are no $10 bills.</p>' },
          { label: 'Say it, then write it', html: '<p>Say the number in parts, and write one digit for each place.</p><div class="tbl"><table><thead><tr><th>We say</th><th>Hundreds</th><th>Tens</th><th>Ones</th><th>We write</th></tr></thead><tbody>' +
            [[105, 'one hundred five'], [150, 'one hundred fifty'], [110, 'one hundred ten'], [101, 'one hundred one']].map(function (r) { var d = hto(r[0]); return '<tr><td>' + r[1] + '</td><td class="c2t"><b>' + d[0] + '</b></td><td class="c1t"><b>' + d[1] + '</b></td><td class="c0t"><b>' + d[2] + '</b></td><td><b>' + r[0] + '</b></td></tr>'; }).join('') +
            '</tbody></table></div><p>Every number from 100 to 199 has <b>three digits</b>. If a place is empty, it gets a 0.</p>' },
          { label: 'Count the digits', html: '<p>Is the number bigger than 99? Then it needs <b>3 digits</b>: hundreds, tens, ones.</p><p><span class="math big">1 _ 7</span> &nbsp; The middle spot is the tens. No tens? Write 0: <span class="math big">107</span>.</p><p>"1007" has 4 digits. That would mean one <b>thousand</b> seven, a much bigger number.</p>' }
        ],
        try: { tool: 'base10', opts: { controls: true, words: words }, tasks: [
          { do: 'Build <b>105</b>.', goal: function (s) { return s.value === 105 && s.o < 10; }, yes: '1 hundred, 0 tens, 5 ones: 105.' },
          { do: 'Build <b>150</b>.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 150 && s.t < 10; }, yes: '1 hundred, 5 tens, 0 ones: 150.' },
          { do: 'Build <b>one hundred nine</b>.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 109 && s.o < 10; }, yes: 'One hundred nine is 109.' }
        ] },
        mistake: '<p>Writing "one hundred seven" as <b>1007</b> or <b>17</b>. It is 1 hundred, 0 tens, 7 ones: <b>107</b>.</p>',
        check: [function () {
          var n = 100 + R.int(1, 9), o = R.mc(String(n), [String(n - 90), '100' + (n - 100), String(100 + (n - 100) * 10)]);
          return { q: 'Which number is <b>' + words(n) + '</b>?', type: 'mc', options: o.options, answer: o.answer, hint: '1 hundred, 0 tens and some ones. The 0 holds the tens place.', explain: words(n) + ' is ' + n + '.', fig: '' };
        }, function () {
          var t = R.pick([0, R.int(1, 9)]), o = t ? 0 : R.int(1, 9), n = 100 + t * 10 + o;
          return { q: 'Write the number for 1 hundred, ' + t + ' tens and ' + o + ' ones.', type: 'num', answer: n, hint: 'Write one digit for each place. An empty place gets a 0.', explain: '1 hundred, ' + t + ' tens, ' + o + ' ones is ' + n + '.', steps: ['Hundreds: 1.', 'Tens: ' + t + '.', 'Ones: ' + o + '.', 'Together: ' + n + '.'] };
        }] },

      { id: 'ways', title: 'One number, many ways', exp: ['B1.1'], skill: 'n2-place', hard: true,
        body: '<p>We can trade blocks and the number stays the same. <b>134</b> is 1 hundred, 3 tens and 4 ones. It is also <b>13 tens and 4 ones</b>, or <b>12 tens and 14 ones</b>.</p>',
        watch: { tool: 'base10', opts: { h: 1, t: 3, o: 4 }, steps: [
          { say: 'This is 134: 1 hundred, 3 tens, 4 ones.', ms: 1400 },
          { say: 'Break the hundred into 10 tens.', act: function (t) { return t.split('h'); } },
          { say: 'Now there are 13 tens and 4 ones. Still 134.', act: function (t) { return t.countAll(150); }, ms: 900 },
          { say: 'Break one ten into 10 ones.', act: function (t) { t.clearLit(); return t.split('t'); } },
          { say: '12 tens and 14 ones. The blocks moved, but it is still <b>134</b>.', ms: 2200 }
        ] },
        ways: [
          { label: 'With money', html: '<p>A $100 bill buys the same as ten $10 bills. Trading does not change how much money you have.</p><p>' + M.cashHtml(10000) + ' &nbsp;=&nbsp; ' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function () { return M.cashHtml(1000); }).join(' ') + '</p>' },
          { label: 'With numbers', html: '<p>Each way adds up to the same number.</p><p class="math">100 + 30 + 4 = <b>134</b></p><p class="math">130 + 4 = <b>134</b></p><p class="math">120 + 14 = <b>134</b></p>' }
        ],
        try: { tool: 'base10', opts: { controls: true, h: 1, t: 3, o: 4 }, tasks: [
          { do: 'Show <b>134</b> with <b>no hundred flat</b>. Use Break.', goal: function (s) { return s.value === 134 && s.h === 0; }, yes: '13 tens and 4 ones is still 134.' },
          { do: 'Show <b>52</b> with <b>more than 9 ones</b>.', setup: function (t) { t.set(0, 5, 2); }, reset: false, goal: function (s) { return s.value === 52 && s.o > 9; }, yes: function (s) { return s.t + ' tens and ' + s.o + ' ones is still 52.'; } }
        ] },
        key: '<p>Trading 1 ten for 10 ones (or 1 hundred for 10 tens) <b>does not change the number</b>.</p>',
        check: [function () {
          var n = R.int(11, 19) * 10 + R.int(1, 9), d = hto(n), tt = d[0] * 10 + d[1];
          var o = R.mc(tt + ' tens and ' + d[2] + ' ones', [d[1] + ' tens and ' + d[2] + ' ones', d[0] + ' ten and ' + (d[1] * 10 + d[2]) + ' ones', tt + ' tens and ' + (d[2] + 10) + ' ones']);
          return { q: 'Which is another way to show <span class="math big">' + n + '</span>?', type: 'mc', options: o.options, answer: o.answer, hint: 'Break the hundred into 10 tens. How many tens is that altogether?', explain: '1 hundred is 10 tens, so ' + n + ' is ' + tt + ' tens and ' + d[2] + ' ones.' };
        }, function () {
          var t = R.int(2, 8), o = R.int(11, 18);
          return { q: 'What number is <b>' + t + ' tens and ' + o + ' ones</b>?', type: 'num', answer: t * 10 + o, fig: D.base10(0, t, o, {}), hint: 'Group 10 of the ones into a ten first.', explain: t + ' tens is ' + t * 10 + ', plus ' + o + ' ones is ' + (t * 10 + o) + '.', steps: ['10 of the ' + o + ' ones make 1 more ten.', 'That is ' + (t + 1) + ' tens and ' + (o - 10) + ' ones.', 'The number is ' + (t * 10 + o) + '.'] };
        }] }
    ] },

    { id: 'read', title: 'Read and write numbers', sub: 'Words, digits and parts.', concepts: [
      { id: 'words', title: 'Number words', exp: ['B1.1'], skill: 'n2-words',
        body: '<p>To say a number from 100 to 200, say the <b>hundred</b> first, then the rest. 147 is "one hundred" and "forty-seven".</p>',
        watch: { tool: 'base10', opts: { words: words }, steps: [
          { say: 'Build 120: 1 hundred and 2 tens.', act: function (t) { return t.set(1, 2, 0); } },
          { say: 'We say "one hundred twenty".', act: function (t) { return t.countAll(400); }, ms: 900 },
          { say: 'Add 6 ones.', act: function (t) { t.clearLit(); return t.add('o', 6, 200); } },
          { say: 'Now it is 126: "one hundred twenty-six". The word "and" is not needed.', ms: 2200 }
        ] },
        try: { tool: 'base10', opts: { controls: true, words: words }, tasks: [
          { do: 'Build <b>one hundred twenty</b>.', goal: function (s) { return s.value === 120 && s.t < 10; }, yes: 'One hundred twenty is 120.' },
          { do: 'Build <b>one hundred two</b>.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 102 && s.o < 10; }, yes: 'One hundred two is 102.' },
          { do: 'Build <b>eighty-five</b>.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 85 && s.o < 10; }, yes: 'Eighty-five is 85.' }
        ] },
        check: P('n2-words', function () { return R.pick([1, 2]); }) },

      { id: 'expanded', title: 'Show the value of each digit', exp: ['B1.1'], skill: 'n2-place',
        body: '<p>We can split a number into what each digit is worth: <span class="math"><b class="c2t">100</b> + <b class="c1t">40</b> + <b class="c0t">7</b> = 147</span>. The 4 is worth 40 because it is in the tens place.</p>',
        watch: { tool: 'base10', opts: { expanded: true }, steps: [
          { say: 'Here is 163.', act: function (t) { return t.set(1, 6, 3); } },
          { say: 'The 1 is worth 100.', act: function (t) { return t.lightKind('h'); } },
          { say: 'The 6 is worth 60: 6 tens.', act: function (t) { return t.lightKind('t', 260); } },
          { say: 'The 3 is worth 3.', act: function (t) { return t.lightKind('o', 260); } },
          { say: '163 = 100 + 60 + 3.', ms: 2000 }
        ] },
        try: { tool: 'base10', opts: { controls: true, expanded: true }, tasks: [
          { do: 'Build <span class="math">100 + 60 + 3</span>.', goal: function (s) { return s.value === 163 && s.t < 10 && s.o < 10; }, yes: '100 + 60 + 3 = 163.' },
          { do: 'Build <span class="math">100 + 8</span>.', setup: function (t) { t.set(0, 0, 0); }, reset: false, goal: function (s) { return s.value === 108; }, yes: '100 + 8 = 108. No tens.' }
        ] },
        check: [P('n2-place', 1), P('n2-place', 2)] },

      { id: 'uses', title: 'Numbers all around us', exp: ['B1.1'], skill: 'n2-words',
        body: '<p>Numbers do different jobs. Some <b>count</b> (150 pages). Some <b>put things in order</b> (day 100 of school). Some are <b>names</b> (bus 120). Some <b>measure</b> (120 cm tall).</p>',
        try: { mount: function (host, done) {
          var items = [['A book with 150 pages', 0], ['The 100th day of school', 1], ['Bus number 120', 2], ['A plant 35 cm tall', 3], ['34 children in a gym', 0], ['Room 108', 2]];
          var jobs = ['counts', 'puts in order', 'is a name', 'measures'], k = 0, right = 0;
          function show() {
            var it = items[k];
            host.innerHTML = '<p class="qtext"><b>' + it[0] + '.</b> What does the number do?</p><div class="opts">' + jobs.map(function (j, i) { return '<button type="button" class="opt" data-j="' + i + '">It ' + j + '</button>'; }).join('') + '</div><p class="fb" aria-live="polite"></p>';
            A.$$('.opt', host).forEach(function (b) {
              b.addEventListener('click', function () {
                var j = +b.getAttribute('data-j'), fb = A.$('.fb', host);
                if (j !== it[1]) { b.classList.add('no'); b.disabled = true; fb.className = 'fb bad'; fb.textContent = 'Not this one. Think: is it how many, which one in a line, a label, or how long?'; return; }
                b.classList.add('yes'); right++;
                A.$$('.opt', host).forEach(function (x) { x.disabled = true; });
                fb.className = 'fb ok'; fb.textContent = 'Yes, it ' + jobs[j] + '.';
                setTimeout(function () { k++; if (k < items.length) show(); else { host.innerHTML = '<p>You sorted all ' + items.length + '.</p>'; done('All sorted.'); } }, 900);
              });
            });
          }
          show();
        }, do: 'Sort each number by the job it does.' },
        check: function () {
          var it = R.pick([['the number of stickers on a page', 'counts'], ['the number on a hockey jersey', 'is a name'], ['finishing 3rd in a race', 'puts in order'], ['a fish 25 cm long', 'measures']]);
          var opts = ['counts', 'puts in order', 'is a name', 'measures'], o = R.mc(it[1], opts.filter(function (x) { return x !== it[1]; }));
          return { q: 'Think about ' + it[0] + '. What does that number do?', type: 'mc', options: o.options.map(function (x) { return 'It ' + x; }), answer: o.answer, hint: 'Is it how many, which place in a line, a label, or how long?', explain: 'That number ' + it[1] + '.' };
        } }
    ] },

    { id: 'compare', title: 'Compare and order', sub: 'Which is greater? Which comes first?', concepts: [
      { id: 'greater', title: 'Which number is greater?', exp: ['B1.2'], skill: 'n2-compare', hard: true,
        body: '<p>To compare two numbers, look at the <b>biggest place first</b>. Compare the hundreds. If they are the same, compare the tens. If those are the same too, compare the ones.</p>',
        watch: { mount: function (el) { return pair(el, function (h) { return M.base10(h, { tap: false, readout: false, u: 9 }); }); }, steps: [
          { say: 'Which is greater, 126 or 162?', act: function (t) { t.cap('126', '162'); return Promise.all([t.a.set(1, 2, 6), t.b.set(1, 6, 2)]); } },
          { say: 'Hundreds first. Both have 1 hundred. Same.', act: function (t) { return Promise.all([t.a.lightKind('h'), t.b.lightKind('h')]); } },
          { say: 'Now the tens: 2 tens and 6 tens.', act: function (t) { return Promise.all([t.a.lightKind('t', 300), t.b.lightKind('t', 300)]); } },
          { say: '6 tens is more than 2 tens. So <b>162 is greater</b>. We do not need to look at the ones.', ms: 2400 }
        ] },
        ways: [
          { label: 'On a number line', html: '<p>On a number line, the greater number is <b>farther to the right</b>.</p>', tool: 'numberline', opts: { min: 0, max: 200, tick: 10, every: 50, start: 126, marks: [{ v: 162, t: '162' }], tap: false, readout: false } },
          { label: 'With money', html: '<p>$162 or $126? Both have one $100 bill. Then count the $10 bills: 6 is more than 2. $162 is more money.</p>' },
          { label: 'A short rule', html: '<ol><li>Line the numbers up, place by place.</li><li>Find the first place where the digits are different.</li><li>The bigger digit there wins.</li></ol><p>98 and 102: 98 has no hundreds and 102 has 1, so <b>102 is greater</b>.</p>' }
        ],
        try: { mount: function (host, done) {
          var round = 0, right = 0;
          function show() {
            var a = R.int(60, 195), b = a + R.pick([-1, 1]) * R.pick([1, 3, 10, 20, 40, 70]);
            if (b < 10 || b > 200 || b === a) b = a > 100 ? a - 30 : a + 30;
            host.innerHTML = '<p class="qtext">Tap the <b>greater</b> number. Use the blocks to help.</p><div class="vrow"><figure><button type="button" class="opt big" data-v="' + a + '">' + a + '</button>' + D.num10(a, { u: 5 }) + '</figure><figure><button type="button" class="opt big" data-v="' + b + '">' + b + '</button>' + D.num10(b, { u: 5 }) + '</figure></div><p class="fb" aria-live="polite"></p>';
            A.$$('.opt', host).forEach(function (bt) {
              bt.addEventListener('click', function () {
                var v = +bt.getAttribute('data-v'), fb = A.$('.fb', host), ok = v === Math.max(a, b);
                bt.classList.add(ok ? 'yes' : 'no');
                A.$$('.opt', host).forEach(function (x) { x.disabled = true; });
                fb.className = 'fb ' + (ok ? 'ok' : 'bad');
                fb.textContent = ok ? 'Yes. ' + Math.max(a, b) + ' > ' + Math.min(a, b) + '.' : 'Not this time. ' + Math.max(a, b) + ' is greater. Look at the hundreds, then the tens.';
                if (ok) right++;
                round++;
                setTimeout(function () { if (round < 4) show(); else { host.innerHTML = '<p>' + right + ' of 4 right.</p><button type="button" class="btn alt">Play again</button>'; A.$('button', host).addEventListener('click', function () { round = right = 0; show(); }); done(right >= 3 ? 'Well done.' : 'Good practice. Try again to get 3 or more.'); } }, 1300);
              });
            });
          }
          show();
        }, do: 'Four rounds. Pick the greater number each time.' },
        mistake: '<p>Thinking 98 is greater than 102 because 9 is a big digit. 102 has a hundred and 98 does not, so <b>102 is greater</b>.</p>',
        check: [T('greater'), P('n2-compare', 1)] },

      { id: 'symbols', title: 'The symbols > and <', exp: ['B1.2'], skill: 'n2-compare',
        body: '<p><span class="math big">&gt;</span> means "is greater than". <span class="math big">&lt;</span> means "is less than". The <b>open side faces the greater number</b>. The point faces the smaller one.</p>',
        try: { mount: function (host, done) {
          var syms = ['&gt;', '&lt;', '='], round = 0;
          function show() {
            var a = R.int(40, 200), b = R.int(40, 200), s = R.int(0, 2);
            if (round === 2) b = a;
            host.innerHTML = '<p class="qtext">Tap the symbol to change it until the sentence is true.</p><p class="ls-sym"><span class="math big">' + a + '</span> <button type="button" class="btn alt ls-symb" aria-label="Change the symbol">' + syms[s] + '</button> <span class="math big">' + b + '</span></p><p><button type="button" class="btn">Check</button></p><p class="fb" aria-live="polite"></p>';
            var sb = A.$('.ls-symb', host);
            sb.addEventListener('click', function () { s = (s + 1) % 3; sb.innerHTML = syms[s]; M.bump(sb, 'mp-pop'); });
            A.$('.btn:not(.ls-symb)', host).addEventListener('click', function () {
              var want = a > b ? 0 : a < b ? 1 : 2, fb = A.$('.fb', host);
              if (s === want) { fb.className = 'fb ok'; fb.innerHTML = 'Yes. ' + a + ' ' + syms[want] + ' ' + b + ' is true.'; round++; setTimeout(function () { if (round < 4) show(); else { host.innerHTML = '<p>All 4 done.</p>'; done('Well done.'); } }, 1100); }
              else { fb.className = 'fb bad'; fb.textContent = 'Not true yet. Which number is greater? The open side faces it.'; M.bump(sb, 'mp-shake'); }
            });
          }
          show();
        }, do: 'Make each sentence true.' },
        key: '<p>Read from left to right: <span class="math">162 &gt; 126</span> is "162 is greater than 126".</p>',
        check: T('symbol') },

      { id: 'order', title: 'Put numbers in order', exp: ['B1.2'], skill: 'n2-compare',
        body: '<p>To order numbers from <b>least to greatest</b>, find the least one first, then the next. On a number line, numbers get greater as you move right.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 200, tick: 10, every: 50, start: 0, readout: false }, steps: [
          { say: 'Order 120, 45 and 98. Find each one on the line.', ms: 800 },
          { say: '45 is the least. It is closest to 0.', act: function (t) { return t.mark(45); } },
          { say: '98 comes next.', act: function (t) { return t.mark(98); } },
          { say: '120 is the greatest. It is farthest right.', act: function (t) { return t.mark(120); } },
          { say: 'From least to greatest: <b>45, 98, 120</b>.', ms: 2000 }
        ] },
        try: { mount: function (host, done) {
          var nums, picked;
          function show() {
            nums = R.shuffle([R.int(20, 70), R.int(71, 130), R.int(131, 199)]); picked = [];
            host.innerHTML = '<p class="qtext">Tap the numbers from <b>least to greatest</b>.</p><div class="btnrow">' + nums.map(function (n) { return '<button type="button" class="btn alt big" data-v="' + n + '">' + n + '</button>'; }).join('') + '</div><p class="math big ls-ord">&nbsp;</p><p class="fb" aria-live="polite"></p>';
            A.$$('[data-v]', host).forEach(function (b) {
              b.addEventListener('click', function () {
                var v = +b.getAttribute('data-v'), want = nums.slice().sort(function (x, y) { return x - y; })[picked.length], fb = A.$('.fb', host);
                if (v !== want) { M.bump(b, 'mp-shake'); fb.className = 'fb bad'; fb.textContent = 'Not yet. Which of the numbers left is the least?'; return; }
                picked.push(v); b.disabled = true; b.style.visibility = 'hidden';
                A.$('.ls-ord', host).textContent = picked.join(', ');
                fb.textContent = '';
                if (picked.length === 3) { fb.className = 'fb ok'; fb.innerHTML = 'Yes: ' + picked.join(' &lt; ') + '.'; done('In order.'); A.$('.ls-ord', host).insertAdjacentHTML('afterend', '<button type="button" class="btn alt">New numbers</button>'); A.$('.ls-ord + .btn', host).addEventListener('click', show); }
              });
            });
          }
          show();
        }, do: 'Put three numbers in order.' },
        check: P('n2-compare', 3) }
    ] },

    { id: 'skip', title: 'Skip counting', sub: 'Count by the same jump each time.', concepts: [
      { id: 'skip-chart', title: 'Count by 2s, 5s and 10s', exp: ['B1.4'], skill: 'n2-skip',
        body: '<p><b>Skip counting</b> means counting by the same jump each time. It is faster than counting by ones. On a hundred chart, skip counts make patterns.</p>',
        watch: { tool: 'hundred', opts: {}, steps: [
          { say: 'Count by 10s: 10, 20, 30 ... They make a straight line down.', act: function (t) { return t.skip(10, 10, 100, 260); }, ms: 900 },
          { say: 'Now count by 5s: 5, 10, 15, 20 ... Two lines.', act: function (t) { t.clear(); return t.skip(5, 5, 100, 130); }, ms: 900 },
          { say: 'Count by 2s: 2, 4, 6, 8 ... Every other column.', act: function (t) { t.clear(); return t.skip(2, 2, 100, 60); }, ms: 1500 }
        ] },
        try: { tool: 'hundred', opts: {}, tasks: [
          { do: 'Count by <b>10s</b> to 100. Tap each number you say.', goal: function (s) { return s.lit.length === 10 && s.lit.every(function (n) { return n % 10 === 0; }); }, yes: '10, 20, 30, 40, 50, 60, 70, 80, 90, 100.' },
          { do: 'Count by <b>5s</b> to 50. Tap each number you say.', goal: function (s) { return s.lit.length === 10 && s.lit.every(function (n) { return n % 5 === 0 && n <= 50; }); }, yes: '5, 10, 15, 20, 25, 30, 35, 40, 45, 50.' }
        ] },
        check: P('n2-skip', 1) },

      { id: 'skip-big', title: 'Count by 20s, 25s and 50s', exp: ['B1.4'], skill: 'n2-skip', hard: true,
        body: '<p>Big jumps help us count to 200 quickly. Count by <b>20s</b>: 20, 40, 60. By <b>25s</b>: 25, 50, 75, 100. By <b>50s</b>: 50, 100, 150, 200.</p>',
        watch: { tool: 'numberline', opts: { min: 0, max: 200, tick: 25, every: 25, start: 0, readout: false }, steps: [
          { say: 'Count by 25s from 0. Jump: 25.', act: function (t) { return t.jumps(25, 1); } },
          { say: '50, 75, 100.', act: function (t) { return t.jumps(25, 3, 200); } },
          { say: '125, 150, 175, 200.', act: function (t) { return t.jumps(25, 4, 200); } },
          { say: '8 jumps of 25 make 200. Four jumps make 100.', ms: 2000 }
        ] },
        ways: [
          { label: 'With quarters', html: '<p>A quarter is 25¢. Count quarters by 25s.</p><p>' + [1, 2, 3, 4].map(function (k) { return M.cashHtml(25) + ' <b>' + k * 25 + '¢</b> '; }).join('&nbsp; ') + '</p><p>4 quarters make 100¢, the same as $1.</p>' },
          { label: 'Count by 50s: halves of 100', html: '<p>50 is half of 100. So 50, <b>100</b>, 150, <b>200</b>: every second jump lands on a hundred.</p>', tool: 'numberline', opts: { min: 0, max: 200, tick: 10, every: 50, step: 50, readout: true } },
          { label: 'Count by 20s: doubles of 10s', html: '<p>Count by 10s and say every <b>second</b> number out loud: 10, <b>20</b>, 30, <b>40</b>, 50, <b>60</b>. Those are the 20s.</p>', tool: 'hundred', opts: { lit: [20, 40, 60, 80, 100] } }
        ],
        try: { tool: 'numberline', opts: { min: 0, max: 200, tick: 10, every: 50, step: [20, 25, 50], start: 0 }, tasks: [
          { do: 'Choose <b>Jumps of 25</b>. Jump from 0 to 200.', goal: function (s) { return s.at === 200 && s.step === 25; }, yes: '8 jumps of 25 make 200.' },
          { do: 'Choose <b>Jumps of 20</b>. How many jumps to reach 100?', goal: function (s) { return s.at === 100 && s.step === 20; }, yes: '5 jumps of 20 make 100: 20, 40, 60, 80, 100.' },
          { do: 'Choose <b>Jumps of 50</b>. Jump to 150.', goal: function (s) { return s.at === 150 && s.step === 50; }, yes: '50, 100, 150. 3 jumps.' }
        ] },
        check: [T('skip'), P('n2-skip', 2)] }
    ] },

    { id: 'estimate', title: 'Estimate', sub: 'A smart guess, then check.', concepts: [
      { id: 'estimate', title: 'Estimate, then count', exp: ['B1.3'], skill: 'n2-estimate',
        body: '<p>An <b>estimate</b> is a smart guess about how many. Picture a group of 10. About how many groups of 10 could you make? Then count to check.</p>',
        watch: { tool: 'counters', opts: { n: 38, seed: 5, readout: true, showN: false }, steps: [
          { say: 'About how many dots? Do not count one by one. Make a guess.', ms: 1800 },
          { say: 'About 4 groups of 10 would fit, so a good estimate is <b>about 40</b>.', ms: 1600 },
          { say: 'Check: move the dots into rows of 10.', act: function (t) { return t.arrange('tens'); }, ms: 1200 },
          { say: '3 tens and 8 ones: 38. The estimate of 40 was very close.', ms: 2200 }
        ] },
        try: { mount: function (host, done) {
          var n, tool;
          host.innerHTML = '<div class="ctrl"><label for="estg">My estimate: <output id="esto">50</output><input type="range" id="estg" min="10" max="200" step="5" value="50"></label></div><div class="btnrow"><button type="button" class="btn" id="estc">Check by grouping in tens</button><button type="button" class="btn alt" id="estn">New dots</button></div><div class="esttool"></div><p class="out" aria-live="polite"></p>';
          tool = M.counters(A.$('.esttool', host), { n: 0, readout: false, tap: true, size: 22 });
          function fresh() { n = R.int(20, 120); tool.setN(n); tool.shuffle(R.int(1, 999)); A.$('.out', host).innerHTML = ''; A.$('#estc', host).disabled = false; }
          A.$('#estg', host).addEventListener('input', function () { A.$('#esto', host).textContent = this.value; });
          A.$('#estn', host).addEventListener('click', fresh);
          A.$('#estc', host).addEventListener('click', function () {
            var g = +A.$('#estg', host).value, off = Math.abs(g - n);
            this.disabled = true;
            tool.arrange('tens').then(function () {
              A.$('.out', host).innerHTML = '<p>There are <span class="mp-num">' + n + '</span> dots: ' + Math.floor(n / 10) + ' tens and ' + n % 10 + ' ones. Your estimate, ' + g + ', is ' + off + ' away. ' +
                (off <= 15 ? '<b>That is a close estimate.</b>' : off <= 30 ? 'Fairly close. Picture a group of 10 first next time.' : 'Far away. Picture one group of 10, then think how many groups fit.') + '</p>';
              if (off <= 15) done('Close estimate.');
            });
          });
          fresh();
        }, do: 'Slide to make an estimate, then check it. Try to get within 15.' },
        check: T('est') }
    ] },

    { id: 'evenodd', title: 'Even and odd', sub: 'Pairs, and what is left over.', concepts: [
      { id: 'pairs', title: 'Even numbers make pairs', exp: ['B1.5'], skill: 'n2-evenodd',
        body: '<p>Put things in <b>pairs</b>, two by two. If every one has a partner, the number is <b>even</b>. If one is left over, the number is <b>odd</b>.</p>',
        watch: { tool: 'counters', opts: { n: 7, seed: 3 }, steps: [
          { say: 'Here are 7 counters. Is 7 even or odd?', ms: 1300 },
          { say: 'Put them in pairs.', act: function (t) { return t.arrange('pairs'); } },
          { say: '3 pairs and <b>1 left over</b>. 7 is odd.', ms: 1600 },
          { say: 'Add one more counter: 8.', act: function (t) { return t.setN(8).then(function () { return t.arrange('pairs'); }); } },
          { say: '4 pairs and none left over. <b>8 is even</b>.', ms: 2000 }
        ] },
        try: { tool: 'counters', opts: { n: 5, controls: ['pairs'], max: 30, min: 1 }, tasks: [
          { do: 'Press <b>Pair them up</b>. Is 5 even or odd?', goal: function (s) { return s.mode === 'pairs'; }, yes: '2 pairs and 1 left over. 5 is odd.' },
          { do: 'Use + 1 and − 1 to find an <b>even</b> number bigger than 10. Pair them up to check.', reset: false, goal: function (s) { return s.mode === 'pairs' && s.even && s.n > 10; }, yes: function (s) { return s.n + ' is even: ' + s.pairs + ' pairs, none left over.'; } },
          { do: 'Now find an <b>odd</b> number bigger than 15.', reset: false, goal: function (s) { return s.mode === 'pairs' && !s.even && s.n > 15; }, yes: function (s) { return s.n + ' is odd: ' + s.pairs + ' pairs and 1 left over.'; } }
        ] },
        check: [T('even1'), T('even2')] },

      { id: 'ones-digit', title: 'The ones digit tells', exp: ['B1.5'], skill: 'n2-evenodd',
        body: '<p>You do not need to make pairs for big numbers. Look at the <b>ones digit</b>. If it is 0, 2, 4, 6 or 8, the number is <b>even</b>. If it is 1, 3, 5, 7 or 9, the number is <b>odd</b>.</p>',
        watch: { tool: 'hundred', opts: { from: 101 }, steps: [
          { say: 'Light up the even numbers from 102: 102, 104, 106 ...', act: function (t) { return t.skip(2, 102, 200, 45); }, ms: 900 },
          { say: 'Every even number ends in 0, 2, 4, 6 or 8. They make columns.', ms: 1800 },
          { say: 'The numbers in between end in 1, 3, 5, 7 or 9. They are odd.', ms: 2000 }
        ] },
        try: { tool: 'hundred', opts: {}, tasks: [
          { do: 'Tap all the <b>odd</b> numbers in the first row, 1 to 10.', goal: function (s) { return s.lit.join() === '1,3,5,7,9'; }, yes: '1, 3, 5, 7, 9 are odd.' },
          { do: 'Tap the <b>even</b> numbers from 41 to 50.', goal: function (s) { return s.lit.join() === '42,44,46,48,50'; }, yes: '42, 44, 46, 48, 50 are even.' }
        ] },
        mistake: '<p>Looking at the first digit. 51 starts with 5 but ends in 1, so it is <b>odd</b>. 70 starts with 7 but ends in 0, so it is <b>even</b>. Only the ones digit decides.</p>',
        check: [T('even3'), P('n2-evenodd', 3)] }
    ] }
  ];

  A.register('numbers-200', {
    lessons: LESSONS,
    html:
'<section class="sec"><h2><span class="n">1</span>Hundreds, tens and ones</h2>' +
'<p>We use <b>ten digits</b> to write every number: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9.</p>' +
'<p>Ten ones make <b>one ten</b>. Ten tens make <b>one hundred</b>.</p>' +
'<div class="fig">' + same100() + '</div>' +
'<div class="legend"><span><i style="background:var(--p2)"></i>hundreds are blue</span><span><i style="background:var(--p1)"></i>tens are green</span><span><i style="background:var(--p0)"></i>ones are yellow</span></div>' +
'<div class="eg"><b class="t">Watch me</b><p>This is 1 hundred, 4 tens and 7 ones. I count: 100, 110, 120, 130, 140, then 141, 142, 143, 144, 145, 146, 147. The number is <b>147</b>.</p>' +
'<div class="fig">' + D.base10(1, 4, 7, {}) + '</div>' + table(147) + '<p>We say "one hundred forty-seven". We write <span class="math">' + expanded(147) + '</span>.</p></div>' +
'<div class="yt" data-yt="read"></div>' +
'<div class="lab"><span class="lt">Try it: build a number</span>' +
'<div class="ctrl">' +
'<div><span class="t2" style="font-size:.9rem;font-weight:600">Hundreds</span><div class="step"><button type="button" class="btn alt" data-bd="2" data-s="-1" aria-label="One less hundred">&minus;</button><b id="bh">1</b><button type="button" class="btn alt" data-bd="2" data-s="1" aria-label="One more hundred">+</button></div></div>' +
'<div><span class="t2" style="font-size:.9rem;font-weight:600">Tens</span><div class="step"><button type="button" class="btn alt" data-bd="1" data-s="-1" aria-label="One less ten">&minus;</button><b id="bt">2</b><button type="button" class="btn alt" data-bd="1" data-s="1" aria-label="One more ten">+</button></div></div>' +
'<div><span class="t2" style="font-size:.9rem;font-weight:600">Ones</span><div class="step"><button type="button" class="btn alt" data-bd="0" data-s="-1" aria-label="One less one">&minus;</button><b id="bo">5</b><button type="button" class="btn alt" data-bd="0" data-s="1" aria-label="One more one">+</button></div></div>' +
'</div>' +
'<div class="btnrow"><button type="button" class="btn alt" id="mk10">Trade 10 ones for 1 ten</button><button type="button" class="btn alt" id="mk100">Trade 10 tens for 1 hundred</button></div>' +
'<div class="fig" id="bfig"></div><div id="btab"></div><div class="out" id="bout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>The <b>place</b> of a digit tells what it is worth. In 147, the 1 means 1 hundred, the 4 means 4 tens, and the 7 means 7 ones.</p></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Writing "one hundred seven" as 1007. There are no tens, so a <b>0</b> holds the tens place: <b>107</b>.</p>' + table(107, 1) + '</div>' +
'<h3>Where we see numbers</h3><div class="facts">' +
'<div>' + A.svg(48, 48, '<rect x="3" y="12" width="42" height="26" rx="6" style="fill:var(--hi)" stroke="rgba(0,0,0,.4)"/><rect x="8" y="16" width="10" height="9" rx="2" style="fill:var(--card)"/><rect x="21" y="16" width="10" height="9" rx="2" style="fill:var(--card)"/><circle cx="12" cy="40" r="4" fill="#2b2118"/><circle cx="36" cy="40" r="4" fill="#2b2118"/>') + '<span><b>Bus 120</b><small>a number used as a name</small></span></div>' +
'<div>' + A.svg(48, 48, '<rect x="8" y="4" width="32" height="40" rx="4" style="fill:var(--strand)"/><rect x="12" y="8" width="24" height="32" rx="2" style="fill:var(--card)"/><line x1="16" y1="16" x2="32" y2="16" style="stroke:var(--line)" stroke-width="2"/><line x1="16" y1="22" x2="32" y2="22" style="stroke:var(--line)" stroke-width="2"/>') + '<span><b>150 pages</b><small>a number that counts</small></span></div>' +
'<div>' + A.svg(48, 48, '<rect x="4" y="8" width="40" height="34" rx="6" style="fill:var(--card);stroke:var(--strand)" stroke-width="3"/><rect x="4" y="8" width="40" height="10" rx="4" style="fill:var(--strand)"/><text x="24" y="37" text-anchor="middle" font-size="15" font-weight="700">100</text>') + '<span><b>Day 100</b><small>a number that puts things in order</small></span></div></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">2</span>Compare and order</h2>' +
'<p>To find the <b>greater</b> number, compare the biggest place first. Look at the hundreds. If they are the same, look at the tens. If the tens are the same, look at the ones.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>Which is greater, 126 or 162? Both have 1 hundred. Now the tens: 2 tens and 6 tens. 6 tens is more. So <b>162 is greater than 126</b>.</p>' +
'<div class="vrow"><figure><figcaption>126</figcaption>' + D.num10(126, { u: 7 }) + '</figure><figure><figcaption>162</figcaption>' + D.num10(162, { u: 7 }) + '</figure></div></div>' +
'<div class="yt" data-yt="greater"></div>' +
'<p>We can use symbols. <span class="math"><b>&gt;</b></span> means "is greater than". <span class="math"><b>&lt;</b></span> means "is less than". The open side of the symbol always faces the greater number.</p>' +
'<div class="eg"><b class="t">Watch me</b><p><span class="big">162 &gt; 126</span> &nbsp; 162 is greater than 126.</p><p><span class="big">126 &lt; 162</span> &nbsp; 126 is less than 162.</p></div>' +
'<div class="yt" data-yt="symbol"></div>' +
'<div class="lab"><span class="lt">Try it: compare two numbers</span>' +
'<div class="ctrl"><label for="ca">First number (0 to 200)<input type="number" id="ca" min="0" max="200" value="98"></label><label for="cb">Second number (0 to 200)<input type="number" id="cb" min="0" max="200" value="102"></label></div>' +
'<div class="vrow" id="cfig"></div><div class="fig" id="cline"></div><div class="out" id="cout"></div></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Thinking 98 is greater than 102 because 9 is a big digit. 102 has a hundred and 98 does not, so <b>102 is greater</b>.</p></div>' +
'<div class="key"><b class="t">Key idea</b><p>To put numbers <b>in order</b>, find the least one first, then the next, and so on. On a number line, numbers get greater as you move right.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">3</span>Skip counting to 200</h2>' +
'<p><b>Skip counting</b> means counting by the same jump each time. It is faster than counting by ones.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>Count by 25s, like counting quarters: 25, 50, 75, 100. Four quarters make 100 cents.</p>' +
'<div class="fig">' + D.hops({ min: 0, max: 100, tick: 5, every: 25, hops: [{ a: 0, b: 25, t: '+25' }, { a: 25, b: 50, t: '+25' }, { a: 50, b: 75, t: '+25' }, { a: 75, b: 100, t: '+25' }], id: 'h25', label: 'Jumps of 25 from 0 to 100: 25, 50, 75, 100' }) + '</div>' +
'<div class="fig">' + D.wallet([25, 25, 25, 25], { label: 'Four quarters' }) + '</div></div>' +
'<div class="yt" data-yt="skip"></div>' +
'<div class="lab"><span class="lt">Try it: skip count</span>' +
'<div class="ctrl"><label for="sk">Count by<select id="sk"><option>2</option><option>5</option><option>10</option><option selected>20</option><option>25</option><option>50</option></select></label>' +
'<label for="ss">Start at<input type="number" id="ss" min="0" max="190" value="0"></label></div>' +
'<div class="fig" id="sfig"></div><div class="out" id="sout"></div></div>' +
'<div class="tbl"><table><thead><tr><th class="l">Count by</th><th class="l">From 0</th></tr></thead><tbody>' +
'<tr><td>20s</td><td class="l">20, 40, 60, 80, 100, 120, 140, 160, 180, 200</td></tr>' +
'<tr><td>25s</td><td class="l">25, 50, 75, 100, 125, 150, 175, 200</td></tr>' +
'<tr><td>50s</td><td class="l">50, 100, 150, 200</td></tr></tbody></table></div>' +
'<div class="key"><b class="t">Key idea</b><p>Counting by 20s is like counting by 2s, with a zero on the end: 2, 4, 6 and 20, 40, 60.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">4</span>Estimate, then count</h2>' +
'<p>To <b>estimate</b> is to make a smart guess about how many. First look at a small group, like 10. Then ask: how many groups of 10 could fit?</p>' +
'<div class="eg"><b class="t">Watch me</b><p>Here are some dots. One group of 10 takes up a small patch. About 6 patches like that are filled, so I estimate <b>about 60</b>. Then I count in tens to check: 6 tens and 3 more is <b>63</b>. My estimate was close.</p>' +
'<div class="vrow"><figure>' + scatter(63, 7, false) + '<figcaption>Estimate first</figcaption></figure><figure>' + rows10(63) + '<figcaption>Then line them up in tens</figcaption></figure></div></div>' +
'<div class="yt" data-yt="est"></div>' +
'<div class="lab"><span class="lt">Try it: estimate, then check</span>' +
'<div class="btnrow"><button type="button" class="btn alt" id="enew">New picture</button></div>' +
'<div class="fig" id="efig"></div>' +
'<div class="ctrl"><label for="eg">My estimate: <output id="ego">50</output><input type="range" id="eg" min="0" max="200" step="5" value="50"></label><button type="button" class="btn" id="echk">Count in tens to check</button></div>' +
'<div class="out" id="eout"></div></div>' +
'<div class="key"><b class="t">Key idea</b><p>An estimate does not have to be exact. A good estimate is <b>close</b>. Counting in groups of 10 checks it.</p></div>' +
'</section>' +

'<section class="sec"><h2><span class="n">5</span>Even and odd</h2>' +
'<p>Put things into <b>pairs</b>, two by two. If every one has a partner, the number is <b>even</b>.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>8 blocks. Every block has a partner. 8 is <b>even</b>.</p><div class="fig">' + pairs(8) + '</div></div>' +
'<div class="yt" data-yt="even1"></div>' +
'<p>If one is left over with no partner, the number is <b>odd</b>.</p>' +
'<div class="eg"><b class="t">Watch me</b><p>7 blocks. One block has no partner. 7 is <b>odd</b>.</p><div class="fig">' + pairs(7) + '</div></div>' +
'<div class="yt" data-yt="even2"></div>' +
'<div class="lab"><span class="lt">Try it: make pairs</span>' +
'<div class="ctrl"><label for="ev">How many blocks: <output id="evo">11</output><input type="range" id="ev" min="1" max="30" value="11"></label></div>' +
'<div class="fig" id="evfig"></div><div class="out" id="evout"></div></div>' +
'<p>For big numbers, look only at the <b>ones digit</b>.</p>' +
'<div class="tbl"><table><thead><tr><th>Even numbers end in</th><th>Odd numbers end in</th></tr></thead><tbody><tr><td class="big">0, 2, 4, 6, 8</td><td class="big">1, 3, 5, 7, 9</td></tr></tbody></table></div>' +
'<div class="eg"><b class="t">Watch me</b><p>Is 136 even or odd? The ones digit is 6. 6 is even, so <b>136 is even</b>.</p></div>' +
'<div class="yt" data-yt="even3"></div>' +
'<div class="mistake"><b class="t">Common mistake</b><p>Looking at the first digit. 31 starts with 3, but it ends in 1, so 31 is odd. 54 starts with 5, but ends in 4, so 54 is even. Only the ones digit decides.</p></div>' +
'</section>',

    init: function (root) {
      var $ = A.$;
      /* build a number */
      var c = [5, 2, 1];
      function build() {
        var n = c[2] * 100 + c[1] * 10 + c[0];
        $('#bh', root).textContent = c[2]; $('#bt', root).textContent = c[1]; $('#bo', root).textContent = c[0];
        $('#bfig', root).innerHTML = D.base10(c[2], c[1], c[0], {});
        var tidy = c[0] < 10 && c[1] < 10;
        $('#btab', root).innerHTML = tidy ? table(n) : '';
        $('#bout', root).innerHTML = '<p><span class="big">' + n + '</span> &nbsp; ' + words(n) + '</p>' +
          (tidy ? '<p>' + htoWords(n) + ' &nbsp; <span class="math">' + expanded(n) + '</span></p>' :
            '<p>' + pl(c[2], 'hundred', 'hundreds') + ', ' + pl(c[1], 'ten', 'tens') + ', ' + pl(c[0], 'one', 'ones') + '. A place has 10 or more. Use a trade button to tidy it up.</p>');
        root.querySelectorAll('[data-bd]').forEach(function (b) {
          var p = +b.getAttribute('data-bd'), s = +b.getAttribute('data-s');
          b.disabled = s < 0 ? c[p] === 0 : n + Math.pow(10, p) > 200 || c[p] >= (p === 2 ? 2 : 19);
        });
        $('#mk10', root).disabled = c[0] < 10;
        $('#mk100', root).disabled = c[1] < 10;
      }
      root.querySelectorAll('[data-bd]').forEach(function (b) {
        b.addEventListener('click', function () { c[+b.getAttribute('data-bd')] += +b.getAttribute('data-s'); build(); });
      });
      $('#mk10', root).addEventListener('click', function () { c[0] -= 10; c[1] += 1; build(); });
      $('#mk100', root).addEventListener('click', function () { c[1] -= 10; c[2] += 1; build(); });
      build();

      /* compare */
      function cmp() {
        var a = Math.max(0, Math.min(200, parseInt($('#ca', root).value, 10) || 0));
        var b = Math.max(0, Math.min(200, parseInt($('#cb', root).value, 10) || 0));
        $('#cfig', root).innerHTML = '<figure><figcaption>' + a + '</figcaption>' + D.num10(a, { u: 6 }) + '</figure><figure><figcaption>' + b + '</figcaption>' + D.num10(b, { u: 6 }) + '</figure>';
        $('#cline', root).innerHTML = D.hops({ min: 0, max: 200, tick: 10, every: 50, id: 'hc', marks: [{ v: a, t: String(a), col: 'var(--strand)', up: true, dy: Math.abs(a - b) < 25 && a < b ? -22 : 0 }, { v: b, t: String(b), col: 'var(--hi)', up: true, dy: Math.abs(a - b) < 25 && b < a ? -22 : 0 }], y: 92, label: a + ' and ' + b + ' on a number line from 0 to 200' });
        var da = hto(a), db = hto(b), k = 0, nm = ['hundreds', 'tens', 'ones'];
        while (k < 3 && da[k] === db[k]) k++;
        var sym = a > b ? '&gt;' : a < b ? '&lt;' : '=', word = a > b ? 'is greater than' : a < b ? 'is less than' : 'is equal to';
        $('#cout', root).innerHTML = '<p><span class="big">' + a + ' ' + sym + ' ' + b + '</span> &nbsp; ' + a + ' ' + word + ' ' + b + '.</p><p>' +
          (k === 3 ? 'Every place is the same, so they are equal.' : 'The first place that is different is the <b>' + nm[k] + '</b>: ' + da[k] + ' and ' + db[k] + '.') + '</p>';
      }
      A.bind(root, ['ca', 'cb'], cmp);

      /* skip count */
      function skip() {
        var k = +$('#sk', root).value, st = Math.max(0, Math.min(190, parseInt($('#ss', root).value, 10) || 0)), list = [], hops = [];
        for (var v = st; v <= 200 && list.length < 41; v += k) list.push(v);
        for (var i = 1; i < list.length && i <= 12; i++) hops.push({ a: list[i - 1], b: list[i], t: list.length <= 9 ? '+' + k : '' });
        var lo = Math.floor(st / 10) * 10, hi = Math.min(200, Math.max(lo + 20, Math.ceil(list[Math.min(list.length - 1, 12)] / 10) * 10));
        var tick = hi - lo <= 40 ? 1 : hi - lo <= 100 ? 5 : 10, every = hi - lo <= 40 ? 5 : hi - lo <= 100 ? 10 : 50;
        $('#sfig', root).innerHTML = D.hops({ min: lo, max: hi, tick: tick, every: every, hops: hops, marks: [{ v: st, col: 'var(--hi)' }], id: 'hs', label: 'Jumps of ' + k + ' starting at ' + st });
        $('#sout', root).innerHTML = '<p>' + list.slice(0, 41).map(function (v, i) { return i === 0 ? '<b>' + v + '</b>' : v; }).join(', ') + (list[list.length - 1] + k <= 200 ? ', &hellip;' : '') + '</p>' +
          '<p class="t2">' + (list.length > 13 ? 'The drawing shows the first 12 jumps. ' : '') + 'Each jump adds ' + k + '.' + (st % k ? ' You did not start at a jump of ' + k + ', so the numbers are not the ones in the table. The jump is still ' + k + '.' : '') + '</p>';
      }
      A.bind(root, ['sk', 'ss'], skip);

      /* estimate */
      var en = 0, seed = 1;
      function eNew() { en = R.int(25, 190); seed = R.int(1, 9999); $('#efig', root).innerHTML = scatter(en, seed, false); $('#eout', root).innerHTML = ''; }
      $('#eg', root).addEventListener('input', function () { $('#ego', root).textContent = this.value; });
      $('#enew', root).addEventListener('click', eNew);
      $('#echk', root).addEventListener('click', function () {
        var g = +$('#eg', root).value, off = Math.abs(g - en);
        $('#efig', root).innerHTML = '<div class="vrow"><figure>' + scatter(en, seed, false) + '</figure><figure>' + rows10(en) + '<figcaption>The same dots, lined up in tens</figcaption></figure></div>';
        $('#eout', root).innerHTML = '<p>There are <span class="big">' + en + '</span> dots: ' + pl(Math.floor(en / 10), 'ten', 'tens') + ' and ' + pl(en % 10, 'one', 'ones') + '. Each row is 10.</p><p>Your estimate, ' + g + ', is ' + off + ' away. ' +
          (off <= 15 ? 'That is a close estimate.' : off <= 35 ? 'That is fairly close. Look at a group of 10 first next time.' : 'That is far away. Picture one group of 10, then count how many groups could fit.') + '</p>';
      });
      eNew();

      /* even and odd */
      function ev() {
        var n = +$('#ev', root).value;
        $('#evo', root).textContent = n;
        $('#evfig', root).innerHTML = pairs(n);
        $('#evout', root).innerHTML = '<p><span class="big">' + n + ' is ' + (n % 2 ? 'odd' : 'even') + '.</span> ' +
          (n % 2 ? pl(Math.floor(n / 2), 'pair', 'pairs') + ' and 1 left over.' : pl(n / 2, 'pair', 'pairs') + ', none left over.') + ' It ends in ' + n % 10 + '.</p>';
      }
      A.bind(root, ['ev'], ev);
    },

    turns: {
      read: function () { return blocksQ(R.pick([1, 2])); },
      greater: function () {
        var a = R.int(100, 190), b = a + R.pick([-1, 1]) * R.pick([1, 2, 3, 10, 20, 30]);
        if (b > 200 || b < 0 || b === a) b = a - 10;
        var o = R.mc(String(Math.max(a, b)), [String(Math.min(a, b))]);
        return { q: 'Which number is greater?', type: 'mc', options: o.options, answer: o.answer, hint: 'Both have the same hundreds. Look at the tens next. If the tens are the same, look at the ones.', explain: Math.max(a, b) + ' is greater than ' + Math.min(a, b) + '.' };
      },
      symbol: function () {
        var a = R.int(40, 200), b = R.int(40, 200);
        while (b === a) b = R.int(40, 200);
        var sym = a > b ? '&gt;' : '&lt;';
        return { q: 'Which symbol makes this true? <span class="math big">' + a + ' &#9633; ' + b + '</span>', type: 'mc', options: ['&gt;', '&lt;'], answer: a > b ? 0 : 1,
          hint: 'First decide which number is greater. The open side faces the greater number.', explain: a + ' ' + sym + ' ' + b + '. ' + a + (a > b ? ' is greater than ' : ' is less than ') + b + '.' };
      },
      skip: function () {
        var k = R.pick([20, 25, 50]), st = k * R.int(0, 2), seq = [st, st + k, st + 2 * k, st + 3 * k];
        return { q: 'What comes next? <span class="math big">' + seq.join(', ') + ', ___</span>', type: 'num', answer: st + 4 * k, hint: 'How much bigger is each number than the one before? Add that again.', explain: 'Each jump is ' + k + '. ' + seq[3] + ' + ' + k + ' = ' + (st + 4 * k) + '.' };
      },
      est: function () {
        var n = R.pick([18, 22, 41, 47, 78, 83, 115, 142]), choices = [10, 20, 50, 80, 120, 150, 200];
        var best = choices.reduce(function (a, b) { return Math.abs(b - n) < Math.abs(a - n) ? b : a; });
        var wrong = choices.filter(function (c) { return Math.abs(c - n) > 25; });
        var o = R.mc(String(best), R.shuffle(wrong).slice(0, 2).map(String));
        return { q: 'About how many dots? Choose the best estimate.', type: 'mc', options: o.options, answer: o.answer, fig: scatter(n, n * 3, false),
          hint: 'Picture one group of 10 dots. About how many groups like that fill the picture?', explain: 'There are ' + n + ' dots, so about ' + best + ' is the best estimate.' };
      },
      even1: function () {
        var n = 2 * R.int(2, 7);
        return { q: 'These ' + n + ' blocks are in pairs. How many pairs are there?', type: 'num', answer: n / 2, fig: pairs(n, 'cube'),
          hint: 'A pair is a column of two blocks, one blue and one green. Count the columns.', explain: 'There are ' + n / 2 + ' pairs, and every block has a partner. So ' + n + ' is even.' };
      },
      even2: function () {
        var n = R.int(3, 15), fig = pairs(n).replace(/aria-label="[^"]*"/, 'aria-label="' + n + ' blocks in pairs"');
        return { q: 'Is this number of blocks even or odd?', type: 'mc', options: ['Even', 'Odd'], answer: n % 2, fig: fig,
          hint: 'Look at the last column. Is there a block with no partner?', explain: n + ' is ' + (n % 2 ? 'odd. One block has no partner.' : 'even. Every block has a partner.') };
      },
      even3: function () {
        var n = R.int(21, 199);
        return { q: 'Is <span class="math big">' + n + '</span> even or odd?', type: 'mc', options: ['Even', 'Odd'], answer: n % 2,
          hint: 'Look only at the ones digit, the last one. Is it 0, 2, 4, 6 or 8?', explain: 'The ones digit is ' + n % 10 + ', so ' + n + ' is ' + (n % 2 ? 'odd' : 'even') + '.' };
      }
    },

    quiz: [
      { q: 'What number do these blocks show?', type: 'num', answer: 134, fig: D.base10(1, 3, 4, {}),
        hint: 'The flat is 100. Count the rods by tens after that: 110, 120, 130. Then count on the ones.', explain: '1 hundred, 3 tens and 4 ones make 134.' },
      { q: 'Which number is <b>one hundred six</b>?', type: 'mc', options: ['16', '106', '160', '1006'], answer: 1,
        hint: 'There is 1 hundred, no tens and 6 ones. What holds the empty tens place?', explain: 'One hundred six is 1 hundred, 0 tens and 6 ones: 106.' },
      { q: 'In <span class="math">185</span>, what is the 8 worth?', type: 'mc', options: ['8', '80', '800', '18'], answer: 1, fig: table(185, 1),
        hint: 'Which place is the 8 in? Look at the colour of its column.', explain: 'The 8 is in the tens place. 8 tens is 80.' },
      { q: 'Which is true?', type: 'mc', options: ['97 &gt; 112', '112 &lt; 97', '97 &lt; 112', '97 = 112'], answer: 2,
        hint: 'Which number has a hundred? That one is greater. The open side faces it.', explain: '112 has a hundred and 97 does not. 97 is less than 112: 97 &lt; 112.' },
      { q: 'Count by 25s. What is missing? <span class="math">100, 125, ___, 175, 200</span>', type: 'num', answer: 150,
        hint: 'Each jump adds 25. What is 125 + 25?', explain: '125 + 25 = 150.' },
      { q: 'About how many dots are there?', type: 'mc', options: ['about 10', 'about 50', 'about 150'], answer: 1, fig: scatter(52, 11, false),
        hint: 'Picture one group of 10 dots. Could you fit about 5 groups, or about 15?', explain: 'There are 52 dots, so about 50 is the best estimate.' },
      { q: 'Which number is <b>odd</b>?', type: 'mc', options: ['64', '120', '38', '151'], answer: 3,
        hint: 'Look at the ones digit of each number. Odd numbers end in 1, 3, 5, 7 or 9.', explain: '151 ends in 1, so it is odd. The others end in 4, 0 and 8, so they are even.' }
    ],

    practice: [
      { id: 'n2-blocks', name: 'Read the blocks', code: 'B1.1', gen: blocksQ },
      { id: 'n2-place', name: 'What a digit is worth', code: 'B1.1', gen: function (lv) {
        var n = R.int(lv === 1 ? 21 : 101, lv === 1 ? 99 : 199), d = hto(n);
        if (lv === 1) {
          var o = R.mc(String(d[1]), [String(d[2]), String(d[1] * 10), String(n)]);
          return { q: 'How many <b>tens</b> are in <span class="math big">' + n + '</span>?', type: 'mc', options: o.options, answer: o.answer, fig: D.num10(n, {}),
            hint: 'Count the green rods. Each rod is one ten.', steps: ['The tens digit is the one on the left: ' + d[1] + '.', 'Count the rods to check: there are ' + d[1] + '.'], explain: n + ' has ' + d[1] + ' tens and ' + d[2] + ' ones.' };
        }
        if (lv === 2) {
          var parts = [100]; if (d[1]) parts.push(d[1] * 10); if (d[2]) parts.push(d[2]);
          return { q: 'Write the number: <span class="math big">' + parts.join(' + ') + '</span>', type: 'num', answer: n, fig: '',
            hint: 'Put 1 in the hundreds place. Then the tens, then the ones. An empty place gets a 0.',
            steps: ['100 means 1 hundred.', (d[1] ? d[1] * 10 + ' means ' + d[1] + ' tens.' : 'There are no tens, so write 0 in the tens place.'), (d[2] ? d[2] + ' means ' + d[2] + ' ones.' : 'There are no ones, so write 0 in the ones place.'), 'The number is ' + n + '.' + table(n)],
            explain: parts.join(' + ') + ' = ' + n + '.' };
        }
        return { q: 'Fill in the missing part: <span class="math big">' + n + ' = 100 + ___ + ' + d[2] + '</span>', type: 'num', answer: d[1] * 10,
          hint: 'What is the tens digit of ' + n + '? A tens digit of ' + d[1] + ' means ' + d[1] + ' tens.',
          steps: ['The tens digit of ' + n + ' is ' + d[1] + '.', d[1] + ' tens is ' + d[1] * 10 + '.', 'Check: 100 + ' + d[1] * 10 + ' + ' + d[2] + ' = ' + n + '.'], explain: n + ' = 100 + ' + d[1] * 10 + ' + ' + d[2] + '.' };
      } },
      { id: 'n2-words', name: 'Number words', code: 'B1.1', gen: function (lv) {
        var n = lv === 1 ? R.int(13, 99) : R.pick([R.int(101, 109), R.int(110, 199), R.int(110, 199), 200]);
        var d = hto(n), wrong = [];
        if (n >= 100) wrong.push(String(100 + d[2] * 10 + d[1]), '1' + (d[1] ? d[1] * 10 + d[2] : '00' + d[2]), String(d[1] * 10 + d[2]));
        else wrong.push(String(d[2] * 10 + d[1]), d[1] + '0' + d[2], String(n + 10));
        wrong = wrong.filter(function (w) { return w !== String(n) && +w > 0; });
        if (lv === 3) {
          var ws = [String(100 + d[2] * 10 + d[1]), String(n + 10 > 200 ? n - 10 : n + 10), String(n - 100 + 10)].filter(function (w) { return +w !== n && +w > 0; }).map(function (w) { return words(+w); });
          var o3 = R.mc(words(n), ws);
          return { q: 'How do we say <span class="math big">' + n + '</span>?', type: 'mc', options: o3.options, answer: o3.answer, fig: table(n),
            hint: 'Say the hundreds first, then the tens and ones together.', steps: ['The 1 in the hundreds place says "one hundred".', 'Then read the last two digits, ' + (n % 100) + ', as "' + (n % 100 ? words(n % 100) : 'nothing more') + '".', 'Together: ' + words(n) + '.'], explain: n + ' is ' + words(n) + '.' };
        }
        var o = R.mc(String(n), wrong);
        return { q: 'Which number is <b>' + words(n) + '</b>?', type: 'mc', options: o.options, answer: o.answer,
          hint: n >= 100 ? 'Write 1 for the hundred, then a digit for the tens and a digit for the ones. Use 0 for an empty place.' : 'The first word tells the tens. The second word tells the ones.',
          steps: [n >= 100 ? '"One hundred" is a 1 in the hundreds place.' : '"' + (n < 20 ? words(n) : tens[d[1]]) + '" tells the tens: ' + d[1] + '.', 'The rest tells the tens and ones: ' + d[1] + ' tens and ' + d[2] + ' ones.', 'The number is ' + n + '.' + table(n)],
          explain: words(n) + ' is ' + n + '.' };
      } },
      { id: 'n2-compare', name: 'Compare and order', code: 'B1.2', gen: function (lv) {
        if (lv < 3) {
          var a, b;
          if (lv === 1) { a = R.int(10, 99); b = R.int(10, 99); }
          else { a = R.int(60, 200); b = R.pick([a + R.pick([-1, 1]) * R.pick([1, 10, 20]), R.int(60, 200), String(a).split('').reverse().join('') * 1]); }
          if (b === a || b > 200 || b < 0) b = a > 100 ? a - 11 : a + 11;
          var sym = a > b ? '&gt;' : '&lt;';
          return { q: 'Which symbol makes this true? <span class="math big">' + a + ' &#9633; ' + b + '</span>', type: 'mc', options: ['&gt;', '&lt;', '='], answer: a > b ? 0 : 1,
            fig: '<div class="vrow"><figure><figcaption>' + a + '</figcaption>' + D.num10(a, { u: 5 }) + '</figure><figure><figcaption>' + b + '</figcaption>' + D.num10(b, { u: 5 }) + '</figure></div>',
            hint: 'Compare the biggest place first. Then decide: the open side faces the greater number.',
            steps: ['Look at the hundreds, then the tens, then the ones.', (a > b ? a + ' is greater.' : b + ' is greater.'), 'The open side faces ' + Math.max(a, b) + ': ' + a + ' ' + sym + ' ' + b + '.'],
            explain: a + ' ' + sym + ' ' + b + '.' };
        }
        var nums = R.shuffle([R.int(30, 99), R.int(100, 140), R.int(141, 200)]);
        while (nums[0] === nums[1]) nums[1]++;
        var up = nums.slice().sort(function (x, y) { return x - y; });
        var o = R.mc(up.join(', '), [up.slice().reverse().join(', '), [up[1], up[0], up[2]].join(', '), [up[0], up[2], up[1]].join(', ')]);
        return { q: 'Put <span class="math">' + nums.join(', ') + '</span> in order from <b>least to greatest</b>.', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Find the least number first. A number with no hundreds is less than one with hundreds.',
          steps: ['The least number is ' + up[0] + '.', 'Next is ' + up[1] + ', then ' + up[2] + '.', D.hops({ min: 0, max: 200, tick: 10, every: 50, id: 'ho', marks: up.map(function (v, i) { return { v: v, t: String(v), up: i % 2 === 0 }; }), bottom: 62 })],
          explain: 'From least to greatest: ' + up.join(', ') + '.' };
      } },
      { id: 'n2-skip', name: 'Skip counting', code: 'B1.4', gen: function (lv) {
        var k = lv === 1 ? R.pick([2, 5, 10]) : R.pick([20, 25, 50]), st = lv === 3 ? R.pick([k === 25 ? 75 : k === 50 ? 50 : 40, 100, k * R.int(1, 3)]) : k * R.int(0, 3);
        if (lv === 3 && k === 20) st = R.pick([10, 30, 50]) + 100 * R.int(0, 1);
        var seq = [];
        for (var i = 0; i < 5; i++) seq.push(st + i * k);
        if (seq[4] > 200) { st = 0; seq = [0, k, 2 * k, 3 * k, 4 * k]; }
        var miss = lv === 1 ? 4 : R.int(1, 4), shown = seq.map(function (v, i) { return i === miss ? '___' : v; });
        var hops = [];
        for (var j = 1; j < 5; j++) hops.push({ a: seq[j - 1], b: seq[j], t: '+' + k });
        return { q: 'Count by ' + k + 's. What number is missing? <span class="math big">' + shown.join(', ') + '</span>', type: 'num', answer: seq[miss],
          fig: lv === 1 ? D.hops({ min: Math.floor(seq[0] / 10) * 10, max: Math.ceil(seq[4] / 10) * 10, tick: k < 10 ? 1 : 5, every: k < 10 ? 5 : 10, id: 'hk', hops: hops.slice(0, miss - 1).concat([]), marks: [] }) : '',
          hint: 'Each jump adds ' + k + '. Start at the number before the gap and add ' + k + '.',
          steps: ['The numbers go up by ' + k + ' each time.', 'The number before the gap is ' + seq[miss - 1] + '.', seq[miss - 1] + ' + ' + k + ' = ' + seq[miss] + '.'],
          explain: seq[miss - 1] + ' + ' + k + ' = ' + seq[miss] + '. The full count is ' + seq.join(', ') + '.' };
      } },
      { id: 'n2-estimate', name: 'Estimate how many', code: 'B1.3', gen: function (lv) {
        var n = lv === 1 ? R.int(15, 45) : lv === 2 ? R.int(45, 120) : R.int(120, 195), choices = lv === 1 ? [10, 20, 30, 40, 50, 100] : [20, 50, 80, 100, 150, 200];
        var best = choices.reduce(function (a, b) { return Math.abs(b - n) < Math.abs(a - n) ? b : a; });
        var wrong = R.shuffle(choices.filter(function (c) { return Math.abs(c - n) >= (lv === 1 ? 12 : 30); })).slice(0, 2);
        var o = R.mc(String(best), wrong.map(String)), sd = R.int(1, 9999);
        return { q: 'About how many dots? Choose the best estimate.', type: 'mc', options: o.options, answer: o.answer, fig: scatter(n, sd, false),
          hint: 'Picture a group of 10 dots. About how many groups like that are in the picture?',
          steps: ['Look at one small patch of about 10 dots.', 'About ' + Math.round(n / 10) + ' patches like that fill the picture.', 'Here are the same dots lined up in tens. There are ' + n + '.<div class="fig">' + rows10(n) + '</div>'],
          explain: 'There are ' + n + ' dots. ' + best + ' is the closest estimate.' };
      } },
      { id: 'n2-evenodd', name: 'Even or odd', code: 'B1.5', gen: function (lv) {
        if (lv === 1) {
          var m = R.int(3, 16);
          return { q: 'Is this number of blocks even or odd?', type: 'mc', options: ['Even', 'Odd'], answer: m % 2, fig: pairs(m).replace(/aria-label="[^"]*"/, 'aria-label="' + m + ' blocks in pairs"'),
            hint: 'Does every block have a partner?', steps: ['Look at each column of two.', m % 2 ? 'The last block has no partner.' : 'Every block has a partner.', m + ' is ' + (m % 2 ? 'odd.' : 'even.')], explain: m + ' is ' + (m % 2 ? 'odd' : 'even') + '.' };
        }
        if (lv === 2) {
          var n = R.int(20, 199);
          return { q: 'Is <span class="math big">' + n + '</span> even or odd?', type: 'mc', options: ['Even', 'Odd'], answer: n % 2,
            hint: 'Only the ones digit decides. Is it 0, 2, 4, 6 or 8?', steps: ['The ones digit of ' + n + ' is ' + n % 10 + '.', n % 10 + ' is ' + (n % 2 ? 'odd' : 'even') + '.', 'So ' + n + ' is ' + (n % 2 ? 'odd.' : 'even.')], explain: n + ' ends in ' + n % 10 + ', so it is ' + (n % 2 ? 'odd' : 'even') + '.' };
        }
        var want = R.pick(['even', 'odd']), list = [], r = want === 'even' ? 0 : 1;
        list.push(2 * R.int(20, 99) + r);
        while (list.length < 4) { var x = 2 * R.int(10, 99) + 1 - r; if (list.indexOf(x) < 0) list.push(x); }
        var o = R.mc(String(list[0]), list.slice(1).map(String));
        return { q: 'Which number is <b>' + want + '</b>?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Look at the ones digit of each number. ' + (want === 'even' ? 'Even numbers end in 0, 2, 4, 6 or 8.' : 'Odd numbers end in 1, 3, 5, 7 or 9.'),
          steps: ['Cover all but the last digit of each number.', 'The ones digits are ' + list.map(function (v) { return v % 10; }).join(', ') + '.', 'Only ' + list[0] + ' ends in an ' + want + ' digit.'],
          explain: list[0] + ' ends in ' + list[0] % 10 + ', so it is ' + want + '.' };
      } }
    ]
  });
  /* ---------- more ways to ask each practice skill (answer checks: tests/verify/grade2.js) ---------- */
  var K = A.kit, why = K.why, who = K.who;
  function blankPairs(n) { return pairs(n).replace(/aria-label="[^"]*"/, 'aria-label="' + n + ' blocks in pairs"').replace(/<circle[^>]*stroke-dasharray="4 3"\/>/, ''); }
  function twoDigit(lv) { return lv === 1 ? R.int(21, 99) : R.int(101, 199); }
  Atlas.Q.shapes('numbers-200', {
    'n2-blocks': [
      [1, 'build', function (lv) {
        var n = twoDigit(lv), d = hto(n);
        return { q: 'Show <b>' + n + '</b> with base-ten blocks. Then press Check.', type: 'build', tool: 'base10', answer: n,
          hint: 'A rod is 10. A small cube is 1.' + (d[0] ? ' A flat is 100.' : ''),
          steps: [n + ' is ' + htoWords(n) + '.', 'Add ' + (d[0] ? d[0] + ' flat, ' : '') + d[1] + ' rods and ' + d[2] + ' small cubes.'],
          explain: htoWords(n) + ' make ' + n + '.', meta: { k: 'n2-build', n: n } };
      }],
      [1, 'tap', function (lv) {
        var n = twoDigit(lv), d = hto(n);
        if (d[1] === d[2]) d[2] = (d[2] + 3) % 10;
        n = d[0] * 100 + d[1] * 10 + d[2];
        var swap = d[0] * 100 + d[2] * 10 + d[1], near = n + (d[1] < 9 ? 10 : -10), set = R.shuffle([n, swap, near].filter(function (v, i, a) { return a.indexOf(v) === i; }));
        return { q: 'Which blocks show <b>' + n + '</b>? Tap them.', type: 'tap', tiles: set.map(function (v) { return D.num10(v, { u: 5 }); }), answer: set.indexOf(n), answerText: 'the blocks with ' + htoWords(n),
          hint: 'Count the rods first. ' + n + ' needs ' + d[1] + ' rods.', steps: ['Look for ' + d[1] + ' rods.', 'Then check for ' + d[2] + ' small cubes.'],
          explain: n + ' is ' + htoWords(n) + '.', meta: { k: 'n2-blocks-tap', n: n, set: set } };
      }],
      [2, 'mistake', function (lv) {
        var n = R.int(101, 199), d = hto(n), name = who();
        if (d[1] === d[2]) { d[2] = (d[2] + 4) % 10; n = 100 + d[1] * 10 + d[2]; }
        var truth = !R.int(0, 2), said = truth ? n : 100 + d[2] * 10 + d[1];
        var right = 'There is 1 flat, ' + pl(d[1], 'rod', 'rods') + ' and ' + pl(d[2], 'small cube', 'small cubes') + ', so the blocks show ' + n + '.';
        return { q: name + ' says these blocks show <b>' + said + '</b>. True or false: ' + name + ' is right.', type: 'tf', answer: truth, fig: D.num10(n, {}),
          why: why(right, ['Count the small cubes before the rods.', 'Every block is worth 1, so just count the blocks.', 'Rods are worth 100 each.']),
          hint: 'Count the flat, then the rods, then the small cubes.', steps: [right], explain: right, meta: { k: 'n2-blocks-tf', n: n, said: said } };
      }]
    ],
    'n2-place': [
      [1, 'fill', function (lv) {
        var n = twoDigit(lv), d = hto(n);
        if (n < 100) return { q: 'Fill in the blanks.', type: 'fill', fill: '<span class="math">' + n + '</span> = [[]] tens and [[]] ones', answers: [d[1], d[2]],
          hint: 'The left digit tells the tens. The right digit tells the ones.', steps: ['Read the digits: ' + d[1] + ' then ' + d[2] + '.'],
          explain: n + ' = ' + pl(d[1], 'ten', 'tens') + ' and ' + pl(d[2], 'one', 'ones') + '.', meta: { k: 'n2-place-fill', n: n } };
        return { q: 'Fill in the blanks.', type: 'fill', fill: '<span class="math">' + n + '</span> = [[]] hundred, [[]] tens and [[]] ones', answers: d,
          hint: 'Read the digits from left to right: hundreds, tens, ones.', steps: ['The digits are ' + d.join(', ') + '.'],
          explain: n + ' = ' + htoWords(n) + '.', meta: { k: 'n2-place-fill', n: n } };
      }],
      [1, 'match', function (lv) {
        var pairsL = [], seen = {};
        while (pairsL.length < 3) {
          var n = twoDigit(lv); if (seen[n] || seen[hto(n)[2] * 10 + hto(n)[1]]) continue; seen[n] = 1;
          var d = hto(n);
          pairsL.push([(d[0] ? '1 hundred, ' : '') + pl(d[1], 'ten', 'tens') + ', ' + pl(d[2], 'one', 'ones'), String(n)]);
        }
        return { q: 'Match each set of tens and ones to its number.', type: 'match', pairs: pairsL,
          hint: 'The tens are the left digit of a two-digit number. The ones are the right digit.', steps: ['3 tens and 4 ones is 34. Do the same for each card.'],
          explain: pairsL.map(function (p) { return p[0] + ' = ' + p[1]; }).join('. ') + '.', meta: { k: 'n2-place-match', pairs: pairsL } };
      }],
      [2, 'story', function (lv) {
        var c = R.pick([['marbles', 'bags of 10'], ['stickers', 'strips of 10'], ['crayons', 'boxes of 10'], ['hockey cards', 'packs of 10']]);
        var n = R.int(23, 99), name = who();
        return { q: name + ' has ' + n + ' ' + c[0] + '. They are put in ' + c[1] + ', with some left over. How many full ' + c[1].split(' ')[0] + ' are there?', type: 'num', answer: Math.floor(n / 10),
          hint: 'Each full ' + c[1].split(' ')[0].replace(/(es|s)$/, '') + ' is one ten. How many tens are in ' + n + '?', steps: [n + ' is ' + Math.floor(n / 10) + ' tens and ' + n % 10 + ' ones.', 'The ones are left over.'],
          explain: n + ' has ' + Math.floor(n / 10) + ' tens, so there are ' + Math.floor(n / 10) + ' full ' + c[1].split(' ')[0] + '.', meta: { k: 'n2-place-story', n: n } };
      }]
    ],
    'n2-words': [
      [1, 'match', function (lv) {
        var list = [], seen = {};
        while (list.length < 3) { var n = lv === 1 ? R.int(13, 99) : R.int(101, 199); if (!seen[n]) { seen[n] = 1; list.push(n); } }
        var p = list.map(function (n) { return [words(n), String(n)]; });
        return { q: 'Match each number word to its number.', type: 'match', pairs: p,
          hint: 'Read the tens word first, like "forty", then the ones word.', steps: ['"Forty-six" is 4 tens and 6 ones: 46.'],
          explain: p.map(function (x) { return x[0] + ' = ' + x[1]; }).join('. ') + '.', meta: { k: 'n2-words-match', pairs: p } };
      }],
      [1, 'tap', function (lv) {
        var n = lv === 1 ? R.int(13, 99) : R.int(110, 199), d = hto(n);
        if (d[1] === d[2] || d[2] === 0) { d[2] = (d[1] + 2) % 9 + 1; n = d[0] * 100 + d[1] * 10 + d[2]; }
        var swap = d[0] * 100 + d[2] * 10 + d[1], set = R.shuffle([n, swap, n + (n < 190 ? 10 : -10)].filter(function (v, i, a) { return a.indexOf(v) === i && v >= 10; }));
        return { q: 'Tap the number <b>' + words(n) + '</b>.', type: 'tap', tiles: set.map(function (v) { return '<span class="math big">' + v + '</span>'; }), answer: set.indexOf(n), answerText: String(n),
          hint: 'Which digit goes in the tens place?', steps: ['"' + words(n % 100 >= 20 ? Math.floor(n % 100 / 10) * 10 : n % 100) + '" tells the tens.'],
          explain: '"' + words(n) + '" is ' + n + '.', meta: { k: 'n2-words-tap', set: set } };
      }],
      [2, 'mistake', function (lv) {
        var n = R.int(110, 199), d = hto(n), name = who();
        if (d[1] === d[2] || d[2] === 0) { d[2] = (d[1] + 2) % 9 + 1; n = 100 + d[1] * 10 + d[2]; }
        var truth = !R.int(0, 2), said = truth ? n : 100 + d[2] * 10 + d[1];
        var right = '"' + words(n) + '" is 1 hundred, ' + pl(d[1], 'ten', 'tens') + ' and ' + pl(d[2], 'one', 'ones') + ': ' + n + '.';
        return { q: name + ' wrote <b>' + words(n) + '</b> as <span class="math big">' + said + '</span>. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['The ones word comes first, so the ones digit comes first.', 'Write "one hundred" as 100, then put the rest after it.', 'Number words are read from right to left.']),
          hint: 'Say the number word slowly. Hundreds, then tens, then ones.', steps: [right], explain: right, meta: { k: 'n2-words-tf', n: n, said: said } };
      }]
    ],
    'n2-compare': [
      [1, 'order', function (lv) {
        var list = [], seen = {}, big = lv === 3 && R.int(0, 1) === 1;
        while (list.length < 4) { var n = lv === 1 ? R.int(10, 99) : R.int(60, 200); if (!seen[n]) { seen[n] = 1; list.push(n); } }
        list.sort(function (a, b) { return big ? b - a : a - b; });
        return { q: 'Put these numbers in order from ' + (big ? 'greatest to least' : 'least to greatest') + '.', type: 'order', items: list.map(String), first: big ? 'greatest' : 'least', last: big ? 'least' : 'greatest',
          hint: 'Compare the hundreds first, then the tens, then the ones.', steps: ['Find the ' + (big ? 'greatest' : 'least') + ' number first: ' + list[0] + '.'],
          explain: list.join(', ') + '.', meta: { k: 'n2-order', big: big } };
      }],
      [1, 'line', function (lv) {
        var n, min, max;
        if (lv === 1) { min = 0; max = 100; n = R.int(1, 9) * 10; }
        else { min = 100; max = 200; n = 100 + R.int(1, 19) * 5; }
        return { q: 'Put <b>' + n + '</b> on the number line.', type: 'line', min: min, max: max, tick: lv === 1 ? 10 : 5, every: lv === 1 ? 10 : 50, snap: lv === 1 ? 10 : 5, answer: n,
          hint: 'Find the ' + (lv === 1 ? 'tens' : 'hundreds and tens') + ' on the line. Each small mark is ' + (lv === 1 ? 10 : 5) + '.', steps: [n + ' is between ' + Math.floor(n / 10) * 10 + ' and ' + (Math.floor(n / 10) * 10 + 10) + '.'],
          explain: n + ' sits ' + (n - min) / (lv === 1 ? 10 : 5) + ' marks after ' + min + '.', meta: { k: 'n2-line', n: n } };
      }],
      [2, 'story', function (lv) {
        var two = A.Q.two(), a = R.int(60, 199), b = R.int(60, 199), less = R.int(0, 1) === 1;
        if (a === b) b = a > 100 ? a - 12 : a + 12;
        var c = R.pick(['hockey cards', 'stickers', 'coins', 'books', 'rocks']);
        return { q: two[0] + ' has ' + a + ' ' + c + '. ' + two[1] + ' has ' + b + ' ' + c + '. Who has <b>' + (less ? 'fewer' : 'more') + '</b>?', type: 'mc', options: [two[0], two[1]], answer: (less ? a < b : a > b) ? 0 : 1,
          hint: 'Compare ' + a + ' and ' + b + '. Look at the hundreds, then the tens.', steps: [a + (a > b ? ' &gt; ' : ' &lt; ') + b + '.'],
          explain: (a > b ? two[0] : two[1]) + ' has more. ' + (a < b ? two[0] : two[1]) + ' has fewer.', meta: { k: 'n2-cmp-story', a: a, b: b, less: less } };
      }]
    ],
    'n2-skip': [
      [1, 'order', function (lv) {
        var by = lv === 1 ? R.pick([2, 5, 10]) : R.pick([5, 10, 20, 25]), st = by * R.int(0, lv === 1 ? 5 : 3), seq = [];
        for (var i = 0; i < 5; i++) seq.push(st + i * by);
        return { q: 'Count by <b>' + by + 's</b>. Put the numbers in order.', type: 'order', items: seq.map(String), first: 'first', last: 'last',
          hint: 'Start with the smallest. Add ' + by + ' each time.', steps: ['Start at ' + seq[0] + '. Then ' + seq[1] + '.'],
          explain: seq.join(', ') + '.', meta: { k: 'n2-skip-order', by: by } };
      }],
      [1, 'line', function (lv) {
        var by = lv === 1 ? 10 : lv === 2 ? 5 : R.pick([20, 25]), max = by * 10, k = R.int(3, 8);
        return { q: 'Start at 0. Jump by <b>' + by + 's</b>, <b>' + k + '</b> jumps. Where do you land?', type: 'line', min: 0, max: max, tick: by, every: by * 2, snap: by, answer: by * k, hideValue: true,
          hint: 'Count by ' + by + 's, one number for each jump.', steps: ['Count ' + k + ' jumps: ' + Array.apply(null, Array(k)).map(function (_, i) { return by * (i + 1); }).join(', ') + '.'],
          explain: k + ' jumps of ' + by + ' land on ' + by * k + '.', meta: { k: 'n2-skip-line', by: by, n: k } };
      }],
      [2, 'fill', function (lv) {
        var by = R.pick([5, 10, 20, 25]), st = by * R.int(1, 3), s = [];
        for (var i = 0; i < 5; i++) s.push(st + i * by);
        return { q: 'Count by ' + by + 's. Fill in the missing numbers.', type: 'fill', fill: s[0] + ', ' + s[1] + ', [[]], ' + s[3] + ', [[]]', answers: [s[2], s[4]],
          hint: 'Add ' + by + ' to the number before each gap.', steps: [s[1] + ' + ' + by + ' = ' + s[2] + '.', s[3] + ' + ' + by + ' = ' + s[4] + '.'],
          explain: s.join(', ') + '.', meta: { k: 'n2-skip-fill', by: by } };
      }]
    ],
    'n2-estimate': [
      [1, 'tap', function (lv) {
        var counts = R.shuffle(lv === 1 ? [10, 30, 60] : [20, 60, 120]), target = R.pick(counts), sd = R.int(1, 999);
        return { q: 'Tap the picture with <b>about ' + target + '</b> dots.', type: 'tap', tiles: counts.map(function (n, i) { return scatter(n, sd + i, false); }), answer: counts.indexOf(target), answerText: 'the picture with ' + target + ' dots',
          hint: 'Picture a group of 10 dots. Which picture has about ' + target / 10 + ' groups like that?', steps: ['Few dots, some dots, many dots. ' + target + ' is ' + (target === Math.min.apply(null, counts) ? 'the fewest' : target === Math.max.apply(null, counts) ? 'the most' : 'in the middle') + '.'],
          explain: 'That picture has ' + target + ' dots.', meta: { k: 'n2-est-tap', counts: counts, target: target } };
      }],
      [1, 'story', function (lv) {
        var per = 10, rows = lv === 1 ? R.int(2, 5) : R.int(6, 15), name = who(), c = R.pick([['cars', 'row of the parking lot', 'rows'], ['chairs', 'row in the gym', 'rows'], ['apples', 'basket', 'baskets'], ['books', 'shelf', 'shelves']]);
        var real = per * rows, opts = [real, real < 100 ? real + 50 : real - 50, real > 20 ? Math.round(real / 2 / 10) * 10 : real + 100].filter(function (v, i, a) { return a.indexOf(v) === i && v > 0; });
        var o = R.mc(String(real), opts.slice(1).map(String));
        return { q: name + ' counts about 10 ' + c[0] + ' in one ' + c[1] + '. There are ' + rows + ' ' + c[2] + ' about the same. About how many ' + c[0] + ' are there?', type: 'mc', options: o.options, answer: o.answer,
          hint: 'Count by 10s, once for each ' + c[1].split(' ')[0] + '.', steps: ['Count by 10s ' + rows + ' times.'],
          explain: rows + ' groups of about 10 is about ' + real + '.', meta: { k: 'n2-est-story', per: per, rows: rows } };
      }],
      [2, 'mistake', function (lv) {
        var n = R.int(25, 180), choices = [20, 50, 100, 150, 200], best = choices.reduce(function (a, b) { return Math.abs(b - n) < Math.abs(a - n) ? b : a; }), name = who();
        var truth = !R.int(0, 2), said = truth ? best : R.pick(choices.filter(function (c) { return Math.abs(c - n) > 40; }));
        var right = 'There are ' + n + ' dots. The closest of 20, 50, 100, 150 and 200 is ' + best + '.';
        return { q: name + ' says there are <b>about ' + said + '</b> dots. True or false: ' + said + ' is the best estimate from 20, 50, 100, 150 and 200.', type: 'tf', answer: truth, fig: scatter(n, R.int(1, 999), false),
          why: why(right, ['Always guess 100. It is a nice round number.', 'You must count every dot to estimate.', 'Big pictures always have fewer dots.']),
          hint: 'Picture a group of 10 dots. About how many groups?', steps: [right], explain: right, meta: { k: 'n2-est-tf', n: n, said: said } };
      }]
    ],
    'n2-evenodd': [
      [1, 'tap', function (lv) {
        var want = R.pick(['even', 'odd']), r = want === 'even' ? 0 : 1, set = [];
        set.push(2 * R.int(2, 8) + r);
        while (set.length < 3) { var m = 2 * R.int(2, 8) + 1 - r; if (set.indexOf(m) < 0) set.push(m); }
        set = R.shuffle(set);
        var ans = set.filter(function (m) { return m % 2 === r; })[0];
        return { q: 'Tap the group with an <b>' + want + '</b> number of blocks.', type: 'tap', tiles: set.map(blankPairs), answer: set.indexOf(ans), answerText: 'the group of ' + ans,
          hint: want === 'even' ? 'Even: every block has a partner.' : 'Odd: one block has no partner.', steps: ['Look at the last column of each group. Is there one block on its own?'],
          explain: ans + ' is ' + want + '.', meta: { k: 'n2-eo-tap', set: set, want: want } };
      }],
      [1, 'pick', function (lv) {
        var want = R.pick(['even', 'odd']), r = want === 'even' ? 0 : 1, opts = [], hi = lv === 1 ? 30 : 199;
        while (opts.length < 5) { var v = R.int(2, hi); if (opts.indexOf(v) < 0) opts.push(v); }
        var ans = opts.map(function (v, j) { return v % 2 === r ? j : -1; }).filter(function (j) { return j >= 0; });
        if (!ans.length || ans.length === 5) { opts[0] = opts[0] % 2 === r ? opts[0] + 1 : opts[0]; opts[1] = opts[1] % 2 === r ? opts[1] : opts[1] + 1; if (opts[1] === opts[0]) opts[1] += 2; ans = opts.map(function (v, j) { return v % 2 === r ? j : -1; }).filter(function (j) { return j >= 0; }); }
        return { q: 'Pick every <b>' + want + '</b> number.', type: 'pick', options: opts.map(String), answer: ans,
          hint: 'Look only at the ones digit. Even numbers end in 0, 2, 4, 6 or 8.', steps: ['Check the last digit of each number.'],
          explain: ans.map(function (j) { return opts[j]; }).join(', ') + ' ' + (ans.length > 1 ? 'are' : 'is') + ' ' + want + '.', meta: { k: 'n2-eo-pick', opts: opts, want: want } };
      }],
      [2, 'mistake', function (lv) {
        var t = R.int(1, 9), o = R.int(0, 9), name = who();
        if (t % 2 === o % 2) o = (o + 1) % 10;
        var n = 100 + t * 10 + o, said = t % 2 ? 'odd' : 'even', truth = said === (n % 2 ? 'odd' : 'even');
        var right = 'Only the ones digit decides. ' + n + ' ends in ' + o + ', so it is ' + (n % 2 ? 'odd' : 'even') + '.';
        return { q: name + ' says <span class="math big">' + n + '</span> is <b>' + said + '</b> because ' + t + ' is ' + said + '. True or false: ' + name + ' is right.', type: 'tf', answer: truth,
          why: why(right, ['The tens digit decides if a number is even or odd.', 'Big numbers are always even.', 'Numbers over 100 are always odd.']),
          hint: 'Which digit decides even or odd?', steps: [right], explain: right, meta: { k: 'n2-eo-tf', n: n, said: said } };
      }]
    ]
  });
})();
