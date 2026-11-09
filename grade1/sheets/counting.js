/* Grade 1 Counting to 50: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the
   lessons in chapters/counting.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: B1.1 read and represent numbers to 50 and their everyday uses; B1.2 compose and decompose numbers to 50;
   B1.4 estimate collections up to 50 and check by counting; B1.5 count to 50 by 1s, 2s, 5s and 10s.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* count loose things (or things in a ten frame) */
  function D(n) { return ['dots', { t: n, sp: n > 30 ? 13 : n > 20 ? 15 : 19 }]; }
  function C(n, q) { return { q: q || 'How many {many}?', pic: D(n), eq: ['[]'], a: [n] }; }
  /* circle the number that tells how many */
  function CP(n, opts) { return { q: 'Circle how many.', pic: D(n), pick: { opts: opts.map(String), ans: opts.indexOf(n), val: n } }; }
  /* a ten frame: n dark, then b white; the sum to finish */
  function F(n, b, row, a) { return { pic: ['frame', { n: n, b: b || 0 }], eq: [row], a: a }; }
  /* a full ten and some more, in two ten frames */
  function TN(k) { return { pic: ['tenframe', { a: 10, b: k }], eq: ['10 + [] = []'], a: [k, 10 + k] }; }
  /* a count: the numbers shown, then blanks ('[]' in the list); by is the step */
  function CT(list, by, q) {
    var a = [], eq = list.map(function (v, i) { var last = i === list.length - 1; if (v === '[]') { a.push(null); return last ? '[]' : '[],'; } return last ? String(v) : v + ','; }).join(' ');
    var first = list.filter(function (v) { return v !== '[]'; })[0], at = list.indexOf(first);
    list.forEach(function (v, i) { if (v === '[]') a[a.indexOf(null)] = first + (i - at) * by; });
    return { q: q, eq: [eq], a: a, by: by, wide: list.length > 4 };
  }
  var ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function inWords(n) { return n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''); }
  /* words to a number, a number to words, and circle the match */
  function W2N(n) { return { q: 'Write the number: ' + inWords(n) + '.', words: inWords(n), eq: ['[]'], a: [n] }; }
  function N2W(n) { return { q: 'Write ' + n + ' in words.', lines: { n: 1, key: inWords(n) }, spell: n }; }
  function PW(n, opts) { return { q: 'Circle ' + inWords(n) + '.', pick: { opts: opts.map(String), ans: opts.indexOf(n), nw: inWords(n) } }; }
  function PN(n, opts) { return { q: 'Circle ' + n + ' in words.', pick: { opts: opts.map(inWords), ans: opts.indexOf(n), wn: n }, wide: true }; }
  /* about how many? the closest guess */
  function ES(n, opts) { var best = opts.reduce(function (b, x) { return Math.abs(x - n) < Math.abs(b - n) ? x : b; }); return { q: 'About how many? Do not count.', pic: D(n), pick: { opts: opts.map(String), ans: opts.indexOf(best), near: true } }; }
  /* estimate, then count to check */
  function EC(n, opts) { var e = ES(n, opts); e.q = 'Circle a guess. Then count.'; e.eq = ['[] {many}']; e.a = [n]; e.pickLast = false; return e; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }

  S.register('counting', { code: 'CT', ideas: {

    touch: {
      watch: 'counting a thing twice or skipping one. Have the child touch each one and push it aside as they say the number.',
      goal: 'I can touch each one once as I count.',
      learn: {
        show: { pic: ['dots', { t: 6 }], cap: 'Touch each one once', eq: ['1, 2, 3, 4, 5, 6', '6 in all'] },
        together: [C(4), C(7)],
        cue: 'Touch one, say one number. Do not skip. Do not touch twice.',
        own: [C(3), C(5), C(8), C(9)]
      },
      p1: { show: { pic: ['dots', { t: 5 }], eq: ['5 in all'] }, items: [C(2), C(6), C(4), C(10), C(7), C(9)] },
      p2: { items: [C(12), C(15), C(11), C(18), C(14), C(20)] },
      p3: { items: [C(23), C(17), C(26), C(19), C(30), C(21)] },
      think: {
        items: [{ q: '{a} counted 7. {b} counted 8. Count them. Who is right?', pic: ['dots', { t: 8 }], eq: ['[]'], a: [8] },
          { q: 'Draw 9 {many}.', draw: { h: 64, key: ['dots', { t: 9 }] } },
          { q: 'How can you keep track when you count?', lines: { n: 2, key: 'Touch each one and move it aside, or cross it off.' } },
          { q: 'Draw 12 dots. Count them again to check.', draw: { h: 64, key: ['dots', { t: 12 }] } }]
      }
    },

    last: {
      watch: 'counting again from 1 when asked "How many?". The last number said is the answer.',
      goal: 'I can say how many: it is the last number I count.',
      learn: {
        show: { pic: ['dots', { t: 5 }], cap: '1, 2, 3, 4, 5', eq: ['5 in all'] },
        together: [CP(4, [1, 4, 5]), CP(6, [6, 5, 1])],
        cue: 'The last number you say tells how many.',
        own: [CP(3, [1, 3, 4]), CP(7, [7, 6, 1]), CP(5, [1, 4, 5]), CP(8, [8, 9, 1])]
      },
      p1: { show: { pic: ['dots', { t: 4 }], eq: ['1, 2, 3, 4', '4 in all'] }, items: [CP(2, [1, 2, 3]), CP(6, [6, 7, 1]), C(5), C(9), CP(10, [1, 9, 10]), C(7)] },
      p2: { items: [CP(12, [12, 1, 11]), C(13), CP(15, [1, 15, 16]), C(16), CP(11, [11, 10, 1]), C(19)] },
      p3: { items: [C(22), C(25), CP(28, [28, 1, 27]), C(31), C(24), CP(30, [1, 29, 30])] },
      think: {
        items: [{ q: '{a} counts: 1, 2, 3, 4, 5, 6. How many {many}?', eq: ['[]'], a: [6], calc: '6' },
          { q: 'Count these again starting at a different one. How many now?', pic: ['dots', { t: 7 }], eq: ['[]'], a: [7] },
          { q: '{b} says the answer is 1, because 1 is the first number. Is that right? Why?', lines: { n: 2, key: 'No. The last number you count tells how many.' } },
          { q: 'Draw a set with 10 {many}.', draw: { h: 64, key: ['dots', { t: 10 }] } }]
      }
    },

    names: {
      watch: 'treating every number as a count. Bus 12 is a name; 12 {many} is how many.',
      goal: 'I can read numbers and tell when a number is a name.',
      learn: {
        show: { cap: 'Bus 12 is a name. 12 {many} is how many.', eq: ['twelve = 12'] },
        together: [W2N(12), PW(15, [51, 15, 5])],
        cue: 'Read the number. Ask: does it tell how many, or is it a name?',
        own: [W2N(8), W2N(20), PW(14, [14, 40, 4]), C(12)]
      },
      p1: { show: { eq: ['nine = 9'] }, items: [W2N(3), W2N(10), W2N(7), PW(6, [6, 9, 16]), C(6), PW(11, [11, 1, 12])] },
      p2: { items: [W2N(16), W2N(25), PW(30, [13, 30, 3]), PW(19, [19, 9, 91]), W2N(42), C(16)] },
      p3: { items: [W2N(37), W2N(50), PW(44, [4, 44, 40]), W2N(28), PW(33, [30, 33, 3]), C(27)] },
      think: {
        items: [{ q: 'Room 15. Does 15 tell how many rooms? Tell why.', lines: { n: 2, key: 'No. 15 is the name of the room.' } },
          { q: 'Write 2 places you see numbers that are names.', lines: { n: 2, key: 'For example: a bus number, a house number, a jersey number.' } },
          { q: 'Write a number that tells how many. Draw it.', draw: { h: 60, key: 'Any count with that many dots, such as 5 and 5 dots.' } },
          { q: 'Jersey 9 and 9 {many}. Which tells how many?', lines: { n: 1, key: '9 {many}.' } }]
      }
    },

    five: {
      watch: 'counting every counter from 1. Ask: "How many in a full top row?" Then count on from 5.',
      goal: 'I can see 5 and some more in a ten frame.',
      learn: {
        show: { pic: ['frame', { n: 7 }], cap: 'A full row is 5', eq: ['5 + 2 = 7'] },
        together: [F(6, 0, '5 + [] = []', [1, 6]), F(8, 0, '5 + [] = []', [3, 8])],
        cue: 'See the full row of 5. Count on from 5.',
        own: [F(9, 0, '5 + [] = []', [4, 9]), F(5, 0, '5 + [] = []', [0, 5]), F(7, 0, '5 + [] = []', [2, 7]), F(10, 0, '5 + [] = []', [5, 10])]
      },
      p1: { show: { pic: ['frame', { n: 6 }], eq: ['5 + 1 = 6'] }, items: [F(7, 0, '5 + [] = 7', [2]), F(9, 0, '5 + [] = 9', [4]), F(8, 0, '5 + [] = 8', [3]), F(6, 0, '[]', [6]), F(10, 0, '[]', [10]), F(5, 0, '[]', [5])] },
      p2: { items: [F(4, 0, '[]', [4]), F(8, 0, '5 + [] = []', [3, 8]), F(3, 0, '[]', [3]), F(9, 0, '5 + [] = []', [4, 9]), { eq: ['5 + 3 = []', '5 + 4 = []'], a: [8, 9] }, { eq: ['5 + 1 = []', '5 + 5 = []'], a: [6, 10] }] },
      p3: { items: [{ eq: ['5 + 2 = []', '5 + [] = 9'], a: [7, 4] }, { eq: ['5 + [] = 6', '5 + 0 = []'], a: [1, 5] }, F(7, 0, '[] + 2 = 7', [5]), { eq: ['[] + 3 = 8'], a: [5] }, story('{a} has 5 {many} and 4 more. How many?', '{many}', 9, '5 + 4'), story('{b} has 5 {many}. {b} gets 3 more. How many now?', '{many}', 8, '5 + 3')] },
      think: {
        items: [{ q: 'Draw 8 in the ten frame. Show 5 and 3.', pic: ['frame', { n: 0 }], draw: { h: 20, key: 'Fill the top row (5) and 3 boxes of the bottom row.' } },
          { q: 'Why is a full row of 5 helpful?', lines: { n: 2, key: 'You know it is 5 without counting, so you count on from 5.' } },
          { q: 'Which is more: 5 + 4 or 5 + 2?', pick: { opts: ['5 + 4', '5 + 2'], ans: 0, big: true } },
          { q: 'Show 9 as 5 and some more.', eq: ['9 = 5 + []'], a: [4] }]
      }
    },

    empty: {
      watch: 'counting the counters instead of the empty boxes. Point to the empty boxes only.',
      goal: 'I can count the empty boxes to see how many more make 10.',
      learn: {
        show: { pic: ['frame', { n: 7 }], cap: '7 counters, 3 empty boxes', eq: ['7 + 3 = 10'] },
        together: [F(8, 0, '8 + [] = 10', [2]), F(6, 0, '6 + [] = 10', [4])],
        cue: 'Count the empty boxes. Counters and empty boxes make 10.',
        own: [F(9, 0, '9 + [] = 10', [1]), F(5, 0, '5 + [] = 10', [5]), F(4, 0, '4 + [] = 10', [6]), F(7, 0, '7 + [] = 10', [3])]
      },
      p1: { show: { pic: ['frame', { n: 8 }], eq: ['8 + 2 = 10'] }, items: [F(9, 0, '9 + [] = 10', [1]), F(7, 0, '7 + [] = 10', [3]), F(6, 0, '6 + [] = 10', [4]), F(8, 0, '8 + [] = 10', [2]), F(5, 0, '5 + [] = 10', [5]), F(3, 0, '3 + [] = 10', [7])] },
      p2: { items: [F(2, 0, '2 + [] = 10', [8]), F(4, 0, '4 + [] = 10', [6]), F(1, 0, '1 + [] = 10', [9]), { eq: ['6 + [] = 10', '3 + [] = 10'], a: [4, 7] }, { eq: ['8 + [] = 10', '5 + [] = 10'], a: [2, 5] }, { eq: ['9 + [] = 10', '7 + [] = 10'], a: [1, 3] }] },
      p3: { items: [{ eq: ['[] + 4 = 10', '[] + 8 = 10'], a: [6, 2] }, { eq: ['10 = 7 + []', '10 = 2 + []'], a: [3, 8] }, story('{a} has 6 {many}. How many more make 10?', 'more', 4, '10 − 6'), story('A {cont} holds 10 {many}. It has 9. How many more fit?', 'more', 1, '10 − 9'), { eq: ['[] + 5 = 10', '4 + [] = 10'], a: [5, 6] }, { eq: ['1 + [] = 10', '[] + 0 = 10'], a: [9, 10] }] },
      think: {
        items: [{ q: 'Write all the pairs that make 10.', lines: { n: 2, key: '0 + 10, 1 + 9, 2 + 8, 3 + 7, 4 + 6, 5 + 5 (and the turn-arounds).' } },
          { q: '4 counters are in a ten frame. How many boxes are empty?', eq: ['4 + [] = 10'], a: [6] },
          { q: '{b} says 7 needs 4 more to make 10. Is {b} right?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '7 + 4 = 10' },
          { q: 'Why can you count empty boxes instead of counters?', lines: { n: 2, key: 'A ten frame always has 10 boxes. The empty ones show how many more make 10.' } }]
      }
    },

    teens: {
      watch: 'counting the full frame one by one. A full frame is 10: start at 10 and count on.',
      goal: 'I can see a teen number as 10 and some more.',
      learn: {
        show: { pic: ['tenframe', { a: 10, b: 3 }], cap: 'A full frame and 3 more', eq: ['10 + 3 = 13'] },
        together: [TN(5), TN(8)],
        cue: 'A full frame is 10. Start at 10 and count on.',
        own: [TN(2), TN(6), TN(9), TN(4)]
      },
      p1: { show: { pic: ['tenframe', { a: 10, b: 1 }], eq: ['10 + 1 = 11'] }, items: [TN(7), TN(3), TN(10), TN(1), TN(5), TN(8)] },
      p2: { items: [{ eq: ['10 + 6 = []', '10 + 9 = []'], a: [16, 19] }, { eq: ['14 = 10 + []', '17 = 10 + []'], a: [4, 7] }, TN(2), TN(6), { eq: ['10 + 4 = []', '12 = 10 + []'], a: [14, 2] }, { eq: ['10 + 10 = []', '18 = 10 + []'], a: [20, 8] }] },
      p3: { items: [{ eq: ['15 = [] + 5', '11 = [] + 1'], a: [10, 10] }, { eq: ['[] + 3 = 13', '[] + 7 = 17'], a: [10, 10] }, story('{a} has a full {cont} of 10 {many} and 6 more. How many?', '{many}', 16, '10 + 6'), story('{b} has 10 {many} and 9 more. How many?', '{many}', 19, '10 + 9'), { eq: ['10 + [] = 12', '10 + [] = 20'], a: [2, 10] }, { eq: ['19 = 10 + []', '16 = 10 + []'], a: [9, 6] }] },
      think: {
        items: [{ q: 'Draw 15 in two ten frames.', pic: ['tenframe', { a: 0, b: 0 }], draw: { h: 20, key: 'Fill one frame (10) and 5 boxes of the other.' } },
          { q: 'What do the 1 and the 7 in 17 tell you?', lines: { n: 2, key: '1 ten (a full frame) and 7 ones.' } },
          { q: '{a} says 10 + 8 = 81. What is right?', eq: ['10 + 8 = []'], a: [18] },
          { q: 'Show 20 as tens.', eq: ['20 = 10 + []'], a: [10] }]
      }
    },

    'teen-forty': {
      watch: 'mixing up 14 and 40, 16 and 60. Teen numbers are 10 and some more: the 1 is written first.',
      goal: 'I can tell a teen number from a ten number.',
      learn: {
        show: { pic: ['blocks', { h: 0, t: 1, o: 4 }], cap: 'fourteen: 1 ten, 4 ones', eq: ['14, not 40'] },
        together: [PW(14, [14, 40]), PW(60, [16, 60])],
        cue: 'Fourteen is 1 ten and 4. Forty is 4 tens.',
        own: [PW(17, [70, 17]), PW(50, [15, 50]), PW(13, [13, 30]), PW(40, [14, 40])]
      },
      p1: { show: { pic: ['blocks', { h: 0, t: 4, o: 0 }], eq: ['40'] }, items: [{ pic: ['blocks', { h: 0, t: 1, o: 6 }], eq: ['[]'], a: [16] }, { pic: ['blocks', { h: 0, t: 3, o: 0 }], eq: ['[]'], a: [30] }, PW(18, [18, 80]), PW(30, [13, 30]), { pic: ['blocks', { h: 0, t: 1, o: 3 }], eq: ['[]'], a: [13] }, { pic: ['blocks', { h: 0, t: 5, o: 0 }], eq: ['[]'], a: [50] }] },
      p2: { items: [W2N(15), W2N(50), W2N(19), W2N(40), PN(16, [16, 60]), PN(30, [13, 30])] },
      p3: { items: [W2N(14), W2N(18), PN(40, [14, 40]), PN(17, [17, 70]), { pic: ['blocks', { h: 0, t: 1, o: 5 }], eq: ['[]'], a: [15] }, { pic: ['blocks', { h: 0, t: 5, o: 0 }], eq: ['[]'], a: [50] }] },
      think: {
        items: [{ q: 'Draw fourteen and forty with tens and ones.', draw: { h: 72, key: 'Fourteen: 1 ten and 4 ones. Forty: 4 tens.' } },
          { q: '{b} wrote 60 for sixteen. What is right?', eq: ['[]'], a: [16], words: 'sixteen' },
          { q: 'Which is more: thirteen or thirty?', pick: { opts: ['thirteen', 'thirty'], ans: 1, big: true } },
          { q: 'How do you hear a teen number?', lines: { n: 2, key: 'It ends in "teen". It is 10 and some more.' } }]
      }
    },

    'more-less': {
      watch: 'saying the number before when asked for 1 more. Use a number line: 1 more is the next one to the right.',
      goal: 'I can say 1 more and 1 less.',
      learn: {
        show: { pic: ['nl', { min: 10, max: 20, tick: 1, lab: 1, pt: 15 }], cap: '1 less, then 1 more', eq: ['14, 15, 16'] },
        together: [CT(['[]', 8, '[]'], 1), CT(['[]', 12, '[]'], 1)],
        cue: '1 more is the next number. 1 less is the number before.',
        own: [CT(['[]', 5, '[]'], 1), CT(['[]', 10, '[]'], 1), CT(['[]', 17, '[]'], 1), CT(['[]', 20, '[]'], 1)]
      },
      p1: { show: { eq: ['1 more than 6 is 7', '5, 6, 7'] }, items: [CT([3, '[]'], 1, '1 more:'), CT([9, '[]'], 1, '1 more:'), CT(['[]', 7], 1, '1 less:'), CT(['[]', 4], 1, '1 less:'), CT(['[]', 13, '[]'], 1), CT(['[]', 16, '[]'], 1)] },
      p2: { items: [CT(['[]', 24, '[]'], 1), CT(['[]', 31, '[]'], 1), CT(['[]', 19, '[]'], 1), CT(['[]', 40, '[]'], 1), { eq: ['27 + 1 = []', '35 − 1 = []'], a: [28, 34] }, { eq: ['42 + 1 = []', '30 − 1 = []'], a: [43, 29] }] },
      p3: { items: [CT(['[]', 49, '[]'], 1), CT(['[]', 20, '[]'], 1), { eq: ['[] + 1 = 36', '[] − 1 = 44'], a: [35, 45] }, story('{a} has 29 {many}. {a} gets 1 more. How many now?', '{many}', 30, '29 + 1'), story('{b} has 40 {many} and gives 1 away. How many now?', '{many}', 39, '40 − 1'), { eq: ['38 + 1 = []', '11 − 1 = []'], a: [39, 10] }] },
      think: {
        items: [{ q: 'Which number is 1 more than 19 and 1 less than 21?', eq: ['[]'], a: [20], calc: '19 + 1' },
          { q: '{b} says 1 less than 30 is 31. What went wrong?', lines: { n: 2, key: '{b} said 1 more. 1 less than 30 is 29.' } },
          { q: 'Mark 1 more and 1 less than 25.', pic: ['nl', { min: 20, max: 30, tick: 1, lab: 5, ask: [24, 26] }], a: [24, 26] },
          { q: 'Find a number. Write 1 less and 1 more.', lines: { n: 1, key: 'For example: 32, 33, 34.' } }]
      }
    },

    'new-ten': {
      watch: 'saying "twenty-ten" after 29. After 9 ones comes a new ten.',
      goal: 'I can count on to the next ten.',
      learn: {
        show: { cap: 'After 9 ones comes a new ten', eq: ['27, 28, 29, 30, 31'] },
        together: [CT([17, 18, 19, '[]', '[]'], 1), CT([37, 38, 39, '[]', '[]'], 1)],
        cue: 'After 9 ones, the tens go up by 1 and the ones start at 0.',
        own: [CT([8, 9, '[]', '[]'], 1), CT([28, 29, '[]', '[]'], 1), CT([47, 48, '[]', '[]'], 1), CT([38, '[]', '[]', 41], 1)]
      },
      p1: { show: { eq: ['18, 19, 20'] }, items: [CT([18, 19, '[]'], 1), CT([28, 29, '[]'], 1), CT([38, 39, '[]'], 1), CT([48, 49, '[]'], 1), CT([8, 9, '[]'], 1), CT([19, '[]', 21], 1)] },
      p2: { items: [CT([26, 27, '[]', '[]', '[]'], 1), CT([16, '[]', '[]', 19, '[]'], 1), CT([36, '[]', '[]', '[]', 40], 1), CT([45, '[]', '[]', '[]', '[]'], 1), CT(['[]', 30, 31], 1), CT(['[]', 20, 21], 1)] },
      p3: { items: [CT([29, '[]', '[]', '[]'], 1), CT(['[]', '[]', 40, 41], 1), CT(['[]', '[]', 50], 1), CT([9, '[]', '[]', '[]'], 1), { eq: ['39 + 1 = []', '30 − 1 = []'], a: [40, 29] }, { eq: ['49 + 1 = []', '20 − 1 = []'], a: [50, 19] }] },
      think: {
        items: [{ q: '{a} counts: 27, 28, 29, 20. What is wrong?', lines: { n: 2, key: 'After 29 comes 30, a new ten. 20 is less than 29.' } },
          { q: 'Count back: 42, 41, 40, ...', eq: ['42, 41, 40, [], []'], a: [39, 38], by: -1 },
          { q: 'Which number comes after 39?', pick: { opts: ['30', '40', '310'], ans: 1, val: 40 } },
          { q: 'Write the numbers from 18 to 22.', eq: ['[], [], [], [], []'], a: [18, 19, 20, 21, 22], by: 1, wide: true }]
      }
    },

    'count-on': {
      watch: 'going back to 1 each time. Say the first number in your head, then keep counting.',
      goal: 'I can count on from any number.',
      learn: {
        show: { cap: 'Start at 23. Keep going.', eq: ['23, 24, 25, 26'] },
        together: [CT([12, '[]', '[]', '[]'], 1), CT([34, '[]', '[]', '[]'], 1)],
        cue: 'Say the start number. Then count on, one at a time.',
        own: [CT([6, '[]', '[]', '[]'], 1), CT([15, '[]', '[]', '[]'], 1), CT([27, '[]', '[]', '[]'], 1), CT([41, '[]', '[]', '[]'], 1)]
      },
      p1: { show: { eq: ['14, 15, 16, 17'] }, items: [CT([4, '[]', '[]'], 1), CT([11, '[]', '[]'], 1), CT([20, '[]', '[]'], 1), CT([33, '[]', '[]'], 1), CT([45, '[]', '[]'], 1), CT([7, '[]', '[]'], 1)] },
      p2: { items: [CT([22, '[]', '[]', '[]', '[]'], 1), CT([16, '[]', '[]', '[]', '[]'], 1), CT([37, '[]', '[]', '[]', '[]'], 1), CT([43, '[]', '[]', '[]', '[]'], 1), { pic: ['nl', { min: 20, max: 30, tick: 1, lab: 5, pt: 23, jumps: [[23, 24], [24, 25], [25, 26]] }], eq: ['23 + 3 = []'], a: [26] }, { pic: ['nl', { min: 10, max: 20, tick: 1, lab: 5, pt: 14, jumps: [[14, 15], [15, 16]] }], eq: ['14 + 2 = []'], a: [16] }] },
      p3: { items: [CT([46, '[]', '[]', '[]', '[]'], 1), CT(['[]', '[]', 28, '[]'], 1), { eq: ['31 + 3 = []', '17 + 2 = []'], a: [34, 19] }, { eq: ['25 + 4 = []', '44 + 3 = []'], a: [29, 47] }, story('{a} counts 18 {many}. Then {a} finds 3 more. How many?', '{many}', 21, '18 + 3'), story('{b} is on page 36. {b} reads 4 more pages. What page now?', 'page', 40, '36 + 4')] },
      think: {
        items: [{ q: 'Why start at 30, not 1, to find 30 + 3?', lines: { n: 2, key: 'You already know 30. Count on 3: 31, 32, 33.' } },
          { q: 'Count on from 47 to 50.', eq: ['47, [], [], []'], a: [48, 49, 50], by: 1 },
          { q: 'Start at 19. Count on 5. Where do you land?', eq: ['[]'], a: [24], calc: '19 + 5' },
          { q: 'Show 24 + 3 with jumps.', pic: ['nl', { min: 20, max: 30, tick: 1, lab: 5 }], draw: { h: 20, key: 'Three jumps of 1: 24 to 25 to 26 to 27.' } }]
      }
    },

    words: {
      watch: 'spelling the tens word like the teen word (fourty). Forty has no u.',
      goal: 'I can read and write number words to 50.',
      learn: {
        show: { cap: 'thirty-two: thirty and two', eq: ['thirty-two = 32'] },
        together: [W2N(21), N2W(35)],
        cue: 'Say the tens word, then the ones word, with a dash between.',
        own: [W2N(9), W2N(26), N2W(14), N2W(40)]
      },
      p1: { show: { eq: ['twenty-five = 25'] }, items: [W2N(4), W2N(11), W2N(20), W2N(23), PW(18, [18, 81, 8]), PW(30, [3, 13, 30])] },
      p2: { items: [N2W(7), N2W(12), N2W(20), N2W(33), W2N(46), W2N(39)] },
      p3: { items: [N2W(15), N2W(48), N2W(27), N2W(50), PN(41, [14, 41, 40]), PN(19, [19, 9, 90])] },
      think: {
        items: [{ q: '{a} wrote fourty. Write it the right way.', lines: { n: 1, key: 'forty' }, spell: 40 },
          { q: 'Write your age in words.', lines: { n: 1, key: 'For example: six.' } },
          { q: 'Which is more: twenty-nine or thirty-one?', pick: { opts: ['twenty-nine', 'thirty-one'], ans: 1, big: true }, wide: true },
          { q: 'Write 44 in words.', lines: { n: 1, key: 'forty-four' }, spell: 44 }]
      }
    },

    tens: {
      watch: 'counting by 1s after 10. Count the full tens: 10, 20, 30.',
      goal: 'I can count by 10s to 50.',
      learn: {
        show: { pic: ['blocks', { h: 0, t: 3, o: 0 }], cap: 'Count the tens', eq: ['10, 20, 30'] },
        together: [CT([10, 20, '[]', '[]'], 10), { pic: ['blocks', { h: 0, t: 4, o: 0 }], eq: ['[]'], a: [40] }],
        cue: 'Each ten is one more ten: 10, 20, 30, 40, 50.',
        own: [CT([10, '[]', '[]'], 10), CT([20, '[]', '[]'], 10), { pic: ['blocks', { h: 0, t: 2, o: 0 }], eq: ['[]'], a: [20] }, { pic: ['blocks', { h: 0, t: 5, o: 0 }], eq: ['[]'], a: [50] }]
      },
      p1: { show: { eq: ['10, 20, 30, 40, 50'] }, items: [CT([10, 20, 30, '[]'], 10), CT([20, 30, '[]', '[]'], 10), { pic: ['blocks', { h: 0, t: 3, o: 0 }], eq: ['[]'], a: [30] }, { pic: ['blocks', { h: 0, t: 1, o: 0 }], eq: ['[]'], a: [10] }, CT(['[]', 20, 30], 10), CT([30, '[]', 50], 10)] },
      p2: { items: [CT(['[]', '[]', 30, 40, '[]'], 10), CT([50, 40, '[]', '[]'], -10), { pic: ['groups', { g: 3, k: 10 }], eq: ['10, 20, []'], a: [30], by: 10 }, { pic: ['groups', { g: 4, k: 10 }], eq: ['10, 20, 30, []'], a: [40], by: 10 }, story('{a} has 2 {conts} of 10 {many}. How many {many}?', '{many}', 20, '2 × 10'), story('{b} has 5 {conts} of 10 {many}. How many {many}?', '{many}', 50, '5 × 10')] },
      p3: { items: [CT([0, '[]', '[]', '[]', '[]', 50], 10), CT([50, '[]', '[]', '[]', '[]', 0], -10), story('{a} has 3 {conts} of 10 {many}. How many?', '{many}', 30, '3 × 10'), story('4 {conts}, 10 {many} in each. How many?', '{many}', 40, '4 × 10'), { eq: ['[] tens = 30', '[] tens = 50'], a: [3, 5] }, { eq: ['2 tens = []', '4 tens = []'], a: [20, 40] }] },
      think: {
        items: [{ q: 'Why is counting by 10s faster than by 1s?', lines: { n: 2, key: 'Each number counts 10 at once, so you say fewer numbers.' } },
          { q: 'How many groups of 10 make 50?', eq: ['[] groups'], a: [5], calc: '50 ÷ 10' },
          { q: '{b} counts: 10, 20, 30, 31. What should come after 30?', eq: ['[]'], a: [40], calc: '30 + 10' },
          { q: 'Draw 3 tens of 10. How many?', calc: '10 + 10 + 10', draw: { h: 56, key: ['blocks', { h: 0, t: 3, o: 0 }] }, eq: ['[]'], a: [30] }]
      }
    },

    fives: {
      watch: 'mixing counts by 5 with counts by 10. Use hands: each hand is 5.',
      goal: 'I can count by 5s to 50.',
      learn: {
        show: { pic: ['groups', { g: 3, k: 5 }], cap: 'Count the 5s', eq: ['5, 10, 15'] },
        together: [{ pic: ['groups', { g: 4, k: 5 }], eq: ['5, 10, 15, []'], a: [20], by: 5 }, CT([5, 10, '[]', '[]'], 5)],
        cue: 'Each count goes up by 5. The ones end in 5, then 0.',
        own: [CT([5, '[]', '[]'], 5), CT([15, '[]', '[]'], 5), { pic: ['groups', { g: 2, k: 5 }], eq: ['5, []'], a: [10], by: 5 }, CT([30, '[]', '[]'], 5)]
      },
      p1: { show: { eq: ['5, 10, 15, 20, 25'] }, items: [CT([5, 10, 15, '[]'], 5), CT([20, 25, '[]'], 5), CT([35, 40, '[]'], 5), { pic: ['groups', { g: 5, k: 5 }], eq: ['5, 10, 15, 20, []'], a: [25], by: 5 }, CT(['[]', 10, 15], 5), CT([40, '[]', 50], 5)] },
      p2: { items: [CT([10, '[]', '[]', 25, '[]'], 5), CT([25, '[]', '[]', '[]'], 5), CT([50, 45, '[]', '[]'], -5), { pic: ['groups', { g: 6, k: 5 }], eq: ['[]'], a: [30] }, story('{a} has 4 {conts} with 5 {many} in each. How many?', '{many}', 20, '4 × 5'), story('{b} has 7 {conts} with 5 {many} in each. How many?', '{many}', 35, '7 × 5')] },
      p3: { items: [CT([0, '[]', '[]', '[]', '[]', '[]', 30], 5), CT([50, '[]', '[]', '[]', 30], -5), story('A hand has 5 fingers. How many fingers on 6 hands?', 'fingers', 30, '6 × 5'), story('9 {conts} with 5 {many} in each. How many?', '{many}', 45, '9 × 5'), CT([35, '[]', '[]', '[]'], 5), { pic: ['groups', { g: 8, k: 5 }], eq: ['[]'], a: [40] }] },
      think: {
        items: [{ q: 'Is 32 in the count by 5s? Why?', lines: { n: 2, key: 'No. Counts by 5 end in 5 or 0.' } },
          { q: 'Circle the number in the count by 5s.', pick: { opts: ['22', '35', '41'], ans: 1, seq: { from: 0, by: 5 } } },
          { q: 'A hand has 5 fingers. How many hands make 50 fingers?', eq: ['[] hands'], a: [10], calc: '50 ÷ 5' },
          { q: 'Draw 5 hands. Count the fingers by 5s.', draw: { h: 60, key: '5, 10, 15, 20, 25: 25 fingers.' } }]
      }
    },

    twos: {
      watch: 'skipping or adding a number. Whisper the number between, say the next one out loud.',
      goal: 'I can count by 2s to 50.',
      learn: {
        show: { pic: ['groups', { g: 4, k: 2 }], cap: 'Count the pairs', eq: ['2, 4, 6, 8'] },
        together: [{ pic: ['groups', { g: 3, k: 2 }], eq: ['2, 4, []'], a: [6], by: 2 }, CT([2, 4, '[]', '[]'], 2)],
        cue: 'Whisper one number, say the next: 1, 2, 3, 4.',
        own: [CT([6, '[]', '[]'], 2), CT([10, '[]', '[]'], 2), { pic: ['groups', { g: 5, k: 2 }], eq: ['[]'], a: [10] }, CT([14, '[]', '[]'], 2)]
      },
      p1: { show: { eq: ['2, 4, 6, 8, 10'] }, items: [CT([2, 4, 6, '[]'], 2), CT([8, 10, '[]'], 2), CT([12, 14, '[]'], 2), { pic: ['groups', { g: 6, k: 2 }], eq: ['[]'], a: [12] }, CT(['[]', 6, 8], 2), CT([16, '[]', 20], 2)] },
      p2: { items: [CT([20, '[]', '[]', 26], 2), CT([30, '[]', '[]', '[]'], 2), CT([18, 16, '[]', '[]'], -2), { pic: ['groups', { g: 7, k: 2 }], eq: ['[]'], a: [14] }, story('How many socks in 8 pairs?', 'socks', 16, '8 + 8'), story('How many shoes on 9 children?', 'shoes', 18, '9 + 9')] },
      p3: { items: [CT([36, '[]', '[]', '[]', '[]'], 2), CT([50, '[]', '[]', '[]'], -2), CT(['[]', '[]', 44, 46], 2), story('{a} sees 12 pairs of mittens. How many mittens?', 'mittens', 24, '12 + 12'), story('How many eyes on 15 people?', 'eyes', 30, '15 + 15'), CT([21, 23, '[]', '[]'], 2)] },
      think: {
        items: [{ q: 'Count by 2s from 1. What do you see?', eq: ['1, 3, 5, [], []'], a: [7, 9], by: 2 },
          { q: 'Circle the number in the count by 2s from 0.', pick: { opts: ['15', '27', '38'], ans: 2, seq: { from: 0, by: 2 } } },
          { q: 'Why are 2s good for counting socks?', lines: { n: 2, key: 'Socks come in pairs, 2 at a time.' } },
          { q: '{b} counts by 2s: 10, 12, 13. What is wrong?', lines: { n: 1, key: 'After 12 comes 14, not 13.' } }]
      }
    },

    'group-ten': {
      watch: 'wild guesses. Show what 10 looks like first, then ask "How many groups of 10 could fit?"',
      goal: 'I can picture 10 to help me guess how many.',
      learn: {
        show: { pic: ['dots', { t: 10 }], cap: 'This is what 10 looks like', eq: ['about 10'] },
        together: [ES(9, [2, 10, 40]), ES(21, [5, 20, 50])],
        cue: 'Picture a group of 10. How many tens could fit?',
        own: [ES(11, [10, 30, 50]), ES(19, [3, 20, 45]), ES(29, [10, 30, 50]), ES(28, [10, 20, 40])]
      },
      p1: { show: { pic: ['dots', { t: 20 }], eq: ['about 20'] }, items: [ES(10, [10, 30]), ES(30, [10, 30]), ES(12, [10, 40]), ES(41, [10, 40]), ES(18, [20, 50]), ES(48, [20, 50])] },
      p2: { items: [ES(22, [10, 20, 40]), ES(31, [10, 30, 50]), ES(8, [10, 30, 50]), ES(39, [20, 40, 50]), ES(50, [10, 30, 50]), ES(27, [10, 30, 50])] },
      p3: { items: [ES(33, [10, 20, 30, 40]), ES(16, [10, 20, 30, 40]), ES(44, [20, 30, 40, 50]), ES(23, [10, 20, 30, 40]), ES(47, [20, 30, 40, 50]), ES(36, [10, 20, 30, 40])] },
      think: {
        items: [{ q: 'Is a guess of 50 good for these? Why?', pic: ['dots', { t: 12 }], lines: { n: 2, key: 'No. There is about one group of 10, so about 10.' } },
          { q: 'How does knowing 10 help you guess?', lines: { n: 2, key: 'You can see how many groups of 10 would fit.' } },
          { q: 'Draw about 20 dots.', draw: { h: 64, key: 'Any drawing with close to 20 dots.' } },
          ES(40, [10, 20, 40])]
      }
    },

    check: {
      watch: 'changing the guess after counting. A good guess is close, not exact; keep the guess and compare.',
      goal: 'I can guess how many, then count to check.',
      learn: {
        show: { pic: ['dots', { t: 14 }], cap: 'Guess: about 10. Count: 14', eq: ['close guess'] },
        together: [EC(12, [10, 30, 50])],
        cue: 'Guess first. Then count, and see how close you were.',
        own: [EC(8, [10, 40]), EC(21, [20, 50])]
      },
      p1: { show: { pic: ['dots', { t: 11 }], eq: ['guess 10, count 11'] }, items: [EC(9, [10, 30]), EC(18, [20, 50]), EC(13, [10, 40]), EC(31, [10, 30])] },
      p2: { items: [EC(17, [10, 20, 40]), EC(26, [10, 30, 50]), EC(22, [10, 20, 40]), EC(35, [10, 20, 40])] },
      p3: { items: [EC(43, [10, 20, 30, 40]), EC(32, [10, 20, 30, 40]), EC(27, [10, 20, 30, 40]), EC(48, [20, 30, 40, 50])] },
      think: {
        items: [{ q: '{a} guessed 20 and counted 23. Was that a good guess?', lines: { n: 2, key: 'Yes. 20 is close to 23.' } },
          { q: 'Why do we guess before we count?', lines: { n: 2, key: 'A guess helps us see if our count makes sense.' } },
          { q: 'Guess, then count. How many?', pic: D(37), eq: ['[]'], a: [37] },
          { q: 'Draw a set you think has about 30. Count it.', draw: { h: 72, key: 'Any set close to 30, counted correctly.' } }]
      }
    }
  } });
})();
