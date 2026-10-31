# Math Atlas

Free study sites for Ontario math, Grades 1 to 8, with family accounts. Live at https://ontario-math-atlas.web.app

- `index.html`: the landing page. `family.html`: sign-in, student home, parent and tutor pages. `live.html`: "Work together".
- `grade1/` … `grade8/`: one site per grade. Each is unchanged from its own build except four lines in its `index.html` (the `family.css` link, the `atlas-site` and `atlas-prefix` meta tags, and the `sync.js` module).
- `assets/fb.js` (Firebase setup and the list of grades), `assets/sync.js` (saves a signed-in student's progress), `assets/family.js` (family page), `assets/live.js` (Work together), `assets/firebase-config.js` (public web settings).
- `firestore.rules`: who can see what. Each student is visible only to them, the adult who added them, and adults they are shared with by confirmed email.

## Publishing
Every push to `main` publishes the site and the rules (`.github/workflows/deploy.yml`). It needs the repository secret `FIREBASE_SERVICE_ACCOUNT` (Firebase console > Project settings > Service accounts > Generate new private key).

More detail, including first-time Firebase setup: `SETUP.md`.
