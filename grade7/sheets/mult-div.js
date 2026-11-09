/* Grade 7 Multiplying and Dividing: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/mult-div.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.6 round decimals to the nearest tenth, hundredth or whole number; B2.1 the order of operations and
   multi-step problems; B2.8 multiply and divide fractions by fractions; B2.9 multiply and divide decimals by decimals.
   The answer checks are in tests/verify/sheets.js: every sum is worked out again (in the order of operations), a rounded
   number must be the nearest one, an estimate must be the closest choice, and a story's answer follows from its numbers. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }
  function R(s) { var m = String(s).match(/^(?:(\d+) )?(\d+)\/(\d+)$/); return m ? [(+(m[1] || 0)) * +m[3] + +m[2], +m[3]] : [+s, 1]; }
  function str(r) { var g = gcd(r[0], r[1]), n = r[0] / g, d = r[1] / g; return d === 1 ? String(n) : n > d ? Math.floor(n / d) + ' ' + n % d + '/' + d : n + '/' + d; }
  function mul(x, y) { var a = R(x), b = R(y); return str([a[0] * b[0], a[1] * b[1]]); }
  function div(x, y) { var a = R(x), b = R(y); return str([a[0] * b[1], a[1] * b[0]]); }
  function flip(x) { var a = R(x); return str([a[1], a[0]]); }
  /* a decimal worked out exactly (to 6 places), so 0.1 × 0.2 is 0.02 */
  function D(x) { return +x.toFixed(6); }
  /* round n to the nearest `to` (1, 0.1 or 0.01) */
  function RD(n, to) { return { q: 'To the nearest ' + (to === 1 ? 'whole number' : to === 0.1 ? 'tenth' : 'hundredth') + ':', eq: [n + ' ≈ []'], a: [D(Math.round(n / to) * to)], round: to }; }
  /* which is it closer to? on a number line in tenths or hundredths */
  function NEAR(pt, lo, hi, d) { return { q: 'Which is it closer to?', pic: ['dline', { min: lo, max: hi, d: d, show: 'ends', pt: pt }], pick: { opts: [String(lo), String(hi)], ans: pt - lo < hi - pt ? 0 : 1, near: true } }; }
  /* fractions: × and ÷, the answer in simplest form */
  function FM(x, y) { return { eq: [x + ' × ' + y + ' = []'], a: [mul(x, y)], simplest: true }; }
  function FD(x, y) { return { eq: [x + ' ÷ ' + y + ' = []'], a: [div(x, y)], simplest: true }; }
  function FR(x, y) { return { eq: [x + ' ÷ ' + y + ' = ' + x + ' × [] = []'], a: [flip(y), div(x, y)], simplest: true, wide: true }; }
  /* decimals: × and ÷ */
  function DM(x, y) { return { eq: [x + ' × ' + y + ' = []'], a: [D(x * y)] }; }
  function DD(x, y) { return { eq: [x + ' ÷ ' + y + ' = []'], a: [D(x / y)] }; }
  /* tenths times tenths on a hundred grid: the shaded overlap is the answer */
  function GR(x, y) { return { pic: ['grid', { n: Math.round(x * y * 100), rect: [x * 10, y * 10], unit: '0.01', quiet: true, u: 8 }], eq: [x + ' × ' + y + ' = []'], a: [D(x * y)] }; }
  /* make the divisor whole: × 10 or × 100 on both, then divide */
  function SH(x, y, k) { return { eq: [x + ' ÷ ' + y + ' = ' + D(x * k) + ' ÷ [] = []'], a: [D(y * k), D(x / y)], wide: true }; }
  /* order of operations */
  function OO(e, v) { return { eq: [e + ' = []'], a: [v] }; }
  function story(q, unit, ans, calc, more) { var it = { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; return more ? Object.assign(it, more) : it; }
  /* the closest estimate */
  function EST(x, op, y, opts, ans) { return { q: 'Estimate ' + x + ' ' + op + ' ' + y + '.', pick: { opts: opts, ans: ans, est: x + ' ' + op + ' ' + y } }; }

  S.register('mult-div', { code: 'MD', ideas: {

    closer: {
      watch: 'rounding by the last digit only. Look at which mark the number is nearer: 3.46 is nearer 3.5 than 3.4.',
      goal: 'I can round a decimal by seeing which number it is closer to.',
      learn: {
        show: { pic: ['dline', { min: 3.4, max: 3.5, d: 100, show: 'ends', pt: 3.46 }], cap: '3.46 is past halfway (3.45)', eq: ['3.46 ≈ 3.5'] },
        together: [NEAR(2.3, 2, 3, 10), NEAR(0.58, 0.5, 0.6, 100)],
        cue: 'Find the halfway point. Past halfway rounds up.',
        own: [NEAR(7.8, 7, 8, 10), NEAR(1.32, 1.3, 1.4, 100)]
      },
      p1: {
        show: { pic: ['dline', { min: 6, max: 7, d: 10, show: 'ends', pt: 6.7 }], eq: ['6.7 ≈ 7'] },
        items: [NEAR(5.1, 5, 6, 10), NEAR(9.6, 9, 10, 10), NEAR(2.74, 2.7, 2.8, 100), NEAR(0.43, 0.4, 0.5, 100), RD(8.2, 1), RD(3.67, 0.1)]
      },
      p2: {
        items: [RD(12.8, 1), RD(0.36, 0.1), RD(5.92, 0.1), RD(7.48, 1), RD(4.071, 0.01), RD(0.255, 0.1)]
      },
      p3: {
        items: [RD(19.95, 1), RD(2.049, 0.1), RD(0.996, 0.01),
          { q: 'A pencil is 14.7 cm long. To the nearest centimetre, how long is it?', eq: ['14.7 ≈ [] cm'], a: [15], round: 1, wide: true },
          { q: 'Which rounds to 6.4 (nearest tenth)?', pick: { opts: ['6.34', '6.46', '6.38'], ans: 2, round: { to: 0.1, val: 6.4 } } }]
      },
      think: {
        items: [{ q: '{b} rounds 2.48 to the nearest whole and gets 3, because 8 rounds up. What went wrong?', lines: { n: 3, key: 'To the nearest whole, look at the tenths: 4 is under 5, so 2.48 ≈ 2. 2.48 is nearer 2 than 3.' } },
          { q: 'Give a number that rounds to 5.0 to the nearest tenth but is not 5.', lines: { n: 1, key: 'For example 4.97 or 5.02.' } },
          NEAR(0.73, 0.7, 0.8, 100),
          { q: 'Why does 0.75 round up to 0.8?', lines: { n: 2, key: 'It is exactly halfway, and halfway rounds up.' } }]
      }
    },

    digit: {
      watch: 'looking at the wrong digit. To round to tenths, look at the hundredths digit only: 5 or more rounds up.',
      goal: 'I can round to a place by looking at the next digit.',
      learn: {
        show: { cap: 'hundredths digit 7: round up', eq: ['8.274 to tenths', '8.274 ≈ 8.3'] },
        together: [RD(6.381, 0.1), RD(6.381, 0.01)],
        cue: 'Look one place to the right: 5 or more rounds up.',
        own: [RD(2.649, 0.1), RD(2.649, 1), RD(0.8125, 0.01), RD(14.53, 1)]
      },
      p1: {
        show: { cap: 'thousandths digit 2: keep', eq: ['3.142 to hundredths', '3.142 ≈ 3.14'] },
        items: [RD(4.36, 0.1), RD(7.712, 0.01), RD(9.5, 1), RD(0.247, 0.1), RD(1.053, 0.01), RD(23.49, 1)]
      },
      p2: {
        items: [RD(5.968, 0.01), RD(5.968, 0.1), RD(5.968, 1), RD(0.0349, 0.01), RD(99.96, 0.1), RD(12.704, 0.1)]
      },
      p3: {
        items: [{ q: 'A runner finished in 12.468 s. Round to the hundredth.', eq: ['12.468 ≈ [] s'], a: [12.47], round: 0.01 },
          { q: 'Gas costs $1.579 per litre. Round to the nearest cent.', eq: ['$1.579 ≈ $ []'], a: [1.58], round: 0.01 },
          RD(0.0951, 0.01), RD(199.96, 0.1),
          { q: 'Which rounds to 3.25 (nearest hundredth)?', pick: { opts: ['3.244', '3.252', '3.256'], ans: 1, round: { to: 0.01, val: 3.25 } }, wide: true }]
      },
      think: {
        items: [{ q: '{b} rounds 4.96 to the nearest tenth and writes 4.10. What went wrong?', lines: { n: 3, key: 'Rounding 9 tenths up makes 10 tenths, which is 1 whole: 4.96 ≈ 5.0.' } },
          { q: 'Why might a store round $2.995 to $3.00?', lines: { n: 2, key: 'Money is in cents (hundredths), and the thousandths digit 5 rounds up.' } },
          RD(7.0449, 0.01),
          { q: 'Round 6.45 to the nearest whole. Then round 6.45 to the nearest tenth first, then to the whole. Same?', lines: { n: 3, key: '6.45 ≈ 6. But 6.45 ≈ 6.5 ≈ 7. Not the same: round once, from the original.' } }]
      }
    },

    of: {
      watch: 'adding the fractions. 1/2 of 3/4 means 1/2 × 3/4 = 3/8, a smaller amount.',
      goal: 'I can find a fraction of a fraction.',
      learn: {
        show: { pic: ['fbars', { rows: [[4, 3], [8, 3]] }], cap: 'half of each quarter is an eighth', eq: ['1/2 of 3/4 = 3/8'] },
        together: [FM('1/2', '1/4'), FM('1/3', '3/5')],
        cue: 'Of means times.',
        own: [FM('1/2', '2/3'), FM('1/4', '1/2'), FM('2/3', '1/2'), FM('1/3', '3/4')]
      },
      p1: {
        show: { eq: ['1/3 of 1/2 = 1/3 × 1/2', '= 1/6'] },
        items: [FM('1/2', '1/3'), FM('1/4', '1/4'), FM('1/2', '4/5'), FM('1/3', '6/7'), FM('3/4', '1/3'), FM('1/5', '1/2')]
      },
      p2: {
        items: [story('{a} has 3/4 of a pizza and eats 1/2 of it. What fraction of the whole pizza is that?', '', '3/8', '1/2 × 3/4', { simplest: true, wide: true }),
          story('2/3 of a garden is vegetables. 1/4 of the vegetables are carrots. What fraction of the garden is carrots?', '', '1/6', '1/4 × 2/3', { simplest: true, wide: true }),
          FM('2/5', '1/2'), FM('3/8', '2/3'), FM('1/6', '3/4'), FM('5/6', '3/5')]
      },
      p3: {
        items: [story('3/5 of a class walks to school. 2/3 of those walkers live south of the school. What fraction of the class is that?', '', '2/5', '2/3 × 3/5', { simplest: true, wide: true }),
          story('A {cont} is 7/8 full. {b} uses 1/2 of what is in it. What fraction of the {cont} was used?', '', '7/16', '1/2 × 7/8', { simplest: true, wide: true }),
          FM('4/9', '3/8'), FM('5/12', '6/7')]
      },
      think: {
        items: [{ q: '{b} says 1/2 of 1/4 is 3/4. What went wrong?', lines: { n: 3, key: '{b} added. Half of a quarter is smaller: 1/2 × 1/4 = 1/8.' } },
          { q: 'Draw a picture to show 1/3 of 1/2.', draw: { h: 60, key: 'A bar cut in halves; one half cut in 3: one piece is 1/6 of the bar.' } },
          FM('2/3', '9/10'),
          { q: 'Why is a fraction of a fraction (less than 1) always smaller than both?', lines: { n: 2, key: 'Taking part of something that is already part leaves less than either.' } }]
      }
    },

    rule: {
      watch: 'finding a common denominator first. To multiply, just multiply tops and bottoms, then simplify.',
      goal: 'I can multiply fractions by multiplying tops and bottoms.',
      learn: {
        show: { cap: 'tops 2 × 3, bottoms 5 × 4', eq: ['2/5 × 3/4 = 6/20', '= 3/10'] },
        together: [FM('3/4', '2/7'), FM('5/6', '3/10')],
        cue: 'Tops times tops, bottoms times bottoms, then simplify.',
        own: [FM('2/3', '4/5'), FM('3/8', '4/9'), FM('7/10', '5/7'), FM('1 1/2', '2/3')]
      },
      p1: {
        show: { cap: 'simplify 8/24', eq: ['2/3 × 4/8 = 8/24 = 1/3'] },
        items: [FM('2/5', '2/3'), FM('3/4', '4/5'), FM('5/8', '2/5'), FM('4/7', '7/8'), FM('9/10', '2/3'), FM('3/5', '5/6')]
      },
      p2: {
        items: [FM('6/7', '14/15'), FM('8/9', '3/4'), FM('5/12', '9/10'), FM('2 1/2', '3/5'), FM('1 1/3', '3/8'), FM('2 2/3', '1 1/2')]
      },
      p3: {
        items: [story('A recipe needs 2/3 cup of sugar. {a} makes 1 1/2 batches. How much sugar?', 'cups', '1', '2/3 × 1 1/2', { simplest: true, wide: true }),
          story('A field is 3/4 km by 2/5 km. What is its area?', 'km²', '3/10', '3/4 × 2/5', { simplest: true, wide: true }),
          FM('3 1/3', '9/10'), FM('4/5', '2 1/4')]
      },
      think: {
        items: [{ q: '{b} wrote 2/3 × 3/5 = 6/15 and stopped. Is it finished?', lines: { n: 2, key: 'It is right but not simplest: 6/15 = 2/5.' } },
          { q: 'Show a shortcut: simplify before you multiply 4/9 × 3/8.', lines: { n: 3, key: '4 and 8 share 4; 3 and 9 share 3: 1/3 × 1/2 = 1/6.' } },
          FM('15/16', '8/25'),
          { q: 'Multiply a fraction by 1 1/2. Is the answer bigger or smaller? Why?', lines: { n: 2, key: 'Bigger: times a number more than 1 makes it bigger.' } }]
      }
    },

    ofwhole: {
      watch: 'dividing by the top instead of the bottom. 3/4 of 20: 20 ÷ 4 = 5, then 5 × 3 = 15.',
      goal: 'I can find a fraction of an amount.',
      learn: {
        show: { pic: ['groups', { g: 4, k: 5 }], cap: '20 in 4 equal groups, take 3', eq: ['3/4 × 20 = 15'] },
        together: [{ pic: ['groups', { g: 3, k: 4 }], eq: ['2/3 × 12 = []'], a: [8] }, OO('3/5 × 40', 24)],
        cue: 'Divide by the bottom, then multiply by the top.',
        own: [OO('1/4 × 36', 9), OO('5/6 × 30', 25), OO('3/8 × 64', 24), OO('7/10 × 150', 105)]
      },
      p1: {
        show: { cap: '45 ÷ 9 = 5, then 5 × 2', eq: ['2/9 × 45 = 10'] },
        items: [OO('1/3 × 27', 9), OO('3/4 × 48', 36), OO('2/5 × 35', 14), OO('5/8 × 72', 45), OO('4/7 × 63', 36), OO('9/10 × 90', 81)]
      },
      p2: {
        items: [story('A $60 jacket is 1/4 off. How many dollars off?', 'dollars', 15, '1/4 × 60'),
          story('{a} read 2/3 of a 240-page book. How many pages?', 'pages', 160, '2/3 × 240'),
          story('5/6 of 42 students came to the game. How many came?', 'students', 35, '5/6 × 42'),
          story('3/8 of 2 400 people bought tickets online. How many?', 'people', 900, '3/8 × 2400'),
          OO('2/3 × 4.5', 3), OO('3/4 × 1.2', 0.9)]
      },
      p3: {
        items: [story('A 250 g bag of {many} is 3/5 full. How many grams are in it?', 'g', 150, '3/5 × 250'),
          story('{b} earned $84 and saved 3/7 of it. How much did {b} spend?', 'dollars', 48, '84 − 3/7 × 84'),
          { eq: ['3/4 × [] = 18'], a: [24] }, { eq: ['2/5 × [] = 30'], a: [75] },
          story('A trail is 18 km. {a} has walked 5/9 of it. How far is left?', 'km', 8, '18 − 5/9 × 18')]
      },
      think: {
        items: [{ q: '{b} found 3/4 of 20 by doing 20 ÷ 3 × 4. What went wrong?', lines: { n: 3, key: 'Divide by the bottom (4) and multiply by the top (3): 20 ÷ 4 × 3 = 15.' } },
          { q: 'Show 2/3 of 18 with a picture.', draw: { h: 60, key: ['groups', { g: 3, k: 6 }] } },
          OO('7/12 × 96', 56),
          { q: 'If 3/4 of a number is 30, what is the number? Explain.', lines: { n: 2, key: '30 ÷ 3 = 10 for each quarter, so 4 quarters make 40.' } }]
      }
    },

    fit: {
      watch: 'thinking division always makes smaller. 3 ÷ 1/4 = 12: twelve quarters fit in 3.',
      goal: 'I can divide by a fraction by asking how many fit.',
      learn: {
        show: { pic: ['fbars', { rows: [[4, 4], [4, 4], [4, 4]] }], cap: '4 quarters in each whole', eq: ['3 ÷ 1/4 = 12'] },
        together: [FD('2', '1/3'), FD('1', '1/5')],
        cue: 'How many of these pieces fit into that amount?',
        own: [FD('4', '1/2'), FD('3', '1/6'), FD('1/2', '1/4'), FD('3/4', '1/8')]
      },
      p1: {
        show: { cap: 'eighths in 1/2: 4', eq: ['1/2 ÷ 1/8 = 4'] },
        items: [FD('5', '1/2'), FD('2', '1/4'), FD('6', '1/3'), FD('1', '1/10'), FD('2/3', '1/6'), FD('4/5', '1/10')]
      },
      p2: {
        items: [story('How many 1/4 cup scoops are in 3 cups of {many}?', 'scoops', 12, '3 ÷ 1/4'),
          story('A 6 m board is cut into 3/4 m pieces. How many pieces?', 'pieces', 8, '6 ÷ 3/4'),
          FD('3', '3/4'), FD('2', '2/5'), FD('3/4', '3/8'), FD('5/6', '5/12')]
      },
      p3: {
        items: [story('{a} has 2 1/2 L of juice and pours 1/4 L glasses. How many glasses?', 'glasses', 10, '2 1/2 ÷ 1/4', { wide: true }),
          story('A ribbon is 4 1/2 m. Bows need 3/4 m each. How many bows?', 'bows', 6, '4 1/2 ÷ 3/4', { wide: true }),
          FD('1/2', '1/3'), FD('7/8', '1/4')]
      },
      think: {
        items: [{ q: '{b} says 4 ÷ 1/2 = 2. What went wrong?', lines: { n: 3, key: '{b} found half of 4. The question is how many halves fit in 4: 8.' } },
          { q: 'Draw a picture for 2 ÷ 1/3.', draw: { h: 50, key: '2 bars each cut in thirds: 6 pieces.' } },
          FD('5/6', '1/12'),
          { q: 'Write a story for 3 ÷ 1/2.', lines: { n: 2, key: 'For example: 3 pizzas cut in halves make 6 half-pizzas.' } }]
      }
    },

    flip: {
      watch: 'flipping the first fraction, or both. Keep the first, change ÷ to ×, flip the second.',
      goal: 'I can divide fractions by multiplying by the reciprocal.',
      learn: {
        show: { cap: 'keep, change, flip', eq: ['2/3 ÷ 4/5 = 2/3 × 5/4', '= 10/12 = 5/6'] },
        together: [FR('1/2', '3/4'), FR('3/5', '2/3')],
        cue: 'Keep the first, change ÷ to ×, flip the second.',
        own: [FR('5/6', '1/3'), FR('2/7', '4/7'), FR('3/4', '9/10')]
      },
      p1: {
        show: { cap: 'the reciprocal of 2/5 is 5/2', eq: ['3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8'] },
        items: [FR('1/3', '1/2'), FR('4/5', '2/3'), FR('5/8', '1/4'), FR('2/9', '1/3')]
      },
      p2: {
        items: [FD('3/8', '3/4'), FD('5/6', '2/9'), FD('7/10', '1/5'), FD('4/9', '2/3'), FD('1 1/2', '3/4'), FD('2 1/4', '1/2')]
      },
      p3: {
        items: [FD('3 1/3', '5/6'), FD('9/10', '1 1/5'),
          story('A pitcher holds 3 3/4 L. Bottles hold 3/4 L. How many bottles fill?', 'bottles', 5, '3 3/4 ÷ 3/4', { wide: true }),
          story('{a} walks 2/3 km in 1/6 hour. How far is that per hour?', 'km', '4', '2/3 ÷ 1/6', { wide: true })]
      },
      think: {
        items: [{ q: '{b} did 2/3 ÷ 4/5 as 3/2 × 4/5. What went wrong?', lines: { n: 3, key: '{b} flipped the first fraction. Flip the second: 2/3 × 5/4 = 5/6.' } },
          { q: 'Why does dividing by 1/2 give the same answer as multiplying by 2?', lines: { n: 3, key: 'Two halves fit in each whole, so there are twice as many: ÷ 1/2 = × 2.' } },
          FR('7/12', '7/8'),
          { q: 'What is the reciprocal of 5? Explain.', lines: { n: 2, key: '1/5, because 5 = 5/1 flipped is 1/5, and 5 × 1/5 = 1.' } }]
      }
    },

    compare: {
      watch: 'choosing ÷ whenever a fraction appears. "Of" an amount is ×; how many fit is ÷.',
      goal: 'I can decide whether a fraction problem needs × or ÷.',
      learn: {
        show: { eq: ['1/2 of 3/4 cup → ×', 'how many 1/4 cups in 3 → ÷'] },
        together: [{ q: '3/4 of 12 {many}. How many?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] {many}'], a: [9], calc: '3/4 × 12' },
          { q: 'How many 1/3 m pieces in 4 m?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] pieces'], a: [12], calc: '4 ÷ 1/3' }],
        cue: 'Part of an amount: ×. How many fit: ÷.',
        own: [{ q: '2/5 of 30 km. How far?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] km'], a: [12], calc: '2/5 × 30' },
          { q: 'How many 1/8 L cups from 2 L?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] cups'], a: [16], calc: '2 ÷ 1/8' }]
      },
      p1: {
        show: { eq: ['3/4 of 8 = 3/4 × 8 = 6', '8 ÷ 3/4 = 10 2/3'] },
        items: [{ q: '1/3 of 1/2 a cake. What fraction?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[]'], a: ['1/6'], calc: '1/3 × 1/2' },
          { q: 'How many 1/2 h shows in 3 h?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] shows'], a: [6], calc: '3 ÷ 1/2' },
          { q: '5/6 of 24 {many}. How many?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[]'], a: [20], calc: '5/6 × 24' },
          { q: 'How many 2/3 cup scoops in 4 cups?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] scoops'], a: [6], calc: '4 ÷ 2/3' }]
      },
      p2: {
        items: [{ q: 'A 3/4 h hike. {a} has done 2/3 of it. How long so far?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] h'], a: ['1/2'], calc: '2/3 × 3/4' },
          { q: '2 1/2 kg of {many} go in 1/4 kg bags. How many bags?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] bags'], a: [10], calc: '2 1/2 ÷ 1/4' },
          { q: 'A car uses 3/5 of a tank. The tank holds 45 L. How many litres?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] L'], a: [27], calc: '3/5 × 45' },
          { q: '{b} has 6 m of rope. Each knot uses 3/8 m. How many knots?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] knots'], a: [16], calc: '6 ÷ 3/8' }]
      },
      p3: {
        items: [{ q: 'A 9/10 km track. {a} ran 2/3 of it. How far?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[] km'], a: ['3/5'], calc: '2/3 × 9/10' },
          { q: 'How many 3/4 h lessons fit in 4 1/2 h?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] lessons'], a: [6], calc: '4 1/2 ÷ 3/4' },
          { q: '{a} uses 1/3 of 3/4 of a bag of flour. What fraction of the bag?', pick: { opts: ['×', '÷'], ans: 0 }, eq: ['[]'], a: ['1/4'], calc: '1/3 × 3/4' }]
      },
      think: {
        items: [{ q: 'Write a × story and a ÷ story that both use 1/2 and 6.', lines: { n: 3, key: '×: half of 6 cookies is 3. ÷: 6 cookies cut in halves make 12 halves.' } },
          { q: '{b} says the answer to 4 ÷ 1/2 must be smaller than 4. Is {b} right?', lines: { n: 2, key: 'No. Dividing by a number less than 1 gives more: 8.' } },
          { q: 'How many 2/5 L cups in 2 L?', pick: { opts: ['×', '÷'], ans: 1 }, eq: ['[] cups'], a: [5], calc: '2 ÷ 2/5' }]
      }
    },

    grid: {
      watch: 'writing 0.3 × 0.4 = 1.2. Tenths of tenths are hundredths: 0.3 × 0.4 = 0.12.',
      goal: 'I can multiply tenths by tenths on a hundred grid.',
      learn: {
        show: { pic: ['grid', { n: 12, rect: [3, 4], unit: '0.01', quiet: true, u: 9 }], cap: '3 tenths across, 4 tenths down: 12 small squares', eq: ['0.3 × 0.4 = 0.12'] },
        together: [GR(0.2, 0.5), GR(0.6, 0.3)],
        cue: 'Each small square is a hundredth.',
        own: [DM(0.4, 0.4), DM(0.7, 0.2), DM(0.5, 0.9), DM(0.8, 0.6)]
      },
      p1: {
        show: { pic: ['grid', { n: 6, rect: [2, 3], unit: '0.01', quiet: true }], eq: ['0.2 × 0.3 = 0.06'] },
        items: [GR(0.1, 0.9), GR(0.5, 0.5), DM(0.3, 0.3), DM(0.7, 0.4), DM(0.9, 0.6), DM(0.2, 0.8)]
      },
      p2: {
        items: [DM(0.4, 0.2), DM(0.6, 0.6), DM(0.9, 0.9), DM(0.1, 0.1), DM(1.2, 0.3), DM(0.5, 1.4)]
      },
      p3: {
        items: [story('A patio stone is 0.6 m by 0.5 m. What is its area?', 'm²', 0.3, '0.6 × 0.5'),
          story('A garden bed is 0.8 m by 0.7 m. What is its area?', 'm²', 0.56, '0.8 × 0.7'),
          { eq: ['0.4 × [] = 0.28'], a: [0.7] }, { eq: ['[] × 0.9 = 0.27'], a: [0.3] }, DM(2.5, 0.4)]
      },
      think: {
        items: [{ q: '{b} says 0.3 × 0.4 = 1.2. Use the grid to explain the mistake.', lines: { n: 3, key: '3 tenths of 4 tenths shades 12 small squares, and each is a hundredth: 0.12.' } },
          { q: 'Why is 0.5 × 0.8 less than 0.8?', lines: { n: 2, key: 'Times 0.5 is half of it: half of 0.8 is 0.4.' } },
          GR(0.9, 0.4),
          { q: 'Shade a hundred grid to show 0.7 × 0.7.', draw: { h: 80, key: ['grid', { n: 49, rect: [7, 7], unit: '0.01', quiet: true }] } }]
      }
    },

    places: {
      watch: 'lining up the decimal points as in adding. Multiply as whole numbers, then count all the decimal places.',
      goal: 'I can place the decimal point by counting decimal places.',
      learn: {
        show: { cap: '24 × 13 = 312; 1 + 1 = 2 places', eq: ['2.4 × 1.3 = 3.12'] },
        together: [DM(1.5, 2.3), DM(0.25, 1.2)],
        cue: 'Multiply as whole numbers, then count the decimal places.',
        own: [DM(3.2, 1.4), DM(4.05, 0.6), DM(0.12, 0.3), DM(6.5, 2.2)]
      },
      p1: {
        show: { cap: '35 × 21 = 735; 3 places', eq: ['0.35 × 2.1 = 0.735'] },
        items: [DM(2.1, 1.1), DM(5.4, 0.3), DM(1.25, 4), DM(0.06, 0.7), DM(7.2, 1.5), DM(3.05, 0.2)]
      },
      p2: {
        items: [DM(12.4, 2.5), DM(0.45, 0.32), DM(8.75, 1.2), DM(6.03, 0.04), DM(15.6, 0.15), DM(2.25, 2.25)]
      },
      p3: {
        items: [story('Apples cost $2.40 per kilogram. How much for 3.5 kg?', 'dollars', 8.4, '2.40 × 3.5'),
          story('A car goes 14.5 km on 1 L of gas. How far on 6.2 L?', 'km', 89.9, '14.5 × 6.2'),
          story('Cloth costs $8.75 per metre. How much for 2.4 m?', 'dollars', 21, '8.75 × 2.4'), DM(0.008, 0.5)]
      },
      think: {
        items: [{ q: '{b} says 1.2 × 1.2 = 1.44 has two decimal places because 1.2 has one. Explain the real reason.', lines: { n: 3, key: 'Each 1.2 has one decimal place, so the product has 1 + 1 = 2: 12 × 12 = 144 → 1.44.' } },
          { q: 'Why can 0.5 × 0.4 = 0.20 be written 0.2?', lines: { n: 2, key: 'A zero at the end after the point changes nothing: 20 hundredths = 2 tenths.' } },
          DM(3.14, 2.5),
          { q: 'Check 4.8 × 2.1 = 10.08 with an estimate.', lines: { n: 2, key: 'About 5 × 2 = 10, so 10.08 makes sense.' } }]
      }
    },

    estimate: {
      watch: 'putting the point in the wrong place and not noticing. Round first: 4.8 × 6.1 is about 5 × 6 = 30, so 29.28 fits.',
      goal: 'I can estimate to check a decimal product or quotient.',
      learn: {
        show: { cap: 'about 5 × 6 = 30', eq: ['4.8 × 6.1 = 29.28'] },
        together: [EST('3.9', '×', '7.2', ['2.8', '28', '280'], 1), EST('19.8', '÷', '4.1', ['0.5', '5', '50'], 1)],
        cue: 'Round each number first. Does the answer fit?',
        own: [EST('8.1', '×', '2.9', ['2.4', '24', '240'], 1), EST('0.9', '×', '41', ['3.6', '36', '360'], 1), EST('62.5', '÷', '2.5', ['2.5', '25', '250'], 1), EST('11.8', '×', '0.52', ['0.6', '6', '60'], 1)]
      },
      p1: {
        show: { cap: 'about 20 ÷ 5 = 4', eq: ['19.6 ÷ 4.9 = 4'] },
        items: [EST('5.1', '×', '9.8', ['5', '50', '500'], 1), EST('2.95', '×', '3.1', ['0.9', '9', '90'], 1), EST('48.2', '÷', '6.1', ['0.8', '8', '80'], 1),
          EST('99.7', '×', '0.3', ['3', '30', '300'], 1), EST('7.2', '÷', '0.9', ['0.8', '8', '80'], 1), EST('0.21', '×', '19', ['0.4', '4', '40'], 1)]
      },
      p2: {
        items: [{ q: '{b} got 6.3 × 4.9 = 3.087. Is the point right?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '6.3 × 4.9 = 3.087' },
          { q: '{a} got 12.2 × 3.1 = 37.82. Is the point right?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '12.2 × 3.1 = 37.82' },
          DM(6.3, 4.9), DM(9.9, 9.9), EST('31.5', '÷', '0.48', ['6', '60', '600'], 1), EST('0.75', '×', '0.82', ['0.06', '0.6', '6'], 1)]
      },
      p3: {
        items: [story('Pens cost $1.95 each. About how much for 21 pens? Then work it out exactly.', 'dollars', 40.95, '1.95 × 21', { wide: true }),
          EST('147.6', '÷', '5.2', ['3', '30', '300'], 1), EST('0.48', '×', '0.51', ['0.025', '0.25', '2.5'], 1),
          { q: 'Which is about 120?', pick: { opts: ['3.9 × 31', '0.39 × 31', '39 × 31'], ans: 0, est: '120' }, wide: true, q2: null }]
      },
      think: {
        items: [{ q: 'How does estimating help you place the decimal point?', lines: { n: 3, key: 'The estimate tells the size of the answer, so 2928 can only be 29.28 when the estimate is 30.' } },
          { q: '{b} says 0.4 × 0.6 is about 24. What went wrong?', lines: { n: 2, key: 'Both are less than 1, so the answer is less than 1: 0.24.' } },
          DM(18.5, 0.98),
          { q: 'Write a decimal × decimal whose answer is about 50.', lines: { n: 1, key: 'For example 9.8 × 5.1.' } }]
      }
    },

    jumps: {
      watch: 'getting a small answer. 1.2 ÷ 0.3 asks how many 0.3 jumps make 1.2: 4 jumps.',
      goal: 'I can divide decimals by counting jumps of the divisor.',
      learn: {
        show: { pic: ['dline', { min: 0, max: 1.2, d: 10, show: 'ends' }], cap: '0.3, 0.6, 0.9, 1.2: four jumps', eq: ['1.2 ÷ 0.3 = 4'] },
        together: [DD(0.8, 0.2), DD(1.5, 0.5)],
        cue: 'How many jumps of this size make that number?',
        own: [DD(2.4, 0.6), DD(0.9, 0.3), DD(3.5, 0.7), DD(0.12, 0.04)]
      },
      p1: {
        show: { cap: '0.25 + 0.25 + 0.25 + 0.25', eq: ['1 ÷ 0.25 = 4'] },
        items: [DD(0.6, 0.2), DD(1.6, 0.4), DD(4.5, 0.9), DD(2, 0.5), DD(0.35, 0.05), DD(3, 0.25)]
      },
      p2: {
        items: [DD(7.2, 0.8), DD(5.6, 0.7), DD(0.48, 0.06), DD(10, 0.1), DD(6.3, 0.9), DD(1.44, 0.12)]
      },
      p3: {
        items: [story('A 4.8 m board is cut into 0.6 m shelves. How many shelves?', 'shelves', 8, '4.8 ÷ 0.6'),
          story('{a} has $7.50 in quarters ($0.25). How many quarters?', 'quarters', 30, '7.50 ÷ 0.25'),
          story('A 2.4 L jug fills 0.3 L cups. How many cups?', 'cups', 8, '2.4 ÷ 0.3'), DD(0.054, 0.009)]
      },
      think: {
        items: [{ q: '{b} says 2 ÷ 0.5 = 1. What went wrong?', lines: { n: 3, key: '{b} found half of 2. 2 ÷ 0.5 asks how many halves are in 2: 4.' } },
          { q: 'Why is 3 ÷ 0.1 bigger than 3?', lines: { n: 2, key: 'There are 10 tenths in each whole, so 30 tenths in 3.' } },
          DD(0.81, 0.09),
          { q: 'Draw jumps on a number line to show 1 ÷ 0.2.', draw: { h: 40, key: 'Five jumps of 0.2 from 0 to 1: 0.2, 0.4, 0.6, 0.8, 1.' } }]
      }
    },

    shift: {
      watch: 'moving the point in only one number. Multiply both by the same 10 or 100: 4.5 ÷ 0.15 = 450 ÷ 15.',
      goal: 'I can make the divisor a whole number before dividing.',
      learn: {
        show: { cap: 'both × 10', eq: ['3.6 ÷ 0.4 = 36 ÷ 4', '= 9'] },
        together: [SH(5.6, 0.7, 10), SH(1.25, 0.05, 100)],
        cue: 'Multiply both numbers by 10 or 100 until the divisor is whole.',
        own: [SH(8.4, 1.2, 10), SH(0.72, 0.08, 100), SH(9.6, 0.32, 100)]
      },
      p1: {
        show: { cap: 'both × 100', eq: ['4.5 ÷ 0.15 = 450 ÷ 15', '= 30'] },
        items: [SH(2.7, 0.3, 10), SH(6.4, 0.16, 100), SH(13.2, 1.1, 10), SH(0.98, 0.14, 100)]
      },
      p2: {
        items: [DD(14.4, 1.2), DD(7.8, 0.26), DD(0.375, 0.15), DD(12.6, 0.35), DD(3.06, 0.9), DD(52, 0.65)]
      },
      p3: {
        items: [story('Grapes cost $3.20 per kg. {a} paid $8.00. How many kilograms?', 'kg', 2.5, '8.00 ÷ 3.20'),
          story('A car used 6.5 L to go 91 km. How many km per litre?', 'km', 14, '91 ÷ 6.5'),
          DD(19.5, 1.25), DD(0.0441, 0.21)]
      },
      think: {
        items: [{ q: '{b} turned 4.5 ÷ 0.15 into 45 ÷ 15. What went wrong?', lines: { n: 3, key: '{b} multiplied 4.5 by 10 but 0.15 by 100. Use × 100 on both: 450 ÷ 15 = 30.' } },
          { q: 'Why does multiplying both numbers by 10 not change the answer?', lines: { n: 3, key: 'The same number of jumps fit: 36 ÷ 4 counts the same jumps as 3.6 ÷ 0.4, only 10 times bigger.' } },
          SH(0.63, 0.009, 1000),
          { q: 'Check 7.8 ÷ 0.26 = 30 by multiplying.', lines: { n: 1, key: '30 × 0.26 = 7.8. It checks.' } }]
      }
    },

    bedmas: {
      watch: 'working left to right every time. Brackets first, then exponents, then × and ÷, then + and −.',
      goal: 'I can use the order of operations.',
      learn: {
        show: { cap: '× before +', eq: ['3 + 4 × 5 = 3 + 20', '= 23'] },
        together: [OO('2 + 6 × 3', 20), OO('(2 + 6) × 3', 24)],
        cue: 'Brackets, Exponents, × and ÷, then + and −.',
        own: [OO('10 − 2 × 4', 2), OO('(10 − 2) × 4', 32), OO('5 + 3^2', 14), OO('20 ÷ (4 + 1)', 4)]
      },
      p1: {
        show: { cap: 'exponent first', eq: ['2 × 3^2 = 2 × 9 = 18'] },
        items: [OO('8 + 12 ÷ 4', 11), OO('(8 + 12) ÷ 4', 5), OO('7 × 2 − 3', 11), OO('4^2 − 6', 10), OO('3 × (5 + 2)', 21), OO('18 − 3 × 5', 3)]
      },
      p2: {
        items: [OO('6 + 4 × 2^2', 22), OO('(6 + 4) × 2^2', 40), OO('50 − (3 + 2)^2', 25), OO('36 ÷ 3^2 + 1', 5), OO('2.5 + 1.5 × 4', 8.5), OO('(0.6 + 0.4) × 7', 7)]
      },
      p3: {
        items: [OO('3 + 2 × (8 − 5)^2', 21), OO('1/2 + 1/4 × 2', 1), OO('(9 − 3) ÷ 1.5 + 2', 6),
          { q: 'Put in brackets to make 4 + 6 × 3 = 30 true.', eq: ['[] = 30'], a: ['(4 + 6) × 3'], calc: '(4 + 6) × 3' },
          { q: 'Which is equal to 26?', pick: { opts: ['2 + 4 × 6', '(2 + 4) × 6', '2 × 4 + 6'], ans: 0, val: 26 }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 8 − 2 × 3 = 18. What went wrong?', lines: { n: 3, key: '{b} subtracted first. × comes first: 8 − 6 = 2.' } },
          { q: 'Why do we need one order that everyone uses?', lines: { n: 2, key: 'So a sum has one answer: 3 + 4 × 5 must mean the same to everyone.' } },
          OO('(2 + 3)^2 − 2^3', 17),
          { q: 'Use 2, 3, 4 and any operations and brackets to make 20.', lines: { n: 1, key: 'For example (2 + 3) × 4.' } }]
      }
    },

    leftright: {
      watch: 'doing × before ÷ (or + before −) when they sit side by side. Equal partners go left to right.',
      goal: 'I can work equal partners from left to right.',
      learn: {
        show: { cap: '÷ and × are partners: left to right', eq: ['24 ÷ 4 × 2 = 6 × 2', '= 12'] },
        together: [OO('20 ÷ 5 × 2', 8), OO('15 − 6 + 3', 12)],
        cue: '× and ÷ are partners. + and − are partners. Go left to right.',
        own: [OO('36 ÷ 6 × 3', 18), OO('10 − 4 + 5', 11), OO('48 ÷ 8 ÷ 2', 3), OO('30 − 10 − 5', 15)]
      },
      p1: {
        show: { cap: 'left to right', eq: ['9 − 5 + 2 = 4 + 2 = 6'] },
        items: [OO('16 ÷ 2 × 4', 32), OO('12 − 7 + 1', 6), OO('40 ÷ 4 ÷ 5', 2), OO('3 × 8 ÷ 6', 4), OO('25 − 5 − 5', 15), OO('18 + 2 − 10', 10)]
      },
      p2: {
        items: [OO('60 ÷ 5 × 2 + 4', 28), OO('7 + 9 ÷ 3 × 2', 13), OO('100 − 40 ÷ 4 × 2', 80), OO('8 × 3 ÷ 4 − 2', 4), OO('4.8 ÷ 2 × 3', 7.2), OO('2.5 − 1.5 + 0.5', 1.5)]
      },
      p3: {
        items: [OO('72 ÷ 6 ÷ 2 × 3', 18), OO('5 + 20 ÷ 4 × 3 − 1', 19), OO('(18 − 6) ÷ 4 × 2^2', 12),
          { q: 'True or false? 24 ÷ 6 × 2 = 2', pick: { opts: ['true', 'false'], ans: 1 }, tf: '24 ÷ 6 × 2 = 2' },
          { q: 'True or false? 12 − 4 + 2 = 10', pick: { opts: ['true', 'false'], ans: 0 }, tf: '12 − 4 + 2 = 10' }]
      },
      think: {
        items: [{ q: '{b} says 24 ÷ 4 × 2 = 3 because × comes first. What went wrong?', lines: { n: 3, key: '× and ÷ are equal partners, so go left to right: 6 × 2 = 12.' } },
          { q: 'Where would brackets go to make 24 ÷ 4 × 2 equal 3?', lines: { n: 1, key: '24 ÷ (4 × 2) = 3.' } },
          OO('90 ÷ 3 ÷ 3 × 2', 20),
          { q: 'Write a sum where going left to right matters.', lines: { n: 2, key: 'For example 10 − 4 + 2 = 8, but 10 − (4 + 2) = 4.' } }]
      }
    },

    story: {
      watch: 'doing the steps in the order the numbers appear. Plan the steps first, and write one sum with brackets.',
      goal: 'I can solve a problem with more than one step.',
      learn: {
        show: { cap: '3 shirts at $12.50 and a $5 cap', eq: ['3 × 12.50 + 5 = 37.50 + 5', '= $42.50'] },
        together: [story('{a} buys 4 {many} at $2.25 each and pays with $10. What is the change?', 'dollars', 1, '10 − 4 × 2.25', { wide: true }),
          story('A class of 28 and a class of 32 share 4 buses equally. How many on each bus?', 'students', 15, '(28 + 32) ÷ 4', { wide: true })],
        cue: 'Plan the steps, then write one sum with brackets.',
        own: [story('Tickets are $8.50 for adults and $5.25 for children. What do 2 adults and 3 children pay?', 'dollars', 32.75, '2 × 8.50 + 3 × 5.25', { wide: true }),
          story('{b} earns $12.40 an hour and works 6.5 hours. {b} spends $25 on a gift. How much is left?', 'dollars', 55.6, '12.40 × 6.5 − 25', { wide: true })]
      },
      p1: {
        show: { cap: '5 packs of 6 shared by 3', eq: ['5 × 6 ÷ 3 = 10'] },
        items: [story('{a} has 3 {conts} of 12 {many} and gives away 7. How many are left?', '{many}', 29, '3 × 12 − 7', { wide: true }),
          story('Pizza is $14.75 plus $2.50 delivery. 3 friends share the cost equally. Each pays?', 'dollars', 5.75, '(14.75 + 2.50) ÷ 3', { wide: true }),
          story('A rectangle is 4.5 m by 3.2 m. A 1.2 m by 1 m part is not painted. Area painted?', 'm²', 13.2, '4.5 × 3.2 − 1.2 × 1', { wide: true }),
          story('{b} ran 2.4 km each day for 5 days and 3.5 km on the sixth day. How far in all?', 'km', 15.5, '2.4 × 5 + 3.5', { wide: true })]
      },
      p2: {
        items: [story('Notebooks are 3 for $4.50. {a} buys 9 notebooks. What is the cost?', 'dollars', 13.5, '9 ÷ 3 × 4.50', { wide: true }),
          story('A 2 L bottle fills 0.25 L glasses. 3 glasses are spilled. How many glasses are drunk?', 'glasses', 5, '2 ÷ 0.25 − 3', { wide: true }),
          story('{b} saves $15 a week for 8 weeks, then spends 2/3 of it. How much is left?', 'dollars', 40, '15 × 8 − 2/3 × 15 × 8', { wide: true }),
          story('Paint covers 7.5 m² per litre. A wall is 6 m by 2.5 m. How many litres of paint?', 'L', 2, '6 × 2.5 ÷ 7.5', { wide: true })]
      },
      p3: {
        items: [story('Fabric is $6.40 per metre. {a} buys 2.5 m and pays with $20. Change?', 'dollars', 4, '20 − 6.40 × 2.5', { wide: true }),
          story('A recipe for 4 uses 1.5 cups of rice. How many cups for 10 people?', 'cups', 3.75, '1.5 ÷ 4 × 10', { wide: true }),
          story('A car goes 100 km on 7.5 L. Gas is $1.60 per litre. Cost to go 300 km?', 'dollars', 36, '300 ÷ 100 × 7.5 × 1.60', { wide: true })]
      },
      think: {
        items: [{ q: 'Write one sum with brackets for: 3 friends split a $24 bill and a $6 tip.', lines: { n: 2, key: '(24 + 6) ÷ 3 = 10, so $10 each.' } },
          { q: '{b} wrote 24 + 6 ÷ 3 = 26 for that problem. What went wrong?', lines: { n: 2, key: 'Without brackets, only the tip is shared. The whole bill and tip must be shared: (24 + 6) ÷ 3.' } },
          { q: 'Write a two-step problem for 5 × 3.20 + 4.', lines: { n: 3, key: 'For example: 5 muffins at $3.20 and a $4 juice. What is the total? ($20)' } }]
      }
    }
  } });
})();
