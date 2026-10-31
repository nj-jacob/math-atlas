/* Answer checks for Grade 8 question shapes. Each check gets (q, q.meta, helpers) and returns
   an error message, or '' when the answer is right. Work the answer out here independently:
   never copy the site's own calculation. */
(function (V, H) {
  const set = (k, fn) => { V[k] = fn; };
  /* read a number shown as text: handles the − sign, spaces in big numbers, $ and % */
  const n = t => parseFloat(H.strip(t).replace(/−/g, '-').replace(/[\s,$%]/g, ''));
  /* work out a shown expression such as "(−3) + 4 × (−2)" or "3 ÷ 1/4" with ordinary arithmetic (a/b is one fraction) */
  const ev = t => Function('return (' + H.strip(t).replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/').replace(/\[/g, '(').replace(/\]/g, ')').replace(/(\d+)\/(\d+)/g, '($1/$2)') + ');')();
  const near = (a, b, tol) => Math.abs(a - b) <= (tol == null ? 1e-9 : tol);
  const same = (a, b) => a.slice().sort().join() === b.slice().sort().join();
  const chosen = q => q.options[q.answer];
  /* indexes of options for which test(optionText) is true */
  const which = (q, test) => q.options.map((o, j) => (test(o) ? j : -1)).filter(j => j >= 0);
  /* the one option that passes test must be the marked answer, and no other may pass */
  const only = (q, test) => { const w = which(q, test); return w.length === 1 && w[0] === q.answer ? '' : 'right option (' + w.join() + ' vs ' + q.answer + ')'; };
  const pairsOk = (q, f) => q.pairs.every(p => f(p[0], p[1])) ? '' : 'pairs';
  const ordered = (vals, up) => vals.every((x, i) => !i || (up === false ? x < vals[i - 1] : x > vals[i - 1]));
  const tf = (truth, q) => truth === q.answer ? '' : 'truth';

  /* ---- Integers ---- */
  set('ia-line', (q, m) => q.answer === m.a + m.b ? '' : 'sum');
  set('ia-story', (q, m) => q.answer === m.t + m.c && H.strip(q.q).includes(m.c > 0 ? 'rise' : 'fall') ? '' : 'temperature');
  set('ia-tf', (q, m) => tf(m.a + m.b === m.said, q));
  set('ia-match', q => pairsOk(q, (l, r) => ev(l) === n(r)));
  set('is-line', (q, m) => q.answer === m.a - m.b ? '' : 'difference');
  set('is-tf', (q, m) => tf(m.a - m.b === m.said, q));
  set('is-story', (q, m) => q.answer === m.hi - m.lo && m.hi > m.lo ? '' : 'warmer by');
  set('is-fill', (q, m) => q.answers[0] === -m.b && q.answers[1] === m.a - m.b ? '' : 'blanks');
  set('im-pick', q => same(which(q, o => ev(o) < 0), q.answer) ? '' : 'picks');
  set('im-tf', (q, m) => tf(m.a * m.b === m.said, q));
  set('im-story', (q, m) => q.answer === m.r * m.t && m.r < 0 ? '' : 'depth');
  set('im-match', q => pairsOk(q, (l, r) => ev(l) === n(r)));
  set('id-tf', (q, m) => tf(m.n / m.d === m.said, q));
  set('id-story', (q, m) => q.answer === m.tot / m.h ? '' : 'per hour');
  set('id-fill', (q, m) => q.answers[0] * m.d === m.n ? '' : 'quotient');
  set('id-pick', (q, m) => same(which(q, o => ev(o) === m.v), q.answer) ? '' : 'picks');
  set('ix-first', q => H.strip(chosen(q)).startsWith('Multiply') ? '' : 'first step');
  set('ix-way', (q, m) => { const want = { fall: m.a - m.b, share: m.a / m.b, repeat: m.a * m.b }[m.s]; return only(q, o => ev(o) === want); });
  set('ix-tf', (q, m) => tf(ev(m.ex) === m.said, q));
  set('ix-order', q => ordered(q.items.map(ev)) ? '' : 'order');
  /* ---- Square roots and real numbers ---- */
  /* the value of a shown real number: √k, a/b, π, a decimal or an integer */
  const rv = t => { const s = H.strip(t).replace(/−/g, '-'); if (s === 'π') return Math.PI; if (s.startsWith('√')) return Math.sqrt(n(s.slice(1))); if (s.includes('/')) { const [a, b] = s.split('/'); return n(a) / n(b); } return n(s); };
  const isSq = k => Number.isInteger(Math.sqrt(k));
  const irrational = t => { const s = H.strip(t); return s === 'π' || (s.startsWith('√') && !isSq(n(s.slice(1)))); };
  set('rs-match', (q, m) => q.pairs.every((p, i) => n(p[1]) === m.list[i] * m.list[i] && H.strip(p[0]) === m.list[i] + '\u00b2') ? '' : 'pairs');
  set('rs-tf', (q, m) => tf(m.x * m.x === m.said, q));
  set('rs-story', (q, m) => q.answer === m.s * m.s ? '' : 'area');
  set('rs-pick', q => same(which(q, o => isSq(n(o))), q.answer) ? '' : 'picks');
  set('rt-tap', (q, m) => { const w = q.tiles.map((t, j) => (n(t) * n(t) === m.sq ? j : -1)).filter(j => j >= 0); return w.length === 1 && w[0] === q.answer ? '' : 'root tile'; });
  set('rt-story', (q, m) => q.answer * q.answer === m.total ? '' : 'side');
  set('rt-tf', (q, m) => tf(m.said * m.said === m.sq, q));
  set('rt-fill', (q, m) => q.answers.every(a => a * a === m.sq && a > 0) ? '' : 'root');
  set('re-line', (q, m) => near(q.answer, Math.sqrt(m.n), 0.06) && q.tol <= 0.3 && q.min <= Math.sqrt(m.n) && q.max >= Math.sqrt(m.n) ? '' : 'placement');
  set('re-tf', (q, m) => tf(m.lo * m.lo < m.n && m.n < (m.lo + 1) * (m.lo + 1), q));
  set('re-tap', (q, m) => { const below = q.tiles.map(n).filter(v => isSq(v) && v < m.n); return n(q.tiles[q.answer]) === Math.max(...below) && Math.sqrt(n(q.tiles[q.answer])) === Math.floor(Math.sqrt(m.n)) ? '' : 'square below'; });
  set('rc-pick', q => same(which(q, irrational), q.answer) ? '' : 'picks');
  set('rc-tf', (q, m) => tf(!isSq(m.n), q));
  set('rc-tap', q => { const w = q.tiles.map((t, j) => (irrational(t) ? j : -1)).filter(j => j >= 0); return w.length === 1 && w[0] === q.answer ? '' : 'irrational tile'; });
  set('ro-order', q => ordered(q.items.map(rv)) ? '' : 'order');
  set('ro-tf', (q, m) => tf(Math.sqrt(m.n) > m.d, q));
  set('ro-tap', q => { const v = q.tiles.map(rv); return v[q.answer] === Math.max(...v) && v.filter(x => x === Math.max(...v)).length === 1 ? '' : 'greatest'; });
  set('ro-pick', (q, m) => same(which(q, o => rv(o) > m.a && rv(o) < m.a + 1), q.answer) ? '' : 'picks');
  /* ---- Big and small numbers ---- */
  /* read superscript powers: "10⁻³" -> -3, "4.5 × 10⁶" -> 4 500 000 */
  const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const expOf = t => { const s = H.strip(t).match(/10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)$/)[1]; return (s[0] === '⁻' ? -1 : 1) * +[...s.replace('⁻', '')].map(c => SUPS.indexOf(c)).join(''); };
  const coefOf = t => { const s = H.strip(t); return s.includes('×') ? n(s.split('×')[0]) : 1; };
  const sv = t => coefOf(t) * Math.pow(10, expOf(t));
  const rel = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  const PREF = { T: 12, G: 9, M: 6, k: 3, '': 0, m: -3, 'µ': -6, n: -9, p: -12 };
  const unitPow = u => PREF[H.strip(u).slice(0, -1)];
  set('bp-match', q => pairsOk(q, (l, r) => rel(sv(l), n(r))));
  set('bp-tf', (q, m) => tf(Math.pow(10, m.e) === m.said, q));
  set('bp-order', q => ordered(q.items.map(expOf)) ? '' : 'order');
  set('bp-pick', q => same(which(q, o => sv(o) < 1), q.answer) ? '' : 'picks');
  set('bh-match', q => pairsOk(q, (l, r) => rel(ev(l), n(r))));
  set('bh-story', (q, m) => q.answer === m.n * Math.pow(10, m.k2) ? '' : 'total');
  set('bh-tf', (q, m) => tf(rel(m.n * Math.pow(10, m.k2), n(m.said)), q));
  set('bh-fill', (q, m) => rel(m.n / q.answers[0], m.r) ? '' : 'divisor');
  set('bb-tap', q => { const ok = q.tiles.map((t, j) => (coefOf(t) >= 1 && coefOf(t) < 10 ? j : -1)).filter(j => j >= 0); const v = q.tiles.map(sv); return ok.length === 1 && ok[0] === q.answer && v.every(x => rel(x, v[0])) ? '' : 'proper form'; });
  set('bb-story', (q, m) => rel(m.c * Math.pow(10, q.answers[0]), m.n) && m.c >= 1 && m.c < 10 ? '' : 'exponent');
  set('bb-tf', (q, m) => tf(rel(m.c * Math.pow(10, m.e), m.n), q));
  set('bb-match', q => pairsOk(q, (l, r) => rel(n(l), sv(r)) && coefOf(r) >= 1 && coefOf(r) < 10));
  set('bx-match', q => pairsOk(q, (l, r) => PREF[H.strip(l).match(/\((.*)\)/)[1]] === expOf(r)));
  set('bx-order', q => ordered(q.items.map(t => unitPow(H.strip(t).replace(/^1 /, '')))) ? '' : 'order');
  set('bx-tf', (q, m) => tf(Math.pow(10, unitPow(m.from) - unitPow(m.to)) === m.said, q));
  set('bx-story', (q, m) => q.answer === m.v * Math.pow(10, unitPow(m.from) - unitPow(m.to)) ? '' : 'conversion');
  set('bc-tap', q => { const v = q.tiles.map(sv); return v[q.answer] === Math.max(...v) ? '' : 'biggest'; });
  set('bc-order', q => ordered(q.items.map(sv)) ? '' : 'order');
  set('bc-tf', (q, m) => tf(m.a * Math.pow(10, m.e) > m.b * Math.pow(10, m.f), q));
  /* ---- Fractions ---- */
  /* read "3/4", "1 3/4", "−2/3" or a whole number */
  const fv = t => { const s = H.strip(t).replace(/−/g, '-'); let m = s.match(/^(-?)(\d+) (\d+)\/(\d+)$/); if (m) return (m[1] ? -1 : 1) * (+m[2] + m[3] / m[4]); m = s.match(/^(-?\d+)\/(\d+)$/); if (m) return m[1] / m[2]; return n(s); };
  const fx = f => f[0] / f[1];
  set('fa-fill', (q, m) => { const [x, y, z] = q.answers; return near(x / m.L, fx(m.p)) && near(y / m.L, fx(m.q)) && near(z / m.L, fx(m.p) + fx(m.q)) ? '' : 'blanks'; });
  set('fa-story', (q, m) => near(q.answer, fx(m.p) + fx(m.q)) && near(fv(q.show), q.answer) ? '' : 'total');
  set('fa-tf', (q, m) => tf(near(fv(m.said), fx(m.p) + fx(m.q)), q));
  set('fa-match', q => pairsOk(q, (l, r) => near(ev(l), fv(r))));
  set('fs-fill', (q, m) => { const [x, y, z] = q.answers; return near(x / m.L, fx(m.p)) && near(y / m.L, fx(m.q)) && near(z / m.L, fx(m.p) - fx(m.q)) && z > 0 ? '' : 'blanks'; });
  set('fs-story', (q, m) => near(q.answer, fx(m.p) - fx(m.q)) && q.answer > 0 && near(fv(q.show), q.answer) ? '' : 'left');
  set('fs-tf', (q, m) => tf(near(fv(m.said), fx(m.p) - fx(m.q)), q));
  set('fm-fill', (q, m) => q.answers[0] === m.p[0] * m.q[0] && q.answers[1] === m.p[1] * m.q[1] ? '' : 'product');
  set('fm-story', (q, m) => near(q.answer, fx(m.p) * fx(m.q)) && near(fv(q.show), q.answer) ? '' : 'flour');
  set('fm-tf', (q, m) => tf(m.w * fx(m.f) > m.w, q));
  set('fm-match', q => pairsOk(q, (l, r) => near(ev(l), fv(r))));
  set('fd-fill', (q, m) => q.answers[1] === m.w / (1 / m.d) && near(m.w * q.answers[0], q.answers[1]) ? '' : 'quotient');
  set('fd-story', (q, m) => near(q.answer * (1 / m.d), m.w) ? '' : 'bows');
  set('fd-tf', (q, m) => tf(near(fv(m.said), fx(m.p) / fx(m.q)), q));
  set('fd-tap', (q, m) => { const w = q.tiles.map((t, j) => (near(ev(t), fx(m.p) / fx(m.q)) ? j : -1)).filter(j => j >= 0); return w.length === 1 && w[0] === q.answer ? '' : 'same answer'; });
  set('fw-way', (q, m) => { const a = Array.isArray(m.a) ? fx(m.a) : m.a, b = Array.isArray(m.b) ? fx(m.b) : m.b; const want = { batches: b * a, pieces: b / a, left: a - b, total: a + b }[m.s]; return only(q, o => near(ev(o), want)); });
  set('fw-tf', (q, m) => tf(m.kind === 'pieces' ? m.op === 'div' : m.op === 'mul', q));
  set('fw-fill', (q, m) => q.answers[2] === m.n * m.f[0] / m.f[1] && q.answers[0] === m.f[1] && q.answers[1] * m.f[1] === m.n ? '' : 'part');
  /* ---- Percent, ratio and rate ---- */
  /* read "35%", "3/4" or "0.72" as a plain number */
  const pv = t => { const s = H.strip(t); return s.endsWith('%') ? n(s) / 100 : fv(s); };
  set('pc-match', q => pairsOk(q, (l, r) => near(n(l) / 100, n(r), 1e-12)));
  set('pc-line', (q, m) => near(q.answer, m.p / 100, 1e-12) ? '' : 'placement');
  set('pc-tf', (q, m) => tf(near(m.said, m.p / 100, 1e-12), q));
  set('pc-order', q => ordered(q.items.map(pv)) ? '' : 'order');
  set('po-story', (q, m) => near(q.answer * 100, m.p * m.n, 1e-9) && Number.isInteger(q.answer) ? '' : 'students');
  set('po-fill', (q, m) => near(q.answers[0] * 10, m.n) && near(q.answers[1], m.n * m.p / 100) ? '' : 'blanks');
  set('po-tf', (q, m) => tf((m.n * m.p / 100 > m.n) === m.more, q));
  set('po-match', q => pairsOk(q, (l, r) => { const [p, of] = H.strip(l).split('% of '); return near(n(p) * n(of) / 100, n(r), 1e-9); }));
  set('pg-way', (q, m) => only(q, o => near(ev(o), m.price - m.price * m.p / 100, 1e-9)));
  set('pg-tf', (q, m) => tf(near(m.price + m.price * m.p / 100, m.said, 0.001), q));
  set('pg-story', (q, m) => near(q.answer, Math.round(m.price * 13) / 100, 0.001) ? '' : 'tax');
  set('pg-fill', (q, m) => near(q.answers[0] * 100, m.up ? 100 + m.p : 100 - m.p, 1e-9) ? '' : 'multiplier');
  set('pp-fill', (q, m) => m.a * q.answers[0] === m.b * m.c ? '' : 'ratio');
  set('pp-story', (q, m) => m.a * q.answer === m.b * m.c ? '' : 'water');
  set('pp-tf', (q, m) => tf(m.a * m.said === m.b * m.c, q));
  set('pp-pick', (q, m) => same(which(q, o => { const [x, y] = H.strip(o).split(' : ').map(Number); return m.a * y === m.b * x; }), q.answer) ? '' : 'picks');
  const offer = t => { const g = H.strip(t).match(/^(\d+) for \$([\d.]+)$/); return +g[2] / +g[1]; };
  set('pa-tap', q => { const u = q.tiles.map(offer); return u[q.answer] === Math.min(...u) ? '' : 'best buy'; });
  set('pa-fill', (q, m) => near(q.answers[0] * m.q, m.tot, 0.006) ? '' : 'unit price');
  set('pa-tf', (q, m) => tf(m.p2 / m.s2 < m.p1 / m.s1, q));
  set('pa-order', q => ordered(q.items.map(t => { const g = H.strip(t).match(/^(\d+) km in (\d+) h$/); return +g[1] / +g[2]; })) ? '' : 'order');
  set('pq-first', (q, m) => { const c = H.strip(chosen(q)), br = H.strip(m.ex).startsWith('('); return br ? (c.includes('brackets') ? '' : 'brackets first') : (c.startsWith('Multiply') ? '' : 'multiply first'); });
  set('pq-tf', (q, m) => tf(ev(m.ex) === m.said, q));
  set('pq-fill', (q, m) => q.answers[0] === m.b * m.c && q.answers[1] === ev(m.a + ' - ' + m.b + ' * ' + m.c) ? '' : 'steps');
  set('pq-order', q => ordered(q.items.map(ev)) ? '' : 'order');
})(window.__verify, window.__H);
