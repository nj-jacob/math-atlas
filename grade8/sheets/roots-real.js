/* Grade 8 Squares, Roots and Real Numbers: printable worksheets (assets/engine/sheets.js). One set per idea of the
   lessons in chapters/roots-real.lessons.js: Learn, Practise 1 to 3 and Think. Every question is written here, so a sheet
   always prints the same. Theme words: {a} {b} names.
   Ontario 2020: B2.2 square numbers and their roots; B1.3 estimating and calculating square roots; B1.2 rational and
   irrational numbers, compared and ordered. The answer checks are in tests/verify/sheets.js: every sum is worked out
   again (√ and ² included), a root lies between two whole numbers next to each other (consec), a rounded root keeps its
   decimal places (≈), and rational or irrational (real) and number sets (numset) are decided from the number itself. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var Q = S.q;
  function F(e) { return Q(e, { frac: true }); }
  /* a root between two whole numbers next to each other */
  function BT(n) { return { eq: ['[] < √' + n + ' < []'], a: [Math.floor(Math.sqrt(n)), Math.floor(Math.sqrt(n)) + 1], consec: true }; }
  function R1(n) { return Q('√' + n, { dp: 1 }); }
  function RI(x, ans) { return { q: x, pick: { opts: ['rational', 'irrational'], ans: ans, real: x } }; }
  function SET(n, is) { return { q: 'Is ' + n + ' ' + (is === 'integer' || is === 'irrational' ? 'an ' : 'a ') + (is === 'natural' || is === 'whole' ? is + ' number' : is === 'integer' ? 'integer' : is + ' number') + '?', pick: { opts: ['yes', 'no'], ans: 0, numset: { n: n, is: is } } }; }
  function SETN(n, is) { var it = SET(n, is); it.pick.ans = 1; return it; }
  function CMP(x, y) { var a = S.calc(x), b = S.calc(y); return { q: x + '  ?  ' + y, pick: { opts: ['<', '=', '>'], ans: a < b ? 0 : a > b ? 2 : 1, cmp: [x, y] } }; }
  function ORD(list) {
    var v = list.slice().sort(function (p, q) { return S.calc(p) - S.calc(q); });
    return { q: 'Order from least to greatest: ' + list.join(', '), eq: [list.map(function () { return '[]'; }).join(' < ')], a: v, set: list, wide: true };
  }
  function ST(q, calc, unit, dp) { var v = S.calc(calc); return { q: q, eq: ['[]' + (unit ? ' ' + unit : '')], a: [dp != null ? +v.toFixed(dp) : v], calc: calc, dp: dp }; }

  S.register('roots-real', { code: 'RR', ideas: {

    square: {
      watch: 'doubling instead of squaring (6² = 12). Squaring multiplies a number by itself: 6 × 6 = 36.',
      goal: 'I can square a whole number and recall the squares to 15².',
      learn: {
        show: { cap: 'a 6 by 6 square has 36 tiles', eq: ['6² = 6 × 6 = 36'] },
        together: [Q('4²'), Q('9²')],
        cue: 'Squaring means a number times itself.',
        own: [Q('7²'), Q('11²'), Q('12²'), Q('3²')]
      },
      p1: {
        show: { eq: ['8² = 8 × 8', '8² = 64'] },
        items: [Q('5²'), Q('10²'), Q('2²'), Q('13²'), Q('1²'), Q('15²'), Q('14²'), Q('20²')]
      },
      p2: {
        items: [Q('3² + 4²'), Q('6² − 5²'), Q('2 × 7²'), Q('(2 + 3)²'), Q('10² − 8²'), Q('9² + 1'), Q('25²'), Q('30²')]
      },
      p3: {
        items: [Q('12² − 11²'), Q('5² + 12²'), Q('(−4)²'), Q('−4²'), ST('A square garden is 9 m on each side. What is its area?', '9²', 'm²'),
          ST('A square tile is 15 cm on each side. What is its area?', '15²', 'cm²'), Q('40²'), Q('(10 − 7)²')]
      },
      think: {
        items: [{ q: '{a} says 7² = 14. What went wrong?', lines: { n: 2, key: '{a} doubled. 7² = 7 × 7 = 49.' } },
          { q: 'Why are 1, 4, 9, 16 called square numbers?', lines: { n: 3, key: 'That many tiles make a square: 1 by 1, 2 by 2, 3 by 3, 4 by 4.' } },
          { q: 'Is 50 a square number? How do you know?', lines: { n: 2, key: 'No. 7² = 49 and 8² = 64, so no whole number squared is 50.' } },
          { q: 'Which square number is between 150 and 180?', eq: ['[]² = []'], a: [13, 169] }]
      }
    },

    decimal: {
      watch: 'squaring only the top of a fraction ((2/3)² = 4/3). Square the top and the bottom: 4/9.',
      goal: 'I can square decimals and fractions.',
      learn: {
        show: { cap: 'square the top and the bottom', eq: ['(2/3)² = 4/9'] },
        together: [Q('0.3²'), F('(3/4)²')],
        cue: 'A decimal squared has twice as many decimal places.',
        own: [Q('1.2²'), F('(1/5)²'), Q('0.06²'), F('(5/6)²')]
      },
      p1: {
        show: { eq: ['0.4² = 0.4 × 0.4', '0.4² = 0.16'] },
        items: [Q('0.5²'), Q('0.9²'), Q('1.1²'), F('(1/2)²'), F('(2/5)²'), F('(3/7)²'), Q('0.02²'), Q('2.5²')]
      },
      p2: {
        items: [Q('1.5²'), Q('0.07²'), F('(4/9)²'), F('(7/10)²'), Q('3.2²'), F('(9/4)²'), Q('0.11²'), Q('0.8² + 0.6²')]
      },
      p3: {
        items: [Q('1.3²'), F('(11/12)²'), Q('0.15²'), Q('(−0.3)²'), ST('A square photo is 0.6 m wide. What is its area?', '0.6²', 'm²'),
          ST('A square mat is 1.4 m on each side. What is its area?', '1.4²', 'm²'), F('(2/3)² + (1/3)²'), Q('10.5²')]
      },
      think: {
        items: [{ q: '{b} says 0.3² = 0.9. What went wrong?', lines: { n: 3, key: '0.3 × 0.3 = 0.09. Two decimal places, one from each 0.3.' } },
          { q: 'Why is 0.5² smaller than 0.5?', lines: { n: 3, key: 'You take half of a half. A number between 0 and 1 gets smaller when squared.' } },
          { q: 'Circle the one bigger than 1.', pick: { opts: ['0.9²', '(3/4)²', '1.1²', '0.99²'], ans: 2, big: true }, wide: true },
          F('(5/8)²')]
      }
    },

    root: {
      watch: 'halving instead of finding the root (√36 = 18). Ask: what number times itself gives 36? 6.',
      goal: 'I can find the square root of a perfect square.',
      learn: {
        show: { cap: '7 × 7 = 49, so', eq: ['√49 = 7'] },
        together: [Q('√25'), Q('√81')],
        cue: 'Square root: what number times itself makes this?',
        own: [Q('√64'), Q('√144'), Q('√4'), Q('√121')]
      },
      p1: {
        show: { eq: ['√100: 10 × 10 = 100', '√100 = 10'] },
        items: [Q('√9'), Q('√36'), Q('√1'), Q('√169'), Q('√16'), Q('√225'), Q('√196'), Q('√400')]
      },
      p2: {
        items: [Q('√49 + √9'), Q('√100 − √64'), Q('3 × √16'), Q('√(144)'), Q('√900'), Q('√2500'), Q('√(9 + 16)'), Q('√36 × √4')]
      },
      p3: {
        items: [Q('√(36 + 64)'), Q('√10 000'), Q('√121 − √81'), Q('√(169 − 25)'),
          ST('A square room has an area of 81 m². How long is one side?', '√81', 'm'),
          ST('A square field has an area of 3600 m². How long is one side?', '√3600', 'm'),
          ST('A square poster has an area of 625 cm². What is its perimeter? It has 4 sides.', '4 × √625', 'cm'), Q('√(5² + 12²)')]
      },
      think: {
        items: [{ q: '{a} says √64 = 32. What went wrong?', lines: { n: 2, key: '{a} halved. 8 × 8 = 64, so √64 = 8.' } },
          { q: 'How are squaring and square roots related?', lines: { n: 3, key: 'They undo each other: 9² = 81 and √81 = 9.' } },
          { q: 'Why does √(9 + 16) not equal √9 + √16?', lines: { n: 3, key: '√25 = 5, but √9 + √16 = 3 + 4 = 7. Add first, then take the root.' } },
          Q('√(10² − 6²)')]
      }
    },

    rootfrac: {
      watch: 'taking the root of the top only (√(4/9) = 2/9). Take the root of the top and the bottom: 2/3.',
      goal: 'I can find square roots of decimals and fractions.',
      learn: {
        show: { cap: '√4 = 2 and √9 = 3', eq: ['√(4/9) = 2/3'] },
        together: [F('√(16/25)'), Q('√0.49')],
        cue: 'Root of the top over root of the bottom. For a decimal, think of its square.',
        own: [F('√(1/36)'), Q('√0.09'), F('√(81/100)'), Q('√1.44')]
      },
      p1: {
        show: { eq: ['0.6 × 0.6 = 0.36', '√0.36 = 0.6'] },
        items: [F('√(1/4)'), F('√(9/16)'), F('√(49/64)'), Q('√0.25'), Q('√0.64'), Q('√0.01'), F('√(25/36)'), Q('√1.21')]
      },
      p2: {
        items: [F('√(121/144)'), Q('√0.04'), Q('√2.25'), F('√(100/169)'), Q('√0.0081'), F('√(64/81)'), Q('√6.25'), Q('√0.16 + √0.09')]
      },
      p3: {
        items: [F('√(196/225)'), Q('√0.0144'), Q('√12.25'), F('√(9/400)'), ST('A square tile has an area of 0.81 m². How long is one side?', '√0.81', 'm'),
          ST('A square card has an area of 2.56 dm². How long is one side?', '√2.56', 'dm'), Q('√0.36 × 10'), F('√(1/4) + √(1/9)')]
      },
      think: {
        items: [{ q: '{b} says √0.9 = 0.3. Check it. What went wrong?', lines: { n: 3, key: '0.3² = 0.09, not 0.9. √0.09 = 0.3. √0.9 is about 0.95.' } },
          { q: 'Why is √0.25 bigger than 0.25?', lines: { n: 3, key: '√0.25 = 0.5. For numbers between 0 and 1 the root is bigger than the number.' } },
          { q: 'Circle the fraction with a whole-number-over-whole-number root.', pick: { opts: ['√(2/9)', '√(4/10)', '√(9/49)', '√(8/25)'], ans: 2, val: 3 / 7 }, wide: true },
          F('√(36/121)')]
      }
    },

    between: {
      watch: 'picking the root from the wrong squares. Find the two square numbers either side: 49 < 50 < 64, so 7 < √50 < 8.',
      goal: 'I can say which two whole numbers a square root is between.',
      learn: {
        show: { cap: '49 < 50 < 64', eq: ['7 < √50 < 8'] },
        together: [BT(20), BT(70)],
        cue: 'Find the square numbers just below and just above.',
        own: [BT(10), BT(40), BT(90), BT(130)]
      },
      p1: {
        show: { eq: ['25 < 30 < 36', '5 < √30 < 6'] },
        items: [BT(5), BT(12), BT(27), BT(55), BT(80), BT(110), BT(3), BT(150)]
      },
      p2: {
        items: [BT(200), BT(180), BT(60), BT(99), BT(2), BT(300), BT(17), BT(48)]
      },
      p3: {
        items: [BT(500), BT(1000), BT(250), BT(170), BT(350), BT(620), BT(399), BT(8)]
      },
      think: {
        items: [{ q: 'Is √50 closer to 7 or to 8? Explain.', lines: { n: 3, key: '7. 50 is 1 more than 49 but 14 less than 64.' } },
          { q: '{a} says √40 is between 20 and 21. What went wrong?', lines: { n: 3, key: '{a} halved 40. 36 < 40 < 49, so 6 < √40 < 7.' } },
          { q: 'Name a whole number whose root is between 9 and 10.', lines: { n: 1, key: 'Any number from 82 to 99, for example 90.' } },
          BT(75)]
      }
    },

    closer: {
      watch: 'stopping at the whole number. Try decimals: 7.1² = 50.41, so √50 ≈ 7.1.',
      goal: 'I can estimate a square root to one decimal place, and check by squaring.',
      learn: {
        show: { cap: '7.0² = 49, 7.1² = 50.41', eq: ['√50 ≈ 7.1'] },
        together: [R1(20), R1(10)],
        cue: 'Guess, square to check, then adjust.',
        own: [R1(30), R1(60), R1(85), R1(2)]
      },
      p1: {
        show: { eq: ['4.5² = 20.25', '√20 ≈ 4.5'] },
        items: [R1(5), R1(8), R1(15), R1(40), R1(70), R1(99), R1(3), R1(55)]
      },
      p2: {
        items: [R1(120), R1(200), R1(45), R1(75), Q('6.3²'), Q('8.9²'), R1(150), R1(18)]
      },
      p3: {
        items: [R1(300), R1(500), R1(13), R1(110), ST('A square floor has an area of 30 m². About how long is one side?', '√30', 'm', 1),
          ST('A square garden has an area of 75 m². About how long is one side?', '√75', 'm', 1), R1(1000), R1(7)]
      },
      think: {
        items: [{ q: 'Explain how to check that √30 ≈ 5.5.', lines: { n: 3, key: 'Square it: 5.5² = 30.25, very close to 30.' } },
          { q: '{b} says √60 ≈ 7.9. Is that a good estimate? Explain.', lines: { n: 3, key: 'No. 7.9² = 62.41. 7.7² = 59.29 is closer, so √60 ≈ 7.7.' } },
          { q: 'Why can\'t we write √2 exactly as a decimal?', lines: { n: 3, key: 'Its decimal never ends and never repeats. It is irrational.' } },
          R1(65)]
      }
    },

    kinds: {
      watch: 'calling every square root irrational. √49 = 7 is rational; only roots of numbers that are not perfect squares are irrational.',
      goal: 'I can tell rational numbers from irrational numbers.',
      learn: {
        show: { cap: 'rational: a fraction of integers. irrational: a decimal that never ends or repeats', eq: ['√2 = 1.414 213 56 ...'] },
        together: [RI('√16', 0), RI('√7', 1)],
        cue: 'Can it be written as a fraction of two integers? Then it is rational.',
        own: [RI('3/8', 0), RI('π', 1), RI('0.75', 0), RI('√20', 1)]
      },
      p1: {
        show: { cap: '0.333 ... repeats, so it is 1/3', eq: ['0.333 ... is rational'] },
        items: [RI('√25', 0), RI('√3', 1), RI('−5', 0), RI('2.5', 0), RI('√50', 1), RI('7/9', 0), RI('√100', 0), RI('√11', 1)]
      },
      p2: {
        items: [RI('√(4/9)', 0), RI('√0.36', 0), RI('√8', 1), RI('−√36', 0), RI('2π', 1), RI('0.121212 ...', 0), RI('√144', 0), RI('√15', 1)]
      },
      p3: {
        items: [RI('√(1/2)', 1), RI('√1.21', 0), RI('√0.5', 1), RI('22/7', 0), RI('√200', 1), RI('−0.6', 0), RI('√225', 0), RI('π/2', 1)]
      },
      think: {
        items: [{ q: '{a} says √49 is irrational because it has a root sign. Explain.', lines: { n: 3, key: '√49 = 7, a whole number. It can be written as 7/1, so it is rational.' } },
          { q: 'Is 22/7 the same as π? Explain.', lines: { n: 3, key: 'No. 22/7 = 3.142 857 ... repeats, so it is rational. π never repeats.' } },
          { q: 'Write two irrational numbers between 3 and 4.', lines: { n: 1, key: 'For example √10 and π.' } },
          RI('√64', 0)]
      }
    },

    family: {
      watch: 'thinking a number belongs to one set only. 5 is natural, whole, an integer and rational all at once.',
      goal: 'I can place a number in the sets of the real numbers.',
      learn: {
        show: { cap: 'natural ⊂ whole ⊂ integers ⊂ rational. Irrational is separate.', eq: ['−3 is an integer and rational'] },
        together: [SET('7', 'natural'), SETN('−2', 'whole')],
        cue: 'Natural 1, 2, 3 ... Whole adds 0. Integers add the negatives. Rational adds fractions.',
        own: [SET('0', 'whole'), SETN('0', 'natural'), SET('−8', 'integer'), SETN('1/2', 'integer')]
      },
      p1: {
        show: { eq: ['0.5 = 1/2 is rational', 'but not an integer'] },
        items: [SET('12', 'integer'), SET('3/4', 'rational'), SETN('√5', 'rational'), SET('√5', 'irrational'), SETN('−1', 'natural'), SET('−1', 'integer'), SET('√9', 'natural'), SETN('π', 'rational')]
      },
      p2: {
        items: [SET('−4.5', 'rational'), SETN('−4.5', 'integer'), SET('√36', 'whole'), SETN('√2', 'integer'), SET('0', 'integer'), SET('−√4', 'integer'), SETN('2.25', 'whole'), SET('100', 'natural')]
      },
      p3: {
        items: [SET('√(9/4)', 'rational'), SETN('√(9/4)', 'integer'), SETN('−√10', 'rational'), SET('−√10', 'irrational'), SET('−16/4', 'integer'), SETN('π/2', 'rational'), SET('√0.81', 'rational'), SETN('0.1', 'whole')]
      },
      think: {
        items: [{ q: 'Name all the sets that −6 belongs to.', lines: { n: 2, key: 'Integers, rational numbers, real numbers.' } },
          { q: 'Is every integer rational? Explain.', lines: { n: 3, key: 'Yes. Any integer n can be written as n/1.' } },
          { q: 'Give a number that is rational but not an integer.', lines: { n: 1, key: 'For example 2/3 or −0.5.' } },
          SETN('√7', 'rational')]
      }
    },

    line: {
      watch: 'ordering by the digits you see. Change each number to a decimal first: √10 ≈ 3.16 is more than π ≈ 3.14.',
      goal: 'I can order rational and irrational numbers by changing them to decimals.',
      learn: {
        show: { cap: '√10 ≈ 3.16, π ≈ 3.14, 3.2', eq: ['π < √10 < 3.2'] },
        together: [Q('3/8', { dp: 3 }), ORD(['√5', '2.1', '9/4'])],
        cue: 'Change each to a decimal, then order.',
        own: [Q('√3', { dp: 2 }), ORD(['π', '3.1', '√11'])]
      },
      p1: {
        show: { eq: ['√2 ≈ 1.41, 7/5 = 1.4', '7/5 < √2'] },
        items: [Q('5/8', { dp: 3 }), Q('√7', { dp: 2 }), Q('2/3', { dp: 3 }), Q('√20', { dp: 2 }), CMP('√2', '1.5'), CMP('π', '√9')]
      },
      p2: {
        items: [ORD(['√15', '3.9', '15/4']), ORD(['−√2', '−1.5', '−4/3']), CMP('√30', '5.5'), CMP('22/7', 'π'), CMP('−√5', '−2.2'), Q('11/6', { dp: 3 })]
      },
      p3: {
        items: [ORD(['√50', '7.05', '50/7', '2π']), ORD(['−π', '−√8', '−3.2', '−10/3']), CMP('√0.5', '0.7'), CMP('√(1/2)', '2/3'), Q('√45', { dp: 2 }), Q('5/7', { dp: 3 })]
      },
      think: {
        items: [{ q: '{b} says √8 > 3 because 8 > 3. Explain the mistake.', lines: { n: 3, key: '√8 is about 2.83, which is less than 3. Compare the values, not the numbers under the root.' } },
          { q: 'Name a number between √3 and √4.', lines: { n: 1, key: 'For example 1.8 (√3 ≈ 1.73 and √4 = 2).' } },
          { q: 'Where is √2 on a number line? Explain.', lines: { n: 3, key: 'Between 1 and 2, closer to 1: about 1.41.' } },
          ORD(['1.7', '√3', '7/4'])]
      }
    },

    squareit: {
      watch: 'comparing a root with a number without squaring both. Square each side: 7² = 49 < 50, so 7 < √50.',
      goal: 'I can compare a root with a number by squaring both.',
      learn: {
        show: { cap: 'square both: 50 and 49', eq: ['√50 > 7'] },
        together: [CMP('√30', '5'), CMP('6', '√40')],
        cue: 'Square both numbers. The bigger square has the bigger number.',
        own: [CMP('√80', '9'), CMP('4', '√16'), CMP('√12', '3.5'), CMP('8', '√65')]
      },
      p1: {
        show: { eq: ['√90 ? 9.5: 90 and 90.25', '√90 < 9.5'] },
        items: [CMP('√10', '3'), CMP('√24', '5'), CMP('7', '√48'), CMP('√121', '11'), CMP('√35', '6'), CMP('10', '√99'), CMP('√2', '1.4'), CMP('√6', '2.5')]
      },
      p2: {
        items: [CMP('√26', '5.1'), CMP('2√5', '√18'), CMP('3√2', '4'), CMP('√50', '5√2'), CMP('√0.3', '0.5'), CMP('√8', '2.8'), CMP('12', '√145'), CMP('√13', '3.6')]
      },
      p3: {
        items: [CMP('√200', '14.1'), CMP('2√3', '3√2'), CMP('√(3/4)', '0.9'), CMP('√1000', '31.6'),
          ST('A square has an area of 60 cm². Is its side more than 7.7 cm? Write its side to 1 decimal place.', '√60', 'cm', 1), CMP('5√3', '9'), CMP('4√5', '9'), CMP('√0.8', '0.9')]
      },
      think: {
        items: [{ q: 'Explain why squaring both sides keeps the order (for numbers above 0).', lines: { n: 3, key: 'A bigger positive number times itself is always bigger, so the order stays the same.' } },
          { q: '{a} says 2√5 = √10. Check it by squaring.', lines: { n: 3, key: '(2√5)² = 4 × 5 = 20, but (√10)² = 10. So 2√5 = √20, not √10.' } },
          { q: 'Circle the greatest.', pick: { opts: ['√80', '9', '2√20', '8.9'], ans: 1, big: true }, wide: true },
          CMP('3√3', '5.2')]
      }
    }
  } });
})();
