/* Atlas top bar and home page, loaded by index.html and curriculum.html: the sign-in pop-over, the account menu,
   the Math plan and Language panels (home page only) and the "Your grade" tag on the curriculum list (curriculum page only).
   Both pages are plain HTML that works even if this file cannot load. */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const parse = (v, d) => { try { return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
const AREA = { num: 'Number', ops: 'Operations', alg: 'Algebra', space: 'Spatial sense', data: 'Data', money: 'Money' };
const initial = (n) => esc((String(n || '?').trim()[0] || '?').toUpperCase());
const plural = (n, a) => n + ' ' + a + (n === 1 ? '' : 's');

function dayNum(s) { const p = String(s).split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5; }
function todayStr() { const d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }

/* ---------- the expectation list, loaded only when there is a plan to show ---------- */
let ladder = null;
function loadLadder() {
  if (ladder) return ladder;
  ladder = new Promise((res) => {
    const done = () => {
      const by = {};
      (window.PL || []).forEach((r) => { by['g' + r[0] + '.' + r[1]] = { g: r[0], code: r[1], area: r[2], topic: r[3], text: r[4] }; });
      res(by);
    };
    if (window.PL) return done();
    const s = document.createElement('script');
    s.src = 'plan/ladder.js'; s.onload = done; s.onerror = done;
    document.head.appendChild(s);
  });
  return ladder;
}
/* the same plain wording Math Plan uses */
function plain(r) {
  const t = String(r.text || '').replace(/,? ?(in various contexts|using a variety of tools and strategies|using appropriate tools(?: and strategies)?|using various tools(?: and drawings)?)/g, '').replace(/\s+,/g, ',').replace(/\s+/g, ' ').trim();
  return t ? t[0].toUpperCase() + t.slice(1) : r.topic;
}

/* ---------- a saved plan, summed up ---------- */
function summary(st) {
  if (!st) return { kind: 'none' };
  if (!st.levels) return { kind: 'placing', n: st.place && st.place.log ? st.place.log.length : 0, grade: st.grade };
  const C = st.concepts || {}, week = ((st.week && st.week.items) || []).filter((id) => C[id]);
  const mastered = Object.keys(C).filter((id) => C[id].st === 'mastered').length;
  const left = (st.queue || []).filter((id) => C[id] && C[id].st !== 'mastered').length;
  const open = week.filter((id) => C[id].st !== 'mastered').sort((a, b) => {
    let d = (C[b].step ? 1 : 0) - (C[a].step ? 1 : 0); if (d) return d;
    d = (C[a].days || []).length - (C[b].days || []).length; if (d) return d;
    return (C[a].last || '') < (C[b].last || '') ? -1 : 1;
  });
  const last = st.checkins && st.checkins.length ? st.checkins[st.checkins.length - 1].d : st.week ? st.week.start : null;
  const since = last ? dayNum(todayStr()) - dayNum(last) : 0;
  return { kind: 'plan', C, week, today: open[0] || null, mastered, left, checkIn: Math.max(0, 7 - since), grade: st.grade, name: st.name };
}

function focusList(S, by) {
  return '<ul class="focus">' + S.week.map((id) => {
    const c = S.C[id], r = by[id] || { g: id.slice(1, id.indexOf('.')), topic: id, text: '' }, d = Math.min(2, (c.days || []).length);
    const state = c.st === 'mastered' ? 'Mastered' : d === 1 ? 'Right on 1 of 2 days' : c.step ? 'Going back a step first' : c.st === 'review' ? 'Review' : 'Not yet practised';
    return '<li><span class="dot d' + (c.st === 'mastered' ? 2 : d) + '" aria-hidden="true"></span><span><span class="ft">Grade ' + esc(r.g) + ' · ' + esc(String(r.topic).trim()) + '</span>' +
      '<span class="fx">' + esc(plain(r)) + '</span><span class="fs' + (c.gap ? ' gap' : '') + '">' +
      (c.gap ? 'Gap from the placement check · ' : '') + state + '</span></span></li>';
  }).join('') + '</ul>';
}

/* ---------- My plan panel ---------- */
const body = () => $('#plan-body');
function setHead(kicker, title) { $('#plan .kicker').textContent = kicker; $('#plan-h').textContent = title; }

async function showPlan(st, who) {
  const S = summary(st);
  markGrade(S.grade);
  if (!body()) return;
  if (S.kind === 'none') {
    if (who && who.role === 'student') {
      setHead('Math', 'Find your starting point');
      body().innerHTML = '<p>A short check finds the right place to start in each part of math. Then you get a plan with a few ideas each week.</p>' +
        '<ol class="steps"><li><b>Placement check</b><span>About 30 questions. It gets easier or harder as you go. Take your time.</span></li>' +
        '<li><b>Weekly plan</b><span>Four ideas at a time, each with its lesson.</span></li>' +
        '<li><b>Check-ins</b><span>Ten questions each week to see what is solid.</span></li></ol>' +
        '<p><a class="hbtn" href="plan/">Start the placement check</a></p>';
    }
    return;
  }
  if (S.kind === 'placing') {
    setHead('Math', 'Placement check in progress');
    body().innerHTML = '<p>' + plural(S.n, 'question') + ' answered so far. It takes about 30, and it saves as you go.</p>' +
      '<div class="bar" style="margin:14px 0 18px" role="img" aria-label="About ' + Math.min(100, Math.round(S.n / 30 * 100)) + '% done"><i style="width:' + Math.min(100, Math.round(S.n / 30 * 100)) + '%"></i></div>' +
      '<p><a class="hbtn" href="plan/">Continue the check</a></p>';
    return;
  }
  setHead('Math', S.name && who && who.role !== 'student' ? S.name + '’s plan' : 'This week’s plan');
  body().innerHTML = '<p class="loading">Loading the plan…</p>';
  const by = await loadLadder(), t = S.today && by[S.today], total = S.mastered + S.left;
  let h = '';
  if (t) {
    h += '<div class="today"><p class="tl">Today’s idea · Grade ' + esc(t.g) + ' ' + esc(String(t.topic).trim()) + '</p><h3>' + esc(plain(t)) + '</h3>' +
      '<a class="hbtn" href="plan/">Start today’s idea</a></div>';
  } else {
    h += '<div class="today"><p class="tl">This week</p><h3>All four ideas are mastered</h3><p>The weekly check-in sets up the next ones.</p><a class="hbtn" href="plan/">Open my plan</a></div>';
  }
  h += '<div class="prog"><div><b>' + S.mastered + '</b><span>mastered</span></div><div><b>' + S.left + '</b><span>still to go</span></div>' +
    '<div><b>' + (S.checkIn ? S.checkIn + 'd' : 'Now') + '</b><span>' + (S.checkIn ? 'to check-in' : 'check-in due') + '</span></div></div>';
  if (total) h += '<div class="bar" role="img" aria-label="' + S.mastered + ' of ' + total + ' ideas in the plan mastered"><i style="width:' + Math.round(100 * S.mastered / total) + '%"></i></div>';
  h += '<h3 class="sh">In focus this week</h3>' + focusList(S, by);
  h += '<div class="acts"><a class="hbtn ghost sm" href="plan/#plan">See the whole plan</a>' + (S.checkIn ? '' : '<a class="hbtn sm" href="plan/">Do the check-in</a>') + '</div>';
  body().innerHTML = h;
}

function markGrade(g) {
  g = +g;
  if (!(g >= 1 && g <= 8)) return;
  document.documentElement.dataset.grade = g;
  $$('.grade').forEach((d) => { const on = +d.dataset.g === g; d.classList.toggle('mine', on); $('.gtag', d).hidden = !on; });
}

function suggestions(kid) {
  const list = (kid && kid.assigned) || [];
  if (!list.length) return '';
  return '<h3 class="sh">Suggested by your grown-ups</h3><ul class="sug">' + list.slice(0, 5).map((a) => {
    const g = /^g(\d)$/.exec(a.site || '');
    return '<li><a href="' + (g ? 'grade' + g[1] + '/' : '') + '#' + esc(a.ch) + '/practice/' + esc(a.sk) + '">' + esc(a.name) + '</a> <span class="t3">' + (g ? 'Grade ' + g[1] : '') + '</span></li>';
  }).join('') + '</ul>';
}

/* ---------- Language: which grade a student is working in ---------- */
/* saved Language progress on the student's account, newest first: [{ g, data, catalog }] */
async function langProgress(F, sid) {
  const rows = await Promise.all([1, 2, 3, 4, 5, 6, 7, 8].map(async (g) => {
    const p = await F.getDoc(F.doc(F.db, 'students', sid, 'progress', 'l' + g)).catch(() => null);
    const d = p && p.exists() ? p.data() : null;
    return d && d.data && Object.keys(d.data).length ? { g, data: d.data, catalog: d.catalog || [], at: d.updated && d.updated.toMillis ? d.updated.toMillis() : 0 } : null;
  }));
  return rows.filter(Boolean).sort((a, b) => b.at - a.at);
}
/* without an account: the highest Language grade with progress saved in this browser */
function localLangGrade() {
  let g = 0;
  try { for (let i = 0; i < localStorage.length; i++) { const m = /^lang-g(\d):/.exec(localStorage.key(i)); if (m) g = Math.max(g, +m[1]); } } catch (e) { /* storage blocked */ }
  return g;
}
function showLanguage(g) {
  const b = $('#lang-body');
  if (!b || !g) return;
  $('#lang-h').textContent = 'Grade ' + g + ' Language';
  b.innerHTML = '<p>Pick up where you left off, or choose another grade.</p>' +
    '<div class="acts"><a class="hbtn" href="language/grade' + g + '/">Open Grade ' + g + ' Language</a><a class="hbtn ghost" href="curriculum.html#language">All grades</a></div>';
}
function langLine(rows) {
  const r = rows[0];
  if (!r) return 'Language: not started yet.';
  let total = 0, secure = 0;
  r.catalog.forEach((ch) => ch.skills.forEach((sk) => { total++; if ((parse(r.data['sk:' + sk.id], {}) || {}).secure) secure++; }));
  return 'Language: Grade ' + r.g + (total ? ', ' + secure + ' of ' + plural(total, 'skill') + ' secure.' : '.');
}

/* ---------- parents and tutors: one card per student ---------- */
async function showKids(F, me) {
  const word = me.role === 'tutor' ? 'students' : 'children';
  setHead('Plans', me.role === 'tutor' ? 'Your students' : 'Your children');
  body().innerHTML = '<p class="loading">Loading ' + word + '…</p>';
  const kids = await kidsOf(F, me);
  if (!kids.length) {
    body().innerHTML = '<p>No ' + word + ' yet. ' + (me.role === 'tutor'
      ? 'Ask a parent to share their child with <b>' + esc(me.user.email) + '</b>, or add a student yourself.'
      : 'Add your child to make their sign-in. They do not need an email.') + '</p>' +
      '<p><a class="hbtn" href="family.html#add">Add a student</a></p>';
    return;
  }
  const by = await loadLadder();
  const rows = await Promise.all(kids.map(async (k) => {
    const snap = await F.getDoc(F.doc(F.db, 'students', k.id, 'progress', 'plan')).catch(() => null);
    const data = snap && snap.exists() ? snap.data() : null;
    return { k, S: summary(parse(data && data.data ? data.data.state : null, null)), upd: data && data.updated, lang: await langProgress(F, k.id) };
  }));
  body().innerHTML = '<ul class="kids">' + rows.map(({ k, S, upd, lang }) => {
    let status = '', chips = '';
    if (S.kind === 'none') status = 'Math: has not taken the placement check yet.';
    else if (S.kind === 'placing') status = 'Math: placement check in progress, ' + plural(S.n, 'question') + ' answered.';
    else {
      status = 'Math: ' + S.mastered + ' mastered, ' + S.left + ' to go. ' + (S.checkIn ? 'Check-in in ' + plural(S.checkIn, 'day') + '.' : 'Weekly check-in is due.');
      chips = '<p class="kf">This week: ' + S.week.map((id) => '<span>' + esc(by[id] ? 'Grade ' + by[id].g + ' ' + String(by[id].topic).trim() : id) + (S.C[id].st === 'mastered' ? ' ✓' : '') + '</span>').join('') + '</p>';
    }
    const seen = upd && upd.toDate ? ' Last plan activity ' + upd.toDate().toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) + '.' : '';
    return '<li class="kid"><div class="kh"><span class="av" aria-hidden="true">' + initial(k.name) + '</span><div><h3>' + esc(k.name) + '</h3>' +
      '<p class="ks">' + status + seen + '</p><p class="ks">' + esc(langLine(lang)) + '</p></div></div>' + chips +
      '<div class="acts"><a class="hbtn sm" href="plan/?sid=' + encodeURIComponent(k.id) + '">' + (S.kind === 'plan' ? 'Open plan' : 'Go to Math Plan') + '</a>' +
      '<a class="hbtn ghost sm" href="family.html#s/' + encodeURIComponent(k.id) + '">Progress and notes</a></div></li>';
  }).join('') + '</ul><div class="acts"><a class="hbtn ghost sm" href="family.html#add">Add a student</a></div>';
}

async function kidsOf(F, me) {
  const uid = me.user.uid, em = me.user.emailVerified ? (me.user.email || '').toLowerCase() : '';
  const S = F.collection(F.db, 'students'), qs = [F.query(S, F.where('ownerUid', '==', uid))];
  if (em) { qs.push(F.query(S, F.where('parentEmails', 'array-contains', em))); qs.push(F.query(S, F.where('tutorEmails', 'array-contains', em))); }
  const out = {};
  for (const q of qs) {
    const r = await F.getDocs(q).catch(() => ({ docs: [] }));
    r.docs.forEach((d) => { out[d.id] = Object.assign({ id: d.id }, d.data()); });
  }
  return Object.values(out).sort((a, b) => String(a.name).localeCompare(b.name));
}

/* ---------- the greeting at the top ---------- */
function greet(me) {
  const hour = new Date().getHours(), part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  if (!$('#hello')) return;
  const first = String(me.name || '').trim().split(/\s+/)[0];
  $('#hello').textContent = first ? part + ', ' + first : part;
  if (me.role === 'student') {
    $('#hello-role').textContent = 'Student';
    $('#hello-sub').textContent = 'Pick up today’s idea in your plan, or open any grade to explore. Your practice saves to your account.';
  } else {
    $('#hello-role').textContent = me.role === 'tutor' ? 'Tutor' : 'Parent';
    $('#hello-sub').textContent = (me.role === 'tutor' ? 'Your students’' : 'Your children’s') +
      ' plans and progress, in one place.';
  }
}

/* ---------- sign-in pop-over and account menu ---------- */
let F = null, lastFocus = null;
document.body.insertAdjacentHTML('beforeend', `<div class="pop" id="signin" role="dialog" aria-modal="false" aria-labelledby="signin-h" hidden>
  <div class="pophead"><h2 id="signin-h">Sign in</h2><button type="button" class="x" id="signin-close" aria-label="Close sign in">&times;</button></div>
  <div class="seg" role="radiogroup" aria-label="Who is signing in">
    <label><input type="radio" name="who" value="kid" checked><span>Student</span></label>
    <label><input type="radio" name="who" value="adult"><span>Parent or tutor</span></label>
  </div>
  <form id="f-kid" class="sform">
    <label>Username<input name="u" autocomplete="username" autocapitalize="none" spellcheck="false" required></label>
    <label>Password<input name="p" type="password" autocomplete="current-password" required></label>
    <button class="hbtn wide" type="submit">Sign in</button>
    <p class="fb" aria-live="polite"></p>
    <p class="hint">Forgot your password? Ask the grown-up who made your account.</p>
  </form>
  <form id="f-adult" class="sform" hidden>
    <label>Email<input name="e" type="email" autocomplete="email" required></label>
    <label>Password<input name="p" type="password" autocomplete="current-password" required></label>
    <button class="hbtn wide" type="submit">Sign in</button>
    <p class="fb" aria-live="polite"></p>
    <p class="hint"><button type="button" class="link" id="forgot">Forgot password?</button> · <a href="family.html">Create an account</a></p>
  </form>
</div>`);
const pop = $('#signin');
function openPop() {
  lastFocus = document.activeElement;
  pop.hidden = false;
  $('#signin-btn').setAttribute('aria-expanded', 'true');
  const sc = document.createElement('div'); sc.className = 'scrim'; sc.id = 'scrim'; sc.addEventListener('click', closePop);
  document.body.appendChild(sc);
  const f = $('#f-kid').hidden ? $('#f-adult') : $('#f-kid');
  f.querySelector('input').focus();
}
function closePop() {
  if (pop.hidden) return;
  pop.hidden = true;
  const sc = $('#scrim'); if (sc) sc.remove();
  const b = $('#signin-btn'); if (b) b.setAttribute('aria-expanded', 'false');
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
function nice(e) {
  const c = (e && e.code) || '';
  if (/invalid-credential|wrong-password|user-not-found|invalid-login/.test(c)) return 'That sign-in and password do not match. Check the spelling and try again.';
  if (/too-many-requests/.test(c)) return 'Too many tries. Wait a few minutes, then try again.';
  if (/network-request-failed|unavailable/.test(c)) return 'No internet connection. Check it and try again.';
  if (/invalid-email/.test(c)) return 'That email address does not look right.';
  return 'Something went wrong. Please try again.';
}
function say(f, t, ok) { const el = $('.fb', f); el.className = 'fb' + (t ? (ok ? ' ok' : ' bad') : ''); el.textContent = t || ''; }

function wireSignin() {
  const btn = $('#signin-btn');
  btn.addEventListener('click', (e) => { if (!F) return; e.preventDefault(); if (pop.hidden) openPop(); else closePop(); });
  $('#signin-close').addEventListener('click', closePop);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closePop(); closeMenu(); } });
  $$('input[name="who"]', pop).forEach((r) => r.addEventListener('change', () => {
    const kid = r.value === 'kid' && r.checked;
    $('#f-kid').hidden = !kid; $('#f-adult').hidden = kid;
  }));
  $('#f-kid').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target, u = f.u.value.trim().toLowerCase();
    if (!F.usernameOk(u)) return say(f, 'Usernames are 3 to 20 letters or numbers.');
    say(f, 'Signing in…', true); $('button[type=submit]', f).disabled = true;
    try { await F.signInWithEmailAndPassword(F.auth, F.studentEmail(u), f.p.value); f.reset(); say(f, ''); closePop(); }
    catch (er) { say(f, nice(er)); }
    $('button[type=submit]', f).disabled = false;
  });
  $('#f-adult').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    say(f, 'Signing in…', true); $('button[type=submit]', f).disabled = true;
    try { await F.signInWithEmailAndPassword(F.auth, f.e.value.trim(), f.p.value); f.reset(); say(f, ''); closePop(); }
    catch (er) { say(f, nice(er)); }
    $('button[type=submit]', f).disabled = false;
  });
  $('#forgot').addEventListener('click', async () => {
    const f = $('#f-adult'), em = f.e.value.trim();
    if (!em) { say(f, 'Type your email above first.'); f.e.focus(); return; }
    try { await F.sendPasswordResetEmail(F.auth, em); say(f, 'If that email has an account, a reset link is on its way.', true); } catch (er) { say(f, nice(er)); }
  });
}

function closeMenu() {
  const m = $('#menu'), b = $('#who');
  if (m && !m.hidden) { m.hidden = true; b.setAttribute('aria-expanded', 'false'); }
}
function accountMenu(me) {
  const role = me.role === 'student' ? 'Student' : me.role === 'tutor' ? 'Tutor' : me.role === 'parent' ? 'Parent' : 'Account';
  let links = '';
  if (me.role === 'student') links = '<a href="plan/">My plan</a><a href="family.html">My notes and suggestions</a>';
  else if (me.role) links = '<a href="family.html">Students and progress</a><a href="family.html#add">Add a student</a><a href="plan/">Math Plan</a>';
  else links = '<a href="family.html">Finish setting up</a>';
  $('#acct').innerHTML = '<button type="button" class="who" id="who" aria-haspopup="true" aria-expanded="false" aria-controls="menu">' +
    '<span class="av" aria-hidden="true">' + initial(me.name || me.user.email) + '</span><span class="nm">' + esc(me.name || me.user.email) + '</span><span class="caret" aria-hidden="true"></span></button>' +
    '<div class="menu" id="menu" hidden><div class="mrole"><b>' + esc(me.name || me.user.email) + '</b>' + role + '</div>' + links +
    '<button type="button" id="out">Sign out</button></div>';
  const b = $('#who'), m = $('#menu');
  b.addEventListener('click', (e) => { e.stopPropagation(); m.hidden = !m.hidden; b.setAttribute('aria-expanded', String(!m.hidden)); if (!m.hidden) $('a,button', m).focus(); });
  document.addEventListener('click', (e) => { if (!m.contains(e.target)) closeMenu(); });
  $('#out').addEventListener('click', async () => { $('#out').disabled = true; await F.signOutAll(); location.reload(); });
}
/* ---------- start ---------- */
const localPlan = () => { try { return parse(localStorage.getItem('mathplan:state'), null); } catch (e) { return null; } };
const acct = $('#acct');
async function start() {
  try { F = await import('./fb.js'); } catch (e) { F = null; }
  if (!F || !F.configured) { F = null; wireSignin(); showPlan(localPlan(), null); showLanguage(localLangGrade()); return; }
  wireSignin();
  acct.classList.add('wait');
  const reveal = setTimeout(() => acct.classList.remove('wait'), 2500);
  let first = true;
  F.onAuthStateChanged(F.auth, async (user) => {
    let me = null;
    try { me = await F.whoAmI(user); } catch (e) { me = user ? { user, role: null } : null; }
    clearTimeout(reveal); acct.classList.remove('wait');
    if (!first && !me) { location.reload(); return; }
    first = false;
    if (!me) { showPlan(localPlan(), null); showLanguage(localLangGrade()); return; }
    if (me.role) try { localStorage.setItem('atlas:adult', me.role === 'student' ? '0' : '1'); } catch (e) { /* storage blocked */ }
    accountMenu(me);
    greet(me);
    if (me.role === 'student') {
      const [p, k] = await Promise.all([
        F.getDoc(F.doc(F.db, 'students', me.sid, 'progress', 'plan')).catch(() => null),
        F.getDoc(F.doc(F.db, 'students', me.sid)).catch(() => null)
      ]);
      const remote = p && p.exists() && p.data().data ? parse(p.data().data.state, null) : null;
      await showPlan(remote || localPlan(), me);
      const kid = k && k.exists() ? k.data() : null, sug = suggestions(kid);
      if (sug && body()) body().insertAdjacentHTML('beforeend', sug);
      const lang = await langProgress(F, me.sid);
      showLanguage(lang.length ? lang[0].g : localLangGrade());
    } else if (me.role) {
      $('#nav-plan').textContent = 'Plans';
      /* parents and tutors see only their children here; both subjects are in each child's card */
      if ($('#lang')) { $('#lang').hidden = true; $('.layout').classList.remove('two'); }
      if (body()) await showKids(F, me);
    } else if (body()) {
      body().insertAdjacentHTML('afterbegin', '<div class="msg"><b>One more step</b>Finish setting up your account on the <a href="family.html">family page</a>.</div>');
    }
  });
}
start();
