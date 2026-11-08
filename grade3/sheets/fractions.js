/* Grade 3 Fractions and Fair Shares: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js and
   sheet-pics-upper.js). One set per idea of the lessons in chapters/fractions.js: Learn, Practise 1 to 3 and Think.
   Every question is written here, not made at random. Theme words: {a} {b} names. Fractions are written 3/4.
   Ontario 2020 (the codes the lessons name): B1.6 fair shares and naming fractions; B1.7 equal shares with different
   names; B2.7 groups of halves, thirds and fourths make wholes; B2.8 counting unit fractions.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* a shaded picture of k of n equal parts, and its fraction */
  function FR(n, k, shape) { return { pic: ['frac', { n: n, k: k, shape: shape || 'bar' }], eq: ['[]'], a: [k + '/' + n] }; }
  /* "Equal parts?" under a whole cut evenly, or at the cuts given */
  function EQ(n, shape, cuts) { var p = { n: n, shape: shape || 'bar' }; if (cuts) p.uneven = cuts; return { q: 'Equal parts?', pic: ['frac', p], pick: { opts: ['yes', 'no'], ans: cuts ? 1 : 0, equal: true } }; }
  /* compare two fractions with <, > or = */
  function CMP(p, q) {
    var v = function (f) { var x = f.split('/'); return x[0] / x[1]; };
    return { eq: [p + ' ? ' + q], pick: { opts: ['<', '>', '='], ans: v(p) < v(q) ? 0 : v(p) > v(q) ? 1 : 2, cmp: [p, q] }, pickLast: true };
  }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* n copies of 1/d added */
  function UN(n, d) { var r = []; for (var i = 0; i < n; i++) r.push('1/' + d); return { eq: [r.join(' + ') + ' = []'], a: [n + '/' + d], wide: n > 3 }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  /* t things dealt to g people: wholes each and how many left */
  function DL(t, g) { return { q: t + ' bars, ' + g + ' friends.', eq: [t + ' ÷ ' + g + ' = [] R []'], a: [Math.floor(t / g), t % g] }; }
  /* t things shared by g people, the leftover cut: wholes each and the piece */
  function CU(t, g) { return { eq: [t + ' ÷ ' + g + ' = [] + []'], a: [Math.floor(t / g), t % g + '/' + g] }; }
  /* the bigger share of two "things ÷ people" */
  function BS(a, b, q) { var v = function (s) { var x = s.split(' ÷ '); return x[0] / x[1]; }; return { q: q || 'Who gets more each?', pick: { opts: [a, b], ans: v(a) > v(b) ? 0 : 1, big: true } }; }
  /* the one choice equal to a value */
  function EV(q, opts, ans, v) { return { q: q, pick: { opts: opts, ans: ans, val: v } }; }

  S.register('fractions', { code: 'FR', ideas: {

    equal: {
      watch: 'calling any one of 2 parts "a half". Ask: "Are the parts the same size?" before naming a fraction.',
      goal: 'I can tell if a whole is cut into equal parts.',
      learn: {
        show: { pic: ['frac', { n: 4, k: 1 }], cap: '4 equal parts: each is 1/4', eq: ['4/4 = 1'] },
        together: [EQ(2, 'bar', [0, 0.7, 1]), EQ(3, 'circle')],
        cue: 'Check the sizes first. Fractions need equal parts.',
        own: [EQ(4), EQ(4, 'bar', [0, 0.2, 0.5, 0.7, 1]), FR(2, 1, 'circle')]
      },
      p1: {
        show: { pic: ['frac', { n: 2, k: 1, shape: 'circle' }], cap: '2 equal parts: halves', eq: ['1/2 + 1/2 = 1'] },
        items: [EQ(3), EQ(2, 'bar', [0, 0.35, 1]), EQ(6, 'circle'), EQ(3, 'bar', [0, 0.5, 0.75, 1]), FR(4, 1, 'circle'), FR(3, 1)]
      },
      p2: {
        items: [{ q: 'Draw a bar cut into 4 equal parts.', draw: { h: 50, key: ['frac', { n: 4 }] } }, { q: 'Draw a circle cut into 2 equal parts.', draw: { h: 70, key: ['frac', { n: 2, shape: 'circle' }] } },
          EQ(5, 'bar', [0, 0.1, 0.4, 0.6, 0.8, 1]), EQ(8, 'circle'), FR(5, 1), FR(6, 1, 'circle')]
      },
      p3: {
        items: [{ q: 'Draw a bar cut into 3 equal parts.', draw: { h: 50, key: ['frac', { n: 3 }] } }, { q: 'Draw a bar cut into 6 equal parts.', draw: { h: 50, key: ['frac', { n: 6 }] } },
          EQ(4, 'bar', [0, 0.25, 0.5, 0.8, 1]), EQ(10), { q: 'How many fourths make 1 whole?', eq: ['[] × 1/4 = 1'], a: [4] }, TF('1/3 + 1/3 + 1/3 = 1', true)]
      },
      think: {
        items: [{ q: '{b} cuts a bannock into 2 pieces and says each is 1/2. One piece is much bigger. Is {b} right?', lines: { n: 3, key: 'No. Halves must be 2 equal parts.' } },
          { q: 'Show two ways to cut a square into 4 equal parts.', draw: { h: 90, key: 'For example: 4 strips, or 4 small squares.' } },
          { q: 'Why do we check the sizes before we name a fraction?', lines: { n: 3, key: 'A fraction names equal parts. Unequal parts have no fraction name.' } },
          { q: 'How many halves make 1 whole?', eq: ['[] × 1/2 = 1'], a: [2] }]
      }
    },

    piece: {
      watch: 'naming the piece by the shaded parts, or saying "one threeth". Ask: "How many equal parts make the whole?"',
      goal: 'I can name one equal part of a whole.',
      learn: {
        show: { pic: ['frac', { n: 3, k: 1 }], cap: '3 equal parts: one third', eq: ['1/3'] },
        together: [FR(4, 1), FR(5, 1, 'circle')],
        cue: 'Count all the equal parts. That is the bottom number.',
        own: [FR(2, 1), FR(8, 1, 'circle'), FR(6, 1)]
      },
      p1: {
        show: { pic: ['frac', { n: 4, k: 1, shape: 'circle' }], cap: '4 parts: one fourth', eq: ['1/4'] },
        items: [FR(3, 1, 'circle'), FR(2, 1), FR(5, 1), FR(6, 1, 'circle'), FR(10, 1), FR(8, 1)]
      },
      p2: {
        items: [FR(4, 1), FR(10, 1, 'circle'), { q: 'How many sixths make 1 whole?', eq: ['[] × 1/6 = 1'], a: [6] },
          { q: 'How many fifths make 1 whole?', eq: ['[] × 1/5 = 1'], a: [5] }, { q: 'Draw 1/3 of a bar.', draw: { h: 50, key: ['frac', { n: 3, k: 1 }] } }, FR(3, 1)]
      },
      p3: {
        items: [{ q: 'How many eighths make 1 whole?', eq: ['[] × 1/8 = 1'], a: [8] }, { q: 'How many tenths make 1 whole?', eq: ['[] × 1/10 = 1'], a: [10] },
          { q: 'Draw 1/5 of a bar.', draw: { h: 50, key: ['frac', { n: 5, k: 1 }] } }, { q: 'Draw 1/4 of a circle.', draw: { h: 70, key: ['frac', { n: 4, k: 1, shape: 'circle' }] } },
          { q: 'Circle the bigger piece.', pick: { opts: ['1/2', '1/8'], ans: 0, big: true } }, TF('1/6 + 1/6 + 1/6 + 1/6 + 1/6 + 1/6 = 1', true)]
      },
      think: {
        items: [{ q: '{a} says one of 3 equal parts is "one threeth". What is its name?', lines: { n: 2, key: 'One third: 1/3.' } },
          { q: 'Why is 1/2 of a bar bigger than 1/4 of the same bar?', lines: { n: 3, key: 'The bar is cut into fewer parts, so each part is bigger.' } },
          { q: 'Draw a bar. Cut it into eighths and shade 1/8.', draw: { h: 60, key: ['frac', { n: 8, k: 1 }] } },
          { q: 'How many thirds make 1 whole?', eq: ['[] × 1/3 = 1'], a: [3] }]
      }
    },

    name: {
      watch: 'flipping the numbers (4/3), or putting the white parts on the bottom (3/1). All the parts go on the bottom.',
      goal: 'I can name a fraction with a top and a bottom number.',
      learn: {
        show: { pic: ['frac', { n: 4, k: 3, shape: 'circle' }], cap: '3 of 4 parts shaded', eq: ['3/4'] },
        together: [FR(5, 2), FR(6, 5, 'circle')],
        cue: 'Bottom: all the equal parts. Top: the shaded parts.',
        own: [FR(8, 3), FR(3, 2, 'circle'), FR(10, 7)]
      },
      p1: {
        show: { pic: ['frac', { n: 3, k: 2 }], cap: '2 of 3 parts', eq: ['2/3'] },
        items: [FR(4, 3), FR(2, 1, 'circle'), FR(5, 4), FR(6, 2), FR(8, 5, 'circle'), FR(3, 3)]
      },
      p2: {
        items: [FR(10, 3), FR(6, 4, 'circle'), FR(8, 7), FR(5, 3, 'circle'),
          { q: 'Draw a bar in 5 parts. Shade 3/5.', draw: { h: 50, key: ['frac', { n: 5, k: 3 }] } }, { q: 'Draw a circle in 4 parts. Shade 2/4.', draw: { h: 70, key: ['frac', { n: 4, k: 2, shape: 'circle' }] } }]
      },
      p3: {
        items: [FR(10, 9), FR(8, 3, 'circle'), { q: 'Draw a bar in 6 parts. Shade 5/6.', draw: { h: 50, key: ['frac', { n: 6, k: 5 }] } },
          { q: 'A bar has 8 parts. 3 are shaded. What fraction is not shaded?', eq: ['[]'], a: ['5/8'], calc: '(8 − 3) / 8' },
          { q: 'A pie has 6 parts. 1 is eaten. What fraction is left?', eq: ['[]'], a: ['5/6'], calc: '(6 − 1) / 6' }, TF('4/4 = 1', true)]
      },
      think: {
        items: [{ q: '{b} shades 3 of 4 parts and writes 3/1. What went wrong?', lines: { n: 3, key: '{b} put the white part on the bottom. All 4 parts go on the bottom: 3/4.' } },
          { q: 'Draw a picture of 2/5.', draw: { h: 60, key: ['frac', { n: 5, k: 2 }] } },
          { q: 'What does the bottom number tell you?', lines: { n: 2, key: 'How many equal parts make the whole.' } },
          { q: 'A pizza has 8 slices. {a} eats 3. What fraction is left?', eq: ['[]'], a: ['5/8'], calc: '(8 − 3) / 8' }]
      }
    },

    wholes: {
      watch: 'stopping too early, or giving the extras to one person. Ask: "Can everyone get one more?"',
      goal: 'I can hand out wholes fairly first.',
      learn: {
        show: { pic: ['wholes', { n: 7 }], cap: '7 bars, 3 friends: 2 each, 1 left', eq: ['7 ÷ 3 = 2 R 1'] },
        together: [DL(5, 2), DL(10, 4)],
        cue: 'Give one each, again and again, until there are not enough for everyone.',
        own: [DL(7, 2), DL(9, 4), DL(11, 3)]
      },
      p1: {
        show: { pic: ['wholes', { n: 5 }], cap: '5 bars, 2 friends', eq: ['5 ÷ 2 = 2 R 1'] },
        items: [DL(3, 2), DL(7, 3), DL(9, 2), DL(6, 4), DL(10, 3), DL(13, 4)]
      },
      p2: {
        items: [DL(11, 2), DL(14, 3), DL(17, 5), DL(15, 4),
          { q: '{a} shares 13 apples with 3 friends. Each gets how many? How many are left?', eq: ['13 ÷ 3 = [] R []'], a: [4, 1] },
          { q: '{b} shares 9 muffins with 4 friends. Each gets how many? How many are left?', eq: ['9 ÷ 4 = [] R []'], a: [2, 1] }]
      },
      p3: {
        items: [DL(19, 4), DL(23, 5), DL(20, 6), DL(25, 8),
          { q: '16 pencils, 5 friends. How many each, and how many left?', eq: ['16 ÷ 5 = [] R []'], a: [3, 1] }, { eq: ['[] ÷ 3 = 4 R 2'], a: [14] }]
      },
      think: {
        items: [{ q: '{b} shares 10 bars among 4 friends and gives 2 each. 2 bars are left. Can everyone get one more?', lines: { n: 3, key: 'No. 2 bars are not enough for 4 friends.' } },
          { q: 'Draw 8 bars shared by 3 friends.', draw: { h: 80, key: '2 bars each, 2 bars left.' } },
          { q: 'How can you check a share with multiplication?', lines: { n: 3, key: 'Friends × bars each, plus the leftover, makes the total.' } },
          { eq: ['3 × 4 + 1 = []'], a: [13] }]
      }
    },

    cut: {
      watch: 'cutting the leftover by the number of bars, not people. Ask: "How many people need a piece?"',
      goal: 'I can cut the leftover into fair pieces.',
      learn: {
        show: { pic: ['wholes', { n: 5 }], cap: '5 bars, 2 people: 2 each, cut the last one in 2', eq: ['5 ÷ 2 = 2 + 1/2'] },
        together: [CU(7, 3), CU(9, 4)],
        cue: 'Cut the leftover into one piece for each person.',
        own: [CU(3, 2), CU(4, 3), CU(9, 2)]
      },
      p1: {
        show: { pic: ['wholes', { n: 3 }], cap: '3 bars, 2 people', eq: ['3 ÷ 2 = 1 + 1/2'] },
        items: [CU(5, 4), CU(7, 2), CU(7, 6), CU(10, 3), CU(9, 8), CU(11, 5)]
      },
      p2: {
        items: [CU(11, 2), CU(13, 4), CU(16, 5), CU(13, 6),
          story('5 friends share 6 pizzas. How much does each get?', 'pizzas', '1 + 1/5', '6 / 5'),
          story('3 people share 10 bannock. How much does each get?', 'bannock', '3 + 1/3', '10 / 3')]
      },
      p3: {
        items: [CU(17, 4), CU(21, 10), CU(19, 6), { eq: ['[] ÷ 4 = 2 + 1/4'], a: [9] },
          story('8 friends share 9 pies. How much does each get?', 'pies', '1 + 1/8', '9 / 8'), TF('7 ÷ 2 = 3 + 1/2', true)]
      },
      think: {
        items: [{ q: '{b} shares 7 bars among 3 people and cuts the last bar into 7 pieces. What went wrong?', lines: { n: 3, key: 'There are 3 people, so the bar is cut into 3 pieces: 2 + 1/3 each.' } },
          { q: 'Draw 5 bars shared by 4 people.', draw: { h: 80, key: '1 bar each; the last bar cut into 4: 1 + 1/4 each.' } },
          { q: 'Why does the number of people tell you how to cut?', lines: { n: 3, key: 'Each person needs one equal piece of the leftover.' } },
          { eq: ['5 ÷ [] = 1 + 2/3'], a: [3] }]
      }
    },

    fewer: {
      watch: 'writing the share upside down (4/3), or one piece in all. Each person takes one piece of every thing.',
      goal: 'I can share fewer things than people.',
      learn: {
        show: { pic: ['wholes', { n: 3 }], cap: '3 bars, 4 friends: cut each in 4', eq: ['3 ÷ 4 = 3/4'] },
        together: [{ q: '2 bannock, 5 people', eq: ['2 ÷ 5 = []'], a: ['2/5'] }, { q: '1 pizza, 3 people', eq: ['1 ÷ 3 = []'], a: ['1/3'] }],
        cue: 'Cut every thing into one piece for each person.',
        own: [{ eq: ['2 ÷ 3 = []'], a: ['2/3'] }, { eq: ['3 ÷ 5 = []'], a: ['3/5'] }, story('4 friends share 1 cake. How much does each get?', 'cake', '1/4', '1 / 4')]
      },
      p1: {
        show: { pic: ['wholes', { n: 1 }], cap: '1 pie, 2 people', eq: ['1 ÷ 2 = 1/2'] },
        items: [{ eq: ['1 ÷ 4 = []'], a: ['1/4'] }, { eq: ['2 ÷ 4 = []'], a: ['2/4'] }, { eq: ['3 ÷ 8 = []'], a: ['3/8'] }, { eq: ['1 ÷ 6 = []'], a: ['1/6'] },
          { eq: ['4 ÷ 5 = []'], a: ['4/5'] }, { eq: ['5 ÷ 6 = []'], a: ['5/6'] }]
      },
      p2: {
        items: [{ eq: ['3 ÷ 10 = []'], a: ['3/10'] }, { eq: ['5 ÷ 8 = []'], a: ['5/8'] }, { eq: ['2 ÷ 6 = []'], a: ['2/6'] }, { eq: ['7 ÷ 10 = []'], a: ['7/10'] },
          story('6 campers share 5 bannock. How much does each get?', 'bannock', '5/6', '5 / 6'), story('8 friends share 3 pizzas. How much does each get?', 'pizza', '3/8', '3 / 8')]
      },
      p3: {
        items: [{ eq: ['[] ÷ 5 = 3/5'], a: [3] }, { eq: ['2 ÷ [] = 2/3'], a: [3] }, { eq: ['9 ÷ 10 = []'], a: ['9/10'] },
          { q: 'Draw 2 bars shared by 3 friends.', draw: { h: 70, key: 'Each bar cut into 3; each friend gets 2 pieces: 2/3.' } },
          story('10 students share 7 pies. How much does each get?', 'pie', '7/10', '7 / 10'), TF('3 ÷ 4 = 4/3', false)]
      },
      think: {
        items: [{ q: '{b} shares 3 pizzas among 4 friends and says each gets 1/4. What went wrong?', lines: { n: 3, key: 'Each friend gets 1/4 of every pizza, and there are 3: 3/4.' } },
          { q: 'Draw 2 pies shared by 5 people.', draw: { h: 80, key: 'Each pie cut into 5; each person gets 2 pieces: 2/5.' } },
          { q: 'Write a sharing story for 3 ÷ 8.', lines: { n: 3, key: 'For example: 8 friends share 3 pizzas; each gets 3/8.' } },
          BS('1 ÷ 3', '2 ÷ 3', 'Who gets more: 1 cake shared by 3, or 2 cakes shared by 3?')]
      }
    },

    compare: {
      watch: 'thinking more people means more each ("4 is more than 3"). More people, same things: smaller shares.',
      goal: 'I can tell which share is bigger.',
      learn: {
        show: { pic: ['frac', { n: 4, k: 1 }], cap: '1 bar for 2, or 1 bar for 4?', eq: ['1 ÷ 2 > 1 ÷ 4'] },
        together: [BS('1 ÷ 3', '1 ÷ 5'), BS('6 ÷ 4', '6 ÷ 3')],
        cue: 'Same things, more people: each share is smaller.',
        own: [BS('2 ÷ 5', '2 ÷ 4'), BS('1 ÷ 2', '1 ÷ 6'), BS('8 ÷ 4', '8 ÷ 2')]
      },
      p1: {
        show: { cap: 'Same pizza, more people: smaller slices', eq: ['1 ÷ 3 > 1 ÷ 6'] },
        items: [BS('1 ÷ 4', '1 ÷ 2'), BS('1 ÷ 3', '1 ÷ 8'), BS('2 ÷ 6', '2 ÷ 3'), BS('3 ÷ 4', '3 ÷ 5'), BS('4 ÷ 2', '4 ÷ 4'), BS('5 ÷ 10', '5 ÷ 5')]
      },
      p2: {
        items: [BS('3 ÷ 4', '4 ÷ 4'), BS('2 ÷ 5', '1 ÷ 5'), BS('6 ÷ 3', '6 ÷ 4'), BS('9 ÷ 4', '9 ÷ 3'),
          { eq: ['1 ÷ 2 = []', '1 ÷ 4 = []'], a: ['1/2', '1/4'] }, { eq: ['2 ÷ 3 = []', '2 ÷ 6 = []'], a: ['2/3', '2/6'] }]
      },
      p3: {
        items: [BS('10 ÷ 4', '10 ÷ 5'), BS('7 ÷ 2', '9 ÷ 2'), BS('5 ÷ 8', '5 ÷ 6'), BS('12 ÷ 3', '12 ÷ 4'),
          TF('1 ÷ 5 > 1 ÷ 3', false), TF('4 ÷ 2 > 4 ÷ 4', true)]
      },
      think: {
        items: [{ q: 'Group A: 6 bars for 3 people. Group B: 6 bars for 4 people. {b} says B gets more because 4 > 3. Is {b} right?', lines: { n: 3, key: 'No. A gets 2 each; B gets 1 + 2/4 each. More people, smaller shares.' } },
          { q: 'Draw one share from each group: 1 pizza for 2, and 1 pizza for 3.', draw: { h: 80, key: 'A half and a third of the same pizza; the half is bigger.' } },
          { q: 'When do two groups get the same share?', lines: { n: 3, key: 'When the things and people match up, like 2 for 4 and 3 for 6.' } },
          BS('3 ÷ 6', '4 ÷ 6', 'Who gets more each?')]
      }
    },

    count: {
      watch: 'adding the bottom numbers too (1/3 + 1/3 = 2/6). Ask: "Did the pieces change size?"',
      goal: 'I can count unit fractions to make a fraction.',
      learn: {
        show: { pic: ['frac', { n: 5, k: 3 }], cap: 'one fifth, two fifths, three fifths', eq: ['1/5 + 1/5 + 1/5 = 3/5'] },
        together: [UN(2, 4), UN(3, 6)],
        cue: 'Count the pieces. The size of each piece stays the same.',
        own: [UN(2, 3), UN(3, 8), FR(6, 4)]
      },
      p1: {
        show: { pic: ['frac', { n: 3, k: 2 }], cap: 'two thirds', eq: ['1/3 + 1/3 = 2/3'] },
        items: [UN(2, 5), UN(3, 4), UN(2, 6), UN(3, 10), FR(8, 3), FR(4, 2, 'circle')]
      },
      p2: {
        items: [UN(4, 8), UN(4, 6), UN(5, 10), UN(4, 5), FR(10, 6), FR(6, 5, 'circle')]
      },
      p3: {
        items: [UN(5, 6), UN(5, 8), UN(6, 10), { eq: ['1/4 + 1/4 + [] = 3/4'], a: ['1/4'] }, TF('1/5 + 1/5 = 2/10', false), TF('1/2 + 1/2 = 2/2', true)]
      },
      think: {
        items: [{ q: '{b} says 1/3 + 1/3 = 2/6. What went wrong?', lines: { n: 3, key: '{b} added the bottom numbers. The pieces are still thirds: 2/3.' } },
          { q: 'Draw 1/4 + 1/4 + 1/4 on a bar.', draw: { h: 60, key: ['frac', { n: 4, k: 3 }] } },
          { q: 'How many sixths make 4/6?', eq: ['[] × 1/6 = 4/6'], a: [4] },
          { q: 'Why does the bottom number stay the same when you add pieces?', lines: { n: 3, key: 'The pieces are the same size; only how many changes.' } }]
      }
    },

    top: {
      watch: 'counting the bottom number as the pieces (3/8 is 8 pieces). The top counts the pieces; the bottom gives their size.',
      goal: 'I can tell how many unit pieces make a fraction.',
      learn: {
        show: { pic: ['frac', { n: 8, k: 5 }], cap: '5 pieces of 1/8', eq: ['5/8 = 5 × 1/8'] },
        together: [{ eq: ['4/6 = [] × 1/6'], a: [4] }, { eq: ['3/5 = [] × 1/5'], a: [3] }],
        cue: 'The top number counts the pieces.',
        own: [{ eq: ['2/3 = [] × 1/3'], a: [2] }, { eq: ['7/10 = [] × 1/10'], a: [7] }, { eq: ['3/4 = [] × 1/4'], a: [3] }]
      },
      p1: {
        show: { pic: ['frac', { n: 6, k: 4 }], cap: '4 pieces of 1/6', eq: ['4/6'] },
        items: [{ eq: ['2/5 = [] × 1/5'], a: [2] }, { eq: ['5/6 = [] × 1/6'], a: [5] }, { eq: ['3/8 = [] × 1/8'], a: [3] }, { eq: ['2 × 1/4 = []'], a: ['2/4'] },
          { eq: ['3 × 1/3 = []'], a: ['3/3'] }, { eq: ['4 × 1/10 = []'], a: ['4/10'] }]
      },
      p2: {
        items: [{ eq: ['6/8 = [] × 1/8'], a: [6] }, { eq: ['9/10 = [] × 1/10'], a: [9] }, { eq: ['5 × 1/6 = []'], a: ['5/6'] }, { eq: ['4 × 1/5 = []'], a: ['4/5'] },
          { q: 'Least to greatest: 3/8, 1/8, 6/8', eq: ['[] < [] < []'], a: ['1/8', '3/8', '6/8'], set: ['3/8', '1/8', '6/8'] }, CMP('4/6', '5/6')]
      },
      p3: {
        items: [CMP('7/10', '3/10'), CMP('2/4', '3/4'), CMP('5/8', '5/8'), { eq: ['[] × 1/4 = 4/4'], a: [4] },
          { q: 'Greatest to least: 2/5, 4/5, 1/5', eq: ['[] > [] > []'], a: ['4/5', '2/5', '1/5'], set: ['2/5', '4/5', '1/5'] }, TF('3/8 = 8 × 1/3', false)]
      },
      think: {
        items: [{ q: '{a} says 3/8 means 8 pieces. What went wrong?', lines: { n: 3, key: 'The top number counts the pieces: 3 pieces, each 1/8.' } },
          { q: 'Why is 5/6 more than 4/6?', lines: { n: 3, key: 'Sixths are the same size, and 5 pieces is more than 4.' } },
          { q: 'Draw 3/5 as pieces of 1/5.', draw: { h: 60, key: ['frac', { n: 5, k: 3 }] } },
          { q: '{b} eats 1/8 of a pie each day for 5 days. How much pie?', eq: ['[] pie'], a: ['5/8'], calc: '5 / 8' }]
      }
    },

    whole: {
      watch: 'thinking a fraction is never more than 1, or reading 7/5 as 7 wholes. Count to 1 whole, then keep going.',
      goal: 'I can count unit fractions past one whole.',
      learn: {
        show: { cap: '4 fourths make 1 whole; 5 fourths is 1 more', eq: ['4/4 = 1', '5/4 = 1 + 1/4'] },
        together: [{ eq: ['3/3 = []'], a: [1] }, { eq: ['5/3 = 1 + []'], a: ['2/3'] }],
        cue: 'Stop at 1 whole. Then count what is past it.',
        own: [{ eq: ['2/2 = []'], a: [1] }, { eq: ['3/2 = 1 + []'], a: ['1/2'] }, { eq: ['7/5 = 1 + []'], a: ['2/5'] }]
      },
      p1: {
        show: { cap: '6 sixths make 1 whole', eq: ['6/6 = 1', '7/6 = 1 + 1/6'] },
        items: [{ eq: ['5/5 = []'], a: [1] }, { eq: ['8/8 = []'], a: [1] }, { eq: ['6/4 = 1 + []'], a: ['2/4'] }, { eq: ['4/3 = 1 + []'], a: ['1/3'] },
          { eq: ['9/8 = 1 + []'], a: ['1/8'] }, { eq: ['12/10 = 1 + []'], a: ['2/10'] }]
      },
      p2: {
        items: [{ eq: ['1 = []/6'], a: [6] }, { eq: ['1 = []/10'], a: [10] }, { eq: ['8/5 = 1 + []'], a: ['3/5'] }, { eq: ['10/6 = 1 + []'], a: ['4/6'] },
          { eq: ['4/2 = []'], a: [2] }, { eq: ['1 + 1/3 = []/3'], a: [4] }]
      },
      p3: {
        items: [{ eq: ['1 + 3/4 = []/4'], a: [7] }, { eq: ['1 + 2/5 = []/5'], a: [7] }, { eq: ['6/3 = []'], a: [2] }, { eq: ['9/4 = [] + 1/4'], a: [2] },
          TF('7/5 = 7', false), TF('5/5 = 1', true)]
      },
      think: {
        items: [{ q: '{b} says a fraction can never be more than 1. Is {b} right?', lines: { n: 3, key: 'No. 5/4 is 4 fourths (1 whole) and 1 more fourth.' } },
          { q: 'Draw 7/4 with bars.', draw: { h: 80, key: 'One whole bar of 4 fourths and a second bar with 3 fourths shaded.' } },
          { q: 'How many thirds make 2 wholes?', eq: ['[] × 1/3 = 2'], a: [6] },
          { q: 'Which is more: 6/5 or 1? How do you know?', lines: { n: 3, key: '6/5: 5 fifths make 1, and there is 1 more fifth.' } }]
      }
    },

    same: {
      watch: 'keeping the top number (3/4 = 3/8). Ask: "The pieces got smaller. Do you need more of them or fewer?"',
      goal: 'I can find halves, fourths and eighths that are equal.',
      learn: {
        show: { pic: ['fbars', { rows: [[2, 1], [4, 2]], labels: ['1/2', '2/4'] }], cap: 'The shading ends in the same place', eq: ['1/2 = 2/4'] },
        together: [{ pic: ['fbars', { rows: [[4, 1], [8, 2]] }], eq: ['1/4 = []/8'], a: [2] }, { pic: ['fbars', { rows: [[2, 1], [8, 4]] }], eq: ['1/2 = []/8'], a: [4] }],
        cue: 'Smaller pieces: you need more of them.',
        own: [{ eq: ['3/4 = []/8'], a: [6] }, { eq: ['2/2 = []/4'], a: [4] }, { eq: ['2/4 = []/2'], a: [1] }]
      },
      p1: {
        show: { pic: ['fbars', { rows: [[4, 3], [8, 6]], labels: ['3/4', '6/8'] }], cap: 'Each fourth is 2 eighths', eq: ['3/4 = 6/8'] },
        items: [{ eq: ['1/2 = []/4'], a: [2] }, { eq: ['1/4 = []/8'], a: [2] }, { eq: ['2/4 = []/8'], a: [4] }, { eq: ['4/8 = []/2'], a: [1] },
          { eq: ['6/8 = []/4'], a: [3] }, { eq: ['4/4 = []/8'], a: [8] }]
      },
      p2: {
        items: [EV('Circle the one equal to 1/2.', ['2/4', '2/8', '1/4'], 0, 0.5), EV('Circle the one equal to 3/4.', ['3/8', '6/8', '4/8'], 1, 0.75),
          { eq: ['[]/4 = 4/8'], a: [2] }, { eq: ['1/2 = 2/[]'], a: [4] }, TF('1/4 = 2/8', true), TF('3/4 = 3/8', false)]
      },
      p3: {
        items: [{ eq: ['1/2 = []/4 = []/8'], a: [2, 4], wide: true }, { eq: ['3/4 = []/8'], a: [6] }, EV('Circle the one equal to 1/4.', ['1/8', '2/8', '4/8'], 1, 0.25),
          TF('1/2 = 4/8', true),
          TF('2/8 = 1/4', true), TF('6/8 = 3/4', true)]
      },
      think: {
        items: [{ q: '{b} says 3/4 = 3/8. What went wrong?', lines: { n: 3, key: 'Eighths are smaller, so you need more of them: 3/4 = 6/8.' } },
          { q: 'Draw bars to show 1/2 = 4/8.', draw: { h: 80, key: ['fbars', { rows: [[2, 1], [8, 4]] }] } },
          { q: 'Why do two eighths make one fourth?', lines: { n: 3, key: 'Cut each fourth in half: each half is an eighth.' } },
          { eq: ['1/2 = []/4 = []/8'], a: [2, 4], wide: true }]
      }
    },

    sixths: {
      watch: 'keeping the top number (2/3 = 2/6), or thinking 2/6 is more than 1/3. Shade both bars and compare where they end.',
      goal: 'I can find thirds and sixths that are equal.',
      learn: {
        show: { pic: ['fbars', { rows: [[3, 1], [6, 2]], labels: ['1/3', '2/6'] }], cap: 'Each third is 2 sixths', eq: ['1/3 = 2/6'] },
        together: [{ pic: ['fbars', { rows: [[3, 2], [6, 4]] }], eq: ['2/3 = []/6'], a: [4] }, { eq: ['3/3 = []/6'], a: [6] }],
        cue: 'Each third cuts into 2 sixths.',
        own: [{ eq: ['1/3 = []/6'], a: [2] }, { eq: ['4/6 = []/3'], a: [2] }, { eq: ['6/6 = []/3'], a: [3] }]
      },
      p1: {
        show: { pic: ['fbars', { rows: [[3, 2], [6, 4]], labels: ['2/3', '4/6'] }], cap: '2 thirds, 4 sixths', eq: ['2/3 = 4/6'] },
        items: [{ eq: ['1/3 = []/6'], a: [2] }, { eq: ['2/3 = []/6'], a: [4] }, { eq: ['2/6 = []/3'], a: [1] }, { eq: ['3/6 = []/2'], a: [1] },
          { eq: ['3/3 = []/6'], a: [6] }, { eq: ['4/6 = []/3'], a: [2] }]
      },
      p2: {
        items: [EV('Circle the one equal to 1/3.', ['1/6', '2/6', '3/6'], 1, 1 / 3), EV('Circle the one equal to 2/3.', ['2/6', '3/6', '4/6'], 2, 2 / 3),
          { eq: ['[]/3 = 2/6'], a: [1] }, { eq: ['2/3 = 4/[]'], a: [6] }, TF('2/3 = 2/6', false), TF('1/2 = 3/6', true)]
      },
      p3: {
        items: [{ eq: ['1/3 + 1/3 = []/6'], a: [4] }, { eq: ['[]/6 = 1'], a: [6] }, EV('Circle the one equal to 1/2.', ['2/6', '3/6', '4/6'], 1, 0.5),
          CMP('2/6', '1/3'), CMP('4/6', '1/3'), TF('6/6 = 3/3', true)]
      },
      think: {
        items: [{ q: '{b} says 2/6 is more than 1/3 because 2 > 1. Is {b} right?', lines: { n: 3, key: 'No. Sixths are half the size of thirds: 2/6 = 1/3.' } },
          { q: 'Draw bars to show 2/3 = 4/6.', draw: { h: 80, key: ['fbars', { rows: [[3, 2], [6, 4]] }] } },
          { q: 'How many sixths are in one third? How do you know?', lines: { n: 3, key: '2: cut a third in half and each half is a sixth.' } },
          { eq: ['3/6 = []/2'], a: [1] }]
      }
    },

    tenths: {
      watch: 'keeping the top number (3/5 = 3/10). Ask: "How many tenths fit in one fifth?" Then: "So in 3 fifths?"',
      goal: 'I can find fifths and tenths that are equal.',
      learn: {
        show: { pic: ['fbars', { rows: [[5, 1], [10, 2]], labels: ['1/5', '2/10'] }], cap: 'Each fifth is 2 tenths', eq: ['1/5 = 2/10'] },
        together: [{ pic: ['fbars', { rows: [[5, 3], [10, 6]] }], eq: ['3/5 = []/10'], a: [6] }, { eq: ['2/5 = []/10'], a: [4] }],
        cue: 'Each fifth cuts into 2 tenths.',
        own: [{ eq: ['4/5 = []/10'], a: [8] }, { eq: ['2/10 = []/5'], a: [1] }, { eq: ['5/10 = []/2'], a: [1] }]
      },
      p1: {
        show: { pic: ['fbars', { rows: [[5, 2], [10, 4]], labels: ['2/5', '4/10'] }], cap: '2 fifths, 4 tenths', eq: ['2/5 = 4/10'] },
        items: [{ eq: ['1/5 = []/10'], a: [2] }, { eq: ['3/5 = []/10'], a: [6] }, { eq: ['4/10 = []/5'], a: [2] }, { eq: ['8/10 = []/5'], a: [4] },
          { eq: ['5/5 = []/10'], a: [10] }, { eq: ['1/2 = []/10'], a: [5] }]
      },
      p2: {
        items: [EV('Circle the one equal to 4/5.', ['4/10', '8/10', '6/10'], 1, 0.8), EV('Circle the one equal to 1/5.', ['1/10', '2/10', '5/10'], 1, 0.2),
          { eq: ['[]/5 = 6/10'], a: [3] }, { eq: ['3/5 = 6/[]'], a: [10] }, TF('3/5 = 3/10', false), TF('10/10 = 5/5', true)]
      },
      p3: {
        items: [{ eq: ['2/5 + 1/5 = []/10'], a: [6] }, { eq: ['[]/10 = 1'], a: [10] }, EV('Circle the one equal to 1/2.', ['2/10', '5/10', '2/5'], 1, 0.5),
          CMP('4/10', '1/5'), CMP('6/10', '3/5'), TF('8/10 = 4/5', true)]
      },
      think: {
        items: [{ q: '{b} says 3/5 = 3/10. What went wrong?', lines: { n: 3, key: 'Tenths are half the size of fifths, so you need twice as many: 3/5 = 6/10.' } },
          { q: 'Draw bars to show 2/5 = 4/10.', draw: { h: 80, key: ['fbars', { rows: [[5, 2], [10, 4]] }] } },
          { q: '{a} ran 4/5 of a lap. {b} ran 8/10 of the same lap. Who ran farther?', lines: { n: 2, key: 'The same: 4/5 = 8/10.' } },
          { eq: ['1/5 = []/10'], a: [2] }]
      }
    },

    story: {
      watch: 'thinking only one name is right ("It is 2/4, not 1/2"). Cut the same pizza two ways and lay one share on the other.',
      goal: 'I can name the same fair share in two ways.',
      learn: {
        show: { pic: ['wholes', { n: 2 }], cap: '2 pizzas, 4 friends: 2/4 each, or 1/2', eq: ['2 ÷ 4 = 2/4 = 1/2'] },
        together: [{ q: '3 pies, 6 friends', eq: ['3 ÷ 6 = []/6 = []/2'], a: [3, 1] }, { q: '2 bars, 6 friends', eq: ['2 ÷ 6 = []/6 = []/3'], a: [2, 1] }],
        cue: 'Two names for one share: check the pieces cover the same amount.',
        own: [{ eq: ['4 ÷ 8 = []/8 = []/2'], a: [4, 1] }, { eq: ['2 ÷ 10 = []/10 = []/5'], a: [2, 1] }, { eq: ['4 ÷ 6 = []/6 = []/3'], a: [4, 2] }]
      },
      p1: {
        show: { cap: '1 pizza, 2 friends, or 2 pizzas, 4 friends', eq: ['1/2 = 2/4'] },
        items: [{ eq: ['2 ÷ 4 = []/2'], a: [1] }, { eq: ['3 ÷ 6 = []/2'], a: [1] }, { eq: ['2 ÷ 8 = []/4'], a: [1] }, { eq: ['6 ÷ 8 = []/4'], a: [3] },
          { eq: ['4 ÷ 10 = []/5'], a: [2] }, { eq: ['2 ÷ 6 = []/3'], a: [1] }]
      },
      p2: {
        items: [{ eq: ['5 ÷ 10 = []/2'], a: [1] }, { eq: ['6 ÷ 10 = []/5'], a: [3] }, { eq: ['4 ÷ 6 = []/3'], a: [2] }, { eq: ['4 ÷ 8 = []/4'], a: [2] },
          story('4 friends share 2 pizzas. How much does each get, in halves?', 'pizza', '1/2', '2 / 4'), TF('3 ÷ 6 = 1/2', true)]
      },
      p3: {
        items: [{ eq: ['[] ÷ 8 = 1/2'], a: [4] }, { eq: ['3 ÷ [] = 1/2'], a: [6] }, { eq: ['8 ÷ 10 = []/5'], a: [4] },
          TF('2 ÷ 4 = 3 ÷ 6', true), TF('2 ÷ 8 = 1/4', true), TF('4 ÷ 6 = 1/3', false)]
      },
      think: {
        items: [{ q: '{b} says each friend gets 2/4 of a pizza, not 1/2. Who is right, {b} or {a} who says 1/2?', lines: { n: 3, key: 'Both: 2/4 and 1/2 are the same amount.' } },
          { q: 'Draw 3 pies shared by 6 friends. Show the share two ways.', draw: { h: 90, key: 'Each pie cut in 6; each friend gets 3/6, the same as 1/2.' } },
          { q: 'Write a sharing story where each person gets 1/2.', lines: { n: 3, key: 'For example: 4 friends share 2 pizzas.' } },
          { eq: ['5 ÷ 10 = []/2'], a: [1] }]
      }
    },

    make: {
      watch: 'answering with the number of pieces (10) instead of wholes (5). Ask: "How many wholes can you put back together?"',
      goal: 'I can put halves together to make wholes.',
      learn: {
        show: { pic: ['frac', { n: 2, k: 2, shape: 'circle' }], cap: '2 halves make 1 whole', eq: ['6 × 1/2 = 3'] },
        together: [{ q: '4 half sandwiches', eq: ['4 × 1/2 = []'], a: [2] }, { q: '10 half oranges', eq: ['10 × 1/2 = []'], a: [5] }],
        cue: 'Make pairs: every 2 halves is 1 whole.',
        own: [{ eq: ['8 × 1/2 = []'], a: [4] }, { eq: ['2 × 1/2 = []'], a: [1] }, { eq: ['[] × 1/2 = 3'], a: [6] }]
      },
      p1: {
        show: { cap: '8 halves: 4 pairs', eq: ['8 × 1/2 = 4'] },
        items: [{ eq: ['6 × 1/2 = []'], a: [3] }, { eq: ['12 × 1/2 = []'], a: [6] }, { eq: ['14 × 1/2 = []'], a: [7] }, { eq: ['[] × 1/2 = 2'], a: [4] },
          { eq: ['[] × 1/2 = 5'], a: [10] }, { eq: ['20 × 1/2 = []'], a: [10] }]
      },
      p2: {
        items: [{ eq: ['16 × 1/2 = []'], a: [8] }, { eq: ['[] × 1/2 = 9'], a: [18] },
          story('An apple is 2 halves. {a} has 12 halves. How many whole apples?', 'apples', 6, '12 / 2'), story('{b} cuts 7 bagels into 2 halves each. How many halves?', 'halves', 14, '7 × 2'),
          TF('10 × 1/2 = 5', true), TF('6 × 1/2 = 6', false)]
      },
      p3: {
        items: [{ eq: ['18 × 1/2 = []'], a: [9] }, { eq: ['[] × 1/2 = 12'], a: [24] },
          story('An orange is 2 halves. A team eats 16 halves. How many oranges?', 'oranges', 8, '16 / 2'), story('11 sandwiches are cut into 2 halves each. How many halves?', 'halves', 22, '11 × 2'),
          { eq: ['1/2 + 1/2 + 1/2 + 1/2 = []'], a: [2], wide: true }, TF('2 × 1/2 = 1', true)]
      },
      think: {
        items: [{ q: '{b} has 10 half sandwiches and says that is 10 sandwiches. What went wrong?', lines: { n: 3, key: '2 halves make 1 sandwich: 10 halves make 5.' } },
          { q: 'Draw 6 halves. Circle the wholes.', draw: { h: 80, key: '6 half circles in 3 pairs: 3 wholes.' } },
          { q: 'How do you find the wholes from the halves?', lines: { n: 2, key: 'Make pairs, or split the halves into groups of 2.' } },
          { eq: ['[] × 1/2 = 10'], a: [20] }]
      }
    },

    groups34: {
      watch: 'grouping by 2 for every piece ("12 fourths make 6 wholes"). Ask: "How many fourths fill one whole?"',
      goal: 'I can put thirds or fourths together to make wholes.',
      learn: {
        show: { pic: ['frac', { n: 4, k: 4, shape: 'circle' }], cap: '4 fourths make 1 whole', eq: ['8 × 1/4 = 2'] },
        together: [{ q: '9 thirds', eq: ['9 × 1/3 = []'], a: [3] }, { q: '12 fourths', eq: ['12 × 1/4 = []'], a: [3] }],
        cue: 'Make groups of 3 thirds, or 4 fourths.',
        own: [{ eq: ['6 × 1/3 = []'], a: [2] }, { eq: ['4 × 1/4 = []'], a: [1] }, { eq: ['[] × 1/3 = 4'], a: [12] }]
      },
      p1: {
        show: { cap: '6 thirds: 2 groups of 3', eq: ['6 × 1/3 = 2'] },
        items: [{ eq: ['3 × 1/3 = []'], a: [1] }, { eq: ['12 × 1/3 = []'], a: [4] }, { eq: ['16 × 1/4 = []'], a: [4] }, { eq: ['20 × 1/4 = []'], a: [5] },
          { eq: ['[] × 1/4 = 2'], a: [8] }, { eq: ['[] × 1/3 = 5'], a: [15] }]
      },
      p2: {
        items: [{ eq: ['15 × 1/3 = []'], a: [5] }, { eq: ['24 × 1/4 = []'], a: [6] },
          story('{a} has 12 pieces of pie. Each is 1/4. How many whole pies?', 'pies', 3, '12 / 4'), story('{b} cuts 6 muffins into pieces of 1/3. How many pieces?', 'thirds', 18, '6 × 3'),
          TF('12 × 1/4 = 6', false), TF('9 × 1/3 = 3', true)]
      },
      p3: {
        items: [{ eq: ['18 × 1/3 = []'], a: [6] }, { eq: ['[] × 1/4 = 7'], a: [28] },
          story('A class has 21 pieces of sandwich. Each is 1/3. How many whole sandwiches?', 'sandwiches', 7, '21 / 3'), story('9 cakes are cut into pieces of 1/4. How many pieces?', 'pieces', 36, '9 × 4'),
          { eq: ['1/3 + 1/3 + 1/3 = []'], a: [1] }, TF('8 × 1/4 = 2', true)]
      },
      think: {
        items: [{ q: '{b} says 12 fourths make 6 wholes. What went wrong?', lines: { n: 3, key: '{b} grouped by 2. 4 fourths make a whole: 12 fourths make 3.' } },
          { q: 'Draw 9 thirds. Circle the wholes.', draw: { h: 80, key: '9 third pieces in 3 groups of 3: 3 wholes.' } },
          { q: 'Which makes more wholes: 12 thirds or 12 fourths? Why?', lines: { n: 3, key: '12 thirds: 4 wholes. 12 fourths: 3 wholes. Thirds are bigger.' } },
          { eq: ['[] × 1/4 = 5'], a: [20] }]
      }
    },

    leftover: {
      watch: 'dropping the leftover, or counting a part-full group as a whole. Ask: "Is the last whole full? What is left?"',
      goal: 'I can make wholes and say what is left over.',
      learn: {
        show: { cap: '7 thirds: 2 wholes and 1 third', eq: ['7 × 1/3 = 2 + 1/3'] },
        together: [{ q: '9 fourths', eq: ['9 × 1/4 = [] + []'], a: [2, '1/4'] }, { q: '5 halves', eq: ['5 × 1/2 = [] + []'], a: [2, '1/2'] }],
        cue: 'Fill as many wholes as you can. The rest is the leftover.',
        own: [{ eq: ['4 × 1/3 = [] + []'], a: [1, '1/3'] }, { eq: ['7 × 1/4 = [] + []'], a: [1, '3/4'] }, { eq: ['7 × 1/2 = [] + []'], a: [3, '1/2'] }]
      },
      p1: {
        show: { cap: '5 fourths: 1 whole and 1 fourth', eq: ['5 × 1/4 = 1 + 1/4'] },
        items: [{ eq: ['3 × 1/2 = 1 + []'], a: ['1/2'] }, { eq: ['5 × 1/3 = 1 + []'], a: ['2/3'] }, { eq: ['6 × 1/4 = 1 + []'], a: ['2/4'] },
          { eq: ['8 × 1/3 = [] + 2/3'], a: [2] }, { eq: ['9 × 1/2 = [] + 1/2'], a: [4] }, { eq: ['11 × 1/4 = [] + 3/4'], a: [2] }]
      },
      p2: {
        items: [{ eq: ['10 × 1/3 = [] + []'], a: [3, '1/3'] }, { eq: ['10 × 1/4 = [] + []'], a: [2, '2/4'] }, { eq: ['11 × 1/2 = [] + []'], a: [5, '1/2'] },
          { eq: ['2 + 1/3 = [] × 1/3'], a: [7] }, story('{a} has 7 pieces of sandwich. Each is 1/2. How many sandwiches?', 'sandwiches', '3 + 1/2', '7 / 2'), TF('9 × 1/4 = 2 + 1/4', true)]
      },
      p3: {
        items: [{ eq: ['13 × 1/4 = [] + []'], a: [3, '1/4'] }, { eq: ['14 × 1/3 = [] + []'], a: [4, '2/3'] }, { eq: ['3 + 3/4 = [] × 1/4'], a: [15] },
          { eq: ['1 + 1/2 = [] × 1/2'], a: [3] }, story('There are 11 pieces of pie. Each is 1/3. How many pies?', 'pies', '3 + 2/3', '11 / 3'), TF('7 × 1/3 = 3', false)]
      },
      think: {
        items: [{ q: '{b} says 7 thirds is 2 wholes. What did {b} forget?', lines: { n: 3, key: 'The leftover: 7 thirds is 2 wholes and 1/3.' } },
          { q: 'Draw 9 fourths. Circle the wholes.', draw: { h: 80, key: '2 full groups of 4 fourths and 1 fourth left: 2 + 1/4.' } },
          { q: 'Why can the leftover never be a whole?', lines: { n: 3, key: 'If it were a whole, you would group it and count one more whole.' } },
          { eq: ['[] × 1/3 = 3 + 1/3'], a: [10] }]
      }
    },

    recipe: {
      watch: 'treating each batch or lap as 1 whole (6 batches of 1/4 cup = 6 cups). Ask: "How much is one batch?"',
      goal: 'I can solve recipe and lap stories with fractions.',
      learn: {
        show: { cap: '6 batches of 1/4 cup', eq: ['6 × 1/4 = 1 + 2/4 cups'] },
        together: [story('A recipe uses 1/2 cup of milk. How much for 4 batches?', 'cups', 2, '4 / 2'), story('{a} runs 1/4 km a lap. How far in 8 laps?', 'km', 2, '8 / 4')],
        cue: 'Count the pieces, then make wholes.',
        own: [story('A recipe uses 1/3 cup of oats. How much for 6 batches?', 'cups', 2, '6 / 3'), story('{b} swims 1/2 km a day. How far in 5 days?', 'km', '2 + 1/2', '5 / 2'),
          story('A scoop holds 1/4 cup. How many scoops make 2 cups?', 'scoops', 8, '2 × 4')]
      },
      p1: {
        show: { cap: '3 laps of 1/2 km', eq: ['3 × 1/2 = 1 + 1/2 km'] },
        items: [story('A recipe uses 1/2 cup of flour. How much for 6 batches?', 'cups', 3, '6 / 2'), story('{a} walks 1/3 km a lap. How far in 3 laps?', 'km', 1, '3 / 3'),
          story('A cup of juice is 1/4 L. How much in 4 cups?', 'L', 1, '4 / 4'), story('{b} runs 1/2 km a lap. How far in 8 laps?', 'km', 4, '8 / 2'),
          story('A scoop holds 1/3 cup. How many scoops make 1 cup?', 'scoops', 3, '1 × 3'), story('A scoop holds 1/2 cup. How many scoops make 3 cups?', 'scoops', 6, '3 × 2')]
      },
      p2: {
        items: [story('A recipe uses 1/4 cup of oil. How much for 6 batches?', 'cups', '1 + 2/4', '6 / 4'), story('{a} skates 1/3 km a lap. How far in 7 laps?', 'km', '2 + 1/3', '7 / 3'),
          story('A scoop holds 1/4 cup. How many scoops make 3 cups?', 'scoops', 12, '3 × 4'), story('{b} reads 1/2 hour a day. How long in 9 days?', 'hours', '4 + 1/2', '9 / 2'),
          story('A recipe uses 1/3 cup of sugar. How much for 9 batches?', 'cups', 3, '9 / 3'), TF('5 × 1/4 = 5', false)]
      },
      p3: {
        items: [story('{a} paddles 1/4 km a lap. How far in 10 laps?', 'km', '2 + 2/4', '10 / 4'), story('Bannock uses 1/2 cup of water. How much for 7 batches?', 'cups', '3 + 1/2', '7 / 2'),
          story('A scoop holds 1/3 cup. How many scoops make 4 cups?', 'scoops', 12, '4 × 3'), story('A track lap is 1/4 km. How many laps make 3 km?', 'laps', 12, '3 × 4'),
          story('A recipe uses 1/3 cup of milk. How much for 8 batches?', 'cups', '2 + 2/3', '8 / 3'), TF('6 × 1/2 = 3', true)]
      },
      think: {
        items: [{ q: '{b} says 6 batches of 1/4 cup is 6 cups. What went wrong?', lines: { n: 3, key: 'Each batch is 1/4 cup, not 1 cup: 6/4 = 1 + 2/4 cups.' } },
          { q: 'Draw 5 laps of 1/2 km. How far is it?', draw: { h: 80, key: '5 halves: 2 whole km and 1/2 km.' } },
          { q: 'Write a recipe story for 8 × 1/4.', lines: { n: 3, key: 'For example: 8 batches use 1/4 cup each: 2 cups.' } },
          { q: 'How many 1/2 cup scoops make 5 cups?', eq: ['[] × 1/2 = 5'], a: [10] }]
      }
    },

    size: {
      watch: 'thinking a bigger number always means a bigger fraction (1/8 > 1/4). Ask: "Which number is the same?"',
      goal: 'I can tell bigger pieces from more pieces.',
      learn: {
        show: { pic: ['fbars', { rows: [[3, 1], [4, 1]], labels: ['1/3', '1/4'] }], cap: 'Fewer parts: bigger pieces', eq: ['1/3 > 1/4'] },
        together: [CMP('1/2', '1/5'), CMP('3/8', '5/8')],
        cue: 'Same top: fewer parts is bigger. Same bottom: more pieces is bigger.',
        own: [CMP('1/6', '1/4'), CMP('2/3', '2/5'), CMP('4/10', '7/10')]
      },
      p1: {
        show: { pic: ['fbars', { rows: [[6, 1], [5, 1]], labels: ['1/6', '1/5'] }], cap: 'Fifths are bigger than sixths', eq: ['1/6 < 1/5'] },
        items: [CMP('1/3', '1/8'), CMP('1/10', '1/2'), CMP('2/4', '3/4'), CMP('5/6', '2/6'), CMP('2/3', '2/8'), CMP('3/5', '3/4')]
      },
      p2: {
        items: [CMP('1/4', '1/5'), CMP('3/10', '3/8'), CMP('6/8', '6/8'), CMP('4/6', '5/6'),
          { q: 'Circle the biggest.', pick: { opts: ['1/3', '1/2', '1/6'], ans: 1, big: true } }, { q: 'Circle the smallest.', pick: { opts: ['2/5', '2/3', '2/10'], ans: 2, small: true } }]
      },
      p3: {
        items: [CMP('5/8', '5/6'), CMP('1/2', '2/4'), CMP('3/4', '1/4'), CMP('4/5', '4/10'),
          { q: 'Least to greatest: 1/4, 1/2, 1/8', eq: ['[] < [] < []'], a: ['1/8', '1/4', '1/2'], set: ['1/4', '1/2', '1/8'] }, TF('1/8 > 1/4', false)]
      },
      think: {
        items: [{ q: '{b} says 1/8 is bigger than 1/4 because 8 > 4. What went wrong?', lines: { n: 3, key: 'More parts means smaller parts: eighths are smaller, so 1/8 < 1/4.' } },
          { q: 'Draw bars to show 2/3 > 2/5.', draw: { h: 80, key: ['fbars', { rows: [[3, 2], [5, 2]] }] } },
          { q: 'How do you compare 3/8 and 5/8? And 1/3 and 1/6?', lines: { n: 3, key: 'Same bottom: more pieces is bigger, 5/8. Same top: bigger pieces win, 1/3.' } },
          { q: 'Circle the biggest.', pick: { opts: ['3/10', '3/4', '3/5'], ans: 1, big: true } }]
      }
    }
  } });
})();
