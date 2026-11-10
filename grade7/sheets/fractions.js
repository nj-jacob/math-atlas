/* Grade 7 Fractions: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/fractions.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.3 compare and order fractions; B1.4 equivalent fractions to simplify; B1.5 fractions and decimals between
   two others; B2.5 add and subtract fractions, including by making equivalent fractions. The answer checks are in
   tests/verify/sheets.js: every sum is worked out again, an answer asked for in simplest form must be in simplest form,
   and a fraction between two others must really be between them. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* a tiny fraction kit: '2 1/3' is [7, 3]; answers are written in simplest form, as mixed numbers when over 1 */
  function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }
  function R(s) {
    var m = String(s).match(/^(?:(\d+) )?(\d+)\/(\d+)$/);
    return m ? [(+(m[1] || 0)) * +m[3] + +m[2], +m[3]] : [+s, 1];
  }
  function str(r) {
    var g = gcd(r[0], r[1]), n = r[0] / g, d = r[1] / g;
    if (d === 1) return String(n);
    return n > d ? Math.floor(n / d) + ' ' + n % d + '/' + d : n + '/' + d;
  }
  function op(x, sign, y) { var a = R(x), b = R(y); return str([a[0] * b[1] + (sign === '+' ? 1 : -1) * b[0] * a[1], a[1] * b[1]]); }
  function v(s) { var r = R(s); return r[0] / r[1]; }
  /* an equivalent fraction: n/d = []/(d × m), or the top given and the bottom blank */
  function EQ(n, d, m, bottom) { return bottom ? { eq: [n + '/' + d + ' = ' + n * m + '/[]'], a: [d * m] } : { eq: [n + '/' + d + ' = []/' + d * m], a: [n * m] }; }
  /* the same with fraction bars: n/d over its equivalent in pieces m times smaller */
  function BAR(n, d, m) { return { pic: ['fbars', { rows: [[d, n], [d * m, n * m]] }], eq: [n + '/' + d + ' = []/' + d * m], a: [n * m] }; }
  /* simplify: the answer in simplest form */
  function SIMP(n, d) { return { eq: [n + '/' + d + ' = []'], a: [str([n, d])], simplest: true }; }
  /* divide top and bottom by g */
  function DIV(n, d, g) { return { eq: [n + '/' + d + ' = []/' + d / g], a: [n / g] }; }
  /* compare: circle the sign */
  function CMP(x, y) { var a = v(x), b = v(y); return { eq: [x + ' ? ' + y], pick: { opts: ['<', '>', '='], ans: a < b ? 0 : a > b ? 1 : 2, cmp: [x, y] }, pickLast: true }; }
  /* rename both with a common denominator d */
  function CD(x, y, d) { var a = R(x), b = R(y); return { q: 'Use a bottom of ' + d + '.', eq: [x + ' = []/' + d, y + ' = []/' + d], a: [a[0] * d / a[1], b[0] * d / b[1]] }; }
  /* least to greatest */
  function ORD(list) {
    return { q: 'Least to greatest: ' + list.join(', '), eq: [list.map(function () { return '[]'; }).join(' < ')], a: list.slice().sort(function (x, y) { return v(x) - v(y); }), set: list, wide: list.length > 3 };
  }
  /* a fraction or decimal between two others (ans is one good answer; the key says others work too) */
  function BTW(x, y, ans) { return { eq: [x + ' < [] < ' + y], a: [ans] }; }
  /* add or subtract, the answer in simplest form */
  function AS(x, sign, y) { return { eq: [x + ' ' + sign + ' ' + y + ' = []'], a: [op(x, sign, y)], simplest: true }; }
  /* add or subtract by first renaming with a common denominator d */
  function AS2(x, sign, y, d) {
    var a = R(x), b = R(y), ta = a[0] * d / a[1], tb = b[0] * d / b[1];
    return { eq: [x + ' ' + sign + ' ' + y + ' = []/' + d + ' ' + sign + ' []/' + d + ' = []'], a: [ta, tb, op(x, sign, y)], simplest: true, wide: true };
  }
  function story(q, unit, ans, calc, more) { var it = { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; return more ? Object.assign(it, more) : it; }

  S.register('fractions', { code: 'FR', ideas: {

    same: {
      watch: 'thinking a bigger number means a bigger amount. 4/8 has more pieces, but they are smaller, so 4/8 = 1/2.',
      goal: 'I can show that two fractions name the same amount.',
      learn: {
        show: { pic: ['fbars', { rows: [[3, 2], [6, 4]] }], cap: 'same length shaded', eq: ['2/3 = 4/6'] },
        together: [BAR(1, 2, 2), BAR(3, 4, 2)],
        cue: 'Same amount shaded, different size of pieces.',
        own: [BAR(1, 3, 2), BAR(2, 5, 2), BAR(1, 4, 3)]
      },
      p1: {
        show: { pic: ['fbars', { rows: [[2, 1], [8, 4]] }], eq: ['1/2 = 4/8'] },
        items: [BAR(1, 2, 3), BAR(2, 3, 2), BAR(3, 5, 2), BAR(1, 6, 2), BAR(3, 4, 3), BAR(1, 5, 2)]
      },
      p2: {
        items: [EQ(1, 2, 5), EQ(2, 3, 4), EQ(3, 4, 5), EQ(5, 6, 3), EQ(4, 5, 4, true), EQ(7, 10, 3, true)]
      },
      p3: {
        items: [{ q: 'Which is not equal to 2/3?', pick: { opts: ['4/6', '6/9', '6/8'], ans: 2, diff: true } },
          { q: 'Which is equal to 3/5?', pick: { opts: ['6/10', '5/3', '6/8'], ans: 0, val: 0.6 } },
          story('{a} ate 2/8 of a pizza and {b} ate 1/4 of the same size of pizza. How many eighths did {b} eat?', 'eighths', 2, '1/4 × 8', { wide: true }),
          EQ(5, 8, 3), EQ(9, 10, 10)]
      },
      think: {
        items: [{ q: '{b} says 3/6 is bigger than 1/2 because 3 is bigger than 1. Is {b} right?', lines: { n: 3, key: 'No. Sixths are smaller pieces. 3 sixths cover the same as 1 half: 3/6 = 1/2.' } },
          { q: 'Draw bars to show 3/4 = 6/8.', draw: { h: 50, key: ['fbars', { rows: [[4, 3], [8, 6]] }] } },
          EQ(4, 7, 3),
          { q: 'Name three fractions equal to 1/3.', lines: { n: 1, key: '2/6, 3/9, 4/12 (any with the bottom 3 times the top).' } }]
      }
    },

    rule: {
      watch: 'adding the same number to top and bottom: 2/3 is not 4/5. Multiply both by the same number.',
      goal: 'I can make an equivalent fraction by multiplying the top and the bottom.',
      learn: {
        show: { cap: '× 4 on top and bottom', eq: ['3/5 = 12/20'] },
        together: [EQ(2, 3, 5), EQ(5, 7, 3, true)],
        cue: 'Multiply the top and the bottom by the same number.',
        own: [EQ(1, 4, 6), EQ(3, 8, 2), EQ(4, 9, 3, true), EQ(5, 12, 2, true)]
      },
      p1: {
        show: { cap: '× 3 on top and bottom', eq: ['2/7 = 6/21'] },
        items: [EQ(1, 3, 4), EQ(2, 5, 3), EQ(3, 7, 2), EQ(4, 5, 5), EQ(1, 8, 3, true), EQ(5, 6, 4, true)]
      },
      p2: {
        items: [EQ(7, 8, 3), EQ(3, 10, 10), EQ(9, 11, 2), EQ(6, 7, 4, true), EQ(2, 9, 5, true), EQ(11, 12, 3)]
      },
      p3: {
        items: [{ eq: ['3/4 = []/12 = []/20'], a: [9, 15], wide: true }, { eq: ['2/5 = 6/[] = []/50'], a: [15, 20], wide: true },
          EQ(13, 20, 5), EQ(4, 15, 4, true),
          { q: 'Which is equal to 2/3?', pick: { opts: ['4/5', '8/12', '6/8'], ans: 1, val: 2 / 3 } }]
      },
      think: {
        items: [{ q: '{b} says 2/3 = 3/4 because 1 was added to the top and the bottom. What went wrong?', lines: { n: 3, key: 'Adding changes the amount. Multiply both: 2/3 = 4/6. 3/4 is bigger than 2/3.' } },
          { q: 'Why does multiplying top and bottom by 5 not change the amount?', lines: { n: 3, key: 'It is the same as multiplying by 5/5, which is 1. Each piece is cut into 5, so there are 5 times as many smaller pieces.' } },
          EQ(5, 9, 6),
          { q: 'Write 1/4 with a denominator of 100. Then as a percent.', eq: ['1/4 = []/100'], a: [25] }]
      }
    },

    gcf: {
      watch: 'dividing by a common factor that is not the greatest and stopping. 12/18 ÷ 2 is 6/9: divide again, or use 6 at once.',
      goal: 'I can simplify a fraction by dividing by the GCF.',
      learn: {
        show: { cap: 'GCF of 12 and 18 is 6: ÷ 6', eq: ['12/18 = 2/3'] },
        together: [DIV(8, 12, 4), DIV(15, 25, 5)],
        cue: 'Divide the top and the bottom by the GCF.',
        own: [DIV(6, 9, 3), DIV(14, 21, 7), SIMP(10, 16), SIMP(18, 24)]
      },
      p1: {
        show: { cap: 'GCF of 20 and 30 is 10: ÷ 10', eq: ['20/30 = 2/3'] },
        items: [DIV(4, 8, 4), DIV(9, 12, 3), DIV(10, 15, 5), SIMP(6, 8), SIMP(12, 16), SIMP(20, 25)]
      },
      p2: {
        items: [SIMP(18, 27), SIMP(24, 36), SIMP(16, 40), SIMP(35, 49), SIMP(28, 42), SIMP(45, 60)]
      },
      p3: {
        items: [SIMP(36, 48), SIMP(54, 72), SIMP(75, 100), SIMP(66, 99), SIMP(64, 96),
          story('A team won 30 of 45 games. What fraction did they win, in simplest form?', '', '2/3', '30/45', { simplest: true })]
      },
      think: {
        items: [{ q: '{b} simplified 24/36 to 12/18 and stopped. What would you tell {b}?', lines: { n: 3, key: '12/18 can still be simplified. Use the GCF, 12, at once: 24/36 = 2/3.' } },
          { q: 'How do you know 2/3 is in simplest form?', lines: { n: 2, key: '2 and 3 share no factor but 1.' } },
          SIMP(84, 126),
          { q: 'Write two fractions that simplify to 3/4.', lines: { n: 1, key: 'For example 6/8 and 30/40.' } }]
      }
    },

    simplest: {
      watch: 'calling a fraction simplest because its numbers are small. Check for a shared factor: 4/6 still shares 2.',
      goal: 'I can tell if a fraction is in simplest form.',
      learn: {
        show: { cap: '5 and 8 share only 1', eq: ['5/8 is in simplest form'] },
        together: [{ q: 'Which is in simplest form?', pick: { opts: ['4/6', '5/9', '6/9'], ans: 1, simplest: true } }, SIMP(4, 6)],
        cue: 'If the top and bottom share only 1, it is simplest.',
        own: [{ q: 'Which is in simplest form?', pick: { opts: ['3/12', '7/12', '9/12'], ans: 1, simplest: true } }, SIMP(9, 12), SIMP(3, 12), { q: 'Which is in simplest form?', pick: { opts: ['8/10', '9/10', '6/10'], ans: 1, simplest: true } }]
      },
      p1: {
        show: { eq: ['6/15: both ÷ 3', '6/15 = 2/5'] },
        items: [{ q: 'Which is in simplest form?', pick: { opts: ['2/8', '3/8', '4/8'], ans: 1, simplest: true } }, { q: 'Which is in simplest form?', pick: { opts: ['5/15', '6/15', '7/15'], ans: 2, simplest: true } },
          SIMP(6, 15), SIMP(5, 15), SIMP(14, 16), SIMP(21, 28)]
      },
      p2: {
        items: [{ q: 'Which is in simplest form?', pick: { opts: ['12/20', '13/20', '15/20'], ans: 1, simplest: true } }, { q: 'Which is in simplest form?', pick: { opts: ['9/21', '14/21', '16/21'], ans: 2, simplest: true } },
          SIMP(27, 45), SIMP(32, 48), SIMP(22, 55), SIMP(39, 52)]
      },
      p3: {
        items: [{ q: 'Which is in simplest form?', pick: { opts: ['15/35', '21/35', '22/35'], ans: 2, simplest: true } }, { q: 'Which is in simplest form?', pick: { opts: ['27/36', '25/36', '30/36'], ans: 1, simplest: true } },
          SIMP(51, 68), SIMP(57, 76), SIMP(48, 120)]
      },
      think: {
        items: [{ q: '{b} says 9/16 can be simplified because 9 and 16 are not prime. Is {b} right?', lines: { n: 3, key: 'No. 9 = 3 × 3 and 16 = 2 × 2 × 2 × 2 share no factor, so 9/16 is simplest.' } },
          { q: 'Is every fraction with a prime denominator in simplest form? Explain.', lines: { n: 3, key: 'Only if the top is not a multiple of it: 3/7 is simplest, 14/7 = 2 is not.' } },
          SIMP(91, 117),
          { q: 'Write a fraction with 12 on the bottom that is in simplest form.', lines: { n: 1, key: '1/12, 5/12, 7/12 or 11/12.' } }]
      }
    },

    samepart: {
      watch: 'thinking a bigger bottom means a bigger fraction. 1/8 < 1/5: eighths are smaller pieces.',
      goal: 'I can compare fractions with the same bottom or the same top.',
      learn: {
        show: { pic: ['fbars', { rows: [[5, 3], [8, 3]], labels: ['3/5', '3/8'] }], cap: 'same top: fifths are bigger', eq: ['3/5 > 3/8'] },
        together: [CMP('4/9', '7/9'), CMP('2/3', '2/7')],
        cue: 'Same bottom: compare the tops. Same top: the smaller bottom wins.',
        own: [CMP('5/6', '1/6'), CMP('3/10', '3/4'), CMP('7/12', '5/12'), CMP('1/9', '1/2')]
      },
      p1: {
        show: { eq: ['5/7 > 2/7', '2/5 > 2/9'] },
        items: [CMP('3/8', '5/8'), CMP('9/11', '4/11'), CMP('1/6', '1/4'), CMP('4/5', '4/7'), CMP('6/13', '6/13'), CMP('2/9', '2/3')]
      },
      p2: {
        items: [CMP('11/20', '9/20'), CMP('5/12', '5/8'), CMP('7/15', '7/10'), CMP('13/16', '15/16'), CMP('3/50', '3/100'), CMP('8/9', '8/11')]
      },
      p3: {
        items: [{ q: 'Which is greatest?', pick: { opts: ['5/9', '5/6', '5/12'], ans: 1, big: true } }, { q: 'Which is least?', pick: { opts: ['4/7', '6/7', '3/7'], ans: 2, small: true } },
          ORD(['3/4', '3/10', '3/5']), ORD(['7/12', '1/12', '11/12']),
          { q: '{a} ran 2/3 of a trail. {b} ran 2/5 of it. Who ran farther?', pick: { opts: ['{a}', '{b}'], ans: 0, more: ['2/3', '2/5'] } }]
      },
      think: {
        items: [{ q: '{b} says 1/10 > 1/3 because 10 > 3. What went wrong?', lines: { n: 3, key: 'A whole cut into 10 has smaller pieces than one cut into 3, so 1/10 < 1/3.' } },
          { q: 'Explain how to compare 5/8 and 5/6 without drawing.', lines: { n: 3, key: 'Same top: 5 pieces each. Sixths are bigger than eighths, so 5/6 > 5/8.' } },
          CMP('99/100', '99/101'),
          { q: 'Draw bars to show 2/3 > 2/4.', draw: { h: 50, key: ['fbars', { rows: [[3, 2], [4, 2]] }] } }]
      }
    },

    common: {
      watch: 'comparing only the tops when the bottoms differ. Rename both with a common denominator first.',
      goal: 'I can compare fractions by giving them a common denominator.',
      learn: {
        show: { cap: '3/4 = 9/12 and 5/6 = 10/12', eq: ['9/12 < 10/12', '3/4 < 5/6'] },
        together: [CD('2/3', '3/4', 12), CMP('2/3', '3/4')],
        cue: 'Rename both with the same bottom, then compare the tops.',
        own: [CD('1/2', '3/5', 10), CMP('1/2', '3/5'), CD('5/6', '7/9', 18), CMP('5/6', '7/9')]
      },
      p1: {
        show: { cap: '2/5 = 4/10', eq: ['4/10 > 3/10', '2/5 > 3/10'] },
        items: [CD('1/3', '2/9', 9), CMP('1/3', '2/9'), CD('3/4', '5/8', 8), CMP('3/4', '5/8'), CD('2/3', '5/6', 6), CMP('2/3', '5/6')]
      },
      p2: {
        items: [CMP('3/5', '2/3'), CMP('5/8', '7/12'), CMP('4/7', '1/2'), CMP('7/10', '3/4'), CMP('5/9', '2/3'), CMP('9/12', '3/4')]
      },
      p3: {
        items: [CMP('11/15', '7/10'), CMP('5/6', '13/16'), CMP('3/8', '4/11'),
          { q: 'Which is greatest?', pick: { opts: ['2/3', '5/8', '7/12'], ans: 0, big: true } },
          { q: '{a} saved 3/5 of a paycheque. {b} saved 4/7 of the same paycheque. Who saved more?', pick: { opts: ['{a}', '{b}'], ans: 0, more: ['3/5', '4/7'] }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says 3/7 > 2/3 because 3 > 2. What went wrong?', lines: { n: 3, key: 'The bottoms differ. 3/7 = 9/21 and 2/3 = 14/21, so 3/7 < 2/3.' } },
          { q: 'What common denominator would you use for 5/6 and 3/8? Why?', lines: { n: 2, key: '24, the LCM of 6 and 8: the smallest bottom both go into.' } },
          CD('5/6', '3/8', 24),
          CMP('5/6', '3/8')]
      }
    },

    half: {
      watch: 'forgetting that half of the bottom is the halfway top. 5/12: half of 12 is 6, and 5 < 6, so 5/12 < 1/2.',
      goal: 'I can compare a fraction with one half.',
      learn: {
        show: { pic: ['dline', { min: 0, max: 1, d: 8, show: 'frac', pt: 0.375 }], cap: 'half of 8 is 4, and 3 < 4', eq: ['3/8 < 1/2'] },
        together: [CMP('5/8', '1/2'), CMP('4/9', '1/2')],
        cue: 'Is the top more or less than half the bottom?',
        own: [CMP('7/12', '1/2'), CMP('2/5', '1/2'), CMP('6/12', '1/2'), CMP('9/16', '1/2')]
      },
      p1: {
        show: { cap: 'half of 10 is 5, and 7 > 5', eq: ['7/10 > 1/2'] },
        items: [CMP('3/4', '1/2'), CMP('2/6', '1/2'), CMP('5/11', '1/2'), CMP('8/15', '1/2'), CMP('10/20', '1/2'), CMP('4/7', '1/2')]
      },
      p2: {
        items: [CMP('3/7', '5/8'), CMP('6/11', '4/9'), CMP('2/5', '7/12'), CMP('9/17', '3/8'), CMP('5/9', '6/13'), CMP('13/25', '11/24')]
      },
      p3: {
        items: [CMP('15/31', '17/32'), CMP('4/10', '6/11'),
          { q: 'Which is more than one half?', pick: { opts: ['3/7', '7/13', '6/12'], ans: 1, big: true } },
          { q: 'Which is less than one half?', pick: { opts: ['8/17', '9/16', '5/10'], ans: 0, small: true } },
          ORD(['5/9', '1/2', '3/8'])]
      },
      think: {
        items: [{ q: 'Explain how one half helps you compare 4/9 and 5/8 quickly.', lines: { n: 3, key: '4/9 is less than 1/2 (4 < 4.5) and 5/8 is more (5 > 4), so 4/9 < 5/8.' } },
          { q: 'Name a fraction just a little more than 1/2 with 20 on the bottom.', lines: { n: 1, key: '11/20' } },
          CMP('49/100', '51/100'),
          { q: 'When does this trick not help? Give an example.', lines: { n: 2, key: 'When both are on the same side of 1/2, like 5/8 and 4/6: use a common denominator.' } }]
      }
    },

    order: {
      watch: 'ordering by the bottoms or the tops alone. Rename with one common denominator, or use benchmarks 0, 1/2 and 1.',
      goal: 'I can put three or more fractions in order.',
      learn: {
        show: { cap: 'in twelfths: 8/12, 9/12, 10/12', eq: ['2/3 < 3/4 < 5/6'] },
        together: [ORD(['1/2', '1/3', '1/4']), ORD(['3/4', '2/3', '5/6'])],
        cue: 'Give them all the same bottom, then order the tops.',
        own: [ORD(['5/8', '1/4', '1/2']), ORD(['7/10', '2/5', '1/2']), ORD(['3/4', '7/8', '5/8'])]
      },
      p1: {
        show: { cap: 'in tenths: 5/10, 6/10, 8/10', eq: ['1/2 < 3/5 < 4/5'] },
        items: [ORD(['2/3', '1/6', '1/2']), ORD(['3/5', '7/10', '1/2']), ORD(['1/3', '5/12', '1/4']), ORD(['4/9', '2/3', '1/3'])]
      },
      p2: {
        items: [ORD(['3/4', '5/8', '7/12']), ORD(['2/5', '3/10', '1/4']), ORD(['5/6', '7/9', '2/3']), ORD(['1/2', '3/7', '4/7'])]
      },
      p3: {
        items: [ORD(['3/5', '1/2', '5/8', '2/3']), ORD(['7/8', '5/6', '9/10', '3/4']),
          ORD(['1 1/4', '1 1/3', '1 1/6'])]
      },
      think: {
        items: [{ q: '{b} put 1/2, 1/3, 1/4 in order from least to greatest. Is it right?', lines: { n: 3, key: 'No. That is greatest to least. Least to greatest is 1/4, 1/3, 1/2.' } },
          { q: 'Explain how you would order 5/6, 3/8 and 7/12.', lines: { n: 3, key: 'Rename with 24ths: 20/24, 9/24, 14/24. So 3/8 < 7/12 < 5/6.' } },
          ORD(['5/6', '3/8', '7/12']),
          { q: 'Mark 1/4, 1/2 and 5/8 on a number line from 0 to 1.', draw: { h: 40, key: 'A line from 0 to 1 with 1/4, 1/2 and 5/8 marked in order.' } }]
      }
    },

    zoom: {
      watch: 'saying there is no fraction between 1/3 and 1/2. Rename with a bigger bottom: 4/12 and 6/12 have 5/12 between.',
      goal: 'I can find a fraction between any two fractions.',
      learn: {
        show: { pic: ['fbars', { rows: [[12, 4], [12, 5], [12, 6]], labels: ['1/3', '5/12', '1/2'] }], cap: '1/3 = 4/12 and 1/2 = 6/12', eq: ['1/3 < 5/12 < 1/2'] },
        together: [BTW('2/5', '3/5', '1/2'), BTW('1/4', '1/2', '3/8')],
        cue: 'No gap? Cut the pieces smaller: use a bigger common bottom.',
        own: [BTW('3/8', '5/8', '1/2'), BTW('1/3', '2/3', '1/2'), BTW('3/4', '1', '7/8'), BTW('2/3', '3/4', '17/24')]
      },
      p1: {
        show: { cap: '1/5 = 2/10 and 2/5 = 4/10', eq: ['1/5 < 3/10 < 2/5'] },
        items: [BTW('1/6', '3/6', '2/6'), BTW('1/2', '1', '3/4'), BTW('2/7', '4/7', '3/7'), BTW('1/5', '2/5', '3/10'), BTW('3/10', '2/5', '7/20'), BTW('5/9', '7/9', '2/3')]
      },
      p2: {
        items: [BTW('1/4', '1/3', '7/24'), BTW('2/3', '5/6', '3/4'), BTW('3/8', '1/2', '7/16'), BTW('4/5', '5/6', '49/60'), BTW('1/10', '1/5', '3/20'), BTW('5/12', '1/2', '11/24')]
      },
      p3: {
        items: [{ eq: ['1/3 < [] < [] < 1/2'], a: ['5/12', '11/24'], wide: true }, BTW('7/10', '3/4', '29/40'), BTW('6/7', '7/8', '97/112'),
          { q: 'Which is between 1/4 and 1/2?', pick: { opts: ['1/5', '3/8', '5/8'], ans: 1, between: [0.25, 0.5] } },
          { q: 'A recipe needs between 1/2 and 3/4 of a cup of milk. Write an amount in eighths that works.', eq: ['1/2 < [] < 3/4'], a: ['5/8'], wide: true }]
      },
      think: {
        items: [{ q: '{b} says there is no fraction between 1/3 and 1/2. Is {b} right?', lines: { n: 3, key: 'No. 1/3 = 4/12 and 1/2 = 6/12, so 5/12 is between. There are always more.' } },
          { q: 'How many fractions are between 0 and 1? Explain.', lines: { n: 2, key: 'Infinitely many: you can always cut the pieces smaller.' } },
          BTW('99/100', '1', '199/200'),
          { q: 'Find three fractions between 1/4 and 1/2.', lines: { n: 1, key: 'For example 5/16, 3/8 and 7/16.' } }]
      }
    },

    decimals: {
      watch: 'thinking there is no decimal between 0.3 and 0.4. Add a place: 0.31, 0.35 and 0.399 are all between.',
      goal: 'I can find a decimal between any two decimals.',
      learn: {
        show: { pic: ['dline', { min: 0.3, max: 0.4, d: 100, show: 'ends', pt: 0.35 }], cap: 'cut the tenth into hundredths', eq: ['0.3 < 0.35 < 0.4'] },
        together: [BTW(0.6, 0.7, 0.65), BTW(2.4, 2.5, 2.45)],
        cue: 'Add a zero to cut the pieces 10 times smaller.',
        own: [BTW(0.1, 0.2, 0.15), BTW(5.8, 5.9, 5.85), BTW(0.25, 0.26, 0.255), BTW(1.99, 2, 1.995)]
      },
      p1: {
        show: { cap: '0.7 = 0.70 and 0.8 = 0.80', eq: ['0.7 < 0.72 < 0.8'] },
        items: [BTW(0.4, 0.5, 0.45), BTW(3.1, 3.2, 3.15), BTW(0.9, 1, 0.95), BTW(0.62, 0.63, 0.625), BTW(7.05, 7.06, 7.055), BTW(0.01, 0.02, 0.015)]
      },
      p2: {
        items: [BTW(0.125, 0.126, 0.1255), BTW(0.3, 0.31, 0.305), BTW(4.99, 5, 4.995), { eq: ['0.2 < [] < [] < 0.3'], a: [0.24, 0.27], wide: true },
          BTW('1/4', 0.3, 0.27), BTW(0.5, '3/5', 0.55)]
      },
      p3: {
        items: [BTW('1/3', '2/5', 0.35), BTW('7/8', 0.9, 0.88), { eq: ['0.111 < [] < 0.112'], a: [0.1115] },
          { q: 'Which is between 0.4 and 0.41?', pick: { opts: ['0.45', '0.405', '0.39'], ans: 1, between: [0.4, 0.41] } },
          { q: 'A cut must be between 2.5 cm and 2.6 cm long. Give a length to the hundredths.', eq: ['2.5 < [] < 2.6'], a: [2.55], wide: true }]
      },
      think: {
        items: [{ q: '{b} says no number is between 0.9 and 1. Is {b} right?', lines: { n: 3, key: 'No. 0.9 = 0.90 and 1 = 1.00, so 0.95 is between (and 0.91, 0.99 ...).' } },
          { q: 'Why is 0.35 bigger than 0.3 even though it has more digits after the point?', lines: { n: 3, key: '0.35 is 35 hundredths and 0.3 is 30 hundredths. More hundredths is more.' } },
          BTW(0.99, 1, 0.995),
          { q: 'Write a decimal and a fraction that are both between 0.5 and 0.6.', lines: { n: 1, key: 'For example 0.55 and 11/20.' } }]
      }
    },

    addsame: {
      watch: 'adding the bottoms too: 2/7 + 3/7 is 5/7, not 5/14. The pieces stay sevenths.',
      goal: 'I can add fractions with the same denominator.',
      learn: {
        show: { pic: ['fbars', { rows: [[7, 5]] }], cap: '2 sevenths and 3 sevenths', eq: ['2/7 + 3/7 = 5/7'] },
        together: [AS('1/5', '+', '2/5'), AS('3/8', '+', '3/8')],
        cue: 'Add the tops. The bottom stays the same.',
        own: [AS('4/9', '+', '2/9'), AS('5/12', '+', '1/12'), AS('3/4', '+', '3/4'), AS('7/10', '+', '9/10')]
      },
      p1: {
        show: { cap: '6/8 simplifies', eq: ['5/8 + 1/8 = 6/8 = 3/4'] },
        items: [AS('1/3', '+', '1/3'), AS('2/5', '+', '1/5'), AS('3/10', '+', '5/10'), AS('5/6', '+', '5/6'), AS('7/12', '+', '11/12'), AS('4/15', '+', '8/15')]
      },
      p2: {
        items: [AS('2/9', '+', '7/9'), AS('11/20', '+', '13/20'), AS('5/16', '+', '7/16'), { eq: ['1/6 + 2/6 + 5/6 = []'], a: ['1 1/3'], simplest: true }, AS('9/14', '+', '3/14'), AS('8/25', '+', '7/25')]
      },
      p3: {
        items: [story('{a} walked 3/10 km to school and 5/10 km to the rink. How far in all, in simplest form?', 'km', '4/5', '3/10 + 5/10', { simplest: true, wide: true }),
          story('A {cont} is 5/8 full. {b} adds 7/8 of a {cont} more. How many {conts} of {many} now?', '{conts}', '1 1/2', '5/8 + 7/8', { simplest: true, wide: true }),
          { eq: ['3/7 + [] = 6/7'], a: ['3/7'] }, { eq: ['[] + 5/12 = 1'], a: ['7/12'] }]
      },
      think: {
        items: [{ q: '{b} says 1/4 + 1/4 = 2/8. What went wrong?', lines: { n: 3, key: '{b} added the bottoms. Two quarters make 2/4 = 1/2. The size of the pieces does not change.' } },
          { q: 'Draw a bar to show 3/5 + 1/5.', draw: { h: 40, key: ['fbars', { rows: [[5, 4]] }] } },
          AS('13/18', '+', '11/18'),
          { q: 'Write two fractions with bottom 10 that add to 1.', lines: { n: 1, key: 'For example 3/10 + 7/10.' } }]
      }
    },

    unlike: {
      watch: 'adding tops and bottoms: 1/2 + 1/3 is not 2/5. Rename to sixths first: 3/6 + 2/6 = 5/6.',
      goal: 'I can add fractions with different denominators.',
      learn: {
        show: { cap: 'rename to sixths', eq: ['1/2 + 1/3 = 3/6 + 2/6', '= 5/6'] },
        together: [AS2('1/4', '+', '1/2', 4), AS2('2/3', '+', '1/4', 12)],
        cue: 'Make the bottoms the same, then add the tops.',
        own: [AS2('1/5', '+', '3/10', 10), AS2('3/4', '+', '1/6', 12), AS('1/3', '+', '1/6')]
      },
      p1: {
        show: { cap: 'rename to eighths', eq: ['3/8 + 1/4 = 3/8 + 2/8', '= 5/8'] },
        items: [AS('1/2', '+', '1/4'), AS('1/3', '+', '1/9'), AS('2/5', '+', '1/10'), AS('1/2', '+', '3/8'), AS('1/6', '+', '2/3'), AS('3/4', '+', '1/8')]
      },
      p2: {
        items: [AS('2/3', '+', '1/5'), AS('3/4', '+', '2/5'), AS('5/6', '+', '3/8'), AS('1/4', '+', '5/6'), AS('4/9', '+', '1/6'), AS('7/10', '+', '1/4')]
      },
      p3: {
        items: [story('{a} ate 1/3 of a pizza and {b} ate 1/4 of it. How much did they eat?', 'of the pizza', '7/12', '1/3 + 1/4', { simplest: true, wide: true }),
          story('A recipe uses 3/4 cup of flour and 2/3 cup of oats. How many cups in all?', 'cups', '1 5/12', '3/4 + 2/3', { simplest: true, wide: true }),
          { eq: ['1/2 + 1/3 + 1/6 = []'], a: ['1'] }, AS('5/12', '+', '3/8')]
      },
      think: {
        items: [{ q: '{b} says 1/2 + 1/3 = 2/5. Show why that cannot be right.', lines: { n: 3, key: '2/5 is less than 1/2, but adding 1/3 to 1/2 must give more than 1/2. 1/2 + 1/3 = 5/6.' } },
          { q: 'Why do we need a common denominator to add?', lines: { n: 2, key: 'We can only count pieces of the same size, like adding sixths to sixths.' } },
          AS2('5/6', '+', '4/9', 18),
          { q: 'Find two fractions with different bottoms that add to 1.', lines: { n: 1, key: 'For example 1/2 + 2/4, or 1/3 + 4/6.' } }]
      }
    },

    mixed: {
      watch: 'forgetting to carry a whole: 1 3/4 + 2 1/2 = 3 5/4, which is 4 1/4.',
      goal: 'I can add mixed numbers.',
      learn: {
        show: { cap: 'wholes 1 + 2, parts 1/4 + 2/4', eq: ['1 1/4 + 2 2/4 = 3 3/4'] },
        together: [AS('2 1/5', '+', '1 2/5'), AS('1 3/4', '+', '2 1/2')],
        cue: 'Add the wholes, add the parts, then tidy up.',
        own: [AS('3 1/3', '+', '1 1/3'), AS('2 1/2', '+', '1 1/4'), AS('4 2/3', '+', '1 2/3')]
      },
      p1: {
        show: { cap: '5/4 is 1 1/4', eq: ['2 3/4 + 1 2/4 = 3 5/4 = 4 1/4'] },
        items: [AS('1 1/6', '+', '2 3/6'), AS('3 2/5', '+', '1 1/5'), AS('2 5/8', '+', '1 1/8'), AS('1 1/2', '+', '1 1/2'), AS('4 3/10', '+', '2 9/10'), AS('5 1/3', '+', '2 1/6')]
      },
      p2: {
        items: [AS('2 1/2', '+', '3 2/3'), AS('1 3/4', '+', '4 5/8'), AS('3 2/5', '+', '2 1/2'), AS('6 5/6', '+', '1 3/4'), AS('2 7/12', '+', '3 1/3'), AS('1 4/9', '+', '2 5/6')]
      },
      p3: {
        items: [story('{a} hiked 2 3/4 km before lunch and 1 2/3 km after. How far in all?', 'km', '4 5/12', '2 3/4 + 1 2/3', { simplest: true, wide: true }),
          story('A board 3 1/2 m long is joined to one 2 5/8 m long. How long is it now?', 'm', '6 1/8', '3 1/2 + 2 5/8', { simplest: true, wide: true }),
          AS('7 3/8', '+', '2 5/6'), AS('4 1/2', '+', '5/6')]
      },
      think: {
        items: [{ q: '{b} wrote 1 2/3 + 1 2/3 = 2 4/3. Is that finished? Explain.', lines: { n: 3, key: 'No. 4/3 is more than 1: 4/3 = 1 1/3, so the answer is 3 1/3.' } },
          { q: 'Show another way: change to improper fractions first.', lines: { n: 3, key: '1 2/3 = 5/3, so 5/3 + 5/3 = 10/3 = 3 1/3.' } },
          AS('3 5/6', '+', '2 3/4'),
          { q: 'Estimate 2 7/8 + 3 1/10 to the nearest whole. Explain.', lines: { n: 2, key: 'About 6: 2 7/8 is nearly 3, and 3 1/10 is just over 3.' } }]
      }
    },

    take: {
      watch: 'subtracting the bottoms too. 5/6 − 1/6 = 4/6 = 2/3: the bottom stays 6, only the tops are taken away.',
      goal: 'I can subtract fractions.',
      learn: {
        show: { cap: 'rename to twelfths', eq: ['3/4 − 1/3 = 9/12 − 4/12', '= 5/12'] },
        together: [AS('5/8', '−', '2/8'), AS2('2/3', '−', '1/6', 6)],
        cue: 'Same bottom first, then take away the tops.',
        own: [AS('7/10', '−', '3/10'), AS2('4/5', '−', '1/2', 10), AS('5/6', '−', '1/4')]
      },
      p1: {
        show: { cap: 'rename to eighths', eq: ['7/8 − 1/2 = 7/8 − 4/8', '= 3/8'] },
        items: [AS('4/5', '−', '1/5'), AS('11/12', '−', '5/12'), AS('1/2', '−', '1/4'), AS('2/3', '−', '2/9'), AS('3/4', '−', '3/8'), AS('9/10', '−', '1/2')]
      },
      p2: {
        items: [AS('3/4', '−', '2/3'), AS('5/6', '−', '3/8'), AS('4/5', '−', '1/3'), AS('7/9', '−', '1/6'), AS('11/12', '−', '3/4'), AS('1', '−', '5/12')]
      },
      p3: {
        items: [story('{a} had 3/4 of a {cont} of {many} and used 1/3 of a {cont}. How much is left?', 'of a {cont}', '5/12', '3/4 − 1/3', { simplest: true, wide: true }),
          story('A tank was 5/6 full. Now it is 1/4 full. What fraction was used?', 'of the tank', '7/12', '5/6 − 1/4', { simplest: true, wide: true }),
          AS('7/8', '−', '5/12'), { eq: ['3/5 − [] = 1/10'], a: ['1/2'] }]
      },
      think: {
        items: [{ q: '{b} says 3/4 − 1/2 = 2/2 = 1. What went wrong?', lines: { n: 3, key: '{b} subtracted tops and bottoms. 3/4 − 2/4 = 1/4.' } },
          { q: 'How can you check a subtraction answer?', lines: { n: 2, key: 'Add it back: 1/4 + 1/2 = 3/4.' } },
          AS2('5/6', '−', '4/9', 18),
          { q: 'Write a story for 1 − 3/8.', lines: { n: 2, key: 'For example: a pizza had 8 slices and 3 were eaten. 5/8 is left.' } }]
      }
    },

    borrow: {
      watch: 'subtracting the smaller part from the bigger one: in 3 1/4 − 1 3/4, trade a whole for 4/4 first.',
      goal: 'I can subtract mixed numbers, trading a whole when I need to.',
      learn: {
        show: { cap: '3 1/4 = 2 5/4', eq: ['3 1/4 − 1 3/4 = 2 5/4 − 1 3/4', '= 1 2/4 = 1 1/2'] },
        together: [{ eq: ['4 1/5 = 3 []/5'], a: [6] }, AS('4 1/5', '−', '1 3/5')],
        cue: 'Not enough parts? Trade 1 whole for more parts.',
        own: [{ eq: ['5 1/3 = 4 []/3'], a: [4] }, AS('5 1/3', '−', '2 2/3'), AS('3', '−', '1 1/4'), AS('6 3/8', '−', '2 7/8')]
      },
      p1: {
        show: { cap: '2 = 1 3/3', eq: ['2 − 2/3 = 1 3/3 − 2/3 = 1 1/3'] },
        items: [AS('3 1/6', '−', '1 5/6'), AS('2 2/5', '−', '4/5'), AS('5', '−', '2 1/2'), AS('4 3/10', '−', '1 7/10'), AS('7 1/4', '−', '3 3/4'), AS('6', '−', '5/8')]
      },
      p2: {
        items: [AS('4 1/3', '−', '1 1/2'), AS('5 1/4', '−', '2 2/3'), AS('3 1/2', '−', '1 5/6'), AS('6 3/10', '−', '2 4/5'), AS('8 1/6', '−', '3 3/4'), AS('2 1/8', '−', '1 1/3')]
      },
      p3: {
        items: [story('A ribbon is 4 1/4 m long. {a} cuts off 1 2/3 m. How much is left?', 'm', '2 7/12', '4 1/4 − 1 2/3', { simplest: true, wide: true }),
          story('{b} needs 5 cups of flour and has 2 3/8 cups. How many more cups does {b} need?', 'cups', '2 5/8', '5 − 2 3/8', { simplest: true, wide: true }),
          AS('10 1/5', '−', '4 1/2'), AS('3 1/6', '−', '2 3/4')]
      },
      think: {
        items: [{ q: '{b} says 3 1/4 − 1 3/4 = 2 2/4 because 3/4 − 1/4 = 2/4. What went wrong?', lines: { n: 3, key: '{b} took 1/4 from 3/4 instead of 3/4 from 1/4. Trade: 2 5/4 − 1 3/4 = 1 2/4 = 1 1/2.' } },
          { q: 'Show 5 1/3 − 2 2/3 with improper fractions.', lines: { n: 2, key: '16/3 − 8/3 = 8/3 = 2 2/3.' } },
          AS('9 1/12', '−', '4 3/4'),
          { q: 'Check 4 1/5 − 1 3/5 = 2 3/5 by adding.', lines: { n: 2, key: '2 3/5 + 1 3/5 = 3 6/5 = 4 1/5. It checks.' } }]
      }
    }
  } });
})();
