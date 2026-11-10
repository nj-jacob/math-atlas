/* Grade 7 Shapes and Moves: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/shapes-moves.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: E1.1 prisms and pyramids, named by their bases, and their planes and order of symmetry; E1.2 front, side
   and top views; E1.3 scale factor and similar shapes; E1.4 points in four quadrants, and translations, reflections and
   rotations about the origin. The answer checks are in tests/verify/sheets.js: a solid's faces, edges, vertices and
   symmetry are looked up, a view is worked out from the stacks, and a moved point is moved again by the rule. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var NAME = { tri: 'triangular prism', prism: 'rectangular prism', pentprism: 'pentagonal prism', hexprism: 'hexagonal prism',
    tpyr: 'triangular pyramid', pyramid: 'square-based pyramid', pentpyr: 'pentagonal pyramid', hexpyr: 'hexagonal pyramid' };
  function sg(n) { return n < 0 ? '−' + -n : String(n); }
  /* name a solid from its picture */
  function NM(k, opts) { return { pic: ['solids', { list: [k], s: 48 }], pick: { opts: opts.map(function (o) { return NAME[o]; }), ans: opts.indexOf(k), solidName: true }, wide: true }; }
  /* prism or pyramid */
  function PP(k) { return { pic: ['solids', { list: [k], s: 56 }], solid: k, pick: { opts: ['prism', 'pyramid'], ans: /pyr/.test(k) ? 1 : 0 } }; }
  /* count faces, edges and vertices */
  function FEV(k) { var c = { tri: [5, 9, 6], prism: [6, 12, 8], pentprism: [7, 15, 10], hexprism: [8, 18, 12], tpyr: [4, 6, 4], pyramid: [5, 8, 5], pentpyr: [6, 10, 6], hexpyr: [7, 12, 7] }[k];
    return { pic: ['solids', { list: [k], s: 56 }], solid: k, eq: ['[] faces', '[] edges', '[] vertices'], a: c }; }
  /* planes of symmetry, or the order of turn symmetry about the line through the middle of the base */
  var SY = { cube: { ax: 4, pl: 9 }, prism: { ax: 2, pl: 3 }, tri: { ax: 3, pl: 4 }, pentprism: { ax: 5, pl: 6 }, hexprism: { ax: 6, pl: 7 }, pyramid: { ax: 4, pl: 4 }, pentpyr: { ax: 5, pl: 5 }, hexpyr: { ax: 6, pl: 6 } };
  function SYP(k) { return { q: NAME[k] || k, pic: ['solids', { list: [k], s: 56 }], eq: ['[] planes of symmetry'], a: [SY[k].pl], ssym: { s: k, what: 'pl' } }; }
  function SYO(k) { return { q: NAME[k] || k, pic: ['solids', { list: [k], s: 56 }], eq: ['turn symmetry of order []'], a: [SY[k].ax], ssym: { s: k, what: 'ax' } }; }
  /* a view of cube stacks (top view numbers) */
  function VW(g, view) {
    var front = g[0].map(function (_, c) { return Math.max.apply(null, g.map(function (r) { return r[c]; })); }), side = g.map(function (r) { return Math.max.apply(null, r); }).reverse();
    var a = view === 'front' ? front : side;
    return { q: (view === 'front' ? 'Front' : 'Right side') + ' view: tallest in each ' + (view === 'front' ? 'column' : 'row') + ', left to right.', pic: ['heights', { g: g }], eq: [a.map(function () { return '[]'; }).join('  ')], a: a, view: view };
  }
  /* read a point on a four-quadrant grid */
  function RP(pts, lab) { var q = pts.filter(function (p) { return p[2] === lab; })[0]; return { pic: ['coord', { n: 6, min: -6, u: 9, pts: pts }], eq: [lab + ' ( [] , [] )'], a: [q[0], q[1]], pt: lab }; }
  function PL(list) { return { q: 'Plot ' + list.map(function (p) { return p[2] + ' (' + sg(p[0]) + ', ' + sg(p[1]) + ')'; }).join(' and ') + '.', pic: ['coord', { n: 6, min: -6, u: 9, plot: list }] }; }
  /* a point after a move: slide [dx, dy], flip { x: 0 } or { y: 0 }, rot 90 | −90 | 180, dil k */
  function MV(pt, move, q) {
    var to = move.slide ? [pt[0] + move.slide[0], pt[1] + move.slide[1]] : move.rot === 90 ? [-pt[1], pt[0]] : move.rot === -90 ? [pt[1], -pt[0]] : move.rot === 180 ? [-pt[0], -pt[1]]
      : move.dil != null ? [pt[0] * move.dil, pt[1] * move.dil] : move.flip.x != null ? [2 * move.flip.x - pt[0], pt[1]] : [pt[0], 2 * move.flip.y - pt[1]];
    return { q: q, pic: ['coord', { n: 6, min: -6, u: 9, pts: [pt], mirror: move.flip }], eq: [pt[2] + "′ ( [] , [] )"], a: to.map(function (v) { return v + 0; }), move: { pt: pt[2], slide: move.slide, flip: move.flip, rot: move.rot, dil: move.dil } };
  }
  /* the same with no grid: the point is in the question */
  function MT(pt, move, q) { var o = MV(pt, move, pt[2] + ' (' + sg(pt[0]) + ', ' + sg(pt[1]) + '). ' + q); delete o.pic; o.move.pt = [pt[0], pt[1]]; return o; }
  /* a length after a scale factor */
  function SC(len, k, unit) { return { eq: [len + ' × ' + k + ' = [] ' + unit], a: [Math.round(len * k * 1e6) / 1e6] }; }

  S.register('shapes-moves', { code: 'SM', ideas: {

    names: {
      watch: 'naming a solid by its side faces (calling a triangular prism a "rectangle prism"). The base gives the name.',
      goal: 'I can name prisms and pyramids by their bases.',
      learn: {
        show: { pic: ['solids', { list: ['hexprism', 'hexpyr'], s: 64 }], cap: 'two hexagon bases: prism · one hexagon base and a point: pyramid' },
        together: [PP('pentprism'), PP('tpyr')],
        cue: 'Two bases: prism. One base and a point: pyramid.',
        own: [PP('hexpyr'), PP('tri')]
      },
      p1: {
        show: { pic: ['solids', { list: ['pentpyr'], s: 56 }], cap: 'base: pentagon', eq: ['pentagonal pyramid'] },
        items: [NM('pentprism', ['pentprism', 'hexprism', 'pentpyr']), NM('tpyr', ['tri', 'tpyr', 'pyramid']), NM('hexpyr', ['hexprism', 'pentpyr', 'hexpyr'])]
      },
      p2: {
        items: [FEV('tri'), FEV('pyramid'), FEV('pentprism'), FEV('hexpyr')]
      },
      p3: {
        items: [FEV('hexprism'), FEV('pentpyr'),
          { q: 'A prism has a base with 8 sides. How many faces?', eq: ['8 + 2 = [] faces'], a: [10] },
          { q: 'A pyramid has a base with 7 sides. How many faces?', eq: ['7 + 1 = [] faces'], a: [8] }]
      },
      think: {
        items: [{ q: '{b} called a triangular prism a "rectangle prism" because its sides are rectangles. What went wrong?', lines: { n: 3, key: 'Every prism has rectangle sides. The two bases are triangles, so it is a triangular prism.' } },
          { q: 'How are a hexagonal prism and a hexagonal pyramid alike? How are they different?', lines: { n: 3, key: 'Both have a hexagon base. The prism has two bases and rectangle sides; the pyramid has one base and triangle sides that meet at a point.' } },
          NM('hexprism', ['hexpyr', 'hexprism', 'pentprism'])]
      }
    },

    symmetry: {
      watch: 'counting the starting position twice. Order is how many times it looks the same in one full turn.',
      goal: 'I can find planes and order of symmetry of a solid.',
      learn: {
        show: { pic: ['solids', { list: ['pyramid'], s: 64 }], cap: 'square-based pyramid', eq: ['4 planes of symmetry', 'quarter turns: order 4'] },
        together: [SYP('prism'), SYO('prism')],
        cue: 'Order = how many times it looks the same in one turn.',
        own: [SYO('tri'), SYP('hexprism')]
      },
      p1: {
        show: { eq: ['360° ÷ 72° = 5', 'order 5'] },
        items: [SYO('pentprism'), SYO('pentpyr'), SYO('hexprism'), SYO('cube')]
      },
      p2: {
        items: [SYP('tri'), SYP('pyramid'), SYP('pentpyr'), SYP('hexpyr')]
      },
      p3: {
        items: [{ q: 'A solid looks the same after every 60° turn. What is its order?', eq: ['360 ÷ 60 = []'], a: [6] },
          { q: 'A solid looks the same after every 120° turn. What is its order?', eq: ['360 ÷ 120 = []'], a: [3] },
          SYP('cube'), SYP('pentprism')]
      },
      think: {
        items: [{ q: '{a} says a rectangular prism has order 4. What went wrong?', lines: { n: 3, key: 'A shoebox looks the same only after a half turn and a full turn: order 2.' } },
          { q: 'Why does a pyramid with a 6-sided base have order 6?', lines: { n: 2, key: 'Each turn of 360° ÷ 6 = 60° brings a side of the base to where the next one was.' } },
          SYO('pyramid')]
      }
    },

    views: {
      watch: 'adding the stacks in a column instead of taking the tallest. A view shows height, not how many cubes.',
      goal: 'I can draw front and side views of cube stacks.',
      learn: {
        show: { pic: ['heights', { g: [[2, 1], [3, 1]] }], cap: 'each number is a stack', eq: ['front: 3 1', 'side: 3 2'] },
        together: [VW([[1, 2, 1], [3, 1, 1]], 'front'), VW([[1, 2, 1], [3, 1, 1]], 'side')],
        cue: 'Front: tallest in each column. Side: tallest in each row.',
        own: [VW([[2, 2], [1, 3]], 'front'), VW([[2, 2], [1, 3]], 'side')]
      },
      p1: {
        show: { cap: 'top view', eq: ['the covered squares'] },
        items: [VW([[1, 3], [2, 1]], 'front'), VW([[1, 3], [2, 1]], 'side'), VW([[2, 1, 3], [1, 1, 1]], 'front'), VW([[2, 1, 3], [1, 1, 1]], 'side')]
      },
      p2: {
        items: [VW([[3, 2, 1], [1, 2, 2], [1, 1, 1]], 'front'), VW([[3, 2, 1], [1, 2, 2], [1, 1, 1]], 'side'), VW([[4, 1], [2, 2], [1, 3]], 'front'), VW([[4, 1], [2, 2], [1, 3]], 'side')]
      },
      p3: {
        items: [{ q: 'How many cubes in all?', pic: ['heights', { g: [[3, 2, 1], [1, 2, 2]] }], eq: ['[] cubes'], a: [11] },
          { q: 'How many cubes in all?', pic: ['heights', { g: [[2, 4], [1, 3]] }], eq: ['[] cubes'], a: [10] },
          { q: 'Sketch the front view of the stacks.', pic: ['heights', { g: [[2, 1, 3]] }], draw: { h: 70, key: 'Three columns, 2, 1 and 3 squares tall.' } }]
      },
      think: {
        items: [{ q: '{b} wrote the front view as the total of each column. What went wrong?', lines: { n: 3, key: 'You see only the tallest stack in each column from the front, not all the cubes.' } },
          { q: 'Can two different buildings have the same front view? Explain.', lines: { n: 3, key: 'Yes. Cubes hidden behind the tallest stack do not show from the front.' } },
          VW([[1, 1, 2], [3, 1, 1]], 'front')]
      }
    },

    coords: {
      watch: 'swapping the order: (3, −2) plotted as 3 up and 2 left. Across first, then up or down.',
      goal: 'I can read and plot points in all four quadrants.',
      learn: {
        show: { pic: ['coord', { n: 6, min: -6, u: 9, pts: [[3, -2, 'A']] }], cap: '3 right, 2 down', eq: ['A (3, −2)'] },
        together: [RP([[-4, 3, 'B'], [2, 5, 'C']], 'B'), RP([[-4, 3, 'B'], [2, 5, 'C']], 'C')],
        cue: 'Across first, then up or down.',
        own: [{ q: 'Which quadrant is (−2, −5) in?', pick: { opts: ['I', 'II', 'III', 'IV'], ans: 2, quad: [-2, -5] } }, { q: 'Which quadrant is (5, −1) in?', pick: { opts: ['I', 'II', 'III', 'IV'], ans: 3, quad: [5, -1] } }]
      },
      p1: {
        show: { eq: ['left of 0: x is negative', 'below 0: y is negative'] },
        items: [RP([[-3, -3, 'F'], [4, 2, 'G'], [0, -4, 'H']], 'F'), RP([[-3, -3, 'F'], [4, 2, 'G'], [0, -4, 'H']], 'H'),
          RP([[-6, 1, 'J'], [3, -5, 'K']], 'J'), RP([[-6, 1, 'J'], [3, -5, 'K']], 'K')]
      },
      p2: {
        items: [PL([[-4, 2, 'A'], [3, -3, 'B']]), PL([[-5, -1, 'C'], [0, 4, 'D']]), PL([[2, -6, 'E'], [-1, 5, 'F']]), PL([[-3, -4, 'G'], [6, 0, 'H']])]
      },
      p3: {
        items: [{ q: 'Which quadrant is (−4, 3) in?', pick: { opts: ['I', 'II', 'III', 'IV'], ans: 1, quad: [-4, 3] } },
          { q: 'Which quadrant is (2, −5) in?', pick: { opts: ['I', 'II', 'III', 'IV'], ans: 3, quad: [2, -5] } },
          { q: 'Plot A (−3, 2), B (3, 2), C (3, −2), D (−3, −2). What shape is ABCD?', pic: ['coord', { n: 6, min: -6, u: 9, plot: [[-3, 2, 'A'], [3, 2, 'B'], [3, -2, 'C'], [-3, -2, 'D']] }], lines: { n: 1, key: 'A rectangle, 6 by 4.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} plotted (3, −2) at 3 up and 2 left. What went wrong?', lines: { n: 3, key: 'x comes first: 3 right. Then y: 2 down.' } },
          { q: 'What do all points on the y-axis have in common?', lines: { n: 2, key: 'Their x-coordinate is 0.' } },
          RP([[-5, -6, 'P'], [1, 3, 'Q']], 'P')]
      }
    },

    translate: {
      watch: 'changing the wrong coordinate for up or down, or moving only one vertex.',
      goal: 'I can translate a point or shape.',
      learn: {
        show: { cap: '(2, −1), 4 left and 3 up', eq: ['(2 − 4, −1 + 3)', '= (−2, 2)'] },
        together: [MV([1, -2, 'A'], { slide: [-3, 4] }, '3 left, 4 up.'), MV([-4, 3, 'B'], { slide: [5, -2] }, '5 right, 2 down.')],
        cue: 'Right/left changes x. Up/down changes y.',
        own: [MT([2, 2, 'C'], { slide: [-6, -3] }, '6 left, 3 down.'), MT([-1, -4, 'D'], { slide: [4, 5] }, '4 right, 5 up.')]
      },
      p1: {
        show: { eq: ['right: add to x', 'down: take from y'] },
        items: [MT([3, 1, 'A'], { slide: [-5, 0] }, '5 left.'), MT([-2, 4, 'B'], { slide: [0, -6] }, '6 down.'), MT([-3, -3, 'C'], { slide: [4, 2] }, '4 right, 2 up.'),
          MT([5, -1, 'D'], { slide: [-7, 3] }, '7 left, 3 up.'), MT([0, 0, 'E'], { slide: [-2, -5] }, '2 left, 5 down.'), MT([-6, 2, 'F'], { slide: [6, -2] }, '6 right, 2 down.')]
      },
      p2: {
        items: [MV([-5, 1, 'P'], { slide: [3, -4] }, '3 right, 4 down.'), MV([4, -3, 'Q'], { slide: [-6, 5] }, '6 left, 5 up.'),
          MT([-12, 7, 'R'], { slide: [15, -9] }, '15 right, 9 down.'), MT([8, -14, 'S'], { slide: [-10, 20] }, '10 left, 20 up.')]
      },
      p3: {
        items: [{ q: 'A (−2, 3) moved to A′ (4, −1). How far right? How far down?', eq: ['4 − (−2) = []', '3 − (−1) = []'], a: [6, 4] },
          MT([-1, -1, 'G'], { slide: [-4, 6] }, '4 left, 6 up.'), MT([3, 5, 'H'], { slide: [-3, -5] }, '3 left, 5 down.')]
      },
      think: {
        items: [{ q: '{b} moved (2, −1) 3 up and wrote (5, −1). What went wrong?', lines: { n: 3, key: 'Up changes y, not x: (2, 2).' } },
          { q: 'After a translation, is the shape the same size? Why?', lines: { n: 2, key: 'Yes. Every point moves the same way, so lengths and angles stay the same.' } },
          MT([-7, 2, 'K'], { slide: [9, -8] }, '9 right, 8 down.')]
      }
    },

    reflect: {
      watch: 'mixing up the two axes. Reflecting in the x-axis flips up and down, so y changes sign.',
      goal: 'I can reflect a point in the x-axis or y-axis.',
      learn: {
        show: { pic: ['coord', { n: 6, min: -6, u: 9, pts: [[3, 2, 'A'], [3, -2, 'A′']], mirror: { y: 0 } }], cap: 'in the x-axis', eq: ['(3, 2) → (3, −2)'] },
        together: [MV([4, 1, 'B'], { flip: { y: 0 } }, 'Reflect in the x-axis (y = 0).'), MV([-2, 5, 'C'], { flip: { x: 0 } }, 'Reflect in the y-axis (x = 0).')],
        cue: 'x-axis: change the sign of y. y-axis: change the sign of x.',
        own: [MT([5, -3, 'D'], { flip: { x: 0 } }, 'Reflect in the y-axis (x = 0).'), MT([-1, -4, 'E'], { flip: { y: 0 } }, 'Reflect in the x-axis (y = 0).')]
      },
      p1: {
        show: { eq: ['in the y-axis: (−4, 1) → (4, 1)'] },
        items: [MT([2, 6, 'A'], { flip: { y: 0 } }, 'Reflect in the x-axis (y = 0).'), MT([-3, 4, 'B'], { flip: { x: 0 } }, 'Reflect in the y-axis (x = 0).'),
          MT([5, -2, 'C'], { flip: { y: 0 } }, 'Reflect in the x-axis (y = 0).'), MT([-6, -1, 'D'], { flip: { x: 0 } }, 'Reflect in the y-axis (x = 0).'),
          MT([0, 3, 'E'], { flip: { y: 0 } }, 'Reflect in the x-axis (y = 0).'), MT([4, 0, 'F'], { flip: { x: 0 } }, 'Reflect in the y-axis (x = 0).')]
      },
      p2: {
        items: [MV([-3, 2, 'P'], { flip: { y: 0 } }, 'Reflect in the x-axis (y = 0).'), MV([1, -5, 'Q'], { flip: { x: 0 } }, 'Reflect in the y-axis (x = 0).'),
          MT([-9, 7, 'R'], { flip: { x: 0 } }, 'Reflect in the y-axis (x = 0).'), MT([12, -8, 'S'], { flip: { y: 0 } }, 'Reflect in the x-axis (y = 0).')]
      },
      p3: {
        items: [MV([2, 3, 'A'], { flip: { x: 1 } }, 'Reflect in the line x = 1.'), MV([-2, 4, 'B'], { flip: { y: 1 } }, 'Reflect in the line y = 1.'),
          { q: 'A point and its image are (5, −3) and (5, 3). Which axis was the mirror? How do you know?', lines: { n: 2, key: 'The x-axis: x stayed 5 and y changed sign.' } }]
      },
      think: {
        items: [{ q: '{a} reflected (3, 2) in the x-axis and wrote (−3, 2). What went wrong?', lines: { n: 3, key: 'The x-axis flips up and down, so y changes sign: (3, −2).' } },
          { q: 'Which points do not move when reflected in the y-axis?', lines: { n: 2, key: 'The points on the y-axis, where x = 0.' } },
          MT([-5, -6, 'K'], { flip: { y: 0 } }, 'Reflect in the x-axis (y = 0).')]
      }
    },

    rotate: {
      watch: 'swapping the coordinates but forgetting the sign change, or turning the wrong way.',
      goal: 'I can rotate a point about the origin.',
      learn: {
        show: { cap: 'half turn: change both signs', eq: ['(4, 1) → (−4, −1)'] },
        together: [MV([3, 2, 'A'], { rot: 180 }, 'Half turn about (0, 0).'), MV([2, 5, 'B'], { rot: 90 }, '90° counterclockwise about (0, 0).')],
        cue: '180°: change both signs. 90°: swap and change one sign.',
        own: [MT([-4, 1, 'C'], { rot: 180 }, 'Half turn about (0, 0).'), MT([3, -1, 'D'], { rot: -90 }, '90° clockwise about (0, 0).')]
      },
      p1: {
        show: { eq: ['90° clockwise: (x, y) → (y, −x)'] },
        items: [MT([5, 2, 'A'], { rot: 180 }, 'Half turn about (0, 0).'), MT([-1, 6, 'B'], { rot: 180 }, 'Half turn about (0, 0).'),
          MT([4, 3, 'C'], { rot: 90 }, '90° counterclockwise.'), MT([2, -5, 'D'], { rot: 90 }, '90° counterclockwise.'),
          MT([1, 4, 'E'], { rot: -90 }, '90° clockwise.'), MT([-3, -2, 'F'], { rot: -90 }, '90° clockwise.')]
      },
      p2: {
        items: [MV([-2, -3, 'P'], { rot: 90 }, '90° counterclockwise about (0, 0).'), MV([5, -4, 'Q'], { rot: -90 }, '90° clockwise about (0, 0).'),
          MT([7, -9, 'R'], { rot: 180 }, 'Half turn about (0, 0).'), MT([-6, 8, 'S'], { rot: 90 }, '90° counterclockwise.')]
      },
      p3: {
        items: [MT([0, 5, 'G'], { rot: -90 }, '90° clockwise.'), MT([-4, 0, 'H'], { rot: 90 }, '90° counterclockwise.'),
          { q: 'Is a 90° clockwise turn the same as a 270° counterclockwise turn?', lines: { n: 2, key: 'Yes. Both end in the same place.' } }]
      },
      think: {
        items: [{ q: '{b} turned (4, 1) by 90° counterclockwise and wrote (1, 4). What went wrong?', lines: { n: 3, key: 'Swap and change one sign: (−1, 4). Check with a sketch: (4, 1) is in quadrant I, so a quarter turn ends in quadrant II.' } },
          { q: 'Which point stays still when you rotate about the origin?', lines: { n: 1, key: 'The origin, (0, 0).' } },
          MT([6, 2, 'K'], { rot: -90 }, '90° clockwise.')]
      }
    },

    scale: {
      watch: 'adding the scale factor instead of multiplying: (3, 1) with factor 3 written as (6, 4).',
      goal: 'I can enlarge or shrink by a scale factor.',
      learn: {
        show: { cap: 'scale factor 2 from (0, 0)', eq: ['(3, 1) → (6, 2)', '4 cm → 8 cm'] },
        together: [MT([2, -1, 'A'], { dil: 3 }, 'Scale factor 3 from (0, 0).'), SC(5, 2.5, 'cm')],
        cue: 'Multiply every length and coordinate.',
        own: [MT([-4, 6, 'B'], { dil: 0.5 }, 'Scale factor 1/2 from (0, 0).'), SC(12, 0.25, 'cm')]
      },
      p1: {
        show: { eq: ['factor 3: 2 cm → 6 cm', 'factor 1/2: 6 cm → 3 cm'] },
        items: [SC(4, 3, 'cm'), SC(7, 2, 'cm'), SC(10, 0.5, 'cm'), SC(6, 1.5, 'cm'), SC(9, 2.5, 'm'), SC(20, 0.2, 'm')]
      },
      p2: {
        items: [MT([3, 2, 'A'], { dil: 2 }, 'Scale factor 2 from (0, 0).'), MT([-1, 4, 'B'], { dil: 3 }, 'Scale factor 3 from (0, 0).'),
          MT([8, -6, 'C'], { dil: 0.5 }, 'Scale factor 1/2 from (0, 0).'), MT([-4, -2, 'D'], { dil: 1.5 }, 'Scale factor 1.5 from (0, 0).')]
      },
      p3: {
        items: [{ q: 'A 3 cm side became 12 cm. What is the scale factor?', eq: ['12 ÷ 3 = []'], a: [4] },
          { q: 'A 10 cm side became 4 cm. What is the scale factor?', eq: ['4 ÷ 10 = []'], a: [0.4] },
          { q: 'A map uses a scale factor of 1/50 000. 6 cm on the map is how many cm in real life?', eq: ['6 × 50 000 = [] cm'], a: [300000], wide: true }]
      },
      think: {
        items: [{ q: '{a} enlarged (3, 1) by factor 3 and wrote (6, 4). What went wrong?', lines: { n: 3, key: '{a} added 3. Multiply: (9, 3).' } },
          { q: 'What does a scale factor between 0 and 1 do?', lines: { n: 2, key: 'It shrinks the shape.' } },
          SC(15, 0.4, 'cm')]
      }
    },

    similar: {
      watch: 'calling any two rectangles similar. All sides must be multiplied by the same scale factor.',
      goal: 'I can tell if two shapes are similar.',
      learn: {
        show: { cap: '2 by 3 and 4 by 6', eq: ['4 ÷ 2 = 2, 6 ÷ 3 = 2: similar'] },
        together: [{ q: 'Which is similar to 2 cm by 3 cm?', pick: { opts: ['4 by 5', '6 by 9', '3 by 4'], ans: 1, sim: [2, 3] } }, { q: 'Which is similar to 4 cm by 10 cm?', pick: { opts: ['2 by 5', '6 by 12', '5 by 11'], ans: 0, sim: [4, 10] } }],
        cue: 'Same scale factor for every side.',
        own: [{ q: 'Which is similar to 3 cm by 5 cm?', pick: { opts: ['6 by 8', '9 by 15', '4 by 6'], ans: 1, sim: [3, 5] } }, { q: 'Which is similar to 6 cm by 8 cm?', pick: { opts: ['3 by 4', '7 by 9', '12 by 14'], ans: 0, sim: [6, 8] } }]
      },
      p1: {
        show: { eq: ['5 by 2 and 15 by 6: both × 3'] },
        items: [{ q: 'Similar shapes: 4 cm becomes 10 cm. 6 cm becomes?', eq: ['6 × 10 ÷ 4 = [] cm'], a: [15] }, { q: 'Similar shapes: 3 cm becomes 12 cm. 5 cm becomes?', eq: ['5 × 12 ÷ 3 = [] cm'], a: [20] },
          { q: 'Similar shapes: 8 cm becomes 2 cm. 20 cm becomes?', eq: ['20 × 2 ÷ 8 = [] cm'], a: [5] }, { q: 'Similar shapes: 5 cm becomes 7.5 cm. 8 cm becomes?', eq: ['8 × 7.5 ÷ 5 = [] cm'], a: [12] }]
      },
      p2: {
        items: [{ q: 'Which is similar to 5 m by 8 m?', pick: { opts: ['10 by 13', '15 by 24', '6 by 9'], ans: 1, sim: [5, 8] } }, { q: 'Which is similar to 9 cm by 12 cm?', pick: { opts: ['3 by 4', '10 by 13', '12 by 15'], ans: 0, sim: [9, 12] } },
          { q: 'Which is similar to 2.5 cm by 4 cm?', pick: { opts: ['5 by 8', '3.5 by 5', '5 by 6.5'], ans: 0, sim: [2.5, 4] } }, { q: 'Which is similar to 12 cm by 18 cm?', pick: { opts: ['14 by 20', '4 by 6', '6 by 8'], ans: 1, sim: [12, 18] } }]
      },
      p3: {
        items: [story7('A photo is 10 cm by 15 cm. It is enlarged so the short side is 25 cm. How long is the long side?', 'cm', 37.5, '15 × 25 ÷ 10'),
          story7('A model car is 1/20 of the real size. The model is 22 cm long. How long is the real car?', 'cm', 440, '22 × 20'),
          story7('Two similar triangles: sides 3, 4, 5 cm and 9, 12, ? cm. What is the missing side?', 'cm', 15, '5 × 9 ÷ 3')]
      },
      think: {
        items: [{ q: '{b} says a 2 by 3 rectangle and a 4 by 5 rectangle are similar. What went wrong?', lines: { n: 3, key: '4 ÷ 2 = 2 but 5 ÷ 3 is not 2. The scale factor must be the same for every side.' } },
          { q: 'Are all squares similar? Explain.', lines: { n: 2, key: 'Yes. Every side is multiplied by the same factor and every angle is 90°.' } }]
      }
    }
  } });
  function story7(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc, wide: true }; }
})();
