/* Math Atlas: saves a signed-in student's progress to their family account.
   The grade site keeps working on its own. This file only watches what it saves in the browser
   (localStorage) and copies it to Firebase, and brings it back on another device. */
import {
  configured, auth, db, onAuthStateChanged, whoAmI, signOutAll, clearDeviceProgress, esc, today,
  doc, collection, getDoc, getDocs, setDoc, query, orderBy, limit, serverTimestamp, increment, arrayUnion
} from './fb.js';

const meta = (n) => (document.querySelector('meta[name="' + n + '"]') || {}).content;
const SITE = meta('atlas-site') || 'g5';
const PREFIX = meta('atlas-prefix') || SITE + 'atlas:';
const ROOT = meta('atlas-root') || '../';
const DEVICE_ONLY = { theme: 1, big: 1 };
const TS_KEY = 'atlasSync:' + SITE + ':ts', OWNER_KEY = 'atlasSync:' + SITE + ':owner';

const S = Storage.prototype, rawSet = S.setItem, rawGet = S.getItem;
const get = (k) => rawGet.call(localStorage, k);
const put = (k, v) => rawSet.call(localStorage, k, v);
const parse = (v, d) => { try { return v == null ? d : JSON.parse(v); } catch (e) { return d; } };

let me = null, sid = null, progRef = null, ts = {}, dirty = {}, delta = null, timer = null, state = 'off';
try { ts = parse(get(TS_KEY), {}) || {}; } catch (e) { ts = {}; }
const freshDelta = () => ({ n: 0, ok: 0, qn: 0, qok: 0, cn: 0, cok: 0, skills: {}, checkups: [], quiz: {}, events: [] });
delta = freshDelta();

function progressKey(k) {
  if (typeof k !== 'string' || k.indexOf(PREFIX) !== 0) return null;
  const key = k.slice(PREFIX.length);
  return DEVICE_ONLY[key] ? null : key;
}
function localProgress() {
  const out = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i), key = progressKey(k);
    if (key) out[key] = get(k);
  }
  return out;
}

/* Watch every save the site makes. */
S.setItem = function (k, v) {
  const key = this === localStorage ? progressKey(k) : null;
  if (!key) return rawSet.call(this, k, v);
  const old = rawGet.call(this, k);
  rawSet.call(this, k, v);
  if (old !== String(v)) changed(key, old, String(v));
};

function changed(key, old, v) {
  ts[key] = Date.now();
  try { put(TS_KEY, JSON.stringify(ts)); } catch (e) { /* full or blocked */ }
  if (!sid) return;
  dirty[key] = v;
  if (key.indexOf('sk:') === 0) {
    const a = parse(old, {}) || {}, b = parse(v, {}) || {};
    const dn = (b.n || 0) - (a.n || 0), dok = (b.ok || 0) - (a.ok || 0);
    if (dn > 0) {
      const id = key.slice(3), s = delta.skills[id] || (delta.skills[id] = { n: 0, ok: 0 });
      delta.n += dn; delta.ok += Math.max(0, dok); s.n += dn; s.ok += Math.max(0, dok);
    }
  } else if (key === 'checkups') {
    const a = parse(old, []) || [], b = parse(v, []) || [];
    const last = b[b.length - 1];
    if (last && JSON.stringify(last) !== JSON.stringify(a[a.length - 1])) {
      delta.checkups.push(last);
      delta.cn += +last.n || 0; delta.cok += +last.s || 0;
      delta.events.push({ at: Date.now(), kind: 'checkup', w: String(last.w || ''), s: +last.s || 0, n: +last.n || 0 });
    }
  } else if (key.indexOf('best:') === 0) {
    delta.quiz[key.slice(5)] = +v;
  }
  soon();
}
function soon() {
  if (!sid) return;
  clearTimeout(timer);
  timer = setTimeout(flush, 1500);
  badge('saving');
}

/* Things the parent page lists under "Recent activity": lessons opened and quizzes finished. */
function chapterNow() {
  const id = (location.hash || '').replace('#', '').split('/')[0], A = window.Atlas;
  const m = A && A.meta && A.meta.filter((x) => x.id === id)[0];
  return m && A.chapters[id] ? { ch: id, title: m.title.replace(/&[a-z]+;/g, ' ') } : null;
}
const seenToday = {};
function noteVisit() {
  const c = chapterNow(), key = today() + c?.ch;
  if (!sid || !c || seenToday[key]) return;
  seenToday[key] = 1;
  delta.events.push({ at: Date.now(), kind: 'lesson', ch: c.ch, t: c.title });
  soon();
}
const quizDone = new WeakSet();
new MutationObserver(() => {
  if (!sid) return;
  document.querySelectorAll('#app .qscore').forEach((el) => {
    const m = /^(\d+) of (\d+) right on the first try/.exec(el.textContent || '');
    if (!m || quizDone.has(el)) return;
    quizDone.add(el);
    const c = chapterNow() || { ch: '', title: '' };
    delta.qn += +m[2]; delta.qok += +m[1];
    delta.events.push({ at: Date.now(), kind: 'quiz', ch: c.ch, t: c.title, s: +m[1], n: +m[2] });
    soon();
  });
}).observe(document.documentElement, { subtree: true, childList: true, characterData: true });
window.addEventListener('hashchange', () => { setTimeout(noteVisit, 0); flush(); });

async function flush() {
  clearTimeout(timer);
  if (!sid || (!Object.keys(dirty).length && !delta.events.length)) return;
  const d = dirty, dl = delta, t = {};
  dirty = {}; delta = freshDelta();
  Object.keys(d).forEach((k) => { t[k] = ts[k] || Date.now(); });
  const writes = [setDoc(progRef, { site: SITE, data: d, ts: t, updated: serverTimestamp() }, { merge: true })];
  if (dl.n || dl.events.length || Object.keys(dl.quiz).length) {
    const day = today(), row = { site: SITE, date: day, updated: serverTimestamp() };
    if (dl.n) {
      row.n = increment(dl.n); row.ok = increment(dl.ok); row.skills = {};
      Object.keys(dl.skills).forEach((id) => { row.skills[id] = { n: increment(dl.skills[id].n), ok: increment(dl.skills[id].ok) }; });
    }
    if (dl.qn) { row.qn = increment(dl.qn); row.qok = increment(dl.qok); }
    if (dl.cn) { row.cn = increment(dl.cn); row.cok = increment(dl.cok); }
    if (dl.checkups.length) row.checkups = arrayUnion.apply(null, dl.checkups);
    if (dl.events.length) row.events = arrayUnion.apply(null, dl.events);
    if (Object.keys(dl.quiz).length) row.quiz = dl.quiz;
    writes.push(setDoc(doc(db, 'students', sid, 'days', SITE + '_' + day), row, { merge: true }));
  }
  try {
    await Promise.all(writes);
    badge('saved');
  } catch (e) {
    console.warn('Math Atlas: could not save progress yet', e);
    Object.keys(d).forEach((k) => { if (!(k in dirty)) dirty[k] = d[k]; });
    delta.events = dl.events.concat(delta.events);
    badge('offline');
    timer = setTimeout(flush, 30000);
  }
}
window.atlasFlush = flush;
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
window.addEventListener('pagehide', flush);

/* What the family page needs to label skills: chapter and skill names from this grade site. */
function catalog() {
  const A = window.Atlas;
  if (!A || !A.meta) return null;
  /* grades with the lesson engine list their concepts too (Atlas.lessons) */
  let concepts = [];
  try { if (A.lessons && A.lessons.all) concepts = A.lessons.all(); } catch (e) { concepts = []; }
  return A.meta.filter((m) => !m.ref && A.chapters[m.id]).map((m) => {
    const ch = A.chapters[m.id];
    return {
      id: m.id, title: m.title.replace(/&[a-z]+;/g, ' '), strand: m.strand, codes: m.codes || '',
      quiz: ch.quiz ? ch.quiz.length : 0,
      skills: (ch.practice || []).map((sk) => ({ id: sk.id, name: sk.name, code: sk.code || '' })),
      concepts: concepts.filter((c) => c.ch === m.id).map((c) => ({ id: c.id, t: c.title, l: c.lesson, sk: c.skill, exp: c.exp }))
    };
  });
}

/* Bring saved progress together: the newer copy of each item wins. */
async function pull() {
  const snap = await getDoc(progRef);
  const remote = snap.exists() ? snap.data() : {};
  const rData = remote.data || {}, rTs = remote.ts || {};
  if (get(OWNER_KEY) && get(OWNER_KEY) !== sid) { clearDeviceProgress(); ts = {}; }
  const local = localProgress(), up = {}, upTs = {};
  let redraw = false;
  Object.keys(Object.assign({}, rData, local)).forEach((key) => {
    const rv = rData[key], lv = local[key], rt = rTs[key] || 0, lt = ts[key] || 0;
    if (key === 'checkups' && rv != null && lv != null && rv !== lv) {
      /* keep every check-up from both copies */
      const seen = {}, all = (parse(rv, []) || []).concat(parse(lv, []) || []).filter((r) => {
        const j = JSON.stringify(r); if (seen[j]) return false; seen[j] = 1; return true;
      }).sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0)).slice(-30);
      const v = JSON.stringify(all);
      put(PREFIX + key, v); ts[key] = Math.max(rt, lt); redraw = true;
      if (v !== rv) { up[key] = v; upTs[key] = ts[key]; }
    } else if (rv != null && (lv == null || rt >= lt)) {
      if (lv !== rv) { put(PREFIX + key, rv); redraw = true; }
      ts[key] = rt;
    } else if (lv != null) {
      up[key] = lv; upTs[key] = lt || Date.now(); ts[key] = upTs[key];
    }
  });
  put(TS_KEY, JSON.stringify(ts));
  put(OWNER_KEY, sid);
  const row = { site: SITE, updated: serverTimestamp() };
  if (Object.keys(up).length) { row.data = up; row.ts = upTs; }
  const cat = catalog(), catS = JSON.stringify(cat);
  if (cat && catS !== JSON.stringify(remote.catalog || null)) row.catalog = cat;
  if (row.data || row.catalog || !snap.exists()) await setDoc(progRef, row, { merge: true });
  return redraw;
}

/* ---------- small additions to the page ---------- */
function bar() {
  let el = document.getElementById('acct');
  if (!el) {
    const w = document.querySelector('.bar .wrap');
    if (!w) return null;
    el = document.createElement('div');
    el.id = 'acct'; el.className = 'acct';
    w.appendChild(el);
  }
  return el;
}
function badge(s) {
  state = s;
  const b = document.getElementById('acct-state');
  if (b) b.textContent = s === 'saving' ? 'Saving' : s === 'saved' ? 'Saved' : s === 'offline' ? 'Not saved yet' : '';
}
function drawBar() {
  const el = bar();
  if (!el) return;
  const back = encodeURIComponent(location.pathname + location.hash);
  if (!me) {
    el.innerHTML = '<a href="' + ROOT + 'family.html?next=' + back + '">Sign in</a>';
    /* come back to the page they are on when they click, not when the link was drawn */
    el.firstChild.addEventListener('click', function () { this.href = ROOT + 'family.html?next=' + encodeURIComponent(location.pathname + location.hash); });
  } else if (me.role === 'student') {
    el.innerHTML = '<span class="who">' + esc(me.name) + '</span> <span class="t2" id="acct-state" aria-live="polite"></span>' +
      ' <button type="button" id="acct-out">Sign out</button>';
    badge(state);
  } else if (me.role === 'parent' || me.role === 'tutor') {
    el.innerHTML = '<a href="' + ROOT + 'family.html">' + (me.role === 'tutor' ? 'Tutor page' : 'Parent page') + '</a>' +
      ' <button type="button" id="acct-out">Sign out</button>';
  } else {
    el.innerHTML = '<a href="' + ROOT + 'family.html">Account</a> <button type="button" id="acct-out">Sign out</button>';
  }
  const out = document.getElementById('acct-out');
  if (out) out.addEventListener('click', async () => {
    out.disabled = true;
    await signOutAll();
    location.reload();
  });
}

let extras = null;
async function loadExtras() {
  const kid = await getDoc(doc(db, 'students', sid));
  const notes = await getDocs(query(collection(db, 'students', sid, 'notes'), orderBy('at', 'desc'), limit(2)));
  extras = {
    assigned: ((kid.exists() && kid.data().assigned) || []).filter((a) => a.site === SITE),
    notes: notes.docs.map((d) => d.data())
  };
}
function decorate() {
  if (!me || me.role !== 'student') return;
  const start = document.querySelector('#app .start');
  if (start && extras && !document.getElementById('fromadults') && (extras.assigned.length || extras.notes.length)) {
    const box = document.createElement('div');
    box.id = 'fromadults'; box.className = 'start fromadults';
    let h = '';
    if (extras.assigned.length) {
      h += '<p><b>Suggested practice</b></p><ul>' + extras.assigned.map((a) =>
        '<li><a href="#' + esc(a.ch) + '/practice/' + esc(a.sk) + '">' + esc(a.name) + '</a> <span class="t2">(' + esc(a.t) + ')</span></li>').join('') + '</ul>';
    }
    extras.notes.forEach((n) => {
      h += '<p class="anote"><b>' + esc(n.byName) + '</b> <span class="t2">(' + esc(n.byRole) + ')</span>: ' + esc(n.text) + '</p>';
    });
    box.innerHTML = h;
    start.parentNode.insertBefore(box, start);
  }
  document.querySelectorAll('#app .note p').forEach((p) => {
    if (/^Progress\b/.test(p.textContent)) p.innerHTML = '<b>Progress</b> is saved to ' + esc(me.name) + '\'s account, so you can use another device. Parents and tutors linked to the account can see it.';
  });
}
window.addEventListener('hashchange', () => setTimeout(decorate, 0));

/* Grown-up view (coaching notes such as common mistakes): on for a parent or tutor, off and hidden for a student. */
function grownUpView(who) {
  const role = who && who.role;
  if (role !== 'student' && role !== 'parent' && role !== 'tutor') return;
  const on = role !== 'student';
  try { localStorage.setItem('atlas:adult', on ? '1' : '0'); } catch (e) { /* storage blocked */ }
  if (window.Atlas && window.Atlas.adult) window.Atlas.adult(on);
  document.documentElement.classList.toggle('kidview', !on);
}

function rerender() { window.dispatchEvent(new HashChangeEvent('hashchange')); }

if (configured) {
  drawBar();
  onAuthStateChanged(auth, async (user) => {
    try {
      me = await whoAmI(user);
      grownUpView(me);
      if (!me && get(OWNER_KEY)) { clearDeviceProgress(); ts = {}; rerender(); }
      if (me && me.role === 'student' && me.sid) {
        const kid = await getDoc(doc(db, 'students', me.sid)).catch(() => null);
        if (!kid || !kid.exists() || kid.data().uid !== user.uid) {
          me = Object.assign({}, me, { role: 'old' });
        } else {
          sid = me.sid;
          progRef = doc(db, 'students', sid, 'progress', SITE);
          drawBar();
          const redraw = await pull();
          await loadExtras().catch(() => { extras = null; });
          badge('saved');
          if (redraw) rerender(); else decorate();
          noteVisit();
          import('./live.js').then((L) => L.startHost(sid, me.name)).catch((e) => console.warn('Math Atlas: Work together is off', e));
          return;
        }
      }
      drawBar();
    } catch (e) {
      console.warn('Math Atlas: sign-in check failed', e);
      drawBar();
    }
  });
}
