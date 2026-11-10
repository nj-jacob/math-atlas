/* Grade 2 Equal Groups and Sharing: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js and
   sheet-pics-upper.js). One set per idea of the lessons in chapters/groups-sharing.js: Learn, Practise 1 to 3 and Think.
   Every question is written here, not made at random. Grade 2 adds equal groups and shares by dealing; the × and ÷
   signs wait for Grade 3, so sums are written as repeated adding and "groups of".
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.1 the link between adding and equal groups, and between taking away and sharing; B2.5 add equal groups,
   including groups of halves and fourths; B2.6 share up to 12 things fairly, with and without things left over.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function rep(n, k) { var a = []; for (var i = 0; i < n; i++) a.push(k); return a; }
  /* equal groups: g groups of k, as repeated adding and as "groups of" */
  function G(g, k) { return { pic: ['groups', { g: g, k: k }], eq: [rep(g, k).join(' + ') + ' = []', '[] groups of [] = []'], a: [g * k, g, k, g * k] }; }
  /* just the adding row */
  function GA(g, k) { return { pic: ['groups', { g: g, k: k }], eq: [rep(g, k).join(' + ') + ' = []'], a: [g * k] }; }
  /* an array: rows of equal groups */
  function AR(r, c) { return { pic: ['array', { r: r, c: c }], eq: ['[] rows of [] = []'], a: [r, c, r * c] }; }
  function ARA(r, c) { return { pic: ['array', { r: r, c: c }], eq: [rep(r, c).join(' + ') + ' = []'], a: [r * c] }; }
  /* are the groups equal? */
  function EQ(counts) { return { q: 'Are the groups equal?', pic: ['groups', { counts: counts }], pick: { opts: ['yes', 'no'], ans: counts.every(function (x) { return x === counts[0]; }) ? 0 : 1 } }; }
  /* deal t things to g sharers: how many each (and left over) */
  function SH(t, g) { return { q: 'Share ' + t + ' among ' + g + '.', pic: ['share', { t: t, g: g }], eq: ['[] each'], a: [t / g], deal: [t, g] }; }
  function SL(t, g) { return { q: 'Share ' + t + ' among ' + g + '.', pic: ['shareR', { t: t, g: g }], eq: ['[] each and [] left over'], a: [Math.floor(t / g), t % g], deal: [t, g] }; }
  /* a sharing story: how many each, and how many left over if any */
  function SS(q, t, g) { return t % g ? { q: q, eq: ['[] each and [] left over'], a: [Math.floor(t / g), t % g], deal: [t, g] } : { q: q, eq: ['[] each'], a: [t / g], deal: [t, g] }; }
  /* take away equal groups: t − k − k ... = 0, and how many groups */
  function TG(t, k) { return { eq: [[t].concat(rep(t / k, k)).join(' − ') + ' = []', '[] groups of ' + k + ' = ' + t], a: [0, t / k], wide: t / k > 3 }; }
  /* groups of halves or fourths: n parts of size 1/d */
  function PT(n, d, word) {
    var whole = Math.floor(n / d), left = n % d, list = [];
    for (var i = 0; i < whole; i++) list.push(['frac', { n: d, k: d, shape: 'circle', R: 16 }]);
    if (left) list.push(['frac', { n: d, k: left, shape: 'circle', R: 16 }]);
    return { pic: ['row', { list: list, gap: 6 }], q: n + ' ' + word, eq: ['[] wholes + [] ' + word], a: [whole, left], fw: true };
  }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }

  S.register('groups-sharing', { code: 'GS', ideas: {

    equal: {
      watch: 'counting every dot by ones. Count by the group size: 4, 8, 12.',
      goal: 'I can add equal groups.',
      learn: {
        show: { pic: ['groups', { g: 3, k: 4 }], cap: '4 + 4 + 4 = 12', eq: ['3 groups of 4 = 12'] },
        together: [G(2, 5), G(4, 2)],
        cue: 'Count by the group size: one count for each group.',
        own: [G(3, 3), G(5, 2), { eq: ['6 + 6 = []', '2 groups of 6 = []'], a: [12, 12] }, { eq: ['5 + 5 + 5 + 5 = []', '4 groups of 5 = []'], a: [20, 20] }]
      },
      p1: {
        show: { pic: ['groups', { g: 2, k: 3 }], cap: '2 groups of 3', eq: ['3 + 3 = 6'] },
        items: [GA(3, 2), GA(2, 4), GA(4, 3), GA(5, 5), GA(3, 5), GA(2, 10)]
      },
      p2: {
        items: [G(4, 4), G(3, 6), { eq: ['2 groups of 7 = []'], a: [14] }, { eq: ['5 groups of 3 = []'], a: [15] },
          story('{a} has 4 {conts}. Each {cont} holds 5 {many}. How many {many}?', '{many}', 20, '5 + 5 + 5 + 5'), story('{b} puts 3 {many} in each of 6 {conts}. How many {many}?', '{many}', 18, '6 groups of 3')]
      },
      p3: {
        items: [{ eq: ['10 + 10 + 10 + 10 = []'], a: [40], wide: true }, { eq: ['5 + 5 + 5 + 5 + 5 + 5 = []'], a: [30], wide: true },
          { eq: ['[] groups of 2 = 12'], a: [6] }, { eq: ['3 groups of [] = 15'], a: [5] },
          story('{a} has 7 {conts} with 2 {many} in each. How many {many}?', '{many}', 14, '7 groups of 2'), TF('4 groups of 3 = 3 + 3 + 3 + 3', true)]
      },
      think: {
        items: [{ q: 'Draw 3 groups of 5. Write an adding sum for it.', draw: { h: 70, key: '3 rings of 5 dots: 5 + 5 + 5 = 15.' } },
          { q: '{a} says 4 groups of 2 is 6. What went wrong?', lines: { n: 2, key: '{a} added 4 and 2. It is 2 + 2 + 2 + 2 = 8.' } },
          { q: 'Is 3 groups of 4 the same amount as 4 groups of 3? Show it.', draw: { h: 70, key: 'Yes: 4 + 4 + 4 = 12 and 3 + 3 + 3 + 3 = 12.' } },
          { q: 'Where do you see equal groups at home?', lines: { n: 2, key: 'For example: eggs in a carton, wheels on cars, socks in pairs.' } }]
      }
    },

    notequal: {
      watch: 'skip counting groups that are not the same size. Check every group first.',
      goal: 'I can tell if groups are equal.',
      learn: {
        show: { pic: ['groups', { counts: [5, 5, 4] }], cap: 'Not equal: one group has only 4', eq: ['5 + 5 + 4 = 14'] },
        together: [EQ([3, 3, 3]), EQ([4, 4, 2])],
        cue: 'Groups are equal only if every group has the same number.',
        own: [EQ([2, 2, 2, 2]), EQ([5, 6]), TF('4 + 4 + 4 = 3 groups of 4', true), TF('4 + 3 + 4 = 3 groups of 4', false)]
      },
      p1: {
        show: { pic: ['groups', { g: 3, k: 2 }], cap: 'Every group has 2', eq: ['equal groups'] },
        items: [EQ([3, 3]), EQ([2, 3, 2]), EQ([5, 5, 5]), EQ([4, 4, 4, 3]), EQ([1, 1, 1]), EQ([6, 5])]
      },
      p2: {
        items: [EQ([4, 4, 4, 4]), EQ([3, 3, 4]), { pic: ['groups', { counts: [4, 4, 3] }], eq: ['4 + 4 + 3 = []'], a: [11] }, { pic: ['groups', { counts: [5, 2, 5] }], eq: ['5 + 2 + 5 = []'], a: [12] },
          { q: 'Draw 1 more in one group to make them equal.', pic: ['groups', { counts: [3, 2, 3] }], draw: { h: 30, key: 'Add 1 to the middle group: 3, 3, 3.' } },
          { q: 'Move 1 to make the groups equal.', pic: ['groups', { counts: [5, 3] }], draw: { h: 30, key: 'Move 1 from the 5 to the 3: 4 and 4.' } }]
      },
      p3: {
        items: [{ q: '{a} has 3 {conts} with 4, 4 and 5 {many}. Are they equal groups? How do you know?', lines: { n: 1, key: 'No. One {cont} has 5.' }, wide: true },
          { q: '{b} has 4 {conts} with 3 {many} each. How many {many}?', eq: ['[] {many}'], a: [12], calc: '3 + 3 + 3 + 3' },
          { q: '{a} has 2 {conts} with 6 and 4 {many}. Make them equal. How many in each?', eq: ['[] {many}'], a: [5], calc: '(6 + 4) ÷ 2' },
          TF('3 + 3 + 2 = 3 groups of 3', false), TF('2 + 2 + 2 = 3 groups of 2', true)]
      },
      think: {
        items: [{ q: '{b} counted 4, 8, 12 for groups of 4, 4 and 3. What went wrong?', lines: { n: 2, key: 'The groups are not equal. It is 4 + 4 + 3 = 11.' } },
          { q: 'Draw 3 groups that are not equal. Then fix them.', draw: { h: 70, key: 'For example: 4, 2, 3, then move to make 3, 3, 3.' } },
          { q: 'Why must groups be equal to skip count?', lines: { n: 2, key: 'Skip counting adds the same number each time.' } },
          { q: 'Can 10 {many} make 3 equal groups? Why?', lines: { n: 2, key: 'No. 3 groups of 3 is 9, and 1 is left over.' } }]
      }
    },

    array: {
      watch: 'counting rows and columns as the same. Count the rows, then how many in each row.',
      goal: 'I can see rows of equal groups.',
      learn: {
        show: { pic: ['array', { r: 3, c: 5 }], cap: '5 + 5 + 5 = 15', eq: ['3 rows of 5 = 15'] },
        together: [AR(2, 4), AR(4, 3)],
        cue: 'An array is rows of the same size. Count by the row.',
        own: [AR(2, 6), AR(5, 2), { eq: ['4 + 4 + 4 = []', '3 rows of 4 = []'], a: [12, 12] }, { eq: ['7 + 7 = []', '2 rows of 7 = []'], a: [14, 14] }]
      },
      p1: {
        show: { pic: ['array', { r: 2, c: 5 }], cap: '2 rows of 5', eq: ['5 + 5 = 10'] },
        items: [ARA(2, 3), ARA(3, 3), ARA(4, 2), ARA(2, 8), ARA(3, 5), { eq: ['4 + 4 + 4 + 4 + 4 = []'], a: [20] }]
      },
      p2: {
        items: [AR(3, 6), AR(4, 4), { q: 'Draw 2 rows of 6.', draw: { h: 50, key: ['array', { r: 2, c: 6 }] } }, { q: 'Draw 4 rows of 3.', draw: { h: 70, key: ['array', { r: 4, c: 3 }] } },
          story('{a} plants 3 rows of 4 {many}. How many {many}?', '{many}', 12, '3 rows of 4'), story('{b} sets out 5 rows of 2 {many}. How many {many}?', '{many}', 10, '5 rows of 2')]
      },
      p3: {
        items: [{ eq: ['4 rows of 5 = []'], a: [20] }, { eq: ['6 rows of 2 = []'], a: [12] }, { eq: ['[] rows of 10 = 30'], a: [3] }, { eq: ['2 rows of [] = 18'], a: [9] },
          story('An egg carton has 2 rows of 6. How many eggs?', 'eggs', 12, '2 rows of 6'), story('{a} sets out 4 rows of 4 {many}. How many {many}?', '{many}', 16, '4 rows of 4')]
      },
      think: {
        items: [{ q: 'Turn 2 rows of 5 sideways. What do you get? Is it the same amount?', lines: { n: 2, key: '5 rows of 2. Yes, both are 10.' } },
          { q: 'Draw two different arrays for 12.', draw: { h: 80, key: '3 rows of 4 and 2 rows of 6 (also 4 rows of 3, 6 rows of 2).' } },
          { q: 'Why is an array easy to count?', lines: { n: 2, key: 'Every row has the same number, so you can count by rows.' } },
          { q: 'Can you make an array with 7 {many} in more than one row?', lines: { n: 2, key: 'No. 7 only makes 1 row of 7 (or 7 rows of 1).' } }]
      }
    },

    halves: {
      watch: 'counting the halves as wholes (5 halves = 5 oranges). Put two halves together to make each whole.',
      goal: 'I can add groups of halves and fourths.',
      learn: {
        show: { pic: ['row', { list: [['frac', { n: 2, k: 2, shape: 'circle', R: 20 }], ['frac', { n: 2, k: 2, shape: 'circle', R: 20 }], ['frac', { n: 2, k: 1, shape: 'circle', R: 20 }]], gap: 8 }], cap: '5 halves', eq: ['2 wholes and 1 half'] },
        together: [PT(3, 2, 'halves'), PT(6, 4, 'fourths')],
        cue: '2 halves make 1 whole. 4 fourths make 1 whole.',
        own: [PT(4, 2, 'halves'), PT(5, 4, 'fourths')]
      },
      p1: {
        show: { cap: '6 halves', eq: ['6 halves = 3 wholes'] },
        items: [PT(2, 2, 'halves'), PT(7, 2, 'halves'), PT(4, 4, 'fourths'), PT(9, 4, 'fourths')]
      },
      p2: {
        items: [{ eq: ['8 halves = [] wholes'], a: [4], fw: true }, { eq: ['8 fourths = [] wholes'], a: [2], fw: true },
          { eq: ['3 wholes = [] halves'], a: [6], fw: true }, { eq: ['2 wholes = [] fourths'], a: [8], fw: true },
          { q: '{a} eats half a {one} each day for 6 days. How many whole {many} is that?', eq: ['6 halves = [] wholes'], a: [3], fw: true, wide: true },
          { q: '4 friends each get a fourth of a pizza. How much pizza in all?', eq: ['4 fourths = [] whole'], a: [1], fw: true, wide: true }]
      },
      p3: {
        items: [{ eq: ['9 halves = [] wholes + [] half'], a: [4, 1], fw: true, wide: true }, { eq: ['10 fourths = [] wholes + [] fourths'], a: [2, 2], fw: true, wide: true },
          { q: '5 children each eat half an orange. How many oranges?', eq: ['5 halves = [] wholes + [] half'], a: [2, 1], fw: true, wide: true },
          { q: '7 friends each get a fourth of a pie. How much pie?', eq: ['7 fourths = [] whole + [] fourths'], a: [1, 3], fw: true, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 5 halves is 5 wholes. What went wrong?', lines: { n: 2, key: 'Each half is only part of a whole. 5 halves = 2 wholes and 1 half.' } },
          { q: 'Draw 7 fourths of a pizza. How many whole pizzas?', draw: { h: 70, key: ['row', { list: [['frac', { n: 4, k: 4, shape: 'circle' }], ['frac', { n: 4, k: 3, shape: 'circle' }]] }] } },
          { q: 'Which is more: 4 halves or 4 fourths? Why?', lines: { n: 2, key: '4 halves: that is 2 wholes. 4 fourths is only 1 whole.' } },
          { q: 'How many fourths make 1 half? Draw it.', draw: { h: 70, key: ['frac', { n: 4, k: 2, shape: 'circle' }] } }]
      }
    },

    deal: {
      watch: 'giving out unequal shares. Deal one at a time, going round, until none are left.',
      goal: 'I can share fairly, one at a time.',
      learn: {
        show: { pic: ['share', { t: 12, g: 3 }], cap: '12 shared by 3: one for you, one for you …', eq: ['4 each'] },
        together: [SH(8, 2), SH(9, 3)],
        cue: 'Deal one at a time. Everyone gets the same.',
        own: [SS('Share 10 among 2.', 10, 2), SS('Share 12 among 4.', 12, 4)]
      },
      p1: {
        show: { pic: ['share', { t: 6, g: 2 }], cap: 'Deal one at a time', eq: ['3 each'] },
        items: [SH(4, 2), SH(6, 2), SS('Share 8 among 4.', 8, 4), SS('Share 9 among 3.', 9, 3), SS('Share 10 among 5.', 10, 5), SS('Share 12 among 2.', 12, 2)]
      },
      p2: {
        items: [SH(12, 3), SH(8, 2), SS('{a} shares 10 {many} among 2 friends. How many each?', 10, 2), SS('{b} shares 12 {many} among 4 friends. How many each?', 12, 4),
          SS('6 {many} are shared by 6 children. How many each?', 6, 6), { q: 'Draw 9 {many} shared on 3 plates.', draw: { h: 60, key: ['share', { t: 9, g: 3 }] } }]
      },
      p3: {
        items: [SS('{a} has 12 {many} for 3 {conts}. How many in each?', 12, 3), SS('{b} shares 8 {many} among 4 friends. How many each?', 8, 4),
          SS('12 {many} are shared by 2 children. How many each?', 12, 2), SS('10 {many} are shared by 5 children. How many each?', 10, 5),
          { q: 'Check: 4 + 4 + 4 = 12. Is 12 shared by 3 equal to 4 each?', pick: { opts: ['true', 'false'], ans: 0 }, tf: '4 + 4 + 4 = 12' },
          TF('6 + 6 = 12', true)]
      },
      think: {
        items: [{ q: '{a} shared 8 {many}: 5 to one friend, 3 to the other. Is that fair? Fix it.', lines: { n: 2, key: 'No. Deal one at a time: 4 each.' } },
          { q: 'Draw 12 {many} shared among 4 friends.', draw: { h: 60, key: ['share', { t: 12, g: 4 }] } },
          { q: 'How can adding check a share? Use 10 shared by 2.', lines: { n: 2, key: '5 each: 5 + 5 = 10, so it is right.' } },
          { q: 'Can 12 be shared fairly by 2, 3, 4 and 6? Show one.', lines: { n: 2, key: 'Yes: 6, 4, 3 and 2 each. For example 3 + 3 + 3 + 3 = 12.' } }]
      }
    },

    leftover: {
      watch: 'giving the leftovers to someone. When there are not enough to go round again, they stay left over.',
      goal: 'I can share when some are left over.',
      learn: {
        show: { pic: ['shareR', { t: 10, g: 4 }], cap: '10 shared by 4: not enough to go round again', eq: ['2 each, 2 left over'] },
        together: [SL(7, 2), SS('Share 11 among 3.', 11, 3)],
        cue: 'Deal until there are not enough to go round. The rest are left over.',
        own: [SS('Share 9 among 2.', 9, 2), SS('Share 10 among 3.', 10, 3)]
      },
      p1: {
        show: { cap: '7 shared by 3', eq: ['2 each, 1 left over'] },
        items: [SL(5, 2), SL(8, 3), SS('Share 9 among 4.', 9, 4), SS('Share 7 among 6.', 7, 6), SS('Share 11 among 2.', 11, 2)]
      },
      p2: {
        items: [SS('{a} shares 11 {many} among 2 friends. How many each? How many left over?', 11, 2), SS('{b} shares 10 {many} among 4 friends.', 10, 4),
          SS('9 {many} are shared by 6 children.', 9, 6), SS('12 {many} are shared by 5 children.', 12, 5),
          { q: 'Draw 11 {many} shared on 3 plates. Circle the leftovers.', draw: { h: 70, key: ['shareR', { t: 11, g: 3 }] }, wide: true }]
      },
      p3: {
        items: [SS('{a} has 12 {many} for 5 {conts}.', 12, 5), SS('{b} shares 7 {many} among 4 friends.', 7, 4),
          SS('10 {many} are shared by 6 children.', 10, 6), SS('12 {many} are shared by 3 children.', 12, 3),
          { q: 'Which has none left over: 10 shared by 3, 12 shared by 4 or 9 shared by 2? Why?', lines: { n: 2, key: '12 shared by 4: 3 each, 0 left over.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} shared 9 {many} by 2 and gave the extra one to a friend. Is that fair?', lines: { n: 2, key: 'No. 4 each and 1 left over. The extra one stays out (or is cut in half).' } },
          { q: 'What could you do with 1 leftover cookie for 2 friends?', lines: { n: 2, key: 'Cut it in half: each gets 4 and a half.' } },
          { q: 'Why can the leftovers never be as many as the sharers?', lines: { n: 2, key: 'Then there would be enough to go round once more.' } },
          { q: 'Find a number you can share by 2 with 1 left over.', lines: { n: 1, key: 'Any odd number: 5, 7, 9, 11.' } }]
      }
    },

    takeg: {
      watch: 'subtracting a different amount each time. Take away the same group size every time and count the groups.',
      goal: 'I can take away equal groups.',
      learn: {
        show: { pic: ['line', { n: 4, step: 3, max: 12 }], cap: '12 − 3 − 3 − 3 − 3 = 0', eq: ['4 groups of 3'] },
        together: [TG(10, 2), TG(12, 4)],
        cue: 'Take away the same group each time. Count how many times.',
        own: [TG(9, 3), TG(10, 5)]
      },
      p1: {
        show: { cap: '8 in groups of 2', eq: ['8 − 2 − 2 − 2 − 2 = 0'] },
        items: [TG(6, 2), TG(6, 3), TG(8, 4), TG(12, 6)]
      },
      p2: {
        items: [{ eq: ['[] groups of 2 = 10'], a: [5] }, { eq: ['[] groups of 3 = 12'], a: [4] }, { eq: ['[] groups of 4 = 8'], a: [2] }, { eq: ['[] groups of 5 = 10'], a: [2] },
          story('{a} has 12 {many} and puts 3 in each {cont}. How many {conts}?', '{conts}', 4, '12 ÷ 3'), story('{b} has 10 {many} and puts 2 in each {cont}. How many {conts}?', '{conts}', 5, '10 ÷ 2')]
      },
      p3: {
        items: [story('12 {many} go in {conts} of 4. How many {conts}?', '{conts}', 3, '12 ÷ 4'), story('9 {many} go in {conts} of 3. How many {conts}?', '{conts}', 3, '9 ÷ 3'),
          story('12 {many} go in {conts} of 2. How many {conts}?', '{conts}', 6, '12 ÷ 2'), story('10 {many} go in {conts} of 5. How many {conts}?', '{conts}', 2, '10 ÷ 5'),
          { q: 'Show 12 in groups of 6 with jumps back.', draw: { h: 60, key: ['line', { n: 2, step: 6, max: 12 }] }, wide: true }]
      },
      think: {
        items: [{ q: 'How is taking away groups of 3 from 12 like sharing 12 by 4?', lines: { n: 2, key: 'Both give 4 groups of 3: 12 − 3 − 3 − 3 − 3 = 0.' } },
          { q: '{a} took 12 − 4 − 4 − 3 and said "3 groups". What went wrong?', lines: { n: 2, key: 'The groups must be the same: 12 − 4 − 4 − 4 = 0, so 3 groups of 4. The last group was wrong.' } },
          { q: 'Draw 10 {many} in groups of 2.', draw: { h: 60, key: ['groups', { g: 5, k: 2 }] } },
          { q: 'Can 11 {many} go in groups of 2 with none left? Why?', lines: { n: 2, key: 'No. 5 groups of 2 is 10, and 1 is left.' } }]
      }
    },

    stories: {
      watch: 'mixing up "groups of" and "shared by". Ask: do I know the number of groups and the size (add them), or the total (share it)?',
      goal: 'I can solve group and share stories.',
      learn: {
        show: { cap: '3 {conts}, 4 {many} in each', eq: ['4 + 4 + 4 = 12'] },
        together: [story('{a} has 4 {conts} with 3 {many} in each. How many {many}?', '{many}', 12, '3 + 3 + 3 + 3'), SS('{b} shares 10 {many} among 2 friends. How many each?', 10, 2)],
        cue: 'Groups and their size: add them. A total to share: deal it out.',
        own: [story('{a} has 5 {conts} with 2 {many} in each. How many {many}?', '{many}', 10, '5 groups of 2'), SS('{b} shares 12 {many} among 3 friends. How many each?', 12, 3),
          SS('{a} shares 9 {many} among 2 friends.', 9, 2), story('{b} sets out 2 rows of 6 {many}. How many {many}?', '{many}', 12, '2 rows of 6')]
      },
      p1: {
        show: { cap: '8 shared by 2', eq: ['4 each'] },
        items: [story('{a} has 3 {conts} with 5 {many} in each. How many {many}?', '{many}', 15, '3 groups of 5'), SS('{b} shares 8 {many} among 4 friends. How many each?', 8, 4),
          story('{a} has 6 {conts} with 2 {many} in each. How many {many}?', '{many}', 12, '6 groups of 2'), SS('{b} shares 6 {many} among 3 friends. How many each?', 6, 3)]
      },
      p2: {
        items: [story('{a} has 4 {conts} with 4 {many} in each. How many {many}?', '{many}', 16, '4 groups of 4'), SS('{b} shares 11 {many} among 2 friends.', 11, 2),
          { q: '{a} eats half a {one} each day for 4 days. How many whole {many}?', eq: ['4 halves = [] wholes'], a: [2], fw: true }, SS('12 {many} are shared by 6 children.', 12, 6)]
      },
      p3: {
        items: [SS('{a} shares 10 {many} among 3 friends.', 10, 3), story('{b} has 12 {many} in {conts} of 4. How many {conts}?', '{conts}', 3, '12 ÷ 4'),
          story('{a} has 5 {conts} of 10 {many}. How many {many}?', '{many}', 50, '10 + 10 + 10 + 10 + 10'), SS('7 {many} are shared by 2 children.', 7, 2),
          { q: 'Write a sharing story for 12 shared by 4.', lines: { n: 2, key: 'For example: {a} shares 12 {many} among 4 friends: 3 each.' }, wide: true }]
      },
      think: {
        items: [{ q: '"4 {conts} with 3 {many} in each." {b} shared and got 1. What went wrong?', lines: { n: 2, key: 'We know the groups and their size, so add: 3 + 3 + 3 + 3 = 12.' } },
          { q: 'Write a story with equal groups. Solve it.', lines: { n: 3, key: 'For example: 3 {conts} with 5 {many} each: 15.' } },
          { q: 'Draw a picture for 2 groups of 6 and for 12 shared by 2. What do you notice?', draw: { h: 80, key: 'Both show two groups of 6: adding and sharing are linked.' } },
          { q: 'How could you check that 12 shared by 3 is 4 each?', lines: { n: 2, key: 'Add the shares: 4 + 4 + 4 = 12.' } }]
      }
    }
  } });
})();
