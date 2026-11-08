/* Grade 4 Shapes and Grids: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/shapes.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: E1.1 rectangles and lines of symmetry; E1.2 plotting points on a grid; E1.3 translations and
   reflections; E2.4 angles compared with a right angle. The answer checks are in tests/verify/sheets.js: an angle's
   kind from the angle drawn (pick.angle), right angles and rectangles from the shape's corners (corners, pick.rect),
   symmetry from the shape and its mirror line (pick.sym), and points from the grid (pt, move). */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var KINDS = ['acute', 'right', 'obtuse', 'straight'];
  /* an angle: name its kind (rot turns it, so the kind does not depend on how it sits) */
  function AN(deg, rot, opts) {
    var o = opts || KINDS.slice(0, 3);
    var want = deg < 90 ? 'acute' : deg === 90 ? 'right' : deg < 180 ? 'obtuse' : 'straight';
    return { pic: ['angle', { deg: deg, rot: rot || 0, bench: true }], pick: { opts: o, ans: o.indexOf(want), angle: true } };
  }
  /* a shape on a grid: how many right angles, is it a rectangle, is the dashed line a line of symmetry */
  function RA(shape, n) { return { q: 'How many right angles?', pic: ['coord', { n: n || 6, shape: shape }], eq: ['[] right angles'], a: [rights(shape)], corners: true }; }
  function IR(shape, n) { var r = rights(shape) === 4 && shape.length === 4; return { q: 'Is it a rectangle?', pic: ['coord', { n: n || 6, shape: shape }], pick: { opts: ['yes', 'no'], ans: r ? 0 : 1, rect: true } }; }
  function SY(shape, mirror, n) { return { q: 'Is the dashed line a line of symmetry?', pic: ['coord', { n: n || 8, shape: shape, mirror: mirror }], pick: { opts: ['yes', 'no'], ans: sym(shape, mirror) ? 0 : 1, sym: true } }; }
  function rights(sh) {
    return sh.filter(function (p, i) {
      var a = sh[(i + sh.length - 1) % sh.length], b = sh[(i + 1) % sh.length];
      return (a[0] - p[0]) * (b[0] - p[0]) + (a[1] - p[1]) * (b[1] - p[1]) === 0;
    }).length;
  }
  function sym(sh, m) {
    var key = function (p) { return p[0] + ',' + p[1]; }, set = sh.map(key);
    return sh.every(function (p) { return set.indexOf(key(m.x != null ? [2 * m.x - p[0], p[1]] : [p[0], 2 * m.y - p[1]])) >= 0; });
  }
  /* read a point; plot points (drawn on the key) */
  function RP(pts, lab) { var q = pts.filter(function (p) { return p[2] === lab; })[0]; return { pic: ['coord', { n: 8, pts: pts }], eq: [lab + ' ( [] , [] )'], a: [q[0], q[1]], pt: lab }; }
  function PL(list) { return { q: 'Plot ' + list.map(function (p) { return p[2] + ' (' + p[0] + ', ' + p[1] + ')'; }).join(' and ') + '.', pic: ['coord', { n: 8, plot: list }] }; }
  /* a point after a slide or a flip */
  function MV(pt, move, q) {
    if (!q) q = 'Flip over the dashed line at ' + (move.flip.x != null ? move.flip.x + ' across.' : move.flip.y + ' up.');
    var to = move.slide ? [pt[0] + move.slide[0], pt[1] + move.slide[1]] : move.flip.x != null ? [2 * move.flip.x - pt[0], pt[1]] : [pt[0], 2 * move.flip.y - pt[1]];
    return { q: q, pic: ['coord', { n: 8, pts: [pt], mirror: move.flip }], eq: [pt[2] + "' ( [] , [] )"], a: to, move: { pt: pt[2], slide: move.slide, flip: move.flip } };
  }
  function MT(pt, move, q) { var o = MV(pt, move, pt[2] + ' is at (' + pt[0] + ', ' + pt[1] + '). ' + q); delete o.pic; o.move.pt = [pt[0], pt[1]]; return o; }
  var RECT = [[1, 1], [5, 1], [5, 4], [1, 4]], SQR = [[1, 1], [4, 1], [4, 4], [1, 4]], PARA = [[1, 1], [4, 1], [5, 4], [2, 4]], TRAP = [[1, 1], [5, 1], [4, 4], [2, 4]];
  var TILT = [[2, 1], [5, 4], [3, 6], [0, 3]], KITE = [[3, 1], [5, 3], [3, 6], [1, 3]], LSH = [[1, 1], [4, 1], [4, 2], [2, 2], [2, 4], [1, 4]], RTRI = [[1, 1], [5, 1], [1, 4]];

  S.register('shapes', { code: 'SH', ideas: {

    kinds: {
      watch: 'calling any wide-looking angle obtuse. Hold a square corner against it: smaller is acute, bigger is obtuse.',
      goal: 'I can compare an angle with a right angle.',
      learn: {
        show: { pic: ['angle', { deg: 50, bench: true }], cap: 'Smaller than the square corner', eq: ['acute'] },
        together: [AN(90), AN(130)],
        cue: 'Less than a right angle: acute. More: obtuse. A straight line: straight.',
        own: [AN(150), AN(180, 0, KINDS.slice(1))]
      },
      p1: {
        show: { pic: ['angle', { deg: 120, bench: true }], cap: 'Bigger than the square corner', eq: ['obtuse'] },
        items: [AN(30), AN(90), AN(110), AN(60), AN(160), AN(180, 0, KINDS.slice(1))]
      },
      p2: {
        items: [AN(80), AN(100), AN(45), AN(135), AN(20), AN(90, 0, ['acute', 'right'])]
      },
      p3: {
        items: [AN(85), AN(95), AN(10), AN(175), AN(180, 0, ['obtuse', 'straight']),
          { q: 'Draw an obtuse angle.', draw: { h: 70, key: ['angle', { deg: 120 }] } }]
      },
      think: {
        items: [{ q: '{b} says an angle with long arms is bigger than one with short arms. What would you tell {b}?', lines: { n: 3, key: 'The size of an angle is how far it opens, not how long the arms are.' } },
          { q: 'Find a right angle in the room. Name it.', lines: { n: 2, key: 'For example: the corner of a book or a door.' } },
          { q: 'How many right angles make a straight angle?', lines: { n: 2, key: '2. A straight angle is two square corners side by side.' } },
          { q: 'Draw an acute angle and a right angle that share one arm.', draw: { h: 80, key: 'One arm shared; the acute one inside the square corner.' } }]
      }
    },

    turned: {
      watch: 'calling a turned right angle "not right". Turn the page or the corner card: the kind stays the same.',
      goal: 'I can name an angle that is turned.',
      learn: {
        show: { pic: ['angle', { deg: 90, rot: 35, bench: true }], cap: 'Turned, still a square corner', eq: ['right'] },
        together: [AN(90, 120), AN(60, 200)],
        cue: 'Turn the corner card to match one arm. Only the opening counts.',
        own: [AN(140, 70), AN(30, 250)]
      },
      p1: {
        show: { pic: ['angle', { deg: 45, rot: 90 }], cap: 'Turned, still smaller than a square corner', eq: ['acute'] },
        items: [AN(90, 45), AN(50, 110), AN(120, 30), AN(90, 210)]
      },
      p2: {
        items: [AN(75, 140), AN(105, 200), AN(90, 330), AN(20, 60)]
      },
      p3: {
        items: [AN(88, 15), AN(92, 75), AN(90, 160), AN(178, 290, KINDS.slice(1)), AN(65, 230),
          { q: 'Draw a right angle that is tilted.', draw: { h: 70, key: ['angle', { deg: 90, rot: 40 }] } }]
      },
      think: {
        items: [{ q: '{b} says a right angle must have one arm flat. Is {b} right?', lines: { n: 3, key: 'No. A right angle can point any way. It is still a square corner.' } },
          { q: 'How can you check a tilted angle?', lines: { n: 3, key: 'Turn a square corner (a corner of paper) until one edge lies on an arm, then compare.' } },
          { q: 'Find two angles in letters of the alphabet. Name their kinds.', lines: { n: 3, key: 'For example: L has a right angle; V has an acute angle.' } },
          { q: 'Draw the same obtuse angle twice, turned two ways.', draw: { h: 80, key: 'Two angles with the same opening, pointing different ways.' } }]
      }
    },

    'rect-props': {
      watch: 'thinking a rectangle must be long and thin. A rectangle needs 4 right angles; a square is one too.',
      goal: 'I can describe what makes a rectangle.',
      learn: {
        show: { cap: 'Opposite sides equal and parallel', eq: ['4 right angles'] },
        together: [RA(RECT), RA(PARA)],
        cue: 'Check each corner with a square corner. A rectangle has 4 right angles.',
        own: [RA(SQR), RA(TRAP)]
      },
      p1: {
        show: { cap: 'A square has 4 right angles too', eq: ['a square is a rectangle'] },
        items: [RA(SQR), RA(RTRI), RA(PARA), RA(LSH)]
      },
      p2: {
        items: [RA(TILT, 7), RA(KITE, 7), RA(LSH), RA(TRAP)]
      },
      p3: {
        items: [RA(TILT, 7), RA([[1, 1], [5, 1], [5, 3], [3, 5], [1, 3]]),
          { q: 'Draw a rectangle that is not a square.', draw: { h: 70, key: 'Any 4-sided shape with 4 square corners and two different side lengths.' } },
          { q: 'Draw a shape with exactly 1 right angle.', draw: { h: 70, key: 'For example: a right triangle.' } }]
      },
      think: {
        items: [{ q: '{b} says a square is not a rectangle. What would you tell {b}?', lines: { n: 3, key: 'A square has 4 right angles, so it is a rectangle. It is a special one with 4 equal sides.' } },
          { q: 'What does parallel mean?', lines: { n: 2, key: 'Two lines that always stay the same distance apart and never meet.' } },
          { q: 'Name 2 things in your home shaped like a rectangle.', lines: { n: 2, key: 'For example: a door, a book cover.' } },
          { q: 'Can a shape have 3 right angles and 4 sides, but not 4 right angles? Explain.', lines: { n: 3, key: 'No. If 3 corners of a 4-sided shape are square, the last one is too.' } }]
      }
    },

    'is-rect': {
      watch: 'deciding by how a shape looks, especially when it is turned. Check every corner, not only the bottom ones.',
      goal: 'I can decide if a shape is a rectangle.',
      learn: {
        show: { cap: 'Turned, but every corner is square', eq: ['still a rectangle'] },
        together: [IR(RECT), IR(PARA)],
        cue: 'Check all 4 corners. All right angles? Then it is a rectangle.',
        own: [IR(TRAP), IR(TILT, 7)]
      },
      p1: {
        show: { cap: 'One corner is not square', eq: ['not a rectangle'] },
        items: [IR(RECT), IR(KITE, 7), IR(SQR), IR(PARA)]
      },
      p2: {
        items: [IR(TILT, 7), IR(TRAP), IR([[2, 1], [6, 1], [6, 3], [2, 3]], 7), IR([[1, 2], [3, 1], [5, 2], [3, 3]])]
      },
      p3: {
        items: [IR([[0, 2], [2, 0], [5, 3], [3, 5]], 6), IR([[1, 1], [5, 1], [6, 3], [1, 3]], 6), IR([[3, 0], [6, 3], [3, 6], [0, 3]], 6),
          { q: 'Draw a rectangle that is turned (not sitting flat).', draw: { h: 80, key: ['coord', { n: 7, shape: TILT }] } }]
      },
      think: {
        items: [{ q: '{b} says a turned square is a diamond, not a rectangle. Is {b} right?', lines: { n: 3, key: 'No. Turning does not change the corners. It still has 4 right angles.' } },
          { q: 'How many corners must you check to be sure a shape is a rectangle?', lines: { n: 2, key: 'All 4 (3 is enough for a 4-sided shape, but checking all is safest).' } },
          { q: 'Draw a 4-sided shape with 2 right angles.', draw: { h: 80, key: 'For example: a trapezoid with one square side.' } },
          IR([[1, 3], [3, 1], [6, 4], [4, 6]], 7)]
      }
    },

    symmetry: {
      watch: 'calling any line through the middle a line of symmetry. Fold on the line: both halves must match exactly.',
      goal: 'I can find lines of symmetry.',
      learn: {
        show: { cap: 'Fold on the line: the halves match', eq: ['a line of symmetry'] },
        together: [SY([[1, 1], [5, 1], [3, 5]], { x: 3 }, 6), SY([[1, 1], [5, 1], [5, 4], [1, 4]], { y: 3 }, 6)],
        cue: 'Fold on the line. Every corner must land on a corner.',
        own: [SY([[1, 1], [5, 1], [5, 3], [1, 3]], { y: 2 }, 6), SY([[1, 1], [6, 1], [3, 5]], { x: 3 }, 6)]
      },
      p1: {
        show: { cap: 'A square: 2 straight, 2 corner to corner', eq: ['4 lines'] },
        items: [SY([[2, 1], [6, 1], [6, 5], [2, 5]], { x: 4 }), SY([[2, 1], [6, 1], [6, 5], [2, 5]], { y: 2 }), SY([[1, 2], [7, 2], [4, 6]], { x: 4 }), SY([[1, 1], [4, 1], [6, 5], [3, 5]], { x: 3 })]
      },
      p2: {
        items: [SY([[2, 1], [6, 1], [7, 4], [1, 4]], { x: 4 }), SY([[1, 1], [5, 1], [5, 5], [1, 5]], { y: 3 }), SY([[1, 1], [7, 1], [7, 3], [1, 3]], { x: 5 }), SY([[4, 1], [6, 4], [4, 7], [2, 4]], { y: 4 })]
      },
      p3: {
        items: [SY([[1, 3], [4, 1], [7, 3], [4, 7]], { x: 4 }), SY([[1, 1], [3, 1], [3, 3], [5, 3], [5, 5], [1, 5]], { x: 3 }),
          { q: 'Draw all the lines of symmetry of a rectangle.', draw: { h: 80, key: '2 lines: one down the middle, one across the middle.' } },
          { q: 'Draw a shape with exactly 1 line of symmetry.', draw: { h: 80, key: 'For example: a heart, or a triangle with 2 equal sides.' } }]
      },
      think: {
        items: [{ q: '{b} says a rectangle has 4 lines of symmetry, like a square. What would you tell {b}?', lines: { n: 3, key: 'Fold a rectangle corner to corner: the halves do not match. It has 2 lines.' } },
          { q: 'Which capital letters have a line of symmetry? Name 3.', lines: { n: 2, key: 'For example: A, H, M, O, T.' } },
          { q: 'Find symmetry in nature, such as a leaf or a butterfly. Draw it with its line.', draw: { h: 90, key: 'A butterfly with a line down the middle.' } },
          { q: 'Can a shape have no lines of symmetry? Give an example.', lines: { n: 2, key: 'Yes: a scalene triangle, or the letter F.' } }]
      }
    },

    plot: {
      watch: 'going up first. Across first, then up: (3, 5) is 3 across, 5 up.',
      goal: 'I can read and plot points on a grid.',
      learn: {
        show: { pic: ['coord', { n: 6, pts: [[3, 5, 'A']] }], cap: 'Across 3, up 5', eq: ['A (3, 5)'] },
        together: [RP([[2, 4, 'B'], [5, 1, 'C']], 'B'), RP([[2, 4, 'B'], [5, 1, 'C']], 'C')],
        cue: 'Across first, then up. The first number is across.',
        own: [RP([[1, 6, 'D'], [6, 1, 'E']], 'D'), RP([[1, 6, 'D'], [6, 1, 'E']], 'E')]
      },
      p1: {
        show: { cap: 'Across 4, up 2', eq: ['(4, 2)'] },
        items: [RP([[3, 2, 'A'], [6, 5, 'B'], [1, 7, 'C']], 'A'), RP([[3, 2, 'A'], [6, 5, 'B'], [1, 7, 'C']], 'B'),
          RP([[3, 2, 'A'], [6, 5, 'B'], [1, 7, 'C']], 'C'), PL([[2, 5, 'D'], [7, 3, 'E']])]
      },
      p2: {
        items: [RP([[0, 4, 'F'], [4, 0, 'G'], [7, 7, 'H']], 'F'), RP([[0, 4, 'F'], [4, 0, 'G'], [7, 7, 'H']], 'G'),
          PL([[5, 2, 'J'], [2, 5, 'K']]), PL([[0, 6, 'L'], [6, 0, 'M']])]
      },
      p3: {
        items: [RP([[8, 3, 'P'], [3, 8, 'Q']], 'P'), PL([[1, 1, 'R'], [6, 1, 'S'], [6, 4, 'T']]),
          { q: 'Plot (1, 2), (5, 2), (5, 6), (1, 6) and join them. Name the shape.', pic: ['coord', { n: 8, keyShape: [[1, 2], [5, 2], [5, 6], [1, 6]] }], lines: { n: 1, key: 'A square.' } },
          { q: 'Write a point on the line from (2, 2) to (2, 7).', lines: { n: 1, key: 'For example (2, 4): the first number stays 2.' } }]
      },
      think: {
        items: [{ q: '{b} plotted (2, 6) by going up 2 and across 6. What went wrong?', lines: { n: 3, key: 'Across comes first: 2 across, then 6 up.' } },
          { q: 'Are (3, 5) and (5, 3) the same point? Explain.', lines: { n: 3, key: 'No. One is 3 across and 5 up; the other is 5 across and 3 up.' } },
          { q: 'Plot 3 points in a straight line. Write them.', pic: ['coord', { n: 8 }], lines: { n: 1, key: 'For example (1, 1), (2, 2), (3, 3).' } },
          { q: 'Give directions on a grid from (1, 1) to (4, 5).', lines: { n: 2, key: '3 across and 4 up.' } }]
      }
    },

    translate: {
      watch: 'moving the corners by different amounts. In a slide, every corner moves the same way and the same distance.',
      goal: 'I can slide a point or a shape.',
      learn: {
        show: { cap: 'Every corner: 3 right, 1 up', eq: ['(1, 1) → (4, 2)'] },
        together: [MV([2, 3, 'A'], { slide: [3, 0] }, 'Slide 3 right.'), MV([5, 6, 'B'], { slide: [0, -2] }, 'Slide 2 down.')],
        cue: 'Right and left change the first number. Up and down change the second.',
        own: [MV([1, 1, 'C'], { slide: [2, 4] }, 'Slide 2 right, 4 up.'), MV([6, 5, 'D'], { slide: [-3, -1] }, 'Slide 3 left, 1 down.')]
      },
      p1: {
        show: { cap: '(2, 3) slides 4 right', eq: ['(6, 3)'] },
        items: [MV([1, 2, 'A'], { slide: [4, 0] }, 'Slide 4 right.'), MV([3, 6, 'B'], { slide: [0, -3] }, 'Slide 3 down.'),
          MV([5, 1, 'C'], { slide: [-2, 3] }, 'Slide 2 left, 3 up.'), MV([0, 0, 'D'], { slide: [5, 5] }, 'Slide 5 right, 5 up.')]
      },
      p2: {
        items: [MT([4, 7, 'E'], { slide: [3, -2] }, 'Slide 3 right, 2 down.'), MT([8, 2, 'F'], { slide: [-6, 4] }, 'Slide 6 left, 4 up.'),
          MV([2, 5, 'G'], { slide: [5, -4] }, 'Slide 5 right, 4 down.'), MV([7, 7, 'H'], { slide: [-7, -7] }, 'Slide 7 left, 7 down.')]
      },
      p3: {
        items: [MT([12, 3, 'J'], { slide: [-5, 6] }, 'Slide 5 left, 6 up.'), MT([1, 9, 'K'], { slide: [10, -9] }, 'Slide 10 right, 9 down.'),
          { q: 'Slide the triangle 4 right, 2 up. Draw it.', pic: ['coord', { n: 8, shape: [[1, 1], [3, 1], [1, 4]], keyShape: [[5, 3], [7, 3], [5, 6]] }] },
          { q: 'A moved from (2, 2) to (6, 5). Describe the slide.', lines: { n: 1, key: '4 right, 3 up.' } }]
      },
      think: {
        items: [{ q: '{b} slid a square, but it came out tilted. What went wrong?', lines: { n: 3, key: 'A slide never turns a shape. Each corner moves the same way.' } },
          { q: 'Does a slide change a shape\'s size? Explain.', lines: { n: 2, key: 'No. Only its place changes.' } },
          { q: 'Make a pattern by sliding one shape 3 times.', draw: { h: 80, key: 'The same shape drawn 4 times, each the same step along.' } },
          MT([3, 4, 'P'], { slide: [5, 2] }, 'Slide 5 right, 2 up.')]
      }
    },

    reflect: {
      watch: 'flipping to the wrong distance. Count the squares to the mirror line, then the same number on the other side.',
      goal: 'I can flip a point or a shape over a mirror line.',
      learn: {
        show: { cap: '3 across is 1 from the line at 4 across', eq: ['(3, 2) → (5, 2)'] },
        together: [MV([2, 3, 'A'], { flip: { x: 4 } }, null), MV([5, 1, 'B'], { flip: { y: 3 } }, null)],
        cue: 'Count to the mirror line. Count the same on the other side.',
        own: [MV([1, 6, 'C'], { flip: { x: 3 } }, null), MV([6, 7, 'D'], { flip: { y: 5 } }, null)]
      },
      p1: {
        show: { cap: '2 from the line at 3 up, so 2 on the other side', eq: ['(4, 1) → (4, 5)'] },
        items: [MV([3, 2, 'A'], { flip: { x: 4 } }, null), MV([1, 5, 'B'], { flip: { x: 4 } }, null),
          MV([6, 1, 'C'], { flip: { y: 4 } }, null), MV([2, 7, 'D'], { flip: { y: 4 } }, null)]
      },
      p2: {
        items: [MV([7, 3, 'E'], { flip: { x: 5 } }, null), MV([4, 0, 'F'], { flip: { y: 3 } }, null),
          MT([2, 5, 'G'], { flip: { x: 6 } }, 'Flip over a mirror line going up through 6 across.'), MT([6, 1, 'H'], { flip: { y: 4 } }, 'Flip over a mirror line going across through 4 up.'),
          MT([1, 3, 'I'], { flip: { x: 3 } }, 'Flip over a mirror line going up through 3 across.'), MT([5, 6, 'L'], { flip: { y: 5 } }, 'Flip over a mirror line going across through 5 up.')]
      },
      p3: {
        items: [MT([9, 4, 'J'], { flip: { x: 5 } }, 'Flip over a mirror line going up through 5 across.'), MT([3, 8, 'K'], { flip: { y: 2 } }, 'Flip over a mirror line going across through 2 up.'),
          { q: 'Flip the shape over the dashed line. Draw it.', pic: ['coord', { n: 8, shape: [[1, 2], [3, 2], [3, 5]], mirror: { x: 4 }, keyShape: [[7, 2], [5, 2], [5, 5]] }] },
          { q: 'A point and its flip are (2, 3) and (8, 3). Where is the mirror line?', lines: { n: 1, key: 'Halfway: the line x = 5, going straight up.' } }]
      },
      think: {
        items: [{ q: '{b} flipped (2, 3) over the line x = 4 and got (4, 3). What went wrong?', lines: { n: 3, key: '{b} stopped at the line. It is 2 to the line, then 2 more: (6, 3).' } },
          { q: 'How is a flip different from a slide?', lines: { n: 3, key: 'A flip makes a mirror image (it faces the other way); a slide keeps it facing the same way.' } },
          { q: 'Write your first name and flip it over a line. Draw it.', draw: { h: 80, key: 'The letters reversed like in a mirror.' } },
          MT([1, 2, 'P'], { flip: { x: 3 } }, 'Flip over a mirror line going up through 3 across.')]
      }
    }
  } });
})();
