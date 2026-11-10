/* Grade 6 Fractions: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/fractions.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random, so a
   sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.3 compare and order fractions; B2.5 add and subtract fractions with like and unlike
   denominators; B2.9 multiply a whole number by a proper fraction; B2.10 divide a whole number by a proper fraction.
   The answer checks are in tests/verify/sheets.js: every sum is worked out with its fractions (1 3/4 is 1 + 3/4,
   "2/3 of 12" is 2/3 × 12), a common denominator must be the least common multiple (lcm), an answer asked for in
   simplest form must be in simplest form (simplest), and a story's answer follows from its numbers (calc). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function gcd(x, y) { return y ? gcd(y, x % y) : x; }
  /* a fraction n/d in simplest form, as a mixed number when it is more than 1 */
  function F(n, d) {
    var g = gcd(n, d); n /= g; d /= g;
    if (d === 1) return n;
    return n > d ? Math.floor(n / d) + ' ' + (n % d) + '/' + d : n + '/' + d;
  }
  /* an equivalent fraction: n/d = []/(d × k) */
  function EQ(n, d, k) { return { eq: [n + '/' + d + ' = []/' + d * k], a: [n * k] }; }
  /* an equivalent fraction in lower terms: n/d = []/(d ÷ k) */
  function LO(n, d, k) { return { eq: [n + '/' + d + ' = []/' + d / k], a: [n / k] }; }
  /* the least common denominator of a/b and c/d */
  function CD(b, d) { return { q: 'Least common denominator of 1/' + b + ' and 1/' + d + ':', eq: ['[]'], a: [b * d / gcd(b, d)], lcm: [b, d] }; }
  /* rename both fractions to their least common denominator */
  function RN(a, b, c, d) { var l = b * d / gcd(b, d); return { eq: [a + '/' + b + ' = []/' + l, c + '/' + d + ' = []/' + l], a: [a * l / b, c * l / d] }; }
  /* a/b + c/d (op '+' or '−') in simplest form, with the common denominator step */
  function AD(a, b, op, c, d, steps) {
    var l = b * d / gcd(b, d), x = a * l / b, y = c * l / d, r = op === '+' ? x + y : x - y;
    var it = steps ? { eq: [a + '/' + b + ' ' + op + ' ' + c + '/' + d + ' = []/' + l + ' ' + op + ' []/' + l + ' = []'], a: [x, y, F(r, l)], wide: true }
      : { eq: [a + '/' + b + ' ' + op + ' ' + c + '/' + d + ' = []'], a: [F(r, l)] };
    it.simplest = true;
    return it;
  }
  /* mixed numbers: m1 + or − m2, each [whole, top, bottom] */
  function MX(p, op, q) {
    var l = p[2] * q[2] / gcd(p[2], q[2]), x = (p[0] * p[2] + p[1]) * l / p[2], y = (q[0] * q[2] + q[1]) * l / q[2];
    var w = function (m) { return m[1] ? m[0] + ' ' + m[1] + '/' + m[2] : String(m[0]); };
    return { eq: [w(p) + ' ' + op + ' ' + w(q) + ' = []'], a: [F(op === '+' ? x + y : x - y, l)], simplest: true };
  }
  /* an improper fraction as a mixed number, or the other way */
  function IM(n, d) { return { eq: [n + '/' + d + ' = []'], a: [F(n, d)], simplest: true }; }
  function MI(w, n, d) { return { eq: [w + ' ' + n + '/' + d + ' = []/' + d], a: [w * d + n] }; }
  /* a whole number times a fraction */
  function WT(k, n, d) { return { eq: [k + ' × ' + n + '/' + d + ' = []'], a: [F(k * n, d)], simplest: true }; }
  /* a fraction of a whole number */
  function OF(n, d, k) { return { eq: [n + '/' + d + ' of ' + k + ' = []'], a: [F(n * k, d)] }; }
  /* a whole number divided by a fraction */
  function DV(k, n, d) { return { eq: [k + ' ÷ ' + n + '/' + d + ' = []'], a: [F(k * d, n)] }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* compare two fractions */
  function CM(a, b, c, d) { var x = a * d, y = c * b; return { eq: [a + '/' + b + '   ?   ' + c + '/' + d], pick: { opts: ['<', '>', '='], ans: x < y ? 0 : x > y ? 1 : 2, cmp: [a + '/' + b, c + '/' + d] }, pickLast: true }; }

  S.register('fractions', { code: 'FR', ideas: {

    equiv: {
      watch: 'multiplying only the bottom (2/5 = 2/15). Do the same to the top and the bottom.',
      goal: 'I can find equivalent fractions.',
      learn: {
        show: { pic: ['fbars', { rows: [[3, 2], [6, 4]], labels: ['2/3', '4/6'] }], eq: ['2/3 = 4/6'] },
        together: [{ pic: ['fbars', { rows: [[4, 3], [8, 6]] }], eq: ['3/4 = []/8'], a: [6] }, EQ(2, 5, 3)],
        cue: 'Multiply or divide the top and the bottom by the same number.',
        own: [EQ(1, 6, 4), LO(8, 12, 4), EQ(5, 7, 2), LO(15, 20, 5)]
      },
      p1: {
        show: { cap: 'top × 2 and bottom × 2', eq: ['3/5 = 6/10'] },
        items: [EQ(1, 2, 5), EQ(3, 4, 3), EQ(2, 3, 4), LO(6, 9, 3), LO(10, 16, 2), LO(12, 18, 6)]
      },
      p2: {
        items: [EQ(4, 5, 6), EQ(7, 8, 3), LO(21, 28, 7), LO(36, 48, 12), { eq: ['2/3 = []/12 = []/30'], a: [8, 20], wide: true }, CM(3, 4, 9, 12)]
      },
      p3: {
        items: [{ eq: ['5/6 = 25/[]'], a: [30] }, { eq: ['3/8 = []/40'], a: [15] }, LO(45, 60, 15),
          { q: 'Simplest form:', eq: ['18/24 = []'], a: ['3/4'], simplest: true },
          { q: 'Which is not equal to 2/3?', pick: { opts: ['4/6', '6/9', '8/10', '10/15'], ans: 2, diff: true }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 2/5 = 2/15. What went wrong?', lines: { n: 3, key: 'Only the bottom was multiplied. Multiply both: 2/5 = 6/15.' } },
          { q: 'Why does multiplying the top and bottom by 3 not change the amount?', lines: { n: 3, key: 'You cut each piece into 3 smaller ones: 3 times as many pieces, each a third as big.' } },
          { q: 'Write three fractions equal to 3/4.', lines: { n: 1, key: '6/8, 9/12, 12/16 (any with the top 3/4 of the bottom).' } },
          LO(14, 35, 7)]
      }
    },

    common: {
      watch: 'multiplying the two bottoms when a smaller common denominator works. For 1/4 and 1/6 use 12, not 24.',
      goal: 'I can find a common denominator and compare fractions.',
      learn: {
        show: { cap: 'multiples of 4: 4, 8, 12 · multiples of 6: 6, 12', eq: ['1/4 = 3/12, 1/6 = 2/12'] },
        together: [CD(4, 6), RN(1, 4, 1, 6)],
        cue: 'Find the least number both bottoms divide into. Change both fractions to that bottom.',
        own: [CD(3, 5), RN(2, 3, 3, 5), CM(2, 3, 3, 5)]
      },
      p1: {
        show: { eq: ['1/2 and 1/3: 6', '3/6 > 2/6'] },
        items: [CD(2, 3), CD(4, 8), CD(6, 9), RN(1, 2, 2, 5), CM(1, 2, 2, 5), CM(3, 4, 5, 8)]
      },
      p2: {
        items: [CD(8, 12), CD(10, 15), RN(3, 8, 5, 12), CM(3, 8, 5, 12), CM(7, 10, 2, 3), CM(4, 6, 6, 9)]
      },
      p3: {
        items: [CD(9, 12), RN(5, 6, 7, 9), CM(5, 6, 7, 9),
          { q: '{a} ate 3/8 of a bannock. {b} ate 1/3. Who ate more?', pick: { opts: ['{a}', '{b}'], ans: 0, more: ['3/8', '1/3'] }, wide: true },
          { q: 'Least to greatest: 2/3, 1/2, 3/4', eq: ['[] < [] < []'], a: ['1/2', '2/3', '3/4'], set: ['2/3', '1/2', '3/4'], wide: true }]
      },
      think: {
        items: [{ q: '{b} uses 24 as the common denominator for 1/4 and 1/6. Does it work? Is there a smaller one?', lines: { n: 3, key: 'Yes, 24 works. But 12 is the least: both 4 and 6 divide into 12.' } },
          { q: 'Why do we need the same bottoms to compare 3/8 and 1/3?', lines: { n: 3, key: 'Eighths and thirds are different sizes. With the same bottom (24ths) the pieces match: 9/24 > 8/24.' } },
          CD(6, 10),
          CM(5, 12, 3, 8)]
      }
    },

    adding: {
      watch: 'adding the bottoms (1/2 + 1/3 = 2/5). Make the pieces the same size, then add only the tops: 5/6.',
      goal: 'I can add fractions with different denominators.',
      learn: {
        show: { pic: ['fbars', { rows: [[2, 1], [3, 1], [6, 5]], labels: ['1/2', '1/3', '5/6'] }], eq: ['3/6 + 2/6 = 5/6'] },
        together: [AD(1, 2, '+', 1, 3, true), AD(1, 4, '+', 3, 8, true)],
        cue: 'Same size pieces first, then add the tops. The bottom stays.',
        own: [AD(2, 5, '+', 1, 10, true), AD(1, 3, '+', 1, 6), AD(3, 4, '+', 1, 6)]
      },
      p1: {
        show: { eq: ['1/4 + 1/2 = 1/4 + 2/4 = 3/4'] },
        items: [AD(1, 2, '+', 1, 4), AD(1, 3, '+', 1, 9), AD(2, 5, '+', 3, 10), AD(1, 6, '+', 1, 2), AD(3, 8, '+', 1, 4), AD(1, 5, '+', 1, 2)]
      },
      p2: {
        items: [AD(2, 3, '+', 1, 4), AD(3, 5, '+', 1, 3), AD(5, 6, '+', 1, 4), AD(3, 4, '+', 2, 3), AD(7, 10, '+', 1, 4),
          story('{a} walked 1/2 km, then 3/8 km. How far in all?', 'km', '7/8', '1/2 + 3/8')]
      },
      p3: {
        items: [AD(5, 8, '+', 5, 6), AD(4, 9, '+', 5, 6),
          story('A recipe uses 2/3 cup of oats and 3/4 cup of flour. How many cups in all?', 'cups', '1 5/12', '2/3 + 3/4'),
          story('{b} read 1/4 of a book on Monday and 2/5 on Tuesday. What part of the book is that?', '', '13/20', '1/4 + 2/5'),
          { eq: ['1/2 + 1/3 + 1/6 = []'], a: [1] }]
      },
      think: {
        items: [{ q: '{b} says 1/2 + 1/3 = 2/5. How can you tell this is wrong without working it out?', lines: { n: 3, key: '2/5 is less than 1/2, but adding 1/3 must give more than 1/2.' } },
          { q: 'Draw fraction bars to show 1/4 + 1/2.', draw: { h: 60, key: 'A bar in quarters with 1 shaded and 2 more shaded for the half: 3/4.' } },
          AD(5, 12, '+', 3, 8),
          { q: 'Write two fractions with different bottoms that add to 1.', lines: { n: 1, key: 'For example 1/2 + 2/4, or 1/3 + 4/6.' } }]
      }
    },

    subtracting: {
      watch: 'subtracting the bottoms too, or taking the smaller top from the bigger one in the wrong order.',
      goal: 'I can subtract fractions with different denominators.',
      learn: {
        show: { cap: 'same size pieces first', eq: ['3/4 − 1/3 = 9/12 − 4/12', '= 5/12'] },
        together: [AD(3, 4, '−', 1, 3, true), AD(5, 6, '−', 1, 2, true)],
        cue: 'Check it makes sense: the answer is less than the first fraction.',
        own: [AD(7, 8, '−', 1, 4, true), AD(2, 3, '−', 1, 6), AD(4, 5, '−', 1, 2)]
      },
      p1: {
        show: { eq: ['1/2 − 1/4 = 2/4 − 1/4 = 1/4'] },
        items: [AD(1, 2, '−', 1, 6), AD(3, 4, '−', 1, 2), AD(5, 8, '−', 1, 4), AD(9, 10, '−', 2, 5), AD(2, 3, '−', 2, 9), AD(1, 2, '−', 1, 5)]
      },
      p2: {
        items: [AD(5, 6, '−', 3, 4), AD(4, 5, '−', 2, 3), AD(7, 10, '−', 1, 4), AD(11, 12, '−', 2, 3), AD(3, 4, '−', 3, 8),
          story('A jug had 3/4 L of juice. {a} poured out 1/3 L. How much is left?', 'L', '5/12', '3/4 − 1/3')]
      },
      p3: {
        items: [AD(7, 9, '−', 1, 6), AD(5, 8, '−', 1, 6),
          story('{b} had 1 whole pizza and ate 3/8 of it. How much is left?', '', '5/8', '1 − 3/8'),
          story('A trail is 9/10 km. {a} has walked 2/5 km. How far to go?', 'km', '1/2', '9/10 − 2/5'),
          { eq: ['3/4 − [] = 1/2'], a: ['1/4'] }]
      },
      think: {
        items: [{ q: '{b} says 3/4 − 1/3 = 2/1 = 2. What went wrong?', lines: { n: 3, key: 'The tops and the bottoms were both subtracted. Use 12ths: 9/12 − 4/12 = 5/12.' } },
          { q: 'How can you check a subtraction of fractions?', lines: { n: 2, key: 'Add the answer to the part taken away. You should get the first fraction.' } },
          AD(11, 12, '−', 3, 8),
          { q: 'Write a story for 1/2 − 1/3.', lines: { n: 2, key: 'For example: {a} had 1/2 of a cake and gave 1/3 of the cake away. 1/6 is left.' } }]
      }
    },

    mixed: {
      watch: 'forgetting to rename a whole when the top is too small (3 1/4 − 1 3/4). Trade 1 whole for 4/4 first.',
      goal: 'I can add and subtract mixed numbers.',
      learn: {
        show: { pic: ['fbars', { rows: [[4, 11]] }], cap: '11 quarters', eq: ['11/4 = 2 3/4'] },
        together: [IM(11, 4), MX([1, 1, 2], '+', [2, 1, 4])],
        cue: 'Whole number × bottom + top gives the new top.',
        own: [MI(2, 2, 3), MX([3, 3, 4], '−', [1, 1, 4]), MX([2, 1, 3], '+', [1, 1, 2])]
      },
      p1: {
        show: { eq: ['2 1/3 = (2 × 3 + 1)/3 = 7/3'] },
        items: [IM(7, 2), IM(13, 5), MI(1, 3, 8), MI(4, 1, 2), MX([1, 1, 4], '+', [1, 2, 4]), MX([5, 7, 8], '−', [2, 3, 8])]
      },
      p2: {
        items: [IM(17, 6), MI(3, 5, 6), MX([2, 1, 2], '+', [1, 2, 3]), MX([4, 3, 4], '−', [1, 1, 3]), MX([3, 1, 4], '−', [1, 3, 4]),
          story('{a} cycled 2 1/2 km to school and 1 3/4 km to the rink. How far?', 'km', '4 1/4', '2 1/2 + 1 3/4')]
      },
      p3: {
        items: [MX([5, 1, 6], '−', [2, 2, 3]), MX([1, 5, 8], '+', [2, 3, 4]), MX([6, 0, 1], '−', [2, 2, 5]),
          story('A board is 3 1/2 m long. {b} cuts off 1 2/3 m. How much is left?', 'm', '1 5/6', '3 1/2 − 1 2/3'),
          { q: 'Which is greater?', pick: { opts: ['17/5', '3 1/2'], ans: 1, big: true } }]
      },
      think: {
        items: [{ q: '{b} says 3 1/4 − 1 3/4 = 2 2/4 because 3 − 1 = 2 and 3 − 1 = 2. What went wrong?', lines: { n: 3, key: 'You cannot take 3/4 from 1/4. Trade a whole: 2 5/4 − 1 3/4 = 1 2/4 = 1 1/2.' } },
          { q: 'Why is 9/4 the same as 2 1/4?', lines: { n: 2, key: '8 quarters make 2 wholes, and 1 quarter is left over.' } },
          MX([4, 2, 5], '+', [3, 7, 10]),
          { q: 'Write a mixed number between 2 and 3 with a denominator of 8.', lines: { n: 1, key: 'For example 2 5/8.' } }]
      }
    },

    groups: {
      watch: 'multiplying the bottom too (4 × 1/3 = 4/12). Each piece is still a third: 4 × 1/3 = 4/3.',
      goal: 'I can multiply a whole number by a fraction.',
      learn: {
        show: { pic: ['fbars', { rows: [[4, 3], [4, 3], [4, 3]] }], cap: '3 groups of 3/4', eq: ['3 × 3/4 = 9/4 = 2 1/4'] },
        together: [{ pic: ['fbars', { rows: [[3, 4]] }], eq: ['2 × 2/3 = []'], a: ['1 1/3'], simplest: true }, WT(4, 1, 3)],
        cue: 'Multiply the top by the whole number. The bottom stays the same.',
        own: [WT(5, 2, 7), WT(3, 3, 8), WT(6, 1, 2)]
      },
      p1: {
        show: { eq: ['4 × 2/5 = 8/5 = 1 3/5'] },
        items: [WT(2, 1, 5), WT(3, 2, 9), WT(4, 3, 5), WT(5, 1, 4), WT(2, 5, 6), WT(7, 1, 7)]
      },
      p2: {
        items: [WT(6, 3, 4), WT(8, 2, 3), WT(9, 5, 6), WT(10, 3, 10),
          story('{a} drinks 3/4 L of water each day. How much in 5 days?', 'L', '3 3/4', '5 × 3/4'),
          story('Each {cont} holds 2/3 kg of {many}. How much in 6 {conts}?', 'kg', 4, '6 × 2/3')]
      },
      p3: {
        items: [WT(12, 5, 8), WT(7, 4, 9),
          story('A lap of the track is 3/8 km. {b} runs 4 laps. How far?', 'km', '1 1/2', '4 × 3/8'),
          story('A canoe trip uses 5/6 of a bag of trail mix each day. How many bags for 9 days?', 'bags', '7 1/2', '9 × 5/6'),
          { eq: ['[] × 1/5 = 3'], a: [15] }]
      },
      think: {
        items: [{ q: '{b} says 4 × 1/3 = 4/12. What went wrong?', lines: { n: 3, key: 'Only the number of thirds grows. 4 groups of 1/3 is 4 thirds: 4/3 = 1 1/3.' } },
          { q: 'Why is 3 × 2/3 the same as 2/3 + 2/3 + 2/3?', lines: { n: 2, key: 'Times a whole number means that many equal groups added together.' } },
          WT(11, 3, 4),
          { q: 'Draw fraction bars for 3 × 2/5.', draw: { h: 60, key: '3 bars in fifths with 2 shaded in each: 6/5 = 1 1/5.' } }]
      }
    },

    of: {
      watch: 'dividing by the top instead of the bottom. For 2/3 of 12: 12 ÷ 3 = 4 for one third, then × 2 = 8.',
      goal: 'I can find a fraction of a whole number.',
      learn: {
        show: { pic: ['groups', { g: 3, k: 4 }], cap: '12 in 3 equal groups', eq: ['1/3 of 12 = 4', '2/3 of 12 = 8'] },
        together: [{ pic: ['groups', { g: 4, k: 5 }], eq: ['3/4 of 20 = []'], a: [15] }, OF(2, 5, 30)],
        cue: 'Divide by the bottom, then multiply by the top.',
        own: [OF(1, 6, 24), OF(5, 8, 40), OF(3, 10, 50)]
      },
      p1: {
        show: { eq: ['3/5 of 15: 15 ÷ 5 = 3, 3 × 3 = 9'] },
        items: [OF(1, 2, 18), OF(1, 4, 28), OF(2, 3, 21), OF(3, 4, 16), OF(4, 5, 35), OF(5, 6, 36)]
      },
      p2: {
        items: [OF(7, 8, 64), OF(3, 5, 45), OF(2, 9, 54), OF(9, 10, 70),
          story('A class of 28 went skating. 3/4 of them wore helmets. How many wore helmets?', 'students', 21, '3/4 × 28'),
          story('{a} has 40 {many}. {a} gives away 3/8 of them. How many are given away?', '{many}', 15, '3/8 × 40')]
      },
      p3: {
        items: [OF(5, 12, 60), OF(7, 9, 81),
          story('A bike costs $240. It is 3/5 of the way paid for. How much is paid?', 'dollars', 144, '3/5 × 240'),
          story('A 2000 m trail is 3/4 paved. How many metres are paved?', 'm', 1500, '3/4 × 2000'),
          { eq: ['2/3 of [] = 10'], a: [15] }]
      },
      think: {
        items: [{ q: '{b} says 2/3 of 12 is 12 ÷ 2 × 3 = 18. What went wrong?', lines: { n: 3, key: 'Divide by the bottom (3), then multiply by the top (2): 12 ÷ 3 × 2 = 8. A part must be less than 12.' } },
          { q: 'Why is 3/4 of 20 less than 20?', lines: { n: 2, key: '3/4 is less than one whole, so you only take part of the 20.' } },
          OF(4, 7, 63),
          { q: 'Write a story for 1/5 of 35.', lines: { n: 2, key: 'For example: {a} has 35 {many} and gives 1/5 of them to {b}. {b} gets 7.' } }]
      }
    },

    fit: {
      watch: 'expecting a smaller answer. Dividing by a fraction less than 1 gives a bigger answer, because many small pieces fit.',
      goal: 'I can divide a whole number by a fraction.',
      learn: {
        show: { pic: ['fbars', { rows: [[4, 12]] }], cap: '3 wholes cut in quarters', eq: ['3 ÷ 1/4 = 12'] },
        together: [{ pic: ['fbars', { rows: [[3, 6]] }], eq: ['2 ÷ 1/3 = []'], a: [6] }, DV(4, 1, 2)],
        cue: 'Cut each whole into pieces that size, then count the pieces.',
        own: [DV(5, 1, 3), DV(2, 1, 6), DV(6, 2, 3)]
      },
      p1: {
        show: { eq: ['2 ÷ 1/5: 5 fifths in each whole', '2 × 5 = 10'] },
        items: [DV(3, 1, 2), DV(4, 1, 5), DV(1, 1, 8), DV(6, 1, 4), DV(5, 1, 10), DV(7, 1, 3)]
      },
      p2: {
        items: [DV(4, 2, 3), DV(6, 3, 4), DV(3, 3, 5), DV(8, 2, 5),
          story('How many 1/4 h lessons fit in 3 h?', 'lessons', 12, '3 ÷ 1/4'),
          story('A 6 m rope is cut into pieces 2/3 m long. How many pieces?', 'pieces', 9, '6 ÷ 2/3')]
      },
      p3: {
        items: [DV(10, 5, 6), DV(9, 3, 8),
          story('{a} has 4 L of soup. Each bowl holds 2/5 L. How many bowls?', 'bowls', 10, '4 ÷ 2/5'),
          story('How many 3/4 cup scoops are in 6 cups of rice?', 'scoops', 8, '6 ÷ 3/4'),
          { eq: ['[] ÷ 1/3 = 15'], a: [5] }]
      },
      think: {
        items: [{ q: '{b} says 3 ÷ 1/2 = 1 1/2. What went wrong?', lines: { n: 3, key: 'That is 3 shared by 2. The question asks how many halves fit in 3: 6.' } },
          { q: 'Why is 4 ÷ 1/4 bigger than 4?', lines: { n: 2, key: 'Each whole holds 4 quarters, so 4 wholes hold 16 quarters.' } },
          DV(12, 3, 4),
          { q: 'Draw a picture for 2 ÷ 2/5.', draw: { h: 60, key: '2 bars in fifths, circled in pairs of fifths: 5 groups.' } }]
      }
    }
  } });
})();
