/* Math Atlas family accounts: one place that loads Firebase, shared by sync.js (grade sites) and family.js (family page). */
import { initializeApp, deleteApp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import {
  getAuth, initializeAuth, inMemoryPersistence, connectAuthEmulator, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification,
  sendPasswordResetEmail, updateProfile, signOut
} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import {
  getFirestore, connectFirestoreEmulator, doc, collection, getDoc, getDocs, setDoc, updateDoc, addDoc,
  deleteDoc, query, where, orderBy, limit, serverTimestamp, increment, arrayUnion, onSnapshot
} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

export {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification,
  sendPasswordResetEmail, updateProfile, doc, collection, getDoc, getDocs, setDoc, updateDoc, addDoc,
  deleteDoc, query, where, orderBy, limit, serverTimestamp, increment, arrayUnion, onSnapshot
};

/* On a local test server with no settings pasted in, use the Firebase emulators instead. */
const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const filled = !/^PASTE/.test(firebaseConfig.apiKey || 'PASTE');
const emu = local && !filled;
const cfg = emu ? { apiKey: 'demo-key', authDomain: 'demo-atlas.firebaseapp.com', projectId: 'demo-atlas', appId: 'demo' } : firebaseConfig;

export const configured = filled || emu;
export let auth = null, db = null;
let app = null;
if (configured) {
  app = initializeApp(cfg);
  auth = getAuth(app);
  db = getFirestore(app);
  if (emu) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
}

/* Students sign in with a username. Firebase needs an email, so we make one on the project's own
   Firebase address. Nothing is ever sent to it. */
export const STUDENT_DOMAIN = 'students.' + (cfg.authDomain || 'mathatlas.invalid');
export const usernameOk = (u) => /^[a-z0-9][a-z0-9._-]{2,19}$/.test(u);
export const studentEmail = (u) => u.toLowerCase() + '@' + STUDENT_DOMAIN;
export const isStudentEmail = (e) => !!e && e.toLowerCase().endsWith('@' + STUDENT_DOMAIN);

/* Make a student login without signing the parent out: use a second, throw-away Firebase app. */
export async function makeStudentLogin(username, password, name, sid) {
  const app2 = initializeApp(cfg, 'maker-' + Date.now());
  try {
    const a2 = initializeAuth(app2, { persistence: inMemoryPersistence });
    const d2 = getFirestore(app2);
    if (emu) { connectAuthEmulator(a2, 'http://127.0.0.1:9099', { disableWarnings: true }); connectFirestoreEmulator(d2, '127.0.0.1', 8080); }
    const cred = await createUserWithEmailAndPassword(a2, studentEmail(username), password);
    await setDoc(doc(d2, 'users', cred.user.uid), { role: 'student', name, sid, created: serverTimestamp() });
    await signOut(a2);
    return cred.user.uid;
  } finally {
    await deleteApp(app2);
  }
}

/* Saved practice on this device belongs to whoever is signed in. Clear it on sign-out so the next person starts fresh. */
const PROGRESS = /^(g\d+atlas:|atlasSync:)/, DEVICE = /:(theme|big)$/;
export function clearDeviceProgress() {
  try {
    const drop = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (PROGRESS.test(k) && !DEVICE.test(k)) drop.push(k);
    }
    drop.forEach((k) => localStorage.removeItem(k));
  } catch (e) { /* storage blocked: nothing saved anyway */ }
}
export async function signOutAll() {
  if (window.atlasFlush) await window.atlasFlush();
  clearDeviceProgress();
  await signOut(auth);
}

/* Who is this login? {user, role, name, sid} or null. */
export async function whoAmI(user) {
  if (!user) return null;
  const snap = await getDoc(doc(db, 'users', user.uid));
  if (!snap.exists()) return { user, role: null, name: user.displayName || '' };
  const d = snap.data();
  return { user, role: d.role, name: d.name, sid: d.sid || null };
}

export const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export function today(d) {
  d = d || new Date();
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
}
/* The grade sites on this website, each in its own folder (grade1/ ... grade8/).
   When a grade's folder is added, change its "on" to true. */
export const SITES = {};
[1, 2, 3, 4, 5, 6, 7, 8].forEach((n) => { SITES['g' + n] = { name: 'Grade ' + n, path: 'grade' + n + '/', on: true }; });
