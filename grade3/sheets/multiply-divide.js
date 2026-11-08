/* Grade 3 Multiplying and Dividing: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/multiply-divide.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.1 properties and the link between × and ÷, B2.2 facts of 2, 5 and 10, B2.6 × to 10 × 10 and ÷ to 100 ÷ 10,
   B2.9 ratios of 1 to 2, 1 to 5 and 1 to 10. The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function rep(g, k) { var a = []; for (var i = 0; i < g; i++) a.push(k); return a; }
  /* g groups of k: picture and a sum (form 'x': [] × [] = [], 'of': [] groups of [] = [], 'add': k + k + k = []) */
  function G(g, k, form) {
    var f = form || 'x';
    if (f === 'of') return { pic: ['groups', { g: g, k: k }], eq: ['[] groups of [] = []'], a: [g, k, g * k] };
    if (f === 'add') return { pic: ['groups', { g: g, k: k }], eq: [rep(g, k).join(' + ') + ' = []'], a: [g * k] };
    return { pic: ['groups', { g: g, k: k }], eq: ['[] × [] = []'], a: [g, k, g * k] };
  }
  /* a story with one answer box; calc is the sum the answer check works out */
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* an r by c array and its sum ('x': [] × [] = [], 'of': [] rows of [] = []) */
  function AR(r, c, form) { return { pic: ['array', { r: r, c: c }], eq: [form === 'of' ? '[] rows of [] = []' : '[] × [] = []'], a: [r, c, r * c] }; }
  /* n jumps of size step on a number line from 0 to max */
  function LN(n, step, max) { return { pic: ['line', { n: n, step: step, max: max }], eq: ['[] × [] = []'], a: [n, step, n * step] }; }
  /* t things shared into g {conts}; full: every number is a box */
  function SH(t, g, full) { return { pic: ['share', { t: t, g: g }], eq: [full ? '[] ÷ [] = []' : t + ' ÷ ' + g + ' = []'], a: full ? [t, g, t / g] : [t / g] }; }
  /* t loose things to circle in groups of k */
  function DT(t, k) { return { q: 'Circle groups of ' + k + '.', pic: ['dots', { t: t }], eq: [t + ' ÷ ' + k + ' = []'], a: [t / k] }; }
  /* a page-wide block of facts in 3 columns: list of [a, op, b] (op '×' or '÷'); '?a' puts the box first */
  function FA(list) {
    var eq = [], a = [];
    list.forEach(function (f) {
      var r = f[1] === '×' ? f[0] * f[2] : f[0] / f[2];
      if (f[3] === 'first') { eq.push('[] ' + f[1] + ' ' + f[2] + ' = ' + r); a.push(f[0]); } else { eq.push(f[0] + ' ' + f[1] + ' ' + f[2] + ' = []'); a.push(r); }
    });
    return { eq: eq, a: a, cols: 3, wide: true };
  }
  /* the four facts of a and b */
  function FAM(x, y) { var p = x * y; return { q: 'Use ' + x + ', ' + y + ' and ' + p + '.', eq: [x + ' × ' + y + ' = []', y + ' × ' + x + ' = []', p + ' ÷ ' + x + ' = []', p + ' ÷ ' + y + ' = []'], a: [p, p, y, x] }; }
  /* a "for every 1" table: rows of [{conts}, {many}] with [] for blanks */
  function TB(q, rows, a) { return { q: q, pic: ['table', { head: ['{conts}', '{many}'], rows: rows }], a: a }; }
  /* a right or wrong statement to circle */
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  /* a division to check with ×: is it right or wrong? */
  function CK(st, b, q, right) { return { q: st + ' Check it with ×.', eq: ['[] × ' + b + ' = []'], a: q, pick: { opts: ['right', 'wrong'], ans: right ? 0 : 1 }, pickLast: true, tf: st }; }

  S.register('multiply-divide', { code: 'MD', ideas: {

    equal: {
      watch: 'counting only one group, or calling groups equal when one has more. Ask: "Does every group have the same number?"',
      goal: 'I can tell if groups are equal and find how many in all.',
      learn: {
        show: { pic: ['groups', { g: 2, k: 4 }], cap: '2 {conts}, 4 {many} in each', eq: ['4 + 4 = 8', '2 groups of 4 = 8'] },
        together: [{ pic: ['groups', { g: 2, k: 5 }], eq: ['5 + 5 = []', '2 groups of 5 = []'], a: [10, 10] },
          { pic: ['groups', { g: 4, k: 2 }], eq: ['2 + 2 + 2 + 2 = []', '[] groups of [] = []'], a: [8, 4, 2, 8] }],
        cue: 'Check that every group has the same number. Then add one group at a time.',
        own: [G(3, 2, 'of'), G(2, 4, 'of'), { q: 'Equal groups?', pic: ['groups', { counts: [3, 4, 3] }], pick: { opts: ['yes', 'no'], ans: 1 } }, G(5, 2, 'of')]
      },
      p1: {
        show: { pic: ['groups', { g: 2, k: 3 }], cap: '2 groups of 3', eq: ['3 + 3 = 6'] },
        items: [G(2, 4, 'add'), G(3, 3, 'add'), { q: 'Equal groups?', pic: ['groups', { counts: [2, 3, 2] }], pick: { opts: ['yes', 'no'], ans: 1 } },
          G(4, 5, 'of'), { q: 'Equal groups?', pic: ['groups', { counts: [5, 5, 5] }], pick: { opts: ['yes', 'no'], ans: 0 } }, G(2, 10, 'of')]
      },
      p2: {
        items: [G(3, 5, 'of'),
          { q: 'Draw 4 {conts} with 3 {many} in each.', draw: { h: 64, key: ['groups', { g: 4, k: 3 }] }, eq: ['4 groups of 3 = []'], a: [12] },
          story('{a} puts 5 {many} in each of 3 {conts}. How many {many} in all?', '{many}', 15, '3 × 5'),
          { q: 'Equal groups?', pic: ['groups', { counts: [6, 6, 5] }], pick: { opts: ['yes', 'no'], ans: 1 } },
          G(6, 2, 'of'),
          story('{b} has 4 {conts}. Each {cont} has 4 {many}. How many {many}?', '{many}', 16, '4 × 4')]
      },
      p3: {
        items: [G(6, 5, 'of'), G(7, 3, 'of'),
          { q: 'Move 1 to make the groups equal.', pic: ['groups', { counts: [4, 6, 5] }], eq: ['3 groups of [] = []'], a: [5, 15] },
          story('{a} has 24 {many} and makes 4 equal {conts}. How many {many} in each?', '{many}', 6, '24 ÷ 4'),
          story('{b} has 8 {conts} with 5 {many} in each. How many {many}?', '{many}', 40, '8 × 5'),
          { q: 'Is 5 + 5 + 5 + 5 the same as 4 groups of 5?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '5 + 5 + 5 + 5 = 4 groups of 5' }]
      },
      think: {
        items: [{ q: 'Show 12 as equal groups in two different ways.', draw: { h: 96, key: 'Any two of: 2 groups of 6, 3 groups of 4, 4 groups of 3, 6 groups of 2.' } },
          { q: '{b} says these are 3 equal groups. Is {b} right? Why?', pic: ['groups', { counts: [4, 4, 5] }], lines: { n: 2, key: 'No. One group has 5 and the others have 4.' } },
          { q: 'Write a story for 3 groups of 10.', lines: { n: 3, key: 'For example: {a} puts 10 {many} in each of 3 {conts}. That makes 30 {many}.' } },
          { q: '20 {many} go into equal {conts}. How many {conts} could there be? Find three answers.', lines: { n: 2, key: 'Any three of 1, 2, 4, 5, 10 or 20.' } }]
      }
    },

    times: {
      watch: 'adding the two numbers (3 × 4 = 7). Ask: "How many groups? How many in each?" Then draw the groups.',
      goal: 'I can write equal groups as a times sum.',
      learn: {
        show: { pic: ['groups', { g: 5, k: 2 }], cap: '5 {conts}, 2 {many} in each', eq: ['2 + 2 + 2 + 2 + 2 = 10', '5 × 2 = 10'] },
        together: [{ pic: ['groups', { g: 2, k: 5 }], eq: ['5 + 5 = []', '2 × 5 = []'], a: [10, 10] }, G(3, 4)],
        cue: 'The first number is how many groups. The second is how many in each group.',
        own: [G(4, 2), G(2, 3), G(3, 5), { eq: ['4 + 4 + 4 = []', '3 × 4 = []'], a: [12, 12] }]
      },
      p1: {
        show: { pic: ['groups', { g: 2, k: 4 }], cap: '2 groups of 4', eq: ['2 × 4 = 8'] },
        items: [G(3, 2), G(2, 5), G(4, 3), G(5, 2), { eq: ['3 + 3 = []', '2 × 3 = []'], a: [6, 6] }, G(5, 3)]
      },
      p2: {
        items: [{ q: 'Write it as a times sum.', eq: ['6 + 6 + 6 = []', '[] × [] = []'], a: [18, 3, 6, 18] }, G(4, 5),
          { q: 'Draw 3 × 6.', draw: { h: 56, key: ['groups', { g: 3, k: 6 }] }, eq: ['3 × 6 = []'], a: [18] },
          story('{a} puts 4 {many} in each of 5 {conts}. How many {many}?', '{many}', 20, '5 × 4'),
          { eq: ['5 × 5 = []', '6 × 2 = []'], a: [25, 12] },
          { q: 'Circle the sum that means 4 groups of 6.', pick: { opts: ['4 + 6', '6 + 6 + 6 + 6', '4 + 4'], ans: 1, val: 24 }, wide: true }]
      },
      p3: {
        items: [G(6, 7), { eq: ['8 + 8 + 8 + 8 + 8 = []', '[] × [] = []'], a: [40, 5, 8, 40] },
          story('{b} has 9 {conts} with 3 {many} in each. How many {many}?', '{many}', 27, '9 × 3'),
          { eq: ['[] × 4 = 4 + 4 + 4 + 4 + 4'], a: [5], wide: true },
          { eq: ['10 × 3 = []', '6 × 5 = []'], a: [30, 30] },
          story('{a} has 7 {conts} with 4 {many} in each. How many {many}?', '{many}', 28, '7 × 4')]
      },
      think: {
        items: [{ q: 'Draw 4 × 3 and 3 × 4. How are they different?', draw: { h: 96, key: '4 groups of 3 and 3 groups of 4. Both make 12, but the groups are not the same.' } },
          { q: '{b} says 3 × 6 = 9. What went wrong?', lines: { n: 2, key: '{b} added 3 + 6. 3 × 6 is 3 groups of 6, which is 18.' } },
          { q: 'Write a story for 6 × 5.', lines: { n: 3, key: 'For example: {a} has 6 {conts} with 5 {many} in each. That makes 30 {many}.' } },
          { q: 'Which is more?', pick: { opts: ['4 groups of 5', '5 groups of 3'], ans: 0, big: true }, wide: true }]
      }
    },

    rows: {
      watch: 'counting one row and one column and adding them (4 + 6). Run a finger along each row while counting by the number in a row.',
      goal: 'I can write a times sum for an array.',
      learn: {
        show: { pic: ['array', { r: 3, c: 5 }], cap: '3 rows of 5', eq: ['5, 10, 15', '3 × 5 = 15'] },
        together: [{ pic: ['array', { r: 2, c: 4 }], eq: ['4, []', '2 × 4 = []'], a: [8, 8], by: 4 }, AR(3, 3)],
        cue: 'Count by the number in one row, one row at a time.',
        own: [AR(2, 5), { eq: ['4 × 2 = []', '3 × 4 = []', '5 × 3 = []'], a: [8, 12, 15] }]
      },
      p1: {
        show: { pic: ['array', { r: 2, c: 3 }], cap: '2 rows of 3', eq: ['2 × 3 = 6'] },
        items: [AR(2, 2, 'of'), AR(3, 2, 'of'), AR(2, 5), AR(4, 3), AR(5, 2, 'of'), AR(3, 5)]
      },
      p2: {
        items: [AR(3, 6), { q: 'Draw 3 rows of 4.', draw: { h: 64, key: ['array', { r: 3, c: 4 }] }, eq: ['3 × 4 = []'], a: [12] },
          story('{a} sets out 4 rows of 6 {many}. How many {many}?', '{many}', 24, '4 × 6'), AR(5, 4),
          { q: 'An array has 2 rows of 7. How many in all?', eq: ['2 × 7 = []'], a: [14] }, AR(4, 4)]
      },
      p3: {
        items: [AR(7, 4), AR(6, 6), story('{b} sets out 8 rows of 5 {many}. How many {many}?', '{many}', 40, '8 × 5'),
          { q: 'An array has 24 in 4 rows. How many in each row?', eq: ['4 × [] = 24'], a: [6] },
          { q: 'An array has 30 in all, 10 in each row. How many rows?', eq: ['[] × 10 = 30'], a: [3] },
          story('{a} sets out 9 rows of 3 {many}. How many {many}?', '{many}', 27, '9 × 3')]
      },
      think: {
        items: [{ q: 'Draw two different arrays with 18 in each.', draw: { h: 130, key: 'Any two of 1 × 18, 2 × 9, 3 × 6, 6 × 3, 9 × 2, 18 × 1.' } },
          { q: '{b} says this array has 4 + 6 = 10. What went wrong?', pic: ['array', { r: 4, c: 6 }], lines: { n: 2, key: '{b} added one row and one column. It is 4 rows of 6, which is 24.' } },
          { q: 'Write a story for 5 rows of 3.', lines: { n: 4, key: 'For example: {a} sets out 5 rows of 3 {many}. That makes 15 {many}.' } },
          { q: 'Which array has more?', pick: { opts: ['3 rows of 7', '4 rows of 5'], ans: 0, big: true } }]
      }
    },

    turn: {
      watch: 'thinking 6 × 4 must be bigger than 4 × 6. Build one array, count it, turn the paper, and count again.',
      goal: 'I can turn an array around and get the same answer.',
      learn: {
        show: { pic: ['array', { r: 2, c: 5 }], cap: 'Turn it: 5 rows of 2', eq: ['2 × 5 = 10', '5 × 2 = 10'] },
        together: [{ pic: ['array', { r: 3, c: 4 }], eq: ['3 × 4 = []', '4 × 3 = []'], a: [12, 12] }, { pic: ['array', { r: 2, c: 6 }], eq: ['2 × 6 = []', '6 × [] = 12'], a: [12, 2] }],
        cue: 'Turning the array does not change how many there are.',
        own: [{ eq: ['5 × 3 = []', '3 × 5 = []'], a: [15, 15] }, { eq: ['4 × 2 = 2 × []'], a: [4] }, { eq: ['10 × 3 = 3 × []'], a: [10] }, { eq: ['6 × 5 = [] × 6'], a: [5] }]
      },
      p1: {
        show: { pic: ['array', { r: 2, c: 3 }], cap: 'Turn it and count again', eq: ['2 × 3 = 3 × 2'] },
        items: [{ pic: ['array', { r: 2, c: 4 }], eq: ['2 × 4 = []', '4 × 2 = []'], a: [8, 8] }, { eq: ['3 × 2 = 2 × []'], a: [3] },
          { eq: ['5 × 4 = 4 × []'], a: [5] }, { pic: ['array', { r: 3, c: 5 }], eq: ['3 × 5 = []', '5 × 3 = []'], a: [15, 15] },
          TF('2 × 10 = 10 × 2', true), { eq: ['[] × 3 = 3 × 4'], a: [4] }]
      },
      p2: {
        items: [{ eq: ['7 × 2 = 2 × []', '2 × 7 = []'], a: [7, 14] }, { eq: ['5 × 6 = [] × 5'], a: [6] }, TF('4 × 7 = 7 × 4', true), TF('3 × 8 = 8 × 8', false),
          { q: '{a} knows 10 × 6 = 60. What is 6 × 10?', eq: ['6 × 10 = []'], a: [60] }, { pic: ['array', { r: 5, c: 4 }], eq: ['5 × 4 = []', '4 × 5 = []'], a: [20, 20] }]
      },
      p3: {
        items: [{ eq: ['9 × 5 = 5 × []', '5 × 9 = []'], a: [9, 45] }, { eq: ['8 × 10 = [] × 8', '10 × 8 = []'], a: [10, 80] }, TF('6 × 7 = 7 × 6', true), TF('9 × 2 = 2 × 2', false),
          { eq: ['7 × [] = 3 × 7'], a: [3] }, { q: '{b} knows 5 × 8 = 40. What is 8 × 5?', eq: ['8 × 5 = []'], a: [40] }]
      },
      think: {
        items: [{ q: 'Draw arrays to show 3 × 5 = 5 × 3.', draw: { h: 130, key: 'A 3 by 5 array, and the same array turned: 5 rows of 3. Both have 15.' } },
          { q: '{b} says 6 × 4 is bigger than 4 × 6. Is that right? Why?', lines: { n: 3, key: 'No. Both are 24. Turning the array does not change how many there are.' } },
          { q: 'Which is easier to work out, 7 × 2 or 2 × 7? Why?', lines: { n: 3, key: 'Either, if explained. For example: 7 × 2 is 7 groups of 2, so I count by 2s: 14.' } },
          { q: 'Find the missing numbers.', eq: ['4 × 9 = 9 × []', '[] × 6 = 6 × 10'], a: [4, 10] }]
      }
    },

    split: {
      watch: 'finding only one part, or adding the numbers of rows (5 + 2) instead of the parts. Cover one part, say its fact, then the other.',
      goal: 'I can split a hard fact into two easy ones.',
      learn: {
        show: { pic: ['array', { r: 7, c: 4, split: 5 }], cap: 'Cut after 5 rows', eq: ['20 + 8 = 28', '7 × 4 = 28'] },
        together: [{ pic: ['array', { r: 6, c: 2, split: 5 }], eq: ['10 + [] = []', '6 × 2 = []'], a: [2, 12, 12] },
          { pic: ['array', { r: 7, c: 3, split: 5 }], eq: ['[] + [] = []', '7 × 3 = []'], a: [15, 6, 21, 21] }],
        cue: 'Cover the bottom part and say its fact. Then the top part. Then add.',
        own: [{ eq: ['6 × 4 = 20 + []', '6 × 4 = []'], a: [4, 24] }, { eq: ['7 × 2 = 10 + []', '7 × 2 = []'], a: [4, 14] }]
      },
      p1: {
        show: { pic: ['array', { r: 6, c: 5, split: 5 }], cap: '5 rows and 1 more row', eq: ['25 + 5 = 30'] },
        items: [{ pic: ['array', { r: 6, c: 2, split: 5 }], eq: ['10 + 2 = []'], a: [12] }, { pic: ['array', { r: 6, c: 3, split: 5 }], eq: ['15 + [] = []'], a: [3, 18] },
          { eq: ['6 × 2 = 10 + []'], a: [2] }, { eq: ['6 × 10 = 50 + []'], a: [10] }, { eq: ['7 × 2 = 10 + []'], a: [4] }, { eq: ['6 × 5 = 25 + []'], a: [5] }]
      },
      p2: {
        items: [{ pic: ['array', { r: 8, c: 3, split: 5 }], eq: ['[] + [] = []'], a: [15, 9, 24] }, { pic: ['array', { r: 7, c: 4, split: 5 }], eq: ['[] + [] = []'], a: [20, 8, 28] },
          { q: 'Use 5 × 6 = 30 to find 6 × 6.', eq: ['6 × 6 = 30 + []', '6 × 6 = []'], a: [6, 36] }, { q: 'Use 5 × 4 = 20 to find 7 × 4.', eq: ['7 × 4 = 20 + []', '7 × 4 = []'], a: [8, 28] },
          { eq: ['8 × 5 = 25 + []'], a: [15] }, { eq: ['9 × 2 = 10 + []'], a: [8] }]
      },
      p3: {
        items: [{ eq: ['8 × 6 = 30 + []', '8 × 6 = []'], a: [18, 48] }, { eq: ['9 × 4 = 20 + []', '9 × 4 = []'], a: [16, 36] },
          { eq: ['7 × 7 = [] + 14', '7 × 7 = []'], a: [35, 49] }, { eq: ['6 × 8 = [] + 8'], a: [40] }, { eq: ['8 × 7 = [] + 21'], a: [35] },
          story('{a} sets out 7 rows of 6 {many}. Split it into 5 rows and 2 rows. How many {many} in all?', '{many}', 42, '7 × 6')]
      },
      think: {
        items: [{ q: 'Show two ways to split 8 × 4.', draw: { h: 120, key: 'For example: 5 × 4 + 3 × 4 = 20 + 12 = 32, or 4 × 4 + 4 × 4 = 16 + 16 = 32.' } },
          { q: '{b} split 7 × 3 into 5 × 3 and 2 × 3, then wrote 15 + 2 = 17. What went wrong?', lines: { n: 3, key: '{b} added 2 rows, not 2 × 3 = 6. 15 + 6 = 21.' } },
          { q: 'Why is 5 a good place to cut?', lines: { n: 3, key: 'The 5 facts are easy, so a hard fact becomes two easy facts.' } },
          { eq: ['9 × 5 = 5 × 5 + [] × 5', '9 × 5 = []'], a: [4, 45], wide: true }]
      }
    },

    skip: {
      watch: 'counting the tick marks instead of the jumps, or starting the count at 1. Count the jumps out loud: one 5, two 5s ...',
      goal: 'I can jump on a number line to multiply.',
      learn: {
        show: { pic: ['line', { max: 20, step: 5, n: 4 }], cap: '4 jumps of 5', eq: ['5, 10, 15, 20', '4 × 5 = 20'] },
        together: [{ pic: ['line', { max: 10, step: 2, n: 3 }], eq: ['2, 4, []', '3 × 2 = []'], a: [6, 6] }, LN(3, 10, 50)],
        cue: 'Count the jumps, not the tick marks.',
        own: [LN(4, 2, 10), { eq: ['3 × 5 = []', '2 × 10 = []', '5 × 2 = []'], a: [15, 20, 10] }]
      },
      p1: {
        show: { pic: ['line', { max: 10, step: 5, n: 2 }], cap: '2 jumps of 5', eq: ['2 × 5 = 10'] },
        items: [LN(3, 2, 10), LN(2, 5, 15), LN(5, 2, 12), LN(3, 10, 40), LN(4, 5, 25), { q: 'Count by 2s.', eq: ['2, 4, [], [], 10'], a: [6, 8] }]
      },
      p2: {
        items: [LN(6, 2, 14), LN(5, 5, 30), LN(7, 10, 80), { q: 'Count by 5s.', eq: ['5, 10, [], [], 25, []'], a: [15, 20, 30], wide: true },
          story('{a} jumps by 10s, 6 times. Where does {a} land?', '', 60, '6 × 10'),
          { q: 'Draw 7 jumps of 2.', pic: ['line', { max: 20, step: 2, n: 0 }], eq: ['7 × 2 = []'], a: [14] }]
      },
      p3: {
        items: [{ q: 'Count by 5s from 35.', eq: ['35, 40, [], [], []'], a: [45, 50, 55] }, { q: 'Count by 2s from 12.', eq: ['12, 14, [], [], []'], a: [16, 18, 20] },
          LN(9, 5, 50), LN(8, 10, 100), { q: 'How many jumps of 5 reach 40?', eq: ['[] × 5 = 40'], a: [8] },
          story('{b} jumps by 2s, 9 times. Where does {b} land?', '', 18, '9 × 2')]
      },
      think: {
        items: [{ q: 'Count by 10s: 10, 20, 30 ... What pattern do you see?', lines: { n: 4, key: 'Every number ends in 0. The tens digit goes up by 1 each time.' } },
          { q: '{b} says 4 jumps of 5 land on 9. What went wrong?', lines: { n: 3, key: '{b} added 4 + 5. Four jumps of 5 land on 20.' } },
          { q: 'Draw jumps for 3 × 5 and for 5 × 3. Do they land on the same number?', pic: ['line', { max: 15, step: 1, labels: 5, n: 0 }], lines: { n: 2, key: 'Yes. Both land on 15.' } },
          { q: 'Find the size of each jump.', eq: ['6 × [] = 30', '4 × [] = 40'], a: [5, 10] }]
      }
    },

    turnfacts: {
      watch: 'counting by the bigger number (7, 14, 21 ...) when a 2, 5 or 10 fact is hidden. Ask: "Which number can we count by?"',
      goal: 'I can turn a fact around to count by 2s, 5s or 10s.',
      learn: {
        show: { cap: '7 × 5: turn it, then count by 5s.', eq: ['5 × 7 = 35', '7 × 5 = 35'] },
        together: [{ eq: ['6 × 2 = 2 × []', '6 × 2 = []'], a: [6, 12] }, { eq: ['8 × 5 = 5 × []', '8 × 5 = []'], a: [8, 40] }],
        cue: 'Turn the fact so the 2, 5 or 10 comes first. Then count by it.',
        own: [{ eq: ['7 × 2 = []'], a: [14] }, { eq: ['4 × 10 = []'], a: [40] }, { eq: ['6 × 5 = []'], a: [30] }, { eq: ['9 × 2 = []'], a: [18] }]
      },
      p1: {
        show: { cap: '3 × 5: count by 5s.', eq: ['5, 10, 15', '3 × 5 = 15'] },
        items: [{ q: 'Count by 5s.', eq: ['4 × 5 = []'], a: [20] }, { q: 'Count by 10s.', eq: ['3 × 10 = []'], a: [30] }, { q: 'Count by 2s.', eq: ['5 × 2 = []'], a: [10] },
          { eq: ['4 × 2 = 2 × []'], a: [4] }, { eq: ['6 × 10 = 10 × []'], a: [6] }, { q: 'Count by 5s.', eq: ['7 × 5 = []'], a: [35] }]
      },
      p2: {
        items: [{ eq: ['8 × 2 = []', '8 × 5 = []'], a: [16, 40] }, { eq: ['7 × 10 = []', '9 × 5 = []'], a: [70, 45] },
          story('{a} has 6 {conts} with 5 {many} in each. How many {many}?', '{many}', 30, '6 × 5'),
          story('{b} has 9 {conts} with 2 {many} in each. How many {many}?', '{many}', 18, '9 × 2'),
          { eq: ['8 × 10 = 10 × []'], a: [8] }, { eq: ['6 × 2 = []', '7 × 2 = []'], a: [12, 14] }]
      },
      p3: {
        items: [{ eq: ['9 × 10 = []', '10 × 9 = []'], a: [90, 90] }, { eq: ['8 × 5 = []', '5 × 8 = []'], a: [40, 40] }, { eq: ['[] × 2 = 16'], a: [8] }, { eq: ['[] × 5 = 45'], a: [9] },
          story('{a} has 7 {conts} with 10 {many} in each. How many {many}?', '{many}', 70, '7 × 10'),
          story('{b} has 8 {conts} with 5 {many} in each, then gets 1 more {cont} of 5. How many {many} now?', '{many}', 45, '8 × 5 + 1 × 5')]
      },
      think: {
        items: [{ q: 'Why is 7 × 5 easier to work out as 5 × 7?', lines: { n: 4, key: 'Counting by 5s is easy: 5, 10, 15 ... 35. Counting by 7s is harder.' } },
          { q: 'Write three facts you can work out by counting by 10s.', lines: { n: 3, key: 'Any facts with a 10, such as 3 × 10, 10 × 6 and 8 × 10.' } },
          { q: '{b} counted 9 × 2 by 9s and got 17. Show an easier way.', lines: { n: 3, key: 'Count by 2s nine times: 2, 4, 6 ... 18.' } },
          { eq: ['4 × 5 = 5 × [] = []'], a: [4, 20] }]
      }
    },

    patterns: {
      watch: 'skipping a number when counting by 5s or 10s. The 5 facts end in 5 or 0, the 10 facts end in 0, and the 2 facts are even.',
      goal: 'I can use the patterns in the 2, 5 and 10 facts.',
      learn: {
        show: { cap: 'The 5 facts end in 5 or 0.', eq: ['5, 10, 15, 20, 25'] },
        together: [{ q: 'Count by 10s.', eq: ['10, 20, [], 40, []'], a: [30, 50] }, { q: 'Count by 2s.', eq: ['2, 4, 6, [], []'], a: [8, 10] }],
        cue: 'Say the pattern out loud. Then check how each number ends.',
        own: [{ q: 'Count by 5s.', eq: ['15, 20, [], []'], a: [25, 30] }, { q: 'Count by 10s.', eq: ['50, 60, [], []'], a: [70, 80] },
          { q: 'Count by 2s.', eq: ['10, 12, [], []'], a: [14, 16] }, { q: 'Is 35 in the 10 facts?', pick: { opts: ['yes', 'no'], ans: 1 }, mult: { n: 35, of: 10 } }]
      },
      p1: {
        show: { cap: 'The 10 facts end in 0.', eq: ['10, 20, 30, 40'] },
        items: [{ q: 'Count by 5s.', eq: ['5, 10, [], 20, []'], a: [15, 25] }, { q: 'Count by 2s.', eq: ['2, [], 6, [], 10'], a: [4, 8] },
          { q: 'Count by 10s.', eq: ['30, 40, [], []'], a: [50, 60] }, { q: 'Is 20 in the 10 facts?', pick: { opts: ['yes', 'no'], ans: 0 }, mult: { n: 20, of: 10 } },
          { q: 'Is 15 in the 5 facts?', pick: { opts: ['yes', 'no'], ans: 0 }, mult: { n: 15, of: 5 } }, { q: 'Is 7 in the 2 facts?', pick: { opts: ['yes', 'no'], ans: 1 }, mult: { n: 7, of: 2 } }]
      },
      p2: {
        items: [{ q: 'Count by 5s.', eq: ['25, 30, [], [], 45'], a: [35, 40] }, { q: 'Count by 2s.', eq: ['12, 14, [], [], 20'], a: [16, 18] },
          { q: 'Count by 10s.', eq: ['60, 70, [], [], 100'], a: [80, 90] }, { q: 'Circle the 5 fact answer.', pick: { opts: ['22', '35', '41'], ans: 1 }, mult: { of: 5 } },
          { q: 'Circle the 2 fact answer.', pick: { opts: ['13', '16', '19'], ans: 1 }, mult: { of: 2 } }, { q: 'Is 45 in the 10 facts?', pick: { opts: ['yes', 'no'], ans: 1 }, mult: { n: 45, of: 10 } }]
      },
      p3: {
        items: [{ q: 'Count back by 5s.', eq: ['50, 45, 40, [], []'], a: [35, 30] }, { q: 'Count back by 2s.', eq: ['20, 18, [], [], 12'], a: [16, 14] },
          { q: 'Count back by 10s.', eq: ['100, 90, [], [], 60'], a: [80, 70] }, { q: 'Circle the one in the 2 facts and the 5 facts.', pick: { opts: ['15', '20', '25'], ans: 1 }, mult: { of: 10 } },
          { q: '{a} counts by 5s from 5. Will {a} say 52?', pick: { opts: ['yes', 'no'], ans: 1 }, mult: { n: 52, of: 5 } },
          { q: '{b} counts by 2s from 2. Will {b} say 18?', pick: { opts: ['yes', 'no'], ans: 0 }, mult: { n: 18, of: 2 } }]
      },
      think: {
        items: [{ q: 'What pattern do the 5 fact answers make? Why?', lines: { n: 4, key: 'They end in 5, 0, 5, 0 ... because two 5s make a ten.' } },
          { q: 'Are all the 10 fact answers also 5 fact answers? Why?', lines: { n: 4, key: 'Yes. Every 10 is two 5s.' } },
          { q: '{b} says 25 is a 2 fact answer. Is that right? How do you know?', lines: { n: 3, key: 'No. The 2 fact answers are even. 25 ends in 5, so it is odd.' } },
          { q: 'Write the next three numbers. What is the rule?', eq: ['4, 6, 8, [], [], []'], a: [10, 12, 14], lines: { n: 1, key: 'Add 2 each time.' } }]
      }
    },

    near: {
      watch: 'adding 1 instead of one whole group (6 × 5 = 30, so 7 × 5 = 31). Draw the extra group.',
      goal: 'I can add or take away one group to find a fact.',
      learn: {
        show: { pic: ['groups', { g: 4, k: 5 }], cap: '4 × 5 = 20, and one more group of 5', eq: ['20 + 5 = 25', '5 × 5 = 25'] },
        together: [{ eq: ['5 × 2 = 10', '6 × 2 = 10 + []', '6 × 2 = []'], a: [2, 12] }, { eq: ['10 × 5 = 50', '9 × 5 = 50 − []', '9 × 5 = []'], a: [5, 45] }],
        cue: 'One more group: add a group. One less group: take a group away.',
        own: [{ eq: ['5 × 10 = 50', '6 × 10 = []'], a: [60] }, { eq: ['4 × 5 = 20', '5 × 5 = []'], a: [25] }, { eq: ['10 × 2 = 20', '9 × 2 = []'], a: [18] }, { eq: ['3 × 10 = 30', '4 × 10 = []'], a: [40] }]
      },
      p1: {
        show: { pic: ['groups', { g: 3, k: 2 }], cap: '3 × 2 = 6, and one more group of 2', eq: ['6 + 2 = 8', '4 × 2 = 8'] },
        items: [{ eq: ['2 × 5 = 10', '3 × 5 = 10 + []'], a: [5] }, { eq: ['5 × 2 = 10', '6 × 2 = []'], a: [12] }, { eq: ['10 × 10 = 100', '9 × 10 = 100 − []'], a: [10] },
          { eq: ['5 × 5 = 25', '6 × 5 = []'], a: [30] }, { pic: ['groups', { g: 4, k: 2 }], eq: ['4 × 2 = []', '5 × 2 = []'], a: [8, 10] }, { eq: ['5 × 10 = 50', '4 × 10 = []'], a: [40] }]
      },
      p2: {
        items: [{ eq: ['5 × 4 = 20', '6 × 4 = []'], a: [24] }, { eq: ['10 × 3 = 30', '9 × 3 = []'], a: [27] }, { eq: ['5 × 6 = 30', '6 × 6 = []'], a: [36] }, { eq: ['10 × 7 = 70', '9 × 7 = []'], a: [63] },
          story('{a} has 5 {conts} of 4 {many}, then gets 1 more {cont} of 4. How many {many} now?', '{many}', 24, '5 × 4 + 1 × 4'),
          story('{b} has 10 {conts} of 6 {many} and gives 1 {cont} away. How many {many} are left?', '{many}', 54, '10 × 6 − 1 × 6')]
      },
      p3: {
        items: [{ eq: ['10 × 8 = 80', '9 × 8 = []'], a: [72] }, { eq: ['5 × 7 = 35', '6 × 7 = []'], a: [42] }, { eq: ['5 × 9 = 45', '4 × 9 = []'], a: [36] }, { eq: ['2 × 8 = 16', '3 × 8 = []'], a: [24] },
          { eq: ['10 × 4 = 40', '9 × 4 = [] − []', '9 × 4 = []'], a: [40, 4, 36] }, { q: 'Use 5 × 8 = 40 to find 6 × 8 and 4 × 8.', eq: ['6 × 8 = []', '4 × 8 = []'], a: [48, 32] }]
      },
      think: {
        items: [{ q: '{b} says: 6 × 5 = 30, so 7 × 5 = 31. What went wrong?', lines: { n: 3, key: '{b} added 1, not one more group of 5. 7 × 5 = 35.' } },
          { q: 'Which fact would you use to find 9 × 6? Why?', lines: { n: 3, key: '10 × 6 = 60, then take away one group of 6: 54.' } },
          { q: 'Draw a picture to show 4 × 3 is one group more than 3 × 3.', draw: { h: 110, key: ['groups', { g: 4, k: 3 }] } },
          { eq: ['10 × 7 = 70', '9 × 7 = [] − 7 = []'], a: [70, 63] }]
      }
    },

    share: {
      watch: 'giving more to one group, or not checking that every group has the same. Share one at a time, round and round, then count one group.',
      goal: 'I can share things out equally.',
      learn: {
        show: { pic: ['groups', { g: 3, k: 4 }], cap: '12 shared into 3 {conts}', eq: ['12 ÷ 3 = 4'] },
        together: [SH(6, 2), SH(8, 4, true)],
        cue: 'Give one to each {cont}, round and round, until none are left.',
        own: [SH(10, 2), SH(9, 3), { eq: ['12 ÷ 4 = []', '15 ÷ 5 = []'], a: [3, 3] }]
      },
      p1: {
        show: { pic: ['groups', { g: 2, k: 3 }], cap: '6 shared into 2 {conts}', eq: ['6 ÷ 2 = 3'] },
        items: [SH(4, 2), SH(6, 3), SH(10, 5), SH(8, 2), SH(10, 2), SH(9, 3)]
      },
      p2: {
        items: [SH(12, 3, true), SH(16, 4, true),
          story('{a} shares 20 {many} equally into 5 {conts}. How many {many} in each?', '{many}', 4, '20 ÷ 5'),
          story('{b} shares 14 {many} equally into 2 {conts}. How many {many} in each?', '{many}', 7, '14 ÷ 2'),
          { eq: ['18 ÷ 2 = []', '25 ÷ 5 = []'], a: [9, 5] },
          { q: 'Share 12 into 4 equal {conts}. Draw it.', draw: { h: 60, key: ['groups', { counts: [3, 3, 3, 3] }] }, eq: ['12 ÷ 4 = []'], a: [3] }]
      },
      p3: {
        items: [{ eq: ['30 ÷ 5 = []', '40 ÷ 10 = []'], a: [6, 4] }, { eq: ['24 ÷ 4 = []', '35 ÷ 5 = []'], a: [6, 7] },
          story('{a} shares 36 {many} equally into 4 {conts}. How many {many} in each?', '{many}', 9, '36 ÷ 4'),
          story('{b} shares 50 {many} equally into 10 {conts}. How many {many} in each?', '{many}', 5, '50 ÷ 10'),
          { eq: ['[] ÷ 3 = 6'], a: [18] },
          story('{a} has 28 {many}, keeps 4 and shares the rest equally into 3 {conts}. How many in each?', '{many}', 8, '(28 − 4) ÷ 3')]
      },
      think: {
        items: [{ q: '{b} shared 13 {many} into 3 {conts}, 4 in each. Is that fair? Why?', lines: { n: 3, key: 'Not quite: 3 × 4 = 12, so 1 is left over.' } },
          { q: 'Share 20 into equal groups in two different ways.', draw: { h: 120, key: 'For example: 2 groups of 10, 4 groups of 5, 5 groups of 4 or 10 groups of 2.' } },
          { q: 'Write a sharing story for 15 ÷ 3.', lines: { n: 4, key: 'For example: {a} shares 15 {many} into 3 {conts}. Each {cont} gets 5.' } },
          { q: 'Which gives more in each?', pick: { opts: ['12 ÷ 2', '12 ÷ 3'], ans: 0, big: true } }]
      }
    },

    group: {
      watch: 'mixing up "how many groups" with "how many in each". Ask: "Do we know how big a group is, or how many groups there are?"',
      goal: 'I can make equal groups to divide.',
      learn: {
        show: { pic: ['groups', { g: 3, k: 5 }], cap: '15 {many}, 5 in each {cont}', eq: ['15 ÷ 5 = 3'] },
        together: [DT(8, 4), DT(10, 2)],
        cue: 'Make one group at a time. Then count the groups.',
        own: [DT(15, 5), DT(12, 3), DT(20, 10), DT(8, 2)]
      },
      p1: {
        show: { pic: ['groups', { g: 3, k: 2 }], cap: '6 {many}, 2 in each {cont}', eq: ['6 ÷ 2 = 3'] },
        items: [DT(6, 3), DT(10, 5), DT(9, 3), DT(20, 10), DT(12, 2), DT(25, 5)]
      },
      p2: {
        items: [story('{a} has 18 {many} and puts 2 in each {cont}. How many {conts}?', '{conts}', 9, '18 ÷ 2'),
          story('{b} has 40 {many}, 10 in each {cont}. How many {conts}?', '{conts}', 4, '40 ÷ 10'),
          { eq: ['30 ÷ 5 = []', '16 ÷ 2 = []'], a: [6, 8] }, DT(24, 4),
          { q: 'How many groups of 5 make 35?', eq: ['[] × 5 = 35'], a: [7] },
          story('{a} has 21 {many}. 3 fit in each {cont}. How many {conts} are needed?', '{conts}', 7, '21 ÷ 3')]
      },
      p3: {
        items: [{ eq: ['45 ÷ 5 = []', '60 ÷ 10 = []'], a: [9, 6] }, { eq: ['28 ÷ 4 = []', '36 ÷ 6 = []'], a: [7, 6] },
          story('{b} has 32 {many} and puts 4 in each {cont}. How many {conts}?', '{conts}', 8, '32 ÷ 4'),
          story('{a} needs {conts} for 70 {many}. Each {cont} holds 10. How many {conts}?', '{conts}', 7, '70 ÷ 10'),
          { eq: ['[] ÷ 5 = 8'], a: [40] },
          story('{b} has 27 {many}, 3 in each {cont}, and gives 2 {conts} away. How many {conts} are left?', '{conts}', 7, '27 ÷ 3 − 2')]
      },
      think: {
        items: [{ q: '15 ÷ 3 can mean "share into 3 {conts}" or "make {conts} of 3". Draw both.', draw: { h: 120, key: '3 groups of 5, and 5 groups of 3. Both show 15 ÷ 3 = 5.' }, wide: true },
          { q: '{b} put 20 {many} in {conts} of 5 and says there are 5 {conts}. What went wrong?', lines: { n: 3, key: '{b} mixed up the numbers. 20 in groups of 5 makes 4 {conts}.' } },
          { q: 'Write a story where you make groups of 2.', lines: { n: 3, key: 'For example: {a} has 12 {many} and puts 2 in each {cont}. That makes 6 {conts}.' } },
          { q: 'How many groups of 10 are in 90?', eq: ['90 ÷ 10 = []'], a: [9] }]
      }
    },

    which: {
      watch: 'choosing by a key word instead of the story. Ask: "Do we know the total? Then divide. Do we need the total? Then multiply."',
      goal: 'I can tell if a story needs × or ÷.',
      learn: {
        show: { cap: 'Need the total? Multiply. Know the total? Divide.', eq: ['4 × 5 = 20', '20 ÷ 4 = 5'] },
        together: [{ q: '{a} puts 5 {many} in each of 3 {conts}. How many {many}?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] {many}'], a: [15], calc: '3 × 5' },
          { q: '{b} shares 12 {many} into 3 {conts}. How many in each?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] {many}'], a: [4], calc: '12 ÷ 3' }],
        cue: 'Circle × or ÷ first. Then work it out.',
        own: [{ q: '{a} has 4 {conts} with 2 {many} in each. How many {many}?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] {many}'], a: [8], calc: '4 × 2' },
          { q: '{b} has 10 {many}, 5 in each {cont}. How many {conts}?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] {conts}'], a: [2], calc: '10 ÷ 5' }]
      },
      p1: {
        show: { cap: 'Need the total? Multiply.', eq: ['3 × 2 = 6'] },
        items: [{ q: '{a} puts 2 {many} in each of 4 {conts}. How many {many}?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] {many}'], a: [8], calc: '4 × 2' },
          { q: '{b} shares 6 {many} into 2 {conts}. How many in each?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] {many}'], a: [3], calc: '6 ÷ 2' },
          { q: '{a} has 5 {conts} with 5 {many} in each. How many {many}?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] {many}'], a: [25], calc: '5 × 5' },
          { q: '{b} has 20 {many}, 10 in each {cont}. How many {conts}?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] {conts}'], a: [2], calc: '20 ÷ 10' }]
      },
      p2: {
        items: [{ q: '{a} has 6 {conts} with 5 {many} in each. How many {many}?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] {many}'], a: [30], calc: '6 × 5' },
          { q: '{b} shares 18 {many} into 2 {conts}. How many in each?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] {many}'], a: [9], calc: '18 ÷ 2' },
          { q: '{a} has 35 {many}, 5 in each {cont}. How many {conts}?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] {conts}'], a: [7], calc: '35 ÷ 5' },
          { q: '{b} sets out 4 rows of 7 {many}. How many {many}?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] {many}'], a: [28], calc: '4 × 7' },
          { q: '{a} fills 8 {conts} with 2 {many} each. How many {many}?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] {many}'], a: [16], calc: '8 × 2' },
          { q: '{b} shares 40 {many} into 10 {conts}. How many in each?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] {many}'], a: [4], calc: '40 ÷ 10' }]
      },
      p3: {
        items: [{ q: '{a} has 9 {conts} of 5 {many}. How many {many}?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] {many}'], a: [45], calc: '9 × 5' },
          { q: '{b} shares 56 {many} into 7 {conts}. How many in each?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] {many}'], a: [8], calc: '56 ÷ 7' },
          { q: '{a} has 90 {many}, 10 in each {cont}. How many {conts}?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] {conts}'], a: [9], calc: '90 ÷ 10' },
          { q: '{b} sets out 6 rows of 8 {many}. How many {many}?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] {many}'], a: [48], calc: '6 × 8' },
          { q: '{a} has 7 {conts} with 7 {many} in each. How many {many}?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] {many}'], a: [49], calc: '7 × 7' },
          { q: '{b} shares 36 {many} into 4 {conts}. How many in each?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] {many}'], a: [9], calc: '36 ÷ 4' }]
      },
      think: {
        items: [{ q: 'Write a story that needs ×. Then write one that needs ÷.', lines: { n: 4, key: 'For example: {a} has 4 {conts} with 3 {many} in each (× : 12). {a} shares 12 {many} into 4 {conts} (÷ : 3).' }, wide: true },
          { q: '{b} says: "It says each, so I multiply." Is that always right? Why?', lines: { n: 4, key: 'No. "Share 12 into 3. How many in each?" says each but needs ÷. Look at what we know and what we need.' } },
          { q: '{a} has 24 {many}. Write one × fact and one ÷ fact about them.', lines: { n: 4, key: 'For example: 4 × 6 = 24 and 24 ÷ 4 = 6.' } },
          story('{b} has 5 {conts} with 4 {many} in each, then shares them all into 2 {conts}. How many {many} in each now?', '{many}', 10, '5 × 4 ÷ 2')]
      }
    },

    four: {
      watch: 'writing a division in the wrong order (3 ÷ 12). The total comes first in a division.',
      goal: 'I can write four facts from three numbers.',
      learn: {
        show: { pic: ['array', { r: 3, c: 4 }], cap: '3, 4 and 12', eq: ['3 × 4 = 12', '12 ÷ 3 = 4'] },
        together: [{ pic: ['array', { r: 2, c: 5 }], eq: ['2 × 5 = []', '10 ÷ 2 = []'], a: [10, 5] }, { pic: ['array', { r: 3, c: 5 }], eq: ['3 × 5 = []', '15 ÷ [] = 5'], a: [15, 3] }],
        cue: 'Use the same three numbers. In a division, the biggest number comes first.',
        own: [{ eq: ['4 × 5 = 20', '20 ÷ 5 = []'], a: [4] }, { eq: ['2 × 7 = 14', '14 ÷ 2 = []'], a: [7] }, { eq: ['3 × 10 = 30', '30 ÷ 3 = []'], a: [10] }, { eq: ['5 × 6 = 30', '30 ÷ 6 = []'], a: [5] }]
      },
      p1: {
        show: { pic: ['array', { r: 2, c: 3 }], cap: '2, 3 and 6', eq: ['2 × 3 = 6', '6 ÷ 2 = 3'] },
        items: [{ eq: ['5 × 2 = 10', '10 ÷ 5 = []'], a: [2] }, { eq: ['3 × 10 = 30', '30 ÷ 10 = []'], a: [3] }, { eq: ['2 × 4 = 8', '8 ÷ [] = 4'], a: [2] },
          { pic: ['array', { r: 2, c: 6 }], eq: ['2 × 6 = []', '12 ÷ 2 = []'], a: [12, 6] }, { eq: ['4 × 10 = 40', '40 ÷ 4 = []'], a: [10] }, { eq: ['5 × 3 = 15', '15 ÷ 5 = []'], a: [3] }]
      },
      p2: {
        items: [FAM(3, 6), FAM(4, 5), FAM(2, 9), FAM(5, 7),
          { q: 'Circle the one that is not true.', pick: { opts: ['32 ÷ 4 = 8', '4 × 8 = 32', '8 ÷ 32 = 4'], ans: 2 }, odd: true, wide: true }]
      },
      p3: {
        items: [{ q: 'Write the four facts for 7, 8 and 56.', eq: ['[] × [] = []', '[] × [] = []', '[] ÷ [] = []', '[] ÷ [] = []'], a: [7, 8, 56, 8, 7, 56, 56, 7, 8, 56, 8, 7] },
          { q: 'Write the four facts for 6, 9 and 54.', eq: ['[] × [] = []', '[] × [] = []', '[] ÷ [] = []', '[] ÷ [] = []'], a: [6, 9, 54, 9, 6, 54, 54, 6, 9, 54, 9, 6] },
          { eq: ['[] × 6 = 42', '42 ÷ 6 = []'], a: [7, 7] }, { eq: ['9 × [] = 72', '72 ÷ 9 = []'], a: [8, 8] },
          { q: 'Circle the one that is not true.', pick: { opts: ['63 ÷ 7 = 9', '9 × 7 = 63', '63 ÷ 9 = 6'], ans: 2 }, odd: true, wide: true },
          { q: '{a} knows 8 × 5 = 40. Write a ÷ fact {a} also knows.', eq: ['40 ÷ [] = []'], a: [5, 8], wide: true }]
      },
      think: {
        items: [{ q: 'How does 3 × 4 = 12 help you work out 12 ÷ 4?', lines: { n: 4, key: 'They use the same three numbers. 3 groups of 4 make 12, so 12 ÷ 4 = 3.' } },
          { q: '{b} wrote 4 ÷ 12 = 3. What went wrong?', lines: { n: 4, key: 'The total, 12, comes first in a division: 12 ÷ 4 = 3.' } },
          { q: 'Why does 5 × 5 = 25 have only two facts in its family?', lines: { n: 4, key: 'Both numbers are 5, so turning it around gives the same fact. The facts are 5 × 5 = 25 and 25 ÷ 5 = 5.' } },
          { q: 'Make a fact family with a 10 in it.', lines: { n: 4, key: 'For example: 3 × 10 = 30, 10 × 3 = 30, 30 ÷ 3 = 10, 30 ÷ 10 = 3.' } }]
      }
    },

    check: {
      watch: 'checking with the wrong two numbers (multiplying the total). Multiply the answer by the number you divided by: you should get the total back.',
      goal: 'I can check a division with a times fact.',
      learn: {
        show: { cap: 'Check 20 ÷ 4 = 5: does 5 × 4 make 20?', eq: ['5 × 4 = 20'] },
        together: [{ eq: ['12 ÷ 2 = 6', 'Check: 6 × 2 = []'], a: [12] }, { eq: ['15 ÷ 5 = 3', 'Check: 3 × [] = []'], a: [5, 15] }],
        cue: 'Multiply the answer by the number you divided by. You should get the total.',
        own: [CK('20 ÷ 5 = 4.', 5, [4, 20], true), CK('18 ÷ 2 = 8.', 2, [8, 16], false), CK('30 ÷ 10 = 3.', 10, [3, 30], true), CK('25 ÷ 5 = 6.', 5, [6, 30], false)]
      },
      p1: {
        show: { cap: 'Check 10 ÷ 2 = 5:', eq: ['5 × 2 = 10'] },
        items: [{ eq: ['6 ÷ 2 = 3', 'Check: 3 × 2 = []'], a: [6] }, { eq: ['10 ÷ 5 = 2', 'Check: 2 × 5 = []'], a: [10] }, { eq: ['20 ÷ 10 = 2', 'Check: 2 × 10 = []'], a: [20] },
          { eq: ['8 ÷ 2 = 4', 'Check: 4 × 2 = []'], a: [8] }, CK('14 ÷ 2 = 7.', 2, [7, 14], true), CK('15 ÷ 5 = 4.', 5, [4, 20], false)]
      },
      p2: {
        items: [{ eq: ['24 ÷ 4 = 6', 'Check: [] × [] = []'], a: [6, 4, 24] }, { eq: ['35 ÷ 5 = 7', 'Check: [] × [] = []'], a: [7, 5, 35] },
          CK('40 ÷ 5 = 8.', 5, [8, 40], true), CK('27 ÷ 3 = 8.', 3, [8, 24], false), CK('50 ÷ 10 = 5.', 10, [5, 50], true), CK('16 ÷ 2 = 9.', 2, [9, 18], false)]
      },
      p3: {
        items: [CK('63 ÷ 9 = 7.', 9, [7, 63], true), CK('48 ÷ 6 = 9.', 6, [9, 54], false), CK('72 ÷ 8 = 9.', 8, [9, 72], true),
          { q: '{a} wrote 42 ÷ 7 = 5. Check it, then fix it.', eq: ['5 × 7 = []', '42 ÷ 7 = []'], a: [35, 6] },
          { eq: ['54 ÷ 6 = []', 'Check: [] × 6 = 54'], a: [9, 9] }, { eq: ['80 ÷ 10 = []', 'Check: [] × 10 = 80'], a: [8, 8] }]
      },
      think: {
        items: [{ q: 'How does × help you check a ÷?', lines: { n: 4, key: 'Multiply the answer by the number you divided by. If you get the total back, the division is right.' } },
          { q: '{b} checked 24 ÷ 6 = 4 by working out 24 × 6. What went wrong?', lines: { n: 4, key: '{b} multiplied the total. Check with 4 × 6 = 24.' } },
          { q: 'Can you check 3 × 9 = 27 with a ÷? Show how.', lines: { n: 3, key: 'Yes: 27 ÷ 9 = 3, or 27 ÷ 3 = 9.' } },
          { eq: ['[] ÷ 5 = 6', 'Check: 6 × 5 = []'], a: [30, 30] }]
      }
    },

    ratio: {
      watch: 'adding 1 to both numbers, or adding to the wrong column. Read the table across: 1 and 5, 2 and 10.',
      goal: 'I can use "for every 1, there are 2, 5 or 10".',
      learn: {
        show: { pic: ['table', { head: ['{conts}', '{many}'], rows: [[1, 5], [2, 10]] }], cap: 'For every 1 {cont}, 5 {many}', eq: ['2 × 5 = 10'] },
        together: [TB('2 {many} for every {cont}.', [[1, 2], [2, '[]'], [3, '[]']], [4, 6]), TB('10 {many} for every {cont}.', [[1, 10], [2, '[]'], [4, '[]']], [20, 40])],
        cue: 'Multiply the number of {conts} by 2, 5 or 10.',
        own: [TB('5 {many} for every {cont}.', [[1, 5], [2, '[]'], [4, '[]']], [10, 20]), story('2 {many} in each {cont}. How many in 6 {conts}?', '{many}', 12, '6 × 2')]
      },
      p1: {
        show: { pic: ['table', { head: ['{conts}', '{many}'], rows: [[1, 2], [2, 4]] }], cap: 'For every 1 {cont}, 2 {many}', eq: ['2 × 2 = 4'] },
        items: [TB('2 {many} for every {cont}.', [[1, 2], [3, '[]']], [6]), TB('5 {many} for every {cont}.', [[1, 5], [2, '[]']], [10]),
          TB('10 {many} for every {cont}.', [[1, 10], [2, '[]']], [20]), TB('2 {many} for every {cont}.', [[1, 2], [4, '[]']], [8])]
      },
      p2: {
        items: [story('{a} puts 5 {many} in each {cont}. How many {many} in 6 {conts}?', '{many}', 30, '6 × 5'),
          story('For every 1 {cont}, there are 10 {many}. How many {many} for 7 {conts}?', '{many}', 70, '7 × 10'),
          TB('2 {many} for every {cont}.', [[1, 2], [2, '[]'], [5, '[]'], [8, '[]']], [4, 10, 16]),
          TB('5 {many} for every {cont}.', [[1, 5], [4, '[]'], [8, '[]'], [9, '[]']], [20, 40, 45]),
          TB('10 {many} for every {cont}.', [[1, 10], [6, '[]'], [9, '[]']], [60, 90]),
          story('{b} has 2 {many} for every {cont}. How many {many} for 9 {conts}?', '{many}', 18, '9 × 2')]
      },
      p3: {
        items: [TB('5 {many} for every {cont}.', [[1, 5], ['[]', 25], ['[]', 40]], [5, 8]), TB('10 {many} for every {cont}.', [[1, 10], ['[]', 70], [10, '[]']], [7, 100]),
          TB('2 {many} for every {cont}.', [[1, 2], ['[]', 14], ['[]', 20]], [7, 10]),
          story('{b} has 5 {many} for every {cont} and 8 {conts}. How many {many}?', '{many}', 40, '8 × 5'),
          story('{a} has 10 {many} for every {cont}, has 3 {conts}, and gets 2 more {conts}. How many {many} now?', '{many}', 50, '(3 + 2) × 10'),
          story('{b} has 2 {many} for every {cont}, for 10 {conts}. How many {many}?', '{many}', 20, '10 × 2')]
      },
      think: {
        items: [{ q: 'For every 1 {cont} there are 5 {many}. {b} says 2 {conts} have 6 {many}. What went wrong?', lines: { n: 4, key: '{b} added 1. Two {conts} have 5 + 5 = 10 {many}.' } },
          { q: 'Make your own "for every 1" table.', draw: { h: 130, key: 'Any table where every row is the first number times the same number (2, 5 or 10).' } },
          TB('10 {many} for every {cont}.', [[1, 10], [5, '[]'], [10, '[]']], [50, 100]),
          { q: 'Why do the {many} grow faster than the {conts}?', lines: { n: 3, key: 'Each new {cont} adds 2, 5 or 10 {many}, but only 1 {cont}.' } }]
      }
    },

    back: {
      watch: 'multiplying when the total is already known (20 {many}, 5 for each: 100). Ask: "Do we know the total? How many 5s make it?"',
      goal: 'I can work back from a total.',
      learn: {
        show: { pic: ['table', { head: ['{conts}', '{many}'], rows: [[1, 5], [2, 10], [3, 15]] }], cap: '15 {many}, 5 for every {cont}', eq: ['15 ÷ 5 = 3'] },
        together: [TB('2 {many} for every {cont}. 8 {many} in all.', [[1, 2], ['[]', 8]], [4]), TB('10 {many} for every {cont}. 30 {many} in all.', [[1, 10], ['[]', 30]], [3])],
        cue: 'Count by 2s, 5s or 10s up to the total. Count how many times.',
        own: [TB('5 {many} for every {cont}.', [[1, 5], ['[]', 20]], [4]), TB('2 {many} for every {cont}.', [[1, 2], ['[]', 12]], [6])]
      },
      p1: {
        show: { pic: ['table', { head: ['{conts}', '{many}'], rows: [[1, 2], [2, 4], [3, 6]] }], cap: '6 {many}, 2 for every {cont}', eq: ['6 ÷ 2 = 3'] },
        items: [TB('2 {many} for every {cont}.', [[1, 2], ['[]', 6]], [3]), TB('5 {many} for every {cont}.', [[1, 5], ['[]', 10]], [2]),
          { eq: ['[] × 5 = 15'], a: [3] }, { eq: ['[] × 2 = 10'], a: [5] }, { eq: ['[] × 10 = 40'], a: [4] }, { eq: ['[] × 10 = 30'], a: [3] }]
      },
      p2: {
        items: [story('{a} has 5 {many} for every {cont}, and 25 {many}. How many {conts}?', '{conts}', 5, '25 ÷ 5'),
          story('{b} has 2 {many} for every {cont}, and 14 {many}. How many {conts}?', '{conts}', 7, '14 ÷ 2'),
          story('{a} has 10 {many} for every {cont}, and 80 {many}. How many {conts}?', '{conts}', 8, '80 ÷ 10'),
          TB('5 {many} for every {cont}.', [[1, 5], ['[]', 30], ['[]', 45]], [6, 9]), TB('2 {many} for every {cont}.', [[1, 2], ['[]', 16], ['[]', 18]], [8, 9]),
          { eq: ['[] × 10 = 60', '60 ÷ 10 = []'], a: [6, 6] }]
      },
      p3: {
        items: [story('{b} has 5 {many} for every {cont}, and 50 {many}. How many {conts}?', '{conts}', 10, '50 ÷ 5'),
          story('{a} has 2 {many} for every {cont} and 20 {many}, then gives 4 {conts} away. How many {conts} are left?', '{conts}', 6, '20 ÷ 2 − 4'),
          TB('10 {many} for every {cont}.', [[1, 10], ['[]', 90], [4, '[]']], [9, 40]), TB('5 {many} for every {cont}.', [[1, 5], ['[]', 40], [6, '[]']], [8, 30]),
          { eq: ['[] × 5 = 45', '[] × 2 = 18'], a: [9, 9] },
          story('{b} has 10 {many} for every {cont}, and 100 {many}. How many {conts}?', '{conts}', 10, '100 ÷ 10')]
      },
      think: {
        items: [{ q: '{b} has 30 {many}, 5 for every {cont}. {b} says 30 × 5 = 150 {conts}. What went wrong?', lines: { n: 4, key: '{b} multiplied, but the total is known. 30 ÷ 5 = 6 {conts}.' } },
          { q: 'How can counting by 5s help you find 40 ÷ 5?', lines: { n: 4, key: 'Count 5, 10, 15 ... 40 and count the jumps: 8.' } },
          { q: 'Write a "work back" story for 20 ÷ 2.', lines: { n: 4, key: 'For example: {a} has 20 {many}, 2 for every {cont}. How many {conts}? 10.' } },
          { q: 'Which needs more {conts}?', pick: { opts: ['40 ÷ 5', '40 ÷ 10'], ans: 0, big: true } }]
      }
    },

    facts: {
      watch: 'counting on fingers every time. Practise a few facts each day and say the whole fact out loud: "6 fives are 30".',
      goal: 'I know the 2, 5 and 10 facts.',
      learn: {
        show: { cap: 'Not sure? Count by 5s.', eq: ['5, 10, 15, 20, 25, 30', '6 × 5 = 30'] },
        together: [{ eq: ['3 × 5 = []', '4 × 5 = []'], a: [15, 20] }, { eq: ['6 × 2 = []', '7 × 2 = []'], a: [12, 14] }],
        cue: 'Say the whole fact out loud as you write it.',
        own: [FA([[2, '×', 10], [5, '×', 4], [8, '×', 2], [3, '×', 10], [5, '×', 2], [6, '×', 10], [7, '×', 5], [4, '×', 2], [10, '×', 10]])]
      },
      p1: {
        show: { cap: 'The 10 facts: the number of tens.', eq: ['4 × 10 = 40'] },
        items: [FA([[2, '×', 2], [3, '×', 2], [4, '×', 2], [5, '×', 2], [2, '×', 5], [3, '×', 5], [4, '×', 5], [5, '×', 5], [1, '×', 10], [2, '×', 10], [3, '×', 10], [4, '×', 10]]),
          FA([[5, '×', 10], [4, '×', 5], [2, '×', 3], [10, '×', 2], [5, '×', 3], [2, '×', 4], [10, '×', 5], [3, '×', 10], [5, '×', 4], [2, '×', 5], [10, '×', 3], [5, '×', 2]])]
      },
      p2: {
        items: [FA([[6, '×', 2], [7, '×', 5], [8, '×', 10], [9, '×', 2], [6, '×', 5], [7, '×', 10], [8, '×', 2], [9, '×', 5], [6, '×', 10], [7, '×', 2], [8, '×', 5], [9, '×', 10]]),
          FA([[2, '×', 7], [5, '×', 8], [10, '×', 6], [2, '×', 9], [5, '×', 6], [10, '×', 9], [2, '×', 6], [5, '×', 9], [10, '×', 7], [2, '×', 8], [5, '×', 7], [10, '×', 8]]),
          FA([[3, '×', 5], [9, '×', 2], [4, '×', 10], [8, '×', 5], [7, '×', 2], [6, '×', 10], [5, '×', 5], [10, '×', 10], [4, '×', 2], [2, '×', 5], [9, '×', 5], [8, '×', 10]])]
      },
      p3: {
        items: [FA([[7, '×', 5, 'first'], [9, '×', 2, 'first'], [6, '×', 10, 'first'], [8, '×', 5, 'first'], [7, '×', 2, 'first'], [9, '×', 10, 'first'], [6, '×', 5, 'first'], [8, '×', 2, 'first'], [4, '×', 10, 'first'], [9, '×', 5, 'first'], [6, '×', 2, 'first'], [3, '×', 10, 'first']]),
          FA([[2, '×', 8], [5, '×', 9], [10, '×', 7], [2, '×', 6], [5, '×', 7], [10, '×', 4], [2, '×', 9], [5, '×', 6], [10, '×', 8], [2, '×', 7], [5, '×', 8], [10, '×', 9]]),
          FA([[8, '×', 10, 'first'], [7, '×', 5], [6, '×', 2, 'first'], [9, '×', 5], [8, '×', 2, 'first'], [7, '×', 10], [6, '×', 5, 'first'], [9, '×', 2], [10, '×', 10, 'first'], [4, '×', 5], [3, '×', 2, 'first'], [5, '×', 10]])]
      },
      think: {
        items: [{ q: 'Which 5 fact answers are also 10 fact answers? Why?', lines: { n: 4, key: 'The ones ending in 0: 10, 20, 30 ... Two 5s make 10.' } },
          { q: 'Write all the 2 facts you know. What pattern do the answers make?', lines: { n: 4, key: '2, 4, 6, 8, 10, 12, 14, 16, 18, 20: all even numbers.' } },
          { q: '{b} says 7 × 10 = 17. What went wrong?', lines: { n: 3, key: '{b} put the numbers side by side. 7 tens are 70.' } },
          { q: 'Find the missing numbers.', eq: ['[] × 5 = 45', '[] × 10 = 90', '[] × 2 = 14'], a: [9, 9, 7] }]
      }
    },

    divfacts: {
      watch: 'counting down instead of using a times fact. Ask: "What times 5 makes 35?"',
      goal: 'I can divide by thinking of the times fact.',
      learn: {
        show: { cap: 'What times 5 makes 35?', eq: ['7 × 5 = 35', '35 ÷ 5 = 7'] },
        together: [{ eq: ['[] × 2 = 12', '12 ÷ 2 = []'], a: [6, 6] }, { eq: ['[] × 10 = 50', '50 ÷ 10 = []'], a: [5, 5] }],
        cue: 'Think: what times this number makes the total?',
        own: [FA([[10, '÷', 2], [15, '÷', 5], [20, '÷', 10], [8, '÷', 2], [25, '÷', 5], [40, '÷', 10], [6, '÷', 2], [10, '÷', 5], [30, '÷', 10]])]
      },
      p1: {
        show: { cap: 'Think of the times fact.', eq: ['3 × 5 = 15', '15 ÷ 5 = 3'] },
        items: [FA([[4, '÷', 2], [6, '÷', 2], [8, '÷', 2], [10, '÷', 2], [5, '÷', 5], [10, '÷', 5], [15, '÷', 5], [20, '÷', 5], [10, '÷', 10], [20, '÷', 10], [30, '÷', 10], [40, '÷', 10]]),
          FA([[50, '÷', 10], [12, '÷', 2], [25, '÷', 5], [20, '÷', 2], [30, '÷', 5], [60, '÷', 10], [14, '÷', 2], [35, '÷', 5], [70, '÷', 10], [16, '÷', 2], [40, '÷', 5], [80, '÷', 10]])]
      },
      p2: {
        items: [FA([[18, '÷', 2], [45, '÷', 5], [90, '÷', 10], [16, '÷', 2], [40, '÷', 5], [80, '÷', 10], [14, '÷', 2], [35, '÷', 5], [70, '÷', 10], [12, '÷', 2], [30, '÷', 5], [60, '÷', 10]]),
          FA([[20, '÷', 2], [50, '÷', 5], [100, '÷', 10], [8, '÷', 2], [20, '÷', 5], [40, '÷', 10], [6, '÷', 2], [15, '÷', 5], [30, '÷', 10], [4, '÷', 2], [10, '÷', 5], [20, '÷', 10]]),
          FA([[35, '÷', 5], [18, '÷', 2], [60, '÷', 10], [45, '÷', 5], [12, '÷', 2], [90, '÷', 10], [25, '÷', 5], [16, '÷', 2], [50, '÷', 10], [40, '÷', 5], [14, '÷', 2], [70, '÷', 10]])]
      },
      p3: {
        items: [FA([[18, '÷', 2, 'first'], [45, '÷', 5, 'first'], [70, '÷', 10, 'first'], [14, '÷', 2, 'first'], [35, '÷', 5, 'first'], [90, '÷', 10, 'first'], [16, '÷', 2, 'first'], [40, '÷', 5, 'first'], [60, '÷', 10, 'first'], [12, '÷', 2, 'first'], [30, '÷', 5, 'first'], [80, '÷', 10, 'first']]),
          FA([[100, '÷', 10], [50, '÷', 5], [20, '÷', 2], [90, '÷', 10], [45, '÷', 5], [18, '÷', 2], [80, '÷', 10], [40, '÷', 5], [16, '÷', 2], [70, '÷', 10], [35, '÷', 5], [14, '÷', 2]]),
          FA([[25, '÷', 5, 'first'], [12, '÷', 2], [50, '÷', 10, 'first'], [30, '÷', 5], [8, '÷', 2, 'first'], [40, '÷', 10], [20, '÷', 5, 'first'], [6, '÷', 2], [30, '÷', 10, 'first'], [15, '÷', 5], [10, '÷', 2, 'first'], [20, '÷', 10]])]
      },
      think: {
        items: [{ q: 'How does 6 × 5 = 30 help with 30 ÷ 5?', lines: { n: 4, key: 'They are the same three numbers. 6 fives make 30, so 30 ÷ 5 = 6.' } },
          { q: '{b} says 40 ÷ 10 = 30. What went wrong?', lines: { n: 4, key: '{b} took away 10. 40 ÷ 10 asks how many tens make 40: 4.' } },
          { q: 'Write two ÷ facts that have the answer 5.', lines: { n: 3, key: 'For example: 10 ÷ 2 = 5, 25 ÷ 5 = 5, 50 ÷ 10 = 5.' } },
          { q: 'Find the missing numbers.', eq: ['[] ÷ 2 = 9', '[] ÷ 5 = 8', '[] ÷ 10 = 7'], a: [18, 40, 70] }]
      }
    },

    mixed: {
      watch: 'guessing the harder facts (6s, 7s, 8s and 9s). Use a strategy: turn it, split it at 5, or add or take away a group.',
      goal: 'I can do times and division facts to 10 × 10.',
      learn: {
        show: { cap: '7 × 6: split it at 5.', eq: ['30 + 12 = 42', '7 × 6 = 42'] },
        together: [{ eq: ['6 × 7 = 5 × 7 + []', '6 × 7 = []'], a: [7, 42] }, { eq: ['9 × 8 = 10 × 8 − []', '9 × 8 = []'], a: [8, 72] }],
        cue: 'Pick a fact you know that is close. Then add or take away a group.',
        own: [FA([[3, '×', 4], [6, '×', 6], [7, '×', 3], [4, '×', 8], [9, '×', 3], [6, '×', 4], [7, '×', 7], [8, '×', 3], [9, '×', 9]])]
      },
      p1: {
        show: { cap: '3 × 4: turn it if that helps.', eq: ['3 × 4 = 4 × 3 = 12'] },
        items: [FA([[3, '×', 3], [3, '×', 4], [4, '×', 3], [4, '×', 4], [3, '×', 6], [6, '×', 3], [4, '×', 6], [6, '×', 4], [3, '×', 7], [7, '×', 3], [3, '×', 8], [4, '×', 7]]),
          FA([[9, '÷', 3], [12, '÷', 4], [12, '÷', 3], [16, '÷', 4], [18, '÷', 3], [18, '÷', 6], [24, '÷', 6], [24, '÷', 4], [21, '÷', 3], [21, '÷', 7], [24, '÷', 3], [28, '÷', 7]])]
      },
      p2: {
        items: [FA([[6, '×', 6], [6, '×', 7], [7, '×', 6], [7, '×', 7], [6, '×', 8], [8, '×', 6], [7, '×', 8], [8, '×', 7], [8, '×', 8], [6, '×', 9], [9, '×', 7], [8, '×', 9]]),
          FA([[36, '÷', 6], [42, '÷', 7], [42, '÷', 6], [49, '÷', 7], [48, '÷', 8], [48, '÷', 6], [56, '÷', 7], [56, '÷', 8], [64, '÷', 8], [54, '÷', 9], [63, '÷', 7], [72, '÷', 9]]),
          FA([[3, '×', 9], [4, '×', 9], [9, '×', 9], [8, '×', 4], [7, '×', 4], [6, '×', 3], [9, '×', 6], [8, '×', 3], [7, '×', 9], [4, '×', 4], [3, '×', 8], [9, '×', 4]])]
      },
      p3: {
        items: [FA([[6, '×', 7, 'first'], [8, '×', 6, 'first'], [9, '×', 7, 'first'], [7, '×', 8, 'first'], [6, '×', 9, 'first'], [8, '×', 8, 'first'], [7, '×', 7, 'first'], [9, '×', 8, 'first'], [4, '×', 9, 'first'], [3, '×', 7, 'first'], [6, '×', 6, 'first'], [9, '×', 9, 'first']]),
          FA([[63, '÷', 9], [56, '÷', 7], [72, '÷', 8], [54, '÷', 6], [81, '÷', 9], [48, '÷', 8], [42, '÷', 6], [64, '÷', 8], [49, '÷', 7], [36, '÷', 4], [27, '÷', 3], [32, '÷', 4]]),
          FA([[7, '×', 6], [56, '÷', 8, 'first'], [9, '×', 4], [8, '×', 9], [45, '÷', 9, 'first'], [6, '×', 8], [3, '×', 9], [36, '÷', 6, 'first'], [4, '×', 7], [7, '×', 9], [24, '÷', 8, 'first'], [9, '×', 6]])]
      },
      think: {
        items: [{ q: 'How would you work out 8 × 7? Show your thinking.', lines: { n: 4, key: 'For example: 5 × 7 = 35 and 3 × 7 = 21, so 35 + 21 = 56.' } },
          { q: 'Which fact is hardest for you? Which fact can help with it?', lines: { n: 4, key: 'Any honest answer with a helping fact, such as 9 × 6 from 10 × 6 = 60, take away 6.' } },
          { q: '{b} says 6 × 6 = 12. What went wrong?', lines: { n: 3, key: '{b} added. 6 × 6 is 6 groups of 6: 36.' } },
          { q: 'Find the missing numbers.', eq: ['[] × 7 = 63', '8 × [] = 48', '[] × 9 = 81'], a: [9, 6, 9] }]
      }
    }

  } });
})();
