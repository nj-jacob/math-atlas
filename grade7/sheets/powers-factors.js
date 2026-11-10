/* Grade 7 Powers, Roots and Factors: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/powers-factors.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.1 whole numbers to one billion, in expanded form with powers of ten; B1.2 perfect squares and square
   roots; B2.6 the GCF of numbers to 144 and the LCM of two or three numbers; B2.7 powers (exponential notation).
   The answer checks are in tests/verify/sheets.js: sums with powers (2^5) and roots (√49) are worked out, a GCF or LCM
   is found again, factors are listed in full, and a product of primes uses only primes. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var F = S.fmt;
  function rep(n, k) { var a = []; for (var i = 0; i < n; i++) a.push(k); return a; }
  /* what a digit is worth in a big number */
  function DV(n, d) {
    var s = String(n), at = s.indexOf(String(d));
    return { q: 'What is the ' + d + ' in ' + F(n) + ' worth?', eq: ['[]'], a: [d * Math.pow(10, s.length - 1 - at)], dv: { n: F(n), d: d } };
  }
  /* a news number (36.2 million) in standard form, and back */
  function NEWS(x, w) { var m = w === 'billion' ? 1e9 : 1e6; return { eq: [x + ' ' + w + ' = []'], a: [Math.round(x * m)] }; }
  function BACK(n, w) { var m = w === 'billion' ? 1e9 : 1e6; return { eq: [F(n) + ' = [] ' + w], a: [n / m], wide: n >= 1e9 }; }
  /* compare two numbers or powers: circle the sign */
  function CMP(x, y) {
    var vx = ev(x), vy = ev(y);
    return { wide: String(F(x) + F(y)).length > 14, eq: [F(x) + ' ? ' + F(y)], pick: { opts: ['<', '>', '='], ans: vx < vy ? 0 : vx > vy ? 1 : 2, cmp: [String(F(x)), String(F(y))] }, pickLast: true };
  }
  /* the value of a number or a short sum with powers, such as '2^5' or '3 × 3' */
  function ev(s) { return Function('return ' + String(s).replace(/\^/g, '**').replace(/×/g, '*').replace(/\s/g, ''))(); }
  /* 12, 18 and 30 */
  function and(list) { return list.length > 2 ? list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1] : list.join(' and '); }
  /* put numbers in order, least to greatest */
  function ORD(list) {
    return { q: 'Least to greatest: ' + list.map(F).join(', '), eq: [list.map(function () { return '[]'; }).join(' < ')], a: list.slice().sort(function (x, y) { return x - y; }), set: list.map(F), wide: true };
  }
  /* a power's value; repeated multiplication as a power; a power written out */
  function PW(b, e) { return { eq: [b + '^' + e + ' = []'], a: [Math.pow(b, e)] }; }
  function EXP(b, n) { return { eq: [rep(n, b).join(' × ') + ' = ' + b + '^[]'], a: [n], wide: String(b).length * n > 8 }; }
  function OUT(b, e) { return { eq: [b + '^' + e + ' = ' + rep(e, '[]').join(' × ') + ' = []'], a: rep(e, b).concat([Math.pow(b, e)]), wide: e > 2 }; }
  /* powers of ten */
  function TEN(e) { return { eq: ['10^' + e + ' = []'], a: [Math.pow(10, e)] }; }
  function TENB(e) { return { eq: [F(Math.pow(10, e)) + ' = 10^[]'], a: [e] }; }
  /* expanded form with powers of ten: to standard form, or the digits of each power */
  function XS(terms) {
    return { eq: [terms.map(function (t) { return t[0] + ' × 10^' + t[1]; }).join(' + ') + ' = []'], a: [terms.reduce(function (s, t) { return s + t[0] * Math.pow(10, t[1]); }, 0)], wide: true };
  }
  function XD(terms) {
    var n = terms.reduce(function (s, t) { return s + t[0] * Math.pow(10, t[1]); }, 0);
    return { eq: [F(n) + ' = ' + terms.map(function (t) { return '[] × 10^' + t[1]; }).join(' + ')], a: terms.map(function (t) { return t[0]; }), wide: true };
  }
  /* squares and roots */
  function SQ(n) { return { eq: [n + '^2 = []'], a: [n * n] }; }
  function RT(n) { return { eq: ['√' + n * n + ' = []'], a: [n] }; }
  function TILE(n) { return { pic: ['array', { r: n, c: n }], eq: [n + ' × ' + n + ' = []', '√[] = ' + n], a: [n * n, n * n] }; }
  function BET(n) { var lo = Math.floor(Math.sqrt(n)); return { eq: ['[] < √' + n + ' < []'], a: [lo, lo + 1] }; }
  /* factors: a missing partner, every factor, the GCF, a product of primes, the LCM */
  function PAIR(n, a) { return { eq: [n + ' = ' + a + ' × []'], a: [n / a] }; }
  function ALL(n) {
    var f = []; for (var k = 1; k <= n; k++) if (n % k === 0) f.push(k);
    var rows = []; for (var i = 0; i < f.length; i += 8) rows.push(f.slice(i, i + 8).map(function () { return '[]'; }).join(', '));
    return { q: 'Every factor of ' + n + ', smallest first:', eq: rows, a: f, factors: n, wide: f.length > 4 };
  }
  function gcd(x, y) { return y ? gcd(y, x % y) : x; }
  function GCF(list) { return { eq: ['GCF of ' + and(list) + ' = []'], a: [list.reduce(gcd)], gcf: list }; }
  function LCM(list) { return { eq: ['LCM of ' + and(list) + ' = []'], a: [list.reduce(function (x, y) { return x * y / gcd(x, y); })], lcm: list }; }
  function PR(n, known) {
    /* the prime factors of n, smallest first; the first `known` are written in, the rest are blanks */
    var f = [], m = n; for (var p = 2; m > 1; p++) while (m % p === 0) { f.push(p); m /= p; }
    return { q: 'Finish the product of primes.', eq: [n + ' = ' + f.map(function (v, i) { return i < known ? v : '[]'; }).join(' × ')], a: f.slice(known), primes: true, wide: f.length >= 4 };
  }
  /* a story: one answer box; calc is the sum the answer check works out */
  function story(q, unit, ans, calc, more) { var it = { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; return more ? Object.assign(it, more) : it; }
  function TF(st, yes) { return { q: 'True or false? ' + st, pick: { opts: ['true', 'false'], ans: yes ? 0 : 1 }, tf: st }; }

  S.register('powers-factors', { code: 'PF', ideas: {

    periods: {
      watch: 'losing a zero inside a period. Every period except the first has exactly 3 digits: 3 040 000 000.',
      goal: 'I can read and write numbers up to one billion.',
      learn: {
        show: { cap: 'billions | millions | thousands | ones', eq: ['3 | 405 | 020 | 600', '3 405 020 600'] },
        together: [DV(3405020600, 4), DV(3405020600, 3)],
        cue: 'Read each period of 3 digits, then say its name.',
        own: [DV(57120000, 7), DV(800930000, 9), CMP(4050000, 4500000)]
      },
      p1: {
        show: { eq: ['26 | 300 | 015', '26 300 015'] },
        items: [DV(26300015, 6), DV(705000000, 7), DV(43210000, 2), DV(8040000, 4), CMP(9800000, 10200000), CMP(450000000, 405000000)]
      },
      p2: {
        items: [ORD([6500000, 650000, 6050000]), DV(612000000, 6), DV(90700000, 7), CMP(1000000000, 999999999), CMP(30303030, 33000000),
          { q: 'Write in standard form.', eq: ['400 million + 20 thousand = []'], a: [400020000], wide: true }]
      },
      p3: {
        items: [ORD([207000000, 270000000, 27000000]), ORD([5500000, 5050000, 5005000]), DV(123456789, 8), CMP(76000000, 7600000),
          { q: 'Write in standard form.', eq: ['2 billion + 60 million = []'], a: [2060000000], wide: true }]
      },
      think: {
        items: [{ q: '{b} writes six million, four thousand as 6 4000. What went wrong?', lines: { n: 3, key: 'Each period needs 3 digits: 6 004 000. The millions, thousands and ones periods are all there.' } },
          { q: 'Make the greatest 10-digit number with the digits 1, 0, 0, 0, 0, 0, 0, 0, 0, 2.', eq: ['[]'], a: [2100000000], big: [1, 0, 0, 0, 0, 0, 0, 0, 0, 2] },
          { q: 'How many millions are in one billion?', eq: ['1 billion ÷ 1 million = []'], a: [1000], wide: true },
          { q: 'Where might you see a number in the billions? Give one example.', lines: { n: 2, key: 'For example, a country\'s budget in dollars, or how many people live on Earth (about 8 billion).' } }]
      }
    },

    news: {
      watch: 'treating the decimal as more digits: 36.2 million is 36 200 000, not 36 000 002. Multiply by 1 000 000.',
      goal: 'I can change a news number like 4.7 million into standard form.',
      learn: {
        show: { cap: '× 1 000 000 moves the point 6 places right', eq: ['4.7 million = 4 000 000 + 700 000', '4.7 million = 4 700 000'] },
        together: [NEWS(2.5, 'million'), NEWS(36.2, 'million')],
        cue: 'Million means × 1 000 000. Billion means × 1 000 000 000.',
        own: [NEWS(1.8, 'million'), NEWS(14.75, 'million'), NEWS(3.1, 'billion'), BACK(6500000, 'million')]
      },
      p1: {
        show: { eq: ['0.3 million = 300 000', '9.3 million = 9 300 000'] },
        items: [NEWS(7.4, 'million'), NEWS(0.6, 'million'), NEWS(12.5, 'million'), NEWS(1.2, 'billion'), BACK(4200000, 'million'), BACK(800000, 'million')]
      },
      p2: {
        items: [NEWS(40.05, 'million'), NEWS(8.25, 'billion'), BACK(15600000, 'million'), BACK(2300000000, 'billion'),
          story('About 41.5 million people live in Canada. Write it in standard form.', 'people', 41500000, '41.5 million', { wide: true }),
          story('A city budget is $1.4 billion. Write it in standard form.', 'dollars', 1400000000, '1.4 billion', { wide: true })]
      },
      p3: {
        items: [story('A film earned $2.75 million. How many dollars is that?', 'dollars', 2750000, '2.75 million', { wide: true }),
          story('Ontario has about 15.6 million people and Quebec about 9 million. How many more in Ontario?', 'people', 6600000, '15.6 million − 9 million', { wide: true }),
          BACK(950000, 'million'), BACK(70000000, 'billion'),
          { q: 'Which is the same as 3.04 million?', pick: { opts: ['3 400 000', '3 040 000', '3 004 000'], ans: 1, val: 3040000 }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 0.5 billion is less than 600 million. Is {b} right? Explain.', lines: { n: 3, key: 'Yes. 0.5 billion = 500 000 000, which is less than 600 000 000.' } },
          { q: 'Why do news stories write 36.2 million instead of 36 200 000?', lines: { n: 2, key: 'It is shorter and easier to read and say.' } },
          story('A game had 1.25 million players. A year later it had 2 times as many. How many players then?', 'players', 2500000, '2 × 1.25 million', { wide: true }),
          BACK(4080000, 'million')]
      }
    },

    base: {
      watch: 'writing the exponent as a factor. In 5^3 the 5 is used 3 times: 5 × 5 × 5.',
      goal: 'I can write repeated multiplication as a power and find its value.',
      learn: {
        show: { cap: 'base 2, exponent 4: 2 is used 4 times', eq: ['2 × 2 × 2 × 2 = 2^4', '2^4 = 16'] },
        together: [EXP(3, 4), OUT(5, 3)],
        cue: 'The exponent says how many times the base is used.',
        own: [EXP(7, 2), EXP(10, 5), OUT(2, 3), PW(4, 3)]
      },
      p1: {
        show: { eq: ['6 × 6 × 6 = 6^3', '6^3 = 216'] },
        items: [EXP(9, 3), EXP(2, 6), PW(3, 3), PW(2, 5), PW(10, 4), OUT(3, 2)]
      },
      p2: {
        items: [PW(5, 4), PW(7, 3), PW(1, 9), PW(6, 2), EXP(8, 4), OUT(4, 2)]
      },
      p3: {
        items: [PW(2, 10), PW(9, 3), PW(12, 2),
          story('A cell splits into 2 every hour. One cell becomes how many after 6 hours?', 'cells', 64, '2^6', { wide: true }),
          { q: 'Which power equals 81?', pick: { opts: ['9^3', '3^4', '8^1'], ans: 1, val: 81 }, wide: true }]
      },
      think: {
        items: [{ q: 'Explain the base and the exponent in 4^5.', lines: { n: 3, key: '4 is the base, the number multiplied. 5 is the exponent: 4 is used 5 times, 4 × 4 × 4 × 4 × 4.' } },
          story('A chain message goes to 3 people, and each sends it to 3 more. How many get it in round 4?', 'people', 81, '3^4', { wide: true }),
          { q: 'Find the exponent.', eq: ['2^[] = 32'], a: [5] },
          { q: 'Write 1 000 as a power of 10.', eq: ['1000 = 10^[]'], a: [3] }]
      }
    },

    notthis: {
      watch: 'multiplying the base by the exponent: 3^4 is 81, not 12. Write it out before working it out.',
      goal: 'I can tell a power from a product.',
      learn: {
        show: { cap: '3^4 is not 3 × 4', eq: ['3 × 4 = 12', '3^4 = 3 × 3 × 3 × 3 = 81'] },
        together: [OUT(2, 5), CMP('2^5', '5^2')],
        cue: 'Write the power out first, then multiply.',
        own: [CMP('3^2', '2^3'), CMP('4^2', '2^4'), TF('5^2 = 10', false), TF('10^3 = 1000', true)]
      },
      p1: {
        show: { eq: ['2 × 6 = 12', '2^6 = 64'] },
        items: [PW(4, 2), { eq: ['4 × 2 = []'], a: [8] }, PW(6, 3), { eq: ['6 × 3 = []'], a: [18] }, CMP('6^2', '2^6'), TF('7^2 = 49', true)]
      },
      p2: {
        items: [CMP('3^3', '3 × 3'), CMP('1^8', '8^1'), TF('2^3 = 3^2', false), TF('4^3 = 64', true), CMP('10^2', '2^10'), CMP('5^3', '3^5')]
      },
      p3: {
        items: [{ eq: ['2^3 + 3^2 = []'], a: [17] }, { eq: ['5^2 − 2^4 = []'], a: [9] }, { eq: ['10^2 × 3 = []'], a: [300] },
          { q: 'Which is greatest?', pick: { opts: ['2^7', '7^2', '4^3'], ans: 0, big: true }, wide: true },
          { q: 'Which is least?', pick: { opts: ['3^4', '4^3', '9^2'], ans: 1, small: true }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 2^4 = 8. What went wrong?', lines: { n: 3, key: '{b} multiplied 2 × 4. 2^4 means 2 × 2 × 2 × 2 = 16.' } },
          { q: 'Find two different powers that equal 64.', lines: { n: 2, key: '2^6, 4^3 and 8^2 all equal 64.' } },
          CMP('2^4', '4^2'),
          { q: 'Why is 1^100 still 1?', lines: { n: 2, key: '1 × 1 × 1 ... is always 1, however many times you use it.' } }]
      }
    },

    zeros: {
      watch: 'counting digits instead of zeros. 10^6 is 1 followed by 6 zeros: 1 000 000, a 7-digit number.',
      goal: 'I can write powers of ten as numbers and numbers as powers of ten.',
      learn: {
        show: { cap: 'the exponent counts the zeros', eq: ['10^3 = 10 × 10 × 10', '10^3 = 1 000'] },
        together: [TEN(5), TENB(4)],
        cue: 'Count the zeros: that is the exponent.',
        own: [TEN(2), TEN(6), TENB(3), TENB(9)]
      },
      p1: {
        show: { eq: ['10^7 = 10 000 000'] },
        items: [TEN(1), TEN(4), TEN(8), TENB(5), TENB(7), TENB(2)]
      },
      p2: {
        items: [{ eq: ['4 × 10^3 = []'], a: [4000] }, { eq: ['7 × 10^5 = []'], a: [700000] }, { eq: ['3 × 10^6 = []'], a: [3000000] },
          { eq: ['60 000 = [] × 10^4'], a: [6] }, { eq: ['900 000 000 = 9 × 10^[]'], a: [8] }, CMP('10^5', 99999)]
      },
      p3: {
        items: [{ eq: ['2.5 × 10^6 = []'], a: [2500000] }, { eq: ['10^9 = []'], a: [1000000000] }, { eq: ['10^3 × 10^2 = 10^[]'], a: [5] },
          { eq: ['10^9 ÷ 10^6 = []'], a: [1000] },
          { q: 'Which is 1 000 000?', pick: { opts: ['10^5', '10^6', '10^7'], ans: 1, val: 1000000 }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 10^4 has 4 digits. Is {b} right? Explain.', lines: { n: 3, key: 'No. 10^4 = 10 000 has 4 zeros but 5 digits: the 1 is a digit too.' } },
          { q: 'Why is 10^3 × 10 the same as 10^4?', lines: { n: 2, key: 'Multiplying by 10 adds one more zero: 1 000 × 10 = 10 000 = 10^4.' } },
          { eq: ['10^6 ÷ 10^2 = 10^[]'], a: [4] },
          { eq: ['10^9 = 10^[] × 10^3'], a: [6] }]
      }
    },

    expanded: {
      watch: 'leaving out a zero place or giving it a power. Only the non-zero digits get a term: 4 × 10^6 + 3 × 10^4.',
      goal: 'I can write a big number in expanded form with powers of ten.',
      learn: {
        show: { cap: '5 200 000 =', eq: ['5 × 10^6 + 2 × 10^5'] },
        together: [XD([[3, 6], [4, 5]]), XS([[7, 5], [2, 3]])],
        cue: 'Each digit times its place, written as a power of ten.',
        own: [XD([[6, 8], [5, 7]]), XS([[9, 4], [1, 2], [3, 0]]), XD([[2, 9], [8, 6]])]
      },
      p1: {
        show: { eq: ['3 × 10^5 + 6 × 10^2 = 300 600'] },
        items: [XS([[4, 6], [3, 4]]), XS([[1, 9], [5, 7]]), XD([[8, 5], [2, 1]]), XD([[7, 7], [6, 3]]), XS([[2, 8], [2, 5], [2, 2]])]
      },
      p2: {
        items: [XD([[9, 6], [4, 4], [1, 0]]), XS([[6, 7], [8, 6], [3, 3]]), XD([[5, 8], [3, 5]]), XS([[1, 6], [1, 0]]), XD([[4, 9], [7, 7], [2, 4]])]
      },
      p3: {
        items: [XD([[3, 8], [6, 6], [9, 2]]), XS([[8, 9], [5, 5], [7, 1]]),
          { q: 'Which is 5 × 10^6 + 4 × 10^3?', pick: { opts: ['5 400 000', '5 004 000', '5 040 000'], ans: 1, val: 5004000 }, wide: true },
          XD([[6, 7], [1, 1]])]
      },
      think: {
        items: [{ q: '{b} writes 2 030 000 as 2 × 10^6 + 3 × 10^5. What went wrong?', lines: { n: 3, key: 'The 3 is in the ten thousands place, so it is 3 × 10^4. 3 × 10^5 would be 300 000.' } },
          { q: 'Why does 7 × 10^0 mean 7?', lines: { n: 2, key: '10^0 = 1, the ones place, so 7 × 1 = 7.' } },
          XD([[1, 9], [1, 6], [1, 3]]),
          { q: 'Write a 9-digit number with exactly two non-zero digits, in both forms.', lines: { n: 2, key: 'For example 400 000 050 = 4 × 10^8 + 5 × 10^1.' } }]
      }
    },

    perfect: {
      watch: 'doubling instead of squaring: 6^2 is 6 × 6 = 36, not 12. A perfect square makes a square of tiles.',
      goal: 'I can find perfect squares and show them as squares of tiles.',
      learn: {
        show: { pic: ['array', { r: 4, c: 4 }], cap: '4 rows of 4', eq: ['4^2 = 16'] },
        together: [TILE(3), SQ(7)],
        cue: 'A perfect square is a whole number times itself.',
        own: [SQ(9), SQ(11), SQ(12)]
      },
      p1: {
        show: { pic: ['array', { r: 6, c: 6 }], eq: ['6^2 = 36'] },
        items: [TILE(2), SQ(8), SQ(10), SQ(1), SQ(13), SQ(20)]
      },
      p2: {
        items: [{ q: 'Which is a perfect square?', pick: { opts: ['24', '49', '50'], ans: 1, square: true } },
          { q: 'Which is a perfect square?', pick: { opts: ['121', '120', '122'], ans: 0, square: true } },
          SQ(15), SQ(30), { eq: ['[]^2 = 64'], a: [8] }, { eq: ['[]^2 = 144'], a: [12] }]
      },
      p3: {
        items: [story('A square patio uses 81 tiles. How many tiles along each side?', 'tiles', 9, '√81'),
          story('A square garden is 14 m on each side. What is its area?', 'm²', 196, '14 × 14'),
          { q: 'Which is a perfect square?', pick: { opts: ['150', '169', '180'], ans: 1, square: true }, wide: true },
          { eq: ['6^2 + 8^2 = []'], a: [100] }, { eq: ['5^2 − 4^2 = []'], a: [9] }]
      },
      think: {
        items: [{ q: 'Is 40 a perfect square? Explain with tiles.', lines: { n: 3, key: 'No. 6 × 6 = 36 and 7 × 7 = 49. 40 tiles make no square; 4 are left past the 6 by 6.' } },
          { q: 'List the perfect squares between 50 and 150.', lines: { n: 1, key: '64, 81, 100, 121, 144' } },
          { q: 'Draw the square for 9^2 as a 9 by 9 grid outline.', draw: { h: 70, key: 'A square 9 dots across and 9 dots down: 81 small squares.' } },
          { q: 'Why is the area of a square its side squared?', lines: { n: 2, key: 'Area is rows × columns, and a square has the same number of each.' } }]
      }
    },

    root: {
      watch: 'halving instead of finding the root: √36 is 6, not 18. Ask which number times itself makes it.',
      goal: 'I can find the square root of a perfect square.',
      learn: {
        show: { pic: ['array', { r: 5, c: 5 }], cap: '25 tiles: 5 along each side', eq: ['5 × 5 = 25', '√25 = 5'] },
        together: [RT(4), RT(9)],
        cue: 'Which number times itself makes it?',
        own: [RT(6), RT(8), RT(10), RT(1)]
      },
      p1: {
        show: { eq: ['7 × 7 = 49', '√49 = 7'] },
        items: [RT(3), RT(2), RT(11), RT(12), RT(20), RT(7)]
      },
      p2: {
        items: [RT(15), RT(13), { eq: ['√64 + √36 = []'], a: [14] }, { eq: ['√100 − √4 = []'], a: [8] }, { eq: ['√[] = 9'], a: [81] }, { eq: ['√[] = 14'], a: [196] }]
      },
      p3: {
        items: [story('A square room has an area of 144 m². How long is one wall?', 'm', 12, '√144'),
          story('A square poster has an area of 2 500 cm². How long is each side?', 'cm', 50, '√2500'),
          story('A square field has an area of 400 m². How far is it around all 4 sides?', 'm', 80, '4 × √400'),
          { eq: ['√9 × √16 = []'], a: [12] }, { eq: ['(√49)^2 = []'], a: [49] }]
      },
      think: {
        items: [{ q: '{b} says √16 = 8. What went wrong?', lines: { n: 3, key: '{b} halved 16. √16 asks which number times itself makes 16: 4 × 4 = 16, so √16 = 4.' } },
          { q: 'How are squaring and square roots opposites?', lines: { n: 2, key: 'Squaring 6 gives 36; the root of 36 gives back 6. One undoes the other.' } },
          RT(25),
          { q: 'Draw a square with an area of 16 squares and mark its side.', draw: { h: 70, key: 'A 4 by 4 square. Each side is 4.' } }]
      }
    },

    between: {
      watch: 'giving the squares instead of their roots. √30 is between 5 and 6, because 25 < 30 < 36.',
      goal: 'I can find the two whole numbers a square root is between.',
      learn: {
        show: { pic: ['nl', { min: 25, max: 36, tick: 1, lab: 11, pt: 30, ptl: '30' }], cap: '25 < 30 < 36', eq: ['5 < √30 < 6'] },
        together: [BET(50), BET(20)],
        cue: 'Find the perfect squares on each side.',
        own: [BET(10), BET(70), BET(90), BET(130)]
      },
      p1: {
        show: { eq: ['49 < 55 < 64', '7 < √55 < 8'] },
        items: [BET(5), BET(15), BET(40), BET(60), BET(85), BET(110)]
      },
      p2: {
        items: [BET(3), BET(27), BET(45), BET(99), BET(140), BET(200)]
      },
      p3: {
        items: [{ q: 'Which is closest to √50?', pick: { opts: ['6', '7', '8'], ans: 1, est: '√50' }, wide: true },
          { q: 'Which is closest to √80?', pick: { opts: ['8', '9', '10'], ans: 1, est: '√80' }, wide: true },
          BET(150), BET(75),
          { q: 'A square rug has an area of 20 m². Its side is between which two whole numbers of metres?', eq: ['[] < √20 < []'], a: [4, 5], wide: true }]
      },
      think: {
        items: [{ q: '{b} says √40 is between 16 and 25. What went wrong?', lines: { n: 3, key: '16 and 25 are the squares. Their roots are 4 and 5, so 6 < √40 < 7. (36 < 40 < 49)' } },
          { q: 'Is √65 closer to 8 or to 9? Explain.', lines: { n: 2, key: 'Closer to 8: 65 is 1 more than 64 but 16 less than 81.' } },
          BET(30),
          { q: 'Name a number whose square root is between 9 and 10.', lines: { n: 1, key: 'Any number between 81 and 100, such as 90.' } }]
      }
    },

    pairs: {
      watch: 'stopping too soon or missing a pair. Try 1, 2, 3 ... until the factors meet in the middle.',
      goal: 'I can list the factor pairs of a number.',
      learn: {
        show: { cap: 'factor pairs of 18', eq: ['1 × 18, 2 × 9, 3 × 6', 'factors: 1, 2, 3, 6, 9, 18'] },
        together: [PAIR(24, 4), ALL(12)],
        cue: 'Go up from 1 until the pairs meet in the middle.',
        own: [PAIR(36, 4), PAIR(45, 5), ALL(16), ALL(30)]
      },
      p1: {
        show: { eq: ['20 = 1 × 20 = 2 × 10 = 4 × 5'] },
        items: [PAIR(28, 4), PAIR(42, 6), PAIR(56, 7), ALL(10), ALL(21), ALL(25)]
      },
      p2: {
        items: [ALL(36), ALL(40), ALL(17), PAIR(96, 8), PAIR(108, 9), PAIR(144, 12)]
      },
      p3: {
        items: [ALL(48), ALL(60),
          story('{a} puts 72 {many} in rows of 8. How many rows?', 'rows', 9, '72 ÷ 8'),
          { q: 'Which number has exactly 2 factors?', pick: { opts: ['21', '23', '25'], ans: 1, prime: true } }]
      },
      think: {
        items: [{ q: 'Why does 36 have an odd number of factors?', lines: { n: 3, key: '6 × 6 = 36: 6 pairs with itself, so it is counted once. Perfect squares have an odd number of factors.' } },
          { q: 'Show every way to arrange 24 chairs in equal rows.', lines: { n: 2, key: '1 × 24, 2 × 12, 3 × 8, 4 × 6 (and the same turned round).' } },
          ALL(18),
          { q: '{b} says 1 is not a factor of 50. Is {b} right?', lines: { n: 2, key: 'No. 1 is a factor of every whole number: 1 × 50 = 50.' } }]
      }
    },

    gcf: {
      watch: 'picking a common factor that is not the greatest, or a multiple. List the factors of both and circle the biggest shared one.',
      goal: 'I can find the greatest common factor of two numbers.',
      learn: {
        show: { cap: '12: 1, 2, 3, 4, 6, 12 · 18: 1, 2, 3, 6, 9, 18', eq: ['common: 1, 2, 3, 6', 'GCF of 12 and 18 = 6'] },
        together: [GCF([8, 12]), GCF([15, 25])],
        cue: 'List the factors of both. Circle the greatest one they share.',
        own: [GCF([10, 15]), GCF([16, 24]), GCF([9, 21]), GCF([14, 35])]
      },
      p1: {
        show: { cap: '20: 1, 2, 4, 5, 10, 20 · 30: 1, 2, 3, 5, 6, 10, 15, 30', eq: ['GCF of 20 and 30 = 10'] },
        items: [GCF([6, 9]), GCF([12, 16]), GCF([18, 27]), GCF([20, 32]), GCF([7, 13]), GCF([24, 36])]
      },
      p2: {
        items: [GCF([42, 56]), GCF([45, 60]), GCF([36, 48]), GCF([64, 80]), GCF([33, 55]), GCF([12, 18, 30])]
      },
      p3: {
        items: [GCF([72, 96]), GCF([84, 126]), GCF([100, 144]),
          story('{a} has 24 red and 36 blue {many}. What is the greatest number of equal bags with no {many} left?', 'bags', 12, 'GCF', { gcf: [24, 36], calc: null }),
          story('A 48 cm by 60 cm board is cut into the biggest equal squares. How long is each side?', 'cm', 12, 'GCF', { gcf: [48, 60], calc: null })]
      },
      think: {
        items: [{ q: '{b} says the GCF of 8 and 12 is 24. What went wrong?', lines: { n: 3, key: '24 is a common multiple. The GCF divides both: 4.' } },
          { q: 'When is the GCF of two numbers 1?', lines: { n: 2, key: 'When they share no factor but 1, like 8 and 15.' } },
          GCF([54, 90]),
          { q: 'Find two numbers whose GCF is 7.', lines: { n: 1, key: 'For example 14 and 21, or 7 and 35.' } }]
      }
    },

    primes: {
      watch: 'stopping at a number that is not prime. Keep dividing until every factor is prime: 2, 3, 5, 7 ...',
      goal: 'I can use prime factors to find the GCF.',
      learn: {
        show: { cap: 'shared primes: 2 × 3', eq: ['36 = 2 × 2 × 3 × 3', '30 = 2 × 3 × 5', 'GCF = 2 × 3 = 6'] },
        together: [PR(12, 1), PR(45, 1)],
        cue: 'Multiply the primes both numbers share.',
        own: [PR(18, 1), PR(63, 0), PR(50, 1), GCF([18, 63])]
      },
      p1: {
        show: { eq: ['60 = 2 × 2 × 3 × 5', '84 = 2 × 2 × 3 × 7', 'GCF = 2 × 2 × 3 = 12'] },
        items: [PR(12, 1), PR(50, 1), PR(56, 2), PR(75, 0), GCF([60, 84]), GCF([50, 75])]
      },
      p2: {
        items: [PR(72, 2), PR(90, 1), PR(98, 0), PR(132, 1), GCF([72, 90]), GCF([98, 140])]
      },
      p3: {
        items: [PR(120, 2), PR(144, 3), GCF([120, 144]), GCF([88, 132]),
          { q: 'Which is the product of primes for 66?', pick: { opts: ['6 × 11', '2 × 3 × 11', '2 × 33'], ans: 1, pprime: 66 }, wide: true }]
      },
      think: {
        items: [{ q: '{b} writes 48 = 6 × 8. Is that a product of primes? Explain.', lines: { n: 3, key: 'No. 6 = 2 × 3 and 8 = 2 × 2 × 2 are not prime. 48 = 2 × 2 × 2 × 2 × 3.' } },
          { q: 'Why is 1 not used in a product of primes?', lines: { n: 2, key: '1 is not prime, and multiplying by 1 changes nothing.' } },
          PR(100, 0),
          { q: 'Use prime factors to explain why the GCF of 35 and 66 is 1.', lines: { n: 2, key: '35 = 5 × 7 and 66 = 2 × 3 × 11 share no prime.' } }]
      }
    },

    lcm: {
      watch: 'multiplying the numbers every time. 4 × 6 = 24 is a common multiple, but 12 is the lowest.',
      goal: 'I can find the lowest common multiple of two or three numbers.',
      learn: {
        show: { cap: '4: 4, 8, 12, 16 · 6: 6, 12, 18', eq: ['LCM of 4 and 6 = 12'] },
        together: [LCM([3, 5]), LCM([6, 8])],
        cue: 'Skip count by the bigger number until the other one divides it.',
        own: [LCM([4, 10]), LCM([9, 12]), LCM([5, 7]), LCM([2, 3, 4])]
      },
      p1: {
        show: { cap: '8: 8, 16, 24 · 12: 12, 24', eq: ['LCM of 8 and 12 = 24'] },
        items: [LCM([2, 5]), LCM([4, 8]), LCM([6, 9]), LCM([10, 15]), LCM([3, 7]), LCM([12, 16])]
      },
      p2: {
        items: [LCM([8, 10]), LCM([14, 21]), LCM([9, 15]), LCM([2, 3, 5]), LCM([4, 6, 8]), LCM([3, 4, 6])]
      },
      p3: {
        items: [LCM([12, 18]), LCM([5, 6, 10]), LCM([6, 10, 15]),
          story('Buns come in packs of 8 and wieners in packs of 6. What is the fewest of each so none are left over?', 'buns', 24, 'LCM', { lcm: [8, 6], calc: null, wide: true }),
          story('One bus leaves every 12 minutes and another every 20 minutes. They leave together at 8:00. How many minutes until they leave together again?', 'minutes', 60, 'LCM', { lcm: [12, 20], calc: null, wide: true })]
      },
      think: {
        items: [{ q: '{b} says the LCM of 6 and 9 is 54. What went wrong?', lines: { n: 3, key: '54 = 6 × 9 is a common multiple, but 18 comes first: 6, 12, 18 and 9, 18.' } },
          { q: 'When is the LCM of two numbers just their product?', lines: { n: 2, key: 'When they share no factor but 1, like 4 and 9: LCM 36.' } },
          LCM([7, 14]),
          { q: 'Find three numbers whose LCM is 30.', lines: { n: 1, key: 'For example 2, 3 and 5, or 6, 10 and 15.' } }]
      }
    },

    which: {
      watch: 'mixing them up. Splitting into the biggest equal groups uses the GCF; when things line up again uses the LCM.',
      goal: 'I can tell whether a problem needs the GCF or the LCM.',
      learn: {
        show: { cap: 'split into equal groups → GCF · meet again → LCM', eq: ['18 and 24 split: GCF = 6', '18 and 24 meet: LCM = 72'] },
        together: [{ q: '30 apples and 45 pears fill equal baskets, none left. Most baskets?', pick: { opts: ['GCF', 'LCM'], ans: 0, gl: { split: true } }, wide: true },
          { q: 'Lights flash every 4 s and every 10 s. When together again?', pick: { opts: ['GCF', 'LCM'], ans: 1, gl: { again: true } }, wide: true }],
        cue: 'Splitting into groups: GCF. Meeting again: LCM.',
        own: [story('30 apples and 45 pears fill equal baskets, none left. Most baskets?', 'baskets', 15, 'GCF', { gcf: [30, 45], calc: null, wide: true }),
          story('Lights flash every 4 s and every 10 s. Seconds until together again?', 'seconds', 20, 'LCM', { lcm: [4, 10], calc: null, wide: true })]
      },
      p1: {
        show: { eq: ['teams from 12 and 16: GCF 4', 'laps of 3 and 4 min: LCM 12'] },
        items: [{ q: '{a} runs a lap in 6 minutes and {b} in 8. When are they at the start together?', pick: { opts: ['GCF', 'LCM'], ans: 1, gl: { again: true } }, wide: true },
          story('{a} runs a lap in 6 minutes and {b} in 8. How many minutes until they are at the start together?', 'minutes', 24, 'LCM', { lcm: [6, 8], calc: null, wide: true }),
          { q: '20 boys and 28 girls form equal mixed teams. Most teams?', pick: { opts: ['GCF', 'LCM'], ans: 0, gl: { split: true } }, wide: true },
          story('20 boys and 28 girls form equal mixed teams with no one left out. What is the most teams?', 'teams', 4, 'GCF', { gcf: [20, 28], calc: null, wide: true })]
      },
      p2: {
        items: [story('Plates come in packs of 10 and cups in packs of 12. Fewest plates to match the cups exactly?', 'plates', 60, 'LCM', { lcm: [10, 12], calc: null, wide: true }),
          story('A 36 m and a 54 m rope are cut into equal pieces as long as possible. How long is each piece?', 'm', 18, 'GCF', { gcf: [36, 54], calc: null, wide: true }),
          story('Two ferries leave together. One returns every 15 minutes, the other every 25. When together again?', 'minutes', 75, 'LCM', { lcm: [15, 25], calc: null, wide: true }),
          story('42 pencils and 56 erasers are shared into identical kits with none left. Most kits?', 'kits', 14, 'GCF', { gcf: [42, 56], calc: null, wide: true })]
      },
      p3: {
        items: [story('Three alarms ring every 4, 6 and 9 minutes. They ring together now. How many minutes until they ring together again?', 'minutes', 36, 'LCM', { lcm: [4, 6, 9], calc: null, wide: true }),
          story('A garden is 72 m by 120 m. It is split into equal square plots as big as possible. How long is each side?', 'm', 24, 'GCF', { gcf: [72, 120], calc: null, wide: true }),
          { q: 'Hot dogs come 12 to a pack and buns 8 to a pack. The LCM is 24. How many packs of buns make 24?', eq: ['[] packs'], a: [3], calc: '24 ÷ 8', wide: true },
          story('Red beads come in strings of 14 and blue in strings of 21. Fewest of each colour to have the same number?', 'beads', 42, 'LCM', { lcm: [14, 21], calc: null, wide: true })]
      },
      think: {
        items: [{ q: 'Write a problem that needs the GCF of 16 and 40.', lines: { n: 3, key: 'For example: 16 red and 40 blue balloons go into identical bunches with none left. Most bunches? (8)' } },
          { q: 'Write a problem that needs the LCM of 5 and 6.', lines: { n: 3, key: 'For example: one bell rings every 5 minutes and one every 6. When do they ring together? (30 minutes)' } },
          { q: 'Why is the GCF never bigger than the smaller number?', lines: { n: 2, key: 'It must divide the smaller number, and nothing bigger than a number divides it.' } }]
      }
    }
  } });
})();
