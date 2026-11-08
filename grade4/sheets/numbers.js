/* Grade 4 Numbers to 10\u00a0000: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/numbers.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.1 read, build and break apart numbers to 10\u00a0000, B1.2 compare and order them, B1.3 round to the
   nearest 10, 100 or 1000. The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var PLACE = { 1: 'ones', 10: 'tens', 100: 'hundreds', 1000: 'thousands' };
  function parts(n) { return [1000, 100, 10, 1].map(function (p) { return Math.floor(n / p) % 10 * p; }); }
  /* n in expanded form: every place gets a box (zeros too, when all) or only the non-zero places */
  function EX(n, all) { var p = parts(n).filter(function (v) { return all || v; }); return { eq: [n + ' = ' + p.map(function () { return '[]'; }).join(' + ')], a: p, wide: true }; }
  /* expanded form back to the number */
  function BACK(n) { return { eq: [parts(n).filter(Boolean).join(' + ') + ' = []'], a: [n], wide: parts(n).filter(Boolean).length > 3 }; }
  /* what one digit of n is worth: place is 1, 10, 100 or 1000 */
  function VAL(n, place) { var d = Math.floor(n / place) % 10; return { q: 'In ' + n + ', what is the ' + d + ' worth?', eq: ['[]'], a: [d * place], dv: { n: n, d: d } }; }
  /* how many of a place make a number (a trade) */
  function HOW(total, place) { return { eq: ['[] ' + PLACE[place] + ' = ' + S.fmt(total)], a: [total / place] }; }
  /* compare two numbers with <, > or = */
  function CMP(x, y) { return { eq: [S.fmt(x) + ' [] ' + S.fmt(y)], a: [x < y ? '<' : x > y ? '>' : '='] }; }
  /* put numbers in order, least first (down: greatest first) */
  function ORD(list, down) {
    var s = list.slice().sort(function (p, q) { return down ? q - p : p - q; });
    return { q: (down ? 'Greatest to least: ' : 'Least to greatest: ') + list.map(S.fmt).join(', '), eq: [s.map(function () { return '[]'; }).join(down ? ' > ' : ' < ')], a: s.map(S.fmt), set: list, wide: list.length > 3 };
  }
  /* round n to the nearest 10, 100 or 1000 */
  function RD(n, to) { return { q: 'Round ' + n + ' to the nearest ' + to + '.', eq: ['[]'], a: [Math.round(n / to) * to], round: { n: n, to: to } }; }
  /* circle the number named in words */
  function NW(words, opts, ans) { return { q: 'Circle ' + words + '.', pick: { opts: opts.map(String), ans: ans, nw: words } }; }
  /* circle the words for a number */
  function WN(n, opts, ans) { return { q: 'Circle the words for ' + n + '.', pick: { opts: opts, ans: ans, wn: n }, wide: true }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  function BIG(q, opts, ans) { return { q: q, pick: { opts: opts, ans: ans, big: true } }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }

  S.register('numbers', { code: 'NU', ideas: {

    'ten-times': {
      watch: 'thinking a thousand is 100 ones more than a hundred. Build it: 10 hundreds make 1 thousand.',
      goal: 'I can trade 10 of one place for 1 of the next.',
      learn: {
        show: { cap: 'Tens to hundreds, hundreds to thousands', eq: ['10 × 10 = 100', '10 × 100 = 1000'] },
        together: [{ q: 'How many tens make 1 hundred?', eq: ['[] × 10 = 100'], a: [10] }, { q: 'How many hundreds make 1 thousand?', eq: ['[] × 100 = 1000'], a: [10] }],
        cue: '10 of a place make 1 of the next place to the left.',
        own: [HOW(2000, 100), HOW(300, 10), HOW(5000, 1000), HOW(60, 1)]
      },
      p1: {
        show: { cap: '10 tens make 1 hundred', eq: ['10 × 10 = 100'] },
        items: [HOW(100, 10), HOW(1000, 100), HOW(200, 10), HOW(3000, 1000), HOW(40, 10), HOW(10, 1)]
      },
      p2: {
        items: [HOW(4000, 100), HOW(700, 10), HOW(6000, 1000), HOW(900, 100),
          story('{a} packs 10 {many} in each {cont}. How many {conts} for 300 {many}?', '{conts}', 30, '300 ÷ 10'),
          { eq: ['10 × 1000 = []', '100 × 100 = []'], a: [S.fmt(10000), S.fmt(10000)] }]
      },
      p3: {
        items: [HOW(8000, 100), HOW(2500, 100), HOW(1200, 10), HOW(9000, 10), TF('30 × 100 = 3000', true),
          story('{b} has 45 {conts} with 100 {many} in each. How many {many}?', '{many}', 4500, '45 × 100')]
      },
      think: {
        items: [{ q: 'Explain why 10 hundreds is the same as 1 thousand.', lines: { n: 3, key: '1 hundred is 100. 10 of them are 100 + 100 + ... ten times, which is 1000.' } },
          { q: '{b} says 1000 is 10 tens. What went wrong?', lines: { n: 3, key: '10 tens is only 100. 1000 is 100 tens, or 10 hundreds.' } },
          { q: 'How many tens make 10\u00a0000?', eq: ['[] × 10 = 10\u00a0000'], a: [1000] },
          { q: 'Draw or explain how to make 2000 from hundreds.', draw: { h: 100, key: '20 hundreds: two groups of 10 hundreds.' } }]
      }
    },

    build: {
      watch: 'reading a digit as itself, not its value (the 3 in 3245 is "3", not 3000). Point to the place name above each digit.',
      goal: 'I can say what each digit in a number is worth.',
      learn: {
        show: { cap: '3245: 3 thousands, 2 hundreds, 4 tens, 5 ones', eq: ['3000 + 200 + 40 + 5 = 3245'] },
        together: [VAL(3245, 1000), VAL(3245, 100)],
        cue: 'The place of a digit decides its value. Read the place name above the digit.',
        own: [VAL(7516, 1000), VAL(7516, 10), VAL(4382, 100), VAL(9264, 1)]
      },
      p1: {
        show: { cap: 'The 6 is in the hundreds place', eq: ['1634: the 6 is worth 600'] },
        items: [VAL(2451, 1000), VAL(2451, 100), VAL(5372, 10), VAL(8125, 1), VAL(6743, 100), VAL(1958, 10)]
      },
      p2: {
        items: [VAL(4826, 1000), VAL(9374, 10), VAL(3562, 100), BACK(6257), BACK(8431),
          { eq: ['4 thousands + 7 hundreds + 2 tens + 9 ones = []'], a: [4729], wide: true }]
      },
      p3: {
        items: [VAL(7935, 100), VAL(5289, 1000), { eq: ['9 thousands + 1 hundred + 6 tens + 3 ones = []'], a: [9163], wide: true },
          { eq: ['2 ones + 5 thousands + 8 tens + 4 hundreds = []'], a: [5482], wide: true },
          VAL(4321, 100), { q: 'How much more is the 7 in 7700 than the 7 next to it?', eq: ['7000 − 700 = []'], a: [6300] }]
      },
      think: {
        items: [{ q: 'Make the biggest number you can with 3, 9, 1 and 6.', eq: ['[]'], a: [9631], big: [3, 9, 1, 6] },
          { q: 'Make the smallest number you can with 3, 9, 1 and 6.', eq: ['[]'], a: [1369], small: [3, 9, 1, 6] },
          { q: '{b} says the 5 in 5800 and in 8500 are worth the same. Is that right?', lines: { n: 3, key: 'No. In 5800 the 5 is worth 5000. In 8500 it is worth 500.' } },
          { q: 'Write a number where the 4 is worth 40 and the 6 is worth 6000.', lines: { n: 2, key: 'For example: 6140, 6243 or 6947 (6 in the thousands, 4 in the tens).' } },
          { q: 'What number is 1000 more than 3245?', eq: ['3245 + 1000 = []'], a: [4245] }]
      }
    },

    zero: {
      watch: 'leaving out a zero (four thousand one hundred seven as 417) or adding extra ones (4000107). A number in the thousands has 4 digits.',
      goal: 'I can write a 0 in an empty place.',
      learn: {
        show: { cap: 'Four thousand one hundred seven: no tens', eq: ['4000 + 100 + 7 = 4107'] },
        together: [{ q: 'Five thousand sixty-two', eq: ['5000 + 60 + 2 = []'], a: [5062] }, { q: 'Three thousand four', eq: ['3000 + 4 = []'], a: [3004] }],
        cue: 'An empty place gets a 0. A number in the thousands has 4 digits.',
        own: [BACK(2015), BACK(6300), BACK(8070), { q: 'Seven thousand nine', eq: ['7000 + 9 = []'], a: [7009] }]
      },
      p1: {
        show: { cap: 'No hundreds: write a 0', eq: ['2000 + 40 + 5 = 2045'] },
        items: [BACK(3021), BACK(1406), BACK(5800), BACK(9007), BACK(4090), BACK(7305)]
      },
      p2: {
        items: [NW('two thousand six', [2006, 206, 2060], 0), NW('four thousand thirty', [430, 4030, 4300], 1), BACK(8050), BACK(6003),
          { q: 'Six thousand forty-one', eq: ['6000 + 40 + 1 = []'], a: [6041] }, NW('nine thousand eight', [9800, 9080, 9008], 2)]
      },
      p3: {
        items: [NW('five thousand five', [5005, 5050, 5500], 0), NW('one thousand ninety', [1900, 1090, 190], 1), BACK(7060), BACK(3009),
          EX(4070), NW('eight thousand twenty', [8200, 8020, 820], 1)]
      },
      think: {
        items: [{ q: '{b} wrote four thousand one hundred seven as 417. What went wrong?', lines: { n: 3, key: 'There are no tens, so the tens place needs a 0: 4107.' } },
          { q: 'Why does 3040 need two zeros?', lines: { n: 3, key: 'It has no hundreds and no ones. Each empty place gets a 0.' } },
          { q: 'Write all the 4-digit numbers you can make with 5, 0, 0 and 2 that start with 2.', lines: { n: 2, key: '2005, 2050, 2500.' } },
          WN(6008, ['six thousand eight', 'six thousand eighty', 'six hundred eight'], 0)]
      }
    },

    expanded: {
      watch: 'writing every digit as itself (5236 = 5 + 2 + 3 + 6). Each part is the value of a digit, so it ends in zeros for its place.',
      goal: 'I can write a number in expanded form.',
      learn: {
        show: { cap: 'Add the value of each digit', eq: ['5236 = 5000 + 200 + 30 + 6'] },
        together: [EX(4382), EX(7048)],
        cue: 'Write what each digit is worth. Skip the zeros.',
        own: [EX(2516), EX(9407), BACK(3625), BACK(8090)]
      },
      p1: {
        show: { cap: 'Each digit, with its place', eq: ['1234 = 1000 + 200 + 30 + 4'] },
        items: [EX(3456), EX(2718), BACK(5341), BACK(6127), EX(1999), BACK(4862)]
      },
      p2: {
        items: [EX(8305), EX(6040), BACK(7108), BACK(9056), EX(5600),
          { q: 'Find the missing part.', eq: ['4000 + [] + 20 + 7 = 4527'], a: [500], wide: true }]
      },
      p3: {
        items: [EX(7009), EX(3480), { q: 'Find the missing part.', eq: ['6000 + 300 + [] = 6305'], a: [5], wide: true },
          { q: 'Find the missing part.', eq: ['[] + 90 + 2 = 8092'], a: [8000] },
          { eq: ['300 + 4000 + 8 + 50 = []'], a: [4358], wide: true }, TF('2000 + 60 + 300 = 2360', true)]
      },
      think: {
        items: [{ q: '{b} says 5236 = 5 + 2 + 3 + 6. What went wrong?', lines: { n: 3, key: '{b} wrote the digits, not their values: 5000 + 200 + 30 + 6.' } },
          { q: 'Write 4580 two ways: as thousands, hundreds and tens, and with 45 hundreds.', lines: { n: 3, key: '4000 + 500 + 80, and 4500 + 80.' } },
          { eq: ['80 + 7000 + 6 = []'], a: [7086] },
          { q: 'Write your own number. Write it in expanded form.', lines: { n: 2, key: 'Any 4-digit number with each digit written as its value, for example 6152 = 6000 + 100 + 50 + 2.' } }]
      }
    },

    words: {
      watch: 'saying "and" inside a whole number ("three thousand and forty-five"). "And" is saved for the decimal point.',
      goal: 'I can read and write numbers in words.',
      learn: {
        show: { cap: 'two thousand five hundred sixty-eight', eq: ['2568'] },
        together: [WN(3045, ['three thousand forty-five', 'three hundred forty-five'], 0),
          NW('seven thousand two hundred ten', [7210, 7201, 72010], 0)],
        cue: 'Read the thousands, then the hundreds, tens and ones. Do not say "and".',
        own: [NW('one thousand six hundred', [1060, 1600, 16000], 1), NW('nine thousand ninety', [9090, 9900, 9009], 0),
          NW('four thousand eighteen', [4018, 4080, 4180], 0), NW('six thousand two', [6200, 6002, 6020], 1)]
      },
      p1: {
        show: { cap: 'one thousand two hundred fifty', eq: ['1250'] },
        items: [NW('two thousand three hundred', [2300, 2030, 230], 0), NW('five thousand forty', [5400, 5040, 540], 1),
          NW('eight thousand one', [8001, 8010, 8100], 0), NW('three thousand seventy-five', [3705, 3075, 3750], 1),
          WN(4500, ['four thousand five hundred', 'forty-five thousand'], 0), WN(7016, ['seven thousand sixteen', 'seven thousand sixty'], 0)]
      },
      p2: {
        items: [{ q: 'Write 6427 in words.', lines: { n: 2, key: 'six thousand four hundred twenty-seven' } }, { q: 'Write 3080 in words.', lines: { n: 2, key: 'three thousand eighty' } },
          NW('nine thousand five hundred twelve', [9512, 9521, 95012], 0), NW('four thousand four', [4040, 4004, 4400], 1),
          WN(2709, ['two thousand seven hundred nine', 'two thousand seventy-nine'], 0), WN(5150, ['five thousand one hundred fifty', 'five thousand fifteen'], 0)]
      },
      p3: {
        items: [{ q: 'Write 8306 in words.', lines: { n: 2, key: 'eight thousand three hundred six' } }, { q: 'Write 1999 in words.', lines: { n: 2, key: 'one thousand nine hundred ninety-nine' } },
          NW('seven thousand seventy', [7700, 7007, 7070], 2), NW('ten thousand', ['1000', '10\u00a0000', '100\u00a0000'], 1),
          WN(3030, ['three thousand thirty', 'three thousand three'], 0), WN(9090, ['nine thousand ninety', 'nine thousand nine'], 0)]
      },
      think: {
        items: [{ q: '{b} reads 3045 as "three thousand and forty-five". What would you tell {b}?', lines: { n: 3, key: 'Do not say "and" in a whole number: three thousand forty-five.' } },
          { q: 'Write a number between 4000 and 5000 in words.', lines: { n: 2, key: 'Any, for example four thousand two hundred eleven.' } },
          { q: 'Which word tells you where to put the biggest digit?', lines: { n: 2, key: '"Thousand": the number before it goes in the thousands place.' } },
          NW('six thousand six hundred six', [6606, 6660, 6066], 0)]
      }
    },

    trade: {
      watch: 'thinking 13 hundreds is wrong and not a real way to show 1300. Trade with play money: 13 hundred-dollar bills are $1300.',
      goal: 'I can show the same number with different blocks.',
      learn: {
        show: { cap: '1 thousand = 10 hundreds', eq: ['1300 = 1000 + 300', '1300 = 13 × 100'] },
        together: [HOW(1300, 100), HOW(2400, 100)],
        cue: 'Trading 1 of a place for 10 of the next smaller place does not change the number.',
        own: [HOW(350, 10), HOW(3600, 100), HOW(1200, 10), { q: '2 thousands and 15 hundreds', eq: ['2000 + 1500 = []'], a: [3500] }]
      },
      p1: {
        show: { cap: '12 tens is 1 hundred and 2 tens', eq: ['12 × 10 = 120'] },
        items: [HOW(150, 10), HOW(1100, 100), HOW(1700, 100), HOW(230, 10), { eq: ['14 × 100 = []'], a: [1400] }, { eq: ['25 × 10 = []'], a: [250] }]
      },
      p2: {
        items: [HOW(4500, 100), HOW(2800, 100), HOW(670, 10), { q: '3 thousands and 12 hundreds', eq: ['3000 + 1200 = []'], a: [4200] },
          { q: '5 hundreds and 23 tens', eq: ['500 + 230 = []'], a: [730] },
          story('{a} has 26 {conts} of 100 {many}. How many {many}?', '{many}', 2600, '26 × 100')]
      },
      p3: {
        items: [HOW(6400, 100), HOW(1050, 10), { q: '4 thousands, 15 hundreds and 12 tens', eq: ['4000 + 1500 + 120 = []'], a: [5620], wide: true },
          { q: '7 thousands and 30 hundreds', eq: ['7000 + 3000 = []'], a: [S.fmt(10000)] }, { q: '2 thousands and 13 hundreds', eq: ['2000 + 1300 = []'], a: [3300] },
          story('{b} has 3 {conts} of 1000 {many} and 14 {conts} of 100. How many {many}?', '{many}', 4400, '3 × 1000 + 14 × 100')]
      },
      think: {
        items: [{ q: 'Show 2300 in two different ways with thousands and hundreds.', lines: { n: 3, key: '2 thousands and 3 hundreds; 1 thousand and 13 hundreds; 23 hundreds.' } },
          { q: '{b} says 15 hundreds is not a real number. What would you tell {b}?', lines: { n: 3, key: '15 hundreds is 1500. It is the same as 1 thousand and 5 hundreds.' } },
          { q: 'How many hundreds are in 10\u00a0000?', eq: ['[] × 100 = 10\u00a0000'], a: [100] },
          { q: 'Why can a number be shown in more than one way?', lines: { n: 3, key: '10 of one place make 1 of the next, so we can trade without changing the amount.' } }]
      }
    },

    left: {
      watch: 'comparing the last digits first (3999 > 4001 because 9 > 1). Point to the leftmost place first.',
      goal: 'I can compare numbers by starting at the left.',
      learn: {
        show: { cap: 'The thousands decide: 4 > 3', eq: ['4001 > 3999'] },
        together: [CMP(5284, 5248), CMP(3999, 4001)],
        cue: 'Compare from the left. The first different digit decides.',
        own: [CMP(6720, 6702), CMP(1888, 2001), CMP(4350, 4350), CMP(9099, 9909)]
      },
      p1: {
        show: { cap: 'Same thousands, so look at the hundreds', eq: ['2500 > 2300'] },
        items: [CMP(3000, 2000), CMP(4500, 4700), CMP(1234, 1243), CMP(8000, 7999), CMP(6150, 6150), CMP(5402, 5420)]
      },
      p2: {
        items: [CMP(7385, 7358), CMP(2999, 3001), CMP(6041, 6014), CMP(9500, 9050),
          BIG('Circle the greater number.', ['4608', '4680', '4086'], 1),
          story('{a} has 2345 {many}. {b} has 2354 {many}. How many more does {b} have?', '{many}', 9, '2354 − 2345')]
      },
      p3: {
        items: [CMP(8098, 8908), CMP(5555, 5505), CMP(1001, 999), CMP(10000, 9999),
          BIG('Circle the greatest.', ['7070', '7007', '7700'], 2), CMP(6098, 6908)]
      },
      think: {
        items: [{ q: '{b} says 3999 > 4001 because 9 > 1. What went wrong?', lines: { n: 3, key: '{b} looked at the right first. Start at the left: 3 thousands < 4 thousands, so 3999 < 4001.' } },
          { q: 'Write a number between 5367 and 5400.', eq: ['5367 < [] < 5400'], a: [5380] },
          { q: 'Why does a 4-digit number always beat a 3-digit number?', lines: { n: 3, key: 'It has thousands. A 3-digit number is at most 999, less than 1000.' } },
          BIG('Which is greater?', ['ten thousand', '9999'], 0)]
      }
    },

    symbols: {
      watch: 'mixing up < and >. The open side faces the greater number; read it out: "4001 is greater than 3999".',
      goal: 'I can use < and > to compare.',
      learn: {
        show: { cap: 'Same two numbers, both ways', eq: ['3999 < 4001', '4001 > 3999'] },
        together: [CMP(2618, 2681), CMP(7400, 7040)],
        cue: 'The symbol opens toward the greater number. Read it from the left.',
        own: [CMP(5132, 5123), CMP(3870, 3878), CMP(9001, 9010), CMP(6400, 6400)]
      },
      p1: {
        show: { cap: 'Read it: 2000 is less than 3000', eq: ['2000 < 3000'] },
        items: [CMP(1500, 2500), CMP(6000, 5000), CMP(3400, 3300), CMP(4210, 4210), CMP(8700, 8770), CMP(2050, 2005)]
      },
      p2: {
        items: [CMP(4567, 4576), CMP(8090, 8009), CMP(3300, 3030), CMP(7199, 7200), CMP(5080, 5800), CMP(6200, 6400)]
      },
      p3: {
        items: [CMP(9998, 9989), CMP(2468, 2486), CMP(5007, 5070), CMP(10000, 9000), CMP(4040, 4004), CMP(7777, 7707)]
      },
      think: {
        items: [{ q: 'Write a number that makes this true.', eq: ['4500 < [] < 4600'], a: [4550] },
          { q: '{b} wrote 6200 < 6020. What went wrong?', lines: { n: 3, key: 'Same thousands; 2 hundreds is more than 0 hundreds. 6200 > 6020.' } },
          { q: 'Write 8015 and 8105 with a symbol. Then read it in words.', lines: { n: 3, key: '8015 < 8105: eight thousand fifteen is less than eight thousand one hundred five.' } },
          { q: 'How do you remember which way the symbol goes?', lines: { n: 2, key: 'For example: the open side faces the bigger number.' } }]
      }
    },

    order: {
      watch: 'ordering by the last digit, or by how many 9s a number has. Line the numbers up place by place and compare from the left.',
      goal: 'I can put numbers in order.',
      learn: {
        show: { cap: 'All have 3 thousands, so look further right', eq: ['3215 < 3251 < 3512'] },
        together: [ORD([4230, 4032, 4320]), ORD([1999, 2010, 1909], true)],
        cue: 'Order by comparing from the left, one place at a time.',
        own: [ORD([5600, 5060, 5006]), ORD([7123, 7213, 7132]), ORD([8800, 8080, 8008], true), ORD([2345, 2354, 2435])]
      },
      p1: {
        show: { cap: 'Least first', eq: ['1000 < 2000 < 3000'] },
        items: [ORD([3000, 1000, 2000]), ORD([4500, 4300, 4700]), ORD([6100, 6010, 6110]), ORD([2200, 2020, 2002], true), ORD([9000, 9900, 9090]), ORD([1500, 1050, 1505], true)]
      },
      p2: {
        items: [ORD([4321, 4312, 4231, 4213]), ORD([6070, 6700, 6007, 6077], true), ORD([3999, 4001, 3909, 4010]),
          ORD([8524, 8542, 8254, 8245], true), ORD([1111, 1101, 1011, 1110]), ORD([7650, 7605, 7560, 7506], true)]
      },
      p3: {
        items: [ORD([9087, 9807, 9078, 9780]), ORD([5009, 5090, 5900, 5099], true), ORD([2468, 2486, 2648, 2684]),
          ORD([10000, 9999, 9909, 9990], true), ORD([3303, 3330, 3033, 3003]), ORD([6416, 6461, 6146, 6164], true)]
      },
      think: {
        items: [{ q: 'Make 4 numbers with the digits 2, 5, 7 and 0. Put them in order.', lines: { n: 3, key: 'For example: 2057 < 2570 < 5207 < 7520.' } },
          { q: '{b} put 3412, 3241, 3124 in order as 3412 < 3241 < 3124. What went wrong?', lines: { n: 3, key: '{b} put them in the wrong direction. Least first: 3124 < 3241 < 3412.' } },
          { q: 'Lake heights: Huron 176 m, Ontario 75 m, Superior 183 m, Erie 174 m. Order them, least first.', eq: ['[] < [] < [] < []'], a: [75, 174, 176, 183], set: [176, 75, 183, 174], wide: true },
          { q: 'Explain how you order four numbers.', lines: { n: 2, key: 'Compare from the left, place by place; the first different digit decides.' } }]
      }
    },

    hill: {
      watch: 'rounding to whichever end of the line is closer on the page, not by the number. Find the halfway mark first.',
      goal: 'I can round a number by finding the halfway mark.',
      learn: {
        show: { cap: '3650 is past halfway (3500), so round up', eq: ['3650 rounds to 4000'] },
        together: [RD(2300, 1000), RD(470, 100)],
        cue: 'Find the two friendly numbers and the halfway mark. Halfway or past: round up.',
        own: [RD(6800, 1000), RD(1240, 100), RD(5500, 1000), RD(87, 10)]
      },
      p1: {
        show: { cap: 'Halfway between 40 and 50 is 45', eq: ['43 rounds to 40'] },
        items: [RD(62, 10), RD(48, 10), RD(250, 100), RD(310, 100), RD(1700, 1000), RD(4200, 1000)]
      },
      p2: {
        items: [RD(3490, 1000), RD(785, 100), RD(5550, 100), RD(8500, 1000), RD(925, 10), RD(7149, 100)]
      },
      p3: {
        items: [RD(4501, 1000), RD(6449, 1000), RD(2350, 100), RD(9995, 10), RD(8865, 100), RD(1050, 1000)]
      },
      think: {
        items: [{ q: 'Write 3 numbers that round to 5000 (nearest thousand).', lines: { n: 2, key: 'Any from 4500 to 5499, for example 4600, 5000, 5300.' } },
          { q: '{b} rounds 3500 to 3000. What would you tell {b}?', lines: { n: 3, key: 'Halfway rounds up, so 3500 rounds to 4000.' } },
          { q: 'Why do we round numbers in real life?', lines: { n: 3, key: 'For example, to estimate a price or a crowd quickly.' } },
          { q: 'What is the smallest number that rounds to 700 (nearest hundred)?', eq: ['[]'], a: [650], least: { to: 100, r: 700 } }]
      }
    },

    rule: {
      watch: 'looking at the wrong digit. Underline the place you round to, then look only at the digit just to its right.',
      goal: 'I can round with the digit to the right.',
      learn: {
        show: { cap: 'Nearest hundred: look at the tens digit', eq: ['3472: 7 is 5 or more', '3472 rounds to 3500'] },
        together: [RD(5238, 100), RD(5238, 1000)],
        cue: '5 or more, round up. Less than 5, round down.',
        own: [RD(4761, 100), RD(4761, 1000), RD(2148, 10), RD(8352, 100)]
      },
      p1: {
        show: { cap: 'Nearest ten: look at the ones', eq: ['67 rounds to 70'] },
        items: [RD(34, 10), RD(85, 10), RD(1416, 10), RD(392, 100), RD(2813, 100), RD(6200, 1000)]
      },
      p2: {
        items: [RD(5673, 10), RD(5673, 100), RD(5673, 1000), RD(8049, 100), RD(3555, 1000), RD(7206, 10)]
      },
      p3: {
        items: [RD(9437, 10), RD(9437, 100), RD(9437, 1000), RD(1450, 100), RD(6052, 1000), RD(4005, 10)]
      },
      think: {
        items: [{ q: 'Round 4682 to the nearest 10, 100 and 1000. Which is closest to 4682?', lines: { n: 3, key: '4680, 4700, 5000. The nearest 10 is closest.' } },
          { q: '{b} rounds 2349 to the nearest hundred and gets 2400. What went wrong?', lines: { n: 3, key: '{b} looked at the 9. Look at the tens digit, 4: round down to 2300.' } },
          { q: 'A park had 3486 visitors. Round it for a news story. Which place did you pick? Why?', lines: { n: 3, key: 'For example: about 3500 (nearest hundred), easy to read and close.' } },
          RD(5995, 100)]
      }
    },

    carry: {
      watch: 'writing 2970 rounded to the nearest hundred as 21000 or 2100. Ask: "What hundred comes after 2900?"',
      goal: 'I can round up when it changes more than one digit.',
      learn: {
        show: { cap: '29 hundreds round up to 30 hundreds', eq: ['2970 rounds to 3000'] },
        together: [RD(3960, 100), RD(9600, 1000)],
        cue: 'If rounding up makes 10 in a place, group it into the next place.',
        own: [RD(4950, 100), RD(1997, 10), RD(6980, 100), RD(9500, 1000)]
      },
      p1: {
        show: { cap: '9 tens and 1 more ten make a hundred', eq: ['396 rounds to 400'] },
        items: [RD(98, 10), RD(195, 10), RD(296, 10), RD(970, 100), RD(1960, 100), RD(4990, 100)]
      },
      p2: {
        items: [RD(3996, 10), RD(5950, 100), RD(7980, 100), RD(8700, 1000), RD(2995, 10), RD(6960, 100)]
      },
      p3: {
        items: [RD(9995, 10), RD(9960, 100), RD(9700, 1000), RD(1996, 100), RD(3999, 1000), RD(8950, 100)]
      },
      think: {
        items: [{ q: '{b} rounds 2970 to the nearest hundred and writes 21000. What went wrong?', lines: { n: 3, key: '29 hundreds and 1 more is 30 hundreds: 3000.' } },
          { q: 'Find a number that rounds to 10\u00a0000 (nearest thousand).', lines: { n: 2, key: 'Any from 9500 to 9999, or 10\u00a0000.' } },
          { q: 'Which digits change when 4996 rounds to the nearest ten?', lines: { n: 2, key: 'The tens, hundreds and ones: 4996 rounds to 5000.' } },
          RD(5998, 10)]
      }
    },

    'ten-thousand': {
      watch: 'writing ten thousand as 1000 or 100 000. It is 10 thousands, so it has 5 digits.',
      goal: 'I can describe how big 10\u00a0000 is.',
      learn: {
        show: { cap: '10 thousands make ten thousand', eq: ['10 × 1000 = 10\u00a0000'] },
        together: [{ eq: ['100 × 100 = []'], a: [S.fmt(10000)] }, { eq: ['9999 + 1 = []'], a: [S.fmt(10000)] }],
        cue: '10\u00a0000 = 10 thousands = 100 hundreds.',
        own: [{ eq: ['10\u00a0000 − 1 = []'], a: [9999] }, { eq: ['10\u00a0000 − 1000 = []'], a: [9000] }, { eq: ['5000 + [] = 10\u00a0000'], a: [5000] }, { eq: ['1000 × [] = 10\u00a0000'], a: [10] }]
      },
      p1: {
        show: { cap: 'Count by 1000s', eq: ['8000, 9000, 10\u00a0000'] },
        items: [{ eq: ['9000 + 1000 = []'], a: [S.fmt(10000)] }, { eq: ['10\u00a0000 − 5000 = []'], a: [5000] }, { eq: ['[] + 2000 = 10\u00a0000'], a: [8000] },
          { eq: ['10 × [] = 10\u00a0000'], a: [1000] }, { eq: ['9900 + 100 = []'], a: [S.fmt(10000)] }, { eq: ['10\u00a0000 − 100 = []'], a: [9900] }]
      },
      p2: {
        items: [{ eq: ['[] × 100 = 10\u00a0000'], a: [100] }, { eq: ['10\u00a0000 − 10 = []'], a: [9990] },
          story('{a} has 9 {conts} of 1000 {many}. How many {many}?', '{many}', 9000, '9 × 1000'),
          story('A stadium holds 10\u00a0000 people. 7500 are inside. How many more can come in?', 'people', 2500, '10\u00a0000 − 7500'),
          { eq: ['2500 + 2500 + 2500 + [] = 10\u00a0000'], a: [2500], wide: true }, TF('10\u00a0000 = 100 × 100', true)]
      },
      p3: {
        items: [{ eq: ['[] × 10 = 10\u00a0000'], a: [1000] }, { eq: ['10\u00a0000 − 4321 = []'], a: [5679] },
          story('A town has 6250 people. How many more to reach 10\u00a0000?', 'people', 3750, '10\u00a0000 − 6250'),
          story('{b} counts 2000 {many} a day. How many days to count 10\u00a0000?', 'days', 5, '10\u00a0000 ÷ 2000'),
          TF('10\u00a0000 = 1000 × 10', true), TF('10\u00a0000 = 100 × 1000', false)]
      },
      think: {
        items: [{ q: 'Name something there could be about 10\u00a0000 of.', lines: { n: 2, key: 'For example: people at a hockey arena, steps in a long walk, leaves on a tree.' } },
          { q: '{b} writes ten thousand as 1000. What went wrong?', lines: { n: 3, key: '1000 is one thousand. Ten thousand is 10 of those: 10\u00a0000, with 5 digits.' } },
          { q: 'How many 500s make 10\u00a0000?', eq: ['[] × 500 = 10\u00a0000'], a: [20] },
          { q: 'Explain why 10\u00a0000 needs a new place.', lines: { n: 3, key: '10 thousands trade for 1 ten thousand, so a fifth place is needed.' } }]
      }
    }
  } });
})();
