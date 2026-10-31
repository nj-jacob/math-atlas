# Math Atlas

Free study sites for Ontario math, Grades 1 to 8, with family accounts. Live at https://ontario-math-atlas.web.app

- `index.html`: the landing page. `family.html`: sign-in, student home, parent and tutor pages. `live.html`: "Work together".
- `grade1/` … `grade8/`: one site per grade. Each loads the shared engine from `assets/engine/` (lessons, toolbox, answer types).
- `tests/`: automatic checks. `docs/`: how it is built (`ARCHITECTURE.md`), how to write questions (`QUESTIONS.md`), what the checks do (`CHECKS.md`). Rules for every change: `CLAUDE.md`.
- `assets/fb.js` (Firebase setup and the list of grades), `assets/sync.js` (saves a signed-in student's progress), `assets/family.js` (family page), `assets/live.js` (Work together), `assets/firebase-config.js` (public web settings).
- `firestore.rules`: who can see what. Each student is visible only to them, the adult who added them, and adults they are shared with by confirmed email.

## Publishing
Every push to `main` runs the automatic checks, then publishes the site and the rules if they pass (`.github/workflows/deploy.yml`). Pull requests run the same checks (`checks.yml`). It needs the repository secret `FIREBASE_SERVICE_ACCOUNT` (Firebase console > Project settings > Service accounts > Generate new private key).

More detail, including first-time Firebase setup: `SETUP.md`.
