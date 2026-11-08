/* Grade 4 Patterns and Algebra: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/patterns.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: C1.1 repeating, growing and shrinking patterns; C1.2 and C1.3 pattern rules, tables, predictions and
   missing terms; C1.4 patterns with decimal tenths; C2.1 and C2.2 variables and equations; C2.3 inequalities;
   C3.1 and C3.2 code with loops and nested loops. The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* the next terms of a growing or shrinking pattern: first terms shown, k blanks */
  function NX(start, step, shown, k) {
    var t = [], a = [];
    for (var i = 0; i < shown + k; i++) { var v = +(start + i * step).toFixed(2); if (i < shown) t.push(v); else { t.push('[]'); a.push(v); } }
    return { eq: [t.join(', ')], a: a, wide: shown + k > 5 };
  }
  /* the next terms of a repeating pattern of numbers */
  function RP(core, reps, k) {
    var t = [], a = [];
    for (var i = 0; i < core.length * reps + k; i++) { var v = core[i % core.length]; if (i < core.length * reps) t.push(v); else { t.push('[]'); a.push(v); } }
    return { eq: [t.join(', ')], a: a, core: core.length, wide: t.length > 6 };
  }
  /* a repeating pattern of shapes: draw the next ones (c circle, s square, t triangle, d diamond, C shaded circle) */
  function SH(core, reps, k) {
    var seq = '', next = '';
    for (var i = 0; i < core.length * reps + k; i++) { var ch = core[i % core.length]; if (i < core.length * reps) seq += ch; else next += ch; }
    return { q: 'Draw the next ' + k + '.', pic: ['pat', { seq: seq, blanks: k, next: next, core: core.length }] };
  }
  /* a growing pattern of tiles: figure n, from the picture */
  function GF(m, b, n) { return { pic: ['grow', { m: m, b: b, k: 3 }], q: 'How many tiles in figure ' + n + '?', eq: ['[] tiles'], a: [m * n + b], fig: n }; }
  /* from the first three terms: the term for figure n */
  function SQ(seq, n) { return { q: 'Figures 1, 2, 3 have ' + seq.join(', ') + '. Figure ' + n + '?', eq: ['[]'], a: [seq[0] + (seq[1] - seq[0]) * (n - 1)], seq: seq, fig: n }; }
  /* solve for n, and put a number in */
  function SV(e, v) { return { eq: [e, 'n = []'], a: [v], solve: e }; }
  function EV(e, n) {
    var v = Function('n', 'return ' + e.replace(/(\d)n/g, '$1*n').replace(/×/g, '*').replace(/−/g, '-'))(n);
    return { q: 'n = ' + n, eq: [e + ' = []'], a: [v], expr: e, n: n };
  }
  /* the greatest or least whole number for an inequality */
  function IQ(e, v, edge) { return { q: (edge === 'most' ? 'Greatest' : 'Least') + ' whole number n:', eq: [e, 'n = []'], a: [v], ineq: e, edge: edge }; }
  function TF(st, ans, q) { return { q: q || 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  /* trace a robot's code: how many squares it moves, or a total */
  function CD(lines, ans, calc, q) { return { q: q || 'How many squares does the robot move?', pic: ['code', { lines: lines }], eq: ['[]'], a: [ans], calc: calc }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }

  S.register('patterns', { code: 'PA', ideas: {

    repeat: {
      watch: 'copying the last few shapes instead of the core. Circle the core first, then say it over and over.',
      goal: 'I can find the core and extend a repeating pattern.',
      learn: {
        show: { pic: ['pat', { seq: 'cstcst', core: 3 }], cap: 'The core is 3 shapes long' },
        together: [SH('cs', 3, 2), RP([2, 5, 8], 2, 2)],
        cue: 'Find the core: the part that repeats. Say it again and again.',
        own: [SH('tts', 2, 3), RP([1, 1, 4], 2, 3), RP([9, 0], 3, 2)]
      },
      p1: {
        show: { cap: 'Core: 4, 7', eq: ['4, 7, 4, 7, 4, 7'] },
        items: [SH('st', 3, 2), RP([3, 6], 3, 2), SH('cct', 2, 3), RP([5, 5, 1], 2, 3), RP([8, 2, 6], 2, 3), RP([1, 2], 3, 2)]
      },
      p2: {
        items: [SH('stc', 2, 3), RP([4, 0, 0], 2, 3), SH('ccss', 2, 2), RP([7, 3, 3, 1], 2, 2), RP([6, 2], 3, 2),
          { q: 'Which shape is 10th in this pattern?', pic: ['pat', { seq: 'cstcst', core: 3 }], pick: { opts: ['circle', 'square', 'triangle'], ans: 0, term: { core: ['circle', 'square', 'triangle'], n: 10 } } }]
      },
      p3: {
        items: [SH('Ctsd', 2, 2), RP([1, 2, 3, 2], 2, 3), RP([10, 20, 30], 2, 3),
          { q: 'Which shape is 12th in this pattern?', pic: ['pat', { seq: 'scsc', core: 2 }], pick: { opts: ['square', 'circle'], ans: 1, term: { core: ['square', 'circle'], n: 12 } } },
          { q: 'Which number is 9th?', eq: ['5, 1, 8, 5, 1, 8, ...'], core: 3, pick: { opts: ['5', '1', '8'], ans: 2, term: { core: ['5', '1', '8'], n: 9 } } },
          RP([0, 5, 5], 2, 3)]
      },
      think: {
        items: [{ q: '{b} says the core of 3, 6, 3, 6, 3, 6 is 3, 6, 3. What would you tell {b}?', lines: { n: 3, key: 'The core is the shortest part that repeats: 3, 6.' } },
          { q: 'Make a repeating pattern with a core of 3 shapes. Draw it twice.', draw: { h: 60, key: 'For example: circle, square, square, circle, square, square.' } },
          { q: 'The core is red, blue, blue. What colour is the 20th?', lines: { n: 2, key: 'Blue. 18 is 6 full cores, then red (19), blue (20).' } },
          RP([2, 4, 6, 4], 2, 2)]
      }
    },

    grow: {
      watch: 'adding the figure number instead of the same step each time. Count how many new tiles each figure adds.',
      goal: 'I can extend a growing or shrinking pattern.',
      learn: {
        show: { pic: ['grow', { m: 2, b: 1, k: 3 }], cap: '2 new tiles each time', eq: ['3, 5, 7'] },
        together: [GF(2, 1, 4), NX(5, 4, 4, 2)],
        cue: 'Find the step: how much each term adds or takes away. Keep it the same.',
        own: [NX(40, -5, 4, 2), NX(12, 6, 3, 2), NX(100, -10, 3, 3)]
      },
      p1: {
        show: { cap: 'Take away 3 each time', eq: ['30, 27, 24, 21'] },
        items: [NX(2, 2, 4, 2), NX(10, 5, 4, 2), NX(50, -5, 4, 2), NX(3, 3, 4, 2), GF(1, 2, 4), NX(20, -2, 4, 2)]
      },
      p2: {
        items: [GF(2, 2, 4), NX(7, 4, 3, 3), NX(90, -9, 3, 3), NX(25, 25, 3, 3), NX(64, -8, 3, 3), NX(11, 11, 3, 3)]
      },
      p3: {
        items: [GF(3, 1, 5), NX(150, -15, 3, 3), NX(6, 7, 3, 3), NX(1000, -100, 3, 3),
          story('{a} reads 12 pages on day 1 and 4 more pages each day after. How many pages on day 5?', 'pages', 28, '12 + (5 − 1) × 4'),
          NX(13, 9, 3, 3)]
      },
      think: {
        items: [{ q: '{b} says 4, 8, 12, 16 grows by a different amount each time. Is {b} right?', lines: { n: 3, key: 'No. It adds 4 every time.' } },
          { q: 'Draw figure 4 of this pattern.', pic: ['grow', { m: 2, b: 1, k: 3 }], draw: { h: 50, key: '1 shaded tile and 2 rows of 4: 9 tiles.' } },
          { q: 'Make a shrinking pattern that starts at 60.', lines: { n: 1, key: 'For example: 60, 54, 48, 42.' } },
          { q: 'How is a growing pattern different from a repeating one?', lines: { n: 3, key: 'A growing pattern keeps getting bigger by a step. A repeating one comes back to its core.' } }]
      }
    },

    table: {
      watch: 'adding the step to the figure number to predict far ahead. Use the rule: start, then add the step for each figure after.',
      goal: 'I can use a pattern rule to predict.',
      learn: {
        show: { cap: 'Start at 3, add 2 each time', eq: ['3, 5, 7, 9', 'figure 10: 3 + 9 × 2 = 21'] },
        together: [SQ([4, 7, 10], 5), SQ([2, 6, 10], 6)],
        cue: 'Start at the first term. Add the step once for each figure after it.',
        own: [SQ([5, 10, 15], 6), SQ([1, 4, 7], 8), SQ([6, 8, 10], 10)]
      },
      p1: {
        show: { cap: 'Start at 5, add 3', eq: ['5, 8, 11, 14'] },
        items: [SQ([2, 4, 6], 6), SQ([3, 6, 9], 7), SQ([5, 7, 9], 6), SQ([10, 20, 30], 8), SQ([1, 3, 5], 7), SQ([4, 8, 12], 6)]
      },
      p2: {
        items: [SQ([3, 8, 13], 6), SQ([2, 9, 16], 5), SQ([7, 10, 13], 10), SQ([6, 12, 18], 10), GF(2, 3, 10), GF(3, 1, 10)]
      },
      p3: {
        items: [SQ([5, 9, 13], 20), SQ([1, 6, 11], 12), SQ([8, 11, 14], 25), GF(4, 0, 12),
          story('A tower has 3 blocks. {a} adds 5 blocks each minute. How many blocks after 8 minutes?', 'blocks', 43, '3 + 8 × 5'),
          SQ([20, 30, 40], 15)]
      },
      think: {
        items: [{ q: '{b} says figure 10 of 3, 5, 7 is 12 because 10 + 2 = 12. What went wrong?', lines: { n: 3, key: 'Start at 3 and add 2 nine times: 3 + 9 × 2 = 21.' } },
          { q: 'Write the rule for 6, 11, 16, 21.', lines: { n: 2, key: 'Start at 6, add 5 each time.' } },
          { q: 'Make a table for "start at 2, add 4" for figures 1 to 5.', draw: { h: 90, key: '1: 2, 2: 6, 3: 10, 4: 14, 5: 18.' } },
          SQ([9, 12, 15], 30)]
      }
    },

    missing: {
      watch: 'finding the step from numbers that are not side by side. Use two terms next to each other.',
      goal: 'I can find missing terms in a pattern.',
      learn: {
        show: { cap: 'Step from 8 to 12: add 4', eq: ['4, 8, 12, 16, 20'] },
        together: [{ eq: ['3, 6, [], 12, 15'], a: [9] }, { eq: ['50, 45, [], 35, []'], a: [40, 30] }],
        cue: 'Find the step from two terms side by side. Use it to fill the gaps.',
        own: [{ eq: ['10, 20, [], 40, []'], a: [30, 50] }, { eq: ['7, 9, [], [], 15'], a: [11, 13] }, { eq: ['90, 80, [], [], 50'], a: [70, 60] }, { eq: ['5, 11, [], 23, []'], a: [17, 29] }]
      },
      p1: {
        show: { cap: 'Add 5 each time', eq: ['5, 10, 15, 20'] },
        items: [{ eq: ['2, 4, [], 8, 10'], a: [6] }, { eq: ['5, 10, [], 20, 25'], a: [15] }, { eq: ['30, 27, [], 21, 18'], a: [24] },
          { eq: ['1, 4, [], 10, []'], a: [7, 13] }, { eq: ['100, 90, [], 70, []'], a: [80, 60] }, { eq: ['6, 12, 18, [], []'], a: [24, 30] }]
      },
      p2: {
        items: [{ eq: ['15, 25, [], [], 55'], a: [35, 45] }, { eq: ['64, 56, [], [], 32'], a: [48, 40] }, { eq: ['9, 18, [], 36, []'], a: [27, 45] },
          { eq: ['3, 10, [], 24, []'], a: [17, 31] }, { eq: ['200, 175, [], 125, []'], a: [150, 100] }, { eq: ['12, 23, [], 45, []'], a: [34, 56] }]
      },
      p3: {
        items: [{ eq: ['8, 15, [], [], 36'], a: [22, 29] }, { eq: ['500, 450, [], [], 300'], a: [400, 350], wide: true }, { eq: ['14, 26, [], 50, []'], a: [38, 62] },
          { eq: ['[], 9, 13, 17, []'], a: [5, 21], by: 4 }, { eq: ['[], 70, 63, [], 49'], a: [77, 56], by: -7 },
          story('A {cont} has 6 {many} on Monday, 10 on Tuesday and 14 on Wednesday. How many on Friday?', '{many}', 22, '14 + (14 − 10) + (14 − 10)')]
      },
      think: {
        items: [{ q: '{b} filled 4, [], 12 with 6. What went wrong?', lines: { n: 3, key: '4 to 12 is two steps of 4. The missing term is 8.' } },
          { q: 'Make a pattern with two missing terms for a partner.', lines: { n: 2, key: 'For example: 6, 9, __, 15, __ (12 and 18).' } },
          { q: 'How did you find the first term when it is missing?', lines: { n: 3, key: 'Go back one step: take the step away from the second term.' } },
          { eq: ['[], [], 18, 24, 30'], a: [6, 12], by: 6 }]
      }
    },

    tenths: {
      watch: 'writing 0.10 after 0.9. Ten tenths make one whole, so 0.9 + 0.1 = 1.0.',
      goal: 'I can extend a pattern that counts by tenths.',
      learn: {
        show: { pic: ['dline', { min: 0.6, max: 1.4, d: 10, show: 'dec' }], eq: ['0.8, 0.9, 1.0, 1.1'] },
        together: [NX(0.2, 0.2, 3, 2), NX(1.7, 0.1, 3, 2)],
        cue: 'Think in tenths. 10 tenths make 1 whole.',
        own: [NX(0.5, 0.1, 3, 3), NX(3, -0.5, 3, 2), NX(0.3, 0.3, 3, 2), NX(2.8, 0.1, 3, 3)]
      },
      p1: {
        show: { cap: 'Add 2 tenths each time', eq: ['0.2, 0.4, 0.6, 0.8'] },
        items: [NX(0.1, 0.1, 3, 3), NX(0.4, 0.2, 3, 2), NX(1.5, 0.5, 3, 2), NX(4.6, 0.1, 3, 3), NX(2, -0.2, 3, 2), NX(0.6, 0.3, 3, 2)]
      },
      p2: {
        items: [NX(5.7, 0.1, 2, 3), NX(3.5, -0.5, 3, 3), NX(0.4, 0.4, 3, 2), NX(9.8, 0.1, 2, 3), NX(2.4, -0.3, 3, 2), NX(1.2, 1.2, 3, 2)]
      },
      p3: {
        items: [{ eq: ['0.3, 0.6, [], 1.2, []'], a: [0.9, 1.5] }, { eq: ['4.0, 3.6, [], 2.8, []'], a: [3.2, 2.4] },
          story('A plant grows 0.2 cm a day. It is 1.6 cm tall today. How tall in 3 days?', 'cm', 2.2, '1.6 + 3 × 0.2'),
          story('{a} runs 1.5 km on day 1 and 0.5 km more each day. How far on day 4?', 'km', 3, '1.5 + (4 − 1) × 0.5'),
          NX(7.5, -0.5, 3, 3), NX(0.7, 0.7, 3, 2)]
      },
      think: {
        items: [{ q: '{b} counted 0.7, 0.8, 0.9, 0.10. What went wrong?', lines: { n: 3, key: 'After 9 tenths comes 10 tenths, which is 1 whole: 1.0, not 0.10.' } },
          { q: 'Make a pattern that counts by 0.5 from 0.', lines: { n: 1, key: '0, 0.5, 1.0, 1.5, 2.0, 2.5' } },
          { q: 'Show 0.4, 0.8, 1.2 on a number line.', draw: { h: 70, key: 'A line from 0 to 2 in tenths with jumps of 4 tenths.' } },
          NX(0.4, 0.4, 3, 2)]
      }
    },

    balance: {
      watch: 'adding all the numbers you see (n + 5 = 12 gives 17). The two sides are equal: what makes n + 5 the same as 12?',
      goal: 'I can find the number that keeps an equation balanced.',
      learn: {
        show: { pic: ['balance', { l: 'n + 5', r: 12, tilt: 0 }], cap: 'Both sides are equal', eq: ['n + 5 = 12', 'n = 7'] },
        together: [SV('n + 3 = 10', 7), SV('n − 4 = 6', 10)],
        cue: 'What number makes both sides the same? Put it in and check.',
        own: [SV('n + 8 = 15', 7), SV('n − 2 = 9', 11), SV('4 × n = 20', 5), SV('12 = n + 5', 7)]
      },
      p1: {
        show: { cap: 'Check: 6 + 4 = 10', eq: ['n + 4 = 10', 'n = 6'] },
        items: [SV('n + 2 = 9', 7), SV('n + 6 = 14', 8), SV('n − 3 = 5', 8), SV('2 × n = 12', 6), SV('n + 10 = 25', 15), SV('n − 7 = 7', 14)]
      },
      p2: {
        items: [SV('n + 15 = 40', 25), SV('n − 12 = 20', 32), SV('5 × n = 35', 7), SV('30 = n + 18', 12), SV('n × 3 = 27', 9),
          { q: '{a} has some {many}. After 8 more, {a} has 21. How many at the start?', eq: ['n + 8 = 21', 'n = []'], a: [13], solve: 'n + 8 = 21' }]
      },
      p3: {
        items: [SV('n + 125 = 300', 175), SV('n − 45 = 55', 100), SV('6 × n = 54', 9), SV('64 = 8 × n', 8),
          { q: '4 {conts} hold 32 {many}. Each holds the same. How many in each?', eq: ['4 × n = 32', 'n = []'], a: [8], solve: '4 × n = 32' },
          TF('9 + 6 = 15', true, 'Is n = 9 the answer to n + 6 = 15?')]
      },
      think: {
        items: [{ q: '{b} says n + 5 = 12 means n = 17. What went wrong?', lines: { n: 3, key: '{b} added 5 and 12. The sides must be equal: 7 + 5 = 12, so n = 7.' } },
          { q: 'Write an equation with n = 6 as the answer.', lines: { n: 1, key: 'For example: n + 4 = 10, or 3 × n = 18.' } },
          { q: 'Why is an equation like a balance?', lines: { n: 3, key: 'Both sides have the same value, so it stays level.' } },
          SV('n + 47 = 100', 53)]
      }
    },

    undo: {
      watch: 'doing the same operation instead of the opposite (n − 4 = 6, so n = 2). Undo subtracting by adding.',
      goal: 'I can solve an equation by doing the opposite.',
      learn: {
        show: { cap: 'Undo + 9 with − 9', eq: ['n + 9 = 15', '15 − 9 = 6', 'n = 6'] },
        together: [SV('n + 7 = 20', 13), SV('n × 4 = 28', 7)],
        cue: 'Adding is undone by subtracting. Multiplying is undone by dividing.',
        own: [SV('n − 6 = 10', 16), SV('n ÷ 2 = 8', 16), SV('n × 5 = 45', 9), SV('n + 14 = 30', 16)]
      },
      p1: {
        show: { cap: 'Undo × 3 with ÷ 3', eq: ['n × 3 = 18', '18 ÷ 3 = 6', 'n = 6'] },
        items: [SV('n + 4 = 11', 7), SV('n − 5 = 4', 9), SV('n × 2 = 16', 8), SV('n ÷ 3 = 5', 15), SV('n + 9 = 20', 11), SV('n × 10 = 70', 7)]
      },
      p2: {
        items: [SV('n − 18 = 32', 50), SV('n ÷ 4 = 9', 36), SV('n × 6 = 48', 8), SV('n + 36 = 80', 44), SV('n ÷ 5 = 7', 35), SV('n − 99 = 1', 100)]
      },
      p3: {
        items: [SV('n × 8 = 72', 9), SV('n ÷ 10 = 12', 120), SV('n + 250 = 1000', 750), SV('n − 125 = 375', 500),
          { q: '{a} shares some {many} into 6 {conts}. Each gets 7. How many {many}?', eq: ['n ÷ 6 = 7', 'n = []'], a: [42], solve: 'n ÷ 6 = 7' },
          { q: '{b} spends $15 and has $28 left. How much at the start?', eq: ['n − 15 = 28', 'n = []'], a: [43], solve: 'n − 15 = 28' }]
      },
      think: {
        items: [{ q: '{b} solved n − 4 = 6 and got n = 2. What went wrong?', lines: { n: 3, key: '{b} subtracted again. Undo − 4 by adding 4: n = 10. Check: 10 − 4 = 6.' } },
          { q: 'What undoes ÷ 5? Explain.', lines: { n: 2, key: '× 5. Dividing into 5 groups is undone by putting 5 groups back together.' } },
          { q: 'Write a story for n × 3 = 24.', lines: { n: 3, key: 'For example: 3 {conts} hold 24 {many}; n = 8 in each.' } },
          SV('n ÷ 9 = 9', 81)]
      }
    },

    ineq: {
      watch: 'counting the edge as an answer. For n + 4 < 11 the edge is 7, and 7 + 4 is not less than 11.',
      goal: 'I can find the numbers that make an inequality true.',
      learn: {
        show: { cap: 'Many answers: 0 to 6', eq: ['n + 4 < 11', '6 + 4 = 10, and 10 < 11'] },
        together: [IQ('n + 3 < 8', 4, 'most'), IQ('n − 2 > 5', 8, 'least')],
        cue: 'Find the edge with =. For < or >, the edge itself is not an answer.',
        own: [IQ('n + 6 < 15', 8, 'most'), IQ('n + 1 > 9', 9, 'least'), IQ('2 × n < 12', 5, 'most'), TF('5 + 7 < 12', false, 'Is 5 an answer to n + 7 < 12?')]
      },
      p1: {
        show: { cap: 'Test a number', eq: ['n + 2 > 6', '5 + 2 = 7, and 7 > 6'] },
        items: [IQ('n + 5 < 9', 3, 'most'), IQ('n + 2 > 7', 6, 'least'), IQ('n − 1 < 6', 6, 'most'), IQ('3 × n > 12', 5, 'least'),
          TF('3 + 4 < 9', true, 'Is 3 an answer to n + 4 < 9?'), TF('8 − 3 > 6', false, 'Is 8 an answer to n − 3 > 6?')]
      },
      p2: {
        items: [IQ('n + 12 < 20', 7, 'most'), IQ('n − 5 > 10', 16, 'least'), IQ('4 × n < 30', 7, 'most'), IQ('5 × n > 22', 5, 'least'),
          TF('10 + 15 > 24', true, 'Is 10 an answer to n + 15 > 24?'), TF('6 × 4 < 24', false, 'Is 6 an answer to 4 × n < 24?')]
      },
      p3: {
        items: [IQ('n + 35 < 60', 24, 'most'), IQ('6 × n > 40', 7, 'least'),
          { q: 'Each {one} costs $4. {a} has less than $30 to spend. What is the most {a} can buy?', eq: ['4 × n < 30', 'n = []'], a: [7], ineq: '4 × n < 30', edge: 'most' },
          { q: 'A {cont} holds more than 25 {many}. They come in bags of 5. What is the least number of bags?', eq: ['5 × n > 25', 'n = []'], a: [6], ineq: '5 × n > 25', edge: 'least' },
          TF('0 + 9 > 9', false, 'Is 0 an answer to n + 9 > 9?'), IQ('n − 8 < 20', 27, 'most')]
      },
      think: {
        items: [{ q: '{b} says 7 is an answer to n + 4 < 11. Is {b} right?', lines: { n: 3, key: 'No. 7 + 4 = 11, and 11 is not less than 11. The greatest answer is 6.' } },
          { q: 'How is an inequality different from an equation?', lines: { n: 3, key: 'An equation has one answer. An inequality can have many.' } },
          { q: 'Write an inequality where 5 is the greatest whole number answer.', lines: { n: 1, key: 'For example: n < 6, or n + 2 < 8.' } },
          IQ('n + 19 < 50', 30, 'most')]
      }
    },

    loops: {
      watch: 'running the loop one time too many or too few. Trace one pass at a time and keep a count.',
      goal: 'I can trace code with a loop.',
      learn: {
        show: { pic: ['code', { lines: ['repeat 4 times', '  move forward 3', '  turn right'] }], cap: 'A square: 4 × 3 = 12 squares' },
        together: [CD(['repeat 3 times', '  move forward 2'], 6, '3 × 2'), CD(['repeat 5 times', '  move forward 4'], 20, '5 × 4')],
        cue: 'The steps inside the loop run once for every repeat.',
        own: [CD(['repeat 4 times', '  move forward 5', '  turn right'], 20, '4 × 5'), CD(['move forward 1', 'repeat 2 times', '  move forward 6'], 13, '1 + 2 × 6')]
      },
      p1: {
        show: { pic: ['code', { lines: ['repeat 2 times', '  move forward 4'] }], cap: '4, then 4 again: 8' },
        items: [CD(['repeat 3 times', '  move forward 3'], 9, '3 × 3'), CD(['repeat 4 times', '  move forward 2'], 8, '4 × 2'),
          CD(['repeat 6 times', '  move forward 1'], 6, '6 × 1'), CD(['repeat 2 times', '  move forward 7'], 14, '2 × 7')]
      },
      p2: {
        items: [CD(['move forward 2', 'repeat 3 times', '  move forward 4'], 14, '2 + 3 × 4'), CD(['repeat 4 times', '  move forward 6', '  turn left'], 24, '4 × 6'),
          CD(['set total to 10', 'repeat 3 times', '  add 5 to total'], 25, '10 + 3 × 5', 'What is the total at the end?'),
          CD(['set total to 30', 'repeat 4 times', '  take 6 from total'], 6, '30 − 4 × 6', 'What is the total at the end?')]
      },
      p3: {
        items: [CD(['repeat 5 times', '  move forward 3', 'move forward 2'], 17, '5 × 3 + 2'), CD(['set total to 0', 'repeat 6 times', '  add 8 to total'], 48, '6 × 8', 'What is the total at the end?'),
          CD(['set total to 100', 'repeat 5 times', '  take 15 from total'], 25, '100 − 5 × 15', 'What is the total at the end?'),
          { q: 'The robot must move 12 squares. Fill in the loop.', pic: ['code', { lines: ['repeat ? times', '  move forward 3'] }], eq: ['[] × 3 = 12'], a: [4] }]
      },
      think: {
        items: [{ q: '{b} says this code moves the robot 5 squares: repeat 3 times, move forward 2. What went wrong?', lines: { n: 3, key: '{b} added 3 + 2. The loop runs 2 squares 3 times: 6.' } },
          { q: 'Write code with a loop that draws a square with sides of 4.', lines: { n: 3, key: 'repeat 4 times: move forward 4, turn right.' } },
          { q: 'Change one number so the robot moves 15 squares: repeat 3 times, move forward 4.', lines: { n: 2, key: 'Move forward 5 (or repeat 5 times, move forward 3 by changing both).' } },
          CD(['repeat 7 times', '  move forward 3'], 21, '7 × 3')]
      }
    },

    nested: {
      watch: 'running the inside loop only once. The inside loop runs all the way through every time the outside loop runs.',
      goal: 'I can trace a loop inside a loop.',
      learn: {
        show: { pic: ['code', { lines: ['repeat 3 times', '  repeat 2 times', '    move forward 2', '  turn right'] }], cap: '3 × 2 × 2 = 12 squares' },
        together: [CD(['repeat 2 times', '  repeat 3 times', '    move forward 1'], 6, '2 × 3 × 1'), CD(['repeat 4 times', '  repeat 2 times', '    move forward 1'], 8, '4 × 2 × 1')],
        cue: 'Multiply: outside repeats × inside repeats × the move.',
        own: [CD(['repeat 2 times', '  repeat 2 times', '    move forward 3'], 12, '2 × 2 × 3'), CD(['repeat 3 times', '  repeat 4 times', '    move forward 1'], 12, '3 × 4 × 1')]
      },
      p1: {
        show: { cap: 'Inside: 2 × 3 = 6. Outside: 2 × 6 = 12', eq: ['2 × 2 × 3 = 12'] },
        items: [CD(['repeat 2 times', '  repeat 2 times', '    move forward 1'], 4, '2 × 2 × 1'), CD(['repeat 3 times', '  repeat 2 times', '    move forward 1'], 6, '3 × 2 × 1'),
          CD(['repeat 2 times', '  repeat 5 times', '    move forward 1'], 10, '2 × 5 × 1'), CD(['repeat 2 times', '  repeat 3 times', '    move forward 2'], 12, '2 × 3 × 2')]
      },
      p2: {
        items: [CD(['repeat 4 times', '  repeat 3 times', '    move forward 2', '  turn right'], 24, '4 × 3 × 2'), CD(['repeat 3 times', '  repeat 3 times', '    move forward 3'], 27, '3 × 3 × 3'),
          CD(['repeat 5 times', '  repeat 2 times', '    move forward 4'], 40, '5 × 2 × 4'), CD(['repeat 2 times', '  repeat 4 times', '    move forward 5', '  turn left'], 40, '2 × 4 × 5')]
      },
      p3: {
        items: [CD(['repeat 3 times', '  move forward 1', '  repeat 2 times', '    move forward 4'], 27, '3 × (1 + 2 × 4)'), CD(['repeat 2 times', '  repeat 6 times', '    move forward 3'], 36, '2 × 6 × 3'),
          CD(['set total to 0', 'repeat 3 times', '  repeat 4 times', '    add 2 to total'], 24, '3 × 4 × 2', 'What is the total at the end?'),
          { q: 'The robot must move 24 squares. Fill in the outside loop.', pic: ['code', { lines: ['repeat ? times', '  repeat 3 times', '    move forward 2'] }], eq: ['[] × 3 × 2 = 24'], a: [4] }]
      },
      think: {
        items: [{ q: '{b} says repeat 3 times, repeat 2 times, move forward 2 moves 7 squares. What went wrong?', lines: { n: 3, key: '{b} added. The inside loop moves 2 × 2 = 4 each time, 3 times: 12.' } },
          { q: 'Write a nested loop that moves the robot 18 squares.', lines: { n: 3, key: 'For example: repeat 3 times, repeat 3 times, move forward 2.' } },
          { q: 'Why use a loop inside a loop?', lines: { n: 3, key: 'To repeat a group of repeated steps without writing them all out.' } },
          CD(['repeat 5 times', '  repeat 5 times', '    move forward 2'], 50, '5 × 5 × 2')]
      }
    }
  } });
})();
