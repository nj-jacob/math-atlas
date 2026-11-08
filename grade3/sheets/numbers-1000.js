/* Grade 3 Numbers to 1000: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the
   lessons in chapters/numbers-1000.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.1 read, represent, compose and decompose numbers to 1000; B1.2 compare and order; B1.3 round to the
   nearest 10 and 100; B1.4 count to 1000 by 50s, 100s and 200s; B1.5 place value to 1000.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* blocks for h hundreds, t tens and o ones, and the number they make */
  function BK(h, t, o, q) { return { q: q, pic: ['blocks', { h: h, t: t, o: o, small: h > 2 }], eq: ['[]'], a: [h * 100 + t * 10 + o] }; }
  /* h flats and t rods: how many tens, and what number */
  function TN(h, t) { return { pic: ['blocks', { h: h, t: t, o: 0 }], eq: ['[] tens = []'], a: [h * 10 + t, (h * 10 + t) * 10] }; }
  /* a number into hundreds, tens and ones (a whole row) */
  function HTO(n) { return { eq: [n + ' = [] hundreds [] tens [] ones'], a: [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10], wide: true }; }
  /* the value of digit d in n */
  function WO(n, d) { var s = String(n), at = s.indexOf(String(d)); return { eq: ['The ' + d + ' in ' + n + ' is worth []'], a: [d * Math.pow(10, s.length - 1 - at)] }; }
  /* expanded form: one blank for each place that is not 0 */
  function EX(n) {
    var parts = String(n).split('').map(function (c, i, all) { return +c * Math.pow(10, all.length - 1 - i); }).filter(Boolean);
    return { eq: [n + ' = ' + parts.map(function () { return '[]'; }).join(' + ')], a: parts, expanded: true };
  }
  /* parts to one number */
  function ST(parts) { return { eq: [parts.join(' + ') + ' = []'], a: [parts.reduce(function (x, y) { return x + y; }, 0)] }; }
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function inWords(n) {
    if (n === 1000) return 'one thousand';
    var h = Math.floor(n / 100), r = n % 100, out = [];
    if (h) out.push(ONES[h] + ' hundred');
    if (r >= 20) out.push(TENS[Math.floor(r / 10)] + (r % 10 ? '-' + ONES[r % 10] : ''));
    else if (r || !h) out.push(ONES[r]);
    return out.join(' ');
  }
  /* words to a number, and a number to words */
  function W2N(n) { return { q: 'Write ' + inWords(n) + '.', words: inWords(n), eq: ['[]'], a: [n] }; }
  function N2W(n) { return { q: 'Write ' + n + ' in words.', lines: { n: 1, key: inWords(n) }, spell: n }; }
  /* a count: the numbers shown, then blanks ('[]' in the list); by is the step */
  function CT(q, list, by, wide) {
    var a = [], eq = list.map(function (v, i) { var last = i === list.length - 1; if (v === '[]') { a.push(null); return last ? '[]' : '[],'; } return last ? String(v) : v + ','; }).join(' ');
    var first = list.filter(function (v) { return v !== '[]'; })[0], at = list.indexOf(first);
    list.forEach(function (v, i) { if (v === '[]') a[a.indexOf(null)] = first + (i - at) * by; });
    return { q: q, eq: [eq], a: a, by: by, wide: wide };
  }
  /* compare with < , > or = */
  function CM(x, y) { return { eq: [x + ' [] ' + y], a: [x < y ? '<' : x > y ? '>' : '='] }; }
  /* put numbers in order, least first */
  function OR(list, wide) { var s = list.slice().sort(function (x, y) { return x - y; }); return { q: 'Order from least: ' + list.join(', '), eq: [s.map(function () { return '[]'; }).join(' < ')], a: s, set: list, wide: wide }; }
  /* round to the nearest 10 or 100 */
  function RD(to, list) { return { eq: list.map(function (n) { return n + ' is about []'; }), a: list.map(function (n) { return Math.round(n / to) * to; }), round: to }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  /* a number line from min to max with a dot at pt */
  function NL(min, max, tick, lab, pt) { return { q: 'What number is at the dot?', pic: ['nl', { min: min, max: max, tick: tick, lab: lab, pt: pt, ptl: '?' }], eq: ['[]'], a: [pt] }; }

  S.register('numbers-1000', { code: 'N', ideas: {

    hundred: {
      watch: 'counting each rod as 1. Ask: "How many are in one rod?" Then count the rods by tens.',
      goal: 'I can see 10 tens as 1 hundred.',
      learn: {
        show: { pic: ['blocks', { h: 0, t: 10, o: 0 }], cap: '10 rods: 10, 20, 30 … 100', eq: ['10 tens = 100'] },
        together: [TN(1, 0), TN(1, 3)],
        cue: 'Count the rods by tens. 10 tens make 1 hundred.',
        own: [TN(2, 0), TN(0, 7), { eq: ['10 tens = []', '20 tens = []'], a: [100, 200] }, TN(1, 5)]
      },
      p1: {
        show: { pic: ['blocks', { h: 1, t: 0, o: 0 }], cap: '1 flat is 1 hundred', eq: ['1 hundred = 10 tens'] },
        items: [TN(1, 2), TN(2, 0), TN(0, 9), TN(1, 4), { eq: ['30 tens = []', '[] tens = 400'], a: [300, 40] }, CT('Count by tens.', [70, 80, 90, '[]', '[]'], 10)]
      },
      p2: {
        items: [TN(2, 3), TN(3, 1), { eq: ['[] tens = 250', '[] tens = 600'], a: [25, 60] },
          story('{a} has 12 {conts} with 10 {many} in each. How many {many}?', '{many}', 120, '12 × 10'),
          { q: 'Circle the one that makes 100.', pick: { opts: ['10 ones', '10 tens', '100 tens'], ans: 1, val: 100 }, wide: true },
          TF('20 tens = 200', true)]
      },
      p3: {
        items: [{ eq: ['46 tens = []', '[] tens = 830'], a: [460, 83] }, { eq: ['[] tens = 1000'], a: [100] },
          story('{b} has 350 {many} in {conts} of 10. How many {conts}?', '{conts}', 35, '350 ÷ 10'),
          { eq: ['10 tens + 4 tens = [] tens'], a: [14] }, TF('1 hundred = 100 tens', false), { eq: ['700 = [] tens'], a: [70] }]
      },
      think: {
        items: [{ q: '{a} says 13 tens is 13. Is {a} right? Why?', lines: { n: 2, key: 'No. Each ten is 10, so 13 tens is 130.' } },
          { q: 'Draw 120 in two ways with flats and rods.', draw: { h: 90, key: '1 flat and 2 rods, or 12 rods.' } },
          { q: 'How many tens are in 1000? How do you know?', lines: { n: 2, key: '100 tens. 10 tens make 100, and 10 hundreds make 1000.' } },
          { q: 'Which is more?', pick: { opts: ['25 tens', '2 hundreds'], ans: 0, big: true } }]
      }
    },

    build: {
      watch: 'writing the blocks in the order they lie, or writing 3 hundreds as 300 inside the number (30045). Read flats, then rods, then cubes.',
      goal: 'I can read and build numbers with blocks.',
      learn: {
        show: { pic: ['blocks', { h: 2, t: 4, o: 3 }], cap: 'flats, rods, cubes', eq: ['2 hundreds 4 tens 3 ones', '243'] },
        together: [BK(1, 3, 5), BK(2, 1, 6)],
        cue: 'Flats are hundreds, rods are tens, small cubes are ones. Read them in that order.',
        own: [BK(1, 4, 2), BK(2, 2, 2), BK(1, 0, 8), BK(2, 5, 1)]
      },
      p1: {
        show: { pic: ['blocks', { h: 1, t: 2, o: 4 }], cap: '1 flat, 2 rods, 4 cubes', eq: ['124'] },
        items: [BK(1, 1, 3), BK(2, 3, 4), BK(1, 5, 0), BK(2, 0, 7), BK(1, 6, 6), BK(2, 4, 5)]
      },
      p2: {
        items: [BK(3, 2, 4), BK(2, 6, 3),
          { q: 'Draw 132 with blocks.', draw: { h: 70, key: ['blocks', { h: 1, t: 3, o: 2 }] } },
          HTO(358), BK(4, 1, 2),
          story('{a} has 2 {conts} of 100 {many}, 5 {conts} of 10 and 4 more. How many {many}?', '{many}', 254, '2 × 100 + 5 × 10 + 4')]
      },
      p3: {
        items: [HTO(476), HTO(809), BK(5, 3, 1),
          { q: 'Draw 314 with blocks.', draw: { h: 70, key: ['blocks', { h: 3, t: 1, o: 4, small: true }] } },
          story('{b} has 6 {conts} of 100 {many} and 8 loose {many}. How many {many}?', '{many}', 608, '6 × 100 + 8'),
          { eq: ['7 hundreds 2 tens 9 ones = []'], a: [729], wide: true }]
      },
      think: {
        items: [{ q: '{b} wrote 30045 for 3 flats, 4 rods and 5 cubes. What went wrong?', lines: { n: 2, key: '{b} wrote 300 and 45 side by side. It is 345.' } },
          { q: 'You have 4 blocks. Draw a number you could make. Write it.', draw: { h: 90, key: 'For example: 1 flat and 3 rods make 130; 2 flats, 1 rod, 1 cube make 211.' } },
          { q: 'Which number needs the most blocks?', pick: { opts: ['900', '99', '333'], ans: 1, blocks: true }, lines: { n: 2, key: '99: 9 rods and 9 cubes is 18 blocks. 900 needs 9 and 333 needs 9.' } },
          { q: 'Write a number with more rods than flats. Draw it.', draw: { h: 70, key: 'For example: 152 is 1 flat and 5 rods.' } }]
      }
    },

    value: {
      watch: 'saying the 4 in 547 is worth 4. Ask: "Which place is it in? What is that place worth?"',
      goal: 'I can tell what a digit is worth from its place.',
      learn: {
        show: { pic: ['pv', { n: 547 }], cap: 'The 4 is in the tens place', eq: ['4 tens = 40', 'The 4 is worth 40'] },
        together: [{ pic: ['pv', { n: 362 }], eq: ['The 3 in 362 is worth []'], a: [300] }, { pic: ['pv', { n: 518 }], eq: ['The 1 in 518 is worth []'], a: [10] }],
        cue: 'Find the digit\'s place first. Then say what that place is worth.',
        own: [WO(274, 7), WO(274, 2), WO(915, 5), WO(608, 6)]
      },
      p1: {
        show: { pic: ['pv', { n: 236 }], cap: 'Hundreds, tens, ones', eq: ['The 2 is worth 200'] },
        items: [WO(381, 8), WO(381, 3), WO(452, 2), WO(729, 7), WO(196, 9), WO(640, 4)]
      },
      p2: {
        items: [WO(835, 5), WO(507, 5), WO(963, 3), WO(214, 1),
          { q: 'Circle the number where the 6 is worth 60.', pick: { opts: ['612', '163', '326'], ans: 1, place: { d: 6, v: 60 } }, wide: true },
          WO(482, 8)]
      },
      p3: {
        items: [WO(447, 7), WO(720, 7), WO(905, 9), WO(318, 1),
          { q: 'Circle the number where the 3 is worth 300.', pick: { opts: ['532', '253', '325'], ans: 2, place: { d: 3, v: 300 } }, wide: true },
          { eq: ['The 8 in 284 is worth []', 'The 4 in 284 is worth []'], a: [80, 4] }]
      },
      think: {
        items: [{ q: 'Both digits in 55 are 5. Are they worth the same? Why?', lines: { n: 2, key: 'No. The first 5 is 5 tens, worth 50. The second 5 is worth 5.' } },
          { q: 'Write a number where the 2 is worth 200 and the 9 is worth 9.', lines: { n: 1, key: 'For example: 219 or 209 (2 in the hundreds place, 9 in the ones place).' } },
          { q: 'Use 4, 1 and 7. Make the 7 worth as much as it can be.', lines: { n: 1, key: '714 or 741: the 7 goes in the hundreds place.' } },
          { q: '{a} says the 6 in 960 is worth 6. What would you tell {a}?', lines: { n: 2, key: 'The 6 is in the tens place, so it is worth 60.' } }]
      }
    },

    zero: {
      watch: 'leaving out the 0 (writing 35 for 305). Ask: "Are there any tens? Then which digit goes in the tens place?"',
      goal: 'I can use 0 to hold an empty place.',
      learn: {
        show: { pic: ['blocks', { h: 3, t: 0, o: 5 }], cap: '3 flats, no rods, 5 cubes', eq: ['3 hundreds 0 tens 5 ones', '305'] },
        together: [BK(2, 0, 4), BK(1, 6, 0)],
        cue: 'A place with nothing in it still gets a digit: 0.',
        own: [BK(4, 0, 1), BK(2, 3, 0), BK(1, 0, 0), BK(3, 0, 9)]
      },
      p1: {
        show: { pic: ['blocks', { h: 2, t: 0, o: 6 }], cap: '0 rods', eq: ['206'] },
        items: [BK(1, 0, 7), BK(2, 5, 0), BK(3, 0, 2), BK(1, 9, 0), BK(2, 0, 0), BK(1, 0, 3)]
      },
      p2: {
        items: [HTO(509), HTO(780), { eq: ['6 hundreds 0 tens 4 ones = []'], a: [604], wide: true },
          W2N(402), W2N(350),
          { q: 'Circle 3 hundreds and 8 ones.', pick: { opts: ['38', '308', '380'], ans: 1, val: 308 } }]
      },
      p3: {
        items: [HTO(900), HTO(470), { eq: ['8 hundreds 7 ones = []'], a: [807], wide: true }, W2N(606), W2N(990),
          { q: 'Circle 5 hundreds and 5 tens.', pick: { opts: ['55', '505', '550'], ans: 2, val: 550 } }]
      },
      think: {
        items: [{ q: '{b} wrote 47 for 4 hundreds and 7 ones. What went wrong?', lines: { n: 2, key: '{b} left out the 0 for the tens. It is 407.' } },
          { q: 'Are 504 and 540 the same? Draw both with blocks.', draw: { h: 90, key: 'No. 504 is 5 flats and 4 cubes. 540 is 5 flats and 4 rods.' } },
          { q: 'Write every number you can make with 2, 0 and 8. No number may start with 0.', lines: { n: 2, key: '208, 280, 802, 820.' } },
          { q: 'Why can\'t we just leave a place empty?', lines: { n: 2, key: 'Then 3 hundreds and 5 ones would look like 35. The 0 keeps each digit in its place.' } }]
      }
    },

    expanded: {
      watch: 'writing 4 + 7 + 2 for 472. Ask: "What is the 4 worth?" Each part is a digit and its place.',
      goal: 'I can write a number as hundreds plus tens plus ones.',
      learn: {
        show: { pic: ['pv', { n: 472 }], cap: 'One part for each place', eq: ['400 + 70 + 2', '472 = 400 + 70 + 2'] },
        together: [EX(253), ST([300, 60, 1])],
        cue: 'Expanded form: write what each digit is worth, joined with +.',
        own: [EX(136), EX(518), ST([700, 20, 5]), ST([200, 4])]
      },
      p1: {
        show: { cap: 'Standard form and expanded form', eq: ['365 = 300 + 60 + 5'] },
        items: [EX(241), EX(324), ST([100, 90, 3]), ST([500, 10, 7]), EX(682), ST([400, 50, 6])]
      },
      p2: {
        items: [EX(709), EX(870), ST([600, 8]), ST([900, 30]), { q: 'Circle 800 + 4.', pick: { opts: ['84', '804', '840'], ans: 1, val: 804 } }, EX(915)]
      },
      p3: {
        items: [ST([5, 300, 40]), ST([60, 2, 100]), EX(608), { eq: ['400 + [] + 3 = 493'], a: [90] }, { eq: ['[] + 70 + 1 = 871'], a: [800] },
          { q: 'Circle the one that equals 260.', pick: { opts: ['200 + 6', '200 + 60', '20 + 60'], ans: 1, val: 260 }, wide: true }]
      },
      think: {
        items: [{ q: '{a} wrote 300 + 40 + 7 = 3047. What went wrong?', lines: { n: 2, key: 'The parts were written side by side. 300 + 40 + 7 = 347.' } },
          { q: 'Is 500 + 5 the same as 550? Why?', lines: { n: 2, key: 'No. 500 + 5 = 505. 550 is 500 + 50.' } },
          { q: 'Write 274 in expanded form, then draw it with blocks.', draw: { h: 80, key: '200 + 70 + 4: 2 flats, 7 rods, 4 cubes.' } },
          { q: 'Write the parts in a mixed-up order for 638. Does it still work?', lines: { n: 2, key: 'For example 8 + 600 + 30. Yes, adding in any order gives 638.' } }]
      }
    },

    words: {
      watch: 'writing "five hundred and seven" as 5007. Write the hundreds digit first, then the last two digits.',
      goal: 'I can read and write numbers in words.',
      learn: {
        show: { cap: 'Say the hundreds, then the last two digits', eq: ['three hundred forty-two', '342'] },
        together: [W2N(215), N2W(160)],
        cue: 'Say the hundreds first. Then say the last two digits as one number.',
        own: [W2N(431), W2N(708), N2W(352), N2W(905)]
      },
      p1: {
        show: { cap: 'two hundred sixty-one', eq: ['261'] },
        items: [W2N(124), W2N(380), W2N(519), N2W(240), N2W(613), W2N(999)]
      },
      p2: {
        items: [W2N(817), W2N(470), N2W(306), N2W(728), W2N(1000),
          { q: 'Circle six hundred twelve.', pick: { opts: ['6012', '612', '620'], ans: 1, val: 612 } }]
      },
      p3: {
        items: [W2N(911), W2N(560), N2W(415), N2W(870), N2W(999),
          { q: 'Circle eight hundred eight.', pick: { opts: ['808', '880', '8008'], ans: 0, val: 808 } }]
      },
      think: {
        items: [{ q: '{b} wrote 50017 for five hundred seventeen. What went wrong?', lines: { n: 2, key: '{b} wrote 500 and 17 side by side. It is 517.' } },
          { q: 'Which number name has the most letters: 300, 773 or 1000?', lines: { n: 2, key: '773: seven hundred seventy-three.' } },
          { q: 'Write a cheque amount in words: {a} pays $245.', lines: { n: 1, key: 'two hundred forty-five dollars' } },
          { q: 'Write two numbers whose names both have the word "hundred" and the word "twelve".', lines: { n: 2, key: 'For example: 112, 212, 312 ... 912.' } }]
      }
    },

    trade: {
      watch: 'thinking a number can only be made one way. Break 1 flat into 10 rods and count again: the total is the same.',
      goal: 'I can show one number in many ways.',
      learn: {
        show: { pic: ['blocks', { h: 1, t: 12, o: 4 }], cap: '1 flat, 12 rods, 4 cubes', eq: ['100 + 120 + 4', '224'] },
        together: [{ eq: ['224 = 1 hundred [] tens 4 ones'], a: [12], wide: true }, { eq: ['156 = 1 hundred 4 tens [] ones'], a: [16], wide: true }],
        cue: 'Break 1 hundred into 10 tens, or 1 ten into 10 ones. The number stays the same.',
        own: [{ eq: ['310 = 2 hundreds [] tens'], a: [11], wide: true }, { eq: ['245 = [] tens 5 ones'], a: [24], wide: true }]
      },
      p1: {
        show: { cap: 'Break a hundred', eq: ['200 = 1 hundred 10 tens'] },
        items: [{ eq: ['130 = [] tens'], a: [13] }, { eq: ['250 = [] tens'], a: [25] }, { eq: ['32 = 2 tens [] ones'], a: [12] }, { eq: ['45 = 3 tens [] ones'], a: [15] },
          { eq: ['300 = 2 hundreds [] tens'], a: [10], wide: true }, { eq: ['120 = 1 hundred [] tens'], a: [2], wide: true }]
      },
      p2: {
        items: [{ eq: ['342 = 2 hundreds [] tens 2 ones'], a: [14], wide: true }, { eq: ['265 = 2 hundreds 5 tens [] ones'], a: [15], wide: true },
          { eq: ['418 = [] tens 8 ones'], a: [41], wide: true }, ST([200, 130, 6]),
          { q: 'Circle the one that is 154.', pick: { opts: ['1 hundred 5 tens 14 ones', '1 hundred 4 tens 14 ones'], ans: 1, val: 154 }, wide: true },
          ST([100, 180, 12])]
      },
      p3: {
        items: [{ eq: ['503 = 4 hundreds [] tens 3 ones'], a: [10], wide: true }, { eq: ['620 = 5 hundreds 11 tens [] ones'], a: [10], wide: true },
          { eq: ['900 = [] tens'], a: [90] }, ST([300, 150, 25]),
          story('{a} has 3 {conts} of 100 {many}, 14 {conts} of 10 and 6 loose. How many {many}?', '{many}', 446, '3 × 100 + 14 × 10 + 6'),
          TF('2 hundreds 15 tens = 3 hundreds 5 tens', true)]
      },
      think: {
        items: [{ q: 'Show 135 in three ways.', draw: { h: 100, key: 'For example: 1 hundred 3 tens 5 ones; 13 tens 5 ones; 1 hundred 2 tens 15 ones.' } },
          { q: '{b} says 2 hundreds 12 tens is 2120. What is it really?', lines: { n: 2, key: '200 + 120 = 320.' } },
          { q: 'A shop has only rods and cubes. How could you pay 240 with them?', lines: { n: 2, key: '24 rods, or 23 rods and 10 cubes, and so on.' } },
          { q: 'Why does breaking a flat into rods not change the number?', lines: { n: 2, key: '10 tens is the same as 1 hundred, so the total is the same.' } }]
      }
    },

    thousand: {
      watch: 'thinking 1000 is "ten hundred" written 10100. Count by hundreds to 1000 and show 10 flats.',
      goal: 'I can see 10 hundreds as 1000.',
      learn: {
        show: { pic: ['nl', { min: 0, max: 1000, tick: 100, lab: 500, jumps: [[0, 100], [100, 200], [200, 300], [300, 400], [400, 500], [500, 600], [600, 700], [700, 800], [800, 900], [900, 1000]] }], cap: '10 jumps of 100', eq: ['10 hundreds = 1000'] },
        together: [{ eq: ['10 hundreds = []'], a: [1000] }, { q: 'How many more make 1000?', eq: ['800 + [] = 1000'], a: [200] }],
        cue: 'Count the flats by hundreds. 10 hundreds make one thousand.',
        own: [{ eq: ['700 + [] = 1000'], a: [300] }, { eq: ['[] + 400 = 1000'], a: [600] }, { eq: ['1000 = [] tens'], a: [100] }, CT('Count by 100s.', [600, 700, '[]', '[]', 1000], 100, true)]
      },
      p1: {
        show: { pic: ['pv', { n: 1000 }], cap: 'One thousand', eq: ['1000 = 10 hundreds'] },
        items: [{ eq: ['900 + [] = 1000'], a: [100] }, { eq: ['500 + [] = 1000'], a: [500] }, { eq: ['200 + [] = 1000'], a: [800] }, { eq: ['[] hundreds = 1000'], a: [10] },
          CT('Count by 100s.', [500, '[]', 700, '[]', '[]', 1000], 100, true), TF('10 hundreds = 1000', true)]
      },
      p2: {
        items: [{ eq: ['950 + [] = 1000'], a: [50] }, { eq: ['750 + [] = 1000'], a: [250] }, { eq: ['1000 − [] = 600'], a: [400] },
          story('{a} has 700 {many}. How many more make 1000?', '{many}', 300, '1000 − 700'),
          { eq: ['999 + [] = 1000'], a: [1] }, { q: 'Circle one thousand.', pick: { opts: ['100', '10100', '1000'], ans: 2, val: 1000 } }]
      },
      p3: {
        items: [{ eq: ['640 + [] = 1000'], a: [360] }, { eq: ['380 + [] = 1000'], a: [620] }, { eq: ['1000 = [] ones'], a: [1000] },
          story('{b} needs 1000 {many}. {b} has 850. How many more?', '{many}', 150, '1000 − 850'),
          { eq: ['500 + 300 + [] = 1000'], a: [200] }, TF('1000 = 100 tens', true)]
      },
      think: {
        items: [{ q: 'Is 1000 a big number? Name something with about 1000 of it.', lines: { n: 2, key: 'For example: pages in a thick book, steps around a field, seats in a school gym.' } },
          { q: '{a} says ten hundred is written 10100. What would you show {a}?', lines: { n: 2, key: '10 flats make 1000: 100, 200 ... 1000.' } },
          { q: 'Find two numbers that make 1000. Find two more.', lines: { n: 2, key: 'For example: 600 + 400, 250 + 750.' } },
          { q: 'How many tens make 1000? How do you know?', lines: { n: 2, key: '100 tens: each hundred is 10 tens, and there are 10 hundreds.' } }]
      }
    },

    by100: {
      watch: 'changing the tens or ones when counting by 100s. Only the hundreds digit changes.',
      goal: 'I can count by 100s from any number.',
      learn: {
        show: { pic: ['nl', { min: 0, max: 600, tick: 100, lab: 100, jumps: [[0, 100], [100, 200], [200, 300]] }], eq: ['100, 200, 300'] },
        together: [CT('Count by 100s.', [100, 200, '[]', '[]'], 100), CT('Count by 100s.', [130, 230, '[]', '[]'], 100)],
        cue: 'Counting by 100s: only the hundreds digit goes up.',
        own: [CT('', [200, 300, '[]', '[]'], 100), CT('', [45, 145, '[]', '[]'], 100), CT('', [310, '[]', 510, '[]'], 100), CT('', [8, 108, '[]', '[]'], 100)]
      },
      p1: {
        show: { cap: 'Start at 50', eq: ['50, 150, 250, 350'] },
        items: [CT('', [300, 400, '[]', '[]'], 100), CT('', [20, 120, '[]', '[]'], 100), CT('', [160, 260, '[]', '[]'], 100), CT('', [505, 605, '[]', '[]'], 100),
          CT('Count back by 100s.', [900, 800, '[]', '[]'], -100), CT('Count back by 100s.', [750, 650, '[]', '[]'], -100)]
      },
      p2: {
        items: [CT('', [74, 174, '[]', '[]', '[]'], 100, true), CT('', [415, '[]', '[]', 715, '[]'], 100, true),
          CT('Count back.', [980, 880, '[]', '[]', '[]'], -100, true), { eq: ['362 + 100 = []', '362 − 100 = []'], a: [462, 262] },
          story('{a} has 240 {many} and gets 100 more. How many now?', '{many}', 340, '240 + 100'), { eq: ['[] + 100 = 509'], a: [409] }]
      },
      p3: {
        items: [CT('', [3, '[]', '[]', 303, '[]', '[]'], 100, true), CT('Count back.', [1000, '[]', '[]', 700, '[]'], -100, true),
          { eq: ['627 + 300 = []'], a: [927] }, { eq: ['850 − 400 = []'], a: [450] },
          story('{b} has 175 {many}. {b} gets 100 more each day for 3 days. How many now?', '{many}', 475, '175 + 3 × 100'),
          { q: 'Circle the number that is 100 more than 491.', pick: { opts: ['492', '501', '591'], ans: 2, val: 591 } }]
      },
      think: {
        items: [{ q: 'Start at 36. Count by 100s. What stays the same each time?', lines: { n: 2, key: 'The tens and ones stay 36: 36, 136, 236 ...' } },
          { q: '{a} counted 280, 380, 400. What went wrong?', lines: { n: 2, key: 'After 380 comes 480. {a} changed the tens.' } },
          { q: 'How many jumps of 100 from 50 to 950?', lines: { n: 1, key: '9 jumps.' } },
          { q: 'Can you count by 100s from 7 and land on 1000? Why?', lines: { n: 2, key: 'No. You land on 907, then 1007. The ones stay 7.' } }]
      }
    },

    by50: {
      watch: 'mixing up 50s and 5s (50, 55, 60). Two jumps of 50 make 100.',
      goal: 'I can count by 50s.',
      learn: {
        show: { pic: ['nl', { min: 0, max: 300, tick: 50, lab: 50, jumps: [[0, 50], [50, 100], [100, 150]] }], eq: ['50, 100, 150'] },
        together: [CT('Count by 50s.', [50, 100, '[]', '[]'], 50), CT('Count by 50s.', [200, 250, '[]', '[]'], 50)],
        cue: 'Two jumps of 50 make 100: the numbers end in 50, then 00.',
        own: [CT('', [100, 150, '[]', '[]'], 50), CT('', [350, 400, '[]', '[]'], 50), CT('', [600, '[]', 700, '[]'], 50), CT('', [850, 900, '[]', '[]'], 50)]
      },
      p1: {
        show: { cap: 'Count by 50s', eq: ['400, 450, 500, 550'] },
        items: [CT('', [0, 50, '[]', '[]'], 50), CT('', [250, 300, '[]', '[]'], 50), CT('', [500, '[]', '[]', 650], 50), CT('', [700, 750, '[]', '[]'], 50),
          CT('Count back by 50s.', [300, 250, '[]', '[]'], -50), { eq: ['[] × 50 = 100'], a: [2] }]
      },
      p2: {
        items: [CT('', [25, 75, '[]', '[]', '[]'], 50, true), CT('', [110, 160, '[]', '[]', '[]'], 50, true),
          CT('Count back.', [1000, 950, '[]', '[]', '[]'], -50, true), { eq: ['450 + 50 = []', '450 − 50 = []'], a: [500, 400] },
          story('{a} puts 50 {many} in each {cont}. How many {many} in 4 {conts}?', '{many}', 200, '4 × 50'), TF('6 jumps of 50 = 300', true)]
      },
      p3: {
        items: [CT('', [5, 55, '[]', '[]', '[]', '[]'], 50, true), CT('Count back.', [430, '[]', '[]', 280, '[]'], -50, true),
          { eq: ['[] jumps of 50 = 500'], a: [10] }, { eq: ['650 + 150 = []'], a: [800] },
          story('{b} has 900 {many}. {b} gives away 50 each day for 4 days. How many are left?', '{many}', 700, '900 − 4 × 50'),
          { q: 'Circle the number you land on counting by 50s from 0.', pick: { opts: ['525', '550', '505'], ans: 1 }, mult: { of: 50 } }]
      },
      think: {
        items: [{ q: '{b} counted 50, 55, 60, 65. What went wrong?', lines: { n: 2, key: '{b} counted by 5s. By 50s it is 50, 100, 150, 200.' } },
          { q: 'Why do numbers end in 50 or 00 when you count by 50s from 0?', lines: { n: 2, key: 'Every two jumps of 50 make 100, so you are on a hundred or halfway.' } },
          { q: 'How many 50¢ coins make $5? Show how you know.', draw: { h: 80, key: '10 coins: count 50, 100, 150 ... 500.' } },
          { q: 'Start at 30 and count by 50s. Will you land on 280? Why?', lines: { n: 2, key: 'Yes: 30, 80, 130, 180, 230, 280.' } }]
      }
    },

    by200: {
      watch: 'adding 2 instead of 200. Say "two hundred" each time and change only the hundreds digit.',
      goal: 'I can count by 200s.',
      learn: {
        show: { pic: ['nl', { min: 0, max: 1000, tick: 100, lab: 200, jumps: [[0, 200], [200, 400], [400, 600]] }], eq: ['200, 400, 600'] },
        together: [CT('Count by 200s.', [200, 400, '[]', '[]'], 200), CT('Count by 200s.', [100, 300, '[]', '[]'], 200)],
        cue: 'Each jump adds 2 hundreds. Count by 2s in the hundreds place.',
        own: [CT('', [0, 200, '[]', '[]'], 200), CT('', [50, 250, '[]', '[]'], 200), CT('', [400, '[]', 800, '[]'], 200), CT('', [10, 210, '[]', '[]'], 200)]
      },
      p1: {
        show: { cap: 'Count by 200s', eq: ['200, 400, 600, 800, 1000'] },
        items: [CT('', [200, '[]', '[]', 800], 200), CT('', [300, 500, '[]', '[]'], 200), CT('', [150, 350, '[]', '[]'], 200), CT('', [20, 220, '[]', '[]'], 200),
          CT('Count back by 200s.', [1000, 800, '[]', '[]'], -200), { eq: ['[] jumps of 200 = 1000'], a: [5] }]
      },
      p2: {
        items: [CT('', [5, 205, '[]', '[]', '[]'], 200, true), CT('Count back.', [970, 770, '[]', '[]', '[]'], -200, true),
          { eq: ['3 jumps of 200 = []'], a: [600] }, { eq: ['480 + 200 = []'], a: [680] },
          story('{a} packs 200 {many} in each {cont}. How many {many} in 3 {conts}?', '{many}', 600, '3 × 200'), TF('4 jumps of 200 = 600', false)]
      },
      p3: {
        items: [CT('', [60, '[]', '[]', 660, '[]'], 200, true), CT('Count back.', [925, '[]', '[]', 325, '[]'], -200, true),
          { eq: ['200 + 200 + 200 + 200 = []'], a: [800], wide: true }, { eq: ['1000 − 400 = []'], a: [600] },
          story('{b} has 1000 {many} and uses 200 each week. How many are left after 3 weeks?', '{many}', 400, '1000 − 3 × 200'),
          { q: 'Circle the number you land on counting by 200s from 100.', pick: { opts: ['600', '700', '800'], ans: 1, seq: { from: 100, by: 200 } } }]
      },
      think: {
        items: [{ q: '{a} counted 200, 202, 204. What went wrong?', lines: { n: 2, key: '{a} added 2. Adding 200 gives 200, 400, 600.' } },
          { q: 'Counting by 200s, how is it like counting by 2s?', lines: { n: 2, key: 'The hundreds digit goes 2, 4, 6, 8, just like counting by 2s.' } },
          { q: 'Start at 100. Count by 200s. Will you ever land on 600? Why?', lines: { n: 2, key: 'No. 100, 300, 500, 700: the hundreds digit stays odd.' } },
          { q: 'How many jumps of 200 make 1000? Draw it.', draw: { h: 70, key: ['nl', { min: 0, max: 1000, tick: 100, lab: 200, jumps: [[0, 200], [200, 400], [400, 600], [600, 800], [800, 1000]] }] } }]
      }
    },

    greater: {
      watch: 'deciding by the ones digit (thinking 298 > 301). Compare the hundreds first, then the tens.',
      goal: 'I can compare numbers by looking from the left.',
      learn: {
        show: { cap: '435 and 452: same hundreds, then tens 3 < 5', eq: ['452 > 435'] },
        together: [{ q: 'Circle the greater number.', pick: { opts: ['376', '412'], ans: 1, big: true } }, { q: 'Circle the greater number.', pick: { opts: ['528', '582'], ans: 1, big: true } }],
        cue: 'Start at the left. The first place that is different decides.',
        own: [{ q: 'Circle the greater.', pick: { opts: ['619', '691'], ans: 1, big: true } }, { q: 'Circle the greater.', pick: { opts: ['740', '704'], ans: 0, big: true } },
          { q: 'Circle the greater.', pick: { opts: ['298', '301'], ans: 1, big: true } }, { q: 'Circle the greater.', pick: { opts: ['865', '856'], ans: 0, big: true } }]
      },
      p1: {
        show: { cap: 'Hundreds first: 3 hundreds < 4 hundreds', eq: ['399 is less than 401'] },
        items: [{ q: 'Circle the greater.', pick: { opts: ['234', '342'], ans: 1, big: true } }, { q: 'Circle the greater.', pick: { opts: ['518', '510'], ans: 0, big: true } },
          { q: 'Circle the greater.', pick: { opts: ['467', '476'], ans: 1, big: true } }, { q: 'Circle the less.', pick: { opts: ['903', '930'], ans: 0, small: true } },
          { q: 'Circle the less.', pick: { opts: ['188', '201'], ans: 0, small: true } }, { q: 'Circle the greater.', pick: { opts: ['655', '565'], ans: 0, big: true } }]
      },
      p2: {
        items: [{ q: 'Circle the greatest.', pick: { opts: ['457', '475', '447'], ans: 1, big: true } }, { q: 'Circle the least.', pick: { opts: ['812', '821', '128'], ans: 2, small: true } },
          { q: 'Make the greatest number with 3, 8 and 1.', eq: ['[]'], a: [831], digits: [3, 8, 1], most: true }, { q: 'Make the least number with 6, 2 and 9.', eq: ['[]'], a: [269], digits: [6, 2, 9], most: false },
          story('{a} has 345 {many}. {b} has 354. Who has more? How many more?', '{many} more', 9, '354 − 345'),
          { q: 'Circle the greatest.', pick: { opts: ['700', '699', '690'], ans: 0, big: true } }]
      },
      p3: {
        items: [{ q: 'Circle the greatest.', pick: { opts: ['909', '990', '899'], ans: 1, big: true } }, { q: 'Circle the least.', pick: { opts: ['1000', '999', '909'], ans: 2, small: true } },
          { q: 'Make the greatest number with 0, 7 and 4.', eq: ['[]'], a: [740], digits: [0, 7, 4], most: true }, { q: 'Make the least number with 0, 5 and 3. It cannot start with 0.', eq: ['[]'], a: [305], digits: [0, 5, 3], most: false },
          { q: 'Write a number between 480 and 490.', eq: ['480 < [] < 490'], a: [485] },
          TF('612 > 621', false)]
      },
      think: {
        items: [{ q: '{b} says 298 is greater than 301 because 9 and 8 are big. What would you say?', lines: { n: 2, key: 'Compare the hundreds first: 3 hundreds is more than 2 hundreds, so 301 is greater.' } },
          { q: 'Write a number greater than 650 but less than 700.', lines: { n: 1, key: 'Any number from 651 to 699.' } },
          { q: 'Fill in a digit so the first number is greater: 4_7 and 452.', lines: { n: 1, key: '6, 7, 8 or 9 (5 makes 457, also greater).' } },
          { q: 'Use 2, 5 and 9 to make the greatest and least numbers.', lines: { n: 2, key: 'Greatest 952, least 259.' } }]
      }
    },

    symbols: {
      watch: 'pointing the symbol the wrong way. The open side faces the greater number; read it left to right.',
      goal: 'I can use <, > and = to compare.',
      learn: {
        show: { cap: 'The open side faces the greater number', eq: ['352 < 523', '523 > 352'] },
        together: [CM(426, 462), CM(735, 715)],
        cue: '< means "is less than". > means "is greater than". = means "is the same as".',
        own: [CM(208, 280), CM(651, 615), CM(400, 400), CM(379, 397)]
      },
      p1: {
        show: { cap: 'Read it: 245 is less than 254', eq: ['245 < 254'] },
        items: [CM(123, 321), CM(540, 504), CM(316, 361), CM(888, 888), CM(709, 790), CM(951, 915)]
      },
      p2: {
        items: [CM(599, 600), CM(1000, 999), { eq: ['300 + 40 [] 304'], a: ['>'] }, { eq: ['500 + 7 [] 570'], a: ['<'] },
          { eq: ['200 + 50 + 1 [] 251'], a: ['='], wide: true }, TF('476 > 467', true)]
      },
      p3: {
        items: [{ eq: ['4 hundreds 12 tens [] 512'], a: ['>'], wide: true }, { eq: ['30 tens [] 300'], a: ['='] }, { eq: ['650 [] 6 hundreds 5 ones'], a: ['>'], wide: true },
          { q: 'Write a number that makes it true.', eq: ['[] > 899'], a: [900] }, { q: 'Write a number that makes it true.', eq: ['705 < []'], a: [750] }, TF('190 < 109', false)]
      },
      think: {
        items: [{ q: '{a} wrote 712 > 721. Is it right? How do you know?', lines: { n: 2, key: 'No. Same hundreds; 1 ten < 2 tens, so 712 < 721.' } },
          { q: 'Write 3 numbers that make this true: ___ < 405', lines: { n: 2, key: 'Any three numbers less than 405, for example 99, 400, 404.' } },
          { q: 'Make a true sentence with 538, 583 and a symbol.', lines: { n: 1, key: '538 < 583 or 583 > 538.' } },
          { q: 'How do you remember which way < points?', lines: { n: 2, key: 'For example: the open side is wide, facing the bigger number.' } }]
      }
    },

    order: {
      watch: 'ordering by the last digit, or forgetting to check the tens when the hundreds match.',
      goal: 'I can put numbers in order.',
      learn: {
        show: { pic: ['nl', { min: 200, max: 400, tick: 20, lab: 100, pt: 260, ptl: '260' }], cap: 'Least on the left', eq: ['218 < 260 < 340'] },
        together: [OR([340, 218, 260]), OR([475, 457, 547])],
        cue: 'Find the least: compare hundreds, then tens, then ones. Then find the next.',
        own: [OR([601, 160, 610]), OR([299, 302, 230]), OR([815, 581, 518]), OR([77, 707, 770])]
      },
      p1: {
        show: { cap: 'Hundreds first', eq: ['132 < 213 < 321'] },
        items: [OR([312, 123, 231]), OR([450, 405, 540]), OR([88, 808, 800]), OR([670, 607, 760]), OR([199, 919, 991]), OR([256, 265, 226])]
      },
      p2: {
        items: [OR([624, 462, 246, 642], true), OR([308, 380, 38, 830], true), OR([999, 1000, 909, 990], true),
          { q: 'Which is between 350 and 400?', pick: { opts: ['345', '372', '410'], ans: 1, between: [350, 400] } },
          { q: 'Three {conts} hold 236, 263 and 226 {many}. Circle the most.', pick: { opts: ['236', '263', '226'], ans: 1, big: true } },
          TF('450 < 504 < 540', true)]
      },
      p3: {
        items: [OR([575, 557, 755, 577], true), OR([406, 460, 46, 604], true), OR([818, 881, 188, 811], true),
          { q: 'Write a number that fits.', eq: ['475 < [] < 482'], a: [478] }, { q: 'Write a number that fits.', eq: ['899 < [] < 901'], a: [900] },
          TF('720 < 702 < 270', false)]
      },
      think: {
        items: [{ q: '{b} ordered 509, 95, 590 as 590, 509, 95 from least. What went wrong?', lines: { n: 2, key: '{b} put them greatest first. Least first: 95, 509, 590.' } },
          { q: 'Make three numbers with 1, 4 and 6. Put them in order.', lines: { n: 2, key: 'For example: 146 < 416 < 641.' } },
          { q: 'Mark 230, 270 and 250 on a line from 200 to 300.', draw: { h: 70, key: ['nl', { min: 200, max: 300, tick: 10, lab: 50 }] } },
          { q: 'Order the {conts}: 180, 108, 801 {many}. Which has the most?', lines: { n: 2, key: '108 < 180 < 801. The one with 801 has the most.' } }]
      }
    },

    nearest10: {
      watch: 'rounding 45 down to 40. A number ending in 5 is exactly halfway: round it up.',
      goal: 'I can round to the nearest ten.',
      learn: {
        show: { pic: ['nl', { min: 340, max: 350, tick: 1, lab: 10, pt: 347 }], cap: '347 is closer to 350', eq: ['347 is about 350'] },
        together: [RD(10, [342]), RD(10, [365])],
        cue: 'Look at the ones. 0 to 4: round down. 5 to 9: round up.',
        own: [RD(10, [128]), RD(10, [431]), RD(10, [655]), RD(10, [796])]
      },
      p1: {
        show: { pic: ['nl', { min: 120, max: 130, tick: 1, lab: 10, pt: 123 }], cap: '123 is closer to 120', eq: ['123 is about 120'] },
        items: [RD(10, [23, 67]), RD(10, [184]), RD(10, [252]), RD(10, [419]), RD(10, [575]), RD(10, [808])]
      },
      p2: {
        items: [RD(10, [341, 346]), RD(10, [235, 234]), RD(10, [998]), RD(10, [703]),
          { q: 'Circle the number that rounds to 480.', pick: { opts: ['474', '485', '476'], ans: 2, round: { to: 10, val: 480 } } },
          { q: 'A {cont} holds 157 {many}. About how many, to the nearest ten?', eq: ['157 is about []'], a: [160], round: 10 }]
      },
      p3: {
        items: [RD(10, [95, 105]), RD(10, [395]), RD(10, [604, 609]), RD(10, [999]),
          { q: 'Circle the number that rounds to 300.', pick: { opts: ['294', '303', '305'], ans: 1, round: { to: 10, val: 300 } } },
          { q: 'What is the least number that rounds to 250?', eq: ['[]'], a: [245], edge: { to: 10, val: 250, end: 'least' } }]
      },
      think: {
        items: [{ q: '{a} rounded 45 to 40. Is that right? Why?', lines: { n: 2, key: 'No. 45 is halfway, and halfway rounds up to 50.' } },
          { q: 'Write all the numbers that round to 70.', lines: { n: 2, key: '65, 66, 67, 68, 69, 70, 71, 72, 73, 74.' } },
          { q: 'Show 263 on a number line. Which ten is it closer to?', draw: { h: 70, key: ['nl', { min: 260, max: 270, tick: 1, lab: 10, pt: 263 }] } },
          { q: 'When is rounding useful? Give an example.', lines: { n: 2, key: 'For example: about 380 people came, or a walk is about 120 m.' } }]
      }
    },

    nearest100: {
      watch: 'looking at the ones digit to round to 100. Look at the tens: 0 to 4 down, 5 to 9 up.',
      goal: 'I can round to the nearest hundred.',
      learn: {
        show: { pic: ['nl', { min: 300, max: 400, tick: 10, lab: 50, pt: 370 }], cap: '370 is closer to 400', eq: ['370 is about 400'] },
        together: [RD(100, [320]), RD(100, [580])],
        cue: 'Look at the tens digit. 0 to 4: round down. 5 to 9: round up.',
        own: [RD(100, [140]), RD(100, [261]), RD(100, [449]), RD(100, [850])]
      },
      p1: {
        show: { pic: ['nl', { min: 600, max: 700, tick: 10, lab: 50, pt: 630 }], cap: '630 is closer to 600', eq: ['630 is about 600'] },
        items: [RD(100, [210]), RD(100, [390]), RD(100, [470]), RD(100, [530]), RD(100, [760]), RD(100, [940])]
      },
      p2: {
        items: [RD(100, [349, 351]), RD(100, [705, 750]), RD(100, [88]), RD(100, [912]),
          { q: 'Circle the number that rounds to 600.', pick: { opts: ['549', '655', '591'], ans: 2, round: { to: 100, val: 600 } } },
          { q: '{a} counts 428 {many}. About how many, to the nearest hundred?', eq: ['428 is about []'], a: [400], round: 100 }]
      },
      p3: {
        items: [RD(100, [450, 449]), RD(100, [952]), RD(100, [55]), RD(100, [609]),
          { q: 'Circle the number that rounds to 1000.', pick: { opts: ['940', '960', '849'], ans: 1, round: { to: 100, val: 1000 } } },
          { q: 'What is the greatest number that rounds to 300?', eq: ['[]'], a: [349], edge: { to: 100, val: 300, end: 'most' } }]
      },
      think: {
        items: [{ q: '{b} rounded 349 to 400 because 9 rounds up. What went wrong?', lines: { n: 2, key: 'To round to 100, look at the tens. 4 tens rounds down: 300.' } },
          { q: 'Find a number that rounds to 500 and to 450 (nearest ten).', lines: { n: 1, key: 'Any of 450, 451, 452, 453, 454.' } },
          { q: 'Why do we look at the tens to round to the nearest hundred?', lines: { n: 2, key: 'The tens tell how far past the hundred we are: 50 is halfway.' } },
          { q: 'A school has 467 students. Is "about 500" a good guess? Why?', lines: { n: 2, key: 'Yes. 467 is closer to 500 than to 400.' } }]
      }
    },

    mix: {
      watch: 'rounding to the wrong place. Underline the place you round to, then look at the digit to its right.',
      goal: 'I can round to the nearest ten or hundred.',
      learn: {
        show: { cap: '368 to the nearest ten, then hundred', eq: ['368 is about 370', '368 is about 400'] },
        together: [{ q: 'Nearest ten.', eq: ['254 is about []'], a: [250], round: 10 }, { q: 'Nearest hundred.', eq: ['254 is about []'], a: [300], round: 100 }],
        cue: 'Underline the place you round to. The digit to its right decides.',
        own: [{ q: 'Nearest ten.', eq: ['671 is about []'], a: [670], round: 10 }, { q: 'Nearest hundred.', eq: ['671 is about []'], a: [700], round: 100 },
          { q: 'Nearest ten.', eq: ['415 is about []'], a: [420], round: 10 }, { q: 'Nearest hundred.', eq: ['415 is about []'], a: [400], round: 100 }]
      },
      p1: {
        show: { cap: 'Ten: look at the ones. Hundred: look at the tens.', eq: ['532 is about 530 or 500'] },
        items: [{ q: 'Nearest ten.', eq: ['127 is about []'], a: [130], round: 10 }, { q: 'Nearest hundred.', eq: ['127 is about []'], a: [100], round: 100 },
          { q: 'Nearest ten.', eq: ['384 is about []'], a: [380], round: 10 }, { q: 'Nearest hundred.', eq: ['384 is about []'], a: [400], round: 100 },
          { q: 'Nearest ten.', eq: ['846 is about []'], a: [850], round: 10 }, { q: 'Nearest hundred.', eq: ['846 is about []'], a: [800], round: 100 }]
      },
      p2: {
        items: [{ q: 'Nearest ten.', eq: ['249 is about []', '651 is about []'], a: [250, 650], round: 10 }, { q: 'Nearest hundred.', eq: ['249 is about []', '651 is about []'], a: [200, 700], round: 100 },
          { q: 'Nearest ten.', eq: ['995 is about []'], a: [1000], round: 10 }, { q: 'Nearest hundred.', eq: ['950 is about []'], a: [1000], round: 100 },
          { q: '{a} has 386 {many}. About how many, to the nearest hundred?', eq: ['386 is about []'], a: [400], round: 100 },
          { q: '{b} has 386 {many}. About how many, to the nearest ten?', eq: ['386 is about []'], a: [390], round: 10 }]
      },
      p3: {
        items: [{ q: 'Nearest ten.', eq: ['705 is about []', '750 is about []'], a: [710, 750], round: 10 }, { q: 'Nearest hundred.', eq: ['705 is about []', '750 is about []'], a: [700, 800], round: 100 },
          { q: 'Nearest ten.', eq: ['45 is about []'], a: [50], round: 10 }, { q: 'Nearest hundred.', eq: ['45 is about []'], a: [0], round: 100 },
          { q: 'Circle the number that rounds to 300 and to 340.', pick: { opts: ['336', '354', '346'], ans: 0, round: { to: 10, val: 340 }, also: { to: 100, val: 300 } } },
          { q: 'Circle the number that rounds to 500 and to 450.', pick: { opts: ['446', '453', '458'], ans: 1, round: { to: 10, val: 450 }, also: { to: 100, val: 500 } } }]
      },
      think: {
        items: [{ q: 'Is it better to round 362 to 360 or to 400? When?', lines: { n: 3, key: '360 is closer, for a careful guess. 400 is easier, for a quick guess.' } },
          { q: 'Find a number that rounds to 600 at both the nearest ten and the nearest hundred.', lines: { n: 1, key: 'Any of 595 to 604.' } },
          { q: '{a} rounded 251 to the nearest hundred and got 200. What went wrong?', lines: { n: 2, key: '5 tens means round up: 300.' } },
          { q: 'Write a number. Round it to the nearest ten and to the nearest hundred.', lines: { n: 2, key: 'For example: 418 is about 420, and about 400.' } }]
      }
    }
  } });
})();
