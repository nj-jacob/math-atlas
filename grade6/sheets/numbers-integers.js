/* Grade 6 Big Numbers, Integers and Factors: printable worksheets (assets/engine/sheets.js). One set per idea of the
   lessons in chapters/numbers-integers.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made
   at random, so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts}.
   Ontario 2020: B1.1 whole numbers to one million; B1.2 integers on number lines; B1.3 comparing and ordering
   integers; B2.2 divisibility rules for 2, 3, 4, 5, 6, 8, 9 and 10; B2.6 prime factors and factor trees.
   The answer checks are in tests/verify/sheets.js: a digit's value comes from its place (dv), words are read back
   into a number (words), opposites add to 0, an order uses exactly the numbers given (set), divisibility is worked
   out by dividing (mult), primes by their factors (prime, factors), and a factor tree must multiply back with every
   end prime (ftree, pf). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var M = '−';
  /* a number written with a true minus sign */
  function I(n) { return n < 0 ? M + -n : String(n); }
  /* the value of digit d in n */
  function DV(n, d) { var s = String(n), at = s.indexOf(String(d)); return { q: 'In ' + S.fmt(n) + ', the ' + d + ' is worth', eq: ['[]'], a: [d * Math.pow(10, s.length - 1 - at)], dv: { n: n, d: d } }; }
  /* a number in words, to write in numerals */
  function NW(w, n) { return { q: w.charAt(0).toUpperCase() + w.slice(1), eq: ['[]'], a: [n], words: w }; }
  /* a number to write in words (the key's words are worked out again) */
  function WN(n, w) { return { q: 'Write ' + S.fmt(n) + ' in words.', lines: { n: 1, key: w }, spell: n, wide: true }; }
  /* a point on an integer number line */
  function PT(pt, min, max) { return { pic: ['nl', { min: min, max: max, tick: 1, lab: 2 * Math.ceil((max - min) / 20), pt: pt, ptl: '?' }], eq: ['[]'], a: [pt] }; }
  /* the opposite of n: n and its opposite add to 0 */
  function OP(n) { return { eq: [I(n) + ' + [] = 0'], a: [-n] }; }
  /* compare two integers with <, > or = */
  function CM(x, y) { return { eq: [I(x) + '   ?   ' + I(y)], pick: { opts: ['<', '>', '='], ans: x < y ? 0 : x > y ? 1 : 2, cmp: [I(x), I(y)] }, pickLast: true }; }
  /* put integers in order, least first */
  function OR(list) {
    var s = list.slice().sort(function (p, q) { return p - q; });
    return { q: 'Least to greatest: ' + list.map(I).join(', '), eq: [s.map(function () { return '[]'; }).join(' < ')], a: s, set: list, wide: true };
  }
  /* yes or no: is n divisible by d? */
  function DY(n, d) { return { q: 'Is ' + S.fmt(n) + ' divisible by ' + d + '?', pick: { opts: ['yes', 'no'], ans: n % d === 0 ? 0 : 1 }, mult: { n: n, of: d } }; }
  /* the one choice divisible by d */
  function DC(list, d) {
    var at = list.filter(function (v) { return v % d === 0; });
    return { q: 'Which is divisible by ' + d + '?', pick: { opts: list.map(String), ans: list.indexOf(at[0]) }, mult: { of: d } };
  }
  /* add the digits */
  function DS(n) { var d = String(n).split(''); return { q: 'Add the digits of ' + S.fmt(n) + '.', eq: [d.join(' + ') + ' = []'], a: [d.reduce(function (t, x) { return t + +x; }, 0)] }; }
  /* every factor of n */
  function FA(n) {
    var f = []; for (var k = 1; k <= n; k++) if (n % k === 0) f.push(k);
    return { q: 'All the factors of ' + n + ':', eq: [f.map(function () { return '[]'; }).join('  ')], a: f, factors: n, wide: f.length > 4 };
  }
  /* the next multiples of n */
  function MU(n, k) { var t = [n]; for (var i = 1; i < k; i++) t.push('[]'); var a = []; for (var j = 2; j <= k; j++) a.push(n * j); return { q: 'Multiples of ' + n + ':', eq: [t.join(', ')], a: a, by: n, wide: true }; }
  /* prime or composite */
  function PR(n) { var p = n > 1 && [2, 3, 5, 7, 11, 13].every(function (f) { return f === n || n % f; }); return { q: String(n), pick: { opts: ['prime', 'composite'], ans: p ? 0 : 1, prime: n } }; }
  /* a factor tree to fill in */
  function FT(n, primes) {
    var a = [], rest = n;
    for (var i = 0; i < primes.length - 1; i++) { rest /= primes[i]; a.push(primes[i], rest); }
    return { pic: ['ftree', { n: n, primes: primes, blank: true }], a: a };
  }
  /* the prime factorization of n as a times sum */
  function PF(n, primes) { return { eq: [n + ' = ' + primes.map(function () { return '[]'; }).join(' × ')], a: primes, pf: true, wide: true }; }

  S.register('numbers-integers', { code: 'NI', ideas: {

    places: {
      watch: 'writing a 4-digit number with a space. Only numbers of 5 or more digits get a space: 5832, but 58 320.',
      goal: 'I can find the value of any digit up to the millions.',
      learn: {
        show: { cap: 'millions · hundred thousands · ten thousands · thousands · …', eq: ['In 2 470 315, the 7 is', '7 ten thousands = 70 000'] },
        together: [DV(2470315, 4), DV(805162, 5)],
        cue: 'Find the place, then the value. Each place is 10 times the one on its right.',
        own: [DV(361904, 3), DV(1750000, 7), DV(46218, 6), { eq: ['10 × 50 000 = []'], a: [500000] }]
      },
      p1: {
        show: { eq: ['10 × 4000 = 40 000', '10 × 40 000 = 400 000'] },
        items: [DV(53210, 3), DV(674000, 6), DV(108925, 8), { eq: ['10 × 9000 = []'], a: [90000] }, { eq: ['10 × 60 000 = []'], a: [600000] }, DV(1000000, 1)]
      },
      p2: {
        items: [{ eq: ['400 000 + 30 000 + 2000 + 50 + 1 = []'], a: [432051], wide: true }, { eq: ['700 000 + 8000 + 300 + 9 = []'], a: [708309], wide: true },
          DV(925037, 2), DV(310468, 1), { eq: ['100 × 3000 = []'], a: [300000] }, { eq: ['[] × 10 000 = 800 000'], a: [80] }]
      },
      p3: {
        items: [{ eq: ['526 104 = 500 000 + [] + 6000 + 100 + 4'], a: [20000], wide: true }, { eq: ['1 000 000 = [] × 100 000'], a: [10], wide: true },
          { eq: ['999 999 + 1 = []'], a: [1000000] }, DV(4087123, 8),
          { eq: ['300 000 ÷ 30 000 = []'], a: [10] }]
      },
      think: {
        items: [{ q: '{b} says the 6 in 6420 is worth 6. Is {b} right?', lines: { n: 2, key: 'No. The 6 is in the thousands place, so it is worth 6000.' } },
          { q: 'Where do you see numbers this big in real life?', lines: { n: 2, key: 'For example: the population of a city, the cost of a house, km to the Moon.' } },
          DV(7500000, 5),
          { q: 'Make the greatest number with 6 digits 4, 0, 9, 1, 7, 2.', eq: ['[]'], a: [974210], digits: [4, 0, 9, 1, 7, 2], most: true }]
      }
    },

    periods: {
      watch: 'saying "and" or "ones" (four hundred fifty thousand and three hundred two ones). Neither is said.',
      goal: 'I can read and write big numbers in periods.',
      learn: {
        show: { cap: 'thousands period | ones period', eq: ['four hundred fifty thousand', 'three hundred two', '450 302'] },
        together: [NW('six hundred thousand four hundred', 600400), WN(73015, 'seventy-three thousand fifteen')],
        cue: 'Read one period at a time from the left. Say the period name after it.',
        own: [NW('two hundred eight thousand ninety', 208090), NW('one million three hundred thousand', 1300000), WN(450302, 'four hundred fifty thousand three hundred two')]
      },
      p1: {
        show: { eq: ['3 000 040', 'three million forty'] },
        items: [NW('fifty-two thousand six hundred', 52600), NW('nine hundred thousand nine', 900009), WN(18240, 'eighteen thousand two hundred forty'), WN(605000, 'six hundred five thousand'),
          NW('two million', 2000000)]
      },
      p2: {
        items: [NW('three hundred twelve thousand forty-five', 312045), NW('one million fifty thousand', 1050000), WN(700070, 'seven hundred thousand seventy'),
          { q: 'Which is 40 006?', pick: { opts: ['40 600', '40 006', '4006'], ans: 1, nw: 'forty thousand six' }, wide: true },
          { q: 'Which is 260 000 in words?', pick: { opts: ['two hundred sixty thousand', 'twenty-six thousand'], ans: 0, wn: 260000 }, wide: true }]
      },
      p3: {
        items: [NW('one million one thousand one', 1001001), WN(2405010, 'two million four hundred five thousand ten'), WN(99099, 'ninety-nine thousand ninety-nine'),
          { q: 'The population of a town is eighty-four thousand three hundred. Write it with digits.', eq: ['[]'], a: [84300], words: 'eighty-four thousand three hundred', wide: true }]
      },
      think: {
        items: [{ q: '{b} wrote "four hundred thousand and twenty" for 400 020. Fix it.', lines: { n: 2, key: 'Four hundred thousand twenty. "And" is kept for decimals.' } },
          { q: 'Why do we leave a space every three digits?', lines: { n: 2, key: 'Each group of three is a period. The spaces make the periods easy to read.' } },
          NW('seven hundred seven thousand seven', 707007),
          { q: 'Write a number between 500 000 and 600 000 in digits and in words.', lines: { n: 2, key: 'For example 520 300: five hundred twenty thousand three hundred.' } }]
      }
    },

    below: {
      watch: 'reading −5 as "minus five" or putting it to the right of 0. Below zero is negative and sits left of 0.',
      goal: 'I can read and place integers on a number line.',
      learn: {
        show: { pic: ['nl', { min: -6, max: 6, tick: 1, lab: 2, pt: -4 }], cap: '4 below zero', eq: ['−4, negative four'] },
        together: [PT(-3, -6, 6), { q: 'A diver is 12 m below the surface.', eq: ['[] m'], a: [-12], calc: '−12' }],
        cue: 'Below zero is negative. Above zero is positive. Zero is neither.',
        own: [PT(5, -6, 6), { q: 'It is 8 degrees below zero.', eq: ['[] °C'], a: [-8], calc: '−8' }]
      },
      p1: {
        show: { pic: ['nl', { min: -6, max: 6, tick: 1, lab: 2, pt: 2 }], eq: ['2 above zero: 2'] },
        items: [PT(-2, -6, 6), PT(4, -6, 6), PT(-5, -6, 6),
          { q: 'A plane is 900 m above sea level.', eq: ['[] m'], a: [900], calc: '900' },
          { q: 'A team is 3 goals behind.', eq: ['[] goals'], a: [-3], calc: '−3' }]
      },
      p2: {
        items: [PT(-8, -10, 10), PT(6, -10, 10), PT(-10, -10, 10),
          { q: 'Iqaluit is 25 degrees below zero.', eq: ['[] °C'], a: [-25], calc: '−25' },
          { q: 'A parking level is 2 floors below the street.', eq: ['[] floors'], a: [-2], calc: '−2' },
          { q: '{a} owes {b} $15.', eq: ['[] dollars'], a: [-15], calc: '−15' }]
      },
      p3: {
        items: [PT(-7, -10, 10), PT(9, -10, 10),
          { q: 'Death Valley is 86 m below sea level.', eq: ['[] m'], a: [-86], calc: '−86' },
          { q: 'A freezer is set to 18 degrees below zero.', eq: ['[] °C'], a: [-18], calc: '−18' },
          CM(0, -18)]
      },
      think: {
        items: [{ q: 'Give two places in real life where you see negative numbers.', lines: { n: 2, key: 'For example: temperatures below zero, floors under the ground, money owed, depths below sea level.' } },
          { q: '{b} says −6 and 6 are the same place on a number line. Is {b} right?', lines: { n: 2, key: 'No. 6 is 6 steps right of 0 and −6 is 6 steps left of 0.' } },
          PT(-9, -10, 10),
          { q: 'Draw a vertical number line from −5 to 5 and mark −3.', draw: { h: 90, key: 'A line up and down: 5 at the top, 0 in the middle, −5 at the bottom, −3 marked 3 below 0.' } }]
      }
    },

    opposites: {
      watch: 'thinking 0 has no opposite. Zero is its own opposite. Opposites always add to 0.',
      goal: 'I can find the opposite of an integer.',
      learn: {
        show: { pic: ['nl', { min: -6, max: 6, tick: 1, lab: 2, jumps: [[0, 4, '+4'], [0, -4, '−4']] }], eq: ['4 and −4 are opposites'] },
        together: [OP(7), OP(-3)],
        cue: 'Same distance from zero, on the other side.',
        own: [OP(12), OP(-9), OP(0), OP(-25)]
      },
      p1: {
        show: { eq: ['opposite of −6: 6', '−6 + 6 = 0'] },
        items: [OP(2), OP(-2), OP(15), OP(-40), OP(100), OP(-1)]
      },
      p2: {
        items: [OP(-63), OP(80), OP(-450), OP(1000),
          { q: 'How far from zero is −14?', eq: ['[] steps'], a: [14], calc: '14' },
          { q: 'A lift goes down 12 floors. What is the opposite move?', eq: ['[] floors'], a: [12], calc: '12' }]
      },
      p3: {
        items: [OP(-375), OP(2500),
          { q: 'A point is 9 to the right of 0. Where is its opposite?', eq: ['[]'], a: [-9], calc: '−9' },
          { q: 'The opposite of the opposite of −7 is', eq: ['[]'], a: [-7], calc: '−7' },
          { q: 'A balloon goes up 30 m. What is the opposite move?', eq: ['[] m'], a: [-30], calc: '−30' }]
      },
      think: {
        items: [{ q: 'Why is 0 its own opposite?', lines: { n: 2, key: '0 is 0 steps from zero, so going the other way still lands on 0.' } },
          { q: 'Give a real-life pair of opposites.', lines: { n: 2, key: 'For example: 5 floors up and 5 floors down; earning $10 and spending $10.' } },
          OP(-48),
          { q: '{b} says the opposite of −5 is −5. What went wrong?', lines: { n: 2, key: 'The opposite is on the other side of zero: 5, not −5.' } }]
      }
    },

    compare: {
      watch: 'thinking −8 is greater than −3 because 8 is greater than 3. Ask "which is colder?" −8 is further left, so it is less.',
      goal: 'I can compare and order integers.',
      learn: {
        show: { pic: ['nl', { min: -8, max: 4, tick: 1, lab: 2, jumps: [[-8, -3, '']] }], eq: ['−8 < −3'] },
        together: [CM(-8, -3), CM(-1, -6)],
        cue: 'Further right is greater. Every positive number is greater than every negative.',
        own: [CM(4, -9), CM(-12, -2), OR([3, -5, 0, -1])]
      },
      p1: {
        show: { eq: ['−2 °C is warmer than −7 °C', '−2 > −7'] },
        items: [CM(-5, -4), CM(0, -3), CM(-10, 1), CM(-7, -7), OR([-2, 4, -6, 1])]
      },
      p2: {
        items: [CM(-15, -51), CM(-100, -99), CM(-3, 2), OR([-12, 5, -8, 0, 3]),
          { q: 'Which is colder: −15 °C or −11 °C?', pick: { opts: ['−15 °C', '−11 °C'], ans: 0, small: true }, wide: true }]
      },
      p3: {
        items: [OR([-25, -52, 25, -2, 0]),
          { q: 'Which is the least?', pick: { opts: ['−40', '−4', '−44', '−14'], ans: 2, small: true }, wide: true },
          { q: 'Which is the greatest?', pick: { opts: ['−9', '−19', '−1', '−91'], ans: 2, big: true }, wide: true },
          { q: 'At noon it was −6 °C. At night it was 5 degrees colder.', eq: ['[] °C'], a: [-11], calc: '−6 − 5', wide: true }]
      },
      think: {
        items: [{ q: '{b} says −20 > −2 because 20 > 2. Is {b} right?', lines: { n: 2, key: 'No. −20 is further left of zero, so −20 < −2.' } },
          { q: 'Which integer is between −5 and −3?', pick: { opts: ['−6', '−4', '−2'], ans: 1, between: [-5, -3] } },
          OR([-7, 7, -17, 0]),
          { q: 'Owing $2 or owing $7: which is better? Use < or >.', lines: { n: 2, key: 'Owing $2 is better: −2 > −7.' } }]
      }
    },

    d2510: {
      watch: 'checking the first digit. For 2, 5 and 10, only the last digit matters.',
      goal: 'I can tell if a number is divisible by 2, 5 or 10.',
      learn: {
        show: { cap: 'look at the last digit', eq: ['4370 ends in 0', 'divisible by 2, 5 and 10'] },
        together: [DY(4370, 5), DY(6125, 2)],
        cue: '2: the last digit is even. 5: it ends in 0 or 5. 10: it ends in 0.',
        own: [DY(9008, 2), DY(1235, 10), DY(7745, 5), DY(250000, 10)]
      },
      p1: {
        show: { eq: ['3418 ends in 8, which is even', 'divisible by 2'] },
        items: [DY(516, 2), DY(905, 5), DY(3332, 10), DY(87, 2), DY(60, 10), DY(4444, 5)]
      },
      p2: {
        items: [DY(13579, 2), DY(24680, 10), DY(7005, 5), DY(98765, 10), DC([355, 422, 509], 2), DC([1234, 4320, 3401], 10)]
      },
      p3: {
        items: [DC([2035, 4502, 5207], 5), DC([7771, 6064, 3333], 2),
          { q: 'Can 245 {many} be shared into bags of 5 with none left?', pick: { opts: ['yes', 'no'], ans: 0 }, mult: { n: 245, of: 5 }, wide: true },
          { q: 'Can 138 people make teams of 10 with none left?', pick: { opts: ['yes', 'no'], ans: 1 }, mult: { n: 138, of: 10 }, wide: true },
          DY(1000005, 2)]
      },
      think: {
        items: [{ q: 'Why does a number that ends in 0 divide by 2, 5 and 10?', lines: { n: 3, key: 'It is a number of tens, and every 10 is 2 × 5. So it splits into 2s, 5s and 10s.' } },
          { q: 'Write a 4-digit number divisible by 5 but not by 10.', lines: { n: 1, key: 'Any 4-digit number ending in 5, such as 2345.' } },
          DY(56786, 5),
          { q: '{b} says 731 is even because 7 is odd and 3 is odd. What went wrong?', lines: { n: 2, key: 'Only the last digit matters. 731 ends in 1, which is odd, so it is odd.' } }]
      }
    },

    d39: {
      watch: 'using the digit sum for 4 or 8. Adding the digits only works for 3 and 9.',
      goal: 'I can tell if a number is divisible by 3 or 9.',
      learn: {
        show: { eq: ['7452: 7 + 4 + 5 + 2 = 18', '18 is a multiple of 9'] },
        together: [DS(471), DY(471, 3)],
        cue: 'Add the digits. If the total divides by 3 (or 9), so does the number.',
        own: [DS(5823), DY(5823, 9), DY(1234, 3)]
      },
      p1: {
        show: { eq: ['615: 6 + 1 + 5 = 12', '12 divides by 3, not 9'] },
        items: [DS(312), DY(312, 3), DS(8100), DY(8100, 9), DY(707, 3), DY(999, 9)]
      },
      p2: {
        items: [DY(4116, 3), DY(4116, 9), DY(23571, 3), DY(81981, 9), DC([1001, 2223, 4343], 9), DC([514, 726, 862], 3)]
      },
      p3: {
        items: [DS(98784), DY(98784, 9), DY(55555, 3),
          { q: 'Can 2412 students be put in 9 equal groups?', pick: { opts: ['yes', 'no'], ans: 0 }, mult: { n: 2412, of: 9 }, wide: true },
          { q: 'Can 3 friends share $1003 evenly in dollars?', pick: { opts: ['yes', 'no'], ans: 1 }, mult: { n: 1003, of: 3 }, wide: true }]
      },
      think: {
        items: [{ q: 'If a number divides by 9, must it divide by 3? Why?', lines: { n: 3, key: 'Yes. 9 is 3 × 3, so every group of 9 is 3 groups of 3.' } },
          { q: 'Which digit makes 4 ? 2 divide by 9?', eq: ['[]'], a: [3], calc: '9 − 4 − 2' },
          { q: '{b} says 124 divides by 4 because 1 + 2 + 4 = 7. Is that the right test?', lines: { n: 2, key: 'No. The digit sum only works for 3 and 9. For 4, check the last two digits: 24 ÷ 4 = 6, so yes.' } },
          DY(123456, 3)]
      }
    },

    d468: {
      watch: 'checking only the last digit for 4 or 8. For 4 use the last two digits; for 8, the last three.',
      goal: 'I can tell if a number is divisible by 4, 6 or 8.',
      learn: {
        show: { eq: ['5316: last two digits 16', '16 ÷ 4 = 4, so yes'] },
        together: [DY(5316, 4), DY(2178, 6)],
        cue: '4: check the last two digits. 8: the last three. 6: it must pass 2 and 3.',
        own: [DY(7124, 8), DY(918, 6), DY(3330, 4)]
      },
      p1: {
        show: { eq: ['414 is even and 4 + 1 + 4 = 9', 'divisible by 2 and 3, so by 6'] },
        items: [DY(328, 4), DY(1046, 4), DY(726, 6), DY(4002, 6), DY(1240, 8), DY(5300, 8)]
      },
      p2: {
        items: [DY(21036, 4), DY(9126, 6), DY(31120, 8), DY(7514, 6), DC([3110, 5112, 6114], 8), DC([2222, 3300, 4510], 4)]
      },
      p3: {
        items: [DY(123456, 8), DY(100100, 4), DY(888888, 6),
          { q: 'Can 2016 chairs be set in rows of 8?', pick: { opts: ['yes', 'no'], ans: 0 }, mult: { n: 2016, of: 8 }, wide: true },
          { q: 'Can 1314 eggs fill cartons of 6 exactly?', pick: { opts: ['yes', 'no'], ans: 0 }, mult: { n: 1314, of: 6 }, wide: true }]
      },
      think: {
        items: [{ q: 'Why do we only check the last two digits for 4?', lines: { n: 3, key: 'Every 100 divides by 4 (100 = 25 × 4), so only the tens and ones are left to check.' } },
          { q: '{b} says 1326 is divisible by 6 because it is even. What is missing?', lines: { n: 2, key: 'It must also pass the rule for 3: 1 + 3 + 2 + 6 = 12, so yes, it passes both.' } },
          DY(7200, 8),
          { q: 'Write a number divisible by 4 but not by 8.', lines: { n: 1, key: 'For example 12, 20, 300 or 1004.' } }]
      }
    },

    pairs: {
      watch: 'mixing up factors and multiples. Ask: does it go into 12 (a factor) or does 12 go into it (a multiple)?',
      goal: 'I can find factors and multiples.',
      learn: {
        show: { eq: ['12 = 1 × 12 = 2 × 6 = 3 × 4', 'factors of 12: 1, 2, 3, 4, 6, 12'] },
        together: [FA(8), MU(6, 5)],
        cue: 'Factors are few and go into the number. Multiples never end.',
        own: [FA(15), MU(9, 5)]
      },
      p1: {
        show: { eq: ['18 = 1 × 18 = 2 × 9 = 3 × 6'] },
        items: [FA(10), FA(14), MU(7, 5), MU(12, 4), { eq: ['[] × [] = 21'], a: [3, 7] }, { eq: ['[] × [] = 35'], a: [5, 7] }]
      },
      p2: {
        items: [FA(24), FA(30), MU(15, 5), MU(25, 5), { eq: ['[] × [] = 36'], a: [4, 9] }, { eq: ['[] × [] = 45'], a: [5, 9] }]
      },
      p3: {
        items: [FA(36), FA(48),
          { q: 'Is 7 a factor of 42?', pick: { opts: ['yes', 'no'], ans: 0 }, mult: { n: 42, of: 7 } },
          { q: 'Which is a multiple of 8?', pick: { opts: ['4', '18', '64', '81'], ans: 2 }, mult: { of: 8 } },
          { q: 'Buns come in packs of 6, wieners in packs of 8. Least number to have the same of each?', eq: ['[]'], a: [24], lcm: [6, 8], wide: true }]
      },
      think: {
        items: [{ q: 'Is 1 a factor of every number? Why?', lines: { n: 2, key: 'Yes. Any number is 1 × itself.' } },
          { q: 'Why do multiples of a number never end?', lines: { n: 2, key: 'You can always multiply by the next counting number to get a bigger multiple.' } },
          FA(40),
          { q: 'Draw every rectangle you can make with 16 squares.', draw: { h: 90, key: '1 by 16, 2 by 8 and 4 by 4.' } }]
      }
    },

    primes: {
      watch: 'calling every odd number prime (9, 15, 21, 51 are not) or calling 1 prime. 2 is the only even prime.',
      goal: 'I can tell if a number is prime or composite.',
      learn: {
        show: { pic: ['array', { r: 1, c: 7 }], cap: '7 makes only one rectangle', eq: ['7 = 1 × 7: prime'] },
        together: [PR(9), PR(13)],
        cue: 'Exactly two factors (1 and itself) means prime. More means composite.',
        own: [PR(21), PR(2), PR(29), PR(51)]
      },
      p1: {
        show: { pic: ['array', { r: 2, c: 3 }], cap: '6 makes more than one rectangle', eq: ['6 = 1 × 6 = 2 × 3: composite'] },
        items: [PR(11), PR(15), PR(17), PR(27), PR(31), PR(49)]
      },
      p2: {
        items: [PR(37), PR(39), PR(41), PR(57), PR(61), PR(91), FA(23)]
      },
      p3: {
        items: [PR(71), PR(87), PR(97), PR(119),
          { q: 'Which is prime?', pick: { opts: ['33', '43', '63', '93'], ans: 1, onePrime: true }, wide: true },
          { q: 'Which even number is prime?', pick: { opts: ['2', '4', '6', '8'], ans: 0, onePrime: true } }]
      },
      think: {
        items: [{ q: 'Why is 1 not prime?', lines: { n: 2, key: '1 has only one factor, itself. A prime needs exactly two factors.' } },
          { q: '{b} says 57 is prime because it is odd. Is {b} right?', lines: { n: 2, key: 'No. 5 + 7 = 12, so 57 divides by 3: 57 = 3 × 19.' } },
          { q: 'Why is every even number bigger than 2 composite?', lines: { n: 2, key: 'It divides by 2, so it has 1, 2 and itself as factors: more than two.' } },
          { q: 'List the primes between 20 and 40.', eq: ['[] [] [] []'], a: [23, 29, 31, 37], pf: true }]
      }
    },

    trees: {
      watch: 'stopping at a composite number, such as a 4 or a 9 on a branch. Every branch must end in a prime.',
      goal: 'I can write a number as a product of primes with a factor tree.',
      learn: {
        show: { pic: ['ftree', { n: 12, primes: [2, 2, 3] }], eq: ['12 = 2 × 2 × 3'] },
        together: [FT(24, [2, 2, 2, 3]), FT(30, [2, 3, 5])],
        cue: 'Split off a prime each time. Stop when every branch ends in a prime.',
        own: [FT(18, [2, 3, 3]), FT(45, [3, 3, 5]), PF(28, [2, 2, 7])]
      },
      p1: {
        show: { eq: ['20 = 2 × 10 = 2 × 2 × 5'] },
        items: [FT(20, [2, 2, 5]), FT(27, [3, 3, 3]), PF(12, [2, 2, 3]), PF(14, [2, 7]), PF(45, [3, 3, 5])]
      },
      p2: {
        items: [FT(60, [2, 2, 3, 5]), FT(84, [2, 2, 3, 7]), PF(50, [2, 5, 5]), PF(42, [2, 3, 7]), PF(40, [2, 2, 2, 5])]
      },
      p3: {
        items: [FT(120, [2, 2, 2, 3, 5]), FT(98, [2, 7, 7]), PF(135, [3, 3, 3, 5]), PF(66, [2, 3, 11]),
          { q: 'Which number is 2 × 3 × 3 × 7?', eq: ['[]'], a: [126], calc: '2 × 3 × 3 × 7' }]
      },
      think: {
        items: [{ q: '{a} starts 36 with 4 × 9. {b} starts with 6 × 6. Do they end with the same primes?', lines: { n: 3, key: 'Yes. 4 × 9 = 2 × 2 × 3 × 3 and 6 × 6 = 2 × 3 × 2 × 3: the same primes.' } },
          { q: '{b} wrote 40 = 4 × 2 × 5. What is wrong?', lines: { n: 2, key: '4 is not prime. Split it: 40 = 2 × 2 × 2 × 5.' } },
          FT(72, [2, 2, 2, 3, 3]),
          { q: 'Why does a prime number have no factor tree?', lines: { n: 2, key: 'It cannot be split into two smaller factors. It is already a prime.' } }]
      }
    }
  } });
})();
