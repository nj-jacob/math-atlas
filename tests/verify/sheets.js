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
  /* sheet maths into plain maths: × ÷ −, 12 500 as 12500, $4.50 as 4.50, "23 hundreds" as (23 * 100), a remainder "R" kept,
     and "3 groups of 4", "3 rows of 4", "3 jumps of 4" mean 3 × 4; other words go */
  const PLACE = { 'ten thousand': 10000, thousand: 1000, hundred: 100, ten: 10, one: 1 };
  function norm(s) {
    return String(s).replace(/(\d)[\u00a0 ](?=\d{3}\b)/g, '$1')
      .replace(/(\d+) (ten thousand|thousand|hundred|ten|one)s?\b/g, (m, n, pl) => '(' + n + ' * ' + PLACE[pl] + ')')
      .replace(/\$/g, '').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\b(groups|rows|jumps) of\b/g, '*')
      .replace(/ R (?=\d)/g, ' ~ ').replace(/\.(?!\d)|(?<!\d)\./g, ' ')
      .replace(/[A-Za-z’'?:]+/g, ' ').replace(/~/g, 'R').replace(/\s+/g, ' ').trim();
  }
  const nums = s => (String(s).replace(/(\d)[\u00a0 ](?=\d{3}\b)/g, '$1').match(/\d+(\.\d+)?/g) || []).map(Number);
  /* two values are the same when they differ only by rounding (0.1 + 0.2 and 0.3) */
  const same = (x, y) => Math.abs(x - y) < 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));
  /* the value of a number as a sheet writes it: 12 500, 3.75, $4.50 */
  const num = s => Number(String(s).replace(/\u00a0|\s/g, '').replace(/^\$/, ''));
  /* a whole number in words, such as "forty-two thousand six hundred five", or NaN */
  const SMALL = 'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(' ');
  const TENS = 'twenty thirty forty fifty sixty seventy eighty ninety'.split(' ');
  function fromWords(w) {
    let total = 0, cur = 0;
    for (const t of String(w).toLowerCase().replace(/-/g, ' ').split(/\s+/).filter(Boolean)) {
      if (SMALL.indexOf(t) >= 0) cur += SMALL.indexOf(t);
      else if (TENS.indexOf(t) >= 0) cur += (TENS.indexOf(t) + 2) * 10;
      else if (t === 'hundred') cur *= 100;
      else if (t === 'thousand') { total += cur * 1000; cur = 0; }
      else return NaN;
    }
    return total + cur;
  }
  /* is a statement such as "4 × 7 = 7 × 4" or "18 ÷ 2 = 8." true? null when it cannot be read */
  function truth(st) {
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
    nl: o => ((o.ask || []).length ? { blanks: o.ask.length, own: (o, a) => (a.join() === o.ask.join() ? [] : ['the number line answers ' + a.join() + ' are not ' + o.ask.join()]) } : null),
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
    pv: o => (o.shift ? { total: o.n } : null),
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
    blocks: [{ h: 3, t: 4, o: 5 }], tenframe: [{ a: 8, b: 5 }], col: [{ a: 368, b: 254, op: '+' }, [6, 2, 2]], frac: [{ n: 4, k: 3, shape: 'circle' }],
    wholes: [{ n: 5 }], pat: [{ seq: 'cstcst', blanks: 2, next: 'cs', core: 3 }], clock: [{ h: 3, m: 40, blank: true }],
    coins: [{ list: [500, 200, 100, 25, 10, 5] }], tag: [{ t: 'Juice box', p: 135 }], bar: [{ cats: ['A', 'B', 'C', 'D'], vals: [4, 7, 2, 5], max: 8, step: 2 }],
    tally: [{ cats: ['{many}', 'balls'], vals: [7, 12], blank: true }, [7, 12]], solids: [{ list: ['cube', 'prism', 'pyramid', 'cylinder'], letters: true }],
    area: [{ cols: 8, rows: 4, rect: [5, 3] }], rect: [{ a: 6, b: 3, unit: 'cm', all: true }], ruler: [{ len: 7, from: 0 }],
    balance: [{ l: 6, r: '{one}', tilt: 0 }], cups: [{ n: 6 }], nl: [{ min: 300, max: 400, tick: 10, lab: 50, pt: 370, ask: [330] }, [330]],
    map: [{ cols: 7, rows: 4, marks: [[1, 1, 'A'], [5, 2, 'B']], start: [0, 3, '>'], path: [[0, 3], [3, 3], [3, 1]] }], venn: [{ a: 'red', b: 'round' }],
    row: [{ list: [['frac', { n: 2, k: 1 }], ['frac', { n: 4, k: 2 }]], labels: ['A', 'B'] }],
    amodel: [{ a: 246, b: 3 }, [600, 120, 18]], mult: [{ a: 47, b: 26 }, [282, 940, 1222]], shareR: [{ t: 14, g: 4 }],
    chunks: [{ t: 372, d: 12, steps: [30, 1] }], pv: [{ n: 3.45, shift: 2, dir: 'x' }], disks: [{ list: [[10000, 2], [1000, 3], [100, 13], [1, 4]] }],
    hill: [{ lo: 48000, hi: 49000, n: 48650 }], grid: [{ n: 37, unit: '1000' }]
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
    filled.forEach(row => {
      if (/,/.test(row)) {
        const n = nums(row);
        if (n.length < 2 || n.some((x, i) => i > 1 && x - n[i - 1] !== n[1] - n[0])) say('the count does not go up by the same step: ' + row);
        return;
      }
      if (!/=/.test(row)) return;
      const rem = norm(row).match(/^(\d+) \/ (\d+) = (\d+) R (\d+)$/);
      if (rem) {
        const [t, d, q, r] = rem.slice(1).map(Number);
        if (q * d + r !== t || r >= d) say('the remainder sum is not right: ' + row + ' (' + d + ' × quotient + remainder must make ' + t + ', with the remainder less than ' + d + ')');
        return;
      }
      const sides = norm(row).split('='), v = sides.map(val);
      if (v.some(isNaN)) say('cannot read the sum: ' + row);
      else if (v.some(x => !same(x, v[0]))) say('the sum is not true: ' + row);
    });
    /* 3. the picture matches the sum: its total is in the first sum that shows it (as a number or as one side), and a
       times sum uses its two numbers */
    const shows = r => nums(r).indexOf(pc.total) >= 0 || norm(r).split('=').map(val).some(v => same(v, pc.total));
    const sums = filled.filter(r => /=/.test(r)), first = (pc && pc.total != null && sums.filter(shows)[0]) || sums[0];
    if (pc && pc.total != null && !sums.length && filled.length && !filled.some(r => nums(r).some(v => same(v, pc.total)))) say('the picture shows ' + pc.total + ' but the answer is ' + filled.join(', '));
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
      const inQ = nums(it.q);
      nums(it.calc).forEach(n => { if (inQ.indexOf(n) < 0) say('the story sum uses ' + n + ', which is not in the story'); });
    }
    /* 5. the circled choice */
    const pk = it.pick;
    if (pk) {
      const o = pk.opts, yes = pk.ans === 0;
      if (o[0] === '×' && o[1] === '÷') {
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
      } else if (pk.rnd) {
        const ok = o.map(x => Math.round(num(x) / pk.rnd.to) * pk.rnd.to === pk.rnd.is);
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice rounds to ' + pk.rnd.is);
      } else if (pk.small) {
        const v = o.map(x => val(norm(x)));
        if (v.some(isNaN) || v.some((x, i) => i !== pk.ans && x <= v[pk.ans])) say('the circled choice is not the least: ' + o.join(', '));
      } else if (pk.big) {
        const v = o.map(x => (isNaN(val(norm(x))) ? fromWords(x) : val(norm(x))));
        if (v.some(isNaN) || v.some((x, i) => i !== pk.ans && x >= v[pk.ans])) say('the circled choice is not the biggest: ' + o.join(', '));
      } else if (pk.val != null) {
        const ok = o.map(x => val(norm(x)) === pk.val);
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
    /* 5c. place value: a number in words, the value of a digit, rounding, the biggest or smallest number from some digits,
       putting numbers in order, and shading a grid */
    if (it.say != null && fromWords(it.say) !== (it.a || [])[0]) say('"' + it.say + '" is ' + fromWords(it.say) + ', not ' + (it.a || [])[0]);
    if (it.dv) {
      const digits = String(it.dv.n).replace(/\D/g, ''), at = digits.indexOf(String(it.dv.d));
      if (at < 0 || digits.indexOf(String(it.dv.d), at + 1) >= 0) say('the digit ' + it.dv.d + ' is not in ' + it.dv.n + ' exactly once');
      else if ((it.a || [])[0] !== it.dv.d * Math.pow(10, digits.length - 1 - at)) say('the ' + it.dv.d + ' in ' + it.dv.n + ' is worth ' + it.dv.d * Math.pow(10, digits.length - 1 - at));
    }
    if (it.round) {
      const r = Math.round(num(it.round.n) / it.round.to) * it.round.to;
      if ((it.a || []).slice(-1)[0] !== r) say(it.round.n + ' to the nearest ' + it.round.to + ' is ' + r);
    }
    if (it.big || it.small) {
      const d = (it.big || it.small).slice().sort((x, y) => (it.big ? y - x : x - y));
      if (it.small && d[0] === 0) { const k = d.findIndex(x => x > 0); d.unshift(d.splice(k, 1)[0]); }
      if ((it.a || [])[0] !== +d.join('')) say('the ' + (it.big ? 'biggest' : 'smallest') + ' number from those digits is ' + d.join(''));
    }
    filled.filter(r => /[<>]/.test(r) && !/=/.test(r)).forEach(row => {
      const v = row.split(/[<>]/).map(num), up = /</.test(row);
      if (v.some(isNaN) || v.some((x, i) => i && (up ? x <= v[i - 1] : x >= v[i - 1]))) say('the numbers are not in order: ' + row);
      if (it.set && it.set.map(num).sort((x, y) => x - y).join() !== v.slice().sort((x, y) => x - y).join()) say('the order does not use the given numbers: ' + row);
    });
    const ask = it.pic && it.pic[0] === 'grid' && it.pic[1].ask;
    if (ask && nums(it.q).indexOf(ask * num(it.pic[1].unit || 1)) < 0) say('shading ' + ask + ' squares does not show the number asked for');
    /* 6. open questions need an example answer on the key */
    if (it.draw && !it.draw.key) say('a drawing question has no example on the key');
    if (it.lines && !it.lines.key) say('a written question has no example on the key');
    if (!it.eq && !pk && !it.draw && !it.lines && !(pc && pc.own) && !ask) say('a question with nothing to answer');
    return bad;
  };
})();
