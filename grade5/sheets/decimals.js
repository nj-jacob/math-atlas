/* Grade 5 Decimals and Percents: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/decimals.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.5 read, represent, compare and order decimal tenths and hundredths; B1.6 round decimals to the
   nearest tenth; B1.7 fractions, decimals and percents for tenths and hundredths; B2.3 multiply by 0.1 and 0.01;
   B2.4 add and subtract decimals to hundredths. The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* a hundred grid with n squares shaded: write the decimal */
  function GR(n) { return { pic: ['grid', { n: n, unit: '0.01', u: 7, quiet: true }], eq: ['[]'], a: [+(n / 100).toFixed(2)] }; }
  /* tenths and hundredths of a decimal */
  function TH(t, h) { return { eq: [t + ' tenths + ' + h + ' hundredths = []'], a: [+((t * 10 + h) / 100).toFixed(2)], wide: true }; }
  /* decimal disks: ones, tenths and hundredths */
  function DK(o, t, h) {
    var list = [];
    if (o) list.push([1, o]);
    if (t) list.push([0.1, t]);
    if (h) list.push([0.01, h]);
    return { pic: ['disks', { list: list }], eq: ['[]'], a: [+((o * 100 + t * 10 + h) / 100).toFixed(2)] };
  }
  /* a point on a number line in tenths (d 10) or hundredths (d 100) */
  function LN(min, max, d, pt) { return { pic: ['dline', { min: min, max: max, d: d, show: 'ends', pt: pt }], eq: ['[]'], a: [pt] }; }
  /* label the marked places on a number line */
  function LA(min, max, d, ask) { return { pic: ['dline', { min: min, max: max, d: d, show: 'ends', ask: ask }], a: ask.slice(), wide: true }; }
  /* compare two decimals: circle the sign */
  function CMP(x, y) { return { eq: [x + ' ? ' + y], pick: { opts: ['<', '>', '='], ans: +x < +y ? 0 : +x > +y ? 1 : 2, cmp: [x, y] }, pickLast: true }; }
  /* round to the nearest tenth (or whole) */
  function RD(n, to) { return { q: 'Round ' + n + ' to the nearest ' + (to === 1 ? 'whole number' : 'tenth') + '.', eq: [n + ' is about []'], a: [+(Math.round(n / to) * to).toFixed(1)], round: to }; }
  /* a fraction out of 10 or 100 as a decimal and a percent */
  function FD(n, d) { var v = n / d; return { eq: [n + '/' + d + ' = []', n + '/' + d + ' = [] %'], a: [+v.toFixed(2), +(v * 100).toFixed(0)] }; }
  /* a decimal sum; calc stories use the same */
  function AD(x, op, y) { var v = op === '+' ? x + y : x - y; return { eq: [x + ' ' + op + ' ' + y + ' = []'], a: [+v.toFixed(2)] }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* × 0.1 or × 0.01 */
  function TO(n, f) { return { eq: [n + ' × ' + f + ' = []', n + ' ÷ ' + (f === 0.1 ? 10 : 100) + ' = []'], a: [+(n * f).toFixed(4), +(n * f).toFixed(4)] }; }

  S.register('decimals', { code: 'DE', ideas: {

    grid: {
      watch: 'reading 0.4 as "four hundredths" or writing 7 hundredths as 0.7. A full row is a tenth; one square is a hundredth.',
      goal: 'I can read and write tenths and hundredths on a hundred grid.',
      learn: {
        show: { pic: ['grid', { n: 47 }], cap: '4 rows and 7 squares', eq: ['4 tenths + 7 hundredths', '= 0.47'] },
        together: [GR(63), GR(25)],
        cue: 'A full row is one tenth (0.1). One square is one hundredth (0.01).',
        own: [GR(30), GR(8), TH(7, 1)]
      },
      p1: {
        show: { pic: ['grid', { n: 25 }], cap: '25 squares of 100', eq: ['0.25'] },
        items: [GR(50), GR(14), GR(72), GR(5), TH(3, 6)]
      },
      p2: {
        items: [GR(91), GR(40), TH(6, 4), TH(1, 1), { eq: ['56 hundredths = []'], a: [0.56] }, { eq: ['0.8 = [] hundredths'], a: [80] }]
      },
      p3: {
        items: [{ eq: ['0.07 = [] hundredths'], a: [7] }, { eq: ['0.7 = [] tenths'], a: [7] }, { eq: ['0.39 = [] tenths + [] hundredths'], a: [3, 9], wide: true },
          { q: 'Shade the grid to show 0.62.', pic: ['grid', { n: 0, unit: '0.01', ask: 62 }] },
          { q: 'Which shows 3 hundredths?', pick: { opts: ['0.3', '0.03', '3.0'], ans: 1, val: 0.03 } }]
      },
      think: {
        items: [{ q: '{b} says 0.5 is less than 0.25 because 5 is less than 25. Use the grid to explain.', pic: ['grid', { n: 50 }], lines: { n: 3, key: '0.5 is 5 full rows, 50 squares. 0.25 is only 25 squares. 0.5 is more.' } },
          { q: 'Why is 0.3 the same as 0.30?', lines: { n: 3, key: '3 tenths is 3 full rows, which is 30 squares, so it is also 30 hundredths.' } },
          { q: 'How many hundredths make one whole?', eq: ['1 = [] hundredths'], a: [100] },
          { q: 'Which is more?', pick: { opts: ['0.6', '0.09'], ans: 0, big: true }, wide: true }]
      }
    },

    disks: {
      watch: 'trading the wrong way: 10 tenths make 1 one, not 1 hundredth. Each place is 10 times the place to its right.',
      goal: 'I can show decimals with place value disks.',
      learn: {
        show: { pic: ['disks', { list: [[1, 2], [0.1, 3], [0.01, 4]] }], cap: '2 ones, 3 tenths, 4 hundredths', eq: ['2.34'] },
        together: [DK(1, 5, 2), { eq: ['10 hundredths = [] tenth'], a: [1] }],
        cue: '10 hundredths make 1 tenth. 10 tenths make 1 one.',
        own: [DK(0, 4, 8), { eq: ['10 tenths = [] one'], a: [1] }]
      },
      p1: {
        show: { pic: ['disks', { list: [[1, 1], [0.1, 6]] }], cap: '1 one and 6 tenths', eq: ['1.6'] },
        items: [DK(2, 1, 0), DK(0, 7, 3), DK(4, 0, 5), DK(1, 2, 9), { eq: ['5 tenths + 5 hundredths = []'], a: [0.55], wide: true }]
      },
      p2: {
        items: [DK(3, 4, 7), DK(5, 0, 1), { eq: ['14 tenths = []'], a: [1.4] }, { eq: ['23 hundredths = []'], a: [0.23] },
          { eq: ['3.6 = 3 ones + [] tenths'], a: [6], wide: true }, { eq: ['4.07 = 4 ones + [] hundredths'], a: [7], wide: true }]
      },
      p3: {
        items: [{ eq: ['2.5 = [] tenths'], a: [25] }, { eq: ['1.25 = [] hundredths'], a: [125] }, { eq: ['1 one + 12 tenths = []'], a: [2.2], wide: true },
          { eq: ['3 tenths + 15 hundredths = []'], a: [0.45], wide: true }, { q: 'Which is 4 tenths and 2 hundredths?', pick: { opts: ['4.2', '0.42', '0.042'], ans: 1, val: 0.42 } }, DK(6, 9, 9)]
      },
      think: {
        items: [{ q: 'Draw disks for 1.3 in two different ways.', draw: { h: 90, key: '1 one and 3 tenths, or 13 tenths, or 1 one, 2 tenths and 10 hundredths.' } },
          { q: '{b} says 10 tenths make 1 hundredth. What would you tell {b}?', lines: { n: 3, key: '10 tenths make 1 one. Each place is 10 times the place to its right.' } },
          { q: 'How many hundredths are in 2 ones?', eq: ['2 = [] hundredths'], a: [200] },
          { q: 'Which is more?', pick: { opts: ['12 tenths', '98 hundredths'], ans: 0, big: true }, wide: true }]
      }
    },

    line: {
      watch: 'counting the ticks instead of the jumps, or reading hundredths as tenths. Find what one jump is worth first.',
      goal: 'I can place and read decimals on a number line.',
      learn: {
        show: { pic: ['dline', { min: 0, max: 1, d: 10, show: 'dec', pt: 0.7 }], cap: '7 jumps of one tenth', eq: ['0.7'] },
        together: [LN(0, 1, 10, 0.4), LN(2, 3, 10, 2.6)],
        cue: 'Find what one jump is worth. Then count the jumps from a whole number.',
        own: [LN(0, 1, 10, 0.9), LN(1, 2, 10, 1.3), LA(0, 1, 10, [0.2, 0.5, 0.8])]
      },
      p1: {
        show: { pic: ['dline', { min: 0, max: 1, d: 10, show: 'dec', pt: 0.3 }], cap: '3 jumps of one tenth', eq: ['0.3'] },
        items: [LN(0, 1, 10, 0.6), LN(0, 1, 10, 0.1), LN(3, 4, 10, 3.5), LN(5, 6, 10, 5.8), LA(0, 1, 10, [0.3, 0.6, 0.7])]
      },
      p2: {
        items: [LN(0.2, 0.3, 100, 0.24), LN(0.6, 0.7, 100, 0.67), LN(1, 2, 10, 1.9), LN(4, 5, 10, 4.2), LA(0.5, 0.6, 100, [0.52, 0.55, 0.59])]
      },
      p3: {
        items: [LN(0.9, 1, 100, 0.93), LN(2.3, 2.4, 100, 2.38), LN(7, 8, 10, 7.4), LN(0.4, 0.5, 100, 0.41), LA(1.2, 1.3, 100, [1.21, 1.25, 1.28])]
      },
      think: {
        items: [{ q: '{b} says this point is at 0.6. What went wrong?', pic: ['dline', { min: 0, max: 1, d: 10, show: 'ends', pt: 0.5 }], lines: { n: 2, key: 'It is 5 jumps of one tenth from 0, so it is 0.5. {b} counted 6 ticks, including 0.' } },
          { q: 'Name a decimal between 0.4 and 0.5.', lines: { n: 1, key: 'Any hundredth from 0.41 to 0.49, such as 0.45.' } },
          { q: 'Which is closer to 1?', pick: { opts: ['0.9', '0.09'], ans: 0, big: true } },
          { q: 'How many jumps of 0.01 from 0.3 to 0.4?', eq: ['0.4 − 0.3 = [] × 0.01'], a: [10] }]
      }
    },

    compare: {
      watch: 'thinking a longer decimal is bigger (0.25 > 0.5). Give both the same number of places, then compare from the left.',
      goal: 'I can compare and order decimals.',
      learn: {
        show: { cap: '0.5 is 0.50: 50 hundredths is more than 25', eq: ['0.50 > 0.25'] },
        together: [CMP('0.7', '0.65'), CMP('1.3', '1.30')],
        cue: 'Line up the decimal points. Add zeros so they have the same number of places. Compare from the left.',
        own: [CMP('0.4', '0.38'), CMP('2.09', '2.9'), CMP('0.6', '0.60'), CMP('3.15', '3.5')]
      },
      p1: {
        show: { cap: '0.8 is 8 tenths; 0.08 is 8 hundredths', eq: ['0.8 > 0.08'] },
        items: [CMP('0.3', '0.5'), CMP('0.9', '0.09'), CMP('1.4', '1.2'), CMP('0.25', '0.52'), CMP('2.0', '2'), CMP('0.7', '0.71'), CMP('5.6', '6.5'), CMP('0.45', '0.4')]
      },
      p2: {
        items: [CMP('0.35', '0.4'), CMP('1.08', '1.8'), CMP('3.50', '3.5'), CMP('0.99', '1'), CMP('4.61', '4.16'), CMP('0.1', '0.09'),
          { q: 'Least to greatest: 0.6, 0.06, 0.66', eq: ['[] < [] < []'], a: [0.06, 0.6, 0.66], set: ['0.6', '0.06', '0.66'], wide: true }]
      },
      p3: {
        items: [CMP('2.7', '2.68'), CMP('0.05', '0.5'), CMP('9.9', '10'), CMP('1.01', '1.1'),
          { q: 'Least to greatest: 1.2, 1.02, 1.22, 0.12', eq: ['[] < [] < [] < []'], a: [0.12, 1.02, 1.2, 1.22], set: ['1.2', '1.02', '1.22', '0.12'], wide: true },
          { q: 'Race times in seconds: 12.4, 12.04, 12.41. Fastest (least) first:', eq: ['[] < [] < []'], a: [12.04, 12.4, 12.41], set: ['12.4', '12.04', '12.41'], wide: true }]
      },
      think: {
        items: [{ q: '{b} says 0.25 > 0.5 because 25 > 5. Explain the mistake.', lines: { n: 3, key: '0.5 is 50 hundredths. 50 hundredths is more than 25 hundredths, so 0.5 > 0.25.' } },
          { q: 'Write a decimal between 0.3 and 0.4.', lines: { n: 1, key: 'Any decimal from 0.31 to 0.39, such as 0.35.' } },
          { q: 'Does adding a zero at the end change a decimal? Explain with 0.7 and 0.70.', lines: { n: 3, key: 'No. 7 tenths is the same as 70 hundredths.' } },
          { q: 'Circle the greatest.', pick: { opts: ['0.8', '0.79', '0.087'], ans: 0, big: true }, wide: true }]
      }
    },

    tenth: {
      watch: 'looking at the tenths digit instead of the hundredths digit. The digit just right of the tenths place decides.',
      goal: 'I can round a decimal to the nearest tenth.',
      learn: {
        show: { pic: ['dline', { min: 3.4, max: 3.5, d: 100, show: 'ends', pt: 3.46 }], cap: '3.46 is past halfway (3.45)', eq: ['3.46 → 3.5'] },
        together: [RD(2.71, 0.1), RD(5.35, 0.1)],
        cue: 'Look at the hundredths digit. 5 or more: round up. Less than 5: round down.',
        own: [RD(0.84, 0.1), RD(6.12, 0.1), RD(1.96, 0.1), RD(4.6, 1)]
      },
      p1: {
        show: { cap: '0.62: the hundredths digit is 2', eq: ['0.62 → 0.6'] },
        items: [RD(0.43, 0.1), RD(0.58, 0.1), RD(1.21, 0.1), RD(3.77, 0.1), RD(2.4, 1), RD(7.5, 1)]
      },
      p2: {
        items: [RD(4.05, 0.1), RD(8.34, 0.1), RD(0.95, 0.1), RD(12.66, 0.1), RD(9.49, 1), RD(3.51, 1)]
      },
      p3: {
        items: [RD(9.96, 0.1), RD(0.04, 0.1), RD(15.55, 0.1), RD(19.5, 1), RD(6.98, 0.1), RD(29.71, 1)]
      },
      think: {
        items: [{ q: '{b} rounded 3.46 to the nearest tenth and got 3.4. What went wrong?', lines: { n: 3, key: 'The hundredths digit is 6, which is 5 or more, so 3.46 rounds up to 3.5.' } },
          { q: 'Write a decimal with hundredths that rounds to 2.0.', lines: { n: 1, key: 'Any decimal from 1.95 to 2.04, such as 1.98.' } },
          { q: 'A jump is 3.47 m. Why might a coach say "about 3.5 m"?', lines: { n: 3, key: 'Rounded numbers are easier to remember and compare.' } },
          { q: 'Which rounds to 0.3?', pick: { opts: ['0.24', '0.34', '0.36'], ans: 1, round: { to: 0.1, val: 0.3 } }, wide: true }]
      }
    },

    fdp: {
      watch: 'writing 3/4 as 0.34, or 0.5 as 5%. Make the bottom 10 or 100 first; percent means out of 100.',
      goal: 'I can write tenths and hundredths as fractions, decimals and percents.',
      learn: {
        show: { pic: ['grid', { n: 25 }], cap: '25 out of 100', eq: ['1/4 = 25/100 = 0.25', '= 25%'] },
        together: [FD(3, 10), { eq: ['3/4 = [] / 100', '3/4 = []'], a: [75, 0.75] }],
        cue: 'Make the bottom 10 or 100. Out of 100 is the percent.',
        own: [FD(45, 100), FD(7, 10), { eq: ['1/2 = [] / 100', '1/2 = [] %'], a: [50, 50] }, { eq: ['0.09 = [] / 100', '0.09 = [] %'], a: [9, 9] }]
      },
      p1: {
        show: { pic: ['grid', { n: 30 }], cap: '3 tenths', eq: ['3/10 = 0.3 = 30%'] },
        items: [FD(1, 10), FD(9, 10), FD(25, 100), FD(60, 100), FD(4, 100), FD(83, 100)]
      },
      p2: {
        items: [{ eq: ['1/5 = [] / 10', '1/5 = []'], a: [2, 0.2] }, { eq: ['2/5 = [] / 100', '2/5 = [] %'], a: [40, 40] },
          { eq: ['0.35 = [] / 100', '0.35 = [] %'], a: [35, 35] }, { eq: ['70% = [] / 100', '70% = []'], a: [70, 0.7] },
          GR(15), { q: 'Which is the same as 0.4?', pick: { opts: ['4%', '40%', '0.04'], ans: 1, val: 0.4 } }]
      },
      p3: {
        items: [{ eq: ['3/20 = [] / 100', '3/20 = []'], a: [15, 0.15] }, { eq: ['1/25 = [] / 100', '1/25 = [] %'], a: [4, 4] },
          { eq: ['4/5 = [] %'], a: [80] }, { eq: ['0.06 = [] %'], a: [6] },
          { q: '{a} got 18 out of 20 questions right.', eq: ['18/20 = [] / 100 = [] %'], a: [90, 90], wide: true },
          { q: 'Circle the greatest.', pick: { opts: ['3/5', '0.58', '61%'], ans: 2, big: true } }]
      },
      think: {
        items: [{ q: '{b} wrote 3/4 = 0.34. What went wrong?', lines: { n: 3, key: '{b} wrote the digits. 3/4 = 75/100 = 0.75.' } },
          { q: 'Show 0.4 and 40% on the same grid. Why are they the same?', pic: ['grid', { n: 0, unit: '0.01', ask: 40 }], lines: { n: 2, key: 'Both are 40 out of 100 squares.' } },
          { q: 'A store says "50% off". What fraction is that?', eq: ['50% = [] / 100 = 1/2'], a: [50], wide: true },
          { q: 'Which is not the same as the others?', pick: { opts: ['1/10', '0.1', '1%'], ans: 2, diff: true }, wide: true }]
      }
    },

    'line-up': {
      watch: 'lining up the last digits instead of the decimal points (3.4 + 2.15 = 2.49). Tenths go under tenths.',
      goal: 'I can add and subtract decimals by lining up the decimal points.',
      learn: {
        show: { cap: 'line up the points; 3.4 is 3.40', eq: ['3.40 + 2.15', '= 5.55'] },
        together: [AD(2.3, '+', 1.45), AD(5.6, '−', 2.25)],
        cue: 'Estimate first. Line up the decimal points and fill gaps with zeros.',
        own: [AD(4.5, '+', 3.25), AD(6.08, '+', 1.9), AD(7.5, '−', 3.2), AD(9, '−', 4.35)]
      },
      p1: {
        show: { cap: '1.2 + 0.7: tenths with tenths', eq: ['1.2 + 0.7 = 1.9'] },
        items: [AD(0.4, '+', 0.3), AD(1.6, '+', 2.2), AD(3.8, '−', 1.5), AD(0.25, '+', 0.5), AD(4.75, '−', 2.5), AD(2.1, '+', 3.45)]
      },
      p2: {
        items: [AD(12.4, '+', 3.75), AD(8.05, '−', 2.6), AD(15, '−', 6.25), AD(0.89, '+', 0.11),
          story('{a} walks 2.4 km and then 1.85 km. How far in all?', 'km', 4.25, '2.4 + 1.85'),
          story('A board is 3.5 m long. {b} cuts off 1.25 m. How much is left?', 'm', 2.25, '3.5 − 1.25')]
      },
      p3: {
        items: [AD(25.6, '+', 14.75), AD(40, '−', 12.36), AD(9.99, '+', 0.01), AD(100, '−', 0.25),
          story('{a} has $20.00 and spends $13.45. How much is left?', 'dollars', 6.55, '20.00 − 13.45'),
          story('Rain fell 12.5 mm on Monday and 7.75 mm on Tuesday. How much more on Monday?', 'mm', 4.75, '12.5 − 7.75')]
      },
      think: {
        items: [{ q: '{b} wrote 3.4 + 2.15 = 2.49. What went wrong?', lines: { n: 3, key: '{b} lined up the last digits. Line up the points: 3.40 + 2.15 = 5.55.' } },
          { q: 'Estimate 6.9 + 3.2. Then find the answer.', eq: ['6.9 + 3.2 = []'], a: [10.1], lines: { n: 1, key: 'About 7 + 3 = 10.' } },
          { q: 'Find two decimals that add to 1.', lines: { n: 2, key: 'For example: 0.35 + 0.65, or 0.9 + 0.1.' } },
          { q: 'Find the missing number.', eq: ['4.75 + [] = 10'], a: [5.25], wide: true }]
      }
    },

    'tenth-of': {
      watch: 'moving the decimal point the wrong way (× 0.1 making a number bigger). One tenth of a number is smaller than the number.',
      goal: 'I can multiply by 0.1 and 0.01.',
      learn: {
        show: { pic: ['pvmove', { n: 45, shift: 1, dir: 'd' }], cap: 'a tenth of 45: each digit moves one place right', eq: ['45 × 0.1 = 4.5'] },
        together: [TO(30, 0.1), TO(200, 0.01)],
        cue: '× 0.1 is ÷ 10. × 0.01 is ÷ 100. The digits move right.',
        own: [TO(72, 0.1), TO(5, 0.1), TO(350, 0.01), TO(8, 0.01)]
      },
      p1: {
        show: { pic: ['pvmove', { n: 60, shift: 1, dir: 'd' }], cap: 'a tenth of 60', eq: ['60 × 0.1 = 6'] },
        items: [TO(40, 0.1), TO(90, 0.1), TO(100, 0.01), TO(25, 0.1), TO(500, 0.01), TO(7, 0.1)]
      },
      p2: {
        items: [TO(135, 0.1), TO(46, 0.01), TO(3, 0.01), TO(260, 0.1),
          story('A $40 game is 10% off. What is 0.1 of $40?', 'dollars', 4, '40 × 0.1'),
          story('{a} saves 0.01 of $900. How much is that?', 'dollars', 9, '900 × 0.01')]
      },
      p3: {
        items: [TO(1250, 0.1), TO(1250, 0.01), TO(9, 0.1), TO(64, 0.01),
          { eq: ['[] × 0.1 = 7.2'], a: [72] }, { eq: ['[] × 0.01 = 0.35'], a: [35] }]
      },
      think: {
        items: [{ q: '{b} says 50 × 0.1 = 500. What went wrong?', lines: { n: 3, key: '× 0.1 takes one tenth, so the number gets smaller: 50 × 0.1 = 5.' } },
          { q: 'Why is × 0.01 the same as ÷ 100?', lines: { n: 3, key: '0.01 is one hundredth, so × 0.01 finds one hundredth of the number, which is ÷ 100.' } },
          { q: 'Which is more?', pick: { opts: ['80 × 0.1', '80 × 0.01'], ans: 0, big: true } },
          { q: 'Find the missing number.', eq: ['[] × 0.1 = 0.6'], a: [6] }]
      }
    }
  } });
})();
