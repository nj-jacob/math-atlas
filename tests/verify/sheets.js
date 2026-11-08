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
    table: o => ({ blanks: o.rows.flat().filter(x => x === '[]').length, own: (o, a) => {
      const bad = []; let rate = null;
      o.rows.forEach(r => {
        const v = r.map(x => (x === '[]' ? a.shift() : x));
        if (v.some(x => typeof x !== 'number')) { bad.push('a table blank has no answer'); return; }
        const k = v[1] / v[0];
        if (rate === null) rate = k; else if (k !== rate) bad.push('table row ' + v.join(' and ') + ' does not keep ' + rate + ' for every 1');
      });
      return bad;
    } }),
    /* sheet-pics.js */
    blocks: o => ({ total: 100 * o.h + 10 * o.t + o.o }),
    tenframe: o => ({ total: o.a + o.b }),
    coins: o => ({ total: o.list.reduce((x, y) => x + y, 0) }),
    area: o => ({ total: o.rect ? o.rect[0] * o.rect[1] : o.cells.length }),
    wholes: o => ({ total: o.n }),
    cups: o => ({ total: o.n }),
    col: o => { const res = String(o.op === '+' ? o.a + o.b : o.a - o.b); return { blanks: res.length, own: (o, a) => (a.join('') === res ? [] : ['the column answer ' + a.join('') + ' is not ' + res]) }; },
    tally: o => (o.blank ? { blanks: o.cats.length, own: (o, a) => (a.join() === o.vals.join() ? [] : ['the tally counts ' + a.join() + ' do not match the tallies ' + o.vals.join()]) } : null),
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
    hill: [{ lo: 48000, hi: 49000, n: 48650 }], mix: [{ a: 2, b: 3, g: 4 }], grow: [{ m: 2, b: 1, k: 3 }], code: [{ lines: ['set total to 5', 'repeat 3 times', '  add 4 to total'] }], grid: [{ n: 37, unit: '1000' }]
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
      if (!/\[\]/.test(t)) return t;
      if (!a.length) { say('a box has no answer: ' + row); return '?'; }
      return t.replace('[]', a.shift());
    }).join(' '));
    if (a.length) say(a.length + ' answer(s) left over with no box');
    const raw = it.eq || [], ansAll = (it.a || []).slice(pc && pc.own ? pc.blanks : 0);
    /* rows whose answer is checked from the item itself further down (a digit's value, the biggest or smallest number from
       some digits, a remainder story) */
    const byItem = !!(it.dv || it.big || it.small || it.rem || it.fig || it.rule || it.expr || it.solve || it.ineq);
    filled.forEach((row, ri) => {
      const blanks = /\[\]/.test(raw[ri]);
      let worth;
      /* a row with a letter for a number (3n + 2 = [], n = []) is checked by its item's expr, solve, ineq or rule below */
      if ((it.expr || it.solve || it.ineq || it.rule) && /(^|[\d\s(])[a-z]\b/.test(row)) return;
      const rat = row.match(/\d+ ?: ?\d+/g);
      if (rat) {
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
        if (it.words != null) { if (fromWords(it.words) !== v) say('"' + it.words + '" is ' + fromWords(it.words) + ', not ' + v); }
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
      const inQ = nums(it.q + ' ' + (it.pic && it.pic[0] === 'code' ? it.pic[1].lines.join(' ') : ''));
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
        const ok = o.map(x => same(Math.round(num(x) / pk.round.to) * pk.round.to, pk.round.val));
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
    /* a fraction in simplest form: its top and bottom share no factor */
    if (it.simplest) (it.a || []).filter(v => /\//.test(v)).forEach(v => { const [n, d] = String(v).split(' ').pop().split('/').map(Number); for (let f = 2; f <= Math.min(n, d); f++) if (n % f === 0 && d % f === 0) say(v + ' is not in simplest form'); });
    const ask = it.pic && it.pic[0] === 'grid' && it.pic[1].ask;
    if (ask && nums(it.q).indexOf(ask * num(it.pic[1].unit || 1)) < 0) say('shading ' + ask + ' squares does not show the number asked for');
    /* 6. open questions need an example answer on the key */
    if (it.draw && !it.draw.key) say('a drawing question has no example on the key');
    if (it.lines && !it.lines.key) say('a written question has no example on the key');
    if (!it.eq && !pk && !it.draw && !it.lines && !(pc && pc.own) && !ask) say('a question with nothing to answer');
    return bad;
  };
})();
