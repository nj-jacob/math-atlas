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
  const PLACE = { 'ten thousand': 10000, thousand: 1000, hundred: 100, ten: 10, one: 1, tenth: 0.1, hundredth: 0.01 };
  /* a row with two or more different metric units (3.5 m = 350 cm, 1 kg 200 g = 1200 g) is put into one unit per kind:
     every amount becomes its number times the unit's size in metres, grams or litres */
  const MU = { mm: 0.001, cm: 0.01, m: 1, km: 1000, mg: 0.001, g: 1, kg: 1000, mL: 0.001, L: 1 };
  /* units of time work the same way, in seconds (1 h 15 min = 75 min) */
  const TU = { s: 1, min: 60, h: 3600, day: 86400, days: 86400, week: 604800, weeks: 604800 };
  /* Grade 8 prefixes on metres, grams, seconds, watts and bytes (tera 10¹² down to pico 10⁻¹²) */
  const PU = {};
  [['T', 12], ['G', 9], ['M', 6], ['k', 3], ['m', -3], ['µ', -6], ['n', -9], ['p', -12]].forEach(([p, e]) => ['m', 'g', 's', 'W', 'B'].forEach(u => { if (!MU[p + u] && !TU[p + u]) PU[p + u] = '10 ** ' + e; }));
  ['W', 'B'].forEach(u => { PU[u] = 1; });
  function metric(s) {
    const re = /(\d+(?:\.\d+)?) ?(Tm|Gm|Mm|µm|nm|pm|Tg|Gg|Mg|µg|ng|pg|Ts|Gs|Ms|ks|ms|µs|ns|ps|TW|GW|MW|kW|mW|µW|nW|pW|TB|GB|MB|kB|W|B|mm|min|mL|mg|cm|km|kg|m|g|L|h|s|days?|weeks?)(?![\w²³])/g;
    if (new Set([...s.matchAll(re)].map(m => m[2])).size < 2) return s;
    return s.replace(re, (m, n, u) => '(' + n + ' * ' + (MU[u] || TU[u] || PU[u]) + ')').replace(/\) \(/g, ') + (');
  }
  /* Grade 8 maths: 10⁵ and 1.05^3 are powers, √49 a square root, "25% of 80" is 25 / 100 × 80, π is 3.14 */
  const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  /* √( ... ): the root of everything up to the matching bracket */
  function rootGroups(s) {
    let i;
    while ((i = s.indexOf('√(')) >= 0) {
      let d = 0, j = i + 1;
      for (; j < s.length; j++) { if (s[j] === '(') d++; else if (s[j] === ')' && --d === 0) break; }
      s = s.slice(0, i) + '(' + s.slice(i + 1, j + 1) + ' ** 0.5)' + s.slice(j + 1);
    }
    return s;
  }
  /* a bracket raised to a power, (−4)², is wrapped whole so a minus in front of it cannot reach the ** (JavaScript refuses −a ** 2) */
  function bracketPowers(s) {
    let i = s.indexOf(') ** ');
    while (i >= 0) {
      let d = 0, a = i;
      do { d += s[a] === ')' ? 1 : s[a] === '(' ? -1 : 0; a--; } while (d > 0 && a >= 0);
      const e = s.slice(i + 5).match(/^-?[\d.]+/)[0], b = i + 5 + e.length;
      s = s.slice(0, a + 1) + '(' + s.slice(a + 1, b) + ')' + s.slice(b);
      i = s.indexOf(') ** ', i + 7);
    }
    return s;
  }
  function powers(s) {
    return bracketPowers(rootGroups(s.replace(/(\d)(?=√)/g, '$1 × ')).replace(/% of /g, ' / 100 * ').replace(/(\d)(?=[√π])/g, '$1 × ').replace(/π/g, '(' + Math.PI + ')')
      .replace(/√(\d+(?:\.\d+)?)/g, '(($1) ** 0.5)')
      .replace(/(\d+(?:\.\d+)?|\))(⁻?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (m, b, e) => (b === ')' ? ')' : '((' + b + ')') + ' ** ' + e.replace('⁻', '-').split('').map(c => (c === '-' ? c : SUPS.indexOf(c))).join('') + (b === ')' ? '' : ')'))
      .replace(/(\d+(?:\.\d+)?)\^(-?\d+)/g, '(($1) ** $2)')
      .replace(/(\d|\)) (tera|giga|mega|kilo|milli|micro|nano|pico)[a-z]*/g, (m, b, pre) => b + ' * 10 ** ' + PRE[pre]));
  }
  const PRE = { tera: 12, giga: 9, mega: 6, kilo: 3, milli: -3, micro: -6, nano: -9, pico: -12 };
  /* scientific notation: "4.7 × 10⁶" with a first part from 1 to less than 10 */
  const sciForm = x => { const m = String(x).match(/^(\d+(?:\.\d+)?) × 10[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+$/); return !!m && +m[1] >= 1 && +m[1] < 10; };
  /* 12 500 and 0.000 52 written without their spaces */
  const digits = s => String(s).replace(/\.\d+(?:[\u00a0 ]\d+)+/g, m => m.replace(/[\u00a0 ]/g, '')).replace(/(\d)[\u00a0 ](?=\d{3}\b)/g, '$1');
  function norm(s) {
    return metric(powers(digits(s)))
      .replace(/(^|[^\d.\/])(\d+) (\d+)\/(\d+)/g, (m, pre, w, n, d) => pre + '(' + w + ' + ' + n + '/' + d + ')')
      .replace(/(^|[^\d.(])(\d+)\/(\d+)(?![\d.])/g, '$1($2/$3)')
      .replace(/(\d+) (ten thousand|thousand|hundredth|hundred|tenth|ten|one)s?\b/g, (m, n, pl) => '(' + n + ' * ' + PLACE[pl] + ') +')
      .replace(/\$/g, '').replace(/ ?%/g, ' / 100').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\b(groups|rows|jumps) of\b/g, '*')
      .replace(/ R (?=\d)/g, ' ~ ').replace(/\.(?!\d)|(?<!\d)\./g, ' ')
      .replace(/[A-Za-z’'?:²³°¢]+/g, ' ').replace(/~/g, 'R').replace(/\+\s*(?=[=<>)]|$)/g, '').replace(/\s+/g, ' ').trim();
  }
  const nums = s => (digits(s).match(/\d+(\.\d+)?/g) || []).map(Number);
  /* two values are the same when they differ only by rounding (0.1 + 0.2 and 0.3) */
  const same = (x, y) => Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));
  /* the value of a number as a sheet writes it: 12 500, 3.75, $4.50 */
  const num = s => { const v = Number(String(s).replace(/\u00a0|\s/g, '').replace(/^\$/, '')); return isNaN(v) ? val(norm(s)) : v; };
  /* a number written in words, such as "three hundred forty-two", or NaN */
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  function fromWords(w) {
    let n = 0, part = 0;
    for (const t of String(w).toLowerCase().replace(/-/g, ' ').split(/\s+/).filter(Boolean)) {
      if (ONES.indexOf(t) >= 0) part += ONES.indexOf(t);
      else if (TENS.indexOf(t) >= 2) part += 10 * TENS.indexOf(t);
      else if (t === 'hundred') part *= 100;
      else if (t === 'thousand') { n += part * 1000; part = 0; }
      else if (t !== 'and') return NaN;
    }
    return n + part;
  }
  /* a number in words, written the Canadian school way: 342 is "three hundred forty-two" */
  function toWords(n) {
    if (n === 1000) return 'one thousand';
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
     Grade 1 code moves by direction instead: "right 2, up 1" or "right, right, up" (the robot does not turn);
     "repeat N:" repeats the rest of the code. Returns the square [column, row] where it stops, or null when unreadable */
  function robot(start, code) {
    const D = ['>', 'v', '<', '^'], step = { '>': [1, 0], 'v': [0, 1], '<': [-1, 0], '^': [0, -1] };
    let x = start[0], y = start[1], d = D.indexOf(start[2]);
    const run = list => {
      for (let i = 0; i < list.length; i++) {
        const c = list[i].trim();
        if (!c) continue;
        const rep = c.match(/^repeat (\d+)(?: times)?:\s*(.*)$/), mv = c.match(/^move (\d+)$/), go = c.match(/^(up|down|left|right)(?: (\d+))?$/);
        if (rep) { const body = [rep[2]].concat(list.slice(i + 1)); for (let k = 0; k < +rep[1]; k++) if (!run(body)) return false; return true; }
        if (mv) { x += step[D[d]][0] * +mv[1]; y += step[D[d]][1] * +mv[1]; }
        else if (go) { const g = step[{ up: '^', down: 'v', left: '<', right: '>' }[go[1]]]; x += g[0] * +(go[2] || 1); y += g[1] * +(go[2] || 1); }
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
  const SOLID_BY = { cube: 'cube', pyramid: 'pyramid', 'rectangular prism': 'prism', 'triangular prism': 'tri', 'square-based pyramid': 'pyramid', 'triangular pyramid': 'tpyr', cylinder: 'cylinder', cone: 'cone', sphere: 'sphere' };
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
  /* chance words: compare the count of one colour (k) with all of them (n) */
  const chanceWord = (k, n) => (k === 0 ? 'impossible' : k === n ? 'certain' : 2 * k < n ? 'unlikely' : 2 * k === n ? 'equally likely' : 'likely');
  /* kinds of data: a survey question with number answers starts "How many", "How far" ...; the way data is collected */
  const QUANT = /^how (many|much|far|long|tall|old|heavy|fast|high)\b/i;
  const COLLECT = { interview: /\bask/, observation: /\bwatch|\blook at|\bcount the .* (pass|go by|in the)/, experiment: /\btest|\btry|\bdrop|\broll|\btoss|\bflip|\bbounce/ };
  /* mean or mode: the words that ask for one */
  const STAT = { mean: /fair|share|even(ly| out)|level|same number/, mode: /most (common|often|popular)|appears most|shows up most/ };
  /* how many right angles a shape's corners make: at each corner the two sides meet square on */
  /* square corners: the sides meet at a right angle, and the corner points out (an L shape's inside corner does not count) */
  const turnOf = sh => Math.sign(sh.reduce((t, p, i) => { const q = sh[(i + 1) % sh.length]; return t + p[0] * q[1] - q[0] * p[1]; }, 0));
  const rights = sh => sh.filter((p, i) => { const a = sh[(i + sh.length - 1) % sh.length], b = sh[(i + 1) % sh.length];
    return (a[0] - p[0]) * (b[0] - p[0]) + (a[1] - p[1]) * (b[1] - p[1]) === 0 && ((p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])) * turnOf(sh) > 0; }).length;
  /* a shape on a dot grid: its sides, corners, square corners, whether every side is the same length, and its lines of
     symmetry. A line of symmetry flips the shape onto itself: every side lands on a side. The lines tried are the ones
     through the middle of the corners: up and down, across, and the two diagonals */
  const sideSet = sh => sh.map((p, i) => [p, sh[(i + 1) % sh.length]].map(q => q.join(',')).sort().join(' ')).sort().join('|');
  const mirrorOf = (p, m) => (m.x != null ? [2 * m.x - p[0], p[1]] : m.y != null ? [p[0], 2 * m.y - p[1]] : m.d === 1 ? [p[1] + m.c, p[0] - m.c] : [m.c - p[1], m.c - p[0]]);
  const isMirror = (sh, m) => sideSet(sh.map(p => mirrorOf(p, m))) === sideSet(sh);
  function shapeFacts(sh) {
    const n = sh.length, mx = sh.reduce((t, p) => t + p[0], 0) / n, my = sh.reduce((t, p) => t + p[1], 0) / n;
    const len = sh.map((p, i) => { const q = sh[(i + 1) % n]; return (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2; });
    return { sides: n, corners: n, rights: rights(sh), eqAll: len.every(v => v === len[0]), lines: [{ x: mx }, { y: my }, { d: 1, c: mx - my }, { d: -1, c: mx + my }].filter(m => isMirror(sh, m)).length };
  }
  const POLY = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 8: 'octagon' };
  /* pattern blocks, measured in triangles: a hexagon is 6, a trapezoid 3, a rhombus 2 */
  const PB = { hexagon: 6, trapezoid: 3, rhombus: 2, triangle: 1 };
  const pbOf = r => String(r).replace(/(\d+) (hexagon|trapezoid|rhombus|triangle)(e?s)?\b/g, (m, n, k) => '(' + n + ' * ' + PB[k] + ')');
  /* where things are on a map: a mark is left of another in the same row, above another in the same column, and between two
     in the same row or column */
  function placed(m, label, rel, ref) {
    const at = l => (m.marks || []).find(k => k[2] === l), a = at(label), r = ref.map(at);
    if (!a || r.some(x => !x)) return null;
    const [b, c] = r;
    if (rel === 'left of') return a[1] === b[1] && a[0] < b[0];
    if (rel === 'right of') return a[1] === b[1] && a[0] > b[0];
    if (rel === 'above') return a[0] === b[0] && a[1] < b[1];
    if (rel === 'below') return a[0] === b[0] && a[1] > b[1];
    if (rel === 'between') return (a[1] === b[1] && b[1] === c[1] && (a[0] - b[0]) * (a[0] - c[0]) < 0) || (a[0] === b[0] && b[0] === c[0] && (a[1] - b[1]) * (a[1] - c[1]) < 0);
    return null;
  }
  /* the job a number does: counts how many, puts in order, names, or measures */
  const JOB = { 'pages in a book': 'counts', 'children in a gym': 'counts', 'apples in a box': 'counts', 'cars in a lot': 'counts', 'stickers on a page': 'counts',
    'the 100th day of school': 'orders', 'the 3rd in line': 'orders', 'the 25th of May': 'orders', 'floor 12 of a building': 'orders', 'the 2nd place runner': 'orders',
    'bus number 120': 'names', 'room 114': 'names', 'jersey number 17': 'names', 'house number 186': 'names', 'phone number 905': 'names',
    'a plant 35 cm tall': 'measures', 'a ribbon 60 cm long': 'measures', 'a 5 m rope': 'measures', 'a 30 minute show': 'measures', 'a pool 25 m long': 'measures' };
  /* fraction words: the number of equal parts in a whole */
  const FW = { half: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, eighth: 8, tenth: 10, whole: 1 };
  /* Canadian coins by name, in cents */
  /* "3 fourths", "one half": a number (in digits or words) and a fraction word become (3 / 4) */
  const fwOf = r => String(r).replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)(?= (halves|half|thirds?|fourths?|fifths?|sixths?|eighths?|tenths?|wholes?)\b)/gi, w => ONES.indexOf(w.toLowerCase()))
    .replace(/\ban? (half|third|fourth|sixth|whole)\b/g, '1 $1')
    .replace(/(\d+) (halves|half|thirds?|fourths?|fifths?|sixths?|eighths?|tenths?|wholes?)\b/g, (m, n, k) => '(' + n + ' / ' + FW[k.replace(/s$/, '').replace('halve', 'half')] + ')');
  const CENTS = { nickel: 5, dime: 10, quarter: 25, loonie: 100, toonie: 200 };
  /* "3 quarters" is (3 * 25) cents, and "2 $20 bills" is (2 * 20) dollars */
  const coinOf = r => String(r).replace(/(\d+) (nickel|dime|quarter|loonie|toonie)s?\b/g, (m, n, k) => '(' + n + ' * ' + CENTS[k] + ')').replace(/(\d+) \$(\d+) bills?\b/g, '($1 * $2)');
  /* the shape names a repeating pattern uses */
  const SHAPES = { c: 'circle', s: 'square', t: 'triangle', d: 'diamond', C: 'circle', S: 'square' };
  /* What each picture shows, by its name: { total, pair, counts, share } for the "picture matches the sum" check, and
     own(o, answers) for a picture with its own write-on lines (it takes the first answers): a list of problems.
     Picture files add their own readers here (sheet-pics.js below; sheet-pics-upper.js after it). */
  /* a linear pattern from [figure, term] pairs: { m: the rate, b: the term at figure 0 }, or nothing when the points are not on one line */
  const lin = r => { const q = r.filter(x => typeof x[0] === 'number' && typeof x[1] === 'number'); if (q.length < 2 || q[1][0] === q[0][0]) return {}; const m = (q[1][1] - q[0][1]) / (q[1][0] - q[0][0]); return q.every(x => Math.abs(x[1] - q[0][1] - m * (x[0] - q[0][0])) < 1e-9) ? { m: m, b: q[0][1] - m * q[0][0] } : {}; };
  /* Grade 1: sides of flat shapes, folds, places on a shelf, the calendar, seasons, and what changes */
  const FLAT = { tri: 3, sq: 4, rect: 4, rhom: 4, pent: 5, hex: 6, circle: 0, oval: 0 };
  /* the flat shapes the faces of each 3D object trace */
  const FACES = { cube: ['square'], prism: ['rectangle', 'square'], tri: ['triangle', 'rectangle'], pyramid: ['square', 'triangle'], tpyr: ['triangle'], cylinder: ['circle'], cone: ['circle'], sphere: [] };
  const LIKE = { 'soup can': 'cylinder', drum: 'cylinder', 'paper towel roll': 'cylinder', ball: 'sphere', orange: 'sphere', marble: 'sphere', 'cereal box': 'prism', 'tissue box': 'prism', brick: 'prism',
    'number cube': 'cube', 'ice cube': 'cube', 'party hat': 'cone', 'traffic cone': 'cone', 'ice cream cone': 'cone' };
  const FLAT_NAME = { tri: 'triangle', sq: 'square', rect: 'rectangle', rhom: 'rhombus', pent: 'pentagon', hex: 'hexagon', circle: 'circle', oval: 'oval' };
  /* a fold line makes matching halves when every shaded square lands on a shaded square */
  const folds = o => o.cells.every(c => { const [x, y] = c.split(',').map(Number), m = o.line.x != null ? [2 * o.line.x - 1 - x, y] : [x, 2 * o.line.y - 1 - y]; return o.cells.indexOf(m.join()) >= 0; });
  /* what is above, below, left of or right of a thing on a shelf (rows top first); null when that cubby is empty or off the shelf */
  function shelfAt(rows, of, rel) {
    for (let i = 0; i < rows.length; i++) { const j = rows[i].indexOf(of); if (j < 0) continue;
      const [di, dj] = { above: [-1, 0], below: [1, 0], 'left of': [0, -1], 'right of': [0, 1] }[rel]; return ((rows[i + di] || [])[j + dj]) || null; }
    return null;
  }
  const WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  /* seasons in Canada by month, the way Grade 1 learns them: winter December to February, spring March to May, summer June to August, fall September to November */
  const seasonOf = m => ['winter', 'spring', 'summer', 'fall'][Math.floor(((MONTHS.indexOf(m) + 1) % 12) / 3)];
  /* things that change and things that always stay the same */
  const VARY = { changes: ['the weather', 'your height', 'how many people are at the park', 'the number of leaves on a tree', 'the time on a clock', 'how many apples are in the bowl', 'your age'],
    'stays the same': ['the number of days in a week', 'the number of wheels on a bike', 'the number of months in a year', 'the number of sides on a triangle', 'the number of fingers on one hand', 'the number of legs on a spider'] };
  /* what a question measures, from its words */
  const ATTR = { length: /\blong|\btall|\bwide|\bshort|\bhigh\b/, mass: /heav|weigh|light/, capacity: /\bhold|\bfill|\bpour/, area: /\bcover/ };
  /* Canadian money: coin names and bill colours */
  const COIN = { 5: 'nickel', 10: 'dime', 25: 'quarter', 100: 'loonie', 200: 'toonie' }, BILL = { 500: 'blue', 1000: 'purple', 2000: 'green', 5000: 'red' };
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
    /* coins in cents; a "$[]" answer reads the same coins and bills in dollars */
    coins: o => ({ total: o.list.reduce((x, y) => x + y, 0), dollars: o.list.reduce((x, y) => x + y, 0) / 100 }),
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
    plane: o => {
      const area = o.kind === 'tri' ? o.b * o.h / 2 : o.b * o.h, perim = o.kind === 'rect' ? 2 * (o.b + o.h) : o.kind === 'para' && o.s ? 2 * (o.b + o.s) : null;
      return { total: o.ask === 'perim' ? perim : area, perim: perim, pair: o.kind === 'tri' ? null : [o.b, o.h], data: [o.b, o.h].concat(o.s ? [o.s] : [], o.kind === 'tri' ? [2] : []) };
    },
    mix: o => ({ parts: [o.a * (o.g || 1), o.b * (o.g || 1)] }),
    disks: o => ({ total: o.list ? o.list.reduce((x, r) => x + r[0] * r[1], 0) : o.n }),
    grid: o => (o.unit && o.n ? { total: o.n * num(o.unit) } : null),
    /* Grade 8: an integer line gives where its jumps end; counters their value (zero pairs cancel); a tree its number of
       outcomes; a Venn diagram its counts; a scatter plot its points; parallel lines the angle marked "?" (the angles
       at even places match the given one when it is at an even place, the others make 180° with it); solids and
       circles their measures for story sums; a right triangle its missing side; an L shape its area and perimeter */
    iline: o => Object.assign({ data: [o.min, o.max] }, o.jumps && o.jumps.length ? { total: o.jumps[o.jumps.length - 1][0] + o.jumps[o.jumps.length - 1][1], data: o.jumps.flat().map(Math.abs) } : {}),
    chips: o => ({ total: o.pos - o.neg }),
    ptree: o => ({ total: o.a.length * o.b.length }),
    pvenn: o => ({ vn: o.n, data: o.n }),
    scat: o => Object.assign({ pts: o.pts }, lin(o.pts)),
    par: o => { const at = i => (i % 2 === o.give % 2 ? o.ang : 180 - o.ang); return Object.assign({ angAt: at, data: [o.ang, 180, 360] }, o.ask != null ? { total: at(o.ask) } : {}); },
    circ: o => ({ data: [o.r != null ? o.r : o.d, 2, 3.14] }),
    cyl: o => ({ data: [o.r, o.h, 2, 3.14] }),
    rbox: o => ({ data: [o.l, o.w, o.h, 2] }),
    tprism: o => ({ data: [o.b, o.h, o.l, 2] }),
    rtri: o => { if (o.a * o.a + o.b * o.b !== o.c * o.c && !same(o.a * o.a + o.b * o.b, o.c * o.c)) return { bad: o.a + ', ' + o.b + ', ' + o.c + ' is not a right triangle' }; const ks = { a: o.a, b: o.b, c: o.c }; const kn = Object.keys(ks).filter(k => k !== o.ask).map(k => ks[k]); return Object.assign({ data: kn }, o.ask ? { total: ks[o.ask] } : {}); },
    cgrid: o => Object.assign({ pts: Object.fromEntries((o.pts || []).map(q => [q[2], [q[0], q[1]]])) }, o.plot || o.keyShape ? { blanks: 0, own: () => [] } : {}),
    comp: o => (o.kind === 'L' ? { area: o.w * o.h - o.cw * o.ch, perim: 2 * (o.w + o.h), data: [o.w, o.h, o.cw, o.ch, o.h - o.ch, o.w - o.cw] } : { data: [o.w, o.h, o.w / 2, 2, 3.14] }),
    atiles: o => ({ tiles: o }),
    tbl: o => Object.assign({ data: o.rows.flat().filter(v => typeof v === 'number') }, lin(o.rows)),
    /* Grade 2: a shape on a dot grid; a hexagon of pattern blocks (each part 1, 2, 3 or 6 triangles, 6 in all); pattern
       blocks in a row; scattered dots to estimate; dots in pairs */
    geo: o => Object.assign({ shape: o.pts }, shapeFacts(o.pts)),
    hex: o => ({ total: o.parts.length, blanks: 0, own: o => (o.parts.reduce((x, y) => x + y, 0) !== 6 || o.parts.some(n => [1, 2, 3, 6].indexOf(n) < 0) ? ['the hexagon parts ' + o.parts.join(', ') + ' are not pattern blocks that fill it'] : []) }),
    pb: o => ({ total: o.list.length }),
    scatter: o => ({ total: o.t }),
    pairs: o => ({ total: o.n }),
    hund: () => null,
    twoway: o => ({ byCat: Object.fromEntries(o.rows.flatMap((rw, i) => o.cols.map((c, j) => [c + ' in ' + rw, o.vals[i][j]]))) }),
    /* Grade 1: a ten frame, flat shapes (one shape gives its sides), a fold line, a shelf, a calendar, strips */
    frame: o => ({ total: o.n + (o.b || 0) - (o.x || 0) }),
    flat: o => ({ sides: o.list.map(k => FLAT[k]), total: o.list.length === 1 ? FLAT[o.list[0]] : undefined }),
    fold: o => ({ fold: o }),
    shelf: o => ({ shelf: o.rows }),
    cal: o => ({ total: o.days, cal: o }),
    strips: o => ({ lens: Object.fromEntries(o.list.map(s => [s[0], s[1]])), total: o.list.length === 1 ? o.list[0][1] : undefined }),
    row: o => { const parts = o.list.map(p => (READ[p[0]] ? READ[p[0]](p[1]) : null) || {}); const n = parts.reduce((x, p) => x + (p.blanks || 0), 0);
      if (n) return { blanks: n, own: (o, a) => o.list.flatMap((p, i) => (parts[i].own ? parts[i].own(p[1], a.splice(0, parts[i].blanks)) : [])) };
      /* a row of fraction pictures with no labels (Grade 2's groups of halves) shows them all together */
      return !o.labels && parts.every(p => p.total != null) ? { total: parts.reduce((x, p) => x + p.total, 0) } : null; }
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
    iline: [{ min: -6, max: 6, lab: 2, pts: [[-4, 'A']], jumps: [[-4, 7], [3, -5]], ray: { at: 1, open: true, dir: 'right' } }], chips: [{ pos: 5, neg: 3, pairs: true }],
    ptree: [{ a: ['H', 'T'], b: ['1', '2', '3'], pa: ['1/2', '1/2'], pb: ['1/3', '1/3', '1/3'] }], pvenn: [{ a: 'Soccer', b: 'Music', n: [8, 5, 7, 4] }],
    scat: [{ pts: [[1, 2], [2, 3], [4, 5], [6, 6]], xmax: 8, ymax: 8, xs: 2, ys: 2, xl: 'Hours', yl: 'Score' }], par: [{ ang: 65, give: 0, ask: 6, letters: [[1, 'a']] }],
    circ: [{ r: 5, unit: 'cm' }], cyl: [{ r: 3, h: 10, unit: 'cm' }], rbox: [{ l: 8, w: 5, h: 3, unit: 'cm' }], tprism: [{ b: 6, h: 4, l: 10, unit: 'cm' }],
    rtri: [{ a: 8, b: 6, c: 10, ask: 'c' }], cgrid: [{ n: 5, pts: [[2, 3, 'A'], [-3, -1, 'B']], shape: [[1, 1], [3, 1], [1, 4]], plot: [[-2, 2, 'C']] }],
    comp: [{ kind: 'L', w: 10, h: 6, cw: 4, ch: 3, unit: 'm' }], atiles: [{ xp: 3, xn: 1, up: 2, un: 4 }], tbl: [{ head: ['Month', 'In', 'Out'], rows: [['Jan', 2400, 2250], ['Feb', 2400, 2600]] }],
    geo: [{ pts: [[1, 0], [3, 0], [4, 2], [2, 4], [0, 2]], cols: 5, rows: 4, mirror: { x: 2 }, sym: true }], hex: [{ parts: [3, 2, 1], blank: true }], pb: [{ list: ['hex', 'trap', 'rhom', 'tri'] }],
    scatter: [{ t: 47 }], pairs: [{ n: 13 }], hund: [{ from: 1, rows: 3, shade: [5, 10, 15], ask: [20, 25, 30] }], twoway: [{ rows: ['Gr 2', 'Gr 3'], cols: ['Walk', 'Ride'], vals: [[7, 4], [3, 6]] }],
    frame: [{ n: 6, b: 2, x: 3 }], flat: [{ list: ['tri', 'sq', 'rect', 'hex'], turn: 20, letters: true }], fold: [{ cols: 6, rows: 4, cells: ['1,1', '2,1', '3,1', '4,1'], line: { x: 3 } }],
    shelf: [{ rows: [['cup', 'book', ''], ['ball', 'hat', 'box']] }], cal: [{ month: 'November', start: 0, days: 30, marks: [11] }], strips: [{ list: [['A', 7, 0], ['B', 5, 2]], cubes: true }]
  };
  const o2 = pk => pk.opts[pk.ans];
  function picture(p) { return READ[p[0]] ? READ[p[0]](p[1]) : null; }
  /* it.look: { op: 'value' | 'total' | 'more', a: [categories], b: [categories], at }: the sum of a (or of everything for a
     total), or a take away b. at: which picture of a row. null when a category is not in the data */
  function dataVal(it) {
    /* a line plot is read as how many answers each number got */
    const p = it.look.at != null ? it.pic[1].list[it.look.at] : it.pic, pp = picture(p) || {};
    const d = pp.byCat || (p[0] === 'plot' ? Object.fromEntries(pp.list.map(v => [v, pp.list.filter(x => x === v).length])) : null);
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
    const byItem = !!(it.deal || it.fshare || it.find || it.shapeAsk || it.simp || it.bnd || it.at != null || it.sp || it.bag || it.vp || it.fewest || it.corners || it.dv || it.big || it.small || it.rem || it.fig || it.rule || it.expr || it.solve || it.ineq || it.stat || it.rel != null || it.prob || it.looks || (pc && pc.ask != null));
    filled.forEach((row, ri) => {
      const blanks = /\[\]/.test(raw[ri]);
      /* a row that names the categories of a graph or table ("Summer − Spring = 6", "in all = 30"): put their values in (not a "Red: 9/20" label) */
      if (pc && pc.byCat && !it.look && !/:/.test(row)) {
        const d = pc.byCat, re = new RegExp('\\b(' + Object.keys(d).sort((x, y) => y.length - x.length).join('|') + '|in all)\\b', 'g');
        if (re.test(row)) row = row.replace(re, m => (m === 'in all' ? '(' + Object.values(d).join(' + ') + ')' : d[m]));
      }
      /* pattern blocks are counted in triangles: "1 trapezoid = 3 triangles" */
      /* fraction words for Grade 2: "3 fourths" is 3/4 of a whole, "2 halves" is 1 whole */
      if (it.fw) row = fwOf(row);
      /* a share of several things (4 bars for 3 friends): every answer row together is the things over the sharers */
      if (it.fshare && blanks) { if (!same(val(norm(row)), it.fshare[0] / it.fshare[1])) say(it.fshare.join(' shared by ') + ' is not ' + row); return; }
      if (it.pb) row = pbOf(row);
      if (it.coins) row = coinOf(row);
      let worth;
      let est;
      let st;
      /* a row with a letter for a number (3n + 2 = [], n = []) is checked by its item's expr, solve, ineq or rule below */
      if ((it.expr || it.solve || it.ineq || it.rule || it.simp || it.bnd) && /(^|[\d\s(−\/])[a-z]\b/.test(row)) return;
      /* probability rows (P(red) = []) are checked by the item's sp, bag or vp below */
      if (it.sp || it.bag || it.vp) return;
      /* an angle named by a letter on parallel lines (a = [] °) is checked from the picture below */
      if (pc && pc.angAt && /^[a-z] = /.test(row)) return;
      /* Grade 2's symbols for a number ("▲ = 5"): put it in the item's sentence, which must then be true */
      if (it.letter && /^[▲●■★] = \S+$/.test(row)) { if (truth(it.letter.replace(/[▲●■★]/g, row.split(' = ')[1])) !== true) say('with ' + row + ', "' + it.letter + '" is not true'); return; }
      /* a spinner's rows (P(R) = [], R: about []) are checked by its item's prob below */
      if (it.prob || it.pt || it.move || it.view || it.left) return;
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
      } else if (it.find && /^at [A-J]\d+$/.test(row)) {
        /* where a mark is on a map with lettered columns and numbered rows (from the bottom) */
        const m = it.pic[1], k = (m.marks || []).find(x => x[2] === it.find), cell = k && 'ABCDEFGHIJ'[k[0]] + (m.rows - k[1]);
        if (row !== 'at ' + cell) say(it.find + ' is at ' + cell + ', not ' + row.slice(3));
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
      } else if (!it.cong && !/[×÷+−]/.test(row) && /\d ?(mm|cm|m|km)\b/.test(row) && !/(µm|nm|pm)\b|\^/.test(row) && / [<>=] /.test(row)) {
        /* lengths in units: "2 m 40 cm = 240 cm", "5 cm > 45 mm" */
        const m = row.split(/ ([<>=]) /), a = toMM(m[0]), b = toMM(m[2]);
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
        const n = nums(row);
        if (n.length !== 2 || !same(Math.round(n[0] / it.round) * it.round, n[1])) say(n[0] + ' to the nearest ' + it.round + ' is ' + Math.round(n[0] / it.round) * it.round + ', not ' + n[1]);
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
      } else if (it.is != null && !/[=<>]/.test(row)) {
        /* a row with no equals sign is the number the question gives (it.is), written another way */
        if (!same(val(norm(row)), num(it.is))) say(row + ' is not ' + it.is);
      } else if (/≈/.test(row)) {
        /* "√50 ≈ 7.1": the left side, rounded to as many decimal places as the right side has, is the right side */
        const sides = row.split('≈'), l = val(norm(sides[0])), r = String(sides[1]).trim(), dp = (r.split('.')[1] || '').replace(/\D.*$/, '').length;
        if (sides.length !== 2 || isNaN(l) || isNaN(num(r))) say('cannot read: ' + row);
        else if (!same(+l.toFixed(dp), num(r))) say(sides[0].trim() + ' is about ' + l.toFixed(dp) + ', not ' + r);
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
      } else if (/^\$?\[\]( [^\s\d\[\]=<>,]+)?$/.test(raw[ri].trim())) {
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
        } else if (it.words != null) { if (fromWords(it.words) !== v) say('"' + it.words + '" is ' + fromWords(it.words) + ', not ' + v); }
        else if (it.deal) { /* checked by the sharing check below */ }
        else if (it.fw && pc && pc.total != null) { if (!same(val(norm(row)), pc.total)) say('the picture shows ' + pc.total + ' of a whole, not ' + row); }
        else if (it.coreOf) {
          /* how many shapes in the core: the shortest part that repeats, and it must come round at least twice */
          const sq = it.coreOf, k = [...Array(sq.length).keys()].map(j => j + 1).find(j => [...sq].every((c, i) => c === sq[i % j]));
          if (2 * k > sq.length) say(sq + ' does not repeat its core twice'); else if (k !== v) say('the core of ' + sq + ' has ' + k + ' shapes, not ' + v);
        }
        else if (pc && pc.total != null && !it.calc) { if (!same(/^\$/.test(raw[ri].trim()) && pc.dollars != null ? pc.dollars : pc.total, num(v))) say('the picture shows ' + pc.total + ', not ' + v); else if (pc.name && /\//.test(v) && v !== pc.name) say('the picture shows ' + pc.name + ', not ' + v); }
        else if (!it.calc && !byItem) say('nothing checks the answer ' + v);
      } else if (blanks && it.fw && pc && pc.total != null) {
        /* "[] wholes + [] halves": the parts, put together, are what the picture shows */
        if (!same(val(norm(row)), pc.total)) say('the picture shows ' + pc.total + ' of a whole, not ' + row);
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
    /* (with fraction words, a part of the sum may show it: "3 fourths + [] fourths = 1 whole") */
    const shows = r => nums(r).indexOf(pc.total) >= 0 || norm(r).split('=').map(val).some(v => same(v, pc.total))
      || (it.fw && norm(fwOf(r)).split(/[=+]/).map(val).some(v => same(v, pc.total)));
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
      if (!same(it.dp != null ? +v.toFixed(it.dp) : v, av)) say('the story works out to ' + v + ', not ' + (it.a || [])[0]);
      /* a story may change units (× 10, 100, 1000 or a million) or take a percent from the whole (1 − 20%) without saying so;
         a circle story that says "π ≈ 3.14" may use 2 for the radius in d = 2r and C = 2 × π × r */
      const inQ = nums((it.fw ? fwOf(it.q) : it.q) + ' ' + (it.pic && it.pic[0] === 'code' ? it.pic[1].lines.join(' ') : '')).concat(pc && pc.data ? pc.data : [], pc && pc.min ? [pc.min] : [], [1, 10, 100, 1000, 1000000], /π ≈ 3\.14/.test(it.q) ? [2] : []);
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
        const c = chances, n = Object.values(c).reduce((x, y) => x + y, 0), k = c[pk.chanceOf.of] || 0;
        /* Grade 2 uses three words: impossible, possible and certain */
        const want = o.indexOf('possible') >= 0 ? (k === 0 ? 'impossible' : k === n ? 'certain' : 'possible') : chanceWord(k, n);
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
      } else if (!pk.size && !pk.attr && o.indexOf('mass') >= 0 && o.indexOf('capacity') >= 0) {
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
      } else if (pk.fold) {
        const want = folds(it.pic[1]);
        if (want !== yes) say('the fold line ' + (want ? 'makes' : 'does not make') + ' matching halves, but the key circles ' + o[pk.ans]);
      } else if (pk.repeats) {
        /* a pattern repeats when a core comes round at least twice in the picture */
        const sq = it.pic[1].seq, per = [...Array(sq.length).keys()].map(k => k + 1).find(k => [...sq].every((c, i) => c === sq[i % k])), want = !!per && 2 * per <= sq.length;
        if (want !== yes) say(sq + (want ? ' repeats' : ' does not repeat') + ', but the key circles ' + o[pk.ans]);
      } else if (pk.abc) {
        /* the pattern in letters: A for the first shape, B for the next new one ... */
        const seen = [], want = [...it.pic[1].seq].map(c => { if (seen.indexOf(c) < 0) seen.push(c); return 'ABCDEFG'[seen.indexOf(c)]; }).join(' ');
        if (o[pk.ans] !== want || o.filter(x => x === want).length !== 1) say(it.pic[1].seq + ' in letters is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.flat != null) {
        /* the name of a flat shape in the picture (by its place in the list) */
        const want = FLAT_NAME[it.pic[1].list[pk.flat]];
        if (o[pk.ans] !== want || o.filter(x => x === want).length !== 1) say('shape ' + (pk.flat + 1) + ' is a ' + want + ', not ' + o[pk.ans]);
      } else if (pk.sides != null) {
        /* the one lettered shape with this many sides */
        const sd = pc.sides, ok = o.map(x => sd[x.charCodeAt(0) - 65] === pk.sides);
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one shape has ' + pk.sides + ' sides: ' + o.join(', '));
      } else if (pk.solid != null) {
        /* the name of a pictured 3D object (by its place in the list) */
        const want = it.pic[1].list[pk.solid];
        if (SOLID_BY[o[pk.ans]] !== want || o.filter(x => SOLID_BY[x] === want).length !== 1) say('object ' + (pk.solid + 1) + ' is a ' + want + ', not ' + o[pk.ans]);
      } else if (pk.like) {
        /* the 3D object an everyday thing is shaped like */
        const want = LIKE[pk.like];
        if (!want || SOLID_BY[o[pk.ans]] !== want || o.filter(x => SOLID_BY[x] === want).length !== 1) say('a ' + pk.like + ' is shaped like a ' + want + ', not ' + o[pk.ans]);
      } else if (pk.face) {
        /* the flat shape a face of the object could trace: exactly one choice is one of its faces */
        const ok = o.map(x => (FACES[pk.face] || []).indexOf(x) >= 0);
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice is a face of a ' + pk.face + ': ' + o.join(', '));
      } else if (pk.reach) {
        /* the one code that takes the robot to the mark pk.reach */
        const m = it.pic[1], mark = (m.marks || []).find(k => k[2] === pk.reach), ok = o.map(c => { const e = robot(m.start, c); return !!e && !!mark && e[0] === mark[0] && e[1] === mark[1]; });
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one code reaches ' + pk.reach + ': ' + o.join(' / '));
      } else if (pk.pos) {
        const want = shelfAt(pc.shelf, pk.pos.of, pk.pos.rel);
        if (!want || o[pk.ans] !== want || o.filter(x => x === want).length !== 1) say('the thing ' + pk.pos.rel + ' the ' + pk.pos.of + ' is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.day != null) {
        /* the day of the week a date of the calendar falls on */
        const c = pc.cal, want = WEEK[(c.start + pk.day - 1) % 7];
        if (pk.day > c.days || o[pk.ans] !== want) say(c.month + ' ' + pk.day + ' is a ' + want + ', not ' + o[pk.ans]);
      } else if (pk.after) {
        /* the day or month n places after (or before, n < 0) another */
        const L = WEEK.indexOf(pk.after.from) >= 0 ? WEEK : MONTHS, want = L[(L.indexOf(pk.after.from) + pk.after.n + 84) % L.length];
        if (L.indexOf(pk.after.from) < 0 || o[pk.ans] !== want) say(pk.after.n + ' from ' + pk.after.from + ' is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.season) {
        if (o[pk.ans] !== seasonOf(pk.season)) say(pk.season + ' is in ' + seasonOf(pk.season) + ', not ' + o[pk.ans]);
      } else if (pk.vary) {
        /* a thing from the lists, or numbers (a list that never changes stays the same) */
        const want = Array.isArray(pk.vary) ? (pk.vary.every(x => x === pk.vary[0]) ? 'stays the same' : 'changes') : Object.keys(VARY).find(k => VARY[k].indexOf(pk.vary) >= 0);
        if (!want || o[pk.ans] !== want) say('"' + pk.vary + '" ' + want + ', not ' + o[pk.ans]);
      } else if (pk.attr) {
        const q = it.q.toLowerCase(), hit = Object.keys(ATTR).filter(k => ATTR[k].test(q));
        if (hit.length !== 1) say('cannot tell length, mass, capacity or area from: ' + it.q); else if (o[pk.ans] !== hit[0]) say('this is about ' + hit[0] + ', not ' + o[pk.ans]);
      } else if (pk.worth) {
        /* coins and bills by name: the one worth more (or less), or the one list in order from least to greatest */
        const cents = x => { const k = Object.keys(COIN).find(c => COIN[c] === x), b = String(x).match(/^\$(\d+) bill$/); return k ? +k : b ? 100 * b[1] : null; };
        if (pk.worth === 'order') {
          const ok = o.map(l => { const v = l.split(', ').map(cents); return v.every((c, i) => c !== null && (!i || c > v[i - 1])); });
          if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one list goes from least to greatest: ' + o.join(' / '));
        } else {
          const v = o.map(cents), best = pk.worth === 'more' ? Math.max(...v) : Math.min(...v);
          if (v.some(c => c === null) || v[pk.ans] !== best || v.filter(c => c === best).length !== 1) say('the one worth ' + pk.worth + ' is not ' + o[pk.ans]);
        }
      } else if (pk.coin != null) {
        /* a coin's name or a bill's colour */
        const want = COIN[pk.coin] || BILL[pk.coin];
        if (!want || o[pk.ans] !== want || o.filter(x => x === want).length !== 1) say('that money is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.cpi) {
        /* impossible, possible or certain, from the counts in the bag */
        const c = chances, n = Object.values(c).reduce((x, y) => x + y, 0), k = c[pk.cpi] || 0, want = k === 0 ? 'impossible' : k === n ? 'certain' : 'possible';
        if (o[pk.ans] !== want) say('getting ' + pk.cpi + ' is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.len) {
        /* the longest or shortest strip, by its own length (not where its end is) */
        const L = pc.lens, v = o.map(x => L[x]), best = pk.len === 'longest' ? Math.max(...v) : Math.min(...v);
        if (v.some(x => x === undefined) || v[pk.ans] !== best || v.filter(x => x === best).length !== 1) say('the ' + pk.len + ' strip is not only ' + o[pk.ans]);
      } else if (pk.pieces) {
        /* more sharers make smaller pieces: the biggest piece goes with the fewest sharers */
        const n = pk.pieces, want = pk.big === false ? n.indexOf(Math.max(...n)) : n.indexOf(Math.min(...n));
        if (pk.ans !== want) say('with ' + n.join(' and ') + ' sharers, the ' + (pk.big === false ? 'smaller' : 'bigger') + ' piece is ' + o[want]);
        n.forEach(x => { if (nums(it.q + ' ' + o.join(' ')).indexOf(x) < 0) say('the sharers ' + x + ' are not in the question'); });
      } else if (pk.half) {
        /* the fraction a picture shows, in words */
        const f = it.pic[1], want = f.n === 2 && f.k === 1 ? 'one half' : f.n === 4 && f.k === 1 ? 'one fourth' : f.n === 4 && f.k === 2 ? 'two fourths' : null;
        if (!want || o[pk.ans] !== want) say('the picture shows ' + want + ', not ' + o[pk.ans]);
      } else if (it.tf) {
        const t = truth(it.fw ? fwOf(it.tf) : it.pb ? pbOf(it.tf) : it.coins ? coinOf(it.tf) : it.tf);
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
      } else if (pk.parts) {
        /* the name of the equal parts a fraction picture is cut into */
        const n = it.pic && it.pic[0] === 'frac' ? it.pic[1].n : null, want = Object.keys(FW).find(k => FW[k] === n);
        if (!want || FW[String(o[pk.ans]).replace(/s$/, '').replace('halve', 'half')] !== n) say('the picture is cut into ' + (want || '?') + 's, not ' + o[pk.ans]);
      } else if (pk.shareCmp) {
        /* two sharing groups [things, sharers]: who gets more each, or the same */
        const [p, q] = pk.shareCmp, d = p[0] / p[1] - q[0] / q[1], want = Math.abs(d) < 1e-9 ? 2 : d > 0 ? 0 : 1;
        if (pk.ans !== want) say(p.join(' for ') + ' and ' + q.join(' for ') + ': the key circles ' + o[pk.ans] + ', not ' + o[want]);
        [].concat(p, q).forEach(n => { if (nums(fwOf(it.q)).indexOf(n) < 0) say('the sharing ' + n + ' is not in the question'); });
      } else if (pk.equal) {
        /* "Equal parts?" under a fraction picture: yes unless the picture is cut unevenly */
        const ev = !(it.pic && it.pic[0] === 'frac' && it.pic[1].uneven);
        if (o[pk.ans] !== (ev ? 'yes' : 'no')) say('the parts are ' + (ev ? '' : 'not ') + 'equal, but the key circles ' + o[pk.ans]);
      } else if (pk.nw != null) {
        const ok = o.map(x => num(x) === fromWords(pk.nw));
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice is ' + pk.nw);
      } else if (pk.wn != null) {
        const ok = o.map(x => fromWords(x) === pk.wn);
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice says ' + pk.wn + ' in words');
      } else if (pk.cmp) {
        /* equal when they agree to 12 significant figures, so 3.6 × 10⁻⁴ and 0.000 36 match despite rounding in powers */
        const x = num(pk.cmp[0]), y = num(pk.cmp[1]), same = Math.abs(x - y) <= 1e-12 * Math.max(Math.abs(x), Math.abs(y));
        const want = same ? '=' : x < y ? '<' : '>';
        if (o[pk.ans] !== want) say(pk.cmp.join(' and ') + ': the sign is ' + want + ', not ' + o[pk.ans]);
      } else if (pk.est) {
        const v = val(norm(pk.est)), d = o.map(x => Math.abs(val(norm(x)) - v));
        if (isNaN(v) || d.some((x, i) => i !== pk.ans && x <= d[pk.ans])) say('the circled estimate is not the closest to ' + pk.est + ': ' + o.join(', '));
        nums(pk.est).forEach(n => { if (nums(it.q).indexOf(n) < 0) say('the estimate uses ' + n + ', which is not in the question'); });
      } else if (pk.digit) {
        const worth = o.map(x => { const d = String(x).replace(/\D/g, ''), at = d.indexOf(String(pk.digit.d)); return at < 0 ? 0 : pk.digit.d * Math.pow(10, d.length - 1 - at); });
        if (worth[pk.ans] !== pk.digit.worth || worth.filter(v => v === pk.digit.worth).length !== 1) say('not exactly one choice has a ' + pk.digit.d + ' worth ' + pk.digit.worth);
      } else if (pk.round) {
        const rnd = (x, r) => same(Math.round(num(x) / r.to) * r.to, r.val);
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
        const ok = o.map(x => +x > pk.between[0] && +x < pk.between[1]);
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice is between ' + pk.between.join(' and '));
      } else if (pk.small) {
        const v = o.map(x => val(norm(it.fw ? fwOf(x) : x)));
        if (v.some(isNaN) || v.some((x, i) => i !== pk.ans && x <= v[pk.ans])) say('the circled choice is not the least: ' + o.join(', '));
      } else if (pk.big) {
        const v = o.map(x => (it.fw ? val(norm(fwOf(x))) : isNaN(val(norm(x))) ? fromWords(x) : val(norm(x))));
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
        const sh = it.pic && ((it.pic[0] === 'coord' && it.pic[1].shape) || (it.pic[0] === 'geo' && it.pic[1].pts)), m = it.pic && it.pic[1].mirror;
        if (!sh || (pk.sym && !m)) say('a shape choice has no shape' + (pk.sym ? ' or mirror line' : ''));
        else {
          const set = sh.map(p => p.join());
          const yes2 = pk.rect ? sh.length === 4 && rights(sh) === 4 : m.d ? isMirror(sh, m) : sh.every(p => set.includes((m.x != null ? [2 * m.x - p[0], p[1]] : [p[0], 2 * m.y - p[1]]).join()));
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
      } else if (pk.polyName) {
        /* a shape's name from its number of sides */
        const want = POLY[pc && pc.sides];
        if (!want || o[pk.ans] !== want || o.filter(x => x === want).length !== 1) say('a shape with ' + (pc && pc.sides) + ' sides is a ' + want + ', not ' + o[pk.ans]);
      } else if (pk.eqSides) {
        if (!pc || pc.eqAll === undefined) say('an equal-sides choice has no shape');
        else if (pc.eqAll !== yes) say('the sides are ' + (pc.eqAll ? '' : 'not ') + 'all equal, but the key circles ' + o[pk.ans]);
      } else if (pk.parity != null) {
        const want = pk.parity % 2 ? 'odd' : 'even';
        if (o[pk.ans] !== want) say(pk.parity + ' is ' + want + ', not ' + o[pk.ans]);
        if (pc && pc.total != null && pc.total !== pk.parity) say('the picture shows ' + pc.total + ', not ' + pk.parity);
      } else if (pk.where) {
        /* the one mark on the map that is left of, right of, above, below or between the others named */
        const ok = o.map(x => placed(it.pic[1], x, pk.where.rel, pk.where.ref));
        if (ok.some(x => x === null)) say('cannot find the marks ' + o.concat(pk.where.ref).join(', ') + ' on the map');
        else if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one mark is ' + pk.where.rel + ' ' + pk.where.ref.join(' and ') + ': ' + o.join(', '));
      } else if (pk.at) {
        /* the mark in a square of a grid map: columns A, B, C ... and rows 1, 2, 3 ... from the bottom */
        const m = it.pic[1], hit = (m.marks || []).find(k => 'ABCDEFGHIJ'[k[0]] + (m.rows - k[1]) === pk.at);
        if (!hit || o[pk.ans] !== hit[2] || o.filter(x => x === hit[2]).length !== 1) say('at ' + pk.at + ' is ' + (hit ? hit[2] : 'nothing') + ', not ' + o[pk.ans]);
      } else if (pk.job) {
        if (!JOB[pk.job]) say('no job is known for ' + pk.job);
        else if (o[pk.ans] !== JOB[pk.job]) say('in ' + pk.job + ' the number ' + JOB[pk.job] + ', not ' + o[pk.ans]);
      } else if (pk.coinName != null) {
        const want = Object.keys(CENTS).find(k => CENTS[k] === pk.coinName);
        if (o[pk.ans] !== want) say('the ' + pk.coinName + '¢ coin is a ' + want + ', not ' + o[pk.ans]);
      } else if (pk.coinMost) {
        const v = o.map(x => CENTS[x]);
        if (v.some(x => x === undefined) || v.some((x, i) => i !== pk.ans && x >= v[pk.ans])) say('the circled coin is not worth the most: ' + o.join(', '));
      } else if (pk.chance) {
        if (!(pc && pc.parts)) say('a choice about chance has no spinner to check it by');
      } else if (pk.sci) {
        /* in scientific notation: the one choice (sci: true), or yes or no for one number */
        if (pk.sci === true) { const ok = o.map(sciForm); if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice is in scientific notation: ' + o.join(', ')); }
        else if ((o2(pk) === 'yes') !== sciForm(pk.sci)) say(pk.sci + (sciForm(pk.sci) ? ' is' : ' is not') + ' in scientific notation');
      } else if (pk.numset) {
        /* does the number belong to the set? natural 1, 2, 3 ...; whole 0, 1, 2 ...; integer ... −1, 0, 1 ...; rational; irrational */
        const v = val(norm(pk.numset.n)), irr = /π/.test(pk.numset.n) || (/√/.test(pk.numset.n) && !Number.isInteger(+(v * 100).toFixed(6)));
        const isIn = { natural: Number.isInteger(v) && v > 0, whole: Number.isInteger(v) && v >= 0, integer: Number.isInteger(v), rational: !irr, irrational: irr }[pk.numset.is];
        if ((o2(pk) === 'yes') !== isIn) say(pk.numset.n + (isIn ? ' is' : ' is not') + ' ' + pk.numset.is);
      } else if (pk.real || pk.trend || pk.right || pk.prop || pk.vars || pk.cont || pk.graph || pk.budget || pk.cost || pk.indep || pk.move) {
        /* Grade 8 choices: checked below */
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
    /* 5b2. a fair share with some left over: each gets as many as fit, and fewer are left than there are sharers */
    if (it.left) {
      const { t, g } = it.left, got = (it.a || []).slice(-2);
      if (got[0] !== Math.floor(t / g) || got[1] !== t % g) say(t + ' shared by ' + g + ' is ' + Math.floor(t / g) + ' each and ' + t % g + ' left over, not ' + got.join(' and '));
      [t, g].forEach(n => { if (nums(it.q + ' ' + JSON.stringify(it.pic || [])).indexOf(n) < 0) say('the share uses ' + n + ', which is not in the question'); });
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
    const put = (e, v) => norm(e.replace(/(\d)\s*([a-z(])/g, (m, d, c) => d + ' * ' + (c === '(' ? '(' : '(' + c + ')')).replace(/\b([a-z])\b/g, '(' + v + ')'));
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
    if (it.data && it.q) it.data.forEach(n => { if (nums(it.q).indexOf(Math.abs(n)) < 0) say('the data value ' + n + ' is not in the question'); });
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
    /* Grade 2 sharing: deal t things one at a time to g sharers; the answers are how many each gets and (if asked) how many
       are left over, which must be fewer than the sharers */
    if (it.deal) {
      const [t, g] = it.deal, each = Math.floor(t / g), left = t % g;
      if (ansAll[0] !== each) say(t + ' shared by ' + g + ' is ' + each + ' each, not ' + ansAll[0]);
      if (ansAll.length > 1 && ansAll[1] !== left) say(t + ' shared by ' + g + ' leaves ' + left + ', not ' + ansAll[1]);
      if (!(pc && pc.total === t && pc.share === g)) [t, g].forEach(n => { if (nums(it.q).indexOf(n) < 0) say('the sharing ' + t + ' by ' + g + ' is not in the question'); });
    }
    if (it.shapeAsk) {
      /* sides, corners, square corners or lines of symmetry of the shape drawn, answered in order by the last answers */
      const asked = [].concat(it.shapeAsk), got = ansAll.slice(-asked.length);
      if (!pc || pc.sides == null) say('a question about a shape has no shape');
      else asked.forEach((k, i) => { if (pc[k] !== num(got[i])) say('the shape has ' + pc[k] + ' ' + k + ', not ' + got[i]); });
    }
    if (it.corners) { const sh = it.pic && it.pic[1].shape; if (!sh || rights(sh) !== last) say('the shape has ' + (sh ? rights(sh) : '?') + ' right angles, not ' + ansAll[ansAll.length - 1]); }
    if (it.pt) { const q = at(it.pt); if (!q || ansAll.slice(-2).join() !== q.join()) say('point ' + it.pt + ' is at (' + (q || []).join(', ') + '), not (' + ansAll.slice(-2).join(', ') + ')'); }
    if (it.move && (it.move.slide || it.move.flip)) {
      const q = at(it.move.pt), m = it.move, to = !q ? null : m.slide ? [q[0] + m.slide[0], q[1] + m.slide[1]] : m.flip.x != null ? [2 * m.flip.x - q[0], q[1]] : [q[0], 2 * m.flip.y - q[1]];
      if (!to || ansAll.slice(-2).join() !== to.join()) say('the point moves to (' + (to || []).join(', ') + '), not (' + ansAll.slice(-2).join(', ') + ')');
      if (m.slide && m.slide.some(v => v && nums(it.q).indexOf(Math.abs(v)) < 0)) say('the slide ' + m.slide.join(', ') + ' is not in the question');
      if (m.flip && nums(it.q).indexOf(m.flip.x != null ? m.flip.x : m.flip.y) < 0) say('the flip line is not in the question');
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
    /* Grade 8 */
    if (pc && pc.bad) say(pc.bad);
    /* like terms: the last row, after its "=", is an expression that equals simp for every value of the letter */
    const asExpr = (e, v) => val(norm(String(e).replace(/(\d)\s*([a-z(])/g, (m, d, c) => d + ' * ' + (c === '(' ? '(' : '(' + c + ')')).replace(/\b([a-z])\b/g, '(' + v + ')')));
    if (it.simp) {
      const ans = filled[filled.length - 1].split('=').pop();
      if ([2, 3, -1.5, 7].some(v => !same(asExpr(it.simp, v), asExpr(ans, v)))) say(it.simp + ' does not simplify to ' + ans);
      if (it.tiles && pc && pc.tiles) { const t = pc.tiles, want = (t.xp || 0) - (t.xn || 0) + 'x + ' + ((t.up || 0) - (t.un || 0)); if ([2, 5].some(v => !same(asExpr(want, v), asExpr(it.simp, v)))) say('the tiles show ' + want + ', not ' + it.simp); }
    }
    /* an inequality's solution: x > [] (or <, ≥, ≤): at the boundary both sides are equal, and just past it on the
       written side the inequality is true */
    if (it.bnd) {
      const row = filled.find(r => /^[a-z] [<>≤≥] /.test(r)), m = row && row.match(/^[a-z] ([<>≤≥]) (.+)$/);
      if (!m) say('no "x > []" row for ' + it.bnd);
      else {
        const b = num(m[2]), sign = m[1], side = /[>≥]/.test(sign) ? 0.5 : -0.5, e = it.bnd.replace(/[<>≤≥]/, '=');
        if (truth(put(e, b)) !== true) say(b + ' is not where ' + it.bnd + ' changes');
        if (truth(put(it.bnd.replace('≤', '<').replace('≥', '>'), b + side)) !== true) say('the solutions of ' + it.bnd + ' are not ' + row);
        if (/[≤≥]/.test(it.bnd) !== /[≤≥]/.test(sign)) say('the boundary of ' + it.bnd + ' is ' + (/[≤≥]/.test(it.bnd) ? '' : 'not ') + 'a solution');
      }
      if (pc && it.pic[0] === 'iline' && it.pic[1].ray) { const r = it.pic[1].ray; if (!m || r.at !== num(m[2]) || (r.dir === 'right') !== /[>≥]/.test(m[1]) || r.open !== /[<>]/.test(m[1])) say('the graph does not match ' + (row || it.bnd)); }
    }
    /* parallel lines: an angle named by a letter ("a = [] °") is the given angle or 180° minus it */
    if (pc && pc.angAt) (it.pic[1].letters || []).forEach(l => { const r = filled.map(x => x.match(new RegExp('^' + l[1] + ' = ([\\d.]+)'))).filter(Boolean)[0]; if (!r) say('no row for angle ' + l[1]); else if (+r[1] !== pc.angAt(l[0])) say('angle ' + l[1] + ' is ' + pc.angAt(l[0]) + '°, not ' + r[1]); });
    /* a scatter plot read at one value across (it.at): the answer is the height of the one point there */
    if (it.at != null && pc && pc.pts) { const q = pc.pts.filter(p => p[0] === it.at); if (q.length !== 1 || !same(q[0][1], last)) say('the point at ' + it.at + ' is not at ' + last); }
    /* two whole numbers next to each other (a square root lies between them) */
    if (it.consec && !(ansAll.length >= 2 && num(ansAll[1]) - num(ansAll[0]) === 1)) say('the two numbers ' + ansAll.join(' and ') + ' are not next to each other');
    /* scientific notation: the first part is at least 1 and less than 10 */
    if (it.sci && !(Math.abs(num(ansAll[0])) >= 1 && Math.abs(num(ansAll[0])) < 10)) say(ansAll[0] + ' is not between 1 and 10, so this is not scientific notation');
    /* probability: count the outcomes. sp = { sets: [[outcomes of event 1], [event 2]], ev: [allowed outcomes for each event,
       or null for any], sum: n (the outcomes add to n), more: n (add to more than n), dbl: true (the same) }; bag = { c: { red: 3, ... },
       draw: ['red', 'blue'], back: true | false }; vp: 'a' | 'b' | 'both' | 'either' | 'neither' | 'aonly' from the Venn counts */
    let pr = null;
    if (it.sp) {
      const all = it.sp.sets.reduce((acc, set) => acc.flatMap(a => set.map(x => a.concat([x]))), [[]]);
      const ok = all.filter(o => (!it.sp.ev || o.every((x, i) => !it.sp.ev[i] || it.sp.ev[i].indexOf(x) >= 0)) && (it.sp.sum == null || o.reduce((t, x) => t + +x, 0) === it.sp.sum) && (it.sp.more == null || o.reduce((t, x) => t + +x, 0) > it.sp.more) && (!it.sp.dbl || o.every(x => x === o[0])));
      pr = ok.length / all.length;
      if (it.sp.count != null) pr = all.length;
    }
    if (it.bag) {
      const c = Object.assign({}, it.bag.c);
      pr = 1;
      it.bag.draw.forEach(k => { const n = Object.values(c).reduce((x, y) => x + y, 0); pr *= (c[k] || 0) / n; if (!it.bag.back) c[k]--; });
      Object.keys(it.bag.c).forEach(k => { if (!new RegExp('\\b' + it.bag.c[k] + ' ' + k).test(it.q || '')) say('the question does not say ' + it.bag.c[k] + ' ' + k); });
    }
    if (it.vp && pc && pc.vn) {
      const [a, b, c, d] = pc.vn, t = a + b + c + d;
      pr = { a: a + b, b: b + c, both: b, either: a + b + c, neither: d, aonly: a, bonly: c, total: t }[it.vp] / (it.vcount ? 1 : t);
    }
    if (pr !== null && (it.a || []).length) {
      const got = ansAll[ansAll.length - 1], v = it.pct ? num(got) / 100 : it.trials ? num(got) / it.trials : num(got);
      if (!same(pr, v)) say('the probability is ' + pr + (it.trials ? ' (' + pr * it.trials + ' of ' + it.trials + ')' : '') + ', not ' + got);
    }
    if (pk) {
      const o = pk.opts, yes = pk.ans === 0;
      if (pk.real) {
        /* rational: a fraction, a decimal that ends or repeats, or the root of a perfect square (of a fraction too); irrational: π, other roots */
        const r = String(pk.real), m = r.match(/^√\(?(\d+(?:\.\d+)?)(?:\/(\d+))?\)?$/), sq = n => { const k = Math.round(Math.sqrt(n * 10000)); return k * k === Math.round(n * 10000); };
        const want = /π/.test(r) || pk.nonrep || (m && !(sq(+m[1]) && (!m[2] || sq(+m[2])))) ? 'irrational' : 'rational';
        if (o2(pk) !== want) say(r + ' is ' + want + ', not ' + o2(pk));
      } else if (pk.trend) {
        /* the strength and direction of a scatter plot from its correlation: strong 0.8 or more, weak 0.3 to 0.8, none below */
        const P2 = pc && pc.pts;
        if (!P2) say('a trend choice has no scatter plot');
        else {
          const n = P2.length, mx = P2.reduce((t, q) => t + q[0], 0) / n, my = P2.reduce((t, q) => t + q[1], 0) / n;
          const sxy = P2.reduce((t, q) => t + (q[0] - mx) * (q[1] - my), 0), sxx = P2.reduce((t, q) => t + (q[0] - mx) ** 2, 0), syy = P2.reduce((t, q) => t + (q[1] - my) ** 2, 0), r = sxy / Math.sqrt(sxx * syy || 1);
          const ar = Math.abs(r), want = ar < 0.3 ? 'none' : (ar >= 0.8 ? 'strong ' : 'weak ') + (r > 0 ? 'positive' : 'negative');
          if ([0.3, 0.8].some(b => Math.abs(ar - b) < 0.06)) say('the trend is too close to call (r = ' + r.toFixed(2) + ')');
          if (o2(pk) !== want && !(pk.dir && o2(pk) === (r > 0 ? 'positive' : 'negative'))) say('the trend is ' + want + ' (r = ' + r.toFixed(2) + '), not ' + o2(pk));
        }
      } else if (pk.right) {
        /* a right triangle when the two short sides squared add to the long side squared */
        const t = pk.right.slice().sort((x, y) => x - y), want = same(t[0] * t[0] + t[1] * t[1], t[2] * t[2]) ? 'yes' : 'no';
        if (o2(pk) !== want) say(pk.right.join(', ') + (want === 'yes' ? ' is' : ' is not') + ' a right triangle');
      } else if (pk.prop) {
        /* proportional: every pair has the same ratio y ÷ x (and so the line goes through 0) */
        const k = pk.prop[0][1] / pk.prop[0][0], want = pk.prop.every(r => same(r[1] / r[0], k)) ? 'yes' : 'no';
        if (o2(pk) !== want) say('the table is ' + (want === 'yes' ? '' : 'not ') + 'proportional');
      } else if (pk.vars) {
        const want = pk.vars.length === 1 ? 'one-variable' : 'two-variable';
        if (o2(pk) !== want) say(pk.vars.join(' and ') + ' is ' + want + ' data');
      } else if (pk.cont) {
        /* measured (it can be any value in between) or counted */
        const MEAS = /height|length|mass|time|temperature|distance|speed|arm span|volume|area|age in days|weight/, want = MEAS.test(pk.cont) ? 'continuous' : 'discrete';
        if (o2(pk) !== want) say(pk.cont + ' is ' + want);
      } else if (pk.graph) {
        /* two variables: scatter plot; change over time: line graph; parts of a whole: circle graph; comparing groups: bar graph */
        const want = { two: 'scatter plot', time: 'line graph', parts: 'circle graph', groups: 'bar graph' }[pk.graph];
        if (o2(pk) !== want) say('for ' + pk.graph + ' data use a ' + want + ', not a ' + o2(pk));
      } else if (pk.budget) {
        const d = pk.budget[0] - pk.budget[1], want = d > 0 ? 'surplus' : d < 0 ? 'deficit' : 'balanced';
        if (o2(pk) !== want) say('income ' + pk.budget[0] + ' and spending ' + pk.budget[1] + ' is a ' + want);
      } else if (pk.cost) {
        const FIXED = ['rent', 'phone plan', 'car insurance', 'internet', 'loan payment', 'gym membership', 'streaming plan', 'bus pass'];
        const want = FIXED.indexOf(pk.cost) >= 0 ? 'fixed' : 'variable';
        if (o2(pk) !== want) say(pk.cost + ' is a ' + want + ' cost');
      } else if (pk.indep) {
        const want = pk.indep.back ? 'independent' : 'dependent';
        if (o2(pk) !== want) say('these events are ' + want);
      } else if (pk.move) {
        /* the transformation that takes shape to after: a slide keeps the turn, a flip turns it over, a turn spins it */
        const a = pk.move[0], b = pk.move[1], sign = q => Math.sign((q[1][0] - q[0][0]) * (q[2][1] - q[0][1]) - (q[1][1] - q[0][1]) * (q[2][0] - q[0][0]));
        const d = (u, v) => [v[0] - u[0], v[1] - u[1]], e1 = d(a[0], a[1]), e2 = d(b[0], b[1]);
        const len = q => Math.hypot(q[0], q[1]), want = !same(len(e1), len(e2)) ? 'dilation' : sign(a) !== sign(b) ? 'reflection' : e1[0] === e2[0] && e1[1] === e2[1] ? 'translation' : 'rotation';
        if (o2(pk) !== want) say('the move is a ' + want + ', not a ' + o2(pk));
      }
    }
    /* a point moved by a turn about the origin (rot: 90 counterclockwise, 180, −90) or a dilation by k from the origin */
    if (it.move && (it.move.rot || it.move.dil)) {
      const q = at(it.move.pt), m = it.move, to = !q ? null : m.dil ? [q[0] * m.dil, q[1] * m.dil] : m.rot === 180 ? [-q[0], -q[1]] : m.rot === 90 ? [-q[1], q[0]] : [q[1], -q[0]];
      if (!to || !same(num(ansAll[ansAll.length - 2]), to[0]) || !same(num(ansAll[ansAll.length - 1]), to[1])) say('the point moves to (' + (to || []).join(', ') + '), not (' + ansAll.slice(-2).join(', ') + ')');
    }
    /* 6. open questions need an example answer on the key */
    if (it.draw && !it.draw.key) say('a drawing question has no example on the key');
    if (it.lines && !it.lines.key) say('a written question has no example on the key');
    if (!it.eq && !pk && !it.draw && !it.lines && !(pc && pc.own) && !ask && !(it.pic && it.pic[0] === 'pat' && it.pic[1].next)) say('a question with nothing to answer');
    return bad;
  };
})();
