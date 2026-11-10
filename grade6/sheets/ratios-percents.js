/* Grade 6 Ratios, Rates and Percents: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons
   in chapters/ratios-percents.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at
   random, so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts}.
   Ontario 2020: B2.12 ratios, rates and percents; B2.3 mental math for 1%, 5%, 10%, 15%, 25% and 50% of whole
   numbers. The answer checks are in tests/verify/sheets.js: a ratio's two numbers come from the picture or the story
   in the order asked (of), equivalent ratios name the same comparison, every row of a ratio table keeps the same
   rate, a better buy has the lower price for 1 (less), and a percent sum is worked out again (25% × 80 = 20). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var NM = { a: 'circles', b: 'squares', all: 'all the shapes' };
  function pick2(parts, of) { var t = { a: parts[0], b: parts[1], all: parts[0] + parts[1] }; return [t[of[0]], t[of[1]]]; }
  /* a ratio read from a picture of circles and squares */
  function MR(a, b, of, g) {
    var w = NM[of[0]] + ' to ' + NM[of[1]];
    return { q: w.charAt(0).toUpperCase() + w.slice(1), pic: ['mix', { a: a, b: b, g: g }], eq: ['[] : []'], a: pick2([a * (g || 1), b * (g || 1)], of), of: of };
  }
  /* a ratio from a story: parts are the two amounts in the story, in order */
  function SR(q, parts, of) { return { q: q, eq: ['[] : []'], a: pick2(parts, of), parts: parts, of: of }; }
  /* an equivalent ratio; at: the first part is blank */
  function EQ(a, b, m, at) { var c = a * m, d = b * m; return at ? { eq: [a + ' : ' + b + ' = [] : ' + d], a: [c] } : { eq: [a + ' : ' + b + ' = ' + c + ' : []'], a: [d] }; }
  /* a ratio table */
  function TB(head, rows) {
    var full = rows.filter(function (r) { return r[0] !== '[]' && r[1] !== '[]'; })[0], k = full[1] / full[0], a = [];
    rows.forEach(function (r) { if (r[0] === '[]') a.push(+(r[1] / k).toFixed(4)); if (r[1] === '[]') a.push(+(r[0] * k).toFixed(4)); });
    return { pic: ['table', { head: head, rows: rows }], a: a };
  }
  /* a unit rate */
  function UR(t, n, unit) { return { eq: [t + ' ÷ ' + n + ' = [] ' + unit], a: [+(t / n).toFixed(4)] }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* the better buy: the lower price for 1 */
  function BB(q, deals) {
    var each = deals.map(function (d) { return d[1] / d[0]; }), best = each.indexOf(Math.min.apply(null, each));
    var opts = deals.map(function (d) { return d[0] + ' for $' + S.fmt(d[1]).replace(/\.(\d)$/, '.$10'); });
    return { q: q.replace('?', ': ' + opts.join(' or ') + '?'), pick: { opts: opts, ans: best, less: deals.map(function (d) { return d[1] + ' / ' + d[0]; }) }, wide: true };
  }
  /* a percent of a number */
  function PC(p, n) { return { eq: [p + '% × ' + n + ' = []'], a: [+(p * n / 100).toFixed(2)] }; }
  /* a fraction or decimal as a percent */
  function TP(f) { var m = String(f).match(/^(\d+)\/(\d+)$/), v = m ? m[1] / m[2] : +f; return { eq: [f + ' = []%'], a: [+(v * 100).toFixed(2)] }; }

  S.register('ratios-percents', { code: 'RP', ideas: {

    compare: {
      watch: 'writing the numbers in the wrong order. A ratio follows the order of the words: circles to squares puts circles first.',
      goal: 'I can write a ratio for a part to a part or a part to the whole.',
      learn: {
        show: { pic: ['mix', { a: 3, b: 5 }], cap: '3 circles, 5 squares', eq: ['circles to squares = 3 : 5', 'circles to all = 3 : 8'] },
        together: [MR(4, 7, ['a', 'b']), MR(4, 7, ['a', 'all'])],
        cue: 'Write the numbers in the same order as the words. The whole is both parts added.',
        own: [MR(2, 5, ['b', 'a']), SR('A team won 9 games and lost 4. Won to lost:', [9, 4], ['a', 'b'])]
      },
      p1: {
        show: { pic: ['mix', { a: 2, b: 6 }], eq: ['squares to circles = 6 : 2'] },
        items: [MR(1, 4, ['a', 'b']), MR(3, 2, ['b', 'a']), MR(5, 4, ['a', 'all']), MR(7, 2, ['b', 'all']), MR(3, 6, ['b', 'a']), MR(2, 2, ['a', 'all'])]
      },
      p2: {
        items: [SR('A {cont} has 5 red {many} and 8 blue {many}. Red to blue:', [5, 8], ['a', 'b']),
          SR('A class has 12 girls and 14 boys. Boys to all:', [12, 14], ['b', 'all']),
          SR('A garden has 7 squash plants and 3 corn plants. Corn to squash:', [7, 3], ['b', 'a']),
          SR('A playlist has 6 songs in French and 9 in English. French to all:', [6, 9], ['a', 'all']),
          MR(6, 5, ['a', 'b']), MR(2, 9, ['b', 'all'])]
      },
      p3: {
        items: [SR('{b} scored 7 goals and missed 13 shots. Goals to all shots:', [7, 13], ['a', 'all']),
          SR('A bus has 24 students and 3 adults. Adults to students:', [24, 3], ['b', 'a']),
          SR('A trail has 11 maple and 15 pine trees. Pine to all:', [11, 15], ['b', 'all']),
          { q: 'Red to all is 3 : 10. What fraction is red?', eq: ['[]'], a: ['3/10'], calc: '3/10' },
          { q: 'Draw 4 circles and 3 squares. Write circles to all.', draw: { h: 40, key: '4 circles and 3 squares.' }, eq: ['[] : []'], a: [4, 7], parts: [4, 3], of: ['a', 'all'] }]
      },
      think: {
        items: [{ q: '{b} says 4 boys and 5 girls give boys to all = 4 : 5. What went wrong?', lines: { n: 3, key: '5 is the girls, a part. All the children is 4 + 5 = 9, so 4 : 9.' } },
          { q: 'How is a part to whole ratio like a fraction?', lines: { n: 2, key: 'Both compare a part to the whole: 3 : 10 and 3/10 mean 3 out of 10.' } },
          MR(8, 3, ['b', 'a']),
          { q: 'Write a sentence that uses the ratio 2 : 7.', lines: { n: 2, key: 'For example: There are 2 cups of juice for every 7 cups of water.' } }]
      }
    },

    equal: {
      watch: 'adding the same number to both parts (2 : 3 = 4 : 5). Multiply or divide both parts by the same number.',
      goal: 'I can find equivalent ratios.',
      learn: {
        show: { pic: ['mix', { a: 2, b: 3, g: 3 }], cap: '3 groups of 2 : 3', eq: ['2 : 3 = 6 : 9'] },
        together: [{ pic: ['mix', { a: 1, b: 4, g: 2 }], eq: ['1 : 4 = 2 : []'], a: [8] }, EQ(3, 5, 2)],
        cue: 'Multiply or divide both numbers by the same number. Adding does not work.',
        own: [EQ(2, 7, 3), EQ(4, 1, 5), EQ(6, 8, 0.5, true)]
      },
      p1: {
        show: { eq: ['3 : 4 = 9 : 12 (both × 3)'] },
        items: [EQ(1, 3, 4), EQ(2, 5, 2), EQ(5, 4, 3), EQ(3, 2, 10), EQ(10, 15, 0.2), EQ(12, 4, 0.25, true)]
      },
      p2: {
        items: [EQ(4, 9, 2), EQ(7, 3, 4, true), EQ(6, 5, 5), EQ(18, 24, 1 / 6),
          { q: 'Which is equivalent to 4 : 6?', pick: { opts: ['2 : 3', '5 : 7', '6 : 4'], ans: 0, ratio: [4, 6] }, wide: true },
          { q: 'Which is not equivalent to 1 : 5?', pick: { opts: ['2 : 10', '3 : 15', '4 : 8'], ans: 2, ratio: [1, 5], not: true }, wide: true }]
      },
      p3: {
        items: [{ eq: ['2 : 5 = 4 : [] = 6 : []'], a: [10, 15], wide: true }, { eq: ['3 : 4 = [] : 8 = [] : 40'], a: [6, 30], wide: true },
          story('Bannock uses 3 cups of flour for 1 cup of water. How much flour for 4 cups of water?', 'cups', 12, '3 × 4'),
          { q: 'Simplest form of 12 : 18:', eq: ['12 : 18 = [] : []'], a: [2, 3] }]
      },
      think: {
        items: [{ q: '{b} says 2 : 3 = 4 : 5 because 2 was added to both. Is {b} right?', lines: { n: 3, key: 'No. Adding changes the mix. Multiply both: 2 : 3 = 4 : 6.' } },
          { q: 'Write three ratios equivalent to 3 : 1.', lines: { n: 1, key: '6 : 2, 9 : 3, 12 : 4 (any with the first part 3 times the second).' } },
          EQ(5, 2, 4),
          { q: 'Draw groups to show 1 : 2 = 3 : 6.', draw: { h: 50, key: '3 groups, each with 1 circle and 2 squares.' } }]
      }
    },

    scale: {
      watch: 'doing a step to one amount only. Whatever you do to one amount, do to the other.',
      goal: 'I can solve problems with ratio tables and double number lines.',
      learn: {
        show: { pic: ['table', { head: ['eggs', 'cups of flour'], rows: [[2, 3], [4, 6], [8, 12]] }], cap: 'double, then double again' },
        together: [TB(['eggs', 'cups of milk'], [[3, 2], [6, '[]'], [9, '[]']]), TB(['{conts}', '{many}'], [[2, 10], [1, '[]'], [5, '[]']])],
        cue: 'How many times bigger? Do the same to the other amount.',
        own: [TB(['laps', 'minutes'], [[2, 7], [4, '[]'], [10, '[]']]), TB(['hours', 'km'], [[3, 45], [1, '[]'], [7, '[]']])]
      },
      p1: {
        show: { pic: ['table', { head: ['days', 'km'], rows: [[2, 30], [1, 15], [3, 45]] }], cap: 'halve, then times 3' },
        items: [TB(['cups of rice', 'cups of water'], [[1, 2], [3, '[]'], [5, '[]']]), TB(['{conts}', '{many}'], [[3, 12], [6, '[]'], [1, '[]']]),
          TB(['hours', '$'], [[2, 24], [1, '[]'], [4, '[]']]), TB(['tickets', '$'], [[4, 20], [2, '[]'], [8, '[]']])]
      },
      p2: {
        items: [TB(['L of syrup', 'L of sap'], [[1, 40], [2, '[]'], [5, '[]']]), TB(['batches', 'muffins'], [[3, 36], [1, '[]'], [5, '[]']]),
          TB(['scoops', 'cups'], [[4, 6], [2, '[]'], [10, '[]']]), TB(['km', 'minutes'], [[5, 20], [10, '[]'], [15, '[]']])]
      },
      p3: {
        items: [story('A recipe uses 3 cups of flour for every 2 eggs. How much flour for 10 eggs?', 'cups', 15, '3 × 10 / 2'),
          story('{a} mixes 2 cans of blue paint for every 5 cans of white. How much white for 8 cans of blue?', 'cans', 20, '5 × 8 / 2'),
          story('A map scale is 1 cm : 25 km. Two towns are 7 cm apart on the map. How far apart are they?', 'km', 175, '25 × 7'),
          TB(['people', 'cups of soup'], [[4, 6], [2, '[]'], [10, '[]']])]
      },
      think: {
        items: [{ q: '{b} filled in a table: 2 eggs, 3 cups; 4 eggs, 5 cups. What went wrong?', lines: { n: 3, key: '{b} added 2 to each. The eggs doubled, so the flour must double too: 6 cups.' } },
          { q: 'Draw a double number line for 3 km every 20 minutes, up to 1 hour.', draw: { h: 60, key: 'Top line 0, 3, 6, 9 km; bottom line 0, 20, 40, 60 minutes.' } },
          TB(['{conts}', '{many}'], [[5, 35], [1, '[]'], [7, '[]']])]
      }
    },

    unit: {
      watch: 'dividing the wrong way (4 ÷ 12). The unit rate is the total divided by the number of units.',
      goal: 'I can find a unit rate.',
      learn: {
        show: { cap: '$12 for 4 tickets', eq: ['12 ÷ 4 = 3', '$3 per ticket'] },
        together: [UR(60, 4, 'pages per day'), UR(36, 3, 'km per hour')],
        cue: 'Unit rate = total ÷ number of units.',
        own: [UR(80, 5, 'L per minute'), Object.assign(UR(48, 6, '{many} per {cont}'), { wide: true }), UR(150, 10, 'km per hour')]
      },
      p1: {
        show: { eq: ['90 km in 2 h', '90 ÷ 2 = 45 km per hour'] },
        items: [UR(20, 4, 'dollars each'), UR(90, 3, 'km per hour'), UR(42, 7, 'pages per day'), Object.assign(UR(100, 5, 'mL per minute'), { wide: true }), Object.assign(UR(56, 8, '{many} per {cont}'), { wide: true })]
      },
      p2: {
        items: [story('{a} cycles 60 km in 4 hours. How far in 1 hour?', 'km', 15, '60 ÷ 4'),
          story('8 juice boxes cost $6. How much for 1?', 'dollars', 0.75, '6 ÷ 8'),
          story('A printer prints 72 pages in 6 minutes. How many pages per minute?', 'pages', 12, '72 ÷ 6'),
          story('{b} earns $54 in 6 hours. How much per hour?', 'dollars', 9, '54 ÷ 6'),
          UR(96, 8, 'km per hour'), UR(125, 5, 'L per minute')]
      },
      p3: {
        items: [story('5 tickets cost $35. How much for 8 tickets?', 'dollars', 56, '35 ÷ 5 × 8'),
          story('A car uses 6 L of gas for 90 km. How far on 10 L?', 'km', 150, '90 ÷ 6 × 10'),
          story('A heart beats 210 times in 3 minutes. How many beats per minute?', 'beats', 70, '210 ÷ 3'),
          story('3 kg of apples cost $7.50. How much per kilogram?', 'dollars', '2.50', '7.50 ÷ 3'),
          UR(4.5, 3, 'km per hour')]
      },
      think: {
        items: [{ q: 'What does "45 km per hour" mean?', lines: { n: 2, key: 'In each hour, it goes 45 km.' } },
          { q: 'Why is the rate for 1 useful?', lines: { n: 3, key: 'It lets you find any amount by multiplying, and compare two deals fairly.' } },
          UR(84, 7, 'km per hour'),
          { q: 'Write a rate you see in real life.', lines: { n: 2, key: 'For example: $1.60 per litre of gas, 100 km per hour, 3 meals per day.' } }]
      }
    },

    better: {
      watch: 'picking the deal with the lower total. Compare the price for 1, not the totals.',
      goal: 'I can find the better buy.',
      learn: {
        show: { cap: '4 for $8 or 6 for $9?', eq: ['8 ÷ 4 = $2 each', '9 ÷ 6 = $1.50 each'] },
        together: [UR(8, 4, 'dollars each'), BB('Which is the better buy?', [[4, 8], [6, 9]])],
        cue: 'Compare unit prices, not totals.',
        own: [BB('Which is the better buy?', [[3, 6], [5, 12]]), BB('Which is the better buy?', [[2, 5], [10, 20]])]
      },
      p1: {
        show: { eq: ['5 for $10: $2 each', '3 for $5: about $1.67 each'] },
        items: [BB('Which is the better buy?', [[2, 3], [4, 8]]), BB('Which is the better buy?', [[5, 10], [3, 5]]), BB('Which is the better buy?', [[6, 9], [4, 8]]),
          BB('Which is the better buy?', [[10, 15], [4, 8]])]
      },
      p2: {
        items: [{ q: 'Who is faster: {a}, 30 km in 2 hours, or {b}, 48 km in 4 hours?', pick: { opts: ['{a}', '{b}'], ans: 0, more: ['30 / 2', '48 / 4'] }, wide: true },
          BB('Juice: which is the better buy?', [[2, 3], [3, 4]]), BB('Pencils: which is the better buy?', [[12, 3], [30, 6]]),
          { q: 'Who reads faster: {a}, 40 pages in 2 days, or {b}, 70 pages in 5 days?', pick: { opts: ['{a}', '{b}'], ans: 0, more: ['40 / 2', '70 / 5'] }, wide: true }]
      },
      p3: {
        items: [BB('Granola bars: which is the better buy?', [[6, 4.5], [8, 5.6]]), BB('Rice: which is the better buy?', [[2, 7], [5, 16]]),
          { q: 'Which car goes farther per litre: A, 300 km on 20 L, or B, 420 km on 30 L?', pick: { opts: ['A', 'B'], ans: 0, more: ['300 / 20', '420 / 30'] }, wide: true },
          story('A 4 L jug costs $6. A 1 L carton costs $1.75. How much is saved per litre with the jug?', 'dollars', '0.25', '1.75 − 6 ÷ 4'),
          UR(5.6, 8, 'dollars each'), BB('Yogurt: which is the better buy?', [[4, 3], [6, 4.2]])]
      },
      think: {
        items: [{ q: '{b} says 6 for $9 costs more than 4 for $8 because $9 is more. What would you tell {b}?', lines: { n: 3, key: 'Find the price for 1: $9 ÷ 6 = $1.50 and $8 ÷ 4 = $2. So 6 for $9 is cheaper each.' } },
          { q: 'When might the better buy not be the best choice?', lines: { n: 3, key: 'If you cannot use it all before it goes bad, or you do not have enough money now.' } },
          BB('Which is the better buy?', [[3, 4.5], [7, 9.8]])]
      }
    },

    meaning: {
      watch: 'reading 5% as 0.5. Percent means out of 100: 5% is 5/100 = 0.05.',
      goal: 'I can write fractions and decimals as percents.',
      learn: {
        show: { pic: ['grid', { n: 35, unit: '1%', quiet: true, u: 8 }], cap: '35 of 100 squares', eq: ['35/100 = 0.35 = 35%'] },
        together: [{ pic: ['grid', { n: 60, unit: '1%', quiet: true, u: 7 }], eq: ['[]/100 = []%'], a: [60, 60] }, TP('3/4')],
        cue: 'Make the bottom 100. The top is the percent.',
        own: [TP('7/10'), TP('0.42'), TP('1/5')]
      },
      p1: {
        show: { eq: ['1/2 = 50/100 = 50%'] },
        items: [TP('23/100'), TP('9/10'), TP('0.07'), TP('1/4'), TP('2/5'), TP('0.6')]
      },
      p2: {
        items: [TP('3/20'), TP('17/50'), TP('0.125'), TP('1'), { eq: ['45% = []/100 = []'], a: [45, 0.45], wide: true }, { eq: ['8% = []'], a: [0.08] }]
      },
      p3: {
        items: [TP('19/25'), TP('7/8'),
          { q: '{a} got 18 out of 20 on a test. What percent is that?', eq: ['18/20 = []/100 = []%'], a: [90, 90], wide: true },
          { q: 'A class of 25 has 15 who walk to school. What percent walk?', eq: ['15/25 = []/100 = []%'], a: [60, 60], wide: true },
          { q: 'Which is the greatest?', pick: { opts: ['0.6', '58%', '3/5', '61%'], ans: 3, big: true }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 5% = 0.5. What went wrong?', lines: { n: 2, key: '5% means 5 out of 100, so 0.05. 0.5 is 50%.' } },
          { q: 'Why can you not get more than 100% of the questions right on a test?', lines: { n: 2, key: '100% is all of them. There is nothing more to get.' } },
          TP('11/20'),
          { q: 'Shade 25% of a hundred grid. Write it as a fraction too.', draw: { h: 70, key: '25 squares shaded: 25/100 = 1/4.' } }]
      }
    },

    head: {
      watch: 'finding 10% by dividing by 100. 10% is one tenth: divide by 10. 1% is one hundredth: divide by 100.',
      goal: 'I can find percents of a number in my head.',
      learn: {
        show: { cap: '10% of 80 is 8, so 5% is half of 8', eq: ['10% × 80 = 8', '5% × 80 = 4', '15% × 80 = 12'] },
        together: [PC(10, 60), PC(5, 60)],
        cue: 'Start from 10%, 50% or 1%, then build.',
        own: [PC(15, 60), PC(50, 36), PC(25, 48)]
      },
      p1: {
        show: { eq: ['50%: half', '25%: half of a half', '1%: ÷ 100'] },
        items: [PC(10, 90), PC(50, 90), PC(25, 40), PC(1, 300), PC(5, 40), PC(15, 40)]
      },
      p2: {
        items: [PC(10, 250), PC(5, 250), PC(15, 200), PC(25, 120), PC(1, 450), PC(50, 75)]
      },
      p3: {
        items: [story('A $60 jacket is 25% off. How much is taken off?', 'dollars', 15, '25% × 60'),
          story('A $40 meal and a 15% tip. How much is the tip?', 'dollars', 6, '15% × 40'),
          story('5% of a class of 120 students are away. How many are away?', 'students', 6, '5% × 120'),
          story('A $80 game is 10% off. What is the new price?', 'dollars', 72, '80 − 10% × 80'),
          PC(15, 300)]
      },
      think: {
        items: [{ q: 'How can you find 15% of 60 in your head?', lines: { n: 3, key: '10% of 60 is 6 and 5% is 3. 6 + 3 = 9.' } },
          { q: '{b} says 10% of 250 is 2.5. What went wrong?', lines: { n: 2, key: '10% is one tenth: 250 ÷ 10 = 25. 2.5 is 1%.' } },
          PC(25, 360),
          { q: 'Which is more: 50% of 40 or 25% of 100? Show how you know.', lines: { n: 2, key: '50% of 40 is 20 and 25% of 100 is 25. So 25% of 100 is more.' } }]
      }
    }
  } });
})();
