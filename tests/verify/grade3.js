/* Answer checks for Grade 3 question shapes. Each check gets (q, q.meta, helpers) and returns
   an error message, or '' when the answer is right. Work the answer out here independently:
   never copy the site's own calculation. */
(function (V, H) {
  const set = (k, fn) => { if (V[k]) throw new Error('two answer checks share the key ' + k); V[k] = fn; };
  const bold = q => H.strip((q.q.match(/<b>([^<]+)<\/b>/) || [])[1] || '');
  const same = (a, b) => a.slice().sort().join() === b.slice().sort().join();
  /* works out a plain sum like "450 + 120 − 30" from its text */
  const ev = t => { const s = H.strip(t).replace(/\u2212/g, '-').replace(/\s+/g, ''); if (!/^\d+([+-]\d+)*$/.test(s)) return NaN; return s.match(/[+-]?\d+/g).reduce((a, b) => a + +b, 0); };
  const nums = t => (H.strip(t).match(/\d+/g) || []).map(Number);
  /* --- numbers-1000 (full chapter) --- */
  {
    const sub = q => q.fill.split('[[]]').map((part, i) => part + (i < q.answers.length ? String(q.answers[i]) : '')).join('');
    const pw = p => Math.pow(10, p);
    const dgt = (n, p) => Math.floor(n / pw(p)) % 10;
    const total = a => a.reduce((x, y) => x + y, 0);
    const htoVal = t => { const h = t.match(/(\d+) hundreds?/), te = t.match(/(\d+) tens?/), o = t.match(/(\d+) ones?/); return (h ? +h[1] * 100 : 0) + (te ? +te[1] * 10 : 0) + (o ? +o[1] : 0); };
    const opt = q => H.strip(q.options[q.answer]);
    const SY = { '<': (a, b) => a < b, '>': (a, b) => a > b, '=': (a, b) => a === b };
    set('g3n-tens', (q, m) => q.answer === Math.floor(m.n / 10) ? '' : 'tens in ' + m.n);
    set('g3n-rods', (q, m) => q.answer === m.t * 10 ? '' : 'rods');
    set('g3n-tensfill', q => { const g = H.strip(sub(q)).match(/(\d+) tens = (\d+)/); return g && +g[1] * 10 === +g[2] ? '' : 'tens'; });
    set('g3n-hmc', (q, m) => { const g = opt(q).match(/^(\d+) (tens?|ones?)$/); return g && +g[1] * (/ten/.test(g[2]) ? 10 : 1) === m.h * 100 ? '' : 'same as hundreds'; });
    set('g3n-tenstf', (q, m) => (m.t * 10 === m.said) === q.answer ? '' : 'truth');
    set('g3n-hund', (q, m) => q.answer === Math.floor(m.n / 100) ? '' : 'hundreds');
    set('g3n-sum', (q, m) => q.answer === m.a + m.b ? '' : 'sum');
    set('g3n-sub', (q, m) => q.answer === m.a - m.b ? '' : 'difference');
    set('g3n-digit', (q, m) => q.answer === dgt(m.n, m.p) ? '' : 'digit');
    set('g3n-read', (q, m) => q.answer === m.h * 100 + m.t * 10 + m.o ? '' : 'blocks');
    set('g3n-count3', (q, m) => q.answers.every(x => x <= 9) && q.answers[0] * 100 + q.answers[1] * 10 + q.answers[2] === m.n ? '' : 'counts');
    set('g3n-build', (q, m) => q.answer === m.n && bold(q) === String(m.n) ? '' : 'build');
    set('g3n-btap', (q, m) => m.set[q.answer] === m.n && new Set(m.set).size === m.set.length && q.tiles.length === m.set.length ? '' : 'tile');
    set('g3n-btf', (q, m) => (m.said === m.n) === q.answer ? '' : 'truth');
    set('g3n-val', (q, m) => H.placeVal(m.n, m.i) === q.answer ? '' : 'value');
    set('g3n-valtap', (q, m) => { const hits = [0, 1, 2].filter(i => H.placeVal(m.n, i) === m.val); return hits.length === 1 && String(hits[0]) === String(q.answer) ? '' : 'digit'; });
    set('g3n-valmc', (q, m) => { const ok = q.options.map(o => dgt(H.num(H.strip(o)), m.p) === m.dg); return ok[q.answer] && ok.filter(Boolean).length === 1 ? '' : 'number'; });
    set('g3n-valtf', (q, m) => (H.placeVal(m.n, m.i) === m.said) === q.answer ? '' : 'truth');
    set('g3n-valsum', (q, m) => total([0, 1, 2].filter(i => +String(m.n)[i] === m.d).map(i => H.placeVal(m.n, i))) === q.answer ? '' : 'total');
    set('g3n-place', (q, m) => opt(q) === ['hundreds', 'tens', 'ones'][m.i] ? '' : 'place');
    set('g3n-pow', (q, m) => q.answer === pw(m.p) ? '' : 'one of a place');
    set('g3n-words', (q, m) => q.answer === H.fromWords(m.w) ? '' : 'words');
    set('g3n-zmc', q => H.fromWords(bold(q)) === H.num(opt(q)) ? '' : 'number');
    set('g3n-ztf', (q, m) => (H.fromWords(bold(q)) === m.said) === q.answer ? '' : 'truth');
    set('g3n-wtf', (q, m) => (H.fromWords(bold(q)) === m.said) === q.answer ? '' : 'truth');
    set('g3n-to1000', (q, m) => q.answer + m.n === 1000 ? '' : 'to 1000');
    set('g3n-eq', q => { const s = H.strip(sub(q)).split('='); return s.length === 2 && ev(s[0]) === ev(s[1]) ? '' : 'sides'; });
    set('g3n-jumps', (q, m) => q.answer * m.by === Math.abs(m.to - m.from) ? '' : 'jumps');
    set('g3n-1000mc', q => { const U = { one: 1, ten: 10, hundred: 100 }; const v = o => { const g = H.strip(o).match(/^(\d+) (one|ten|hundred)s?$/); return g ? +g[1] * U[g[2]] : NaN; }; const ok = q.options.map(o => v(o) === 1000); return ok[q.answer] && ok.filter(Boolean).length === 1 ? '' : 'thousand'; });
    set('g3n-sumtf', (q, m) => (m.a + m.b === m.said) === q.answer ? '' : 'truth');
    set('g3n-std', (q, m) => q.answer === total(m.parts) ? '' : 'standard form');
    set('g3n-expfill', (q, m) => q.answers.join() === [0, 1, 2].map(i => H.placeVal(m.n, i)).filter(v => v).join() ? '' : 'parts');
    set('g3n-expmatch', q => q.pairs.every(p => H.sum(p[0]) === +p[1]) ? '' : 'pairs');
    set('g3n-partstf', (q, m) => (total(m.parts) === m.said) === q.answer ? '' : 'truth');
    set('g3n-wmc', (q, m) => H.fromWords(opt(q)) === m.n ? '' : 'words');
    set('g3n-wmatch', q => q.pairs.every(p => H.fromWords(p[0]) === +p[1]) ? '' : 'pairs');
    set('g3n-worder', q => { const v = q.items.map(H.fromWords); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
    set('g3n-tradefill', q => { const s = H.strip(sub(q)).split('='); return +s[0] === htoVal(s[1]) ? '' : 'trade'; });
    set('g3n-trademc', (q, m) => { const ok = q.options.map(o => htoVal(H.strip(o)) === m.n); return ok[q.answer] && ok.filter(Boolean).length === 1 ? '' : 'trade'; });
    set('g3n-tradetf', (q, m) => (m.h * 10 + m.t === m.said) === q.answer ? '' : 'truth');
    set('g3n-skipnext', (q, m) => q.answer === m.start + m.dir * m.by * m.j ? '' : 'next');
    set('g3n-skipfill', (q, m) => { const v = H.strip(sub(q)).split(',').map(Number), d = v[1] - v[0]; return Math.abs(d) === m.by && v.every((x, i) => !i || x - v[i - 1] === d) ? '' : 'sequence'; });
    set('g3n-skipline', (q, m) => q.answer === m.start + m.dir * m.by * m.j ? '' : 'landing');
    set('g3n-groups', (q, m) => q.answer === m.by * m.n ? '' : 'groups');
    set('g3n-skiptf', (q, m) => { const v = m.vals, d = v[1] - v[0]; return (Math.abs(d) === m.by && v.every((x, i) => !i || x - v[i - 1] === d)) === q.answer ? '' : 'truth'; });
    set('g3n-max', (q, m) => q.answer === Math.max(m.a, m.b) ? '' : 'greater');
    set('g3n-maxmc', q => { const v = q.options.map(o => H.num(H.strip(o))); return v[q.answer] === Math.max(...v) ? '' : 'greatest'; });
    set('g3n-dig', (q, m) => { const d = m.d, all = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) if (i !== j && j !== k && i !== k && d[i]) all.push(d[i] * 100 + d[j] * 10 + d[k]); return q.answer === (m.big ? Math.max(...all) : Math.min(...all)) ? '' : 'digits'; });
    set('g3n-gtf', (q, m) => (m.a > m.b) === q.answer ? '' : 'truth');
    set('g3n-cmpplace', (q, m) => { const x = dgt(m.a, m.p), y = dgt(m.b, m.p); return q.answer === (x > y ? 0 : x < y ? 1 : 2) ? '' : 'place'; });
    set('g3n-sym', (q, m) => SY[opt(q)] && SY[opt(q)](total(m.l), total(m.r)) ? '' : 'symbol');
    set('g3n-symtf', (q, m) => SY[['<', '>', '='][m.sym]](total(m.l), total(m.r)) === q.answer ? '' : 'truth');
    set('g3n-symread', (q, m) => opt(q) === m.a + ' ' + (m.a < m.b ? '<' : '>') + ' ' + m.b ? '' : 'sentence');
    set('g3n-sympick', (q, m) => same(m.opts.map((v, j) => (m.less ? v < m.x : v > m.x) ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
    set('g3n-order', (q, m) => { const v = q.items.map(Number); return v.every((x, i) => !i || (m.big ? x < v[i - 1] : x > v[i - 1])) ? '' : 'order'; });
    set('g3n-pickone', (q, m) => q.answer === (m.big ? Math.max(...m.opts) : Math.min(...m.opts)) ? '' : 'pick');
    set('g3n-mid', (q, m) => q.answer === m.opts.slice().sort((a, b) => a - b)[1] ? '' : 'middle');
    set('g3n-line', (q, m) => q.answer === m.n ? '' : 'point');
    set('g3n-between', (q, m) => { const ins = q.options.map(o => { const v = H.num(H.strip(o)); return v > m.lo && v < m.hi; }); return ins[q.answer] && ins.filter(Boolean).length === 1 ? '' : 'between'; });
    set('g3n-ordtf', (q, m) => (m.vals.every((x, i) => !i || x > m.vals[i - 1])) === q.answer ? '' : 'truth');
    set('g3n-round', (q, m) => q.answer === H.roundTo(m.n, m.p) ? '' : 'rounded');
    set('g3n-roundtap', (q, m) => { const dl = m.n - m.lo, dh = m.hi - m.n; return dl !== dh && String(dl < dh ? m.lo : m.hi) === String(q.answer) ? '' : 'closer end'; });
    set('g3n-roundfill', (q, m) => q.answers[0] <= m.n && q.answers[1] - q.answers[0] === m.p && q.answers[0] % m.p === 0 && q.answers[1] > m.n && q.answers[2] === H.roundTo(m.n, m.p) ? '' : 'rounding');
    set('g3n-sides', (q, m) => q.answers[0] <= m.n && q.answers[1] > m.n && q.answers[1] - q.answers[0] === m.p && q.answers[0] % m.p === 0 ? '' : 'sides');
    set('g3n-half', (q, m) => q.answer * 2 === m.lo * 2 + m.p ? '' : 'halfway');
    set('g3n-roundtf', (q, m) => (H.roundTo(m.n, m.p) === m.said) === q.answer ? '' : 'truth');
    set('g3n-roundpick', (q, m) => same(m.opts.map((v, j) => H.roundTo(v, m.p) === m.t ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
    set('g3n-roundboth', (q, m) => q.answers[0] === H.roundTo(m.n, 10) && q.answers[1] === H.roundTo(m.n, 100) ? '' : 'rounding');
    set('g3n-roundwhich', (q, m) => q.answer === (H.roundTo(m.n, 10) === m.r ? 0 : H.roundTo(m.n, 100) === m.r ? 1 : 2) ? '' : 'which');
  }
  /* --- add-subtract (full chapter) --- */
  {
    const op = (a, o, b) => o === '+' ? a + b : a - b;
    const opt = q => H.strip(q.options[q.answer]);
    const dg = (n, p) => Math.floor(n / Math.pow(10, p)) % 10;
    const near = (n, p) => Math.round(n / p) * p;
    const KIND = { join: '+', more: '+', separate: '-', compare: '-', part: '-', change: '-' };
    /* every filled line with "=" must be a true equation, and every blank must sit in the maths of such a line */
    const eqs = q => {
      let i = 0;
      for (const line of q.fill.split(/<br\s*\/?>/)) {
        const s = H.strip(line), n = s.split('[[]]').length - 1;
        if (!s.includes('=')) { if (n) return 'a blank outside an equation'; continue; }
        const m = s.match(/[\d[][\d\s+−=[\]]*$/);
        if (!m || m[0].split('[[]]').length - 1 !== n) return 'a blank outside the maths';
        const parts = m[0].replace(/\[\[\]\]/g, () => String(q.answers[i++])).split('=');
        if (parts.length < 2 || parts.some(p => isNaN(ev(p)) || ev(p) !== ev(parts[0]))) return 'not equal: ' + m[0];
      }
      return i === q.answers.length ? '' : 'blank count';
    };
    set('g3as-calc', (q, m) => q.answer === op(m.a, m.op, m.b) ? '' : 'result');
    set('g3as-calctf', (q, m) => (op(m.a, m.op, m.b) === m.said) === q.answer ? '' : 'truth');
    set('g3as-row', (q, m) => m.list.length === q.answers.length && m.list.every((c, j) => q.answers[j] === op(c[0], c[1], c[2])) && eqs(q) === '' ? '' : 'row');
    set('g3as-eqs', q => eqs(q));
    set('g3as-tonext', (q, m) => (m.a + q.answer) % 10 === 0 && q.answer >= 1 && q.answer <= 10 ? '' : 'next ten');
    set('g3as-missing', (q, m) => m.a + q.answer === m.t ? '' : 'missing');
    set('g3as-addn', (q, m) => q.answer === m.list.reduce((x, y) => x + y, 0) ? '' : 'sum');
    set('g3as-friend', (q, m) => q.answer % 10 === 0 && q.answer > m.b && q.answer - m.b < 10 ? '' : 'friendly ten');
    set('g3as-ndmc', q => { const ok = q.options.map(o => { const n = nums(o); return n.length === 2 && Math.abs(n[0] - n[1]) === 1; }); return ok[q.answer] && ok.filter(Boolean).length === 1 ? '' : 'near double'; });
    set('g3as-bondmatch', q => q.pairs.every(p => { const l = nums(p[0]), r = nums(p[1]); return l[0] - l[1] === r[1] && r[0] === l[1] && r[2] === l[0]; }) ? '' : 'pairs');
    set('g3as-calcmatch', q => q.pairs.every(p => ev(p[0]) === +H.strip(p[1])) ? '' : 'pairs');
    set('g3as-friendmc', (q, m) => { const ok = q.options.map(o => ev(o) === op(m.a, m.op, m.b) && nums(o).some(n => n % 10 === 0 && n !== m.a)); return ok[q.answer] && ok.filter(Boolean).length === 1 ? '' : 'friendly way'; });
    set('g3as-build', (q, m) => q.answer === op(m.a, m.op, m.b) ? '' : 'build');
    set('g3as-colstep', (q, m) => { const o = dg(m.a, 0) + dg(m.b, 0); return q.answers[0] === o && q.answers[1] === o % 10 && q.answers[2] === (o >= 10 ? 1 : 0) ? '' : 'ones column'; });
    set('g3as-digit', (q, m) => q.answer === dg(op(m.a, m.op, m.b), m.p) ? '' : 'digit');
    set('g3as-trade', (q, m) => { const [h, t, o] = q.answers, d = [dg(m.n, 2), dg(m.n, 1), dg(m.n, 0)]; const moved = m.p === 0 ? h === d[0] && t === d[1] - 1 && o === d[2] + 10 : h === d[0] - 1 && t === d[1] + 10 && o === d[2]; return moved && h * 100 + t * 10 + o === m.n ? '' : 'trade'; });
    set('g3as-est', (q, m) => q.answer === op(near(m.a, m.p), m.op, near(m.b, m.p)) ? '' : 'estimate');
    set('g3as-estfill', (q, m) => q.answers[0] === near(m.a, m.p) && q.answers[1] === near(m.b, m.p) && q.answers[2] === op(q.answers[0], m.op, q.answers[1]) ? '' : 'estimate');
    set('g3as-estmc', (q, m) => +opt(q) === op(near(m.a, m.p), m.op, near(m.b, m.p)) ? '' : 'estimate');
    set('g3as-estex', (q, m) => q.answers[0] === op(near(m.a, m.p), m.op, near(m.b, m.p)) && q.answers[1] === op(m.a, m.op, m.b) ? '' : 'estimate and exact');
    set('g3as-rnd', (q, m) => q.answer === near(m.n, m.p) ? '' : 'rounding');
    set('g3as-invmc', (q, m) => { const ok = q.options.map(o => { const s = H.strip(o), n = nums(o); return /\+/.test(s) && n.length === 3 && n[0] + n[1] === n[2] && n[2] === m.a && same(n.slice(0, 2), [m.a - m.b, m.b]); }); return ok[q.answer] && ok.filter(Boolean).length === 1 ? '' : 'check'; });
    set('g3as-wordfill', (q, m) => { const [x, y, r] = q.answers; return (m.op === '+' ? same([x, y], [m.a, m.b]) : x === m.a && y === m.b) && r === op(m.a, m.op, m.b) ? '' : 'sentence'; });
    set('g3as-op', (q, m) => opt(q) === (KIND[m.kind] === '+' ? 'Add' : 'Subtract') ? '' : 'operation');
    set('g3as-optf', (q, m) => (KIND[m.kind] === m.said) === q.answer ? '' : 'truth');
    set('g3as-two', (q, m) => q.answer === op(op(m.a, m.o1, m.b), m.o2, m.c) ? '' : 'two steps');
    set('g3as-eqtf', (q, m) => (op(m.l[0], m.l[1], m.l[2]) === op(m.r[0], m.r[1], m.r[2])) === q.answer ? '' : 'truth');
    set('g3as-eqpick', (q, m) => same(q.options.map((o, j) => ev(o) === m.t ? j : -1).filter(j => j >= 0), q.answer) && q.answer.length ? '' : 'picks');
    set('g3as-eqmatch', q => { const v = q.pairs.map(p => ev(p[1])); return q.pairs.every(p => ev(p[0]) === ev(p[1])) && new Set(v).size === v.length ? '' : 'pairs'; });
    set('g3as-eqstory', (q, m) => m.c + q.answer === m.a + m.b ? '' : 'balance');
  }
  /* --- multiply-divide (full chapter) --- */
  {
    const F = (a, b, op) => ({ x: a * b, d: a / b, '+': a + b, '-': a - b, a: a, b: b, '%': a % b })[op];
    /* works out a sum written with ×, ÷, + and − (× and ÷ first) */
    const calc = t => {
      const s = H.strip(t).replace(/×/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').replace(/\s+/g, '');
      if (!/^\d+([*\/+-]\d+)*$/.test(s)) return NaN;
      const tk = s.match(/\d+|[*\/+-]/g), terms = []; let cur = +tk[0], sign = 1;
      for (let i = 1; i < tk.length; i += 2) { const o = tk[i], v = +tk[i + 1]; if (o === '*') cur *= v; else if (o === '/') cur /= v; else { terms.push(sign * cur); sign = o === '+' ? 1 : -1; cur = v; } }
      terms.push(sign * cur);
      return terms.reduce((a, b) => a + b, 0);
    };
    /* fills the blanks, then every "a = b = c" in the sentence must be true */
    const chains = (text, answers) => { let j = 0; const t = text.replace(/\[\[\]\]/g, () => String(answers[j++])); return H.strip(t.replace(/<br>/g, '|')).split(/\||because|,|\bso\b/).map(x => x.trim()).filter(Boolean).every(part => { const v = part.split('=').map(calc); return v.length > 1 && v.every(x => !isNaN(x) && Math.abs(x - v[0]) < 1e-9); }); };
    /* reads a plates or bags picture: number of groups, counters in each, counters still to share */
    const plates = svg => { const d = document.createElement('div'); d.innerHTML = svg || ''; const g = d.querySelectorAll('[data-p="g"]').length, on = []; for (let i = 0; i < g; i++) on.push(d.querySelectorAll('[data-on="' + i + '"]').length); return { g, on, pile: d.querySelectorAll('[data-p="pile"]').length, sum: on.reduce((a, b) => a + b, 0) }; };
    const level = p => p.on.every(x => x === p.on[0]);
    /* reads an array picture: dots, rows, dots in a row, and the two colours of a split array */
    const dots = svg => { const d = document.createElement('div'); d.innerHTML = svg || ''; const c = [...d.querySelectorAll('[data-a="d"]')], ys = new Set(c.map(x => x.getAttribute('cy'))); return { n: c.length, rows: ys.size, per: ys.size ? c.length / ys.size : 0, top: c.filter(x => /strand/.test(x.getAttribute('style'))).length, low: c.filter(x => /--hi/.test(x.getAttribute('style'))).length }; };
    const oneTile = (q, ok) => { const hit = q.tiles.map((t, j) => ok(t) ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === q.answer; };
    const opt = q => H.strip(q.options[q.answer]);
    const famFact = (o, a, b) => { const s = H.strip(o).match(/^(\d+) ([×÷]) (\d+) = (\d+)$/); return !!s && calc(s[1] + s[2] + s[3]) === +s[4] && [+s[1], +s[3], +s[4]].sort((x, y) => x - y).join() === [a, b, a * b].sort((x, y) => x - y).join(); };
    set('g3md-num', (q, m) => q.answer === F(m.a, m.b, m.op) ? '' : 'answer');
    set('g3md-line', (q, m) => q.answer === F(m.a, m.b, m.op) ? '' : 'landing');
    set('g3md-bare', q => { const s = H.strip(q.q).match(/(\d+) ([×÷+−]) (\d+)/); return s && calc(s[1] + s[2] + s[3]) === q.answer ? '' : 'sum'; });
    set('g3md-eqs', q => chains(q.fill, q.answers) ? '' : 'equation');
    set('g3md-fill', (q, m) => m.ops.every((o, i) => F(o[0], o[1], o[2]) === q.answers[i]) ? '' : 'table');
    set('g3md-tf', (q, m) => (F(m.a, m.b, m.op) === m.said) === q.answer ? '' : 'truth');
    set('g3md-mc', (q, m) => +opt(q) === F(m.a, m.b, m.op) ? '' : 'choice');
    set('g3md-match-eval', q => q.pairs.every(p => calc(p[0]) === +H.strip(p[1])) ? '' : 'pairs');
    /* equal groups */
    set('g3md-fig-total', q => { const p = plates(q.fig); return level(p) && p.sum === q.answer ? '' : 'total'; });
    set('g3md-fig-fill', q => { const p = plates(q.fig); return level(p) && q.answers.join() === [p.g, p.on[0], p.sum].join() ? '' : 'blanks'; });
    set('g3md-fig-fact', q => { const p = plates(q.fig); return level(p) && q.answers.join() === [p.g, p.on[0], p.sum].join() ? '' : 'fact'; });
    set('g3md-tap-equal', q => oneTile(q, t => level(plates(t))) ? '' : 'tile');
    set('g3md-tf-equal', (q, m) => { const p = plates(q.fig); return (level(p) && p.on[0] === m.n) === q.answer ? '' : 'truth'; });
    set('g3md-tap-plates', (q, m) => oneTile(q, t => { const p = plates(t); return p.g === m.g && level(p) && p.on[0] === m.n; }) ? '' : 'tile');
    set('g3md-add-mc', (q, m) => { const t = opt(q).split('+').map(Number); return t.length === m.g && t.every(x => x === m.n) ? '' : 'addition'; });
    set('g3md-fact-mc', (q, m) => { const s = opt(q).match(/^(\d+) × (\d+) = (\d+)$/); return s && +s[1] === m.g && +s[2] === m.n && +s[3] === m.g * m.n ? '' : 'fact'; });
    /* arrays */
    set('g3md-arr-total', q => dots(q.fig).n === q.answer ? '' : 'dots');
    set('g3md-arr-fill', q => { const g = dots(q.fig); return q.answers.join() === [g.rows, g.per, g.n].join() ? '' : 'blanks'; });
    set('g3md-arr-mc', q => { const g = dots(q.fig), s = opt(q).match(/^(\d+) × (\d+)$/); return s && +s[1] === g.rows && +s[2] === g.per ? '' : 'array'; });
    set('g3md-tap-arr', (q, m) => oneTile(q, t => { const g = dots(t); return g.rows === m.a && g.per === m.b; }) ? '' : 'tile');
    set('g3md-tf-arr', (q, m) => { const g = dots(q.fig); return (g.rows === m.a && g.per === m.b) === q.answer ? '' : 'truth'; });
    set('g3md-match-turn', q => q.pairs.every(p => { const a = nums(p[0]), b = nums(p[1]); return a[0] === b[1] && a[1] === b[0] && a[0] !== a[1]; }) ? '' : 'pairs');
    set('g3md-split-fill', q => { const g = dots(q.fig); return q.answers.join() === [g.top, g.low, g.n].join() ? '' : 'parts'; });
    set('g3md-split-mc', (q, m) => { const n = nums(opt(q)); return /×/.test(opt(q)) && n[0] === m.r - m.s && n[1] === m.c ? '' : 'part'; });
    /* facts of 2, 5 and 10 */
    set('g3md-skipfill', (q, m) => { let j = 0; const v = H.strip(q.fill.replace(/\[\[\]\]/g, () => String(q.answers[j++]))).split(',').map(Number); return v.every((x, i) => x % m.f === 0 && (!i || x - v[i - 1] === m.f)) ? '' : 'sequence'; });
    set('g3md-useturn-mc', (q, m) => { const s = opt(q).match(/by (\d+)s, (\d+) times/); return s && +s[1] === m.f && +s[2] === m.n ? '' : 'way'; });
    set('g3md-turn-mc', (q, m) => { const n = nums(opt(q)); return /×/.test(opt(q)) && n[0] === m.b && n[1] === m.a ? '' : 'turn'; });
    set('g3md-next', q => { const n = nums(q.q).slice(-3); return n[1] - n[0] === n[2] - n[1] && n[2] + n[2] - n[1] === q.answer ? '' : 'next'; });
    set('g3md-pick-mult', (q, m) => same(q.options.map((o, j) => +o % m.f === 0 && +o <= 10 * m.f ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
    set('g3md-tf-mult', (q, m) => (m.v % m.f === 0 && m.v <= 10 * m.f) === q.answer ? '' : 'truth');
    set('g3md-ends', (q, m) => { const want = [...new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => i * m.f % 10))].sort().join(); return (opt(q).match(/\d/g) || []).sort().join() === want ? '' : 'last digits'; });
    set('g3md-yn-mult', (q, m) => /^Yes/.test(opt(q)) === (m.v % m.f === 0) ? '' : 'yes or no');
    set('g3md-near-mc', (q, m) => { const ok = o => { const s = H.strip(o).match(/(\d+) × (\d+), then (add|take away) (\d+)/); return !!s && +s[1] * +s[2] + (s[3] === 'add' ? 1 : -1) * +s[4] === m.r * m.c; }; return oneTile({ tiles: q.options, answer: q.answer }, ok) ? '' : 'strategy'; });
    set('g3md-near-dir', (q, m) => /more/.test(opt(q)) === (m.r > m.base) ? '' : 'more or less');
    /* dividing */
    set('g3md-share-fig', q => { const p = plates(q.fig); return p.g && q.answer * p.g === p.pile ? '' : 'share'; });
    set('g3md-tap-share', (q, m) => oneTile(q, t => { const p = plates(t); return p.g === m.g && level(p) && p.sum === m.n; }) ? '' : 'tile');
    set('g3md-tf-fair', q => level(plates(q.fig)) === q.answer ? '' : 'truth');
    set('g3md-group-fig', (q, m) => q.answer * m.s === plates(q.fig).pile ? '' : 'bags');
    set('g3md-mc-expr', (q, m) => oneTile({ tiles: q.options, answer: q.answer }, o => Math.abs(calc(o) - F(m.a, m.b, m.op)) < 1e-9) ? '' : 'number sentence');
    set('g3md-mean', (q, m) => ({ share: /each group/, group: /many groups/, times: /in all/ })[m.kind].test(opt(q)) ? '' : 'meaning');
    set('g3md-know', (q, m) => ({ times: /^How many groups/, share: /how many groups$/, group: /in each group$/ })[m.kind].test(opt(q)) ? '' : 'what is known');
    set('g3md-op', (q, m) => opt(q) === (m.kind === 'times' ? 'Multiply' : 'Divide') ? '' : 'operation');
    set('g3md-two', (q, m) => q.answer * m.d === m.g * m.n ? '' : 'two steps');
    /* fact families and checking */
    set('g3md-pick-fam', (q, m) => same(q.options.map((o, j) => famFact(o, m.a, m.b) ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
    set('g3md-fam-odd', (q, m) => oneTile({ tiles: q.options, answer: q.answer }, o => !famFact(o, m.a, m.b)) ? '' : 'odd one out');
    set('g3md-check-mc', (q, m) => { const s = opt(q).match(/^(\d+) × (\d+) = (\d+)$/); return s && +s[1] * +s[2] === +s[3] && +s[3] === m.n && +s[2] === m.d ? '' : 'check'; });
    set('g3md-yn-check', (q, m) => /^Yes/.test(opt(q)) === (m.said * m.d === m.n) ? '' : 'check');
    /* scaling */
    set('g3md-scale-from', (q, m) => q.answer === m.t / m.a * m.b ? '' : 'scale');
    set('g3md-match-ratio', (q, m) => q.pairs.every(p => nums(p[0])[0] * m.f === nums(p[1])[0]) ? '' : 'pairs');
  }
  /* ---- Fractions (a full chapter: every key starts with g3fr-) ---- */
  /* reads a picture: [shaded parts, all parts], counting bars, grid cells and circle slices */
  const shade = svg => { const d = document.createElement('div'); d.innerHTML = svg || ''; const r = [...d.querySelectorAll('rect, path')].filter(x => /stroke:var\(--ink\)/.test(x.getAttribute('style') || '')); return [r.filter(x => /fill:var\(--strand\)/.test(x.getAttribute('style'))).length, r.length]; };
  /* reads "2 and 1/3", "1/4" or "3" written with fraction markup */
  const amount = h => { const d = document.createElement('div'); d.innerHTML = h; const f = d.querySelector('.fr'); let v = 0; if (f) { const s = f.querySelectorAll('span'); v = +s[0].textContent / +s[1].textContent; f.remove(); } const w = d.textContent.match(/\d+/); return v + (w ? +w[0] : 0); };
  const fracs = h => { const d = document.createElement('div'); d.innerHTML = h; return [...d.querySelectorAll('.fr')].map(f => { const s = f.querySelectorAll('span'); return [+s[0].textContent, +s[1].textContent]; }); };
  const PIECE = { half: 2, halves: 2, third: 3, thirds: 3, fourth: 4, fourths: 4, fifth: 5, fifths: 5, sixth: 6, sixths: 6, eighth: 8, eighths: 8, tenth: 10, tenths: 10 };
  const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const pieceIn = t => { const w = (H.strip(t).toLowerCase().match(/\b(halves|half|thirds?|fourths?|fifths?|sixths?|eighths?|tenths?)\b/g) || []); return w.length ? PIECE[w[w.length - 1]] : NaN; };
  const near = (a, b) => Math.abs(a - b) < 1e-9;
  /* the right choice is the only one worth v */
  const only = (q, v, of) => { of = of || amount; const hit = q.options.map((o, j) => near(of(o), v) ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === q.answer; };
  const tiles = (q, ok) => { const hit = q.tiles.map((t, j) => ok(shade(t)) ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === q.answer; };
  const ascending = vs => vs.every((x, i) => !i || x > vs[i - 1]);
  const sumOf = h => fracs(h).reduce((a, f) => a + f[0] / f[1], 0);
  const even = ws => ws.every(w => w === ws[0]);
  const wholes = (n, d) => { let w = 0; while ((w + 1) * d <= n) w++; return w; };
  const picked = q => H.strip(q.options[q.answer]);
  /* equal parts */
  set('g3fr-eq-name', (q, m) => { const t = picked(q), want = !even(m.ws) ? 'unequal' : m.ws.length !== m.d ? 'count' : 'yes'; const got = /^Yes/.test(t) ? 'yes' : /not equal/.test(t) ? 'unequal' : /does not have|there are not/.test(t) ? 'count' : '?'; return got === want && (!q.fig || shade(q.fig)[1] === m.ws.length) ? '' : 'equal parts'; });
  set('g3fr-eq-count', (q, m) => q.answer === m.ws.length ? '' : 'count');
  set('g3fr-eq-size', (q, m) => { const t = picked(q), mx = Math.max(...m.ws), mn = Math.min(...m.ws); const want = even(m.ws) ? /same size/ : m.ws.filter(w => w === mx).length === 1 ? /bigger/ : /smaller/; return want.test(t) ? '' : 'sizes'; });
  set('g3fr-eq-tap', (q, m) => { const fit = m.sets.map((s, j) => even(s) && s.length === m.d && shade(q.tiles[j])[1] === s.length ? j : -1).filter(j => j >= 0); return fit.length === 1 && fit[0] === q.answer ? '' : 'tile'; });
  set('g3fr-eq-tf', (q, m) => (even(m.ws) && m.ws.length === m.d) === q.answer && shade(q.fig)[1] === m.ws.length ? '' : 'truth');
  /* naming pieces */
  set('g3fr-pc-mc', (q, m) => { const t = q.options[q.answer], f = fracs(t); const ok = f.length ? f[0][0] === 1 && f[0][1] === m.d : pieceIn(t) === m.d; return ok && (!q.fig || shade(q.fig)[1] === m.d) ? '' : 'piece name'; });
  set('g3fr-pc-count', (q, m) => q.answer === m.d ? '' : 'parts');
  set('g3fr-pc-tap', q => { const d = pieceIn(q.q.match(/one (\w+)/)[1]); return tiles(q, s => s[0] === 1 && s[1] === d) ? '' : 'tile'; });
  set('g3fr-pc-match', q => q.pairs.every(p => { const f = fracs(p[1])[0]; return f[0] === 1 && f[1] === pieceIn(p[0]); }) ? '' : 'pairs');
  set('g3fr-pc-tf', q => (pieceIn(H.strip(q.q).match(/is one (\w+)/)[1]) === shade(q.fig)[1]) === q.answer ? '' : 'truth');
  /* top and bottom numbers */
  set('g3fr-nm-mc', (q, m) => { const s = q.fig ? shade(q.fig) : [m.n, m.d], f = fracs(q.options[q.answer])[0]; return f[0] === s[0] && f[1] === s[1] ? '' : 'fraction'; });
  set('g3fr-nm-fill', q => shade(q.fig).join() === q.answers.join() ? '' : 'counts');
  set('g3fr-nm-tap', q => { const f = fracs(q.q)[0]; return tiles(q, s => s[0] === f[0] && s[1] === f[1]) ? '' : 'tile'; });
  set('g3fr-nm-not', q => { const s = shade(q.fig), f = fracs(q.options[q.answer])[0]; return f[0] === s[1] - s[0] && f[1] === s[1] ? '' : 'white parts'; });
  set('g3fr-nm-match', q => q.pairs.every(p => { const w = H.strip(p[0]).split(' '), f = fracs(p[1])[0]; return WORD.indexOf(w[0]) === f[0] && PIECE[w[1]] === f[1]; }) ? '' : 'pairs');
  set('g3fr-nm-tf', q => { const s = shade(q.fig), f = fracs(q.q)[0]; return (f[0] === s[0] && f[1] === s[1]) === q.answer ? '' : 'truth'; });
  set('g3fr-nm-all', (q, m) => q.answer === m.d ? '' : 'all parts');
  set('g3fr-nm-shaded', (q, m) => q.answer === m.n ? '' : 'shaded parts');
  /* fair shares */
  set('g3fr-dl-fill', (q, m) => q.answers[0] * m.k2 + q.answers[1] === m.items && q.answers[1] >= 0 && q.answers[1] < m.k2 ? '' : 'share');
  set('g3fr-dl-whole', (q, m) => (q.type === 'mc' ? +picked(q) : q.answer) === wholes(m.items, m.k2) ? '' : 'wholes each');
  set('g3fr-dl-left', (q, m) => q.answer === m.items - m.k2 * wholes(m.items, m.k2) ? '' : 'left over');
  set('g3fr-dl-story', (q, m) => { const ok = o => { const n = nums(o); return n[0] * m.k2 + n[1] === m.items && n[1] < m.k2; }; const hit = q.options.map((o, j) => ok(o) ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === q.answer ? '' : 'share'; });
  set('g3fr-dl-tf', (q, m) => (m.w * m.k2 + m.l === m.items && m.l < m.k2) === q.answer ? '' : 'truth');
  set('g3fr-dl-times', (q, m) => q.answers[0] * m.k2 === q.answers[1] && q.answers[1] + q.answers[2] === m.items && q.answers[2] < m.k2 ? '' : 'times');
  set('g3fr-mul', (q, m) => q.answer === m.a * m.b ? '' : 'product');
  set('g3fr-share', (q, m) => only(q, m.items / m.k2) ? '' : 'share');
  set('g3fr-sh-cut', (q, m) => q.answer === m.k2 ? '' : 'pieces');
  set('g3fr-sh-match', q => q.pairs.every(p => { const n = nums(p[0]); return near(amount(p[1]) * n[1], n[0]); }) ? '' : 'pairs');
  set('g3fr-sh-tf', (q, m) => near((m.said[0] + m.said[1] / m.said[2]) * m.k2, m.items) === q.answer ? '' : 'truth');
  set('g3fr-fw-fill', (q, m) => q.answers[0] === m.k2 && q.answers[1] === m.items ? '' : 'pieces');
  set('g3fr-fw-tap', (q, m) => tiles(q, s => near(s[0] / s[1] * m.k2, m.items)) ? '' : 'tile');
  set('g3fr-fw-tf', (q, m) => near(m.s[0] / m.s[1] * m.k2, m.items) === q.answer ? '' : 'truth');
  set('g3fr-fw-count', (q, m) => q.answer === m.items ? '' : 'pieces each');
  set('g3fr-cs-mc', (q, m) => { const x = m.a[0] * m.b[1], y = m.b[0] * m.a[1]; return q.options.length === 3 && q.answer === (x > y ? 0 : x < y ? 1 : 2) ? '' : 'who gets more'; });
  set('g3fr-cs-which', (q, m) => { const va = m.a[0] / m.a[1], vb = m.b[0] / m.b[1], t = q.options[q.answer]; return (near(va, vb) ? /same/.test(H.strip(t)) : near(amount(t), Math.max(va, vb))) ? '' : 'bigger share'; });
  set('g3fr-cs-tf', (q, m) => (m.x[0] * m.y[1] > m.y[0] * m.x[1]) === q.answer ? '' : 'truth');
  set('g3fr-cs-order', q => ascending(q.items.map(t => { const n = nums(t); return n[0] / n[1]; })) ? '' : 'order');
  /* unit fractions */
  set('g3fr-ct-mc', (q, m) => { const f = fracs(q.q).filter(x => x[0] === 1); return (f.length < 2 || f.length === m.n) && only(q, m.n / m.d) ? '' : 'sum'; });
  set('g3fr-ct-line', (q, m) => near(q.answer, m.n / m.d) ? '' : 'landing');
  set('g3fr-ct-fill', (q, m) => fracs(q.fill).filter(f => f[0] === 1 && f[1] === m.d).length === q.answers[0] ? '' : 'count');
  set('g3fr-ct-pic', q => { const s = shade(q.fig); return only(q, s[0] / s[1], sumOf) ? '' : 'sum'; });
  set('g3fr-ct-tf', q => { const f = fracs(q.q), said = f[f.length - 1]; return near(f.slice(0, -1).reduce((a, p) => a + p[0] / p[1], 0), said[0] / said[1]) === q.answer ? '' : 'truth'; });
  set('g3fr-ct-n', (q, m) => q.answer === m.n ? '' : 'pieces');
  set('g3fr-tp-num', q => { const f = fracs(q.q); return near(q.answer * f[0][0] / f[0][1], f[1][0] / f[1][1]) && f[0][0] === 1 ? '' : 'pieces'; });
  set('g3fr-tp-mc', (q, m) => only(q, m.n / m.d, sumOf) && fracs(q.options[q.answer]).every(f => f[0] === 1 && f[1] === m.d) ? '' : 'addition');
  set('g3fr-tp-order', q => ascending(q.items.map(amount)) ? '' : 'order');
  set('g3fr-tp-tf', (q, m) => (m.s === m.n) === q.answer ? '' : 'truth');
  set('g3fr-tp-n', (q, m) => q.answer === m.n ? '' : 'top number');
  set('g3fr-ps-mc', (q, m) => only(q, m.n / m.d) ? '' : 'mixed number');
  set('g3fr-ps-fill', (q, m) => q.answers[0] * m.d + q.answers[1] === m.n && q.answers[1] < m.d ? '' : 'wholes');
  set('g3fr-ps-line', (q, m) => near(q.answer, m.n / m.d) ? '' : 'point');
  set('g3fr-ps-match', q => q.pairs.every(p => near(amount(p[0]), amount(p[1]))) ? '' : 'pairs');
  set('g3fr-ps-tf', (q, m) => near(amount(m.said), m.n / m.d) === q.answer ? '' : 'truth');
  set('g3fr-ps-one', (q, m) => q.answer === m.d ? '' : 'one whole');
  set('g3fr-ps-w', q => { const f = fracs(q.q)[0]; return q.answer === wholes(f[0], f[1]) ? '' : 'wholes'; });
  set('g3fr-ps-r', (q, m) => q.answer === m.n - m.d * wholes(m.n, m.d) ? '' : 'left');
  /* equivalent fractions */
  set('g3fr-eqv-fill', q => { const f = fracs(q.fill)[0], d = pieceIn(q.fill.split('[[]]')[1]); return q.answers[0] * f[1] === f[0] * d ? '' : 'equivalent'; });
  set('g3fr-eqv-mc', (q, m) => only(q, m.w + m.n / m.a) ? '' : 'equivalent');
  set('g3fr-eqv-tap', q => { const s = shade(q.fig); return tiles(q, t => t[0] * s[1] === s[0] * t[1]) ? '' : 'tile'; });
  set('g3fr-eqv-tf', q => { const f = fracs(q.q); return (f[0][0] * f[1][1] === f[1][0] * f[0][1]) === q.answer ? '' : 'truth'; });
  set('g3fr-eqv-match', q => q.pairs.every(p => near(amount(p[0]), amount(p[1]))) && new Set(q.pairs.map(p => amount(p[0]).toFixed(6))).size === q.pairs.length ? '' : 'pairs');
  set('g3fr-eqv-story', q => { const f = fracs(q.q)[0], b = +H.strip(q.q).match(/into (\d+) equal pieces/)[1]; return q.answer * f[1] === f[0] * b ? '' : 'pieces'; });
  set('g3fr-eqv-each', (q, m) => q.answer * m.a === m.b ? '' : 'small pieces');
  set('g3fr-eqv-n', (q, m) => q.answer === m.n ? '' : 'shaded');
  set('g3fr-eqv-step', q => { const f = fracs(q.q)[0], d = pieceIn(q.q.split('how many')[1]); return q.answer * f[1] === f[0] * d ? '' : 'equivalent'; });
  set('g3fr-es-pick', (q, m) => same(q.options.map((o, j) => near(amount(o) * m.k2, m.items) ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('g3fr-es-mc', (q, m) => only(q, m.items / m.k2) ? '' : 'same share');
  set('g3fr-es-fill', (q, m) => { const f = fracs(q.fill); return near(q.answers[0] / f[0][1], m.items / m.k2) && near(q.answers[1] / f[1][1], m.items / m.k2) ? '' : 'pieces'; });
  set('g3fr-es-tf', (q, m) => near(amount(m.said) * m.k2, m.items) === q.answer ? '' : 'truth');
  /* groups of pieces */
  set('g3fr-gp-whole', q => { const n = nums(q.q)[0], d = pieceIn(q.q); return q.answer * d === n ? '' : 'wholes'; });
  set('g3fr-gp-pic', q => { const d = pieceIn(q.q.split('these')[1]), n = shade(q.fig)[1]; return q.answer * d === n ? '' : 'wholes'; });
  set('g3fr-gp-rev', q => { const w = nums(q.q)[0], d = pieceIn(q.q.split(' are in ')[0]); return q.answer === w * d ? '' : 'pieces'; });
  set('g3fr-gp-match', q => q.pairs.every(p => nums(p[0])[0] === nums(p[1])[0] * pieceIn(p[0])) ? '' : 'pairs');
  set('g3fr-gp-tf', (q, m) => (m.s * m.d === m.n) === q.answer ? '' : 'truth');
  set('g3fr-gp-fill', q => { const n = +H.strip(q.fill).match(/(\d+) groups/)[1], d = fracs(q.fill)[0][1]; return q.answers[0] === n && q.answers[1] * d === n ? '' : 'groups'; });
  set('g3fr-gp-groups', q => { const n = nums(q.q); return q.answer * n[0] === n[1] ? '' : 'groups'; });
  set('g3fr-gl-mc', (q, m) => only(q, m.n / m.d) ? '' : 'wholes and leftover');
  set('g3fr-gl-fill', (q, m) => q.answers[0] * m.d + q.answers[1] === m.n && q.answers[1] < m.d ? '' : 'wholes');
  set('g3fr-gl-match', q => q.pairs.every(p => near(amount(p[1]), nums(p[0])[0] / pieceIn(p[0]))) ? '' : 'pairs');
  set('g3fr-gl-tf', (q, m) => near(amount(m.said), m.n / m.d) === q.answer ? '' : 'truth');
  set('g3fr-gl-full', (q, m) => q.answer * m.d <= m.n && (q.answer + 1) * m.d > m.n ? '' : 'full groups');
  set('g3fr-gl-left', (q, m) => q.answer === m.n - m.d * wholes(m.n, m.d) ? '' : 'left over');
  set('g3fr-gs-mc', (q, m) => only(q, m.n / m.d) ? '' : 'total');
  set('g3fr-gs-num', q => { const d = fracs(q.q)[0][1], n = +H.strip(q.q).match(/skis (\d+) laps/)[1]; return q.answer * d === n ? '' : 'km'; });
  set('g3fr-gs-scoops', q => { const w = +H.strip(q.q).match(/needs (\d+) cups/)[1], d = fracs(q.q)[0][1]; return q.answer === w * d ? '' : 'scoops'; });
  set('g3fr-gs-tf', (q, m) => near(amount(m.said), m.n / m.d) === q.answer ? '' : 'truth');
  set('g3fr-gs-fill', (q, m) => q.answers[0] * m.d + q.answers[1] === m.n && q.answers[1] < m.d ? '' : 'cups');
  set('g3fr-gs-n', (q, m) => q.answer === m.n ? '' : 'pieces');
  /* bigger piece or more pieces */
  set('g3fr-mix-mc', (q, m) => { const va = m.a[0] / m.a[1], vb = m.b[0] / m.b[1], t = q.options[q.answer], f = fracs(t)[0]; return (near(va, vb) ? /same/.test(H.strip(t)) : !!f && near(f[0] / f[1], Math.max(va, vb))) ? '' : 'which is more'; });
  set('g3fr-mix-tf', (q, m) => (m.x[0] * m.y[1] > m.y[0] * m.x[1]) === q.answer ? '' : 'truth');
  set('g3fr-mix-order', q => ascending(q.items.map(amount)) ? '' : 'order');
  set('g3fr-mix-pick', (q, m) => same(q.options.map((o, j) => amount(o) > m.t[0] / m.t[1] + 1e-9 ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('g3fr-mix-same', (q, m) => q.answer === (m.a[0] === m.b[0] ? 0 : m.a[1] === m.b[1] ? 1 : 2) ? '' : 'matching number');
  set('g3fr-mix-big', (q, m) => pieceIn(q.options[q.answer]) === Math.min(m.a[1], m.b[1]) ? '' : 'bigger pieces');
  set('g3fr-mix-more', (q, m) => { const f = fracs(q.options[q.answer])[0]; return f && f[0] === Math.max(m.a[0], m.b[0]) ? '' : 'more pieces'; });
  /* --- patterns (full chapter) --- */
  {
    const SHP = { A: 'circle', B: 'square', C: 'triangle', D: 'star' }, WAY = ['up', 'right', 'down', 'left'];
    const last = t => H.strip(t).split(' ').pop();
    const up1 = t => t.charAt(0).toUpperCase() + t.slice(1);
    /* the length of the smallest part that repeats in a list or string, such as "ABBABBABB" -> 3 */
    const period = s => { for (let p = 1; p < s.length; p++) if ([...s].every((c, i) => c === s[i % p])) return p; return s.length; };
    const coreLen = core => period(core.repeat(3));
    /* letters for a list of things: [clap, snap, snap] -> "A, B, B" */
    const abc = list => { const m = {}; let k = 0; return list.map(x => (x in m ? m[x] : (m[x] = 'ABCD'[k++]))).join(', '); };
    /* "a op b" worked out, whichever sign is used */
    const op2 = (a, o, b) => ({ '+': a + b, '-': a - b, '−': a - b, x: a * b, '×': a * b, '/': a / b, '÷': a / b })[o];
    const ex = e => op2(+e[0], e[1], +e[2]);
    const evx = t => { const m = H.strip(t).match(/^(\d+) ([+−×÷]) (\d+)$/); return m ? op2(+m[1], m[2], +m[3]) : NaN; };
    /* n for "n + 4 = 10", "5 × n = 30" or "n ÷ 2 = 6", found by trying every n from 0 to 1000 */
    const findN = (o, c, r) => { const hit = []; for (let n = 0; n <= 1000; n++) if ((o === 'x' ? c * n : op2(n, o, c)) === r) hit.push(n); return hit.length === 1 ? hit[0] : NaN; };
    const solveTxt = t => { const [l, r] = H.strip(t).split('='); const hit = []; for (let n = 0; n <= 1000; n++) if (evx(l.trim().replace('n', n)) === +r) hit.push(n); return hit.length === 1 ? hit[0] : NaN; };
    /* does a rule such as "Start at 40, take away 5" make the list v? */
    const ruleFits = (t, v) => { const m = H.strip(t).match(/^Start at (\d+), (add|take away) (\d+)/i); if (!m) return false; const d = m[2].toLowerCase() === 'add' ? +m[3] : -m[3]; return v.every((x, i) => x === +m[1] + d * i); };
    const ar = (a, d, j) => a + d * (j - 1);
    /* repeating, growing or shrinking, read from the numbers */
    const kindOf = v => { const d = v[1] - v[0]; if (d && v.every((x, i) => !i || x - v[i - 1] === d)) return d > 0 ? 'Growing' : 'Shrinking'; return period(v) < v.length ? 'Repeating' : ''; };
    const kindAt = (v, p) => kindOf(v) === 'Repeating' ? v[(p - 1) % period(v)] : v[0] + (v[1] - v[0]) * (p - 1);
    /* the robot: start [column, row, facing] with 0 up, 1 right, 2 down, 3 left; code such as "move 3, turn right" */
    const parse = t => H.strip(t).split(/,\s*/).filter(Boolean).map(s => /^move/.test(s) ? ['move', +s.split(' ')[1]] : [s.split(' ').pop()]);
    const walk = (start, prog) => { let [x, y, d] = start; prog.forEach(c => { if (c[0] === 'move') { x += [0, 1, 0, -1][d] * c[1]; y += [-1, 0, 1, 0][d] * c[1]; } else d = (d + (c[0] === 'right' ? 1 : 3)) % 4; }); return { x, y, d }; };
    const at = (r, p) => r.x === p[0] && r.y === p[1];
    const loopOut = t => { const m = H.strip(t).match(/^repeat (\d+) times \[(.*)\]$/); if (!m) return parse(t); let p = []; for (let i = 0; i < +m[1]; i++) p = p.concat(parse(m[2])); return p; };
    const moved = prog => prog.reduce((a, c) => a + (c[0] === 'move' ? c[1] : 0), 0);
    /* exactly one option passes the test, and it is the answer */
    const one = (q, ok) => { const hit = q.options.map((o, j) => ok(o) ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === q.answer; };
    /* a list with blanks, "5, [[]], 11", filled in with the answers */
    const filled = q => { let j = 0; return H.strip(q.fill).split(', ').map(x => /\[\[\]\]/.test(x) ? q.answers[j++] : +x); };
    /* repeating patterns */
    set('g3pt-core-next', (q, m) => last(q.options[q.answer]) === SHP[m.core[m.at % m.core.length]] ? '' : 'shape');
    set('g3pt-core-tap', (q, m) => { const full = m.core.repeat(3), L = coreLen(m.core), ok = m.sets.map((s, j) => s.length === L && full.startsWith(s) ? j : -1).filter(j => j >= 0); return ok.length === 1 && ok[0] === q.answer ? '' : 'core'; });
    set('g3pt-core-tf', (q, m) => ((m.said.length === coreLen(m.core) && m.core.repeat(3).startsWith(m.said)) === q.answer) ? '' : 'truth');
    set('g3pt-core-fill', (q, m) => q.answers[0] === coreLen(m.core) && q.answers[1] === m.r * [...m.core].filter(c => c === m.sh).length ? '' : 'counts');
    set('g3pt-core-len', (q, m) => q.answer === coreLen(m.core) ? '' : 'core length');
    set('g3pt-core-pos', (q, m) => q.answer === m.n % m.core.length + 1 ? '' : 'place in core');
    set('g3pt-forms-letters', (q, m) => H.strip(q.options[q.answer]) === abc([...m.core]) ? '' : 'letters');
    set('g3pt-forms-words', (q, m) => H.strip(q.options[q.answer]) === abc(m.words) ? '' : 'letters');
    set('g3pt-forms-tap', (q, m) => { const ok = m.sets.map((s, j) => abc([...s]) === abc(m.words) ? j : -1).filter(j => j >= 0); return ok.length === 1 && ok[0] === q.answer ? '' : 'same pattern'; });
    set('g3pt-forms-match', q => q.pairs.every(p => abc(H.strip(p[0]).split(', ')) === p[1]) ? '' : 'pairs');
    set('g3pt-forms-tf', (q, m) => (abc(m.words) === abc([...m.core])) === q.answer ? '' : 'truth');
    set('g3pt-forms-second', (q, m) => q.options[q.answer] === (m.core[1] === m.core[0] ? 'A' : 'B') ? '' : 'letter');
    set('g3pt-forms-act', (q, m) => one(q, o => abc(H.strip(o).split(', ')) === abc([...m.core])) ? '' : 'actions');
    set('g3pt-move-next', (q, m) => (/pointing (\w+)/.exec(q.tiles[q.answer]) || [])[1] === WAY[(m.s + m.t * m.i) % 4] ? '' : 'arrow');
    set('g3pt-move-how', (q, m) => H.strip(q.options[q.answer]) === { 1: 'A quarter turn right', 2: 'A half turn', 3: 'A quarter turn left' }[m.t] ? '' : 'turn');
    set('g3pt-move-far', (q, m) => q.options[q.answer] === up1(WAY[(m.s + m.t * (m.p - 1)) % 4]) ? '' : 'direction');
    set('g3pt-move-order', (q, m) => q.items.every((x, i) => x === 'points ' + WAY[(m.s + m.t * (m.from + i)) % 4]) ? '' : 'order');
    set('g3pt-move-core', (q, m) => { let L = 1; while ((m.t * L) % 4) L++; return q.answer === L ? '' : 'core'; });
    set('g3pt-move-tf', (q, m) => (((m.s + m.t * (m.p - 1)) % 4 === m.said) === q.answer) ? '' : 'truth');
    set('g3pt-ahead-count', (q, m) => { let n = 0; for (let i = 0; i < m.N; i++) if (m.core[i % m.core.length] === m.sh) n++; return q.answer === n ? '' : 'count'; });
    set('g3pt-ahead-fill', (q, m) => q.answers[0] * m.L + q.answers[1] === m.p && q.answers[1] >= 1 && q.answers[1] <= m.L ? '' : 'cores');
    set('g3pt-ahead-pos', (q, m) => { let n = 0, i = 0; for (; n < m.kth; i++) if (m.core[i % m.core.length] === m.sh) n++; return q.answer === i ? '' : 'position'; });
    set('g3pt-ahead-tf', (q, m) => ((m.core[(m.p - 1) % m.core.length] === m.said) === q.answer) ? '' : 'truth');
    set('g3pt-ahead-full', (q, m) => q.answer * m.L < m.p && (q.answer + 1) * m.L >= m.p ? '' : 'full cores');
    set('g3pt-ahead-at', (q, m) => (m.p - q.answer) % m.L === 0 && q.answer >= 1 && q.answer <= m.L ? '' : 'place');
    /* growing patterns */
    set('g3pt-ext-nth', (q, m) => q.answer === ar(m.a, m.d, m.j) ? '' : 'nth number');
    set('g3pt-ext-fill', (q, m) => filled(q).every((x, i) => x === m.a + m.d * i) ? '' : 'pattern');
    set('g3pt-ext-line', (q, m) => { const r = H.strip(q.q).match(/Start at (\d+), add (\d+)/); return q.answer === ar(+r[1], +r[2], m.j) ? '' : 'point'; });
    set('g3pt-ext-story', (q, m) => { const n = nums(q.q), less = /spends|uses|gives away/.test(q.q); return q.answer === n[0] + (less ? -1 : 1) * n[1] * n[2] && n[2] === m.w ? '' : 'total'; });
    set('g3pt-ext-tf', (q, m) => ((m.a + 4 * m.d === m.said) === q.answer) ? '' : 'truth');
    set('g3pt-rule-by', (q, m) => m.v.every((x, i) => !i || Math.abs(x - m.v[i - 1]) === q.answer) ? '' : 'change');
    set('g3pt-rule-which', (q, m) => one(q, o => ruleFits(o, m.v)) ? '' : 'rule');
    set('g3pt-rule-next', (q, m) => q.answer === 2 * m.v[m.v.length - 1] - m.v[m.v.length - 2] ? '' : 'next');
    set('g3pt-rule-fill', (q, m) => ruleFits('Start at ' + q.answers[0] + ', ' + (/add/.test(q.fill) ? 'add ' : 'take away ') + q.answers[1], m.v) ? '' : 'rule');
    set('g3pt-rule-tf', (q, m) => (ruleFits(m.said, m.v) === q.answer) ? '' : 'truth');
    set('g3pt-rule-pair', (q, m) => q.answer === Math.abs(m.b - m.a) ? '' : 'change');
    set('g3pt-rule-dir', (q, m) => H.strip(q.options[q.answer]) === (m.v[1] > m.v[0] ? 'It goes up' : 'It goes down') ? '' : 'direction');
    set('g3pt-big-next', (q, m) => q.answer === 2 * m.v[3] - m.v[2] ? '' : 'next');
    set('g3pt-big-fill', (q, m) => filled(q).every((x, i) => x === m.a + m.d * i) ? '' : 'pattern');
    set('g3pt-big-nth', (q, m) => q.answer === ar(m.a, m.d, m.j) ? '' : 'nth number');
    set('g3pt-big-digit', (q, m) => { const a = String(m.v[0]).padStart(3, '0'), b = String(m.v[1]).padStart(3, '0'), ch = [0, 1, 2].filter(i => a[i] !== b[i]); return ch.length === 1 && q.options[q.answer] === ['The hundreds digit', 'The tens digit', 'The ones digit'][ch[0]] ? '' : 'digit'; });
    set('g3pt-big-line', (q, m) => q.answer === ar(m.a, m.d, m.j) ? '' : 'point');
    set('g3pt-big-in', (q, m) => { const k = (m.b - m.a) / m.d; return ((Number.isInteger(k) && k >= 0) === q.answer) ? '' : 'truth'; });
    set('g3pt-tab-fill', (q, m) => nums(q.fill).join() === m.gaps.join() && q.answers.every((x, i) => x === ar(m.a, m.d, m.gaps[i])) ? '' : 'tiles');
    set('g3pt-tab-num', (q, m) => q.answer === ar(m.a, m.d, m.f) ? '' : 'tiles');
    set('g3pt-tab-rule', (q, m) => ruleFits(q.options[q.answer], [1, 2, 3, 4].map(f => ar(m.a, m.d, f))) ? '' : 'rule');
    set('g3pt-tab-rev', (q, m) => ar(m.a, m.d, q.answer) === m.t ? '' : 'figure');
    set('g3pt-tab-tf', (q, m) => ((ar(m.a, m.d, m.f) === m.said) === q.answer) ? '' : 'truth');
    set('g3pt-tab-add', (q, m) => q.answer === ar(m.a, m.d, 2) - m.a ? '' : 'added');
    set('g3pt-kind-mc', (q, m) => q.options[q.answer] === kindOf(m.v) ? '' : 'kind');
    set('g3pt-kind-next', (q, m) => q.answer === kindAt(m.v, m.v.length + 1) ? '' : 'next');
    set('g3pt-kind-far', (q, m) => q.answer === kindAt(m.v, m.p) ? '' : 'far');
    set('g3pt-kind-fill', q => kindOf(filled(q)) ? '' : 'pattern');
    set('g3pt-kind-tf', (q, m) => ((kindOf(m.v) === m.said) === q.answer) ? '' : 'truth');
    set('g3pt-kind-pick', (q, m) => same(m.lists.map((v, j) => kindOf(v) === (m.want === 'rep' ? 'Repeating' : 'Growing') ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
    /* variables and number machines */
    const mach = (m, n) => m.op === 'x' ? m.c * n : op2(n, m.op, m.c);
    set('g3pt-var-n', (q, m) => q.answer === findN(m.op, m.c, m.r) ? '' : 'n');
    set('g3pt-var-write', (q, m) => { const n = nums(q.q); return q.answers[0] === n[0] && q.answers[1] === n[1] && findN(m.op, q.answers[0], q.answers[1]) >= 0 ? '' : 'equation'; });
    set('g3pt-var-match', q => q.pairs.every(p => solveTxt(p[0]) === nums(p[1])[0]) ? '' : 'pairs');
    set('g3pt-var-tf', (q, m) => ((findN(m.op, m.c, m.r) === m.said) === q.answer) ? '' : 'truth');
    set('g3pt-var-fact', (q, m) => one(q, o => evx(o) === findN(m.op, m.c, m.r)) ? '' : 'fact');
    set('g3pt-var-check', (q, m) => q.answer === mach(m, m.n) ? '' : 'check');
    set('g3pt-mach-out', (q, m) => q.answer === mach(m, m.n) ? '' : 'out');
    set('g3pt-mach-fill', (q, m) => { const ins = (H.strip(q.fill).match(/n = (\d+)/g) || []).map(t => +t.slice(4)); return ins.join() === m.ins.join() && q.answers.every((x, i) => x === mach(m, ins[i])) ? '' : 'outputs'; });
    set('g3pt-mach-in', (q, m) => mach(m, q.answer) === m.out ? '' : 'in');
    set('g3pt-mach-rule', (q, m) => one(q, o => { const t = H.strip(o), r = t.match(/^n ([+−]) (\d+)$/), x = t.match(/^(\d+) × n$/); return m.ins.every((n, i) => (x ? +x[1] * n : r ? op2(n, r[1], +r[2]) : NaN) === m.outs[i]); }) ? '' : 'rule');
    set('g3pt-mach-tf', (q, m) => ((mach(m, m.n) === m.said) === q.answer) ? '' : 'truth');
    /* equal or not */
    const box = (m, x) => ex(m.r.map(s => s === '?' ? x : s)) === ex(m.l);
    set('g3pt-eq-sides', (q, m) => q.answers[0] === ex(m.l) && q.answers[1] === ex(m.r) ? '' : 'sides');
    set('g3pt-eq-val', (q, m) => q.answer === ex(m.l) && q.answer === ex(m.r) ? '' : 'value');
    set('g3pt-eq-tf', (q, m) => ((ex(m.l) === ex(m.r)) === q.answer) ? '' : 'truth');
    set('g3pt-eq-which', (q, m) => one(q, o => evx(o) === m.t) ? '' : 'equal');
    set('g3pt-eq-pick', (q, m) => same(q.options.map((o, j) => evx(o) === m.t ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
    set('g3pt-eq-one', (q, m) => q.answer === ex(m.e) ? '' : 'value');
    set('g3pt-eq-tf2', (q, m) => q.answer === (ex(m.l) === ex(m.r) ? 0 : 1) ? '' : 'equal or not');
    set('g3pt-bal-box', (q, m) => box(m, q.type === 'fill' ? q.answers[0] : q.answer) ? '' : 'box');
    set('g3pt-bal-mc', (q, m) => one(q, o => box(m, +H.strip(o))) ? '' : 'box');
    set('g3pt-bal-tf', (q, m) => ((ex(m.l) === ex(m.r)) === q.answer) ? '' : 'truth');
    set('g3pt-bal-story', q => { const n = nums(q.q); return q.answer === n[0] + n[1] - n[2] ? '' : 'more needed'; });
    /* coding */
    set('g3pt-seq-tap', (q, m) => { const r = walk(m.start, m.prog); return q.answer === r.x + ',' + r.y ? '' : 'square'; });
    set('g3pt-seq-steps', q => q.answer === (H.strip(q.q).match(/move (\d+)/g) || []).reduce((a, t) => a + +t.slice(5), 0) ? '' : 'squares');
    set('g3pt-seq-which', (q, m) => one(q, o => at(walk(m.start, parse(o)), m.star)) ? '' : 'code');
    set('g3pt-seq-order', (q, m) => at(walk(m.start, q.items.map(t => parse(t)[0])), m.star) ? '' : 'order');
    set('g3pt-seq-fill', (q, m) => {
      const prog = v => { let j = 0; return m.prog.map(t => t === 'move' ? ['move', v[j++]] : parse(t)[0]); };
      let hits = 0;
      for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (at(walk(m.start, prog([a, b])), m.star)) hits++;
      return hits === 1 && at(walk(m.start, prog(q.answers)), m.star) ? '' : 'moves';
    });
    set('g3pt-seq-tf', (q, m) => (at(walk(m.start, m.prog), m.star) === q.answer) ? '' : 'truth');
    set('g3pt-seq-face', (q, m) => q.options[q.answer] === up1(WAY[walk(m.start, m.prog).d]) ? '' : 'facing');
    set('g3pt-loop-steps', (q, m) => q.answer === m.r * moved(m.body) ? '' : 'squares');
    set('g3pt-loop-fill', (q, m) => { const t = H.strip(q.fill).replace('[[]]', q.answers[0]).replace('[[]]', q.answers[1]); return loopOut(t).join('|') === parse(m.long).join('|') ? '' : 'loop'; });
    set('g3pt-loop-which', (q, m) => one(q, o => moved(loopOut(o)) === m.t) ? '' : 'code');
    set('g3pt-loop-tap', (q, m) => { let p = []; for (let i = 0; i < m.r; i++) p = p.concat(m.body); const r = walk(m.start, p); return q.answer === r.x + ',' + r.y ? '' : 'square'; });
    set('g3pt-loop-tf', (q, m) => ((m.r * m.m === m.said) === q.answer) ? '' : 'truth');
    set('g3pt-loop-each', (q, m) => q.answer === moved(m.body) ? '' : 'each time');
    set('g3pt-loop-times', (q, m) => q.answer === +m.text.match(/^repeat (\d+)/)[1] ? '' : 'times');
    set('g3pt-conc-kind', (q, m) => { const want = m.a[0] === m.b[0] ? 'At the same time' : m.b[0] >= m.a[1] ? 'One after another' : 'none'; return H.strip(q.options[q.answer]).startsWith(want) ? '' : 'kind'; });
    set('g3pt-conc-far', q => { const n = nums(q.q); return q.answer === n[0] * n[1] ? '' : 'squares'; });
    set('g3pt-conc-fill', (q, m) => q.answers[0] === m.a + m.b && q.answers[1] === Math.max(m.a, m.b) ? '' : 'times');
    set('g3pt-conc-gap', q => { const n = nums(q.q); return q.answer === (n[0] - n[1]) * n[2] ? '' : 'ahead'; });
    set('g3pt-conc-flash', (q, m) => { let n = 0; for (let s = 1; s <= m.t; s++) if (s % m.e === 0) n++; return q.answer === n ? '' : 'flashes'; });
    set('g3pt-conc-tf', (q, m) => ((m.b[0] >= m.a[1]) === q.answer) ? '' : 'truth');
    set('g3pt-conc-end', (q, m) => q.answer === Math.max(m.a[1], m.b[1]) ? '' : 'end');
    set('g3pt-fix-new', (q, m) => q.answer === m.r * m.m ? '' : 'squares');
    set('g3pt-fix-more', (q, m) => q.answer === m.r2 * m.m - m.r * m.m ? '' : 'more');
    set('g3pt-fix-which', (q, m) => one(q, o => { const t = H.strip(o), mv = t.match(/move \d+ to move (\d+)/), rp = t.match(/repeat \d+ to repeat (\d+)/); return (mv ? m.r * +mv[1] : rp ? +rp[1] * m.m : NaN) === m.t; }) ? '' : 'change');
    set('g3pt-fix-fill', (q, m) => q.answers[0] * m.m === m.t ? '' : 'repeat');
    set('g3pt-fix-tf', (q, m) => ((m.m === m.said) === q.answer) ? '' : 'truth');
  }
  /* --- data (full chapter) --- */
  {
    const IS = { even: n => n % 2 === 0, odd: n => n % 2 === 1, gt10: n => n > 10, gt15: n => n > 15, gt20: n => n > 20, gt50: n => n > 50, lt10: n => n < 10, m3: n => n % 3 === 0, m4: n => n % 4 === 0, m5: n => n % 5 === 0, m10: n => n % 10 === 0 };
    const NAME = { even: 'Even', odd: 'Odd', gt10: 'More than 10', gt15: 'More than 15', gt20: 'More than 20', gt50: 'More than 50', lt10: 'Less than 10', m3: 'Multiple of 3', m4: 'Multiple of 4', m5: 'Multiple of 5', m10: 'Multiple of 10' };
    /* a label such as "More than 15" or "not multiple of 3" tested on a number */
    const fits = (label, n) => { const t = label.trim(), neg = /^not /i.test(t), s = t.replace(/^not /i, '').toLowerCase(), k = +(s.match(/\d+/) || [0])[0];
      const ok = s === 'even' ? n % 2 === 0 : s === 'odd' ? n % 2 === 1 : /^more than/.test(s) ? n > k : /^less than/.test(s) ? n < k : /^multiple of/.test(s) ? n % k === 0 : NaN; return neg ? !ok : ok; };
    const part = (n, a, b) => IS[a](n) && IS[b](n) ? 'Both' : IS[a](n) ? NAME[a] + ' only' : IS[b](n) ? NAME[b] + ' only' : 'Neither';
    const tot = l => l.reduce((x, y) => x + y, 0);
    const avg = l => tot(l) / l.length;
    const tally = l => { const c = {}; l.forEach(x => { c[x] = (c[x] || 0) + 1; }); return c; };
    const modesOf = l => { const c = tally(l), top = Math.max(...Object.values(c)); return top < 2 ? [] : Object.keys(c).filter(k => c[k] === top).map(Number).sort((x, y) => x - y); };
    const likeWord = (r, b) => r === 0 ? 'impossible' : b === 0 ? 'certain' : r === b ? 'equally likely' : r < b ? 'unlikely' : 'likely';
    /* the values a graph lists for screen readers, e.g. "Bar graph: Pets. Dog 6, Cat 4. The scale counts by 2." */
    const chart = fig => { const d = document.createElement('div'); d.innerHTML = fig; const o = {}; d.querySelector('svg').getAttribute('aria-label').split('. ')[1].split(', ').forEach(x => { const m = x.match(/^(.*) (\d+)$/); o[m[1]] = +m[2]; }); return o; };
    const rowsOk = (q, m) => !q.fig || !/<svg/.test(q.fig) || m.rows.every(r => chart(q.fig)[r[0]] === r[1]);
    const val = (m, nm) => (m.rows.find(r => r[0] === nm) || [])[1];
    const one = (q, ok) => { const hit = q.options.map((o, j) => ok(H.strip(o)) ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === q.answer; };
    /* blocks: circle (c) or square (q), blue (b) or orange (o), big (B) or small (s) */
    const bName = (k, many) => (k[2] === 'B' ? 'big' : 'small') + ' ' + (k[1] === 'b' ? 'blue' : 'orange') + ' ' + (k[0] === 'c' ? 'circle' : 'square') + (many ? 's' : '');
    const leaves = ['cbB', 'cbs', 'coB', 'cos', 'qbB', 'qbs', 'qoB', 'qos'];
    const has = (k, want) => [...want].every(w => k.includes(w));
    /* sorting */
    set('g3dt-venn-where', (q, m) => H.strip(q.options[q.answer]) === part(m.n, m.a, m.b) ? '' : 'part');
    set('g3dt-venn-count', (q, m) => q.answer === m.nums.filter(n => m.w === 'a' ? IS[m.a](n) : m.w === 'b' ? IS[m.b](n) : m.w === 'ab' ? IS[m.a](n) && IS[m.b](n) : !IS[m.a](n) && !IS[m.b](n)).length ? '' : 'count');
    set('g3dt-venn-total', (q, m) => { const d = document.createElement('div'); d.innerHTML = q.fig; const shown = d.querySelector('svg').getAttribute('aria-label').split('. ').slice(1).reduce((a, p) => a + (p.split(': ')[1] === 'none' ? 0 : nums(p.split(': ')[1] || '').length), 0); return q.answer === m.nums.length && shown === m.nums.length ? '' : 'total'; });
    set('g3dt-venn-story', (q, m) => { const n = nums(q.q); return n[0] === m.h && n[1] === m.s && n[2] === m.b && q.answer === (m.ask === 'a' ? m.h - m.b : m.ask === 'b' ? m.s - m.b : m.h + m.s - m.b) ? '' : 'children'; });
    set('g3dt-venn-pick', (q, m) => same(q.options.map((o, j) => part(+o, m.a, m.b) === (m.want === 'ab' ? 'Both' : m.want === 'none' ? 'Neither' : NAME[m[m.want]] + ' only') ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
    set('g3dt-venn-tf', (q, m) => ((part(m.n, m.a, m.b) === (m.said === 'ab' ? 'Both' : m.said === 'none' ? 'Neither' : NAME[m[m.said]] + ' only')) === q.answer) ? '' : 'truth');
    set('g3dt-venn-yes', (q, m) => q.options[q.answer] === (IS[m.t](m.n) ? 'Yes' : 'No') ? '' : 'yes or no');
    set('g3dt-car-tap', (q, m) => q.answer === (IS[m.a](m.n) ? 'y' : 'n') + (IS[m.b](m.n) ? 'y' : 'n') ? '' : 'box');
    set('g3dt-car-count', (q, m) => q.answer === m.nums.filter(n => IS[m.t](n)).length ? '' : 'count');
    set('g3dt-car-fill', (q, m) => { const want = ['yy', 'yn', 'ny', 'nn'].map(k => m.nums.filter(n => IS[m.a](n) === (k[0] === 'y') && IS[m.b](n) === (k[1] === 'y')).length); return want.join() === q.answers.join() ? '' : 'counts'; });
    set('g3dt-car-which', (q, m) => {
      const d = document.createElement('div'); d.innerHTML = q.fig; const wrong = [];
      d.querySelector('svg').getAttribute('aria-label').replace(/^Carroll diagram: /, '').split('. ').forEach(p => { const [box, list] = p.split(': '), labs = box.split(', '); (list === 'none' ? [] : nums(list)).forEach(n => { if (!labs.every(l => fits(l, n))) wrong.push(n); }); });
      return wrong.length === 1 && one(q, o => +o === wrong[0]) ? '' : 'wrong box';
    });
    set('g3dt-car-more', (q, m) => { const y = m.nums.filter(n => IS[m.t](n)).length; return q.answer === Math.abs(2 * y - m.nums.length) && q.answer > 0 ? '' : 'how many more'; });
    set('g3dt-car-tf', (q, m) => ((m.said === (IS[m.a](m.n) ? 'y' : 'n') + (IS[m.b](m.n) ? 'y' : 'n')) === q.answer) ? '' : 'truth');
    set('g3dt-car-row', (q, m) => q.answer === (IS[m.t](m.n) ? 0 : 1) && q.options[0] === NAME[m.t] ? '' : 'row');
    set('g3dt-tree-tap', (q, m) => q.answer === m.blk && leaves.includes(m.blk) ? '' : 'leaf');
    set('g3dt-tree-count', (q, m) => q.answer === m.blocks.filter(k => k === m.leaf).length ? '' : 'count');
    set('g3dt-tree-sum', (q, m) => q.answer === tot(leaves.filter(k => has(k, m.want)).map(k => m.counts[k])) ? '' : 'sum');
    set('g3dt-tree-more', (q, m) => { const a = tot(leaves.filter(k => has(k, m.hi)).map(k => m.counts[k])), b = tot(leaves.filter(k => has(k, m.lo)).map(k => m.counts[k])); return q.answer === a - b && a > b ? '' : 'more'; });
    set('g3dt-tree-fill', (q, m) => q.answers.every((x, i) => x === m.blocks.filter(k => k === m.hide[i]).length) && m.hide.every((k, i) => H.strip(q.fill).split(/\s*\[\[\]\]\s*/)[i].toLowerCase().includes(bName(k, true))) ? '' : 'leaves');
    set('g3dt-tree-path', (q, m) => H.strip(q.options[q.answer]) === [m.leaf[0] === 'c' ? 'circle' : 'square', m.leaf[1] === 'b' ? 'blue' : 'orange', m.leaf[2] === 'B' ? 'big' : 'small'].join(', ') ? '' : 'path');
    set('g3dt-tree-tf', (q, m) => ((m.blocks.filter(k => k === m.leaf).length === m.said) === q.answer) ? '' : 'truth');
    set('g3dt-tree-attr', (q, m) => q.answer === (m.attr === 0 ? (m.blk[0] === 'c' ? 0 : 1) : (m.blk[1] === 'b' ? 0 : 1)) ? '' : 'branch');
    /* collecting */
    const numAns = t => /^How (many|far|long|tall)\b/.test(t);
    const how = t => /can you|\bfly\b|melt|flips|rolls|ramp/.test(t) ? 'experiment' : /\byou\b|\byour\b/.test(t) ? 'interview' : 'observation';
    set('g3dt-kind-wn', (q, m) => /quantitative/.test(q.options[q.answer]) === numAns(m.q) ? '' : 'kind of data');
    set('g3dt-kind-how', (q, m) => q.options[q.answer].includes(how(m.q)) ? '' : 'method');
    set('g3dt-kind-match', q => q.pairs.every(p => p[1].includes(how(p[0]))) ? '' : 'pairs');
    set('g3dt-kind-pick', (q, m) => same(q.options.map((o, j) => numAns(o) === (m.want === 'n') ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
    set('g3dt-kind-tf', (q, m) => ((numAns(m.q) === (m.said === 'n')) === q.answer) ? '' : 'truth');
    const marks = h => { const d = document.createElement('div'); d.innerHTML = h; return d.querySelectorAll('line').length; };
    set('g3dt-tal-read', (q, m) => q.answer === m.n && (!q.fig || marks(q.fig) === m.n) ? '' : 'tally');
    set('g3dt-tal-fill', (q, m) => { const d = document.createElement('div'); d.innerHTML = q.fig; const got = [...d.querySelectorAll('tbody tr')].map(tr => tr.querySelectorAll('line').length); return got.join() === q.answers.join() && got.join() === m.rows.map(r => r[1]).join() ? '' : 'counts'; });
    set('g3dt-tal-total', (q, m) => { const d = document.createElement('div'); d.innerHTML = q.fig; return q.answer === d.querySelectorAll('line').length && q.answer === tot(m.rows.map(r => r[1])) ? '' : 'total'; });
    set('g3dt-tal-diff', (q, m) => q.answer === val(m, m.a) - val(m, m.b) ? '' : 'difference');
    set('g3dt-tal-tap', (q, m) => marks(q.tiles[q.answer]) === m.n && q.tiles.filter(t => marks(t) === m.n).length === 1 ? '' : 'tally');
    set('g3dt-tal-tf', (q, m) => ((marks(q.fig) === m.said) === q.answer) ? '' : 'truth');
    set('g3dt-tal-groups', (q, m) => q.answer * 5 <= m.n && (q.answer + 1) * 5 > m.n ? '' : 'groups');
    set('g3dt-tal-fives', (q, m) => q.answer === 5 * m.g ? '' : 'fives');
    /* graphs */
    set('g3dt-pic-read', (q, m) => rowsOk(q, m) && q.answer === val(m, m.name) ? '' : 'votes');
    set('g3dt-pic-fill', (q, m) => rowsOk(q, m) && q.answers.join() === m.rows.map(r => r[1]).join() ? '' : 'votes');
    set('g3dt-pic-total', (q, m) => rowsOk(q, m) && q.answer === tot(m.rows.map(r => r[1])) ? '' : 'total');
    set('g3dt-pic-diff', (q, m) => rowsOk(q, m) && q.answer === val(m, m.a) - val(m, m.b) ? '' : 'difference');
    set('g3dt-pic-tf', (q, m) => rowsOk(q, m) && ((val(m, m.name) === m.said) === q.answer) ? '' : 'truth');
    set('g3dt-pic-order', (q, m) => { const v = q.items.map(n => val(m, n)); return rowsOk(q, m) && v.every((x, i) => !i || x < v[i - 1]) ? '' : 'order'; });
    set('g3dt-pic-key', (q, m) => q.answer === m.key ? '' : 'key');
    set('g3dt-pic-whole', (q, m) => q.answer === Math.floor(val(m, m.name) / m.key) * m.key ? '' : 'whole pictures');
    set('g3dt-bar-read', (q, m) => rowsOk(q, m) && q.answer === val(m, m.name) ? '' : 'bar');
    set('g3dt-bar-diff', (q, m) => rowsOk(q, m) && q.answer === val(m, m.a) - val(m, m.b) ? '' : 'difference');
    set('g3dt-bar-total', (q, m) => rowsOk(q, m) && q.answer === tot(m.rows.map(r => r[1])) ? '' : 'total');
    set('g3dt-bar-match', (q, m) => rowsOk(q, m) && q.pairs.every(p => val(m, p[0]) === +p[1]) ? '' : 'pairs');
    set('g3dt-bar-tf', (q, m) => rowsOk(q, m) && ((val(m, m.a) - val(m, m.b) === m.said) === q.answer) ? '' : 'truth');
    set('g3dt-bar-scale', (q, m) => nums(q.options[q.answer])[0] === m.step && /counts by (\d+)/.exec(q.fig)[1] === String(m.step) ? '' : 'scale');
    set('g3dt-bar-step', (q, m) => q.answer === m.step ? '' : 'scale');
    const best = mx => [1, 2, 5, 10].find(s => mx / s <= 10);
    set('g3dt-mk-key', (q, m) => q.answer * m.key === m.v ? '' : 'pictures');
    set('g3dt-mk-scale', (q, m) => nums(q.options[q.answer])[0] === best(m.max) ? '' : 'scale');
    set('g3dt-mk-miss', (q, m) => { const s = H.strip(q.fig), lab = q.fig.includes('rotate(-90'), src = s.includes('Source:'), ttl = !/no title/.test(q.fig); const miss = !ttl ? 'title' : !src ? 'source' : !lab ? 'label' : ''; return miss && q.options[q.answer].toLowerCase().includes(miss) ? '' : 'missing part'; });
    set('g3dt-mk-tap', (q, m) => { const d = document.createElement('div'); d.innerHTML = q.q; const tbl = [...d.querySelectorAll('tbody tr')].map(tr => +tr.lastElementChild.textContent); return tbl.join() === m.rows.map(r => r[1]).join() && m.rows[m.i][1] !== m.bad && q.answer === String(m.i) ? '' : 'wrong bar'; });
    set('g3dt-mk-lines', (q, m) => q.answer * m.s === m.v ? '' : 'lines');
    set('g3dt-mk-count', (q, m) => { const d = document.createElement('div'); d.innerHTML = q.fig; const tbl = [...d.querySelectorAll('tbody tr')].map(tr => +tr.lastElementChild.textContent); return q.answer * m.key === tot(tbl) && tbl.join() === m.rows.map(r => r[1]).join() ? '' : 'pictures'; });
    set('g3dt-mk-fill', (q, m) => q.answers.every((x, i) => x * m.key === m.rows[i][1]) ? '' : 'pictures');
    set('g3dt-mk-max', (q, m) => q.answer === Math.max(...m.rows.map(r => r[1])) ? '' : 'biggest');
    set('g3dt-mk-parts', q => /title/.test(q.options[q.answer]) && /source/.test(q.options[q.answer]) ? '' : 'parts');
    set('g3dt-dec-two', (q, m) => q.answer === val(m, m.a) + val(m, m.b) - val(m, m.z) && q.answer > 0 ? '' : 'two-step');
    set('g3dt-dec-add', (q, m) => q.answer === val(m, m.a) + val(m, m.b) ? '' : 'together');
    set('g3dt-dec-cmp', (q, m) => q.options[q.answer] === (m.v1 > m.v2 ? 'Room 5' : m.v1 < m.v2 ? 'Room 6' : 'The same') ? '' : 'room');
    set('g3dt-dec-both', (q, m) => q.answer === m.v1 + m.v2 ? '' : 'both rooms');
    set('g3dt-dec-half', (q, m) => rowsOk(q, m) && ((2 * val(m, m.name) > tot(m.rows.map(r => r[1]))) === q.answer) ? '' : 'truth');
    set('g3dt-dec-need', (q, m) => q.answer === val(m, m.a) - val(m, m.b) ? '' : 'votes needed');
    set('g3dt-dec-pick', (q, m) => same(q.options.map((o, j) => val(m, o) > m.lim ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
    /* mean and mode */
    set('g3dt-mode-num', (q, m) => { const md = modesOf(m.v); return md.length === 1 && q.answer === md[0] ? '' : 'mode'; });
    set('g3dt-mode-how', (q, m) => q.options[q.answer] === ['No mode', 'One mode', 'Two modes'][modesOf(m.v).length] ? '' : 'how many modes');
    set('g3dt-mode-pick', (q, m) => same(q.options.map((o, j) => modesOf(m.v).includes(+o) ? j : -1).filter(j => j >= 0), q.answer) && modesOf(m.v).every(x => q.options.includes(String(x))) ? '' : 'modes');
    set('g3dt-mode-times', (q, m) => modesOf(m.v)[0] === m.m && q.answer === m.v.filter(x => x === m.m).length ? '' : 'times');
    set('g3dt-mode-fill', (q, m) => { const c = tally(m.v), ks = Object.keys(c).map(Number).sort((x, y) => x - y), md = modesOf(m.v); return md.length === 1 && q.answers.join() === ks.map(k => c[k]).concat(md).join() ? '' : 'counts'; });
    set('g3dt-mode-tf', (q, m) => ((modesOf(m.v)[0] === m.said) === q.answer) ? '' : 'truth');
    set('g3dt-mode-order', q => q.items.every((x, i) => !i || +x > +q.items[i - 1]) ? '' : 'order');
    set('g3dt-mean-num', (q, m) => q.answer === avg(m.v) ? '' : 'mean');
    set('g3dt-mean-fill', (q, m) => q.answers[0] === tot(m.v) && q.answers[1] === avg(m.v) ? '' : 'mean');
    set('g3dt-mean-tf', (q, m) => ((avg(m.v) === m.said) === q.answer) ? '' : 'truth');
    set('g3dt-mean-miss', (q, m) => avg(m.rest.concat([q.answer])) === m.m ? '' : 'missing value');
    set('g3dt-mean-sum', (q, m) => q.answer === tot(m.v) ? '' : 'total');
    set('g3dt-mm-fill', (q, m) => q.answers[0] === avg(m.v) && modesOf(m.v).length === 1 && q.answers[1] === modesOf(m.v)[0] ? '' : 'mean and mode');
    set('g3dt-mm-which', (q, m) => q.options[q.answer] === (/fair share|equally|even/.test(m.use) ? 'The mean' : 'The mode') ? '' : 'measure');
    set('g3dt-mm-tf', (q, m) => ((avg(m.v) === modesOf(m.v)[0]) === q.answer) ? '' : 'truth');
    set('g3dt-mm-diff', (q, m) => q.answer === Math.abs(avg(m.v) - modesOf(m.v)[0]) ? '' : 'difference');
    set('g3dt-mm-same', (q, m) => q.options[q.answer] === (avg(m.v) === modesOf(m.v)[0] ? 'Yes' : 'No') ? '' : 'same or not');
    set('g3dt-pop-means', (q, m) => q.answers[0] === avg(m.a) && q.answers[1] === avg(m.b) ? '' : 'means');
    set('g3dt-pop-modes', (q, m) => modesOf(m.a).length === 1 && modesOf(m.b).length === 1 && q.answers[0] === modesOf(m.a)[0] && q.answers[1] === modesOf(m.b)[0] ? '' : 'modes');
    set('g3dt-pop-same', (q, m) => { const t = H.strip(q.options[q.answer]); return t.startsWith(avg(m.a) === avg(m.b) ? 'Same mean' : 'Different means') && t.endsWith(modesOf(m.a)[0] === modesOf(m.b)[0] ? 'same mode' : 'different modes') ? '' : 'result'; });
    set('g3dt-pop-tf', (q, m) => ((modesOf(m.a)[0] === modesOf(m.b)[0]) === q.answer) ? '' : 'truth');
    set('g3dt-pop-diff', (q, m) => q.answer === Math.abs(avg(m.a) - avg(m.b)) && q.answer > 0 ? '' : 'difference');
    set('g3dt-pop-mean2', (q, m) => q.options[q.answer] === (avg(m.a) === avg(m.b) ? 'Yes' : 'No') ? '' : 'same or not');
    /* chance */
    set('g3dt-ch-word', (q, m) => H.strip(q.options[q.answer]).toLowerCase() === likeWord(m.red, m.blue) ? '' : 'word');
    set('g3dt-ch-match', q => q.pairs.every(p => { const n = nums(p[0]); return likeWord(n[0], n[1]) === p[1].toLowerCase(); }) ? '' : 'pairs');
    set('g3dt-ch-order', q => { const v = q.items.map(t => { const n = nums(t); return n[0] / (n[0] + n[1]); }); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
    set('g3dt-ch-tf', (q, m) => ((likeWord(m.red, m.blue) === m.said) === q.answer) ? '' : 'truth');
    set('g3dt-ch-certain', (q, m) => q.answer === m.blue ? '' : 'take out');
    set('g3dt-ch-red', (q, m) => q.answer === m.red ? '' : 'red');
    set('g3dt-ch-cmp', (q, m) => q.options[q.answer] === (m.red > m.blue ? 'More' : m.red === m.blue ? 'The same' : 'Fewer') ? '' : 'compare');
    set('g3dt-pr-about', (q, m) => q.answer * m.n === m.S * m.r ? '' : 'prediction');
    set('g3dt-pr-best', (q, m) => { const f = b => b.red / (b.red + b.blue), top = Math.max(...m.bags.map(f)); return m.bags.filter(b => f(b) === top).length === 1 && one(q, o => { const n = nums(o); return n[0] / (n[0] + n[1]) === top; }) ? '' : 'best bag'; });
    set('g3dt-pr-fair', (q, m) => ((2 * m.r === m.n) === q.answer) ? '' : 'truth');
    set('g3dt-pr-add', (q, m) => m.blue + q.answer === m.red ? '' : 'blue to add');
    set('g3dt-pr-rest', q => { const n = nums(q.q); return q.answer === n[0] - n[1] - n[2] ? '' : 'green'; });
    set('g3dt-pr-most', (q, m) => { const top = Object.keys(m.bag).filter(c => m.bag[c] === Math.max(...Object.values(m.bag))); return top.length === 1 && H.strip(q.options[q.answer]).toLowerCase() === top[0] ? '' : 'colour'; });
    set('g3dt-pr-parts', (q, m) => q.answer === m.r ? '' : 'parts');
    set('g3dt-pr-groups', (q, m) => q.answer * m.n === m.S ? '' : 'groups');
  }
  /* --- shapes (full chapter) --- */
  /* facts about each object, from the definitions (flat faces, edges, vertices; curved ones by flat faces, curved surface, point) */
  const shO = {
    'cube': { f: 6, e: 12, v: 8, see: 3, sq: 6, kind: 'Prism', base: 'square', allSq: 1, rect: 0, tri: 0, pt: 0, cs: 0 },
    'rectangular prism': { f: 6, e: 12, v: 8, see: 3, sq: 6, kind: 'Prism', base: 'rectangle', allSq: 0, rect: 6, tri: 0, pt: 0, cs: 0 },
    'triangular prism': { f: 5, e: 9, v: 6, see: 2, sq: 3, kind: 'Prism', base: 'triangle', allSq: 0, rect: 3, tri: 2, pt: 0, cs: 0 },
    'square-based pyramid': { f: 5, e: 8, v: 5, see: 2, sq: 1, kind: 'Pyramid', base: 'square', allSq: 0, rect: 0, tri: 4, pt: 1, cs: 0 },
    'triangular pyramid': { f: 4, e: 6, v: 4, see: 2, sq: 0, kind: 'Pyramid', base: 'triangle', allSq: 0, rect: 0, tri: 4, pt: 1, cs: 0 },
    'cylinder': { f: 2, kind: 'Neither', pt: 0, cs: 1 },
    'cone': { f: 1, kind: 'Neither', pt: 1, cs: 1 }
  };
  const shFill = { 'cube': [6], 'rectangular prism': [6], 'triangular prism': [2, 3, 5], 'square-based pyramid': [1, 4, 5], 'triangular pyramid': [1, 3, 4], 'cylinder': [2, 1], 'cone': [1, 1, 1] };
  /* edges counted in groups: prisms front, back, going back; pyramids base, up to the point */
  const shGroups = { 'cube': [4, 4, 4], 'rectangular prism': [4, 4, 4], 'triangular prism': [3, 3, 3], 'square-based pyramid': [4, 4], 'triangular pyramid': [3, 3] };
  const shPick = q => H.strip(q.options[q.answer]);
  const shOnly = (list, ok, ans) => { const hit = list.map((x, j) => ok(x) ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === ans; };
  const shPicks = (q, ok) => same(q.options.map((o, j) => ok(H.strip(o)) ? j : -1).filter(j => j >= 0), q.answer);
  const shClue = { c6sq: o => o.f === 6 && o.allSq, c6re: o => o.f === 6 && o.e && !o.allSq, c5re: o => o.f === 5 && o.rect === 3, c5pt: o => o.f === 5 && o.pt, c4tr: o => o.f === 4 && o.tri === 4,
    c8v: o => o.v === 8 && o.allSq, c6v: o => o.v === 6 && o.e === 9, c5v: o => o.v === 5 && o.e === 8, ccy: o => o.cs && o.f === 2, cco: o => o.cs && o.pt };
  const shFit = id => { const n = Object.keys(shO).filter(k => shClue[id](shO[k])); return n.length === 1 ? n[0] : '?'; };
  const shCount = (n, ask) => ask === 'flat' ? shO[n].f : ask === 'point' ? shO[n].pt : shO[n].cs;
  /* structures, from the top down */
  const shSt = { house: ['triangular prism', 'cube'], barn: ['triangular prism', 'rectangular prism'], tower: ['square-based pyramid', 'cube'], silo: ['cone', 'cylinder'], tall: ['square-based pyramid', 'cube', 'cube'], shed: ['triangular prism', 'rectangular prism', 'rectangular prism'] };
  const shFront = { house: 'a square and a triangle', barn: 'a rectangle and a triangle', tower: 'a square and a triangle', silo: 'a rectangle and a triangle', tall: '2 squares and a triangle', shed: '2 rectangles and a triangle' };
  const shSay = st => shSt[st].map(n => (/^[aeiou]/.test(n) ? 'an ' : 'a ') + n).join(' on ');
  const shSorted = d => d.slice().sort((a, b) => a - b).join();
  /* walking on the map: x is the column (A = 0), y the row (1 = 0); 0 north, 1 east, 2 south, 3 west */
  const shDN = ['north', 'east', 'south', 'west'], shT = { 'quarter turn right': 1, 'half turn': 2, 'quarter turn left': 3 };
  const shWalk = (x, y, d, acts) => { acts.forEach(t => { if (t === 'right') d = (d + 1) % 4; else if (t === 'left') d = (d + 3) % 4; else if (t === 'half') d = (d + 2) % 4; else { const n = +t.split(' ')[1]; x += [0, 1, 0, -1][d] * n; y += [1, 0, -1, 0][d] * n; } }); return { x, y, d, at: 'ABCDEF'[x] + (y + 1) }; };
  const shTurn = (d, mv) => mv.reduce((a, m) => (a + shT[m]) % 4, d);
  set('g3sh-f-num', (q, m) => m.names.reduce((a, n) => a + shO[n].f, 0) === q.answer ? '' : 'flat faces');
  set('g3sh-f-fill', (q, m) => shFill[m.name].join() === q.answers.join() ? '' : 'faces');
  set('g3sh-f-tap', (q, m) => shOnly(m.names, n => shO[n].f === m.n, q.answer) && nums(q.q)[0] === m.n ? '' : 'object');
  set('g3sh-f-tf', (q, m) => (shO[m.name].f === m.said) === q.answer ? '' : 'truth');
  set('g3sh-f-see', (q, m) => q.answer === shO[m.name].see ? '' : 'faces seen');
  set('g3sh-f-hid', (q, m) => q.answer === shO[m.name].f - shO[m.name].see ? '' : 'hidden faces');
  set('g3sh-e-num', (q, m) => m.names.reduce((a, n) => a + shO[n][m.part], 0) === q.answer ? '' : 'count');
  set('g3sh-e-group', (q, m) => q.answer === shGroups[m.name][m.g] ? '' : 'group');
  set('g3sh-e-order', (q, m) => { const g = shGroups[m.name]; return g.concat([shO[m.name].e]).join() === q.answers.join() && g.reduce((a, b) => a + b, 0) === shO[m.name].e ? '' : 'groups'; });
  set('g3sh-e-tap', (q, m) => shOnly(m.names, n => shO[n][m.part] === m.n, q.answer) ? '' : 'object');
  set('g3sh-e-tf', (q, m) => (shO[m.name][m.part] === m.said) === q.answer ? '' : 'truth');
  set('g3sh-k-kind', (q, m) => shPick(q) === shO[m.name].kind ? '' : 'kind');
  set('g3sh-k-name', (q, m) => shPick(q) === m.name ? '' : 'name');
  set('g3sh-k-base', (q, m) => shPick(q) === shO[m.name].base ? '' : 'base');
  set('g3sh-k-sides', (q, m) => q.answer === (m.ask === 'side' ? m.n : m.n + (m.kind === 'prism' ? 2 : 1)) ? '' : 'faces');
  set('g3sh-k-tf', (q, m) => (m.said === m.name) === q.answer ? '' : 'truth');
  set('g3sh-k-pick', (q, m) => shPicks(q, n => shO[n].kind.toLowerCase() === m.want) ? '' : 'picks');
  set('g3sh-k-ends', (q, m) => (shO[m.name].kind === 'Prism' ? /^Two/ : /^One/).test(shPick(q)) ? '' : 'ends');
  set('g3sh-c-num', (q, m) => Object.keys(m.c).reduce((a, k) => a + m.c[k] * shCount({ cyl: 'cylinder', cone: 'cone', cube: 'cube' }[k], m.ask), 0) === q.answer ? '' : 'count');
  set('g3sh-c-fill', (q, m) => shFill[m.name].join() === q.answers.join() ? '' : 'parts');
  set('g3sh-c-which', (q, m) => { const want = { 'has a curved surface and a point': 'cone', 'has a curved surface and no point': 'cylinder', 'has 2 flat faces that are circles': 'cylinder', 'has only 1 flat face': 'cone' }[m.clue]; return shPick(q) === want ? '' : 'object'; });
  set('g3sh-c-pick', q => shPicks(q, n => shO[n].cs) ? '' : 'picks');
  set('g3sh-c-tf', (q, m) => (shCount(m.name, m.ask) === m.said) === q.answer ? '' : 'truth');
  set('g3sh-c-yes', q => shPick(q) === 'Curved' ? '' : 'curved');
  set('g3sh-w-mc', (q, m) => shPick(q) === shFit(m.clue) ? '' : 'object');
  set('g3sh-w-tap', (q, m) => m.names[q.answer] === shFit(m.clue) && m.names.filter(n => n === shFit(m.clue)).length === 1 ? '' : 'object');
  set('g3sh-w-sqc', (q, m) => q.answer === shO[m.name].sq ? '' : 'square corners');
  set('g3sh-w-cmp', (q, m) => q.answer === (m.part === 'ev' ? shO[m.a].e - shO[m.a].v : shO[m.a][m.part] - shO[m.b][m.part]) && q.answer > 0 ? '' : 'difference');
  set('g3sh-w-tf', (q, m) => (shFit(m.clue) === m.said) === q.answer ? '' : 'truth');
  set('g3sh-w-tell', (q, m) => { const yes = /squares/.test(m.ask) ? shO[m.name].allSq : shO[m.name].pt; return /^Yes/.test(shPick(q)) === !!yes ? '' : 'tell apart'; });
  set('g3sh-w-ab', (q, m) => shPick(q) === 'A: the ' + shFit(m.clue) ? '' : 'which');
  set('g3sh-b-mc', (q, m) => shPick(q) === shSay(m.st) ? '' : 'parts');
  set('g3sh-b-count', (q, m) => q.answer === m.n * shSt[m.st].length ? '' : 'objects');
  set('g3sh-b-fill', (q, m) => { const names = q.fill.split('<br>').slice(0, -1).map(l => H.strip(l).replace(/: .*$/, '').toLowerCase()); return same(names, shSt[m.st]) && q.answers.join() === names.map(n => shO[n].f).concat([shSt[m.st].reduce((a, n) => a + shO[n].f, 0)]).join() ? '' : 'faces'; });
  set('g3sh-b-faces', (q, m) => q.answer === m.n * shSt[m.st].reduce((a, n) => a + shO[n].f, 0) ? '' : 'faces');
  set('g3sh-b-front', (q, m) => shPick(q) === shFront[m.st] ? '' : 'front');
  set('g3sh-b-pick', (q, m) => shPicks(q, n => shSt[m.st].includes(n)) ? '' : 'picks');
  set('g3sh-b-tf', (q, m) => (m.said === shSay(m.st)) === q.answer ? '' : 'truth');
  set('g3sh-b-part', (q, m) => shPick(q) === (m.which === 'top' ? shSt[m.st][0] : shSt[m.st][shSt[m.st].length - 1]) ? '' : 'part');
  set('g3sh-cf-mc', (q, m) => /^Yes/.test(shPick(q)) === (shSorted(m.a) === shSorted(m.b)) ? '' : 'congruent');
  set('g3sh-cf-count', (q, m) => q.answer === m.list.filter(f => shSorted(f) === shSorted(m.a)).length && q.answer > 0 ? '' : 'congruent faces');
  set('g3sh-cf-side', (q, m) => q.answer === m.a[0] + m.a[1] - m.given && m.a.includes(m.given) ? '' : 'side');
  set('g3sh-cf-box', (q, m) => { const d = m.d, fs = [[d[0], d[1]], [d[0], d[1]], [d[1], d[2]], [d[1], d[2]], [d[0], d[2]], [d[0], d[2]]]; return q.answer === fs.filter(f => shSorted(f) === shSorted([d[0], d[2]])).length ? '' : 'faces'; });
  set('g3sh-cf-tap', (q, m) => shOnly(m.set, f => shSorted(f) === shSorted(m.a), q.answer) ? '' : 'face');
  set('g3sh-cf-tf', (q, m) => (shSorted(m.a) !== shSorted(m.b)) === q.answer ? '' : 'truth');
  set('g3sh-cf-edges', (q, m) => q.answer === 4 * m.d.filter(x => x === m.L).length ? '' : 'edges');
  set('g3sh-cf-sort', (q, m) => shSorted(m.s) === q.answers.join() && q.answers[0] <= q.answers[1] ? '' : 'sorted');
  set('g3sh-cb-mc', (q, m) => /^Yes/.test(shPick(q)) === (shSorted(m.a) === shSorted(m.b)) ? '' : 'congruent');
  set('g3sh-cb-miss', (q, m) => { const left = m.a.slice(); m.given.forEach(g => { left.splice(left.indexOf(g), 1); }); return left.length === 1 && left[0] === q.answer ? '' : 'length'; });
  set('g3sh-cb-sort', (q, m) => shSorted(m.d) === q.answers.join() && q.answers[0] <= q.answers[1] && q.answers[1] <= q.answers[2] ? '' : 'sorted');
  set('g3sh-cb-tap', (q, m) => shOnly(m.set, b => shSorted(b) === shSorted(m.a), q.answer) ? '' : 'box');
  set('g3sh-cb-tf', (q, m) => (shSorted(m.a) === shSorted(m.b)) === q.answer ? '' : 'truth');
  set('g3sh-cb-cubes', (q, m) => q.answer === m.d[0] * m.d[1] * m.d[2] ? '' : 'cubes');
  set('g3sh-t-mc', (q, m) => shPick(q) === shDN[shTurn(m.d, m.mv)] ? '' : 'direction');
  set('g3sh-t-tap', (q, m) => q.answer === shDN[shTurn(m.d, m.mv)] ? '' : 'direction');
  set('g3sh-t-quarters', (q, m) => q.answer === m.mv.reduce((a, t) => a + shT[t], 0) && m.mv.every(t => t !== 'quarter turn left') ? '' : 'quarter turns');
  set('g3sh-t-count', (q, m) => { const ok = [1, 2, 3].filter(k => (m.from + (m.way === 'right' ? k : 4 - k)) % 4 === m.to); return ok.length === 1 && ok[0] === q.answer ? '' : 'quarter turns'; });
  set('g3sh-t-match', (q, m) => q.pairs.every(p => shDN[(m.d + shT[p[0].replace(/^an? /, '')]) % 4] === p[1]) ? '' : 'pairs');
  set('g3sh-t-tf', (q, m) => (shDN[shTurn(m.d, m.mv)] === m.said) === q.answer ? '' : 'truth');
  set('g3sh-t-full', (q, m) => (m.n + q.answer) % 4 === 0 && q.answer >= 1 && q.answer <= 3 ? '' : 'turns');
  set('g3sh-t-q', (q, m) => q.answer === (m.mv === 'half turn' ? 2 : 1) ? '' : 'quarter turns');
  set('g3sh-p-tap', (q, m) => q.answer === shWalk(m.x, m.y, m.d, m.acts).at ? '' : 'square');
  set('g3sh-p-mc', (q, m) => shPick(q) === shWalk(m.x, m.y, m.d, m.acts).at ? '' : 'square');
  set('g3sh-p-home', (q, m) => { const e = shWalk(m.x, m.y, m.d, m.acts); return q.answer === Math.abs(e.x - m.x) + Math.abs(e.y - m.y) && q.answer > 0 ? '' : 'way back'; });
  set('g3sh-p-walk', (q, m) => q.answer === m.acts.filter(t => /^forward/.test(t)).reduce((a, t) => a + +t.split(' ')[1], 0) ? '' : 'squares');
  set('g3sh-p-dist', (q, m) => q.answer === Math.abs(m.to[0] - m.from[0]) + Math.abs(m.to[1] - m.from[1]) && (m.to[0] === m.from[0] || m.to[1] === m.from[1]) ? '' : 'distance');
  set('g3sh-p-tf', (q, m) => (shWalk(m.x, m.y, m.d, m.acts).at === m.said) === q.answer ? '' : 'truth');
  set('g3sh-p-face', (q, m) => shPick(q) === shDN[shWalk(0, 0, m.d, m.acts).d] ? '' : 'facing');
  set('g3sh-g-fill', (q, m) => { const t = shWalk(m.x, m.y, 0, ['forward ' + q.answers[0], m.turn, 'forward ' + q.answers[1]]); return t.x === m.to[0] && t.y === m.to[1] ? '' : 'directions'; });
  set('g3sh-g-turn', (q, m) => shPick(q) === 'quarter turn ' + (m.to[0] > m.x ? 'right' : 'left') ? '' : 'turn');
  set('g3sh-g-fewest', (q, m) => q.answer === Math.abs(m.to[0] - m.from[0]) + Math.abs(m.to[1] - m.from[1]) ? '' : 'fewest');
  set('g3sh-g-tf', (q, m) => { const t = shWalk(m.x, m.y, 0, m.acts); return (t.x === m.to[0] && t.y === m.to[1]) === q.answer ? '' : 'truth'; });
  set('g3sh-g-which', (q, m) => { const a = shPick(q).split(', '); const t = shWalk(m.x, m.y, 0, [a[0], a[1].replace('quarter turn ', ''), a[2]]); return t.x === m.to[0] && t.y === m.to[1] ? '' : 'directions'; });
  set('g3sh-g-back', (q, m) => { const turn = q.fill.match(/quarter turn (right|left)/)[1]; const t = shWalk(m.to[0], m.to[1], m.turn === 'right' ? 1 : 3, ['half', 'forward ' + q.answers[0], turn, 'forward ' + q.answers[1]]); return t.x === m.x && t.y === m.y && t.d === 2 ? '' : 'way back'; });
  set('g3sh-g-up', (q, m) => q.answer === m.to[1] - m.y ? '' : 'rows');
  set('g3sh-g-across', (q, m) => q.answer === Math.abs(m.to[0] - m.x) ? '' : 'columns');
  /* --- length-area (full chapter) --- */
  const laDom = h => { const d = document.createElement('div'); d.innerHTML = h || ''; return d; };
  const laPick = q => H.strip(q.options[q.answer]);
  const laBolds = q => [...String(q.q).matchAll(/<b>([^<]+)<\/b>/g)].map(x => H.strip(x[1]));
  const laOnly = (list, ok, ans) => { const hit = list.map((x, j) => ok(x) ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === ans; };
  const laAdd = a => a.reduce((x, y) => x + y, 0);
  const laUp = vs => vs.every((x, i) => !i || x > vs[i - 1]);
  /* lengths in mm: "3 m 40 cm", "2 km 50 m", "45 mm", "7 cm 3 mm" */
  const LA_MM = { mm: 1, cm: 10, m: 1000, km: 1000000 };
  const laLen = t => { const s = H.strip(t).replace(/^about /, ''); if (!/^(\d+ (mm|cm|m|km) ?)+$/.test(s)) return NaN; return [...s.matchAll(/(\d+) (mm|cm|m|km)/g)].reduce((a, x) => a + +x[1] * LA_MM[x[2]], 0); };
  /* "X = ___ unit" or "X = ? unit": the answer in that unit equals X */
  const laConv = q => { const p = H.strip(q.q).split('='), u = (p[1] || '').match(/(mm|cm|m|km)\b/); return u && q.answer * LA_MM[u[1]] === laLen(p[0]) ? '' : 'conversion'; };
  /* what each thing is, how long it is and its unit */
  const LA_TH = { 'an ant': [5, 'mm'], 'a ladybug': [8, 'mm'], 'a grain of rice': [6, 'mm'], 'a crayon': [9, 'cm'], 'a pencil': [19, 'cm'], 'a book': [28, 'cm'], 'a door': [2, 'm'], 'a canoe': [5, 'm'], 'a school bus': [12, 'm'], 'a hiking trail': [4, 'km'], 'the road to the next town': [15, 'km'] };
  const LA_U = ['mm', 'cm', 'm', 'km'];
  const laTh = t => LA_TH[H.strip(t).toLowerCase()] || LA_TH[H.strip(t).charAt(0).toLowerCase() + H.strip(t).slice(1)];
  /* reads a ruler picture: [start, end] in cm, from the number labels and the dashed end lines */
  const laRuler = svg => { const d = laDom(svg), l = [...d.querySelectorAll('.rl')].map(t => [+t.textContent, +t.getAttribute('x')]), per = (l[1][1] - l[0][1]) / (l[1][0] - l[0][0]), x0 = l[0][1] - l[0][0] * per, at = c => Math.round((+d.querySelector(c).getAttribute('x1') - x0) / per * 10) / 10; return [at('.oa'), at('.ob')]; };
  const laRulerLen = svg => { const r = laRuler(svg); return Math.round((r[1] - r[0]) * 10) / 10; };
  /* side labels of a drawn shape, in drawing order: "12 cm" -> 12 */
  const laSides = svg => [...laDom(svg).querySelectorAll('.sd')].map(t => +t.textContent.split(' ')[0]);
  const laLabels = svg => [...laDom(svg).querySelectorAll('text')].map(t => t.textContent.match(/^(\d+) (cm|m)$/)).filter(Boolean).map(x => +x[1]);
  const laRect = svg => { const v = laLabels(svg); return { l: v[0], w: v[1] }; };
  const laSq = svg => laDom(svg).querySelectorAll('.sq').length;
  const laSqSets = h => [...laDom(h).querySelectorAll('svg')].map(s => s.querySelectorAll('.sq').length);
  const laRows = svg => new Set([...laDom(svg).querySelectorAll('.sq')].map(r => r.getAttribute('y'))).size;
  /* tiles on a rectangle: 'fit', 'gap' or 'over', and how many */
  const laTiles = svg => { const d = laDom(svg), bg = d.querySelector('.bg'), t = [...d.querySelectorAll('.tl')].map(r => ['x', 'y', 'width', 'height'].map(a => +r.getAttribute(a))), area = +bg.getAttribute('width') * +bg.getAttribute('height');
    const over = t.some((a, i) => t.some((b, j) => j > i && a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3]));
    const step = Math.min(...t.slice(1).map(b => Math.abs(b[0] - t[0][0])).filter(x => x > 0.5)), fits = Math.abs(t.length * step * step - area) < step;
    return { n: t.length, mode: over ? 'over' : t[0][2] + 4 < step - 1 ? 'gap' : fits ? 'fit' : '?' }; };
  const LA_SAID = { gap: 'too low', over: 'too high', fit: 'just right' };
  /* a curved shape on a grid: counts full squares and more-than-half squares, sampling each square 30 by 30 */
  const laBlob = svg => { const d = laDom(svg), e = d.querySelector('ellipse'), g = [...d.querySelectorAll('.gv')].map(l => +l.getAttribute('x1')), c = (g[g.length - 1] - g[0]) / (g.length - 1), x0 = g[0], H0 = Math.round((+d.querySelector('.gv').getAttribute('y2') - x0) / c);
    const ex = (+e.getAttribute('cx') - x0) / c, ey = (+e.getAttribute('cy') - x0) / c, rx = +e.getAttribute('rx') / c, ry = +e.getAttribute('ry') / c, N = 30; let full = 0, half = 0;
    for (let y = 0; y < H0; y++) for (let x = 0; x < g.length - 1; x++) { let k = 0; for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) { const px = (x + (a + 0.5) / N - ex) / rx, py = (y + (b + 0.5) / N - ey) / ry; if (px * px + py * py <= 1) k++; } const f = k / N / N; if (f > 0.96) full++; else if (f > 0.5) half++; }
    return { full: full, half: half }; };
  /* unit name -> its length in cm */
  const LA_UNIT = { erasers: 2, 'paper clips': 3, sticks: 4, blocks: 5, crayons: 6, straws: 8, 'craft sticks': 10, pencils: 12, 'hand spans': 15, 'shoe lengths': 20, 'forearm lengths': 25 };
  const laUnitOf = t => LA_UNIT[H.strip(t).replace(/^the /, '')];
  /* benchmarks */
  set('g3la-bn-unit', (q, m) => q.options.length === 4 && laPick(q) === laTh(m.t)[1] ? '' : 'unit');
  set('g3la-bn-size', (q, m) => q.options.length === 4 && q.answer === LA_U.indexOf(laTh(m.t)[1]) ? '' : 'size');
  set('g3la-bn-est', q => { const n = laDom(q.fig).querySelectorAll('ellipse').length, t = H.strip(q.q), per = /about 50 cm/.test(t) ? 50 : /centimetres\?$/.test(t) ? 100 : 1; return q.answer === n * per && nums(t)[0] === n ? '' : 'estimate'; });
  set('g3la-bn-match', q => q.pairs.every(p => laTh(p[0])[1] === p[1]) ? '' : 'pairs');
  set('g3la-bn-tf', (q, m) => { const t = laTh(m.t); return (t[0] + ' ' + t[1] === m.n + ' ' + m.u) === q.answer && bold(q) === m.n + ' ' + m.u ? '' : 'truth'; });
  set('g3la-bn-order', q => laUp(q.items.map(t => LA_U.indexOf(laTh(t)[1]))) ? '' : 'order');
  set('g3la-bn-pick', (q, m) => same(q.options.map((o, j) => laTh(o)[1] === m.u ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  /* rulers */
  set('g3la-rl-num', q => q.answer === laRulerLen(q.fig) ? '' : 'length');
  set('g3la-rl-mc', q => laOnly(q.options, o => nums(o)[0] === laRulerLen(q.fig), q.answer) ? '' : 'length');
  set('g3la-rl-fill', q => { const r = laRuler(q.fig); return q.answers[0] === r[0] && q.answers[1] === r[1] && q.answers[2] === r[1] - r[0] ? '' : 'ruler'; });
  set('g3la-rl-story', q => { const n = nums(q.q); return q.answer === n[1] - n[0] && laRulerLen(q.fig) === q.answer ? '' : 'distance'; });
  set('g3la-rl-tf', (q, m) => (laRulerLen(q.fig) === m.said) === q.answer && bold(q) === m.said + ' cm' ? '' : 'truth');
  set('g3la-rl-line', q => { const n = laBolds(q).map(b => nums(b)[0]); return q.answer === n[0] + n[1] && q.answer <= q.max ? '' : 'point'; });
  set('g3la-rl-start', (q, m) => q.answer === m.a ? '' : 'start');
  set('g3la-rl-end', (q, m) => q.answer === m.b ? '' : 'end');
  set('g3la-rl-len', (q, m) => q.answer === m.b - m.a ? '' : 'length');
  /* mm and cm */
  set('g3la-mm-bare', laConv);
  set('g3la-mm-pic', q => q.answer === Math.round(laRuler(q.fig)[1] * 10) ? '' : 'mm');
  set('g3la-mm-fill', q => { const b = Math.round(laRuler(q.fig)[1] * 10); return q.answers[0] * 10 + q.answers[1] === b && q.answers[1] < 10 && q.answers[2] === b ? '' : 'mm'; });
  set('g3la-mm-fill3', q => q.answers[0] * 10 + q.answers[1] === nums(q.fill)[0] && q.answers[1] < 10 ? '' : 'mm');
  set('g3la-mm-tf', q => { const p = bold(q).split(' = '); return (laLen(p[0]) === laLen(p[1])) === q.answer ? '' : 'truth'; });
  set('g3la-mm-match', q => q.pairs.every(p => laLen(p[0]) === laLen(p[1])) && new Set(q.pairs.map(p => laLen(p[0]))).size === q.pairs.length ? '' : 'pairs');
  set('g3la-mm-order', q => laUp(q.items.map(laLen)) ? '' : 'order');
  set('g3la-mm-cm', (q, m) => q.answer === m.v ? '' : 'count');
  set('g3la-mm-tens', q => q.answer === nums(q.q)[0] * 10 ? '' : 'tens');
  set('g3la-mm-add', q => q.answer === ev(H.strip(q.q).split('=')[0]) ? '' : 'sum');
  /* m and km */
  set('g3la-m-conv', laConv);
  set('g3la-m-many', laConv);
  set('g3la-m-one', q => { const u = H.strip(q.q).match(/many (\w+) make 1 (\w+)/); return q.answer * LA_MM[u[1]] === LA_MM[u[2]] ? '' : 'unit'; });
  set('g3la-m-story', q => { const t = H.strip(q.q); let m;
    if ((m = t.match(/is (\d+) m long\. How many centimetres/))) return q.answer === +m[1] * 100 ? '' : 'cm';
    if ((m = t.match(/runs (\d+) laps of a (\d+) m track/))) return q.answer === +m[1] * +m[2] ? '' : 'laps';
    if ((m = t.match(/is (\d+ km \d+ m) long\..*there and back/))) return q.answer * 1000 === 2 * laLen(m[1]) ? '' : 'there and back';
    return 'story'; });
  set('g3la-m-fill', q => { const u = q.fill.match(/\]\] (\w+) make 1 (\w+)\. So (\d+) /), per = LA_MM[u[2]] / LA_MM[u[1]]; return q.answers[0] === per && q.answers[1] === per * +u[3] ? '' : 'fill'; });
  set('g3la-m-tf', q => { const p = bold(q).split(' = '); return (laLen(p[0]) === laLen(p[1])) === q.answer ? '' : 'truth'; });
  set('g3la-m-match', q => q.pairs.every(p => laLen(p[0]) === laLen(p[1])) && new Set(q.pairs.map(p => laLen(p[0]))).size === q.pairs.length ? '' : 'pairs');
  /* compare lengths */
  set('g3la-cp-mc', q => { const a = laLen(q.options[0]), b = laLen(q.options[1]); return q.options.length === 3 && q.answer === (a > b ? 0 : b > a ? 1 : 2) ? '' : 'longer'; });
  set('g3la-cp-diff', (q, m) => { const b = laBolds(q); return q.answer * LA_MM[m.u] === laLen(b[0]) - laLen(b[1]) && b[0] === m.L ? '' : 'difference'; });
  set('g3la-cp-fill', q => { const t = H.strip(q.q).match(/longer: (\d+ m) or (\d+ cm)/), a = laLen(t[1]) / 10, b = laLen(t[2]) / 10; return q.answers[0] === a && q.answers[1] === a && q.answers[2] === a - b ? '' : 'compare'; });
  set('g3la-cp-tf', q => { const b = laBolds(q); return (laLen(b[0]) > laLen(b[1])) === q.answer ? '' : 'truth'; });
  set('g3la-cp-order', q => laUp(q.items.map(laLen)) ? '' : 'order');
  set('g3la-cp-to', laConv);
  set('g3la-cp-join', q => { const b = laBolds(q), u = H.strip(q.q).match(/in (millimetres|centimetres|metres)\?/)[1]; return q.answer * LA_MM[{ millimetres: 'mm', centimetres: 'cm', metres: 'm' }[u]] === laLen(b[0]) + laLen(b[1]) ? '' : 'total'; });
  /* counting units */
  const laCt = (q, m) => { const n = nums(q.q); return n.length >= 2 ? [n[0], n[1]] : [m.L, m.u]; };
  set('g3la-ct-num', (q, m) => { const c = laCt(q, m); return q.answer * c[1] === c[0] ? '' : 'count'; });
  set('g3la-ct-rev', q => { const n = nums(q.q); return q.answer === n[0] * n[1] ? '' : 'length'; });
  set('g3la-ct-mc', (q, m) => { const n = nums(q.fig && laDom(q.fig).querySelector('text').textContent)[0]; return nums(laPick(q))[0] * m.u === m.L && n === m.L ? '' : 'count'; });
  set('g3la-ct-tf', (q, m) => { const n = nums(q.q); return (m.said * n[1] === n[0]) === q.answer && n[0] === m.L ? '' : 'truth'; });
  set('g3la-ct-one', (q, m) => q.answer === m.u ? '' : 'unit');
  /* unit size and count */
  set('g3la-sz-mc', q => { const s = q.options.map(laUnitOf), big = /bigger/.test(H.strip(q.q)), k = s.slice(0, 2), want = big ? k.indexOf(Math.min(...k)) : k.indexOf(Math.max(...k)); return q.answer === want ? '' : 'count'; });
  set('g3la-sz-conv', q => { const n = nums(q.q); return q.answer * n[2] === n[0] * n[1] ? '' : 'convert'; });
  set('g3la-sz-fill', q => { const n = nums(q.q), L = n[0] * n[1]; return q.answers[0] === L && q.answers[1] === L && q.answers[2] * n[2] === L ? '' : 'convert'; });
  set('g3la-sz-tf', (q, m) => { const s = LA_UNIT[bold(q)]; return s === m.said && (s === Math.min(m.u1, m.u2)) === q.answer ? '' : 'truth'; });
  set('g3la-sz-match', q => { const L = nums(bold(q))[0]; return q.pairs.every(p => nums(p[0])[0] * nums(p[1])[0] === L && LA_UNIT[H.strip(p[0]).replace(/^\d+ cm /, '')] === nums(p[0])[0]) ? '' : 'pairs'; });
  set('g3la-sz-fewer', q => { const n = nums(q.q); return q.answer === n[0] / n[1] - n[0] / n[2] && n[0] % n[1] === 0 && n[0] % n[2] === 0 ? '' : 'fewer'; });
  /* perimeter */
  set('g3la-pm-num', q => q.answer === laAdd(laSides(q.fig)) ? '' : 'perimeter');
  set('g3la-pm-fill', q => { const s = laSides(q.fig); let t = s[0]; return q.answers.every((a, i) => { t += s[i + 1]; return a === t; }) && q.answers.length === s.length - 1 ? '' : 'running total'; });
  set('g3la-pm-mc', q => laOnly(q.options, o => nums(o)[0] === laAdd(laSides(q.fig)), q.answer) ? '' : 'perimeter');
  set('g3la-pm-tf', (q, m) => (laAdd(laSides(q.fig)) === m.said) === q.answer ? '' : 'truth');
  set('g3la-pm-n', (q, m) => q.answer === m.n ? '' : 'sides');
  set('g3la-pm-sum', (q, m) => q.answer === laAdd(m.s) ? '' : 'perimeter');
  /* rectangles */
  const laAround = q => { if (q.fig) { const r = laRect(q.fig); return 2 * (r.l + r.w); } return ev(H.strip(q.q).split('=')[0]); };
  set('g3la-rc-num', q => q.answer === laAround(q) ? '' : 'perimeter');
  set('g3la-rc-rev', q => { const b = laBolds(q).map(x => nums(x)[0]); return q.answer === b[0] / 2 - b[1] ? '' : 'side'; });
  set('g3la-rc-fill', q => { const r = laRect(q.fig), L = Math.max(r.l, r.w), W = Math.min(r.l, r.w); return q.answers[0] === 2 * L && q.answers[1] === 2 * W && q.answers[2] === 2 * (L + W) ? '' : 'perimeter'; });
  set('g3la-rc-sq', q => q.answer === 4 * nums(bold(q))[0] ? '' : 'square');
  set('g3la-rc-tf', (q, m) => (laAround(q) === m.said) === q.answer ? '' : 'truth');
  set('g3la-rc-across', (q, m) => q.answer === m.v ? '' : 'side');
  /* curved shapes */
  set('g3la-cv-num', q => q.answer === laRulerLen(q.fig) ? '' : 'string');
  set('g3la-cv-tool', q => /string/.test(laPick(q)) && q.options.filter(o => /string/.test(o)).length === 1 ? '' : 'tool');
  set('g3la-cv-cmp', q => { const n = nums(q.q); return q.answer === n[0] - n[1] ? '' : 'difference'; });
  set('g3la-cv-fill', q => { const st = nums(H.strip(q.q).match(/straight side is (\d+) cm/)[0])[0], n = laRulerLen(q.fig); return q.answers[0] === n && q.answers[1] === st && q.answers[2] === n + st ? '' : 'perimeter'; });
  set('g3la-cv-arch', q => { const st = laLabels(laDom(q.fig).querySelector('svg').outerHTML)[0]; return q.answer === laRulerLen(q.fig) + st ? '' : 'perimeter'; });
  set('g3la-cv-tf', (q, m) => (laRulerLen(q.fig) === m.said) === q.answer ? '' : 'truth');
  set('g3la-cv-part', (q, m) => q.answer === m.n ? '' : 'curve');
  /* building a perimeter */
  set('g3la-bd-tri', (q, m) => { const n = nums(q.q); return q.answer === m.P - m.a - m.b && (/perimeter of/.test(q.q) ? n[0] === m.P && n[1] === m.a && n[2] === m.b : ev(H.strip(q.q).split('=')[0]) === q.answer) ? '' : 'side'; });
  set('g3la-bd-fill', q => { const n = nums(q.q); return q.answers[0] === n[1] + n[2] && q.answers[1] === n[1] + n[2] && q.answers[2] === n[0] - n[1] - n[2] ? '' : 'side'; });
  set('g3la-bd-pick', q => { const P = nums(laBolds(q)[1])[0]; return same(q.options.map((o, j) => { const n = nums(o); return 2 * (n[0] + n[1]) === P ? j : -1; }).filter(j => j >= 0), q.answer) && q.answer.length ? '' : 'picks'; });
  set('g3la-bd-sq', q => q.answer * 4 === nums(bold(q))[0] ? '' : 'side');
  set('g3la-bd-tap', q => { const P = nums(bold(q))[0]; return laOnly(q.tiles, t => { const r = laRect(t); return 2 * (r.l + r.w) === P; }, q.answer) ? '' : 'rectangle'; });
  set('g3la-bd-tf', q => { const T = nums(bold(q))[0], n = nums(H.strip(q.q).match(/builds a (\d+) cm by (\d+) cm/)[0]); return (2 * (n[0] + n[1]) === T) === q.answer ? '' : 'truth'; });
  /* area */
  set('g3la-ar-num', q => q.answer === laSq(q.fig) ? '' : 'area');
  set('g3la-ar-fill', q => { const n = laSq(q.fig), r = laRows(q.fig); return q.answers[0] === r && q.answers[1] * r === n && q.answers[2] === n ? '' : 'area'; });
  set('g3la-ar-tap', q => { const N = nums(bold(q))[0]; return laOnly(q.tiles, t => laSq(t) === N, q.answer) ? '' : 'shape'; });
  set('g3la-ar-story', q => { const n = H.strip(q.q).match(/(\d+) rows of (\d+)/); return q.answer === +n[1] * +n[2] && (!q.fig || laSq(q.fig) === q.answer) ? '' : 'area'; });
  set('g3la-ar-tf', (q, m) => (laSq(q.fig) === m.said) === q.answer ? '' : 'truth');
  set('g3la-ar-row', (q, m) => q.answer === m.v ? '' : 'row');
  /* gaps and overlaps */
  set('g3la-gp-mc', q => laPick(q) === LA_SAID[laTiles(q.fig).mode] ? '' : 'count');
  set('g3la-gp-tap', q => laOnly(q.tiles, t => laTiles(t).mode === 'fit', q.answer) ? '' : 'tiles');
  set('g3la-gp-short', q => { const t = laTiles(q.fig); return t.mode === 'gap' && q.answer === nums(q.q)[0] - t.n ? '' : 'fewer'; });
  set('g3la-gp-extra', q => { const t = laTiles(q.fig); return t.mode === 'over' && q.answer === t.n - nums(q.q)[0] ? '' : 'extra'; });
  set('g3la-gp-fit', q => { const t = laTiles(q.fig); return t.mode === 'fit' && q.answer === t.n ? '' : 'tiles'; });
  set('g3la-gp-left', q => { const n = nums(q.q); return q.answer === n[0] * n[1] - n[2] ? '' : 'left out'; });
  set('g3la-gp-tf', (q, m) => (LA_SAID[laTiles(q.fig).mode] === m.said) === q.answer && bold(q) === m.said ? '' : 'truth');
  set('g3la-gp-story', q => { const t = H.strip(q.q), want = /gaps/.test(t) ? 'too low' : /overlap/.test(t) ? 'too high' : /edge to edge/.test(t) ? 'just right' : '?'; return laPick(q) === want ? '' : 'count'; });
  set('g3la-gp-n', (q, m) => q.answer === m.n ? '' : 'tiles');
  set('g3la-gp-vs', (q, m) => laPick(q) === (m.n < m.N ? 'too low' : m.n > m.N ? 'too high' : 'just right') ? '' : 'count');
  /* same area */
  const laMore = (a, b) => a === b ? 2 : a > b ? 0 : 1;
  set('g3la-sm-mc', q => { const s = laSqSets(q.fig); return q.answer === laMore(s[0], s[1]) ? '' : 'area'; });
  set('g3la-sm-fill', q => { const s = laSqSets(q.fig); return q.answers[0] === s[0] && q.answers[1] === s[1] ? '' : 'count'; });
  set('g3la-sm-num', q => { const s = laSqSets(q.fig); return q.answer === s[1] && s[0] === s[1] ? '' : 'area'; });
  set('g3la-sm-diff', q => { const s = laSqSets(q.fig); return q.answer === Math.abs(s[0] - s[1]) && bold(q) === (s[0] > s[1] ? 'A' : 'B') ? '' : 'difference'; });
  set('g3la-sm-tf', q => { const s = laSqSets(q.fig), c = bold(q), want = /same area/.test(c) ? s[0] === s[1] : /^B/.test(c) ? s[1] > s[0] : s[0] > s[1]; return want === q.answer ? '' : 'truth'; });
  set('g3la-sm-tap', q => { const N = laSq(q.fig); return laOnly(q.tiles, t => laSq(t) === N, q.answer) ? '' : 'shape'; });
  set('g3la-sm-count', (q, m) => q.answer === m.v ? '' : 'count');
  set('g3la-sm-cmp', (q, m) => q.answer === laMore(m.a, m.b) ? '' : 'area');
  /* square units */
  const LA_BIG = ['a classroom floor', 'a playground', 'a hockey rink', 'a garden', 'a wall'];
  set('g3la-sq-num', q => q.answer === laSq(q.fig) ? '' : 'area');
  set('g3la-sq-pick', q => { const big = /square metres/.test(H.strip(q.q)); return same(q.options.map((o, j) => LA_BIG.includes(H.strip(o).toLowerCase()) === big ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks'; });
  set('g3la-sq-story', q => { const n = H.strip(q.q).match(/(\d+) rows of (\d+)/); return q.answer === +n[1] * +n[2] && (!q.fig || laSq(q.fig) === q.answer) ? '' : 'area'; });
  set('g3la-sq-fill', q => { const n = laSq(q.fig), r = laRows(q.fig); return q.answers[0] === r && q.answers[1] * r === n && q.answers[2] === n ? '' : 'area'; });
  set('g3la-sq-cmp', q => { const n = nums(q.q); return q.answer === n[0] * n[1] - n[2] * n[3] ? '' : 'difference'; });
  set('g3la-sq-tf', (q, m) => (laSq(q.fig) === m.said) === q.answer ? '' : 'truth');
  set('g3la-sq-side', (q, m) => q.answer === m.v ? '' : 'side');
  /* curved areas */
  const laEst = q => { const b = laBlob(q.fig); return b.full + b.half; };
  set('g3la-es-num', q => q.answer === laEst(q) ? '' : 'estimate');
  set('g3la-es-fill', q => { const b = laBlob(q.fig); return q.answers[0] === b.full && q.answers[1] === b.half && q.answers[2] === b.full + b.half ? '' : 'estimate'; });
  set('g3la-es-mc', q => laOnly(q.options, o => nums(o)[0] === laEst(q), q.answer) ? '' : 'estimate');
  set('g3la-es-tf', (q, m) => (laEst(q) === m.said) === q.answer ? '' : 'truth');
  set('g3la-es-sum', q => { const n = laBolds(q).map(Number); return q.answer === n[0] + n[1] ? '' : 'estimate'; });
  set('g3la-es-part', (q, m) => q.answer === m.v ? '' : 'count');
  /* perimeter or area */
  const laAsk = q => /area/.test(bold(q) || H.strip(q.q)) ? 'area' : 'perimeter';
  set('g3la-mx-num', q => { if (!q.fig) { const t = H.strip(q.q), r = t.match(/(\d+) rows of (\d+)/); return q.answer === (r ? +r[1] * +r[2] : ev(t.split('=')[0])) ? '' : 'answer'; } const r = laRect(q.fig), t = H.strip(q.q), area = /\barea\b|square metres/.test(t); return q.answer === (area ? r.l * r.w : 2 * (r.l + r.w)) ? '' : 'answer'; });
  set('g3la-mx-which', q => { const t = bold(q), want = /fence|ribbon|trim|edge/.test(t) ? 0 : /carpet|paint|seed|tiles/.test(t) ? 1 : -1; return q.answer === want ? '' : 'which'; });
  set('g3la-mx-fill', q => { const r = laRect(q.fig); return q.answers[0] === 2 * (r.l + r.w) && q.answers[1] === r.l * r.w ? '' : 'both'; });
  set('g3la-mx-tf', q => { const n = nums(q.q), about = laAsk(q), want = about === 'area' ? n[0] * n[1] === n[2] * n[3] : n[0] + n[1] === n[2] + n[3]; return want === q.answer ? '' : 'truth'; });
  set('g3la-mx-what', (q, m) => /around/.test(laPick(q)) === (m.ask === 'perimeter') ? '' : 'which');
  /* --- time-mass (full chapter) --- */
  const tmDom = h => { const d = document.createElement('div'); d.innerHTML = h || ''; return d; };
  const tmPick = q => H.strip(q.options[q.answer]);
  const tmBolds = q => [...String(q.q).matchAll(/<b>([^<]+)<\/b>/g)].map(x => H.strip(x[1]));
  const tmOnly = (list, ok, ans) => { const hit = list.map((x, j) => ok(x) ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === ans; };
  const tmNx = h => h % 12 + 1;
  const tmMod = t => ((t % 720) + 720) % 720;
  /* reads every clock in a picture, from the angles of its hands: minutes after 12:00 */
  const tmClocks = h => [...tmDom(h).querySelectorAll('.clk')].map(g => { const ang = c => { const l = g.querySelector(c), dx = +l.getAttribute('x2') - 150, dy = +l.getAttribute('y2') - 150; return (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360; };
    const m = Math.round(ang('.mh') / 6) % 60, hr = Math.floor((ang('.hh') - m / 2 + 1) / 30) % 12; return hr * 60 + m; });
  const tmClock = h => tmClocks(h)[0];
  const tmHM = t => [Math.floor(tmMod(t) / 60) || 12, tmMod(t) % 60];
  const tmDig = t => { const x = tmHM(t); return x[0] + ':' + String(x[1]).padStart(2, '0'); };
  /* "3:05" -> minutes after 12:00 */
  const tmRead = s => { const m = H.strip(s).match(/^(\d+):(\d\d)$/); return m ? tmMod(+m[1] * 60 + +m[2]) : NaN; };
  /* "quarter to 7", "half past 3", "20 minutes past 4", "5 o'clock" -> minutes after 12:00 */
  const tmSay = s => { const t = H.strip(s).toLowerCase(); let m;
    if ((m = t.match(/^(\d+) o'clock$/))) return tmMod(+m[1] * 60);
    if ((m = t.match(/^quarter past (\d+)$/))) return tmMod(+m[1] * 60 + 15);
    if ((m = t.match(/^half past (\d+)$/))) return tmMod(+m[1] * 60 + 30);
    if ((m = t.match(/^quarter to (\d+)$/))) return tmMod(+m[1] * 60 - 15);
    if ((m = t.match(/^(\d+) minutes? past (\d+)$/))) return tmMod(+m[2] * 60 + +m[1]);
    if ((m = t.match(/^(\d+) minutes? to (\d+)$/))) return tmMod(+m[2] * 60 - +m[1]);
    return NaN; };
  const tmTimer = h => { const t = tmDom(h).querySelector('.sw').textContent.split(':'); return [+t[0], +t[1]]; };
  const tmSecs = h => { const t = tmTimer(h); return t[0] * 60 + t[1]; };
  const tmMS = s => { const t = s.split(':'); return +t[0] * 60 + +t[1]; };
  /* durations: "2 hours 35 minutes" -> seconds */
  const TM_U = { second: 1, minute: 60, hour: 3600 };
  const tmDur = s => { const t = H.strip(s); if (!/^(\d+ (seconds?|minutes?|hours?) ?)+$/.test(t)) return NaN; return [...t.matchAll(/(\d+) (second|minute|hour)s?/g)].reduce((a, x) => a + +x[1] * TM_U[x[2]], 0); };
  /* the pan balance: what is on each side, and which side is down */
  const TM_MASS = { apple: 9, orange: 11, book: 23, shoe: 15, pencil: 2, mug: 18, pillow: 6, stone: 21 };
  const tmBal = h => { const svg = tmDom(h).querySelector('svg'), side = [{ t: [], c: 0 }, { t: [], c: 0 }]; let i = 0;
    [...svg.querySelectorAll('*')].forEach(e => { if (i > 1) return; if (e.matches('g.ob')) side[i].t.push(e.getAttribute('data-k')); else if (e.matches('.cube')) side[i].c++; else if (e.tagName.toLowerCase() === 'path' && / h144 /.test(e.getAttribute('d') || '')) i++; });
    const b = svg.querySelector('.beam'), dy = +b.getAttribute('y1') - +b.getAttribute('y2');
    side.forEach(s => { s.m = s.t.reduce((a, k) => a + TM_MASS[k], 0) + s.c; });
    return { L: side[0], R: side[1], down: dy > 0.5 ? 0 : dy < -0.5 ? 1 : -1 }; };
  const tmBalOk = b => b.down === (b.L.m > b.R.m ? 0 : b.L.m < b.R.m ? 1 : -1);
  const tmCubes = h => { const b = tmBal(h); return tmBalOk(b) && b.down === -1 ? b.R.c : NaN; };
  const tmJug = h => { const d = tmDom(h), cp = d.querySelectorAll('.mk').length, w = d.querySelector('.wt'); return [cp, Math.round(+w.getAttribute('height') / 240 * cp)]; };
  const tmCups = h => tmDom(h).querySelectorAll('.cup').length;
  const tmText = h => [...tmDom(h).querySelectorAll('text')].map(t => t.textContent).join(' | ');
  const tmEv = t => { const s = H.strip(t).split('=')[0].replace(/−/g, '-').replace(/\s+/g, ''); return /^\d+([+-]\d+)*$/.test(s) ? s.match(/[+-]?\d+/g).reduce((a, b) => a + +b, 0) : NaN; };
  /* the hour hand */
  set('g3tm-hr-num', q => q.answer === tmHM(tmClock(q.fig))[0] ? '' : 'hour');
  set('g3tm-hr-mc', q => tmPick(q) === String(tmHM(tmClock(q.fig))[0]) ? '' : 'hour');
  set('g3tm-hr-hand', q => tmPick(q) === 'the short hand' ? '' : 'hand');
  set('g3tm-hr-tap', q => { const want = tmSay(bold(q)); return tmOnly(q.tiles, t => tmClock(t) === want, q.answer) ? '' : 'clock'; });
  set('g3tm-hr-tf', (q, m) => (tmHM(tmClock(q.fig))[0] === m.said) === q.answer ? '' : 'truth');
  set('g3tm-hr-later', q => { const b = bold(q).match(/(\d+) hours (later|earlier)/), k = +b[1] * (b[2] === 'later' ? 1 : -1); return q.answer === tmHM(tmClock(q.fig) + k * 60)[0] ? '' : 'hour'; });
  /* minutes by 5s and to the minute */
  set('g3tm-fv-num', q => q.answer === tmClock(q.fig) % 60 ? '' : 'minutes');
  set('g3tm-fv-fill', q => { const x = tmHM(tmClock(q.fig)); return q.answers[0] === x[1] && q.answers[1] === x[0] ? '' : 'time'; });
  set('g3tm-fv-mc', q => tmOnly(q.options, o => tmRead(o) === tmClock(q.fig), q.answer) ? '' : 'time');
  set('g3tm-fv-tf', (q, m) => (tmRead(m.said) === tmClock(q.fig)) === q.answer ? '' : 'truth');
  set('g3tm-fv-until', q => q.answer === tmMod(tmRead(bold(q)) - tmClock(q.fig)) ? '' : 'minutes');
  set('g3tm-fv-hour', (q, m) => q.answer === m.h ? '' : 'hour');
  set('g3tm-fv-min', (q, m) => q.answer === m.m ? '' : 'minutes');
  set('g3tm-mn-num', q => q.answer === tmClock(q.fig) % 60 ? '' : 'minutes');
  set('g3tm-mn-fill', (q, m) => { const x = q.fig ? tmHM(tmClock(q.fig)) : [m.h, m.m]; return q.answers[0] === x[0] && q.answers[1] === x[1] ? '' : 'time'; });
  set('g3tm-mn-mc', q => tmOnly(q.options, o => tmRead(o) === tmClock(q.fig), q.answer) ? '' : 'time');
  set('g3tm-mn-tf', (q, m) => (tmRead(m.said) === tmClock(q.fig)) === q.answer ? '' : 'truth');
  set('g3tm-mn-marks', q => { const b = tmBolds(q), j = nums(b[0])[0], k = +b[1] % 12; return q.answer === k * 5 + j && q.answer === tmClock(q.fig) % 60 ? '' : 'minutes'; });
  set('g3tm-mn-five', (q, m) => q.answer === m.m - m.m % 5 ? '' : 'fives');
  set('g3tm-mn-left', (q, m) => q.answer === m.m % 5 ? '' : 'marks');
  /* time words */
  set('g3tm-wd-mc', q => tmOnly(q.options, o => tmSay(o) === tmClock(q.fig), q.answer) ? '' : 'words');
  set('g3tm-wd-num', q => { const b = tmBolds(q), t = tmSay(b[0]); return q.answer === t % 60 && +b[1].split(':')[0] === tmHM(t)[0] ? '' : 'minutes'; });
  set('g3tm-wd-match', q => q.pairs.every(p => tmSay(p[0]) === tmRead(p[1])) ? '' : 'pairs');
  set('g3tm-wd-tf', (q, m) => (tmSay(m.w) === tmRead(m.said)) === q.answer && bold(q) === m.w ? '' : 'truth');
  set('g3tm-wd-fill', q => { let k = 0; const t = q.fill.replace(/\[\[\]\]/g, () => q.answers[k++]), c = tmClock(q.fig), d = t.match(/It is (\d+:\d\d)\./), w = t.match(/Say it: (.+)\.$/); return d && w && tmRead(d[1]) === c && tmSay(w[1]) === c ? '' : 'words'; });
  set('g3tm-wd-way', (q, m) => q.answer === (m.m <= 30 ? 0 : 1) ? '' : 'past or to');
  set('g3tm-wd-hour', (q, m) => q.answer === (m.m <= 30 ? m.h : tmNx(m.h)) ? '' : 'hour');
  set('g3tm-wd-say', (q, m) => tmOnly(q.options, o => tmSay(o) === tmMod(m.h * 60 + m.m), q.answer) ? '' : 'words');
  /* digital clocks */
  set('g3tm-dg-fill', q => { const x = tmHM(tmClock(q.fig)); return q.answers[0] === x[0] && q.answers[1] === x[1] ? '' : 'time'; });
  set('g3tm-dg-mc', (q, m) => { const want = q.fig ? tmClock(q.fig) : tmMod(m.h * 60 + m.m); return tmOnly(q.options, o => tmRead(o) === want, q.answer) ? '' : 'time'; });
  set('g3tm-dg-tap', q => { const want = tmRead(bold(q)); return tmOnly(q.tiles, t => tmClock(t) === want, q.answer) ? '' : 'clock'; });
  set('g3tm-dg-tf', (q, m) => (tmSay(m.said) === tmRead(tmDom(q.fig).querySelector('.dg').textContent)) === q.answer ? '' : 'truth');
  set('g3tm-dg-num', q => { const t = tmRead(tmDom(q.fig).querySelector('.dg').textContent) % 60; return q.answer === (/until/.test(q.q) ? 60 - t : t) ? '' : 'minutes'; });
  /* timers */
  set('g3tm-tw-num', q => q.answer === tmSecs(q.fig) && bold(q) === tmTimer(q.fig)[0] + ':' + String(tmTimer(q.fig)[1]).padStart(2, '0') ? '' : 'seconds');
  set('g3tm-tw-fill', q => { const t = tmTimer(q.fig); return q.answers[0] === t[0] && q.answers[1] === t[1] ? '' : 'timer'; });
  set('g3tm-tw-split', q => q.answers[0] * 60 + q.answers[1] === nums(q.fill)[0] && q.answers[1] < 60 ? '' : 'split');
  set('g3tm-tw-more', q => q.answer === tmMS(tmBolds(q)[1]) - tmSecs(q.fig) ? '' : 'seconds');
  set('g3tm-tw-mc', q => { const n = nums(bold(q)); return tmOnly(q.options, o => tmMS(H.strip(o)) === n[0] * 60 + n[1] && /^\d+:\d\d$/.test(H.strip(o)) && +H.strip(o).split(':')[1] < 60, q.answer) ? '' : 'reading'; });
  set('g3tm-tw-tf', (q, m) => (tmSecs(q.fig) === m.said) === q.answer ? '' : 'truth');
  set('g3tm-tw-race', q => { const b = tmBolds(q); return q.answer === tmMS(b[1]) - tmMS(b[0]) ? '' : 'difference'; });
  /* units of time */
  const TM_TAKES = { 'blink your eyes': 'seconds', sneeze: 'seconds', 'clap 5 times': 'seconds', 'tie your shoes': 'seconds', 'brush your teeth': 'minutes', 'eat lunch': 'minutes', 'have recess': 'minutes', 'bake muffins': 'minutes', 'sleep at night': 'hours', 'spend a school day': 'hours', 'drive from toronto to ottawa': 'hours', 'paddle across a big lake': 'hours' };
  const tmTake = t => TM_TAKES[H.strip(t).toLowerCase()];
  set('g3tm-un-conv', q => { const p = H.strip(q.q).split('='), u = (p[1] || '').match(/(second|minute|hour)s/); return u && q.answer * TM_U[u[1]] === tmDur(p[0]) ? '' : 'conversion'; });
  set('g3tm-un-one', q => { const u = H.strip(q.q).match(/many (second|minute)s make 1 (minute|hour)/); return q.answer * TM_U[u[1]] === TM_U[u[2]] ? '' : 'unit'; });
  set('g3tm-un-fill', q => { const u = q.fill.match(/\]\] (second|minute)s make 1 (minute|hour)\. So (\d+) /), r = TM_U[u[2]] / TM_U[u[1]]; return q.answers[0] === r && q.answers[1] === r * +u[3] ? '' : 'fill'; });
  set('g3tm-un-match', q => q.pairs.every(p => tmTake(p[0]) === p[1]) ? '' : 'pairs');
  set('g3tm-un-pick', (q, m) => same(q.options.map((o, j) => tmTake(o) === m.u ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('g3tm-un-tf', q => { const p = bold(q).split(' = '); return (tmDur(p[0]) === tmDur(p[1])) === q.answer ? '' : 'truth'; });
  set('g3tm-un-order', q => { const v = q.items.map(tmDur); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
  set('g3tm-un-more', q => { const b = tmBolds(q); return q.answer * 60 === tmDur(b[0]) - tmDur(b[1]) ? '' : 'left'; });
  set('g3tm-un-story', q => { const t = H.strip(q.q); let m;
    if ((m = t.match(/recess is (\d+) minutes and lunch is (\d+) minutes/))) return q.answer === +m[1] + +m[2] ? '' : 'total';
    if ((m = t.match(/practice is 1 hour (\d+) minutes\. Swimming is (\d+) minutes/))) return q.answer === 60 + +m[1] - +m[2] ? '' : 'difference';
    return 'story'; });
  /* how long */
  set('g3tm-lt-num', q => { const c = tmClocks(q.fig); return q.answer === tmMod(c[1] - c[0]) ? '' : 'minutes'; });
  set('g3tm-lt-end', q => { const b = tmBolds(q), e = tmHM(tmRead(b[0]) + nums(b[1])[0]); return q.answers[0] === e[0] && q.answers[1] === e[1] && tmClock(q.fig) === tmRead(b[0]) ? '' : 'end'; });
  set('g3tm-lt-story', q => { const b = tmBolds(q); return q.answer === tmMod(tmRead(b[1]) - tmRead(b[0])) ? '' : 'minutes'; });
  set('g3tm-lt-mc', q => { const b = tmBolds(q), e = tmMod(tmRead(b[1]) + nums(b[0])[0]); return tmOnly(q.options, o => tmRead(o) === e, q.answer) ? '' : 'time'; });
  set('g3tm-lt-tf', (q, m) => { const c = tmClocks(q.fig); return (tmMod(c[1] - c[0]) === m.said) === q.answer ? '' : 'truth'; });
  set('g3tm-lt-hop', q => { const t = H.strip(q.q).match(/From (\d+:\d\d) to (\d+:\d\d)/); return q.answer === tmMod(tmRead(t[2]) - tmRead(t[1])) ? '' : 'hop'; });
  set('g3tm-add', q => q.answer === tmEv(q.q) ? '' : 'sum');
  set('g3tm-sub', q => q.answer === tmEv(q.q) ? '' : 'difference');
  set('g3tm-mul', q => { const n = nums(H.strip(q.q).split('=')[0]); return q.answer === n[0] * n[1] ? '' : 'product'; });
  /* the pan balance */
  const tmHeavier = b => b.down === 0 ? b.L.t : b.R.t;
  set('g3tm-bl-mc', (q, m) => { if (!q.fig) { const v = q.options.map(o => TM_MASS[H.strip(o).replace(/^the /, '')]); return q.answer === v.indexOf(Math.max(...v)) ? '' : 'heavier'; } const b = tmBal(q.fig); return tmBalOk(b) && tmPick(q) === 'the ' + tmHeavier(b).join(' and ') ? '' : 'heavier'; });
  set('g3tm-bl-tf', (q, m) => { const b = tmBal(q.fig); return tmBalOk(b) && (tmHeavier(b)[0] === m.say) === q.answer && bold(q) === m.say ? '' : 'truth'; });
  set('g3tm-bl-down', (q, m) => q.answer === (TM_MASS[m.a] > TM_MASS[m.b] ? 0 : 1) ? '' : 'side');
  set('g3tm-bl-tap', q => { const b = tmBolds(q); return tmOnly(q.tiles, t => { const x = tmBal(t); return tmBalOk(x) && tmHeavier(x)[0] === b[0] && (x.down === 0 ? x.R.t[0] : x.L.t[0]) === b[1]; }, q.answer) ? '' : 'balance'; });
  set('g3tm-bl-level', q => { const b = tmBal(q.fig); return tmBalOk(b) && q.answer === b.L.m - b.R.c && b.R.t.length === 0 ? '' : 'cubes'; });
  set('g3tm-bl-order', q => { const v = q.items.map(t => TM_MASS[t.replace(/^the /, '')]); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
  set('g3tm-bl-diff', q => { const b = tmBolds(q); return q.answer === TM_MASS[b[0]] - TM_MASS[b[1]] ? '' : 'difference'; });
  /* cubes */
  set('g3tm-cb-num', (q, m) => { if (!q.fig) return q.answer === m.o.reduce((a, k) => a + TM_MASS[k], 0) ? '' : 'cubes'; return q.answer === tmCubes(q.fig) ? '' : 'cubes'; });
  set('g3tm-cb-total', q => { const v = [...H.strip(q.q).matchAll(/The (\w+) balances (\d+) cubes/g)]; return v.every(x => TM_MASS[x[1]] === +x[2]) && q.answer === v.reduce((a, x) => a + +x[2], 0) ? '' : 'total'; });
  set('g3tm-cb-many', q => { const b = tmBolds(q); return q.answer === nums(b[0])[0] * nums(b[1])[0] ? '' : 'cubes'; });
  set('g3tm-cb-one', q => { const t = H.strip(q.q).match(/^(\d+) \w+ balance (\d+) cubes/); return q.answer * +t[1] === +t[2] ? '' : 'share'; });
  set('g3tm-cb-fill', q => { const n = tmCubes(q.fig); return q.answers[0] * 6 + q.answers[1] === n && q.answers[1] < 6 && q.answers[2] === n ? '' : 'cubes'; });
  set('g3tm-cb-tf', (q, m) => (tmCubes(q.fig) === m.said) === q.answer ? '' : 'truth');
  set('g3tm-cb-mc', q => { const M = nums(bold(q))[0], shown = [...tmDom(q.fig).querySelectorAll('svg')].map(s => tmCubes(s.outerHTML)); return shown.includes(M) && tmOnly(q.options, o => TM_MASS[H.strip(o).replace(/^the /, '')] === M, q.answer) ? '' : 'thing'; });
  set('g3tm-cb-rows', (q, m) => q.answer === Math.floor(m.M / 6) ? '' : 'rows');
  /* estimates of mass */
  set('g3tm-ms-num', q => q.answer === Math.abs(tmCubes(q.fig) - nums(bold(q))[0]) ? '' : 'difference');
  set('g3tm-ms-close', q => { const M = +H.strip(q.q).match(/balances (\d+) cubes/)[1], d = q.options.map(o => Math.abs(nums(o)[0] - M)), best = Math.min(...d); return d.filter(x => x === best).length === 1 && d[q.answer] === best ? '' : 'closest'; });
  set('g3tm-ms-bench', q => { const b = tmBolds(q), box = H.strip(q.q).match(/empty bag is about (\d+) cubes/); return q.answer === nums(b[0])[0] * nums(b[1])[0] + (box ? +box[1] : 0) ? '' : 'estimate'; });
  set('g3tm-ms-tf', (q, m) => { const M = tmCubes(q.fig); return ((m.e > M ? 'too high' : 'too low') === m.say) === q.answer ? '' : 'truth'; });
  set('g3tm-ms-fill', q => { const M = tmCubes(q.fig), e = +H.strip(q.q).match(/Estimate: (\d+) cubes/)[1]; return q.answers[0] === M && q.answers[1] === Math.abs(M - e) ? '' : 'estimate'; });
  /* capacity */
  set('g3tm-cp-num', q => q.answer === tmCups(q.fig) ? '' : 'cups');
  set('g3tm-cp-jug', q => { const j = tmJug(q.fig), two = /once more/.test(q.q); return q.answer === (two ? 2 : 1) * j[0] - j[1] && nums(bold(q))[0] === j[0] ? '' : 'cups'; });
  set('g3tm-cp-total', q => q.answer === [...H.strip(q.q).matchAll(/holds (\d+) cups/g)].reduce((a, x) => a + +x[1], 0) ? '' : 'total');
  set('g3tm-cp-diff', q => { const v = [...H.strip(q.q).matchAll(/holds (\d+) cups/g)].map(x => +x[1]); return q.answer === v[0] - v[1] && (!q.fig || tmCups(q.fig) === v[1]) ? '' : 'difference'; });
  set('g3tm-cp-tap', q => { const n = q.tiles.map(tmCups), mx = Math.max(...n); return n.filter(x => x === mx).length === 1 && n[q.answer] === mx ? '' : 'most'; });
  set('g3tm-cp-tf', q => { const t = H.strip(q.q).match(/took (\d+) cups to fill the (\w+) and (\d+) cups/); return (+t[1] > +t[3]) === q.answer && bold(q) === t[2] + ' holds more' ? '' : 'truth'; });
  set('g3tm-cp-row', (q, m) => q.answer === Math.min(m.n, 8) ? '' : 'row');
  set('g3tm-cp-says', (q, m) => nums(tmPick(q))[0] === m.n ? '' : 'cups');
  /* careful filling */
  const tmFlWant = t => /half full|half cups/.test(t) ? 'too high' : /spill/.test(t) ? 'too high' : /stopped before/.test(t) ? 'too low' : /to the top and stopped when/.test(t) ? 'just right' : '?';
  const TM_FL = { half: 'too high', spill: 'too high', short: 'too low', full: 'just right' };
  set('g3tm-fl-mc', (q, m) => { const t = H.strip(q.q), want = /measured the pot/.test(t) ? tmFlWant(t) : TM_FL[m.m]; return tmPick(q) === want ? '' : 'count'; });
  set('g3tm-fl-look', q => tmPick(q) === 'no' ? '' : 'look');
  set('g3tm-fl-half', q => { const t = H.strip(q.q), h = +t.match(/(\d+) half cups/)[1], f = t.match(/and (\d+) full cups/); return h % 2 === 0 && q.answer === h / 2 + (f ? +f[1] : 0) ? '' : 'full cups'; });
  set('g3tm-fl-short', q => { const b = tmBolds(q); return q.answer === nums(b[0])[0] + nums(b[1])[0] ? '' : 'cups'; });
  set('g3tm-fl-spill', q => { const b = tmBolds(q); return q.answer === nums(b[0])[0] - nums(b[1])[0] ? '' : 'cups'; });
  set('g3tm-fl-gaps', q => tmOnly(q.options, o => /^cups of (rice|sand|water)$/.test(H.strip(o)), q.answer) ? '' : 'unit');
  set('g3tm-fl-twice', q => q.answer === 2 * nums(bold(q))[0] ? '' : 'half cups');
  set('g3tm-fl-tf', (q, m) => (tmFlWant(H.strip(q.q)) === m.say) === q.answer && bold(q) === m.say ? '' : 'truth');
  /* estimating capacity */
  const tmEst = h => { const t = tmText(h), s = t.match(/1 jug: (\d+) cups/), k = t.match(/about (\d+) jugs/); return [+s[1], k ? +k[1] : 0]; };
  set('g3tm-ce-num', q => { const b = tmBolds(q), e = tmEst(q.fig), p = H.strip(q.q).match(/already poured (\d+) cups/); return nums(b[0])[0] === e[0] && nums(b[1])[0] === e[1] && q.answer === e[0] * e[1] - (p ? +p[1] : 0) ? '' : 'estimate'; });
  set('g3tm-ce-half', q => { const s = nums(bold(q))[0]; return s % 2 === 0 && nums(tmPick(q))[0] === s / 2 ? '' : 'half'; });
  set('g3tm-ce-fill', q => { const e = tmEst(q.fig); return q.answers[0] === e[0] && q.answers[1] === e[0] * e[1] && q.answers[2] === e[0] * e[1] ? '' : 'estimate'; });
  set('g3tm-ce-check', q => { const b = tmBolds(q).map(x => nums(x)[0]); return q.answer === Math.abs(b[1] - b[0]) && tmCups(q.fig) === b[1] ? '' : 'difference'; });
  set('g3tm-ce-tf', (q, m) => { const t = H.strip(q.q).match(/holds (\d+) cups\. The \w+ holds about (\d+) jugs/); return (+t[1] * +t[2] === m.said) === q.answer ? '' : 'truth'; });
  set('g3tm-ce-one', (q, m) => q.answer === m.s ? '' : 'jug');
  /* mass, capacity or time */
  const TM_ASK = { 'how heavy the pumpkin is': 'mass', 'how heavy a bag of apples is': 'mass', 'which rock is heavier': 'mass', 'the mass of a backpack': 'mass', 'how much soup the pot holds': 'capacity', 'how much water the bathtub holds': 'capacity', 'which bottle holds more juice': 'capacity', 'how much milk fits in the jug': 'capacity', 'how long recess lasts': 'time', 'how long the movie is': 'time' };
  const TM_TOOL = { mass: 'a pan balance', capacity: 'cups of water', time: 'a timer' };
  set('g3tm-mx-tool', (q, m) => tmPick(q) === TM_TOOL[TM_ASK[m.t]] ? '' : 'tool');
  set('g3tm-mx-which', (q, m) => q.answer === ['mass', 'capacity'].indexOf(TM_ASK[m.t]) ? '' : 'which');
  set('g3tm-mx-num', q => q.answer === tmCubes(q.fig) ? '' : 'cubes');
  set('g3tm-mx-jug', q => { const j = tmJug(q.fig); return q.answer === (/fill it/.test(q.q) ? j[0] - j[1] : j[1]) ? '' : 'cups'; });
  const TM_SAYS = { 'A pan balance measures how heavy an apple is.': true, 'A pan balance measures how much a bottle holds.': false, 'Cups of water measure how much a pot holds.': true, 'Cups of water measure how heavy a shoe is.': false, 'A bigger box always has more mass.': false, 'A timer measures how long a race takes.': true, 'A ruler measures how much a jug holds.': false, 'A tall glass always holds more than a wide bowl.': false };
  set('g3tm-mx-tf', (q, m) => TM_SAYS[m.s] === q.answer && bold(q) === m.s ? '' : 'truth');
  set('g3tm-mx-match', q => q.pairs.every(p => ({ heavy: 'cubes', hold: 'cups', recess: 'minutes', hallway: 'metres' })[(p[0].match(/heavy|hold|recess|hallway/) || [])[0]] === p[1]) ? '' : 'pairs');
  /* --- money (full chapter) --- */
  const mnCoin = { nickel: 5, dime: 10, quarter: 25, loonie: 100, toonie: 200 };
  /* reads "2 quarters, 1 dime and 3 nickels" as cents */
  const mnCents = t => (H.strip(t).match(/\d+ (nickel|dime|quarter|loonie|toonie)s?/g) || []).reduce((a, x) => { const [n, c] = x.split(' '); return a + +n * mnCoin[c.replace(/s$/, '')]; }, 0);
  /* reads the coins and bills drawn in a picture, in cents */
  const mnDrawn = svg => { const d = document.createElement('div'); d.innerHTML = svg || ''; return [...d.querySelectorAll('g.coin')].reduce((a, g) => a + +g.getAttribute('class').match(/c(\d+)/)[1], 0); };
  /* a cash total: the nearest 5 cents */
  const mnCash = c => Math.round(c / 5) * 5;
  const mnSum = l => l.reduce((a, b) => a + b, 0);
  /* the fewest coins or bills: try every mix of the two biggest, the smallest fills the rest */
  const mnFewest = (c, d) => { let best = Infinity; for (let i = 0; i * d[0] <= c; i++) for (let j = 0; i * d[0] + j * d[1] <= c; j++) { const r = c - i * d[0] - j * d[1]; if (r % d[2] === 0) best = Math.min(best, i + j + r / d[2]); } return best; };
  const mnChoice = q => H.strip(q.options[q.answer]);
  const mnFirst = t => nums(t)[0];
  /* an amount written as "45¢" or "$1", in cents */
  const mnAmt = t => { const x = H.strip(t).match(/\$(\d+)|(\d+)¢/); return x ? (x[1] ? 100 * x[1] : +x[2]) : NaN; };
  set('g3mn-ct-pic', (q, m) => mnDrawn(q.fig) / (m.dol ? 100 : 1) === q.answer ? '' : 'total');
  set('g3mn-ct-times', (q, m) => H.strip(q.q).includes(String(m.n)) && m.n * m.c / (m.c >= 100 ? 100 : 1) === q.answer ? '' : 'times');
  set('g3mn-ct-words', q => mnCents(q.q) === q.answer ? '' : 'total');
  set('g3mn-ct-tap', (q, m) => { const hit = q.tiles.map((t, j) => mnDrawn(t) === m.t ? j : -1).filter(j => j >= 0); return H.num(bold(q)) === m.t && hit.length === 1 && hit[0] === q.answer ? '' : 'coins'; });
  set('g3mn-ct-tf', (q, m) => H.num(bold(q)) === m.said && (mnDrawn(q.fig) === m.said) === q.answer ? '' : 'truth');
  set('g3mn-ct-match', q => q.pairs.every(p => mnCents(p[0]) === mnFirst(p[1])) ? '' : 'pairs');
  set('g3mn-ct-sum', q => ev(H.strip(q.q).replace(/=.*$/, '')) === q.answer ? '' : 'sum');
  set('g3mn-rd-num', (q, m) => mnCash(m.t) === q.answer ? '' : 'cash');
  set('g3mn-rd-card', (q, m) => q.answers[0] === m.a + m.b && q.answers[1] === mnCash(m.a + m.b) ? '' : 'card and cash');
  set('g3mn-rd-up', (q, m) => { const c = mnCash(m.t), o = mnChoice(q); return (c > m.t ? /^Up/.test(o) : /^Down/.test(o)) && mnAmt(o) === c ? '' : 'up or down'; });
  set('g3mn-rd-line', (q, m) => q.answer === mnCash(m.t) ? '' : 'cash');
  set('g3mn-rd-tf', (q, m) => H.num(bold(q)) === m.said && (mnCash(m.t) === m.said) === q.answer ? '' : 'truth');
  set('g3mn-rd-sum', (q, m) => q.answer === mnCash(m.a + m.b) ? '' : 'cash');
  set('g3mn-rd-pick', (q, m) => same(q.options.map((o, j) => mnCash(mnFirst(o)) === m.c ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('g3mn-rd-change', (q, m) => q.answer === 100 - mnCash(m.a + m.b) ? '' : 'change');
  set('g3mn-rd-near', (q, m) => q.answers[0] % 5 === 0 && q.answers[0] < m.t && q.answers[1] - q.answers[0] === 5 && q.answers[1] > m.t ? '' : 'the 5s');
  set('g3mn-rd-close', (q, m) => mnAmt(mnChoice(q)) === mnCash(m.t) ? '' : 'closer');
  set('g3mn-up-num', (q, m) => q.answer === m.paid - m.p ? '' : 'change');
  set('g3mn-up-hops', (q, m) => { const a = q.answers, mid = +(H.strip(q.fill).match(/= (\d+)¢/) || [])[1]; return a[0] > 0 && a[1] > 0 && m.p + a[0] === mid && mid + a[1] === m.paid && a[2] === m.paid - m.p ? '' : 'hops'; });
  set('g3mn-up-match', (q, m) => q.pairs.every(p => mnFirst(p[0]) + mnFirst(p[1]) === m.paid) ? '' : 'pairs');
  set('g3mn-up-tf', (q, m) => (m.paid - m.p === m.said) === q.answer ? '' : 'truth');
  set('g3mn-up-gap', (q, m) => q.answer === m.b - m.a ? '' : 'gap');
  set('g3mn-two-chg', (q, m) => q.answer === 100 - mnCash(mnSum(m.ps)) ? '' : 'change');
  set('g3mn-two-tot', (q, m) => q.answer === mnSum(m.ps) ? '' : 'total');
  set('g3mn-two-fill', (q, m) => { const t = mnSum(m.ps); return q.answers.join() === [t, mnCash(t), 100 - mnCash(t)].join() ? '' : 'steps'; });
  set('g3mn-two-mc', (q, m) => mnAmt(mnChoice(q)) === 100 - mnCash(mnSum(m.ps)) ? '' : 'change');
  set('g3mn-two-tf', (q, m) => (m.said === 100 - mnCash(mnSum(m.ps))) === q.answer ? '' : 'truth');
  set('g3mn-gv-fill', (q, m) => { const [a, b, c] = q.answers; return a * 25 + b * 10 + c * 5 === m.ch && a + b + c === mnFewest(m.ch, [25, 10, 5]) ? '' : 'coins'; });
  set('g3mn-gv-build', (q, m) => q.tool === 'coins' && q.answer === 100 - m.p ? '' : 'change');
  set('g3mn-gv-count', (q, m) => q.answer === mnFewest(m.ch, [25, 10, 5]) ? '' : 'fewest');
  set('g3mn-gv-mc', (q, m) => { const hit = q.options.map((o, j) => mnCents(o) === m.ch ? j : -1).filter(j => j >= 0), n = (H.strip(q.options[q.answer]).match(/\d+/g) || []).reduce((a, x) => a + +x, 0); return hit.length === 1 && hit[0] === q.answer && n === mnFewest(m.ch, [25, 10, 5]) ? '' : 'coins'; });
  set('g3mn-gv-tf', (q, m) => (mnSum(m.said) === m.ch && m.said.length === mnFewest(m.ch, [25, 10, 5])) === q.answer && mnDrawn(q.fig) === mnSum(m.said) ? '' : 'truth');
  set('g3mn-gv-back', (q, m) => q.answer === 100 - mnDrawn(q.fig) && mnDrawn(q.fig) === mnSum(m.coins) ? '' : 'price');
  set('g3mn-gv-q', (q, m) => q.answer * 25 <= m.ch && (q.answer + 1) * 25 > m.ch ? '' : 'quarters');
  set('g3mn-gv-rest', (q, m) => { const [d, n] = q.answers; return d * 10 + n * 5 === m.ch && d + n === mnFewest(m.ch, [25, 10, 5]) ? '' : 'rest'; });
  set('g3mn-bl-num', (q, m) => q.answer === (m.b - m.p) / 100 ? '' : 'change');
  set('g3mn-bl-hops', (q, m) => { const a = q.answers, mid = +(H.strip(q.fill).match(/= \$(\d+)/) || [])[1]; return a[0] > 0 && a[1] > 0 && m.p / 100 + a[0] === mid && mid + a[1] === m.b / 100 && a[2] === (m.b - m.p) / 100 ? '' : 'hops'; });
  set('g3mn-bl-coins', (q, m) => { const [f, t, l] = q.answers; return f * 500 + t * 200 + l * 100 === m.ch && f + t + l === mnFewest(m.ch, [500, 200, 100]) ? '' : 'bills'; });
  set('g3mn-bl-match', (q, m) => q.pairs.every(p => mnFirst(p[0]) + mnFirst(p[1]) === m.b / 100) ? '' : 'pairs');
  set('g3mn-bl-tf', (q, m) => (m.b - m.p === m.said) === q.answer ? '' : 'truth');
  set('g3mn-bl-gap', (q, m) => q.answer === (m.b - m.a) / 100 ? '' : 'gap');
  set('g3mn-sb-num', (q, m) => q.answer === (m.b - mnSum(m.ps)) / 100 ? '' : 'change');
  set('g3mn-sb-fill', (q, m) => q.answers.join() === [(m.b - m.p) / 100, (m.b - m.p) / 100, m.b / 100].join() ? '' : 'change');
  set('g3mn-sb-mc', (q, m) => mnFirst(mnChoice(q)) === (m.b - m.p) / 100 ? '' : 'change');
  set('g3mn-sb-tf', (q, m) => (m.b - m.p === m.said) === q.answer ? '' : 'truth');
  set('g3mn-sb-part', (q, m) => q.answer === m.a - m.b ? '' : 'take away');
  set('g3mn-sb-check', (q, m) => q.answer === m.a + m.b ? '' : 'check');
  set('g3mn-es-num', (q, m) => q.answer === 100 - H.roundTo(m.p, 10) ? '' : 'estimate');
  set('g3mn-es-fill', (q, m) => q.answers.join() === [H.roundTo(m.p, 10), 100 - H.roundTo(m.p, 10)].join() ? '' : 'estimate');
  set('g3mn-es-mc', (q, m) => mnAmt(mnChoice(q)) === 100 - H.roundTo(m.p, 10) ? '' : 'estimate');
  set('g3mn-es-tf', (q, m) => (m.got === 100 - m.p) === q.answer ? '' : 'truth');
  set('g3mn-es-line', (q, m) => q.answer === 100 - H.roundTo(m.p, 10) ? '' : 'estimate');
  set('g3mn-es-dol', (q, m) => q.answer === m.bill - H.roundTo(m.a, 10) - H.roundTo(m.b, 10) ? '' : 'estimate');
  set('g3mn-es-near', (q, m) => q.answer === H.roundTo(m.p, 10) ? '' : 'round');
  /* the question's words say which sum it is: spend (total), change, or how much more */
  const mnAsk = t => /How much does .* spend/.test(t) ? 'total' : /change/.test(t) ? 'change' : /How much more/.test(t) ? 'more' : '';
  set('g3mn-mx-num', (q, m) => { const t = H.strip(q.q), k = mnAsk(t), v = (m.kind === 'total' ? m.a + m.b : m.kind === 'change' ? m.have - m.a : m.a - m.b) / (m.dol ? 100 : 1); if (k) return k === m.kind && v === q.answer ? '' : 'sum'; return ev(t.replace(/[$¢]/g, '').replace(/=.*$/, '')) === v && v === q.answer ? '' : 'sum'; });
  set('g3mn-mx-which', (q, m) => mnAsk(H.strip(q.q)) === m.kind && mnChoice(q) === { total: 'the total', change: 'the change', more: 'how much more' }[m.kind] ? '' : 'which');
  set('g3mn-mx-enough', (q, m) => (m.a + m.b <= m.have) === q.answer ? '' : 'truth');
  set('g3mn-mx-two', (q, m) => { const t = m.a + m.b; return t !== m.have && q.answer === Math.abs(m.have - t) / 100 && (t < m.have) === /change/.test(H.strip(q.q)) ? '' : 'change or more'; });
  set('g3mn-mx-op', (q, m) => mnChoice(q) === (m.kind === 'total' ? 'Add' : 'Subtract') ? '' : 'operation');
})(window.__verify, window.__H);
