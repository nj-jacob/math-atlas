/* Answer checks for Grade 4 question shapes. Each check gets (q, q.meta, helpers) and returns
   an error message, or '' when the answer is right. Work the answer out here independently:
   never copy the site's own calculation. */
(function (V, H) {
  const set = (k, fn) => { V[k] = fn; };
  const bold = (q, i) => H.strip((q.q.match(/<b>(.*?)<\/b>/g) || [])[i || 0] || '');
  const same = (a, b) => a.slice().sort().join() === b.slice().sort().join();
  const idx = (list, fn) => list.map((x, j) => fn(x) ? j : -1).filter(j => j >= 0);
  const reason = (q, text) => H.strip(q.why.options[q.why.answer]).includes(text);
  const rising = v => v.every((x, i) => !i || x > v[i - 1]);
  const falling = v => v.every((x, i) => !i || x < v[i - 1]);
  /* the value of the underlined digit in html like 4<u>3</u>52 */
  const underlined = html => { const plain = html.replace(/<(?!\/?u>)[^>]+>/g, ''); return H.placeVal(+H.strip(plain), plain.indexOf('<u>')); };

  /* ---- Numbers to 10 000 ---- */
  set('n4-value-tap', (q, m) => { const hits = [0, 1, 2, 3].filter(i => H.placeVal(m.n, i) === m.val); return hits.length === 1 && String(hits[0]) === q.answer && H.num(bold(q)) === m.val ? '' : 'digit worth ' + m.val + ' in ' + m.n; });
  set('n4-value-num', (q, m) => H.placeVal(m.n, m.i) === q.answer ? '' : 'value of digit ' + m.i + ' in ' + m.n);
  set('n4-value-tf', (q, m) => { const real = H.placeVal(m.n, m.i); if ((real === m.said) !== q.answer) return 'truth'; return reason(q, 'worth ' + real) ? '' : 'reason'; });
  set('n4-value-match', (q, m) => m.pairs.every(p => underlined(p[0]) === H.num(p[1])) ? '' : 'pairs');
  set('n4-blocks-build', (q, m) => q.answer === m.h * 100 + m.t * 10 + m.o && q.answer < 1000 ? '' : 'build target');
  set('n4-blocks-tap', (q, m) => m.set[q.answer] === m.n && new Set(m.set).size === m.set.length && H.num(bold(q)) === m.n ? '' : 'tile');
  set('n4-blocks-fill', (q, m) => q.answers[0] * 1000 + q.answers[1] * 100 + q.answers[2] * 10 + q.answers[3] === m.n && q.answers.every(x => x <= 9) ? '' : 'digits');
  set('n4-blocks-trade', (q, m) => q.answers[0] * 1000 + q.answers[1] * 100 + q.answers[2] * 10 + q.answers[3] === m.n && q.answers[0] === Math.floor(m.n / 1000) - 1 ? '' : 'trade');
  set('n4-blocks-tf', (q, m) => (m.said === m.n) === q.answer && H.num(bold(q)) === m.said ? '' : 'truth');
  set('n4-forms-fill', (q, m) => { const s = String(m.n), exp = [...s].map((_, i) => H.placeVal(m.n, i)).filter(v => v); return exp.join() === q.answers.join() ? '' : 'parts'; });
  set('n4-forms-match', (q, m) => m.pairs.every(p => H.sum(p[0]) === H.num(p[1])) ? '' : 'pairs');
  set('n4-forms-pick', (q, m) => same(idx(q.options, o => H.sum(o) === m.n), q.answer) ? '' : 'picks');
  set('n4-forms-story', q => { const n = H.strip(q.q).match(/\d+/g).map(Number); return n[0] * n[1] + n[2] * n[3] + n[4] * n[5] + n[6] === q.answer ? '' : 'total'; });
  set('n4-words-match', (q, m) => m.pairs.every(p => H.fromWords(p[0]) === H.num(p[1]) && H.toWords(H.num(p[1])) === p[0]) ? '' : 'pairs');
  set('n4-words-tap', q => H.num(H.strip(q.tiles[q.answer])) === H.fromWords(bold(q)) && q.tiles.filter(t => H.num(H.strip(t)) === H.fromWords(bold(q))).length === 1 ? '' : 'tile');
  set('n4-words-tf', (q, m) => H.fromWords(bold(q)) === m.n && (m.said === m.n) === q.answer ? '' : 'truth');
  set('n4-words-order', q => rising(q.items.map(H.fromWords)) ? '' : 'order');
  set('n4-cmp-line', q => H.num(bold(q)) === q.answer ? '' : 'point');
  set('n4-cmp-order', (q, m) => { const v = q.items.map(H.num); return (m.big ? falling(v) : rising(v)) && /greatest to least/.test(q.q) === m.big ? '' : 'order'; });
  set('n4-cmp-story', (q, m) => { const a = H.num(bold(q, 0)), b = H.num(bold(q, 1)); return (m.less ? (a < b ? 0 : 1) : (a > b ? 0 : 1)) === q.answer && a !== b ? '' : 'winner'; });
  set('n4-cmp-pick', (q, m) => same(idx(q.options.map(H.num), v => m.less ? v < m.x : v > m.x), q.answer) ? '' : 'picks');
  set('n4-round-line', (q, m) => H.roundTo(m.n, m.p) === q.answer && H.num(bold(q)) === m.n ? '' : 'rounded');
  set('n4-round-tf', (q, m) => (H.roundTo(m.n, m.p) === m.said) === q.answer && reason(q, 'rounds') ? '' : 'truth');
  set('n4-round-match', (q, m) => m.pairs.every(p => H.roundTo(H.num(p[0]), m.p) === H.num(p[1])) ? '' : 'pairs');
  set('n4-round-story', (q, m) => H.roundTo(H.num(bold(q)), 1000) === q.answer ? '' : 'rounded');
  /* ---- Add and subtract ---- */
  /* the two numbers and the sign in text like "4 352 + 1 270" or "4 352 − 1 270" */
  const sum2 = t => { const m = H.strip(t).match(/([\d ]+?)\s*([+−])\s*([\d ]+)/); const a = H.num(m[1]), b = H.num(m[3]); return m[2] === '+' ? a + b : a - b; };
  set('as-add-build', (q, m) => q.answer === m.a + m.b && sum2(q.q) === q.answer ? '' : 'total');
  set('as-add-tf', (q, m) => (m.a + m.b === m.said) === q.answer ? '' : 'truth');
  set('as-add-story', q => { const n = [...q.q.matchAll(/<b>([\d ]+)<\/b>/g)].map(x => H.num(x[1])); return n[0] + n[1] === q.answer ? '' : 'total'; });
  set('as-add-match', (q, m) => m.pairs.every(p => sum2(p[0]) === H.num(p[1])) ? '' : 'pairs');
  set('as-sub-tf', (q, m) => (m.a - m.b === m.said) === q.answer ? '' : 'truth');
  set('as-sub-fill', (q, m) => q.answers[0] === m.a - m.b && q.answers[1] + m.b === m.a ? '' : 'difference');
  set('as-sub-story', q => { const n = [...q.q.matchAll(/<b>([\d ]+)<\/b>/g)].map(x => H.num(x[1])); return n[0] - n[1] === q.answer && q.answer > 0 ? '' : 'difference'; });
  set('as-sub-match', (q, m) => m.pairs.every(p => sum2(p[0]) === H.num(p[1])) ? '' : 'pairs');
  set('as-mental-which', (q, m) => {
    const thou = Math.ceil(m.a / 1000) * 1000;
    const kind = m.a % 100 === 0 && m.b % 100 === 0 ? 'Think of both' : !m.sub && thou - m.a <= 4 ? 'friendly thousand' : m.sub && m.a - m.b < 1000 ? 'Count up' : '?';
    return H.strip(q.options[q.answer]).includes(kind) ? '' : 'way';
  });
  set('as-mental-line', (q, m) => q.answer === (m.sub ? m.a - m.b : m.a + m.b) ? '' : 'answer');
  set('as-mental-fill', (q, m) => m.near + q.answers[0] === m.x + m.y && q.answers[1] === m.x + m.y ? '' : 'friendly');
  set('as-est-match', (q, m) => m.pairs.every(p => { const t = H.strip(p[0]).split('+').map(H.num); return H.roundTo(t[0], 100) + H.roundTo(t[1], 100) === H.num(p[1].replace('about', '')); }) ? '' : 'pairs');
  set('as-est-tf', (q, m) => { const exact = m.sub ? m.a - m.b : m.a + m.b; return (Math.abs(m.said - exact) < 300) === q.answer && m.said === exact === q.answer ? '' : 'truth'; });
  set('as-est-pick', (q, m) => same(idx(q.options, o => H.sum(o) > m.goal), q.answer) ? '' : 'picks');
  set('as-inv-fill', (q, m) => q.answers[0] === m.b && q.answers[1] === m.a - m.b ? '' : 'facts');
  set('as-inv-match', (q, m) => m.pairs.every(p => { const s = H.strip(p[0]).split('='), t = H.strip(p[1]).split('='); return sum2(s[0]) === H.num(s[1]) && sum2(t[0]) === H.num(t[1]) && H.num(t[1]) === H.num(s[0].split('−')[0]); }) ? '' : 'pairs');
  set('as-inv-story', q => H.num(bold(q, 0)) - H.num(bold(q, 1)) === q.answer ? '' : 'missing part');
  set('as-words-which', (q, m) => (m.kind === 'join' ? 'Add' : 'Subtract') === q.options[q.answer] ? '' : 'operation');
  set('as-words-fill', q => { const n = [...q.q.matchAll(/<b>([\d ]+)<\/b>/g)].map(x => H.num(x[1])); return q.answers.join() === [n[0] + n[1], n[0] + n[1], n[0] + n[1] - n[2]].join() ? '' : 'steps'; });
  set('as-words-tf', (q, m) => (m.t - m.u === m.said) === q.answer ? '' : 'truth');
  /* ---- Multiply and divide ---- */
  const times = t => { const m = H.strip(t).match(/([\d ]+)\s*×\s*([\d ]+)/); return H.num(m[1]) * H.num(m[2]); };
  set('md4-facts-tap', (q, m) => { const s = m.set[q.answer]; return s[0] === m.a && s[1] === m.b && m.set.filter(x => x[0] === m.a && x[1] === m.b).length === 1 ? '' : 'array'; });
  set('md4-facts-match', (q, m) => m.pairs.every(p => times(p[0]) === +p[1]) ? '' : 'pairs');
  set('md4-facts-tf', (q, m) => (m.a * m.b === m.said) === q.answer ? '' : 'truth');
  set('md4-facts-fill', (q, m) => q.answers[0] === m.a * m.b && q.answers[1] / m.a === m.b && m.a * m.b / m.b === q.answers[2] ? '' : 'family');
  set('md4-tens-fill', (q, m) => q.answers.join() === [1, 2, 3].map(z => +(String(m.m) + '0'.repeat(z))).join() ? '' : 'pattern');
  set('md4-tens-tf', (q, m) => ((String(m.m) + '0'.repeat(Math.log10(m.f))) === String(m.said)) === q.answer ? '' : 'truth');
  set('md4-tens-match', (q, m) => m.pairs.every(p => times(p[0]) === H.num(p[1])) ? '' : 'pairs');
  set('md4-tens-story', (q, m) => +(String(m.n) + String(m.f).slice(1)) === q.answer ? '' : 'product');
  set('md4-mult-fill', (q, m) => { const t = Math.floor(m.a / 10) * 10; return q.answers.join() === [t * m.b, (m.a - t) * m.b, m.a * m.b].join() ? '' : 'parts'; });
  set('md4-mult-story', q => H.num(bold(q, 0)) * H.num(bold(q, 1)) === q.answer ? '' : 'product');
  set('md4-mult-tf', (q, m) => (m.a * m.b === m.said) === q.answer ? '' : 'truth');
  set('md4-div-fill', (q, m) => q.answers[0] * m.d + q.answers[1] === m.n && q.answers[1] < m.d ? '' : 'quotient');
  set('md4-div-story', q => { const n = H.num(bold(q, 0)), d = H.num(bold(q, 1)); return q.answer === Math.floor(n / d) ? '' : 'share'; });
  set('md4-div-tf', (q, m) => (m.sq * m.d + m.sr === m.n && m.sr < m.d) === q.answer ? '' : 'truth');
  set('md4-rem-which', (q, m) => H.strip(q.options[q.answer]).startsWith({ up: 'Round up', drop: 'Drop', share: 'Cut' }[m.kind]) && (m.kind === 'up') === /canoe/.test(q.q) ? '' : 'leftovers');
  set('md4-rem-tf', (q, m) => (m.said === Math.ceil(m.n / m.d)) === q.answer ? '' : 'truth');
  set('md4-rem-fill', (q, m) => q.answers[0] === Math.floor(m.n / m.d) && q.answers[1] === m.n % m.d && q.answers[2] === Math.ceil(m.n / m.d) ? '' : 'cans');
  set('md4-rate-line', (q, m) => q.answer === m.per * m.n && q.answer <= q.max ? '' : 'distance');
  set('md4-rate-which', (q, m) => q.options[q.answer] === (/How many weeks/.test(q.q) ? 'Divide' : 'Multiply') ? '' : 'operation');
  set('md4-rate-fill', (q, m) => q.answers.join() === [2, 4, 7].map(x => x * m.per).join() ? '' : 'table');
  /* ---- Fractions ---- */
  /* the value of fraction html: "3/4", a stacked fraction, or a mixed number like "2 <frac>" */
  const fval = html => {
    const t = String(html).replace(/<sup>(\d+)<\/sup><sub>(\d+)<\/sub>/g, ' $1/$2 ').replace(/<[^>]+>/g, ' ').replace(/&times;/g, '×').trim();
    const m = t.match(/^(?:(\d+)\s+)?(\d+)\s*\/\s*(\d+)$/); if (m) return (+(m[1] || 0)) + m[2] / m[3];
    return /^\d+$/.test(t) ? +t : NaN;
  };
  const shaded = svg => [(svg.match(/fill:var\(--strand\)/g) || []).length, (svg.match(/<rect/g) || []).length];
  set('fr4-name-tap', (q, m) => { const s = shaded(q.tiles[q.answer]); return s[0] === m.n && s[1] === m.d && q.tiles.filter(t => shaded(t).join() === s.join()).length === 1 ? '' : 'picture'; });
  set('fr4-name-match', (q, m) => m.pairs.every(p => { const s = shaded(p[0]); return H.close(s[0] / s[1], fval(p[1])); }) ? '' : 'pairs');
  set('fr4-name-tf', (q, m) => { const s = shaded(q.fig); return (s[0] === m.sn && s[1] === m.sd) === q.answer ? '' : 'truth'; });
  set('fr4-mean-tap', (q, m) => H.num(H.strip(q.tiles[q.answer])) === (m.askDen ? m.d : m.n) && m.n !== m.d ? '' : 'number');
  set('fr4-mean-fill', q => q.answers[0] === H.num(bold(q, 1)) && q.answers[1] === H.num(bold(q, 0)) ? '' : 'fraction');
  set('fr4-mean-tf', (q, m) => (m.said === m.d) === q.answer ? '' : 'truth');
  set('fr4-share-fill', q => q.answers[0] === H.num(bold(q, 0)) && H.num(bold(q, 0)) < H.num(bold(q, 1)) ? '' : 'share');
  set('fr4-share-tf', (q, m) => H.close(m.sn / m.sd, m.n / m.people) === q.answer ? '' : 'truth');
  set('fr4-share-match', (q, m) => m.pairs.every(p => { const n = p[0].match(/\d+/g).map(Number); return H.close(n[0] / n[1], fval(p[1])); }) ? '' : 'pairs');
  set('fr4-cmp-order', q => rising(q.items.map(fval)) ? '' : 'order');
  set('fr4-cmp-line', (q, m) => H.close(q.answer, m.n / m.d, 1e-9) && H.close(fval(q.q.match(/<span class="fr".*?<\/span>/)[0]), q.answer) ? '' : 'point');
  set('fr4-cmp-pick', (q, m) => same(idx(q.options, o => fval(o) > 0.5), q.answer) && !q.options.some(o => H.close(fval(o), 0.5)) ? '' : 'picks');
  set('fr4-cmp-tf', (q, m) => (1 / m.big > 1 / m.small) === q.answer ? '' : 'truth');
  set('fr4-count-line', (q, m) => H.close(q.answer, fval(bold(q))) ? '' : 'point');
  set('fr4-count-fill', (q, m) => { const t = H.strip(q.fill).split(',').map(x => x.trim()); const a = +t[0].split('/')[0], b = +t[2].split('/')[0], c = +t[4].split('/')[0]; return q.answers[0] === a + 1 && b === a + 2 && q.answers[1] === b + 1 && c === b + 2 ? '' : 'count'; });
  set('fr4-count-order', q => rising(q.items.map(fval)) ? '' : 'order');
  set('fr4-unit-fill', (q, m) => q.answers[0] === (q.fill.match(/<span class="fr"/g) || []).length && (q.fill.match(/<sub>(\d+)/g) || []).every(x => x === '<sub>' + m.d) ? '' : 'sum');
  set('fr4-unit-match', (q, m) => m.pairs.every(p => { const k = +H.strip(p[0]).match(/^\d+/)[0], u = fval(p[0].replace(/^\d+ &times; /, '')); return H.close(k * u, fval(p[1])); }) ? '' : 'pairs');
  set('fr4-unit-story', (q, m) => H.close(q.answer * (1 / m.d), fval(q.q.match(/<b>(.*?)<\/b>/)[1])) ? '' : 'pancakes');
  /* ---- Decimals (tenths) ---- */
  /* "two and three tenths" -> 2.3, "one tenth" -> 0.1 */
  const decWords = w => { const p = w.split(' and '), tenths = p.pop(), whole = p.length ? H.fromWords(p[0]) : 0; return whole + H.fromWords(tenths.replace(/ tenths?$/, '')) / 10; };
  set('de4-read-line', q => H.close(q.answer, H.num(bold(q))) ? '' : 'point');
  set('de4-read-match', (q, m) => m.pairs.every(p => H.close(decWords(p[0]), H.num(p[1]))) ? '' : 'pairs');
  set('de4-read-tap', (q, m) => { const d = m.s.replace('.', ''), want = m.tenths ? m.s.split('.')[1] : m.s.split('.')[0].slice(-1); return d.charAt(+q.answer) === want && +q.answer === (m.tenths ? d.length - 1 : d.length - 2) ? '' : 'digit'; });
  set('de4-frac-match', (q, m) => m.ts.every((t, i) => H.close(fval(q.pairs[i][0]), H.num(q.pairs[i][1]))) ? '' : 'pairs');
  set('de4-frac-fill', (q, m) => H.close(q.answers[0] / 10, H.num(H.strip(q.fill).split('=')[0])) ? '' : 'tenths');
  set('de4-frac-tf', (q, m) => H.close(m.said[0] / m.said[1], m.t / 10) === q.answer ? '' : 'truth');
  set('de4-cmp-order', q => rising(q.items.map(H.num)) ? '' : 'order');
  set('de4-cmp-tap', (q, m) => { const hits = q.pic.match(/data-hit="[A-C]"[^>]*><circle cx="[\d.]+"/g).map(h => [h.match(/"([A-C])"/)[1], +h.match(/cx="([\d.]+)"/)[1]]); const order = m.ts.map((t, i) => [t, hits[i][0], hits[i][1]]).sort((a, b) => a[0] - b[0]); const xs = order.map(o => o[2]); return rising(xs) && order.find(o => o[0] === m.want)[1] === q.answer && H.close(m.want / 10, H.num(bold(q))) ? '' : 'point'; });
  set('de4-cmp-tf', (q, m) => (m.big > m.small) === q.answer ? '' : 'truth');
  set('de4-cmp-story', q => { const a = H.num(bold(q, 0)), b = H.num(bold(q, 1)); return (a > b ? 0 : 1) === q.answer && a !== b ? '' : 'winner'; });
  set('de4-round-line', (q, m) => q.answer === H.roundTo(m.t, 10) / 10 ? '' : 'rounded');
  set('de4-round-tf', (q, m) => (H.roundTo(m.t, 10) / 10 === m.said) === q.answer ? '' : 'truth');
  set('de4-round-match', (q, m) => m.pairs.every(p => Math.round(H.num(p[0]) * 10) % 10 >= 5 ? Math.ceil(H.num(p[0])) === +p[1] : Math.floor(H.num(p[0])) === +p[1]) ? '' : 'pairs');
  set('de4-add-fill', (q, m) => q.answers[0] === m.a + m.b && H.close(q.answers[1], (m.a + m.b) / 10) ? '' : 'sum');
  set('de4-add-story', q => H.close(H.num(bold(q, 0)) + H.num(bold(q, 1)), q.answer) ? '' : 'sum');
  set('de4-add-tf', (q, m) => H.close(H.num(m.said), (m.a + m.b) / 10) === q.answer ? '' : 'truth');
  set('de4-sub-line', (q, m) => H.close(q.answer, H.num(bold(q, 0)) - H.num(bold(q, 1))) && q.answer >= 0 ? '' : 'landing');
  set('de4-sub-which', (q, m) => q.options[q.answer] === (/in all/.test(q.q) ? 'Add' : 'Subtract') ? '' : 'operation');
  set('de4-sub-fill', (q, m) => H.close(q.answers[0], (m.a - m.b) / 10) && H.close(q.answers[1] + m.b / 10, m.a / 10) ? '' : 'difference');
  /* ---- Patterns and equations ---- */
  const nums = t => (H.strip(t).match(/\d+(\.\d+)?/g) || []).map(Number);
  /* solve "n + a = b", "n − a = b" or "a × n = b" by trying every whole number for n */
  const side = (t, n) => { const k = t.replace(/\bn\b/, n).split(/\s*([+−×])\s*/), x = +k[0], y = +k[2]; return k[1] === '+' ? x + y : k[1] === '−' ? x - y : x * y; };
  const solve = eq => { const t = H.strip(eq).split('='); for (let n = 0; n <= 200; n++) if (side(t[0], n) === +t[1]) return n; return NaN; };
  set('pa4-next-tap', (q, m) => { const next = m.core[m.len % m.core.length]; return m.kinds[q.answer] === next ? '' : 'next shape'; });
  set('pa4-next-fill', q => { const v = nums(q.fill).concat(q.answers), d = v[1] - v[0]; return v.every((x, i) => !i || x - v[i - 1] === d) ? '' : 'pattern'; });
  set('pa4-next-story', (q, m) => { let v = m.start; for (let w = 2; w <= m.n; w++) v += m.add; return v === q.answer ? '' : 'savings'; });
  set('pa4-rule-match', (q, m) => m.pairs.every(p => { const v = nums(p[0]), r = nums(p[1]); return v[0] === r[0] && v.every((x, i) => !i || x - v[i - 1] === r[1]); }) ? '' : 'pairs');
  set('pa4-rule-tf', (q, m) => ((m.v[1] - m.v[0]) === m.said) === q.answer ? '' : 'truth');
  set('pa4-rule-fill', (q, m) => { const at = n => m.start + (n - 1) * m.add; return q.answers.join() === [at(3), at(4), at(6)].join() ? '' : 'table'; });
  set('pa4-dec-line', (q, m) => { const v = nums(q.q).slice(0, 4); const d = Math.round((v[1] - v[0]) * 10); return H.close(q.answer, Math.round(v[3] * 10 + d) / 10) ? '' : 'next'; });
  set('pa4-dec-fill', q => { const v = nums(q.fill.replace(/(\d) (\d{3})/g, '$1$2')).concat(q.answers), d = v[1] - v[0]; return v.every((x, i) => !i || x - v[i - 1] === d) ? '' : 'pattern'; });
  set('pa4-dec-tf', (q, m) => { const nx = (2 * m.v[3] - m.v[2]) / 10; return H.close(H.num(m.said), nx) === q.answer ? '' : 'truth'; });
  set('pa4-solve-which', (q, m) => { const o = H.strip(q.options[q.answer]), n = nums(o), v = /Subtract/.test(o) ? n[0] - n[1] : /Add/.test(o) ? n[0] + n[1] : /Divide/.test(o) ? n[0] / n[1] : NaN; return v === solve(q.q.match(/<span class="math">(.*?)<\/span>/)[1].replace(/&#9633;/g, 'n')) ? '' : 'way'; });
  set('pa4-solve-tf', (q, m) => (m.said + m.a === m.b) === q.answer ? '' : 'truth');
  set('pa4-solve-story', q => q.answer + H.num(bold(q, 0)) === H.num(bold(q, 1)) ? '' : 'start');
  set('pa4-solve-match', (q, m) => m.pairs.every(p => solve(p[0]) === nums(p[1])[0]) ? '' : 'pairs');
  set('pa4-ineq-pick', (q, m) => same(idx(q.options.map(Number), v => m.gt ? v + m.a > m.b : v + m.a < m.b), q.answer) ? '' : 'picks');
  set('pa4-ineq-tf', (q, m) => (m.said + m.a < m.b) === q.answer ? '' : 'truth');
  set('pa4-ineq-line', (q, m) => q.answer + m.a < m.b && q.answer + 1 + m.a >= m.b ? '' : 'greatest');
  set('pa4-code-fill', (q, m) => q.answers[0] * m.k2 === H.num(bold(q)) ? '' : 'loop');
  set('pa4-code-tf', (q, m) => (m.k2 * m.t === m.said) === q.answer ? '' : 'truth');
  set('pa4-code-match', (q, m) => m.pairs.every(p => { const n = nums(p[0]); return n[0] * n[1] === nums(p[1])[0]; }) ? '' : 'pairs');
  /* ---- Data ---- */
  const srt = d => d.slice().sort((a, b) => a - b);
  const med = d => { const s = srt(d), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const mean = d => d.reduce((a, b) => a + b, 0) / d.length;
  const counts = d => d.reduce((c, x) => (c[x] = (c[x] || 0) + 1, c), {});
  const likely = (k, n) => k === 0 ? 'impossible' : k === n ? 'certain' : 2 * k === n ? 'equally likely' : 2 * k < n ? 'unlikely' : 'likely';
  const isQuan = t => /^How (many|tall|long)/.test(H.strip(t).replace(/^.*"(.*)".*$/, '$1'));
  set('da4-kind-pick', q => same(idx(q.options, isQuan), q.answer) ? '' : 'picks');
  set('da4-kind-match', (q, m) => m.pairs.every(p => /two classes/.test(p[0]) ? p[1] === 'Double bar graph' : /Heights/.test(p[0]) ? p[1] === 'Stem-and-leaf plot' : p[1] === 'Bar graph') ? '' : 'pairs');
  set('da4-kind-tf', (q, m) => ((m.says === 'quan') === isQuan(bold(q, 0))) === q.answer ? '' : 'truth');
  set('da4-stem-fill', (q, m) => q.answers[0] === Math.min(...m.d) && q.answers[1] === Math.max(...m.d) ? '' : 'least/greatest');
  set('da4-stem-line', (q, m) => q.answer === med(m.d) ? '' : 'median');
  set('da4-stem-tf', (q, m) => (m.st * 10 + m.lf === m.said) === q.answer ? '' : 'truth');
  set('da4-graph-fill', (q, m) => q.answers[0] === m.a[m.i] && q.answers[1] === m.b[m.i] ? '' : 'bars');
  set('da4-graph-tf', (q, m) => (m.a[m.i] > m.b[m.i]) === q.answer ? '' : 'truth');
  set('da4-graph-order', (q, m) => falling(q.items.map(c => m.a[m.cats.indexOf(c)])) ? '' : 'order');
  set('da4-mmm-line', (q, m) => q.answer === med(m.d) ? '' : 'median');
  set('da4-mmm-match', (q, m) => { const c = counts(m.d), top = Math.max(...Object.values(c)), mo = Object.keys(c).filter(k => c[k] === top).map(Number); const want = { Mode: mo.length === 1 ? mo[0] : NaN, Median: med(m.d), Range: Math.max(...m.d) - Math.min(...m.d) }; return q.pairs.every(p => want[p[0]] === +p[1]) ? '' : 'pairs'; });
  set('da4-mmm-tf', (q, m) => (med(m.d) === m.said) === q.answer ? '' : 'truth');
  /* orange sections are drawn in the theme orange (--se) */
  set('da4-prob-order', (q, m) => rising(q.items.map(it => (it.match(/fill:var\(--se\)/g) || []).length)) && q.items.every(it => (it.match(/<path/g) || []).length === m.n) ? '' : 'order');
  set('da4-prob-match', (q, m) => q.pairs.every((p, i) => p[1] === likely(m.ks[i], m.n)) ? '' : 'pairs');
  set('da4-prob-tf', (q, m) => (likely(m.k2, m.n) === m.said) === q.answer ? '' : 'truth');
  set('da4-pop-tf', (q, m) => ((mean(m.d.concat([m.add])) > mean(m.d)) === m.saysUp) === q.answer ? '' : 'truth');
  set('da4-pop-pick', (q, m) => same(idx(q.options.map(Number), v => mean(m.d.concat([v])) > mean(m.d)), q.answer) ? '' : 'picks');
  set('da4-pop-fill', (q, m) => H.close(q.answers[0], mean(m.d)) && H.close(q.answers[1], mean(m.d.concat([m.add]))) ? '' : 'means');
  /* ---- Shapes, angles and grids ---- */
  const angleKind = t => t < 90 ? 'acute' : t === 90 ? 'right' : t < 180 ? 'obtuse' : 'straight';
  const LINES = { square: 4, rectangle: 2, kite: 1, parallelogram: 0 };
  const RECT_FACTS = { 'A square is a rectangle.': true, 'Every rectangle has 4 right angles.': true, 'A rectangle has sides that are perpendicular.': true, 'A parallelogram is always a rectangle.': false, 'A rectangle has only 1 pair of parallel sides.': false, 'The opposite sides of a rectangle are different lengths.': false };
  const onlyAt = (pts, x, y) => pts.filter(p => p.x === x && p.y === y);
  set('sh4-angle-tap', (q, m) => angleKind(m.ts[q.answer]) === m.want && m.ts.filter(t => angleKind(t) === m.want).length === 1 ? '' : 'angle');
  set('sh4-angle-match', (q, m) => q.pairs.every((p, i) => p[1] === angleKind(m.ts[i])) ? '' : 'pairs');
  set('sh4-angle-tf', (q, m) => (angleKind(m.t) === m.said) === q.answer ? '' : 'truth');
  set('sh4-angle-pick', (q, m) => same(idx(q.options, o => angleKind(H.num(H.strip(o))) === m.want), q.answer) ? '' : 'picks');
  set('sh4-rect-pick', (q, m) => same(idx(m.names, n => n === 'rectangle' || n === 'square'), q.answer) ? '' : 'picks');
  set('sh4-rect-tf', (q, m) => RECT_FACTS[m.fact] === q.answer ? '' : 'truth');
  set('sh4-rect-fill', q => q.answers.join() === '4,2,2' ? '' : 'facts');
  set('sh4-sym-tap', (q, m) => LINES[m.names[q.answer]] === (/no lines/.test(q.q) ? 0 : H.num(bold(q))) && new Set(m.names.map(n => LINES[n])).size === 3 ? '' : 'shape');
  set('sh4-sym-match', (q, m) => q.pairs.every((p, i) => H.num(p[1]) === LINES[m.names[i]]) ? '' : 'pairs');
  set('sh4-sym-tf', (q, m) => (LINES[m.name] === m.said) === q.answer ? '' : 'truth');
  set('sh4-coord-tap', (q, m) => { const hit = onlyAt(m.pts, m.x, m.y); return hit.length === 1 && hit[0].key === q.answer && bold(q) === '(' + m.x + ', ' + m.y + ')' ? '' : 'point'; });
  set('sh4-coord-fill', (q, m) => q.answers[0] === m.x && q.answers[1] === m.y && q.fig.includes('A (' + m.x + ', ' + m.y + ')') ? '' : 'pair');
  set('sh4-coord-tf', (q, m) => (m.said[0] === m.x && m.said[1] === m.y) === q.answer ? '' : 'truth');
  const slide = (x, y, t) => { const r = t.match(/(\d+) units? right/), l = t.match(/(\d+) units? left/), u = t.match(/(\d+) units? up/), d = t.match(/(\d+) units? down/); return [x + (r ? +r[1] : 0) - (l ? +l[1] : 0), y + (u ? +u[1] : 0) - (d ? +d[1] : 0)]; };
  set('sh4-trans-tap', (q, m) => { const e = slide(m.x, m.y, bold(q)), hit = onlyAt(m.pts, e[0], e[1]); return hit.length === 1 && hit[0].key === q.answer ? '' : 'landing'; });
  set('sh4-trans-fill', (q, m) => slide(m.x, m.y, bold(q)).join() === q.answers.join() ? '' : 'landing');
  set('sh4-trans-tf', (q, m) => (slide(m.x, m.y, H.strip(q.q)).join() === m.said.join()) === q.answer ? '' : 'truth');
  set('sh4-refl-tap', (q, m) => { const ix = m.m + (m.m - m.x), hit = onlyAt(m.pts, ix, m.y); return hit.length === 1 && hit[0].key === q.answer ? '' : 'image'; });
  set('sh4-refl-fill', (q, m) => q.answers[0] - m.m === m.m - m.x && q.answers[1] === m.y ? '' : 'image');
  set('sh4-refl-tf', (q, m) => (m.said - m.m === m.m - m.x) === q.answer ? '' : 'truth');
  /* ---- Measuring ---- */
  /* "2 kg 300 g" -> 2300 (grams); "1 L 500 mL" -> 1500 (millilitres) */
  const grams = t => { const s = H.strip(t), kg = s.match(/([\d ]+?)\s*kg/), g = s.match(/([\d ]+?)\s*g\b/); return (kg ? H.num(kg[1]) * 1000 : 0) + (g ? H.num(g[1]) : 0); };
  const PER = { 'm-cm': 100, 'cm-mm': 10, 'km-m': 1000 };
  const KIND = { mm: 'length', cm: 'length', m: 'length', km: 'length', g: 'mass', kg: 'mass', mL: 'capacity', L: 'capacity' };
  /* "2:15 p.m." -> minutes after midnight */
  const clock24 = t => { const m = t.match(/(\d+):(\d\d)/); return (+m[1] % 12 + (/p\.m\./.test(t) ? 12 : 0)) * 60 + +m[2]; };
  set('me4-mass-match', (q, m) => m.pairs.every(p => grams(p[0]) === grams(p[1])) ? '' : 'pairs');
  set('me4-mass-line', q => q.answer === grams(bold(q)) ? '' : 'mass');
  set('me4-mass-tf', (q, m) => (m.kg * 1000 === m.said) === q.answer ? '' : 'truth');
  set('me4-mass-order', q => rising(q.items.map(grams)) ? '' : 'order');
  set('me4-cap-line', q => q.answer === H.num(bold(q)) ? '' : 'amount');
  set('me4-cap-fill', q => { const n = H.strip(q.fill).match(/\d+/g).map(Number); return q.answers[0] === n[0] * 1000 && q.answers[1] === n[1] * 1000 + n[2] ? '' : 'mL'; });
  set('me4-cap-tf', (q, m) => (m.said * m.c === 1000) === q.answer ? '' : 'truth');
  set('me4-unit-pick', (q, m) => same(idx(q.options, u => KIND[u] === m.kind), q.answer) ? '' : 'picks');
  set('me4-unit-fill', (q, m) => q.answers[0] === m.n * PER[m.from + '-' + m.to] ? '' : 'convert');
  set('me4-unit-tf', (q, m) => (m.said === m.n * PER[m.from + '-' + m.to]) === q.answer ? '' : 'truth');
  const minutes = t => { const h = t.match(/(\d+) hours?/), mn = t.match(/(\d+) minutes?/); return (h ? +h[1] * 60 : 0) + (mn ? +mn[1] : 0); };
  set('me4-time-line', (q, m) => q.answer - clock24(bold(q, 0)) === minutes(bold(q, 1)) && minutes(bold(q, 1)) === m.len ? '' : 'end time');
  set('me4-time-fill', (q, m) => { const top = Math.ceil((m.a + 1) / 60) * 60; return q.answers.join() === [top - m.a, m.b - top, m.b - m.a].join() ? '' : 'minutes'; });
  set('me4-time-tf', (q, m) => (m.b - m.a === m.said) === q.answer ? '' : 'truth');
  set('me4-area-tap', (q, m) => { const want = H.num(bold(q)); return m.sets[q.answer][0] * m.sets[q.answer][1] === want && m.sets.filter(s => s[0] * s[1] === want).length === 1 ? '' : 'rectangle'; });
  set('me4-area-match', (q, m) => m.pairs.every(p => { const n = p[0].match(/\d+/g).map(Number); return n[0] * n[1] === H.num(p[1].replace(/<sup>2<\/sup>/, '')); }) ? '' : 'pairs');
  set('me4-area-tf', (q, m) => (m.l * m.w === m.said) === q.answer ? '' : 'truth');
  set('me4-side-fill', (q, m) => q.answers[0] * m.w === m.a && q.answers[1] === q.answers[0] ? '' : 'side');
  set('me4-side-pick', (q, m) => same(idx(q.options, o => { const n = o.match(/\d+/g).map(Number); return n[0] * n[1] === m.a; }), q.answer) ? '' : 'picks');
  set('me4-side-tf', (q, m) => (m.said * m.w === m.a) === q.answer ? '' : 'truth');
  /* ---- Money ---- */
  const dollars = t => H.num(H.strip(t).replace('$', ''));
  const PAYS_DO = [[/^Cash/, /Bills and coins/], [/^Debit/, /right away/], [/^Credit/, /Borrows/], [/^Gift/, /one store/], [/^Phone/, /linked/], [/^E-transfer/, /online/]];
  const PAY_TRUE = { 'A debit card uses money that is already in your bank account.': true, 'A credit card borrows money that you pay back later.': true, 'A store gift card works at any store.': false, 'Tapping a phone to pay is free money.': false, 'Paying a credit card late costs extra.': true, 'Cash comes out of your bank account each time you spend it.': false };
  /* the money word for an example, read from what happens to the money */
  const moneyWord = t => /so (his|her|their|the) .* can .* more/.test(t) ? 'investing' : /\bbuys\b/.test(t) ? 'spending' : /\bgives\b|\bsends\b/.test(t) ? 'donating' : /piggy bank|\bkeeps\b/.test(t) ? 'saving' : /\bgets\b|paid/.test(t) ? 'earning' : '?';
  set('mo4-pay-match', (q, m) => m.pairs.every(p => PAYS_DO.some(r => r[0].test(p[0]) && r[1].test(p[1]))) ? '' : 'pairs');
  set('mo4-pay-tf', (q, m) => PAY_TRUE[m.fact] === q.answer ? '' : 'truth');
  set('mo4-pay-pick', q => same(idx(q.options, o => !/cash|loonies/i.test(o)), q.answer) ? '' : 'picks');
  set('mo4-total-fill', (q, m) => q.answers[0] === m.items[0][1] + m.items[1][1] ? '' : 'total');
  set('mo4-total-story', q => H.num(bold(q, 0)) * dollars(bold(q, 1)) + dollars(bold(q, 2)) === q.answer ? '' : 'total');
  set('mo4-total-tf', (q, m) => (m.items.reduce((a, it) => a + it[1], 0) === m.said) === q.answer ? '' : 'truth');
  set('mo4-change-line', (q, m) => q.answer + dollars(bold(q, 0)) === dollars(bold(q, 1)) ? '' : 'change');
  set('mo4-change-fill', (q, m) => m.t + q.answers[0] === Math.ceil(m.t / 10) * 10 && q.answers[0] + q.answers[1] === q.answers[2] && m.t + q.answers[2] === m.pay ? '' : 'change');
  set('mo4-change-tf', (q, m) => (m.t + m.said === m.pay) === q.answer ? '' : 'truth');
  set('mo4-con-match', (q, m) => m.pairs.every(p => moneyWord(p[0]) === p[1].toLowerCase()) ? '' : 'pairs');
  set('mo4-con-tf', (q, m) => (moneyWord(m.text) === m.said) === q.answer ? '' : 'truth');
  set('mo4-con-pick', (q, m) => same(idx(q.options, o => moneyWord(o) === m.want), q.answer) ? '' : 'picks');
  set('mo4-save-line', (q, m) => q.answer === dollars(bold(q, 0)) * H.num(bold(q, 1)) ? '' : 'savings');
  set('mo4-save-fill', (q, m) => q.answers.join() === [2, 3, 5].map(w => w * m.per).join() ? '' : 'table');
  set('mo4-save-tf', (q, m) => { let saved = 0, w = 0; while (saved < m.goal) { saved += m.per; w++; } return (w === m.said) === q.answer ? '' : 'truth'; });
  set('mo4-value-tap', (q, m) => m.ps[q.answer] === Math.min(...m.ps) && new Set(m.ps).size === 3 ? '' : 'best price');
  set('mo4-value-fill', q => q.answers[0] * H.num(bold(q, 0)) === dollars(bold(q, 1)) ? '' : 'each');
  set('mo4-value-tf', (q, m) => ((m.price + m.ship < m.other) === m.saysOnline) === q.answer ? '' : 'truth');
})(window.__verify, window.__H);
