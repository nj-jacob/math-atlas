/* Grade 5 Patterns and Algebra: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/patterns-algebra.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: C1.1 repeating, growing and shrinking patterns; C1.2 and C1.3 pattern rules, tables and the term for
   any figure; C1.4 patterns with decimals; C2.1 and C2.2 variables and expressions; C2.3 equations; C2.4 inequalities;
   C3.1 and C3.2 code with loops and conditions. The answer checks are in tests/verify/sheets.js: a pattern's next
   terms keep its step or core, a figure's tiles follow m × n + b from the picture or the first terms (seq), and a
   letter's value is put back in to check (expr, solve, ineq). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* the next terms of a growing or shrinking pattern: first terms shown, k blanks */
  function NX(start, step, shown, k) {
    var t = [], a = [];
    for (var i = 0; i < shown + k; i++) { var v = +(start + i * step).toFixed(2); if (i < shown) t.push(v); else { t.push('[]'); a.push(v); } }
    return { eq: [t.join(', ').replace(/\[\],/g, '[],')], a: a, wide: true };
  }
  /* the next terms of a repeating pattern */
  function RP(core, reps, k) {
    var t = [], a = [];
    for (var i = 0; i < core.length * reps + k; i++) { var v = core[i % core.length]; if (i < core.length * reps) t.push(v); else { t.push('[]'); a.push(v); } }
    return { eq: [t.join(', ')], a: a, core: core.length, wide: true };
  }
  /* a figure's tiles from a picture (m rows of n plus b), and the rule */
  function GF(m, b, n) { return { pic: ['grow', { m: m, b: b, k: 3 }], q: 'How many tiles in figure ' + n + '?', eq: ['[] tiles'], a: [m * n + b], fig: n }; }
  function GR(m, b) { return { pic: ['grow', { m: m, b: b, k: 3 }], q: 'Write the rule.', eq: ['[] × n + []'], a: [m, b], rule: true }; }
  /* from the first three terms: the term for figure n */
  function SQ(seq, n) { return { q: 'Figures 1, 2, 3 have ' + seq.join(', ') + ' tiles. Figure ' + n + '?', eq: ['[] tiles'], a: [seq[0] + (seq[1] - seq[0]) * (n - 1)], seq: seq, fig: n }; }
  /* evaluate an expression */
  function EV(e, n) {
    var v = Function('n', 'return ' + e.replace(/(\d)n/g, '$1*n').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'))(n);
    return { q: 'n = ' + n, eq: [e + ' = []'], a: [v], expr: e, n: n };
  }
  /* solve an equation for n */
  function SV(e, v) { return { eq: [e, 'n = []'], a: [v], solve: e }; }
  /* the greatest or least whole number that makes an inequality true */
  function IQ(e, v, edge) { return { q: (edge === 'most' ? 'Greatest' : 'Least') + ' whole number n:', eq: [e, 'n = []'], a: [v], ineq: e, edge: edge }; }
  /* trace a short program */
  function CD(lines, ans, calc, q) { return { q: q || 'What is the total at the end?', pic: ['code', { lines: lines }], eq: ['[]'], a: [ans], calc: calc }; }

  S.register('patterns-algebra', { code: 'PA', ideas: {

    kinds: {
      watch: 'mixing up the kinds: a pattern that goes up and down again is repeating, not growing. Find what changes from one term to the next.',
      goal: 'I can extend repeating, growing and shrinking patterns.',
      learn: {
        show: { eq: ['5, 9, 13, 17', '+4 each time: growing'] },
        together: [NX(3, 5, 4, 2), RP([2, 7, 4], 2, 2)],
        cue: 'Find what changes from one term to the next. Keep that change going.',
        own: [NX(40, -6, 4, 2), RP([1, 1, 5], 2, 3), NX(12, 12, 3, 2)]
      },
      p1: {
        show: { eq: ['60, 52, 44, 36', '−8 each time: shrinking'] },
        items: [NX(4, 3, 4, 2), NX(90, -10, 4, 2), RP([6, 3], 2, 2), NX(25, 25, 3, 2), NX(100, -15, 3, 2)]
      },
      p2: {
        items: [NX(7, 9, 3, 3), NX(250, -25, 3, 3), RP([4, 8, 8], 2, 3), NX(1000, -125, 3, 2), NX(13, 13, 3, 3), RP([9, 0, 1, 0], 2, 2)]
      },
      p3: {
        items: [NX(1, 11, 3, 3), NX(500, -45, 3, 3), { eq: ['3, 7, 11, [], 19, []'], a: [15, 23], wide: true },
          { eq: ['80, [], 66, 59, []'], a: [73, 52], wide: true },
          story('{a} saves $15 each week. After week 1 there is $40. How much after week 4?', 'dollars', 85, '40 + (4 − 1) × 15')]
      },
      think: {
        items: [{ q: 'Is 2, 4, 2, 4, 2, 4 growing or repeating? How do you know?', lines: { n: 3, key: 'Repeating. The core 2, 4 repeats. It does not keep going up.' } },
          { q: 'Make a shrinking pattern that starts at 50.', lines: { n: 1, key: 'For example 50, 45, 40, 35, 30.' } },
          { q: 'Will 100 be in the pattern 4, 8, 12, 16, ...? Why?', lines: { n: 3, key: 'Yes. The pattern counts by 4, and 100 = 4 × 25.' } },
          NX(2, 7, 4, 2)]
      }
    },

    tiles: {
      watch: 'adding the step to the figure number instead of multiplying (figure 10 of 3n + 2 is not 15). The step is how many tiles each figure adds.',
      goal: 'I can write a rule for a growing pattern and use it for any figure.',
      learn: {
        show: { pic: ['grow', { m: 3, b: 2, k: 3 }], cap: '3 more each time, 2 that never change', eq: ['3 × n + 2'] },
        together: [GF(2, 1, 4), GR(2, 1)],
        cue: 'The step is the number in front of n. The extra is what never changes.',
        own: [GF(3, 1, 5), GR(3, 1)]
      },
      p1: {
        show: { pic: ['grow', { m: 2, b: 3, k: 3 }], eq: ['2 × n + 3', 'figure 10: 2 × 10 + 3 = 23'] },
        items: [GF(2, 2, 4), GR(2, 2), GR(1, 3), GF(1, 3, 10), SQ([4, 6, 8], 5)]
      },
      p2: {
        items: [SQ([5, 8, 11], 6), SQ([4, 9, 14], 10), SQ([7, 9, 11], 20), GR(4, 1),
          { q: 'Figures 1, 2, 3 have 6, 10, 14 tiles. Write the rule.', eq: ['[] × n + []'], a: [4, 2], seq: [6, 10, 14], rule: true },
          { q: 'Figures 1, 2, 3 have 7, 12, 17 tiles. Write the rule.', eq: ['[] × n + []'], a: [5, 2], seq: [7, 12, 17], rule: true }]
      },
      p3: {
        items: [SQ([6, 11, 16], 50), SQ([9, 12, 15], 100), GF(3, 2, 25),
          { q: 'Figures 1, 2, 3 have 10, 16, 22 tiles. Write the rule.', eq: ['[] × n + []'], a: [6, 4], seq: [10, 16, 22], rule: true },
          SQ([3, 7, 11], 15)]
      },
      think: {
        items: [{ q: '{b} says figure 10 of the rule 3 × n + 2 has 15 tiles. What went wrong?', lines: { n: 3, key: '{b} added 3 + 10 + 2. It is 3 × 10 + 2 = 32.' } },
          { q: 'Draw figure 4 of this pattern.', pic: ['grow', { m: 2, b: 1, k: 3 }], draw: { h: 50, key: '1 shaded tile and 2 rows of 4: 9 tiles.' } },
          { q: 'Can a figure in the pattern 5, 8, 11, ... have 40 tiles? Explain.', lines: { n: 3, key: 'No. 3 × n + 2 = 40 needs 3 × n = 38, and 38 is not in the 3 facts.' } },
          SQ([2, 6, 10], 12)]
      }
    },

    tenths: {
      watch: 'writing 0.10 after 0.9. Ten tenths make one whole, so 0.9 + 0.1 = 1.0.',
      goal: 'I can count by tenths and hundredths past a whole.',
      learn: {
        show: { pic: ['dline', { min: 0.7, max: 1.3, d: 10, show: 'dec' }], eq: ['0.8, 0.9, 1.0, 1.1'] },
        together: [NX(0.6, 0.1, 3, 2), NX(1.97, 0.01, 2, 3)],
        cue: '10 tenths make 1 whole. 10 hundredths make 1 tenth.',
        own: [NX(2.7, 0.1, 3, 3), NX(0.95, 0.01, 3, 3)]
      },
      p1: {
        show: { eq: ['3.8, 3.9, 4.0, 4.1', '4.0 is the same as 4'] },
        items: [NX(0.3, 0.1, 3, 3), NX(4.6, 0.1, 3, 3), NX(0.07, 0.01, 2, 3), NX(1.5, 0.2, 3, 2), NX(5.2, -0.1, 3, 3)]
      },
      p2: {
        items: [NX(9.7, 0.1, 2, 3), NX(0.88, 0.04, 3, 2), NX(2.5, 0.5, 3, 3), NX(3.15, -0.05, 3, 3), NX(7.94, 0.02, 3, 3), NX(1.2, -0.3, 3, 2)]
      },
      p3: {
        items: [{ eq: ['0.4, 0.8, [], 1.6, []'], a: [1.2, 2], wide: true }, { eq: ['5.0, 4.75, [], 4.25, []'], a: [4.5, 4], wide: true },
          story('A plant grows 0.3 cm a day. It is 2.4 cm tall today. How tall in 3 days?', 'cm', 3.3, '2.4 + 3 × 0.3'),
          story('{a} runs 1.5 km on day 1 and 0.25 km more each day. How far on day 5?', 'km', 2.5, '1.5 + (5 − 1) × 0.25'),
          NX(0.09, 0.03, 3, 3)]
      },
      think: {
        items: [{ q: '{b} counted 0.7, 0.8, 0.9, 0.10. What went wrong?', lines: { n: 3, key: 'After 9 tenths comes 10 tenths, which is 1 whole: 1.0, not 0.10.' } },
          { q: 'Make a pattern that counts by 0.25 from 0.', lines: { n: 1, key: '0, 0.25, 0.5, 0.75, 1, 1.25' } },
          { q: 'Which comes after 2.99 when counting by hundredths?', pick: { opts: ['2.100', '3.00', '2.10'], ans: 1, val: 3 } },
          NX(0.5, 0.5, 3, 3)]
      }
    },

    variables: {
      watch: 'reading 3n as 3 and n side by side (34 for n = 4). 3n means 3 × n.',
      goal: 'I can work out an expression for a given value.',
      learn: {
        show: { eq: ['3n + 2, n = 4', '3 × 4 + 2 = 14'] },
        together: [EV('2n + 5', 3), EV('4n − 1', 5)],
        cue: '3n means 3 × n. Put in the number, multiply, then add or subtract.',
        own: [EV('5n + 3', 2), EV('6n − 4', 3), EV('n + 9', 7)]
      },
      p1: {
        show: { eq: ['10 − 2n, n = 3', '10 − 2 × 3 = 4'] },
        items: [EV('3n + 1', 5), EV('2n − 3', 6), EV('7n', 4), EV('n − 8', 20), EV('4n + 4', 0)]
      },
      p2: {
        items: [EV('9n + 2', 3), EV('20 − 3n', 4), EV('5n + 5', 10), EV('8n − 6', 2), EV('12n', 3), EV('50 − 4n', 6)]
      },
      p3: {
        items: [EV('2n + 3n', 4), EV('n × n', 6), EV('100 − 7n', 9),
          EV('8n', 7),
          { q: '{a} has n {many}. {b} has 5 more. Write the expression for {b}.', eq: ['n + []'], a: [5], expr: 'n + 5', n: 0 }]
      },
      think: {
        items: [{ q: '{b} says 3n is 34 when n = 4. What went wrong?', lines: { n: 3, key: '3n means 3 × n, so it is 3 × 4 = 12, not 34.' } },
          { q: 'Write a story for the expression 4n + 2.', lines: { n: 3, key: 'For example: 4 tickets cost n dollars each, plus $2 to park.' } },
          EV('6n + 6', 5),
          EV('3n − 6', 10)]
      }
    },

    balance: {
      watch: 'doing a step to one side only. An equation is a balance: do the same thing to both sides, then check.',
      goal: 'I can solve an equation and check the answer.',
      learn: {
        show: { pic: ['balance', { l: 'n + 4', r: 11, tilt: 0 }], eq: ['n + 4 = 11', 'take 4 from both sides', 'n = 7'] },
        together: [SV('n + 6 = 15', 9), SV('3n = 24', 8)],
        cue: 'Do the same thing to both sides. Then put the answer back in to check.',
        own: [SV('n − 5 = 12', 17), SV('4n = 36', 9), SV('n + 13 = 30', 17)]
      },
      p1: {
        show: { eq: ['5n = 40', 'divide both sides by 5', 'n = 8'] },
        items: [SV('n + 8 = 20', 12), SV('n − 7 = 3', 10), SV('6n = 42', 7), SV('n + 25 = 60', 35), SV('2n = 18', 9)]
      },
      p2: {
        items: [SV('2n + 1 = 15', 7), SV('3n − 4 = 20', 8), SV('n ÷ 4 = 6', 24), SV('5n + 5 = 40', 7), SV('10n = 120', 12), SV('4n − 3 = 25', 7)]
      },
      p3: {
        items: [SV('7n + 2 = 51', 7), SV('36 = 4n', 9),
          { q: '{a} has some {many}. After getting 14 more, {a} has 50. How many at the start?', eq: ['n + 14 = 50', 'n = []'], a: [36], solve: 'n + 14 = 50' },
          { q: '3 {conts} hold 27 {many} in all. How many in each {cont}?', eq: ['3n = 27', 'n = []'], a: [9], solve: '3n = 27' },
          { q: 'Is n = 6 the answer to 4n + 3 = 27?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '4 × 6 + 3 = 27' }]
      },
      think: {
        items: [{ q: '{b} solved n + 4 = 11 and got n = 15. What went wrong?', lines: { n: 3, key: '{b} added 4 instead of taking it away. n = 7, and 7 + 4 = 11 checks.' } },
          { q: 'Write an equation that has n = 6 as its answer.', lines: { n: 1, key: 'For example n + 4 = 10, or 3n = 18.' } },
          SV('2n + 7 = 31', 12),
          { q: 'Why do you do the same thing to both sides?', lines: { n: 3, key: 'So the two sides stay equal, like a balance that stays level.' } }]
      }
    },

    inequality: {
      watch: 'counting the edge as an answer. For n + 3 < 10 the edge is 7, and 7 + 3 is not less than 10.',
      goal: 'I can find the numbers that make an inequality true.',
      learn: {
        show: { eq: ['n + 3 < 10', 'edge: n + 3 = 10, n = 7', 'n can be 0 to 6'] },
        together: [IQ('n + 5 < 12', 6, 'most'), IQ('n − 2 > 8', 11, 'least')],
        cue: 'Find the edge with =. The edge is not an answer for < or >. Test a number on each side.',
        own: [IQ('n + 9 < 20', 10, 'most'), IQ('2n > 14', 8, 'least')]
      },
      p1: {
        show: { eq: ['3n < 15', 'edge: 3n = 15, n = 5', 'n can be 0 to 4'] },
        items: [IQ('n + 4 < 9', 4, 'most'), IQ('n + 1 > 6', 6, 'least'), IQ('4n < 20', 4, 'most'), IQ('n − 3 > 10', 14, 'least'), IQ('n + 12 < 30', 17, 'most')]
      },
      p2: {
        items: [IQ('5n < 42', 8, 'most'), IQ('3n > 20', 7, 'least'), IQ('2n + 1 < 15', 6, 'most'), IQ('n ÷ 2 > 5', 11, 'least'),
          { q: 'Is 9 an answer to n + 6 < 15?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '9 + 6 < 15' },
          { q: 'Is 4 an answer to 3n > 10?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '3 × 4 > 10' }]
      },
      p3: {
        items: [IQ('6n + 2 < 40', 6, 'most'), IQ('4n − 5 > 30', 9, 'least'),
          { q: 'Each {one} costs $3. {a} wants to spend less than $20. What is the most {a} can buy?', eq: ['3n < 20', 'n = []'], a: [6], ineq: '3n < 20', edge: 'most' },
          { q: 'Is 0 an answer to n + 7 > 7?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '0 + 7 > 7' },
          { q: 'Is 10 an answer to 2n < 25?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '2 × 10 < 25' }]
      },
      think: {
        items: [{ q: '{b} says 7 is an answer to n + 3 < 10. Is {b} right?', lines: { n: 3, key: 'No. 7 + 3 = 10, and 10 is not less than 10. The greatest answer is 6.' } },
          { q: 'How is an inequality different from an equation?', lines: { n: 3, key: 'An equation has one answer. An inequality can have many answers.' } },
          IQ('5n + 1 < 33', 6, 'most'),
          { q: 'Write an inequality where 4 is the least whole number answer.', lines: { n: 1, key: 'For example n > 3, or n + 2 > 5.' } }]
      }
    },

    loops: {
      watch: 'running the loop one time too many or too few. Trace one pass at a time and write the total after each pass.',
      goal: 'I can trace code with loops and conditions.',
      learn: {
        show: { pic: ['code', { lines: ['set total to 5', 'repeat 3 times', '  add 4 to total'] }], eq: ['5, 9, 13, 17', 'total = 17'] },
        together: [CD(['set total to 2', 'repeat 4 times', '  add 3 to total'], 14, '2 + 4 × 3'), CD(['set total to 20', 'repeat 3 times', '  take 5 from total'], 5, '20 − 3 × 5')],
        cue: 'Trace one pass at a time. Write the total after each pass.',
        own: [CD(['set total to 1', 'repeat 3 times', '  multiply total by 2'], 8, '1 × 2 × 2 × 2'), CD(['set total to 0', 'repeat 5 times', '  add 6 to total'], 30, '0 + 5 × 6')]
      },
      p1: {
        show: { pic: ['code', { lines: ['set total to 10', 'repeat 2 times', '  add 5 to total'] }], eq: ['10, 15, 20'] },
        items: [CD(['set total to 3', 'repeat 3 times', '  add 2 to total'], 9, '3 + 3 × 2'), CD(['set total to 50', 'repeat 4 times', '  take 10 from total'], 10, '50 − 4 × 10'),
          CD(['set total to 7', 'repeat 2 times', '  add 8 to total'], 23, '7 + 2 × 8'), CD(['set total to 2', 'repeat 4 times', '  multiply total by 2'], 32, '2 × 2 × 2 × 2 × 2')]
      },
      p2: {
        items: [CD(['set total to 4', 'if total > 3', '  add 10 to total', 'otherwise', '  add 1 to total'], 14, '4 + 10'),
          CD(['set total to 2', 'if total > 3', '  add 10 to total', 'otherwise', '  add 1 to total'], 3, '2 + 1'),
          CD(['set total to 1', 'repeat 3 times', '  add 5 to total', 'multiply total by 2'], 32, '(1 + 3 × 5) × 2'),
          CD(['set total to 100', 'repeat 6 times', '  take 15 from total'], 10, '100 − 6 × 15')]
      },
      p3: {
        items: [CD(['set total to 0', 'repeat 4 times', '  add 3 to total', '  add 2 to total'], 20, '0 + 4 × (3 + 2)'),
          CD(['set total to 6', 'repeat 3 times', '  if total < 10', '    add 4 to total'], 14, '6 + 4 + 4'),
          { q: 'How many times must the loop run to reach 25?', pic: ['code', { lines: ['set total to 5', 'repeat ? times', '  add 4 to total'] }], eq: ['[] times'], a: [5], calc: '(25 − 5) ÷ 4' },
          CD(['set total to 1', 'repeat 4 times', '  multiply total by 3'], 81, '1 × 3 × 3 × 3 × 3')]
      },
      think: {
        items: [{ q: '{b} traced: set total to 5, repeat 3 times add 4, and got 21. What went wrong?', lines: { n: 3, key: '{b} ran the loop 4 times. 3 passes: 9, 13, 17.' } },
          { q: 'Write code that ends with total = 20.', lines: { n: 3, key: 'For example: set total to 0, repeat 4 times, add 5 to total.' } },
          CD(['set total to 8', 'if total > 10', '  take 3 from total', 'otherwise', '  add 3 to total'], 11, '8 + 3'),
          { q: 'Why is a loop useful?', lines: { n: 2, key: 'It repeats steps without writing them out again and again.' } }]
      }
    }
  } });
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
})();
