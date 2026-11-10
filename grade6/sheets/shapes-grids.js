/* Grade 6 Shapes and Grids: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/shapes-grids.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: E1.1 quadrilaterals by their sides, angles, diagonals and symmetry (lines and turns); E1.2 views of
   cube buildings; E1.3 points in all four quadrants and translations; E1.4 reflections, rotations and combined moves.
   The answer checks are in tests/verify/sheets.js: a shape's properties come from a table of the shapes (quad,
   pick.qfit, pick.qprop, pick.family), a view from the stack heights (view), a point from the grid (pt), and a moved
   point from the slide, flip or turn about (0, 0) (move). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* what each shape has: pairs of parallel sides, right angles, lines of symmetry, order of turning symmetry */
  var Q = {
    square: { par: 2, right: 4, sym: 4, rot: 4 }, rectangle: { par: 2, right: 4, sym: 2, rot: 2 }, rhombus: { par: 2, right: 0, sym: 2, rot: 2 },
    parallelogram: { par: 2, right: 0, sym: 0, rot: 2 }, trapezoid: { par: 1, right: 0, sym: 0, rot: 1 }, kite: { par: 0, right: 0, sym: 1, rot: 1 },
    'isosceles trapezoid': { par: 1, sym: 1, rot: 1 }, 'equilateral triangle': { sym: 3, rot: 3 }, 'regular pentagon': { sym: 5, rot: 5 },
    'regular hexagon': { sym: 6, rot: 6 }, 'regular octagon': { sym: 8, rot: 8 }
  };
  var ROW = { par: '[] pairs of parallel sides', right: '[] right angles', sym: '[] lines of symmetry', rot: 'order []' };
  var PIC = {
    square: ['plane', { kind: 'rect', b: 3, h: 3, unit: 'cm' }], rectangle: ['plane', { kind: 'rect', b: 5, h: 3, unit: 'cm' }],
    rhombus: ['plane', { kind: 'rhom', b: 6, h: 4, unit: 'cm' }], parallelogram: ['plane', { kind: 'para', b: 5, h: 3, off: 2, unit: 'cm' }],
    trapezoid: ['plane', { kind: 'trap', b: 6, t: 3, h: 3, off: 1, unit: 'cm' }], kite: ['plane', { kind: 'kite', b: 4, h: 6, off: 2, unit: 'cm' }]
  };
  /* a shape's properties: one row per key (pic: true draws the shape) */
  function QR(shape, keys, pic) {
    var o = { q: (/^[aeiou]/.test(shape) ? 'An ' : 'A ') + shape + ':', eq: keys.map(function (k) { return ROW[k]; }), a: keys.map(function (k) { return Q[shape][k]; }), quad: shape };
    if (pic && PIC[shape]) o.pic = PIC[shape];
    return o;
  }
  /* yes or no: does the shape have this property? */
  function QP(q, shape, prop, yes) { return { q: q, pick: { opts: ['yes', 'no'], ans: yes ? 0 : 1, qprop: [shape, prop] } }; }
  /* the one shape that fits */
  function QF(q, opts, fit, ans) { return { q: q, pick: { opts: opts, ans: ans, qfit: fit }, wide: true }; }
  /* is every one of these also one of those? */
  function FM(a, b, yes) { return { q: 'Is every ' + a + ' a ' + b + '?', pick: { opts: ['yes', 'no'], ans: yes ? 0 : 1, family: [a, b] } }; }
  /* views of a stack plan */
  function VW(g) {
    var front = g[0].map(function (_, c) { return Math.max.apply(null, g.map(function (r) { return r[c]; })); }), side = g.map(function (r) { return Math.max.apply(null, r); }).reverse();
    var bl = function (l) { return l.map(function () { return '[]'; }).join(' '); };
    return { q: 'Side view: read front to back.', pic: ['heights', { g: g }], eq: ['front ' + bl(front), 'side ' + bl(side)], a: front.concat(side), view: ['front', 'side'] };
  }
  function CU(g) { return { q: 'How many cubes in all?', pic: ['heights', { g: g }], eq: ['[] cubes'], a: [g.reduce(function (t, r) { return t + r.reduce(function (x, y) { return x + y; }, 0); }, 0)] }; }
  /* read a point on a four-quadrant grid */
  function RP(pts, lab) { var p = pts.filter(function (q) { return q[2] === lab; })[0]; return { pic: ['coord', { n: 5, min: -5, u: 9, pts: pts }], eq: [lab + ' ( [] , [] )'], a: [p[0], p[1]], pt: lab }; }
  /* where a point goes after a slide, a flip over x = k or y = k, or a turn about (0, 0) */
  function to(pt, m) {
    if (m.slide) return [pt[0] + m.slide[0], pt[1] + m.slide[1]];
    if (m.flip) return m.flip.x != null ? [2 * m.flip.x - pt[0], pt[1]] : [pt[0], 2 * m.flip.y - pt[1]];
    var r = [pt[0], pt[1]], k = ((m.turn.dir === 'ccw' ? 360 - m.turn.deg : m.turn.deg) / 90) % 4;
    for (var i = 0; i < k; i++) r = [r[1], -r[0]];
    return r.map(function (v) { return v + 0; });
  }
  function MV(pt, m, q) { return { q: q, pic: ['coord', { n: 5, min: -5, u: 9, pts: [pt], mirror: m.flip }], eq: [pt[2] + "' ( [] , [] )"], a: to(pt, m), move: { pt: pt[2], slide: m.slide, flip: m.flip, turn: m.turn } }; }
  /* the same with no grid: the point is in the question */
  function MT(pt, m, q) { var o = MV(pt, m, pt[2] + ' (' + pt[0] + ', ' + pt[1] + '). ' + q); delete o.pic; o.move.pt = [pt[0], pt[1]]; return o; }

  S.register('shapes-grids', { code: 'SG', ideas: {

    props: {
      watch: 'naming a shape from how it looks. Check its sides, angles and diagonals.',
      goal: 'I can describe quadrilaterals by their properties.',
      learn: {
        show: { cap: 'a rhombus', eq: ['4 equal sides', 'diagonals meet at 90°'] },
        together: [QR('rectangle', ['par', 'right']), QP('Do the diagonals of a rhombus meet at 90°?', 'rhombus', 'dperp', true)],
        cue: 'Check the sides, the angles, the parallel sides and the diagonals.',
        own: [QR('trapezoid', ['par', 'right']), QP('Are the diagonals of a rectangle equal?', 'rectangle', 'deq', true)]
      },
      p1: {
        show: { eq: ['a kite: 2 pairs of equal sides', 'side by side, not opposite'] },
        items: [QR('parallelogram', ['par', 'right']), QR('kite', ['par', 'right']), QR('square', ['par', 'right']),
          QP('Do the diagonals of a parallelogram cut each other in half?', 'parallelogram', 'dhalf', true)]
      },
      p2: {
        items: [QR('rhombus', ['par', 'right']), QP('Are the diagonals of a kite equal?', 'kite', 'deq', false),
          QF('Which has exactly 1 pair of parallel sides?', ['rhombus', 'trapezoid', 'kite'], { par: 1 }, 1),
          QF('Which has 4 right angles but sides that are not all equal?', ['square', 'rectangle', 'rhombus'], { right: 4, sides: 'opp' }, 1),
          QR('isosceles trapezoid', ['par']), QP('Does a kite have a right angle?', 'kite', 'right', false)]
      },
      p3: {
        items: [QF('Which has diagonals that meet at 90° and no parallel sides?', ['rhombus', 'kite', 'square'], { dperp: 1, par: 0 }, 1),
          QP('Do the diagonals of a trapezoid always cut each other in half?', 'trapezoid', 'dhalf', false),
          QP('Are the diagonals of a square equal?', 'square', 'deq', true),
          { q: 'Draw a quadrilateral with exactly 1 pair of parallel sides. Name it.', draw: { h: 70, key: 'A trapezoid: one pair of parallel sides.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says a shape with 4 equal sides must be a square. Is {b} right?', lines: { n: 3, key: 'No. A rhombus has 4 equal sides but its angles need not be right angles.' } },
          { q: 'How are a rhombus and a kite alike? How are they different?', lines: { n: 3, key: 'Alike: diagonals meet at 90°. Different: a rhombus has 4 equal sides and 2 pairs of parallel sides; a kite has neither.' } },
          QR('parallelogram', ['par', 'right'])]
      }
    },

    families: {
      watch: 'thinking a square is not a rectangle. A square has everything a rectangle needs, and more.',
      goal: 'I can sort quadrilaterals into families.',
      learn: {
        show: { cap: 'a rectangle needs 2 pairs of parallel sides and 4 right angles', eq: ['a square has both'] },
        together: [FM('square', 'rectangle', true), FM('rectangle', 'square', false)],
        cue: 'List what the bigger family needs. Does the shape have all of it?',
        own: [FM('rhombus', 'parallelogram', true), FM('square', 'rhombus', true), FM('kite', 'rhombus', false)]
      },
      p1: {
        show: { cap: 'a parallelogram needs 2 pairs of parallel sides', eq: ['a rhombus has them'] },
        items: [FM('rectangle', 'parallelogram', true), FM('parallelogram', 'rectangle', false), FM('rhombus', 'square', false),
          FM('square', 'parallelogram', true), FM('rhombus', 'kite', true), FM('trapezoid', 'parallelogram', false)]
      },
      p2: {
        items: [FM('square', 'kite', true), FM('parallelogram', 'rhombus', false), FM('kite', 'parallelogram', false),
          FM('rectangle', 'rhombus', false),
          { q: 'Draw a family tree: quadrilateral, parallelogram, rectangle, rhombus, square.', draw: { h: 90, key: 'Quadrilateral at the top; parallelogram under it; rectangle and rhombus under that; square under both.' }, wide: true }]
      },
      p3: {
        items: [FM('square', 'parallelogram', true), FM('rhombus', 'rectangle', false),
          { q: 'Name every family a square belongs to.', lines: { n: 2, key: 'Quadrilateral, parallelogram, rectangle, rhombus and kite.' }, wide: true },
          { q: 'What must you add to a rhombus to make it a square?', lines: { n: 1, key: 'Right angles: 4 of them.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says a square is not a rectangle because its sides are all equal. What would you say?', lines: { n: 3, key: 'A rectangle needs 4 right angles and 2 pairs of parallel sides. A square has those, so it is a rectangle.' } },
          { q: 'Why is a parallelogram not always a rectangle?', lines: { n: 2, key: 'Its angles need not be right angles.' } },
          FM('square', 'rhombus', true)]
      }
    },

    lines: {
      watch: 'counting the diagonals of a rectangle as lines of symmetry. Fold it: the halves must match exactly.',
      goal: 'I can find the lines of symmetry of a shape.',
      learn: {
        show: { pic: PIC.rectangle, cap: 'a rectangle: fold across or down', eq: ['2 lines of symmetry'] },
        together: [QR('square', ['sym']), QR('kite', ['sym'])],
        cue: 'Fold it in your mind. Both halves must match exactly.',
        own: [QR('parallelogram', ['sym']), QR('equilateral triangle', ['sym']), QR('rhombus', ['sym'])]
      },
      p1: {
        show: { eq: ['regular pentagon: 5 lines'] },
        items: [QR('rectangle', ['sym']), QR('trapezoid', ['sym']), QR('regular hexagon', ['sym']), QR('isosceles trapezoid', ['sym']),
          QR('regular pentagon', ['sym']), QR('regular octagon', ['sym'])]
      },
      p2: {
        items: [QR('square', ['sym', 'par']), QR('kite', ['sym', 'par']), QR('rhombus', ['sym', 'right']),
          { q: 'Draw a shape with exactly 1 line of symmetry. Draw the line.', draw: { h: 70, key: 'For example a kite or an isosceles triangle, with the fold line down the middle.' } }]
      },
      p3: {
        items: [QF('Which has exactly 1 line of symmetry?', ['rectangle', 'kite', 'parallelogram'], { sym: 1, par: 0 }, 1),
          QF('Which has 2 lines of symmetry and no right angles?', ['rhombus', 'square', 'kite'], { sym: 2, right: 0 }, 0),
          { q: 'Draw the lines of symmetry of a regular hexagon.', draw: { h: 80, key: '6 lines: 3 through opposite corners and 3 through the middles of opposite sides.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says the diagonal of a rectangle is a line of symmetry. How can {b} test it?', lines: { n: 3, key: 'Fold a paper rectangle along the diagonal. The corners do not meet, so it is not.' } },
          { q: 'What do you notice about the lines of symmetry of regular shapes?', lines: { n: 2, key: 'A regular shape has as many lines of symmetry as it has sides.' } },
          QR('regular octagon', ['sym'])]
      }
    },

    turns: {
      watch: 'counting the starting position twice. Count how many times it fits in one full turn.',
      goal: 'I can find the order of rotational symmetry.',
      learn: {
        show: { pic: PIC.square, cap: 'a square fits 4 times in one full turn', eq: ['order 4, every 90°'] },
        together: [QR('rectangle', ['rot']), { eq: ['360° ÷ 2 = []°'], a: [180] }],
        cue: 'Count the fits in one full turn. The smallest turn is 360° ÷ the order.',
        own: [QR('parallelogram', ['rot']), QR('regular hexagon', ['rot']), { eq: ['360° ÷ 6 = []°'], a: [60] }]
      },
      p1: {
        show: { eq: ['order 1: it only fits once', 'no turning symmetry'] },
        items: [QR('kite', ['rot']), QR('rhombus', ['rot']), QR('trapezoid', ['rot']), QR('equilateral triangle', ['rot']),
          { eq: ['360° ÷ 3 = []°'], a: [120] }, { eq: ['360° ÷ 4 = []°'], a: [90] }]
      },
      p2: {
        items: [QR('square', ['sym', 'rot']), QR('parallelogram', ['sym', 'rot']), QR('regular pentagon', ['sym', 'rot']),
          QR('regular octagon', ['rot']), { eq: ['360° ÷ 8 = []°'], a: [45] }]
      },
      p3: {
        items: [QF('Which has turning symmetry but no lines of symmetry?', ['kite', 'parallelogram', 'rectangle'], { sym: 0, rot: 2 }, 1),
          QR('isosceles trapezoid', ['sym', 'rot']),
          { q: 'Draw a shape with order 2 and no lines of symmetry.', draw: { h: 70, key: 'A parallelogram that is not a rectangle or rhombus.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says a rectangle has order 4. What went wrong?', lines: { n: 3, key: 'A rectangle fits only after a half turn and a full turn: order 2. A quarter turn does not fit.' } },
          { q: 'Can a shape have lines of symmetry but order 1? Give an example.', lines: { n: 2, key: 'Yes: a kite has 1 line of symmetry and order 1.' } },
          QR('regular hexagon', ['sym', 'rot'])]
      }
    },

    build: {
      watch: 'counting all the cubes in a column for the front view. Each column shows only its tallest stack.',
      goal: 'I can draw the views of a cube building and build from them.',
      learn: {
        show: { pic: ['heights', { g: [[1, 2], [3, 1]] }], cap: 'front 3 2, side 2 3: 7 cubes' },
        together: [VW([[2, 1], [1, 1]])],
        cue: 'Front: the tallest in each column. Side: the tallest in each row. Add for the cubes.',
        own: [VW([[1, 3], [2, 2]]), CU([[3, 1, 2], [1, 0, 1]])]
      },
      p1: {
        show: { eq: ['add the top view numbers'] },
        items: [VW([[1, 1], [2, 1]]), VW([[2, 2], [1, 3]]), CU([[2, 2], [1, 3]]), VW([[3, 1], [1, 2]])]
      },
      p2: {
        items: [VW([[3, 1, 2], [1, 1, 1]]), VW([[0, 2, 1], [3, 1, 0]]), CU([[0, 2, 1], [3, 1, 0]]), VW([[1, 0, 2], [2, 2, 1]])]
      },
      p3: {
        items: [VW([[2, 3, 1], [1, 2, 0], [1, 1, 1]]), CU([[2, 3, 1], [1, 2, 0], [1, 1, 1]]),
          { q: 'Front view 2 1, side view 1 2. Draw a top view with numbers that fits.', draw: { h: 70, key: 'For example a 2 by 2 top view: back row 2 1, front row 1 1.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says the front view shows every cube. What would you tell {b}?', lines: { n: 3, key: 'Cubes behind others are hidden. A view shows only the tallest stack in each column.' } },
          { q: 'Can two different buildings have the same front and side views? Explain.', lines: { n: 3, key: 'Yes. Cubes hidden behind the tallest stacks can change without changing either view.' } },
          VW([[2, 1, 3], [1, 1, 1]])]
      }
    },

    plot: {
      watch: 'mixing up the order. The first number goes across (left or right), the second goes up or down.',
      goal: 'I can read and plot points in all four quadrants.',
      learn: {
        show: { cap: '3 left, then 2 up', eq: ['A (−3, 2)'] },
        together: [RP([[4, -2, 'B'], [-1, -3, 'C']], 'B'), RP([[4, -2, 'B'], [-1, -3, 'C']], 'C')],
        cue: 'Across first: right is +, left is −. Then up is +, down is −.',
        own: [RP([[-4, -1, 'D'], [2, 3, 'E'], [0, -4, 'F']], 'D')]
      },
      p1: {
        show: { eq: ['(+, +) top right', '(−, −) bottom left'] },
        items: [RP([[3, 4, 'A'], [-2, 3, 'B']], 'A'), RP([[3, 4, 'A'], [-2, 3, 'B']], 'B'), RP([[-5, -2, 'C'], [1, -4, 'D']], 'C'), RP([[-5, -2, 'C'], [1, -4, 'D']], 'D')]
      },
      p2: {
        items: [RP([[-3, 0, 'E'], [0, 5, 'F'], [4, -5, 'G']], 'E'), RP([[-3, 0, 'E'], [0, 5, 'F'], [4, -5, 'G']], 'G'),
          { q: 'Plot P (−4, 3), Q (2, −1) and R (−2, −5).', pic: ['coord', { n: 5, min: -5, u: 9, plot: [[-4, 3, 'P'], [2, -1, 'Q'], [-2, -5, 'R']] }], wide: true }]
      },
      p3: {
        items: [{ q: 'Three corners of a rectangle are (−3, 2), (2, 2) and (2, −1). Where is the fourth?', pic: ['coord', { n: 5, min: -5, u: 9, pts: [[-3, 2], [2, 2], [2, -1]], plot: [[-3, -1, 'D']] }], eq: ['D ( [] , [] )'], a: [-3, -1], pt: [-3, -1], wide: true },
          { q: 'Plot (−4, −2), (0, 4) and (4, −2). Join them. What shape is it?', pic: ['coord', { n: 5, min: -5, u: 9, keyShape: [[-4, -2], [0, 4], [4, -2]] }], lines: { n: 1, key: 'An isosceles triangle.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} plotted (−2, 4) at 2 right and 4 down. What went wrong?', lines: { n: 3, key: '−2 means 2 to the left, and 4 means 4 up.' } },
          { q: 'What is true of every point on the x-axis?', lines: { n: 2, key: 'Its second number is 0, like (3, 0) or (−2, 0).' } },
          RP([[-1, 4, 'K'], [3, -3, 'L']], 'L')]
      }
    },

    translate: {
      watch: 'adding the slide to the wrong number. Left and right change the first number; up and down change the second.',
      goal: 'I can translate a point or shape on a four-quadrant grid.',
      learn: {
        show: { pic: ['coord', { n: 5, min: -5, u: 9, shape: [[-4, 1], [-2, 1], [-4, 3]], after: [[1, -1], [3, -1], [1, 1]] }], cap: '5 right and 2 down: same size, same shape' },
        together: [MV([-3, 2, 'A'], { slide: [4, -3] }, 'Slide 4 right and 3 down.')],
        cue: 'Right +, left −: change the first number. Up +, down −: change the second.',
        own: [MT([2, 1, 'B'], { slide: [-5, 2] }, 'Slide 5 left and 2 up.'), MT([-1, -2, 'C'], { slide: [3, 4] }, 'Slide 3 right and 4 up.')]
      },
      p1: {
        show: { cap: '(1, 3), 4 left', eq: ['(−3, 3)'] },
        items: [MV([1, 3, 'A'], { slide: [-4, 0] }, 'Slide 4 left.'), MV([-2, -1, 'B'], { slide: [0, 5] }, 'Slide 5 up.'),
          MV([3, -2, 'C'], { slide: [-2, -2] }, 'Slide 2 left and 2 down.'), MV([-4, 4, 'D'], { slide: [6, -7] }, 'Slide 6 right and 7 down.')]
      },
      p2: {
        items: [MT([5, -3, 'E'], { slide: [-8, 4] }, 'Slide 8 left and 4 up.'), MT([-6, -2, 'F'], { slide: [9, -5] }, 'Slide 9 right and 5 down.'),
          { q: 'Slide the triangle 5 right and 3 down. Draw it.', pic: ['coord', { n: 5, min: -5, u: 9, shape: [[-4, 2], [-2, 2], [-3, 4]], keyShape: [[1, -1], [3, -1], [2, 1]] }], wide: true }]
      },
      p3: {
        items: [MT([-7, 10, 'G'], { slide: [12, -15] }, 'Slide 12 right and 15 down.'),
          { q: 'A moved from (−2, 3) to (4, −1). Describe the slide.', lines: { n: 1, key: '6 right and 4 down.' }, wide: true },
          { q: 'Slide the square 6 left and 4 up. Draw it.', pic: ['coord', { n: 5, min: -5, u: 9, shape: [[1, -4], [3, -4], [3, -2], [1, -2]], keyShape: [[-5, 0], [-3, 0], [-3, 2], [-5, 2]] }], wide: true }]
      },
      think: {
        items: [{ q: '{b} slid (2, 3) 4 left and got (6, 3). What went wrong?', lines: { n: 3, key: 'Left takes away: 2 − 4 = −2. The point is (−2, 3).' } },
          { q: 'Does a translation change the size or the shape? Why?', lines: { n: 2, key: 'No. Every point moves the same way, so the shape just moves.' } },
          MT([-3, -4, 'H'], { slide: [5, 9] }, 'Slide 5 right and 9 up.')]
      }
    },

    reflect: {
      watch: 'moving the point the wrong way. A flip keeps the point the same distance from the mirror, on the other side.',
      goal: 'I can reflect a point or shape in a line.',
      learn: {
        show: { pic: ['coord', { n: 5, min: -5, u: 9, pts: [[3, 2, 'A']], mirror: { x: 0 } }], cap: 'flip over the y-axis (x = 0)', eq: ["A' (−3, 2)"] },
        together: [MV([2, 4, 'B'], { flip: { x: 0 } }, 'Flip over the y-axis (x = 0).')],
        cue: 'Same distance from the mirror, on the other side.',
        own: [MT([-3, 1, 'C'], { flip: { y: 0 } }, 'Flip over the x-axis (y = 0).'), MT([1, -2, 'D'], { flip: { x: 2 } }, 'Flip over the line x = 2.')]
      },
      p1: {
        show: { cap: 'over the x-axis', eq: ['(4, 3) to (4, −3)'] },
        items: [MV([4, 3, 'A'], { flip: { y: 0 } }, 'Flip over the x-axis (y = 0).'), MV([-2, -1, 'B'], { flip: { x: 0 } }, 'Flip over the y-axis (x = 0).'),
          MV([-4, 2, 'C'], { flip: { x: -1 } }, 'Flip over the line x = −1.'), MV([2, -3, 'D'], { flip: { y: 1 } }, 'Flip over the line y = 1.')]
      },
      p2: {
        items: [MT([6, -4, 'E'], { flip: { y: 0 } }, 'Flip over the x-axis (y = 0).'), MT([-7, 5, 'F'], { flip: { x: 0 } }, 'Flip over the y-axis (x = 0).'),
          { q: 'Flip the triangle over the y-axis (x = 0). Draw it.', pic: ['coord', { n: 5, min: -5, u: 9, mirror: { x: 0 }, shape: [[1, 1], [4, 1], [4, 3]], keyShape: [[-1, 1], [-4, 1], [-4, 3]] }], wide: true }]
      },
      p3: {
        items: [MV([3, 4, 'G'], { flip: { y: 2 } }, 'Flip over the line y = 2.'),
          { q: 'Flip the shape over the x-axis (y = 0). Draw it.', pic: ['coord', { n: 5, min: -5, u: 9, mirror: { y: 0 }, shape: [[-4, 1], [-1, 1], [-1, 4]], keyShape: [[-4, -1], [-1, -1], [-1, -4]] }], wide: true }]
      },
      think: {
        items: [{ q: '{b} flipped (3, 2) over the y-axis and got (3, −2). What went wrong?', lines: { n: 3, key: 'That is a flip over the x-axis. Over the y-axis the first number changes sign: (−3, 2).' } },
          { q: 'Which point does not move when you flip over the x-axis?', lines: { n: 2, key: 'Any point on the x-axis, like (4, 0).' } },
          MT([-5, -6, 'H'], { flip: { y: 0 } }, 'Flip over the x-axis (y = 0).')]
      }
    },

    rotate: {
      watch: 'turning the wrong way. Clockwise turns the way clock hands go.',
      goal: 'I can rotate a point about (0, 0) and combine moves.',
      learn: {
        show: { pic: ['coord', { n: 5, min: -5, u: 9, pts: [[3, 1, 'A'], [1, -3, "A'"]] }], cap: '90° clockwise about (0, 0)', eq: ['(3, 1) to (1, −3)'] },
        together: [MV([2, 4, 'B'], { turn: { deg: 90, dir: 'cw' } }, 'Turn 90° clockwise about (0, 0).')],
        cue: 'Turn the paper, not your head. Check the quadrant it lands in.',
        own: [MT([3, 2, 'C'], { turn: { deg: 180, dir: 'cw' } }, 'Turn 180° clockwise about (0, 0).'), MT([4, 1, 'D'], { turn: { deg: 90, dir: 'ccw' } }, 'Turn 90° counterclockwise about (0, 0).')]
      },
      p1: {
        show: { eq: ['180° turn: (2, 3) to (−2, −3)'] },
        items: [MV([1, 4, 'A'], { turn: { deg: 180, dir: 'cw' } }, 'Turn 180° clockwise about (0, 0).'), MV([-2, 3, 'B'], { turn: { deg: 90, dir: 'cw' } }, 'Turn 90° clockwise about (0, 0).'),
          MV([4, -1, 'C'], { turn: { deg: 90, dir: 'ccw' } }, 'Turn 90° counterclockwise about (0, 0).'), MV([-3, -2, 'D'], { turn: { deg: 180, dir: 'ccw' } }, 'Turn 180° counterclockwise about (0, 0).')]
      },
      p2: {
        items: [MT([5, 2, 'E'], { turn: { deg: 90, dir: 'cw' } }, 'Turn 90° clockwise about (0, 0).'), MT([-6, 3, 'F'], { turn: { deg: 270, dir: 'cw' } }, 'Turn 270° clockwise about (0, 0).'),
          { q: 'Turn the triangle 180° about (0, 0). Draw it.', pic: ['coord', { n: 5, min: -5, u: 9, shape: [[1, 1], [4, 1], [1, 3]], keyShape: [[-1, -1], [-4, -1], [-1, -3]] }], wide: true }]
      },
      p3: {
        items: [MT([2, 5, 'G'], { slide: [-3, -1] }, 'First slide 3 left and 1 down.'),
          { q: 'Then turn that point 180° clockwise about (0, 0). Where does it end?', eq: ["G'' ( [] , [] )"], a: [1, -4], move: { pt: [-1, 4], turn: { deg: 180, dir: 'cw' } }, wide: true },
          { q: 'Flip (3, 2) over the y-axis, then over the x-axis. Which single turn does the same?', lines: { n: 2, key: 'A 180° turn about (0, 0): both give (−3, −2).' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says a 90° clockwise turn is the same as a 270° counterclockwise turn. Is {b} right?', lines: { n: 3, key: 'Yes. Both end in the same place, because 90 + 270 = 360, a full turn.' } },
          { q: 'Describe two moves that take (1, 1) to (−1, 3).', lines: { n: 2, key: 'For example: flip over the y-axis to (−1, 1), then slide 2 up.' } },
          MT([-4, 5, 'H'], { turn: { deg: 90, dir: 'ccw' } }, 'Turn 90° counterclockwise about (0, 0).')]
      }
    }
  } });
})();
