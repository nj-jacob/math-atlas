/* Grade 2 Maps and Code: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the
   lessons in chapters/maps-code.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Walks: "forward 3", "quarter turn right", "half turn", from a square (columns A, B, C ..., rows 1, 2, 3 ... from the bottom).
   Robot code: "move 3", "turn right", "turn left", from a start square and facing.
   Ontario 2020: E1.4 create and interpret simple maps, with a legend, and describe routes; E1.5 describe the relative
   positions of objects (left, right, above, below, between); C3.1 code with sequential and concurrent events; C3.2 read and
   alter code, and fix it (debug).
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* where things are: marks on a plain grid, [column, row, letter] */
  var MA = [[0, 1, 'A'], [2, 1, 'B'], [4, 1, 'C'], [2, 0, 'D'], [2, 2, 'E']], MB = [[1, 0, 'P'], [1, 2, 'Q'], [3, 2, 'R'], [1, 1, 'S'], [0, 2, 'T']];
  function spot(marks) { return ['map', { cols: 5, rows: 3, u: 20, marks: marks }]; }
  /* which mark is left of, right of, above, below or between the marks named */
  function WH(marks, rel, ref, opts) {
    var ok = opts.filter(function (o) { var a = marks.filter(function (m) { return m[2] === o; })[0], b = marks.filter(function (m) { return m[2] === ref[0]; })[0], c = ref[1] && marks.filter(function (m) { return m[2] === ref[1]; })[0];
      if (rel === 'left of') return a[1] === b[1] && a[0] < b[0]; if (rel === 'right of') return a[1] === b[1] && a[0] > b[0];
      if (rel === 'above') return a[0] === b[0] && a[1] < b[1]; if (rel === 'below') return a[0] === b[0] && a[1] > b[1];
      return (a[1] === b[1] && b[1] === c[1] && (a[0] - b[0]) * (a[0] - c[0]) < 0) || (a[0] === b[0] && b[0] === c[0] && (a[1] - b[1]) * (a[1] - c[1]) < 0); });
    return { q: 'What is ' + rel + ' ' + ref.join(' and ') + '?', pic: spot(marks), pick: { opts: opts, ans: opts.indexOf(ok[0]), where: { rel: rel, ref: ref } } };
  }
  /* a map with a legend: columns A to E, rows 1 to 4 from the bottom */
  var LG = 'H home, S school, P park, L library', ML = [[0, 3, 'H'], [3, 0, 'S'], [4, 2, 'P'], [1, 1, 'L']];
  var LG2 = 'R rink, F farm, T trail, B beach', MM = [[2, 3, 'R'], [0, 0, 'F'], [4, 1, 'T'], [1, 2, 'B']];
  function legend(marks) { return ['map', { cols: 5, rows: 4, u: 18, grid: true, marks: marks }]; }
  function AT(marks, cell) { var o = marks.map(function (m) { return m[2]; }); var hit = marks.filter(function (m) { return 'ABCDE'[m[0]] + (4 - m[1]) === cell; })[0]; return { q: 'What is at ' + cell + '?', pic: legend(marks), pick: { opts: o, ans: o.indexOf(hit[2]), at: cell } }; }
  /* where is a place? its square */
  function FD(marks, label, word) { var k = marks.filter(function (m) { return m[2] === label; })[0]; return { q: 'Where is the ' + word + '?', pic: legend(marks), eq: ['at []'], a: ['ABCDE'[k[0]] + (4 - k[1])], find: label }; }

  /* walking on a map: 6 columns (A to F) and 5 rows (1 to 5 from the bottom) */
  var DN = ['north', 'east', 'south', 'west'], AR = ['^', '>', 'v', '<'], COLS = 6, ROWS = 5;
  function TB(t) { return /half/.test(t) ? 2 : /right/.test(t) ? 1 : 3; }
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
  function MP(st, face, code, marks) { var p = at(st); return ['map', { cols: COLS, rows: ROWS, u: 15, grid: true, marks: marks || [], start: [p[0], p[1], AR[DN.indexOf(face)]], path: code ? sim(st, face, code).pts : null }]; }
  /* follow a walk: where you end, and how far */
  function WK(st, face, code, far) {
    var r = sim(st, face, code), eq = ['at []'], a = [r.cell];
    if (far) { eq.push('[] squares'); a.push(r.n); }
    return { q: st + ', facing ' + face + ': ' + code + '.', pic: MP(st, face, code), eq: eq, a: a, walk: code };
  }
  /* circle the lettered place where the walk ends */
  function WP(st, face, code, marks) {
    var r = sim(st, face, code), opts = marks.map(function (m) { return m[2]; }), hit = marks.filter(function (m) { return nm(m[0], m[1]) === r.cell; })[0];
    return { q: st + ', facing ' + face + ': ' + code + '.', pic: MP(st, face, code, marks), pick: { opts: opts, ans: opts.indexOf(hit[2]) }, walk: code };
  }
  /* fill in the numbers of the directions to reach a square */
  function GF(st, face, tmpl, nums) {
    var k = 0, code = tmpl.replace(/\[\]/g, function () { return nums[k++]; }), r = sim(st, face, code);
    return { q: st + ', facing ' + face + '. Get to ' + r.cell + '.', pic: MP(st, face, code), eq: tmpl.split(', '), a: nums, walk: true, to: r.cell };
  }
  function GV(st, face, code) { var r = sim(st, face, code); return { q: 'Write directions from ' + st + ', facing ' + face + ', to ' + r.cell + '.', pic: MP(st, face, code), lines: { n: 2, key: code }, give: r.cell }; }

  /* robots: a map with marks A, B, C; run code to find the squares it passes (for the key) */
  function run(start, code) {
    var D = ['>', 'v', '<', '^'], st = { '>': [1, 0], 'v': [0, 1], '<': [-1, 0], '^': [0, -1] }, x = start[0], y = start[1], d = D.indexOf(start[2]), path = [[x, y]];
    code.split(',').forEach(function (c) {
      c = c.trim();
      var mv = c.match(/^move (\d+)$/);
      if (mv) for (var j = 0; j < +mv[1]; j++) { x += st[D[d]][0]; y += st[D[d]][1]; path.push([x, y]); }
      else if (c === 'turn right') d = (d + 1) % 4; else if (c === 'turn left') d = (d + 3) % 4;
    });
    return path;
  }
  function map(start, marks, code) { return ['map', { cols: 7, rows: 5, u: 15, marks: marks, start: start, path: code ? run(start, code) : null }]; }
  /* where does the robot stop? */
  function GO(start, marks, code) {
    var opts = marks.map(function (m) { return m[2]; });
    var p = run(start, code), end = p[p.length - 1], hit = marks.filter(function (m) { return m[0] === end[0] && m[1] === end[1]; })[0];
    return { q: 'Run: ' + code + '.', pic: map(start, marks, code), robot: { code: code }, pick: { opts: opts, ans: opts.indexOf(hit[2]) } };
  }
  /* fill in the numbers so the robot reaches a mark: one row per step, each turn kept beside the move after it */
  function FILL(start, marks, tmpl, nums, to, q) {
    var k = 0, code = tmpl.replace(/\[\]/g, function () { return nums[k++]; }), seg = tmpl.split(', '), rows = [];
    for (var i = 0; i < seg.length; i++) rows.push(/^turn/.test(seg[i]) && seg[i + 1] ? seg[i] + ', ' + seg[++i] : seg[i]);
    return { q: q || 'Fill in the numbers to reach ' + to + '.', pic: map(start, marks, code), robot: { to: to }, eq: rows, a: nums };
  }
  var M1 = [[4, 0, 'A'], [6, 2, 'B'], [2, 4, 'C']], M2 = [[3, 1, 'A'], [6, 4, 'B'], [0, 0, 'C']], M3 = [[5, 0, 'A'], [1, 1, 'B'], [4, 4, 'C']];
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }

  S.register('maps-code', { code: 'MC', ideas: {

    leftright: {
      watch: 'mixing up left and right. Use your own hands: the left hand makes an L.',
      goal: 'I can say what is left of, right of and between.',
      learn: {
        show: { pic: spot(MA), cap: 'A is left of B. C is right of B.', eq: ['B is between A and C'] },
        together: [WH(MA, 'left of', ['B'], ['A', 'C', 'D']), WH(MA, 'between', ['A', 'C'], ['B', 'D', 'E'])],
        cue: 'Look along the same row. Left is the side of your left hand.',
        own: [WH(MA, 'right of', ['B'], ['A', 'C', 'E']), WH(MB, 'left of', ['Q'], ['T', 'R', 'S'])]
      },
      p1: {
        show: { pic: spot(MB), cap: 'T, Q and R are in one row', eq: ['Q is between T and R'] },
        items: [WH(MB, 'right of', ['Q'], ['T', 'R', 'P']), WH(MB, 'between', ['T', 'R'], ['Q', 'S', 'P']), WH(MA, 'left of', ['C'], ['B', 'D', 'E']), WH(MB, 'left of', ['R'], ['Q', 'P', 'S'])]
      },
      p2: {
        items: [WH(MA, 'right of', ['A'], ['B', 'D', 'E']), WH(MB, 'right of', ['T'], ['Q', 'S', 'P']),
          { q: 'Draw a ball left of the box and a cup right of it.', draw: { h: 50, key: 'ball, box, cup in a row, left to right.' }, wide: true },
          { q: 'You face {a}. {a} raises a right hand. Is it on your left or your right?', lines: { n: 1, key: 'On your left: {a} faces the other way.' }, wide: true }]
      },
      p3: {
        items: [WH(MA, 'between', ['A', 'C'], ['B', 'E', 'D']), WH(MB, 'between', ['T', 'R'], ['S', 'Q', 'P']),
          { q: 'At your table, who sits on your left? On your right?', lines: { n: 2, key: 'Answers will vary. Check the child uses left and right correctly.' }, wide: true },
          { q: 'Write where your bed is in your room. Use left, right or between.', lines: { n: 2, key: 'For example: my bed is between the window and the door.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says the door is on the left. {a}, facing {b}, says it is on the right. Can both be right?', lines: { n: 2, key: 'Yes. Left and right depend on which way you face.' } },
          { q: 'How can you remember which hand is left?', lines: { n: 2, key: 'Hold up both hands: the left thumb and finger make an L.' } },
          { q: 'Draw 3 things in a row. Write one sentence with "between".', draw: { h: 50, key: 'For example: a cat between a dog and a bird.' } },
          { q: 'Why do we say "on your left" when giving directions?', lines: { n: 2, key: 'So the listener knows which way to go from where they stand.' } }]
      }
    },

    abovebelow: {
      watch: 'saying "beside" when something is above. Look up and down the same column.',
      goal: 'I can say what is above, below and between.',
      learn: {
        show: { pic: spot(MA), cap: 'D is above B. E is below B.', eq: ['B is between D and E'] },
        together: [WH(MA, 'above', ['B'], ['D', 'A', 'C']), WH(MA, 'below', ['B'], ['A', 'E', 'D'])],
        cue: 'Look up and down the same column.',
        own: [WH(MB, 'above', ['S'], ['P', 'Q', 'R']), WH(MB, 'below', ['S'], ['P', 'Q', 'T'])]
      },
      p1: {
        show: { pic: spot(MB), cap: 'P, S and Q are in one column', eq: ['S is between P and Q'] },
        items: [WH(MB, 'between', ['P', 'Q'], ['S', 'T', 'R']), WH(MA, 'between', ['D', 'E'], ['B', 'A', 'C']), WH(MA, 'above', ['E'], ['B', 'A', 'C']), WH(MB, 'below', ['P'], ['S', 'R', 'T'])]
      },
      p2: {
        items: [WH(MA, 'below', ['D'], ['B', 'C', 'A']), WH(MB, 'above', ['Q'], ['S', 'R', 'T']),
          { q: 'Draw a bird above a tree and a rock below it.', draw: { h: 70, key: 'bird at the top, tree in the middle, rock at the bottom.' }, wide: true },
          { q: 'What is above your head right now? What is below your feet?', lines: { n: 2, key: 'For example: the ceiling above, the floor below.' }, wide: true }]
      },
      p3: {
        items: [WH(MA, 'between', ['D', 'E'], ['A', 'B', 'C']), WH(MB, 'between', ['P', 'Q'], ['R', 'T', 'S']),
          { q: 'On a bookshelf, the red book is above the blue book and below the green book. Which is in the middle?', lines: { n: 1, key: 'The red book.' }, wide: true },
          { q: 'Describe where 3 things are on a shelf. Use above, below or between.', lines: { n: 2, key: 'For example: the cup is between the plate and the bowl.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says the cat is below the table and also under it. Are these the same?', lines: { n: 2, key: 'Yes. Below and under mean the same here.' } },
          { q: 'Draw a stack of 3 blocks. Label the one between the others.', draw: { h: 70, key: 'The middle block is between the top and bottom ones.' } },
          { q: 'Can one thing be above and below at the same time? How?', lines: { n: 2, key: 'Yes: above one thing and below another, like the middle shelf.' } },
          { q: 'Give a friend clues to find a hidden book using above, below and between.', lines: { n: 2, key: 'For example: it is below the clock and between two plants.' } }]
      }
    },

    legend: {
      watch: 'guessing what a symbol means. Read the legend first.',
      goal: 'I can read a map with a legend.',
      learn: {
        show: { cap: 'Legend: ' + LG, eq: ['The school is at D4'] },
        together: [AT(ML, 'A1'), AT(ML, 'E2')],
        cue: 'Read the legend. Go across to the column, then up to the row.',
        own: [AT(ML, 'D4'), FD(ML, 'L', 'library')]
      },
      p1: {
        show: { cap: 'Legend: ' + LG2, eq: ['The rink is at C1'] },
        items: [AT(MM, 'A4'), AT(MM, 'E3'), AT(MM, 'B2'), FD(MM, 'T', 'trail')]
      },
      p2: {
        show: { cap: 'Legend: ' + LG, eq: ['B3: column B, row 3'] },
        items: [FD(ML, 'P', 'park'), FD(ML, 'H', 'home'), AT(ML, 'B3'), AT(ML, 'D4')]
      },
      p3: {
        show: { cap: 'Legend: ' + LG2, eq: ['The farm is at A4'] },
        items: [FD(MM, 'R', 'rink'), FD(MM, 'B', 'beach'),
          { q: 'Draw a map of a park with a legend: a tree, a bench and a pond.', draw: { h: 110, key: 'A map with 3 symbols and a legend that names each one.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why does a map need a legend?', lines: { n: 2, key: 'To tell what each symbol means.' } },
          { q: '{b} used the same symbol for the school and the library. What is the problem?', lines: { n: 2, key: 'You cannot tell them apart. Each place needs its own symbol.' } },
          { q: 'Draw a symbol for a hospital and one for a rink.', draw: { h: 60, key: 'For example: a cross for a hospital, crossed sticks for a rink.' } },
          { q: 'How is a map like a picture taken from above?', lines: { n: 2, key: 'It shows where things are, as if you look down on them.' } }]
      }
    },

    directions: {
      watch: 'turning the map instead of the robot. Turn your body the way you face, then step.',
      goal: 'I can follow and give directions on a map.',
      learn: {
        show: { cap: 'A1, facing north: forward 2, quarter turn right, forward 3', eq: ['You end at D3'] },
        together: [WK('A1', 'north', 'forward 3'), WK('B1', 'east', 'forward 3, quarter turn left, forward 2')],
        cue: 'Point your finger the way you face. Count each square as you step.',
        own: [WK('A2', 'east', 'forward 4'), WK('F5', 'south', 'forward 3, quarter turn right, forward 2')]
      },
      p1: {
        show: { cap: 'A quarter turn right: north becomes east', eq: ['north, east, south, west'] },
        items: [WK('A1', 'north', 'forward 4'), WK('A3', 'east', 'forward 5'), WK('C1', 'north', 'forward 2, quarter turn right, forward 1'), WK('D5', 'south', 'forward 4')]
      },
      p2: {
        items: [WP('A1', 'east', 'forward 3, quarter turn left, forward 3', [[3, 1, 'X'], [2, 1, 'Y'], [3, 2, 'Z']]), WK('E1', 'north', 'forward 3, quarter turn left, forward 4', true),
          WK('A5', 'east', 'forward 2, quarter turn right, forward 3'), WP('F1', 'west', 'forward 4, quarter turn right, forward 2', [[2, 2, 'X'], [1, 2, 'Y'], [2, 4, 'Z']])]
      },
      p3: {
        items: [GF('A1', 'north', 'forward [], quarter turn right, forward []', [2, 3]), GF('A1', 'east', 'forward []', [4]),
          GV('B1', 'north', 'forward 3, quarter turn right, forward 2'), GV('E5', 'south', 'forward 2, quarter turn right, forward 3')]
      },
      think: {
        items: [{ q: '{a} turned right but went left on the map. What went wrong?', lines: { n: 2, key: '{a} was facing south: a right turn then points west, which is left on the map.' } },
          { q: 'Write directions from your bed to the door.', lines: { n: 3, key: 'For example: forward 3 steps, quarter turn left, forward 2 steps.' } },
          { q: 'Why do directions need both "forward" and "turn"?', lines: { n: 2, key: 'Forward says how far; turn says which way.' } },
          { q: 'Find two different routes from A1 to C3.', lines: { n: 2, key: 'For example: forward 2 then right 2, or right 2 then forward 2.' } }]
      }
    },

    order: {
      watch: 'doing the steps out of order. Code runs one line at a time, from the top.',
      goal: 'I can follow code in order.',
      learn: {
        show: { pic: map([0, 4, '>'], [[3, 2, 'A']], 'move 3, turn left, move 2'), cap: 'move 3, turn left, move 2', eq: ['It stops at A'] },
        together: [GO([0, 2, '>'], M1, 'move 4, turn left, move 2'), GO([0, 2, '>'], M1, 'move 2, turn right, move 2')],
        cue: 'Point your finger the way the robot faces. Do each line in order.',
        own: [GO([0, 0, '>'], M2, 'move 3, turn right, move 1'), GO([0, 4, '>'], M3, 'move 1, turn left, move 3')]
      },
      p1: {
        show: { pic: map([0, 2, '>'], [[4, 2, 'A']], 'move 4'), cap: 'move 4', eq: ['It stops at A'] },
        items: [GO([0, 2, '>'], M1, 'move 6'), GO([0, 2, '^'], M2, 'move 2'), GO([2, 0, 'v'], M1, 'move 4'), GO([0, 4, '^'], M3, 'move 3, turn right, move 1')]
      },
      p2: {
        items: [GO([0, 4, '>'], M1, 'move 4, turn left, move 4'), GO([6, 0, '<'], M2, 'move 3, turn left, move 1'),
          FILL([0, 4, '>'], M1, 'move [], turn left, move []', [6, 2], 'B'), FILL([0, 4, '^'], M2, 'move [], turn right, move []', [3, 3], 'A')]
      },
      p3: {
        items: [GO([3, 4, '^'], M3, 'move 3, turn left, move 2'), FILL([0, 0, 'v'], M3, 'move [], turn left, move []', [4, 4], 'C'),
          { q: 'How many squares? move 4, turn left, move 4, turn left, move 4', eq: ['[] squares'], a: [12], calc: '4 + 4 + 4' },
          { q: 'Do "move 2, turn left" and "turn left, move 2" end in the same place?', lines: { n: 2, key: 'No. The turn changes the way the move goes.' } }]
      },
      think: {
        items: [{ q: '{a} says "turn right" moves the robot one square. Is that right?', lines: { n: 2, key: 'No. A turn only changes the way it faces.' } },
          { q: 'Write the steps for brushing your teeth, in order.', lines: { n: 3, key: 'For example: wet the brush, add toothpaste, brush, rinse.' } },
          { q: 'Why does the order of the steps matter?', lines: { n: 2, key: 'A move goes the way the robot faces, and a turn changes that way.' } },
          { q: 'Write code from the arrow to B.', pic: map([0, 0, '>'], M1, 'move 6, turn right, move 2'), lines: { n: 2, key: 'move 6, turn right, move 2' } }]
      }
    },

    fix: {
      watch: 'changing every line at once. Run the code, find the first wrong step, and change only that.',
      goal: 'I can find and fix a mistake in code.',
      learn: {
        show: { cap: 'To reach A: move 2, turn left, move 2 stops short', eq: ['Fix: move 4, turn left, move 2'] },
        together: [FILL([0, 2, '>'], M1, 'move [], turn left, move 2', [4], 'A', 'Fix the number to reach A.'), FILL([0, 0, 'v'], M3, 'move 4, turn left, move []', [4], 'C', 'Fix the number to reach C.')],
        cue: 'Run the code with your finger. Find the first step that goes wrong. Change just that step.',
        own: [FILL([0, 4, '>'], M1, 'move [], turn left, move 2', [6], 'B'), FILL([0, 2, '>'], M2, 'move 3, turn left, move []', [1], 'A')]
      },
      p1: {
        show: { cap: 'move 2 should be move 4', eq: ['move 4, turn left, move 2'] },
        items: [FILL([0, 2, '>'], M1, 'move [], turn right, move 2', [2], 'C'), FILL([0, 4, '^'], M2, 'move [], turn right, move 3', [3], 'A'),
          FILL([0, 4, '>'], M3, 'move 1, turn left, move []', [3], 'B'), FILL([6, 0, 'v'], M2, 'move []', [4], 'B')]
      },
      p2: {
        items: [FILL([0, 4, '>'], M1, 'move [], turn left, move []', [6, 2], 'B'), FILL([0, 0, '>'], M2, 'move [], turn right, move []', [3, 1], 'A'),
          FILL([0, 4, '^'], M3, 'move [], turn right, move []', [3, 1], 'B'), FILL([0, 0, 'v'], M3, 'move [], turn left, move []', [4, 4], 'C')]
      },
      p3: {
        items: [{ q: '{b} wanted to reach C: move 4, turn right, move 4. The robot went the wrong way. Fix it.', pic: map([0, 0, 'v'], M3, 'move 4, turn left, move 4'), lines: { n: 2, key: 'Change turn right to turn left.' } },
          { q: '{a} wrote move 3, turn right, move 1 to reach A. Fix it.', pic: map([0, 2, '>'], M2, 'move 3, turn left, move 1'), lines: { n: 2, key: 'Change turn right to turn left.' } },
          { q: 'What does "debug" mean?', lines: { n: 2, key: 'To find and fix a mistake in code.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why test code after changing it?', lines: { n: 2, key: 'To check the change works and did not break something else.' } },
          { q: 'A recipe says "bake, then mix". What is the bug?', lines: { n: 2, key: 'The steps are in the wrong order: mix, then bake.' } },
          { q: '{b} changed 3 lines at once and now the robot is lost. What should {b} do?', lines: { n: 2, key: 'Go back and change one step at a time, testing each one.' } },
          { q: 'Write code with one mistake for a friend to fix.', lines: { n: 2, key: 'Any code with one wrong number or turn.' } }]
      }
    },

    conc: {
      watch: 'adding the times of things that happen together. Things at the same time share the clock.',
      goal: 'I can follow code where things happen at the same time.',
      learn: {
        show: { cap: 'When the flag is tapped: the cat walks AND the drum plays', eq: ['Both start together'] },
        together: [story('Two robots start together. Each moves 3 squares, 1 square a second. How many seconds until both stop?', 'seconds', 3, '3'),
          story('A light flashes once a second while a robot moves 5 squares, 1 a second. How many flashes?', 'flashes', 5, '5')],
        cue: 'Things at the same time start together. Count the time once for both.',
        own: [story('A song plays for 6 seconds while a robot moves 1 square a second. How many squares?', 'squares', 6, '6'),
          story('Robot A moves 4 squares and robot B moves 2, at the same time, 1 a second. How many seconds until both stop?', 'seconds', 4, '4')]
      },
      p1: {
        show: { cap: 'Beep and move at the same time, 3 times', eq: ['3 beeps and 3 squares'] },
        items: [story('A robot beeps and moves 1 square at the same time, 4 times. How many beeps?', 'beeps', 4, '4'),
          story('A robot claps and moves 1 square at the same time, 6 times. How many squares?', 'squares', 6, '6'),
          story('Two robots each move 5 squares at the same time. How many squares in all?', 'squares', 10, '5 + 5'),
          story('Two robots each move 7 squares at the same time. How many squares in all?', 'squares', 14, '7 + 7')]
      },
      p2: {
        items: [story('Robot A moves 6 squares and robot B moves 9, at the same time, 1 a second. How many seconds until both stop?', 'seconds', 9, '9'),
          story('3 robots each move 4 squares at the same time. How many squares in all?', 'squares', 12, '4 + 4 + 4'),
          story('A light is on for 10 seconds. A robot moves 1 square a second. How far does it go?', 'squares', 10, '10'),
          { q: 'Do "turn right" and "move 2" at the same time give the same as one after the other?', lines: { n: 2, key: 'No. One after the other, the order decides where the robot goes.' } }]
      },
      p3: {
        items: [story('A song lasts 8 seconds. A robot claps every 2 seconds. How many claps?', 'claps', 4, '8 / 2'),
          story('4 robots each move 3 squares at the same time. How many squares in all?', 'squares', 12, '3 + 3 + 3 + 3'),
          { q: 'Write code where two things happen at the same time.', lines: { n: 2, key: 'For example: when the flag is tapped, move 4 and play a song.' }, wide: true }]
      },
      think: {
        items: [{ q: 'What is the difference between "one after the other" and "at the same time"?', lines: { n: 3, key: 'One after the other waits for each step to finish. At the same time, both run together.' } },
          { q: 'Give an example from life of two things at the same time.', lines: { n: 2, key: 'For example: walking and talking, or a band playing.' } },
          { q: '{a} says two 5-second jobs at the same time take 10 seconds. Is {a} right?', lines: { n: 2, key: 'No. They run together, so they take 5 seconds.' } },
          { q: 'Why might a game need things to happen at the same time?', lines: { n: 2, key: 'So characters can move while music plays.' } }]
      }
    }
  } });
})();
