/* Grade 4 Fractions: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/fractions.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.4 fractions from halves to tenths, numerator and denominator, B1.5 fair shares and comparing,
   B1.6 counting by fractions, B2.7 groups of unit fractions. Fractions are written 3/4 on the sheet.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* a shaded picture of k of n equal parts, and its fraction */
  function FR(n, k, shape) { return { pic: ['frac', { n: n, k: k, shape: shape || 'bar' }], eq: ['[]'], a: [k + '/' + n] }; }
  /* compare two fractions with <, > or = */
  function CMP(p, q) {
    var v = function (f) { var x = f.split('/'); return x[0] / x[1]; };
    return { eq: [p + ' ? ' + q], pick: { opts: ['<', '>', '='], ans: v(p) < v(q) ? 0 : v(p) > v(q) ? 1 : 2, cmp: [p, q] }, pickLast: true };
  }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* n copies of 1/d */
  function UN(n, d) { var r = []; for (var i = 0; i < n; i++) r.push('1/' + d); return { eq: [r.join(' + ') + ' = []'], a: [n + '/' + d], wide: n > 3 }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }

  S.register('fractions', { code: 'FR', ideas: {

    'equal-parts': {
      watch: 'calling any cut a fraction. Fractions need equal parts: check that every part is the same size.',
      goal: 'I can tell if a whole is cut into equal parts.',
      learn: {
        show: { pic: ['frac', { n: 4, k: 1, shape: 'bar' }], cap: '4 equal parts: each is 1/4', eq: ['4/4 = 1'] },
        together: [{ q: 'Equal parts?', pic: ['frac', { n: 3, uneven: [0, 0.2, 0.6, 1] }], pick: { opts: ['yes', 'no'], ans: 1, equal: true } },
          { q: 'Equal parts?', pic: ['frac', { n: 6, shape: 'circle' }], pick: { opts: ['yes', 'no'], ans: 0, equal: true } }],
        cue: 'Fractions need equal parts. Check that every part is the same size.',
        own: [{ q: 'Equal parts?', pic: ['frac', { n: 5 }], pick: { opts: ['yes', 'no'], ans: 0, equal: true } },
          { q: 'Equal parts?', pic: ['frac', { n: 4, uneven: [0, 0.4, 0.6, 0.8, 1] }], pick: { opts: ['yes', 'no'], ans: 1, equal: true } },
          FR(8, 1, 'circle')]
      },
      p1: {
        show: { pic: ['frac', { n: 2, k: 1, shape: 'circle' }], cap: '2 equal parts: halves', eq: ['1/2 + 1/2 = 1'] },
        items: [{ q: 'Equal parts?', pic: ['frac', { n: 3 }], pick: { opts: ['yes', 'no'], ans: 0, equal: true } },
          { q: 'Equal parts?', pic: ['frac', { n: 2, uneven: [0, 0.7, 1] }], pick: { opts: ['yes', 'no'], ans: 1, equal: true } },
          FR(4, 1, 'circle'),
          FR(6, 1),
          { q: 'Equal parts?', pic: ['frac', { n: 8, shape: 'circle' }], pick: { opts: ['yes', 'no'], ans: 0, equal: true } },
          { q: 'Equal parts?', pic: ['frac', { n: 3, uneven: [0, 0.5, 0.75, 1] }], pick: { opts: ['yes', 'no'], ans: 1, equal: true } }]
      },
      p2: {
        items: [{ q: 'Draw a bar cut into 5 equal parts.', draw: { h: 60, key: ['frac', { n: 5 }] } }, { q: 'Draw a circle cut into 4 equal parts.', draw: { h: 80, key: ['frac', { n: 4, shape: 'circle' }] } },
          { q: 'Equal parts?', pic: ['frac', { n: 4, uneven: [0, 0.25, 0.5, 0.8, 1] }], pick: { opts: ['yes', 'no'], ans: 1, equal: true } },
          FR(10, 1),
          { q: 'How many parts of 1/6 make 1 whole?', eq: ['[] × 1/6 = 1'], a: [6] },
          { q: 'How many parts of 1/3 make 1 whole?', eq: ['[] × 1/3 = 1'], a: [3] }]
      },
      p3: {
        items: [{ q: 'Draw a bar cut into 8 equal parts.', draw: { h: 60, key: ['frac', { n: 8 }] } }, { q: 'Draw a bar cut into 3 equal parts.', draw: { h: 60, key: ['frac', { n: 3 }] } },
          { q: 'Equal parts?', pic: ['frac', { n: 6, uneven: [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1] }], pick: { opts: ['yes', 'no'], ans: 1, equal: true } },
          { q: 'How many parts of 1/10 make 1 whole?', eq: ['[] × 1/10 = 1'], a: [10] },
          { q: 'How many parts of 1/5 make 1 whole?', eq: ['[] × 1/5 = 1'], a: [5] }, TF('1/8 + 1/8 + 1/8 + 1/8 = 1', false)]
      },
      think: {
        items: [{ q: '{b} cut a bannock into 4 pieces and says each is 1/4. One piece is much bigger. Is {b} right?', lines: { n: 3, key: 'No. Fourths must be 4 equal parts.' } },
          { q: 'Show two different ways to cut a square into 4 equal parts.', draw: { h: 100, key: 'For example: 4 strips, or 4 small squares, or 4 triangles from the corners.' } },
          { q: 'Why do more equal parts mean smaller parts?', lines: { n: 3, key: 'The same whole is shared by more parts, so each part is smaller.' } },
          { q: 'How many tenths make 1 whole?', eq: ['[] × 1/10 = 1'], a: [10] }]
      }
    },

    'num-den': {
      watch: 'writing the shaded parts over the unshaded parts (3/1 for 3 of 4). The bottom number counts all the parts.',
      goal: 'I can name a fraction with a numerator and a denominator.',
      learn: {
        show: { pic: ['frac', { n: 4, k: 3 }], cap: '3 of 4 equal parts are shaded', eq: ['3/4'] },
        together: [FR(5, 2), FR(6, 5, 'circle')],
        cue: 'Bottom: how many equal parts in the whole. Top: how many we count.',
        own: [FR(8, 3), FR(3, 1, 'circle'), FR(10, 7)]
      },
      p1: {
        show: { pic: ['frac', { n: 3, k: 2 }], cap: '2 of 3 parts', eq: ['2/3'] },
        items: [FR(4, 1), FR(2, 1), FR(5, 3, 'circle'), FR(6, 2), FR(4, 3, 'circle'), FR(8, 5)]
      },
      p2: {
        items: [FR(10, 3), FR(6, 1, 'circle'), FR(8, 7), FR(5, 4),
          { q: 'Shade 3/5.', draw: { h: 50, key: ['frac', { n: 5, k: 3 }] } },
          story('A bar has 6 equal parts. 4 are shaded. What fraction is not shaded?', '', '2/6', '6/6 − 4/6')]
      },
      p3: {
        items: [FR(10, 9), FR(8, 4, 'circle'),
          { q: 'Shade 7/10.', draw: { h: 50, key: ['frac', { n: 10, k: 7 }] } },
          story('A bar has 8 equal parts. 3 are shaded. What fraction is not shaded?', '', '5/8', '8/8 − 3/8'),
          FR(6, 5), FR(4, 2, 'circle')]
      },
      think: {
        items: [{ q: '{b} says this shows 3/1. What went wrong?', pic: ['frac', { n: 4, k: 3 }], lines: { n: 2, key: '{b} wrote shaded over unshaded. The whole has 4 parts: 3/4.' } },
          { q: 'Shade 2/4 and 1/2 of the same size bar. What do you notice?', draw: { h: 80, key: 'The same amount is shaded: 2/4 = 1/2.' } },
          { q: 'What does the 5 in 2/5 tell you?', lines: { n: 2, key: 'The whole is cut into 5 equal parts.' } },
          { q: 'Write a fraction with a denominator of 10 and shade it.', draw: { h: 60, key: 'For example: 6/10 with 6 of 10 parts shaded.' } }]
      }
    },

    sets: {
      watch: 'using the number in one group as the denominator. In a set, the denominator is how many things are in the whole set.',
      goal: 'I can find a fraction of a set.',
      learn: {
        show: { pic: ['groups', { counts: [3, 5] }], cap: '3 of 8 {many} are in the first {cont}', eq: ['3/8'] },
        together: [story('{a} has 6 {many}. 1 is in a {cont}. What fraction is in the {cont}?', '', '1/6', '1 / 6'),
          story('{b} has 10 {many}. 7 are in {conts}. What fraction is in {conts}?', '', '7/10', '7 / 10')],
        cue: 'In a set, the denominator is how many things are in the whole set.',
        own: [story('5 {many}: 2 are big. What fraction are big?', '', '2/5', '2 / 5'), story('8 {many}: 5 are new. What fraction are new?', '', '5/8', '5 / 8'),
          story('4 {many}: 3 are old. What fraction are old?', '', '3/4', '3 / 4'), story('9 {many}: 9 are clean. What fraction are clean?', '', '9/9', '9 / 9')]
      },
      p1: {
        show: { cap: '2 of 5 {many}', eq: ['2/5'] },
        items: [story('3 {many}: 1 is red. What fraction is red?', '', '1/3', '1 / 3'), story('4 {many}: 2 are blue. What fraction are blue?', '', '2/4', '2 / 4'),
          story('6 {many}: 5 are big. What fraction are big?', '', '5/6', '5 / 6'), story('2 {many}: 1 is small. What fraction is small?', '', '1/2', '1 / 2'),
          story('10 {many}: 3 are new. What fraction are new?', '', '3/10', '3 / 10'), story('8 {many}: 7 are old. What fraction are old?', '', '7/8', '7 / 8')]
      },
      p2: {
        items: [story('{a} has 10 {many}. 4 are sold. What fraction are sold?', '', '4/10', '4 / 10'), story('{b} has 6 {many}. 2 are given away. What fraction are left?', '', '4/6', '(6 − 2) / 6'),
          story('A team has 9 players. 5 are girls. What fraction are boys?', '', '4/9', '(9 − 5) / 9'), story('{a} has 8 {many}. 3 break. What fraction do not break?', '', '5/8', '(8 − 3) / 8'),
          { q: 'Draw 5 circles. Shade 2/5 of them.', draw: { h: 50, key: 'Any 2 of the 5 circles shaded.' } },
          story('A class has 10 students. 6 walk to school. What fraction walk?', '', '6/10', '6 / 10')]
      },
      p3: {
        items: [story('A box has 6 pencils. 1/6 are red. How many are red?', 'red', 1, '6 / 6'), story('{b} has 10 {many}. 1/10 are new. How many are new?', 'new', 1, '10 / 10'),
          story('A team of 8 has 3 goalies. What fraction are not goalies?', '', '5/8', '(8 − 3) / 8'),
          story('{a} has 4 {many}. 1/4 is in a {cont}. How many are in the {cont}?', 'in the {cont}', 1, '4 / 4'),
          { q: 'Draw 10 dots. Circle 7/10 of them.', draw: { h: 50, key: '10 dots with any 7 circled.' } },
          story('A family of 5 has 2 adults. What fraction are children?', '', '3/5', '(5 − 2) / 5')]
      },
      think: {
        items: [{ q: '{b} has 2 {conts} of 4 {many}. {b} says 1 {cont} is 1/4 of the {many}. What went wrong?', lines: { n: 3, key: '1 {cont} is 4 of 8 {many}: 4/8, or 1/2.' } },
          { q: 'Make a set where 3/5 are circles. Draw it.', draw: { h: 70, key: '5 shapes, 3 of them circles.' } },
          { q: 'Is 1/2 of a set of 10 more or less than 1/2 of a set of 4? Explain.', lines: { n: 3, key: 'More: half of 10 is 5, half of 4 is 2. The set size matters.' } },
          { q: 'Write a fraction story about a set.', lines: { n: 3, key: 'For example: {a} has 6 {many}; 2 are in a {cont}, so 2/6 are in the {cont}.' } }]
      }
    },

    share: {
      watch: 'giving each person a whole and forgetting the leftover wholes. Cut every leftover whole into as many parts as there are people.',
      goal: 'I can share wholes equally.',
      learn: {
        show: { pic: ['wholes', { n: 3 }], cap: '3 bannock shared by 4: cut each into 4', eq: ['3 ÷ 4 = 3/4'] },
        together: [{ q: '2 wholes shared by 3 people', eq: ['2 ÷ 3 = []'], a: ['2/3'] }, { q: '1 whole shared by 5 people', eq: ['1 ÷ 5 = []'], a: ['1/5'] }],
        cue: 'Cut each whole into one piece for each person. Each person gets one piece of every whole.',
        own: [{ eq: ['3 ÷ 5 = []'], a: ['3/5'] }, { eq: ['2 ÷ 4 = []'], a: ['2/4'] }, story('4 friends share 3 pizzas. How much does each get?', 'pizza', '3/4', '3 / 4'),
          story('6 people share 5 pies. How much does each get?', 'pie', '5/6', '5 / 6')]
      },
      p1: {
        show: { pic: ['wholes', { n: 1 }], cap: '1 shared by 2', eq: ['1 ÷ 2 = 1/2'] },
        items: [{ eq: ['1 ÷ 3 = []'], a: ['1/3'] }, { eq: ['1 ÷ 4 = []'], a: ['1/4'] }, { eq: ['2 ÷ 5 = []'], a: ['2/5'] }, { eq: ['3 ÷ 8 = []'], a: ['3/8'] },
          story('2 friends share 1 sandwich. How much does each get?', 'sandwich', '1/2', '1 / 2'), story('3 friends share 2 cakes. How much does each get?', 'cake', '2/3', '2 / 3')]
      },
      p2: {
        items: [{ eq: ['4 ÷ 5 = []'], a: ['4/5'] }, { eq: ['5 ÷ 8 = []'], a: ['5/8'] }, { eq: ['7 ÷ 10 = []'], a: ['7/10'] },
          { q: 'Draw 2 wholes shared by 3 people.', draw: { h: 70, key: 'Each whole cut into 3 parts; each person gets 2 parts: 2/3.' } },
          story('8 campers share 3 loaves. How much does each get?', 'loaf', '3/8', '3 / 8'), story('10 students share 7 pizzas. How much does each get?', 'pizza', '7/10', '7 / 10')]
      },
      p3: {
        items: [{ eq: ['[] ÷ 6 = 5/6'], a: [5] }, { eq: ['3 ÷ [] = 3/4'], a: [4] }, { eq: ['9 ÷ 10 = []'], a: ['9/10'] },
          story('5 friends share 4 pies. How much does each get?', 'pie', '4/5', '4 / 5'),
          story('6 people share 1 cake. How much does each get?', 'cake', '1/6', '1 / 6'), TF('2 ÷ 4 = 1/2', true)]
      },
      think: {
        items: [{ q: '{b} shared 3 pizzas among 4 people and says each gets 1/4. What went wrong?', lines: { n: 3, key: 'Each pizza gives each person 1/4, and there are 3 pizzas: 3/4.' } },
          { q: 'Who gets more: 1 cake shared by 3, or 2 cakes shared by 3?', pick: { opts: ['1 ÷ 3', '2 ÷ 3'], ans: 1, big: true } },
          { q: 'Draw how 4 people share 3 bannock.', draw: { h: 90, key: 'Each of the 3 cut into 4 pieces; each person gets 3 pieces: 3/4.' } },
          { q: 'Write a sharing story for 5 ÷ 8.', lines: { n: 3, key: 'For example: 8 friends share 5 pies; each gets 5/8 of a pie.' } }]
      }
    },

    'big-share': {
      watch: 'writing 5/4 as 1/4 or as 4/5. Give each person a whole first, then share what is left.',
      goal: 'I can share when each person gets more than one whole.',
      learn: {
        show: { pic: ['wholes', { n: 5 }], cap: '5 shared by 4: 1 each, then share 1 more', eq: ['5 ÷ 4 = 5/4', '5/4 = 1 + 1/4'] },
        together: [{ eq: ['7 ÷ 3 = []/3', '7/3 = [] + 1/3'], a: [7, 2] }, { eq: ['6 ÷ 4 = []', '6/4 = 1 + []'], a: ['6/4', '2/4'] }],
        cue: 'Give each a whole first. Share the rest into equal parts.',
        own: [{ eq: ['5 ÷ 2 = []', '5/2 = 2 + []'], a: ['5/2', '1/2'] }, { eq: ['7 ÷ 4 = []', '7/4 = 1 + []'], a: ['7/4', '3/4'] },
          { eq: ['9 ÷ 4 = []', '9/4 = 2 + []'], a: ['9/4', '1/4'] }, { eq: ['4 ÷ 3 = []', '4/3 = 1 + []'], a: ['4/3', '1/3'] }]
      },
      p1: {
        show: { pic: ['wholes', { n: 3 }], cap: '3 shared by 2', eq: ['3/2 = 1 + 1/2'] },
        items: [{ eq: ['3/2 = [] + 1/2'], a: [1] }, { eq: ['5/4 = 1 + []'], a: ['1/4'] }, { eq: ['5/3 = 1 + []'], a: ['2/3'] }, { eq: ['7/2 = [] + 1/2'], a: [3] },
          { eq: ['6/5 = 1 + []'], a: ['1/5'] }, { eq: ['4/2 = []'], a: [2] }]
      },
      p2: {
        items: [{ eq: ['11 ÷ 4 = []', '11/4 = 2 + []'], a: ['11/4', '3/4'] }, { eq: ['8 ÷ 3 = []', '8/3 = 2 + []'], a: ['8/3', '2/3'] },
          story('4 friends share 6 pizzas. How much does each get?', 'pizzas', '6/4', '6 / 4'),
          story('3 campers share 5 bannock. How much does each get?', 'bannock', '5/3', '5 / 3'),
          { eq: ['10/4 = 2 + []'], a: ['2/4'] }, TF('9/3 = 3', true)]
      },
      p3: {
        items: [{ eq: ['13 ÷ 4 = []', '13/4 = 3 + []'], a: ['13/4', '1/4'] }, { eq: ['17 ÷ 5 = []', '17/5 = 3 + []'], a: ['17/5', '2/5'] },
          story('6 friends share 9 pies. How much does each get?', 'pies', '9/6', '9 / 6'), { eq: ['[]/4 = 2 + 3/4'], a: [11] },
          { eq: ['[]/3 = 4 + 1/3'], a: [13] }, TF('7/2 = 3 + 1/2', true)]
      },
      think: {
        items: [{ q: '{b} says 5 cakes shared by 4 is 1/4 each. What went wrong?', lines: { n: 3, key: 'Each gets 1 whole cake and 1/4 more: 5/4, more than 1.' } },
          { q: 'Draw 7 pizzas shared by 4 people.', draw: { h: 90, key: '1 whole each, then 3 pizzas cut into fourths: 1 and 3/4 each.' } },
          { q: 'When is a share bigger than 1 whole?', lines: { n: 2, key: 'When there are more wholes than people.' } },
          { eq: ['[] ÷ 4 = 2'], a: [8] }]
      }
    },

    'same-den': {
      watch: 'thinking the fraction with bigger numbers is always bigger. With the same denominator, the parts are the same size: count them.',
      goal: 'I can compare fractions with the same denominator.',
      learn: {
        show: { pic: ['frac', { n: 5, k: 3 }], cap: 'Same size parts: 3 parts beat 2', eq: ['3/5 > 2/5'] },
        together: [CMP('4/6', '5/6'), CMP('7/8', '3/8')],
        cue: 'Same denominator: compare the numerators.',
        own: [CMP('2/4', '3/4'), CMP('6/10', '4/10'), CMP('1/3', '2/3'), CMP('5/8', '5/8')]
      },
      p1: {
        show: { cap: '1 part is less than 3 parts', eq: ['1/4 < 3/4'] },
        items: [CMP('1/3', '2/3'), CMP('3/5', '1/5'), CMP('2/6', '5/6'), CMP('4/4', '3/4'), CMP('7/10', '9/10'), CMP('2/8', '2/8')]
      },
      p2: {
        items: [CMP('5/6', '3/6'), CMP('2/10', '8/10'), CMP('4/5', '2/5'), CMP('3/8', '7/8'),
          { q: 'Least to greatest: 3/8, 1/8, 6/8', eq: ['[] < [] < []'], a: ['1/8', '3/8', '6/8'], set: ['3/8', '1/8', '6/8'] },
          { q: '{a} ate 3/8 of a pie. {b} ate 5/8. Who ate more?', pick: { opts: ['3/8', '5/8'], ans: 1, big: true } }]
      },
      p3: {
        items: [CMP('9/10', '7/10'), CMP('4/6', '4/6'), CMP('1/5', '4/5'), CMP('5/8', '3/8'),
          { q: 'Greatest to least: 4/10, 9/10, 1/10, 6/10', eq: ['[] > [] > [] > []'], a: ['9/10', '6/10', '4/10', '1/10'], set: ['4/10', '9/10', '1/10', '6/10'], wide: true },
          { q: 'Circle the fraction closest to 1.', pick: { opts: ['3/6', '5/6', '1/6'], ans: 1, big: true } }]
      },
      think: {
        items: [{ q: 'Why is 3/5 more than 2/5?', lines: { n: 3, key: 'Fifths are the same size, and 3 of them is more than 2.' } },
          { q: 'Write a fraction with denominator 8 that is between 3/8 and 7/8.', lines: { n: 2, key: '4/8, 5/8 or 6/8.' } },
          { q: 'Draw bars to show 2/6 < 5/6.', draw: { h: 90, key: 'Two same-size bars cut into 6; 2 parts shaded and 5 parts shaded.' } },
          { q: 'Which is more: 6/6 or 5/6? How much more?', lines: { n: 2, key: '6/6 (a whole) is 1/6 more than 5/6.' } }]
      }
    },

    'same-num': {
      watch: 'thinking 1/8 > 1/4 because 8 > 4. More parts means smaller parts: fold paper strips to see.',
      goal: 'I can compare fractions with the same numerator.',
      learn: {
        show: { pic: ['frac', { n: 4, k: 1 }], cap: 'Fourths are bigger than eighths', eq: ['1/4 > 1/8'] },
        together: [CMP('1/3', '1/5'), CMP('2/10', '2/4')],
        cue: 'Same numerator: the smaller denominator is the bigger fraction.',
        own: [CMP('1/2', '1/6'), CMP('3/8', '3/5'), CMP('1/10', '1/3'), CMP('2/3', '2/6')]
      },
      p1: {
        show: { cap: 'Halves are bigger than thirds', eq: ['1/2 > 1/3'] },
        items: [CMP('1/4', '1/2'), CMP('1/3', '1/6'), CMP('1/5', '1/10'), CMP('1/8', '1/4'), CMP('1/6', '1/6'), CMP('1/10', '1/2')]
      },
      p2: {
        items: [CMP('2/5', '2/3'), CMP('3/4', '3/8'), CMP('4/10', '4/5'), CMP('2/6', '2/8'),
          { q: 'Least to greatest: 1/3, 1/8, 1/5', eq: ['[] < [] < []'], a: ['1/8', '1/5', '1/3'], set: ['1/3', '1/8', '1/5'] },
          { q: '{a} has 1/4 of a pizza. {b} has 1/6 of the same size pizza. Who has more?', pick: { opts: ['1/4', '1/6'], ans: 0, big: true } }]
      },
      p3: {
        items: [CMP('3/10', '3/4'), CMP('5/8', '5/6'), CMP('2/2', '2/10'), CMP('4/5', '4/6'),
          { q: 'Greatest to least: 1/10, 1/2, 1/4, 1/6', eq: ['[] > [] > [] > []'], a: ['1/2', '1/4', '1/6', '1/10'], set: ['1/10', '1/2', '1/4', '1/6'], wide: true },
          { q: 'Circle the smallest.', pick: { opts: ['3/4', '3/10', '3/5'], ans: 1, small: true } }]
      },
      think: {
        items: [{ q: '{b} says 1/8 is bigger than 1/4 because 8 is bigger than 4. What would you tell {b}?', lines: { n: 3, key: 'More parts means smaller parts. 1/8 is smaller than 1/4.' } },
          { q: 'Draw bars to show 1/3 > 1/6.', draw: { h: 90, key: 'Two same-size bars: one cut in 3, one in 6; 1 part of each shaded.' } },
          { q: 'Is 1/2 of a small pizza always more than 1/4 of a big pizza? Explain.', lines: { n: 3, key: 'No. Compare fractions only of the same-size whole.' } },
          { q: 'Write two fractions with numerator 3. Which is bigger?', lines: { n: 2, key: 'For example: 3/4 > 3/10 (fourths are bigger).' } }]
      }
    },

    'count-by': {
      watch: 'counting 1/4, 2/4, 3/4, 4/4, 5/4 without seeing that 4/4 is 1 whole. Mark each whole on the number line.',
      goal: 'I can count by fractions.',
      learn: {
        show: { cap: 'Count by fourths', eq: ['1/4, 2/4, 3/4, 4/4 = 1'] },
        together: [{ eq: ['1/3, 2/3, [], 4/3'], a: ['3/3'] }, { eq: ['1/5, 2/5, 3/5, [], []'], a: ['4/5', '5/5'] }],
        cue: 'Count the pieces. 4 fourths make 1 whole, 3 thirds make 1 whole.',
        own: [{ eq: ['1/2, [], 3/2, []'], a: ['2/2', '4/2'] }, { eq: ['3/8, 4/8, [], []'], a: ['5/8', '6/8'] },
          { eq: ['6/10, 7/10, [], []'], a: ['8/10', '9/10'] }, { eq: ['4/4 = []'], a: [1] }]
      },
      p1: {
        show: { cap: 'Count by halves', eq: ['1/2, 2/2, 3/2'] },
        items: [{ eq: ['1/4, 2/4, [], []'], a: ['3/4', '4/4'] }, { eq: ['1/3, [], 3/3'], a: ['2/3'] },
          { eq: ['1/6, 2/6, [], []'], a: ['3/6', '4/6'] }, { eq: ['2/5, 3/5, [], []'], a: ['4/5', '5/5'] },
          { eq: ['3/3 = []'], a: [1] }, { eq: ['8/8 = []'], a: [1] }]
      },
      p2: {
        items: [{ eq: ['5/10, 6/10, [], [], []'], a: ['7/10', '8/10', '9/10'], wide: true }, { eq: ['3/4, 4/4, [], []'], a: ['5/4', '6/4'] },
          { eq: ['2/3, [], 4/3, []'], a: ['3/3', '5/3'] }, { q: 'How many jumps of 1/6 make 1 whole?', eq: ['[] × 1/6 = 1'], a: [6] },
          { eq: ['[]/5 = 1'], a: [5] }, { q: 'Count back by fourths.', eq: ['4/4, 3/4, [], []'], a: ['2/4', '1/4'] }]
      },
      p3: {
        items: [{ eq: ['7/8, 8/8, [], [], []'], a: ['9/8', '10/8', '11/8'], wide: true }, { eq: ['8/10, 9/10, [], []'], a: ['10/10', '11/10'] },
          { q: 'Count back by thirds.', eq: ['5/3, 4/3, [], []'], a: ['3/3', '2/3'] }, { q: 'How many jumps of 1/10 make 2 wholes?', eq: ['[] × 1/10 = 2'], a: [20] },
          { eq: ['[]/4 = 2'], a: [8] }, TF('6/6 = 1', true)]
      },
      think: {
        items: [{ q: '{b} counts 1/4, 2/4, 3/4, 4/4, 5/4 and says 4/4 is not a whole. What would you tell {b}?', lines: { n: 3, key: '4 fourths fill the whole, so 4/4 = 1.' } },
          { q: 'Draw a number line from 0 to 2 and mark the halves.', draw: { h: 70, key: '0, 1/2, 1 (2/2), 3/2, 2 (4/2).' } },
          { q: 'How many sixths are in 3 wholes?', eq: ['[] × 1/6 = 3'], a: [18] },
          { q: 'Count by thirds from 0 to 2. Circle the whole numbers.', lines: { n: 2, key: '1/3, 2/3, 3/3 (1), 4/3, 5/3, 6/3 (2).' } }]
      }
    },

    mixed: {
      watch: 'writing 7/4 as 7 and 1/4. Group the fourths into wholes: 4 fourths make 1 whole.',
      goal: 'I can count past one whole.',
      learn: {
        show: { cap: '7 fourths: one whole and 3 more', eq: ['7/4 = 4/4 + 3/4', '7/4 = 1 + 3/4'] },
        together: [{ eq: ['5/3 = 1 + []'], a: ['2/3'] }, { eq: ['9/4 = [] + 1/4'], a: [2] }],
        cue: 'Group the parts into wholes. What is left is the fraction part.',
        own: [{ eq: ['3/2 = 1 + []'], a: ['1/2'] }, { eq: ['7/5 = 1 + []'], a: ['2/5'] }, { eq: ['11/10 = 1 + []'], a: ['1/10'] }, { eq: ['10/4 = [] + 2/4'], a: [2] }]
      },
      p1: {
        show: { cap: '5 halves: 2 wholes and 1 half', eq: ['5/2 = 2 + 1/2'] },
        items: [{ eq: ['4/3 = 1 + []'], a: ['1/3'] }, { eq: ['5/4 = 1 + []'], a: ['1/4'] }, { eq: ['6/5 = 1 + []'], a: ['1/5'] },
          { eq: ['7/6 = 1 + []'], a: ['1/6'] }, { eq: ['3/2 = [] + 1/2'], a: [1] }, { eq: ['8/4 = []'], a: [2] }]
      },
      p2: {
        items: [{ eq: ['13/10 = 1 + []'], a: ['3/10'] }, { eq: ['11/4 = [] + 3/4'], a: [2] }, { eq: ['7/3 = 2 + []'], a: ['1/3'] }, { eq: ['1 + 5/8 = []/8'], a: [13] },
          story('A recipe uses 1/4 cup each time. {a} uses it 6 times. How many cups?', 'cups', '6/4', '6 / 4'), TF('9/5 = 1 + 4/5', true)]
      },
      p3: {
        items: [{ eq: ['17/10 = 1 + []'], a: ['7/10'] }, { eq: ['14/4 = [] + 2/4'], a: [3] }, { eq: ['2 + 1/3 = []/3'], a: [7] }, { eq: ['3 + 1/2 = []/2'], a: [7] },
          story('{b} walks 1/3 km each day for 7 days. How far?', 'km', '7/3', '7 / 3'), TF('11/6 = 2 + 1/6', false)]
      },
      think: {
        items: [{ q: '{b} writes 7/4 as 7 and 1/4. What went wrong?', lines: { n: 3, key: '4 fourths make 1 whole: 7/4 = 1 and 3/4.' } },
          { q: 'Draw 2 and 1/3 with circles.', draw: { h: 80, key: '2 whole circles and 1 circle with 1 of 3 parts shaded.' } },
          { q: 'Which is more: 9/4 or 2? How do you know?', lines: { n: 3, key: '9/4 = 2 + 1/4, so it is 1/4 more than 2.' } },
          { eq: ['[]/5 = 2 + 3/5'], a: [13] }]
      }
    },

    'add-units': {
      watch: 'adding the denominators too (1/5 + 1/5 = 2/10). The size of the piece does not change; only the count does.',
      goal: 'I can add copies of a unit fraction.',
      learn: {
        show: { cap: '3 copies of 1/5', eq: ['1/5 + 1/5 + 1/5 = 3/5', '3 × 1/5 = 3/5'] },
        together: [UN(2, 4), { eq: ['4 × 1/6 = []'], a: ['4/6'] }],
        cue: 'Count the pieces. The size of the piece (the denominator) stays the same.',
        own: [UN(3, 8), { eq: ['5 × 1/10 = []'], a: ['5/10'] }, { eq: ['2 × 1/3 = []'], a: ['2/3'] }, { eq: ['[] × 1/4 = 3/4'], a: [3] }]
      },
      p1: {
        show: { cap: '2 copies of 1/3', eq: ['1/3 + 1/3 = 2/3'] },
        items: [UN(2, 5), UN(3, 4), UN(2, 6), UN(4, 10), { eq: ['3 × 1/8 = []'], a: ['3/8'] }, { eq: ['2 × 1/2 = []'], a: ['2/2'] }]
      },
      p2: {
        items: [{ eq: ['6 × 1/10 = []'], a: ['6/10'] }, { eq: ['5 × 1/8 = []'], a: ['5/8'] }, { eq: ['[] × 1/6 = 5/6'], a: [5] }, { eq: ['4 × 1/5 = []'], a: ['4/5'] },
          story('{a} eats 1/8 of a pie each day for 3 days. How much pie?', 'pie', '3/8', '3 / 8'), story('A cup holds 1/4 L. {b} fills it 3 times. How many litres?', 'L', '3/4', '3 / 4')]
      },
      p3: {
        items: [{ eq: ['7 × 1/10 = []'], a: ['7/10'] }, { eq: ['[] × 1/8 = 7/8'], a: [7] }, { eq: ['3 × 1/3 = []'], a: [1] }, TF('1/5 + 1/5 = 2/10', false),
          story('{a} runs 1/10 km 9 times. How far?', 'km', '9/10', '9 / 10'), story('A jug holds 1/6 L. {b} pours it 5 times. How many litres?', 'L', '5/6', '5 / 6')]
      },
      think: {
        items: [{ q: '{b} says 1/5 + 1/5 = 2/10. What went wrong?', lines: { n: 3, key: '{b} added the denominators. The pieces are still fifths: 2/5.' } },
          { q: 'Draw 4 × 1/6 on a bar.', draw: { h: 60, key: 'A bar cut into 6 with 4 parts shaded: 4/6.' } },
          { q: 'Write a story for 3 × 1/4.', lines: { n: 3, key: 'For example: {a} drinks 1/4 L of juice 3 times: 3/4 L.' } },
          { q: 'How many copies of 1/8 make 1 whole?', eq: ['[] × 1/8 = 1'], a: [8] }]
      }
    },

    recipe: {
      watch: 'stopping at 6/4 without making wholes, or writing 6/4 as 6 and 1/4. Make wholes from groups of 4 fourths.',
      goal: 'I can multiply a unit fraction past one whole.',
      learn: {
        show: { cap: '6 scoops of 1/4 cup', eq: ['6 × 1/4 = 6/4', '6/4 = 1 + 2/4'] },
        together: [{ eq: ['5 × 1/3 = []', '5/3 = 1 + []'], a: ['5/3', '2/3'] }, { eq: ['9 × 1/4 = []', '9/4 = 2 + []'], a: ['9/4', '1/4'] }],
        cue: 'Count the pieces, then group them into wholes.',
        own: [{ eq: ['3 × 1/2 = []', '3/2 = 1 + []'], a: ['3/2', '1/2'] }, { eq: ['7 × 1/5 = []', '7/5 = 1 + []'], a: ['7/5', '2/5'] },
          { eq: ['8 × 1/3 = []', '8/3 = 2 + []'], a: ['8/3', '2/3'] }, { eq: ['12 × 1/10 = []', '12/10 = 1 + []'], a: ['12/10', '2/10'] }]
      },
      p1: {
        show: { cap: '3 halves', eq: ['3 × 1/2 = 3/2 = 1 + 1/2'] },
        items: [{ eq: ['5 × 1/4 = []'], a: ['5/4'] }, { eq: ['4 × 1/3 = []'], a: ['4/3'] }, { eq: ['5/4 = 1 + []'], a: ['1/4'] }, { eq: ['4/3 = 1 + []'], a: ['1/3'] },
          { eq: ['6 × 1/5 = []'], a: ['6/5'] }, { eq: ['2 × 1/2 = []'], a: [1] }]
      },
      p2: {
        items: [{ eq: ['7 × 1/4 = []', '7/4 = 1 + []'], a: ['7/4', '3/4'] }, { eq: ['11 × 1/10 = []', '11/10 = 1 + []'], a: ['11/10', '1/10'] },
          story('A recipe needs 1/3 cup of oats, made 5 times. How many cups?', 'cups', '5/3', '5 / 3'),
          story('{b} walks 1/2 km each day for 7 days. How far?', 'km', '7/2', '7 / 2'), { eq: ['10 × 1/4 = [] + 2/4'], a: [2] }, TF('8 × 1/4 = 2', true)]
      },
      p3: {
        items: [{ eq: ['13 × 1/4 = []', '13/4 = 3 + []'], a: ['13/4', '1/4'] }, { eq: ['17 × 1/8 = [] + 1/8'], a: [2] },
          story('Bannock needs 1/4 cup of oil, made 9 times. How many cups?', 'cups', '9/4', '9 / 4'),
          story('A tap drips 1/10 L each minute for 25 minutes. How many litres?', 'L', '25/10', '25 / 10'), { eq: ['[] × 1/3 = 2 + 2/3'], a: [8] }, TF('7 × 1/2 = 3 + 1/2', true)]
      },
      think: {
        items: [{ q: '{b} says 6 × 1/4 = 6 and 1/4. What went wrong?', lines: { n: 3, key: '6 × 1/4 = 6/4. 4 fourths make 1 whole: 1 and 2/4.' } },
          { q: 'A recipe needs 3/4 cup of flour. How much for 2 batches?', eq: ['2 × 3/4 = []/4'], a: [6] },
          { q: 'Write a recipe story for 5 × 1/2.', lines: { n: 3, key: 'For example: 5 batches use 1/2 cup each: 5/2 = 2 and 1/2 cups.' } },
          { q: 'How many 1/3 cups make 4 cups?', eq: ['[] × 1/3 = 4'], a: [12] }]
      }
    }
  } });
})();
