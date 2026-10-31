# Math Atlas: free website with family accounts

This folder is the whole website: a landing page, the Grade 5 Math Atlas (in `grade5/`), and the family page (`family.html`) where students, parents and tutors sign in.
It runs on Google Firebase's free plan. You do not need a credit card.

## What each person gets

- **Student**: signs in with a username and password (no email needed). Practice, quizzes and check-ups save to their account and follow them to any device. Their home page shows practice suggested by a parent or tutor, and notes.
- **Parent**: makes the child's sign-in, sees questions per day, first-try accuracy, skill levels for every chapter, check-up results and a "worth a look" list. Can suggest practice, leave notes, share the child with a tutor or the other parent, make a new sign-in if the child forgets the password, or remove the child.
- **Tutor**: sees every student shared with them, side by side, with the same detail. Can suggest practice and leave notes. Cannot change who sees the student.
- No account is needed to use the site. Without one, progress stays only in that browser, as before.

## Set up Firebase (about 10 minutes, once)

1. Go to https://console.firebase.google.com and sign in with a Google account.
2. Click **Create a project**. Name it, for example `math-atlas`. Turn **off** Google Analytics. Click **Create project**.
3. In the left menu choose **Build > Authentication**, click **Get started**, choose **Email/Password**, switch on the first toggle, and click **Save**.
4. In the left menu choose **Build > Firestore Database**, click **Create database**. For location choose **northamerica-northeast2 (Toronto)** (or Montréal) so the data stays in Canada. Choose **Start in production mode**. Click **Create**.
5. Click the gear icon next to **Project Overview** and choose **Project settings**. Under **Your apps**, click the **</>** (web) button. Type a nickname such as `Math Atlas`, tick **Also set up Firebase Hosting**, and click **Register app**.
6. You will see a block of code with `apiKey`, `authDomain`, `projectId` and `appId`. Copy it and send it to Claude in the project thread (these values are not secret), or paste the four values into `assets/firebase-config.js` yourself.

## Publish

Claude can do this on your computer for you if you allow it. To do it yourself:

1. Install Node.js (the "LTS" button) from https://nodejs.org.
2. Open a terminal in this folder (on a Mac: right-click the folder in Finder > **New Terminal at Folder**; on Windows: open the folder, type `cmd` in the address bar, press Enter).
3. Type `npx firebase-tools login` and press Enter. Sign in with the same Google account in the browser window that opens.
4. Type `npx firebase-tools deploy --project YOUR-PROJECT-ID` (the `projectId` from step 6) and press Enter.
5. When it says **Deploy complete**, your site is live at `https://YOUR-PROJECT-ID.web.app`.

Run step 4 again whenever the site changes. It also installs the privacy rules (`firestore.rules`) that keep each family's data private.

## Language pages (one-time, about 5 minutes)

Atlas shows Language at `/language/`. Those pages live in a second repository, `nj-jacob/language-atlas`. Each time either repository changes, the publish step copies the Language pages in and publishes everything together. It needs one GitHub key so the two repositories can talk to each other:

1. Open https://github.com/settings/personal-access-tokens/new (GitHub > your picture > Settings > Developer settings > Fine-grained tokens > Generate new token).
2. **Token name**: `Atlas publish`. **Expiration**: the longest offered (or "No expiration").
3. **Repository access**: choose **Only select repositories** and pick **math-atlas** and **language-atlas**.
4. **Permissions** > **Repository permissions** > **Contents**: choose **Read and write**. Leave everything else as it is.
5. Click **Generate token** and copy it (it starts with `github_pat_`).
6. In **math-atlas** on GitHub: **Settings > Secrets and variables > Actions > New repository secret**. Name `ATLAS_TOKEN`, paste the token, **Add secret**.
7. Do the same in **language-atlas**: a secret named `ATLAS_TOKEN` with the same token.

Until this is done, the site still publishes, just without Language (the Curriculum page says so). When the token expires, make a new one the same way and paste it into both secrets.

## First use

1. Open `https://YOUR-PROJECT-ID.web.app/family.html`, choose **Create a parent or tutor account**, and click the link in the confirmation email (check spam; it comes from `noreply@YOUR-PROJECT-ID.firebaseapp.com`).
2. Click **Add a student** and write down the username and password.
3. On the student's device, open the site, click **Sign in** in the top bar, and choose **I am a student**.
4. To add a tutor: open the student, enter the tutor's email under **Who can see**, and ask the tutor to create a tutor account with that same email.

## Free plan limits

The free (Spark) plan allows 50 000 reads and 20 000 saves a day. One student practising for an hour uses roughly 50 saves, so a family or a small tutoring group is far inside the limit. If a limit were ever reached, the site keeps working and saving stops until the next day.

## For whoever maintains it

- `assets/fb.js` loads Firebase (version 13.1.0 from Google's CDN). `assets/sync.js` is added to each grade site with three lines in its `index.html`: two `<meta>` tags (`atlas-site`, `atlas-prefix`) and `<script type="module" src="../assets/sync.js">`, plus the `family.css` link. It copies the grade site's `localStorage` progress to `students/{id}/progress/{site}` and keeps daily totals in `students/{id}/days`. It does not change the grade site's code.
- When a grade folder is updated, copy the new folder in and add those lines back to its `index.html`.
- Adding another grade (1 to 8): put it in `gradeN/` with `atlas-site` = `gN` and `atlas-prefix` = its storage prefix (for example `g3atlas:`), and switch it on in the `SITES` list in `assets/fb.js`. The landing page, student home and parent pages pick it up from there.
- Students sign in with a made-up email `username@students.YOUR-PROJECT-ID.firebaseapp.com`. Nothing is ever sent there.
- Local testing: `npx firebase-tools emulators:start --project demo-atlas`, serve this folder on `http://localhost:5000`, and leave `firebase-config.js` unfilled. The pages then use the local emulators.
