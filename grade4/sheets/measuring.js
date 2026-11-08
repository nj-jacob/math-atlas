/* Grade 4 Measuring: printable worksheets (assets/engine/sheets.js). One set per idea of the lessons in
   chapters/measuring.js: Learn, Practise 1 to 3 and Think. Every question is written here, not made at random,
   so a sheet always prints the same. Theme words: {a} {b} names, {one} {many} the things, {cont} {conts} what holds them.
   Ontario 2020: E2.1 grams and kilograms, millilitres and litres, and reading a scale; E2.2 choosing the unit and the
   tool; E2.3 units of time and elapsed time; E2.5 area in square units, and length × width; E2.6 a missing side from
   the area. The answer checks are in tests/verify/sheets.js: a row with two units is put into one unit (2 kg 300 g =
   2300 g, 1 h 15 min = 75 min), a time of day becomes minutes after midnight (clock), a scale or a jug shows its
   amount, a unit or a tool comes from the thing's real size (pick.size), and an area from the picture. */
(function () {
  var S = Atlas.sheets;
  if (!S) return;
  var F = S.fmt, MU = { g: 1, kg: 1000, mL: 1, L: 1000, s: 1, min: 60, h: 3600, day: 86400, days: 86400, weeks: 604800 };
  function story(q, unit, ans, calc) { return { q: q, eq: ['[] ' + unit], a: [ans], calc: calc }; }
  /* a conversion: n of one unit in another */
  function CV(n, from, to) { return { eq: [F(n) + ' ' + from + ' = [] ' + to], a: [F(n * MU[from] / MU[to])] }; }
  /* a big unit and a small one together, in the small unit; and the other way */
  function MX(n, m, big, small) { return { eq: [n + ' ' + big + ' ' + m + ' ' + small + ' = [] ' + small], a: [F(n * MU[big] / MU[small] + m)] }; }
  function SP(n, big, small) { var k = MU[big] / MU[small]; return { eq: [F(n) + ' ' + small + ' = [] ' + big + ' [] ' + small], a: [Math.floor(n / k), n % k] }; }
  /* compare two amounts: <, > or = */
  function amt(s) { var t = s.split(' '), v = 0; for (var i = 0; i < t.length; i += 2) v += +t[i] * MU[t[i + 1]]; return v; }
  function CP(x, y) { var p = amt(x), q = amt(y); return { eq: [x + ' [] ' + y], a: [p < q ? '<' : p > q ? '>' : '='] }; }
  /* a kitchen scale and a measuring jug: read the amount, or draw it (the key draws it) */
  var G1 = { max: 1000, lab: 200, tick: 50 }, G2 = { max: 1000, lab: 200, tick: 25 }, KG = { max: 5000, lab: 1000, tick: 250, unit: 'kg' };
  var J1 = { max: 1000, lab: 200, tick: 50 }, J2 = { max: 2000, lab: 500, tick: 100 };
  function RD(g, sc) { return { pic: ['dial', Object.assign({ g: g }, sc || G1)], eq: ['[] g'], a: [g] }; }
  function DD(g, sc) { return { q: 'Draw the needle at ' + F(g) + ' g.', pic: ['dial', Object.assign({ g: g, blank: true }, sc || G1)] }; }
  function JG(m, sc) { return { pic: ['jug', Object.assign({ mL: m }, sc || J1)], eq: ['[] mL'], a: [m] }; }
  function DJ(m, sc) { return { q: 'Colour the jug up to ' + F(m) + ' mL.', pic: ['jug', Object.assign({ mL: m, blank: true }, sc || J1)] }; }
  /* the unit, the kind or the tool for a thing whose real size is v metres, grams or litres */
  var LEN = ['mm', 'cm', 'm', 'km'], MASS = ['g', 'kg'], CAP = ['mL', 'L'], KINDS = ['length', 'mass', 'capacity'], TOOLS = ['ruler', 'measuring tape', 'scale', 'measuring jug'];
  function sz(u, v) { var o = {}; o[u] = v; return o; }
  function UN(q, u, v) {
    var opts = u === 'm' ? LEN : u === 'g' ? MASS : CAP;
    var fit = u === 'm' ? (v < 0.01 ? 'mm' : v < 1 ? 'cm' : v < 1000 ? 'm' : 'km') : u === 'g' ? (v < 1000 ? 'g' : 'kg') : v < 1 ? 'mL' : 'L';
    return { q: q + ': which unit?', pick: { opts: opts, ans: opts.indexOf(fit), size: sz(u, v) } };
  }
  function KD(q, u, v) { return { q: q, pick: { opts: KINDS, ans: { m: 0, g: 1, L: 2 }[u], size: sz(u, v) } }; }
  function TL(q, u, v) { var t = u === 'm' ? (v < 1 ? 'ruler' : 'measuring tape') : u === 'g' ? 'scale' : 'measuring jug'; return { q: q + ': which tool?', pick: { opts: TOOLS, ans: TOOLS.indexOf(t), size: sz(u, v) } }; }
  function ES(q, opts, u, v) {
    var EU = { mm: 0.001, cm: 0.01, m: 1, km: 1000, g: 1, kg: 1000, mL: 0.001, L: 1 };
    var d = opts.map(function (o) { var m = o.split(' '); return Math.abs(Math.log(+m[0] * EU[m[1]] / v)); });
    return { q: q, pick: { opts: opts, ans: d.indexOf(Math.min.apply(null, d)), size: sz(u, v) } };
  }
  /* times of day: [h, m, 'a' | 'p'] */
  function T(t, bare) { return t[0] + ':' + ('0' + t[1]).slice(-2) + (bare ? '' : ' ' + t[2] + '.m.'); }
  function mins(t) { return (t[0] % 12 + (t[2] === 'p' ? 12 : 0)) * 60 + t[1]; }
  function at(v) { var h = Math.floor(v / 60) % 24; return [h % 12 || 12, v % 60, h < 12 ? 'a' : 'p']; }
  function CL(s, e) { return ['row', { list: [['clock', { h: s[0], m: s[1], R: 30 }], ['clock', { h: e[0], m: e[1], R: 30 }]], labels: ['Start', 'End'] }]; }
  /* elapsed time: jump to the next hour, then whole hours, then the minutes left; then add the jumps */
  function EL(s, e, pic) {
    var a = mins(s), b = mins(e), eq = [], ans = [], jumps = [], bare = a >= 720 || b < 720;
    var hop = function (to, unit) { var d = to - a, n = unit === 'h' ? d / 60 : d; eq.push(T(at(a), bare) + ' + [] ' + unit + ' = ' + T(at(to), bare)); ans.push(n); jumps.push([n, unit]); a = to; };
    var next = Math.ceil(a / 60) * 60;
    if (next > a && next <= b) hop(next, 'min');
    if (Math.floor(b / 60) * 60 > a) hop(Math.floor(b / 60) * 60, 'h');
    if (b > a) hop(b, 'min');
    var hrs = jumps.some(function (j) { return j[1] === 'h'; }), tot = mins(e) - mins(s);
    eq.push(hrs ? jumps.map(function (j) { return '[] ' + j[1]; }).join(' + ') + ' = [] h [] min' : jumps.map(function () { return '[]'; }).join(' + ') + ' = [] min');
    ans = ans.concat(jumps.map(function (j) { return j[0]; }), hrs ? [Math.floor(tot / 60), tot % 60] : [tot]);
    var o = { q: (pic ? '' : 'From ' + T(s) + ' to ' + T(e) + ' ') + 'How long?', eq: eq, a: ans, clock: true, wide: hrs || !bare };
    if (pic) o.pic = CL(s, e);
    return o;
  }
  /* the end time (or, with back, the start time) from a start and how long */
  function EN(s, d) { var e = at(mins(s) + d), u = d < 60 ? d + ' min' : Math.floor(d / 60) + ' h' + (d % 60 ? ' ' + d % 60 + ' min' : ''); return { q: 'Starts at ' + T(s) + ' Lasts ' + u + '. When does it end?', eq: [T(s, e[2] === s[2]) + ' + ' + u + ' = []' + (e[2] === s[2] ? '' : ' ' + e[2] + '.m.')], a: [e[0] + ':' + ('0' + e[1]).slice(-2)], clock: true, wide: e[2] !== s[2] }; }
  function BK(e, d) { var s = at(mins(e) - d); return { q: 'Ends at ' + T(e) + ' It took ' + d + ' min. When did it start?', eq: ['[]' + (e[2] === s[2] ? '' : ' ' + s[2] + '.m.') + ' + ' + d + ' min = ' + T(e, e[2] === s[2])], a: [s[0] + ':' + ('0' + s[1]).slice(-2)], clock: true, wide: e[2] !== s[2] }; }
  /* area: count the squares (rows of), a rectangle's length × width, a missing side */
  function AR(c, r, rows) { return { q: 'Each square is 1 cm².', pic: ['area', { cols: Math.max(c + 1, 6), rows: Math.max(r + 1, 4), rect: [c, r] }], eq: rows ? ['[] × [] = [] cm²'] : ['[] cm²'], a: rows ? [r, c, r * c] : [r * c] }; }
  function cells(list) { var out = []; list.forEach(function (b) { for (var i = b[0]; i < b[0] + b[2]; i++) for (var j = b[1]; j < b[1] + b[3]; j++) if (out.indexOf(i + ',' + j) < 0) out.push(i + ',' + j); }); return out; }
  function AC(blocks, cols, rows) { var c = cells(blocks); return { q: 'Each square is 1 cm².', pic: ['area', { cols: cols || 7, rows: rows || 5, cells: c }], eq: ['[] cm²'], a: [c.length] }; }
  function PL(b, h, u, one) { return { pic: ['plane', { kind: 'rect', b: b, h: h, unit: u }], eq: one ? ['[] ' + u + '²'] : ['[] × [] = [] ' + u + '²'], a: one ? [b * h] : [b, h, b * h] }; }
  function MS(area, w, u) { return { q: 'Area: ' + area + ' ' + u + '².', pic: ['rect', { a: '?', b: w, unit: u, w: 90, h: 40 }], eq: [area + ' ÷ ' + w + ' = [] ' + u], a: [area / w] }; }

  S.register('measuring', { code: 'ME', ideas: {

    'grams-kg': {
      watch: 'thinking 1 kg is 100 g. Ask how many 100 g blocks balance a kilogram: 10, so 1000 g.',
      goal: 'I can change between grams and kilograms.',
      learn: {
        show: { cap: 'Ten 100 g blocks balance 1 kg', eq: ['1 kg = 1000 g'] },
        together: [CV(2, 'kg', 'g'), CV(3000, 'g', 'kg')],
        cue: 'kg to g: × 1000. g to kg: ÷ 1000.',
        own: [CV(5, 'kg', 'g'), CV(4000, 'g', 'kg'), MX(1, 500, 'kg', 'g'), CP('1 kg', '900 g')]
      },
      p1: {
        items: [CV(3, 'kg', 'g'), CV(7000, 'g', 'kg'), CV(9, 'kg', 'g'), MX(2, 400, 'kg', 'g'), MX(4, 50, 'kg', 'g'), CP('3 kg', '3500 g')]
      },
      p2: {
        items: [SP(2600, 'kg', 'g'), SP(1250, 'kg', 'g'), CP('2 kg 100 g', '2010 g'), CP('1500 g', '1 kg 500 g'),
          { q: 'A bag of flour is 2 kg. {a} uses 500 g. How much is left?', eq: ['2 kg = [] g', '[] − 500 = [] g'], a: [2000, 2000, 1500] },
          { q: 'A box holds 8 bags of 500 g. How many kilograms?', eq: ['8 × 500 = [] g', '[] g = [] kg'], a: [4000, 4000, 4] }]
      },
      p3: {
        items: [{ q: 'How many 250 g packs of butter make 1 kg?', eq: ['1 kg = [] g', '[] ÷ 250 = []'], a: [1000, 1000, 4] },
          { q: '{b}\'s dog is 9 kg. {a}\'s cat is 4 kg 300 g. How much heavier is the dog?', eq: ['9 kg = [] g', '4 kg 300 g = [] g', '[] − [] = [] g'], a: [9000, 4300, 9000, 4300, 4700] },
          CP('2500 g', '2 kg 50 g'), SP(3075, 'kg', 'g')]
      },
      think: {
        items: [{ q: '{b} says 1 kg is 100 g. How could you show {b} it is 1000 g?', lines: { n: 3, key: 'Ten 100 g blocks balance 1 kg, and 10 × 100 = 1000.' } },
          { q: 'Which is heavier: 1 kg of feathers or 1 kg of stones?', lines: { n: 2, key: 'Neither. Both have a mass of 1 kg.' } },
          { q: 'Name something with a mass of about 1 kg.', lines: { n: 2, key: 'For example: a bag of sugar or a litre of water.' } },
          CP('3 kg 5 g', '3050 g')]
      }
    },

    'read-scale': {
      watch: 'counting each small mark as 1 g, or reading the next number after the needle. Find what one small mark is worth first.',
      goal: 'I can read a scale.',
      learn: {
        show: { cap: 'Each small mark is 50 g. Numbered mark, then count on', eq: ['300 + 50 = 350 g'] },
        together: [RD(400), RD(650)],
        cue: 'Find what one small mark is worth. Start at the numbered mark before the needle.',
        own: [RD(850), RD(150)]
      },
      p1: {
        items: [RD(250), RD(550), RD(900), RD(50), DD(600), DD(350)]
      },
      p2: {
        show: { cap: 'On these scales each small mark is 25 g' },
        items: [RD(325, G2), RD(675, G2), RD(925, G2), DD(475, G2)]
      },
      p3: {
        show: { cap: 'This scale counts in kilograms: each small mark is 250 g' },
        items: [RD(2500, KG), RD(3750, KG), RD(1250, KG),
          { q: '{a} adds 400 g more. What will the scale show?', pic: ['dial', Object.assign({ g: 750 }, G1)], eq: ['750 + 400 = [] g'], a: [1150] }]
      },
      think: {
        items: [{ q: 'Why do you need to know what one small mark is worth?', lines: { n: 3, key: 'Marks can be worth 1, 25, 50 or 250 g. Count the marks between two numbers and share.' } },
          { q: 'Draw the needle at half a kilogram: 500 g.', pic: ['dial', Object.assign({ g: 500, blank: true }, G1)] },
          { q: '{b} reads this scale as 620 g. What did {b} do wrong?', pic: ['dial', Object.assign({ g: 700 }, G1)], lines: { n: 2, key: 'Each small mark is 50 g, not 10 g. The needle is at 700 g.' } }]
      }
    },

    litres: {
      watch: 'mixing up capacity and mass. Capacity is how much a container holds: mL and L.',
      goal: 'I can change between millilitres and litres.',
      learn: {
        show: { cap: 'A milk carton holds 1 L', eq: ['1 L = 1000 mL'] },
        together: [CV(2, 'L', 'mL'), JG(400)],
        cue: 'L to mL: × 1000. On this jug each small mark is 50 mL.',
        own: [CV(3000, 'mL', 'L'), JG(750)]
      },
      p1: {
        items: [CV(4, 'L', 'mL'), CV(6000, 'mL', 'L'), JG(250), JG(900), MX(1, 250, 'L', 'mL'), CP('2 L', '1800 mL')]
      },
      p2: {
        items: [SP(1500, 'L', 'mL'), DJ(600), JG(1500, J2), CP('1 L 50 mL', '1500 mL'),
          { q: 'A 2 L jug of juice fills 250 mL glasses. How many glasses?', eq: ['2 L = [] mL', '[] ÷ 250 = []'], a: [2000, 2000, 8] },
          story('A teaspoon holds about 5 mL. About how many teaspoons are in 100 mL?', 'teaspoons', 20, '100 ÷ 5')]
      },
      p3: {
        items: [{ q: 'A pot holds 3 L. {a} pours in 1 L 400 mL. How much more fits?', eq: ['3 L = [] mL', '1 L 400 mL = [] mL', '[] − [] = [] mL'], a: [3000, 1400, 3000, 1400, 1600] },
          { q: 'Each of 6 water bottles holds 500 mL. How many litres in all?', eq: ['6 × 500 = [] mL', '[] mL = [] L'], a: [3000, 3000, 3] },
          CP('4 L', '3999 mL'), JG(1200, J2)]
      },
      think: {
        items: [{ q: '{b} says a tall glass always holds more than a wide bowl. How could you check?', lines: { n: 3, key: 'Fill one with water and pour it into the other, or measure each in mL.' } },
          { q: 'Name something that holds about 1 L and something that holds about 5 mL.', lines: { n: 2, key: 'For example: a milk carton holds 1 L; a teaspoon holds 5 mL.' } },
          { q: 'Is 1 L more than 900 mL? Explain.', lines: { n: 2, key: 'Yes. 1 L = 1000 mL, and 1000 is more than 900.' } },
          DJ(1700, J2)]
      }
    },

    units: {
      watch: 'using a length unit for mass ("the cat is 4 m"), or a huge unit for a small thing. Ask: how long, how heavy, or how much it holds?',
      goal: 'I can choose the unit and the tool.',
      learn: {
        show: { cap: 'What kind? Then: small or large?', eq: ['length: cm, m', 'mass: g, kg', 'capacity: mL, L'] },
        together: [KD('How heavy is a pumpkin?', 'g', 4000), UN('The length of a pencil', 'm', 0.18)],
        cue: 'Length, mass or capacity? Then small or large?',
        own: [UN('The mass of a cat', 'g', 4500), UN('The water in a bathtub', 'L', 150), TL('The length of a hallway', 'm', 12), KD('The water in a pail', 'L', 8)]
      },
      p1: {
        items: [KD('How long is a canoe?', 'm', 5), KD('How much does a jug hold?', 'L', 2), UN('The mass of an apple', 'g', 150), UN('The length of a hockey rink', 'm', 60),
          UN('Juice in a juice box', 'L', 0.2), UN('The distance from Ottawa to Montréal', 'm', 200000)]
      },
      p2: {
        items: [TL('The width of a book', 'm', 0.2), TL('The mass of a bag of potatoes', 'g', 5000), TL('Water for a recipe', 'L', 0.25), UN('The length of an ant', 'm', 0.004),
          UN('The mass of a moose', 'g', 450000), UN('Water in a swimming pool', 'L', 50000)]
      },
      p3: {
        items: [ES('The mass of a paper clip', ['1 g', '100 g', '1 kg'], 'g', 1), ES('A juice box holds', ['20 mL', '200 mL', '2 L'], 'L', 0.2),
          ES('The height of a door', ['20 cm', '2 m', '20 m'], 'm', 2), ES('The mass of a bike', ['100 g', '10 kg', '1000 kg'], 'g', 12000),
          TL('The length of a soccer field', 'm', 100), KD('The milk in a carton', 'L', 1)]
      },
      think: {
        items: [{ q: '{b} says a cat is 4 m. What is wrong?', lines: { n: 2, key: 'Metres measure length. The cat\'s mass is about 4 kg.' } },
          { q: 'Why measure a road in km and not in cm?', lines: { n: 3, key: 'A road is very long. In cm the number would be huge; km keeps it small.' } },
          { q: 'Name a body benchmark for 1 cm and one for 1 m.', lines: { n: 2, key: 'For example: a fingernail is about 1 cm wide; a big step is about 1 m.' } },
          TL('How much water a sink holds', 'L', 20)]
      }
    },

    'time-units': {
      watch: 'treating an hour as 100 minutes (1 h 30 min = 130 min). An hour is 60 minutes.',
      goal: 'I can change between units of time.',
      learn: {
        show: { cap: '60 s = 1 min, 24 h = 1 day, 7 days = 1 week', eq: ['60 min = 1 h'] },
        together: [CV(2, 'h', 'min'), CV(120, 's', 'min')],
        cue: '60, not 100.',
        own: [CV(3, 'h', 'min'), CV(2, 'days', 'h'), MX(1, 15, 'h', 'min'), CP('90 min', '1 h 30 min')]
      },
      p1: {
        items: [CV(4, 'h', 'min'), CV(5, 'min', 's'), CV(3, 'weeks', 'days'), CV(180, 'min', 'h'), CV(14, 'days', 'weeks'), MX(2, 10, 'h', 'min')]
      },
      p2: {
        items: [SP(75, 'h', 'min'), SP(130, 'h', 'min'), CP('100 min', '1 h 40 min'), CP('2 h', '100 min'), CV(48, 'h', 'days'),
          { q: '{a} reads for 20 min a day for 6 days. How long in all?', eq: ['20 × 6 = [] min', '[] min = [] h'], a: [120, 120, 2] }]
      },
      p3: {
        items: [{ q: 'One movie is 1 h 45 min. Another is 110 min. How much longer is the second?', eq: ['1 h 45 min = [] min', '110 − [] = [] min'], a: [105, 105, 5] },
          { q: 'A swim lesson is 45 min, once a week for 5 weeks. How long in all?', eq: ['5 × 45 = [] min', '[] min = [] h [] min'], a: [225, 225, 3, 45] },
          { q: 'Camp lasts 3 weeks and 2 days. How many days?', eq: ['3 weeks = [] days', '[] + 2 = [] days'], a: [21, 21, 23] },
          CP('1 day', '20 h')]
      },
      think: {
        items: [{ q: '{b} says 1 h 30 min is 130 min. What would you tell {b}?', lines: { n: 3, key: 'An hour is 60 min, not 100. 60 + 30 = 90 min.' } },
          { q: 'Why is 1 h 30 min not written 1.30 h?', lines: { n: 3, key: '30 min is half an hour, so it is 1.5 h. The minutes are sixtieths, not hundredths.' } },
          SP(200, 'h', 'min')]
      }
    },

    elapsed: {
      watch: 'subtracting times like ordinary numbers (11:15 − 9:40 = 1:75). Jump on a time line: to the next hour first.',
      goal: 'I can find how long something takes.',
      learn: {
        show: { cap: '9:40 to 10:15: jump to 10:00 first', eq: ['20 min + 15 min = 35 min'] },
        together: [EL([9, 40, 'a'], [10, 15, 'a'], true), EL([1, 50, 'p'], [2, 30, 'p'], true)],
        cue: 'Jump to the next hour first. Then whole hours, then minutes.',
        own: [EL([10, 35, 'a'], [11, 20, 'a']), EN([2, 45, 'p'], 30)]
      },
      p1: {
        items: [EL([8, 50, 'a'], [9, 25, 'a']), EL([3, 40, 'p'], [4, 10, 'p']), EL([11, 30, 'a'], [12, 15, 'p']), EN([9, 15, 'a'], 40), EN([4, 50, 'p'], 25)]
      },
      p2: {
        items: [EL([9, 40, 'a'], [11, 15, 'a']), EL([1, 20, 'p'], [3, 5, 'p']), EN([8, 45, 'a'], 90), BK([4, 10, 'p'], 50)]
      },
      p3: {
        items: [EL([10, 45, 'a'], [1, 30, 'p']),
          { q: 'A game starts at 6:30 p.m. Each half is 45 min, with a 15 min break. When does it end?', eq: ['45 + 15 + 45 = [] min', '6:30 + [] min = []'], a: [105, 105, '8:15'], clock: true },
          BK([3, 5, 'p'], 35), EN([1, 35, 'p'], 50)]
      },
      think: {
        items: [{ q: '{b} says 9:40 to 11:15 is 1 h 75 min. What would you tell {b}?', lines: { n: 3, key: 'Clock times are not ordinary numbers. Jump: 20 min to 10:00, 1 h to 11:00, 15 min: 1 h 35 min.' } },
          { q: 'Why jump to the next hour first?', lines: { n: 2, key: 'Whole hours are easy to count on, and then only the minutes are left.' } },
          { q: 'Plan a 1 h 20 min activity that ends at 12:00 p.m. When does it start?', lines: { n: 2, key: '10:40 a.m.' } }]
      }
    },

    squares: {
      watch: 'writing cm for an area. Area counts squares, so its unit is a square unit: cm².',
      goal: 'I can find area by counting square units.',
      learn: {
        show: { pic: ['area', { cols: 4, rows: 3, rect: [4, 3] }], cap: 'Each square is 1 cm²', eq: ['12 cm²'] },
        together: [AR(3, 2), AR(5, 2)],
        cue: 'Count the squares. Write cm².',
        own: [AR(4, 3), AC([[0, 0, 2, 3], [2, 2, 3, 1]])]
      },
      p1: {
        items: [AR(2, 2), AR(6, 1), AR(3, 3), AC([[0, 0, 3, 1], [0, 1, 1, 2]]), AC([[1, 0, 1, 3], [0, 1, 3, 1]]), AC([[0, 0, 4, 2], [0, 2, 2, 2]])]
      },
      p2: {
        show: { cap: 'Count one row, then the rows', eq: ['5 × 3 = 15 cm²'] },
        items: [AR(5, 3, true), AR(4, 4, true), AR(6, 2, true), AR(7, 3, true)]
      },
      p3: {
        items: [AR(8, 3, true), AC([[0, 0, 5, 2], [0, 2, 2, 2]], 7, 5),
          { q: 'Draw a rectangle with an area of 12 cm².', draw: { h: 80, key: ['area', { cols: 8, rows: 4, rect: [6, 2] }] } },
          { q: 'Draw a different shape with an area of 12 cm².', draw: { h: 80, key: ['area', { cols: 8, rows: 4, rect: [4, 3] }] } }]
      },
      think: {
        items: [{ q: '{b} counted a 5 by 2 rectangle and wrote "10 cm". What is missing?', lines: { n: 2, key: 'The square unit: 10 cm², because area counts squares.' } },
          { q: 'Why do we measure area in squares, not in lines?', lines: { n: 3, key: 'Area covers a surface. Squares fit together with no gaps or overlaps.' } },
          { q: 'Draw two different shapes that each have an area of 6 cm².', draw: { h: 80, key: 'For example: a 3 by 2 rectangle and a 6 by 1 strip.' } }]
      }
    },

    formula: {
      watch: 'adding the length and width, or counting the outside. Area is length × width.',
      goal: 'I can find the area of a rectangle with length × width.',
      learn: {
        show: { pic: ['plane', { kind: 'rect', b: 8, h: 5, unit: 'm' }], cap: '5 rows of 8 squares', eq: ['8 × 5 = 40 m²'] },
        together: [PL(6, 4, 'cm'), PL(7, 3, 'm')],
        cue: 'Area = length × width. Write square units.',
        own: [PL(9, 5, 'm'), story('A rug is 4 m long and 3 m wide. What is its area?', 'm²', 12, '4 × 3')]
      },
      p1: {
        items: [PL(5, 2, 'cm'), PL(8, 3, 'cm'), PL(6, 6, 'm'), PL(9, 4, 'm'), PL(7, 5, 'cm'), PL(10, 3, 'm')]
      },
      p2: {
        items: [PL(12, 6, 'm', true), PL(15, 4, 'cm', true),
          story('A garden is 7 m long and 6 m wide. What is its area?', 'm²', 42, '7 × 6'),
          story('A poster is 9 cm by 8 cm. What is its area?', 'cm²', 72, '9 × 8'),
          story('A classroom floor is 10 m by 8 m. What is its area?', 'm²', 80, '10 × 8'),
          story('A square tile has sides of 9 cm. What is its area?', 'cm²', 81, '9 × 9')]
      },
      p3: {
        items: [{ q: 'A garden is 8 m by 6 m. A bag of seeds covers 4 m². How many bags?', eq: ['8 × 6 = [] m²', '[] ÷ 4 = [] bags'], a: [48, 48, 12] },
          { q: 'Two rooms: 5 m by 4 m and 6 m by 3 m. What is the total area?', eq: ['5 × 4 = [] m²', '6 × 3 = [] m²', '[] + [] = [] m²'], a: [20, 18, 20, 18, 38] },
          { q: 'Do a 6 cm by 4 cm rectangle and an 8 cm by 3 cm one have the same area?', pick: { opts: ['yes', 'no'], ans: 0 }, tf: '6 × 4 = 8 × 3' },
          PL(11, 7, 'm', true)]
      },
      think: {
        items: [{ q: '{b} says a 6 m by 4 m room has an area of 10 m². What did {b} do?', lines: { n: 3, key: '{b} added: 6 + 4. Area is 6 × 4 = 24 m².' } },
          { q: 'Why does length × width give the number of squares?', lines: { n: 3, key: 'The width is the number of rows; the length is the number in each row.' } },
          { q: 'Draw two different rectangles with an area of 24 cm². Label the sides.', draw: { h: 90, key: 'For example: 6 cm by 4 cm, and 8 cm by 3 cm.' } }]
      }
    },

    'missing-side': {
      watch: 'multiplying the area by the side. Think: what times the side makes the area? Divide.',
      goal: 'I can find a missing side from the area.',
      learn: {
        show: { pic: ['rect', { a: '?', b: 4, unit: 'm', w: 90, h: 40 }], cap: 'Area 36 m²: ? × 4 = 36', eq: ['36 ÷ 4 = 9 m'] },
        together: [MS(24, 4, 'cm'), MS(30, 5, 'm')],
        cue: 'Area ÷ the side you know = the missing side.',
        own: [MS(42, 6, 'm'), MS(27, 3, 'cm')]
      },
      p1: {
        items: [MS(18, 3, 'cm'), MS(40, 5, 'm'), MS(28, 4, 'cm'), MS(54, 6, 'm'), MS(35, 7, 'cm'), MS(64, 8, 'm')]
      },
      p2: {
        items: [{ eq: ['[] × 7 = 56', '56 ÷ 7 = []'], a: [8, 8] }, { eq: ['[] × 9 = 72', '72 ÷ 9 = []'], a: [8, 8] },
          story('A garden has an area of 48 m². It is 6 m wide. How long is it?', 'm', 8, '48 ÷ 6'),
          story('A rug has an area of 45 m². It is 9 m long. How wide is it?', 'm', 5, '45 ÷ 9'),
          story('A card has an area of 63 cm². One side is 7 cm. How long is the other?', 'cm', 9, '63 ÷ 7'),
          MS(80, 10, 'm')]
      },
      p3: {
        items: [{ q: 'A rectangle has an area of 24 cm². Find two different pairs of sides.', eq: ['[] × [] = 24', '[] × [] = 24'], a: [6, 4, 8, 3] },
          { q: 'A square has an area of 49 m². How long is a side?', eq: ['[] × [] = 49'], a: [7, 7] },
          story('A field has an area of 60 m². It is 10 m long. How wide is it?', 'm', 6, '60 ÷ 10'),
          MS(96, 8, 'cm')]
      },
      think: {
        items: [{ q: '{b} says the missing side is 36 × 4 = 144 m. What would you tell {b}?', lines: { n: 3, key: 'Something times 4 makes 36, so divide: 36 ÷ 4 = 9 m.' } },
          { q: 'How can you check a missing side?', lines: { n: 2, key: 'Multiply the two sides. You should get the area.' } },
          { q: 'A rectangle has an area of 12 m². List every pair of whole-number sides.', lines: { n: 2, key: '1 and 12, 2 and 6, 3 and 4.' } }]
      }
    }
  } });
})();
