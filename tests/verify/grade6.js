/* Answer checks for Grade 6 question shapes. Each check gets (q, q.meta, helpers) and returns
   an error message, or '' when the answer is right. Work the answer out here independently:
   never copy the site's own calculation. */
(function (V, H) {
  const set = (k, fn) => { if (V[k]) throw new Error('Two answer checks share the key ' + k); V[k] = fn; };
  const bold = q => H.strip((q.q.match(/<b>(.*?)<\/b>/) || [])[1] || '');
  const same = (a, b) => a.slice().sort().join() === b.slice().sort().join();
  const int = t => +H.strip(t).replace(/[−–]/g, '-').replace(/\s/g, '');
  const nums = t => (H.strip(t).replace(/[−–]/g, '-').replace(/(\d) (?=\d{3}\b)/g, '$1').match(/-?\d+(\.\d+)?/g) || []).map(Number);
  const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
  const prod = a => a.reduce((x, y) => x * y, 1);
  const picks = (opts, test) => opts.map((x, j) => (test(x) ? j : -1)).filter(j => j >= 0);
  const tf = (truth, q) => (truth === q.answer ? '' : 'truth');
  const val = t => { const s = H.strip(t).replace(/[−–]/g, '-').replace(/\s/g, ''); const f = s.match(/^(-?)(\d+)\/(\d+)$/); return f ? (f[1] ? -1 : 1) * f[2] / f[3] : +s; };
  const bolds = q => (q.q.match(/<b>(.*?)<\/b>/g) || []).map(b => H.strip(b));
  const ascending = v => v.every((x, i) => !i || x > v[i - 1]);
  const digitAt = (k, i) => Math.floor(k / Math.pow(10, 2 - i)) % 10; /* k in thousandths, i = 0 tenths, 1 hundredths, 2 thousandths */

  /* ---- Big numbers, integers and factors ---- */
  set('g6-value-tap', (q, m) => { const j = [0, 1, 2, 3, 4, 5].filter(i => H.placeVal(m.n, i) === m.val); return j.length === 1 && j[0] === q.answer && q.tiles.join('') === String(m.n) ? '' : 'digit'; });
  set('g6-value-num', (q, m) => H.placeVal(m.n, m.i) === q.answer && (q.q.match(/<u>(\d)<\/u>/) || [])[1] === String(m.n)[m.i] ? '' : 'value');
  set('g6-value-tf', (q, m) => { const real = H.placeVal(m.n, m.i); return tf(real === m.said, q) || (H.strip(q.why.options[q.why.answer]).replace(/\s/g, '').includes('worth' + real) ? '' : 'reason'); });
  set('g6-value-match', (q, m) => m.items.every((t, j) => H.placeVal(t[0], t[1]) === H.num(q.pairs[j][1])) ? '' : 'pairs');
  set('g6-words-match', q => q.pairs.every(p => H.fromWords(p[1]) === H.num(p[0])) ? '' : 'pairs');
  set('g6-words-fill', (q, m) => q.answers[0] * 1000 + q.answers[1] === m.n && H.fromWords(bold(q)) === m.n ? '' : 'periods');
  set('g6-words-tf', (q, m) => (H.fromWords(bold(q)) === m.n ? tf(m.said === m.n, q) : 'words'));
  set('g6-int-line', q => (int(bold(q)) === q.answer ? '' : 'point'));
  set('g6-int-ctx', (q, m) => ((/below|loss/.test(q.q) ? -m.n : m.n) === q.answer ? '' : 'sign'));
  set('g6-int-tf', (q, m) => tf(m.v === m.said, q));
  set('g6-int-pick', (q, m) => (same(picks(m.opts, y => y < m.x), q.answer) ? '' : 'picks'));
  set('g6-cmp-order', q => { const v = q.items.map(int); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
  set('g6-cmp-tf', (q, m) => tf(m.a > m.b, q));
  set('g6-cmp-story', (q, m) => (q.answer === (m.a < m.b ? 0 : 1) ? '' : 'colder'));
  set('g6-cmp-pick', (q, m) => (same(picks(m.opts, y => y > m.x), q.answer) ? '' : 'picks'));
  set('g6-div-pick', (q, m) => (same(picks(m.opts, x => x % m.d === 0), q.answer) ? '' : 'picks'));
  set('g6-div-tf', (q, m) => tf(m.n % m.d === 0, q));
  set('g6-div-story', (q, m) => (q.answer === (m.n % m.d === 0 ? 0 : 1) ? '' : 'teams'));
  set('g6-prime-pick', (q, m) => (same(picks(m.opts, isPrime), q.answer) ? '' : 'primes'));
  set('g6-prime-tap', (q, m) => { const j = q.tiles.map(Number).map((x, i) => (m.n % x === 0 ? i : -1)).filter(i => i >= 0); return j.length === 1 && j[0] === q.answer ? '' : 'factor'; });
  set('g6-prime-tf', (q, m) => tf(isPrime(m.n), q));
  set('g6-pf-fill', (q, m) => { const v = nums(q.fill.replace('[[]]', '')); return v[0] === m.n && prod(v.slice(1)) * q.answers[0] === m.n && isPrime(q.answers[0]) && v.slice(1).every(isPrime) ? '' : 'factor'; });
  set('g6-pf-tf', (q, m) => tf(prod(m.said) === m.n && m.said.every(isPrime), q));
  set('g6-pf-match', q => (q.pairs.every(p => { const f = nums(p[1]); return prod(f) === +p[0] && f.every(isPrime); }) ? '' : 'pairs'));

  /* ---- Decimals to thousandths ---- */
  set('g6-dval-tap', (q, m) => (q.answer === m.i + 1 && +q.tiles[q.answer] === digitAt(m.n, m.i) && q.tiles.join('') === String(m.n) ? '' : 'digit'));
  set('g6-dval-num', (q, m) => (H.close(q.answer, digitAt(m.n, m.i) / Math.pow(10, m.i + 1)) ? '' : 'value'));
  set('g6-dval-tf', (q, m) => tf(digitAt(m.n, m.i) * Math.pow(10, 2 - m.i) === m.said, q));
  set('g6-dval-match', (q, m) => (m.items.every((t, j) => H.close(H.num(q.pairs[j][1]), digitAt(t[0], t[1]) / Math.pow(10, t[1] + 1))) ? '' : 'pairs'));
  set('g6-dcmp-order', q => (ascending(q.items.map(val)) ? '' : 'order'));
  set('g6-dcmp-tf', (q, m) => tf(m.a > m.b, q));
  set('g6-dcmp-line', q => (H.close(q.answer, val(bold(q))) ? '' : 'point'));
  set('g6-dcmp-pick', (q, m) => (same(picks(m.opts, y => y > m.x), q.answer) ? '' : 'picks'));
  set('g6-round-num', (q, m) => (H.close(q.answer, Math.floor((m.n + 50) / 100) / 10) ? '' : 'rounded'));
  set('g6-round-tf', (q, m) => tf(Math.floor((m.n + 50) / 100) * 100 === m.said, q));
  set('g6-round-pick', (q, m) => (same(picks(m.opts, y => Math.floor((y + 5) / 10) === m.t), q.answer) ? '' : 'picks'));
  set('g6-frac-match', (q, m) => (m.fs.every((f, j) => H.close(H.num(q.pairs[j][1]), f[0] / f[1])) ? '' : 'pairs'));
  set('g6-frac-fill', (q, m) => (q.answers[0] * m.d === m.n * 100 && H.close(q.answers[1], m.n / m.d) ? '' : 'blanks'));
  set('g6-frac-tf', (q, m) => tf(H.close(m.said, m.n / m.d), q));
  set('g6-dord-order', q => (ascending(q.items.map(val)) ? '' : 'order'));
  set('g6-dord-line', (q, m) => (H.close(q.answer, m.n / m.d) && H.close(val(bold(q)), m.n / m.d) ? '' : 'point'));
  set('g6-dord-tf', q => { const b = bolds(q).map(val); return tf(b[0] > b[1], q); });

  /* ---- Fractions ---- */
  const frac = s => H.strip(s).match(/\d+/g).map(Number); /* "a/b" or "w × a/b" as plain text */
  const eqF = (a, b) => a[0] * b[1] === a[1] * b[0];
  const sumF = (a, b, sign) => [a[0] * b[1] + sign * b[0] * a[1], a[1] * b[1]];
  set('g6-eq-match', q => (q.pairs.every(p => eqF(frac(p[0]), frac(p[1]))) ? '' : 'pairs'));
  set('g6-eq-fill', (q, m) => { const v = nums(q.fill.replace(/\[\[\]\]/g, '')); return q.answers[0] * m.d === m.n * v[2] && v[3] * m.d === m.n * q.answers[1] ? '' : 'blanks'; });
  set('g6-eq-pick', q => { const b = frac(bold(q)); return same(picks(q.options, o => eqF(frac(o), b)), q.answer) ? '' : 'picks'; });
  set('g6-eq-tf', (q, m) => tf(eqF(m.a, m.b), q));
  set('g6-add-fill', (q, m) => (eqF([q.answers[0], m.L], sumF(m.a, m.b, 1)) && q.fill.endsWith('/' + m.L) ? '' : 'sum'));
  set('g6-add-tf', (q, m) => tf(eqF(m.said, sumF(m.a, m.b, 1)), q));
  set('g6-add-line', (q, m) => (H.close(q.answer, m.a[0] / m.a[1] + m.b[0] / m.b[1], 1e-9) ? '' : 'point'));
  set('g6-sub-fill', (q, m) => (eqF([q.answers[0], m.L], sumF(m.a, m.b, -1)) && q.answers[0] > 0 ? '' : 'difference'));
  set('g6-sub-tf', (q, m) => tf(eqF(m.said, sumF(m.a, m.b, -1)), q));
  set('g6-mult-fill', (q, m) => (q.answers[0] === m.w * m.n ? '' : 'product'));
  set('g6-mult-of', (q, m) => (q.answer * m.d === m.n * m.tot ? '' : 'part'));
  set('g6-mult-tf', (q, m) => tf(eqF(m.said, [m.w * m.n, m.d]), q));
  set('g6-mult-match', q => (q.pairs.every(p => { const l = frac(p[0]), r = frac(p[1]); return eqF([l[0] * l[1], l[2]], r); }) ? '' : 'pairs'));
  set('g6-fdiv-num', (q, m) => (q.answer === m.w * m.d ? '' : 'pieces'));
  set('g6-fdiv-tf', (q, m) => tf(H.close(m.said, m.w * m.d), q));
  set('g6-fdiv-pick', (q, m) => (same(picks(q.options, o => { const n = frac(o); return n[0] * n[2] / n[1] === m.target; }), q.answer) ? '' : 'picks'));
  set('g6-fdiv-match', q => (q.pairs.every(p => { const n = frac(p[0]); return n[0] * n[2] / n[1] === +p[1]; }) ? '' : 'pairs'));

  /* ---- Decimal calculations ---- */
  const est = (a, b) => Math.round(a) + Math.round(b);
  set('g6-est-line', (q, m) => (q.answer === est(m.a / 100, m.b / 100) ? '' : 'estimate'));
  set('g6-est-tf', (q, m) => tf(m.said === est(m.a / 100, m.b / 100), q));
  set('g6-est-story', (q, m) => (q.answer === (m.p.reduce((x, y) => x + y, 0) <= m.budget * 100 ? 0 : 1) ? '' : 'enough'));
  set('g6-dops-way', q => { const t = H.strip(q.q), op = /in all/.test(t) ? 'Add' : /left\?/.test(t) ? 'Subtract' : /How many cups/.test(t) ? 'Divide' : ''; return q.options[q.answer] === op ? '' : 'operation'; });
  set('g6-as-story', (q, m) => { const t = H.strip(q.q), sign = /in all/.test(t) ? 1 : /left\?/.test(t) ? -1 : 0; return sign && H.close(q.answer, (m.a + sign * m.b) / 100) ? '' : 'answer'; });
  set('g6-as-tf', (q, m) => tf(m.said === m.a + m.b, q));
  set('g6-mul-fill', (q, m) => (q.answers[0] === m.w * m.t && H.close(q.answers[1], m.w * m.t / 10) ? '' : 'blanks'));
  set('g6-mul-num', (q, m) => (H.close(q.answer, m.w * m.t / 10) ? '' : 'product'));
  set('g6-mul-tf', (q, m) => tf(m.said === m.w * m.t * 100, q));
  set('g6-mul-match', q => (q.pairs.every(p => { const l = nums(p[0]); return H.close(l[0] * l[1], H.num(p[1])); }) ? '' : 'pairs'));
  set('g6-dvt-fill', (q, m) => (q.answers[0] === m.w * 10 && H.close(q.answers[1] * m.t / 10, m.w) ? '' : 'blanks'));
  set('g6-dvt-tf', (q, m) => tf(m.said === m.w * 2, q));
  set('g6-dvw-story', (q, m) => (H.close(q.answer * m.n, m.total / 100) ? '' : 'share'));
  set('g6-dvw-tf', (q, m) => tf(m.said * m.n === m.k10, q));
  set('g6-dvw-match', q => (q.pairs.every(p => { const l = nums(p[0]); return H.close(l[0] / l[1], H.num(p[1])); }) ? '' : 'pairs'));
  set('g6-multi-order', q => (/^Multiply/.test(q.items[0]) && /^Add/.test(q.items[1]) && /^Subtract/.test(q.items[2]) ? '' : 'order'));
  set('g6-multi-fill', (q, m) => (H.close(q.answers[0], m.n * m.p / 100) && H.close(q.answers[0] + q.answers[1], m.pay / 100) ? '' : 'blanks'));
  set('g6-multi-tf', (q, m) => tf(m.said === m.pay - m.n * m.p - m.extra, q));

  /* ---- Ratios and percents ---- */
  const ratio = t => H.strip(t).split(':').map(Number);
  const eqR = (r, a, b) => r[0] * b === r[1] * a;
  const pctVal = t => { const s = H.strip(t); return /%$/.test(s) ? parseFloat(s) / 100 : val(s); };
  set('g6-rat-fill', (q, m) => { const v = nums(q.fill.replace(/\[\[\]\]/g, '')); return eqR([v[2], q.answers[0]], m.a, m.b) && eqR([q.answers[1], v[3]], m.a, m.b) ? '' : 'blanks'; });
  set('g6-rat-tf', (q, m) => tf(eqR([m.x, m.y], m.a, m.b), q));
  set('g6-rat-pick', q => { const r = ratio(bold(q)); return same(picks(q.options, o => eqR(ratio(o), r[0], r[1])), q.answer) ? '' : 'picks'; });
  set('g6-part-match', (q, m) => { const want = [[m.a, m.b], [m.b, m.a], [m.a, m.a + m.b]]; return q.pairs.every((p, j) => { const r = ratio(p[1]); return r[0] === want[j][0] && r[1] === want[j][1]; }) && / to all$/.test(q.pairs[2][0]) ? '' : 'pairs'; });
  set('g6-part-tf', (q, m) => tf(m.said[0] === m.a && m.said[1] === m.a + m.b, q));
  set('g6-part-story', (q, m) => (q.answer * m.a === m.x * (m.a + m.b) ? '' : 'total'));
  set('g6-rate-line', (q, m) => (q.answer * m.n === m.tot ? '' : 'rate'));
  set('g6-rate-way', q => { const t = H.strip(q.q), op = /in 1 hour\?/.test(t) ? 'Divide' : /every hour/.test(t) ? 'Multiply' : ''; return q.options[q.answer] === op ? '' : 'operation'; });
  set('g6-rate-tf', (q, m) => tf(m.said * m.n === m.tot, q));
  set('g6-better-fill', (q, m) => (H.close(q.answers[0] * m.na, m.pa / 100) && H.close(q.answers[1] * m.nb, m.pb / 100) ? '' : 'unit prices'));
  set('g6-better-tf', (q, m) => tf(m.pb * m.na < m.pa * m.nb, q));
  set('g6-better-order', q => (ascending(q.items.map(i => { const v = nums(i); return v[1] / v[0]; })) ? '' : 'order'));
  set('g6-pct-line', (q, m) => (H.close(q.answer * 100, m.p * m.n) ? '' : 'point'));
  set('g6-pct-tf', (q, m) => tf(H.close(m.said * 100, m.p * m.n), q));
  set('g6-pct-story', (q, m) => (H.close(q.answer * 100, m.p * m.n) ? '' : 'saving'));
  set('g6-pct-pick', q => { const t = +bold(q); return same(picks(q.options, o => { const v = nums(o); return H.close(v[0] * v[1], t * 100); }), q.answer) ? '' : 'picks'; });
  set('g6-fdp-match', q => (q.pairs.every(p => { const f = frac(p[0]); return H.close(f[0] / f[1], pctVal(p[1])); }) ? '' : 'pairs'));
  set('g6-fdp-line', (q, m) => (H.close(q.answer * m.d, m.n * 100) ? '' : 'point'));
  set('g6-fdp-tf', (q, m) => tf(m.said * m.d === m.n * 100, q));
  set('g6-fdp-pick', (q, m) => (same(picks(q.options, o => H.close(pctVal(o), m.n / m.d)), q.answer) ? '' : 'picks'));

  /* ---- Patterns and algebra ---- */
  const rule = t => { const r = H.strip(t).match(/^(\d*)n(?: \+ (\d+))?$/); return r && [+(r[1] || 1), +(r[2] || 0)]; };
  const holds = (v, op, c) => ({ '<': v < c, '>': v > c, '≤': v <= c, '≥': v >= c })[op];
  const run = (s, lim, st) => { const out = []; for (let x = s; x < lim; x += st) out.push(x); return out; };
  const arith = t => t.every((x, i) => !i || x - t[i - 1] === t[1] - t[0]);
  set('g6-next-line', (q, m) => (arith(m.t) && q.answer === 2 * m.t[3] - m.t[2] ? '' : 'next term'));
  set('g6-next-fill', q => { const v = nums(q.fill.replace(/\[\[\]\]/g, '')); return arith([v[0], q.answers[0], v[1], q.answers[1], v[2]]) ? '' : 'missing terms'; });
  set('g6-next-tf', (q, m) => tf(arith(m.t) && m.said === m.t[0] + (m.n - 1) * (m.t[1] - m.t[0]), q));
  set('g6-rule-match', q => (q.pairs.every(p => { const r = rule(p[0]); return r && nums(p[1]).every((x, i) => x === r[0] * (i + 1) + r[1]); }) ? '' : 'pairs'));
  set('g6-rule-tf', (q, m) => tf(m.t.every((x, i) => x === m.rule[0] * (i + 1) + m.rule[1]), q));
  set('g6-rule-pick', (q, m) => (same(picks(q.options, o => (o - m.b) % m.m === 0 && o - m.b >= m.m), q.answer) ? '' : 'picks'));
  set('g6-eval-fill', (q, m) => (q.answers[0] === m.a * m.x && q.answers[1] === m.a * m.x + m.b ? '' : 'blanks'));
  set('g6-eval-tf', (q, m) => tf(m.said === m.a * m.x + m.b, q));
  set('g6-eval-story', (q, m) => (q.answer === m.a * m.x + m.b ? '' : 'cost'));
  set('g6-eval-match', (q, m) => (q.pairs.every(p => nums(p[0])[0] * m.a + m.b === +p[1]) ? '' : 'pairs'));
  set('g6-comb-tap', (q, m) => (!/[a-z]/.test(q.tiles[q.answer]) && q.tiles.every((t, j) => j === q.answer || t.endsWith(m.v)) ? '' : 'term'));
  set('g6-comb-fill', (q, m) => (q.answers[0] === m.a + m.b && q.answers[1] === m.c ? '' : 'blanks'));
  set('g6-comb-tf', (q, m) => tf(m.said[0] === m.a + m.b && m.said[1] === m.c, q));
  set('g6-solve-order', (q, m) => { const x = nums(q.items[1]).pop(); return /^Subtract/.test(q.items[0]) && /^Divide/.test(q.items[1]) && /^Check/.test(q.items[2]) && m.a * x + m.b === m.c ? '' : 'steps'; });
  set('g6-solve-tf', (q, m) => tf(H.close(m.a * m.said + m.b, m.c), q));
  set('g6-solve-story', (q, m) => (m.a * q.answer + m.b === m.c ? '' : 'price'));
  set('g6-ineq-line', (q, m) => (m.a * q.answer + m.b === m.c ? '' : 'boundary'));
  set('g6-ineq-pick', (q, m) => (same(picks(q.options, o => holds(m.a * o + m.b, m.op, m.c)), q.answer) ? '' : 'picks'));
  set('g6-ineq-tf', (q, m) => tf(holds(m.a * m.said + m.b, m.op, m.c), q));
  set('g6-code-fill', (q, m) => (run(m.s, m.lim, m.st).slice(0, 3).join() === q.answers.join() ? '' : 'trace'));
  set('g6-code-tf', (q, m) => tf(run(m.s, m.lim, m.st).pop() === m.said, q));
  set('g6-code-order', (q, m) => (run(m.s, m.lim, m.st).slice(0, q.items.length).join() === q.items.join() ? '' : 'order'));

  /* ---- Data and probability ---- */
  const kindOf = t => (/favourite|colour|type of/i.test(t) ? 'qualitative' : /number of|how many/i.test(t) ? 'discrete' : /height|time|temperature|mass|rain/i.test(t) ? 'continuous' : '?');
  const graphFor = t => (/every hour|each week/i.test(t) ? 'broken-line graph' : /of \d+ /.test(t) ? 'histogram' : /favourite|each colour/i.test(t) ? 'bar graph' : '?');
  const median = d => { const s = d.slice().sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const mean = d => d.reduce((x, y) => x + y, 0) / d.length;
  const total = b => b.reduce((x, y) => x + y, 0);
  set('g6-type-match', q => (q.pairs.every(p => kindOf(p[0]) === p[1]) ? '' : 'pairs'));
  set('g6-type-pick', (q, m) => (same(picks(q.options, o => kindOf(o) === m.want), q.answer) ? '' : 'picks'));
  set('g6-type-tf', (q, m) => tf(kindOf(m.it) === m.said, q));
  set('g6-mmm-tap', q => (+q.tiles[q.answer] === median(q.tiles.map(Number)) ? '' : 'median'));
  set('g6-mmm-fill', (q, m) => (q.answers[0] === Math.max(...m.d) - Math.min(...m.d) && q.answers[1] === median(m.d) ? '' : 'blanks'));
  set('g6-mmm-tf', (q, m) => tf(m.said === mean(m.d), q));
  set('g6-mmm-story', (q, m) => (q.answer === mean(m.d) ? '' : 'mean'));
  set('g6-hist-tf', (q, m) => tf(m.said === total(m.b), q));
  set('g6-hist-fill', (q, m) => { const x = nums(q.fill)[0], cut = (x - m.lo) / m.w; return q.answers[0] === total(m.b.slice(0, cut)) && q.answers[1] === total(m.b.slice(cut)) ? '' : 'blanks'; });
  set('g6-hist-pick', (q, m) => { const t = nums(bold(q))[0]; return same(picks(q.options, o => m.b[(nums(o)[0] - m.lo) / m.w] > t), q.answer) ? '' : 'picks'; });
  set('g6-graph-match', q => (q.pairs.every(p => graphFor(p[0]) === p[1]) ? '' : 'pairs'));
  set('g6-graph-tf', (q, m) => tf(graphFor(m.it) === m.said, q));
  set('g6-graph-tap', (q, m) => (m.ys.every(y => y <= m.ys[q.answer]) && m.ys.filter(y => y === m.ys[q.answer]).length === 1 ? '' : 'warmest'));
  set('g6-prob-line', (q, m) => (H.close(q.answer * m.t, m.f) && nums(q.q)[0] === m.f && nums(q.q)[0] + nums(q.q)[1] === m.t ? '' : 'probability'));
  set('g6-prob-tf', (q, m) => tf(m.said[0] * (m.r + m.b) === m.said[1] * m.r, q));
  set('g6-prob-order', (q, m) => (ascending(q.items.map(c => m.cnt[c])) ? '' : 'order'));
  set('g6-two-fill', (q, m) => { const evens = Array.from({ length: m.nb }, (_, i) => i + 1).filter(n => n % 2 === 0).length; return q.answers[0] === 2 * m.nb && q.answers[1] === evens ? '' : 'blanks'; });
  set('g6-two-tf', (q, m) => tf(m.said[0] * 2 * m.nb === m.said[1], q));
  set('g6-two-pick', q => (same(picks(q.options, o => o[0] === 'H' && +o.slice(1) % 2 === 0), q.answer) ? '' : 'picks'));

  /* ---- Shapes and grids ---- */
  const QUAD = { /* always true: 4 right angles, 4 equal sides, 2 pairs of parallel sides; lines of symmetry; order of turn */
    square: { right: 1, equal: 1, par2: 1, lines: 4, rot: 4 }, rectangle: { right: 1, equal: 0, par2: 1, lines: 2, rot: 2 },
    rhombus: { right: 0, equal: 1, par2: 1, lines: 2, rot: 2 }, parallelogram: { right: 0, equal: 0, par2: 1, lines: 0, rot: 2 },
    kite: { right: 0, equal: 0, par2: 0, lines: 1, rot: 1 }
  };
  const quadOf = p => (p[0] > 0 ? (p[1] > 0 ? 'I' : 'IV') : p[0] < 0 ? (p[1] > 0 ? 'II' : 'III') : '?');
  const MOVE = { 'reflect in the x-axis': p => [p[0], -p[1]], 'reflect in the y-axis': p => [-p[0], p[1]], 'rotate 180° about (0, 0)': p => [-p[0], -p[1]],
    'rotate 90° clockwise about (0, 0)': p => [p[1], -p[0]], 'rotate 90° counterclockwise about (0, 0)': p => [-p[1], p[0]] };
  const samePt = (a, b) => a[0] === b[0] && a[1] === b[1];
  const front = h => h[0].map((_, c) => Math.max(...h.map(r => r[c])));
  set('g6-quad-pick', (q, m) => (same(picks(q.options, o => QUAD[o][m.prop] === 1), q.answer) ? '' : 'picks'));
  set('g6-quad-tf', (q, m) => tf(QUAD[m.name][m.prop] === 1, q));
  set('g6-quad-match', q => (q.pairs.every(p => QUAD[p[0]].lines === nums(p[1])[0]) ? '' : 'pairs'));
  set('g6-sym-tap', (q, m) => { const fits = m.names.map(n => QUAD[n][m.ask] === m.n); return fits.filter(Boolean).length === 1 && fits[q.answer] ? '' : 'shape'; });
  set('g6-sym-fill', (q, m) => (q.answers[0] === QUAD[m.name].lines && q.answers[1] === QUAD[m.name].rot ? '' : 'blanks'));
  set('g6-sym-tf', (q, m) => tf(QUAD[m.name].lines === m.said, q));
  set('g6-coord-tap', (q, m) => (samePt(m.pts[q.answer], nums(bold(q))) ? '' : 'point'));
  set('g6-coord-tf', (q, m) => tf(quadOf(m.p) === m.said, q));
  set('g6-coord-pick', (q, m) => (same(picks(q.options, o => quadOf(nums(o)) === m.want), q.answer) ? '' : 'picks'));
  set('g6-tr-fill', (q, m) => (q.answers[0] === m.a[0] + m.dx && q.answers[1] === m.a[1] + m.dy ? '' : 'point'));
  set('g6-tr-tf', (q, m) => tf(m.said[0] === m.b[0] - m.a[0] && m.said[1] === m.b[1] - m.a[1], q));
  set('g6-tr-line', (q, m) => (q.answer === m.x + m.d ? '' : 'point'));
  set('g6-tf-tap', (q, m) => (samePt(m.pts[q.answer], MOVE[m.move](m.p)) && m.pts.filter(p => samePt(p, MOVE[m.move](m.p))).length === 1 ? '' : 'image'));
  set('g6-tf-tf', (q, m) => tf(samePt(m.said, MOVE['reflect in the ' + m.axis + '-axis'](m.p)), q));
  set('g6-tf-match', (q, m) => (q.pairs.every(p => samePt(nums(p[1]), MOVE[p[0].charAt(0).toLowerCase() + p[0].slice(1)](m.p))) ? '' : 'pairs'));
  set('g6-views-tap', (q, m) => { const f = front(m.h).join(); return m.opts[q.answer].join() === f && m.opts.filter(o => o.join() === f).length === 1 ? '' : 'view'; });
  set('g6-views-fill', (q, m) => (q.answers.join() === front(m.h).join() ? '' : 'heights'));
  set('g6-views-tf', (q, m) => tf(m.said === [].concat(...m.h).reduce((x, y) => x + y, 0), q));

  /* ---- Measurement ---- */
  const unitExp = u => ({ k: 3, '': 0, c: -2, m: -3 })[u.slice(0, -1)];
  const amount = t => { const s = H.strip(t), u = s.split(' ').pop(); return nums(s)[0] * Math.pow(10, unitExp(u)); }; /* in base units */
  const angleKind = d => (d < 90 ? 'acute' : d === 90 ? 'right' : d < 180 ? 'obtuse' : d === 180 ? 'straight' : 'reflex');
  const SIDES = { triangular: 3, square: 4, pentagonal: 5, hexagonal: 6 };
  const faceCount = n => (n === 'cube' ? 6 : /prism/.test(n) ? SIDES[n.split(/[ -]/)[0]] + 2 : SIDES[n.split(/[ -]/)[0]] + 1);
  set('g6-conv-line', (q, m) => (H.close(q.answer * 100, m.cm) ? '' : 'metres'));
  set('g6-conv-tf', (q, m) => tf(H.close(m.said, m.v * Math.pow(10, unitExp(m.from) - unitExp(m.to))), q));
  set('g6-conv-match', q => (q.pairs.every(p => H.close(amount(p[0]), amount(p[1]))) ? '' : 'pairs'));
  set('g6-conv-order', q => (ascending(q.items.map(amount)) ? '' : 'order'));
  set('g6-ang-tap', (q, m) => (angleKind(m.ds[q.answer]) === m.want && m.ds.filter(d => angleKind(d) === m.want).length === 1 ? '' : 'angle'));
  set('g6-ang-tf', (q, m) => tf(angleKind(m.d) === m.said, q));
  set('g6-ang-line', (q, m) => (q.answer + m.x === 360 ? '' : 'angle'));
  set('g6-rel-fill', (q, m) => (q.answers[0] === m.a + m.b && q.answers[0] + q.answers[1] === 180 ? '' : 'blanks'));
  set('g6-rel-tf', (q, m) => tf(m.said + m.x === 180, q));
  set('g6-rel-match', (q, m) => (q.pairs.every(p => nums(p[1])[0] + m.x === (/complement/.test(p[0]) ? 90 : /supplement/.test(p[0]) ? 180 : 360)) ? '' : 'pairs'));
  set('g6-area-fill', (q, m) => (q.answers[0] === m.a + m.b && q.answers[1] === (m.a + m.b) * m.h && q.answers[2] * 2 === (m.a + m.b) * m.h ? '' : 'blanks'));
  set('g6-area-tf', (q, m) => tf(m.said * 2 === m.d1 * m.d2, q));
  set('g6-area-story', (q, m) => (q.answer * 2 === m.d1 * m.d2 ? '' : 'area'));
  set('g6-faces-match', q => (q.pairs.every(p => faceCount(p[0].toLowerCase()) === nums(p[1])[0]) ? '' : 'pairs'));
  set('g6-faces-tf', (q, m) => tf(faceCount(m.s) === m.said, q));
  set('g6-faces-pick', (q, m) => (same(picks(q.options, o => faceCount(o) === m.n), q.answer) ? '' : 'picks'));
  set('g6-sa-fill', (q, m) => { const f = [m.l * m.w, m.l * m.h, m.w * m.h]; return q.answers.slice(0, 3).join() === f.join() && q.answers[3] === 2 * H.sum(f.join('+')) ? '' : 'blanks'; });
  set('g6-sa-tf', (q, m) => tf(m.said === 6 * m.e * m.e, q));
  set('g6-sa-story', (q, m) => (q.answer === 2 * (m.l * m.w + m.l * m.h + m.w * m.h) ? '' : 'area'));

  /* ---- Money ---- */
  const PAY_CLUE = { cash: /coins and bills/, 'debit card': /straight from your bank/, 'credit card': /borrowed/, 'e-transfer': /online/, 'gift card': /loaded/ };
  const PAY_BORROWED = { 'credit card': 1, 'buy now, pay later': 1 }, PAY_BANK = { 'debit card': 1, 'e-transfer': 1 };
  const NEED = /coat|food|place to live|boots|water/, TERM = [/weekend/, /month/, /summer/, /college/];
  const shareWay = a => (a.swap ? 'trading' : !a.returned ? 'donating' : a.owner ? 'lending' : 'borrowing');
  const weeks = m => Math.ceil((m.goal - m.have) / m.per);
  set('g6-pay-match', q => (q.pairs.every(p => PAY_CLUE[p[0].toLowerCase()].test(p[1])) ? '' : 'pairs'));
  set('g6-pay-pick', (q, m) => (same(picks(q.options, o => !!(m.ask === 'borrowed' ? PAY_BORROWED : PAY_BANK)[o]), q.answer) ? '' : 'picks'));
  set('g6-pay-tf', (q, m) => tf(!!PAY_BORROWED[m.p], q));
  set('g6-goal-line', (q, m) => (q.answer === weeks(m) ? '' : 'weeks'));
  set('g6-goal-fill', (q, m) => (q.answers[0] === m.goal - m.have && q.answers[1] === weeks(m) && (q.answers[1] - 1) * m.per < m.goal - m.have ? '' : 'blanks'));
  set('g6-goal-tf', (q, m) => tf(m.said === weeks(m), q));
  set('g6-needs-pick', q => (same(picks(q.options, o => NEED.test(o)), q.answer) ? '' : 'picks'));
  set('g6-needs-tf', (q, m) => tf(NEED.test(m.item) === (m.said === 'need'), q));
  set('g6-needs-order', q => (q.items.every((t, i) => TERM[i].test(t)) ? '' : 'order'));
  set('g6-intr-fill', (q, m) => (H.close(q.answers[0] * 100, m.p) && H.close(q.answers[1] * 100, m.p * m.r) ? '' : 'interest'));
  set('g6-intr-way', q => { const t = H.strip(q.q), op = /in \d+ years\?/.test(t) ? 'Multiply' : /account now\?/.test(t) ? 'Add' : ''; return q.options[q.answer] === op ? '' : 'operation'; });
  set('g6-intr-tf', (q, m) => tf(H.close(m.said * 100, m.p * m.r * m.t), q));
  set('g6-fee-line', (q, m) => (H.close(q.answer * 100, m.f * m.n * 100) ? '' : 'fees'));
  set('g6-fee-tf', (q, m) => tf(m.said === m.f * 12, q));
  set('g6-fee-way', q => (/free transactions/.test(q.q) && q.options[q.answer] === 'Subtract' ? '' : 'operation'));
  set('g6-share-match', (q, m) => (q.pairs.every((p, j) => p[1] === shareWay(m.acts[j])) ? '' : 'pairs'));
  set('g6-share-tf', (q, m) => tf(shareWay(m.act) === m.said, q));
  set('g6-share-pick', (q, m) => (same(m.acts.map((a, j) => (shareWay(a) === m.want ? j : -1)).filter(j => j >= 0), q.answer) ? '' : 'picks'));
})(window.__verify, window.__H);
