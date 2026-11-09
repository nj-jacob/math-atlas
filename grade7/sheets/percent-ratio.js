/* Grade 7 Percent and Ratio: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/percent-ratio.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.7 fractions, decimals and percents used interchangeably, including percents over 100% and under 1%;
   B2.2 the equivalents to know; B2.3 mental strategies for percents; B2.10 ratios, rates and proportional situations.
   The answer checks are in tests/verify/sheets.js: sums are worked out again, a hundred grid shows its own count, a
   ratio table keeps the same amount for every 1, and "proportional" is decided from the table or the start amount. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* how much of a hundred grid is shaded, as a percent */
  function HG(n) { return { pic: ['grid', { n: n, unit: 1, quiet: true, u: 8 }], eq: ['[] %'], a: [n] }; }
  /* a fraction, decimal or percent written another way */
  function FP(f, p) { return { eq: [f + ' = [] %'], a: [p] }; }
  function PD(p, d) { return { eq: [p + '% = []'], a: [d] }; }
  function FD(f, d, p) { return { eq: [f + ' = [] = [] %'], a: [d, p], wide: true }; }
  /* a percent of an amount, written as a multiplication */
  function PC(n, p) { return { eq: [n + ' × ' + p + '% = []'], a: [n * p / 100] }; }
  /* build a percent from 10%: the 10% part, then the rest */
  function TEN(n, k, half) {
    var t = n / 10, rows = [n + ' × 10% = []'], a = [t], parts = [t];
    if (k > 1) { rows.push(k + ' × [] = []'); a.push(t, k * t); parts = [k * t]; }
    if (half) { rows.push('[] ÷ 2 = []'); a.push(t, t / 2); parts.push(t / 2); }
    if (parts.length > 1) { rows.push('[] + [] = []'); a.push(parts[0], parts[1], parts[0] + parts[1]); }
    return { q: 'Find ' + (k * 10 + (half ? 5 : 0)) + '% of ' + n + '.', eq: rows, a: a };
  }
  /* increase or decrease: the part, then add it or take it away */
  function CH(n, p, up) { return { q: (up ? 'Increase ' : 'Decrease ') + n + ' by ' + p + '%.', eq: [n + ' × ' + p + '% = []', n + (up ? ' + ' : ' − ') + '[] = []'], a: [n * p / 100, n * p / 100, up ? n + n * p / 100 : n - n * p / 100] }; }
  /* an equivalent ratio: multiply or divide both parts by m; at: the first part is the blank */
  function EQ(a, b, m, at) { var c = a * m, d = b * m; return at ? { eq: [a + ' : ' + b + ' = [] : ' + d], a: [c] } : { eq: [a + ' : ' + b + ' = ' + c + ' : []'], a: [d] }; }
  /* a ratio table: blanks keep the same amount for every 1 */
  function TB(head, rows) {
    var full = rows.filter(function (r) { return r[0] !== '[]' && r[1] !== '[]'; })[0], k = full[1] / full[0], a = [];
    rows.forEach(function (r) { if (r[0] === '[]') a.push(r[1] / k); if (r[1] === '[]') a.push(r[0] * k); });
    return { pic: ['table', { head: head, rows: rows }], a: a };
  }
  /* a unit rate: amount ÷ number of units */
  function RT(t, n, unit, wide) { var m = unit.charAt(0) === '$'; return { eq: [t + ' ÷ ' + n + ' = ' + (m ? '$ [] ' + unit.slice(2) : '[] ' + unit)], a: [Math.round(t / n * 1e6) / 1e6], wide: !!wide }; }
  /* proportional or not, from a table of pairs */
  function PT(head, rows) { var k = rows[0][1] / rows[0][0], yes = rows.every(function (r) { return r[1] / r[0] === k; }); return { q: 'Proportional?', pic: ['table', { head: head, rows: rows, pairs: true }], pick: { opts: ['proportional', 'not proportional'], ans: yes ? 0 : 1, prop: rows } }; }
  /* proportional or not, from a cost with a start fee b */
  function PB(q, b) { return { q: q, pick: { opts: ['proportional', 'not proportional'], ans: b ? 1 : 0, prop: { b: b } } }; }
  function story(q, unit, ans, calc, more) { var it = { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; return more ? Object.assign(it, more) : it; }

  S.register('percent-ratio', { code: 'PR', ideas: {

    hundred: {
      watch: 'writing 0.2 as 2%. 0.2 is 2 tenths, which is 20 hundredths: 20%.',
      goal: 'I can show a percent as a fraction and a decimal.',
      learn: {
        show: { pic: ['grid', { n: 35, unit: 1, quiet: true, u: 8 }], cap: '35 squares of 100', eq: ['35/100 = 0.35 = 35%'] },
        together: [HG(62), HG(8)],
        cue: 'Count the shaded squares out of 100.',
        own: [HG(40), HG(3)]
      },
      p1: {
        show: { eq: ['27/100 = 0.27 = 27%'] },
        items: [FP('49/100', 49), FP('0.81', 81), FP('6/100', 6), FP('0.6', 60), PD(14, 0.14), PD(90, 0.9), HG(55), HG(19)]
      },
      p2: {
        items: [FD('7/100', 0.07, 7), FD('30/100', 0.3, 30), FD('125/100', 1.25, 125), FD('99/100', 0.99, 99),
          { q: 'Which is equal to 0.2?', pick: { opts: ['2%', '20%', '1/20'], ans: 1, val: 0.2 } },
          { q: 'Which is equal to 5%?', pick: { opts: ['0.5', '0.05', '5/10'], ans: 1, val: 0.05 } }]
      },
      p3: {
        items: [FP('1.5', 150), FP('2', 200), FP('0.004', 0.4), FP('0.009', 0.9), PD(0.5, 0.005), PD(250, 2.5),
          story('{a} got 43 out of 50 shots in. What percent is that?', '', '86%', '43 / 50')]
      },
      think: {
        items: [{ q: '{b} says 0.7 = 7%. What went wrong?', lines: { n: 3, key: '0.7 is 7 tenths, which is 70 hundredths: 70%.' } },
          { q: 'What does 100% of a grid look like? What would 150% look like?', lines: { n: 3, key: '100% is the whole grid shaded. 150% is one whole grid and half of a second grid.' } },
          HG(91),
          { q: 'Which is greatest?', pick: { opts: ['0.45', '4%', '40/100'], ans: 0, big: true } }]
      }
    },

    facts: {
      watch: 'thinking 1/3 = 30% or 1/5 = 5%. Link each one to the hundred grid.',
      goal: 'I know the common fraction, decimal and percent equivalents.',
      learn: {
        show: { pic: ['grid', { n: 25, unit: 1, quiet: true }], cap: 'one quarter', eq: ['1/4 = 0.25 = 25%'] },
        together: [FD('1/2', 0.5, 50), FD('1/5', 0.2, 20)],
        cue: 'Build from 1/2, 1/4, 1/5 and 1/10.',
        own: [FD('3/4', 0.75, 75), FD('1/10', 0.1, 10), FD('2/5', 0.4, 40)]
      },
      p1: {
        show: { cap: '1/5 = 20%', eq: ['3/5 = 3 × 20% = 60%'] },
        items: [FP('1/2', 50), FP('1/4', 25), FP('3/10', 30), FP('4/5', 80), FP('1/20', 5), FP('7/10', 70), FP('3/5', 60), FP('9/10', 90)]
      },
      p2: {
        items: [PD(25, 0.25), PD(75, 0.75), PD(20, 0.2), PD(5, 0.05), FD('1/20', 0.05, 5), FD('3/20', 0.15, 15),
          { q: 'Which is equal to 1/5?', pick: { opts: ['5%', '20%', '0.5'], ans: 1, val: 0.2 } }]
      },
      p3: {
        items: [FD('1/8', 0.125, 12.5), FP('6/5', 120), FP('5/4', 125), FP('1/50', 2), FP('1/25', 4),
          { q: 'Which is not equal to the others?', pick: { opts: ['3/5', '0.6', '60%', '0.06'], ans: 3, diff: true }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says 1/3 = 30%. Is that right? Explain.', lines: { n: 3, key: 'No. 30% is 3/10. 1/3 is about 33.3%, a little more.' } },
          { q: 'How can you use 1/4 = 25% to find 3/4 as a percent?', lines: { n: 2, key: '3/4 is three quarters: 3 × 25% = 75%.' } },
          FD('7/20', 0.35, 35), FD('11/10', 1.1, 110)]
      }
    },

    divide: {
      watch: 'dividing the bottom by the top (8 ÷ 3). The fraction bar reads "top divided by bottom".',
      goal: 'I can change any fraction to a decimal and a percent.',
      learn: {
        show: { cap: 'top ÷ bottom, then × 100', eq: ['3/8 = 3 ÷ 8 = 0.375', '0.375 × 100 = 37.5%'] },
        together: [{ eq: ['5/8 = 5 ÷ 8 = []', '[] = [] %'], a: [0.625, 0.625, 62.5] }, { eq: ['7/20 = 7 ÷ 20 = []', '[] = [] %'], a: [0.35, 0.35, 35] }],
        cue: 'Top divided by bottom.',
        own: [{ eq: ['1/8 = 1 ÷ 8 = []', '[] = [] %'], a: [0.125, 0.125, 12.5] }, { eq: ['9/40 = 9 ÷ 40 = []', '[] = [] %'], a: [0.225, 0.225, 22.5] },
          { eq: ['3/16 = 3 ÷ 16 = []', '[] = [] %'], a: [0.1875, 0.1875, 18.75] }]
      },
      p1: {
        show: { eq: ['7/8 = 7 ÷ 8 = 0.875 = 87.5%'] },
        items: [FD('3/8', 0.375, 37.5), FD('7/8', 0.875, 87.5), FD('11/20', 0.55, 55), FD('9/25', 0.36, 36), FD('17/50', 0.34, 34), FD('3/40', 0.075, 7.5)]
      },
      p2: {
        items: [FD('13/20', 0.65, 65), FD('21/25', 0.84, 84), FD('5/16', 0.3125, 31.25), FD('1/200', 0.005, 0.5), FD('9/8', 1.125, 112.5), FD('7/4', 1.75, 175)]
      },
      p3: {
        items: [story('{a} got 17 out of 20 on a quiz. What percent is that?', '', '85%', '17 / 20'),
          story('A team won 21 of its 28 games. What percent did it win?', '', '75%', '21 / 28'),
          story('{b} has read 45 of the 120 pages of a book. What percent is that?', '', '37.5%', '45 / 120'),
          { q: 'Which is greater?', pick: { opts: ['5/8', '0.6'], ans: 0, big: true } },
          { q: 'Which is least?', pick: { opts: ['3/8', '0.4', '35%'], ans: 2, small: true } }]
      },
      think: {
        items: [{ q: '{b} wrote 3/8 = 8 ÷ 3 = 2.67. What went wrong?', lines: { n: 3, key: 'The fraction bar means top ÷ bottom: 3 ÷ 8 = 0.375 = 37.5%.' } },
          { q: 'When is a fraction more than 100%?', lines: { n: 2, key: 'When the top is bigger than the bottom, it is more than one whole.' } },
          FD('11/8', 1.375, 137.5), FD('1/16', 0.0625, 6.25)]
      }
    },

    point: {
      watch: 'writing 5% as 0.5, or moving the point the wrong way. Ask: is 5% less than half? Then the decimal must be less than 0.5.',
      goal: 'I can move the point two places to change a decimal to a percent.',
      learn: {
        show: { cap: 'decimal to percent: 2 places right', eq: ['0.375 = 37.5%', '8% = 0.08'] },
        together: [FP('0.4', 40), PD(3, 0.03)],
        cue: 'Percent to decimal: 2 places left.',
        own: [FP('0.065', 6.5), PD(45, 0.45), PD(7, 0.07)]
      },
      p1: {
        show: { eq: ['0.4 = 40%', '0.04 = 4%'] },
        items: [FP('0.52', 52), FP('0.9', 90), FP('0.03', 3), FP('0.125', 12.5), PD(64, 0.64), PD(9, 0.09), PD(30, 0.3), PD(12.5, 0.125)]
      },
      p2: {
        items: [FP('1.4', 140), FP('3', 300), FP('0.008', 0.8), FP('0.0025', 0.25), PD(175, 1.75), PD(0.6, 0.006), PD(400, 4), PD(0.25, 0.0025)]
      },
      p3: {
        items: [{ q: 'Which decimal equals 8%?', pick: { opts: ['0.8', '0.08', '8.0'], ans: 1, val: 0.08 } },
          { q: 'Which percent equals 0.005?', pick: { opts: ['5%', '0.5%', '50%'], ans: 1, val: 0.005 } },
          Object.assign(PD(2.5, 0.025), { q: 'A bank pays 2.5% interest. As a decimal:' }),
          story('A town grew to 1.3 times its size. Write 1.3 as a percent.', '', '130%', '1.3'),
          { q: 'Least to greatest: 0.6, 6%, 0.06%', eq: ['[] < [] < []'], a: ['0.06%', '6%', '0.6'], set: ['0.6', '6%', '0.06%'], wide: true }]
      },
      think: {
        items: [{ q: '{a} wrote 5% = 0.5. How can {a} check?', lines: { n: 3, key: '0.5 is half, which is 50%. 5% is much less than half: 0.05.' } },
          { q: 'Why does 4 written as a percent become 400%?', lines: { n: 2, key: '4 wholes is 4 × 100% = 400%.' } },
          FP('0.0075', 0.75), PD(225, 2.25)]
      }
    },

    mental: {
      watch: 'dividing by the percent: 15% of 240 as 240 ÷ 15. Only 10% means divide by 10 (and 50% means divide by 2).',
      goal: 'I can find percents of amounts in my head, starting from 10%.',
      learn: {
        show: { cap: '10%, then half of it for 5%', eq: ['10% of 240 = 24', '5% of 240 = 12', '15% of 240 = 36'] },
        together: [TEN(80, 2, false), TEN(60, 1, true)],
        cue: 'Find 10% first.',
        own: [TEN(120, 1, true), TEN(300, 3, false)]
      },
      p1: {
        show: { eq: ['10% of 70 = 7', '30% of 70 = 3 × 7 = 21'] },
        items: [PC(90, 10), PC(350, 10), PC(48, 50), PC(160, 25), PC(80, 5), PC(240, 20), PC(70, 30), PC(400, 1)]
      },
      p2: {
        items: [PC(240, 15), PC(60, 35), PC(120, 75), PC(500, 12), PC(40, 45), PC(90, 110), PC(200, 0.5), PC(36, 150)]
      },
      p3: {
        items: [story('A $45 meal has a 15% tip. How much is the tip?', 'dollars', 6.75, '45 × 15%'),
          story('Ontario tax is 13%. How much tax is on a $20 book?', 'dollars', 2.6, '20 × 13%'),
          story('{a} saves 20% of $85 earned shovelling snow. How much is saved?', 'dollars', 17, '85 × 20%'),
          story('A school of 600 students: 35% walk to school. How many walk?', 'students', 210, '600 × 35%')]
      },
      think: {
        items: [{ q: '{b} found 15% of 240 by doing 240 ÷ 15. What went wrong?', lines: { n: 3, key: 'Only 10% means ÷ 10. 10% is 24, 5% is 12, so 15% is 36.' } },
          { q: 'Show two ways to find 25% of 64.', lines: { n: 3, key: '64 ÷ 4 = 16. Or 50% is 32, and half of that is 16.' } },
          TEN(260, 1, true)]
      }
    },

    incdec: {
      watch: 'stopping at the part: answering $20 when asked for the sale price of an $80 jacket at 25% off. Ask: is that what you pay, or what you save?',
      goal: 'I can increase or decrease an amount by a percent.',
      learn: {
        show: { cap: '$80 jacket, 25% off', eq: ['80 × 25% = 20', '80 − 20 = $60'] },
        together: [CH(120, 15, false), CH(50, 20, true)],
        cue: 'Find the part. Add it or take it away.',
        own: [CH(60, 10, true), CH(200, 30, false), CH(40, 25, false)]
      },
      p1: {
        show: { cap: 'increase 60 by 10%', eq: ['60 × 10% = 6', '60 + 6 = 66'] },
        items: [CH(90, 10, true), CH(70, 50, false), CH(300, 20, false), CH(150, 40, true), CH(48, 25, true), CH(400, 5, false)]
      },
      p2: {
        items: [story('An $80 jacket is 25% off. What is the sale price?', 'dollars', 60, '80 − 80 × 25%'),
          story('A $45 game is 10% off. What is the sale price?', 'dollars', 40.5, '45 − 45 × 10%'),
          story('A $30 shirt has 13% tax added. What is the total?', 'dollars', 33.9, '30 + 30 × 13%'),
          story('A town of 8 000 people grows by 5%. How many people now?', 'people', 8400, '8000 + 8000 × 5%'),
          CH(250, 12, true), CH(160, 75, false)]
      },
      p3: {
        items: [story('Shoes cost $120. They are 15% off, then 13% tax is added. What is the total?', 'dollars', 115.26, '(120 − 120 × 15%) + (120 − 120 × 15%) × 13%', { wide: true }),
          story('A $64 coat is 25% off. What is the sale price?', 'dollars', 48, '64 − 64 × 25%'),
          story('{a} had 40 {many}. The number went up by 150%. How many now?', '{many}', 100, '40 + 40 × 150%'),
          story('A $200 bike is 35% off. How much do you save?', 'dollars', 70, '200 × 35%')]
      },
      think: {
        items: [{ q: '{b} says a 25% discount on $80 means you pay $20. What went wrong?', lines: { n: 3, key: '$20 is what you save. You pay 80 − 20 = $60.' } },
          { q: 'Why is 25% off the same as paying 75%?', lines: { n: 2, key: '100% − 25% = 75%: you pay the part that is left.' } },
          { q: 'What happens when you increase a number by 100%?', lines: { n: 2, key: 'It doubles: you add all of it again.' } }]
      }
    },

    ratio: {
      watch: 'adding the same amount to both parts: 2 : 3 becomes 6 : 7. Multiply both parts, do not add.',
      goal: 'I can find equivalent ratios.',
      learn: {
        show: { pic: ['table', { head: ['cups of juice', 'cups of water'], rows: [[2, 3], [4, 6], [6, 9]] }], cap: 'times 2, times 3', eq: ['2 : 3 = 4 : 6 = 6 : 9'] },
        together: [EQ(3, 5, 4), TB(['cans of blue', 'cans of white'], [[3, 5], [6, '[]'], [12, '[]']])],
        cue: 'Multiply both parts by the same number.',
        own: [EQ(2, 7, 3), EQ(4, 9, 5, true), EQ(5, 8, 4)]
      },
      p1: {
        show: { eq: ['5 : 2 = 15 : 6 (both × 3)'] },
        items: [EQ(1, 4, 6), EQ(5, 3, 4), EQ(7, 2, 3, true), EQ(6, 5, 10), EQ(12, 16, 0.25), EQ(18, 24, 1 / 6), EQ(9, 4, 5, true), { eq: ['20 : 30 = [] : 3'], a: [2] }]
      },
      p2: {
        items: [TB(['scoops', 'cups of water'], [[2, 5], [4, '[]'], [10, '[]']]), TB(['L of syrup', 'L of sap'], [[1, 40], [3, '[]'], [5, '[]']]),
          TB(['laps', 'minutes'], [[3, 12], [1, '[]'], [5, '[]']]), TB(['boys', 'girls'], [[4, 5], [8, '[]'], [20, '[]']])]
      },
      p3: {
        items: [story('A recipe uses 2 cups of flour for every 3 eggs. How much flour for 12 eggs?', 'cups', 8, '2 × 12 / 3'),
          story('A paint mix uses 3 cans of blue for every 5 of white. How much white for 12 cans of blue?', 'cans', 20, '5 × 12 / 3', { wide: true }),
          { q: 'Which ratio is equivalent to 2 : 3?', pick: { opts: ['6 : 7', '8 : 12', '3 : 2'], ans: 1, ratio: [2, 3] } },
          { q: 'Which ratio is not equivalent to 4 : 10?', pick: { opts: ['2 : 5', '8 : 20', '6 : 12'], ans: 2, ratio: [4, 10], not: true } }]
      },
      think: {
        items: [{ q: '{b} says 2 : 3 = 6 : 7 because 4 was added to each. What went wrong?', lines: { n: 3, key: 'Equivalent ratios multiply both parts. 2 : 3 = 6 : 9.' } },
          { q: 'Write three ratios equivalent to 5 : 8.', lines: { n: 1, key: 'For example 10 : 16, 15 : 24, 50 : 80.' } },
          EQ(7, 11, 6)]
      }
    },

    unit: {
      watch: 'choosing the cheaper package without looking at size. Compare the price for the same amount.',
      goal: 'I can find a unit rate and the better buy.',
      learn: {
        show: { cap: '$3.60 for 2 L', eq: ['3.60 ÷ 2 = $1.80 per litre'] },
        together: [RT(240, 3, 'km per hour'), RT('5.10', 3, '$ per L')],
        cue: 'Divide by the number of units.',
        own: [RT(150, 2, 'km per hour'), RT('4.50', 5, '$ per kg'), RT(96, 8, 'pages per day', true)]
      },
      p1: {
        show: { eq: ['$7.50 for 3 kg', '7.50 ÷ 3 = $2.50 per kg'] },
        items: [RT(360, 4, 'km per hour'), RT('12.60', 3, '$ per kg'), RT(84, 6, 'L per minute'), RT(7.98, 6, '$ per L'),
          RT(5.56, 4, '$ per L'), RT(132, 12, 'beats per second', true)]
      },
      p2: {
        items: [story('A car goes 240 km in 3 h. What is its speed?', 'km per hour', 80, '240 ÷ 3'),
          story('A 12-pack of juice costs $8.40. How much for 1?', 'dollars', 0.7, '8.40 ÷ 12'),
          story('{a} types 315 words in 7 minutes. How many words per minute?', 'words', 45, '315 ÷ 7'),
          story('A 750 g box of cereal costs $6. What is the price per 100 g?', 'dollars', 0.8, '6 ÷ 7.5', { calc: '6 ÷ (750 ÷ 100)' }),
          RT(1250, 5, 'm per minute', true), RT(2.85, 3, '$ per bag', true)]
      },
      p3: {
        items: [{ q: 'Better buy: juice A is 2 L for $3.60, juice B is 3 L for $5.10.', pick: { opts: ['A', 'B'], ans: 1, less: ['3.60 / 2', '5.10 / 3'] }, wide: true },
          { q: 'Better buy: 6 L of milk for $7.98, or 4 L for $5.56?', pick: { opts: ['6 L', '4 L'], ans: 0, less: ['7.98 / 6', '5.56 / 4'] }, wide: true },
          { q: 'Who is faster: {a}, 42 km in 3 h, or {b}, 52 km in 4 h?', pick: { opts: ['{a}', '{b}'], ans: 0, more: ['42 / 3', '52 / 4'] }, wide: true },
          story('Gas costs $1.60 per litre. How much for 45 L?', 'dollars', 72, '1.60 × 45')]
      },
      think: {
        items: [{ q: '{b} says the smaller box is the better buy because it costs less. What would you tell {b}?', lines: { n: 3, key: 'Compare the price for the same amount, such as per 100 g. The bigger box may cost less for each gram.' } },
          { q: 'Why is a unit rate useful when you shop?', lines: { n: 2, key: 'It compares packages of different sizes fairly.' } },
          { q: 'Better buy: 500 g for $4.50 or 750 g for $6.00?', pick: { opts: ['500 g', '750 g'], ans: 1, less: ['4.50 / 500', '6.00 / 750'] }, wide: true }]
      }
    },

    isprop: {
      watch: 'thinking any straight line is proportional. It must also start at 0: nothing costs nothing.',
      goal: 'I can tell if two amounts are proportional.',
      learn: {
        show: { cap: '5 km for $10, 10 km for $20', eq: ['cost ÷ km = 2 every time'] },
        together: [PT(['visits', 'cost ($)'], [[1, 5], [2, 10], [4, 20]]), PT(['visits', 'cost ($)'], [[1, 22], [2, 24], [4, 28]])],
        cue: 'Divide each pair. Is it the same every time?',
        own: [PB('Pens at $2 each.', 0), PB('A taxi: $5 to start, then $2 per km.', 5)]
      },
      p1: {
        show: { eq: ['$3 per notebook: 0 notebooks cost $0', 'proportional'] },
        items: [PB('Notebooks at $3 each.', 0), PB('A gym: $20 to join, then $10 a month.', 20), PB('A taxi: $4 to start, then $1.50 per km.', 4),
          PB('Apples at $2.50 per kg.', 0), PB('A phone plan: $15 a month plus $0.10 a text.', 15), PB('Paint at $9 per litre.', 0)]
      },
      p2: {
        items: [PT(['h', '$ earned'], [[2, 30], [5, 75], [8, 120]]), PT(['age', 'height (cm)'], [[2, 85], [4, 100], [8, 125]]),
          PT(['cups of rice', 'cups of water'], [[1, 2], [3, 6], [5, 10]]), PT(['games', 'cost ($)'], [[1, 12], [2, 19], [3, 26]])]
      },
      p3: {
        items: [PB('A plumber charges $60 to come and $45 an hour.', 60), PB('A bike rental is $2 per km, with no fee to start.', 0),
          PT(['days', 'pages read'], [[1, 25], [2, 50], [6, 150]]), PT(['weeks', 'savings ($)'], [[1, 30], [2, 40], [3, 50]])]
      },
      think: {
        items: [{ q: '{a} says a $20 joining fee plus $5 a visit is proportional because the line is straight. What went wrong?', lines: { n: 3, key: 'A proportional line must start at 0. 0 visits still cost $20, so it is not proportional.' } },
          { q: 'How can you tell from a table that it is proportional?', lines: { n: 3, key: 'Divide each pair. If it is the same every time (and 0 goes with 0), it is proportional.' } },
          PT(['km', 'L of gas'], [[100, 8], [250, 20], [400, 32]])]
      }
    },

    solve: {
      watch: 'adding instead of scaling: 3 kg is $7.50, so 5 kg is $9.50 ("2 more"). Ask: is the price per kg the same?',
      goal: 'I can solve a proportion by finding the amount for 1.',
      learn: {
        show: { cap: '3 kg for $7.50', eq: ['1 kg: 7.50 ÷ 3 = $2.50', '5 kg: 5 × 2.50 = $12.50'] },
        together: [{ q: '6 muffins cost $9. 10 muffins?', eq: ['9 ÷ 6 = []', '10 × [] = []'], a: [1.5, 1.5, 15] },
          { q: '4 h of work earns $66. 7 h?', eq: ['66 ÷ 4 = []', '7 × [] = []'], a: [16.5, 16.5, 115.5] }],
        cue: 'Find the amount for 1. Then multiply.',
        own: [{ q: '5 L of paint cover 40 m². 8 L?', eq: ['40 ÷ 5 = []', '8 × [] = []'], a: [8, 8, 64] },
          { q: '3 tickets cost $28.50. 7 tickets?', eq: ['28.50 ÷ 3 = []', '7 × [] = []'], a: [9.5, 9.5, 66.5] }]
      },
      p1: {
        show: { eq: ['8 pens cost $12', '1 pen: $1.50', '5 pens: $7.50'] },
        items: [TB(['kg', '$'], [[4, 10], [1, '[]'], [6, '[]']]), TB(['h', 'km'], [[4, 340], [1, '[]'], [6, '[]']]),
          TB(['{conts}', '{many}'], [[6, 54], [1, '[]'], [11, '[]']]), TB(['L', 'km'], [[5, 60], [1, '[]'], [12, '[]']])]
      },
      p2: {
        items: [story('3 kg of apples cost $7.50. How much do 5 kg cost?', 'dollars', 12.5, '7.50 ÷ 3 × 5'),
          story('A car uses 8 L of gas for 100 km. How much for 350 km?', 'L', 28, '8 ÷ 100 × 350'),
          story('{a} reads 60 pages in 2 h. How many pages in 5 h?', 'pages', 150, '60 ÷ 2 × 5'),
          story('12 {many} cost $18. How much do 20 cost?', 'dollars', 30, '18 ÷ 12 × 20')]
      },
      p3: {
        items: [story('A map uses 2 cm for every 15 km. How far is 9 cm on the map?', 'km', 67.5, '15 ÷ 2 × 9'),
          story('A recipe for 4 people uses 300 g of pasta. How much for 10 people?', 'g', 750, '300 ÷ 4 × 10'),
          story('{b} earns $93 for 6 h of work. How much for 14 h?', 'dollars', 217, '93 ÷ 6 × 14'),
          story('It takes 40 L of sap for 1 L of maple syrup. How much sap for 3.5 L of syrup?', 'L', 140, '40 × 3.5')]
      },
      think: {
        items: [{ q: '{b} says: 3 kg cost $7.50, so 5 kg cost $9.50, because it is 2 more. What went wrong?', lines: { n: 3, key: 'The price per kg stays the same: $2.50. 5 kg cost 5 × 2.50 = $12.50.' } },
          { q: 'How can you check the answer to a proportion?', lines: { n: 3, key: 'Find the amount for 1 both ways. $7.50 ÷ 3 and $12.50 ÷ 5 are both $2.50.' } },
          story('15 L of water fill 6 bottles. How many litres for 22 bottles?', 'L', 55, '15 ÷ 6 × 22')]
      }
    }
  } });
})();
