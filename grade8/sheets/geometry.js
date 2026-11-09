/* Grade 8 Geometry: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/geometry.lessons.js: Learn, Practise 1 to 3 and Think. Every question is written here, so a sheet always
   prints the same. Theme words: {a} {b} names.
   Ontario 2020: E1.1 shapes that tessellate; E1.2 models to scale from their views; E1.3 scale drawings; E1.4 slides,
   flips, turns and dilations on a grid; E2.2 angles at crossing and parallel lines, in triangles and polygons. The
   answer checks are in tests/verify/sheets.js: an angle marked "?" or named by a letter is worked out from the given
   angle (par, tri), a moved point is moved again by the rule (move), the kind of move comes from the shape before and
   after (move pick), and every sum is worked out again. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var Q = S.q;
  /* a crossing (one) or parallel lines: the angle at ask, from the angle ang at give */
  function PA(ang, give, ask, one) { return { pic: ['par', { ang: ang, give: give, ask: ask, one: !!one }], q: 'Find the angle marked ?.', eq: ['[] °'], a: [ask % 2 === give % 2 ? ang : 180 - ang] }; }
  /* parallel lines with several angles named by letters */
  function PL(ang, give, letters) {
    return { pic: ['par', { ang: ang, give: give, letters: letters.map(function (l) { return [l[0], l[1]]; }) }], q: 'Find each angle.', eq: letters.map(function (l) { return l[1] + ' = [] °'; }),
      a: letters.map(function (l) { return l[0] % 2 === give % 2 ? ang : 180 - ang; }) };
  }
  /* a triangle from its angles, one asked */
  function TA(angles, ask) { return { pic: ['tri', { angles: angles, show: 'angles', ask: ask }], q: 'Find the missing angle.', eq: ['? is [] °'], a: [angles[ask]] }; }
  /* a point moved on the grid: slide [dx, dy], flip { x } or { y }, rot 90 | 180 | −90 about the origin, dil k from the origin */
  function MV(pt, m, q, n, nopic) {
    var x = pt[0], y = pt[1], to = m.slide ? [x + m.slide[0], y + m.slide[1]] : m.flip ? (m.flip.x != null ? [2 * m.flip.x - x, y] : [x, 2 * m.flip.y - y]) : m.dil ? [x * m.dil, y * m.dil] : m.rot === 180 ? [-x, -y] : m.rot === 90 ? [-y, x] : [y, -x];
    var mv = { pt: pt[2] }; ['slide', 'flip', 'rot', 'dil'].forEach(function (k) { if (m[k] != null) mv[k] = m[k]; });
    if (nopic) { mv.pt = [x, y]; return { q: q, eq: ['(' + S.fmt(x) + ', ' + S.fmt(y) + ') → ( [] , [] )'], a: to, move: mv }; }
    return { q: q, pic: ['cgrid', { n: n || Math.max(5, Math.abs(x), Math.abs(y)), pts: [pt] }], eq: [pt[2] + "' ( [] , [] )"], a: to, move: mv };
  }
  /* which move takes the shape to after */
  function WM(shape, after, n) {
    var d = function (u, v) { return [v[0] - u[0], v[1] - u[1]]; }, e1 = d(shape[0], shape[1]), e2 = d(after[0], after[1]);
    var sg = function (q) { return Math.sign((q[1][0] - q[0][0]) * (q[2][1] - q[0][1]) - (q[1][1] - q[0][1]) * (q[2][0] - q[0][0])); };
    var want = Math.abs(Math.hypot(e1[0], e1[1]) - Math.hypot(e2[0], e2[1])) > 1e-9 ? 'dilation' : sg(shape) !== sg(after) ? 'reflection' : e1[0] === e2[0] && e1[1] === e2[1] ? 'translation' : 'rotation';
    var o = ['translation', 'reflection', 'rotation', 'dilation'];
    return { q: 'Which move takes solid to dashed?', pic: ['cgrid', { n: n || 5, shape: shape, after: after }], pick: { opts: o, ans: o.indexOf(want), move: [shape, after] } };
  }
  function ST(q, calc, unit) { return { q: q, eq: ['[]' + (unit ? ' ' + unit : '')], a: [S.calc(calc)], calc: calc }; }

  S.register('geometry', { code: 'GE', ideas: {

    straight: {
      watch: 'adding to 360 on a straight line. A straight line is 180°; all the way round is 360°.',
      goal: 'I can find angles on a straight line and around a point.',
      learn: {
        show: { pic: ['par', { ang: 65, give: 0, ask: 1, one: true }], cap: 'side by side on a straight line', eq: ['180 − 65 = 115'] },
        together: [PA(40, 0, 1, true)],
        cue: 'Straight line: 180°. Around a point: 360°.',
        own: [PA(72, 0, 3, true), Q('360 − 90 − 145'), Q('180 − 37 − 48')]
      },
      p1: {
        show: { eq: ['around a point:', '360 − 120 − 150 = 90'] },
        items: [PA(55, 0, 1, true), PA(130, 1, 2, true), Q('180 − 108'), Q('180 − 62 − 71'), Q('360 − 210'), Q('360 − 95 − 135')]
      },
      p2: {
        items: [PA(28, 0, 3, true), Q('360 − 3 × 90'), Q('(180 − 40) ÷ 2'), Q('(360 − 120) ÷ 3'),
          { q: 'Two angles on a straight line: one is 3 times the other. The smaller?', eq: ['180 ÷ 4 = []'], a: [45] },
          { q: 'Five equal angles meet at a point. Each one?', eq: ['360 ÷ 5 = []'], a: [72] }]
      },
      p3: {
        items: [{ q: 'On a straight line: x and 2x + 30. Find x.', eq: ['x + 2x + 30 = 180', 'x = []'], a: [50], solve: 'x + 2x + 30 = 180' },
          { q: 'Around a point: 100°, 3x and 2x + 10. Find x.', eq: ['100 + 3x + 2x + 10 = 360', 'x = []'], a: [50], solve: '100 + 3x + 2x + 10 = 360', wide: true },
          Q('180 − 52.5'), Q('360 − 4 × 72.5')]
      },
      think: {
        items: [{ q: 'Why do angles on a straight line add to 180°?', lines: { n: 2, key: 'A straight line is half a turn, and a full turn is 360°.' } },
          { q: 'How many degrees does a minute hand turn in 15 minutes?', eq: ['360 ÷ 4 = []'], a: [90] },
          PA(19, 0, 1, true),
          { q: 'Draw three angles that meet at a point and add to 360°.', draw: { h: 70, key: 'For example 100°, 120° and 140° around one point.' } }]
      }
    },

    opposite: {
      watch: 'adding opposite angles to 180. Opposite angles at a crossing are equal.',
      goal: 'I can use opposite angles and the angles of a triangle.',
      learn: {
        show: { cap: 'two lines cross: opposite angles are equal', eq: ['65° and 65°'] },
        together: [PA(48, 0, 2, true), TA([50, 60, 70], 2)],
        cue: 'Opposite: equal. Triangle: add to 180°.',
        own: [PA(115, 1, 3, true), TA([90, 35, 55], 1)]
      },
      p1: {
        show: { eq: ['triangle: 180 − 90 − 40 = 50'] },
        items: [PA(70, 0, 2, true), PA(125, 1, 3, true), TA([40, 60, 80], 0), TA([100, 45, 35], 2), Q('180 − 75 − 45'), Q('180 − 2 × 52')]
      },
      p2: {
        items: [TA([30, 30, 120], 2), TA([90, 22, 68], 2), Q('(180 − 40) ÷ 2'), PA(33, 0, 2, true),
          { q: 'An isosceles triangle has a 50° angle between its equal sides. Each other angle?', eq: ['(180 − 50) ÷ 2 = []'], a: [65] },
          { q: 'An equilateral triangle. Each angle?', eq: ['180 ÷ 3 = []'], a: [60] }]
      },
      p3: {
        items: [{ q: 'A triangle has angles x, 2x and 3x. Find x.', eq: ['x + 2x + 3x = 180', 'x = []'], a: [30], solve: 'x + 2x + 3x = 180' },
          { q: 'A triangle has angles 40°, x + 10 and 2x + 10. Find x.', eq: ['40 + x + 10 + 2x + 10 = 180', 'x = []'], a: [40], solve: '40 + x + 10 + 2x + 10 = 180', wide: true },
          TA([28, 117, 35], 1)]
      },
      think: {
        items: [{ q: 'Why are opposite angles equal?', lines: { n: 3, key: 'Each one plus the angle between them makes 180°, so they are the same size.' } },
          { q: 'Can a triangle have two right angles? Explain.', lines: { n: 2, key: 'No. 90 + 90 = 180 leaves 0° for the third angle.' } },
          TA([75, 75, 30], 2),
          { q: 'Give the angles of a triangle with one obtuse angle.', lines: { n: 1, key: 'For example 110°, 40° and 30°.' } }]
      }
    },

    pairs: {
      watch: 'mixing up equal and adding pairs. F and Z angles are equal; C angles add to 180°.',
      goal: 'I can use F, Z and C angles with parallel lines.',
      learn: {
        show: { cap: 'corresponding angles (F shape) are equal', eq: ['65° and 65°'] },
        together: [PA(70, 0, 4)],
        cue: 'F and Z: equal. C: add to 180°.',
        own: [PA(110, 1, 7), PA(55, 3, 5)]
      },
      p1: {
        show: { eq: ['alternate (Z): equal', 'co-interior (C): add to 180°'] },
        items: [PA(60, 0, 4), PA(75, 2, 6), PA(130, 1, 5), PA(45, 2, 4)]
      },
      p2: {
        items: [PA(38, 0, 6), PA(142, 1, 4), PA(66, 2, 5), PA(104, 3, 4)]
      },
      p3: {
        items: [PA(23, 2, 7), PA(158, 1, 7),
          { q: 'Co-interior angles are x and x + 40. Find x.', eq: ['x + x + 40 = 180', 'x = []'], a: [70], solve: 'x + x + 40 = 180' },
          { q: 'Alternate angles are 3x and 2x + 25. Find x.', eq: ['3x = 2x + 25', 'x = []'], a: [25], solve: '3x = 2x + 25' }]
      },
      think: {
        items: [{ q: 'How do you spot a Z angle?', lines: { n: 2, key: 'They sit inside the parallel lines, on opposite sides of the slanted line.' } },
          { q: 'Why do C angles add to 180°?', lines: { n: 3, key: 'One C angle equals the F partner of the other, and those two sit on a straight line.' } },
          PA(99, 1, 5),
          { q: 'Are the lines parallel if the C angles are 95° and 80°? Explain.', lines: { n: 2, key: 'No. 95 + 80 = 175, not 180.' } }]
      }
    },

    find: {
      watch: 'jumping to an answer with no reason. Write the rule for every step.',
      goal: 'I can find missing angles in several steps.',
      learn: {
        show: { cap: 'a is opposite 70°; a and b make 180°' },
        together: [PL(60, 0, [[1, 'a'], [4, 'b']])],
        cue: 'One step at a time. Say the rule each time.',
        own: [PL(115, 1, [[6, 'a']])]
      },
      p1: {
        show: { eq: ['b = 180 − a (C)'] },
        items: [PL(50, 0, [[2, 'a'], [6, 'b']]), PL(125, 1, [[0, 'a'], [5, 'b']]), Q('180 − 80')]
      },
      p2: {
        items: [PL(35, 0, [[1, 'a'], [5, 'b'], [6, 'c']]), PL(140, 3, [[0, 'a'], [4, 'b'], [7, 'c']]), Q('180 − 72')]
      },
      p3: {
        items: [PL(48, 2, [[3, 'a'], [4, 'b'], [5, 'c']]), PL(108, 5, [[0, 'a'], [2, 'b'], [6, 'c']]),
          { q: 'In a triangle between parallel lines, two angles are 55° and 70°. The third?', eq: ['180 − 55 − 70 = []'], a: [55] }]
      },
      think: {
        items: [{ q: 'Write the rule for each step for b in your last answer.', lines: { n: 3, key: 'For example: a is opposite the given angle; b is co-interior with a, so 180 − a.' } },
          { q: 'Why do all 8 angles have only two sizes?', lines: { n: 2, key: 'Each crossing has two sizes that add to 180°, and the parallel lines copy them.' } },
          PL(66, 0, [[3, 'a'], [7, 'b']]),
          { q: 'What is the fewest angles you need to be given? Explain.', lines: { n: 2, key: 'One: every other angle is equal to it or 180° minus it.' } }]
      }
    },

    sum: {
      watch: 'using 180 for every polygon. Split into triangles: (n − 2) × 180.',
      goal: 'I can find the interior angle sum of a polygon.',
      learn: {
        show: { cap: 'a pentagon splits into 3 triangles', eq: ['(5 − 2) × 180 = 540'] },
        together: [Q('(6 − 2) × 180')],
        cue: 'Sides minus 2 gives the triangles. Times 180.',
        own: [Q('(4 − 2) × 180'), Q('(8 − 2) × 180'), Q('360 − 90 − 110 − 85')]
      },
      p1: {
        show: { eq: ['quadrilateral: 360°', '360 − 90 − 90 − 70 = 110'] },
        items: [Q('(7 − 2) × 180'), Q('(10 − 2) × 180'), Q('(12 − 2) × 180'), Q('360 − 120 − 80 − 75'), Q('540 − 100 − 110 − 120 − 105'), Q('(9 − 2) × 180')]
      },
      p2: {
        items: [Q('720 − 4 × 120 − 130'), Q('360 − 2 × 115'), Q('(20 − 2) × 180'),
          { q: 'A polygon\'s angles add to 1440°. How many sides?', eq: ['1440 ÷ 180 + 2 = []'], a: [10] },
          { q: 'A polygon\'s angles add to 900°. How many sides?', eq: ['900 ÷ 180 + 2 = []'], a: [7] }]
      },
      p3: {
        items: [{ q: 'A quadrilateral has angles x, 2x, 3x and 4x. Find x.', eq: ['x + 2x + 3x + 4x = 360', 'x = []'], a: [36], solve: 'x + 2x + 3x + 4x = 360', wide: true },
          { q: 'A pentagon has four angles of 100°. The fifth?', eq: ['540 − 4 × 100 = []'], a: [140] },
          Q('(15 − 2) × 180'), { q: 'Can angles add to 1000° in a polygon? Explain.', lines: { n: 2, key: 'No. 1000 is not a multiple of 180.' } }]
      },
      think: {
        items: [{ q: 'Why (n − 2) triangles?', lines: { n: 3, key: 'From one corner you can draw lines to all but itself and its two neighbours: n − 2 triangles.' } },
          { q: 'How much does the sum grow with each extra side?', lines: { n: 1, key: '180°: one more triangle.' } },
          Q('(11 − 2) × 180'),
          { q: 'Draw a hexagon split into triangles from one corner.', draw: { h: 70, key: 'A hexagon with 3 lines from one corner, making 4 triangles.' } }]
      }
    },

    regular: {
      watch: 'dividing 180 by the sides. Find the whole sum first, then share it equally.',
      goal: 'I can find each angle of a regular polygon.',
      learn: {
        show: { cap: 'regular hexagon', eq: ['(6 − 2) × 180 ÷ 6 = 120'] },
        together: [Q('(5 − 2) × 180 ÷ 5')],
        cue: 'Sum of angles, divided by the number of angles.',
        own: [Q('(8 − 2) × 180 ÷ 8'), Q('(10 − 2) × 180 ÷ 10'), Q('360 ÷ 6')]
      },
      p1: {
        show: { eq: ['outside angle: 360 ÷ 6 = 60', '180 − 60 = 120'] },
        items: [Q('(4 − 2) × 180 ÷ 4'), Q('(3 − 2) × 180 ÷ 3'), Q('(12 − 2) × 180 ÷ 12'), Q('360 ÷ 8'), Q('360 ÷ 5'), Q('180 − 360 ÷ 9')]
      },
      p2: {
        items: [Q('(9 − 2) × 180 ÷ 9'), Q('(20 − 2) × 180 ÷ 20'), Q('180 − 360 ÷ 15'),
          { q: 'Each outside angle is 30°. How many sides?', eq: ['360 ÷ 30 = []'], a: [12] },
          { q: 'Each inside angle is 140°. How many sides?', eq: ['360 ÷ (180 − 140) = []'], a: [9], wide: true }]
      },
      p3: {
        items: [Q('(7 − 2) × 180 ÷ 7', { dp: 1 }), Q('(16 − 2) × 180 ÷ 16'),
          { q: 'Each inside angle is 156°. How many sides?', eq: ['360 ÷ (180 − 156) = []'], a: [15], wide: true },
          { q: 'Each inside angle is 162°. How many sides?', eq: ['360 ÷ (180 − 162) = []'], a: [20], wide: true }]
      },
      think: {
        items: [{ q: 'Why do the angles of a regular polygon get closer to 180°?', lines: { n: 3, key: 'With more sides the outside angles get smaller, 360 ÷ n, so 180 minus them gets close to 180.' } },
          { q: 'Can a regular polygon have 100° angles? Explain.', lines: { n: 2, key: 'No. 360 ÷ 80 = 4.5 sides, not a whole number.' } },
          Q('(24 − 2) × 180 ÷ 24'),
          { q: 'Name a regular polygon in your home.', lines: { n: 1, key: 'For example a square tile or a hexagon nut.' } }]
      }
    },

    tessellate: {
      exp: ['E1.1', 'E1.4', 'E2.2'],
      watch: 'thinking any shape tiles. The angles at each point must add to exactly 360°.',
      goal: 'I can tell which shapes tessellate, and why.',
      learn: {
        show: { cap: 'regular hexagons: 3 meet at a point', eq: ['3 × 120 = 360'] },
        together: [Q('360 ÷ 90')],
        cue: 'Do the angles at a point make exactly 360°?',
        own: [Q('360 ÷ 60'), Q('360 ÷ 108'), Q('2 × 60 + 2 × 120')]
      },
      p1: {
        show: { eq: ['pentagon: 360 ÷ 108 ≈ 3.3', 'not whole: no tessellation'] },
        items: [Q('360 ÷ 120'), Q('360 ÷ 135'), Q('4 × 90'), Q('3 × 60 + 2 × 90'), Q('360 − 2 × 135'), Q('360 − 4 × 60')]
      },
      p2: {
        items: [Q('360 ÷ 144'), Q('3 × 120'), Q('360 − 150 − 60'), Q('2 × 150 + 60'),
          { q: 'Octagons (135°) and squares (90°): two octagons and one square at a point. Total?', eq: ['2 × 135 + 90 = []'], a: [360] },
          { q: 'Which regular shapes tessellate alone?', lines: { n: 2, key: 'Equilateral triangles, squares and regular hexagons.' } }]
      },
      p3: {
        items: [Q('360 − 2 × 108'), Q('360 ÷ 150'),
          { q: 'Triangles (60°) and hexagons (120°): 2 of each at a point. Total?', eq: ['2 × 60 + 2 × 120 = []'], a: [360] },
          { q: 'A tiling uses slides, flips or turns. Which move copies a square tile one place right?', lines: { n: 1, key: 'A slide (translation).' } },
          { q: 'Draw a shape that tessellates with turns.', draw: { h: 70, key: 'For example a triangle turned 180° about the middle of a side, again and again.' } }]
      },
      think: {
        items: [{ q: 'Why does a regular pentagon not tessellate?', lines: { n: 3, key: 'Its angle is 108°. 3 × 108 = 324 leaves a gap; 4 × 108 = 432 overlaps.' } },
          { q: 'Does every triangle tessellate? Explain.', lines: { n: 2, key: 'Yes: its three angles, each used twice, make 360° at a point.' } },
          Q('3 × 90 + 90'),
          { q: 'Where do you see a tessellation?', lines: { n: 1, key: 'For example floor tiles, a honeycomb or a brick wall.' } }]
      }
    },

    rigid: {
      watch: 'moving the wrong way on a grid. Across (x) first, then up or down (y).',
      goal: 'I can slide, flip and turn shapes on a coordinate grid.',
      learn: {
        show: { cap: 'slide 3 right, 2 down: (1, 4) → (4, 2)' },
        together: [MV([2, 3, 'A'], { slide: [-4, -1] }, 'Slide A 4 left and 1 down.')],
        cue: 'Slide: add to x and y. Flip in the x-axis: y changes sign.',
        own: [MV([3, 1, 'B'], { flip: { y: 0 } }, 'Flip B in the x-axis (y = 0).'), MV([-2, 4, 'C'], { rot: 180 }, 'Turn 180° about (0, 0).', 6, true)]
      },
      p1: {
        show: { cap: 'flip in the y-axis: (x, y) → (−x, y)', eq: ['turn 180°: (x, y) → (−x, −y)'] },
        items: [MV([1, 2, 'A'], { slide: [3, 2] }, 'Slide A 3 right, 2 up.'), MV([-3, 4, 'B'], { slide: [5, -6] }, 'Slide B 5 right, 6 down.'),
          MV([4, 2, 'C'], { flip: { x: 0 } }, 'Flip C in the y-axis (x = 0).'), MV([-1, -5, 'D'], { flip: { y: 0 } }, 'Flip D in the x-axis (y = 0).')]
      },
      p2: {
        items: [MV([3, 5, 'E'], { rot: 90 }, 'Turn E 90° counterclockwise about (0, 0).'), MV([-4, 1, 'F'], { rot: -90 }, 'Turn F 90° clockwise about (0, 0).'),
          WM([[1, 1], [3, 1], [1, 4]], [[-4, -2], [-2, -2], [-4, 1]]), WM([[1, 1], [3, 1], [1, 4]], [[-1, 1], [-3, 1], [-1, 4]])]
      },
      p3: {
        items: [MV([2, -5, 'G'], { rot: 90 }, 'Turn G 90° counterclockwise about (0, 0).'), MV([5, 3, 'H'], { flip: { x: 2 } }, 'Flip H in the line x = 2.'),
          WM([[1, 1], [4, 1], [1, 3]], [[-1, -1], [-4, -1], [-1, -3]]), WM([[0, 1], [2, 1], [0, 4]], [[-1, 0], [-1, 2], [-4, 0]])]
      },
      think: {
        items: [{ q: 'Which moves keep a shape the same size and shape?', lines: { n: 2, key: 'Slides, flips and turns. Only a dilation changes the size.' } },
          { q: 'How can you tell a flip from a turn?', lines: { n: 3, key: 'A flip turns the shape over: the corners go round the other way. A turn keeps their order.' } },
          MV([-3, -2, 'K'], { rot: 180 }, 'Turn K 180° about (0, 0).'),
          { q: 'Predict where (2, 5) goes after a flip in the x-axis and then the y-axis.', lines: { n: 2, key: '(2, −5), then (−2, −5): the same as a 180° turn.' } }]
      }
    },

    dilate: {
      watch: 'adding the scale factor. A dilation multiplies every coordinate by it.',
      goal: 'I can dilate shapes from the origin.',
      learn: {
        show: { cap: 'scale factor 2 from (0, 0): (1, 3) → (2, 6)' },
        together: [MV([2, 1, 'A'], { dil: 3 }, 'Dilate A by 3 from (0, 0).')],
        cue: 'Multiply both coordinates by the scale factor.',
        own: [MV([4, -2, 'B'], { dil: 0.5 }, 'Dilate B by 1/2 from (0, 0).'), Q('2.5 × 4')]
      },
      p1: {
        show: { cap: 'a factor smaller than 1 shrinks the shape', eq: ['factor 1/2: (6, 4) → (3, 2)'] },
        items: [MV([1, 2, 'C'], { dil: 2 }, 'Dilate C by 2.'),
          MV([6, -4, 'E'], { dil: 0.5 }, 'Dilate E by 1/2.'), MV([-3, 2, 'F'], { dil: 2 }, 'Dilate by 2 from (0, 0).', 6, true),
          { q: 'A 5 cm side is dilated by 1.5. New length?', eq: ['[] cm'], a: [7.5], calc: '5 × 1.5' }]
      },
      p2: {
        items: [MV([-4, -6, 'F'], { dil: 1.5 }, 'Dilate F by 1.5.'), MV([3, -3, 'G'], { dil: 2 }, 'Dilate G by 2.'),
          { q: 'A side of 4 cm is dilated by 2.5. New length?', eq: ['[] cm'], a: [10], calc: '4 × 2.5' },
          { q: 'A 12 cm side becomes 3 cm. Scale factor?', eq: ['3 ÷ 12 = []'], a: [0.25] }]
      },
      p3: {
        items: [MV([-2, 4, 'H'], { dil: 0.75 }, 'Dilate H by 0.75.'), { q: 'A triangle\'s sides 3, 4, 5 cm are dilated by 1.5. New perimeter?', eq: ['[] cm'], a: [18], calc: '(3 + 4 + 5) × 1.5' },
          { q: 'A 6 cm by 4 cm photo is enlarged by 3. New size?', eq: ['6 × 3 = [] cm', '4 × 3 = [] cm'], a: [18, 12] },
          WM([[0, 0], [2, 0], [0, 2]], [[0, 0], [3, 0], [0, 3]])]
      },
      think: {
        items: [{ q: 'What does a scale factor of 1 do?', lines: { n: 1, key: 'Nothing: the shape stays the same size.' } },
          { q: 'Is a dilation a rigid move? Explain.', lines: { n: 2, key: 'No. It changes the size, but keeps the shape and the angles.' } },
          MV([4, 2, 'K'], { dil: 1.5 }, 'Dilate K by 1.5.'),
          { q: 'How do you undo a dilation by 4?', lines: { n: 1, key: 'Dilate by 1/4.' } }]
      }
    },

    drawing: {
      exp: ['E1.3', 'E1.2'],
      watch: 'mixing the order of the scale. 1 : 50 means 1 cm on the drawing is 50 cm in real life.',
      goal: 'I can use scale drawings and build models to scale.',
      learn: {
        show: { cap: 'scale 1 : 100: 4 cm on the plan', eq: ['4 × 100 = 400 cm = 4 m'] },
        together: [ST('A plan has scale 1 : 50. A wall is 8 cm on the plan. Real length in cm?', '8 × 50', 'cm')],
        cue: 'Drawing × scale = real. Real ÷ scale = drawing.',
        own: [ST('Scale 1 : 200. A room is 3.5 cm on the plan. Real length in cm?', '3.5 × 200', 'cm'), ST('Scale 1 : 25. A real table is 150 cm. On the drawing, in cm?', '150 ÷ 25', 'cm')]
      },
      p1: {
        show: { eq: ['1 : 250 000 map', '2 cm = 500 000 cm = 5 km'] },
        items: [ST('Scale 1 : 100. 6.5 cm on the plan. Real, in cm?', '6.5 × 100', 'cm'), ST('Scale 1 : 20. A real door is 200 cm. Drawing, in cm?', '200 ÷ 20', 'cm'),
          ST('Map scale 1 : 50 000. 4 cm on the map. Real, in cm?', '4 × 50000', 'cm'), ST('Scale 1 : 50 000. 4 cm on the map. Real, in km?', '4 × 50000 ÷ 100 ÷ 1000', 'km'),
          { q: 'Top view of a cube model. How many cubes?', pic: ['heights', { g: [[2, 1], [1, 1]] }], eq: ['[] cubes'], a: [5] }]
      },
      p2: {
        items: [ST('Scale 1 : 250. A garden is 12 cm long on the plan. Real, in m?', '12 × 250 ÷ 100', 'm'), ST('A 9 m pool, scale 1 : 300. On the plan, in cm?', '9 × 100 ÷ 300', 'cm'),
          { q: 'Top view of a model building. How many cubes?', pic: ['heights', { g: [[3, 2], [1, 1]] }], eq: ['[] cubes'], a: [7] },
          ST('Each cube stands for 2 m. A stack 3 cubes tall is how tall in real life?', '3 × 2', 'm'),
          { q: 'Find the scale: 5 cm on a drawing is 10 m real. 1 : ?', eq: ['10 × 100 ÷ 5 = []'], a: [200] }]
      },
      p3: {
        items: [ST('A map: 1 : 2 000 000. Two cities are 7.5 cm apart. Real, in km?', '7.5 × 2000000 ÷ 100 ÷ 1000', 'km'),
          { q: 'Redraw a 6 cm line at a new scale that is half as big. New length?', eq: ['6 ÷ 2 = []'], a: [3] },
          { q: 'A model of a 48 m bridge at 1 : 400. How long is the model, in cm?', eq: ['[] cm'], a: [12], calc: '48 × 100 ÷ 400' },
          { q: 'A top view of a model. How many cubes?', pic: ['heights', { g: [[3, 1, 2], [2, 1, 1]] }], eq: ['[] cubes'], a: [10] }]
      },
      think: {
        items: [{ q: 'Why do maps use scales like 1 : 50 000?', lines: { n: 2, key: 'Real places are too big for paper, so everything is shrunk by the same amount.' } },
          { q: 'Plan a model of your bedroom: choose a scale and give one length.', lines: { n: 3, key: 'For example 1 : 50: a 4 m wall is 400 ÷ 50 = 8 cm.' } },
          ST('Scale 1 : 75. A real car is 450 cm. Drawing, in cm?', '450 ÷ 75', 'cm'),
          { q: 'Draw the front view of the model: heights 2 and 1 in front, 1 and 1 behind.', draw: { h: 60, key: 'Two columns: 2 squares tall on the left, 1 on the right.' } }]
      }
    },

    area: {
      watch: 'multiplying the area by the scale factor. Area grows by the factor squared.',
      goal: 'I can see how area changes with a scale factor.',
      learn: {
        show: { cap: 'double the sides: 4 times the area', eq: ['2² = 4'] },
        together: [Q('3² × 10')],
        cue: 'Area × (scale factor)².',
        own: [Q('2² × 15'), Q('5² × 4'), Q('0.5² × 24')]
      },
      p1: {
        show: { eq: ['3 cm × 2 cm = 6 cm²', 'factor 3: 6 × 9 = 54 cm²'] },
        items: [Q('4² × 5'), Q('10² × 3'), Q('1.5² × 8'), Q('(1/2)² × 36', { frac: true }), { q: 'A 2 cm by 5 cm card is enlarged by 3. New area?', eq: ['[] cm²'], a: [90], calc: '2 × 3 × 5 × 3' }]
      },
      p2: {
        items: [{ q: 'Plan scale 1 : 100. A room is 4 cm by 3 cm on the plan. Real area in m²?', eq: ['[] m²'], a: [12], calc: '(4 × 100 ÷ 100) × (3 × 100 ÷ 100)' },
          { q: 'Scale 1 : 50. A rug is 4 cm by 6 cm on the plan. Real area in m²?', eq: ['[] m²'], a: [6], calc: '(4 × 50 ÷ 100) × (6 × 50 ÷ 100)' },
          Q('2.5² × 16'), Q('(1/3)² × 81', { frac: true })]
      },
      p3: {
        items: [{ q: 'An area went from 20 cm² to 180 cm². Scale factor?', eq: ['√(180 ÷ 20) = []'], a: [3] },
          { q: 'An area went from 50 m² to 12.5 m². Scale factor?', eq: ['√(12.5 ÷ 50) = []'], a: [0.5] },
          { q: 'Map 1 : 10 000. A park is 3 cm by 2 cm. Real area in m²?', eq: ['[] m²'], a: [60000], calc: '3 × 10000 × 2 × 10000 ÷ 10000' }]
      },
      think: {
        items: [{ q: 'Why does doubling the sides make 4 times the area?', lines: { n: 3, key: 'Both length and width double: 2 × 2 = 4 times as many squares.' } },
          { q: 'A pizza twice as wide costs twice as much. Good deal? Explain.', lines: { n: 2, key: 'Yes: it has 4 times the area for 2 times the price.' } },
          Q('3² × 7'),
          { q: 'What happens to the area with a factor of 1/2?', lines: { n: 1, key: 'It becomes 1/4 of the area.' } }]
      }
    }

  } });
})();
