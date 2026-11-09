/* Grade 2 Numbers to 200: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the
   lessons in chapters/numbers-200.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.1 read, represent, compose and decompose numbers to 200, and their everyday uses; B1.2 compare and order;
   B1.3 estimate collections up to 200 and count to check; B1.4 count to 200, including by 20s, 25s and 50s; B1.5 even and odd.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function blk(n) { return ['blocks', { h: Math.floor(n / 100), t: Math.floor(n / 10) % 10, o: n % 10 }]; }
  /* rods and loose cubes: how many tens and ones, and the number */
  function TO(t, o) { return { pic: ['blocks', { h: 0, t: t, o: o }], eq: ['[] tens [] ones = []'], a: [t + Math.floor(o / 10), o % 10, 10 * t + o] }; }
  /* blocks to a number */
  function BK(n) { return { pic: blk(n), eq: ['[]'], a: [n] }; }
  /* h flats and t rods: how many tens, and what number */
  function TN(h, t) { return { pic: ['blocks', { h: h, t: t, o: 0 }], eq: ['[] tens = []'], a: [h * 10 + t, (h * 10 + t) * 10] }; }
  /* a number into hundreds, tens and ones (a whole row) */
  function HTO(n) { return { eq: [n + ' = [] hundreds [] tens [] ones'], a: [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10], wide: true }; }
  /* expanded form: one blank for each place that is not 0 */
  function EX(n) {
    var parts = String(n).split('').map(function (c, i, all) { return +c * Math.pow(10, all.length - 1 - i); }).filter(Boolean);
    return { eq: [n + ' = ' + parts.map(function () { return '[]'; }).join(' + ')], a: parts, expanded: true };
  }
  function ST(parts) { return { eq: [parts.join(' + ') + ' = []'], a: [parts.reduce(function (x, y) { return x + y; }, 0)] }; }
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function inWords(n) {
    var h = Math.floor(n / 100), r = n % 100, out = [];
    if (h) out.push(ONES[h] + ' hundred');
    if (r >= 20) out.push(TENS[Math.floor(r / 10)] + (r % 10 ? '-' + ONES[r % 10] : ''));
    else if (r || !h) out.push(ONES[r]);
    return out.join(' ');
  }
  function W2N(n) { return { q: 'Write ' + inWords(n) + '.', words: inWords(n), eq: ['[]'], a: [n] }; }
  function N2W(n) { return { q: 'Write ' + n + ' in words.', lines: { n: 1, key: inWords(n) }, spell: n }; }
  /* a count: the numbers shown, then blanks ('[]' in the list); by is the step */
  function CT(q, list, by, wide) {
    var a = [], eq = list.map(function (v, i) { var last = i === list.length - 1; if (v === '[]') { a.push(null); return last ? '[]' : '[],'; } return last ? String(v) : v + ','; }).join(' ');
    var first = list.filter(function (v) { return v !== '[]'; })[0], at = list.indexOf(first);
    list.forEach(function (v, i) { if (v === '[]') a[a.indexOf(null)] = first + (i - at) * by; });
    return { q: q, eq: [eq], a: a, by: by, wide: wide };
  }
  function CM(x, y) { return { eq: [x + ' [] ' + y], a: [x < y ? '<' : x > y ? '>' : '='] }; }
  function OR(list, wide) { var s = list.slice().sort(function (x, y) { return x - y; }); return { q: 'Order from least: ' + list.join(', '), eq: [s.map(function () { return '[]'; }).join(' < ')], a: s, set: list, wide: wide }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  function GR(list) { var m = Math.max.apply(null, list); return { q: 'Circle the greatest.', pick: { opts: list.map(String), ans: list.indexOf(m), big: true } }; }
  function LS(list) { var m = Math.min.apply(null, list); return { q: 'Circle the least.', pick: { opts: list.map(String), ans: list.indexOf(m), small: true } }; }
  /* even or odd, with or without the pairs picture */
  function EO(n, pic) { return { q: pic ? 'Make pairs. Even or odd?' : 'Is ' + n + ' even or odd?', pic: pic ? ['pairs', { n: n }] : null, pick: { opts: ['even', 'odd'], ans: n % 2, parity: n } }; }
  function EOP(n) { var it = EO(n, true); it.eq = ['[] {many}']; it.a = [n]; it.q = 'How many? Even or odd?'; it.pickLast = true; return it; }
  /* estimate the scattered dots: the closest choice */
  function ES(t, opts) {
    var d = opts.map(function (o) { return Math.abs(o - t); }), best = d.indexOf(Math.min.apply(null, d));
    return { q: 'Circle the best estimate.', pic: ['scatter', { t: t }], pick: { opts: opts.map(String), ans: best, near: true } };
  }
  function JB(thing, ans) { return { q: thing.charAt(0).toUpperCase() + thing.slice(1) + ': the number', pick: { opts: ['counts', 'orders', 'names', 'measures'], ans: ans, job: thing } }; }

  S.register('numbers-200', { code: 'N', ideas: {

    ten: {
      watch: 'counting a rod as 1. Ask: "How many cubes are stuck together in one rod?"',
      goal: 'I can trade 10 ones for 1 ten.',
      learn: {
        show: { pic: ['blocks', { h: 0, t: 1, o: 4 }], cap: '10 ones make 1 rod', eq: ['14 = 1 ten 4 ones', '14'] },
        together: [{ pic: ['blocks', { h: 0, t: 0, o: 12 }], eq: ['12 = [] ten [] ones'], a: [1, 2] }, TO(2, 3)],
        cue: 'Every 10 ones make 1 ten. Count the tens first.',
        own: [TO(1, 6), { eq: ['10 ones = [] ten'], a: [1] }, { eq: ['3 tens = [] ones'], a: [30] }, { eq: ['[] tens = 50'], a: [5] }]
      },
      p1: {
        show: { pic: ['blocks', { h: 0, t: 2, o: 5 }], cap: '2 rods, 5 cubes', eq: ['2 tens 5 ones = 25'] },
        items: [TO(1, 7), TO(4, 2), TO(2, 9), TO(5, 0), { eq: ['2 tens = [] ones'], a: [20] }, { eq: ['50 ones = [] tens'], a: [5] }]
      },
      p2: {
        items: [TO(3, 6), TO(6, 1), { eq: ['15 = [] ten [] ones'], a: [1, 5] },
          { eq: ['7 tens = [] ones'], a: [70] }, { eq: ['[] tens = 90 ones'], a: [9] },
          story('{a} puts 10 {many} in each {cont}. {a} fills 4 {conts}. How many {many}?', '{many}', 40, '4 × 10')]
      },
      p3: {
        items: [{ eq: ['18 = [] ten [] ones'], a: [1, 8] }, { eq: ['3 tens 14 ones = []'], a: [44], wide: true },
          { eq: ['[] tens = 80 ones'], a: [8] }, { eq: ['6 tens = [] ones'], a: [60] },
          story('{b} has 3 full {conts} of 10 {many} and 8 loose. How many {many}?', '{many}', 38, '3 × 10 + 8'), TF('2 tens 13 ones = 33', true)]
      },
      think: {
        items: [{ q: '{a} says 1 ten is the same as 1 one. What would you tell {a}?', lines: { n: 2, key: '1 ten is 10 ones stuck together, so it is worth 10.' } },
          { q: 'Draw 26 with rods and cubes.', draw: { h: 70, key: ['blocks', { h: 0, t: 2, o: 6 }] } },
          { q: 'Why do we group ones into tens?', lines: { n: 2, key: 'Counting by tens is faster than counting one at a time.' } },
          { q: 'Show 31 two ways: with rods, and with more cubes.', draw: { h: 70, key: '3 rods and 1 cube, or 2 rods and 11 cubes.' } }]
      }
    },

    count: {
      watch: 'counting every cube from 1. Count the rods by tens first: 10, 20, 30, then on by ones.',
      goal: 'I can count the tens, then the ones.',
      learn: {
        show: { pic: ['blocks', { h: 0, t: 4, o: 3 }], cap: '10, 20, 30, 40, then 41, 42, 43', eq: ['43'] },
        together: [BK(35), BK(52)],
        cue: 'Count the rods by tens. Then count on by ones.',
        own: [BK(27), BK(61), BK(48), BK(70)]
      },
      p1: {
        show: { pic: ['blocks', { h: 0, t: 3, o: 2 }], cap: '10, 20, 30, 31, 32', eq: ['32'] },
        items: [BK(24), BK(56), BK(39), BK(80), BK(63), BK(45)]
      },
      p2: {
        items: [BK(74), BK(58), CT('Count by tens.', [23, 33, 43, '[]', '[]'], 10), CT('Count on by ones.', [57, 58, '[]', '[]', 61], 1),
          story('{a} has 6 {conts} of 10 {many} and 7 more. How many {many}?', '{many}', 67, '6 × 10 + 7'), BK(91)]
      },
      p3: {
        items: [CT('Count by tens.', [46, 56, '[]', '[]', 86, '[]'], 10, true), CT('Count by tens.', [130, 140, '[]', '[]', 170, '[]'], 10, true),
          { eq: ['8 tens 6 ones = []'], a: [86] }, { eq: ['9 tens 9 ones = []'], a: [99] },
          story('{b} has 7 {conts} of 10 {many} and 12 loose. How many {many}?', '{many}', 82, '7 × 10 + 12'), CT('Count back by tens.', [95, 85, '[]', '[]'], -10)]
      },
      think: {
        items: [{ q: '{b} counted 4 rods and 2 cubes as "1, 2, 3, 4, 5, 6". What went wrong?', lines: { n: 2, key: 'Each rod is 10. Count 10, 20, 30, 40, then 41, 42.' } },
          { q: 'Draw blocks for 75. How do you know you are right?', draw: { h: 70, key: '7 rods and 5 cubes: 10, 20 ... 70, then 71 to 75.' } },
          { q: 'Which is faster to count: 54 cubes, or 5 rods and 4 cubes? Why?', lines: { n: 2, key: '5 rods and 4 cubes: 9 counts instead of 54.' } },
          { q: 'Count by tens from 7 to 97. How many tens did you count?', lines: { n: 2, key: '17, 27, 37 ... 97: 9 tens.' } }]
      }
    },

    hundred: {
      watch: 'counting the flat as 10. Ask: "How many rods make the flat?" 10 rods of 10 is 100.',
      goal: 'I can see 10 tens as 1 hundred.',
      learn: {
        show: { pic: ['blocks', { h: 0, t: 10, o: 0 }], cap: '10, 20, 30 … 100', eq: ['10 tens = 100'] },
        together: [TN(1, 0), TN(1, 2)],
        cue: 'Count the rods by tens. 10 tens make 1 hundred.',
        own: [TN(0, 8), TN(1, 5), { eq: ['10 tens = []'], a: [100] }, { eq: ['20 tens = []'], a: [200] }]
      },
      p1: {
        show: { pic: ['blocks', { h: 1, t: 0, o: 0 }], cap: '1 flat is 1 hundred', eq: ['1 hundred = 10 tens'] },
        items: [TN(1, 1), TN(0, 9), TN(1, 4), TN(1, 7), TN(2, 0), CT('Count by tens.', [70, 80, 90, '[]', '[]'], 10)]
      },
      p2: {
        items: [TN(1, 3), TN(1, 8), { eq: ['[] tens = 160'], a: [16] }, { eq: ['[] tens = 190'], a: [19] },
          story('{a} has 10 {conts} with 10 {many} in each. How many {many}?', '{many}', 100, '10 × 10'), TF('12 tens = 120', true)]
      },
      p3: {
        items: [{ eq: ['15 tens = []', '[] tens = 110'], a: [150, 11] }, { eq: ['1 hundred = [] tens'], a: [10] },
          story('{b} has 140 {many} in {conts} of 10. How many {conts}?', '{conts}', 14, '140 ÷ 10'), CT('Count by tens.', [150, 160, '[]', '[]', '[]'], 10, true),
          TF('1 hundred = 100 tens', false), { eq: ['200 = [] tens'], a: [20] }]
      },
      think: {
        items: [{ q: '{a} says 12 tens is 12. Is {a} right? Why?', lines: { n: 2, key: 'No. Each ten is 10, so 12 tens is 120.' } },
          { q: 'Draw 130 in two ways.', draw: { h: 80, key: '1 flat and 3 rods, or 13 rods.' } },
          { q: 'How many tens are in 200? How do you know?', lines: { n: 2, key: '20 tens. 10 tens make 100, so 200 is 10 tens and 10 tens.' } },
          { q: 'Which is more?', pick: { opts: ['15 tens', '1 hundred'], ans: 0, big: true } }]
      }
    },

    build: {
      watch: 'writing the blocks as they lie (10045 for a flat, 4 rods and 5 cubes). Read flats, then rods, then cubes.',
      goal: 'I can read and build numbers to 200.',
      learn: {
        show: { pic: ['blocks', { h: 1, t: 4, o: 7 }], cap: '100, 110 … 140, then 141 … 147', eq: ['1 hundred 4 tens 7 ones', '147'] },
        together: [BK(125), BK(163)],
        cue: 'Flats are hundreds, rods are tens, cubes are ones. Read them in that order.',
        own: [BK(132), BK(114), BK(158), BK(176)]
      },
      p1: {
        show: { pic: ['blocks', { h: 1, t: 2, o: 3 }], cap: '1 flat, 2 rods, 3 cubes', eq: ['123'] },
        items: [BK(116), BK(141), BK(135), BK(182), BK(167), BK(129)]
      },
      p2: {
        items: [HTO(154), HTO(178), BK(193),
          { q: 'Draw 136 with blocks.', draw: { h: 70, key: ['blocks', { h: 1, t: 3, o: 6 }] } },
          story('{a} has 1 {cont} of 100 {many}, 4 {conts} of 10 and 2 more. How many {many}?', '{many}', 142, '100 + 4 × 10 + 2'),
          { eq: ['1 hundred 6 tens 5 ones = []'], a: [165], wide: true }]
      },
      p3: {
        items: [HTO(187), HTO(199), { eq: ['1 hundred 9 tens 4 ones = []'], a: [194], wide: true },
          { q: 'Draw 171 with blocks.', draw: { h: 70, key: ['blocks', { h: 1, t: 7, o: 1 }] } },
          story('{b} has 1 {cont} of 100 {many} and 8 {conts} of 10. How many {many}?', '{many}', 180, '100 + 8 × 10'), { eq: ['2 hundreds = []'], a: [200] }]
      },
      think: {
        items: [{ q: '{b} wrote 10035 for 1 flat, 3 rods and 5 cubes. What went wrong?', lines: { n: 2, key: '{b} wrote 100 and 35 side by side. It is 135.' } },
          { q: 'You have 1 flat and some rods. Draw a number between 140 and 160.', draw: { h: 80, key: 'For example: 1 flat and 5 rods make 150.' } },
          { q: 'Which number needs the most blocks?', pick: { opts: ['200', '99', '111'], ans: 1, blocks: true }, lines: { n: 1, key: '99: 9 rods and 9 cubes is 18 blocks.' } },
          { q: 'Write a number with more cubes than rods. Draw it.', draw: { h: 70, key: 'For example: 127 is 1 flat, 2 rods and 7 cubes.' } }]
      }
    },

    zero: {
      watch: 'leaving out the 0 (writing 17 for 107). Ask: "Are there any tens? Then what goes in the tens place?"',
      goal: 'I can use 0 to hold an empty place.',
      learn: {
        show: { pic: ['blocks', { h: 1, t: 0, o: 7 }], cap: '1 flat, no rods, 7 cubes', eq: ['1 hundred 0 tens 7 ones', '107'] },
        together: [BK(104), BK(160)],
        cue: 'A place with nothing in it still gets a digit: 0.',
        own: [BK(109), BK(130), BK(100), BK(102)]
      },
      p1: {
        show: { pic: ['blocks', { h: 1, t: 5, o: 0 }], cap: '0 cubes', eq: ['150'] },
        items: [BK(103), BK(170), BK(108), BK(120), BK(190), BK(105)]
      },
      p2: {
        items: [HTO(106), HTO(180), W2N(101), W2N(140),
          { q: 'Circle 1 hundred and 6 ones.', pick: { opts: ['16', '106', '160'], ans: 1, val: 106 } }, { eq: ['1 hundred 0 tens 9 ones = []'], a: [109], wide: true }]
      },
      p3: {
        items: [HTO(200), HTO(110), W2N(107), W2N(190),
          { q: 'Circle 1 hundred and 7 tens.', pick: { opts: ['17', '107', '170'], ans: 2, val: 170 } }, { eq: ['1 hundred 4 ones = []'], a: [104] }]
      },
      think: {
        items: [{ q: '{b} wrote 15 for 1 hundred and 5 ones. What went wrong?', lines: { n: 2, key: '{b} left out the 0 for the tens. It is 105.' } },
          { q: 'Are 108 and 180 the same? Draw both.', draw: { h: 80, key: 'No. 108 is a flat and 8 cubes. 180 is a flat and 8 rods.' } },
          { q: 'Write every number you can make with 1, 0 and 5. No number may start with 0.', lines: { n: 2, key: '105, 150, 501, 510.' } },
          { q: 'Why do we need the 0 in 103?', lines: { n: 2, key: 'Without it, 1 hundred and 3 ones would look like 13.' } }]
      }
    },

    ways: {
      watch: 'thinking a number can only be built one way. Break 1 flat into 10 rods and count again: the number is the same.',
      goal: 'I can show one number in many ways.',
      learn: {
        show: { pic: ['blocks', { h: 0, t: 13, o: 4 }], cap: '13 rods and 4 cubes', eq: ['130 + 4', '134'] },
        together: [{ eq: ['134 = [] tens 4 ones'], a: [13], wide: true }, { eq: ['134 = 12 tens [] ones'], a: [14], wide: true }],
        cue: 'Break 1 hundred into 10 tens, or 1 ten into 10 ones. The number stays the same.',
        own: [{ eq: ['125 = [] tens 5 ones'], a: [12], wide: true }, { eq: ['52 = 4 tens [] ones'], a: [12], wide: true }, ST([100, 50, 6]), ST([120, 36])]
      },
      p1: {
        show: { cap: 'Break the hundred', eq: ['100 = 10 tens'] },
        items: [{ eq: ['110 = [] tens'], a: [11] }, { eq: ['150 = [] tens'], a: [15] }, { eq: ['34 = 2 tens [] ones'], a: [14] }, { eq: ['47 = 3 tens [] ones'], a: [17] },
          { eq: ['142 = [] tens 2 ones'], a: [14], wide: true }, { eq: ['168 = [] tens 8 ones'], a: [16], wide: true }]
      },
      p2: {
        items: [{ eq: ['136 = 1 hundred 2 tens [] ones'], a: [16], wide: true }, { eq: ['153 = [] tens 13 ones'], a: [14], wide: true },
          ST([140, 15]), ST([100, 70, 12]),
          { q: 'Circle the one that is 145.', pick: { opts: ['13 tens 15 ones', '14 tens 15 ones'], ans: 0, val: 145 }, wide: true },
          { q: 'Show 62 two ways with rods and cubes.', draw: { h: 60, key: '6 rods and 2 cubes, or 5 rods and 12 cubes.' } }]
      },
      p3: {
        items: [{ eq: ['187 = 17 tens [] ones'], a: [17], wide: true }, { eq: ['200 = 1 hundred [] tens'], a: [10], wide: true },
          ST([90, 25]), ST([60, 60, 8]), { eq: ['171 = [] + 71'], a: [100] }, { eq: ['158 = 130 + []'], a: [28] }]
      },
      think: {
        items: [{ q: '{a} says 14 tens and 3 ones is not the same as 143. Is {a} right?', lines: { n: 2, key: 'No. 14 tens is 140, so 14 tens and 3 ones is 143.' } },
          { q: 'Show 120 three ways. Draw or write.', draw: { h: 80, key: '1 flat and 2 rods; 12 rods; 11 rods and 10 cubes.' } },
          { q: 'Why does breaking a ten not change the number?', lines: { n: 2, key: '1 ten and 10 ones are the same amount. Only the blocks change.' } },
          { q: 'Write 165 as tens and ones only.', lines: { n: 1, key: '16 tens 5 ones (or 15 tens 15 ones).' } }]
      }
    },

    words: {
      watch: 'writing "one hundred twelve" as 10012. Write the hundred, then the last two digits as one number.',
      goal: 'I can read and write numbers in words.',
      learn: {
        show: { cap: 'Say the hundred, then the rest', eq: ['one hundred forty-seven', '147'] },
        together: [W2N(125), N2W(64)],
        cue: 'Say the hundred first. Then say the last two digits as one number.',
        own: [W2N(38), W2N(113), N2W(90), N2W(150)]
      },
      p1: {
        show: { cap: 'one hundred sixty-one', eq: ['161'] },
        items: [W2N(46), W2N(79), W2N(120), N2W(53), N2W(85), W2N(172)]
      },
      p2: {
        items: [W2N(117), W2N(198), N2W(131), N2W(142), W2N(200),
          { q: 'Circle one hundred twelve.', pick: { opts: ['10012', '112', '120'], ans: 1, nw: 'one hundred twelve' } }]
      },
      p3: {
        items: [W2N(183), W2N(115), N2W(166), N2W(197), N2W(119),
          { q: 'Circle one hundred eight.', pick: { opts: ['108', '180', '1008'], ans: 0, nw: 'one hundred eight' } }]
      },
      think: {
        items: [{ q: '{b} wrote 10050 for one hundred fifty. What went wrong?', lines: { n: 2, key: '{b} wrote 100 and 50 side by side. It is 150.' } },
          { q: 'Which word do 13 and 30 share? How are they different?', lines: { n: 2, key: 'Both say "thir". Thirteen is 1 ten 3 ones; thirty is 3 tens.' } },
          { q: 'Write a number between 150 and 200 in words and in digits.', lines: { n: 1, key: 'For example: one hundred seventy-five, 175.' } },
          { q: 'Write the numbers from 98 to 101 in words.', lines: { n: 2, key: 'ninety-eight, ninety-nine, one hundred, one hundred one' } }]
      }
    },

    expanded: {
      watch: 'writing 1 + 4 + 6 for 146. Ask: "What is the 4 worth?" Each part is a digit and its place.',
      goal: 'I can show what each digit is worth.',
      learn: {
        show: { pic: ['pv', { n: 146 }], cap: 'One part for each place', eq: ['100 + 40 + 6', '146 = 100 + 40 + 6'] },
        together: [EX(153), ST([100, 20, 8])],
        cue: 'Write what each digit is worth, joined with +.',
        own: [EX(72), EX(184), ST([100, 60, 3]), ST([50, 9])]
      },
      p1: {
        show: { cap: 'Each digit and its place', eq: ['137 = 100 + 30 + 7'] },
        items: [EX(65), EX(128), ST([100, 10, 5]), ST([80, 4]), EX(171), ST([100, 90, 6])]
      },
      p2: {
        items: [EX(109), EX(160), ST([100, 7]), ST([100, 50]), { q: 'Circle 100 + 3.', pick: { opts: ['13', '103', '130'], ans: 1, val: 103 } },
          { pic: ['pv', { n: 182, blank: true }], q: 'Write 100 + 80 + 2 in the chart.', a: [1, 8, 2] }]
      },
      p3: {
        items: [ST([6, 100, 40]), ST([20, 3, 100]), EX(195), { eq: ['100 + [] + 4 = 174'], a: [70] }, { eq: ['[] + 30 + 9 = 139'], a: [100] },
          { q: 'Circle the one that equals 150.', pick: { opts: ['100 + 5', '100 + 50', '10 + 50'], ans: 1, val: 150 }, wide: true }]
      },
      think: {
        items: [{ q: '{a} wrote 100 + 20 + 5 = 100205. What went wrong?', lines: { n: 2, key: 'The parts were written side by side. 100 + 20 + 5 = 125.' } },
          { q: 'Is 100 + 6 the same as 160? Why?', lines: { n: 2, key: 'No. 100 + 6 = 106. 160 is 100 + 60.' } },
          { q: 'The 4 in 48 and the 4 in 84. Which is worth more?', lines: { n: 2, key: 'The 4 in 48: it is 4 tens, worth 40. In 84 it is worth 4.' } },
          { q: 'Write 138 in expanded form. Then draw it with blocks.', draw: { h: 70, key: '100 + 30 + 8: 1 flat, 3 rods, 8 cubes.' } }]
      }
    },

    uses: {
      watch: 'thinking every number counts. Ask: "Is there really this many?" Room 114 does not mean 114 rooms.',
      goal: 'I can tell what job a number does.',
      learn: {
        show: { cap: 'Room 114 is a name, not 114 rooms', eq: ['count, order, name, measure', 'Room 114: a name'] },
        together: [JB('pages in a book', 0), JB('a ribbon 60 cm long', 3)],
        cue: 'Ask: does it count, put in order, name, or measure?',
        own: [JB('bus number 120', 2), JB('the 100th day of school', 1), JB('children in a gym', 0), JB('a plant 35 cm tall', 3)]
      },
      p1: {
        show: { cap: 'There are 34 children', eq: ['34 children: it counts'] },
        items: [JB('apples in a box', 0), JB('room 114', 2), JB('the 3rd in line', 1), JB('a 5 m rope', 3), JB('jersey number 17', 2), JB('cars in a lot', 0)]
      },
      p2: {
        items: [JB('the 25th of May', 1), JB('house number 186', 2), JB('a pool 25 m long', 3), JB('stickers on a page', 0), JB('floor 12 of a building', 1), JB('a 30 minute show', 3)]
      },
      p3: {
        items: [JB('phone number 905', 2), JB('the 2nd place runner', 1), JB('a ribbon 60 cm long', 3), JB('pages in a book', 0),
          { q: 'Write a number that names something. What does it name?', lines: { n: 1, key: 'For example: bus 52, room 18, jersey 9.' }, wide: true },
          { q: 'Write a number that measures something. What does it measure?', lines: { n: 1, key: 'For example: a desk 70 cm wide, a 20 minute walk.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says bus 120 carries 120 people. Is {a} right?', lines: { n: 2, key: 'No. 120 is the name of the bus. It does not count people.' } },
          { q: 'Find 3 numbers at home. What job does each one do?', lines: { n: 3, key: 'For example: 12 eggs (counts), clock 7:00 (measures time), house 186 (names).' } },
          { q: 'Can the same number do two jobs? Give an example.', lines: { n: 2, key: 'Yes: 25 can count 25 apples, or name the 25th of May.' } },
          { q: 'Why does a sports team put numbers on jerseys?', lines: { n: 2, key: 'To name each player, so people can tell them apart.' } }]
      }
    },

    greater: {
      watch: 'deciding by the first digit only (98 > 102). Compare the hundreds first: 102 has a hundred and 98 does not.',
      goal: 'I can tell which number is greater.',
      learn: {
        show: { pic: ['row', { list: [blk(126), blk(162)], labels: ['126', '162'] }], cap: 'Same hundreds: compare the tens', eq: ['6 tens > 2 tens', '162 is greater'] },
        together: [GR([145, 154]), GR([98, 102])],
        cue: 'Compare the hundreds first. If they match, compare the tens, then the ones.',
        own: [GR([67, 76]), GR([118, 181]), GR([130, 103]), GR([199, 200])]
      },
      p1: {
        show: { cap: 'More tens wins', eq: ['84 is greater than 48'] },
        items: [GR([53, 35]), GR([71, 69]), GR([120, 112]), GR([94, 49]), GR([150, 105]), GR([188, 177])]
      },
      p2: {
        items: [GR([109, 99, 190]), GR([146, 164, 156]), LS([82, 128, 28]), LS([170, 107, 117]),
          { q: '{a} has 135 {many}. {b} has 153 {many}. Who has more?', pick: { opts: ['{a}', '{b}'], ans: 1, more: ['135', '153'] } },
          { q: 'Circle a number between 186 and 200.', pick: { opts: ['168', '192', '210'], ans: 1, between: [186, 200] } }]
      },
      p3: {
        items: [GR([119, 191, 109, 190]), LS([142, 124, 214, 141]),
          { q: '{a} has 98 {many}. {b} has 101 {many}. Who has more?', pick: { opts: ['{a}', '{b}'], ans: 1, more: ['98', '101'] } },
          { q: 'Circle a number between 150 and 160.', pick: { opts: ['145', '156', '165'], ans: 1, between: [150, 160] } },
          GR([77, 107, 170]), LS([200, 20, 102])]
      },
      think: {
        items: [{ q: '{b} says 98 is greater than 102 because 9 is big. What would you tell {b}?', lines: { n: 2, key: '102 has 1 hundred and 98 has none, so 102 is greater.' } },
          { q: 'Draw blocks to show that 141 is greater than 114.', draw: { h: 80, key: 'Both have 1 flat. 141 has 4 rods; 114 has only 1 rod.' } },
          { q: 'Use 1, 5 and 8. Make the greatest number you can.', eq: ['[]'], a: [851], big: [1, 5, 8] },
          { q: 'Use 1, 5 and 8. Make the least number you can.', eq: ['[]'], a: [158], small: [1, 5, 8] }]
      }
    },

    symbols: {
      watch: 'mixing up < and >. The open side faces the greater number, like a mouth eating the bigger amount.',
      goal: 'I can compare with > and <.',
      learn: {
        show: { cap: 'The open side faces the greater number', eq: ['162 > 126', '126 < 162'] },
        together: [CM(57, 75), CM(140, 104)],
        cue: '> means "is greater than". < means "is less than".',
        own: [CM(91, 89), CM(133, 133), CM(110, 101), CM(65, 156)]
      },
      p1: {
        show: { cap: '45 is less than 54', eq: ['45 < 54'] },
        items: [CM(36, 63), CM(80, 79), CM(125, 152), CM(170, 170), CM(99, 109), CM(147, 141)]
      },
      p2: {
        items: [CM(118, 181), CM(200, 199), CM(76, 67), CM(160, 106),
          { q: 'Circle the sign: 134 ? 143', pick: { opts: ['<', '>', '='], ans: 0, cmp: [134, 143] } },
          TF('109 > 190', false)]
      },
      p3: {
        items: [CM(100 + 20, 112), CM(50 + 50, 100), { eq: ['10 tens [] 90'], a: ['>'] }, { eq: ['15 tens [] 105'], a: ['>'] },
          TF('6 tens 2 ones < 26', false), { q: 'Circle the sign: 1 hundred 5 tens ? 155', pick: { opts: ['<', '>', '='], ans: 0, cmp: [150, 155] }, wide: true }]
      },
      think: {
        items: [{ q: '{a} wrote 87 < 78. What went wrong?', lines: { n: 2, key: 'The sign points the wrong way. 87 has more tens: 87 > 78.' } },
          { q: 'Write 3 numbers that make this true:  [] > 158', lines: { n: 1, key: 'For example: 159, 170, 200.' } },
          { q: 'Read 145 < 154 out loud in words.', lines: { n: 1, key: 'One hundred forty-five is less than one hundred fifty-four.' } },
          { q: 'How can you remember which way the sign goes?', lines: { n: 2, key: 'The open side always faces the greater number.' } }]
      }
    },

    order: {
      watch: 'putting numbers in order by their first digit (25, 125, 52). Find the least by comparing hundreds, then tens.',
      goal: 'I can put numbers in order.',
      learn: {
        show: { pic: ['nl', { min: 100, max: 200, tick: 10, lab: 50, pt: 160, ptl: '160' }], cap: 'Numbers grow to the right', eq: ['120 < 160 < 190'] },
        together: [OR([64, 46, 60]), OR([131, 113, 103])],
        cue: 'Find the least first, then the next, then the greatest.',
        own: [OR([88, 98, 89]), OR([150, 105, 115]), OR([72, 172, 27]), OR([199, 119, 191])]
      },
      p1: {
        show: { cap: 'Least first', eq: ['34 < 43 < 50'] },
        items: [OR([57, 75, 55]), OR([120, 102, 112]), OR([90, 19, 109]), OR([164, 146, 166]), OR([81, 18, 108]), OR([177, 171, 117])]
      },
      p2: {
        items: [OR([135, 153, 125, 152], true), OR([96, 106, 69, 160], true), OR([140, 104, 114, 141], true),
          { q: 'Order the {conts} by how many {many}: 48, 84, 44.', eq: ['[] < [] < []'], a: [44, 48, 84], set: [48, 84, 44] },
          { q: 'What number is at the dot?', pic: ['nl', { min: 100, max: 200, tick: 10, lab: 50, pt: 170, ptl: '?' }], eq: ['[]'], a: [170] }]
      },
      p3: {
        items: [OR([199, 109, 190, 119], true), OR([88, 188, 18, 108], true),
          { q: 'Order from greatest: 145, 154, 115', eq: ['[] > [] > []'], a: [154, 145, 115], set: [145, 154, 115], wide: true },
          { q: 'What number is at the dot?', pic: ['nl', { min: 0, max: 200, tick: 10, lab: 50, pt: 130, ptl: '?' }], eq: ['[]'], a: [130] },
          { q: 'What number is at the dot?', pic: ['nl', { min: 100, max: 150, tick: 5, lab: 10, pt: 135, ptl: '?' }], eq: ['[]'], a: [135] }]
      },
      think: {
        items: [{ q: '{b} wrote 25 < 125 < 52. What went wrong?', lines: { n: 2, key: '125 has a hundred, so it is the greatest: 25 < 52 < 125.' } },
          { q: 'Mark 60, 140 and 190 on a line from 0 to 200.', draw: { h: 60, key: ['nl', { min: 0, max: 200, tick: 10, lab: 50, ask: [] }] } },
          { q: 'Write 4 numbers between 100 and 200 in order, least first.', lines: { n: 1, key: 'For example: 108 < 136 < 150 < 187.' } },
          { q: 'How does a number line help you put numbers in order?', lines: { n: 2, key: 'Numbers get greater to the right, so read them left to right.' } }]
      }
    },

    'skip-chart': {
      watch: 'skipping or repeating a number in the count. Say the count out loud and point to each number.',
      goal: 'I can count by 2s, 5s and 10s.',
      learn: {
        show: { pic: ['line', { n: 4, step: 5, max: 25 }], cap: 'Jumps of 5', eq: ['5, 10, 15, 20', '20'] },
        together: [CT('Count by 2s.', [2, 4, 6, '[]', '[]'], 2), CT('Count by 10s.', [10, 20, 30, '[]', '[]'], 10)],
        cue: 'Add the same jump each time.',
        own: [CT('Count by 5s.', [5, 10, 15, '[]', '[]'], 5), CT('Count by 2s.', [12, 14, '[]', '[]', 20], 2), CT('Count by 10s.', [60, 70, '[]', '[]', 100], 10), CT('Count by 5s.', [35, 40, '[]', '[]', 55], 5)]
      },
      p1: {
        show: { cap: 'Count by 2s', eq: ['2, 4, 6, 8, 10'] },
        items: [CT('Count by 2s.', [20, 22, '[]', '[]', 28], 2), CT('Count by 5s.', [50, 55, '[]', '[]', 70], 5), CT('Count by 10s.', [90, 100, '[]', '[]', 130], 10),
          CT('Count by 2s.', [44, 46, '[]', '[]'], 2), CT('Count by 5s.', [80, '[]', 90, '[]'], 5), CT('Count by 10s.', [140, '[]', 160, '[]'], 10)]
      },
      p2: {
        items: [CT('Count by 5s.', [105, 110, '[]', '[]', '[]'], 5), CT('Count by 2s.', [96, 98, '[]', '[]', '[]'], 2), CT('Count by 10s.', [43, 53, '[]', '[]', '[]'], 10),
          story('{a} has 7 {conts} with 5 {many} in each. Count by 5s. How many {many}?', '{many}', 35, '7 × 5'),
          story('{b} has 9 pairs of {many}. Count by 2s. How many {many}?', '{many}', 18, '9 × 2'), CT('Count back by 10s.', [180, 170, '[]', '[]'], -10)]
      },
      p3: {
        items: [CT('Count by 5s.', [155, '[]', '[]', 170, '[]', '[]'], 5, true), CT('Count by 2s.', [176, '[]', '[]', 182, '[]', '[]'], 2, true),
          CT('Count back by 5s.', [100, 95, '[]', '[]', '[]'], -5), CT('Count back by 2s.', [30, 28, '[]', '[]', '[]'], -2),
          story('{a} has 12 {conts} with 10 {many} in each. How many {many}?', '{many}', 120, '12 × 10'), { q: 'Circle the number you say when counting by 5s from 0.', pick: { opts: ['72', '85', '98'], ans: 1, seq: { from: 0, by: 5 } } }]
      },
      think: {
        items: [{ q: '{b} counted by 5s: 5, 10, 15, 25. What went wrong?', lines: { n: 2, key: '{b} skipped 20: 5, 10, 15, 20, 25.' } },
          { q: 'Counting by 5s from 0, what can the ones digit be?', lines: { n: 2, key: 'Only 0 or 5.' } },
          { q: 'Which is faster for 60 {many}: counting by 2s or by 10s? Why?', lines: { n: 2, key: 'By 10s: 6 counts instead of 30.' } },
          { q: 'Show 40 with jumps of 10 on a number line.', draw: { h: 60, key: ['line', { n: 4, step: 10, max: 50 }] } }]
      }
    },

    'skip-big': {
      watch: 'counting by 25s as 25, 50, 70, 100. Think of quarters: 25, 50, 75, 100, then 125, 150, 175, 200.',
      goal: 'I can count by 20s, 25s and 50s.',
      learn: {
        show: { pic: ['coins', { list: [25, 25, 25, 25] }], cap: 'Four quarters', eq: ['25, 50, 75, 100', '100'] },
        together: [CT('Count by 20s.', [20, 40, 60, '[]', '[]'], 20), CT('Count by 25s.', [25, 50, '[]', '[]'], 25)],
        cue: '20s are like 2s with a 0. 25s are like quarters. 50s are half hundreds.',
        own: [CT('Count by 50s.', [50, '[]', '[]', '[]'], 50), CT('Count by 20s.', [100, 120, '[]', '[]'], 20), CT('Count by 25s.', [100, 125, '[]', '[]'], 25), CT('Count by 50s.', [0, 50, '[]', '[]', '[]'], 50)]
      },
      p1: {
        show: { cap: 'Count by 20s', eq: ['20, 40, 60, 80, 100'] },
        items: [CT('Count by 20s.', [80, 100, '[]', '[]'], 20), CT('Count by 25s.', [75, 100, '[]', '[]'], 25), CT('Count by 50s.', [50, 100, '[]', '[]'], 50),
          CT('Count by 20s.', [40, '[]', 80, '[]'], 20), CT('Count by 25s.', [125, '[]', 175, '[]'], 25), CT('Count by 20s.', [120, '[]', '[]', 180, '[]'], 20, true)]
      },
      p2: {
        items: [{ pic: ['coins', { list: [25, 25, 25, 25, 25, 25] }], q: 'Count by 25s.', eq: ['[] ¢'], a: [150] }, { pic: ['coins', { list: [500, 500, 500, 500, 500, 500, 500] }], q: 'Count the $5 bills by 5s.', eq: ['$[]'], a: [35] },
          CT('Count back by 20s.', [200, 180, '[]', '[]'], -20), CT('Count back by 50s.', [200, 150, '[]', '[]'], -50),
          story('{a} has 4 {conts} with 20 {many} in each. How many {many}?', '{many}', 80, '4 × 20'), story('{b} has 3 {conts} with 50 {many} in each. How many {many}?', '{many}', 150, '3 × 50')]
      },
      p3: {
        items: [CT('Count by 25s.', [25, '[]', '[]', '[]', 125, '[]'], 25, true), CT('Count by 20s.', [20, '[]', '[]', 80, '[]', '[]'], 20, true),
          CT('Count back by 25s.', [200, 175, '[]', '[]', '[]'], -25, true), story('{a} has 6 {conts} of 25 {many}. How many {many}?', '{many}', 150, '6 × 25'),
          { q: 'Circle the number you say counting by 25s from 0.', pick: { opts: ['120', '160', '175'], ans: 2, seq: { from: 0, by: 25 } } },
          { q: 'Circle the number you say counting by 20s from 0.', pick: { opts: ['150', '160', '170'], ans: 1, seq: { from: 0, by: 20 } } }]
      },
      think: {
        items: [{ q: '{a} counted by 25s: 25, 50, 70, 100. What went wrong?', lines: { n: 2, key: '50 + 25 is 75, not 70: 25, 50, 75, 100.' } },
          { q: 'How many 50s make 200? How many 25s?', lines: { n: 2, key: '4 fifties and 8 twenty-fives.' } },
          { q: 'Why is counting by 20s like counting by 2s?', lines: { n: 2, key: '20, 40, 60 are 2, 4, 6 with a 0 on the end.' } },
          { q: 'Draw jumps of 50 from 0 to 200.', draw: { h: 60, key: ['line', { n: 4, step: 50, max: 200, labels: 50 }] } }]
      }
    },

    estimate: {
      watch: 'guessing wildly. Look at a patch of about 10, then ask how many patches like that would fill the box.',
      goal: 'I can make a good estimate, then count to check.',
      learn: {
        show: { pic: ['scatter', { t: 30 }], cap: 'About 3 patches of 10', eq: ['about 30', 'I count 30'] },
        together: [ES(20, [5, 20, 60]), ES(40, [10, 40, 90])],
        cue: 'Picture a group of 10. How many groups like that fit?',
        own: [{ q: 'About how many in 4 {conts} of 10?', pick: { opts: ['14', '40', '100'], ans: 1, est: '4 × 10' } },
          { q: 'About how many in 3 {conts} of 20?', pick: { opts: ['23', '60', '200'], ans: 1, est: '3 × 20' } },
          { q: 'About how many in 6 {conts} of 10?', pick: { opts: ['16', '60', '160'], ans: 1, est: '6 × 10' } },
          { q: 'About how many in 4 {conts} of 25?', pick: { opts: ['29', '100', '200'], ans: 1, est: '4 × 25' } }]
      },
      p1: {
        items: [ES(18, [10, 20, 50]), ES(45, [20, 50, 100]), ES(28, [10, 30, 60]), ES(58, [30, 60, 150]),
          { q: 'About how many in 7 {conts} of 10?', pick: { opts: ['17', '70', '170'], ans: 1, est: '7 × 10' } },
          { q: 'About how many in 2 {conts} of 25?', pick: { opts: ['27', '50', '100'], ans: 1, est: '2 × 25' } }]
      },
      p2: {
        items: [ES(66, [30, 60, 120]), ES(48, [20, 50, 100]),
          { q: 'Estimate. Then count in tens.', pic: ['scatter', { t: 38 }], eq: ['[]'], a: [38] },
          { q: 'Estimate. Then count in tens.', pic: ['scatter', { t: 52 }], eq: ['[]'], a: [52] }]
      },
      p3: {
        items: [ES(75, [40, 80, 150]), { q: 'Estimate. Then count in tens.', pic: ['scatter', { t: 64 }], eq: ['[]'], a: [64] },
          { q: 'About how many in 5 {conts} of 20?', pick: { opts: ['25', '100', '200'], ans: 1, est: '5 × 20' } },
          { q: 'About how many in 8 {conts} of 25?', pick: { opts: ['33', '100', '200'], ans: 2, est: '8 × 25' } },
          { q: 'About how many in 3 {conts} of 50?', pick: { opts: ['53', '150', '200'], ans: 1, est: '3 × 50' } },
          { q: 'About how many in 9 {conts} of 20?', pick: { opts: ['29', '90', '180'], ans: 2, est: '9 × 20' } }]
      },
      think: {
        items: [{ q: '{a} estimated 100 dots, then counted 30. How could {a} estimate better?', lines: { n: 2, key: 'Look at a group of 10 first, then see how many groups fit: about 3.' } },
          { q: 'Is an estimate wrong if it is not exact? Why?', lines: { n: 2, key: 'No. An estimate only has to be close. Counting checks it.' } },
          { q: 'How could you estimate the {many} in a full jar?', lines: { n: 2, key: 'Count 10, see how much space they take, then think how many of those fill the jar.' } },
          { q: 'Draw about 40 dots in groups of 10.', draw: { h: 80, key: '4 groups of 10 dots.' } }]
      }
    },

    pairs: {
      watch: 'calling a number odd because it is big, or even because it is small. Make pairs: is one left without a partner?',
      goal: 'I can tell even from odd with pairs.',
      learn: {
        show: { pic: ['pairs', { n: 7 }], cap: 'One has no partner', eq: ['3 pairs and 1 more', '7 is odd'] },
        together: [EO(8, true), EO(5, true)],
        cue: 'Make pairs. If every one has a partner, the number is even.',
        own: [EO(6, true), EO(9, true), EO(12, false), EO(11, false)]
      },
      p1: {
        show: { pic: ['pairs', { n: 10 }], cap: 'Every one has a partner', eq: ['10 is even'] },
        items: [EOP(4), EOP(7), EO(14, true), EO(13, true), EO(16, false), EO(15, false)]
      },
      p2: {
        items: [EOP(18), EOP(21), EO(20, false), EO(17, false),
          { q: '{a} has 9 {many}. Can {a} share them so each of 2 friends gets the same? ', pick: { opts: ['even', 'odd'], ans: 1, parity: 9 }, lines: { n: 1, key: 'No. 9 is odd: one is left over.' } },
          { q: 'Draw 10 {many} in pairs.', draw: { h: 50, key: ['pairs', { n: 10 }] } }]
      },
      p3: {
        items: [EO(24, false), EO(19, false), EO(30, false), EO(27, false),
          { q: 'Circle the even number.', pick: { opts: ['13', '22', '25'], ans: 1, val: 22 } }, { q: 'Circle the odd number.', pick: { opts: ['16', '28', '31'], ans: 2, val: 31 } }]
      },
      think: {
        items: [{ q: '{b} says 1 is even because it is so small. Is {b} right?', lines: { n: 2, key: 'No. 1 has no partner, so 1 is odd.' } },
          { q: 'Is 0 even or odd? Why?', lines: { n: 2, key: 'Even. There is nothing left over without a partner.' } },
          { q: 'Add two odd numbers, like 3 + 5. Is the answer even or odd? Draw it.', draw: { h: 60, key: 'Even: the two lonely ones pair up. 3 + 5 = 8.' } },
          { q: 'Draw an odd number of {many} between 10 and 20.', draw: { h: 50, key: ['pairs', { n: 15 }] } }]
      }
    },

    'ones-digit': {
      watch: 'looking at the first digit (31 is odd because 3 is odd). Only the ones digit decides.',
      goal: 'I can use the ones digit to tell even or odd.',
      learn: {
        show: { cap: 'Even numbers end in 0, 2, 4, 6 or 8', eq: ['136 ends in 6', '136 is even'] },
        together: [EO(54, false), EO(127, false)],
        cue: 'Look only at the ones digit. 0, 2, 4, 6, 8 are even. 1, 3, 5, 7, 9 are odd.',
        own: [EO(38, false), EO(71, false), EO(150, false), EO(193, false)]
      },
      p1: {
        show: { cap: 'Odd numbers end in 1, 3, 5, 7 or 9', eq: ['45 is odd'] },
        items: [EO(62, false), EO(89, false), EO(104, false), EO(115, false), EO(176, false), EO(200, false)]
      },
      p2: {
        items: [EO(143, false), EO(98, false),
          { q: 'Circle the odd number.', pick: { opts: ['134', '158', '167'], ans: 2, val: 167 } }, { q: 'Circle the even number.', pick: { opts: ['121', '140', '199'], ans: 1, val: 140 } },
          CT('Count the even numbers.', [120, 122, '[]', '[]', '[]'], 2, true), CT('Count the odd numbers.', [151, 153, '[]', '[]', '[]'], 2, true)]
      },
      p3: {
        items: [{ q: 'Circle the next even number after 149.', pick: { opts: ['148', '150', '152'], ans: 1, between: [149, 151] } }, { q: 'Circle the odd number just before 180.', pick: { opts: ['177', '179', '181'], ans: 1, between: [178, 180] } },
          CT('Count back by 2s.', [111, 109, '[]', '[]', '[]'], -2), EO(186, false),
          { q: '{a} has 125 {many}. Can {a} put them all in pairs?', pick: { opts: ['even', 'odd'], ans: 1, parity: 125 }, lines: { n: 1, key: 'No. 125 ends in 5, so it is odd.' } }]
      },
      think: {
        items: [{ q: '{b} says 31 is odd because 3 is odd. Is that the right reason?', lines: { n: 2, key: 'No. 31 is odd because it ends in 1. 34 starts with 3 and is even.' } },
          { q: 'Why does only the ones digit matter?', lines: { n: 2, key: 'Tens and hundreds can always be put in pairs. Only the ones might leave one over.' } },
          { q: 'Write the even numbers between 190 and 200.', lines: { n: 1, key: '192, 194, 196, 198.' } },
          { q: 'Use 3, 4 and 1 once each. Make the greatest even number.', lines: { n: 1, key: '314: the even digit 4 goes last, then the 3 first.' } }]
      }
    }
  } });
})();
