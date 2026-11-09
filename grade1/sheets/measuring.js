/* Grade 1 Measuring and the Calendar: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per
   idea of the lessons in chapters/measuring.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at
   random, so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things.
   Ontario 2020: E2.1 what can be measured (length, mass, capacity, area); E2.2 compare and measure with units that are the
   same size, end to end, with no gaps; E2.3 days, weeks, months and seasons, and reading a calendar.
   The answer checks are in tests/verify/sheets.js: what a question measures, strip lengths and cube counts from the picture,
   squares covered, the heavier side of a balance, cups, the day of a date, the day or month after, and the season. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var L = function (i) { return String.fromCharCode(65 + i); };
  /* what does it measure? */
  function AT(q, want, opts) { return { q: q, pick: { opts: opts, ans: opts.indexOf(want), attr: true } }; }
  /* strips: circle the longest or shortest (list: lengths; off: how far each starts from the line) */
  function LN(lens, which, off) {
    var list = lens.map(function (n, i) { return [L(i), n, (off || [])[i] || 0]; }), opts = list.map(function (s) { return s[0]; });
    var best = which === 'longest' ? Math.max.apply(null, lens) : Math.min.apply(null, lens);
    return { q: 'Circle the ' + which + ' strip.', pic: ['strips', { list: list, cubes: !off }], pick: { opts: opts, ans: lens.indexOf(best), len: which } };
  }
  /* how many cubes long? */
  function CB(n) { return { q: 'How many cubes long?', pic: ['strips', { list: [['A', n, 0]], cubes: true }], eq: ['[] cubes'], a: [n] }; }
  /* how much longer? */
  function DF(a, b) { return { q: 'A is ' + a + ' cubes. B is ' + b + ' cubes. How much longer is A?', pic: ['strips', { list: [['A', a, 0], ['B', b, 0]], cubes: true }], eq: ['[] cubes'], a: [a - b], calc: a + ' − ' + b }; }
  /* squares covered */
  function SQ(cells, cols, rows) { return { q: 'How many squares does it cover?', pic: ['area', { cols: cols, rows: rows, cells: cells, u: 16 }], eq: ['[] squares'], a: [cells.length] }; }
  function rect(c, r, dx, dy) { var out = []; for (var y = 0; y < r; y++) for (var x = 0; x < c; x++) out.push((x + (dx || 0)) + ',' + (y + (dy || 0))); return out; }
  /* do A and B cover the same space? */
  function SM(a, b) { var g = function (cells) { return ['area', { cols: 5, rows: 3, cells: cells, u: 14 }]; }; return { q: 'Do A and B cover the same space?', pic: ['row', { list: [g(a), g(b)], labels: ['A', 'B'], gap: 16 }], pick: { opts: ['yes', 'no'], ans: a.length === b.length ? 0 : 1 }, same: true }; }
  /* which is heavier? (tilt -1: the left side goes down) */
  function BH(l, r, tilt) { return { q: 'Which is heavier?', pic: ['balance', { l: l, r: r, tilt: tilt }], pick: { opts: [l, r], ans: tilt < 0 ? 0 : 1 } }; }
  /* a thing balances n cubes */
  function BC(thing, n) { return { q: 'The ' + thing + ' balances. How many cubes?', pic: ['balance', { l: thing, r: n, tilt: 0 }], eq: ['[] cubes'], a: [n] }; }
  /* cups a container fills */
  function CU(thing, n) { return { q: 'The ' + thing + ' fills these cups. How many?', pic: ['cups', { n: n }], eq: ['[] cups'], a: [n] }; }
  /* a story sum */
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* the calendar: months that start on a real day (2026 to 2027) */
  var SEP = { month: 'September', start: 2, days: 30 }, OCT = { month: 'October', start: 4, days: 31 }, NOV = { month: 'November', start: 0, days: 30 },
    JAN = { month: 'January', start: 5, days: 31 }, FEB = { month: 'February', start: 1, days: 28 }, MAY = { month: 'May', start: 6, days: 31 };
  var WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function cal(c, marks) { return ['cal', { month: c.month, start: c.start, days: c.days, marks: marks || [] }]; }
  /* what day is the date? */
  function DY(c, d, opts) { var want = WEEK[(c.start + d - 1) % 7]; return { q: 'What day is ' + c.month + ' ' + d + '?', pic: cal(c, [d]), pick: { opts: opts, ans: opts.indexOf(want), day: d } }; }
  /* how many days in the month? */
  function CD(c) { return { q: 'How many days are in ' + c.month + '?', pic: cal(c), eq: ['[] days'], a: [c.days] }; }
  /* the day or month n after (n < 0: before) */
  function AF(from, n, opts) {
    var list = WEEK.indexOf(from) >= 0 ? WEEK : MONTHS, want = list[(list.indexOf(from) + n + 84) % list.length], what = list === WEEK ? 'day' : 'month';
    var q = n === 1 ? 'What ' + what + ' comes after ' + from + '?' : n === -1 ? 'What ' + what + ' comes before ' + from + '?' : n > 0 ? 'What ' + what + ' is ' + n + ' after ' + from + '?' : 'What ' + what + ' is ' + -n + ' before ' + from + '?';
    return { q: q, pick: { opts: opts, ans: opts.indexOf(want), after: { from: from, n: n } } };
  }
  /* the season of a month */
  function SE(m, opts) { var want = ['winter', 'spring', 'summer', 'fall'][Math.floor(((MONTHS.indexOf(m) + 1) % 12) / 3)], o = opts || ['winter', 'spring', 'summer', 'fall']; return { q: 'What season is ' + m + ' in?', pick: { opts: o, ans: o.indexOf(want), season: m }, wide: o.length > 3 }; }

  S.register('measuring', { code: 'ME', ideas: {

    attr: {
      watch: 'saying "big" for everything. Say what is big: long, heavy, holds a lot, or covers a lot.',
      goal: 'I can tell what we measure: length, mass, capacity or area.',
      learn: {
        show: { cap: 'long, heavy, holds, covers', eq: ['length, mass, capacity, area'] },
        together: [AT('How long is the hallway?', 'length', ['length', 'mass']), AT('How heavy is the backpack?', 'mass', ['capacity', 'mass'])],
        cue: 'Ask: is it about how long, how heavy, how much it holds, or how much it covers?',
        own: [AT('How much water does the jug hold?', 'capacity', ['capacity', 'length']), AT('How much of the table does the mat cover?', 'area', ['mass', 'area'])]
      },
      p1: { show: { eq: ['How tall? length'] }, items: [AT('How tall is the tree?', 'length', ['length', 'capacity']), AT('How heavy is the pumpkin?', 'mass', ['area', 'mass']), AT('How much juice does the cup hold?', 'capacity', ['capacity', 'mass']), AT('How much of the floor does the rug cover?', 'area', ['area', 'length']), AT('How wide is the door?', 'length', ['mass', 'length']), AT('How much does the cat weigh?', 'mass', ['mass', 'capacity'])] },
      p2: { items: [AT('How much soup does the pot hold?', 'capacity', ['length', 'mass', 'capacity']), AT('How long is the canoe?', 'length', ['length', 'area', 'mass']), AT('How much of the wall does the poster cover?', 'area', ['capacity', 'area', 'length']), AT('How heavy is the bag of apples?', 'mass', ['mass', 'length', 'area']), AT('How much water can you pour into the tub?', 'capacity', ['area', 'capacity', 'mass']), AT('How high is the shelf?', 'length', ['capacity', 'mass', 'length'])] },
      p3: { items: [AT('How much paper covers the desk?', 'area', ['length', 'mass', 'capacity', 'area']), AT('How heavy is the bike?', 'mass', ['length', 'mass', 'capacity', 'area']), AT('How much milk can you fill the glass with?', 'capacity', ['length', 'mass', 'capacity', 'area']), AT('How long is the skating rink?', 'length', ['length', 'mass', 'capacity', 'area'])] },
      think: {
        items: [{ q: 'Name two ways to measure a pumpkin.', lines: { n: 2, key: 'For example: how heavy it is (mass) and how tall it is (length).' } },
          { q: '{a} says the bucket is big. What could {a} mean?', lines: { n: 2, key: 'It could be tall (length), heavy (mass) or hold a lot (capacity).' } },
          AT('How much sand does the pail hold?', 'capacity', ['length', 'mass', 'capacity']),
          { q: 'Find something long and something heavy at home.', lines: { n: 2, key: 'For example: a hockey stick is long; a bag of flour is heavy.' } }]
      }
    },

    'line-up': {
      watch: 'comparing strips that do not start at the same place. Line up the ends first.',
      goal: 'I can compare lengths by lining up the ends.',
      learn: {
        show: { pic: ['strips', { list: [['A', 6, 0], ['B', 4, 0]] }], cap: 'Ends lined up on the dashed line', eq: ['A is longer'] },
        together: [LN([5, 7], 'longest'), LN([8, 3], 'shortest')],
        cue: 'Check the ends start on the same line. Then look at the other end.',
        own: [LN([4, 6, 2], 'longest'), LN([7, 5, 9], 'shortest')]
      },
      p1: { show: { pic: ['strips', { list: [['A', 3, 0], ['B', 5, 0]] }], eq: ['B is longer'] }, items: [LN([6, 4], 'longest'), LN([3, 8], 'shortest'), LN([5, 9, 7], 'longest'), LN([6, 2, 4], 'shortest'), LN([4, 7], 'longest', [2, 0]), LN([5, 3], 'shortest', [0, 3])] },
      p2: { items: [LN([4, 6], 'longest', [3, 0]), LN([7, 5], 'shortest', [0, 3]), LN([3, 5, 4], 'longest', [3, 0, 1]), LN([6, 8, 5], 'shortest', [0, 1, 3]), DF(7, 4), DF(9, 6)] },
      p3: { items: [LN([5, 4, 6], 'longest', [2, 3, 0]), LN([7, 6, 4], 'shortest', [0, 1, 3]), DF(8, 3), DF(10, 7), LN([9, 5, 7], 'longest'), LN([2, 6, 4], 'shortest', [4, 0, 1])] },
      think: {
        items: [{ q: '{b} says B is longer because it sticks out more. What went wrong?', pic: ['strips', { list: [['A', 6, 0], ['B', 4, 3]] }], lines: { n: 2, key: 'B starts later. Line up the ends: A is 6 and B is 4, so A is longer.' } },
          { q: 'Put 3 pencils in order from shortest to longest. How did you check?', lines: { n: 2, key: 'Line up one end of each on the table edge, then compare the other ends.' } },
          DF(10, 4),
          LN([5, 8, 6], 'longest', [3, 0, 1])]
      }
    },

    cubes: {
      watch: 'leaving gaps or overlapping the cubes. Cubes go end to end, touching, with no gaps.',
      goal: 'I can measure length with cubes.',
      learn: {
        show: { pic: ['strips', { list: [['A', 5, 0]], cubes: true }], cap: 'End to end, no gaps', eq: ['5 cubes long'] },
        together: [CB(4), CB(7)],
        cue: 'Start at the line. Count each cube once.',
        own: [CB(6), CB(9)]
      },
      p1: { show: { pic: ['strips', { list: [['A', 3, 0]], cubes: true }], eq: ['3 cubes long'] }, items: [CB(3), CB(5), CB(8), CB(6), CB(10), CB(2)] },
      p2: { items: [CB(7), CB(11), DF(6, 2), DF(9, 5), story('A pencil is 6 cubes. A crayon is 4 cubes. How long are they end to end?', 'cubes', 10, '6 + 4'), story('A ribbon is 12 cubes. {a} cuts off 5 cubes. How long is it now?', 'cubes', 7, '12 − 5')] },
      p3: { items: [CB(12), DF(11, 6), DF(12, 8), story('A spoon is 7 cubes. A fork is 8 cubes. How long are they end to end?', 'cubes', 15, '7 + 8'), story('A stick is 15 cubes. A twig is 9 cubes. How much longer is the stick?', 'cubes', 6, '15 − 9'), story('{b} lines up 3 books. Each is 5 cubes long. How long in all?', 'cubes', 15, '5 + 5 + 5')] },
      think: {
        items: [{ q: '{a} left gaps between the cubes. Is the count too big or too small?', pick: { opts: ['too big', 'too small'], ans: 1, cover: 'gaps' } },
          { q: 'Why use cubes that are all the same size?', lines: { n: 2, key: 'So every count means the same length and we can compare.' } },
          { q: 'Find something about 10 cubes long.', lines: { n: 1, key: 'For example: a pencil or a spoon.' } },
          DF(14, 9)]
      }
    },

    squares: {
      watch: 'counting a square twice or missing one. Count across each row in order.',
      goal: 'I can count squares to find what covers more.',
      learn: {
        show: { pic: ['area', { cols: 4, rows: 2, cells: rect(3, 2), u: 16 }], cap: '2 rows of 3', eq: ['6 squares'] },
        together: [SQ(rect(4, 2), 5, 3), SM(rect(3, 2), rect(2, 3))],
        cue: 'Count across each row. Touch each square once.',
        own: [SQ(rect(3, 3), 5, 3), SM(rect(4, 1), rect(2, 3))]
      },
      p1: { show: { pic: ['area', { cols: 3, rows: 2, cells: rect(2, 2), u: 16 }], eq: ['4 squares'] }, items: [SQ(rect(2, 3), 5, 3), SQ(rect(5, 1), 5, 3), SQ(['0,0', '1,0', '1,1', '2,1'], 5, 3), SQ(rect(4, 3), 5, 3), SM(rect(2, 2), rect(4, 1)), SM(rect(3, 1), rect(2, 2))] },
      p2: { items: [SQ(['0,0', '1,0', '2,0', '0,1', '0,2'], 5, 3), SQ(rect(5, 2), 5, 3), SM(rect(3, 2), rect(5, 1)), SM(rect(2, 3), rect(3, 2)), story('A mat covers 8 squares. A towel covers 5 squares. How many more does the mat cover?', 'squares', 3, '8 − 5'), story('{a} covers 6 squares with red and 4 with blue. How many in all?', 'squares', 10, '6 + 4')] },
      p3: { items: [SQ(['1,0', '2,0', '3,0', '0,1', '1,1', '2,1', '3,1', '4,1', '2,2'], 5, 3), SQ(rect(5, 3), 5, 3), SM(['0,0', '1,0', '2,0', '1,1'], rect(2, 2)), SM(rect(3, 3), rect(5, 2)), story('A rug covers 15 squares. A mat covers 9. How many more does the rug cover?', 'squares', 6, '15 − 9'), story('{b} covers 7 squares, then 7 more. How many squares now?', 'squares', 14, '7 + 7')] },
      think: {
        items: [{ q: 'Shade 6 squares in two different ways.', draw: { h: 60, key: 'For example: 2 rows of 3, or 1 row of 6.' } },
          { q: 'A is long and thin. B is short and wide. Can they cover the same space?', lines: { n: 2, key: 'Yes. Count the squares: a long and thin shape can cover as many as a short and wide one.' } },
          SM(rect(4, 2), ['0,0', '1,0', '2,0', '3,0', '4,0', '0,1', '1,1', '2,1']),
          SQ(['0,0', '1,0', '2,0', '3,0', '0,1', '3,1', '0,2', '1,2', '2,2', '3,2'], 5, 3)]
      }
    },

    balance: {
      watch: 'thinking the side that goes up is heavier. The heavier side goes down.',
      goal: 'I can use a balance to compare mass.',
      learn: {
        show: { cap: 'The side that goes down', eq: ['is heavier'] },
        together: [BH('apple', 'grape', -1), BC('pear', 6)],
        cue: 'Look for the side that goes down. That side is heavier.',
        own: [BH('feather', 'book', 1), BC('orange', 9)]
      },
      p1: { show: { eq: ['The heavier side goes down.'] }, items: [BH('mug', 'spoon', -1), BH('key', 'shoe', 1), BC('lemon', 5), BC('toy car', 8)] },
      p2: { items: [BH('sock', 'boot', 1), BC('carrot', 4), BH('melon', 'peanut', -1), BC('potato', 11)] },
      p3: { items: [story('A pear balances 6 cubes. An apple balances 8 cubes. How many more cubes for the apple?', 'cubes', 2, '8 − 6'), story('A lemon is 5 cubes. A lime is 4 cubes. How many cubes for both?', 'cubes', 9, '5 + 4'), story('A mug balances 14 cubes. A cup balances 9 cubes. How many more for the mug?', 'cubes', 5, '14 − 9'), story('Two apples. Each balances 8 cubes. How many cubes for both?', 'cubes', 16, '8 + 8'), BC('onion', 12), BH('glove', 'hockey bag', 1)] },
      think: {
        items: [{ q: 'The balance is level. What does that tell you?', pic: ['balance', { l: 'ball', r: 'block', tilt: 0 }], lines: { n: 2, key: 'The ball and the block have the same mass.' } },
          { q: 'Draw a balance with a heavy thing and a light thing.', draw: { h: 70, key: 'The heavy thing\'s side is drawn lower.' } },
          story('A book balances 18 cubes. A notebook balances 7. How many more for the book?', 'cubes', 11, '18 − 7'),
          { q: 'Why must the cubes all be the same?', lines: { n: 2, key: 'So each cube is the same mass and the count is fair.' } }]
      }
    },

    big: {
      watch: 'deciding by size alone. A big thing can be light; a small thing can be heavy.',
      goal: 'I can tell that bigger is not always heavier.',
      learn: {
        show: { cap: 'A big balloon is lighter than a small rock', eq: ['Look, do not guess'] },
        together: [BH('pillow', 'marble', 1), BH('beach ball', 'apple', 1)],
        cue: 'Do not guess by size. Look at which side goes down.',
        own: [BH('box of tissues', 'can of beans', 1), BH('hammer', 'sponge', -1)]
      },
      p1: { show: { eq: ['Big is not always heavy.'] }, items: [BH('feather', 'coin', 1), BH('balloon', 'key', 1), BH('stone', 'paper bag', -1), BH('empty box', 'battery', 1)] },
      p2: { items: [BH('scarf', 'phone', 1), BC('rock', 13), BH('egg', 'leaf', -1), BC('sponge', 2)] },
      p3: { items: [story('A big box balances 4 cubes. A small rock balances 9. How many more for the rock?', 'cubes', 5, '9 − 4'), story('A pillow balances 3 cubes. A book balances 7. How many more for the book?', 'cubes', 4, '7 − 3'), BC('beach ball', 3), BC('bag of rice', 18)] },
      think: {
        items: [{ q: 'Name a big thing that is light.', lines: { n: 1, key: 'For example: a balloon, a pillow, an empty box.' } },
          { q: 'Name a small thing that is heavy.', lines: { n: 1, key: 'For example: a rock, a battery, a can of beans.' } },
          { q: '{a} says the big box must be heavier. How can {a} check?', lines: { n: 2, key: 'Put both on a balance. The side that goes down is heavier.' } },
          BH('teddy bear', 'stapler', 1)]
      }
    },

    cups: {
      watch: 'filling cups only part way. Fill each cup to the top, the same each time.',
      goal: 'I can count cups to find what holds more.',
      learn: {
        show: { pic: ['cups', { n: 4 }], cap: 'The jug fills 4 cups', eq: ['It holds 4 cups'] },
        together: [CU('bottle', 3), CU('pot', 7)],
        cue: 'Fill each cup to the top. Count the cups.',
        own: [CU('vase', 5), story('The pail holds 6 cups. The jug holds 4. How many more does the pail hold?', 'cups', 2, '6 − 4')]
      },
      p1: { show: { pic: ['cups', { n: 2 }], eq: ['holds 2 cups'] }, items: [CU('jar', 3), CU('bowl', 5), CU('kettle', 6), CU('tub', 8), CU('mug', 2), CU('pitcher', 7)] },
      p2: { items: [CU('bucket', 9), CU('teapot', 4), story('A pot holds 9 cups. A pan holds 5. How many more does the pot hold?', 'cups', 4, '9 − 5'), story('{a} pours 3 cups, then 4 more cups into a tub. How many cups?', 'cups', 7, '3 + 4'), story('A jug holds 8 cups. {b} pours out 2. How many cups are left?', 'cups', 6, '8 − 2'), CU('vase', 6)] },
      p3: { items: [story('A tank holds 12 cups. A pail holds 7. How many more does the tank hold?', 'cups', 5, '12 − 7'), story('Two jugs hold 6 cups each. How many cups in all?', 'cups', 12, '6 + 6'), story('A tub holds 15 cups. 9 cups are in. How many more fill it?', 'cups', 6, '15 − 9'), CU('cooler', 10), story('{b} fills 8 cups and then 5 more. How many cups?', 'cups', 13, '8 + 5'), story('A pot holds 20 cups. A bowl holds 10. How many more does the pot hold?', 'cups', 10, '20 − 10')] },
      think: {
        items: [{ q: '{a} did not fill the cups to the top. Is the count too big or too small?', lines: { n: 1, key: 'Too big. Part-full cups mean more cups are needed.' } },
          { q: 'A tall glass and a wide bowl. How can you tell which holds more?', lines: { n: 2, key: 'Fill each with cups of water and count. Tall does not always hold more.' } },
          story('A jug holds 11 cups. A bottle holds 4. How many more does the jug hold?', 'cups', 7, '11 − 4'),
          CU('sink', 9)]
      }
    },

    week: {
      watch: 'saying the days out of order. Say them from Sunday every time.',
      goal: 'I can name the days of the week in order.',
      learn: {
        show: { cap: '7 days in a week', eq: ['Sunday, Monday, Tuesday ...'] },
        together: [AF('Monday', 1, ['Tuesday', 'Sunday']), AF('Friday', -1, ['Saturday', 'Thursday'])],
        cue: 'Say the days from Sunday. Stop at the one you need.',
        own: [AF('Wednesday', 1, ['Tuesday', 'Thursday']), AF('Sunday', -1, ['Saturday', 'Monday'])]
      },
      p1: { show: { eq: ['After Tuesday: Wednesday'] }, items: [AF('Sunday', 1, ['Monday', 'Saturday']), AF('Thursday', 1, ['Friday', 'Wednesday']), AF('Saturday', 1, ['Friday', 'Sunday']), AF('Tuesday', -1, ['Monday', 'Wednesday']), AF('Thursday', -1, ['Friday', 'Wednesday']), AF('Monday', -1, ['Sunday', 'Tuesday'])] },
      p2: { items: [AF('Monday', 2, ['Wednesday', 'Thursday']), AF('Friday', 2, ['Sunday', 'Monday']), AF('Tuesday', 3, ['Friday', 'Thursday']), AF('Saturday', -2, ['Thursday', 'Monday']), story('There are 7 days in a week. How many days in 2 weeks?', 'days', 14, '7 + 7'), story('A week has 7 days. School is on 5 of them. How many days are not school days?', 'days', 2, '7 − 5')] },
      p3: { items: [AF('Wednesday', 4, ['Sunday', 'Saturday', 'Monday']), AF('Sunday', 7, ['Saturday', 'Sunday', 'Monday']), AF('Thursday', -3, ['Monday', 'Tuesday', 'Sunday']), AF('Friday', 5, ['Wednesday', 'Tuesday', 'Thursday']), story('{a} reads 2 books each day for 5 days. How many books?', 'books', 10, '2 + 2 + 2 + 2 + 2'), story('It rains for 3 days, then is sunny for 4 days. How many days in all?', 'days', 7, '3 + 4')] },
      think: {
        items: [{ q: 'Write the days of the week in order.', lines: { n: 2, key: 'Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.' } },
          { q: 'Today is Friday. {b} says tomorrow is Thursday. What went wrong?', lines: { n: 2, key: 'Thursday comes before Friday. Tomorrow is Saturday.' } },
          AF('Saturday', 3, ['Tuesday', 'Monday', 'Wednesday']),
          { q: 'What do you do on Saturday that you do not do on Monday?', lines: { n: 2, key: 'Answers vary. For example: no school, swimming lessons.' } }]
      }
    },

    months: {
      watch: 'mixing up months and seasons. A season is a group of about three months.',
      goal: 'I can name the months and seasons in order.',
      learn: {
        show: { cap: '12 months, 4 seasons', eq: ['winter, spring, summer, fall'] },
        together: [AF('March', 1, ['April', 'February']), SE('July', ['summer', 'winter'])],
        cue: 'Say the months from January. Think of the weather in that month.',
        own: [AF('October', -1, ['November', 'September']), SE('January', ['fall', 'winter'])]
      },
      p1: { show: { eq: ['After June: July'] }, items: [AF('January', 1, ['February', 'December']), AF('May', 1, ['April', 'June']), AF('August', -1, ['July', 'September']), SE('December', ['winter', 'summer']), SE('April', ['spring', 'fall']), SE('October', ['summer', 'fall'])] },
      p2: { items: [AF('December', 1, ['November', 'January']), AF('September', 2, ['November', 'October']), AF('February', -2, ['December', 'January']), SE('August', ['spring', 'summer', 'winter']), SE('March', ['spring', 'winter', 'fall']), SE('November', ['summer', 'fall', 'spring'])] },
      p3: { items: [AF('November', 3, ['February', 'January', 'March']), AF('April', -4, ['January', 'December', 'November']), SE('June', ['winter', 'spring', 'summer']), SE('February'), story('A year has 12 months. Summer has 3. How many months are not summer?', 'months', 9, '12 − 3'), story('Each season is 3 months. How many months in 2 seasons?', 'months', 6, '3 + 3')] },
      think: {
        items: [{ q: 'What month is your birthday? What season is it in?', lines: { n: 2, key: 'Answers vary. Check the season matches the month.' } },
          { q: 'Name something you see in fall.', lines: { n: 1, key: 'For example: red and orange leaves, pumpkins.' } },
          AF('July', 6, ['January', 'December', 'February']),
          SE('September', ['summer', 'fall', 'winter'])]
      }
    },

    read: {
      watch: 'reading across the wrong row. Find the date, then look up to the top for the day.',
      goal: 'I can read a calendar.',
      learn: {
        show: { cap: 'Find the date, look up to the top', eq: ['September 8: Tuesday'] },
        together: [DY(SEP, 15, ['Tuesday', 'Monday']), CD(SEP)],
        cue: 'Put your finger on the date. Slide up to the day.',
        own: [story('September has 30 days. 8 days have gone by. How many are left?', 'days', 22, '30 − 8')]
      },
      p1: { show: { eq: ['Find the date. Look up.'] }, items: [DY(OCT, 1, ['Thursday', 'Friday']), DY(OCT, 10, ['Saturday', 'Sunday']), DY(NOV, 11, ['Wednesday', 'Thursday']), CD(NOV)] },
      p2: { items: [DY(JAN, 1, ['Friday', 'Monday']), DY(JAN, 20, ['Tuesday', 'Wednesday']), CD(FEB), DY(FEB, 14, ['Sunday', 'Saturday'])] },
      p3: { items: [DY(MAY, 24, ['Monday', 'Sunday', 'Saturday']), DY(MAY, 31, ['Monday', 'Sunday', 'Friday']), story('{a} has a trip on May 9 and on May 16. How many days apart?', 'days', 7, '16 − 9'), story('Today is May 6. A party is on May 20. How many days away?', 'days', 14, '20 − 6')] },
      think: {
        items: [DY(OCT, 31, ['Saturday', 'Friday']),
          { q: 'How do you find the day for a date?', lines: { n: 2, key: 'Find the date on the calendar, then look up to the top of its column.' } },
          { q: 'Ring the dates of every Monday in this month.', pic: cal(NOV), lines: { n: 1, key: 'November 2, 9, 16, 23, 30.' } }]
      }
    }
  } });
})();
