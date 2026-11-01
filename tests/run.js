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
      (right, and sometimes wrong first), and must be marked correctly. Nothing may run off the side of the screen. */
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
    /* a full chapter (full: true) is built to the full standard: see docs/QUESTIONS.md, "Full chapters" */
    const txt = q => window.__H.strip(q.q) + ' | ' + window.__H.strip(q.fig || '') + ' | ' + JSON.stringify(q.options || q.items || q.pairs || q.answers || q.answer);
    for (const [id, ch] of Object.entries(Atlas.chapters)) {
      if (!ch.full) continue;
      const skills = {}, used = {};
      (ch.practice || []).forEach(sk => { skills[sk.id] = sk; });
      (ch.lessons || []).forEach(ls => ls.concepts.forEach(c => {
        const w = id + ' idea ' + (c.slug || c.id) + ' (full chapter)';
        if (!c.watch || !c.example) out.problems.push(w + ': needs a Watch clip and a My turn example');
        if (!c.mistake) out.problems.push(w + ': needs a common mistake for grown-ups');
        if (!c.together || c.together.length < 3) out.problems.push(w + ': needs 3 Together problems');
        if ([].concat(c.check || []).length < 5) out.problems.push(w + ': needs 5 Your turn questions');
        if (!c.skill || !skills[c.skill]) out.problems.push(w + ': needs its own practice skill');
        else if (used[c.skill]) out.problems.push(w + ': shares practice skill ' + c.skill + ' with ' + used[c.skill] + '. Each idea needs its own.');
        else used[c.skill] = c.slug || c.id;
        (c.together || []).forEach((f, k) => {
          for (let i = 0; i < 6; i++) {
            let P; try { P = f(); } catch (e) { out.problems.push(w + ' Together #' + (k + 1) + ' crashed: ' + e.message); break; }
            if (!P || !Array.isArray(P.steps) || P.steps.length < 2) { out.problems.push(w + ' Together #' + (k + 1) + ': a problem needs 2 or more steps'); break; }
            P.steps.forEach((st, j) => { check(st.q, w + ' Together #' + (k + 1) + ' step ' + (j + 1)); if (!(st.q.meta && st.q.meta.k)) out.problems.push(w + ' Together #' + (k + 1) + ' step ' + (j + 1) + ': has no answer check (meta.k)'); });
          }
        });
        [].concat(c.check || []).forEach((f, k) => { const q = f(); if (!(q.meta && q.meta.k)) out.problems.push(w + ' Your turn #' + (k + 1) + ': has no answer check (meta.k)'); });
      }));
      (ch.practice || []).forEach(sk => {
        const w = id + ' skill ' + sk.id + ' (full chapter)', byLv = [null, new Set(), new Set(), new Set()];
        let tf = 0, tfTrue = 0, mc = 0, longest = 0, unchecked = 0;
        const pos = {};
        for (let lv = 1; lv <= 3; lv++) for (let i = 0; i < 150; i++) {
          const q = sk.gen(lv);
          byLv[lv].add(txt(q));
          if (!(q.meta && q.meta.k)) unchecked++;
          if (q.type === 'tf') { tf++; if (q.answer) tfTrue++; }
          if (q.type === 'mc' && q.options.length >= 3) {
            mc++; pos[q.answer] = (pos[q.answer] || 0) + 1;
            const len = q.options.map(o => window.__H.strip(o).length), mx = Math.max(...len);
            if (len[q.answer] === mx && len.filter(x => x === mx).length === 1) longest++;
          }
        }
        if (unchecked) out.problems.push(w + ': ' + unchecked + ' of 450 questions have no answer check (meta.k), including plain ones');
        const all = new Set([...byLv[1], ...byLv[2], ...byLv[3]]);
        if (all.size < 30) out.problems.push(w + ': makes only ' + all.size + ' different questions. A full skill needs 30 or more.');
        const same = [...byLv[3]].filter(t => byLv[1].has(t)).length;
        if (same > byLv[3].size / 2) out.problems.push(w + ': level 3 mostly repeats level 1 (' + same + ' of ' + byLv[3].size + '). Level 3 must be harder.');
        if (tf >= 20 && (tfTrue / tf < 0.25 || tfTrue / tf > 0.75)) out.problems.push(w + ': true/false is ' + Math.round(100 * tfTrue / tf) + '% "true". Keep it between 25% and 75%, so it cannot be guessed.');
        if (mc >= 20 && longest / mc > 0.6) out.problems.push(w + ': the right choice is the longest one ' + Math.round(100 * longest / mc) + '% of the time. That gives it away.');
        if (mc >= 20 && Object.values(pos).some(n => n / mc > 0.7)) out.problems.push(w + ': the right choice is nearly always in the same place.');
      });
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

  /* 3b. full chapters: work through every Together problem the way a child would (one wrong step first), and the warm-up */
  const fullIdeas = await page.evaluate(() => Object.entries(Atlas.chapters).filter(([, ch]) => ch.full).flatMap(([id, ch]) => ch.lessons.flatMap(ls => ls.concepts.map(c => [id, c.slug || c.id]))));
  for (const [cid, slug] of fullIdeas) {
    await page.evaluate(h => { location.hash = '#home'; location.hash = h; }, '#' + cid + '/learn/' + slug);
    await page.waitForTimeout(60);
    const r = await page.evaluate(async () => {
      const box = document.querySelector('.ls-tog');
      if (!box) return 'no Together card';
      for (let guard = 0; guard < 40; guard++) {
        if (box._tg) {
          const first = guard === 0;
          await window.__answer(box._tg.q, box._tg.root, box._tg.qk, first);
          if (first) { if (!/\bbad\b/.test(box.querySelector('.fb').className)) return 'a wrong step was not caught'; await window.__answer(box._tg.q, box._tg.root, box._tg.qk, false); }
          continue;
        }
        const b = box.querySelector('.ytn .btn');
        if (!b) return 'stuck after a step';
        if (/Next problem/.test(b.textContent)) { b.click(); continue; }
        return /your turn/i.test(b.textContent) ? '' : 'did not finish: ' + b.textContent;
      }
      return 'did not finish';
    });
    if (r) fail(where, cid + '/learn/' + slug + ' Together: ' + r);
  }
  const fullCh = await page.evaluate(() => Object.entries(Atlas.chapters).filter(([, ch]) => ch.full).map(([id]) => id));
  for (const cid of fullCh) {
    const r = await page.evaluate(async cid => {
      const pre = (document.querySelector('meta[name=atlas-prefix]') || {}).content || ('g' + Atlas.grade + 'atlas:');
      const old = new Date(Date.now() - 2 * 864e5), day = old.getFullYear() + '-' + ('0' + (old.getMonth() + 1)).slice(-2) + '-' + ('0' + old.getDate()).slice(-2);
      Atlas.lessons.flat(cid).forEach(c => localStorage.setItem(pre + 'cn:' + c.id, JSON.stringify({ seen: 1, n: 4, ok: 4, got: true, gd: day, rv: 0 })));
      if (Atlas.lessons.due(cid).length === 0) return 'ideas got 2 days ago are not due for the warm-up';
      location.hash = '#' + cid + '/review';
      await new Promise(r => setTimeout(r, 60));
      const box = document.querySelector('#warm');
      for (let i = 0; i < 3; i++) {
        if (!box._q) break;
        await window.__answer(box._q, box.querySelector('.wu-ans'), box._qk, false);
        if (!/\bok\b/.test(box.querySelector('.fb').className)) return 'a right warm-up answer was marked wrong';
        box._q = null;
        box.querySelector('.ytn .btn').click();
        await new Promise(r => setTimeout(r, 20));
      }
      return /Warm-up done/.test(box.textContent) ? '' : 'warm-up did not finish';
    }, cid);
    if (r) fail(where, cid + ' warm-up: ' + r);
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
