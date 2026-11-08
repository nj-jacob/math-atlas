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
      if (it.round) {
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
        if (it.words != null) { if (fromWords(it.words) !== v) say('"' + it.words + '" is ' + fromWords(it.words) + ', not ' + v); }
        else if (pc && pc.total != null) { if (pc.total !== v) say('the picture shows ' + pc.total + ', not ' + v); }
        else if (!it.calc) say('nothing checks the answer ' + v);
      } else if (blanks && !it.calc) say('nothing checks this row: ' + raw[ri]);
    });
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
      } else if (pk.round) {
        const ok = o.map(x => Math.round(+x / pk.round.to) * pk.round.to === pk.round.val);
        if (!ok[pk.ans] || ok.filter(Boolean).length !== 1) say('not exactly one choice rounds to ' + pk.round.val);
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
