/* Grade 1 Sorting and Picture Graphs: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per
   idea of the lessons in chapters/data.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at
   random, so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things.
   Ontario 2020: D1.1 sort by one attribute; D1.2 collect data and use tally tables; D1.3 picture graphs (one picture for
   one); D1.4 and D1.5 read the data: most, least, how many, how many more, in all; D2.1 impossible, possible, certain.
   The answer checks are in tests/verify/sheets.js: sorting counts from the blocks, tally counts from the marks, values,
   totals and differences from the table or graph, the most or least, and chances from what is in the bag. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var HOLD = { circle: [0, 'c'], square: [0, 'q'], triangle: [0, 't'], shaded: [1, 'd'], white: [1, 'w'], big: [2, 'B'], small: [2, 's'] };
  /* how many blocks fit the labels? (c circle, q square, t triangle; d shaded, w white; B big, s small) */
  function TC(list, is) {
    var n = list.filter(function (x) { return is.every(function (l) { return x[HOLD[l][0]] === HOLD[l][1]; }); }).length;
    var shape = is.filter(function (l) { return HOLD[l][0] === 0; })[0], adj = is.filter(function (l) { return l !== shape; }), noun = shape ? shape + 's' : 'blocks';
    return { q: 'How many ' + adj.concat([noun]).join(' ') + '?', pic: ['tray', { list: list }], eq: ['[] ' + noun], a: [n], cnt: { is: is } };
  }
  function TL(cats, vals, head) { return ['tally', { cats: cats, vals: vals, head: head || 'Tally' }]; }
  function PG(title, cats, vals) { return ['picto', { title: title, cats: cats, vals: vals, key: 1, unit: 'child' }]; }
  function val(p, cats) { var d = p[1]; return cats.reduce(function (t, c) { return t + d.vals[d.cats.indexOf(c)]; }, 0); }
  /* count the tally marks */
  function TB(cats, vals) { return { q: 'Count the tally marks. Write the numbers.', pic: ['tally', { cats: cats, vals: vals, head: 'Tally', blank: true }], a: vals.slice() }; }
  /* read a value, a total, or how many more */
  function RD(p, q, unit, a, b) {
    var d = { op: b ? 'more' : a && a.length === 1 ? 'value' : 'total' }; if (a) d.a = a; if (b) d.b = b;
    return { q: q, pic: p, eq: ['[] ' + unit], a: [b ? val(p, a) - val(p, b) : val(p, a || p[1].cats)], look: d };
  }
  /* the most or the least */
  function MO(p, op, opts) {
    var o = opts || p[1].cats, v = o.map(function (c) { return val(p, [c]); }), best = op === 'most' ? Math.max.apply(null, v) : Math.min.apply(null, v);
    return { q: 'Which has the ' + op + '?', pic: p, pick: { opts: o, ans: v.indexOf(best) }, look: { op: op } };
  }
  /* impossible, possible or certain, from the bag */
  var CPI = ['impossible', 'possible', 'certain'];
  function BG(c, of) {
    var n = 0, k = c[of] || 0; for (var x in c) n += c[x];
    return { q: 'Pick one. Getting ' + of + ' is ...', pic: ['bag', { c: c }], pick: { opts: CPI, ans: k === 0 ? 0 : k === n ? 2 : 1, cpi: of } };
  }
  var T1 = ['cdB', 'qwB', 'tds', 'cws', 'qds', 'cdB', 'tws'], T2 = ['qwB', 'tdB', 'cws', 'qds', 'cdB', 'qws'], T3 = ['tdB', 'tws', 'cds', 'qwB', 'tdB', 'cws', 'qds', 'tws'];
  var FR = TL(['apple', 'pear', 'plum'], [5, 3, 7]), PET = TL(['dog', 'cat', 'fish'], [8, 6, 2]), SN = TL(['hockey', 'skating', 'sledding'], [6, 9, 4]);
  var BK = TL(['red', 'blue', 'green'], [4, 11, 6]), WX = TL(['sunny', 'cloudy', 'rainy', 'snowy'], [7, 5, 3, 6]);
  var G1 = PG('Favourite fruit', ['apple', 'pear', 'plum'], [4, 2, 5]), G2 = PG('Pets', ['dog', 'cat', 'fish'], [6, 3, 1]), G3 = PG('Snacks', ['corn', 'peas', 'rice'], [3, 6, 4]);
  var G4 = PG('Boots', ['red', 'blue', 'black'], [2, 5, 7]), G5 = PG('Trips', ['park', 'pool', 'farm'], [7, 4, 6]);

  S.register('data', { code: 'DA', ideas: {

    rule: {
      watch: 'putting one block in two groups, or changing the rule halfway. One rule; each block goes in one group.',
      goal: 'I can sort things by one rule and count each group.',
      learn: {
        show: { pic: ['tray', { list: ['cdB', 'cws', 'qwB'] }], cap: 'Rule: circles or not', eq: ['2 circles, 1 not'] },
        together: [TC(T1, ['circle']), TC(T1, ['shaded'])],
        cue: 'Say the rule. Touch each block once.',
        own: [TC(T2, ['square']), TC(T2, ['big'])]
      },
      p1: { show: { eq: ['Rule: big or small'] }, items: [TC(T1, ['big']), TC(T1, ['small']), TC(T1, ['triangle']), TC(T2, ['white']), TC(T2, ['shaded']), TC(T2, ['circle'])] },
      p2: { items: [TC(T3, ['triangle']), TC(T3, ['white']), TC(T3, ['big']), TC(T3, ['small']), TC(T3, ['square']), TC(T3, ['shaded'])] },
      p3: { items: [TC(T3, ['triangle', 'shaded']), TC(T1, ['circle', 'big']), TC(T2, ['square', 'white']), TC(T3, ['white', 'small']), TC(T1, ['shaded', 'small']), TC(T2, ['big', 'shaded'])] },
      think: {
        items: [{ q: 'Sort your socks. What rule did you use?', lines: { n: 2, key: 'For example: by colour, by size, or striped and plain.' } },
          { q: '{a} put a big circle in "big" and in "circles". Is that one rule?', lines: { n: 2, key: 'No. That is two rules. Sort by one rule, so each block goes in one group.' } },
          TC(T3, ['circle']),
          { q: 'Name 3 ways to sort these blocks.', pic: ['tray', { list: T1 }], lines: { n: 2, key: 'By shape, by colour (shaded or white), by size (big or small).' } }]
      }
    },

    marks: {
      watch: 'drawing the fifth mark as a sixth line. The fifth mark crosses the four.',
      goal: 'I can make and read tally marks.',
      learn: {
        show: { cap: 'Four lines, then a line across', eq: ['5 and 2 more: 7'] },
        together: [TB(['red', 'blue'], [3, 6]), RD(FR, 'How many chose plum?', 'children', ['plum'])],
        cue: 'Count the bundle of 5 first. Then count on.',
        own: [TB(['cats', 'dogs'], [8, 4]), RD(PET, 'How many chose dog?', 'children', ['dog'])]
      },
      p1: { show: { eq: ['a bundle is 5'] }, items: [TB(['ants', 'bees'], [2, 5]), TB(['kites', 'boats'], [9, 6]), RD(FR, 'How many chose apple?', 'children', ['apple']), RD(SN, 'How many chose skating?', 'children', ['skating'])] },
      p2: { items: [TB(['owls', 'deer', 'fox'], [12, 4, 8]), TB(['hats', 'mitts'], [10, 7]), RD(BK, 'How many chose blue?', 'children', ['blue']), RD(FR, 'How many chose apple or pear?', 'children', ['apple', 'pear'])] },
      p3: { items: [TB(['loons', 'jays', 'crows'], [15, 9, 13]), RD(SN, 'How many in all?', 'children'), RD(BK, 'How many more chose blue than red?', 'children', ['blue'], ['red']), RD(PET, 'How many in all?', 'children')] },
      think: {
        items: [{ q: 'Show 13 with tally marks.', draw: { h: 40, key: 'Two bundles of 5 and 3 more lines.' } },
          { q: 'Why do we cross every fifth mark?', lines: { n: 2, key: 'Bundles of 5 are quick to count: 5, 10, 15, then count on.' } },
          { q: 'Ask 5 people: dogs or cats? Make a tally.', lines: { n: 2, key: 'Answers vary. The tallies should add up to 5.' } },
          RD(PET, 'How many more chose cat than fish?', 'children', ['cat'], ['fish'])]
      }
    },

    picto: {
      watch: 'drawing pictures of different sizes or with gaps. One picture for each, all the same size, lined up.',
      goal: 'I can read a picture graph where each picture is one.',
      learn: {
        show: { cap: 'Each picture is one child', eq: ['3 pictures: 3 children'] },
        together: [RD(G1, 'How many chose pear?', 'children', ['pear']), MO(G1, 'most')],
        cue: 'Count the pictures in each row. Each picture is one.',
        own: [RD(G2, 'How many chose dog?', 'children', ['dog']), MO(G2, 'least')]
      },
      p1: { show: { eq: ['1 picture = 1 child'] }, items: [RD(G1, 'How many chose apple?', 'children', ['apple']), RD(G1, 'How many chose plum?', 'children', ['plum']), RD(G2, 'How many chose cat?', 'children', ['cat']), RD(G3, 'How many chose peas?', 'children', ['peas'])] },
      p2: { items: [MO(G3, 'most'), MO(G3, 'least'), RD(G4, 'How many chose black?', 'children', ['black']), MO(G4, 'least')] },
      p3: { items: [RD(G5, 'How many chose farm?', 'children', ['farm']), MO(G5, 'least'), RD(G4, 'How many chose red?', 'children', ['red']), MO(G2, 'most')] },
      think: {
        items: [{ q: 'Make a picture graph: 3 like rain, 5 like snow.', draw: { h: 70, key: 'Two rows: 3 pictures for rain and 5 for snow, the same size and lined up.' } },
          { q: '{b} drew big pictures for one row. Why is that a problem?', lines: { n: 2, key: 'Big pictures make the row look like more. Each picture must be the same size.' } },
          MO(G5, 'most'),
          { q: 'Give your graph a title. Why does it need one?', lines: { n: 2, key: 'The title tells what the graph is about.' } }]
      }
    },

    read: {
      watch: 'adding when the question asks how many more. "How many more" compares two rows.',
      goal: 'I can answer questions about a graph.',
      learn: {
        show: { cap: '5 chose dog, 3 chose cat', eq: ['5 − 3 = 2 more'] },
        together: [RD(G1, 'How many more chose plum than pear?', 'children', ['plum'], ['pear'])],
        cue: 'In all: add. How many more: subtract.',
        own: [{ q: '6 chose peas and 3 chose corn. How many in all?', eq: ['[] children'], a: [9], calc: '6 + 3' }]
      },
      p1: { show: { eq: ['in all: add every row'] }, items: [RD(G2, 'How many in all?', 'children'), RD(G4, 'How many in all?', 'children'), RD(G2, 'How many more chose dog than cat?', 'children', ['dog'], ['cat']), RD(G4, 'How many more chose black than red?', 'children', ['black'], ['red'])] },
      p2: { items: [RD(G5, 'How many in all?', 'children'), RD(G5, 'How many more chose park than pool?', 'children', ['park'], ['pool']), RD(G1, 'How many chose apple or plum?', 'children', ['apple', 'plum']), RD(G3, 'How many more chose rice than corn?', 'children', ['rice'], ['corn'])] },
      p3: { items: [RD(WX, 'How many days in all?', 'days'), RD(WX, 'How many more snowy days than rainy?', 'days', ['snowy'], ['rainy']), RD(G4, 'How many more chose blue than red?', 'children', ['blue'], ['red']), RD(SN, 'How many chose hockey or sledding?', 'children', ['hockey', 'sledding'])] },
      think: {
        items: [{ q: 'Write one thing the Pets graph tells you.', pic: G2, lines: { n: 2, key: 'For example: most children chose dog; only 1 chose fish.' } },
          { q: 'Should the class snack be corn, peas or rice? Why?', pic: G3, lines: { n: 2, key: 'Peas: the most children chose it.' } },
          RD(G5, 'How many more chose farm than pool?', 'children', ['farm'], ['pool']),
          { q: 'Another class will vote on trips. Predict their top trip. Why?', pic: G5, lines: { n: 1, key: 'Park is a good guess: it was the top trip here. Their votes may still be different.' } }]
      }
    },

    words: {
      watch: 'calling unlikely things impossible. Possible means it might happen, even if not often.',
      goal: 'I can say if something is impossible, possible or certain.',
      learn: {
        show: { cap: 'Only red in the bag', eq: ['red: certain'] },
        together: [BG({ red: 3, blue: 2 }, 'blue'), BG({ green: 5 }, 'green')],
        cue: 'Look in the bag. None: impossible. Some: possible. All: certain.',
        own: [BG({ red: 1, green: 4 }, 'red')]
      },
      p1: { show: { eq: ['some red: possible'] }, items: [BG({ blue: 6 }, 'blue'), BG({ blue: 6 }, 'red'), BG({ red: 2, yellow: 3 }, 'yellow'), BG({ green: 3, blue: 3 }, 'red')] },
      p2: { items: [BG({ red: 2, blue: 2, green: 2 }, 'green'), BG({ red: 2, blue: 2, green: 2 }, 'yellow'), BG({ green: 7 }, 'green'), BG({ blue: 1, yellow: 5 }, 'blue')] },
      p3: { items: [BG({ red: 5, blue: 1 }, 'red'), BG({ blue: 4 }, 'green'), BG({ yellow: 3, red: 3, blue: 1 }, 'blue'), BG({ red: 6 }, 'red')] },
      think: {
        items: [{ q: 'It will snow in Canada this winter. Impossible, possible or certain?', lines: { n: 1, key: 'Certain (or very likely): it snows somewhere in Canada every winter.' } },
          { q: 'A dog will fly to school. Impossible, possible or certain?', lines: { n: 1, key: 'Impossible.' } },
          { q: 'Fill a bag so getting red is certain. What goes in?', lines: { n: 2, key: 'Only red marbles.' } },
          { q: 'Name something that is possible today.', lines: { n: 1, key: 'For example: it might rain; we might have soup for lunch.' } }]
      }
    }
  } });
})();
