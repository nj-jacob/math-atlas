/* Grade 1 Patterns: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the lessons
   in chapters/patterns.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random, so a sheet
   always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Shapes in a row are letters: c circle, s square, t triangle, d diamond, C and S shaded; > < ^ v arrows.
   Ontario 2020: C1.1 find what repeats in a pattern; C1.2 make and translate patterns (shapes, letters, numbers);
   C1.3 extend patterns and find what is missing; C1.4 number patterns to 50; C2.1 things that change and things that stay
   the same. The answer checks are in tests/verify/sheets.js: the next shapes and the boxed core from the row itself, whether
   a row repeats (pick.repeats), its letters (pick.abc), the shape at a place (pick.nth), and a rule or kind of pattern. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* the core of a repeating row of shapes, and the next k shapes */
  function per(seq) { for (var k = 1; k <= seq.length; k++) { var ok = true; for (var i = 0; i < seq.length; i++) if (seq[i] !== seq[i % k]) ok = false; if (ok) return k; } return seq.length; }
  function nextOf(seq, k) { var p = per(seq), out = ''; for (var i = 0; i < k; i++) out += seq[(seq.length + i) % p]; return out; }
  /* draw the next k shapes (and, with core, box the core on the key) */
  function NX(seq, k, core, q) { return { q: q || 'Draw the next ' + (k === 1 ? 'shape' : k + ' shapes') + '.', pic: ['pat', { seq: seq, blanks: k, next: nextOf(seq, k), core: core ? per(seq) : undefined }] }; }
  /* does it repeat? */
  function RP(seq) { var p = per(seq); return { q: 'Is it a repeating pattern?', pic: ['pat', { seq: seq }], pick: { opts: ['yes', 'no'], ans: 2 * p <= seq.length ? 0 : 1, repeats: true } }; }
  /* how many shapes in the core? */
  function CO(seq) { return { q: 'Box the core. How many shapes?', pic: ['pat', { seq: seq, core: per(seq), blanks: 0, next: '' }], eq: ['[] shapes'], a: [per(seq)], coreOf: seq }; }
  /* the shape at place n */
  var NAME = { c: 'circle', s: 'square', t: 'triangle', d: 'diamond', C: 'circle', S: 'square' };
  function NTH(seq, n, opts) { var o = opts || ['circle', 'square', 'triangle']; return { q: 'Keep going. What is shape ' + n + '?', pic: ['pat', { seq: seq }], pick: { opts: o, ans: o.indexOf(NAME[seq[(n - 1) % per(seq)]]), nth: { seq: seq.slice(0, per(seq)), n: n } } }; }
  /* the pattern in letters */
  function LT(seq, opts) { var seen = [], want = seq.split('').map(function (c) { if (seen.indexOf(c) < 0) seen.push(c); return 'ABCDEFG'[seen.indexOf(c)]; }).join(' '); return { q: 'Circle the letters for this pattern.', pic: ['pat', { seq: seq }], pick: { opts: opts, ans: opts.indexOf(want), abc: true } }; }
  /* a count: the numbers shown, then blanks ('[]' in the list); by is the step; core for a repeating number pattern */
  function CT(list, by, q, core) {
    var a = [], eq = list.map(function (v, i) { var last = i === list.length - 1; if (v === '[]') { a.push(null); return last ? '[]' : '[],'; } return last ? String(v) : v + ','; }).join(' ');
    if (core) { list.forEach(function (v, i) { if (v === '[]') a[a.indexOf(null)] = list.filter(function (w, j) { return j % core === i % core && w !== '[]'; })[0]; }); return { q: q, eq: [eq], a: a, core: core, wide: list.length > 5 }; }
    var first = list.filter(function (v) { return v !== '[]'; })[0], at = list.indexOf(first);
    list.forEach(function (v, i) { if (v === '[]') a[a.indexOf(null)] = first + (i - at) * by; });
    return { q: q, eq: [eq], a: a, by: by, wide: list.length > 5 };
  }
  /* the rule of a growing or shrinking pattern */
  function RU(list, opts) { var d = list[1] - list[0], want = d > 0 ? 'add ' + d : 'take away ' + -d; return { q: 'What is the rule? ' + list.join(', '), pick: { opts: opts, ans: opts.indexOf(want), rule: list } }; }
  /* repeating or growing? */
  function KD(list) { var o = ['repeating', 'growing'], rep = per(list) < list.length; return { q: list.join(', ') + ', ...', pick: { opts: o, ans: rep ? 0 : 1, kind: list } }; }
  /* towers that grow: the next tower */
  function TW(v) { var m = v[1] - v[0]; return { q: 'Towers of ' + v.join(', ') + ' cubes. How many cubes in the next one?', pic: ['towers', { v: v }], eq: ['[] cubes'], a: [v[v.length - 1] + m], seq: v, fig: v.length + 1 }; }
  /* changes or stays the same? */
  function VA(thing) { return { q: thing.charAt(0).toUpperCase() + thing.slice(1) + '.', pick: { opts: ['changes', 'stays the same'], ans: CHANGES.indexOf(thing) >= 0 ? 0 : 1, vary: thing }, wide: true }; }
  var CHANGES = ['the weather', 'your height', 'how many people are at the park', 'the number of leaves on a tree', 'the time on a clock', 'how many apples are in the bowl', 'your age'];
  function VN(list) { return { q: list.join(', ') + ', ...', pick: { opts: ['changes', 'stays the same'], ans: list.every(function (x) { return x === list[0]; }) ? 1 : 0, vary: list } }; }

  S.register('patterns', { code: 'PT', ideas: {

    repeat: {
      watch: 'calling any row of shapes a pattern. A pattern has a part that repeats, over and over, in the same order.',
      goal: 'I can tell if a row is a repeating pattern.',
      learn: {
        show: { pic: ['pat', { seq: 'csscss' }], cap: 'circle, square, square, again', eq: ['It repeats'] },
        together: [RP('tctctc'), RP('csttsc')],
        cue: 'Say it out loud. Does the same part come again and again?',
        own: [RP('ssCssC'), RP('ctsstc')]
      },
      p1: { show: { pic: ['pat', { seq: 'stst' }], eq: ['s t s t: it repeats'] }, items: [RP('cscscs'), RP('ccsctt'), RP('tttsss'), RP('CsCsCs'), RP('^v^v^v'), RP('cdstcd')] },
      p2: { items: [NX('cscs', 1), NX('tttt', 1), RP('cctcct'), RP('dsdtds'), NX('CCsCCs', 1), RP('>><>><')] },
      p3: { items: [RP('ctscts'), RP('ctsctc'), NX('tsstss', 2), NX('^>^>', 2), RP('SSSsSS'), RP('cdcdcd')] },
      think: {
        items: [{ q: 'Draw a repeating pattern with 2 shapes.', draw: { h: 48, key: 'For example: circle, square, circle, square, circle, square.' } },
          { q: '{b} says c c s t is a pattern. Is {b} right? Why?', lines: { n: 2, key: 'No. Nothing repeats yet. A pattern needs its core to come again.' } },
          { q: 'Name a pattern you see every day.', lines: { n: 2, key: 'For example: day, night, day, night; or stripes on a shirt.' } },
          NX('ccsccs', 3)]
      }
    },

    core: {
      watch: 'boxing too much or too little. The core is the shortest part that repeats.',
      goal: 'I can find the core of a pattern.',
      learn: {
        show: { pic: ['pat', { seq: 'cstcst', core: 3, blanks: 0, next: '' }], cap: 'The part that repeats', eq: ['core: 3 shapes'] },
        together: [CO('stst'), CO('cctcct')],
        cue: 'Find the shortest part that repeats. Box it.',
        own: [CO('tdtdtd'), CO('stcstc')]
      },
      p1: { show: { pic: ['pat', { seq: 'tsts', core: 2, blanks: 0, next: '' }], eq: ['core: 2 shapes'] }, items: [CO('cdcd'), CO('sttstt'), CO('ttccttcc'), CO('^v^v'), CO('ctsdctsd'), CO('ScSc')] },
      p2: { items: [CO('ccscss'.slice(0, 3) + 'ccs'), CO('tsstss'), NX('cdscds', 2, true), NX('ssCssC', 2, true), CO('>>v>>v'), CO('dctdct')] },
      p3: { items: [NX('ctctct', 2, true), NX('stdstd', 3, true), CO('ccssccss'), CO('tttsttts'), NX('^^vv^^vv', 2, true), CO('cScScS')] },
      think: {
        items: [{ q: 'Make a pattern with a core of 3 shapes.', draw: { h: 48, key: 'For example: circle, square, triangle, circle, square, triangle.' } },
          { q: '{a} boxed c s c s as the core of c s c s c s. What is the core?', lines: { n: 2, key: 'c s. It is the shortest part that repeats.' } },
          { q: 'Why does knowing the core help?', lines: { n: 2, key: 'You can say what comes next by repeating the core.' } },
          CO('tdstds')]
      }
    },

    say: {
      watch: 'guessing the next shape. Say the pattern out loud from the start, then keep saying it.',
      goal: 'I can say a pattern to find what comes next.',
      learn: {
        show: { pic: ['pat', { seq: 'stst', blanks: 1, next: 's' }], cap: 'square, triangle, square, triangle, ...', eq: ['next: square'] },
        together: [NX('cscs', 1), NX('ttCttC', 1)],
        cue: 'Say the pattern out loud. Keep saying it to find the next one.',
        own: [NX('dcdc', 1), NX('sstsst', 1), NX('><><', 2), NX('ctct', 2)]
      },
      p1: { show: { pic: ['pat', { seq: 'cdcd', blanks: 1, next: 'c' }], eq: ['next: circle'] }, items: [NX('tsts', 1), NX('ccscc', 1), NX('^v^v', 1), NX('dsdsd', 1), NX('CCsCC', 1), NX('tttcttt', 1)] },
      p2: { items: [NX('cssc', 2), NX('stts', 2), NX('dcdcd', 2), NX('>^>^', 2), NTH('cscs', 5, ['circle', 'square']), NTH('tsts', 6, ['triangle', 'square'])] },
      p3: { items: [NX('csccsc', 2), NX('tdtd', 3), NTH('cctcct', 7, ['circle', 'triangle']), NTH('stst', 10, ['square', 'triangle']), NX('SsSs', 3), NTH('dcdc', 9, ['diamond', 'circle'])] },
      think: {
        items: [{ q: 'Make up words for this pattern: c s c s.', pic: ['pat', { seq: 'cscs' }], lines: { n: 2, key: 'For example: clap, stomp, clap, stomp.' } },
          NTH('cscs', 12, ['circle', 'square']),
          NTH('tsts', 5, ['triangle', 'square']),
          { q: 'Why say a pattern out loud?', lines: { n: 2, key: 'Hearing it helps you remember the order and keep it going.' } }]
      }
    },

    extend: {
      watch: 'starting the core again too soon. Count the shapes in the core before you continue.',
      goal: 'I can keep a pattern going when its core is long.',
      learn: {
        show: { pic: ['pat', { seq: 'cstcst', blanks: 3, next: 'cst' }], cap: 'The core has 3 shapes', eq: ['c s t, c s t, c s t'] },
        together: [NX('cstcst', 2), NX('ssttsstt', 2)],
        cue: 'Find the core. Then copy it again in the same order.',
        own: [NX('tcdtcd', 2), NX('ccscs'.slice(0, 3) + 'ccs', 2), NX('stCstC', 3), NX('^>v^>v', 2)]
      },
      p1: { show: { pic: ['pat', { seq: 'tsctsc', blanks: 2, next: 'ts' }], eq: ['core: t s c'] }, items: [NX('csdcsd', 2), NX('tctctc', 2), NX('sscssc', 2), NX('CstCst', 2), NX('dcsdcs', 2), NX('ttcttc', 2)] },
      p2: { items: [NX('ctssctss', 2), NX('csdtcsdt', 2), NTH('cstcst', 8, ['circle', 'square', 'triangle']), NTH('ttsttss'.slice(0, 6), 9, ['triangle', 'square']), NX('>v<>v<', 3), NX('ccsscc', 2)] },
      p3: { items: [NX('cstdcstd', 3), NX('sstccsstcc'.slice(0, 10), 2), NTH('cstcst', 11, ['circle', 'square', 'triangle']), NTH('csdcsd', 10, ['circle', 'square', 'diamond']), NX('tcCtcC', 3), NX('^^v^^v', 3)] },
      think: {
        items: [{ q: 'Make a pattern with a core of 4 shapes.', draw: { h: 48, key: 'For example: circle, circle, square, triangle, then again.' } },
          { q: '{a} drew c s t c s c. What went wrong?', lines: { n: 2, key: 'After c s comes t. The core is c s t.' } },
          NTH('csdtcsdt', 9, ['circle', 'square', 'diamond', 'triangle']),
          { q: 'How many shapes are in this core?', pic: ['pat', { seq: 'stcdstcd', core: 4, blanks: 0, next: '' }], eq: ['[] shapes'], a: [4], coreOf: 'stcdstcd' }]
      }
    },

    gap: {
      watch: 'copying the shape beside the gap. Say the pattern from the start to find what fits.',
      goal: 'I can find what is missing in a pattern.',
      learn: {
        show: { cap: 'Say it: 2, 4, ?, 2, 4, 6', eq: ['2, 4, 6, 2, 4, 6'] },
        together: [CT([1, 2, '[]', 1, 2, 3], 0, '', 3), CT([5, '[]', 5, 7, 5, 7], 0, '', 2)],
        cue: 'Say the pattern from the start. What fits in the gap?',
        own: [CT([3, 3, 1, 3, '[]', 1], 0, '', 3), CT(['[]', 9, 8, 9, 8, 9], 0, '', 2), NTH('cscs', 3, ['circle', 'square']), NTH('tdstds', 4, ['triangle', 'diamond', 'square'])]
      },
      p1: { show: { eq: ['1, 2, 1, 2, 1, 2'] }, items: [CT([4, 6, 4, '[]', 4, 6], 0, '', 2), CT([1, '[]', 1, 5, 1, 5], 0, '', 2), CT([2, 2, 3, 2, '[]', 3], 0, '', 3), CT([7, 8, 9, '[]', 8, 9], 0, '', 3), NTH('stst', 3, ['square', 'triangle']), NTH('ccdccd', 5, ['circle', 'diamond'])] },
      p2: { items: [CT([10, 20, 10, '[]', 10, 20, '[]', 20], 0, '', 2), CT([3, 6, 9, 3, '[]', 9, '[]', 6], 0, '', 3), CT([1, 2, '[]', 4, 5], 1), CT([10, '[]', 30, 40, '[]'], 10), NTH('cstcst', 5, ['circle', 'square', 'triangle']), NTH('ddsdds', 6, ['diamond', 'square'])] },
      p3: { items: [CT([2, '[]', 6, 8, '[]', 12], 2), CT([5, 10, '[]', 20, '[]'], 5), CT([4, 4, 7, 4, '[]', 7, 4, 4, '[]'], 0, '', 3), CT(['[]', 1, 2, 0, 1, '[]', 0, 1, 2], 0, '', 3), CT([30, '[]', 40, 45, '[]'], 5), CT([48, 46, '[]', 42, '[]'], -2)] },
      think: {
        items: [{ q: '{b} filled 1, 3, 1, ?, 1, 3 with 1. What went wrong?', lines: { n: 2, key: 'The core is 1, 3, so the gap is 3.' } },
          { q: 'Make a number pattern with a gap for a friend.', lines: { n: 2, key: 'For example: 2, 5, 2, ?, 2, 5 (the gap is 5).' } },
          CT([20, 25, '[]', 35, '[]', 45], 5),
          CT(['[]', 7, 8, 6, 7, '[]'], 0, '', 3)]
      }
    },

    letters: {
      watch: 'giving each shape its own letter forever. A is the first shape, B the next new one, and so on.',
      goal: 'I can write a pattern with letters.',
      learn: {
        show: { pic: ['pat', { seq: 'cssc' + 'ss' }], cap: 'circle A, square B', eq: ['A B B A B B'] },
        together: [LT('stst', ['A B A B', 'A A B B']), LT('cctcct', ['A B A B A B', 'A A B A A B'])],
        cue: 'Give the first shape A. Give the next new shape B.',
        own: [LT('sscssc', ['A A B A A B', 'A B A B A B']), LT('cstcst', ['A B C A B C', 'A B A B A B'])]
      },
      p1: { show: { pic: ['pat', { seq: 'tsts' }], eq: ['A B A B'] }, items: [LT('cdcd', ['A B A B', 'A B C D']), LT('ttss', ['A A B B', 'A B A B']), LT('csscss', ['A B B A B B', 'A B A B A B']), LT('dctdct', ['A B C A B C', 'A B B A B B']), LT('><><', ['A B A B', 'A A B B']), LT('CCsCCs', ['A A B A A B', 'A B A B A B'])] },
      p2: { items: [LT('sCsC', ['A B A B', 'B A B A', 'A A B B']), LT('tttdtttd', ['A A A B A A A B', 'A B A B A B A B']), CT([1, 2, 1, 2, '[]', '[]'], 0, 'Write it with 1 and 2: A B A B A B.', 2), CT([5, 5, 7, '[]', '[]', '[]'], 0, 'Write it with 5 and 7: A A B A A B.', 3), LT('cstcst', ['A B C A B C', 'A B C C A B']), LT('ssdssd', ['A A B A A B', 'A B B A B B'])] },
      p3: { items: [LT('ctscts', ['A B C A B C', 'A B C A B A']), LT('ddssdd', ['A A B B A A', 'A B A B A B']), CT([3, 4, 4, '[]', '[]', '[]'], 0, 'Write it with 3 and 4: A B B A B B.', 3), CT([10, 20, 30, '[]', '[]', '[]'], 0, 'Write it with 10, 20, 30: A B C A B C.', 3), LT('^v>^v>', ['A B C A B C', 'A B A B A B']), LT('tCCtCC', ['A B B A B B', 'A A B A A B'])] },
      think: {
        items: [{ q: 'Make an A B B pattern with sounds or moves.', lines: { n: 2, key: 'For example: clap, stomp, stomp, clap, stomp, stomp.' } },
          { q: 'Show A B C A B C with shapes.', draw: { h: 48, key: 'For example: circle, square, triangle, circle, square, triangle.' } },
          { q: 'Why can c s c s and t d t d both be A B A B?', lines: { n: 2, key: 'They have the same structure: two things that take turns.' } },
          LT('dssdss', ['A B B A B B', 'A A B A A B'])]
      }
    },

    rule: {
      watch: 'finding the change between only two numbers. Check the rule works for every step.',
      goal: 'I can find the rule of a number pattern.',
      learn: {
        show: { cap: 'Each number is 2 more', eq: ['3, 5, 7, 9: add 2'] },
        together: [RU([2, 4, 6, 8], ['add 2', 'add 4']), CT([10, 15, 20, '[]', '[]'], 5)],
        cue: 'Find how much it changes each time. Check every step.',
        own: [RU([5, 10, 15, 20], ['add 10', 'add 5']), RU([20, 18, 16, 14], ['add 2', 'take away 2']), CT([1, 4, 7, '[]', '[]'], 3), CT([30, 27, 24, '[]', '[]'], -3)]
      },
      p1: { show: { eq: ['10, 20, 30: add 10'] }, items: [RU([1, 2, 3, 4], ['add 1', 'add 2']), RU([10, 20, 30, 40], ['add 1', 'add 10']), CT([2, 4, 6, '[]', '[]'], 2), CT([5, 10, 15, '[]', '[]'], 5), RU([9, 8, 7, 6], ['add 1', 'take away 1']), CT([11, 21, 31, '[]'], 10)] },
      p2: { items: [RU([3, 6, 9, 12], ['add 3', 'add 6']), RU([25, 20, 15, 10], ['take away 5', 'add 5']), CT([4, 8, 12, '[]', '[]'], 4), CT([45, 40, 35, '[]', '[]'], -5), CT([7, 9, 11, '[]', '[]'], 2), RU([12, 22, 32, 42], ['add 2', 'add 10'])] },
      p3: { items: [RU([1, 5, 9, 13], ['add 4', 'add 5', 'add 3']), RU([50, 40, 30, 20], ['take away 10', 'take away 5', 'add 10']), CT([6, 12, 18, '[]', '[]'], 6), CT([33, 30, 27, '[]', '[]'], -3), CT([0, 7, 14, '[]', '[]'], 7), CT([49, 39, 29, '[]', '[]'], -10)] },
      think: {
        items: [{ q: 'Make a pattern with the rule "add 4".', lines: { n: 1, key: 'For example: 2, 6, 10, 14, 18.' } },
          { q: '{a} says the rule of 5, 7, 10, 12 is add 2. Is {a} right?', pick: { opts: ['yes', 'no'], ans: 1 }, tf: '5 + 2 + 2 = 10' },
          { q: 'Start at 50. Take away 5 each time.', eq: ['50, [], [], [], []'], a: [45, 40, 35, 30], by: -5, wide: true },
          { q: 'How do you find a rule?', lines: { n: 2, key: 'See how much each number changes. Check it is the same every time.' } }]
      }
    },

    grow: {
      watch: 'repeating instead of growing. A growing pattern gets bigger by the same amount each time.',
      goal: 'I can find what comes next in a growing pattern.',
      learn: {
        show: { pic: ['towers', { v: [1, 2, 3] }], cap: 'Each tower is 1 taller', eq: ['next: 4'] },
        together: [TW([1, 2, 3]), TW([2, 4, 6])],
        cue: 'See how much it grows each time. Grow it the same again.',
        own: [TW([1, 3, 5]), KD([2, 4, 6, 8])]
      },
      p1: { show: { pic: ['towers', { v: [2, 3, 4] }], eq: ['next: 5'] }, items: [TW([2, 3, 4]), TW([1, 2, 3, 4]), TW([2, 4, 6]), KD([3, 5, 3, 5]), KD([5, 10, 15]), KD([1, 2, 3, 4])] },
      p2: { items: [TW([1, 4, 7]), TW([3, 5, 7]), TW([5, 6, 7]), KD([4, 4, 2, 4, 4, 2]), KD([10, 20, 30]), CT([1, 3, 5, '[]', '[]'], 2, 'It grows by 2.')] },
      p3: { items: [TW([2, 5, 8]), TW([1, 5, 9]), CT([4, 8, 12, '[]', '[]'], 4, 'It grows by 4.'), CT([10, 20, 30, '[]', '[]'], 10, 'It grows by 10.'), KD([7, 9, 7, 9]), KD([6, 9, 12])] },
      think: {
        items: [{ q: 'Draw the next tower.', pic: ['towers', { v: [1, 3, 5] }], draw: { h: 60, key: 'A tower of 7 cubes.' } },
          { q: 'How is a growing pattern different from a repeating one?', lines: { n: 2, key: 'A growing one gets bigger each time. A repeating one has a core that comes again.' } },
          { q: 'Make a growing pattern that adds 3.', lines: { n: 1, key: 'For example: 1, 4, 7, 10.' } },
          TW([3, 6, 9])]
      }
    },

    change: {
      watch: 'thinking a number never changes because it does not change today. Ask: could it be different another day?',
      goal: 'I can tell what changes and what stays the same.',
      learn: {
        show: { cap: 'Your age changes. A week always has 7 days.', eq: ['changes / stays the same'] },
        together: [VA('your age'), VA('the number of days in a week')],
        cue: 'Ask: could this be different another time?',
        own: [VA('the weather'), VA('the number of wheels on a bike'), VN([3, 3, 3, 3]), VN([2, 4, 6, 8])]
      },
      p1: { show: { eq: ['5, 5, 5, 5: stays the same'] }, items: [VA('your height'), VA('the number of months in a year'), VA('the time on a clock'), VA('the number of sides on a triangle'), VN([7, 7, 7]), VN([1, 2, 3])] },
      p2: { items: [VA('how many people are at the park'), VA('the number of fingers on one hand'), VA('the number of leaves on a tree'), VA('the number of legs on a spider'), VN([4, 4, 4, 4]), VN([10, 9, 8, 7])] },
      p3: { items: [VA('how many apples are in the bowl'), VA('the number of days in a week'), VA('the weather'), VA('the number of wheels on a bike'), VN([20, 20, 20]), VN([5, 6, 5, 6])] },
      think: {
        items: [{ q: 'Name something in your home that changes.', lines: { n: 2, key: 'For example: how much milk is in the fridge.' } },
          { q: 'Name something that always stays the same.', lines: { n: 2, key: 'For example: a week has 7 days.' } },
          { q: '{b} has 5 {many}. {b} gets 2 more each day. Does the number change?', pick: { opts: ['changes', 'stays the same'], ans: 0, vary: [5, 7, 9] }, wide: true },
          { q: 'Why does a spider always have 8 legs, but not always 8 flies?', lines: { n: 2, key: 'Legs are part of a spider. How many flies it catches is different each day.' } }]
      }
    }
  } });
})();
