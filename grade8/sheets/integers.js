/* Grade 8 Integers: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/integers.lessons.js: Learn, Practise 1 to 3 and Think. Every question is written here, so a sheet always
   prints the same. Theme words: {a} {b} names.
   Ontario 2020: B1.1 (integers in everyday life); B2.4 adding and subtracting integers; B2.7 multiplying and dividing
   integers; B2.1 several steps in the right order. The answer checks are in tests/verify/sheets.js: every sum is worked
   out again, counters show + counters take away − counters (chips), and a number line's jumps end at the answer (iline). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var Q = S.q;
  function CH(pos, neg, e) { var it = Q(e); it.pic = ['chips', { pos: pos, neg: neg, pairs: true }]; return it; }
  function NL(from, by, e) { var lo = Math.min(0, from, from + by) - 1, hi = Math.max(0, from, from + by) + 1; var it = Q(e); it.pic = ['iline', { min: lo, max: hi, lab: hi - lo > 12 ? 2 : 1, jumps: [[from, by]] }]; return it; }
  function CMP(x, y) { var a = S.calc(x), b = S.calc(y); return { q: x + '  ?  ' + y, pick: { opts: ['<', '=', '>'], ans: a < b ? 0 : a > b ? 2 : 1, cmp: [x, y] } }; }
  function ORD(list) {
    var v = list.slice().sort(function (p, q) { return S.calc(p) - S.calc(q); });
    return { q: 'Order from least to greatest.', eq: [list.map(function () { return '[]'; }).join(' < ')], a: v, set: list, wide: true };
  }
  function ST(q, calc, unit) { return { q: q, eq: ['[]' + (unit ? ' ' + unit : '')], a: [S.calc(calc)], calc: calc }; }

  S.register('integers', { code: 'IN', ideas: {

    what: {
      watch: 'ordering negatives by their digits (−8 > −3). On the number line −8 is further left, so −8 < −3.',
      goal: 'I can compare and order integers and use them for real things.',
      learn: {
        show: { pic: ['iline', { min: -5, max: 5, pts: [[-3, 'A'], [2, 'B']] }], cap: 'left is less', eq: ['−3 < 2'] },
        together: [CMP('−6', '−2'), ORD(['4', '−5', '0', '−1'])],
        cue: 'Further right on the number line is greater.',
        own: [CMP('−9', '1'), CMP('−4', '−7'), { eq: ['−(−7) = []'], a: [7] }, { eq: ['−(12) = []'], a: [-12] }]
      },
      p1: {
        show: { eq: ['the opposite of 5 is −5', '−5 is 5 below 0'] },
        items: [CMP('−3', '−8'), CMP('0', '−2'), CMP('−10', '10'), CMP('−15', '−14'), { eq: ['−(−3) = []'], a: [3] }, { eq: ['−(25) = []'], a: [-25] },
          ORD(['−2', '3', '−7', '0'])]
      },
      p2: {
        items: [ORD(['−12', '8', '−20', '−1', '5']), ORD(['−0.5', '−3', '2', '−2.5']), CMP('−100', '−99'), CMP('−(−6)', '−6'),
          ST('At 7 a.m. it was −12 °C. At noon it was −4 °C. Which was colder? Write its temperature.', '−12', '°C'),
          ST('A diver is at −18 m. A fish is 5 m higher. What is the fish\'s depth?', '−18 + 5', 'm')]
      },
      p3: {
        items: [ORD(['−3.5', '−3.05', '−3', '−3.55']), CMP('−7/2', '−3'), CMP('−0.1', '−0.01'), { eq: ['−(−(−4)) = []'], a: [-4] },
          ST('Iqaluit was −27 °C and Toronto was −5 °C. How many degrees warmer was Toronto?', '−5 − (−27)', '°C'),
          ST('A bank account has −$40. $65 is put in. What is the balance?', '−40 + 65', 'dollars')]
      },
      think: {
        items: [{ q: '{a} says −10 is greater than −2 because 10 > 2. Explain.', lines: { n: 3, key: '−10 is further left on the number line, so −10 < −2. It is colder, deeper or owes more.' } },
          { q: 'Give two real places where we use negative numbers.', lines: { n: 2, key: 'For example temperatures below 0, depths below sea level, money owed.' } },
          { q: 'Which integer is its own opposite? Explain.', lines: { n: 2, key: '0. It is neither positive nor negative, so −0 = 0.' } },
          ORD(['−6', '6', '−(−5)', '−5'])]
      }
    },

    pairs: {
      watch: 'counting all the counters instead of cancelling. Each + and − pair is zero; count only what is left.',
      goal: 'I can add integers with zero pairs.',
      learn: {
        show: { pic: ['chips', { pos: 5, neg: 3, pairs: true }], cap: '3 zero pairs, 2 + left', eq: ['5 + (−3) = 2'] },
        together: [CH(2, 6, '2 + (−6)'), CH(4, 4, '4 + (−4)')],
        cue: 'A + and a − make zero. Cancel the pairs, count what is left.',
        own: [CH(6, 2, '6 + (−2)'), CH(1, 5, '1 + (−5)'), CH(3, 7, '3 + (−7)'), CH(7, 3, '7 + (−3)')]
      },
      p1: {
        show: { pic: ['chips', { pos: 2, neg: 5, pairs: true }], eq: ['2 + (−5) = −3'] },
        items: [CH(3, 1, '3 + (−1)'), CH(1, 4, '1 + (−4)'), CH(5, 5, '5 + (−5)'), CH(2, 7, '2 + (−7)'), CH(6, 3, '6 + (−3)'), CH(0, 4, '(−1) + (−3)')]
      },
      p2: {
        items: [Q('8 + (−3)'), Q('4 + (−9)'), Q('(−6) + 6'), Q('(−2) + (−5)'), Q('10 + (−12)'), Q('(−7) + 11'), Q('(−4) + (−4)'), Q('15 + (−20)')]
      },
      p3: {
        items: [Q('(−13) + 8'), Q('25 + (−17)'), Q('(−9) + (−14)'), Q('(−30) + 30'), Q('6 + (−4) + (−5)'), Q('(−8) + 3 + (−2)'),
          ST('{a} has 5 points, then loses 9. How many points now?', '5 + (−9)', 'points'), ST('The temperature is −6 °C and rises 10 °C. What is it now?', '−6 + 10', '°C')]
      },
      think: {
        items: [{ q: 'Why does 4 + (−4) = 0?', lines: { n: 2, key: 'Each + counter pairs with a − counter. 4 zero pairs make 0.' } },
          { q: 'Draw counters to show −3 + 5.', draw: { h: 60, key: ['chips', { pos: 5, neg: 3, pairs: true }] }, eq: ['−3 + 5 = []'], a: [2] },
          { q: 'Can you add zero pairs without changing the value? Explain.', lines: { n: 3, key: 'Yes. A zero pair is worth 0, and adding 0 changes nothing.' } },
          Q('(−11) + 4')]
      }
    },

    line: {
      watch: 'jumping the wrong way. Adding a positive moves right; adding a negative moves left.',
      goal: 'I can add integers on a number line.',
      learn: {
        show: { pic: ['iline', { min: -5, max: 5, jumps: [[-4, 7]] }], cap: 'start at −4, jump 7 right', eq: ['−4 + 7 = 3'] },
        together: [NL(3, -5, '3 + (−5)'), NL(-1, -3, '(−1) + (−3)')],
        cue: 'Start at the first number. + a positive: right. + a negative: left.',
        own: [NL(-6, 4, '(−6) + 4'), NL(2, -6, '2 + (−6)')]
      },
      p1: {
        show: { pic: ['iline', { min: -6, max: 3, jumps: [[1, -6]] }], eq: ['1 + (−6) = −5'] },
        items: [NL(-2, 5, '(−2) + 5'), NL(4, -7, '4 + (−7)'), NL(-3, -2, '(−3) + (−2)'), NL(-5, 5, '(−5) + 5'), Q('0 + (−4)'), Q('(−7) + 3')]
      },
      p2: {
        items: [Q('(−8) + 12'), Q('9 + (−15)'), Q('(−11) + (−6)'), Q('(−20) + 7'), Q('14 + (−14)'), Q('(−3) + 18'), Q('(−25) + 10'), Q('0 + (−9)')]
      },
      p3: {
        items: [Q('(−45) + 60'), Q('(−18) + (−27)'), Q('32 + (−50)'), Q('(−7) + 4 + (−9)'), Q('(−2.5) + 4'), Q('(−1.5) + (−3.5)'),
          ST('A submarine at −120 m rises 45 m. What is its depth now?', '−120 + 45', 'm'), ST('{b} owes $35 and earns $20. What is {b}\'s balance?', '−35 + 20', 'dollars')]
      },
      think: {
        items: [{ q: '{a} started at −2 and jumped 5 left for −2 + 5. What went wrong?', lines: { n: 3, key: 'Adding a positive moves right: −2 + 5 = 3.' } },
          { q: 'Show (−3) + (−4) on the line.', pic: ['iline', { min: -8, max: 1 }], draw: { h: 20, key: 'Start at −3, jump 4 left, land on −7.' }, eq: ['(−3) + (−4) = []'], a: [-7] },
          { q: 'Will 5 + (−8) be positive or negative? How do you know without adding?', lines: { n: 3, key: 'Negative. You move left 8 from 5, which is past 0.' } },
          Q('(−16) + 9')]
      }
    },

    signs: {
      watch: 'adding the sizes when the signs differ. −8 + 3: different signs, so subtract 8 − 3 = 5 and keep the sign of 8: −5.',
      goal: 'I can add integers with the sign rules.',
      learn: {
        show: { cap: 'different signs: subtract, keep the sign of the bigger size', eq: ['−8 + 3 = −5'] },
        together: [Q('(−6) + (−9)'), Q('12 + (−20)')],
        cue: 'Same signs: add and keep the sign. Different signs: subtract and take the sign of the bigger size.',
        own: [Q('(−15) + 4'), Q('(−7) + (−13)'), Q('22 + (−9)'), Q('(−30) + 18')]
      },
      p1: {
        show: { eq: ['same signs: −4 + (−6)', '−4 + (−6) = −10'] },
        items: [Q('(−5) + (−8)'), Q('(−14) + 6'), Q('17 + (−10)'), Q('(−9) + 9'), Q('(−21) + (−4)'), Q('8 + (−26)'), Q('(−12) + 15'), Q('(−33) + (−7)')]
      },
      p2: {
        items: [Q('(−48) + 29'), Q('(−56) + (−44)'), Q('75 + (−90)'), Q('(−120) + 85'), Q('(−6) + 14 + (−11)'), Q('(−3) + (−8) + 5'), Q('19 + (−7) + (−12)'), Q('(−1.2) + 3.5')]
      },
      p3: {
        items: [Q('(−250) + 175'), Q('(−4.5) + (−2.8)'), Q('(−9) + 15 + (−20) + 6'), Q('(−3/4) + 1/4', { frac: true }),
          ST('A stock is worth $42. It changes by −$7, then +$3, then −$11. What is it worth now?', '42 + (−7) + 3 + (−11)', 'dollars'),
          ST('At −8 °C the temperature rises 3 °C, then falls 9 °C. What is it now?', '−8 + 3 + (−9)', '°C'), Q('(−0.6) + 0.25')]
      },
      think: {
        items: [{ q: '{b} says −8 + 3 = −11. Explain the mistake.', lines: { n: 3, key: 'The signs are different, so subtract: 8 − 3 = 5, with the sign of 8: −5.' } },
          { q: 'Write two different sums of integers that equal −4.', lines: { n: 2, key: 'For example −7 + 3 and −1 + (−3).' } },
          { q: 'Is the sum of two negatives ever positive? Explain.', lines: { n: 3, key: 'No. Both move left of 0, so the sum is always negative.' } },
          Q('(−64) + 28')]
      }
    },

    opposite: {
      watch: 'subtracting a negative as if it were positive (5 − (−3) = 2). Add the opposite: 5 + 3 = 8.',
      goal: 'I can subtract integers by adding the opposite.',
      learn: {
        show: { cap: 'subtract −3: add its opposite, +3', eq: ['5 − (−3) = 5 + 3 = 8'] },
        together: [Q('2 − (−6)'), Q('(−4) − 7')],
        cue: 'Subtracting is adding the opposite.',
        own: [Q('(−3) − (−8)'), Q('6 − 10'), Q('(−9) − (−2)'), Q('0 − (−5)')]
      },
      p1: {
        show: { eq: ['−2 − 5 = −2 + (−5)', '−2 − 5 = −7'] },
        items: [Q('7 − (−2)'), Q('(−3) − 4'), Q('(−6) − (−6)'), Q('1 − 8'), Q('(−5) − (−9)'), Q('(−8) − 1'), Q('4 − (−4)'), Q('(−10) − (−3)')]
      },
      p2: {
        items: [Q('15 − (−9)'), Q('(−12) − 18'), Q('(−25) − (−40)'), Q('30 − 45'), Q('(−7) − (−7) − 7'), Q('(−4) − 6 − (−3)'), Q('8 − (−2) − 15'), Q('(−1.5) − 2.5')]
      },
      p3: {
        items: [Q('(−120) − (−75)'), Q('(−3.6) − (−1.4)'), Q('50 − (−50)'), Q('(−9) − 13 − (−22)'), Q('1/2 − (−1/4)', { frac: true }), Q('(−2/3) − 1/3', { frac: true }),
          ST('A plane at 3000 m drops 4500 m in a model. What height does the model show?', '3000 − 4500', 'm'), ST('{a} has −$12 and spends $18 more. What is the balance?', '−12 − 18', 'dollars')]
      },
      think: {
        items: [{ q: '{a} says 5 − (−3) = 2. Explain the mistake.', lines: { n: 3, key: 'Subtracting −3 is adding 3: 5 + 3 = 8.' } },
          { q: 'Use counters to explain 2 − (−3).', lines: { n: 3, key: 'Put 2 +. To take away 3 −, add 3 zero pairs, then remove the 3 −. 5 + are left.' } },
          { q: 'Is a − b always the same as b − a? Try 3 and −4.', lines: { n: 3, key: 'No. 3 − (−4) = 7, but −4 − 3 = −7. They are opposites.' } },
          Q('(−17) − (−29)')]
      }
    },

    change: {
      watch: 'subtracting the wrong way round. A change is end − start: from −8 to 5 is 5 − (−8) = 13.',
      goal: 'I can find the change between two integers.',
      learn: {
        show: { pic: ['iline', { min: -8, max: 6, lab: 2, pts: [[-8, 'start'], [5, 'end']] }], cap: 'end − start', eq: ['5 − (−8) = 13'] },
        together: [ST('The temperature went from −6 °C to 4 °C. How many degrees did it rise?', '4 − (−6)', '°C'), ST('A diver went from −3 m to −15 m. What was the change?', '−15 − (−3)', 'm')],
        cue: 'Change = end − start. A negative change means it went down.',
        own: [ST('From −11 °C to −2 °C. What is the change?', '−2 − (−11)', '°C'), ST('From 8 °C to −5 °C. What is the change?', '−5 − 8', '°C')]
      },
      p1: {
        show: { eq: ['from 3 to −4: −4 − 3', 'change −7'] },
        items: [ST('From −2 to 9. What is the change?', '9 − (−2)'), ST('From 6 to −1. What is the change?', '−1 − 6'), ST('From −10 to −4. What is the change?', '−4 − (−10)'),
          ST('From −3 to −12. What is the change?', '−12 − (−3)'), ST('From 0 to −8. What is the change?', '−8 − 0'), ST('From −7 to 7. What is the change?', '7 − (−7)')]
      },
      p2: {
        items: [ST('A plane flies at 9000 m. A sub is at −250 m. How far apart are they?', '9000 − (−250)', 'm'),
          ST('Yellowknife was −31 °C. Vancouver was 6 °C. How much warmer was Vancouver?', '6 − (−31)', '°C'),
          ST('An elevator goes from floor 4 to floor −2. What is the change?', '−2 − 4', 'floors'),
          ST('A balance goes from −$45 to $20. What is the change?', '20 − (−45)', 'dollars'),
          ST('From −18 °C to −27 °C. What is the change?', '−27 − (−18)', '°C'), ST('From −2.5 to 1.5. What is the change?', '1.5 − (−2.5)')]
      },
      p3: {
        items: [ST('Mount Logan is 5959 m high. The Dead Sea shore is at −430 m. What is the difference?', '5959 − (−430)', 'm'),
          ST('At 6 a.m. it was −14 °C; at 3 p.m. 9 °C. By how much did it rise?', '9 − (−14)', '°C'),
          ST('A team goes from −12 points to −3 points. What is the change?', '−3 − (−12)', 'points'),
          ST('A freezer goes from 4 °C to −18 °C. What is the change?', '−18 − 4', '°C'),
          ST('The lowest was −22 °C and the highest 31 °C. What is the range?', '31 − (−22)', '°C'), ST('From −0.75 to −2. What is the change?', '−2 − (−0.75)')]
      },
      think: {
        items: [{ q: '{b} says from −8 to 5 is a change of −3. What went wrong?', lines: { n: 3, key: '{b} added −8 + 5. The change is end − start: 5 − (−8) = 13.' } },
          { q: 'Why is the distance between −4 and 6 the same as between 6 and −4?', lines: { n: 3, key: 'Distance does not care about direction: it is 10 both ways. The change is +10 or −10.' } },
          { q: 'Write a temperature story with a change of −9 °C.', lines: { n: 2, key: 'For example: it was 3 °C and dropped to −6 °C.' } },
          ST('From −40 to −15. What is the change?', '−15 − (−40)')]
      }
    },

    groups: {
      watch: 'making the answer positive (3 × (−4) = 12). Three groups of −4 is −12.',
      goal: 'I can multiply a positive integer by a negative one.',
      learn: {
        show: { pic: ['chips', { pos: 0, neg: 12 }], cap: '3 groups of −4', eq: ['3 × (−4) = −12'] },
        together: [Q('2 × (−5)'), Q('(−6) × 3')],
        cue: 'A positive times a negative is negative.',
        own: [Q('4 × (−3)'), Q('(−7) × 2'), Q('5 × (−6)'), Q('(−9) × 4')]
      },
      p1: {
        show: { eq: ['(−8) × 2 = 2 × (−8)', '(−8) × 2 = −16'] },
        items: [Q('3 × (−2)'), Q('(−5) × 5'), Q('6 × (−7)'), Q('(−4) × 8'), Q('9 × (−3)'), Q('(−10) × 6'), Q('7 × (−8)'), Q('(−12) × 3')]
      },
      p2: {
        items: [Q('15 × (−4)'), Q('(−25) × 4'), Q('11 × (−11)'), Q('(−3) × 0'), Q('20 × (−6)'), Q('(−1.5) × 4'), Q('8 × (−0.5)'), Q('(−13) × 5')]
      },
      p3: {
        items: [Q('(−24) × 5'), Q('12 × (−15)'), Q('(−2.5) × 6'), Q('3 × (−1/4)', { frac: true }),
          ST('The temperature drops 3 °C each hour for 5 hours. What is the total change?', '5 × (−3)', '°C'),
          ST('{a} pays $12 a month for 6 months. What is the change in {a}\'s money?', '6 × (−12)', 'dollars'), Q('(−40) × 25'), Q('7 × (−0.3)')]
      },
      think: {
        items: [{ q: 'Explain why 4 × (−2) is negative using counters.', lines: { n: 3, key: '4 groups of 2 − counters make 8 − counters: −8.' } },
          { q: '{b} says 3 × (−4) = 12. What went wrong?', lines: { n: 2, key: 'Three groups of −4 is −12. Positive × negative is negative.' } },
          { q: 'Write a real story for 6 × (−5).', lines: { n: 2, key: 'For example: a tank loses 5 L each day for 6 days: −30 L.' } },
          Q('(−9) × 12')]
      }
    },

    negneg: {
      watch: 'making negative × negative negative. The pattern 3 × (−2) = −6, 2 × (−2) = −4 ... carries on to (−1) × (−2) = 2.',
      goal: 'I can multiply two negative integers.',
      learn: {
        show: { cap: '−6, −4, −2, 0, then 2', eq: ['(−1) × (−2) = 2'] },
        together: [Q('(−3) × (−4)'), Q('(−5) × (−2)')],
        cue: 'Same signs: positive. Different signs: negative.',
        own: [Q('(−6) × (−3)'), Q('(−7) × (−7)'), Q('(−9) × 4'), Q('(−8) × (−5)')]
      },
      p1: {
        show: { eq: ['(−4) × (−6): same signs', '(−4) × (−6) = 24'] },
        items: [Q('(−2) × (−2)'), Q('(−3) × (−7)'), Q('(−10) × (−4)'), Q('(−6) × 6'), Q('(−9) × (−9)'), Q('5 × (−5)'), Q('(−12) × (−2)'), Q('(−1) × (−15)')]
      },
      p2: {
        items: [Q('(−11) × (−12)'), Q('(−15) × 3'), Q('(−20) × (−20)'), Q('(−0.5) × (−8)'), Q('(−7)²'), Q('−7²'), Q('(−25) × (−4)'), Q('(−1.2) × (−5)')]
      },
      p3: {
        items: [Q('(−16) × (−5)'), Q('(−2.5) × (−2.5)'), Q('(−3/4) × (−8)', { frac: true }), Q('(−13)²'), Q('(−6) × (−6) − 40'), Q('(−4) × (−3) + (−2) × 5'),
          ST('A tank loses 4 L each minute. How much more did it hold 6 minutes ago?', '(−4) × (−6)', 'L'), Q('(−30) × (−0.2)')]
      },
      think: {
        items: [{ q: 'Continue the pattern to explain (−3) × (−2): 2 × (−2) = −4, 1 × (−2) = −2, 0 × (−2) = 0 ...', lines: { n: 3, key: 'Each step adds 2: (−1) × (−2) = 2, (−2) × (−2) = 4, (−3) × (−2) = 6.' } },
          { q: 'Why is (−5)² positive but −5² negative?', lines: { n: 3, key: '(−5)² = (−5) × (−5) = 25. −5² is the opposite of 5², so −25.' } },
          { q: '{a} says two negatives always make a positive, so −3 + (−4) = 7. Explain.', lines: { n: 3, key: 'The rule is for multiplying. Adding two negatives gives a negative: −7.' } },
          Q('(−14) × (−3)')]
      }
    },

    count: {
      watch: 'working out the sign from the first two factors only. Count every negative sign: an even count is positive, odd is negative.',
      goal: 'I can find the sign of a product of several integers.',
      learn: {
        show: { cap: '3 negative signs: odd', eq: ['(−1) × (−2) × (−3) = −6'] },
        together: [Q('(−2) × (−2) × (−2)'), Q('(−1) × 3 × (−4)')],
        cue: 'Count the negatives. Even: positive. Odd: negative.',
        own: [Q('2 × (−3) × (−5)'), Q('(−1) × (−1) × (−1) × (−1)'), Q('(−2) × 5 × 3'), Q('(−3) × (−3) × (−2)')]
      },
      p1: {
        show: { eq: ['(−2) × 3 × (−4): 2 negatives', '(−2) × 3 × (−4) = 24'] },
        items: [Q('(−1) × (−1) × (−1)'), Q('(−2) × (−5) × 2'), Q('4 × (−1) × 3'), Q('(−3) × (−2) × (−1)'), Q('(−10) × (−10) × (−1)'), Q('5 × (−2) × (−2)'), Q('(−2)³'), Q('(−1)⁴')]
      },
      p2: {
        items: [Q('(−2)⁴'), Q('(−3)³'), Q('(−1) × (−2) × (−3) × (−4)'), Q('(−5) × 2 × (−1) × (−3)'), Q('(−1)⁷'), Q('(−10)³'), Q('2 × (−2) × 2 × (−2)'), Q('(−0.5) × (−4) × (−3)')]
      },
      p3: {
        items: [Q('(−1)¹⁰'), Q('(−2)⁵'), Q('(−3) × (−4) × (−5) × 0'), Q('(−6) × (−1)³'), Q('(−2)³ × (−5)'), Q('(−1/2) × (−4) × (−3)'), Q('(−4)² × (−1)'), Q('(−10)⁴')]
      },
      think: {
        items: [{ q: 'Is (−1)¹⁰⁰ positive or negative? Explain.', lines: { n: 2, key: 'Positive. 100 negatives is an even count.' } },
          { q: '{b} says (−2) × (−3) × (−4) = 24. What went wrong?', lines: { n: 3, key: 'There are 3 negatives, an odd count, so the answer is −24.' } },
          { q: 'Why does a 0 factor make the sign question not matter?', lines: { n: 2, key: 'Anything times 0 is 0, which is neither positive nor negative.' } },
          Q('(−3)⁴')]
      }
    },

    divide: {
      watch: 'forgetting the sign rule for dividing. It is the same as multiplying: (−24) ÷ (−6) = 4, (−24) ÷ 6 = −4.',
      goal: 'I can divide integers.',
      learn: {
        show: { cap: 'check: (−4) × (−6) = 24', eq: ['24 ÷ (−6) = −4'] },
        together: [Q('(−18) ÷ 3'), Q('(−35) ÷ (−7)')],
        cue: 'Same signs: positive. Different signs: negative. Check by multiplying.',
        own: [Q('40 ÷ (−8)'), Q('(−56) ÷ (−8)'), Q('(−81) ÷ 9'), Q('0 ÷ (−5)')]
      },
      p1: {
        show: { eq: ['(−42) ÷ (−7): same signs', '(−42) ÷ (−7) = 6'] },
        items: [Q('(−12) ÷ 4'), Q('(−20) ÷ (−5)'), Q('36 ÷ (−9)'), Q('(−49) ÷ 7'), Q('(−64) ÷ (−8)'), Q('100 ÷ (−10)'), Q('(−72) ÷ (−9)'), Q('(−15) ÷ (−1)')]
      },
      p2: {
        items: [Q('(−144) ÷ 12'), Q('(−200) ÷ (−25)'), Q('96 ÷ (−8)'), Q('(−7.5) ÷ 3'), Q('(−4.8) ÷ (−6)'), { eq: ['(−63) ÷ [] = 9'], a: [-7] }, { eq: ['[] ÷ (−4) = −11'], a: [44] }, Q('(−1000) ÷ (−40)')]
      },
      p3: {
        items: [Q('(−360) ÷ (−12)'), Q('(−3/4) ÷ 3', { frac: true }), Q('(−6)² ÷ (−9)'), Q('(−48) ÷ (−2)³'),
          ST('The temperature fell 18 °C in 6 hours, the same each hour. What was the change each hour?', '(−18) ÷ 6', '°C'),
          ST('A $−84 balance is shared by 4 friends. What is each share?', '(−84) ÷ 4', 'dollars'), Q('(−2.1) ÷ (−0.7)'), Q('225 ÷ (−15)')]
      },
      think: {
        items: [{ q: 'Explain how multiplying helps you find (−48) ÷ 6.', lines: { n: 3, key: '6 × ? = −48. 6 × (−8) = −48, so the answer is −8.' } },
          { q: '{a} says (−30) ÷ (−5) = −6. What went wrong?', lines: { n: 2, key: 'Same signs give a positive: 6.' } },
          { q: 'The mean of −4, −8 and 3 is? Show your steps.', eq: ['(−4 + (−8) + 3) ÷ 3 = []'], a: [-3] },
          Q('(−132) ÷ 11')]
      }
    },

    steps: {
      watch: 'working left to right and ignoring the order. Brackets, then powers, then × and ÷, then + and −.',
      goal: 'I can do several integer steps in the right order.',
      learn: {
        show: { cap: '× first: (−3) × 4 = −12', eq: ['5 + (−3) × 4 = −7'] },
        together: [Q('(−2) + 6 × (−3)'), Q('(−8 + 2) × (−5)')],
        cue: 'Brackets, powers, × and ÷, then + and −. Keep the signs with their numbers.',
        own: [Q('10 − (−4) × 2'), Q('(−3)² − 5'), Q('(−20) ÷ (−4) + (−7)'), Q('2 × (−6 − 1)')]
      },
      p1: {
        show: { eq: ['(−6 + 2)² = (−4)²', '(−6 + 2)² = 16'] },
        items: [Q('(−4) × 3 + 5'), Q('6 − 2 × (−3)'), Q('(−18) ÷ 3 − 4'), Q('(5 − 9) × 2'), Q('(−2)² + (−2)'), Q('(−7) + 12 ÷ (−4)'), Q('3 × (−4) − (−10)'), Q('(−1 − 4) ÷ (−5)')]
      },
      p2: {
        items: [Q('(−3)³ + 20'), Q('4 − (−2)² × 3'), Q('(−6) × (−2) − 15 ÷ (−3)'), Q('(8 − 14) ÷ (−2) + (−9)'), Q('(−5 + 1)² − (−3)'), Q('2 × (−3)² − 4 × 5'), Q('(−24) ÷ (2 − 8)'), Q('(−10) − (−3) × (−3)')]
      },
      p3: {
        items: [Q('((−2) + 7)² ÷ (−5)'), Q('(−1)⁵ × (6 − 11) + 4'), Q('(−3) × (4 − (−2)) ÷ 9'), Q('(−4)² − 3 × (−2)³'),
          ST('In a game, {a} scores 3 rounds of −4 and one round of +15. What is the total?', '3 × (−4) + 15', 'points'),
          ST('The 4 temperatures were −6, −2, 3 and −7 °C. What is the mean?', '(−6 + (−2) + 3 + (−7)) ÷ 4', '°C'), Q('(9 − (−3)) ÷ (−4) × 2')]
      },
      think: {
        items: [{ q: '{b} found 5 + (−3) × 4 = 8. What went wrong?', lines: { n: 3, key: '{b} added first: 2 × 4. Multiply first: 5 + (−12) = −7.' } },
          { q: 'Put in brackets to make it true: −2 + 6 × −3 = −12', lines: { n: 1, key: '(−2 + 6) × (−3) = −12' } },
          { q: 'Make an expression with −3, 4 and −2 that equals 10.', lines: { n: 2, key: 'For example (−3) × (−2) + 4 = 10.' } },
          Q('(−12) ÷ (−3) − (−2)³')]
      }
    }
  } });
})();
