/* Grade 5 Ratios and Rates: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/ratios.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.9 ratios and rates: compare two amounts, find equivalent ratios, and solve problems with ratio
   tables. The answer checks are in tests/verify/sheets.js: a ratio's two numbers come from the picture or the story
   (of: which two, from a, b and all), and equivalent ratios must name the same comparison. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var NM = { a: 'circles', b: 'squares', all: 'all the shapes' };
  function pick2(parts, of) { var t = { a: parts[0], b: parts[1], all: parts[0] + parts[1] }; return [t[of[0]], t[of[1]]]; }
  /* a ratio read from a picture of circles and squares (in g groups) */
  function MR(a, b, of, g) {
    var w = NM[of[0]] + ' to ' + NM[of[1]];
    return { q: w.charAt(0).toUpperCase() + w.slice(1), pic: ['mix', { a: a, b: b, g: g }], eq: ['[] : []'], a: pick2([a * (g || 1), b * (g || 1)], of), of: of };
  }
  /* a ratio from a story: parts are the two amounts in the story, in order */
  function SR(q, parts, of) { return { q: q, eq: ['[] : []'], a: pick2(parts, of), parts: parts, of: of }; }
  /* an equivalent ratio: multiply (m > 1) or divide (m < 1) both parts; at: which part is blank */
  function EQ(a, b, m, at) {
    var c = a * m, d = b * m;
    return at ? { eq: [a + ' : ' + b + ' = [] : ' + d], a: [c] } : { eq: [a + ' : ' + b + ' = ' + c + ' : []'], a: [d] };
  }
  /* a rate: amount for 1 */
  function RT(t, n, unit) { return { eq: [t + ' ÷ ' + n + ' = [] ' + unit], a: [t / n] }; }
  /* amount for n at a rate */
  function AT(r, n, unit) { return { eq: [n + ' × ' + r + ' = [] ' + unit], a: [n * r] }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* a ratio table: two rows of amounts kept in step */
  function TB(head, rows) {
    var full = rows.filter(function (r) { return r[0] !== '[]' && r[1] !== '[]'; })[0], k = full[1] / full[0], a = [];
    rows.forEach(function (r) { if (r[0] === '[]') a.push(r[1] / k); if (r[1] === '[]') a.push(r[0] * k); });
    return { pic: ['table', { head: head, rows: rows }], a: a };
  }

  S.register('ratios', { code: 'RA', ideas: {

    compare: {
      watch: 'writing the numbers in the wrong order. A ratio follows the order of the words: circles to squares puts circles first.',
      goal: 'I can write a ratio to compare two amounts.',
      learn: {
        show: { pic: ['mix', { a: 3, b: 5 }], cap: '3 circles for 5 squares', eq: ['circles to squares = 3 : 5'] },
        together: [MR(4, 7, ['a', 'b']), MR(4, 7, ['b', 'a'])],
        cue: 'Write the numbers in the same order as the words.',
        own: [MR(2, 5, ['a', 'b']), MR(6, 1, ['b', 'a']), MR(5, 3, ['a', 'b'])]
      },
      p1: {
        show: { pic: ['mix', { a: 2, b: 6 }], eq: ['circles to squares = 2 : 6', 'squares to circles = 6 : 2'] },
        items: [MR(1, 4, ['a', 'b']), MR(3, 2, ['a', 'b']), MR(5, 4, ['b', 'a']), MR(7, 2, ['a', 'b']), MR(3, 6, ['b', 'a'])]
      },
      p2: {
        items: [SR('A {cont} has 5 red {many} and 8 blue {many}. Red to blue:', [5, 8], ['a', 'b']),
          SR('A class has 12 girls and 14 boys. Boys to girls:', [12, 14], ['b', 'a']),
          SR('{a} has 3 dogs and 2 cats. Cats to dogs:', [3, 2], ['b', 'a']),
          SR('A trail has 9 maple trees and 4 pine trees. Maple to pine:', [9, 4], ['a', 'b']),
          MR(6, 5, ['a', 'b']), MR(2, 9, ['b', 'a'])]
      },
      p3: {
        items: [SR('{b} scored 7 goals and missed 3 shots. Missed to scored:', [7, 3], ['b', 'a']),
          SR('A fence has 11 posts and 10 gaps. Gaps to posts:', [11, 10], ['b', 'a']),
          SR('A recipe uses 2 cups of oats and 1 cup of berries. Oats to berries:', [2, 1], ['a', 'b']),
          { q: 'Draw 4 circles and 3 squares. Write circles to squares.', draw: { h: 40, key: '4 circles and 3 squares.' }, eq: ['[] : []'], a: [4, 3], parts: [4, 3], of: ['a', 'b'] },
          MR(1, 8, ['b', 'a'])]
      },
      think: {
        items: [{ q: '{b} says 3 : 5 and 5 : 3 mean the same thing. Is {b} right?', lines: { n: 3, key: 'No. 3 : 5 has 3 of the first thing for 5 of the second. 5 : 3 swaps them.' } },
          { q: 'Draw a picture for the ratio 1 : 3.', draw: { h: 50, key: 'For example 1 circle and 3 squares.' } },
          MR(8, 3, ['b', 'a']),
          { q: 'Write a sentence that uses the ratio 2 : 7.', lines: { n: 2, key: 'For example: There are 2 cups of juice for every 7 cups of water.' } }]
      }
    },

    'part-whole': {
      watch: 'using a part for the whole. The whole is both parts added: 4 apples and 6 oranges make 10 pieces of fruit.',
      goal: 'I can write part to part and part to whole ratios.',
      learn: {
        show: { pic: ['mix', { a: 4, b: 6 }], eq: ['circles to squares = 4 : 6', 'squares to all = 6 : 10'] },
        together: [MR(5, 2, ['a', 'b']), MR(5, 2, ['a', 'all'])],
        cue: 'The whole is both parts added.',
        own: [MR(3, 4, ['b', 'all']), MR(1, 6, ['a', 'all']), MR(7, 3, ['b', 'a'])]
      },
      p1: {
        show: { pic: ['mix', { a: 2, b: 3 }], cap: '2 + 3 = 5 shapes in all', eq: ['circles to all = 2 : 5'] },
        items: [MR(3, 1, ['a', 'all']), MR(4, 4, ['b', 'all']), MR(2, 7, ['a', 'all']), MR(6, 3, ['b', 'all']), MR(5, 5, ['a', 'b'])]
      },
      p2: {
        items: [SR('A {cont} has 4 green {many} and 5 yellow {many}. Green to all:', [4, 5], ['a', 'all']),
          SR('A team won 9 games and lost 6. Won to all games:', [9, 6], ['a', 'all']),
          SR('A garden has 7 tomato plants and 3 bean plants. Bean to all plants:', [7, 3], ['b', 'all']),
          SR('A bus has 15 children and 2 adults. Adults to all people:', [15, 2], ['b', 'all']),
          MR(3, 5, ['b', 'all']), MR(8, 2, ['a', 'b'])]
      },
      p3: {
        items: [SR('{a} picked 12 strawberries and 8 raspberries. Raspberries to all berries:', [12, 8], ['b', 'all']),
          SR('A canoe trip had 4 sunny days and 3 rainy days. Sunny to all days:', [4, 3], ['a', 'all']),
          SR('A box has 3 red pencils and 7 blue pencils. Blue to all:', [3, 7], ['b', 'all']),
          { q: 'Red to all is 3 : 10. What fraction is red?', eq: ['[]'], a: ['3/10'], calc: '3/10' },
          SR('A playlist has 6 songs in French and 9 in English. French to English:', [6, 9], ['a', 'b'])]
      },
      think: {
        items: [{ q: '{b} says 4 boys and 5 girls give a ratio of 4 : 5 for boys to all. What went wrong?', lines: { n: 3, key: '5 is the girls, a part. All the children is 4 + 5 = 9, so 4 : 9.' } },
          { q: 'How is a part to whole ratio like a fraction?', lines: { n: 3, key: 'Both compare a part to the whole: 3 : 10 and 3/10 mean 3 out of 10.' } },
          MR(6, 4, ['b', 'all']),
          { q: 'Make a bag where circles to all is 2 : 5. Draw it.', draw: { h: 40, key: '2 circles and 3 squares.' } }]
      }
    },

    equiv: {
      watch: 'adding the same number to both parts (2 : 3 = 4 : 5). Multiply or divide both parts by the same number.',
      goal: 'I can find equivalent ratios.',
      learn: {
        show: { pic: ['mix', { a: 2, b: 3, g: 3 }], cap: '3 groups of 2 : 3', eq: ['2 : 3 = 6 : 9'] },
        together: [{ pic: ['mix', { a: 1, b: 4, g: 2 }], eq: ['1 : 4 = 2 : []'], a: [8] }, EQ(3, 5, 2)],
        cue: 'Multiply both parts by the same number.',
        own: [EQ(2, 7, 3), EQ(4, 1, 5), EQ(6, 8, 0.5, true)]
      },
      p1: {
        show: { pic: ['mix', { a: 1, b: 2, g: 3 }], eq: ['1 : 2 = 3 : 6'] },
        items: [{ pic: ['mix', { a: 3, b: 1, g: 2 }], eq: ['3 : 1 = [] : 2'], a: [6] }, EQ(1, 3, 4), EQ(2, 5, 2), EQ(5, 4, 3), EQ(3, 2, 10)]
      },
      p2: {
        items: [EQ(4, 9, 2), EQ(7, 3, 4, true), EQ(10, 15, 0.2), EQ(12, 4, 0.25, true), EQ(6, 5, 5), EQ(8, 6, 0.5)]
      },
      p3: {
        items: [{ eq: ['2 : 5 = 4 : [] = 6 : []'], a: [10, 15], wide: true },
          { eq: ['3 : 4 = [] : 8 = [] : 40'], a: [6, 30], wide: true },
          story('A mix uses 2 cups of juice for 5 cups of water. How much water for 6 cups of juice?', 'cups', 15, '5 × 6 / 2'),
          { q: 'Which is equivalent to 4 : 6?', pick: { opts: ['2 : 3', '5 : 7', '6 : 4'], ans: 0, ratio: [4, 6] }, wide: true },
          { q: 'Which is not equivalent to 1 : 5?', pick: { opts: ['2 : 10', '3 : 15', '4 : 8'], ans: 2, ratio: [1, 5], not: true }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 2 : 3 = 4 : 5 because 2 was added to both. Is {b} right?', lines: { n: 3, key: 'No. Adding changes the mix. Double both: 2 : 3 = 4 : 6.' } },
          { q: 'Write three ratios equivalent to 3 : 1.', lines: { n: 1, key: '6 : 2, 9 : 3, 12 : 4 (any with the first part 3 times the second).' } },
          EQ(5, 2, 4),
          { q: 'Draw groups to show 1 : 2 = 3 : 6.', draw: { h: 50, key: '3 groups, each with 1 circle and 2 squares.' } }]
      }
    },

    rate: {
      watch: 'adding the rate only once, or mixing up the units. Per means for each 1: 80 km per hour is 80 km in each hour.',
      goal: 'I can use a rate.',
      learn: {
        show: { pic: ['table', { head: ['hours', 'km'], rows: [[1, 80], [2, 160], [3, 240]] }], eq: ['80 km per hour'] },
        together: [AT(12, 3, 'L'), TB(['minutes', 'L'], [[1, 12], [2, '[]'], [5, '[]']])],
        cue: 'Per means for each 1.',
        own: [AT(15, 4, 'km'), TB(['days', 'pages'], [[1, 20], [3, '[]'], [10, '[]']])]
      },
      p1: {
        show: { eq: ['4 km per hour', '5 hours: 5 × 4 = 20 km'] },
        items: [AT(8, 3, 'km'), AT(25, 4, 'cents'), AT(9, 6, 'L'), TB(['hours', '$'], [[1, 15], [2, '[]'], [4, '[]']]), AT(60, 2, 'km')]
      },
      p2: {
        items: [story('A bus goes 70 km per hour. How far in 3 hours?', 'km', 210, '70 × 3'),
          story('{a} reads 25 pages per day. How many pages in 6 days?', 'pages', 150, '25 × 6'),
          story('A tap drips 4 mL per minute. How much in 30 minutes?', 'mL', 120, '4 × 30'),
          story('Apples cost 60 cents each. How much for 7 apples?', 'cents', 420, '60 × 7'),
          TB(['{conts}', '{many}'], [[1, 6], [4, '[]'], [9, '[]']]),
          TB(['km', 'minutes'], [[1, 5], [3, '[]'], [10, '[]']])]
      },
      p3: {
        items: [story('A heart beats about 70 times per minute. About how many beats in 10 minutes?', 'beats', 700, '70 × 10'),
          story('A canoe goes 6 km per hour. How long to go 18 km?', 'hours', 3, '18 ÷ 6'),
          story('{b} earns $12 per hour. How many hours to earn $96?', 'hours', 8, '96 ÷ 12'),
          TB(['hours', 'km'], [[1, '[]'], [2, 90], [5, '[]']]),
          AT(45, 6, 'km')]
      },
      think: {
        items: [{ q: 'What does "45 km per hour" mean?', lines: { n: 2, key: 'In each hour, it goes 45 km.' } },
          { q: '{b} says at 5 km per hour you go 10 km in 5 hours. What went wrong?', lines: { n: 3, key: 'Each hour adds 5 km: 5 × 5 = 25 km, not 10.' } },
          AT(35, 4, 'km'),
          { q: 'Write a rate you see in real life.', lines: { n: 2, key: 'For example: $2 per litre, 60 km per hour, 3 meals per day.' } }]
      }
    },

    'unit-rate': {
      watch: 'dividing only one part. To find the rate for 1, divide both parts by the same number.',
      goal: 'I can find the rate for 1 and compare rates.',
      learn: {
        show: { pic: ['table', { head: ['hours', 'km'], rows: [[3, 45], [1, 15]] }], cap: 'divide both by 3', eq: ['45 ÷ 3 = 15 km per hour'] },
        together: [RT(60, 4, 'pages per day'), RT(36, 3, 'km per hour')],
        cue: 'Divide both parts by the number of units.',
        own: [RT(80, 5, 'L per minute'), Object.assign(RT(48, 6, '{many} per {cont}'), { wide: true }), RT(150, 10, 'km per hour')]
      },
      p1: {
        show: { eq: ['$12 for 4 tickets', '12 ÷ 4 = 3', '$3 per ticket'] },
        items: [RT(20, 4, '$ each'), RT(90, 3, 'km per hour'), RT(42, 7, 'pages per day'), Object.assign(RT(100, 5, 'mL per minute'), { wide: true }), Object.assign(RT(56, 8, '{many} per {cont}'), { wide: true })]
      },
      p2: {
        items: [story('{a} cycles 60 km in 4 hours. How far in 1 hour?', 'km', 15, '60 ÷ 4'),
          story('8 juice boxes cost $6. How much for 1?', 'dollars', 0.75, '6 ÷ 8'),
          story('A printer prints 72 pages in 6 minutes. How many pages per minute?', 'pages', 12, '72 ÷ 6'),
          story('{b} earns $54 in 6 hours. How much per hour?', 'dollars', 9, '54 ÷ 6'),
          RT(96, 8, 'km per hour'), RT(125, 5, 'L per minute')]
      },
      p3: {
        items: [{ q: 'Which is the better buy: 4 {many} for $8 or 6 {many} for $9?', pick: { opts: ['4 for $8', '6 for $9'], ans: 1, less: ['8 / 4', '9 / 6'] }, wide: true },
          { q: 'Who is faster: {a}, 30 km in 2 hours, or {b}, 48 km in 4 hours?', pick: { opts: ['{a}', '{b}'], ans: 0, more: ['30 / 2', '48 / 4'] }, wide: true },
          { q: 'Which is the better buy: 3 L for $6 or 5 L for $12?', pick: { opts: ['3 L for $6', '5 L for $12'], ans: 0, less: ['6 / 3', '12 / 5'] }, wide: true },
          story('5 tickets cost $35. How much for 8 tickets?', 'dollars', 56, '35 ÷ 5 × 8'),
          story('A car uses 6 L of gas for 90 km. How far on 10 L?', 'km', 150, '90 ÷ 6 × 10')]
      },
      think: {
        items: [{ q: '{b} says 6 for $9 costs more than 4 for $8 because $9 is more. What would you tell {b}?', lines: { n: 3, key: 'Find the price for 1: $9 ÷ 6 = $1.50 and $8 ÷ 4 = $2. So 6 for $9 is cheaper each.' } },
          { q: 'Why is the rate for 1 useful?', lines: { n: 3, key: 'It lets you compare two deals or speeds fairly, and find any amount by multiplying.' } },
          RT(84, 7, 'km per hour'),
          { q: 'Who reads faster: {a}, 40 pages in 2 days, or {b}, 70 pages in 5 days?', pick: { opts: ['{a}', '{b}'], ans: 0, more: ['40 / 2', '70 / 5'] }, wide: true }]
      }
    },

    recipe: {
      watch: 'doing a step to one row only. Whatever you do to one amount, do to the other.',
      goal: 'I can solve problems with a ratio table.',
      learn: {
        show: { pic: ['table', { head: ['eggs', 'cups of flour'], rows: [[2, 3], [4, 6], [8, 12]] }], cap: 'double, then double again' },
        together: [TB(['eggs', 'cups of milk'], [[3, 2], [6, '[]'], [9, '[]']]), TB(['{conts}', '{many}'], [[2, 10], [1, '[]'], [5, '[]']])],
        cue: 'Find the step from what you know to what you want. Do the same step to both amounts.',
        own: [TB(['laps', 'minutes'], [[2, 7], [4, '[]'], [10, '[]']]), TB(['bannock', 'cups of flour'], [[1, 3], [2, '[]'], [5, '[]']])]
      },
      p1: {
        show: { pic: ['table', { head: ['days', 'km'], rows: [[2, 30], [1, 15], [3, 45]] }], cap: 'halve, then times 3' },
        items: [TB(['cups of rice', 'cups of water'], [[1, 2], [3, '[]'], [5, '[]']]), TB(['{conts}', '{many}'], [[3, 12], [6, '[]'], [1, '[]']]),
          TB(['hours', '$'], [[2, 24], [1, '[]'], [4, '[]']]), TB(['tickets', '$'], [[4, 20], [2, '[]'], [8, '[]']])]
      },
      p2: {
        items: [TB(['L of syrup', 'L of sap'], [[1, 40], [2, '[]'], [5, '[]']]), TB(['batches', 'cookies'], [[3, 36], [1, '[]'], [5, '[]']]),
          TB(['scoops', 'cups'], [[4, 6], [2, '[]'], [10, '[]']]), TB(['km', 'minutes'], [[5, 20], [10, '[]'], [15, '[]']])]
      },
      p3: {
        items: [story('A recipe uses 3 cups of flour for every 2 eggs. How much flour for 10 eggs?', 'cups', 15, '3 × 10 / 2'),
          story('{a} mixes 2 cans of blue paint for every 5 cans of white. How much white for 8 cans of blue?', 'cans', 20, '5 × 8 / 2'),
          story('It takes 40 L of sap to make 1 L of maple syrup. How much sap for 3 L?', 'L', 120, '40 × 3'),
          TB(['people', 'cups of soup'], [[4, 6], [2, '[]'], [10, '[]']])]
      },
      think: {
        items: [{ q: '{b} filled in a table: 2 eggs, 3 cups; 4 eggs, 5 cups. What went wrong?', lines: { n: 3, key: '{b} added 2 to each. The eggs doubled, so the flour must double too: 6 cups.' } },
          { q: 'How can a ratio table help you find the amount for 1?', lines: { n: 3, key: 'Divide both amounts by the same number until the first one is 1.' } },
          TB(['{conts}', '{many}'], [[5, 35], [1, '[]'], [7, '[]']])]
      }
    }
  } });
})();
