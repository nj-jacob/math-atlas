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
  /* sheet maths into plain maths: × ÷ −, and "3 groups of 4", "3 rows of 4", "3 jumps of 4" mean 3 × 4; other words go */
  function norm(s) {
    return String(s).replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\b(groups|rows|jumps) of\b/g, '*')
      .replace(/(\d+) hundreds?\b/g, '($1*100) +').replace(/(\d+) tens?\b/g, '($1*10) +').replace(/(\d+) ones?\b/g, '$1 +')
      .replace(/[A-Za-z’'?.:]+/g, ' ').replace(/\+\s*(?=[=<>]|$)/g, '').replace(/\s+/g, ' ').trim();
  }
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
  const nums = s => (String(s).match(/\d+/g) || []).map(Number);
  /* is a statement such as "4 × 7 = 7 × 4" or "18 ÷ 2 = 8." true? null when it cannot be read */
  function truth(st) {
    if (!/=/.test(st) && /[<>]/.test(st)) return order(st);
    const sides = norm(st).split('=');
    if (sides.length !== 2) return null;
    const a = val(sides[0]), b = val(sides[1]);
    return isNaN(a) || isNaN(b) ? null : a === b;
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
  /* the shape names a repeating pattern uses */
  const SHAPES = { c: 'circle', s: 'square', t: 'triangle', d: 'diamond', C: 'circle', S: 'square' };
  /* What each picture shows, by its name: { total, pair, counts, share } for the "picture matches the sum" check, and
     own(o, answers) for a picture with its own write-on lines (it takes the first answers): a list of problems.
     Picture files add their own readers here (sheet-pics.js below; sheet-pics-upper.js after it). */
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
    units: o => ({ total: o.n, pair: [o.n, o.unit ? parseFloat(o.unit) : null] }),
    blob: o => ({ total: blobEstimate(o).n, own: o => (blobEstimate(o).unsure ? [blobEstimate(o).unsure + ' squares of the curved shape are too close to half to call'] : []), blanks: 0 }),
    wholes: o => ({ total: o.n }),
    cups: o => ({ total: o.n }),
    col: o => { const res = String(o.op === '+' ? o.a + o.b : o.a - o.b); return { blanks: res.length, own: (o, a) => (a.join('') === res ? [] : ['the column answer ' + a.join('') + ' is not ' + res]) }; },
    tally: o => (o.blank ? { blanks: o.cats.length, own: (o, a) => (a.join() === o.vals.join() ? [] : ['the tally counts ' + a.join() + ' do not match the tallies ' + o.vals.join()]) } : null),
    nl: o => ({ total: o.pt != null ? o.pt : undefined, blanks: (o.ask || []).length, own: (o.ask || []).length ? (o, a) => (a.join() === o.ask.join() ? [] : ['the number line answers ' + a.join() + ' are not ' + o.ask.join()]) : null }),
    pv: o => ({ total: o.n, blanks: o.blank ? Math.max(3, String(o.n).length) : 0, own: o.blank ? (o, a) => (+a.join('') === o.n ? [] : ['the chart digits ' + a.join('') + ' are not ' + o.n]) : null }),
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
    coins: [{ list: [500, 200, 100, 25, 10, 5] }], tag: [{ t: 'Juice box', p: 135 }], bar: [{ cats: ['A', 'B', 'C', 'D'], vals: [4, 7, 2, 5], max: 8, step: 2 }],
    tally: [{ cats: ['{many}', 'balls'], vals: [7, 12], blank: true }, [7, 12]], solids: [{ list: ['cube', 'tpyr', 'pyramid', 'cylinder'], letters: true }],
    area: [{ cols: 8, rows: 4, rect: [5, 3] }], rect: [{ a: 6, b: 3, unit: 'cm', all: true }], ruler: [{ len: 7, from: 0 }],
    balance: [{ l: 6, r: '{one}', tilt: 0 }], cups: [{ n: 6 }], nl: [{ min: 300, max: 400, tick: 10, lab: 50, pt: 370, ask: [330] }, [330]],
    map: [{ cols: 7, rows: 4, grid: true, marks: [[1, 1, 'A'], [5, 2, 'B']], start: [0, 3, '>'], path: [[0, 3], [3, 3], [3, 1]] }], venn: [{ a: 'red', b: 'round' }],
    poly: [{ sides: [4, 5, '?'] }], blob: [{ cols: 8, rows: 5, cx: 4, cy: 2.5, rx: 3.2, ry: 2.1 }], units: [{ n: 6, unit: '4 cm' }],
    stack: [{ list: ['tri', 'cube'] }], box: [{ l: 4, d: 2, h: 3 }], compass: [{ face: 'east' }],
    row: [{ list: [['frac', { n: 2, k: 1 }], ['frac', { n: 4, k: 2 }]], labels: ['A', 'B'] }]
  };
  function picture(p) { return READ[p[0]] ? READ[p[0]](p[1]) : null; }


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
      if (t !== '[]' && t !== '[],') return t;
      if (!a.length) { say('a box has no answer: ' + row); return '?'; }
      return a.shift() + (t === '[],' ? ',' : '');
    }).join(' '));
    if (a.length) say(a.length + ' answer(s) left over with no box');
    const raw = it.eq || [], ansAll = (it.a || []).slice(pc && pc.own ? pc.blanks : 0);
    filled.forEach((row, ri) => {
      const blanks = /\[\]/.test(raw[ri]);
      let worth;
      let est;
      if (it.robot && it.robot.to) {
        /* code with blanks filled in, one line per row: it must take the robot from the start to the square marked "to" */
        if (ri) return;
        row = filled.join(', ');
        const m = it.pic[1], end = robot(m.start, row), mark = (m.marks || []).find(k => k[2] === it.robot.to);
        if (!end) say('cannot read the code: ' + row);
        else if (!mark || end[0] !== mark[0] || end[1] !== mark[1]) say('the code ' + row + ' stops at ' + end.join(',') + ', not at ' + it.robot.to);
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
      } else if (it.find && pc && /^\d+( [a-z²]+)+$/.test(row)) {
        /* perimeter (around), area (inside) or the missing side of a shape with a known perimeter */
        const want = it.find === 'side' ? it.perimTo - pc.known : pc[it.find], n = +row.split(' ')[0];
        if (want !== n) say('the ' + it.find + ' is ' + want + ', not ' + n);
      } else if (!it.cong && /\d ?(mm|cm|m|km)\b/.test(row) && / [<>=] /.test(row)) {
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
      } else if (it.est && (est = row.match(/^(\d+) ([+−]) (\d+) is about (\d+)$/))) {
        /* "389 + 212 is about []": round each number to the nearest 10 or 100 first, then add or subtract */
        const r = n => Math.round(+n / it.est) * it.est, want = est[2] === '+' ? r(est[1]) + r(est[3]) : r(est[1]) - r(est[3]);
        if (want !== +est[4]) say('rounding first, ' + est[1] + ' ' + est[2] + ' ' + est[3] + ' is about ' + want + ', not ' + est[4]);
      } else if (it.round) {
        /* "345 is about []": the answer is the number rounded to the nearest 10 or 100 (5 rounds up) */
        const n = nums(row);
        if (n.length !== 2 || Math.round(n[0] / it.round) * it.round !== n[1]) say(n[0] + ' to the nearest ' + it.round + ' is ' + Math.round(n[0] / it.round) * it.round + ', not ' + n[1]);
      } else if ((worth = row.match(/^The (\d) in (\d+) is worth (\d+)$/))) {
        /* "The 7 in 472 is worth []": the digit's place gives its value */
        const d = worth[1], s2 = worth[2], at = s2.indexOf(d);
        if (at < 0 || s2.lastIndexOf(d) !== at) say('the digit ' + d + ' is not in ' + s2 + ' exactly once');
        else if (+d * Math.pow(10, s2.length - 1 - at) !== +worth[3]) say('the ' + d + ' in ' + s2 + ' is worth ' + (+d * Math.pow(10, s2.length - 1 - at)) + ', not ' + worth[3]);
      } else if (/,/.test(row)) {
        const n = nums(row);
        const step = it.by != null ? it.by : n[1] - n[0];
        if (n.length < (it.by != null ? 2 : 3)) say('a count needs 3 numbers, or a "by" step, to be checked: ' + row);
        else if (n.some((x, i) => i > 0 && x - n[i - 1] !== step)) say('the count does not go up by the same step: ' + row);
      } else if (/=/.test(row)) {
        const sides = norm(row).split('='), v = sides.map(val);
        if (v.some(isNaN)) say('cannot read the sum: ' + row);
        else if (v.some(x => x !== v[0])) say('the sum is not true: ' + row);
      } else if (/[<>]/.test(row)) {
        const t = order(row);
        if (t === null) say('cannot read the comparison: ' + row);
        else if (!t) say('the comparison is not true: ' + row);
      } else if (raw[ri].trim() === '[]') {
        /* a bare answer: the number the picture shows, or the number written in words */
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
        else if (pc && pc.total != null) { if (pc.total !== v) say('the picture shows ' + pc.total + ', not ' + v); }
        else if (!it.calc) say('nothing checks the answer ' + v);
      } else if (blanks && !it.calc) say('nothing checks this row: ' + raw[ri]);
    });
    /* congruent faces or boxes: with the blanks filled in, the two lists of lengths match once sorted */
    if (it.cong) {
      const q = ansAll.slice(), b = it.cong.b.map(x => (x === '?' ? +q.shift() : x)), srt = l => l.slice().sort((x, y) => x - y).join();
      if (it.cong.b.indexOf('?') >= 0 && srt(it.cong.a) !== srt(b)) say(it.cong.a.join(' by ') + ' and ' + b.join(' by ') + ' are not congruent');
    }
    /* directions written on the key take you to the place asked for */
    if (it.give) { const w = walk(it.pic[1], it.lines.key); if (!w || !w.inside || w.cell !== it.give) say('the key directions end at ' + (w && w.cell) + ', not ' + it.give); }
    /* the answers are these numbers, in some order (putting numbers in order) */
    if (it.set && ansAll.slice().sort((x, y) => x - y).join() !== it.set.slice().sort((x, y) => x - y).join()) say('the answers ' + ansAll.join(', ') + ' are not the numbers ' + it.set.join(', '));
    /* expanded form: every answer is one digit followed by zeros, each in a different place */
    if (it.expanded && (ansAll.some(v => !/^[1-9]0*$/.test(String(v))) || new Set(ansAll.map(v => String(v).length)).size !== ansAll.length)) say('the expanded form ' + ansAll.join(' + ') + ' is not one part for each place');
    /* a number to write in words: the key's words are the number */
    if (it.spell != null && (!it.lines || it.lines.key !== toWords(it.spell))) say(it.spell + ' in words is "' + toWords(it.spell) + '", not "' + (it.lines && it.lines.key) + '"');
    /* 3. the picture matches the sum: its total is in the first sum, and a times sum uses its two numbers */
    const first = filled.filter(r => /=/.test(r))[0];
    if (pc && first) {
      if (pc.total != null && nums(first).indexOf(pc.total) < 0) say('the picture shows ' + pc.total + ' but the sum is ' + first);
      const m = norm(first).match(/^(\d+) \* (\d+) =/);
      if (m && pc.pair && [+m[1], +m[2]].sort().join() !== pc.pair.slice().sort().join()) say('the times sum ' + first + ' does not match the picture (' + pc.pair.join(' and ') + ')');
      const d = norm(first).match(/^(\d+) \/ (\d+) =/);
      if (d && pc.share && +d[2] !== pc.share) say('the sharing sum ' + first + ' does not share into ' + pc.share);
    }
    /* 4. a story: its answer follows from the numbers in it */
    if (it.calc) {
      const v = val(norm(it.calc));
      if (v !== (it.a || [])[0]) say('the story works out to ' + v + ', not ' + (it.a || [])[0]);
      const inQ = nums(it.q);
      nums(it.calc).forEach(n => { if (inQ.indexOf(n) < 0) say('the story sum uses ' + n + ', which is not in the story'); });
    }
    /* 5. the circled choice */
    const pk = it.pick;
    if (pk) {
      const o = pk.opts, yes = pk.ans === 0;
      if ((o[0] === '×' && o[1] === '÷') || (o[0] === '+' && o[1] === '−')) {
        if (!it.calc || it.calc.indexOf(o[pk.ans]) < 0) say('the circled ' + o[pk.ans] + ' does not match the story sum ' + it.calc);
      } else if (pk.size != null) {
        /* the unit that suits a length */
        if (o[pk.ans] !== unitFor(pk.size) || o.filter(x => x === unitFor(pk.size)).length !== 1) say('a length of ' + pk.size + ' mm is measured in ' + unitFor(pk.size) + ', not ' + o[pk.ans]);
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
      } else if (pk.round) {
        const rnd = (x, r) => Math.round(+x / r.to) * r.to === r.val;
        const ok = o.map(x => rnd(x, pk.round) && (!pk.also || rnd(x, pk.also)));
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice rounds to ' + pk.round.val);
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
        const v = o.map(x => val(norm(x)));
        if (v.some(isNaN) || v.some((x, i) => i !== pk.ans && x <= v[pk.ans])) say('the circled choice is not the smallest: ' + o.join(', '));
      } else if (pk.big) {
        const v = o.map(x => val(norm(x)));
        if (v.some(isNaN) || v.some((x, i) => i !== pk.ans && x >= v[pk.ans])) say('the circled choice is not the biggest: ' + o.join(', '));
      } else if (pk.val != null) {
        const ok = o.map(x => val(norm(x)) === pk.val);
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice makes ' + pk.val);
      } else if (o[0] === 'yes' && pc && pc.counts) {
        if (pc.counts.every(x => x === pc.counts[0]) !== yes) say('equal groups: the key is wrong');
      } else say('a choice with nothing to check it by: ' + o.join(', '));
    }
    /* 6. open questions need an example answer on the key */
    if (it.draw && !it.draw.key) say('a drawing question has no example on the key');
    if (it.lines && !it.lines.key) say('a written question has no example on the key');
    if (!it.eq && !pk && !it.draw && !it.lines && !(pc && pc.own)) say('a question with nothing to answer');
    return bad;
  };
})();
