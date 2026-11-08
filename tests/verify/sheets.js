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
  function norm(s) {
    return String(s).replace(/(\d)[\u00a0 ](?=\d{3}\b)/g, '$1')
      .replace(/(^|[^\d.\/])(\d+) (\d+)\/(\d+)/g, (m, pre, w, n, d) => pre + '(' + w + ' + ' + n + '/' + d + ')')
      .replace(/(^|[^\d.(])(\d+)\/(\d+)(?![\d.])/g, '$1($2/$3)')
      .replace(/(\d+) (ten thousand|thousand|hundredth|hundred|tenth|ten|one)s?\b/g, (m, n, pl) => '(' + n + ' * ' + PLACE[pl] + ') +')
      .replace(/\$/g, '').replace(/ ?%/g, ' / 100').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\b(groups|rows|jumps) of\b/g, '*')
      .replace(/ R (?=\d)/g, ' ~ ').replace(/\.(?!\d)|(?<!\d)\./g, ' ')
      .replace(/[A-Za-z’'?:]+/g, ' ').replace(/~/g, 'R').replace(/\+\s*(?=[=<>)]|$)/g, '').replace(/\s+/g, ' ').trim();
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
    area: o => ({ total: o.rect ? o.rect[0] * o.rect[1] : o.cells.length }),
    wholes: o => ({ total: o.n }),
    cups: o => ({ total: o.n }),
    col: o => { const res = String(o.op === '+' ? o.a + o.b : o.a - o.b); return { blanks: res.length, own: (o, a) => (a.join('') === res ? [] : ['the column answer ' + a.join('') + ' is not ' + res]) }; },
    tally: o => (o.blank ? { blanks: o.cats.length, own: (o, a) => (a.join() === o.vals.join() ? [] : ['the tally counts ' + a.join() + ' do not match the tallies ' + o.vals.join()]), data: o.vals } : { data: o.vals }),
    bar: o => ({ data: o.vals.filter(v => v != null) }),
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
    coins: [{ list: [500, 200, 100, 25, 10, 5] }], tag: [{ t: 'Juice box', p: 135 }], bar: [{ cats: ['A', 'B', 'C', 'D'], vals: [4, 7, 2, 5], max: 8, step: 2 }],
    tally: [{ cats: ['{many}', 'balls'], vals: [7, 12], blank: true }, [7, 12]], solids: [{ list: ['cube', 'prism', 'pyramid', 'cylinder'], letters: true }],
    area: [{ cols: 8, rows: 4, rect: [5, 3] }], rect: [{ a: 6, b: 3, unit: 'cm', all: true }], ruler: [{ len: 7, from: 0 }],
    balance: [{ l: 6, r: '{one}', tilt: 0 }], cups: [{ n: 6 }], nl: [{ min: 300, max: 400, tick: 10, lab: 50, pt: 370, ask: [330] }, [330]],
    map: [{ cols: 7, rows: 4, marks: [[1, 1, 'A'], [5, 2, 'B']], start: [0, 3, '>'], path: [[0, 3], [3, 3], [3, 1]] }], venn: [{ a: 'red', b: 'round' }],
    row: [{ list: [['frac', { n: 2, k: 1 }], ['frac', { n: 4, k: 2 }]], labels: ['A', 'B'] }],
    amodel: [{ a: 246, b: 3 }, [600, 120, 18]], mult: [{ a: 47, b: 26 }, [282, 940, 1222]], shareR: [{ t: 14, g: 4 }],
    chunks: [{ t: 372, d: 12, steps: [30, 1] }], pvmove: [{ n: 3.45, shift: 2, dir: 'x' }], disks: [{ list: [[10000, 2], [1000, 3], [100, 13], [1, 4]] }],
    fbars: [{ rows: [[4, 3], [8, 6]], labels: ['3/4', '6/8'] }], dline: [{ min: 0, max: 1, d: 10, show: 'dec', pt: 0.7, ask: [0.4] }, ['0.4']],
    hill: [{ lo: 48000, hi: 49000, n: 48650 }], mix: [{ a: 2, b: 3, g: 4 }], grow: [{ m: 2, b: 1, k: 3 }], dbar: [{ cats: ['Mon', 'Tue', 'Wed'], sets: [[4, 6, 3], [5, 2, 7]], keys: ['A', 'B'], max: 8, step: 2 }], lineg: [{ cats: ['Jan', 'Feb', 'Mar'], vals: [3, 5, 4], max: 6, step: 2 }], spin: [{ parts: ['R', 'R', 'B', 'G'] }], tri: [{ sides: [5, 5, 8], show: 'sides', marks: true }], heights: [{ g: [[2, 1], [1, 0]] }], coord: [{ n: 8, pts: [[2, 3, 'A']], plot: [[5, 1, 'B']] }], code: [{ lines: ['set total to 5', 'repeat 3 times', '  add 4 to total'] }], grid: [{ n: 37, unit: '1000' }]
  };
  const o2 = pk => pk.opts[pk.ans];
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
      if (!/\[\]/.test(t)) return t;
      if (!a.length) { say('a box has no answer: ' + row); return '?'; }
      return t.replace('[]', a.shift());
    }).join(' '));
    if (a.length) say(a.length + ' answer(s) left over with no box');
    const raw = it.eq || [], ansAll = (it.a || []).slice(pc && pc.own ? pc.blanks : 0);
    /* rows whose answer is checked from the item itself further down (a digit's value, the biggest or smallest number from
       some digits, a remainder story) */
    const byItem = !!(it.dv || it.big || it.small || it.rem || it.fig || it.rule || it.expr || it.solve || it.ineq || it.stat || it.rel != null || it.prob || it.looks || (pc && pc.ask != null));
    filled.forEach((row, ri) => {
      const blanks = /\[\]/.test(raw[ri]);
      let worth;
      /* a row with a letter for a number (3n + 2 = [], n = []) is checked by its item's expr, solve, ineq or rule below */
      if ((it.expr || it.solve || it.ineq || it.rule) && /(^|[\d\s(])[a-z]\b/.test(row)) return;
      /* a spinner's rows (P(R) = [], R: about []) are checked by its item's prob below */
      if (it.prob || it.pt || it.move || it.view) return;
      const rat = row.match(/\d+ ?: ?\d+/g);
      let est;
      if (it.robot && it.robot.to) {
        /* code with blanks filled in, one line per row: it must take the robot from the start to the square marked "to" */
        if (ri) return;
        row = filled.join(', ');
        const m = it.pic[1], end = robot(m.start, row), mark = (m.marks || []).find(k => k[2] === it.robot.to);
        if (!end) say('cannot read the code: ' + row);
        else if (!mark || end[0] !== mark[0] || end[1] !== mark[1]) say('the code ' + row + ' stops at ' + end.join(',') + ', not at ' + it.robot.to);
      } else if (/≠/.test(row)) {
        const sides = norm(row).split('≠').map(val);
        if (sides.some(isNaN)) say('cannot read: ' + row); else if (sides[0] === sides[1]) say('both sides are ' + sides[0] + ': ' + row);
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
      } else if (it.round) {
        /* "345 is about []": the answer is the number rounded to the nearest 10 or 100 (5 rounds up) */
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
        else if (pc && pc.total != null) { if (!same(pc.total, num(v))) say('the picture shows ' + pc.total + ', not ' + v); else if (pc.name && /\//.test(v) && v !== pc.name) say('the picture shows ' + pc.name + ', not ' + v); }
        else if (!it.calc && !byItem) say('nothing checks the answer ' + v);
      } else if (blanks && !it.calc && !byItem) say('nothing checks this row: ' + raw[ri]);
    });
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
    /* 4. a story: its answer follows from the numbers in it */
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
        const ok = o.map(x => num(x) === fromWords(pk.nw));
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
    if (it.data && it.q) it.data.forEach(n => { if (nums(it.q).indexOf(n) < 0) say('the data value ' + n + ' is not in the question'); });
    if (it.stat) {
      const d = (data || []).slice().sort((x, y) => x - y), n = d.length, cnt = {};
      d.forEach(v => { cnt[v] = (cnt[v] || 0) + 1; });
      const most = Math.max(...Object.values(cnt)), modes = Object.keys(cnt).filter(k => cnt[k] === most).map(Number);
      const all = { mean: d.reduce((x, y) => x + y, 0) / n, median: n % 2 ? d[(n - 1) / 2] : (d[n / 2 - 1] + d[n / 2]) / 2, range: d[n - 1] - d[0], mode: modes.length === 1 && most > 1 ? modes[0] : NaN };
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
    if (it.pt) { const q = at(it.pt); if (!q || ansAll.slice(-2).join() !== q.join()) say('point ' + it.pt + ' is at (' + (q || []).join(', ') + '), not (' + ansAll.slice(-2).join(', ') + ')'); }
    if (it.move) {
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
      const p = it.pic[1], c = p.seq.slice(0, p.core);
      if (p.seq.split('').some((ch, i) => ch !== c[i % p.core])) say('the shapes ' + p.seq + ' do not repeat the core ' + c);
      if (p.next.split('').some((ch, i) => ch !== c[(p.seq.length + i) % p.core])) say('the next shapes ' + p.next + ' do not carry on the core ' + c);
    }
    const ask = it.pic && it.pic[0] === 'grid' && it.pic[1].ask;
    if (ask && !nums(it.q).some(x => same(x, ask * num(it.pic[1].unit || 1)))) say('shading ' + ask + ' squares does not show the number asked for');
    /* 6. open questions need an example answer on the key */
    if (it.draw && !it.draw.key) say('a drawing question has no example on the key');
    if (it.lines && !it.lines.key) say('a written question has no example on the key');
    if (!it.eq && !pk && !it.draw && !it.lines && !(pc && pc.own) && !ask && !(it.pic && it.pic[0] === 'pat' && it.pic[1].next)) say('a question with nothing to answer');
    return bad;
  };
})();
