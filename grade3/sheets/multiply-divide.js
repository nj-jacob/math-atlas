/* Grade 3 Multiplying and Dividing: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/multiply-divide.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.1 properties and the link between × and ÷, B2.2 facts of 2, 5 and 10, B2.6 × to 10 × 10 and ÷ to 100 ÷ 10,
   B2.9 ratios of 1 to 2, 1 to 5 and 1 to 10. The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function rep(g, k) { var a = []; for (var i = 0; i < g; i++) a.push(k); return a; }
  /* g groups of k: picture and a sum (form 'x': [] × [] = [], 'of': [] groups of [] = [], 'add': k + k + k = []) */
  function G(g, k, form) {
    var f = form || 'x';
    if (f === 'of') return { pic: ['groups', { g: g, k: k }], eq: ['[] groups of [] = []'], a: [g, k, g * k] };
    if (f === 'add') return { pic: ['groups', { g: g, k: k }], eq: [rep(g, k).join(' + ') + ' = []'], a: [g * k] };
    return { pic: ['groups', { g: g, k: k }], eq: ['[] × [] = []'], a: [g, k, g * k] };
  }
  /* a story with one answer box; calc is the sum the answer check works out */
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }

  S.register('multiply-divide', { code: 'MD', ideas: {

    equal: {
      watch: 'counting only one group, or calling groups equal when one has more. Ask: "Does every group have the same number?"',
      learn: {
        show: { pic: ['groups', { g: 3, k: 4 }], cap: '3 {conts}, 4 {many} in each', eq: ['4 + 4 + 4 = 12', '3 groups of 4 = 12'] },
        together: [{ pic: ['groups', { g: 2, k: 5 }], eq: ['5 + 5 = []', '2 groups of 5 = []'], a: [10, 10] },
          { pic: ['groups', { g: 4, k: 2 }], eq: ['2 + 2 + 2 + 2 = []', '[] groups of [] = []'], a: [8, 4, 2, 8] }],
        cue: 'Check that every group has the same number. Then add one group at a time.',
        own: [G(3, 2, 'of'), G(2, 4, 'of'), { q: 'Equal groups?', pic: ['groups', { counts: [3, 4, 3] }], pick: { opts: ['yes', 'no'], ans: 1 } }, G(5, 2, 'of')]
      },
      p1: {
        show: { pic: ['groups', { g: 2, k: 3 }], cap: '2 groups of 3', eq: ['3 + 3 = 6'] },
        items: [G(2, 4, 'add'), G(3, 3, 'add'), { q: 'Equal groups?', pic: ['groups', { counts: [2, 3, 2] }], pick: { opts: ['yes', 'no'], ans: 1 } },
          G(4, 5, 'of'), { q: 'Equal groups?', pic: ['groups', { counts: [5, 5, 5] }], pick: { opts: ['yes', 'no'], ans: 0 } }, G(2, 10, 'of')]
      },
      p2: {
        items: [G(3, 5, 'of'),
          { q: 'Draw 4 {conts} with 3 {many} in each.', draw: { h: 64, key: ['groups', { g: 4, k: 3 }] }, eq: ['4 groups of 3 = []'], a: [12] },
          story('{a} puts 5 {many} in each of 3 {conts}. How many {many} in all?', '{many}', 15, '3 × 5'),
          { q: 'Equal groups?', pic: ['groups', { counts: [6, 6, 5] }], pick: { opts: ['yes', 'no'], ans: 1 } },
          G(6, 2, 'of'),
          story('{b} has 4 {conts}. Each {cont} has 4 {many}. How many {many}?', '{many}', 16, '4 × 4')]
      },
      p3: {
        items: [G(6, 5, 'of'), G(7, 3, 'of'),
          { q: 'Move 1 to make the groups equal.', pic: ['groups', { counts: [4, 6, 5] }], eq: ['3 groups of [] = []'], a: [5, 15] },
          story('{a} has 24 {many} and makes 4 equal {conts}. How many {many} in each?', '{many}', 6, '24 ÷ 4'),
          story('{b} has 8 {conts} with 5 {many} in each. How many {many}?', '{many}', 40, '8 × 5'),
          { q: 'Is 5 + 5 + 5 + 5 the same as 4 groups of 5?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '5 + 5 + 5 + 5 = 4 groups of 5' }]
      },
      think: {
        items: [{ q: 'Show 12 as equal groups in two different ways.', draw: { h: 96, key: 'Any two of: 2 groups of 6, 3 groups of 4, 4 groups of 3, 6 groups of 2.' } },
          { q: '{b} says these are 3 equal groups. Is {b} right? Why?', pic: ['groups', { counts: [4, 4, 5] }], lines: { n: 2, key: 'No. One group has 5 and the others have 4.' } },
          { q: 'Write a story for 3 groups of 10.', lines: { n: 3, key: 'For example: {a} puts 10 {many} in each of 3 {conts}. That makes 30 {many}.' } },
          { q: '20 {many} go into equal {conts}. How many {conts} could there be? Find three answers.', lines: { n: 2, key: 'Any three of 1, 2, 4, 5, 10 or 20.' } }]
      }
    },

    times: {
      watch: 'adding the two numbers (3 × 4 = 7). Ask: "How many groups? How many in each?" Then draw the groups.',
      learn: {
        show: { pic: ['groups', { g: 5, k: 2 }], cap: '5 {conts}, 2 {many} in each', eq: ['2 + 2 + 2 + 2 + 2 = 10', '5 × 2 = 10'] },
        together: [{ pic: ['groups', { g: 2, k: 5 }], eq: ['5 + 5 = []', '2 × 5 = []'], a: [10, 10] }, G(3, 4)],
        cue: 'The first number is how many groups. The second is how many in each group.',
        own: [G(4, 2), G(2, 3), G(3, 5), { eq: ['4 + 4 + 4 = []', '3 × 4 = []'], a: [12, 12] }]
      },
      p1: {
        show: { pic: ['groups', { g: 2, k: 4 }], cap: '2 groups of 4', eq: ['2 × 4 = 8'] },
        items: [G(3, 2), G(2, 5), G(4, 3), G(5, 2), { eq: ['3 + 3 = []', '2 × 3 = []'], a: [6, 6] }, G(5, 3)]
      },
      p2: {
        items: [{ q: 'Write it as a times sum.', eq: ['6 + 6 + 6 = []', '[] × [] = []'], a: [18, 3, 6, 18] }, G(4, 5),
          { q: 'Draw 3 × 6.', draw: { h: 56, key: ['groups', { g: 3, k: 6 }] }, eq: ['3 × 6 = []'], a: [18] },
          story('{a} puts 4 {many} in each of 5 {conts}. How many {many}?', '{many}', 20, '5 × 4'),
          { eq: ['5 × 5 = []', '6 × 2 = []'], a: [25, 12] },
          { q: 'Circle the sum that means 4 groups of 6.', pick: { opts: ['4 + 6', '6 + 6 + 6 + 6', '4 + 4'], ans: 1, val: 24 } }]
      },
      p3: {
        items: [G(6, 7), { eq: ['8 + 8 + 8 + 8 + 8 = []', '[] × [] = []'], a: [40, 5, 8, 40] },
          story('{b} has 9 {conts} with 3 {many} in each. How many {many}?', '{many}', 27, '9 × 3'),
          { eq: ['[] × 4 = 4 + 4 + 4 + 4 + 4'], a: [5], wide: true },
          { eq: ['10 × 3 = []', '6 × 5 = []'], a: [30, 30] },
          story('{a} has 7 {conts} with 4 {many} in each. How many {many}?', '{many}', 28, '7 × 4')]
      },
      think: {
        items: [{ q: 'Draw 4 × 3 and 3 × 4. How are they different?', draw: { h: 96, key: '4 groups of 3 and 3 groups of 4. Both make 12, but the groups are not the same.' } },
          { q: '{b} says 3 × 6 = 9. What went wrong?', lines: { n: 2, key: '{b} added 3 + 6. 3 × 6 is 3 groups of 6, which is 18.' } },
          { q: 'Write a story for 6 × 5.', lines: { n: 3, key: 'For example: {a} has 6 {conts} with 5 {many} in each. That makes 30 {many}.' } },
          { q: 'Which is more?', pick: { opts: ['4 groups of 5', '5 groups of 3'], ans: 0, big: true } }]
      }
    }

  } });
})();
