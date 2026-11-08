/* Grade 3 Adding and Subtracting: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea
   of the lessons in chapters/add-subtract.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.3 mental math to add and subtract to 1000; B2.4 add and subtract numbers to 1000 with tools and written
   methods; B2.5 problems with addition and subtraction; C2.3 equations with equal sides.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function sum(a, op, b) { return op === '+' ? a + b : a - b; }
  /* plain facts: list of [a, op, b] */
  function F(list) { return { eq: list.map(function (f) { return f[0] + ' ' + f[1] + ' ' + f[2] + ' = []'; }), a: list.map(function (f) { return sum(f[0], f[1], f[2]); }) }; }
  /* a page-wide block of facts in 3 columns */
  function FA(list) { var f = F(list); f.cols = 3; f.wide = true; return f; }
  /* make a ten: a + b = 10 + [] = [] with ten frames */
  function MK(a, b) { return { pic: ['tenframe', { a: a, b: b }], eq: [a + ' + ' + b + ' = 10 + [] = []'], a: [a + b - 10, a + b] }; }
  /* near doubles: a + b = a + a + [] = [] */
  function DB(a, b) { return { eq: [a + ' + ' + b + ' = ' + a + ' + ' + a + ' + [] = []'], a: [b - a, a + b], wide: true }; }
  /* think addition: a − b = [] because b + [] = a */
  function TH(a, b) { return { eq: [b + ' + [] = ' + a, a + ' − ' + b + ' = []'], a: [a - b, a - b] }; }
  /* the four facts of a, b and their sum */
  function FOUR(a, b) { var c = a + b; return { q: 'Use ' + a + ', ' + b + ' and ' + c + '.', eq: [a + ' + ' + b + ' = []', b + ' + ' + a + ' = []', c + ' − ' + a + ' = []', c + ' − ' + b + ' = []'], a: [c, c, b, a] }; }
  /* jumps on a number line: a op b, the jumps given as [from, to, label] */
  function JP(a, op, b, jumps, min, max) { return { pic: ['nl', { min: min, max: max, tick: (max - min) / 10, lab: (max - min) / 2, jumps: jumps }], eq: [a + ' ' + op + ' ' + b + ' = []'], a: [sum(a, op, b)] }; }
  /* friendly number: a op b using f, then fix */
  function FR(a, op, b, f) { var back = op === '+' ? '−' : '+', k = f - b; return { eq: [a + ' ' + op + ' ' + b + ' = ' + a + ' ' + op + ' ' + f + ' ' + back + ' [] = []'], a: [k, sum(a, op, b)], wide: true }; }
  /* blocks for a number */
  function blk(n) { return ['blocks', { h: Math.floor(n / 100), t: Math.floor(n / 10) % 10, o: n % 10, small: n >= 200 }]; }
  /* a column sum */
  function digits(n) { return String(n).split('').map(Number); }
  function CO(a, op, b) { return { pic: ['col', { a: a, b: b, op: op }], a: digits(sum(a, op, b)) }; }
  /* two column sums side by side */
  function CO2(x, y) { return { pic: ['row', { list: [['col', { a: x[0], b: x[2], op: x[1] }], ['col', { a: y[0], b: y[2], op: y[1] }]] }], a: digits(sum(x[0], x[1], x[2])).concat(digits(sum(y[0], y[1], y[2]))), wide: true }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* a story where the child first circles + or − */
  function PM(q, unit, a, op, b) { return { q: q, pick: { opts: ['+', '−'], ans: op === '+' ? 0 : 1 }, eq: ['[] ' + unit], a: [sum(a, op, b)], calc: a + ' ' + op + ' ' + b }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  /* estimate by rounding first */
  function ES(to, list) { return { eq: list.map(function (f) { return f[0] + ' ' + f[1] + ' ' + f[2] + ' is about []'; }), a: list.map(function (f) { var r = function (n) { return Math.round(n / to) * to; }; return sum(r(f[0]), f[1], r(f[2])); }), est: to }; }
  /* check with the opposite: is a op b = c right? */
  function CK(a, op, b, c) {
    var back = op === '+' ? '−' : '+', x = op === '+' ? c : c, y = b;
    return { q: a + ' ' + op + ' ' + b + ' = ' + c + '. Check it.', eq: [x + ' ' + back + ' ' + y + ' = []'], a: [sum(x, back, y)], pick: { opts: ['right', 'wrong'], ans: sum(a, op, b) === c ? 0 : 1 }, pickLast: true, tf: a + ' ' + op + ' ' + b + ' = ' + c };
  }

  S.register('add-subtract', { code: 'AS', ideas: {

    make10: {
      watch: 'counting on by ones from 9. Ask: "How many more make 10?" Then add what is left.',
      goal: 'I can make a ten to add.',
      learn: {
        show: { pic: ['tenframe', { a: 9, b: 5 }], cap: 'Move 1 to make 10', eq: ['9 + 5 = 10 + 4', '9 + 5 = 14'] },
        together: [MK(9, 3), MK(8, 5)],
        cue: 'Fill the ten first. Then add what is left.',
        own: [MK(9, 6), MK(8, 4), MK(7, 5), MK(8, 7)]
      },
      p1: {
        show: { pic: ['tenframe', { a: 8, b: 3 }], cap: '8 needs 2 more', eq: ['8 + 3 = 10 + 1 = 11'] },
        items: [MK(9, 2), MK(9, 7), MK(8, 6), MK(7, 4), MK(6, 5), MK(8, 8)]
      },
      p2: {
        items: [{ eq: ['9 + 8 = 10 + [] = []'], a: [7, 17] }, { eq: ['7 + 6 = 10 + [] = []'], a: [3, 13] }, { eq: ['8 + 9 = 10 + [] = []'], a: [7, 17] }, { eq: ['6 + 7 = 10 + [] = []'], a: [3, 13] },
          FA([[9, '+', 4], [8, '+', 5], [7, '+', 7], [9, '+', 9], [6, '+', 8], [7, '+', 8]])]
      },
      p3: {
        items: [FA([[9, '+', 5], [8, '+', 7], [6, '+', 9], [7, '+', 9], [5, '+', 8], [8, '+', 4], [9, '+', 6], [7, '+', 5], [6, '+', 6]]),
          { eq: ['29 + 5 = 30 + [] = []'], a: [4, 34] }, { eq: ['48 + 6 = 50 + [] = []'], a: [4, 54] },
          story('{a} has 9 {many} and finds 7 more. How many now?', '{many}', 16, '9 + 7'), story('{b} has 8 {many} and gets 6 more. How many now?', '{many}', 14, '8 + 6')]
      },
      think: {
        items: [{ q: 'Show how to make a ten for 7 + 8. Draw ten frames.', draw: { h: 70, key: ['tenframe', { a: 10, b: 5 }] } },
          { q: '{a} says 9 + 6 is 10 + 6. What went wrong?', lines: { n: 2, key: 'Moving 1 to the 9 leaves 5, so it is 10 + 5 = 15.' } },
          { q: 'Why is it easy to add to 10?', lines: { n: 2, key: 'Ten and a number is just the teen: 10 + 4 = 14.' } },
          { q: 'Use making a ten for 38 + 7.', lines: { n: 2, key: '38 + 2 = 40, then 5 more: 45.' } }]
      }
    },

    doubles: {
      watch: 'adding the extra 1 twice (7 + 8 = 7 + 7 + 2). Find the double, then add only the difference.',
      goal: 'I can use doubles to add.',
      learn: {
        show: { cap: '7 + 8 is one more than 7 + 7', eq: ['7 + 7 = 14', '7 + 8 = 15'] },
        together: [DB(6, 7), DB(5, 6)],
        cue: 'Find the double you know. Then add the one or two extra.',
        own: [DB(8, 9), DB(4, 5), DB(7, 9), F([[6, '+', 6], [9, '+', 9]])]
      },
      p1: {
        show: { cap: 'Double, then one more', eq: ['6 + 7 = 6 + 6 + 1 = 13'] },
        items: [F([[5, '+', 5], [8, '+', 8]]), F([[4, '+', 4], [7, '+', 7]]), DB(5, 6), DB(8, 9), DB(4, 5), DB(6, 7)]
      },
      p2: {
        items: [DB(7, 8), DB(6, 8), FA([[6, '+', 7], [8, '+', 9], [5, '+', 6], [7, '+', 8], [4, '+', 5], [9, '+', 8]]),
          story('{a} has 8 {many}. {b} has 1 more than {a}. How many in all?', '{many}', 17, '8 + 8 + 1'), TF('7 + 8 = 7 + 7 + 1', true)]
      },
      p3: {
        items: [{ eq: ['25 + 25 = []', '25 + 26 = []'], a: [50, 51] }, { eq: ['40 + 40 = []', '40 + 41 = []'], a: [80, 81] }, { eq: ['150 + 150 = []'], a: [300] }, { eq: ['150 + 160 = []'], a: [310] },
          FA([[9, '+', 7], [6, '+', 8], [8, '+', 7], [7, '+', 9], [5, '+', 7], [9, '+', 9]])]
      },
      think: {
        items: [{ q: '{b} says 6 + 7 = 6 + 6 + 2. What went wrong?', lines: { n: 2, key: '7 is only 1 more than 6. It is 6 + 6 + 1 = 13.' } },
          { q: 'Use a double to work out 35 + 36.', lines: { n: 2, key: '35 + 35 = 70, then 1 more: 71.' } },
          { q: 'Which double helps with 8 + 9? Is there more than one?', lines: { n: 2, key: '8 + 8 then add 1, or 9 + 9 then take 1 away. Both give 17.' } },
          { q: 'Draw 7 + 8 as a double and one more.', draw: { h: 70, key: 'Two rows of 7, and 1 more: 15.' } }]
      }
    },

    think: {
      watch: 'counting back by ones for 15 − 8. Ask: "8 and what make 15?"',
      goal: 'I can think addition to subtract.',
      learn: {
        show: { cap: '14 − 6: what goes with 6 to make 14?', eq: ['6 + 8 = 14', '14 − 6 = 8'] },
        together: [TH(13, 5), TH(16, 9)],
        cue: 'To subtract, ask: what do I add to the small number to get the big one?',
        own: [TH(12, 7), TH(15, 8), TH(17, 9), TH(11, 4)]
      },
      p1: {
        show: { cap: 'Think 7 + ? = 12', eq: ['12 − 7 = 5'] },
        items: [TH(11, 9), TH(13, 6), TH(14, 8), TH(12, 5), TH(15, 7), TH(16, 8)]
      },
      p2: {
        items: [FA([[13, '−', 9], [12, '−', 8], [14, '−', 5], [17, '−', 8], [11, '−', 6], [15, '−', 9]]),
          story('{a} has 14 {many}. {a} gives away 6. How many are left?', '{many}', 8, '14 − 6'), story('{b} needs 13 {many} and has 7. How many more?', '{many}', 6, '13 − 7'),
          { eq: ['18 − [] = 9'], a: [9] }, TF('15 − 7 = 8', true)]
      },
      p3: {
        items: [FA([[16, '−', 7], [13, '−', 4], [18, '−', 9], [12, '−', 3], [14, '−', 9], [11, '−', 8], [17, '−', 9], [15, '−', 6], [13, '−', 8]]),
          { eq: ['130 − 60 = []'], a: [70] }, { eq: ['140 − 80 = []'], a: [60] },
          story('{a} has 120 {many} and uses 50. How many are left?', '{many}', 70, '120 − 50'), { eq: ['[] − 7 = 6'], a: [13] }]
      },
      think: {
        items: [{ q: 'How does 9 + 6 = 15 help you with 15 − 9?', lines: { n: 2, key: '9 and 6 make 15, so taking 9 from 15 leaves 6.' } },
          { q: '{b} counted back 1 at a time for 17 − 9 and got 9. What went wrong?', lines: { n: 2, key: '9 + 8 = 17, so 17 − 9 = 8. {b} counted 17 as a step.' } },
          { q: 'Write a subtraction you can solve with 8 + 5 = 13.', lines: { n: 1, key: '13 − 8 = 5 or 13 − 5 = 8.' } },
          { q: 'Write a story for 16 − 9.', lines: { n: 3, key: 'For example: {a} had 16 {many} and gave 9 away. 7 were left.' } }]
      }
    },

    mixed: {
      watch: 'subtracting the wrong way (5 − 13). The biggest number in the family comes first when you subtract.',
      goal: 'I can use one fact to find four.',
      learn: {
        show: { cap: '8, 5 and 13 are a family', eq: ['8 + 5 = 13, 5 + 8 = 13', '13 − 5 = 8, 13 − 8 = 5'] },
        together: [FOUR(7, 6), FOUR(9, 4)],
        cue: 'The two parts add to the whole. Take one part from the whole to get the other.',
        own: [FOUR(8, 7), FOUR(6, 9)]
      },
      p1: {
        show: { cap: 'One family, four facts', eq: ['6 + 7 = 13, 13 − 7 = 6'] },
        items: [FOUR(5, 7), FOUR(9, 3), FOUR(8, 6), FOUR(4, 7)]
      },
      p2: {
        items: [FOUR(30, 50), FOUR(400, 500),
          { q: 'Circle the fact that is wrong.', pick: { opts: ['16 − 9 = 7', '9 + 7 = 16', '16 − 7 = 8'], ans: 2 }, odd: true, wide: true }, TF('14 − 6 = 9', false)]
      },
      p3: {
        items: [FOUR(250, 150), FOUR(340, 200), FOUR(120, 80),
          story('{a} and {b} have 900 {many} together. {a} has 500. How many has {b}?', '{many}', 400, '900 − 500'), { eq: ['[] + 350 = 800'], a: [450] }]
      },
      think: {
        items: [{ q: 'Write the four facts for 7, 8 and 15.', lines: { n: 3, key: '7 + 8 = 15, 8 + 7 = 15, 15 − 7 = 8, 15 − 8 = 7.' } },
          { q: 'Why does a double, like 6 + 6 = 12, have only two facts?', lines: { n: 2, key: 'The two parts are the same: 6 + 6 = 12 and 12 − 6 = 6.' } },
          { q: '{a} wrote 5 − 12 = 7. What went wrong?', lines: { n: 2, key: 'Start with the whole: 12 − 5 = 7.' } },
          { q: 'Make your own family with numbers over 100. Write all four facts.', lines: { n: 3, key: 'For example: 300 + 200 = 500, 200 + 300 = 500, 500 − 300 = 200, 500 − 200 = 300.' } }]
      }
    },

    tens: {
      watch: 'writing 40 + 30 = 7. Say the unit: "4 tens and 3 tens make 7 tens", then write 70.',
      goal: 'I can add and subtract tens and hundreds like ones.',
      learn: {
        show: { cap: '3 + 4 = 7, so 3 tens + 4 tens = 7 tens', eq: ['30 + 40 = 70', '300 + 400 = 700'] },
        together: [{ eq: ['5 + 2 = []', '50 + 20 = []', '500 + 200 = []'], a: [7, 70, 700] }, { eq: ['8 − 3 = []', '80 − 30 = []', '800 − 300 = []'], a: [5, 50, 500] }],
        cue: 'Use the ones fact. Then say tens or hundreds.',
        own: [F([[60, '+', 30], [600, '+', 300]]), F([[90, '−', 40], [900, '−', 400]]), F([[70, '+', 50], [700, '+', 500]]), F([[130, '−', 60], [1000, '−', 700]])]
      },
      p1: {
        show: { cap: '6 − 2 = 4', eq: ['600 − 200 = 400'] },
        items: [F([[20, '+', 30], [200, '+', 300]]), F([[70, '−', 20], [700, '−', 200]]), F([[40, '+', 40], [400, '+', 400]]), F([[90, '−', 60], [900, '−', 600]]),
          { eq: ['4 tens + 5 tens = [] tens'], a: [9] }, { eq: ['8 hundreds − 3 hundreds = [] hundreds'], a: [5], wide: true }]
      },
      p2: {
        items: [FA([[80, '+', 50], [140, '−', 70], [600, '+', 400], [900, '−', 300], [90, '+', 90], [500, '−', 200]]),
          { eq: ['[] + 60 = 110'], a: [50] }, { eq: ['[] − 300 = 500'], a: [800] },
          story('{a} has 300 {many} and gets 500 more. How many now?', '{many}', 800, '300 + 500'), TF('70 + 60 = 13', false)]
      },
      p3: {
        items: [FA([[340, '+', 50], [460, '+', 300], [780, '−', 40], [950, '−', 600], [230, '+', 70], [610, '−', 200]]),
          { eq: ['[] + 70 = 150'], a: [80] }, { eq: ['900 − [] = 350'], a: [550] },
          story('{b} has 720 {many} and gives away 400. How many are left?', '{many}', 320, '720 − 400'), story('{a} has 580 {many} and gets 30 more. How many now?', '{many}', 610, '580 + 30')]
      },
      think: {
        items: [{ q: '{a} says 50 + 40 = 9. What went wrong?', lines: { n: 2, key: '5 tens and 4 tens make 9 tens, which is 90.' } },
          { q: 'How does 6 + 7 help with 600 + 700?', lines: { n: 2, key: '6 + 7 = 13, so 6 hundreds + 7 hundreds = 13 hundreds = 1300.' } },
          { q: 'Write two sums that use 3 + 5 = 8, one with tens and one with hundreds.', lines: { n: 2, key: '30 + 50 = 80 and 300 + 500 = 800.' } },
          { q: 'Which is easier: 400 + 300 or 398 + 302? Why?', lines: { n: 2, key: 'Both make 700. 400 + 300 is easier because it is just 4 + 3 hundreds.' } }]
      }
    },

    jump: {
      watch: 'adding the hundreds and forgetting the tens. Make one jump for each place, and say where you land.',
      goal: 'I can jump hundreds, then tens, then ones.',
      learn: {
        show: { pic: ['nl', { min: 300, max: 600, tick: 30, lab: 150, jumps: [[345, 545, '+200'], [545, 575, '+30']] }], cap: '345 + 230', eq: ['345 + 200 = 545', '545 + 30 = 575'] },
        together: [{ eq: ['426 + 300 = []', '[] + 50 = []'], a: [726, 726, 776] }, { eq: ['683 − 200 = []', '[] − 40 = []'], a: [483, 483, 443] }],
        cue: 'Jump the hundreds, then the tens, then the ones. Say each landing number.',
        own: [JP(254, '+', 120, [[254, 354, '+100'], [354, 374, '+20']], 200, 400), JP(567, '−', 230, [[567, 367, '−200'], [367, 337, '−30']], 300, 600),
          F([[312, '+', 450], [879, '−', 340]]), F([[205, '+', 63], [768, '−', 45]])]
      },
      p1: {
        show: { cap: '452 + 300 = 752, then + 20', eq: ['452 + 320 = 772'] },
        items: [F([[231, '+', 200], [231, '+', 240]]), F([[516, '+', 300], [516, '+', 330]]), F([[875, '−', 400], [875, '−', 450]]), F([[694, '−', 200], [694, '−', 230]]),
          F([[143, '+', 25], [358, '−', 24]]), F([[607, '+', 82], [999, '−', 77]])]
      },
      p2: {
        items: [FA([[325, '+', 241], [486, '−', 153], [612, '+', 305], [759, '−', 427], [140, '+', 637], [968, '−', 545]]),
          story('{a} has 416 {many} and gets 230 more. How many now?', '{many}', 646, '416 + 230'), story('{b} has 785 {many} and gives away 360. How many left?', '{many}', 425, '785 − 360'),
          JP(158, '+', 310, [[158, 458, '+300'], [458, 468, '+10']], 100, 600), JP(674, '−', 420, [[674, 274, '−400'], [274, 254, '−20']], 200, 700)]
      },
      p3: {
        items: [FA([[263, '+', 425], [847, '−', 316], [531, '+', 248], [976, '−', 654], [402, '+', 397], [889, '−', 768]]),
          { eq: ['345 + [] = 575'], a: [230] }, { eq: ['[] − 210 = 430'], a: [640] },
          story('{a} walks 352 m, then 425 m more. How far is that?', 'm', 777, '352 + 425'), story('{b} has 948 {many} and sells 623. How many are left?', '{many}', 325, '948 − 623')]
      },
      think: {
        items: [{ q: 'Show 436 + 252 on a number line with jumps.', draw: { h: 70, key: ['nl', { min: 400, max: 700, tick: 30, lab: 150, jumps: [[436, 636, '+200'], [636, 686, '+50'], [686, 688]] }] } },
          { q: '{a} worked out 527 + 340 = 567. What went wrong?', lines: { n: 2, key: '{a} added 40 but forgot the 300. It is 867.' } },
          { q: 'Could you jump the tens first? Try 254 + 132.', lines: { n: 2, key: 'Yes: 254 + 30 = 284, + 100 = 384, + 2 = 386.' } },
          { q: 'Write a story for 600 − 250.', lines: { n: 3, key: 'For example: {a} had 600 {many} and gave 250 away. 350 were left.' } }]
      }
    },

    friendly: {
      watch: 'fixing the wrong way: after adding 30 for 29, take 1 away, do not add 1.',
      goal: 'I can use a friendly number, then fix it.',
      learn: {
        show: { pic: ['nl', { min: 140, max: 190, tick: 5, lab: 25, jumps: [[146, 176, '+30'], [176, 175, '−1']] }], cap: '146 + 29: add 30, take 1 back', eq: ['146 + 30 − 1', '146 + 29 = 175'] },
        together: [FR(234, '+', 49, 50), FR(352, '−', 98, 100)],
        cue: 'Use the close friendly number. Then fix by the amount you went over.',
        own: [FR(127, '+', 39, 40), FR(415, '+', 199, 200), FR(563, '−', 29, 30)]
      },
      p1: {
        show: { cap: '58 + 19 = 58 + 20 − 1', eq: ['58 + 19 = 77'] },
        items: [FR(45, '+', 19, 20), FR(63, '+', 29, 30), FR(84, '−', 9, 10), FR(92, '−', 19, 20), FR(136, '+', 99, 100), FR(450, '−', 99, 100)]
      },
      p2: {
        items: [FR(275, '+', 198, 200), FR(612, '−', 398, 400), FA([[346, '+', 99], [520, '−', 199], [167, '+', 49], [705, '−', 98], [388, '+', 299], [640, '−', 39]]),
          story('{a} has 248 {many} and gets 199 more. How many now?', '{many}', 447, '248 + 199'), story('{b} has 500 {many} and uses 298. How many are left?', '{many}', 202, '500 − 298')]
      },
      p3: {
        items: [FA([[456, '+', 198], [731, '−', 297], [385, '+', 399], [904, '−', 499], [227, '+', 69], [600, '−', 58]]),
          { q: 'Circle the quick way to work out 375 + 98.', pick: { opts: ['375 + 100 − 2', '375 + 100 + 2', '375 + 90 + 2'], ans: 0, val: 473 }, wide: true },
          story('{a} needs 700 {many}. {a} has 302. How many more?', '{many}', 398, '700 − 302'), story('{b} has 129 {many} and gets 599 more. How many now?', '{many}', 728, '129 + 599')]
      },
      think: {
        items: [{ q: '{b} did 245 + 99 as 245 + 100 + 1. What went wrong?', lines: { n: 2, key: '100 is 1 too many, so take 1 away: 344.' } },
          { q: 'Which friendly number helps with 562 − 197? Show it.', lines: { n: 2, key: '200: 562 − 200 = 362, then add 3 back: 365.' } },
          { q: 'Is 99 + 99 easy? Show a quick way.', lines: { n: 2, key: '100 + 100 = 200, take 2 away: 198.' } },
          { q: 'When would you not use a friendly number?', lines: { n: 2, key: 'When the number is already easy, like 300 + 250.' } }]
      }
    },

    countup: {
      watch: 'adding the jumps wrong or stopping at the wrong number. Write each jump above the line, then add them.',
      goal: 'I can count up to subtract.',
      learn: {
        show: { pic: ['nl', { min: 30, max: 70, tick: 5, lab: 10, jumps: [[38, 40, '2'], [40, 60, '20'], [60, 62, '2']] }], cap: '62 − 38: count up from 38', eq: ['2 + 20 + 2 = 24', '62 − 38 = 24'] },
        together: [{ eq: ['47 + [] = 50', '50 + [] = 83', '83 − 47 = []'], a: [3, 33, 36] }, { eq: ['196 + [] = 200', '200 + [] = 425', '425 − 196 = []'], a: [4, 225, 229] }],
        cue: 'Start at the small number. Jump to a friendly number, then to the big one. Add the jumps.',
        own: [{ eq: ['58 + [] = 60', '60 + [] = 91', '91 − 58 = []'], a: [2, 31, 33] }, { eq: ['275 + [] = 300', '300 + [] = 512', '512 − 275 = []'], a: [25, 212, 237] }]
      },
      p1: {
        show: { cap: '100 − 87: 3 to 90, 10 to 100', eq: ['100 − 87 = 13'] },
        items: [F([[50, '−', 46], [80, '−', 73]]), F([[100, '−', 94], [100, '−', 85]]), F([[63, '−', 58], [72, '−', 67]]), F([[300, '−', 296], [500, '−', 490]]),
          { eq: ['39 + [] = 40', '40 + [] = 65', '65 − 39 = []'], a: [1, 25, 26] }, { eq: ['88 + [] = 90', '90 + [] = 120', '120 − 88 = []'], a: [2, 30, 32] }]
      },
      p2: {
        items: [FA([[71, '−', 68], [403, '−', 397], [400, '−', 380], [92, '−', 59], [210, '−', 185], [600, '−', 576]]),
          story('{a} has 48 {many} and needs 75. How many more?', '{many}', 27, '75 − 48'), story('{b} reads to page 186 of 300. How many pages are left?', 'pages', 114, '300 − 186'),
          { eq: ['297 + [] = 300', '300 + [] = 451', '451 − 297 = []'], a: [3, 151, 154] }, TF('81 − 79 = 2', true)]
      },
      p3: {
        items: [FA([[700, '−', 694], [512, '−', 489], [500, '−', 425], [804, '−', 778], [350, '−', 291], [900, '−', 405]]),
          story('A trip is 650 km. {a} has gone 375 km. How far is left?', 'km', 275, '650 − 375'), story('{b} has $1000 saved for a $799 bike. How much is left over?', 'dollars', 201, '1000 − 799'),
          { eq: ['[] + 28 = 105'], a: [77] }, { q: 'Circle the one that is quickest to count up.', pick: { opts: ['602 − 598', '602 − 98', '602 − 345'], ans: 0, small: true }, wide: true }]
      },
      think: {
        items: [{ q: 'Show 304 − 279 by counting up on a line.', draw: { h: 70, key: ['nl', { min: 270, max: 310, tick: 5, lab: 10, jumps: [[279, 280, '1'], [280, 300, '20'], [300, 304, '4']] }] } },
          { q: 'Why is counting up good for 401 − 398?', lines: { n: 2, key: 'The numbers are close: count 398, 399, 400, 401: 3.' } },
          { q: '{a} counted up from 47 to 82: 3 + 30 + 2 and got 35. Is that right?', lines: { n: 2, key: 'Yes. 47 + 3 = 50, + 30 = 80, + 2 = 82. 3 + 30 + 2 = 35.' } },
          { q: 'Write a story where counting up is a good way.', lines: { n: 3, key: 'For example: {b} has 197 {many} and wants 200. How many more?' } }]
      }
    },

    addblk: {
      watch: 'leaving 13 ones as 13. Ten ones are traded for a ten every time there are 10 or more.',
      goal: 'I can trade 10 ones for a ten when I add.',
      learn: {
        show: { pic: blk(127), cap: '127 + 45: 7 + 5 = 12 ones, trade 10', eq: ['12 ones = 1 ten 2 ones', '127 + 45 = 172'] },
        together: [{ eq: ['36 + 28 = [] tens [] ones = []'], a: [6, 4, 64], wide: true }, { eq: ['148 + 35 = 1 hundred [] tens [] ones = []'], a: [8, 3, 183], wide: true }],
        cue: 'Add the ones. 10 or more ones? Trade 10 of them for a ten.',
        own: [{ eq: ['47 + 25 = [] tens [] ones = []'], a: [7, 2, 72], wide: true }, { eq: ['256 + 37 = 2 hundreds [] tens [] ones = []'], a: [9, 3, 293], wide: true }]
      },
      p1: {
        show: { cap: '8 ones + 6 ones = 14 ones = 1 ten 4 ones', eq: ['38 + 16 = 54'] },
        items: [{ eq: ['15 ones = [] ten [] ones'], a: [1, 5] }, { eq: ['12 ones = [] ten [] ones'], a: [1, 2] }, F([[29, '+', 14], [46, '+', 37]]), F([[58, '+', 25], [67, '+', 18]]), F([[135, '+', 26], [249, '+', 38]]), F([[316, '+', 57], [428, '+', 45]])]
      },
      p2: {
        items: [{ eq: ['14 tens = [] hundred [] tens'], a: [1, 4], wide: true }, { eq: ['160 + 70 = []'], a: [230] }, F([[175, '+', 160], [283, '+', 54]]), F([[364, '+', 172], [519, '+', 290]]),
          story('{a} has 238 {many} and gets 145 more. How many now?', '{many}', 383, '238 + 145'), { q: 'Draw blocks for 146 + 27. Trade, then write the total.', draw: { h: 70, key: ['blocks', { h: 1, t: 7, o: 3 }] }, eq: ['146 + 27 = []'], a: [173] }]
      },
      p3: {
        items: [FA([[287, '+', 146], [365, '+', 278], [459, '+', 383], [194, '+', 207], [528, '+', 396], [677, '+', 245]]),
          story('{b} collects 389 {many} and then 247 more. How many in all?', '{many}', 636, '389 + 247'), story('A shelf has 475 {many} and another has 368. How many?', '{many}', 843, '475 + 368'),
          { eq: ['199 + 1 = []', '199 + 101 = []'], a: [200, 300] }, TF('256 + 168 = 3 hundreds 12 tens 4 ones', true)]
      },
      think: {
        items: [{ q: '{a} wrote 47 + 35 = 712. What went wrong?', lines: { n: 2, key: '7 + 5 = 12 ones. {a} wrote 12 instead of trading 10 ones for a ten: 82.' } },
          { q: 'When do you need to trade when adding? Give an example.', lines: { n: 2, key: 'When a place adds to 10 or more, like 8 + 5 ones in 38 + 25.' } },
          { q: 'Write a sum where you trade twice.', lines: { n: 1, key: 'For example: 175 + 248 (ones 13, tens 12).' } },
          { q: 'Draw 156 + 68 with blocks and show the trades.', draw: { h: 90, key: ['blocks', { h: 2, t: 2, o: 4 }] } }]
      }
    },

    addcol: {
      watch: 'starting with the hundreds, or forgetting the carried ten. Ones first, and write the 1 above the next place.',
      goal: 'I can add in columns, ones first.',
      learn: {
        show: { pic: ['col', { a: 258, b: 136, op: '+' }], cap: 'Ones: 8 + 6 = 14. Write 4, carry 1.', eq: ['258 + 136 = 394'] },
        together: [CO(243, '+', 125), CO(367, '+', 218)],
        cue: 'Line up the places. Add the ones first. 10 or more? Carry a ten to the next place.',
        own: [CO(431, '+', 254), CO(248, '+', 137), CO(375, '+', 162), CO(456, '+', 278)]
      },
      p1: {
        show: { pic: ['col', { a: 324, b: 152, op: '+' }], cap: 'No carrying', eq: ['324 + 152 = 476'] },
        items: [CO(213, '+', 145), CO(532, '+', 236), CO(405, '+', 382), CO(126, '+', 158), CO(347, '+', 225), CO(619, '+', 173)]
      },
      p2: {
        items: [CO2([258, '+', 167], [384, '+', 239]), CO2([476, '+', 185], [593, '+', 248]), CO2([149, '+', 381], [267, '+', 456]),
          story('{a} has 275 {many} and {b} has 348. How many altogether?', '{many}', 623, '275 + 348'), TF('369 + 254 = 623', true)]
      },
      p3: {
        items: [CO2([487, '+', 356], [298, '+', 405]), CO2([576, '+', 247], [639, '+', 286]), CO2([123, '+', 789], [456, '+', 444]),
          story('{a} reads 386 pages, then 249 more. How many pages?', 'pages', 635, '386 + 249'), { q: 'What number and 247 make 612?', eq: ['[] + 247 = 612'], a: [365] }]
      },
      think: {
        items: [{ q: '{b} added 465 + 278 and got 633. Find the mistake.', lines: { n: 2, key: '{b} forgot to carry the ten from the tens. It is 743.' } },
          { q: 'Why do we add the ones first?', lines: { n: 2, key: 'If the ones make 10 or more, the extra ten goes into the tens column.' } },
          { q: 'Use the digits 1 to 6 once each to make a sum with a total over 900.', lines: { n: 2, key: 'For example: 631 + 542 is too big; 521 + 436 = 957.' } },
          { q: 'Estimate 398 + 405 first. Then add. Were you close?', lines: { n: 2, key: 'About 400 + 400 = 800. Exactly 803.' } }]
      }
    },

    subblk: {
      watch: 'taking the small digit from the big one (52 − 37 = 25). If there are not enough ones, break a ten first.',
      goal: 'I can break a ten when the ones run out.',
      learn: {
        show: { pic: blk(52), cap: '52 − 17: 2 ones is not enough', eq: ['52 = 4 tens 12 ones', '52 − 17 = 35'] },
        together: [{ eq: ['43 = 3 tens [] ones'], a: [13] }, { eq: ['61 − 25 = []'], a: [36] }],
        cue: 'Not enough ones? Break 1 ten into 10 ones. Then take away.',
        own: [{ eq: ['74 = 6 tens [] ones'], a: [14] }, F([[53, '−', 28]]), { eq: ['325 = 3 hundreds 1 ten [] ones'], a: [15], wide: true }, F([[342, '−', 18]])]
      },
      p1: {
        show: { cap: 'Break a ten: 30 = 2 tens 10 ones', eq: ['30 − 6 = 24'] },
        items: [{ eq: ['56 = 4 tens [] ones'], a: [16] }, { eq: ['82 = 7 tens [] ones'], a: [12] }, F([[45, '−', 18], [63, '−', 27]]), F([[72, '−', 39], [91, '−', 46]]), F([[134, '−', 28], [255, '−', 47]]), F([[470, '−', 26], [383, '−', 59]])]
      },
      p2: {
        items: [{ eq: ['305 = 2 hundreds [] tens 5 ones'], a: [10], wide: true }, { eq: ['412 = 3 hundreds [] tens 2 ones'], a: [11], wide: true },
          F([[342, '−', 165], [520, '−', 147]]), F([[613, '−', 284], [700, '−', 356]]),
          story('{a} has 432 {many} and gives away 157. How many are left?', '{many}', 275, '432 − 157'), { q: 'Draw 64 − 29 with blocks.', draw: { h: 70, key: ['blocks', { h: 0, t: 3, o: 5 }] }, eq: ['64 − 29 = []'], a: [35] }]
      },
      p3: {
        items: [FA([[503, '−', 268], [800, '−', 423], [715, '−', 389], [400, '−', 175], [624, '−', 457], [911, '−', 536]]),
          story('{b} had 600 {many} and sold 248. How many are left?', '{many}', 352, '600 − 248'), story('{a} has 705 {many}. {b} has 389. How many more has {a}?', '{many}', 316, '705 − 389'),
          { eq: ['1000 − 1 = []', '1000 − 101 = []'], a: [999, 899] }, TF('500 − 1 = 499', true)]
      },
      think: {
        items: [{ q: '{a} wrote 52 − 37 = 25. What went wrong?', lines: { n: 2, key: '{a} did 7 − 2 instead of breaking a ten: 12 − 7 = 5, 4 − 3 = 1. It is 15.' } },
          { q: 'How do you subtract from 400 when there are no tens or ones?', lines: { n: 2, key: 'Break a hundred into tens, then a ten into ones: 3 hundreds 9 tens 10 ones.' } },
          { q: 'Draw 300 − 125 with blocks.', draw: { h: 90, key: ['blocks', { h: 1, t: 7, o: 5 }] } },
          { q: 'Write a subtraction where you must break a ten and a hundred.', lines: { n: 1, key: 'For example: 423 − 187.' } }]
      }
    },

    subcol: {
      watch: 'subtracting the top digit from the bottom one. Always top minus bottom; break a ten when the top is smaller.',
      goal: 'I can subtract in columns, ones first.',
      learn: {
        show: { pic: ['col', { a: 452, b: 128, op: '−' }], cap: 'Ones: 2 − 8? Break a ten: 12 − 8', eq: ['452 − 128 = 324'] },
        together: [CO(586, '−', 243), CO(374, '−', 158)],
        cue: 'Line up the places. Ones first, top minus bottom. Top too small? Break a ten.',
        own: [CO(697, '−', 354), CO(563, '−', 247), CO(825, '−', 316), CO(642, '−', 375)]
      },
      p1: {
        show: { pic: ['col', { a: 768, b: 325, op: '−' }], cap: 'No breaking', eq: ['768 − 325 = 443'] },
        items: [CO(479, '−', 136), CO(857, '−', 425), CO(964, '−', 731), CO(352, '−', 117), CO(681, '−', 248), CO(735, '−', 419)]
      },
      p2: {
        items: [CO2([534, '−', 276], [721, '−', 384]), CO2([603, '−', 245], [850, '−', 467]), CO2([912, '−', 538], [400, '−', 163]),
          story('{a} has 625 {many} and uses 348. How many are left?', '{many}', 277, '625 − 348'), TF('702 − 356 = 346', true)]
      },
      p3: {
        items: [CO2([1000, '−', 457], [806, '−', 579]), CO2([503, '−', 286], [910, '−', 645]), CO2([700, '−', 391], [834, '−', 769]),
          story('A tank holds 900 L. 384 L are used. How much is left?', 'L', 516, '900 − 384'), { q: 'Take 285 away to leave 357. What was the start?', eq: ['[] − 285 = 357'], a: [642] }]
      },
      think: {
        items: [{ q: '{b} worked out 503 − 168 = 465. Find the mistake.', lines: { n: 2, key: '{b} took the top from the bottom. Breaking a hundred gives 335.' } },
          { q: 'How can you check 812 − 457 = 355?', lines: { n: 2, key: 'Add: 355 + 457 = 812.' } },
          { q: 'Make a subtraction with an answer of 248.', lines: { n: 1, key: 'For example: 500 − 252 = 248.' } },
          { q: 'Why do zeros make subtraction harder? Show with 600 − 237.', lines: { n: 3, key: 'There are no tens or ones, so break a hundred into 9 tens and 10 ones: 363.' } }]
      }
    },

    est: {
      watch: 'rounding and then not checking. Estimate first, then compare the exact answer with the estimate.',
      goal: 'I can estimate before I add or subtract.',
      learn: {
        show: { cap: 'Round each number to the nearest hundred', eq: ['389 + 212 is about 400 + 200', '389 + 212 is about 600'] },
        together: [ES(100, [[312, '+', 489]]), ES(100, [[786, '−', 213]])],
        cue: 'Round each number first. Add or take away the round numbers. Then work out the exact answer.',
        own: [ES(100, [[198, '+', 405]]), ES(100, [[903, '−', 297]]), ES(10, [[46, '+', 33]]), ES(10, [[92, '−', 58]])]
      },
      p1: {
        show: { cap: 'Nearest ten', eq: ['48 + 31 is about 50 + 30 = 80'] },
        items: [ES(10, [[27, '+', 42]]), ES(10, [[68, '−', 21]]), ES(100, [[310, '+', 290]]), ES(100, [[685, '−', 412]]), ES(100, [[149, '+', 562]]), ES(10, [[83, '+', 79]])]
      },
      p2: {
        items: [{ eq: ['398 + 204 is about []', '398 + 204 = []'], a: [600, 602], est: 100 }, { eq: ['721 − 289 is about []', '721 − 289 = []'], a: [400, 432], est: 100 },
          { eq: ['512 + 279 is about []', '512 + 279 = []'], a: [800, 791], est: 100 }, { eq: ['88 − 42 is about []', '88 − 42 = []'], a: [50, 46], est: 10 },
          { q: '{a} says 405 + 389 = 594. Estimate to check. Circle.', pick: { opts: ['sensible', 'not sensible'], ans: 1 }, tf: '405 + 389 = 594', wide: true },
          { q: '{b} says 612 − 298 = 314. Estimate to check. Circle.', pick: { opts: ['sensible', 'not sensible'], ans: 0 }, tf: '612 − 298 = 314', wide: true }]
      },
      p3: {
        items: [{ eq: ['458 + 349 is about []', '458 + 349 = []'], a: [800, 807], est: 100 }, { eq: ['903 − 476 is about []', '903 − 476 = []'], a: [400, 427], est: 100 },
          { q: 'A school has 386 students and 214 more join. About how many now?', eq: ['386 + 214 is about []'], a: [600], est: 100 },
          { q: 'Circle the best estimate for 297 + 398.', pick: { opts: ['500', '600', '700'], ans: 2, round: { to: 100, val: 700 } } },
          { q: '{a} has $600. Can {a} buy a $389 bike and a $254 tent? Estimate.', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '389 + 254 < 600', wide: true },
          { q: 'Circle the best estimate for 812 − 395.', pick: { opts: ['400', '500', '300'], ans: 0, round: { to: 100, val: 400 } } }]
      },
      think: {
        items: [{ q: 'Why estimate when you can work it out exactly?', lines: { n: 2, key: 'To check that the answer is sensible, and to catch mistakes.' } },
          { q: '{b} estimated 451 + 349 as 400 + 300. Is that a good estimate? Why?', lines: { n: 2, key: 'Not the best: 451 rounds to 500 and 349 to 300, so about 800. The exact answer is 800.' } },
          { q: 'Write a sum whose estimate is 700.', lines: { n: 1, key: 'For example: 412 + 289.' } },
          { q: 'Is an estimate always more or less than the exact answer? Explain.', lines: { n: 2, key: 'It can be either. It depends on which way the numbers were rounded.' } }]
      }
    },

    check: {
      watch: 'checking with the same operation. Check a subtraction by adding, and an addition by subtracting.',
      goal: 'I can check with the opposite operation.',
      learn: {
        show: { cap: 'Check 452 − 178 = 274 by adding', eq: ['274 + 178 = 452', 'It is right'] },
        together: [CK(365, '+', 218, 583), CK(704, '−', 356, 348)],
        cue: 'Check subtraction with addition. Check addition with subtraction. You should get back to the start.',
        own: [CK(246, '+', 337, 583), CK(612, '−', 285, 337)]
      },
      p1: {
        show: { cap: 'Check 300 + 250 = 550', eq: ['550 − 250 = 300'] },
        items: [CK(124, '+', 135, 259), CK(470, '−', 230, 240), CK(358, '+', 211, 579), CK(689, '−', 452, 237), CK(205, '+', 140, 355), CK(900, '−', 400, 500)]
      },
      p2: {
        items: [CK(347, '+', 285, 632), CK(523, '−', 187, 346), CK(468, '+', 239, 697), CK(806, '−', 359, 447), CK(198, '+', 476, 674), CK(750, '−', 486, 264)]
      },
      p3: {
        items: [CK(589, '+', 347, 936), CK(1000, '−', 627, 373), CK(437, '+', 298, 725), CK(903, '−', 458, 445),
          story('{a} had some {many}. After giving away 285, {a} has 427. How many at the start?', '{many}', 712, '427 + 285'), story('{b} added 389 {many} and now has 702. How many before?', '{many}', 313, '702 − 389')]
      },
      think: {
        items: [{ q: 'Why does adding check a subtraction?', lines: { n: 2, key: 'Subtraction takes a part from the whole. Adding the parts back gives the whole.' } },
          { q: '{a} checked 600 − 250 = 350 by doing 600 + 250. What went wrong?', lines: { n: 2, key: 'Check by adding the answer and the part: 350 + 250 = 600.' } },
          { q: 'Write a subtraction and check it.', lines: { n: 2, key: 'For example: 523 − 248 = 275; 275 + 248 = 523.' } },
          { q: 'Can a check catch every mistake? Explain.', lines: { n: 2, key: 'It catches most. If you make the same mistake twice it may not.' } }]
      }
    },

    word: {
      watch: 'choosing by key words alone. Ask: "Are we putting parts together, or taking a part from a whole?"',
      goal: 'I can tell if a story puts together or takes apart.',
      learn: {
        show: { cap: 'Putting together: add. Taking apart: subtract.', eq: ['parts → whole: +', 'whole − part: −'] },
        together: [PM('{a} has 124 {many}. {b} gives {a} 35 more. How many now?', '{many}', 124, '+', 35), PM('{a} has 250 {many} and uses 120. How many are left?', '{many}', 250, '−', 120)],
        cue: 'Know both parts? Add. Know the whole and one part? Subtract.',
        own: [PM('A {cont} has 46 {many}. Another has 38. How many in all?', '{many}', 46, '+', 38), PM('{b} had 92 {many} and gave away 47. How many left?', '{many}', 92, '−', 47)]
      },
      p1: {
        show: { cap: '{a} has 20 {many}. {b} has 15. How many in all?', eq: ['20 + 15 = 35'] },
        items: [PM('{a} has 32 {many}. {a} gets 17 more. How many now?', '{many}', 32, '+', 17), PM('{b} has 58 {many}. 23 roll away. How many are left?', '{many}', 58, '−', 23),
          PM('There are 125 {many} in one {cont} and 50 in another. How many in all?', '{many}', 125, '+', 50), PM('{a} needs 80 {many} and has 45. How many more?', '{many}', 80, '−', 45),
          PM('{b} had 300 {many} and sold 120. How many are left?', '{many}', 300, '−', 120), PM('{a} picks 64 {many} on Monday and 29 on Tuesday. How many?', '{many}', 64, '+', 29)]
      },
      p2: {
        items: [PM('A {cont} holds 245 {many}. 118 are taken out. How many are in it now?', '{many}', 245, '−', 118), PM('{a} has 167 {many} and {b} has 89. How many together?', '{many}', 167, '+', 89),
          PM('{b} has 412 {many}. {a} has 150 fewer. How many has {a}?', '{many}', 412, '−', 150), PM('{a} saved $156 and then $75. How much in all?', 'dollars', 156, '+', 75),
          PM('A trail is 600 m long. {b} has walked 385 m. How far is left?', 'm', 600, '−', 385), PM('{a} has 238 {many}. {b} has 47 more than {a}. How many has {b}?', '{many}', 238, '+', 47)]
      },
      p3: {
        items: [PM('{a} had some {many}, gave away 125 and has 340 left. How many at first?', '{many}', 340, '+', 125), PM('{b} has 503 {many}. {a} has 276. How many more has {b}?', '{many}', 503, '−', 276),
          PM('{a} has 389 {many}. {b} gives {a} 245. How many now?', '{many}', 389, '+', 245), PM('A box had 1000 {many}. Now it has 432. How many were used?', '{many}', 1000, '−', 432),
          story('{b} has 120 {many}, buys 80 and gives 50 away. How many now?', '{many}', 150, '120 + 80 − 50'), story('{a} has 400 {many}, uses 150, then gets 75. How many now?', '{many}', 325, '400 − 150 + 75')]
      },
      think: {
        items: [{ q: 'Write a story you would solve by adding.', lines: { n: 3, key: 'For example: {a} has 120 {many} and gets 40 more. How many now?' } },
          { q: 'Write a story you would solve by subtracting.', lines: { n: 3, key: 'For example: {b} has 90 {many} and gives 35 away. How many are left?' } },
          { q: '"{a} has 15 more than {b}." Does "more" always mean add? Explain.', lines: { n: 2, key: 'No. If we know {a} and want {b}, we subtract.' } },
          { q: 'Draw a bar to show a whole and two parts for 250 = 180 + 70.', draw: { h: 70, key: 'A bar of 250 split into 180 and 70.' } }]
      }
    },

    equal: {
      watch: 'reading = as "the answer is" (writing 8 + 5 = 13 + 6 = 19). = means both sides have the same value.',
      goal: 'I can make both sides of = the same.',
      learn: {
        show: { pic: ['balance', { l: '8 + 5', r: '10 + 3', tilt: 0 }], cap: 'Both sides are 13', eq: ['8 + 5 = 10 + 3'] },
        together: [{ eq: ['7 + 6 = [] + 3'], a: [10] }, { eq: ['15 − 5 = 4 + []'], a: [6] }],
        cue: '= means both sides are worth the same. Work out one side, then make the other side match.',
        own: [{ eq: ['9 + 4 = 10 + []'], a: [3] }, { eq: ['20 + 30 = [] + 10'], a: [40] }, { eq: ['12 − 2 = 5 + []'], a: [5] }, { eq: ['[] + 6 = 8 + 8'], a: [10] }]
      },
      p1: {
        show: { pic: ['balance', { l: '6 + 4', r: '5 + 5', tilt: 0 }], cap: 'Level: both sides are 10', eq: ['6 + 4 = 5 + 5'] },
        items: [{ eq: ['5 + 3 = 4 + []'], a: [4] }, { eq: ['9 + 1 = [] + 7'], a: [3] }, { eq: ['10 − 2 = 6 + []'], a: [2] }, { eq: ['[] + 5 = 7 + 7'], a: [9] }, TF('6 + 7 = 13 + 2', false), TF('8 + 4 = 6 + 6', true)]
      },
      p2: {
        items: [{ eq: ['25 + 15 = 30 + []'], a: [10] }, { eq: ['100 − 40 = [] + 20'], a: [40] }, { eq: ['300 + 200 = 250 + []'], a: [250] }, { eq: ['[] − 50 = 150 + 50'], a: [250] },
          { q: 'Circle the one that balances 70 + 30.', pick: { opts: ['50 + 40', '60 + 40', '70 + 40'], ans: 1, val: 100 }, wide: true }, TF('45 + 5 = 60 − 10', true)]
      },
      p3: {
        items: [{ eq: ['199 + 37 = 200 + []'], a: [36] }, { eq: ['500 − 125 = 400 − []'], a: [25] }, { eq: ['[] + 260 = 300 + 240'], a: [280] }, { eq: ['650 − [] = 300 + 50'], a: [300] },
          TF('348 + 52 = 400 + 0', true), TF('120 + 80 = 100 + 90', false)]
      },
      think: {
        items: [{ q: '{a} wrote 8 + 5 = 13 + 6 = 19. What went wrong?', lines: { n: 2, key: '8 + 5 is 13, but 13 + 6 is 19. The sides are not equal. Write two sums.' } },
          { q: 'Write three ways to finish 50 + 50 = ___ + ___', lines: { n: 2, key: 'For example: 60 + 40, 99 + 1, 25 + 75.' } },
          { q: 'The balance tips left. What could be on each side?', pic: ['balance', { l: '?', r: '?', tilt: -1 }], lines: { n: 2, key: 'Any sides where the left is worth more, for example 20 + 5 and 10 + 10.' } },
          { q: 'Use = to show that 24 + 9 and 23 + 10 have the same value.', lines: { n: 1, key: '24 + 9 = 23 + 10 (both are 33).' } }]
      }
    }
  } });
})();
