/* Grade 5 Place Value: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/place-value.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.1 read, represent, compose and decompose whole numbers to 100 000, and round them;
   B1.2 compare and order whole numbers to 100 000. The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var F = S.fmt;
  /* what a digit is worth in a number */
  function DV(n, d) {
    var s = String(n), at = s.indexOf(String(d));
    return { q: 'What is the ' + d + ' in ' + F(n) + ' worth?', eq: ['[]'], a: [d * Math.pow(10, s.length - 1 - at)], dv: { n: F(n), d: d } };
  }
  /* a number in expanded form: n = [] + [] + ... */
  function EX(n) { var p = S.parts(n); return { eq: [F(n) + ' = ' + p.map(function () { return '[]'; }).join(' + ')], a: p, wide: true }; }
  /* expanded form back to standard form */
  function ST(list) { return { eq: [list.map(F).join(' + ') + ' = []'], a: [list.reduce(function (s, v) { return s + v; }, 0)], wide: true }; }
  /* words to numerals, and numerals to words */
  function WN(w, n) { return { q: 'Write in numerals: ' + w + '.', eq: ['[]'], a: [n], words: w }; }
  function NW(n, w) { return { q: 'Write ' + F(n) + ' in words.', lines: { n: 2, key: w } }; }
  /* compare two numbers: circle the sign */
  function CMP(x, y) { return { eq: [F(x) + ' ? ' + F(y)], pick: { opts: ['<', '>', '='], ans: x < y ? 0 : x > y ? 1 : 2, cmp: [F(x), F(y)] }, pickLast: true }; }
  /* put numbers in order, least to greatest */
  function ORD(list) {
    return { q: 'Least to greatest: ' + list.map(F).join(', '), eq: [list.map(function () { return '[]'; }).join(' < ')], a: list.slice().sort(function (x, y) { return x - y; }), set: list.map(F), wide: true };
  }
  /* round n to the nearest `to`, with the hill (pic) or without */
  function RD(n, to, pic) {
    var lo = Math.floor(n / to) * to, it = { q: 'Round ' + F(n) + ' to the nearest ' + F(to) + '.', eq: [F(n) + ' is about []'], a: [Math.round(n / to) * to], round: to };
    if (pic) it.pic = ['hill', { lo: lo, hi: lo + to, n: n }];
    return it;
  }
  /* × or ÷ by 10, 100 or 1000 on a place value chart */
  function PV(n, shift, dir) {
    var r = dir === 'd' ? n / Math.pow(10, shift) : n * Math.pow(10, shift);
    return { pic: ['pvmove', { n: n, shift: shift, dir: dir }], eq: [F(n) + (dir === 'd' ? ' ÷ ' : ' × ') + F(Math.pow(10, shift)) + ' = []'], a: [r] };
  }
  /* disks: what number do they show? */
  function DK(n) { return { pic: ['disks', { n: n }], eq: ['[]'], a: [n] }; }

  S.register('place-value', { code: 'PV', ideas: {

    'ten-times': {
      watch: 'thinking the next place is 1 more, not 10 times more. Build 10 disks and trade them for 1 disk of the next place.',
      goal: 'I can explain why each place is 10 times the place to its right.',
      learn: {
        show: { pic: ['disks', { list: [[100, 10]] }], cap: '10 hundreds make 1 thousand', eq: ['10 hundreds = 1 thousand'] },
        together: [{ pic: ['disks', { list: [[10, 10]] }], eq: ['10 tens = [] hundred'], a: [1] }, PV(37, 1, 'x')],
        cue: '10 of one place make 1 of the next place to the left.',
        own: [{ eq: ['10 thousands = [] ten thousand'], a: [1], wide: true }, { eq: ['10 × 1000 = []'], a: [10000] }, { eq: ['10 × 452 = []'], a: [4520] }, { eq: ['10 × 10 000 = []'], a: [100000] }]
      },
      p1: {
        show: { pic: ['disks', { list: [[1, 10]] }], cap: '10 ones make 1 ten', eq: ['10 × 1 = 10'] },
        items: [{ eq: ['10 ones = [] ten'], a: [1] }, { eq: ['10 hundreds = [] thousand'], a: [1] }, { eq: ['10 × 100 = []'], a: [1000] }, { eq: ['10 × 10 = []'], a: [100] },
          PV(64, 1, 'x'), PV(805, 1, 'x')]
      },
      p2: {
        items: [PV(2340, 1, 'x'), PV(4500, 1, 'd'), { eq: ['[] × 1000 = 10 000', '[] × 100 = 1000'], a: [10, 10] }, { eq: ['10 × 7000 = []', '10 × 360 = []'], a: [70000, 3600] },
          story('{a} has 10 {conts} with 1000 {many} in each. How many {many}?', 10000, '10 × 1000'), { eq: ['100 tens = [] thousand'], a: [1] }]
      },
      p3: {
        items: [PV(5280, 1, 'x'), PV(91000, 1, 'd'), { eq: ['100 × 100 = []', '10 × 1000 = []'], a: [10000, 10000] }, { eq: ['[] × 10 000 = 100 000'], a: [10] },
          { q: 'How many hundreds make 10 000?', eq: ['10 000 = [] hundreds'], a: [100] }, { eq: ['20 thousands = [] ten thousands'], a: [2], wide: true }]
      },
      think: {
        items: [{ q: '{b} says the 4 in 400 is 10 times the 4 in 4000. Is that right? Explain.', lines: { n: 3, key: 'No. It is the other way: the 4 in 4000 is 10 times the 4 in 400.' } },
          { q: 'Draw disks to show that 10 thousands make 10 000.', draw: { h: 80, key: ['disks', { list: [[1000, 10]] }] } },
          { q: 'A number is multiplied by 10. What happens to each digit?', lines: { n: 3, key: 'Each digit moves one place to the left, so it is worth 10 times as much.' } },
          { q: 'How many tens make 1000?', eq: ['1000 = [] tens'], a: [100] }]
      }
    },

    'digit-value': {
      watch: 'giving the digit or the place name instead of the value ("7" or "thousands" for the 7 in 47 305). Value = digit × place.',
      goal: 'I can tell what a digit is worth from its place.',
      learn: {
        show: { pic: ['pvmove', { n: 47305 }], cap: 'the 7 is in the thousands place', eq: ['7 × 1000 = 7000'] },
        together: [{ pic: ['pvmove', { n: 25618 }], q: 'The 5 is in the thousands place.', eq: ['5 × 1000 = []'], a: [5000] }, DV(63402, 6)],
        cue: 'Find the digit’s place. Value = digit × place.',
        own: [DV(18350, 8), DV(72914, 9), DV(30657, 3), DV(46281, 2)]
      },
      p1: {
        show: { pic: ['pvmove', { n: 52416 }], cap: 'the 2 is in the thousands place', eq: ['2 × 1000 = 2000'] },
        items: [DV(3456, 4), DV(8172, 1), DV(15340, 5), DV(29806, 9), DV(61537, 6), DV(40218, 8)]
      },
      p2: {
        items: [DV(57093, 7), DV(83126, 3), DV(94620, 4), DV(12785, 1),
          { q: 'Which number has a 6 worth 6000?', pick: { opts: ['36 125', '61 235', '23 615'], ans: 0, digit: { d: 6, worth: 6000 } } },
          DV(70482, 7)]
      },
      p3: {
        items: [DV(98031, 8), DV(24597, 5), DV(80714, 4), DV(65329, 3),
          { q: 'The 3 in 43 210 is worth 3000. The 3 in 1300 is worth 300.', eq: ['3000 = [] × 300'], a: [10] },
          { q: 'Write a 5-digit number with a 9 worth 900.', lines: { n: 1, key: 'Any number with 9 in the hundreds place, such as 12 945.' } }]
      },
      think: {
        items: [{ q: 'In 55 555, how are the first two 5s different?', lines: { n: 3, key: 'The first 5 is worth 50 000 and the second is worth 5000. The first is 10 times the second.' } },
          { q: '{b} says the 4 in 24 018 is worth 4. What went wrong?', lines: { n: 3, key: '{b} gave the digit, not its value. The 4 is in the thousands place, so it is worth 4000.' } },
          { q: 'Make the biggest number you can with 3, 0, 8, 1, 6.', eq: ['[]'], a: [86310], big: [3, 0, 8, 1, 6] },
          { q: 'Make the smallest 5-digit number with 3, 0, 8, 1, 6.', eq: ['[]'], a: [10368], small: [3, 0, 8, 1, 6] }]
      }
    },

    zero: {
      watch: 'leaving out zeros (forty thousand three hundred five as 4305). One digit for every place, from left to right.',
      goal: 'I can use zero to hold an empty place.',
      learn: {
        show: { pic: ['disks', { n: 40305 }], cap: 'no thousands and no tens', eq: ['40 305'] },
        together: [DK(20406), WN('thirty thousand fifty', 30050)],
        cue: 'Write one digit for every place. An empty place gets a 0.',
        own: [WN('sixty thousand eight', 60008), WN('seven thousand forty', 7040), WN('fifty thousand three hundred', 50300), WN('ten thousand five hundred two', 10502)]
      },
      p1: {
        show: { pic: ['pvmove', { n: 30607 }], cap: 'thirty thousand six hundred seven', eq: ['30 607'] },
        items: [DK(3060), DK(40011), WN('two thousand five', 2005), WN('eighty thousand', 80000), WN('nine thousand three hundred', 9300), WN('forty thousand twenty', 40020)]
      },
      p2: {
        items: [WN('twenty thousand four hundred six', 20406), WN('seventy thousand ninety', 70090), WN('five thousand eight', 5008), WN('thirty thousand three', 30003),
          DK(50050), { q: 'Which is forty thousand fifty?', pick: { opts: ['4050', '40 050', '40 500'], ans: 1, val: 40050 } }]
      },
      p3: {
        items: [WN('ninety thousand nine', 90009), WN('sixty thousand six hundred', 60600), WN('one hundred thousand', 100000), WN('eleven thousand eleven', 11011),
          { q: 'Which is ten thousand one hundred one?', pick: { opts: ['1101', '10 101', '100 101'], ans: 1, val: 10101 } },
          { q: 'Write the number.', eq: ['7 thousands + 9 ones = []'], a: [7009], wide: true }]
      },
      think: {
        items: [{ q: '{b} wrote forty thousand three hundred five as 4305. What went wrong?', lines: { n: 3, key: '{b} left out the zero in the thousands place. It should be 40 305.' } },
          { q: 'Why can’t we just leave out a zero in 50 006?', lines: { n: 3, key: 'Without the zeros the 5 would move to a smaller place: 56 is not 50 006.' } },
          { q: 'Draw disks for 20 030.', draw: { h: 70, key: ['disks', { n: 20030 }] } },
          { q: 'Which is more?', pick: { opts: ['30 003', '3300'], ans: 0, big: true }, wide: true }]
      }
    },

    expanded: {
      watch: 'writing the digits instead of their values (52 408 = 5 + 2 + 4 + 8). Each part is a digit times its place.',
      goal: 'I can write a number in expanded form and back again.',
      learn: {
        show: { pic: ['pvmove', { n: 52408 }], eq: ['50 000 + 2000 + 400 + 8', '= 52 408'] },
        together: [EX(36215), ST([40000, 3000, 70, 5])],
        cue: 'Write what each digit is worth, then add the parts. Skip the zeros.',
        own: [EX(4762), EX(81093), ST([20000, 600, 9]), ST([70000, 8000, 300, 40])]
      },
      p1: {
        show: { cap: '6347', eq: ['6000 + 300 + 40 + 7'] },
        items: [EX(5281), EX(3609), ST([4000, 500, 20, 1]), ST([9000, 80, 6]), EX(12345), ST([10000, 2000, 300])]
      },
      p2: {
        items: [EX(47052), EX(90810), ST([60000, 400, 7]), ST([30000, 9000, 500, 50]), EX(25006), ST([80000, 8])]
      },
      p3: {
        items: [EX(73519), EX(60407), ST([90000, 9000, 900, 9]), ST([50000, 3]),
          { eq: ['40 000 + [] + 60 + 2 = 47 062'], a: [7000], wide: true }, { eq: ['[] + 5000 + 30 = 85 030'], a: [80000], wide: true }]
      },
      think: {
        items: [{ q: '{b} wrote 52 408 = 5 + 2 + 4 + 8. What went wrong?', lines: { n: 3, key: '{b} added the digits, not their values. 52 408 = 50 000 + 2000 + 400 + 8.' } },
          { q: 'Write 30 000 + 4 + 200 in standard form. Is the order a problem?', eq: ['[]'], a: [30204], calc: '30000 + 4 + 200', lines: { n: 2, key: 'No. Adding works in any order.' } },
          { q: 'Show 46 000 in two other ways.', lines: { n: 3, key: 'For example: 40 000 + 6000, or 46 thousands, or 460 hundreds.' } },
          { q: 'Which is more?', pick: { opts: ['60 000 + 5', '6000 + 500'], ans: 0, big: true }, wide: true }]
      }
    },

    words: {
      watch: 'saying "and" inside a whole number (three hundred and five). In math, "and" marks the decimal point.',
      goal: 'I can read and write big numbers in words.',
      learn: {
        show: { cap: 'read the thousands part, say "thousand", then the rest', eq: ['forty-seven thousand three hundred five', '47 305'] },
        together: [WN('twenty-three thousand four hundred twelve', 23412), NW(18640, 'eighteen thousand six hundred forty')],
        cue: 'The space in 47 305 shows where to say "thousand".',
        own: [WN('sixty-one thousand two hundred five', 61205), WN('nine thousand eight hundred seventy', 9870),
          NW(35090, 'thirty-five thousand ninety'), NW(70412, 'seventy thousand four hundred twelve')]
      },
      p1: {
        show: { cap: 'six thousand two hundred fifty-four', eq: ['6254'] },
        items: [WN('four thousand three hundred', 4300), WN('fifteen thousand', 15000), WN('eight thousand sixty-two', 8062), WN('thirty thousand five hundred', 30500),
          NW(2017, 'two thousand seventeen'), NW(12400, 'twelve thousand four hundred')]
      },
      p2: {
        items: [WN('fifty-six thousand seven hundred eighty-one', 56781), WN('ninety-two thousand forty', 92040), WN('seventeen thousand three', 17003), WN('forty-four thousand four hundred four', 44404),
          NW(63518, 'sixty-three thousand five hundred eighteen'), NW(80905, 'eighty thousand nine hundred five')]
      },
      p3: {
        items: [WN('ninety-nine thousand nine hundred ninety-nine', 99999), WN('one hundred thousand', 100000), WN('seventy thousand seventeen', 70017), WN('twelve thousand twelve', 12012),
          NW(48076, 'forty-eight thousand seventy-six'), NW(91300, 'ninety-one thousand three hundred')]
      },
      think: {
        items: [{ q: '{b} read 305 as "three hundred and five". What would you tell {b}?', lines: { n: 3, key: 'Leave out "and". It marks a decimal point. Say three hundred five.' } },
          { q: 'Where would you see a number like 25 000 in real life?', lines: { n: 3, key: 'For example: people at a hockey game, the price of a car, or the people in a small town.' } },
          { q: 'Write a number in words that has a zero you do not say.', lines: { n: 3, key: 'For example: 40 205 is forty thousand two hundred five. The zeros in the thousands and tens are not said.' } },
          { q: 'Which is more?', pick: { opts: ['thirty thousand', 'twenty-nine thousand nine hundred'], ans: 0, big: true }, wide: true }]
      }
    },

    trade: {
      watch: 'thinking a trade changes the number. Trading 1 disk for 10 smaller disks keeps the value the same.',
      goal: 'I can show the same number in different ways.',
      learn: {
        show: { pic: ['disks', { list: [[1000, 2], [100, 3], [1, 4]] }], cap: '2304 is 23 hundreds and 4 ones', eq: ['23 hundreds + 4 ones = 2304'] },
        together: [{ eq: ['3500 = [] hundreds'], a: [35] }, { pic: ['disks', { list: [[1000, 1], [100, 12], [10, 3]] }], eq: ['[]'], a: [2230] }],
        cue: 'Trade 1 disk for 10 of the next smaller disk. The number does not change.',
        own: [{ eq: ['4700 = [] hundreds'], a: [47] }, { eq: ['26 000 = [] thousands'], a: [26] }, { eq: ['380 = [] tens'], a: [38] }, { eq: ['15 hundreds = []'], a: [1500] }]
      },
      p1: {
        show: { pic: ['disks', { list: [[100, 1], [10, 13]] }], cap: '1 hundred and 13 tens', eq: ['100 + 130 = 230'] },
        items: [{ eq: ['600 = [] tens'], a: [60] }, { eq: ['2000 = [] hundreds'], a: [20] }, { eq: ['14 tens = []'], a: [140] }, { eq: ['32 hundreds = []'], a: [3200] },
          { pic: ['disks', { list: [[100, 2], [10, 11]] }], eq: ['[]'], a: [310] }, { eq: ['5 thousands + 12 hundreds = []'], a: [6200], wide: true }]
      },
      p2: {
        items: [{ eq: ['45 000 = [] thousands'], a: [45] }, { eq: ['8300 = [] hundreds'], a: [83] }, { eq: ['3 ten thousands + 14 thousands = []'], a: [44000], wide: true }, { eq: ['2 thousands + 25 tens = []'], a: [2250], wide: true },
          { eq: ['6420 = [] tens'], a: [642] }, { eq: ['5307 = [] hundreds + 7 ones'], a: [53], wide: true }]
      },
      p3: {
        items: [{ eq: ['72 000 = [] hundreds'], a: [720] }, { eq: ['90 000 = [] tens'], a: [9000] }, { eq: ['4 ten thousands + 25 thousands = []'], a: [65000], wide: true }, { eq: ['18 thousands + 18 hundreds = []'], a: [19800], wide: true },
          { eq: ['30 500 = [] hundreds'], a: [305] }, { eq: ['2 ten thousands + 3 thousands = [] thousands'], a: [23], wide: true }]
      },
      think: {
        items: [{ q: 'Show 3250 in two different ways.', lines: { n: 3, key: 'For example: 3 thousands + 2 hundreds + 5 tens, or 32 hundreds + 5 tens, or 325 tens.' } },
          { q: '{b} says 23 hundreds is less than 2 thousands. Is that right?', lines: { n: 3, key: 'No. 23 hundreds is 2300, which is more than 2000.' } },
          { q: 'How many hundreds are in 100 000?', eq: ['100 000 = [] hundreds'], a: [1000] },
          { q: 'Which is more?', pick: { opts: ['45 hundreds', '4 thousands'], ans: 0, big: true }, wide: true }]
      }
    },

    compare: {
      watch: 'deciding by the biggest digit anywhere (39 999 > 40 001 because of the 9s). Line the numbers up and compare from the left.',
      goal: 'I can compare big numbers from the left.',
      learn: {
        show: { cap: 'the ten thousands decide: 4 is more than 3', eq: ['40 001 > 39 999'] },
        together: [CMP(52310, 52130), CMP(8999, 10000)],
        cue: 'Line up the places. Compare from the left. The first different digit decides.',
        own: [CMP(36458, 36485), CMP(71000, 70999), CMP(45230, 45230), CMP(9876, 12345)]
      },
      p1: {
        show: { cap: 'same thousands; the hundreds decide', eq: ['4721 < 4812'] },
        items: [CMP(3456, 3465), CMP(7200, 6999), CMP(15000, 1500), CMP(28341, 28314), CMP(6050, 6050), CMP(43210, 34210), CMP(9100, 9010), CMP(25000, 52000)]
      },
      p2: {
        items: [CMP(60706, 60076), CMP(99999, 100000), CMP(54321, 54312), CMP(80800, 80080), CMP(12345, 12354), CMP(70010, 7010), CMP(46900, 47000), CMP(33033, 33303)]
      },
      p3: {
        items: [CMP(98765, 98756), CMP(40400, 40040), CMP(30003, 30030), CMP(67890, 67890),
          { q: 'Find a number between 45 990 and 46 010.', lines: { n: 1, key: 'Any number from 45 991 to 46 009, such as 46 000.' } },
          { q: 'Circle the greatest.', pick: { opts: ['59 999', '60 001', '6100'], ans: 1, big: true } }]
      },
      think: {
        items: [{ q: '{b} says 39 999 > 40 001 because it has more 9s. Explain the mistake.', lines: { n: 3, key: 'Compare from the left: 3 ten thousands is less than 4 ten thousands, so 39 999 < 40 001.' } },
          { q: 'Why is a 5-digit number always more than a 4-digit number?', lines: { n: 3, key: 'A 5-digit number has at least 10 000. The biggest 4-digit number is 9999.' } },
          { q: 'Fill in a digit so that 4_ 512 > 47 512.', lines: { n: 1, key: '8 or 9.' } },
          { q: 'The biggest 4-digit number is 9999. What is one more?', eq: ['9999 + 1 = []'], a: [10000] }]
      }
    },

    order: {
      watch: 'ordering by the last digits. Compare the biggest place first; look at the next place only for a tie.',
      goal: 'I can put big numbers in order.',
      learn: {
        show: { cap: 'least to greatest', eq: ['8450 < 23 900 < 24 100'] },
        together: [ORD([3421, 3241, 3412]), ORD([45000, 9800, 45100])],
        cue: 'Compare the biggest place first. If two numbers tie, look at the next place.',
        own: [ORD([62300, 62030, 62003]), ORD([18500, 81500, 15800]), ORD([7099, 7909, 7990])]
      },
      p1: {
        show: { cap: 'least to greatest', eq: ['1234 < 1324 < 1342'] },
        items: [ORD([506, 560, 56]), ORD([4321, 4231, 4312]), ORD([9000, 900, 9900]), ORD([2750, 2570, 2705])]
      },
      p2: {
        items: [ORD([35210, 35120, 35201, 35012]), ORD([70000, 69999, 70001, 7000]), ORD([48300, 43800, 48030, 40830]), ORD([12340, 12304, 12430, 12043])]
      },
      p3: {
        items: [ORD([90909, 90099, 99009, 90990]), ORD([65432, 56432, 65342, 64532]),
          { q: 'Population of four towns: 24 380, 23 840, 24 038, 23 408. Least to greatest:', eq: ['[] < [] < [] < []'], a: [23408, 23840, 24038, 24380], set: ['24 380', '23 840', '24 038', '23 408'], wide: true },
          { q: 'Greatest to least: 81 500, 18 500, 85 100', eq: ['[] > [] > []'], a: [85100, 81500, 18500], set: ['81 500', '18 500', '85 100'], wide: true }]
      },
      think: {
        items: [{ q: 'Make three different 5-digit numbers with 2, 5, 0, 7, 9. Put them in order.', lines: { n: 3, key: 'For example: 20 579 < 52 790 < 97 520.' } },
          { q: '{b} put these in order: 7099, 7909, 7990, 799. What went wrong?', lines: { n: 3, key: '799 has only 3 digits, so it is the least. 799 < 7099 < 7909 < 7990.' } },
          { q: 'Write a number that goes between 45 000 and 45 100.', lines: { n: 1, key: 'Any number from 45 001 to 45 099, such as 45 050.' } },
          { q: 'Circle the least.', pick: { opts: ['30 300', '30 030', '33 000'], ans: 1, small: true }, wide: true }]
      }
    },

    hill: {
      watch: 'rounding down because the number "looks small", or looking at the wrong digit. Look at the digit just right of the rounding place.',
      goal: 'I can round to the nearest 10, 100, 1000 or 10 000.',
      learn: {
        show: { pic: ['hill', { lo: 48000, hi: 49000, n: 48650 }], cap: 'past the top: rolls up', eq: ['48 650 → 49 000'] },
        together: [RD(63280, 1000, true), RD(4570, 100, true)],
        cue: 'Look at the digit to the right of the rounding place. 5 or more: round up. Less than 5: round down.',
        own: [RD(27840, 1000, true), RD(352, 10, true)]
      },
      p1: {
        show: { pic: ['hill', { lo: 3400, hi: 3500, n: 3420 }], cap: 'before the top: rolls back', eq: ['3420 → 3400'] },
        items: [RD(86, 10, true), RD(2350, 100, true), RD(7613, 1000), RD(4449, 100), RD(15500, 1000), RD(381, 10)]
      },
      p2: {
        items: [RD(45678, 10000, true), RD(31247, 1000, true), RD(8765, 100), RD(56501, 10000), RD(12096, 10), RD(70450, 1000)]
      },
      p3: {
        items: [RD(84500, 10000), RD(24499, 1000), RD(65035, 100), RD(13333, 10), RD(98765, 1000), RD(55555, 10000)]
      },
      think: {
        items: [{ q: '{b} rounded 48 650 to the nearest thousand and got 48 000. What went wrong?', lines: { n: 3, key: 'The hundreds digit is 6, which is 5 or more, so it rounds up to 49 000.' } },
          { q: 'Write a number that rounds to 30 000 (nearest thousand) but is more than 30 000.', lines: { n: 1, key: 'Any number from 30 001 to 30 499.' } },
          { q: 'A town has 23 487 people. Why might a news story say "about 23 000"?', lines: { n: 3, key: 'Rounded numbers are easier to read and remember, and the exact count changes often.' } },
          { q: 'Mark 72 300 on the hill, then round it to the nearest 10 000.', pic: ['hill', { lo: 70000, hi: 80000, n: 72300, ask: true }], eq: ['72 300 is about []'], a: [70000], round: 10000 }]
      }
    },

    carry: {
      watch: 'writing 39 700 rounded to the nearest thousand as 30 000 or 39 000 + 1. Count the whole thousands, then add one more.',
      goal: 'I can round when a 9 rolls over.',
      learn: {
        show: { pic: ['hill', { lo: 39000, hi: 40000, n: 39700 }], cap: '39 thousands and one more is 40 thousands', eq: ['39 700 → 40 000'] },
        together: [RD(4970, 100, true), RD(69800, 1000, true)],
        cue: 'A 9 that rounds up becomes 10: write 0 and carry 1 to the left.',
        own: [RD(995, 10), RD(19650, 1000), RD(9960, 100), RD(29999, 10)]
      },
      p1: {
        show: { pic: ['hill', { lo: 290, hi: 300, n: 297 }], cap: '29 tens and one more is 30 tens', eq: ['297 → 300'] },
        items: [RD(98, 10), RD(396, 10), RD(1950, 100), RD(5980, 100), RD(9600, 1000), RD(7999, 10)]
      },
      p2: {
        items: [RD(49500, 1000), RD(39960, 100), RD(99800, 1000), RD(59996, 10), RD(95000, 10000), RD(19980, 100)]
      },
      p3: {
        items: [RD(99999, 10), RD(99950, 100), RD(99500, 1000), RD(95500, 10000), RD(9995, 10), RD(89970, 100)]
      },
      think: {
        items: [{ q: '{b} rounded 39 700 to the nearest thousand and wrote 30 000. What went wrong?', lines: { n: 3, key: '39 700 is between 39 000 and 40 000, and it is past 39 500. It rounds up to 40 000.' } },
          { q: 'Round 99 999 to the nearest 10, 100, 1000 and 10 000. What do you notice?', lines: { n: 3, key: 'Every answer is 100 000. The 9s keep carrying.' } },
          { q: 'Write a number that rounds to 60 000 (nearest thousand) but starts with 59.', lines: { n: 1, key: 'Any number from 59 500 to 59 999.' } },
          { q: 'Which rounds to 10 000 (nearest hundred)?', pick: { opts: ['9949', '9950', '9849'], ans: 1, round: { to: 100, val: 10000 } }, wide: true }]
      }
    },

    'hundred-k': {
      watch: 'thinking 100 000 is 100 thousands written as 1000 000. Count zeros by place: 1 hundred thousand has 5 zeros.',
      goal: 'I can picture 100 000.',
      learn: {
        show: { pic: ['grid', { n: 100, unit: '1000' }], cap: '100 squares of 1000', eq: ['100 × 1000 = 100 000'] },
        together: [{ pic: ['grid', { n: 30, unit: '1000' }], eq: ['30 × 1000 = []'], a: [30000] }, { eq: ['10 × 10 000 = []'], a: [100000] }],
        cue: '100 000 = 10 × 10 000 = 100 × 1000.',
        own: [{ eq: ['100 000 = [] × 1000'], a: [100] }, { eq: ['100 000 = [] × 10 000'], a: [10] }]
      },
      p1: {
        show: { pic: ['grid', { n: 20, unit: '1000' }], cap: '20 squares of 1000', eq: ['20 000'] },
        items: [{ pic: ['grid', { n: 10, unit: '1000' }], eq: ['[]'], a: [10000] }, { pic: ['grid', { n: 50, unit: '1000' }], eq: ['[]'], a: [50000] },
          { eq: ['100 000 = [] × 10 000'], a: [10] }, { eq: ['100 000 − 1 = []'], a: [99999] }]
      },
      p2: {
        items: [{ pic: ['grid', { n: 75, unit: '1000' }], eq: ['[]'], a: [75000] }, { pic: ['grid', { n: 62, unit: '1000' }], eq: ['[]'], a: [62000] },
          { eq: ['100 000 = [] × 100'], a: [1000] }, { eq: ['100 000 ÷ 10 = []'], a: [10000] },
          { eq: ['100 000 − 10 000 = []'], a: [90000], wide: true }, { eq: ['50 000 + 50 000 = []'], a: [100000], wide: true }]
      },
      p3: {
        items: [{ pic: ['grid', { n: 88, unit: '1000' }], eq: ['100 000 − [] = 88 000'], a: [12000], wide: true }, { eq: ['100 000 = 4 × []'], a: [25000] },
          { eq: ['100 000 ÷ 1000 = []'], a: [100] }, { eq: ['[] + 36 000 = 100 000'], a: [64000], wide: true },
          story('A stadium holds 25 000 people. How many full stadiums make 100 000 people?', 4, '100000 ÷ 25000', 'stadiums'),
          story('{a} reads 1000 pages a month. How many months to read 100 000 pages?', 100, '100000 ÷ 1000', 'months')]
      },
      think: {
        items: [{ q: '{b} wrote one hundred thousand as 1 000 000. What went wrong?', lines: { n: 3, key: 'That is one million. One hundred thousand has 5 zeros: 100 000.' } },
          { q: 'Shade the grid to show 37 000.', pic: ['grid', { n: 0, unit: '1000', ask: 37 }] },
          { q: 'Name something in Canada that is about 100 000.', lines: { n: 3, key: 'For example: the people in a city like Kamloops or Moncton.' } },
          { q: 'How many 1000s fit in 100 000?', eq: ['[]'], a: [100], calc: '100000 ÷ 1000' }]
      }
    }
  } });

  /* a story with one answer box; calc is the sum the answer check works out */
  function story(q, ans, calc, unit) { return { q: q, eq: ['[] ' + (unit || '{many}')], a: [ans], calc: calc }; }
})();
