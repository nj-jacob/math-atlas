/* Grade 5 Fractions: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/fractions.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.3 represent fractions, including equivalent fractions, improper fractions and mixed numbers;
   B1.4 compare and order fractions; B2.5 add and subtract fractions with like denominators; B2.8 multiply and
   divide whole numbers by unit fractions. The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* fraction bars: name the shaded part (n of d) */
  function FB(n, d) { return { pic: ['fbars', { rows: [[d, n]] }], eq: ['[]'], a: [n + '/' + d] }; }
  /* a circle cut in d equal parts, n shaded */
  function PI(n, d) { return { pic: ['frac', { n: d, k: n, shape: 'circle' }], eq: ['[]'], a: [n + '/' + d] }; }
  /* an equivalent fraction: the new bottom is given (or, with top, the new top) */
  function EQ(n, d, m, top) { return top ? { eq: [n + '/' + d + ' = ' + n * m + '/[]'], a: [d * m] } : { eq: [n + '/' + d + ' = []/' + d * m], a: [n * m] }; }
  /* simplest form */
  function gcd(x, y) { return y ? gcd(y, x % y) : x; }
  function SF(n, d) { var g = gcd(n, d); return { eq: [n + '/' + d + ' = []'], a: [n / g + '/' + d / g], simplest: true }; }
  /* improper to mixed, and mixed to improper */
  function MX(n, d) { return { eq: [n + '/' + d + ' = [] []/' + d], a: [Math.floor(n / d), n % d] }; }
  function IM(w, r, d) { return { eq: [w + ' ' + r + '/' + d + ' = []/' + d], a: [w * d + r] }; }
  /* compare two fractions: circle the sign */
  function CMP(x, y) {
    var v = function (s) { var p = s.split('/'); return p[0] / p[1]; };
    return { eq: [x + ' ? ' + y], pick: { opts: ['<', '>', '='], ans: v(x) < v(y) ? 0 : v(x) > v(y) ? 1 : 2, cmp: [x, y] }, pickLast: true };
  }
  /* add or subtract with the same bottom */
  function AS(x, op, y, d) { return { eq: [x + '/' + d + ' ' + op + ' ' + y + '/' + d + ' = []/' + d], a: [op === '+' ? x + y : x - y] }; }
  /* groups of a unit fraction, and how many fit */
  function UT(k, d) { return { eq: [k + ' × 1/' + d + ' = []/' + d], a: [k] }; }
  function HM(w, d) { return { eq: [w + ' ÷ 1/' + d + ' = []'], a: [w * d] }; }
  /* a fraction out of 10, 100 or another bottom as a decimal and a percent */
  function FP(n, d) { var v = n / d; return { eq: [n + '/' + d + ' = []', n + '/' + d + ' = [] %'], a: [+v.toFixed(2), +(v * 100).toFixed(0)] }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }

  S.register('fractions', { code: 'FR', ideas: {

    equal: {
      watch: 'writing the parts not shaded, or naming unequal parts as a fraction. Ask: are the parts the same size? How many shaded out of how many in all?',
      goal: 'I can name a fraction of one whole.',
      learn: {
        show: { pic: ['fbars', { rows: [[8, 3]] }], cap: '3 of 8 equal parts', eq: ['3/8'] },
        together: [FB(2, 5), PI(3, 4)],
        cue: 'Bottom: how many equal parts. Top: how many shaded.',
        own: [FB(5, 6), PI(1, 3), FB(7, 10)]
      },
      p1: {
        show: { pic: ['frac', { n: 6, k: 4, shape: 'circle' }], cap: '4 of 6 equal parts', eq: ['4/6'] },
        items: [FB(3, 4), PI(2, 8), FB(1, 5), PI(5, 6), FB(4, 10)]
      },
      p2: {
        items: [FB(6, 8), PI(7, 8), FB(9, 12), PI(2, 3),
          { q: 'Shade 3/5 of the strip.', pic: ['fbars', { rows: [[5, 0]] }], draw: { h: 10, key: 'Shade any 3 of the 5 parts.' } },
          FB(3, 12)]
      },
      p3: {
        items: [story('A strip has 8 equal parts. 5 are shaded. What fraction is not shaded?', 'of the strip', '3/8', '8/8 − 5/8'),
          story('A {cont} has 10 {many}. 3 are sold. What fraction is left?', 'of the {many}', '7/10', '10/10 − 3/10'),
          story('A trail has 6 equal parts. {a} has walked 5 of them. What fraction of the trail is that?', 'of the trail', '5/6', '5/6'),
          story('A {cont} holds 12 {many}. 7 are gone. What fraction of the {cont} is gone?', 'of the {cont}', '7/12', '7/12'),
          { q: 'Which fraction has the biggest pieces?', pick: { opts: ['1/3', '1/6', '1/10'], ans: 0, big: true }, wide: true }]
      },
      think: {
        items: [{ q: '{b} cut a sandwich into 4 pieces and says each piece is 1/4. When is {b} wrong?', lines: { n: 3, key: 'When the 4 pieces are not the same size. Quarters must be 4 equal parts.' } },
          { q: 'Draw a strip and shade 2/3 of it.', draw: { h: 60, key: 'A strip cut into 3 equal parts with 2 shaded.' } },
          { q: 'Why does 1/8 have smaller pieces than 1/4?', lines: { n: 3, key: 'The whole is cut into more parts, so each part is smaller.' } },
          { q: 'Which is less?', pick: { opts: ['1/5', '1/2'], ans: 0, small: true }, wide: true }]
      }
    },

    names: {
      watch: 'copying the bottom number into the decimal (1/4 as 0.4 or 4%). Rewrite the fraction out of 100 first: 1/4 = 25/100.',
      goal: 'I can write a fraction as a decimal and a percent.',
      learn: {
        show: { pic: ['fbars', { rows: [[4, 1], [100, 25]] }], eq: ['1/4 = 25/100', '= 0.25 = 25%'] },
        together: [{ eq: ['1/2 = []/100'], a: [50] }, FP(3, 10)],
        cue: 'Make the bottom 100. Percent means out of 100.',
        own: [{ eq: ['3/4 = []/100'], a: [75] }, FP(2, 5)]
      },
      p1: {
        show: { eq: ['7/10 = 70/100', '= 0.7 = 70%'] },
        items: [FP(1, 10), FP(9, 10), FP(1, 2), FP(1, 4), FP(37, 100)]
      },
      p2: {
        items: [FP(3, 4), FP(1, 5), FP(4, 5), FP(3, 5), { eq: ['0.6 = []/10'], a: [6] }, { eq: ['45% = []/100'], a: [45] }]
      },
      p3: {
        items: [{ eq: ['[]/4 = 0.75'], a: [3] }, { eq: ['[]/5 = 40%'], a: [2] },
          { q: '{a} got 18 of 20 questions right.', eq: ['18/20 = []/100', '18/20 = [] %'], a: [90, 90] },
          { q: 'Which is the same as 1/4?', pick: { opts: ['0.4', '0.25', '4%'], ans: 1, val: 0.25 } },
          { q: 'Which is the odd one out?', pick: { opts: ['1/2', '0.5', '5%', '50%'], ans: 2, diff: true }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 1/5 = 0.5. What went wrong?', lines: { n: 3, key: '{b} copied the 5. 1/5 = 20/100, so it is 0.2 or 20%.' } },
          { q: 'A coin is worth 25¢. Why is it called a quarter?', lines: { n: 3, key: '25¢ is 25/100 of a dollar, which is 1/4 of a dollar.' } },
          { q: 'Find the missing number.', eq: ['3/5 = []%'], a: [60] },
          { q: 'Which is more?', pick: { opts: ['3/4', '70%'], ans: 0, big: true }, wide: true }]
      }
    },

    'same-size': {
      watch: 'adding the same number to the top and bottom (2/3 = 3/4). Only multiplying both by the same number keeps the size.',
      goal: 'I can find equivalent fractions.',
      learn: {
        show: { pic: ['fbars', { rows: [[4, 3], [8, 6]], labels: ['3/4', '6/8'] }], eq: ['3/4 = 6/8'] },
        together: [{ pic: ['fbars', { rows: [[3, 2], [6, 4]], labels: ['2/3', '?'] }], eq: ['2/3 = []/6'], a: [4] }, EQ(1, 2, 4)],
        cue: 'Multiply the top and the bottom by the same number.',
        own: [EQ(2, 5, 2), EQ(3, 4, 3), EQ(1, 3, 4, true)]
      },
      p1: {
        show: { pic: ['fbars', { rows: [[2, 1], [10, 5]], labels: ['1/2', '5/10'] }], eq: ['1/2 = 5/10'] },
        items: [{ pic: ['fbars', { rows: [[5, 1], [10, 2]], labels: ['1/5', '?'] }], eq: ['1/5 = []/10'], a: [2] },
          { pic: ['fbars', { rows: [[4, 1], [8, 2]], labels: ['1/4', '?'] }], eq: ['1/4 = []/8'], a: [2] },
          EQ(1, 3, 2), EQ(3, 5, 2), EQ(1, 4, 3)]
      },
      p2: {
        items: [EQ(2, 3, 4), EQ(5, 6, 2), EQ(3, 10, 10), EQ(4, 5, 3, true), EQ(7, 10, 2, true), EQ(3, 8, 3)]
      },
      p3: {
        items: [{ eq: ['1/2 = []/4 = []/8'], a: [2, 4], wide: true }, { eq: ['2/3 = []/6 = []/12'], a: [4, 8], wide: true },
          story('{a} ate 2/4 of a pizza. {b} ate the same amount of a pizza cut in 8 slices. How many slices?', 'slices', 4, '2 × 8 / 4'),
          { q: 'Which is equal to 3/4?', pick: { opts: ['4/5', '6/8', '3/8'], ans: 1, val: 0.75 } },
          { q: 'Which is not equal to 1/2?', pick: { opts: ['3/6', '5/10', '4/6'], ans: 2, diff: true }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 2/3 = 3/4 because 1 was added to the top and the bottom. Is {b} right?', lines: { n: 3, key: 'No. 2/3 = 8/12 and 3/4 = 9/12, so 3/4 is more. Adding changes the size; only multiplying keeps it.' } },
          { q: 'Write three fractions equal to 1/3.', lines: { n: 1, key: '2/6, 3/9, 4/12 (any with the bottom 3 times the top).' } },
          { q: 'Find the missing number.', eq: ['4/5 = []/100'], a: [80] },
          { q: 'Which is equal to 2/5?', pick: { opts: ['4/10', '4/7', '2/10'], ans: 0, val: 0.4 }, wide: true }]
      }
    },

    simplest: {
      watch: 'stopping too early (8/12 = 4/6) or subtracting from the top and bottom. Keep dividing until only 1 divides both.',
      goal: 'I can write a fraction in simplest form.',
      learn: {
        show: { pic: ['fbars', { rows: [[8, 6], [4, 3]], labels: ['6/8', '3/4'] }], cap: '6 ÷ 2 = 3 and 8 ÷ 2 = 4', eq: ['6/8 = 3/4'] },
        together: [{ pic: ['fbars', { rows: [[10, 4], [5, 2]], labels: ['4/10', '?'] }], eq: ['4/10 = []/5'], a: [2] }, SF(3, 9)],
        cue: 'Divide the top and the bottom by the same number. Stop when only 1 divides both.',
        own: [SF(2, 8), SF(6, 10), SF(8, 12)]
      },
      p1: {
        show: { eq: ['9/12', '9 ÷ 3 = 3', '12 ÷ 3 = 4', '9/12 = 3/4'] },
        items: [SF(5, 10), SF(4, 6), SF(2, 10), SF(3, 12), SF(6, 9)]
      },
      p2: {
        items: [SF(8, 10), SF(9, 12), SF(10, 12), SF(4, 12), SF(6, 8), SF(12, 16)]
      },
      p3: {
        items: [SF(15, 20), SF(18, 24), SF(25, 100), SF(20, 30),
          { q: 'Which is in simplest form?', pick: { opts: ['4/8', '3/5', '6/9'], ans: 1, simplest: true }, wide: true }]
      },
      think: {
        items: [{ q: '{b} wrote 8/12 = 4/6 in simplest form. What would you tell {b}?', lines: { n: 3, key: '4 and 6 can both still be divided by 2. 4/6 = 2/3, which is simplest.' } },
          { q: 'Why does 6/8 = 3/4 not change the size?', lines: { n: 3, key: 'Each pair of eighths joins into one quarter. The same length is shaded.' } },
          SF(16, 20),
          { q: 'Which is in simplest form?', pick: { opts: ['8/12', '4/6', '2/3'], ans: 2, simplest: true }, wide: true }]
      }
    },

    improper: {
      watch: 'changing the bottom of the leftover part (7/3 = 2 1/7). The leftover pieces are still thirds.',
      goal: 'I can write improper fractions as mixed numbers and back.',
      learn: {
        show: { pic: ['fbars', { rows: [[4, 11]] }], cap: '2 wholes and 3 quarters', eq: ['11/4 = 2 3/4'] },
        together: [{ pic: ['fbars', { rows: [[3, 7]] }], eq: ['7/3 = [] []/3'], a: [2, 1] }, IM(1, 2, 5)],
        cue: 'Improper to mixed: divide. Mixed to improper: wholes × bottom + top.',
        own: [MX(9, 4), MX(11, 5), IM(2, 1, 3)]
      },
      p1: {
        show: { eq: ['13/5', '13 ÷ 5 = 2 R 3', '13/5 = 2 3/5'] },
        items: [{ pic: ['fbars', { rows: [[2, 5]] }], eq: ['5/2 = [] []/2'], a: [2, 1] },
          { pic: ['fbars', { rows: [[6, 8]] }], eq: ['8/6 = [] []/6'], a: [1, 2] },
          MX(7, 4), MX(10, 3), MX(9, 8)]
      },
      p2: {
        items: [MX(17, 5), MX(13, 6), MX(23, 10), IM(1, 3, 4), IM(3, 2, 5), IM(4, 1, 2)]
      },
      p3: {
        items: [IM(2, 5, 8), IM(5, 3, 10), MX(29, 8),
          story('{a} pours 9 scoops of 1/2 cup of flour. How many cups is that?', 'cups', '4 1/2', '9 × 1/2'),
          { q: 'Which is more than 2?', pick: { opts: ['7/4', '9/4', '8/5'], ans: 1, big: true }, wide: true }]
      },
      think: {
        items: [{ q: '{b} wrote 7/3 = 2 1/7. What went wrong?', lines: { n: 3, key: 'The leftover piece is still a third. 7/3 = 2 1/3.' } },
          { q: 'Mark 5/4 on the number line.', pic: ['dline', { min: 0, max: 2, d: 4, show: 'ends' }], draw: { h: 6, key: 'The point one quarter past 1.' }, wide: true },
          { q: 'How many quarters are in 3 1/4?', eq: ['3 1/4 = []/4'], a: [13] },
          { q: 'Which is equal to 1 1/2?', pick: { opts: ['3/2', '1/2', '11/2'], ans: 0, val: 1.5 }, wide: true }]
      }
    },

    pieces: {
      watch: 'thinking 1/8 is more than 1/4 because 8 is more than 4. More parts means smaller parts.',
      goal: 'I can compare fractions with the same bottom or the same top.',
      learn: {
        show: { pic: ['fbars', { rows: [[3, 1], [5, 1]], labels: ['1/3', '1/5'] }], cap: 'thirds are bigger pieces', eq: ['1/3 > 1/5'] },
        together: [CMP('5/8', '3/8'), CMP('2/3', '2/6')],
        cue: 'Same bottom: bigger top is bigger. Same top: smaller bottom is bigger.',
        own: [CMP('4/10', '7/10'), CMP('1/4', '1/8'), CMP('3/5', '3/4')]
      },
      p1: {
        show: { pic: ['fbars', { rows: [[6, 5], [6, 2]], labels: ['5/6', '2/6'] }], eq: ['5/6 > 2/6'] },
        items: [CMP('2/5', '4/5'), CMP('1/2', '1/3'), CMP('7/8', '5/8'), CMP('1/10', '1/6'), CMP('3/4', '3/4')]
      },
      p2: {
        items: [CMP('2/3', '2/5'), CMP('5/12', '7/12'), CMP('4/6', '4/10'), CMP('9/10', '6/10'),
          { q: 'Least to greatest: 3/8, 7/8, 1/8', eq: ['[] < [] < []'], a: ['1/8', '3/8', '7/8'], set: ['3/8', '7/8', '1/8'], wide: true },
          { q: 'Least to greatest: 1/2, 1/6, 1/3', eq: ['[] < [] < []'], a: ['1/6', '1/3', '1/2'], set: ['1/2', '1/6', '1/3'], wide: true }]
      },
      p3: {
        items: [{ q: 'Greatest to least: 2/5, 2/3, 2/9', eq: ['[] > [] > []'], a: ['2/3', '2/5', '2/9'], set: ['2/5', '2/3', '2/9'], wide: true },
          { q: '{a} ate 1/4 of a bannock. {b} ate 1/6 of the same size bannock. Who ate more?', pick: { opts: ['{a}', '{b}'], ans: 0, more: ['1/4', '1/6'] } },
          { q: 'Which is the greatest?', pick: { opts: ['3/7', '5/7', '4/7'], ans: 1, big: true } },
          { q: 'Which is the least?', pick: { opts: ['1/5', '1/12', '1/8'], ans: 1, small: true } },
          CMP('5/9', '5/6')]
      },
      think: {
        items: [{ q: '{b} says 1/8 > 1/4 because 8 > 4. Draw to show {b} is wrong.', draw: { h: 70, key: 'Two strips the same length: one cut in 4, one cut in 8. One quarter is twice one eighth.' } },
          { q: 'Why does a smaller bottom mean bigger pieces?', lines: { n: 3, key: 'The whole is cut into fewer parts, so each part is bigger.' } },
          { q: 'Write a fraction with a top of 3 that is less than 3/5.', lines: { n: 1, key: 'Any 3 over a number bigger than 5, such as 3/8.' } },
          { q: 'Which is more?', pick: { opts: ['6/7', '6/11'], ans: 0, big: true }, wide: true }]
      }
    },

    common: {
      watch: 'comparing only the tops (5/8 > 3/4 because 5 > 3). Make the bottoms match first.',
      goal: 'I can compare fractions by making the bottoms match.',
      learn: {
        show: { pic: ['fbars', { rows: [[8, 5], [8, 6]], labels: ['5/8', '3/4'] }], eq: ['3/4 = 6/8', '6/8 > 5/8'] },
        together: [{ eq: ['2/3 = []/6'], a: [4] }, CMP('2/3', '5/6')],
        cue: 'Rewrite one fraction so the bottoms match. Then compare the tops.',
        own: [CMP('1/2', '3/8'), CMP('3/5', '7/10'), CMP('2/4', '4/8')]
      },
      p1: {
        show: { eq: ['1/2 or 3/5?', '1/2 = 5/10, 3/5 = 6/10', '1/2 < 3/5'] },
        items: [CMP('3/4', '5/8'), CMP('1/3', '2/6'), CMP('7/10', '1/2'), CMP('2/3', '7/12'), CMP('3/4', '7/8')]
      },
      p2: {
        items: [CMP('3/5', '1/2'), CMP('5/6', '3/4'), CMP('2/3', '3/4'), CMP('4/10', '2/5'),
          { q: 'Least to greatest: 3/4, 1/2, 5/8', eq: ['[] < [] < []'], a: ['1/2', '5/8', '3/4'], set: ['3/4', '1/2', '5/8'], wide: true },
          { q: 'Least to greatest: 2/3, 5/6, 1/2', eq: ['[] < [] < []'], a: ['1/2', '2/3', '5/6'], set: ['2/3', '5/6', '1/2'], wide: true }]
      },
      p3: {
        items: [{ q: 'Greatest to least: 3/10, 2/5, 1/2', eq: ['[] > [] > []'], a: ['1/2', '2/5', '3/10'], set: ['3/10', '2/5', '1/2'], wide: true },
          { q: 'Least to greatest: 7/12, 1/3, 3/4, 1/2', eq: ['[] < [] < [] < []'], a: ['1/3', '1/2', '7/12', '3/4'], set: ['7/12', '1/3', '3/4', '1/2'], wide: true },
          { q: '{a} paddled 3/4 of the lake. {b} paddled 5/8. Who paddled farther?', pick: { opts: ['{a}', '{b}'], ans: 0, more: ['3/4', '5/8'] } },
          { q: 'Which is more than 1/2?', pick: { opts: ['3/8', '5/8', '2/5'], ans: 1, big: true } },
          CMP('5/12', '1/3')]
      },
      think: {
        items: [{ q: '{b} says 5/8 > 3/4 because 5 > 3. What would you tell {b}?', lines: { n: 3, key: '3/4 = 6/8, and 6/8 > 5/8. The pieces were different sizes.' } },
          { q: 'Compare 3/8 and 4/6 using 1/2.', lines: { n: 3, key: '3/8 is less than 4/8, a half. 4/6 is more than 3/6, a half. So 3/8 < 4/6.' } },
          { q: 'One line is 5/8 and one is 3/4. Write each where it belongs.', pic: ['dline', { min: 0, max: 1, d: 8, show: 'ends', ask: [0.625, 0.75] }], a: ['5/8', '3/4'], wide: true },
          { q: 'Which is more?', pick: { opts: ['4/5', '7/10'], ans: 0, big: true }, wide: true }]
      }
    },

    like: {
      watch: 'adding the bottoms too (1/4 + 2/4 = 3/8). The pieces stay the same size, so the bottom stays.',
      goal: 'I can add and subtract fractions with the same bottom.',
      learn: {
        show: { pic: ['fbars', { rows: [[8, 7]] }], cap: '3 eighths and 4 more eighths', eq: ['3/8 + 4/8 = 7/8'] },
        together: [AS(1, '+', 3, 5), AS(5, '−', 4, 6)],
        cue: 'Add or subtract the tops. Keep the bottom.',
        own: [AS(2, '+', 5, 10), AS(7, '−', 3, 8), AS(1, '+', 1, 4)]
      },
      p1: {
        show: { eq: ['2 sixths + 3 sixths = 5 sixths', '2/6 + 3/6 = 5/6'] },
        items: [AS(1, '+', 2, 4), AS(3, '+', 4, 10), AS(4, '−', 1, 5), AS(5, '+', 2, 8), AS(9, '−', 6, 10)]
      },
      p2: {
        items: [AS(3, '+', 5, 12), AS(7, '−', 2, 9), AS(4, '+', 3, 6), AS(5, '−', 5, 8), AS(2, '+', 6, 8), AS(11, '−', 4, 12)]
      },
      p3: {
        items: [{ eq: ['3/5 + []/5 = 1'], a: [2] }, { eq: ['1 − 3/8 = []/8'], a: [5] },
          story('{a} walked 3/10 km before lunch and 4/10 km after. How far in all?', 'km', '7/10', '3/10 + 4/10'),
          story('A jug held 5/6 L of maple syrup. {b} poured out 2/6 L. How much is left?', 'L', '3/6', '5/6 − 2/6'),
          { q: 'Which makes one whole?', pick: { opts: ['2/7 + 4/7', '3/7 + 4/7', '5/7 + 1/7'], ans: 1, val: 1 }, wide: true }]
      },
      think: {
        items: [{ q: '{b} wrote 1/4 + 2/4 = 3/8. What went wrong?', lines: { n: 3, key: '{b} added the bottoms. 1 quarter + 2 quarters = 3 quarters, so 3/4.' } },
          { q: 'Write two fractions with the same bottom that add to 4/5.', lines: { n: 1, key: '1/5 + 3/5, or 2/5 + 2/5.' } },
          { q: 'Find the missing number.', eq: ['[]/9 − 4/9 = 2/9'], a: [6] },
          { q: 'Which is more?', pick: { opts: ['2/8 + 3/8', '7/8 − 1/8'], ans: 1, big: true }, wide: true }]
      }
    },

    times: {
      watch: 'multiplying the bottom too (3 × 1/4 = 3/12). 3 groups of one quarter is 3 quarters.',
      goal: 'I can multiply a whole number by a unit fraction.',
      learn: {
        show: { pic: ['fbars', { rows: [[3, 5]] }], cap: '5 pieces, each one third', eq: ['5 × 1/3 = 5/3'] },
        together: [UT(3, 4), { eq: ['7 × 1/4 = []/4 = [] []/4'], a: [7, 1, 3], wide: true }],
        cue: 'The whole number becomes the top. The bottom stays.',
        own: [UT(2, 5), UT(4, 10), UT(5, 6)]
      },
      p1: {
        show: { pic: ['fbars', { rows: [[8, 3]] }], cap: '3 groups of 1/8', eq: ['3 × 1/8 = 3/8'] },
        items: [UT(2, 3), UT(4, 5), UT(6, 8), UT(3, 10), UT(5, 12)]
      },
      p2: {
        items: [UT(7, 3), UT(9, 4), UT(6, 5), { eq: ['5 × 1/2 = [] []/2'], a: [2, 1] }, { eq: ['10 × 1/4 = [] []/4'], a: [2, 2] }, { eq: ['8 × 1/8 = []'], a: [1] }]
      },
      p3: {
        items: [{ eq: ['[] × 1/6 = 5/6'], a: [5] }, { eq: ['4 × 1/[] = 4/9'], a: [9] },
          story('{a} eats 1/4 of a {one} each day for 3 days. How much is that?', '{one}', '3/4', '3 × 1/4'),
          story('Each lap of the rink is 1/10 km. {b} skates 7 laps. How far is that?', 'km', '7/10', '7 × 1/10'),
          { q: 'Which is equal to 6 × 1/3?', pick: { opts: ['6/18', '2', '1/2'], ans: 1, val: 2 } }]
      },
      think: {
        items: [{ q: '{b} wrote 3 × 1/4 = 3/12. What went wrong?', lines: { n: 3, key: '{b} multiplied the bottom too. 3 groups of one quarter is 3 quarters: 3/4.' } },
          { q: 'Draw 4 × 1/3 on strips.', draw: { h: 60, key: 'Strips in thirds: one whole and one more third shaded, 4/3 = 1 1/3.' } },
          { q: 'How many groups of 1/5 make 2 wholes?', eq: ['[] × 1/5 = 2'], a: [10] },
          { q: 'Which is more than 1?', pick: { opts: ['3 × 1/4', '5 × 1/4'], ans: 1, big: true }, wide: true }]
      }
    },

    divide: {
      watch: 'expecting division to make the answer smaller (3 ÷ 1/4 = 3/4). Ask how many quarters fit in 3.',
      goal: 'I can divide a whole number by a unit fraction.',
      learn: {
        show: { pic: ['fbars', { rows: [[4, 12]] }], cap: '12 quarters fit in 3 wholes', eq: ['3 ÷ 1/4 = 12'] },
        together: [{ pic: ['fbars', { rows: [[5, 10]] }], eq: ['2 ÷ 1/5 = []'], a: [10] }, HM(2, 3)],
        cue: 'How many pieces fit? Each whole holds as many pieces as the bottom number.',
        own: [HM(3, 2), HM(1, 6), HM(4, 3)]
      },
      p1: {
        show: { pic: ['fbars', { rows: [[3, 6]] }], cap: '3 thirds in each whole', eq: ['2 ÷ 1/3 = 6'] },
        items: [{ pic: ['fbars', { rows: [[2, 6]] }], eq: ['3 ÷ 1/2 = []'], a: [6] }, { pic: ['fbars', { rows: [[4, 8]] }], eq: ['2 ÷ 1/4 = []'], a: [8] },
          HM(1, 5), HM(4, 2), HM(3, 3)]
      },
      p2: {
        items: [HM(5, 4), HM(2, 8), HM(6, 3), HM(3, 10), HM(7, 2), HM(4, 6)]
      },
      p3: {
        items: [{ eq: ['[] ÷ 1/4 = 20'], a: [5] }, { eq: ['6 ÷ 1/[] = 30'], a: [5] },
          story('{a} cuts 4 m of ribbon into pieces 1/3 m long. How many pieces?', 'pieces', 12, '4 ÷ 1/3'),
          story('Each {cont} holds 1/2 L. How many can {b} fill from 5 L?', '{conts}', 10, '5 ÷ 1/2'),
          { q: 'Which gives the biggest answer?', pick: { opts: ['2 ÷ 1/2', '2 ÷ 1/4', '2 ÷ 1/3'], ans: 1, big: true } }]
      },
      think: {
        items: [{ q: '{b} wrote 3 ÷ 1/4 = 3/4. What went wrong?', lines: { n: 3, key: '3 ÷ 1/4 asks how many quarters fit in 3. Each whole holds 4, so 12.' } },
          { q: 'Why does dividing by 1/4 give a bigger number?', lines: { n: 3, key: 'Quarters are small pieces, so many of them fit. Each whole holds 4 of them.' } },
          { q: 'Find the missing number.', eq: ['2 ÷ 1/6 = []'], a: [12] },
          { q: 'Which is more?', pick: { opts: ['4 ÷ 1/2', '4 × 1/2'], ans: 0, big: true }, wide: true }]
      }
    }
  } });
})();
