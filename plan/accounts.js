/* Math Plan on the family website: who is signed in.
   Student: their plan is saved by sync.js like any grade site; here we only bring in changes a parent or tutor made.
   Parent or tutor: read the student's saved plan from their account and let them pin, move or skip ideas. */
import {
  configured, auth, db, onAuthStateChanged, whoAmI, doc, collection, getDoc, getDocs, query, where, updateDoc, serverTimestamp
} from '../assets/fb.js';

const MP = window.MathPlan, A = MP.acct, E = window.PE;
const parse = (v, d) => { try { return v == null ? d : JSON.parse(v); } catch (e) { return d; } };

function applyPrefs(pp) {
  if (!pp) return;
  let st = parse(localStorage.getItem(MP.KEY), null);
  if (!st || (st.prefs && (st.prefs.at || 0) >= (pp.at || 0))) return;
  st.prefs = { pin: pp.pin || [], skip: pp.skip || [], order: pp.order || [], at: pp.at || Date.now() };
  (pp.order || []).forEach((id, k) => { if (st.concepts[id]) st.concepts[id].manual = k; });
  (st.prefs.pin || []).concat(pp.order || []).forEach((id) => { if (st.concepts[id] && st.concepts[id].st !== 'mastered' && st.queue.indexOf(id) < 0) st.queue.push(id); });
  E.order(st); E.fillWeek(st);
  localStorage.setItem(MP.KEY, JSON.stringify(st));
}

async function kidsOf(me) {
  const uid = me.user.uid, em = (me.user.email || '').toLowerCase(), qs = [query(collection(db, 'students'), where('ownerUid', '==', uid))];
  if (em && me.user.emailVerified) {
    qs.push(query(collection(db, 'students'), where('parentEmails', 'array-contains', em)));
    qs.push(query(collection(db, 'students'), where('tutorEmails', 'array-contains', em)));
  }
  const seen = {}, out = [];
  for (const q of qs) {
    const snap = await getDocs(q).catch(() => ({ docs: [] }));
    snap.docs.forEach((d) => { if (!seen[d.id]) { seen[d.id] = 1; out.push({ sid: d.id, name: d.data().name || 'Student' }); } });
  }
  return out.sort((a, b) => (a.name < b.name ? -1 : 1));
}

async function openKid(sid) {
  const kid = (A.kids || []).find((k) => k.sid === sid);
  A.sid = sid; A.kidName = kid ? kid.name : ''; A.st = null; A.saved = '';
  const snap = await getDoc(doc(db, 'students', sid, 'progress', 'plan')).catch(() => null);
  const data = snap && snap.exists() ? snap.data().data || {} : {};
  A.st = parse(data.state, null);
  /* practice saved in the grade sites, so the plan can show which lessons were practised */
  const sites = {};
  await Promise.all([1, 2, 3, 4, 5, 6, 7, 8].map(async (g) => {
    const p = await getDoc(doc(db, 'students', sid, 'progress', 'g' + g)).catch(() => null);
    if (p && p.exists()) sites['g' + g] = p.data().data || {};
  }));
  A.skills = (site, skill) => parse((sites[site] || {})['sk:' + skill], null);
  const kd = await getDoc(doc(db, 'students', sid)).catch(() => null), pp = kd && kd.exists() ? kd.data().planPrefs : null;
  if (A.st && pp && (pp.at || 0) > ((A.st.prefs && A.st.prefs.at) || 0)) {
    A.st.prefs = { pin: pp.pin || [], skip: pp.skip || [], order: pp.order || [], at: pp.at };
    (pp.order || []).forEach((id, k) => { if (A.st.concepts[id]) A.st.concepts[id].manual = k; });
    E.order(A.st); E.fillWeek(A.st);
  }
  if (location.hash !== '#plan') location.hash = 'plan'; else MP.render();
}

async function savePrefs(st) {
  st.prefs.at = Date.now();
  try {
    await updateDoc(doc(db, 'students', A.sid), { planPrefs: { pin: st.prefs.pin || [], skip: st.prefs.skip || [], order: st.prefs.order || [], at: st.prefs.at }, updated: serverTimestamp() });
    A.saved = 'Saved. ' + (A.kidName || 'The student') + ' will see the change the next time they open Math Plan.';
  } catch (e) {
    A.saved = 'That change could not be saved to the account yet. Check the internet connection and try again.';
  }
  MP.render();
}

if (configured) {
  onAuthStateChanged(auth, async (user) => {
    const me = await whoAmI(user).catch(() => null);
    if (!me || !me.role) { A.mode = 'local'; return; }
    if (me.role === 'student') {
      A.mode = 'student'; A.name = me.name; A.sid = me.sid;
      const kd = await getDoc(doc(db, 'students', me.sid)).catch(() => null);
      applyPrefs(kd && kd.exists() ? kd.data().planPrefs : null);
      MP.render();
      return;
    }
    A.mode = 'adult'; A.name = me.name; A.open = openKid; A.savePrefs = savePrefs;
    A.kids = await kidsOf(me);
    const want = new URLSearchParams(location.search).get('sid');
    if (want && A.kids.some((k) => k.sid === want)) return openKid(want);
    if (A.kids.length === 1) return openKid(A.kids[0].sid);
    MP.render();
  });
}
