/* Grade 7 Integers: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/integers.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.3 read, represent, compare and order rational numbers, including negative fractions and decimals;
   B2.4 add and subtract integers with objects, diagrams and equations; C1.4 patterns that show relationships among
   integers. Negative numbers take a true minus sign (−3). The answer checks are in tests/verify/sheets.js: sums are worked
   out again, a thermometer, number line or set of chips shows its own number, and a pattern keeps its step. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* −3 with a true minus sign, and (−3) in brackets after an operation */
  function sg(n) { return n < 0 ? '−' + -n : String(n); }
  function br(n) { return n < 0 ? '(' + sg(n) + ')' : String(n); }
  function v(s) { var t = String(s).replace('−', '-'), m = t.match(/^(-?)(\d+)\/(\d+)$/); return m ? (m[1] ? -1 : 1) * m[2] / m[3] : +t; }
  /* a thermometer reading */
  function TH(t, lo, hi) { return { pic: ['therm', { t: t, min: lo, max: hi, step: 2, lab: 10 }], eq: ['[] °C'], a: [t] }; }
  /* a point on a number line from lo to hi */
  function PT(p, lo, hi) { return { pic: ['nl', { min: lo, max: hi, tick: 1, lab: 5, ask: [p] }], a: [p] }; }
  /* opposites add to zero */
  function OPP(n) { return { eq: [br(n) + ' + [] = 0'], a: [-n] }; }
  /* compare two numbers: circle the sign */
  function CMP(x, y) { var a = v(x), b = v(y); return { eq: [sg(x).replace('-', '−') + ' ? ' + sg(y).replace('-', '−')], pick: { opts: ['<', '>', '='], ans: a < b ? 0 : a > b ? 1 : 2, cmp: [String(x).replace('-', '−'), String(y).replace('-', '−')] }, pickLast: true }; }
  /* least to greatest */
  function ORD(list) {
    var l = list.map(function (x) { return String(x).replace('-', '−'); });
    var a = list.slice().sort(function (x, y) { return v(x) - v(y); }).map(function (x) { return typeof x === 'number' ? x : x.replace('-', '−'); });
    return { q: 'Least to greatest: ' + l.join(', '), eq: [l.map(function () { return '[]'; }).join(' < ')], a: a, set: l, wide: list.length > 3 };
  }
  /* add or subtract integers, with chips (pos, neg) or a number line jump, or as a bare sum */
  function AD(x, y) { return { eq: [br(x) + ' + ' + br(y) + ' = []'], a: [x + y] }; }
  function SB(x, y) { return { eq: [br(x) + ' − ' + br(y) + ' = []'], a: [x - y] }; }
  function SBO(x, y) { return { eq: [br(x) + ' − ' + br(y) + ' = ' + br(x) + ' + [] = []'], a: [-y, x - y], wide: true }; }
  function CH(pos, neg) { return { pic: ['chips', { pos: pos, neg: neg, pairs: Math.min(pos, neg) }], eq: [pos + ' + ' + br(-neg) + ' = []'], a: [pos - neg] }; }
  function JMP(x, y, lo, hi) { return { pic: ['nl', { min: lo, max: hi, tick: 1, lab: 5, jumps: [[x, x + y, (y > 0 ? '+' : '') + sg(y)]] }], eq: [br(x) + ' + ' + br(y) + ' = []'], a: [x + y] }; }
  /* a pattern: the next terms keep the step */
  function NX(seq, k) {
    var st = seq[1] - seq[0], next = [];
    for (var i = 1; i <= k; i++) next.push(seq[seq.length - 1] + i * st);
    return { eq: [seq.map(sg).join(', ') + ', ' + next.map(function () { return '[]'; }).join(', ')], a: next, wide: seq.length + k > 5 };
  }
  /* term n of a pattern (from its first terms) */
  function TERM(seq, n) { return { q: 'Pattern: ' + seq.map(sg).join(', ') + ', ... What is term ' + n + '?', eq: ['[]'], a: [seq[0] + (n - 1) * (seq[1] - seq[0])], seq: seq, fig: n }; }
  function story(q, unit, ans, calc, more) { var it = { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; return more ? Object.assign(it, more) : it; }

  S.register('integers', { code: 'IN', ideas: {

    zero: {
      watch: 'reading a negative as positive. Below zero counts down from 0: −8 °C is 8 degrees colder than 0 °C.',
      goal: 'I can read and use numbers below zero.',
      learn: {
        show: { pic: ['therm', { t: -6, min: -20, max: 20, step: 2, lab: 10 }], cap: '6 degrees below zero', eq: ['−6 °C'] },
        together: [PT(-4, -10, 10), PT(-6, -10, 10)],
        cue: 'Below zero gets a minus sign.',
        own: [PT(-8, -10, 10), PT(-2, -10, 10), PT(7, -10, 10), PT(-9, -10, 10)]
      },
      p1: {
        show: { pic: ['nl', { min: -10, max: 10, tick: 1, lab: 5, pt: -7 }], eq: ['−7 is 7 to the left of 0'] },
        items: [PT(-3, -10, 10), PT(4, -10, 10), PT(-8, -10, 10), PT(-1, -5, 5), PT(-4, -5, 5), PT(2, -5, 5)]
      },
      p2: {
        items: [{ q: 'A diver is 15 m below the surface. Write it as an integer.', eq: ['[] m'], a: [-15], int: { size: 15, neg: true } },
          { q: '{a} has a debt of $20. Write it as an integer.', eq: ['$ []'], a: [-20], int: { size: 20, neg: true } },
          { q: 'A plane is 900 m above sea level. Write it as an integer.', eq: ['[] m'], a: [900], int: { size: 900 } },
          { q: 'The temperature is 12 degrees below zero.', eq: ['[] °C'], a: [-12], int: { size: 12, neg: true } },
          TH(-18, -20, 20), TH(-6, -10, 10)]
      },
      p3: {
        items: [story('At 6 a.m. it was −9 °C. By noon it was 4 degrees warmer. What was the temperature at noon?', '°C', -5, '−9 + 4', { wide: true }),
          story('A {cont} of {many} is stored at −18 °C. The fridge is at 4 °C. How many degrees warmer is the fridge?', 'degrees', 22, '4 − (−18)', { wide: true }),
          { q: 'Which is colder?', pick: { opts: ['−3 °C', '−11 °C'], ans: 1, small: true } },
          { q: 'Which is warmer?', pick: { opts: ['−15 °C', '−5 °C'], ans: 1, big: true } }]
      },
      think: {
        items: [{ q: '{b} says −10 °C is warmer than −2 °C because 10 is bigger. What went wrong?', lines: { n: 3, key: '−10 is further below zero, so it is colder. −2 °C is warmer.' } },
          { q: 'Give two real places where you see negative numbers.', lines: { n: 2, key: 'For example winter temperatures, depths below sea level, or money owed.' } },
          TH(-16, -20, 20),
          { q: 'Mark −5 and 5 on a line from −10 to 10. What do you notice?', draw: { h: 40, key: 'They are the same distance from 0, on opposite sides.' } }]
      }
    },

    opposite: {
      watch: 'thinking the opposite of a negative is also negative. The opposite of −7 is 7: the same distance from 0.',
      goal: 'I can find the opposite of an integer.',
      learn: {
        show: { pic: ['nl', { min: -6, max: 6, tick: 1, lab: 2, jumps: [[0, -4, '4'], [0, 4, '4']] }], cap: '−4 and 4 are both 4 from 0', eq: ['−4 + 4 = 0'] },
        together: [OPP(-9), OPP(5)],
        cue: 'Opposites are the same distance from 0 and add to 0.',
        own: [OPP(-12), OPP(3), OPP(-1), OPP(25)]
      },
      p1: {
        show: { eq: ['the opposite of −6 is 6', '−6 + 6 = 0'] },
        items: [OPP(-2), OPP(8), OPP(-15), OPP(-30), OPP(1), OPP(-100)]
      },
      p2: {
        items: [{ eq: ['−(−8) = []'], a: [8] }, { eq: ['−(5) = []'], a: [-5] }, { eq: ['−(−(−3)) = []'], a: [-3] }, OPP(-47),
          OPP(-64)]
      },
      p3: {
        items: [story('{a} deposits $35, then takes out the opposite amount. What is the change in the account?', 'dollars', 0, '35 − 35', { wide: true }),
          story('An elevator goes up 7 floors, then down 7 floors. What is the total change?', 'floors', 0, '7 − 7', { wide: true }),
          OPP(-250), { eq: ['[] + 18 = 0'], a: [-18] }]
      },
      think: {
        items: [{ q: '{b} says the opposite of −9 is −9. What went wrong?', lines: { n: 3, key: 'The opposite is on the other side of 0: 9. −9 + 9 = 0.' } },
          { q: 'Is 0 its own opposite? Explain.', lines: { n: 2, key: 'Yes. 0 is 0 away from 0, and 0 + 0 = 0.' } },
          OPP(-73),
          { q: 'Why do a number and its opposite add to 0?', lines: { n: 2, key: 'Moving the same distance one way and then back lands on 0.' } }]
      }
    },

    right: {
      watch: 'comparing the digits only. On a number line, further right is greater: −2 > −9.',
      goal: 'I can compare and order integers.',
      learn: {
        show: { pic: ['nl', { min: -10, max: 2, tick: 1, lab: 2, pt: -2, ptl: '−2' }], cap: '−2 is to the right of −9', eq: ['−2 > −9'] },
        together: [CMP(-5, -3), CMP(-1, -6)],
        cue: 'Further right is greater.',
        own: [CMP(-8, 2), CMP(0, -4), CMP(-12, -21), ORD([-3, 5, -7])]
      },
      p1: {
        show: { eq: ['−6 < −1 < 0 < 4'] },
        items: [CMP(-7, -4), CMP(3, -3), CMP(-10, -11), CMP(-2, 0), ORD([4, -4, 0]), ORD([-1, -9, -5])]
      },
      p2: {
        items: [ORD([-12, 8, -3, 0]), ORD([-20, -2, -15, 7]), CMP(-99, -100), CMP(-45, -54),
          { q: 'Which is greatest?', pick: { opts: ['−8', '−3', '−15'], ans: 1, big: true } }, { q: 'Which is least?', pick: { opts: ['−1', '−19', '−10'], ans: 1, small: true } }]
      },
      p3: {
        items: [{ q: 'Lowest temperatures this week (°C): −4, −11, 2, −7, −1. Order them, least to greatest.', eq: ['[] < [] < [] < [] < []'], a: [-11, -7, -4, -1, 2], set: ['−4', '−11', '2', '−7', '−1'], wide: true },
          { q: 'Golf scores: Ava −3, Ben 1, Cy −5. The lowest score wins. Who wins?', pick: { opts: ['Ava', 'Ben', 'Cy'], ans: 2, less: ['−3', '1', '−5'] }, wide: true },
          CMP(-250, -205), CMP(-1000, 1)]
      },
      think: {
        items: [{ q: '{b} says −9 > −2 because 9 > 2. What went wrong?', lines: { n: 3, key: '−9 is further left (further below 0), so −9 < −2.' } },
          { q: 'Name an integer between −5 and −2.', lines: { n: 1, key: '−4 or −3.' } },
          ORD([-6, 6, -16, 0]),
          { q: 'Is a negative number always less than a positive one? Explain.', lines: { n: 2, key: 'Yes. Negatives are left of 0 and positives are right of 0.' } }]
      }
    },

    rational: {
      watch: 'treating −1/2 as bigger than −1/4 because 1/2 > 1/4. Below zero, a bigger part is further left: −1/2 < −1/4.',
      goal: 'I can compare and order negative fractions and decimals.',
      learn: {
        show: { pic: ['dline', { min: -1, max: 1, d: 4, show: 'frac', pt: -0.75 }], cap: '−3/4 is left of −1/4', eq: ['−3/4 < −1/4'] },
        together: [CMP('-1/2', '-1/4'), CMP(-0.3, -0.25)],
        cue: 'Below zero, the bigger part is further left.',
        own: [CMP('-2/3', '1/3'), CMP(-1.5, -1.05), CMP('-3/5', -0.6), ORD([-0.5, '-3/4', 0.25])]
      },
      p1: {
        show: { pic: ['dline', { min: -1, max: 0, d: 10, show: 'dec', pt: -0.7 }], eq: ['−0.7 < −0.4'] },
        items: [CMP(-0.8, -0.2), CMP('-1/3', '-1/6'), CMP(-2.5, 1.5), CMP('-7/8', '-5/8'), CMP(-0.125, -0.15), CMP('-1/2', -0.5)]
      },
      p2: {
        items: [ORD([-1.2, -0.8, -1.25]), ORD(['-1/2', '-1/3', '-3/4']), CMP(-3.042, -3.024), CMP('-2/5', -0.45),
          { pic: ['dline', { min: -2, max: 0, d: 4, show: 'ends', ask: [-1.5, -0.25] }], a: [-1.5, -0.25] }, { q: 'Which is between −1 and −1/2?', pick: { opts: ['−0.25', '−3/4', '−1.5'], ans: 1, between: [-1, -0.5] } }]
      },
      p3: {
        items: [ORD([-0.6, '-2/3', -0.65, '-5/8']), { q: 'Changes in a stock price ($): −0.35, 0.2, −0.53, −0.05. Which fell most?', pick: { opts: ['−0.35', '−0.53', '−0.05'], ans: 1, small: true }, wide: true },
          CMP('-5/4', -1.3), { eq: ['−1/2 < [] < −1/4'], a: [-0.3] }]
      },
      think: {
        items: [{ q: '{b} says −0.5 < −0.45 is false because 45 > 5. What went wrong?', lines: { n: 3, key: '−0.5 = −0.50, which is further below 0 than −0.45. So −0.5 < −0.45 is true.' } },
          { q: 'Mark −1 1/2, −3/4 and 1/4 on a number line from −2 to 1.', draw: { h: 40, key: 'From left: −1 1/2, then −3/4, then 1/4.' } },
          ORD(['-1/8', -0.2, '-1/4', 0]),
          { q: 'Find a negative decimal between −0.1 and 0.', lines: { n: 1, key: 'For example −0.05.' } }]
      }
    },

    pairs: {
      watch: 'adding the chips as if all were positive. Each + and − pair makes 0; count what is left.',
      goal: 'I can add integers with zero pairs.',
      learn: {
        show: { pic: ['chips', { pos: 3, neg: 5, pairs: 3 }], cap: '3 zero pairs, 2 negatives left', eq: ['3 + (−5) = −2'] },
        together: [CH(4, 6), CH(5, 2)],
        cue: 'A + chip and a − chip make a zero pair.',
        own: [CH(2, 7), CH(6, 3), CH(4, 4), CH(1, 5)]
      },
      p1: {
        show: { pic: ['chips', { pos: 6, neg: 2, pairs: 2 }], eq: ['6 + (−2) = 4'] },
        items: [CH(3, 4), CH(7, 2), CH(5, 8), CH(2, 2), CH(8, 3), CH(1, 6)]
      },
      p2: {
        items: [{ q: 'Draw chips for −3 + (−4).', draw: { h: 40, key: ['chips', { pos: 0, neg: 7 }] }, eq: ['−3 + (−4) = []'], a: [-7] },
          { q: 'Draw chips for 5 + (−9).', draw: { h: 40, key: ['chips', { pos: 5, neg: 9, pairs: 5 }] }, eq: ['5 + (−9) = []'], a: [-4] },
          AD(-6, 9), AD(-8, 3), AD(7, -7), AD(-2, -5)]
      },
      p3: {
        items: [story('{a} has 8 points and loses 11. What is the score now?', 'points', -3, '8 − 11'),
          story('A team gains 6 m on one play, then loses 9 m. What is the total change?', 'm', -3, '6 − 9'),
          AD(-15, 9), AD(12, -20), AD(-7, -13)]
      },
      think: {
        items: [{ q: '{b} says 4 + (−6) = 10. Use chips to show what went wrong.', lines: { n: 3, key: '{b} added 4 and 6. Make 4 zero pairs: 2 − chips are left, so the answer is −2.' } },
          { q: 'Show three ways to make −3 with + and − chips.', lines: { n: 2, key: 'For example 3 −; 1 + and 4 −; 2 + and 5 −.' } },
          CH(9, 4),
          { q: 'Why can you add a zero pair without changing the value?', lines: { n: 2, key: 'A zero pair is worth 0, and adding 0 changes nothing.' } }]
      }
    },

    rule: {
      watch: 'adding the digits when the signs differ. Different signs: take the smaller size from the bigger and keep the bigger one\'s sign.',
      goal: 'I can add integers with the same or different signs.',
      learn: {
        show: { cap: 'same signs add; different signs subtract', eq: ['−5 + (−3) = −8', '−5 + 3 = −2'] },
        together: [AD(-7, -2), AD(-7, 2)],
        cue: 'Same signs: add, keep the sign. Different signs: subtract, keep the bigger one\'s sign.',
        own: [AD(-4, -9), AD(10, -4), AD(-12, 5), AD(6, 8)]
      },
      p1: {
        show: { pic: ['nl', { min: -8, max: 4, tick: 1, lab: 2, jumps: [[-6, 2, '+8']] }], eq: ['−6 + 8 = 2'] },
        items: [JMP(-3, 5, -5, 5), JMP(2, -6, -5, 5), AD(-1, -8), AD(9, -3), AD(-11, 4), AD(-6, -6)]
      },
      p2: {
        items: [AD(-25, 10), AD(-14, -16), AD(30, -45), AD(-50, 50), AD(-19, 27), AD(33, -8), AD(-41, -9), AD(18, -60)]
      },
      p3: {
        items: [{ eq: ['−4 + 7 + (−9) = []'], a: [-6] }, { eq: ['−3 + (−5) + 10 = []'], a: [2] }, { eq: ['[] + (−6) = −10'], a: [-4] },
          story('At midnight it was −12 °C. It rose 7 degrees, then fell 3. What is the temperature?', '°C', -8, '−12 + 7 − 3', { wide: true }),
          story('{b}\'s bank balance is −15 dollars. {b} deposits 40 dollars. What is the new balance?', 'dollars', 25, '−15 + 40', { wide: true })]
      },
      think: {
        items: [{ q: '{b} says −8 + 3 = −11. What went wrong?', lines: { n: 3, key: 'The signs differ, so subtract: 8 − 3 = 5, and keep the − of the bigger: −5.' } },
          { q: 'When is the sum of two integers negative? Give two cases.', lines: { n: 3, key: 'Both negative (−2 + −3), or one negative with the bigger size (−7 + 4).' } },
          AD(-128, 75),
          { q: 'Write two integers with different signs that add to −4.', lines: { n: 1, key: 'For example −10 + 6.' } }]
      }
    },

    addopp: {
      watch: 'changing only one sign. Keep the first, change − to +, change the sign of the second: 3 − (−5) = 3 + 5.',
      goal: 'I can subtract an integer by adding its opposite.',
      learn: {
        show: { cap: 'take away −5 = add 5', eq: ['3 − (−5) = 3 + 5', '= 8'] },
        together: [SBO(4, -2), SBO(-6, 3)],
        cue: 'Subtracting is adding the opposite.',
        own: [SBO(-1, -7), SBO(5, 9), SBO(-8, -3)]
      },
      p1: {
        show: { cap: 'take away 6 = add −6', eq: ['2 − 6 = 2 + (−6) = −4'] },
        items: [SB(7, -3), SB(-2, 4), SB(-5, -5), SB(0, -9), SB(3, 10), SB(-4, -10), SB(-6, 2), SB(8, -8)]
      },
      p2: {
        items: [SB(-12, 8), SB(15, -6), SB(-20, -35), SB(9, 14), SB(-7, -2), SB(-30, 12), SB(-18, -40), SB(25, -17)]
      },
      p3: {
        items: [{ eq: ['−3 − (−4) − 6 = []'], a: [-5] }, { eq: ['8 − (−2) + (−11) = []'], a: [-1] }, { eq: ['[] − 5 = −12'], a: [-7] }, { eq: ['4 − [] = 10'], a: [-6] },
          story('A submarine at −120 m rises to −45 m. How many metres did it rise?', 'm', 75, '−45 − (−120)', { wide: true })]
      },
      think: {
        items: [{ q: '{b} says 6 − (−2) = 4. What went wrong?', lines: { n: 3, key: 'Taking away −2 is the same as adding 2: 6 + 2 = 8.' } },
          { q: 'Use chips to show why 2 − (−3) = 5.', lines: { n: 3, key: 'Start with 2 +. Add 3 zero pairs, then take away the 3 − chips: 5 + are left.' } },
          SBO(-15, -40),
          { q: 'Write a subtraction of integers with an answer of −6.', lines: { n: 1, key: 'For example −2 − 4 or 3 − 9.' } }]
      }
    },

    diff: {
      watch: 'subtracting in the wrong order or ignoring the sign. Distance from −8 to 5 is 5 − (−8) = 13 steps.',
      goal: 'I can find how far apart two integers are.',
      learn: {
        show: { pic: ['nl', { min: -10, max: 6, tick: 1, lab: 2, jumps: [[-8, 0, '8'], [0, 5, '5']] }], cap: '8 up to 0, then 5 more', eq: ['5 − (−8) = 13'] },
        together: [{ pic: ['nl', { min: -6, max: 6, tick: 1, lab: 2, jumps: [[-4, 3, '']] }], eq: ['3 − (−4) = []'], a: [7] }, SB(-2, -9)],
        cue: 'Higher number minus lower number.',
        own: [SB(6, -3), SB(-1, -10), SB(12, -12), SB(0, -15)]
      },
      p1: {
        show: { eq: ['from −7 °C to 2 °C', '2 − (−7) = 9 degrees'] },
        items: [SB(4, -4), SB(-3, -8), SB(10, -5), SB(-6, -20), SB(1, -1), SB(15, -25), SB(-9, 7), SB(-14, -14)]
      },
      p2: {
        items: [story('The low was −9 °C and the high was 4 °C. What is the difference?', 'degrees', 13, '4 − (−9)'),
          story('A bird is at 12 m. A fish is at −5 m. How far apart are they?', 'm', 17, '12 − (−5)'),
          story('Yellowknife was −27 °C and Toronto was −4 °C. How much colder was Yellowknife?', 'degrees', 23, '−4 − (−27)'),
          story('A cave is at −35 m and a cliff top at 60 m. How far apart?', 'm', 95, '60 − (−35)')]
      },
      p3: {
        items: [story('{a} has −18 dollars (owes money) and {b} has 27 dollars. How much more does {b} have?', 'dollars', 45, '27 − (−18)', { wide: true }),
          story('In Iqaluit it was −31 °C at night and −12 °C at noon. How many degrees did it warm up?', 'degrees', 19, '−12 − (−31)', { wide: true }),
          story('The bottom of a mine is at −86 m and a hill nearby is 1 200 m high. How far apart?', 'm', 1286, '1200 − (−86)', { wide: true })]
      },
      think: {
        items: [{ q: '{b} says −3 and 5 are 2 apart. What went wrong?', lines: { n: 3, key: '{b} did 5 − 3. The distance is 3 steps to 0 and 5 more: 5 − (−3) = 8.' } },
          { q: 'Is the distance between two integers ever negative? Explain.', lines: { n: 2, key: 'No. A distance counts steps, so it is always 0 or more.' } },
          SB(-14, -41),
          { q: 'Name two integers that are 10 apart, one negative and one positive.', lines: { n: 1, key: 'For example −4 and 6.' } }]
      }
    },

    grow: {
      watch: 'losing the sign when the pattern crosses 0. Keep adding the same step: 6, 3, 0, −3, −6.',
      goal: 'I can extend patterns that go below zero.',
      learn: {
        show: { cap: 'take away 3 each time', eq: ['6, 3, 0, −3, −6'] },
        together: [NX([8, 5, 2], 2), NX([-10, -7, -4], 2)],
        cue: 'Find the step, then keep using it past 0.',
        own: [NX([4, 2, 0], 2), NX([-9, -5, -1], 2), NX([15, 10, 5], 3)]
      },
      p1: {
        show: { cap: 'add 4 each time', eq: ['−12, −8, −4, 0, 4'] },
        items: [NX([3, 1, -1], 2), NX([-6, -4, -2], 2), NX([20, 14, 8], 2), NX([-1, -3, -5], 2)]
      },
      p2: {
        items: [NX([7, 2, -3], 3), NX([-25, -18, -11], 3), NX([1, -5, -11], 2), NX([-40, -30, -20], 3)]
      },
      p3: {
        items: [{ q: 'A temperature drops 3 degrees each hour from 5 °C. Fill the table.', pic: ['table', { head: ['hour', '°C'], rows: [[0, 5], [1, 2], [2, '[]'], [3, '[]'], [4, '[]']], diff: true }], a: [-1, -4, -7] },
          { q: '{a} starts at −20 and adds 6 each round.', eq: ['−20, −14, [], [], []'], a: [-8, -2, 4], wide: true },
          { q: 'Which number is in the pattern 9, 5, 1, ...?', pick: { opts: ['−2', '−3', '−4'], ans: 1, seq: { from: -3, by: 4 } } }]
      },
      think: {
        items: [{ q: '{b} wrote 6, 3, 0, 3, 6 for "take away 3". What went wrong?', lines: { n: 3, key: 'After 0, taking away 3 gives −3, then −6. The pattern keeps going down.' } },
          { q: 'Make a pattern with step −5 that starts at 12. Write 5 terms.', lines: { n: 1, key: '12, 7, 2, −3, −8' } },
          NX([-2, -7, -12], 3),
          { q: 'Where might you see a pattern that goes below zero?', lines: { n: 2, key: 'For example a temperature falling each hour, or a diver going down each minute.' } }]
      }
    },

    term: {
      watch: 'counting the start as one step. Term n is the first term plus (n − 1) steps.',
      goal: 'I can find any term of an integer pattern.',
      learn: {
        show: { cap: 'start 5, step −3: term 10 = 5 + 9 × (−3)', eq: ['term 10 = −22'] },
        together: [TERM([5, 2, -1], 6), TERM([-8, -6, -4], 10)],
        cue: 'First term + (n − 1) × step.',
        own: [TERM([10, 7, 4], 8), TERM([-3, 1, 5], 7), TERM([0, -4, -8], 12)]
      },
      p1: {
        show: { cap: 'start −2, step −5: term 5 = −2 + 4 × (−5)', eq: ['term 5 = −22'] },
        items: [TERM([4, 1, -2], 5), TERM([-10, -8, -6], 9), TERM([-1, -2, -3], 20), TERM([6, 4, 2], 11)]
      },
      p2: {
        items: [TERM([12, 9, 6], 15), TERM([-30, -25, -20], 13), TERM([2, -3, -8], 10), TERM([-7, -5, -3], 25)]
      },
      p3: {
        items: [TERM([100, 93, 86], 20), TERM([-50, -46, -42], 30),
          { q: 'A diver starts at −2 m and goes down 3 m each minute. Where is the diver after 10 minutes?', eq: ['[] m'], a: [-32], calc: '−2 − 10 × 3', wide: true }]
      },
      think: {
        items: [{ q: '{b} says term 10 of 5, 2, −1, ... is 5 + 10 × (−3) = −25. What went wrong?', lines: { n: 3, key: 'There are only 9 steps from term 1 to term 10: 5 + 9 × (−3) = −22.' } },
          { q: 'Which term of 8, 5, 2, ... is −13? Explain.', lines: { n: 3, key: 'From 8 to −13 is −21, which is 7 steps of −3. So it is term 8.' } },
          TERM([-4, -1, 2], 50),
          { q: 'Write a rule for the pattern 9, 6, 3, 0, ...', lines: { n: 2, key: 'Start at 9 and take away 3 each time. Term n = 12 − 3n.' } }]
      }
    }
  } });
})();
