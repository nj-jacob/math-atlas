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
| `assets/engine/` | **Shared by every grade**: the grade app (`site.js`), lesson engine, toolbox, answer types |
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
1. `../assets/engine/site.js`: the grade app, the same for every grade (router, home page, practice, quiz, check-up, progress, reading settings). It creates the `Atlas` object.
2. `gradeN/assets/grade.js`: that grade's settings, in one `Atlas.setup({ ... })` call, and the grade's own drawing helpers for its chapters (see "Grade settings" below).
3. `../assets/engine/qkit.js`: the answer types (`Atlas.Q`).
4. `../assets/engine/manip.js`: the toolbox of manipulatives (`Manip`: base-ten blocks, number lines, coins and more). It also draws the Toolbox page (`Manip.toolbox`): one tool fills the screen under a slim bar (back, Undo, Show number, Tools), and the Tools menu groups the grade's tools on five shelves (Numbers; Parts and groups; Patterns and equations; Shapes and space; Measure, money and data). A tool's shelf, name, icon and settings are in the `BOX` list there. The Toolbox version of the base-ten blocks (`drag: true`) is dragged from a tray, has a Thousands column, and keeps the mat one size for the screen: as blocks are added they shrink to fit instead of the mat growing. Its number (when "Show number" is on) sits above the mat. Lessons use the same blocks with buttons. The Toolbox number line (`Manip.numberline` with `tool: true`) shares that frame: markers from a tray, jumps drawn with a handle or the Jump by buttons, zoom by tapping the line, Nearest ten and Nearest hundred, and a line that stands up on a phone. Lessons keep the simpler number line. The Toolbox counters (`Manip.counters` with `tool: true`, named "Counters and ten-frames") replace the old separate Counters and Ten-frames tools: red and yellow counters from a tray, a free mat or 1 or 2 ten-frames, tap a counter to turn it over, and Pair up, Rows of ten and Share into 2 to 10 groups. Up to 100 counters. Lessons keep the simpler counters and ten-frames. The Toolbox number chart (`Manip.hundred` with `tool: true`, named "Number chart") shows 1 to 100, 101 to 200 or 0 to 99: colour squares with 3 pens, skip count by 2, 3, 4, 5, 10 or 25, tap two numbers to see a jump as tens down and ones across, and hide some numbers to find. Lessons keep the simpler hundred chart. The Toolbox fraction kit (`Manip.fractions` with `tool: true`, named "Fraction kit") holds one amount made of pieces (1 whole, 1/2 to 1/10, up to 3 wholes), tapped or dragged from a tray. "See it as" shows the same amount at once as strips under the whole, circles, a set of counters and a point on a number line. "Do" has Share (things shared by 2 to 10 people, the leftovers cut, one share put on the mat), Split (cut every piece into 2 to 5), Line up (up to 3 amounts to compare), Fill wholes (pack pieces into whole bars or break a whole into pieces) and Count on. Grades 1 and 2 read the amount in words (3 fourths), Grade 3 on in numbers (3/4). Grade 4 and up (stage 2) adds decimal pieces (0.1; 0.01 from Grade 5; 0.001 from Grade 6), a Grid window (10 by 10, with a hundredth zoomed into thousandths from Grade 6), a Symbols window (fraction, simplest form, tenths or hundredths, mixed number, decimal and, from Grade 5, percent), Split into 10, Count on to 10 and Groups of. Grade 5 adds twelfths, Join (simplify), Combine and take away, and Fit into (whole number divided by a fraction). Grade 6 adds Cut into same-size pieces (unlike denominators) and typed fractions, decimals or percents in Line up. To keep the screen calm, from Grade 4 the tray has Fractions and Decimals tabs, and from Grade 5 the Do row shows one set at a time: Explore (Share, Split, Join, Line up, Fill wholes, Count on) or Calculate (Combine, Groups of, Fit into). Pieces too thin to see clearly (hundredths, thousandths) open the Grid. Fractions are written stacked (numerator over denominator) everywhere in the kit except number line labels; a hidden slash keeps them readable as 3/4 to screen readers and the checks, and on a very full mat the piece labels go back to 3/4 so they fit. Stages 3 and 4 (the Grade 7 and 8 operations and a ratio window) come next. Lessons keep the simpler fraction strips.
5. `../assets/engine/lesson.js`: the one-idea-per-screen lessons (`Atlas.lessons`).
6. `gradeN/assets/gNkit.js`: small helpers for that grade's chapters (optional).
7. `gradeN/chapters/*.js`: one file per chapter. Each one calls `Atlas.register(id, chapter)`.

### Grade settings

Every grade runs the same app, so practice, the chapter quiz and the check-up work the same way in every grade. What differs is set in `gradeN/assets/grade.js` (the defaults are at the top of `assets/engine/site.js`):
- `grade`, `tools` (the Toolbox page) and `meta` (the chapter list: id, title, strand, expectation codes, description).
- `home`: the home page words (`hero`, `start`, `notes`), and for a grade with its own layout `intro`, `legend`, `contents` and `card` (Grade 1 numbers its chapter cards with small ten frames; Grade 8 uses its own card layout).
- Words and typing for younger children: `right` and `right2` (Grade 1 says "Yes, that is right."), and `input`: the keyboard (`numeric` in Grades 1 and 2), the box's placeholder, and `pad`, a big number pad under each answer box (Grade 1).
- `checkup`: the "How it works" list and the whole-grade check-ups. Grade 1 has a short one (10 questions, `#check-up/short`) and a longer one (`#check-up/all`); Grade 7 asks two questions from every chapter.
- Typed answers a grade reads its own way: `parseNum` (Grades 6 to 8 also accept a typed minus sign −; Grades 7 and 8 accept fractions and mixed numbers) and `judge` (Grade 7 can insist on lowest terms; Grade 8 compares very big and very small answers to 9 significant figures).
- Small drawing and number options: `svgScale` (Grade 1 draws pictures a little bigger), `svgLabelText`, `diskLabel` (Grade 4), `wholeDollars` (Grade 3 shows $5, not $5.00), `groupDecimals` (Grade 8 spaces long decimals: 0.333 333).
- `afterRoute`: runs after each page is drawn (Grade 7 draws pictures in as they scroll into view; Grade 8 fades sections in).

If a setting is needed by a second grade, use it there too; if a new behaviour is needed, add it to `assets/engine/site.js` (with a setting only when grades must differ), never to a grade file.

## A chapter

```
Atlas.register('numbers-1000', {
  lessons:  [ { id, title, concepts: [ { id, title, body, watch, try, key, mistake, check } ] } ],
  quiz:     [ fixed questions ],
  quizFresh: true,          // the chapter quiz is made fresh each time from the practice skills
  practice: [ { id, name, code: 'B1.1', gen: function (level) { return question; } } ]
});
```

- **Practice skills** make a new question every time, at level 1, 2 or 3. The site moves a child up a level after 3 right in a row, and down after 2 misses. Every fourth question reviews another skill of the chapter already started; "Mixed review" brings in skills from other chapters. A skill is **secure** after 3 right in a row at level 3 (in a full chapter: on two different days, see below).
- **Question shapes**: a skill can ask the same idea in several ways. `Atlas.Q.vary(skillId, level, [[minLevel, 'shape-name', fn], ...])` picks one, never the same shape twice in a row. See `QUESTIONS.md`.
- **Check-ups** use level 1 of every skill, then a few level-2 questions.
- **Idea cards**: each idea in a lesson shows as a small stack of cards, one at a time: "Watch" (or "Learn") with the explanation and clip, "Try it" with the key idea, then "Your turn". Back and Next move through the cards first, then to the other ideas. A part the idea doesn't have is left out. An idea with only one part shows as a single page.
- **Watch clips** (`Manip.player`) don't start on their own. The student taps Play, or steps one part at a time with ‹ and ›. The "Auto-play" switch on any clip turns auto-start on for every clip. It is saved in this browser as `atlas:autoplay`.
- **Full chapters**: a chapter with `full: true` adds a "Together" card (guided steps with prompts that fade), needs 4 right in "Your turn", shows a fix for known wrong answers, and brings ideas back in a warm-up on a schedule. See "Full chapters" in `QUESTIONS.md`.
- **Worked examples ("My turn")**: an idea can add `example` (the same shape as `watch`). It gets its own "My turn" card after the first card: one example solved step by step in "I" language ("My turn. First I..."), played like a Watch clip. It has no voice: Noel tried the device's built-in voice and found it too robotic.

## Math Plan

`plan/index.html` loads `vis.js` (pictures), `bank.js` (placement questions), `ladder.js` (every Ontario expectation, Grades 1 to 8, in the Ministry's wording), `blurbs.js` (one short plain-language line for each expectation), `families.js` (concept families), `engine.js` (placement and plan logic; the placement check asks at each grade until the answers clearly show secure or not yet, a sequential probability ratio test set by `E.P_SECURE`, `E.P_NOT` and `E.PLACE_ERR`, and `tests/run.js` replays it with pretend students) and `app.js` (the screens). The plain line is what children and parents see, for example on "Today's idea" and when a concept-map square is tapped. The Ministry wording is shown under "Ontario wording". When an expectation is added to `ladder.js`, add its line to `blurbs.js` too, or the checks fail.

`families.js` sorts every expectation into one **concept family**: one idea that grows across the grades, such as Fractions, Time or Budgets. Each expectation is in exactly one family, or the checks fail. The concept map uses the families for its "By idea" view (one row per family, Grades 1 to 8 across); tapping a family's name lists that idea in every grade with a link to each lesson. The same list is the set of sibling lessons to check when one lesson in the family is improved (see CLAUDE.md). When an expectation is added to `ladder.js`, add it to its family too.

## Saved progress

Progress is kept in the browser (`localStorage`, prefix `gNatlas:`, for example `g3atlas:sk:<skill id>` for a practice skill, `best:<chapter>` for the best quiz score, `checkups`, `cov`, `plan`, and `cn:<idea>` for lessons). The shared app saves exactly the keys and shapes each grade saved before it was shared; the checks load an older saved state in every grade to make sure it still shows. When a child is signed in, `assets/sync.js` copies it to Firebase so parents and tutors see it.

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
- Both placement checks are linked from the same places. A child takes them on their own sign-in; a grown-up sees the results. Home page: the Math and Language panels each go from "Start the placement check" to "Continue the check" to the plan or grade (`home.js`). Account menu, the student page (`family.js`) and the top of each Curriculum list: Math Plan (`plan/`) and Language placement (`language/placement/`). Grown-ups: each child's card and Progress and notes have **Math Plan** (`plan/?sid=`) and **Language placement** (`family.html#s/{id}/lplace`, which opens Progress and notes at the Language placement section; `placeLink()` in `langplace.js`).
- The Curriculum page reads `language/index.html` to see which Language grades are ready, then each `language/gradeN/grade.js` for its chapters. Keep `Atlas.setup({ grade, chapters: [{ id, title, sub, strand }] })` in that shape.
- Browser storage: Math grades use `gNatlas:` keys, Language grades `lang-gN:`. Both use `atlas:adult` for the grown-up view.

