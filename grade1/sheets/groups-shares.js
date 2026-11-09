/* Grade 1 Equal Groups and Fair Shares: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per
   idea of the lessons in chapters/groups-shares.js: Learn, Practise 1 to 3 and Think. Every question is written here, not
   made at random, so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B2.5 equal-group problems; B1.6 fair shares among 2 or 4 sharers, some with 1 or 2 left over; B1.7 one half
   and two fourths of the same whole are equal; B1.8 more sharers make smaller pieces.
   The answer checks are in tests/verify/sheets.js: a share with some left over is checked by left, the name of a half or a
   fourth by pick.half, and which sharer gets the bigger piece by pick.pieces. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function rep(g, k) { var a = []; for (var i = 0; i < g; i++) a.push(k); return a; }
  /* g groups of k: count them all by adding */
  function G(g, k) { return { pic: ['groups', { g: g, k: k }], eq: [rep(g, k).join(' + ') + ' = []'], a: [g * k] }; }
  /* g groups of k: groups, in each, in all */
  function GO(g, k) { return { pic: ['groups', { g: g, k: k }], eq: ['[] groups of [] = []'], a: [g, k, g * k] }; }
  /* equal groups? */
  function EQ(counts) { return { q: 'Equal groups?', pic: ['groups', { counts: counts }], pick: { opts: ['yes', 'no'], ans: counts.every(function (c) { return c === counts[0]; }) ? 0 : 1 } }; }
  /* share t things among g: how many each (no left over) */
  function SH(t, g) { return { q: 'Share ' + t + ' on ' + g + ' plates.', pic: ['share', { t: t, g: g }], eq: ['[] each'], a: [t / g], calc: t + ' ÷ ' + g }; }
  function SS(t, g, who) { return { q: t + ' {many} are shared by ' + g + ' ' + (who || 'friends') + '. How many each?', eq: ['[] each'], a: [t / g], calc: t + ' ÷ ' + g }; }
  /* share t among g with some left over */
  function LO(t, g, q) { return { q: q || 'Share ' + t + ' {many} with ' + g + ' friends.', pic: ['dots', { t: t, sp: t > 10 ? 14 : 19 }], eq: ['[] each', '[] left over'], a: [Math.floor(t / g), t % g], left: { t: t, g: g } }; }
  function FR(n, k, shape) { return ['frac', { n: n, k: k, shape: shape || 'bar' }]; }
  /* name the shaded part: one half, one fourth or two fourths */
  var NAMES = ['one half', 'one fourth', 'two fourths'];
  function NM(n, k, shape, opts) { var o = opts || ['one half', 'one fourth']; var want = n === 2 ? 'one half' : k === 1 ? 'one fourth' : 'two fourths'; return { q: 'Circle the shaded part.', pic: FR(n, k, shape), pick: { opts: o, ans: o.indexOf(want), half: true } }; }
  /* equal parts or not? */
  function EP(n, uneven, shape) { return { q: 'Equal parts?', pic: ['frac', { n: n, k: 0, shape: shape || 'bar', uneven: uneven }], pick: { opts: ['yes', 'no'], ans: uneven ? 1 : 0, equal: true } }; }
  /* is the same amount shaded? */
  function SA(a, b) { var same = a[1] / a[0] === b[1] / b[0]; return { q: 'Is the same amount shaded?', pic: ['row', { list: [FR(a[0], a[1]), FR(b[0], b[1])], labels: ['A', 'B'] }], pick: { opts: ['yes', 'no'], ans: same ? 0 : 1 }, same: true }; }
  /* who gets the bigger (or smaller) piece? n: the sharers of each whole */
  function PC(n, big, q) {
    var want = big === false ? n.indexOf(Math.max.apply(null, n)) : n.indexOf(Math.min.apply(null, n));
    return { q: q || 'Same size pizzas. ' + n.map(function (x, i) { return 'Pizza ' + 'ABC'[i] + ' is shared by ' + x + '.'; }).join(' ') + ' Which has ' + (big === false ? 'smaller' : 'bigger') + ' pieces?', pick: { opts: n.map(function (x, i) { return 'ABC'[i]; }), ans: want, pieces: n, big: big } };
  }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }

  S.register('groups-shares', { code: 'GS', ideas: {

    equal: {
      watch: 'calling groups equal when they hold the same kind of thing. Equal groups have the same number in each.',
      goal: 'I can tell if groups are equal.',
      learn: {
        show: { pic: ['groups', { g: 3, k: 2 }], cap: '2 in every group', eq: ['3 equal groups'] },
        together: [EQ([2, 2, 2]), EQ([3, 2, 3])],
        cue: 'Count each group. Are they all the same?',
        own: [EQ([4, 4]), EQ([1, 2, 1]), EQ([5, 5]), EQ([3, 3, 4])]
      },
      p1: { show: { pic: ['groups', { counts: [2, 3] }], eq: ['not equal'] }, items: [EQ([2, 2]), EQ([3, 4]), EQ([1, 1, 1]), EQ([4, 3, 4]), EQ([3, 3, 3]), EQ([2, 2, 1])] },
      p2: { items: [GO(2, 3), GO(3, 2), GO(2, 4), GO(5, 2), EQ([5, 4]), EQ([2, 2, 2, 2])] },
      p3: { items: [GO(2, 5), GO(4, 2), { q: 'Move 1 to make the groups equal.', pic: ['groups', { counts: [2, 4] }], eq: ['2 groups of [] = []'], a: [3, 6] }, { q: 'Move 1 to make the groups equal.', pic: ['groups', { counts: [3, 1] }], eq: ['2 groups of [] = []'], a: [2, 4] }, EQ([3, 3, 3]), story('{a} puts 2 {many} in each of 4 {conts}. How many?', '{many}', 8, '2 + 2 + 2 + 2')] },
      think: {
        items: [{ q: 'Draw 2 equal groups with 6 {many} in all.', draw: { h: 60, key: ['groups', { g: 2, k: 3 }] } },
          { q: '{b} says these are equal groups. Is {b} right? Why?', pic: ['groups', { counts: [3, 4] }], lines: { n: 2, key: 'No. One group has 3 and one has 4.' } },
          { q: 'Show 8 as equal groups.', draw: { h: 60, key: 'For example: 2 groups of 4, or 4 groups of 2.' } },
          { q: 'Can 5 be shared into 2 equal groups?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '2 + 2 = 5' }]
      }
    },

    count: {
      watch: 'counting every thing by 1s. Count by the group size: 2, 4, 6.',
      goal: 'I can count equal groups.',
      learn: {
        show: { pic: ['groups', { g: 3, k: 2 }], cap: 'Count by 2s', eq: ['2 + 2 + 2 = 6'] },
        together: [G(2, 3), G(4, 2)],
        cue: 'Count by the number in each group.',
        own: [G(2, 2), G(3, 3), G(5, 2), G(2, 5)]
      },
      p1: { show: { pic: ['groups', { g: 2, k: 4 }], eq: ['4 + 4 = 8'] }, items: [G(2, 1), G(3, 2), G(2, 4), G(4, 2), G(3, 3), G(5, 2)] },
      p2: { items: [GO(2, 3), GO(3, 3), GO(2, 5), GO(4, 2), story('{a} has 3 {conts}. Each has 2 {many}. How many?', '{many}', 6, '2 + 2 + 2'), story('{b} has 2 {conts} of 5 {many}. How many?', '{many}', 10, '5 + 5')] },
      p3: { items: [story('5 {conts} have 2 {many} each. How many?', '{many}', 10, '2 + 2 + 2 + 2 + 2'), story('{a} makes 2 {conts} with 4 {many} in each. How many?', '{many}', 8, '4 + 4'), story('3 {conts}, 3 {many} in each. How many?', '{many}', 9, '3 + 3 + 3'), story('{b} has 10 {many} in {conts} of 2. How many {conts}?', '{conts}', 5, '10 ÷ 2'), { eq: ['2 + 2 + 2 + 2 = []'], a: [8] }, { eq: ['5 + 5 = []'], a: [10] }] },
      think: {
        items: [{ q: 'Draw 4 groups of 2. How many?', draw: { h: 56, key: ['groups', { g: 4, k: 2 }] }, eq: ['2 + 2 + 2 + 2 = []'], a: [8] },
          { q: 'Why count by 2s here, not by 1s?', pic: ['groups', { g: 4, k: 2 }], lines: { n: 2, key: 'Each group has 2, so counting by 2s is faster.' } },
          { q: 'Write a story for 3 + 3.', lines: { n: 2, key: 'For example: {a} has 2 {conts} with 3 {many} in each: 6.' } },
          { q: '{b} counts 2 groups of 5 as 7. What went wrong?', lines: { n: 2, key: '{b} added 2 and 5. 2 groups of 5 is 5 + 5 = 10.' } }]
      }
    },

    deal: {
      watch: 'giving some sharers more. Deal one to each in turn, round and round, until none are left.',
      goal: 'I can share fairly by dealing one at a time.',
      learn: {
        show: { pic: ['groups', { g: 2, k: 3 }], cap: 'Deal 6, one at a time', eq: ['3 each'] },
        together: [SH(4, 2), SH(6, 2)],
        cue: 'One for you, one for you. Keep going until none are left.',
        own: [SH(8, 2), SH(8, 4)]
      },
      p1: { show: { pic: ['groups', { g: 2, k: 2 }], eq: ['4 shared by 2: 2 each'] }, items: [SH(2, 2), SH(6, 2), SH(4, 4), SH(10, 2)] },
      p2: { items: [SS(6, 2), SS(8, 4), SS(10, 2), SS(4, 2), SS(12, 4), SS(2, 2)] },
      p3: { items: [SS(12, 2), SS(16, 4), SS(14, 2), SS(20, 4), story('2 friends share 10 {many} fairly. How many does each get?', '{many}', 5, '10 ÷ 2'), story('4 friends share 12 {many} fairly. How many each?', '{many}', 3, '12 ÷ 4')] },
      think: {
        items: [{ q: 'What makes a share fair?', lines: { n: 2, key: 'Everyone gets the same number.' } },
          { q: '{a} gets 4 and {b} gets 2 of 6 {many}. Is that fair? Fix it.', eq: ['[] each'], a: [3], calc: '6 ÷ 2' },
          { q: 'Draw 8 {many} shared by 4 friends.', draw: { h: 60, key: ['groups', { g: 4, k: 2 }] } },
          { q: 'Can 10 be shared fairly by 2? Tell how.', lines: { n: 2, key: 'Yes. Deal one at a time: 5 each.' } }]
      }
    },

    left: {
      watch: 'giving the leftovers to one person. A fair share stops when there are not enough for everyone.',
      goal: 'I can share fairly when some are left over.',
      learn: {
        show: { pic: ['groups', { counts: [2, 2, 1] }], cap: '5 shared by 2: 2 each, 1 left', eq: ['2 each, 1 left over'] },
        together: [LO(7, 2), LO(9, 4)],
        cue: 'Deal until there are not enough for everyone. The rest are left over.',
        own: [LO(5, 2), LO(10, 4)]
      },
      p1: { show: { eq: ['7 shared by 2: 3 each, 1 left'] }, items: [LO(3, 2), LO(5, 4), LO(7, 2), LO(9, 4), LO(11, 2), LO(10, 4)] },
      p2: { items: [LO(13, 2), LO(13, 4), LO(15, 2), LO(14, 4), LO(17, 2), LO(18, 4)] },
      p3: { items: [LO(19, 2, '2 friends share 19 {many}.'), LO(21, 4, '4 friends share 21 {many}.'), LO(22, 4, '4 friends share 22 {many}.'), LO(11, 2, '2 friends share 11 {many}.'), LO(9, 2, '2 friends share 9 {many}.')] },
      think: {
        items: [{ q: '{b} shares 7 {many} with 2 friends and keeps the extra. Is that fair?', lines: { n: 2, key: 'No. They each get 3 and 1 is left over for no one, or it is cut in half.' } },
          { q: 'What could you do with 1 left over cookie?', lines: { n: 2, key: 'Cut it in half so each friend gets one half more.' } },
          { q: 'Which number can 2 friends share with none left: 7, 8 or 9?', pick: { opts: ['7', '8', '9'], ans: 1, seq: { from: 0, by: 2 } } },
          { q: 'Draw 10 {many} shared by 4 friends.', draw: { h: 60, key: '2 each, 2 left over.' } }]
      }
    },

    half: {
      watch: 'calling any one of two pieces a half. A half is one of 2 equal parts.',
      goal: 'I can find one half.',
      learn: {
        show: { pic: FR(2, 1, 'circle'), cap: '2 equal parts, 1 shaded', eq: ['one half'] },
        together: [NM(2, 1), NM(4, 1, 'circle')],
        cue: 'One half is 1 of 2 equal parts.',
        own: [NM(2, 1, 'circle'), NM(4, 1)]
      },
      p1: { show: { pic: FR(2, 1), eq: ['one half'] }, items: [NM(2, 1), NM(2, 1, 'circle'), NM(4, 1), NM(2, 1), NM(4, 1, 'circle'), NM(2, 1, 'circle')] },
      p2: { items: [story('{a} cuts a sandwich into 2 equal parts. How many halves?', 'halves', 2, '2'), SS(8, 2, 'children'), SS(6, 2, 'children'), SS(10, 2, 'children'), NM(2, 1), EP(2, [0, 0.7, 1])] },
      p3: { items: [story('Half of 8 {many} are in a {cont}. 8 shared by 2. How many in it?', '{many}', 4, '8 ÷ 2'), story('{b} eats half of 4 {many}. 4 shared by 2. How many does {b} eat?', '{many}', 2, '4 ÷ 2'), EP(2, [0, 0.5, 1]), EP(2, [0, 0.3, 1]), NM(2, 1, 'circle'), SS(12, 2, 'children')] },
      think: {
        items: [{ q: 'Draw a line to cut the square in half.', pic: ['frac', { n: 1, k: 0 }], draw: { h: 20, key: 'A line down the middle, making 2 equal parts.' } },
          { q: 'Is one half of a big cake the same as one half of a small cake?', lines: { n: 2, key: 'No. The half of the big cake is bigger.' } },
          { q: 'A whole is cut into 2 equal parts. How many halves?', eq: ['[] halves'], a: [2], calc: '2' },
          { q: '{a} says any 2 pieces are halves. Is that right?', lines: { n: 2, key: 'No. Halves must be 2 equal parts.' } }]
      }
    },

    'not-half': {
      watch: 'calling two unequal pieces halves. Check that both parts are the same size.',
      goal: 'I can tell if two parts are halves.',
      learn: {
        show: { pic: ['frac', { n: 2, k: 0, uneven: [0, 0.7, 1] }], cap: 'One part is bigger', eq: ['not halves'] },
        together: [EP(2), EP(2, [0, 0.65, 1])],
        cue: 'Halves are the same size. If one part is bigger, they are not halves.',
        own: [EP(2, [0, 0.3, 1]), EP(2), EP(2, [0, 0.8, 1]), EP(2, null, 'circle')]
      },
      p1: { show: { pic: FR(2, 0), eq: ['halves'] }, items: [EP(2), EP(2, [0, 0.25, 1]), EP(2, null, 'circle'), EP(2, [0, 0.6, 1]), EP(2), EP(2, [0, 0.4, 1])] },
      p2: { items: [EP(4), EP(4, [0, 0.2, 0.5, 0.75, 1]), EP(2, [0, 0.55, 1]), EP(4, null, 'circle'), EP(2), EP(4, [0, 0.3, 0.6, 0.8, 1])] },
      p3: { items: [EP(2, [0, 0.45, 1]), EP(4), EP(4, [0, 0.25, 0.5, 0.7, 1]), EP(2, null, 'circle'), EP(2, [0, 0.52, 1]), EP(4, null, 'circle')] },
      think: {
        items: [{ q: '{b} cut a ribbon into 2 parts. One is long, one is short. Are they halves?', lines: { n: 2, key: 'No. Halves must be the same length.' } },
          { q: 'Draw a rectangle cut in 2 parts that are not halves.', draw: { h: 48, key: 'Any rectangle cut into a bigger and a smaller part.' } },
          { q: 'How can you check two parts are halves?', lines: { n: 2, key: 'Fold or place one on the other. They should match.' } },
          EP(2, [0, 0.35, 1])]
      }
    },

    fourth: {
      watch: 'calling a fourth "one four". One fourth is 1 of 4 equal parts.',
      goal: 'I can find one fourth.',
      learn: {
        show: { pic: FR(4, 1, 'circle'), cap: '4 equal parts, 1 shaded', eq: ['one fourth'] },
        together: [NM(4, 1), NM(2, 1, 'circle')],
        cue: 'One fourth is 1 of 4 equal parts.',
        own: [NM(4, 1, 'circle'), EP(4, [0, 0.2, 0.6, 0.8, 1])]
      },
      p1: { show: { pic: FR(4, 1), eq: ['one fourth'] }, items: [NM(4, 1), NM(4, 1, 'circle'), NM(2, 1), EP(4), EP(4, [0, 0.1, 0.5, 0.9, 1]), NM(4, 1)] },
      p2: { items: [story('A pizza is cut into 4 equal parts. How many fourths?', 'fourths', 4, '4'), SS(8, 4, 'children'), SS(4, 4, 'children'), SS(12, 4, 'children'), NM(4, 1, 'circle'), EP(4, null, 'circle')] },
      p3: { items: [story('4 friends share 8 {many} fairly. How many does each get?', '{many}', 2, '8 ÷ 4'), story('A fourth of 4 {many} is shaded. 4 shared by 4. How many are shaded?', '{many}', 1, '4 ÷ 4'), NM(4, 1), NM(2, 1, 'circle'), EP(4, [0, 0.25, 0.5, 0.75, 1]), EP(4, [0, 0.3, 0.5, 0.7, 1])] },
      think: {
        items: [{ q: 'Draw lines to cut the square into fourths.', pic: ['frac', { n: 1, k: 0 }], draw: { h: 20, key: '3 lines, or a cross, making 4 equal parts.' } },
          { q: 'The same pizza is cut in 2 or in 4 equal pieces. Which piece is bigger?', pick: { opts: ['one half', 'one fourth'], ans: 0, pieces: [2, 4] }, wide: true },
          { q: 'A whole is cut into 4 equal parts. How many fourths?', eq: ['[] fourths'], a: [4], calc: '4' },
          { q: '{a} cut a cake into 4 parts of different sizes. Are they fourths?', lines: { n: 2, key: 'No. Fourths must be 4 equal parts.' } }]
      }
    },

    'two-fourths': {
      watch: 'thinking two fourths is more than one half because 2 is more than 1. Lay them side by side.',
      goal: 'I can see that one half is the same as two fourths.',
      learn: {
        show: { pic: ['row', { list: [FR(2, 1), FR(4, 2)], labels: ['one half', 'two fourths'] }], eq: ['the same amount'] },
        together: [SA([2, 1], [4, 2]), SA([2, 1], [4, 1])],
        cue: 'Two fourths cover the same space as one half.',
        own: [SA([4, 1], [2, 1]), NM(4, 2, 'bar', ['one fourth', 'two fourths'])]
      },
      p1: { show: { pic: ['row', { list: [FR(2, 1, 'circle'), FR(4, 2, 'circle')] }], eq: ['one half = two fourths'] }, items: [SA([2, 1], [4, 2]), SA([4, 1], [2, 1]), NM(4, 2, 'bar', NAMES), NM(2, 1, 'circle', NAMES)] },
      p2: { items: [SA([2, 1], [4, 2]), SA([4, 2], [4, 1]), NM(4, 2, 'circle', NAMES), NM(4, 1, 'bar', NAMES), NM(2, 1, 'bar', NAMES), { q: 'A whole has 4 fourths or 2 halves. How many fourths make one half?', eq: ['[] fourths'], a: [2], calc: '4 ÷ 2' }] },
      p3: { items: [SA([4, 2], [2, 1]), NM(4, 2, 'circle', NAMES), { q: '{a} eats one half of a pizza. {b} eats two fourths of the same size pizza. Do they eat the same amount?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '1/2 = 2/4', wide: true }, { q: 'A bar is cut into 4 fourths. How many fourths are in each half of 2?', eq: ['[] fourths'], a: [2], calc: '4 ÷ 2' }] },
      think: {
        items: [{ q: 'Draw one half and two fourths of the same rectangle.', draw: { h: 60, key: 'Two same rectangles: one with half shaded, one cut in 4 with 2 shaded.' } },
          { q: '{b} says two fourths is more than one half. Is {b} right? Why?', lines: { n: 2, key: 'No. Two fourths cover the same space as one half.' } },
          { q: 'Would you rather have one half or two fourths of a pizza?', lines: { n: 2, key: 'It does not matter. They are the same amount.' } },
          SA([2, 1], [4, 2])]
      }
    },

    smaller: {
      watch: 'thinking more sharers means bigger pieces. More people share the same whole, so each piece is smaller.',
      goal: 'I can see that more sharers make smaller pieces.',
      learn: {
        show: { pic: ['row', { list: [FR(2, 1), FR(6, 1)], labels: ['2 share', '6 share'] }], eq: ['2 sharers: bigger pieces'] },
        together: [PC([2, 4]), PC([5, 3])],
        cue: 'The same whole, more sharers: each piece is smaller.',
        own: [PC([3, 8]), PC([10, 4]), PC([2, 3], false), PC([6, 9], false)]
      },
      p1: { show: { pic: ['row', { list: [FR(3, 1), FR(5, 1)] }], eq: ['1 of 3 is bigger than 1 of 5'] }, items: [PC([2, 5]), PC([4, 2]), PC([3, 6]), PC([8, 4]), PC([2, 10], false), PC([7, 5], false)] },
      p2: { items: [PC([3, 4, 2]), PC([6, 10, 8]), PC([5, 2, 9], false), PC([4, 7, 3], false), { q: 'Pizza A has 3 pieces. Pizza B has 7 pieces. Which pieces are smaller?', pick: { opts: ['A', 'B'], ans: 1, pieces: [3, 7], big: false } }, { q: 'Ribbon A is cut in 2. Ribbon B is cut in 6. Which pieces are bigger?', pick: { opts: ['A', 'B'], ans: 0, pieces: [2, 6] } }] },
      p3: { items: [PC([9, 4, 6]), PC([2, 8, 5], false), PC([10, 3, 7]), PC([4, 6, 2], false), { q: 'The same cake is cut for 5 or for 8. Which gives bigger pieces?', pick: { opts: ['5', '8'], ans: 0, pieces: [5, 8] } }, { q: 'The same loaf is cut for 3 or for 9. Which gives smaller pieces?', pick: { opts: ['3', '9'], ans: 1, pieces: [3, 9], big: false } }] },
      think: {
        items: [{ q: '{a} wants a big piece. Share a pizza with 2 or with 6? Why?', lines: { n: 2, key: 'With 2. Fewer sharers means bigger pieces.' } },
          { q: 'Draw the same bar cut for 3 and for 6. Shade one piece of each.', draw: { h: 60, key: 'The piece of the bar cut for 3 is bigger.' } },
          { q: '{b} says 1 piece of 10 is bigger than 1 piece of 5 because 10 is bigger. Is {b} right?', lines: { n: 2, key: 'No. Cut into 10, each piece is smaller.' } },
          PC([4, 10, 7])]
      }
    }
  } });
})();
