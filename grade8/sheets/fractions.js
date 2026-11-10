/* Grade 8 Fractions: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/fractions.lessons.js: Learn, Practise 1 to 3 and Think. Every question is written here, so a sheet always
   prints the same. Theme words: {a} {b} names.
   Ontario 2020: B2.5 adding and subtracting fractions and mixed numbers; B2.6 multiplying and dividing fractions by
   fractions, whole numbers and mixed numbers. The answer checks are in tests/verify/sheets.js: every sum is worked out
   again with fractions as numbers, answers are in simplest form (simplest), a story's sum uses its own numbers (calc),
   the operation circled is the one in the story's sum, and an estimate circled is the closest (est). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function F(e) { var it = S.q(e, { frac: true }); it.simplest = true; return it; }
  function M(e) { var it = S.q(e, { mixed: true }); it.simplest = true; return it; }
  function ST(q, calc, unit, mixed) { return { q: q, eq: ['[]' + (unit ? ' ' + unit : '')], a: [S.asFrac(S.calc(calc), mixed !== false)], calc: calc, simplest: true }; }
  function OP(q, calc, ans) { var it = M(calc); it.q = q; it.pick = { opts: ['+', '−', '×', '÷'], ans: ans }; it.calc = calc; it.eq = ['[]']; delete it.wide; return it; }
  function EST(q, e, opts) {
    var v = S.calc(e), d = opts.map(function (o) { return Math.abs(S.calc(o) - v); }), best = d.indexOf(Math.min.apply(null, d));
    return { q: q, pick: { opts: opts, ans: best, est: e } };
  }

  S.register('fractions', { code: 'FR', ideas: {

    same: {
      watch: 'adding the denominators (1/5 + 2/5 = 3/10). The pieces stay fifths: only the tops are added.',
      goal: 'I can add and subtract fractions with the same denominator.',
      learn: {
        show: { pic: ['fbars', { rows: [[5, 3]] }], cap: '1 fifth + 2 fifths', eq: ['1/5 + 2/5 = 3/5'] },
        together: [F('2/7 + 3/7'), F('5/8 − 1/8')],
        cue: 'Same size pieces: add or subtract the tops, keep the bottom. Simplify.',
        own: [F('4/9 + 2/9'), F('7/10 − 3/10'), F('3/4 + 3/4'), F('11/12 − 5/12')]
      },
      p1: {
        show: { eq: ['3/8 + 1/8 = 4/8', '4/8 = 1/2'] },
        items: [F('1/3 + 1/3'), F('2/5 + 2/5'), F('5/6 − 1/6'), F('3/10 + 1/10'), F('7/8 − 3/8'), F('4/7 + 5/7'), F('9/10 − 9/10'), F('5/12 + 5/12')]
      },
      p2: {
        items: [F('6/11 + 7/11'), F('13/15 − 4/15'), F('1/9 + 4/9 + 2/9'), F('17/20 − 7/20'), F('3/8 + 5/8 + 7/8'), F('19/24 − 11/24'), F('2/3 − 1/3 + 2/3'), F('(−3/5) + 4/5')]
      },
      p3: {
        items: [F('23/30 − 13/30'), F('5/16 + 7/16 + 9/16'), F('(−7/12) − 1/12'), F('1 − 3/8'),
          ST('{a} walks 3/10 km to the store and 5/10 km home. How far in all?', '3/10 + 5/10', 'km'),
          ST('A jug is 7/8 full. 3/8 is poured out. How full is it now?', '7/8 − 3/8', 'full'), F('2 − 5/6'), F('11/14 + 5/14')]
      },
      think: {
        items: [{ q: '{b} says 2/5 + 1/5 = 3/10. Explain the mistake.', lines: { n: 3, key: 'The pieces are fifths and stay fifths. Add the tops: 3/5.' } },
          { q: 'Draw a picture to show 3/8 + 3/8.', draw: { h: 50, key: ['fbars', { rows: [[8, 6]] }] }, eq: ['3/8 + 3/8 = []'], a: ['3/4'], simplest: true },
          { q: 'Write two fractions with the same denominator that add to 1.', lines: { n: 1, key: 'For example 3/7 + 4/7.' } },
          F('9/16 + 3/16')]
      }
    },

    common: {
      watch: 'adding tops and bottoms (1/2 + 1/3 = 2/5). Change both to the same size pieces first: 3/6 + 2/6 = 5/6.',
      goal: 'I can add fractions by finding a common denominator.',
      learn: {
        show: { pic: ['fbars', { rows: [[2, 1], [6, 3]], labels: ['1/2', '3/6'] }], cap: '1/2 = 3/6 and 1/3 = 2/6', eq: ['1/2 + 1/3 = 5/6'] },
        together: [F('1/4 + 1/3'), F('2/5 + 3/10')],
        cue: 'Find a common denominator, change both fractions, then add the tops.',
        own: [F('1/2 + 1/5'), F('3/4 + 1/8'), F('2/3 + 1/6'), F('1/6 + 3/4')]
      },
      p1: {
        show: { eq: ['2/3 + 1/4 = 8/12 + 3/12', '2/3 + 1/4 = 11/12'] },
        items: [F('1/3 + 1/6'), F('1/2 + 1/4'), F('2/5 + 1/2'), F('1/3 + 2/9'), F('3/8 + 1/4'), F('1/5 + 3/10'), F('2/7 + 1/2'), F('1/6 + 2/9')]
      },
      p2: {
        items: [M('3/4 + 2/3'), M('5/6 + 3/8'), F('3/10 + 4/15'), M('4/5 + 1/2'), M('7/12 + 5/8'), F('1/2 + 1/3 + 1/6'), M('2/3 + 3/5'), F('(−1/4) + 2/3')]
      },
      p3: {
        items: [M('5/6 + 7/9'), M('11/12 + 3/4 + 1/2'), F('3/14 + 2/7'), F('(−2/3) + 1/5'),
          ST('{a} ate 1/4 of a pizza and {b} ate 1/3. How much did they eat?', '1/4 + 1/3', 'of the pizza'),
          ST('A recipe uses 2/3 cup of milk and 3/4 cup of water. How much liquid?', '2/3 + 3/4', 'cups'), M('9/10 + 5/6'), F('1/8 + 1/12')]
      },
      think: {
        items: [{ q: '{a} says 1/2 + 1/3 = 2/5. How can you tell this is wrong without working it out?', lines: { n: 3, key: '2/5 is less than 1/2, but adding 1/3 must make it bigger than 1/2.' } },
          { q: 'Why can you use 12 or 24 as a common denominator for 1/4 + 1/6?', lines: { n: 3, key: 'Both 4 and 6 go into 12 and 24. 12 is the least, so the numbers stay smaller.' } },
          EST('About how much is 7/8 + 5/9?', '7/8 + 5/9', ['1', '1 1/2', '2']),
          M('4/7 + 2/3')]
      }
    },

    subtract: {
      watch: 'subtracting the denominators too (3/4 − 1/3 = 2/1). Make the pieces the same size: 9/12 − 4/12 = 5/12.',
      goal: 'I can subtract fractions with different denominators.',
      learn: {
        show: { cap: '3/4 = 9/12 and 1/3 = 4/12', eq: ['3/4 − 1/3 = 5/12'] },
        together: [F('5/6 − 1/3'), F('7/8 − 1/2')],
        cue: 'Common denominator first, then subtract the tops.',
        own: [F('2/3 − 1/4'), F('4/5 − 1/2'), F('9/10 − 2/5'), F('3/4 − 1/6')]
      },
      p1: {
        show: { eq: ['1/2 − 1/5 = 5/10 − 2/10', '1/2 − 1/5 = 3/10'] },
        items: [F('1/2 − 1/4'), F('2/3 − 1/6'), F('3/5 − 1/10'), F('5/8 − 1/4'), F('1/3 − 1/4'), F('5/6 − 1/2'), F('7/9 − 1/3'), F('3/4 − 3/8')]
      },
      p2: {
        items: [F('5/6 − 3/8'), F('7/10 − 1/4'), F('11/12 − 2/3'), F('4/5 − 2/3'), F('1/2 − 2/3'), F('3/7 − 1/2'), F('1 − 5/9 − 1/3'), F('2/3 − (−1/6)')]
      },
      p3: {
        items: [F('13/15 − 3/10'), F('5/12 − 7/8'), F('(−1/2) − 3/5'), F('7/9 − 1/6 − 1/3'),
          ST('A tank is 9/10 full. After a trip it is 1/4 full. What fraction was used?', '9/10 − 1/4', 'of the tank'),
          ST('{b} has 2/3 h to study. Reading takes 3/8 h. How much time is left?', '2/3 − 3/8', 'h'), F('1 − 7/20'), F('5/6 − 4/9')]
      },
      think: {
        items: [{ q: '{b} says 3/4 − 1/3 = 2/1. Explain the mistake.', lines: { n: 3, key: 'You cannot subtract the bottoms. 9/12 − 4/12 = 5/12.' } },
          { q: 'How can you check 5/6 − 1/4 = 7/12 by adding?', lines: { n: 3, key: '7/12 + 1/4 = 7/12 + 3/12 = 10/12 = 5/6.' } },
          { q: 'Why is 1/2 − 2/3 negative?', lines: { n: 2, key: '2/3 is bigger than 1/2, so taking it away goes below 0: −1/6.' } },
          F('8/9 − 5/6')]
      }
    },

    mixadd: {
      watch: 'forgetting to carry when the fractions add to more than 1. 2 3/4 + 1 1/2 = 3 5/4 = 4 1/4.',
      goal: 'I can add mixed numbers.',
      learn: {
        show: { cap: 'wholes: 3, fractions: 3/4 + 2/4 = 1 1/4', eq: ['2 3/4 + 1 1/2 = 4 1/4'] },
        together: [M('1 1/3 + 2 1/3'), M('3 1/2 + 1 1/4')],
        cue: 'Add the wholes, add the fractions, then carry any whole.',
        own: [M('2 2/5 + 1 1/5'), M('1 2/3 + 1 1/2'), M('4 1/6 + 2 3/4'), M('3 5/8 + 2 1/2')]
      },
      p1: {
        show: { eq: ['1 1/2 + 2 1/3 = 3 5/6'] },
        items: [M('2 1/4 + 3 1/4'), M('1 1/2 + 1 1/2'), M('3 1/3 + 2 1/6'), M('5 2/5 + 1 1/2'), M('2 3/4 + 3/4'), M('1 5/6 + 2 1/3'), M('4 1/8 + 1 3/4'), M('6 + 2 2/3')]
      },
      p2: {
        items: [M('3 7/8 + 2 3/4'), M('5 2/3 + 4 5/6'), M('1 3/10 + 2 4/5'), M('7 1/2 + 3 2/3'), M('2 5/12 + 1 3/4'), M('1 1/2 + 2 1/3 + 3 1/6'), M('9 3/5 + 4 7/10'), M('6 4/9 + 2 2/3')]
      },
      p3: {
        items: [M('12 5/6 + 8 3/4'), M('3 2/3 + 4 4/5'), M('2 7/8 + 1 5/6'),
          ST('{a} hikes 3 3/4 km, rests, then hikes 2 2/3 km. How far in all?', '3 3/4 + 2 2/3', 'km'),
          ST('A board is 1 5/8 m and another is 2 3/4 m. How long are they end to end?', '1 5/8 + 2 3/4', 'm'),
          ST('{b} worked 2 1/2 h on Monday, 3 1/4 h on Tuesday and 1 3/4 h on Wednesday. How many hours?', '2 1/2 + 3 1/4 + 1 3/4', 'h'), M('5 11/12 + 3 1/4')]
      },
      think: {
        items: [{ q: '{a} wrote 2 3/4 + 1 1/2 = 3 5/4. Is that finished? Explain.', lines: { n: 3, key: 'No. 5/4 is more than 1: 5/4 = 1 1/4, so the answer is 4 1/4.' } },
          { q: 'Show another way: change to improper fractions to find 1 2/3 + 2 1/2.', lines: { n: 3, key: '5/3 + 5/2 = 10/6 + 15/6 = 25/6 = 4 1/6.' } },
          EST('About how much is 4 7/8 + 2 1/10?', '4 7/8 + 2 1/10', ['6', '7', '8']),
          M('3 4/5 + 2 3/10')]
      }
    },

    regroup: {
      watch: 'subtracting the smaller fraction from the bigger one (4 1/4 − 1 3/4 = 3 2/4). Borrow a whole first: 3 5/4 − 1 3/4 = 2 1/2.',
      goal: 'I can subtract mixed numbers, regrouping a whole when I need to.',
      learn: {
        show: { cap: '4 1/4 = 3 5/4', eq: ['4 1/4 − 1 3/4 = 2 1/2'] },
        together: [M('3 1/3 − 1 2/3'), M('5 1/2 − 2 3/4')],
        cue: 'Not enough in the fraction? Borrow 1 whole as pieces.',
        own: [M('4 2/5 − 1 4/5'), M('6 1/6 − 2 1/2'), M('3 − 1 1/4'), M('7 3/8 − 3 3/4')]
      },
      p1: {
        show: { eq: ['3 − 1 1/3 = 2 3/3 − 1 1/3', '3 − 1 1/3 = 1 2/3'] },
        items: [M('2 1/4 − 1 3/4'), M('5 1/3 − 2 2/3'), M('4 − 2 1/2'), M('6 1/5 − 3 3/5'), M('3 1/2 − 1 2/3'), M('8 1/6 − 5 5/6'), M('2 − 3/8'), M('7 1/4 − 4 1/2')]
      },
      p2: {
        items: [M('9 1/3 − 4 3/4'), M('6 2/5 − 3 7/10'), M('5 1/8 − 2 3/4'), M('10 − 6 5/6'), M('4 1/6 − 1 7/9'), M('8 3/10 − 5 4/5'), M('12 1/2 − 9 5/8'), M('3 1/12 − 1 3/4')]
      },
      p3: {
        items: [M('15 1/4 − 7 5/6'), M('20 − 12 3/8'), M('6 2/9 − 3 2/3'),
          ST('A rope is 8 1/3 m. {a} cuts off 2 3/4 m. How much is left?', '8 1/3 − 2 3/4', 'm'),
          ST('{b} needs 5 hours. {b} has done 2 5/6 h. How much longer?', '5 − 2 5/6', 'h'),
          ST('A pail holds 6 1/4 L. 3 2/3 L leaks out. How much is left?', '6 1/4 − 3 2/3', 'L'), M('11 1/5 − 4 1/2')]
      },
      think: {
        items: [{ q: '{b} says 4 1/4 − 1 3/4 = 3 2/4. Explain the mistake.', lines: { n: 3, key: '{b} took 1/4 from 3/4. Borrow a whole: 3 5/4 − 1 3/4 = 2 2/4 = 2 1/2.' } },
          { q: 'How can you check 5 1/3 − 2 2/3 = 2 2/3?', lines: { n: 2, key: 'Add back: 2 2/3 + 2 2/3 = 4 4/3 = 5 1/3.' } },
          { q: 'Find 6 1/5 − 2 4/5 by counting up from 2 4/5.', lines: { n: 2, key: '2 4/5 + 1/5 = 3, then 3 + 3 1/5 = 6 1/5. Total 3 2/5.' } },
          M('9 − 4 2/7')]
      }
    },

    of: {
      watch: 'adding instead of multiplying. 1/2 of 3/4 means 1/2 × 3/4 = 3/8: the answer is smaller.',
      goal: 'I can multiply a fraction by a fraction.',
      learn: {
        show: { cap: 'half of three quarters', eq: ['1/2 × 3/4 = 3/8'] },
        together: [F('2/3 × 3/5'), F('1/4 × 2/3')],
        cue: 'Multiply the tops, multiply the bottoms. Simplify.',
        own: [F('3/4 × 1/3'), F('2/5 × 5/6'), F('1/2 × 1/2'), F('3/8 × 4/9')]
      },
      p1: {
        show: { eq: ['2/3 × 4/5 = 8/15'] },
        items: [F('1/3 × 1/4'), F('2/3 × 1/2'), F('3/5 × 1/3'), F('4/7 × 1/2'), F('5/6 × 3/5'), F('3/4 × 2/3'), F('1/5 × 5/8'), F('7/10 × 2/7')]
      },
      p2: {
        items: [F('6/7 × 7/12'), F('4/9 × 3/8'), F('5/12 × 6/25'), F('(−2/3) × 9/10'), F('(−3/4) × (−8/9)'), F('2/3 × 3/4 × 4/5'), F('(3/4)²'), F('9/14 × 7/18')]
      },
      p3: {
        items: [F('15/16 × 8/25'), F('(−5/6) × 9/20'), F('(2/5)²'), F('1/2 × 2/3 × 3/4'),
          ST('3/4 of the class has a phone. 2/3 of those use it for music. What fraction of the class is that?', '3/4 × 2/3', 'of the class'),
          ST('A garden is 5/6 of the yard. 3/5 of the garden is vegetables. What fraction of the yard is vegetables?', '5/6 × 3/5', 'of the yard'), F('7/8 × 4/21'), F('(−1/3)³')]
      },
      think: {
        items: [{ q: 'Why is 2/3 × 3/4 smaller than both fractions?', lines: { n: 3, key: 'You take a part of a part. Multiplying by a number less than 1 makes it smaller.' } },
          { q: 'Draw an area model for 1/3 × 3/4.', draw: { h: 60, key: 'A rectangle cut into 4 columns (3 shaded) and 3 rows (1 shaded): 3 of 12 parts overlap = 1/4.' }, eq: ['1/3 × 3/4 = []'], a: ['1/4'], simplest: true },
          { q: 'Simplify before multiplying: 8/9 × 3/4. Explain.', lines: { n: 3, key: '8 and 4 share 4; 3 and 9 share 3. 2/3 × 1/1 = 2/3.' } },
          F('10/21 × 14/15')]
      }
    },

    whole: {
      watch: 'multiplying the whole number of a mixed number only (2 1/2 × 4 = 8 1/2). Change to an improper fraction: 5/2 × 4 = 10.',
      goal: 'I can multiply fractions by whole numbers and mixed numbers.',
      learn: {
        show: { cap: '2 1/2 = 5/2', eq: ['2 1/2 × 4 = 10'] },
        together: [M('3/4 × 6'), M('1 1/3 × 2/5')],
        cue: 'Write whole numbers over 1 and mixed numbers as improper fractions.',
        own: [M('5 × 2/3'), M('1 1/2 × 1 1/2'), M('8 × 3/10'), M('2 2/3 × 3/4')]
      },
      p1: {
        show: { eq: ['6 × 2/3 = 12/3', '6 × 2/3 = 4'] },
        items: [M('4 × 1/2'), M('9 × 2/3'), M('3/5 × 10'), M('7 × 3/4'), M('1 1/4 × 2'), M('3 1/2 × 3'), M('2/3 × 1 1/2'), M('5/6 × 12')]
      },
      p2: {
        items: [M('2 1/3 × 1 1/2'), M('3 3/4 × 2/5'), M('1 2/3 × 2 1/4'), M('4 1/2 × 2 2/3'), M('(−3) × 2 1/6'), M('15 × 4/9'), M('5 1/5 × 5'), M('(1 1/2)²')]
      },
      p3: {
        items: [M('3 1/3 × 2 2/5'), M('6 1/4 × 1 3/5'), M('(−2 1/2) × (−1 1/5)'),
          ST('A recipe needs 2 3/4 cups of flour. {a} makes 3 batches. How much flour?', '2 3/4 × 3', 'cups'),
          ST('A room is 4 1/2 m by 3 1/3 m. What is its area?', '4 1/2 × 3 1/3', 'm²'),
          ST('{b} runs 1 3/4 km a day for 6 days. How far in all?', '1 3/4 × 6', 'km'), M('(2 2/3)²')]
      },
      think: {
        items: [{ q: '{a} says 2 1/2 × 4 = 8 1/2. Explain the mistake.', lines: { n: 3, key: '{a} multiplied only the 2. Both parts multiply: 2 × 4 + 1/2 × 4 = 8 + 2 = 10.' } },
          { q: 'Will 3 × 2/5 be more or less than 3? Explain.', lines: { n: 2, key: 'Less. 2/5 is less than 1, so you get less than 3: 1 1/5.' } },
          EST('About how much is 4 7/8 × 3 1/9?', '4 7/8 × 3 1/9', ['12', '15', '20']),
          M('1 3/4 × 2 2/7')]
      }
    },

    fit: {
      watch: 'thinking division always makes smaller. 3 ÷ 1/4 asks how many quarters fit in 3: 12.',
      goal: 'I can divide by a fraction by asking how many fit.',
      learn: {
        show: { pic: ['fbars', { rows: [[4, 12]] }], cap: '12 quarters fit in 3', eq: ['3 ÷ 1/4 = 12'] },
        together: [M('2 ÷ 1/3'), M('3/4 ÷ 1/8')],
        cue: 'How many of the second fit into the first?',
        own: [M('4 ÷ 1/2'), M('1 ÷ 1/5'), M('1/2 ÷ 1/6'), M('2/3 ÷ 1/6')]
      },
      p1: {
        show: { eq: ['1/2 ÷ 1/4: two quarters fit', '1/2 ÷ 1/4 = 2'] },
        items: [M('1 ÷ 1/4'), M('3 ÷ 1/2'), M('2 ÷ 1/5'), M('1/2 ÷ 1/8'), M('3/4 ÷ 1/4'), M('5 ÷ 1/3'), M('6/7 ÷ 2/7'), M('9/10 ÷ 3/10')]
      },
      p2: {
        items: [M('3 ÷ 3/4'), M('4 ÷ 2/3'), M('1 1/2 ÷ 1/4'), M('2 ÷ 4/5'), M('5/6 ÷ 1/3'), M('3/4 ÷ 3/8'), M('1/3 ÷ 1/2'), M('2 1/2 ÷ 1/2')]
      },
      p3: {
        items: [ST('A ribbon is 6 m long. Each bow needs 3/4 m. How many bows?', '6 ÷ 3/4', 'bows'),
          ST('{a} has 2 1/2 L of juice and fills 1/4 L cups. How many cups?', '2 1/2 ÷ 1/4', 'cups'),
          ST('A 5 kg bag of rice is split into 2/3 kg bags. How many bags?', '5 ÷ 2/3', 'bags'),
          ST('A path is 3/4 km. Each step on a map is 1/12 km. How many steps?', '3/4 ÷ 1/12', 'steps'), M('7/8 ÷ 1/4'), M('4 1/2 ÷ 3/4')]
      },
      think: {
        items: [{ q: 'Why is 3 ÷ 1/4 bigger than 3?', lines: { n: 3, key: 'You count how many quarters fit into 3. Each whole holds 4, so 12.' } },
          { q: 'Draw a picture for 2 ÷ 1/3.', draw: { h: 50, key: ['fbars', { rows: [[3, 6]] }] }, eq: ['2 ÷ 1/3 = []'], a: [6] },
          { q: 'Write a story for 4 ÷ 2/3.', lines: { n: 2, key: 'For example: 4 pizzas, each person eats 2/3 of a pizza. 6 people.' } },
          M('3 1/3 ÷ 5/6')]
      }
    },

    flip: {
      watch: 'flipping the first fraction instead of the second. Keep the first, change ÷ to ×, flip the second.',
      goal: 'I can divide fractions by multiplying by the reciprocal.',
      learn: {
        show: { cap: 'keep, change, flip', eq: ['3/4 ÷ 2/5 = 3/4 × 5/2 = 1 7/8'] },
        together: [M('2/3 ÷ 3/4'), M('5/6 ÷ 1/3')],
        cue: 'Keep the first. Change ÷ to ×. Flip the second.',
        own: [M('4/5 ÷ 2/3'), M('1/2 ÷ 3/8'), M('7/8 ÷ 7/10'), M('3/5 ÷ 9/10')]
      },
      p1: {
        show: { eq: ['1/3 ÷ 2/5 = 1/3 × 5/2', '1/3 ÷ 2/5 = 5/6'] },
        items: [M('1/2 ÷ 1/3'), M('2/5 ÷ 1/4'), M('3/8 ÷ 3/4'), M('5/9 ÷ 2/3'), M('4/7 ÷ 1/2'), M('9/10 ÷ 3/5'), M('2/3 ÷ 5/6'), M('1/6 ÷ 2/9')]
      },
      p2: {
        items: [M('2 1/4 ÷ 3/8'), M('3 1/3 ÷ 1 1/4'), M('4 ÷ 2 2/3'), M('5/12 ÷ 10/9'), M('(−3/4) ÷ 9/16'), M('(−2/5) ÷ (−4/15)'), M('1 3/5 ÷ 2'), M('6 ÷ 1 1/2')]
      },
      p3: {
        items: [M('3 3/4 ÷ 1 7/8'), M('5 1/3 ÷ 2 2/9'), M('(−4 1/2) ÷ 1 1/5'),
          ST('A car uses 3/4 L of fuel every 10 km. How many 10 km trips on 7 1/2 L?', '7 1/2 ÷ 3/4', 'trips'),
          ST('A 2 2/3 m board is cut into pieces 4/9 m long. How many pieces?', '2 2/3 ÷ 4/9', 'pieces'),
          ST('{b} reads 3/5 of a book in 2 1/4 h. How long for the whole book at that rate?', '2 1/4 ÷ 3/5', 'h'), M('(2/3 ÷ 1/6) ÷ 2')]
      },
      think: {
        items: [{ q: '{a} found 2/3 ÷ 4/5 by flipping 2/3. What went wrong?', lines: { n: 3, key: 'Flip the second fraction: 2/3 × 5/4 = 10/12 = 5/6.' } },
          { q: 'Why does dividing by 1/2 give the same as multiplying by 2?', lines: { n: 3, key: 'Two halves fit in every whole, so there are twice as many.' } },
          { q: 'Check 3/4 ÷ 2/5 = 1 7/8 by multiplying.', lines: { n: 2, key: '1 7/8 × 2/5 = 15/8 × 2/5 = 30/40 = 3/4.' } },
          M('7/9 ÷ 14/27')]
      }
    },

    choose: {
      watch: 'picking × or ÷ by the size of the numbers. Read what is asked: equal groups or a part of → ×; how many fit or share → ÷.',
      goal: 'I can choose the operation for a fraction story and solve it.',
      learn: {
        show: { cap: '"how many 1/4 cups in 3 cups?" asks how many fit', eq: ['3 ÷ 1/4 = 12'] },
        together: [OP('{a} has 3/4 of a pie and eats 1/3 of it. How much pie does {a} eat?', '3/4 × 1/3', 2),
          OP('A tank holds 5/6 L. 1/4 L is added. How much now?', '5/6 + 1/4', 0)],
        cue: 'Combine: +. Difference: −. Part of or groups of: ×. How many fit or share: ÷.',
        own: [OP('A 4 m rope is cut into 2/3 m pieces. How many pieces?', '4 ÷ 2/3', 3),
          OP('{b} had 2 1/2 h and used 1 3/4 h. How much is left?', '2 1/2 − 1 3/4', 1)]
      },
      p1: {
        show: { cap: '"2/3 of 9 kg" is a part of', eq: ['2/3 × 9 = 6'] },
        items: [OP('A bag holds 3/4 kg. How much do 6 bags hold?', '3/4 × 6', 2), OP('{a} ran 1 1/2 km and then 2 1/3 km. How far in all?', '1 1/2 + 2 1/3', 0),
          OP('5 L of soup is poured into 1/2 L bowls. How many bowls?', '5 ÷ 1/2', 3), OP('A board is 3 1/4 m. 1 1/2 m is cut off. How much is left?', '3 1/4 − 1 1/2', 1),
          OP('{b} reads 2/3 of a 45-page story. How many pages?', '2/3 × 45', 2), OP('How many 1/3 h lessons fit in 4 h?', '4 ÷ 1/3', 3)]
      },
      p2: {
        items: [OP('2/5 of the class walks. 3/4 of the walkers live nearby. What fraction of the class is that?', '2/5 × 3/4', 2),
          OP('A field is 7/8 ha. 1/3 ha is planted. How much is not planted?', '7/8 − 1/3', 1),
          OP('3 friends share 2 1/4 pizzas. How much each?', '2 1/4 ÷ 3', 3),
          OP('{b} saves 5/6 of $12. How much is saved?', '5/6 × 12', 2),
          OP('A bottle has 1 1/2 L. {a} adds 3/4 L. How much now?', '1 1/2 + 3/4', 0), OP('A 9 m hose is cut into 3/4 m pieces. How many pieces?', '9 ÷ 3/4', 3)]
      },
      p3: {
        items: [OP('A jug of 3 3/4 L fills glasses of 3/8 L. How many glasses?', '3 3/4 ÷ 3/8', 3),
          OP('A trail is 4 1/2 km. {a} has hiked 2 5/6 km. How far to go?', '4 1/2 − 2 5/6', 1),
          OP('Each lap is 2/5 km. {b} runs 7 1/2 laps. How far?', '2/5 × 7 1/2', 2),
          OP('A cake recipe uses 1 1/3 cups of sugar and 3/4 cup of brown sugar. How much sugar?', '1 1/3 + 3/4', 0),
          OP('A tank holds 12 L. It is 5/8 full. How many litres are in it?', '5/8 × 12', 2), OP('{b} had 6 1/4 m of fabric and used 2 2/3 m. How much is left?', '6 1/4 − 2 2/3', 1)]
      },
      think: {
        items: [{ q: 'Write a story that needs 3/4 × 8.', lines: { n: 2, key: 'For example: 3/4 of 8 students walk to school. 6 students.' } },
          { q: 'Write a story that needs 8 ÷ 3/4.', lines: { n: 2, key: 'For example: how many 3/4 m pieces from 8 m of wire? 10 2/3, so 10 pieces.' } },
          { q: 'Which words in a story tell you to divide?', lines: { n: 2, key: '"How many fit", "how many groups", "share equally", "each".' } },
          OP('{a} shares 3/5 of a pan of brownies equally with 2 friends (3 people). How much each?', '3/5 ÷ 3', 3)]
      }
    },

    sense: {
      watch: 'accepting an answer without checking its size. Estimate first: 2 7/8 × 3 1/10 is about 3 × 3 = 9.',
      goal: 'I can estimate to check if a fraction answer makes sense.',
      learn: {
        show: { cap: 'round to wholes or halves first', eq: ['2 7/8 × 3 1/10 is about 9'] },
        together: [EST('About how much is 5 9/10 − 2 1/8?', '5 9/10 − 2 1/8', ['3', '4', '8']), EST('About how much is 7/8 + 11/12?', '7/8 + 11/12', ['1', '2', '3'])],
        cue: 'Round each fraction to 0, 1/2 or 1 (or the nearest whole), then work it out.',
        own: [EST('About how much is 6 1/9 ÷ 2 9/10?', '6 1/9 ÷ 2 9/10', ['2', '3', '4']), EST('About how much is 4/9 + 5/8?', '4/9 + 5/8', ['1/2', '1', '2'])]
      },
      p1: {
        show: { eq: ['1/8 + 6/7 is about 0 + 1 = 1'] },
        items: [EST('About how much is 1/10 + 8/9?', '1/10 + 8/9', ['0', '1', '2']), EST('About how much is 3 4/5 + 2 1/6?', '3 4/5 + 2 1/6', ['5', '6', '7']),
          EST('About how much is 9 1/7 − 4 6/7?', '9 1/7 − 4 6/7', ['4', '5', '6']), EST('About how much is 4 1/8 × 2 1/9?', '4 1/8 × 2 1/9', ['6', '8', '10']),
          { q: 'Is 2/3 × 5 less than 5?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '2/3 × 5 < 5' },
          { q: 'Is 5 ÷ 2/3 less than 5?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '5 ÷ 2/3 < 5' }]
      },
      p2: {
        items: [EST('About how much is 7 7/8 ÷ 1 9/10?', '7 7/8 ÷ 1 9/10', ['2', '4', '8']), EST('About how much is 12 1/11 × 1/2?', '12 1/11 × 1/2', ['3', '6', '12']),
          { q: '{a} says 3/4 × 2/3 = 1 1/2. Does that make sense?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '3/4 × 2/3 = 1 1/2' },
          { q: '{b} says 4 ÷ 1/2 = 8. Does that make sense?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '4 ÷ 1/2 = 8' },
          EST('About how much is 5 1/12 + 3 11/12 + 1 1/10?', '5 1/12 + 3 11/12 + 1 1/10', ['9', '10', '11']), EST('About how much is 9 4/5 − 6 1/10?', '9 4/5 − 6 1/10', ['3', '4', '16'])]
      },
      p3: {
        items: [{ q: '{a} says 2 1/2 ÷ 1/4 = 5/8. Does that make sense?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '2 1/2 ÷ 1/4 = 5/8' },
          { q: '{b} says 1 1/2 × 1 1/3 = 2. Does that make sense?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '1 1/2 × 1 1/3 = 2' },
          EST('A rope of 11 7/8 m is cut into 2 1/10 m pieces. About how many?', '11 7/8 ÷ 2 1/10', ['4', '6', '24']),
          EST('A room is 3 9/10 m by 5 1/8 m. About what area in m²?', '3 9/10 × 5 1/8', ['9', '20', '30']),
          M('3 9/10 × 5 1/8'), M('11 7/8 ÷ 2 1/10')]
      },
      think: {
        items: [{ q: 'How can an estimate catch a mistake? Give an example.', lines: { n: 3, key: '3 1/2 + 2 3/4 is about 6. An answer of 5 1/4 is too far off, so check again.' } },
          { q: 'When is a × b smaller than a?', lines: { n: 2, key: 'When b is between 0 and 1 (and a is positive).' } },
          { q: 'When is a ÷ b bigger than a?', lines: { n: 2, key: 'When b is between 0 and 1 (and a is positive).' } },
          EST('About how much is 2 1/10 × 4 7/8?', '2 1/10 × 4 7/8', ['8', '10', '12'])]
      }
    }
  } });
})();
