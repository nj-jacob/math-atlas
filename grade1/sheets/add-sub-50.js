/* Grade 1 Adding and Subtracting to 50: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per
   idea of the lessons in chapters/add-sub-50.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made
   at random, so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.3 mental strategies to add and subtract to 20 (make a ten); B2.4 add and subtract to 50 with objects,
   number lines and equations; C2.2 and C2.3 equal and not equal, and keeping both sides of = the same.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* make a ten: a + b with a split of b that fills a to 10 */
  function MT(a, b) { var f = 10 - a; return { eq: [a + ' + ' + b + ' = ' + a + ' + ' + f + ' + []', a + ' + ' + b + ' = []'], a: [b - f, a + b] }; }
  function MTP(a, b) { return { pic: ['tenframe', { a: a, b: b }], eq: [a + ' + ' + b + ' = []'], a: [a + b] }; }
  /* subtract to 20 by going back to 10 first */
  function BT(a, b) { var f = a - 10; return { eq: [a + ' − ' + b + ' = ' + a + ' − ' + f + ' − []', a + ' − ' + b + ' = []'], a: [b - f, a - b] }; }
  /* plain facts in a block of rows: list of [a, op, b] */
  function FA(list, cols) {
    var eq = [], a = [];
    list.forEach(function (f) {
      var r = f[1] === '+' ? f[0] + f[2] : f[0] - f[2];
      if (f[3] === 'mid') { eq.push(f[0] + ' ' + f[1] + ' [] = ' + r); a.push(f[2]); } else { eq.push(f[0] + ' ' + f[1] + ' ' + f[2] + ' = []'); a.push(r); }
    });
    return { eq: eq, a: a, cols: cols || 1, wide: (cols || 1) > 1 };
  }
  function BL(t, o) { return ['blocks', { h: 0, t: t, o: o }]; }
  /* jump tens, then ones, on a number line */
  function JU(a, b) {
    var t = b - b % 10, o = b % 10, j = [];
    for (var i = 0; i < t / 10; i++) j.push([a + 10 * i, a + 10 * (i + 1), '+10']);
    if (o) j.push([a + t, a + b, '+' + o]);
    var lo = Math.floor(a / 10) * 10;
    return { pic: ['nl', { min: lo, max: lo + 30, tick: 1, lab: 10, pt: a, jumps: j }], eq: [a + ' + ' + b + ' = []'], a: [a + b] };
  }
  function JD(a, b) {
    var t = b - b % 10, o = b % 10, j = [];
    for (var i = 0; i < t / 10; i++) j.push([a - 10 * i, a - 10 * (i + 1), '−10']);
    if (o) j.push([a - t, a - b, '−' + o]);
    var hi = Math.ceil(a / 10) * 10;
    return { pic: ['nl', { min: hi - 30, max: hi, tick: 1, lab: 10, pt: a, jumps: j }], eq: [a + ' − ' + b + ' = []'], a: [a - b] };
  }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  function OP(q, unit, ans, calc) { return { q: q, pick: { opts: ['+', '−'], ans: /\+/.test(calc) ? 0 : 1 }, calc: calc, eq: ['[] ' + unit], a: [ans] }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  function EQ(st, ans) { return { q: 'Is it equal? ' + st, pick: { opts: ['yes', 'no'], ans: ans ? 0 : 1 }, tf: st }; }

  S.register('add-sub-50', { code: 'A50', ideas: {

    fill: {
      watch: 'splitting the wrong number. Split the smaller number so the bigger one fills to 10.',
      goal: 'I can add by filling a ten first.',
      learn: {
        show: { pic: ['tenframe', { a: 8, b: 5 }], cap: '8 needs 2 to make 10', eq: ['8 + 5 = 8 + 2 + 3', '8 + 5 = 13'] },
        together: [MT(9, 4), MT(7, 5)],
        cue: 'Fill the ten first. Then add what is left.',
        own: [MT(8, 3), MT(9, 6), MT(6, 7), MT(8, 7)]
      },
      p1: { show: { pic: ['tenframe', { a: 9, b: 3 }], eq: ['9 + 3 = 10 + 2 = 12'] }, items: [MTP(9, 2), MTP(8, 4), MTP(7, 6), MTP(9, 5), MTP(8, 6), MTP(7, 7)] },
      p2: { items: [MT(9, 7), MT(8, 5), MT(7, 4), MT(6, 6), FA([[9, '+', 8], [8, '+', 8]]), FA([[7, '+', 9], [6, '+', 8]])] },
      p3: { items: [FA([[9, '+', 3], [8, '+', 4], [7, '+', 5], [9, '+', 9], [6, '+', 5], [8, '+', 9]], 3), FA([[5, '+', 8], [4, '+', 9], [7, '+', 8], [6, '+', 7], [3, '+', 9], [9, '+', 6]], 3), story('{a} has 9 {many}. {b} gives {a} 6 more. How many now?', '{many}', 15, '9 + 6'), story('A {cont} has 8 {many}. 7 more go in. How many?', '{many}', 15, '8 + 7')] },
      think: {
        items: [{ q: 'Why is 10 + 4 easier than 9 + 5?', lines: { n: 2, key: 'Adding to 10 is easy: 10 + 4 = 14. And 9 + 5 is the same as 10 + 4.' } },
          { q: 'Show 8 + 6 by filling a ten.', eq: ['8 + 6 = 10 + []'], a: [4] },
          { q: '{b} says 7 + 5 = 11. Check by filling a ten.', eq: ['7 + 5 = 10 + []'], a: [2], pick: { opts: ['right', 'wrong'], ans: 1 }, pickLast: true, tf: '7 + 5 = 11' },
          { q: 'Draw 9 + 4 in two ten frames.', pic: ['tenframe', { a: 0, b: 0 }], draw: { h: 20, key: 'Fill the first frame (9 + 1), then 3 in the second: 13.' } }]
      }
    },

    back20: {
      watch: 'counting back one at a time from a teen number. Take away to 10 first, then the rest.',
      goal: 'I can subtract to 20 by going back to 10.',
      learn: {
        show: { cap: '14 − 4 is 10. Then 2 more.', eq: ['14 − 6 = 14 − 4 − 2', '14 − 6 = 8'] },
        together: [BT(13, 5), BT(15, 7)],
        cue: 'Take away to get to 10. Then take away the rest.',
        own: [BT(12, 4), BT(16, 8), BT(11, 3), BT(17, 9)]
      },
      p1: { show: { eq: ['13 − 4 = 10 − 1 = 9'] }, items: [BT(12, 3), BT(14, 5), BT(11, 2), BT(15, 6), BT(13, 6), BT(16, 7)] },
      p2: { items: [FA([[12, '−', 5], [14, '−', 7]]), FA([[11, '−', 4], [13, '−', 8]]), FA([[15, '−', 9], [17, '−', 8]]), FA([[16, '−', 9], [18, '−', 9]]), story('{a} has 13 {many}. {a} uses 5. How many are left?', '{many}', 8, '13 − 5'), story('{b} has 15 {many}. {b} gives 7 away. How many are left?', '{many}', 8, '15 − 7')] },
      p3: { items: [FA([[12, '−', 6], [14, '−', 6], [11, '−', 5], [13, '−', 7], [16, '−', 8], [15, '−', 8]], 3), FA([[17, '−', 9], [12, '−', 8], [14, '−', 9], [11, '−', 7], [18, '−', 9], [13, '−', 9]], 3), story('There are 16 {many}. 9 are taken. How many are left?', '{many}', 7, '16 − 9'), story('{a} had 14 {many}. Now {a} has 6. How many are gone?', '{many}', 8, '14 − 6')] },
      think: {
        items: [{ q: 'Why go to 10 first?', lines: { n: 2, key: 'Taking away from 10 is easy, like 10 − 3 = 7.' } },
          { q: 'Check 15 − 8 = 7 by adding.', eq: ['7 + 8 = []'], a: [15] },
          { q: '{b} says 12 − 5 = 6. Is {b} right?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '12 − 5 = 6' },
          { q: 'Show 13 − 7 by going back to 10.', eq: ['13 − 3 − [] = []'], a: [4, 6] }]
      }
    },

    tens: {
      watch: 'adding a ten as 1. Adding 10 makes the tens digit go up by 1.',
      goal: 'I can add tens.',
      learn: {
        show: { pic: BL(3, 0), cap: '2 tens and 1 more ten', eq: ['20 + 10 = 30'] },
        together: [{ pic: BL(3, 0), eq: ['10 + 20 = []'], a: [30] }, { pic: BL(4, 0), eq: ['30 + 10 = []'], a: [40] }],
        cue: 'Count the tens. 2 tens + 1 ten = 3 tens.',
        own: [FA([[10, '+', 10]]), FA([[20, '+', 20]]), FA([[30, '+', 20]]), FA([[10, '+', 40]])]
      },
      p1: { show: { eq: ['3 tens + 1 ten = 40'] }, items: [FA([[10, '+', 30]]), FA([[20, '+', 30]]), FA([[40, '+', 10]]), FA([[20, '+', 10]]), { pic: BL(2, 5), eq: ['25 + 10 = []'], a: [35] }, { pic: BL(1, 7), eq: ['17 + 10 = []'], a: [27] }] },
      p2: { items: [FA([[23, '+', 10], [14, '+', 20]]), FA([[31, '+', 10], [16, '+', 30]]), FA([[8, '+', 20], [25, '+', 20]]), FA([[12, '+', 30], [19, '+', 10]]), story('{a} has 20 {many}. {b} gives 20 more. How many?', '{many}', 40, '20 + 20'), story('{b} has 15 {many}. {b} gets 3 {conts} of 10. How many now?', '{many}', 45, '15 + 10 + 10 + 10')] },
      p3: { items: [FA([[21, '+', 20], [34, '+', 10], [7, '+', 40], [18, '+', 30], [26, '+', 20], [12, '+', 10]], 3), FA([[30, '+', 20, 'mid'], [24, '+', 10, 'mid'], [11, '+', 30, 'mid']], 3), story('A {cont} holds 10 {many}. {a} has 4 full {conts}. How many?', '{many}', 40, '10 + 10 + 10 + 10'), story('{b} had 13 {many}. {b} got 30 more. How many?', '{many}', 43, '13 + 30')] },
      think: {
        items: [{ q: 'Why does the ones digit stay the same when you add tens?', lines: { n: 2, key: 'You only add tens, so the ones do not change.' } },
          { q: '{b} says 24 + 10 = 25. What went wrong?', lines: { n: 2, key: '{b} added 1, not 10. 24 + 10 = 34.' } },
          { q: 'Draw 16 + 20.', draw: { h: 56, key: BL(3, 6) }, eq: ['16 + 20 = []'], a: [36] },
          FA([[27, '+', 20, 'mid']])]
      }
    },

    jump: {
      watch: 'jumping by 1s for the tens. Jump a whole ten at a time, then the ones.',
      goal: 'I can add by jumping tens, then ones.',
      learn: {
        show: { pic: ['nl', { min: 20, max: 50, tick: 1, lab: 10, pt: 23, jumps: [[23, 33, '+10'], [33, 35, '+2']] }], cap: '+10, then +2', eq: ['23 + 12 = 35'] },
        together: [JU(14, 13), JU(21, 15)],
        cue: 'Jump the tens first. Then jump the ones.',
        own: [JU(32, 14), JU(16, 21)]
      },
      p1: { show: { eq: ['15 + 11: 25, 26'] }, items: [JU(12, 11), JU(24, 12), JU(31, 13), JU(15, 22)] },
      p2: { items: [FA([[23, '+', 14], [12, '+', 25]]), FA([[31, '+', 16], [26, '+', 13]]), FA([[17, '+', 21], [33, '+', 12]]), FA([[14, '+', 24], [22, '+', 22]]), story('{a} has 24 {many}. {b} gives {a} 13 more. How many?', '{many}', 37, '24 + 13'), story('{b} reads 15 pages, then 12 more. How many pages?', 'pages', 27, '15 + 12')] },
      p3: { items: [FA([[21, '+', 17], [13, '+', 34], [25, '+', 23], [32, '+', 16], [11, '+', 28], [36, '+', 12]], 3), FA([[18, '+', 11], [27, '+', 21], [14, '+', 15], [16, '+', 32], [22, '+', 26], [35, '+', 14]], 3), story('There are 26 {many} in one {cont} and 22 in another. How many in all?', '{many}', 48, '26 + 22'), story('{a} had 19 {many}. {a} found 20 more. How many?', '{many}', 39, '19 + 20')] },
      think: {
        items: [{ q: 'Show 25 + 14 with jumps.', pic: ['nl', { min: 20, max: 50, tick: 1, lab: 10 }], draw: { h: 20, key: 'Jump +10 to 35, then +4 to 39.' }, wide: true },
          { q: 'Why jump the tens first?', lines: { n: 2, key: 'Jumping 10 at once is quicker than ten jumps of 1.' } },
          { q: '{b} says 32 + 15 = 37. What went wrong?', lines: { n: 2, key: '{b} forgot the ten. 32 + 10 = 42, + 5 = 47.' } },
          FA([[23, '+', 21, 'mid']])]
      }
    },

    'tens-away': {
      watch: 'taking away 1 instead of a ten. Taking away 10 makes the tens digit go down by 1.',
      goal: 'I can take away tens.',
      learn: {
        show: { pic: BL(4, 0), cap: '4 tens, take away 1 ten', eq: ['40 − 10 = 30'] },
        together: [FA([[30, '−', 10]]), FA([[50, '−', 20]])],
        cue: 'Take away whole tens. The ones stay the same.',
        own: [FA([[20, '−', 10]]), FA([[40, '−', 30]]), FA([[35, '−', 10]]), FA([[48, '−', 20]])]
      },
      p1: { show: { eq: ['36 − 10 = 26'] }, items: [FA([[50, '−', 10]]), FA([[30, '−', 20]]), FA([[40, '−', 20]]), FA([[27, '−', 10]]), { pic: BL(4, 3), eq: ['43 − 10 = []'], a: [33] }, { pic: BL(3, 8), eq: ['38 − 20 = []'], a: [18] }] },
      p2: { items: [FA([[45, '−', 10], [32, '−', 20]]), FA([[49, '−', 30], [26, '−', 10]]), FA([[41, '−', 40], [37, '−', 20]]), FA([[50, '−', 30], [24, '−', 10]]), story('{a} has 40 {many}. {a} gives away 20. How many are left?', '{many}', 20, '40 − 20'), story('{b} has 35 {many}. {b} uses 10. How many are left?', '{many}', 25, '35 − 10')] },
      p3: { items: [FA([[46, '−', 20], [33, '−', 10], [50, '−', 40], [28, '−', 20], [44, '−', 30], [19, '−', 10]], 3), FA([[39, '−', 20, 'mid'], [47, '−', 30, 'mid'], [25, '−', 10, 'mid']], 3), story('{a} had 42 {many}. {a} sold 3 {conts} of 10. How many are left?', '{many}', 12, '42 − 10 − 10 − 10'), story('{b} had 50 {many}. {b} gave 20 to {a}. How many are left?', '{many}', 30, '50 − 20')] },
      think: {
        items: [{ q: '{b} says 36 − 10 = 35. What went wrong?', lines: { n: 2, key: '{b} took away 1. 36 − 10 = 26.' } },
          { q: 'Count back by 10s from 47.', eq: ['47, 37, [], [], []'], a: [27, 17, 7], by: -10, wide: true },
          { q: 'Draw 34 − 20. What is left?', draw: { h: 56, key: '3 tens 4 ones, cross out 2 tens: 14.' }, eq: ['34 − 20 = []'], a: [14] },
          FA([[45, '−', 30, 'mid']])]
      }
    },

    back: {
      watch: 'jumping back the ones first and losing track. Jump back the tens, then the ones.',
      goal: 'I can subtract by jumping back tens, then ones.',
      learn: {
        show: { pic: ['nl', { min: 20, max: 50, tick: 1, lab: 10, pt: 45, jumps: [[45, 35, '−10'], [35, 32, '−3']] }], cap: '−10, then −3', eq: ['45 − 13 = 32'] },
        together: [JD(38, 12), JD(46, 21)],
        cue: 'Jump back the tens first. Then jump back the ones.',
        own: [JD(29, 14), JD(47, 23)]
      },
      p1: { show: { eq: ['37 − 12: 27, 25'] }, items: [JD(28, 11), JD(36, 14), JD(49, 22), JD(35, 13)] },
      p2: { items: [FA([[38, '−', 15], [47, '−', 24]]), FA([[29, '−', 16], [44, '−', 31]]), FA([[36, '−', 22], [49, '−', 17]]), FA([[27, '−', 13], [45, '−', 33]]), story('{a} has 38 {many}. {a} gives away 15. How many are left?', '{many}', 23, '38 − 15'), story('{b} had 46 {many}. 24 were used. How many are left?', '{many}', 22, '46 − 24')] },
      p3: { items: [FA([[48, '−', 26], [39, '−', 14], [47, '−', 35], [28, '−', 17], [36, '−', 21], [49, '−', 38]], 3), FA([[45, '−', 12], [37, '−', 25], [29, '−', 18], [46, '−', 33], [38, '−', 27], [44, '−', 22]], 3), story('There are 49 {many}. 27 are sold. How many are left?', '{many}', 22, '49 − 27'), story('{a} had 35 {many}. Now {a} has 12. How many are gone?', '{many}', 23, '35 − 12')] },
      think: {
        items: [{ q: 'Show 47 − 15 with jumps.', pic: ['nl', { min: 20, max: 50, tick: 1, lab: 10 }], draw: { h: 20, key: 'Jump −10 to 37, then −5 to 32.' }, wide: true },
          { q: 'Check 39 − 16 = 23 by adding.', eq: ['23 + 16 = []'], a: [39] },
          { q: '{b} says 48 − 23 = 21. Is {b} right?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '48 − 23 = 21' },
          FA([[46, '−', 24, 'mid']])]
      }
    },

    steps: {
      watch: 'jumping to the numbers before understanding the story. Retell it first, then draw it.',
      goal: 'I can solve a story in four steps: read, show, solve, check.',
      learn: {
        show: { pic: ['groups', { counts: [12, 5] }], cap: 'Read. Show. Solve. Check.', eq: ['12 + 5 = 17'] },
        together: [story('{a} has 12 {many}. {b} brings 5 more. How many now?', '{many}', 17, '12 + 5'), story('{b} has 24 {many}. {b} gives 11 away. How many are left?', '{many}', 13, '24 − 11')],
        cue: 'Read it. Show it. Solve it. Check it.',
        own: [story('A {cont} has 15 {many}. 4 more go in. How many?', '{many}', 19, '15 + 4'), story('{a} had 18 {many}. {a} used 6. How many are left?', '{many}', 12, '18 − 6'), story('{b} has 21 {many} and {a} has 14. How many in all?', '{many}', 35, '21 + 14'), story('There were 30 {many}. 10 were sold. How many are left?', '{many}', 20, '30 − 10')]
      },
      p1: { show: { eq: ['15 − 3 = 12'] }, items: [story('{a} has 11 {many}. {a} gets 4 more. How many?', '{many}', 15, '11 + 4'), story('{b} has 19 {many}. {b} gives 5 away. How many are left?', '{many}', 14, '19 − 5'), story('There are 13 {many} and 6 more. How many?', '{many}', 19, '13 + 6'), story('{a} had 17 {many}. 7 rolled away. How many are left?', '{many}', 10, '17 − 7'), story('{b} has 20 {many}. {a} gives {b} 20 more. How many?', '{many}', 40, '20 + 20'), story('A {cont} has 25 {many}. 3 are taken. How many are left?', '{many}', 22, '25 − 3')] },
      p2: { items: [story('{a} has 23 {many}. {b} has 15. How many in all?', '{many}', 38, '23 + 15'), story('{b} had 36 {many}. {b} gave 14 to {a}. How many are left?', '{many}', 22, '36 − 14'), story('There are 16 {many} in one {cont} and 12 in another. How many?', '{many}', 28, '16 + 12'), story('{a} had 45 {many}. {a} sold 20. How many are left?', '{many}', 25, '45 − 20'), story('{b} has 28 {many}. {b} finds 11 more. How many?', '{many}', 39, '28 + 11'), story('{a} had 40 {many}. 15 were used. How many are left?', '{many}', 25, '40 − 15')] },
      p3: { items: [story('{a} has 17 {many}. {b} has 9 more than {a}. How many does {b} have?', '{many}', 26, '17 + 9'), story('{b} has 34 {many}. {a} has 21. How many more does {b} have?', 'more', 13, '34 − 21'), story('{a} had some {many}. {a} got 12 more. Now {a} has 30. How many at first?', '{many}', 18, '30 − 12'), story('{b} had 26 {many}. {b} gave some away. Now {b} has 14. How many went?', '{many}', 12, '26 − 14'), story('There are 15 {many}, then 10 more, then 5 more. How many?', '{many}', 30, '15 + 10 + 5'), story('{a} had 48 {many}. {a} gave 20 away and lost 8. How many are left?', '{many}', 20, '48 − 20 − 8')] },
      think: {
        items: [{ q: 'Write a story for 25 + 13.', lines: { n: 3, key: 'For example: {a} has 25 {many}. {b} brings 13 more. Now there are 38.' } },
          { q: 'Draw a picture to show: 16 {many}, 5 go away.', draw: { h: 60, key: '16 with 5 crossed out: 11 left.' }, eq: ['16 − 5 = []'], a: [11] },
          { q: '{b} says 30 {many}, 12 given away, leaves 42. Does that make sense?', lines: { n: 2, key: 'No. Giving away leaves fewer than 30. 30 − 12 = 18.' } },
          { q: 'How do you check your answer?', lines: { n: 2, key: 'Do the opposite: 18 + 12 = 30. Or ask: does it make sense?' } }]
      }
    },

    which: {
      watch: 'picking + because both numbers are in the story. Ask: are things coming or going?',
      goal: 'I can tell if a story needs adding or subtracting.',
      learn: {
        show: { cap: 'Coming: add. Going: subtract.', eq: ['more: +   left: −'] },
        together: [OP('{a} has 14 {many}. 5 more come. How many now?', '{many}', 19, '14 + 5'), OP('{b} has 20 {many}. 8 go away. How many are left?', '{many}', 12, '20 − 8')],
        cue: 'Coming together? Add. Going away or how many more? Subtract.',
        own: [OP('{a} had 30 {many}. {a} gave away 10. How many are left?', '{many}', 20, '30 − 10'), OP('{b} has 12 {many}. {b} gets 12 more. How many?', '{many}', 24, '12 + 12'), OP('{a} has 25 {many}. {b} has 21. How many more does {a} have?', 'more', 4, '25 − 21'), OP('There are 16 {many} and 13 {many}. How many in all?', '{many}', 29, '16 + 13')]
      },
      p1: { show: { eq: ['in all: +', 'left: −'] }, items: [OP('{a} has 11 {many}. {a} finds 6 more. How many?', '{many}', 17, '11 + 6'), OP('{b} has 18 {many}. 6 roll away. How many are left?', '{many}', 12, '18 − 6'), OP('{a} has 22 {many} and gets 10 more. How many?', '{many}', 32, '22 + 10'), OP('{b} had 35 {many}. 15 were used. How many are left?', '{many}', 20, '35 − 15')] },
      p2: { items: [OP('{a} has 40 {many}. {a} sells 25. How many are left?', '{many}', 15, '40 − 25'), OP('{b} has 13 {many}. {a} has 24. How many in all?', '{many}', 37, '13 + 24'), OP('{a} has 29 {many}. {b} has 17. How many more does {a} have?', 'more', 12, '29 − 17'), OP('{b} had 21 {many}. {b} got 16 more. How many?', '{many}', 37, '21 + 16')] },
      p3: { items: [OP('{a} had some {many}. {a} got 15 more. Now {a} has 40. How many at first?', '{many}', 25, '40 − 15'), OP('{b} gave away 12 {many}. Now {b} has 20. How many at first?', '{many}', 32, '20 + 12'), OP('{a} has 18 {many}. {b} has 7 more than {a}. How many does {b} have?', '{many}', 25, '18 + 7'), OP('{b} has 33 {many}. {a} has 11 fewer. How many does {a} have?', '{many}', 22, '33 − 11')] },
      think: {
        items: [{ q: 'Write an adding story with 15 and 20.', lines: { n: 2, key: 'For example: {a} has 15 {many}, {b} brings 20. 35 in all.' } },
          { q: 'Write a subtracting story with 15 and 20.', lines: { n: 2, key: 'For example: {a} has 20 {many} and gives away 15. 5 are left.' } },
          { q: '"How many more" stories: add or subtract? Why?', lines: { n: 2, key: 'Subtract. You find the difference between the two numbers.' } },
          { q: '{b} gave away 10 {many} and has 15 left. {b} says 15 − 10 = 5 at first. Is that right?', lines: { n: 2, key: 'No. {b} had more at first: 15 + 10 = 25.' } }]
      }
    },

    same: {
      watch: 'reading = as "the answer is". = means both sides are worth the same.',
      goal: 'I can tell if both sides of = are the same.',
      learn: {
        show: { cap: 'Both sides make 7', eq: ['3 + 4 = 5 + 2'] },
        together: [EQ('6 + 2 = 4 + 4', true), EQ('5 + 3 = 9', false)],
        cue: '= means both sides are worth the same.',
        own: [EQ('10 = 7 + 3', true), EQ('4 + 1 = 3 + 3', false), EQ('9 − 2 = 7', true), EQ('8 = 10 − 1', false)]
      },
      p1: { show: { eq: ['8 = 5 + 3'] }, items: [EQ('2 + 5 = 7', true), EQ('6 = 3 + 2', false), EQ('4 + 4 = 8', true), EQ('9 = 5 + 5', false), EQ('1 + 6 = 6 + 1', true), EQ('3 + 3 = 2 + 5', false)] },
      p2: { items: [EQ('10 − 3 = 4 + 3', true), EQ('8 − 2 = 5 + 2', false), EQ('20 + 10 = 30', true), EQ('12 = 6 + 5', false), EQ('15 − 5 = 10', true), EQ('9 + 1 = 5 + 4', false)] },
      p3: { items: [EQ('14 + 2 = 10 + 6', true), EQ('20 − 5 = 10 + 4', false), EQ('30 = 20 + 5 + 5', true), EQ('25 + 10 = 30 + 4', false), { q: 'Make it true.', eq: ['7 = 4 + []'], a: [3] }, { q: 'Make it true.', eq: ['[] = 12 − 2'], a: [10] }] },
      think: {
        items: [{ q: '{b} says 5 + 3 = 8 + 2 is true because 5 + 3 = 8. Is {b} right?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '5 + 3 = 8 + 2' },
          { q: 'Write two sums that are equal.', lines: { n: 1, key: 'For example: 4 + 6 = 7 + 3.' } },
          { q: 'Is 9 = 9 true?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '9 = 9' },
          { q: 'What does = mean?', lines: { n: 2, key: 'Both sides are worth the same amount.' } }]
      }
    },

    balance: {
      watch: 'writing the total of the left side in the box. The box makes the right side equal to the left.',
      goal: 'I can make both sides equal.',
      learn: {
        show: { pic: ['balance', { l: 6, r: 6, tilt: 0 }], cap: '4 + 2 balances 3 + 3', eq: ['4 + 2 = 3 + 3'] },
        together: [{ eq: ['5 + 3 = 4 + []'], a: [4] }, { eq: ['6 + 4 = [] + 5'], a: [5] }],
        cue: 'Find what one side makes. Make the other side the same.',
        own: [{ eq: ['2 + 7 = 6 + []'], a: [3] }, { eq: ['8 + 2 = 7 + []'], a: [3] }, { eq: ['[] + 3 = 4 + 4'], a: [5] }, { eq: ['9 − 1 = 5 + []'], a: [3] }]
      },
      p1: { show: { eq: ['5 + 1 = 4 + 2'] }, items: [{ eq: ['3 + 2 = 4 + []'], a: [1] }, { eq: ['6 + 1 = 5 + []'], a: [2] }, { eq: ['4 + 4 = 6 + []'], a: [2] }, { eq: ['1 + 8 = 3 + []'], a: [6] }, { eq: ['7 + 3 = 5 + []'], a: [5] }, { eq: ['2 + 4 = 3 + []'], a: [3] }] },
      p2: { items: [{ eq: ['10 + 5 = 12 + []'], a: [3] }, { eq: ['9 + 6 = 10 + []'], a: [5] }, { eq: ['[] + 8 = 7 + 7'], a: [6] }, { eq: ['20 + 10 = 25 + []'], a: [5] }, { eq: ['10 − 2 = 4 + []'], a: [4] }, { eq: ['15 = 10 + []'], a: [5] }] },
      p3: { items: [{ eq: ['13 + 4 = 10 + []'], a: [7] }, { eq: ['30 + 15 = 40 + []'], a: [5] }, { eq: ['18 − 3 = 10 + []'], a: [5] }, { eq: ['[] + 20 = 25 + 5'], a: [10] }, { eq: ['12 + 12 = 20 + []'], a: [4] }, { eq: ['40 − 10 = 15 + []'], a: [15] }] },
      think: {
        items: [{ q: '{a} wrote 4 + 5 = [] + 3 and put 9. Fix it.', eq: ['4 + 5 = [] + 3'], a: [6] },
          { q: 'Find two ways to fill in.', eq: ['[] + [] = 5 + 5', '[] + [] = 5 + 5'], a: [6, 4, 7, 3], wide: true },
          { q: 'Draw cubes so the balance is level.', pic: ['balance', { l: 5, r: 2, tilt: -1 }], draw: { h: 40, key: 'Add 3 cubes to the right side.' } },
          { q: 'Is 6 + 6 = 10 + 2 true?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '6 + 6 = 10 + 2' }]
      }
    }
  } });
})();
