/* Atlas review notes: a "Note" button for grown-ups on every Math and Language grade page.
   A parent or tutor taps it, types a tweak ("picture too small"), and the note is saved to their own account
   with the exact screen it came from. They are listed under "My notes" on the family page (family.js).
   sync.js starts this for a signed-in parent or tutor, and for nobody signed in (the note then asks them to sign in).
   It never starts for a student, and the button only shows in grown-up view (html.adult).
   Saved as users/{uid}/reviews/{id}: { text, url, where, q, site, at, done }. */
import { db, esc, collection, addDoc, serverTimestamp } from './fb.js';

const $ = (s, r) => (r || document).querySelector(s);
const clean = (s, n) => String(s || '').replace(/\s+/g, ' ').trim().slice(0, n);
const shown = (el) => !!(el && el.offsetParent && el.getClientRects().length);

/* What is on screen right now, in words: grade, lesson or page, the card being shown, and the question in view. */
function screenNow(siteName) {
  const app = $('#app') || document.body;
  const lsWhere = $('.ls-where', app), title = $('.ls-card h2', app) || $('h1', app);
  const parts = [siteName];
  if (shown(lsWhere)) parts.push(clean(lsWhere.textContent, 120));
  if (title) {
    const t = title.cloneNode(true);
    t.querySelectorAll('.ls-badge').forEach((b) => b.remove());
    t.querySelectorAll('.n').forEach((n) => n.append(' '));
    parts.push(clean(t.textContent, 120));
  }
  const card = $('.ls-steps button[aria-current]', app);
  if (card) parts.push(clean(card.textContent.replace(/^\d+/, ''), 40) + ' card');
  /* the question nearest the top of the screen */
  const qs = Array.from(app.querySelectorAll('.qtext')).filter(shown);
  const inView = qs.filter((q) => { const r = q.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; });
  const q = inView[0] || qs[0];
  return {
    where: parts.filter(Boolean).join(' · ').slice(0, 300),
    q: q ? clean(q.textContent + (q.nextElementSibling && q.nextElementSibling.classList.contains('fig') ? ' [picture: ' + clean(q.nextElementSibling.textContent, 120) + ']' : ''), 300) : '',
    url: clean(location.pathname + location.hash, 300)
  };
}

/* path back to the Atlas home, as in sync.js */
const ROOT = () => {
  const m = (n) => (document.querySelector('meta[name="' + n + '"]') || {}).content;
  return m('atlas-hub') || m('atlas-root') || '../';
};

let who = null, site = '', siteName = '', btn = null, box = null;

function draw() {
  btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'rv-btn'; btn.id = 'rv-btn';
  btn.innerHTML = '<span aria-hidden="true">✎</span> Note';
  btn.setAttribute('aria-label', 'Leave a note about this screen (grown-ups only)');
  document.body.appendChild(btn);

  box = document.createElement('dialog');
  box.className = 'rv-sheet'; box.id = 'rv-sheet';
  box.setAttribute('aria-labelledby', 'rv-h');
  document.body.appendChild(box);
  btn.addEventListener('click', open);
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
}

function open() {
  const s = screenNow(siteName);
  if (!who) {
    const back = encodeURIComponent(location.pathname + location.hash);
    box.innerHTML = '<h2 id="rv-h">Note about this screen</h2><p>Sign in as a parent or tutor to save notes to your account.</p>' +
      '<p class="rv-act"><a class="btn" href="' + ROOT() + 'family.html?next=' + back + '">Sign in</a> <button type="button" class="btn alt" value="no">Close</button></p>';
  } else {
    box.innerHTML = '<form method="dialog" id="rv-f"><h2 id="rv-h">Note about this screen</h2>' +
      '<p class="rv-where">' + esc(s.where) + (s.q ? '<br><span>Question: ' + esc(s.q) + '</span>' : '') + '</p>' +
      '<label class="sr" for="rv-t">Your note</label><textarea id="rv-t" maxlength="1000" rows="4" required placeholder="What would you change? For example: the picture is too small."></textarea>' +
      '<p class="rv-act"><button type="submit" class="btn" value="save">Save note</button> <button type="button" class="btn alt" value="no">Cancel</button></p>' +
      '<p class="fb" aria-live="polite"></p></form>';
    $('#rv-f', box).addEventListener('submit', (e) => { e.preventDefault(); save(s); });
  }
  box.querySelectorAll('button[value="no"]').forEach((b) => b.addEventListener('click', () => box.close()));
  box.showModal();
  const t = $('#rv-t', box); if (t) t.focus();
}

async function save(s) {
  const t = $('#rv-t', box), fb = $('.fb', box), go = $('button[type=submit]', box), text = clean(t.value, 1000);
  if (!text) return;
  go.disabled = true; fb.className = 'fb'; fb.textContent = 'Saving…';
  try {
    await addDoc(collection(db, 'users', who.user.uid, 'reviews'), {
      text, where: s.where, q: s.q, url: s.url, site, at: serverTimestamp(), done: false
    });
    box.close();
    toast('Note saved. See it under My notes on your ' + (who.role === 'tutor' ? 'Tutor' : 'Parent') + ' page.');
  } catch (e) {
    go.disabled = false;
    fb.className = 'fb bad'; fb.textContent = 'Could not save the note. Check the internet connection and try again.';
  }
}

function toast(msg) {
  const el = document.createElement('p');
  el.className = 'rv-toast'; el.setAttribute('role', 'status'); el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

/* who: { user, role, name } for a parent or tutor, or null when nobody is signed in. */
export function startReview(me, siteKey, name) {
  who = me && (me.role === 'parent' || me.role === 'tutor') ? me : null;
  site = siteKey; siteName = name;
  if (!btn) draw();
}
