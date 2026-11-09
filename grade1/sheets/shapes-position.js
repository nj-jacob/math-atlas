/* Grade 1 Shapes, Position and Coding: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per
   idea of the lessons in chapters/shapes-position.js: Learn, Practise 1 to 3 and Think. Every question is written here, not
   made at random, so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things.
   Ontario 2020: E1.1 sort and name flat shapes and solids; E1.2 find flat shapes in solids (faces); E1.3 matching halves;
   E1.4 position words (above, below, left, right); E1.5 and C3.1 follow code; C3.2 fix code.
   The answer checks are in tests/verify/sheets.js: sides and corners from the shape itself, shape and object names, faces,
   what can roll, sorting counts, fold lines, shelf positions, and the robot's moves on the map. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var SIDES = { tri: 3, sq: 4, rect: 4, rhom: 4, pent: 5, hex: 6, circle: 0, oval: 0 };
  var FLAT = { tri: 'triangle', sq: 'square', rect: 'rectangle', rhom: 'rhombus', pent: 'pentagon', hex: 'hexagon', circle: 'circle', oval: 'oval' };
  var SOLID = { cube: 'cube', prism: 'rectangular prism', pyramid: 'pyramid', cylinder: 'cylinder', cone: 'cone', sphere: 'sphere' };
  var FACES = { cube: 6, prism: 6, pyramid: 5, cylinder: 2, cone: 1, sphere: 0 };
  var L = function (i) { return String.fromCharCode(65 + i); };
  /* count the sides and corners of one shape */
  function SD(k, turn) { return { q: 'Count the sides and corners.', pic: ['flat', { list: [k], s: 54, turn: turn }], eq: ['[] sides', '[] corners'], cols: 2, a: [SIDES[k], SIDES[k]] }; }
  /* name one shape (or shape i of a lettered row) */
  function NM(list, i, opts, turn) {
    var one = list.length === 1;
    return { q: one ? 'Name this shape.' : 'What is shape ' + L(i) + '?', pic: ['flat', { list: list, s: one ? 54 : 44, turn: turn, letters: !one }], pick: { opts: opts, ans: opts.indexOf(FLAT[list[i]]), flat: i } };
  }
  /* circle the one shape with n sides */
  function SN(list, n, q) {
    var opts = list.map(function (k, i) { return L(i); }), ans = list.map(function (k) { return SIDES[k]; }).indexOf(n);
    return { q: q || 'Circle the shape with ' + n + ' sides.', pic: ['flat', { list: list, s: 40, letters: true }], pick: { opts: opts, ans: ans, sides: n } };
  }
  /* name an object */
  function OB(k, opts) { return { q: 'Name this object.', pic: ['solids', { list: [k], s: 38 }], pick: { opts: opts, ans: opts.indexOf(SOLID[k]), solid: 0 } }; }
  /* an everyday thing is shaped like ... */
  function LK(thing, k, opts) { return { q: 'A ' + thing + ' is shaped like a ...', pick: { opts: opts, ans: opts.indexOf(SOLID[k]), like: thing } }; }
  /* trace a face: which flat shape? */
  function FA(k, opts) { var good = { cube: ['square'], prism: ['rectangle', 'square'], pyramid: ['square', 'triangle'], cylinder: ['circle'], cone: ['circle'] }[k]; return { q: 'Trace a flat face. Circle the shape you get.', pic: ['solids', { list: [k], s: 38 }], pick: { opts: opts, ans: opts.findIndex(function (o) { return good.indexOf(o) >= 0; }), face: k } }; }
  /* how many flat faces? */
  function FF(k) { return { q: 'How many flat faces?', pic: ['solids', { list: [k], s: 38 }], eq: ['[] flat faces'], a: [FACES[k]], solid: k }; }
  /* can it roll? */
  function RL(k) { var r = ['cylinder', 'cone', 'sphere'].indexOf(k) >= 0; return { q: 'Can it roll?', pic: ['solids', { list: [k], s: 38 }], pick: { opts: ['yes', 'no'], ans: r ? 0 : 1, claim: { s: k, roll: 1 } } }; }
  /* sort the blocks: how many fit the label? (c circle, q square, t triangle; d shaded, w white; B big, s small) */
  var HOLD = { circle: [0, 'c'], square: [0, 'q'], triangle: [0, 't'], shaded: [1, 'd'], white: [1, 'w'], big: [2, 'B'], small: [2, 's'] };
  function TC(list, is) {
    var n = list.filter(function (x) { return is.every(function (l) { return x[HOLD[l][0]] === HOLD[l][1]; }); }).length;
    var shape = is.filter(function (l) { return HOLD[l][0] === 0; })[0], adj = is.filter(function (l) { return l !== shape; }), noun = shape ? shape + 's' : 'blocks';
    return { q: 'How many ' + adj.concat([noun]).join(' ') + '?', pic: ['tray', { list: list }], eq: ['[] ' + noun], a: [n], cnt: { is: is } };
  }
  /* does the dashed line make matching halves? */
  function FD(cells, cols, rows, line) {
    var m = cells.every(function (c) { var p = c.split(',').map(Number), q = line.x != null ? [2 * line.x - 1 - p[0], p[1]] : [p[0], 2 * line.y - 1 - p[1]]; return cells.indexOf(q.join()) >= 0; });
    return { q: 'Does the dashed line make matching halves?', pic: ['fold', { cols: cols, rows: rows, cells: cells, line: line, u: 14 }], pick: { opts: ['yes', 'no'], ans: m ? 0 : 1, fold: true } };
  }
  /* what is above, below, left of or right of a thing on the shelf? */
  function PO(rows, of, rel, opts) {
    var at = null;
    rows.forEach(function (row, i) { var j = row.indexOf(of); if (j < 0) return; var d = { above: [-1, 0], below: [1, 0], 'left of': [0, -1], 'right of': [0, 1] }[rel]; at = (rows[i + d[0]] || [])[j + d[1]]; });
    return { q: 'What is ' + (rel === 'above' || rel === 'below' ? rel : 'to the ' + rel) + ' the ' + of + '?', pic: ['shelf', { rows: rows }], pick: { opts: opts, ans: opts.indexOf(at), pos: { of: of, rel: rel } } };
  }
  /* robot code: moves by direction, "right 2, up" (rows count down from the top) */
  function run(start, code) {
    var st = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }, x = start[0], y = start[1], path = [[x, y]];
    code.split(',').forEach(function (c) { var m = c.trim().split(' '), g = st[m[0]]; for (var k = 0; k < +(m[1] || 1); k++) { x += g[0]; y += g[1]; path.push([x, y]); } });
    return path;
  }
  function map(start, marks, code) { return ['map', { cols: 6, rows: 4, u: 18, marks: marks, start: start, path: code ? run(start, code) : null }]; }
  /* where does the robot stop? */
  function GO(start, marks, code) {
    var opts = marks.map(function (m) { return m[2]; }), p = run(start, code), e = p[p.length - 1];
    var at = marks.filter(function (m) { return m[0] === e[0] && m[1] === e[1]; })[0];
    return { q: 'Run: ' + code + '. Circle where it stops.', pic: map(start, marks, code), robot: { code: code }, pick: { opts: opts, ans: opts.indexOf(at[2]) } };
  }
  /* fill in the numbers so the robot reaches a mark */
  function FL(start, marks, tmpl, nums, to) {
    var k = 0, code = tmpl.replace(/\[\]/g, function () { return nums[k++]; });
    return { q: 'Fill in the numbers to reach ' + to + '.', pic: map(start, marks, code), robot: { to: to }, eq: tmpl.split(', '), cols: 2, a: nums };
  }
  /* which code reaches the mark? */
  function RC(start, marks, codes, to) {
    var e = marks.filter(function (m) { return m[2] === to; })[0];
    var ans = codes.findIndex(function (c) { var p = run(start, c), f = p[p.length - 1]; return f[0] === e[0] && f[1] === e[1]; });
    return { q: 'Which code reaches ' + to + '?', pic: map(start, marks, codes[ans]), pick: { opts: codes, ans: ans, reach: to }, pickLast: true };
  }
  var M1 = [[3, 0, 'A'], [5, 2, 'B'], [1, 1, 'C']], M2 = [[4, 0, 'A'], [2, 3, 'B'], [0, 0, 'C']], M3 = [[5, 3, 'A'], [3, 1, 'B'], [1, 0, 'C']];
  var SH1 = [['cup', 'book', 'ball'], ['hat', 'sock', 'car'], ['fish', 'leaf', 'star']];
  var SH2 = [['apple', 'drum', 'bell'], ['kite', 'shoe', 'boat'], ['', 'egg', 'key']];
  var SH3 = [['pen', 'cap', 'mug'], ['bear', 'lamp', 'doll'], ['bag', 'fan', 'jar']];
  var NAMES = ['triangle', 'square', 'rectangle', 'hexagon', 'circle', 'pentagon', 'rhombus', 'oval'];
  var T1 = ['cdB', 'qwB', 'tds', 'cws', 'qds', 'cdB'], T2 = ['twB', 'tds', 'cwB', 'qws', 'tdB', 'cds'], T3 = ['qdB', 'qws', 'cds', 'tws', 'qdB', 'cwB', 'tds'];

  S.register('shapes-position', { code: 'SP', ideas: {

    sides: {
      watch: 'counting one side twice. Put a dot on each side as you count it.',
      goal: 'I can count the sides and corners of a shape.',
      learn: {
        show: { pic: ['flat', { list: ['tri', 'sq'], s: 50 }], cap: 'Sides are straight. Corners are where sides meet.', eq: ['3 sides, 3 corners', '4 sides, 4 corners'] },
        together: [SD('tri'), SD('rect')],
        cue: 'Put a dot on each side as you count.',
        own: [SD('hex'), SD('pent')]
      },
      p1: { show: { pic: ['flat', { list: ['sq'], s: 44 }], eq: ['4 sides, 4 corners'] }, items: [SD('sq'), SD('tri'), SD('hex'), SD('rect'), NM(['tri'], 0, ['triangle', 'square']), NM(['sq'], 0, ['circle', 'square'])] },
      p2: { items: [SD('pent'), SD('rhom'), SN(['tri', 'sq', 'hex'], 6), SN(['pent', 'sq', 'circle'], 5), NM(['hex'], 0, ['hexagon', 'pentagon']), NM(['rect'], 0, ['square', 'rectangle'])] },
      p3: { items: [SN(['circle', 'tri', 'rect'], 3), SN(['hex', 'pent', 'tri'], 6), NM(['tri', 'sq', 'pent'], 2, ['hexagon', 'pentagon']), NM(['circle', 'oval', 'sq'], 1, ['circle', 'oval']), SD('hex'), SN(['oval', 'rect', 'tri'], 4)] },
      think: {
        items: [{ q: 'Draw a shape with 4 sides.', draw: { h: 60, key: 'For example: a square or a rectangle.' } },
          { q: 'Does a circle have sides? Why?', lines: { n: 2, key: 'No. A circle is round. It has no straight sides and no corners.' } },
          SD('pent'),
          SN(['sq', 'hex', 'tri', 'pent'], 5)]
      }
    },

    turned: {
      watch: 'calling a turned square a diamond. Turning a shape does not change its name.',
      goal: 'I can name a shape when it is turned.',
      learn: {
        show: { pic: ['flat', { list: ['sq'], s: 50, turn: 45 }], cap: 'Still 4 sides the same length', eq: ['still a square'] },
        together: [NM(['tri'], 0, ['triangle', 'square'], 180), NM(['rect'], 0, ['rectangle', 'triangle'], 30)],
        cue: 'Count the sides. Turning does not change them.',
        own: [NM(['hex'], 0, ['circle', 'hexagon'], 20), NM(['sq'], 0, ['square', 'rectangle'], 45)]
      },
      p1: { show: { pic: ['flat', { list: ['tri'], s: 44, turn: 180 }], eq: ['still a triangle'] }, items: [NM(['tri'], 0, ['triangle', 'square'], 90), NM(['sq'], 0, ['square', 'triangle'], 45), NM(['rect'], 0, ['circle', 'rectangle'], 90), NM(['hex'], 0, ['hexagon', 'square'], 30), SD('tri', 180), SD('sq', 45)] },
      p2: { items: [NM(['pent'], 0, ['pentagon', 'hexagon'], 180), NM(['rect'], 0, ['square', 'rectangle'], 60), NM(['tri', 'sq', 'hex'], 1, ['square', 'triangle'], 45), NM(['tri', 'rect', 'pent'], 0, ['triangle', 'rectangle'], 180), SD('rect', 30), SD('pent', 180)] },
      p3: { items: [NM(['sq', 'tri', 'rect'], 2, ['rectangle', 'square'], 45), NM(['hex', 'pent', 'tri'], 1, ['hexagon', 'pentagon'], 20), NM(['oval'], 0, ['oval', 'circle'], 60), SN(['tri', 'sq', 'pent'], 3, 'Turned shapes. Circle the one with 3 sides.'), SD('hex', 20), SD('tri', 90)] },
      think: {
        items: [{ q: '{b} turned a square. {b} says it is a new shape now. Is {b} right? Why?', lines: { n: 2, key: 'No. It still has 4 sides the same length. It is still a square.' } },
          { q: 'Draw a triangle that is upside down.', draw: { h: 60, key: 'Any triangle with a point at the bottom.' } },
          NM(['tri', 'sq', 'rect'], 1, ['square', 'rectangle'], 45),
          SD('rect', 60)]
      }
    },

    names: {
      watch: 'naming a solid by one face, like calling a cube a square. A cube is a solid; a square is flat.',
      goal: 'I can name solids and find them around me.',
      learn: {
        show: { pic: ['solids', { list: ['cube', 'cylinder', 'sphere'], s: 44 }], cap: 'cube, cylinder, sphere', eq: ['Solids are not flat'] },
        together: [OB('cube', ['cube', 'cone']), LK('soup can', 'cylinder', ['cylinder', 'sphere'])],
        cue: 'Look at the faces. Are they flat or curved?',
        own: [OB('cone', ['cylinder', 'cone']), LK('ball', 'sphere', ['cube', 'sphere'])]
      },
      p1: { show: { pic: ['solids', { list: ['prism'], s: 40 }], eq: ['rectangular prism'] }, items: [OB('sphere', ['sphere', 'cone']), OB('cylinder', ['cube', 'cylinder']), OB('prism', ['rectangular prism', 'pyramid']), OB('pyramid', ['cone', 'pyramid']), RL('sphere'), RL('cube')] },
      p2: { items: [LK('cereal box', 'prism', ['rectangular prism', 'cylinder']), LK('party hat', 'cone', ['cone', 'cube']), LK('number cube', 'cube', ['sphere', 'cube']), LK('orange', 'sphere', ['cone', 'sphere']), RL('cone'), RL('prism')] },
      p3: { items: [OB('cube', ['rectangular prism', 'cube']), OB('cone', ['pyramid', 'cone']), LK('drum', 'cylinder', ['cylinder', 'rectangular prism']), LK('brick', 'prism', ['rectangular prism', 'pyramid']), RL('cylinder'), RL('pyramid')] },
      think: {
        items: [{ q: 'Name something at home shaped like a cylinder.', lines: { n: 1, key: 'For example: a can, a candle, a paper towel roll.' } },
          { q: 'Why can a sphere roll but a cube cannot?', lines: { n: 2, key: 'A sphere is curved all over. A cube has flat faces and corners.' } },
          LK('ice cream cone', 'cone', ['cone', 'cylinder', 'sphere']),
          RL('cylinder')]
      }
    },

    faces: {
      watch: 'naming the solid instead of the face. A face is flat: a square, a circle, a rectangle or a triangle.',
      goal: 'I can find flat shapes on solids.',
      learn: {
        show: { pic: ['solids', { list: ['cylinder'], s: 44 }], cap: 'Trace the bottom', eq: ['a circle'] },
        together: [FA('cube', ['square', 'circle']), FF('cube')],
        cue: 'Picture the solid on paper. Trace around the bottom.',
        own: [FA('cone', ['triangle', 'circle']), FF('cylinder')]
      },
      p1: { show: { eq: ['cube: square faces'] }, items: [FA('cylinder', ['circle', 'square']), FA('cube', ['triangle', 'square']), FA('prism', ['rectangle', 'circle']), FA('cone', ['circle', 'rectangle']), FF('cube'), FF('cone')] },
      p2: { items: [FA('pyramid', ['triangle', 'circle']), FA('prism', ['circle', 'rectangle']), FF('prism'), FF('cylinder'), FF('pyramid'), FA('cylinder', ['triangle', 'circle'])] },
      p3: { items: [FF('sphere'), FF('cone'), FA('pyramid', ['circle', 'square']), FA('cube', ['circle', 'square']), FF('cube'), FF('prism')] },
      think: {
        items: [{ q: 'Which solid has no flat faces?', pick: { opts: ['sphere', 'cube', 'cone'], ans: 0, clue: { f: 0 } } },
          { q: 'Trace a cereal box two ways. Draw what you get.', draw: { h: 60, key: 'Two rectangles of different sizes (or a rectangle and a square).' } },
          { q: '{a} traced a cone and got a triangle. Can that be right? Why?', lines: { n: 2, key: 'No. The flat face of a cone is a circle. The rest is curved.' } },
          FF('pyramid')]
      }
    },

    rule: {
      watch: 'changing the rule halfway. Say the rule, then check every block with it.',
      goal: 'I can sort shapes by a rule.',
      learn: {
        show: { pic: ['tray', { list: ['cdB', 'qwB', 'cws'] }], cap: 'Rule: circles', eq: ['2 circles'] },
        together: [TC(T1, ['circle']), TC(T1, ['big'])],
        cue: 'Say the rule. Touch each block and ask: does it fit?',
        own: [TC(T2, ['triangle']), TC(T2, ['white'])]
      },
      p1: { show: { pic: ['tray', { list: ['tds', 'qws'] }], eq: ['1 shaded'] }, items: [TC(T1, ['shaded']), TC(T1, ['small']), TC(T1, ['square']), TC(T2, ['big']), TC(T2, ['circle']), TC(T2, ['shaded'])] },
      p2: { items: [TC(T3, ['square']), TC(T3, ['big']), TC(T3, ['white']), SN(['tri', 'sq', 'circle'], 4, 'Rule: 4 sides. Circle the one that fits.'), SN(['hex', 'circle', 'tri'], 3, 'Rule: 3 sides. Circle the one that fits.'), TC(T1, ['circle', 'big'])] },
      p3: { items: [TC(T3, ['square', 'shaded']), TC(T2, ['triangle', 'shaded']), TC(T3, ['small', 'white']), TC(T1, ['shaded', 'small']), SN(['circle', 'oval', 'pent'], 5, 'Rule: 5 sides. Circle the one that fits.'), TC(T2, ['white', 'big'])] },
      think: {
        items: [{ q: 'Sort these blocks another way. Write your rule.', pic: ['tray', { list: T1 }], lines: { n: 2, key: 'For example: big and small, or shaded and white.' } },
          { q: '{b} sorted by colour. Name another rule {b} could use.', lines: { n: 1, key: 'By shape, by size, or by number of sides.' } },
          TC(T3, ['triangle']),
          { q: 'Why does a rule help when you sort?', lines: { n: 2, key: 'It tells you where each thing goes, so you sort the same way every time.' } }]
      }
    },

    fold: {
      watch: 'checking only the outline. Every shaded square must land on a shaded square when you fold.',
      goal: 'I can tell when a fold makes matching halves.',
      learn: {
        show: { pic: ['fold', { cols: 4, rows: 3, cells: ['1,0', '2,0', '0,1', '1,1', '2,1', '3,1'], line: { x: 2 } }], cap: 'Fold on the line: the halves match', eq: ['matching halves'] },
        together: [FD(['0,0', '1,0', '2,0', '3,0'], 4, 2, { x: 2 }), FD(['0,0', '1,0', '1,1'], 4, 2, { x: 2 })],
        cue: 'Fold it in your mind. Does each square land on a square?',
        own: [FD(['1,0', '2,0', '1,1', '2,1'], 4, 2, { x: 2 }), FD(['0,0', '0,1', '1,1'], 4, 2, { y: 1 })]
      },
      p1: { show: { pic: ['fold', { cols: 4, rows: 2, cells: ['0,0', '3,0', '0,1', '3,1'], line: { x: 2 } }], eq: ['matching halves'] }, items: [FD(['1,0', '2,0'], 4, 2, { x: 2 }), FD(['0,0', '1,0', '2,1'], 4, 2, { x: 2 }), FD(['0,0', '0,1'], 4, 2, { y: 1 }), FD(['1,0', '2,1'], 4, 2, { x: 2 }), FD(['0,1', '1,1', '2,1', '3,1'], 4, 2, { x: 2 }), FD(['1,0', '1,1', '2,0'], 4, 2, { y: 1 })] },
      p2: { items: [FD(['1,0', '4,0', '2,1', '3,1', '1,2', '4,2'], 6, 3, { x: 3 }), FD(['2,0', '3,0', '2,1', '3,1', '2,2'], 6, 3, { x: 3 }), FD(['0,0', '1,0', '0,3', '1,3'], 4, 4, { y: 2 }), FD(['1,1', '2,1', '1,2'], 4, 4, { y: 2 }), FD(['0,0', '5,0', '1,1', '4,1'], 6, 2, { x: 3 }), FD(['0,1', '1,1', '2,1', '3,1', '4,1'], 6, 2, { x: 3 })] },
      p3: { items: [FD(['2,0', '3,0', '1,1', '2,1', '3,1', '4,1', '2,2', '3,2'], 6, 3, { x: 3 }), FD(['1,0', '2,1', '3,1', '4,0'], 6, 2, { x: 3 }), FD(['1,0', '1,1', '1,2', '1,3', '0,1'], 3, 4, { y: 2 }), FD(['0,0', '2,1', '3,1', '5,2'], 6, 3, { x: 3 }), FD(['0,1', '1,0', '1,1', '1,2', '0,2'], 3, 4, { y: 2 }), FD(['2,0', '3,0', '2,2', '3,2'], 6, 3, { x: 3 })] },
      think: {
        items: [{ q: 'Draw a shape with matching halves. Draw the fold line.', draw: { h: 70, key: 'For example: a heart or a square with a line down the middle.' } },
          { q: 'Name something in nature with matching halves.', lines: { n: 1, key: 'For example: a butterfly, a leaf, a face.' } },
          { q: '{a} folded a paper heart from the side. The halves did not match. What should {a} try?', lines: { n: 2, key: 'Fold it down the middle, from the top point to the bottom point.' } },
          FD(['1,0', '2,0', '0,1', '3,1', '1,2', '2,2'], 4, 3, { x: 2 })]
      }
    },

    above: {
      watch: 'mixing up above and below. Above is higher up; below is lower down.',
      goal: 'I can use above and below to tell where things are.',
      learn: {
        show: { pic: ['shelf', { rows: SH1.slice(0, 2) }], cap: 'The book is above the sock', eq: ['sock is below the book'] },
        together: [PO(SH1.slice(0, 2), 'hat', 'above', ['cup', 'sock']), PO(SH1.slice(0, 2), 'ball', 'below', ['car', 'book'])],
        cue: 'Find the thing. Look up one shelf for above, down one for below.',
        own: [PO(SH2.slice(0, 2), 'shoe', 'above', ['drum', 'boat']), PO(SH2.slice(0, 2), 'bell', 'below', ['boat', 'kite'])]
      },
      p1: { show: { eq: ['above: up one shelf'] }, items: [PO(SH1, 'hat', 'above', ['cup', 'fish']), PO(SH1, 'hat', 'below', ['fish', 'cup']), PO(SH1, 'car', 'above', ['ball', 'star']), PO(SH2, 'drum', 'below', ['shoe', 'kite'])] },
      p2: { items: [PO(SH2, 'key', 'above', ['boat', 'bell']), PO(SH2, 'egg', 'above', ['shoe', 'drum']), PO(SH3, 'lamp', 'above', ['cap', 'fan']), PO(SH3, 'lamp', 'below', ['fan', 'cap'])] },
      p3: { items: [PO(SH3, 'bag', 'above', ['bear', 'pen']), PO(SH3, 'mug', 'below', ['doll', 'jar']), PO(SH1, 'star', 'above', ['car', 'ball']), PO(SH1, 'cup', 'below', ['fish', 'hat'])] },
      think: {
        items: [{ q: 'What is above your head right now?', lines: { n: 1, key: 'For example: the ceiling, a light, the sky.' } },
          { q: 'Draw a cup above a book.', draw: { h: 70, key: 'A cup drawn higher up than the book.' } },
          { q: 'The hat is below the cup. What is above the cup on this shelf?', pic: ['shelf', { rows: SH1 }], lines: { n: 1, key: 'Nothing. The cup is on the top shelf.' } },
          PO(SH3, 'fan', 'above', ['lamp', 'cap'])]
      }
    },

    left: {
      watch: 'mixing up left and right. Hold up your hands: the one that makes an L is your left.',
      goal: 'I can use left and right to tell where things are.',
      learn: {
        show: { pic: ['shelf', { rows: [['apple', 'ball', 'star']] }], cap: 'The apple is to the left of the ball', eq: ['star is to the right'] },
        together: [PO(SH1, 'sock', 'left of', ['hat', 'car']), PO(SH1, 'sock', 'right of', ['car', 'hat'])],
        cue: 'Make an L with your left hand. Look that way for left.',
        own: [PO(SH2, 'shoe', 'left of', ['kite', 'boat']), PO(SH2, 'drum', 'right of', ['bell', 'apple'])]
      },
      p1: { show: { eq: ['Your left hand makes an L.'] }, items: [PO(SH1, 'book', 'left of', ['cup', 'ball']), PO(SH1, 'book', 'right of', ['ball', 'cup']), PO(SH1, 'hat', 'right of', ['sock', 'car']), PO(SH2, 'boat', 'left of', ['shoe', 'kite'])] },
      p2: { items: [PO(SH3, 'cap', 'left of', ['pen', 'mug']), PO(SH3, 'lamp', 'right of', ['doll', 'bear']), PO(SH3, 'fan', 'left of', ['jar', 'bag']), PO(SH3, 'bear', 'right of', ['lamp', 'doll'])] },
      p3: { items: [PO(SH3, 'jar', 'left of', ['bag', 'fan']), PO(SH3, 'mug', 'left of', ['cap', 'pen']), PO(SH1, 'car', 'left of', ['sock', 'hat']), PO(SH1, 'fish', 'right of', ['star', 'leaf'])] },
      think: {
        items: [{ q: 'Draw a ball. Draw a star to the right of it.', draw: { h: 60, key: 'The star is on the right-hand side of the ball.' } },
          { q: '{a} faces you and waves the right hand. Which side is it on for you?', lines: { n: 1, key: 'On my left. Facing someone swaps left and right.' } },
          { q: 'How do you remember which hand is left?', lines: { n: 2, key: 'Hold up both hands. The thumb and finger that make an L are on the left.' } },
          PO(SH3, 'doll', 'left of', ['lamp', 'bear'])]
      }
    },

    follow: {
      watch: 'skipping a step. Move one square for each step, in order.',
      goal: 'I can follow code to move a robot.',
      learn: {
        show: { pic: map([0, 3, '^'], [[2, 1, 'A']], 'right 2, up 2'), cap: 'right, right, up, up', eq: ['It stops at A'] },
        together: [GO([0, 3, '^'], M1, 'up 2, right'), GO([0, 3, '^'], M1, 'right 3, up 3')],
        cue: 'Put your finger on the robot. Move one square for each step.',
        own: [GO([0, 3, '^'], M2, 'right 2'), GO([0, 3, '^'], M3, 'up 2, right 3')]
      },
      p1: { show: { eq: ['right 2: two squares right'] }, items: [GO([0, 3, '^'], M1, 'right, up 2'), GO([0, 3, '^'], M1, 'right 5, up'), GO([0, 3, '^'], M2, 'up 3'), GO([0, 3, '^'], M2, 'right 4, up 3')] },
      p2: { items: [GO([5, 0, '^'], M1, 'left 2'), GO([5, 0, '^'], M1, 'down 2'), GO([5, 0, '^'], M2, 'left 3, down 3'), GO([5, 0, '^'], M2, 'left, down 3, left 2')] },
      p3: { items: [GO([2, 2, '^'], M1, 'up 2, right'), GO([2, 2, '^'], M1, 'right 3'), GO([2, 2, '^'], M2, 'down, right, left 3, up 3'), GO([2, 2, '^'], M3, 'right 3, down')] },
      think: {
        items: [{ q: 'Write code to move from A to C.', pic: map([0, 3, '^'], M1), lines: { n: 1, key: 'For example: left 2, down 1.' } },
          { q: '{b} ran "up, right" and {a} ran "right, up". Do they stop in the same square?', lines: { n: 2, key: 'Yes. Both go 1 up and 1 right, by different paths.' } },
          { q: 'Why does the order of steps matter?', lines: { n: 2, key: 'Each step starts where the last one ended. A different order can take a different path.' } },
          GO([0, 3, '^'], M1, 'up, right 5')]
      }
    },

    debug: {
      watch: 'starting the code again from scratch. Run it one step at a time and find the step that goes wrong.',
      goal: 'I can find and fix a mistake in code.',
      learn: {
        show: { pic: map([0, 3, '^'], [[3, 1, 'A']], 'right 3, up 2'), cap: '"right 2, up 2" stops too soon', eq: ['Fix: right 3, up 2'] },
        together: [FL([0, 3, '^'], M1, 'right [], up []', [3, 3], 'A'), RC([0, 3, '^'], M1, ['right 5, up', 'right 5, up 2', 'right 4, up'], 'B')],
        cue: 'Run the code one step at a time. Where does it go wrong?',
        own: [FL([0, 3, '^'], M2, 'right [], up []', [2, 0], 'B'), RC([0, 3, '^'], M3, ['up, right 3', 'up 2, right 3', 'up 2, right 2'], 'B')]
      },
      p1: { show: { eq: ['Run it one step at a time.'] }, items: [FL([0, 3, '^'], M1, 'right [], up []', [1, 2], 'C'), FL([0, 3, '^'], M2, 'right [], up []', [4, 3], 'A'), FL([0, 3, '^'], M3, 'right [], up []', [1, 3], 'C'), FL([0, 3, '^'], M3, 'right [], up []', [3, 2], 'B')] },
      p2: { items: [RC([0, 3, '^'], M1, ['right, up 2', 'right 2, up 2', 'up 2, right 2'], 'C'), RC([0, 3, '^'], M2, ['right 4, up 3', 'right 3, up 3', 'up 3, right 3'], 'A'), FL([5, 0, '^'], M1, 'left [], down []', [0, 2], 'B'), FL([5, 0, '^'], M2, 'left [], down []', [3, 3], 'B')] },
      p3: { items: [RC([5, 0, '^'], M3, ['down 3', 'left, down 3', 'down 2'], 'A'), RC([2, 2, '^'], M1, ['up 2, right', 'up, right 2', 'right, up'], 'A'), FL([2, 2, '^'], M3, 'right [], up []', [1, 1], 'B'), FL([2, 2, '^'], M2, 'left [], up []', [2, 2], 'C')] },
      think: {
        items: [{ q: '{a} wrote "right 2, up 3" to reach B. It does not work. Fix it.', pic: map([0, 3, '^'], M3), lines: { n: 1, key: 'right 3, up 2.' } },
          { q: 'What is a bug in code?', lines: { n: 2, key: 'A mistake that makes the code do the wrong thing.' } },
          { q: 'How do you find a bug?', lines: { n: 2, key: 'Run the code one step at a time and see where it goes wrong.' } },
          FL([0, 3, '^'], M1, 'right [], up []', [5, 1], 'B')]
      }
    }
  } });
})();
