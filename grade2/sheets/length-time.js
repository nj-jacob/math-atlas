/* Grade 2 Length and Time: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the
   lessons in chapters/length-time.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: E2.1 measure with units laid end to end, and why a bigger unit gives a smaller count; E2.2 centimetres and
   metres, and 100 cm = 1 m; E2.3 measure with a ruler, including when the object does not start at 0; E2.4 seconds, minutes
   and hours, and how much time has passed in hours.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  /* cubes laid end to end under a ribbon: how many */
  function UN(n, unit) { return { q: 'How many ' + unit + ' long?', pic: ['units', { n: n }], eq: ['[] ' + unit], a: [n] }; }
  /* which unit is bigger: the one that fits fewer times */
  function BG(a, na, b, nb) { var c = {}; c[a] = na; c[b] = nb; return { q: 'A table is ' + na + ' ' + a + ' long, or ' + nb + ' ' + b + ' long. Which unit is bigger?', pick: { opts: [a, b], ans: na < nb ? 0 : 1 }, count: c, wide: true }; }
  /* which unit suits it (size in mm) */
  function UC(thing, size) { var o = ['cm', 'm']; return { q: 'cm or m: ' + thing + '?', pick: { opts: o, ans: size < 1000 ? 0 : 1, lenMM: size } }; }
  /* change between cm and m */
  function CV(row, a) { return { eq: [row], a: [a] }; }
  /* compare lengths: '1 m [] 90 cm' */
  function CP(x, y) {
    var v = function (s) { var t = 0; s.replace(/(\d+) (cm|m)\b/g, function (m, n, u) { t += +n * (u === 'm' ? 100 : 1); }); return t; }, a = v(x), b = v(y);
    return { eq: [x + ' [] ' + y], a: [a < b ? '<' : a > b ? '>' : '='] };
  }
  /* read a ruler: the ribbon is len cm long and starts at from */
  function RL(len, from, max) { return { q: from ? 'It starts at ' + from + '. How long?' : 'How long is the ribbon?', pic: ['ruler', { len: len, from: from || 0, max: max || 10 }], eq: ['[] cm'], a: [len] }; }
  /* the length when it starts at a and ends at b, as a take-away */
  function SB(a, b) { return { q: 'From ' + a + ' to ' + b + ' on a ruler.', eq: [b + ' − ' + a + ' = [] cm'], a: [b - a] }; }
  /* which unit of time suits it (in seconds) */
  function DU(thing, sec) { var u = sec < 90 ? 'seconds' : sec < 5400 ? 'minutes' : 'hours', o = ['seconds', 'minutes', 'hours']; return { q: thing, pick: { opts: o, ans: o.indexOf(u), dur: sec } }; }
  /* hours passed between two o'clock times, shown on clocks */
  function HR(h1, h2) {
    var past = h2 < h1;
    return { q: 'From ' + h1 + ' o\'clock to ' + h2 + ' o\'clock' + (past ? ', past 12.' : '.'), pic: ['row', { list: [['clock', { h: h1, m: 0, R: 22 }], ['clock', { h: h2, m: 0, R: 22 }]], gap: 16 }], eq: ['[] hours'], a: [(h2 - h1 + 12) % 12], calc: past ? '12 - ' + h1 + ' + ' + h2 : h2 + ' - ' + h1 };
  }
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }

  S.register('length-time', { code: 'LT', ideas: {

    endtoend: {
      watch: 'leaving gaps or overlapping the units. Line them up end to end from the very start.',
      goal: 'I can measure with units end to end.',
      learn: {
        show: { pic: ['units', { n: 6 }], cap: 'Cubes touching, no gaps, no overlaps', eq: ['6 cubes long'] },
        together: [UN(4, 'cubes'), UN(7, 'cubes')],
        cue: 'Start at the very end. Touch each unit to the next. Count them.',
        own: [UN(5, 'cubes'), UN(9, 'cubes'), UN(3, 'clips'), UN(8, 'clips')]
      },
      p1: {
        show: { pic: ['units', { n: 5 }], cap: 'Count each unit once', eq: ['5 units'] },
        items: [UN(2, 'cubes'), UN(6, 'cubes'), UN(10, 'cubes'), UN(4, 'clips'), UN(7, 'clips'), UN(12, 'cubes')]
      },
      p2: {
        items: [UN(11, 'cubes'), UN(8, 'cubes'),
          { q: 'Gaps between the cubes make the count', pick: { opts: ['too small', 'too big'], ans: 0, cover: 'gaps' } }, { q: 'Cubes that overlap make the count', pick: { opts: ['too small', 'too big'], ans: 1, cover: 'overlaps' } },
          { q: 'Measure your pencil with paper clips.', lines: { n: 1, key: 'Answers will vary: check the clips are end to end.' } }, { q: 'Measure your hand with cubes.', lines: { n: 1, key: 'Answers will vary: check there are no gaps.' } }]
      },
      p3: {
        items: [story('{a} lines up 9 cubes and 6 more cubes end to end. How many cubes long?', 'cubes', 15, '9 + 6'), story('A ribbon is 14 cubes long. {b} cuts off 5 cubes. How long is it now?', 'cubes', 9, '14 − 5'),
          story('{a}\'s book is 8 clips long. {b}\'s is 5 clips long. How much longer is {a}\'s?', 'clips', 3, '8 − 5'), story('A desk is 20 clips long. A shelf is 12 clips long. How much shorter is the shelf?', 'clips', 8, '20 − 12')]
      },
      think: {
        items: [{ q: '{b} left gaps between the cubes and got 7. Is the real length more or less? Why?', lines: { n: 2, key: 'More. The gaps were not counted.' } },
          { q: 'Why must all the units be the same size?', lines: { n: 2, key: 'So each one counts as the same amount.' } },
          { q: 'Draw cubes measuring a line correctly, then with a mistake.', draw: { h: 70, key: 'One row of touching cubes; one with gaps or overlaps.' } },
          { q: 'Can you measure with your feet? What could go wrong?', lines: { n: 2, key: 'Yes, but feet are different sizes, so people get different counts.' } }]
      }
    },

    bigger: {
      watch: 'thinking the bigger number means the bigger unit. A bigger unit fits fewer times.',
      goal: 'I can tell that a bigger unit gives a smaller count.',
      learn: {
        show: { pic: ['row', { list: [['units', { n: 3 }], ['units', { n: 6 }]], gap: 20 }], cap: 'The same ribbon: 3 big units or 6 small ones', eq: ['bigger unit, fewer units'] },
        together: [BG('clips', 6, 'pencils', 2), BG('cubes', 10, 'hands', 4)],
        cue: 'The thing stays the same. Count fewer when the unit is bigger.',
        own: [BG('crayons', 5, 'cubes', 12), BG('steps', 8, 'metre sticks', 3)]
      },
      p1: {
        show: { cap: 'A desk: 4 pencils or 12 cubes', eq: ['the pencil is bigger'] },
        items: [BG('cubes', 15, 'books', 3), BG('hands', 6, 'clips', 14), BG('feet', 9, 'steps', 4), BG('erasers', 12, 'rulers', 2)]
      },
      p2: {
        items: [{ q: 'A table is 4 pencils long. Will it be more or fewer cubes long? Why?', lines: { n: 1, key: 'More: a cube is smaller than a pencil.' }, wide: true },
          BG('spoons', 7, 'straws', 3), BG('blocks', 5, 'beads', 20)]
      },
      p3: {
        items: [story('A rug is 6 steps long. {a}\'s steps are half as long as {b}\'s. How many of {a}\'s steps?', 'steps', 12, '6 + 6'),
          story('A rope is 10 clips long. A pencil is as long as 2 clips. How many pencils long?', 'pencils', 5, '10 / 2'), BG('tiles', 6, 'cubes', 18)]
      },
      think: {
        items: [{ q: '{a} got 8 and {b} got 5 for the same table. Who used the bigger unit?', lines: { n: 2, key: '{b}: the bigger unit fits fewer times.' } },
          { q: 'Why do we use the same units, like centimetres, to share lengths?', lines: { n: 2, key: 'So everyone gets the same count for the same length.' } },
          { q: 'Draw a line 3 big units long. How many small units, half the size?', draw: { h: 60, key: '6 small units.' } },
          { q: 'Would you measure a hallway in cubes or in steps? Why?', lines: { n: 2, key: 'Steps: a bigger unit means less counting.' } }]
      }
    },

    'cm-m': {
      watch: 'mixing up cm and m. A metre is about a big step; a centimetre is about a fingertip.',
      goal: 'I can use centimetres and metres.',
      learn: {
        show: { cap: 'A fingertip is about 1 cm. A big step is about 1 m.', eq: ['100 cm = 1 m'] },
        together: [UC('a pencil', 170), UC('a hallway', 8000)],
        cue: 'Small things: centimetres. Long things: metres.',
        own: [UC('a crayon', 90), UC('a classroom', 9000), CV('2 m = [] cm', 200), CV('300 cm = [] m', 3)]
      },
      p1: {
        show: { cap: '1 m is 100 cm', eq: ['1 m = 100 cm'] },
        items: [UC('a spoon', 150), UC('a swimming pool', 25000), UC('a book', 250), UC('a bus', 12000), CV('1 m = [] cm', 100), CV('4 m = [] cm', 400)]
      },
      p2: {
        items: [CV('500 cm = [] m', 5), CV('1 m + 20 cm = [] cm', 120), CP('1 m', '90 cm'), CP('150 cm', '2 m'), CP('100 cm', '1 m'), CP('3 m', '250 cm')]
      },
      p3: {
        items: [story('{a} is 1 m and 25 cm tall. 1 m is 100 cm. How many cm is that?', 'cm', 125, '100 + 25'), story('A ribbon is 1 m (100 cm) long. {b} cuts off 40 cm. How much is left?', 'cm', 60, '100 − 40'),
          story('{a} jumps 80 cm, then 70 cm. How far in all?', 'cm', 150, '80 + 70'), CP('1 m 5 cm', '150 cm'),
          { q: 'Name something about 1 m long.', lines: { n: 1, key: 'For example: a guitar, a baseball bat, a big step.' } }]
      },
      think: {
        items: [{ q: '{b} says the door is 2 cm tall. What went wrong?', lines: { n: 2, key: '{b} used the wrong unit: it is about 2 m.' } },
          { q: 'Why do we have both cm and m?', lines: { n: 2, key: 'Small lengths fit cm; long lengths would need too many cm, so we use m.' } },
          { q: 'Show 1 m on the floor with your hands or a string. What is about as long?', lines: { n: 2, key: 'Answers will vary: for example, a desk.' } },
          { q: 'Which is longer: 99 cm or 1 m? How do you know?', lines: { n: 2, key: '1 m: it is 100 cm.' } }]
      }
    },

    zero: {
      watch: 'starting at the end of the ruler instead of 0. Line up the end with 0.',
      goal: 'I can measure with a ruler from 0.',
      learn: {
        show: { pic: ['ruler', { len: 6, from: 0, max: 10 }], cap: 'Starts at 0, ends at 6', eq: ['6 cm'] },
        together: [RL(4), RL(7)],
        cue: 'Line up one end with 0. Read the number at the other end.',
        own: [RL(3), RL(9)]
      },
      p1: {
        show: { pic: ['ruler', { len: 2, from: 0, max: 10 }], cap: 'From 0 to 2', eq: ['2 cm'] },
        items: [RL(1), RL(6), RL(10), RL(2), RL(5), RL(4)]
      },
      p2: {
        items: [RL(7), RL(3),
          { q: 'Draw a line 5 cm long.', draw: { h: 20, key: 'A line from 0 to 5 on a ruler.' } }, { q: 'Draw a line 8 cm long.', draw: { h: 20, key: 'A line from 0 to 8 on a ruler.' } },
          { q: 'Measure your pencil with a ruler.', lines: { n: 1, key: 'Answers will vary: check it starts at 0.' } }, { q: 'Measure your thumb.', lines: { n: 1, key: 'About 5 or 6 cm.' } }]
      },
      p3: {
        items: [RL(9), RL(6), story('Two ribbons: 6 cm and 9 cm. How much longer is the second?', 'cm', 3, '9 − 6'), story('{a} lays a 7 cm stick and a 5 cm stick end to end. How long?', 'cm', 12, '7 + 5')]
      },
      think: {
        items: [{ q: '{a} lined up the end of the ruler, not 0. What will go wrong?', lines: { n: 2, key: 'The reading will be off, because the ruler starts a little before 0.' } },
          { q: 'Why do rulers use the same size of centimetre?', lines: { n: 2, key: 'So everyone gets the same length.' } },
          { q: 'Draw a line 4 cm long, then one 2 cm longer.', draw: { h: 40, key: 'A 4 cm line and a 6 cm line.' } },
          { q: 'How can you measure something longer than your ruler?', lines: { n: 2, key: 'Mark where the ruler ends, move it along, and add the parts.' } }]
      }
    },

    shift: {
      watch: 'reading the number at the end when it does not start at 0. Count the spaces, or take away the start.',
      goal: 'I can measure when it does not start at 0.',
      learn: {
        show: { pic: ['ruler', { len: 4, from: 2, max: 10 }], cap: 'From 2 to 6: count the spaces', eq: ['6 − 2 = 4 cm'] },
        together: [RL(3, 1), RL(5, 3)],
        cue: 'Count the centimetre spaces, not the marks. Or take away the start from the end.',
        own: [RL(4, 4), SB(3, 8)]
      },
      p1: {
        show: { pic: ['ruler', { len: 3, from: 5, max: 10 }], cap: 'From 5 to 8', eq: ['8 − 5 = 3 cm'] },
        items: [RL(2, 2), RL(5, 1), RL(3, 6), SB(2, 9), SB(4, 10), SB(5, 8)]
      },
      p2: {
        items: [RL(6, 3), RL(4, 5), SB(12, 20), SB(15, 22),
          { q: '{a} says the ribbon from 3 to 7 is 7 cm. What went wrong?', lines: { n: 2, key: '{a} read the end only. It is 7 − 3 = 4 cm.' }, wide: true }]
      },
      p3: {
        items: [RL(7, 2), SB(25, 40), SB(30, 55),
          { q: 'The ruler is broken and starts at 3. How can you still measure?', lines: { n: 2, key: 'Start at 3 and take 3 away from the end number.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why do we count spaces, not marks?', lines: { n: 2, key: 'Each space is 1 cm long. The marks are the edges.' } },
          { q: 'Draw a ribbon from 2 to 7 on a ruler. How long is it?', draw: { h: 50, key: '5 cm.' } },
          { q: 'Two ribbons start at different numbers. How can you tell which is longer?', lines: { n: 2, key: 'Find each length by taking away the start, then compare.' } },
          { q: 'Would starting at 1 instead of 0 ever give the right answer?', lines: { n: 2, key: 'Yes, if you take away 1.' } }]
      }
    },

    practise: {
      watch: 'not checking where it starts. Look at the start first, every time.',
      goal: 'I can read any ruler.',
      learn: {
        show: { pic: ['ruler', { len: 5, from: 3, max: 10 }], cap: 'Starts at 3: take it away', eq: ['8 − 3 = 5 cm'] },
        together: [RL(6), RL(4, 2)],
        cue: 'Where does it start? At 0, read the end. Not at 0, take away the start.',
        own: [RL(8), RL(3, 5)]
      },
      p1: {
        show: { cap: 'Start at 0: read the end', eq: ['Start at 4: end − 4'] },
        items: [RL(9), RL(5, 4), RL(1, 7), RL(6, 2), RL(4), RL(3, 3)]
      },
      p2: {
        items: [RL(8, 1), RL(2, 8), story('A 15 cm pencil and a 9 cm crayon. How much longer is the pencil?', 'cm', 6, '15 − 9'), story('{a} has a 30 cm ribbon and cuts 12 cm. How much is left?', 'cm', 18, '30 − 12'),
          CP('45 cm', '54 cm'), CP('1 m', '100 cm')]
      },
      p3: {
        items: [RL(6, 4), RL(9, 1), story('3 sticks, each 10 cm, end to end. How long?', 'cm', 30, '10 + 10 + 10'), story('A shelf is 85 cm. A book box is 40 cm. How much space is left?', 'cm', 45, '85 − 40')]
      },
      think: {
        items: [{ q: 'What is the first thing you check on a ruler? Why?', lines: { n: 2, key: 'Where the thing starts: at 0 or not.' } },
          { q: 'Write a measuring tip for a younger child.', lines: { n: 2, key: 'For example: line it up with 0 and keep it straight.' } },
          { q: 'Draw a line 6 cm long that does not start at 0.', draw: { h: 40, key: 'For example: from 2 to 8.' } },
          { q: 'How could you measure a curved line?', lines: { n: 2, key: 'Lay a string along it, then measure the string.' } }]
      }
    },

    tunits: {
      watch: 'choosing hours for short things. Seconds: a blink. Minutes: brushing teeth. Hours: a school day.',
      goal: 'I can choose seconds, minutes or hours.',
      learn: {
        show: { cap: 'A blink: seconds. Brushing teeth: minutes. A school day: hours.', eq: ['60 seconds = 1 minute', '60 minutes = 1 hour'] },
        together: [DU('Clap your hands', 1), DU('Eat lunch', 1200)],
        cue: 'Think how long it really takes. Pick the unit that gives a small count.',
        own: [DU('Sleep at night', 36000), DU('Tie a shoe', 20), DU('Bake a cake', 2700), DU('A hockey game', 7200)]
      },
      p1: {
        show: { cap: 'Brushing teeth takes about 2 minutes', eq: ['minutes'] },
        items: [DU('Sneeze', 1), DU('Walk to school', 900), DU('A school day', 23400), DU('Write your name', 10), DU('Read a book', 1500), DU('A car trip to the lake', 14400)]
      },
      p2: {
        items: [CV('1 minute = [] seconds', 60), CV('1 hour = [] minutes', 60), CV('2 minutes = [] seconds', 120), CV('2 hours = [] minutes', 120),
          { q: 'How many times can you clap in 10 seconds? Try it.', lines: { n: 1, key: 'Answers will vary: about 20.' } }, { q: 'Name something that takes about 1 hour.', lines: { n: 1, key: 'For example: a swim lesson or a movie.' } }]
      },
      p3: {
        items: [story('{a} reads for 20 minutes, then 15 minutes. How long in all?', 'minutes', 35, '20 + 15'), story('A song lasts 60 seconds. {b} plays it 2 times. How many seconds?', 'seconds', 120, '60 + 60'),
          story('A movie is 90 minutes. {a} has watched 45. How many minutes are left?', 'minutes', 45, '90 − 45'), DU('Watch a long movie', 7200)]
      },
      think: {
        items: [{ q: '{b} says brushing teeth takes 2 hours. What went wrong?', lines: { n: 2, key: '{b} meant minutes. 2 hours is far too long.' } },
          { q: 'Which is longer: 1 minute or 50 seconds? How do you know?', lines: { n: 2, key: '1 minute: it is 60 seconds.' } },
          { q: 'List 3 things you do in minutes.', lines: { n: 2, key: 'For example: get dressed, eat breakfast, walk the dog.' } },
          { q: 'Why don\'t we time a sleepover in seconds?', lines: { n: 2, key: 'The count would be huge. Hours give a small count.' } }]
      }
    },

    elapsed: {
      watch: 'counting the starting hour. Count the jumps of the hour hand.',
      goal: 'I can count how many hours have passed.',
      learn: {
        show: { pic: ['row', { list: [['clock', { h: 2, m: 0, R: 22 }], ['clock', { h: 5, m: 0, R: 22 }]], gap: 16 }], cap: '2 o\'clock to 5 o\'clock: 3, 4, 5', eq: ['3 hours'] },
        together: [HR(1, 3), HR(9, 12)],
        cue: 'Put your finger on the start. Count each jump to the next hour.',
        own: [HR(4, 8), HR(10, 1)]
      },
      p1: {
        show: { cap: '7 o\'clock to 9 o\'clock', eq: ['2 hours'] },
        items: [HR(3, 4), HR(6, 9), HR(8, 12), HR(11, 2)]
      },
      p2: {
        items: [story('School starts at 9 o\'clock and lunch is at 12 o\'clock. How many hours?', 'hours', 3, '12 − 9'), story('{a} goes to the park at 2 o\'clock and comes home at 4 o\'clock. How many hours?', 'hours', 2, '4 − 2'),
          story('A party starts at 1 o\'clock and ends at 5 o\'clock. How long is it?', 'hours', 4, '5 − 1'), story('{b} sleeps from 8 o\'clock at night to 7 o\'clock, past 12. How many hours?', 'hours', 11, '12 − 8 + 7')]
      },
      p3: {
        items: [story('A hockey practice starts at 6 o\'clock and lasts 2 hours. When does it end?', 'o\'clock', 8, '6 + 2'), story('A trip starts at 10 o\'clock and lasts 3 hours, past 12. When does it end?', 'o\'clock', 1, '10 + 3 − 12'),
          story('{a} gets home at 4 o\'clock after 3 hours at a game. When did it start?', 'o\'clock', 1, '4 − 3'), HR(7, 10)]
      },
      think: {
        items: [{ q: '{b} counted 2, 3, 4, 5 for 2 o\'clock to 5 o\'clock and said 4 hours. What went wrong?', lines: { n: 2, key: '{b} counted the start. Count the jumps: 3 hours.' } },
          { q: 'How many hours from 11 o\'clock to 1 o\'clock? Show how you know.', lines: { n: 2, key: '2 hours: 12, then 1.' } },
          { q: 'Draw two clocks 3 hours apart.', draw: { h: 70, key: 'For example: 2 o\'clock and 5 o\'clock.' } },
          { q: 'What do you do that takes about 2 hours?', lines: { n: 2, key: 'For example: a movie or a visit to grandma.' } }]
      }
    }
  } });
})();
