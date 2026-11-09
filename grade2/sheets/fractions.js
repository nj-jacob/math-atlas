/* Grade 2 Fractions: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the
   lessons in chapters/fractions.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Grade 2 names fractions in words ("3 fourths", "one half"); the a/b numerals wait for Grade 3.
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.6 fair shares of one or more things, named in halves, thirds, fourths, fifths, sixths, eighths and tenths;
   B1.7 one third equals two sixths, and other equal fair shares.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var PL = { 1: 'wholes', 2: 'halves', 3: 'thirds', 4: 'fourths', 5: 'fifths', 6: 'sixths', 8: 'eighths', 10: 'tenths' };
  var NAMES = ['halves', 'thirds', 'fourths', 'sixths'];
  function circle(n, k, R) { return ['frac', { n: n, k: k, shape: 'circle', R: R || 22 }]; }
  function bar(n, k, bw) { return ['frac', { n: n, k: k, bw: bw || 140 }]; }
  /* are the parts equal? a bar cut evenly, or at the cuts given */
  function EP(n, cuts) { return { q: 'Equal parts?', pic: ['frac', { n: n, k: 0, bw: 140, uneven: cuts }], pick: { opts: ['yes', 'no'], ans: cuts ? 1 : 0, equal: true } }; }
  /* what are the parts called? */
  function NM(pic) { var o = pic[1].n === 6 ? NAMES.slice(1) : NAMES.slice(0, 3); return { q: 'The parts are …', pic: pic, pick: { opts: o, ans: o.indexOf(PL[pic[1].n]), parts: true } }; }
  /* how much is shaded, in fraction words */
  function SH(pic) { return { q: 'How much is shaded?', pic: pic, eq: ['[] ' + PL[pic[1].n]], a: [pic[1].k], fw: true }; }
  /* how many parts make one whole */
  function WH(n) { return { eq: ['[] ' + PL[n] + ' = 1 whole'], a: [n], fw: true }; }
  /* which share is bigger (or smaller): fraction words in the choices */
  function BG(x, y, small) {
    var v = function (s) { var m = s.split(' '); return ['', 'one', 'two', 'three', 'four', 'five'].indexOf(m[0]) / { half: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, eighth: 8, tenth: 10, thirds: 3, fourths: 4, sixths: 6, eighths: 8, tenths: 10 }[m[1]]; };
    var pk = { opts: [x, y], ans: (v(x) > v(y)) === !small ? 0 : 1 };
    pk[small ? 'small' : 'big'] = true;
    return { q: small ? 'Which is smaller?' : 'Which is bigger?', pick: pk, fw: true };
  }
  /* t things shared by g friends: wholes first, then the rest cut into g parts */
  function FS(q, t, g, pic) {
    var w = Math.floor(t / g), r = t % g, row;
    if (!r) row = { eq: ['[] wholes'], a: [w] };
    else if (!w) row = { eq: ['[] ' + PL[g]], a: [r] };
    else row = { eq: ['[] wholes + [] ' + PL[g]], a: [w, r] };
    return { q: q, pic: pic, eq: row.eq, a: row.a, fw: true, fshare: [t, g] };
  }
  /* bars for a sharing picture: w whole bars, then the rest cut into g parts */
  function bars(t, g) {
    var list = [], i;
    for (i = 0; i < t; i++) list.push(['frac', { n: t - i <= t % g || t < g ? g : 1, k: 0, bw: 34, bh: 22 }]);
    return ['row', { list: list, gap: 6 }];
  }
  /* who gets more: [things, sharers] for group A and group B */
  function CMP(a, b, what) {
    var d = a[0] / a[1] - b[0] / b[1];
    var th = function (n) { return n + ' ' + (n === 1 ? what.replace(/s$/, '') : what); };
    return { q: 'A: ' + th(a[0]) + ' for ' + a[1] + '. B: ' + th(b[0]) + ' for ' + b[1] + '. Who gets more each?',
      pick: { opts: ['A', 'B', 'same'], ans: Math.abs(d) < 1e-9 ? 2 : d > 0 ? 0 : 1, shareCmp: [a, b] } };
  }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st, fw: true }; }

  S.register('fractions', { code: 'FR', ideas: {

    equal: {
      watch: 'calling any cut "halves". Halves, thirds and fourths must be the same size.',
      goal: 'I can tell fair shares from unfair ones.',
      learn: {
        show: { pic: ['row', { list: [['frac', { n: 4, k: 0, bw: 120, uneven: [0, 0.15, 0.45, 0.6, 1] }], ['frac', { n: 4, k: 0, bw: 120 }]], gap: 24 }], cap: 'Not fair, then fair', eq: ['fair shares: all the same size'] },
        together: [EP(3, [0, 0.2, 0.7, 1]), EP(4)],
        cue: 'Look at every part. Fair shares are all the same size.',
        own: [EP(2), EP(2, [0, 0.35, 1]), EP(6), EP(4, [0, 0.25, 0.4, 0.75, 1])]
      },
      p1: {
        show: { pic: bar(3, 0), cap: '3 parts, all the same size', eq: ['fair shares'] },
        items: [EP(3), EP(2, [0, 0.6, 1]), EP(4, [0, 0.1, 0.5, 0.7, 1]), EP(6), EP(5), EP(3, [0, 0.4, 0.6, 1])]
      },
      p2: {
        items: [{ q: 'Equal parts?', pic: circle(4, 0), pick: { opts: ['yes', 'no'], ans: 0, equal: true } }, { q: 'Equal parts?', pic: circle(3, 0), pick: { opts: ['yes', 'no'], ans: 0, equal: true } },
          { q: 'Cut the bar into 2 fair shares.', pic: bar(1, 0), draw: { h: 10, key: bar(2, 0) } }, { q: 'Cut the bar into 4 fair shares.', pic: bar(1, 0), draw: { h: 10, key: bar(4, 0) } },
          { q: 'Cut the bar into 3 fair shares.', pic: bar(1, 0), draw: { h: 10, key: bar(3, 0) } }, { q: 'Cut the bar into 6 fair shares.', pic: bar(1, 0), draw: { h: 10, key: bar(6, 0) } }]
      },
      p3: {
        items: [EP(8), EP(4, [0, 0.3, 0.5, 0.8, 1]), EP(10),
          { q: '{a} cut a sandwich into 2 parts: one big, one small. Is it fair? Why?', lines: { n: 2, key: 'No. Fair shares are the same size.' } },
          { q: '{b} cut a pizza into 4 pieces of the same size. Are they fair shares?', pick: { opts: ['yes', 'no'], ans: 0, equal: true } },
          { q: 'Draw a square cut into 4 fair shares.', draw: { h: 70, key: 'A square cut by two lines through the middle (or into 4 strips).' } }]
      },
      think: {
        items: [{ q: '{a} says any 2 pieces are halves. What would you tell {a}?', lines: { n: 2, key: 'Halves must be the same size. 2 pieces that are not equal are not halves.' } },
          { q: 'Show 2 different ways to cut a square into halves.', draw: { h: 70, key: 'For example: one line down the middle, or one line corner to corner.' } },
          { q: 'Why do fair shares matter when friends share food?', lines: { n: 2, key: 'So everyone gets the same amount.' } },
          { q: 'Can 3 fair shares look different but still be the same size? Show it.', draw: { h: 70, key: 'Yes: a square cut into 3 strips, or a circle into 3 equal slices.' } }]
      }
    },

    names: {
      watch: 'naming the shaded count only ("two" not "two sixths"). Count all the equal parts for the name.',
      goal: 'I can name equal parts.',
      learn: {
        show: { pic: circle(4, 3, 26), cap: '4 equal parts: fourths', eq: ['3 fourths shaded'] },
        together: [NM(circle(3, 1)), SH(circle(6, 2))],
        cue: 'All the parts give the name. The shaded parts say how many.',
        own: [NM(circle(6, 1)), SH(bar(4, 1))]
      },
      p1: {
        show: { pic: bar(3, 1), cap: '3 equal parts: thirds', eq: ['1 third shaded'] },
        items: [NM(circle(2, 1)), NM(bar(4, 3)), NM(circle(3, 2)), SH(bar(6, 5)), SH(circle(4, 2)), SH(bar(2, 1))]
      },
      p2: {
        items: [SH(circle(6, 4)), SH(bar(3, 2)), SH(bar(8, 3)), SH(circle(5, 2)),
          { q: 'Shade 3 fourths.', pic: bar(4, 0), draw: { h: 6, key: bar(4, 3) } }, { q: 'Shade 2 sixths.', pic: circle(6, 0), draw: { h: 6, key: circle(6, 2) } }]
      },
      p3: {
        items: [SH(bar(10, 7)), SH(circle(8, 5)), { q: 'Shade 1 half.', pic: circle(2, 0), draw: { h: 6, key: circle(2, 1) } }, { q: 'Shade 4 fifths.', pic: bar(5, 0), draw: { h: 6, key: bar(5, 4) } },
          { q: '{a} ate 2 of the 3 equal slices of a {one} cake. How much did {a} eat?', eq: ['[] thirds'], a: [2], calc: '2' },
          { q: '{b} coloured 5 of 6 equal parts. How much is coloured?', eq: ['[] sixths'], a: [5], calc: '5' }]
      },
      think: {
        items: [{ q: '{b} says this is "two". What is missing?', pic: circle(6, 2), lines: { n: 2, key: 'The name of the parts: it is 2 sixths.' } },
          { q: 'Draw a bar cut in fourths. Shade 1 fourth.', draw: { h: 50, key: bar(4, 1) } },
          { q: 'How do you know what to call the parts?', lines: { n: 2, key: 'Count all the equal parts: 3 parts are thirds, 4 are fourths.' } },
          { q: 'Show 2 fourths two ways.', draw: { h: 70, key: 'For example: a bar in 4 parts with 2 shaded, and a circle in 4 parts with 2 shaded.' } }]
      }
    },

    whole: {
      watch: 'thinking a whole is always 1 part. All the equal parts together make one whole.',
      goal: 'I can see that all the parts make a whole.',
      learn: {
        show: { pic: circle(3, 3, 26), cap: 'Every part shaded', eq: ['3 thirds = 1 whole'] },
        together: [{ pic: circle(2, 2), eq: ['[] halves = 1 whole'], a: [2], fw: true }, { pic: bar(6, 6), eq: ['[] sixths = 1 whole'], a: [6], fw: true }],
        cue: 'Count all the equal parts. That many make one whole.',
        own: [{ pic: circle(4, 4), eq: ['[] fourths = 1 whole'], a: [4], fw: true }, { pic: bar(5, 5), eq: ['[] fifths = 1 whole'], a: [5], fw: true }, WH(8), WH(10)]
      },
      p1: {
        show: { pic: bar(4, 4), cap: 'All 4 parts', eq: ['4 fourths = 1 whole'] },
        items: [WH(2), WH(3), WH(6), WH(4), WH(5), WH(8)]
      },
      p2: {
        items: [{ q: 'How much more makes 1 whole?', pic: circle(4, 3), eq: ['3 fourths + [] fourths = 1 whole'], a: [1], fw: true, wide: true },
          { q: 'How much more makes 1 whole?', pic: bar(6, 2), eq: ['2 sixths + [] sixths = 1 whole'], a: [4], fw: true, wide: true },
          { eq: ['1 third + [] thirds = 1 whole'], a: [2], fw: true, wide: true }, { eq: ['1 half + [] half = 1 whole'], a: [1], fw: true, wide: true }]
      },
      p3: {
        items: [{ eq: ['5 eighths + [] eighths = 1 whole'], a: [3], fw: true, wide: true }, { eq: ['7 tenths + [] tenths = 1 whole'], a: [3], fw: true, wide: true },
          { q: '{a} ate 2 fourths of a pizza. How much is left?', eq: ['[] fourths'], a: [2], fw: true, calc: '4 - 2' },
          { q: '{b} has eaten 4 sixths of a pie. How much is left?', eq: ['[] sixths'], a: [2], fw: true, calc: '6 - 4' },
          TF('6 sixths = 1 whole', true), TF('4 thirds = 1 whole', false)]
      },
      think: {
        items: [{ q: '{a} says 2 fourths is the whole pizza. What went wrong?', lines: { n: 2, key: 'A pizza in fourths has 4 parts. 4 fourths is the whole.' } },
          { q: 'Draw 1 whole cut into thirds. Shade it all.', draw: { h: 60, key: circle(3, 3, 26) } },
          { q: 'Why do 2 halves and 4 fourths both make 1 whole?', lines: { n: 2, key: 'Both are all the equal parts of the same whole.' } },
          { q: 'How many tenths make 1 whole? How do you know?', lines: { n: 2, key: '10 tenths: there are 10 equal parts.' } }]
      }
    },

    smaller: {
      watch: 'thinking 1 sixth is bigger than 1 third because 6 is bigger. More parts means smaller parts.',
      goal: 'I can tell which share is bigger.',
      learn: {
        show: { pic: ['row', { list: [bar(2, 1, 110), bar(6, 1, 110)], gap: 24 }], cap: 'The same bar in halves, then sixths', eq: ['one half is bigger'] },
        together: [BG('one third', 'one fourth'), BG('one half', 'one fourth', true)],
        cue: 'More sharers, smaller pieces.',
        own: [BG('one sixth', 'one half'), BG('one fourth', 'one sixth'), BG('one third', 'one sixth', true), BG('one eighth', 'one fourth', true)]
      },
      p1: {
        show: { pic: ['row', { list: [bar(3, 1, 110), bar(4, 1, 110)], gap: 24 }], cap: 'Thirds, then fourths', eq: ['one third is bigger'] },
        items: [BG('one half', 'one third'), BG('one sixth', 'one fourth'), BG('one tenth', 'one fifth'), BG('one half', 'one eighth', true), BG('one third', 'one fifth', true), BG('one sixth', 'one tenth', true)]
      },
      p2: {
        items: [{ q: 'Shade 1 part of each. Which is bigger?', pic: ['row', { list: [bar(2, 0, 100), bar(4, 0, 100)], gap: 16 }], pick: { opts: ['one half', 'one fourth'], ans: 0, big: true }, fw: true, wide: true },
          { q: 'Shade 1 part of each. Which is smaller?', pic: ['row', { list: [bar(3, 0, 100), bar(6, 0, 100)], gap: 16 }], pick: { opts: ['one third', 'one sixth'], ans: 1, small: true }, fw: true, wide: true },
          { q: '2 friends share a pizza. 4 friends share the same size pizza. Who gets the bigger slice?', pick: { opts: ['one half', 'one fourth'], ans: 0, big: true }, fw: true, wide: true }]
      },
      p3: {
        items: [BG('one fifth', 'one fourth'), BG('one eighth', 'one tenth'), BG('one third', 'one tenth', true), BG('one half', 'one sixth', true),
          { q: '{a} gets 1 third of a granola bar. {b} gets 1 sixth of the same bar. Who gets more?', pick: { opts: ['{a}', '{b}', 'same'], ans: 0, shareCmp: [[1, 3], [1, 6]] }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says 1 eighth is bigger than 1 half because 8 is bigger than 2. What would you tell {a}?', lines: { n: 2, key: 'More parts means smaller parts. One half is bigger.' } },
          { q: 'Draw two bars the same size to show one third and one fourth.', draw: { h: 60, key: ['row', { list: [bar(3, 1, 110), bar(4, 1, 110)], gap: 16 }] } },
          { q: 'Would you rather share a pizza with 2 friends or 6 friends? Why?', lines: { n: 2, key: 'With 2: each slice is bigger.' } },
          { q: 'Put in order from smallest: one half, one tenth, one fourth.', lines: { n: 1, key: 'one tenth, one fourth, one half' } }]
      }
    },

    deal: {
      watch: 'cutting every thing first. Give out whole things first, then cut what is left.',
      goal: 'I can share more than one thing fairly.',
      learn: {
        show: { pic: bars(4, 3), cap: '4 bars for 3 friends: 1 whole each, then cut the last bar in thirds', eq: ['1 whole + 1 third each'] },
        together: [FS('5 bars for 2 friends', 5, 2), FS('3 pizzas for 2 friends', 3, 2)],
        cue: 'Wholes first. Cut the rest into one part for each friend.',
        own: [FS('5 bars for 4 friends', 5, 4), FS('7 bars for 3 friends', 7, 3), FS('6 muffins for 3 friends', 6, 3), FS('5 pizzas for 2 friends', 5, 2)]
      },
      p1: {
        show: { pic: bars(3, 2), cap: '3 bars for 2 friends', eq: ['1 whole + 1 half each'] },
        items: [FS('3 bars for 2 friends', 3, 2, bars(3, 2)), FS('5 bars for 4 friends', 5, 4, bars(5, 4)), FS('4 bars for 3 friends', 4, 3, bars(4, 3)), FS('7 bars for 2 friends', 7, 2),
          FS('8 bars for 4 friends', 8, 4), FS('7 bars for 6 friends', 7, 6)]
      },
      p2: {
        items: [FS('{a} shares 5 sandwiches with 1 friend. How much does each get?', 5, 2), FS('3 friends share 7 pancakes. How much each?', 7, 3),
          FS('4 children share 9 muffins. How much each?', 9, 4), FS('2 children share 9 crackers. How much each?', 9, 2),
          { q: 'Draw 5 bars shared by 3 friends.', draw: { h: 50, key: bars(5, 3) }, wide: true }]
      },
      p3: {
        items: [FS('6 friends share 7 pizzas. How much each?', 7, 6), FS('3 friends share 10 bars. How much each?', 10, 3),
          FS('{a} and {b} share 3 apples. How much each?', 3, 2), FS('4 friends share 6 bars. How much each?', 6, 4),
          { q: '5 bars for 2 friends: {b} says 2 wholes each, and 1 left over. Finish the sharing.', lines: { n: 2, key: 'Cut the last bar in half: 2 wholes and 1 half each.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} shared 3 pizzas with 2 friends by cutting all 3 in half. Is that fair? Is there a faster way?', lines: { n: 2, key: 'Yes, 3 halves each is fair. Faster: 1 whole each, then cut 1 pizza in half.' } },
          { q: 'Draw 7 bars shared by 2 friends.', draw: { h: 50, key: bars(7, 2) } },
          { q: 'Why do you cut the last bar into 3 parts for 3 friends?', lines: { n: 2, key: 'So each friend gets 1 part of it.' } },
          { q: 'Write a sharing story where each friend gets 2 wholes and 1 half.', lines: { n: 2, key: 'For example: 5 bars for 2 friends.' } }]
      }
    },

    fewer: {
      watch: 'saying nobody gets any. Cut every thing so each friend gets a part of each.',
      goal: 'I can share when there are fewer things than friends.',
      learn: {
        show: { pic: bars(2, 3), cap: '2 muffins for 3 friends: cut both in thirds', eq: ['2 thirds each'] },
        together: [FS('1 pizza for 4 friends', 1, 4, bars(1, 4)), FS('3 bars for 4 friends', 3, 4, bars(3, 4))],
        cue: 'Cut each thing into one part for each friend.',
        own: [FS('1 bar for 2 friends', 1, 2), FS('2 bars for 3 friends', 2, 3), FS('3 pizzas for 6 friends', 3, 6), FS('2 muffins for 6 friends', 2, 6)]
      },
      p1: {
        show: { pic: bars(3, 4), cap: '3 bars for 4 friends', eq: ['3 fourths each'] },
        items: [FS('1 bar for 3 friends', 1, 3, bars(1, 3)), FS('2 bars for 4 friends', 2, 4, bars(2, 4)), FS('4 pizzas for 6 friends', 4, 6),
          FS('3 muffins for 8 friends', 3, 8), FS('1 pancake for 6 friends', 1, 6), FS('5 bars for 6 friends', 5, 6)]
      },
      p2: {
        items: [FS('{a} shares 1 sandwich with 1 friend. How much each?', 1, 2), FS('4 children share 3 pizzas. How much each?', 3, 4),
          FS('6 friends share 5 pies. How much each?', 5, 6), FS('8 friends share 3 pizzas. How much each?', 3, 8),
          { q: 'Draw 2 pizzas shared by 4 friends.', draw: { h: 50, key: bars(2, 4) }, wide: true }]
      },
      p3: {
        items: [FS('10 friends share 3 bars. How much each?', 3, 10), FS('5 friends share 4 bars. How much each?', 4, 5),
          { q: '2 bars for 4 friends gives 2 fourths each. Is that the same as 1 half?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '2 fourths = 1 half', fw: true },
          { q: '3 bars for 6 friends gives 3 sixths each. Is that the same as 1 half?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '3 sixths = 1 half', fw: true },
          { q: '{b} has 2 apples for 3 friends. {b} says, "Nobody gets one." How can they share?', lines: { n: 2, key: 'Cut each apple into thirds: each friend gets 2 thirds.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why does each friend get 3 fourths when 3 bars go to 4 friends?', lines: { n: 2, key: 'Each bar is cut in fourths. Each friend gets 1 fourth from each bar.' } },
          { q: 'Draw 2 bars shared by 3 friends. Shade one share.', draw: { h: 50, key: bars(2, 3) } },
          { q: 'Which is more: 1 bar for 4 friends, or 3 bars for 4 friends?', lines: { n: 2, key: '3 bars for 4 friends: 3 fourths is more than 1 fourth.' } },
          { q: 'Write a story where each friend gets 2 sixths.', lines: { n: 2, key: 'For example: 2 pizzas for 6 friends.' } }]
      }
    },

    thirdsix: {
      watch: 'saying 2 sixths is more than 1 third because 2 is more. Line the bars up and see where they end.',
      goal: 'I can show that one third is the same as two sixths.',
      learn: {
        show: { pic: ['row', { list: [bar(3, 1, 120), bar(6, 2, 120)], gap: 20 }], cap: 'Both end at the same line', eq: ['1 third = 2 sixths'] },
        together: [{ q: 'Each third cut in half.', pic: bar(6, 4), eq: ['2 thirds = [] sixths'], a: [4], fw: true }, { pic: ['row', { list: [bar(2, 1, 100), bar(4, 2, 100)], gap: 12 }], eq: ['1 half = [] fourths'], a: [2], fw: true, wide: true }],
        cue: 'Cut each part in two: there are twice as many parts.',
        own: [{ eq: ['1 third = [] sixths'], a: [2], fw: true }, { eq: ['3 thirds = [] sixths'], a: [6], fw: true }, { eq: ['4 sixths = [] thirds'], a: [2], fw: true }, { eq: ['2 fourths = [] half'], a: [1], fw: true }]
      },
      p1: {
        show: { pic: ['row', { list: [bar(3, 2, 120), bar(6, 4, 120)], gap: 20 }], cap: 'Thirds, then sixths', eq: ['2 thirds = 4 sixths'] },
        items: [{ eq: ['1 third = [] sixths'], a: [2], fw: true }, { eq: ['2 thirds = [] sixths'], a: [4], fw: true }, { eq: ['2 sixths = [] third'], a: [1], fw: true },
          { eq: ['6 sixths = [] thirds'], a: [3], fw: true }, { eq: ['1 half = [] fourths'], a: [2], fw: true }, { eq: ['1 half = [] sixths'], a: [3], fw: true }]
      },
      p2: {
        items: [TF('1 third = 2 sixths', true), TF('1 third = 3 sixths', false), TF('1 half = 2 fourths', true), TF('1 third = 1 sixth', false),
          { q: 'Shade 2 sixths. Is it the same as 1 third?', pic: ['row', { list: [bar(3, 1, 100), bar(6, 0, 100)], gap: 12 }], draw: { h: 6, key: ['row', { list: [bar(3, 1, 100), bar(6, 2, 100)], gap: 12 }] }, wide: true }]
      },
      p3: {
        items: [{ q: 'Mia gets 1 third of a pizza. Jon gets 2 sixths of the same pizza. Who gets more?', pick: { opts: ['Mia', 'Jon', 'same'], ans: 2, shareCmp: [[1, 3], [2, 6]] }, wide: true },
          { q: '{a} eats 2 thirds of a bar. {b} eats 4 sixths of the same bar. Who eats more?', pick: { opts: ['{a}', '{b}', 'same'], ans: 2, shareCmp: [[2, 3], [4, 6]] }, wide: true },
          { eq: ['2 fourths = [] eighths'], a: [4], fw: true }, { eq: ['1 fifth = [] tenths'], a: [2], fw: true }]
      },
      think: {
        items: [{ q: '{b} says 2 sixths is more than 1 third. Draw to show {b} the truth.', draw: { h: 60, key: ['row', { list: [bar(3, 1, 110), bar(6, 2, 110)], gap: 12 }] } },
          { q: 'How can you turn thirds into sixths?', lines: { n: 2, key: 'Cut each third in half.' } },
          { q: 'Find another name for 1 half.', lines: { n: 1, key: 'For example: 2 fourths, 3 sixths, 5 tenths.' } },
          { q: '1 pizza for 3 friends, or 2 pizzas for 6 friends: which share is bigger?', lines: { n: 2, key: 'The same: 1 third = 2 sixths.' } }]
      }
    },

    cmp: {
      watch: 'choosing the group with more things only. Look at the things and the friends.',
      goal: 'I can tell which share is more.',
      learn: {
        show: { pic: ['row', { list: [bars(2, 3), bars(2, 6)], gap: 30 }], cap: 'A: 2 for 3 friends. B: 2 for 6 friends. Thirds are bigger.', eq: ['A gets more'] },
        together: [CMP([1, 2], [1, 4], 'pizzas'), CMP([3, 4], [2, 4], 'bars')],
        cue: 'Same things, more friends: smaller shares. Same friends, more things: bigger shares.',
        own: [CMP([2, 3], [2, 6], 'pies'), CMP([1, 3], [2, 3], 'bars'), CMP([1, 3], [2, 6], 'pizzas')]
      },
      p1: {
        show: { cap: 'A: 1 pizza for 2 friends. B: 1 pizza for 4 friends.', eq: ['A gets more'] },
        items: [CMP([1, 3], [1, 6], 'pizzas'), CMP([2, 4], [3, 4], 'bars'), CMP([1, 2], [2, 4], 'pies'), CMP([3, 6], [3, 4], 'pancakes'), CMP([1, 4], [1, 2], 'pies'), CMP([2, 3], [4, 6], 'bars')]
      },
      p2: {
        items: [CMP([2, 3], [1, 3], 'bars'), CMP([1, 2], [1, 3], 'pizzas'), CMP([3, 6], [1, 2], 'pies'),
          { q: 'Draw to show who gets more: 1 bar for 2 friends, or 1 bar for 3 friends.', draw: { h: 50, key: ['row', { list: [bars(1, 2), bars(1, 3)], gap: 30 }] }, wide: true }]
      },
      p3: {
        items: [CMP([4, 3], [5, 3], 'bars'), CMP([3, 2], [3, 4], 'pizzas'), CMP([2, 4], [3, 6], 'pies'),
          { q: '{a} says 6 friends sharing 2 pizzas get more because 6 is bigger. Is {a} right?', lines: { n: 2, key: 'No. More friends means smaller shares.' }, wide: true }]
      },
      think: {
        items: [{ q: 'A: 3 bars for 4 friends. B: 3 bars for 2 friends. Which group gets more? Draw it.', draw: { h: 60, key: 'B: 1 whole and 1 half each, more than 3 fourths.' } },
          { q: 'How can 2 groups get the same share with different numbers?', lines: { n: 2, key: 'For example: 1 pizza for 2 and 2 pizzas for 4 both give 1 half.' } },
          { q: 'Change one number so group B gets more: A: 1 pizza for 3. B: 1 pizza for 6.', lines: { n: 2, key: 'For example: B: 3 pizzas for 6, or 1 pizza for 2.' } },
          { q: 'Why must you look at both the things and the friends?', lines: { n: 2, key: 'More things makes shares bigger; more friends makes them smaller.' } }]
      }
    }
  } });
})();
