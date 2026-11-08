/* Grade 5 Shapes and Grids: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/shapes-grids.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: E1.1 triangles by sides and by angles, the angle sum and the side rule; E1.2 congruent shapes; E1.3
   views of objects; E1.4 coordinates; E1.5 slides, flips and turns. The answer checks are in tests/verify/sheets.js:
   a triangle's kind and missing angle come from the triangle as drawn (pick.tri, ask), a view from the stack heights
   (view), a point from the grid (pt), a moved point from the slide or flip (move), and congruence from the two shapes
   turned and flipped (pick.cong). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var SIDES = ['equilateral', 'isosceles', 'scalene'], ANGLES = ['acute', 'right', 'obtuse'];
  /* name a triangle by its sides (drawn from side lengths) or by its angles (drawn from angles) */
  function TS(sd) { var k = new Set(sd).size; return { pic: ['tri', { sides: sd, show: 'sides', marks: true }], pick: { opts: SIDES, ans: k === 1 ? 0 : k === 2 ? 1 : 2, tri: 'sides' } }; }
  function TA(an) { var b = Math.max.apply(null, an); return { pic: ['tri', { angles: an, show: 'angles', marks: true }], pick: { opts: ANGLES, ans: b === 90 ? 1 : b > 90 ? 2 : 0, tri: 'angles' } }; }
  /* name a triangle from its numbers alone, with no picture */
  function TW(o, by) {
    var v = o.sides || o.angles, k = new Set(v).size, b = Math.max.apply(null, v);
    return { q: (o.sides ? 'Sides ' + v.join(' cm, ') + ' cm' : 'Angles ' + v.join('°, ') + '°') + ':', pick: by === 'sides' ? { opts: SIDES, ans: k === 1 ? 0 : k === 2 ? 1 : 2, tri: 'sides' } : { opts: ANGLES, ans: b === 90 ? 1 : b > 90 ? 2 : 0, tri: 'angles' }, tri: o };
  }
  /* the missing angle of a triangle */
  function MA(an, i) { return { pic: ['tri', { angles: an, show: 'angles', ask: i }], eq: ['? is [] °'], a: [an[i]] }; }
  function MS(x, y) { return { eq: ['180 − ' + x + ' − ' + y + ' = []'], a: [180 - x - y] }; }
  /* can these sides make a triangle? short + short > long */
  function SR(s) {
    var t = s.slice().sort(function (p, q) { return p - q; });
    return { q: s.join(' cm, ') + ' cm', eq: [t[0] + ' + ' + t[1] + ' ? ' + t[2]], pick: { opts: ['triangle', 'no triangle'], ans: t[0] + t[1] > t[2] ? 0 : 1 }, pickLast: true, tf: t[0] + ' + ' + t[1] + ' > ' + t[2] };
  }
  /* two shapes on grids: congruent? */
  function CG(c1, c2, cols, rows) { return { pic: ['row', { list: [['area', { cols: cols, rows: rows, cells: c1, u: 12 }], ['area', { cols: cols, rows: rows, cells: c2, u: 12 }]], gap: 14 }], pick: { opts: ['yes', 'no'], ans: null, cong: true } }; }
  /* views of a stack plan */
  function VW(g) {
    var front = g[0].map(function (_, c) { return Math.max.apply(null, g.map(function (r) { return r[c]; })); }), side = g.map(function (r) { return Math.max.apply(null, r); }).reverse();
    var bl = function (l) { return l.map(function () { return '[]'; }).join(' '); };
    return { q: 'Front: left to right. Side: front to back.', pic: ['heights', { g: g }], eq: ['front ' + bl(front), 'side ' + bl(side)], a: front.concat(side), view: ['front', 'side'] };
  }
  /* read a point; plot a point (drawn on the key) */
  function RP(pts, lab) { var q = pts.filter(function (p) { return p[2] === lab; })[0]; return { pic: ['coord', { n: 8, pts: pts }], eq: [lab + ' ( [] , [] )'], a: [q[0], q[1]], pt: lab, wide: false }; }
  function PL(list) { return { q: 'Plot ' + list.map(function (p) { return p[2] + ' (' + p[0] + ', ' + p[1] + ')'; }).join(' and ') + '.', pic: ['coord', { n: 8, plot: list }] }; }
  /* a point after a slide or a flip */
  function MV(pt, move, q, n) {
    var to = move.slide ? [pt[0] + move.slide[0], pt[1] + move.slide[1]] : move.flip.x != null ? [2 * move.flip.x - pt[0], pt[1]] : [pt[0], 2 * move.flip.y - pt[1]];
    return { q: q, pic: ['coord', { n: n || 8, pts: [pt], mirror: move.flip }], eq: [pt[2] + "' ( [] , [] )"], a: to, move: { pt: pt[2], slide: move.slide, flip: move.flip } };
  }
  /* the same with no grid: the point is in the question */
  function MT(pt, move, q) { var o = MV(pt, move, pt[2] + ' is at (' + pt[0] + ', ' + pt[1] + '). ' + q); delete o.pic; o.move.pt = [pt[0], pt[1]]; return o; }
  function cg(c1, c2, cols, rows) {
    var o = CG(c1, c2, cols, rows);
    /* the key: work it out here the same way a child would, by turning and flipping */
    var f = function (cs) { var p = cs.map(function (c) { return c.split(',').map(Number); }); return p; };
    var nm = function (cs) { var mx = Math.min.apply(null, cs.map(function (c) { return c[0]; })), my = Math.min.apply(null, cs.map(function (c) { return c[1]; })); return cs.map(function (c) { return (c[0] - mx) + ',' + (c[1] - my); }).sort().join(' '); };
    var forms = [];
    [0, 1, 2, 3].forEach(function (t) { [false, true].forEach(function (fl) { forms.push(nm(f(c1).map(function (q) { var p = fl ? [-q[0], q[1]] : q; for (var k = 0; k < t; k++) p = [-p[1], p[0]]; return p; }))); }); });
    o.pick.ans = forms.indexOf(nm(f(c2))) >= 0 ? 0 : 1;
    return o;
  }
  var L1 = ['0,0', '0,1', '0,2', '1,2'], L2 = ['0,0', '1,0', '2,0', '0,1'], T1 = ['0,0', '1,0', '2,0', '1,1'], S1 = ['0,0', '1,0', '1,1', '2,1'], SQ = ['0,0', '1,0', '0,1', '1,1'];
  var BIG = ['0,0', '1,0', '2,0', '3,0', '0,1', '1,1', '2,1', '3,1'];

  S.register('shapes-grids', { code: 'SG', ideas: {

    'by-sides': {
      watch: 'naming by how it looks, not by the sides. Compare the side lengths: count how many are equal.',
      goal: 'I can name a triangle by its sides.',
      learn: {
        show: { pic: ['tri', { sides: [5, 5, 8], show: 'sides', marks: true }], eq: ['isosceles'] },
        together: [TS([6, 6, 6]), TW({ sides: [4, 6, 7] }, 'sides')],
        cue: 'Equilateral: 3 equal sides. Isosceles: 2. Scalene: none.',
        own: [TW({ sides: [7, 7, 4] }, 'sides'), TW({ sides: [5, 8, 10] }, 'sides')]
      },
      p1: {
        show: { pic: ['tri', { sides: [4, 4, 4], show: 'sides', marks: true }], cap: '3 equal sides', eq: ['equilateral'] },
        items: [TS([3, 4, 5]), TS([6, 6, 9]), TW({ sides: [5, 5, 5] }, 'sides'), TW({ sides: [8, 5, 8] }, 'sides')]
      },
      p2: {
        items: [TS([7, 9, 11]), TS([10, 10, 10]), TS([9, 5, 9]), TS([6, 7, 8])]
      },
      p3: {
        items: [{ q: 'A triangle has sides 9 cm, 9 cm and 9 cm.', pick: { opts: SIDES, ans: 0, tri: 'sides' }, pic: ['tri', { sides: [9, 9, 9] }] },
          { q: 'A triangle has sides 4 cm, 7 cm and 7 cm.', pick: { opts: SIDES, ans: 1, tri: 'sides' }, pic: ['tri', { sides: [4, 7, 7] }] },
          { q: 'Draw a scalene triangle. Mark its side lengths.', draw: { h: 90, key: 'Any triangle with 3 different side lengths.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says every equilateral triangle is also isosceles. Do you agree?', lines: { n: 3, key: 'Yes. It has at least 2 equal sides (it has 3).' } },
          { q: 'Can a scalene triangle have 2 equal angles? Why?', lines: { n: 3, key: 'No. Equal angles face equal sides, and a scalene triangle has no equal sides.' } },
          TS([6, 10, 10])]
      }
    },

    'by-angles': {
      watch: 'calling a triangle right or obtuse from a sharp corner. Check the biggest angle.',
      goal: 'I can name a triangle by its angles.',
      learn: {
        show: { pic: ['tri', { angles: [30, 40, 110], show: 'angles' }], cap: 'biggest angle 110°', eq: ['obtuse'] },
        together: [TA([90, 50, 40]), TA([60, 70, 50])],
        cue: 'Check the biggest angle. 90°: right. More: obtuse. Less: acute.',
        own: [TA([25, 125, 30]), TA([45, 90, 45])]
      },
      p1: {
        show: { pic: ['tri', { angles: [90, 30, 60], show: 'angles', marks: true }], cap: 'a square corner', eq: ['right'] },
        items: [TA([80, 60, 40]), TA([100, 50, 30]), TA([90, 35, 55]), TA([60, 60, 60])]
      },
      p2: {
        items: [TA([20, 140, 20]), TA([75, 65, 40]), TA([90, 20, 70]), TA([35, 35, 110])]
      },
      p3: {
        items: [{ q: 'A triangle has angles 30°, 60° and 90°.', pick: { opts: ANGLES, ans: 1, tri: 'angles' }, pic: ['tri', { angles: [30, 60, 90] }] },
          { q: 'A triangle has angles 50°, 25° and 105°.', pick: { opts: ANGLES, ans: 2, tri: 'angles' }, pic: ['tri', { angles: [50, 25, 105] }] },
          { q: 'Draw a right isosceles triangle.', draw: { h: 90, key: 'A triangle with a 90° corner and two equal sides around it.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says a triangle can have two right angles. Is {b} right?', lines: { n: 3, key: 'No. 90 + 90 = 180 already, leaving 0° for the third angle.' } },
          { q: 'Why does every triangle have at least two acute angles?', lines: { n: 3, key: 'The angles add to 180°. If two were 90° or more, there would be nothing left for the third.' } },
          TA([45, 45, 90])]
      }
    },

    'angle-sum': {
      watch: 'adding the two angles but forgetting to take them from 180. Missing angle = 180 − the other two.',
      goal: 'I can find the missing angle of a triangle.',
      learn: {
        show: { pic: ['tri', { angles: [90, 35, 55], show: 'angles', ask: 2 }], eq: ['180 − 90 − 35 = 55'] },
        together: [MA([30, 65, 85], 2), MS(60, 60)],
        cue: 'The angles in a triangle add to 180°.',
        own: [MS(40, 70), MS(110, 30)]
      },
      p1: {
        show: { eq: ['50 + 60 = 110', '180 − 110 = 70'] },
        items: [MA([50, 60, 70], 2), MA([90, 25, 65], 1), MS(80, 40), MS(35, 35), MS(100, 50)]
      },
      p2: {
        items: [MA([120, 25, 35], 0), MA([45, 55, 80], 2), MS(15, 90), MS(72, 48), MS(64, 64), MS(130, 25)]
      },
      p3: {
        items: [MA([40, 70, 70], 1), MA([90, 28, 62], 2), Object.assign(MA([60, 60, 60], 0), { q: 'An equilateral triangle:' }), MS(95, 47)]
      },
      think: {
        items: [{ q: '{b} found the third angle of a 50° and 60° triangle as 110°. What went wrong?', lines: { n: 3, key: '{b} added the two angles. Take them from 180: 180 − 110 = 70°.' } },
          { q: 'Can a triangle have angles 70°, 70° and 50°? Explain.', lines: { n: 3, key: 'No. 70 + 70 + 50 = 190, not 180.' } },
          MA([33, 99, 48], 1)]
      }
    },

    'side-rule': {
      watch: 'adding any two sides. Add the two short sides and compare with the long one.',
      goal: 'I can tell if three sides can make a triangle.',
      learn: {
        show: { eq: ['4 cm, 5 cm, 7 cm', '4 + 5 = 9, more than 7', 'triangle'] },
        together: [SR([2, 3, 8]), SR([6, 6, 10])],
        cue: 'Short + short must be more than long.',
        own: [SR([3, 6, 10]), SR([5, 7, 9])]
      },
      p1: {
        show: { eq: ['2 cm, 3 cm, 8 cm', '2 + 3 = 5, less than 8', 'no triangle'] },
        items: [SR([4, 4, 7]), SR([1, 2, 6]), SR([5, 6, 12]), SR([8, 9, 10])]
      },
      p2: {
        items: [SR([10, 4, 5]), SR([7, 3, 5]), SR([12, 6, 7]), SR([5, 5, 10])]
      },
      p3: {
        items: [SR([15, 8, 6]), SR([9, 11, 19]),
          { q: 'Two sides are 4 cm and 9 cm. Give a whole-number third side that works.', lines: { n: 1, key: 'Any length from 6 cm to 12 cm.' } },
          { q: 'Two sides are 3 cm and 5 cm. What is the longest whole-number third side? Why?', lines: { n: 2, key: '7 cm, because 3 + 5 = 8 and the third side must be less than 8.' } }]
      },
      think: {
        items: [{ q: 'Why do 5 cm, 5 cm and 10 cm not make a triangle?', lines: { n: 3, key: '5 + 5 = 10, not more than 10. The sides lie flat and cannot meet in a point.' } },
          { q: '{b} says 3 cm, 4 cm and 6 cm cannot make a triangle because 3 + 6 > 4. What would you tell {b}?', lines: { n: 3, key: 'Add the two short sides: 3 + 4 = 7, more than 6, so it can.' } },
          SR([7, 8, 14])]
      }
    },

    congruent: {
      watch: 'saying a turned or flipped shape is different. Congruent means the same size and shape in any position.',
      goal: 'I can tell if two shapes are congruent.',
      learn: {
        show: { pic: ['row', { list: [['area', { cols: 4, rows: 3, cells: L1, u: 12 }], ['area', { cols: 4, rows: 3, cells: L2, u: 12 }]], gap: 14 }], cap: 'the L turned: same size and shape', eq: ['congruent'] },
        together: [cg(T1, ['1,0', '0,1', '1,1', '1,2'], 4, 3), cg(SQ, BIG, 4, 3)],
        cue: 'Slide, turn or flip: congruent. Stretch or shrink: not congruent.',
        own: [cg(S1, ['1,0', '1,1', '0,1', '0,2'], 4, 3), cg(L1, T1, 4, 3)]
      },
      p1: {
        show: { cap: 'Can you turn or flip one to fit on the other?' },
        items: [cg(L1, ['0,0', '1,0', '1,1', '1,2'], 4, 3), cg(SQ, ['0,0', '1,0', '2,0', '3,0'], 4, 3), cg(T1, ['0,1', '1,1', '2,1', '1,0'], 4, 3), cg(S1, ['0,1', '1,1', '1,0', '2,0'], 4, 3)]
      },
      p2: {
        items: [cg(['0,0', '1,0', '2,0', '2,1', '2,2'], ['0,0', '0,1', '0,2', '1,2', '2,2'], 4, 3), cg(['0,0', '1,0', '1,1'], ['0,0', '1,0', '0,1'], 3, 3),
          cg(['0,0', '1,0', '2,0', '1,1', '1,2'], ['0,0', '1,0', '2,0', '0,1', '0,2'], 4, 3), cg(['0,0', '0,1', '1,1', '1,2', '2,2'], ['2,0', '2,1', '1,1', '1,2', '0,2'], 4, 3)]
      },
      p3: {
        items: [cg(['0,0', '1,0', '2,0', '3,0', '3,1'], ['0,0', '0,1', '1,1', '2,1', '3,1'], 4, 3), cg(['0,0', '1,0', '1,1', '2,1', '2,2'], ['0,2', '1,2', '1,1', '2,1', '2,0'], 4, 3),
          { q: 'Draw a shape congruent to the L, but flipped.', pic: ['area', { cols: 4, rows: 3, cells: L1, u: 12 }], draw: { h: 60, key: 'The mirror image of the L: the foot points the other way.' } }]
      },
      think: {
        items: [{ q: '{b} says a shape and its enlargement are congruent because they look the same. Is {b} right?', lines: { n: 3, key: 'No. Congruent shapes are the same size too. An enlargement is bigger.' } },
          { q: 'Name two ways to move a shape so it stays congruent.', lines: { n: 2, key: 'Any two of: slide, flip, turn.' } },
          cg(['0,0', '1,0', '2,0', '1,1'], ['1,0', '1,1', '1,2', '0,1'], 4, 3)]
      }
    },

    views: {
      watch: 'counting all the cubes in a column for the front view. Each column shows only its tallest stack.',
      goal: 'I can draw top, front and side views of a cube building.',
      learn: {
        show: { pic: ['heights', { g: [[1, 2], [2, 1]] }], eq: ['front: 2 2', 'side: 2 2'] },
        together: [VW([[1, 3], [2, 1]]), VW([[2, 2], [0, 1]])],
        cue: 'Each column shows its tallest stack.',
        own: [VW([[2, 1, 1], [1, 0, 3]]), VW([[1, 3], [3, 1]])]
      },
      p1: {
        show: { pic: ['heights', { g: [[3, 1], [1, 1]] }], eq: ['front: 3 1', 'side: 1 3'] },
        items: [VW([[1, 1], [2, 1]]), VW([[2, 2], [1, 3]]), VW([[3, 1], [1, 2]]), { q: 'How many cubes in all?', pic: ['heights', { g: [[2, 2], [1, 3]] }], eq: ['[]'], a: [8] }]
      },
      p2: {
        items: [VW([[3, 1, 2], [1, 1, 1]]), VW([[0, 2, 1], [3, 1, 0]]), VW([[1, 0, 2], [2, 2, 1]]), { q: 'How many cubes in all?', pic: ['heights', { g: [[0, 2, 1], [3, 1, 0]] }], eq: ['[]'], a: [7] }]
      },
      p3: {
        items: [VW([[1, 2, 1], [2, 3, 1], [1, 1, 1]]), VW([[2, 0, 1], [1, 3, 1], [1, 1, 2]]),
          { q: 'Draw the front view of this building.', pic: ['heights', { g: [[2, 1, 3], [1, 1, 1]] }], draw: { h: 70, key: '3 columns: 2, 1 and 3 squares tall.' } }]
      },
      think: {
        items: [{ q: '{b} says the front view shows every cube. What would you tell {b}?', lines: { n: 3, key: 'Cubes behind others are hidden. A view shows only the tallest stack in each column.' } },
          { q: 'Can two different buildings have the same front view? Explain.', lines: { n: 3, key: 'Yes. Cubes hidden behind the tallest stack can change without changing the front view.' } },
          VW([[3, 2], [1, 1]])]
      }
    },

    plot: {
      watch: 'going up first, or swapping the numbers. Across first, then up: (4, 6) is not (6, 4).',
      goal: 'I can read and plot points on a grid.',
      learn: {
        show: { pic: ['coord', { n: 8, pts: [[4, 6, 'A']] }], cap: '4 across, then 6 up', eq: ['A (4, 6)'] },
        together: [RP([[2, 5, 'B']], 'B'), PL([[6, 3, 'C']])],
        cue: 'Across first, then up.',
        own: [RP([[7, 1, 'D']], 'D'), PL([[1, 7, 'E']])]
      },
      p1: {
        show: { eq: ['(3, 5): 3 across, 5 up'] },
        items: [RP([[3, 4, 'A'], [5, 2, 'B']], 'A'), RP([[3, 4, 'A'], [5, 2, 'B']], 'B'), PL([[2, 6, 'C'], [6, 2, 'D']]), RP([[0, 5, 'E']], 'E')]
      },
      p2: {
        items: [RP([[8, 3, 'F'], [1, 6, 'G']], 'F'), RP([[8, 3, 'F'], [1, 6, 'G']], 'G'), PL([[4, 0, 'H'], [0, 4, 'J']]), PL([[5, 5, 'K'], [7, 2, 'L']])]
      },
      p3: {
        items: [{ q: 'Plot (1, 1), (5, 1) and (5, 4). Join them. What shape is it?', pic: ['coord', { n: 8, keyShape: [[1, 1], [5, 1], [5, 4]] }], lines: { n: 1, key: 'A right triangle.' } },
          { q: 'Three corners of a rectangle are (2, 2), (6, 2), (6, 5). Where is the fourth?', pic: ['coord', { n: 8, pts: [[2, 2], [6, 2], [6, 5]], plot: [[2, 5, 'D']] }], eq: ['D ( [] , [] )'], a: [2, 5], pt: [2, 5] },
          { q: 'Plot (2, 1), (6, 1), (6, 5) and (2, 5). Join them. What shape is it?', pic: ['coord', { n: 8, keyShape: [[2, 1], [6, 1], [6, 5], [2, 5]] }], lines: { n: 1, key: 'A square.' } },
          { q: 'Three corners of a square are (1, 3), (4, 3), (4, 6). Where is the fourth?', pic: ['coord', { n: 8, pts: [[1, 3], [4, 3], [4, 6]], plot: [[1, 6, 'D']] }], eq: ['D ( [] , [] )'], a: [1, 6], pt: [1, 6] }]
      },
      think: {
        items: [{ q: '{b} plotted (2, 7) at 7 across and 2 up. What went wrong?', lines: { n: 3, key: '{b} swapped the numbers. Across first: 2 across, then 7 up.' } },
          { q: 'What do all points on the bottom line have in common?', lines: { n: 2, key: 'The second number is 0: they are 0 up.' } },
          RP([[6, 6, 'M'], [3, 0, 'N']], 'N')]
      }
    },

    moves: {
      watch: 'changing the size or shape when moving it. A slide, flip or turn changes only where the shape is.',
      goal: 'I can slide and flip a shape on a grid.',
      learn: {
        show: { pic: ['coord', { n: 6, shape: [[1, 1], [3, 1], [1, 3]], after: [[4, 2], [6, 2], [4, 4]] }], cap: 'slide 3 right and 1 up: same size, same shape' },
        together: [MV([2, 3, 'A'], { slide: [4, 1] }, 'Slide A 4 right and 1 up.', 6), MV([2, 5, 'B'], { flip: { x: 4 } }, 'Flip B over the dashed line at 4 across.', 6)],
        cue: 'Slide: every point moves the same. Flip: the same distance on the other side of the line.',
        own: [MT([5, 2, 'C'], { slide: [-3, 4] }, 'Slide C 3 left and 4 up.'), MT([1, 6, 'D'], { flip: { y: 4 } }, 'Flip D over the line at 4 up.')]
      },
      p1: {
        show: { eq: ["A (2, 3), slide 4 right: A' (6, 3)"] },
        items: [MV([1, 1, 'A'], { slide: [5, 0] }, 'Slide A 5 right.'), MV([6, 7, 'B'], { slide: [0, -4] }, 'Slide B 4 down.'), MV([3, 2, 'C'], { slide: [2, 3] }, 'Slide C 2 right and 3 up.'), MV([7, 5, 'D'], { slide: [-5, -2] }, 'Slide D 5 left and 2 down.')]
      },
      p2: {
        items: [MV([1, 3, 'E'], { flip: { x: 3 } }, 'Flip E over the dashed line at 3 across.'), MV([6, 2, 'F'], { flip: { x: 5 } }, 'Flip F over the dashed line at 5 across.'), MV([4, 1, 'G'], { flip: { y: 3 } }, 'Flip G over the dashed line at 3 up.'), MV([2, 7, 'H'], { flip: { y: 5 } }, 'Flip H over the dashed line at 5 up.')]
      },
      p3: {
        items: [{ q: 'Slide the triangle 4 right and 2 up. Draw it.', pic: ['coord', { n: 8, shape: [[1, 1], [3, 1], [2, 3]], keyShape: [[5, 3], [7, 3], [6, 5]] }] },
          { q: 'Flip the shape over the dashed line at 4 across. Draw it.', pic: ['coord', { n: 8, mirror: { x: 4 }, shape: [[1, 2], [3, 2], [3, 5]], keyShape: [[7, 2], [5, 2], [5, 5]] }] },
          { q: 'Turn the square a quarter turn around (2, 2). Where does (4, 2) go?', pic: ['coord', { n: 8, shape: [[2, 2], [4, 2], [4, 4], [2, 4]], keyShape: [[2, 2], [2, 4], [0, 4], [0, 2]] }], lines: { n: 1, key: 'A quarter turn to the left takes (4, 2) to (2, 4).' } }]
      },
      think: {
        items: [{ q: '{b} says a flipped shape is not congruent to the first. Is {b} right?', lines: { n: 3, key: 'No. A flip changes where the shape faces, not its size or shape.' } },
          { q: 'Which move takes (1, 2) to (5, 2) in one step? Name two.', lines: { n: 2, key: 'A slide 4 right, or a flip over the line across = 3.' } },
          MV([3, 6, 'P'], { slide: [4, -5] }, 'Slide P 4 right and 5 down.')]
      }
    }
  } });
})();
