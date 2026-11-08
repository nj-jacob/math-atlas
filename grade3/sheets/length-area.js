/* Grade 3 Length, Perimeter and Area: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per
   idea of the lessons in chapters/length-area.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020 (the codes the lessons name): E2.1 perimeter; E2.2 mm, cm, m and km, and how they relate; E2.5 the count of
   units and the size of the unit; E2.7 the same area in different shapes; E2.8 area by covering with squares, no gaps or
   overlaps; E2.9 square centimetres and square metres, and estimating area.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var MM = { mm: 1, cm: 10, m: 1000, km: 1000000 };
  /* "2 m 40 cm" in millimetres */
  function mm(s) { var t = 0; s.replace(/(\d+) (mm|cm|m|km)/g, function (x, n, u) { t += +n * MM[u]; }); return t; }
  /* which unit suits it (size in mm) */
  function UN(thing, size) { var u = size < 10 ? 'mm' : size < 1000 ? 'cm' : size < 1000000 ? 'm' : 'km', o = ['mm', 'cm', 'm', 'km']; return { q: 'Which unit for ' + thing + '?', pick: { opts: o, ans: o.indexOf(u), lenMM: size } }; }
  /* read a ruler: the ribbon is len cm long and starts at from */
  function RL(len, from, max) { return { q: 'How long is the ribbon?', pic: ['ruler', { len: len, from: from || 0, max: max || 10 }], eq: ['[] cm'], a: [len] }; }
  /* read a ruler in millimetres (len like 4.3) */
  function RM(len, both) {
    var m = Math.round(len * 10);
    return { q: 'How long is the ribbon?', pic: ['ruler', { len: len, from: 0, max: 8 }], eq: both ? ['[] cm [] mm', '[] mm'] : ['[] mm'], a: both ? [Math.floor(m / 10), m % 10, m] : [m] };
  }
  /* a change of unit: '3 m = [] cm' */
  function CV(left, unit) { return { eq: [left + ' = [] ' + unit], a: [mm(left) / MM[unit]] }; }
  /* compare two lengths with <, > or = */
  function CP(x, y) { var a = mm(x), b = mm(y); return { eq: [x + ' [] ' + y], a: [a < b ? '<' : a > b ? '>' : '='] }; }
  function LONG(opts) { var v = opts.map(mm), best = v.indexOf(Math.max.apply(null, v)); return { q: 'Circle the longest.', pick: { opts: opts, ans: best, longest: true }, wide: opts.join('').length > 16 }; }
  function SHORT(opts) { var v = opts.map(mm), best = v.indexOf(Math.min.apply(null, v)); return { q: 'Circle the shortest.', pick: { opts: opts, ans: best, shortest: true }, wide: opts.join('').length > 16 }; }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* units laid end to end: how many fit along a ribbon */
  function FIT(len, u, thing) { return { q: 'The ribbon is ' + len + ' cm. Each ' + thing + ' is ' + u + ' cm. How many ' + thing + 's?', pic: ['units', { n: len / u, unit: u + ' cm' }], eq: ['[] ' + thing + 's'], a: [len / u], calc: len + ' ÷ ' + u }; }
  /* perimeter of a shape with its sides written on */
  function PP(sides, sum) { var t = sides.reduce(function (x, y) { return x + y; }, 0); return { q: 'Find the perimeter.', pic: ['poly', { sides: sides }], eq: sum ? [sides.join(' + ') + ' = []'] : ['[] cm'], a: [t], find: sum ? null : 'perim' }; }
  /* perimeter of a rectangle (two sides labelled) */
  function PR(a, b) { return { q: 'Find the perimeter.', pic: ['rect', { a: a, b: b, unit: 'cm', w: Math.min(150, a * 16), h: Math.min(70, b * 16) }], eq: ['[] cm'], a: [2 * (a + b)], find: 'perim' }; }
  /* a missing side when the perimeter is known */
  function MS(sides, total) { var known = sides.filter(function (v) { return v !== '?'; }).reduce(function (x, y) { return x + y; }, 0); return { q: 'Perimeter ' + total + ' cm. Find the missing side.', pic: ['poly', { sides: sides }], eq: ['[] cm'], a: [total - known], find: 'side', perimTo: total }; }
  function PK(p, opts) { var ok = opts.map(function (o) { var d = o.split(' by '); return 2 * (+d[0] + +d[1]) === p; }); return { q: 'Circle the rectangle with a perimeter of ' + p + ' cm.', pick: { opts: opts, ans: ok.indexOf(true), perim: p } }; }
  /* squares on a grid, from rows of text ('x' a square): cells 'c,r' */
  function cells(rows) { var out = []; rows.forEach(function (r, y) { r.split('').forEach(function (ch, x) { if (ch === 'x') out.push(x + ',' + y); }); }); return out; }
  function grid(rows) { return ['area', { cols: rows[0].length, rows: rows.length, cells: cells(rows), u: 14 }]; }
  function AR(rows, unit) { return { q: 'Find the area.', pic: grid(rows), eq: ['[] ' + (unit || 'square units')], a: [cells(rows).length], find: 'area' }; }
  function PG(rows) { return { q: 'Find the perimeter. Each side of a square is 1 cm.', pic: grid(rows), eq: ['[] cm'], a: [perim(cells(rows))], find: 'perim' }; }
  function perim(cs) { var n = 0; cs.forEach(function (c) { var p = c.split(','); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { if (cs.indexOf((+p[0] + d[0]) + ',' + (+p[1] + d[1])) < 0) n++; }); }); return n; }
  /* two shapes: do they cover the same area? */
  function SA(r1, r2) { var same = cells(r1).length === cells(r2).length; return { q: 'Do A and B have the same area?', pic: ['row', { list: [grid(r1), grid(r2)], labels: ['A', 'B'], gap: 24 }], pick: { opts: ['yes', 'no'], ans: same ? 0 : 1 }, same: true }; }
  /* estimate a curved area: count squares more than half covered */
  function BL(o, n) { return { q: 'Estimate the area.', pic: ['blob', Object.assign({ u: 12 }, o)], eq: ['[] square units'], a: [n], find: 'total' }; }
  var B1 = { cols: 7, rows: 5, cx: 3.5, cy: 2.5, rx: 2.2, ry: 1.5 }, B2 = { cols: 7, rows: 6, cx: 3.5, cy: 3, rx: 2.5, ry: 1.9 }, B3 = { cols: 8, rows: 5, cx: 4, cy: 2.5, rx: 3, ry: 1.5 },
    B4 = { cols: 8, rows: 6, cx: 4, cy: 3, rx: 2.8, ry: 2.2 }, B5 = { cols: 9, rows: 5, cx: 4.5, cy: 2.5, rx: 2.7, ry: 1.8 }, B6 = { cols: 9, rows: 6, cx: 4.5, cy: 3, rx: 3.4, ry: 2.3 },
    B7 = { cols: 8, rows: 5, cx: 4, cy: 2.5, rx: 2, ry: 1.9 };
  /* perimeter or area? */
  function PA(q, ans) { return { q: q, pick: { opts: ['perimeter', 'area'], ans: ans === 'area' ? 1 : 0 } }; }
  function AU(thing, size) { return { q: 'Which unit for the area of ' + thing + '?', pick: { opts: ['cm²', 'm²'], ans: size < 2000 ? 0 : 1, areaUnit: size } }; }

  S.register('length-area', { code: 'LA', ideas: {

    bench: {
      watch: 'choosing a unit by habit, or a big unit for a small thing. Ask: smaller than a fingernail, about a step, or a long walk?',
      goal: 'I can choose a unit for a length.',
      learn: {
        show: { cap: '1 mm a dime\'s thickness, 1 cm a fingernail, 1 m a big step, 1 km a long walk', eq: ['mm  cm  m  km'] },
        together: [UN('a canoe', 5000), UN('an ant', 5)],
        cue: 'Fingernail: cm. Big step: m. Long walk: km. Smaller than a fingernail: mm.',
        own: [UN('a pencil', 180), UN('a hiking trail', 6000000), UN('a door', 2000), UN('a grain of rice', 6)]
      },
      p1: {
        show: { cap: 'A trail takes a long walk', eq: ['km'] },
        items: [UN('a book', 250), UN('a bus', 12000), UN('a ladybug', 7), UN('the road to the next town', 15000000), UN('a spoon', 150), UN('a hockey rink', 60000)]
      },
      p2: {
        items: [UN('a crayon', 90), UN('a flagpole', 9000), UN('a coin\'s thickness', 2), UN('a river', 80000000),
          { q: 'Name something about 1 m long.', lines: { n: 1, key: 'For example: a guitar, or a big step.' } }, { q: 'Name something about 1 cm wide.', lines: { n: 1, key: 'For example: a fingernail or a sugar cube.' } }]
      },
      p3: {
        items: [UN('a pine tree', 15000), UN('a paper clip', 30), UN('a bee\'s wing', 8), UN('a flight from Toronto to Ottawa', 350000000),
          { q: '{a} says a bed is about 2 km long. Is that right? Fix it.', lines: { n: 2, key: 'No. A bed is about 2 m long.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why not measure a road in centimetres?', lines: { n: 2, key: 'The number would be huge. Kilometres give a small, easy number.' } },
          { q: 'Find a benchmark on your body for 1 cm and 1 m.', lines: { n: 2, key: 'For example: a fingernail is about 1 cm; a big step is about 1 m.' } },
          { q: 'List 3 things you would measure in millimetres.', lines: { n: 2, key: 'For example: an ant, a seed, a coin\'s thickness.' } },
          { q: 'About how long is your walk to school or the park? Which unit?', lines: { n: 2, key: 'For example: about 1 km, or 500 m.' } }]
      }
    },

    ruler: {
      watch: 'reading the number at the far end when the object does not start at 0. Ask: where does it start, where does it end? Then subtract.',
      goal: 'I can measure with a ruler.',
      learn: {
        show: { pic: ['ruler', { len: 5, from: 3, max: 10 }], cap: 'Starts at 3, ends at 8', eq: ['8 − 3 = 5', '5 cm'] },
        together: [RL(7, 0), RL(4, 2)],
        cue: 'Find where it starts and where it ends. If it does not start at 0, subtract.',
        own: [RL(6, 0), RL(3, 4)]
      },
      p1: {
        show: { pic: ['ruler', { len: 7, from: 0, max: 10 }], cap: 'Starts at 0', eq: ['7 cm'] },
        items: [RL(4, 0), RL(8, 0), RL(3, 2), RL(5, 3), RL(6, 1), RL(2, 7)]
      },
      p2: {
        items: [RL(5, 4), RL(7, 2), RL(4, 5), RL(6, 3),
          { q: 'A ribbon starts at 2 and ends at 9. How long is it?', eq: ['[] cm'], a: [7], calc: '9 − 2' }, { q: 'A ribbon starts at 4 and ends at 10. How long is it?', eq: ['[] cm'], a: [6], calc: '10 − 4' }]
      },
      p3: {
        items: [RL(8, 1), RL(3, 6),
          { q: '{b} reads 9 cm for a ribbon from 3 to 9. What did {b} do wrong?', lines: { n: 2, key: '{b} read the end. It starts at 3: 9 − 3 = 6 cm.' } },
          { q: 'A stick goes from 5 to 12. How long is it?', eq: ['[] cm'], a: [7], calc: '12 − 5' },
          { q: 'Draw a line 6 cm long with a ruler.', draw: { h: 40, key: 'A straight line from 0 to 6 on the ruler.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why should one end be at 0?', lines: { n: 2, key: 'Then the number at the other end is the length.' } },
          { q: 'Your ruler is broken at the start. How can you still measure?', lines: { n: 2, key: 'Start at another mark, like 1, and subtract it from the end.' } },
          { q: 'Measure your pencil. Write its length.', lines: { n: 1, key: 'For example: 15 cm.' } },
          { q: 'Why must the ribbon lie straight along the ruler?', lines: { n: 2, key: 'A bent ribbon would look shorter than it is.' } }]
      }
    },

    mm: {
      watch: 'adding the cm and mm numbers (6 cm 8 mm = 14 mm). Count the 10 tiny spaces in 1 cm together.',
      goal: 'I can measure in millimetres.',
      learn: {
        show: { pic: ['ruler', { len: 4.3, from: 0, max: 8 }], cap: '4 cm is 40 mm, and 3 more', eq: ['40 + 3 = 43', '43 mm'] },
        together: [RM(3.6), RM(5.2)],
        cue: 'Each centimetre has 10 tiny spaces. Count the tens, then the extra millimetres.',
        own: [RM(2.4), RM(6.7), CV('3 cm', 'mm'), CV('7 cm', 'mm')]
      },
      p1: {
        show: { cap: '1 cm = 10 mm', eq: ['5 cm = 50 mm'] },
        items: [CV('4 cm', 'mm'), CV('9 cm', 'mm'), CV('6 cm 5 mm', 'mm'), CV('2 cm 8 mm', 'mm'), RM(4.5), RM(3.1)]
      },
      p2: {
        items: [RM(5.8, true), RM(2.9, true), CV('70 mm', 'cm'), CV('120 mm', 'cm'), CP('5 cm', '45 mm'), CP('3 cm', '30 mm')]
      },
      p3: {
        items: [RM(7.3, true), CV('8 cm 4 mm', 'mm'), CP('6 cm 2 mm', '65 mm'), CP('90 mm', '8 cm'),
          { q: '{a} says 6 cm 8 mm is 14 mm. What is it really?', eq: ['[] mm'], a: [68], len: 68 }, LONG(['4 cm', '38 mm', '4 cm 2 mm'])]
      },
      think: {
        items: [{ q: 'Why is 6 cm 8 mm not 14 mm?', lines: { n: 2, key: '6 cm is 60 mm, so it is 60 + 8 = 68 mm.' } },
          { q: 'When are millimetres better than centimetres?', lines: { n: 2, key: 'For small things, or when you need to be exact.' } },
          { q: 'Measure a coin across. Write it in mm.', lines: { n: 1, key: 'For example: a loonie is about 26 mm.' } },
          { q: 'Which is longer, 50 mm or 5 cm? Explain.', lines: { n: 2, key: 'They are the same: 5 cm is 50 mm.' } }]
      }
    },

    metre: {
      watch: 'using 10 for every change. Say the facts smallest first: 10 mm in 1 cm, 100 cm in 1 m, 1000 m in 1 km.',
      goal: 'I can change metres to centimetres and kilometres to metres.',
      learn: {
        show: { cap: 'One metre stick is 100 cm', eq: ['3 m = 300 cm', '1 km = 1000 m'] },
        together: [CV('2 m', 'cm'), CV('2 m 40 cm', 'cm')],
        cue: '100 cm in 1 m. 1000 m in 1 km. Change the big unit, then add the rest.',
        own: [CV('4 m', 'cm'), CV('1 m 60 cm', 'cm'), CV('3 km', 'm'), CV('5 m 5 cm', 'cm')]
      },
      p1: {
        show: { cap: '2 m and 40 cm', eq: ['200 + 40 = 240 cm'] },
        items: [CV('5 m', 'cm'), CV('7 m', 'cm'), CV('2 km', 'm'), CV('3 m 25 cm', 'cm'), CV('6 m 80 cm', 'cm'), CV('4 km', 'm')]
      },
      p2: {
        items: [CV('300 cm', 'm'), CV('8 m 15 cm', 'cm'), CV('5000 m', 'km'), CV('9 m 9 cm', 'cm'),
          story('A rope is 200 cm. {a} adds 50 cm more. How long is it?', 'cm', 250, '200 + 50'), story('A race is 1000 m. {b} has run 400 m. How far is left?', 'm', 600, '1000 − 400')]
      },
      p3: {
        items: [CV('1 km 500 m', 'm'), CV('4 m 7 cm', 'cm'),
          story('A track is 400 m. {a} runs it 3 times. How far is that?', 'm', 1200, '400 × 3'), story('Two ropes of 3 m, end to end. How long?', 'm', 6, '3 + 3'),
          { q: '{b} says 1 m = 10 cm. Fix it.', lines: { n: 1, key: '1 m = 100 cm.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why do we use km for trips and m for rooms?', lines: { n: 2, key: 'Each gives a small number that is easy to understand.' } },
          { q: 'How many metre sticks would fit across your room? Estimate.', lines: { n: 2, key: 'For example: about 4.' } },
          { q: 'Is 1 km longer than 900 m? Explain.', lines: { n: 2, key: 'Yes. 1 km is 1000 m.' } },
          { q: 'How many 10 m walks make 1 km?', lines: { n: 2, key: '100, because 100 × 10 = 1000 m.' } }]
      }
    },

    compare: {
      watch: 'comparing the numbers and ignoring the units (150 cm "beats" 2 m). Change to the same unit first.',
      goal: 'I can compare lengths in different units.',
      learn: {
        show: { cap: '2 m or 150 cm? 2 m is 200 cm.', eq: ['2 m > 150 cm'] },
        together: [CP('3 m', '250 cm'), CP('5 cm', '45 mm')],
        cue: 'Are the units the same? If not, change the bigger unit to the smaller one. Then compare.',
        own: [CP('1 m', '90 cm'), CP('2 km', '2500 m'), CP('40 mm', '4 cm'), CP('6 m', '700 cm')]
      },
      p1: {
        show: { cap: '5 cm is 50 mm', eq: ['5 cm > 45 mm'] },
        items: [CP('4 m', '350 cm'), CP('7 cm', '80 mm'), CP('1 km', '1000 m'), CP('3 m', '310 cm'), CP('60 mm', '6 cm'), CP('2 km', '1900 m')]
      },
      p2: {
        items: [LONG(['2 m', '150 cm', '90 cm']), SHORT(['3 cm', '25 mm', '4 cm']), LONG(['1 km', '800 m', '950 m']), CP('1 m 20 cm', '125 cm'),
          CP('8 cm 5 mm', '90 mm'), CP('4 m 50 cm', '450 cm')]
      },
      p3: {
        items: [LONG(['3 m', '280 cm', '3 m 10 cm']), SHORT(['5 cm', '48 mm', '5 cm 1 mm']),
          { q: '{a} jumps 2 m. {b} jumps 185 cm. Who jumps farther?', pick: { opts: ['{a}', '{b}'], ans: 0 }, cmp: ['2 m', '185 cm'] },
          { q: 'A worm is 9 cm. A snail trail is 95 mm. Which is longer?', pick: { opts: ['worm', 'trail'], ans: 1 }, cmp: ['9 cm', '95 mm'] },
          { q: 'Order from shortest: 2 m, 150 cm, 2 m 5 cm.', lines: { n: 1, key: '150 cm, 2 m, 2 m 5 cm' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why is 150 cm shorter than 2 m, even though 150 is bigger than 2?', lines: { n: 3, key: 'A metre is much bigger than a centimetre. 2 m is 200 cm.' } },
          { q: 'How do you change metres to centimetres?', lines: { n: 2, key: 'Each metre is 100 cm, so count hundreds.' } },
          { q: 'Write two lengths in different units that are equal.', lines: { n: 1, key: 'For example: 3 m and 300 cm.' } },
          { q: 'Who is taller: someone 1 m 30 cm or someone 128 cm?', lines: { n: 2, key: '1 m 30 cm, which is 130 cm.' } }]
      }
    },

    count: {
      watch: 'giving the length in cm as the count (24 sticks), or leaving gaps between units. Count by the size of one unit.',
      goal: 'I can measure by laying units end to end.',
      learn: {
        show: { pic: ['units', { n: 6, unit: '4 cm' }], cap: 'A 24 cm ribbon. Sticks of 4 cm.', eq: ['4, 8, 12, 16, 20, 24', '6 sticks'] },
        together: [FIT(30, 5, 'block'), FIT(12, 2, 'clip')],
        cue: 'Lay the units end to end, no gaps. Count by the size of one unit.',
        own: [FIT(20, 4, 'stick'), FIT(18, 3, 'bead')]
      },
      p1: {
        show: { pic: ['units', { n: 5, unit: '2 cm' }], cap: '5 erasers of 2 cm', eq: ['5 × 2 = 10 cm'] },
        items: [FIT(15, 5, 'block'), FIT(16, 4, 'stick'), FIT(10, 2, 'eraser'), FIT(21, 3, 'bead')]
      },
      p2: {
        items: [{ q: '4 sticks of 6 cm fit along the ribbon. How long is it?', pic: ['units', { n: 4, unit: '6 cm' }], eq: ['[] cm'], a: [24], calc: '4 × 6' },
          { q: '7 beads of 3 cm fit along the ribbon. How long is it?', pic: ['units', { n: 7, unit: '3 cm' }], eq: ['[] cm'], a: [21], calc: '7 × 3' },
          story('A shelf holds 8 books, each 5 cm thick. How long is the row?', 'cm', 40, '8 × 5'), story('A 35 cm path is made of 7 tiles. How long is each tile?', 'cm', 5, '35 ÷ 7')]
      },
      p3: {
        items: [FIT(40, 8, 'pencil'), story('9 paper clips of 3 cm. How long?', 'cm', 27, '9 × 3'),
          { q: '{a} counted 12 sticks along a 12 cm ribbon with 2 cm sticks. What went wrong?', lines: { n: 2, key: '{a} used the length as the count. 12 ÷ 2 = 6 sticks.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why must there be no gaps between the units?', lines: { n: 2, key: 'Gaps leave some length uncounted, so the answer is too small.' } },
          { q: 'Measure your table with your hand spans. How many?', lines: { n: 1, key: 'For example: about 9 spans.' } },
          { q: 'Why would two people get different hand-span counts?', lines: { n: 2, key: 'Their hands are different sizes.' } },
          { q: 'How could you check a count of 6 sticks of 4 cm?', lines: { n: 2, key: '6 × 4 = 24, which should be the length.' } }]
      }
    },

    size: {
      watch: 'thinking a bigger count means a longer object. Lay both sets of units under the same ribbon and compare.',
      goal: 'I know a bigger unit gives a smaller count.',
      learn: {
        show: { pic: ['row', { list: [['units', { n: 6, unit: '2 cm' }], ['units', { n: 2, unit: '6 cm' }]], gap: 20 }], cap: 'The same ribbon', eq: ['6 small, 2 big'] },
        together: [FIT(24, 3, 'clip'), FIT(24, 12, 'pencil')],
        cue: 'The ribbon does not change. A bigger unit fits fewer times.',
        own: [FIT(20, 2, 'eraser'), FIT(20, 5, 'block')]
      },
      p1: {
        show: { cap: '12 cm: 6 of 2 cm, or 3 of 4 cm', eq: ['bigger unit, smaller count'] },
        items: [FIT(12, 2, 'clip'), FIT(12, 4, 'stick'), FIT(30, 3, 'bead'), FIT(30, 10, 'block')]
      },
      p2: {
        items: [{ q: 'A ribbon is 8 sticks long, or 4 pencils long. Which unit is bigger?', pick: { opts: ['stick', 'pencil'], ans: 1 }, count: { stick: 8, pencil: 4 } },
          { q: 'A table is 10 hands long, or 20 pencils long. Which unit is bigger?', pick: { opts: ['hand', 'pencil'], ans: 0 }, count: { hand: 10, pencil: 20 } },
          story('A desk is 6 rulers of 30 cm. How long is it?', 'cm', 180, '6 × 30'), story('A 180 cm desk in 10 cm blocks. How many blocks?', 'blocks', 18, '180 ÷ 10')]
      },
      p3: {
        items: [{ q: 'A path is 12 small steps or 8 big steps. Which step is bigger?', pick: { opts: ['small', 'big'], ans: 1 }, count: { small: 12, big: 8 } },
          story('A 36 cm shelf: how many 4 cm cubes fit?', 'cubes', 9, '36 ÷ 4'), story('A 36 cm shelf: how many 9 cm books fit?', 'books', 4, '36 ÷ 9'),
          { q: '{b} says 12 erasers is longer than 4 crayons. What do you ask {b}?', lines: { n: 2, key: 'How long is each? The units are different sizes, so compare the lengths, not the counts.' } }]
      },
      think: {
        items: [{ q: 'Why does a bigger unit give a smaller count?', lines: { n: 2, key: 'Each big unit covers more, so fewer are needed.' } },
          { q: 'Measure a book with clips and with pencils. Which count is bigger?', lines: { n: 2, key: 'The clips, because they are smaller.' } },
          { q: 'Why do we use standard units like cm?', lines: { n: 2, key: 'So everyone gets the same count for the same length.' } },
          { q: 'Can two counts be different and the lengths the same? Explain.', lines: { n: 2, key: 'Yes, if the units are different sizes.' } }]
      }
    },

    around: {
      watch: 'missing a side or adding one twice. Put a finger on a corner, tick each side, and stop at the start.',
      goal: 'I can find the perimeter by adding every side.',
      learn: {
        show: { pic: ['poly', { sides: [4, 5, 6] }], cap: 'Walk around: 4, then 5, then 6', eq: ['4 + 5 + 6 = 15', '15 cm'] },
        together: [PP([3, 4, 5], true), PP([2, 3, 4, 5])],
        cue: 'Start at a corner. Add each side as you walk around. Stop back at the start.',
        own: [PP([6, 6, 6]), PP([3, 5, 4, 6, 2])]
      },
      p1: {
        show: { pic: ['poly', { sides: [3, 5, 4, 6, 2] }], cap: '5 sides, 5 numbers', eq: ['20 cm'] },
        items: [PP([5, 5, 5]), PP([2, 6, 7]), PP([3, 6, 3, 6]), PP([2, 3, 4, 5, 6])]
      },
      p2: {
        items: [PP([12, 10, 15]), PP([7, 8, 9], true),
          story('A triangle garden has sides of 4 m, 5 m and 6 m. How much fence goes around?', 'm', 15, '4 + 5 + 6'), story('A square stamp has sides of 3 cm. What is its perimeter?', 'cm', 12, '3 + 3 + 3 + 3')]
      },
      p3: {
        items: [PP([10, 20, 15, 25]), PP([7, 7, 7, 7, 7, 7]), PG(['xxx', 'xxx']), PG(['xxxx', 'x...']),
          { q: '{a} adds 4 + 5 + 6 and gets 15 cm for a shape with 4 sides. What is missing?', lines: { n: 2, key: 'The fourth side. A 4-sided shape needs 4 numbers.' }, wide: true }]
      },
      think: {
        items: [{ q: 'What is perimeter?', lines: { n: 2, key: 'The distance all the way around a shape.' } },
          { q: 'How can you be sure you added every side once?', lines: { n: 2, key: 'Tick each side, and count the numbers: one per side.' } },
          { q: 'Find the perimeter of your book. Show your sum.', lines: { n: 2, key: 'For example: 25 + 20 + 25 + 20 = 90 cm.' } },
          { q: 'Where would you need a perimeter at home?', lines: { n: 2, key: 'For example: a fence for a garden, or trim around a picture.' } }]
      }
    },

    rect: {
      watch: 'adding only the two labelled sides. A rectangle has four sides: write all four numbers before adding.',
      goal: 'I can find the perimeter of a rectangle.',
      learn: {
        show: { pic: ['rect', { a: 5, b: 3, unit: 'cm', w: 80, h: 48 }], cap: 'The sides across match', eq: ['5 + 3 + 5 + 3 = 16', '16 cm'] },
        together: [PR(7, 2), PR(4, 4)],
        cue: 'Write all four sides: long, short, long, short. Then add.',
        own: [PR(6, 3), PR(5, 5)]
      },
      p1: {
        show: { cap: '7 cm by 2 cm', eq: ['7 + 2 + 7 + 2 = 18 cm'] },
        items: [PR(4, 2), PR(6, 1), PR(5, 4), PR(8, 3)]
      },
      p2: {
        items: [PR(10, 2), PR(9, 6), { eq: ['6 + 4 + 6 + 4 = []'], a: [20] }, { eq: ['8 + 5 + 8 + 5 = []'], a: [26] },
          story('A rug is 3 m by 2 m. How much trim goes around it?', 'm', 10, '3 + 2 + 3 + 2'), story('A photo is 15 cm by 10 cm. What is its perimeter?', 'cm', 50, '15 + 10 + 15 + 10')]
      },
      p3: {
        items: [PR(12, 5), PR(20, 10), PK(12, ['4 by 2', '5 by 2', '3 by 2']), PK(20, ['6 by 3', '7 by 3', '5 by 4']),
          { q: '{b} says the perimeter of a 7 cm by 2 cm rectangle is 9 cm. Fix it.', lines: { n: 2, key: '9 is only two sides. 7 + 2 + 7 + 2 = 18 cm.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why are only two sides of a rectangle labelled?', lines: { n: 2, key: 'The sides across from each other are the same length.' } },
          { q: 'Find a quick way to get the perimeter of a 6 by 4 rectangle.', lines: { n: 2, key: 'Add 6 + 4 = 10, then double it: 20.' } },
          { q: 'Can two different rectangles have the same perimeter? Show one.', lines: { n: 2, key: 'Yes: 4 by 2 and 5 by 1 both have 12.' } },
          { q: 'Draw a rectangle with a perimeter of 10 squares.', draw: { h: 80, key: 'For example: 3 by 2.' } }]
      }
    },

    curve: {
      watch: 'measuring straight across a curved shape, or forgetting the straight side. Wrap a string, then lay it on a ruler.',
      goal: 'I can measure around a curved shape with a string.',
      learn: {
        show: { cap: 'String around a plate, then straight on a ruler', eq: ['26 cm'] },
        together: [story('The string around a jar is 24 cm. What is the perimeter of the jar\'s lid?', 'cm', 24, '24'), story('An arch window: the curve is 34 cm and the bottom is 15 cm. Perimeter?', 'cm', 49, '34 + 15')],
        cue: 'A string bends to fit the curve. Lay it straight on a ruler to read it. Add any straight sides.',
        own: [story('A half-circle: the curve is 20 cm and the straight side is 13 cm. Perimeter?', 'cm', 33, '20 + 13'), story('The string around a clock is 60 cm. Perimeter?', 'cm', 60, '60')]
      },
      p1: {
        show: { cap: 'Curve 34 cm + straight side 15 cm', eq: ['49 cm'] },
        items: [{ q: 'The string is laid on a ruler. How long is it?', pic: ['ruler', { len: 9, from: 0, max: 10 }], eq: ['[] cm'], a: [9] },
          { q: 'The string is laid on a ruler. How long is it?', pic: ['ruler', { len: 7, from: 2, max: 10 }], eq: ['[] cm'], a: [7] },
          story('A pond\'s curve is 18 m and its straight edge is 6 m. Perimeter?', 'm', 24, '18 + 6'), story('A tunnel door: curve 50 cm, bottom 30 cm. Perimeter?', 'cm', 80, '50 + 30')]
      },
      p2: {
        items: [story('A slice of pizza: two straight sides of 15 cm and a crust of 12 cm. Perimeter?', 'cm', 42, '15 + 15 + 12'), story('A cookie: the string around it is 22 cm. Perimeter?', 'cm', 22, '22'),
          { q: 'What tool would you use to measure around a tree?', pick: { opts: ['string', 'ruler'], ans: 0 }, tool: 'curve' },
          { q: 'What tool would you use to measure a book\'s side?', pick: { opts: ['string', 'ruler'], ans: 1 }, tool: 'straight' }]
      },
      p3: {
        items: [story('A track: two straight parts of 100 m and two curves of 60 m. Perimeter?', 'm', 320, '100 + 100 + 60 + 60'), story('A D shape: curve 26 cm, straight side 10 cm. Perimeter?', 'cm', 36, '26 + 10'),
          { q: '{a} measures straight across a plate and gets 20 cm. Is that the perimeter?', lines: { n: 2, key: 'No. That is across. The perimeter goes all the way around the curve.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why can\'t you use a ruler alone around a curve?', lines: { n: 2, key: 'A ruler is straight; it cannot bend around the curve.' } },
          { q: 'Measure around your wrist with a string. How long?', lines: { n: 1, key: 'For example: about 14 cm.' } },
          { q: 'Is the distance around a plate more or less than straight across?', lines: { n: 2, key: 'More: about 3 times as long.' } },
          { q: 'What else could bend around a curve instead of string?', lines: { n: 2, key: 'For example: a measuring tape or a ribbon.' } }]
      }
    },

    build: {
      watch: 'stopping at the sum of the known sides, or using the perimeter as a side. Ask: what must they add to? What do we have?',
      goal: 'I can make a shape with a given perimeter.',
      learn: {
        show: { pic: ['poly', { sides: [4, 6, '?'] }], cap: 'Perimeter 15 cm. 4 + 6 = 10.', eq: ['15 − 10 = 5 cm'] },
        together: [MS([3, 5, '?'], 12), MS([4, 2, 4, '?'], 12)],
        cue: 'Add the sides you know. Take that from the perimeter. The rest is the missing side.',
        own: [MS([5, 5, '?'], 16), MS([7, 4, '?'], 18)]
      },
      p1: {
        show: { cap: 'A 12 cm perimeter', eq: ['4 by 2, 5 by 1, 3 by 3'] },
        items: [MS([2, 4, '?'], 10), MS([7, 3, '?'], 15), PK(12, ['4 by 2', '4 by 3', '6 by 2']), PK(10, ['3 by 2', '4 by 2', '5 by 2'])]
      },
      p2: {
        items: [MS([5, 4, 5, '?'], 18), MS([2, 3, 4, 5, '?'], 20), PK(16, ['5 by 3', '4 by 3', '6 by 3']),
          { q: 'Draw a rectangle with a perimeter of 12 squares.', draw: { h: 80, key: 'For example: 4 by 2, 5 by 1 or 3 by 3.' }, wide: true }]
      },
      p3: {
        items: [MS([10, 8, '?'], 25), MS([6, 6, 6, 6, '?'], 30), PK(24, ['8 by 4', '7 by 4', '6 by 5']),
          { q: 'Find two rectangles with a perimeter of 14 cm.', lines: { n: 2, key: 'For example: 5 by 2 and 4 by 3 (or 6 by 1).' }, wide: true }]
      },
      think: {
        items: [{ q: 'How many rectangles have a perimeter of 12 squares? List them.', lines: { n: 2, key: '3: 5 by 1, 4 by 2 and 3 by 3.' } },
          { q: '{b} thinks the missing side of a 15 cm triangle with sides 4 and 6 is 15. Why is that wrong?', lines: { n: 3, key: '15 is the whole way around. 4 + 6 = 10, so the last side is 5.' } },
          { q: 'Make a shape with a string 20 cm long. What shape did you make?', lines: { n: 2, key: 'Any shape whose sides add to 20 cm.' } },
          { q: 'Why can a square have a perimeter of 12 but not of 13 squares?', lines: { n: 2, key: 'A square has 4 equal sides; 13 cannot be split into 4 equal whole sides.' } }]
      }
    },

    cover: {
      watch: 'counting the squares along the edge only, or counting rows. Colour each square as you count, row by row.',
      goal: 'I can find area by counting squares.',
      learn: {
        show: { pic: grid(['xxxx', 'xxxx', 'xx..']), cap: 'Row by row: 4 + 4 + 2', eq: ['10 square units'] },
        together: [AR(['xxx', 'xxx']), AR(['xxxxx', 'xx...', 'xx...'])],
        cue: 'Count every square inside, row by row. Area is in square units.',
        own: [AR(['xxxx', 'xxxx']), AR(['xxx.', 'xxxx', 'xx..']), AR(['xx', 'xx', 'xx']), AR(['x...', 'xxx.', 'xxxx'])]
      },
      p1: {
        show: { pic: grid(['xx', 'xx', 'xxxxx']), cap: '2 + 2 + 5', eq: ['9 square units'] },
        items: [AR(['xx', 'xx']), AR(['xxx', 'xxx', 'xxx']), AR(['xxxxx']), AR(['xxxx', 'xx..']), AR(['xxx', '.x.', 'xxx']), AR(['xxxxx', 'xxxxx'])]
      },
      p2: {
        items: [AR(['xxxxxx', 'xxxxxx', 'xxx...']), AR(['x..x', 'xxxx', 'x..x']), AR(['.xx.', 'xxxx', 'xxxx', '.xx.']), AR(['xxxxxxx', 'xxxxxxx']),
          { q: 'A rug is 4 squares by 3 squares. What is its area?', eq: ['[] square units'], a: [12], calc: '4 × 3' }, { q: 'A patio is 5 rows of 6 tiles. How many tiles?', eq: ['[] tiles'], a: [30], calc: '5 × 6' }]
      },
      p3: {
        items: [AR(['xxxxxxxx', 'xxxxxxxx', 'xxxxxxxx']), AR(['xxx...', 'xxxxxx', 'xxxxxx', '...xxx']),
          { q: '{a} says the area of a 3 by 4 rectangle is 7. What did {a} do?', lines: { n: 2, key: '{a} added the sides. The area is 3 × 4 = 12 squares.' } },
          { q: 'Draw a shape with an area of 8 squares.', draw: { h: 80, key: 'For example: a 4 by 2 rectangle.' } }]
      },
      think: {
        items: [{ q: 'What is area?', lines: { n: 2, key: 'The space a flat shape covers, counted in squares.' } },
          { q: 'How can you count squares quickly in a rectangle?', lines: { n: 2, key: 'Count one row, then add the row again for each row (or multiply).' } },
          { q: 'Cover a book with sticky notes. How many did you need?', lines: { n: 1, key: 'For example: 12.' } },
          { q: 'Why do we count squares, not circles, for area?', lines: { n: 2, key: 'Squares fit together with no gaps.' } }]
      }
    },

    gaps: {
      watch: 'thinking any tiling gives the area. Gaps make the count too low, overlaps too high.',
      goal: 'I can cover a shape with no gaps and no overlaps.',
      learn: {
        show: { cap: 'Gaps: the count is too small. Overlaps: too big.', eq: ['no gaps, no overlaps'] },
        together: [{ q: 'Tiles with gaps give an area that is', pick: { opts: ['too small', 'too big'], ans: 0, cover: 'gaps' } }, { q: 'Tiles that overlap give an area that is', pick: { opts: ['too small', 'too big'], ans: 1, cover: 'overlaps' } }],
        cue: 'Tiles must touch edge to edge. No spaces between them, and none on top of each other.',
        own: [AR(['xxx', 'xxx', 'xxx']), AR(['xxxx', 'x..x', 'xxxx'])]
      },
      p1: {
        show: { cap: 'A book covered with no gaps', eq: ['12 notes'] },
        items: [{ q: '{a} left gaps. Is the count too small or too big?', pick: { opts: ['too small', 'too big'], ans: 0, cover: 'gaps' } }, { q: '{b} overlapped tiles. Is the count too small or too big?', pick: { opts: ['too small', 'too big'], ans: 1, cover: 'overlaps' } },
          AR(['xxxxx', 'xxxxx']), AR(['xx.xx', 'xxxxx'])]
      },
      p2: {
        items: [AR(['xxxxxx', 'x....x', 'xxxxxx']), AR(['xxx', 'xxx', 'xxx', 'xxx']),
          { q: 'Why are squares good tiles for measuring area?', lines: { n: 2, key: 'They fit together with no gaps or overlaps.' } }, { q: 'Why are circles poor tiles?', lines: { n: 2, key: 'They leave gaps between them.' } }]
      },
      p3: {
        items: [AR(['xxxxxxx', 'xxxxxxx', 'xxxxxxx']), AR(['.xxx.', 'xxxxx', 'xxxxx', '.xxx.']),
          { q: '{a} counts 10 tiles on a mat, but two overlap. Is 10 too small or too big?', pick: { opts: ['too small', 'too big'], ans: 1, cover: 'overlaps' } },
          { q: 'Draw tiles covering a rectangle with no gaps and no overlaps.', draw: { h: 70, key: 'A rectangle filled edge to edge with squares.' } }]
      },
      think: {
        items: [{ q: 'Cover a book with sticky notes two ways, one with gaps. Compare the counts.', lines: { n: 2, key: 'The count with gaps is smaller, so it is wrong.' } },
          { q: 'Which shapes tile with no gaps?', lines: { n: 2, key: 'Squares, rectangles, triangles and hexagons.' } },
          { q: 'What happens to the area if tiles overlap?', lines: { n: 2, key: 'The count is too big: some space is counted twice.' } },
          { q: 'Explain "no gaps, no overlaps" to a younger child.', lines: { n: 2, key: 'Tiles touch edge to edge, with no holes and none on top.' } }]
      }
    },

    same: {
      watch: 'judging area by how long or tall a shape looks. Count the squares before and after moving the parts.',
      goal: 'I can show the same area in different shapes.',
      learn: {
        show: { pic: ['row', { list: [grid(['xxxx', 'xxxx']), grid(['xxxxxxxx'])], labels: ['A', 'B'], gap: 24 }], cap: 'A and B: 8 squares each', eq: ['same area'] },
        together: [SA(['xxx', 'xxx'], ['xx', 'xx', 'xx']), SA(['xxxx', 'xxxx'], ['xxx', 'xxx'])],
        cue: 'Count the squares in each. A different shape can cover the same area.',
        own: [SA(['xxxxxx'], ['xxx', 'xxx']), SA(['xx', 'xx'], ['xxxxx'])]
      },
      p1: {
        show: { cap: 'Move a part: the area stays the same', eq: ['6 = 6'] },
        items: [SA(['xxxx'], ['xx', 'xx']), SA(['xxx', 'xx.'], ['xxxx', 'x...']), SA(['xxxxx', 'x....'], ['xxx', 'xx.']), SA(['xx', 'xx', 'xx'], ['xxxx', 'xx..'])]
      },
      p2: {
        items: [SA(['xxx', 'xxx', 'xxx'], ['xxxxx', 'xxxx.']), SA(['xxxxxx', 'xxxxxx'], ['xxxx', 'xxxx', 'xxxx']),
          { q: 'Draw a different shape with an area of 6 squares.', draw: { h: 70, key: 'For example: 3 by 2, 6 by 1, or an L shape of 6.' } }, { q: 'Draw two shapes with an area of 4 squares.', draw: { h: 70, key: 'For example: a 2 by 2 square and a 4 by 1 strip.' } }]
      },
      p3: {
        items: [SA(['xxxx.', 'xxxxx', '.xxxx'], ['xxxxx', 'xxxxx', 'xxx..']), SA(['.xx.', 'xxxx', '.xx.'], ['xxx', 'xxx']),
          { q: '{b} says the long strip has more area because it is longer. Is {b} right?', lines: { n: 2, key: 'Not always. Count the squares: a long thin strip can have the same area.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Cut a paper rectangle into 2 pieces and move one. Did the area change? Why?', lines: { n: 3, key: 'No. The same squares are there, just moved.' } },
          { q: 'How many rectangles can you make with 12 squares?', lines: { n: 2, key: '3 shapes: 12 by 1, 6 by 2, 4 by 3 (and turned).' } },
          { q: 'Can two shapes have the same area but different perimeters?', lines: { n: 2, key: 'Yes: 4 by 1 has perimeter 10; 2 by 2 has perimeter 8.' } },
          { q: 'Design a garden with an area of 10 squares. Draw it.', draw: { h: 80, key: 'Any shape of 10 squares.' } }]
      }
    },

    cm2: {
      watch: 'writing cm instead of cm², or using square centimetres for a floor. Mark out 1 m² on the floor with tape.',
      goal: 'I can measure area in square centimetres and square metres.',
      learn: {
        show: { cap: '1 cm² is a square 1 cm on each side. 1 m² is a square 1 m on each side.', eq: ['stamp: cm²', 'floor: m²'] },
        together: [AU('a stamp', 6), AU('a classroom floor', 600000)],
        cue: 'Small things: square centimetres. Floors and fields: square metres.',
        own: [AR(['xxx', 'xxx'], 'cm²'), AU('a soccer field', 70000000), AU('a sticky note', 50), AR(['xxxx', 'xxxx', 'xxxx'], 'cm²')]
      },
      p1: {
        show: { pic: grid(['xxxx', 'xxxx']), cap: 'Each square is 1 cm²', eq: ['8 cm²'] },
        items: [AR(['xxxxx', 'xxxxx'], 'cm²'), AR(['xx', 'xx', 'xx', 'xx'], 'cm²'), AU('a bedroom floor', 120000), AU('a coin', 4), AU('a playground', 5000000), AU('a playing card', 50)]
      },
      p2: {
        items: [AR(['xxxxxx', 'xxxxxx', 'xxxxxx'], 'm²'), AR(['xxx..', 'xxxxx', 'xxxxx'], 'm²'), AU('a picture book cover', 600), AU('a parking lot', 9000000),
          { q: 'A rug is 2 m by 3 m. What is its area?', eq: ['[] m²'], a: [6], calc: '2 × 3' }, { q: 'A card is 5 cm by 4 cm. What is its area?', eq: ['[] cm²'], a: [20], calc: '5 × 4' }]
      },
      p3: {
        items: [{ q: 'A garden is 6 m by 4 m. What is its area?', eq: ['[] m²'], a: [24], calc: '6 × 4' }, { q: 'A tile is 10 cm by 10 cm. What is its area?', eq: ['[] cm²'], a: [100], calc: '10 × 10' },
          AU('a hockey rink', 18000000), AU('a postcard', 150),
          { q: 'About how many children can stand on 1 m²?', lines: { n: 1, key: 'For example: about 4 to 6.' }, wide: true }]
      },
      think: {
        items: [{ q: 'What is the difference between cm and cm²?', lines: { n: 2, key: 'cm measures a length; cm² measures the area of a square 1 cm on each side.' } },
          { q: 'Why measure a floor in m², not cm²?', lines: { n: 2, key: 'In cm² the number would be huge.' } },
          { q: 'Mark 1 m² with tape. What fits on it?', lines: { n: 2, key: 'For example: a small table, or 4 children standing.' } },
          { q: 'Find something with an area of about 1 cm².', lines: { n: 1, key: 'For example: a fingernail.' } }]
      }
    },

    curved: {
      watch: 'counting every square the shape touches, or only the full ones. Count full squares and squares more than half covered.',
      goal: 'I can estimate the area of a curved shape.',
      learn: {
        show: { pic: ['blob', B1], cap: 'Count squares more than half covered', eq: ['about 11 square units'] },
        together: [BL(B7, 12), BL(B3, 14)],
        cue: 'Count the full squares and the squares more than half covered. Skip the ones less than half.',
        own: [BL(B2, 16)]
      },
      p1: {
        show: { cap: 'Full squares and more-than-half squares count', eq: ['less than half: skip'] },
        items: [BL(B1, 11), BL(B4, 20), BL(B7, 12), BL(B2, 16)]
      },
      p2: {
        items: [BL(B6, 24), BL(B3, 14),
          { q: 'Trace your hand on squared paper. Estimate its area.', lines: { n: 1, key: 'For example: about 60 squares.' } }, { q: 'Why is a curved area an estimate?', lines: { n: 2, key: 'Some squares are only partly covered.' } }]
      },
      p3: {
        items: [BL(B5, 15), BL(B6, 24),
          { q: '{a} counts every square the shape touches. Is the estimate too big or too small?', pick: { opts: ['too small', 'too big'], ans: 1, cover: 'overlaps' } },
          { q: '{b} counts only full squares. Is the estimate too big or too small?', pick: { opts: ['too small', 'too big'], ans: 0, cover: 'gaps' } }]
      },
      think: {
        items: [{ q: 'Why do we skip squares less than half covered?', lines: { n: 2, key: 'They balance the more-than-half squares we count as whole.' } },
          { q: 'Estimate the area of a leaf on squared paper.', lines: { n: 1, key: 'For example: about 20 squares.' } },
          { q: 'How could you get a closer estimate?', lines: { n: 2, key: 'Use smaller squares.' } },
          { q: 'Two leaves: one 18 squares, one 25. Which is bigger? How much?', lines: { n: 2, key: 'The 25-square leaf, by about 7 squares.' } }]
      }
    },

    which: {
      watch: 'adding sides when the question is about covering, or counting squares for a fence. Ask: around the edge, or the inside?',
      goal: 'I can tell perimeter from area.',
      learn: {
        show: { pic: grid(['xxx', 'xxx']), cap: 'Around: 10 cm. Inside: 6 square units.', eq: ['perimeter 10, area 6'] },
        together: [PA('A fence around a garden', 'perimeter'), PA('Grass seed to cover a lawn', 'area')],
        cue: 'Around the edge: perimeter (add sides). Covering the inside: area (count squares).',
        own: [PA('Carpet for a floor', 'area'), PA('A frame around a picture', 'perimeter'), PG(['xxxx', 'xxxx']), AR(['xxxx', 'xxxx'])]
      },
      p1: {
        show: { cap: 'Fence: around. Carpet: inside.', eq: ['perimeter, area'] },
        items: [PA('Paint to cover a wall', 'area'), PA('Lace around a pillow', 'perimeter'), PA('Tiles for a floor', 'area'), PA('A border around a bulletin board', 'perimeter'), PG(['xxx', 'xxx', 'xxx']), AR(['xxx', 'xxx', 'xxx'])]
      },
      p2: {
        items: [PA('Paper to wrap the top of a box', 'area'), PA('Trim around a window', 'perimeter'), PG(['xxxxx', 'xxxxx']), AR(['xxxxx', 'xxxxx']),
          story('A garden is 5 m by 3 m. How much fence goes around?', 'm', 16, '5 + 3 + 5 + 3'), story('A 5 m by 3 m garden: how many 1 m² squares of grass?', 'squares', 15, '5 × 3')]
      },
      p3: {
        items: [PG(['xxxx', 'x...', 'x...']), AR(['xxxx', 'x...', 'x...']), story('A rug is 4 m by 2 m. What is its area?', 'm²', 8, '4 × 2'), story('A 4 m by 2 m rug: how much trim goes around it?', 'm', 12, '4 + 2 + 4 + 2'),
          { q: 'Can a shape have a bigger area but a smaller perimeter than another? Show it.', lines: { n: 2, key: 'Yes: a 3 by 3 square (area 9, perimeter 12) and a 1 by 6 strip (area 6, perimeter 14).' }, wide: true }]
      },
      think: {
        items: [{ q: 'How do you remember perimeter and area?', lines: { n: 2, key: 'Perimeter is the rim around; area is the space inside.' } },
          { q: 'Give a job at home that needs the perimeter.', lines: { n: 2, key: 'For example: a fence, or lights around a window.' } },
          { q: 'Give a job at home that needs the area.', lines: { n: 2, key: 'For example: paint for a wall, or a rug for a floor.' } },
          { q: 'Draw two shapes with the same area but different perimeters.', draw: { h: 80, key: 'For example: a 2 by 2 square and a 4 by 1 strip.' } }]
      }
    }
  } });
})();
