/* Grade 3 Shapes and Directions: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea
   of the lessons in chapters/shapes.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Objects: cube, prism (rectangular prism), tri (triangular prism), pyramid (square-based pyramid), tpyr (triangular pyramid),
   cylinder, cone, sphere. Maps: columns A to F, rows 1 to 5 from the bottom; a walk is "forward 3, quarter turn right, ...".
   Ontario 2020 (the codes the lessons name): E1.1 3D objects by their faces, edges and vertices; E1.2 build and take apart
   structures; E1.3 congruent faces and objects; E1.4 directions and maps with quarter and half turns.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var FACT = {
    cube: { f: 6, e: 12, v: 8 }, prism: { f: 6, e: 12, v: 8 }, tri: { f: 5, e: 9, v: 6 }, pyramid: { f: 5, e: 8, v: 5 }, tpyr: { f: 4, e: 6, v: 4 },
    cylinder: { f: 2, c: 1, p: 0 }, cone: { f: 1, c: 1, p: 1 }, sphere: { f: 0, c: 1, p: 0 }
  };
  var NAME = { cube: 'cube', prism: 'rectangular prism', tri: 'triangular prism', pyramid: 'square-based pyramid', tpyr: 'triangular pyramid', cylinder: 'cylinder', cone: 'cone', sphere: 'sphere' };
  var WORD = { f: 'flat faces', e: 'edges', v: 'vertices', c: 'curved surfaces', p: 'points' };
  function SO(k) { return ['solids', { list: [k], s: 44 }]; }
  /* count some parts of one object (what: 'f', 'e', 'v', 'c', 'p') */
  function CN(k, whats, q) { return { q: q || 'Count them.', pic: SO(k), eq: whats.map(function (w) { return '[] ' + WORD[w]; }), a: whats.map(function (w) { return FACT[k][w]; }), solid: k }; }
  /* parts of several objects in all */
  function ALL(ks, w, q) { return { q: q || 'How many ' + WORD[w] + ' in all?', pic: ['solids', { list: ks, s: 40 }], eq: ['[] ' + WORD[w]], a: [ks.reduce(function (t, k) { return t + FACT[k][w]; }, 0)], solid: ks }; }
  /* circle the lettered object that fits the clue */
  function CL(q, ks, clue, ans) { return { q: q, pic: ['solids', { list: ks, letters: true }], pick: { opts: ks.map(function (k, i) { return String.fromCharCode(65 + i); }), ans: ans, clue: clue } }; }
  /* true or false about one object */
  function TF(st, claim, ans) { return { q: 'True or false: ' + st, pick: { opts: ['true', 'false'], ans: ans ? 0 : 1, claim: claim } }; }
  /* prism, pyramid or neither */
  function KD(k) {
    var kind = { cube: 'prism', prism: 'prism', tri: 'prism', pyramid: 'pyramid', tpyr: 'pyramid' }[k] || 'neither', opts = FACT[k].c ? ['prism', 'pyramid', 'neither'] : ['prism', 'pyramid'];
    return { q: 'Circle the kind.', pic: SO(k), pick: { opts: opts, ans: opts.indexOf(kind) }, solid: k, wide: opts.length > 2 };
  }
  /* a structure taken apart (top first) */
  function ST(ks, w, q) { return { q: q || 'How many ' + WORD[w] + ' in all?', pic: ['stack', { list: ks, s: 32 }], eq: ['[] ' + WORD[w]], a: [ks.reduce(function (t, k) { return t + FACT[k][w]; }, 0)], solid: ks }; }
  /* which object is at place n of a structure (0: the top) */
  function SP(ks, n, opts) { return { q: n ? 'Which object is at the bottom?' : 'Which object is on top?', pic: ['stack', { list: ks, s: 32 }], pick: { opts: opts, ans: opts.indexOf(NAME[ks[n]]), part: n }, wide: opts.join('').length > 18 }; }
  /* two faces side by side (to scale) */
  function FC(a, b, miss) {
    var one = function (d) { return ['rect', { a: d[0], b: d[1], w: (d[0] === '?' ? miss : d[0]) * 9, h: (d[1] === '?' ? miss : d[1]) * 9, unit: 'cm' }]; };
    return ['row', { list: [one(a), one(b)], labels: ['A', 'B'], gap: 20 }];
  }
  function same(a, b) { return a.slice().sort().join() === b.slice().sort().join(); }
  function CF(a, b) { return { q: 'Are A and B congruent?', pic: FC(a, b), pick: { opts: ['yes', 'no'], ans: same(a, b) ? 0 : 1 }, cong: { a: a, b: b } }; }
  /* B has a side missing: make it congruent to A (b uses '?' for the missing side) */
  function CM(a, b) {
    var known = b.filter(function (x) { return x !== '?'; })[0], miss = a[0] === known ? a[1] : a[0];
    return { q: 'Make B congruent to A.', pic: FC(a, b, miss), eq: ['? = [] cm'], a: [miss], cong: { a: a, b: b } };
  }
  /* boxes of cubes */
  function BX(d) { return ['box', { l: d[0], d: d[1], h: d[2], u: 13 }]; }
  function CB(a, b) { return { q: 'Are A and B congruent?', pic: ['row', { list: [BX(a), BX(b)], labels: ['A', 'B'], gap: 28 }], pick: { opts: ['yes', 'no'], ans: same(a, b) ? 0 : 1 }, cong: { a: a, b: b } }; }
  function CBS(a, b) { return { q: 'A is ' + a.join(' by ') + '. B is ' + b.join(' by ') + '. Congruent?', pick: { opts: ['yes', 'no'], ans: same(a, b) ? 0 : 1 }, cong: { a: a, b: b } }; }
  /* turning on a compass */
  var DN = ['north', 'east', 'south', 'west'], AR = ['^', '>', 'v', '<'];
  function TB(t) { return /half/.test(t) ? 2 : /right/.test(t) ? 1 : 3; }
  function TU(from, moves) {
    var d = DN.indexOf(from); moves.split(', ').forEach(function (t) { d = (d + TB(t)) % 4; });
    return { q: 'Face ' + from + '. Make a ' + moves.replace(/, /g, ', then a ') + '.', pic: ['compass', { face: from }], eq: ['facing []'], a: [DN[d]], turn: { from: from, moves: moves } };
  }
  function TT(from, to, opts) {
    var ok = opts.map(function (t) { return DN[(DN.indexOf(from) + TB(t)) % 4] === to; });
    return { q: 'You face ' + from + '. Which turn makes you face ' + to + '?', pick: { opts: opts, ans: ok.indexOf(true) }, turnTo: { from: from, to: to }, wide: true };
  }
  function QT(from, to, dir) {
    var n = 1; while ((DN.indexOf(from) + n * (dir === 'left' ? 3 : 1)) % 4 !== DN.indexOf(to)) n++;
    return { q: 'From ' + from + ' to ' + to + ', turning ' + dir + '. How many quarter turns?', pic: ['compass', { face: from }], eq: ['[] quarter turns'], a: [n], turnTo: { from: from, to: to, dir: dir } };
  }
  /* walking on a map: 6 columns (A to F) and 5 rows (1 to 5 from the bottom) */
  var COLS = 6, ROWS = 5;
  function at(name) { return ['ABCDEF'.indexOf(name[0]), ROWS - +name.slice(1)]; }
  function nm(x, y) { return 'ABCDEF'[x] + (ROWS - y); }
  function sim(st, face, code) {
    var p = at(st), d = DN.indexOf(face), pts = [[p[0], p[1]]], n = 0, step = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    code.split(', ').forEach(function (t) {
      var f = t.match(/^forward (\d+)$/);
      if (f) { p = [p[0] + step[d][0] * +f[1], p[1] + step[d][1] * +f[1]]; n += +f[1]; pts.push(p); } else d = (d + TB(t)) % 4;
    });
    return { cell: nm(p[0], p[1]), dir: DN[d], n: n, pts: pts };
  }
  function MP(st, face, code, marks, u) { var p = at(st); return ['map', { cols: COLS, rows: ROWS, u: u || (marks ? 20 : 15), grid: true, marks: marks || [], start: [p[0], p[1], AR[DN.indexOf(face)]], path: code ? sim(st, face, code).pts : null }]; }
  /* follow a walk: where you end (at), how far (far), which way you face (face) */
  function WK(st, face, code, ask) {
    var r = sim(st, face, code), eq = [], a = [];
    ask.forEach(function (k) { if (k === 'at') { eq.push('at []'); a.push(r.cell); } if (k === 'far') { eq.push('[] squares'); a.push(r.n); } if (k === 'face') { eq.push('facing []'); a.push(r.dir); } });
    return { q: st + ', facing ' + face + ': ' + code + '.', pic: MP(st, face, code), eq: eq, a: a, walk: code };
  }
  /* circle the lettered place where the walk ends */
  function WP(st, face, code, marks) {
    var r = sim(st, face, code), opts = marks.map(function (m) { return m[2]; }), hit = marks.filter(function (m) { return nm(m[0], m[1]) === r.cell; })[0];
    return { q: st + ', facing ' + face + ': ' + code + '. Circle the end.', pic: MP(st, face, code, marks), pick: { opts: opts, ans: opts.indexOf(hit[2]) }, walk: code };
  }
  /* fill in the numbers of the directions to reach a square */
  function GF(st, face, tmpl, nums, u) {
    var k = 0, code = tmpl.replace(/\[\]/g, function () { return nums[k++]; }), r = sim(st, face, code);
    return { q: st + ', facing ' + face + '. Get to ' + r.cell + '.', pic: MP(st, face, code, null, u), eq: tmpl.split(', '), a: nums, walk: true, to: r.cell };
  }
  /* write directions from one square to another */
  function GV(st, face, code) { var r = sim(st, face, code); return { q: 'Write directions from ' + st + ', facing ' + face + ', to ' + r.cell + '.', pic: MP(st, face, code), lines: { n: 2, key: code }, give: r.cell }; }

  S.register('shapes', { code: 'SH', ideas: {

    faces: {
      watch: 'counting only the faces in the picture. The faces at the back and bottom count too.',
      goal: 'I can count all the flat faces of an object.',
      learn: {
        show: { pic: SO('cube'), cap: 'You see 3 faces. 3 more hide.', eq: ['3 + 3 = 6', '6 flat faces'] },
        together: [CN('prism', ['f']), CN('pyramid', ['f'])],
        cue: 'Count the faces you can see. Then picture the back and the bottom.',
        own: [CN('tri', ['f']), CN('tpyr', ['f'])]
      },
      p1: {
        show: { pic: SO('tri'), cap: '2 triangles and 3 rectangles', eq: ['2 + 3 = 5', '5 flat faces'] },
        items: [CN('cube', ['f']), CN('pyramid', ['f']), CN('tpyr', ['f']), CN('prism', ['f'])]
      },
      p2: {
        items: [CL('Circle the object with 4 flat faces.', ['cube', 'tpyr', 'tri', 'pyramid'], { f: 4 }, 1), CL('Circle the object with 6 flat faces.', ['pyramid', 'tri', 'prism', 'cone'], { f: 6 }, 2),
          TF('a cube has 6 flat faces.', { s: 'cube', f: 6 }, true), TF('a cone has 2 flat faces.', { s: 'cone', f: 2 }, false),
          ALL(['cube', 'tpyr'], 'f'), ALL(['pyramid', 'cylinder'], 'f')]
      },
      p3: {
        items: [ALL(['tri', 'pyramid'], 'f'), ALL(['cube', 'cube', 'cone'], 'f'),
          { q: '{a} paints every flat face of a cube and a triangular prism. How many faces?', eq: ['[] flat faces'], a: [11], solid: ['cube', 'tri'] },
          TF('a triangular pyramid has 4 flat faces.', { s: 'tpyr', f: 4 }, true),
          { q: 'Name the shapes of the flat faces of a triangular prism.', lines: { n: 2, key: '2 triangles and 3 rectangles.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says a cube has 3 faces. Why might {a} think that? What is right?', lines: { n: 3, key: 'Only 3 faces show in a picture. A cube has 6: 3 more hide at the back and bottom.' } },
          { q: 'How could you check the faces with a real box?', lines: { n: 2, key: 'Put a sticker on each face as you count, and turn the box.' } },
          { q: 'Can an object have 0 flat faces? Give an example.', lines: { n: 2, key: 'Yes. A sphere has no flat faces.' } },
          { q: 'Draw an object with 5 flat faces.', draw: { h: 80, key: 'For example: a triangular prism or a square-based pyramid.' } }]
      }
    },

    edges: {
      watch: 'missing the hidden (dashed) edges, or mixing up edges and vertices. Edges are lines; vertices are corners.',
      goal: 'I can count the edges and vertices of an object.',
      learn: {
        show: { pic: SO('cube'), cap: 'Edges: 4 front, 4 back, 4 joining', eq: ['4 + 4 + 4 = 12', '12 edges, 8 vertices'] },
        together: [CN('pyramid', ['e', 'v']), CN('tri', ['e', 'v'])],
        cue: 'Count edges in groups: around the base, then up or across. A vertex is where edges meet.',
        own: [CN('tpyr', ['e', 'v']), CN('prism', ['e', 'v'])]
      },
      p1: {
        show: { pic: SO('tpyr'), cap: '3 around the base, 3 up to the point', eq: ['3 + 3 = 6 edges'] },
        items: [CN('cube', ['e']), CN('cube', ['v']), CN('pyramid', ['e']), CN('pyramid', ['v']), CN('tri', ['e']), CN('tpyr', ['v'])]
      },
      p2: {
        items: [CL('Circle the object with 8 edges.', ['cube', 'pyramid', 'tri', 'tpyr'], { e: 8 }, 1), CL('Circle the object with 6 vertices.', ['tri', 'tpyr', 'cube', 'pyramid'], { v: 6 }, 0),
          TF('a square-based pyramid has 5 vertices.', { s: 'pyramid', v: 5 }, true), TF('a triangular prism has 6 edges.', { s: 'tri', e: 6 }, false),
          CN('prism', ['e', 'v'])]
      },
      p3: {
        items: [ALL(['cube', 'tpyr'], 'e'), ALL(['pyramid', 'tri'], 'v'), ALL(['tpyr', 'tpyr'], 'e'),
          TF('a cube and a rectangular prism have the same number of edges.', { s: 'prism', e: 12 }, true),
          { q: '{b} counts 9 edges on a triangular prism. Is {b} right?', pick: { opts: ['yes', 'no'], ans: 0, claim: { s: 'tri', e: 9 } } },
          { q: 'Why do we not count edges on a cone?', lines: { n: 2, key: 'A cone has a curved surface, so it has no straight edges.' }, wide: true }]
      },
      think: {
        items: [{ q: 'What is the difference between an edge and a vertex?', lines: { n: 2, key: 'An edge is a line where two faces meet. A vertex is a corner where edges meet.' } },
          { q: '{a} counted 9 edges on a cube. What did {a} miss?', lines: { n: 2, key: 'The 3 hidden edges at the back. A cube has 12.' } },
          { q: 'How can counting in groups help?', lines: { n: 2, key: 'You count each edge once: front, back, then the ones joining them.' } },
          { q: 'A pyramid has 4 vertices. What is its base?', lines: { n: 2, key: 'A triangle: 3 corners on the base and 1 at the top.' } }]
      }
    },

    kinds: {
      watch: 'naming an object by its side faces. Ask: two matching ends, or one base and a point?',
      goal: 'I can tell a prism from a pyramid.',
      learn: {
        show: { pic: ['solids', { list: ['tri', 'pyramid'], s: 60 }], cap: 'Two matching ends, or one base and a point', eq: ['prism', 'pyramid'] },
        together: [KD('tri'), KD('tpyr')],
        cue: 'Two matching ends joined by rectangles: a prism. One base and a point: a pyramid.',
        own: [KD('cube'), KD('pyramid')]
      },
      p1: {
        show: { pic: SO('tpyr'), cap: 'A triangle base and a point', eq: ['triangular pyramid'] },
        items: [KD('pyramid'), KD('prism'), KD('tri'), KD('tpyr')]
      },
      p2: {
        items: [CL('Circle the prism.', ['pyramid', 'tri', 'cone', 'tpyr'], { kind: 'prism' }, 1), CL('Circle the pyramid.', ['cube', 'cylinder', 'pyramid', 'tri'], { kind: 'pyramid' }, 2),
          CL('Circle the triangular pyramid.', ['pyramid', 'tri', 'tpyr', 'cube'], { kind: 'pyramid', sq: 0 }, 2), CL('Circle the triangular prism.', ['tpyr', 'prism', 'cube', 'tri'], { kind: 'prism', f: 5 }, 3),
          TF('a cube is a prism.', { s: 'cube', kind: 'prism' }, true), TF('a cone is a pyramid.', { s: 'cone', kind: 'pyramid' }, false)]
      },
      p3: {
        items: [KD('sphere'), CL('Circle the square-based pyramid.', ['tpyr', 'pyramid', 'cube', 'tri'], { kind: 'pyramid', sq: 1 }, 1),
          TF('a triangular prism has a point.', { s: 'tri', p: 1 }, false),
          { q: 'How are a triangular prism and a triangular pyramid alike? How are they different?', lines: { n: 3, key: 'Both have triangle faces. The prism has two triangle ends and rectangles; the pyramid has a triangle base and a point.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} calls a triangular prism a "rectangle pyramid". What would you tell {a}?', lines: { n: 3, key: 'It has two matching triangle ends, so it is a prism, named by its triangle ends.' } },
          { q: 'Why is a cube a prism?', lines: { n: 2, key: 'It has two matching square ends joined by squares.' } },
          { q: 'Find a prism and a pyramid in your home. Name them.', lines: { n: 2, key: 'For example: a cereal box (rectangular prism) and a tent (pyramid).' } },
          { q: 'Draw a pyramid with a square base.', draw: { h: 80, key: 'A square base with 4 triangles meeting at a point.' } }]
      }
    },

    curved: {
      watch: 'counting a curved surface as a flat face. The part that rolls is curved.',
      goal: 'I can describe objects with curved surfaces.',
      learn: {
        show: { pic: SO('cylinder'), cap: '2 flat circles and 1 curved surface', eq: ['2 flat, 1 curved', 'it rolls'] },
        together: [CN('cone', ['f', 'c']), CN('cylinder', ['f', 'c'])],
        cue: 'Find the flat faces first. The part that rolls is the curved surface.',
        own: [CN('sphere', ['f', 'c']), CN('cone', ['c', 'p'])]
      },
      p1: {
        show: { pic: SO('cone'), cap: '1 flat circle, 1 curved surface, 1 point', eq: ['1 flat, 1 curved'] },
        items: [CN('cylinder', ['f']), CN('cone', ['f']), CN('sphere', ['c']), CN('cylinder', ['p']), CN('cone', ['p']), CN('sphere', ['f'])]
      },
      p2: {
        items: [CL('Circle the object with a point.', ['cylinder', 'cone', 'sphere', 'cube'], { c: 1, p: 1 }, 1), CL('Circle the object with 2 flat faces.', ['cone', 'sphere', 'cylinder', 'tpyr'], { f: 2 }, 2),
          TF('a cylinder can roll.', { s: 'cylinder', roll: 1 }, true), TF('a cube can roll.', { s: 'cube', roll: 1 }, false),
          TF('a sphere has 1 flat face.', { s: 'sphere', f: 1 }, false), TF('a cone has 1 curved surface.', { s: 'cone', c: 1 }, true)]
      },
      p3: {
        items: [ALL(['cylinder', 'cone'], 'f'), ALL(['cone', 'sphere', 'cylinder'], 'c'),
          CL('Circle the object with no flat faces.', ['cone', 'cylinder', 'sphere', 'tri'], { f: 0 }, 2),
          { q: 'Which objects can roll AND stack? Why?', lines: { n: 2, key: 'A cylinder: it has a curved surface to roll and flat faces to stack.' } },
          { q: 'Name something at home shaped like a cone.', lines: { n: 1, key: 'For example: an ice cream cone or a pylon.' } }]
      },
      think: {
        items: [{ q: '{b} says a cylinder has 3 flat faces. Is {b} right?', lines: { n: 2, key: 'No. It has 2 flat faces. The side is curved, not flat.' } },
          { q: 'How is a cone like a pyramid? How is it different?', lines: { n: 3, key: 'Both have one base and a point. A cone has a curved surface; a pyramid has flat triangles.' } },
          { q: 'Why do balls roll in every direction?', lines: { n: 2, key: 'A sphere is curved all over, with no flat faces.' } },
          { q: 'Draw a cylinder. Shade its flat faces.', draw: { h: 80, key: 'A cylinder with its top and bottom circles shaded.' } }]
      }
    },

    which: {
      watch: 'stopping at the first clue that fits. Test every part of the clue, then name the look-alike that does not fit.',
      goal: 'I can find an object from clues.',
      learn: {
        show: { pic: ['solids', { list: ['cube', 'prism'], letters: true, s: 40 }], cap: '6 faces: only A has all squares', eq: ['A: cube'] },
        together: [CL('I have 5 flat faces and a point.', ['tri', 'pyramid', 'cube', 'cone'], { f: 5, p: 1 }, 1), CL('I have a curved surface and no point.', ['cone', 'sphere', 'cube', 'tri'], { c: 1, p: 0, f: 0 }, 1)],
        cue: 'Test every part of the clue. Cross out each object that does not fit.',
        own: [CL('I have 4 flat faces.', ['tpyr', 'tri', 'cube', 'cone'], { f: 4 }, 0), CL('I have 2 flat faces and roll.', ['cone', 'cube', 'sphere', 'cylinder'], { f: 2, roll: 1 }, 3)]
      },
      p1: {
        show: { pic: ['solids', { list: ['cylinder', 'cone'], letters: true, s: 56 }], cap: 'A curved surface and a point', eq: ['B: cone'] },
        items: [CL('I have 6 flat faces, all squares.', ['prism', 'cube', 'tri', 'pyramid'], { sqonly: 1 }, 1), CL('I have 5 flat faces and no point.', ['pyramid', 'tpyr', 'tri', 'cube'], { f: 5, p: 0 }, 2),
          CL('I have 8 vertices and some rectangles.', ['cube', 'prism', 'tri', 'pyramid'], { v: 8, sq: 0 }, 1), CL('I have 1 flat face and 1 point.', ['cylinder', 'sphere', 'cone', 'pyramid'], { f: 1, p: 1 }, 2)]
      },
      p2: {
        items: [CL('I have 6 edges.', ['tri', 'pyramid', 'tpyr', 'cube'], { e: 6 }, 2), CL('I have 9 edges.', ['cube', 'tri', 'pyramid', 'tpyr'], { e: 9 }, 1),
          CL('I am a pyramid with 5 vertices.', ['tpyr', 'tri', 'pyramid', 'cone'], { kind: 'pyramid', v: 5 }, 2), CL('I have no flat faces.', ['cone', 'cylinder', 'cube', 'sphere'], { f: 0 }, 3)]
      },
      p3: {
        items: [CL('I am a prism with 6 vertices.', ['cube', 'tri', 'prism', 'tpyr'], { kind: 'prism', v: 6 }, 1), CL('I have 12 edges. All my faces are squares.', ['prism', 'tri', 'cube', 'pyramid'], { e: 12, sqonly: 1 }, 2),
          { q: 'Write a clue for a cone that no other object fits.', lines: { n: 2, key: 'For example: I have 1 flat face, a curved surface and a point.' } },
          { q: 'Write a clue for a cube that a rectangular prism does not fit.', lines: { n: 2, key: 'For example: all 6 of my faces are squares.' } }]
      },
      think: {
        items: [{ q: '{a} reads "5 flat faces" and says triangular prism. What should {a} check?', lines: { n: 3, key: 'The rest of the clue: a square-based pyramid also has 5 faces. Does it have a point?' } },
          { q: 'Why is "I have flat faces" a weak clue?', lines: { n: 2, key: 'Many objects fit it.' } },
          { q: 'Write 2 clues that only fit a triangular pyramid.', lines: { n: 2, key: 'For example: I have 4 flat faces. All my faces are triangles.' } },
          { q: 'Play: think of an object. A grown-up asks yes or no questions. Write their questions.', lines: { n: 3, key: 'For example: Can it roll? Does it have a point?' } }]
      }
    },

    apart: {
      watch: 'naming the whole structure as one object. Lift the top off and name each part.',
      goal: 'I can take a structure apart into objects.',
      learn: {
        show: { pic: ['stack', { list: ['tri', 'cube'], s: 32 }], cap: 'A triangular prism on a cube', eq: ['5 + 6 = 11 faces'] },
        together: [ST(['cone', 'cylinder'], 'f'), SP(['cone', 'cube'], 0, ['cone', 'cube', 'sphere'])],
        cue: 'Lift off each part from the top down. Name it, then count.',
        own: [ST(['pyramid', 'cube'], 'f'), SP(['cone', 'cylinder'], 0, ['cone', 'cube', 'cylinder'])]
      },
      p1: {
        show: { pic: ['stack', { list: ['cone', 'cylinder'], s: 32 }], cap: 'A silo: a cone on a cylinder', eq: ['2 objects'] },
        items: [SP(['cone', 'cylinder'], 1, ['cube', 'cylinder', 'cone']), SP(['tri', 'cube'], 1, ['cube', 'sphere', 'cone']), ST(['tri', 'cube'], 'e'), ST(['cone', 'cube'], 'f')]
      },
      p2: {
        items: [ST(['tri', 'cube'], 'f'), ST(['pyramid', 'cube', 'cube'], 'f'), ST(['tri', 'prism'], 'e'), ST(['tpyr', 'cube'], 'v')]
      },
      p3: {
        items: [ST(['cone', 'cylinder', 'cylinder'], 'f'), ST(['pyramid', 'prism'], 'v'),
          { q: 'Build a tower from a cube and a square-based pyramid. How many flat faces do the two objects have?', eq: ['[] flat faces'], a: [11], solid: ['pyramid', 'cube'] },
          { q: 'Draw a structure made of 3 objects. Name them.', draw: { h: 90, key: 'For example: a cone on a cylinder on a cube.' } }]
      },
      think: {
        items: [{ q: 'Look at a building near you. Which objects is it made of?', lines: { n: 3, key: 'For example: a rectangular prism with a triangular prism roof.' } },
          { q: 'From the front, a house looks like a square and a triangle. Why?', lines: { n: 2, key: 'The front face of the cube is a square; the end of the roof is a triangle.' } },
          { q: '{b} says the silo is a cylinder. What is missing?', lines: { n: 2, key: 'The cone on top. A silo is a cone on a cylinder.' } },
          { q: 'Why do builders put a prism or pyramid on top of a house?', lines: { n: 2, key: 'A sloped roof lets rain and snow slide off.' } }]
      }
    },

    cfaces: {
      watch: 'calling a turned face "different", or calling any two rectangles congruent. Compare the side lengths, short then long.',
      goal: 'I can tell if two faces are congruent.',
      learn: {
        show: { cap: 'A is 4 cm by 2 cm. B is A turned: 2 cm by 4 cm.', eq: ['congruent'] },
        together: [CF([3, 2], [2, 3]), CF([4, 3], [4, 2])],
        cue: 'List each face short side then long side. Same lists: congruent.',
        own: [CF([5, 2], [2, 5]), CF([3, 3], [3, 4])]
      },
      p1: {
        show: { pic: FC([5, 3], [5, 2]), cap: '3 cm and 2 cm do not match', eq: ['not congruent'] },
        items: [CF([4, 4], [4, 4]), CF([5, 2], [5, 3]), CF([2, 3], [3, 2]), CF([4, 2], [2, 3])]
      },
      p2: {
        items: [CF([5, 4], [4, 5]), CM([4, 2], [2, '?']), CM([5, 3], [3, '?']), CF([3, 1], [1, 4])]
      },
      p3: {
        items: [CM([5, 2], [2, '?']), CF([4, 3], [3, 4]),
          { q: 'Which face is congruent to a 3 cm by 5 cm face?', pick: { opts: ['5 by 3', '3 by 4', '5 by 4'], ans: 0, same: [3, 5], dims: [[5, 3], [3, 4], [5, 4]] }, wide: true },
          { q: 'Which face is congruent to a 2 cm by 4 cm face?', pick: { opts: ['2 by 2', '4 by 2', '4 by 4'], ans: 1, same: [2, 4], dims: [[2, 2], [4, 2], [4, 4]] }, wide: true }]
      },
      think: {
        items: [{ q: 'Are all squares congruent? Explain.', lines: { n: 2, key: 'No. A 2 cm square and a 3 cm square are not the same size.' } },
          { q: 'How can you check with paper that two faces are congruent?', lines: { n: 2, key: 'Trace one, cut it out and lay it on the other. Every side must match.' } },
          { q: '{a} says B is different because it is turned. Is {a} right?', lines: { n: 2, key: 'No. Turning does not change the sides. It is still congruent.' } },
          { q: 'Draw two congruent rectangles, one turned.', draw: { h: 80, key: 'For example: 4 by 2 and 2 by 4.' } }]
      }
    },

    cboxes: {
      watch: 'thinking boxes with the same number of cubes are congruent. Sort the three lengths and compare.',
      goal: 'I can tell if two boxes are congruent.',
      learn: {
        show: { pic: ['row', { list: [BX([3, 2, 2]), BX([2, 2, 3])], labels: ['A', 'B'], gap: 20 }], cap: 'A on its side: 2, 2, 3 and 2, 2, 3', eq: ['congruent'] },
        together: [CB([3, 2, 2], [3, 2, 1]), CB([4, 2, 1], [1, 2, 4])],
        cue: 'Write each box\'s lengths from shortest to longest. Same lists: congruent.',
        own: [CB([2, 2, 2], [2, 2, 2]), CB([4, 1, 2], [3, 1, 2])]
      },
      p1: {
        show: { cap: 'A: 2 by 3 by 4. B: 1 by 4 by 6. Both 24 cubes.', eq: ['2, 3, 4 and 1, 4, 6', 'not congruent'] },
        items: [CB([3, 1, 2], [2, 1, 3]), CB([4, 2, 2], [4, 2, 1]), CBS([2, 3, 4], [4, 3, 2]), CBS([2, 2, 5], [2, 5, 3])]
      },
      p2: {
        items: [CBS([1, 4, 6], [2, 3, 4]), CBS([3, 3, 2], [2, 3, 3]), CB([2, 3, 1], [3, 1, 2]), CB([4, 2, 1], [4, 2, 2]),
          { q: 'Make B congruent to A. A is 2 by 3 by 4. B is 4 by 2 by ?', eq: ['? = [] cubes'], a: [3], cong: { a: [2, 3, 4], b: [4, 2, '?'] } },
          { q: 'Make B congruent to A. A is 5 by 1 by 2. B is 1 by ? by 5', eq: ['? = [] cubes'], a: [2], cong: { a: [5, 1, 2], b: [1, '?', 5] } }]
      },
      p3: {
        items: [CB([4, 2, 3], [3, 2, 4]),
          { q: 'Which box is congruent to a 2 by 2 by 4 box?', pick: { opts: ['4 by 2 by 2', '2 by 4 by 4', '2 by 2 by 2'], ans: 0, same: [2, 2, 4], dims: [[4, 2, 2], [2, 4, 4], [2, 2, 2]] }, wide: true },
          { q: 'Make B congruent to A. A is 6 by 1 by 3. B is 3 by ? by 1', eq: ['? = [] cubes'], a: [6], cong: { a: [6, 1, 3], b: [3, '?', 1] } },
          { q: 'Two boxes both use 12 cubes. Must they be congruent? Explain.', lines: { n: 2, key: 'No. 2 by 2 by 3 and 1 by 2 by 6 both use 12 cubes but are different shapes.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why does turning a box not change if it is congruent?', lines: { n: 2, key: 'Its three lengths stay the same; only the way it sits changes.' } },
          { q: 'Find two congruent boxes at home. How do you know?', lines: { n: 2, key: 'For example: two cereal boxes of the same kind. Their lengths match.' } },
          { q: '{b} says 1 by 2 by 6 and 2 by 3 by 2 are congruent: both use 12 cubes. Is {b} right?', lines: { n: 2, key: 'No. The lengths are different, so the shapes are different.' } },
          { q: 'Draw a box congruent to a 1 by 2 by 3 box, standing a new way.', draw: { h: 80, key: 'For example: 3 tall, 2 long, 1 deep.' } }]
      }
    },

    turns: {
      watch: 'turning as if still facing north after an earlier turn. Stand up and turn your body for each step.',
      goal: 'I can make quarter and half turns.',
      learn: {
        show: { pic: ['compass', { face: 'north' }], cap: 'A quarter turn right: east', eq: ['north → east'] },
        together: [TU('north', 'quarter turn right'), TU('east', 'half turn')],
        cue: 'Point the way you face. Turn your hand: right goes clockwise.',
        own: [TU('north', 'quarter turn left'), TU('west', 'half turn')]
      },
      p1: {
        show: { pic: ['compass', { face: 'east' }], cap: 'East, a quarter turn left', eq: ['north'] },
        items: [TU('north', 'half turn'), TU('south', 'quarter turn left'), TU('west', 'quarter turn right'), TU('east', 'quarter turn right')]
      },
      p2: {
        items: [TU('north', 'quarter turn right, quarter turn right'), TU('west', 'quarter turn left, half turn'),
          TT('north', 'west', ['quarter turn right', 'quarter turn left', 'half turn']), TT('east', 'west', ['quarter turn right', 'quarter turn left', 'half turn'])]
      },
      p3: {
        items: [TU('south', 'half turn, quarter turn right'), TU('east', 'quarter turn left, quarter turn left, quarter turn left'),
          TT('south', 'east', ['quarter turn right', 'quarter turn left', 'half turn']), QT('east', 'north', 'right'),
          { q: 'How many quarter turns make a full turn?', eq: ['[] quarter turns'], a: [4], turnTo: { from: 'north', to: 'north', dir: 'right' } }]
      },
      think: {
        items: [{ q: 'Why is a half turn the same as 2 quarter turns?', lines: { n: 2, key: 'Each quarter turn goes a quarter of the way round; 2 make half.' } },
          { q: '{a} faces east and turns right. {a} says "now I face south". Is {a} right?', lines: { n: 2, key: 'Yes. A quarter turn right from east is south.' } },
          { q: 'Three quarter turns right is the same as one quarter turn which way?', lines: { n: 2, key: 'Left.' } },
          { q: 'Where do you see quarter turns in your day?', lines: { n: 2, key: 'For example: turning a corner on the way to school.' } }]
      }
    },

    map: {
      watch: 'counting the starting square as the first step, or turning the wrong way when facing east or south. Turn the page so the arrow points up.',
      goal: 'I can follow directions on a map.',
      learn: {
        show: { cap: 'A1, facing north: forward 3, quarter turn right, forward 2', eq: ['at C4'] },
        together: [WK('A1', 'north', 'forward 2, quarter turn right, forward 3', ['at']), WK('B1', 'east', 'forward 3, quarter turn left, forward 2', ['at'])],
        cue: 'Do not count the square you start on. Turn the page so the arrow points up before each turn.',
        own: [WK('A2', 'east', 'forward 4, quarter turn left, forward 2', ['at']), WK('F5', 'south', 'forward 3, quarter turn right, forward 2', ['at'])]
      },
      p1: {
        show: { pic: MP('B1', 'north', 'forward 3'), cap: 'B1, forward 3', eq: ['at B4'] },
        items: [WK('A1', 'north', 'forward 4', ['at']), WK('A3', 'east', 'forward 5', ['at']), WK('C1', 'north', 'forward 2, quarter turn right, forward 1', ['at']), WK('D5', 'south', 'forward 4', ['at'])]
      },
      p2: {
        items: [WP('A1', 'east', 'forward 3, quarter turn left, forward 3', [[3, 1, 'X'], [2, 1, 'Y'], [3, 2, 'Z']]), WK('E1', 'north', 'forward 3, quarter turn left, forward 4', ['at', 'far']),
          WK('A5', 'east', 'forward 2, quarter turn right, forward 3', ['at']), WP('F1', 'west', 'forward 4, quarter turn right, forward 2', [[2, 2, 'X'], [1, 2, 'Y'], [2, 4, 'Z']])]
      },
      p3: {
        items: [WK('A1', 'north', 'forward 2, quarter turn right, forward 2, quarter turn left, forward 2', ['at']), WK('F5', 'west', 'forward 3, half turn, forward 1', ['at', 'face']),
          WK('C3', 'south', 'forward 2, quarter turn left, forward 3', ['at', 'face']), WP('B2', 'north', 'forward 2, quarter turn right, forward 3, quarter turn right, forward 1', [[4, 1, 'X'], [4, 2, 'Y'], [3, 2, 'Z']])]
      },
      think: {
        items: [{ q: '{b} starts at A1 and says "forward 3" ends at A3. What went wrong?', lines: { n: 2, key: '{b} counted A1 as a step. Forward 3 from A1 ends at A4.' } },
          { q: 'Why does the way you face matter before "forward"?', lines: { n: 2, key: 'Forward goes the way you face, so the same steps can end in different places.' } },
          { q: 'Make a map of your room on grid paper. Mark the door and your bed.', draw: { h: 100, key: 'A grid with the door and bed marked.' } },
          { q: 'Write directions on your map from the door to your bed.', lines: { n: 2, key: 'For example: forward 3, quarter turn left, forward 2.' } }]
      }
    },

    give: {
      watch: 'giving a turn without its direction, or mixing up across and up. Read the directions aloud while someone walks them.',
      goal: 'I can give directions on a map.',
      learn: {
        show: { cap: 'B1 to E4, facing north: forward 3, quarter turn right, forward 3' },
        together: [GF('A1', 'north', 'forward [], quarter turn right, forward []', [2, 3], 12), GF('A1', 'east', 'forward []', [4], 12)],
        cue: 'Count the rows to go up or down, then the columns to go across. Say which way to turn.',
        own: [GF('B2', 'north', 'forward []', [3], 12), GF('F5', 'west', 'forward []', [4], 12)]
      },
      p1: {
        show: { cap: 'A2, facing east, to E2: across 4', eq: ['forward 4'] },
        items: [GF('A1', 'north', 'forward []', [4]), GF('A3', 'east', 'forward []', [5]), GF('C1', 'north', 'forward [], quarter turn right, forward []', [2, 2]), GF('F2', 'west', 'forward []', [3])]
      },
      p2: {
        items: [GV('A1', 'north', 'forward 3, quarter turn right, forward 4'), GV('B5', 'south', 'forward 4, quarter turn left, forward 3'),
          GF('E5', 'south', 'forward [], quarter turn right, forward []', [2, 3]), GF('A5', 'east', 'forward []', [5])]
      },
      p3: {
        items: [GV('F1', 'west', 'forward 5, quarter turn right, forward 4'), GV('C3', 'north', 'forward 2, quarter turn left, forward 2'),
          { q: 'A walk goes forward 3, quarter turn right, forward 2. Write the walk back.', lines: { n: 2, key: 'Half turn, forward 2, quarter turn left, forward 3.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} wrote "forward 2, turn, forward 3". What is missing?', lines: { n: 2, key: 'Which way to turn: quarter turn right or left.' } },
          { q: 'Find two different ways from A1 to C3.', lines: { n: 3, key: 'Forward 2, quarter turn right, forward 2; or face east: forward 2, quarter turn left, forward 2.' } },
          { q: 'Which way is shortest from A1 to D4? How do you know?', lines: { n: 2, key: 'Any way with only 3 up and 3 across: 6 squares. Going back wastes steps.' } },
          { q: 'Give a grown-up directions from your door to the kitchen.', lines: { n: 3, key: 'For example: forward 5 steps, quarter turn left, forward 3 steps.' } }]
      }
    }
  } });
})();
