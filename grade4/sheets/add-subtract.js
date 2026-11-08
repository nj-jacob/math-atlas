/* Grade 4 Adding and Subtracting: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/add-subtract.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.1 the link between + and −, checking and missing numbers, B2.4 adding and subtracting whole numbers
   to 10 000, including the column method. The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* a column sum: every digit of the answer is a box */
  function COL(x, y, op) { var r = op === '+' ? x + y : x - y; return { pic: ['col', { a: x, b: y, op: op }], a: String(r).split('').map(Number) }; }
  function SUM(x, y, op) { return { eq: [x + ' ' + (op === '+' ? '+' : '−') + ' ' + y + ' = []'], a: [op === '+' ? x + y : x - y] }; }
  /* a page-wide block of sums in 2 columns: [x, op, y] */
  function FA(list) { return { eq: list.map(function (f) { return S.fmt(f[0]) + ' ' + (f[1] === '+' ? '+' : '−') + ' ' + f[2] + ' = []'; }), a: list.map(function (f) { return f[1] === '+' ? f[0] + f[2] : f[0] - f[2]; }), cols: 2, wide: true }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  /* circle the closest estimate of a sum */
  function EST(sum, opts, ans) { return { q: 'Circle the best estimate of ' + sum + '.', pick: { opts: opts.map(String), ans: ans, est: sum } }; }
  /* a subtraction checked by adding back */
  function BACK(x, y) { return { eq: [x + ' − ' + y + ' = []', '[] + ' + y + ' = []'], a: [x - y, x - y, x] }; }

  S.register('add-subtract', { code: 'AS', ideas: {

    'same-places': {
      watch: 'adding a ones digit to a tens digit when the numbers have different lengths. Line up the ones first.',
      goal: 'I can add by putting the same places together.',
      learn: {
        show: { cap: 'Ones with ones, tens with tens, hundreds with hundreds', eq: ['2000 + 300 + 50 + 4 = 2354', '1243 + 1111 = 2354'] },
        together: [{ eq: ['3000 + 2000 = []', '400 + 100 = []', '3400 + 2100 = []'], a: [5000, 500, 5500] }, { eq: ['20 + 50 = []', '6 + 3 = []', '26 + 53 = []'], a: [70, 9, 79] }],
        cue: 'Add the same places. 10 of a place trade for 1 of the next place.',
        own: [SUM(2314, 1253, '+'), SUM(4120, 3405, '+'), SUM(1032, 6, '+'), SUM(5600, 2300, '+')]
      },
      p1: {
        show: { cap: 'Add each place', eq: ['3000 + 1000 = 4000', '3200 + 1400 = 4600'] },
        items: [SUM(1200, 3400, '+'), SUM(2010, 1050, '+'), SUM(4321, 1111, '+'), SUM(6005, 2003, '+'), SUM(350, 420, '+'), SUM(7100, 1800, '+')]
      },
      p2: {
        items: [FA([[2345, '+', 1432], [6013, '+', 2504], [4600, '+', 3200], [1234, '+', 25], [5050, '+', 4040], [3700, '+', 210]]),
          story('{a} has 2340 {many}. {b} has 1520 {many}. How many in all?', '{many}', 3860, '2340 + 1520'),
          { eq: ['[] + 2000 = 6500'], a: [4500] }, TF('3204 + 1030 = 4234', true),
          { q: 'Trade 10 tens.', eq: ['60 + 40 = []', '360 + 240 = []'], a: [100, 600] },
          story('A school collects 4105 cans. Another collects 3062. How many cans in all?', 'cans', 7167, '4105 + 3062')]
      },
      p3: {
        items: [FA([[3456, '+', 2321], [4508, '+', 1490], [2075, '+', 7123], [6340, '+', 3060], [1999, '+', 1], [5555, '+', 4444]]),
          { eq: ['[] + 3050 = 8750'], a: [5700] },
          story('A library has 4230 books and buys 1508 more. How many books now?', 'books', 5738, '4230 + 1508'),
          { eq: ['2500 + 2500 + 2500 = []'], a: [7500], wide: true }, TF('4300 + 600 = 5000', false),
          story('{b} counts 3125 {many} on Monday and 2614 on Tuesday. How many {many}?', '{many}', 5739, '3125 + 2614')]
      },
      think: {
        items: [{ q: '{b} added 2316 + 52 and got 7516. What went wrong?', lines: { n: 3, key: '{b} lined up the 5 under the thousands. Ones under ones: 2316 + 52 = 2368.' } },
          { q: 'Find two 4-digit numbers that add to 5000.', lines: { n: 2, key: 'For example: 2500 + 2500, 1999 + 3001, 4000 + 1000.' } },
          { q: 'Why do we add ones with ones?', lines: { n: 3, key: 'Each digit means a different amount; only the same places can be put together.' } },
          { eq: ['3000 + [] + 40 = 3740'], a: [700] }]
      }
    },

    carry: {
      watch: 'writing 13 in one column, or forgetting the carried 1. Ask: "Does each column have only one digit? Did you add the small 1?"',
      goal: 'I can add with the column method and carry.',
      learn: {
        show: { pic: ['col', { a: 2758, b: 1365, op: '+' }], cap: 'Ones: 8 + 5 = 13. Write 3, carry 1.', eq: ['2758 + 1365 = 4123'] },
        together: [COL(1457, 2326, '+'), COL(3648, 1275, '+')],
        cue: 'Start with the ones. 10 or more? Write the ones digit and carry 1.',
        own: [COL(2519, 1243, '+'), COL(4086, 2735, '+'), SUM(1678, 3254, '+'), SUM(5390, 2840, '+')]
      },
      p1: {
        show: { pic: ['col', { a: 1316, b: 2427, op: '+' }], cap: '6 + 7 = 13: write 3, carry 1', eq: ['1316 + 2427 = 3743'] },
        items: [COL(2318, 1425, '+'), COL(3604, 2147, '+'), COL(1250, 3460, '+'), COL(4125, 1386, '+'), SUM(2709, 2163, '+'), SUM(5032, 1859, '+')]
      },
      p2: {
        items: [COL(3478, 2856, '+'), COL(4593, 1769, '+'), COL(2885, 3527, '+'), COL(6194, 2908, '+'),
          story('{a} has 2785 {many}. {b} brings 1946 more. How many {many} now?', '{many}', 4731, '2785 + 1946'),
          story('A rink sells 3658 tickets on Friday and 2874 on Saturday. How many tickets?', 'tickets', 6532, '3658 + 2874')]
      },
      p3: {
        items: [FA([[4789, '+', 3654], [2998, '+', 5867], [1859, '+', 6278], [3496, '+', 4708], [5675, '+', 3399], [7777, '+', 1999]]),
          COL(3967, 2948, '+'), COL(6489, 2853, '+'),
          story('A farm picks 4875 apples and then 3967 more. How many apples?', 'apples', 8842, '4875 + 3967'),
          TF('2789 + 1456 = 3245', false)]
      },
      think: {
        items: [{ q: '{b} added 2758 + 1365 and got 31 113. What went wrong?', lines: { n: 3, key: '{b} wrote 13 and 11 in columns. Write the ones digit and carry 1: 4123.' } },
          { q: 'Find a sum with exactly two carries.', lines: { n: 2, key: 'For example: 1258 + 1164 = 2422 (carry in the ones and the tens).' } },
          { q: 'Estimate first, then add 3896 + 2109.', eq: ['4000 + 2000 = []', '3896 + 2109 = []'], a: [6000, 6005] },
          { q: 'Explain what the carried 1 is worth when you carry from the tens.', lines: { n: 3, key: '10 tens make 1 hundred, so the carried 1 is worth 100.' } }]
      }
    },

    trade: {
      watch: 'taking the smaller digit from the bigger one in every column. Ask which digit is on top before subtracting.',
      goal: 'I can break a ten or hundred to take away.',
      learn: {
        show: { cap: '52 − 18: break a ten into 10 ones', eq: ['40 + 12 − 18', '52 − 18 = 34'] },
        together: [{ q: 'Break a ten.', eq: ['63 = 50 + []', '63 − 27 = []'], a: [13, 36] }, { q: 'Break a hundred.', eq: ['425 = 300 + []', '425 − 180 = []'], a: [125, 245] }],
        cue: 'Not enough to take away? Break 1 of the next place into 10.',
        own: [SUM(74, 38, '−'), SUM(91, 46, '−'), SUM(352, 170, '−'), SUM(640, 290, '−')]
      },
      p1: {
        show: { cap: '43 − 17: break a ten', eq: ['43 = 30 + 13', '43 − 17 = 26'] },
        items: [SUM(52, 27, '−'), SUM(81, 45, '−'), SUM(60, 34, '−'), SUM(240, 160, '−'), SUM(315, 120, '−'), SUM(73, 59, '−')]
      },
      p2: {
        items: [SUM(452, 237, '−'), SUM(618, 349, '−'), SUM(1340, 520, '−'), SUM(2050, 830, '−'),
          story('{a} has 532 {many} and gives away 185. How many are left?', '{many}', 347, '532 − 185'),
          { eq: ['84 = 70 + []', '84 − 39 = []'], a: [14, 45] }]
      },
      p3: {
        items: [SUM(725, 468, '−'), SUM(903, 547, '−'), SUM(1432, 685, '−'), SUM(3210, 1450, '−'),
          story('{b} has 1250 {many}. 675 are sold. How many are left?', '{many}', 575, '1250 − 675'), TF('62 − 28 = 46', false)]
      },
      think: {
        items: [{ q: '{b} says 52 − 18 = 46. What went wrong?', lines: { n: 3, key: '{b} did 8 − 2 in the ones. Break a ten: 12 − 8 = 4, 4 − 1 = 3: 34.' } },
          { q: 'Draw blocks to show 43 − 26.', draw: { h: 110, key: '4 tens and 3 ones; break a ten into 10 ones, take away 2 tens and 6 ones: 17.' } },
          { q: 'Breaking a ten does not change the number. Show why with 63.', lines: { n: 3, key: '63 = 6 tens 3 ones = 5 tens 13 ones. 50 + 13 = 63.' } },
          SUM(800, 365, '−')]
      }
    },

    columns: {
      watch: 'subtracting top from bottom when the top digit is smaller. Trade first, then take away.',
      goal: 'I can subtract with the column method.',
      learn: {
        show: { pic: ['col', { a: 5243, b: 1628, op: '−' }], cap: 'Ones: 3 − 8? Trade a ten.', eq: ['5243 − 1628 = 3615'] },
        together: [COL(4352, 1127, '−'), COL(6514, 2381, '−')],
        cue: 'Start with the ones. Top digit smaller? Trade 1 from the left for 10.',
        own: [COL(3741, 1526, '−'), COL(5862, 2475, '−'), SUM(7425, 3163, '−'), SUM(8316, 4708, '−')]
      },
      p1: {
        show: { pic: ['col', { a: 4562, b: 2135, op: '−' }], cap: '2 − 5? Trade a ten', eq: ['4562 − 2135 = 2427'] },
        items: [COL(3654, 1231, '−'), COL(5872, 2340, '−'), COL(4561, 1238, '−'), COL(6374, 3152, '−'), SUM(7283, 4165, '−'), SUM(2945, 1527, '−')]
      },
      p2: {
        items: [COL(6352, 2784, '−'), COL(8143, 3567, '−'), COL(5214, 1879, '−'), COL(9421, 4635, '−'),
          story('A town has 6250 people. 1875 are children. How many are adults?', 'adults', 4375, '6250 − 1875'),
          story('{a} has 3412 {many}. {b} has 1876. How many more does {a} have?', '{many}', 1536, '3412 − 1876')]
      },
      p3: {
        items: [FA([[8432, '−', 3657], [7215, '−', 2849], [6124, '−', 3586], [9352, '−', 4768], [5431, '−', 2675], [8000, '−', 3999]]),
          COL(7342, 4589, '−'), COL(9213, 5647, '−'),
          story('A canoe trip is 9125 m. The group has gone 4768 m. How far is left?', 'm', 4357, '9125 − 4768'), TF('6342 − 2875 = 3467', true)]
      },
      think: {
        items: [{ q: '{b} found 5243 − 1628 = 4625. What went wrong?', lines: { n: 3, key: '{b} took 3 from 8 in the ones. Trade a ten: 13 − 8 = 5, and so on: 3615.' } },
          { q: 'Check 6352 − 2784 = 3568 by adding back.', eq: ['3568 + 2784 = []'], a: [6352] },
          { q: 'Write a subtraction that needs 3 trades.', lines: { n: 2, key: 'For example: 5432 − 1789 (ones, tens and hundreds all trade).' } },
          { q: 'When do you NOT need to trade?', lines: { n: 2, key: 'When every top digit is as big as the digit below it.' } }]
      }
    },

    zeros: {
      watch: 'changing a 0 into 10 and leaving it there, or forgetting the thousands. In 5003 − 1758 the top reads 4, 9, 9, 13.',
      goal: 'I can subtract when the top number has zeros.',
      learn: {
        show: { pic: ['col', { a: 5003, b: 1758, op: '−' }], cap: 'Go left to the 5, then trade down: 4, 9, 9, 13', eq: ['5003 − 1758 = 3245'] },
        together: [COL(4002, 1365, '−'), COL(3000, 1247, '−')],
        cue: 'Next place is 0? Go left to the first digit and trade down one place at a time. The zeros become 9s.',
        own: [COL(6005, 2348, '−'), COL(7000, 3456, '−'), SUM(2040, 1275, '−'), SUM(8100, 4637, '−')]
      },
      p1: {
        show: { pic: ['col', { a: 300, b: 126, op: '−' }], cap: '3 hundreds become 2 hundreds, 9 tens, 10 ones', eq: ['300 − 126 = 174'] },
        items: [COL(400, 135, '−'), COL(500, 248, '−'), COL(603, 275, '−'), COL(1000, 456, '−'), SUM(2005, 1347, '−'), SUM(800, 359, '−')]
      },
      p2: {
        items: [COL(4000, 1825, '−'), COL(6003, 2476, '−'), COL(5020, 3184, '−'), COL(9000, 4567, '−'),
          story('{a} had 3000 {many} and gave 1468 away. How many are left?', '{many}', 1532, '3000 − 1468'),
          story('A trail is 5000 m. {b} has walked 2375 m. How far is left?', 'm', 2625, '5000 − 2375')]
      },
      p3: {
        items: [FA([[7000, '−', 2368], [8004, '−', 4597], [6000, '−', 1], [5030, '−', 2786], [9100, '−', 6458], [10000, '−', 5555]]),
          COL(7006, 3849, '−'), COL(4000, 2999, '−'),
          story('A rink holds 8000 people. 5326 are there. How many more can come in?', 'people', 2674, '8000 − 5326'),
          TF('4000 − 1 = 3999', true)]
      },
      think: {
        items: [{ q: '{b} found 5003 − 1758 = 4355. What went wrong?', lines: { n: 3, key: '{b} took the smaller digit from the bigger one. Trade across the zeros: 3245.' } },
          { q: 'Use a trick: 5000 − 1758 = 4999 − 1757. Why does it work?', lines: { n: 3, key: 'Both numbers went down by 1, so the difference is the same, and 4999 needs no trades.' } },
          { eq: ['6000 − [] = 2475'], a: [3525] },
          { q: 'Write your own subtraction with two zeros on top and solve it.', lines: { n: 2, key: 'For example: 3004 − 1567 = 1437.' } }]
      }
    },

    friendly: {
      watch: 'moving an amount from one number but not adding it to the other. The total must stay the same.',
      goal: 'I can make a friendly number to add in my head.',
      learn: {
        show: { cap: 'Move 2 from 1534 to make 3000', eq: ['2998 + 1534 = 3000 + 1532', '2998 + 1534 = 4532'] },
        together: [{ eq: ['1999 + 2450 = 2000 + []', '1999 + 2450 = []'], a: [2449, 4449], wide: true }, { eq: ['3995 + 1206 = 4000 + []', '3995 + 1206 = []'], a: [1201, 5201], wide: true }],
        cue: 'Close to a thousand? Move a little to make the thousand, then add the rest.',
        own: [SUM(2999, 1345, '+'), SUM(4998, 2003, '+'), SUM(1997, 3600, '+'), SUM(5990, 1250, '+')]
      },
      p1: {
        show: { cap: 'Move 1 to make 100', eq: ['99 + 45 = 100 + 44'] },
        items: [{ eq: ['99 + 36 = 100 + []'], a: [35] }, { eq: ['198 + 25 = 200 + []'], a: [23] }, SUM(999, 300, '+'), SUM(1998, 400, '+'),
          SUM(2999, 1500, '+'), SUM(498, 350, '+')]
      },
      p2: {
        items: [{ eq: ['2997 + 1456 = 3000 + []', '2997 + 1456 = []'], a: [1453, 4453], wide: true }, SUM(3999, 2678, '+'), SUM(4995, 3410, '+'), SUM(1996, 5302, '+'),
          story('{a} has 1998 {many}. {b} brings 2635 more. How many {many}?', '{many}', 4633, '1998 + 2635'), SUM(6999, 2999, '+')]
      },
      p3: {
        items: [FA([[2999, '+', 3478], [4997, '+', 1823], [5998, '+', 3005], [1995, '+', 6280], [3990, '+', 4567], [7999, '+', 1999]]),
          { eq: ['6000 − 1998 = 6002 − []', '6000 − 1998 = []'], a: [2000, 4002], wide: true },
          story('A store sells 2995 pucks in May and 3480 in June. How many pucks?', 'pucks', 6475, '2995 + 3480'),
          SUM(8996, 1004, '+'), TF('3998 + 2500 = 4000 + 2498', true)]
      },
      think: {
        items: [{ q: '{b} says 2998 + 1534 = 3000 + 1534 = 4534. What went wrong?', lines: { n: 3, key: '{b} added 2 to 2998 but did not take 2 from 1534: 3000 + 1532 = 4532.' } },
          { q: 'Which is easier in your head: 4999 + 2386 or 2386 + 4999? Why?', lines: { n: 3, key: 'Either; the order does not change the sum. Make 5000 from 4999 and add 2385.' } },
          { q: 'Show a friendly-number way for 3996 + 1785.', lines: { n: 3, key: '4000 + 1781 = 5781.' } },
          SUM(5997, 3003, '+')]
      }
    },

    'count-up': {
      watch: 'counting the number of jumps (3) instead of adding their sizes, or skipping the small first jump.',
      goal: 'I can subtract by counting up.',
      learn: {
        show: { cap: '3000 − 2847: count up from 2847', eq: ['3 + 150 = 153', '3000 − 2847 = 153'] },
        together: [{ q: 'Count up from 1960 to 2000, then to 2500.', eq: ['40 + 500 = []', '2500 − 1960 = []'], a: [540, 540] },
          { q: 'Count up from 3875 to 3900, then to 5000.', eq: ['25 + 1100 = []', '5000 − 3875 = []'], a: [1125, 1125] }],
        cue: 'The difference is the distance. Jump up to friendly numbers and add the jumps.',
        own: [SUM(2000, 1975, '−'), SUM(4000, 3650, '−'), SUM(3010, 2990, '−'), SUM(6000, 5875, '−')]
      },
      p1: {
        show: { cap: 'Count up from 97 to 100, then to 120', eq: ['3 + 20 = 23', '120 − 97 = 23'] },
        items: [SUM(100, 96, '−'), SUM(200, 185, '−'), SUM(1000, 990, '−'), SUM(500, 475, '−'), SUM(1010, 995, '−'), SUM(2000, 1950, '−')]
      },
      p2: {
        items: [SUM(5000, 4820, '−'), SUM(3002, 2996, '−'), SUM(7000, 6745, '−'), SUM(4100, 3950, '−'),
          story('{a} has 1980 {many} and wants 3000. How many more {many} are needed?', '{many}', 1020, '3000 − 1980'),
          story('{b} was born in 2016. How old is {b} in 2026?', 'years', 10, '2026 − 2016')]
      },
      p3: {
        items: [FA([[8000, '−', 7865], [6003, '−', 5997], [9500, '−', 8750], [4000, '−', 2985], [7010, '−', 6980], [10000, '−', 9875]]),
          story('A canoe race is 5000 m. {a} has gone 3750 m. How far to go?', 'm', 1250, '5000 − 3750'),
          story('The CN Tower opened in 1976. How many years until 2026?', 'years', 50, '2026 − 1976'),
          SUM(6000, 4995, '−'), TF('3000 − 2875 = 125', true)]
      },
      think: {
        items: [{ q: '{b} counts up from 2847 to 3000 with 3 jumps and says the answer is 3. What went wrong?', lines: { n: 3, key: '{b} counted the jumps. Add their sizes: 3 + 50 + 100 = 153.' } },
          { q: 'When is counting up easier than the column method?', lines: { n: 3, key: 'When the numbers are close, or the top number is a friendly number like 3000.' } },
          { q: 'Draw jumps on a line for 4000 − 3680.', draw: { h: 90, key: '3680 → 3700 (20) → 4000 (300): 320.' } },
          SUM(9001, 8999, '−')]
      }
    },

    estimate: {
      watch: 'rounding only one number, or rounding the exact answer after working it out. The estimate comes first.',
      goal: 'I can estimate before I add or subtract.',
      learn: {
        show: { cap: 'Round each to the nearest thousand', eq: ['3000 + 2000 = 5000', '2874 + 2105 = 4979'] },
        together: [{ q: 'Estimate 3912 + 1876.', eq: ['4000 + 2000 = []'], a: [6000] }, { q: 'Estimate 6150 − 2930.', eq: ['6000 − 3000 = []'], a: [3000] }],
        cue: 'Round each number, then add or subtract. The answer should land close.',
        own: [EST('4890 + 3120', [7000, 8000, 9000], 1), EST('7050 − 1980', [5000, 6000, 9000], 0), { q: 'Estimate 2350 + 1460 (nearest hundred).', eq: ['2400 + 1500 = []'], a: [3900] }, EST('5980 + 2010', [7000, 8000, 3000], 1)]
      },
      p1: {
        show: { cap: '2100 + 3900: round first', eq: ['2000 + 4000 = 6000'] },
        items: [{ q: 'Estimate 1900 + 3100.', eq: ['2000 + 3000 = []'], a: [5000] }, { q: 'Estimate 6200 − 1800.', eq: ['6000 − 2000 = []'], a: [4000] },
          EST('2950 + 4080', [6000, 7000, 8000], 1), EST('8100 − 2900', [5000, 6000, 11000], 0), { q: 'Estimate 410 + 290.', eq: ['400 + 300 = []'], a: [700] }, EST('5050 + 3970', [8000, 9000, 10000], 1)]
      },
      p2: {
        items: [EST('3820 + 4175', [7000, 8000, 9000], 1), EST('9120 − 3890', [5000, 6000, 7000], 0), EST('2490 + 2520', [4000, 5000, 6000], 1),
          { q: 'Estimate, then find the exact answer.', eq: ['5000 + 3000 = []', '4876 + 2953 = []'], a: [8000, 7829] },
          { q: '{b} says 3205 + 2896 = 4101. Estimate. Is {b} close?', eq: ['3000 + 3000 = []'], a: [6000], lines: { n: 1, key: 'No. The answer should be near 6000. It is 6101.' } },
          EST('1980 + 3040', [4000, 5000, 6000], 1)]
      },
      p3: {
        items: [EST('6985 + 2040', [8000, 9000, 10000], 1), EST('8460 − 4510', [3000, 4000, 5000], 1),
          { q: 'Estimate, then find the exact answer.', eq: ['7000 − 4000 = []', '7123 − 3876 = []'], a: [3000, 3247] },
          { q: 'Estimate to the nearest hundred, then find it exactly.', eq: ['3500 + 2400 = []', '3480 + 2365 = []'], a: [5900, 5845] },
          EST('4999 + 4999', [8000, 9000, 10000], 2), EST('2905 + 3110', [5000, 6000, 7000], 1)]
      },
      think: {
        items: [{ q: '{b} adds 2874 + 2105 and gets 7979. How could an estimate catch the mistake?', lines: { n: 3, key: '3000 + 2000 = 5000, far from 7979, so the answer must be checked: 4979.' } },
          { q: 'When is an estimate good enough?', lines: { n: 3, key: 'For example: to see if you have enough money, or how many buses are about right.' } },
          { q: 'Find two numbers whose sum rounds to 6000 but are not near 3000 each.', lines: { n: 2, key: 'For example: 5100 + 900, 4800 + 1200.' } },
          EST('3499 + 3499', [6000, 7000, 8000], 1)]
      }
    },

    inverse: {
      watch: 'checking by doing the same subtraction again. Adding back takes a different path, so it catches slips.',
      goal: 'I can check a subtraction by adding back.',
      learn: {
        show: { cap: 'Check by adding back', eq: ['5243 − 1628 = 3615', '3615 + 1628 = 5243'] },
        together: [BACK(4562, 2135), BACK(7300, 2450)],
        cue: 'Answer + amount taken away = start number.',
        own: [BACK(3826, 1514), BACK(6100, 3250), BACK(8045, 2678), BACK(5000, 1234)]
      },
      p1: {
        show: { cap: 'Add back to check', eq: ['900 − 300 = 600', '600 + 300 = 900'] },
        items: [BACK(800, 350), BACK(1500, 700), BACK(2460, 1230), BACK(5200, 1100), BACK(3650, 2400), BACK(9000, 4500)]
      },
      p2: {
        items: [{ q: 'Check it: 4231 − 1876 = 2355.', eq: ['2355 + 1876 = []'], a: [4231], pick: { opts: ['right', 'wrong'], ans: 0 }, tf: '4231 − 1876 = 2355', pickLast: true },
          { q: 'Check it: 6040 − 2785 = 3365.', eq: ['3365 + 2785 = []'], a: [6150], pick: { opts: ['right', 'wrong'], ans: 1 }, tf: '6040 − 2785 = 3365', pickLast: true },
          BACK(7315, 4268), BACK(5004, 2687), { q: 'Write the subtraction that 2400 + 1600 = 4000 checks.', eq: ['4000 − 1600 = []'], a: [2400] },
          { q: 'Write the subtraction that 3125 + 875 = 4000 checks.', eq: ['4000 − 875 = []'], a: [3125] }]
      },
      p3: {
        items: [{ q: 'Check it: 8213 − 4657 = 3556.', eq: ['3556 + 4657 = []'], a: [8213], pick: { opts: ['right', 'wrong'], ans: 0 }, tf: '8213 − 4657 = 3556', pickLast: true },
          { q: 'Check it: 7002 − 3568 = 3544.', eq: ['3544 + 3568 = []'], a: [7112], pick: { opts: ['right', 'wrong'], ans: 1 }, tf: '7002 − 3568 = 3544', pickLast: true },
          BACK(9120, 5486), BACK(6003, 4999), { eq: ['[] − 2750 = 4250'], a: [7000] }, { eq: ['[] − 1386 = 2614'], a: [4000] }]
      },
      think: {
        items: [{ q: 'Why is adding back a better check than subtracting again?', lines: { n: 3, key: 'If you make the same slip twice it looks right twice. Adding back takes a different path.' } },
          { q: '{b} says 6040 − 2785 = 3365. Check it, and fix it if needed.', eq: ['3365 + 2785 = []', '6040 − 2785 = []'], a: [6150, 3255] },
          { q: 'Write a fact family for 2500, 1500 and 4000.', lines: { n: 3, key: '2500 + 1500 = 4000, 1500 + 2500 = 4000, 4000 − 1500 = 2500, 4000 − 2500 = 1500.' } },
          { q: 'How could you check an addition?', lines: { n: 2, key: 'Subtract one part from the total: you should get the other part.' } }]
      }
    },

    missing: {
      watch: 'adding the two numbers you see whatever is missing. Ask: is the missing number the whole or a part?',
      goal: 'I can find a missing number in an addition or subtraction.',
      learn: {
        show: { cap: 'The whole is 6000; one part is 2500', eq: ['2500 + [?] = 6000', '6000 − 2500 = 3500'] },
        together: [{ eq: ['1800 + [] = 5000'], a: [3200] }, { eq: ['[] − 1250 = 3750'], a: [5000] }],
        cue: 'Missing a part? Whole − the part you know. Missing the whole? Add the parts.',
        own: [{ eq: ['[] + 3400 = 7000'], a: [3600] }, { eq: ['6500 − [] = 4000'], a: [2500] }, { eq: ['[] − 2100 = 1900'], a: [4000] }, { eq: ['4250 + [] = 9000'], a: [4750] }]
      },
      p1: {
        show: { cap: 'Whole − part = other part', eq: ['500 + [?] = 800', '800 − 500 = 300'] },
        items: [{ eq: ['300 + [] = 1000'], a: [700] }, { eq: ['[] + 600 = 900'], a: [300] }, { eq: ['1000 − [] = 400'], a: [600] }, { eq: ['[] − 200 = 500'], a: [700] },
          { eq: ['2000 + [] = 5000'], a: [3000] }, { eq: ['[] − 1000 = 4000'], a: [5000] }]
      },
      p2: {
        items: [{ eq: ['3456 + [] = 5000'], a: [1544] }, { eq: ['[] − 1275 = 2725'], a: [4000] }, { eq: ['8000 − [] = 3640'], a: [4360] }, { eq: ['[] + 2789 = 6000'], a: [3211] },
          story('{a} had some {many}, then got 1250 more. Now {a} has 4000. How many at first?', '{many}', 2750, '4000 − 1250'),
          story('{b} needs 6000 {many} and has 3875. How many more are needed?', '{many}', 2125, '6000 − 3875')]
      },
      p3: {
        items: [{ eq: ['[] + 4567 = 9000'], a: [4433] }, { eq: ['7210 − [] = 2965'], a: [4245] }, { eq: ['[] − 3999 = 4001'], a: [8000] }, { eq: ['1250 + [] + 1250 = 5000'], a: [2500], wide: true },
          story('A bus had some people. 1350 got off and 2650 were left. How many at first?', 'people', 4000, '2650 + 1350'),
          story('{a} had 5000 {many} and gave some away. 3125 are left. How many were given away?', '{many}', 1875, '5000 − 3125')]
      },
      think: {
        items: [{ q: '{b} solved [] − 1250 = 3750 by doing 3750 − 1250 = 2500. What went wrong?', lines: { n: 3, key: 'The box is the whole. Add the parts: 3750 + 1250 = 5000.' } },
          { q: 'Draw a bar model for 2400 + [] = 6000.', draw: { h: 100, key: 'A bar of 6000 split into 2400 and the missing part, 3600.' } },
          { q: 'Write a story for 4000 − [] = 1500.', lines: { n: 3, key: 'For example: {a} had 4000 {many}, gave some away, and has 1500 left. 2500 were given away.' } },
          { q: 'Find two numbers that add to 1000. Any two will do.', eq: ['[] + [] = 1000'], a: [600, 400] }]
      }
    },

    which: {
      watch: 'choosing the operation from a key word ("left" means subtract). Ask: "Which bar has the question mark: the whole or a part?"',
      goal: 'I can decide whether to add or subtract.',
      learn: {
        show: { cap: 'Is the missing number the whole or a part?', eq: ['2400 + 1600 = [?]', '4000 − 2400 = [?]'] },
        together: [{ q: '{a} has 2450 {many}. {b} has 1320. How many in all?', eq: ['[] {many}'], a: [3770], calc: '2450 + 1320', pick: { opts: ['+', '−'], ans: 0 }, pickLast: true },
          { q: '{a} has 2450 {many}. {b} has 1320. How many more does {a} have?', eq: ['[] {many}'], a: [1130], calc: '2450 − 1320', pick: { opts: ['+', '−'], ans: 1 }, pickLast: true }],
        cue: 'Whole unknown: add. Part unknown: subtract.',
        own: [story('A school has 1245 girls and 1180 boys. How many students?', 'students', 2425, '1245 + 1180'),
          story('A rink has 3000 seats. 2165 are full. How many are empty?', 'seats', 835, '3000 − 2165'),
          story('{b} had some {many} and got 300 more. Now there are 900. How many at first?', '{many}', 600, '900 − 300'),
          story('A trail has 2 parts: 1650 m and 2350 m. How long is it?', 'm', 4000, '1650 + 2350')]
      },
      p1: {
        show: { cap: 'Find the whole: add the parts', eq: ['300 + 500 = 800'] },
        items: [story('{a} has 400 {many} and gets 300 more. How many now?', '{many}', 700, '400 + 300'),
          story('{b} has 900 {many} and gives away 200. How many are left?', '{many}', 700, '900 − 200'),
          story('A box has 1000 {many}. 600 are used. How many are left?', '{many}', 400, '1000 − 600'),
          story('Two classes read 1200 and 1500 pages. How many pages?', 'pages', 2700, '1200 + 1500'),
          story('{a} needs 800 {many} and has 500. How many more?', '{many}', 300, '800 − 500'),
          story('A town has 2000 adults and 1000 children. How many people?', 'people', 3000, '2000 + 1000')]
      },
      p2: {
        items: [story('{a} had some {many}, then got 450 more. Now {a} has 1200. How many at first?', '{many}', 750, '1200 − 450'),
          story('{b} has 2350 {many}. That is 875 fewer than {a}. How many does {a} have?', '{many}', 3225, '2350 + 875'),
          story('A plane flies 1875 km, then 2340 km. How far in all?', 'km', 4215, '1875 + 2340'),
          story('A fundraiser needs $5000. It has $3685. How much more?', 'dollars', 1315, '5000 − 3685'),
          story('A farm had 4250 {many}. Some were sold and 2875 are left. How many were sold?', '{many}', 1375, '4250 − 2875'),
          story('{a} walked 2650 m in the morning and 1875 m later. How far?', 'm', 4525, '2650 + 1875')]
      },
      p3: {
        items: [story('{b} gave away 1275 {many} and has 3725 left. How many at first?', '{many}', 5000, '1275 + 3725'),
          story('Lake A is 3248 m wide. Lake B is 1975 m wider. How wide is Lake B?', 'm', 5223, '3248 + 1975'),
          story('A library had 8000 books. After a sale it has 6345. How many were sold?', 'books', 1655, '8000 − 6345'),
          story('{a} has 4560 {many}, 1385 more than {b}. How many does {b} have?', '{many}', 3175, '4560 − 1385'),
          story('A rink sold 2875 tickets Friday and 3460 Saturday. How many more on Saturday?', 'tickets', 585, '3460 − 2875'),
          story('A town had 6835 people. 1290 moved in. How many people now?', 'people', 8125, '6835 + 1290')]
      },
      think: {
        items: [{ q: '"{a} had some cards, then got 30 more and now has 90." {b} adds 30 + 90. What went wrong?', lines: { n: 3, key: 'The start is the missing part. 90 − 30 = 60.' } },
          { q: 'Write an addition story and a subtraction story with 1500 and 2500.', lines: { n: 4, key: 'For example: 1500 + 2500 = 4000 {many} in all; 2500 − 1500 = 1000 more.' } },
          { q: 'Draw a bar model for: {b} has 3200 {many}, 800 more than {a}. How many does {a} have?', draw: { h: 100, key: 'Two bars: {b} 3200, {a} shorter by 800. 3200 − 800 = 2400.' } },
          { q: 'Why can the word "more" mean subtract?', lines: { n: 3, key: '"How many more" asks for a difference, which is a subtraction.' } }]
      }
    },

    'two-step': {
      watch: 'stopping after the first step, or using the first answer in the wrong place. Underline the question, then plan the 2 steps.',
      goal: 'I can solve a problem in two steps.',
      learn: {
        show: { cap: '{a} has 2500, gets 1200, gives 900', eq: ['2500 + 1200 = 3700', '3700 − 900 = 2800'] },
        together: [{ q: '{a} has 1500 {many}, gets 2000 more, then gives away 750. How many now?', eq: ['1500 + 2000 = []', '[] − 750 = []'], a: [3500, 3500, 2750] },
          { q: 'A rink has 5000 seats. 2300 adults and 1800 children come. How many are empty?', eq: ['2300 + 1800 = []', '5000 − [] = []'], a: [4100, 4100, 900] }],
        cue: 'Step 1, then use that answer in step 2. Estimate to check.',
        own: [story('{b} has 3000 {many}, sells 1200 and buys 500. How many now?', '{many}', 2300, '3000 − 1200 + 500'),
          story('A school needs 5000 cans. It has 1250 and 1750. How many more?', 'cans', 2000, '5000 − (1250 + 1750)'),
          story('A set has 1000 pages. {a} reads 450 and 380. How many are left?', 'pages', 170, '1000 − (450 + 380)'),
          story('6000 people lived in a town. 800 left and 1250 came. How many now?', 'people', 6450, '6000 − 800 + 1250')]
      },
      p1: {
        show: { cap: 'Add, then subtract', eq: ['400 + 300 = 700', '700 − 200 = 500'] },
        items: [story('{a} has 200 {many}, gets 300, then gives 100. How many now?', '{many}', 400, '200 + 300 − 100'),
          story('{b} has 1000 {many}. 300 go in one {cont} and 400 in another. How many are left?', '{many}', 300, '1000 − 300 − 400'),
          story('A bag holds 500 {many}. {a} fills 2 bags and adds 100. How many?', '{many}', 1100, '500 + 500 + 100'),
          story('A trail is 2000 m. {b} walks 800 m and 700 m. How far is left?', 'm', 500, '2000 − 800 − 700'),
          story('{a} has $900, earns $200 and spends $500. How much now?', 'dollars', 600, '900 + 200 − 500'),
          story('A shelf has 300 books. 120 are taken and 50 come back. How many now?', 'books', 230, '300 − 120 + 50')]
      },
      p2: {
        items: [story('{a} has 2450 {many}, gets 1325, then gives away 1500. How many now?', '{many}', 2275, '2450 + 1325 − 1500'),
          story('A rink has 4000 seats. 1875 adults and 1340 children come. How many seats are empty?', 'seats', 785, '4000 − (1875 + 1340)'),
          story('{b} saves $1250 and $875. A canoe costs $2500. How much more is needed?', 'dollars', 375, '2500 − (1250 + 875)'),
          story('A farm has 3600 {many}. 1450 are sold and 2000 more grow. How many now?', '{many}', 4150, '3600 − 1450 + 2000'),
          story('Two schools have 1265 and 1480 students. 500 go on a trip. How many stay?', 'students', 2245, '1265 + 1480 − 500'),
          story('{a} has 5000 {many}. {a} gives 1250 to {b} and 1250 to a friend. How many are left?', '{many}', 2500, '5000 − 1250 − 1250')]
      },
      p3: {
        items: [story('A library has 6250 books. It buys 1875 and gives away 2360. How many now?', 'books', 5765, '6250 + 1875 − 2360'),
          story('A town of 8000 has 3456 adults and 2875 seniors. The rest are children. How many children?', 'children', 1669, '8000 − (3456 + 2875)'),
          story('{b} needs 9000 {many}. {b} has 2768 and gets 3485. How many more are needed?', '{many}', 2747, '9000 − (2768 + 3485)'),
          story('A canoe trip is 7500 m. Day 1 is 2875 m and day 2 is 2950 m. How far on day 3?', 'm', 1675, '7500 − (2875 + 2950)'),
          story('{a} has 4325 {many}, sells 1980, then buys 2655. How many now?', '{many}', 5000, '4325 − 1980 + 2655'),
          story('A rink sold 3250 tickets Friday and 2875 Saturday. The goal was 7000. How many short?', 'tickets', 875, '7000 − (3250 + 2875)')]
      },
      think: {
        items: [{ q: 'Write your own two-step story and solve it.', lines: { n: 4, key: 'For example: {a} has 1000 {many}, gets 500 and gives 300. 1000 + 500 − 300 = 1200.' } },
          { q: '{b} answered 4100 to: "A rink has 5000 seats. 2300 adults and 1800 children come. How many are empty?" What went wrong?', lines: { n: 3, key: '{b} stopped after step 1. 5000 − 4100 = 900 are empty.' } },
          { q: 'Estimate first: 2875 + 3120 − 1980.', eq: ['3000 + 3000 − 2000 = []', '2875 + 3120 − 1980 = []'], a: [4000, 4015], wide: true },
          { q: 'Does the order of the steps matter in 5000 − 1250 − 1250? Explain.', lines: { n: 3, key: 'No: take away 1250 twice either way, or 2500 at once. 2500 is left.' } }]
      }
    }
  } });
})();
