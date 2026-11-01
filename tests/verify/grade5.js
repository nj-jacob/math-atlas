/* Answer checks for Grade 5 question shapes. Each check gets (q, q.meta, helpers) and returns
   an error message, or '' when the answer is right. Work the answer out here independently:
   never copy the site's own calculation. Keys start with g5 so they never clash with another grade. */
(function (V, H) {
  const set = (k, fn) => { V[k] = fn; };
  const bold = q => H.strip((q.q.match(/<b>(.*?)<\/b>/) || [])[1] || '');
  const same = (a, b) => a.slice().sort().join() === b.slice().sort().join();
  const picks = (q, fits) => same(q.options.map((o, j) => fits(o, j) ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks';
  const reason = (q, word) => H.strip(q.why.options[q.why.answer]).includes(word) ? '' : 'reason';
  /* an underlined digit: [the whole number, the index of the underlined digit] */
  const under = html => { const d = document.createElement('div'); d.innerHTML = html; const u = d.querySelector('u'), box = u.parentNode; let i = 0, n = ''; for (const c of box.childNodes) { if (c === u) i = n.length; n += c.textContent.replace(/\s/g, ''); } return [+n, i]; };
  /* a fraction written as "3/4" or "1 3/4" */
  const frac = t => { const m = H.strip(t).match(/(?:(\d+)\s+)?(\d+)\s*\/\s*(\d+)/); return m ? (+(m[1] || 0)) + +m[2] / +m[3] : NaN; };
  const fracs = t => (H.strip(t).match(/\d+\/\d+/g) || []).map(frac);
  /* a bar drawing: [shaded parts, all parts] */
  const shade = svg => [(String(svg).match(/fill:var\(--strand\)/g) || []).length, (String(svg).match(/<rect/g) || []).length];
  /* squares shaded in a hundred grid */
  const filled = svg => (String(svg).match(/<rect[^>]*fill:(?!var\(--card\))/g) || []).length;
  /* round to the nearest tenth, working in whole hundredths so 1.45 never becomes 1.4 */
  const tenth = x => { const h = Math.round(x * 100), r = h % 10; return (r >= 5 ? h - r + 10 : h - r) / 100; };
  const nums = t => (H.strip(String(t).replace(/<br>/g, ' ')).match(/\d+(?:\.\d+)?/g) || []).map(Number);
  /* work out a written expression such as "4 × 20 + 4 × 3" (only digits and + − × ÷ ( ) are allowed) */
  const ev = t => { const e = H.strip(t).replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'); return /^[\d\s+\-*/().]+$/.test(e) ? Function('return (' + e + ')')() : NaN; };
  /* counters drawing: [circles, squares] */
  const shapes = svg => [(String(svg).match(/<circle/g) || []).length, (String(svg).match(/<rect/g) || []).length];
  const ratio = t => H.strip(t).match(/(\d+)\s*:\s*(\d+)/).slice(1).map(Number);
  const sameRatio = (p, q) => p[0] * q[1] === p[1] * q[0];
  /* a rule or expression in n, such as "3n + 4", worked out for one value of n */
  const atN = (rule, n) => ev(H.strip(rule).replace(/(\d)\s*n/g, '$1*' + n).replace(/\bn\b/g, String(n)));
  /* is a list evenly spaced? */
  const even = v => v.every((x, i) => i < 2 || H.close(x - v[i - 1], v[1] - v[0], 1e-6));
  const val = (n, i) => H.placeVal(n, i);
  const fmt = n => { const t = String(n); return t.split('.')[0].length > 4 ? t.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : t; };

  /* ---- Place value ---- */
  set('g5pv-tap', (q, m) => { const hits = String(m.n).split('').map((_, i) => i).filter(i => val(m.n, i) === m.val); return hits.length === 1 && String(hits[0]) === q.answer && H.num(bold(q)) === m.val ? '' : 'digit worth ' + m.val; });
  set('g5pv-story', (q, m) => { const [n, i] = under(q.q); return n === m.n && i === m.i && val(n, i) === q.answer ? '' : 'value'; });
  set('g5pv-match', (q, m) => q.pairs.every(p => { const [n, i] = under(p[0]); return val(n, i) === H.num(p[1]); }) ? '' : 'pairs');
  set('g5pv-tf', (q, m) => { const [n, i] = under(q.q), real = val(n, i); return (real === m.said) === q.answer && H.num(bold(q)) === m.said ? reason(q, 'worth ' + fmt(real)) : 'truth'; });
  set('g5pv-disktap', (q, m) => m.set[q.answer] === m.n && H.num(bold(q)) === m.n && new Set(m.set).size === m.set.length ? '' : 'tile');
  set('g5pv-diskfill', (q, m) => { const L = q.answers.length; return q.answers.reduce((t, d, j) => t + d * Math.pow(10, L - 1 - j), 0) === m.n && q.answers.every(d => d >= 0 && d <= 9) ? '' : 'digits'; });
  set('g5pv-build', (q, m) => q.answer === (m.down ? (m.m * 100) / 10 : m.m * 10) && q.answer < 1000 ? '' : 'build');
  set('g5pv-disktf', (q, m) => (m.c.reduce((t, k, p) => t + k * Math.pow(10, p), 0) === m.said) === q.answer ? '' : 'truth');
  set('g5pv-formfill', (q, m) => { const s = String(m.n), exp = s.split('').map((_, i) => val(m.n, i)).filter(v => v); return exp.join() === q.answers.join() ? '' : 'parts'; });
  set('g5pv-formmatch', q => q.pairs.every(p => H.sum(p[0]) === H.num(p[1])) ? '' : 'pairs');
  set('g5pv-formtf', (q, m) => (m.parts.reduce((a, b) => a + b, 0) === m.said) === q.answer && H.sum(H.strip(q.q).split('=')[0].replace(/^.*says/, '')) === m.parts.reduce((a, b) => a + b, 0) ? '' : 'truth');
  set('g5pv-wordmatch', q => q.pairs.every(p => H.fromWords(p[0]) === H.num(p[1])) ? '' : 'pairs');
  set('g5pv-wordtap', q => H.fromWords(bold(q)) === H.num(H.strip(q.tiles[q.answer])) && new Set(q.tiles).size === q.tiles.length ? '' : 'tile');
  set('g5pv-wordtf', (q, m) => (H.fromWords(bold(q)) === m.said) === q.answer ? '' : 'truth');
  set('g5pv-order', q => { const v = q.items.map(H.num); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
  set('g5pv-story2', (q, m) => (m.a > m.b ? 0 : 1) === q.answer && m.a !== m.b ? '' : 'winner');
  set('g5pv-pick', (q, m) => picks(q, o => (m.more ? H.num(o) > m.x : H.num(o) < m.x)));
  set('g5pv-cmptf', (q, m) => q.answer === (m.a > m.b) ? '' : 'truth');
  set('g5pv-roundline', (q, m) => q.answer === H.roundTo(m.n, m.p) && q.answer % m.p === 0 ? '' : 'rounded');
  set('g5pv-roundpick', (q, m) => picks(q, o => H.roundTo(H.num(o), m.p) === m.t));
  set('g5pv-roundtf', (q, m) => (H.roundTo(m.n, m.p) === m.said) === q.answer ? '' : 'truth');
  set('g5pv-roundstory', (q, m) => q.answer === H.roundTo(m.n, m.p) ? '' : 'rounded');
  /* ---- Fractions ---- */
  set('g5fr-tap', q => { const want = frac(bold(q)), got = q.tiles.map(t => { const [n, d] = shade(t); return n / d; }); return H.close(got[q.answer], want) && got.filter(v => H.close(v, want)).length === 1 ? '' : 'tile'; });
  set('g5fr-line', q => H.close(q.answer, frac(q.place)) ? '' : 'point');
  set('g5fr-match', q => q.pairs.every(p => { const [n, d] = shade(p[0]); return H.close(n / d, frac(p[1])); }) ? '' : 'pairs');
  set('g5fr-tf', (q, m) => { const [n, d] = shade(q.fig); return ((n + '/' + d) === m.said) === q.answer && bold(q) === m.said ? '' : 'truth'; });
  set('g5fr-equivpick', q => { const want = frac(bold(q)); return picks(q, o => H.close(frac(o), want)); });
  set('g5fr-equivmatch', q => q.pairs.every(p => H.close(frac(p[0]), frac(p[1]))) ? '' : 'pairs');
  set('g5fr-equivfill', q => { const t = H.strip(q.fill).split('='), want = frac(t[0]), D = +t[1].split('/')[1], N = +t[2].split('/')[0]; return H.close(q.answers[0] / D, want) && H.close(N / q.answers[1], want) ? '' : 'blanks'; });
  set('g5fr-equivtf', q => { const v = fracs(q.q); return H.close(v[0], v[1]) === q.answer ? '' : 'truth'; });
  set('g5fr-mixline', q => H.close(q.answer, frac(q.place)) ? '' : 'point');
  set('g5fr-mixmatch', q => q.pairs.every(p => H.close(frac(p[0]), frac(p[1]))) ? '' : 'pairs');
  set('g5fr-mixfill', (q, m) => q.answers[0] * m.d + q.answers[1] === m.N && q.answers[1] < m.d ? '' : 'mixed');
  set('g5fr-mixtf', q => { const v = H.strip(q.q).match(/(\d+)\s+(\d+)\/(\d+) = (\d+)\/(\d+)/); return H.close(+v[1] + v[2] / v[3], v[4] / v[5]) === q.answer ? '' : 'truth'; });
  set('g5fr-order', q => { const v = q.items.map(frac); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
  set('g5fr-story', q => { const v = fracs(q.q); return v[0] !== v[1] && (v[0] > v[1] ? 0 : 1) === q.answer ? '' : 'winner'; });
  set('g5fr-cmptf', q => { const v = H.strip(q.q).match(/1\/(\d+) > 1\/(\d+)/); return (+v[1] < +v[2]) === q.answer ? '' : 'truth'; });
  set('g5fr-half', q => picks(q, o => frac(o) > 0.5));
  set('g5fr-addfill', q => { const t = H.strip(q.fill), v = fracs(t), d = +t.match(/\/(\d+)$/)[1], r = t.includes('−') ? v[0] - v[1] : v[0] + v[1]; return H.close(q.answers[0] / d, r) ? '' : 'sum'; });
  set('g5fr-addstory', q => { const v = fracs(q.q), d = +q.fill.match(/\/(\d+)/)[1]; return H.close(q.answers[0] / d, v[0] + v[1]) ? '' : 'sum'; });
  set('g5fr-addtf', q => { const v = fracs(q.q); return H.close(v[0] + v[1], v[2]) === q.answer ? '' : 'truth'; });
  set('g5fr-which', (q, m) => H.strip(q.options[q.answer]).includes(m.sub ? '−' : '+') ? '' : 'operation');
  set('g5fr-unitfill', q => +H.strip(q.fill).match(/^(\d+)/)[1] === q.answers[0] ? '' : 'pieces');
  set('g5fr-unittap', q => { const b = bold(q).match(/(\d+) × 1\/(\d+)/), lab = q.tiles[q.answer].match(/aria-label="(\d+) pieces of size 1\/(\d+)"/); return lab && lab[1] === b[1] && lab[2] === b[2] ? '' : 'tile'; });
  set('g5fr-unitstory', (q, m) => H.close(q.answer / m.d, m.w) && H.strip(q.q).includes('1/' + m.d) ? '' : 'count');
  set('g5fr-unitwhich', (q, m) => H.strip(q.options[q.answer]).includes(m.mul ? '×' : '÷') ? '' : 'operation');
  /* ---- Decimals ---- */
  set('g5de-tap', q => { const want = Math.round(H.num(bold(q)) * 100), got = q.tiles.map(filled); return got[q.answer] === want && got.filter(g => g === want).length === 1 ? '' : 'grid'; });
  set('g5de-match', q => q.pairs.every(p => H.close(frac(p[0]), H.num(p[1]))) ? '' : 'pairs');
  set('g5de-fill', q => { const d = H.strip(q.fill).match(/(\d+)\.(\d)(\d)/); return +d[2] === q.answers[0] && +d[3] === q.answers[1] ? '' : 'digits'; });
  set('g5de-tf', q => { const t = H.strip(q.q).match(/(\d+\/100) = (\d+(?:\.\d+)?)/); return H.close(frac(t[1]), +t[2]) === q.answer ? '' : 'truth'; });
  set('g5de-line', q => H.close(q.answer, H.num(q.place)) ? '' : 'point');
  set('g5de-linematch', (q, m) => q.pairs.every((p, j) => H.close(H.num(p[1]), m.vals[j])) && new Set(m.vals).size === m.vals.length ? '' : 'pairs');
  set('g5de-linetf', (q, m) => (m.c === m.said) === q.answer && H.close(H.num(bold(q)), m.said / 100) ? '' : 'truth');
  set('g5de-order', q => { const v = q.items.map(H.num); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
  set('g5de-pick', (q, m) => picks(q, o => (m.more ? H.num(o) > m.x : H.num(o) < m.x)));
  set('g5de-cmptf', q => { const t = H.strip(q.q).match(/([\d.]+) > ([\d.]+)/); return (+t[1] > +t[2]) === q.answer ? '' : 'truth'; });
  set('g5de-story', q => { const v = [...H.strip(q.q).matchAll(/jumped ([\d.]+) m/g)].map(x => +x[1]); return v[0] !== v[1] && (v[0] > v[1] ? 0 : 1) === q.answer ? '' : 'winner'; });
  set('g5de-roundline', (q, m) => H.close(q.answer, tenth(m.c)) ? '' : 'rounded');
  set('g5de-roundpick', (q, m) => picks(q, o => H.close(tenth(H.num(o)), m.T)));
  set('g5de-roundtf', (q, m) => H.close(tenth(m.c), m.said) === q.answer ? '' : 'truth');
  set('g5de-roundstory', q => H.close(q.answer, tenth(nums(q.q)[0])) ? '' : 'rounded');
  set('g5de-fdpmatch', q => q.pairs.every(p => H.close(frac(p[0]) * 100, H.num(p[1]) * (p[1].includes('%') ? 1 : 100))) ? '' : 'pairs');
  set('g5de-fdptap', q => filled(q.tiles[q.answer]) === H.num(bold(q)) && q.tiles.filter(t => filled(t) === H.num(bold(q))).length === 1 ? '' : 'grid');
  set('g5de-fdpfill', q => { const v = frac(H.strip(q.fill).split('=')[0]) * 100; return H.close(q.answers[0], v) && H.close(q.answers[1], v) ? '' : 'blanks'; });
  set('g5de-fdptf', q => { const t = H.strip(q.q).match(/(\d+\/\d+) = (\d+(?:\.\d+)?)/); return H.close(frac(t[1]), +t[2]) === q.answer ? '' : 'truth'; });
  set('g5de-addfill', q => { const t = H.strip(q.fill), v = nums(t); return H.close(q.answers[0], t.includes('−') ? v[0] - v[1] : v[0] + v[1], 1e-6) ? '' : 'sum'; });
  set('g5de-addstory', (q, m) => { const v = [...q.q.matchAll(/\$(\d+\.\d\d)/g)].map(x => +x[1]); return H.close(q.answer, m.buy ? v[0] - v[1] : v[0] + v[1], 1e-6) ? '' : 'money'; });
  set('g5de-which', (q, m) => H.strip(q.options[q.answer]).includes(m.sub ? '−' : '+') ? '' : 'operation');
  set('g5de-addtf', q => { const v = nums(q.q); return H.close(v[0] + v[1], v[2], 1e-6) === q.answer ? '' : 'truth'; });
  set('g5de-mfill', (q, m) => H.close(q.answers[0] * 10, m.n, 1e-6) && H.close(q.answers[1] * 100, m.n, 1e-6) ? '' : 'blanks');
  set('g5de-mmatch', q => q.pairs.every(p => { const v = nums(p[0]); return H.close(v[0] * v[1], H.num(p[1]), 1e-6); }) ? '' : 'pairs');
  set('g5de-mtf', (q, m) => H.close(m.n / 10, m.said) === q.answer ? '' : 'truth');
  set('g5de-mstory', q => { const v = nums(q.q); return H.close(q.answer, v[0] * v[1], 1e-6) ? '' : 'product'; });
  /* ---- Multiply and divide ---- */
  set('g5md-tap', q => { const b = bold(q).split('×').map(Number), t = q.tiles[q.answer], rows = new Set((t.match(/cy="[\d.]+"/g) || [])).size; return (t.match(/<circle/g) || []).length === b[0] * b[1] && rows === b[0] ? '' : 'array'; });
  set('g5md-match', q => q.pairs.every(p => ev(p[0]) === H.num(p[1])) ? '' : 'pairs');
  set('g5md-fill', q => { const v = nums(q.fill); return v[0] * q.answers[0] === v[1] && v[2] / v[3] === q.answers[1] ? '' : 'family'; });
  set('g5md-tf', q => { const v = nums(q.q); return (v[0] * v[1] === v[2]) === q.answer ? '' : 'truth'; });
  set('g5md-multfill', q => { const v = nums(q.fill), [a, b, t] = v; return q.answers[0] === t * b && q.answers[0] + q.answers[1] === a * b && q.answers[2] === a * b ? '' : 'partial products'; });
  set('g5md-build', q => q.answer === ev(bold(q)) ? '' : 'product');
  set('g5md-multstory', q => { const v = nums(q.q); return q.answer === v[0] * v[1] ? '' : 'product'; });
  set('g5md-which', (q, m) => H.strip(q.options[q.answer]).includes(m.mul ? '×' : '÷') ? '' : 'operation');
  set('g5md-divfill', q => { const v = nums(q.fill); return q.answers[0] * v[1] === v[0] && q.answers[1] === q.answers[0] ? '' : 'quotient'; });
  set('g5md-divstory', q => { const v = nums(q.q); return q.answer * v[1] === v[0] ? '' : 'share'; });
  set('g5md-divwhich', (q, m) => H.strip(q.options[q.answer]).includes(m.div ? '÷' : '×') ? '' : 'operation');
  set('g5md-divtf', q => { const v = nums(q.q); return (v[2] * v[1] === v[0]) === q.answer ? '' : 'truth'; });
  set('g5md-remfill', q => { const v = nums(q.fill); return v[1] * q.answers[0] + q.answers[1] === v[0] && q.answers[1] < v[1] ? '' : 'remainder'; });
  set('g5md-remmatch', q => q.pairs.every(p => { const a = nums(p[0]), b = nums(p[1]); return a[1] * b[0] + b[1] === a[0] && b[1] < a[1]; }) ? '' : 'pairs');
  set('g5md-remtf', (q, m) => ((m.up ? Math.ceil(m.n / m.d) : Math.floor(m.n / m.d)) === m.said) === q.answer ? '' : 'truth');
  set('g5md-remwhich', (q, m) => H.strip(q.options[q.answer]).startsWith({ up: 'Round up', down: 'Drop', share: 'Share' }[m.kind]) ? '' : 'remainder');
  set('g5md-propmatch', q => q.pairs.every(p => ev(p[0]) === ev(p[1])) && new Set(q.pairs.map(p => ev(p[1]))).size === q.pairs.length ? '' : 'pairs');
  set('g5md-propfill', q => { const v = nums(q.fill), [a, b, , t] = v; return a * (t + q.answers[0]) === a * b && q.answers[1] === a * q.answers[0] && q.answers[2] === a * b ? '' : 'blanks'; });
  set('g5md-proptf', q => { const s = H.strip(q.q).match(/says (.*?) = (.*?)\. True/); return (ev(s[1]) === ev(s[2])) === q.answer ? '' : 'truth'; });
  set('g5md-proppick', q => { const want = ev(bold(q)); return picks(q, o => ev(o) === want); });
  /* ---- Ratios ---- */
  set('g5ra-tap', q => { const want = ratio(bold(q)), got = q.tiles.map(shapes); return got[q.answer].join() === want.join() && got.filter(g => sameRatio(g, want)).length === 1 ? '' : 'picture'; });
  set('g5ra-fill', (q, m) => { const c = shapes(q.fig); return (m.rev ? [c[1], c[0]] : c).join() === q.answers.join() && H.strip(q.q).includes(m.rev ? 'squares to circles' : 'circles to squares') ? '' : 'ratio'; });
  set('g5ra-story', q => { const t = H.strip(q.q), v = nums(t), first = t.match(/ratio of (.+?) to /)[1], second = t.match(/and \d+ (.+?) (in|at) /)[1]; return (first === second ? [v[1], v[0]] : [v[0], v[1]]).join() === q.answers.join() ? '' : 'order'; });
  set('g5ra-tf', (q, m) => (shapes(q.fig).join(':') === m.said) === q.answer ? '' : 'truth');
  set('g5ra-pick', q => { const want = ratio(bold(q)); return picks(q, o => sameRatio(ratio(o), want)); });
  set('g5ra-match', q => q.pairs.every(p => sameRatio(ratio(p[0]), ratio(p[1]))) ? '' : 'pairs');
  set('g5ra-tf2', q => { const v = H.strip(q.q).match(/(\d+):(\d+) = (\d+):(\d+)/).slice(1).map(Number); return sameRatio([v[0], v[1]], [v[2], v[3]]) === q.answer ? '' : 'truth'; });
  set('g5ra-ratefill', q => { const v = nums(q.fill); return q.answers[0] === v[1] * v[2] && q.answers[1] === v[1] * v[3] ? '' : 'table'; });
  set('g5ra-rateline', q => { const v = nums(q.q.match(/<b>.*?<\/b>.*<b>(.*?)<\/b>/)[0]); return q.answer === v[0] * v[1] ? '' : 'distance'; });
  set('g5ra-ratewhich', (q, m) => H.strip(q.options[q.answer]).includes(m.unit ? '÷' : '×') ? '' : 'operation');
  set('g5ra-ratestory', q => { const v = nums(q.q); return v[0] / v[1] !== v[2] / v[3] && (v[0] / v[1] > v[2] / v[3] ? 0 : 1) === q.answer ? '' : 'faster'; });
  set('g5ra-tablefill', q => { const v = nums(q.fill), b = v[0], a = v[3]; return q.answers[0] * b === a * v[1] && q.answers[1] * b === a * v[2] ? '' : 'table'; });
  set('g5ra-tablematch', q => { const r = nums(bold(q)); return q.pairs.every(p => H.num(p[1]) * r[1] === H.num(p[0]) * r[0]) ? '' : 'pairs'; });
  set('g5ra-tabletf', q => { const v = nums(q.q); return (v[2] * v[1] === v[0] * v[3]) === q.answer ? '' : 'truth'; });
  /* ---- Patterns and algebra ---- */
  set('g5al-fill', q => even(nums(q.fill).concat(q.answers)) ? '' : 'pattern');
  set('g5al-tap', (q, m) => { const v = m.seq, fits = b => { const ok = v.map((_, i) => i).filter(i => i !== b), d = (v[ok[1]] - v[ok[0]]) / (ok[1] - ok[0]); return ok.every(i => v[i] === v[ok[0]] + (i - ok[0]) * d); }; const c = v.map((_, i) => i).filter(fits); return c.length === 1 && c[0] === q.answer && q.tiles.map(t => H.num(H.strip(t))).join() === v.join() ? '' : 'odd one out'; });
  set('g5al-story', q => { const v = nums(q.q); return q.answer === v[0] + v[2] * (v[3] - v[1]) ? '' : 'savings'; });
  set('g5al-tf', (q, m) => { const v = nums(q.q.match(/<span class="math">(.*?)<\/span>/)[1]); return (v[3] + (v[1] - v[0]) === m.said) === q.answer && even(v) ? '' : 'truth'; });
  set('g5al-rulematch', q => q.pairs.every(p => nums(p[1]).every((v, i) => atN(p[0], i + 1) === v)) ? '' : 'pairs');
  set('g5al-rulefill', q => { const r = bold(q), n2 = nums(q.fill)[1]; return q.answers[0] === atN(r, 5) && q.answers[1] === atN(r, n2) ? '' : 'values'; });
  set('g5al-ruleline', q => { const b = [...q.q.matchAll(/<b>(.*?)<\/b>/g)].map(x => H.strip(x[1])); return q.answer === atN(b[0], nums(b[1])[0]) ? '' : 'term'; });
  set('g5al-ruletf', (q, m) => { const v = nums(q.q.match(/<span class="math">(.*?)<\/span>/)[1]); return v.every((x, i) => atN(m.said, i + 1) === x) === q.answer ? '' : 'truth'; });
  set('g5al-decfill', q => even(nums(q.fill).concat(q.answers)) ? '' : 'pattern');
  set('g5al-decline', q => { const v = nums(q.q.match(/<span class="math">(.*?)<\/span>/)[1]); return even(v) && H.close(q.answer, v[2] + (v[1] - v[0]), 1e-6) ? '' : 'next'; });
  set('g5al-dectf', (q, m) => { const v = nums(q.q.match(/<span class="math">(.*?)<\/span>/)[1]); return H.close(H.num(m.said), v[1] + (v[1] - v[0]), 1e-6) === q.answer ? '' : 'truth'; });
  set('g5al-evalmatch', (q, m) => q.pairs.every(p => atN(p[0], m.n) === H.num(p[1])) ? '' : 'pairs');
  set('g5al-evalfill', q => { const r = bold(q), ns = H.strip(q.fill.replace(/<br>/g, ' ')).match(/n = \d+/g).map(x => +x.slice(4)); return ns.every((n, i) => atN(r, n) === q.answers[i]) ? '' : 'values'; });
  set('g5al-evalstory', q => { const v = nums(q.q); return q.answer === v[0] + v[1] * v[4] ? '' : 'cost'; });
  set('g5al-evaltf', (q, m) => (m.k2 * m.n === m.said) === q.answer ? '' : 'truth');
  set('g5al-pick', (q, m) => picks(q, o => { const t = H.strip(o).split('='); return atN(t[0], m.x) === +t[1]; }));
  set('g5al-solvestory', (q, m) => { const v = nums(q.q); return (m.mul ? q.answer * v[0] === v[1] : q.answer + v[0] === v[1]) ? '' : 'solution'; });
  set('g5al-which', (q, m) => H.strip(q.options[q.answer]) === { add: 'Subtract ', sub: 'Add ', mul: 'Divide ' }[m.t] + (m.t === 'add' ? m.a + ' from both sides' : m.t === 'sub' ? m.a + ' to both sides' : 'both sides by ' + m.a) ? '' : 'inverse');
  set('g5al-solvetf', (q, m) => { const v = nums(q.q); return (m.said - v[0] === v[1]) === q.answer ? '' : 'truth'; });
  set('g5al-ineqpick', (q, m) => picks(q, o => (m.lt ? H.num(o) + m.a < m.b : H.num(o) + m.a > m.b)));
  set('g5al-ineqline', (q, m) => (m.lt ? q.answer + m.a < m.b && q.answer + 1 + m.a >= m.b : q.answer + m.a > m.b && q.answer - 1 + m.a <= m.b) ? '' : 'boundary');
  set('g5al-ineqtf', (q, m) => (m.said + m.a < m.b && m.said + 1 + m.a >= m.b) === q.answer ? '' : 'truth');
  set('g5al-codefill', (q, m) => { let t = m.s; return q.answers.every(v => (t += m.a) === v) ? '' : 'trace'; });
  set('g5al-codetf', (q, m) => { const c = H.strip(q.fig), s = +c.match(/total = (\d+)/)[1], r = +c.match(/repeat (\d+)/)[1], a = +c.match(/total \+ (\d+)/)[1]; let t = s; for (let i = 0; i < r; i++) t += a; return (t === m.said) === q.answer ? '' : 'truth'; });
  set('g5al-codewhich', (q, m) => m.s + m.a * nums(q.options[q.answer])[0] === m.T ? '' : 'repeats');
  /* ---- Data and probability ---- */
  const bars = svg => [...String(svg).matchAll(/data-hit="(\d+)" aria-label="([^:]+): (\d+)"/g)].map(x => ({ i: +x[1], name: x[2], v: +x[3] }));
  const median = d => { const s = d.slice().sort((a, b) => a - b); return s[(s.length - 1) / 2]; };
  set('g5da-pick', q => picks(q, o => /at random|Every 10th/.test(H.strip(o))));
  set('g5da-tf', (q, m) => /at random from the whole/.test(m.plan) === q.answer ? '' : 'truth');
  set('g5da-match', q => { const means = { Population: 'Everyone', Sample: 'The group you actually ask', 'Biased sample': 'leaves some groups out', 'Random sample': 'same chance' }; return q.pairs.every(p => H.strip(p[1]).includes(means[H.strip(p[0])])) ? '' : 'pairs'; });
  set('g5da-story', q => { const v = nums(q.q); return q.answer === v[1] && v[1] < v[0] ? '' : 'sample'; });
  set('g5da-relfill', q => { const v = nums(q.fill); return q.answers.every(a => H.close(a, v[0] * 100 / v[1])) ? '' : 'percent'; });
  set('g5da-reltap', q => { const v = nums(q.q), want = v[0] * 100 / v[1]; return filled(q.tiles[q.answer]) === want && q.tiles.filter(t => filled(t) === want).length === 1 ? '' : 'grid'; });
  set('g5da-relstory', q => { const v = nums(q.q), a = v[1] / v[2], b = v[4] / v[5]; return a !== b && (a > b ? 0 : 1) === q.answer ? '' : 'room'; });
  set('g5da-reltf', q => { const v = nums(q.q); return H.close(v[0] * 100 / v[1], v[2]) === q.answer ? '' : 'truth'; });
  set('g5da-tap', q => { const b = bars(q.pic), most = bold(q).startsWith('most'), want = (most ? Math.max : Math.min)(...b.map(x => x.v)); return b.filter(x => x.v === want).length === 1 && String(b.find(x => x.v === want).i) === q.answer ? '' : 'bar'; });
  set('g5da-fill', (q, m) => q.answers.slice(0, 3).join() === m.parts.join() && q.answers[3] === m.parts.reduce((a, b) => a + b, 0) && H.strip(q.fig).includes(String(m.parts[0])) ? '' : 'parts');
  set('g5da-graphtf', (q, m) => !q.answer && m.b < 3 * m.a ? '' : 'truth');
  set('g5da-order', q => { const b = bars(q.fig), v = q.items.map(n => b.find(x => x.name === n).v); return v.every((x, i) => !i || x < v[i - 1]) ? '' : 'order'; });
  set('g5da-mmmfill', q => { const d = nums(q.q.match(/<span class="math">(.*?)<\/span>/)[1]), s = d.reduce((a, b) => a + b, 0); return q.answers[0] === s && q.answers[1] === s && q.answers[2] === s / d.length ? '' : 'mean'; });
  set('g5da-mmmtap', q => { const d = q.tiles.map(t => H.num(H.strip(t))); return d[q.answer] === median(d) ? '' : 'median'; });
  set('g5da-mmmtf', (q, m) => { const d = nums(q.q.match(/<span class="math">(.*?)<\/span>/)[1]); return (median(d) === m.said) === q.answer ? '' : 'truth'; });
  set('g5da-mmmmatch', q => { const d = nums(q.q.match(/<span class="math">(.*?)<\/span>/)[1]), mean = d.reduce((a, b) => a + b, 0) / d.length, cnt = {}; d.forEach(x => { cnt[x] = (cnt[x] || 0) + 1; }); const mode = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0], want = { Mean: mean, Median: median(d), Mode: mode }; return q.pairs.every(p => want[p[0]] === H.num(p[1])) ? '' : 'pairs'; });
  set('g5da-probtap', q => { const want = frac(q.q.match(/<b>(\d+\/\d+)<\/b>/)[1]), got = q.tiles.map(t => (t.match(/#d64545/g) || []).length / (t.match(/<circle/g) || []).length); return H.close(got[q.answer], want) && got.filter(g => H.close(g, want)).length === 1 ? '' : 'bag'; });
  set('g5da-probline', q => { const v = nums(q.q); return H.close(q.answer, v[1] / v[0], 1e-6) ? '' : 'probability'; });
  set('g5da-probpick', q => { const c = nums(q.q).slice(0, 4), tot = c.reduce((a, b) => a + b, 0); return picks(q, (o, j) => c[j] / tot > 1 / 4); });
  set('g5da-probtf', (q, m) => { const sh = (q.fig.match(/<path[^>]*fill:var\(--strand\)/g) || []).length, all = (q.fig.match(/<path/g) || []).length; return H.close(frac(m.said), sh / all) === q.answer ? '' : 'truth'; });
  set('g5da-expfill', q => { const r = H.num(bold(q)); return q.answers[0] === r / 6 && q.answers[1] === r / 2 ? '' : 'expected'; });
  set('g5da-exptf', q => q.answer === false && H.strip(q.why.options[q.why.answer]).includes('1/2') ? '' : 'truth');
  set('g5da-expstory', q => { const v = nums(q.q); return q.answers[0] === v[2] && nums(q.fill)[0] === v[0] ? '' : 'experimental'; });
  set('g5da-expmatch', q => q.pairs.every(p => { const t = H.strip(p[0]), w = /coin/.test(t) ? 1 / 2 : /7 on a 6/.test(t) ? 0 : /die/.test(t) ? 1 / 6 : nums(t)[0] / 4; return H.close(w, H.strip(p[1]) === '0' ? 0 : frac(p[1])); }) ? '' : 'pairs');
  /* ---- Shapes and grids ---- */
  const kindBySides = s => s[0] === s[1] && s[1] === s[2] ? 'equilateral' : s[0] === s[1] || s[1] === s[2] || s[0] === s[2] ? 'isosceles' : 'scalene';
  const dims = t => nums(t).slice(0, 2).sort((a, b) => a - b).join();
  /* tappable grid points: one square is 30 px, (0, 0) is at x 40, y 310 */
  const gridPts = svg => Object.fromEntries([...String(svg).matchAll(/data-hit="(\w+)"[^>]*><circle cx="([\d.]+)" cy="([\d.]+)"/g)].map(x => [x[1], [(+x[2] - 40) / 30, (310 - +x[3]) / 30]]));
  const move = (p, t) => { const m = t.match(/translated (\d+) right and (\d+) up/i); return m ? [p[0] + +m[1], p[1] + +m[2]] : /line x = 5/.test(t) ? [10 - p[0], p[1]] : /line y = 5/.test(t) ? [p[0], 10 - p[1]] : null; };
  const pointP = t => H.strip(t).match(/P\s*\((\d+), (\d+)\)/).slice(1).map(Number);
  set('g5sg-trimatch', q => q.pairs.every(p => kindBySides(nums(p[0])) === p[1]) ? '' : 'pairs');
  set('g5sg-tritap', q => { const k = q.tiles.map(t => kindBySides(nums(t.match(/aria-label="Triangle with sides ([^"]+)"/)[1]))); return k[q.answer] === bold(q) && k.filter(x => x === bold(q)).length === 1 ? '' : 'triangle'; });
  set('g5sg-tritf', q => { const a = nums(q.q).slice(0, 3); return a[0] + a[1] + a[2] === 180 && (Math.max(...a) < 90) === q.answer ? '' : 'truth'; });
  set('g5sg-trifill', q => { const v = nums(q.fill); return v[0] + v[1] + q.answers[0] === 180 ? '' : 'angle'; });
  set('g5sg-congpick', q => { const want = dims(bold(q)); return picks(q, o => dims(o) === want); });
  set('g5sg-congtap', q => { const want = dims(q.fig.match(/aria-label="([^"]+)"/)[1]), got = q.tiles.map(t => dims(t.match(/aria-label="([^"]+)"/)[1])); return got[q.answer] === want && got.filter(g => g === want).length === 1 ? '' : 'rectangle'; });
  set('g5sg-congtf', (q, m) => !q.answer && dims(m.p[0]) !== dims(m.p[1]) && m.p[0][0] * m.p[0][1] === m.p[1][0] * m.p[1][1] ? '' : 'truth');
  const frontOf = h => [0, 1, 2].map(x => Math.max(...h.map(r => r[x])));
  set('g5sg-viewfill', (q, m) => q.answers.join() === frontOf(m.h).join() ? '' : 'front view');
  set('g5sg-viewtap', (q, m) => { const want = frontOf(m.h).join(', '), got = q.tiles.map(t => t.match(/columns ([\d, ]+)"/)[1]); return got[q.answer] === want && got.filter(g => g === want).length === 1 ? '' : 'front view'; });
  set('g5sg-viewtf', (q, m) => (m.h.flat().reduce((a, b) => a + b, 0) === m.said) === q.answer ? '' : 'truth');
  set('g5sg-coordtap', q => { const want = nums(bold(q)).join(), pts = gridPts(q.pic); return pts[q.answer] && pts[q.answer].join() === want && Object.values(pts).filter(p => p.join() === want).length === 1 ? '' : 'point'; });
  set('g5sg-coordfill', (q, m) => q.answers.join() === [m.x, m.y].join() ? '' : 'coordinates');
  set('g5sg-coordtf', (q, m) => (m.said.join() === [m.x, m.y].join()) === q.answer ? '' : 'truth');
  set('g5sg-transfill', q => (move(pointP(q.q), H.strip(q.q)) || []).join() === q.answers.join() ? '' : 'image');
  set('g5sg-transtap', q => { const want = move(pointP(q.q), H.strip(q.q)).join(), pts = gridPts(q.pic); return pts[q.answer] && pts[q.answer].join() === want && Object.values(pts).filter(p => p.join() === want).length === 1 ? '' : 'image'; });
  set('g5sg-transtf', (q, m) => (move(pointP(q.q), H.strip(q.q)).join() === m.said.join()) === q.answer ? '' : 'truth');
  set('g5sg-transmatch', q => { const p = nums(q.q).slice(0, 2); return q.pairs.every(x => move(p, H.strip(x[0])).join() === nums(x[1]).join()) ? '' : 'pairs'; });
  /* ---- Measurement ---- */
  const BEST = { 'the length of an ant': 'mm', 'the height of a door': 'm', 'the width of a book': 'cm', 'the distance between two cities': 'km', 'the mass of a paper clip': 'g', 'the mass of a dog': 'kg', 'the water in a bathtub': 'L', 'the medicine in a spoon': 'mL' };
  const KIND = { mm: 'length', cm: 'length', m: 'length', km: 'length', g: 'mass', kg: 'mass', mL: 'capacity', L: 'capacity' };
  const TO = { km: ['m', 1000], m: ['cm', 100], cm: ['mm', 10], kg: ['g', 1000], L: ['mL', 1000] };
  /* "3.5 kg = 3500 g": [amount, from unit, amount, to unit] */
  const amt = t => { const m = H.strip(t).match(/^([\d. ]+)\s*(km|kg|mL|mm|cm|m|g|L)$/); return m ? [H.num(m[1]), m[2]] : null; };
  set('g5me-unitmatch', q => q.pairs.every(p => BEST[H.strip(p[0]).toLowerCase()] === p[1]) ? '' : 'pairs');
  set('g5me-unitpick', (q, m) => picks(q, o => KIND[H.strip(o)] === m.kind));
  set('g5me-unittf', (q, m) => (BEST[m.thing] === m.said) === q.answer ? '' : 'truth');
  set('g5me-order', q => { const a = q.items.map(amt), units = a.map(x => x[1]), small = units.find(u => units.some(v => TO[v] && TO[v][0] === u)); const inSmall = x => x[1] === small ? x[0] : x[0] * TO[x[1]][1]; const v = a.map(inSmall); return v.every((x, i) => !i || x > v[i - 1] + 1e-9) ? '' : 'order'; });
  set('g5me-convfill', q => { const lines = q.fill.split('<br>').map(l => H.strip(l).match(/([\d.]+) (\w+) = \[\[\]\] (\w+)/)); return lines.every((l, i) => TO[l[2]][0] === l[3] && H.close(q.answers[i], +l[1] * TO[l[2]][1], 1e-6)) ? '' : 'conversion'; });
  set('g5me-convmatch', q => q.pairs.every(p => { const a = amt(p[0]), b = amt(p[1]); return TO[a[1]][0] === b[1] && H.close(a[0] * TO[a[1]][1], b[0], 1e-6); }) ? '' : 'pairs');
  set('g5me-convline', q => { const a = amt(bold(q)); return TO[a[1]][0] === q.unit && H.close(q.answer, a[0] * TO[a[1]][1], 1e-6) ? '' : 'mark'; });
  set('g5me-convtf', q => { const t = H.strip(q.q).match(/([\d.]+) (\w+) = ([\d ]+) (\w+)\./); return (TO[t[2]][0] === t[4] && H.num(t[3]) === +t[1] * TO[t[2]][1]) === q.answer ? '' : 'truth'; });
  const angKind = t => t < 90 ? 'acute' : t === 90 ? 'right' : t < 180 ? 'obtuse' : 'straight';
  set('g5me-angtap', (q, m) => angKind(m.set[q.answer]) === bold(q) && m.set.filter(t => angKind(t) === bold(q)).length === 1 ? '' : 'angle');
  set('g5me-angpick', (q, m) => picks(q, o => angKind(H.num(o)) === m.want));
  set('g5me-angtf', (q, m) => (m.t === m.said) === q.answer ? '' : 'truth');
  set('g5me-areafill', (q, m) => { const lab = q.fig.match(/base (\d+) cm and height (\d+) cm/); return +lab[1] === q.answers[0] && +lab[2] === q.answers[1] && q.answers[2] === q.answers[0] * q.answers[1] / (m.tri ? 2 : 1) ? '' : 'area'; });
  set('g5me-areamatch', q => q.pairs.every(p => { const v = nums(p[0]); return v[0] * v[1] / (/Triangle/.test(p[0]) ? 2 : 1) === H.num(p[1]); }) ? '' : 'pairs');
  set('g5me-areatf', q => { const v = nums(q.q); return (v[0] * v[1] === v[3]) === q.answer ? '' : 'truth'; });
  set('g5me-areawhich', (q, m) => { const v = nums(q.q); return ev(q.options[q.answer]) === v[0] * v[1] / (m.tri ? 2 : 1) ? '' : 'formula'; });
  const rectOf = svg => String(svg).match(/Rectangle (\d+) cm by (\d+) cm/).slice(1).map(Number);
  set('g5me-perimfill', q => { const [w, h] = rectOf(q.fig); return q.answers[0] === 2 * (w + h) && q.answers[1] === w * h ? '' : 'rectangle'; });
  set('g5me-perimtap', q => { const P = H.num(bold(q)), got = q.tiles.map(t => { const [w, h] = rectOf(t); return 2 * (w + h); }); return got[q.answer] === P && got.filter(g => g === P).length === 1 ? '' : 'rectangle'; });
  set('g5me-perimtf', q => { const v = nums(q.q); return (2 * (v[0] + v[1]) === v[2]) === q.answer ? '' : 'truth'; });
  set('g5me-perimstory', q => { const v = nums(q.q); return q.answer === (/square metres/.test(q.q) ? v[0] * v[1] : 2 * (v[0] + v[1])) ? '' : 'garden'; });
  /* ---- Money ---- */
  const dollars = t => [...H.strip(t).matchAll(/\$\s?(\d+(?:\.\d\d)?)/g)].map(x => +x[1]);
  const MEANS = { 'Credit card': 'Borrowed', 'Debit card': 'your bank account', Cash: 'Coins and bills', 'E-transfer': 'one bank account to another', Debt: 'owe', Interest: 'borrowing', Savings: 'put aside', Credit: 'paying later' };
  const LEVEL = { 'Local parks and libraries': 'Municipal', 'Garbage pickup': 'Municipal', 'Fire services in your town': 'Municipal', 'Hospitals in Ontario': 'Provincial', 'Public schools in Ontario': 'Provincial', Passports: 'Federal', 'National parks like Banff': 'Federal', 'The Canadian Armed Forces': 'Federal' };
  const NEED = ['Rent', 'Groceries', 'A winter coat', 'Bus fare to school'];
  /* Canadian cash rounding to the nearest 5 cents (amounts in cents) */
  const cash5 = c => { const r = c % 5; return r <= 2 ? c - r : c + 5 - r; };
  set('g5mo-paymatch', q => q.pairs.every(p => H.strip(p[1]).includes(MEANS[p[0]])) ? '' : 'pairs');
  set('g5mo-paypick', q => picks(q, o => H.strip(o) !== 'Credit card'));
  set('g5mo-paytf', (q, m) => (m.way === 'a debit card') === q.answer ? '' : 'truth');
  set('g5mo-taxfill', q => { const p = dollars(q.fill)[0], t = Math.round(p * 13) / 100; return H.close(q.answers[0], t, 1e-6) && H.close(q.answers[1], p + t, 1e-6) ? '' : 'receipt'; });
  /* cash change: the total rounds to the nearest 5 cents first, so the change is always a multiple of 5 cents */
  const cashChange = (given, total, answer) => { const want = given - cash5(total), got = Math.round(answer * 100); return got % 5 ? 'cash change ' + got + ' cents is not a multiple of 5 cents' : got === want ? '' : 'change'; };
  set('g5mo-taxstory', q => { const v = dollars(q.q).map(x => Math.round(x * 100)); return cashChange(v[2], v[0] + v[1], q.answer); });
  set('g5mo-taxchange', (q, m) => { const v = dollars(q.q).map(x => Math.round(x * 100)); return v[0] === m.p && v[1] === m.g ? cashChange(m.g, m.p, q.answer) : 'prices'; });
  set('g5mo-taxtf', (q, m) => (cash5(m.p) === m.said) === q.answer ? '' : 'truth');
  set('g5mo-taxbuild', (q, m) => q.tool === 'coins' && Math.abs(dollars(q.q)[0] * 100 - m.p) < 1e-6 && q.answer === cash5(m.p) ? '' : 'cash');
  set('g5mo-taxwhich', q => H.strip(q.options[q.answer]).startsWith('Find 13%') ? '' : 'method');
  set('g5mo-budfill', q => { const v = nums(q.fill); return q.answers[0] === v[0] - v[1] - v[2] ? '' : 'wants'; });
  set('g5mo-budstory', q => { const v = dollars(q.q); return q.answer * v[0] === v[1] ? '' : 'weeks'; });
  set('g5mo-budtf', q => { const v = dollars(q.q); return (v[1] + v[2] + v[3] === v[0]) === q.answer ? '' : 'truth'; });
  set('g5mo-budpick', q => picks(q, o => NEED.includes(H.strip(o))));
  set('g5mo-crmatch', q => q.pairs.every(p => H.strip(p[1]).includes(MEANS[p[0]])) ? '' : 'pairs');
  set('g5mo-crfill', q => { const v = nums(q.fill); return H.close(q.answers[0], v[1] / 100) && H.close(q.answers[1], v[1] * v[2] / 100) ? '' : 'interest'; });
  set('g5mo-crtf', q => { const v = nums(q.q); return H.close(v[0] * v[1] / 100, v[2]) === q.answer ? '' : 'truth'; });
  set('g5mo-crstory', q => { const v = dollars(q.q); return q.answer * v[1] === v[0] ? '' : 'months'; });
  set('g5mo-unitfill', q => { const n = nums(q.q)[0], t = dollars(q.q)[0]; return H.close(q.answers[0] * n, t, 1e-6) ? '' : 'unit price'; });
  set('g5mo-unittap', q => { const r = q.tiles.map(t => { const v = nums(t); return v[1] / v[0]; }), best = Math.min(...r); return H.close(r[q.answer], best) && r.filter(x => H.close(x, best)).length === 1 ? '' : 'best value'; });
  set('g5mo-unittf', q => { const v = nums(q.q); return (v[1] / v[0] < v[3] / v[2]) === q.answer ? '' : 'truth'; });
  set('g5mo-unitwhich', q => /^\$[\d.]+ ÷ \d+$/.test(H.strip(q.options[q.answer])) ? '' : 'method');
  set('g5mo-govmatch', q => q.pairs.every(p => LEVEL[p[0]] === p[1]) ? '' : 'pairs');
  set('g5mo-govpick', (q, m) => picks(q, o => LEVEL[H.strip(o)] === m.lev));
  set('g5mo-govtf', (q, m) => (LEVEL[m.service] === m.said) === q.answer ? '' : 'truth');
})(window.__verify, window.__H);
