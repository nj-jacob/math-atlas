/* Grade 1 Tens and Ones: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the
   lessons in chapters/tens-ones.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.2 compose and decompose numbers to 50 (tens and ones); B1.3 compare and order numbers to 50.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function BL(t, o) { return ['blocks', { h: 0, t: t, o: o }]; }
  /* blocks: the number they make */
  function B(t, o, q) { return { q: q, pic: BL(t, o), eq: ['[]'], a: [10 * t + o] }; }
  /* blocks: tens, ones and the number */
  function BT(t, o) { return { pic: BL(t, o), eq: ['[] tens [] ones = []'], a: [t, o, 10 * t + o] }; }
  /* a number into tens and ones */
  function TO(n) { return { eq: [n + ' = [] tens [] ones'], a: [Math.floor(n / 10), n % 10] }; }
  /* tens and ones into a number */
  function NT(t, o) { return { eq: [t + ' tens ' + o + ' ones = []'], a: [10 * t + o] }; }
  /* the value of each digit */
  function DV(n) { var t = Math.floor(n / 10), o = n % 10; return { eq: ['The ' + t + ' in ' + n + ' is worth []'], a: [10 * t], dv: { n: n, d: t } }; }
  function DO(n) { var o = n % 10; return { eq: ['The ' + o + ' in ' + n + ' is worth []'], a: [o], dv: { n: n, d: o } }; }
  /* 10 more and 10 less */
  function MO(n) { return { eq: [n + ' + 10 = []'], a: [n + 10] }; }
  function LE(n) { return { eq: [n + ' − 10 = []'], a: [n - 10] }; }
  function ML(n) { return { q: '10 less, then 10 more.', eq: ['[], ' + n + ', []'], a: [n - 10, n + 10], by: 10 }; }
  /* a number as tens plus ones */
  function PT(n) { return { eq: [n + ' = [] + []'], a: [n - n % 10, n % 10], expanded: true }; }
  function MS(n, part) { return { eq: [n + ' = ' + part + ' + []'], a: [n - part] }; }
  /* trade a ten for 10 ones */
  function TR(n, t) { return { eq: [n + ' = ' + t + ' tens [] ones'], a: [n - 10 * t] }; }
  /* the greater (or less) number */
  function BG(list) { return { q: 'Circle the greater number.', pick: { opts: list.map(String), ans: list.indexOf(Math.max.apply(null, list)), big: true } }; }
  function SM(list) { return { q: 'Circle the number that is less.', pick: { opts: list.map(String), ans: list.indexOf(Math.min.apply(null, list)), small: true } }; }
  /* order from least to greatest */
  function OR(list, wide) { var s = list.slice().sort(function (x, y) { return x - y; }); return { q: 'Order from least to greatest: ' + list.join(', '), eq: [s.map(function () { return '[]'; }).join(' < ')], a: s, set: list, wide: wide }; }
  /* a number line with a dot to name, or numbers to write under ticks */
  function NL(min, max, pt) { return { q: 'What number is at the dot?', pic: ['nl', { min: min, max: max, tick: 1, lab: 5, pt: pt, ptl: '?' }], eq: ['[]'], a: [pt] }; }
  function NA(min, max, ask, lab) { return { q: 'Write the missing numbers.', pic: ['nl', { min: min, max: max, tick: 1, lab: lab || 5, ask: ask }], a: ask }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }

  S.register('tens-ones', { code: 'TO', ideas: {

    'make-ten': {
      watch: 'calling a ten rod "1". A rod is 1 ten and also 10 ones. Count its cubes once to be sure.',
      goal: 'I can make a ten from 10 ones.',
      learn: {
        show: { pic: BL(1, 0), cap: '10 ones make 1 ten', eq: ['10 ones = 1 ten'] },
        together: [{ pic: ['dots', { t: 10 }], eq: ['[] ones = 1 ten'], a: [10] }, { pic: ['tenframe', { a: 10, b: 2 }], eq: ['1 ten [] ones = []'], a: [2, 12] }],
        cue: 'Count 10 ones. Bundle them. Now it is 1 ten.',
        own: [NT(1, 0), NT(1, 4), NT(2, 0), { eq: ['20 = [] tens'], a: [2] }]
      },
      p1: { show: { pic: ['tenframe', { a: 10, b: 0 }], eq: ['10 = 1 ten'] }, items: [{ pic: ['tenframe', { a: 10, b: 3 }], eq: ['1 ten [] ones = []'], a: [3, 13] }, { pic: ['tenframe', { a: 10, b: 6 }], eq: ['1 ten [] ones = []'], a: [6, 16] }, NT(1, 1), NT(1, 8), { eq: ['10 ones = [] ten'], a: [1] }, { eq: ['30 = [] tens'], a: [3] }] },
      p2: { items: [NT(1, 9), NT(2, 5), NT(3, 0), { eq: ['40 = [] tens'], a: [4] }, { eq: ['50 = [] tens'], a: [5] }, story('{a} has 10 {many} in a {cont} and 7 more. How many?', '{many}', 17, '10 + 7')] },
      p3: { items: [{ eq: ['[] ones = 2 tens'], a: [20] }, { eq: ['[] ones = 4 tens'], a: [40] }, story('{b} has 30 {many}. {b} puts 10 in each {cont}. How many {conts}?', '{conts}', 3, '30 ÷ 10'), story('{a} fills 4 {conts} with 10 {many} each. How many {many}?', '{many}', 40, '10 + 10 + 10 + 10'), NT(4, 6), NT(3, 9)] },
      think: {
        items: [{ q: 'Why do we bundle 10 ones into a ten?', lines: { n: 2, key: 'Tens are quicker to count than many ones.' } },
          { q: '{b} has 14 ones. How many tens can {b} make? How many ones are left?', eq: ['14 = [] ten [] ones'], a: [1, 4] },
          { q: 'Draw 2 tens and 3 ones.', draw: { h: 56, key: BL(2, 3) }, eq: ['2 tens 3 ones = []'], a: [23] },
          { q: 'Is 1 ten the same as 10 ones?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '1 ten = 10 ones' }]
      }
    },

    'count-tens': {
      watch: 'counting the cubes in each rod one by one. Count the rods by 10s first, then count on the ones.',
      goal: 'I can count the tens, then the ones.',
      learn: {
        show: { pic: BL(3, 4), cap: '10, 20, 30, then 31, 32, 33, 34', eq: ['34'] },
        together: [B(2, 3), B(4, 1)],
        cue: 'Count the tens by 10s. Then count on the ones.',
        own: [B(1, 5), B(3, 2), B(2, 7), B(4, 4)]
      },
      p1: { show: { pic: BL(2, 5), eq: ['25'] }, items: [B(1, 2), B(2, 0), B(3, 1), B(1, 8), B(2, 6), B(4, 0)] },
      p2: { items: [BT(3, 5), BT(2, 8), BT(4, 3), BT(1, 9), BT(3, 7), BT(4, 9)] },
      p3: { items: [B(4, 7), B(3, 0), B(2, 9), B(4, 5), { pic: BL(0, 8), eq: ['[]'], a: [8] }, B(5, 0)] },
      think: {
        items: [{ q: '{a} counted these as 7. What went wrong?', pic: BL(3, 4), lines: { n: 2, key: '{a} counted each rod as 1. Each rod is 10. It is 34.' } },
          { q: 'Draw 41 with tens and ones.', draw: { h: 56, key: BL(4, 1) } },
          { q: 'Which is more?', pick: { opts: ['26', '31'], ans: 1, big: true } },
          { q: 'Show 35 two ways: with blocks and with words.', lines: { n: 2, key: '3 tens and 5 ones; thirty-five.' } }]
      }
    },

    digits: {
      watch: 'saying the 3 in 34 is worth 3. Point to the tens place: the 3 means 3 tens, 30.',
      goal: 'I can say what each digit is worth.',
      learn: {
        show: { pic: BL(3, 4), cap: '3 tens and 4 ones', eq: ['34 = 30 + 4'] },
        together: [TO(25), DV(25)],
        cue: 'The left digit tells the tens. The right digit tells the ones.',
        own: [TO(41), TO(18), DV(37), DO(37)]
      },
      p1: { show: { eq: ['27 = 2 tens 7 ones'] }, items: [TO(13), TO(32), TO(46), TO(20), DV(43), DO(26)] },
      p2: { items: [DV(19), DO(19), DV(35), DO(48), TO(50), TO(9)] },
      p3: { items: [DV(42), DO(24), TO(39), PT(47), PT(31), PT(28)] },
      think: {
        items: [{ q: 'In 22, are both 2s worth the same? Why?', lines: { n: 2, key: 'No. The first 2 is 2 tens (20). The second 2 is 2 ones.' } },
          { q: 'Make a number with 4 tens and 0 ones.', eq: ['4 tens 0 ones = []'], a: [40] },
          { q: 'Circle the number where the 3 is worth 30.', pick: { opts: ['13', '43', '31'], ans: 2, digit: { d: 3, worth: 30 } } },
          { q: '{b} says 45 is 4 ones and 5 tens. Fix it.', eq: ['45 = [] tens [] ones'], a: [4, 5] }]
      }
    },

    more: {
      watch: 'changing the ones digit. 10 more changes the tens digit; the ones stay the same.',
      goal: 'I can find 10 more.',
      learn: {
        show: { pic: BL(2, 3), cap: 'Add one more ten', eq: ['23 + 10 = 33'] },
        together: [MO(14), MO(31)],
        cue: 'Add one ten. The tens digit goes up by 1. The ones stay the same.',
        own: [MO(5), MO(26), MO(12), MO(37)]
      },
      p1: { show: { eq: ['16 + 10 = 26'] }, items: [MO(10), MO(20), MO(15), MO(22), MO(8), MO(33)] },
      p2: { items: [MO(39), MO(17), MO(24), MO(40), { eq: ['[] + 10 = 28'], a: [18] }, { eq: ['[] + 10 = 45'], a: [35] }] },
      p3: { items: [{ eq: ['12, 22, 32, []'], a: [42], by: 10 }, { eq: ['9, 19, 29, []'], a: [39], by: 10 }, story('{a} has 26 {many}. {a} gets 10 more. How many now?', '{many}', 36, '26 + 10'), story('{b} has 18 {many} and finds a {cont} of 10. How many now?', '{many}', 28, '18 + 10'), { eq: ['[] + 10 = 50'], a: [40] }, { eq: ['3 + 10 = []'], a: [13] }] },
      think: {
        items: [{ q: '{a} says 10 more than 24 is 25. What went wrong?', lines: { n: 2, key: 'That is 1 more. 10 more than 24 is 34.' } },
          { q: 'Count on by 10s from 7.', eq: ['7, 17, [], [], []'], a: [27, 37, 47], by: 10, wide: true },
          { q: 'Which digit changes when you add 10?', pick: { opts: ['tens', 'ones'], ans: 0 }, tf: '24 + 10 = 34' },
          { q: 'Draw 10 more than 21.', draw: { h: 56, key: BL(3, 1) }, eq: ['[]'], a: [31], calc: '21 + 10' }]
      }
    },

    less: {
      watch: 'taking away 1 instead of 10. Take away one whole rod; the ones stay the same.',
      goal: 'I can find 10 less.',
      learn: {
        show: { pic: BL(3, 5), cap: 'Take away one ten', eq: ['35 − 10 = 25'] },
        together: [LE(28), LE(42)],
        cue: 'Take away one ten. The tens digit goes down by 1. The ones stay the same.',
        own: [LE(19), LE(36), LE(20), LE(47)]
      },
      p1: { show: { eq: ['26 − 10 = 16'] }, items: [LE(15), LE(30), LE(24), LE(11), LE(39), LE(50)] },
      p2: { items: [ML(25), ML(31), ML(18), ML(40), { eq: ['[] − 10 = 13'], a: [23] }, { eq: ['[] − 10 = 30'], a: [40] }] },
      p3: { items: [{ eq: ['48, 38, 28, []'], a: [18], by: -10 }, { eq: ['45, 35, [], []'], a: [25, 15], by: -10 }, story('{a} has 34 {many}. {a} gives away 10. How many now?', '{many}', 24, '34 − 10'), story('{b} has 40 {many}. {b} uses 10. How many are left?', '{many}', 30, '40 − 10'), ML(22), ML(39)] },
      think: {
        items: [{ q: 'What is 10 less than 10?', eq: ['10 − 10 = []'], a: [0] },
          { q: '{b} says 10 less than 43 is 42. Fix it.', eq: ['43 − 10 = []'], a: [33] },
          { q: 'Count back by 10s from 49.', eq: ['49, 39, [], [], []'], a: [29, 19, 9], by: -10, wide: true },
          { q: 'How is 10 less like 10 more?', lines: { n: 2, key: 'Both change only the tens digit, by 1. The ones stay the same.' } }]
      }
    },

    parts: {
      watch: 'adding the digits (3 + 4 = 7 for 34). The 3 means 30.',
      goal: 'I can split a number into tens and ones.',
      learn: {
        show: { pic: BL(2, 6), cap: '2 tens and 6 ones', eq: ['26 = 20 + 6'] },
        together: [PT(34), PT(17)],
        cue: 'Tens part plus ones part makes the number.',
        own: [PT(23), PT(45), PT(38), PT(12)]
      },
      p1: { show: { eq: ['15 = 10 + 5'] }, items: [PT(14), PT(21), PT(36), PT(42), { eq: ['20 + 7 = []'], a: [27] }, { eq: ['40 + 9 = []'], a: [49] }] },
      p2: { items: [{ eq: ['30 + 3 = []'], a: [33] }, { eq: ['10 + 6 = []'], a: [16] }, PT(29), PT(47), { pic: BL(3, 8), eq: ['[] + [] = 38'], a: [30, 8], expanded: true }, { pic: BL(4, 2), eq: ['[] + [] = 42'], a: [40, 2], expanded: true }] },
      p3: { items: [{ eq: ['25 = 20 + []', '25 = [] + 5'], a: [5, 20] }, { eq: ['41 = 40 + []', '41 = [] + 1'], a: [1, 40] }, { eq: ['32 = 30 + []'], a: [2] }, { eq: ['48 = [] + 8'], a: [40] }, { eq: ['5 + 30 = []'], a: [35] }, { eq: ['9 + 10 = []'], a: [19] }] },
      think: {
        items: [{ q: '{a} says 34 = 3 + 4. What is wrong?', lines: { n: 2, key: 'The 3 is 3 tens, so 34 = 30 + 4.' } },
          { q: 'Split 50 into tens and ones.', eq: ['50 = [] tens [] ones'], a: [5, 0] },
          { q: 'Draw 20 + 4.', draw: { h: 56, key: BL(2, 4) }, eq: ['20 + 4 = []'], a: [24] },
          { q: 'Make 18 two ways.', lines: { n: 2, key: 'For example: 10 + 8 and 9 + 9.' } }]
      }
    },

    missing: {
      watch: 'guessing. Count on from the part you know to the whole.',
      goal: 'I can find the missing part.',
      learn: {
        show: { pic: BL(2, 0), cap: '20 and how many make 27?', eq: ['20 + 7 = 27'] },
        together: [MS(36, 30), MS(14, 4)],
        cue: 'Start at the part you know. Count on to the whole.',
        own: [MS(18, 10), MS(45, 40), MS(29, 9), MS(33, 3)]
      },
      p1: { show: { eq: ['15 = 10 + 5'] }, items: [MS(12, 10), MS(25, 20), MS(38, 30), MS(16, 6), MS(41, 1), MS(47, 7)] },
      p2: { items: [{ eq: ['[] + 6 = 26'], a: [20] }, { eq: ['30 + [] = 39'], a: [9] }, { eq: ['[] + 3 = 43'], a: [40] }, { eq: ['10 + [] = 18'], a: [8] }, story('{a} has 24 {many}. 20 are in {conts}. How many are loose?', '{many}', 4, '24 − 20'), story('{b} needs 35 {many}. {b} has 30. How many more?', 'more', 5, '35 − 30')] },
      p3: { items: [{ eq: ['10 = 6 + []'], a: [4] }, { eq: ['20 = 15 + []'], a: [5] }, { eq: ['25 = 21 + []'], a: [4] }, { eq: ['40 = 35 + []'], a: [5] }, story('{a} has 17 {many}. 10 are red. How many are not red?', '{many}', 7, '17 − 10'), story('{b} wants 50 {many}. {b} has 40. How many more?', 'more', 10, '50 − 40')] },
      think: {
        items: [{ q: 'How can a number line help find 30 + [] = 36?', lines: { n: 2, key: 'Start at 30 and count the jumps to 36: 6.' } },
          { q: '{b} says 40 + 2 = 24. Fix it.', eq: ['40 + 2 = []'], a: [42] },
          { q: 'Find two numbers that make 30.', lines: { n: 1, key: 'For example: 20 and 10, or 25 and 5.' } },
          { q: 'What is missing?', eq: ['[] + 5 = 45'], a: [40] }]
      }
    },

    trade: {
      watch: 'thinking a number can only be written one way. 1 ten can be traded for 10 ones; the number does not change.',
      goal: 'I can trade a ten for 10 ones.',
      learn: {
        show: { pic: BL(1, 12), cap: '1 ten and 12 ones', eq: ['22 = 1 ten 12 ones'] },
        together: [TR(23, 1), TR(31, 2)],
        cue: 'Open one ten into 10 ones. The number stays the same.',
        own: [TR(15, 0), TR(26, 1), TR(34, 2), TR(42, 3)]
      },
      p1: { show: { pic: BL(0, 14), eq: ['14 = 0 tens 14 ones'] }, items: [TR(12, 0), TR(21, 1), TR(30, 2), TR(18, 0), TR(25, 1), TR(37, 2)] },
      p2: { items: [{ pic: BL(1, 15), eq: ['[]'], a: [25] }, { pic: BL(2, 13), eq: ['[]'], a: [33] }, TR(40, 3), TR(44, 3), TR(29, 1), { eq: ['2 tens 16 ones = []'], a: [36] }] },
      p3: { items: [{ eq: ['3 tens 12 ones = []'], a: [42] }, { eq: ['1 tens 20 ones = []'], a: [30] }, TR(50, 4), TR(47, 3), TR(35, 1), TR(46, 2)] },
      think: {
        items: [{ q: '{a} has 2 tens 14 ones. {b} has 34. Do they have the same?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '2 tens 14 ones = 34' },
          { q: 'Show 32 two ways with tens and ones.', lines: { n: 2, key: '3 tens 2 ones; 2 tens 12 ones.' } },
          { q: 'Why might you open a ten?', lines: { n: 2, key: 'To take away more ones than you have, like 32 − 5.' } },
          { q: 'Draw 1 ten and 13 ones. What number is it?', draw: { h: 56, key: BL(1, 13) }, eq: ['1 ten 13 ones = []'], a: [23] }]
      }
    },

    'tens-first': {
      watch: 'comparing the ones first (29 > 31 because 9 > 1). Look at the tens first.',
      goal: 'I can compare numbers by their tens first.',
      learn: {
        show: { pic: ['row', { list: [BL(2, 9), BL(3, 1)], labels: ['29', '31'] }], eq: ['31 is greater'] },
        together: [BG([29, 31]), BG([45, 18])],
        cue: 'Look at the tens first. More tens means greater.',
        own: [BG([16, 41]), BG([38, 22]), SM([27, 19]), SM([30, 13])]
      },
      p1: { show: { eq: ['3 tens > 1 ten'] }, items: [BG([12, 21]), BG([34, 43]), BG([40, 9]), SM([25, 52]), SM([18, 28]), SM([33, 23])] },
      p2: { items: [BG([19, 31, 26]), BG([42, 24, 37]), SM([35, 14, 41]), SM([28, 50, 33]), { q: '{a} has 27. {b} has 32. Who has more?', pick: { opts: ['{a}', '{b}'], ans: 1, more: ['27', '32'] } }, { q: '{a} has 46. {b} has 19. Who has less?', pick: { opts: ['{a}', '{b}'], ans: 1, less: ['46', '19'] } }] },
      p3: { items: [BG([39, 41, 14]), SM([22, 31, 13]), BG([8, 48, 18]), SM([50, 45, 20]), story('{a} has 29 {many}. {b} has 38. How many more does {b} have?', 'more', 9, '38 − 29'), { q: 'Circle the greatest.', pick: { opts: ['thirty', 'forty', 'twenty-nine'], ans: 1, big: true }, wide: true }] },
      think: {
        items: [{ q: '{a} says 29 is greater than 31 because 9 > 1. Is {a} right?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '29 > 31' },
          { q: 'Write a number greater than 35 with 3 tens.', lines: { n: 1, key: '36, 37, 38 or 39.' } },
          { q: 'Why look at the tens first?', lines: { n: 2, key: 'Tens are worth more than ones. More tens means a greater number.' } },
          { q: 'Circle the number between 20 and 30.', pick: { opts: ['12', '26', '32'], ans: 1, between: [20, 30] } }]
      }
    },

    'same-tens': {
      watch: 'calling numbers with the same tens equal. When the tens match, the ones decide.',
      goal: 'I can compare numbers with the same tens.',
      learn: {
        show: { pic: ['row', { list: [BL(3, 4), BL(3, 7)], labels: ['34', '37'] }], eq: ['37 is greater'] },
        together: [BG([24, 28]), SM([45, 41])],
        cue: 'Same tens? Then compare the ones.',
        own: [BG([31, 36]), BG([19, 15]), SM([42, 47]), SM([23, 20])]
      },
      p1: { show: { eq: ['26 < 29'] }, items: [BG([13, 17]), BG([22, 25]), BG([48, 44]), SM([36, 39]), SM([11, 14]), SM([45, 40])] },
      p2: { items: [BG([32, 38, 35]), SM([27, 21, 24]), BG([41, 49, 43]), SM([16, 19, 12]), { q: '{a} has 33. {b} has 36. Who has more?', pick: { opts: ['{a}', '{b}'], ans: 1, more: ['33', '36'] } }, { q: '{a} has 48. {b} has 42. Who has less?', pick: { opts: ['{a}', '{b}'], ans: 1, less: ['48', '42'] } }] },
      p3: { items: [BG([27, 23, 29]), SM([44, 41, 46]), BG([15, 18, 51]), SM([30, 33, 3]), story('{a} has 34 {many}. {b} has 31. How many more does {a} have?', 'more', 3, '34 − 31'), { q: 'Circle the greatest.', pick: { opts: ['twenty-six', 'twenty-two', 'twenty-nine'], ans: 2, big: true }, wide: true }] },
      think: {
        items: [{ q: 'Write a number between 42 and 46.', lines: { n: 1, key: '43, 44 or 45.' } },
          { q: '{b} says 37 and 33 are the same because they both have 3 tens. Is {b} right?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '37 = 33' },
          { q: 'Which two numbers are both less than 25?', lines: { n: 1, key: 'For example: 21 and 24.' } },
          { q: 'Circle the number between 30 and 35.', pick: { opts: ['29', '33', '36'], ans: 1, between: [30, 35] } }]
      }
    },

    swap: {
      watch: 'reading 41 as 14. Read the tens digit first: 41 is forty-one, 4 tens.',
      goal: 'I can tell numbers like 14 and 41 apart.',
      learn: {
        show: { pic: ['row', { list: [BL(1, 4), BL(4, 1)], labels: ['14', '41'] }], eq: ['41 is greater'] },
        together: [BG([14, 41]), TO(41)],
        cue: 'Same digits, different places. The tens digit decides.',
        own: [BG([23, 32]), SM([15, 51]), TO(12), TO(21)]
      },
      p1: { show: { eq: ['13 < 31'] }, items: [BG([25, 52]), SM([34, 43]), BG([12, 21]), SM([45, 54]), B(1, 3), B(3, 1)] },
      p2: { items: [TO(24), TO(42), DV(35), DV(53), BG([18, 81]), SM([27, 72])] },
      p3: { items: [{ q: 'Use 2 and 4. Make the greatest number.', eq: ['[]'], a: [42], big: [2, 4] }, { q: 'Use 2 and 4. Make the least number.', eq: ['[]'], a: [24], small: [2, 4] }, { q: 'Use 1 and 3. Make the greatest number.', eq: ['[]'], a: [31], big: [1, 3] }, { q: 'Use 3 and 4. Make the least number.', eq: ['[]'], a: [34], small: [3, 4] }, SM([19, 91]), BG([36, 63])] },
      think: {
        items: [{ q: 'How are 15 and 51 different?', lines: { n: 2, key: '15 is 1 ten 5 ones. 51 is 5 tens 1 one.' } },
          { q: 'Draw 23 and 32 with blocks.', draw: { h: 64, key: '23: 2 tens 3 ones. 32: 3 tens 2 ones.' } },
          { q: '{a} has 41 {many}. {b} has 14. Who has more?', pick: { opts: ['{a}', '{b}'], ans: 0, more: ['41', '14'] } },
          { q: 'Use 3 and 5. Make the greatest number.', eq: ['[]'], a: [53], big: [3, 5] }]
      }
    },

    line: {
      watch: 'reading the number line from the wrong end. Numbers get greater as you go right.',
      goal: 'I can use a number line to put numbers in order.',
      learn: {
        show: { pic: ['nl', { min: 20, max: 30, tick: 1, lab: 5, pt: 24 }], cap: 'Greater numbers are to the right', eq: ['24 < 28'] },
        together: [NL(10, 20, 13), NA(20, 30, [22, 27])],
        cue: 'Numbers get greater as you go right.',
        own: [NL(30, 40, 38), NA(40, 50, [43, 48])]
      },
      p1: { show: { pic: ['nl', { min: 0, max: 10, tick: 1, lab: 5, pt: 7 }], eq: ['7'] }, items: [NL(0, 10, 4), NL(10, 20, 17), NL(20, 30, 21), NL(40, 50, 46), NA(0, 10, [2, 9]), NA(30, 40, [31, 34])] },
      p2: { items: [NL(20, 30, 29), NL(30, 40, 33), NA(10, 20, [12, 18]), NA(20, 30, [24, 26]), NA(40, 50, [41, 47]), OR([26, 22, 29])] },
      p3: { items: [OR([18, 31, 25]), OR([40, 14, 33]), NA(25, 35, [28, 32]), NA(35, 45, [36, 44]), NL(40, 50, 49), OR([9, 19, 12])] },
      think: {
        items: [{ q: 'Is 34 closer to 30 or 40? Use the line.', pic: ['nl', { min: 30, max: 40, tick: 1, lab: 5, pt: 34 }], pick: { opts: ['30', '40'], ans: 0, near: true } },
          { q: 'Mark 15 and 25 on the line.', pic: ['nl', { min: 10, max: 30, tick: 1, lab: 10, ask: [15, 25] }], a: [15, 25] },
          { q: 'Why is 38 to the right of 31?', lines: { n: 2, key: '38 is greater than 31, and greater numbers are to the right.' } },
          OR([45, 27, 36, 30], true)]
      }
    },

    three: {
      watch: 'ordering by the ones digit. Find the least by its tens, then the next.',
      goal: 'I can put three numbers in order.',
      learn: {
        show: { cap: 'Least to greatest', eq: ['12 < 21 < 31'] },
        together: [OR([31, 12, 21]), OR([40, 25, 28])],
        cue: 'Find the least first. Then the next. The greatest is last.',
        own: [OR([16, 9, 12]), OR([33, 23, 13]), OR([45, 41, 50]), OR([27, 38, 19])]
      },
      p1: { show: { eq: ['7 < 15 < 20'] }, items: [OR([5, 3, 8]), OR([14, 11, 19]), OR([30, 10, 20]), OR([22, 18, 25]), OR([35, 32, 40]), OR([47, 44, 49])] },
      p2: { items: [OR([24, 42, 34]), OR([13, 31, 30]), OR([26, 19, 41]), OR([50, 5, 15]), OR([37, 39, 33]), OR([12, 28, 21])] },
      p3: { items: [OR([46, 16, 26, 36], true), OR([29, 33, 23, 32], true), story('{a} has 31 {many}. {b} has 27. How many more does {a} have?', 'more', 4, '31 − 27'), { q: 'Circle the greatest.', pick: { opts: ['44', '40', '49'], ans: 2, big: true } }, { q: 'Circle the least.', pick: { opts: ['21', '12', '20'], ans: 1, small: true } }, OR([15, 51, 25])] },
      think: {
        items: [{ q: 'Order from greatest to least: 18, 35, 26.', lines: { n: 1, key: '35, 26, 18' } },
          { q: '{b} put 9, 21, 15 in order. Is that right? Fix it.', eq: ['[] < [] < []'], a: [9, 15, 21], set: [9, 21, 15] },
          { q: 'Write three numbers between 30 and 40 in order.', lines: { n: 1, key: 'For example: 32, 35, 38.' } },
          { q: 'How do you find the least of three numbers?', lines: { n: 2, key: 'Look for the fewest tens. If the tens are the same, look for the fewest ones.' } }]
      }
    }
  } });
})();
