/* Grade 2 Adding and Subtracting to 100: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per
   idea of the lessons in chapters/add-subtract-100.js: Learn, Practise 1 to 3 and Think. Every question is written here, not
   made at random. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.1 properties of addition and subtraction; B2.3 mental math strategies, including estimation, to add and
   subtract; B2.4 objects, diagrams and equations for addition and subtraction to 100.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function sum(a, op, b) { return op === '+' ? a + b : a - b; }
  function F(list) { return { eq: list.map(function (f) { return f[0] + ' ' + f[1] + ' ' + f[2] + ' = []'; }), a: list.map(function (f) { return sum(f[0], f[1], f[2]); }) }; }
  function FA(list) { var f = F(list); f.cols = 3; f.wide = true; return f; }
  function blk(n) { return ['blocks', { h: Math.floor(n / 100), t: Math.floor(n / 10) % 10, o: n % 10 }]; }
  /* tens: 3 tens + 4 tens = [] tens = [] */
  function TT(a, op, b) { return { eq: [a + ' tens ' + op + ' ' + b + ' tens = [] tens', (10 * a) + ' ' + op + ' ' + (10 * b) + ' = []'], a: [sum(a, op, b), 10 * sum(a, op, b)] }; }
  /* tens first, then ones: 34 + 25 as 30 + 20, 4 + 5 */
  function TO(a, b) { var t = Math.floor(a / 10) * 10, u = Math.floor(b / 10) * 10; return { eq: [t + ' + ' + u + ' = []', (a % 10) + ' + ' + (b % 10) + ' = []', a + ' + ' + b + ' = []'], a: [t + u, a % 10 + b % 10, a + b] }; }
  /* the same with blocks for both numbers */
  function TOB(a, b) { var it = TO(a, b); it.pic = ['row', { list: [blk(a), blk(b)], labels: [String(a), String(b)] }]; it.wide = true; it.cols = 3; return it; }
  /* jumps on a number line: the tens in one jump, then the ones */
  function JP(a, op, b, min, max) {
    var t = Math.floor(b / 10) * 10, o = b % 10, m = sum(a, op, t), j = [[a, m, op + t]];
    if (o) j.push([m, sum(m, op, o), op + o]);
    return { pic: ['nl', { min: min, max: max, tick: 5, lab: 10, jumps: j }], eq: [a + ' ' + op + ' ' + b + ' = []'], a: [sum(a, op, b)] };
  }
  /* count up from the smaller number to a ten, then on */
  function UP(a, b) {
    var ten = Math.ceil(b / 10) * 10, j = ten > b ? [[b, ten, '+' + (ten - b)]] : [];
    if (a > ten) j.push([ten, a, '+' + (a - ten)]);
    return { pic: ['nl', { min: Math.floor(b / 10) * 10 - 10, max: Math.floor(b / 10) * 10 + 20, tick: 1, lab: 5, jumps: j }], eq: [a + ' − ' + b + ' = []'], a: [a - b] };
  }
  /* estimate by rounding to the nearest ten first */
  function ES(list) { return { eq: list.map(function (f) { return f[0] + ' ' + f[1] + ' ' + f[2] + ' is about []'; }), a: list.map(function (f) { var r = function (n) { return Math.round(n / 10) * 10; }; return sum(r(f[0]), f[1], r(f[2])); }), est: 10 }; }
  /* the closest estimate, circled */
  function EC(a, op, b, opts) {
    var v = sum(a, op, b), d = opts.map(function (o) { return Math.abs(o - v); });
    return { q: a + ' ' + op + ' ' + b + ' is about:', pick: { opts: opts.map(String), ans: d.indexOf(Math.min.apply(null, d)), est: a + ' ' + op + ' ' + b } };
  }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  function PM(q, unit, a, op, b) { return { q: q, pick: { opts: ['+', '−'], ans: op === '+' ? 0 : 1 }, eq: ['[] ' + unit], a: [sum(a, op, b)], calc: a + ' ' + op + ' ' + b }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  /* is a op b = c right? check it with the opposite */
  function CK(a, op, b, c) {
    var back = op === '+' ? '−' : '+';
    return { q: a + ' ' + op + ' ' + b + ' = ' + c + '. Check it.', eq: [c + ' ' + back + ' ' + b + ' = []'], a: [sum(c, back, b)], pick: { opts: ['right', 'wrong'], ans: sum(a, op, b) === c ? 0 : 1 }, pickLast: true, tf: a + ' ' + op + ' ' + b + ' = ' + c };
  }

  S.register('add-subtract-100', { code: 'AS', ideas: {

    addtens: {
      watch: 'adding the tens digits and forgetting they are tens (30 + 40 = 7). Say "3 tens and 4 tens is 7 tens: 70."',
      goal: 'I can add tens.',
      learn: {
        show: { pic: ['blocks', { h: 0, t: 7, o: 0 }], cap: '3 rods and 4 rods', eq: ['3 tens + 4 tens = 7 tens', '30 + 40 = 70'] },
        together: [TT(2, '+', 5), TT(4, '+', 4)],
        cue: 'Add the tens like ones. Then say tens.',
        own: [TT(6, '+', 3), TT(1, '+', 8), F([[50, '+', 20], [70, '+', 30]]), F([[20, '+', 60], [40, '+', 50]])]
      },
      p1: {
        show: { cap: '2 + 3 = 5, so', eq: ['20 + 30 = 50'] },
        items: [TT(3, '+', 3), TT(5, '+', 4), F([[10, '+', 40], [60, '+', 20]]), F([[30, '+', 50], [80, '+', 10]]), F([[40, '+', 40], [20, '+', 70]]), F([[50, '+', 50], [10, '+', 90]])]
      },
      p2: {
        items: [FA([[30, '+', 60], [20, '+', 20], [70, '+', 20], [40, '+', 30], [10, '+', 80], [60, '+', 40]]),
          { eq: ['25 + 10 = []', '25 + 30 = []'], a: [35, 55] }, { eq: ['43 + 20 = []', '43 + 50 = []'], a: [63, 93] },
          story('{a} has 30 {many}. {b} gives {a} 40 more. How many now?', '{many}', 70, '30 + 40'), { eq: ['[] + 30 = 80'], a: [50] }]
      },
      p3: {
        items: [FA([[17, '+', 30], [52, '+', 40], [26, '+', 60], [38, '+', 20], [64, '+', 30], [9, '+', 80]]),
          { eq: ['[] + 40 = 100'], a: [60] }, { eq: ['36 + [] = 76'], a: [40] },
          story('{a} has 45 {many} and gets 3 {conts} of 10. How many now?', '{many}', 75, '45 + 3 × 10'), TF('58 + 30 = 88', true)]
      },
      think: {
        items: [{ q: '{b} says 40 + 50 = 9. What went wrong?', lines: { n: 2, key: '4 tens and 5 tens is 9 tens, which is 90.' } },
          { q: 'How does 3 + 6 help with 30 + 60?', lines: { n: 2, key: '3 tens and 6 tens is 9 tens: 90.' } },
          { q: 'Add 27 + 40 on a number line with jumps of 10.', draw: { h: 60, key: ['nl', { min: 20, max: 70, tick: 5, lab: 10, jumps: [[27, 37], [37, 47], [47, 57], [57, 67]] }] } },
          { q: 'Which ten-number pairs make 100? Write three.', lines: { n: 2, key: '10 + 90, 20 + 80, 30 + 70, 40 + 60, 50 + 50.' } }]
      }
    },

    subtens: {
      watch: 'taking away from the ones digit (56 − 20 = 54). Taking tens away changes the tens digit only.',
      goal: 'I can take away tens.',
      learn: {
        show: { pic: ['blocks', { h: 0, t: 5, o: 6 }], cap: 'Take away 2 rods', eq: ['56 − 20 = 36'] },
        together: [TT(7, '−', 3), TT(9, '−', 5)],
        cue: 'Take away tens: only the tens digit changes.',
        own: [TT(8, '−', 2), TT(6, '−', 6), F([[47, '−', 20], [83, '−', 50]]), F([[100, '−', 30], [65, '−', 40]])]
      },
      p1: {
        show: { cap: '8 − 3 = 5, so', eq: ['80 − 30 = 50'] },
        items: [TT(5, '−', 2), TT(9, '−', 4), F([[70, '−', 10], [60, '−', 30]]), F([[90, '−', 60], [40, '−', 20]]), F([[58, '−', 10], [36, '−', 20]]), F([[74, '−', 40], [99, '−', 50]])]
      },
      p2: {
        items: [FA([[62, '−', 30], [85, '−', 40], [41, '−', 20], [97, '−', 70], [53, '−', 10], [78, '−', 60]]),
          story('{a} has 90 {many} and gives away 40. How many are left?', '{many}', 50, '90 − 40'), story('{b} has 67 {many}. 3 {conts} of 10 are sold. How many are left?', '{many}', 37, '67 − 3 × 10'),
          { eq: ['86 − [] = 46'], a: [40] }, TF('75 − 30 = 45', true)]
      },
      p3: {
        items: [FA([[100, '−', 60], [93, '−', 80], [48, '−', 30], [100, '−', 20], [71, '−', 50], [66, '−', 60]]),
          { eq: ['[] − 30 = 42'], a: [72] }, { eq: ['100 − [] = 10'], a: [90] },
          story('{a} needs 80 {many} and has 50. How many more?', '{many}', 30, '80 − 50'), TF('64 − 20 = 62', false)]
      },
      think: {
        items: [{ q: '{a} says 56 − 20 = 54. What went wrong?', lines: { n: 2, key: '{a} took 2 from the ones. Take 2 tens: 56 − 20 = 36.' } },
          { q: 'Show 85 − 30 with jumps back of 10.', draw: { h: 60, key: ['nl', { min: 50, max: 90, tick: 5, lab: 10, jumps: [[85, 75], [75, 65], [65, 55]] }] } },
          { q: 'Why does the ones digit stay the same when you take away tens?', lines: { n: 2, key: 'You only remove rods. The loose cubes do not change.' } },
          { q: 'Write two subtractions with the answer 30.', lines: { n: 2, key: 'For example: 50 − 20 = 30, 100 − 70 = 30.' } }]
      }
    },

    tensones: {
      watch: 'adding the tens digit to the ones digit (34 + 25 = 3 + 4 + 2 + 5). Keep tens with tens and ones with ones.',
      goal: 'I can add the tens, then the ones.',
      learn: {
        show: { pic: ['row', { list: [blk(34), blk(25)], labels: ['34', '25'] }], cap: 'Tens: 30 + 20. Ones: 4 + 5.', eq: ['50 + 9', '34 + 25 = 59'] },
        together: [TO(23, 14), TO(41, 35)],
        cue: 'Add the tens. Add the ones. Put them together.',
        own: [TO(52, 16), TO(33, 33), F([[17, '+', 42], [60, '+', 28]]), F([[24, '+', 63], [45, '+', 51]])]
      },
      p1: {
        show: { cap: '24 + 13: 30 and 7', eq: ['24 + 13 = 37'] },
        items: [TO(12, 15), TO(31, 26), TO(44, 22), TO(53, 34), TO(25, 51), TO(70, 18)]
      },
      p2: {
        items: [TOB(36, 21), FA([[42, '+', 35], [27, '+', 61], [55, '+', 23], [14, '+', 74], [63, '+', 25], [38, '+', 40]]),
          story('{a} has 34 {many}. {b} has 45 {many}. How many in all?', '{many}', 79, '34 + 45'), { eq: ['[] + 23 = 68'], a: [45] }]
      },
      p3: {
        items: [FA([[46, '+', 32], [71, '+', 17], [24, '+', 55], [33, '+', 46], [62, '+', 37], [15, '+', 84]]),
          story('{a} has 52 {many} and finds 36 more. How many now?', '{many}', 88, '52 + 36'), story('A {cont} has 41 {many}. Another has 47. How many in all?', '{many}', 88, '41 + 47'),
          CK(32, '+', 45, 77), CK(23, '+', 64, 97)]
      },
      think: {
        items: [{ q: '{b} added 34 + 25 as 3 + 4 + 2 + 5 = 14. What went wrong?', lines: { n: 2, key: '3 and 2 are tens. 30 + 20 = 50 and 4 + 5 = 9: 59.' } },
          { q: 'Draw blocks for 43 + 26 and add them.', draw: { h: 70, key: '6 rods and 9 cubes: 69.' } },
          { q: 'Write two numbers that add to 57 with no trading.', lines: { n: 1, key: 'For example: 32 + 25, 41 + 16, 50 + 7.' } },
          { q: 'Does 25 + 34 give the same as 34 + 25? Why?', lines: { n: 2, key: 'Yes. Adding in any order gives the same sum: 59.' } }]
      }
    },

    trade: {
      watch: 'writing 13 ones as 13 in the ones place (38 + 25 = 513). 10 of the ones make one more ten.',
      goal: 'I can trade 10 ones for a ten when I add.',
      learn: {
        show: { pic: ['row', { list: [blk(38), blk(25)], labels: ['38', '25'] }], cap: '13 ones: trade 10 for a ten', eq: ['50 + 13 = 63', '38 + 25 = 63'] },
        together: [TO(27, 15), TO(46, 38)],
        cue: '10 ones make 1 ten. Trade them, then add.',
        own: [TO(19, 23), TO(35, 47), F([[58, '+', 26], [64, '+', 29]]), F([[27, '+', 38], [49, '+', 46]])]
      },
      p1: {
        show: { cap: '17 ones = 1 ten 7 ones', eq: ['40 + 17 = 57'] },
        items: [TO(18, 14), TO(26, 36), TO(49, 22), TO(37, 37), TO(55, 28), TO(16, 68)]
      },
      p2: {
        items: [TOB(29, 34), FA([[38, '+', 44], [27, '+', 56], [65, '+', 17], [19, '+', 49], [48, '+', 35], [56, '+', 39]]),
          story('{a} has 37 {many} and gets 45 more. How many now?', '{many}', 82, '37 + 45'), { eq: ['5 tens 14 ones = []'], a: [64] }]
      },
      p3: {
        items: [FA([[47, '+', 45], [68, '+', 27], [29, '+', 39], [36, '+', 58], [74, '+', 19], [55, '+', 45]]),
          story('{b} has 48 {many}. {a} has 36. How many in all?', '{many}', 84, '48 + 36'), story('A {cont} holds 59 {many}. Another holds 33. How many in all?', '{many}', 92, '59 + 33'),
          CK(46, '+', 37, 73), CK(28, '+', 55, 83)]
      },
      think: {
        items: [{ q: '{a} wrote 38 + 25 = 513. What went wrong?', lines: { n: 2, key: '8 + 5 = 13 ones is 1 ten 3 ones. 50 + 13 = 63.' } },
          { q: 'Draw blocks for 27 + 16. Show the trade.', draw: { h: 70, key: '3 rods and 13 cubes; trade 10 cubes for a rod: 4 rods 3 cubes = 43.' } },
          { q: 'How do you know when you need to trade?', lines: { n: 2, key: 'When the ones add to 10 or more.' } },
          { q: 'Write a sum where you must trade, and one where you do not.', lines: { n: 2, key: 'Trade: 47 + 36. No trade: 42 + 36.' } }]
      }
    },

    jumps: {
      watch: 'making many jumps of 1. Jump all the tens first, then the ones.',
      goal: 'I can jump the tens, then the ones.',
      learn: {
        show: { cap: '35 + 34: jump +30, then +4', eq: ['35 + 30 = 65', '65 + 4 = 69'] },
        together: [JP(24, '+', 32, 20, 70), JP(46, '+', 27, 40, 80)],
        cue: 'Jump the tens in one jump. Then jump the ones.',
        own: [JP(15, '+', 43, 10, 60), JP(52, '+', 36, 50, 90), F([[38, '+', 25], [61, '+', 29]]), F([[27, '+', 41], [44, '+', 37]])]
      },
      p1: {
        show: { cap: '+20, then +5', eq: ['42 + 25 = 67'] },
        items: [JP(13, '+', 24, 10, 40), JP(31, '+', 45, 30, 80), JP(27, '+', 52, 20, 80), JP(56, '+', 33, 50, 90), JP(44, '+', 18, 40, 70), JP(18, '+', 36, 10, 60)]
      },
      p2: {
        items: [JP(37, '+', 46, 30, 90), JP(29, '+', 54, 20, 90), FA([[33, '+', 47], [56, '+', 25], [18, '+', 67], [42, '+', 39], [65, '+', 26], [24, '+', 58]]),
          story('{a} walks 36 m, then 45 m more. How far in all?', 'm', 81, '36 + 45'), story('{b} reads 28 pages, then 34 more. How many pages?', 'pages', 62, '28 + 34')]
      },
      p3: {
        items: [FA([[45, '+', 38], [27, '+', 66], [59, '+', 32], [36, '+', 47], [64, '+', 28], [19, '+', 75]]),
          { q: 'Draw jumps for 47 + 35.', draw: { h: 60, key: ['nl', { min: 40, max: 90, tick: 5, lab: 10, jumps: [[47, 77, '+30'], [77, 82, '+5']] }] } },
          { q: 'Draw jumps for 26 + 58.', draw: { h: 60, key: ['nl', { min: 20, max: 90, tick: 5, lab: 10, jumps: [[26, 76, '+50'], [76, 84, '+8']] }] } },
          story('{a} has 48 {many}. {b} has 39. How many in all?', '{many}', 87, '48 + 39')]
      },
      think: {
        items: [{ q: '{b} made 23 jumps of 1 for 45 + 23. Show a faster way.', draw: { h: 60, key: ['nl', { min: 40, max: 70, tick: 5, lab: 10, jumps: [[45, 65, '+20'], [65, 68, '+3']] }] } },
          { q: 'Could you jump the ones first? Try 36 + 47.', lines: { n: 2, key: 'Yes: 36 + 7 = 43, then 43 + 40 = 83. Same answer.' } },
          { q: 'Why are jumps of 10 easy to count?', lines: { n: 2, key: 'Only the tens digit changes: 35, 45, 55.' } },
          { q: 'Add 29 + 34 another way. Explain.', lines: { n: 2, key: '29 is close to 30: 30 + 34 = 64, take 1 back: 63.' } }]
      }
    },

    estimate: {
      watch: 'rounding the wrong way (rounding 46 to 40). Ask: which ten is it closer to?',
      goal: 'I can estimate before I add or subtract.',
      learn: {
        show: { cap: '38 is about 40, 21 is about 20', eq: ['40 + 20 = 60', '38 + 21 is about 60'] },
        together: [ES([[29, '+', 42]]), ES([[68, '−', 31]])],
        cue: 'Change each number to the closest ten. Then add or subtract.',
        own: [ES([[51, '+', 37]]), ES([[19, '+', 59]]), ES([[82, '−', 48]]), ES([[93, '−', 22]])]
      },
      p1: {
        show: { cap: '47 is about 50', eq: ['47 + 32 is about 80'] },
        items: [ES([[31, '+', 18]]), ES([[22, '+', 46]]), ES([[59, '+', 28]]), ES([[71, '−', 29]]), ES([[88, '−', 42]]), ES([[64, '−', 19]])]
      },
      p2: {
        items: [EC(39, '+', 41, [60, 80, 100]), EC(72, '−', 28, [40, 50, 60]), EC(18, '+', 63, [70, 80, 90]), EC(91, '−', 49, [30, 40, 60]),
          { q: '{a} has 48 {many} and gets 29. About how many?', pick: { opts: ['about 60', 'about 80', 'about 100'], ans: 1, est: '48 + 29' }, wide: true },
          ES([[33, '+', 58]])]
      },
      p3: {
        items: [ES([[26, '+', 37], [52, '+', 39]]), ES([[81, '−', 38], [69, '−', 41]]),
          { q: '{b} says 47 + 38 = 65. Use an estimate. Is that close?', pick: { opts: ['close', 'not close'], ans: 1 }, tf: '47 + 38 = 65', lines: { n: 1, key: 'About 50 + 40 = 90, so 65 is too low. It is 85.' }, wide: true },
          { q: '{a} has 62 {many}. 28 are used. About how many are left?', pick: { opts: ['about 20', 'about 30', 'about 50'], ans: 1, est: '62 − 28' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why estimate before you add?', lines: { n: 2, key: 'To know about what the answer should be, so you can spot a mistake.' } },
          { q: '{a} rounded 46 to 40. Is that right? How do you know?', lines: { n: 2, key: 'No. 46 is closer to 50 than to 40.' } },
          { q: '{b} has $90. Can {b} buy a $38 game and a $47 game? Estimate.', lines: { n: 2, key: 'About 40 + 50 = 90. It is close, so add exactly: 85. Yes.' } },
          { q: 'Show on a number line which ten 34 is closer to.', draw: { h: 60, key: ['nl', { min: 30, max: 40, tick: 1, lab: 5, pt: 34, ptl: '34' }] } }]
      }
    },

    order: {
      watch: 'adding left to right every time. Look for pairs that make a ten first.',
      goal: 'I can add in any order to make it easier.',
      learn: {
        show: { cap: '7 + 3 make 10 first', eq: ['7 + 36 + 3 = 36 + 10', '7 + 36 + 3 = 46'] },
        together: [{ eq: ['8 + 25 + 2 = 25 + [] = []'], a: [10, 35], wide: true }, { eq: ['6 + 47 + 4 = 47 + [] = []'], a: [10, 57], wide: true }],
        cue: 'Look for numbers that make 10. Add them first.',
        own: [{ eq: ['9 + 1 + 63 = []'], a: [73] }, { eq: ['5 + 28 + 5 = []'], a: [38] }, { eq: ['30 + 45 + 70 = []'], a: [145] }, { eq: ['2 + 19 + 8 = []'], a: [29] }]
      },
      p1: {
        show: { cap: 'Turn it around', eq: ['4 + 52 = 52 + 4 = 56'] },
        items: [{ eq: ['3 + 64 = 64 + [] = []'], a: [3, 67], wide: true }, { eq: ['7 + 3 + 22 = 10 + [] = []'], a: [22, 32], wide: true },
          { eq: ['6 + 34 + 4 = []'], a: [44] }, { eq: ['8 + 2 + 57 = []'], a: [67] }, { eq: ['1 + 76 + 9 = []'], a: [86] }, { eq: ['5 + 41 + 5 = []'], a: [51] }]
      },
      p2: {
        items: [{ eq: ['16 + 9 + 4 = []'], a: [29] }, { eq: ['7 + 18 + 3 + 2 = []'], a: [30] }, { eq: ['20 + 35 + 80 = []'], a: [135] }, { eq: ['4 + 6 + 8 + 2 = []'], a: [20] },
          story('{a} has 6 {many}, {b} has 23 and a friend has 4. How many in all?', '{many}', 33, '6 + 23 + 4'), TF('38 + 5 = 5 + 38', true)]
      },
      p3: {
        items: [{ eq: ['25 + 18 + 25 = []'], a: [68] }, { eq: ['9 + 43 + 11 = []'], a: [63] }, { eq: ['13 + 7 + 26 + 4 = []'], a: [50] }, { eq: ['50 + 27 + 50 = []'], a: [127] },
          { eq: ['36 + 8 + 4 = 36 + []'], a: [12] }, TF('20 − 5 = 5 − 20', false)]
      },
      think: {
        items: [{ q: 'Which two numbers would you add first in 7 + 26 + 3? Why?', lines: { n: 2, key: '7 + 3 = 10 first. Adding 10 to 26 is easy: 36.' } },
          { q: 'Can you change the order in 50 − 20? Why?', lines: { n: 2, key: 'No. 50 − 20 = 30, but 20 − 50 does not work with things.' } },
          { q: 'Find a quick way: 4 + 5 + 6 + 5.', lines: { n: 2, key: '4 + 6 = 10 and 5 + 5 = 10, so 20.' } },
          { q: 'Write 3 numbers that are easy to add in a new order.', lines: { n: 1, key: 'For example: 8 + 45 + 2 (8 + 2 = 10, then 55).' } }]
      }
    },

    back: {
      watch: 'jumping forward instead of back, or taking the tens off the ones. Jump back the tens first, then the ones.',
      goal: 'I can jump back to subtract.',
      learn: {
        show: { cap: '65 − 23: jump −20, then −3', eq: ['65 − 20 = 45', '45 − 3 = 42'] },
        together: [JP(58, '−', 24, 30, 60), JP(77, '−', 35, 40, 80)],
        cue: 'Jump back the tens. Then jump back the ones.',
        own: [JP(49, '−', 16, 30, 50), JP(86, '−', 42, 40, 90), F([[64, '−', 31], [95, '−', 53]]), F([[72, '−', 45], [58, '−', 29]])]
      },
      p1: {
        show: { cap: '−30, then −2', eq: ['78 − 32 = 46'] },
        items: [JP(37, '−', 14, 20, 40), JP(68, '−', 25, 40, 70), JP(59, '−', 33, 20, 60), JP(84, '−', 51, 30, 90), JP(76, '−', 44, 30, 80), JP(99, '−', 67, 30, 100)]
      },
      p2: {
        items: [JP(52, '−', 27, 20, 60), JP(83, '−', 46, 30, 90), FA([[64, '−', 28], [71, '−', 35], [93, '−', 47], [56, '−', 19], [82, '−', 54], [45, '−', 26]]),
          story('{a} has 72 {many} and gives away 35. How many are left?', '{many}', 37, '72 − 35'), story('{b} has 90 cm of string and cuts off 46 cm. How much is left?', 'cm', 44, '90 − 46')]
      },
      p3: {
        items: [FA([[81, '−', 37], [62, '−', 28], [94, '−', 58], [70, '−', 34], [53, '−', 26], [100, '−', 45]]),
          story('{a} has 84 {many}. 39 are sold. How many are left?', '{many}', 45, '84 − 39'), story('A {cont} holds 65 {many}. 27 fall out. How many are left?', '{many}', 38, '65 − 27'),
          CK(75, '−', 38, 37), CK(91, '−', 46, 55)]
      },
      think: {
        items: [{ q: '{b} jumped 65 − 23 as 65 + 20 + 3. What went wrong?', lines: { n: 2, key: 'Taking away jumps back: 65 − 20 = 45, 45 − 3 = 42.' } },
          { q: 'Show 74 − 38 with jumps back.', draw: { h: 60, key: ['nl', { min: 30, max: 80, tick: 5, lab: 10, jumps: [[74, 44, '−30'], [44, 36, '−8']] }] } },
          { q: 'How can you check 82 − 45 = 37?', lines: { n: 2, key: 'Add back: 37 + 45 = 82, so it is right.' } },
          { q: 'Write a story for 60 − 24.', lines: { n: 3, key: 'For example: {a} had 60 {many} and used 24. 36 were left.' } }]
      }
    },

    countup: {
      watch: 'taking away 48 one by one from 52. When the numbers are close, count up from the smaller one.',
      goal: 'I can count up when numbers are close.',
      learn: {
        show: { cap: '48 up to 50 is 2, 50 up to 53 is 3', eq: ['2 + 3 = 5', '53 − 48 = 5'] },
        together: [UP(62, 57), UP(41, 38)],
        cue: 'Close numbers: count up from the smaller one, to the ten, then on.',
        own: [UP(73, 68), UP(34, 29), F([[85, '−', 79], [51, '−', 46]]), F([[92, '−', 87], [60, '−', 54]])]
      },
      p1: {
        show: { cap: 'From 39 up to 42', eq: ['42 − 39 = 3'] },
        items: [UP(23, 19), UP(45, 38), UP(64, 59), UP(92, 88), F([[31, '−', 27], [70, '−', 66]]), F([[43, '−', 39], [82, '−', 75]])]
      },
      p2: {
        items: [FA([[52, '−', 49], [61, '−', 57], [83, '−', 78], [40, '−', 36], [74, '−', 69], [100, '−', 96]]),
          { eq: ['47 + [] = 53'], a: [6] }, { eq: ['88 + [] = 95'], a: [7] },
          story('{a} has 46 {many}. {a} needs 52. How many more?', '{many}', 6, '52 − 46'), story('{b} is on page 87 of a 93 page book. How many pages are left?', 'pages', 6, '93 − 87')]
      },
      p3: {
        items: [FA([[71, '−', 64], [55, '−', 47], [90, '−', 82], [33, '−', 26], [62, '−', 58], [81, '−', 75]]),
          { q: 'Circle the one where counting up is fastest.', pick: { opts: ['80 − 12', '61 − 58', '75 − 30'], ans: 1, small: true }, wide: true },
          story('{a} is 98 cm tall. {b} is 91 cm. How much taller is {a}?', 'cm', 7, '98 − 91'), CK(53, '−', 47, 6), CK(84, '−', 77, 8)]
      },
      think: {
        items: [{ q: 'When is counting up better than jumping back?', lines: { n: 2, key: 'When the two numbers are close, like 52 − 48.' } },
          { q: 'Show 63 − 57 on a number line.', draw: { h: 60, key: ['nl', { min: 50, max: 70, tick: 1, lab: 5, jumps: [[57, 60, '+3'], [60, 63, '+3']] }] } },
          { q: '{b} says 42 − 38 = 14. Count up to check. Is {b} right?', lines: { n: 2, key: 'No. 38 to 40 is 2, 40 to 42 is 2: the answer is 4.' } },
          { q: 'Write a subtraction where you would count up.', lines: { n: 1, key: 'For example: 71 − 68.' } }]
      }
    },

    story: {
      watch: 'adding every two numbers in a story. Ask: do I know both parts (add), or the whole and one part (subtract)?',
      goal: 'I can solve story problems to 100.',
      learn: {
        show: { cap: '64 in all, 25 are red: the whole and a part', eq: ['subtract', '64 − 25 = 39'] },
        together: [PM('{a} has 35 {many}. {b} gives {a} 28 more. How many now?', '{many}', 35, '+', 28), PM('There are 70 {many}. 26 are sold. How many are left?', '{many}', 70, '−', 26)],
        cue: 'Both parts: add. The whole and one part: subtract.',
        own: [PM('{b} has 46 {many} and finds 37 more. How many now?', '{many}', 46, '+', 37), PM('{a} had 81 {many} and gave away 45. How many are left?', '{many}', 81, '−', 45)]
      },
      p1: {
        show: { cap: 'Both parts are known', eq: ['38 + 24 = 62'] },
        items: [PM('{a} has 27 {many}. {a} gets 15 more. How many now?', '{many}', 27, '+', 15), PM('There are 54 {many}. 22 are taken. How many are left?', '{many}', 54, '−', 22),
          PM('{b} has 36 {many} in one {cont} and 36 in another. How many in all?', '{many}', 36, '+', 36), PM('{a} had 90 {many}. 35 got lost. How many are left?', '{many}', 90, '−', 35)]
      },
      p2: {
        items: [PM('{a} has 63 {many}. 28 are big. How many are small?', '{many}', 63, '−', 28), PM('{b} had some {many}. {b} found 19 more and now has 57. How many did {b} have?', '{many}', 57, '−', 19),
          PM('There are 45 {many} on a shelf and 38 in a {cont}. How many in all?', '{many}', 45, '+', 38), PM('{a} needs 100 {many} and has 65. How many more?', '{many}', 100, '−', 65)]
      },
      p3: {
        items: [PM('{a} gave away 26 {many} and has 48 left. How many did {a} have?', '{many}', 48, '+', 26), PM('{b} has 39 {many}. {a} has 24 more than {b}. How many does {a} have?', '{many}', 39, '+', 24),
          PM('A {cont} holds 80 {many}. 53 are in it. How many more fit?', '{many}', 80, '−', 53), PM('{a} has 72 {many}. {b} has 47. How many fewer does {b} have?', '{many}', 72, '−', 47),
          { q: 'Write a story for 56 + 27. Solve it.', lines: { n: 2, key: 'For example: {a} had 56 {many} and got 27 more: 83.' }, wide: true }]
      },
      think: {
        items: [{ q: '"{a} has 64 {many}. 25 are red." {b} added and got 89. What went wrong?', lines: { n: 2, key: '64 is the whole, so subtract: 64 − 25 = 39 are not red.' } },
          { q: 'Draw a bar for: 90 in all, 34 in one part. Find the other part.', draw: { h: 60, key: 'A bar of 90 split into 34 and 56.' } },
          { q: 'Make up a story where the answer is 45.', lines: { n: 3, key: 'For example: {a} had 70 {many} and gave away 25. 45 were left.' } },
          { q: 'How can an estimate help you check a story answer?', lines: { n: 2, key: 'Round and add or subtract. If the answer is far off, check again.' } }]
      }
    }
  } });
})();
