/* Math Atlas "Work together": a parent or tutor sees the student's page live and both can point and click.
   The student's browser is the host. It sends a copy of its page to the adult over a direct, private
   browser-to-browser link (WebRTC). Firebase only carries the short handshake, and only after the student
   taps Allow. Nothing is recorded. */
import { db, doc, setDoc, updateDoc, onSnapshot, serverTimestamp, esc } from './fb.js';

const ICE = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }];
const CHUNK = 16000;

/* wait for the connection details to be ready, so the handshake is one write each way */
function gathered(pc) {
  return new Promise((done) => {
    if (pc.iceGatheringState === 'complete') return done();
    const t = setTimeout(done, 3000);
    pc.addEventListener('icegatheringstatechange', () => { if (pc.iceGatheringState === 'complete') { clearTimeout(t); done(); } });
  });
}

/* messages can be large (a whole page), so split them */
function channel(dc, onMsg) {
  const parts = {};
  dc.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.t !== 'part') return onMsg(m);
    const p = parts[m.id] || (parts[m.id] = []);
    p[m.i] = m.d;
    if (p.filter((x) => x != null).length === m.n) { delete parts[m.id]; onMsg(JSON.parse(p.join(''))); }
  });
  let seq = 0;
  return (m) => {
    if (dc.readyState !== 'open') return;
    const s = JSON.stringify(m);
    if (s.length <= CHUNK) return dc.send(s);
    const id = ++seq, n = Math.ceil(s.length / CHUNK);
    for (let i = 0; i < n; i++) dc.send(JSON.stringify({ t: 'part', id, i, n, d: s.slice(i * CHUNK, (i + 1) * CHUNK) }));
  };
}

/* an element's address inside the page, as child positions from the root: "2/0/5" */
function pathOf(el, root) {
  const out = [];
  while (el && el !== root) {
    const p = el.parentElement;
    if (!p) return null;
    out.unshift(Array.prototype.indexOf.call(p.children, el));
    el = p;
  }
  return el === root ? out.join('/') : null;
}
function byPath(path, root) {
  if (path == null) return null;
  let el = root;
  if (path === '') return el;
  for (const i of path.split('/')) { el = el && el.children[+i]; }
  return el || null;
}
function where(e, root) {
  const el = e.target && e.target.nodeType === 1 ? e.target : null, path = el && pathOf(el, root);
  if (path == null) return null;
  const r = el.getBoundingClientRect();
  return { path, fx: r.width ? (e.clientX - r.left) / r.width : 0, fy: r.height ? (e.clientY - r.top) / r.height : 0 };
}
function pointer(name, cls) {
  const d = document.createElement('div');
  d.className = 'livept ' + cls;
  d.innerHTML = '<i></i><span>' + esc(name) + '</span>';
  d.hidden = true;
  document.body.appendChild(d);
  return d;
}
function placePointer(dot, m, root) {
  const el = m && byPath(m.path, root);
  if (!el) { dot.hidden = true; return; }
  const r = el.getBoundingClientRect();
  dot.hidden = false;
  dot.style.left = (r.left + window.scrollX + m.fx * r.width) + 'px';
  dot.style.top = (r.top + window.scrollY + m.fy * r.height) + 'px';
}
function values(root) {
  return Array.from(root.querySelectorAll('input, textarea, select')).map((el) => [pathOf(el, root), el.value, !!el.checked, !!el.disabled]);
}
function flash(el) {
  if (!el || !el.classList) return;
  el.classList.add('liveflash');
  setTimeout(() => el.classList.remove('liveflash'), 600);
}

/* ---------- the student's side ---------- */
export function startHost(sid, name) {
  const ref = doc(db, 'students', sid, 'live', 'session');
  let pc = null, send = null, banner = null, them = null, asked = null;
  const root = () => document.getElementById('app');

  function bar(html) {
    if (!banner) { banner = document.createElement('div'); banner.className = 'livebar'; banner.setAttribute('role', 'status'); document.body.appendChild(banner); }
    banner.innerHTML = html;
    banner.hidden = !html;
  }
  function stop(write) {
    if (pc) { pc.close(); pc = null; }
    send = null;
    if (them) them.hidden = true;
    bar('');
    if (write) setDoc(ref, { state: 'ended', at: serverTimestamp() }, { merge: true }).catch(() => {});
  }

  let timer = null, lastHtml = '';
  function page(force) {
    if (!send || !root()) return;
    const html = root().innerHTML;
    if (!force && html === lastHtml) return send({ t: 'vals', v: values(root()) });
    lastHtml = html;
    send({
      t: 'page', html, v: values(root()),
      css: Array.from(document.querySelectorAll('link[rel=stylesheet]')).map((l) => l.href),
      cls: document.documentElement.className, theme: document.documentElement.getAttribute('data-theme') || '',
      title: document.title, url: location.pathname + location.hash
    });
  }
  const watch = new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(() => page(false), 120); });
  let lastMove = 0;
  document.addEventListener('pointermove', (e) => {
    if (!send || Date.now() - lastMove < 60) return;
    lastMove = Date.now();
    const w = where(e, root());
    if (w) send(Object.assign({ t: 'ptr' }, w));
  });
  document.addEventListener('input', (e) => { if (send && root() && root().contains(e.target)) page(false); }, true);
  document.addEventListener('click', (e) => { if (send && root() && root().contains(e.target)) { const w = where(e, root()); if (w) send(Object.assign({ t: 'tap' }, w)); } }, true);
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    if (!send || Date.now() - lastScroll < 100) return;
    lastScroll = Date.now();
    send({ t: 'scroll', y: window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) });
  }, { passive: true });

  /* what the adult did, done here */
  function act(m) {
    const el = byPath(m.path, root());
    if (m.t === 'ptr') return placePointer(them, m, root());
    if (!el) return;
    if (m.t === 'click') { flash(el); placePointer(them, m, root()); el.click(); }
    else if (m.t === 'input') {
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!m.checked; else el.value = m.value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (m.t === 'submit') {
      const f = el.closest('form');
      if (f) f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    } else if (m.t === 'focus') { el.focus(); }
  }

  async function accept(s) {
    stop(false);
    pc = new RTCPeerConnection({ iceServers: ICE });
    pc.addEventListener('datachannel', (e) => {
      send = channel(e.channel, act);
      e.channel.addEventListener('open', () => {
        bar('<b>' + esc(s.byName) + '</b> is working with you. They can see this page and click on it. <button type="button" id="live-stop">Stop</button>');
        document.getElementById('live-stop').addEventListener('click', () => stop(true));
        if (!them) them = pointer(s.byName, 'them');
        watch.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true });
        page(true);
      });
      e.channel.addEventListener('close', () => stop(false));
    });
    await pc.setRemoteDescription(s.offer);
    await pc.setLocalDescription(await pc.createAnswer());
    await gathered(pc);
    await updateDoc(ref, { state: 'accepted', answer: { type: pc.localDescription.type, sdp: pc.localDescription.sdp }, at: serverTimestamp() });
    bar('Connecting to ' + esc(s.byName) + '…');
  }

  return onSnapshot(ref, (snap) => {
    const s = snap.exists() ? snap.data() : null;
    if (!s || s.state === 'ended' || s.state === 'declined') { if (pc || asked) { asked = null; stop(false); } return; }
    if (s.state === 'asking' && s.offer && asked !== s.offer.sdp) {
      asked = s.offer.sdp;
      stop(false);
      bar('<b>' + esc(s.byName) + '</b> (' + esc(s.byRole) + ') wants to work together. They will see this page and can point and click. ' +
        '<button type="button" id="live-yes">Allow</button> <button type="button" id="live-no">Not now</button>');
      document.getElementById('live-yes').addEventListener('click', () => accept(s).catch((e) => { console.warn(e); bar('Could not connect. Try again.'); }));
      document.getElementById('live-no').addEventListener('click', () => { bar(''); updateDoc(ref, { state: 'declined', at: serverTimestamp() }).catch(() => {}); });
    }
  }, () => {});
}

/* ---------- the parent's or tutor's side ---------- */
export async function startViewer(sid, me, kidName, stage, status) {
  const ref = doc(db, 'students', sid, 'live', 'session');
  const pc = new RTCPeerConnection({ iceServers: ICE });
  const dc = pc.createDataChannel('atlas');
  let student = null, links = [], followUntil = 0, unsub = null;
  const say = (t) => { status.innerHTML = t; };

  let ended = false;
  function end(write, msg) {
    if (ended) return;
    ended = true;
    if (unsub) unsub();
    pc.close();
    if (student) student.hidden = true;
    say(msg || 'Session ended.');
    if (write) setDoc(ref, { state: 'ended', at: serverTimestamp() }, { merge: true }).catch(() => {});
  }

  function show(m) {
    if (m.t === 'page') {
      /* use the student's page styles */
      const want = m.css.join('|');
      if (links.join('|') !== want) {
        document.querySelectorAll('link[data-live]').forEach((l) => l.remove());
        m.css.forEach((href) => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; l.dataset.live = '1'; document.head.appendChild(l); });
        links = m.css.slice();
      }
      document.documentElement.className = m.cls;
      if (m.theme) document.documentElement.setAttribute('data-theme', m.theme); else document.documentElement.removeAttribute('data-theme');
      stage.innerHTML = m.html;
      say('You are working with <b>' + esc(kidName) + '</b>. Click anything on their page. <span class="t2">' + esc(m.title) + '</span>');
    }
    if (m.t === 'page' || m.t === 'vals') {
      (m.v || []).forEach(([p, v, c, dis]) => {
        const el = byPath(p, stage);
        if (!el || el === document.activeElement) return;
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = c; else el.value = v;
        el.disabled = dis;
      });
    }
    if (m.t === 'ptr') placePointer(student, m, stage);
    if (m.t === 'tap') { placePointer(student, m, stage); flash(byPath(m.path, stage)); }
    if (m.t === 'scroll' && Date.now() > followUntil) {
      window.scrollTo(0, m.y * Math.max(0, document.documentElement.scrollHeight - innerHeight));
    }
  }
  const send = channel(dc, show);

  /* what the adult does on the copy is sent to the student's page */
  stage.addEventListener('click', (e) => {
    const w = where(e, stage);
    const isField = e.target.closest && e.target.closest('input, textarea, select');
    if (!isField) e.preventDefault();
    if (w) send(Object.assign({ t: isField ? 'focus' : 'click' }, w));
  }, true);
  stage.addEventListener('input', (e) => {
    const p = pathOf(e.target, stage);
    if (p != null) send({ t: 'input', path: p, value: e.target.value, checked: !!e.target.checked });
  }, true);
  stage.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.submitter || e.target.querySelector('button, [type=submit]'), p = pathOf(btn || e.target, stage);
    if (p != null) send({ t: 'submit', path: p });
  }, true);
  let lastMove = 0;
  stage.addEventListener('pointermove', (e) => {
    if (Date.now() - lastMove < 60) return;
    lastMove = Date.now();
    const w = where(e, stage);
    if (w) send(Object.assign({ t: 'ptr' }, w));
  });
  window.addEventListener('wheel', () => { followUntil = Date.now() + 4000; }, { passive: true });
  window.addEventListener('touchmove', () => { followUntil = Date.now() + 4000; }, { passive: true });

  dc.addEventListener('open', () => { student = student || pointer(kidName, 'kid'); say('Connected. Loading ' + esc(kidName) + '\'s page…'); });
  dc.addEventListener('close', () => end(false, esc(kidName) + ' ended the session.'));

  say('Asking ' + esc(kidName) + ' to allow it…');
  await pc.setLocalDescription(await pc.createOffer());
  await gathered(pc);
  await setDoc(ref, {
    state: 'asking', offer: { type: pc.localDescription.type, sdp: pc.localDescription.sdp },
    byUid: me.user.uid, byName: me.name, byRole: me.role, at: serverTimestamp()
  });
  say('Waiting for ' + esc(kidName) + ' to tap <b>Allow</b>. They need to be signed in and have the Math Atlas open.');
  unsub = onSnapshot(ref, async (snap) => {
    const s = snap.data();
    if (!s) return;
    if (s.state === 'accepted' && s.answer && !pc.currentRemoteDescription) {
      say('Connecting…');
      try { await pc.setRemoteDescription(s.answer); } catch (e) { end(true, 'Could not connect.'); }
    } else if (s.state === 'declined') end(false, esc(kidName) + ' said not now.');
    else if (s.state === 'ended' && pc.connectionState !== 'closed') end(false, 'Session ended.');
  });
  pc.addEventListener('connectionstatechange', () => {
    if (pc.connectionState === 'failed') end(true, 'Could not connect. This can happen on some school or office networks. Try again from home Wi-Fi.');
  });
  return () => end(true);
}
