/* Grade 8 Percents, Ratios and Rates: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/percent-ratio.lessons.js: Learn, Practise 1 to 3 and Think. Every question is written here, so a sheet always
   prints the same. Theme words: {a} {b} names.
   Ontario 2020: B1.4 fractions, decimals and percents, including more than 100% and less than 1%; B2.1 several steps,
   order of operations, percents; B2.8 proportions, unit rates and comparing rates (with F1.5-style better buys). The
   answer checks are in tests/verify/sheets.js: percents are worked out as hundredths ("25% of 80" is 25 / 100 × 80),
   ratios in a row must be equivalent, a table is proportional when every pair has the same ratio (prop), and the circled
   better buy has the least cost per unit (less). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var Q = S.q;
  function PC(f) { return { eq: [f + ' = [] %'], a: [+(S.calc(f) * 100).toFixed(4)] }; }
  /* a percent change: (new − old) ÷ old as a percent */
  function CHG(n, o) { var r = '(' + n + ' − ' + o + ') ÷ ' + o + ' = [] %'; return { eq: [r], a: [+((n - o) / o * 100).toFixed(4)], wide: S.tw(r, 18, 700) > 150 }; }
  function DEC(p) { return { eq: [p + '% = []'], a: [+(p / 100).toFixed(6)] }; }
  function ST(q, calc, unit, dp) { var v = S.calc(calc); return { q: q, eq: ['[]' + (unit ? ' ' + unit : '')], a: [dp != null ? +v.toFixed(dp) : v], calc: calc, dp: dp }; }
  function PR(a, b, c) { return { eq: [a + ' : ' + b + ' = ' + c + ' : []'], a: [b * c / a] }; }
  function PR2(a, b, d) { return { eq: [a + ' : ' + b + ' = [] : ' + d], a: [a * d / b] }; }
  function FR(a, b, d) { return { eq: [a + '/' + b + ' = []/' + d], a: [a * d / b] }; }
  function TB(rows) { var k = rows[0][1] / rows[0][0], yes = rows.every(function (r) { return Math.abs(r[1] / r[0] - k) < 1e-9; }); return { pic: ['tbl', { head: ['x', 'y'], rows: rows }], q: 'Is it proportional?', pick: { opts: ['yes', 'no'], ans: yes ? 0 : 1, prop: rows } }; }
  /* the better buy: names, prices and sizes; the least cost per unit */
  function BUY(names, prices, sizes, unit) {
    var per = prices.map(function (p, i) { return p + ' ÷ ' + sizes[i]; }), v = per.map(S.calc);
    return { q: names.map(function (n, i) { return n + ': $' + prices[i].toFixed(2) + ' for ' + sizes[i] + ' ' + unit; }).join('. ') + '. Which is the better buy?',
      eq: per.map(function (e) { return '$' + e.replace(/^(\d+\.\d)$/, '$10') + ' ≈ []'; }), a: v.map(function (x) { return +x.toFixed(3); }), cols: names.length,
      pick: { opts: names, ans: v.indexOf(Math.min.apply(null, v)), less: per }, pickLast: true, wide: true };
  }

  S.register('percent-ratio', { code: 'PR', ideas: {

    over: {
      watch: 'thinking a percent cannot be more than 100. 150% means 1.5 times the whole.',
      goal: 'I can write percents more than 100% as decimals and fractions.',
      learn: {
        show: { cap: '100% is one whole', eq: ['150% = 1.5'] },
        together: [DEC(200), PC('2 1/4')],
        cue: 'Divide by 100: move the point 2 places left.',
        own: [DEC(325), PC('1.8'), DEC(110), PC('3')]
      },
      p1: {
        show: { eq: ['1 3/4 = 1.75', '1 3/4 = 175%'] },
        items: [DEC(120), DEC(250), DEC(400), PC('1.3'), PC('2.05'), PC('1 1/2'), PC('5/4'), DEC(105)]
      },
      p2: {
        items: [DEC(1000), DEC(137.5), PC('3 3/5'), PC('7/2'), PC('12'), Q('150% of 60'), Q('200% of 45'), Q('125% of 80')]
      },
      p3: {
        items: [Q('350% of 20'), Q('110% of 250'), Q('175% of 64'), PC('9/8'),
          ST('This year\'s crop is 140% of last year\'s 600 kg. How much this year?', '140% of 600', 'kg'),
          ST('A house costs 250% of what it did in 2005, when it was $180 000. What does it cost now?', '250% of 180000', 'dollars'), DEC(108.5), PC('2 7/20')]
      },
      think: {
        items: [{ q: '{a} says 150% of 40 is less than 40. Explain.', lines: { n: 3, key: '150% is more than one whole, so the answer is more than 40: 60.' } },
          { q: 'Give a real example of a percent above 100%.', lines: { n: 2, key: 'For example: sales grew to 120% of last year; a tank is filled to 110% of its old size.' } },
          { q: 'Circle the greatest.', pick: { opts: ['1.4', '130%', '1 1/2', '145%'], ans: 2, big: true }, wide: true },
          Q('300% of 15')]
      }
    },

    under: {
      watch: 'writing 0.5% as 0.5. Divide by 100: 0.5% = 0.005.',
      goal: 'I can work with percents less than 1%.',
      learn: {
        show: { cap: 'less than 1% is less than 1 hundredth', eq: ['0.5% = 0.005'] },
        together: [DEC(0.2), PC('0.008')],
        cue: 'Divide by 100 as usual, even when the percent is less than 1.',
        own: [DEC(0.75), PC('0.001'), DEC(0.05), PC('1/400')]
      },
      p1: {
        show: { eq: ['1/200 = 0.005', '1/200 = 0.5%'] },
        items: [DEC(0.1), DEC(0.9), DEC(0.25), PC('0.006'), PC('0.0035'), PC('1/1000'), DEC(0.01), PC('3/500')]
      },
      p2: {
        items: [Q('0.5% of 800'), Q('0.2% of 1500'), Q('0.1% of 45 000'), Q('0.75% of 400'), PC('0.0004'), DEC(0.125), Q('0.3% of 2000'), PC('1/250')]
      },
      p3: {
        items: [ST('A bank pays 0.4% a month on $2500. How much is that in one month?', '0.4% of 2500', 'dollars'),
          ST('About 0.8% of 12 000 phones break. How many?', '0.8% of 12000', 'phones'),
          ST('Milk has 0.25% salt. How many grams of salt in 2000 g?', '0.25% of 2000', 'g'),
          ST('A town of 35 000 has 0.6% over 100 years old. How many?', '0.6% of 35000', 'people'), Q('0.05% of 60 000'), PC('7/2000')]
      },
      think: {
        items: [{ q: '{b} says 0.5% = 0.5. Explain the mistake.', lines: { n: 3, key: '0.5 is 50%. 0.5% is half of 1%: 0.005.' } },
          { q: 'Why do we use percents below 1% for things like interest?', lines: { n: 3, key: 'Small rates on big amounts still matter: 0.5% of $10 000 is $50.' } },
          { q: 'Circle the smallest.', pick: { opts: ['0.03', '0.3%', '1/200', '0.04%'], ans: 3, small: true }, wide: true },
          Q('0.9% of 500')]
      }
    },

    of: {
      watch: 'multiplying by the percent number itself (15% of 60 = 900). Change it to a decimal first: 0.15 × 60 = 9.',
      goal: 'I can find a percent of an amount.',
      learn: {
        show: { cap: '15% = 0.15', eq: ['15% of 60 = 0.15 × 60 = 9'] },
        together: [Q('20% of 45'), Q('35% of 80')],
        cue: 'Change the percent to a decimal, then multiply.',
        own: [Q('10% of 230'), Q('5% of 160'), Q('75% of 48'), Q('12% of 250')]
      },
      p1: {
        show: { eq: ['10% of 90 = 9', '30% of 90 = 27'] },
        items: [Q('50% of 86'), Q('25% of 64'), Q('10% of 375'), Q('1% of 900'), Q('40% of 35'), Q('60% of 120'), Q('15% of 40'), Q('90% of 70')]
      },
      p2: {
        items: [Q('8% of 75'), Q('13% of 300'), Q('65% of 140'), Q('2.5% of 400'), Q('33% of 600'), Q('45% of 220'), Q('7% of 1250'), Q('99% of 500')]
      },
      p3: {
        items: [ST('A class of 32 has 25% who walk to school. How many walk?', '25% of 32', 'students'),
          ST('{a} scores 85% on a test out of 60. What is the score?', '85% of 60', 'marks'),
          ST('A $45 shirt has a 30% discount. How much is the discount?', '30% of 45', 'dollars'),
          ST('A tip of 18% on a $65 meal. How much is the tip?', '18% of 65', 'dollars'), Q('17.5% of 80'), Q('64% of 625')]
      },
      think: {
        items: [{ q: 'Explain how to find 15% of 80 in your head.', lines: { n: 3, key: '10% is 8, 5% is 4, so 15% is 12.' } },
          { q: 'Is 30% of 50 the same as 50% of 30? Explain.', lines: { n: 3, key: 'Yes. Both are 0.3 × 50 = 0.5 × 30 = 15. Multiplying can be done in any order.' } },
          { q: '{b} says 20% of 45 = 900. What went wrong?', lines: { n: 2, key: '{b} did 20 × 45. 20% is 0.2: 0.2 × 45 = 9.' } },
          Q('22% of 150')]
      }
    },

    multiplier: {
      watch: 'adding the percent to the price (a 20% rise on $50 is not $70). The new amount is 120% of 50: 1.2 × 50 = 60.',
      goal: 'I can increase or decrease an amount by a percent in one step.',
      learn: {
        show: { cap: 'up 20%: 100% + 20% = 120%', eq: ['50 × 1.2 = 60'] },
        together: [Q('80 × 1.15'), Q('80 × 0.75')],
        cue: 'Increase: multiply by 1 + the rate. Decrease: multiply by 1 − the rate.',
        own: [Q('40 × 1.3'), Q('120 × 0.9'), Q('250 × 1.04'), Q('64 × 0.5')]
      },
      p1: {
        show: { cap: 'down 25%: 100% − 25% = 75%', eq: ['80 × 0.75 = 60'] },
        items: [Q('60 × 1.1'), Q('90 × 0.8'), Q('45 × 1.2'), Q('200 × 0.65'), Q('75 × 1.4'), Q('150 × 0.95'), Q('30 × 2'), Q('48 × 0.25')]
      },
      p2: {
        items: [ST('A $40 game rises in price by 15%. What is the new price?', '40 × (1 + 15%)', 'dollars'),
          ST('A $85 jacket is 20% off. What is the sale price?', '85 × (1 − 20%)', 'dollars'),
          ST('A town of 12 000 grows by 5%. What is the new population?', '12000 × (1 + 5%)', 'people'),
          ST('A car worth $24 000 loses 15% of its value. What is it worth now?', '24000 × (1 − 15%)', 'dollars'),
          { q: 'Up 30%: multiply by', eq: ['1 + 30% = []'], a: [1.3] }, { q: 'Down 12%: multiply by', eq: ['1 − 12% = []'], a: [0.88] }]
      },
      p3: {
        items: [ST('A $120 bike is 25% off, then 10% off the sale price. What is the final price?', '120 × (1 − 25%) × (1 − 10%)', 'dollars'),
          ST('A $60 price rises 10% and then falls 10%. What is the final price?', '60 × (1 + 10%) × (1 − 10%)', 'dollars'),
          ST('{a}\'s $15 an hour wage rises 6%. What is the new wage?', '15 × (1 + 6%)', 'dollars'),
          ST('A 2.5 L bottle has 40% more free. How many litres now?', '2.5 × (1 + 40%)', 'L'), Q('360 × 0.125'), Q('500 × 1.035')]
      },
      think: {
        items: [{ q: 'A price goes up 10%, then down 10%. Is it back where it started? Explain.', lines: { n: 3, key: 'No. The 10% off is taken from a bigger number. $100 → $110 → $99.' } },
          { q: '{b} says a 20% rise on $50 is $70. Explain the mistake.', lines: { n: 2, key: '{b} added 20 dollars, not 20%. 20% of 50 is 10, so $60.' } },
          { q: 'What single multiplier gives 25% off then 20% off?', eq: ['0.75 × 0.8 = []'], a: [0.6] },
          Q('90 × 1.25')]
      }
    },

    find: {
      watch: 'dividing by the new amount. Percent change = change ÷ original: from 40 to 50 is 10 ÷ 40 = 25%.',
      goal: 'I can find the percent increase or decrease.',
      learn: {
        show: { cap: 'change 10, original 40', eq: ['10 ÷ 40 = 25 %'] },
        together: [CHG(60, 48), CHG(60, 80)],
        cue: 'Percent change = change ÷ original × 100%.',
        own: [CHG(55, 50), CHG(24, 30)]
      },
      p1: {
        show: { eq: ['from 80 to 100: 20 ÷ 80', '20 ÷ 80 = 25%'] },
        items: [CHG(12, 10), CHG(36, 45), CHG(150, 100),
          CHG(63, 70), CHG(96, 80), CHG(150, 200)]
      },
      p2: {
        items: [ST('A $40 shirt is now $34. What is the percent decrease?', '(40 − 34) ÷ 40 × 100', '%'),
          ST('A plant grew from 16 cm to 20 cm. What is the percent increase?', '(20 − 16) ÷ 16 × 100', '%'),
          ST('A school went from 450 to 540 students. What is the percent increase?', '(540 − 450) ÷ 450 × 100', '%'),
          ST('A bill fell from $125 to $100. What is the percent decrease?', '(125 − 100) ÷ 125 × 100', '%'),
          ST('A price doubled from $35 to $70. What is the percent increase?', '(70 − 35) ÷ 35 × 100', '%'),
          ST('Snow fell from 60 cm to 51 cm. What is the percent decrease?', '(60 − 51) ÷ 60 × 100', '%')]
      },
      p3: {
        items: [ST('A town grew from 8000 to 9200. What is the percent increase?', '(9200 − 8000) ÷ 8000 × 100', '%'),
          ST('A phone went from $640 to $512. What is the percent decrease?', '(640 − 512) ÷ 640 × 100', '%'),
          ST('{a}\'s mark rose from 64 to 80. What is the percent increase?', '(80 − 64) ÷ 64 × 100', '%'),
          ST('A stock fell from $2.50 to $2.30. What is the percent decrease?', '(2.50 − 2.30) ÷ 2.50 × 100', '%'),
          ST('Rent went from $1200 to $1260. What is the percent increase?', '(1260 − 1200) ÷ 1200 × 100', '%'),
          ST('A price went from $20 to $50. What is the percent increase?', '(50 − 20) ÷ 20 × 100', '%')]
      },
      think: {
        items: [{ q: 'A price goes from $40 to $50, then back to $40. Are the two percent changes the same? Explain.', lines: { n: 3, key: 'No. Up is 10 ÷ 40 = 25%. Down is 10 ÷ 50 = 20%. The originals differ.' } },
          { q: '{b} found the change from 40 to 50 as 10 ÷ 50 = 20%. What went wrong?', lines: { n: 2, key: 'Divide by the original, 40: 25%.' } },
          { q: 'Can a decrease be more than 100%? Explain.', lines: { n: 2, key: 'No. Losing 100% leaves nothing; you cannot lose more than all of it.' } },
          ST('From 250 to 300. What is the percent increase?', '(300 − 250) ÷ 250 × 100', '%')]
      }
    },

    scale: {
      watch: 'adding the same amount to both parts (3 : 5 = 6 : 8). Multiply both by the same number: 3 : 5 = 6 : 10.',
      goal: 'I can solve a proportion.',
      learn: {
        show: { cap: '× 8 on both', eq: ['3 : 5 = 24 : 40'] },
        together: [PR(2, 3, 10), FR(4, 7, 28)],
        cue: 'Find what one part was multiplied by. Do the same to the other.',
        own: [PR(5, 8, 15), FR(3, 4, 20), PR2(7, 2, 10), FR(9, 12, 4)]
      },
      p1: {
        show: { eq: ['2/5 = []/35: 5 × 7 = 35', '2/5 = 14/35'] },
        items: [PR(1, 4, 6), PR(3, 2, 12), FR(5, 6, 30), FR(2, 9, 45), PR2(4, 5, 25), FR(6, 8, 4), PR(10, 15, 2), FR(7, 3, 12)]
      },
      p2: {
        items: [PR(4, 6, 10), FR(12, 16, 20), PR2(9, 15, 25), FR(2.5, 4, 12), ST('A recipe uses 3 cups of flour for 2 loaves. How much for 7 loaves?', '3 ÷ 2 × 7', 'cups'),
          ST('On a map 2 cm is 5 km. How far is 9 cm?', '9 × 5 ÷ 2', 'km'), PR(6, 9, 12), FR(8, 14, 21)]
      },
      p3: {
        items: [ST('4 kg of apples cost $9.40. What do 6 kg cost?', '9.40 ÷ 4 × 6', 'dollars'),
          ST('A car goes 280 km on 20 L. How far on 35 L?', '280 ÷ 20 × 35', 'km'),
          ST('The ratio of boys to girls is 4 : 5. There are 36 girls. How many boys?', '4 × 36 ÷ 5', 'boys'),
          ST('Paint is mixed 2 parts blue to 3 parts white. How much white for 8 L of blue?', '8 × 3 ÷ 2', 'L'), PR(3, 4, 9), FR(15, 24, 40)]
      },
      think: {
        items: [{ q: '{a} says 3 : 5 = 6 : 8 because both went up by 3. Explain.', lines: { n: 3, key: 'Equivalent ratios multiply, not add: 3 : 5 = 6 : 10.' } },
          { q: 'Show two ways to solve 4/10 = x/25.', lines: { n: 3, key: 'Unit rate: 4 ÷ 10 = 0.4, × 25 = 10. Or simplify 4/10 = 2/5 = 10/25.' } },
          { q: 'Write a real story for 2 : 3 = 10 : 15.', lines: { n: 2, key: 'For example: 2 cups of juice for 3 cups of water; 10 cups of juice need 15 of water.' } },
          FR(5, 8, 56)]
      }
    },

    proportional: {
      watch: 'calling any growing table proportional. Every pair must have the same ratio, and 0 must go with 0.',
      goal: 'I can tell if a relationship is proportional.',
      learn: {
        show: { cap: 'x 1, 2, 5 and y 4, 8, 20: y ÷ x is always 4', eq: ['proportional'] },
        together: [TB([[1, 3], [2, 6], [4, 12]]), TB([[1, 5], [2, 7], [3, 9]])],
        cue: 'Divide y by x in every row. Always the same? Proportional.',
        own: [TB([[2, 5], [4, 10], [6, 15]]), TB([[1, 2], [3, 8], [5, 14]])]
      },
      p1: {
        show: { pic: ['tbl', { head: ['x', 'y'], rows: [[1, 6], [2, 8], [3, 10]] }], eq: ['6, 4, 3.33: not the same'] },
        items: [TB([[2, 6], [3, 9], [7, 21]]), TB([[1, 10], [2, 20], [3, 40]]), TB([[5, 2], [10, 4], [15, 6]]), TB([[4, 6], [6, 9], [8, 12]])]
      },
      p2: {
        items: [TB([[3, 7], [6, 14], [9, 20]]), TB([[0.5, 2], [1, 4], [2.5, 10]]), TB([[10, 15], [20, 25], [30, 35]]), TB([[8, 2], [12, 3], [20, 5]]),
          { q: 'Hours worked and pay: 2 h $30, 5 h $75. Is it proportional? What is the pay for 8 h?', eq: ['[] dollars'], a: [120], calc: '30 ÷ 2 × 8' },
          { q: 'Taxi: $5 to start, then $2 per km. Is the cost proportional to the distance?', pick: { opts: ['yes', 'no'], ans: 1, prop: [[1, 7], [2, 9], [3, 11]] } }]
      },
      p3: {
        items: [TB([[1.5, 4.5], [4, 12], [6, 18]]), TB([[12, 9], [16, 12], [20, 16]]),
          { q: 'Gym B costs $50 to join and $30 a month. Is the cost proportional to the months?', pick: { opts: ['yes', 'no'], ans: 1, prop: [[1, 80], [2, 110], [3, 140]] } },
          { q: 'Is the perimeter of a square proportional to its side?', pick: { opts: ['yes', 'no'], ans: 0, prop: [[1, 4], [2, 8], [5, 20]] } },
          { q: 'Is the area of a square proportional to its side?', pick: { opts: ['yes', 'no'], ans: 1, prop: [[1, 1], [2, 4], [3, 9]] } },
          { q: 'A proportional table has x = 4, y = 10. What is y when x = 14?', eq: ['[]'], a: [35], calc: '10 ÷ 4 × 14' }]
      },
      think: {
        items: [{ q: 'Why is the taxi cost "$5 + $2 per km" not proportional?', lines: { n: 3, key: '0 km still costs $5, and y ÷ x changes: 7, 4.5, 3.67 ...' } },
          { q: 'What does the graph of a proportional relationship look like?', lines: { n: 2, key: 'A straight line through (0, 0).' } },
          { q: 'Make a proportional table with 3 rows.', lines: { n: 2, key: 'For example x 1, 2, 3 and y 7, 14, 21.' } },
          TB([[3, 4.5], [5, 7.5], [8, 12]])]
      }
    },

    unit: {
      watch: 'dividing the wrong way. For a rate per item, divide the total by the number of items.',
      goal: 'I can find and use a unit rate.',
      learn: {
        show: { cap: '6 cans cost $4.80', eq: ['4.80 ÷ 6 = 0.80 a can'] },
        together: [ST('{a} drives 240 km in 3 h. What is the speed in km per hour?', '240 ÷ 3', 'km/h'), ST('5 kg of rice costs $8.50. What is the cost per kg?', '8.50 ÷ 5', 'dollars')],
        cue: 'Unit rate = amount ÷ number of units.',
        own: [ST('{b} types 450 words in 9 minutes. How many words per minute?', '450 ÷ 9', 'words'), ST('12 eggs cost $4.20. What is the cost per egg?', '4.20 ÷ 12', 'dollars')]
      },
      p1: {
        show: { eq: ['150 km in 2 h', '150 ÷ 2 = 75 km/h'] },
        items: [Q('$9 ÷ 3'), Q('120 ÷ 4', { unit: 'km an hour' }), Q('$7.50 ÷ 5'), Q('64 ÷ 8', { unit: 'L a minute' }), Q('$11.40 ÷ 6'), Q('900 ÷ 12', { unit: 'm a second' }), Q('$2.40 ÷ 4'), Q('350 ÷ 7', { unit: 'km an hour' })]
      },
      p2: {
        items: [ST('A heart beats 216 times in 3 minutes. How many beats per minute?', '216 ÷ 3', 'beats'),
          ST('A printer prints 84 pages in 4 minutes. How many pages per minute?', '84 ÷ 4', 'pages'),
          ST('{a} earns $172.50 for 15 hours. What is the pay per hour?', '172.50 ÷ 15', 'dollars'),
          ST('A car uses 36 L for 450 km. How many km per litre?', '450 ÷ 36', 'km'),
          ST('At 75 km/h, how far in 4 h?', '75 × 4', 'km'), ST('At $1.65 a litre, what do 40 L cost?', '1.65 × 40', 'dollars')]
      },
      p3: {
        items: [ST('A tap fills 18 L in 1.5 minutes. How many litres per minute?', '18 ÷ 1.5', 'L'),
          ST('{b} cycles 27 km in 1.5 h. What is the speed?', '27 ÷ 1.5', 'km/h'),
          ST('A 750 g bag costs $5.25. What is the cost per 100 g?', '5.25 ÷ 750 × 100', 'dollars'),
          ST('A plane flies 2100 km in 2.5 h. How far in 4 h at that speed?', '2100 ÷ 2.5 × 4', 'km'),
          ST('A machine fills 480 bottles in 8 minutes. How many in an hour (60 minutes)?', '480 ÷ 8 × 60', 'bottles'),
          ST('A snail moves 3.6 m in 12 minutes. How many cm per minute?', '3.6 × 100 ÷ 12', 'cm')]
      },
      think: {
        items: [{ q: 'Why are unit rates useful for comparing?', lines: { n: 3, key: 'They put everything per 1 unit, so you compare like with like.' } },
          { q: '{a} says 4 cans for $6 is $0.67 a can. What went wrong?', lines: { n: 2, key: '{a} divided 4 ÷ 6. Cost per can is 6 ÷ 4 = $1.50.' } },
          { q: 'Write a unit rate you see in real life.', lines: { n: 1, key: 'For example $1.65 per litre of gas, or 100 km/h.' } },
          ST('$13.50 for 6 muffins. What is the cost per muffin?', '13.50 ÷ 6', 'dollars')]
      }
    },

    best: {
      watch: 'picking the cheaper total price. The better buy has the lower price for each unit.',
      goal: 'I can find the better buy by comparing unit prices.',
      learn: {
        show: { cap: '$3.00 for 2 L is $1.50 a litre; $4.20 for 3 L is $1.40 a litre', eq: ['3 L is the better buy'] },
        together: [BUY(['Small', 'Large'], [2.40, 5.40], [300, 900], 'g')],
        cue: 'Divide price by amount for each. The lowest unit price wins.',
        own: [BUY(['A', 'B'], [5.00, 7.20], [4, 6], 'rolls')]
      },
      p1: {
        show: { eq: ['$2.50 ÷ 5 = $0.50 each', '$4.80 ÷ 12 = $0.40 each'] },
        items: [BUY(['A', 'B'], [1.80, 3.00], [3, 6], 'apples'), BUY(['A', 'B'], [4.00, 9.00], [2, 5], 'kg'), BUY(['A', 'B'], [2.70, 4.80], [9, 12], 'pens')]
      },
      p2: {
        items: [BUY(['A', 'B', 'C'], [3.60, 5.00, 8.40], [4, 5, 12], 'cans'), BUY(['Box', 'Bag'], [6.30, 4.95], [700, 500], 'g'),
          BUY(['A', 'B'], [24.00, 39.00], [8, 12], 'kg')]
      },
      p3: {
        items: [BUY(['A', 'B'], [17.40, 20.00], [20, 25], 'm'), BUY(['A', 'B'], [5.49, 8.99], [750, 1250], 'mL'),
          { q: 'Store A: 3 for $4.50. Store B: $1.40 each. How much do you save on 6 at the cheaper store?', eq: ['[] dollars'], a: [0.6], calc: '6 × 4.50 ÷ 3 − 6 × 1.40' },
          { q: 'A 2 kg bag is $7.80. A 500 g bag is $2.10. What is the price per kg of the 500 g bag?', eq: ['[] dollars'], a: [4.2], calc: '2.10 ÷ 500 × 1000' }]
      },
      think: {
        items: [{ q: 'Is the bigger package always the better buy? Explain.', lines: { n: 3, key: 'No. Check the unit price. And a big pack that goes to waste is not a deal.' } },
          { q: 'Give a reason to choose the higher unit price.', lines: { n: 2, key: 'For example: you only need a little, or it is a better quality or brand.' } },
          BUY(['A', 'B'], [4.40, 6.30], [8, 14], 'eggs'),
          { q: 'At $2.50 per 100 g, what does 350 g cost?', eq: ['[] dollars'], a: [8.75], calc: '2.50 × 350 ÷ 100' }]
      }
    },

    bedmas: {
      watch: 'working left to right. Brackets first, then exponents, then × and ÷ left to right, then + and − left to right.',
      goal: 'I can use the order of operations, with fractions and decimals too.',
      learn: {
        show: { cap: '× before +', eq: ['4 + 3 × 2² = 16'] },
        together: [Q('20 − 3 × 4'), Q('(5 + 3)² ÷ 4')],
        cue: 'Brackets, exponents, × and ÷, + and −.',
        own: [Q('18 ÷ 3 + 2 × 5'), Q('2 × (7 − 4)²'), Q('10 − 6 ÷ 2 + 1'), Q('3² + 4²')]
      },
      p1: {
        show: { eq: ['(8 − 2) × 3 = 6 × 3', '(8 − 2) × 3 = 18'] },
        items: [Q('6 + 4 × 5'), Q('(6 + 4) × 5'), Q('24 ÷ 4 × 2'), Q('15 − 2³'), Q('100 ÷ (5 × 4)'), Q('7 × 2 − 3 × 4'), Q('(9 − 3) ÷ 2 + 1'), Q('2 + 3²')]
      },
      p2: {
        items: [Q('0.5 × 8 + 1.5'), Q('(2.4 + 3.6) ÷ 0.5'), Q('1/2 + 1/4 × 2', { frac: true }), Q('(1/2 + 1/4) × 2', { frac: true }), Q('5² − 3 × (4 + 2)'), Q('48 ÷ (2³ − 2)'), Q('6 × 0.25 − 0.5²'), Q('(3 + 5) × (10 − 7)')]
      },
      p3: {
        items: [Q('2 × (3 + 4)² − 50'), Q('(1.2 + 0.8)³ ÷ 4'), Q('3/4 ÷ 1/2 + 1/4', { frac: true }), Q('(−2) × 3² + 20'), Q('((12 − 4) ÷ 2)²'),
          ST('Tickets are $12 for adults and $7.50 for children. What do 2 adults and 3 children pay?', '2 × 12 + 3 × 7.50', 'dollars'), Q('10 − (2.5 + 1.5) × 2')]
      },
      think: {
        items: [{ q: '{b} says 4 + 3 × 2 = 14. Explain the mistake.', lines: { n: 2, key: '{b} added first. Multiply first: 4 + 6 = 10.' } },
          { q: 'Put in brackets to make it true: 2 + 3 × 4 − 1 = 15', lines: { n: 1, key: '(2 + 3) × (4 − 1) = 15' } },
          { q: 'Write an expression with 3, 4 and 5 that equals 35.', lines: { n: 1, key: 'For example (3 + 4) × 5 = 35.' } },
          Q('64 ÷ 4² × 3')]
      }
    },

    multi: {
      watch: 'stopping after the first step. Plan the steps: what do you find first, and what does it let you find?',
      goal: 'I can solve problems with several steps and percents.',
      learn: {
        show: { cap: 'price, then 13% HST', eq: ['$40 × 1.13 = $45.20'] },
        together: [ST('{a} buys 3 books at $12.50 each with a 20% discount on the total. What is the cost?', '3 × 12.50 × (1 − 20%)', 'dollars'),
          ST('A class of 30 has 40% girls. How many boys?', '30 − 40% of 30', 'boys')],
        cue: 'Plan: what do you find first? Then use it.',
        own: [ST('{b} earns $15 an hour for 6 hours and spends 25% of it. How much is left?', '15 × 6 × (1 − 25%)', 'dollars'),
          ST('A $250 TV is 30% off. Then 13% HST is added. What is the final price?', '250 × (1 − 30%) × (1 + 13%)', 'dollars')]
      },
      p1: {
        show: { eq: ['3 × $8 = $24', '$24 × 1.13 = $27.12'] },
        items: [ST('4 shirts at $15 each, 10% off the total. What is the cost?', '4 × 15 × (1 − 10%)', 'dollars'),
          ST('A team won 60% of its 25 games. How many did it lose?', '25 − 60% of 25', 'games'),
          ST('{a} had $80, spent $35, then saved 1/2 of the rest. How much was saved?', '(80 − 35) ÷ 2', 'dollars'),
          ST('A recipe for 4 needs 300 g of pasta. How much for 10 people?', '300 ÷ 4 × 10', 'g')]
      },
      p2: {
        items: [ST('A $60 jacket is 25% off. HST of 13% is added. What is the final price?', '60 × (1 − 25%) × (1 + 13%)', 'dollars'),
          ST('{b} reads 45 pages a day. A book has 540 pages. {b} has read 30% of it. How many more days?', '540 × (1 − 30%) ÷ 45', 'days'),
          ST('A pool holds 48 000 L and is 75% full. A hose adds 1200 L an hour. How many hours to fill it?', '48000 × (1 − 75%) ÷ 1200', 'hours'),
          ST('3 friends split a $54 bill and a 15% tip equally. How much each?', '54 × (1 + 15%) ÷ 3', 'dollars')]
      },
      p3: {
        items: [ST('A store buys a game for $24 and sells it for 150% of that. On sale it is 20% off. What is the sale price?', '24 × 150% × (1 − 20%)', 'dollars'),
          ST('A town of 15 000 grows 4% one year and 5% the next. What is the population after 2 years?', '15000 × (1 + 4%) × (1 + 5%)', 'people'),
          ST('{a} runs 5 km in 25 minutes. At that rate, how long for a 21 km race?', '25 ÷ 5 × 21', 'minutes'),
          ST('A phone costs $720. {b} pays 25% now and the rest over 12 equal months. How much a month?', '720 × (1 − 25%) ÷ 12', 'dollars')]
      },
      think: {
        items: [{ q: 'Is 20% off then 13% tax the same as 13% tax then 20% off? Explain.', lines: { n: 3, key: 'Yes. Both are the price × 0.8 × 1.13, and you can multiply in any order.' } },
          { q: 'Write a two-step percent problem and solve it.', lines: { n: 3, key: 'For example: $50 shoes, 10% off, then 13% HST: 50 × 0.9 × 1.13 = $50.85.' } },
          { q: '{b} found 30% off $80 and then added 30% back, and got $80. What went wrong?', lines: { n: 3, key: '30% of $56 is less than 30% of $80. 80 × 0.7 × 1.3 = $72.80.' } },
          ST('A $90 game is 15% off, plus 13% HST. What is the final price?', '90 × (1 − 15%) × (1 + 13%)', 'dollars', 2)]
      }
    }
  } });
})();
