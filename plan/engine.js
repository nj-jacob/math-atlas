/* Math Plan engine: placement, learning plan and the check-in loop. No drawing here, so it can be tested on its own.
   Everything is kept in one plain object (the "state"), saved by app.js. */
(function () {
  var E = {}, V = window.PV, BANK = window.PB.bank, LAD = window.PL;
  var AREAS = ['num', 'ops', 'alg', 'space', 'data', 'money'];
  var AREA_NAME = { num: 'Numbers', ops: 'Operations', alg: 'Patterns and algebra', space: 'Shapes and measuring', data: 'Data and probability', money: 'Money and finance' };
  E.AREAS = AREAS; E.AREA_NAME = AREA_NAME;
  E.MASTER_DAYS = 2;      /* right on this many different days = mastered */
  E.STEP_BACK = 2;        /* missed this many times in a row = step back to the idea before it */
  E.WEEK_SIZE = 4;        /* concepts in focus at one time */
  E.RECHECK_DAYS = 28;    /* a short level re-check about once a month */

  /* ---------- the ladder of expectations ---------- */
  var ROWS = LAD.map(function (r) { return { id: 'g' + r[0] + '.' + r[1], g: r[0], code: r[1], area: r[2], topic: r[3], text: r[4], ch: r[5], sk: r[6] }; });
  var BY_ID = {}; ROWS.forEach(function (r) { BY_ID[r.id] = r; });
  E.rows = ROWS; E.row = function (id) { return BY_ID[id]; };
  E.rowsFor = function (g, a) { return ROWS.filter(function (r) { return r.g === g && r.area === a; }); };

  /* Concept families (families.js): one idea across the grades. E.family(rowId) gives the family a row belongs to. */
  var FAMS = window.PF, FAM_BY_ID = {}, FAM_OF = {};
  FAMS.forEach(function (f) { FAM_BY_ID[f.id] = f; f.rows.forEach(function (id) { FAM_OF[id] = f; }); });
  E.families = function (a) { return FAMS.filter(function (f) { return f.area === a; }); };
  E.family = function (rowId) { return FAM_OF[rowId]; };
  E.familyById = function (fid) { return FAM_BY_ID[fid]; };

  E.today = function (d) {
    d = d || new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  };
  E.daysBetween = function (a, b) { return Math.round((Date.parse(b + 'T12:00:00') - Date.parse(a + 'T12:00:00')) / 864e5); };

  E.fresh = function (name, grade) {
    return { v: 1, name: name || '', grade: grade, created: E.today(), levels: null, place: null, history: [], concepts: {}, queue: [], week: null, log: [], sessions: [], checkins: [], prefs: { pin: [], skip: [] } };
  };
  function note(st, text, kind) { st.log.unshift({ d: E.today(), t: text, k: kind || 'plan' }); st.log = st.log.slice(0, 80); }

  /* ---------- choosing questions ---------- */
  function seed() { return Math.floor(Math.random() * 4294967295) >>> 0; }
  E.make = function (item, s) {
    var q = item.m(V.rng(s == null ? seed() : s));
    q.item = item.id; q.g = item.g; q.a = item.a; q.e = item.e;
    return q;
  };
  /* A question for one grade and area. Prefer an expectation not asked yet, and never repeat a question type in a row. */
  E.pick = function (g, a, avoid, wantCode) {
    var pool = BANK.filter(function (b) { return b.g === g && b.a === a; });
    if (wantCode) { var exact = pool.filter(function (b) { return b.e === wantCode; }); if (exact.length) pool = exact; }
    if (!pool.length) return null;
    avoid = avoid || [];
    var fresh = pool.filter(function (b) { return avoid.indexOf(b.id) < 0; });
    var codes = {}; avoid.forEach(function (id) { var b = BANK.filter(function (x) { return x.id === id; })[0]; if (b) codes[b.e] = 1; });
    var newCode = fresh.filter(function (b) { return !codes[b.e]; });
    var list = newCode.length ? newCode : fresh.length ? fresh : pool;
    return list[Math.floor(Math.random() * list.length)];
  };
  E.itemById = function (id) { return BANK.filter(function (b) { return b.id === id; })[0]; };

  /* ---------- placement ----------
     Each area climbs or drops one grade at a time. At each grade it keeps asking until the answers clearly say
     "secure" or "not yet" (a sequential probability ratio test, the standard method for adaptive mastery tests).
     A student who is secure at a grade is taken to get about 85% right there; one who is not, about 35%
     (guesses and partial knowledge). Each answer adds evidence for one or the other. The check decides once the
     evidence is 19 to 1 either way, so about 1 decision in 20 is wrong. Usually 3 to 6 questions per grade.
     It stops when it finds a secure grade with the next grade not secure. */
  E.P_SECURE = 0.85; E.P_NOT = 0.35; E.PLACE_ERR = 0.05;
  E.PLACE_PER_GRADE = 8;  /* still undecided after this many at one grade: go with the way the evidence leans */
  E.PLACE_PER_AREA = 24;  /* never more than this many questions in one area */
  var UP = Math.log(E.P_SECURE / E.P_NOT), DOWN = Math.log((1 - E.P_SECURE) / (1 - E.P_NOT)), BAR = Math.log((1 - E.PLACE_ERR) / E.PLACE_ERR);
  /* What the answers at one grade say: 1 = secure, -1 = not yet, 0 = keep asking. r and w are right and wrong counts. */
  E.placeVerdict = function (R) {
    if (!R) return 0;
    var ev = R.r * UP + R.w * DOWN;
    if (ev >= BAR) return 1;
    if (ev <= -BAR) return -1;
    if (R.r + R.w >= E.PLACE_PER_GRADE) return ev > 0 ? 1 : -1;
    return 0;
  };
  E.startPlacement = function (st, kind) {
    var areas = {}, top = Math.min(8, st.grade + 2);
    AREAS.forEach(function (a) {
      var start = kind === 'recheck' && st.levels ? Math.max(1, Math.min(top, st.levels[a] || 1)) : Math.max(1, st.grade - 1);
      areas[a] = { cur: start, res: {}, used: [], done: false, lv: null, n: 0 };
    });
    st.place = { kind: kind || 'first', started: E.today(), top: top, areas: areas, order: AREAS.slice(), log: [], done: false };
    return st.place;
  };
  E.placeArea = function (st) {
    var P = st.place; if (!P) return null;
    for (var i = 0; i < P.order.length; i++) if (!P.areas[P.order[i]].done) return P.order[i];
    return null;
  };
  E.placeNext = function (st) {
    var a = E.placeArea(st); if (!a) return null;
    var A = st.place.areas[a], item = E.pick(A.cur, a, A.used);
    if (!item) { A.done = true; A.lv = A.cur - 1; return E.placeNext(st); }
    var q = E.make(item); q.area = a;
    return q;
  };
  /* ok: true, false, or null for "I don't know yet" (counts as not yet). */
  E.placeAnswer = function (st, q, ok) {
    var A = st.place.areas[q.area], L = A.cur, R = A.res[L] || (A.res[L] = { r: 0, w: 0 });
    A.used.push(q.item); A.n++;
    if (ok) R.r++; else R.w++;
    st.place.log.push({ g: q.g, a: q.a, e: q.e, ok: !!ok, idk: ok === null });
    var top = st.place.top;
    function secure(l) { return E.placeVerdict(A.res[l]) === 1; }
    function notYet(l) { return E.placeVerdict(A.res[l]) === -1; }
    if (secure(L)) {
      if (L >= top || notYet(L + 1)) return finish(L);
      A.cur = L + 1;
    } else if (notYet(L)) {
      if (L <= 1) return finish(0);
      if (secure(L - 1)) return finish(L - 1);
      A.cur = L - 1;
    }
    if (A.n >= E.PLACE_PER_AREA) return finish(Math.max(0, A.cur - 1));
    return false;
    function finish(lv) { A.done = true; A.lv = lv; return true; }
  };
  E.placeProgress = function (st) {
    var P = st.place, done = 0; AREAS.forEach(function (a) { if (P.areas[a].done) done++; });
    return { done: done, total: AREAS.length };
  };
  /* All areas done: save the levels and build or adjust the plan. */
  E.finishPlacement = function (st) {
    var P = st.place, old = st.levels, lv = {};
    AREAS.forEach(function (a) { lv[a] = P.areas[a].lv; });
    st.levels = lv;
    st.history.push({ d: E.today(), kind: P.kind, levels: lv, n: P.log.length });
    if (old) {
      AREAS.forEach(function (a) {
        if (old[a] !== lv[a]) note(st, AREA_NAME[a] + ': level moved from ' + gname(old[a]) + ' to ' + gname(lv[a]) + ' after the re-check.', 'level');
      });
      if (AREAS.every(function (a) { return old[a] === lv[a]; })) note(st, 'Re-check done. Levels stayed the same, so the plan keeps going as it was.', 'level');
    } else note(st, 'Placement done. The plan starts at the first ideas not yet secure in each area.', 'level');
    /* gaps: an expectation missed at a grade the student is otherwise secure in */
    var gaps = {};
    P.log.forEach(function (x) { if (!x.ok && x.g <= lv[x.a]) gaps['g' + x.g + '.' + x.e] = 1; });
    st.place.done = true; st.lastPlace = P; st.place = null;
    E.buildPlan(st, Object.keys(gaps));
    return lv;
  };
  function gname(l) { return l ? 'Grade ' + l : 'early Grade 1'; }
  E.gname = gname;

  /* ---------- the plan ---------- */
  var AORD = { num: 0, ops: 1, space: 2, alg: 3, data: 4, money: 5 };
  E.buildPlan = function (st, gaps) {
    var lv = st.levels, C = st.concepts, want = [];
    AREAS.forEach(function (a) {
      var from = (lv[a] || 0) + 1, to = Math.min(8, Math.max(st.grade, from));
      for (var g = from; g <= to; g++) E.rowsFor(g, a).forEach(function (r) { want.push(r.id); });
      /* below the level: counted as secure from placement, unless a gap was found */
      for (g = 1; g < from; g++) E.rowsFor(g, a).forEach(function (r) { if (!C[r.id]) C[r.id] = { st: 'placed', days: [], miss: 0 }; });
    });
    (gaps || []).forEach(function (id) {
      if (BY_ID[id]) { C[id] = C[id] || { st: 'todo', days: [], miss: 0 }; if (C[id].st === 'placed') C[id].st = 'todo'; C[id].gap = true; want.push(id); }
    });
    want.forEach(function (id) { if (!C[id]) C[id] = { st: 'todo', days: [], miss: 0 }; else if (C[id].st === 'placed') C[id].st = 'todo'; });
    var keep = {}; want.forEach(function (id) { keep[id] = 1; });
    /* anything already in the queue (step-backs, reviews) stays */
    st.queue.forEach(function (id) { if (C[id] && C[id].st !== 'mastered') keep[id] = 1; });
    st.queue = Object.keys(keep).filter(function (id) { return C[id].st !== 'mastered'; });
    E.order(st);
    E.fillWeek(st, true);
  };
  /* Order: pinned first, then gaps and step-backs, then by grade (lowest first), then area (number first), then code. */
  E.order = function (st) {
    var C = st.concepts, pin = st.prefs.pin || [], skip = st.prefs.skip || [];
    st.queue = st.queue.filter(function (id) { return skip.indexOf(id) < 0 && C[id] && C[id].st !== 'mastered'; });
    function key(id) {
      var r = BY_ID[id], c = C[id], p = pin.indexOf(id);
      return [p >= 0 ? p : 99, c.st === 'review' || c.step || c.gap ? 0 : 1, c.manual != null ? c.manual : 999, r.g, AORD[r.area], parseFloat(r.code.slice(1))];
    }
    st.queue.sort(function (a, b) {
      var ka = key(a), kb = key(b);
      for (var i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return ka[i] - kb[i];
      return a < b ? -1 : 1;
    });
  };
  /* This week's focus: keep unfinished ones, top up from the front of the queue. */
  E.fillWeek = function (st, reset) {
    var C = st.concepts, W = st.week;
    if (!W || reset) W = st.week = { start: E.today(), items: (W && W.items) || [] };
    W.items = W.items.filter(function (id) { return C[id] && C[id].st !== 'mastered' && st.queue.indexOf(id) >= 0; });
    for (var i = 0; i < st.queue.length && W.items.length < E.WEEK_SIZE; i++) {
      var id = st.queue[i];
      if (W.items.indexOf(id) < 0) W.items.push(id);
    }
    W.items.forEach(function (id) { if (C[id].st === 'todo') { C[id].st = 'learning'; C[id].since = E.today(); } });
    return W.items;
  };

  /* Evidence: a right answer on a day. Mastered after right on MASTER_DAYS different days. */
  E.record = function (st, id, ok, extraDays) {
    var c = st.concepts[id] || (st.concepts[id] = { st: 'learning', days: [], miss: 0 }), d = E.today(), r = BY_ID[id];
    c.last = d;
    if (ok) {
      c.miss = 0;
      if (c.days.indexOf(d) < 0) c.days.push(d);
      var days = c.days.slice(); (extraDays || []).forEach(function (x) { if (days.indexOf(x) < 0) days.push(x); });
      if (c.st !== 'mastered' && days.length >= E.MASTER_DAYS) {
        c.st = 'mastered'; c.mastered = d;
        note(st, 'Mastered: ' + E.title(r) + '. Right on ' + days.length + ' different days.', 'mastered');
        st.queue = st.queue.filter(function (x) { return x !== id; });
      }
      return 'ok';
    }
    if (c.st === 'mastered' || c.st === 'placed') {
      c.st = 'review'; c.days = []; c.miss = 1;
      if (st.queue.indexOf(id) < 0) st.queue.unshift(id);
      note(st, 'Back for review: ' + E.title(r) + '. It was missed in a check, so it returns to the plan.', 'review');
      E.order(st);
      return 'review';
    }
    c.miss = (c.miss || 0) + 1;
    if (c.miss >= E.STEP_BACK) return E.stepBack(st, id) ? 'stepback' : 'miss';
    return 'miss';
  };
  /* Find the idea that comes before: the same expectation a grade lower, else the same topic, else that area's first idea. */
  E.prereq = function (id) {
    var r = BY_ID[id]; if (!r || r.g <= 1) return null;
    var lower = E.rowsFor(r.g - 1, r.area);
    return lower.filter(function (x) { return x.code === r.code && x.topic === r.topic; })[0] ||
      lower.filter(function (x) { return x.topic === r.topic; })[0] || lower.filter(function (x) { return x.code === r.code; })[0] || lower[0] || null;
  };
  E.stepBack = function (st, id) {
    var c = st.concepts[id], r = BY_ID[id], p = E.prereq(id);
    c.miss = 0; c.alt = true;
    if (!p) { note(st, 'Still tricky: ' + E.title(r) + '. Trying a different explanation next time.', 'step'); return false; }
    var pc = st.concepts[p.id] || (st.concepts[p.id] = { st: 'todo', days: [], miss: 0 });
    if (pc.st === 'mastered' || pc.st === 'placed') pc.st = 'review';
    pc.step = true; pc.days = pc.st === 'review' ? [] : pc.days;
    if (st.queue.indexOf(p.id) < 0) st.queue.push(p.id);
    note(st, 'Stepped back to ' + E.title(p) + ' because ' + E.title(r) + ' was missed twice in a row. ' + E.title(r) + ' stays in the plan with a different explanation.', 'step');
    E.order(st);
    if (st.week) {
      var w = st.week.items, at = w.indexOf(id);
      if (w.indexOf(p.id) < 0) { if (at >= 0) w.splice(at, 0, p.id); else w.unshift(p.id); if (w.length > E.WEEK_SIZE + 1) w.pop(); }
      if (pc.st === 'todo') { pc.st = 'learning'; pc.since = E.today(); }
    }
    return true;
  };
  E.title = function (r) { return 'Grade ' + r.g + ' ' + r.topic.replace(/\s+$/, '') + ' (' + r.code + ')'; };
  /* A short, plain-language line for the expectation, from blurbs.js. The full Ministry wording is r.text. */
  E.plain = function (r) { return window.PLB[r.id]; };

  /* ---------- sessions and check-ins ---------- */
  /* Warm-up: 3 quick review questions from ideas already secure, oldest first. */
  E.warmup = function (st, n) {
    n = n || 3;
    var C = st.concepts, pool = Object.keys(C).filter(function (id) { return (C[id].st === 'mastered' || C[id].st === 'placed') && hasItems(id); });
    pool.sort(function (a, b) { return (C[a].last || '') < (C[b].last || '') ? -1 : 1; });
    var mastered = pool.filter(function (id) { return C[id].st === 'mastered'; }), placed = pool.filter(function (id) { return C[id].st === 'placed'; });
    /* placed ideas: favour the ones just under the student's level */
    placed.sort(function (a, b) { return BY_ID[b].g - BY_ID[a].g + (Math.random() - 0.5) * 2; });
    var list = mastered.slice(0, 2).concat(placed).slice(0, n);
    if (list.length < n) {
      /* nothing secure yet: use the easiest questions in each area */
      AREAS.forEach(function (a) { if (list.length < n) list.push('g1.' + E.pick(1, a).e); });
    }
    return list.slice(0, n).map(function (id) { return E.questionFor(id); }).filter(Boolean);
  };
  function hasItems(id) { var r = BY_ID[id]; return r && BANK.some(function (b) { return b.g === r.g && b.a === r.area; }); }
  E.questionFor = function (id, avoid) {
    var r = BY_ID[id]; if (!r) return null;
    var item = E.pick(r.g, r.area, avoid || [], r.code);
    if (!item) return null;
    var q = E.make(item); q.concept = id; q.exact = item.e === r.code;
    return q;
  };
  /* Today's concept: the week item with the least evidence so far (step-backs first). */
  E.todayConcept = function (st) {
    var C = st.concepts, w = (st.week && st.week.items) || [];
    var list = w.filter(function (id) { return C[id] && C[id].st !== 'mastered'; });
    if (!list.length) { E.fillWeek(st); list = st.week.items.slice(); }
    list.sort(function (a, b) {
      var d = (C[b].step ? 1 : 0) - (C[a].step ? 1 : 0); if (d) return d;
      d = C[a].days.length - C[b].days.length; if (d) return d;
      return (C[a].last || '') < (C[b].last || '') ? -1 : 1;
    });
    return list[0] || null;
  };
  E.weeklyDue = function (st) {
    var last = st.checkins.length ? st.checkins[st.checkins.length - 1].d : st.week ? st.week.start : null;
    return !!last && E.daysBetween(last, E.today()) >= 7;
  };
  E.recheckDue = function (st) {
    var h = st.history[st.history.length - 1];
    return !!h && E.daysBetween(h.d, E.today()) >= E.RECHECK_DAYS;
  };
  /* Weekly check-in: 2 questions per focus idea and 2 on mastered ideas. About 10 questions. */
  E.checkinQuestions = function (st) {
    var C = st.concepts, out = [], w = (st.week && st.week.items) || [];
    w.forEach(function (id) { var used = []; for (var k = 0; k < 2; k++) { var q = E.questionFor(id, used); if (q) { used.push(q.item); out.push(q); } } });
    var m = Object.keys(C).filter(function (id) { return C[id].st === 'mastered' && hasItems(id); }).sort(function (a, b) { return (C[a].last || '') < (C[b].last || '') ? -1 : 1; }).slice(0, 2);
    m.forEach(function (id) { var q = E.questionFor(id); if (q) { q.review = true; out.push(q); } });
    return out;
  };
  /* Two right on an idea in one sitting counts as one right day; any miss counts as a miss. */
  E.scoreGroup = function (st, results, extra) {
    var by = {}, outcome = {};
    results.forEach(function (x) { (by[x.concept] = by[x.concept] || []).push(x.ok); });
    Object.keys(by).forEach(function (id) {
      var all = by[id].every(Boolean);
      outcome[id] = E.record(st, id, all, extra ? extra(id) : null);
    });
    return outcome;
  };
  E.finishCheckin = function (st, results, extra) {
    var out = E.scoreGroup(st, results, extra), right = results.filter(function (x) { return x.ok; }).length;
    st.checkins.push({ d: E.today(), n: results.length, ok: right, out: out });
    note(st, 'Weekly check-in: ' + right + ' of ' + results.length + ' right. The plan for next week is updated.', 'check');
    E.order(st);
    E.fillWeek(st, true);
    return out;
  };
  E.finishSession = function (st, rec, extra) {
    var out = rec.check.length ? E.scoreGroup(st, rec.check, extra) : {};
    rec.warm.forEach(function (x) { if (!x.ok && x.concept && st.concepts[x.concept] && st.concepts[x.concept].st === 'mastered') E.record(st, x.concept, false); });
    st.sessions.push({ d: E.today(), c: rec.concept, warm: rec.warm.filter(function (x) { return x.ok; }).length + '/' + rec.warm.length, check: rec.check.filter(function (x) { return x.ok; }).length + '/' + rec.check.length });
    st.sessions = st.sessions.slice(-120);
    E.order(st); E.fillWeek(st);
    return out;
  };

  /* ---------- adult changes ---------- */
  E.setPref = function (st, kind, id, on) {
    var p = st.prefs[kind] || (st.prefs[kind] = []), i = p.indexOf(id);
    if (on && i < 0) p.push(id); if (!on && i >= 0) p.splice(i, 1);
    if (kind === 'skip' && on) { st.week && (st.week.items = st.week.items.filter(function (x) { return x !== id; })); }
    if (kind === 'skip' && !on && st.queue.indexOf(id) < 0 && st.concepts[id] && st.concepts[id].st !== 'mastered') st.queue.push(id);
    if (kind === 'pin' && on && st.queue.indexOf(id) < 0) st.queue.push(id);
    E.order(st);
    if (kind === 'pin' && on && st.week && st.week.items.indexOf(id) < 0) { st.week.items.unshift(id); if (st.week.items.length > E.WEEK_SIZE) st.week.items.pop(); if (st.concepts[id].st === 'todo') st.concepts[id].st = 'learning'; }
    E.fillWeek(st);
  };

  /* ---------- summaries ---------- */
  E.counts = function (st) {
    var c = { mastered: 0, learning: 0, review: 0, todo: 0, placed: 0 };
    Object.keys(st.concepts).forEach(function (id) { c[st.concepts[id].st] = (c[st.concepts[id].st] || 0) + 1; });
    return c;
  };

  window.PE = E;
})();
