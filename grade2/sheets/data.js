/* Grade 2 Data and Chance: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the
   lessons in chapters/data.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names.
   Ontario 2020: D1.1 sort by two attributes (Venn and Carroll diagrams); D1.2 collect data, in tally tables and two-way
   tables; D1.3 pictographs, bar graphs and line plots, one picture or square for each piece of data; D1.4 the mode;
   D1.5 answer questions with data; D2.1 the words impossible, possible and certain; D2.2 make and check predictions.
   The answer checks are in tests/verify/sheets.js. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  function sum(v) { return v.reduce(function (a, b) { return a + b; }, 0); }
  /* the labels the lessons sort numbers by */
  function is(l, n) {
    var m;
    if (/^not /.test(l)) return !is(l.slice(4), n);
    if (l === 'even') return n % 2 === 0;
    if (l === 'odd') return n % 2 === 1;
    if ((m = /^more than (\d+)$/.exec(l))) return n > +m[1];
    if ((m = /^less than (\d+)$/.exec(l))) return n < +m[1];
  }
  function all(labels, n) { return labels.every(function (l) { return is(l, n); }); }
  function vpart(n, a, b) { return is(a, n) ? (is(b, n) ? 1 : 0) : is(b, n) ? 2 : 3; }
  function cpart(n, a, b) { return (is(a, n) ? 0 : 2) + (is(b, n) ? 0 : 1); }
  function split(list, f, a, b) { var p = [[], [], [], []]; list.forEach(function (n) { p[f(n, a, b)].push(n); }); return p; }
  /* Venn diagrams: filled in (VN), numbers to sort (VS), where one number goes (VR), how many fit (VC) */
  function VN(list, a, b, R) { return ['venn', { a: a, b: b, parts: split(list, vpart, a, b), R: R || 44 }]; }
  function VS(list, a, b) { return { q: 'Sort the numbers.', pic: ['venn', { a: a, b: b, parts: split(list, vpart, a, b), list: list, blank: true, R: 46 }] }; }
  function VR(n, a, b) { return { q: 'Labels: ' + a + ', ' + b + '. Where does ' + n + ' go?', pick: { opts: [a + ' only', 'both', b + ' only', 'neither'], ans: vpart(n, a, b), region: n, a: a, b: b }, wide: true }; }
  function VC(list, a, b, labels, q) { return { q: q, pic: VN(list, a, b), eq: ['[] numbers'], a: [list.filter(function (n) { return all(labels, n); }).length], cnt: { is: labels } }; }
  /* Carroll diagrams: the same */
  function CN(list, a, b) { return ['carroll', { a: a, b: b, cells: split(list, cpart, a, b) }]; }
  function CS(list, a, b) { return { q: 'Sort the numbers.', pic: ['carroll', { a: a, b: b, cells: split(list, cpart, a, b), list: list, blank: true }] }; }
  function CR(n, a, b) { return { q: 'Rows: ' + a + '. Columns: ' + b + '. Where does ' + n + ' go?', pick: { opts: ['top left', 'top right', 'bottom left', 'bottom right'], ans: cpart(n, a, b), cell: n, a: a, b: b }, wide: true }; }
  function CC(list, a, b, labels, q) { return { q: q, pic: CN(list, a, b), eq: ['[] numbers'], a: [list.filter(function (n) { return all(labels, n); }).length], cnt: { is: labels } }; }
  /* data read from a picture: rows that name the categories ('Dog = [] votes', 'Dog − Cat = []', 'in all = []') */
  function val(p, cats) { var d = p[1]; return sum(cats.map(function (c) { return d.vals[d.cats.indexOf(c)]; })); }
  function RR(p, q, rows) {
    var d = p[1];
    return { q: q, pic: p, eq: rows, a: rows.map(function (r) {
      var t = 0, sign = 1;
      r.split(' = ')[0].replace('in all', d.cats.join(' + ')).split(' ').forEach(function (k) { if (k === '+') sign = 1; else if (k === '−') sign = -1; else if (d.cats.indexOf(k) >= 0) t += sign * d.vals[d.cats.indexOf(k)]; });
      return t;
    }) };
  }
  /* the most or the least: the mode is the most */
  function MO(p, q, op, opts) { var v = opts.map(function (c) { return val(p, [c]); }), best = op === 'most' ? Math.max.apply(null, v) : Math.min.apply(null, v); return { q: q, pic: p, pick: { opts: opts, ans: v.indexOf(best) }, look: { op: op } }; }
  function TF(p, q, say, a) { return { q: q, pic: p, pick: { opts: ['true', 'false'], ans: val(p, a) === say ? 0 : 1 }, look: { op: 'value', a: a, say: say } }; }
  function TL(cats, vals, head, blank) { return ['tally', { cats: cats, vals: vals, head: head, blank: blank }]; }
  function PG(title, cats, vals) { return ['picto', { title: title, cats: cats, vals: vals, key: 1, unit: 'vote' }]; }
  function BG(title, cats, vals, max) { return ['bar', { title: title, cats: cats, vals: vals, max: max, step: 1, h: 56 }]; }
  /* a two-way table: rows 'Gr 2' and 'Gr 3', and the columns given; a cell is read as 'Walk in Gr 2' */
  function TW(cols, vals) { return ['twoway', { rows: ['Gr 2', 'Gr 3'], cols: cols, vals: vals }]; }
  function TWR(p, q, rows) {
    var d = p[1], cell = function (k) { var m = k.match(/^(.+) in (.+)$/); return d.vals[d.rows.indexOf(m[2])][d.cols.indexOf(m[1])]; };
    return { q: q, pic: p, eq: rows, wide: rows.some(function (r) { return r.length > 22; }), a: rows.map(function (r) { var t = 0, sign = 1; r.split(' = ')[0].split(/ ([+−]) /).forEach(function (k) { if (k === '+') sign = 1; else if (k === '−') sign = -1; else t += sign * cell(k); }); return t; }) };
  }
  /* the mode of numbers (a line plot) */
  function modeOf(v) { var c = {}, top = 0, m = []; v.forEach(function (x) { c[x] = (c[x] || 0) + 1; top = Math.max(top, c[x]); }); for (var k in c) if (c[k] === top) m.push(+k); return top < 2 ? 'none' : m.sort(function (x, y) { return x - y; }).join(' and '); }
  function MD(v, q, p) { var m = modeOf(v); return { q: q || 'Find the mode: ' + v.join(', ') + '.', pic: p, eq: ['mode = []'], a: [m === 'none' ? 'none' : +m], vals: { v: v } }; }
  function PL(v, lo, hi) { return ['plot', { lo: lo, hi: hi, v: v }]; }
  /* chance in three words */
  var W3 = ['impossible', 'possible', 'certain'];
  function cw(k, n) { return k === 0 ? 'impossible' : k === n ? 'certain' : 'possible'; }
  function count(p) { var c = {}, k; if (p[0] === 'bag') for (k in p[1].c) c[k] = p[1].c[k]; else p[1].parts.forEach(function (x) { c[x] = (c[x] || 0) + 1; }); return c; }
  function total(c) { var t = 0; for (var k in c) t += c[k]; return t; }
  function CW(p, of, q) { var c = count(p); return { q: q || (p[0] === 'bag' ? 'Pick one. Getting ' : 'Spin. Landing on ') + of + ' is…', pic: p, pick: { opts: W3, ans: W3.indexOf(cw(c[of] || 0, total(c))), chanceOf: { of: of } } }; }
  function CB(c, of) {
    var said = Object.keys(c).map(function (x) { return c[x] + ' ' + x; }).join(' and ');
    return { q: 'A bag has ' + said + '. Getting ' + of + ' is…', pick: { opts: W3, ans: W3.indexOf(cw(c[of] || 0, total(c))), chanceOf: { of: of } }, chances: c, wide: true };
  }
  function LK(p, opts) { var c = count(p), v = opts.map(function (o) { return c[o] || 0; }); return { q: 'Which is most likely?', pic: p, pick: { opts: opts, ans: v.indexOf(Math.max.apply(null, v)), likely: 'most' } }; }
  function BAG(c) { return ['bag', { c: c }]; }
  function SPN(parts) { return ['spinner', { parts: parts }]; }

  var SN = [4, 13, 8, 16, 3, 12, 19], FRUIT = ['Apple', 'Pear', 'Grapes'], PET = ['Dog', 'Cat', 'Fish'];

  S.register('data', { code: 'DT', ideas: {

    venn: {
      watch: 'putting a number that fits both labels in one circle only. Ask both questions for each number.',
      goal: 'I can sort in a Venn diagram.',
      learn: {
        show: { pic: VN(SN, 'even', 'more than 10', 36), cap: '12 and 16 fit both labels', eq: ['3 and 13 ... check each one'] },
        together: [VR(14, 'even', 'more than 10'), VR(7, 'even', 'more than 10')],
        cue: 'Ask both questions. Yes and yes: the overlap. No and no: outside.',
        own: [VR(15, 'even', 'more than 10')]
      },
      p1: {
        items: [VS([6, 15, 8, 11, 20, 3], 'even', 'more than 10'), VR(18, 'even', 'more than 10'), VR(9, 'odd', 'less than 5')]
      },
      p2: {
        items: [VC(SN, 'even', 'more than 10', ['even'], 'How many numbers are even?'), VC(SN, 'even', 'more than 10', ['even', 'more than 10'], 'How many fit both labels?'),
          VS([4, 13, 20, 9, 16, 1], 'odd', 'less than 10')]
      },
      p3: {
        items: [VS([14, 3, 30, 27, 12, 8, 21], 'odd', 'more than 20'),
          VC([14, 3, 30, 27, 12, 8, 21], 'odd', 'more than 20', ['not odd', 'not more than 20'], 'How many fit neither label?'),
          { q: 'Write a number that goes in the overlap of "even" and "more than 50".', lines: { n: 1, key: 'For example: 60.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why does a number that fits both labels go in the overlap?', lines: { n: 2, key: 'It belongs in both circles, and the overlap is inside both.' } },
          { q: 'Where do things that fit neither label go?', lines: { n: 2, key: 'Outside both circles, inside the box.' } },
          { q: 'Labels: even, odd. Why is the overlap empty?', lines: { n: 2, key: 'No number is both even and odd.' } },
          { q: 'Sort your family by two labels, such as "wears glasses" and "taller than me".', lines: { n: 2, key: 'Answers will vary.' } }]
      }
    },

    carroll: {
      watch: 'reading only the row or only the column. Point to the row, then slide along to the column.',
      goal: 'I can sort in a Carroll diagram.',
      learn: {
        show: { pic: CN(SN, 'even', 'more than 10'), cap: 'Every number fits exactly one box', eq: ['16: even, more than 10'] },
        together: [CR(14, 'even', 'more than 10'), CR(5, 'even', 'more than 10')],
        cue: 'Row first: yes is the top row. Then column: yes is the left column.',
        own: [CR(11, 'even', 'more than 10')]
      },
      p1: {
        items: [CS([12, 5, 9, 20, 3, 16], 'odd', 'more than 10'), CR(21, 'odd', 'more than 10'), CR(4, 'odd', 'more than 10')]
      },
      p2: {
        items: [CC(SN, 'even', 'more than 10', ['even', 'more than 10'], 'How many are even and more than 10?'), CC(SN, 'even', 'more than 10', ['not even'], 'How many are not even?'),
          CS([8, 15, 22, 7, 30, 11], 'even', 'more than 12')]
      },
      p3: {
        items: [CS([2, 17, 24, 9, 40, 13, 6], 'even', 'less than 15'), CR(15, 'even', 'less than 15'),
          { q: 'How are a Carroll diagram and a Venn diagram alike?', lines: { n: 2, key: 'Both sort by two labels into four groups.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} put 13 in "even, more than 10". What went wrong?', lines: { n: 2, key: '13 is odd: it goes in the bottom row, left column.' } },
          { q: 'Why does every number fit exactly one box?', lines: { n: 2, key: 'Each number is either yes or no for each label.' } },
          { q: 'Make up two labels for sorting toys.', lines: { n: 2, key: 'For example: has wheels, is red.' } },
          { q: 'Can a box be empty? Give an example.', lines: { n: 2, key: 'Yes: "even" and "odd" leave the both box empty.' } }]
      }
    },

    marks: {
      watch: 'drawing a fifth line beside the others. The fifth mark crosses the four.',
      goal: 'I can use tally marks.',
      learn: {
        show: { cap: 'A bundle of 5 and 2 more', eq: ['5, 6, 7'] },
        together: [RR(TL(['Red', 'Blue'], [6, 9], ['Colour']), 'How many chose Red?', ['Red = [] votes']), RR(TL(['Red', 'Blue'], [6, 9], ['Colour']), 'How many chose Blue?', ['Blue = [] votes'])],
        cue: 'Each bundle is 5. Count by 5s, then count on the ones.',
        own: [RR(TL(['Dog', 'Cat'], [12, 8], ['Pet']), 'How many chose Dog?', ['Dog = [] votes']), RR(TL(['Dog', 'Cat'], [12, 8], ['Pet']), 'How many chose Cat?', ['Cat = [] votes'])]
      },
      p1: {
        items: [{ q: 'Write the counts.', pic: TL(['Hockey', 'Soccer', 'Swim'], [8, 11, 5], ['Sport'], true), a: [8, 11, 5] },
          { q: 'Write the counts.', pic: TL(PET, [10, 7, 3], ['Pet'], true), a: [10, 7, 3] },
          RR(TL(FRUIT, [9, 6, 4], ['Fruit']), 'How many in all?', ['in all = [] votes']), MO(TL(FRUIT, [9, 6, 4], ['Fruit']), 'Which was chosen most?', 'most', FRUIT)]
      },
      p2: {
        items: [RR(TL(['Rain', 'Sun', 'Snow'], [6, 13, 9], ['Weather']), 'Add, or take away?', ['Sun − Rain = []', 'Rain + Snow = []']),
          RR(TL(PET, [12, 8, 5], ['Pet']), 'Add, or take away?', ['Dog − Fish = []', 'in all = []']),
          { q: 'Draw tally marks for 13.', draw: { h: 30, key: 'Two bundles of 5 and 3 more.' } }, { q: 'Draw tally marks for 17.', draw: { h: 30, key: 'Three bundles of 5 and 2 more.' } }]
      },
      p3: {
        items: [RR(TL(['Apple', 'Pear', 'Plum'], [14, 9, 6], ['Fruit']), 'Work it out.', ['in all = [] votes', 'Apple − Plum = []']),
          TF(TL(['Apple', 'Pear', 'Plum'], [14, 9, 6], ['Fruit']), '{a} says 4 chose Apple. True or false?', 4, ['Apple']),
          { q: 'Ask 10 people a question. Keep a tally.', lines: { n: 3, key: 'Answers will vary: the tallies should add to 10.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why do we cross the fifth tally mark?', lines: { n: 2, key: 'To make bundles of 5 that are quick to count.' } },
          { q: '{b} drew 6 lines in a row for 6. Why is that harder to read?', lines: { n: 2, key: 'You must count every line. A bundle of 5 and 1 is faster.' } },
          { q: 'Write a question you could ask your class. List 3 answers.', lines: { n: 3, key: 'For example: favourite season? winter, summer, fall.' } },
          { q: 'How is a tally table like counting on your fingers?', lines: { n: 2, key: 'Each mark is one, and a hand of 5 is a bundle.' } }]
      }
    },

    twoway: {
      watch: 'reading across the wrong row. Find the row, then go along to the column.',
      goal: 'I can read a two-way table.',
      learn: {
        show: { pic: TW(['Walk', 'Ride'], [[7, 4], [3, 6]]), cap: 'Gr 2 row, Walk column', eq: ['7 Grade 2 children walk'] },
        together: [TWR(TW(['Walk', 'Ride'], [[7, 4], [3, 6]]), 'How many Grade 3 children ride?', ['Ride in Gr 3 = []']), TWR(TW(['Walk', 'Ride'], [[7, 4], [3, 6]]), 'How many Grade 2 children ride?', ['Ride in Gr 2 = []'])],
        cue: 'Put one finger on the row and one on the column. Slide them until they meet.',
        own: [TWR(TW(['Cat', 'Dog'], [[5, 8], [9, 2]]), 'How many in Grade 3 like cats?', ['Cat in Gr 3 = []']), TWR(TW(['Cat', 'Dog'], [[5, 8], [9, 2]]), 'How many in Grade 2 like dogs?', ['Dog in Gr 2 = []'])]
      },
      p1: {
        items: [TWR(TW(['Milk', 'Juice'], [[6, 5], [4, 8]]), 'How many in Grade 2 chose milk?', ['Milk in Gr 2 = []']), TWR(TW(['Milk', 'Juice'], [[6, 5], [4, 8]]), 'How many in Grade 3 chose juice?', ['Juice in Gr 3 = []']),
          TWR(TW(['Skate', 'Ski'], [[9, 3], [7, 6]]), 'How many in Grade 3 skate?', ['Skate in Gr 3 = []']), TWR(TW(['Skate', 'Ski'], [[9, 3], [7, 6]]), 'How many in Grade 2 ski?', ['Ski in Gr 2 = []'])]
      },
      p2: {
        items: [TWR(TW(['Walk', 'Ride'], [[7, 4], [3, 6]]), 'How many walk in all?', ['Walk in Gr 2 + Walk in Gr 3 = []']), TWR(TW(['Walk', 'Ride'], [[7, 4], [3, 6]]), 'How many in Grade 2 in all?', ['Walk in Gr 2 + Ride in Gr 2 = []']),
          TWR(TW(['Milk', 'Juice'], [[6, 5], [4, 8]]), 'How many more Grade 3s chose juice than milk?', ['Juice in Gr 3 − Milk in Gr 3 = []'])]
      },
      p3: {
        items: [TWR(TW(['Cat', 'Dog'], [[5, 8], [9, 2]]), 'How many children in Grade 3?', ['Cat in Gr 3 + Dog in Gr 3 = []']), TWR(TW(['Cat', 'Dog'], [[5, 8], [9, 2]]), 'How many more Grade 2s like dogs than cats?', ['Dog in Gr 2 − Cat in Gr 2 = []']),
          { q: 'Make a two-way table: boys and girls, and who likes hot or cold lunch.', draw: { h: 70, key: 'A table with 2 rows and 2 columns, and a count in each box.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why use one table for two questions?', lines: { n: 2, key: 'You can see both pieces of information about each person at once.' } },
          { q: '{a} read the Gr 2 row for a Grade 3 question. How can {a} avoid that?', lines: { n: 2, key: 'Find the row label first, then the column.' } },
          { q: 'Write a question a two-way table could answer.', lines: { n: 2, key: 'For example: how many Grade 3 children walk to school?' } },
          { q: 'How could you check the table counts everyone?', lines: { n: 2, key: 'Add all the boxes: it should be the number of people asked.' } }]
      }
    },

    bars: {
      watch: 'forgetting the title and labels. A graph needs a title, labels and where the data came from.',
      goal: 'I can read pictographs and bar graphs.',
      learn: {
        show: { cap: 'Pictograph: each picture is 1 vote. Bar graph: read across from the top of the bar.', eq: ['title, labels, source'] },
        together: [RR(PG('Favourite fruit', FRUIT, [5, 3, 6]), 'How many chose Apple?', ['Apple = [] votes']), RR(BG('Favourite pet', PET, [7, 4, 2], 8), 'How many chose Cat?', ['Cat = [] votes'])],
        cue: 'Read the title first. Then count the pictures, or read across from the top of the bar.',
        own: [RR(BG('Favourite pet', PET, [7, 4, 2], 8), 'How many chose Dog?', ['Dog = [] votes'])]
      },
      p1: {
        items: [RR(PG('Books read', ['Mon', 'Tue', 'Wed'], [4, 6, 3]), 'How many books?', ['Mon = [] books', 'Tue = [] books']),
          RR(BG('Snow days', ['Nov', 'Dec', 'Jan'], [3, 7, 8], 9), 'How many snow days?', ['Dec = [] days', 'Jan = [] days']),
          MO(BG('Snow days', ['Nov', 'Dec', 'Jan'], [3, 7, 8], 9), 'Which month had the most?', 'most', ['Nov', 'Dec', 'Jan']),
          RR(PG('Books read', ['Mon', 'Tue', 'Wed'], [4, 6, 3]), 'How many in all?', ['in all = [] books'])]
      },
      p2: {
        items: [RR(BG('Favourite sport', ['Hockey', 'Soccer', 'Swim'], [8, 5, 6], 9), 'How many more chose Hockey than Soccer?', ['Hockey − Soccer = []']),
          RR(PG('Trees planted', ['Oak', 'Maple', 'Pine'], [3, 7, 5]), 'How many more Maples than Oaks?', ['Maple − Oak = []']),
          TF(BG('Favourite sport', ['Hockey', 'Soccer', 'Swim'], [8, 5, 6], 9), '{a} says 6 chose Soccer. True or false?', 6, ['Soccer']),
          { q: 'What does every good graph need?', lines: { n: 2, key: 'A title, labels and the source of the data.' } }]
      },
      p3: {
        items: [RR(BG('Canoe trips', ['May', 'Jun', 'Jul', 'Aug'], [2, 5, 8, 6], 9), 'Work it out.', ['Jun + Jul = []', 'Aug − May = []', 'in all = [] trips']),
          { q: 'Make a bar graph: Red 4, Blue 6, Green 2. Give it a title.', draw: { h: 90, key: ['bar', { title: 'Favourite colour', cats: ['Red', 'Blue', 'Green'], vals: [4, 6, 2], max: 7, step: 1, h: 70 }] } }]
      },
      think: {
        items: [{ q: 'How are a pictograph and a bar graph alike? How are they different?', lines: { n: 3, key: 'Both show counts. One uses pictures, the other bars.' } },
          { q: '{b} made a graph with no title. Why is that a problem?', lines: { n: 2, key: 'No one knows what the data are about.' } },
          { q: 'Why must the pictures in a pictograph be the same size?', lines: { n: 2, key: 'So the longest row really has the most.' } },
          { q: 'Write a question your class could answer with a bar graph.', lines: { n: 2, key: 'For example: how do we get to school?' } }]
      }
    },

    plot: {
      watch: 'putting two × marks side by side. Stack them above the number.',
      goal: 'I can read a line plot.',
      learn: {
        show: { pic: PL([3, 5, 5, 4, 5, 3], 2, 7), cap: 'One × for each answer', eq: ['3 people said 5'] },
        together: [{ q: 'Pets at home. How many said 2?', pic: PL([1, 2, 2, 0, 2, 3, 1], 0, 4), eq: ['[] people'], a: [3], look: { a: [2] } },
          { q: 'Pets at home. How many people in all?', pic: PL([1, 2, 2, 0, 2, 3, 1], 0, 4), eq: ['[] people'], a: [7], look: {} }],
        cue: 'Each × is one answer. Count the stack above the number.',
        own: [MD([0, 1, 1, 2, 1, 3], 'Teeth lost: 0, 1, 1, 2, 1, 3. Which answer is most common?')]
      },
      p1: {
        items: [{ q: 'Siblings. How many said 0?', pic: PL([0, 1, 0, 2, 1, 0, 3], 0, 4), eq: ['[] people'], a: [3], look: { a: [0] } },
          { q: 'Siblings. How many people in all?', pic: PL([0, 1, 0, 2, 1, 0, 3], 0, 4), eq: ['[] people'], a: [7], look: {} },
          MD([0, 1, 0, 2, 1, 0, 3], 'Siblings. What is the mode?', PL([0, 1, 0, 2, 1, 0, 3], 0, 4))]
      },
      p2: {
        items: [{ q: 'Books read. How many said 4?', pic: PL([2, 4, 3, 4, 5, 4, 2], 1, 6), eq: ['[] people'], a: [3], look: { a: [4] } },
          MD([2, 4, 3, 4, 5, 4, 2], 'Books read. What is the mode?', PL([2, 4, 3, 4, 5, 4, 2], 1, 6)),
          { q: 'Draw a line plot: 2, 3, 3, 4, 3, 2.', draw: { h: 70, key: PL([2, 3, 3, 4, 3, 2], 1, 5) }, wide: true }]
      },
      p3: {
        items: [MD([6, 7, 7, 8, 6, 7], 'Shoe sizes. What is the mode?', PL([6, 7, 7, 8, 6, 7], 5, 9)),
          { q: 'Shoe sizes. How many said 6 or 7?', pic: PL([6, 7, 7, 8, 6, 7], 5, 9), eq: ['[] people'], a: [5], look: { a: [6, 7] } },
          { q: 'Ask 6 people how many pets they have. Make a line plot.', draw: { h: 70, key: 'A number line with one × for each answer.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why does a line plot work well for number answers?', lines: { n: 2, key: 'The answers sit along a number line, so you see which are common.' } },
          { q: '{a} drew × marks side by side, not stacked. What is the problem?', lines: { n: 2, key: 'You cannot tell which number they belong to.' } },
          { q: 'What does the tallest stack tell you?', lines: { n: 2, key: 'The answer given most often: the mode.' } },
          { q: 'Could you make a line plot of favourite colours? Why?', lines: { n: 2, key: 'No. Colours are words, not numbers on a line.' } }]
      }
    },

    mode: {
      watch: 'giving the count as the mode. The mode is the answer, not how many chose it.',
      goal: 'I can find the mode.',
      learn: {
        show: { pic: BG('Favourite fruit', FRUIT, [4, 2, 7], 8), cap: 'The tallest bar', eq: ['mode: Grapes'] },
        together: [MO(BG('Favourite pet', PET, [6, 8, 3], 9), 'Which is the mode?', 'most', PET), MD([3, 5, 3, 4, 3])],
        cue: 'The mode is the answer chosen most often.',
        own: [MD([2, 6, 6, 1, 6]), MD([8, 9, 8, 7])]
      },
      p1: {
        items: [MO(PG('Favourite snack', ['Apple', 'Cheese', 'Crackers'], [6, 4, 3]), 'Which is the mode?', 'most', ['Apple', 'Cheese', 'Crackers']), MD([4, 1, 4, 2, 4, 3]),
          MD([7, 8, 9, 8, 7, 8]), MO(BG('Way to school', ['Walk', 'Bus', 'Car'], [5, 8, 2], 9), 'Which is the mode?', 'most', ['Walk', 'Bus', 'Car'])]
      },
      p2: {
        items: [MD([10, 12, 10, 11, 10]), MD([5, 5, 6, 7, 7, 7]), MO(TL(['Red', 'Blue', 'Green', 'Pink'], [6, 9, 4, 7], ['Colour']), 'Which is the mode?', 'most', ['Red', 'Blue', 'Green', 'Pink']),
          { q: '{b} says the mode is 9 because 9 chose Blue. What should {b} say?', lines: { n: 1, key: 'The mode is Blue.' } }]
      },
      p3: {
        items: [MD([1, 2, 3, 2, 4, 2, 5], 'Goals in each game: 1, 2, 3, 2, 4, 2, 5. Find the mode.'), MD([20, 25, 20, 30, 25, 20], 'Minutes of reading: 20, 25, 20, 30, 25, 20. Find the mode.'),
          { q: 'Make a list of 6 numbers with a mode of 4.', lines: { n: 1, key: 'For example: 4, 4, 4, 1, 2, 6.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why is the mode useful for picking a class snack?', lines: { n: 2, key: 'It shows what most people like.' } },
          { q: 'Can a list have no mode? Give an example.', lines: { n: 2, key: 'Yes: 1, 2, 3, 4. Each number appears once.' } },
          { q: 'Is the mode always the biggest number? Why?', lines: { n: 2, key: 'No. It is the number that appears most, whatever its size.' } },
          { q: 'Ask 5 people their favourite season. What is the mode?', lines: { n: 2, key: 'Answers will vary.' } }]
      }
    },

    predict: {
      watch: 'expecting another group to match exactly. Different groups can give different results.',
      goal: 'I can predict and check with data.',
      learn: {
        show: { cap: 'Room 12 likes grapes most. Room 14 might too, or not.', eq: ['predict, then check'] },
        together: [MO(BG('Room 12 sport', ['Hockey', 'Soccer', 'Swim'], [8, 4, 3], 9), 'Which would you predict Room 14 likes most?', 'most', ['Hockey', 'Soccer', 'Swim']),
          { q: 'Room 14 chose Soccer most. Was the prediction wrong to make?', lines: { n: 2, key: 'No. A prediction is a good guess. Groups can be different.' } }],
        cue: 'Use the data to predict. Then collect new data to check.',
        own: [{ q: 'How could you check your prediction?', lines: { n: 2, key: 'Ask the other class and make a new graph.' } }]
      },
      p1: {
        items: [MO(BG('Grade 2 lunch', ['Pasta', 'Soup', 'Tacos'], [5, 2, 8], 9), 'Predict the favourite lunch in Grade 3.', 'most', ['Pasta', 'Soup', 'Tacos']),
          MO(PG('Our class games', ['Tag', 'Ball', 'Hide'], [6, 3, 4]), 'Predict the favourite game in another class.', 'most', ['Tag', 'Ball', 'Hide']),
          { q: 'Will every class like the same game best? Why?', lines: { n: 2, key: 'Maybe not. Different groups can choose differently.' }, wide: true }]
      },
      p2: {
        items: [{ q: 'Room 12: grapes 7, apples 3. Room 14: grapes 4, apples 6. What changed?', lines: { n: 2, key: 'Room 14 liked apples most: a different group gave a different result.' }, wide: true },
          RR(BG('Room 14 fruit', FRUIT, [6, 2, 4], 8), 'How many more chose Apple than Grapes?', ['Apple − Grapes = []']),
          { q: 'Predict: will more children wear boots in January or June? Why?', lines: { n: 2, key: 'January: it is snowy and cold.' } }]
      },
      p3: {
        items: [{ q: 'Make a prediction about your family. Then ask them and check.', lines: { n: 3, key: 'For example: most like pancakes. Then record the answers.' }, wide: true },
          { q: 'Why might two classes give different answers to the same question?', lines: { n: 2, key: 'They are different people with different likes.' }, wide: true }]
      },
      think: {
        items: [{ q: '{a} says a prediction must always come true. Is {a} right?', lines: { n: 2, key: 'No. A prediction is a guess based on data.' } },
          { q: 'What makes a good prediction?', lines: { n: 2, key: 'It uses data you already have.' } },
          { q: 'Why do people check predictions with new data?', lines: { n: 2, key: 'To see if the guess still fits.' } },
          { q: 'Predict the most common colour of car in your street. How would you check?', lines: { n: 2, key: 'Count cars by colour with tally marks.' } }]
      }
    },

    words: {
      watch: 'calling something certain when it is only possible. Certain means it happens every time.',
      goal: 'I can use impossible, possible and certain.',
      learn: {
        show: { pic: BAG({ R: 3, B: 2 }), cap: 'Red or blue marbles only', eq: ['green: impossible'] },
        together: [CW(BAG({ R: 4, B: 1 }), 'R', 'Pick one. Getting R is…'), CW(BAG({ R: 5 }), 'R', 'Pick one. Getting R is…')],
        cue: 'None: impossible. Some: possible. All: certain.',
        own: [CB({ red: 3, blue: 2 }, 'green'), CB({ blue: 6 }, 'blue')]
      },
      p1: {
        items: [CB({ red: 2, yellow: 4 }, 'yellow'), CB({ green: 5 }, 'red'), CB({ blue: 3 }, 'blue'),
          CB({ red: 1, blue: 1 }, 'red')]
      },
      p2: {
        items: [CW(SPN(['R', 'B', 'R', 'B']), 'R'), CW(SPN(['G', 'G', 'G', 'G']), 'G'), CW(SPN(['R', 'B', 'Y', 'G']), 'P'), LK(SPN(['R', 'R', 'R', 'B']), ['R', 'B'])]
      },
      p3: {
        items: [LK(BAG({ R: 2, B: 6 }), ['R', 'B']),
          { q: 'Draw a bag where getting blue is certain.', draw: { h: 60, key: 'A bag of only blue marbles.' } },
          { q: 'Draw a bag where getting red is possible but not certain.', draw: { h: 60, key: 'A bag with some red and some other colours.' } },
          { q: 'Write something impossible, possible and certain about tomorrow.', lines: { n: 3, key: 'For example: impossible, a dog flies; possible, rain; certain, the sun rises.' }, wide: true }]
      },
      think: {
        items: [{ q: '{b} says it is certain to snow in winter. Is that right?', lines: { n: 2, key: 'No. It is possible, even likely, but not certain every day.' } },
          { q: 'How can you make "red" impossible with a bag of marbles?', lines: { n: 2, key: 'Take out all the red marbles.' } },
          { q: 'Is getting a 7 on a number cube possible? Why?', lines: { n: 2, key: 'No, it is impossible: the cube shows 1 to 6.' } },
          { q: 'Find something that is possible today.', lines: { n: 2, key: 'For example: going to the park.' } }]
      }
    }
  } });
})();
