/* Grade 1 Adding and Subtracting to 10: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per
   idea of the lessons in chapters/add-sub-10.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made
   at random, so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.1 properties of addition and subtraction and how they are related; B2.2 addition facts to 10 and the
   related subtraction facts. Most questions are typed-in facts, with pictures fading from Learn to Practise 3.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* a ten frame with a dark and b white counters: the sum */
  function AF(a, b) { return { pic: ['frame', { n: a, b: b }], eq: [a + ' + ' + b + ' = []'], a: [a + b] }; }
  /* a ten frame with n counters, k crossed out: the difference */
  function SF(n, k) { return { pic: ['frame', { n: n, x: k }], eq: [n + ' − ' + k + ' = []'], a: [n - k] }; }
  /* plain facts in a block of rows: list of [a, op, b]; 'first' or 'mid' puts the box elsewhere */
  function FA(list, cols) {
    var eq = [], a = [];
    list.forEach(function (f) {
      var r = f[1] === '+' ? f[0] + f[2] : f[0] - f[2];
      if (f[3] === 'mid') { eq.push(f[0] + ' ' + f[1] + ' [] = ' + r); a.push(f[2]); }
      else if (f[3] === 'first') { eq.push('[] ' + f[1] + ' ' + f[2] + ' = ' + r); a.push(f[0]); }
      else { eq.push(f[0] + ' ' + f[1] + ' ' + f[2] + ' = []'); a.push(r); }
    });
    return { eq: eq, a: a, cols: cols || 1, wide: (cols || 1) > 1 };
  }
  /* count on (or back) with jumps on a 0 to 10 line */
  function JN(a, b) { var j = []; for (var i = 0; i < b; i++) j.push([a + i, a + i + 1]); return { pic: ['nl', { min: 0, max: 10, tick: 1, lab: 1, pt: a, jumps: j }], eq: [a + ' + ' + b + ' = []'], a: [a + b] }; }
  function JB(a, b) { var j = []; for (var i = 0; i < b; i++) j.push([a - i, a - i - 1]); return { pic: ['nl', { min: 0, max: 10, tick: 1, lab: 1, pt: a, jumps: j }], eq: [a + ' − ' + b + ' = []'], a: [a - b] }; }
  /* the four facts of a fact family */
  function FAM(x, y) { var t = x + y; return { q: 'Use ' + x + ', ' + y + ' and ' + t + '.', eq: [x + ' + ' + y + ' = []', y + ' + ' + x + ' = []', t + ' − ' + x + ' = []', t + ' − ' + y + ' = []'], a: [t, t, y, x] }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  /* add or take away? the sign is checked against the story's sum */
  function OP(q, unit, ans, calc) { return { q: q, pick: { opts: ['+', '−'], ans: /\+/.test(calc) ? 0 : 1 }, calc: calc, eq: ['[] ' + unit], a: [ans] }; }

  S.register('add-sub-10', { code: 'A10', ideas: {

    join: {
      watch: 'counting only one group. Count all the counters, dark and white, to find how many in all.',
      goal: 'I can add by putting two groups together.',
      learn: {
        show: { pic: ['frame', { n: 3, b: 2 }], cap: '3 and 2 more', eq: ['3 + 2 = 5'] },
        together: [AF(2, 2), AF(4, 3)],
        cue: 'Put the groups together. Count them all.',
        own: [AF(1, 3), AF(5, 2), AF(3, 4), AF(6, 3)]
      },
      p1: { show: { pic: ['frame', { n: 4, b: 1 }], eq: ['4 + 1 = 5'] }, items: [AF(2, 1), AF(3, 3), AF(5, 1), AF(2, 6), AF(4, 4), AF(7, 2)] },
      p2: { items: [AF(1, 6), AF(5, 4), AF(3, 5), AF(6, 4), FA([[2, '+', 3], [4, '+', 2]]), FA([[5, '+', 3], [1, '+', 7]])] },
      p3: { items: [FA([[3, '+', 6], [2, '+', 5], [4, '+', 5], [6, '+', 2], [1, '+', 8], [7, '+', 3]], 3), FA([[5, '+', 5], [2, '+', 7], [3, '+', 2], [8, '+', 1], [4, '+', 6], [6, '+', 3]], 3), story('{a} has 4 {many}. {b} has 3. How many in all?', '{many}', 7, '4 + 3'), story('5 {many} are in a {cont}. 4 more go in. How many now?', '{many}', 9, '5 + 4')] },
      think: {
        items: [{ q: 'Draw 3 + 5 in the ten frame.', pic: ['frame', { n: 0 }], draw: { h: 20, key: '3 dark counters and 5 white ones: 8 in all.' } },
          { q: '{b} says 4 + 2 = 5. Is {b} right?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '4 + 2 = 5' },
          { q: 'Write a story for 2 + 6.', lines: { n: 2, key: 'For example: {a} has 2 {many} and gets 6 more. Now {a} has 8.' } },
          { q: 'Find two numbers that add to 9.', lines: { n: 1, key: 'For example: 4 and 5, 6 and 3, 9 and 0.' } }]
      }
    },

    'count-on': {
      watch: 'starting at the smaller number, or counting the start number again. Say the bigger number, then count on.',
      goal: 'I can add by counting on from the bigger number.',
      learn: {
        show: { pic: ['nl', { min: 0, max: 10, tick: 1, lab: 1, pt: 6, jumps: [[6, 7], [7, 8]] }], cap: 'Start at 6. Count on 2.', eq: ['6 + 2 = 8'] },
        together: [JN(5, 3), JN(7, 2)],
        cue: 'Start with the bigger number in your head. Count on the smaller one.',
        own: [JN(4, 2), JN(6, 3)]
      },
      p1: { show: { eq: ['7 + 3: 8, 9, 10'] }, items: [JN(2, 3), JN(5, 2), JN(6, 4), JN(1, 2), JN(7, 1), JN(4, 3)] },
      p2: { items: [FA([[8, '+', 2], [2, '+', 8]]), FA([[6, '+', 1], [1, '+', 6]]), FA([[7, '+', 3], [3, '+', 7]]), FA([[5, '+', 2], [2, '+', 5]]), FA([[9, '+', 1], [1, '+', 9]]), FA([[6, '+', 3], [3, '+', 6]])] },
      p3: { items: [FA([[2, '+', 7], [1, '+', 5], [3, '+', 6], [8, '+', 2], [2, '+', 4], [1, '+', 8]], 3), FA([[3, '+', 5], [2, '+', 6], [4, '+', 3], [1, '+', 7], [3, '+', 4], [2, '+', 8]], 3), story('{a} has 7 {many}. {b} gives {a} 2 more. How many now?', '{many}', 9, '7 + 2'), story('A {cont} has 2 {many}. 6 more go in. How many?', '{many}', 8, '2 + 6')] },
      think: {
        items: [{ q: 'For 2 + 7, why start at 7?', lines: { n: 2, key: 'Counting on 2 from 7 is quicker than counting on 7 from 2.' } },
          { q: '{a} counts 5 + 3 as 5, 6, 7. What went wrong?', lines: { n: 2, key: '{a} said 5 again. Start at 5 and count 6, 7, 8. The answer is 8.' } },
          JN(6, 4),
          { q: 'Circle the one where you start at 8.', pick: { opts: ['3 + 2', '1 + 8', '4 + 3'], ans: 1, val: 9 } }]
      }
    },

    missing: {
      watch: 'adding the two numbers shown (4 + [] = 7 answered as 11). Count on from 4 to 7 and count the jumps.',
      goal: 'I can find a missing number in a sum.',
      learn: {
        show: { pic: ['frame', { n: 4, b: 3 }], cap: 'From 4, count on to 7', eq: ['4 + 3 = 7'] },
        together: [{ pic: ['frame', { n: 5, b: 3 }], eq: ['5 + [] = 8'], a: [3] }, { pic: ['frame', { n: 2, b: 4 }], eq: ['2 + [] = 6'], a: [4] }],
        cue: 'Count on from the first number to the total. Count your jumps.',
        own: [{ pic: ['frame', { n: 6, b: 1 }], eq: ['6 + [] = 7'], a: [1] }, { pic: ['frame', { n: 3, b: 4 }], eq: ['3 + [] = 7'], a: [4] }, FA([[4, '+', 5, 'mid']]), FA([[7, '+', 2, 'mid']])]
      },
      p1: { show: { eq: ['5 + 2 = 7'] }, items: [FA([[3, '+', 2, 'mid']]), FA([[6, '+', 2, 'mid']]), FA([[1, '+', 4, 'mid']]), FA([[5, '+', 4, 'mid']]), FA([[2, '+', 6, 'mid']]), FA([[8, '+', 1, 'mid']])] },
      p2: { items: [FA([[3, '+', 5, 'first']]), FA([[2, '+', 7, 'first']]), FA([[4, '+', 4, 'mid']]), FA([[6, '+', 3, 'first']]), story('{a} has 5 {many}. {a} wants 9. How many more?', 'more', 4, '9 − 5'), story('{b} needs 8 {many}. {b} has 6. How many more?', 'more', 2, '8 − 6')] },
      p3: { items: [FA([[7, '+', 3, 'mid'], [2, '+', 5, 'first'], [4, '+', 6, 'mid'], [1, '+', 6, 'first'], [3, '+', 3, 'mid'], [5, '+', 5, 'first']], 3), FA([[6, '+', 4, 'first'], [2, '+', 8, 'mid'], [3, '+', 4, 'first'], [5, '+', 1, 'mid'], [4, '+', 3, 'mid'], [7, '+', 2, 'first']], 3), story('A {cont} holds 10 {many}. It has 7. How many more fit?', 'more', 3, '10 − 7'), story('{a} had some {many}. {b} gave {a} 4. Now {a} has 9. How many did {a} have?', '{many}', 5, '9 − 4')] },
      think: {
        items: [{ q: '{b} says 3 + [] = 8 is 11. What went wrong?', lines: { n: 2, key: '{b} added 3 and 8. Count on from 3 to 8: the answer is 5.' } },
          { q: 'Fill in two ways.', eq: ['[] + [] = 6', '[] + [] = 6'], a: [2, 4, 5, 1], wide: true },
          { q: 'Write a story for 4 + [] = 10.', lines: { n: 2, key: 'For example: {a} has 4 {many} and needs 10. How many more? 6.' } },
          FA([[6, '+', 3, 'mid']])]
      }
    },

    pairs: {
      watch: 'not seeing the turn-around pairs. 3 and 7 and 7 and 3 both make 10.',
      goal: 'I can name the pairs that make 10.',
      learn: {
        show: { pic: ['frame', { n: 6, b: 4 }], cap: '6 dark and 4 white', eq: ['6 + 4 = 10'] },
        together: [{ pic: ['frame', { n: 7, b: 3 }], eq: ['7 + [] = 10'], a: [3] }, { pic: ['frame', { n: 2, b: 8 }], eq: ['2 + [] = 10'], a: [8] }],
        cue: 'Two parts fill the ten frame. Learn each pair by heart.',
        own: [{ pic: ['frame', { n: 5, b: 5 }], eq: ['5 + [] = 10'], a: [5] }, { pic: ['frame', { n: 9, b: 1 }], eq: ['9 + [] = 10'], a: [1] }, FA([[4, '+', 6, 'mid']]), FA([[1, '+', 9, 'mid']])]
      },
      p1: { show: { eq: ['8 + 2 = 10'] }, items: [FA([[3, '+', 7, 'mid']]), FA([[6, '+', 4, 'mid']]), FA([[8, '+', 2, 'mid']]), FA([[0, '+', 10, 'mid']]), FA([[2, '+', 8, 'mid']]), FA([[7, '+', 3, 'mid']])] },
      p2: { items: [FA([[4, '+', 6, 'first']]), FA([[9, '+', 1, 'first']]), { q: 'Circle the pair that makes 10.', pick: { opts: ['4 + 5', '3 + 7', '6 + 3'], ans: 1, val: 10 }, wide: true }, { q: 'Circle the pair that makes 10.', pick: { opts: ['2 + 7', '5 + 4', '8 + 2'], ans: 2, val: 10 }, wide: true }, FA([[5, '+', 5, 'first']]), FA([[1, '+', 9, 'mid']])] },
      p3: { items: [FA([[3, '+', 7, 'first'], [6, '+', 4, 'mid'], [8, '+', 2, 'first'], [1, '+', 9, 'mid'], [5, '+', 5, 'mid'], [4, '+', 6, 'first']], 3), story('{a} has 10 {many}. 6 are in a {cont}. How many are out?', '{many}', 4, '10 − 6'), story('{b} needs 10 {many}. {b} has 3. How many more?', 'more', 7, '10 − 3'), TF('7 + 4 = 10', false), TF('2 + 8 = 10', true)] },
      think: {
        items: [{ q: 'Write all the pairs that make 10.', lines: { n: 2, key: '0 + 10, 1 + 9, 2 + 8, 3 + 7, 4 + 6, 5 + 5, and the turn-arounds.' }, wide: true },
          { q: 'Why does 5 + 5 have no turn-around?', lines: { n: 2, key: 'Both parts are 5, so turning it round gives the same sum.' } },
          { q: 'Circle the pair that does not make 10.', pick: { opts: ['6 + 4', '3 + 6', '9 + 1'], ans: 1, diff: true } },
          { q: 'Use a pair of 10 to find 10 − 8.', eq: ['8 + [] = 10', '10 − 8 = []'], a: [2, 2] }]
      }
    },

    'how-many': {
      watch: 'counting the counters instead of the gaps. Count the empty boxes to find how many more make 10.',
      goal: 'I can find how many more make 10.',
      learn: {
        show: { pic: ['frame', { n: 6 }], cap: '4 empty boxes', eq: ['6 + 4 = 10'] },
        together: [{ pic: ['frame', { n: 8 }], eq: ['8 + [] = 10'], a: [2] }, { pic: ['frame', { n: 3 }], eq: ['3 + [] = 10'], a: [7] }],
        cue: 'Count the empty boxes. That is how many more make 10.',
        own: [{ pic: ['frame', { n: 5 }], eq: ['5 + [] = 10'], a: [5] }, { pic: ['frame', { n: 9 }], eq: ['9 + [] = 10'], a: [1] }, { pic: ['frame', { n: 4 }], eq: ['4 + [] = 10'], a: [6] }, { pic: ['frame', { n: 7 }], eq: ['7 + [] = 10'], a: [3] }]
      },
      p1: { show: { pic: ['frame', { n: 7 }], eq: ['7 + 3 = 10'] }, items: [{ pic: ['frame', { n: 2 }], eq: ['2 + [] = 10'], a: [8] }, { pic: ['frame', { n: 6 }], eq: ['6 + [] = 10'], a: [4] }, { pic: ['frame', { n: 1 }], eq: ['1 + [] = 10'], a: [9] }, { pic: ['frame', { n: 8 }], eq: ['8 + [] = 10'], a: [2] }, { pic: ['frame', { n: 5 }], eq: ['5 + [] = 10'], a: [5] }, { pic: ['frame', { n: 3 }], eq: ['3 + [] = 10'], a: [7] }] },
      p2: { items: [story('{a} has 6 {many}. How many more make 10?', 'more', 4, '10 − 6'), story('{b} has 8 {many}. How many more make 10?', 'more', 2, '10 − 8'), story('A {cont} holds 10. It has 5 {many}. How many more fit?', 'more', 5, '10 − 5'), story('{a} has 1 {one}. How many more make 10?', 'more', 9, '10 − 1'), FA([[3, '+', 7, 'mid']]), FA([[4, '+', 6, 'mid']])] },
      p3: { items: [FA([[2, '+', 8, 'mid'], [7, '+', 3, 'mid'], [9, '+', 1, 'mid'], [6, '+', 4, 'mid'], [0, '+', 10, 'mid'], [5, '+', 5, 'mid']], 3), story('{b} has read 7 pages of a 10 page book. How many pages are left?', 'pages', 3, '10 − 7'), story('10 {many} fit in a {cont}. {a} puts in 4. How many more fit?', 'more', 6, '10 − 4'), TF('3 + 6 = 10', false), TF('10 = 1 + 9', true)] },
      think: {
        items: [{ q: 'How does a ten frame help find 6 + [] = 10?', lines: { n: 2, key: 'Put 6 counters in. Count the empty boxes: 4.' } },
          { q: '{a} says 7 needs 4 more to make 10. Fix it.', eq: ['7 + [] = 10'], a: [3] },
          { q: 'A ten frame has 2 counters. How many more make 10?', eq: ['2 + [] = 10'], a: [8] },
          { q: 'Write a story where you need 5 more to make 10.', lines: { n: 2, key: 'For example: {b} has 5 {many} and needs 10. {b} needs 5 more.' } }]
      }
    },

    doubles: {
      watch: 'adding 1 to a double instead of doubling. A double is two of the same: 4 + 4.',
      goal: 'I can add doubles.',
      learn: {
        show: { pic: ['frame', { n: 3, b: 3 }], cap: '3 and 3 more', eq: ['3 + 3 = 6'] },
        together: [AF(2, 2), AF(4, 4)],
        cue: 'A double is two of the same. Learn them by heart.',
        own: [AF(1, 1), AF(5, 5), FA([[3, '+', 3]]), FA([[4, '+', 4]])]
      },
      p1: { show: { pic: ['frame', { n: 2, b: 2 }], eq: ['2 + 2 = 4'] }, items: [AF(1, 1), AF(3, 3), AF(5, 5), FA([[2, '+', 2]]), FA([[4, '+', 4]]), FA([[0, '+', 0]])] },
      p2: { items: [FA([[3, '+', 3], [5, '+', 5]]), FA([[4, '+', 4], [1, '+', 1]]), story('{a} has 4 {many} in each hand. How many?', '{many}', 8, '4 + 4'), story('2 {conts} have 5 {many} each. How many?', '{many}', 10, '5 + 5'), { eq: ['[] + [] = 6'], a: [3, 3], q: 'Make 6 as a double.' }, { eq: ['[] + [] = 8'], a: [4, 4], q: 'Make 8 as a double.' }] },
      p3: { items: [FA([[3, '+', 3], [4, '+', 4], [2, '+', 2], [5, '+', 5], [1, '+', 1], [0, '+', 0]], 3), { q: 'Use 3 + 3 to find 3 + 4.', eq: ['3 + 3 = []', '3 + 4 = []'], a: [6, 7] }, { q: 'Use 4 + 4 to find 4 + 5.', eq: ['4 + 4 = []', '4 + 5 = []'], a: [8, 9] }, story('{b} has 2 {conts} with 3 {many} in each. How many?', '{many}', 6, '3 + 3'), TF('4 + 4 = 9', false)] },
      think: {
        items: [{ q: 'Is 7 a double? Why?', lines: { n: 2, key: 'No. 7 cannot be split into two equal numbers.' } },
          { q: 'Circle the doubles.', pick: { opts: ['2 + 3', '5 + 5', '4 + 1'], ans: 1, val: 10 } },
          { q: 'How does 5 + 5 help with 5 + 4?', lines: { n: 2, key: '5 + 4 is 1 less than 5 + 5, so it is 9.' } },
          { q: 'Draw a double that makes 8.', draw: { h: 48, key: '4 and 4.' } }]
      }
    },

    turn: {
      watch: 'working out the turn-around again. 2 + 7 has the same total as 7 + 2.',
      goal: 'I can turn a sum around and get the same total.',
      learn: {
        show: { pic: ['frame', { n: 2, b: 5 }], cap: '2 + 5 and 5 + 2', eq: ['2 + 5 = 5 + 2 = 7'] },
        together: [FA([[3, '+', 6], [6, '+', 3]]), FA([[1, '+', 8], [8, '+', 1]])],
        cue: 'Turn the numbers around. The total stays the same.',
        own: [FA([[4, '+', 5], [5, '+', 4]]), FA([[2, '+', 7], [7, '+', 2]]), { eq: ['6 + 1 = 1 + []'], a: [6] }, { eq: ['3 + 4 = [] + 3'], a: [4] }]
      },
      p1: { show: { eq: ['4 + 2 = 2 + 4'] }, items: [{ eq: ['5 + 3 = 3 + []'], a: [5] }, { eq: ['2 + 6 = [] + 2'], a: [6] }, { eq: ['1 + 9 = 9 + []'], a: [1] }, { eq: ['7 + 3 = [] + 7'], a: [3] }, FA([[2, '+', 8], [8, '+', 2]]), FA([[3, '+', 5], [5, '+', 3]])] },
      p2: { items: [TF('4 + 3 = 3 + 4', true), TF('6 + 2 = 6 + 3', false), { eq: ['[] + 4 = 4 + 6'], a: [6] }, { eq: ['1 + 7 = [] + 1'], a: [7] }, { q: 'Circle the turn-around of 2 + 5.', pick: { opts: ['5 + 2', '2 + 3', '5 + 5'], ans: 0, val: 7 } }, FA([[1, '+', 6], [6, '+', 1]])] },
      p3: { items: [{ eq: ['2 + 7 = 7 + []', '3 + 6 = [] + 3'], a: [2, 6] }, { eq: ['8 + 1 = [] + 8', '4 + 5 = 5 + []'], a: [1, 4] }, TF('5 + 4 = 4 + 5', true), TF('7 + 1 = 7 + 2', false), story('{a} has 3 red {many} and 6 blue. How many {many}?', '{many}', 9, '3 + 6'), { eq: ['1 + 8 = []', '8 + 1 = []'], a: [9, 9] }] },
      think: {
        items: [{ q: 'Why is a turn-around fact helpful?', lines: { n: 2, key: 'If you know one, you know the other. You can start with the bigger number.' } },
          { q: 'Does 7 − 2 have the same answer as 2 − 7?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '7 − 2 = 2 − 7' },
          { q: 'Write a turn-around pair that makes 9.', lines: { n: 1, key: 'For example: 4 + 5 and 5 + 4.' } },
          { q: 'Draw 1 + 4 and 4 + 1. What do you see?', draw: { h: 48, key: 'Both make 5.' } }]
      }
    },

    zero: {
      watch: 'answering 0 + 6 as 0, or 6 − 0 as 0. Adding or taking away 0 changes nothing.',
      goal: 'I can add and take away zero.',
      learn: {
        show: { pic: ['frame', { n: 6 }], cap: '6 and 0 more', eq: ['6 + 0 = 6'] },
        together: [FA([[4, '+', 0]]), FA([[0, '+', 8]])],
        cue: 'Adding zero adds nothing. The number stays the same.',
        own: [FA([[3, '+', 0]]), FA([[0, '+', 5]]), FA([[7, '−', 0]]), FA([[9, '+', 0]])]
      },
      p1: { show: { eq: ['0 + 3 = 3'] }, items: [FA([[2, '+', 0]]), FA([[0, '+', 6]]), FA([[10, '+', 0]]), FA([[5, '−', 0]]), FA([[0, '+', 1]]), FA([[8, '−', 0]])] },
      p2: { items: [FA([[0, '+', 7], [4, '−', 0]]), FA([[6, '+', 0], [0, '+', 9]]), { eq: ['5 + [] = 5'], a: [0] }, { eq: ['[] + 0 = 3'], a: [3] }, { eq: ['8 − [] = 8'], a: [0] }, story('{a} has 7 {many}. {b} gives {a} 0 more. How many now?', '{many}', 7, '7 + 0')] },
      p3: { items: [FA([[0, '+', 4], [6, '−', 0], [9, '+', 0], [0, '+', 0], [3, '−', 3], [2, '+', 0]], 3), TF('5 + 0 = 0', false), TF('0 + 8 = 8', true), story('A {cont} has 6 {many}. 0 are taken out. How many are left?', '{many}', 6, '6 − 0'), { eq: ['7 − 7 = []'], a: [0] }] },
      think: {
        items: [{ q: '{b} says 0 + 4 = 0. What went wrong?', lines: { n: 2, key: 'Adding 0 does not change 4. 0 + 4 = 4.' } },
          { q: 'Write a story for 5 + 0.', lines: { n: 2, key: 'For example: {a} has 5 {many} and gets no more. Still 5.' } },
          { q: 'Circle the sum that is 6.', pick: { opts: ['6 + 0', '6 − 6', '0 + 0'], ans: 0, val: 6 } },
          { q: 'What is the same about 3 + 0 and 3 − 0?', lines: { n: 2, key: 'Both are 3. Zero does not change the number.' } }]
      }
    },

    take: {
      watch: 'counting the crossed-out counters. Count the ones that are left.',
      goal: 'I can subtract by taking away.',
      learn: {
        show: { pic: ['frame', { n: 7, x: 2 }], cap: '7, take away 2', eq: ['7 − 2 = 5'] },
        together: [SF(5, 1), SF(8, 3)],
        cue: 'Cross out the ones taken away. Count what is left.',
        own: [SF(4, 2), SF(6, 3), SF(9, 4), SF(10, 5)]
      },
      p1: { show: { pic: ['frame', { n: 6, x: 1 }], eq: ['6 − 1 = 5'] }, items: [SF(3, 1), SF(5, 2), SF(7, 4), SF(8, 2), SF(9, 6), SF(10, 3)] },
      p2: { items: [SF(6, 4), SF(9, 2), FA([[5, '−', 3], [8, '−', 4]]), FA([[7, '−', 1], [10, '−', 2]]), story('{a} has 8 {many}. {a} gives 3 away. How many are left?', '{many}', 5, '8 − 3'), story('There are 6 {many}. 2 roll away. How many are left?', '{many}', 4, '6 − 2')] },
      p3: { items: [FA([[9, '−', 3], [7, '−', 5], [10, '−', 4], [6, '−', 6], [8, '−', 1], [5, '−', 4]], 3), FA([[4, '−', 1], [9, '−', 7], [10, '−', 8], [7, '−', 3], [3, '−', 2], [8, '−', 5]], 3), story('{b} had 10 {many}. {b} lost 6. How many now?', '{many}', 4, '10 − 6'), story('A {cont} has 9 {many}. 5 are taken out. How many are in it?', '{many}', 4, '9 − 5')] },
      think: {
        items: [{ q: 'Draw 8 − 3. Cross out 3.', pic: ['frame', { n: 0 }], draw: { h: 20, key: '8 counters with 3 crossed out: 5 left.' } },
          { q: '{a} says 6 − 2 = 8. What went wrong?', lines: { n: 2, key: '{a} added. Take 2 away from 6: 4 are left.' } },
          { q: 'Write a story for 9 − 4.', lines: { n: 2, key: 'For example: {b} has 9 {many} and gives 4 away. 5 are left.' } },
          SF(10, 7)]
      }
    },

    back: {
      watch: 'counting the start number as the first jump. The first jump lands on the number before it.',
      goal: 'I can subtract by counting back.',
      learn: {
        show: { pic: ['nl', { min: 0, max: 10, tick: 1, lab: 1, pt: 8, jumps: [[8, 7], [7, 6]] }], cap: 'Start at 8. Count back 2.', eq: ['8 − 2 = 6'] },
        together: [JB(7, 3), JB(10, 2)],
        cue: 'Start at the big number. Jump back one at a time.',
        own: [JB(9, 3), JB(8, 4)]
      },
      p1: { show: { eq: ['9 − 3: 8, 7, 6'] }, items: [JB(4, 1), JB(7, 2), JB(10, 3), JB(6, 2), JB(9, 1), JB(5, 3)] },
      p2: { items: [FA([[8, '−', 1], [10, '−', 1]]), FA([[7, '−', 2], [9, '−', 2]]), FA([[6, '−', 3], [10, '−', 3]]), FA([[5, '−', 1], [8, '−', 3]]), story('{a} is on step 9. {a} goes down 3 steps. Which step now?', 'step', 6, '9 − 3'), story('{b} has 7 {many}. {b} eats 2. How many are left?', '{many}', 5, '7 − 2')] },
      p3: { items: [FA([[10, '−', 2], [6, '−', 1], [8, '−', 2], [9, '−', 3], [7, '−', 1], [4, '−', 2]], 3), FA([[3, '−', 1], [10, '−', 3], [5, '−', 2], [7, '−', 3], [9, '−', 1], [6, '−', 2]], 3), story('There are 10 {many}. 3 are sold. How many are left?', '{many}', 7, '10 − 3'), JB(8, 3)] },
      think: {
        items: [{ q: '{b} counts back 2 from 7: 7, 6. What went wrong?', lines: { n: 2, key: '{b} said 7 as a jump. Count 6, 5. The answer is 5.' } },
          { q: 'When is counting back a good plan?', lines: { n: 2, key: 'When you take away a small number, like 1, 2 or 3.' } },
          { q: 'Show 10 − 4 with jumps.', pic: ['nl', { min: 0, max: 10, tick: 1, lab: 1 }], draw: { h: 20, key: 'Four jumps back from 10 to 6.' } },
          FA([[9, '−', 2, 'mid']])]
      }
    },

    family: {
      watch: 'mixing the order in a take-away (3 − 7). In a take-away, the biggest number comes first.',
      goal: 'I can write the four facts of a fact family.',
      learn: {
        show: { pic: ['frame', { n: 3, b: 5 }], cap: '3, 5 and 8', eq: ['3 + 5 = 8, 5 + 3 = 8', '8 − 3 = 5, 8 − 5 = 3'] },
        together: [FAM(2, 4), FAM(1, 6)],
        cue: 'Three numbers, four facts. The biggest number is the total.',
        own: [FAM(3, 4), FAM(2, 7)]
      },
      p1: { show: { eq: ['2 + 3 = 5, 5 − 2 = 3'] }, items: [FAM(1, 3), FAM(2, 5), FAM(4, 5), FAM(3, 6)] },
      p2: { items: [FAM(1, 8), FAM(2, 6), FAM(3, 7), FAM(4, 6)] },
      p3: { items: [FAM(1, 9), FAM(2, 8), { q: 'Circle the one not in the family of 3, 4, 7.', pick: { opts: ['4 + 3', '7 − 4', '7 + 3'], ans: 2, val: 10 } }, TF('6 − 2 = 4', true), TF('3 + 5 = 7', false)] },
      think: {
        items: [{ q: 'Why does 5, 5, 10 have only two facts?', lines: { n: 2, key: '5 + 5 = 10 and 10 − 5 = 5. Turning them around gives the same facts.' } },
          { q: 'Make a fact family with 9.', lines: { n: 2, key: 'For example: 4 + 5 = 9, 5 + 4 = 9, 9 − 4 = 5, 9 − 5 = 4.' } },
          { q: '{b} wrote 4 − 9 = 5. Fix it.', eq: ['9 − 4 = []'], a: [5] },
          FAM(3, 5)]
      }
    },

    'think-add': {
      watch: 'counting back for a far take-away like 9 − 7. Think: 7 and what make 9?',
      goal: 'I can use adding to help me subtract.',
      learn: {
        show: { pic: ['frame', { n: 6, b: 3 }], cap: '6 and what make 9?', eq: ['9 − 6 = 3'] },
        together: [{ eq: ['5 + [] = 8', '8 − 5 = []'], a: [3, 3] }, { eq: ['7 + [] = 10', '10 − 7 = []'], a: [3, 3] }],
        cue: 'To find 9 − 6, think: 6 and what make 9?',
        own: [{ eq: ['4 + [] = 7', '7 − 4 = []'], a: [3, 3] }, { eq: ['6 + [] = 9', '9 − 6 = []'], a: [3, 3] }, { eq: ['2 + [] = 8', '8 − 2 = []'], a: [6, 6] }, { eq: ['5 + [] = 10', '10 − 5 = []'], a: [5, 5] }]
      },
      p1: { show: { eq: ['3 + 4 = 7, so 7 − 3 = 4'] }, items: [{ eq: ['3 + [] = 5', '5 − 3 = []'], a: [2, 2] }, { eq: ['6 + [] = 8', '8 − 6 = []'], a: [2, 2] }, { eq: ['4 + [] = 9', '9 − 4 = []'], a: [5, 5] }, { eq: ['8 + [] = 10', '10 − 8 = []'], a: [2, 2] }, { eq: ['1 + [] = 6', '6 − 1 = []'], a: [5, 5] }, { eq: ['7 + [] = 9', '9 − 7 = []'], a: [2, 2] }] },
      p2: { items: [FA([[9, '−', 7], [10, '−', 6]]), FA([[8, '−', 6], [7, '−', 5]]), FA([[10, '−', 9], [9, '−', 8]]), FA([[6, '−', 4], [8, '−', 7]]), { q: 'Check 9 − 5 = 4 by adding.', eq: ['4 + 5 = []'], a: [9] }, { q: 'Check 7 − 3 = 4 by adding.', eq: ['4 + 3 = []'], a: [7] }] },
      p3: { items: [FA([[10, '−', 7], [9, '−', 6], [8, '−', 5], [7, '−', 6], [10, '−', 8], [6, '−', 5]], 3), { q: 'Check 10 − 4 = 6 by adding.', eq: ['6 + 4 = []'], a: [10] }, { q: 'Is 8 − 3 = 6 right? Check by adding.', eq: ['6 + 3 = []'], a: [9], pick: { opts: ['right', 'wrong'], ans: 1 }, pickLast: true, tf: '8 − 3 = 6' }, story('{a} has 9 {many}. 7 are in a {cont}. How many are out?', '{many}', 2, '9 − 7'), story('{b} needs 10 {many}. {b} has 8. How many more?', 'more', 2, '10 − 8')] },
      think: {
        items: [{ q: 'How does 4 + 5 = 9 help with 9 − 5?', lines: { n: 2, key: '9 − 5 asks what goes with 5 to make 9. That is 4.' } },
          { q: 'Which is quicker for 10 − 8: count back or think add?', lines: { n: 2, key: 'Think add: 8 and 2 make 10, so the answer is 2.' } },
          { q: '{b} says 7 − 5 = 3. Check by adding.', eq: ['3 + 5 = []'], a: [8], pick: { opts: ['right', 'wrong'], ans: 1 }, pickLast: true, tf: '7 − 5 = 3' },
          FA([[8, '−', 4, 'mid']])]
      }
    },

    'story-join': {
      watch: 'taking away in a story where things come together. Look for "more", "joins", "in all": add.',
      goal: 'I can solve stories where groups join.',
      learn: {
        show: { pic: ['frame', { n: 4, b: 3 }], cap: '4 {many}, 3 more join', eq: ['4 + 3 = 7'] },
        together: [story('{a} has 5 {many}. {b} brings 2 more. How many now?', '{many}', 7, '5 + 2'), story('3 {many} are in a {cont}. 4 more go in. How many in all?', '{many}', 7, '3 + 4')],
        cue: 'More are coming. Add to find how many in all.',
        own: [story('{b} has 6 {many}. {b} gets 3 more. How many?', '{many}', 9, '6 + 3'), story('2 {many} are on a shelf. 5 more are put there. How many?', '{many}', 7, '2 + 5'), story('{a} has 4 {many} and {b} has 4. How many in all?', '{many}', 8, '4 + 4'), story('1 {one} is in a {cont}. 8 more go in. How many?', '{many}', 9, '1 + 8')]
      },
      p1: { show: { eq: ['2 + 6 = 8'] }, items: [story('{a} has 3 {many}. {a} finds 3 more. How many?', '{many}', 6, '3 + 3'), story('{b} has 7 {many}. {b} gets 1 more. How many?', '{many}', 8, '7 + 1'), story('5 {many} and 5 {many}. How many in all?', '{many}', 10, '5 + 5'), story('{a} has 2 {many}. {b} gives 4 more. How many?', '{many}', 6, '2 + 4'), story('6 {many} are in a {cont}. 2 more go in. How many?', '{many}', 8, '6 + 2'), story('{b} has 4 {many}. {b} finds 5 more. How many?', '{many}', 9, '4 + 5')] },
      p2: { items: [OP('{a} has 3 {many}. 6 more come. How many now?', '{many}', 9, '3 + 6'), OP('{b} has 7 {many}. 3 more join. How many in all?', '{many}', 10, '7 + 3'), story('There are 5 {many}. 4 more come. How many?', '{many}', 9, '5 + 4'), story('{a} has 8 {many}. {a} gets 2 more. How many?', '{many}', 10, '8 + 2'), story('{b} has 1 {one}. {a} gives {b} 6 more. How many?', '{many}', 7, '1 + 6'), story('2 {conts}: one has 3 {many}, one has 4. How many in all?', '{many}', 7, '3 + 4')] },
      p3: { items: [story('{a} has 6 {many}. {b} has 3. How many do they have in all?', '{many}', 9, '6 + 3'), story('{b} had some {many}. {b} got 4 more. Now {b} has 9. How many at first?', '{many}', 5, '9 − 4'), story('{a} has 2 {many}. {b} has 2 more than {a}. How many does {b} have?', '{many}', 4, '2 + 2'), story('3 {many} plus 3 {many} plus 3 {many}. How many?', '{many}', 9, '3 + 3 + 3'), OP('{a} had 4 {many}. 5 more came. How many now?', '{many}', 9, '4 + 5'), story('{b} has 7 {many}. 0 more come. How many?', '{many}', 7, '7 + 0')] },
      think: {
        items: [{ q: 'Write a joining story for 3 + 5.', lines: { n: 3, key: 'For example: {a} has 3 {many}. {b} brings 5 more. Now there are 8.' } },
          { q: 'Draw a picture for: 4 {many}, then 2 more.', draw: { h: 56, key: '4 and 2 more: 6 in all.' }, eq: ['4 + 2 = []'], a: [6] },
          { q: 'Which words tell you to add?', lines: { n: 2, key: 'More, join, in all, altogether, both.' } },
          { q: '{b} says 6 {many} and 3 more is 3. What went wrong?', lines: { n: 2, key: '{b} took away. More are coming, so add: 9.' } }]
      }
    },

    away: {
      watch: 'adding in a take-away story. Look for "left", "gave away", "ate": subtract.',
      goal: 'I can solve stories where some are taken away.',
      learn: {
        show: { pic: ['frame', { n: 8, x: 3 }], cap: '8 {many}, 3 go away', eq: ['8 − 3 = 5'] },
        together: [story('{a} has 7 {many}. {a} gives 2 away. How many are left?', '{many}', 5, '7 − 2'), story('9 {many} are in a {cont}. 4 fall out. How many are in it?', '{many}', 5, '9 − 4')],
        cue: 'Some go away. Subtract to find how many are left.',
        own: [story('{b} has 6 {many}. {b} uses 1. How many are left?', '{many}', 5, '6 − 1'), story('10 {many} are on a shelf. 3 are taken. How many are left?', '{many}', 7, '10 − 3'), story('{a} has 5 {many}. {a} loses 5. How many are left?', '{many}', 0, '5 − 5'), story('{b} has 8 {many}. {b} gives away 6. How many are left?', '{many}', 2, '8 − 6')]
      },
      p1: { show: { eq: ['6 − 2 = 4'] }, items: [story('{a} has 4 {many}. 1 rolls away. How many are left?', '{many}', 3, '4 − 1'), story('{b} has 9 {many}. {b} gives 2 away. How many are left?', '{many}', 7, '9 − 2'), story('7 {many} are in a {cont}. 3 are taken out. How many are in it?', '{many}', 4, '7 − 3'), story('{a} has 10 {many}. {a} sells 5. How many are left?', '{many}', 5, '10 − 5'), story('{b} has 6 {many}. 4 break. How many are left?', '{many}', 2, '6 − 4'), story('8 {many}. 8 are put away. How many are left?', '{many}', 0, '8 − 8')] },
      p2: { items: [OP('{a} has 9 {many}. {a} gives 3 away. How many are left?', '{many}', 6, '9 − 3'), OP('{b} has 4 {many}. {b} gets 4 more. How many now?', '{many}', 8, '4 + 4'), OP('10 {many}. 7 are taken. How many are left?', '{many}', 3, '10 − 7'), OP('{a} has 5 {many}. 3 more come. How many now?', '{many}', 8, '5 + 3'), story('{b} has 7 {many}. {a} has 4. How many more does {b} have?', 'more', 3, '7 − 4'), story('{a} had 9 {many}. Now {a} has 6. How many were lost?', '{many}', 3, '9 − 6')] },
      p3: { items: [OP('{b} had 10 {many}. {b} gave some away. Now {b} has 4. How many went?', '{many}', 6, '10 − 4'), OP('{a} has 3 {many}. {b} has 5 more than {a}. How many does {b} have?', '{many}', 8, '3 + 5'), story('There are 8 {many}. 2 go, then 3 more go. How many are left?', '{many}', 3, '8 − 2 − 3'), story('{b} has 6 {many}. {a} has 9. How many fewer does {b} have?', 'fewer', 3, '9 − 6'), story('{a} has 10 {many}. {a} gives 5 to {b} and 2 to a friend. How many are left?', '{many}', 3, '10 − 5 − 2'), story('A {cont} had 7 {many}. 7 were taken. How many are left?', '{many}', 0, '7 − 7')] },
      think: {
        items: [{ q: 'Write a take-away story for 9 − 5.', lines: { n: 3, key: 'For example: {a} has 9 {many} and gives 5 away. 4 are left.' } },
          { q: 'Draw a picture for: 7 {many}, 4 go away.', draw: { h: 56, key: '7 with 4 crossed out: 3 left.' }, eq: ['7 − 4 = []'], a: [3] },
          { q: 'Which words tell you to subtract?', lines: { n: 2, key: 'Left, gave away, ate, lost, took, fewer, how many more.' } },
          { q: '{b} says 8 {many}, 2 go away, is 10. What went wrong?', lines: { n: 2, key: '{b} added. 2 go away, so subtract: 6.' } }]
      }
    }
  } });
})();
