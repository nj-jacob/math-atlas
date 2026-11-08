/* Grade 4 Multiplying and Dividing: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/multiply-divide.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.2 facts to 10 × 10 and their division facts, B2.3 × and ÷ by 10, 100 and 1000 in your head,
   B2.5 two- and three-digit numbers × a one-digit number, B2.6 dividing by a one-digit number with remainders,
   B2.8 whole-number rates. The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* an r by c array and its sum; with a cut after k rows, the two parts are found and added */
  function AR(r, c) { return { pic: ['array', { r: r, c: c }], eq: ['[] × [] = []'], a: [r, c, r * c] }; }
  function CUT(r, c, k) { return { pic: ['array', { r: r, c: c, split: k }], eq: ['[] + [] = []', r + ' × ' + c + ' = []'], a: [k * c, (r - k) * c, r * c, r * c] }; }
  /* a story with one answer; calc is the sum the answer check works out */
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* a page-wide block of facts in 3 columns (or cols): [a, op, b], or [a, op, b, 'first'] to put the box first */
  function FA(list, cols) {
    var eq = [], a = [];
    list.forEach(function (f) {
      var r = f[1] === '×' ? f[0] * f[2] : f[0] / f[2];
      if (f[3] === 'first') { eq.push('[] ' + f[1] + ' ' + f[2] + ' = ' + r); a.push(f[0]); } else { eq.push(f[0] + ' ' + f[1] + ' ' + f[2] + ' = []'); a.push(r); }
    });
    return { eq: eq, a: a, cols: cols || 3, wide: true };
  }
  /* the four facts of x and y */
  function FAM(x, y) { var p = x * y; return { q: 'Use ' + x + ', ' + y + ' and ' + p + '.', eq: [x + ' × ' + y + ' = []', y + ' × ' + x + ' = []', p + ' ÷ ' + x + ' = []', p + ' ÷ ' + y + ' = []'], a: [p, p, y, x] }; }
  /* break a two-digit n into tens and ones, multiply each part by b, then the whole */
  function BR(n, b) { var t = n - n % 10, o = n % 10; return { eq: [t + ' × ' + b + ' = []', o + ' × ' + b + ' = []', n + ' × ' + b + ' = []'], a: [t * b, o * b, n * b] }; }
  /* the same in one line: n × b = [] + [], then the answer */
  function BR2(n, b) { var t = n - n % 10, o = n % 10; return { eq: [n + ' × ' + b + ' = [] + []', n + ' × ' + b + ' = []'], a: [t * b, o * b, n * b] }; }
  /* a three-digit n broken into its places, with the parts named in the question */
  function P3(n, b) {
    var h = n - n % 100, t = n % 100 - n % 10, o = n % 10, parts = [h, t, o].filter(Boolean);
    return { q: 'Break ' + n + ' into ' + parts.join(' + ') + '.', eq: [n + ' × ' + b + ' = []'], a: [n * b] };
  }
  /* n moved 1, 2 or 3 places on a place value chart (dir 'x' to multiply, 'd' to divide); the key fills the bottom row */
  function PV(n, shift, dir) { var k = Math.pow(10, shift); return { pic: ['pv', { n: n, shift: shift, dir: dir }], eq: [n + (dir === 'x' ? ' × ' : ' ÷ ') + k + ' = []'], a: [dir === 'x' ? n * k : n / k] }; }
  /* an area model for n × b: the parts first, then the product */
  function AM(n, b) { var p = AMP(n, b); return { pic: ['amodel', { a: n, b: b }], eq: [n + ' × ' + b + ' = []'], a: p.concat([n * b]) }; }
  function AMP(n, b) { return String(n).split('').map(function (d, i, all) { return +d * Math.pow(10, all.length - 1 - i) * b; }).filter(Boolean); }
  /* t shared into d groups, drawn with a leftover plate */
  function SR(t, d) { return { pic: ['shareR', { t: t, g: d }], eq: [t + ' ÷ ' + d + ' = [] R []'], a: [Math.floor(t / d), t % d] }; }
  /* t shared into d groups: how many in each and how many left */
  function R(t, d) { return { eq: [t + ' ÷ ' + d + ' = [] R []'], a: [Math.floor(t / d), t % d] }; }
  /* a story where the leftovers matter: up (they still need a {cont}) or down (only full ones count) */
  function LO(q, t, d, up, unit) {
    var n = Math.floor(t / d), r = t % d;
    return { q: q, eq: [t + ' ÷ ' + d + ' = [] R []', '[] ' + unit], a: [n, r, up && r ? n + 1 : n], rem: up ? 'up' : 'down' };
  }
  /* a "for every 1" table: rows of [{conts}, {many}] with [] for blanks */
  function TB(q, rows, a) { return { q: q, pic: ['table', { head: ['{conts}', '{many}'], rows: rows }], a: a }; }
  /* a right or wrong statement to circle */
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  /* the bigger of two (or three) sums */
  function BIG(q, opts, ans, wide) { return { q: q, pick: { opts: opts, ans: ans, big: true }, wide: !!wide }; }

  S.register('multiply-divide', { code: 'MD', ideas: {

    arrays: {
      watch: 'adding one row and one column (4 + 6) instead of multiplying. Run a finger along each row and count by the number in a row.',
      goal: 'I can write a times fact for an array.',
      learn: {
        show: { pic: ['array', { r: 4, c: 6 }], cap: '4 rows of 6', eq: ['6, 12, 18, 24', '4 × 6 = 24'] },
        together: [AR(3, 7), { pic: ['array', { r: 6, c: 4 }], eq: ['6 × 4 = []', '4 × 6 = []'], a: [24, 24] }],
        cue: 'Rows × number in each row = total. Turning the array does not change the total.',
        own: [AR(3, 8), { eq: ['9 × 4 = []', '4 × 9 = []'], a: [36, 36] }, { eq: ['7 × 3 = []', '6 × 6 = []'], a: [21, 36] }, { eq: ['5 × 8 = []', '8 × 5 = []'], a: [40, 40] }]
      },
      p1: {
        show: { pic: ['array', { r: 3, c: 8 }], cap: '3 rows of 8', eq: ['3 × 8 = 24'] },
        items: [AR(2, 9), AR(4, 7), AR(5, 6), AR(3, 9), { eq: ['8 × 3 = []', '3 × 8 = []'], a: [24, 24] }, AR(6, 5)]
      },
      p2: {
        items: [AR(7, 6), { q: 'Draw 4 rows of 8.', draw: { h: 80, key: ['array', { r: 4, c: 8 }] }, eq: ['4 × 8 = []'], a: [32] },
          story('{a} sets out 6 rows of 7 {many}. How many {many}?', '{many}', 42, '6 × 7'), AR(8, 4),
          { q: 'An array has 36 in 4 rows. How many in each row?', eq: ['4 × [] = 36'], a: [9] },
          { eq: ['7 × 7 = []', '8 × 5 = []'], a: [49, 40] }]
      },
      p3: {
        items: [AR(8, 7), AR(9, 6), story('{b} sets out 9 rows of 8 {many}. How many {many}?', '{many}', 72, '9 × 8'),
          { q: 'An array has 63 in 7 rows. How many in each row?', eq: ['7 × [] = 63'], a: [9] },
          FA([[6, '×', 8], [7, '×', 9], [8, '×', 8], [9, '×', 9], [6, '×', 7], [8, '×', 9]]),
          story('{a} sets out 10 rows of 7 {many}. How many {many}?', '{many}', 70, '10 × 7')]
      },
      think: {
        items: [{ q: 'Draw two different arrays with 36 in each.', draw: { h: 130, key: 'Any two of 1 × 36, 2 × 18, 3 × 12, 4 × 9, 6 × 6, 9 × 4, 12 × 3.' } },
          { q: '{b} says this array has 5 + 7 = 12. What went wrong?', pic: ['array', { r: 5, c: 7 }], lines: { n: 2, key: '{b} added one row and one column. It is 5 rows of 7, which is 35.' } },
          { q: 'Write a story for 4 rows of 9.', lines: { n: 3, key: 'For example: {a} sets out 4 rows of 9 {many}. That makes 36 {many}.' } },
          BIG('Which array has more?', ['6 rows of 8', '7 rows of 7'], 1)]
      }
    },

    'break-apart': {
      watch: 'finding only one part, or adding the number of rows (5 + 2) instead of the two products. Cover one part, say its fact, then the other.',
      goal: 'I can break a hard fact into two facts I know.',
      learn: {
        show: { pic: ['array', { r: 6, c: 8, split: 5 }], cap: 'Cut after 5 rows', eq: ['40 + 8 = 48', '6 × 8 = 48'] },
        together: [{ pic: ['array', { r: 6, c: 7, split: 5 }], eq: ['35 + [] = []', '6 × 7 = []'], a: [7, 42, 42] }, CUT(7, 6, 5)],
        cue: 'Cut the rows into two facts you know. Find each part, then add.',
        own: [{ eq: ['7 × 6 = 30 + []', '7 × 6 = []'], a: [12, 42] }, { eq: ['8 × 7 = 35 + []', '8 × 7 = []'], a: [21, 56] },
          { eq: ['9 × 4 = 20 + []', '9 × 4 = []'], a: [16, 36] }, { eq: ['7 × 7 = 35 + []', '7 × 7 = []'], a: [14, 49] }]
      },
      p1: {
        show: { pic: ['array', { r: 6, c: 8, split: 5 }], cap: '5 rows and 1 more row', eq: ['40 + 8 = 48'] },
        items: [{ pic: ['array', { r: 6, c: 6, split: 5 }], eq: ['30 + [] = []'], a: [6, 36] }, { pic: ['array', { r: 7, c: 4, split: 5 }], eq: ['20 + [] = []'], a: [8, 28] },
          { eq: ['6 × 9 = 45 + []'], a: [9] }, { eq: ['7 × 8 = 40 + []'], a: [16] },
          { pic: ['array', { r: 8, c: 4, split: 5 }], eq: ['[] + [] = []'], a: [20, 12, 32] }, { eq: ['6 × 7 = 35 + []'], a: [7] }]
      },
      p2: {
        items: [{ q: 'Double 3 × 8 to find 6 × 8.', eq: ['3 × 8 = []', '6 × 8 = [] + []', '6 × 8 = []'], a: [24, 24, 24, 48] },
          { q: 'Use 10 × 7 = 70 to find 9 × 7.', eq: ['9 × 7 = 70 − []', '9 × 7 = []'], a: [7, 63] },
          CUT(8, 7, 5),
          { q: 'Use 5 × 9 = 45 to find 7 × 9.', eq: ['7 × 9 = 45 + []', '7 × 9 = []'], a: [18, 63] },
          { q: 'Double 4 × 6 to find 8 × 6.', eq: ['8 × 6 = 24 + []', '8 × 6 = []'], a: [24, 48] },
          { q: 'Use 10 × 8 = 80 to find 9 × 8.', eq: ['9 × 8 = 80 − []', '9 × 8 = []'], a: [8, 72] }]
      },
      p3: {
        items: [{ eq: ['7 × 7 = 35 + []', '7 × 7 = []'], a: [14, 49] }, { eq: ['9 × 6 = 60 − []', '9 × 6 = []'], a: [6, 54] },
          { eq: ['8 × 8 = 32 + []', '8 × 8 = []'], a: [32, 64] }, { eq: ['6 × 9 = 30 + []', '6 × 9 = []'], a: [24, 54] },
          TF('7 × 8 = 5 × 8 + 2 × 8', true), TF('9 × 7 = 9 × 5 + 9 × 3', false)]
      },
      think: {
        items: [{ q: 'Show two ways to break apart 8 × 9.', draw: { h: 120, key: 'For example: 5 × 9 + 3 × 9 = 45 + 27 = 72, or 4 × 9 + 4 × 9 = 36 + 36 = 72.' } },
          { q: '{b} says 7 × 8 = 5 × 8 + 2 = 42. What went wrong?', lines: { n: 3, key: '{b} added 2, not 2 × 8 = 16. 7 × 8 = 40 + 16 = 56.' } },
          { q: 'Circle the way that gives 6 × 7.', pick: { opts: ['5 × 7 + 7', '6 × 5 + 2', '3 × 7 + 4 × 7'], ans: 0, val: 42 }, wide: true },
          { q: 'You forgot 8 × 7. How could you work it out?', lines: { n: 3, key: 'For example: 5 × 7 = 35 and 3 × 7 = 21, so 8 × 7 = 56. Or double 4 × 7 = 28.' } }]
      }
    },

    family: {
      watch: 'mixing up which number goes first in a division (6 ÷ 54). The biggest number of the family always starts a division.',
      goal: 'I can write the four facts of a fact family.',
      learn: {
        show: { pic: ['array', { r: 6, c: 9 }], cap: '6 rows of 9', eq: ['6 × 9 = 54', '54 ÷ 6 = 9'] },
        together: [FAM(7, 8), FAM(4, 9)],
        cue: 'To divide, think of the times fact. 56 ÷ 8: 8 × what = 56?',
        own: [{ eq: ['6 × 7 = []', '42 ÷ 6 = []'], a: [42, 7] }, { eq: ['42 ÷ 7 = []', '63 ÷ 9 = []'], a: [6, 7] }, { eq: ['[] × 8 = 64', '64 ÷ 8 = []'], a: [8, 8] }, { eq: ['5 × 8 = []', '40 ÷ 5 = []'], a: [40, 8] }]
      },
      p1: {
        show: { pic: ['array', { r: 3, c: 8 }], cap: '3 rows of 8', eq: ['3 × 8 = 24', '24 ÷ 8 = 3'] },
        items: [FAM(3, 7), FAM(4, 6), { eq: ['30 ÷ 6 = []', '6 × [] = 30'], a: [5, 5] }, { eq: ['36 ÷ 4 = []', '4 × [] = 36'], a: [9, 9] },
          { eq: ['45 ÷ 5 = []', '5 × [] = 45'], a: [9, 9] }, { eq: ['28 ÷ 7 = []', '7 × [] = 28'], a: [4, 4] }]
      },
      p2: {
        items: [FAM(6, 8), FAM(7, 9),
          FA([[48, '÷', 6], [56, '÷', 7], [72, '÷', 9], [45, '÷', 5], [64, '÷', 8], [42, '÷', 6]]),
          story('{a} shares 54 {many} equally into 6 {conts}. How many {many} in each?', '{many}', 9, '54 ÷ 6'),
          { eq: ['[] ÷ 7 = 8'], a: [56] }, TF('63 ÷ 9 = 8', false)]
      },
      p3: {
        items: [FAM(8, 9), story('{b} has 81 {many}, 9 in each {cont}. How many {conts}?', '{conts}', 9, '81 ÷ 9'),
          FA([[49, '÷', 7], [8, '×', 6, 'first'], [72, '÷', 8], [9, '×', 7, 'first'], [36, '÷', 6], [54, '÷', 9]]),
          { eq: ['[] ÷ 6 = 7', '[] ÷ 8 = 9'], a: [42, 72] }, TF('72 ÷ 8 = 9', true),
          { q: 'Circle the fact that does not belong.', pick: { opts: ['7 × 6 = 42', '42 ÷ 6 = 7', '6 × 8 = 42'], ans: 2 }, odd: true, wide: true }]
      },
      think: {
        items: [{ q: 'Write the fact family for 9 × 9. Why does it have only 2 facts?', lines: { n: 3, key: '9 × 9 = 81 and 81 ÷ 9 = 9. Both numbers are the same, so turning it gives the same facts.' } },
          { q: '{b} says 48 ÷ 6 = 7 because 6 × 7 = 48. What went wrong?', lines: { n: 3, key: '6 × 7 = 42, not 48. 6 × 8 = 48, so 48 ÷ 6 = 8.' } },
          { q: 'Write a story for 56 ÷ 8.', lines: { n: 3, key: 'For example: {a} shares 56 {many} equally into 8 {conts}. Each {cont} gets 7.' } },
          { q: 'Find the missing numbers.', eq: ['[] × 7 = 49', '49 ÷ [] = 7'], a: [7, 7] }]
      }
    },

    times10: {
      watch: 'adding one zero for every kind of times (40 × 100 = 400). Say how many places each digit moves: 1, 2 or 3.',
      goal: 'I can multiply by 10, 100 and 1000 in my head.',
      learn: {
        show: { cap: '46 tens, then 46 hundreds', eq: ['46 × 10 = 460', '46 × 100 = 4600'] },
        together: [PV(37, 1, 'x'), PV(8, 3, 'x')],
        cue: 'Times 10, 100 or 1000: each digit moves 1, 2 or 3 places left. Zeros fill the empty places.',
        own: [{ eq: ['52 × 10 = []', '52 × 100 = []'], a: [520, 5200] }, { eq: ['7 × 1000 = []', '9 × 100 = []'], a: [7000, 900] },
          { eq: ['[] × 10 = 640'], a: [64] }, { eq: ['305 × 10 = []'], a: [3050] }]
      },
      p1: {
        show: { cap: 'One place left', eq: ['23 × 10 = 230'] },
        items: [PV(14, 1, 'x'), PV(12, 2, 'x'),
          { eq: ['3 × 1000 = []', '6 × 1000 = []'], a: [3000, 6000] }, { eq: ['75 × 10 = []', '75 × 100 = []'], a: [750, 7500] },
          { eq: ['[] × 10 = 90', '[] × 100 = 400'], a: [9, 4] },
          story('{a} has 10 {conts} with 25 {many} in each. How many {many}?', '{many}', 250, '10 × 25')]
      },
      p2: {
        items: [FA([[48, '×', 10], [48, '×', 100], [9, '×', 1000], [130, '×', 10], [407, '×', 10], [66, '×', 100]]),
          story('{b} packs 100 {many} in each {cont}. How many {many} fit in 34 {conts}?', '{many}', 3400, '34 × 100'),
          { eq: ['[] × 100 = 2900'], a: [29] }, { eq: ['[] × 1000 = 5000'], a: [5] }, TF('60 × 100 = 6000', true),
          BIG('Circle the biggest.', ['54 × 100', '5 × 1000', '500 × 10'], 0, true)]
      },
      p3: {
        items: [FA([[87, '×', 100], [4, '×', 1000], [250, '×', 10], [909, '×', 10], [18, '×', 100], [70, '×', 100]]),
          { eq: ['[] × 10 = 5600', '[] × 100 = 5600'], a: [560, 56] },
          story('{a} has 8 {conts} with 1000 {many} in each. How many {many}?', '{many}', 8000, '8 × 1000'),
          story('{b} collects 10 {many} a day for 45 days. How many {many}?', '{many}', 450, '45 × 10'),
          TF('70 × 100 = 700', false), { eq: ['6 × [] = 6000', '35 × [] = 350'], a: [1000, 10] }]
      },
      think: {
        items: [{ q: '{b} says 40 × 100 = 400. What went wrong?', lines: { n: 3, key: '{b} added one zero. Each digit moves 2 places left: 40 × 100 = 4000.' } },
          { q: 'Find three ways to make 3000.', eq: ['[] × 10 = 3000', '[] × 100 = 3000', '[] × 1000 = 3000'], a: [300, 30, 3] },
          { q: 'Why is there a 0 in the ones place of 46 × 10?', lines: { n: 3, key: 'Each digit moves 1 place left. The ones place is empty, so a 0 fills it.' } },
          BIG('Which is more?', ['72 × 100', '700 × 10'], 0)]
      }
    },

    divide10: {
      watch: 'adding a zero when dividing (460 ÷ 10 = 4600). Ask: "Should the answer be bigger or smaller?"',
      goal: 'I can divide by 10 in my head.',
      learn: {
        show: { cap: '46 tens is 460', eq: ['460 ÷ 10 = 46'] },
        together: [PV(380, 1, 'd'), PV(5600, 1, 'd')],
        cue: 'Divide by 10: each digit moves 1 place right. The answer is smaller.',
        own: [{ eq: ['90 ÷ 10 = []', '250 ÷ 10 = []'], a: [9, 25] }, { eq: ['700 ÷ 10 = []'], a: [70] }, { eq: ['4300 ÷ 10 = []'], a: [430] }, { eq: ['[] ÷ 10 = 61'], a: [610] }]
      },
      p1: {
        show: { cap: 'One place right', eq: ['50 ÷ 10 = 5'] },
        items: [PV(70, 1, 'd'), PV(340, 1, 'd'),
          { eq: ['600 ÷ 10 = []', '900 ÷ 10 = []'], a: [60, 90] }, { eq: ['[] ÷ 10 = 8'], a: [80] },
          story('{a} shares 150 {many} equally into 10 {conts}. How many {many} in each?', '{many}', 15, '150 ÷ 10'),
          { eq: ['450 ÷ 10 = []', '45 × 10 = []'], a: [45, 450] }]
      },
      p2: {
        items: [FA([[260, '÷', 10], [1000, '÷', 10], [3070, '÷', 10], [990, '÷', 10], [2500, '÷', 10], [8000, '÷', 10]], 2),
          story('{b} has 720 {many}, 10 in each {cont}. How many {conts}?', '{conts}', 72, '720 ÷ 10'),
          { eq: ['[] ÷ 10 = 405'], a: [4050] }, TF('600 ÷ 10 = 6000', false),
          story('{a} puts 580 {many} into 10 {conts}, the same in each. How many {many} in each?', '{many}', 58, '580 ÷ 10'),
          { eq: ['1200 ÷ 10 = []'], a: [120] }]
      },
      p3: {
        items: [FA([[5060, '÷', 10], [7700, '÷', 10], [340, '÷', 10], [9990, '÷', 10], [4000, '÷', 10], [100, '÷', 10]], 2),
          { eq: ['[] ÷ 10 = 230', '[] ÷ 10 = 9'], a: [2300, 90] },
          story('{b} puts 10 {many} in each {cont}. How many {conts} hold 2400 {many}?', '{conts}', 240, '2400 ÷ 10'),
          TF('3500 ÷ 10 = 350', true), { eq: ['80 × 10 = []', '800 ÷ 10 = []'], a: [800, 80] },
          story('{a} shares 960 {many} equally into 10 {conts}. How many {many} in each?', '{many}', 96, '960 ÷ 10')]
      },
      think: {
        items: [{ q: '{b} says 460 ÷ 10 = 4600. What went wrong?', lines: { n: 3, key: '{b} moved the digits left. Dividing makes it smaller: 460 ÷ 10 = 46.' } },
          { q: 'I divide a number by 10 and get 75. What was the number?', eq: ['[] ÷ 10 = 75'], a: [750] },
          { q: 'How are × 10 and ÷ 10 linked? Use 32 and 320.', lines: { n: 3, key: '32 × 10 = 320 and 320 ÷ 10 = 32. One undoes the other.' } },
          BIG('Which is more?', ['900 ÷ 10', '80 × 10'], 1)]
      }
    },

    'two-digit': {
      watch: 'multiplying the tens digit as ones (34 × 6 as 3 × 6 + 4 × 6 = 42). Point to the 3 and ask: "What is this 3 really worth?"',
      goal: 'I can multiply a two-digit number by breaking it into tens and ones.',
      learn: {
        show: { pic: ['amodel', { a: 34, b: 6, fill: true }], cap: 'Break 34 into 30 and 4', eq: ['180 + 24 = 204', '34 × 6 = 204'] },
        together: [AM(47, 5), AM(26, 3)],
        cue: 'Break. Multiply each part. Add.',
        own: [BR2(32, 3), BR2(15, 6), BR2(43, 2), BR2(28, 5)]
      },
      p1: {
        show: { pic: ['amodel', { a: 23, b: 3, fill: true }], cap: 'Break 23 into 20 and 3', eq: ['60 + 9 = 69', '23 × 3 = 69'] },
        items: [AM(21, 4), AM(12, 5), BR(34, 2), BR(42, 3), BR2(16, 4), BR2(31, 6)]
      },
      p2: {
        items: [BR2(36, 4), BR2(52, 7), BR2(45, 6), BR2(63, 3),
          story('{a} has 24 {conts} with 6 {many} in each. How many {many}?', '{many}', 144, '24 × 6'),
          story('{b} fills 8 {conts} with 35 {many} each. How many {many}?', '{many}', 280, '8 × 35')]
      },
      p3: {
        items: [FA([[47, '×', 3], [68, '×', 4], [29, '×', 7], [56, '×', 8], [73, '×', 5], [94, '×', 6]]),
          story('{a} has 9 {conts} with 48 {many} in each. How many {many}?', '{many}', 432, '9 × 48'),
          story('{b} fills 7 {conts} with 65 {many} each. How many {many}?', '{many}', 455, '7 × 65'),
          { eq: ['38 × 6 = 180 + []'], a: [48] }, TF('25 × 4 = 20 × 4 + 5', false),
          { q: '49 is close to 50. Use 50 × 5 to find 49 × 5.', eq: ['50 × 5 = []', '49 × 5 = []'], a: [250, 245] }]
      },
      think: {
        items: [{ q: '{b} says 34 × 6 = 18 + 24 = 42. What went wrong?', lines: { n: 3, key: '{b} did 3 × 6, not 30 × 6. The 3 is 3 tens: 180 + 24 = 204.' } },
          { q: 'Draw an area model for 26 × 4.', draw: { h: 110, key: 'A rectangle 4 tall, cut into 20 and 6 wide: 80 + 24 = 104.' } },
          { q: 'Write a story for 18 × 5.', lines: { n: 3, key: 'For example: {a} fills 5 {conts} with 18 {many} each. That makes 90 {many}.' } },
          BIG('Which is more?', ['19 × 6', '21 × 5'], 0)]
      }
    },

    'three-digit': {
      watch: 'multiplying only the hundreds (246 × 3 = 600 + 40 + 6). Every part gets multiplied: tick each part once it is done.',
      goal: 'I can multiply a three-digit number by a one-digit number.',
      learn: {
        show: { pic: ['amodel', { a: 246, b: 3, fill: true }], cap: 'Break 246 into 200, 40 and 6', eq: ['600 + 120 + 18 = 738', '246 × 3 = 738'] },
        together: [AM(132, 4), AM(213, 3)],
        cue: 'Break into hundreds, tens and ones. Multiply every part. Add.',
        own: [P3(312, 3), P3(241, 2), P3(105, 5), P3(230, 4)]
      },
      p1: {
        show: { cap: 'Break 123 into 100, 20 and 3', eq: ['200 + 40 + 6 = 246', '123 × 2 = 246'] },
        items: [AM(122, 3), AM(211, 4), P3(143, 2), P3(310, 3), P3(132, 3), P3(201, 5)]
      },
      p2: {
        items: [FA([[214, '×', 4], [326, '×', 3], [152, '×', 6], [407, '×', 2], [245, '×', 4], [133, '×', 7]]),
          story('{a} has 4 {conts} with 125 {many} in each. How many {many}?', '{many}', 500, '4 × 125'),
          story('{b} has 6 {conts} with 115 {many} in each. How many {many}?', '{many}', 690, '6 × 115'),
          { eq: ['250 × 3 = 600 + []'], a: [150] }, TF('312 × 2 = 600 + 2 + 4', false), { eq: ['[] × 2 = 840'], a: [420] }]
      },
      p3: {
        items: [FA([[368, '×', 4], [729, '×', 3], [486, '×', 5], [915, '×', 7], [658, '×', 9], [607, '×', 8]]),
          story('{a} has 8 {conts} with 375 {many} in each. How many {many}?', '{many}', 3000, '8 × 375'),
          story('{b} has 9 {conts} with 249 {many} in each. How many {many}?', '{many}', 2241, '9 × 249'),
          { eq: ['[] × 5 = 2500'], a: [500] }, TF('405 × 6 = 2430', true), { eq: ['199 × 4 = 800 − []'], a: [4] }]
      },
      think: {
        items: [{ q: '{b} says 246 × 3 = 600 + 40 + 6 = 646. What went wrong?', lines: { n: 3, key: '{b} multiplied only the 200. Every part gets multiplied: 600 + 120 + 18 = 738.' } },
          { q: 'Find a product between 1000 and 1200. Show your work.', draw: { h: 110, key: 'For example: 275 × 4 = 1100, or 150 × 7 = 1050.' } },
          BIG('Which is more?', ['199 × 5', '201 × 4'], 0),
          { q: 'Write a story for 125 × 8.', lines: { n: 3, key: 'For example: {a} has 8 {conts} with 125 {many} in each. That makes 1000 {many}.' } }]
      }
    },

    share: {
      watch: 'a remainder as big as the number of groups (23 ÷ 4 = 4 R7). If the leftovers could fill every group again, share again.',
      goal: 'I can share into equal groups and find the remainder.',
      learn: {
        show: { pic: ['shareR', { t: 14, g: 4 }], cap: '3 each, 2 left', eq: ['4 × 3 + 2 = 14', '14 ÷ 4 = 3 R2'] },
        together: [SR(13, 4), SR(17, 5)],
        cue: 'Groups × number in each + remainder = the start number. The remainder is less than the number of groups.',
        own: [R(19, 3), R(22, 5), R(30, 4), R(25, 6)]
      },
      p1: {
        show: { pic: ['shareR', { t: 11, g: 2 }], cap: '5 each, 1 left', eq: ['11 ÷ 2 = 5 R1'] },
        items: [SR(9, 2), SR(11, 3), R(16, 5), R(23, 4), { eq: ['20 ÷ 4 = []'], a: [5] },
          { q: '{a} shares 15 {many} equally into 2 {conts}. How many in each? How many are left?', eq: ['15 ÷ 2 = [] R []'], a: [7, 1] }]
      },
      p2: {
        items: [R(38, 5), R(47, 6), R(53, 7), R(60, 8), { q: 'Check it: 29 ÷ 4 = 7 R1.', eq: ['4 × 7 + 1 = []'], a: [29] },
          { q: '{b} shares 34 {many} equally into 4 {conts}. How many in each? How many are left?', eq: ['34 ÷ 4 = [] R []'], a: [8, 2] }]
      },
      p3: {
        items: [R(67, 8), R(75, 9), R(58, 6), R(44, 5), { eq: ['[] ÷ 7 = 6 R 3'], a: [45] }, { q: 'Check 35 ÷ 4 = 8 R3 by multiplying.', eq: ['4 × 8 + 3 = []'], a: [35] }]
      },
      think: {
        items: [{ q: '{b} says 23 ÷ 4 = 4 R7. What went wrong?', lines: { n: 3, key: '7 is more than 4, so each group can get another one. 23 ÷ 4 = 5 R3.' } },
          { q: 'Find three numbers that leave 2 when shared into 5 groups.', lines: { n: 2, key: 'Any three of 7, 12, 17, 22, 27, 32 ...' } },
          { q: 'Write a sharing story for 26 ÷ 3.', lines: { n: 3, key: 'For example: {a} shares 26 {many} into 3 {conts}. Each gets 8 and 2 are left.' } },
          { q: 'What is the biggest remainder when you divide by 6? Why?', lines: { n: 3, key: '5. With 6 or more left, each group could get one more.' } }]
      }
    },

    bigger: {
      watch: 'dividing each digit on its own (87 ÷ 3 as 8 ÷ 3 and 7 ÷ 3) and losing the leftover tens. Ask: "What happens to the tens that do not share evenly?"',
      goal: 'I can divide a two- or three-digit number by a one-digit number.',
      learn: {
        show: { cap: '20 × 3 = 60', eq: ['87 − 60 = 27', '27 ÷ 3 = 9', '87 ÷ 3 = 29'] },
        together: [{ eq: ['4 × 10 = []', '76 − 40 = []', '36 ÷ 4 = []', '76 ÷ 4 = []'], a: [40, 36, 9, 19] },
          { eq: ['5 × 10 = []', '65 − 50 = []', '15 ÷ 5 = []', '65 ÷ 5 = []'], a: [50, 15, 3, 13] }],
        cue: 'Take away a tens fact first. Divide what is left. Add the two answers.',
        own: [{ eq: ['2 × 20 = []', '48 ÷ 2 = []'], a: [40, 24] }, { eq: ['84 ÷ 4 = []'], a: [21] }, { eq: ['72 ÷ 3 = []'], a: [24] }, { eq: ['90 ÷ 5 = []'], a: [18] }]
      },
      p1: {
        show: { cap: 'Split 64 into 60 and 4', eq: ['60 ÷ 2 = 30', '4 ÷ 2 = 2', '64 ÷ 2 = 32'] },
        items: [{ eq: ['40 ÷ 2 = []', '6 ÷ 2 = []', '46 ÷ 2 = []'], a: [20, 3, 23] }, { eq: ['60 ÷ 3 = []', '9 ÷ 3 = []', '69 ÷ 3 = []'], a: [20, 3, 23] },
          { eq: ['80 ÷ 4 = []', '8 ÷ 4 = []', '88 ÷ 4 = []'], a: [20, 2, 22] }, { eq: ['50 ÷ 5 = []', '5 ÷ 5 = []', '55 ÷ 5 = []'], a: [10, 1, 11] },
          { eq: ['39 ÷ 3 = []'], a: [13] }, { eq: ['96 ÷ 3 = []'], a: [32] }]
      },
      p2: {
        items: [{ eq: ['52 ÷ 4 = []'], a: [13] }, { eq: ['78 ÷ 3 = []'], a: [26] }, { eq: ['84 ÷ 6 = []'], a: [14] }, { eq: ['95 ÷ 5 = []'], a: [19] },
          story('{a} shares 72 {many} equally into 4 {conts}. How many {many} in each?', '{many}', 18, '72 ÷ 4'),
          story('{b} has 96 {many}, 8 in each {cont}. How many {conts}?', '{conts}', 12, '96 ÷ 8')]
      },
      p3: {
        items: [FA([[87, '÷', 3], [92, '÷', 4], [98, '÷', 7], [85, '÷', 5], [96, '÷', 6], [234, '÷', 2]]),
          R(85, 4), R(77, 3),
          story('{b} has 156 {many}, 6 in each {cont}. How many {conts}?', '{conts}', 26, '156 ÷ 6'),
          TF('84 ÷ 4 = 21', true), story('{a} shares 135 {many} equally into 5 {conts}. How many {many} in each?', '{many}', 27, '135 ÷ 5')]
      },
      think: {
        items: [{ q: '{b} says 87 ÷ 3 = 22: 8 ÷ 3 is 2, and 7 ÷ 3 is 2. What went wrong?', lines: { n: 3, key: '{b} lost the leftovers. 2 tens are left over, which is 27 ones with the 7. 27 ÷ 3 = 9, so it is 29.' } },
          { q: 'Check 96 ÷ 4 = 24 by multiplying.', eq: ['4 × 24 = []'], a: [96] },
          BIG('Which is more?', ['78 ÷ 3', '100 ÷ 4'], 0),
          { q: 'Write a story for 64 ÷ 4.', lines: { n: 3, key: 'For example: {a} shares 64 {many} equally into 4 {conts}. Each {cont} gets 16.' } }]
      }
    },

    leftovers: {
      watch: 'writing "6 R2 {conts}" as the answer. A remainder is not an answer to a real question. Ask: "Where do the 2 extra go?"',
      goal: 'I can decide what the leftovers mean in a story.',
      learn: {
        show: { eq: ['30 ÷ 4 = 7 R2', 'Round up: 8'] },
        together: [LO('{a} packs 26 {many}, 4 in each {cont}. How many {conts} for all?', 26, 4, true, '{conts}'),
          LO('{b} has 26 {many} in {conts} of 4. How many full {conts}?', 26, 4, false, 'full')],
        cue: 'The story decides. If every one needs a place, round up. If only full groups count, drop the leftovers.',
        own: [LO('{a} has 17 {many}. 5 fit in each {cont}. How many {conts} for all?', 17, 5, true, '{conts}'),
          LO('{b} has 22 {many} in {conts} of 3. How many full {conts}?', 22, 3, false, 'full'),
          LO('29 campers, 3 in each canoe. How many canoes?', 29, 3, true, 'canoes'),
          LO('{a} has 40 {many} in {conts} of 6. How many full {conts}?', 40, 6, false, 'full')]
      },
      p1: {
        show: { cap: '13 {many}, 2 in each {cont}. Round up.', eq: ['13 ÷ 2 = 6 R1', '7 needed'] },
        items: [LO('{a} has 11 {many}. 2 fit in each {cont}. How many {conts} for all?', 11, 2, true, '{conts}'),
          LO('{b} has 14 {many} in {conts} of 4. How many full {conts}?', 14, 4, false, 'full'),
          LO('{a} has 19 {many}. 5 fit in each {cont}. How many {conts} for all?', 19, 5, true, '{conts}'),
          LO('{b} has 25 {many} in {conts} of 3. How many full {conts}?', 25, 3, false, 'full'),
          LO('22 people ride in vans. 6 fit in each van. How many vans are needed?', 22, 6, true, 'vans'),
          LO('{a} has 31 {many} in {conts} of 10. How many full {conts}?', 31, 10, false, 'full')]
      },
      p2: {
        items: [LO('{a} has 38 {many}. 8 fit in each {cont}. How many {conts} for all?', 38, 8, true, '{conts}'),
          LO('{b} has 50 {many} in {conts} of 6. How many full {conts}?', 50, 6, false, 'full'),
          LO('45 campers sleep in tents. 4 fit in each tent. How many tents are needed?', 45, 4, true, 'tents'),
          LO('A baker has 70 eggs. A cake needs 3 eggs. How many cakes can be made?', 70, 3, false, 'cakes'),
          LO('{a} has 57 {many}. 7 fit in each {cont}. How many {conts} for all?', 57, 7, true, '{conts}'),
          LO('{b} has 63 {many} in {conts} of 5. How many full {conts}?', 63, 5, false, 'full')]
      },
      p3: {
        items: [LO('100 students go on a trip. A minivan holds 6. How many minivans are needed?', 100, 6, true, 'minivans'),
          LO('{a} has 125 {many} in {conts} of 8. How many full {conts}?', 125, 8, false, 'full'),
          LO('{b} has 98 {many}. 9 fit in each {cont}. How many {conts} for all?', 98, 9, true, '{conts}'),
          LO('A ribbon is 84 cm long. Each bow needs 9 cm. How many bows can be made?', 84, 9, false, 'bows'),
          LO('{a} has 150 {many}. 7 fit in each {cont}. How many {conts} for all?', 150, 7, true, '{conts}'),
          LO('{b} has 117 {many} in {conts} of 4. How many full {conts}?', 117, 4, false, 'full')]
      },
      think: {
        items: [{ q: '4 friends share 9 bannock loaves. How much does each get? Draw it.', draw: { h: 120, key: '2 whole loaves each, and the last loaf is cut into 4: each gets 2 and 1/4 loaves.' } },
          { q: 'Write a story for 23 ÷ 5 where the answer is 5.', lines: { n: 3, key: 'For example: 23 people, 5 in each canoe. They need 5 canoes, so round up.' } },
          { q: 'Write a story for 23 ÷ 5 where the answer is 4.', lines: { n: 3, key: 'For example: 23 {many} in {conts} of 5. Only 4 {conts} are full.' } },
          { q: '{b} says 26 people need 6 R2 vans. What would you tell {b}?', lines: { n: 3, key: 'You cannot have 6 R2 vans. The 2 extra people still need a ride, so they need 7 vans.' } }]
      }
    },

    rate: {
      watch: 'adding 1 to both columns of the table, or adding the rate once instead of multiplying. Read across: 1 and 6, 2 and 12.',
      goal: 'I can use a rate to find how many in all.',
      learn: {
        show: { pic: ['table', { head: ['{conts}', '{many}'], rows: [[1, 6], [4, 24]] }], eq: ['4 × 6 = 24'] },
        together: [TB('For every 1 {cont}, 5 {many}.', [[1, 5], [3, '[]']], [15]),
          story('Each {cont} holds 8 {many}. How many {many} in 6 {conts}?', '{many}', 48, '6 × 8')],
        cue: 'Know the amount for 1? Multiply to find the amount for more.',
        own: [story('Each {cont} holds 4 {many}. How many {many} in 3 {conts}?', '{many}', 12, '3 × 4'),
          story('Each {cont} holds 9 {many}. How many {many} in 7 {conts}?', '{many}', 63, '7 × 9'),
          story('{a} saves $5 each week. How much after 8 weeks?', 'dollars', 40, '8 × 5'),
          story('A cyclist rides 12 km each hour. How far in 3 hours?', 'km', 36, '3 × 12')]
      },
      p1: {
        show: { pic: ['table', { head: ['{conts}', '{many}'], rows: [[1, 3], [2, 6]] }], cap: 'For every 1 {cont}, 3 {many}', eq: ['2 × 3 = 6'] },
        items: [TB('For every 1 {cont}, 2 {many}.', [[1, 2], [3, '[]']], [6]),
          TB('For every 1 {cont}, 10 {many}.', [[1, 10], [5, '[]']], [50]),
          story('Each {cont} holds 5 {many}. How many {many} in 4 {conts}?', '{many}', 20, '4 × 5'),
          story('{b} saves $2 each day. How much after 9 days?', 'dollars', 18, '9 × 2'),
          story('Each {cont} holds 3 {many}. How many {many} in 7 {conts}?', '{many}', 21, '7 × 3'),
          story('A tap fills 4 L each minute. How much in 5 minutes?', 'L', 20, '5 × 4')]
      },
      p2: {
        items: [TB('For every 1 {cont}, 7 {many}.', [[1, 7], [3, '[]'], [5, '[]']], [21, 35]),
          story('Each {cont} holds 6 {many}. How many {many} in 9 {conts}?', '{many}', 54, '9 × 6'),
          story('{a} earns $8 each hour. How much in 6 hours?', 'dollars', 48, '6 × 8'),
          story('A canoe travels 4 km each hour. How far in 7 hours?', 'km', 28, '7 × 4'),
          TB('For every 1 {cont}, 9 {many}.', [[1, 9], [2, '[]'], [4, '[]']], [18, 36]),
          story('A hen lays 6 eggs each week. How many in 10 weeks?', 'eggs', 60, '10 × 6')]
      },
      p3: {
        items: [TB('For every 1 {cont}, 12 {many}.', [[1, 12], [4, '[]'], [8, '[]']], [48, 96]),
          story('Each {cont} holds 25 {many}. How many {many} in 6 {conts}?', '{many}', 150, '6 × 25'),
          story('A train travels 80 km each hour. How far in 4 hours?', 'km', 320, '4 × 80'),
          story('{b} reads 15 pages each day. How many pages in 7 days?', 'pages', 105, '7 × 15'),
          TB('For every 1 {cont}, 8 {many}.', [[1, 8], [5, '[]'], [10, '[]']], [40, 80]),
          story('A pump moves 35 L each minute. How much in 9 minutes?', 'L', 315, '9 × 35')]
      },
      think: {
        items: [{ q: 'Make your own rate table with 4 rows.', draw: { h: 130, key: 'Any table where each row is the first number times the same rate, for example 1 and 7, 2 and 14, 3 and 21, 4 and 28.' } },
          { q: '{b} says 1 {cont} has 6 {many}, so 2 {conts} have 7. What went wrong?', lines: { n: 3, key: '{b} added 1. Each {cont} adds 6 more: 2 {conts} have 12.' } },
          { q: 'Write a rate story for 5 × 9.', lines: { n: 3, key: 'For example: each {cont} holds 9 {many}. 5 {conts} hold 45 {many}.' } },
          { q: '{a} saves $7 a week. {b} has $40 now and saves nothing. Who has more after 6 weeks?', lines: { n: 2, key: '{a}: 6 × 7 = 42 dollars, which is more than 40.' } }]
      }
    },

    'how-many': {
      watch: 'multiplying when the total is already known (8 × 40). Ask: "Do we know the total, or the amount for one?"',
      goal: 'I can use a rate to find how many it takes to reach a total.',
      learn: {
        show: { cap: '8 km each hour. How long for 40 km?', eq: ['8, 16, 24, 32, 40', '40 ÷ 8 = 5'] },
        together: [{ q: 'Each {cont} holds 6 {many}. How many {conts} for 42 {many}?', eq: ['6, 12, 18, 24, 30, 36, []', '42 ÷ 6 = []'], a: [42, 7] },
          story('{a} saves $5 each week. How many weeks to save $35?', 'weeks', 7, '35 ÷ 5')],
        cue: 'Total ÷ amount for each = how many.',
        own: [story('Each {cont} holds 4 {many}. How many {conts} for 28 {many}?', '{conts}', 7, '28 ÷ 4'),
          story('A cyclist rides 9 km each hour. How many hours to ride 54 km?', 'hours', 6, '54 ÷ 9'),
          story('Each {cont} holds 8 {many}. How many {conts} for 64 {many}?', '{conts}', 8, '64 ÷ 8'),
          story('A tap fills 3 L each minute. How many minutes to fill 27 L?', 'minutes', 9, '27 ÷ 3')]
      },
      p1: {
        show: { cap: '2 {many} in each {cont}. 10 {many}?', eq: ['2, 4, 6, 8, 10', '10 ÷ 2 = 5'] },
        items: [{ q: 'Count by 3s to 15.', eq: ['3, 6, [], [], []', '15 ÷ 3 = []'], a: [9, 12, 15, 5] },
          story('Each {cont} holds 2 {many}. How many {conts} for 16 {many}?', '{conts}', 8, '16 ÷ 2'),
          story('Each {cont} holds 10 {many}. How many {conts} for 70 {many}?', '{conts}', 7, '70 ÷ 10'),
          story('{b} saves $3 each day. How many days to save $15?', 'days', 5, '15 ÷ 3'),
          story('Each {cont} holds 5 {many}. How many {conts} for 45 {many}?', '{conts}', 9, '45 ÷ 5'),
          story('A tap fills 4 L each minute. How many minutes to fill 24 L?', 'minutes', 6, '24 ÷ 4')]
      },
      p2: {
        items: [story('Each {cont} holds 7 {many}. How many {conts} for 56 {many}?', '{conts}', 8, '56 ÷ 7'),
          story('A canoe travels 6 km each hour. How many hours to go 48 km?', 'hours', 8, '48 ÷ 6'),
          story('{a} earns $9 each hour. How many hours to earn $72?', 'hours', 8, '72 ÷ 9'),
          story('Each {cont} holds 6 {many}. How many {conts} for 54 {many}?', '{conts}', 9, '54 ÷ 6'),
          TB('For every 1 {cont}, 8 {many}. Fill in the {conts}.', [[1, 8], ['[]', 32], ['[]', 64]], [4, 8]),
          story('A hen lays 5 eggs each week. How many weeks to lay 40 eggs?', 'weeks', 8, '40 ÷ 5')]
      },
      p3: {
        items: [story('Each {cont} holds 12 {many}. How many {conts} for 96 {many}?', '{conts}', 8, '96 ÷ 12'),
          story('A train travels 90 km each hour. How many hours to go 360 km?', 'hours', 4, '360 ÷ 90'),
          story('{b} reads 15 pages each day. How many days to read 120 pages?', 'days', 8, '120 ÷ 15'),
          TB('For every 1 {cont}, 25 {many}. Fill in the {conts}.', [[1, 25], ['[]', 100], ['[]', 200]], [4, 8]),
          story('A pump moves 40 L each minute. How many minutes to move 280 L?', 'minutes', 7, '280 ÷ 40'),
          story('Each {cont} holds 9 {many}. How many {conts} for 81 {many}?', '{conts}', 9, '81 ÷ 9')]
      },
      think: {
        items: [{ q: '{b} says: 8 km each hour, 40 km, so 8 × 40 = 320 hours. What went wrong?', lines: { n: 3, key: '{b} multiplied, but the total is known. Divide: 40 ÷ 8 = 5 hours.' } },
          { q: '{a} saves $6 a week. Is 9 weeks long enough to save $50?', lines: { n: 3, key: 'Yes. 9 × 6 = 54, which is more than 50. 8 weeks would give only 48.' } },
          { q: 'Write a story for 63 ÷ 7 = 9 about a rate.', lines: { n: 3, key: 'For example: each {cont} holds 7 {many}. 63 {many} need 9 {conts}.' } },
          { q: 'Which takes more weeks: $40 at $5 a week, or $42 at $7 a week?', lines: { n: 2, key: '$40 at $5 a week: 8 weeks. $42 at $7 a week is only 6 weeks.' } }]
      }
    }
  } });
})();
