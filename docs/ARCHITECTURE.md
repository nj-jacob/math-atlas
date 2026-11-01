# How Math Atlas is built

Math Atlas is a set of plain web pages with no build step: what is in this repository is exactly what the browser loads. It is hosted on Firebase at https://ontario-math-atlas.web.app.

## Folders

| Folder or file | What it is |
| --- | --- |
| `index.html`, `curriculum.html` | Atlas home page (Math plan and Language side by side; for parents and tutors, one card per child with both subjects) and the Curriculum page (Math and Language, every grade and chapter). Both share the top bar and sign-in from `assets/home.js` and `home.css`. `assets/curriculum.js` runs the Math / Language switch and builds the Language list. |
| `language/` (not in this repository) | The Language pages, from the `language-atlas` repository. The publish workflow copies them in before publishing (see "One app, two repositories" below and `SETUP.md`). |
| `family.html`, `live.html` | Family sign-in and parent and tutor pages, and the "Work together" page |
| `404.html` | The "page not found" page. Firebase shows it for any address that does not exist. It uses `/` paths so it works at any depth. |
| `plan/` | Math Plan: placement test and learning plans, Grades 1 to 8 |
| `grade1/` … `grade8/` | One site per grade (see below) |
| `assets/engine/` | **Shared by every grade**: lesson engine, toolbox, answer types |
| `assets/atlas-theme.css` | The one look for every page |
| `assets/atlas-header.js` | The shared header on grade sites ("All grades" link to the Curriculum page) |
| `assets/icon.svg` | The site icon shown in browser tabs and bookmarks. Every page links to it. |
| `assets/load-note.js` | On the family and "Work together" pages: if sign-in cannot load, shows a short note instead of a blank page |
| `assets/fb.js`, `sync.js`, `family.js`, `live.js`, `langplace.js` | Sign-in and saving progress (Firebase); `langplace.js` shows Language placement results on the parent pages |
| `assets/review.js` | Review notes: the grown-up "Note" button on grade pages (see "Review notes" below) |
| `tests/` | Automatic checks (see `CHECKS.md`) |
| `.github/workflows/` | `checks.yml` runs the checks on pull requests. `deploy.yml` runs them again, then publishes `main`. |

## One grade site

`gradeN/index.html` loads, in this order:
1. `gradeN/assets/site.js`: the grade's app (chapter list, router, practice, quiz, check-up, progress). It creates the `Atlas` object.
2. `../assets/engine/qkit.js`: the answer types (`Atlas.Q`).
3. `../assets/engine/manip.js`: the toolbox of manipulatives (`Manip`: base-ten blocks, number lines, coins and more).
4. `../assets/engine/lesson.js`: the one-idea-per-screen lessons (`Atlas.lessons`).
5. `gradeN/assets/gNkit.js`: small helpers for that grade's chapters (optional).
6. `gradeN/chapters/*.js`: one file per chapter. Each one calls `Atlas.register(id, chapter)`.

## A chapter

```
Atlas.register('numbers-1000', {
  lessons:  [ { id, title, concepts: [ { id, title, body, watch, try, key, mistake, check } ] } ],
  quiz:     [ fixed questions ],
  quizFresh: true,          // the chapter quiz is made fresh each time from the practice skills
  practice: [ { id, name, code: 'B1.1', gen: function (level) { return question; } } ]
});
```

- **Practice skills** make a new question every time, at level 1, 2 or 3. The site moves a child up a level after 3 right in a row, and down after 2 misses.
- **Question shapes**: a skill can ask the same idea in several ways. `Atlas.Q.vary(skillId, level, [[minLevel, 'shape-name', fn], ...])` picks one, never the same shape twice in a row. See `QUESTIONS.md`.
- **Check-ups** use level 1 of every skill, then a few level-2 questions.
- **Idea cards**: each idea in a lesson shows as a small stack of cards, one at a time: "Watch" (or "Learn") with the explanation and clip, "Try it" with the key idea, then "Your turn". Back and Next move through the cards first, then to the other ideas. A part the idea doesn't have is left out. An idea with only one part shows as a single page.
- **Watch clips** (`Manip.player`) don't start on their own. The student taps Play, or steps one part at a time with ‹ and ›. The "Auto-play" switch on any clip turns auto-start on for every clip. It is saved in this browser as `atlas:autoplay`.
- **Worked examples ("My turn")**: an idea can add `example` (the same shape as `watch`). It gets its own "My turn" card after the first card: one example solved step by step in "I" language ("My turn. First I..."), played like a Watch clip. It has no voice: Noel tried the device's built-in voice and found it too robotic.

## Math Plan

`plan/index.html` loads `vis.js` (pictures), `bank.js` (placement questions), `ladder.js` (every Ontario expectation, Grades 1 to 8, in the Ministry's wording), `blurbs.js` (one short plain-language line for each expectation), `families.js` (concept families), `engine.js` (placement and plan logic) and `app.js` (the screens). The plain line is what children and parents see, for example on "Today's idea" and when a concept-map square is tapped. The Ministry wording is shown under "Ontario wording". When an expectation is added to `ladder.js`, add its line to `blurbs.js` too, or the checks fail.

`families.js` sorts every expectation into one **concept family**: one idea that grows across the grades, such as Fractions, Time or Budgets. Each expectation is in exactly one family, or the checks fail. The concept map uses the families for its "By idea" view (one row per family, Grades 1 to 8 across); tapping a family's name lists that idea in every grade with a link to each lesson. The same list is the set of sibling lessons to check when one lesson in the family is improved (see CLAUDE.md). When an expectation is added to `ladder.js`, add it to its family too.

## Saved progress

Progress is kept in the browser (`localStorage`, prefix `gNatlas:`). When a child is signed in, `assets/sync.js` copies it to Firebase so parents and tutors see it.

## Review notes

A way for Noel (or any parent or tutor) to leave tweaks while looking through the lessons, instead of one message at a time.
- `assets/sync.js` loads `assets/review.js` on every page that loads sync.js, for a signed-in parent or tutor, or when nobody is signed in (the note then asks them to sign in). Never for a student.
- The **Note** button shows only in grown-up view (`html.adult`). It opens a small sheet that says which screen the note is about: grade, lesson, idea, card (for example "Your turn card") and the question in view, plus the page address.
- Notes are saved to `users/{uid}/reviews/{id}` with `text`, `where`, `q`, `url`, `site`, `at`, `done`. `firestore.rules` lets only that parent or tutor read, change or delete them; students cannot write any.
- `family.js` shows **My notes** on the parent and tutor page (`family.html#notes`): To do and Done lists, Open screen, Mark done, Delete, and **Copy notes to send**, which copies the to-do list as plain text to paste to Claude.
- Language pages get the same button once they load `assets/sync.js` (the same file, from this repository).

## One app, two repositories

Atlas is one website at https://ontario-math-atlas.web.app with one sign-in, but its code lives in two repositories so a change to one subject cannot break the other:

- **math-atlas** (this one): the home page, Curriculum page, sign-in, family pages, Math Plan and the Math grades.
- **language-atlas**: the Language grades, with their own engine, checks and changelog. Published under `/language/`.

How publishing works:
1. A merge to `main` in either repository runs that repository's checks.
2. language-atlas then sends a `language-updated` event to this repository. Its publish workflow (`.github/workflows/deploy.yml`) runs on that event too.
3. The publish workflow copies language-atlas `main` into `language/` and publishes the whole site once. Both repositories need the `ATLAS_TOKEN` secret (`SETUP.md`).

What they share at runtime (same website, so same browser storage and sign-in):
- Language pages load `assets/sync.js`, `fb.js` and `family.css` from here, so their progress saves to the family account as `students/{id}/progress/l1` … `l8`. `SITES` in `assets/fb.js` lists every Math (`g1`…) and Language (`l1`…) grade, and the family page and home page show both.
- The Language placement check (`language/placement/`) saves to `students/{id}/progress/lplace` (its whole state as `data.state`). `assets/langplace.js` reads it: one line on each child's card on the home page, and a **Language placement check** section on the Progress and notes page (secure grade and starting lesson for each of the 7 parts, reading aloud, writing sample). `lplace` is not in `SITES`, because it is not a grade.
- The Curriculum page reads `language/index.html` to see which Language grades are ready, then each `language/gradeN/grade.js` for its chapters. Keep `Atlas.setup({ grade, chapters: [{ id, title, sub, strand }] })` in that shape.
- Browser storage: Math grades use `gNatlas:` keys, Language grades `lang-gN:`. Both use `atlas:adult` for the grown-up view.

