/* Grade 5 Multiplying and Dividing: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/multiply-divide.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.1 properties and checking, B2.2 facts to 12 × 12, B2.6 multiplying two-digit numbers,
   B2.7 dividing by two-digit numbers and remainders. The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* r × c as an array cut after `cut` rows: the two easy facts, then the whole fact */
  function SP(r, c, cut) {
    return { pic: ['array', { r: r, c: c, split: cut }], eq: [cut + ' × ' + c + ' = []', (r - cut) + ' × ' + c + ' = []', r + ' × ' + c + ' = []'], a: [cut * c, (r - cut) * c, r * c] };
  }
  /* the same split without a picture */
  function SPW(r, c, cut) {
    return { q: 'Split ' + r + ' into ' + cut + ' and ' + (r - cut) + '.', eq: [cut + ' × ' + c + ' + ' + (r - cut) + ' × ' + c + ' = []', r + ' × ' + c + ' = []'], a: [r * c, r * c] };
  }
  /* a page-wide block of facts in 3 columns: list of [a, op, b] (op '×' or '÷'); 'first' puts the box first */
  function FA(list) {
    var eq = [], a = [];
    list.forEach(function (f) {
      var r = f[1] === '×' ? f[0] * f[2] : f[0] / f[2];
      if (f[3] === 'first') { eq.push('[] ' + f[1] + ' ' + f[2] + ' = ' + r); a.push(f[0]); } else { eq.push(f[0] + ' ' + f[1] + ' ' + f[2] + ' = []'); a.push(r); }
    });
    return { eq: eq, a: a, cols: 3, wide: true };
  }
  /* 9 × n or 11 × n from the friendly ten */
  function NINE(n) { return { eq: ['10 × ' + n + ' = []', '9 × ' + n + ' = [] − ' + n + ' = []'], a: [10 * n, 10 * n, 9 * n] }; }
  function ELEVEN(n) { return { eq: ['10 × ' + n + ' = []', '11 × ' + n + ' = [] + ' + n + ' = []'], a: [10 * n, 10 * n, 11 * n] }; }
  /* double one factor and halve the other */
  function DH(x, y) { return { q: 'Double and halve.', eq: [x + ' × ' + y + ' = [] × []', x + ' × ' + y + ' = []'], a: [x * 2, y / 2, x * y] }; }
  /* the area model of a × b: the part products, then the whole */
  function AM(a, b) {
    var pa = S.parts(a), pb = S.parts(b), prods = [];
    pa.forEach(function (x) { pb.forEach(function (y) { prods.push(x * y); }); });
    return { pic: ['amodel', { a: a, b: b }], eq: [a + ' × ' + b + ' = []'], a: prods.concat([a * b]) };
  }
  /* the standard algorithm for a × b */
  function AL(a, b) {
    var bd = String(b).split('').reverse(), lines = bd.length > 1 ? bd.map(function (d, i) { return a * +d * Math.pow(10, i); }) : [];
    return { pic: ['mult', { a: a, b: b }], a: lines.concat([a * b]) };
  }
  /* a story with one answer box; calc is the sum the answer check works out */
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* t ÷ d by chunks: take out c groups first, then the rest (mode 'pic': draw the chunks; 'short': leave out the middle step) */
  function CH(t, d, c, mode) {
    var rest = t - c * d;
    var it = { q: 'Take out ' + c + ' groups of ' + d + ' first.', eq: [t + ' − ' + c * d + ' = []', rest + ' ÷ ' + d + ' = []', t + ' ÷ ' + d + ' = []'], a: [rest, rest / d, t / d] };
    if (mode === 'pic') it.pic = ['chunks', { t: t, d: d, steps: [c, rest / d] }];
    if (mode === 'short') { it.eq.splice(1, 1); it.a.splice(1, 1); }
    return it;
  }
  /* t ÷ d with a remainder */
  function RM(t, d) { return { eq: [t + ' ÷ ' + d + ' = [] R []'], a: [Math.floor(t / d), t % d] }; }
  /* a remainder story: way 'up' (the leftovers need their own group) or 'down' (they are not enough) */
  function RS(q, t, d, unit, way) {
    var qt = Math.floor(t / d), r = t % d;
    return { q: q, eq: [t + ' ÷ ' + d + ' = [] R []', '[] ' + unit], a: [qt, r, way === 'up' && r ? qt + 1 : qt], rem: way };
  }
  /* a right or wrong statement to circle */
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }

  S.register('multiply-divide', { code: 'MD', ideas: {

    'break-apart': {
      watch: 'adding the two parts of the split number instead of the two products (7 × 8 = 5 × 8 + 2). Point to each part of the array.',
      goal: 'I can split a hard fact into two easier facts.',
      learn: {
        show: { pic: ['array', { r: 7, c: 8, split: 5 }], eq: ['5 × 8 = 40', '2 × 8 = 16', '7 × 8 = 56'] },
        together: [SP(6, 7, 5), SP(8, 6, 5)],
        cue: 'Cut at 5 or 10. Work out each part, then add the parts.',
        own: [SPW(12, 6, 10), SPW(8, 8, 5)]
      },
      p1: {
        show: { pic: ['array', { r: 6, c: 6, split: 5 }], cap: '6 rows of 6', eq: ['5 × 6 + 1 × 6', '30 + 6 = 36'] },
        items: [SP(6, 8, 5), SP(7, 6, 5), SPW(11, 4, 10), SPW(12, 3, 10)]
      },
      p2: {
        items: [SP(9, 7, 5), SPW(12, 8, 10), SPW(7, 9, 5),
          story('{a} packs 12 {conts} with 8 {many} in each. How many {many}?', '{many}', 96, '12 × 8'),
          FA([[6, '×', 8], [7, '×', 9], [12, '×', 6], [8, '×', 9], [11, '×', 8], [12, '×', 7]])]
      },
      p3: {
        items: [SPW(12, 9, 10), SPW(8, 12, 5),
          FA([[12, '×', 12], [9, '×', 8], [11, '×', 12], [7, '×', 12], [56, '÷', 7], [72, '÷', 9], [84, '÷', 12], [96, '÷', 8], [132, '÷', 11]]),
          story('{b} has 9 {conts} with 12 {many} in each. How many {many}?', '{many}', 108, '9 × 12'),
          { q: 'Use 7 × 8 = 56.', eq: ['56 ÷ 7 = []', '56 ÷ 8 = []'], a: [8, 7] }]
      },
      think: {
        items: [{ q: 'Show two different ways to split 8 × 7.', draw: { h: 110, key: 'For example: 5 × 7 + 3 × 7 = 35 + 21 = 56, or 4 × 7 + 4 × 7 = 28 + 28 = 56.' } },
          { q: '{b} wrote 6 × 9 = 5 × 9 + 1 = 46. What went wrong?', lines: { n: 3, key: '{b} added 1, not 1 × 9. 45 + 9 = 54.' } },
          { q: 'Why is 10 a good place to cut 12 × 7?', lines: { n: 3, key: '10 × 7 = 70 is easy, and 2 × 7 = 14 is easy. 70 + 14 = 84.' } },
          { eq: ['12 × 9 = 10 × 9 + [] × 9', '12 × 9 = []'], a: [2, 108], wide: true }]
      }
    },

    friendly: {
      watch: 'taking away 1 instead of one group (9 × 6 = 60 − 1). One whole column of 6 comes off.',
      goal: 'I can use a friendly ten to work out 9s and 11s.',
      learn: {
        show: { pic: ['array', { r: 10, c: 6, split: 9 }], cap: '10 rows of 6, take away one row', eq: ['10 × 6 = 60', '9 × 6 = 60 − 6 = 54'] },
        together: [NINE(7), ELEVEN(6)],
        cue: '9 × n is 10 × n take away one n. 11 × n is 10 × n and one more n.',
        own: [NINE(4), ELEVEN(8), NINE(12), ELEVEN(9)]
      },
      p1: {
        show: { cap: '11 × 7', eq: ['10 × 7 = 70', '70 + 7 = 77'] },
        items: [NINE(3), NINE(5), ELEVEN(3), ELEVEN(5), NINE(8), ELEVEN(7)]
      },
      p2: {
        items: [NINE(11), ELEVEN(12), DH(15, 12), DH(25, 8),
          FA([[9, '×', 6], [11, '×', 11], [9, '×', 9], [11, '×', 4], [9, '×', 7], [12, '×', 11]]),
          story('{a} has 11 {conts} with 9 {many} in each. How many {many}?', '{many}', 99, '11 × 9')]
      },
      p3: {
        items: [DH(35, 4), DH(16, 5),
          FA([[9, '×', 12], [11, '×', 12], [99, '÷', 9], [108, '÷', 12], [9, '×', 4, 'first'], [11, '×', 6, 'first'], [45, '÷', 5], [121, '÷', 11], [12, '×', 12]]),
          story('{b} fills 9 {conts}. Each {cont} holds 12 {many}. How many {many}?', '{many}', 108, '9 × 12'),
          { q: 'Use 10 × 12 = 120.', eq: ['9 × 12 = []', '11 × 12 = []'], a: [108, 132] }]
      },
      think: {
        items: [{ q: '{b} says 9 × 8 = 80 − 1 = 79. What went wrong?', lines: { n: 3, key: '{b} took away 1, not one group of 8. 80 − 8 = 72.' } },
          { q: 'Draw an array to show why 11 × 5 = 50 + 5.', draw: { h: 100, key: 'An array of 11 rows of 5: 10 rows make 50 and one more row makes 5.' } },
          { q: 'Explain how to work out 9 × 12 in your head.', lines: { n: 3, key: '10 × 12 = 120. Take away one 12: 120 − 12 = 108.' } },
          { q: 'Which is more?', pick: { opts: ['9 × 11', '10 × 10'], ans: 1, big: true }, wide: true }]
      }
    },

    model: {
      watch: 'multiplying only the tens by tens and the ones by ones (23 × 14 = 200 + 12). Every part times every part: 4 boxes.',
      goal: 'I can multiply two-digit numbers with an area model.',
      learn: {
        show: { pic: ['amodel', { a: 23, b: 14, fill: true }], eq: ['200 + 30 + 80 + 12', '23 × 14 = 322'] },
        together: [AM(21, 13), AM(32, 12)],
        cue: 'Estimate first. Split both numbers by place value, multiply every part, then add.',
        own: [AM(24, 11), AM(31, 15)]
      },
      p1: {
        show: { pic: ['amodel', { a: 32, b: 15, fill: true }], eq: ['300 + 20 + 150 + 10', '32 × 15 = 480'] },
        items: [AM(12, 13), AM(21, 14), AM(23, 12), AM(31, 11)]
      },
      p2: {
        items: [AM(27, 14), AM(36, 21), AM(45, 13), AM(52, 16),
          story('{a} sets out 24 {conts} with 15 {many} in each. How many {many}?', '{many}', 360, '24 × 15'),
          { q: 'Estimate 38 × 21. Circle the closest.', pick: { opts: ['80', '800', '8000'], ans: 1, est: '38 × 21' } }]
      },
      p3: {
        items: [AM(47, 23), AM(64, 35), AM(78, 19), AM(56, 42),
          story('{b} fills 36 {conts}. Each holds 24 {many}. How many {many}?', '{many}', 864, '36 × 24'),
          story('A hall has 28 rows of 35 seats. How many seats?', 'seats', 980, '28 × 35')]
      },
      think: {
        items: [{ q: '{b} wrote 23 × 14 = 200 + 12 = 212. What went wrong?', lines: { n: 3, key: '{b} left out 3 × 10 = 30 and 20 × 4 = 80. The answer is 322.' } },
          { q: 'Draw an area model for 46 × 25.', draw: { h: 110, key: ['amodel', { a: 46, b: 25, fill: true }] }, eq: ['46 × 25 = []'], a: [1150] },
          { q: 'Why should you estimate before you multiply?', lines: { n: 3, key: 'To check the answer makes sense. 46 × 25 is about 50 × 25 = 1250, so 1150 is close.' } },
          { q: 'Find the missing number.', eq: ['30 × [] + 4 × 12 = 34 × 12', '34 × 12 = []'], a: [12, 408], wide: true }]
      }
    },

    algorithm: {
      watch: 'forgetting the 0 at the end of the second line (writing 23 instead of 230). The 1 in 14 is one ten.',
      goal: 'I can multiply two-digit numbers with the standard algorithm.',
      learn: {
        show: { cap: '23 × 14, one line for each digit of 14', eq: ['23 × 4 = 92', '23 × 10 = 230', '92 + 230 = 322'] },
        together: [AL(21, 13), AL(32, 12)],
        cue: 'Line 1: times the ones. Line 2: times the tens, so it ends in 0. Add the lines.',
        own: [AL(24, 12), AL(31, 15)]
      },
      p1: {
        show: { cap: '26 × 13', eq: ['26 × 3 = 78', '26 × 10 = 260', '78 + 260 = 338'] },
        items: [AL(13, 12), AL(22, 14), AL(34, 12), AL(41, 13)]
      },
      p2: {
        items: [AL(36, 24), AL(47, 15), AL(53, 26), AL(64, 18),
          story('A box holds 36 {many}. How many {many} in 25 boxes?', '{many}', 900, '25 × 36'),
          story('A bus route is 48 km long. The bus drives it 12 times. How many kilometres is that?', 'km', 576, '12 × 48')]
      },
      p3: {
        items: [AL(78, 46), AL(85, 37), AL(69, 54), AL(97, 28),
          story('{b} stacks 75 {conts} with 48 {many} in each. How many {many}?', '{many}', 3600, '75 × 48'),
          story('A school buys 64 boxes of 25 pencils. How many pencils?', 'pencils', 1600, '64 × 25')]
      },
      think: {
        items: [{ q: '{b} worked out 34 × 12 and got 102. What went wrong?', lines: { n: 3, key: '{b} wrote 34 for 34 × 10, not 340. 68 + 340 = 408.' } },
          { q: 'Match each line of 45 × 23 to a row of an area model.', draw: { h: 110, key: '135 = 45 × 3 is the row 120 + 15. 900 = 45 × 20 is the row 800 + 100. Total 1035.' } },
          { q: 'Estimate 58 × 31. Is 17 980 a sensible answer? Why?', lines: { n: 3, key: 'No. 58 × 31 is about 60 × 30 = 1800. The real answer is 1798.' } },
          { q: 'Which is more?', pick: { opts: ['39 × 41', '40 × 40'], ans: 1, big: true }, wide: true }]
      }
    },

    chunks: {
      watch: 'stopping with a leftover bigger than the divisor. Ask: "Does one more group fit?"',
      goal: 'I can divide by a two-digit number in friendly chunks.',
      learn: {
        show: { pic: ['chunks', { t: 372, d: 12, steps: [30, 1] }], eq: ['372 − 360 = 12', '30 + 1 = 31'] },
        together: [CH(264, 12, 20, 'pic'), CH(345, 15, 20, 'pic')],
        cue: 'Take out chunks of 10 or 20 groups first. Add up the groups. Check by multiplying.',
        own: [CH(286, 13, 20, 'short'), CH(437, 19, 20, 'short')]
      },
      p1: {
        show: { pic: ['chunks', { t: 425, d: 17, steps: [20, 5] }], eq: ['425 ÷ 17 = 20 + 5 = 25'] },
        items: [CH(252, 12, 20, 'pic'), CH(165, 11, 10, 'pic'), CH(294, 14, 20), CH(195, 13, 10)]
      },
      p2: {
        items: [CH(414, 18, 20), CH(575, 23, 20), CH(744, 24, 30), CH(806, 31, 20),
          story('{a} shares 336 {many} into 14 equal {conts}. How many in each?', '{many}', 24, '336 ÷ 14'),
          story('{b} packs 480 {many} with 20 in each {cont}. How many {conts}?', '{conts}', 24, '480 ÷ 20')]
      },
      p3: {
        items: [{ eq: ['672 ÷ 32 = []', '918 ÷ 27 = []'], a: [21, 34] }, { eq: ['756 ÷ 18 = []', '875 ÷ 25 = []'], a: [42, 35] },
          { q: 'Check with ×.', eq: ['32 × 21 = []', '27 × 34 = []'], a: [672, 918] },
          story('A school has 828 students in classes of 23. How many classes?', 'classes', 36, '828 ÷ 23'),
          story('{a} has 945 {many} to put in 45 {conts}, the same in each. How many in each {cont}?', '{many}', 21, '945 ÷ 45'),
          story('A 960 m trail has a marker every 15 m. How many gaps between markers?', 'gaps', 64, '960 ÷ 15')]
      },
      think: {
        items: [{ q: '{b} worked out 384 ÷ 16 by taking 16 groups of 16. Show a faster first chunk.', lines: { n: 3, key: 'Take 20 groups first: 20 × 16 = 320. 384 − 320 = 64 = 4 × 16. 20 + 4 = 24.' } },
          { q: 'Estimate 589 ÷ 19. Explain.', lines: { n: 3, key: '19 is about 20 and 589 is about 600. 600 ÷ 20 = 30. (The real answer is 31.)' } },
          { q: 'Write a story for 360 ÷ 24.', lines: { n: 3, key: 'For example: {a} shares 360 {many} into 24 {conts}. Each {cont} gets 15.' } },
          { q: 'Find the missing number.', eq: ['[] × 25 = 650', '650 ÷ 25 = []'], a: [26, 26], wide: true }]
      }
    },

    leftovers: {
      watch: 'writing "R 10" without asking what the 10 means in the story. Ask: do the leftovers need their own group?',
      goal: 'I can decide what to do with a remainder.',
      learn: {
        show: { pic: ['shareR', { t: 14, g: 4 }], cap: '14 shared into 4: 3 each, 2 left over', eq: ['14 ÷ 4 = 3 R 2'] },
        together: [{ pic: ['shareR', { t: 17, g: 5 }], eq: ['17 ÷ 5 = [] R []'], a: [3, 2] },
          RS('100 people ride vans. Each van holds 8 people. How many vans do they need?', 100, 8, 'vans', 'up')],
        cue: 'Leftovers need their own group: round up. Leftovers are not enough: drop them.',
        own: [RM(250, 24),
          RS('{a} packs 100 {many} into {conts} of 12. How many full {conts}?', 100, 12, 'full {conts}', 'down')]
      },
      p1: {
        show: { pic: ['shareR', { t: 11, g: 3 }], cap: '11 shared into 3', eq: ['11 ÷ 3 = 3 R 2'] },
        items: [{ pic: ['shareR', { t: 13, g: 4 }], eq: ['13 ÷ 4 = [] R []'], a: [3, 1] }, { pic: ['shareR', { t: 16, g: 5 }], eq: ['16 ÷ 5 = [] R []'], a: [3, 1] },
          RM(50, 12), RM(75, 11),
          RS('30 people ride in cars. Each car holds 4. How many cars?', 30, 4, 'cars', 'up'),
          RS('{b} has 45 {many} and fills {conts} of 6. How many full {conts}?', 45, 6, 'full {conts}', 'down')]
      },
      p2: {
        items: [RM(200, 15), RM(345, 22),
          RS('{a} bakes 150 cookies and packs boxes of 12. How many full boxes?', 150, 12, 'boxes', 'down'),
          RS('A camp has 130 campers. Each tent holds 6. How many tents?', 130, 6, 'tents', 'up'),
          RS('{b} has 500 {many}. Each {cont} holds 32. How many {conts} to hold them all?', 500, 32, '{conts}', 'up'),
          RS('A roll has 400 cm of ribbon. Each bow takes 35 cm. How many bows?', 400, 35, 'bows', 'down')]
      },
      p3: {
        items: [RM(612, 25), RM(983, 41),
          RS('A ferry takes 48 cars a trip. 290 cars wait. How many trips?', 290, 48, 'trips', 'up'),
          RS('{a} has $350. A pass costs $45. How many passes can {a} buy?', 350, 45, 'passes', 'down'),
          RS('745 people come to a show. Each row has 28 seats. How many rows are needed?', 745, 28, 'rows', 'up'),
          RS('A bag of 820 g of rice makes bowls of 75 g. How many full bowls?', 820, 75, 'bowls', 'down')]
      },
      think: {
        items: [{ q: '250 ÷ 24 = 10 R 10. Write one story where the answer is 10 and one where it is 11.', lines: { n: 4, key: '10: 250 stickers, 24 on each sheet, how many full sheets? 11: 250 people, 24 per bus, how many buses?' } },
          { q: '{b} says 100 ÷ 8 = 11 R 12. What went wrong?', lines: { n: 3, key: 'The remainder 12 is more than 8, so one more group fits. 100 ÷ 8 = 12 R 4.' } },
          { q: 'Check 345 ÷ 22 = 15 R 15 by multiplying back.', eq: ['22 × 15 + 15 = []'], a: [345] },
          { q: '125 cm of string is cut into 4 equal pieces. Could each piece be 31 cm and a bit? Explain.', lines: { n: 3, key: 'Yes. 125 ÷ 4 = 31 R 1. The leftover 1 cm can be cut and shared, so each piece is a little more than 31 cm.' } }]
      }
    },

    properties: {
      watch: 'not checking a division answer. Make multiplying back a habit: divisor × quotient + remainder = total.',
      goal: 'I can use any order and grouping, and check division by multiplying.',
      learn: {
        show: { pic: ['array', { r: 4, c: 6 }], cap: '4 rows of 6 is 6 rows of 4', eq: ['4 × 25 × 37', '= 100 × 37 = 3700'] },
        together: [{ q: 'Do the friendly pair first.', eq: ['5 × 2 = []', '5 × 19 × 2 = []'], a: [10, 190] },
          { q: 'Check by multiplying back.', eq: ['252 ÷ 12 = []', '12 × [] = 252'], a: [21, 21] }],
        cue: 'Any order, any grouping. Find a pair that makes 10 or 100.',
        own: [{ eq: ['4 × 13 × 25 = []'], a: [1300] }, { eq: ['2 × 47 × 5 = []'], a: [470] },
          TF('6 × 8 = 8 × 6', true), { q: 'Check: 156 ÷ 12 = 13', eq: ['12 × 13 = []'], a: [156] }]
      },
      p1: {
        show: { cap: '25 × 7 × 4', eq: ['25 × 4 = 100', '100 × 7 = 700'] },
        items: [{ eq: ['5 × 9 × 2 = []'], a: [90] }, { eq: ['25 × 3 × 4 = []'], a: [300] }, TF('7 × 9 = 9 × 7', true), TF('20 ÷ 4 = 4 ÷ 20', false),
          { q: 'Check: 96 ÷ 8 = 12', eq: ['8 × 12 = []'], a: [96] }, { eq: ['2 × 36 × 5 = []'], a: [360] }]
      },
      p2: {
        items: [{ eq: ['4 × 17 × 25 = []'], a: [1700] }, { eq: ['50 × 9 × 2 = []'], a: [900] },
          TF('(3 × 4) × 5 = 3 × (4 × 5)', true), TF('(24 ÷ 4) ÷ 2 = 24 ÷ (4 ÷ 2)', false),
          { q: 'Check: 345 ÷ 15 = 23', eq: ['15 × 23 = []'], a: [345] }, { q: 'Check: 200 ÷ 15 = 13 R 5', eq: ['15 × 13 + 5 = []'], a: [200] }]
      },
      p3: {
        items: [{ eq: ['25 × 14 × 4 = []'], a: [1400] }, { eq: ['5 × 48 × 20 = []'], a: [4800] },
          { eq: ['12 × 5 = 6 × []', '18 × 5 = 9 × []'], a: [10, 10] }, TF('8 × 25 = 2 × 100', true),
          { q: 'Check: 612 ÷ 25 = 24 R 12', eq: ['25 × 24 + 12 = []'], a: [612] },
          { q: '{a} says 437 ÷ 19 = 23. Check with ×.', eq: ['19 × 23 = []'], a: [437] }]
      },
      think: {
        items: [{ q: 'Find a quick way to work out 4 × 7 × 5 × 5. Show it.', lines: { n: 3, key: '4 × 5 × 5 = 100 first, then 100 × 7 = 700.' } },
          { q: 'Does order matter for division? Give an example.', lines: { n: 3, key: 'Yes. 12 ÷ 3 = 4 but 3 ÷ 12 is less than 1.' } },
          { q: '{b} says 300 ÷ 14 = 21 R 6. Is {b} right? Check it.', eq: ['14 × 21 + 6 = []'], a: [300], pick: { opts: ['right', 'wrong'], ans: 0 }, pickLast: true, tf: '14 × 21 + 6 = 300' },
          { q: 'Which is more?', pick: { opts: ['2 × 49 × 5', '4 × 24 × 5'], ans: 0, big: true }, wide: true }]
      }
    }
  } });
})();
