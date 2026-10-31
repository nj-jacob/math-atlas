/* Answer checks for Grade 1 question shapes. Each check gets (q, q.meta, helpers) and returns
   an error message, or '' when the answer is right. Work the answer out here independently:
   count what is drawn and read the numbers from the question, never copy the site's own calculation. */
(function (V, H) {
  const set = (k, fn) => { if (V[k]) console.error('Two answer checks share the key ' + k); V[k] = fn; };
  const bold = q => H.strip((q.q.match(/<b>([^<]+)<\/b>/) || [])[1] || '');
  const nums = t => (H.strip(t).match(/\d+/g) || []).map(Number);
  const same = (a, b) => a.slice().sort().join() === b.slice().sort().join();
  /* things drawn in a picture: object icons, and counters in ten frames */
  const icons = svg => (String(svg).match(/<g transform="translate\(/g) || []).length;
  const counters = svg => (String(svg).match(/fill:var\(--c[AB]\)/g) || []).length;
  const tapTile = (q, count, want) => { const c = q.tiles.map(count); return c.filter(x => x === want).length === 1 && c[q.answer] === want ? '' : 'tile ' + c.join('/') + ' want ' + want; };
  const tfWhy = (q, truth) => truth === q.answer ? '' : 'truth';
  /* ---- Counting to 50 ---- */
  set('g1-count-tap', (q, m) => tapTile(q, icons, +bold(q)));
  set('g1-count-tf', (q, m) => icons(q.fig) === m.n ? tfWhy(q, m.said === icons(q.fig)) : 'picture shows ' + icons(q.fig));
  set('g1-count-line', q => icons(q.fig) === q.answer ? '' : 'count');
  set('g1-frames-tap', q => tapTile(q, counters, +bold(q)));
  set('g1-frames-match', q => q.pairs.every(p => counters(p[0]) === +p[1]) ? '' : 'pairs');
  set('g1-frames-fill', q => { const c = counters(q.fig), a = q.answers; return a[2] === c && a[0] === Math.floor(c / 10) && a[1] === c % 10 ? '' : 'frames ' + c; });
  set('g1-words-match', q => q.pairs.every(p => H.fromWords(p[0]) === +p[1]) ? '' : 'pairs');
  set('g1-words-tap', q => tapTile(q, counters, H.fromWords(bold(q))));
  set('g1-words-tf', (q, m) => tfWhy(q, H.fromWords(m.w) === m.said));
  set('g1-next-line', (q, m) => { const n = nums(q.q)[0]; return q.answer === (/after/.test(q.q) ? n + 1 : n - 1) ? '' : 'neighbour'; });
  set('g1-next-fill', q => { const n = nums(q.fill)[0]; return q.answers[0] === n - 1 && q.answers[1] === n + 1 ? '' : 'neighbours'; });
  set('g1-next-story', q => { const v = nums(q.q); return v[0] + v[1] === q.answer ? '' : 'count on'; });
  set('g1-skip-order', q => { const v = q.items.map(Number), by = nums(q.q)[0]; return v.every((x, i) => !i || x - v[i - 1] === by) && v[0] % by === 0 ? '' : 'sequence'; });
  set('g1-skip-fill', q => { const s = H.strip(q.fill).split(',').map(x => x.trim()), f = [+s[0], +s[1], q.answers[0], +s[3], q.answers[1]], by = nums(q.q)[0]; return f.every((x, i) => !i || x - f[i - 1] === by) ? '' : 'sequence'; });
  set('g1-skip-pick', (q, m) => { const by = nums(q.q)[0], exp = m.opts.map((v, j) => v % by === 0 ? j : -1).filter(j => j >= 0); return same(exp, q.answer) ? '' : 'picks'; });
  const closest = (n, marks) => marks.slice().sort((a, b) => Math.abs(a - n) - Math.abs(b - n))[0];
  set('g1-est-tap', (q, m) => { const c = q.tiles.map(icons), hits = c.map((n, i) => closest(n, m.marks) === m.target ? i : -1).filter(i => i >= 0); return hits.length === 1 && hits[0] === q.answer && +bold(q).replace(/\D/g, '') === m.target ? '' : 'tile ' + c.join('/'); });
  set('g1-est-match', (q, m) => q.pairs.every(p => closest(icons(p[0]), m.marks) === nums(p[1])[0]) ? '' : 'pairs ' + q.pairs.map(p => icons(p[0])).join('/'));
  set('g1-est-tf', (q, m) => tfWhy(q, closest(icons(q.fig), m.marks) === m.said));
  /* ---- Tens and Ones ---- */
  const blockVal = svg => 10 * (String(svg).match(/fill:var\(--p1\)/g) || []).length + (String(svg).match(/fill:var\(--p0\)/g) || []).length;
  const allBold = q => [...q.q.matchAll(/<b>([^<]+)<\/b>/g)].map(x => H.strip(x[1]));
  const tensOnes = t => { const g = H.strip(t).match(/(\d+) tens? and (\d+) ones?/); return +g[1] * 10 + +g[2]; };
  set('g1-read-build', q => q.answer === +bold(q) ? '' : 'target');
  set('g1-read-tap', q => tapTile(q, blockVal, +bold(q)));
  set('g1-read-match', q => q.pairs.every(p => blockVal(p[0]) === +p[1]) ? '' : 'pairs');
  set('g1-read-tf', (q, m) => tfWhy(q, blockVal(q.fig) === m.said));
  set('g1-parts-fill', q => { const n = nums(q.fill)[0]; return q.answers[0] * 10 + q.answers[1] === n && q.answers[1] < 10 ? '' : 'parts'; });
  set('g1-parts-build', q => q.answer === tensOnes(q.q) ? '' : 'target');
  set('g1-parts-match', q => q.pairs.every(p => tensOnes(p[0]) === +p[1]) ? '' : 'pairs');
  set('g1-ten-line', q => { const n = nums(q.q)[0]; return q.answer === (/more/.test(q.q) ? n + 10 : n - 10) ? '' : 'ten'; });
  set('g1-ten-fill', q => { const n = nums(q.fill)[0]; return q.answers[0] === n - 10 && q.answers[1] === n + 10 ? '' : 'ten'; });
  set('g1-ten-story', q => { const n = nums(q.q)[0]; return q.answer === (/gets/.test(q.q) ? n + 10 : n - 10) ? '' : 'story'; });
  set('g1-split-match', q => { const w = +bold(q); return q.pairs.every(p => nums(p[0])[0] + +p[1] === w) ? '' : 'pairs'; });
  set('g1-split-story', q => { const v = nums(q.q); return v[0] - v[1] === q.answer ? '' : 'part'; });
  set('g1-split-pick', (q, m) => { const w = +bold(q); return same(m.opts.map((t, j) => H.sum(t) === w ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks'; });
  set('g1-cmp-tap', q => { const v = q.tiles.map(blockVal), want = /greater/.test(q.q) ? Math.max(...v) : Math.min(...v); return v[0] !== v[1] && v[q.answer] === want ? '' : 'tile'; });
  set('g1-cmp-tf', q => { const b = allBold(q).map(Number); return tfWhy(q, b[0] > b[1]); });
  set('g1-cmp-pick', (q, m) => { const x = nums(q.q)[0], more = /greater/.test(q.q); return same(m.opts.map((v, j) => (more ? v > x : v < x) ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks'; });
  set('g1-order-up', q => { const v = q.items.map(Number); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
  set('g1-order-story', q => { const pairs = [...H.strip(q.q).matchAll(/([A-Z][a-z]+) picked (\d+)/g)].map(x => [x[1], +x[2]]); const most = /most/.test(q.q); pairs.sort((a, b) => most ? b[1] - a[1] : a[1] - b[1]); return pairs.length === 3 && q.options[q.answer] === pairs[0][0] ? '' : 'winner'; });
  set('g1-order-tf', q => { const v = nums(q.q.split(':')[1]).slice(0, 3); return tfWhy(q, v[0] < v[1] && v[1] < v[2]); });
  /* ---- Adding and Subtracting to 10 ---- */
  const reds = svg => (String(svg).match(/fill:var\(--cA\)/g) || []).length;
  const yellows = svg => (String(svg).match(/fill:var\(--cB\)/g) || []).length;
  const crossed = svg => (String(svg).match(/<path d="M/g) || []).length;
  const empty = svg => (String(svg).match(/stroke-dasharray/g) || []).length;
  /* every "a + b = c" or "a − b = c" in a text, as [a, sign, b, c] */
  const facts = t => [...H.strip(t).matchAll(/(\d+) ([+−]) (\d+) = (\d+)/g)].map(x => [+x[1], x[2], +x[3], +x[4]]);
  const isTrue = f => (f[1] === '+' ? f[0] + f[2] : f[0] - f[2]) === f[3];
  const firstOp = t => { const x = H.strip(t).match(/(\d+) ([+−]) (\d+)/); return x[2] === '+' ? +x[1] + +x[3] : +x[1] - +x[3]; };
  set('g1-add-tap', q => { const x = H.strip(q.q).match(/(\d+) \+ (\d+)/), hits = q.tiles.map(t => reds(t) === +x[1] && yellows(t) === +x[2]); return hits.filter(Boolean).length === 1 && hits[q.answer] ? '' : 'tile'; });
  set('g1-add-line', q => { const v = nums(q.q); return v[0] + v[1] === q.answer ? '' : 'landing'; });
  set('g1-add-match', q => q.pairs.every(p => H.sum(p[0]) === +p[1]) ? '' : 'pairs');
  set('g1-add-tf', q => { const f = facts(q.q)[0]; return tfWhy(q, f[0] + f[2] === f[3]); });
  set('g1-ten10-tap', q => tapTile(q, t => empty(t), +bold(q)));
  set('g1-ten10-match', q => q.pairs.every(p => 10 - counters(p[0]) === +p[1] && empty(p[0]) === +p[1]) ? '' : 'pairs');
  set('g1-ten10-story', q => 10 - nums(q.q)[1] === q.answer ? '' : 'more');
  set('g1-ten10-pick', (q, m) => same(m.opts.map((t, j) => H.sum(t) === 10 ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('g1-facts-match', q => q.pairs.every(p => { const v = nums(p[0]); return v[0] === v[1] && v[0] * 2 === +p[1]; }) ? '' : 'pairs');
  set('g1-facts-tap', q => { const d = q.tiles.map(t => reds(t) === yellows(t)); return d.filter(Boolean).length === 1 && d[q.answer] ? '' : 'double'; });
  set('g1-facts-tf', q => { const f = facts(q.q); return f[0][0] === f[1][2] && f[0][2] === f[1][0] ? tfWhy(q, f[0][3] === f[1][3]) : 'not a turn-around'; });
  set('g1-sub-line', q => { const v = nums(q.q); return v[0] - v[1] === q.answer ? '' : 'landing'; });
  set('g1-sub-tap', q => { const x = H.strip(q.q).match(/(\d+) − (\d+)/), hits = q.tiles.map(t => counters(t) === +x[1] && crossed(t) === +x[2]); return hits.filter(Boolean).length === 1 && hits[q.answer] ? '' : 'tile'; });
  set('g1-sub-tf', q => tfWhy(q, isTrue(facts(q.q)[0])));
  set('g1-fam-fill', q => { const rows = q.fill.split('<br>').map(r => nums(r)); return rows[1][0] - rows[1][1] === q.answers[0] && rows[2][0] - rows[2][1] === q.answers[1] && rows[0][0] + rows[0][1] === rows[1][0] ? '' : 'family'; });
  set('g1-fam-pick', q => { const f = facts(q.q)[0], fam = [f[0], f[2], f[3]].sort().join(); const exp = q.options.map((o, j) => { const g = facts(o)[0]; return isTrue(g) && [g[0], g[2], g[3]].sort().join() === fam ? j : -1; }).filter(j => j >= 0); return same(exp, q.answer) ? '' : 'picks'; });
  set('g1-fam-match', q => q.pairs.every(p => firstOp(p[0]) === +p[1]) ? '' : 'pairs');
  const isAddStory = t => /gets|finds/.test(t) ? true : /eats|gives away|loses/.test(t) ? false : null;
  set('g1-story-way', q => { const add = isAddStory(q.q); return add !== null && q.options[q.answer] === (add ? 'Add' : 'Subtract') ? '' : 'operation'; });
  set('g1-story-fill', q => { const v = nums(q.q), add = isAddStory(q.q); return q.answers[0] === (add ? v[0] + v[1] : v[0] - v[1]) && firstOp(q.fill) === q.answers[0] ? '' : 'sentence'; });
  set('g1-story-tf', q => { const v = nums(q.q); return tfWhy(q, v[0] - v[1] === v[2]); });
  /* ---- Adding and Subtracting to 50 ---- */
  set('g1-20-fill', q => { const r = q.fill.split('<br>'), v = nums(r[0]); return v[2] + v[3] === 10 && v[3] + q.answers[0] === v[1] && q.answers[1] === q.answers[0] && q.answers[2] === v[0] + v[1] && 10 + q.answers[1] === q.answers[2] ? '' : 'make ten'; });
  set('g1-20-line', q => { const v = nums(q.q); return v[0] + v[1] === q.answer ? '' : 'landing'; });
  set('g1-20-tap', q => { const x = H.strip(q.q).match(/(\d+) \+ (\d+)/), hits = q.tiles.map(t => reds(t) === +x[1] && yellows(t) === +x[2]); return hits.filter(Boolean).length === 1 && hits[q.answer] ? '' : 'tile'; });
  set('g1-20-tf', q => tfWhy(q, isTrue(facts(q.q)[0])));
  set('g1-tens-line', q => { const v = nums(q.q), back = /back/.test(q.q); return q.answer === v[0] + (back ? -10 : 10) * v[1] ? '' : 'landing'; });
  set('g1-tens-build', q => q.answer === firstOp(q.q) ? '' : 'build');
  set('g1-tens-match', q => q.pairs.every(p => firstOp(p[0]) === +p[1]) ? '' : 'pairs');
  set('g1-two-build', q => q.answer === firstOp(q.q) ? '' : 'build');
  set('g1-two-tf', q => tfWhy(q, isTrue(facts(q.q)[0])));
  const subStory = t => /are left|How many more|eats/.test(H.strip(t));
  set('g1-bstory-way', q => q.options[q.answer] === (subStory(q.q) ? 'Subtract' : 'Add') ? '' : 'operation');
  set('g1-bstory-fill', q => { const v = nums(q.q), a = q.answers, sub = subStory(q.q); return a[0] === v[0] && a[1] === v[1] && a[2] === (sub ? v[0] - v[1] : v[0] + v[1]) ? '' : 'sentence'; });
  set('g1-bstory-tf', q => { const v = nums(q.q); return tfWhy(q, v[0] - v[1] === v[2]); });
  const sides = t => { const v = nums(t); return v[0] + v[1] === v[2] + v[3]; };
  set('g1-eq-tap', q => { const t = q.tiles.map(sides); return t.filter(Boolean).length === 1 && t[q.answer] ? '' : 'true one'; });
  set('g1-eq-pick', q => same(q.options.map((o, j) => sides(o) ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('g1-eq-match', q => { const tot = q.pairs.map(p => H.sum(p[0])); return q.pairs.every(p => H.sum(p[0]) === H.sum(p[1])) && new Set(tot).size === tot.length ? '' : 'pairs'; });
  set('g1-eq-tf', q => tfWhy(q, sides(q.q)));
  /* ---- Equal Groups and Fair Shares ---- */
  const cookies = svg => (String(svg).match(/<circle[^>]*fill:#c98a4b/g) || []).length;
  const platesIn = svg => (String(svg).match(/<ellipse/g) || []).length / 2;
  const svgs = h => String(h).split('<svg').slice(1);
  /* the widths of the parts of a drawn bar; equal when every width matches */
  const barParts = svg => [...String(svg).matchAll(/<rect [^>]*?\swidth="([\d.]+)"/g)].map(x => +x[1]);
  const equalParts = svg => { const w = barParts(svg); return w.every(x => Math.abs(x - w[0]) < 0.01); };
  /* a pizza: its equal parts are the cut lines from the middle, shaded parts are the red slices */
  const slices = svg => (String(svg).match(/<line/g) || []).length || 1;
  const shaded = svg => (String(svg).match(/fill:var\(--cA\)/g) || []).length;
  const FRW = { whole: 1, half: 2, halves: 2, third: 3, fourth: 4, fourths: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10 };
  const den = t => FRW[H.strip(t).split(' ').pop()];
  set('g1-groups-tap', q => { const x = nums(bold(q)), hits = q.tiles.map(t => platesIn(t) === x[0] && cookies(t) === x[0] * x[1]); return hits.filter(Boolean).length === 1 && hits[q.answer] ? '' : 'tile'; });
  set('g1-groups-story', q => { const v = nums(q.q); return v[0] * v[1] === q.answer ? '' : 'total'; });
  set('g1-groups-fill', q => { const g = platesIn(q.fig), each = cookies(q.fig) / g, a = q.answers; return a.length === g + 1 && a.slice(0, g).every(x => x === each) && a[g] === cookies(q.fig) ? '' : 'groups'; });
  set('g1-share-tap', q => { const fair = q.tiles.map(t => { const c = svgs(t).map(cookies); return c[0] === c[1]; }); return fair.filter(Boolean).length === 1 && fair[q.answer] ? '' : 'fair'; });
  set('g1-share-tf', q => { const v = nums(q.q); return tfWhy(q, Math.floor(v[0] / 2) === v[1]); });
  set('g1-share-fill', q => { const v = nums(q.q); return q.answers[0] === Math.floor(v[0] / v[1]) && q.answers[1] === v[0] % v[1] ? '' : 'share'; });
  set('g1-half-pick', q => same(q.options.map((o, j) => equalParts(o) ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('g1-half-tf', q => { const want = /halves/.test(bold(q)) ? 2 : 4; return tfWhy(q, equalParts(q.fig) && barParts(q.fig).length === want); });
  set('g1-half-match', q => q.pairs.every(p => equalParts(p[0]) && barParts(p[0]).length === den(p[1])) ? '' : 'pairs');
  set('g1-pname-match', q => q.pairs.every(p => slices(p[0]) === den(p[1])) ? '' : 'pairs');
  set('g1-pname-tap', q => { const d = den(bold(q)), hits = q.tiles.map(t => slices(t) === d && shaded(t) === 1); return hits.filter(Boolean).length === 1 && hits[q.answer] ? '' : 'tile'; });
  set('g1-pname-fill', q => q.answers[0] === 2 && q.answers[1] === 4 && /^\[\[\]\] halves.*\[\[\]\] fourths/.test(q.fill) ? '' : 'wholes');
  set('g1-pcmp-tap', q => { const n = q.tiles.map(slices), big = /bigger/.test(q.q); return n[q.answer] === (big ? Math.min(...n) : Math.max(...n)) ? '' : 'piece'; });
  set('g1-pcmp-tf', q => { const b = [...q.q.matchAll(/<b>([^<]+)<\/b>/g)].map(x => den(x[1])); return tfWhy(q, b[0] < b[1]); });
  set('g1-pcmp-order', q => { const d = q.items.map(den); return d.every((x, i) => !i || x > d[i - 1]) ? '' : 'order'; });
  /* ---- Patterns ---- */
  const COL = { '#e04b3a': 'red circle', '#2c68cf': 'blue square', '#f2bd24': 'yellow triangle', '#2f9a4c': 'green star', '#8441bd': 'purple circle', '#ee7d24': 'orange heart' };
  /* the shapes in a drawn row, left to right; a blank box reads as null */
  const shapesIn = svg => [...String(svg).matchAll(/fill:(#[0-9a-f]{6}|none)/g)].map(x => x[1] === 'none' ? null : COL[x[1]]).filter(x => x !== undefined);
  const period = s => { for (let p = 1; p <= s.length / 2; p++) if (s.every((x, i) => i < p || x === null || s[i - p] === null || x === s[i - p])) return p; return 0; };
  const lettersOf = s => { const m = {}; let c = 65; return s.map(x => m[x] || (m[x] = String.fromCharCode(c++))).join(' '); };
  const fillAt = (s, i) => { const p = period(s); for (let j = i % p; j < s.length; j += p) if (s[j]) return s[j]; return null; };
  set('g1-pnext-tf', q => { const s = shapesIn(q.fig), blank = s.indexOf(null); return tfWhy(q, fillAt(s, blank) === bold(q)); });
  set('g1-pnext-tap', q => { const ok = q.tiles.map(t => { const s = shapesIn(t), head = s.slice(0, -1); return fillAt(head.concat([null]), head.length) === s[s.length - 1]; }); return ok.filter(Boolean).length === 1 && ok[q.answer] ? '' : 'row'; });
  set('g1-pnext-story', q => { const t = H.strip(q.q), list = t.split(':')[1].split(', and so on')[0].split(',').map(x => x.trim()), pos = nums(t).pop(), p = period(list); return p && q.options[q.answer] === list[(pos - 1) % p] ? '' : 'bead'; });
  set('g1-pmiss-tap', (q, m) => { const s = shapesIn(q.pic), a = +q.answer, p = m.p; return a >= p && s[a] !== s[a % p] && s.every((x, j) => j === a || x === s[j % p]) ? '' : 'wrong shape'; });
  set('g1-pmiss-tf', q => { const s = shapesIn(q.fig); return tfWhy(q, fillAt(s, s.indexOf(null)) === bold(q)); });
  set('g1-pmiss-match', q => q.pairs.every(p => { const s = shapesIn(p[0]); return fillAt(s, s.indexOf(null)) === p[1]; }) ? '' : 'pairs');
  set('g1-pcore-tap', q => { const ok = q.tiles.map(t => period(shapesIn(t)) > 0); return ok.filter(Boolean).length === 1 && ok[q.answer] ? '' : 'pattern'; });
  set('g1-pcore-match', q => q.pairs.every(p => { const s = shapesIn(p[0]); return lettersOf(s.slice(0, period(s))) === p[1]; }) ? '' : 'pairs');
  set('g1-pcore-tf', q => { const s = shapesIn(q.fig); return tfWhy(q, s.slice(0, period(s)).join(', ') === bold(q)); });
  set('g1-pnum-fill', q => { const s = H.strip(q.fill).split(',').map(x => x.trim()), f = [+s[0], +s[1], q.answers[0], +s[3], q.answers[1]], d = f[1] - f[0]; return f.every((x, i) => !i || x - f[i - 1] === d) ? '' : 'pattern'; });
  set('g1-pnum-order', q => { const v = q.items.map(Number), by = nums(bold(q))[0]; return v.every((x, i) => !i || x - v[i - 1] === by) ? '' : 'order'; });
  set('g1-pnum-tf', q => { const v = nums(q.q.split('</span>')[0]); return tfWhy(q, v[1] - v[0] === nums(bold(q))[0]); });
  /* towers: the blocks in each column, read from their x positions */
  const towers = svg => { const c = {}; [...String(svg).matchAll(/<rect x="(\d+)" y="-?\d+" width="30"/g)].forEach(x => { c[x[1]] = (c[x[1]] || 0) + 1; }); return Object.keys(c).map(Number).sort((a, b) => a - b).map(k => c[k]); };
  const grows = svg => { const t = towers(svg); return t.some((x, i) => i && x !== t[i - 1]); };
  set('g1-pchg-tap', q => { const want = /change/.test(bold(q)), ok = q.tiles.map(t => grows(t) === want); return ok.filter(Boolean).length === 1 && ok[q.answer] ? '' : 'tower'; });
  set('g1-pchg-match', q => q.pairs.every(p => grows(p[0]) === (p[1] === 'It changes')) ? '' : 'pairs');
  set('g1-pchg-fill', q => { const t = towers(q.fig), d = t[1] - t[0]; return t.every((x, i) => !i || x - t[i - 1] === d) && q.answers[0] === t[2] + d && q.answers[1] === d ? '' : 'rule'; });
  /* ---- Shapes, Position and Coding ---- */
  const FLATCOL = { '#e04b3a': ['circle', 0], '#2f9a4c': ['triangle', 3], '#2c68cf': ['square', 4], '#f2bd24': ['rectangle', 4], '#8441bd': ['hexagon', 6] };
  const flatOf = svg => FLATCOL[(String(svg).match(/fill:(#[0-9a-f]{6})/) || [])[1]] || [];
  const hitPart = (pic, key) => { const d = document.createElement('div'); d.innerHTML = pic; return d.querySelector('[data-hit="' + key + '"]').innerHTML; };
  set('g1-2d-tap', q => flatOf(hitPart(q.pic, q.answer))[0] === bold(q) ? '' : 'shape');
  set('g1-2d-match', q => q.pairs.every(p => flatOf(p[0])[0] === p[1]) ? '' : 'pairs');
  set('g1-2d-pick', q => { const n = nums(bold(q))[0]; return same(q.options.map((o, j) => flatOf(o)[1] === n ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks'; });
  set('g1-2d-tf', q => tfWhy(q, flatOf(q.fig)[1] === nums(bold(q))[0]));
  /* solids: named in the picture's label; what each one is like is listed here */
  const SOLID = { cube: ['a number cube (a die)', 0], sphere: ['a ball', 1], cylinder: ['a soup can', 1], cone: ['an ice cream cone', 1], 'rectangular prism': ['a cereal box', 0], pyramid: ['a tent', 0] };
  const solidOf = svg => (String(svg).match(/aria-label="a ([a-z ]+)"/) || [])[1];
  set('g1-3d-match', q => q.pairs.every(p => SOLID[solidOf(p[0])][0] === p[1]) ? '' : 'pairs');
  set('g1-3d-pick', q => same(q.options.map((o, j) => SOLID[solidOf(o)][1] ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('g1-3d-tf', q => { const b = [...q.q.matchAll(/<b>([^<]+)<\/b>/g)].map(x => H.strip(x[1])); return tfWhy(q, SOLID[b[1]][0] === b[0]); });
  /* fold lines that make matching halves */
  const MIRROR = ['square v', 'square d', 'circle v', 'rectangle v', 'rectangle h', 'triangle v', 'heart v', 'hexagon h'];
  const mirrors = it => MIRROR.includes(it[0] + ' ' + it[1]);
  set('g1-sym-tap', (q, m) => { const ok = m.items.map(mirrors); return ok.filter(Boolean).length === 1 && ok[q.answer] ? '' : 'fold'; });
  set('g1-sym-pick', (q, m) => same(m.items.map((it, j) => mirrors(it) ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks');
  set('g1-sym-tf', (q, m) => tfWhy(q, mirrors([m.sh, m.line]) === m.says));
  /* the shelf is 3 by 3, read left to right, top to bottom */
  const NAMES1 = { apple: 'apple', ball: 'ball', star: 'star', fish: 'fish', flower: 'flower', car: 'car', leaf: 'leaf', sock: 'sock', cube: 'cube' };
  const place = (items, word, of) => { const i = items.findIndex(k => NAMES1[k] === of), r = Math.floor(i / 3), c = i % 3; const to = word === 'above' ? (r > 0 ? i - 3 : -1) : word === 'below' ? (r < 2 ? i + 3 : -1) : word === 'to the left of' ? (c > 0 ? i - 1 : -1) : (c < 2 ? i + 1 : -1); return to; };
  set('g1-pos-tap', (q, m) => { const t = H.strip(q.q).match(/what is (above|below|to the left of|to the right of) the (\w+)/); return String(place(m.items, t[1], t[2])) === String(q.answer) ? '' : 'place'; });
  set('g1-pos-tf', (q, m) => { const t = H.strip(q.q).match(/the (\w+) is (above|below|to the left of|to the right of) the (\w+)/); return tfWhy(q, m.items[place(m.items, t[2], t[3])] === t[1]); });
  set('g1-pos-match', (q, m) => q.pairs.every(p => { const t = p[0].match(/^(above|below|to the left of|to the right of) the (\w+)$/); return NAMES1[m.items[place(m.items, t[1], t[2])]] === p[1]; }) ? '' : 'pairs');
  /* the robot: read the arrows from the question and walk them */
  const STEP = { '↑': [0, -1], '↓': [0, 1], '←': [-1, 0], '→': [1, 0] };
  const walk = (start, t) => [...H.strip(t).split('(')[0]].filter(ch => STEP[ch]).reduce((p, ch) => [p[0] + STEP[ch][0], p[1] + STEP[ch][1]], start);
  set('g1-code-tap', (q, m) => walk(m.start, q.q).join(',') === q.answer ? '' : 'stop');
  set('g1-code-fill', (q, m) => { const t = String(q.fig).match(/translate\(([\d.]+) ([\d.]+)\)/), goal = [Math.round((+t[1] - 30) / 52), Math.round((+t[2] - 30) / 52)]; return m.start[0] + q.answers[0] === goal[0] && m.start[1] + q.answers[1] === goal[1] ? '' : 'code'; });
  set('g1-code-tf', (q, m) => tfWhy(q, walk(m.start, q.q).join() === m.at.join()));
  /* ---- Measuring and the Calendar ---- */
  const ATTR = [[/heav|weigh/, 'mass'], [/long|tall/, 'length'], [/holds|fits/, 'capacity'], [/cover/, 'area']];
  const attrOf = t => (ATTR.find(a => a[0].test(H.strip(t))) || [])[1];
  set('g1-attr-match', q => q.pairs.every(p => attrOf(p[0]) === p[1]) ? '' : 'pairs');
  set('g1-attr-pick', q => { const w = bold(q); return same(q.options.map((o, j) => attrOf(o) === w ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks'; });
  set('g1-attr-tf', q => tfWhy(q, attrOf(H.strip(q.q).match(/"([^"]+)"/)[1]) === bold(q)));
  /* ribbons: each ribbon is a rounded bar 26 units per cube, labelled with its colour */
  const ribbonLens = svg => { const names = [...String(svg).matchAll(/class="tb">(\w+)<\/text>/g)].map(x => x[1]), w = [...String(svg).matchAll(/<rect x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="24" rx="6"/g)].map(x => +x[1] / 26); const o = {}; names.forEach((n, i) => { o[n] = w[i]; }); return o; };
  set('g1-len-tap', q => { const L = q.tiles.map(t => Object.values(ribbonLens(t))[0]), want = /longest/.test(q.q) ? Math.max(...L) : Math.min(...L); return L.filter(x => x === want).length === 1 && L[q.answer] === want ? '' : 'ribbon'; });
  set('g1-len-line', q => Object.values(ribbonLens(q.fig))[0] === q.answer ? '' : 'length');
  set('g1-len-order', q => { const L = ribbonLens(q.fig), v = q.items.map(n => L[n]); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
  set('g1-len-tf', q => { const L = ribbonLens(q.fig), said = bold(q), other = Object.keys(L).find(k => k !== said); return tfWhy(q, L[said] > L[other]); });
  /* area shapes: the coloured squares of a grid shape */
  const filled = svg => (String(svg).match(/fill:#[0-9a-f]{6}" stroke="rgba\(0,0,0,.45\)" stroke-width="1.5"/g) || []).length;
  set('g1-area-tap', q => { const n = q.tiles.map(filled), want = /most/.test(q.q) ? Math.max(...n) : Math.min(...n); return n.filter(x => x === want).length === 1 && n[q.answer] === want ? '' : 'shape'; });
  set('g1-area-tf', q => { const f = String(q.fig).split('<figure>').slice(1).map(filled); return tfWhy(q, f[0] > f[1]); });
  set('g1-area-order', q => { const n = q.items.map(filled); return n.every((x, i) => !i || x > n[i - 1]) ? '' : 'order'; });
  /* the balance: the beam's left end is lower when the left side is heavier */
  const LIGHT_TO_HEAVY = ['feather', 'pencil', 'apple', 'ball', 'book', 'rock', 'pumpkin'];
  const beam = svg => { const m = String(svg).match(/<line x1="([\d.]+)" y1="([\d.-]+)" x2="([\d.]+)" y2="([\d.-]+)" style="stroke:var\(--ink\)" stroke-width="5"/); return +m[2] > +m[4] ? 'L' : +m[2] < +m[4] ? 'R' : '='; };
  const pans = svg => { const m = H.strip(String(svg).match(/aria-label="([^"]+)"/)[1]).match(/the (\w+) on the left and the (\w+) on the right/); return [m[1], m[2]]; };
  const tileName = t => String(t).match(/aria-label="the (\w+)"/)[1];
  set('g1-mass-tap', q => { const s = pans(q.fig), b = beam(q.fig), heavy = b === 'L' ? s[0] : s[1], light = b === 'L' ? s[1] : s[0], want = /heavier/.test(q.q) ? heavy : light; return b !== '=' && tileName(q.tiles[q.answer]) === want && LIGHT_TO_HEAVY.indexOf(heavy) > LIGHT_TO_HEAVY.indexOf(light) ? '' : 'balance'; });
  set('g1-mass-tf', q => { const s = pans(q.fig), b = beam(q.fig); return tfWhy(q, (b === 'L' ? s[0] : s[1]) === bold(q)); });
  set('g1-mass-order', q => { const v = q.items.map(n => LIGHT_TO_HEAVY.indexOf(n)); return v.every((x, i) => x >= 0 && (!i || x > v[i - 1])) ? '' : 'order'; });
  /* jugs: blue cup bands, grouped by the jug they sit in */
  const jugCups = svg => { const c = {}; [...String(svg).matchAll(/<rect x="([\d.]+)" y="[\d.]+" width="[\d.]+" height="12" style="fill:#5aa9e6/g)].forEach(x => { c[x[1]] = (c[x[1]] || 0) + 1; }); return Object.keys(c).map(Number).sort((a, b) => a - b).map(k => c[k]); };
  set('g1-cap-tap', q => { const n = q.tiles.map(t => jugCups(t)[0]), want = /most/.test(q.q) ? Math.max(...n) : Math.min(...n); return n.filter(x => x === want).length === 1 && n[q.answer] === want ? '' : 'jug'; });
  set('g1-cap-fill', q => jugCups(q.fig).join() === q.answers.join() ? '' : 'cups');
  set('g1-cap-tf', q => { const c = jugCups(q.fig); return tfWhy(q, (c[0] > c[1] ? 'A' : 'B') === bold(q)); });
  const WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const SEASONS = { December: 'winter', January: 'winter', February: 'winter', March: 'spring', April: 'spring', May: 'spring', June: 'summer', July: 'summer', August: 'summer', September: 'fall', October: 'fall', November: 'fall' };
  set('g1-cal-order', q => q.items.every((d, i) => !i || WEEK.indexOf(d) === (WEEK.indexOf(q.items[i - 1]) + 1) % 7) ? '' : 'order');
  set('g1-cal-match', q => q.pairs.every(p => SEASONS[p[0]] === p[1]) ? '' : 'pairs');
  set('g1-cal-fill', (q, m) => { const last = new Date(m.yr, m.mo + 1, 0).getDate(), dn = WEEK.indexOf(q.fill.match(/are (\w+)s\./)[1]); let c = 0; for (let d = 1; d <= last; d++) if (new Date(m.yr, m.mo, d).getDay() === dn) c++; return q.answers[0] === last && q.answers[1] === c ? '' : 'calendar'; });
  set('g1-cal-tf', q => { const t = H.strip(q.q).match(/says (\w+) comes just (after|before) (\w+)/), i = WEEK.indexOf(t[3]), want = WEEK[(i + (t[2] === 'after' ? 1 : 6)) % 7]; return tfWhy(q, want === t[1]); });
  /* ---- Sorting and Picture Graphs ---- */
  /* a thing to sort, read from its drawing: colour, shape and size */
  const thingOf = svg => { const t = String(svg), col = /#e04b3a/.test(t) ? 'red' : 'blue', sh = /<circle/.test(t) ? 'circle' : 'square', r = +(t.match(/ r="([\d.]+)"/) || t.match(/ width="([\d.]+)" height/))[1]; return { col, sh, big: /<circle/.test(t) ? r > 18 : r > 36 }; };
  set('g1-sort-pick', q => { const w = bold(q), fits = t => t.col === w || t.sh === w; return same(q.options.map((o, j) => fits(thingOf(o)) ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks'; });
  set('g1-sort-tap', (q, m) => { const v = q.tiles.map(t => m.by === 'colour' ? thingOf(t).col : thingOf(t).sh), odd = v.filter(x => v.filter(y => y === x).length === 1); return odd.length === 1 && v[q.answer] === odd[0] ? '' : 'odd one'; });
  set('g1-sort-match', q => q.pairs.every(p => { const t = thingOf(p[0]); return (t.big ? 'big ' : 'small ') + t.col + ' ' + t.sh === p[1]; }) ? '' : 'pairs');
  const marks = svg => (String(svg).match(/<line/g) || []).length;
  set('g1-tally-tap', q => tapTile(q, marks, +bold(q)));
  set('g1-tally-match', q => q.pairs.every(p => marks(p[0]) === +p[1]) ? '' : 'pairs');
  set('g1-tally-fill', q => { const n = marks(q.fig), bundles = (String(q.fig).match(/stroke:var\(--accent\)/g) || []).length; return q.answers[0] === bundles && q.answers[1] === n - 5 * bundles && q.answers[2] === n ? '' : 'tally'; });
  /* a picture graph: the row labels, and the pictures in each row read from their height on the page */
  const graph = svg => { const t = String(svg), labels = [...t.matchAll(/text-anchor="end" font-size="18" class="tb">([^<]+)</g)].map(x => x[1]), rows = {}; [...t.matchAll(/translate\(([\d.]+) ([\d.]+)\)/g)].forEach(x => { rows[x[2]] = (rows[x[2]] || 0) + 1; }); const all = labels.map((l, i) => 36 + i * 38 + 14); const o = {}; labels.forEach((l, i) => { o[l] = rows[all[i]] || 0; }); return o; };
  set('g1-graph-fill', q => { const g = graph(q.fig), names = [...q.fill.matchAll(/chose ([^.]+)\./g)].map(x => x[1]); return q.answers[0] === g[names[0]] && q.answers[1] === g[names[1]] ? '' : 'rows'; });
  set('g1-graph-tf', q => { const g = graph(q.fig), b = [...q.q.matchAll(/<b>([^<]+)<\/b>/g)].map(x => x[1]); return tfWhy(q, g[b[0]] > g[b[1]]); });
  set('g1-graph-story', q => { const g = graph(q.fig); return g[bold(q)] + nums(q.q.split('Then')[1])[0] === q.answer ? '' : 'story'; });
  set('g1-dorder-order', q => { const g = graph(q.fig), v = q.items.map(n => g[n]); return v.every((x, i) => !i || x < v[i - 1]) ? '' : 'order'; });
  set('g1-dorder-pick', q => { const g = graph(q.fig), x = nums(bold(q))[0]; return same(q.options.map((o, j) => g[o] > x ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks'; });
  set('g1-dorder-tf', q => { const g = graph(q.fig), min = Math.min(...Object.values(g)); return tfWhy(q, g[bold(q)] === min); });
  /* a bag of counters: red and blue */
  const inBag = svg => ({ red: (String(svg).match(/<circle[^>]*#e04b3a/g) || []).length, blue: (String(svg).match(/<circle[^>]*#2c68cf/g) || []).length });
  const likely = (want, other) => want === 0 ? 'impossible' : other === 0 ? 'certain' : 'possible';
  set('g1-chance-tap', q => { const w = H.strip(q.q).match(/is (impossible|possible|certain)/)[1], ok = q.tiles.map(t => { const b = inBag(t); return likely(b.red, b.blue) === w; }); return ok.filter(Boolean).length === 1 && ok[q.answer] ? '' : 'bag'; });
  set('g1-chance-match', q => q.pairs.every(p => { const b = inBag(p[0]); return likely(b.red, b.blue) === p[1]; }) ? '' : 'pairs');
  set('g1-chance-tf', q => { const b = inBag(q.fig), w = [...q.q.matchAll(/<b>([^<]+)<\/b>/g)].map(x => x[1]), real = w[0] === 'red' ? likely(b.red, b.blue) : likely(b.blue, b.red); return tfWhy(q, real === w[1]); });
  /* ---- Canadian Money ---- */
  /* the value of a drawn coin or bill, in cents: bills are rectangles, and the number printed on it */
  const cents = svg => { const t = String(svg), lab = +t.match(/font-weight="700"[^>]*>(\d+)<\/text>/)[1]; return /<rect/.test(t) ? lab * 100 : lab === 1 ? 100 : lab === 2 ? 200 : lab; };
  const MNAME = { 5: 'nickel', 10: 'dime', 25: 'quarter', 50: '50-cent coin', 100: 'loonie', 200: 'toonie', 500: '$5 bill', 1000: '$10 bill', 2000: '$20 bill', 5000: '$50 bill' };
  const VALUE = Object.fromEntries(Object.entries(MNAME).map(([v, n]) => [n, +v]));
  const priceOf = c => c < 100 ? c + '¢' : '$' + c / 100;
  set('g1-mname-match', q => q.pairs.every(p => MNAME[cents(p[0])] === p[1]) ? '' : 'pairs');
  set('g1-mname-tap', q => MNAME[cents(q.tiles[q.answer])] === bold(q) ? '' : 'tile');
  set('g1-mname-tf', q => tfWhy(q, MNAME[cents(q.fig)] === bold(q)));
  set('g1-mname-pick', q => { const bill = bold(q) === 'bill'; return same(q.options.map((o, j) => /<rect/.test(o) === bill ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks'; });
  set('g1-mval-match', q => q.pairs.every(p => priceOf(cents(p[0])) === p[1]) ? '' : 'pairs');
  set('g1-mval-tap', q => priceOf(cents(q.tiles[q.answer])) === bold(q) ? '' : 'tile');
  set('g1-mval-tf', q => { const b = [...q.q.matchAll(/<b>([^<]+)<\/b>/g)].map(x => x[1]); return tfWhy(q, priceOf(VALUE[b[0]]) === b[1]); });
  set('g1-mcmp-tf', q => { const b = [...q.q.matchAll(/<b>([^<]+)<\/b>/g)].map(x => x[1]); return tfWhy(q, VALUE[b[0]] > VALUE[b[1]]); });
  set('g1-mcmp-pick', q => { const base = VALUE[[...q.q.matchAll(/<b>([^<]+)<\/b>/g)][1][1]]; return same(q.options.map((o, j) => cents(o) > base ? j : -1).filter(j => j >= 0), q.answer) ? '' : 'picks'; });
  set('g1-mcmp-story', q => { const h = [...H.strip(q.q).matchAll(/([A-Z][a-z]+) has an? ([\w$ -]+?)\./g)].map(x => [x[1], VALUE[x[2]]]), more = /more/.test(bold(q)); h.sort((a, b) => more ? b[1] - a[1] : a[1] - b[1]); return h.length === 2 && q.options[q.answer] === h[0][0] ? '' : 'who'; });
  set('g1-morder-order', q => { const v = q.items.map(cents); return v.every((x, i) => !i || x > v[i - 1]) ? '' : 'order'; });
  set('g1-morder-tap', q => { const v = q.tiles.map(cents), want = /most/.test(q.q) ? Math.max(...v) : Math.min(...v); return v[q.answer] === want ? '' : 'tile'; });
  set('g1-morder-tf', q => { const v = bold(q).split(', ').map(n => VALUE[n]); return tfWhy(q, v[0] < v[1] && v[1] < v[2]); });
})(window.__verify, window.__H);
