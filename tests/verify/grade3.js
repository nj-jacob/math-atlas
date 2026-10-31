/* Answer checks for Grade 3 question shapes. Each check gets (q, q.meta, helpers) and returns
   an error message, or '' when the answer is right. Work the answer out here independently:
   never copy the site's own calculation. */
(function (V, H) {
  const set = (k, fn) => { V[k] = fn; };
  const bold = q => H.strip((q.q.match(/<b>([^<]+)<\/b>/) || [])[1] || '');
  const same = (a, b) => a.slice().sort().join() === b.slice().sort().join();
  /* works out a plain sum like "450 + 120 − 30" from its text */
  const ev = t => { const s = H.strip(t).replace(/\u2212/g, '-').replace(/\s+/g, ''); if (!/^\d+([+-]\d+)*$/.test(s)) return NaN; return s.match(/[+-]?\d+/g).reduce((a, b) => a + +b, 0); };
  const nums = t => (H.strip(t).match(/\d+/g) || []).map(Number);
  /* ---- Numbers to 1000 ---- */
  set('value-tap', (q, m) => { const hits = [0, 1, 2].filter(i => H.placeVal(m.n, i) === m.val); return hits.length === 1 && String(hits[0]) === String(q.answer) ? '' : 'digit worth ' + m.val + ' in ' + m.n; });
  set('value-num', (q, m) => H.placeVal(m.n, m.i) === q.answer ? '' : 'value of digit ' + m.i + ' in ' + m.n);
  set('value-tf', (q, m) => { const real = H.placeVal(m.n, m.i); if ((real === m.said) !== q.answer) return 'truth'; return H.strip(q.why.options[q.why.answer]).includes('worth ' + real) ? '' : 'reason'; });
  set('value-pick', (q, m) => { const target = H.num(q.q.match(/worth <b>(\d+)/)[1]), p = Math.round(Math.log10(target / m.dg)); const exp = m.opts.map((n, j) => Math.floor(n / Math.pow(10, p)) % 10 === m.dg ? j : -1).filter(j => j >= 0); return same(exp, q.answer) ? '' : 'picks'; });
  set('value-match', (q, m) => m.pairs.every(p => { const d = document.createElement('div'); d.innerHTML = p[0]; const s = d.textContent, i = s.indexOf(d.querySelector('u').textContent); return H.placeVal(+s, i) === +p[1]; }) ? '' : 'pairs');
  set('blocks-build', (q, m) => q.answer === m.n && bold(q) === String(m.n) ? '' : 'build target');
  set('blocks-story', q => { const n = H.strip(q.q).match(/\d+/g).map(Number); return n[0] * 100 + n[2] * 10 + n[4] === q.answer ? '' : 'story total'; });
  set('blocks-tap', (q, m) => m.set[q.answer] === m.n && new Set(m.set).size === m.set.length ? '' : 'tile');
  set('blocks-tf', (q, m) => (m.said === m.n) === q.answer ? '' : 'truth');
  set('blocks-fill', (q, m) => q.answers[0] * 100 + q.answers[1] * 10 + q.answers[2] === m.n && q.answers.every(x => x <= 9) ? '' : 'digits');
  set('blocks-trade', (q, m) => q.answers[0] * 100 + q.answers[1] * 10 + q.answers[2] === m.n && q.answers[0] === Math.floor(m.n / 100) - 1 ? '' : 'trade');
  set('forms-fill', (q, m) => { const exp = [0, 1, 2].map(i => H.placeVal(m.n, i)).filter(v => v); return exp.join() === q.answers.join() ? '' : 'parts'; });
  set('forms-match', (q, m) => m.pairs.every(p => H.sum(p[0]) === +p[1]) ? '' : 'pairs');
  set('forms-story', q => H.strip(q.q).match(/\d+/g).map(Number).slice(0, 3).reduce((a, b) => a + b, 0) === q.answer ? '' : 'total');
  set('forms-tf', (q, m) => (m.parts.reduce((a, b) => a + b, 0) === m.said) === q.answer ? '' : 'truth');
  set('forms-pick', (q, m) => { const val = o => { const t = H.strip(o); if (t.includes('+')) return H.sum(t); const g = t.match(/(\d+) hundreds?, (\d+) tens?, (\d+) ones?/); return +g[1] * 100 + +g[2] * 10 + +g[3]; }; return same(m.opts.map((o, j) => val(o) === m.n ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks'; });
  set('words-match', (q, m) => m.pairs.every(p => H.fromWords(p[0]) === +p[1] && H.toWords(+p[1]) === p[0]) ? '' : 'pairs');
  set('words-mc', q => H.fromWords(bold(q)) === H.num(q.options[q.answer]) ? '' : 'number');
  set('words-tap', (q, m) => m.set[q.answer] === H.fromWords(bold(q)) ? '' : 'tile');
  set('words-tf', (q, m) => (m.said === m.n) === q.answer && H.fromWords(bold(q)) === m.n ? '' : 'truth');
  set('words-order', q => { const v = q.items.map(H.fromWords); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
  set('skip-line', (q, m) => m.start + m.by * m.j === q.answer ? '' : 'landing');
  set('skip-order', q => { const v = q.items.map(Number), d = v[1] - v[0]; return v.every((x, i) => !i || x - v[i - 1] === d) && Math.abs(d) === +q.q.match(/by (\d+)s/)[1] ? '' : 'sequence'; });
  set('skip-story', q => +q.q.match(/by (\d+)s/)[1] * +q.q.match(/<b>(\d+) /)[1] === q.answer ? '' : 'count');
  set('skip-tap', (q, m) => { const v = m.shown; const fits = b => { const ok = v.map((_, i) => i).filter(i => i !== b); const base = v[ok[0]] - ok[0] * m.by; return ok.every(i => v[i] === base + i * m.by); }; const c = [0, 1, 2, 3, 4].filter(fits); return c.length === 1 && c[0] === q.answer ? '' : 'odd one out'; });
  set('skip-fill', q => { const s = q.fill.split(',').map(x => x.trim()); const f = [+s[0], q.answers[0], +s[2], q.answers[1], +s[4]], d = f[1] - f[0]; return f.every((x, i) => !i || x - f[i - 1] === d) ? '' : 'sequence'; });
  set('cmp-order', (q, m) => { const v = q.items.map(Number); return v.every((x, i) => !i || (m.big ? x < v[i - 1] : x > v[i - 1])) ? '' : 'order'; });
  set('cmp-story', (q, m) => (m.less ? (m.a < m.b ? 0 : 1) : (m.a > m.b ? 0 : 1)) === q.answer ? '' : 'winner');
  set('cmp-tf', (q, m) => (m.sym === '&gt;' ? m.a > m.b : m.a < m.b) === q.answer ? '' : 'truth');
  set('cmp-pick', (q, m) => same(m.opts.map((v, j) => (m.less ? v < m.x : v > m.x) ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('cmp-line', (q, m) => q.answer === m.n ? '' : 'point');
  set('cmp-mistake', (q, m) => q.answer === (m.a > m.b) ? '' : 'truth');
  set('round-tap', (q, m) => { const dl = m.n - m.lo, dh = m.hi - m.n; return dl !== dh && String(dl < dh ? m.lo : m.hi) === String(q.answer) ? '' : 'closer end'; });
  set('round-mc', (q, m) => H.roundTo(m.n, m.p) === H.num(q.options[q.answer]) ? '' : 'rounded');
  set('round-pick', (q, m) => same(m.opts.map((v, j) => H.roundTo(v, m.p) === m.target ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('round-tf', (q, m) => (H.roundTo(m.n, 100) === m.said) === q.answer ? '' : 'truth');
  set('round-match', (q, m) => m.pairs.every(p => H.roundTo(+p[0], 100) === +p[1]) ? '' : 'pairs');
  /* ---- Addition and subtraction ---- */
  set('add-story', (q, m) => { const n = nums(q.q); return n.includes(m.a) && n.includes(m.b) && q.answer === m.a + m.b ? '' : 'total'; });
  set('add-build', q => { const n = nums(q.q); return n[0] + n[1] === q.answer ? '' : 'total'; });
  set('add-fill', (q, m) => { const top = +H.strip(q.fill.replace('[[]]', String(q.answers[0]))).split('+')[0]; return q.answers[0] >= 0 && q.answers[0] <= 9 && top + m.b === m.sum ? '' : 'digit'; });
  set('add-tf', (q, m) => (m.a + m.b === m.said) === q.answer ? '' : 'truth');
  set('sub-story', (q, m) => { const n = nums(q.q); return n.includes(m.a) && n.includes(m.b) && q.answer === m.a - m.b ? '' : 'difference'; });
  set('sub-match', (q, m) => m.pairs.every(p => ev(p[0]) === +p[1]) ? '' : 'pairs');
  set('sub-tf', (q, m) => (m.said + m.b === m.a) === q.answer ? '' : 'truth');
  set('mental-line', (q, m) => (m.op === '+' ? m.a + m.b : m.a - m.b) === q.answer ? '' : 'landing');
  set('mental-match', (q, m) => m.pairs.every(p => ev(p[0]) === +p[1]) ? '' : 'pairs');
  set('mental-which', (q, m) => { const ways = q.options.map(o => { const n = nums(o); return n.length === 1 ? n[0] : /take away/.test(o) ? n[0] - n[1] : n[0] + n[1]; }); const ok = ways.map((w, j) => w === m.b ? j : -1).filter(j => j >= 0); return ok.length === 1 && ok[0] === q.answer ? '' : 'way'; });
  set('mental-tf', (q, m) => (m.a + m.b === m.said) === q.answer ? '' : 'truth');
  set('est-match', (q, m) => m.pairs.every(p => { const [a, b] = nums(p[0]); return H.roundTo(a, m.p) + H.roundTo(b, m.p) === +p[1]; }) ? '' : 'pairs');
  set('est-mc', (q, m) => H.roundTo(m.a, m.p) + H.roundTo(m.b, m.p) === H.num(q.options[q.answer]) ? '' : 'estimate');
  set('est-pick', (q, m) => same(q.options.map((o, j) => ev(o) > m.lim ? j : -1).filter(j => j >= 0), q.answer) && q.options.every(o => Math.abs(ev(o) - m.lim) >= 120) ? '' : 'picks');
  set('est-tf', (q, m) => ((m.op === '+' ? m.a + m.b : m.a - m.b) === m.said) === q.answer ? '' : 'truth');
  set('eq-tf', (q, m) => (m.l[0] + m.l[1] === m.r[0] + m.r[1]) === q.answer ? '' : 'truth');
  set('eq-pick', (q, m) => same(q.options.map((o, j) => ev(o) === m.t ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('eq-match', q => q.pairs.every(p => ev(p[0]) === ev(p[1])) && new Set(q.pairs.map(p => ev(p[0]))).size === q.pairs.length ? '' : 'pairs');
  set('eq-fill', q => { const sides = H.strip(q.fill.replace('[[]]', String(q.answers[0]))).split('='); return ev(sides[0]) === ev(sides[1]) ? '' : 'sides'; });
  set('word-which', (q, m) => (m.kind === 'join' ? /^Add/ : /^Subtract/).test(q.options[q.answer]) ? '' : 'operation');
  set('word-num', (q, m) => (m.op === '+' ? m.a + m.b : m.a - m.b) === q.answer && nums(q.q).includes(m.b) ? '' : 'answer');
  set('word-fill', (q, m) => q.answers[0] === m.a && q.answers[1] === m.b && q.answers[0] - q.answers[1] === q.answers[2] ? '' : 'sentence');
  set('word-tf', (q, m) => (m.a - m.b === m.said) === q.answer ? '' : 'truth');
  /* ---- Multiplication and division ---- */
  /* counts the plates and the counters on one plate in a groups picture */
  const plates = svg => { const d = document.createElement('div'); d.innerHTML = svg; const c = [...d.querySelectorAll('circle')]; const big = c.filter(x => +x.getAttribute('r') > 30); return [big.length, big.length ? (c.length - big.length) / big.length : 0]; };
  /* counts rows and dots per row in an array picture */
  const grid = svg => { const d = document.createElement('div'); d.innerHTML = svg; const c = [...d.querySelectorAll('circle')]; const ys = new Set(c.map(x => x.getAttribute('cy'))); return [ys.size, c.length / ys.size]; };
  const eq = t => { const s = H.strip(t), m = s.match(/(\d+)\s*([×÷+])\s*(\d+)\s*=\s*(\d+)/); if (!m) return null; const a = +m[1], b = +m[3], c = +m[4]; return { a, b, c, op: m[2], ok: m[2] === '×' ? a * b === c : m[2] === '÷' ? a === b * c : a + b === c }; };
  set('grp-tap', (q, m) => { const hit = q.tiles.map(plates).map((p, j) => p[0] === m.g && p[1] === m.n ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === q.answer ? '' : 'picture'; });
  set('grp-story', (q, m) => { const n = nums(q.q); return n[0] === m.g && n[1] === m.n && q.answer === m.g * m.n ? '' : 'total'; });
  set('grp-match', q => q.pairs.every(p => { const n = nums(p[0]); return n[0] * n[1] === +p[1]; }) ? '' : 'pairs');
  set('grp-tf', (q, m) => { const p = plates(q.fig); return (p[0] * p[1] === m.said) === q.answer ? '' : 'truth'; });
  set('fact-line', (q, m) => m.f * m.n === q.answer ? '' : 'landing');
  set('fact-fill', (q, m) => { const s = q.fill.replace(/<[^>]+>/g, '').split(','); let j = 0; const v = s.map(x => x.includes('[[]]') ? q.answers[j++] : +x); return v.every((x, i) => !i || x - v[i - 1] === m.f) && v[0] % m.f === 0 ? '' : 'sequence'; });
  set('fact-match', q => q.pairs.every(p => { const n = nums(p[0]); return n[0] * n[1] === +p[1]; }) ? '' : 'pairs');
  set('fact-pick', (q, m) => same(q.options.map((o, j) => +o % m.f === 0 && +o <= m.f * 10 ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('fact-tf', (q, m) => (m.a * m.b === m.said) === q.answer ? '' : 'truth');
  set('arr-tap', (q, m) => { const hit = q.tiles.map(grid).map((g, j) => g[0] === m.r && g[1] === m.c ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === q.answer ? '' : 'array'; });
  set('arr-fill', q => { const g = grid(q.fig); return q.answers[0] === g[0] && q.answers[1] === g[1] && q.answers[2] === g[0] * g[1] ? '' : 'blanks'; });
  set('arr-story', q => { const n = nums(q.q); return n[0] * n[1] === q.answer ? '' : 'total'; });
  set('arr-tf', (q, m) => { const g = grid(q.fig); return (g[0] * g[1] === m.said) === q.answer ? '' : 'truth'; });
  set('div-story', (q, m) => q.answer * m.k2 === m.n && nums(q.q)[0] === m.n ? '' : 'share');
  set('div-tap', (q, m) => { const hit = q.tiles.map(plates).map((p, j) => p[0] === m.k2 && p[0] * p[1] === m.n ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === q.answer ? '' : 'picture'; });
  set('div-which', (q, m) => (m.kind === 'times' ? /^Multiply/ : /^Divide/).test(q.options[q.answer]) ? '' : 'operation');
  set('div-tf', (q, m) => (m.k2 * m.said === m.n) === q.answer ? '' : 'truth');
  set('fam-pick', (q, m) => { const want = [m.a, m.b, m.a * m.b].sort().join(); const exp = q.options.map((o, j) => { const e = eq(o); return e && e.ok && '×÷'.includes(e.op) && [e.a, e.b, e.c].sort().join() === want ? j : -1; }).filter(j => j >= 0); return same(exp, q.answer) ? '' : 'picks'; });
  set('fam-fill', q => { const lines = q.fill.split('<br>'); return lines.every((l, i) => { const e = eq(l.replace('[[]]', String(q.answers[i]))); return e && e.ok; }) ? '' : 'family'; });
  set('fam-match', q => q.pairs.every(p => { const d = nums(p[0]), e = eq(p[1]); return e.ok && e.c === d[0] && e.a === d[1]; }) ? '' : 'pairs');
  set('fam-tf', (q, m) => (m.said * m.d === m.p) === q.answer ? '' : 'truth');
  set('scale-fill', (q, m) => q.answers.every((v, i) => v === m.f * m.ns[i]) ? '' : 'table');
  set('scale-story', q => { const n = nums(q.q); return n[1] * n[2] === q.answer ? '' : 'total'; });
  set('scale-match', (q, m) => q.pairs.every(p => nums(p[0])[0] * m.f === nums(p[1])[0]) ? '' : 'pairs');
  set('scale-tf', (q, m) => (m.f * m.n === m.said) === q.answer ? '' : 'truth');
  /* ---- Fractions ---- */
  /* reads a shaded bar or grid: [shaded parts, all parts] */
  const shade = svg => { const d = document.createElement('div'); d.innerHTML = svg; const r = [...d.querySelectorAll('rect')]; return [r.filter(x => /fill:var\(--strand\)/.test(x.getAttribute('style'))).length, r.length]; };
  /* reads "2 and 1/3", "1/4" or "3" written with fraction markup */
  const amount = h => { const d = document.createElement('div'); d.innerHTML = h; const f = d.querySelector('.fr'); let v = 0; if (f) { const s = f.querySelectorAll('span'); v = +s[0].textContent / +s[1].textContent; f.remove(); } const w = d.textContent.match(/\d+/); return v + (w ? +w[0] : 0); };
  const fracs = h => { const d = document.createElement('div'); d.innerHTML = h; return [...d.querySelectorAll('.fr')].map(f => { const s = f.querySelectorAll('span'); return [+s[0].textContent, +s[1].textContent]; }); };
  const PIECE = { halves: 2, thirds: 3, fourths: 4 };
  set('frn-tap', (q, m) => { const hit = q.tiles.map(shade).map((s, j) => s[0] === m.n && s[1] === m.d ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === q.answer && fracs(q.q)[0].join() === m.n + ',' + m.d ? '' : 'picture'; });
  set('frn-fill', q => shade(q.fig).join() === q.answers.join() ? '' : 'counts');
  set('frn-line', (q, m) => H.close(q.answer, m.n / m.d, 1e-9) && fracs(q.q)[0].join() === m.n + ',' + m.d ? '' : 'point');
  set('frn-tf', (q, m) => { const s = shade(q.fig); return (s[0] === m.sn && s[1] === m.sd) === q.answer ? '' : 'truth'; });
  set('frs-fill', (q, m) => q.answers[0] * m.k2 + q.answers[1] === m.items && q.answers[1] < m.k2 ? '' : 'share');
  set('frs-mc', (q, m) => H.close(amount(q.options[q.answer]) * m.k2, m.items, 1e-9) ? '' : 'share');
  set('frs-match', q => q.pairs.every(p => { const n = nums(p[0]); return H.close(amount(p[1]), n[0] / n[1], 1e-9); }) ? '' : 'pairs');
  set('frs-tf', (q, m) => (m.w * m.k2 + m.l === m.items) === q.answer ? '' : 'truth');
  set('fru-line', (q, m) => H.close(q.answer, m.n / m.d, 1e-9) ? '' : 'landing');
  set('fru-fill', (q, m) => fracs(q.fill).filter(f => f[0] === 1 && f[1] === m.d).length === q.answers[0] ? '' : 'count');
  set('fru-order', q => { const v = q.items.map(amount); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
  set('fru-tf', (q, m) => { const f = fracs(q.q), parts = f.slice(0, -1), said = f[f.length - 1]; const total = parts.reduce((a, p) => a + p[0] / p[1], 0); return H.close(total, said[0] / said[1], 1e-9) === q.answer ? '' : 'truth'; });
  set('fre-tap', (q, m) => { const hit = q.tiles.map(shade).map((s, j) => s[0] * m.a === m.n * s[1] ? j : -1).filter(j => j >= 0); return hit.length === 1 && hit[0] === q.answer ? '' : 'bar'; });
  set('fre-tf', (q, m) => (m.n * m.b === m.m * m.a) === q.answer ? '' : 'truth');
  set('fre-match', q => q.pairs.every(p => H.close(amount(p[0]), amount(p[1]), 1e-9)) && new Set(q.pairs.map(p => amount(p[0]))).size === q.pairs.length ? '' : 'pairs');
  set('frg-num', (q, m) => q.answer * m.d === m.n && nums(q.q)[0] === m.n ? '' : 'wholes');
  set('frg-match', q => q.pairs.every(p => { const d = PIECE[p[0].split(' ')[1]]; return nums(p[0])[0] === nums(p[1])[0] * d; }) ? '' : 'pairs');
  set('frg-fill', q => { const d = PIECE[(q.fill.match(/halves|thirds|fourths/) || [])[0]]; const l = q.fill.split('<br>'); return nums(l[0])[0] === q.answers[0] * d && q.answers[1] === nums(l[1].replace('[[]]', ''))[0] * d ? '' : 'wholes'; });
  set('frg-tf', (q, m) => (m.w * m.d === m.n) === q.answer ? '' : 'truth');
  /* ---- Patterns and algebra ---- */
  const SHAPE = { A: 'circle', B: 'square', C: 'triangle', D: 'star' };
  /* works out one step such as "12 ÷ 3" or "4 × 5" */
  const ev1 = t => { const m = H.strip(t).match(/^(\d+) ([+−×÷]) (\d+)$/); if (!m) return NaN; const a = +m[1], b = +m[3]; return { '+': a + b, '−': a - b, '×': a * b, '÷': a / b }[m[2]]; };
  /* finds n by trying every value from 0 to 200 in an equation like "n − 4 = 10" or "5 × n = 20" */
  const solve = t => { const [l, r] = H.strip(t).split('='); const hits = []; for (let n = 0; n <= 200; n++) if (ev1(l.trim().replace('n', n)) === +r) hits.push(n); return hits.length === 1 ? hits[0] : NaN; };
  /* counts the steps a robot moves for code such as "repeat 3 times [move 2]" or "move 1, move 4" */
  const steps = t => { let s = H.strip(t), total = 0; s = s.replace(/repeat (\d+) times \[([^\]]*)\]/g, (_, r, body) => { total += +r * nums(body).reduce((a, b) => a + b, 0); return ''; }); return total + (s.match(/move (\d+)/g) || []).reduce((a, b) => a + +b.slice(5), 0); };
  set('rep-order', (q, m) => q.items.every((x, i) => x === SHAPE[m.core[(m.from + i) % m.core.length]]) ? '' : 'next shapes');
  set('rep-tf', (q, m) => (SHAPE[m.core[(m.p - 1) % m.core.length]] === m.said) === q.answer ? '' : 'truth');
  set('rep-fill', (q, m) => { let c = 0; for (let i = 0; i < m.total; i++) if (m.core[i % m.core.length] === 'A') c++; return q.answers[0] === m.core.length && q.answers[1] === c ? '' : 'counts'; });
  set('rep-core', (q, m) => (m.said === m.core) === q.answer ? '' : 'truth');
  set('grow-fill', q => { const s = q.fill.replace(/<[^>]+>/g, '').split(','); let j = 0; const v = s.map(x => x.includes('[[]]') ? q.answers[j++] : +x); return v.every((x, i) => i < 2 || x - v[i - 1] === v[1] - v[0]) && v[1] !== v[0] ? '' : 'pattern'; });
  set('grow-line', (q, m) => m.st + m.b * (m.j - 1) === q.answer ? '' : 'point');
  set('grow-which', (q, m) => { const rule = H.strip(q.options[q.answer]), n = nums(rule), b = /take away/.test(rule) ? -n[1] : n[1]; return m.v.every((x, i) => x === n[0] + b * i) ? '' : 'rule'; });
  set('grow-tf', (q, m) => (m.v[3] + (m.v[1] - m.v[0]) === m.said) === q.answer ? '' : 'truth');
  set('var-match', q => q.pairs.every(p => solve(p[0]) === nums(p[1])[0]) ? '' : 'pairs');
  set('var-tf', (q, m) => (solve(m.eq) === m.n) === q.answer ? '' : 'truth');
  set('var-num', (q, m) => solve(m.eq) === q.answer ? '' : 'n');
  set('tbl-fill', (q, m) => q.answers.every((a, i) => ev1(m.ins[i] + ' ' + { '+': '+', '-': '−', x: '×' }[m.op] + ' ' + m.k2) === a) ? '' : 'outputs');
  set('tbl-match', (q, m) => q.pairs.every(p => ev1(nums(p[0])[0] + ' ' + { '+': '+', x: '×' }[m.op] + ' ' + m.k2) === +p[1]) ? '' : 'pairs');
  set('tbl-tf', (q, m) => (m.v + m.k2 === m.said) === q.answer ? '' : 'truth');
  set('peq-pick', (q, m) => same(q.options.map((o, j) => ev1(o) === m.t ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('peq-match', q => q.pairs.every(p => ev1(p[0]) === ev1(p[1])) && new Set(q.pairs.map(p => ev1(p[0]))).size === q.pairs.length ? '' : 'pairs');
  set('peq-fill', q => { const [l, r] = H.strip(q.fill.replace('[[]]', String(q.answers[0]))).split('='); return ev1(l.trim()) === ev1(r.trim()) ? '' : 'sides'; });
  set('peq-tf', (q, m) => (ev1(m.l) === ev1(m.r)) === q.answer ? '' : 'truth');
  set('code-match', q => q.pairs.every(p => steps(p[0]) === nums(p[1])[0]) ? '' : 'pairs');
  set('code-fill', (q, m) => steps('repeat ' + q.answers[0] + ' times [move ' + q.answers[1] + ']') === m.moves.reduce((a, b) => a + b, 0) && m.moves.every(x => x === q.answers[1]) ? '' : 'loop');
  set('code-tf', (q, m) => (steps(H.strip(q.q).split('.')[0]) === m.said) === q.answer ? '' : 'truth');
  set('code-which', (q, m) => { const ok = q.options.map((o, j) => steps(o) === m.t ? j : -1).filter(j => j >= 0); return ok.length === 1 && ok[0] === q.answer ? '' : 'code'; });
})(window.__verify, window.__H);
