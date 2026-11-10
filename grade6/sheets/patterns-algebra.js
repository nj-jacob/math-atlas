/* Grade 6 Patterns, Equations and Code: printable worksheets (assets/engine/sheets.js). One set per idea of the
   lessons in chapters/patterns-algebra.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made
   at random, so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts}.
   Ontario 2020: C1.1 and C1.4 repeating, growing and shrinking patterns and which are linear; C1.2 and C1.3 tables,
   rules and predictions, and solving for a figure; C2.1 adding like terms; C2.2 evaluating expressions with whole
   numbers and tenths; C2.3 equations with several terms; C2.4 inequalities with two operations, graphed; C3.1 and
   C3.2 code with loops and conditions. The answer checks are in tests/verify/sheets.js: a pattern's next terms keep
   its step, a figure's tiles follow m × n + b from the picture or the first terms (fig, rule, seq), a value for the
   letter is put back in (expr, solve, ineq), like terms must match for any value of the letter (ident), and a
   program's result follows from its numbers (calc). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function val(e, x) { return +Function('x', 'n', 'return ' + e.replace(/(\d)([nx])/g, '$1*$2').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'))(x, x).toFixed(4); }
  /* the next terms of a growing or shrinking pattern */
  function NX(start, step, shown, k) {
    var t = [], a = [];
    for (var i = 0; i < shown + k; i++) { var v = +(start + i * step).toFixed(2); if (i < shown) t.push(v); else { t.push('[]'); a.push(v); } }
    return { eq: [t.join(', ')], a: a, wide: t.join(', ').length > 20 };
  }
  /* tiles in figure n, from a picture of the first figures */
  function GF(m, b, n) { return { pic: ['grow', { m: m, b: b, k: 3 }], q: 'Tiles in figure ' + n + '?', eq: ['[] tiles'], a: [m * n + b], fig: n }; }
  /* the rule m × n + b from a picture */
  function GR(m, b) { return { pic: ['grow', { m: m, b: b, k: 3 }], q: 'Write the rule.', eq: ['[] × n + []'], a: [m, b], rule: true }; }
  /* from the first three terms: figure n */
  function SQ(seq, n) { return { q: 'Figures 1, 2, 3: ' + seq.join(', ') + '. Figure ' + n + '?', eq: ['[]'], a: [seq[0] + (seq[1] - seq[0]) * (n - 1)], seq: seq, fig: n }; }
  /* the rule from the first three terms */
  function TR(m, b) {
    var seq = [m + b, 2 * m + b, 3 * m + b];
    return { q: 'Figures 1, 2, 3: ' + seq.join(', ') + '. Rule?', eq: ['[] × n + []'], a: [m, b], rule: true, seq: seq };
  }
  /* which figure has t tiles: solve m × n + b = t */
  function WB(m, b, t) { var e = m + 'n + ' + b + ' = ' + t; return { q: 'Rule ' + m + 'n + ' + b + '. Which figure has ' + t + '?', eq: [e, 'n = []'], a: [(t - b) / m], solve: e }; }
  /* linear or not */
  function LN(seq) { var lin = seq.every(function (x, i) { return !i || (x - seq[i - 1]).toFixed(4) === (seq[1] - seq[0]).toFixed(4); }); return { q: seq.join(', ') + ', …', pick: { opts: ['linear', 'not linear'], ans: lin ? 0 : 1, lin: seq } }; }
  /* evaluate an expression */
  function EV(e, x, letter) { var l = letter || 'n'; return { q: l + ' = ' + x, eq: [e + ' = []'], a: [val(e, x)], expr: e, n: x }; }
  /* add like terms: the simpler expression */
  function LT(e, ans) { return { eq: [e + ' = []'], a: [ans], ident: true }; }
  /* solve an equation for x */
  function SV(e) {
    var lo = e.split('=')[0], hi = +e.split('=')[1], x = 0;
    while (val(lo, x) !== hi && x < 200) x++;
    return { eq: [e, 'x = []'], a: [x], solve: e };
  }
  /* the greatest or least whole number for an inequality */
  function IQ(e, edge) {
    var x = 0, ok = function (v) { var s = e.split(/([<>])/), l = val(s[0], v), r = +s[2]; return s[1] === '<' ? l < r : l > r; };
    if (edge === 'most') { while (ok(x + 1)) x++; } else { while (!ok(x)) x++; }
    return { q: (edge === 'most' ? 'Greatest' : 'Least') + ' whole number x:', eq: [e, 'x = []'], a: [x], ineq: e, edge: edge };
  }
  /* a program to trace */
  function CD(lines, ans, calc, q) { return { q: q || 'What is the total at the end?', pic: ['code', { lines: lines }], eq: ['[]'], a: [ans], calc: calc }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }

  S.register('patterns-algebra', { code: 'PA', ideas: {

    grow: {
      watch: 'adding the step to the wrong term, or treating a shrinking pattern as growing. Find the change each time first.',
      goal: 'I can extend growing and shrinking patterns.',
      learn: {
        show: { pic: ['grow', { m: 2, b: 1, k: 3 }], cap: '3, 5, 7: add 2 each time', eq: ['3, 5, 7, 9, 11'] },
        together: [GF(2, 1, 4), NX(4, 3, 4, 2)],
        cue: 'Find the change from one term to the next. Keep it the same.',
        own: [NX(50, -6, 4, 2), NX(0.5, 0.25, 4, 2), GF(3, 1, 5)]
      },
      p1: {
        show: { eq: ['40, 35, 30, 25: take away 5'] },
        items: [NX(7, 4, 4, 2), NX(100, -10, 4, 2), NX(1.2, 0.3, 4, 2), GF(1, 2, 5), GF(2, 2, 6)]
      },
      p2: {
        items: [NX(13, 7, 4, 2), NX(90, -12, 4, 2), NX(0.25, 0.5, 4, 2), NX(4.8, -0.6, 4, 2), GF(3, 2, 8), GF(4, 0, 10)]
      },
      p3: {
        items: [NX(1.05, 0.15, 4, 2), NX(250, -25, 4, 3), GF(5, 1, 12),
          story('A tree is 1.5 m tall and grows 0.4 m a year. How tall after 5 years?', 'm', 3.5, '1.5 + 5 × 0.4'),
          story('A pool has 1200 L and drains 150 L an hour. How much after 6 hours?', 'L', 300, '1200 − 6 × 150')]
      },
      think: {
        items: [{ q: 'Make a growing pattern that starts at 3 and is 23 at the 5th term.', lines: { n: 1, key: '3, 8, 13, 18, 23 (add 5).' } },
          { q: '{b} says 2, 4, 8, 16 grows by 2 each time. Is {b} right?', lines: { n: 2, key: 'No. It doubles each time: 2, 4, 8, 16, 32.' } },
          NX(0.1, 0.1, 4, 3),
          { q: 'Where do you see a shrinking pattern in real life?', lines: { n: 2, key: 'For example: a candle burning down, money spent each week, snow melting.' } }]
      }
    },

    linear: {
      watch: 'calling every growing pattern linear. Linear grows by the same amount every time: 2, 4, 8 is not linear.',
      goal: 'I can tell if a growing pattern is linear.',
      learn: {
        show: { cap: 'the same change every time', eq: ['5, 8, 11, 14: +3 each time', 'linear'] },
        together: [LN([5, 8, 11, 14]), LN([1, 2, 4, 8])],
        cue: 'Linear means the same change every time.',
        own: [LN([2, 6, 10, 14]), LN([1, 4, 9, 16]), LN([30, 26, 22, 18])]
      },
      p1: {
        show: { eq: ['1, 3, 6, 10: +2, +3, +4', 'not linear'] },
        items: [LN([4, 9, 14, 19]), LN([3, 6, 12, 24]), LN([10, 20, 30, 40]), LN([1, 3, 6, 10]), LN([0.5, 1, 1.5, 2])]
      },
      p2: {
        items: [LN([7, 7.5, 8, 8.5]), LN([2, 5, 10, 17]), LN([64, 32, 16, 8]), LN([100, 95, 90, 85]), LN([1, 2, 3, 5, 8])]
      },
      p3: {
        items: [LN([1.2, 2.4, 3.6, 4.8]), LN([1, 10, 100, 1000]), LN([12, 9, 6, 3]),
          LN([2.5, 5, 7.5, 10])]
      },
      think: {
        items: [{ q: 'Why is 1, 2, 4, 8 not linear?', lines: { n: 2, key: 'The change gets bigger: +1, +2, +4. A linear pattern adds the same each time.' } },
          { q: 'Make a linear pattern that shrinks.', lines: { n: 1, key: 'For example 50, 45, 40, 35 (take away 5).' } },
          LN([6, 11, 16, 21]),
          { q: 'Would a linear pattern make a straight line on a graph? Why?', lines: { n: 3, key: 'Yes. Each step across goes up by the same amount, so the points line up.' } }]
      }
    },

    rule: {
      watch: 'writing only the step (+3) as the rule. The rule finds any term: 3 × n + 2.',
      goal: 'I can write a rule for a linear pattern.',
      learn: {
        show: { cap: '5, 8, 11: +3 each time, and 5 − 3 = 2', eq: ['3 × n + 2'] },
        together: [TR(2, 5), GR(2, 1)],
        cue: 'The step is the number times n. Then fix the start.',
        own: [TR(4, 1), GR(3, 0), TR(5, 3)]
      },
      p1: {
        show: { eq: ['6, 8, 10: step 2', '2 × 1 = 2, 6 − 2 = 4', '2 × n + 4'] },
        items: [TR(2, 3), TR(4, 0), GR(1, 3), TR(6, 1), GR(2, 2)]
      },
      p2: {
        items: [TR(7, 2), TR(3, 5), TR(10, 4), GR(4, 1),
          { q: 'Figures 1, 2, 3: 9, 13, 17. Write the rule.', eq: ['[] × n + []'], a: [4, 5], rule: true, seq: [9, 13, 17] }]
      },
      p3: {
        items: [TR(8, 3), TR(5, 0),
          { q: 'Figures 1, 2, 3: 12, 21, 30. Write the rule.', eq: ['[] × n + []'], a: [9, 3], rule: true, seq: [12, 21, 30] },
          { q: 'A taxi charges $4 plus $2 per km. Figures 1, 2, 3: 6, 8, 10. Write the rule.', eq: ['[] × n + []'], a: [2, 4], rule: true, seq: [6, 8, 10], wide: true }]
      },
      think: {
        items: [{ q: '{b} says the rule for 5, 8, 11 is "add 3". Why is 3 × n + 2 more useful?', lines: { n: 3, key: '"Add 3" needs every term before. 3 × n + 2 finds any figure at once, like figure 50.' } },
          { q: 'Make a table for the rule 4 × n + 3 and draw figure 1.', draw: { h: 70, key: 'n 1, 2, 3: 7, 11, 15. Figure 1 has 7 tiles.' } },
          TR(6, 5)]
      }
    },

    predict: {
      watch: 'counting on one figure at a time to figure 50. Use the rule. To work backwards, solve the equation.',
      goal: 'I can use a rule to predict and to work backwards.',
      learn: {
        show: { cap: 'rule 3n + 2', eq: ['figure 10: 3 × 10 + 2 = 32', '3n + 2 = 47, n = 15'] },
        together: [SQ([5, 8, 11], 10), WB(3, 2, 47)],
        cue: 'Put n in to predict. Undo the steps to work backwards.',
        own: [SQ([4, 6, 8], 20), WB(2, 4, 30), SQ([7, 12, 17], 9)]
      },
      p1: {
        show: { eq: ['2n + 1, figure 25:', '2 × 25 + 1 = 51'] },
        items: [SQ([3, 5, 7], 10), SQ([6, 10, 14], 8), SQ([1, 4, 7], 20), WB(2, 1, 21), WB(4, 0, 36), WB(5, 3, 43)]
      },
      p2: {
        items: [SQ([9, 15, 21], 12), SQ([2, 9, 16], 30), WB(3, 5, 65), WB(6, 2, 74),
          { q: 'Chairs: 1 table seats 6, 2 tables seat 10, 3 seat 14. How many for 12 tables?', eq: ['[] chairs'], a: [50], seq: [6, 10, 14], fig: 12, wide: true }]
      },
      p3: {
        items: [SQ([11, 18, 25], 40), WB(7, 4, 102), WB(9, 1, 136),
          { q: 'A pattern starts 4, 7, 10. Is 100 in it?', pick: { opts: ['yes', 'no'], ans: 0 }, mult: { n: 99, of: 3 }, wide: true },
          { q: '1 bag of 5 {many} plus 3 loose, 2 bags plus 3, ... Which figure has 103?', eq: ['5n + 3 = 103', 'n = []'], a: [20], solve: '5n + 3 = 103', wide: true }]
      },
      think: {
        items: [{ q: 'How can you tell if 100 is a term of 3n + 2?', lines: { n: 3, key: 'Solve 3n + 2 = 100: 3n = 98, and 98 ÷ 3 is not a whole number. So 100 is not a term.' } },
          { q: '{b} found figure 50 by drawing all 50 figures. Show a faster way for 4n + 1.', lines: { n: 2, key: '4 × 50 + 1 = 201.' } },
          SQ([2, 8, 14], 25),
          WB(8, 6, 166)]
      }
    },

    evaluate: {
      watch: 'reading 3n as 3 + n or as thirty-something. 3n means 3 × n: when n = 4, 3n = 12.',
      goal: 'I can find the value of an expression.',
      learn: {
        show: { cap: 'n = 4', eq: ['3n + 5 = 3 × 4 + 5', '= 17'] },
        together: [EV('3n + 5', 6), EV('2n − 1', 2.5)],
        cue: 'Put the number in for the letter. Then work it out.',
        own: [EV('4n + 2', 7), EV('10n − 3', 0.4), EV('n + n + 6', 9)]
      },
      p1: {
        show: { eq: ['n = 0.5: 4n = 4 × 0.5 = 2'] },
        items: [EV('5n', 8), EV('n + 12', 9), EV('2n + 3', 10), EV('6n − 4', 3), EV('3n', 1.5), EV('20 − n', 7.5)]
      },
      p2: {
        items: [EV('7n + 1', 6), EV('9n − 5', 4), EV('2n + 0.5', 3), EV('4n + 2.5', 1.5), EV('100 − 3n', 20), EV('n × n', 6)]
      },
      p3: {
        items: [EV('5n + 3n', 4), EV('3n + 2n − 4', 1.2), EV('12n ÷ 4', 10),
          { q: 'A taxi costs 2n + 4 dollars for n km. Cost for 7.5 km?', eq: ['2 × 7.5 + 4 = []'], a: [19], wide: true },
          { q: 'Tickets cost 8n dollars for n people. Cost for 6 people?', eq: ['[] dollars'], a: [48], expr: '8n', n: 6, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 3n = 34 when n = 4. What went wrong?', lines: { n: 2, key: '3n means 3 × n, not 3 next to 4: 3 × 4 = 12.' } },
          { q: 'Do 2n + 3 and 2(n + 3) give the same value? Try n = 5.', lines: { n: 2, key: 'No. 2 × 5 + 3 = 13 but 2 × (5 + 3) = 16.' } },
          EV('8n − 2n', 2.5),
          { q: 'Write an expression that is 20 when n = 4.', lines: { n: 1, key: 'For example 5n, or 4n + 4, or n + 16.' } }]
      }
    },

    like: {
      watch: 'adding a number to an x term (3x + 2 = 5x). Only like terms join: x terms with x terms, numbers with numbers.',
      goal: 'I can add like terms.',
      learn: {
        show: { cap: 'x tiles with x tiles, ones with ones', eq: ['2x + 3 + 4x', '= 6x + 3'] },
        together: [LT('3x + 4x', '7x'), LT('2x + 5 + x', '3x + 5')],
        cue: 'Group the x terms. Group the numbers. Keep them apart.',
        own: [LT('5x + 2x', '7x'), LT('x + 1 + x + 1', '2x + 2'), LT('4x + 3 + 2x + 6', '6x + 9')]
      },
      p1: {
        show: { eq: ['x + x + x = 3x'] },
        items: [LT('x + x', '2x'), LT('2x + 6x', '8x'), LT('4x + x', '5x'), LT('3x + 2 + 3x', '6x + 2'), LT('5 + x + 4', 'x + 9'), LT('x + 2x + 3x', '6x')]
      },
      p2: {
        items: [LT('7x + 3 + 2x', '9x + 3'), LT('4 + 3x + 5', '3x + 9'), LT('6x + 1 + x + 1', '7x + 2'), LT('2x + 8 + 5x + 2', '7x + 10'),
          LT('x + 10 + 9x', '10x + 10'), LT('3x + 3x + 3x', '9x')]
      },
      p3: {
        items: [LT('12x + 5 + 8x + 15', '20x + 20'), Object.assign(LT('x + 2 + x + 4 + x + 6', '3x + 12'), { wide: true }),
          { q: 'A triangle has sides 2x, 3x + 1 and x + 4. Write its perimeter.', eq: ['2x + 3x + 1 + x + 4 = []'], a: ['6x + 5'], ident: true, wide: true },
          LT('4x + 6 + 2x', '6x + 6')]
      },
      think: {
        items: [{ q: '{b} says 3x + 2 = 5x. What went wrong?', lines: { n: 2, key: '3x and 2 are not like terms. 3x + 2 stays as it is.' } },
          { q: 'Draw tiles to show 2x + 3 + x + 1.', draw: { h: 60, key: '3 long x tiles and 4 small ones: 3x + 4.' } },
          LT('5x + 7 + 5x + 3', '10x + 10'),
          { q: 'Write two different expressions that add up to 6x + 4.', lines: { n: 1, key: 'For example (2x + 1) + (4x + 3).' } }]
      }
    },

    balance: {
      watch: 'doing a step to one side only. Whatever you do to one side of the balance, do to the other.',
      goal: 'I can solve an equation and check the answer.',
      learn: {
        show: { cap: 'take 3 from both sides, then halve both', eq: ['2x + 3 = 11', '2x = 8', 'x = 4'] },
        together: [SV('x + 7 = 15'), SV('2x + 3 = 11')],
        cue: 'Undo + or − first, then × or ÷. Keep both sides balanced.',
        own: [SV('3x = 21'), SV('4x + 5 = 29'), SV('5x − 2 = 33')]
      },
      p1: {
        show: { eq: ['check x = 4: 2 × 4 + 3 = 11'] },
        items: [SV('x + 12 = 30'), SV('x − 6 = 14'), SV('6x = 42'), SV('2x + 1 = 13'), SV('3x + 4 = 19'), SV('5x − 5 = 20')]
      },
      p2: {
        items: [SV('7x + 3 = 52'), SV('4x − 9 = 27'), SV('10x + 6 = 96'), SV('8x − 4 = 60'),
          { q: '{a} buys 3 {many} and pays $2 for a bag. The total is $17. Cost of one {one}?', eq: ['3x + 2 = 17', 'x = []'], a: [5], solve: '3x + 2 = 17', wide: true }]
      },
      p3: {
        items: [SV('9x + 7 = 70'), SV('6x − 11 = 55'),
          { q: 'A plan costs $25 plus $15 a month. {b} paid $130. How many months?', eq: ['15x + 25 = 130', 'x = []'], a: [7], solve: '15x + 25 = 130', wide: true },
          { q: 'Is x = 6 the answer to 4x − 3 = 20?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '4 × 6 − 3 = 20' }]
      },
      think: {
        items: [{ q: '{b} solved 2x + 3 = 11 by taking 3 from the left only. What happens?', lines: { n: 3, key: 'The sides stop being equal. Take 3 from both: 2x = 8, so x = 4.' } },
          { q: 'How can you check your answer?', lines: { n: 2, key: 'Put it back in for x. Both sides must come out the same.' } },
          SV('12x + 8 = 104'),
          { q: 'Write a story for 4x + 6 = 30.', lines: { n: 2, key: 'For example: 4 bags with the same number of {many}, plus 6 loose, make 30. x = 6.' } }]
      }
    },

    twox: {
      watch: 'solving before joining the x terms. Add the like terms first: 3x + 2x = 5x.',
      goal: 'I can solve an equation with more than one x term.',
      learn: {
        show: { eq: ['3x + 2x + 4 = 29', '5x + 4 = 29', 'x = 5'] },
        together: [SV('3x + 2x = 35'), SV('x + x + 6 = 20')],
        cue: 'Join the like terms first. Then solve.',
        own: [SV('4x + 2x = 42'), SV('2x + 3 + x = 21'), SV('5x + x − 4 = 32')]
      },
      p1: {
        show: { eq: ['x + 2x = 12', '3x = 12, x = 4'] },
        items: [SV('x + 2x = 18'), SV('4x + x = 40'), SV('2x + 2x = 28'), SV('3x + x + 5 = 25'), SV('x + x + x = 27'), SV('6x + 2x = 64')]
      },
      p2: {
        items: [SV('2x + 7 + 3x = 42'), SV('4x + 1 + x + 1 = 37'), SV('5x + 5x − 10 = 90'), SV('3x + 4 + 2x + 6 = 60'),
          { q: 'Two numbers: one is x, the other is 3x. They add to 48. Find x.', eq: ['x + 3x = 48', 'x = []'], a: [12], solve: 'x + 3x = 48', wide: true }]
      },
      p3: {
        items: [SV('7x + 3x + 15 = 95'), SV('x + 2x + 3x + 4 = 46'),
          { q: 'A rectangle is x by 2x. Its perimeter is 54 cm. Find x.', eq: ['x + 2x + x + 2x = 54', 'x = []'], a: [9], solve: 'x + 2x + x + 2x = 54', wide: true },
          { q: '{a} has x {many}. {b} has twice as many. Together they have 36. Find x.', eq: ['x + 2x = 36', 'x = []'], a: [12], solve: 'x + 2x = 36', wide: true }]
      },
      think: {
        items: [{ q: 'Why join 3x + 2x before solving?', lines: { n: 2, key: 'It makes one x term, so you can undo the steps once.' } },
          { q: '{b} says 3x + 2x = 35 gives x = 35 ÷ 3 ÷ 2. What would you tell {b}?', lines: { n: 3, key: 'Join the terms: 5x = 35, so x = 7.' } },
          SV('2x + 9 + 4x = 69'),
          { q: 'Write an equation with two x terms whose answer is 4.', lines: { n: 1, key: 'For example 2x + 3x = 20.' } }]
      }
    },

    line: {
      watch: 'using a closed dot for < or >. An open dot means the number itself is not included.',
      goal: 'I can show the answers to an inequality on a number line.',
      learn: {
        show: { pic: ['nl', { min: 0, max: 10, tick: 1, lab: 2, pt: 4, ptl: '○' }], cap: 'x > 4: open dot, arrow right' },
        together: [{ q: 'x > 4', pick: { opts: ['open dot', 'closed dot'], ans: 0, dot: 'x > 4' } }, IQ('x > 4', 'least')],
        cue: 'Open dot for < and >. Arrow toward the numbers that work.',
        own: [IQ('x < 9', 'most'), IQ('x + 2 > 7', 'least')]
      },
      p1: {
        show: { eq: ['x < 6: 0, 1, 2, 3, 4, 5'] },
        items: [IQ('x < 6', 'most'), IQ('x > 12', 'least'), { q: 'x < 8', pick: { opts: ['open dot', 'closed dot'], ans: 0, dot: 'x < 8' } },
          { q: 'x ≤ 5', pick: { opts: ['open dot', 'closed dot'], ans: 1, dot: 'x ≤ 5' } }, IQ('x + 4 < 10', 'most'), IQ('x − 3 > 5', 'least')]
      },
      p2: {
        items: [IQ('2x < 14', 'most'), IQ('3x > 15', 'least'), IQ('x + 9 < 30', 'most'), IQ('x − 8 > 20', 'least'),
          { q: 'Draw x > 3 on a number line from 0 to 10.', draw: { h: 40, key: 'Open dot at 3, arrow or dots to the right: 4, 5, 6 ...' } }]
      },
      p3: {
        items: [IQ('5x < 48', 'most'), IQ('4x > 50', 'least'),
          { q: 'Over 120 cm to ride: h > 120. The dot at 120?', pick: { opts: ['open dot', 'closed dot'], ans: 0, dot: 'h > 120' }, wide: true },
          { q: 'Draw x < 7 on a number line from 0 to 10.', draw: { h: 40, key: 'Open dot at 7, arrow or dots to the left: 6, 5, 4 ... 0.' } }]
      },
      think: {
        items: [{ q: 'What is the difference between x > 5 and x ≥ 5?', lines: { n: 2, key: 'x ≥ 5 includes 5 (a closed dot). x > 5 does not (an open dot).' } },
          { q: 'Write an inequality for "at most 30 students on a bus".', lines: { n: 1, key: 's ≤ 30' } },
          IQ('x + 15 < 40', 'most'),
          { q: 'How many whole numbers make x < 4 true?', eq: ['[]'], a: [4], calc: '4' }]
      }
    },

    solveineq: {
      watch: 'checking only one number. Test the edge number and one either side to see which way the answers go.',
      goal: 'I can solve inequalities with two steps and check them.',
      learn: {
        show: { cap: 'solve like an equation, then test', eq: ['2x + 3 < 15: 2x < 12, x < 6', 'greatest: 5'] },
        together: [IQ('2x + 3 < 15', 'most'), IQ('3x + 1 > 16', 'least')],
        cue: 'Solve it like an equation. Then test a number to check.',
        own: [IQ('4x − 2 < 30', 'most'), IQ('5x + 5 > 40', 'least'), IQ('2x + 7 < 25', 'most')]
      },
      p1: {
        show: { eq: ['3x + 1 > 16: 3x > 15, x > 5', 'least: 6'] },
        items: [IQ('2x + 1 < 11', 'most'), IQ('3x − 3 > 12', 'least'), IQ('4x + 4 < 36', 'most'), IQ('5x − 1 > 24', 'least'), IQ('6x + 2 < 50', 'most'), IQ('2x + 9 > 21', 'least')]
      },
      p2: {
        items: [IQ('7x + 3 < 60', 'most'), IQ('8x − 5 > 75', 'least'), IQ('3x + 12 < 100', 'most'), IQ('9x + 1 > 82', 'least'),
          { q: '{a} has $50 and buys $6 tickets and a $5 snack. Most tickets?', eq: ['6x + 5 < 51', 'x = []'], a: [7], ineq: '6x + 5 < 51', edge: 'most', wide: true }]
      },
      p3: {
        items: [IQ('4x + 15 < 99', 'most'), IQ('6x − 20 > 70', 'least'),
          { q: '{a} has $15 and saves $9 a week. After how many weeks will {a} have more than $100?', eq: ['9x + 15 > 100', 'x = []'], a: [10], ineq: '9x + 15 > 100', edge: 'least', wide: true },
          { q: 'Is x = 9 an answer to 5x − 4 < 40?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '5 × 9 − 4 < 40' }]
      },
      think: {
        items: [{ q: 'How can you check the answer to 2x + 3 < 15?', lines: { n: 3, key: 'Test 5: 13 < 15, true. Test 6: 15 < 15, false. So 5 is the greatest.' } },
          { q: 'How is solving an inequality like solving an equation?', lines: { n: 2, key: 'You undo the steps the same way, keeping both sides balanced.' } },
          IQ('10x + 6 > 95', 'least'),
          { q: 'Write a story for 3x + 4 < 20.', lines: { n: 2, key: 'For example: $3 {many} and a $4 {cont}, spending less than $20: at most 5 {many}.' } }]
      }
    },

    loops: {
      watch: 'running a loop one time too many or too few, or skipping the "if" test. Trace one pass at a time.',
      goal: 'I can trace and change code with loops and conditions.',
      learn: {
        show: { pic: ['code', { lines: ['set total to 5', 'repeat 3 times', '  add 4 to total'] }], eq: ['5, 9, 13, 17', 'total = 17'] },
        together: [CD(['set total to 2', 'repeat 4 times', '  add 3 to total'], 14, '2 + 4 × 3'), CD(['set total to 8', 'if total > 10', '  take 3 from total', 'otherwise', '  add 3 to total'], 11, '8 + 3')],
        cue: 'Trace one pass at a time. Test each "if" with the total right now.',
        own: [CD(['set total to 1', 'repeat 3 times', '  multiply total by 2'], 8, '1 × 2 × 2 × 2'), CD(['set total to 20', 'repeat 3 times', '  take 5 from total'], 5, '20 − 3 × 5')]
      },
      p1: {
        show: { pic: ['code', { lines: ['set total to 10', 'if total > 5', '  add 1 to total'] }], eq: ['10 > 5 is true: 11'] },
        items: [CD(['set total to 3', 'repeat 3 times', '  add 2 to total'], 9, '3 + 3 × 2'), CD(['set total to 50', 'repeat 4 times', '  take 10 from total'], 10, '50 − 4 × 10'),
          CD(['set total to 4', 'if total > 3', '  add 10 to total', 'otherwise', '  add 1 to total'], 14, '4 + 10'), CD(['set total to 2', 'if total > 3', '  add 10 to total', 'otherwise', '  add 1 to total'], 3, '2 + 1')]
      },
      p2: {
        items: [CD(['set total to 1', 'repeat 3 times', '  add 5 to total', 'multiply total by 2'], 32, '(1 + 3 × 5) × 2'),
          CD(['set total to 100', 'repeat 6 times', '  take 15 from total'], 10, '100 − 6 × 15'),
          CD(['set total to 6', 'repeat 3 times', '  if total < 10', '    add 4 to total'], 14, '6 + 4 + 4'),
          CD(['set total to 0', 'repeat 4 times', '  add 3 to total', '  add 2 to total'], 20, '0 + 4 × (3 + 2)')]
      },
      p3: {
        items: [{ q: 'How many times must the loop run to reach 25?', pic: ['code', { lines: ['set total to 5', 'repeat ? times', '  add 4 to total'] }], eq: ['[] times'], a: [5], calc: '(25 − 5) ÷ 4' },
          CD(['set total to 1', 'repeat 4 times', '  multiply total by 3'], 81, '1 × 3 × 3 × 3 × 3'),
          { q: 'Change one number so the total ends at 30.', pic: ['code', { lines: ['set total to 0', 'repeat 6 times', '  add 4 to total'] }], eq: ['add [] each time'], a: [5], calc: '30 ÷ 6' },
          CD(['set total to 7', 'repeat 5 times', '  if total < 20', '    add 5 to total'], 22, '7 + 5 + 5 + 5')]
      },
      think: {
        items: [{ q: 'This code says "add 4" eight times in a row. How can a loop make it shorter?', lines: { n: 2, key: 'repeat 8 times: add 4 to total. One line repeated instead of eight.' } },
          { q: '{b} traced: set total to 5, repeat 3 times add 4, and got 21. What went wrong?', lines: { n: 3, key: '{b} ran the loop 4 times. 3 passes: 9, 13, 17.' } },
          { q: 'Write code that ends with total = 20 and uses a loop.', lines: { n: 3, key: 'For example: set total to 0, repeat 4 times, add 5 to total.' } },
          CD(['set total to 12', 'if total > 10', '  take 4 from total', 'if total > 10', '  take 4 from total'], 8, '12 − 4')]
      }
    }
  } });
})();
