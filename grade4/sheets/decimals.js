/* Grade 4 Decimals: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/decimals.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.7 read, represent, compose and decompose decimal tenths; B1.8 round decimal numbers to the nearest
   whole number; B1.9 fractions and decimal tenths; B2.3 and B2.4 add and subtract decimal tenths.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var t1 = function (v) { return +v.toFixed(1); };
  /* a strip of 10 squares with k shaded: write the decimal */
  function ST(k) { return { pic: ['grid', { n: k, cells: 10, unit: '0.1', quiet: true, u: 9 }], eq: ['[]'], a: [t1(k / 10)] }; }
  /* tenths bars past one whole: k tenths shaded */
  function FB(k) { return { pic: ['fbars', { rows: [[10, k]] }], eq: ['[]'], a: [t1(k / 10)] }; }
  /* ones and tenths disks */
  function DK(o, t) { var l = []; if (o) l.push([1, o]); if (t) l.push([0.1, t]); return { pic: ['disks', { list: l }], eq: ['[]'], a: [t1(o + t / 10)] }; }
  /* a point on a number line in tenths */
  function LN(min, max, pt) { return { pic: ['dline', { min: min, max: max, d: 10, show: 'ends', pt: pt }], eq: ['[]'], a: [pt] }; }
  /* label the marked places on a number line */
  function LA(min, max, ask) { return { pic: ['dline', { min: min, max: max, d: 10, show: 'ends', ask: ask }], a: ask.slice(), wide: true }; }
  /* a decimal as ones and tenths, or ones and tenths as a decimal */
  function OT(w, t) { return { eq: [t1(w + t / 10) + ' = [] ones + [] tenths'], a: [w, t], wide: true }; }
  function TO(w, t) { return { eq: [w + ' ones + ' + t + ' tenths = []'], a: [t1(w + t / 10)] }; }
  /* a decimal as tenths, and tenths as a decimal */
  function IN(v) { return { eq: [v + ' = [] tenths'], a: [Math.round(v * 10)] }; }
  function OUT(k) { return { eq: [k + ' tenths = []'], a: [t1(k / 10)] }; }
  /* a fraction out of 10 as a decimal, and back */
  function FD(n) { return { eq: [n + '/10 = []'], a: [t1(n / 10)] }; }
  function DF(n) { return { eq: [t1(n / 10) + ' = []/10'], a: [n] }; }
  /* a half or fifths through tenths */
  function HF(n, d) { var k = n * 10 / d; return { eq: [n + '/' + d + ' = []/10 = []'], a: [k, t1(k / 10)], wide: true }; }
  /* compare two decimals: circle the sign */
  function CMP(x, y) { return { eq: [x + ' ? ' + y], pick: { opts: ['<', '>', '='], ans: +x < +y ? 0 : +x > +y ? 1 : 2, cmp: [String(x), String(y)] }, pickLast: true }; }
  /* put in order */
  function ORD(list, down) {
    var s = list.slice().sort(function (p, q) { return down ? q - p : p - q; });
    return { q: (down ? 'Greatest to least: ' : 'Least to greatest: ') + list.join(', '), eq: [list.map(function () { return '[]'; }).join(down ? ' > ' : ' < ')], a: s, set: list.slice(), wide: list.length > 3 };
  }
  /* round to the nearest whole number (the title asks), with the hill or without */
  function RD(n, hill) {
    var it = { eq: [n + ' is about []'], a: [Math.round(n)], round: 1 };
    if (hill) it.pic = ['hill', { lo: Math.floor(n), hi: Math.floor(n) + 1, n: n }];
    return it;
  }
  /* add or subtract, as a decimal or as tenths */
  function AD(x, op, y) { return { eq: [x + ' ' + op + ' ' + y + ' = []'], a: [t1(op === '+' ? x + y : x - y)] }; }
  function AT(x, op, y) { return { eq: [x + ' ' + op + ' ' + y + ' = [] tenths'], a: [Math.round((op === '+' ? x + y : x - y) * 10)] }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }

  S.register('decimals', { code: 'DE', ideas: {

    tenth: {
      watch: 'writing 3 tenths as 0.03 or as 3.0. One tenth is one of 10 equal parts: 0.1, one place after the point.',
      goal: 'I can name tenths as a fraction and a decimal.',
      learn: {
        show: { pic: ['grid', { n: 3, cells: 10, unit: '0.1', quiet: true, u: 9 }], cap: '3 of 10 equal parts', eq: ['3/10 = 0.3'] },
        together: [ST(7), ST(1)],
        cue: 'One whole cut into 10 equal parts: each part is 0.1.',
        own: [ST(4), ST(9), FD(6), OUT(2)]
      },
      p1: {
        show: { cap: '5 tenths', eq: ['5/10 = 0.5'] },
        items: [ST(2), ST(8), ST(5), FD(3), FD(7), OUT(9)]
      },
      p2: {
        items: [ST(6), FD(1), DF(4), DF(8), OUT(10), IN(0.7)]
      },
      p3: {
        items: [DF(9), IN(0.3), OUT(6), { q: 'Shade 0.7.', pic: ['grid', { n: 0, cells: 10, unit: '0.1', quiet: true, ask: 7, u: 9 }], draw: { h: 6, key: 'Any 7 of the 10 parts shaded.' } },
          story('A trail has 10 equal parts. {a} has walked 4 of them. What decimal of the trail is that?', 'of the trail', 0.4, '4 / 10'),
          TF('0.1 = 1/10', true)]
      },
      think: {
        items: [{ q: '{b} says 3 tenths is 0.03. What would you tell {b}?', lines: { n: 3, key: 'Tenths are one place after the point: 3 tenths is 0.3.' } },
          { q: 'Why do 10 tenths make 1 whole?', lines: { n: 3, key: 'The whole is cut into 10 equal parts. All 10 parts make the whole again.' } },
          { q: 'Draw a picture of 0.6.', draw: { h: 70, key: 'A strip or circle cut into 10 equal parts, 6 shaded.' } },
          { q: 'How many tenths make 1 whole?', eq: ['[] × 0.1 = 1'], a: [10] }]
      }
    },

    point: {
      watch: 'reading 2.3 as "two point three" with no meaning, or writing 2 and 3 tenths as 23. The point separates wholes from tenths.',
      goal: 'I can read and write numbers with wholes and tenths.',
      learn: {
        show: { pic: ['disks', { list: [[1, 2], [0.1, 3]] }], cap: '2 wholes and 3 tenths', eq: ['2.3'] },
        together: [DK(1, 4), DK(3, 2)],
        cue: 'Wholes go before the point. Tenths go after it.',
        own: [DK(2, 6), DK(4, 1), TO(5, 7), OT(3, 8)]
      },
      p1: {
        show: { cap: '1 whole and 5 tenths', eq: ['1.5 = 1 + 0.5'] },
        items: [DK(1, 2), DK(2, 9), TO(1, 3), TO(4, 4), OT(2, 5), OT(6, 1)]
      },
      p2: {
        items: [FB(13), FB(16), LN(2, 3, 2.4), LN(5, 6, 5.8), OT(7, 3), TO(9, 9)]
      },
      p3: {
        items: [LA(3, 4, [3.2, 3.7]), FB(18), IN(2.5), OUT(34), OT(8, 0), TF('4.6 = 4 ones + 6 tenths', true)]
      },
      think: {
        items: [{ q: '{b} writes 2 wholes and 3 tenths as 23. What went wrong?', lines: { n: 3, key: '23 is 23 wholes. The point keeps the tenths apart: 2.3.' } },
          { q: 'Show 1.4 in two ways.', draw: { h: 90, key: 'For example: 1 whole strip and 4 tenths; 14 tenths; a point on a number line.' } },
          { q: 'Which is more: 3.1 or 31 tenths? Explain.', lines: { n: 3, key: 'They are the same: 31 tenths is 3 wholes and 1 tenth, 3.1.' } },
          { q: 'Write the number with 6 wholes and 2 tenths.', eq: ['6 ones + 2 tenths = []'], a: [6.2] }]
      }
    },

    fractions: {
      watch: 'writing 1/2 as 0.2 or 1/5 as 0.5. Cut the half or fifth into tenths first: 1/2 = 5/10 = 0.5.',
      goal: 'I can write a fraction as tenths and as a decimal.',
      learn: {
        show: { pic: ['fbars', { rows: [[2, 1], [10, 5]] }], cap: 'A half is 5 tenths', eq: ['1/2 = 5/10 = 0.5'] },
        together: [FD(7), HF(1, 5)],
        cue: 'Cut the parts into tenths. Then write the tenths after the point.',
        own: [FD(3), HF(2, 5), DF(9), HF(4, 5)]
      },
      p1: {
        show: { cap: 'Tenths are already ready', eq: ['8/10 = 0.8'] },
        items: [FD(2), FD(9), DF(5), DF(1), HF(1, 2), HF(3, 5)]
      },
      p2: {
        items: [HF(1, 5), HF(2, 2), FD(10), DF(6), { pic: ['fbars', { rows: [[5, 2]] }], eq: ['[]/10 = []'], a: [4, 0.4] },
          story('{a} ate 1/2 of a {one}. Write it as a decimal.', 'of a {one}', 0.5, '1 / 2')]
      },
      p3: {
        items: [HF(3, 5), HF(4, 5), { eq: ['1 + 1/2 = []'], a: [1.5] }, { eq: ['2 + 3/10 = []'], a: [2.3] },
          { q: 'Circle the one equal to 0.4.', pick: { opts: ['1/4', '2/5', '4/5'], ans: 1, val: '0.4' } }, TF('1/5 = 0.5', false)]
      },
      think: {
        items: [{ q: '{b} says 1/2 = 0.2. What went wrong?', lines: { n: 3, key: '{b} used the 2 from the bottom. Half is 5 tenths: 0.5.' } },
          { q: 'Draw bars to show 3/5 = 0.6.', draw: { h: 90, key: 'Two same-size bars: one in 5 parts with 3 shaded, one in 10 parts with 6 shaded.' } },
          { q: 'Why can we write fifths as tenths?', lines: { n: 3, key: 'Cut each fifth in 2: every fifth is 2 tenths.' } },
          { q: 'How many tenths are in 1/2?', eq: ['1/2 = []/10'], a: [5] }]
      }
    },

    compare: {
      watch: 'thinking 2.10 or 2.9 compare by "the longer number". Compare the wholes, then the tenths.',
      goal: 'I can compare and order decimals.',
      learn: {
        show: { pic: ['dline', { min: 1, max: 2, d: 10, show: 'dec', pt: 1.7 }], cap: 'Further right is greater', eq: ['1.7 > 1.4'] },
        together: [CMP(0.6, 0.8), CMP(3.2, 2.9)],
        cue: 'Compare the wholes first. Same wholes? Compare the tenths.',
        own: [CMP(1.5, 1.3), CMP(4.1, 4.1), CMP(0.9, 1.2), CMP(2.7, 7.2)]
      },
      p1: {
        show: { cap: 'Same wholes: 6 tenths beat 4', eq: ['3.6 > 3.4'] },
        items: [CMP(0.3, 0.7), CMP(1.8, 1.6), CMP(2.4, 3.1), CMP(5.5, 5.5), CMP(0.1, 1), CMP(6.2, 6.9)]
      },
      p2: {
        items: [CMP(7.3, 3.7), CMP(4.9, 5), CMP(8.1, 8.2), CMP(2, 1.9), ORD([2.4, 4.2, 2.2]), ORD([5.1, 1.5, 5.5], true)]
      },
      p3: {
        items: [ORD([3.6, 6.3, 3.3, 6.6], true), ORD([0.9, 1.1, 0.1, 1.9]),
          story('{a} ran 2.4 km. {b} ran 2.7 km. How much further did {b} run?', 'km', 0.3, '2.7 − 2.4'),
          { q: 'Who has more: {a} with 3.8 L or {b} with 3.5 L?', pick: { opts: ['{a}', '{b}'], ans: 0, more: ['3.8', '3.5'] } },
          CMP(9.9, 10), { q: 'Circle the greatest.', pick: { opts: ['4.8', '8.4', '4.4'], ans: 1, big: true } }]
      },
      think: {
        items: [{ q: '{b} says 1.9 > 2.1 because 9 > 1. What would you tell {b}?', lines: { n: 3, key: 'Compare the wholes first: 1 < 2, so 1.9 < 2.1.' } },
          { q: 'Write a decimal between 3.4 and 3.8.', lines: { n: 2, key: '3.5, 3.6 or 3.7.' } },
          { q: 'Mark 0.3, 0.9 and 0.6 on a number line from 0 to 1.', draw: { h: 70, key: 'A line cut into tenths with 0.3, 0.6 and 0.9 marked in order.' } },
          { q: 'Use the digits 2 and 5 and a point. Make the greatest decimal you can.', lines: { n: 2, key: '5.2 (the bigger digit goes in the wholes place).' } }]
      }
    },

    round: {
      watch: 'rounding 3.5 down, or looking at the wrong digit. Look at the tenths: 5 or more rolls up.',
      goal: 'I can round a decimal to the nearest whole number.',
      learn: {
        show: { pic: ['hill', { lo: 3, hi: 4, n: 3.7 }], cap: '3.7 is past halfway', eq: ['3.7 is about 4'] },
        together: [RD(2.2, true), RD(6.8, true)],
        cue: 'Tenths 5 or more: round up. Less than 5: round down.',
        own: [RD(1.4), RD(5.5), RD(7.9), RD(0.3)]
      },
      p1: {
        show: { cap: '4.2 is closer to 4', eq: ['4.2 is about 4'] },
        items: [RD(1.6, true), RD(8.1, true), RD(2.5), RD(4.4), RD(9.7), RD(3.3)]
      },
      p2: {
        items: [RD(12.6), RD(15.2), RD(0.8), RD(19.5), RD(7.1), { q: 'Which one rounds to 6?', pick: { opts: ['5.3', '6.6', '5.8'], ans: 2, round: { to: 1, val: 6 } } }]
      },
      p3: {
        items: [RD(24.4), RD(29.6), RD(9.5),
          { q: 'Which one rounds to 10?', pick: { opts: ['9.4', '10.7', '9.6'], ans: 2, round: { to: 1, val: 10 } } },
          { q: '{a} ran 4.6 km. About how far is that to the nearest km?', eq: ['4.6 is about []'], a: [5], round: 1 },
          { q: 'A {cont} holds 2.3 L. About how many litres?', eq: ['2.3 is about []'], a: [2], round: 1 }]
      },
      think: {
        items: [{ q: '{b} rounds 3.5 to 3. What would you tell {b}?', lines: { n: 3, key: '3.5 is halfway. Halfway rounds up: 4.' } },
          { q: 'Write 3 decimals that round to 7.', lines: { n: 2, key: 'For example: 6.5, 6.9, 7.2 (any from 6.5 to 7.4).' } },
          { q: 'Draw a hill from 8 to 9 and mark 8.3 on it.', draw: { h: 80, key: 'A hill with its top at 8.5; 8.3 on the 8 side, so it rounds to 8.' } },
          { q: 'Why do we round when we estimate?', lines: { n: 3, key: 'Whole numbers are easier to add in our head, and the answer lands close.' } }]
      }
    },

    add: {
      watch: 'adding 0.7 + 0.5 to get 0.12. Think in tenths: 12 tenths is 1 whole and 2 tenths, 1.2.',
      goal: 'I can add tenths.',
      learn: {
        show: { cap: '7 tenths + 5 tenths = 12 tenths', eq: ['0.7 + 0.5 = 1.2'] },
        together: [AT(0.4, '+', 0.3), AD(0.6, '+', 0.6)],
        cue: 'Think in tenths. 10 tenths make 1 whole.',
        own: [AD(0.2, '+', 0.5), AD(0.8, '+', 0.4), AD(1.3, '+', 2.5), AT(0.9, '+', 0.9)]
      },
      p1: {
        show: { cap: '3 tenths + 4 tenths', eq: ['0.3 + 0.4 = 0.7'] },
        items: [AD(0.1, '+', 0.6), AD(0.5, '+', 0.3), AD(0.7, '+', 0.3), AD(0.6, '+', 0.8), AD(1.2, '+', 1.4), AT(0.5, '+', 0.8)]
      },
      p2: {
        items: [AD(2.6, '+', 1.3), AD(3.8, '+', 0.5), AD(4.7, '+', 2.6), AD(1.9, '+', 1.9),
          story('{a} walks 1.4 km to the {cont}, then 0.8 km more. How far in all?', 'km', 2.2, '1.4 + 0.8'),
          story('{b} pours 0.6 L, then 0.7 L. How much in all?', 'L', 1.3, '0.6 + 0.7')]
      },
      p3: {
        items: [AD(5.4, '+', 3.9), AD(12.5, '+', 4.8), AD(6.6, '+', 7.7),
          story('A board is 2.5 m. {a} adds 1.7 m. How long is it now?', 'm', 4.2, '2.5 + 1.7'),
          story('{b} has 3.6 kg of {many} and buys 2.4 kg more. How much in all?', 'kg', 6, '3.6 + 2.4'), TF('0.5 + 0.5 = 1', true)]
      },
      think: {
        items: [{ q: '{b} says 0.7 + 0.5 = 0.12. What went wrong?', lines: { n: 3, key: '7 tenths + 5 tenths = 12 tenths, which is 1 whole and 2 tenths: 1.2.' } },
          { q: 'Draw tenths strips to show 0.8 + 0.6.', draw: { h: 90, key: 'One strip with 8 shaded, then 6 more: a full strip and 4 tenths, 1.4.' } },
          { q: 'Find two decimals that add to 1.', lines: { n: 2, key: 'For example: 0.3 + 0.7, 0.6 + 0.4.' } },
          { q: 'Estimate first, then add: 3.8 + 4.1.', eq: ['3.8 + 4.1 = []'], a: [7.9] }]
      }
    },

    sub: {
      watch: 'taking the smaller digit from the bigger (4.2 − 1.7 = 3.5). Think in tenths, or count up from the smaller number.',
      goal: 'I can subtract tenths.',
      learn: {
        show: { cap: '42 tenths − 17 tenths = 25 tenths', eq: ['4.2 − 1.7 = 2.5'] },
        together: [AT(0.9, '−', 0.4), AD(1.5, '−', 0.8)],
        cue: 'Think in tenths. Not enough tenths? Break 1 whole into 10 tenths.',
        own: [AD(0.8, '−', 0.3), AD(1.2, '−', 0.5), AD(3.6, '−', 1.4), AT(2.3, '−', 0.6)]
      },
      p1: {
        show: { cap: '7 tenths − 2 tenths', eq: ['0.7 − 0.2 = 0.5'] },
        items: [AD(0.9, '−', 0.6), AD(0.6, '−', 0.1), AD(1, '−', 0.3), AD(1.4, '−', 0.7), AD(2.8, '−', 1.5), AT(1.1, '−', 0.4)]
      },
      p2: {
        items: [AD(5.3, '−', 2.8), AD(4, '−', 1.6), AD(6.2, '−', 3.9), AD(7.5, '−', 0.9),
          story('{a} has 2.5 L of juice and pours out 0.8 L. How much is left?', 'L', 1.7, '2.5 − 0.8'),
          story('A trail is 4.3 km. {b} has walked 1.6 km. How far is left?', 'km', 2.7, '4.3 − 1.6')]
      },
      p3: {
        items: [AD(10, '−', 3.4), AD(12.1, '−', 5.6), AD(8.3, '−', 4.7),
          story('{a} is 1.4 m tall. {b} is 1.2 m tall. How much taller is {a}?', 'm', 0.2, '1.4 − 1.2'),
          story('A {cont} weighs 5.2 kg. {b} takes out 2.9 kg of {many}. What does it weigh now?', 'kg', 2.3, '5.2 − 2.9'),
          { q: 'Check by adding.', eq: ['6.1 − 2.4 = []', '[] + 2.4 = 6.1'], a: [3.7, 3.7] }]
      },
      think: {
        items: [{ q: '{b} says 4.2 − 1.7 = 3.5. What went wrong?', lines: { n: 3, key: '{b} did 7 − 2 instead of 2 − 7. Break a whole: 42 tenths − 17 tenths = 25 tenths, 2.5.' } },
          { q: 'Count up to find 3 − 1.6. Show your jumps.', draw: { h: 80, key: '1.6 + 0.4 = 2, then + 1 = 3. Jumps 0.4 + 1 = 1.4.' } },
          { q: 'Write a story for 5.0 − 2.5.', lines: { n: 3, key: 'For example: {a} has 5 L of water and uses 2.5 L; 2.5 L is left.' } },
          { q: 'What number is missing?', eq: ['3.6 − [] = 1.9'], a: [1.7] }]
      }
    }
  } });
})();
