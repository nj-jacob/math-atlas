/* Math Plan question bank: Grades 1 to 8, six areas.
   Each entry: g = grade, a = area, e = Ontario 2020 expectation code, m(r) makes one question from random numbers r.
   A question: { text, vis (drawing), why (one-line explanation), and either choices + ans (index) or type 'num' + ans }.
   Areas: num = numbers, ops = operations, alg = patterns and algebra, data = data and probability,
   space = shapes and measuring, money = money and finance. */
(function () {
  var V = window.PV, fmt = V.fmt, fr = V.fr, mc = V.mc, B = [];
  function add(g, a, e, m) { B.push({ g: g, a: a, e: e, m: m, id: 'g' + g + a + '-' + B.filter(function (b) { return b.g === g && b.a === a; }).length }); }
  function Q(text, vis, ch, why, extra) { var q = { text: text, vis: vis || '', why: why || '' }; for (var k in ch) q[k] = ch[k]; for (k in extra || {}) q[k] = extra[k]; return q; }
  function near(r, n, spread, min) { var out = [], tries = 0; while (out.length < 3 && tries++ < 50) { var v = n + r.int(-spread, spread); if (v !== n && v >= (min || 0) && out.indexOf(v) < 0) out.push(v); } return out; }
  function nums(list) { return list.map(function (x) { return typeof x === 'number' ? fmt(x) : x; }); }
  function mcn(r, ans, wrongs) { return mc(r, fmt(ans), wrongs.map(function (w) { return fmt(w); })); }
  var TAP = 'Touch the pieces to count them.';

  /* =================== GRADE 1 =================== */
  add(1, 'num', 'B1.1', function (r) {
    var n = r.int(11, 30);
    return Q('How many counters are there?', V.frames(n), V.num(n), 'Each full frame holds 10. Count the full frames by 10s, then count on by 1s.', { hint: TAP });
  });
  add(1, 'num', 'B1.3', function (r) {
    var a = r.int(12, 49), b; do { b = r.int(12, 49); } while (b === a || Math.floor(b / 10) === Math.floor(a / 10) && Math.abs(a - b) < 2);
    var c; do { c = r.int(10, 49); } while (c === a || c === b);
    var big = Math.max(a, b, c);
    return Q('Which number is the greatest?', '', mcn(r, big, [a, b, c].filter(function (x) { return x !== big; })), 'Look at the tens digit first. More tens means a greater number.');
  });
  add(1, 'num', 'B1.5', function (r) {
    var by = r.pick([2, 5, 10]), st = by * r.int(1, 3), seq = [st, st + by, st + 2 * by, st + 3 * by];
    var ans = st + 4 * by;
    return Q('Count by ' + by + 's. What comes next?<br><b class="big">' + seq.join(', ') + ', ?</b>', '', mcn(r, ans, [ans + 1, ans - by + 1, ans + by, st + 5]), 'Each number is ' + by + ' more than the one before.');
  });
  add(1, 'num', 'B1.2', function (r) {
    var t = r.int(1, 4), o = r.int(1, 9), n = 10 * t + o;
    return Q('What number do the blocks show?', V.blocks(n, { maxW: 300 }), mcn(r, n, [10 * o + t, n + 10, t + o, n - 1]), t + ' tens and ' + o + ' ones make ' + n + '.', { hint: TAP });
  });
  add(1, 'ops', 'B2.2', function (r) {
    var a = r.int(2, 6), b = r.int(1, 10 - a);
    return Q('What is ' + a + ' + ' + b + '?', V.frames(a + b, { two: a }), V.num(a + b), a + ' and ' + b + ' more make ' + (a + b) + '.', { hint: TAP });
  });
  add(1, 'ops', 'B2.2', function (r) {
    var a = r.int(6, 10), b = r.int(1, a - 1);
    return Q('There are ' + a + ' apples. ' + b + ' are eaten. How many are left?', '', mcn(r, a - b, [a + b, a - b + 1, a - b - 1, b]), a + ' − ' + b + ' = ' + (a - b) + '.');
  });
  add(1, 'ops', 'B2.4', function (r) {
    var a = r.int(6, 12), b = r.int(3, 20 - a);
    return Q('Sam has ' + a + ' stickers. He gets ' + b + ' more. How many stickers does he have now?', '', V.num(a + b), a + ' + ' + b + ' = ' + (a + b) + '.');
  });
  add(1, 'alg', 'C1.3', function (r) {
    var A = r.pick([['c-r', 's-b'], ['t-g', 'c-y'], ['s-r', 't-b'], ['c-b', 'c-y', 's-g']]), seq = [];
    for (var i = 0; i < A.length * 2 + 1; i++) seq.push(A[i % A.length]);
    var ans = A[seq.length % A.length];
    var opts = ['c-r', 's-b', 't-g', 'c-y', 's-r', 't-b', 'c-b', 's-g'];
    var ch = mc(r, ans, r.shuffle(opts.filter(function (o) { return o !== ans; })));
    ch.choices = ch.choices.map(function (c) { return V.pattern([c]); });
    return Q('What comes next in the pattern?', V.pattern(seq.concat(['?'])), ch, 'The pattern repeats: ' + A.length + ' pieces, then it starts again.');
  });
  add(1, 'alg', 'C2.2', function (r) {
    var a = r.int(2, 6), b = r.int(1, 4), s = a + b, c;
    do { c = r.int(1, s - 1); } while (c === a);
    return Q('Which is the same as ' + a + ' + ' + b + '?', '', mc(r, c + ' + ' + (s - c), [c + ' + ' + (s - c + 1), (s + 2) + ' − 1', c + ' + ' + (s - c - 1)].filter(function (x) { return !/\+ 0$/.test(x); }).concat([(a + 1) + ' + ' + (b + 1)])), 'Both make ' + s + '.');
  });
  add(1, 'data', 'D1.4', function (r) {
    var L = ['Cats', 'Dogs', 'Fish'], v = r.shuffle([2, 4, 6].map(function (x) { return x + r.int(0, 1); }));
    var i = v.indexOf(Math.max.apply(null, v));
    return Q('Which pet did the most children choose?', V.picto(L, v, 1), mc(r, L[i], L.filter(function (x, k) { return k !== i; })), L[i] + ' has the longest row.', { hint: TAP });
  });
  add(1, 'data', 'D2.1', function (r) {
    var k = r.int(0, 2), col = r.pick(['red', 'blue']), other = col === 'red' ? 'blue' : 'red', list = [], ans;
    if (k === 0) { for (var i = 0; i < 6; i++) list.push(col); ans = 'certain'; }
    else if (k === 1) { for (i = 0; i < 6; i++) list.push(other); ans = 'impossible'; }
    else { for (i = 0; i < 6; i++) list.push(i % 2 ? col : other); ans = 'possible'; }
    return Q('You pick one marble without looking. Is it impossible, possible or certain that it is <b>' + col + '</b>?', V.marbles(list.map(function (c) { return c === 'red' ? 'm-r' : 'm-b'; })), V.ordered(ans, ['impossible', 'possible', 'certain']),
      ans === 'certain' ? 'Every marble is ' + col + '.' : ans === 'impossible' ? 'There are no ' + col + ' marbles.' : 'Some marbles are ' + col + ', some are not.');
  });
  add(1, 'data', 'D1.5', function (r) {
    var L = ['Apples', 'Pears', 'Plums'], v = [r.int(3, 6), r.int(1, 3), r.int(4, 7)];
    if (v[0] === v[2]) v[2]++;
    return Q('How many more plums than pears are there?', V.picto(L, v, 1), V.num(v[2] - v[1]), v[2] + ' − ' + v[1] + ' = ' + (v[2] - v[1]) + '.', { hint: TAP });
  });
  add(1, 'space', 'E1.1', function (r) {
    var S = [['triangle', 3], ['square', 4], ['rectangle', 4], ['circle', 0]], k = r.pick(S);
    var names = ['triangle', 'square', 'rectangle', 'circle', 'oval'];
    return Q('What is the name of this shape?', V.shape(k[0]), mc(r, k[0], names.filter(function (x) { return x !== k[0]; }).slice(0, 3)), '');
  });
  add(1, 'space', 'E2.2', function (r) {
    var lens = r.shuffle([4, 6, 9, 11].map(function (x) { return x + r.int(0, 1) * 0; })).slice(0, 3), i = lens.indexOf(Math.max.apply(null, lens));
    return Q('Which strip is the longest?', V.lengths(lens), V.ordered('ABC'[i], ['A', 'B', 'C']), 'Line them up at one end. The one that sticks out farthest is longest.');
  });
  add(1, 'space', 'E2.3', function (r) {
    var D = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], i = r.int(0, 5);
    return Q('Which day comes right after ' + D[i] + '?', '', mc(r, D[i + 1], [D[(i + 2) % 7], D[(i + 6) % 7], D[(i + 4) % 7]]), 'The days go: ' + D.join(', ') + '.');
  });
  add(1, 'space', 'E1.4', function (r) {
    var it = r.pick([['above', 'on top of the box'], ['below', 'under the box']]);
    var vis = V.svg(220, 150, '<rect x="70" y="60" width="80" height="50" class="shp"/>' + (it[0] === 'above' ? '<circle cx="110" cy="38" r="20" class="mark"/>' : '<circle cx="110" cy="132" r="16" class="mark"/>'), 'a ball and a box');
    return Q('Where is the ball?', vis, mc(r, it[1], ['beside the box', it[0] === 'above' ? 'under the box' : 'on top of the box', 'inside the box']), '');
  });
  add(1, 'money', 'F1.1', function (r) {
    var c = r.pick([[10, 'dime'], [25, 'quarter'], [5, 'nickel'], [100, 'loonie'], [200, 'toonie']]);
    var names = ['nickel', 'dime', 'quarter', 'loonie', 'toonie'];
    return Q('This coin is worth ' + V.cents(c[0]) + '. What is it called?', V.coins([c[0]]), mc(r, c[1], names.filter(function (n) { return n !== c[1]; })), '');
  });
  add(1, 'money', 'F1.1', function (r) {
    var set = r.shuffle([5, 10, 25, 100, 200]).slice(0, 3), big = Math.max.apply(null, set);
    var nm = V.money.coinName;
    return Q('Which coin is worth the most?', V.coins(set), mc(r, nm[big], set.filter(function (s) { return s !== big; }).map(function (s) { return nm[s]; })), 'A toonie is $2, a loonie is $1, a quarter is 25¢, a dime is 10¢, a nickel is 5¢.');
  });

  /* =================== GRADE 2 =================== */
  add(2, 'num', 'B1.1', function (r) {
    var n = r.int(1, 1) * 100 + r.int(1, 9) * 10 + r.int(0, 9);
    return Q('What number do the blocks show?', V.blocks(n, { maxW: 340 }), V.num(n), 'One flat is 100, each rod is 10, each small cube is 1.', { hint: TAP });
  });
  add(2, 'num', 'B1.2', function (r) {
    var a = r.int(100, 199), b = a + r.pick([-10, 10, 1, -1, 9]), c = r.int(60, 99), list = [a, b, c];
    var big = Math.max.apply(null, list);
    return Q('Which number is the greatest?', '', mcn(r, big, list.filter(function (x) { return x !== big; }).concat([big - 100])), 'Compare hundreds, then tens, then ones.');
  });
  add(2, 'num', 'B1.4', function (r) {
    var by = r.pick([20, 25, 50]), st = by * r.int(0, 2), seq = [st, st + by, st + 2 * by];
    var ans = st + 3 * by;
    return Q('Count by ' + by + 's. What comes next?<br><b class="big">' + seq.join(', ') + ', ?</b>', '', mcn(r, ans, [ans + 10, ans - 5, ans + by, ans + 1]), 'Each number is ' + by + ' more.');
  });
  add(2, 'num', 'B1.5', function (r) {
    var n = r.int(11, 99), ev = n % 2 === 0;
    return Q('Is <b>' + n + '</b> even or odd?', n <= 30 ? V.frames(n, { cols: 3 }) : '', V.ordered(ev ? 'even' : 'odd', ['even', 'odd']), 'Even numbers end in 0, 2, 4, 6 or 8. They make pairs with none left over.');
  });
  add(2, 'ops', 'B2.2', function (r) {
    var a = r.int(6, 9), b = r.int(5, 9);
    return Q('What is ' + a + ' + ' + b + '?', '', mcn(r, a + b, [a + b + 1, a + b - 1, a + b + 10, a * b > 30 ? a + b - 2 : a * b]), 'Make a 10 first: ' + a + ' + ' + (10 - a) + ' = 10, then add ' + (b - 10 + a) + ' more.');
  });
  add(2, 'ops', 'B2.2', function (r) {
    var a = r.int(11, 18), b = r.int(a - 9, 9);
    return Q('What is ' + a + ' − ' + b + '?', '', V.num(a - b), 'Think addition: ' + b + ' + ? = ' + a + '.');
  });
  add(2, 'ops', 'B2.4', function (r) {
    var a = r.int(2, 5) * 10 + r.int(1, 4), b = r.int(1, 4) * 10 + r.int(1, 5);
    return Q('A class has ' + a + ' red beads and ' + b + ' blue beads. How many beads altogether?', V.blocks(a, { maxW: 200 }) + V.blocks(b, { maxW: 200 }), V.num(a + b), 'Add the tens, then add the ones.', { hint: TAP });
  });
  add(2, 'ops', 'B2.5', function (r) {
    var g = r.int(2, 4), e = r.int(2, 5);
    return Q('How many counters are there in ' + g + ' groups of ' + e + '?', V.groups(g, e), mcn(r, g * e, [g + e, g * e + 1, g * e - e, g * e + e]), g + ' groups of ' + e + ' is ' + Array(g).fill(e).join(' + ') + ' = ' + g * e + '.', { hint: TAP });
  });
  add(2, 'ops', 'B2.6', function (r) {
    var p = r.int(2, 4), each = r.int(2, 3), n = p * each;
    return Q(n + ' cookies are shared equally by ' + p + ' friends. How many cookies does each friend get?', '', mcn(r, each, [each + 1, n - p, each + 2, p]), n + ' shared into ' + p + ' equal groups is ' + each + ' in each group.');
  });
  add(2, 'alg', 'C1.3', function (r) {
    var by = r.int(2, 5), st = r.int(1, 10), seq = [0, 1, 2, 3, 4].map(function (i) { return st + i * by; }), gap = r.int(1, 3), ans = seq[gap];
    var shown = seq.map(function (v, i) { return i === gap ? '?' : v; });
    return Q('What is the missing number?<br><b class="big">' + shown.join(', ') + '</b>', '', mcn(r, ans, [ans + 1, ans - 1, ans + by]), 'The rule is: add ' + by + ' each time.');
  });
  add(2, 'alg', 'C2.2', function (r) {
    var a = r.int(5, 9), b = r.int(4, 9), c = r.int(2, a - 1);
    var ans = a + b - c;
    return Q('What number makes this true?<br><b class="big">' + a + ' + ' + b + ' = ' + c + ' + ?</b>', V.balance(a + ' + ' + b, c + ' + ?'), V.num(ans), 'Both sides must be the same: ' + (a + b) + ' = ' + c + ' + ' + ans + '.');
  });
  add(2, 'data', 'D1.4', function (r) {
    var L = ['Red', 'Blue', 'Green', 'Yellow'], v = r.shuffle([2, 3, 5, 7]);
    var i = v.indexOf(7);
    return Q('The graph shows favourite colours. What is the mode (the most common colour)?', V.bars(L, v, 1), mc(r, L[i], L.filter(function (x, k) { return k !== i; })), 'The mode is the one that appears most often: the tallest bar.', { hint: 'Touch a bar to see its number.' });
  });
  add(2, 'data', 'D1.5', function (r) {
    var L = ['Soccer', 'Hockey', 'Swim'], v = [0, r.int(2, 5), r.int(1, 8)];
    v[0] = v[1] + r.int(1, 5);
    return Q('How many more children chose soccer than hockey?', V.bars(L, v, 1), V.num(v[0] - v[1]), 'Soccer ' + v[0] + ' − hockey ' + v[1] + ' = ' + (v[0] - v[1]) + '.', { hint: 'Touch a bar to see its number.' });
  });
  add(2, 'data', 'D2.1', function (r) {
    var E = [['The sun will rise tomorrow.', 'certain'], ['A cat will drive a bus to school.', 'impossible'], ['It will rain next week.', 'possible'], ['You will roll a 7 on a regular number cube (1 to 6).', 'impossible'], ['You will get heads when you flip a coin.', 'possible']];
    var k = r.pick(E);
    return Q('Is this impossible, possible or certain?<br><b>' + k[0] + '</b>', '', V.ordered(k[1], ['impossible', 'possible', 'certain']), '');
  });
  add(2, 'space', 'E1.1', function (r) {
    var k = r.pick([[5, 'pentagon'], [6, 'hexagon'], [8, 'octagon'], [4, 'quadrilateral']]);
    return Q('How many sides does this shape have?', V.poly(k[0]), mcn(r, k[0], [k[0] + 1, k[0] - 1, k[0] + 2]), 'Touch each side as you count. It is a ' + k[1] + '.');
  });
  add(2, 'space', 'E2.3', function (r) {
    var L = r.int(3, 9);
    return Q('How long is the pencil?', V.ruler(L, 0), mc(r, L + ' cm', [(L + 1) + ' cm', (L - 1) + ' cm', (L + 2) + ' cm']), 'It starts at 0 and ends at ' + L + '.');
  });
  add(2, 'space', 'E2.4', function (r) {
    var k = r.pick([['brush your teeth', '2 minutes', ['2 hours', '2 seconds', '2 days']], ['sleep at night', '10 hours', ['10 minutes', '10 seconds', '10 weeks']], ['blink your eyes', '1 second', ['1 hour', '1 day', '1 minute']], ['watch a movie', '2 hours', ['2 seconds', '2 minutes', '2 months']]]);
    return Q('About how long does it take to ' + k[0] + '?', '', mc(r, k[1], k[2]), '');
  });
  add(2, 'space', 'E2.2', function (r) {
    var k = r.pick([['a door', 'metres'], ['a crayon', 'centimetres'], ['a school hallway', 'metres'], ['an eraser', 'centimetres']]);
    return Q('Would you measure the length of ' + k[0] + ' in centimetres or metres?', '', V.ordered(k[1], ['centimetres', 'metres']), 'A centimetre is about the width of a fingertip. A metre is about one big step.');
  });
  add(2, 'money', 'F1.1', function (r) {
    var list = r.shuffle([25, 25, 10, 10, 5].slice(0, r.int(3, 5)).concat(r.chance(0.5) ? [100] : []));
    var tot = list.reduce(function (s, x) { return s + x; }, 0);
    return Q('How many cents are these coins worth altogether?', V.coins(list), V.num(tot, '¢'), 'Start with the biggest coin and count on.', { hint: 'Touch the coins to add them up.' });
  });
  add(2, 'money', 'F1.1', function (r) {
    var amt = r.pick([50, 75, 35, 60]), ways = { 50: ['2 quarters', '5 nickels', '4 dimes'], 75: ['3 quarters', '7 dimes', '1 quarter and 2 dimes'], 35: ['1 quarter and 1 dime', '3 dimes', '1 quarter and 1 nickel'], 60: ['2 quarters and 1 dime', '5 dimes', '2 quarters']};
    return Q('Which coins make ' + amt + '¢?', '', mc(r, ways[amt][0], ways[amt].slice(1)), '');
  });

  /* =================== GRADE 3 =================== */
  add(3, 'num', 'B1.1', function (r) {
    var n = r.int(2, 6) * 100 + r.int(0, 9) * 10 + r.int(1, 9);
    var h = Math.floor(n / 100), te = Math.floor(n / 10) % 10, o = n % 10;
    return Q('What number do the blocks show?', V.blocks(n, { maxW: 420 }), mcn(r, n, [h * 100 + o * 10 + te, h * 10 + te + o, n + 100, (h + te + o)]), h + ' hundreds, ' + te + (te === 1 ? ' ten' : ' tens') + ' and ' + o + (o === 1 ? ' one' : ' ones') + '.', { hint: TAP });
  });
  add(3, 'num', 'B1.5', function (r) {
    var n = r.int(1, 9) * 100 + r.int(1, 9) * 10 + r.int(1, 9), p = r.int(0, 2), d = String(n)[2 - p], name = ['ones', 'tens', 'hundreds'][p], val = Number(d) * Math.pow(10, p);
    return Q('In <b>' + n + '</b>, what is the value of the digit ' + d + ' in the ' + name + ' place?', '', mcn(r, val, [Number(d), val * 10, val === Number(d) ? val + 10 : Number(d) * 10]), 'The ' + d + ' is in the ' + name + ' place, so it is worth ' + val + '.');
  });
  add(3, 'num', 'B1.3', function (r) {
    var n = r.int(101, 989), to = r.pick([10, 100]);
    if (n % to === to / 2) n++;
    var ans = Math.round(n / to) * to;
    return Q('Round <b>' + n + '</b> to the nearest ' + (to === 10 ? 'ten' : 'hundred') + '.', V.line(Math.floor(n / to) * to, Math.floor(n / to) * to + to, to / 10, { marks: [{ v: n, label: n }], labels: function (v, i) { return i === 0 || i === 10 || i === 5 ? fmt(v) : ''; } }),
      mcn(r, ans, [ans === Math.floor(n / to) * to ? ans + to : ans - to, Math.round(n / (to === 10 ? 100 : 10)) * (to === 10 ? 100 : 10), n]), 'Which end of the line is ' + n + ' closer to?');
  });
  add(3, 'num', 'B1.7', function (r) {
    var k = r.pick([[1, 2, 2, 4], [1, 2, 4, 8], [1, 3, 2, 6], [1, 5, 2, 10], [1, 4, 2, 8], [3, 4, 6, 8]]);
    var ch = mc(r, 'b', ['a', 'c', 'd']), opts = { b: V.fbar(k[3], k[2], { w: 150 }), a: V.fbar(k[3], k[2] + 1, { w: 150 }), c: V.fbar(k[3], k[2] - 1 || 3, { w: 150 }), d: V.fbar(k[3] / 2 + 1, k[0] + 1, { w: 150 }) };
    ch.choices = ch.choices.map(function (c) { return opts[c]; });
    return Q('Which bar shows the same amount as ' + fr(k[0], k[1]) + '?', V.fbar(k[1], k[0], { w: 150 }), ch, fr(k[0], k[1]) + ' = ' + fr(k[2], k[3]) + '. The shaded part covers the same length.');
  });
  add(3, 'ops', 'B2.2', function (r) {
    var a = r.pick([2, 5, 10]), b = r.int(2, 10);
    return r.chance(0.5) ? Q('What is ' + a + ' × ' + b + '?', '', V.num(a * b), b + ' groups of ' + a + ' is ' + a * b + '.') :
      Q('What is ' + a * b + ' ÷ ' + a + '?', '', V.num(b), a + ' × ' + b + ' = ' + a * b + ', so ' + a * b + ' ÷ ' + a + ' = ' + b + '.');
  });
  add(3, 'ops', 'B2.5', function (r) {
    var a = r.int(150, 480), b = r.int(120, 450);
    if ((a % 10) + (b % 10) < 10) a += 10 - (a % 10) + 5;
    return Q('What is ' + a + ' + ' + b + '?', '', mcn(r, a + b, [a + b - 10, a + b + 10, a + b - 100, a + b + 1]), 'Add ones, tens, then hundreds. Trade 10 ones for 1 ten.');
  });
  add(3, 'ops', 'B2.5', function (r) {
    var o1 = r.int(0, 4), o2 = r.int(o1 + 1, 9), h1 = r.int(4, 9), h2 = r.int(1, h1 - 2), a = h1 * 100 + r.int(0, 9) * 10 + o1, b = h2 * 100 + r.int(0, 9) * 10 + o2;
    return Q('What is ' + a + ' − ' + b + '?', '', mcn(r, a - b, [a - b + 10, a - b - 10, Math.abs(Math.floor(a / 100) - Math.floor(b / 100)) * 100 + Math.abs(Math.floor(a / 10) % 10 - Math.floor(b / 10) % 10) * 10 + Math.abs(a % 10 - b % 10), a - b + 100]), 'Check: ' + (a - b) + ' + ' + b + ' = ' + a + '.');
  });
  add(3, 'ops', 'B2.6', function (r) {
    var rows = r.int(3, 6), cols = r.int(4, 8);
    return Q('How many dots are in this array?', V.array(rows, cols), mcn(r, rows * cols, [rows + cols, rows * cols + cols, rows * cols - rows, (rows + 1) * cols]), rows + ' rows of ' + cols + ' is ' + rows + ' × ' + cols + ' = ' + rows * cols + '.', { hint: 'Touch a row to count it.' });
  });
  add(3, 'ops', 'B2.7', function (r) {
    var p = r.int(3, 6), each = r.int(3, 8);
    return Q(p * each + ' marbles are put into ' + p + ' bags, the same number in each. How many marbles are in each bag?', '', V.num(each), p + ' × ' + each + ' = ' + p * each + '.');
  });
  add(3, 'alg', 'C1.3', function (r) {
    var by = r.pick([5, 10, 25, 50]), st = r.int(1, 9) * 5, seq = [0, 1, 2, 3].map(function (i) { return st + i * by; }), ans = st + 4 * by;
    return Q('What comes next?<br><b class="big">' + seq.join(', ') + ', ?</b>', '', mcn(r, ans, [ans + 5, ans - 5, ans + by, ans + 10]), 'The rule is: start at ' + st + ', add ' + by + ' each time.');
  });
  add(3, 'alg', 'C2.3', function (r) {
    var a = r.int(15, 40), b = r.int(10, 30), c = r.int(10, a - 1);
    return Q('What number makes this true?<br><b class="big">' + a + ' + ' + b + ' = ' + c + ' + ?</b>', V.balance(a + ' + ' + b, c + ' + ?'), V.num(a + b - c), 'Both sides equal ' + (a + b) + '.');
  });
  add(3, 'alg', 'C2.2', function (r) {
    var a = r.int(3, 6), b = r.int(2, 5) * 2;
    return Q('Which is the same as ' + a + ' × ' + b + '?', '', mc(r, a + ' × ' + b / 2 + ' + ' + a + ' × ' + b / 2, [a + ' + ' + b, (a + b) + ' × 1', a + ' × ' + (b - 1)]), 'Splitting ' + b + ' into ' + b / 2 + ' + ' + b / 2 + ' keeps the total the same: ' + a * b + '.');
  });
  add(3, 'data', 'D1.3', function (r) {
    var L = ['Mon', 'Tue', 'Wed', 'Thu'], v = L.map(function () { return 2 * r.int(2, 8); }), i = r.int(0, 3);
    return Q('Each line on this graph counts by 2. How many books were read on <b>' + L[i] + '</b>?', V.bars(L, v, 2), V.num(v[i]), 'Read across from the top of the bar to the scale.', { hint: 'Touch a bar to see its number.' });
  });
  add(3, 'data', 'D1.4', function (r) {
    var mode = r.int(3, 8), d = r.shuffle([mode, mode, mode, mode + 2, mode - 1, mode + 4]);
    return Q('What is the mode of these numbers?<br><b class="big">' + d.join(', ') + '</b>', '', mcn(r, mode, [mode + 2, mode - 1, mode + 4]), mode + ' appears most often.');
  });
  add(3, 'data', 'D2.1', function (r) {
    var red = r.int(0, 8), parts = []; for (var i = 0; i < 8; i++) parts.push(i < red ? 'r' : 'b');
    var ans = red === 0 ? 'impossible' : red === 8 ? 'certain' : red < 4 ? 'unlikely' : red === 4 ? 'equally likely' : 'likely';
    return Q('Is it impossible, unlikely, equally likely, likely or certain that the spinner lands on <b>red</b>?', V.spinner(r.shuffle(parts)), V.ordered(ans, ['impossible', 'unlikely', 'equally likely', 'likely', 'certain']), red + ' of 8 parts are red.');
  });
  add(3, 'space', 'E2.6', function (r) {
    var h = r.int(1, 12), m = r.int(0, 11) * 5;
    var s = function (H, M) { return H + ':' + (M < 10 ? '0' : '') + M; };
    var wrong = [s(m / 5 || 12, h * 5 % 60), s(h, (m + 5) % 60), s(h % 12 + 1, m), s(h, (m + 30) % 60)];
    return Q('What time does the clock show?', V.clock(h, m), mc(r, s(h, m), wrong), 'The short hand shows the hour. The long hand counts by 5s for minutes.');
  });
  add(3, 'space', 'E2.1', function (r) {
    var a = r.int(3, 9), b = r.int(2, 7);
    return Q('What is the perimeter of this rectangle?', V.rect(a, b, a + ' cm', b + ' cm'), mc(r, 2 * (a + b) + ' cm', [(a + b) + ' cm', a * b + ' cm', (2 * a + b) + ' cm']), 'Add all four sides: ' + a + ' + ' + b + ' + ' + a + ' + ' + b + ' = ' + 2 * (a + b) + ' cm.');
  });
  add(3, 'space', 'E1.1', function (r) {
    var k = r.pick([['cube', 6, 'faces'], ['prism', 6, 'faces'], ['pyramid', 5, 'faces'], ['cube', 8, 'vertices (corners)'], ['cube', 12, 'edges']]);
    var lab = k[0] === 'pyramid' ? 'square-based pyramid' : k[0] === 'prism' ? 'rectangular prism' : 'cube';
    return Q('How many ' + k[2] + ' does a ' + lab + ' have?', V.solid(k[0]), mcn(r, k[1], [k[1] - 1, k[1] + 2, k[1] === 6 ? 4 : 6, k[1] === 8 ? 6 : 8]), '');
  });
  add(3, 'space', 'E2.9', function (r) {
    var w = r.int(3, 6), h = r.int(2, 4);
    return Q('Each square is 1 cm². What is the area of the rectangle?', V.rgrid(w, h), mc(r, w * h + ' cm²', [2 * (w + h) + ' cm²', (w + h) + ' cm²', (w * h + w) + ' cm²']), h + ' rows of ' + w + ' squares = ' + w * h + ' squares.', { hint: 'Touch the squares to count them.' });
  });
  add(3, 'money', 'F1.1', function (r) {
    var price = r.int(3, 18), paid = price < 5 ? 5 : price < 10 ? 10 : 20;
    return Q('A book costs $' + price + '. You pay with a $' + paid + ' bill. How much change do you get?', V.coins([paid * 100]), mc(r, '$' + (paid - price), ['$' + (paid - price + 1), '$' + (price), '$' + (paid - price - 1 || 2)]), 'Count up from $' + price + ' to $' + paid + '.');
  });

  add(3, 'money', 'F1.1', function (r) {
    var price = r.int(11, 89), paid = price < 50 ? 50 : 100;
    return Q('A game costs $' + price + '. You pay with $' + paid + '. How much change do you get?', V.coins([paid === 50 ? 5000 : 10000]), V.num(paid - price, 'dollars'), 'Count up from $' + price + ' to $' + paid + ': that is $' + (paid - price) + '.');
  });

  /* =================== GRADE 4 =================== */
  add(4, 'num', 'B1.1', function (r) {
    var th = r.int(1, 9), h = r.int(0, 9), te = r.int(0, 9), o = r.int(1, 9), n = th * 1000 + h * 100 + te * 10 + o;
    var parts = [th * 1000, h * 100, te * 10, o].filter(Boolean).join(' + ');
    return Q('Which number is <b>' + parts + '</b>?', '', mcn(r, n, [th * 1000 + te * 100 + h * 10 + o, th * 100 + h * 10 + te + o, n + 1000, Number(String(th) + String(h) + String(o))]), 'Put each part in its place: thousands, hundreds, tens, ones.');
  });
  add(4, 'num', 'B1.3', function (r) {
    var n = r.int(1100, 9800); if (n % 1000 === 500) n++;
    var ans = Math.round(n / 1000) * 1000;
    return Q('Round <b>' + n + '</b> to the nearest thousand.', '', mcn(r, ans, [ans === Math.floor(n / 1000) * 1000 ? ans + 1000 : ans - 1000, Math.round(n / 100) * 100, Math.round(n / 10) * 10]), 'Look at the hundreds digit: 5 or more rounds up.');
  });
  add(4, 'num', 'B1.7', function (r) {
    var s = r.int(1, 9);
    return Q('What decimal number does the shaded part show? (The whole is split into tenths.)', V.hgrid(s, true), mc(r, '0.' + s, ['0.0' + s, s + '.0', '0.' + (10 - s)]), s + ' tenths = 0.' + s + '.', { hint: 'Touch the parts to count them.' });
  });
  add(4, 'num', 'B1.5', function (r) {
    var a = r.int(2, 6), b; do { b = r.int(2, 10); } while (b === a);
    var big = Math.min(a, b);
    return Q('Which fraction is greater?', V.fbar(a, 1, { w: 240 }) + V.fbar(b, 1, { w: 240 }), V.ordered(fr(1, big), [fr(1, a), fr(1, b)]), 'When a whole is cut into fewer parts, each part is bigger.');
  });
  add(4, 'num', 'B1.9', function (r) {
    var k = r.pick([[1, 2, '0.5'], [3, 10, '0.3'], [7, 10, '0.7'], [1, 5, '0.2'], [2, 5, '0.4']]);
    return Q('Which decimal is equal to ' + fr(k[0], k[1]) + '?', V.fbar(k[1], k[0], { w: 240 }), mc(r, k[2], ['0.' + k[0], k[0] + '.' + k[1], '0.0' + k[0]].filter(function (x) { return x !== k[2]; }).concat(['0.9'])), fr(k[0], k[1]) + ' = ' + fr(Number(k[2].slice(2)), 10) + ' = ' + k[2] + '.');
  });
  add(4, 'ops', 'B2.2', function (r) {
    var a = r.int(6, 9), b = r.int(6, 9);
    return Q('What is ' + a + ' × ' + b + '?', '', mcn(r, a * b, [a * b + a, a * b - b, a + b, a * (b + 1) - 1]), '');
  });
  add(4, 'ops', 'B2.5', function (r) {
    var a = r.int(13, 48), b = r.int(3, 7);
    return Q('What is ' + a + ' × ' + b + '?', '', mcn(r, a * b, [Math.floor(a / 10) * 10 * b + a % 10, a * b + 10, a * b - b, (a + 10) * b]), 'Split ' + a + ' into ' + Math.floor(a / 10) * 10 + ' + ' + a % 10 + ': ' + Math.floor(a / 10) * 10 * b + ' + ' + (a % 10) * b + ' = ' + a * b + '.');
  });
  add(4, 'ops', 'B2.6', function (r) {
    var d = r.int(3, 8), q = r.int(12, 31);
    return Q('What is ' + d * q + ' ÷ ' + d + '?', '', mcn(r, q, [q + 1, q - 1, q + 10, d * q - d]), d + ' × ' + q + ' = ' + d * q + '.');
  });
  add(4, 'ops', 'B2.3', function (r) {
    var n = r.int(12, 95), m = r.pick([10, 100, 1000]);
    return Q('What is ' + n + ' × ' + fmt(m) + '?', '', mcn(r, n * m, [n * m / 10, n * m * 10, n + m]), 'Each digit moves ' + (String(m).length - 1) + ' place' + (m > 10 ? 's' : '') + ' to the left.');
  });
  add(4, 'alg', 'C2.2', function (r) {
    var x = r.int(8, 30), b = r.int(5, 20);
    return Q('Solve for <i>n</i>:<br><b class="big"><i>n</i> + ' + b + ' = ' + (x + b) + '</b>', V.balance('n + ' + b, String(x + b)), V.num(x), (x + b) + ' − ' + b + ' = ' + x + '. Check: ' + x + ' + ' + b + ' = ' + (x + b) + '.');
  });
  add(4, 'alg', 'C1.3', function (r) {
    var m = r.int(2, 4), b = r.int(0, 3), rows = [1, 2, 3, 4].map(function (n) { return [n, m * n + b]; });
    var ans = m * 6 + b;
    return Q('The pattern grows the same way each step. How many squares are in step 6?', V.towers(rows.map(function (x) { return x[1]; })) + V.table(['Step', 'Squares'], rows), mcn(r, ans, [ans + m, ans - m, rows[3][1] + 2]), 'Each step adds ' + m + '. Step 6 = ' + m + ' × 6' + (b ? ' + ' + b : '') + ' = ' + ans + '.', { hint: 'Touch the squares to count them.' });
  });
  add(4, 'alg', 'C2.3', function (r) {
    var b = r.int(3, 9), lim = r.int(b + 4, 20);
    return Q('Which number makes this true?<br><b class="big"><i>x</i> + ' + b + ' &lt; ' + lim + '</b>', '', mcn(r, lim - b - 1 - r.int(0, 2), [lim - b, lim - b + 1, lim]), '<i>x</i> must be less than ' + (lim - b) + '.');
  });
  add(4, 'data', 'D1.5', function (r) {
    var mm = r.int(4, 9), x = r.int(1, 3), y = r.int(0, x - 1), d = r.shuffle([mm - x, mm + x - y, mm + y]), s = 3 * mm;
    return Q('What is the mean of these numbers?<br><b class="big">' + d.join(', ') + '</b>', V.bars(['A', 'B', 'C'], d, 1), mcn(r, s / 3, [s, s / 3 + 1, Math.max.apply(null, d)]), 'Add them up (' + s + ') and share equally among 3: ' + s + ' ÷ 3 = ' + s / 3 + '.', { hint: 'Touch the bars to see the numbers.' });
  });
  add(4, 'data', 'D1.5', function (r) {
    var d = r.shuffle([r.int(1, 4), r.int(5, 7), r.int(8, 10), r.int(11, 14), r.int(15, 20)]), med = d.slice().sort(function (a, b) { return a - b; })[2];
    return Q('What is the median of these numbers?<br><b class="big">' + d.join(', ') + '</b>', '', mcn(r, med, [d[2] === med ? d[1] : d[2], Math.round(d.reduce(function (a, b) { return a + b; }) / 5) === med ? med + 1 : Math.round(d.reduce(function (a, b) { return a + b; }) / 5), Math.max.apply(null, d)]), 'Put them in order. The middle one is ' + med + '.');
  });
  add(4, 'data', 'D1.1', function (r) {
    var k = r.pick([['favourite colour', 'qualitative'], ['height in centimetres', 'quantitative'], ['number of pets', 'quantitative'], ['favourite sport', 'qualitative']]);
    return Q('Is "' + k[0] + '" qualitative data (words) or quantitative data (numbers)?', '', V.ordered(k[1], ['qualitative', 'quantitative']), '');
  });
  add(4, 'space', 'E2.4', function (r) {
    var k = r.pick([[35, 'acute'], [60, 'acute'], [90, 'right'], [120, 'obtuse'], [150, 'obtuse'], [180, 'straight']]);
    return Q('What kind of angle is this?', V.angle(k[0]), V.ordered(k[1], ['acute', 'right', 'obtuse', 'straight']), 'Acute is less than a right angle (90°). Obtuse is between 90° and 180°.');
  });
  add(4, 'space', 'E2.6', function (r) {
    var w = r.int(3, 9), l = r.int(4, 12);
    return Q('A rectangle has an area of ' + w * l + ' cm². Its width is ' + w + ' cm. What is its length?', V.rect(l, w, '? cm', w + ' cm'), mc(r, l + ' cm', [(w * l - w) + ' cm', (l + 1) + ' cm', (w * l / 2) + ' cm']), 'Area = length × width, so length = ' + w * l + ' ÷ ' + w + ' = ' + l + ' cm.');
  });
  add(4, 'space', 'E1.2', function (r) {
    var x = r.int(1, 5), y; do { y = r.int(1, 5); } while (y === x);
    return Q('What are the coordinates of point A?', V.plane([[x, y, 'A']]), mc(r, '(' + x + ', ' + y + ')', ['(' + y + ', ' + x + ')', '(' + x + ', ' + (y + 1) + ')', '(' + (x + 1) + ', ' + y + ')']), 'Go across first (' + x + '), then up (' + y + ').');
  });
  add(4, 'space', 'E2.3', function (r) {
    var h = r.int(1, 10), m = r.pick([15, 20, 30, 40, 45]), add = r.pick([25, 35, 40, 50]);
    var end = h * 60 + m + add, eh = Math.floor(end / 60), em = end % 60;
    var tm = function (H, M) { return H + ':' + (M < 10 ? '0' : '') + M; };
    return Q('A movie starts at ' + tm(h, m) + ' and ends at ' + tm(eh, em) + '. How many minutes long is it?', V.clock(h, m) + V.clock(eh, em), V.num(add, 'minutes'), 'Count on from ' + tm(h, m) + ' to ' + tm(eh, em) + '.');
  });
  add(4, 'money', 'F1.2', function (r) {
    var a = r.int(4, 15), b = r.int(3, 12), c = r.int(2, 9);
    return Q('You buy a ball for $' + a + ', a book for $' + b + ' and a snack for $' + c + '. What is the total cost?', '', mc(r, '$' + (a + b + c), ['$' + (a + b + c + 1), '$' + (a + b), '$' + (a + b + c - 10)]), '$' + a + ' + $' + b + ' + $' + c + ' = $' + (a + b + c) + '.');
  });
  add(4, 'money', 'F1.2', function (r) {
    var a = r.int(6, 14), b = r.int(3, 5);
    return Q('You buy ' + b + ' T-shirts for $' + a + ' each. You pay with $' + (a * b < 50 ? 50 : 100) + '. How much change do you get?', '', mc(r, '$' + ((a * b < 50 ? 50 : 100) - a * b), ['$' + ((a * b < 50 ? 50 : 100) - a * b + a), '$' + a * b, '$' + ((a * b < 50 ? 50 : 100) - a - b)]), b + ' × $' + a + ' = $' + a * b + '.');
  });
  add(4, 'money', 'F1.3', function (r) {
    var k = r.pick([['putting money in a bank account to use later', 'saving'], ['giving money to help others', 'donating'], ['getting paid for doing a job', 'earning'], ['using money to buy something', 'spending']]);
    return Q('Which word matches: <b>' + k[0] + '</b>?', '', mc(r, k[1], ['saving', 'donating', 'earning', 'spending', 'investing'].filter(function (w) { return w !== k[1]; })), '');
  });

  /* =================== GRADE 5 =================== */
  add(5, 'num', 'B1.1', function (r) {
    var a = r.int(1, 9), b = r.int(0, 9), c = r.int(1, 9), d = r.int(0, 9), e = r.int(1, 9), n = a * 10000 + b * 1000 + c * 100 + d * 10 + e;
    var p = r.pick([[10000, 'ten thousands', a], [1000, 'thousands', b], [100, 'hundreds', c]]);
    if (!p[2]) p = [100, 'hundreds', c];
    return Q('In <b>' + fmt(n) + '</b>, what is the value of the digit in the ' + p[1] + ' place?', '', mcn(r, p[0] * p[2], [p[2], p[0] * p[2] / 10, p[0] * p[2] * 10]), 'The digit ' + p[2] + ' is in the ' + p[1] + ' place: ' + fmt(p[0] * p[2]) + '.');
  });
  add(5, 'num', 'B1.5', function (r) {
    var a = r.int(1, 9), b = r.int(1, 9), x = (a * 10 + b) / 100, y = (a + (b > 4 ? 0 : 1)) / 10;
    var big = Math.max(x, y);
    return Q('Which number is greater?', '', V.ordered(big.toFixed(big === y ? 1 : 2), [x.toFixed(2), y.toFixed(1)]), 'Compare tenths first: ' + x.toFixed(2) + ' has ' + a + ' tenths, ' + y.toFixed(1) + ' has ' + Math.round(y * 10) + ' tenths.');
  });
  add(5, 'num', 'B1.6', function (r) {
    var w = r.int(1, 20), t = r.int(0, 9), h = r.int(1, 9); if (h === 5) h = 6;
    var n = w + t / 10 + h / 100, ans = (Math.round(n * 10) / 10).toFixed(1);
    return Q('Round <b>' + n.toFixed(2) + '</b> to the nearest tenth.', '', mc(r, ans, [(w + t / 10).toFixed(1) === ans ? (w + (t + 1) / 10).toFixed(1) : (w + t / 10).toFixed(1), String(Math.round(n)), n.toFixed(2)]), 'Look at the hundredths digit (' + h + '). 5 or more rounds up.');
  });
  add(5, 'num', 'B1.3', function (r) {
    var d = r.pick([3, 4, 5, 6, 8]), w = r.int(1, 2), n = r.int(1, d - 1);
    if (V.gcd(n, d) > 1) n = 1;
    var top = w * d + n;
    return Q('Which mixed number equals ' + fr(top, d) + '?', V.fbar(d, d) + (w > 1 ? V.fbar(d, d) : '') + V.fbar(d, n), mc(r, V.mixed(w, n, d), [V.mixed(w + 1, n, d), V.mixed(w, n + 1 < d ? n + 1 : n - 1 || 1, d), V.mixed(n, w, d)]), top + ' ÷ ' + d + ' = ' + w + (w === 1 ? ' whole' : ' wholes') + ' and ' + n + ' left over.');
  });
  add(5, 'num', 'B1.7', function (r) {
    var k = r.pick([[1, 4, '0.25', '25%'], [3, 4, '0.75', '75%'], [1, 2, '0.5', '50%'], [1, 5, '0.2', '20%'], [3, 10, '0.3', '30%']]);
    return Q('Which percent equals ' + fr(k[0], k[1]) + '?', V.hgrid(Math.round(k[0] / k[1] * 100)), mc(r, k[3], [k[0] + k[1] + '%', k[0] + '%', (100 - parseInt(k[3], 10)) + '%']), fr(k[0], k[1]) + ' = ' + k[2] + ' = ' + k[3] + ' (out of 100).');
  });
  add(5, 'ops', 'B2.2', function (r) {
    var a = r.int(6, 12), b = r.int(7, 12);
    return Q('What is ' + a * b + ' ÷ ' + a + '?', '', V.num(b), a + ' × ' + b + ' = ' + a * b + '.');
  });
  add(5, 'ops', 'B2.6', function (r) {
    var a = r.int(13, 39), b = r.int(12, 29);
    var t1 = Math.floor(a / 10) * 10, o1 = a % 10;
    return Q('What is ' + a + ' × ' + b + '?', '', mcn(r, a * b, [a * b + 10, t1 * b + o1, a * (b - 1), a * Math.floor(b / 10) * 10 + a % 10 * (b % 10)]), t1 + ' × ' + b + ' + ' + o1 + ' × ' + b + ' = ' + t1 * b + ' + ' + o1 * b + ' = ' + a * b + '.');
  });
  add(5, 'ops', 'B2.7', function (r) {
    var d = r.int(11, 25), q = r.int(6, 30);
    if (d * q < 100) q = Math.ceil(100 / d) + 1;
    return Q('What is ' + d * q + ' ÷ ' + d + '?', '', mcn(r, q, [q + 1, q - 1, q + 10, q * 10]), d + ' × ' + q + ' = ' + d * q + '.');
  });
  add(5, 'ops', 'B2.5', function (r) {
    var d = r.pick([5, 6, 8, 10, 12]), a = r.int(1, d - 2), b = r.int(1, d - 1 - a);
    return Q('What is ' + fr(a, d) + ' + ' + fr(b, d) + '?', V.fbar(d, a + b), mc(r, fr(a + b, d), [fr(a + b, 2 * d), fr(a + b, d + d), fr(a * b, d), fr(a + b + 1, d)].filter(function (x, i) { return i !== 1; })), 'Same-size parts: ' + a + ' + ' + b + ' = ' + (a + b) + ' ' + d + 'ths. The bottom number stays the same.');
  });
  add(5, 'ops', 'B2.4', function (r) {
    var a = r.int(12, 89) / 10, b = r.int(105, 499) / 100, s = Math.round((a + b) * 100) / 100;
    return Q('What is ' + a.toFixed(1) + ' + ' + b.toFixed(2) + '?', '', mc(r, s.toFixed(2), [(Math.round((a / 10 + b) * 100) / 100).toFixed(2), (Math.round((a + b + 0.1) * 100) / 100).toFixed(2), (Math.round((a + b * 10) * 10) / 100).toFixed(2)]), 'Line up the decimal points: ' + a.toFixed(2) + ' + ' + b.toFixed(2) + '.');
  });
  add(5, 'alg', 'C2.2', function (r) {
    var m = r.int(2, 6), b = r.int(1, 9), n = r.int(2, 9);
    return Q('What is the value of <b>' + m + '<i>n</i> + ' + b + '</b> when <i>n</i> = ' + n + '?', '', mcn(r, m * n + b, [m + n + b, m * (n + b), Number(String(m) + String(n)) + b]), m + ' × ' + n + ' + ' + b + ' = ' + (m * n + b) + '.');
  });
  add(5, 'alg', 'C2.3', function (r) {
    var a = r.int(3, 9), x = r.int(4, 11);
    return Q('Solve for <i>x</i>:<br><b class="big">' + a + '<i>x</i> = ' + a * x + '</b>', V.balance(a + 'x', String(a * x)), V.num(x), a * x + ' ÷ ' + a + ' = ' + x + '.');
  });
  add(5, 'alg', 'C1.3', function (r) {
    var st = r.int(40, 80), by = r.int(3, 8), seq = [0, 1, 2, 3].map(function (i) { return st - i * by; }), ans = st - 4 * by;
    return Q('This pattern shrinks the same way each time. What comes next?<br><b class="big">' + seq.join(', ') + ', ?</b>', '', mcn(r, ans, [ans + 1, ans - by, ans + by]), 'The rule is: subtract ' + by + ' each time.');
  });
  add(5, 'data', 'D1.5', function (r) {
    var d = [r.int(2, 5), r.int(6, 8), r.int(9, 11), r.int(12, 15)], s = d.reduce(function (a, b) { return a + b; }), fix = (4 - s % 4) % 4; d[3] += fix; s += fix;
    return Q('What is the mean of these numbers?<br><b class="big">' + r.shuffle(d).join(', ') + '</b>', '', mcn(r, s / 4, [s, (d[1] + d[2]) / 2 === s / 4 ? s / 4 + 1 : (d[1] + d[2]) / 2, s / 4 + 2]), 'Total ' + s + ' ÷ 4 = ' + s / 4 + '.');
  });
  add(5, 'data', 'D2.1', function (r) {
    var n = r.pick([4, 6, 8]), red = r.int(1, n - 1), parts = []; for (var i = 0; i < n; i++) parts.push(i < red ? 'r' : 'b');
    var g = V.gcd(red, n);
    return Q('What is the probability the spinner lands on red?', V.spinner(r.shuffle(parts)), mc(r, fr(red, n), [fr(n - red, n), fr(red + 1, n + 1), fr(red === n - 1 ? 1 : red + 1, n)].filter(function (x) { return x !== fr(red, n); })), red + ' out of ' + n + ' equal parts are red' + (g > 1 ? ' (' + fr(red / g, n / g) + ' in lowest terms)' : '') + '.');
  });
  add(5, 'data', 'D1.5', function (r) {
    var d = r.shuffle([r.int(1, 4), r.int(5, 7), r.int(8, 10), r.int(11, 13)]), s = d.slice().sort(function (a, b) { return a - b; }), med = (s[1] + s[2]) / 2;
    return Q('What is the median?<br><b class="big">' + d.join(', ') + '</b>', '', mc(r, String(med), [String(s[1]), String(s[2]), String(d[1])].filter(function (x) { return x !== String(med); })), 'In order: ' + s.join(', ') + '. Two middle numbers: (' + s[1] + ' + ' + s[2] + ') ÷ 2 = ' + med + '.');
  });
  add(5, 'space', 'E2.5', function (r) {
    var b = 2 * r.int(2, 8), h = r.int(3, 9), tri = r.chance(0.5);
    return tri ? Q('What is the area of the triangle?', V.tri(b, h, 'cm'), mc(r, b * h / 2 + ' cm²', [b * h + ' cm²', (b + h) + ' cm²', b * h / 2 + h + ' cm²']), 'Area = base × height ÷ 2 = ' + b + ' × ' + h + ' ÷ 2 = ' + b * h / 2 + ' cm².') :
      Q('What is the area of the parallelogram?', V.para(b, h, 'cm'), mc(r, b * h + ' cm²', [b * h / 2 + ' cm²', 2 * (b + h) + ' cm²', (b + h) + ' cm²']), 'Area = base × height = ' + b + ' × ' + h + ' = ' + b * h + ' cm².');
  });
  add(5, 'space', 'E2.2', function (r) {
    var k = r.pick([['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['kg', 'g', 1000], ['L', 'mL', 1000]]), n = r.int(2, 9);
    return Q('How many ' + k[1] + ' are in ' + n + ' ' + k[0] + '?', '', mcn(r, n * k[2], [n * k[2] / 10, n * k[2] * 10, n + k[2]]), '1 ' + k[0] + ' = ' + fmt(k[2]) + ' ' + k[1] + ', so ' + n + ' ' + k[0] + ' = ' + fmt(n * k[2]) + ' ' + k[1] + '.');
  });
  add(5, 'space', 'E1.4', function (r) {
    var x = r.int(1, 3), y = r.int(1, 3), dx = r.int(1, 3), dy = r.int(1, 3);
    return Q('Point A is moved ' + dx + ' right and ' + dy + ' up. Where does it end up?', V.plane([[x, y, 'A']]), mc(r, '(' + (x + dx) + ', ' + (y + dy) + ')', ['(' + (x + dy) + ', ' + (y + dx) + ')', '(' + (x + dx) + ', ' + y + ')', '(' + (x - dx < 0 ? x + dx + 1 : x - dx) + ', ' + (y + dy) + ')']), 'Right adds to the first number, up adds to the second.');
  });
  add(5, 'space', 'E1.1', function (r) {
    var k = r.pick([['all three sides equal', 'equilateral'], ['exactly two sides equal', 'isosceles'], ['no sides equal', 'scalene'], ['one right angle', 'right']]);
    return Q('A triangle with <b>' + k[0] + '</b> is called…', '', mc(r, k[1], ['equilateral', 'isosceles', 'scalene', 'right'].filter(function (x) { return x !== k[1]; })), '');
  });
  add(5, 'money', 'F1.2', function (r) {
    var p = r.pick([10, 20, 30, 40, 50]);
    return Q('In Ontario, sales tax (HST) is 13%. A jacket costs $' + p + ' before tax. What is the total with tax?', '', mc(r, V.money(p * 113), [V.money(p * 113 - 100), V.money(p * 100 + 1300), V.money(p * 13)]), '13% of $' + p + ' = ' + V.money(p * 13) + '. $' + p + ' + ' + V.money(p * 13) + ' = ' + V.money(p * 113) + '.');
  });
  add(5, 'money', 'F1.5', function (r) {
    var a = r.int(3, 5), pa = r.int(110, 190), b = a + r.int(1, 3), pb = pa + r.pick([-15, -10, 10, 15]);
    if (pb === pa) pb += 5;
    var better = pa < pb ? a : b;
    return Q('Which is the better buy? <b>' + a + ' pens for ' + V.money(a * pa) + '</b> or <b>' + b + ' pens for ' + V.money(b * pb) + '</b>', '', V.ordered(better === a ? a + ' pens for ' + V.money(a * pa) : b + ' pens for ' + V.money(b * pb), [a + ' pens for ' + V.money(a * pa), b + ' pens for ' + V.money(b * pb)]), 'Find the price of one pen: ' + V.money(pa) + ' or ' + V.money(pb) + '.');
  });

  /* =================== GRADE 6 =================== */
  add(6, 'num', 'B1.3', function (r) {
    var a = -r.int(2, 9), b = -r.int(2, 9); if (a === b) b = a - 2;
    var c = r.int(1, 5), list = [a, b, c, 0], small = Math.min.apply(null, list);
    return Q('Which number is the smallest?', V.line(-10, 10, 1, { labels: function (v) { return v % 5 === 0 ? V.neg(v) : ''; } }), mc(r, V.neg(small), list.filter(function (x) { return x !== small; }).map(V.neg)), 'On a number line, numbers get smaller as you go left. ' + V.neg(small) + ' is farthest left.');
  });
  add(6, 'num', 'B1.4', function (r) {
    var a = r.int(1, 9), x = (a * 100 + r.int(10, 99)) / 1000, y = (a * 10 + r.int(0, 9)) / 100; if (Math.abs(x - y) < 0.0005) y += 0.01;
    var big = Math.max(x, y);
    return Q('Which number is greater?', '', V.ordered(big === x ? x.toFixed(3) : y.toFixed(2), [x.toFixed(3), y.toFixed(2)]), 'Write both with 3 decimal places: ' + x.toFixed(3) + ' and ' + y.toFixed(3) + '.');
  });
  add(6, 'num', 'B1.6', function (r) {
    var k = r.pick([[3, 8, '0.375'], [1, 8, '0.125'], [5, 8, '0.625'], [3, 4, '0.75'], [2, 5, '0.4'], [7, 20, '0.35']]);
    return Q('Which decimal is equal to ' + fr(k[0], k[1]) + '?', '', mc(r, k[2], ['0.' + k[0] + k[1], '0.' + k[0], k[1] + '.' + k[0]].filter(function (x) { return x !== k[2]; })), k[0] + ' ÷ ' + k[1] + ' = ' + k[2] + '.');
  });
  add(6, 'num', 'B1.5', function (r) {
    var w = r.int(0, 9), t = r.int(0, 9), h = r.int(0, 8), th = r.pick([1, 2, 3, 4, 6, 7, 8, 9]), k = w * 1000 + t * 100 + h * 10 + th, n = k / 1000;
    var ans = ((Math.floor(k / 10) + (th >= 5 ? 1 : 0)) / 100).toFixed(2);
    return Q('Round <b>' + n.toFixed(3) + '</b> to the nearest hundredth.', '', mc(r, ans, [(Math.floor(n * 100) / 100).toFixed(2) === ans ? (Math.ceil(n * 100) / 100).toFixed(2) : (Math.floor(n * 100) / 100).toFixed(2), (Math.round(n * 10) / 10).toFixed(1), n.toFixed(3)]), 'Look at the thousandths digit: 5 or more rounds up.');
  });
  add(6, 'ops', 'B2.3', function (r) {
    var p = r.pick([10, 25, 50, 5, 15]), n = r.pick([20, 40, 60, 80, 120, 200]);
    if (p === 15 || p === 5) n = r.pick([20, 40, 60, 80, 200]);
    return Q('What is ' + p + '% of ' + n + '?', '', mcn(r, p * n / 100, [p * n / 10, Math.abs(n - p), p * n / 100 * 2]), p + '% means ' + p + ' out of every 100. ' + (p === 50 ? 'Half of ' + n : p === 25 ? 'A quarter of ' + n : p === 10 ? n + ' ÷ 10' : p === 5 ? 'Half of 10% (' + n / 10 + ')' : '10% + 5% = ' + n / 10 + ' + ' + n / 20) + ' = ' + p * n / 100 + '.');
  });
  add(6, 'ops', 'B2.5', function (r) {
    var k = r.pick([[1, 2, 1, 3], [1, 2, 1, 4], [1, 3, 1, 4], [2, 3, 1, 6], [1, 4, 3, 8], [1, 2, 2, 5]]);
    var D = k[1] * k[3] / V.gcd(k[1], k[3]), N = k[0] * D / k[1] + k[2] * D / k[3], g = V.gcd(N, D);
    return Q('What is ' + fr(k[0], k[1]) + ' + ' + fr(k[2], k[3]) + '?', V.fbar(k[1], k[0], { w: 240 }) + V.fbar(k[3], k[2], { w: 240 }), mc(r, fr(N / g, D / g), [fr(k[0] + k[2], k[1] + k[3]), fr(k[0] + k[2], D), fr(N / g + 1, D / g)]), 'Use a common denominator of ' + D + ': ' + fr(k[0] * D / k[1], D) + ' + ' + fr(k[2] * D / k[3], D) + ' = ' + fr(N, D) + (g > 1 ? ' = ' + fr(N / g, D / g) : '') + '.');
  });
  add(6, 'ops', 'B2.9', function (r) {
    var d = r.pick([3, 4, 5]), n = r.int(1, d - 1), w = d * r.int(2, 6);
    return Q('What is ' + fr(n, d) + ' of ' + w + '?', V.fbar(d, n, { w: 300 }), mcn(r, w * n / d, [w / d, w * d / n === Math.floor(w * d / n) ? w * d / n : w - n, w - w * n / d]), w + ' ÷ ' + d + ' = ' + w / d + ', then × ' + n + ' = ' + w * n / d + '.');
  });
  add(6, 'ops', 'B2.2', function (r) {
    var d = r.pick([3, 4, 6, 9]), yes = d * r.int(13, 40), no = yes + r.int(1, d - 1), no2 = yes + d + r.int(1, d - 1);
    var rule = { 3: 'the sum of its digits is divisible by 3', 4: 'its last two digits make a number divisible by 4', 6: 'it is even and divisible by 3', 9: 'the sum of its digits is divisible by 9' };
    return Q('Which number is divisible by ' + d + '?', '', mcn(r, yes, [no, no2, yes + 1 === no ? yes - 1 : yes + 1]), 'A number is divisible by ' + d + ' when ' + rule[d] + '.');
  });
  add(6, 'ops', 'B2.6', function (r) {
    var k = r.pick([[12, '2 × 2 × 3'], [18, '2 × 3 × 3'], [20, '2 × 2 × 5'], [30, '2 × 3 × 5'], [36, '2 × 2 × 3 × 3'], [24, '2 × 2 × 2 × 3']]);
    return Q('Which is the prime factorization of ' + k[0] + '?', '', mc(r, k[1], ['2 × ' + k[0] / 2, '3 × ' + k[0] / 3, '1 × ' + k[0], '2 × 2 × ' + k[0] / 4].filter(function (x) { return x !== k[1] && !/\.\d/.test(x); })), 'All factors must be prime: ' + k[1] + ' = ' + k[0] + '.');
  });
  add(6, 'alg', 'C2.2', function (r) {
    var a = r.int(2, 5), b = r.int(2, 6), x = r.int(1, 6), y = r.int(1, 6);
    return Q('What is <b>' + a + '<i>a</i> + ' + b + '<i>b</i></b> when <i>a</i> = ' + x + ' and <i>b</i> = ' + y + '?', '', mcn(r, a * x + b * y, [a + x + b + y, a * y + b * x === a * x + b * y ? a * x + b * y + 1 : a * y + b * x, (a + b) * (x + y)]), a + ' × ' + x + ' + ' + b + ' × ' + y + ' = ' + a * x + ' + ' + b * y + ' = ' + (a * x + b * y) + '.');
  });
  add(6, 'alg', 'C2.3', function (r) {
    var a = r.int(2, 6), x = r.int(3, 12), b = r.int(2, 15);
    return Q('Solve for <i>x</i>:<br><b class="big">' + a + '<i>x</i> + ' + b + ' = ' + (a * x + b) + '</b>', V.balance(a + 'x + ' + b, String(a * x + b)), V.num(x), 'Take away ' + b + ' from both sides: ' + a + '<i>x</i> = ' + a * x + '. Then divide by ' + a + ': <i>x</i> = ' + x + '.');
  });
  add(6, 'alg', 'C1.3', function (r) {
    var m = r.int(3, 7), b = r.int(-2, 4), rows = [1, 2, 3, 4].map(function (n) { return [n, m * n + b]; });
    var rule = 'term × ' + m + (b > 0 ? ' + ' + b : b < 0 ? ' − ' + (-b) : '');
    return Q('Which rule gives the value from the term number?', V.table(['Term', 'Value'], rows), mc(r, rule, ['term + ' + (m + b), 'term × ' + (m + 1) + (b - 1 > 0 ? ' + ' + (b - 1) : b - 1 < 0 ? ' − ' + (1 - b) : ''), 'add ' + m + ' to the term']), 'Values go up by ' + m + ' each time, so start with term × ' + m + ', then adjust.');
  });
  add(6, 'alg', 'C2.4', function (r) {
    var a = r.int(2, 4), b = r.int(1, 9), lim = a * r.int(5, 12) + b;
    var ok = Math.floor((lim - b - 1) / a);
    return Q('Which value of <i>x</i> makes this true?<br><b class="big">' + a + '<i>x</i> + ' + b + ' &lt; ' + lim + '</b>', '', mcn(r, ok, [ok + 1, ok + 2, ok + 4]), 'Try it: ' + a + ' × ' + ok + ' + ' + b + ' = ' + (a * ok + b) + ', which is less than ' + lim + '.');
  });
  add(6, 'data', 'D1.5', function (r) {
    var lo = r.int(2, 10), d = r.shuffle([lo, lo + r.int(2, 5), lo + r.int(6, 9), lo + r.int(10, 18)]), hi = Math.max.apply(null, d);
    return Q('What is the range of these numbers?<br><b class="big">' + d.join(', ') + '</b>', '', mcn(r, hi - lo, [hi, hi + lo, d[3] - d[0] === hi - lo ? hi - lo + 1 : Math.abs(d[3] - d[0])]), 'Range = biggest − smallest = ' + hi + ' − ' + lo + ' = ' + (hi - lo) + '.');
  });
  add(6, 'data', 'D2.1', function (r) {
    var k = r.pick([['an even number', 3], ['a number greater than 4', 2], ['a 6', 1], ['a number less than 5', 4]]);
    var g = V.gcd(k[1], 6);
    return Q('You roll a regular number cube (1 to 6). What is the probability of rolling <b>' + k[0] + '</b>?', '', mc(r, fr(k[1] / g, 6 / g), [fr(k[1], 12), fr(1, k[1] + 1), fr(6 - k[1], 6)].filter(function (x) { return x !== fr(k[1] / g, 6 / g); })), k[1] + ' of the 6 numbers work: ' + fr(k[1], 6) + (g > 1 ? ' = ' + fr(k[1] / g, 6 / g) : '') + '.');
  });
  add(6, 'data', 'D1.1', function (r) {
    var k = r.pick([['the number of students in a class', 'discrete'], ['the height of a plant', 'continuous'], ['the time it takes to run 100 m', 'continuous'], ['the number of goals in a game', 'discrete']]);
    return Q('Is <b>' + k[0] + '</b> discrete data (counted) or continuous data (measured)?', '', V.ordered(k[1], ['discrete', 'continuous']), '');
  });
  add(6, 'space', 'E1.3', function (r) {
    var x = r.int(1, 5) * (r.chance(0.5) ? -1 : 1), y = r.int(1, 5) * (r.chance(0.5) ? -1 : 1);
    return Q('What are the coordinates of point P?', V.plane([[x, y, 'P']], { q4: true, n: 6 }), mc(r, '(' + V.neg(x) + ', ' + V.neg(y) + ')', ['(' + V.neg(y) + ', ' + V.neg(x) + ')', '(' + V.neg(-x) + ', ' + V.neg(y) + ')', '(' + V.neg(x) + ', ' + V.neg(-y) + ')']), 'Across first (x = ' + V.neg(x) + '), then up or down (y = ' + V.neg(y) + ').');
  });
  add(6, 'space', 'E2.3', function (r) {
    var a = r.int(25, 155);
    return Q('Two angles make a straight line. One is ' + a + '°. What is the other?', V.angle(180 - a, { label: '?' }), mc(r, (180 - a) + '°', [(90 - a > 0 ? 90 - a : a - 90) + '°', (360 - a) + '°', a + '°']), 'Angles on a straight line add up to 180°: 180 − ' + a + ' = ' + (180 - a) + '.');
  });
  add(6, 'space', 'E2.4', function (r) {
    var a = r.int(3, 8), b = a + 2 * r.int(1, 4), h = 2 * r.int(2, 5);
    return Q('What is the area of the trapezoid?', V.trap(a, b, h, 'cm'), mc(r, (a + b) * h / 2 + ' cm²', [(a + b) * h + ' cm²', a * b + ' cm²', (a + b + h) + ' cm²']), '(' + a + ' + ' + b + ') × ' + h + ' ÷ 2 = ' + (a + b) * h / 2 + ' cm².');
  });
  add(6, 'space', 'E2.6', function (r) {
    var l = r.int(3, 8), w = r.int(2, 5), h = r.int(2, 6);
    var sa = 2 * (l * w + l * h + w * h);
    return Q('What is the surface area of the box?', V.box(l, w, h, 'cm'), mc(r, sa + ' cm²', [l * w * h + ' cm²', (l * w + l * h + w * h) + ' cm²', 4 * (l + w + h) + ' cm²']), '2 × (' + l * w + ' + ' + l * h + ' + ' + w * h + ') = ' + sa + ' cm².');
  });
  add(6, 'money', 'F1.4', function (r) {
    var p = r.pick([100, 200, 500, 1000]), rate = r.pick([2, 3, 4, 5]);
    return Q('You put $' + fmt(p) + ' in a savings account that pays ' + rate + '% interest a year. How much interest do you earn in 1 year?', '', mc(r, '$' + p * rate / 100, ['$' + rate, '$' + p * rate / 10, '$' + (p + rate)]), rate + '% of $' + fmt(p) + ' = $' + p * rate / 100 + '.');
  });
  add(6, 'money', 'F1.2', function (r) {
    var w = r.pick([5, 10, 15, 20, 25]), weeks = r.int(4, 12);
    return Q('You want to save $' + w * weeks + ' for a bike. You save $' + w + ' each week. How many weeks will it take?', '', V.num(weeks, 'weeks'), '$' + w * weeks + ' ÷ $' + w + ' = ' + weeks + ' weeks.');
  });

  /* =================== GRADE 7 =================== */
  add(7, 'num', 'B1.2', function (r) {
    var n = r.int(4, 15);
    return Q('What is √' + n * n + '?', n <= 9 ? V.rgrid(n, n, { c: 18 }) : '', mcn(r, n, [n * n / 2, n + 1, n * 2]), n + ' × ' + n + ' = ' + n * n + '.');
  });
  add(7, 'num', 'B1.4', function (r) {
    var a = r.int(1, 5), b = r.int(a + 1, 9), m = r.int(2, 6); if (V.gcd(a, b) > 1) { a = 2; b = 3; }
    return Q('Write ' + fr(a * m, b * m) + ' in lowest terms.', '', mc(r, fr(a, b), [fr(a + 1, b), fr(b, a), fr(a * m - 1, b * m - 1)]), 'Divide top and bottom by ' + m + '.');
  });
  add(7, 'num', 'B1.7', function (r) {
    var k = r.pick([['0.35', '35%'], ['0.08', '8%'], ['0.6', '60%'], ['1.25', '125%'], ['0.125', '12.5%']]);
    return Q('Which percent equals ' + k[0] + '?', '', mc(r, k[1], [k[0].replace(/^0\./, '') + '%', (parseFloat(k[0]) * 10) + '%', (parseFloat(k[0]) * 1000) + '%'].filter(function (x) { return x !== k[1]; })), 'Multiply by 100: ' + k[0] + ' × 100 = ' + k[1].replace('%', '') + '.');
  });
  add(7, 'num', 'B1.3', function (r) {
    var list = r.shuffle([['−0.75', -0.75], ['−' + '½', -0.5], ['0.2', 0.2], ['−1.5', -1.5]]);
    var s = list.slice().sort(function (a, b) { return a[1] - b[1]; });
    var right = s.map(function (x) { return x[0]; }).join(', ');
    var w1 = s.slice().reverse().map(function (x) { return x[0]; }).join(', ');
    var w2 = [s[1], s[0], s[2], s[3]].map(function (x) { return x[0]; }).join(', ');
    var w3 = [s[0], s[2], s[1], s[3]].map(function (x) { return x[0]; }).join(', ');
    return Q('Which list is in order from least to greatest?<br><b class="big">' + list.map(function (x) { return x[0]; }).join(', ') + '</b>', '', mc(r, right, [w1, w2, w3]), 'Negative numbers farther from zero are smaller.');
  });
  add(7, 'ops', 'B2.4', function (r) {
    var a = -r.int(3, 12), b = r.int(2, 15), sub = r.chance(0.5);
    return sub ? Q('What is ' + V.neg(a) + ' − ' + b + '?', V.line(-20, 5, 1, { labels: function (v) { return v % 5 === 0 ? V.neg(v) : ''; } }), mc(r, V.neg(a - b), [V.neg(a + b), V.neg(b - a), V.neg(-a + b)]), 'Start at ' + V.neg(a) + ' and move ' + b + ' to the left: ' + V.neg(a - b) + '.') :
      Q('What is ' + V.neg(a) + ' + ' + b + '?', V.line(-15, 15, 1, { labels: function (v) { return v % 5 === 0 ? V.neg(v) : ''; } }), mc(r, V.neg(a + b), [V.neg(a - b), V.neg(-(a + b)), V.neg(-a + b)]), 'Start at ' + V.neg(a) + ' and move ' + b + ' to the right: ' + V.neg(a + b) + '.');
  });
  add(7, 'ops', 'B2.8', function (r) {
    var k = r.pick([[2, 3, 3, 4], [1, 2, 4, 5], [3, 4, 2, 9], [2, 5, 5, 6], [3, 8, 2, 3]]);
    var N = k[0] * k[2], D = k[1] * k[3], g = V.gcd(N, D);
    return Q('What is ' + fr(k[0], k[1]) + ' × ' + fr(k[2], k[3]) + '?', '', mc(r, fr(N / g, D / g), [fr(k[0] + k[2], k[1] + k[3]), fr(k[0] * k[3], k[1] * k[2]), fr(N / g + 1, D / g)].filter(function (x) { return x !== fr(N / g, D / g); })), 'Multiply tops and bottoms: ' + fr(N, D) + (g > 1 ? ' = ' + fr(N / g, D / g) : '') + '.');
  });
  add(7, 'ops', 'B2.1', function (r) {
    var a = r.int(2, 9), b = r.int(2, 6), c = r.int(2, 6);
    return Q('What is <b>' + a + ' + ' + b + ' × ' + c + '</b>?', '', mcn(r, a + b * c, [(a + b) * c, a * b + c, a + b + c]), 'Multiply first: ' + b + ' × ' + c + ' = ' + b * c + ', then add ' + a + '.');
  });
  add(7, 'ops', 'B2.6', function (r) {
    var g = r.pick([4, 6, 8, 9, 12]), x = r.pick([2, 3, 5]), y = r.pick([3, 5, 7]); if (x === y) y = 7;
    return Q('What is the greatest common factor of ' + g * x + ' and ' + g * y + '?', '', mcn(r, g, [g / 2 === Math.floor(g / 2) ? g / 2 : g + 1, g * x, x * y]), g * x + ' = ' + g + ' × ' + x + ' and ' + g * y + ' = ' + g + ' × ' + y + '.');
  });
  add(7, 'ops', 'B2.10', function (r) {
    var n = r.int(3, 5), p = r.int(2, 7), m = r.int(2, 4);
    return Q(n + ' notebooks cost $' + n * p + '. At the same price, how much do ' + n * m + ' notebooks cost?', '', mc(r, '$' + n * m * p, ['$' + (n * p + n * m - n), '$' + n * p * m * 2, '$' + n * m]), 'One notebook is $' + p + '. ' + n * m + ' × $' + p + ' = $' + n * m * p + '.');
  });
  add(7, 'alg', 'C2.3', function (r) {
    var a = r.int(2, 8), x = r.int(2, 12), b = r.int(1, 20), sub = r.chance(0.5);
    var rhs = sub ? a * x - b : a * x + b;
    if (sub && rhs <= 0) sub = false, rhs = a * x + b;
    return Q('Solve for <i>x</i>:<br><b class="big">' + a + '<i>x</i> ' + (sub ? '−' : '+') + ' ' + b + ' = ' + rhs + '</b>', '', V.num(x), (sub ? 'Add ' : 'Subtract ') + b + ' on both sides: ' + a + '<i>x</i> = ' + a * x + '. Divide by ' + a + ': <i>x</i> = ' + x + '.');
  });
  add(7, 'alg', 'C2.1', function (r) {
    var a = r.int(2, 7), b = r.int(1, 6), c = r.int(1, 5);
    return Q('Simplify: <b>' + a + '<i>x</i> + ' + b + ' + ' + c + '<i>x</i></b>', '', mc(r, (a + c) + '<i>x</i> + ' + b, [(a + b + c) + '<i>x</i>', (a + c) + '<i>x</i> + ' + (b + 1), a * c + '<i>x</i> + ' + b]), 'Add the <i>x</i> terms together: ' + a + '<i>x</i> + ' + c + '<i>x</i> = ' + (a + c) + '<i>x</i>.');
  });
  add(7, 'alg', 'C1.4', function (r) {
    var st = r.int(5, 12), by = r.int(3, 6), seq = [0, 1, 2, 3].map(function (i) { return st - i * by; }), ans = st - 4 * by;
    return Q('What comes next?<br><b class="big">' + seq.map(V.neg).join(', ') + ', ?</b>', '', mc(r, V.neg(ans), [V.neg(-ans), V.neg(ans + 1), V.neg(ans - by)]), 'Subtract ' + by + ' each time.');
  });
  add(7, 'data', 'D2.1', function (r) {
    var k = r.pick([['Flip a coin twice. Both are heads.', 1, 4], ['Flip a coin and roll a number cube. You get heads and a 6.', 1, 12], ['Roll two number cubes. Both show 1.', 1, 36]]);
    return Q('These are independent events. What is the probability?<br><b>' + k[0] + '</b>', '', mc(r, fr(k[1], k[2]), [fr(1, 2), fr(2, k[2]), fr(1, k[2] / 2)].filter(function (x) { return x !== fr(k[1], k[2]); })), 'Multiply the probabilities of each event.');
  });
  add(7, 'data', 'D1.5', function (r) {
    var d = [r.int(5, 9), r.int(5, 9), r.int(5, 9), r.int(5, 9)], s = d.reduce(function (a, b) { return a + b; }), f = (4 - s % 4) % 4; d[0] += f; s += f;
    var m = s / 4, nw = m + 5 * r.int(1, 3);
    return Q('The mean of ' + d.join(', ') + ' is ' + m + '. If you add ' + nw + ' to the data, what happens to the mean?', '', V.ordered('It goes up.', ['It goes up.', 'It goes down.', 'It stays the same.']), nw + ' is bigger than the mean, so it pulls the mean up.');
  });
  add(7, 'data', 'D1.3', function (r) {
    var k = r.pick([['show parts of a whole, like how a budget is split', 'circle graph'], ['show how a temperature changes over a week', 'broken-line graph'], ['compare the number of students in 4 clubs', 'bar graph']]);
    return Q('Which graph is best to <b>' + k[0] + '</b>?', '', mc(r, k[1], ['circle graph', 'broken-line graph', 'bar graph', 'pictograph'].filter(function (x) { return x !== k[1]; }).slice(0, 2)), '');
  });
  add(7, 'space', 'E2.5', function (r) {
    var rr = r.int(2, 10);
    return Q('What is the area of the circle? Use π ≈ 3.14.', V.circ(rr, 'cm', 'r'), mc(r, V.dec(3.14 * rr * rr, 2) + ' cm²', [V.dec(3.14 * 2 * rr, 2) + ' cm²', V.dec(3.14 * rr, 2) + ' cm²', V.dec(3.14 * 4 * rr * rr, 2) + ' cm²']), 'A = π × r × r = 3.14 × ' + rr + ' × ' + rr + ' = ' + V.dec(3.14 * rr * rr, 2) + ' cm².');
  });
  add(7, 'space', 'E2.3', function (r) {
    var rr = r.int(2, 10);
    return Q('What is the circumference of the circle? Use π ≈ 3.14.', V.circ(rr, 'cm', 'd'), mc(r, V.dec(3.14 * 2 * rr, 2) + ' cm', [V.dec(3.14 * rr, 2) + ' cm', V.dec(3.14 * rr * rr, 2) + ' cm', V.dec(3.14 * 4 * rr, 2) + ' cm']), 'C = π × d = 3.14 × ' + 2 * rr + ' = ' + V.dec(3.14 * 2 * rr, 2) + ' cm.');
  });
  add(7, 'space', 'E2.7', function (r) {
    var l = r.int(3, 9), w = r.int(2, 6), h = r.int(2, 8);
    return Q('What is the volume of the box?', V.box(l, w, h, 'cm'), mc(r, l * w * h + ' cm³', [2 * (l * w + l * h + w * h) + ' cm³', (l + w + h) + ' cm³', l * w + ' cm³']), 'Area of base × height = ' + l * w + ' × ' + h + ' = ' + l * w * h + ' cm³.');
  });
  add(7, 'space', 'E1.4', function (r) {
    var x = r.int(1, 5), y = r.int(1, 5), ax = r.pick(['x', 'y']);
    var img = ax === 'x' ? [x, -y] : [-x, y];
    return Q('Point A is reflected over the <b>' + ax + '-axis</b>. Where does it end up?', V.plane([[x, y, 'A']], { q4: true, n: 6 }), mc(r, '(' + V.neg(img[0]) + ', ' + V.neg(img[1]) + ')', ['(' + V.neg(-img[0]) + ', ' + V.neg(-img[1]) + ')', '(' + V.neg(-x) + ', ' + V.neg(-y) + ')', '(' + y + ', ' + x + ')']), 'Reflecting over the ' + ax + '-axis changes the sign of the ' + (ax === 'x' ? 'y' : 'x') + '-coordinate.');
  });
  add(7, 'money', 'F1.1', function (r) {
    var rate = r.pick([1.35, 1.4, 1.25]), usd = r.pick([20, 40, 50, 100]);
    return Q('1 US dollar is worth $' + rate.toFixed(2) + ' Canadian. How many Canadian dollars is US$' + usd + '?', '', mc(r, V.money(Math.round(usd * rate * 100)), [V.money(Math.round(usd / rate * 100)), V.money(usd * 100 + Math.round(rate * 100)), V.money(Math.round(usd * (rate - 0.1) * 100))]), usd + ' × ' + rate.toFixed(2) + ' = ' + V.money(Math.round(usd * rate * 100)) + '.');
  });
  add(7, 'money', 'F1.5', function (r) {
    var p = r.pick([500, 1000, 2000]), rate = r.pick([3, 4, 5, 6]), y = r.int(2, 4);
    return Q('You borrow $' + fmt(p) + ' at ' + rate + '% simple interest a year. How much interest do you owe after ' + y + ' years?', '', mc(r, '$' + fmt(p * rate / 100 * y), ['$' + fmt(p * rate / 100), '$' + fmt(p + p * rate / 100 * y), '$' + fmt(p * rate * y / 10)]), 'Interest each year = ' + rate + '% of $' + fmt(p) + ' = $' + p * rate / 100 + '. Over ' + y + ' years: $' + fmt(p * rate / 100 * y) + '.');
  });

  /* =================== GRADE 8 =================== */
  add(8, 'num', 'B1.1', function (r) {
    var a = r.int(11, 99) / 10, e = r.int(3, 6), n = Math.round(a * Math.pow(10, e));
    return Q('What is <b>' + a.toFixed(1) + ' × 10<sup>' + e + '</sup></b> in standard form?', '', mcn(r, n, [n / 10, n * 10, Math.round(a * 10) * Math.pow(10, e)]), 'Move the decimal point ' + e + ' places to the right.');
  });
  add(8, 'num', 'B1.3', function (r) {
    var n = r.int(3, 11), x = n * n + r.int(1, 2 * n);
    return Q('√' + x + ' is between which two whole numbers?', '', mc(r, n + ' and ' + (n + 1), [(n - 1) + ' and ' + n, (n + 1) + ' and ' + (n + 2), Math.floor(x / 2) + ' and ' + (Math.floor(x / 2) + 1)]), n + '² = ' + n * n + ' and ' + (n + 1) + '² = ' + (n + 1) * (n + 1) + '. ' + x + ' is between them.');
  });
  add(8, 'num', 'B1.2', function (r) {
    var irr = r.pick(['√2', '√5', 'π', '√10']);
    return Q('Which number is irrational?', '', mc(r, irr, ['√9', '0.25', fr(2, 3), '−4', '√16'].slice(0, 3)), 'Irrational numbers have decimals that never end or repeat. √9 = 3 and √16 = 4 are whole numbers.');
  });
  add(8, 'num', 'B1.4', function (r) {
    var p = r.pick([150, 125, 200, 250]), n = r.pick([40, 80, 60, 20]);
    return Q('What is ' + p + '% of ' + n + '?', '', mcn(r, p * n / 100, [n + p / 100, p * n / 1000, p * n / 100 - n]), p + '% = ' + p / 100 + '. ' + p / 100 + ' × ' + n + ' = ' + p * n / 100 + '.');
  });
  add(8, 'ops', 'B2.7', function (r) {
    var a = r.int(2, 9), b = r.int(2, 9), s = r.int(0, 2);
    if (s === 0) return Q('What is ' + V.par(-a) + ' × ' + V.par(-b) + '?', '', mc(r, String(a * b), [V.neg(-a * b), V.neg(-a - b), String(a + b)]), 'Negative × negative = positive.');
    if (s === 1) return Q('What is ' + V.par(-a) + ' × ' + b + '?', '', mc(r, V.neg(-a * b), [String(a * b), V.neg(-a - b), V.neg(b - a)]), 'Negative × positive = negative.');
    return Q('What is ' + V.neg(-a * b) + ' ÷ ' + V.par(-b) + '?', '', mc(r, String(a), [V.neg(-a), String(a * b), V.neg(-b)]), 'Negative ÷ negative = positive.');
  });
  add(8, 'ops', 'B2.6', function (r) {
    var k = r.pick([[3, 4, 1, 8], [2, 3, 1, 6], [5, 6, 1, 3], [3, 5, 2, 5], [1, 2, 1, 6]]);
    var N = k[0] * k[3], D = k[1] * k[2], g = V.gcd(N, D), ans = D / g === 1 ? String(N / g) : fr(N / g, D / g);
    return Q('What is ' + fr(k[0], k[1]) + ' ÷ ' + fr(k[2], k[3]) + '?', '', mc(r, ans, [fr(k[0] * k[2], k[1] * k[3]), fr(k[1] * k[2], k[0] * k[3]), String(N / g + 1)].filter(function (x) { return x !== ans; })), 'Multiply by the reciprocal: ' + fr(k[0], k[1]) + ' × ' + fr(k[3], k[2]) + ' = ' + fr(N, D) + '.');
  });
  add(8, 'ops', 'B2.8', function (r) {
    var a = r.int(2, 5), b = a + r.int(1, 4), m = r.int(2, 5);
    return Q('Solve the proportion:<br><b class="big">' + fr(a, b) + ' = ' + fr('<i>x</i>', b * m) + '</b>', '', V.num(a * m), b + ' × ' + m + ' = ' + b * m + ', so <i>x</i> = ' + a + ' × ' + m + ' = ' + a * m + '.');
  });
  add(8, 'ops', 'B2.1', function (r) {
    var a = r.int(2, 5), b = r.int(2, 4), c = r.int(1, 9);
    return Q('What is <b>' + c + ' + ' + a + '<sup>2</sup> × ' + b + '</b>?', '', mcn(r, c + a * a * b, [(c + a * a) * b, c + a * 2 * b, Math.pow(a * b, 2) + c]), 'Powers first (' + a + '² = ' + a * a + '), then multiply (× ' + b + ' = ' + a * a * b + '), then add ' + c + '.');
  });
  add(8, 'alg', 'C2.3', function (r) {
    var a = r.int(4, 9), c = r.int(1, a - 1), x = r.int(2, 9), b = r.pick([-9, -7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 8]), d = (a - c) * x + b;
    var lhs = a + '<i>x</i> ' + (b < 0 ? '− ' + (-b) : '+ ' + b), rhs = (c === 1 ? '' : c) + '<i>x</i> ' + (d < 0 ? '− ' + (-d) : '+ ' + d);
    return Q('Solve for <i>x</i>:<br><b class="big">' + lhs + ' = ' + rhs + '</b>', '', V.num(x), 'Move the <i>x</i> terms to one side: ' + (a - c) + '<i>x</i> = ' + (d - b) + ', so <i>x</i> = ' + x + '.');
  });
  add(8, 'alg', 'C2.2', function (r) {
    var x = -r.int(2, 6), a = r.int(2, 5), b = r.int(1, 9);
    return Q('What is <b>' + a + '<i>x</i> + ' + b + '</b> when <i>x</i> = ' + V.neg(x) + '?', '', mc(r, V.neg(a * x + b), [V.neg(-a * x + b), V.neg(a * x - b), V.neg(a + x + b)]), a + ' × ' + V.par(x) + ' + ' + b + ' = ' + V.neg(a * x) + ' + ' + b + ' = ' + V.neg(a * x + b) + '.');
  });
  add(8, 'alg', 'C2.4', function (r) {
    var a = r.int(2, 5), b = r.int(1, 9), lim = a * r.int(2, 6) + b;
    var k = (lim - b) / a;
    return Q('Solve: <b>' + a + '<i>x</i> + ' + b + ' &gt; ' + lim + '</b>', '', mc(r, '<i>x</i> &gt; ' + k, ['<i>x</i> &lt; ' + k, '<i>x</i> &gt; ' + (lim + b) / a, '<i>x</i> &gt; ' + (lim - b)].filter(function (x) { return x.indexOf('.') < 0; }).concat(['<i>x</i> = ' + k])), 'Subtract ' + b + ', then divide by ' + a + ': <i>x</i> &gt; ' + k + '.');
  });
  add(8, 'alg', 'C1.3', function (r) {
    var m = r.int(2, 6), b = r.int(-5, 8), n = r.int(10, 30);
    var rule = m + 'n' + (b > 0 ? ' + ' + b : b < 0 ? ' − ' + (-b) : '');
    return Q('A pattern follows the rule <b>' + rule + '</b>, where n is the term number. What is term ' + n + '?', V.table(['n', '1', '2', '3'], [['value', m + b, 2 * m + b, 3 * m + b].map(V.neg)]), mc(r, V.neg(m * n + b), [V.neg(m * (n + b)), V.neg(m + n + b), V.neg(m * n - b)]), m + ' × ' + n + (b ? (b > 0 ? ' + ' : ' − ') + Math.abs(b) : '') + ' = ' + V.neg(m * n + b) + '.');
  });
  add(8, 'data', 'D1.5', function (r) {
    var k = r.pick(['pos', 'neg', 'none']), pts = '', i;
    for (i = 0; i < 12; i++) {
      var x = 20 + i * 15, y = k === 'pos' ? 170 - i * 12 + r.int(-14, 14) : k === 'neg' ? 30 + i * 12 + r.int(-14, 14) : r.int(30, 170);
      pts += '<circle cx="' + x + '" cy="' + y + '" r="5" class="mark"/>';
    }
    var vis = V.svg(220, 200, '<line x1="10" y1="190" x2="210" y2="190" class="ax"/><line x1="10" y1="10" x2="10" y2="190" class="ax"/>' + pts, 'scatter plot');
    var ans = k === 'pos' ? 'positive' : k === 'neg' ? 'negative' : 'no relationship';
    return Q('What kind of relationship does this scatter plot show?', vis, V.ordered(ans, ['positive', 'negative', 'no relationship']), k === 'pos' ? 'As one goes up, the other goes up.' : k === 'neg' ? 'As one goes up, the other goes down.' : 'The points have no clear direction.');
  });
  add(8, 'data', 'D2.1', function (r) {
    var p = r.pick([[3, 10], [1, 4], [2, 5], [7, 20]]);
    return Q('The probability of rain tomorrow is ' + fr(p[0], p[1]) + '. What is the probability it will <b>not</b> rain?', '', mc(r, fr(p[1] - p[0], p[1]), [fr(p[0], p[1] - p[0]), fr(1, p[1]), fr(p[1], p[0])]), 'P(not rain) = 1 − ' + fr(p[0], p[1]) + ' = ' + fr(p[1] - p[0], p[1]) + '.');
  });
  add(8, 'data', 'D2.2', function (r) {
    return Q('You flip a coin 3 times. How many different outcomes are possible (like HHT)?', '', mcn(r, 8, [6, 3, 9]), '2 × 2 × 2 = 8. A tree diagram shows all of them.');
  });
  add(8, 'space', 'E2.4', function (r) {
    var k = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]);
    return Q('What is the length of the longest side (the hypotenuse)?', V.rtri(k[0], k[1], '?', 'cm'), mc(r, k[2] + ' cm', [(k[0] + k[1]) + ' cm', (k[2] + 1) + ' cm', (k[1] + 1) + ' cm']), k[0] + '² + ' + k[1] + '² = ' + (k[0] * k[0] + k[1] * k[1]) + ' = ' + k[2] + '².');
  });
  add(8, 'space', 'E2.2', function (r) {
    var a = r.int(45, 80), k = r.pick(['opp', 'next']);
    var vis = V.parallel(k === 'opp' ? { top: a + '°', botOpp: '?' } : { top: a + '°', topL: '?' });
    var ans = k === 'opp' ? a : 180 - a;
    return Q('The two horizontal lines are parallel. What is the angle marked ?', vis, mc(r, ans + '°', [(180 - ans) + '°', (90 - (ans % 90)) + '°', (360 - ans) + '°']), k === 'opp' ? 'Alternate angles between parallel lines are equal.' : 'Angles on a straight line add up to 180°.');
  });
  add(8, 'space', 'E2.3', function (r) {
    var rr = r.int(2, 6), h = r.int(3, 10);
    return Q('What is the volume of the cylinder? Use π ≈ 3.14.', V.cyl(rr, h, 'cm'), mc(r, V.dec(3.14 * rr * rr * h, 2) + ' cm³', [V.dec(3.14 * 2 * rr * h, 2) + ' cm³', V.dec(3.14 * rr * h, 2) + ' cm³', V.dec(3.14 * rr * rr, 2) + ' cm³']), 'Area of base × height = 3.14 × ' + rr + '² × ' + h + ' = ' + V.dec(3.14 * rr * rr * h, 2) + ' cm³.');
  });
  add(8, 'space', 'E1.3', function (r) {
    var s = r.pick([50, 100, 200]), cm = r.int(2, 9);
    return Q('A floor plan has a scale of 1 : ' + s + '. A wall is ' + cm + ' cm long on the plan. How long is the real wall?', '', mc(r, V.dec(cm * s / 100, 2) + ' m', [V.dec(cm * s / 1000, 2) + ' m', V.dec(cm * s, 2) + ' m', V.dec(cm * s / 10, 2) + ' m']), cm + ' × ' + s + ' = ' + fmt(cm * s) + ' cm = ' + V.dec(cm * s / 100, 2) + ' m.');
  });
  add(8, 'money', 'F1.4', function (r) {
    var p = r.pick([1000, 2000, 500]), rate = r.pick([5, 10]);
    var c = Math.round(p * Math.pow(1 + rate / 100, 2) * 100);
    return Q('You invest $' + fmt(p) + ' at ' + rate + '% interest, compounded once a year. How much is it worth after 2 years?', '', mc(r, V.money(c), [V.money(p * 100 + p * rate * 2), V.money(p * 100 + p * rate), V.money(c + p * rate)]), 'Year 1: $' + fmt(p) + ' × ' + (1 + rate / 100) + ' = ' + V.money(p * (100 + rate)) + '. Year 2: that × ' + (1 + rate / 100) + ' = ' + V.money(c) + '.');
  });
  add(8, 'money', 'F1.5', function (r) {
    var p = r.pick([40, 60, 80, 120]), off = r.pick([20, 25, 30]);
    return Q('A jacket is $' + p + '. It is on sale for ' + off + '% off. What is the sale price (before tax)?', '', mc(r, V.money(p * (100 - off)), [V.money(p * off), V.money((p - off) * 100), V.money(p * (100 + off))]), off + '% of $' + p + ' = ' + V.money(p * off) + '. $' + p + ' − ' + V.money(p * off) + ' = ' + V.money(p * (100 - off)) + '.');
  });
  add(8, 'money', 'F1.6', function (r) {
    var bal = r.pick([500, 1000, 1500]), rate = r.pick([12, 18, 24]);
    return Q('A credit card charges ' + rate + '% interest a year. If you owe $' + fmt(bal) + ' for a whole year, about how much interest is that?', '', mc(r, '$' + fmt(bal * rate / 100), ['$' + rate, '$' + fmt(bal * rate / 10), '$' + fmt(bal + rate)]), rate + '% of $' + fmt(bal) + ' = $' + fmt(bal * rate / 100) + '.');
  });

  window.PB = { bank: B, AREAS: ['num', 'ops', 'alg', 'data', 'space', 'money'] };
})();
