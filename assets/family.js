/* Math Atlas family page: sign in, the student home, and the parent and tutor views. */
import {
  configured, auth, db, onAuthStateChanged, whoAmI, signOutAll, makeStudentLogin, usernameOk, isStudentEmail,
  studentEmail, esc, today, SITES, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification,
  sendPasswordResetEmail, updateProfile, doc, collection, getDoc, getDocs, setDoc, updateDoc, addDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp
} from './fb.js';

const app = document.getElementById('app');
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const LV = ['', 'Getting started', 'Building', 'Stretch'];
const HOME = location.origin + location.pathname.replace(/family\.html$/, '');
let me = null, busy = false;

function safeNext() {
  const n = new URLSearchParams(location.search).get('next') || '';
  return /^\/(?!\/)/.test(n) ? n : '';
}
function nice(e) {
  const c = (e && e.code) || '';
  if (/invalid-credential|wrong-password|user-not-found|invalid-login/.test(c)) return 'That sign-in and password do not match. Check the spelling and try again.';
  if (/email-already-in-use/.test(c)) return 'That email or username is already taken.';
  if (/weak-password/.test(c)) return 'Use a password of at least 6 characters.';
  if (/invalid-email/.test(c)) return 'That email address does not look right.';
  if (/too-many-requests/.test(c)) return 'Too many tries. Wait a few minutes, then try again.';
  if (/network-request-failed|unavailable/.test(c)) return 'No internet connection. Check it and try again.';
  if (/permission-denied/.test(c)) return 'You do not have access to that.';
  return 'Something went wrong (' + esc(c || (e && e.message) || 'unknown') + ').';
}
function fail(el, e) { el.className = 'fb bad'; el.innerHTML = typeof e === 'string' ? e : nice(e); }
function okMsg(el, t) { el.className = 'fb ok'; el.innerHTML = t; }
const pct = (a, b) => (b ? Math.round((100 * a) / b) + '%' : '–');
const dayStr = (d) => d.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return today(d); }
function when(ts) {
  if (!ts || !ts.toDate) return 'never';
  const d = ts.toDate(), t = today(d);
  if (t === today()) return 'today';
  if (t === daysAgo(1)) return 'yesterday';
  return dayStr(d);
}

/* ---------- start ---------- */
if (!configured) {
  app.innerHTML = '<div class="wrap"><h1>Almost ready</h1><div class="note"><p>Family accounts are not switched on yet. ' +
    'Paste the Firebase settings into <code>assets/firebase-config.js</code> (see SETUP.md), then publish again.</p></div></div>';
} else {
  app.innerHTML = '<div class="wrap"><p class="t2">Loading…</p></div>';
  onAuthStateChanged(auth, async (user) => {
    if (busy) return;
    try { me = await whoAmI(user); } catch (e) { me = user ? { user, role: null } : null; }
    if (me && me.role === 'student' && safeNext()) { location.replace(safeNext()); return; }
    route();
  });
  window.addEventListener('hashchange', route);
}

function route() {
  topbar();
  if (!me) return signInView();
  if (me.role === 'student') return studentHome();
  if (!me.role) return finishSignup();
  const h = location.hash;
  if (h.indexOf('#s/') === 0) return studentDetail(decodeURIComponent(h.slice(3)));
  if (h === '#add') return addStudent();
  return adultHome();
}

function topbar() {
  const el = $('#acct');
  if (!el) return;
  el.innerHTML = me ? '<span class="who">' + esc(me.name || me.user.email) + '</span> <button type="button" id="acct-out">Sign out</button>' : '';
  const b = $('#acct-out');
  if (b) b.addEventListener('click', async () => { b.disabled = true; await signOutAll(); location.hash = ''; });
}

/* ---------- sign in and sign up ---------- */
function signInView() {
  app.innerHTML = '<div class="wrap"><header class="chead"><span class="num">Family accounts</span><h1>Sign in</h1>' +
    '<p class="lede">Students sign in to save their practice. Parents and tutors sign in to see how it is going.</p></header>' +
    '<div class="two">' +
    '<form class="sec panel" id="f-kid" data-strand="B"><h2>I am a student</h2>' +
    '<label>Username<input name="u" autocomplete="username" autocapitalize="none" spellcheck="false" required></label>' +
    '<label>Password<input name="p" type="password" autocomplete="current-password" required></label>' +
    '<p><button class="btn" type="submit">Sign in</button></p><p class="fb" aria-live="polite"></p>' +
    '<p class="t2 small">Forgot your password? Ask the parent who made your account.</p></form>' +
    '<form class="sec panel" id="f-adult" data-strand="D"><h2>I am a parent or tutor</h2>' +
    '<label>Email<input name="e" type="email" autocomplete="email" required></label>' +
    '<label>Password<input name="p" type="password" autocomplete="current-password" required></label>' +
    '<p><button class="btn" type="submit">Sign in</button> <button class="btn alt" type="button" id="forgot">Forgot password</button></p>' +
    '<p class="fb" aria-live="polite"></p>' +
    '<p>New here? <a href="#" id="to-new">Create a parent or tutor account</a>.</p></form>' +
    '</div>' +
    '<form class="sec panel" id="f-new" data-strand="C" hidden><h2>Create a parent or tutor account</h2>' +
    '<fieldset><legend>I am a</legend><label class="inl"><input type="radio" name="r" value="parent" checked> Parent or guardian</label>' +
    '<label class="inl"><input type="radio" name="r" value="tutor"> Tutor or teacher</label></fieldset>' +
    '<label>Your name<input name="n" autocomplete="name" maxlength="60" required></label>' +
    '<label>Email<input name="e" type="email" autocomplete="email" required></label>' +
    '<label>Password (at least 6 characters)<input name="p" type="password" autocomplete="new-password" minlength="6" required></label>' +
    '<p><button class="btn" type="submit">Create account</button></p><p class="fb" aria-live="polite"></p>' +
    '<p class="t2 small">Children do not need an email. After you sign up, you make their username and password.</p></form>' +
    '<div class="note"><p><b>Privacy.</b> We save the student\'s first name, username, and practice results. Only the student and the adults linked to their account can see them.</p></div></div>';

  $('#f-kid').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target, fb = $('.fb', f), u = f.u.value.trim().toLowerCase();
    if (!usernameOk(u)) return fail(fb, 'Usernames are 3 to 20 letters or numbers.');
    fb.className = 'fb'; fb.textContent = 'Signing in…';
    try { await signInWithEmailAndPassword(auth, studentEmail(u), f.p.value); } catch (er) { fail(fb, er); }
  });
  $('#f-adult').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target, fb = $('.fb', f);
    fb.className = 'fb'; fb.textContent = 'Signing in…';
    try { await signInWithEmailAndPassword(auth, f.e.value.trim(), f.p.value); } catch (er) { fail(fb, er); }
  });
  $('#forgot').addEventListener('click', async () => {
    const f = $('#f-adult'), fb = $('.fb', f), em = f.e.value.trim();
    if (!em) return fail(fb, 'Type your email above first.');
    try { await sendPasswordResetEmail(auth, em); okMsg(fb, 'If that email has an account, a reset link is on its way.'); } catch (er) { fail(fb, er); }
  });
  $('#to-new').addEventListener('click', (e) => {
    e.preventDefault();
    const n = $('#f-new'); n.hidden = false; n.n.focus(); n.scrollIntoView();
  });
  $('#f-new').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target, fb = $('.fb', f), em = f.e.value.trim(), name = f.n.value.trim(), role = f.r.value;
    if (isStudentEmail(em)) return fail(fb, 'Use a real email address.');
    fb.className = 'fb'; fb.textContent = 'Creating your account…';
    busy = true;
    try {
      const cred = await createUserWithEmailAndPassword(auth, em, f.p.value);
      await setDoc(doc(db, 'users', cred.user.uid), { role, name, email: em.toLowerCase(), created: serverTimestamp() });
      await updateProfile(cred.user, { displayName: name }).catch(() => {});
      await sendEmailVerification(cred.user).catch(() => {});
      me = await whoAmI(cred.user);
      busy = false;
      location.hash = '';
      route();
    } catch (er) { busy = false; fail(fb, er); }
  });
}

/* signed in but the sign-up was cut off before the role was saved */
function finishSignup() {
  app.innerHTML = '<div class="wrap"><h1>One more step</h1><form class="sec panel" id="f-fin" data-strand="C">' +
    '<fieldset><legend>I am a</legend><label class="inl"><input type="radio" name="r" value="parent" checked> Parent or guardian</label>' +
    '<label class="inl"><input type="radio" name="r" value="tutor"> Tutor or teacher</label></fieldset>' +
    '<label>Your name<input name="n" maxlength="60" required value="' + esc(me.user.displayName || '') + '"></label>' +
    '<p><button class="btn" type="submit">Continue</button></p><p class="fb"></p></form></div>';
  $('#f-fin').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    try {
      await setDoc(doc(db, 'users', me.user.uid), { role: f.r.value, name: f.n.value.trim(), email: (me.user.email || '').toLowerCase(), created: serverTimestamp() });
      me = await whoAmI(me.user); route();
    } catch (er) { fail($('.fb', f), er); }
  });
}

/* ---------- student home ---------- */
let hosting = null;
async function studentHome() {
  const snap = await getDoc(doc(db, 'students', me.sid)).catch(() => null);
  if (!snap || !snap.exists() || snap.data().uid !== me.user.uid) {
    app.innerHTML = '<div class="wrap"><h1>This login is no longer used</h1><p>Ask the parent who made your account for your new username and password.</p></div>';
    return;
  }
  const kid = snap.data();
  if (!hosting) hosting = import('./live.js').then((L) => L.startHost(me.sid, kid.name)).catch(() => null);
  const notes = await getDocs(query(collection(db, 'students', me.sid, 'notes'), orderBy('at', 'desc'), limit(3))).catch(() => ({ docs: [] }));
  let h = '<div class="wrap"><header class="chead"><span class="num">Student</span><h1>Hi, ' + esc(kid.name) + '</h1>' +
    '<p class="lede">Your practice saves to your account, so you can use any device.</p></header><div class="cards">';
  Object.keys(SITES).filter((k) => SITES[k].on).forEach((k) => {
    h += '<a class="card" data-strand="B" href="' + SITES[k].path + '" data-site="' + k + '"><h2>' + SITES[k].name + ' Math Atlas</h2><p class="desc">Lessons, practice and check-ups.</p></a>';
  });
  h += '</div>';
  const mine = kid.assigned || [];
  if (mine.length) {
    h += '<section class="sec" data-strand="D"><h2>Suggested practice</h2><ul>' + mine.map((a) =>
      '<li><a href="' + (SITES[a.site] ? SITES[a.site].path : '') + '#' + esc(a.ch) + '/practice/' + esc(a.sk) + '">' + esc(a.name) + '</a> <span class="t2">(' + esc(SITES[a.site] ? SITES[a.site].name : '') + ', ' + esc(a.t) + ')</span></li>').join('') + '</ul></section>';
  }
  if (notes.docs.length) {
    h += '<section class="sec" data-strand="C"><h2>Notes for you</h2>' + notes.docs.map((d) => {
      const n = d.data();
      return '<p class="anote"><b>' + esc(n.byName) + '</b> <span class="t2">(' + esc(n.byRole) + ', ' + when(n.at) + ')</span>: ' + esc(n.text) + '</p>';
    }).join('') + '</section>';
  }
  app.innerHTML = h + '</div>';
}

/* ---------- parent and tutor views ---------- */
async function myStudents() {
  const uid = me.user.uid, em = me.user.emailVerified ? (me.user.email || '').toLowerCase() : '';
  const qs = [query(collection(db, 'students'), where('ownerUid', '==', uid))];
  if (em) {
    qs.push(query(collection(db, 'students'), where('parentEmails', 'array-contains', em)));
    qs.push(query(collection(db, 'students'), where('tutorEmails', 'array-contains', em)));
  }
  const out = {};
  for (const q of qs) {
    const r = await getDocs(q).catch((e) => { console.warn(e); return { docs: [] }; });
    r.docs.forEach((d) => { out[d.id] = Object.assign({ id: d.id }, d.data()); });
  }
  return Object.values(out).sort((a, b) => a.name.localeCompare(b.name));
}

async function loadKid(sid) {
  const prog = {}, from = daysAgo(27);
  for (const k of Object.keys(SITES)) {
    const p = await getDoc(doc(db, 'students', sid, 'progress', k)).catch(() => null);
    if (p && p.exists()) prog[k] = p.data();
  }
  const days = await getDocs(query(collection(db, 'students', sid, 'days'), where('date', '>=', from))).catch(() => ({ docs: [] }));
  return { prog, days: days.docs.map((d) => d.data()) };
}
/* questions answered in practice, quizzes and check-ups, plus quizzes and lessons, over the last 7 days */
function weekTotals(days, site) {
  const from = daysAgo(6), w = { n: 0, ok: 0, quizzes: 0, checkups: 0, lessons: 0 };
  days.forEach((d) => {
    if (d.date < from || (site && d.site !== site)) return;
    w.n += (d.n || 0) + (d.qn || 0) + (d.cn || 0);
    w.ok += (d.ok || 0) + (d.qok || 0) + (d.cok || 0);
    (d.events || []).forEach((e) => { if (e.kind === 'quiz') w.quizzes++; else if (e.kind === 'checkup') w.checkups++; else if (e.kind === 'lesson') w.lessons++; });
  });
  return w;
}
const plural = (n, a) => n + ' ' + a + (n === 1 ? '' : 's');
function weekLine(w) {
  const bits = [plural(w.n, 'question')];
  if (w.lessons) bits.push(plural(w.lessons, 'lesson'));
  if (w.quizzes) bits.push(plural(w.quizzes, 'quiz').replace('quizs', 'quizzes'));
  if (w.checkups) bits.push(plural(w.checkups, 'check-up'));
  return bits.join(', ');
}
/* the newest things a student did, across grades */
function activityList(days, max) {
  const out = [];
  days.forEach((d) => {
    const g = SITES[d.site] ? SITES[d.site].name : d.site;
    (d.events || []).forEach((e) => out.push(Object.assign({ g }, e)));
    if (d.n) out.push({ g, kind: 'practice', at: d.updated && d.updated.toMillis ? d.updated.toMillis() : Date.parse(d.date + 'T12:00:00'), n: d.n, ok: d.ok || 0, date: d.date });
  });
  out.sort((a, b) => b.at - a.at);
  if (!out.length) return '<p class="t2">Nothing yet. Lessons opened, practice, quizzes and check-ups show here.</p>';
  return '<ul class="activity">' + out.slice(0, max).map((e) => {
    const t = new Date(e.at), at = (today(t) === today() ? 'Today' : today(t) === daysAgo(1) ? 'Yesterday' : dayStr(t)) +
      (e.kind === 'practice' ? '' : ', ' + t.toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' }));
    let what = '';
    if (e.kind === 'lesson') what = 'Opened the lesson <b>' + esc(e.t) + '</b>';
    else if (e.kind === 'quiz') what = 'Finished the <b>' + esc(e.t) + '</b> quiz: ' + (+e.s) + ' of ' + (+e.n) + ' right on the first try';
    else if (e.kind === 'checkup') what = 'Took a check-up (' + esc(e.w) + '): ' + (+e.s) + ' of ' + (+e.n);
    else what = 'Practised ' + plural(e.n, 'question') + ', ' + e.ok + ' right on the first try';
    return '<li><span class="when">' + at + ' &middot; ' + esc(e.g) + '</span> ' + what + '</li>';
  }).join('') + '</ul>';
}
function lastActive(prog) {
  let best = null;
  Object.values(prog).forEach((p) => { if (p.updated && (!best || p.updated.toMillis() > best.toMillis())) best = p.updated; });
  return best;
}

async function adultHome() {
  const verified = me.user.emailVerified;
  let h = '<div class="wrap"><header class="chead"><span class="num">' + (me.role === 'tutor' ? 'Tutor' : 'Parent') + ' page</span>' +
    '<h1>Hi, ' + esc(me.name) + '</h1><p class="lede">' + (me.role === 'tutor' ? 'Your students, and how their practice is going.' : 'Your children, and how their practice is going.') + '</p></header>';
  if (!verified) {
    h += '<div class="note" id="verify"><p><b>Please confirm your email.</b> We sent a link to ' + esc(me.user.email) + '. ' +
      'Until you click it, you cannot see students that other people share with you.</p>' +
      '<p><button class="btn" type="button" id="v-done">I clicked the link</button> <button class="btn alt" type="button" id="v-again">Send it again</button></p><p class="fb" aria-live="polite"></p></div>';
  }
  h += '<div id="kids"><p class="t2">Loading students…</p></div>' +
    '<p><a class="btn" href="#add">Add a student</a></p>' +
    '<div class="note"><p><b>How sharing works.</b> The adult who adds a student can share them with another parent or a tutor by email. ' +
    'People you share with see the student here after they create an account with that email.</p>' +
    (me.role === 'tutor' ? '<p>To get a family\'s student on this page, give the parent this email: <b>' + esc(me.user.email) + '</b>.</p>' : '') + '</div></div>';
  app.innerHTML = h;
  if (!verified) {
    $('#v-done').addEventListener('click', async () => {
      await me.user.reload(); await me.user.getIdToken(true);
      if (auth.currentUser.emailVerified) { me.user = auth.currentUser; route(); } else fail($('#verify .fb'), 'Not confirmed yet. Check your inbox and spam folder.');
    });
    $('#v-again').addEventListener('click', async () => {
      try { await sendEmailVerification(me.user); okMsg($('#verify .fb'), 'Sent. Check your inbox.'); } catch (e) { fail($('#verify .fb'), e); }
    });
  }
  const kids = await myStudents(), box = $('#kids');
  if (!box) return;
  if (!kids.length) {
    box.innerHTML = '<div class="start"><p>No students yet. ' + (me.role === 'tutor' ? 'Add one yourself, or ask a parent to share their child with your email.' : 'Add your child to make their sign-in.') + '</p></div>';
    return;
  }
  box.innerHTML = '<div class="cards kids">' + kids.map((k) =>
    '<a class="card" data-strand="D" href="#s/' + encodeURIComponent(k.id) + '" id="k-' + esc(k.id) + '"><h2>' + esc(k.name) + '</h2>' +
    '<p class="sub">' + (k.ownerUid === me.user.uid ? 'Added by you' : 'Shared with you by ' + esc(k.ownerName || 'a parent')) + '</p>' +
    '<p class="desc kstat">Loading…</p></a>').join('') + '</div>';
  for (const k of kids) {
    const d = await loadKid(k.id), w = weekTotals(d.days), la = lastActive(d.prog), el = $('#k-' + CSS.escape(k.id) + ' .kstat');
    if (el) el.innerHTML = 'Last active: <b>' + when(la) + '</b><br>This week: <b>' + weekLine(w) + '</b>' + (w.n ? ', ' + pct(w.ok, w.n) + ' right on the first try' : '');
  }
}

async function addStudent() {
  app.innerHTML = '<div class="wrap"><p class="crumb"><a href="#">Back</a></p><header class="chead"><h1>Add a student</h1>' +
    '<p class="lede">Make a username and password for your child. They do not need an email.</p></header>' +
    '<form class="sec panel" id="f-add" data-strand="B">' +
    '<label>Student\'s first name<input name="n" maxlength="60" required autocomplete="off"></label>' +
    '<label>Username (3 to 20 letters or numbers, no spaces)<input name="u" required autocapitalize="none" spellcheck="false" autocomplete="off"></label>' +
    '<label>Password (at least 6 characters)<input name="p" type="text" minlength="6" required autocomplete="off"></label>' +
    '<p class="t2 small">The password shows as you type, so you can write it down.</p>' +
    '<p><button class="btn" type="submit">Add student</button></p><p class="fb" aria-live="polite"></p></form></div>';
  const f = $('#f-add');
  f.n.addEventListener('input', () => { if (!f.u.dataset.touched) f.u.value = f.n.value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 14); });
  f.u.addEventListener('input', () => { f.u.dataset.touched = '1'; });
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fb = $('.fb', f), name = f.n.value.trim(), u = f.u.value.trim().toLowerCase(), p = f.p.value;
    if (!usernameOk(u)) return fail(fb, 'Usernames are 3 to 20 letters or numbers, starting with a letter or number.');
    if (p.length < 6) return fail(fb, 'Use a password of at least 6 characters.');
    $('button', f).disabled = true; fb.className = 'fb'; fb.textContent = 'Making the account…';
    try {
      const sid = doc(collection(db, 'students')).id;
      const uid = await makeStudentLogin(u, p, name, sid);
      await setDoc(doc(db, 'students', sid), {
        name, username: u, uid, ownerUid: me.user.uid, ownerName: me.name, parentEmails: [], tutorEmails: [], assigned: [],
        created: serverTimestamp(), updated: serverTimestamp()
      });
      app.innerHTML = '<div class="wrap"><header class="chead"><h1>' + esc(name) + ' is ready</h1></header>' +
        '<section class="sec" data-strand="D"><h2>Write this down</h2><div class="tbl"><table><tbody>' +
        '<tr><td class="l">Website</td><td class="l"><b>' + esc(HOME) + '</b></td></tr>' +
        '<tr><td class="l">Username</td><td class="l"><b>' + esc(u) + '</b></td></tr>' +
        '<tr><td class="l">Password</td><td class="l"><b>' + esc(p) + '</b></td></tr></tbody></table></div>' +
        '<p>' + esc(name) + ' chooses <b>I am a student</b> on the sign-in page.</p>' +
        '<p><a class="btn" href="#s/' + encodeURIComponent(sid) + '">See ' + esc(name) + '\'s page</a> <a class="btn alt" href="#">Back</a></p></section></div>';
    } catch (er) { $('button', f).disabled = false; fail(fb, er); }
  });
}

/* ---------- concepts (grades with the lesson engine) ---------- */
const CST = ['Not started', 'Seen', 'Got it', 'Mastered'];
function conceptStatus(c, data) {
  const sk = c.sk ? parse(data['sk:' + c.sk], null) : null, s = parse(data['cn:' + c.id], null) || {};
  if (sk && sk.secure) return 3;
  if (s.got) return 2;
  if (s.seen) return 1;
  return 0;
}
const cdot = (k) => '<span class="cdot s' + k + '" aria-hidden="true"></span>';
function conceptSummary(cat, data) {
  const all = [];
  cat.forEach((ch) => (ch.concepts || []).forEach((c) => all.push(conceptStatus(c, data))));
  const cov = parse(data.cov, null);
  if (!all.length && !cov) return '';
  let h = '';
  if (all.length) {
    const n = [0, 0, 0, 0];
    all.forEach((k) => n[k]++);
    h += '<h3>Concepts</h3><p class="clegend">' + [3, 2, 1, 0].map((k) => '<span>' + cdot(k) + '<b>' + n[k] + '</b> ' + CST[k].toLowerCase() + '</span>').join('') + '</p>' +
      '<div class="cbar" role="img" aria-label="' + n[3] + ' mastered, ' + n[2] + ' got it, ' + n[1] + ' seen, ' + n[0] + ' not started, of ' + all.length + ' concepts">' +
      [3, 2, 1].map((k) => n[k] ? '<i class="s' + k + '" style="width:' + (100 * n[k] / all.length).toFixed(2) + '%"></i>' : '').join('') + '</div>' +
      '<p class="t2 small">Seen: opened the concept. Got it: right on the first try in its quick checks. Mastered: its practice skill is secure.</p>';
  }
  if (cov) {
    const codes = [];
    cat.forEach((ch) => ch.skills.forEach((sk) => String(sk.code || '').split(/,\s*/).forEach((c) => { if (c && codes.indexOf(c) < 0) codes.push(c); })));
    codes.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    h += '<h3>Ontario expectations checked: ' + codes.filter((c) => cov[c]).length + ' of ' + codes.length + '</h3><p class="covchips">' + codes.map((c) => {
      const v = cov[c];
      return '<span class="' + (v ? (v.ok ? 'ok' : 'part') : '') + '" title="' + (v ? 'Checked ' + esc(v.d) + (v.ok ? ', all right' : ', some to practise') : 'Not checked yet') + '">' + esc(c) + '</span>';
    }).join('') + '</p><p class="t2 small">Green: checked in a check-up and right. Yellow: some to practise. White: not checked yet.</p>';
  }
  return h;
}
function conceptList(ch, data) {
  if (!ch.concepts || !ch.concepts.length) return '';
  let h = '<ul class="clist">', lesson = null;
  ch.concepts.forEach((c) => {
    if (c.l !== lesson) { lesson = c.l; h += '<li class="lh">' + esc(lesson) + '</li>'; }
    const k = conceptStatus(c, data);
    h += '<li>' + cdot(k) + esc(c.t) + ' <span class="t2">' + CST[k] + (c.exp && c.exp.length ? ' &middot; ' + esc(c.exp.join(', ')) : '') + '</span></li>';
  });
  return h + '</ul>';
}

/* ---------- keep the parent and tutor pages up to date ---------- */
let quiet = false;
async function refreshQuietly(force) {
  const h = location.hash;
  if (!me || (me.role !== 'parent' && me.role !== 'tutor') || document.visibilityState !== 'visible') return;
  if (!(h === '' || h === '#' || h.indexOf('#s/') === 0)) return;
  if (!force) {
    const a = document.activeElement;
    if (a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
    if ($$('#app input, #app textarea').some((x) => x.value && x.type !== 'radio' && x.type !== 'checkbox')) return;
  }
  const open = $$('#app details[open]').map((d) => d.dataset.id || $('summary', d).textContent), y = window.scrollY;
  quiet = true;
  try { await route(); } finally { quiet = false; }
  $$('#app details').forEach((d) => { if (open.indexOf(d.dataset.id || $('summary', d).textContent) >= 0) d.open = true; });
  window.scrollTo(0, y);
}
setInterval(refreshQuietly, 60000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') refreshQuietly(); });

/* ---------- one student, in detail ---------- */
function skillStatus(s) {
  if (!s) return { k: 0, t: 'Not started' };
  if (s.secure) return { k: 4, t: 'Secure' };
  if (!s.n) return s.lv > 1 ? { k: s.lv, t: 'Level ' + s.lv + ' (from check-up)' } : { k: 0, t: 'Not started' };
  return { k: s.lv, t: 'Level ' + s.lv + ': ' + LV[s.lv] };
}
function meter(k) {
  let h = '<span class="meter" aria-hidden="true">';
  for (let i = 1; i <= 4; i++) h += '<i class="' + (i <= k ? 'on' : '') + '"></i>';
  return h + '</span>';
}
function parse(v, d) { try { return v == null ? d : JSON.parse(v); } catch (e) { return d; } }

/* questions per day, last 14 days: one series, bars, hover for the numbers, with a table version */
function activityChart(days, site) {
  const rows = [];
  for (let i = 13; i >= 0; i--) {
    const t = daysAgo(i), d = days.filter((x) => x.date === t && x.site === site)[0] || {};
    rows.push({ t, n: (d.n || 0) + (d.qn || 0) + (d.cn || 0), ok: (d.ok || 0) + (d.qok || 0) + (d.cok || 0) });
  }
  const max = Math.max(10, ...rows.map((r) => r.n)), W = 560, H = 160, padL = 30, padB = 22, bw = (W - padL) / 14;
  const step = max <= 20 ? 5 : max <= 50 ? 10 : max <= 100 ? 25 : 50, top = Math.ceil(max / step) * step;
  const y = (v) => H - padB - (v / top) * (H - padB - 8);
  let g = '';
  for (let v = 0; v <= top; v += step) g += '<line x1="' + padL + '" x2="' + W + '" y1="' + y(v) + '" y2="' + y(v) + '" class="gl"/><text x="' + (padL - 6) + '" y="' + (y(v) + 4) + '" class="ax" text-anchor="end">' + v + '</text>';
  rows.forEach((r, i) => {
    const x = padL + i * bw + 3, w = bw - 6, d = new Date(r.t + 'T12:00:00');
    if (r.n) {
      const hgt = H - padB - y(r.n), rr = Math.min(4, w / 2, hgt);
      g += '<path class="bar" d="M' + x + ' ' + (H - padB) + 'V' + (y(r.n) + rr) + 'q0 -' + rr + ' ' + rr + ' -' + rr + 'H' + (x + w - rr) + 'q' + rr + ' 0 ' + rr + ' ' + rr + 'V' + (H - padB) + 'Z"/>';
    }
    g += '<rect class="hit" x="' + (x - 3) + '" y="0" width="' + bw + '" height="' + (H - padB) + '"><title>' + dayStr(d) + ': ' + r.n + ' questions, ' + r.ok + ' right on the first try</title></rect>';
    if (i % 2 === 1 || i === 13) g += '<text x="' + (x + w / 2) + '" y="' + (H - 6) + '" class="ax" text-anchor="middle">' + (i === 13 ? 'Today' : d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })) + '</text>';
  });
  const table = '<details><summary>Show as a table</summary><div class="tbl"><table><thead><tr><th class="l">Day</th><th>Questions</th><th>Right first try</th></tr></thead><tbody>' +
    rows.slice().reverse().map((r) => '<tr><td class="l">' + dayStr(new Date(r.t + 'T12:00:00')) + '</td><td>' + r.n + '</td><td>' + r.ok + '</td></tr>').join('') + '</tbody></table></div></details>';
  return '<h3>Questions answered per day, last 2 weeks</h3><div class="chart"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Questions answered per day for the last 14 days, in practice, quizzes and check-ups">' + g + '</svg></div>' + table;
}

async function studentDetail(sid) {
  if (!quiet) app.innerHTML = '<div class="wrap"><p class="t2">Loading…</p></div>';
  const snap = await getDoc(doc(db, 'students', sid)).catch(() => null);
  if (!snap || !snap.exists()) {
    app.innerHTML = '<div class="wrap"><p class="crumb"><a href="#">Back</a></p><h1>Not found</h1><p>This student is not shared with you.</p></div>';
    return;
  }
  const kid = Object.assign({ id: sid }, snap.data()), owner = kid.ownerUid === me.user.uid;
  const { prog, days } = await loadKid(sid);
  const notes = await getDocs(query(collection(db, 'students', sid, 'notes'), orderBy('at', 'desc'), limit(20))).catch(() => ({ docs: [] }));
  const assigned = kid.assigned || [];
  const isAssigned = (site, id) => assigned.some((a) => a.site === site && a.sk === id);

  let h = '<div class="wrap"><p class="crumb"><a href="#">All students</a></p><header class="chead"><span class="num">' +
    (me.role === 'tutor' ? 'Tutor view' : 'Parent view') + '</span><h1>' + esc(kid.name) + '</h1>' +
    '<p class="lede">Username <b>' + esc(kid.username) + '</b> &middot; last active ' + when(lastActive(prog)) + '</p>' +
    '<p><a class="btn" href="live.html?sid=' + encodeURIComponent(sid) + '">Work together</a> <span class="t2 small">See ' + esc(kid.name) + '\'s screen and click on it, after they tap Allow.</span></p>' +
    '<p class="t2 small">Updates by itself every minute. Last updated ' + new Date().toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' }) +
    '. <button type="button" class="btn alt sm" id="refresh">Refresh now</button></p></header>';

  /* only grades the student has actually used */
  const sites = Object.keys(prog).filter((k) => Object.keys(prog[k].data || {}).length || days.some((d) => d.site === k));
  h += '<section class="sec" data-strand="C"><h2>Recent activity</h2>' + activityList(days, 12) + '</section>';
  if (!sites.length) {
    h += '<div class="start"><p>No practice saved yet. ' + esc(kid.name) + ' signs in at <b>' + esc(HOME) + '</b> with the username <b>' + esc(kid.username) + '</b>, then opens a grade and starts practising.</p></div>';
  }
  sites.forEach((site) => {
    const p = prog[site], data = p.data || {}, cat = p.catalog || [], w = weekTotals(days, site);
    const checks = parse(data.checkups, []) || [], plan = parse(data.plan, []) || [];
    let total = 0, secure = 0, started = 0;
    const stuck = [];
    cat.forEach((ch) => ch.skills.forEach((sk) => {
      const s = parse(data['sk:' + sk.id], null);
      total++;
      if (s && s.secure) secure++;
      if (s && s.n) started++;
      if (s && s.n >= 5 && !s.secure && s.lv === 1 && s.ok / s.n < 0.6) stuck.push({ ch, sk, s });
    }));
    const last = checks[checks.length - 1];
    h += '<section class="sec" data-strand="D"><h2>' + esc(SITES[site] ? SITES[site].name : site) + ' Math Atlas</h2>' +
      '<div class="tiles">' +
      '<div class="tile"><b>' + w.n + '</b><span>questions this week (practice, quizzes, check-ups)</span></div>' +
      '<div class="tile"><b>' + pct(w.ok, w.n) + '</b><span>right on the first try this week</span></div>' +
      '<div class="tile"><b>' + secure + ' of ' + total + '</b><span>skills secure (' + started + ' started)</span></div>' +
      '<div class="tile"><b>' + (last ? last.s + ' of ' + last.n : '–') + '</b><span>' + (last ? 'last check-up, ' + esc(last.d) : 'no check-up yet') + '</span></div>' +
      '</div>' + conceptSummary(cat, data) + activityChart(days, site);

    if (stuck.length || plan.length) {
      h += '<h3>Worth a look</h3><ul>';
      stuck.forEach((x) => { h += '<li><b>' + esc(x.sk.name) + '</b> <span class="t2">(' + esc(x.ch.title) + ')</span>: ' + x.s.ok + ' of ' + x.s.n + ' right on the first try, still at level 1. Try doing a few together.</li>'; });
      plan.forEach((x) => { if (!stuck.some((s) => s.sk.id === x.sk)) h += '<li><b>' + esc(x.name) + '</b> <span class="t2">(' + esc(x.t) + ')</span>: on the plan from the last check-up.</li>'; });
      h += '</ul>';
    }
    if (checks.length) {
      h += '<h3>Check-ups</h3><div class="tbl"><table><thead><tr><th class="l">Date</th><th class="l">What</th><th>Result</th></tr></thead><tbody>' +
        checks.slice(-10).reverse().map((r) => '<tr><td class="l">' + esc(r.d) + '</td><td class="l">' + esc(r.w) + '</td><td>' + (+r.s) + ' of ' + (+r.n) + '</td></tr>').join('') + '</tbody></table></div>';
    }
    h += '<h3>Skills by chapter</h3><p class="t2 small">Choose <b>Suggest</b> to put a skill on ' + esc(kid.name) + '\'s home page. Levels go from 1 (getting started) to secure.</p>';
    const opened = {};
    days.forEach((d) => { if (d.site === site) (d.events || []).forEach((e) => { if (e.kind === 'lesson') opened[e.ch] = 1; }); });
    cat.forEach((ch) => {
      const best = data['best:' + ch.id];
      h += '<details class="chap" data-strand="' + esc(ch.strand) + '" data-id="' + esc(site + '/' + ch.id) + '"><summary><span class="ct">' + esc(ch.title) + '</span> <span class="t2">' +
        (opened[ch.id] ? 'lesson opened &middot; ' : '') +
        (ch.concepts && ch.concepts.length ? ch.concepts.filter((c) => conceptStatus(c, data) === 3).length + ' of ' + ch.concepts.length + ' concepts mastered &middot; ' : '') +
        (best != null ? 'quiz best ' + (+best) + ' of ' + ch.quiz + ' &middot; ' : '') +
        ch.skills.filter((sk) => (parse(data['sk:' + sk.id], {}) || {}).secure).length + ' of ' + ch.skills.length + ' secure</span></summary>' +
        conceptList(ch, data) +
        '<div class="tbl"><table><thead><tr><th class="l">Skill</th><th class="l">Level</th><th>Answered</th><th>First try</th><th></th></tr></thead><tbody>' +
        ch.skills.map((sk) => {
          const s = parse(data['sk:' + sk.id], null), st = skillStatus(s), on = isAssigned(site, sk.id);
          return '<tr><td class="l">' + esc(sk.name) + ' <span class="codes">' + esc(sk.code) + '</span></td><td class="l">' + meter(st.k) + ' ' + st.t + '</td>' +
            '<td>' + (s ? s.n || 0 : 0) + '</td><td>' + (s && s.n ? pct(s.ok, s.n) : '–') + '</td>' +
            '<td><button type="button" class="btn alt sm sug" aria-pressed="' + on + '" data-site="' + site + '" data-ch="' + esc(ch.id) + '" data-t="' + esc(ch.title) + '" data-sk="' + esc(sk.id) + '" data-n="' + esc(sk.name) + '">' + (on ? 'Suggested' : 'Suggest') + '</button></td></tr>';
        }).join('') + '</tbody></table></div></details>';
    });
    h += '</section>';
  });

  h += '<section class="sec" data-strand="C"><h2>Suggested practice</h2><div id="assigned"></div></section>';
  h += '<section class="sec" data-strand="C"><h2>Notes</h2><p class="t2 small">Notes show on ' + esc(kid.name) + '\'s home page and to the other adults on this account.</p>' +
    '<form id="f-note"><label class="sr" for="note-t">New note</label><textarea id="note-t" name="t" maxlength="1000" rows="3" required placeholder="For example: Great work on fractions this week. Next, try the check-up."></textarea>' +
    '<p><button class="btn" type="submit">Add note</button></p><p class="fb" aria-live="polite"></p></form><div id="notes">' +
    notes.docs.map((d) => {
      const n = d.data();
      return '<div class="anote" data-id="' + d.id + '"><p><b>' + esc(n.byName) + '</b> <span class="t2">(' + esc(n.byRole) + ', ' + when(n.at) + ')</span></p><p>' + esc(n.text) + '</p>' +
        (n.byUid === me.user.uid ? '<button type="button" class="btn alt sm del-note">Delete</button>' : '') + '</div>';
    }).join('') + '</div></section>';

  if (owner) {
    h += '<section class="sec" data-strand="E"><h2>Who can see ' + esc(kid.name) + '</h2>' +
      '<p>You added ' + esc(kid.name) + ', so only you can change this.</p><ul id="links"></ul>' +
      '<form id="f-share" class="row2"><label>Email<input name="e" type="email" required></label>' +
      '<label>They are a<select name="r"><option value="parent">Parent or guardian</option><option value="tutor">Tutor or teacher</option></select></label>' +
      '<p><button class="btn" type="submit">Share</button></p></form><p class="fb" id="share-fb" aria-live="polite"></p>' +
      '<h3>New username or password</h3><p>If ' + esc(kid.name) + ' forgets the password, make a new sign-in. Their saved progress stays.</p>' +
      '<form id="f-reset" class="row2"><label>New username<input name="u" required autocapitalize="none" spellcheck="false" autocomplete="off"></label>' +
      '<label>New password<input name="p" type="text" minlength="6" required autocomplete="off"></label>' +
      '<p><button class="btn" type="submit">Make new sign-in</button></p></form><p class="fb" id="reset-fb" aria-live="polite"></p>' +
      '<h3>Remove student</h3><p><button type="button" class="btn alt" id="del-kid">Remove ' + esc(kid.name) + ' from this list</button></p><p class="fb" id="del-fb"></p></section>';
  }
  app.innerHTML = h + '</div>';

  $('#refresh').addEventListener('click', () => refreshQuietly(true));
  const ref = doc(db, 'students', sid);
  function drawAssigned() {
    $('#assigned').innerHTML = assigned.length ? '<ul>' + assigned.map((a, i) =>
      '<li>' + esc(a.name) + ' <span class="t2">(' + esc(SITES[a.site] ? SITES[a.site].name : '') + ', ' + esc(a.t) + ')</span> <button type="button" class="btn alt sm unsug" data-i="' + i + '">Remove</button></li>').join('') + '</ul>'
      : '<p class="t2">None yet. Use the Suggest buttons above.</p>';
    $$('.unsug').forEach((b) => b.addEventListener('click', () => { const a = assigned[+b.dataset.i]; setAssigned(assigned.filter((x) => x !== a)); }));
    $$('.sug').forEach((b) => {
      const on = isAssigned(b.dataset.site, b.dataset.sk);
      b.setAttribute('aria-pressed', on); b.textContent = on ? 'Suggested' : 'Suggest';
    });
  }
  async function setAssigned(list) {
    try {
      await updateDoc(ref, { assigned: list, updated: serverTimestamp() });
      assigned.length = 0; list.forEach((x) => assigned.push(x));
    } catch (e) { alert(nice(e).replace(/<[^>]+>/g, '')); }
    drawAssigned();
  }
  $$('.sug').forEach((b) => b.addEventListener('click', () => {
    const d = b.dataset;
    if (isAssigned(d.site, d.sk)) setAssigned(assigned.filter((a) => !(a.site === d.site && a.sk === d.sk)));
    else if (assigned.length >= 8) alert('Up to 8 suggestions at a time. Remove one first.');
    else setAssigned(assigned.concat([{ site: d.site, ch: d.ch, t: d.t, sk: d.sk, name: d.n }]));
  }));
  drawAssigned();

  $('#f-note').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target, t = f.t.value.trim();
    if (!t) return;
    try {
      await addDoc(collection(db, 'students', sid, 'notes'), { text: t, byUid: me.user.uid, byName: me.name, byRole: me.role, at: serverTimestamp() });
      studentDetail(sid);
    } catch (er) { fail($('.fb', f), er); }
  });
  $$('.del-note').forEach((b) => b.addEventListener('click', async () => {
    const id = b.parentNode.dataset.id;
    try { await deleteDoc(doc(db, 'students', sid, 'notes', id)); b.parentNode.remove(); } catch (er) { alert(nice(er)); }
  }));

  if (!owner) return;
  const lists = { parent: (kid.parentEmails || []).slice(), tutor: (kid.tutorEmails || []).slice() };
  function drawLinks() {
    const all = lists.parent.map((e) => ['parent', e]).concat(lists.tutor.map((e) => ['tutor', e]));
    $('#links').innerHTML = all.length ? all.map(([r, e]) => '<li>' + esc(e) + ' <span class="t2">(' + r + ')</span> <button type="button" class="btn alt sm unlink" data-r="' + r + '" data-e="' + esc(e) + '">Stop sharing</button></li>').join('')
      : '<li class="t2">Only you, for now.</li>';
    $$('.unlink').forEach((b) => b.addEventListener('click', async () => {
      lists[b.dataset.r] = lists[b.dataset.r].filter((x) => x !== b.dataset.e);
      await saveLinks();
    }));
  }
  async function saveLinks(msg) {
    const fb = $('#share-fb');
    try {
      await updateDoc(ref, { parentEmails: lists.parent, tutorEmails: lists.tutor, updated: serverTimestamp() });
      if (msg) okMsg(fb, msg); else fb.textContent = '';
    } catch (e) { fail(fb, e); }
    drawLinks();
  }
  drawLinks();
  $('#f-share').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target, em = f.e.value.trim().toLowerCase(), r = f.r.value;
    if (isStudentEmail(em)) return fail($('#share-fb'), 'Use a real email address.');
    if (em === (me.user.email || '').toLowerCase()) return fail($('#share-fb'), 'That is your own email.');
    if (lists.parent.length + lists.tutor.length >= 10) return fail($('#share-fb'), 'You can share with up to 10 people.');
    lists.parent = lists.parent.filter((x) => x !== em); lists.tutor = lists.tutor.filter((x) => x !== em);
    lists[r].push(em);
    f.reset();
    await saveLinks('Shared. Ask them to go to <b>' + esc(HOME) + 'family.html</b>, create a ' + r + ' account with <b>' + esc(em) + '</b>, and confirm their email. Then ' + esc(kid.name) + ' shows on their page.');
  });
  $('#f-reset').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target, fb = $('#reset-fb'), u = f.u.value.trim().toLowerCase(), p = f.p.value;
    if (!usernameOk(u)) return fail(fb, 'Usernames are 3 to 20 letters or numbers.');
    fb.className = 'fb'; fb.textContent = 'Working…';
    try {
      const uid = await makeStudentLogin(u, p, kid.name, sid);
      await updateDoc(ref, { uid, username: u, updated: serverTimestamp() });
      okMsg(fb, 'Done. New username <b>' + esc(u) + '</b>, password <b>' + esc(p) + '</b>. Write it down. The old sign-in no longer opens their progress.');
      f.reset();
    } catch (er) { fail(fb, er); }
  });
  $('#del-kid').addEventListener('click', async () => {
    if (!confirm('Remove ' + kid.name + '? Their sign-in stops working and nobody can see their progress any more. This cannot be undone.')) return;
    try { await deleteDoc(ref); location.hash = ''; } catch (er) { fail($('#del-fb'), er); }
  });
}
