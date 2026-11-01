/* Math Atlas automatic checks. Run from this folder:  npm test   (or  node run.js --quick  for a faster pass)
   Options: --grade 3 (one grade only), --quick (fewer random tries).
   It fails (exit code 1) if anything below finds a problem, and the publish step on GitHub will not run.

   1. Repository rules: every script parses; the shared engine has exactly one copy (assets/engine);
      every grade page loads it; every Math Plan expectation has a short plain-language line (plan/blurbs.js)
      and belongs to exactly one concept family (plan/families.js).
   2. Questions: every practice skill at every level, every lesson "Your turn" check and every written quiz
      question is made many times and checked: the right shape for its type, no "undefined" or "NaN" on screen,
      and, for the newer question shapes, the answer worked out again by verify/*.js.
   3. Pages: every chapter, lesson screen, practice page and quiz opens with no errors.
   4. Answering: on a phone-size screen, practice questions of every kind are answered the way a child would
      (right, and sometimes wrong first), and must be marked correctly. Nothing may run off the side of the screen.
   5. Parent pages: the Language placement check results (assets/langplace.js) are drawn for finished, older, unfinished
      and missing checks, on a phone-size screen, with nothing missing or cut off. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const { chromium } = require('playwright');
const startServer = require('./server');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const QUICK = args.includes('--quick');
const ONLY = args.includes('--grade') ? [+args[args.indexOf('--grade') + 1]] : null;
const GRADES = ONLY || [1, 2, 3, 4, 5, 6, 7, 8];
const TRIES = QUICK ? 12 : 40;
const problems = [];
function fail(where, what) { problems.push(where + ': ' + what); }
function log(s) { process.stdout.write(s + '\n'); }

/* ---------- 1. repository rules ---------- */
function repoRules() {
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
    if (['node_modules', '.git', '.preview'].includes(e.name)) return [];
    const p = path.join(d, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
  const files = walk(ROOT).filter(f => f.endsWith('.js') && !f.includes(path.sep + 'tests' + path.sep));
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    if (/^\s*(import|export)\s/m.test(src)) continue; /* browser modules (sync.js and friends) are checked when pages load */
    try { new vm.Script(src, { filename: f }); } catch (e) { fail(path.relative(ROOT, f), 'does not parse: ' + e.message); }
  }
  for (let g = 1; g <= 8; g++) {
    for (const dup of ['lesson.js', 'manip.js', 'manip.css', 'qkit.js', 'qkit.css']) {
      if (fs.existsSync(path.join(ROOT, 'grade' + g, 'assets', dup))) fail('grade' + g, 'has its own copy of ' + dup + '. The one shared copy lives in assets/engine/.');
    }
    const html = fs.readFileSync(path.join(ROOT, 'grade' + g, 'index.html'), 'utf8');
    for (const need of ['../assets/engine/qkit.js', '../assets/engine/manip.js', '../assets/engine/lesson.js', '../assets/engine/manip.css', '../assets/engine/qkit.css', '../assets/atlas-theme.css']) {
      if (!html.includes(need)) fail('grade' + g + '/index.html', 'does not load ' + need);
    }
  }
  /* Math Plan: every expectation in ladder.js has exactly one short plain-language line in blurbs.js. */
  const sand = { window: {} };
  for (const f of ['ladder.js', 'blurbs.js', 'families.js']) vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'plan', f), 'utf8'), sand);
  const ids = sand.window.PL.map(r => 'g' + r[0] + '.' + r[1]), blurbs = sand.window.PLB;
  for (const id of ids) {
    const b = blurbs[id];
    if (!b) fail('plan/blurbs.js', 'has no line for ' + id);
    else if (b.length > 140) fail('plan/blurbs.js', id + ' is longer than 140 characters. Keep it short.');
  }
  for (const id of Object.keys(blurbs)) if (!ids.includes(id)) fail('plan/blurbs.js', id + ' is not an expectation in ladder.js');
  /* Math Plan: every expectation belongs to exactly one concept family (families.js). */
  const famOf = {}, famIds = new Set();
  for (const f of sand.window.PF) {
    if (famIds.has(f.id)) fail('plan/families.js', 'family id ' + f.id + ' is used twice');
    famIds.add(f.id);
    if (!f.name || !['num', 'ops', 'alg', 'data', 'space', 'money'].includes(f.area)) fail('plan/families.js', f.id + ' needs a name and one of the six areas');
    for (const id of f.rows) {
      if (!ids.includes(id)) fail('plan/families.js', id + ' (in ' + f.id + ') is not an expectation in ladder.js');
      else if (famOf[id]) fail('plan/families.js', id + ' is in two families: ' + famOf[id] + ' and ' + f.id);
      famOf[id] = f.id;
    }
  }
  for (const id of ids) if (!famOf[id]) fail('plan/families.js', id + ' is not in any family. Add it to the family it belongs to.');
}

/* ---------- 2 to 4: in the browser ---------- */
async function checkGrade(browser, base, g) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await ctx.route('**/*', r => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
  const inject = ['validate.js', 'answer.js'].concat(fs.readdirSync(path.join(__dirname, 'verify')).map(f => 'verify/' + f));
  for (const f of inject) await ctx.addInitScript({ content: fs.readFileSync(path.join(__dirname, f), 'utf8') });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED|net::/.test(m.text())) errs.push(m.text()); });
  const where = 'grade ' + g;
  await page.goto(base + '/grade' + g + '/index.html#home');
  await page.waitForFunction(() => window.Atlas && Atlas.chapters && Object.keys(Atlas.chapters).length > 0, null, { timeout: 15000 });
  await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });

  /* 2. questions */
  const gen = await page.evaluate(TRIES => {
    const out = { problems: [], made: 0, types: {}, shapes: {} };
    const seen = new Set();
    function check(q, label) {
      out.made++;
      out.types[q && q.type] = (out.types[q && q.type] || 0) + 1;
      if (q && q.shape) out.shapes[q.shape] = (out.shapes[q.shape] || 0) + 1;
      const bad = window.__validate(q);
      bad.forEach(b => { const key = label + ' ' + b; if (!seen.has(key) && seen.size < 400) { seen.add(key); out.problems.push(key + ' | ' + window.__H.strip(q && q.q || '').slice(0, 90)); } });
    }
    for (const [id, ch] of Object.entries(Atlas.chapters)) {
      (ch.practice || []).forEach(sk => {
        for (let lv = 1; lv <= 3; lv++) for (let i = 0; i < TRIES; i++) {
          let q; try { q = sk.gen(lv); } catch (e) { out.problems.push(id + ' skill ' + sk.id + ' L' + lv + ' crashed: ' + e.message); break; }
          check(q, id + ' skill ' + sk.id + ' L' + lv);
        }
      });
      (ch.quiz || []).forEach((q, i) => check(q, id + ' quiz #' + (i + 1)));
      (ch.lessons || []).forEach(ls => (ls.concepts || []).forEach(c => {
        [].concat(c.check || []).forEach((f, k) => {
          for (let i = 0; i < Math.ceil(TRIES / 4); i++) {
            let q; try { q = typeof f === 'function' ? f() : f; } catch (e) { out.problems.push(id + ' check ' + (c.slug || c.id) + '#' + k + ' crashed: ' + e.message); break; }
            check(q, id + ' check ' + (c.slug || c.id) + '#' + k);
          }
        });
      }));
    }
    return out;
  }, TRIES);
  gen.problems.forEach(p => fail(where, p));

  /* 3. pages */
  const routes = await page.evaluate(() => {
    const r = ['home', 'check-up', 'progress', 'tools'];
    for (const [id, ch] of Object.entries(Atlas.chapters)) {
      r.push(id);
      if (ch.practice) r.push(id + '/practice');
      if (ch.quiz) r.push(id + '/quiz');
      (ch.lessons || []).forEach(ls => (ls.concepts || []).forEach(c => r.push(id + '/learn/' + (c.slug || c.id))));
    }
    return r;
  });
  /* Each idea needs its own name in its chapter: the name is its web address and its progress record. */
  const seen = new Set();
  for (const r of routes) if (r.includes('/learn/')) { if (seen.has(r)) fail(where, r + ' is used by two ideas. Give one of them a different id.'); seen.add(r); }
  for (const r of routes) {
    const before = errs.length;
    await page.evaluate(h => { location.hash = '#' + h; }, r);
    await page.waitForTimeout(40);
    if (errs.length > before) fail(where, 'page #' + r + ' has an error: ' + errs.slice(before).join(' / '));
  }

  /* 4. answering on a phone-size screen */
  const skills = await page.evaluate(() => Object.entries(Atlas.chapters).flatMap(([id, ch]) => (ch.practice || []).map(sk => [id, sk.id])));
  let answered = 0;
  for (const [cid, sid] of skills) {
    for (const lv of QUICK ? [1, 3] : [1, 2, 3]) {
      await page.evaluate(([sid, lv, pre]) => { localStorage.setItem(pre + 'sk:' + sid, JSON.stringify({ lv, streak: 0, miss: 0, n: 1, ok: 0, secure: false })); }, [sid, lv, await page.evaluate(() => (document.querySelector('meta[name=atlas-prefix]') || {}).content || ('g' + Atlas.grade + 'atlas:'))]);
      await page.evaluate(h => { location.hash = '#home'; location.hash = h; }, '#' + cid + '/practice/' + sid);
      await page.waitForTimeout(60);
      const rounds = QUICK ? 2 : 3;
      for (let i = 0; i < rounds; i++) {
        const bad = i === 1;
        const r = await page.evaluate(async bad => {
          const q = Atlas._q, root = document.querySelector('.pq');
          if (!q || !root || !root.querySelector('.pcard')) return { err: 'practice question did not appear' };
          const card = root.querySelector('.pcard');
          const runsOff = () => { const e = [...card.querySelectorAll('*')].find(e => { const b = e.getBoundingClientRect(); return b.width && b.right > window.innerWidth + 2 && !e.closest('.tbl, [style*="overflow"], .qk-pic'); }); return e ? (e.tagName.toLowerCase() + (e.getAttribute('class') ? '.' + e.getAttribute('class').split(' ')[0] : '') + ' "' + (e.textContent || '').trim().slice(0, 40) + '"') : (card.scrollWidth > card.clientWidth + 2 ? 'the card' : ''); };
          let over = runsOff();
          const t = q.type + (q.shape ? ':' + q.shape : '');
          const fb = () => root.querySelector('.fb');
          try {
            await window.__answer(q, root, Atlas._qk, bad);
            if (bad) {
              if (!/\bbad\b/.test(fb().className) || root.querySelector('.pnext .btn')) return { t, over, err: 'a wrong answer was not caught' };
              await window.__answer(q, root, Atlas._qk, false);
            }
          } catch (e) { return { t, over, err: 'could not answer: ' + e.message }; }
          if (!/\bok\b/.test(fb().className)) return { t, over, err: 'a right answer was marked wrong: ' + fb().textContent.slice(0, 80) };
          over = over || runsOff(); /* again with the answer, steps and pictures showing */
          const nb = root.querySelector('.pnext .btn'); if (nb) nb.click();
          return { t, over };
        }, bad);
        answered++;
        if (r.err) fail(where, cid + ' / ' + sid + ' L' + lv + ' ' + (r.t || '') + ': ' + r.err);
        if (r.over) fail(where, cid + ' / ' + sid + ' L' + lv + ' ' + r.t + ': runs off the side of a phone screen (' + r.over + ')');
        if (r.err) break;
      }
    }
  }
  /* fresh chapter quizzes: answer every question */
  const fresh = await page.evaluate(() => Object.entries(Atlas.chapters).filter(([, ch]) => ch.quizFresh).map(([id]) => id));
  for (const id of fresh) {
    await page.evaluate(h => { location.hash = h; }, '#' + id + '/quiz'); await page.waitForTimeout(80);
    const r = await page.evaluate(async () => {
      const qs = [...document.querySelectorAll('#quiz .q')];
      for (const d of qs) {
        await window.__answer(d._q, d, d._qk, false);
      }
      return { n: qs.length, score: document.querySelector('#quiz .qscore').textContent };
    });
    if (!r.score.startsWith(r.n + ' of ' + r.n)) fail(where, id + ' fresh quiz: answered all right but scored "' + r.score + '"');
  }
  if (errs.length) fail(where, 'errors while answering: ' + [...new Set(errs)].slice(0, 5).join(' / '));
  await ctx.close();
  return { made: gen.made, answered, routes: routes.length, shapes: gen.shapes, types: gen.types };
}

/* ---------- 5. Language placement results on the parent pages ---------- */
async function checkLangPlace(browser, base) {
  const w = 'Language placement on the parent pages';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, r => r.abort());
  await page.goto(base + '/404.html', { waitUntil: 'domcontentloaded' });
  const out = await page.evaluate(async () => {
    const L = await import('/assets/langplace.js');
    const levels = { words: 3, vocab: 4, sentences: 2, punct: 0, reading: 4, thinking: 3, writing: 5 };
    const starts = Object.keys(levels).map(a => ({ a, g: Math.min(8, levels[a] + 1), ch: 'ch-' + a, t: 'Chapter & "' + a + '"', done: false }));
    const done = { grade: 4, levels, last: { d: '2026-11-01', log: [] }, starts,
      aloud: { d: '2026-11-01', g: 4, season: 0, norm: 94, wcpm: 71, acc: 93, reads: [] }, writing: { d: '2026-11-01', g: 4, text: 'x', lv: 2 } };
    const older = { grade: 1, levels: { words: 1, vocab: 1, sentences: 1, punct: 1, reading: 1, thinking: 1, writing: 1 }, last: { d: '2026-10-30', log: [] },
      aloud: { d: '2026-10-30', g: 1, season: 0, norm: null, wcpm: 20, acc: 97, reads: [] }, writing: { d: '2026-10-30', g: 1, text: 'x', lv: 0 } };
    const going = { grade: 6, place: { log: [1, 2, 3, 4, 5] } };
    const cases = { done, older, going, none: null };
    const r = {};
    for (const k in cases) {
      const st = L.placeState(cases[k] ? { state: JSON.stringify(cases[k]) } : null);
      document.body.innerHTML = '<div id="app"><div class="wrap">' + L.placeSection(st, 'Sam') + '</div></div>';
      r[k] = { line: L.placeLine(st), text: document.body.textContent, links: [...document.querySelectorAll('a')].map(a => a.getAttribute('href')),
        rows: document.querySelectorAll('tbody tr').length };
    }
    return r;
  });
  await page.evaluate(() => {
    document.head.querySelectorAll('link[rel=stylesheet]').forEach(l => l.remove());
    for (const f of ['site.css', 'family.css', 'atlas-theme.css']) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/assets/' + f; document.head.appendChild(l); }
  });
  for (const [k, r] of Object.entries(out)) {
    if (/undefined|NaN|null|\[object/.test(r.text + r.line)) fail(w, 'the ' + k + ' case shows "undefined", "NaN" or "null"');
    for (const h of r.links) if (!/^language\/(placement\/|grade[1-8]\/(#[\w-]+)?)$/.test(h)) fail(w, 'the ' + k + ' case links to ' + h);
  }
  const d = out.done;
  if (d.rows !== 7) fail(w, 'a finished check shows ' + d.rows + ' parts, not 7');
  if (!d.links.includes('language/grade1/#ch-punct') || !d.links.includes('language/grade4/#writing')) fail(w, 'a finished check does not link to its starting lessons and writing lessons');
  if (!/Chapter & "words"/.test(d.text)) fail(w, 'chapter names are not shown as written');
  if (!/71 words correct per minute.*94, so regular fluency practice will help.*sounding out/.test(d.text)) fail(w, 'the reading-aloud result is not compared with the benchmark');
  if (!/Marked Getting there for Grade 4 writing/.test(d.text)) fail(w, 'the writing mark is not shown');
  if (d.line !== 'Language placement check (2026-11-01): secure up to early Grade 1 to Grade 5.') fail(w, 'the card line for a finished check reads: ' + d.line);
  if (out.older.rows !== 7 || !out.older.links.includes('language/grade2/')) fail(w, 'a check from before starting lessons were kept does not link to the next grade');
  if (!/no Grade 1 benchmark in the fall/.test(out.older.text) || !/not marked yet/.test(out.older.text)) fail(w, 'an older check does not explain the missing benchmark or the unmarked writing');
  if (out.older.line !== 'Language placement check (2026-10-30): secure up to Grade 1.') fail(w, 'the card line for an older check reads: ' + out.older.line);
  if (!/5 questions answered/.test(out.going.text + out.going.line)) fail(w, 'an unfinished check does not say how far it got');
  if (!/has not taken it yet/.test(out.none.text) || out.none.line !== 'Language placement check: not taken yet.') fail(w, 'a missing check is not explained');
  /* the finished case again, with the real styles, on a phone */
  await page.evaluate(async () => {
    const L = await import('/assets/langplace.js');
    const levels = { words: 8, vocab: 8, sentences: 8, punct: 8, reading: 8, thinking: 8, writing: 8 };
    const st = { grade: 8, levels, last: { d: '2026-11-01', log: [] }, starts: Object.keys(levels).map(a => ({ a, g: 8, ch: 'x', t: 'Drafting, Revising and Publishing', done: true })),
      aloud: { d: '2026-11-01', g: 8, season: 2, norm: 151, wcpm: 160, acc: 99, reads: [] }, writing: { d: '2026-11-01', g: 8, text: 'x', lv: 4 } };
    document.body.innerHTML = '<div id="app"><div class="wrap">' + L.placeSection(st, 'Sam') + '</div></div>';
  });
  await page.waitForTimeout(300);
  const wide = await page.evaluate(() => document.documentElement.scrollWidth);
  if (wide > 390) fail(w, 'the section is ' + wide + ' px wide on a 390 px phone screen');
  errors.forEach(e => fail(w, 'page error: ' + e));
  await ctx.close();
  log('Language placement on the parent pages: ' + Object.keys(out).length + ' cases drawn.');
}

(async () => {
  const t0 = Date.now();
  repoRules();
  const { srv, url } = await startServer();
  const browser = await chromium.launch();
  for (const g of GRADES) {
    const before = problems.length;
    try {
      const s = await checkGrade(browser, url, g);
      log('Grade ' + g + ': ' + s.made + ' questions made and checked, ' + s.routes + ' pages opened, ' + s.answered + ' answered on a phone screen. ' +
        'Types: ' + Object.entries(s.types).map(([k, v]) => k + ' ' + v).join(', ') + '. ' + (problems.length - before ? (problems.length - before) + ' problems.' : 'All good.'));
    } catch (e) { fail('grade ' + g, 'the check itself stopped: ' + e.message.split('\n')[0]); }
  }
  try { await checkLangPlace(browser, url); } catch (e) { fail('Language placement on the parent pages', 'the check itself stopped: ' + e.message.split('\n')[0]); }
  await browser.close(); srv.close();
  log('');
  if (problems.length) {
    log(problems.length + ' problem(s):');
    problems.slice(0, 200).forEach(p => log(' - ' + p));
    if (problems.length > 200) log(' ... and ' + (problems.length - 200) + ' more');
    log('\nFAILED in ' + Math.round((Date.now() - t0) / 1000) + 's');
    process.exit(1);
  }
  log('ALL CHECKS PASSED in ' + Math.round((Date.now() - t0) / 1000) + 's');
})();
