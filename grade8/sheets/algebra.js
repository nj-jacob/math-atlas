/* Grade 8 Algebra: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/algebra.lessons.js: Learn, Practise 1 to 3 and Think. Every question is written here, so a sheet always
   prints the same. Theme words: {a} {b} names.
   Ontario 2020: C1.1 to C1.3 linear patterns, their rate and initial value, tables, graphs and rules; C1.4 patterns of
   fractions, decimals and integers; C2.1 like terms and adding expressions; C2.2 the value of an expression; C2.3
   equations; C2.4 inequalities on a number line. The answer checks are in tests/verify/sheets.js: a figure's term follows
   t = mn + b from its picture, table, graph or first terms; a value is put back in (expr, solve); simplified terms equal
   the start for every value of x (simp); an inequality's boundary and direction are tested (bnd). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* the value of e when its letter is v */
  function at(e, v, x) { return S.calc(e.replace(/(\d)\(/g, '$1 × (').replace(new RegExp('(\\d)' + (x || 'x'), 'g'), '$1 × (' + v + ')').replace(new RegExp(x || 'x', 'g'), '(' + v + ')')); }
  /* patterns: from tiles, from first terms, from a table, from a graph */
  function GF(m, b, n) { return { pic: ['grow', { m: m, b: b, k: 3 }], q: 'How many tiles in figure ' + n + '?', eq: ['[] tiles'], a: [m * n + b], fig: n }; }
  function GR(m, b) { return { pic: ['grow', { m: m, b: b, k: 3 }], q: 'Write the rule.', eq: ['t = []n + []'], a: [m, b], rule: true }; }
  function SQ(seq, n) { return { q: 'Figures 1, 2, 3: ' + seq.join(', ') + '. Figure ' + n + '?', eq: ['[]'], a: [seq[0] + (seq[1] - seq[0]) * (n - 1)], seq: seq, fig: n }; }
  function SR(seq) { return { q: 'Figures 1, 2, 3: ' + seq.join(', ') + '.', eq: ['t = []n + []'], a: [seq[1] - seq[0], 2 * seq[0] - seq[1]], seq: seq, rule: true }; }
  function TR(m, b, ns) { return { pic: ['tbl', { head: ['n', 't'], rows: ns.map(function (n) { return [n, m * n + b]; }) }], q: 'Write the rule.', eq: ['t = []n + []'], a: [m, b], rule: true }; }
  function TF(m, b, ns, n) { return { pic: ['tbl', { head: ['n', 't'], rows: ns.map(function (n) { return [n, m * n + b]; }) }], q: 'Term ' + n + '?', eq: ['[]'], a: [m * n + b], fig: n }; }
  function GP(m, b, k, ymax, ys) { var p = []; for (var n = 1; n <= k; n++) p.push([n, m * n + b]); return { pts: p, xmax: k + 1, ymax: ymax, xs: 1, ys: ys, xl: 'Figure', yl: 'Term', h: 64 }; }
  function GG(m, b, k, ymax, ys) { return { pic: ['scat', GP(m, b, k, ymax, ys)], q: 'Write the rule.', eq: ['t = []n + []'], a: [m, b], rule: true }; }
  /* the next terms of a pattern of rational numbers */
  function NX(list, k, step) {
    var t = list.slice(), a = [];
    var fr = /\//.test(list.join());
    for (var i = 0; i < k; i++) { var v = +(S.calc(list[list.length - 1]) + step * (i + 1)).toFixed(4); a.push(fr ? S.asFrac(v, true) : v); t.push('[]'); }
    return { eq: [t.join(', ')], a: a, wide: true };
  }
  function FW(e, n) { return { q: 't = ' + e + '. Term ' + n + '?', eq: ['t = []'], a: [at(e, n, 'n')], expr: e, n: n }; }
  function BW(e, t) { var r = e + ' = ' + t; return { q: 't = ' + e + '. Which figure has ' + t + '?', eq: [r, 'n = []'], a: [solve(r, 'n')], solve: r }; }
  /* like terms: the answer written as ax + b (or ax − b) */
  function LT(e, tiles) {
    var c = at(e, 0), m = +(at(e, 1) - c).toFixed(6), r = '[]x ' + (c < 0 ? '−' : '+') + ' []';
    var it = { q: 'Simplify.', eq: [e + ' = ' + r], a: [m, Math.abs(c)], simp: e };
    if (tiles) { it.pic = ['atiles', tiles]; it.tiles = true; }
    if (S.tw(it.eq[0], 18, 700) > 150) it.wide = true;
    return it;
  }
  function EV(e, v) { var r = e + ' = []'; return { q: 'x = ' + v + '.', eq: [r], a: [+at(e, v).toFixed(6)], expr: e, n: v, wide: S.tw(r, 18, 700) > 150 }; }
  /* an equation: the value of the letter that makes both sides equal (solved by trying the line through two values) */
  function solve(r, x) { var s = r.split('='), f = function (v) { return at(s[0], v, x) - at(s[1], v, x); }, f0 = f(0), f1 = f(1); return +(f0 / (f0 - f1)).toFixed(6); }
  function SV(r) { return { eq: [r, 'x = []'], a: [solve(r)], solve: r, wide: S.tw(r, 18, 700) > 150 }; }
  function SS(q, r, unit) { return { q: q, eq: [r, 'x = []' + (unit ? ' ' + unit : '')], a: [solve(r)], solve: r }; }
  /* an inequality: solve it, then the boundary and its sign (blank sign when it may flip) */
  function IQ(r, blankSign) {
    var sign = r.match(/[<>≤≥]/)[0], s = r.split(sign), f = function (v) { return at(s[0], v) - at(s[1], v); }, b = +(f(0) / (f(0) - f(1))).toFixed(6);
    var k = f(1) - f(0), out = k > 0 ? sign : { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }[sign];
    return { eq: [r, blankSign ? 'x [] []' : 'x ' + out + ' []'], a: blankSign ? [out, b] : [b], bnd: r };
  }
  function RAY(at0, dir, open, lo, hi) {
    var sign = dir === 'right' ? (open ? '>' : '≥') : (open ? '<' : '≤');
    return { pic: ['iline', { min: lo, max: hi, lab: hi - lo > 12 ? 2 : 1, ray: { at: at0, dir: dir, open: open } }], q: 'Write the inequality.', eq: ['x [] []'], a: [sign, at0], bnd: 'x ' + sign + ' ' + at0 };
  }

  S.register('algebra', { code: 'AL', ideas: {

    rate: {
      watch: 'taking figure 1 as the initial value. The initial value is figure 0: step back once.',
      goal: 'I can find the rate and initial value of a linear pattern.',
      learn: {
        show: { pic: ['grow', { m: 3, b: 2, k: 3 }], cap: 'up 3 each figure; figure 0 has 2', eq: ['t = 3n + 2'] },
        together: [GR(2, 1)],
        cue: 'Rate: the change each step. Initial value: step back from figure 1.',
        own: [SR([5, 8, 11]), GF(3, 1, 10)]
      },
      p1: {
        show: { eq: ['6, 10, 14: rate 4', '6 − 4 = 2: initial value'] },
        items: [GR(2, 3), GR(5, 1), GF(2, 4, 8), SR([9, 12, 15]), SR([4, 10, 16]), SQ([3, 5, 7], 20)]
      },
      p2: {
        items: [SR([11, 13, 15]), SR([20, 17, 14]), SR([30, 26, 22]), SQ([8, 15, 22], 10), SQ([50, 45, 40], 9), TR(6, 4, [1, 2, 3, 4])]
      },
      p3: {
        items: [SR([1.5, 2, 2.5]), SR([0.25, 0.5, 0.75]), TR(-3, 25, [1, 2, 3, 4]), TF(2.5, 1, [1, 2, 3, 4], 12),
          { q: 'A pool has 400 L and drains 25 L a minute. How much is left after 9 minutes?', eq: ['[] L'], a: [175], calc: '400 − 25 × 9' },
          { q: 'A taxi charges $3.50, then $2 a km. What is the cost for 8 km?', eq: ['[] dollars'], a: [19.5], calc: '3.50 + 2 × 8' }]
      },
      think: {
        items: [{ q: '{a} says the initial value of 7, 11, 15 is 7. Explain.', lines: { n: 3, key: '7 is figure 1. Step back 4 to figure 0: the initial value is 3.' } },
          { q: 'Make a shrinking pattern that starts at 40. Give its rule.', lines: { n: 2, key: 'For example 40, 35, 30, 25: t = −5n + 45 (figure 1 is 40).' } },
          SR([12, 19, 26]),
          { q: 'How are a growing and a shrinking pattern different?', lines: { n: 2, key: 'A growing pattern has a positive rate; a shrinking one a negative rate.' } }]
      }
    },

    graphs: {
      watch: 'thinking the line that starts higher is always bigger. A steeper line catches up and passes it.',
      goal: 'I can read a linear pattern from its graph.',
      learn: {
        show: { cap: 'figure 0 at 1, up 2 each figure', eq: ['t = 2n + 1'] },
        together: [GG(3, 3, 4, 15, 3)],
        cue: 'Rate: how far it rises each step. Initial value: where it starts.',
        own: [GG(2, 4, 4, 12, 2), GG(5, 5, 3, 20, 5)]
      },
      p1: {
        show: { eq: ['rate: how steep', 'start: figure 0'] },
        items: [GG(4, 4, 4, 20, 4), GG(2, 6, 4, 14, 2), GG(-2, 12, 4, 12, 2), GG(5, 0, 3, 15, 5)]
      },
      p2: {
        items: [{ q: 'When are the terms of 2n + 11 and 5n + 2 equal? Figure:', eq: ['2n + 11 = 5n + 2', 'n = []'], a: [3], solve: '2n + 11 = 5n + 2', wide: true },
          { q: 'When are 4n + 1 and 2n + 9 equal? Figure:', eq: ['4n + 1 = 2n + 9', 'n = []'], a: [4], solve: '4n + 1 = 2n + 9', wide: true },
          GG(-3, 15, 4, 15, 3), TR(1.5, 2, [1, 2, 3, 4])]
      },
      p3: {
        items: [{ q: 'Plan A: $20, then $5 a month. Plan B: $40, then $3 a month. In which month are they the same?', eq: ['5n + 20 = 3n + 40', 'n = []'], a: [10], solve: '5n + 20 = 3n + 40', wide: true },
          { q: '{a} has $60 and spends $4 a week. {b} has $12 and saves $8 a week. In which week are they equal?', eq: ['60 − 4n = 12 + 8n', 'n = []'], a: [4], solve: '60 − 4n = 12 + 8n', wide: true },
          GG(10, 20, 4, 60, 10), TR(-4, 30, [2, 3, 4, 5])]
      },
      think: {
        items: [{ q: 'Two lines start at 2. One is t = 5n + 2. Describe t = 2n + 2.', lines: { n: 3, key: 'It starts at the same place but is less steep: up 2 each step, not 5.' } },
          { q: 'What does a line sloping down tell you?', lines: { n: 2, key: 'The rate is negative: it is a shrinking pattern.' } },
          GG(3, 3, 4, 15, 3),
          { q: 'Why do the points of a linear pattern make a straight line?', lines: { n: 2, key: 'Each step adds the same amount, so each point rises the same distance.' } }]
      }
    },

    forward: {
      exp: ['C1.3', 'C1.4'],
      watch: 'adding before multiplying: 3 × (50 + 2). Replace n, multiply, then add.',
      goal: 'I can use a rule to find any term, with integers, decimals and fractions.',
      learn: {
        show: { cap: 't = 3n + 2, figure 50', eq: ['t = 3 × 50 + 2 = 152'] },
        together: [FW('4n + 3', 25), NX(['0.25', '0.5', '0.75'], 2, 0.25)],
        cue: 'Replace n with the figure number. Multiply, then add or subtract.',
        own: [FW('5n − 3', 40), FW('2n + 7', 100), NX(['5', '2', '−1'], 2, -3)]
      },
      p1: {
        show: { eq: ['1/4, 1/2, 3/4, 1, 1 1/4', 'up 1/4 each time'] },
        items: [FW('6n + 1', 20), FW('3n − 4', 15), FW('10n + 5', 30), FW('7n', 12), NX(['1.2', '1.5', '1.8'], 2, 0.3), NX(['8', '5', '2'], 2, -3)]
      },
      p2: {
        items: [FW('−2n + 50', 18), FW('0.5n + 4', 30), FW('1.5n − 2', 10), FW('−4n + 3', 6), NX(['−10', '−7', '−4'], 2, 3), NX(['2.4', '2.1', '1.8'], 3, -0.3)]
      },
      p3: {
        items: [FW('2.5n + 1.5', 20), FW('−3n − 5', 7), FW('0.25n + 1', 12), NX(['1/4', '1/2', '3/4'], 2, 0.25),
          { q: 'Seats in a hall: row n has 2n + 14 seats. How many in row 25?', eq: ['[] seats'], a: [64], calc: '2 × 25 + 14' },
          { q: 'A plant is 4.5 cm tall and grows 1.5 cm a week. How tall after 12 weeks?', eq: ['[] cm'], a: [22.5], calc: '4.5 + 1.5 × 12' }]
      },
      think: {
        items: [{ q: 'Why is a rule faster than drawing figure 50?', lines: { n: 2, key: 'You replace n with 50 and calculate once, with no drawing.' } },
          { q: '{a} says term 10 of t = 4n + 1 is 4 × 11 = 44. Explain.', lines: { n: 3, key: '{a} added before multiplying. Multiply first: 4 × 10 + 1 = 41.' } },
          FW('−0.5n + 20', 16),
          { q: 'Write a pattern that goes up by 0.2 each time.', lines: { n: 1, key: 'For example 1, 1.2, 1.4, 1.6, 1.8.' } }]
      }
    },

    backward: {
      watch: 'guessing figures one by one. Write the equation and solve it: undo + or − first, then × or ÷.',
      goal: 'I can work backwards to find which figure has a term.',
      learn: {
        show: { cap: 't = 3n + 2 has 62', eq: ['3n + 2 = 62', 'n = 20'] },
        together: [BW('4n + 1', 41)],
        cue: 'Write the equation. Undo the + or −, then the ×.',
        own: [BW('2n + 5', 35), BW('5n − 3', 47)]
      },
      p1: {
        show: { eq: ['5n − 4 = 46', '5n = 50, n = 10'] },
        items: [BW('3n + 4', 40), BW('6n − 1', 53), BW('10n + 2', 102), BW('2n + 9', 59), BW('4n − 7', 33)]
      },
      p2: {
        items: [BW('7n + 3', 94), BW('−2n + 60', 24), BW('0.5n + 1', 9), BW('3n − 10', 50), BW('−5n + 100', 35)]
      },
      p3: {
        items: [BW('1.5n + 3', 27), BW('−4n + 90', 6), BW('12n − 8', 136),
          { q: 'A gym costs $25, then $15 a visit. {a} paid $205. How many visits?', eq: ['15n + 25 = 205', 'n = []'], a: [12], solve: '15n + 25 = 205' },
          { q: 'A tank has 300 L and drains 12 L a minute. When is 84 L left? Minute:', eq: ['300 − 12n = 84', 'n = []'], a: [18], solve: '300 − 12n = 84' }]
      },
      think: {
        items: [{ q: 'Can t = 3n + 2 have a term of 50? Explain.', lines: { n: 3, key: 'No. 3n = 48 gives n = 16, so yes, figure 16. (Check: 3 × 16 + 2 = 50.)' } },
          { q: 'Can t = 2n have a term of 15? Explain.', lines: { n: 2, key: 'No. n would be 7.5, and there is no figure 7.5: every term is even.' } },
          BW('8n + 4', 100),
          { q: 'How do you check your answer?', lines: { n: 2, key: 'Put n back into the rule and see that it gives the term.' } }]
      }
    },

    tiles: {
      exp: ['C2.1'],
      watch: 'adding x tiles and unit tiles together: 3x + 2 is not 5x. Only like terms join.',
      goal: 'I can collect like terms with algebra tiles.',
      learn: {
        show: { pic: ['atiles', { xp: 3, up: 2 }], cap: 'long tiles are x, small tiles are 1', eq: ['3x + 2'] },
        together: [LT('2x + 3 + x + 1', { xp: 3, up: 4 })],
        cue: 'Group the same kind: x with x, numbers with numbers.',
        own: [LT('x + 4 + 2x + 2', { xp: 3, up: 6 }), LT('4x + 1 + x + 5')]
      },
      p1: {
        show: { eq: ['(2x + 3) + (x + 5)', '= 3x + 8'] },
        items: [LT('3x + 2x + 4'), LT('5 + 2x + 3'), LT('x + 2 + x + 2'), LT('6x + 3 + 2x + 1'), LT('(2x + 3) + (4x + 6)')]
      },
      p2: {
        items: [LT('(5x + 2) + (x + 9)'), LT('7x + 4 + 3 + 2x'), LT('(6x + 5) − (2x + 1)'), LT('(8x + 7) − (3x + 2)'), LT('2.5x + 1 + 1.5x + 3')]
      },
      p3: {
        items: [LT('(4x + 9) − (x + 3)'), LT('(10x + 12) − (4x + 5)'), LT('3x + 0.5 + 2x + 1.25'), LT('(2x + 5) + (3x + 4) + x'),
          { q: 'A rectangle is 2x + 3 long and x + 1 wide. Write its perimeter.', eq: ['[]x + []'], a: [6, 8], simp: '2(2x + 3) + 2(x + 1)' }]
      },
      think: {
        items: [{ q: '{a} says 3x + 4 = 7x. Explain.', lines: { n: 3, key: '3x and 4 are not like terms: x tiles and unit tiles. 3x + 4 cannot be joined.' } },
          { q: 'Draw tiles for 2x + 5.', draw: { h: 60, key: 'Two long x tiles and five small unit tiles.' } },
          LT('(3x + 8) + (2x + 7)'),
          { q: 'Why can you add 2x and 5x but not 2x and 5?', lines: { n: 2, key: '2x and 5x are the same kind (x). 5 is a number on its own.' } }]
      }
    },

    signs: {
      exp: ['C2.1'],
      watch: 'losing the minus sign. Keep each term with the sign in front of it, then collect.',
      goal: 'I can collect like terms with negatives.',
      learn: {
        show: { pic: ['atiles', { xp: 3, xn: 1, up: 2, un: 4 }], cap: 'a white tile cancels a shaded one', eq: ['2x − 2'] },
        together: [LT('3x − 1 + x − 4', { xp: 4, up: 0, un: 5 })],
        cue: 'Keep the sign with its term. Cancel zero pairs.',
        own: [LT('5x − 2x + 3'), LT('2x + 6 − 5x − 1')]
      },
      p1: {
        show: { eq: ['4x − 7 − 2x + 3', '= 2x − 4'] },
        items: [LT('6x − 4x + 2'), LT('x − 5 + 3x'), LT('7 − 2x + 4x − 9'), LT('−3x + 5x − 1'), LT('5x − 6 − x − 2')]
      },
      p2: {
        items: [LT('(4x − 3) + (x − 6)'), LT('(2x + 5) − (3x − 1)'), LT('(−x + 4) + (5x − 9)'), LT('(6x − 2) − (2x + 7)'), LT('−4x + 3 − 2x − 8')]
      },
      p3: {
        items: [LT('(3x − 4) − (5x − 10)'), LT('(−2x − 3) − (−4x + 1)'), LT('(x − 1/2) + (2x − 1/4)'), LT('(7x − 5) + (−3x − 2) − x'),
          { q: 'A triangle has sides 3x − 2, 2x + 5 and x − 1. Write its perimeter.', eq: ['[]x + []'], a: [6, 2], simp: '3x − 2 + 2x + 5 + x − 1' }]
      },
      think: {
        items: [{ q: '{a} says (5x + 2) − (x + 3) is 4x + 5. Explain.', lines: { n: 3, key: 'Subtract both terms: 5x + 2 − x − 3 = 4x − 1.' } },
          { q: 'What do a shaded x tile and a white x tile make?', lines: { n: 1, key: 'Zero: x + (−x) = 0, a zero pair.' } },
          LT('(2x − 9) − (−3x − 4)'),
          { q: 'Write two expressions that simplify to 3x − 2.', lines: { n: 2, key: 'For example 5x − 2x − 2, or (x + 1) + (2x − 3).' } }]
      }
    },

    sub: {
      watch: 'writing 3x with x = 4 as 34. 3x means 3 × x: 3 × 4 = 12.',
      goal: 'I can substitute a value and calculate.',
      learn: {
        show: { cap: 'x = 4', eq: ['3x + 5 = 3 × 4 + 5', '3x + 5 = 17'] },
        together: [EV('2x + 7', 6), EV('5x − 3', 0.5)],
        cue: 'Replace the letter in brackets. Then BEDMAS.',
        own: [EV('4x + 1', 3), EV('10 − 2x', 4), EV('x/2 + 6', 8)]
      },
      p1: {
        show: { eq: ['x = 1/2', '6x − 1 = 6 × 1/2 − 1 = 2'] },
        items: [EV('3x + 2', 5), EV('7x − 4', 2), EV('20 − 3x', 6), EV('8x', 0.25), EV('2x + 9', 1.5), EV('x/4 + 3', 12)]
      },
      p2: {
        items: [EV('6x − 1', 1/2), EV('4x + 2.5', 0.5), EV('3(x + 4)', 6), EV('2(5 − x)', 1.5), EV('12/x + 1', 3), EV('1.2x − 0.4', 5)]
      },
      p3: {
        items: [EV('(x + 3)/2', 9), EV('5(2x − 1)', 0.3), EV('2x + 3/4', 1/4), EV('100 − 4.5x', 8),
          { q: 'A plumber charges $40 + $65 per hour: 40 + 65h. What is the cost for h = 3.5?', eq: ['[] dollars'], a: [267.5], calc: '40 + 65 × 3.5' },
          { q: 'Perimeter of a square is 4s. What is it when s = 7.25 cm?', eq: ['[] cm'], a: [29], calc: '4 × 7.25' }]
      },
      think: {
        items: [{ q: '{a} says 2x for x = 5 is 25. Explain.', lines: { n: 3, key: '2x means 2 × x, so 2 × 5 = 10.' } },
          { q: 'Why put the value in brackets?', lines: { n: 2, key: 'It keeps a negative or a fraction together and shows the multiplying.' } },
          EV('3x − 2x + 7', 10),
          { q: 'Find a value of x that makes 4x + 1 equal 21.', eq: ['x = []'], a: [5], solve: '4x + 1 = 21' }]
      }
    },

    power: {
      watch: 'squaring a negative and getting a negative. (−3)² = (−3) × (−3) = 9.',
      goal: 'I can substitute negatives and use exponents.',
      learn: {
        show: { cap: 'x = −3', eq: ['x² = (−3)² = 9'] },
        together: [EV('x² + 1', -4), EV('2x − 5', -3)],
        cue: 'Brackets around a negative. Exponents before × and ÷.',
        own: [EV('x² − 2', -5), EV('3x + 10', -2), EV('2x²', -3)]
      },
      p1: {
        show: { eq: ['x = −2', '−x² = −(−2)² = −4'] },
        items: [EV('x²', -6), EV('x² + x', -3), EV('4x − 1', -2), EV('5 − x', -7), EV('x³', -2), EV('−x²', -4)]
      },
      p2: {
        items: [EV('x² − 3x', -2), EV('2x² + 1', -1), EV('(x + 2)²', -5), EV('10 − x²', -3), EV('x² + 2x + 1', -4), EV('x³ + 8', -2)]
      },
      p3: {
        items: [EV('3x² − x', -2), EV('(2x − 1)²', -1), EV('x² − 5x + 6', -1), EV('−2x³', -3), EV('x² + 0.5', -0.5), EV('(1 − x)³', 3)]
      },
      think: {
        items: [{ q: 'Why is −3² = −9 but (−3)² = 9?', lines: { n: 3, key: 'In −3² only 3 is squared, then made negative. In (−3)² the brackets square −3.' } },
          { q: 'Can x² ever be negative? Explain.', lines: { n: 2, key: 'No. A number times itself is positive or zero.' } },
          EV('x² − 4x', -5),
          { q: 'x² = 49. Find both values of x.', eq: ['x = [] or x = []'], a: [7, -7], solve: 'x² = 49' }]
      }
    },

    balance: {
      watch: 'doing something to one side only. Whatever you do to one side, do to the other.',
      goal: 'I can solve equations in two steps and check the answer.',
      learn: {
        show: { cap: 'take 5 from both sides, then divide both by 3', eq: ['3x + 5 = 20', 'x = 5'] },
        together: [SV('2x + 7 = 19'), SV('4x − 3 = 25')],
        cue: 'Undo + or − first, then × or ÷. Do it to both sides.',
        own: [SV('5x + 2 = 37'), SV('3x − 8 = 13'), SV('x/4 + 1 = 6')]
      },
      p1: {
        show: { eq: ['check x = 5:', '3 × 5 + 5 = 20 ✓'] },
        items: [SV('2x + 3 = 15'), SV('6x − 4 = 32'), SV('x/3 − 2 = 5'), SV('7x + 1 = 50'), SV('10 + 3x = 31'), SV('9x − 9 = 0')]
      },
      p2: {
        items: [SV('−2x + 5 = 17'), SV('4x + 7 = −5'), SV('0.5x + 3 = 8'), SV('3x − 4.5 = 6'), SV('2(x + 3) = 22'), SV('−3x − 6 = 9')]
      },
      p3: {
        items: [SV('1.5x + 2 = 11'), SV('−4x + 1.2 = 9.2'), SV('5(x − 2) = 35'),
          SS('A phone plan is $15 a month plus $0.10 a text. The bill is $23.40. How many texts?', '15 + 0.1x = 23.4', 'texts'),
          SS('3 tickets and a $6 fee cost $57. What is one ticket?', '3x + 6 = 57', 'dollars')]
      },
      think: {
        items: [{ q: '{a} solved 2x + 6 = 20 and got x = 13. Check it, and fix it.', lines: { n: 3, key: '2 × 13 + 6 = 32, not 20. Take 6 first: 2x = 14, x = 7.' } },
          { q: 'Why undo + or − before × or ÷?', lines: { n: 2, key: 'It is BEDMAS backwards: the last step done is the first one undone.' } },
          SV('−6x + 4 = −20'),
          { q: 'Write an equation whose answer is x = 4.', lines: { n: 1, key: 'For example 3x + 2 = 14.' } }]
      }
    },

    both: {
      watch: 'subtracting the x terms from one side only. Move the x terms to one side, the numbers to the other.',
      goal: 'I can solve equations with x on both sides.',
      learn: {
        show: { cap: 'take 2x from both sides, then add 3', eq: ['5x − 3 = 2x + 9', '3x = 12, x = 4'] },
        together: [SV('4x + 1 = 2x + 9')],
        cue: 'Get the x terms on one side first.',
        own: [SV('6x − 5 = 3x + 7'), SV('7x = 2x + 30')]
      },
      p1: {
        items: [SV('3x + 4 = x + 12'), SV('5x − 2 = 2x + 13'), SV('8x = 3x + 25'), SV('4x + 6 = x + 21'), SV('9x − 7 = 5x + 9')]
      },
      p2: {
        items: [SV('2x + 10 = 5x − 8'), SV('x − 4 = −3x + 12'), SV('6x + 1 = 2x − 11'), SV('0.5x + 4 = 2x − 2'), SV('3(x + 2) = x + 14')]
      },
      p3: {
        items: [SV('1.2x + 3 = 0.7x + 5.5'), SV('−2x + 7 = 3x − 18'), SV('4(x − 1) = 2(x + 5)'),
          SS('{a} has $30 and saves $8 a week. {b} has $66 and saves $5 a week. After how many weeks are they equal?', '30 + 8x = 66 + 5x', 'weeks'),
          SS('Gym A: $50 plus $4 a visit. Gym B: $20 plus $7 a visit. When do they cost the same?', '50 + 4x = 20 + 7x', 'visits')]
      },
      think: {
        items: [{ q: 'In 3x + 5 = 3x + 8, what happens? Explain.', lines: { n: 3, key: 'Taking 3x from both gives 5 = 8, which is false: no value of x works.' } },
          { q: 'Why move the smaller x term?', lines: { n: 2, key: 'It keeps the x term positive, so there is less to go wrong.' } },
          SV('7x − 12 = 3x + 4'),
          { q: 'Check whether x = 2 solves 5x − 1 = 3x + 3.', lines: { n: 2, key: '5(2) − 1 = 9 and 3(2) + 3 = 9. Yes.' } }]
      }
    },

    graph: {
      watch: 'a filled circle for < or >. Open means not included; filled means included (≤, ≥).',
      goal: 'I can show the solutions of an inequality on a number line.',
      learn: {
        show: { pic: ['iline', { min: -2, max: 8, ray: { at: 5, dir: 'left', open: true } }], cap: 'open circle: 5 is not included', eq: ['x < 5'] },
        together: [RAY(2, 'right', false, -3, 7)],
        cue: 'Open: < or >. Filled: ≤ or ≥. The shading shows the side.',
        own: [RAY(-1, 'right', true, -6, 4), RAY(3, 'left', false, -2, 8)]
      },
      p1: {
        show: { eq: ['x ≥ 2: filled at 2, shade right'] },
        items: [RAY(4, 'left', true, -1, 9), RAY(-2, 'right', false, -7, 3), RAY(0, 'left', false, -5, 5), RAY(6, 'right', true, 1, 11)]
      },
      p2: {
        items: [IQ('x + 3 > 7'), IQ('x − 4 ≤ 2'), IQ('2x ≥ 10'), IQ('x + 5 < 1'), IQ('3x > −9'), IQ('x − 6 ≥ −8')]
      },
      p3: {
        items: [IQ('2x + 1 < 11'), IQ('4x − 3 ≥ 9'), IQ('5x + 2 > −13'), IQ('3x − 7 ≤ 8'),
          { q: 'A bag holds at most 12 kg. It has 4.5 kg in it. How many more kg can go in? x ≤', eq: ['4.5 + x ≤ 12', 'x ≤ []'], a: [7.5], bnd: '4.5 + x ≤ 12' }]
      },
      think: {
        items: [{ q: 'Is 5 a solution of x < 5? Explain.', lines: { n: 2, key: 'No. 5 is not less than 5, so the circle is open.' } },
          { q: 'Give three solutions of x ≥ −2.', lines: { n: 1, key: 'For example −2, 0 and 3.5.' } },
          RAY(-3, 'left', true, -8, 2),
          { q: 'Write a real situation for x ≤ 30.', lines: { n: 2, key: 'For example: at most 30 students fit on the bus.' } }]
      }
    },

    flip: {
      watch: 'forgetting to flip. Multiply or divide by a negative and the sign turns around.',
      goal: 'I can solve inequalities, flipping the sign for a negative.',
      learn: {
        show: { cap: 'divide by −2: flip ≥ to ≤', eq: ['−2x + 1 ≥ 9', 'x ≤ −4'] },
        together: [IQ('−3x < 12', true), IQ('−x + 2 ≥ 5', true)],
        cue: 'Dividing by a negative? Flip the sign.',
        own: [IQ('−2x > 8', true), IQ('−4x ≤ −20', true), IQ('3x − 1 > 8', true)]
      },
      p1: {
        show: { eq: ['2 < 5', '× (−1): −2 > −5'] },
        items: [IQ('−5x ≥ 15', true), IQ('−x < 3', true), IQ('2x + 4 ≤ 10', true), IQ('−3x + 1 > 7', true), IQ('−2x − 5 ≥ 3', true)]
      },
      p2: {
        items: [IQ('−4x + 6 < −10', true), IQ('6 − x ≥ 2', true), IQ('−0.5x > 2', true), IQ('5x − 3 < 2x + 9', true), IQ('−3x − 4 ≤ 11', true)]
      },
      p3: {
        items: [IQ('10 − 2x > 4', true), IQ('−6x + 5 ≥ −13', true), IQ('2x + 7 < 5x − 8', true), IQ('8 − 3x ≤ x', true),
          { q: '{a} has $50 and spends $6 a day. For how many days does {a} have more than $14 left?', eq: ['50 − 6x > 14', 'x [] []'], a: ['<', 6], bnd: '50 − 6x > 14' }]
      },
      think: {
        items: [{ q: 'Why does the sign flip when you divide by −1?', lines: { n: 3, key: '3 < 5, but −3 > −5: making both negative reverses their order.' } },
          { q: '{a} flipped the sign in x − 3 > −7. Is that right?', lines: { n: 2, key: 'No. Only × or ÷ by a negative flips it. Adding 3 gives x > −4.' } },
          IQ('−7x + 2 < 30', true),
          { q: 'Check x = −5 in −2x + 1 ≥ 9.', lines: { n: 2, key: '−2(−5) + 1 = 11, and 11 ≥ 9. Yes.' } }]
      }
    }

  } });
})();
