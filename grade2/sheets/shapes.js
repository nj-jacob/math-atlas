/* Grade 2 Shapes: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the lessons
   in chapters/shapes.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Shapes are drawn on a dot grid (geo), so the answer checks can count sides, square corners, equal sides and lines of
   symmetry from the corners themselves.
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: E1.1 sort and identify shapes by their attributes (sides, corners, square corners, equal sides, lines of
   symmetry); E1.2 compose and decompose shapes, and show that the area stays the same; E1.3 congruence.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* shapes on a dot grid: corners as [column, row] */
  var SH = {
    tri: [[0, 3], [4, 3], [2, 0]], rtri: [[0, 0], [0, 3], [3, 3]], sq: [[0, 0], [3, 0], [3, 3], [0, 3]], rect: [[0, 0], [4, 0], [4, 2], [0, 2]],
    kite: [[1, 0], [2, 2], [1, 4], [0, 2]], house: [[0, 2], [2, 0], [4, 2], [4, 4], [0, 4]], hex: [[1, 0], [3, 0], [4, 2], [3, 4], [1, 4], [0, 2]],
    trap: [[1, 0], [3, 0], [4, 2], [0, 2]], oct: [[1, 0], [3, 0], [4, 1], [4, 3], [3, 4], [1, 4], [0, 3], [0, 1]], quad: [[0, 0], [3, 0], [4, 3], [1, 2]],
    ell: [[0, 0], [2, 0], [2, 2], [4, 2], [4, 4], [0, 4]], pent: [[0, 1], [2, 0], [4, 1], [3, 4], [1, 4]], tall: [[0, 0], [2, 0], [2, 4], [0, 4]],
    slant: [[1, 0], [4, 0], [3, 2], [0, 2]], arrow: [[0, 1], [2, 1], [2, 0], [4, 2], [2, 4], [2, 3], [0, 3]], wtri: [[0, 0], [4, 0], [1, 3]], big: [[0, 0], [4, 0], [4, 4], [0, 4]],
    tiltsq: [[2, 0], [4, 2], [2, 4], [0, 2]], step: [[0, 0], [4, 0], [4, 2], [2, 2], [2, 3], [0, 3]]
  };
  function geo(k, extra) {
    var pts = SH[k], o = { pts: pts, cols: Math.max.apply(null, pts.map(function (p) { return p[0]; })), rows: Math.max.apply(null, pts.map(function (p) { return p[1]; })), u: 12 };
    for (var e in extra || {}) o[e] = extra[e];
    return ['geo', o];
  }
  /* count the sides and corners */
  function SC(k) { var n = SH[k].length; return { pic: geo(k), eq: ['[] sides and [] corners'], a: [n, n], shapeAsk: ['sides', 'corners'] }; }
  /* name it by its sides */
  var NAMES = ['triangle', 'quadrilateral', 'pentagon', 'hexagon', 'octagon'];
  function NM(k) {
    var want = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 8: 'octagon' }[SH[k].length], at = NAMES.indexOf(want), o = at % 2 ? [NAMES[at - 1], want] : [want, NAMES[at + 1] || NAMES[at - 1]];
    return { q: 'Name the shape.', pic: geo(k), pick: { opts: o, ans: o.indexOf(want), polyName: true } };
  }
  /* how many square corners */
  function RC(k) { return { pic: geo(k), eq: ['[] square corners'], a: [cornersOf(k)], shapeAsk: ['rights'] }; }
  function cornersOf(k) {
    var sh = SH[k], n = sh.length, c = 0;
    for (var i = 0; i < n; i++) { var p = sh[(i + n - 1) % n], q = sh[i], r = sh[(i + 1) % n]; if ((p[0] - q[0]) * (r[0] - q[0]) + (p[1] - q[1]) * (r[1] - q[1]) === 0 && ((q[0] - p[0]) * (r[1] - q[1]) - (q[1] - p[1]) * (r[0] - q[0])) * turn(sh) > 0) c++; }
    return c;
  }
  /* which way the corners go round, so a corner that points in (as in an L) is not a square corner */
  function turn(sh) { var a = 0; for (var i = 0; i < sh.length; i++) { var p = sh[i], q = sh[(i + 1) % sh.length]; a += p[0] * q[1] - q[0] * p[1]; } return a > 0 ? 1 : -1; }
  /* are all the sides equal? */
  function EQ(k, yes) { return { q: 'All sides equal?', pic: geo(k), pick: { opts: ['yes', 'no'], ans: yes ? 0 : 1, eqSides: true } }; }
  /* is the dashed line a line of symmetry? */
  function SY(k, m, yes) { return { q: 'Line of symmetry?', pic: geo(k, { mirror: m }), pick: { opts: ['yes', 'no'], ans: yes ? 0 : 1, sym: true } }; }
  /* how many lines of symmetry (the key draws them) */
  function LS(k, n) { return { pic: geo(k, { sym: true }), eq: ['[] lines of symmetry'], a: [n], shapeAsk: ['lines'] }; }
  /* a hexagon of pattern blocks: how many blocks */
  function HX(parts) { return { q: 'How many blocks?', pic: ['hex', { parts: parts }], eq: ['[] blocks'], a: [parts.length] }; }
  /* pattern blocks measured in triangles (and in each other) */
  function PB(row, a, wide) { return { eq: [row], a: [a], pb: true, wide: wide }; }
  /* a shape made of squares on a grid */
  function ar(cells, cols, rows) { return ['area', { cells: cells, cols: cols || 4, rows: rows || 3, u: 13 }]; }
  function AS(cells, cols, rows) { return { q: 'How many squares cover it?', pic: ar(cells, cols, rows), eq: ['[] squares'], a: [cells.length] }; }
  function SA(c1, c2) { return { q: 'Same area?', pic: ['row', { list: [ar(c1), ar(c2)], gap: 18 }], pick: { opts: ['yes', 'no'], ans: c1.length === c2.length ? 0 : 1 }, same: true }; }
  function CG(c1, c2, yes) { return { q: 'Congruent?', pic: ['row', { list: [ar(c1), ar(c2)], gap: 18 }], pick: { opts: ['yes', 'no'], ans: yes ? 0 : 1, cong: true } }; }
  function TF(st, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1 }, tf: st, pb: true }; }

  /* shapes made of squares: [column,row] cells */
  var L4 = ['0,0', '0,1', '0,2', '1,2'], L4b = ['0,0', '1,0', '2,0', '0,1'], L4c = ['1,0', '1,1', '1,2', '0,2'], T4 = ['0,0', '1,0', '2,0', '1,1'], T4b = ['1,0', '0,1', '1,1', '2,1'];
  var I4 = ['0,0', '1,0', '2,0', '3,0'], I4b = ['0,0', '0,1', '0,2', '0,3'], S4 = ['1,0', '2,0', '0,1', '1,1'], O4 = ['0,0', '1,0', '0,1', '1,1'], Z4 = ['0,0', '1,0', '1,1', '2,1'];
  var R6 = ['0,0', '1,0', '2,0', '0,1', '1,1', '2,1'], R6b = ['0,0', '1,0', '0,1', '1,1', '0,2', '1,2'], P5 = ['0,0', '1,0', '0,1', '1,1', '0,2'], P5b = ['0,0', '1,0', '2,0', '1,1', '2,1'];

  S.register('shapes', { code: 'SH', ideas: {

    count: {
      watch: 'counting a corner twice or missing one. Mark where you start and go round once.',
      goal: 'I can count sides and corners.',
      learn: {
        show: { pic: geo('house'), cap: 'Go round once: 5 sides, 5 corners', eq: ['5 sides, 5 corners'] },
        together: [SC('tri'), SC('rect')],
        cue: 'Put your finger on one corner. Count as you go round, and stop where you began.',
        own: [SC('hex'), SC('trap'), SC('pent'), SC('kite')]
      },
      p1: {
        show: { pic: geo('sq'), cap: '4 sides, 4 corners', eq: ['4 sides, 4 corners'] },
        items: [SC('rtri'), SC('quad'), SC('oct'), SC('ell'), SC('wtri'), SC('slant')]
      },
      p2: {
        items: [SC('arrow'), SC('step'), NM('tri'), NM('hex'), NM('house'), NM('quad')]
      },
      p3: {
        items: [NM('oct'), NM('pent'), NM('ell'), NM('trap'),
          { q: 'Draw a shape with 5 sides.', draw: { h: 60, key: 'Any pentagon: 5 straight sides, 5 corners.' } },
          { q: 'Draw a shape with 6 corners.', draw: { h: 60, key: 'Any hexagon: 6 straight sides, 6 corners.' } }]
      },
      think: {
        items: [{ q: '{a} says a shape can have 4 sides and 5 corners. Is {a} right? Why?', lines: { n: 2, key: 'No. Each corner joins two sides, so a shape has as many corners as sides.' } },
          { q: 'Draw two different shapes with 4 sides.', draw: { h: 60, key: 'For example: a square and a kite.' } },
          { q: 'Why is a circle not a polygon?', lines: { n: 2, key: 'It has no straight sides and no corners.' } },
          { q: 'Find a shape in your home. How many sides does it have?', lines: { n: 2, key: 'For example: a window is a rectangle with 4 sides.' } }]
      }
    },

    names: {
      watch: 'saying a turned shape is a new shape. Turning a shape does not change its name.',
      goal: 'I can name a shape however it is turned.',
      learn: {
        show: { pic: ['row', { list: [geo('sq'), geo('tiltsq')], gap: 24 }], cap: 'The same square, turned', eq: ['still a square'] },
        together: [NM('tiltsq'), NM('wtri')],
        cue: 'Count the sides. The count gives the name, not the way it sits.',
        own: [NM('slant'), NM('step')]
      },
      p1: {
        show: { cap: '3 sides, sitting on a corner', eq: ['still a triangle'] },
        items: [NM('rtri'), NM('quad'), NM('hex'), NM('house')]
      },
      p2: {
        items: [NM('big'), NM('wtri'),
          NM('trap'), NM('pent'), SC('tiltsq'), SC('slant')]
      },
      p3: {
        items: [NM('step'), NM('ell'),
          { q: 'Draw a triangle that looks different from this one.', pic: geo('tri'), draw: { h: 40, key: 'Any 3-sided shape: long and thin, or with a square corner.' } },
          { q: 'Draw a hexagon that looks different from this one.', pic: geo('hex'), draw: { h: 40, key: 'Any 6-sided shape, such as an L shape.' } }]
      },
      think: {
        items: [{ q: '{b} says this is not a square because it stands on a corner. What would you tell {b}?', pic: geo('tiltsq'), lines: { n: 2, key: 'It is still a square: 4 equal sides and 4 square corners. Turning does not change it.' } },
          { q: 'What makes a shape a hexagon?', lines: { n: 2, key: '6 straight sides and 6 corners.' } },
          { q: 'Can a hexagon have a corner that points in? Draw one.', draw: { h: 60, key: 'Yes: an L shape has 6 sides.' } },
          { q: 'Why do we count sides to name a shape?', lines: { n: 2, key: 'The number of sides stays the same however the shape is turned.' } }]
      }
    },

    corner: {
      watch: 'calling any corner a square corner. Test it with the corner of a page.',
      goal: 'I can find square corners.',
      learn: {
        show: { pic: geo('rect'), cap: 'A page corner fits every corner', eq: ['4 square corners'] },
        together: [RC('rtri'), RC('house')],
        cue: 'Fit the corner of a page into the corner. A perfect fit is a square corner.',
        own: [RC('sq'), RC('tri'), RC('trap'), RC('step')]
      },
      p1: {
        show: { pic: geo('rtri'), cap: 'One corner fits', eq: ['1 square corner'] },
        items: [RC('tall'), RC('kite'), RC('ell'), RC('hex'), RC('wtri'), RC('oct')]
      },
      p2: {
        items: [RC('arrow'), RC('slant'), RC('quad'), RC('big'),
          { q: 'Draw a shape with 2 square corners.', draw: { h: 60, key: 'For example: a house shape or a trapezoid with a straight side.' } },
          { q: 'Draw a triangle with a square corner.', draw: { h: 60, key: 'A right triangle like half a square.' } }]
      },
      p3: {
        items: [RC('pent'), RC('tiltsq'),
          { q: 'Which has the most square corners: a triangle, a rectangle or a hexagon?', lines: { n: 1, key: 'A rectangle has 4.' }, wide: true },
          { q: 'Can a triangle have 2 square corners? Try to draw one.', draw: { h: 50, key: 'No. The sides would never meet.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says every 4-sided shape has 4 square corners. Is {a} right?', pic: geo('kite'), lines: { n: 2, key: 'No. This one has none.' } },
          { q: 'Find 3 square corners in your room.', lines: { n: 2, key: 'For example: a book, a door, a tile.' } },
          { q: 'Draw an L shape. How many square corners does it have?', draw: { h: 60, key: '5 square corners; the 6th corner points in.' } },
          { q: 'Why do builders use square corners?', lines: { n: 2, key: 'So walls, doors and boxes fit together.' } }]
      }
    },

    equal: {
      watch: 'guessing equal sides by eye. Count dots along each side, or measure.',
      goal: 'I can tell if a shape has equal sides.',
      learn: {
        show: { pic: geo('sq'), cap: 'Every side is 3 spaces', eq: ['all sides equal'] },
        together: [EQ('rect', false), EQ('kite', true)],
        cue: 'Count the spaces along each side. Slanted sides: compare with a strip of paper.',
        own: [EQ('tall', false), EQ('tiltsq', true)]
      },
      p1: {
        show: { cap: 'A rectangle: 4 spaces and 2 spaces', eq: ['not all equal'] },
        items: [EQ('sq', true), EQ('trap', false), EQ('kite', true), EQ('rtri', false)]
      },
      p2: {
        items: [EQ('hex', false), EQ('oct', false), EQ('quad', false), EQ('big', true),
          { q: 'Draw a shape with 4 equal sides.', draw: { h: 60, key: 'A square or a diamond (rhombus).' } },
          { q: 'Draw a rectangle with sides that are not all equal.', draw: { h: 60, key: 'For example: 4 spaces long and 2 spaces tall.' } }]
      },
      p3: {
        items: [EQ('slant', false), EQ('step', false),
          { q: 'Sort: square, rectangle, diamond. Which have all sides equal?', lines: { n: 2, key: 'The square and the diamond.' }, wide: true },
          { q: '{a} has 4 sticks the same length. What shapes can {a} make?', lines: { n: 2, key: 'A square or a diamond (rhombus).' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says a rectangle has 4 equal sides. What would you tell {b}?', lines: { n: 2, key: 'Only the opposite sides are equal, unless it is a square.' } },
          { q: 'How can you check that sides are equal without a ruler?', lines: { n: 2, key: 'Count the dots, or mark a strip of paper and compare.' } },
          { q: 'Draw a triangle with 2 equal sides.', draw: { h: 60, key: 'A tall triangle like a roof.' } },
          { q: 'Sort these into two groups: square, diamond, rectangle, trapezoid.', lines: { n: 2, key: 'All sides equal: square, diamond. Not all equal: rectangle, trapezoid.' } }]
      }
    },

    fold: {
      watch: 'calling any line through the middle a line of symmetry. Fold it: the two halves must match exactly.',
      goal: 'I can tell if a line is a line of symmetry.',
      learn: {
        show: { pic: geo('house', { mirror: { x: 2 } }), cap: 'Fold on the line: the halves match', eq: ['a line of symmetry'] },
        together: [SY('tri', { x: 2 }, true), SY('rect', { d: 1, c: 1 }, false)],
        cue: 'Imagine folding on the line. Every corner must land on a corner.',
        own: [SY('trap', { x: 2 }, true), SY('sq', { d: 1, c: 0 }, true)]
      },
      p1: {
        show: { pic: geo('tall', { mirror: { y: 2 } }), cap: 'Top half folds onto the bottom', eq: ['a line of symmetry'] },
        items: [SY('kite', { x: 1 }, true), SY('rtri', { x: 1.5 }, false), SY('hex', { y: 2 }, true), SY('slant', { x: 2 }, false)]
      },
      p2: {
        items: [SY('house', { y: 2 }, false), SY('pent', { x: 2 }, true),
          { q: 'Draw a line of symmetry.', pic: geo('tri'), draw: { h: 6, key: geo('tri', { mirror: { x: 2 } }) } }, { q: 'Draw a line of symmetry.', pic: geo('tall'), draw: { h: 6, key: geo('tall', { mirror: { x: 1 } }) } }]
      },
      p3: {
        items: [SY('rtri', { d: -1, c: 3 }, true), SY('tiltsq', { x: 2 }, true), SY('arrow', { y: 2 }, true), SY('step', { y: 1.5 }, false),
          { q: 'Draw the other half so the dashed line is a line of symmetry.', draw: { h: 70, key: 'A mirror picture of the half, the same distance from the line.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} folded a rectangle corner to corner. Do the halves match? Why?', lines: { n: 2, key: 'No. The halves are the same size but do not land on each other.' } },
          { q: 'Draw a letter that has a line of symmetry.', draw: { h: 60, key: 'For example: A, M, T, H or O.' } },
          { q: 'How can folding paper help you test a line?', lines: { n: 2, key: 'Fold on the line: if the edges match all round, it is a line of symmetry.' } },
          { q: 'Find something in nature with a line of symmetry.', lines: { n: 2, key: 'For example: a butterfly, a leaf, a face.' } }]
      }
    },

    many: {
      watch: 'stopping after one line. Test up and down, side to side, and corner to corner.',
      goal: 'I can find all the lines of symmetry.',
      learn: {
        show: { pic: geo('sq', { sym: true }), cap: 'Up, across and two corner to corner', eq: ['4 lines of symmetry'] },
        together: [LS('rect', 2), LS('tri', 1)],
        cue: 'Test 4 lines: up, across, and both corner-to-corner lines.',
        own: [LS('kite', 2), LS('hex', 2), LS('quad', 0), LS('house', 1)]
      },
      p1: {
        show: { pic: geo('rect', { sym: true }), cap: 'Up and across only', eq: ['2 lines of symmetry'] },
        items: [LS('tall', 2), LS('trap', 1), LS('big', 4), LS('ell', 1), LS('slant', 0), LS('pent', 1)]
      },
      p2: {
        items: [LS('oct', 4), LS('tiltsq', 4), LS('arrow', 1), LS('wtri', 0), LS('rtri', 1), LS('step', 0)]
      },
      p3: {
        items: [{ q: 'Draw a shape with no lines of symmetry.', draw: { h: 60, key: 'For example: a shape with all sides different.' } },
          { q: 'Draw a shape with exactly 2 lines of symmetry.', draw: { h: 60, key: 'A rectangle that is not a square.' } },
          { q: 'Which has more lines of symmetry: a square or a rectangle?', lines: { n: 1, key: 'A square: 4. A rectangle: 2.' }, wide: true },
          { q: 'How many lines of symmetry does a circle have?', lines: { n: 2, key: 'So many we cannot count them: every line through the centre.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says a rectangle has 4 lines of symmetry like a square. Is {b} right?', lines: { n: 2, key: 'No. The corner-to-corner folds do not match: only 2.' } },
          { q: 'Draw a shape with exactly 1 line of symmetry.', draw: { h: 60, key: 'For example: a house shape or a heart.' } },
          { q: 'Why does a square have more lines of symmetry than a rectangle?', lines: { n: 2, key: 'Its sides are all equal, so the corner-to-corner folds match too.' } },
          { q: 'Find a letter with 2 lines of symmetry.', lines: { n: 1, key: 'H, I, O or X.' } }]
      }
    },

    hexagon: {
      watch: 'thinking there is only one way. Try trapezoids, rhombuses and triangles.',
      goal: 'I can make a hexagon in different ways.',
      learn: {
        show: { pic: ['row', { list: [['hex', { parts: [3, 3] }], ['hex', { parts: [2, 2, 2] }]], gap: 24 }], cap: '2 trapezoids, or 3 rhombuses', eq: ['two ways to make a hexagon'] },
        together: [HX([3, 1, 1, 1]), PB('1 hexagon = [] trapezoids', 2)],
        cue: 'A hexagon is 6 triangles. A trapezoid is 3. A rhombus is 2.',
        own: [PB('1 hexagon = [] rhombuses', 3), PB('1 trapezoid = [] triangles', 3), PB('1 rhombus = [] triangles', 2), PB('2 rhombuses = [] triangles', 4)]
      },
      p1: {
        show: { pic: ['pb', { list: ['hex', 'trap', 'rhom', 'tri'] }], cap: 'hexagon, trapezoid, rhombus, triangle', eq: ['1 hexagon = 6 triangles'] },
        items: [HX([3, 3]), HX([2, 2, 2]), HX([3, 2, 1]), PB('1 hexagon = [] triangles', 6), PB('1 rhombus = [] triangles', 2), PB('2 trapezoids = [] hexagon', 1)]
      },
      p2: {
        items: [HX([2, 1, 2, 1]), HX([3, 1, 2]), PB('1 trapezoid + 1 rhombus + 1 triangle = [] hexagon', 1, true), PB('2 rhombuses + 2 triangles = [] hexagon', 1, true),
          { q: 'Draw lines to make it from 1 trapezoid and 3 triangles.', pic: ['hex', { parts: [3, 1, 1, 1], blank: true }], draw: { h: 4, key: 'The key shows one way.' } },
          { q: 'Draw lines to make it from 3 rhombuses.', pic: ['hex', { parts: [2, 2, 2], blank: true }], draw: { h: 4, key: 'The key shows one way.' } }]
      },
      p3: {
        items: [PB('1 hexagon = 1 trapezoid + [] triangles', 3, true), PB('1 hexagon = 2 rhombuses + [] triangles', 2, true), PB('3 rhombuses = [] hexagon', 1), PB('6 triangles = [] trapezoids', 2),
          TF('2 trapezoids = 6 triangles', true), { q: 'How many different ways can you find to make a hexagon? Draw 2 new ones.', draw: { h: 60, key: 'For example: 2 rhombuses and 2 triangles; 1 trapezoid, 1 rhombus and 1 triangle.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says 2 triangles make a hexagon. What would you tell {a}?', lines: { n: 2, key: 'It takes 6 triangles. 2 triangles make a rhombus.' } },
          { q: 'Which way uses the fewest blocks? The most?', lines: { n: 2, key: 'Fewest: 1 hexagon (or 2 trapezoids). Most: 6 triangles.' } },
          { q: 'Make a big triangle from small triangles. Draw it.', draw: { h: 70, key: 'For example: 4 small triangles make a big one.' } },
          { q: 'Why do 3 rhombuses fit exactly in a hexagon?', lines: { n: 2, key: 'Each rhombus is 2 triangles: 3 × 2 = 6 triangles.' } }]
      }
    },

    area: {
      watch: 'thinking a new shape means a new size. Moving the pieces keeps the same area.',
      goal: 'I can show the same area in a new shape.',
      learn: {
        show: { pic: ['row', { list: [ar(R6), ar(['0,0', '1,0', '2,0', '3,0', '0,1', '1,1'], 4, 2)], gap: 24 }], cap: 'Move 1 square: a new shape', eq: ['6 squares, same area'] },
        together: [AS(L4), SA(T4, I4)],
        cue: 'Count the squares. Same number of squares: same area.',
        own: [AS(P5), SA(O4, S4)]
      },
      p1: {
        show: { pic: ar(Z4), cap: '4 squares', eq: ['area: 4 squares'] },
        items: [AS(T4), AS(I4, 4, 1), AS(R6), SA(L4, O4), SA(I4b, R6b), SA(P5, P5b)]
      },
      p2: {
        items: [AS(P5b), AS(S4), SA(Z4, T4b), SA(R6, P5),
          { q: 'Draw a new shape with the same area.', pic: ar(L4), draw: { h: 50, key: 'Any shape of 4 squares joined side to side.' } }, { q: 'Draw a new shape with the same area.', pic: ar(R6b, 3, 3), draw: { h: 50, key: 'Any shape of 6 squares joined side to side.' } }]
      },
      p3: {
        items: [SA(I4, O4), SA(L4b, P5), SA(R6b, P5b),
          { q: '{a} cut a rectangle of 6 squares into 2 pieces and moved them. What is the area now?', eq: ['[] squares'], a: [6], calc: '6' },
          { q: '{b} made a shape of 8 squares and moved 2 of them. What is the area now?', eq: ['[] squares'], a: [8], calc: '8' }]
      },
      think: {
        items: [{ q: '{a} says a tall shape has more area than a flat one with the same squares. Is {a} right?', lines: { n: 2, key: 'No. The same squares cover the same area.' } },
          { q: 'Draw 3 different shapes, each with 5 squares.', draw: { h: 70, key: 'Any three shapes of 5 squares joined side to side.' } },
          { q: 'How can you show two shapes cover the same space?', lines: { n: 2, key: 'Count the squares in each, or cut one and move the pieces onto the other.' } },
          { q: 'A tangram square is cut into pieces and made into a cat. What happened to the area?', lines: { n: 2, key: 'It stayed the same: the same pieces cover the same space.' } }]
      }
    },

    congruent: {
      watch: 'calling shapes congruent when they only look alike. Same shape AND same size: one fits exactly on the other.',
      goal: 'I can tell if two shapes are congruent.',
      learn: {
        show: { pic: ['row', { list: [ar(L4), ar(L4b)], gap: 24 }], cap: 'Turn one and it fits on the other', eq: ['congruent'] },
        together: [CG(T4, T4b, true), CG(O4, I4, false)],
        cue: 'Turn or flip one. If it fits exactly on the other, they are congruent.',
        own: [CG(I4, I4b, true), CG(L4, L4c, true), CG(R6, R6b, true), CG(P5, R6, false)]
      },
      p1: {
        show: { pic: ['row', { list: [ar(I4, 4, 1), ar(I4b, 1, 4)], gap: 24 }], cap: 'One is turned', eq: ['congruent'] },
        items: [CG(S4, Z4, true), CG(L4, T4, false), CG(O4, O4, true), CG(P5, P5b, true), CG(R6, P5b, false), CG(L4b, L4c, true)]
      },
      p2: {
        items: [CG(T4, L4, false), CG(Z4, S4, true), CG(R6b, R6, true), CG(I4, L4, false),
          { q: 'Draw a shape congruent to this one.', pic: ar(T4), draw: { h: 40, key: 'The same 4 squares in a T, turned or flipped any way.' } },
          { q: 'Draw a shape congruent to this one.', pic: ar(P5), draw: { h: 40, key: 'The same 5 squares, turned or flipped any way.' } }]
      },
      p3: {
        items: [CG(P5, ['0,0', '1,0', '1,1', '0,2', '1,2'], false), CG(L4, ['0,0', '1,0', '1,1', '1,2'], true), CG(T4b, ['0,0', '0,1', '0,2', '1,1'], true),
          { q: 'Do congruent shapes have the same area? Why?', lines: { n: 1, key: 'Yes: one covers the other exactly.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says a big square and a small square are congruent. What would you tell {b}?', lines: { n: 2, key: 'Not congruent: same shape but not the same size.' } },
          { q: 'Can two shapes have the same area but not be congruent? Draw them.', draw: { h: 60, key: 'Yes: a row of 4 squares and a 2 by 2 square.' } },
          { q: 'Where do you see congruent shapes?', lines: { n: 2, key: 'For example: tiles on a floor, windows in a building.' } },
          { q: 'How can tracing paper help you test congruence?', lines: { n: 2, key: 'Trace one shape and lay it on the other. If it fits, they are congruent.' } }]
      }
    }
  } });
})();
