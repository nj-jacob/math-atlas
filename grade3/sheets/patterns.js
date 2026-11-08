/* Grade 3 Patterns, Equations and Code: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per
   idea of the lessons in chapters/patterns.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Shapes in a pattern: c circle, s square, t triangle, d diamond (C and S shaded), and > v < ^ arrows.
   Robot code: "move 3", "turn right", "turn left", "repeat 2: ..." (repeats the rest), from a start square and facing.
   Ontario 2020: C1.1 identify and describe patterns; C1.2 represent patterns; C1.3 extend and create patterns, find missing
   elements; C1.4 patterns in the number line and hundreds charts to 1000; C2.1 variables; C2.2 equal and not equal;
   C2.3 equations with whole numbers to 50; C3.1 code with sequential, concurrent and repeating events; C3.2 read and alter code.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* the part of a repeating pattern that repeats */
  function period(s) { for (var p = 1; p < s.length; p++) { var ok = true; for (var i = 0; i < s.length; i++) if (s[i] !== s[i % p]) ok = false; if (ok) return p; } return s.length; }
  /* a row of shapes with n shapes to draw (core: the key also boxes the core) */
  function PT(seq, n, q, core) { var p = period(seq), next = ''; for (var i = 0; i < n; i++) next += seq[(seq.length + i) % p]; return { q: q || 'Draw the next ' + n + '.', pic: ['pat', { seq: seq, blanks: n, next: next, core: core ? p : 0 }] }; }
  /* box the core and draw the next 2 */
  function CR(seq) { return PT(seq, 2, 'Circle the core. Draw the next 2.', true); }
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
  /* the rule of a growing pattern */
  function RULE(list, opts) { var d = list[1] - list[0], right = d > 0 ? 'add ' + d : 'take away ' + -d; return { q: 'Circle the rule: ' + list.join(', '), pick: { opts: opts, ans: opts.indexOf(right), rule: list }, wide: true }; }
  /* repeating or growing? */
  function KIND(list) {
    var rep = false;
    for (var p = 1; p < list.length; p++) { var ok = true; for (var i = 0; i < list.length; i++) if (list[i] !== list[i % p]) ok = false; if (ok) { rep = true; break; } }
    return { q: list.join(', '), pick: { opts: ['repeating', 'growing'], ans: rep ? 0 : 1, kind: list } };
  }
  /* a table that grows by the same amount; rows is [[step, value or '[]'], ...] */
  function TG(head, rows, q) { var k = rows.filter(function (r) { return r[1] !== '[]'; }), d = (k[1][1] - k[0][1]) / (k[1][0] - k[0][0]), a = []; rows.forEach(function (r) { if (r[1] === '[]') a.push(k[0][1] + (r[0] - k[0][0]) * d); }); return { q: q, pic: ['table', { head: head, rows: rows, diff: true }], a: a }; }
  /* a number machine: in and out with a rule such as '+ 3' */
  function MC(rule, ins, blanksAt) {
    var a = [], rows = ins.map(function (n, i) { var out = Function('return ' + n + ' ' + rule.replace('×', '*').replace('−', '-') + ';')(); if (blanksAt.indexOf(i) >= 0) { a.push(out); return [n, '[]']; } return [n, out]; });
    return { q: 'The machine does ' + rule + '.', pic: ['table', { head: ['In', 'Out'], rows: rows, rule: rule }], a: a };
  }
  /* what number does the letter stand for? */
  function LT(st) {
    var L = st.match(/\b[a-z]\b/)[0], v;
    for (v = 0; v <= 100; v++) { var e = st.replace(/\b[a-z]\b/g, v).replace(/×/g, '*').replace(/−/g, '-').split('='); if (Function('return ' + e[0])() === Function('return ' + e[1])()) break; }
    return { q: st + '. What is ' + L + '?', eq: ['[]'], a: [v], letter: st };
  }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st }; }
  /* = or ≠ between two sides */
  function NE(l, r) { var f = function (s) { return Function('return ' + s.replace(/×/g, '*').replace(/−/g, '-'))(); }; return { eq: [l + ' [] ' + r], a: [f(l) === f(r) ? '=' : '≠'] }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }

  /* robots: a map with marks A, B, C ...; run code to find the squares it passes (for the key) */
  function run(start, code) {
    var D = ['>', 'v', '<', '^'], st = { '>': [1, 0], 'v': [0, 1], '<': [-1, 0], '^': [0, -1] }, x = start[0], y = start[1], d = D.indexOf(start[2]), path = [[x, y]];
    function go(list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i].trim();
        if (!c) continue;
        var rep = c.match(/^repeat (\d+)(?: times)?:\s*(.*)$/), mv = c.match(/^move (\d+)$/);
        if (rep) { var body = [rep[2]].concat(list.slice(i + 1)); for (var k = 0; k < +rep[1]; k++) go(body); return; }
        if (mv) for (var j = 0; j < +mv[1]; j++) { x += st[D[d]][0]; y += st[D[d]][1]; path.push([x, y]); }
        else if (c === 'turn right') d = (d + 1) % 4; else if (c === 'turn left') d = (d + 3) % 4;
      }
    }
    go(code.split(','));
    return path;
  }
  function map(start, marks, code, cols, rows) { return ['map', { cols: cols || 7, rows: rows || 5, u: 16, marks: marks, start: start, path: code ? run(start, code) : null }]; }
  /* where does the robot stop? */
  function GO(start, marks, code, cols, rows) {
    var opts = marks.map(function (m) { return m[2]; });
    var p = run(start, code), end = p[p.length - 1], at = marks.filter(function (m) { return m[0] === end[0] && m[1] === end[1]; })[0];
    return { q: 'Run: ' + code + '. Circle where it stops.', pic: map(start, marks, code, cols, rows), robot: { code: code }, pick: { opts: opts, ans: opts.indexOf(at[2]) } };
  }
  /* fill in the numbers so the robot reaches a mark: tmpl is the code with [] for each number, nums the answers */
  function FILL(start, marks, tmpl, nums, to, cols, rows) {
    var k = 0, code = tmpl.replace(/\[\]/g, function () { return nums[k++]; });
    return { q: 'Fill in the numbers to reach ' + to + '.', pic: map(start, marks, code, cols, rows), robot: { to: to }, eq: rows2(tmpl), a: nums };
  }
  /* one row per step, with each turn kept beside the move after it */
  function rows2(tmpl) {
    var out = [], seg = tmpl.replace(': ', ':, ').split(', ');
    for (var i = 0; i < seg.length; i++) out.push(/^turn/.test(seg[i]) && seg[i + 1] ? seg[i] + ', ' + seg[++i] : seg[i]);
    return out;
  }

  var M1 = [[4, 0, 'A'], [6, 2, 'B'], [2, 4, 'C']], M2 = [[3, 1, 'A'], [6, 4, 'B'], [0, 0, 'C']], M3 = [[5, 0, 'A'], [1, 1, 'B'], [4, 4, 'C']];

  S.register('patterns', { code: 'PT', ideas: {

    core: {
      watch: 'calling the first few shapes the core without checking it repeats. Box the core, then check it fits again and again.',
      goal: 'I can find the part of a pattern that repeats.',
      learn: {
        show: { pic: ['pat', { seq: 'csscss', blanks: 0 }], cap: 'The core is circle, square, square', eq: ['core: ○ □ □'] },
        together: [CR('ctct'), CR('sstsst')],
        cue: 'The core is the shortest part that repeats. Box it, then check the rest.',
        own: [CR('cdcd'), CR('tcctcc'), CR('sctsct'), CR('ddsdds')]
      },
      p1: {
        show: { pic: ['pat', { seq: 'stst', blanks: 0 }], cap: 'Core: square, triangle', eq: ['2 shapes repeat'] },
        items: [CR('cscs'), CR('tdtd'), CR('ccsccs'), CR('stcstc'), PT('dsds', 2), PT('ctcctc', 2)]
      },
      p2: {
        items: [CR('cstcst'), CR('ddtddt'), CR('scCscC'), PT('tsstss', 3), PT('cddcdd', 3), CR('cttctt')]
      },
      p3: {
        items: [CR('csdtcsdt'), CR('sstcsstc'), PT('cCsscCss', 3), PT('tdddtddd', 3),
          { q: 'Make a pattern with a core of 3 shapes. Draw it twice.', draw: { h: 60, key: 'For example: circle, circle, square; circle, circle, square.' } },
          { q: 'Circle the pattern with a core of 2.', pick: { opts: ['○□○□○□', '○□□○□□', '○○□○○□'], ans: 0, core: 2 }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says the core of ○○□○○□ is ○○. Is {a} right? Why?', lines: { n: 2, key: 'No. ○○ is followed by □, not ○○. The core is ○○□.' } },
          { q: 'Make two different patterns with the same core.', draw: { h: 70, key: 'For example: ○△○△ and □□ as colours red, blue, red, blue.' } },
          { q: 'Why is it useful to know the core?', lines: { n: 2, key: 'You can keep repeating it to find any shape in the pattern.' } },
          { q: 'Describe this pattern in words: □□△□□△', lines: { n: 2, key: 'Two squares and a triangle, again and again.' } }]
      }
    },

    forms: {
      watch: 'copying the shapes instead of the structure. Name the core with letters (A B B) first, then show it a new way.',
      goal: 'I can show the same pattern in a new way.',
      learn: {
        show: { pic: ['pat', { seq: 'cssc' + 'ss', blanks: 0 }], cap: 'circle, square, square', eq: ['A B B A B B', 'clap, stomp, stomp …'] },
        together: [{ q: 'Write ○△○△ with letters.', lines: { n: 1, key: 'A B A B' } }, { q: 'Write □□○□□○ with letters.', lines: { n: 1, key: 'A A B A A B' } }],
        cue: 'Give each different shape a letter. The letters show the pattern\'s structure.',
        own: [{ q: 'Write △○○△○○ with letters.', lines: { n: 1, key: 'A B B A B B' } }, { q: 'Draw A B A B with shapes.', draw: { h: 50, key: 'For example: ○□○□.' } },
          { q: 'Draw A A B A A B with shapes.', draw: { h: 50, key: 'For example: △△○△△○.' } }, { q: 'Write clap, snap, snap, clap, snap, snap with letters.', lines: { n: 1, key: 'A B B A B B' } }]
      },
      p1: {
        show: { cap: 'Red, blue, red, blue', eq: ['A B A B'] },
        items: [{ q: 'Write □△□△ with letters.', lines: { n: 1, key: 'A B A B' } }, { q: 'Write ○○△○○△ with letters.', lines: { n: 1, key: 'A A B A A B' } },
          { q: 'Write ◇○○◇○○ with letters.', lines: { n: 1, key: 'A B B A B B' } }, { q: 'Draw A B B A B B with shapes.', draw: { h: 50, key: 'For example: ○□□○□□.' } },
          { q: 'Draw A B C A B C with shapes.', draw: { h: 50, key: 'For example: ○□△○□△.' } }, { q: 'Write jump, hop, jump, hop with letters.', lines: { n: 1, key: 'A B A B' } }]
      },
      p2: {
        items: [{ q: 'Write ○□△△○□△△ with letters.', lines: { n: 1, key: 'A B C C A B C C' } }, { q: 'Show A A B as sounds.', lines: { n: 1, key: 'For example: tap, tap, clap.' } },
          { q: 'Circle the pattern that is A B B.', pick: { opts: ['○□○□○□', '△○○△○○', '□□○□□○'], ans: 1, struct: 'ABB' }, wide: true },
          { q: 'Show A B A B with numbers.', lines: { n: 1, key: 'For example: 1, 2, 1, 2.' } },
          { q: 'Write 5, 9, 9, 5, 9, 9 with letters.', lines: { n: 1, key: 'A B B A B B' } }, { q: 'Draw □○○ as a new pattern with letters and shapes.', draw: { h: 50, key: 'A B B: for example △◇◇△◇◇.' } }]
      },
      p3: {
        items: [{ q: 'Write ○○□△○○□△ with letters.', lines: { n: 1, key: 'A A B C A A B C' } }, { q: 'Write 2, 4, 4, 2, 4, 4 as shapes.', draw: { h: 50, key: 'For example: ○□□○□□.' } },
          { q: 'Circle the pattern that is A B C.', pick: { opts: ['○□○□○□', '○□△○□△', '○○□○○□'], ans: 1, struct: 'ABC' }, wide: true },
          { q: 'Make an A A B B pattern with actions.', lines: { n: 1, key: 'For example: clap, clap, stomp, stomp.' } },
          { q: 'Do ○□□ and 7, 3, 3 have the same structure? Why?', lines: { n: 2, key: 'Yes. Both are A B B.' } }, { q: 'Show A B B C as colours.', lines: { n: 1, key: 'For example: red, blue, blue, green.' } }]
      },
      think: {
        items: [{ q: '{b} says ○□○□ and △◇△◇ are the same pattern. Is {b} right? Why?', lines: { n: 2, key: 'Yes. They look different, but both are A B A B.' } },
          { q: 'Show one pattern in three ways: shapes, letters and actions.', lines: { n: 3, key: 'For example: ○□□, A B B, clap snap snap.' } },
          { q: 'Why do we use letters to describe a pattern?', lines: { n: 2, key: 'Letters show the structure, so we can compare patterns that look different.' } },
          { q: 'Make an A B B A pattern. What is its core?', lines: { n: 2, key: 'For example ○□□○, ○□□○: core A B B A.' } }]
      }
    },

    turns: {
      watch: 'turning the wrong way. Point a finger like the arrow and turn it the same way each time.',
      goal: 'I can continue a pattern that turns.',
      learn: {
        show: { pic: ['pat', { seq: '>v<^', blanks: 0 }], cap: 'A quarter turn right each time', eq: ['→ ↓ ← ↑'] },
        together: [PT('>v<^>v', 2), PT('^>^>', 2)],
        cue: 'Look at how much it turns each time, and which way. Keep turning the same.',
        own: [PT('>v<^>v', 2), PT('><><', 2), PT('^<v>^<', 2), PT('v^v^', 2)]
      },
      p1: {
        show: { pic: ['pat', { seq: '><><', blanks: 0 }], cap: 'A half turn each time', eq: ['→ ← → ←'] },
        items: [PT('^v^v', 2), PT('>v<^>v', 2), PT('<^>v<^', 2), PT('v<^>v<', 2), PT('>>vv<<^^>>', 2), PT('^^>>^^', 2)]
      },
      p2: {
        items: [PT('>v<^>v<', 3), PT('^<v>^', 3), PT('>v>v', 3), PT('<<^^<<', 3),
          { q: 'Which way does the arrow turn: right or left?', pic: ['pat', { seq: '^<v>', blanks: 0 }], pick: { opts: ['right', 'left'], ans: 1, turn: '^<v>' } },
          { q: 'Which way does the arrow turn: right or left?', pic: ['pat', { seq: '^>v<', blanks: 0 }], pick: { opts: ['right', 'left'], ans: 0, turn: '^>v<' } }]
      },
      p3: {
        items: [PT('>^<v>', 3), PT('v>^<v', 3), PT('>>v<<^>>v', 3), PT('^v<>^v', 3),
          { q: 'Draw a pattern of arrows that turns left a quarter turn each time.', draw: { h: 50, key: '→ ↑ ← ↓ (or starting anywhere, turning left).' } },
          { q: 'Draw a pattern that does a half turn each time.', draw: { h: 50, key: 'For example: ↑ ↓ ↑ ↓.' } }]
      },
      think: {
        items: [{ q: 'How many quarter turns bring the arrow back to the start?', lines: { n: 1, key: '4 quarter turns.' } },
          { q: '{a} drew → ↓ ↑ ←. Is it a turning pattern? Why?', lines: { n: 2, key: 'No. It does not turn the same amount each time.' } },
          { q: 'Make a turning pattern with a shape that is not an arrow.', draw: { h: 60, key: 'For example: a triangle pointing up, right, down, left.' } },
          { q: 'What is the 9th arrow in → ↓ ← ↑ → ↓ ...? How do you know?', lines: { n: 2, key: '→. The core has 4 arrows, and 9 is 2 cores and 1 more.' } }]
      }
    },

    ahead: {
      watch: 'drawing every shape to find the 20th. Use the core: count by its length to get close.',
      goal: 'I can predict a shape far ahead.',
      learn: {
        show: { pic: ['pat', { seq: 'cstcst', blanks: 0 }], cap: 'Core of 3. 3, 6, 9, 12 are triangles', eq: ['shape 12: triangle', 'shape 13: circle'] },
        together: [NTH('cs', 10), NTH('cst', 9)],
        cue: 'Count by the length of the core. Every core ends with the same shape.',
        own: [NTH('cs', 15), NTH('cst', 10)]
      },
      p1: {
        show: { pic: ['pat', { seq: 'stst', blanks: 0 }], cap: 'Even places are triangles', eq: ['shape 10: triangle'] },
        items: [NTH('cs', 8), NTH('st', 11), NTH('tc', 14), NTH('cst', 6), NTH('dsc', 7), NTH('cs', 19)]
      },
      p2: {
        items: [NTH('cst', 15), NTH('cst', 20), NTH('sdc', 13), NTH('tsc', 18), NTH('ccs', 12), NTH('dds', 17)]
      },
      p3: {
        items: [NTH('cstd', 12), NTH('cstd', 21), NTH('ccss', 15), NTH('cst', 100)]
      },
      think: {
        items: [{ q: 'In ○□○□..., what is shape 50? How do you know?', lines: { n: 2, key: 'A square. Even places are squares.' } },
          { q: '{b} says shape 9 of △○□△○□ is a circle. Is {b} right? Why?', lines: { n: 2, key: 'No. 9 is 3 cores of 3, so it ends a core: a square.' } },
          { q: 'Make a pattern where shape 20 is a star.', lines: { n: 2, key: 'For example: circle, star, circle, star (even places are stars).' } },
          { q: 'The core ○□△ has 3 shapes. How many circles are in the first 12 shapes?', eq: ['[] circles'], a: [4], calc: '12 ÷ 3' }]
      }
    },

    rule: {
      watch: 'adding to the first number each time instead of the last. Add the rule to the number just before.',
      goal: 'I can use a rule to continue a pattern.',
      learn: {
        show: { cap: 'Start at 4. Add 3 each time.', eq: ['4, 7, 10, 13, 16'] },
        together: [CT('Start at 2. Add 4.', [2, 6, '[]', '[]'], 4), CT('Start at 50. Take away 5.', [50, 45, '[]', '[]'], -5)],
        cue: 'Say the rule. Use it on the last number to get the next one.',
        own: [CT('Start at 3. Add 2.', [3, '[]', '[]', '[]'], 2), CT('Start at 10. Add 10.', [10, '[]', '[]', '[]'], 10),
          CT('Start at 40. Take away 4.', [40, '[]', '[]', '[]'], -4), CT('Start at 7. Add 5.', [7, '[]', '[]', '[]'], 5)]
      },
      p1: {
        show: { cap: 'Start at 1. Add 2.', eq: ['1, 3, 5, 7, 9'] },
        items: [CT('Start at 5. Add 5.', [5, '[]', '[]', '[]'], 5), CT('Start at 1. Add 3.', [1, '[]', '[]', '[]'], 3),
          CT('Start at 20. Take away 2.', [20, '[]', '[]', '[]'], -2), CT('Start at 12. Add 4.', [12, '[]', '[]', '[]'], 4),
          CT('Start at 100. Take away 10.', [100, '[]', '[]', '[]'], -10), CT('Start at 0. Add 6.', [0, '[]', '[]', '[]'], 6)]
      },
      p2: {
        items: [CT('Start at 9. Add 7.', [9, '[]', '[]', '[]'], 7), CT('Start at 64. Take away 8.', [64, '[]', '[]', '[]'], -8),
          CT('Start at 25. Add 25.', [25, '[]', '[]', '[]'], 25), CT('Start at 15. Add 9.', [15, '[]', '[]', '[]'], 9),
          story('{a} has 6 {many} and gets 3 more each day. How many after 4 days?', '{many}', 18, '6 + 4 × 3'), story('{b} has 50 {many} and uses 5 each day. How many after 6 days?', '{many}', 20, '50 − 6 × 5')]
      },
      p3: {
        items: [CT('Start at 13. Add 11.', [13, '[]', '[]', '[]'], 11), CT('Start at 99. Take away 9.', [99, '[]', '[]', '[]'], -9),
          CT('Fill the gaps.', [4, '[]', 16, '[]'], 6), CT('Fill the gaps.', [90, '[]', '[]', 60], -10),
          story('A plant is 4 cm tall and grows 2 cm a week. How tall after 7 weeks?', 'cm', 18, '4 + 7 × 2'), CT('Fill the gaps.', ['[]', 35, '[]', 49], 7)]
      },
      think: {
        items: [{ q: '{a} used "add 3" from 2 and wrote 2, 5, 8, 10. What went wrong?', lines: { n: 2, key: '8 + 3 is 11, not 10.' } },
          { q: 'Make a pattern with the rule "add 6". Write 5 numbers.', lines: { n: 1, key: 'For example: 1, 7, 13, 19, 25.' } },
          { q: 'Start at 30. Will "take away 4" ever reach 0? Why?', lines: { n: 2, key: 'No. 30, 26, 22 ... 6, 2, then it would go below 0.' } },
          { q: 'Draw a growing pattern of dots for "start at 1, add 2".', draw: { h: 70, key: '1 dot, 3 dots, 5 dots, 7 dots.' } }]
      }
    },

    find: {
      watch: 'finding the change between the first two only. Check the change between every pair.',
      goal: 'I can find the rule of a pattern.',
      learn: {
        show: { cap: 'From each number to the next: +5', eq: ['15, 20, 25, 30', 'Start at 15. Add 5.'] },
        together: [RULE([3, 7, 11, 15], ['add 3', 'add 4', 'add 7']), RULE([40, 35, 30, 25], ['add 5', 'take away 5', 'take away 10'])],
        cue: 'Find the change from each number to the next. If it is the same each time, that is the rule.',
        own: [RULE([2, 8, 14, 20], ['add 6', 'add 2', 'add 8']), RULE([90, 81, 72, 63], ['take away 9', 'take away 8', 'add 9'])]
      },
      p1: {
        show: { cap: '6, 8, 10, 12', eq: ['Start at 6. Add 2.'] },
        items: [RULE([5, 10, 15, 20], ['add 5', 'add 10', 'add 15']), RULE([1, 4, 7, 10], ['add 4', 'add 3', 'add 1']),
          RULE([30, 28, 26, 24], ['take away 2', 'add 2', 'take away 4']), RULE([12, 22, 32, 42], ['add 2', 'add 12', 'add 10']),
          ]
      },
      p2: {
        items: [RULE([100, 125, 150, 175], ['add 25', 'add 50', 'add 100']), RULE([81, 72, 63, 54], ['take away 9', 'take away 8', 'add 9']),
          CT('Find the rule. Then fill the gaps.', [6, 13, 20, '[]'], 7), CT('Find the rule. Then fill the gaps.', [95, 88, 81, '[]'], -7),
          { q: 'Is there one rule? 2, 4, 7, 11', pick: { opts: ['yes', 'no'], ans: 1 }, oneRule: [2, 4, 7, 11] }, { q: 'Is there one rule? 9, 18, 27, 36', pick: { opts: ['yes', 'no'], ans: 0 }, oneRule: [9, 18, 27, 36] }]
      },
      p3: {
        items: [RULE([250, 300, 350, 400], ['add 50', 'add 100', 'add 250']), RULE([999, 899, 799, 699], ['take away 1', 'take away 100', 'take away 10']),
          CT('Fill the gaps.', [14, '[]', 32, '[]'], 9), CT('Fill the gaps.', [400, '[]', '[]', 340], -20),
          { q: 'Is there one rule? 3, 6, 12, 24', pick: { opts: ['yes', 'no'], ans: 1 }, oneRule: [3, 6, 12, 24] }, { q: 'Is there one rule? 105, 95, 85, 75', pick: { opts: ['yes', 'no'], ans: 0 }, oneRule: [105, 95, 85, 75] }]
      },
      think: {
        items: [{ q: '{b} says the rule for 5, 8, 11, 14 is "add 5". What went wrong?', lines: { n: 2, key: '{b} used the start. The change each time is 3: add 3.' } },
          { q: 'Write a pattern whose rule is "take away 6".', lines: { n: 1, key: 'For example: 50, 44, 38, 32.' } },
          { q: 'Two patterns both have the rule "add 4". How can they be different?', lines: { n: 2, key: 'They can start at different numbers: 1, 5, 9 and 2, 6, 10.' } },
          { q: 'What is the rule? Explain how you checked: 17, 23, 29, 35', lines: { n: 2, key: 'Add 6. 23 − 17, 29 − 23 and 35 − 29 are all 6.' } }]
      }
    },

    big: {
      watch: 'changing the wrong digit with big numbers. Say which place changes: tens for 10s, hundreds for 100s.',
      goal: 'I can find and continue patterns to 1000.',
      learn: {
        show: { pic: ['nl', { min: 300, max: 600, tick: 50, lab: 100, jumps: [[320, 420], [420, 520]] }], cap: 'Add 100: the hundreds digit goes up', eq: ['320, 420, 520'] },
        together: [CT('Add 100.', [135, 235, '[]', '[]'], 100), CT('Take away 10.', [470, 460, '[]', '[]'], -10)],
        cue: 'Find which digit changes and by how much. Keep changing that digit.',
        own: [CT('Add 50.', [250, 300, '[]', '[]'], 50), CT('Add 25.', [500, 525, '[]', '[]'], 25),
          CT('Take away 100.', [907, 807, '[]', '[]'], -100), CT('Add 10.', [685, 695, '[]', '[]'], 10)]
      },
      p1: {
        show: { cap: 'Add 10: the tens digit goes up', eq: ['342, 352, 362'] },
        items: [CT('', [110, 120, '[]', '[]'], 10), CT('', [205, 305, '[]', '[]'], 100), CT('', [650, 700, '[]', '[]'], 50),
          CT('', [480, 470, '[]', '[]'], -10), CT('', [925, 825, '[]', '[]'], -100), CT('', [175, 200, '[]', '[]'], 25)]
      },
      p2: {
        items: [CT('', [394, 404, '[]', '[]'], 10), CT('', [760, 780, '[]', '[]'], 20), CT('', [990, '[]', 970, '[]'], -10),
          CT('', [125, '[]', '[]', 275], 50), RULE([615, 640, 665, 690], ['add 25', 'add 15', 'add 50']), RULE([830, 730, 630, 530], ['take away 10', 'take away 100', 'add 100'])]
      },
      p3: {
        items: [CT('', [592, '[]', 612, '[]'], 10), CT('', [1000, '[]', '[]', 925], -25), CT('', [48, '[]', 248, '[]'], 100),
          CT('', ['[]', 455, 505, '[]'], 50), RULE([270, 310, 350, 390], ['add 40', 'add 4', 'add 30']),
          story('{a} has 380 {many} and adds 40 each day. How many after 5 days?', '{many}', 580, '380 + 5 × 40')]
      },
      think: {
        items: [{ q: '{b} counted on by 10 from 395: 395, 405, 415, 425. Is that right?', lines: { n: 2, key: 'Yes. 395 + 10 = 405: the tens went past 9, so the hundreds went up.' } },
          { q: 'In a hundreds chart from 301 to 400, what pattern do the numbers below 345 make?', lines: { n: 2, key: '355, 365, 375 ...: add 10.' } },
          { q: 'Make a pattern to 1000 with a rule of your own.', lines: { n: 1, key: 'For example: 600, 700, 800, 900, 1000.' } },
          { q: 'Which digit changes when you add 100 to 950?', lines: { n: 2, key: '950 + 100 = 1050: the hundreds go past 9, so a thousand appears.' } }]
      }
    },

    table: {
      watch: 'adding down the wrong column. The step number goes up by 1; look at how the other column changes.',
      goal: 'I can show a pattern in a table.',
      learn: {
        show: { pic: ['table', { head: ['Step', 'Dots'], rows: [[1, 3], [2, 5], [3, 7]] }], cap: 'Each step adds 2 dots', eq: ['3, 5, 7, 9'] },
        together: [TG(['Step', 'Dots'], [[1, 4], [2, 7], [3, '[]'], [4, '[]']]), TG(['Step', 'Sticks'], [[1, 5], [2, 10], [3, '[]'], [4, '[]']])],
        cue: 'Find how much the right column grows each step. Keep adding that.',
        own: [TG(['Step', '{many}'], [[1, 2], [2, 4], [3, '[]'], [4, '[]']]), TG(['Week', '$'], [[1, 10], [2, 15], [3, '[]'], [4, '[]']])]
      },
      p1: {
        show: { pic: ['table', { head: ['Step', 'Blocks'], rows: [[1, 1], [2, 4], [3, 7]] }], cap: 'Add 3 each step', eq: ['1, 4, 7, 10'] },
        items: [TG(['Step', 'Dots'], [[1, 1], [2, 3], [3, '[]'], [4, '[]']]), TG(['Step', 'Cubes'], [[1, 6], [2, 12], [3, '[]']]),
          TG(['Step', 'Tiles'], [[1, 3], [2, 6], [3, '[]'], [4, '[]']]), TG(['Day', '{many}'], [[1, 20], [2, 30], [3, '[]'], [4, '[]']])]
      },
      p2: {
        items: [TG(['Step', 'Sticks'], [[1, 4], [2, 7], [3, '[]'], [4, '[]'], [5, '[]']]), TG(['Week', 'cm'], [[1, 5], [2, 8], [3, '[]'], [4, '[]'], [5, '[]']]),
          TG(['Day', '{many}'], [[1, 50], [2, 45], [3, '[]'], [4, '[]']]), TG(['Step', 'Dots'], [[1, 2], [2, '[]'], [3, 12], [4, '[]']])]
      },
      p3: {
        items: [TG(['Step', 'Tiles'], [[1, 7], [2, '[]'], [3, 19], [4, '[]'], [5, '[]']]), TG(['Week', '$'], [[1, 25], [2, '[]'], [3, 75], [4, '[]'], [5, '[]']]),
          TG(['Day', 'Pages'], [[1, 12], [2, 24], [3, '[]'], [4, '[]'], [5, '[]']]), TG(['Step', 'Cubes'], [[1, 100], [2, 90], [3, '[]'], [4, '[]'], [5, '[]']])]
      },
      think: {
        items: [{ q: 'Draw steps 1, 2 and 3 for a pattern that adds 2 each step.', draw: { h: 80, key: 'For example: 1 dot, 3 dots, 5 dots.' } },
          { q: 'A table goes 4, 8, 12. {a} says step 5 is 16. Is {a} right?', lines: { n: 2, key: 'No. Step 4 is 16, so step 5 is 20.' } },
          { q: 'Why is a table useful for a pattern?', lines: { n: 2, key: 'It lines up each step with its number, so the change is easy to see.' } },
          { q: 'Make your own table with 4 steps and a rule.', lines: { n: 3, key: 'For example: steps 1 to 4 with 5, 10, 15, 20 (add 5).' } }]
      }
    },

    which: {
      watch: 'calling every pattern growing. Look for a core that comes back, or the same change each time.',
      goal: 'I can tell a repeating pattern from a growing one.',
      learn: {
        show: { cap: 'Repeating: a core comes back. Growing: it changes the same way.', eq: ['2, 5, 2, 5: repeating', '2, 5, 8, 11: growing'] },
        together: [KIND([1, 3, 1, 3, 1, 3]), KIND([1, 3, 5, 7, 9])],
        cue: 'Does a core come back? Repeating. Does it change by the same amount? Growing.',
        own: [KIND([4, 8, 12, 16]), KIND([7, 7, 2, 7, 7, 2]), KIND([30, 25, 20, 15]), KIND([5, 0, 5, 0, 5, 0])]
      },
      p1: {
        show: { cap: '10, 20, 30, 40', eq: ['growing: add 10'] },
        items: [KIND([2, 4, 2, 4]), KIND([2, 4, 6, 8]), KIND([9, 1, 9, 1]), KIND([10, 15, 20, 25]), KIND([3, 3, 6, 3, 3, 6]), KIND([50, 40, 30, 20])]
      },
      p2: {
        items: [KIND([100, 200, 300, 400]), KIND([1, 2, 3, 1, 2, 3]), KIND([6, 9, 12, 15]), KIND([8, 0, 0, 8, 0, 0]), KIND([45, 40, 35, 30]), KIND([4, 4, 4, 4]),
          ]
      },
      p3: {
        items: [KIND([250, 275, 300, 325]), KIND([7, 1, 4, 7, 1, 4]), KIND([99, 88, 77, 66]), KIND([0, 5, 5, 0, 5, 5]),
          { q: 'Make a repeating pattern with numbers.', lines: { n: 1, key: 'For example: 1, 2, 2, 1, 2, 2.' } }, { q: 'Make a growing pattern with numbers.', lines: { n: 1, key: 'For example: 3, 6, 9, 12.' } }]
      },
      think: {
        items: [{ q: 'Is 4, 4, 4, 4 repeating or growing? Explain.', lines: { n: 2, key: 'Repeating: the core 4 comes back. It does not grow.' } },
          { q: 'Make a shape pattern that grows.', draw: { h: 70, key: 'For example: 1 square, 2 squares, 3 squares.' } },
          { q: '{a} says 2, 4, 2, 4 is growing because it goes up. What would you say?', lines: { n: 2, key: 'It goes up and then back down: the core 2, 4 repeats.' } },
          { q: 'Can a pattern shrink? Give an example.', lines: { n: 2, key: 'Yes: 20, 17, 14, 11 takes away 3 each time.' } }]
      }
    },

    letter: {
      watch: 'thinking a letter is a word, or that n is always the same number. A letter stands for one number in that sentence.',
      goal: 'I can find the number a letter stands for.',
      learn: {
        show: { cap: 'n stands for the missing number', eq: ['n + 4 = 10', 'n = 6'] },
        together: [LT('n + 3 = 9'), LT('k − 5 = 10')],
        cue: 'A letter stands for a number. Find the number that makes both sides equal.',
        own: [LT('a + 6 = 13'), LT('15 − m = 8'), LT('2 × b = 12'), LT('p + 10 = 30')]
      },
      p1: {
        show: { cap: 'What goes with 5 to make 12?', eq: ['5 + n = 12', 'n = 7'] },
        items: [LT('n + 2 = 8'), LT('x + 5 = 11'), LT('9 + y = 14'), LT('c − 3 = 7'), LT('20 − d = 15'), LT('n + n = 10')]
      },
      p2: {
        items: [LT('m + 15 = 40'), LT('50 − k = 35'), LT('3 × n = 15'), LT('t − 12 = 18'), LT('a + 8 = 3 + 9'),
          { q: '{a} has some {many}. After getting 7 more, {a} has 22. Write it with a letter.', lines: { n: 1, key: 'n + 7 = 22, so n = 15.' } }]
      },
      p3: {
        items: [LT('n + 25 = 50'), LT('40 − w = 26'), LT('5 × b = 45'), LT('k + k = 24'), LT('z + 14 = 20 + 9'),
          { q: 'Write a story for 30 − n = 18.', lines: { n: 2, key: 'For example: {b} had 30 {many} and gave some away. 18 were left. n = 12.' } }]
      },
      think: {
        items: [{ q: '{b} says in n + 4 = 9, n is "n". What would you say?', lines: { n: 2, key: 'The letter stands for a number. Here n = 5.' } },
          { q: 'In n + n = 8, can n be 3 and 5? Why?', lines: { n: 2, key: 'No. The same letter stands for the same number: n = 4.' } },
          { q: 'Write your own sentence with a letter. What is the letter?', lines: { n: 2, key: 'For example: y + 6 = 11, y = 5.' } },
          { q: 'A box has b {many}. Two boxes have 16. What is b?', eq: ['[]'], a: [8], letter: 'b + b = 16' }]
      }
    },

    machine: {
      watch: 'mixing up In and Out. The rule changes the In number to make the Out number.',
      goal: 'I can use a number machine rule.',
      learn: {
        show: { pic: ['table', { head: ['In', 'Out'], rows: [[2, 5], [4, 7], [6, 9]] }], cap: 'The rule is + 3', eq: ['2 + 3 = 5'] },
        together: [MC('+ 4', [1, 5, 8], [1, 2]), MC('× 2', [3, 5, 10], [1, 2])],
        cue: 'Put the In number in. Do the rule. That is the Out number.',
        own: [MC('+ 10', [5, 20, 46], [0, 1, 2]), MC('− 5', [15, 30, 51], [0, 1, 2])]
      },
      p1: {
        show: { pic: ['table', { head: ['In', 'Out'], rows: [[1, 10], [2, 20]] }], cap: 'The rule is × 10', eq: ['2 × 10 = 20'] },
        items: [MC('+ 2', [3, 7, 10], [0, 1, 2]), MC('+ 5', [5, 9, 20], [0, 1, 2]), MC('− 1', [8, 15, 30], [0, 1, 2]), MC('× 5', [2, 4, 6], [0, 1, 2])]
      },
      p2: {
        items: [MC('+ 9', [11, 25, 40], [0, 1, 2]), MC('− 7', [20, 35, 47], [0, 1, 2]), MC('× 3', [4, 6, 10], [0, 1, 2]), MC('+ 100', [250, 499, 900], [0, 1, 2])]
      },
      p3: {
        items: [MC('× 4', [3, 5, 9], [0, 1, 2]), MC('− 25', [100, 75, 260], [0, 1, 2]),
          { q: 'Find the rule. In 3, Out 9. In 5, Out 11. In 10, Out 16.', pick: { opts: ['+ 6', '× 3', '+ 3'], ans: 0, machine: [[3, 9], [5, 11], [10, 16]] }, wide: true },
          { q: 'Find the rule. In 2, Out 20. In 5, Out 50. In 7, Out 70.', pick: { opts: ['+ 18', '× 10', '+ 45'], ans: 1, machine: [[2, 20], [5, 50], [7, 70]] }, wide: true }]
      },
      think: {
        items: [{ q: 'In 4, Out 8. {a} says the rule is + 4. {b} says × 2. Who is right? How can you tell?', lines: { n: 3, key: 'Both work for 4. Try another In: 5 + 4 = 9 but 5 × 2 = 10. More rows decide.' } },
          { q: 'Make your own machine. Give its rule and three In and Out pairs.', lines: { n: 3, key: 'For example: + 6: 1 → 7, 4 → 10, 10 → 16.' } },
          { q: 'The rule is + 8. The Out is 20. What was the In?', eq: ['[] + 8 = 20'], a: [12] },
          { q: 'Can the machine "− 10" take In 6? Why?', lines: { n: 2, key: 'Not with whole numbers we know: 6 − 10 would be below 0.' } }]
      }
    },

    sides: {
      watch: 'saying two sides are equal because they have the same numbers. Work out each side first, then compare.',
      goal: 'I can tell if both sides are equal.',
      learn: {
        show: { cap: 'Work out each side, then compare', eq: ['6 + 4 = 10 and 7 + 3 = 10', '6 + 4 = 7 + 3'] },
        together: [NE('5 + 5', '8 + 2'), NE('9 + 3', '6 + 5')],
        cue: 'Work out each side. Same value: =. Different value: ≠.',
        own: [NE('4 + 6', '2 + 8'), NE('10 − 3', '4 + 4'), NE('7 + 7', '10 + 4'), NE('15 − 5', '20 − 5')]
      },
      p1: {
        show: { cap: '≠ means not equal', eq: ['3 + 4 ≠ 3 + 5'] },
        items: [NE('2 + 6', '4 + 4'), NE('9 + 1', '5 + 4'), NE('8 − 2', '3 + 3'), NE('6 + 6', '7 + 4'), NE('10 + 5', '20 − 5'), NE('12 − 4', '2 + 5')]
      },
      p2: {
        items: [NE('25 + 5', '15 + 15'), NE('40 − 10', '20 + 20'), NE('3 × 4', '6 + 6'), NE('50 − 15', '20 + 15'), TF('18 + 2 = 10 + 10', true), TF('9 + 9 = 20', false)]
      },
      p3: {
        items: [NE('35 + 15', '60 − 10'), NE('2 × 8', '4 × 4'), NE('45 − 18', '20 + 8'), NE('5 × 5', '30 − 5'), TF('24 + 6 = 40 − 10', true), TF('12 + 13 = 50 − 24', false)]
      },
      think: {
        items: [{ q: '{a} says 4 + 5 = 5 + 4 must be true without adding. Why?', lines: { n: 2, key: 'Adding in any order gives the same total.' } },
          { q: 'Write two sides that are not equal and use ≠.', lines: { n: 1, key: 'For example: 6 + 3 ≠ 5 + 5.' } },
          { q: '{b} wrote 7 + 3 = 10 + 2 = 12. What went wrong?', lines: { n: 2, key: '7 + 3 is 10, not 12. The = joins sides that are not equal.' } },
          { q: 'Change one number so that 8 + 5 ≠ 6 + 6 becomes =.', lines: { n: 1, key: 'For example: 8 + 4 = 6 + 6, or 8 + 5 = 6 + 7.' } }]
      }
    },

    balance: {
      watch: 'adding the number across to the answer. The two sides must be worth the same, like a level balance.',
      goal: 'I can find the number that balances.',
      learn: {
        show: { pic: ['balance', { l: '7 + 5', r: '10 + 2', tilt: 0 }], cap: 'Level: both sides are 12', eq: ['7 + 5 = 10 + 2'] },
        together: [{ pic: ['balance', { l: '6 + 4', r: '5 + ?', tilt: 0 }], eq: ['6 + 4 = 5 + []'], a: [5] }, { eq: ['8 + 6 = [] + 4'], a: [10] }],
        cue: 'Work out the full side. Then find what makes the other side match.',
        own: [{ eq: ['9 + 3 = 10 + []'], a: [2] }, { eq: ['15 = 7 + []'], a: [8] }, { eq: ['20 − 5 = 10 + []'], a: [5] }, { eq: ['[] + 12 = 30'], a: [18] }]
      },
      p1: {
        show: { pic: ['balance', { l: 5, r: 5, tilt: 0 }], cap: '5 cubes and 5 cubes', eq: ['5 = 5'] },
        items: [{ eq: ['4 + 4 = 6 + []'], a: [2] }, { eq: ['3 + 7 = [] + 5'], a: [5] }, { eq: ['12 = 4 + []'], a: [8] }, { eq: ['[] + 9 = 15'], a: [6] },
          { q: 'Which side goes down?', pic: ['balance', { l: '8 + 3', r: '6 + 4', tilt: 0 }], pick: { opts: ['left', 'right'], ans: 0, heavy: ['8 + 3', '6 + 4'] } },
          { q: 'Which side goes down?', pic: ['balance', { l: '5 + 5', r: '9 + 2', tilt: 0 }], pick: { opts: ['left', 'right'], ans: 1, heavy: ['5 + 5', '9 + 2'] } }]
      },
      p2: {
        items: [{ eq: ['25 + 10 = 30 + []'], a: [5] }, { eq: ['40 = [] + 16'], a: [24] }, { eq: ['50 − 20 = 10 + []'], a: [20] }, { eq: ['[] − 8 = 12 + 10'], a: [30] },
          story('{a} has 14 {many} on one side and {b} has 9. How many must {b} add to balance?', '{many}', 5, '14 − 9'), { eq: ['18 + [] = 25 + 3'], a: [10] }]
      },
      p3: {
        items: [{ eq: ['36 + 9 = 40 + []'], a: [5] }, { eq: ['47 = [] + 29'], a: [18] }, { eq: ['50 − [] = 22 + 13'], a: [15] }, { eq: ['[] + 17 = 26 + 14'], a: [23] },
          { eq: ['3 × 5 = 10 + []'], a: [5] }, { eq: ['2 × 9 = [] + 9'], a: [9] }]
      },
      think: {
        items: [{ q: '{b} wrote 9 + 4 = [] + 6 and put 13. What went wrong?', lines: { n: 2, key: '13 + 6 is 19, not 13. The box is 7.' } },
          { q: 'Find three ways to balance 20 = [] + []', lines: { n: 2, key: 'For example: 10 + 10, 15 + 5, 19 + 1.' } },
          { q: 'The balance is level. What could each side hold?', pic: ['balance', { l: '?', r: '?', tilt: 0 }], lines: { n: 2, key: 'Any two sides of the same value, like 7 + 8 and 10 + 5.' } },
          { q: 'Write a story for 12 + 8 = 15 + n.', lines: { n: 3, key: 'For example: {a} has 12 and 8 {many}. {b} has 15. {b} needs n = 5 more to match.' } }]
      }
    },

    steps: {
      watch: 'turning on the spot and also moving. Turns do not move the robot; only "move" does.',
      goal: 'I can follow code one step at a time.',
      learn: {
        show: { pic: map([0, 4, '>'], [[3, 2, 'A']], 'move 3, turn left, move 2'), cap: 'move 3, turn left, move 2', eq: ['It stops at A'] },
        together: [GO([0, 2, '>'], M1, 'move 4, turn left, move 2'), GO([0, 2, '>'], M1, 'move 2, turn right, move 2')],
        cue: 'Point your finger the way the robot faces. Do each line in order.',
        own: [GO([0, 0, '>'], M2, 'move 3, turn right, move 1'), GO([0, 4, '>'], M3, 'move 1, turn left, move 3')]
      },
      p1: {
        show: { pic: map([0, 2, '>'], [[4, 2, 'A']], 'move 4'), cap: 'move 4', eq: ['It stops at A'] },
        items: [GO([0, 2, '>'], M1, 'move 6'), GO([0, 2, '^'], M2, 'move 2'), GO([2, 0, 'v'], M1, 'move 4'), GO([0, 4, '^'], M3, 'move 3, turn right, move 1')]
      },
      p2: {
        items: [GO([0, 4, '>'], M1, 'move 4, turn left, move 4'), GO([6, 0, '<'], M2, 'move 3, turn left, move 1'),
          FILL([0, 4, '>'], M1, 'move [], turn left, move []', [6, 2], 'B'), FILL([0, 4, '^'], M2, 'move [], turn right, move []', [3, 3], 'A')]
      },
      p3: {
        items: [GO([3, 4, '^'], M3, 'move 3, turn left, move 2'), FILL([0, 0, 'v'], M3, 'move [], turn left, move []', [4, 4], 'C'),
          FILL([6, 4, '^'], M2, 'move [], turn left, move []', [3, 3], 'A'),
          { q: 'How many squares? move 4, turn left, move 4, turn left, move 4', eq: ['[] squares'], a: [12], calc: '4 + 4 + 4' }]
      },
      think: {
        items: [{ q: '{a} says "turn right" moves the robot one square. Is that right?', lines: { n: 2, key: 'No. A turn only changes the way it faces.' } },
          { q: 'Write two different codes that reach the same square.', lines: { n: 3, key: 'For example: move 2, turn right, move 3 and turn right, move 3, turn left, move 2.' } },
          { q: 'Why does the order of the steps matter?', lines: { n: 2, key: 'A move goes the way the robot faces, and a turn changes that way.' } },
          { q: 'Write code from the arrow to B.', pic: map([0, 0, '>'], M1, 'move 6, turn right, move 2'), lines: { n: 2, key: 'For example: move 6, turn right, move 2.' } }]
      }
    },

    loop: {
      watch: 'repeating only the first line of the loop. Everything after "repeat" runs again each time.',
      goal: 'I can use a repeat loop.',
      learn: {
        show: { cap: 'repeat 3 times: move 1, turn left, move 1, turn right', eq: ['3 steps of a staircase'] },
        together: [GO([2, 0, 'v'], M1, 'repeat 2 times: move 2'), GO([1, 4, '>'], M3, 'repeat 2 times: move 2, turn left, move 2, turn right')],
        cue: 'A loop runs the same steps again. Count the times, then do the steps that many times.',
        own: [GO([0, 2, '>'], M1, 'repeat 3 times: move 2'), GO([6, 0, 'v'], M2, 'repeat 2 times: move 2')]
      },
      p1: {
        show: { cap: 'repeat 4 times: move 1', eq: ['the same as move 4'] },
        items: [GO([0, 2, '>'], M1, 'repeat 2 times: move 3'), GO([0, 0, '>'], M3, 'repeat 5 times: move 1'),
          { q: 'How many squares? repeat 3 times: move 2', eq: ['[] squares'], a: [6], calc: '3 × 2' }, { q: 'How many squares? repeat 4 times: move 5', eq: ['[] squares'], a: [20], calc: '4 × 5' }]
      },
      p2: {
        items: [GO([1, 4, '^'], M3, 'repeat 2 times: move 2, turn right, move 2, turn left'), GO([0, 4, '>'], M2, 'repeat 3 times: move 1, turn left, move 1, turn right'),
          FILL([0, 2, '>'], M1, 'repeat [] times: move 2', [3], 'B'), { q: 'Write move 2, move 2, move 2, move 2 as a loop.', lines: { n: 1, key: 'repeat 4 times: move 2' } }]
      },
      p3: {
        items: [GO([3, 4, '>'], M3, 'repeat 2 times: move 1, turn left, move 2, turn right'), FILL([0, 4, '>'], M2, 'repeat [] times: move 1, turn left, move 1, turn right', [3], 'A'),
          { q: 'How many squares? repeat 5 times: move 2, turn left', eq: ['[] squares'], a: [10], calc: '5 × 2' }, FILL([1, 4, '^'], M3, 'repeat [] times: move 1', [3], 'B')]
      },
      think: {
        items: [{ q: 'Why use a loop instead of writing the steps again?', lines: { n: 2, key: 'It is shorter and easier to change, and makes fewer mistakes.' } },
          { q: '{b} says repeat 3 times: move 1, turn right moves the robot 3 squares in a line. Is {b} right?', lines: { n: 2, key: 'No. It turns after each move, so it goes around three sides of a square.' } },
          { q: 'Write a loop that makes a square with sides of 2.', lines: { n: 1, key: 'repeat 4 times: move 2, turn right' } },
          { q: 'What does repeat 2 times: move 1, turn left, move 1, turn right make?', lines: { n: 2, key: 'Two steps of a staircase.' } }]
      }
    },

    same: {
      watch: 'running two things one after the other when they happen at the same time. Count the time once for both.',
      goal: 'I can follow code where things happen at the same time.',
      learn: {
        show: { cap: 'When the flag is tapped: the cat walks AND the drum plays', eq: ['Both start together', 'Both take 4 seconds'] },
        together: [story('Two robots start at the same time. One moves 3 squares, the other 3 squares. Each square takes 1 second. How many seconds until both stop?', 'seconds', 3, '3'),
          story('A light flashes once a second while a robot moves 5 squares, 1 a second. How many flashes?', 'flashes', 5, '5')],
        cue: 'Things at the same time start together. Follow each one, and watch the clock once.',
        own: [story('A song plays for 6 seconds while a robot moves 1 square a second. How many squares does it move?', 'squares', 6, '6'),
          story('Robot A moves 4 squares and robot B moves 2, at the same time, 1 square a second. How many seconds until both stop?', 'seconds', 4, '4')]
      },
      p1: {
        show: { cap: 'Beep and move at the same time, 3 times', eq: ['3 beeps, 3 squares'] },
        items: [story('A robot beeps and moves 1 square at the same time, 4 times. How many beeps?', 'beeps', 4, '4'),
          story('A robot claps and moves 1 square at the same time, 6 times. How many squares?', 'squares', 6, '6'),
          story('Two robots each move 5 squares at the same time. How many squares in all?', 'squares', 10, '5 + 5'),
          story('A drum beats 2 times each second for 3 seconds. How many beats?', 'beats', 6, '2 × 3'),
          story('Lights blink 3 times each second for 4 seconds. How many blinks?', 'blinks', 12, '3 × 4'),
          story('Two robots each move 7 squares at the same time. How many squares in all?', 'squares', 14, '7 + 7')]
      },
      p2: {
        items: [story('Robot A moves 6 squares and robot B moves 9, at the same time, 1 a second. How many seconds until both stop?', 'seconds', 9, '9'),
          story('A robot moves 1 square a second and beeps every 2 seconds for 8 seconds. How many beeps?', 'beeps', 4, '8 ÷ 2'),
          story('3 robots each move 4 squares at the same time. How many squares in all?', 'squares', 12, '3 × 4'),
          story('A light is on for 10 seconds. A robot moves 1 square a second. How far does it go?', 'squares', 10, '10'),
          { q: 'Do "turn right" and "move 2" at the same time give the same as one after the other?', lines: { n: 2, key: 'No. Done one after the other, the order decides where the robot goes.' }, wide: true }]
      },
      p3: {
        items: [story('Robot A moves 8 squares at 2 a second. Robot B moves 6 at 1 a second. They start together. How many seconds until both stop?', 'seconds', 6, '6'),
          story('A robot moves 3 squares a second for 5 seconds while a light blinks once a second. How many squares?', 'squares', 15, '3 × 5'),
          story('A song lasts 12 seconds. A robot claps every 3 seconds. How many claps?', 'claps', 4, '12 ÷ 3'),
          story('4 robots each move 6 squares at the same time. How many squares in all?', 'squares', 24, '4 × 6'),
          { q: 'Write code where two things happen at the same time.', lines: { n: 2, key: 'For example: when the flag is tapped, move 4 and play a song.' }, wide: true }]
      },
      think: {
        items: [{ q: 'What is the difference between "one after the other" and "at the same time"?', lines: { n: 3, key: 'One after the other waits for each step to finish. At the same time, both run together.' } },
          { q: 'Give an example from life of two things at the same time.', lines: { n: 2, key: 'For example: walking and talking, or a band playing together.' } },
          { q: '{a} says two 5-second tasks at the same time take 10 seconds. Is {a} right?', lines: { n: 2, key: 'No. They run together, so they take 5 seconds.' } },
          { q: 'Why might a game need things to happen at the same time?', lines: { n: 2, key: 'So characters can move while music plays and the score changes.' } }]
      }
    },

    fix: {
      watch: 'changing many lines at once. Run the code, find the first wrong step, and change only that.',
      goal: 'I can change code to fix it or make it do something new.',
      learn: {
        show: { cap: 'To go up: move 3, turn right, move 2 goes the wrong way', eq: ['Fix: turn left'] },
        together: [FILL([0, 2, '>'], M1, 'move [], turn left, move 2', [4], 'A'), FILL([0, 0, 'v'], M3, 'move 4, turn left, move []', [4], 'C')],
        cue: 'Run the code with your finger. Find the first step that goes wrong. Change just that step.',
        own: [FILL([0, 4, '>'], M1, 'move [], turn left, move 2', [6], 'B'), FILL([0, 2, '>'], M2, 'move 3, turn left, move []', [1], 'A')]
      },
      p1: {
        show: { cap: 'move 2 should be move 4', eq: ['move 4, turn left, move 2'] },
        items: [FILL([0, 2, '>'], M1, 'move [], turn right, move 2', [2], 'C'), FILL([0, 4, '^'], M2, 'move [], turn right, move 3', [3], 'A'),
          FILL([0, 4, '>'], M3, 'move 1, turn left, move []', [3], 'B'), FILL([6, 0, 'v'], M2, 'move []', [4], 'B')]
      },
      p2: {
        items: [FILL([0, 4, '>'], M1, 'move [], turn left, move []', [6, 2], 'B'), FILL([0, 0, '>'], M2, 'move [], turn right, move []', [3, 1], 'A'),
          FILL([0, 4, '^'], M3, 'move [], turn right, move []', [3, 1], 'B'), FILL([0, 0, 'v'], M3, 'move [], turn left, move []', [4, 4], 'C')]
      },
      p3: {
        items: [FILL([0, 4, '>'], M2, 'repeat [] times: move 1, turn left, move 1, turn right', [3], 'A'), FILL([0, 2, '>'], M1, 'repeat [] times: move 2', [3], 'B')]
      },
      think: {
        items: [{ q: 'What does "debug" mean?', lines: { n: 2, key: 'To find and fix a mistake in code.' } },
          { q: '{b} wrote move 3, turn right, move 2 but wanted to go up. What should change?', lines: { n: 2, key: 'turn right should be turn left (if the robot faces right).' } },
          { q: 'Change "repeat 2 times: move 3" so the robot goes twice as far.', lines: { n: 2, key: 'repeat 4 times: move 3, or repeat 2 times: move 6.' } },
          { q: 'Why test code after changing it?', lines: { n: 2, key: 'To check the change works and did not break something else.' } }]
      }
    }
  } });
})();
