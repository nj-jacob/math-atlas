/* Grade 2 Patterns and Equality: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea
   of the lessons in chapters/patterns.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Shapes in a pattern: c circle, s square, t triangle, d diamond (C and S shaded).
   Ontario 2020: C1.1 identify and describe repeating elements and operations in patterns; C1.2 create and translate
   patterns; C1.3 determine pattern rules, extend patterns, find missing elements and predict; C1.4 patterns in the number
   line and hundred chart; C2.1 a symbol stands for an unknown; C2.2 equal and not equal, and balancing; C2.3 the equal sign.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function period(s) { for (var p = 1; p < s.length; p++) { var ok = true; for (var i = 0; i < s.length; i++) if (s[i] !== s[i % p]) ok = false; if (ok) return p; } return s.length; }
  /* a row of shapes with n shapes to draw (core: the key also boxes the core) */
  function PT(seq, n, q, core) { var p = period(seq), next = ''; for (var i = 0; i < n; i++) next += seq[(seq.length + i) % p]; return { q: q || 'Draw the next ' + n + '.', pic: ['pat', { seq: seq, blanks: n, next: next, core: core ? p : 0 }] }; }
  function CR(seq) { return PT(seq, 2, 'Box the core. Draw the next 2.', true); }
  /* a count with blanks: list of numbers and '[]', with its step */
  function CT(q, list, by, wide) {
    var first = list.filter(function (v) { return v !== '[]'; })[0], at = list.indexOf(first), a = [];
    var eq = list.map(function (v, i) { var last = i === list.length - 1; if (v === '[]') { a.push(first + (i - at) * by); return last ? '[]' : '[],'; } return last ? String(v) : v + ','; }).join(' ');
    return { q: q, eq: [eq], a: a, by: by, wide: wide };
  }
  var NAMES = { c: 'circle', s: 'square', t: 'triangle', d: 'diamond' };
  /* which shape is in place n? */
  function NTH(seq, n) {
    var opts = [], seen = {};
    seq.split('').forEach(function (c) { if (!seen[c]) { seen[c] = 1; opts.push(NAMES[c]); } });
    return { q: 'Which shape is number ' + n + '?', pic: ['pat', { seq: seq + seq, blanks: 0 }], pick: { opts: opts, ans: opts.indexOf(NAMES[seq[(n - 1) % seq.length]]), nth: { seq: seq, n: n } }, wide: opts.length > 3 };
  }
  /* the rule of a growing or shrinking pattern */
  function RULE(list, opts) { var d = list[1] - list[0], right = d > 0 ? 'add ' + d : 'take away ' + -d; return { q: 'The rule: ' + list.join(', '), pick: { opts: opts, ans: opts.indexOf(right), rule: list } }; }
  function KIND(list) {
    var rep = false;
    for (var p = 1; p < list.length; p++) { var ok = true; for (var i = 0; i < list.length; i++) if (list[i] !== list[i % p]) ok = false; if (ok) { rep = true; break; } }
    return { q: list.join(', '), pick: { opts: ['repeating', 'growing'], ans: rep ? 0 : 1, kind: list } };
  }
  /* rows of a hundred chart: the count shown, and the next 2 to colour and write */
  function HC(from, rows, start, by, q) {
    var shown = [start, start + by], next = [start + 2 * by, start + 3 * by];
    return { q: q, pic: ['hund', { from: from, rows: rows, shade: shown, ask: next }], eq: [shown.join(', ') + ', [], []'], a: next, by: by };
  }
  /* what number does the symbol stand for? */
  function SY(st) {
    var v;
    for (v = 0; v <= 100; v++) { var e = st.replace(/[▲●■★]/g, v).replace(/−/g, '-').split('='); if (Function('return ' + e[0])() === Function('return ' + e[1])()) break; }
    return { q: st, eq: [st.match(/[▲●■★]/)[0] + ' = []'], a: [v], letter: st };
  }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  /* = or ≠ between two sides */
  function NE(l, r) { var f = function (s) { return Function('return ' + s.replace(/−/g, '-'))(); }; return { eq: [l + ' [] ' + r], a: [f(l) === f(r) ? '=' : '≠'] }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }

  S.register('patterns', { code: 'PT', ideas: {

    core: {
      watch: 'calling the first two shapes the core without checking. Box the core, then check it repeats.',
      goal: 'I can find the part of a pattern that repeats.',
      learn: {
        show: { pic: ['pat', { seq: 'csscss', blanks: 0 }], cap: 'Circle, square, square: again and again', eq: ['core: ○ □ □'] },
        together: [CR('ctct'), CR('sstsst')],
        cue: 'The core is the shortest part that repeats.',
        own: [CR('cdcd'), CR('tcctcc'), CR('sctsct'), CR('ddsdds')]
      },
      p1: {
        show: { pic: ['pat', { seq: 'stst', blanks: 0 }], cap: 'Square, triangle, again', eq: ['core: □ △'] },
        items: [CR('cscs'), CR('tdtd'), CR('ccsccs'), CR('stcstc'), PT('dsds', 2), PT('ctcctc', 2)]
      },
      p2: {
        items: [CR('cstcst'), CR('ddtddt'), CR('scCscC'), PT('tsstss', 3), PT('cddcdd', 3), CR('cttctt')]
      },
      p3: {
        items: [CR('csdtcsdt'), CR('sstcsstc'), PT('cCsscCss', 3), PT('tdddtddd', 3),
          { q: 'Circle the pattern with a core of 2.', pick: { opts: ['○□○□○□', '○□□○□□', '○○□○○□'], ans: 0, core: 2 }, wide: true },
          { q: 'Circle the pattern with a core of 3.', pick: { opts: ['△○△○△○', '□□△□□△', '○○○○○○'], ans: 1, core: 3 }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says the core of ○○□○○□ is ○○. Is {a} right? Why?', lines: { n: 2, key: 'No. ○○ is followed by □. The core is ○○□.' } },
          { q: 'Make a pattern with a core of 3 shapes. Draw it twice.', draw: { h: 60, key: 'For example: ○ ○ □ ○ ○ □.' } },
          { q: 'Why is it useful to know the core?', lines: { n: 2, key: 'You can keep repeating it to find what comes next.' } },
          { q: 'Find a pattern around you. What is its core?', lines: { n: 2, key: 'For example: a striped shirt, red then white.' } }]
      }
    },

    place: {
      watch: 'drawing every shape to find the 12th. Count in cores to get close.',
      goal: 'I can predict a shape further on.',
      learn: {
        show: { pic: ['pat', { seq: 'cstcst', blanks: 0 }], cap: 'A core of 3: places 3, 6, 9 are triangles', eq: ['place 10: circle'] },
        together: [NTH('cs', 10), NTH('cst', 9)],
        cue: 'Count by the length of the core. Every core ends with the same shape.',
        own: [NTH('cs', 7), NTH('cst', 10)]
      },
      p1: {
        show: { pic: ['pat', { seq: 'stst', blanks: 0 }], cap: 'Even places are triangles', eq: ['place 8: triangle'] },
        items: [NTH('cs', 8), NTH('st', 11), NTH('tc', 14), NTH('cst', 6), NTH('dsc', 7), NTH('cs', 15)]
      },
      p2: {
        items: [NTH('cst', 12), NTH('cst', 14), NTH('sdc', 11), NTH('tsc', 18), NTH('ccs', 9), NTH('dds', 13)]
      },
      p3: {
        items: [NTH('cstd', 10), NTH('ccss', 12), NTH('cst', 20),
          { q: 'The core ○□ has 2 shapes. How many circles in the first 10 shapes?', eq: ['[] circles'], a: [5], calc: '10 / 2' }, { q: 'The core ○□△ has 3 shapes. How many triangles in the first 12 shapes?', eq: ['[] triangles'], a: [4], calc: '12 / 3' }]
      },
      think: {
        items: [{ q: 'In ○□○□ ..., what is shape 20? How do you know?', lines: { n: 2, key: 'A square. Even places are squares.' } },
          { q: '{b} says shape 9 of △○□△○□ is a circle. Is {b} right? Why?', lines: { n: 2, key: 'No. 9 ends the third core of 3, so it is a square.' } },
          { q: 'Make a pattern where shape 10 is a star.', lines: { n: 2, key: 'For example: circle, star, circle, star (even places are stars).' } },
          { q: 'How did you find the shape without drawing them all?', lines: { n: 2, key: 'Count by the core length: 3, 6, 9, then one more.' } }]
      }
    },

    translate: {
      watch: 'copying the shapes instead of the pattern. Name the core with letters (A B B), then show it a new way.',
      goal: 'I can show the same pattern in a new way.',
      learn: {
        show: { pic: ['pat', { seq: 'cssc' + 'ss', blanks: 0 }], cap: 'circle, square, square', eq: ['A B B A B B'] },
        together: [{ q: 'Write ○△○△ with letters.', lines: { n: 1, key: 'A B A B' } }, { q: 'Write □□○□□○ with letters.', lines: { n: 1, key: 'A A B A A B' } }],
        cue: 'Give each different shape a letter.',
        own: [{ q: 'Write △○○△○○ with letters.', lines: { n: 1, key: 'A B B A B B' } }, { q: 'Draw A B A B with shapes.', draw: { h: 40, key: 'For example: ○□○□.' } },
          { q: 'Draw A A B A A B with shapes.', draw: { h: 40, key: 'For example: △△○△△○.' } }, { q: 'Write clap, snap, snap, clap, snap, snap with letters.', lines: { n: 1, key: 'A B B A B B' } }]
      },
      p1: {
        show: { cap: 'Red, blue, red, blue', eq: ['A B A B'] },
        items: [{ q: 'Write □△□△ with letters.', lines: { n: 1, key: 'A B A B' } }, { q: 'Write ○○△○○△ with letters.', lines: { n: 1, key: 'A A B A A B' } },
          { q: 'Write ◇○○◇○○ with letters.', lines: { n: 1, key: 'A B B A B B' } }, { q: 'Draw A B B A B B with shapes.', draw: { h: 40, key: 'For example: ○□□○□□.' } },
          { q: 'Draw A B C A B C with shapes.', draw: { h: 40, key: 'For example: ○□△○□△.' } }, { q: 'Write jump, hop, jump, hop with letters.', lines: { n: 1, key: 'A B A B' } }]
      },
      p2: {
        items: [{ q: 'Write ○□△○□△ with letters.', lines: { n: 1, key: 'A B C A B C' } }, { q: 'Show A A B as sounds.', lines: { n: 1, key: 'For example: tap, tap, clap.' } },
          { q: 'Circle the pattern that is A B B.', pick: { opts: ['○□○□○□', '△○○△○○', '□□○□□○'], ans: 1, struct: 'ABB' }, wide: true },
          { q: 'Show A B A B with numbers.', lines: { n: 1, key: 'For example: 1, 2, 1, 2.' } },
          { q: 'Write 5, 9, 9, 5, 9, 9 with letters.', lines: { n: 1, key: 'A B B A B B' } }]
      },
      p3: {
        items: [{ q: 'Write ○○□△○○□△ with letters.', lines: { n: 1, key: 'A A B C A A B C' } }, { q: 'Draw 2, 4, 4, 2, 4, 4 as shapes.', draw: { h: 40, key: 'For example: ○□□○□□.' } },
          { q: 'Circle the pattern that is A B C.', pick: { opts: ['○□○□○□', '○□△○□△', '○○□○○□'], ans: 1, struct: 'ABC' }, wide: true },
          { q: 'Make an A A B B pattern with actions.', lines: { n: 1, key: 'For example: clap, clap, stomp, stomp.' } },
          { q: 'Do ○□□ and 7, 3, 3 have the same pattern? Why?', lines: { n: 2, key: 'Yes. Both are A B B.' } }]
      },
      think: {
        items: [{ q: '{b} says ○□○□ and △◇△◇ are the same pattern. Is {b} right? Why?', lines: { n: 2, key: 'Yes. They look different, but both are A B A B.' } },
          { q: 'Show one pattern three ways: shapes, letters and actions.', lines: { n: 3, key: 'For example: ○□□, A B B, clap snap snap.' } },
          { q: 'Why do we use letters to describe a pattern?', lines: { n: 2, key: 'Letters show how it repeats, so we can compare patterns that look different.' } },
          { q: 'Make an A B B pattern with colours.', lines: { n: 1, key: 'For example: red, blue, blue, red, blue, blue.' } }]
      }
    },

    rule: {
      watch: 'adding to the first number each time. Use the rule on the number just before.',
      goal: 'I can find and use a pattern rule.',
      learn: {
        show: { cap: 'Start at 4. Add 5 each time.', eq: ['4, 9, 14, 19'] },
        together: [CT('Start at 2. Add 4.', [2, 6, '[]', '[]'], 4), RULE([40, 35, 30, 25], ['add 5', 'take away 5', 'take away 10'])],
        cue: 'Find the change from each number to the next.',
        own: [CT('Start at 3. Add 2.', [3, '[]', '[]', '[]'], 2), CT('Start at 50. Take away 10.', [50, '[]', '[]', '[]'], -10),
          RULE([5, 8, 11, 14], ['add 3', 'add 5', 'add 8']), KIND([2, 4, 6, 8, 10])]
      },
      p1: {
        show: { cap: '6, 8, 10, 12', eq: ['Start at 6. Add 2.'] },
        items: [CT('Start at 5. Add 5.', [5, '[]', '[]', '[]'], 5), CT('Start at 1. Add 3.', [1, '[]', '[]', '[]'], 3),
          CT('Start at 20. Take away 2.', [20, '[]', '[]', '[]'], -2), RULE([10, 20, 30, 40], ['add 10', 'add 20', 'add 1']),
          RULE([30, 27, 24, 21], ['take away 3', 'add 3', 'take away 6']), KIND([1, 2, 1, 2, 1, 2])]
      },
      p2: {
        items: [CT('Start at 9. Add 6.', [9, '[]', '[]', '[]'], 6), CT('Start at 80. Take away 5.', [80, '[]', '[]', '[]'], -5),
          CT('Start at 25. Add 25.', [25, '[]', '[]', '[]'], 25), RULE([12, 22, 32, 42], ['add 2', 'add 12', 'add 10']),
          story('{a} has 6 {many} and gets 3 more each day. How many after 4 days?', '{many}', 18, '6 + 3 + 3 + 3 + 3'), KIND([5, 10, 15, 20])]
      },
      p3: {
        items: [CT('Start at 13. Add 11.', [13, '[]', '[]', '[]'], 11), CT('Start at 100. Take away 20.', [100, '[]', '[]', '[]'], -20),
          RULE([50, 100, 150, 200], ['add 50', 'add 100', 'add 5']), RULE([95, 86, 77, 68], ['take away 9', 'take away 8', 'add 9']),
          story('{b} has 40 {many} and gives away 5 each day. How many after 3 days?', '{many}', 25, '40 − 5 − 5 − 5'), KIND([3, 6, 3, 6, 3, 6])]
      },
      think: {
        items: [{ q: '{a} used "add 3" from 2 and wrote 2, 5, 8, 10. What went wrong?', lines: { n: 2, key: '8 + 3 is 11, not 10.' } },
          { q: 'Make a pattern with the rule "add 6". Write 5 numbers.', lines: { n: 1, key: 'For example: 1, 7, 13, 19, 25.' } },
          { q: 'How is a growing pattern different from a repeating one?', lines: { n: 2, key: 'A growing pattern changes by the same amount each time. A repeating one has a core that comes again.' } },
          { q: 'Draw a growing pattern of dots: 1, 3, 5, 7.', draw: { h: 60, key: '1 dot, 3 dots, 5 dots, 7 dots.' } }]
      }
    },

    missing: {
      watch: 'guessing a missing number from one neighbour. Find the rule first, then check it on both sides.',
      goal: 'I can find missing numbers in a pattern.',
      learn: {
        show: { cap: 'The rule adds 5', eq: ['5, 10, 15, 20'] },
        together: [CT('', [4, '[]', 12, 16], 4), CT('', [30, 25, '[]', 15], -5)],
        cue: 'Find the rule from two numbers side by side. Use it to fill the gap.',
        own: [CT('', [2, 4, '[]', 8], 2), CT('', [10, '[]', 30, 40], 10), CT('', [18, 15, '[]', 9], -3), CT('', ['[]', 7, 10, 13], 3)]
      },
      p1: {
        show: { cap: 'The rule takes away 2', eq: ['20, 18, 16, 14'] },
        items: [CT('', [3, 6, '[]', 12], 3), CT('', [25, 50, '[]', 100], 25), CT('', [40, '[]', 20, 10], -10),
          CT('', [7, 9, '[]', 13], 2), CT('', ['[]', 15, 20, 25], 5), CT('', [60, 55, '[]', 45], -5)]
      },
      p2: {
        items: [CT('', [11, '[]', 31, '[]'], 10), CT('', [5, '[]', '[]', 20], 5), CT('', [90, '[]', 70, '[]'], -10),
          CT('', [2, '[]', 8, '[]'], 3), CT('', [100, '[]', '[]', 85], -5), CT('', ['[]', 24, 28, '[]'], 4)]
      },
      p3: {
        items: [CT('', [120, '[]', 140, '[]'], 10), CT('', [150, '[]', '[]', 225], 25), CT('', [99, '[]', 79, '[]'], -10),
          CT('', ['[]', 33, 44, '[]'], 11), CT('', [200, '[]', '[]', 140], -20), CT('', [6, '[]', '[]', 18], 4)]
      },
      think: {
        items: [{ q: '{b} filled 5, 10, [], 20 with 11. What went wrong?', lines: { n: 2, key: '{b} added 1. The rule is add 5: the gap is 15.' } },
          { q: 'Make a pattern with a gap for a friend to fill.', lines: { n: 2, key: 'For example: 8, 12, [], 20 (16).' } },
          { q: 'How can you check the number you put in the gap?', lines: { n: 2, key: 'The rule must work from it to the next number too.' } },
          { q: 'Two numbers are missing: 3, [], [], 12. How did you find them?', lines: { n: 2, key: '3 to 12 is 9 in 3 jumps, so add 3: 6 and 9.' } }]
      }
    },

    chart: {
      watch: 'counting squares across when adding 10. Adding 10 goes straight down one row.',
      goal: 'I can see patterns on a hundred chart.',
      learn: {
        show: { pic: ['hund', { from: 1, rows: 2, shade: [5, 10, 15, 20] }], cap: 'Counting by 5s makes two columns', eq: ['5, 10, 15, 20'] },
        together: [HC(1, 4, 3, 10, 'Add 10. Colour the next 2.')],
        cue: 'Add 10: straight down. Add 1: one step right.',
        own: [HC(1, 1, 2, 2, 'Count by 2s. Colour the next 2.'), HC(51, 4, 54, 10, 'Add 10. Colour the next 2.')]
      },
      p1: {
        show: { cap: 'Adding 10 goes down one row', eq: ['24, 34, 44'] },
        items: [HC(1, 2, 5, 5, 'Count by 5s.'), HC(1, 4, 7, 10, 'Add 10.'), HC(101, 4, 103, 10, 'Add 10.'), HC(1, 1, 1, 3, 'Count by 3s.'), { eq: ['58 + 10 = []'], a: [68] }, { eq: ['91 − 10 = []'], a: [81] }]
      },
      p2: {
        items: [{ eq: ['46 + 10 = []'], a: [56] }, { eq: ['73 − 10 = []'], a: [63] }, { eq: ['128 + 10 = []'], a: [138] }, { eq: ['150 − 10 = []'], a: [140] },
          HC(51, 4, 90, -10, 'Take away 10.'), HC(131, 2, 150, -5, 'Count back by 5s.')]
      },
      p3: {
        items: [HC(111, 4, 112, 10, 'Add 10.'), HC(1, 2, 4, 4, 'Count by 4s.'),
          { eq: ['37 + 20 = []'], a: [57] }, { eq: ['165 − 30 = []'], a: [135] },
          { q: 'On a hundred chart, the number just below 68 is 10 more. What is it?', eq: ['[]'], a: [78], calc: '68 + 10' }, { q: 'The number just above 141 is 10 less. What is it?', eq: ['[]'], a: [131], calc: '141 - 10' }]
      },
      think: {
        items: [{ q: 'Why does adding 10 go straight down on a hundred chart?', lines: { n: 2, key: 'Each row has 10 numbers, so 10 more is one row down.' } },
          { q: '{a} says counting by 2s makes a column. Is {a} right?', lines: { n: 2, key: 'No. Counting by 2s colours every second square in each row: 5 columns.' } },
          { q: 'What pattern do the numbers ending in 0 make?', lines: { n: 2, key: 'One column at the right: 10, 20, 30 ... add 10.' } },
          { q: 'Start at 15. Count by 10s. What do the numbers have the same?', lines: { n: 2, key: 'They all end in 5: 15, 25, 35, 45.' } }]
      }
    },

    box: {
      watch: 'adding all the numbers you see. Ask what number makes the sentence true.',
      goal: 'I can find the number a box stands for.',
      learn: {
        show: { cap: 'What makes it true?', eq: ['7 + 5 = 12'] },
        together: [{ eq: ['6 + [] = 10'], a: [4] }, { eq: ['[] − 3 = 8'], a: [11] }],
        cue: 'Count on or think of the fact family.',
        own: [{ eq: ['9 + [] = 15'], a: [6] }, { eq: ['[] + 4 = 13'], a: [9] }, { eq: ['14 − [] = 7'], a: [7] }, { eq: ['20 = [] + 12'], a: [8] }]
      },
      p1: {
        show: { cap: '8 + 2 = 10', eq: ['8 + 2 = 10'] },
        items: [{ eq: ['5 + [] = 9'], a: [4] }, { eq: ['[] + 6 = 14'], a: [8] }, { eq: ['12 − [] = 5'], a: [7] },
          { eq: ['[] − 4 = 9'], a: [13] }, { eq: ['17 = 9 + []'], a: [8] }, { eq: ['11 = [] + 3'], a: [8] }]
      },
      p2: {
        items: [{ eq: ['30 + [] = 50'], a: [20] }, { eq: ['[] + 25 = 40'], a: [15] }, { eq: ['60 − [] = 45'], a: [15] }, { eq: ['[] − 10 = 34'], a: [44] },
          story('{a} has some {many}. {a} gets 6 more and now has 15. How many at first?', '{many}', 9, '15 − 6'), story('{b} had 18 {many} and gave some away. 11 are left. How many were given away?', '{many}', 7, '18 − 11')]
      },
      p3: {
        items: [{ eq: ['48 + [] = 60'], a: [12] }, { eq: ['[] − 25 = 25'], a: [50] }, { eq: ['100 = [] + 65'], a: [35] }, { eq: ['72 − [] = 50'], a: [22] },
          SY('● + 7 = 16'), SY('15 − ● = 9')]
      },
      think: {
        items: [{ q: '{b} wrote 8 + [] = 13 and put 21. What went wrong?', lines: { n: 2, key: '{b} added 8 and 13. 8 + 5 = 13, so the box is 5.' } },
          { q: 'Write a story for [] + 4 = 10.', lines: { n: 2, key: 'For example: {a} had some {many}, got 4 more and now has 10. (6)' } },
          { q: 'Can the box be more than one number in 5 + [] = 12? Why?', lines: { n: 2, key: 'No. Only 7 makes it true.' } },
          { q: 'Make a box sentence where the box is 9.', lines: { n: 1, key: 'For example: [] + 3 = 12.' } }]
      }
    },

    same: {
      watch: 'giving the same symbol two different numbers. In one sentence, the same symbol is the same number.',
      goal: 'I can find numbers for the same symbol.',
      learn: {
        show: { cap: '▲ + ▲ = 10', eq: ['▲ = 5'] },
        together: [SY('▲ + ▲ = 8'), SY('● + ● = 14')],
        cue: 'Each symbol is the same number. Try a double.',
        own: [SY('■ + ■ = 6'), SY('▲ + ▲ = 12'), SY('● + ● + ● = 9'), SY('★ + ★ = 20')]
      },
      p1: {
        show: { cap: '● + ● = 4', eq: ['● = 2'] },
        items: [SY('▲ + ▲ = 2'), SY('■ + ■ = 16'), SY('● + ● = 18'), SY('★ + ★ = 10'), SY('▲ + ▲ + ▲ = 12'), SY('■ + ■ = 30')]
      },
      p2: {
        items: [SY('● + ● = 40'), SY('▲ + ▲ = 50'), SY('■ + 3 = 10'), SY('★ − 4 = 6'),
          { q: '▲ + ▲ = 10 and ▲ + ● = 8. What is ●?', eq: ['● = []'], a: [3], letter: '5 + ● = 8' }, { q: '■ + ■ = 12 and ■ + ★ = 10. What is ★?', eq: ['★ = []'], a: [4], letter: '6 + ★ = 10' }]
      },
      p3: {
        items: [SY('● + ● = 24'), SY('▲ + ▲ + ▲ = 15'), SY('■ + ■ + ■ = 30'), SY('★ + ★ = 100'),
          { q: '● + ● = 10. Is ● 5?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '5 + 5 = 10' }, { q: 'Can ▲ + ▲ = 7 with a whole number? Why?', lines: { n: 2, key: 'No. A double is always even, and 7 is odd.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says ● + ● = 10 could be 4 and 6. What would you tell {a}?', lines: { n: 2, key: 'Both ● must be the same number: 5 and 5.' } },
          { q: 'Make up a puzzle like ▲ + ▲ = 16.', lines: { n: 1, key: 'For example: ■ + ■ = 18 (■ = 9).' } },
          { q: 'In ▲ + ● = 10, must ▲ and ● be the same? Why?', lines: { n: 2, key: 'No. Different symbols can be different numbers, like 3 and 7.' } },
          { q: 'How do doubles facts help with these puzzles?', lines: { n: 2, key: 'A symbol plus itself is a double: 7 + 7 = 14, so the symbol is 7.' } }]
      }
    },

    equals: {
      watch: 'reading = as "the answer is". It means both sides are the same amount.',
      goal: 'I can tell if both sides are equal.',
      learn: {
        show: { pic: ['balance', { l: '5 + 3', r: '4 + 4', tilt: 0 }], cap: 'Both sides are 8', eq: ['5 + 3 = 4 + 4'] },
        together: [NE('6 + 2', '5 + 3'), NE('7 + 1', '4 + 5')],
        cue: 'Work out each side. Same amount: =. Not the same: ≠.',
        own: [NE('9 + 1', '5 + 5'), NE('3 + 4', '8 − 2'), NE('10 − 3', '7'), NE('6 + 6', '10 + 3')]
      },
      p1: {
        show: { cap: '9 + 1 and 2 + 8 are both 10', eq: ['9 + 1 = 2 + 8'] },
        items: [NE('4 + 3', '5 + 2'), NE('8 + 2', '6 + 3'), NE('12', '6 + 6'), NE('9 − 4', '3 + 2'), NE('7 + 7', '10 + 5'), NE('15 − 5', '8 + 2')]
      },
      p2: {
        items: [TF('6 + 4 = 4 + 6', true), TF('10 = 3 + 7', true), TF('8 + 5 = 13 + 2', false), TF('9 − 3 = 5 + 1', true),
          { q: 'Which side goes down?', pic: ['balance', { l: '8 + 3', r: '6 + 4', tilt: 0 }], pick: { opts: ['left', 'right'], ans: 0, heavy: ['8 + 3', '6 + 4'] } },
          { q: 'Which side goes down?', pic: ['balance', { l: '5 + 5', r: '9 + 2', tilt: 0 }], pick: { opts: ['left', 'right'], ans: 1, heavy: ['5 + 5', '9 + 2'] } }]
      },
      p3: {
        items: [NE('20 + 30', '25 + 25'), NE('40 − 10', '15 + 20'), NE('18 + 2', '10 + 10'), NE('50', '60 − 15'),
          NE('7 + 8', '10 + 5'), { q: '{a} wrote 4 + 5 = 9 + 2 = 11. Is the first = true?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '4 + 5 = 9 + 2', wide: true }]
      },
      think: {
        items: [{ q: '{b} says 3 + 4 = 7 + 2 because 3 + 4 is 7. What went wrong?', lines: { n: 2, key: 'Both sides must be the same: 7 is not 9.' } },
          { q: 'Write two sides that are equal, both with + .', lines: { n: 1, key: 'For example: 6 + 4 = 7 + 3.' } },
          { q: 'Is 10 = 10 a true sentence? Why?', lines: { n: 2, key: 'Yes. Both sides are the same amount.' } },
          { q: 'How is = like a level balance?', lines: { n: 2, key: 'Both sides hold the same amount, so it does not tip.' } }]
      }
    },

    balance: {
      watch: 'putting the answer of one side in the box. The box makes both sides the same.',
      goal: 'I can make both sides equal.',
      learn: {
        show: { pic: ['balance', { l: '8 + 4', r: '10 + 2', tilt: 0 }], cap: 'Left is 12, so right must be 12', eq: ['8 + 4 = 10 + 2'] },
        together: [{ pic: ['balance', { l: '6 + 4', r: '5 + ?', tilt: 0 }], eq: ['6 + 4 = 5 + []'], a: [5] }, { eq: ['7 + 6 = [] + 3'], a: [10] }],
        cue: 'Work out the full side. Then find what makes the other side match.',
        own: [{ eq: ['9 + 3 = 10 + []'], a: [2] }, { eq: ['5 + 5 = 8 + []'], a: [2] }, { eq: ['12 − 2 = 6 + []'], a: [4] }, { eq: ['[] + 7 = 9 + 4'], a: [6] }]
      },
      p1: {
        show: { pic: ['balance', { l: 5, r: 5, tilt: 0 }], cap: '5 cubes and 5 cubes', eq: ['5 = 5'] },
        items: [{ eq: ['4 + 4 = 6 + []'], a: [2] }, { eq: ['3 + 7 = [] + 5'], a: [5] }, { eq: ['8 + 6 = 10 + []'], a: [4] }, { eq: ['[] + 9 = 7 + 8'], a: [6] },
          { eq: ['6 + 6 = [] + 2'], a: [10] }, { eq: ['9 + 8 = 10 + []'], a: [7] }]
      },
      p2: {
        items: [{ eq: ['20 + 10 = 25 + []'], a: [5] }, { eq: ['15 + 5 = [] + 10'], a: [10] }, { eq: ['18 − 8 = 4 + []'], a: [6] }, { eq: ['[] − 5 = 7 + 3'], a: [15] },
          story('{a} has 14 {many} and {b} has 9. How many more does {b} need to have the same?', '{many}', 5, '14 − 9'), story('{a} has 7 + 6 {many}. {b} has 10. How many more does {b} need?', '{many}', 3, '7 + 6 − 10')]
      },
      p3: {
        items: [{ eq: ['36 + 9 = 40 + []'], a: [5] }, { eq: ['25 + 25 = [] + 30'], a: [20] }, { eq: ['50 − [] = 20 + 10'], a: [20] }, { eq: ['[] + 17 = 20 + 7'], a: [10] },
          { q: 'Which side goes down?', pic: ['balance', { l: '9 + 9', r: '10 + 7', tilt: 0 }], pick: { opts: ['left', 'right'], ans: 0, heavy: ['9 + 9', '10 + 7'] } },
          { q: 'Which side goes down?', pic: ['balance', { l: '20 + 5', r: '15 + 15', tilt: 0 }], pick: { opts: ['left', 'right'], ans: 1, heavy: ['20 + 5', '15 + 15'] } }]
      },
      think: {
        items: [{ q: '{b} wrote 9 + 4 = [] + 6 and put 13. What went wrong?', lines: { n: 2, key: '13 + 6 is 19, not 13. The box is 7.' } },
          { q: 'Find three ways to balance 20 = [] + [].', lines: { n: 2, key: 'For example: 10 + 10, 15 + 5, 19 + 1.' } },
          { q: 'The balance is level. What could each side hold?', pic: ['balance', { l: '?', r: '?', tilt: 0 }], lines: { n: 2, key: 'Any two sides of the same amount, like 7 + 8 and 10 + 5.' } },
          { q: 'How do you check your box number?', lines: { n: 2, key: 'Put it in and work out both sides. They must be the same.' } }]
      }
    }
  } });
})();
