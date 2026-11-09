/* Grade 2 Facts to 20: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the
   lessons in chapters/facts-20.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.1 use the properties of addition and subtraction to solve problems and check; B2.2 recall and
   demonstrate addition facts to 20 and the related subtraction facts.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function sum(a, op, b) { return op === '+' ? a + b : a - b; }
  /* plain facts: list of [a, op, b] */
  function F(list) { return { eq: list.map(function (f) { return f[0] + ' ' + f[1] + ' ' + f[2] + ' = []'; }), a: list.map(function (f) { return sum(f[0], f[1], f[2]); }) }; }
  /* a page-wide block of facts in 3 columns */
  function FA(list) { var f = F(list); f.cols = 3; f.wide = true; return f; }
  /* two ten frames: a + b */
  function TF2(a, b) { return { pic: ['tenframe', { a: a, b: b }], eq: [a + ' + ' + b + ' = []'], a: [a + b] }; }
  /* make a ten: a + b = 10 + [] = [] with ten frames */
  function MK(a, b) { return { pic: ['tenframe', { a: a, b: b }], eq: [a + ' + ' + b + ' = 10 + []', a + ' + ' + b + ' = []'], a: [a + b - 10, a + b] }; }
  /* partners of 10 or of another number */
  function P10(a, w) { return { eq: [a + ' + [] = ' + (w || 10)], a: [(w || 10) - a] }; }
  /* near doubles: a + b = a + a + [] = [] */
  function DB(a, b) { return { eq: [a + ' + ' + b + ' = ' + a + ' + ' + a + ' + [] = []'], a: [b - a, a + b], wide: true }; }
  /* count on from the bigger number with jumps of 1 on a number line */
  function CO(a, b) {
    var big = Math.max(a, b), small = Math.min(a, b), jumps = [];
    for (var i = 0; i < small; i++) jumps.push([big + i, big + i + 1]);
    return { pic: ['nl', { min: 0, max: 20, tick: 1, lab: 5, jumps: jumps }], eq: [a + ' + ' + b + ' = []'], a: [a + b] };
  }
  /* take away: t things, cross out k */
  function TA(t, k) { return { q: 'Cross out ' + k + '.', pic: ['dots', { t: t }], eq: [t + ' − ' + k + ' = []'], a: [t - k] }; }
  /* how many more: count up from the smaller number */
  function UP(a, b) { return { pic: ['nl', { min: 0, max: 20, tick: 1, lab: 5, jumps: [[b, a, '?']] }], eq: [a + ' − ' + b + ' = []'], a: [a - b] }; }
  /* think addition: a − b = [] because b + [] = a */
  function TH(a, b) { return { eq: [b + ' + [] = ' + a, a + ' − ' + b + ' = []'], a: [a - b, a - b] }; }
  /* turn-around facts */
  function TR(a, b) { return { eq: [a + ' + ' + b + ' = []', b + ' + ' + a + ' = []'], a: [a + b, a + b] }; }
  /* the four facts of a, b and their sum */
  function FOUR(a, b) { var c = a + b; return { q: 'Use ' + a + ', ' + b + ' and ' + c + '.', eq: [a + ' + ' + b + ' = []', b + ' + ' + a + ' = []', c + ' − ' + a + ' = []', c + ' − ' + b + ' = []'], a: [c, c, b, a] }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* a story where the child first circles + or − */
  function PM(q, unit, a, op, b) { return { q: q, pick: { opts: ['+', '−'], ans: op === '+' ? 0 : 1 }, eq: ['[] ' + unit], a: [sum(a, op, b)], calc: a + ' ' + op + ' ' + b }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }

  S.register('facts-20', { code: 'F', ideas: {

    together: {
      watch: 'counting all from 1 every time. Point to each part, then say the whole.',
      goal: 'I can put two parts together to add.',
      learn: {
        show: { pic: ['tenframe', { a: 6, b: 3 }], cap: '6 and 3 more', eq: ['6 + 3 = 9'] },
        together: [TF2(4, 3), TF2(5, 4)],
        cue: '+ means put together. = means is the same as.',
        own: [TF2(3, 3), TF2(7, 2), TF2(8, 5), TF2(6, 6)]
      },
      p1: {
        show: { pic: ['tenframe', { a: 5, b: 2 }], cap: '5 and 2 more', eq: ['5 + 2 = 7'] },
        items: [TF2(4, 4), TF2(6, 2), TF2(9, 3), TF2(7, 6), TF2(5, 5), TF2(8, 8)]
      },
      p2: {
        items: [FA([[3, '+', 5], [6, '+', 4], [7, '+', 3], [2, '+', 8], [4, '+', 5], [6, '+', 3]]),
          story('{a} has 5 {many}. {b} has 4 {many}. How many in all?', '{many}', 9, '5 + 4'), story('{a} puts 7 {many} in a {cont}, then 6 more. How many now?', '{many}', 13, '7 + 6'),
          { eq: ['[] + 4 = 9'], a: [5] }, TF('8 + 2 = 10', true)]
      },
      p3: {
        items: [FA([[9, '+', 4], [8, '+', 6], [7, '+', 7], [5, '+', 9], [6, '+', 8], [9, '+', 9], [8, '+', 7], [4, '+', 8], [7, '+', 5]]),
          story('{b} has 8 {many} and finds 9 more. How many now?', '{many}', 17, '8 + 9'), { eq: ['[] + 7 = 15'], a: [8] },
          { eq: ['6 + [] = 14'], a: [8] }, TF('9 + 5 = 13', false)]
      },
      think: {
        items: [{ q: 'Draw two parts that make 12.', draw: { h: 70, key: 'For example: 8 dots and 4 dots, or 6 and 6.' } },
          { q: '{a} says 6 + 7 = 12. What went wrong?', lines: { n: 2, key: '6 + 6 = 12, so 6 + 7 is one more: 13.' } },
          { q: 'Write a story for 5 + 8.', lines: { n: 3, key: 'For example: {a} had 5 {many} and got 8 more. Now {a} has 13.' } },
          { q: 'What does = mean in 4 + 3 = 7?', lines: { n: 2, key: 'Both sides are the same amount: 4 + 3 is the same as 7.' } }]
      }
    },

    counton: {
      watch: 'starting from the smaller number, or counting the start number as a jump. Start at the bigger number; the first jump lands on the next number.',
      goal: 'I can count on from the bigger number.',
      learn: {
        show: { cap: 'Start at 8, then count 9, 10, 11', eq: ['8 + 3 = 11'] },
        together: [CO(9, 2), CO(3, 12)],
        cue: 'Start at the bigger number. Count on the smaller one.',
        own: [CO(7, 3), CO(2, 15), F([[14, '+', 3], [1, '+', 17]]), F([[2, '+', 12], [16, '+', 3]])]
      },
      p1: {
        show: { cap: 'Start at 12, count on 3', eq: ['13, 14, 15', '12 + 3 = 15'] },
        items: [CO(11, 2), CO(3, 9), CO(16, 3), CO(2, 13), F([[15, '+', 1], [4, '+', 14]]), F([[3, '+', 13], [12, '+', 2]])]
      },
      p2: {
        items: [FA([[2, '+', 17], [3, '+', 15], [14, '+', 2], [1, '+', 18], [13, '+', 3], [3, '+', 16]]),
          story('{a} has 15 {many}. {a} gets 3 more. How many now?', '{many}', 18, '15 + 3'), story('{b} has 2 {many}, then gets 9 more. How many now?', '{many}', 11, '2 + 9'),
          { q: 'Which number do you start at for 3 + 14?', pick: { opts: ['3', '14'], ans: 1, big: true } }, TF('2 + 16 = 18', true)]
      },
      p3: {
        items: [FA([[4, '+', 13], [2, '+', 18], [16, '+', 4], [3, '+', 17], [12, '+', 4], [1, '+', 19], [15, '+', 3], [4, '+', 11], [2, '+', 14]]),
          { eq: ['17 + [] = 20'], a: [3] }, { eq: ['[] + 3 = 19'], a: [16] },
          story('{a} has 3 {many}. {b} gives {a} 16 more. How many now?', '{many}', 19, '3 + 16'), { eq: ['40 + 3 = []'], a: [43] }]
      },
      think: {
        items: [{ q: '{b} counted 9 + 3 as "9, 10, 11". What went wrong?', lines: { n: 2, key: '{b} counted the 9 as a jump. Start at 9 and count 10, 11, 12.' } },
          { q: 'Why is it faster to start at the bigger number?', lines: { n: 2, key: 'There are fewer jumps: 2 + 15 takes 2 jumps from 15, not 15 jumps from 2.' } },
          { q: 'Show 4 + 13 on a number line.', draw: { h: 60, key: ['nl', { min: 0, max: 20, tick: 1, lab: 5, jumps: [[13, 14], [14, 15], [15, 16], [16, 17]] }] } },
          { q: 'When would you not count on?', lines: { n: 2, key: 'When both numbers are big, like 8 + 9. Use a ten or a double instead.' } }]
      }
    },

    turnaround: {
      watch: 'working out 2 + 9 from scratch after knowing 9 + 2. Turn it around: the sum is the same.',
      goal: 'I can add in any order.',
      learn: {
        show: { pic: ['tenframe', { a: 3, b: 6 }], cap: 'The same counters both ways', eq: ['3 + 6 = 9', '6 + 3 = 9'] },
        together: [TR(2, 7), TR(4, 9)],
        cue: 'Change the order. The sum stays the same.',
        own: [TR(5, 8), TR(1, 6), TR(3, 9), TR(6, 7)]
      },
      p1: {
        show: { cap: 'Turn it around', eq: ['2 + 8 = 8 + 2 = 10'] },
        items: [TR(2, 5), TR(3, 7), TR(4, 6), TR(1, 9), TR(5, 7), TR(2, 9)]
      },
      p2: {
        items: [{ eq: ['3 + 8 = [] + 3'], a: [8] }, { eq: ['9 + 4 = 4 + []'], a: [9] }, { eq: ['[] + 6 = 6 + 7'], a: [7] }, { eq: ['5 + [] = 9 + 5'], a: [9] },
          TF('2 + 9 = 9 + 2', true), TF('7 − 3 = 3 − 7', false)]
      },
      p3: {
        items: [{ eq: ['2 + 7 + 8 = 8 + 2 + []'], a: [7], wide: true }, { eq: ['5 + 9 + 5 = 5 + 5 + [] = []'], a: [9, 19], wide: true },
          { eq: ['4 + 8 + 6 = 4 + 6 + [] = []'], a: [8, 18], wide: true }, { eq: ['3 + 9 + 7 = []'], a: [19] }, TF('8 + 6 = 6 + 8', true)]
      },
      think: {
        items: [{ q: 'Does a turn-around work for subtraction? Try 9 − 4 and 4 − 9.', lines: { n: 2, key: 'No. 9 − 4 = 5, but you cannot take 9 from 4 with things.' } },
          { q: 'How does 2 + 8 help with 8 + 2?', lines: { n: 2, key: 'They are turn-around facts. Both are 10.' } },
          { q: 'Draw a picture that shows 4 + 5 and 5 + 4 at once.', draw: { h: 70, key: '4 dots and 5 dots in a row: read from either side it is 9.' } },
          { q: 'Add 3 + 9 + 7. Which two would you add first? Why?', lines: { n: 2, key: '3 + 7 = 10 first, then 10 + 9 = 19.' } }]
      }
    },

    pairs10: {
      watch: 'mixing up 6 + 4 and 7 + 4. Fill a ten frame and count the empty boxes.',
      goal: 'I know the pairs that make 10.',
      learn: {
        show: { pic: ['tenframe', { a: 7, b: 0 }], cap: '3 empty boxes', eq: ['7 + 3 = 10'] },
        together: [{ pic: ['tenframe', { a: 6, b: 0 }], eq: ['6 + [] = 10'], a: [4] }, { pic: ['tenframe', { a: 2, b: 0 }], eq: ['2 + [] = 10'], a: [8] }],
        cue: 'Count the empty boxes: they make the partner of 10.',
        own: [{ pic: ['tenframe', { a: 9, b: 0 }], eq: ['9 + [] = 10'], a: [1] }, { pic: ['tenframe', { a: 5, b: 0 }], eq: ['5 + [] = 10'], a: [5] }, P10(3), P10(8)]
      },
      p1: {
        show: { pic: ['tenframe', { a: 4, b: 0 }], cap: '6 empty', eq: ['4 + 6 = 10'] },
        items: [P10(1), P10(7), P10(4), P10(6), P10(0), P10(10)]
      },
      p2: {
        items: [{ eq: ['10 − 3 = []', '10 − 8 = []'], a: [7, 2] }, { eq: ['10 − 6 = []', '10 − 5 = []'], a: [4, 5] }, { eq: ['[] + 2 = 10'], a: [8] }, { eq: ['[] + 9 = 10'], a: [1] },
          story('{a} needs 10 {many} and has 6. How many more?', '{many}', 4, '10 − 6'), TF('3 + 7 = 10', true)]
      },
      p3: {
        items: [{ eq: ['30 + [] = 100'], a: [70] }, { eq: ['80 + [] = 100'], a: [20] }, { eq: ['10 = 4 + []'], a: [6] }, { eq: ['10 = [] + 1'], a: [9] },
          story('{b} has 10 {many} and gives away 3. How many are left?', '{many}', 7, '10 − 3'), { q: 'Circle the pair that does not make 10.', pick: { opts: ['6 + 4', '7 + 4', '2 + 8'], ans: 1, diff: true }, wide: true }]
      },
      think: {
        items: [{ q: 'Write every pair of numbers that makes 10.', lines: { n: 3, key: '0 + 10, 1 + 9, 2 + 8, 3 + 7, 4 + 6, 5 + 5 (and the turn-arounds).' } },
          { q: 'How does 3 + 7 = 10 help with 30 + 70?', lines: { n: 2, key: '3 tens and 7 tens make 10 tens, which is 100.' } },
          { q: '{b} says 6 + 3 = 10. What went wrong?', lines: { n: 2, key: '6 + 3 = 9. 6 needs 4 to make 10.' } },
          { q: 'Draw a ten frame for 8 + 2.', draw: { h: 50, key: ['tenframe', { a: 8, b: 2 }] } }]
      }
    },

    bridge: {
      watch: 'counting on by ones from 8. Ask: "How many more make 10?" Move that many, then add what is left.',
      goal: 'I can make a ten to add.',
      learn: {
        show: { pic: ['tenframe', { a: 9, b: 5 }], cap: 'Move 1 to make 10', eq: ['9 + 5 = 10 + 4', '9 + 5 = 14'] },
        together: [MK(9, 3), MK(8, 5)],
        cue: 'Fill the ten first. Then add what is left.',
        own: [MK(9, 6), MK(8, 4), F([[7, '+', 5], [8, '+', 7]]), F([[9, '+', 4], [6, '+', 5]])]
      },
      p1: {
        show: { pic: ['tenframe', { a: 8, b: 3 }], cap: '8 needs 2 more', eq: ['8 + 3 = 10 + 1 = 11'] },
        items: [MK(9, 2), MK(9, 7), MK(8, 6), MK(7, 4), F([[6, '+', 5], [8, '+', 8]]), F([[9, '+', 3], [7, '+', 6]])]
      },
      p2: {
        items: [{ eq: ['9 + 8 = 10 + [] = []'], a: [7, 17], wide: true }, { eq: ['7 + 6 = 10 + [] = []'], a: [3, 13], wide: true },
          FA([[9, '+', 4], [8, '+', 5], [7, '+', 7], [9, '+', 9], [6, '+', 8], [7, '+', 8]]),
          story('{a} has 9 {many} and finds 7 more. How many now?', '{many}', 16, '9 + 7'), story('{b} has 8 {many} and gets 6 more. How many now?', '{many}', 14, '8 + 6')]
      },
      p3: {
        items: [FA([[9, '+', 5], [8, '+', 7], [6, '+', 9], [7, '+', 9], [5, '+', 8], [8, '+', 4], [9, '+', 6], [7, '+', 5], [6, '+', 6]]),
          { eq: ['19 + 5 = 20 + [] = []'], a: [4, 24], wide: true }, { eq: ['28 + 6 = 30 + [] = []'], a: [4, 34], wide: true },
          story('{a} has 8 {many}. {b} gives {a} 9 more. How many now?', '{many}', 17, '8 + 9')]
      },
      think: {
        items: [{ q: 'Show how to make a ten for 7 + 8. Draw ten frames.', draw: { h: 60, key: ['tenframe', { a: 10, b: 5 }] } },
          { q: '{a} says 9 + 6 is 10 + 6. What went wrong?', lines: { n: 2, key: 'Moving 1 to the 9 leaves 5, so it is 10 + 5 = 15.' } },
          { q: 'Why is it easy to add to 10?', lines: { n: 2, key: 'Ten and a number is just the teen: 10 + 4 = 14.' } },
          { q: 'Which is easier to make a ten with: 9 + 4 or 6 + 5? Why?', lines: { n: 2, key: '9 + 4: 9 needs only 1 more to make 10.' } }]
      }
    },

    dbl: {
      watch: 'mixing up doubles and counting by twos. A double is the same number twice: 7 + 7.',
      goal: 'I know my doubles.',
      learn: {
        show: { pic: ['groups', { g: 2, k: 6 }], cap: '6 and 6', eq: ['6 + 6 = 12'] },
        together: [{ pic: ['groups', { g: 2, k: 4 }], eq: ['4 + 4 = []'], a: [8] }, { pic: ['groups', { g: 2, k: 7 }], eq: ['7 + 7 = []'], a: [14] }],
        cue: 'A double is a number added to itself.',
        own: [{ pic: ['groups', { g: 2, k: 5 }], eq: ['5 + 5 = []'], a: [10] }, { pic: ['groups', { g: 2, k: 8 }], eq: ['8 + 8 = []'], a: [16] }, F([[3, '+', 3]]), F([[9, '+', 9]])]
      },
      p1: {
        show: { pic: ['groups', { g: 2, k: 3 }], cap: '3 and 3', eq: ['3 + 3 = 6'] },
        items: [F([[2, '+', 2]]), F([[6, '+', 6]]), F([[4, '+', 4]]), F([[8, '+', 8]]), { pic: ['groups', { g: 2, k: 9 }], eq: ['9 + 9 = []'], a: [18] }, { pic: ['groups', { g: 2, k: 10 }], eq: ['10 + 10 = []'], a: [20] }]
      },
      p2: {
        items: [FA([[7, '+', 7], [5, '+', 5], [9, '+', 9], [6, '+', 6], [8, '+', 8], [4, '+', 4]]),
          { eq: ['[] + [] = 14'], a: [7, 7] }, { eq: ['[] + [] = 18'], a: [9, 9] },
          story('{a} has 2 {conts} with 6 {many} in each. How many {many}?', '{many}', 12, '6 + 6'), TF('8 + 8 = 18', false)]
      },
      p3: {
        items: [FA([[10, '+', 10], [20, '+', 20], [30, '+', 30], [15, '+', 15], [25, '+', 25], [50, '+', 50]]),
          { eq: ['16 − 8 = []'], a: [8] }, { eq: ['14 − 7 = []'], a: [7] },
          story('{b} has 9 {many}. {a} has the same. How many in all?', '{many}', 18, '9 + 9'), TF('6 + 6 = 12', true)]
      },
      think: {
        items: [{ q: 'Is a double always even? Try 3 + 3, 5 + 5 and 7 + 7.', lines: { n: 2, key: 'Yes. 6, 10, 14: each has a partner for every one.' } },
          { q: 'How does 6 + 6 help with 12 − 6?', lines: { n: 2, key: '6 and 6 make 12, so 12 take away 6 leaves 6.' } },
          { q: 'Draw a double you see in real life.', draw: { h: 70, key: 'For example: 5 fingers on each hand, or egg cartons with 6 and 6.' } },
          { q: 'Use 7 + 7 to work out 70 + 70.', lines: { n: 1, key: '7 tens and 7 tens is 14 tens: 140.' } }]
      }
    },

    near: {
      watch: 'adding the extra 1 twice (7 + 8 = 7 + 7 + 2). Find the double, then add only the difference.',
      goal: 'I can use doubles to add.',
      learn: {
        show: { cap: '7 + 8 is one more than 7 + 7', eq: ['7 + 7 = 14', '7 + 8 = 15'] },
        together: [DB(6, 7), DB(5, 6)],
        cue: 'Find the double you know. Then add the one extra.',
        own: [DB(8, 9), DB(4, 5), DB(3, 4), F([[6, '+', 6], [9, '+', 9]])]
      },
      p1: {
        show: { cap: 'Double, then one more', eq: ['6 + 7 = 6 + 6 + 1 = 13'] },
        items: [F([[5, '+', 5], [8, '+', 8]]), F([[4, '+', 4], [7, '+', 7]]), DB(5, 6), DB(8, 9), DB(4, 5), DB(6, 7)]
      },
      p2: {
        items: [DB(7, 8), DB(9, 10), FA([[6, '+', 7], [8, '+', 9], [5, '+', 6], [7, '+', 8], [4, '+', 5], [9, '+', 8]]),
          story('{a} has 8 {many}. {b} has 1 more than {a}. How many in all?', '{many}', 17, '8 + 8 + 1'), TF('7 + 8 = 7 + 7 + 1', true)]
      },
      p3: {
        items: [FA([[9, '+', 8], [6, '+', 7], [8, '+', 7], [5, '+', 4], [7, '+', 6], [9, '+', 10]]),
          { eq: ['8 + 9 = 9 + 9 − [] = []'], a: [1, 17], wide: true }, { eq: ['20 + 21 = []'], a: [41] }, { eq: ['50 + 51 = []'], a: [101] },
          story('{b} has 6 {many}. {a} has 7. How many in all?', '{many}', 13, '6 + 7')]
      },
      think: {
        items: [{ q: '{b} says 6 + 7 = 6 + 6 + 2. What went wrong?', lines: { n: 2, key: '7 is only 1 more than 6. It is 6 + 6 + 1 = 13.' } },
          { q: 'Which double helps with 8 + 9? Is there more than one?', lines: { n: 2, key: '8 + 8 then add 1, or 9 + 9 then take 1 away. Both give 17.' } },
          { q: 'Draw 5 + 6 as a double and one more.', draw: { h: 60, key: 'Two rows of 5, and 1 more: 11.' } },
          { q: 'Use a double to work out 15 + 16.', lines: { n: 2, key: '15 + 15 = 30, then 1 more: 31.' } }]
      }
    },

    takeaway: {
      watch: 'adding instead of taking away. Cross out the ones that go, then count what is left.',
      goal: 'I can take away to subtract.',
      learn: {
        show: { pic: ['dots', { t: 9 }], cap: 'Cross out 4. Count what is left.', eq: ['9 − 4 = 5'] },
        together: [TA(8, 3), TA(12, 5)],
        cue: '− means take away. Cross out, then count what is left.',
        own: [TA(7, 2), TA(10, 6), TA(13, 4), TA(15, 7)]
      },
      p1: {
        show: { pic: ['dots', { t: 6 }], cap: 'Take away 2', eq: ['6 − 2 = 4'] },
        items: [TA(9, 3), TA(11, 2), TA(14, 5), TA(12, 8), TA(16, 6), TA(10, 4)]
      },
      p2: {
        items: [FA([[9, '−', 5], [12, '−', 2], [15, '−', 5], [11, '−', 3], [14, '−', 4], [13, '−', 6]]),
          story('{a} has 12 {many}. {a} gives away 5. How many are left?', '{many}', 7, '12 − 5'), story('There are 16 {many} in a {cont}. {b} takes 7. How many are left?', '{many}', 9, '16 − 7'),
          { eq: ['17 − [] = 10'], a: [7] }, TF('11 − 4 = 7', true)]
      },
      p3: {
        items: [FA([[18, '−', 9], [14, '−', 6], [17, '−', 8], [15, '−', 9], [13, '−', 5], [16, '−', 8], [20, '−', 6], [19, '−', 7], [12, '−', 9]]),
          { eq: ['[] − 6 = 8'], a: [14] }, story('{a} has 20 {many} and uses 11. How many are left?', '{many}', 9, '20 − 11'),
          { eq: ['50 − 20 = []'], a: [30] }, TF('13 − 7 = 5', false)]
      },
      think: {
        items: [{ q: '{a} says 9 − 4 = 13. What went wrong?', lines: { n: 2, key: '{a} added. Taking 4 away from 9 leaves 5.' } },
          { q: 'Draw 15 − 6. Cross out what goes.', draw: { h: 60, key: '15 dots with 6 crossed out: 9 left.' } },
          { q: 'Can you take 8 away from 5 {many}? Why?', lines: { n: 2, key: 'No. There are only 5, so you cannot take 8 away.' } },
          { q: 'Write a take-away story for 14 − 5.', lines: { n: 3, key: 'For example: {b} had 14 {many} and lost 5. 9 were left.' } }]
      }
    },

    difference: {
      watch: 'adding the two numbers. "How many more?" asks for the gap: count up from the smaller to the bigger.',
      goal: 'I can find how many more.',
      learn: {
        show: { cap: 'Count up from 9 to 13: 4 jumps', eq: ['9 + 4 = 13', '13 − 9 = 4'] },
        together: [UP(12, 8), UP(15, 11)],
        cue: 'Count up from the smaller number to the bigger one.',
        own: [UP(10, 7), UP(14, 9), TH(17, 13), TH(16, 10)]
      },
      p1: {
        show: { cap: '11 is 3 more than 8', eq: ['11 − 8 = 3'] },
        items: [UP(9, 6), UP(13, 10), UP(12, 9), UP(18, 15), TH(14, 12), TH(20, 16)]
      },
      p2: {
        items: [story('{a} has 13 {many}. {b} has 8. How many more does {a} have?', '{many}', 5, '13 − 8'), story('{b} has 7 {many}. {a} has 15. How many more does {a} have?', '{many}', 8, '15 − 7'),
          FA([[14, '−', 11], [17, '−', 15], [12, '−', 9], [16, '−', 13], [19, '−', 16], [11, '−', 7]]),
          PM('{a} has 9 {many}. {b} has 4 more than {a}. How many does {b} have?', '{many}', 9, '+', 4), PM('{a} has 16 {many}. {b} has 10. How many fewer does {b} have?', '{many}', 16, '−', 10)]
      },
      p3: {
        items: [story('{a} has 18 {many}. {b} has 9. How many more does {a} have?', '{many}', 9, '18 − 9'), story('{b} has 20 {many}. {a} has 14. How many fewer does {a} have?', '{many}', 6, '20 − 14'),
          PM('A {cont} holds 12 {many}. Another holds 5 more. How many in the second?', '{many}', 12, '+', 5), PM('{a} wants 17 {many} and has 9. How many more does {a} need?', '{many}', 17, '−', 9),
          { eq: ['50 − 47 = []'], a: [3] }, { eq: ['100 − 98 = []'], a: [2] }]
      },
      think: {
        items: [{ q: '{b} says 12 is 20 more than 8. What went wrong?', lines: { n: 2, key: '{b} added 12 and 8. 12 is 4 more than 8.' } },
          { q: 'Show how many more 14 is than 9 on a number line.', draw: { h: 60, key: ['nl', { min: 0, max: 20, tick: 1, lab: 5, jumps: [[9, 14, '+5']] }] } },
          { q: 'Why is counting up easy for 51 − 49?', lines: { n: 2, key: 'They are close: 49 to 50 is 1, 50 to 51 is 1, so 2.' } },
          { q: 'Write a "how many more" story for 16 − 12.', lines: { n: 3, key: 'For example: {a} has 16 {many}, {b} has 12. {a} has 4 more.' } }]
      }
    },

    thinkadd: {
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
          { eq: ['[] − 7 = 6'], a: [13] }, { eq: ['[] − 9 = 9'], a: [18] },
          { q: '15 − 6 = 9. Check it with addition.', eq: ['9 + 6 = []'], a: [15] }, TF('12 − 9 = 3', true)]
      },
      think: {
        items: [{ q: 'How does 9 + 6 = 15 help you with 15 − 9?', lines: { n: 2, key: '9 and 6 make 15, so taking 9 from 15 leaves 6.' } },
          { q: '{b} counted back for 17 − 9 and got 9. What went wrong?', lines: { n: 2, key: '9 + 8 = 17, so 17 − 9 = 8. {b} counted 17 as a step.' } },
          { q: 'Write a subtraction you can solve with 8 + 5 = 13.', lines: { n: 1, key: '13 − 8 = 5 or 13 − 5 = 8.' } },
          { q: 'How can you check 16 − 7 = 9?', lines: { n: 2, key: 'Add back: 9 + 7 = 16, so it is right.' } }]
      }
    },

    family: {
      watch: 'subtracting the wrong way (5 − 13). The biggest number comes first when you subtract.',
      goal: 'I can use one fact to find four.',
      learn: {
        show: { cap: '8, 5 and 13', eq: ['8 + 5 = 13   5 + 8 = 13', '13 − 8 = 5   13 − 5 = 8'] },
        together: [FOUR(6, 3), FOUR(7, 9)],
        cue: 'Three numbers, four facts. The biggest is the whole.',
        own: [FOUR(4, 8), FOUR(9, 5)]
      },
      p1: {
        show: { cap: '2, 7 and 9', eq: ['2 + 7 = 9, 9 − 7 = 2'] },
        items: [FOUR(3, 5), FOUR(6, 8), FOUR(2, 9), FOUR(7, 4)]
      },
      p2: {
        items: [FOUR(8, 9), FOUR(6, 7), { eq: ['7 + [] = 15', '15 − [] = 7'], a: [8, 8] }, { eq: ['[] + 9 = 16', '16 − 9 = []'], a: [7, 7] },
          { q: 'Circle the fact that is wrong.', pick: { opts: ['11 − 4 = 7', '11 − 7 = 5', '4 + 7 = 11'], ans: 1 }, odd: true, wide: true }]
      },
      p3: {
        items: [FOUR(9, 9), FOUR(5, 12), FOUR(30, 50),
          { q: 'Circle the fact that is wrong.', pick: { opts: ['8 + 6 = 14', '14 − 8 = 6', '14 − 6 = 9'], ans: 2 }, odd: true, wide: true }]
      },
      think: {
        items: [{ q: 'Why does the family of 6, 6 and 12 have only two facts?', lines: { n: 2, key: 'Turning 6 + 6 around gives the same fact. So: 6 + 6 = 12 and 12 − 6 = 6.' } },
          { q: '{a} wrote 5 − 13 = 8. What went wrong?', lines: { n: 2, key: 'The whole comes first: 13 − 5 = 8.' } },
          { q: 'Draw a picture for the family 3, 8 and 11.', draw: { h: 70, key: '3 dots and 8 dots make 11: 3 + 8, 8 + 3, 11 − 3, 11 − 8.' } },
          { q: 'Make your own fact family. Write all four facts.', lines: { n: 3, key: 'For example: 5 + 9 = 14, 9 + 5 = 14, 14 − 5 = 9, 14 − 9 = 5.' } }]
      }
    },

    story: {
      watch: 'adding every two numbers in a story. Ask: do I know both parts (add), or the whole and one part (subtract)?',
      goal: 'I can solve story problems.',
      learn: {
        show: { cap: '15 in all, 6 are big. How many are small?', eq: ['the whole and a part: subtract', '15 − 6 = 9'] },
        together: [PM('{a} has 7 {many}. {b} gives {a} 6 more. How many now?', '{many}', 7, '+', 6), PM('There are 14 {many}. 5 roll away. How many are left?', '{many}', 14, '−', 5)],
        cue: 'Both parts: add. The whole and one part: subtract.',
        own: [PM('{b} has 9 {many} and finds 8 more. How many now?', '{many}', 9, '+', 8), PM('{a} had 16 {many} and gave away 7. How many are left?', '{many}', 16, '−', 7)]
      },
      p1: {
        show: { cap: 'Both parts are known', eq: ['8 + 5 = 13'] },
        items: [PM('{a} has 6 {many}. {a} gets 7 more. How many now?', '{many}', 6, '+', 7), PM('There are 11 {many}. 3 are taken. How many are left?', '{many}', 11, '−', 3),
          PM('{b} has 8 {many} in one {cont} and 8 in another. How many in all?', '{many}', 8, '+', 8), PM('{a} had 15 {many}. 9 got lost. How many are left?', '{many}', 15, '−', 9),
          PM('{b} has 4 {many}. {a} has 9. How many more does {a} have?', '{many}', 9, '−', 4), PM('{a} picks 7 {many}, then 5 more. How many now?', '{many}', 7, '+', 5)]
      },
      p2: {
        items: [PM('{a} has 13 {many}. 6 are big. How many are small?', '{many}', 13, '−', 6), PM('{b} had some {many}. {b} found 8 more and now has 17. How many did {b} have?', '{many}', 17, '−', 8),
          PM('There are 9 {many} on a shelf and 9 more in a {cont}. How many in all?', '{many}', 9, '+', 9), PM('{a} needs 18 {many} and has 10. How many more?', '{many}', 18, '−', 10),
          { q: 'Write a story for 12 − 5.', lines: { n: 2, key: 'For example: {b} had 12 {many} and gave 5 away. 7 were left.' }, wide: true }]
      },
      p3: {
        items: [PM('{a} gave away 6 {many} and has 8 left. How many did {a} have?', '{many}', 8, '+', 6), PM('{b} has 7 {many}. {a} has 6 more than {b}. How many does {a} have?', '{many}', 7, '+', 6),
          PM('A {cont} holds 20 {many}. 12 are in it. How many more fit?', '{many}', 20, '−', 12), PM('{a} has 14 {many}. {b} has 9. How many fewer does {b} have?', '{many}', 14, '−', 9),
          { q: 'Write a story for 9 + 6.', lines: { n: 2, key: 'For example: {a} had 9 {many} and got 6 more. Now {a} has 15.' }, wide: true }]
      },
      think: {
        items: [{ q: '"{a} has 15 {many}. 6 are red." {b} added and got 21. What went wrong?', lines: { n: 2, key: '15 is the whole, so subtract: 15 − 6 = 9 are not red.' } },
          { q: 'Draw a bar to show: 17 in all, 8 in one part.', draw: { h: 60, key: 'A bar of 17 split into 8 and 9.' } },
          { q: 'Make up a story where you add 3 numbers.', lines: { n: 3, key: 'For example: 4 {many}, then 5, then 6 more: 4 + 5 + 6 = 15.' } },
          { q: 'How do you know when to subtract in a story?', lines: { n: 2, key: 'When you know the whole and one part, or need how many more.' } }]
      }
    }
  } });
})();
