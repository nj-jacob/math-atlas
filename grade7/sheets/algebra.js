/* Grade 7 Algebra: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in chapters/algebra.js:
   Learn, Practise 1 to 3 and Think. Every question is written here, not made at random, so a sheet always prints the
   same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: C1.1 compare linear growing patterns by rate and initial value; C1.2 translate a pattern into an
   expression or equation; C1.3 pattern rules to extend, predict and solve; C2.1 add and subtract like terms; C2.2
   evaluate expressions; C2.3 solve equations with like terms and decimals; C2.4 solve inequalities and show them on a
   number line; C3.1 and C3.2 read, trace and change code with loops and sub-programs. The answer checks are in
   tests/verify/sheets.js: a figure's tiles follow rate × n + initial value, a letter's value is put back in to check
   (expr, solve, ineq), like terms must give the same value whatever the letter is, and a number line's dot and ray
   must match its inequality. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function sg(n) { return n < 0 ? '−' + -n : String(n); }
  /* rate and initial value of a tile pattern (m tiles added each figure, b tiles that never change) */
  function RI(m, b) { return { pic: ['grow', { m: m, b: b, k: 3 }], eq: ['rate: []', 'initial value: []'], a: [m, b], rule: true }; }
  /* the rule as an expression */
  function GR(m, b) { return { pic: ['grow', { m: m, b: b, k: 3 }], eq: ['[] n + []'], a: [m, b], rule: true }; }
  /* a figure from the picture, or term n from the first terms */
  function GF(m, b, n) { return { pic: ['grow', { m: m, b: b, k: 3 }], q: 'Tiles in figure ' + n + '?', eq: ['[]'], a: [m * n + b], fig: n }; }
  function SQ(seq, n) { return { q: 'Terms 1, 2, 3: ' + seq.join(', ') + '. Term ' + n + '?', eq: ['[]'], a: [seq[0] + (seq[1] - seq[0]) * (n - 1)], seq: seq, fig: n }; }
  function SR(seq) { var m = seq[1] - seq[0]; return { q: 'Terms 1, 2, 3: ' + seq.join(', ') + '. Rule:', eq: ['[] n + []'], a: [m, seq[0] - m], seq: seq, rule: true }; }
  /* like terms: the blanks are the number in front and the number on its own */
  function LK(e, k, c, v) { v = v || 'x'; return { eq: [e + ' = [] ' + v + (c == null ? '' : ' + []')], a: c == null ? [k] : [k, c], like: true, wide: e.length > 9 }; }
  /* evaluate an expression for a value of its letter */
  function EV(e, n, v) {
    v = v || 'n';
    var x = Function(v, 'return ' + e.replace(/(\d)\s*([a-z])\b/g, '$1*$2').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'))(n);
    return { q: v + ' = ' + n, eq: [e + ' = []'], a: [Math.round(x * 1e6) / 1e6], expr: e, n: n };
  }
  /* solve an equation: the steps, then the letter */
  function SV(e, steps, ans) { return { eq: [e].concat(steps), a: ans, solve: e }; }
  /* the greatest or least whole number that makes an inequality true */
  function IQ(e, v, edge) { return { q: (edge === 'most' ? 'Greatest' : 'Least') + ' whole number x:', eq: [e, 'x = []'], a: [v], ineq: e, edge: edge }; }
  /* show an inequality on a number line: the key draws the dot and the ray */
  function RAY(e, at, dir, closed, lo, hi) { return { q: 'Show ' + e + '.', pic: ['nl', { min: lo, max: hi, tick: 1, lab: 2, ray: { at: at, dir: dir, closed: closed, key: true } }], ineq: e }; }
  /* read an inequality from a number line */
  function RD(e, at, dir, closed, lo, hi) { return { q: 'Which inequality?', pic: ['nl', { min: lo, max: hi, tick: 1, lab: 2, ray: { at: at, dir: dir, closed: closed } }], ineq: e, pick: { opts: ['x > ' + sg(at), 'x < ' + sg(at), 'x ≥ ' + sg(at), 'x ≤ ' + sg(at)], ans: (dir === 'right' ? 0 : 1) + (closed ? 2 : 0), inq: true } }; }
  /* trace a short program: what it shows */
  function CD(lines, ans, calc, q) { return { q: q || 'What does it show?', pic: ['code', { lines: lines }], eq: ['[]'], a: [ans], calc: calc }; }
  function story(q, unit, ans, calc, more) { var it = { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; return more ? Object.assign(it, more) : it; }

  S.register('algebra', { code: 'AL', ideas: {

    rate: {
      watch: 'taking term 1 as the initial value. Term 1 is 5 tiles, but the initial value is 3: go back one step.',
      goal: 'I can find the rate and initial value of a growing pattern.',
      learn: {
        show: { pic: ['grow', { m: 2, b: 3, k: 3 }], cap: '2 more each time, 3 never change', eq: ['rate 2, initial value 3'] },
        together: [RI(3, 1), RI(1, 4)],
        cue: 'Rate: what is added. Initial value: what never changes.',
        own: [RI(2, 2), RI(4, 1)]
      },
      p1: {
        show: { eq: ['5, 8, 11, 14: rate 3', 'term 0 is 5 − 3 = 2'] },
        items: [{ q: 'Terms 1, 2, 3: 7, 11, 15.', eq: ['rate: []', 'initial value: []'], a: [4, 3], seq: [7, 11, 15], rule: true },
          { q: 'Terms 1, 2, 3: 9, 11, 13.', eq: ['rate: []', 'initial value: []'], a: [2, 7], seq: [9, 11, 13], rule: true },
          { q: 'Terms 1, 2, 3: 6, 11, 16.', eq: ['rate: []', 'initial value: []'], a: [5, 1], seq: [6, 11, 16], rule: true },
          { q: 'Terms 1, 2, 3: 10, 13, 16.', eq: ['rate: []', 'initial value: []'], a: [3, 7], seq: [10, 13, 16], rule: true }]
      },
      p2: {
        items: [{ q: 'Terms 1, 2, 3: 2.5, 4, 5.5.', eq: ['rate: []', 'initial value: []'], a: [1.5, 1], seq: [2.5, 4, 5.5], rule: true },
          { q: 'Terms 1, 2, 3: 12, 20, 28.', eq: ['rate: []', 'initial value: []'], a: [8, 4], seq: [12, 20, 28], rule: true },
          SR([21, 27, 33]),
          { q: 'Terms 1, 2, 3: 30, 26, 22.', eq: ['rate: []', 'initial value: []'], a: [-4, 34], seq: [30, 26, 22], rule: true }]
      },
      p3: {
        items: [{ q: 'Which grows faster: A, 3n + 10, or B, 5n + 2?', pick: { opts: ['A', 'B'], ans: 1, more: ['3', '5'] } },
          { q: 'Which starts higher: A, 3n + 10, or B, 5n + 2?', pick: { opts: ['A', 'B'], ans: 0, more: ['10', '2'] } },
          SR([4, 9, 14]), SR([1.5, 2, 2.5]), GR(4, 3), GR(2, 6)]
      },
      think: {
        items: [{ q: '{b} says the pattern 5, 7, 9 has initial value 5. What went wrong?', lines: { n: 3, key: '5 is term 1. Go back one step: 5 − 2 = 3. The initial value is 3.' } },
          { q: 'Describe a real pattern with rate 4 and initial value 10.', lines: { n: 3, key: 'For example, $10 to start and $4 for each week.' } },
          RI(5, 0)]
      }
    },

    rule: {
      watch: 'writing the rule as n + 2 (counting up by 2 from term 1). Check the rule against two terms before using it.',
      goal: 'I can use a pattern rule to find any term, or which term has a value.',
      learn: {
        show: { eq: ['rule 2n + 3', 'term 10: 2 × 10 + 3 = 23', '2n + 3 = 51, so n = 24'] },
        together: [EV('4n + 5', 8), SV('4n + 5 = 61', ['4n = []', 'n = []'], [56, 14])],
        cue: 'Term = rate × n + initial value.',
        own: [EV('3n + 7', 12), SV('3n + 7 = 52', ['3n = []', 'n = []'], [45, 15])]
      },
      p1: {
        show: { eq: ['5, 8, 11: rule 3n + 2'] },
        items: [SR([5, 8, 11]), SR([6, 10, 14]), SR([3, 9, 15]), SR([11, 13, 15]), SQ([5, 8, 11], 20), SQ([6, 10, 14], 15)]
      },
      p2: {
        items: [EV('6n + 4', 25), EV('2.5n + 1', 6), SQ([3, 9, 15], 40), SQ([1.25, 1.5, 1.75], 11),
          SV('5n + 2 = 77', ['5n = []', 'n = []'], [75, 15]), SV('2n + 9 = 49', ['2n = []', 'n = []'], [40, 20])]
      },
      p3: {
        items: [story('A tile pattern has 3n + 4 tiles. Which figure has 100 tiles?', '', 32, '(100 − 4) ÷ 3', { solve: '3n + 4 = 100' }),
          story('A plant is 6 cm tall and grows 1.5 cm a week. How tall after 12 weeks?', 'cm', 24, '6 + 1.5 × 12'),
          story('A pass costs $15 plus $6 a visit. How many visits for $87?', 'visits', 12, '(87 − 15) ÷ 6'),
          SV('4n + 1 = 89', ['4n = []', 'n = []'], [88, 22])]
      },
      think: {
        items: [{ q: '{a} says the rule for 5, 7, 9 is n + 2. Check it. What went wrong?', lines: { n: 3, key: 'Term 1 would be 1 + 2 = 3, not 5. The rule is 2n + 3.' } },
          { q: 'Can the pattern 2n + 3 have a term of 50? Explain.', lines: { n: 3, key: 'No. 2n + 3 = 50 gives n = 23.5, which is not a whole term number.' } },
          SR([2.5, 3.25, 4])]
      }
    },

    compare: {
      watch: 'deciding which is bigger from the first term only. Ask what happens at term 10 or 100.',
      goal: 'I can compare two growing patterns.',
      learn: {
        show: { eq: ['A: 2n + 8   B: 4n + 2', 'term 3: both 14', 'after that, B is bigger'] },
        together: [SV('3n + 10 = 5n + 2', ['n = []'], [4]),
          { q: 'Bigger at term 10: A, 3n + 10, or B, 5n + 2?', pick: { opts: ['A', 'B'], ans: 1, more: ['3 × 10 + 10', '5 × 10 + 2'] }, wide: true }],
        cue: 'Bigger start wins early. Bigger rate wins in the end.',
        own: [SV('2n + 9 = 3n + 4', ['n = []'], [5]),
          { q: 'Bigger at term 1: A, 2n + 9, or B, 3n + 4?', pick: { opts: ['A', 'B'], ans: 0, more: ['2 × 1 + 9', '3 × 1 + 4'] }, wide: true }]
      },
      p1: {
        show: { eq: ['A: 4n + 1   B: 2n + 7', 'term 3: 13 and 13'] },
        items: [EV('4n + 1', 3), EV('2n + 7', 3), EV('6n + 5', 10), EV('3n + 30', 10),
          SV('4n + 1 = 2n + 7', ['n = []'], [3]), SV('6n + 5 = 3n + 20', ['n = []'], [5])]
      },
      p2: {
        items: [{ q: 'Bigger at term 20: A, 5n + 40, or B, 7n + 2?', pick: { opts: ['A', 'B'], ans: 1, more: ['5 × 20 + 40', '7 × 20 + 2'] }, wide: true },
          { q: 'Bigger at term 2: A, 5n + 40, or B, 7n + 2?', pick: { opts: ['A', 'B'], ans: 0, more: ['5 × 2 + 40', '7 × 2 + 2'] }, wide: true },
          SV('5n + 40 = 7n + 2', ['n = []'], [19]), SV('n + 12 = 3n', ['n = []'], [6])]
      },
      p3: {
        items: [story('Plan A: $20 plus $3 a game. Plan B: $5 a game. For how many games do they cost the same?', 'games', 10, '20 ÷ (5 − 3)', { solve: '20 + 3n = 5n', wide: true }),
          story('A tree is 40 cm and grows 5 cm a year. Another is 10 cm and grows 8 cm a year. After how many years are they equal?', 'years', 10, '(40 − 10) ÷ (8 − 5)', { solve: '40 + 5n = 10 + 8n', wide: true }),
          { q: 'Which plan is cheaper for 4 games: A, $20 + $3 a game, or B, $5 a game?', pick: { opts: ['A', 'B'], ans: 1, less: ['20 + 3 × 4', '5 × 4'] }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says A, 10n + 1, is always smaller than B, 2n + 50, because 1 is less than 50. What went wrong?', lines: { n: 3, key: 'A grows faster. At term 7, A is 71 and B is 64: A is bigger.' } },
          { q: 'Make two patterns that are equal at term 5.', lines: { n: 2, key: 'For example 2n + 10 and 4n: both are 20 at term 5.' } },
          SV('8n + 3 = 5n + 21', ['n = []'], [6])]
      }
    },

    combine: {
      watch: 'combining unlike terms (4a + 7 = 11a) or multiplying the letters. Only like terms combine.',
      goal: 'I can add like terms.',
      learn: {
        show: { cap: 'x-tiles together, ones apart', eq: ['3x + 2x + 4 = 5x + 4'] },
        together: [LK('2x + 3 + 4x', 6, 3), LK('a + 5a', 6, null, 'a')],
        cue: 'Only like terms combine.',
        own: [LK('4y + 2y + 1', 6, 1, 'y'), LK('3x + 5 + 2x + 2', 5, 7)]
      },
      p1: {
        show: { eq: ['5n + n = 6n', '7 + 2n + 3 = 2n + 10'] },
        items: [LK('3x + 4x', 7), LK('2n + n + 5', 3, 5, 'n'), LK('6a + 2 + a', 7, 2, 'a'), LK('x + x + x', 3),
          LK('4m + 6 + 3m + 1', 7, 7, 'm'), LK('5 + 2y + 4 + 3y', 5, 9, 'y')]
      },
      p2: {
        items: [LK('1.5x + 2.5x', 4), LK('0.5n + 3 + 2n', 2.5, 3, 'n'), LK('8k + 12 + 3k + 8', 11, 20, 'k'), LK('2.4a + 1 + 0.6a', 3, 1, 'a'),
          LK('3.5c + 2 + 1.5c', 5, 2, 'c')]
      },
      p3: {
        items: [story('A rectangle is x cm long and 4 cm wide. Its perimeter is 2x + 8. If x = 6, what is the perimeter?', 'cm', 20, '2 × 6 + 8', { expr: '2x + 8', n: 6, calc: null }),
          LK('3x + 2 + 4x + 5 + x', 8, 7), LK('2.5y + 4 + 1.5y + 0.5', 4, 4.5, 'y'),
          { q: 'Write a sum of 3 terms that simplifies to 5x + 2.', lines: { n: 1, key: 'For example 3x + 2 + 2x.' } }]
      },
      think: {
        items: [{ q: '{a} wrote 4a + 7 = 11a. What went wrong?', lines: { n: 3, key: '4a and 7 are not like terms. 4a + 7 cannot be simplified.' } },
          { q: 'Why do x-tiles and unit tiles stay separate?', lines: { n: 2, key: 'They are different sizes: x is unknown, a unit is 1.' } },
          LK('6p + 3 + p + 4 + 2p', 9, 7, 'p')]
      }
    },

    lone: {
      watch: '5x − x = 5: the lone x taken as nothing. A lone x means 1x.',
      goal: 'I can subtract like terms.',
      learn: {
        show: { cap: 'take 2 tiles away', eq: ['6x − 2x = 4x', '5x − x = 4x'] },
        together: [LK('7x − x', 6), LK('4x − 3x', 1)],
        cue: 'x means 1x.',
        own: [LK('9a − 4a', 5, null, 'a'), LK('8n − n + 3', 7, 3, 'n')]
      },
      p1: {
        show: { eq: ['10y − 3y = 7y'] },
        items: [LK('8x − 5x', 3), LK('6n − n', 5, null, 'n'), LK('12a − 7a', 5, null, 'a'), LK('9y − 8y', 1, null, 'y'),
          LK('5x + 4 − 2x', 3, 4), LK('7m + 9 − m', 6, 9, 'm')]
      },
      p2: {
        items: [LK('4.5x − 1.5x', 3), LK('10n + 8 − 4n − 3', 6, 5, 'n'), LK('3a − a + 2a', 4, null, 'a'), LK('7.2y − 2.2y + 6', 5, 6, 'y'),
          LK('9x + 15 − 9x', 0, 15)]
      },
      p3: {
        items: [LK('15k + 20 − 6k − 5', 9, 15, 'k'), LK('2x + 7 − x + 3', 1, 10), LK('0.8n − 0.3n', 0.5, null, 'n'),
          story('{a} had 5x {many} and gave away 2x. Then {a} found 4 more. How many now, if x = 6?', '{many}', 22, '5 × 6 − 2 × 6 + 4', { expr: '3x + 4', n: 6, calc: null })]
      },
      think: {
        items: [{ q: '{b} says 5x − x = 5. What went wrong?', lines: { n: 3, key: 'The lone x is 1x. 5x − 1x = 4x.' } },
          { q: 'Why is 4x − 3x written as just x?', lines: { n: 2, key: '4 − 3 = 1, and 1x is written x.' } },
          LK('11b + 6 − 4b − 6', 7, 0, 'b')]
      }
    },

    sub: {
      watch: '3n with n = 4 written as 34. Write the times sign: 3 × 4.',
      goal: 'I can evaluate an expression.',
      learn: {
        show: { cap: 'n = 3', eq: ['4n − 2.5 = 4 × 3 − 2.5 = 9.5'] },
        together: [EV('2.5n − 4', 6), EV('3n + 7', 5)],
        cue: 'Replace, write the times sign, then BEDMAS.',
        own: [EV('5n − 8', 4), EV('1.5n + 2', 10), EV('20 − 3n', 6)]
      },
      p1: {
        show: { cap: 'x = 7', eq: ['2x + 5 = 2 × 7 + 5 = 19'] },
        items: [EV('3x + 4', 6, 'x'), EV('7a − 10', 3, 'a'), EV('4y + 9', 0, 'y'), EV('10 − 2n', 4), EV('6m + 1', 8, 'm'), EV('9k − 9', 1, 'k')]
      },
      p2: {
        items: [EV('0.5n + 3', 12), EV('2.4x − 1', 5, 'x'), EV('3 × (n + 2)', 4), EV('n × n + 1', 6), EV('12 ÷ n + 5', 3), EV('4.5a + 0.5', 2, 'a')]
      },
      p3: {
        items: [story('A taxi charges 4 + 1.5d dollars for d km. How much for 12 km?', 'dollars', 22, '4 + 1.5 × 12', { expr: '4 + 1.5d', n: 12, calc: null }),
          story('The perimeter of a square is 4s. What is it when s = 7.5 cm?', 'cm', 30, '4 × 7.5', { expr: '4s', n: 7.5, calc: null }),
          story('A phone plan costs 25 + 0.1t dollars for t texts. How much for 80 texts?', 'dollars', 33, '25 + 0.1 × 80', { expr: '25 + 0.1t', n: 80, calc: null }),
          EV('5n − 2.5', 3)]
      },
      think: {
        items: [{ q: '{b} found 3n when n = 4 and wrote 34. What went wrong?', lines: { n: 3, key: '3n means 3 × n. 3 × 4 = 12.' } },
          { q: 'Why do you write the times sign after you replace the letter?', lines: { n: 2, key: 'So 3n with 4 reads 3 × 4, not 34.' } },
          EV('2n + 3n', 7)]
      }
    },

    balance: {
      watch: 'doing something to one side only. Whatever you do to one side, do to the other. Check by putting the answer back in.',
      goal: 'I can solve an equation by keeping it balanced.',
      learn: {
        show: { cap: 'take 7 off both sides, then split by 2', eq: ['2x + 7 = 15', '2x = 8', 'x = 4'] },
        together: [SV('3x + 4 = 19', ['3x = []', 'x = []'], [15, 5]), SV('5x − 3 = 22', ['5x = []', 'x = []'], [25, 5])],
        cue: 'Undo adding first, then undo multiplying.',
        own: [SV('4x + 6 = 30', ['4x = []', 'x = []'], [24, 6]), SV('2x − 5 = 11', ['2x = []', 'x = []'], [16, 8])]
      },
      p1: {
        show: { eq: ['6x + 1 = 25', '6x = 24', 'x = 4'] },
        items: [SV('x + 9 = 23', ['x = []'], [14]), SV('7x = 63', ['x = []'], [9]), SV('3x + 2 = 20', ['x = []'], [6]),
          SV('5x − 4 = 31', ['x = []'], [7]), SV('2x + 11 = 35', ['x = []'], [12]), SV('9x − 6 = 66', ['x = []'], [8])]
      },
      p2: {
        items: [SV('2x + 1.5 = 9.5', ['x = []'], [4]), SV('4x − 2.4 = 5.6', ['x = []'], [2]), SV('0.5x + 3 = 8', ['x = []'], [10]),
          SV('3x + 7 = 1', ['x = []'], [-2]), SV('x ÷ 4 + 2 = 9', ['x = []'], [28]), SV('6x + 15 = 51', ['x = []'], [6])]
      },
      p3: {
        items: [story('{a} buys 3 {many} and a $4 card. It costs $25 in all. How much is one?', 'dollars', 7, '(25 − 4) ÷ 3', { solve: '3x + 4 = 25' }),
          story('A pool has 120 L. It fills at 15 L a minute. When does it hold 300 L?', 'minutes', 12, '(300 − 120) ÷ 15', { solve: '120 + 15x = 300' }),
          story('Twice a number plus 2.5 is 10.5. What is the number?', '', 4, null, { solve: '2x + 2.5 = 10.5' })]
      },
      think: {
        items: [{ q: '{b} solved 3x + 4 = 19 and got x = 7. Check it. What went wrong?', lines: { n: 3, key: '3 × 7 + 4 = 25, not 19. Take 4 off first: 3x = 15, so x = 5.' } },
          { q: 'Why must you do the same thing to both sides?', lines: { n: 2, key: 'An equation is a balance. Changing one side only tips it.' } },
          SV('8x − 7 = 49', ['8x = []', 'x = []'], [56, 7])]
      }
    },

    more: {
      watch: 'forgetting the lone x when combining: 2x + x = 2x. Tidy up first, then solve.',
      goal: 'I can combine like terms, then solve.',
      learn: {
        show: { eq: ['2x + 3 + x = 18', '3x + 3 = 18', 'x = 5'] },
        together: [SV('4x − 2 + x = 18', ['5x − 2 = 18', 'x = []'], [4]), SV('3x + 5 + 2x = 30', ['5x + 5 = 30', 'x = []'], [5])],
        cue: 'Combine like terms first.',
        own: [SV('x + 4 + 3x = 24', ['4x + 4 = 24', 'x = []'], [5]), SV('6x − 1 − 2x = 15', ['4x − 1 = 15', 'x = []'], [4])]
      },
      p1: {
        show: { eq: ['4x + 2x = 30', '6x = 30', 'x = 5'] },
        items: [SV('3x + 2x = 35', ['x = []'], [7]), SV('5x − x = 28', ['x = []'], [7]), SV('2x + 6 + x = 21', ['x = []'], [5]),
          SV('7x + 3 − 2x = 43', ['x = []'], [8]), SV('x + x + 10 = 26', ['x = []'], [8]), SV('4x + 1 + 4x = 49', ['x = []'], [6])]
      },
      p2: {
        items: [SV('1.5x + 2.5x = 18', ['x = []'], [4.5]), SV('2x + 1.2 + 3x = 11.2', ['x = []'], [2]), SV('6x − 2x + 7 = 3', ['x = []'], [-1]),
          SV('0.5x + 0.5x + 4 = 13', ['x = []'], [9])]
      },
      p3: {
        items: [story('{a} has x {many}. {b} has twice as many. Together they have 36. What is x?', '{many}', 12, null, { solve: 'x + 2x = 36' }),
          story('A rectangle is x cm by 3x cm. Its perimeter is 48 cm. What is x?', 'cm', 6, null, { solve: 'x + 3x + x + 3x = 48' }),
          story('Three numbers in a row add to 57. The first is x. What is x?', '', 18, null, { solve: 'x + x + 1 + x + 2 = 57' })]
      },
      think: {
        items: [{ q: '{b} wrote 2x + x = 2x. What went wrong?', lines: { n: 3, key: 'The lone x is 1x. 2x + x = 3x.' } },
          { q: 'Why is it easier to combine like terms before solving?', lines: { n: 2, key: 'Then there is one x term, so you undo two steps only.' } },
          SV('3x + 4 + 2x − 1 = 28', ['x = []'], [5])]
      }
    },

    symbols: {
      watch: 'an open dot for ≥ or ≤. A filled dot means the number itself works.',
      goal: 'I can show an inequality on a number line.',
      learn: {
        show: { pic: ['nl', { min: -2, max: 8, tick: 1, lab: 2, ray: { at: 3, dir: 'right', closed: false } }], cap: 'x > 3: open dot, numbers to the right' },
        together: [RAY('x ≥ 2', 2, 'right', true, -2, 8), RAY('x < 5', 5, 'left', false, -2, 8)],
        cue: 'Filled dot: the number works. Open dot: it does not.',
        own: [RAY('x ≤ 4', 4, 'left', true, -2, 8), RAY('x > −1', -1, 'right', false, -4, 6)]
      },
      p1: {
        show: { pic: ['nl', { min: -2, max: 8, tick: 1, lab: 2, ray: { at: 1, dir: 'right', closed: true } }], cap: 'x ≥ 1' },
        items: [RAY('x > 6', 6, 'right', false, -2, 8), RAY('x ≤ 0', 0, 'left', true, -4, 6), RAY('x < −2', -2, 'left', false, -6, 4),
          RAY('x ≥ −3', -3, 'right', true, -6, 4)]
      },
      p2: {
        items: [RD('x > 2', 2, 'right', false, -2, 8), RD('x ≤ 5', 5, 'left', true, -2, 8), RD('x < −1', -1, 'left', false, -4, 6), RD('x ≥ 0', 0, 'right', true, -4, 6)]
      },
      p3: {
        items: [IQ('x < 7', 6, 'most'), IQ('x ≥ −2', -2, 'least'), IQ('x > 3.5', 4, 'least'), IQ('x ≤ 10', 10, 'most'),
          { q: 'Riders must be at least 120 cm tall.', pic: ['nl', { min: 110, max: 130, tick: 1, lab: 5, ray: { at: 120, dir: 'right', closed: true, key: true } }], ineq: 'x ≥ 120', wide: true }]
      },
      think: {
        items: [{ q: '{a} drew x ≥ 2 with an open dot. What went wrong?', lines: { n: 3, key: 'x ≥ 2 includes 2, so the dot must be filled.' } },
          { q: 'How are x > 3 and x ≥ 3 different?', lines: { n: 2, key: 'x ≥ 3 includes 3; x > 3 does not.' } },
          RAY('x < 1', 1, 'left', false, -4, 6)]
      }
    },

    solveit: {
      watch: 'treating the inequality sign like an equals sign at the end. Keep the sign all the way to x.',
      goal: 'I can solve an inequality.',
      learn: {
        show: { eq: ['3x + 2 > 14', '3x > 12', 'x > 4'] },
        together: [{ eq: ['2x + 1 < 11', '2x < []', 'x < []'], a: [10, 5], solve: '2x + 1 = 11' }, { eq: ['4x − 3 ≥ 9', '4x ≥ []', 'x ≥ []'], a: [12, 3], solve: '4x − 3 = 9' }],
        cue: 'Solve it like an equation. Keep the sign.',
        own: [{ eq: ['5x + 4 > 29', '5x > []', 'x > []'], a: [25, 5], solve: '5x + 4 = 29' }, { eq: ['3x − 6 ≤ 15', '3x ≤ []', 'x ≤ []'], a: [21, 7], solve: '3x − 6 = 15' }]
      },
      p1: {
        show: { eq: ['x + 5 < 12', 'x < 7'] },
        items: [{ eq: ['x + 8 > 15', 'x > []'], a: [7], solve: 'x + 8 = 15' }, { eq: ['x − 4 ≤ 9', 'x ≤ []'], a: [13], solve: 'x − 4 = 9' },
          { eq: ['6x ≥ 42', 'x ≥ []'], a: [7], solve: '6x = 42' }, { eq: ['2x + 3 < 19', 'x < []'], a: [8], solve: '2x + 3 = 19' },
          { eq: ['4x − 1 > 23', 'x > []'], a: [6], solve: '4x − 1 = 23' }, { eq: ['3x + 10 ≤ 40', 'x ≤ []'], a: [10], solve: '3x + 10 = 40' }]
      },
      p2: {
        items: [IQ('2x + 5 < 20', 7, 'most'), IQ('3x − 1 > 13', 5, 'least'), IQ('5x + 2 ≤ 37', 7, 'most'), IQ('4x + 4 ≥ 30', 7, 'least'),
          { eq: ['0.5x + 2 > 6', 'x > []'], a: [8], solve: '0.5x + 2 = 6' }, { eq: ['1.5x − 3 ≤ 9', 'x ≤ []'], a: [8], solve: '1.5x − 3 = 9' }]
      },
      p3: {
        items: [story('{a} has $40 and buys {many} at $6 each. What is the most {many} {a} can buy?', '{many}', 6, '40 ÷ 6 rounded down', { ineq: '6x ≤ 40', edge: 'most', calc: null }),
          story('A taxi charges $4 plus $2 a km. {b} has $25. How many whole km at most?', 'km', 10, '(25 − 4) ÷ 2', { ineq: '4 + 2x ≤ 25', edge: 'most', calc: null }),
          story('A club needs more than $150. It has $30 and earns $8 a car wash. Fewest car washes?', 'car washes', 16, '(150 − 30) ÷ 8', { ineq: '30 + 8x > 150', edge: 'least', calc: null, wide: true })]
      },
      think: {
        items: [{ q: '{b} solved 2x + 1 < 11 and wrote x = 5. What went wrong?', lines: { n: 3, key: 'Keep the sign: x < 5. Every number less than 5 works, not only 5.' } },
          { q: 'Is 5 a solution of 2x + 1 < 11? Explain.', lines: { n: 2, key: 'No. 2 × 5 + 1 = 11, which is not less than 11.' } },
          IQ('7x − 4 < 45', 6, 'most')]
      }
    },

    loop: {
      watch: 'running the loop one time too many or too few. Count each pass and write the value each time.',
      goal: 'I can trace and change code with a loop.',
      learn: {
        show: { pic: ['code', { lines: ['total = 4', 'repeat 4 times:', '  total = total + 3', 'show total'] }], cap: '4, 7, 10, 13, 16' },
        together: [CD(['total = 10', 'repeat 5 times:', '  total = total − 2', 'show total'], 0, '10 − 5 × 2'), CD(['x = 1', 'repeat 3 times:', '  x = x × 2', 'show x'], 8, '1 × 2 × 2 × 2')],
        cue: 'Trace one pass at a time.',
        own: [CD(['total = 0', 'repeat 6 times:', '  total = total + 5', 'show total'], 30, '0 + 6 × 5'), CD(['total = 50', 'repeat 6 times:', '  total = total − 4', 'show total'], 26, '50 − 6 × 4')]
      },
      p1: {
        show: { pic: ['code', { lines: ['n = 2', 'repeat 3 times:', '  n = n + 5', 'show n'] }], eq: ['2, 7, 12, 17'] },
        items: [CD(['total = 3', 'repeat 5 times:', '  total = total + 4', 'show total'], 23, '3 + 5 × 4'), CD(['total = 100', 'repeat 8 times:', '  total = total − 9', 'show total'], 28, '100 − 8 × 9'),
          CD(['x = 1', 'repeat 4 times:', '  x = x × 3', 'show x'], 81, '1 × 3 × 3 × 3 × 3'), CD(['total = 2.5', 'repeat 4 times:', '  total = total + 1.5', 'show total'], 8.5, '2.5 + 4 × 1.5')]
      },
      p2: {
        items: [CD(['total = 0', 'repeat 3 times:', '  total = total + 4', '  total = total + 1', 'show total'], 15, '0 + 3 × (4 + 1)'),
          CD(['total = 5', 'repeat 10 times:', '  total = total + 2', 'show total'], 25, '5 + 10 × 2'),
          CD(['total = 20', 'repeat 3 times:', '  total = total − 7', 'show total'], -1, '20 − 3 × 7'),
          { q: 'How many times must it repeat to show 40?', pic: ['code', { lines: ['total = 4', 'repeat ? times:', '  total = total + 3', 'show total'] }], eq: ['[] times'], a: [12], calc: '(40 − 4) ÷ 3' }]
      },
      p3: {
        items: [{ q: 'What start makes it show 50?', pic: ['code', { lines: ['total = ?', 'repeat 6 times:', '  total = total + 7', 'show total'] }], eq: ['[]'], a: [8], calc: '50 − 6 × 7' },
          { q: 'What step makes it show 0?', pic: ['code', { lines: ['total = 60', 'repeat 5 times:', '  total = total − ?', 'show total'] }], eq: ['[]'], a: [12], calc: '60 ÷ 5' },
          { q: 'It shows 7, 10, 13 for n = 1, 2, 3. Write the rule.', pic: ['code', { lines: ['total = 4', 'repeat n times:', '  total = total + 3', 'show total'] }], eq: ['[] n + []'], a: [3, 4], seq: [7, 10, 13], rule: true, wide: true }]
      },
      think: {
        items: [{ q: '{b} traced total = 4, repeat 3 times: total = total + 3, and got 16. What went wrong?', lines: { n: 3, key: '{b} ran the loop 4 times. 3 passes: 7, 10, 13.' } },
          { q: 'Why does a loop make code easier to change?', lines: { n: 2, key: 'To repeat 100 times, you change one number instead of writing 100 lines.' } },
          { q: 'Write a loop that shows 35.', lines: { n: 3, key: 'For example: total = 5, repeat 6 times: total = total + 5, show total.' } }]
      }
    },

    subprog: {
      watch: 'copying the same steps again instead of using the sub-program. Write it once, use it many times.',
      goal: 'I can use a sub-program.',
      learn: {
        show: { pic: ['code', { lines: ['define addTax(price):', '  return price + price × 0.13', 'show addTax(20)'] }], eq: ['20 + 2.6 = 22.6'] },
        together: [CD(['define area(l, w):', '  return l × w', 'show area(4, 6)'], 24, '4 × 6'), CD(['define addTax(price):', '  return price + price × 0.13', 'show addTax(50)'], 56.5, '50 + 50 × 0.13')],
        cue: 'Put the numbers in for the names.',
        own: [CD(['define double(n):', '  return n × 2', 'show double(7) + 1'], 15, '7 × 2 + 1'), CD(['define area(l, w):', '  return l × w', 'show area(2.5, 8)'], 20, '2.5 × 8')]
      },
      p1: {
        show: { pic: ['code', { lines: ['define half(n):', '  return n ÷ 2', 'show half(18)'] }], eq: ['18 ÷ 2 = 9'] },
        items: [CD(['define triple(n):', '  return n × 3', 'show triple(12)'], 36, '12 × 3'), CD(['define perim(l, w):', '  return 2 × l + 2 × w', 'show perim(5, 3)'], 16, '2 × 5 + 2 × 3'),
          CD(['define addTax(price):', '  return price + price × 0.13', 'show addTax(100)'], 113, '100 + 100 × 0.13'), CD(['define square(n):', '  return n × n', 'show square(9)'], 81, '9 × 9')]
      },
      p2: {
        items: [CD(['define double(n):', '  return n × 2', 'show double(double(5))'], 20, '5 × 2 × 2'), CD(['define area(l, w):', '  return l × w', 'show area(3, 4) + area(2, 5)'], 22, '3 × 4 + 2 × 5'),
          CD(['define cost(visits):', '  return 15 + 6 × visits', 'show cost(8)'], 63, '15 + 6 × 8'), CD(['define addTax(price):', '  return price + price × 0.13', 'show addTax(40)'], 45.2, '40 + 40 × 0.13')]
      },
      p3: {
        items: [CD(['define cost(km):', '  return 4 + 1.5 × km', 'total = 0', 'repeat 2 times:', '  total = total + cost(10)', 'show total'], 38, '2 × (4 + 1.5 × 10)'),
          CD(['define sale(price):', '  return price − price × 0.25', 'show sale(80)'], 60, '80 − 80 × 0.25'),
          { q: 'Tax goes up to 15%. Which line changes?', pic: ['code', { lines: ['define addTax(price):', '  return price + price × 0.13'] }], lines: { n: 1, key: 'Line 2: return price + price × 0.15.' } }]
      },
      think: {
        items: [{ q: 'Why is a sub-program better than writing the same steps many times?', lines: { n: 3, key: 'You write it once and use it many times. To change it, you edit one place.' } },
          { q: 'Write a sub-program that finds the perimeter of a square.', lines: { n: 3, key: 'define perim(s): return 4 × s' } },
          CD(['define f(n):', '  return 3 × n + 4', 'show f(10)'], 34, '3 × 10 + 4')]
      }
    }
  } });
})();
