/* Answer checks for the printable worksheets (assets/engine/sheets.js, gradeN/sheets/*.js).
   window.__sheetCheck(item) gets one question of a sheet, with the theme's words already put in, and returns a list of
   problems (empty when the answer key is right). Every answer is worked out again here from the question itself:
   the sums are filled in with the key's answers and must come out true, the picture must match the sum, a story's
   answer must follow from its numbers, and every circled choice must be the only right one. */
(function () {
  const OPS = /^[\d+\-*/(). ]+$/;
  /* the value of a plain sum such as "3 * (4 + 2)", or NaN */
  function val(s) {
    s = s.trim();
    if (!s || !OPS.test(s)) return NaN;
    try { const v = Function('"use strict"; return (' + s + ');')(); return typeof v === 'number' && isFinite(v) ? v : NaN; } catch (e) { return NaN; }
  }
  /* sheet maths into plain maths: × ÷ −, 12 500 as 12500, 2 3/4 as (2 + 3/4), 1/4 as (1/4), 75% as 75 / 100, $4.50 as 4.50, "23 hundreds" as (23 * 100), a remainder "R" kept,
     and "3 groups of 4", "3 rows of 4", "3 jumps of 4" mean 3 × 4; other words go */
  const PLACE = { 'ten thousand': 10000, thousand: 1000, hundred: 100, ten: 10, one: 1, tenth: 0.1, hundredth: 0.01, thousandth: 0.001 };
  /* a row with two or more different metric units (3.5 m = 350 cm, 1 kg 200 g = 1200 g) is put into one unit per kind:
     every amount becomes its number times the unit's size in metres, grams or litres */
  const MU = { mm: 0.001, cm: 0.01, m: 1, km: 1000, mg: 0.001, g: 1, kg: 1000, mL: 0.001, L: 1 };
  /* units of time work the same way, in seconds (1 h 15 min = 75 min) */
  const TU = { s: 1, min: 60, h: 3600, day: 86400, days: 86400, week: 604800, weeks: 604800 };
  function metric(s) {
    /* areas: 3 m² = 30 000 cm² (a square unit's size is its length squared) */
    const sq = /(\d+(?:\.\d+)?) ?(mm|cm|m|km)²/g;
    if (new Set([...s.matchAll(sq)].map(m => m[2])).size >= 2) return s.replace(sq, (m, n, u) => '(' + n + ' * ' + MU[u] * MU[u] + ')');
    const re = /(\d+(?:\.\d+)?) ?(mm|min|mL|mg|cm|km|kg|m|g|L|h|s|days?|weeks?)(?![\w²³])/g;
    if (new Set([...s.matchAll(re)].map(m => m[2])).size < 2) return s;
    return s.replace(re, (m, n, u) => '(' + n + ' * ' + (MU[u] || TU[u]) + ')').replace(/\) \(/g, ') + (');
  }
  function norm(s) {
    return metric(String(s).replace(/(\d)[\u00a0 ](?=\d{3}\b)/g, '$1'))
      .replace(/(^|[^\d.\/])(\d+) (\d+)\/(\d+)/g, (m, pre, w, n, d) => pre + '(' + w + ' + ' + n + '/' + d + ')')
      .replace(/(^|[^\d.(])(\d+)\/(\d+)(?![\d.])/g, '$1($2/$3)')
      .replace(/\) of (?=[\d(])/g, ') * ')
      .replace(/(\d+) (ten thousand|thousandth|thousand|hundredth|hundred|tenth|ten|one)s?\b/g, (m, n, pl) => '(' + n + ' * ' + PLACE[pl] + ') +')
      .replace(/\$/g, '').replace(/ ?%/g, ' / 100').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\b(groups|rows|jumps) of\b/g, '*')
      .replace(/ R (?=\d)/g, ' ~ ').replace(/\.(?!\d)|(?<!\d)\./g, ' ')
      .replace(/[A-Za-z’'?:²³°¢]+/g, ' ').replace(/~/g, 'R').replace(/\+\s*(?=[=<>)]|$)/g, '').replace(/\s+/g, ' ').trim();
  }
  const nums = s => (String(s).replace(/(\d)[\u00a0 ](?=\d{3}\b)/g, '$1').match(/\d+(\.\d+)?/g) || []).map(Number);
  /* two values are the same when they differ only by rounding (0.1 + 0.2 and 0.3) */
  const same = (x, y) => Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));
  /* the value of a number as a sheet writes it: 12 500, 3.75, $4.50 */
  const num = s => { const v = Number(String(s).replace(/\u00a0|\s/g, '').replace(/^\$/, '')); return isNaN(v) ? val(norm(s)) : v; };
  /* a number written in words, such as "three hundred forty-two", or NaN */
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function fromWords(w) {
    /* a decimal: "four and thirty-six hundredths", "five thousandths" */
    const dec = String(w).toLowerCase().match(/^(?:(.+) and )?(.+) (tenth|hundredth|thousandth)s?$/);
    if (dec) return (dec[1] ? fromWords(dec[1]) : 0) + fromWords(dec[2]) * { tenth: 0.1, hundredth: 0.01, thousandth: 0.001 }[dec[3]];
    let n = 0, part = 0;
    for (const t of String(w).toLowerCase().replace(/-/g, ' ').split(/\s+/).filter(Boolean)) {
      if (ONES.indexOf(t) >= 0) part += ONES.indexOf(t);
      else if (TENS.indexOf(t) >= 2) part += 10 * TENS.indexOf(t);
      else if (t === 'hundred') part *= 100;
      else if (t === 'thousand') { n += part * 1000; part = 0; }
      else if (t === 'million') { n += part * 1000000; part = 0; }
      else if (t !== 'and') return NaN;
    }
    return n + part;
  }
  /* a number in words, written the Canadian school way: 342 is "three hundred forty-two", 3 000 040 is "three million forty" */
  function toWords(n) {
    if (n >= 1000000) return toWords(Math.floor(n / 1000000)) + ' million' + (n % 1000000 ? ' ' + toWords(n % 1000000) : '');
    if (n >= 1000) return toWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + toWords(n % 1000) : '');
    const h = Math.floor(n / 100), r = n % 100, out = [];
    if (h) out.push(ONES[h] + ' hundred');
    if (r >= 20) out.push(TENS[Math.floor(r / 10)] + (r % 10 ? '-' + ONES[r % 10] : ''));
    else if (r || !h) out.push(ONES[r]);
    return out.join(' ');
  }
  /* is a row of numbers joined by < and > (such as "345 < 354 < 400") true? null when it cannot be read */
  function order(st) {
    const parts = norm(st).split(/([<>])/);
    if (parts.length < 3) return null;
    for (let i = 0; i + 2 < parts.length; i += 2) {
      const a = val(parts[i]), b = val(parts[i + 2]);
      if (isNaN(a) || isNaN(b)) return null;
      if (parts[i + 1] === '<' ? !(a < b) : !(a > b)) return false;
    }
    return true;
  }
  /* is a statement such as "4 × 7 = 7 × 4" or "18 ÷ 2 = 8." true? null when it cannot be read */
  function truth(st) {
    if (!/=/.test(st) && /[<>]/.test(st)) return order(st);
    const sides = norm(st).split('=');
    if (sides.length !== 2) return null;
    const a = val(sides[0]), b = val(sides[1]);
    return isNaN(a) || isNaN(b) ? null : same(a, b);
  }
  /* run robot code such as "move 3, turn right, repeat 2: move 1, turn left" from start [column, row, '>' | 'v' | '<' | '^'];
     "repeat N:" repeats the rest of the code. Returns the square [column, row] where it stops, or null when unreadable */
  function robot(start, code) {
    const D = ['>', 'v', '<', '^'], step = { '>': [1, 0], 'v': [0, 1], '<': [-1, 0], '^': [0, -1] };
    let x = start[0], y = start[1], d = D.indexOf(start[2]);
    const run = list => {
      for (let i = 0; i < list.length; i++) {
        const c = list[i].trim();
        if (!c) continue;
        const rep = c.match(/^repeat (\d+)(?: times)?:\s*(.*)$/), mv = c.match(/^move (\d+)$/);
        if (rep) { const body = [rep[2]].concat(list.slice(i + 1)); for (let k = 0; k < +rep[1]; k++) if (!run(body)) return false; return true; }
        if (mv) { x += step[D[d]][0] * +mv[1]; y += step[D[d]][1] * +mv[1]; }
        else if (c === 'turn right') d = (d + 1) % 4;
        else if (c === 'turn left') d = (d + 3) % 4;
        else return false;
      }
      return true;
    };
    return d < 0 || !run(String(code).split(',')) ? null : [x, y];
  }
  /* 3D objects: flat faces, edges, vertices, curved surfaces, points; prism, pyramid or neither (cones and cylinders are
     described with words, so their edges and vertices are never asked) */
  const SOLID = {
    cube: { f: 6, e: 12, v: 8, c: 0, p: 0, kind: 'prism', sq: 1, sqonly: 1 }, prism: { f: 6, e: 12, v: 8, c: 0, p: 0, kind: 'prism', sq: 0 },
    tri: { f: 5, e: 9, v: 6, c: 0, p: 0, kind: 'prism', sq: 0 }, pyramid: { f: 5, e: 8, v: 5, c: 0, p: 1, kind: 'pyramid', sq: 1 },
    tpyr: { f: 4, e: 6, v: 4, c: 0, p: 1, kind: 'pyramid', sq: 0 }, cylinder: { f: 2, c: 1, p: 0, kind: 'neither', roll: 1 },
    cone: { f: 1, c: 1, p: 1, kind: 'neither', roll: 1 }, sphere: { f: 0, c: 1, p: 0, kind: 'neither', roll: 1 }
  };
  const SOLID_BY = { cube: 'cube', 'rectangular prism': 'prism', 'triangular prism': 'tri', 'square-based pyramid': 'pyramid', 'triangular pyramid': 'tpyr', cylinder: 'cylinder', cone: 'cone', sphere: 'sphere' };
  /* a choice names an object, or is a letter for one of the pictured objects */
  const solidOf = (x, it) => (/^[A-H]$/.test(x) && it.pic ? [].concat(it.pic[1].list || [])[x.charCodeAt(0) - 65] : SOLID_BY[x]);
  const fits = (k, clue) => !!SOLID[k] && Object.keys(clue).every(c => SOLID[k][c] === clue[c]);
  /* directions: a compass turn, and walking on a map with columns A, B, C ... and rows 1, 2, 3 ... from the bottom */
  const DIRS = ['north', 'east', 'south', 'west'];
  const turnBy = t => (/half turn/.test(t) ? 2 : /full turn/.test(t) ? 4 : /quarter turn right/.test(t) ? 1 : /quarter turn left/.test(t) ? 3 : null);
  const facing = (from, moves) => moves.split(',').map(t => t.trim()).filter(Boolean).reduce((d, t) => (d == null || turnBy(t) == null ? null : (d + turnBy(t)) % 4), DIRS.indexOf(from));
  const walkCode = c => String(c).replace(/forward (\d+)/g, 'move $1').replace(/quarter turn (right|left)/g, 'turn $1').replace(/half turn/g, 'turn right, turn right');
  function walk(m, code) {
    const end = robot(m.start, walkCode(code)), steps = (String(code).match(/forward (\d+)/g) || []).reduce((t, f) => t + +f.split(' ')[1], 0);
    const d = facing(DIRS[['^', '>', 'v', '<'].indexOf(m.start[2])], String(code).split(',').filter(t => /turn/.test(t)).join(','));
    return end && { cell: 'ABCDEFGHIJ'[end[0]] + (m.rows - end[1]), steps, dir: DIRS[d], inside: end[0] >= 0 && end[1] >= 0 && end[0] < m.cols && end[1] < m.rows };
  }
  /* lengths: "4 cm 3 mm", "2 m 40 cm" in millimetres; a side may add lengths (4 cm + 5 cm); null when not a length */
  const MM = { mm: 1, cm: 10, m: 1000, km: 1000000 };
  const toMM = s => {
    const terms = String(s).trim().split(' + '), one = t => { const re = /(\d+(?:\.\d+)?) ?(mm|cm|m|km)\b/g; return re.test(t) && !t.replace(re, '').trim() ? [...t.matchAll(re)].reduce((n, q) => n + +q[1] * MM[q[2]], 0) : null; };
    const v = terms.map(one); return v.some(x => x === null) ? null : v.reduce((a, b) => a + b, 0);
  };
  /* the perimeter of squares on a grid: every square edge that does not touch another square */
  const cellPerim = cells => cells.reduce((t, c) => { const [x, y] = c.split(',').map(Number); return t + [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => cells.indexOf((x + dx) + ',' + (y + dy)) < 0).length; }, 0);
  /* an ellipse on a grid: squares more than half covered (by sampling), and squares too close to half to call */
  function blobEstimate(o) {
    let n = 0, unsure = 0;
    for (let c = 0; c < o.cols; c++) for (let r = 0; r < o.rows; r++) {
      let inside = 0;
      for (let i = 0; i < 20; i++) for (let j = 0; j < 20; j++) { const px = c + (i + 0.5) / 20, py = r + (j + 0.5) / 20; if (((px - o.cx) / o.rx) ** 2 + ((py - o.cy) / o.ry) ** 2 <= 1) inside++; }
      const f = inside / 400; if (f > 0.5) n++; if (f > 0.35 && f < 0.65) unsure++;
    }
    return { n, unsure };
  }
  /* the unit for a length (in mm): smaller than a fingernail mm, smaller than a big step cm, smaller than a long walk m, else km */
  const unitFor = mm => (mm < 10 ? 'mm' : mm < 1000 ? 'cm' : mm < 1000000 ? 'm' : 'km');
  /* perimeter or area: words that go around the edge, or cover the inside */
  const AROUND = /fence|border|frame|edge|trim|around|lace|rope|path round/, INSIDE = /carpet|paint|cover|tile|grass|seed|paper|rug|wrap|floor/;
  /* a time on a clock in minutes after 12:00 (a 12-hour clock): "3:25", "4 o'clock", "25 minutes past 4", "quarter past 8",
     "half past 8", "quarter to 9"; null when not a time */
  function clockMin(t) {
    const s = String(t).trim(), h = n => (+n % 12) * 60; let m;
    if ((m = s.match(/^(\d{1,2}):(\d\d)$/)) && +m[2] < 60) return h(m[1]) + +m[2];
    if ((m = s.match(/^(\d{1,2}) o'clock$/))) return h(m[1]);
    if ((m = s.match(/^(\d+) minutes past (\d{1,2})$/))) return h(m[2]) + +m[1];
    if ((m = s.match(/^quarter past (\d{1,2})$/))) return h(m[1]) + 15;
    if ((m = s.match(/^half past (\d{1,2})$/))) return h(m[1]) + 30;
    if ((m = s.match(/^quarter to (\d{1,2})$/))) return (h(m[1]) + 720 - 15) % 720;
    return null;
  }
  /* an amount of time in seconds: "2 hours", "3 minutes 10 seconds", or a timer "2:10" (minutes and seconds); null if not */
  const SEC = { second: 1, minute: 60, hour: 3600, day: 86400 };
  const toSec = t => {
    const s = String(t).trim(), tm = s.match(/^(\d+):(\d\d)$/), re = /(\d+) (second|minute|hour|day)s?\b/g;
    if (tm) return +tm[1] * 60 + +tm[2];
    return re.test(s) && !s.replace(re, '').trim() ? [...s.matchAll(re)].reduce((n, q) => n + +q[1] * SEC[q[2]], 0) : null;
  };
  /* mass, capacity or time: the words that tell which one a question is about */
  const MEASURE = { mass: /heav|weigh|light|balance/, capacity: /hold|fill|pour|cups? of|full/, time: /long does|how long|minutes|seconds|hours|take/ };
  /* data: is a label true of a number ("even", "odd", "more than 15", "less than 10", "multiple of 5", "has a 5") or of an
     attribute block ('cdB': c circle, q square, t triangle; d shaded, w white; B big, s small)? "not ..." turns it round; null if unknown */
  function holds(label, x) {
    const l = String(label).trim(); let m;
    if (/^not /.test(l)) { const t = holds(l.slice(4), x); return t === null ? null : !t; }
    if (typeof x === 'number') {
      if (l === 'even' || l === 'odd') return x % 2 === (l === 'even' ? 0 : 1);
      if ((m = l.match(/^more than (\d+)$/))) return x > +m[1];
      if ((m = l.match(/^less than (\d+)$/))) return x < +m[1];
      if ((m = l.match(/^multiple of (\d+)$/))) return x % +m[1] === 0;
      if ((m = l.match(/^has a (\d)$/))) return String(x).indexOf(m[1]) >= 0;
      return null;
    }
    const b = { circle: [0, 'c'], square: [0, 'q'], triangle: [0, 't'], shaded: [1, 'd'], white: [1, 'w'], big: [2, 'B'], small: [2, 's'] }[l];
    return b ? x[b[0]] === b[1] : null;
  }
  /* where a number goes: Venn parts [a only, both, b only, neither]; Carroll cells [a and b, a only, b only, neither] by row and column */
  const vennPart = (o, x) => (holds(o.a, x) ? (holds(o.b, x) ? 1 : 0) : holds(o.b, x) ? 2 : 3);
  const carrollCell = (o, x) => (holds(o.a, x) ? 0 : 2) + (holds(o.b, x) ? 0 : 1);
  function sorted(o, groups, where, name) {
    const bad = [], all = groups.flat();
    if (all.some(x => holds(o.a, x) === null || holds(o.b, x) === null)) return ['cannot read the labels ' + o.a + ' and ' + o.b];
    groups.forEach((g, i) => g.forEach(x => { if (where(o, x) !== i) bad.push(x + ' is in the wrong part of the ' + name); }));
    if (o.list && o.list.slice().sort().join() !== all.slice().sort().join()) bad.push('the ' + name + ' does not hold exactly the numbers to sort');
    return bad;
  }
  /* the mode(s) of a list: 'none' when nothing repeats, else the values that appear most, joined with "and" */
  function modeOf(v) {
    const c = {}; v.forEach(x => { c[x] = (c[x] || 0) + 1; });
    const top = Math.max(...Object.values(c));
    return top < 2 ? 'none' : Object.keys(c).filter(k => c[k] === top).map(Number).sort((x, y) => x - y).join(' and ');
  }
  const isPrime = n => Number.isInteger(n) && n > 1 && [...Array(Math.floor(Math.sqrt(n)) + 1).keys()].slice(2).every(f => n % f);
  const gcd = (x, y) => (y ? gcd(y, x % y) : x);
  /* quadrilaterals and regular shapes: pairs of parallel sides (par), right angles (right), which sides are equal
     (all, opp: opposite pairs, adj: two pairs side by side, none), lines of symmetry (sym), order of rotational symmetry
     (rot: 1 means it only fits once in a full turn), and the diagonals: equal (deq), at right angles (dperp), cutting
     each other in half (dhalf) */
  const QUAD = {
    square: { par: 2, right: 4, sides: 'all', sym: 4, rot: 4, deq: 1, dperp: 1, dhalf: 1 },
    rectangle: { par: 2, right: 4, sides: 'opp', sym: 2, rot: 2, deq: 1, dperp: 0, dhalf: 1 },
    rhombus: { par: 2, right: 0, sides: 'all', sym: 2, rot: 2, deq: 0, dperp: 1, dhalf: 1 },
    parallelogram: { par: 2, right: 0, sides: 'opp', sym: 0, rot: 2, deq: 0, dperp: 0, dhalf: 1 },
    trapezoid: { par: 1, right: 0, sides: 'none', sym: 0, rot: 1, deq: 0, dperp: 0, dhalf: 0 },
    'isosceles trapezoid': { par: 1, right: 0, sides: 'legs', sym: 1, rot: 1, deq: 1, dperp: 0, dhalf: 0 },
    kite: { par: 0, right: 0, sides: 'adj', sym: 1, rot: 1, deq: 0, dperp: 1, dhalf: 0 },
    'equilateral triangle': { sym: 3, rot: 3 }, 'regular pentagon': { sym: 5, rot: 5 }, 'regular hexagon': { sym: 6, rot: 6 }, 'regular octagon': { sym: 8, rot: 8 }
  };
  /* is every one of the first kind also the second kind? (by what the second kind needs) */
  const ISA = { parallelogram: q => q.par === 2, rectangle: q => q.par === 2 && q.right === 4, rhombus: q => q.sides === 'all', square: q => q.sides === 'all' && q.right === 4, kite: q => q.sides === 'adj' || q.sides === 'all' };
  /* data that is counted (discrete) or measured (continuous), from the words of the question */
  const WORDS = /\b(favourite|colour|kind of|type of|name of|language)\b/i, COUNTED = /\b(number of|how many)\b/i, MEASURED = /\b(height|length|mass|time|temperature|distance|how long|how tall|how heavy|how far|weight|how much water|how fast)\b/i;
  /* chance words: compare the count of one colour (k) with all of them (n) */
  const chanceWord = (k, n) => (k === 0 ? 'impossible' : k === n ? 'certain' : 2 * k < n ? 'unlikely' : 2 * k === n ? 'equally likely' : 'likely');
  /* kinds of data: a survey question with number answers starts "How many", "How far" ...; the way data is collected */
  const QUANT = /^how (many|much|far|long|tall|old|heavy|fast|high)\b/i;
  const COLLECT = { interview: /\bask/, observation: /\bwatch|\blook at|\bcount the .* (pass|go by|in the)/, experiment: /\btest|\btry|\bdrop|\broll|\btoss|\bflip|\bbounce/ };
  /* mean or mode: the words that ask for one */
  const STAT = { mean: /fair|share|even(ly| out)|level|same number/, mode: /most (common|often|popular)|appears most|shows up most/ };
  /* how many right angles a shape's corners make: at each corner the two sides meet square on */
  const rights = sh => sh.filter((p, i) => { const a = sh[(i + sh.length - 1) % sh.length], b = sh[(i + 1) % sh.length]; return (a[0] - p[0]) * (b[0] - p[0]) + (a[1] - p[1]) * (b[1] - p[1]) === 0; }).length;
  /* the shape names a repeating pattern uses */
  const SHAPES = { c: 'circle', s: 'square', t: 'triangle', d: 'diamond', C: 'circle', S: 'square' };
  /* What each picture shows, by its name: { total, pair, counts, share } for the "picture matches the sum" check, and
     own(o, answers) for a picture with its own write-on lines (it takes the first answers): a list of problems.
     Picture files add their own readers here (sheet-pics.js below; sheet-pics-upper.js after it). */
  const dataOf = o => Object.fromEntries(o.cats.map((c, i) => [c, o.vals[i]]));
  const READ = {
    groups: o => { const c = o.counts || Array(o.g).fill(o.k); return { total: c.reduce((x, y) => x + y, 0), pair: o.counts ? null : [o.g, o.k], counts: c }; },
    array: o => ({ total: o.r * o.c, pair: [o.r, o.c] }),
    line: o => (o.n ? { total: o.n * o.step, pair: [o.n, o.step] } : null),
    share: o => ({ total: o.t, share: o.g }),
    dots: o => ({ total: o.t }),
    /* a table's blanks: every filled row keeps the same "for every 1" amount */
    /* a table's blanks: every filled row keeps the same "for every 1" amount; diff: the second column grows by the same
       amount each row (a growing pattern); rule: '+ 3' or '× 2', the second column is the first with the rule applied */
    table: o => ({ blanks: o.rows.flat().filter(x => x === '[]').length, own: (o, a) => {
      const bad = []; let rate = null;
      const rows = o.rows.map(r => r.map(x => (x === '[]' ? a.shift() : x)));
      if (rows.some(v => v.some(x => typeof x !== 'number'))) return ['a table blank has no answer'];
      rows.forEach((v, i) => {
        if (o.rule) { const w = val(norm(v[0] + ' ' + o.rule)); if (w !== v[1]) bad.push('table row ' + v.join(' and ') + ': ' + v[0] + ' ' + o.rule + ' is ' + w); }
        else if (o.diff) { if (i > 1 && v[1] - rows[i - 1][1] !== rows[1][1] - rows[0][1]) bad.push('table row ' + v.join(' and ') + ' does not grow by the same amount'); }
        else { const k = v[1] / v[0]; if (rate === null) rate = k; else if (k !== rate) bad.push('table row ' + v.join(' and ') + ' does not keep ' + rate + ' for every 1'); }
      });
      return bad;
    } }),
    /* a repeating row of shapes: the shapes on the key continue the core, and the boxed core is the part that repeats */
    pat: o => {
      const s = o.seq, per = [...Array(s.length).keys()].map(p => p + 1).find(p => p < s.length && [...s].every((c, i) => c === s[i % p]));
      return { own: () => {
        const bad = [];
        if (o.core && o.core !== per) bad.push('the boxed core is ' + o.core + ' long, but the pattern repeats every ' + per);
        if (o.next) { if (!per) bad.push('the pattern ' + s + ' does not repeat'); else [...o.next].forEach((c, i) => { if (c !== s[(s.length + i) % per]) bad.push('shape ' + (i + 1) + ' to draw is ' + c + ', not ' + s[(s.length + i) % per]); }); }
        if (o.blanks && (!o.next || o.next.length !== o.blanks)) bad.push('the key does not draw every missing shape');
        return bad;
      }, blanks: 0 };
    },
    /* sheet-pics.js */
    blocks: o => ({ total: 100 * o.h + 10 * o.t + o.o }),
    tenframe: o => ({ total: o.a + o.b }),
    coins: o => ({ total: o.list.reduce((x, y) => x + y, 0) }),
    area: o => ({ total: o.rect ? o.rect[0] * o.rect[1] : o.cells.length, area: o.rect ? o.rect[0] * o.rect[1] : o.cells.length, perim: o.rect ? 2 * (o.rect[0] + o.rect[1]) : cellPerim(o.cells) }),
    rect: o => ({ perim: 2 * (o.a + o.b), area: o.a * o.b }),
    poly: o => (o.sides.indexOf('?') < 0 ? { perim: o.sides.reduce((x, y) => x + y, 0) } : { known: o.sides.filter(v => v !== '?').reduce((x, y) => x + y, 0) }),
    ruler: o => ({ len: o.len * 10 }),
    clock: o => Object.assign({ time: (o.h % 12) * 60 + o.m }, o.blank ? { blanks: 0, own: () => [] } : {}),
    balance: o => { const n = typeof o.l === 'number' ? o.l : typeof o.r === 'number' ? o.r : null;
      return { heavy: o.tilt === 1 ? o.r : o.tilt === -1 ? o.l : null, total: o.tilt === 0 && n !== null ? n : undefined }; },
    units: o => ({ total: o.n, pair: [o.n, o.unit ? parseFloat(o.unit) : null] }),
    blob: o => ({ total: blobEstimate(o).n, own: o => (blobEstimate(o).unsure ? [blobEstimate(o).unsure + ' squares of the curved shape are too close to half to call'] : []), blanks: 0 }),
    wholes: o => ({ total: o.n }),
    cups: o => ({ total: o.n }),
    col: o => { const res = String(o.op === '+' ? o.a + o.b : o.a - o.b); return { blanks: res.length, own: (o, a) => (a.join('') === res ? [] : ['the column answer ' + a.join('') + ' is not ' + res]) }; },
    tally: o => Object.assign({ data: o.vals, byCat: dataOf(o) }, o.blank ? { blanks: o.cats.length, own: (o, a) => (a.join() === o.vals.join() ? [] : ['the tally counts ' + a.join() + ' do not match the tallies ' + o.vals.join()]) } : {}),
    bar: o => Object.assign({ data: o.vals.filter(v => v != null), byCat: dataOf(o), step: o.step, parts: { title: !!o.title, ylab: !!o.ylab, src: !!o.src } }, o.hide ? { blanks: 0, own: () => [] } : {}),
    /* every value is a whole or half number of pictures */
    picto: o => ({ byCat: dataOf(o), parts: { title: !!o.title }, blanks: 0, own: o => o.vals.filter(v => (2 * v) % o.key !== 0).map(v => v + ' is not a whole or half number of pictures of ' + o.key) }),
    venn: o => (o.parts ? { list: o.parts.flat(), blanks: 0, own: o => sorted(o, o.parts, vennPart, 'Venn diagram') } : null),
    carroll: o => (o.cells ? { list: o.cells.flat(), blanks: 0, own: o => sorted(o, o.cells, carrollCell, 'Carroll diagram') } : null),
    tray: o => ({ list: o.list }),
    /* the leaves of a tree diagram, left to right: first sort, then second sort */
    tree: o => ({ list: o.tray, blanks: o.blank ? 4 : 0, own: o.blank ? (o, a) => { const want = o.by[0].flatMap(x => o.by[1].map(y => o.tray.filter(b => holds(x, b) && holds(y, b)).length)); return a.join() === want.join() ? [] : ['the tree leaves are ' + want.join(', ') + ', not ' + a.join(', ')]; } : null }),
    plot: o => ({ list: o.v }),
    towers: o => ({ list: o.v }),
    bag: o => ({ chance: o.c }),
    spinner: o => ({ chance: o.parts.reduce((c, x) => Object.assign(c, { [x]: (c[x] || 0) + 1 }), {}) }),
    nl: o => ({ total: o.pt != null ? o.pt : undefined, blanks: (o.ask || []).length, own: (o.ask || []).length ? (o, a) => (a.join() === o.ask.join() ? [] : ['the number line answers ' + a.join() + ' are not ' + o.ask.join()]) : null }),
    pv: o => ({ total: o.n, blanks: o.blank ? Math.max(3, String(o.n).length) : 0, own: o.blank ? (o, a) => (+a.join('') === o.n ? [] : ['the chart digits ' + a.join('') + ' are not ' + o.n]) : null }),
    /* sheet-pics-upper.js */
    amodel: o => {
      const parts = n => String(n).split('').map((d, i, all) => +d * Math.pow(10, all.length - 1 - i)).filter(Boolean);
      const want = [].concat(...parts(o.a).map(x => parts(o.b).map(y => [x, y])));
      return Object.assign({ total: o.a * o.b, pair: [o.a, o.b] }, o.fill ? {} : { blanks: want.length, own: (o, a) => want.flatMap(([x, y], i) => (a[i] === x * y ? [] : ['area model part ' + x + ' × ' + y + ' should be ' + x * y + ', not ' + a[i]])) });
    },
    mult: o => {
      const bd = String(o.b).split('').reverse(), want = (bd.length > 1 ? bd.map((d, i) => o.a * +d * Math.pow(10, i)) : []).concat([o.a * o.b]);
      return { total: o.a * o.b, pair: [o.a, o.b], blanks: want.length, own: (o, a) => want.flatMap((v, i) => (a[i] === v ? [] : ['written method line for ' + o.a + ' × ' + o.b + ' should be ' + v + ', not ' + a[i]])) };
    },
    shareR: o => ({ total: o.t, share: o.g }),
    /* the chunks must add up to the total, so the picture "shows" what they add up to */
    chunks: o => ({ total: o.steps.reduce((x, y) => x + y, 0) * o.d }),
    pvmove: o => (o.shift ? { total: o.n } : null),
    dline: o => ((o.ask || []).length ? { blanks: o.ask.length, own: (o, a) => o.ask.flatMap((v, i) => (same(num(a[i]), v) ? [] : ['the number line answer ' + a[i] + ' is not ' + v])) } : o.pt != null ? { total: o.pt } : null),
    /* fraction bars: one row (or rows that all show the same amount) shows that fraction, by its own name */
    frac: o => (o.uneven ? null : { total: o.k / o.n, name: o.k + '/' + o.n }),
    fbars: o => { const v = o.rows.map(r => r[1] / r[0]); return v.every(x => same(x, v[0])) ? { total: v[0], name: o.rows.length === 1 ? o.rows[0][1] + '/' + o.rows[0][0] : null } : null; },
    /* a ratio picture: how many of each kind in all */
    grow: o => ({ m: o.m, b: o.b }),
    /* graphs give their numbers (data) for stories and statistics; a spinner gives its parts for probability */
    dbar: o => ({ data: [].concat(...o.sets).filter(v => v != null), sets: o.sets, min: o.min || 0 }),
    lineg: o => ({ data: o.vals, min: o.min || 0 }),
    spin: o => ({ parts: o.parts }),
    stem: o => ({ data: o.data }),
    /* a scale or a jug shows its amount; left blank, the child draws the amount the question names (the key shows it) */
    dial: o => (o.blank ? { blanks: 0, own: () => [], draw: o.g } : { total: o.g }),
    jug: o => (o.blank ? { blanks: 0, own: () => [], draw: o.mL } : { total: o.mL }),
    /* a triangle: its angles (worked out from its sides when it is drawn from sides) and its kinds */
    tri: o => {
      const r = Math.PI / 180, sd = o.sides, ang = o.angles || [0, 1, 2].map(i => Math.acos((sd[(i + 1) % 3] ** 2 + sd[(i + 2) % 3] ** 2 - sd[i] ** 2) / (2 * sd[(i + 1) % 3] * sd[(i + 2) % 3])) / r);
      const len = sd || ang.map(g => Math.sin(g * r)), eq = new Set(len.map(v => Math.round(v * 1e6))).size, big = Math.max(...ang);
      return { angles: ang, ask: o.ask, kinds: { sides: eq === 1 ? 'equilateral' : eq === 2 ? 'isosceles' : 'scalene', angles: Math.abs(big - 90) < 1e-6 ? 'right' : big > 90 ? 'obtuse' : 'acute' } };
    },
    /* a top view of stacks: the front view is the tallest in each column; the right side view, front to back, the
       tallest in each row from the bottom row up */
    heights: o => ({ total: o.g.flat().reduce((x, y) => x + y, 0), views: { front: o.g[0].map((_, c) => Math.max(...o.g.map(r => r[c]))), side: o.g.map(r => Math.max(...r)).reverse() } }),
    /* a coordinate grid: its labelled points; points to plot are drawn on the key, so they need no answer */
    coord: o => Object.assign({ pts: Object.fromEntries((o.pts || []).map(q => [q[2], [q[0], q[1]]])) }, o.plot || o.keyShape ? { blanks: 0, own: () => [] } : {}),
    code: () => null,
    /* an angle: its size; a flat shape: its area (or its perimeter, with ask), its base and height for a times sum, and
       its perimeter when its sides are known (a rectangle, or a parallelogram with its slanted side); a triangle's
       story sum may halve, so 2 counts as one of its numbers */
    angle: o => ({ total: o.deg, deg: o.deg }),
    /* two crossing lines: the four angles in turn are deg, 180 − deg, deg, 180 − deg, each under its label */
    cross: o => ({ cross: Object.fromEntries((o.labs || []).map((l, i) => [l, i % 2 ? 180 - o.deg : o.deg])), blanks: 0, own: () => [] }),
    plane: o => {
      const area = o.kind === 'tri' || o.kind === 'rhom' || o.kind === 'kite' ? o.b * o.h / 2 : o.kind === 'trap' ? (o.b + o.t) * o.h / 2 : o.b * o.h, perim = o.kind === 'rect' ? 2 * (o.b + o.h) : o.kind === 'para' && o.s ? 2 * (o.b + o.s) : null;
      const half = ['tri', 'trap', 'rhom', 'kite'].indexOf(o.kind) >= 0;
      return { total: o.ask === 'perim' ? perim : area, perim: perim, pair: half || o.kind === 'trap' ? null : [o.b, o.h], data: [o.b, o.h].concat(o.s ? [o.s] : [], o.t ? [o.t] : [], half ? [2] : []) };
    },
    /* a factor tree: each row's two numbers multiply to the number above, the circled ones are prime, and the last
       number left is prime too */
    ftree: o => (o.blank ? { blanks: 2 * (o.primes.length - 1), own: (o, a) => {
      const bad = []; let top = o.n;
      for (let i = 0; i + 1 < a.length; i += 2) {
        if (!isPrime(a[i])) bad.push('the factor tree circles ' + a[i] + ', which is not prime');
        if (a[i] * a[i + 1] !== top) bad.push('in the factor tree ' + a[i] + ' × ' + a[i + 1] + ' is not ' + top);
        top = a[i + 1];
      }
      if (!isPrime(top)) bad.push('the factor tree ends at ' + top + ', which is not prime');
      return bad;
    } } : { total: o.n, own: () => (o.primes.reduce((x, y) => x * y, 1) === o.n && o.primes.every(isPrime) ? [] : ['the factor tree of ' + o.n + ' is not split into primes']), blanks: 0 }),
    /* a net: its surface area, every face added */
    net: o => ({ total: o.kind === 'box' ? 2 * (o.l * o.w + o.l * o.h + o.w * o.h) : o.kind === 'tprism' ? o.b * o.th + (o.b + 2 * o.s) * o.l : o.b * o.b + 2 * o.b * o.sh, data: [o.l, o.w, o.h, o.b, o.th, o.s, o.sh].filter(v => v != null).concat([2, 4]) }),
    mix: o => ({ parts: [o.a * (o.g || 1), o.b * (o.g || 1)] }),
    disks: o => ({ total: o.list ? o.list.reduce((x, r) => x + r[0] * r[1], 0) : o.n }),
    grid: o => (o.unit && o.n ? { total: o.n * num(o.unit) } : null),
    row: o => { const parts = o.list.map(p => (READ[p[0]] ? READ[p[0]](p[1]) : null) || {}); const n = parts.reduce((x, p) => x + (p.blanks || 0), 0);
      return n ? { blanks: n, own: (o, a) => o.list.flatMap((p, i) => (parts[i].own ? parts[i].own(p[1], a.splice(0, parts[i].blanks)) : [])) } : null; }
  };
  /* one example of every picture, drawn by tests/run.js in a question's column (228 points) with and without the key;
     a picture file that adds a picture adds its example here too */
  window.__picSamples = {
    groups: [{ g: 3, k: 4 }], array: [{ r: 3, c: 5 }], dots: [{ t: 12 }], line: [{ n: 3, step: 5, max: 20 }], share: [{ t: 12, g: 3 }],
    table: [{ head: ['{conts}', '{many}'], rows: [[1, 5], [2, '[]']] }, [10]],
    blocks: [{ h: 3, t: 4, o: 5 }], pv: [{ n: 307, blank: true }, [3, 0, 7]], tenframe: [{ a: 8, b: 5 }], col: [{ a: 368, b: 254, op: '+' }, [6, 2, 2]], frac: [{ n: 4, k: 3, shape: 'circle' }],
    wholes: [{ n: 5 }], pat: [{ seq: 'cstcst', blanks: 2, next: 'cs', core: 3 }], clock: [{ h: 3, m: 40, blank: true }],
    coins: [{ list: [500, 200, 100, 25, 10, 5] }], tag: [{ t: 'Juice box', p: 135 }], bar: [{ cats: ['A', 'B', 'C', 'D'], vals: [4, 7, 2, 5], max: 8, step: 2, title: 'Votes', ylab: 'Votes', src: 'Room 4', hide: [1] }],
    tally: [{ cats: ['{many}', 'balls'], vals: [7, 12], blank: true }, [7, 12]], solids: [{ list: ['cube', 'tpyr', 'pyramid', 'cylinder'], letters: true }],
    area: [{ cols: 8, rows: 4, rect: [5, 3] }], rect: [{ a: 6, b: 3, unit: 'cm', all: true }], ruler: [{ len: 7, from: 0 }],
    balance: [{ l: 6, r: '{one}', tilt: 0 }], cups: [{ n: 6 }], nl: [{ min: 300, max: 400, tick: 10, lab: 50, pt: 370, ask: [330] }, [330]],
    map: [{ cols: 7, rows: 4, grid: true, marks: [[1, 1, 'A'], [5, 2, 'B']], start: [0, 3, '>'], path: [[0, 3], [3, 3], [3, 1]] }], venn: [{ a: 'even', b: 'more than 15', parts: [[6, 12], [18, 24], [17], [9, 3]], list: [6, 18, 9, 24, 3, 12, 17], blank: true }],
    carroll: [{ a: 'even', b: 'more than 10', cells: [[12, 20], [4], [15], [7, 9]] }], tray: [{ list: ['cdB', 'qws', 'tdB', 'cws'] }],
    tree: [{ tray: ['cdB', 'qws', 'cds', 'cws', 'qdB'], by: [['circle', 'square'], ['shaded', 'white']], blank: true }, [2, 1, 1, 1]],
    picto: [{ title: 'Favourite fruit', cats: ['Apple', 'Pear'], vals: [7, 4], key: 2 }], plot: [{ lo: 2, hi: 9, v: [3, 5, 8, 5, 3, 6] }],
    towers: [{ v: [2, 8, 5], line: 5 }], bag: [{ c: { red: 2, blue: 6 } }], spinner: [{ parts: ['red', 'blue', 'blue', 'blue'] }],
    poly: [{ sides: [4, 5, '?'] }], blob: [{ cols: 8, rows: 5, cx: 4, cy: 2.5, rx: 3.2, ry: 2.1 }], units: [{ n: 6, unit: '4 cm' }],
    stack: [{ list: ['tri', 'cube'] }], box: [{ l: 4, d: 2, h: 3 }], compass: [{ face: 'east' }],
    row: [{ list: [['frac', { n: 2, k: 1 }], ['frac', { n: 4, k: 2 }]], labels: ['A', 'B'] }],
    amodel: [{ a: 246, b: 3 }, [600, 120, 18]], mult: [{ a: 47, b: 26 }, [282, 940, 1222]], shareR: [{ t: 14, g: 4 }],
    chunks: [{ t: 372, d: 12, steps: [30, 1] }], pvmove: [{ n: 3.45, shift: 2, dir: 'x' }], disks: [{ list: [[10000, 2], [1000, 3], [100, 13], [1, 4]] }],
    fbars: [{ rows: [[4, 3], [8, 6]], labels: ['3/4', '6/8'] }], dline: [{ min: 0, max: 1, d: 10, show: 'dec', pt: 0.7, ask: [0.4] }, ['0.4']],
    hill: [{ lo: 48000, hi: 49000, n: 48650 }], mix: [{ a: 2, b: 3, g: 4 }], grow: [{ m: 2, b: 1, k: 3 }], dbar: [{ cats: ['Mon', 'Tue', 'Wed'], sets: [[4, 6, 3], [5, 2, 7]], keys: ['A', 'B'], max: 8, step: 2 }], lineg: [{ cats: ['Jan', 'Feb', 'Mar'], vals: [3, 5, 4], max: 6, step: 2 }], spin: [{ parts: ['R', 'R', 'B', 'G'] }], stem: [{ data: [23, 31, 35, 38, 42, 47, 47, 56] }], dial: [{ g: 650, max: 1000, lab: 200, tick: 50 }], jug: [{ mL: 750, max: 1000, lab: 200, tick: 50 }], tri: [{ sides: [5, 5, 8], show: 'sides', marks: true }], heights: [{ g: [[2, 1], [1, 0]] }], coord: [{ n: 8, pts: [[2, 3, 'A']], plot: [[5, 1, 'B']] }], angle: [{ deg: 120, prot: true }], plane: [{ kind: 'para', b: 9, h: 4, s: 5, unit: 'cm' }], code: [{ lines: ['set total to 5', 'repeat 3 times', '  add 4 to total'] }], grid: [{ n: 37, unit: '1000' }],
    ftree: [{ n: 60, primes: [2, 2, 3, 5], blank: true }, [2, 30, 2, 15, 3, 5]], net: [{ kind: 'box', l: 6, w: 3, h: 4 }], cross: [{ deg: 65, labs: ['65°', 'a', 'b', 'c'] }]
  };
  const o2 = pk => pk.opts[pk.ans];
  function picture(p) { return READ[p[0]] ? READ[p[0]](p[1]) : null; }
  /* it.look: { op: 'value' | 'total' | 'more', a: [categories], b: [categories], at }: the sum of a (or of everything for a
     total), or a take away b. at: which picture of a row. null when a category is not in the data */
  function dataVal(it) {
    const p = it.look.at != null ? it.pic[1].list[it.look.at] : it.pic, d = (picture(p) || {}).byCat;
    if (!d) return null;
    const sum = l => (l.some(c => d[c] === undefined) ? NaN : l.reduce((t, c) => t + d[c], 0)), a = sum(it.look.a || Object.keys(d));
    const v = it.look.op === 'more' ? a - sum(it.look.b) : a;
    return isNaN(v) ? null : v;
  }


  window.__sheetCheck = function (it) {
    const bad = [], a = (it.a || []).slice();
    const say = m => bad.push(m);
    /* 1. a picture with its own write-on lines takes the first answers, and checks them itself */
    const pc = it.pic && picture(it.pic);
    if (pc && pc.own) {
      const mine = a.splice(0, pc.blanks);
      if (mine.length < pc.blanks) say('a blank in the picture has no answer');
      else pc.own(it.pic[1], mine).forEach(say);
    }
    /* 2. fill every box and work each sum out */
    const filled = (it.eq || []).map(row => row.split(' ').map(t => {
      if (!/\[\]/.test(t)) return t;
      if (!a.length) { say('a box has no answer: ' + row); return '?'; }
      return t.replace('[]', a.shift());
    }).join(' '));
    if (a.length) say(a.length + ' answer(s) left over with no box');
    /* the marbles or spinner parts: from the picture, or it.chances when the question says them ("5 red and 1 blue") */
    const chances = (pc && pc.chance) || it.chances;
    if (it.chances) Object.keys(it.chances).forEach(c => { if (!new RegExp('\\b' + it.chances[c] + ' ' + c + '\\b').test(it.q)) say('the question does not say ' + it.chances[c] + ' ' + c); });
    const raw = it.eq || [], ansAll = (it.a || []).slice(pc && pc.own ? pc.blanks : 0);
    /* rows whose answer is checked from the item itself further down (a digit's value, the biggest or smallest number from
       some digits, a remainder story) */
    const byItem = !!((pc && pc.cross) || it.bins || it.pf || it.factors || it.lcm || it.quad || it.two || it.outcomes || it.fewest || it.corners || it.dv || it.big || it.small || it.rem || it.fig || it.rule || it.expr || it.solve || it.ineq || it.stat || it.rel != null || it.prob || it.looks || (pc && pc.ask != null));
    filled.forEach((row, ri) => {
      const blanks = /\[\]/.test(raw[ri]);
      /* a row that names the categories of a graph or table ("Summer − Spring = 6", "in all = 30"): put their values in (not a "Red: 9/20" label) */
      if (pc && pc.byCat && !it.look && !/:/.test(row)) {
        const d = pc.byCat, re = new RegExp('\\b(' + Object.keys(d).sort((x, y) => y.length - x.length).join('|') + '|in all)\\b', 'g');
        if (re.test(row)) row = row.replace(re, m => (m === 'in all' ? '(' + Object.values(d).join(' + ') + ')' : d[m]));
      }
      let worth;
      let est;
      let st;
      /* a row with a letter for a number (3n + 2 = [], n = []) is checked by its item's expr, solve, ineq or rule below */
      if ((it.expr || it.solve || it.ineq || it.rule || it.ident) && /(^|[\d\s(])[a-z]\b/.test(row)) return;
      /* a spinner's rows (P(R) = [], R: about []), and rows about intervals, factors, shapes and two events, are checked by the item below */
      if ((pc && pc.cross) || it.bins || it.prob || it.pt || it.move || it.view || it.two || it.outcomes || it.quad || it.factors || it.lcm) return;
      /* times of day (clock: 9:45 a.m. + 15 min = 10:00 a.m.) become minutes after midnight, so the row is checked as a sum
         of minutes; a time on its own is the time the clock picture shows */
      if (it.clock) {
        const one = row.trim().match(/^(\d{1,2}) ?: ?(\d{2})$/);
        if (one && pc && pc.time != null) { if ((+one[1] % 12) * 60 + +one[2] !== pc.time % 720) say('the clock shows ' + Math.floor(pc.time / 60) + ':' + pc.time % 60 + ', not ' + row); return; }
        row = row.replace(/(\d{1,2}) ?: ?(\d{2})(?: ?([ap])\.m\.)?/g, (m, h, mm, ap) => ((+h % 12) + (ap === 'p' ? 12 : 0)) * 60 + +mm + ' min');
      }
      const rat = row.match(/\d+ ?: ?\d+/g);
      if (it.robot && it.robot.to) {
        /* code with blanks filled in, one line per row: it must take the robot from the start to the square marked "to" */
        if (ri) return;
        row = filled.join(', ');
        const m = it.pic[1], end = robot(m.start, row), mark = (m.marks || []).find(k => k[2] === it.robot.to);
        if (!end) say('cannot read the code: ' + row);
        else if (!mark || end[0] !== mark[0] || end[1] !== mark[1]) say('the code ' + row + ' stops at ' + end.join(',') + ', not at ' + it.robot.to);
      } else if (it.cnt && /^\d+( [a-z]+)?$/.test(row)) {
        /* how many of the things sorted fit every label */
        const list = it.cnt.of || pc.list, n = +row.split(' ')[0];
        if (list.some(x => it.cnt.is.some(l => holds(l, x) === null))) say('cannot read the labels ' + it.cnt.is.join(', '));
        else if (list.filter(x => it.cnt.is.every(l => holds(l, x))).length !== n) say(list.filter(x => it.cnt.is.every(l => holds(l, x))).length + ' are ' + it.cnt.is.join(' and ') + ', not ' + n);
      } else if (it.look && /^\d+( [a-z]+)?$/.test(row)) {
        /* a value read from a graph or table, a total, or how many more */
        const want = dataVal(it), n = +row.split(' ')[0];
        if (want === null) say('cannot read the data for ' + JSON.stringify(it.look)); else if (want !== n) say('the data give ' + want + ', not ' + n);
      } else if (it.vals && (st = row.match(/^(.*?) ?(mean|mode|modes)( =|:) (.+)$/))) {
        /* the mean (a fair share: the total shared equally) or the mode (the value that appears most) */
        const v = st[1] ? (it.vals.g || {})[st[1]] : it.vals.v || pc.list;
        if (!v) say('no data for ' + row);
        else {
          const want = st[2] === 'mean' ? v.reduce((x, y) => x + y, 0) / v.length : modeOf(v);
          if (String(want) !== st[4].trim()) say('the ' + st[2] + ' of ' + v.join(', ') + ' is ' + want + ', not ' + st[4]);
        }
      } else if (it.predict && (st = row.match(/^about (\d+)/))) {
        /* a fair prediction: the share of the spins or picks that this colour is of the whole */
        const c = chances, n = Object.values(c).reduce((x, y) => x + y, 0), want = it.predict.n * (c[it.predict.of] || 0) / n;
        if (want !== +st[1]) say('in ' + it.predict.n + ' tries, expect about ' + want + ' ' + it.predict.of + ', not ' + st[1]);
      } else if (it.solid && /^\d+ [a-z ]+$/.test(row)) {
        /* "[] flat faces", "[] edges" ...: the objects' own counts, added up for a structure */
        const what = row.replace(/^\d+ /, '').replace(/^flat /, '')[0], all = [].concat(it.solid), n = +row.split(' ')[0];
        const want = what === 'o' ? all.length : all.reduce((t, k) => t + (SOLID[k] ? SOLID[k][what] : NaN), 0);
        if (want !== n) say(all.join(' and ') + ': ' + row.replace(/^\d+ /, '') + ' is ' + want + ', not ' + n);
      } else if (it.walk || it.turn || it.turnTo) {
        /* a walk on the map (where you end, how far, which way you face) or a turn on the compass */
        const w = it.walk && walk(it.pic[1], it.walk === true ? filled.join(', ') : it.walk), v = row.replace(/^(facing|at) /, '');
        if (it.walk === true) { if (ri) return; if (!w || !w.inside || w.cell !== it.to) say('the directions ' + filled.join(', ') + ' end at ' + (w && w.cell) + ', not ' + it.to); return; }
        if (it.walk && !w) say('cannot read the walk: ' + it.walk);
        else if (/^[A-J]\d+$/.test(v)) { if (v !== w.cell || !w.inside) say('the walk ends at ' + w.cell + ', not ' + v); }
        else if (/^\d+ squares?$/.test(v)) { if (+v.split(' ')[0] !== w.steps) say('the walk is ' + w.steps + ' squares, not ' + v); }
        else if (/^\d+ quarter turns?$/.test(v)) {
          const k = [1, 2, 3, 4].find(n => (DIRS.indexOf(it.turnTo.from) + n * (it.turnTo.dir === 'left' ? 3 : 1)) % 4 === DIRS.indexOf(it.turnTo.to));
          if (k !== +v.split(' ')[0]) say('from ' + it.turnTo.from + ' to ' + it.turnTo.to + ' is ' + k + ' quarter turns ' + it.turnTo.dir + ', not ' + v);
        } else if (DIRS.indexOf(v) >= 0) {
          const want = w ? w.dir : DIRS[facing(it.turn.from, it.turn.moves)];
          if (v !== want) say('you face ' + want + ', not ' + v);
        } else say('nothing checks this row: ' + raw[ri]);
      } else if (pc && pc.time != null && clockMin(row) !== null) {
        /* a time read from the clock, in any of the ways we say it */
        if (clockMin(row) !== pc.time) say('the clock shows ' + Math.floor(pc.time / 60 || 12) + ':' + String(pc.time % 60).padStart(2, '0') + ', not ' + row);
      } else if (row.split(' = ').length === 2 && row.split(' = ').every(x => clockMin(x) !== null)) {
        /* a time said two ways: "quarter to 3 = 2:45" */
        const [x, y] = row.split(' = ').map(clockMin);
        if (x !== y) say('not the same time: ' + row);
      } else if (it.span && /^\d+ minutes$/.test(row)) {
        /* how long from one time to another (counting on, not subtracting like plain numbers) */
        const want = (clockMin(it.span[1]) - clockMin(it.span[0]) + 720) % 720;
        if (want !== +row.split(' ')[0]) say('from ' + it.span.join(' to ') + ' is ' + want + ' minutes, not ' + row);
      } else if (/ = /.test(row) && row.split(' = ').length === 2 && toSec(row.split(' = ')[0]) !== null && toSec(row.split(' = ')[1]) !== null) {
        /* amounts of time: "2 hours = 120 minutes", "2:10 = 130 seconds" */
        const [a, b] = row.split(' = ').map(toSec);
        if (a !== b) say('not true: ' + row);
      } else if (it.find && pc && /^\d+( [a-z²]+)+$/.test(row)) {
        /* perimeter (around), area (inside) or the missing side of a shape with a known perimeter */
        const want = it.find === 'side' ? it.perimTo - pc.known : pc[it.find], n = +row.split(' ')[0];
        if (want !== n) say('the ' + it.find + ' is ' + want + ', not ' + n);
      } else if (!it.cong && !/[×÷+−²]/.test(row) && /\d ?(mm|cm|m|km)\b/.test(row) && / [<>=] /.test(row)) {
        /* lengths in units: "2 m 40 cm = 240 cm", "5 cm > 45 mm" (square units are worked out like any sum) */
        const m = row.replace(/(\d)[\u00a0 ](?=\d{3}\b)/g, '$1').split(/ ([<>=]) /), a = toMM(m[0]), b = toMM(m[2]);
        if (m.length !== 3 || a === null || b === null) say('cannot read the lengths: ' + row);
        else if (!(m[1] === '=' ? a === b : m[1] === '<' ? a < b : a > b)) say('not true: ' + row);
      } else if ((it.len != null || (pc && pc.len != null)) && toMM(row) !== null) {
        /* a measured length, in any units */
        const want = it.len != null ? it.len : pc.len;
        if (toMM(row) !== want) say('the length is ' + want + ' mm, not ' + row);
      } else if (it.cong) {
        /* congruent: checked below, from the lengths */
      } else if (/≠/.test(row)) {
        const sides = norm(row).split('≠').map(val);
        if (sides.some(isNaN)) say('cannot read: ' + row); else if (sides[0] === sides[1]) say('both sides are ' + sides[0] + ': ' + row);
      } else if (rat) {
        /* ratios: every ratio in the row names the same comparison (3 : 5 = 6 : 10, because 3 × 10 = 5 × 6); a ratio on
           its own is the one the item asks for: of names its two terms from the picture's or the story's parts (a, b or all) */
        const r = rat.map(x => x.split(':').map(Number));
        if (r.some(([p, q]) => r[0][0] * q !== r[0][1] * p)) say('the ratios are not equivalent: ' + row);
        const parts = (pc && pc.parts) || it.parts;
        if (it.of && parts) {
          const t = { a: parts[0], b: parts[1], all: parts[0] + parts[1] }, want = it.of.map(k => t[k]);
          if (r[0][0] !== want[0] || r[0][1] !== want[1]) say('the ratio asked for is ' + want.join(':') + ', not ' + r[0].join(':'));
        } else if (r.length < 2) say('nothing checks the ratio ' + row);
        if (it.parts) it.parts.forEach(n => { if (nums(it.q).indexOf(n) < 0) say('the story part ' + n + ' is not in the question'); });
      } else if (it.est && (est = row.match(/^(\d+) ([+−]) (\d+) is about (\d+)$/))) {
        /* "389 + 212 is about []": round each number to the nearest 10 or 100 first, then add or subtract */
        const r = n => Math.round(+n / it.est) * it.est, want = est[2] === '+' ? r(est[1]) + r(est[3]) : r(est[1]) - r(est[3]);
        if (want !== +est[4]) say('rounding first, ' + est[1] + ' ' + est[2] + ' ' + est[3] + ' is about ' + want + ', not ' + est[4]);
      } else if (rat) {
        /* ratios: every ratio in the row names the same comparison (3 : 5 = 6 : 10, because 3 × 10 = 5 × 6); a ratio on
           its own is the one the item asks for: of names its two terms from the picture's or the story's parts (a, b or all) */
        const r = rat.map(x => x.split(':').map(Number));
        if (r.some(([p, q]) => r[0][0] * q !== r[0][1] * p)) say('the ratios are not equivalent: ' + row);
        const parts = (pc && pc.parts) || it.parts;
        if (it.of && parts) {
          const t = { a: parts[0], b: parts[1], all: parts[0] + parts[1] }, want = it.of.map(k => t[k]);
          if (r[0][0] !== want[0] || r[0][1] !== want[1]) say('the ratio asked for is ' + want.join(':') + ', not ' + r[0].join(':'));
        } else if (r.length < 2) say('nothing checks the ratio ' + row);
        if (it.parts) it.parts.forEach(n => { if (nums(it.q).indexOf(n) < 0) say('the story part ' + n + ' is not in the question'); });
      } else if (it.round && !/=/.test(row)) {
        /* "345 is about []": the answer is the number rounded to the nearest 10 or 100 (5 rounds up); a sum in the same
           question (the change from a rounded cash total) is worked out below like any other */
        /* a fraction to round ("2/3 is about 0.67") is its value */
        const fr = row.match(/^(\d+)\/(\d+) is about/), n = fr ? [+fr[1] / +fr[2]].concat(nums(row).slice(2)) : nums(row);
        const rd = x => Math.round(x / it.round + 1e-9) * it.round;
        if (n.length !== 2 || !same(rd(n[0]), n[1])) say(n[0] + ' to the nearest ' + it.round + ' is ' + rd(n[0]) + ', not ' + n[1]);
      } else if ((worth = row.replace(/(\d)[\u00a0 ](?=\d{3}\b)/g, '$1').match(/^The (\d) in (\d+) is worth (\d+)$/))) {
        /* "The 7 in 472 is worth []": the digit's place gives its value */
        const d = worth[1], s2 = worth[2], at = s2.indexOf(d);
        if (at < 0 || s2.lastIndexOf(d) !== at) say('the digit ' + d + ' is not in ' + s2 + ' exactly once');
        else if (+d * Math.pow(10, s2.length - 1 - at) !== +worth[3]) say('the ' + d + ' in ' + s2 + ' is worth ' + (+d * Math.pow(10, s2.length - 1 - at)) + ', not ' + worth[3]);
      } else if (/,/.test(row)) {
        /* a count: each term is a number or a fraction (1/4, 2/4, 3/4), and every step is the same */
        const terms = row.split(',').map(t => val(norm(t))), n = terms.some(isNaN) ? nums(row) : terms;
        const step = it.by != null ? it.by : n[1] - n[0];
        if (it.core) {
          /* a repeating pattern: every number is the one a core length before it */
          if (n.length < 2 * it.core) say('a repeating pattern needs its core twice to be checked: ' + row);
          else if (n.some((x, i) => i >= it.core && x !== n[i - it.core])) say('the pattern does not repeat its core of ' + it.core + ': ' + row);
        } else if (n.length < (it.by != null ? 2 : 3)) say('a count needs 3 numbers, or a "by" step, to be checked: ' + row);
        else if (n.some((x, i) => i > 0 && !same(x - n[i - 1], step))) say('the count does not go up by the same step: ' + row);
      } else if (/=/.test(row)) {
        const rem = norm(row).match(/^(\d+) \/ (\d+) = (\d+) R (\d+)$/);
        if (rem) {
          /* "250 ÷ 24 = 10 R 10": divisor × quotient + remainder makes the total, and the remainder is less than the divisor */
          const [t, d, q, r] = rem.slice(1).map(Number);
          if (q * d + r !== t || r >= d) say('the remainder sum is not right: ' + row + ' (' + d + ' × quotient + remainder must make ' + t + ', with the remainder less than ' + d + ')');
          return;
        }
        const sides = norm(row).split('='), v = sides.map(val);
        if (v.some(isNaN)) say('cannot read the sum: ' + row);
        else if (v.some(x => !same(x, v[0]))) say('the sum is not true: ' + row);
      } else if (/[<>]/.test(row)) {
        const t = order(row);
        if (t === null) say('cannot read the comparison: ' + row);
        else if (!t) say('the comparison is not true: ' + row);
      } else if (/^\[\]( [^\s\d\[\]=<>,]+)?$/.test(raw[ri].trim())) {
        /* a bare answer, with or without its unit ("[] °"): the number the picture shows (unless a story sum checks it), or the number written in words */
        const v = ansAll[filled.slice(0, ri).reduce((k, r, j) => k + (raw[j].match(/\[\]/g) || []).length, 0)];
        if (it.digits) {
          /* the greatest or least number made from these digits, not starting with 0 */
          const perms = d => (d.length < 2 ? [d] : d.flatMap((x, i) => perms(d.slice(0, i).concat(d.slice(i + 1))).map(r => [x].concat(r))));
          const made = perms(it.digits).filter(p => p[0] !== 0).map(p => +p.join(''));
          const want = it.most ? Math.max(...made) : Math.min(...made);
          if (want !== v) say('the ' + (it.most ? 'greatest' : 'least') + ' number from ' + it.digits.join(', ') + ' is ' + want + ', not ' + v);
        } else if (it.edge) {
          /* the least or greatest whole number that rounds to val */
          const fits = []; for (let n = 0; n <= 1100; n++) if (Math.round(n / it.edge.to) * it.edge.to === it.edge.val) fits.push(n);
          const want = it.edge.end === 'least' ? fits[0] : fits[fits.length - 1];
          if (want !== v) say('the ' + it.edge.end + ' number that rounds to ' + it.edge.val + ' is ' + want + ', not ' + v);
        } else if (it.letter) {
          /* the number a letter stands for: put it in, and the statement must be true */
          const t = truth(it.letter.replace(/\b[a-z]\b/g, String(v)));
          if (t !== true) say('with ' + v + ' for the letter, "' + it.letter + '" is not true');
        } else if (it.words != null) { if (!same(fromWords(it.words), num(v))) say('"' + it.words + '" is ' + fromWords(it.words) + ', not ' + v); }
        else if (pc && pc.total != null && !it.calc) { if (!same(pc.total, num(v))) say('the picture shows ' + pc.total + ', not ' + v); else if (pc.name && /\//.test(v) && v !== pc.name) say('the picture shows ' + pc.name + ', not ' + v); }
        else if (!it.calc && !byItem) say('nothing checks the answer ' + v);
      } else if (blanks && !it.calc && !byItem) say('nothing checks this row: ' + raw[ri]);
    });
    /* a clock to draw the hands on: the time asked for is the time on the key */
    if (it.pic && it.pic[0] === 'clock' && it.pic[1].blank) {
      const asked = (it.q || '').match(/\d{1,2}:\d\d|quarter (past|to) \d{1,2}|half past \d{1,2}|\d{1,2} o'clock/);
      if (!asked || clockMin(asked[0]) !== pc.time) say('the clock to draw does not match the time asked for: ' + it.q);
    }
    /* a graph to draw from data in the question: the key draws each value the question gives */
    if (it.pic && ((it.pic[0] === 'picto' && it.pic[1].blank) || (it.pic[0] === 'bar' && it.pic[1].hide))) {
      const p = it.pic[1];
      p.cats.forEach((c, i) => { if ((it.pic[0] === 'picto' || p.hide.indexOf(i) >= 0) && !new RegExp('\\b' + c + ':? ' + p.vals[i] + '\\b').test(it.q)) say('the question does not give ' + c + ' ' + p.vals[i] + ' for the key to draw'); });
    }
    /* congruent faces or boxes: with the blanks filled in, the two lists of lengths match once sorted */
    if (it.cong) {
      const q = ansAll.slice(), b = it.cong.b.map(x => (x === '?' ? +q.shift() : x)), srt = l => l.slice().sort((x, y) => x - y).join();
      if (it.cong.b.indexOf('?') >= 0 && srt(it.cong.a) !== srt(b)) say(it.cong.a.join(' by ') + ' and ' + b.join(' by ') + ' are not congruent');
    }
    /* directions written on the key take you to the place asked for */
    if (it.give) { const w = walk(it.pic[1], it.lines.key); if (!w || !w.inside || w.cell !== it.give) say('the key directions end at ' + (w && w.cell) + ', not ' + it.give); }
    /* the answers are these numbers, in some order (putting numbers in order) */
    if (it.set && ansAll.map(num).sort((x, y) => x - y).join() !== it.set.map(num).sort((x, y) => x - y).join()) say('the answers ' + ansAll.join(', ') + ' are not the numbers ' + it.set.join(', '));
    /* expanded form: every answer is one digit followed by zeros, each in a different place */
    if (it.expanded && (ansAll.some(v => !/^[1-9]0*$/.test(String(v))) || new Set(ansAll.map(v => String(v).length)).size !== ansAll.length)) say('the expanded form ' + ansAll.join(' + ') + ' is not one part for each place');
    /* a number to write in words: the key's words are the number */
    if (it.spell != null && (!it.lines || it.lines.key !== toWords(it.spell))) say(it.spell + ' in words is "' + toWords(it.spell) + '", not "' + (it.lines && it.lines.key) + '"');
    /* 3. the picture matches the sum: its total is in the first sum that shows it (as a number or as one side), and a
       times sum uses its two numbers */
    const shows = r => nums(r).indexOf(pc.total) >= 0 || norm(r).split('=').map(val).some(v => same(v, pc.total));
    const sums = filled.filter(r => /=/.test(r)), first = (pc && pc.total != null && sums.filter(shows)[0]) || sums[0];
    if (pc && first) {
      if (pc.total != null && !shows(first)) say('the picture shows ' + pc.total + ' but the sum is ' + first);
      const m = norm(first).match(/^(\d+) \* (\d+) =/);
      if (m && pc.pair && [+m[1], +m[2]].sort().join() !== pc.pair.slice().sort().join()) say('the times sum ' + first + ' does not match the picture (' + pc.pair.join(' and ') + ')');
      const d = norm(first).match(/^(\d+) \/ (\d+) =/);
      if (d && pc.share && +d[2] !== pc.share) say('the sharing sum ' + first + ' does not share into ' + pc.share);
    }
    /* 3b. a shape with a perimeter: every sum that adds (5 + 3 + 5 + 3, 2 × (5 + 3)) works out to it */
    if (pc && pc.perim != null) filled.filter(r => /=/.test(r) && /\+/.test(r)).forEach(r => { if (!same(val(norm(r).split('=')[0]), pc.perim)) say('the perimeter is ' + pc.perim + ', not ' + r); });
    /* 4. a story: its answer follows from the numbers in it */
    if (it.fewest) {
      /* change in the fewest coins: as many of the biggest coin as fit, then the next (amt in cents, coins biggest first) */
      let left = it.fewest.amt;
      const want = it.fewest.coins.map(c => { const k = Math.floor(left / c); left -= k * c; return k; });
      if (left) say(it.fewest.amt + '¢ cannot be made from ' + it.fewest.coins.join(', ') + '¢ coins');
      else if (want.join() !== ansAll.map(Number).join()) say('the fewest coins for ' + it.fewest.amt + '¢ are ' + want.join(', ') + ', not ' + ansAll.join(', '));
    }
    if (it.calc) {
      const v = val(norm(it.calc));
      const ans = (it.a || [])[0], av = typeof ans === 'number' ? ans : val(norm(String(ans)));
      if (!same(v, av)) say('the story works out to ' + v + ', not ' + (it.a || [])[0]);
      const inQ = nums(it.q + ' ' + (it.pic && it.pic[0] === 'code' ? it.pic[1].lines.join(' ') : '')).concat(pc && pc.data ? pc.data : [], pc && pc.min ? [pc.min] : []);
      nums(it.calc).forEach(n => { if (inQ.indexOf(n) < 0) say('the story sum uses ' + n + ', which is not in the story'); });
    }
    /* 5. the circled choice */
    const pk = it.pick;
    if (pk) {
      const o = pk.opts, yes = pk.ans === 0;
      if ((o[0] === '×' && o[1] === '÷') || (o[0] === '+' && o[1] === '−')) {
        if (!it.calc || it.calc.indexOf(o[pk.ans]) < 0) say('the circled ' + o[pk.ans] + ' does not match the story sum ' + it.calc);
      } else if (pk.region != null || pk.cell != null) {
        /* where a number goes in the Venn or Carroll diagram (its labels, or pk.a and pk.b when there is no picture) */
        const p = it.pic ? it.pic[1] : pk, x = pk.region != null ? pk.region : pk.cell;
        const want = pk.region != null ? [p.a + ' only', 'both', p.b + ' only', 'neither'] : ['top left', 'top right', 'bottom left', 'bottom right'];
        const at = pk.region != null ? vennPart(p, x) : carrollCell(p, x);
        if (holds(p.a, x) === null || holds(p.b, x) === null) say('cannot read the labels ' + p.a + ' and ' + p.b);
        else if (o.join() !== want.join() || pk.ans !== at) say(x + ' goes in "' + want[at] + '", not "' + o[pk.ans] + '"');
      } else if (pk.kindOf) {
        const want = QUANT.test(pk.kindOf) ? 'numbers' : 'words';
        if (o[pk.ans] !== want) say('"' + pk.kindOf + '" has ' + want + ' for answers, not ' + o[pk.ans]);
      } else if (o.indexOf('interview') >= 0 && o.indexOf('experiment') >= 0) {
        const q = it.q.toLowerCase(), hit = Object.keys(COLLECT).filter(k => COLLECT[k].test(q));
        if (hit.length !== 1) say('cannot tell how the data is collected from: ' + it.q); else if (o[pk.ans] !== hit[0]) say('this is an ' + hit[0] + ', not an ' + o[pk.ans]);
      } else if (it.look && /most|least/.test(it.look.op)) {
        /* the one category with the most (or least) */
        const d = (picture(it.pic) || {}).byCat || {}, v = o.map(c => d[c]), best = it.look.op === 'most' ? Math.max(...v) : Math.min(...v);
        if (v.some(x => x === undefined) || v[pk.ans] !== best || v.filter(x => x === best).length !== 1) say('the ' + it.look.op + ' is not only ' + o[pk.ans] + ': ' + v.join(', '));
      } else if (it.look && o[0] === 'true') {
        const want = dataVal(it) === it.look.say;
        if (want !== yes) say('the data give ' + dataVal(it) + ', so "' + it.look.say + '" is ' + want);
      } else if (pk.scale) {
        /* the step the graph's scale counts by */
        const ok = o.map(x => nums(x)[0] === pc.step);
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('the scale counts by ' + pc.step + ', not ' + o[pk.ans]);
      } else if (pk.scaleFor) {
        /* the smallest step that shows the biggest count in 10 lines or fewer */
        const s = o.map(x => nums(x)[0]), fit = s.filter(x => pk.scaleFor / x <= 10), want = Math.min(...fit);
        if (s[pk.ans] !== want) say('for a biggest count of ' + pk.scaleFor + ', count by ' + want + 's, not ' + o[pk.ans]);
      } else if (pk.missing) {
        /* the one part the graph does not have */
        const key = { title: 'title', label: 'ylab', source: 'src' }, has = pc.parts, gone = o.filter(x => has[key[x]] === false);
        if (o.some(x => has[key[x]] === undefined) || gone.length !== 1 || gone[0] !== o[pk.ans]) say('the graph is missing ' + gone.join(' and ') + ', not ' + o[pk.ans]);
      } else if (o.indexOf('mean') >= 0 && o.indexOf('mode') >= 0) {
        const q = it.q.toLowerCase(), hit = Object.keys(STAT).filter(k => STAT[k].test(q));
        if (hit.length !== 1) say('cannot tell mean or mode from: ' + it.q); else if (o[pk.ans] !== hit[0]) say('this asks for the ' + hit[0] + ', not the ' + o[pk.ans]);
      } else if (pk.sameStat) {
        const g = Object.values(it.vals.g), f = v => (pk.sameStat === 'mean' ? v.reduce((x, y) => x + y, 0) / v.length : modeOf(v)), want = f(g[0]) === f(g[1]);
        if (want !== yes) say('the ' + pk.sameStat + 's are ' + f(g[0]) + ' and ' + f(g[1]) + ', but the key circles ' + o[pk.ans]);
      } else if (pk.chanceOf) {
        /* how likely one colour is, from the counts in the bag or on the spinner */
        const c = chances, n = Object.values(c).reduce((x, y) => x + y, 0), want = chanceWord(c[pk.chanceOf.of] || 0, n);
        if (pk.chanceOf.say ? (want === pk.chanceOf.say) !== yes : o[pk.ans] !== want) say(pk.chanceOf.of + ' is ' + want + ', but the key circles ' + o[pk.ans]);
      } else if (pk.likely) {
        /* the one colour most (or least) likely */
        const c = chances, v = o.map(x => c[x] || 0), best = pk.likely === 'most' ? Math.max(...v) : Math.min(...v);
        if (v[pk.ans] !== best || v.filter(x => x === best).length !== 1) say('the ' + pk.likely + ' likely colour is not only ' + o[pk.ans]);
      } else if (it.fair) {
        /* a game is fair when each player's colour has the same chance */
        const c = chances, want = (c[it.fair[0]] || 0) === (c[it.fair[1]] || 0);
        if (want !== yes) say('the game is ' + (want ? '' : 'not ') + 'fair, but the key circles ' + o[pk.ans]);
      } else if (it.pic && it.pic[0] === 'balance' && pc.heavy !== undefined && o.indexOf(it.pic[1].l) >= 0) {
        /* the side that goes down is the heavier one */
        if (pc.heavy === null || o[pk.ans] !== pc.heavy) say('the heavier one is ' + pc.heavy + ', not ' + o[pk.ans]);
      } else if (!pk.size && o.indexOf('mass') >= 0 && o.indexOf('capacity') >= 0) {
        const q = it.q.toLowerCase(), hit = Object.keys(MEASURE).filter(k => MEASURE[k].test(q));
        if (hit.length !== 1) say('cannot tell mass, capacity or time from: ' + it.q); else if (o[pk.ans] !== hit[0]) say('this is about ' + hit[0] + ', not ' + o[pk.ans]);
      } else if (it.chain) {
        /* things from heaviest to lightest: the lightest is last */
        const want = /lightest/.test(it.q) ? it.chain[it.chain.length - 1] : it.chain[0];
        if (o[pk.ans] !== want) say('the answer is ' + want + ', not ' + o[pk.ans]);
      } else if (it.tool3) {
        const want = { mass: 'balance', capacity: 'cup', time: 'clock' }[it.tool3];
        if (o[pk.ans] !== want) say(it.tool3 + ' is measured with a ' + want + ', not a ' + o[pk.ans]);
      } else if (pk.dur != null) {
        /* the unit for how long something takes (in seconds): under a minute and a half seconds, under an hour and a half minutes, else hours */
        const want = pk.dur < 90 ? 'seconds' : pk.dur < 5400 ? 'minutes' : 'hours';
        if (o[pk.ans] !== want) say('something lasting ' + pk.dur + ' seconds is timed in ' + want + ', not ' + o[pk.ans]);
      } else if (pk.lenMM != null) {
        /* the unit that suits a length */
        if (o[pk.ans] !== unitFor(pk.lenMM) || o.filter(x => x === unitFor(pk.lenMM)).length !== 1) say('a length of ' + pk.lenMM + ' mm is measured in ' + unitFor(pk.lenMM) + ', not ' + o[pk.ans]);
      } else if (o.indexOf('perimeter') >= 0 && o.indexOf('area') >= 0) {
        const q = it.q.toLowerCase(), want = AROUND.test(q) && !INSIDE.test(q) ? 'perimeter' : INSIDE.test(q) && !AROUND.test(q) ? 'area' : null;
        if (!want) say('cannot tell perimeter or area from: ' + it.q); else if (o[pk.ans] !== want) say('this needs the ' + want + ', not the ' + o[pk.ans]);
      } else if (pk.perim) {
        /* the one rectangle ("4 by 2") with this perimeter */
        const ok = o.map(x => { const [a, b] = x.split(' by ').map(Number); return 2 * (a + b) === pk.perim; });
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one rectangle has a perimeter of ' + pk.perim + ': ' + o.join(', '));
      } else if (pk.areaUnit != null) {
        /* square centimetres for things smaller than about a big book page, square metres for floors and fields */
        const want = pk.areaUnit < 2000 ? 'cm²' : 'm²';
        if (o[pk.ans] !== want) say('an area of ' + pk.areaUnit + ' cm² is measured in ' + want + ', not ' + o[pk.ans]);
      } else if (pk.cover) {
        /* gaps leave space uncounted (too small); overlaps, cups not filled to the top and spills need extra units (too big) */
        const want = pk.cover === 'gaps' ? 'too small' : 'too big';
        if (o[pk.ans] !== want) say('tiles with ' + pk.cover + ' give an area that is ' + want + ', not ' + o[pk.ans]);
      } else if (it.same && it.pic && it.pic[0] === 'row') {
        /* do the pictures in the row cover the same area? */
        const t = it.pic[1].list.map(q => picture(q).total), all = t.every(v => v === t[0]);
        if (all !== yes) say('the areas are ' + t.join(' and ') + ', but the key circles ' + o[pk.ans]);
      } else if (it.cmp) {
        /* who or what is longer: the first choice goes with the first length */
        const a = toMM(it.cmp[0]), b = toMM(it.cmp[1]);
        if (a === null || b === null || a === b || (a > b ? 0 : 1) !== pk.ans) say('of ' + it.cmp.join(' and ') + ', the longer is not ' + o[pk.ans]);
      } else if (it.count) {
        /* the bigger unit is the one that fits fewer times along the same length */
        const want = Object.keys(it.count).sort((x, y) => it.count[x] - it.count[y])[0];
        if (o[pk.ans] !== want) say('the unit that fits fewer times is ' + want + ', not ' + o[pk.ans]);
      } else if (it.tool) {
        const want = it.tool === 'curve' ? 'string' : 'ruler';
        if (o[pk.ans] !== want) say('a ' + it.tool + ' edge is measured with a ' + want + ', not a ' + o[pk.ans]);
      } else if (pk.longest) {
        const v = o.map(toMM);
        if (v.some(x => x === null) || v.some((x, i) => i !== pk.ans && x >= v[pk.ans])) say('the circled length is not the longest: ' + o.join(', '));
      } else if (pk.shortest) {
        const v = o.map(toMM);
        if (v.some(x => x === null) || v.some((x, i) => i !== pk.ans && x <= v[pk.ans])) say('the circled length is not the shortest: ' + o.join(', '));
      } else if (pk.clue) {
        /* exactly one choice is an object that fits every part of the clue */
        const ok = o.map(x => fits(solidOf(x, it), pk.clue));
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice fits ' + JSON.stringify(pk.clue) + ': ' + o.join(', '));
      } else if (pk.part != null) {
        /* the object at this place in a structure (0: the top) */
        const want = it.pic[1].list[pk.part];
        if (solidOf(o[pk.ans], it) !== want || o.filter(x => solidOf(x, it) === want).length !== 1) say('part ' + (pk.part + 1) + ' of the structure is a ' + want + ', not ' + o[pk.ans]);
      } else if (pk.claim) {
        /* true or false: the object (pk.claim.s) has these counts */
        const c = Object.assign({}, pk.claim); delete c.s;
        if (fits(pk.claim.s, c) !== yes) say(JSON.stringify(pk.claim) + ' is ' + fits(pk.claim.s, c) + ', but the key circles ' + o[pk.ans]);
      } else if (it.solid && !Array.isArray(it.solid) && /^(prism|pyramid|neither)$/.test(o[pk.ans])) {
        if (SOLID[it.solid].kind !== o[pk.ans]) say('a ' + it.solid + ' is ' + SOLID[it.solid].kind + ', not ' + o[pk.ans]);
      } else if (pk.same) {
        /* the one choice congruent to pk.same: the same lengths once sorted */
        const srt = l => l.slice().sort((x, y) => x - y).join(), ok = pk.dims.map(d => srt(d) === srt(pk.same));
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice is congruent to ' + pk.same.join(' by '));
      } else if (it.cong && o[0] === 'yes') {
        /* "Are A and B congruent?": yes when their lengths match once sorted */
        const srt = l => l.slice().sort((x, y) => x - y).join(), want = srt(it.cong.a) === srt(it.cong.b);
        if (want !== yes) say(it.cong.a.join(' by ') + ' and ' + it.cong.b.join(' by ') + (want ? ' are' : ' are not') + ' congruent');
      } else if (it.turn && DIRS.indexOf(o[pk.ans]) >= 0) {
        const want = DIRS[facing(it.turn.from, it.turn.moves)];
        if (o[pk.ans] !== want || o.filter(x => x === want).length !== 1) say('you face ' + want + ', not ' + o[pk.ans]);
      } else if (it.turnTo) {
        /* exactly one turn takes you from one way to the other */
        const ok = o.map(t => DIRS[facing(it.turnTo.from, t)] === it.turnTo.to);
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one turn goes from ' + it.turnTo.from + ' to ' + it.turnTo.to);
      } else if (it.walk && it.pic && it.pic[0] === 'map') {
        /* the circled place is where the walk ends */
        const m = it.pic[1], w = walk(m, it.walk), hit = w && (m.marks || []).filter(k => 'ABCDEFGHIJ'[k[0]] + (m.rows - k[1]) === w.cell);
        if (!w) say('cannot read the walk: ' + it.walk);
        else if (!hit.length || hit[0][2] !== o[pk.ans]) say('the walk ends at ' + w.cell + ', not at ' + o[pk.ans]);
      } else if (it.tf) {
        const t = truth(it.tf);
        if (t === null) say('cannot read the statement: ' + it.tf);
        else if (t !== yes) say('"' + it.tf + '" is ' + t + ', but the key circles ' + o[pk.ans]);
        if (/Check it with ×/.test(it.q || '')) {
          const g = norm(it.tf).match(/^(\d+) \/ (\d+) = (\d+)/);
          if (!g || (it.a || [])[0] !== +g[3]) say('the check does not use the answer being checked: ' + it.tf);
        }
      } else if (it.mult) {
        if (it.mult.n != null) {
          if ((it.mult.n % it.mult.of === 0) !== yes) say(it.mult.n + ' in the ' + it.mult.of + ' facts: the key is wrong');
        } else {
          const ok = o.map(x => +x % it.mult.of === 0);
          if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice is in the ' + it.mult.of + ' facts');
        }
      } else if (it.odd) {
        const ok = o.map(truth);
        if (ok[pk.ans] !== false || ok.filter(x => x === false).length !== 1) say('the odd one out is not the only wrong fact');
      } else if (pk.term) {
        /* the nth term of a repeating pattern of numbers or names: the core comes round again every core length */
        const c = pk.term.core;
        if (o[pk.ans] !== c[(pk.term.n - 1) % c.length]) say('term ' + pk.term.n + ' of the core ' + c.join(', ') + ' is ' + c[(pk.term.n - 1) % c.length] + ', not ' + o[pk.ans]);
      } else if (pk.equal) {
        /* "Equal parts?" under a fraction picture: yes unless the picture is cut unevenly */
        const ev = !(it.pic && it.pic[0] === 'frac' && it.pic[1].uneven);
        if (o[pk.ans] !== (ev ? 'yes' : 'no')) say('the parts are ' + (ev ? '' : 'not ') + 'equal, but the key circles ' + o[pk.ans]);
      } else if (pk.nw != null) {
        const ok = o.map(x => same(num(x), fromWords(pk.nw)));
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice is ' + pk.nw);
      } else if (pk.wn != null) {
        const ok = o.map(x => fromWords(x) === pk.wn);
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice says ' + pk.wn + ' in words');
      } else if (pk.cmp) {
        const x = num(pk.cmp[0]), y = num(pk.cmp[1]), want = x < y ? '<' : x > y ? '>' : '=';
        if (o[pk.ans] !== want) say(pk.cmp.join(' and ') + ': the sign is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.est) {
        const v = val(norm(pk.est)), d = o.map(x => Math.abs(val(norm(x)) - v));
        if (isNaN(v) || d.some((x, i) => i !== pk.ans && x <= d[pk.ans])) say('the circled estimate is not the closest to ' + pk.est + ': ' + o.join(', '));
        nums(pk.est).forEach(n => { if (nums(it.q).indexOf(n) < 0) say('the estimate uses ' + n + ', which is not in the question'); });
      } else if (pk.digit) {
        const worth = o.map(x => { const d = String(x).replace(/\D/g, ''), at = d.indexOf(String(pk.digit.d)); return at < 0 ? 0 : pk.digit.d * Math.pow(10, d.length - 1 - at); });
        if (worth[pk.ans] !== pk.digit.worth || worth.filter(v => v === pk.digit.worth).length !== 1) say('not exactly one choice has a ' + pk.digit.d + ' worth ' + pk.digit.worth);
      } else if (pk.round) {
        const rnd = (x, r) => same(Math.round(num(x) / r.to + 1e-9) * r.to, r.val);
        const ok = o.map(x => rnd(x, pk.round) && (!pk.also || rnd(x, pk.also)));
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice rounds to ' + pk.round.val);
      } else if (pk.diff) {
        const v = o.map(num), odd = v.map((x, i) => v.filter((y, j) => j !== i && same(x, y)).length === 0);
        if (!odd[pk.ans] || odd.filter(Boolean).length !== 1) say('the circled choice is not the only one with a different value: ' + o.join(', '));
      } else if (pk.simplest) {
        /* the only fraction in simplest form: its top and bottom share no factor but 1 */
        const g = (x, y) => (y ? g(y, x % y) : x), ok = o.map(x => { const [n, d] = String(x).split('/').map(Number); return g(n, d) === 1; });
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice is in simplest form: ' + o.join(', '));
      } else if (pk.ratio) {
        /* exactly one choice is (or, with not, is not) equivalent to the ratio, in the same order */
        const ok = o.map(x => { const r = String(x).split(':').map(Number); return r.length === 2 && pk.ratio[0] * r[1] === pk.ratio[1] * r[0]; }).map(e => (pk.not ? !e : e));
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice is ' + (pk.not ? 'not ' : '') + 'equivalent to ' + pk.ratio.join(' : ') + ': ' + o.join(', '));
      } else if (pk.more || pk.less) {
        /* "who has more" (or less): the choices are names, pk.more or pk.less holds their amounts in the same order */
        const am = pk.more || pk.less, v = am.map(x => val(norm(x))), sg = pk.more ? 1 : -1;
        if (v.some(isNaN) || v.some((x, i) => i !== pk.ans && sg * x >= sg * v[pk.ans])) say('the circled one does not have the ' + (pk.more ? 'most' : 'least') + ': ' + am.join(', '));
        am.forEach(x => nums(x).forEach(n => { if (nums(it.q).indexOf(n) < 0) say('the amount ' + x + ' uses ' + n + ', which is not in the question'); }));
      } else if (it.robot && it.robot.code) {
        /* where the robot stops is the circled mark */
        const m = it.pic[1], end = robot(m.start, it.robot.code), hit = end && (m.marks || []).filter(k => k[0] === end[0] && k[1] === end[1]);
        if (!end) say('cannot read the code: ' + it.robot.code);
        else if (!hit.length || hit[0][2] !== o[pk.ans]) say('the robot stops at ' + end.join(',') + (hit.length ? ' (' + hit[0][2] + ')' : ' (no mark)') + ', not at ' + o[pk.ans]);
      } else if (pk.nth) {
        /* the shape at place n of a repeating pattern */
        const sh = pk.nth.seq[(pk.nth.n - 1) % pk.nth.seq.length];
        if (SHAPES[sh] !== o[pk.ans] || o.filter(x => x === SHAPES[sh]).length !== 1) say('shape ' + pk.nth.n + ' of ' + pk.nth.seq + ' is a ' + SHAPES[sh] + ', not ' + o[pk.ans]);
      } else if (pk.rule) {
        /* the rule of a growing or shrinking pattern: "add 3" or "take away 5" */
        const q = pk.rule, d = q[1] - q[0], ok = q.every((x, i) => !i || x - q[i - 1] === d);
        const right = d > 0 ? 'add ' + d : 'take away ' + -d;
        if (!ok) say('the pattern ' + q.join(', ') + ' has no one rule'); else if (o[pk.ans] !== right || o.filter(x => x === right).length !== 1) say('the rule of ' + q.join(', ') + ' is "' + right + '", not "' + o[pk.ans] + '"');
      } else if (pk.kind) {
        /* repeating (a core comes back) or growing (the same change each time) */
        const q = pk.kind, rep = [...Array(q.length).keys()].some(p => p > 0 && p < q.length && q.every((x, i) => x === q[i % p]));
        const grow = q.every((x, i) => !i || x - q[i - 1] === q[1] - q[0]) && q[1] !== q[0];
        const want = rep ? 'repeating' : grow ? 'growing' : null;
        if (!want || o[pk.ans] !== want) say(q.join(', ') + ' is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.core || pk.struct) {
        /* shapes written as symbols: the one pattern with this core length, or this letter structure (A B B ...) */
        const letters = x => { const seen = []; return [...x].map(c => { if (seen.indexOf(c) < 0) seen.push(c); return 'ABCDEFG'[seen.indexOf(c)]; }).join(''); };
        const per = x => [...Array(x.length).keys()].map(q => q + 1).find(q => [...x].every((c, i) => c === x[i % q]));
        const ok = o.map(x => (pk.core ? per([...x]) === pk.core && per([...x]) < [...x].length : letters(x).startsWith(pk.struct) && per([...x]) === pk.struct.length));
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one pattern has ' + (pk.core ? 'a core of ' + pk.core : 'the structure ' + pk.struct));
      } else if (pk.turn) {
        /* arrows turning a quarter turn each time: right (clockwise) or left */
        const D = ['^', '>', 'v', '<'], t = [...pk.turn].map(c => D.indexOf(c)), steps = t.slice(1).map((x, i) => (x - t[i] + 4) % 4);
        const want = steps.every(x => x === 1) ? 'right' : steps.every(x => x === 3) ? 'left' : null;
        if (o[pk.ans] !== want) say('the arrows ' + pk.turn + ' turn ' + want + ', not ' + o[pk.ans]);
      } else if (pk.heavy) {
        const l = val(norm(pk.heavy[0])), r = val(norm(pk.heavy[1])), want = l > r ? 'left' : r > l ? 'right' : null;
        if (o[pk.ans] !== want) say('the side that goes down is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.machine) {
        /* the one rule that turns every In into its Out */
        const ok = o.map(r => pk.machine.every(io => val(norm(io[0] + ' ' + r)) === io[1]));
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one rule fits the machine');
      } else if (it.oneRule) {
        const q = it.oneRule, one = q.every((x, i) => !i || x - q[i - 1] === q[1] - q[0]);
        if (one !== yes) say(q.join(', ') + (one ? ' has' : ' has no') + ' one rule, but the key circles ' + o[pk.ans]);
      } else if (pk.place) {
        /* the one number where digit d is worth v */
        const ok = o.map(x => x.split(pk.place.d).length === 2 && pk.place.d * Math.pow(10, x.length - 1 - x.indexOf(String(pk.place.d))) === pk.place.v);
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice has its ' + pk.place.d + ' worth ' + pk.place.v);
      } else if (pk.blocks) {
        /* the number that needs the most base ten blocks: the most when its digits are added */
        const n = o.map(x => String(x).split('').reduce((t, d) => t + +d, 0));
        if (n.some((x, i) => i !== pk.ans && x >= n[pk.ans])) say('the circled number does not need the most blocks: ' + o.join(', '));
      } else if (pk.seq) {
        const ok = o.map(x => +x >= pk.seq.from && (+x - pk.seq.from) % pk.seq.by === 0);
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice is in the count from ' + pk.seq.from + ' by ' + pk.seq.by);
      } else if (pk.between) {
        const ok = o.map(x => num(x) > pk.between[0] && num(x) < pk.between[1]);
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice is between ' + pk.between.join(' and '));
      } else if (pk.small) {
        const v = o.map(x => val(norm(x)));
        if (v.some(isNaN) || v.some((x, i) => i !== pk.ans && x <= v[pk.ans])) say('the circled choice is not the least: ' + o.join(', '));
      } else if (pk.big) {
        const v = o.map(x => (isNaN(val(norm(x))) ? fromWords(x) : val(norm(x))));
        if (v.some(isNaN) || v.some((x, i) => i !== pk.ans && x >= v[pk.ans])) say('the circled choice is not the biggest: ' + o.join(', '));
      } else if (pk.val != null) {
        const ok = o.map(x => same(val(norm(x)), pk.val));
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice makes ' + pk.val);
      } else if (o[0] === 'yes' && pc && pc.counts) {
        if (pc.counts.every(x => x === pc.counts[0]) !== yes) say('equal groups: the key is wrong');
      } else if (pk.tri) {
        /* name a triangle by its sides or angles: the picture decides */
        /* the triangle is the picture, or it.tri (its sides or angles, which must be in the question) */
        const tk = (pc && pc.kinds) || (it.tri && picture(['tri', it.tri]).kinds);
        if (it.tri) (it.tri.sides || it.tri.angles).forEach(n => { if (nums(it.q).indexOf(n) < 0) say('the triangle\'s ' + n + ' is not in the question'); });
        if (!tk) say('a triangle choice has no triangle');
        else if (o[pk.ans] !== tk[pk.tri]) say('by its ' + pk.tri + ' the triangle is ' + tk[pk.tri] + ', not ' + o[pk.ans]);
      } else if (pk.cong) {
        /* two shapes on grids: congruent when one can be turned or flipped onto the other */
        const sets = it.pic[1].list.map(q => q[1].cells.map(c => c.split(',').map(Number)));
        const norm2 = cs => { const mx = Math.min(...cs.map(c => c[0])), my = Math.min(...cs.map(c => c[1])); return cs.map(c => (c[0] - mx) + ',' + (c[1] - my)).sort().join(' '); };
        const forms = cs => [0, 1, 2, 3].flatMap(t => [false, true].map(f => norm2(cs.map(([a, b]) => { let p = f ? [-a, b] : [a, b]; for (let k = 0; k < t; k++) p = [-p[1], p[0]]; return p; }))));
        const cong = forms(sets[0]).includes(norm2(sets[1]));
        if ((o[pk.ans] === 'yes') !== cong) say('the shapes are ' + (cong ? '' : 'not ') + 'congruent, but the key circles ' + o[pk.ans]);
      } else if (pk.angle) {
        /* name an angle by its size: the picture decides */
        const g = pc && pc.deg, want = g < 90 ? 'acute' : g === 90 ? 'right' : g < 180 ? 'obtuse' : g === 180 ? 'straight' : 'reflex';
        if (g == null) say('an angle choice has no angle');
        else if (o[pk.ans] !== want) say('a ' + g + '° angle is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.near) {
        /* the choice closest to the angle drawn (a benchmark, or the right scale of a protractor) */
        const g = pc && pc.total, d = o.map(x => Math.abs(num(x) - g));
        if (g == null) say('a "closest" choice has no picture to measure');
        else if (d.some((x, i) => i !== pk.ans && x <= d[pk.ans])) say('the circled ' + o[pk.ans] + ' is not the only closest to ' + g + ': ' + o.join(', '));
      } else if (pk.size) {
        /* a metric unit or an estimate for a thing whose real size is pk.size, in metres (m), grams (g) or litres (L):
           a unit fits when the number is not tiny or huge (mm under 1 cm, cm under 1 m, m under 1 km, then km; g under
           1 kg; mL under 1 L); an estimate is the one closest to the real size, by how many times too big or too small */
        const [u, v] = Object.entries(pk.size)[0];
        /* what kind of measure (length in m, mass in g, capacity in L), and the tool: a ruler under 1 m, a measuring tape
           from 1 m, a scale for mass, a measuring jug for capacity */
        const KIND = { m: 'length', g: 'mass', L: 'capacity' }, tool = u === 'm' ? (v < 1 ? 'ruler' : 'measuring tape') : u === 'g' ? 'scale' : 'measuring jug';
        if (o.indexOf('length') >= 0) { if (o[pk.ans] !== KIND[u]) say('that is ' + KIND[u] + ', not ' + o[pk.ans]); }
        else if (o.indexOf('ruler') >= 0 || o.indexOf('scale') >= 0) { if (o[pk.ans] !== tool) say('the tool for ' + v + ' ' + u + ' is a ' + tool + ', not ' + o[pk.ans]); }
        else if (o.every(x => MU[x] != null)) {
          const fit = u === 'm' ? (v < 0.01 ? 'mm' : v < 1 ? 'cm' : v < 1000 ? 'm' : 'km') : u === 'g' ? (v < 1000 ? 'g' : 'kg') : v < 1 ? 'mL' : 'L';
          if (o[pk.ans] !== fit || o.filter(x => x === fit).length !== 1) say('the unit that fits ' + v + ' ' + u + ' is ' + fit + ', not ' + o[pk.ans]);
        } else {
          const d = o.map(x => { const m = String(x).match(/^(\d+(?:\.\d+)?) ?(mm|cm|km|m|mg|kg|g|mL|L)$/); return m ? Math.abs(Math.log(+m[1] * MU[m[2]] / v)) : NaN; });
          if (d.some(isNaN)) say('cannot read the estimates ' + o.join(', '));
          else if (d.some((x, i) => i !== pk.ans && x <= d[pk.ans])) say('the circled ' + o[pk.ans] + ' is not the closest to ' + v + ' ' + u);
        }
      } else if (pk.rect || pk.sym) {
        /* a shape on a grid: a rectangle has 4 sides and 4 right angles; a line of symmetry flips every corner onto a corner */
        const sh = it.pic && it.pic[0] === 'coord' && it.pic[1].shape, m = it.pic && it.pic[1].mirror;
        if (!sh || (pk.sym && !m)) say('a shape choice has no shape' + (pk.sym ? ' or mirror line' : ''));
        else {
          const set = sh.map(p => p.join());
          const yes2 = pk.rect ? sh.length === 4 && rights(sh) === 4 : sh.every(p => set.includes((m.x != null ? [2 * m.x - p[0], p[1]] : [p[0], 2 * m.y - p[1]]).join()));
          if ((o[pk.ans] === 'yes') !== yes2) say((pk.rect ? 'the shape is ' + (yes2 ? '' : 'not ') + 'a rectangle' : 'the line is ' + (yes2 ? '' : 'not ') + 'a line of symmetry') + ', but the key circles ' + o[pk.ans]);
        }
      } else if (pk.dtype != null) {
        /* qualitative or quantitative, from an example answer: a number is quantitative, words are qualitative */
        const want = isNaN(num(pk.dtype)) ? 'qualitative' : 'quantitative';
        if (o[pk.ans] !== want) say('an answer like "' + pk.dtype + '" is ' + want + ' data, not ' + o[pk.ans]);
      } else if (pk.pay) {
        /* a way to pay, from how the money moves: bills and coins are cash; a card that works at one store is a gift card;
           from your own account right away is debit;
           the bank pays now and you pay it back later is credit; from one account to another with no card is an e-transfer */
        const h = pk.pay, way = h.cash ? 'cash' : h.gift ? 'gift card' : h.from === 'own' ? 'debit' : h.from === 'bank' ? 'credit' : h.accounts ? 'e-transfer' : null;
        if (o[pk.ans] !== way) say('that way to pay is ' + way + ', not ' + o[pk.ans]);
      } else if (pk.gov) {
        /* which level of government runs a service */
        const LEVEL = { passports: 'federal', 'the armed forces': 'federal', 'national parks': 'federal', 'coins and bills': 'federal', 'mail delivery': 'federal',
          hospitals: 'provincial', schools: 'provincial', highways: 'provincial', "driver's licences": 'provincial', 'health cards': 'provincial',
          libraries: 'municipal', 'garbage pickup': 'municipal', 'local parks': 'municipal', 'fire trucks': 'municipal', 'city buses': 'municipal', 'snow ploughs on your street': 'municipal' };
        if (!LEVEL[pk.gov]) say('no level is known for ' + pk.gov);
        else if (o[pk.ans] !== LEVEL[pk.gov]) say(pk.gov + ' are run by the ' + LEVEL[pk.gov] + ' government, not ' + o[pk.ans]);
      } else if (pk.con) {
        /* where money goes: money coming in is earned; buying something is spending; keeping it for later is saving;
           putting it where it may grow is investing; giving it away is donating */
        const h = pk.con, kind = h.in ? 'earn' : h.buy ? 'spend' : h.keep ? 'save' : h.grow ? 'invest' : h.give ? 'donate' : null;
        if (o[pk.ans] !== kind) say('that money choice is ' + kind + ', not ' + o[pk.ans]);
      } else if (pk.need) {
        /* needs keep you safe and healthy; anything not on this list is a want */
        const NEED = ['a winter coat', 'boots for snow', 'food for dinner', 'medicine', 'a toothbrush', 'bus fare to school', 'mittens', 'milk', 'glasses to see the board'];
        const want = NEED.indexOf(pk.need) >= 0 ? 'need' : 'want';
        if (o[pk.ans] !== want) say(pk.need + ' is a ' + want + ', not a ' + o[pk.ans]);
      } else if (pk.prime != null) {
        /* prime (only 1 and itself as factors) or composite */
        const want = isPrime(pk.prime) ? 'prime' : pk.prime > 1 ? 'composite' : 'neither';
        if (o[pk.ans] !== want) say(pk.prime + ' is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.lin) {
        /* a linear pattern grows (or shrinks) by the same amount every time */
        const q = pk.lin, want = q.every((x, i) => !i || same(x - q[i - 1], q[1] - q[0])) ? 'linear' : 'not linear';
        if (o[pk.ans] !== want) say(q.join(', ') + ' is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.dot) {
        /* on a number line, < and > leave the number out (an open dot); ≤ and ≥ take it in (a closed dot) */
        const want = /[≤≥]/.test(pk.dot) ? 'closed dot' : /[<>]/.test(pk.dot) ? 'open dot' : null;
        if (o[pk.ans] !== want) say(pk.dot + ' is drawn with ' + want + ', not ' + o[pk.ans]);
      } else if (pk.rep) {
        /* a fraction's decimal stops (terminating) when its bottom, in simplest form, has no prime factor but 2 and 5 */
        let d = pk.rep[1] / gcd(pk.rep[0], pk.rep[1]);
        while (d % 2 === 0) d /= 2;
        while (d % 5 === 0) d /= 5;
        const want = d === 1 ? 'terminating' : 'repeating';
        if (o[pk.ans] !== want) say(pk.rep.join('/') + ' as a decimal is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.onePrime) {
        const ok = o.map(x => isPrime(num(x)));
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice is prime: ' + o.join(', '));
      } else if (pk.qfit) {
        /* exactly one shape has every property of the clue */
        const ok = o.map(x => !!QUAD[x] && Object.keys(pk.qfit).every(k => QUAD[x][k] === pk.qfit[k]));
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one shape fits ' + JSON.stringify(pk.qfit) + ': ' + o.join(', '));
      } else if (pk.qprop) {
        /* yes or no: does this shape have this property? */
        const q = QUAD[pk.qprop[0]], want = q && q[pk.qprop[1]] != null ? !!q[pk.qprop[1]] : null;
        if (want === null) say('no property ' + pk.qprop[1] + ' is known for a ' + pk.qprop[0]); else if (want !== yes) say('for a ' + pk.qprop[0] + ', ' + pk.qprop[1] + ' is ' + want + ', but the key circles ' + o[pk.ans]);
      } else if (pk.family) {
        /* true or false: every one of the first kind is also the second kind */
        const want = ISA[pk.family[1]] && QUAD[pk.family[0]] ? ISA[pk.family[1]](QUAD[pk.family[0]]) : null;
        if (want === null) say('cannot tell if every ' + pk.family[0] + ' is a ' + pk.family[1]); else if (want !== yes) say('every ' + pk.family[0] + ' is ' + (want ? '' : 'not ') + 'a ' + pk.family[1] + ', but the key circles ' + o[pk.ans]);
      } else if (pk.pair) {
        /* two angles: complementary when they add to 90°, supplementary when they add to 180° */
        const t = pk.pair[0] + pk.pair[1], want = t === 90 ? 'complementary' : t === 180 ? 'supplementary' : 'neither';
        if (o[pk.ans] !== want) say(pk.pair.join('° and ') + '° are ' + want + ', not ' + o[pk.ans]);
      } else if (pk.dc) {
        /* qualitative (words), discrete (counted) or continuous (measured), from the question's words */
        const q = it.q || '', want = WORDS.test(q) ? (o.indexOf('qualitative') >= 0 ? 'qualitative' : null) : o.indexOf('quantitative') >= 0 ? 'quantitative' : COUNTED.test(q) && !MEASURED.test(q) ? 'discrete' : MEASURED.test(q) && !COUNTED.test(q) ? 'continuous' : null;
        if (!want) say('cannot tell counted or measured from: ' + q); else if (o[pk.ans] !== want) say('this data is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.dist) {
        /* ways to share resources: swapping one thing for another is trading; giving something you will get back is lending;
           getting something you must give back is borrowing; giving it away for good is donating */
        const h = pk.dist, way = h.swap ? 'trade' : h.give && h.back ? 'lend' : h.get && h.back ? 'borrow' : h.give ? 'donate' : null;
        if (o[pk.ans] !== way) say('that is ' + way + ', not ' + o[pk.ans]);
      } else if (pk.chance) {
        if (!(pc && pc.parts)) say('a choice about chance has no spinner to check it by');
      } else say('a choice with nothing to check it by: ' + o.join(', '));
    }
    /* 5b. a remainder story: the last answer rounds the quotient up (leftovers need their own group) or drops the leftovers */
    if (it.rem) {
      const r = filled.map(x => norm(x).match(/^(\d+) \/ (\d+) = (\d+) R (\d+)$/)).filter(Boolean)[0], last = (it.a || []).slice(-1)[0];
      if (!r) say('a remainder story has no "R" sum');
      else {
        const q = +r[3], want = it.rem === 'up' && +r[4] > 0 ? q + 1 : q;
        if (last !== want) say('rounding ' + it.rem + ' from ' + r[3] + ' R ' + r[4] + ' gives ' + want + ', not ' + last);
        [+r[1], +r[2]].forEach(n => { if (nums(it.q).indexOf(n) < 0) say('the sum uses ' + n + ', which is not in the story'); });
      }
    }
    /* 5c. place value: the value of a digit, the biggest or smallest number from some digits,
       and shading a grid */
    if (it.dv) {
      const digits = String(it.dv.n).replace(/\D/g, ''), at = digits.indexOf(String(it.dv.d));
      if (at < 0 || digits.indexOf(String(it.dv.d), at + 1) >= 0) say('the digit ' + it.dv.d + ' is not in ' + it.dv.n + ' exactly once');
      else if ((it.a || [])[0] !== it.dv.d * Math.pow(10, digits.length - 1 - at)) say('the ' + it.dv.d + ' in ' + it.dv.n + ' is worth ' + it.dv.d * Math.pow(10, digits.length - 1 - at));
    }
    if (it.big || it.small) {
      const d = (it.big || it.small).slice().sort((x, y) => (it.big ? y - x : x - y));
      if (it.small && d[0] === 0) { const k = d.findIndex(x => x > 0); d.unshift(d.splice(k, 1)[0]); }
      if ((it.a || [])[0] !== +d.join('')) say('the ' + (it.big ? 'biggest' : 'smallest') + ' number from those digits is ' + d.join(''));
    }
    /* growing patterns: figure n has m × n + b tiles, from the picture or from the first terms (seq) */
    let gr = pc && pc.m != null ? pc : null;
    if (it.seq) {
      const m = it.seq[1] - it.seq[0];
      if (it.seq.some((x, i) => i && x - it.seq[i - 1] !== m)) say('the terms ' + it.seq.join(', ') + ' do not grow by the same step');
      gr = { m: m, b: it.seq[0] - m };
      if (it.q && it.seq.some(x => nums(it.q).indexOf(x) < 0)) say('the terms ' + it.seq.join(', ') + ' are not in the question');
    }
    if ((it.fig || it.rule) && !gr) say('a pattern question has no picture or terms to check it by');
    if (gr && it.fig && !same(num(ansAll[ansAll.length - 1]), gr.m * it.fig + gr.b)) say('figure ' + it.fig + ' has ' + (gr.m * it.fig + gr.b) + ', not ' + ansAll[ansAll.length - 1]);
    if (gr && it.rule && (ansAll[0] !== gr.m || ansAll[1] !== gr.b)) say('the rule is ' + gr.m + ' × n + ' + gr.b + ', not ' + ansAll[0] + ' × n + ' + ansAll[1]);
    /* algebra: put a number in for the letter. expr is worked out for n; solve is an equation the answer must make true;
       ineq is an inequality the answer must make true, and with edge 'most' or 'least' the next whole number must not */
    const put = (e, v) => norm(e.replace(/(\d)\s*([a-z])\b/g, '$1 * ($2)').replace(/\b([a-z])\b/g, '(' + v + ')'));
    if (it.expr && !same(val(put(it.expr, it.n)), num(ansAll[ansAll.length - 1]))) say(it.expr + ' when the letter is ' + it.n + ' is ' + val(put(it.expr, it.n)) + ', not ' + ansAll[ansAll.length - 1]);
    if (it.solve && truth(put(it.solve, ansAll[ansAll.length - 1])) !== true) say(ansAll[ansAll.length - 1] + ' does not solve ' + it.solve);
    if (it.ineq) {
      const v = num(ansAll[ansAll.length - 1]);
      if (truth(put(it.ineq, v)) !== true) say(v + ' does not make ' + it.ineq + ' true');
      if (it.edge && truth(put(it.ineq, it.edge === 'most' ? v + 1 : v - 1)) !== false) say(v + ' is not the ' + (it.edge === 'most' ? 'greatest' : 'least') + ' whole number that makes ' + it.ineq + ' true');
    }
    /* data: a statistic of the data (from the item, which must be in its question, or from the picture), the relative
       frequency of one count, and how many times as tall one bar looks when the scale does not start at 0 */
    const data = it.data || (pc && pc.data), last = num(ansAll[ansAll.length - 1]);
    if (it.bins && it.q) it.bins.forEach(n => { if (nums(it.q).indexOf(n) < 0) say('the data value ' + n + ' is not in the question'); });
    if (it.data && it.q) it.data.forEach(n => { if (nums(it.q).indexOf(n) < 0) say('the data value ' + n + ' is not in the question'); });
    if (it.stat) {
      const d = (data || []).slice().sort((x, y) => x - y), n = d.length, cnt = {};
      d.forEach(v => { cnt[v] = (cnt[v] || 0) + 1; });
      const most = Math.max(...Object.values(cnt)), modes = Object.keys(cnt).filter(k => cnt[k] === most).map(Number);
      const all = { mean: d.reduce((x, y) => x + y, 0) / n, median: n % 2 ? d[(n - 1) / 2] : (d[n / 2 - 1] + d[n / 2]) / 2, range: d[n - 1] - d[0], least: d[0], greatest: d[n - 1], count: n, mode: modes.length === 1 && most > 1 ? modes[0] : NaN };
      /* stat is one statistic or a list, answered in order by the last answers */
      const asked = [].concat(it.stat), got = ansAll.slice(-asked.length);
      if (!n) say('a statistic with no data');
      else asked.forEach((st, i) => {
        if (isNaN(all[st])) say('the data has no single ' + st);
        else if (!same(all[st], num(got[i]))) say('the ' + st + ' is ' + all[st] + ', not ' + got[i]);
      });
    }
    if (it.rel != null && data) {
      /* rel is one row of the data or a list of rows, answered in order by the last answers */
      const rows = [].concat(it.rel), got = ansAll.slice(-rows.length), t = data.reduce((x, y) => x + y, 0);
      rows.forEach((r, i) => { if (!same(data[r] / t, num(got[i]))) say('the relative frequency is ' + data[r] + ' out of ' + t + ', not ' + got[i]); });
    }
    if (it.looks && pc && pc.sets) {
      const v = pc.sets[0], r = (v[it.looks[0]] - pc.min) / (v[it.looks[1]] - pc.min);
      if (!same(r, last)) say('that bar looks ' + r + ' times as tall, not ' + ansAll[ansAll.length - 1]);
    }
    /* shapes: an angle left as "?" in a triangle, a view of stacks, a point read from a grid, and a point moved by a
       slide or a flip (over the line x = k or y = k) */
    if (pc && pc.ask != null && pc.angles && !same(Math.round(pc.angles[pc.ask]), last)) say('the missing angle is ' + Math.round(pc.angles[pc.ask]) + '°, not ' + ansAll[ansAll.length - 1]);
    if (it.view && pc && pc.views) {
      /* view is 'front', 'side' or a list of both, answered in order */
      const want = [].concat(it.view).flatMap(v => pc.views[v]);
      if (ansAll.join() !== want.join()) say('the ' + [].concat(it.view).join(' and ') + ' view' + (Array.isArray(it.view) ? 's are ' : ' is ') + want.join(', ') + ', not ' + ansAll.join(', '));
    }
    const at = q => (typeof q === 'string' ? pc && pc.pts && pc.pts[q] : q);
    if (it.corners) { const sh = it.pic && it.pic[1].shape; if (!sh || rights(sh) !== last) say('the shape has ' + (sh ? rights(sh) : '?') + ' right angles, not ' + ansAll[ansAll.length - 1]); }
    if (it.pt) { const q = at(it.pt); if (!q || ansAll.slice(-2).join() !== q.join()) say('point ' + it.pt + ' is at (' + (q || []).join(', ') + '), not (' + ansAll.slice(-2).join(', ') + ')'); }
    if (it.move) {
      /* turn: { deg: 90 | 180 | 270, dir: 'cw' | 'ccw' } about (0, 0): a quarter turn clockwise takes (x, y) to (y, −x) */
      const turn = (q, t) => { let r = [q[0], q[1]]; const k = ((t.dir === 'ccw' ? 360 - t.deg : t.deg) / 90) % 4; for (let i = 0; i < k; i++) r = [r[1], -r[0]]; return r.map(v => v + 0); };
      const q = at(it.move.pt), m = it.move, to = !q ? null : m.turn ? turn(q, m.turn) : m.slide ? [q[0] + m.slide[0], q[1] + m.slide[1]] : m.flip.x != null ? [2 * m.flip.x - q[0], q[1]] : [q[0], 2 * m.flip.y - q[1]];
      if (!to || ansAll.slice(-2).map(num).join() !== to.join()) say('the point moves to (' + (to || []).join(', ') + '), not (' + ansAll.slice(-2).join(', ') + ')');
      if (m.slide && m.slide.some(v => v && nums(it.q).indexOf(Math.abs(v)) < 0)) say('the slide ' + m.slide.join(', ') + ' is not in the question');
      if (m.flip && nums(it.q).indexOf(Math.abs(m.flip.x != null ? m.flip.x : m.flip.y)) < 0) say('the flip line is not in the question');
      if (m.turn && (nums(it.q).indexOf(m.turn.deg) < 0 || !new RegExp(m.turn.dir === 'cw' ? '(^|[^r])clockwise' : 'counterclockwise').test(it.q))) say('the turn ' + m.turn.deg + '° ' + m.turn.dir + ' is not in the question');
    }
    /* probability on a spinner of equal parts: ways it can happen ÷ all the parts; with trials, how many to expect */
    const parts = pc && pc.parts, chance = l => parts.filter(x => x === l).length / parts.length;
    if (it.prob && parts) {
      /* prob is one label or a list, answered in order by the last answers */
      const labs = [].concat(it.prob), got = ansAll.slice(-labs.length);
      labs.forEach((l, i) => {
        const want = chance(l) * (it.trials || 1);
        if (!same(want, num(got[i]))) say((it.trials ? 'in ' + it.trials + ' spins expect ' + want + ' ' + l : 'the probability of ' + l + ' is ' + want) + ', not ' + got[i]);
      });
      if (it.trials && nums(it.q).indexOf(it.trials) < 0) say('the number of spins ' + it.trials + ' is not in the question');
    }
    if (pk && pk.chance && parts) {
      const c = chance(pk.chance), w = c === 0 ? 'impossible' : c === 1 ? 'certain' : c === 0.5 ? 'equally likely' : c < 0.5 ? 'unlikely' : 'likely';
      if (o2(pk) !== w) say('landing on ' + pk.chance + ' is ' + w + ', not ' + o2(pk));
    }
    /* a fraction in simplest form: its top and bottom share no factor */
    if (it.simplest) (it.a || []).filter(v => /\//.test(v)).forEach(v => { const [n, d] = String(v).split(' ').pop().split('/').map(Number); for (let f = 2; f <= Math.min(n, d); f++) if (n % f === 0 && d % f === 0) say(v + ' is not in simplest form'); });
    /* a shape pattern: the shapes to draw next carry on its core */
    if (it.pic && it.pic[0] === 'pat' && it.pic[1].next) {
      const p = it.pic[1], per = [...Array(p.seq.length).keys()].map(k => k + 1).find(k => p.seq.split('').every((ch, i) => ch === p.seq[i % k]));
      const c = p.seq.slice(0, per);
      if (p.core && p.core !== per) say('the core of ' + p.seq + ' is ' + per + ' long, not ' + p.core);
      if (p.next.split('').some((ch, i) => ch !== c[(p.seq.length + i) % per])) say('the next shapes ' + p.next + ' do not carry on the core ' + c);
    }
    const ask = it.pic && it.pic[0] === 'grid' && it.pic[1].ask;
    if (ask && !nums(it.q).some(x => same(x, ask * num(it.pic[1].unit || 1)))) say('shading ' + ask + ' squares does not show the number asked for');
    if (pc && pc.draw != null && !nums(it.q).some(x => same(x, pc.draw))) say('the picture is drawn at ' + pc.draw + ', which the question does not ask for');
    /* number sense: all the factors of a number (in any order), the least common multiple, and like terms (both sides
       of each row come out the same whatever number the letter is) */
    if (it.factors) {
      const want = [...Array(it.factors).keys()].map(k => k + 1).filter(k => it.factors % k === 0);
      if (ansAll.map(num).sort((x, y) => x - y).join() !== want.join()) say('the factors of ' + it.factors + ' are ' + want.join(', ') + ', not ' + ansAll.join(', '));
    }
    /* crossing lines: each row "a = []°" is the angle under that label */
    if (pc && pc.cross) filled.forEach(row => {
      const m = row.match(/^([a-z]) = (\d+)°?$/);
      if (!m || pc.cross[m[1]] == null) say('cannot read the angle: ' + row); else if (pc.cross[m[1]] !== +m[2]) say('angle ' + m[1] + ' is ' + pc.cross[m[1]] + '°, not ' + m[2] + '°');
    });
    /* data sorted into intervals: each row "140 to 145: []" counts the values from its start up to (not including) its end */
    if (it.bins) filled.forEach(row => {
      const m = row.match(/^(\d+(?:\.\d+)?) to (\d+(?:\.\d+)?): (\d+)$/);
      if (!m) say('cannot read the interval: ' + row);
      else { const k = it.bins.filter(v => v >= +m[1] && v < +m[2]).length; if (k !== +m[3]) say(k + ' values are from ' + m[1] + ' up to ' + m[2] + ', not ' + m[3]); }
    });
    if (it.pf && ansAll.some(v => !isPrime(num(v)))) say('every factor in a prime factorization must be prime: ' + ansAll.join(', '));
    if (it.lcm && it.lcm.reduce((x, y) => x * y / gcd(x, y)) !== num(ansAll[ansAll.length - 1])) say('the least common multiple of ' + it.lcm.join(' and ') + ' is ' + it.lcm.reduce((x, y) => x * y / gcd(x, y)) + ', not ' + ansAll[ansAll.length - 1]);
    if (it.ident) filled.forEach(row => {
      const sides = row.split('=');
      if (sides.length !== 2) { say('cannot read the terms: ' + row); return; }
      [2, 7].forEach(v => { const l = val(put(sides[0], v)), r = val(put(sides[1], v)); if (isNaN(l) || isNaN(r) || !same(l, r)) say('the two sides of ' + row + ' are not the same when the letter is ' + v); });
    });
    /* a shape's properties: "[] lines of symmetry", "order []" (rotational symmetry), "[] pairs of parallel sides", "[] right angles" */
    if (it.quad) filled.forEach(row => {
      const q = QUAD[it.quad], m = row.match(/^(\d+) lines? of symmetry$/) || row.match(/^order (\d+)$/) || row.match(/^(\d+) pairs? of parallel sides$/) || row.match(/^(\d+) right angles?$/);
      const k = /symmetry/.test(row) ? 'sym' : /^order/.test(row) ? 'rot' : /parallel/.test(row) ? 'par' : 'right';
      if (!q || !m) say('cannot read the property: ' + row); else if (q[k] !== +m[1]) say('a ' + it.quad + ' has ' + q[k] + ' (' + k + '), not ' + row);
    });
    /* two independent events on two spinners in a row: the outcomes are every pair, and the chance of both is the product */
    if ((it.two || it.outcomes) && it.pic && it.pic[0] === 'row') {
      const sp = it.pic[1].list.map(q => q[1].parts);
      if (it.outcomes && sp[0].length * sp[1].length !== num(ansAll[0])) say('the two spinners give ' + sp[0].length * sp[1].length + ' outcomes, not ' + ansAll[0]);
      if (it.two) { const want = sp[0].filter(x => it.two[0].indexOf(x) >= 0).length / sp[0].length * sp[1].filter(x => it.two[1].indexOf(x) >= 0).length / sp[1].length; if (!same(want, num(last))) say('the chance of both is ' + want + ', not ' + ansAll[ansAll.length - 1]); }
    } else if (it.two || it.outcomes) say('a two-event question has no two spinners');
    /* 6. open questions need an example answer on the key */
    if (it.draw && !it.draw.key) say('a drawing question has no example on the key');
    if (it.lines && !it.lines.key) say('a written question has no example on the key');
    if (!it.eq && !pk && !it.draw && !it.lines && !(pc && pc.own) && !ask && !(it.pic && it.pic[0] === 'pat' && it.pic[1].next)) say('a question with nothing to answer');
    return bad;
  };
})();
