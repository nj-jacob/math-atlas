/* Grade 3 Data: printable worksheets (assets/engine/sheets.js, pictures in sheet-pics.js). One set per idea of the lessons
   in chapters/data.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random.
   Theme words: {a} {b} names.
   Ontario 2020 (the codes the lessons name): D1.1 sort by two and three attributes (Venn, Carroll and tree diagrams);
   D1.2 collect data (qualitative and quantitative) by interview, observation and experiment; D1.3 tally tables,
   pictographs and bar graphs with many-to-one keys and scales, titles, labels and sources; D1.4 the mean and the mode;
   D1.5 answer questions with data; D2.1 the words for chance, and predictions; D2.2 different groups give different data.
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
    if ((m = /^multiple of (\d+)$/.exec(l))) return n % +m[1] === 0;
  }
  function all(labels, n) { return labels.every(function (l) { return is(l, n); }); }
  function vpart(n, a, b) { return is(a, n) ? (is(b, n) ? 1 : 0) : is(b, n) ? 2 : 3; }
  function cpart(n, a, b) { return (is(a, n) ? 0 : 2) + (is(b, n) ? 0 : 1); }
  function split(list, f, a, b) { var p = [[], [], [], []]; list.forEach(function (n) { p[f(n, a, b)].push(n); }); return p; }
  /* Venn diagrams: filled in (VN), numbers to sort (VS), where one number goes (VR), how many fit (VC) */
  function VN(list, a, b, R) { return ['venn', { a: a, b: b, parts: split(list, vpart, a, b), R: R || 44 }]; }
  function VS(list, a, b, q) { return { q: q || 'Sort the numbers.', pic: ['venn', { a: a, b: b, parts: split(list, vpart, a, b), list: list, blank: true, R: 46 }] }; }
  function VR(n, a, b, q) { return { q: q || 'Labels: ' + a + ', ' + b + '. Where does ' + n + ' go?', pick: { opts: [a + ' only', 'both', b + ' only', 'neither'], ans: vpart(n, a, b), region: n, a: a, b: b }, wide: true }; }
  function VC(list, a, b, labels, q) { return { q: q, pic: VN(list, a, b), eq: ['[] numbers'], a: [list.filter(function (n) { return all(labels, n); }).length], cnt: { is: labels } }; }
  /* Carroll diagrams: the same four */
  function CN(list, a, b) { return ['carroll', { a: a, b: b, cells: split(list, cpart, a, b) }]; }
  function CS(list, a, b, q) { return { q: q || 'Sort the numbers.', pic: ['carroll', { a: a, b: b, cells: split(list, cpart, a, b), list: list, blank: true }] }; }
  function CR(n, a, b, q) { return { q: q || 'Rows: ' + a + '. Columns: ' + b + '. Where does ' + n + ' go?', pick: { opts: ['top left', 'top right', 'bottom left', 'bottom right'], ans: cpart(n, a, b), cell: n, a: a, b: b }, wide: true }; }
  function CC(list, a, b, labels, q) { return { q: q, pic: CN(list, a, b), eq: ['[] numbers'], a: [list.filter(function (n) { return all(labels, n); }).length], cnt: { is: labels } }; }
  /* attribute blocks: c circle, q square, t triangle; d shaded, w white; B big, s small */
  var WORD = { c: 'circle', q: 'square', t: 'triangle', d: 'shaded', w: 'white', B: 'big', s: 'small' };
  function has(b, l) { return /^not /.test(l) ? !has(b, l.slice(4)) : WORD[b[0]] === l || WORD[b[1]] === l || WORD[b[2]] === l; }
  function TR(tray, by) {
    var a = []; by[0].forEach(function (x) { by[1].forEach(function (y) { a.push(tray.filter(function (b) { return has(b, x) && has(b, y); }).length); }); });
    return { q: 'Count the blocks at the end of each branch.', pic: ['tree', { tray: tray, by: by, blank: true }], a: a };
  }
  function TQ(tray, labels, q) { return { q: q, pic: ['tray', { list: tray }], eq: ['[] blocks'], a: [tray.filter(function (b) { return labels.every(function (l) { return has(b, l); }); }).length], cnt: { is: labels } }; }
  /* kinds of data, and how it is collected */
  function KQ(sq) { return { q: 'Answers to "' + sq + '" are…', pick: { opts: ['words', 'numbers'], ans: /^How (many|much|far|long|tall|old|heavy|fast|high)\b/.test(sq) ? 1 : 0, kindOf: sq } }; }
  function HW(q, ans) { var o = ['interview', 'observation', 'experiment']; return { q: q + ' Which way is it collected?', pick: { opts: o, ans: o.indexOf(ans) }, wide: true }; }
  /* data read from a picture: a value, a total or how many more; the most or least */
  function val(p, cats) { var d = p[1]; return sum(cats.map(function (c) { return d.vals[d.cats.indexOf(c)]; })); }
  function RD(p, q, unit, a, b) {
    var d = { op: b ? 'more' : a && a.length === 1 ? 'value' : 'total' }; if (a) d.a = a; if (b) d.b = b;
    return { q: q, pic: p, eq: ['[] ' + unit], a: [b ? val(p, a) - val(p, b) : val(p, a || p[1].cats)], data: d };
  }
  /* rows that name the categories: 'Winter = [] votes', 'Summer − Spring = []', 'in all = []' */
  function RR(p, q, rows) {
    var d = p[1];
    return { q: q, pic: p, eq: rows, a: rows.map(function (r) {
      var t = 0, sign = 1;
      r.split(' = ')[0].replace('in all', d.cats.join(' + ')).split(' ').forEach(function (k) { if (k === '+') sign = 1; else if (k === '−') sign = -1; else if (d.cats.indexOf(k) >= 0) t += sign * d.vals[d.cats.indexOf(k)]; });
      return t;
    }) };
  }
  function wide(it) { it.wide = true; return it; }
  function MO(p, q, op, opts) { var v = opts.map(function (c) { return val(p, [c]); }), best = op === 'most' ? Math.max.apply(null, v) : Math.min.apply(null, v); return { q: q, pic: p, pick: { opts: opts, ans: v.indexOf(best) }, data: { op: op } }; }
  function TF(p, q, say, a, b) { var real = b ? val(p, a) - val(p, b) : val(p, a); return { q: q, pic: p, pick: { opts: ['true', 'false'], ans: real === say ? 0 : 1 }, data: { op: b ? 'more' : 'value', a: a, b: b, say: say } }; }
  function TL(cats, vals, head) { return ['tally', { cats: cats, vals: vals, head: head }]; }
  function PG(title, cats, vals, key, unit) { return ['picto', { title: title, cats: cats, vals: vals, key: key, unit: unit }]; }
  function BG(title, cats, vals, max, step, more) { var o = { title: title, cats: cats, vals: vals, max: max, step: step, h: 76 }; for (var k in more || {}) o[k] = more[k]; return ['bar', o]; }
  /* the mean and the mode */
  function modeOf(v) { var c = {}, top = 0, m = []; v.forEach(function (x) { c[x] = (c[x] || 0) + 1; top = Math.max(top, c[x]); }); for (var k in c) if (c[k] === top) m.push(+k); return top < 2 ? 'none' : m.sort(function (x, y) { return x - y; }).join(' and '); }
  function MD(v, q, p) { var m = modeOf(v), two = / and /.test(m); return { q: q || 'Find the mode: ' + v.join(', ') + '.', pic: p, eq: [two ? 'modes: [] and []' : 'mode = []'], a: two ? m.split(' and ').map(Number) : [m === 'none' ? 'none' : +m], stat: { v: v } }; }
  function MN(v, q, p, steps) { return { q: q || 'Find the mean of ' + v.join(', ') + '.', pic: p, eq: (steps ? [v.join(' + ') + ' = []'] : []).concat(['mean = []']), a: (steps ? [sum(v)] : []).concat([sum(v) / v.length]), stat: { v: v } }; }
  function MM(q, ans) { return { q: q, pick: { opts: ['mean', 'mode'], ans: ans === 'mean' ? 0 : 1 } }; }
  function GR(n1, v1, n2, v2, q) { var g = {}; g[n1] = v1; g[n2] = v2; return { q: q || n1 + ': ' + v1.join(', ') + '. ' + n2 + ': ' + v2.join(', ') + '.', eq: [n1 + ' mean = []', n2 + ' mean = []'], a: [sum(v1) / v1.length, sum(v2) / v2.length], stat: { g: g }, wide: true }; }
  function SAME(n1, v1, n2, v2, what) { var g = {}, f = function (v) { return what === 'mean' ? sum(v) / v.length : modeOf(v); }; g[n1] = v1; g[n2] = v2; return { q: n1 + ': ' + v1.join(', ') + '. ' + n2 + ': ' + v2.join(', ') + '. The same ' + what + '?', pick: { opts: ['yes', 'no'], ans: f(v1) === f(v2) ? 0 : 1, sameStat: what }, stat: { g: g }, wide: true }; }
  /* chance: a bag of marbles or a spinner */
  function cw(k, n) { return k === 0 ? 'impossible' : k === n ? 'certain' : 2 * k < n ? 'unlikely' : 2 * k === n ? 'equally likely' : 'likely'; }
  function count(p) { var c = p[0] === 'bag' ? p[1].c : {}; if (p[0] === 'spinner') p[1].parts.forEach(function (x) { c[x] = (c[x] || 0) + 1; }); return c; }
  function total(c) { var t = 0; for (var k in c) t += c[k]; return t; }
  /* the same, with the marbles told in words: 'A bag has 5 red and 1 blue.' */
  function CB(c, of, opts) {
    var k = Object.keys(c), said = k.map(function (x) { return c[x] + ' ' + x; }).join(' and '), o = opts || W4;
    return { q: 'A bag has ' + said + '. Getting ' + of + ' is…', pick: { opts: o, ans: o.indexOf(cw(c[of] || 0, total(c))), chance: { of: of } }, chances: c, wide: true };
  }
  function BAG(c) { return ['bag', { c: c }]; }
  function SPN(parts) { return ['spinner', { parts: parts }]; }
  var W4 = ['impossible', 'unlikely', 'likely', 'certain'];
  function CW(p, of, opts, q) { var c = count(p); return { q: q || (p[0] === 'bag' ? 'Pick one without looking. Getting ' : 'Spin once. Landing on ') + of + ' is…', pic: p, pick: { opts: opts || W4, ans: (opts || W4).indexOf(cw(c[of] || 0, total(c))), chance: { of: of } }, wide: true }; }
  function CT(p, of, say, q) { var c = count(p); return { q: q, pic: p, pick: { opts: ['true', 'false'], ans: cw(c[of] || 0, total(c)) === say ? 0 : 1, chance: { of: of, say: say } } }; }
  function LK(p, which, opts, q) { var c = count(p), v = opts.map(function (o) { return c[o] || 0; }); return { q: q || 'Which colour is ' + which + ' likely?', pic: p, pick: { opts: opts, ans: v.indexOf(which === 'most' ? Math.max.apply(null, v) : Math.min.apply(null, v)), likely: which } }; }
  function PD(p, n, of, q) { var c = count(p); return { q: q || (p[0] === 'bag' ? 'Pick and put back ' : 'Spin ') + n + ' times. About how many ' + of + '?', pic: p, eq: ['about [] times'], a: [n * (c[of] || 0) / total(c)], predict: { n: n, of: of } }; }
  function FAIR(p, x, y, q) { var c = count(p); x = x || 'red'; y = y || 'blue'; return { q: q || '{a} wins on ' + x + ', {b} on ' + y + '. Is it fair?', pic: p, pick: { opts: ['yes', 'no'], ans: (c[x] || 0) === (c[y] || 0) ? 0 : 1 }, fair: [x, y] }; }

  var SN = [6, 18, 9, 24, 3, 12, 17], TRAY = ['cdB', 'cws', 'qdB', 'cds', 'qws', 'qwB', 'cwB', 'cdB'], SHADE2 = [['circle', 'square'], ['shaded', 'white']];
  var SEASON = ['Winter', 'Spring', 'Summer', 'Fall'], SPORT = ['Hockey', 'Soccer', 'Swim', 'Lacrosse'];

  S.register('data', { code: 'DT', ideas: {
    venn: {
      watch: 'putting a number that fits both labels in only one circle, or leaving out the numbers that fit neither. Ask two yes-or-no questions for each number.',
      goal: 'I can sort numbers in a Venn diagram.',
      learn: {
        show: { pic: VN(SN, 'even', 'more than 15', 36), cap: '18 and 24 fit both labels', eq: ['9 and 3 fit neither'] },
        together: [VR(20, 'even', 'more than 15'), VR(11, 'even', 'more than 15')],
        cue: 'Ask both questions. Yes and yes: the overlap. No and no: outside.',
        own: [VR(16, 'even', 'more than 15')]
      },
      p1: {
        items: [VS([6, 15, 8, 21, 30, 7], 'even', 'more than 10'), VS([10, 3, 25, 12, 15, 8], 'multiple of 5', 'even'),
          VR(25, 'multiple of 5', 'even'), VR(40, 'multiple of 5', 'even')]
      },
      p2: {
        items: [VC(SN, 'even', 'more than 15', ['even'], 'How many numbers are even?'), VC(SN, 'even', 'more than 15', ['even', 'more than 15'], 'How many fit both labels?'),
          VS([4, 13, 20, 9, 16, 1], 'odd', 'less than 10'), VC([5, 12, 30, 9, 20, 3, 15], 'multiple of 5', 'more than 10', ['not multiple of 5', 'not more than 10'], 'How many fit neither label?')]
      },
      p3: {
        items: [VS([14, 3, 30, 27, 12, 8, 21], 'multiple of 3', 'more than 20'),
          VC([14, 3, 30, 27, 12, 8, 21], 'multiple of 3', 'more than 20', ['more than 20'], 'How many are in the "more than 20" circle?'),
          VR(33, 'odd', 'multiple of 3', '{a} put 33 in "odd only". Labels: odd, multiple of 3. Where does it go?'),
          { q: 'Write a number that goes in the overlap of "even" and "more than 50".', lines: { n: 1, key: 'For example: 60. It is even and more than 50.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why does a number that fits both labels go in the overlap?', lines: { n: 2, key: 'It belongs in both circles, and the overlap is inside both.' } },
          { q: 'Where do the numbers that fit neither label go?', lines: { n: 2, key: 'Outside both circles, inside the box.' } },
          { q: 'Labels: even, odd. Why is the overlap empty?', lines: { n: 2, key: 'No number is both even and odd.' } },
          { q: 'Make up two labels. Write a number for each part.', lines: { n: 2, key: 'For example: even, more than 10. 4, 12, 15, 7.' } }]
      }
    },

    carroll: {
      watch: 'reading only the row or only the column. Point to the row, then slide along to the column.',
      goal: 'I can sort numbers in a Carroll diagram.',
      learn: {
        show: { pic: CN(SN, 'even', 'more than 15'), cap: 'Every number fits exactly one box', eq: ['18: even, more than 15'] },
        together: [CR(20, 'even', 'more than 15', 'Where does 20 go?'), CR(7, 'even', 'more than 15', 'Where does 7 go?')],
        cue: 'Row first: yes is the top row. Then column: yes is the left column.',
        own: [CR(19, 'even', 'more than 15', 'Where does 19 go?')]
      },
      p1: {
        items: [CS([12, 5, 9, 20, 3, 16], 'multiple of 3', 'more than 10'), CS([8, 15, 22, 7, 30, 11], 'even', 'more than 12'),
          CR(21, 'multiple of 3', 'more than 10'), CR(4, 'multiple of 3', 'more than 10')]
      },
      p2: {
        items: [CC(SN, 'even', 'more than 15', ['even', 'not more than 15'], 'How many are even and not more than 15?'), CC(SN, 'even', 'more than 15', ['not even'], 'How many are in the bottom row?'),
          CS([25, 4, 10, 13, 35, 2], 'multiple of 5', 'odd'), CC([25, 4, 10, 13, 35, 2], 'multiple of 5', 'odd', ['multiple of 5', 'odd'], 'How many are in the top left box?')]
      },
      p3: {
        items: [CS([18, 7, 24, 9, 3, 30, 15], 'multiple of 3', 'even'),
          CC([18, 7, 24, 9, 3, 30, 15], 'multiple of 3', 'even', ['multiple of 3'], 'How many are in the top row?'),
          CR(14, 'multiple of 3', 'even'),
          { q: '{b} says 12 goes in "not multiple of 3". Rows: multiple of 3. Is {b} right? Why?', lines: { n: 2, key: 'No. 12 = 4 × 3, so it is a multiple of 3: top row.' }, wide: true }]
      },
      think: {
        items: [{ q: 'How is a Carroll diagram like a Venn diagram?', lines: { n: 2, key: 'Both sort by two labels. Each part means yes or no for each label.' } },
          { q: 'Which box holds numbers that fit neither label?', lines: { n: 1, key: 'The bottom right box.' } },
          { q: 'Why can a number never go in two boxes?', lines: { n: 2, key: 'It is either in the row or not, and either in the column or not.' } },
          { q: 'Make up a number for the top left box: even and more than 20.', lines: { n: 1, key: 'For example: 24.' } }]
      }
    },

    tree: {
      watch: 'skipping a level, or adding only one leaf when a question names one attribute. Trace each block from the top with a finger.',
      goal: 'I can sort blocks with a tree diagram.',
      learn: {
        show: { pic: ['tree', { tray: TRAY, by: SHADE2 }], cap: 'Circle or square, then shaded or white', eq: ['circles: 3 + 2 = 5'] },
        together: [TQ(TRAY, ['circle', 'shaded'], 'How many shaded circles?'), TQ(TRAY, ['square'], 'How many squares?')],
        cue: 'Check every block for each label. Count only the blocks that fit all of them.',
        own: [TQ(TRAY, ['white'], 'How many white blocks?'), TQ(TRAY, ['circle', 'white'], 'How many white circles?')]
      },
      p1: {
        items: [TR(['cdB', 'qws', 'cds', 'cws', 'qdB', 'qds'], SHADE2), TR(['cdB', 'cwB', 'qws', 'cds', 'cws', 'qwB', 'cdB'], SHADE2),
          TQ(['cdB', 'qws', 'cds', 'cws', 'qdB', 'qds'], ['square', 'shaded'], 'How many shaded squares?'), TQ(['cdB', 'cwB', 'qws', 'cds', 'cws', 'qwB', 'cdB'], ['big'], 'How many big blocks?')]
      },
      p2: {
        items: [TR(['tdB', 'cws', 'tws', 'cdB', 'tds', 'twB', 'cds'], [['circle', 'triangle'], ['big', 'small']]),
          TQ(['tdB', 'cws', 'tws', 'cdB', 'tds', 'twB', 'cds'], ['triangle', 'small'], 'How many small triangles?'),
          TQ(TRAY, ['circle', 'shaded', 'big'], 'How many big shaded circles?'), TQ(TRAY, ['square', 'white', 'small'], 'How many small white squares?'),
          TQ(['tdB', 'cws', 'tws', 'cdB', 'tds', 'twB', 'cds'], ['shaded', 'big'], 'How many big shaded blocks?')]
      },
      p3: {
        items: [TR(['qdB', 'qds', 'tws', 'twB', 'qws', 'tdB', 'qdB', 'tds'], [['square', 'triangle'], ['shaded', 'white']]),
          TQ(['qdB', 'qds', 'tws', 'twB', 'qws', 'tdB', 'qdB', 'tds'], ['square', 'shaded', 'big'], 'How many big shaded squares?'),
          TQ(['qdB', 'qds', 'tws', 'twB', 'qws', 'tdB', 'qdB', 'tds'], ['not square', 'small'], 'How many small blocks are not squares?'),
          { q: 'A tree sorts by shape (2 kinds), then shading (2 kinds), then size (2 kinds). How many leaves?', eq: ['[] leaves'], a: [8], calc: '2 × 2 × 2', wide: true }]
      },
      think: {
        items: [{ q: 'Why does each block end at exactly one leaf?', lines: { n: 2, key: 'At each branch it fits only one way: circle or square, shaded or white.' } },
          { q: 'How do you find all the circles on a tree?', lines: { n: 2, key: 'Add every leaf under the circle branch.' } },
          { q: 'Sort the same blocks by shading first. Do the leaves change?', lines: { n: 2, key: 'The order of the leaves changes, but each block still lands at one leaf.' } },
          { q: 'Name three ways to sort the blocks in your home.', lines: { n: 2, key: 'For example: by shape, by colour, by size.' } }]
      }
    },

    kinds: {
      watch: 'thinking a question with a number in it has number answers ("Which of 3 snacks?" has words). Imagine one answer out loud.',
      goal: 'I can tell word data from number data, and how it is collected.',
      learn: {
        show: { cap: '"How many pets?" 0, 2, 1', eq: ['numbers'] },
        together: [KQ('Favourite fruit?'), KQ('How many books did you read?')],
        cue: 'Imagine one answer. Is it a word or a number?',
        own: [KQ('How tall is your plant?'), KQ('Which game do you like best?')]
      },
      p1: {
        show: { cap: 'Ask people: interview. Watch: observation', eq: ['Test it: experiment'] },
        items: [KQ('What colour is your coat?'), KQ('How far can you jump?'), KQ('How many cars go by?'), KQ('Which of the 3 snacks do you want?'),
          HW('You ask your classmates their favourite snack.', 'interview'), HW('You watch and count the birds at the feeder.', 'observation')]
      },
      p2: {
        items: [HW('You drop a ball 10 times to see how high it bounces.', 'experiment'), HW('You ask your family how they get to work.', 'interview'),
          HW('You look at the bikes at school and note each colour.', 'observation'), KQ('How old is your pet?'), KQ('What kind of pet do you have?'),
          KQ('How long can you hop on one foot?'), KQ('Which month is your birthday?')]
      },
      p3: {
        items: [HW('You roll a number cube 20 times and record each number.', 'experiment'), KQ('How much rain fell today?'), KQ('Which season has the best weather?'),
          { q: 'Write a survey question with number answers.', lines: { n: 1, key: 'For example: How many siblings do you have?' }, wide: true },
          { q: 'Write a survey question with word answers.', lines: { n: 1, key: 'For example: What is your favourite sport?' }, wide: true }]
      },
      think: {
        items: [{ q: '"Which of 4 colours do you like?" has a number in it. Are the answers numbers?', lines: { n: 2, key: 'No. The answers are colours: words.' } },
          { q: 'When would you collect data by watching, not asking?', lines: { n: 2, key: 'When people cannot tell you, such as counting the cars that go by.' } },
          { q: 'Plan an experiment. What would you test?', lines: { n: 2, key: 'For example: how far a paper plane flies, 5 times.' } },
          { q: 'Ask 5 people one question. What did you find out?', lines: { n: 2, key: 'For example: 3 of 5 like summer best.' } }]
      }
    },

    tally: {
      watch: 'counting a group of 5 as 4 (missing the slanted mark), or adding when the question asks "how many more". Count by 5s, then 1s.',
      goal: 'I can keep count with tally marks and read a tally table.',
      learn: {
        show: { cap: 'A full group is 5. Count by 5s, then 1s', eq: ['5, 10, 11, 12'] },
        together: [RR(TL(['Winter', 'Spring', 'Summer'], [8, 5, 11], ['Season']), 'How many chose Summer?', ['Summer = [] votes']), RR(TL(['Winter', 'Spring', 'Summer'], [8, 5, 11], ['Season']), 'How many chose Winter?', ['Winter = [] votes'])],
        cue: 'Each full group is 5. Count the groups by 5s, then count the single marks.',
        own: [RR(TL(['Spring', 'Summer', 'Fall'], [3, 14, 7], ['Season']), 'How many chose Summer?', ['Summer = [] votes']), RR(TL(['Spring', 'Summer', 'Fall'], [3, 14, 7], ['Season']), 'How many chose Fall?', ['Fall = [] votes'])]
      },
      p1: {
        items: [{ q: 'Write each count.', pic: ['tally', { cats: SEASON, vals: [6, 10, 13, 4], head: ['Season'], blank: true }], a: [6, 10, 13, 4] },
          { q: 'Write each count.', pic: ['tally', { cats: ['Dog', 'Cat', 'Fish'], vals: [12, 8, 5], head: ['Pet'], blank: true }], a: [12, 8, 5] },
          { q: 'Draw tally marks for 9.', draw: { h: 40, key: ['tally', { cats: ['9'], vals: [9], head: ['Count'] }] } },
          { q: 'Draw tally marks for 16.', draw: { h: 40, key: ['tally', { cats: ['16'], vals: [16], head: ['Count'] }] } }]
      },
      p2: {
        items: [RR(TL(SEASON, [8, 5, 11, 6], ['Season']), 'Add, or take away?', ['in all = [] votes', 'Summer − Spring = []']),
          RR(TL(['Dog', 'Cat', 'Fish'], [12, 8, 5], ['Pet']), 'Add, or take away?', ['Dog + Cat = []', 'Dog − Fish = []']),
          MO(TL(['Dog', 'Cat', 'Fish'], [12, 8, 5], ['Pet']), 'Which pet was chosen least?', 'least', ['Dog', 'Cat', 'Fish'])]
      },
      p3: {
        items: [RR(TL(['Apple', 'Pear', 'Grapes', 'Plum'], [13, 7, 17, 4], ['Fruit']), 'Work it out.', ['in all = [] votes', 'Grapes − Pear = []', 'Apple − Plum = []']),
          TF(TL(['Apple', 'Pear', 'Grapes', 'Plum'], [13, 7, 17, 4], ['Fruit']), '{a} says 12 chose Apple. True or false?', 12, ['Apple']),
          { q: 'Record: Red 6, Blue 11, Green 3. Make a tally table.', draw: { h: 100, key: ['tally', { cats: ['Red', 'Blue', 'Green'], vals: [6, 11, 3], head: ['Colour'] }] }, wide: true }]
      },
      think: {
        items: [{ q: 'Why is the fifth tally mark drawn across the other four?', lines: { n: 2, key: 'It makes groups of 5, so we can count by 5s.' } },
          { q: 'How do you find how many more chose one thing than another?', lines: { n: 2, key: 'Subtract the smaller count from the bigger one.' } },
          { q: 'Why do we tally while we collect, then count?', lines: { n: 2, key: 'One mark for each answer is quick, and no answer is missed.' } },
          { q: 'Ask your family a question. Tally the answers.', lines: { n: 2, key: 'For example: favourite season: winter 2, summer 3.' } }]
      }
    },

    picto: {
      watch: 'counting pictures as single votes, or reading half a picture as 1 when the key is 10. Read the key first, then skip count.',
      goal: 'I can read a pictograph with a key.',
      learn: {
        show: { pic: PG('Favourite fruit', ['Pear'], [5], 2), cap: 'Each circle means 2. Half means 1', eq: ['Pear: 2, 4, 5'] },
        together: [RR(PG('Favourite fruit', ['Apple', 'Grapes'], [8, 7], 2), 'How many chose Apple?', ['Apple = [] votes']), RR(PG('Favourite fruit', ['Apple', 'Grapes'], [8, 7], 2), 'How many chose Grapes?', ['Grapes = [] votes'])],
        cue: 'Read the key. Skip count by the key, then add half for a half circle.',
        own: [RR(PG('Favourite sport', ['Hockey', 'Soccer', 'Swim'], [35, 20, 15], 10), 'How many chose Hockey?', ['Hockey = [] votes']), RR(PG('Favourite sport', ['Hockey', 'Soccer', 'Swim'], [35, 20, 15], 10), 'How many chose Swim?', ['Swim = [] votes'])]
      },
      p1: {
        items: [RR(PG('Pets at home', ['Dog', 'Cat', 'Fish'], [15, 10, 25], 5, 'pets'), 'How many of each?', ['Dog = [] pets', 'Cat = [] pets', 'Fish = [] pets']),
          RR(PG('Books read', ['Mon', 'Tue', 'Wed'], [6, 9, 4], 2, 'books'), 'How many books each day?', ['Mon = [] books', 'Tue = [] books', 'Wed = [] books']),
          { q: 'Each circle means 2. How many circles show 8?', eq: ['[] circles'], a: [4], calc: '8 ÷ 2' }, { q: 'Each circle means 10. How many circles show 40?', eq: ['[] circles'], a: [4], calc: '40 ÷ 10' }]
      },
      p2: {
        items: [RR(PG('Pets at home', ['Dog', 'Cat', 'Fish'], [15, 10, 25], 5, 'pets'), 'Add, or take away?', ['in all = [] pets', 'Fish − Cat = []']),
          RR(PG('Favourite sport', ['Hockey', 'Soccer', 'Swim'], [35, 20, 15], 10), 'Add, or take away?', ['Hockey − Soccer = []', 'Soccer + Swim = []']),
          MO(PG('Books read', ['Mon', 'Tue', 'Wed'], [6, 9, 4], 2, 'books'), 'Which day had the most books?', 'most', ['Mon', 'Tue', 'Wed']),
          { q: 'Each circle means 5. How many circles show 30?', eq: ['[] circles'], a: [6], calc: '30 ÷ 5' }]
      },
      p3: {
        items: [RR(PG('Trees planted', ['Oak', 'Maple', 'Pine'], [50, 35, 20], 10, 'trees'), 'Work it out.', ['in all = [] trees', 'Maple − Pine = []', 'Oak − Maple = []']),
          TF(PG('Trees planted', ['Oak', 'Maple', 'Pine'], [50, 35, 20], 10, 'trees'), '{b} says 5 Oak trees were planted. True or false?', 5, ['Oak']),
          { q: 'Each circle means 10, so half a circle means 5. How many votes do 3 and a half circles show?', eq: ['[] votes'], a: [35], calc: '3 × 10 + 5' }]
      },
      think: {
        items: [{ q: 'Why does a pictograph need a key?', lines: { n: 2, key: 'One picture can mean more than 1. The key tells how many.' } },
          { q: 'The key is 10. What does half a picture mean?', lines: { n: 1, key: '5.' } },
          { q: 'Why might each picture mean 5, not 1?', lines: { n: 2, key: 'Big counts would need too many pictures.' } },
          { q: 'Can a key of 2 show 7? How?', lines: { n: 2, key: 'Yes: 3 pictures and half a picture.' } }]
      }
    },

    bar: {
      watch: 'counting grid lines instead of reading the scale. Read the numbers up the side first. For a bar between lines, find the number halfway.',
      goal: 'I can read a bar graph and its scale.',
      learn: {
        show: { cap: 'Scale by 2s. A bar halfway from 4 to 6', eq: ['shows 5'] },
        together: [RR(BG('Favourite sport', SPORT, [12, 8, 9, 5], 14, 2, { h: 60 }), 'How many chose Soccer?', ['Soccer = [] votes']), RR(BG('Favourite sport', SPORT, [12, 8, 9, 5], 14, 2, { h: 60 }), 'How many chose Lacrosse?', ['Lacrosse = [] votes'])],
        cue: 'Go to the top of the bar, then across to the scale. Between two lines? Find the number halfway.',
        own: [RR(BG('Way to school', ['Walk', 'Bus', 'Car', 'Bike'], [35, 50, 20, 15], 60, 10, { h: 60 }), 'How many walk?', ['Walk = [] students']), RR(BG('Way to school', ['Walk', 'Bus', 'Car', 'Bike'], [35, 50, 20, 15], 60, 10, { h: 60 }), 'How many bike?', ['Bike = [] students'])]
      },
      p1: {
        items: [{ q: 'The scale counts by…', pic: BG('Favourite sport', SPORT, [12, 8, 9, 5], 14, 2), pick: { opts: ['1s', '2s', '5s', '10s'], ans: 1, scale: true } },
          { q: 'The scale counts by…', pic: BG('Way to school', ['Walk', 'Bus', 'Car', 'Bike'], [35, 50, 20, 15], 60, 10), pick: { opts: ['1s', '2s', '5s', '10s'], ans: 3, scale: true } },
          RR(BG('Way to school', ['Walk', 'Bus', 'Car', 'Bike'], [35, 50, 20, 15], 60, 10), 'How many go each way?', ['Bus = [] students', 'Car = [] students']),
          RR(BG('Snow days', ['Nov', 'Dec', 'Jan', 'Feb'], [3, 9, 14, 11], 16, 2), 'How many snow days?', ['Nov = [] days', 'Feb = [] days'])]
      },
      p2: {
        items: [RR(BG('Favourite sport', SPORT, [12, 8, 9, 5], 14, 2), 'How many more chose Hockey than Soccer?', ['Hockey − Soccer = []']),
          RR(BG('Way to school', ['Walk', 'Bus', 'Car', 'Bike'], [35, 50, 20, 15], 60, 10), 'How many students in all?', ['in all = [] students']),
          RR(BG('Snow days', ['Nov', 'Dec', 'Jan', 'Feb'], [3, 9, 14, 11], 16, 2), 'How many more in Jan than Nov?', ['Jan − Nov = []']),
          MO(BG('Snow days', ['Nov', 'Dec', 'Jan', 'Feb'], [3, 9, 14, 11], 16, 2), 'Which month had the fewest snow days?', 'least', ['Nov', 'Dec', 'Jan', 'Feb'])]
      },
      p3: {
        items: [RR(BG('Canoe trips', ['May', 'Jun', 'Jul', 'Aug'], [25, 45, 70, 55], 80, 10), 'Work it out.', ['Jun + Jul = []', 'Aug − May = []', 'in all = [] trips']),
          TF(BG('Favourite sport', SPORT, [12, 8, 9, 5], 14, 2), '{a} says 6 chose Hockey: its bar reaches the 6th line. True or false?', 6, ['Hockey'])]
      },
      think: {
        items: [{ q: 'Why read the scale before the bars?', lines: { n: 2, key: 'Each line might mean 2, 5 or 10, not 1.' } },
          { q: 'A bar stops halfway between 20 and 30. What does it show?', lines: { n: 1, key: '25.' } },
          { q: 'How is a bar graph like a pictograph?', lines: { n: 2, key: 'Both compare counts. The scale and the key both say how much each part means.' } },
          { q: 'What question could a graph of snow days answer?', lines: { n: 2, key: 'For example: which month had the most snow days?' } }]
      }
    },

    make: {
      watch: 'choosing a scale that makes 40 tiny lines or 2 huge ones, or leaving off the title, labels and source.',
      goal: 'I can make a pictograph and a bar graph.',
      learn: {
        show: { cap: 'Biggest count 12, counting by 2s', eq: ['12 ÷ 2 = 6 lines'] },
        together: [{ q: 'The biggest count is 40. Which scale fits in 10 lines or fewer?', pick: { opts: ['1s', '2s', '5s'], ans: 2, scaleFor: 40 } },
          { q: 'The biggest count is 18. Which scale fits in 10 lines or fewer?', pick: { opts: ['1s', '2s', '10s'], ans: 1, scaleFor: 18 } }],
        cue: 'Find the biggest count. Choose the smallest scale that needs 10 lines or fewer.',
        own: [{ q: 'The biggest count is 9. Which scale fits in 10 lines or fewer?', pick: { opts: ['1s', '5s', '10s'], ans: 0, scaleFor: 9 } },
          { q: 'The biggest count is 70. Which scale fits in 10 lines or fewer?', pick: { opts: ['1s', '2s', '10s'], ans: 2, scaleFor: 70 } }]
      },
      p1: {
        items: [{ q: 'What is this graph missing?', pic: BG('', SPORT, [12, 8, 9, 5], 14, 2, { title: null, ylab: 'Votes', src: 'Room 12 survey' }), pick: { opts: ['title', 'label', 'source'], ans: 0, missing: true } },
          { q: 'What is this graph missing?', pic: BG('Pets at home', ['Dog', 'Cat', 'Fish'], [6, 4, 7], 8, 2, { src: 'Class interviews' }), pick: { opts: ['title', 'label', 'source'], ans: 1, missing: true } },
          { q: 'Each circle means 5. How many circles show 15?', eq: ['[] circles'], a: [3], calc: '15 ÷ 5' },
          { q: 'What is this graph missing?', pic: BG('Snow days', ['Nov', 'Dec', 'Jan'], [3, 9, 14], 16, 2, { ylab: 'Days' }), pick: { opts: ['title', 'label', 'source'], ans: 2, missing: true } }]
      },
      p2: {
        items: [{ q: 'Draw the circles. Each means 5. Dog 15, Cat 10, Fish 25.', pic: ['picto', { title: 'Pets at home', cats: ['Dog', 'Cat', 'Fish'], vals: [15, 10, 25], key: 5, unit: 'pets', blank: true }] },
          { q: 'Draw the circles. Each means 2. Mon 6, Tue 3, Wed 8.', pic: ['picto', { title: 'Books read', cats: ['Mon', 'Tue', 'Wed'], vals: [6, 3, 8], key: 2, unit: 'books', blank: true }] },
          { q: 'Draw the bars: Swim 9, Lacrosse 5.', pic: BG('Favourite sport', SPORT, [12, 8, 9, 5], 14, 2, { hide: [2, 3], ylab: 'Votes' }) },
          { q: 'Draw the bars: Car 20, Bike 15.', pic: BG('Way to school', ['Walk', 'Bus', 'Car', 'Bike'], [35, 50, 20, 15], 60, 10, { hide: [2, 3], ylab: 'Students' }) }]
      },
      p3: {
        items: [{ q: 'The biggest count is 25. Which scale fits in 10 lines or fewer?', pick: { opts: ['1s', '2s', '5s'], ans: 2, scaleFor: 25 } },
          { q: 'Counting by 5s, how many lines show up to 35?', eq: ['[] lines'], a: [7], calc: '35 ÷ 5' },
          { q: 'Draw the bars: Jan 14, Feb 11.', pic: BG('Snow days', ['Nov', 'Dec', 'Jan', 'Feb'], [3, 9, 14, 11], 16, 2, { hide: [2, 3], ylab: 'Days' }) },
          { q: 'Draw the circles. Each means 10. Oak 50, Maple 35, Pine 20.', pic: ['picto', { title: 'Trees planted', cats: ['Oak', 'Maple', 'Pine'], vals: [50, 35, 20], key: 10, unit: 'trees', blank: true }] }]
      },
      think: {
        items: [{ q: 'Why does a graph need a title and labels?', lines: { n: 2, key: 'So a reader knows what was counted and what the numbers mean.' } },
          { q: 'Why say where the data came from?', lines: { n: 2, key: 'A reader can tell who was asked, and trust the graph.' } },
          { q: 'Counts: 4, 7, 3. Would you count by 1s or 10s? Why?', lines: { n: 2, key: 'By 1s. By 10s every bar would be tiny.' } },
          { q: 'Plan a graph of your family survey. Pictograph or bar graph?', lines: { n: 2, key: 'For example: a bar graph by 1s, titled "Favourite season".' } }]
      }
    },

    decide: {
      watch: 'comparing bar heights on graphs with different scales, or answering from the tallest bar alone. Write the numbers down, then add or take away.',
      goal: 'I can answer questions and make decisions with data.',
      learn: {
        show: { cap: 'Hockey 12 and Soccer 8, or Swim 9?', eq: ['12 + 8 − 9 = 11 more'] },
        together: [wide(RR(BG('Favourite sport', SPORT, [12, 8, 9, 5], 14, 2, { h: 60 }), 'How many more chose Swim and Lacrosse together than Hockey?', ['Swim + Lacrosse − Hockey = []']))],
        cue: 'Write the numbers down first. Then decide: add, or take away?',
        own: [wide(RR(BG('Snack for the trip', ['Apples', 'Crackers', 'Carrots'], [14, 9, 4], 16, 2, { h: 60 }), 'How many more chose Apples than the other two together?', ['Apples − Crackers − Carrots = []']))]
      },
      p1: {
        items: [MO(BG('Snack for the trip', ['Apples', 'Crackers', 'Carrots'], [14, 9, 4], 16, 2), 'Which snack should the class bring most of?', 'most', ['Apples', 'Carrots']),
          RR(BG('Snack for the trip', ['Apples', 'Crackers', 'Carrots'], [14, 9, 4], 16, 2), 'How many more chose Apples than Carrots?', ['Apples − Carrots = []']),
          MO(PG('Club choice', ['Chess', 'Art', 'Drums'], [15, 25, 10], 5), 'Which club should start first?', 'most', ['Chess', 'Art', 'Drums']),
          RR(PG('Club choice', ['Chess', 'Art', 'Drums'], [15, 25, 10], 5), 'How many want Chess or Drums?', ['Chess + Drums = []'])]
      },
      p2: {
        items: [{ q: 'Two rooms, two scales. How many chose Hockey in Room 6?', pic: ['row', { list: [BG('Room 5', ['Hockey', 'Soccer', 'Swim'], [8, 6, 4], 10, 2), BG('Room 6', ['Hockey', 'Soccer', 'Swim'], [15, 10, 5], 20, 5)] }], eq: ['[] votes'], a: [15], data: { op: 'value', a: ['Hockey'], at: 1 }, wide: true },
          { q: 'How many chose Soccer in Room 5?', pic: ['row', { list: [BG('Room 5', ['Hockey', 'Soccer', 'Swim'], [8, 6, 4], 10, 2), BG('Room 6', ['Hockey', 'Soccer', 'Swim'], [15, 10, 5], 20, 5)] }], eq: ['[] votes'], a: [6], data: { op: 'value', a: ['Soccer'], at: 0 }, wide: true }]
      },
      p3: {
        items: [RR(BG('Canoe trips', ['May', 'Jun', 'Jul', 'Aug'], [25, 45, 70, 55], 80, 10), 'Summer camp runs in Jul and Aug. How many trips is that? How many more than May and Jun?', ['Jul + Aug = []', 'May + Jun = []', 'Jul + Aug − May − Jun = []']),
          MO(BG('Canoe trips', ['May', 'Jun', 'Jul', 'Aug'], [25, 45, 70, 55], 80, 10), 'Which month needs the most canoes?', 'most', ['May', 'Jun', 'Jul', 'Aug']),
          { q: 'Snack votes: Apples 14, Crackers 9, Carrots 4. The class can bring two snacks. Which two? Why?', lines: { n: 2, key: 'Apples and Crackers: they have the most votes, 14 + 9 = 23.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why write the numbers down before you compare two graphs?', lines: { n: 2, key: 'The scales can differ, so the same height can mean different numbers.' } },
          { q: 'What could a school decide from a "way to school" graph?', lines: { n: 2, key: 'For example: how many bike racks or buses it needs.' } },
          { q: 'Can a graph of favourite sports tell you who plays a sport?', lines: { n: 2, key: 'No. It only answers the question that was asked.' } },
          { q: 'Write a question your family survey could answer.', lines: { n: 2, key: 'For example: which season do most of us like?' } }]
      }
    },

    mode: {
      watch: 'giving the biggest value, or how many times it appears, instead of the value itself; missing a tie or a list with no repeats. Put the values in order first.',
      goal: 'I can find the mode of a set of data.',
      learn: {
        show: { pic: ['plot', { lo: 2, hi: 9, v: [4, 7, 4, 2, 9, 4, 7] }], cap: 'The tallest stack of × marks', eq: ['mode = 4'] },
        together: [MD([5, 8, 2, 8, 6, 8, 5]), MD([3, 1, 3, 6, 1, 3])],
        cue: 'Put the values in order. The value that appears most is the mode.',
        own: [MD([7, 2, 7, 9, 7, 4]), MD([10, 12, 11, 12, 10, 12])]
      },
      p1: {
        items: [MD([3, 5, 8, 5, 3, 6], 'Find the mode.', ['plot', { lo: 2, hi: 9, v: [3, 5, 8, 5, 3, 6] }]), MD([6, 6, 4, 9, 6, 2], 'Find the mode.', ['plot', { lo: 2, hi: 9, v: [6, 6, 4, 9, 6, 2] }]),
          MD([4, 9, 2, 6, 8]), MD([1, 4, 4, 7, 1, 4, 3])]
      },
      p2: {
        items: [MD([2, 5, 5, 3, 2, 8], 'Find the mode.', ['plot', { lo: 1, hi: 8, v: [2, 5, 5, 3, 2, 8] }]), MD([15, 20, 15, 10, 15, 20]), MD([30, 25, 35, 40]),
          MD([4, 4, 6, 6, 8, 4, 6], 'Pets at home: 4, 4, 6, 6, 8, 4, 6. Find the mode.'), MD([9, 3, 9, 3, 5, 9])]
      },
      p3: {
        items: [MD([12, 15, 12, 18, 15, 12, 20], 'Shoe sizes in cm: 12, 15, 12, 18, 15, 12, 20. Find the mode.'), MD([2, 7, 7, 2, 4, 9], 'Goals: 2, 7, 7, 2, 4, 9. Find the modes.'),
          MD([8, 3, 5, 1, 6], 'Find the mode of 8, 3, 5, 1, 6.'),
          { q: '{a} says the mode of 2, 9, 9, 4 is 2, because 9 appears 2 times. Fix it.', lines: { n: 2, key: 'The mode is the value, 9, not how many times it appears.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why put the values in order first?', lines: { n: 2, key: 'The same values sit together, so the repeats are easy to see.' } },
          { q: 'Can a set of data have two modes? Give an example.', lines: { n: 2, key: 'Yes: 3, 3, 5, 5, 8 has modes 3 and 5.' } },
          { q: 'Is the mode always the biggest value?', lines: { n: 1, key: 'No. It is the value that appears most.' } },
          { q: 'A shop sells shoes. Why might it want the mode of shoe sizes?', lines: { n: 2, key: 'To order more of the size most people wear.' } }]
      }
    },

    mean: {
      watch: 'stopping at the total, or dividing by the wrong number. Build the towers with real cubes and even them out, then link it to the sum: total ÷ how many values.',
      goal: 'I can find the mean as a fair share.',
      learn: {
        show: { pic: ['towers', { v: [2, 8, 5], line: 5 }], cap: '15 cubes shared by 3 towers', eq: ['15 ÷ 3 = 5'] },
        together: [MN([3, 9, 6], 'Even out the towers. How tall is each?', ['towers', { v: [3, 9, 6] }]), MN([7, 1, 4], 'Even out the towers. How tall is each?', ['towers', { v: [7, 1, 4] }])],
        cue: 'Add all the cubes. Share them equally among the towers.',
        own: [MN([6, 2, 4], 'Even out the towers. How tall is each?', ['towers', { v: [6, 2, 4] }]), MN([4, 6, 2, 4], 'Even out the towers. How tall is each?', ['towers', { v: [4, 6, 2, 4] }])]
      },
      p1: {
        items: [MN([2, 4, 9], null, null, true), MN([8, 3, 4], null, null, true), MN([6, 1, 9, 4], null, null, true), MN([10, 5, 6, 3], null, null, true),
          MN([7, 2, 6], 'Even out the towers. How tall is each?', ['towers', { v: [7, 2, 6] }]), MN([1, 8, 3], 'Even out the towers. How tall is each?', ['towers', { v: [1, 8, 3] }])]
      },
      p2: {
        items: [MN([4, 6, 8], 'Three bags hold 4, 6 and 8 apples. Share them fairly. How many in each?', null, true), MN([12, 7, 5], 'Goals in three games: 12, 7, 5. Find the mean.', null, true),
          MN([3, 5, 7, 9], null, null, true), MN([9, 9, 9], 'Find the mean of 9, 9, 9.'),
          { q: 'The mean of 4, 8 and a third number is 6. Find it.', eq: ['4 + 8 + [] = 18'], a: [6] }]
      },
      p3: {
        items: [MN([15, 20, 25], 'Kilometres biked on three days: 15, 20, 25. Find the mean.', null, true), MN([2, 6, 4, 8, 5], null, null, true),
          { q: 'The mean of 3 numbers is 5. Two are 2 and 9. What is the third?', eq: ['2 + 9 + [] = 15'], a: [4] },
          { q: '{b} says the mean of 2, 8, 5 is 15. Fix it.', lines: { n: 2, key: '15 is the total. Share it by 3: 15 ÷ 3 = 5.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why is the mean called a fair share?', lines: { n: 2, key: 'It is what each would get if the total were shared equally.' } },
          { q: 'The mean of 5, 5, 5 is 5. Why?', lines: { n: 2, key: 'They are already equal: nothing to move.' } },
          { q: 'Why divide by how many values there are?', lines: { n: 2, key: 'The total is shared among that many.' } },
          { q: 'Find the mean hours of sleep in your family.', lines: { n: 2, key: 'For example: 9 + 8 + 10 = 27, and 27 ÷ 3 = 9 hours.' } }]
      }
    },

    meanmode: {
      watch: 'giving the most common value when asked for the mean. Ask: "Are we looking for a repeat, or sharing out?"',
      goal: 'I can find the mean and the mode, and tell them apart.',
      learn: {
        show: { cap: '2, 3, 3, 8', eq: ['mode = 3', 'mean = 16 ÷ 4 = 4'] },
        together: [{ q: 'Find the mean and the mode of 5, 6, 6, 7.', eq: ['mean = []', 'mode = []'], a: [6, 6], stat: { v: [5, 6, 6, 7] } }, { q: 'Find the mean and the mode of 1, 4, 4, 7.', eq: ['mean = []', 'mode = []'], a: [4, 4], stat: { v: [1, 4, 4, 7] } }],
        cue: 'Mode: the value that repeats most. Mean: add, then share.',
        own: [{ q: 'Find the mean and the mode of 2, 2, 5, 7.', eq: ['mean = []', 'mode = []'], a: [4, 2], stat: { v: [2, 2, 5, 7] } }, { q: 'Find the mean and the mode of 3, 9, 9, 3, 6, 6, 6.', eq: ['mean = []', 'mode = []'], a: [6, 6], stat: { v: [3, 9, 9, 3, 6, 6, 6] } }]
      },
      p1: {
        items: [MM('Share the snacks out fairly. Mean or mode?', 'mean'), MM('The shoe size most common in class. Mean or mode?', 'mode'),
          MM('Even out the towers. Mean or mode?', 'mean'), MM('The pet that shows up most in the survey. Mean or mode?', 'mode'),
          MN([3, 4, 8]), MD([3, 4, 4, 8])]
      },
      p2: {
        items: [{ q: '2, 3, 3, 8: how much bigger is the mean than the mode?', eq: ['mean = []', 'mode = []', '[] − [] = []'], a: [4, 3, 4, 3, 1], stat: { v: [2, 3, 3, 8] } },
          { q: '1, 1, 4, 6: how much bigger is the mean than the mode?', eq: ['mean = []', 'mode = []', '[] − [] = []'], a: [3, 1, 3, 1, 2], stat: { v: [1, 1, 4, 6] } },
          MM('Each child gets the same number of stickers. Mean or mode?', 'mean'), MM('The most popular lunch. Mean or mode?', 'mode'),
          { q: 'Find the mean and the mode of 6, 2, 6, 10.', eq: ['mean = []', 'mode = []'], a: [6, 6], stat: { v: [6, 2, 6, 10] } }, { q: 'Find the mean and the mode of 9, 1, 2, 1, 4, 1.', eq: ['mean = []', 'mode = []'], a: [3, 1], stat: { v: [9, 1, 2, 1, 4, 1] } }]
      },
      p3: {
        items: [{ q: 'Find the mean and the mode of 10, 4, 10, 8.', eq: ['mean = []', 'mode = []'], a: [8, 10], stat: { v: [10, 4, 10, 8] } },
          { q: 'Find the mean and the mode of 5, 1, 9, 5.', eq: ['mean = []', 'mode = []'], a: [5, 5], stat: { v: [5, 1, 9, 5] } },
          { q: '{a} says the mean of 2, 2, 8 is 2, because 2 appears most. Fix it.', lines: { n: 2, key: '2 is the mode. The mean is 12 ÷ 3 = 4.' }, wide: true }]
      },
      think: {
        items: [{ q: 'How are the mean and the mode different?', lines: { n: 2, key: 'The mode is the most common value. The mean is the fair share.' } },
          { q: 'Can the mean and the mode be the same? Give an example.', lines: { n: 2, key: 'Yes: 5, 6, 6, 7 has mean 6 and mode 6.' } },
          { q: 'Can the mean be a value that is not in the data?', lines: { n: 2, key: 'Yes: 2, 3, 3, 8 has mean 4, and 4 is not in the list.' } },
          { q: 'Which would you use to plan snacks for a party? Why?', lines: { n: 2, key: 'The mode: the snack most people like.' } }]
      }
    },

    groups: {
      watch: 'expecting another group to give the same results, or treating a wrong prediction as a mistake. Predict, work out both, compare.',
      goal: 'I can compare the data of two groups.',
      learn: {
        show: { cap: 'Books read. Room 7: 2, 4, 4, 5, 10. Room 8: 1, 3, 4, 4, 3', eq: ['Room 7 mean 5', 'Room 8 mean 3'] },
        together: [GR('Room A', [3, 5, 4], 'Room B', [6, 6, 9])],
        cue: 'Predict first. Then work out each group, and compare.',
        own: [GR('Our class', [4, 5, 6], 'Iqaluit', [3, 5, 7])]
      },
      p1: {
        items: [GR('Team A', [2, 6, 4], 'Team B', [5, 5, 8]), GR('Family', [8, 9, 10], 'Friends', [7, 9, 11]),
          SAME('Team A', [2, 6, 4], 'Team B', [5, 5, 8], 'mean'), SAME('Family', [8, 9, 10], 'Friends', [7, 9, 11], 'mean')]
      },
      p2: {
        items: [GR('Room C', [2, 4, 4, 5, 10], 'Room D', [1, 3, 4, 4, 3]), SAME('Room C', [2, 4, 4, 5, 10], 'Room D', [1, 3, 4, 4, 3], 'mode'),
          SAME('Room C', [2, 4, 4, 5, 10], 'Room D', [1, 3, 4, 4, 3], 'mean'),
          { q: 'Hours outside. Town: 2, 3, 4. Farm: 5, 6, 7. How much bigger is the farm mean?', eq: ['Town mean = []', 'Farm mean = []', '[] − [] = []'], a: [3, 6, 6, 3, 3], stat: { g: { Town: [2, 3, 4], Farm: [5, 6, 7] } }, wide: true }]
      },
      p3: {
        items: [GR('Juniors', [6, 8, 7, 7], 'Seniors', [9, 10, 8, 9]), SAME('Juniors', [6, 8, 7, 7], 'Seniors', [9, 10, 8, 9], 'mode'),
          { q: '{b} predicted the Juniors and Seniors would have the same mean. Was the prediction right? Is that a mistake?', lines: { n: 2, key: 'No: 7 and 9. A prediction can be wrong; we test it and learn.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why might two classes give different answers to the same question?', lines: { n: 2, key: 'Different people, places and interests.' } },
          { q: 'Why predict before you collect the data?', lines: { n: 2, key: 'To test our thinking, then compare.' } },
          { q: 'Would Iqaluit and Toronto have the same favourite season? Predict.', lines: { n: 2, key: 'For example: maybe not; the weather is different.' } },
          { q: 'Ask your family and your friends one question. Compare.', lines: { n: 2, key: 'For example: family liked summer most; friends liked winter.' } }]
      }
    },

    words: {
      watch: 'calling something impossible when it is just unlikely, or thinking likely means "always". Compare the counts out loud, then choose the word.',
      goal: 'I can use words to describe chance.',
      learn: {
        show: { pic: BAG({ red: 2, blue: 6 }), cap: '2 red, 6 blue: fewer red', eq: ['red is unlikely'] },
        together: [CB({ red: 5, blue: 1 }, 'red'), CB({ blue: 6 }, 'red')],
        cue: 'Count the red. None: impossible. All: certain. Fewer than the rest: unlikely. More: likely.',
        own: [CB({ red: 1, blue: 5 }, 'red'), CB({ red: 6 }, 'red')]
      },
      p1: {
        items: [CB({ red: 3, blue: 3 }, 'red', ['unlikely', 'equally likely', 'likely']), CB({ red: 2, blue: 9 }, 'blue'),
          CW(SPN(['red', 'blue', 'blue', 'blue']), 'red'), CW(SPN(['red', 'red', 'red', 'blue']), 'red')]
      },
      p2: {
        items: [CT(BAG({ red: 2, blue: 7 }), 'red', 'impossible', '{a} says getting red is impossible. True or false?'), CT(BAG({ red: 7, blue: 2 }), 'red', 'likely', '{b} says getting red is likely. True or false?'),
          LK(BAG({ red: 2, blue: 5, green: 1 }), 'most', ['red', 'blue', 'green']), LK(BAG({ red: 2, blue: 5, green: 1 }), 'least', ['red', 'blue', 'green']),
          CB({ red: 4, blue: 4 }, 'blue', ['unlikely', 'equally likely', 'likely'])]
      },
      p3: {
        items: [CB({ red: 1, blue: 2, green: 5 }, 'green'),
          LK(SPN(['red', 'blue', 'blue', 'green', 'blue', 'green']), 'least', ['red', 'blue', 'green']),
          { q: 'Draw a bag where getting red is certain.', draw: { h: 70, key: BAG({ red: 5 }) } },
          { q: 'Draw a bag where getting red is unlikely.', draw: { h: 70, key: BAG({ red: 1, blue: 4 }) } }]
      },
      think: {
        items: [{ q: 'What is the difference between unlikely and impossible?', lines: { n: 2, key: 'Unlikely can still happen. Impossible never happens.' } },
          { q: 'Name something certain to happen tomorrow.', lines: { n: 1, key: 'For example: the sun will rise.' } },
          { q: 'Does likely mean it will always happen?', lines: { n: 2, key: 'No. It happens more often than not, but not every time.' } },
          { q: 'How could you make red equally likely in a bag of 2 red and 6 blue?', lines: { n: 2, key: 'Add 4 red, or take out 4 blue.' } }]
      }
    },

    predict: {
      watch: 'expecting the result to match the prediction exactly, or predicting just the number of red parts. A prediction says "about".',
      goal: 'I can make predictions and decide if a game is fair.',
      learn: {
        show: { pic: SPN(['red', 'blue', 'blue', 'blue']), cap: '1 of 4 parts red. 20 spins: 5 groups of 4', eq: ['about 5 reds'] },
        together: [PD(SPN(['red', 'blue', 'red', 'blue']), 20, 'red'), PD(SPN(['red', 'red', 'red', 'blue']), 20, 'red')],
        cue: 'How many groups of the parts fit in the spins? Then count the red in each group.',
        own: [PD(SPN(['red', 'blue', 'blue', 'blue']), 40, 'red'), PD(SPN(['red', 'blue']), 10, 'blue')]
      },
      p1: {
        items: [PD(SPN(['red', 'blue', 'blue']), 30, 'red'), PD(SPN(['red', 'red', 'blue']), 30, 'red'),
          FAIR(SPN(['red', 'blue', 'red', 'blue'])), FAIR(SPN(['red', 'blue', 'blue', 'blue']))]
      },
      p2: {
        items: [PD(BAG({ red: 1, blue: 4 }), 20, 'red'), PD(BAG({ red: 3, blue: 2 }), 10, 'red'),
          FAIR(BAG({ red: 3, blue: 3 }), 'red', 'blue', '{a} wins on red, {b} on blue. Is it fair?'), FAIR(BAG({ red: 2, blue: 4 }), 'red', 'blue', '{a} wins on red, {b} on blue. Is it fair?')]
      },
      p3: {
        items: [PD(SPN(['red', 'blue', 'green', 'blue']), 40, 'blue'), PD(BAG({ red: 1, blue: 1, green: 2 }), 20, 'green'),
          FAIR(SPN(['red', 'blue', 'green', 'blue']), 'red', 'green', '{a} wins on red, {b} on green. Is it fair?'),
          { q: 'Predicted about 10 reds in 20 spins. Got 12. Was the prediction wrong?', lines: { n: 2, key: 'No. A prediction is "about". 12 is close to 10.' }, wide: true }]
      },
      think: {
        items: [{ q: 'Why do we say "about" when we predict?', lines: { n: 2, key: 'Chance changes each time, so the result is near the prediction, not exact.' } },
          { q: 'What makes a game fair?', lines: { n: 2, key: 'Each player has the same chance to win.' } },
          { q: 'Make the spinner game fair: red, blue, blue, blue.', lines: { n: 2, key: 'Make 2 red and 2 blue parts.' } },
          { q: 'Spin 20 times. Was your result close to your prediction?', lines: { n: 2, key: 'For example: predicted 5, got 6: close.' } }]
      }
    }
  } });
})();
