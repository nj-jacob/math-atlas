/* Math Atlas automatic checks. Run from this folder:  npm test   (or  node run.js --quick  for a faster pass)
   Options: --grade 3 (one grade only), --quick (fewer random tries).
   It fails (exit code 1) if anything below finds a problem, and the publish step on GitHub will not run.

   1. Repository rules: every script parses; the shared engine has exactly one copy (assets/engine);
      every grade page loads it; every Math Plan expectation has a short plain-language line (plan/blurbs.js)
      and belongs to exactly one concept family (plan/families.js).
   2. Questions: every practice skill at every level, every lesson "Your turn" check and every written quiz
      question is made many times and checked: the right shape for its type, no "undefined" or "NaN" on screen,
      and, for the newer question shapes, the answer worked out again by verify/*.js.
   3. Pages: every chapter, lesson screen, practice page, quiz and Toolbox tool opens with no errors. The Toolbox blocks
      are tapped and dragged the way a child would (add, snap 10 ones into a ten, put back, undo) on a phone-size screen.
   4. Answering: on a phone-size screen, practice questions of every kind are answered the way a child would
      (right, and sometimes wrong first), and must be marked correctly. Nothing may run off the side of the screen.
   5. Saved progress: progress saved before a change (gNatlas: keys) still loads: levels, secure skills, quiz bests,
      check-ups and the plan show, and practice keeps saving under the same keys in the same shape.
   6. Parent pages: the Language placement check results (assets/langplace.js) are drawn for finished, older, unfinished
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
    for (const dup of ['site.js', 'lesson.js', 'manip.js', 'manip.css', 'qkit.js', 'qkit.css']) {
      if (fs.existsSync(path.join(ROOT, 'grade' + g, 'assets', dup))) fail('grade' + g, 'has its own copy of ' + dup + '. The one shared copy lives in assets/engine/.');
    }
    const html = fs.readFileSync(path.join(ROOT, 'grade' + g, 'index.html'), 'utf8');
    for (const need of ['../assets/engine/site.js', 'assets/grade.js', '../assets/engine/qkit.js', '../assets/engine/manip.js', '../assets/engine/lesson.js', '../assets/engine/manip.css', '../assets/engine/qkit.css', '../assets/atlas-theme.css']) {
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
        const tally = q => {
          if (q.type === 'tf') { tf++; if (q.answer) tfTrue++; }
          if (q.type === 'mc' && q.options.length >= 3) {
            mc++; pos[q.answer] = (pos[q.answer] || 0) + 1;
            const len = q.options.map(o => window.__H.strip(o).length), mx = Math.max(...len);
            if (len[q.answer] === mx && len.filter(x => x === mx).length === 1) longest++;
          }
        };
        for (let lv = 1; lv <= 3; lv++) for (let i = 0; i < 150; i++) {
          const q = sk.gen(lv);
          byLv[lv].add(txt(q));
          if (!(q.meta && q.meta.k)) unchecked++;
          tally(q);
        }
        /* a few dozen true/false or choice questions is too few to judge a 25%-75% share fairly, so draw more of them */
        for (let i = 0; i < 3000 && ((tf && tf < 300) || (mc && mc < 300)); i++) {
          tally(sk.gen(1 + i % 3));
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
    const r = ['home', 'check-up', 'progress', 'tools'].concat((Atlas.tools || []).map(t => 'tools/' + t));
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

  /* 3a. Toolbox blocks: tap and drag blocks onto the mat, drag a one into Tens to snap 10 ones into a ten,
     drag a block off the mat to put it back, and undo. Nothing may run off the side of the screen. */
  /* a tool can redraw (for example when its number appears), so wait for the thing to drag to be on screen */
  const boxOf = async loc => { for (let i = 0; i < 20; i++) { const r = await loc.boundingBox().catch(() => null); if (r) return r; await page.waitForTimeout(100); } throw new Error('nothing to drag: ' + loc); };
  const dragTo = async (from, to) => {
    const a = await boxOf(from), b = await boxOf(to);
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await page.mouse.down();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 8 }); await page.mouse.up();
    await page.waitForTimeout(500);
  };
  if (await page.evaluate(() => (Atlas.tools || []).includes('base10'))) {
    await page.evaluate(() => { location.hash = '#tools/base10'; });
    await page.waitForTimeout(150);
    const count = () => page.evaluate(() => ({ t: document.querySelectorAll('.mp-layer .mp-t').length, o: document.querySelectorAll('.mp-layer .mp-o').length }));
    for (let i = 0; i < 9; i++) await page.click('.mp-tp[data-k=o]');
    await dragTo(page.locator('.mp-tp[data-k=o]'), page.locator('.mp-col[data-k=o]'));
    await page.waitForTimeout(600);
    let c = await count();
    if (c.o !== 10) fail(where, 'Toolbox blocks: tapping and dragging ones onto the mat gave ' + c.o + ' ones, not 10');
    await dragTo(page.locator('.mp-layer .mp-o').last(), page.locator('.mp-col[data-k=t]'));
    await page.waitForTimeout(1000);
    c = await count();
    if (c.t !== 1 || c.o !== 0) fail(where, 'Toolbox blocks: dragging a one into Tens did not snap 10 ones into a ten (' + JSON.stringify(c) + ')');
    await dragTo(page.locator('.mp-layer .mp-t').first(), page.locator('.tb-bar h1'));
    c = await count();
    if (c.t !== 0) fail(where, 'Toolbox blocks: dragging a ten off the mat did not put it back');
    await page.click('.tb-b[data-a=undo]'); await page.waitForTimeout(200);
    c = await count();
    if (c.t !== 1) fail(where, 'Toolbox blocks: Undo did not bring the ten back');
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) fail(where, 'Toolbox blocks: the page runs off the side of a phone screen');
  }

  /* 3a2. Toolbox number line: put a marker on the line, jump by 10 twice, tap the line to zoom in, zoom out and undo. */
  if (await page.evaluate(() => (Atlas.tools || []).includes('numberline'))) {
    await page.evaluate(() => { location.hash = '#tools/numberline'; });
    await page.waitForTimeout(150);
    const at = () => page.evaluate(() => { const m = document.querySelector('.mp-nlm'); return m ? +m.getAttribute('aria-valuenow') : null; });
    await page.click('.mp-mkb[data-m="0"]');
    await page.click('.mp-jb[data-j="10"]'); await page.click('.mp-jb[data-j="10"]');
    if (await at() !== 20) fail(where, 'Toolbox number line: a marker at 0 with two jumps of 10 is at ' + (await at()) + ', not 20');
    const spot = await page.evaluate(() => {
      const box = t => [...document.querySelectorAll('.mp-nltl')].find(x => x.textContent === t).getBoundingClientRect(), a = document.querySelector('.mp-nlaxis').getBoundingClientRect();
      const p30 = box('30'), p40 = box('40'), up = a.height > a.width;
      return up ? { x: a.left + a.width / 2, y: (p30.top + p40.bottom) / 2 } : { x: (p30.left + p40.right) / 2, y: a.top + a.height / 2 };
    });
    await page.mouse.click(spot.x, spot.y); await page.waitForTimeout(600);
    const labels = await page.evaluate(() => [...document.querySelectorAll('.mp-nltl')].map(x => x.textContent).join(' '));
    if (labels !== '30 31 32 33 34 35 36 37 38 39 40') fail(where, 'Toolbox number line: tapping between 30 and 40 did not zoom in (labels: ' + labels + ')');
    await page.click('.mp-snap[data-a=out]'); await page.waitForTimeout(600);
    await page.click('.tb-b[data-a=undo]'); await page.click('.tb-b[data-a=undo]'); await page.click('.tb-b[data-a=undo]'); await page.waitForTimeout(600);
    if (await at() !== 10) fail(where, 'Toolbox number line: Undo did not take back the zoom and the last jump (marker at ' + (await at()) + ')');
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) fail(where, 'Toolbox number line: the page runs off the side of a phone screen');
  }

  /* 3a3. Toolbox counters: tap counters onto two ten-frames, turn one over, share them into groups, drag one off and undo. */
  if (await page.evaluate(() => (Atlas.tools || []).includes('counters'))) {
    await page.evaluate(() => { location.hash = '#tools/counters'; });
    await page.waitForTimeout(150);
    const n = () => page.evaluate(() => document.querySelectorAll('.mp-clayer .mp-ctr').length);
    const read = () => page.evaluate(() => document.querySelector('.mp-ctt .mp-read').textContent);
    await page.click('.mp-cmode [data-f=two]');
    for (let i = 0; i < 12; i++) await page.click('.mp-cpile[data-c=a]');
    if (await read() !== '') fail(where, 'Toolbox counters: a number shows before Show number is on');
    await page.click('.tb-b[data-a=show]');
    if (!(await read()).includes('10 and 2')) fail(where, 'Toolbox counters: 12 counters on two ten-frames do not read "10 and 2" (' + (await read()) + ')');
    await page.click('.mp-clayer .mp-ctr >> nth=0');
    if (!(await read()).includes('11 + 1 = 12')) fail(where, 'Toolbox counters: turning a counter over did not give 11 + 1 = 12 (' + (await read()) + ')');
    await page.click('.mp-csort [data-s=share]'); await page.click('.mp-snap[data-k="5"]');
    if (!(await read()).includes('2 in each, 2 left over')) fail(where, 'Toolbox counters: 12 shared into 5 groups is not 2 in each, 2 left over (' + (await read()) + ')');
    await dragTo(page.locator('.mp-clayer .mp-ctr').first(), page.locator('.tb-bar h1'));
    if (await n() !== 11) fail(where, 'Toolbox counters: dragging a counter off the mat did not put it back');
    await page.click('.tb-b[data-a=undo]'); await page.waitForTimeout(150);
    if (await n() !== 12) fail(where, 'Toolbox counters: Undo did not bring the counter back');
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) fail(where, 'Toolbox counters: the page runs off the side of a phone screen');
  }

  /* 3a4. Toolbox number chart: skip count by 5, jump from 23 to 47, undo. */
  if (await page.evaluate(() => (Atlas.tools || []).includes('hundred'))) {
    await page.evaluate(() => { location.hash = '#tools/hundred'; });
    await page.waitForTimeout(150);
    const coloured = () => page.evaluate(() => document.querySelectorAll('.mp-hcn.f').length);
    const read = () => page.evaluate(() => document.querySelector('.mp-hct .mp-read').textContent);
    await page.click('.mp-skips [data-k="5"]');
    if (await coloured() !== 20) fail(where, 'Toolbox number chart: counting by 5 coloured ' + (await coloured()) + ' squares, not 20');
    if (await read() !== '') fail(where, 'Toolbox number chart: a number shows before Show number is on');
    await page.click('.tb-b[data-a=show]');
    await page.click('.mp-cmode [data-t=jump]'); await page.click('.mp-hcn[data-n="23"]'); await page.click('.mp-hcn[data-n="47"]');
    if (!(await read()).includes('23 + 24 = 47')) fail(where, 'Toolbox number chart: a jump from 23 to 47 does not read 23 + 24 = 47 (' + (await read()) + ')');
    await page.click('.tb-b[data-a=undo]'); await page.click('.tb-b[data-a=undo]'); await page.click('.tb-b[data-a=undo]');
    if (await coloured() !== 0) fail(where, 'Toolbox number chart: Undo did not take back the skip counting');
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) fail(where, 'Toolbox number chart: the page runs off the side of a phone screen');
  }

  /* 3a5. Toolbox fraction kit: tap three fourths, split them into eighths, undo, pack seven fourths into wholes, share 7 by 2, drag a piece on. */
  if (await page.evaluate(() => (Atlas.tools || []).includes('fractions'))) {
    await page.evaluate(() => { location.hash = '#home'; location.hash = '#tools/fractions'; });
    await page.waitForTimeout(150);
    const early = await page.evaluate(() => Atlas.grade <= 2);
    const read = () => page.evaluate(() => document.querySelector('.mp-fkt .mp-read').textContent.replace(/\u00a0/g, ' '));
    const has = async t => { for (let i = 0; i < 20; i++) { if ((await read()).includes(t)) return true; await page.waitForTimeout(100); } return false; };
    for (let i = 0; i < 3; i++) await page.click('.mp-fkpc[data-d="4"]');
    if (await read() !== '') fail(where, 'Toolbox fraction kit: a number shows before Show number is on');
    await page.click('.tb-b[data-a=show]');
    const want = (e, g) => early ? e : g;
    if (!(await has(want('3 fourths', '3/4')))) fail(where, 'Toolbox fraction kit: three fourths do not read ' + want('3 fourths', '3/4') + ' (' + (await read()) + ')');
    await page.click('.mp-fkdo [data-m=split]'); await page.click('.mp-snap[data-k="2"]');
    if (await page.locator('.mp-fkrow .mp-fkp').count() !== 6 || !(await has(want('3 fourths = 6 eighths', '3/4 = 6/8')))) fail(where, 'Toolbox fraction kit: splitting 3 fourths into 2 does not give 6 eighths (' + (await read()) + ')');
    await page.click('.tb-b[data-a=undo]'); await page.waitForTimeout(100);
    if (await page.locator('.mp-fkrow .mp-fkp').count() !== 3) fail(where, 'Toolbox fraction kit: Undo did not take back the split');
    await page.click('.mp-fkdo [data-m=fill]');
    for (let i = 0; i < 4; i++) await page.click('.mp-fkpc[data-d="4"]');
    await page.click('.mp-snap[data-a=pack]');
    if (!(await has(want('1 and 3 fourths', '7/4 = 1 3/4')))) fail(where, 'Toolbox fraction kit: packing 7 fourths does not give ' + want('1 and 3 fourths', '1 3/4') + ' (' + (await read()) + ')');
    await page.click('.mp-fkdo [data-m=share]'); await page.click('.mp-snap[data-a=dealall]'); await page.click('.mp-snap[data-a=cut]');
    if (!(await has(want('3 and 1 half each', '3 1/2 each')))) fail(where, 'Toolbox fraction kit: 7 shared by 2 does not give ' + want('3 and 1 half', '3 1/2') + ' each (' + (await read()) + ')');
    await page.click('.mp-snap[data-a=toMat]');
    if (await page.locator('.mp-fkrow .mp-fkp').count() !== 4) fail(where, 'Toolbox fraction kit: one share did not go on the mat as 3 wholes and 1 half');
    await page.click('.mp-snap[data-a=clear]');
    await dragTo(page.locator('.mp-fkpc[data-d="3"]'), page.locator('.mp-fkmat'));
    if (await page.locator('.mp-fkrow .mp-fkp').count() !== 1) fail(where, 'Toolbox fraction kit: dragging a third onto the mat did not add it');
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) fail(where, 'Toolbox fraction kit: the page runs off the side of a phone screen');
  }

  /* 3a6. Toolbox fraction kit, Grades 4 and up: decimal pieces on the grid and in symbols, Groups of, Count to 10; Join, Combine and Fit into
     from Grade 5; same-size pieces and typed numbers in Line up from Grade 6. */
  if (await page.evaluate(() => (Atlas.tools || []).includes('fractions') && Atlas.grade >= 4)) {
    const g = await page.evaluate(() => Atlas.grade);
    await page.evaluate(() => { location.hash = '#home'; location.hash = '#tools/fractions'; });
    await page.waitForTimeout(150);
    const read = () => page.evaluate(() => document.querySelector('.mp-fkt .mp-read').textContent.replace(/\u00a0/g, ' '));
    const has = async t => { for (let i = 0; i < 20; i++) { if ((await read()).includes(t)) return true; await page.waitForTimeout(100); } return false; };
    const bad = async (t, what) => { if (!(await has(t))) fail(where, 'Toolbox fraction kit: ' + what + ' does not read ' + t + ' (' + (await read()) + ')'); };
    const clear = () => page.click('.mp-snap[data-a=clear]');
    if (await page.getAttribute('.tb-b[data-a=show]', 'aria-checked') !== 'true') await page.click('.tb-b[data-a=show]');
    for (let i = 0; i < 3; i++) await page.click('.mp-fkpc[data-x][data-d="10"]');
    if (g >= 5) for (let i = 0; i < 7; i++) await page.click('.mp-fkpc[data-x][data-d="100"]');
    await bad(g >= 5 ? '0.37' : '0.3', 'decimal pieces');
    await page.click('.mp-fkwin [data-w=g]'); await page.click('.mp-fkwin [data-w=y]');
    if (await page.locator('.mp-fkgrid .mp-fkg1').count() !== 30) fail(where, 'Toolbox fraction kit: 3 tenths do not fill 3 columns of the grid');
    const sym = await page.textContent('.mp-fky');
    if (!sym.includes(g >= 5 ? '37/100' : '3/10') || (g >= 5 && !sym.includes('37%'))) fail(where, 'Toolbox fraction kit: the Symbols window misses the same amount as a fraction or percent (' + sym + ')');
    await clear();
    await page.click('.mp-fkpc:not([data-x])[data-d="4"]'); await page.click('.mp-fkdo [data-m=groups]');
    await page.click('.mp-snap[data-a=grp][data-v="1"]'); await page.click('.mp-snap[data-a=grp][data-v="1"]');
    await bad('5 × 1/4 = 5/4', '5 groups of 1/4');
    await page.click('.tb-b[data-a=undo]');
    await bad('4 × 1/4 = 4/4', 'Undo of a group');
    await clear(); await page.click('.mp-fkdo [data-m=count]'); await page.click('.mp-fkpc:not([data-x])[data-d="2"]'); await page.click('.mp-snap[data-a=to10]');
    await bad('20/2 = 10', 'counting halves to 10');
    if (g >= 5) {
      await clear(); await page.click('.mp-fkdo [data-m=join]');
      for (let i = 0; i < 6; i++) await page.click('.mp-fkpc:not([data-x])[data-d="8"]');
      await page.click('.mp-snap[data-a=join][data-k="2"]');
      await bad('6/8 = 3/4', 'joining 6 eighths in twos');
      await clear(); await page.click('.mp-fkdo [data-m=comb]');
      for (let i = 0; i < 3; i++) await page.click('.mp-fkpc:not([data-x])[data-d="8"]');
      await page.click('.mp-fkrow[data-r="1"]');
      for (let i = 0; i < 2; i++) await page.click('.mp-fkpc:not([data-x])[data-d="8"]');
      await bad('3/8 + 2/8 = 5/8', 'combining 3/8 and 2/8');
      await clear(); await page.click('.mp-fkdo [data-m=fit]'); await page.click('.mp-fkpc:not([data-x])[data-d="4"]');
      await bad('3 ÷ 1/4 = 12', 'fitting fourths into 3');
    }
    if (g >= 6) {
      await clear(); await page.click('.mp-fkdo [data-m=comb]');
      await page.click('.mp-fkpc:not([data-x])[data-d="2"]'); await page.click('.mp-fkrow[data-r="1"]'); await page.click('.mp-fkpc:not([data-x])[data-d="3"]');
      await page.click('.mp-snap[data-a=same]');
      await bad('3/6 + 2/6 = 5/6', 'adding 1/2 and 1/3');
      await clear(); await page.click('.mp-fkdo [data-m=line]');
      await page.fill('.mp-fkin', '65%'); await page.click('.mp-snap[data-a=type]');
      await page.fill('.mp-fkin', '3/4'); await page.press('.mp-fkin', 'Enter');
      await bad('65% < 3/4', 'lining up 65% and 3/4');
    }
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) fail(where, 'Toolbox fraction kit: the page runs off the side of a phone screen');
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

/* ---------- 5. saved progress still loads ---------- */
async function checkSaved(browser, base, g) {
  const where = 'grade ' + g + ' saved progress';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.route('**/*', r => (r.request().url().startsWith(base) ? r.continue() : r.abort()));
  for (const f of ['validate.js', 'answer.js']) await ctx.addInitScript({ content: fs.readFileSync(path.join(__dirname, f), 'utf8') });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(base + '/grade' + g + '/index.html#home');
  await page.waitForFunction(() => window.Atlas && Atlas.meta && Object.keys(Atlas.chapters).length > 0, null, { timeout: 15000 });
  /* a saved state written the way every grade has always saved it */
  const P = 'g' + g + 'atlas:';
  const seed = await page.evaluate(P => {
    localStorage.clear();
    const m = Atlas.meta.filter(x => Atlas.chapters[x.id] && Atlas.chapters[x.id].practice)[0], sk = Atlas.chapters[m.id].practice;
    const st = {};
    st[P + 'sk:' + sk[0].id] = { lv: 3, streak: 0, miss: 0, n: 12, ok: 10, secure: true, t: 1761900000000 };
    st[P + 'sk:' + sk[1].id] = { lv: 2, streak: 1, miss: 0, n: 6, ok: 4, secure: false, t: 1761900001000 };
    st[P + 'best:' + m.id] = 6;
    st[P + 'checkups'] = [{ d: '2026-10-25', w: 'Quick whole-grade check-up', s: 7, n: 10 }];
    st[P + 'plan'] = [{ ch: m.id, sk: sk[1].id, name: sk[1].name, t: m.title }];
    st[P + 'cov'] = { [sk[0].code.split(/,\s*/)[0]]: { d: '2026-10-25', ok: 1, n: 1 } };
    Object.keys(st).forEach(k => localStorage.setItem(k, typeof st[k] === 'number' ? String(st[k]) : JSON.stringify(st[k])));
    return { ch: m.id, s0: sk[0].id, s1: sk[1].id, nsk: sk.length };
  }, P);
  await page.evaluate(() => { location.hash = '#check-up'; location.hash = '#home'; });
  await page.waitForTimeout(80);
  const home = await page.evaluate(s => ({ card: (document.querySelector('a.card[href="#' + s.ch + '"]') || {}).textContent || '', start: document.querySelector('.start').textContent, plan: !!document.querySelector('.start a[href="#' + s.ch + '/practice/' + s.s1 + '"]') }), seed);
  if (!home.card.includes('quiz 6/')) fail(where, 'the chapter card does not show the saved quiz score 6');
  if (!home.card.includes('1/' + seed.nsk + ' secure')) fail(where, 'the chapter card does not show 1 secure skill');
  if (!home.start.includes('Last check-up (2026-10-25): 7 of 10.') || !home.plan) fail(where, 'the home page does not show the saved check-up and plan');
  const status = await page.evaluate(s => [Atlas.skillStatus(s.s0).t, Atlas.skillStatus(s.s1).t], seed);
  if (status[0] !== 'Secure' || status[1] !== 'Level 2: Building') fail(where, 'saved skill levels read as ' + status.join(' and '));
  await page.evaluate(() => { location.hash = '#check-up'; });
  await page.waitForTimeout(80);
  const cu = await page.evaluate(() => document.querySelector('#app').textContent);
  if (!cu.includes('Quick whole-grade check-up') || !/Expectations checked: 1 of \d+/.test(cu)) fail(where, 'the check-up page does not show the saved history and coverage');
  /* one right answer in practice: saved back under the same key, in the same shape */
  await page.evaluate(h => { location.hash = h; }, '#' + seed.ch + '/practice/' + seed.s1);
  await page.waitForTimeout(80);
  await page.evaluate(async () => { const root = document.querySelector('.pq'); if (Atlas._q && root) await window.__answer(Atlas._q, root, Atlas._qk, false); });
  const after = await page.evaluate(([P, s]) => ({ v: JSON.parse(localStorage.getItem(P + 'sk:' + s.s1) || 'null'), stray: Object.keys(localStorage).filter(k => k.indexOf(P) !== 0 && k.indexOf('atlas:') !== 0) }), [P, seed]);
  const v = after.v || {};
  if (!(v.n === 7 && v.ok === 5 && v.lv === 2 && v.streak === 2 && v.secure === false && v.t > 1761900001000)) fail(where, 'practice saved ' + JSON.stringify(v) + ' (expected n 7, ok 5, level 2, streak 2)');
  if (after.stray.length) fail(where, 'progress saved outside the ' + P + ' keys: ' + after.stray.join(', '));
  if (errs.length) fail(where, 'errors: ' + [...new Set(errs)].slice(0, 3).join(' / '));
  await ctx.close();
}

/* ---------- 6. Language placement results on the parent pages ---------- */
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
    try { await checkSaved(browser, url, g); } catch (e) { fail('grade ' + g + ' saved progress', 'the check itself stopped: ' + e.message.split('\n')[0]); }
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
